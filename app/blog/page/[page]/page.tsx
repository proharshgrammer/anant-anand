import type { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import { getPublishedBlogPosts } from '@/lib/supabase/queries/blog-public';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';
import { FileText } from 'lucide-react';

// ISR — revalidate every hour
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { page: string };
}): Promise<Metadata> {
  const pageNum = Math.max(1, parseInt(params.page, 10) || 1);

  return {
    title: `Our Blog — Page ${pageNum}`,
    description:
      'Travel stories, tips, and destination guides from Anant Anand Tour Packages.',
    ...(pageNum === 1
      ? { alternates: { canonical: '/blog' } }
      : {}),
  };
}

export default async function BlogPagePage({
  params,
}: {
  params: { page: string };
}) {
  const supabase = createServerClient();
  const pageNum = Math.max(1, parseInt(params.page, 10) || 1);

  const { posts, total } = await getPublishedBlogPosts(supabase, {
    page: pageNum,
    limit: 10,
  });

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
              Our Blog
            </h1>
            <p className="text-gray-500 text-lg">
              Page {pageNum} of {totalPages || 1}
            </p>
          </div>
        </div>

        {/* Blog card grid or empty state */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <BlogPagination
                currentPage={pageNum}
                totalPages={totalPages}
                basePath="/blog"
              />
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 bg-saffron-50 text-saffron-600 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
              No More Posts to Show
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              You&apos;ve reached the end of our published articles. Check back
              soon for new travel stories and destination guides.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
