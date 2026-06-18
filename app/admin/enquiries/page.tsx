'use client';

import { useCallback, useEffect, useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, Download, Loader2, Trash2 } from 'lucide-react';
import AdminNav from '@/components/admin/AdminNav';
import {
  getEnquiries,
  updateEnquiryStatus,
  updateEnquiryNotes,
  deleteEnquiry,
} from '@/lib/supabase/queries/enquiries';
import type { Enquiry, EnquiryStatus } from '@/types';

const STATUS_OPTIONS: { value: EnquiryStatus; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'follow_up', label: 'Follow Up', color: 'bg-orange-100 text-orange-700' },
  { value: 'converted', label: 'Converted', color: 'bg-green-100 text-green-700' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-600' },
];

const ROW_COLORS: Record<EnquiryStatus, string> = {
  new: 'bg-blue-50/50',
  contacted: 'bg-yellow-50/50',
  follow_up: 'bg-orange-50/50',
  converted: 'bg-green-50/50',
  closed: 'bg-gray-50/50',
};

const PAGE_SIZE = 20;

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function exportToCSV(enquiries: Enquiry[]) {
  const headers = ['Name', 'Phone', 'Email', 'Tour Interest', 'Travel Date', 'Group Size', 'WhatsApp', 'Status', 'Received'];
  const rows = enquiries.map((e) => [
    e.name,
    e.phone,
    e.email ?? '',
    e.tour_name ?? '',
    e.travel_date ?? '',
    String(e.group_size ?? ''),
    e.whatsapp_opt_in ? 'Yes' : 'No',
    e.status,
    new Date(e.created_at).toLocaleDateString('en-IN'),
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteValues, setNoteValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEnquiries({ status: statusFilter === 'all' ? undefined : statusFilter });
      setEnquiries(data);
      // Initialize note values
      const notes: Record<string, string> = {};
      data.forEach((e) => { notes[e.id] = e.notes ?? ''; });
      setNoteValues(notes);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadEnquiries();
    setPage(0);
  }, [loadEnquiries]);

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    try {
      await updateEnquiryStatus(id, status);
      loadEnquiries();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleNoteBlur = async (id: string) => {
    try {
      await updateEnquiryNotes(id, noteValues[id] ?? '');
    } catch (err) {
      console.error('Note save failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteEnquiry(id);
      setDeleteConfirm(null);
      loadEnquiries();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  const paginated = enquiries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(enquiries.length / PAGE_SIZE);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Enquiries</h1>
            <p className="text-gray-500 text-sm mt-1">
              {enquiries.length} enquir{enquiries.length !== 1 ? 'ies' : 'y'}
              {statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}
            </p>
          </div>
          <button
            onClick={() => exportToCSV(enquiries)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            id="export-enquiries-btn"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['all', 'new', 'contacted', 'follow_up', 'converted', 'closed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-teal-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:border-teal-400'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                {statusFilter === 'all' ? 'No enquiries yet' : `No ${statusFilter} enquiries`}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-8"></th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tour Interest</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Travel Date</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Group</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Received</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((enq) => {
                      const expanded = expandedId === enq.id;
                      return (
                        <>
                          <tr
                            key={enq.id}
                            className={`transition-colors cursor-pointer ${ROW_COLORS[enq.status]} hover:brightness-95`}
                            onClick={() => setExpandedId(expanded ? null : enq.id)}
                          >
                            {/* Expand toggle */}
                            <td className="px-4 py-3 text-gray-400">
                              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </td>

                            {/* Name */}
                            <td className="px-4 py-3 font-medium text-gray-900">{enq.name}</td>

                            {/* Contact */}
                            <td className="px-4 py-3">
                              <p className="text-gray-700">{enq.phone}</p>
                              {enq.email && <p className="text-xs text-gray-400">{enq.email}</p>}
                              {enq.whatsapp_opt_in && (
                                <span className="text-xs text-green-600">✓ WhatsApp</span>
                              )}
                            </td>

                            {/* Tour Interest */}
                            <td className="px-4 py-3 text-gray-600">
                              {enq.tour_name ?? <span className="text-gray-300">—</span>}
                            </td>

                            {/* Travel Date */}
                            <td className="px-4 py-3 text-gray-600 text-xs">
                              {enq.travel_date
                                ? new Date(enq.travel_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                                : <span className="text-gray-300">—</span>}
                            </td>

                            {/* Group Size */}
                            <td className="px-4 py-3 text-center text-gray-600">
                              {enq.group_size ?? <span className="text-gray-300">—</span>}
                            </td>

                            {/* Status dropdown */}
                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={enq.status}
                                onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                                className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                  STATUS_OPTIONS.find((s) => s.value === enq.status)?.color ?? ''
                                }`}
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                              </select>
                            </td>

                            {/* Received */}
                            <td className="px-4 py-3 text-gray-400 text-xs" title={new Date(enq.created_at).toLocaleString('en-IN')}>
                              {formatRelativeTime(enq.created_at)}
                            </td>

                            {/* Delete */}
                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-end">
                                <button
                                  onClick={() => setDeleteConfirm(enq.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  aria-label="Delete enquiry"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded row: full message + notes */}
                          {expanded && (
                            <tr key={`${enq.id}-expanded`} className="bg-gray-50">
                              <td colSpan={9} className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {enq.message && (
                                    <div>
                                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Message</p>
                                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{enq.message}</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Internal Notes</p>
                                    <textarea
                                      value={noteValues[enq.id] ?? ''}
                                      onChange={(e) => setNoteValues((prev) => ({ ...prev, [enq.id]: e.target.value }))}
                                      onBlur={() => handleNoteBlur(enq.id)}
                                      rows={3}
                                      placeholder="Add internal notes about this enquiry…"
                                      className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Auto-saves when you click away</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, enquiries.length)} of {enquiries.length}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page === totalPages - 1}
                      className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Enquiry?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-700"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
