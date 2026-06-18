'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import BlogForm from '@/components/admin/BlogForm';
import { getBlogPostById, updateBlogPost } from '@/lib/supabase/queries/blog';
import type { BlogPost } from '@/types';

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadError, setLoadError] = useState('');

  const loadPost = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBlogPostById(id);
      setPost(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleSubmit = async (data: Partial<BlogPost>) => {
    setIsSubmitting(true);
    setSaved(false);
    try {
      await updateBlogPost(id, data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
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
          <Link href="/admin/blog" className="hover:text-teal-600 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Blog Posts
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Edit Post</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">
              {loading ? 'Loading…' : (post?.title ?? 'Edit Post')}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Update post content, SEO settings, and publishing status.
            </p>
          </div>
          {saved && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Saved successfully
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
          </div>
        ) : loadError ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {loadError}
          </div>
        ) : post ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <BlogForm
              initialData={post}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
}
