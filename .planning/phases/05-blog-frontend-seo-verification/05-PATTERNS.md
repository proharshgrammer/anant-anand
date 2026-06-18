# Phase 5: Blog Frontend, SEO & Verification — Pattern Map

**Mapped:** 2026-06-19
**Files analyzed:** 19 new files + 3 modified files
**Analogs found:** 16 / 19

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `app/blog/page.tsx` | route/page | CRUD (paginated read) | `app/tours/[slug]/page.tsx` | role-match |
| `app/blog/page/[page]/page.tsx` | route/page | CRUD (paginated read) | `app/tours/[slug]/page.tsx` | role-match |
| `app/blog/category/[slug]/page.tsx` | route/page | CRUD (filtered read) | `app/tours/[slug]/page.tsx` | role-match |
| `app/blog/category/[slug]/page/[page]/page.tsx` | route/page | CRUD (filtered + paginated) | `app/tours/[slug]/page.tsx` | role-match |
| `app/blog/[slug]/page.tsx` | route/page | CRUD (single read) | `app/tours/[slug]/page.tsx` | **exact** |
| `app/contact/page.tsx` | route/page | static + request-response | `app/destinations/page.tsx` | role-match |
| `app/about/page.tsx` | route/page | static | `app/destinations/page.tsx` | **exact** |
| `app/privacy/page.tsx` | route/page | static | `app/destinations/page.tsx` | **exact** |
| `app/terms/page.tsx` | route/page | static | `app/destinations/page.tsx` | **exact** |
| `components/blog/BlogCard.tsx` | component | display (card) | `components/tours/TourCard.tsx` | **exact** |
| `components/blog/BlogPagination.tsx` | component (client) | request-response | — | no analog |
| `components/blog/BlogTableOfContents.tsx` | component (client) | event-driven | — | no analog |
| `lib/supabase/queries/blog-public.ts` | service/query | CRUD (read) | `lib/supabase/queries/tours.ts` | role-match |
| `next-sitemap.config.js` | config | build-time | — | no analog |
| `app/lib/json-ld.ts` (utility, optional) | utility | data transform | — | no analog |
| `tailwind.config.ts` (modified) | config | build-time | — | n/a (modification) |
| `package.json` (modified) | config | build-time | — | n/a (modification) |
| `components/public/Footer.tsx` (modified) | component | static | — | n/a (modification) |

---

## Pattern Assignments

### `app/blog/[slug]/page.tsx` (route/page, CRUD single read)

**Analog:** `app/tours/[slug]/page.tsx` — **best match.** Same role (detail page), same data flow (slug-based single record from Supabase), same SEO pattern (generateMetadata), same ISR concern.

**Imports pattern** (lines 1-8):
```typescript
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import { getTourBySlug } from '@/lib/supabase/queries/tours';
```

Blog detail will replace `getTourBySlug` with `getBlogPostBySlug` from the new public blog queries.

**`force-dynamic` vs ISR decision** (line 8):
```typescript
// Force dynamic rendering — page reads Supabase cookies for session
export const dynamic = 'force-dynamic';
```
→ Blog does NOT need auth cookies, so replace with `export const revalidate = 3600;` (ISR pattern). Analog for ISR comes from the tour list pattern... actually, the tour detail uses `force-dynamic`. Blog detail should be different. The CONTEXT.md says "Server component with ISR — follow tour detail pattern" but tour detail uses `force-dynamic`. The correct pattern for blog ISR is to use `revalidate` instead.

**`generateMetadata` pattern** (lines 47-68):
```typescript
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createServerClient();
  const tour = await getTourBySlug(supabase, params.slug);

  if (!tour) {
    return { title: 'Tour Not Found' };
  }

  return {
    title: tour.meta_title || tour.title,
    description: tour.meta_description || tour.short_description || undefined,
    openGraph: {
      title: tour.meta_title || tour.title,
      description: tour.meta_description || tour.short_description || undefined,
      images: tour.og_image ? [tour.og_image] : tour.hero_image ? [tour.hero_image] : [],
    },
  };
}
```
→ Blog detail will use `post.meta_title`, `post.meta_description`, `post.og_image`, `post.featured_image` as fallback. Also add `article` type in OpenGraph, and category/tags.

**Not found pattern** (lines 93-95):
```typescript
if (!tour) {
  notFound();
}
```

**Page component structure** (lines 85-89, 101-376):
```typescript
export default async function TourDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServerClient();
  const tour = await getTourBySlug(supabase, params.slug);
  // ...
  return (
    <main className="min-h-screen bg-[#f0fdfa] pt-16">
      {/* Content */}
    </main>
  );
}
```

**Category badge render pattern** (lines 116-124):
```tsx
<span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
  {categoryLabel}
</span>
```

