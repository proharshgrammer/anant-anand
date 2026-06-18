'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import { getBlogPosts, deleteBlogPost, updateBlogPost } from '@/lib/supabase/queries/blog';
import type { BlogPost } from '@/types';

type BlogListing = Pick<BlogPost, 'id' | 'title' | 'slug' | 'status' | 'category' | 'published_at' | 'author_name' | 'created_at'>;

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  scheduled: 'bg-blue-100 text-blue-700',
  published: 'bg-green-100 text-green-700',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  published: 'Published',
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBlogPosts();
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleTogglePublish = async (post: BlogListing) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await updateBlogPost(post.id, {
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null,
      });
      loadPosts();
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteBlogPost(id);
      setDeleteConfirm(null);
      loadPosts();
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
            <h1 className="font-display text-2xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-500 text-sm mt-1">
              {posts.length} post{posts.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Link href="/admin/blog/new" className="btn-primary" id="add-post-btn">
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No blog posts yet</p>
              <p className="text-sm text-gray-400 mt-1">Write your first article to attract organic traffic.</p>
              <Link href="/admin/blog/new" className="btn-primary mt-4 inline-flex">
                <Plus className="w-4 h-4" />
                New Post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Author</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Published</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      {/* Title */}
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                        <p className="text-xs text-gray-400 font-mono">{post.slug}</p>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 text-gray-600">
                        {post.category ?? <span className="text-gray-300">—</span>}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleTogglePublish(post)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${STATUS_STYLES[post.status]} hover:opacity-80`}
                        >
                          {post.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {STATUS_LABELS[post.status]}
                        </button>
                      </td>

                      {/* Author */}
                      <td className="px-4 py-3 text-gray-600">{post.author_name}</td>

                      {/* Published At */}
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })
                          : <span className="text-gray-300">—</span>}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/blog/${post.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            aria-label="Edit post"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(post.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete post"
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
            <h3 className="font-semibold text-gray-900 mb-2">Delete Post?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The blog post will be permanently deleted.
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
