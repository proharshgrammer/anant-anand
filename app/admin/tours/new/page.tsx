'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import TourForm from '@/components/admin/TourForm';
import { createTour } from '@/lib/supabase/queries/tours';
import type { Tour } from '@/types';

export default function NewTourPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Partial<Tour>) => {
    setIsSubmitting(true);
    try {
      await createTour(data);
      router.push('/admin/tours');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />

      <main className="flex-1 p-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/admin/tours" className="hover:text-teal-600 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Tours
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">New Tour</span>
        </div>

        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900">Create New Tour</h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the tour details, itinerary waypoints, and SEO settings.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <TourForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </main>
    </div>
  );
}