---

### `app/blog/page.tsx` (route/page, CRUD paginated read)

**Analog:** `app/tours/[slug]/page.tsx` (for server component + supabase + metadata pattern) but also partially `app/tours/page.tsx` (for layout). Both are partial matches — combine the server component data-fetching from tour detail with the listing layout from tours page.

**Server component + Supabase pattern** (from `app/tours/[slug]/page.tsx` lines 1-5, 47-68, 85-95):
```typescript
import type { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import { getPublicTours } from '@/lib/supabase/queries/tours';

// ISR — revalidate every hour
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Our Blog | Anant Anand',
    description: 'Travel stories, tips, and destination guides.',
  };
}

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams?: { page?: string; category?: string };
}) {
  const supabase = createServerClient();
  const page = parseInt(searchParams?.page || '1', 10);
  const category = searchParams?.category;
  // ... fetch posts with pagination ...
}
```

**Metadata pattern** (from `app/destinations/page.tsx` lines 4-7) for static metadata:
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Top Destinations in India | Anant Anand',
  description: 'Explore the top spiritual and scenic destinations in India.',
};
```
→ Blog listing uses `generateMetadata` function (not exported const) to support dynamic title, or use const metadata for static title.

**Page layout pattern** (from `app/tours/page.tsx` lines 52-106):
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-gray-100">
    <div>
      <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Our Blog</h1>
      <p className="text-gray-500 text-lg">Travel stories, tips, and inspiration.</p>
    </div>
  </div>
  {/* Grid of BlogCards */}
</div>
```

**Empty state pattern** (from `components/tours/ToursList.tsx` lines 28-40):
```tsx
<div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
  <div className="w-16 h-16 bg-saffron-50 text-saffron-600 rounded-full flex items-center justify-center mb-4">
    <Map className="w-8 h-8" />
  </div>
  <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">No Blog Posts Yet</h3>
  <p className="text-gray-500 max-w-md mx-auto">
    We're working on sharing our latest travel stories...
  </p>
</div>
```

---

### `app/blog/page/[page]/page.tsx` (route/page, CRUD paginated read)

**Analog:** Same as `app/blog/page.tsx` pattern, but with a `params` prop for the page number.

**Dynamic param pattern** (from `app/tours/[slug]/page.tsx` lines 85-89):
```typescript
export default async function BlogPagePage({
  params,
}: {
  params: { page: string };
}) {
  const pageNum = parseInt(params.page, 10);
  // ... same as blog listing but with pageNum ...
}
```

**Canonical URL pattern:** For page 1, canonical to `/blog`. For other pages, canonical to self.

---

### `app/blog/category/[slug]/page.tsx` (route/page, CRUD filtered read)

**Analog:** Same pattern as `app/blog/page.tsx` with `params.slug` for category filter.

**Dynamic param + category filter:**
```typescript
export default async function BlogCategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServerClient();
  const posts = await getPublishedBlogPosts(supabase, { category: params.slug, page: 1, limit: 10 });
  // ...
}
```

---

### `app/blog/category/[slug]/page/[page]/page.tsx` (route/page, CRUD filtered + paginated)

**Analog:** Combination of category and pagination patterns above.

---

### `app/contact/page.tsx` (route/page, static + request-response)

**Analog:** `app/destinations/page.tsx` + `components/public/EnquiryForm.tsx` integration pattern.

**Static server component pattern** (from `app/destinations/page.tsx` lines 1-8, 55-60):
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get in Touch | Anant Anand',
  description: 'Contact Anant Anand Tour Packages. Call, message, or visit us.',
};
```

**EnquiryForm reuse pattern** (from `components/public/EnquiryForm.tsx` — it's already designed to accept props):
```tsx
<EnquiryForm sourcePage="/contact" />
```

**Page layout** (from `app/destinations/page.tsx` lines 57-59):
```tsx
<div className="min-h-screen bg-gray-50 pt-16 pb-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    ...
  </div>
</div>
```

---

### `app/about/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx` (route/page, static)

**Analog:** `app/destinations/page.tsx` — **exact match.** These are simple static server components with static metadata and prose content.

**Privacy/Terms noindex pattern** — add to metadata:
```typescript
export const metadata: Metadata = {
  title: 'Privacy Policy | Anant Anand',
  description: '...',
  robots: {
    index: false,
    follow: true,
  },
};
```

**Prose content pattern:**
```tsx
<article className="prose prose-lg max-w-none mx-auto">
  <p>Content here...</p>
