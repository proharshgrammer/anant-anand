import type { BlogPost, Tour } from '@/types';

/**
 * Fetch published blog posts with optional category filtering and pagination.
 * Uses `any` typed client for compatibility between browser/server Supabase clients.
 */
export async function getPublishedBlogPosts(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/**
 * Fetch a single published blog post by slug.
 * Returns null (does not throw) when not found — matches getTourBySlug pattern.
 */
export async function getBlogPostBySlug(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/**
 * Fetch published tours by their IDs for the related tours section.
 * Short-circuits with empty array when ids is empty.
 */
export async function getPublishedToursByIds(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  ids: string[]
): Promise<Tour[]> {
  if (!ids || ids.length === 0) return [];

  const { data, error } = await supabase
    .from('tours')
    .select(
      'id, title, slug, category, duration_days, duration_nights, price_per_person, hero_image, age_groups'
    )
    .in('id', ids)
    .eq('is_published', true);

  if (error) throw new Error(error.message);
  return data as unknown as Tour[];
}
