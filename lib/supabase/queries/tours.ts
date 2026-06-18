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