</article>
```
→ Requires `@tailwindcss/typography` plugin.

---

### `components/blog/BlogCard.tsx` (component, display/card)

**Analog:** `components/tours/TourCard.tsx` — **exact match.** Same role (card component in a grid), same display pattern (image, title, metadata, CTA link).

**Imports pattern** (lines 1-3):
```typescript
import Link from 'next/link';
import { Clock, Calendar } from 'lucide-react';
import type { BlogPost } from '@/types';
```

**Card wrapper pattern** (lines 18-20 from TourCard):
```tsx
<div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full group">
```

**Image + badge overlay pattern** (lines 21-29 from TourCard):
```tsx
<div className="relative h-48 overflow-hidden">
  <img 
    src={post.featured_image || fallback}
    alt={post.featured_image_alt || post.title}
    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
  />
  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-royal-800 shadow-sm capitalize">
    {post.category}
  </div>
</div>
```

**Content area + title pattern** (lines 31-49 from TourCard):
```tsx
<div className="p-6 flex-grow flex flex-col">
  <h3 className="text-xl font-bold text-gray-900 mb-2 font-display line-clamp-2">
    <Link href={`/blog/${post.slug}`} className="hover:text-saffron-600 transition-colors">
      {post.title}
    </Link>
  </h3>
  
  <p className="text-gray-600 text-base leading-relaxed line-clamp-3 mt-2 mb-4">
    {post.excerpt}
  </p>

  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6 mt-auto">
    <div className="flex items-center">
      <Calendar className="h-4 w-4 mr-1 text-saffron-500" />
      {formatDate(post.published_at)}
    </div>
    <span>{post.author_name}</span>
  </div>
</div>
```

**CTA pattern** (lines 67-72 from TourCard):
```tsx
<Link 
  href={`/blog/${post.slug}`}
  className="text-royal-600 font-semibold hover:text-royal-800 transition-colors"
>
  Read More →
</Link>
```

**Interface pattern** (lines 13-15 from TourCard):
```typescript
interface BlogCardProps {
  post: BlogPost;
}
```

---

### `components/blog/BlogPagination.tsx` (component/client, request-response)

**Analog:** No direct analog in codebase. Must be built from scratch. Pattern will follow the UI-SPEC visual contract.

**Client component pattern** (from `components/public/EnquiryForm.tsx` lines 1-12):
```typescript
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
```

**Props pattern:**
```typescript
interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  categorySlug?: string;
}
```

**Router navigation pattern** (from `hooks/useFilterUrlSync.ts` line 69):
```typescript
const router = useRouter();
router.push(`${basePath}/page/${n}`);
```

---

### `components/blog/BlogTableOfContents.tsx` (component/client, event-driven)

**Analog:** No direct analog in codebase for TOC + scroll tracking.

**Client component + Intersection Observer pattern:**
```typescript
'use client';

import { useState, useEffect } from 'react';
```

**Intersection Observer for scroll tracking:**
```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    },
    { rootMargin: '-100px 0px -80% 0px' }
  );
  
  headings.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
  
  return () => observer.disconnect();
}, [headings]);
```

---

### `lib/supabase/queries/blog-public.ts` (service/query, CRUD read)

**Analog:** `lib/supabase/queries/tours.ts` — role-match. Both are public read queries returning typed data from Supabase.

**Import pattern** (from `tours.ts` lines 1-2):
```typescript
import { createServerClient } from '@/lib/supabase/server';
import type { BlogPost } from '@/types';
```

**getTourBySlug → getBlogPostBySlug pattern** (lines 111-125):
```typescript
export async function getBlogPostBySlug(
  supabase: any,
  slug: string
): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return null;
  return data as unknown as BlogPost;
}
```

**getPublicTours → getPublishedBlogPosts pattern** (lines 47-90):
```typescript
export async function getPublishedBlogPosts(
  supabase: any,
  options?: {
    category?: string;
    page?: number;
    limit?: number;
  }
): Promise<{ posts: BlogPost[]; total: number }> {
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const offset = (page - 1) * limit;

  let countQuery = supabase
    .from('blog_posts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');

  let dataQuery = supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (options?.category) {
    countQuery = countQuery.eq('category', options.category);
    dataQuery = dataQuery.eq('category', options.category);
  }

  const { data, error } = await dataQuery;
  const { count } = await countQuery;

  if (error) throw new Error(error.message);
  return { posts: data as unknown as BlogPost[], total: count ?? 0 };
}
```

---

### `next-sitemap.config.js` (config, build-time)

**Analog:** No analog in codebase. Pattern based on PRD/blueprint docs.

**Pattern to follow:**
```javascript
// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://anantanandtourpackages.in',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/privacy', '/terms'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin' },
    ],
  },
};
```

→ Add `"postbuild": "next-sitemap"` to `package.json` scripts.

---

### JSON-LD Pattern (inline `<script>` tags, no dedicated library needed)

**Analog based on CONTEXT.md D-10/D-11:** Manual `<script type="application/ld+json">` per page.

**Article JSON-LD for blog detail:**
```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.excerpt || post.meta_description,
  image: post.featured_image || post.og_image,
  datePublished: post.published_at,
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    {/* Page content */}
  </>
);
```

**TouristTrip JSON-LD for tour detail** (to be added to existing `app/tours/[slug]/page.tsx`):
```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristTrip',
  name: tour.title,
  description: tour.short_description,
  // ... other fields
};
```

**LocalBusiness JSON-LD for homepage** (to be added to `app/page.tsx`):
```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Anant Anand Tour Packages',
  // ... other fields
};
```

---

## Shared Patterns

### Authentication
**Not applicable.** All Phase 5 files are public-facing with no authentication requirement. Pages use the server supabase client (`createServerClient()`) for read-only data access.

### Server Component + Supabase Pattern
**Source:** `app/tours/[slug]/page.tsx` (lines 2-5, 90-91)
**Apply to:** All blog and page route files
```typescript
import { createServerClient } from '@/lib/supabase/server';
// In the component:
const supabase = createServerClient();
const data = await getSomeQuery(supabase, params.slug);
```

### Error Handling
**Source:** `lib/supabase/queries/tours.ts` (lines 87-89)
**Apply to:** New blog-public.ts queries
```typescript
const { data, error } = await query;
if (error) throw new Error(error.message);
return data as unknown as BlogPost[];
```

For page-level error handling, blog pages should use `notFound()` from next/navigation when a single post is not found:
```typescript
import { notFound } from 'next/navigation';

