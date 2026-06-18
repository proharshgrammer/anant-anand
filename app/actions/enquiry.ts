'use server';

import { createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ── Zod schema for validation (T-04-03 mitigation) ──────────
const EnquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z
    .string()
    .min(7, 'Phone number must be at least 7 digits')
    .max(20, 'Phone number is too long')
    .regex(/^[+\d\s\-()]+$/, 'Please enter a valid phone number'),
  message: z.string().max(1000, 'Message is too long').optional(),
  source_page: z.string().optional(),
  tour_name: z.string().optional(),
  tour_id: z.string().optional(),
});

export type EnquiryFormData = z.infer<typeof EnquirySchema>;

export type EnquiryActionResult =
  | { success: true }
  | { success: false; error: string };

/**
 * submitEnquiry — Server Action to insert a lead into the Supabase enquiries table.
 * Validates all fields with Zod before inserting (T-04-03).
 */
export async function submitEnquiry(
  data: EnquiryFormData
): Promise<EnquiryActionResult> {
  // 1. Validate input
  const parsed = EnquirySchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message || 'Invalid form data';
    return { success: false, error: firstError };
  }

  const { name, email, phone, message, source_page, tour_name, tour_id } = parsed.data;

  // 2. Insert into Supabase
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from('enquiries').insert({
      name,
      email: email || null,
      phone,
      message: message || null,
      source_page: source_page || null,
      tour_name: tour_name || null,
      tour_id: tour_id || null,
      status: 'new',
      whatsapp_opt_in: false,
    } as never);

    if (error) {
      console.error('[enquiry-action] Supabase insert error:', error.message);
      return {
        success: false,
        error: 'Failed to submit enquiry. Please call us directly.',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('[enquiry-action] Unexpected error:', err);
    return {
      success: false,
      error: 'Failed to submit enquiry. Please call us directly.',
    };
  }
}
