'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AdminNav from '@/components/admin/AdminNav';
import { createClient } from '@/lib/supabase/client';
import { updateSettings, type SettingsActionResult } from '@/app/actions/settings';
import type { SiteSettings } from '@/types';
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Globe,
  BarChart3,
  Share2,
  Search,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const settingsSchema = z.object({
  agency_name: z.string().min(1, 'Agency name is required').max(100),
  tagline: z.string().max(200).optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  whatsapp_number: z.string().max(20).optional().or(z.literal('')),
  email: z.union([z.string().email('Invalid email').optional(), z.literal('')]),
  address: z.string().max(300).optional().or(z.literal('')),
  hero_headline: z.string().max(200).optional().or(z.literal('')),
  hero_subheadline: z.string().max(300).optional().or(z.literal('')),
  hero_bg_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  stat_tours: z.coerce.number().int().min(0).optional(),
  stat_years: z.coerce.number().int().min(0).optional(),
  stat_destinations: z.coerce.number().int().min(0).optional(),
  stat_families: z.coerce.number().int().min(0).optional(),
  social_facebook: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  social_instagram: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  social_youtube: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  footer_about: z.string().max(500).optional().or(z.literal('')),
  site_meta_title: z.string().max(70).optional().or(z.literal('')),
  site_meta_description: z.string().max(160).optional().or(z.literal('')),
  map_embed_url: z.string().optional().or(z.literal('')),
});

type SettingsForm = z.infer<typeof settingsSchema>;

function FormSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
        <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-teal-700" />
        </div>
        <h2 className="font-display text-base font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  id,
  error,
  hint,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (data) {
        const settings = data as SiteSettings;
        reset({
          agency_name: settings.agency_name ?? '',
          tagline: settings.tagline ?? '',
          phone: settings.phone ?? '',
          whatsapp_number: settings.whatsapp_number ?? '',
          email: settings.email ?? '',
          address: settings.address ?? '',
          hero_headline: settings.hero_headline ?? '',
          hero_subheadline: settings.hero_subheadline ?? '',
          hero_bg_url: settings.hero_bg_url ?? '',
          stat_tours: settings.stat_tours ?? 0,
          stat_years: settings.stat_years ?? 0,
          stat_destinations: settings.stat_destinations ?? 0,
          stat_families: settings.stat_families ?? 0,
          social_facebook: settings.social_facebook ?? '',
          social_instagram: settings.social_instagram ?? '',
          social_youtube: settings.social_youtube ?? '',
          footer_about: settings.footer_about ?? '',
          site_meta_title: settings.site_meta_title ?? '',
          site_meta_description: settings.site_meta_description ?? '',
          map_embed_url: settings.map_embed_url ?? '',
        });
      }
      setLoading(false);
    }
    fetchSettings();
  }, [reset, supabase]);

  const onSubmit = async (data: SettingsForm) => {
    setSaveStatus('saving');
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => formData.append(key, String(val ?? '')));

      const result: SettingsActionResult = await updateSettings(formData);

      if (result.success) {
        setSaveStatus('success');
        reset(result.data as unknown as SettingsForm);
      } else {
        setSaveStatus('error');
      }
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminNav />
        <main className="flex-1 lg:ml-0 pt-16 lg:pt-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />

      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">
                Site Settings
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your agency contact info, homepage content, and SEO defaults.
              </p>
            </div>
          </div>

          {/* Save status banner */}
          {saveStatus === 'success' && (
            <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700 font-medium">
                Settings saved successfully! Values verified from database.
              </p>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">
                Failed to save settings. Please try again.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} id="settings-form">
            {/* Agency Info */}
            <FormSection title="Agency Info" icon={Building2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Agency Name" id="agency_name" error={errors.agency_name?.message}>
                  <input id="agency_name" {...register('agency_name')} className="input-field" />
                </Field>
                <Field label="Tagline" id="tagline" error={errors.tagline?.message}>
                  <input id="tagline" {...register('tagline')} className="input-field" placeholder="e.g. Journeys for Every Age" />
                </Field>
                <Field label="Phone Number" id="phone" error={errors.phone?.message}>
                  <input id="phone" {...register('phone')} className="input-field" placeholder="+91 98765 43210" />
                </Field>
                <Field label="WhatsApp Number" id="whatsapp_number" error={errors.whatsapp_number?.message} hint="With country code, no + (e.g. 919876543210)">
                  <input id="whatsapp_number" {...register('whatsapp_number')} className="input-field" placeholder="919876543210" />
                </Field>
                <Field label="Email Address" id="email" error={errors.email?.message}>
                  <input id="email" type="email" {...register('email')} className="input-field" />
                </Field>
                <Field label="Address" id="address" error={errors.address?.message}>
                  <input id="address" {...register('address')} className="input-field" />
                </Field>
              </div>
            </FormSection>

            {/* Homepage Hero */}
            <FormSection title="Homepage Hero" icon={Globe}>
              <div className="space-y-4">
                <Field label="Hero Headline" id="hero_headline" error={errors.hero_headline?.message}>
                  <input id="hero_headline" {...register('hero_headline')} className="input-field" placeholder="Discover India at Your Own Pace" />
                </Field>
                <Field label="Hero Sub-headline" id="hero_subheadline" error={errors.hero_subheadline?.message}>
                  <textarea id="hero_subheadline" {...register('hero_subheadline')} rows={2} className="input-field resize-none" />
                </Field>
                <Field label="Hero Background Image URL" id="hero_bg_url" error={errors.hero_bg_url?.message} hint="Hosted on Supabase Storage or an external CDN">
                  <input id="hero_bg_url" type="url" {...register('hero_bg_url')} className="input-field" placeholder="https://..." />
                </Field>
              </div>
            </FormSection>

            {/* Stats Counters */}
            <FormSection title="Stats Counters" icon={BarChart3}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Field label="Tours" id="stat_tours" error={errors.stat_tours?.message}>
                  <input id="stat_tours" type="number" min={0} {...register('stat_tours')} className="input-field" />
                </Field>
                <Field label="Years Experience" id="stat_years" error={errors.stat_years?.message}>
                  <input id="stat_years" type="number" min={0} {...register('stat_years')} className="input-field" />
                </Field>
                <Field label="Destinations" id="stat_destinations" error={errors.stat_destinations?.message}>
                  <input id="stat_destinations" type="number" min={0} {...register('stat_destinations')} className="input-field" />
                </Field>
                <Field label="Happy Families" id="stat_families" error={errors.stat_families?.message}>
                  <input id="stat_families" type="number" min={0} {...register('stat_families')} className="input-field" />
                </Field>
              </div>
            </FormSection>

            {/* Social Links */}
            <FormSection title="Social Links" icon={Share2}>
              <div className="space-y-4">
                <Field label="Facebook URL" id="social_facebook" error={errors.social_facebook?.message}>
                  <input id="social_facebook" type="url" {...register('social_facebook')} className="input-field" placeholder="https://facebook.com/..." />
                </Field>
                <Field label="Instagram URL" id="social_instagram" error={errors.social_instagram?.message}>
                  <input id="social_instagram" type="url" {...register('social_instagram')} className="input-field" placeholder="https://instagram.com/..." />
                </Field>
                <Field label="YouTube URL" id="social_youtube" error={errors.social_youtube?.message}>
                  <input id="social_youtube" type="url" {...register('social_youtube')} className="input-field" placeholder="https://youtube.com/..." />
                </Field>
              </div>
            </FormSection>

            {/* SEO Defaults */}
            <FormSection title="SEO Defaults" icon={Search}>
              <div className="space-y-4">
                <Field
                  label="Default Meta Title"
                  id="site_meta_title"
                  error={errors.site_meta_title?.message}
                  hint="Recommended: 50–60 characters"
                >
                  <input id="site_meta_title" {...register('site_meta_title')} className="input-field" maxLength={70} />
                </Field>
                <Field
                  label="Default Meta Description"
                  id="site_meta_description"
                  error={errors.site_meta_description?.message}
                  hint="Recommended: 150–160 characters"
                >
                  <textarea id="site_meta_description" {...register('site_meta_description')} rows={3} className="input-field resize-none" maxLength={160} />
                </Field>
                <Field label="Footer About Text" id="footer_about" error={errors.footer_about?.message}>
                  <textarea id="footer_about" {...register('footer_about')} rows={3} className="input-field resize-none" />
                </Field>
              </div>
            </FormSection>

            {/* Save button */}
            <div className="flex justify-end pb-8">
              <button
                id="settings-save-btn"
                type="submit"
                disabled={saveStatus === 'saving' || !isDirty}
                className="btn-primary"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
