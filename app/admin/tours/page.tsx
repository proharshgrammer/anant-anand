'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import { getTours, deleteTour, toggleTourPublish, updateTour } from '@/lib/supabase/queries/tours';
import type { Tour } from '@/types';

type TourListing = Pick<
  Tour,
  'id' | 'title' | 'slug' | 'category' | 'duration_days' | 'price_per_person' | 'is_featured' | 'is_published' | 'created_at'
>;

const CATEGORY_LABELS: Record<string, string> = {
  spiritual: '🙏 Spiritual',
  trek: '🏔️ Trek',
  hill_station: '🌿 Hill Station',
  heritage: '🏛️ Heritage',
  beach: '🏖️ Beach',
  wildlife: '🐅 Wildlife',
};

export default function ToursAdminPage() {
  const [tours, setTours] = useState<TourListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTours = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTours();
      setTours(data);
    } catch (err) {
      console.error('Failed to load tours:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTours();
  }, [loadTours]);

  const handleTogglePublish = async (tour: TourListing) => {
    try {
      await toggleTourPublish(tour.id, !tour.is_published);
      loadTours();
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const handleToggleFeatured = async (tour: TourListing) => {
    try {
      await updateTour(tour.id, { is_featured: !tour.is_featured });
      loadTours();
    } catch (err) {
      console.error('Featured toggle failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteTour(id);
      setDeleteConfirm(null);
      loadTours();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Tours</h1>
            <p className="text-gray-500 text-sm mt-1">
              {tours.length} tour{tours.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Link href="/admin/tours/new" className="btn-primary" id="add-tour-btn">
            <Plus className="w-4 h-4" />
            Add New Tour
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No tours yet</p>
              <p className="text-sm text-gray-400 mt-1">Create your first tour package.</p>
              <Link href="/admin/tours/new" className="btn-primary mt-4 inline-flex">
                <Plus className="w-4 h-4" />
                Add New Tour
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Featured</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tours.map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                      {/* Title */}
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 line-clamp-1">{tour.title}</p>
                        <p className="text-xs text-gray-400 font-mono">{tour.slug}</p>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-medium">
                          {CATEGORY_LABELS[tour.category] ?? tour.category}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-3 text-gray-600">
                        {tour.duration_days}D
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        ₹{tour.price_per_person.toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleTogglePublish(tour)}
                          aria-label={tour.is_published ? 'Unpublish' : 'Publish'}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            tour.is_published
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {tour.is_published ? (
                            <><Eye className="w-3 h-3" /> Published</>
                          ) : (
                            <><EyeOff className="w-3 h-3" /> Draft</>
                          )}
                        </button>
                      </td>

                      {/* Featured */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleFeatured(tour)}
                          aria-label={tour.is_featured ? 'Unfeature' : 'Feature'}
                          className={`transition-colors ${
                            tour.is_featured
                              ? 'text-yellow-400 hover:text-yellow-600'
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                        >
                          <Star className="w-5 h-5" fill={tour.is_featured ? 'currentColor' : 'none'} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/tours/${tour.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            aria-label="Edit tour"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(tour.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete tour"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Tour?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The tour and all its data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
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
