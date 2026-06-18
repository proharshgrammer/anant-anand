'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import BlogForm from '@/components/admin/BlogForm';
import { createBlogPost } from '@/lib/supabase/queries/blog';
import type { BlogPost } from '@/types';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Partial<BlogPost>) => {
    setIsSubmitting(true);
    try {
      await createBlogPost(data);
      router.push('/admin/blog');
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
          <span className="text-gray-800 font-medium">New Post</span>
        </div>

        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900">New Blog Post</h1>
          <p className="text-gray-500 text-sm mt-1">
            Write and publish a new article for the travel blog.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <BlogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </main>
    </div>
  );
}
