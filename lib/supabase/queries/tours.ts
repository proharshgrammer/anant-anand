import { createClient } from '@/lib/supabase/client';
import type { Tour } from '@/types';

/**
 * Fetch all tours for the admin listing (lightweight columns only).
 */
export async function getTours(): Promise<
  Pick<Tour, 'id' | 'title' | 'slug' | 'category' | 'duration_days' | 'price_per_person' | 'is_featured' | 'is_published' | 'created_at'>[]
> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tours')
    .select('id, title, slug, category, duration_days, price_per_person, is_featured, is_published, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Pick<Tour, 'id' | 'title' | 'slug' | 'category' | 'duration_days' | 'price_per_person' | 'is_featured' | 'is_published' | 'created_at'>[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Fetch featured tours for the public website.
 */
export async function getFeaturedTours(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<
  Pick<Tour, 'id' | 'title' | 'slug' | 'category' | 'duration_days' | 'price_per_person' | 'hero_image' | 'age_groups'>[]
> {
  const { data, error } = await supabase
    .from('tours')
    .select('id, title, slug, category, duration_days, price_per_person, hero_image, age_groups')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Pick<Tour, 'id' | 'title' | 'slug' | 'category' | 'duration_days' | 'price_per_person' | 'hero_image' | 'age_groups'>[];
}

/**
 * Fetch public tours with optional filtering.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPublicTours(supabase: any, filters?: {
  ageGroup?: string;
  category?: string;
  duration?: string;
  budget?: string;
  sort?: string;
}): Promise<Tour[]> {
  let query = supabase.from('tours').select('*').eq('is_published', true);

  if (filters) {
    if (filters.ageGroup && filters.ageGroup !== 'all') {
      query = query.contains('age_groups', [filters.ageGroup]);
    }
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters.duration && filters.duration !== 'all') {
      if (filters.duration === '1-3') query = query.lte('duration_days', 3);
      if (filters.duration === '4-7') query = query.gte('duration_days', 4).lte('duration_days', 7);
      if (filters.duration === '8+') query = query.gte('duration_days', 8);
    }
    if (filters.budget && filters.budget !== 'all') {
      if (filters.budget === 'under-10k') query = query.lt('price_per_person', 10000);
      if (filters.budget === '10k-25k') query = query.gte('price_per_person', 10000).lte('price_per_person', 25000);
      if (filters.budget === '25k-50k') query = query.gte('price_per_person', 25000).lte('price_per_person', 50000);
      if (filters.budget === '50k+') query = query.gt('price_per_person', 50000);
    }

    if (filters.sort === 'price-asc') {
      query = query.order('price_per_person', { ascending: true });
    } else if (filters.sort === 'price-desc') {
      query = query.order('price_per_person', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as unknown as Tour[];
}

/**
 * Fetch a single tour with all fields for edit form.
 */
export async function getTourById(id: string): Promise<Tour | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as Tour;
}

/**
 * Fetch a single published tour by slug for the public Tour Detail page.
 * Uses `any` typed client for compatibility between browser/server Supabase clients.
 */
export async function getTourBySlug(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  slug: string
): Promise<Tour | null> {
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) return null;
  return data as unknown as Tour;
}

/**
 * Create a new tour.
 */
export async function createTour(tour: Partial<Tour>): Promise<Tour> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tours')
    .insert(tour as never)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as Tour;
}

/**
 * Update an existing tour.
 */
export async function updateTour(
  id: string,
  tour: Partial<Tour>
): Promise<Tour> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tours')
    .update(tour as never)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as Tour;
}

/**
 * Delete a tour permanently.
 */
export async function deleteTour(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('tours').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/**
 * Toggle the published state of a tour.
 */
export async function toggleTourPublish(
  id: string,
  isPublished: boolean
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('tours')
    .update({ is_published: isPublished } as never)
    .eq('id', id);

  if (error) throw new Error(error.message);
}
