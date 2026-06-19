'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';
import type { SiteSettings } from '@/types';

const SettingsUpdateSchema = z.object({
  agency_name: z.string().min(1).max(100).optional(),
  tagline: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  whatsapp_number: z.string().max(20).optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().max(300).optional(),
  hero_headline: z.string().max(200).optional(),
  hero_subheadline: z.string().max(300).optional(),
  hero_bg_url: z.string().optional(),
  stat_tours: z.coerce.number().int().min(0).optional(),
  stat_years: z.coerce.number().int().min(0).optional(),
  stat_destinations: z.coerce.number().int().min(0).optional(),
  stat_families: z.coerce.number().int().min(0).optional(),
  social_facebook: z.string().optional(),
  social_instagram: z.string().optional(),
  social_youtube: z.string().optional(),
  footer_about: z.string().max(500).optional(),
  site_meta_title: z.string().max(70).optional(),
  site_meta_description: z.string().max(160).optional(),
  map_embed_url: z.string().optional(),
});

export type SettingsActionResult =
  | { success: true; data: SiteSettings }
  | { success: false; error: string };

export async function updateSettings(
  formData: FormData
): Promise<SettingsActionResult> {
  try {
    const raw = Object.fromEntries(formData.entries());
    const parsed = SettingsUpdateSchema.safeParse(raw);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Invalid data';
      return { success: false, error: firstError };
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .update({ ...parsed.data, updated_at: new Date().toISOString() } as never)
      .eq('id', 1)
      .select()
      .single();

    if (error || !data) {
      console.error('[settings-action] Update failed:', error?.message);
      return { success: false, error: 'Failed to save settings.' };
    }

    return { success: true, data: data as SiteSettings };
  } catch (err) {
    console.error('[settings-action] Unexpected error:', err);
    return { success: false, error: 'Failed to save settings.' };
  }
}
