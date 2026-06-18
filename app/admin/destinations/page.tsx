'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Star, MapPin, Loader2 } from 'lucide-react';
import Image from 'next/image';
import AdminNav from '@/components/admin/AdminNav';
import DestinationForm from '@/components/admin/DestinationForm';
import {
  getDestinations,
  deleteDestination,
  updateDestination,
} from '@/lib/supabase/queries/destinations';
import type { Destination } from '@/types';

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Destination | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadDestinations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDestinations();
      setDestinations(data);
    } catch (err) {
      console.error('Failed to load destinations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  const handleEdit = (dest: Destination) => {
    setEditTarget(dest);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditTarget(null);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditTarget(null);
    loadDestinations();
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteDestination(id);
      setDeleteConfirm(null);
      loadDestinations();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleFeatured = async (dest: Destination) => {
    try {
      await updateDestination(dest.id, { is_featured: !dest.is_featured });
      loadDestinations();
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Destinations</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage destinations shown on the public website
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="btn-primary"
            id="add-destination-btn"
          >
            <Plus className="w-4 h-4" />
            Add Destination
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No destinations yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Add your first destination to feature it on the website.
              </p>
              <button onClick={handleAdd} className="btn-primary mt-4">
                <Plus className="w-4 h-4" />
                Add Destination
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Destination
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Region
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Featured
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Added
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {destinations.map((dest) => (
                    <tr key={dest.id} className="hover:bg-gray-50 transition-colors">
                      {/* Name + thumbnail */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {dest.image ? (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <Image
                                src={dest.image}
                                alt={dest.image_alt ?? dest.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-4 h-4 text-teal-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{dest.name}</p>
                            <p className="text-xs text-gray-400 font-mono">{dest.slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* Region */}
                      <td className="px-4 py-3 text-gray-600">
                        {dest.region ?? <span className="text-gray-300">—</span>}
                      </td>

                      {/* Featured toggle */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleFeatured(dest)}
                          aria-label={dest.is_featured ? 'Unfeature' : 'Feature'}
                          className={`transition-colors ${
                            dest.is_featured
                              ? 'text-yellow-400 hover:text-yellow-600'
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                        >
                          <Star
                            className="w-5 h-5"
                            fill={dest.is_featured ? 'currentColor' : 'none'}
                          />
                        </button>
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(dest.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(dest)}
                            className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            aria-label="Edit destination"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(dest.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete destination"
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

      {/* Add/Edit Form Modal */}
      {showForm && (
        <DestinationForm
          initialData={editTarget ?? undefined}
          onClose={handleClose}
          onSaved={handleSaved}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Destination?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The destination will be permanently removed.
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
