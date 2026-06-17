'use client';

import { useState } from 'react';
import { formatDate, formatRelativeDate } from '@/lib/utils';
import type { Enquiry, EnquiryStatus } from '@/types';
import {
  ChevronUp,
  ChevronDown,
  Phone,
  Mail,
  MessageCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<EnquiryStatus, { label: string; class: string }> = {
  new: { label: 'New', class: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Contacted', class: 'bg-yellow-100 text-yellow-700' },
  follow_up: { label: 'Follow Up', class: 'bg-orange-100 text-orange-700' },
  converted: { label: 'Converted', class: 'bg-green-100 text-green-700' },
  closed: { label: 'Closed', class: 'bg-gray-100 text-gray-600' },
};

type SortKey = 'created_at' | 'name' | 'status';

interface EnquiryTableProps {
  enquiries: Enquiry[];
}

export default function EnquiryTable({ enquiries }: EnquiryTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...enquiries].sort((a, b) => {
    let valA = a[sortKey] ?? '';
    let valB = b[sortKey] ?? '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-30" />;
    return sortDir === 'asc' ? (
      <ChevronUp className="w-3 h-3 text-teal-600" />
    ) : (
      <ChevronDown className="w-3 h-3 text-teal-600" />
    );
  };

  if (enquiries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No enquiries yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:text-teal-700 select-none"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-1">
                Name <SortIcon col="name" />
              </div>
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">
              Contact
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">
              Tour / Interest
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:text-teal-700 select-none"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-1">
                Status <SortIcon col="status" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:text-teal-700 select-none"
              onClick={() => handleSort('created_at')}
            >
              <div className="flex items-center gap-1">
                Received <SortIcon col="created_at" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sorted.map((enquiry) => {
            const statusCfg = STATUS_CONFIG[enquiry.status] ?? STATUS_CONFIG.new;
            return (
              <tr key={enquiry.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {enquiry.name}
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <a
                      href={`tel:${enquiry.phone}`}
                      className="flex items-center gap-1.5 text-teal-700 hover:text-teal-900 text-xs"
                    >
                      <Phone className="w-3 h-3" />
                      {enquiry.phone}
                    </a>
                    {enquiry.email && (
                      <a
                        href={`mailto:${enquiry.email}`}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-xs"
                      >
                        <Mail className="w-3 h-3" />
                        {enquiry.email}
                      </a>
                    )}
                    {enquiry.whatsapp_opt_in && (
                      <span className="flex items-center gap-1 text-green-600 text-xs">
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp OK
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {enquiry.tour_name ? (
                    <span className="text-teal-700 font-medium">
                      {enquiry.tour_name}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic text-xs">General</span>
                  )}
                  {enquiry.group_size && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      {enquiry.group_size} pax
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                      statusCfg.class
                    )}
                  >
                    {statusCfg.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span
                      title={formatDate(enquiry.created_at)}
                      className="cursor-help"
                    >
                      {formatRelativeDate(enquiry.created_at)}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
