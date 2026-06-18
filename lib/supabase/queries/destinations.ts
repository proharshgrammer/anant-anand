import { createClient } from '@/lib/supabase/client';
import type { Destination } from '@/types';

/**
 * Fetch all destinations ordered by name.
 */
export async function getDestinations(): Promise<Destination[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Destination[];
}

/**
 * Create a new destination.
 */
export async function createDestination(
  destination: Omit<Destination, 'id' | 'created_at'>
): Promise<Destination> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('destinations')
    .insert(destination as never)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as Destination;
}

/**
 * Update an existing destination.
 */
export async function updateDestination(
  id: string,
  destination: Partial<Omit<Destination, 'id' | 'created_at'>>
): Promise<Destination> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('destinations')
    .update(destination as never)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as Destination;
}

/**
 * Delete a destination by ID.
 */
export async function deleteDestination(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('destinations').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
