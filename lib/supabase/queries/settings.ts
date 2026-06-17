import { createServerClient } from '@/lib/supabase/server';
import type { SiteSettings } from '@/types';

/**
 * Fetch the single site settings row (id = 1).
 * Used by server components and the Settings admin page.
 */
export async function getSettings(): Promise<SiteSettings | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('[getSettings] Supabase error:', error.message);
    return null;
  }
  return data as SiteSettings;
}

/**
 * Update the single site settings row (id = 1).
 * Server Action or API Route use only — requires authenticated session.
 */
export async function updateSettings(
  updates: Partial<Omit<SiteSettings, 'id' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerClient();
  const payload = { ...updates, updated_at: new Date().toISOString() } as Parameters<ReturnType<typeof createServerClient>['from']>[0] extends never ? never : Record<string, unknown>;
  const { error } = await supabase
    .from('site_settings')
    .update(payload as never)
    .eq('id', 1);

  if (error) {
    console.error('[updateSettings] Supabase error:', error.message);
    return { success: false, error: (error as { message: string }).message };
  }
  return { success: true };
}
