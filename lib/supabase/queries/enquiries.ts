import { createClient } from '@/lib/supabase/client';
import type { Enquiry, EnquiryStatus } from '@/types';

/**
 * Fetch all enquiries, optionally filtered by status.
 */
export async function getEnquiries(filters?: { status?: string }): Promise<Enquiry[]> {
  const supabase = createClient();
  let query = supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Enquiry[];
}

/**
 * Update enquiry status.
 */
export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('enquiries')
    .update({ status } as never)
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/**
 * Update enquiry internal notes.
 */
export async function updateEnquiryNotes(
  id: string,
  notes: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('enquiries')
    .update({ notes } as never)
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/**
 * Delete an enquiry.
 */
export async function deleteEnquiry(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('enquiries').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
