import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import {
  getBlogPostBySlug,
  getPublishedToursByIds,
} from '@/lib/supabase/queries/blog-public';
import { formatDate } from '@/lib/utils';
import BlogTableOfContents from '@/components/blog/BlogTableOfContents';
import CopyLinkButton from '@/components/blog/CopyLinkButton';
import TourCard from '@/components/tours/TourCard';
import { Calendar, Clock, MessageCircle, Share2 } from 'lucide-react';

// ISR — revalidate every hour
export const revalidate = 3600;

// ── Helpers ────────────────────────────────────────────────

interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Parse H2 and H3 tags from HTML content string and extract headings for TOC.
 */
function extractHeadings(html: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const regex = /<h([23])(?:\s[^>]*)?>(.*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10) as 2 | 3;
    let text = match[2].replace(/<[^>]*>/g, '').trim();
    // Limit text length
    if (text.length > 100) text = text.slice(0, 97) + '...';

    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    headings.push({ id: id || `heading-${level}-${headings.length}`, text, level });
  }

  return headings;
}

// ── Metadata generation ────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createServerClient();
  const post = await getBlogPostBySlug(supabase, params.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.og_title || post.meta_title || post.title,
      description:
        post.og_description || post.meta_description || post.excerpt || undefined,
      images: post.og_image
        ? [post.og_image]
        : post.featured_image
          ? [post.featured_image]
          : [],
      type: 'article',
      publishedTime: post.published_at || undefined,
    },
    ...(post.canonical_url
      ? { alternates: { canonical: post.canonical_url } }
      : {}),
  };
}

// ── Page component ─────────────────────────────────────────

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServerClient();
  const post = await getBlogPostBySlug(supabase, params.slug);

  if (!post) {
    notFound();
  }

  // Fetch related tours
  let relatedTours = null;
  if (post.related_tour_ids && post.related_tour_ids.length > 0) {
    relatedTours = await getPublishedToursByIds(supabase, post.related_tour_ids);
  }

  // Parse content headings for TOC
  const headings: TocHeading[] = post.content
    ? extractHeadings(post.content)
    : [];

  // Build share URLs
  const fullUrl = `https://anantanandtourpackages.in/blog/${post.slug}`;
  const shareTitle = encodeURIComponent(post.title);

  const heroImage =
    post.featured_image ||
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80';

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.meta_description || undefined,
    image: post.featured_image || post.og_image || undefined,
    datePublished: post.published_at || undefined,
    author: {
      '@type': 'Person',
      name: post.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Anant Anand Tour Packages',
    },
  };

  return (
    <>
      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gray-50 pt-16">
        {/* ── Hero Section ──────────────────────────────── */}
        <section className="relative h-[50vh] min-h-[320px] max-h-[500px] overflow-hidden">
          <img
            src={heroImage}
            alt={post.featured_image_alt || post.title}
            width={1200}
            height={500}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-10 max-w-7xl mx-auto">
            {post.category && (
              <span className="inline-block bg-white/90 backdrop-blur-sm text-saffron-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm capitalize mb-3">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-display leading-tight mb-3">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-saffron-400" />
                  {formatDate(post.published_at)}
                </span>
              )}
              {post.read_time_minutes != null && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-saffron-400" />
                  {post.read_time_minutes} min read
                </span>
              )}
              {post.author_name && (
                <span>{post.author_name}</span>
              )}
            </div>
          </div>
        </section>

        {/* ── Content Grid ──────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content (left 2/3) */}
            <div className="lg:col-span-2">
              {/* Rendered HTML content */}
              {post.content && (
                <article
                  className="prose prose-lg max-w-none prose-headings:scroll-mt-24"
                  dangerouslySetInnerHTML={{
                    __html: post.content,
                  }}
                />
              )}

              {/* Mobile TOC (hidden on lg+) */}
              {headings.length > 0 && (
                <div className="lg:hidden">
                  <BlogTableOfContents headings={headings} />
                </div>
              )}

              {/* ── Social Share Section ─────────────────── */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-display mb-4 flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-saffron-500" />
                  Share This Post
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${shareTitle}%20${encodeURIComponent(fullUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
                    aria-label="Share on WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">WhatsApp</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
                    aria-label="Share on Facebook"
                  >
                    <span className="text-blue-600 font-bold text-sm">f</span>
                    <span className="text-gray-700">Facebook</span>
                  </a>

                  {/* Copy link */}
                  <CopyLinkButton />
                </div>
              </div>
            </div>

            {/* Right sidebar (1/3) — Desktop TOC */}
            <aside className="hidden lg:block">
              {headings.length > 0 && (
                <BlogTableOfContents headings={headings} />
              )}
            </aside>
          </div>
        </div>

        {/* ── Related Tours Section ───────────────────── */}
        {relatedTours && relatedTours.length > 0 && (
          <section className="bg-white border-t border-gray-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-semibold text-gray-900 font-display mb-8">
                Related Tour Packages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
