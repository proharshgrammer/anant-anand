'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function createDestination(data: {
  name: string;
  slug: string;
  region?: string | null;
  description?: string | null;
  image?: string;
  image_alt?: string;
  is_featured?: boolean;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('destinations').insert(data as never);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/destinations');
  revalidatePath('/destinations');
}

export async function updateDestination(
  id: string,
  data: {
    name?: string;
    slug?: string;
    region?: string | null;
    description?: string | null;
    image?: string;
    image_alt?: string;
    is_featured?: boolean;
  }
) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('destinations').update(data as never).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/destinations');
  revalidatePath('/destinations');
}

export async function deleteDestination(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('destinations').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/destinations');
  revalidatePath('/destinations');
}