if (!post) { notFound(); }
```

### `generateMetadata` SEO Pattern
**Source:** `app/tours/[slug]/page.tsx` (lines 47-68)
**Apply to:** All blog route files with dynamic content
```typescript
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createServerClient();
  const post = await getBlogPostBySlug(supabase, params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: post.og_image ? [post.og_image] : post.featured_image ? [post.featured_image] : [],
      type: 'article',
      publishedTime: post.published_at || undefined,
    },
  };
}
```

### Card Grid Pattern
**Source:** `components/tours/TourCard.tsx` (full file, 77 lines)
**Apply to:** `components/blog/BlogCard.tsx` and any listing page
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {posts.map((post) => (
    <BlogCard key={post.id} post={post} />
  ))}
</div>
```

### Component Props Interface Pattern
**Source:** `components/tours/TourCard.tsx` (lines 13-15) and `components/tours/ToursList.tsx` (lines 5-7)
**Apply to:** All new components
```typescript
interface BlogCardProps {
  post: BlogPost;
}
```

### ISR (Incremental Static Regeneration) Pattern
**Source:** CONTEXT.md D-03 decision — use `revalidate` instead of `force-dynamic`
**Apply to:** All blog route files
```typescript
// Revalidate content every hour (content changes infrequently)
export const revalidate = 3600;
```

### Root Layout Metadata Template
**Source:** `app/layout.tsx` (lines 31-36)
**Apply to:** All pages (automatic — inherited from root layout)
```typescript
export const metadata: Metadata = {
  title: {
    default: 'Anant Anand Tour Packages — Age-Group Based Travel Experiences',
    template: '%s | Anant Anand Tour Packages',
  },
  // ...
};
```
→ Ensures blog page titles render as "Blog Post Title | Anant Anand Tour Packages"

---

## No Analog Found

Files with no close match in the codebase (planner should use UI-SPEC.md and CONTEXT.md patterns instead):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `components/blog/BlogPagination.tsx` | component (client) | request-response | No existing pagination component in codebase |
| `components/blog/BlogTableOfContents.tsx` | component (client) | event-driven | No existing TOC or scroll-tracking component |
| `next-sitemap.config.js` | config | build-time | No existing sitemap config file |

For these files, reference the UI-SPEC visual contract and standard Next.js patterns.

---

## Tailwind Config Modification

**Source:** `tailwind.config.ts` (line 131)
**Change needed:** Add `@tailwindcss/typography` plugin

```typescript
// Before:
plugins: [],

// After:
plugins: [
  require('@tailwindcss/typography'),
],
```

---

## Package.json Modification

**Source:** `package.json` (lines 5-9)
**Changes needed:**
1. Add `postbuild` script: `"postbuild": "next-sitemap"`
2. Add dependency: `"next-sitemap": "^4"` in `dependencies` or `devDependencies`
3. Install: `npm install --save-dev next-sitemap @tailwindcss/typography`

---

## Metadata

**Analog search scope:** `app/`, `components/`, `lib/supabase/queries/`, `lib/`, `hooks/`, `types/`
**Files scanned:** ~25 files
**Pattern extraction date:** 2026-06-19
