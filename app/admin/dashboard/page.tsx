import { Metadata } from 'next';
import AdminNav from '@/components/admin/AdminNav';
import EnquiryTable from '@/components/admin/EnquiryTable';
import { createServerClient } from '@/lib/supabase/server';
import { Map, FileText, MessageSquare, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';
import type { Enquiry } from '@/types';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

interface StatCard {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  href: string;
}

async function getDashboardData() {
  const supabase = createServerClient();
  const [toursRes, blogRes, enquiriesRes, recentEnquiriesRes] = await Promise.all([
    supabase.from('tours').select('id, is_published'),
    supabase.from('blog_posts').select('id'),
    supabase.from('enquiries').select('id'),
    supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const toursData = toursRes.data ?? [];
  const totalTours = toursData.length;
  const publishedTours = toursData.filter((t) => (t as { is_published?: boolean }).is_published).length;
  const blogPosts = (blogRes.data ?? []).length;
  const totalEnquiries = (enquiriesRes.data ?? []).length;
  const recentEnquiries = (recentEnquiriesRes.data ?? []) as Enquiry[];

  return { totalTours, publishedTours, blogPosts, totalEnquiries, recentEnquiries };
}

export default async function DashboardPage() {
  let data = {
    totalTours: 0,
    publishedTours: 0,
    blogPosts: 0,
    totalEnquiries: 0,
    recentEnquiries: [] as Enquiry[],
  };

  try {
    data = await getDashboardData();
  } catch {
    // Graceful fallback when Supabase is not yet configured
  }

  const statCards: StatCard[] = [
    {
      label: 'Total Tours',
      value: data.totalTours,
      icon: Map,
      color: 'text-teal-700 bg-teal-50',
      href: '/admin/tours',
    },
    {
      label: 'Published Tours',
      value: data.publishedTours,
      icon: TrendingUp,
      color: 'text-green-700 bg-green-50',
      href: '/admin/tours',
    },
    {
      label: 'Blog Posts',
      value: data.blogPosts,
      icon: FileText,
      color: 'text-purple-700 bg-purple-50',
      href: '/admin/blog',
    },
    {
      label: 'Enquiries',
      value: data.totalEnquiries,
      icon: MessageSquare,
      color: 'text-saffron-600 bg-orange-50',
      href: '/admin/enquiries',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />

      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Welcome back! Here&apos;s what&apos;s happening.
              </p>
            </div>
            <Link
              href="/admin/tours/new"
              className="btn-primary text-sm"
              id="dashboard-add-tour"
            >
              <Plus className="w-4 h-4" />
              Add Tour
            </Link>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.label}
                  href={card.href}
                  className="card p-5 hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-display text-3xl font-bold text-gray-900">
                    {card.value}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{card.label}</div>
                </Link>
              );
            })}
          </div>

          {/* Recent Enquiries */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-gray-900">
                Recent Enquiries
              </h2>
              <Link
                href="/admin/enquiries"
                className="text-sm text-teal-700 hover:text-teal-900 font-medium"
              >
                View all →
              </Link>
            </div>
            <EnquiryTable enquiries={data.recentEnquiries} />
          </div>
        </div>
      </main>
    </div>
  );
}
