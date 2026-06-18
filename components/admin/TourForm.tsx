'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import slugify from 'slugify';
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import WaypointBuilder from '@/components/admin/WaypointBuilder';
import type { Tour, Waypoint } from '@/types';

const tourSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  short_description: z.string().max(300, 'Max 300 characters').optional().or(z.literal('')),
  description: z.string().max(2000, 'Max 2000 characters').optional().or(z.literal('')),
  category: z.enum(['spiritual', 'trek', 'hill_station', 'heritage', 'beach', 'wildlife']),
  age_groups: z.array(z.enum(['senior', 'family', 'youth', 'school'])).default([]),
  duration_days: z.coerce.number().int().min(1, 'At least 1 day'),
  duration_nights: z.coerce.number().int().min(0),
  price_per_person: z.coerce.number().positive('Price must be positive'),
  difficulty: z.enum(['easy', 'moderate', 'challenging']).default('easy'),
  max_group_size: z.coerce.number().int().positive().optional().or(z.literal('')),
  destinations_raw: z.string().optional().or(z.literal('')),
  inclusions: z.array(z.object({ value: z.string() })).default([]),
  exclusions: z.array(z.object({ value: z.string() })).default([]),
  hero_image: z.string().optional().or(z.literal('')),
  hero_image_alt: z.string().optional().or(z.literal('')),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
  meta_title: z.string().max(70).optional().or(z.literal('')),
  meta_description: z.string().max(160).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof tourSchema>;

export interface TourFormProps {
  initialData?: Partial<Tour>;
  onSubmit: (data: Partial<Tour>) => Promise<void>;
  isSubmitting?: boolean;
}

type Tab = 'details' | 'itinerary' | 'seo';

export default function TourForm({ initialData, onSubmit, isSubmitting }: TourFormProps) {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [heroImage, setHeroImage] = useState(initialData?.hero_image ?? '');
  const [heroAlt, setHeroAlt] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>(
    (initialData?.images as string[] | undefined) ?? []
  );
  const [waypoints, setWaypoints] = useState<Waypoint[]>(
    (initialData?.waypoints as Waypoint[] | undefined) ?? []
  );
  const [seoOpen, setSeoOpen] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      slug: initialData?.slug ?? '',
      short_description: initialData?.short_description ?? '',
      description: initialData?.description ?? '',
      category: (initialData?.category as FormValues['category']) ?? 'spiritual',
      age_groups: (initialData?.age_groups as FormValues['age_groups']) ?? [],
      duration_days: initialData?.duration_days ?? 1,
      duration_nights: initialData?.duration_nights ?? 0,
      price_per_person: initialData?.price_per_person ?? 0,
      difficulty: (initialData?.difficulty as FormValues['difficulty']) ?? 'easy',
      max_group_size: initialData?.max_group_size ?? '',
      destinations_raw: (initialData?.destinations ?? []).join(', '),
      inclusions: (initialData?.inclusions ?? []).map((v) => ({ value: v })),
      exclusions: (initialData?.exclusions ?? []).map((v) => ({ value: v })),
      is_featured: initialData?.is_featured ?? false,
      is_published: initialData?.is_published ?? false,
      meta_title: initialData?.meta_title ?? '',
      meta_description: initialData?.meta_description ?? '',
    },
  });

  const {
    fields: inclusionFields,
    append: appendInclusion,
    remove: removeInclusion,
  } = useFieldArray({ control, name: 'inclusions' });

  const {
    fields: exclusionFields,
    append: appendExclusion,
    remove: removeExclusion,
  } = useFieldArray({ control, name: 'exclusions' });

  const titleValue = watch('title');

  const handleTitleBlur = () => {
    if (!initialData?.slug && titleValue) {
      setValue('slug', slugify(titleValue, { lower: true, strict: true, trim: true }));
    }
  };

  const handleFormSubmit = async (values: FormValues) => {
    setServerError('');
    const payload: Partial<Tour> = {
      ...values,
      hero_image: heroImage || null,
      images: galleryImages,
      waypoints,
      destinations: values.destinations_raw
        ? values.destinations_raw.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      inclusions: values.inclusions.map((i) => i.value).filter(Boolean),
      exclusions: values.exclusions.map((e) => e.value).filter(Boolean),
      max_group_size: values.max_group_size ? Number(values.max_group_size) : null,
      meta_title: values.meta_title || null,
      meta_description: values.meta_description || null,
    };
    try {
      await onSubmit(payload);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to save tour');
    }
  };

  const metaTitleValue = watch('meta_title') ?? '';
  const metaDescValue = watch('meta_description') ?? '';

  const tabs: { id: Tab; label: string }[] = [
    { id: 'details', label: 'Details' },
    { id: 'itinerary', label: 'Itinerary & Map' },
    { id: 'seo', label: 'SEO' },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── DETAILS TAB ────────────────────────────────── */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main fields */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title */}
            <div>
              <label className="label">Title *</label>
              <input
                {...register('title')}
                onBlur={handleTitleBlur}
                className="input-field"
                placeholder="e.g. Char Dham Yatra — 12 Days"
              />
              {errors.title && <p className="error-text">{errors.title.message}</p>}
            </div>

            {/* Slug */}
            <div>
              <label className="label">Slug *</label>
              <input
                {...register('slug')}
                className="input-field font-mono text-sm"
                placeholder="char-dham-yatra-12-days"
              />
              {errors.slug && <p className="error-text">{errors.slug.message}</p>}
            </div>

            {/* Short Description */}
            <div>
              <label className="label">Short Description</label>
              <textarea
                {...register('short_description')}
                rows={2}
                className="input-field resize-none"
                placeholder="Brief summary shown on tour cards (max 300 chars)…"
              />
              {errors.short_description && (
                <p className="error-text">{errors.short_description.message}</p>
              )}
            </div>

            {/* Full Description */}
            <div>
              <label className="label">Full Description</label>
              <textarea
                {...register('description')}
                rows={5}
                className="input-field resize-y"
                placeholder="Detailed description of the tour package…"
              />
            </div>

            {/* Category + Difficulty side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Category *</label>
                <select {...register('category')} className="input-field">
                  <option value="spiritual">🙏 Spiritual</option>
                  <option value="trek">🏔️ Trek</option>
                  <option value="hill_station">🌿 Hill Station</option>
                  <option value="heritage">🏛️ Heritage</option>
                  <option value="beach">🏖️ Beach</option>
                  <option value="wildlife">🐅 Wildlife</option>
                </select>
              </div>
              <div>
                <label className="label">Difficulty *</label>
                <select {...register('difficulty')} className="input-field">
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="challenging">Challenging</option>
                </select>
              </div>
            </div>

            {/* Duration + Price + Group size */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="label">Days *</label>
                <input
                  type="number"
                  min={1}
                  {...register('duration_days')}
                  className="input-field"
                />
                {errors.duration_days && (
                  <p className="error-text">{errors.duration_days.message}</p>
                )}
              </div>
              <div>
                <label className="label">Nights *</label>
                <input
                  type="number"
                  min={0}
                  {...register('duration_nights')}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Price/Person (₹) *</label>
                <input
                  type="number"
                  min={0}
                  {...register('price_per_person')}
                  className="input-field"
                />
                {errors.price_per_person && (
                  <p className="error-text">{errors.price_per_person.message}</p>
                )}
              </div>
              <div>
                <label className="label">Max Group Size</label>
                <input
                  type="number"
                  min={1}
                  {...register('max_group_size')}
                  className="input-field"
                  placeholder="—"
                />
              </div>
            </div>

            {/* Age Groups */}
            <div>
              <label className="label">Age Groups</label>
              <div className="flex flex-wrap gap-3 mt-1">
                {(
                  [
                    { id: 'senior', label: '🙏 Senior Pilgrims' },
                    { id: 'family', label: '👨‍👩‍👧 Families' },
                    { id: 'youth', label: '🏔️ Youth & Couples' },
                    { id: 'school', label: '🎒 School Groups' },
                  ] as const
                ).map(({ id, label }) => {
                  const current = watch('age_groups') ?? [];
                  const checked = current.includes(id);
                  return (
                    <label
                      key={id}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer text-sm transition-colors ${
                        checked
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'border-gray-300 text-gray-600 hover:border-teal-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...current, id]
                            : current.filter((g) => g !== id);
                          setValue('age_groups', next as FormValues['age_groups']);
                        }}
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Destinations */}
            <div>
              <label className="label">Destinations</label>
              <input
                {...register('destinations_raw')}
                className="input-field"
                placeholder="Haridwar, Rishikesh, Kedarnath (comma-separated)"
              />
              <p className="text-xs text-gray-400 mt-1">Separate multiple destinations with commas</p>
            </div>

            {/* Inclusions */}
            <div>
              <label className="label">Inclusions</label>
              <div className="space-y-2">
                {inclusionFields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`inclusions.${idx}.value`)}
                      className="input-field flex-1 text-sm"
                      placeholder="e.g. Accommodation (double sharing)"
                    />
                    <button
                      type="button"
                      onClick={() => removeInclusion(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendInclusion({ value: '' })}
                  className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800"
                >
                  <Plus className="w-4 h-4" /> Add Inclusion
                </button>
              </div>
            </div>

            {/* Exclusions */}
            <div>
              <label className="label">Exclusions</label>
              <div className="space-y-2">
                {exclusionFields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`exclusions.${idx}.value`)}
                      className="input-field flex-1 text-sm"
                      placeholder="e.g. Flights / train tickets"
                    />
                    <button
                      type="button"
                      onClick={() => removeExclusion(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendExclusion({ value: '' })}
                  className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800"
                >
                  <Plus className="w-4 h-4" /> Add Exclusion
                </button>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Hero Image */}
            <div className="card p-4">
              <ImageUploader
                bucket="tour-images"
                folder="heroes"
                value={heroImage}
                onChange={setHeroImage}
                altText={heroAlt}
                onAltChange={setHeroAlt}
                label="Hero Image"
                maxSizeMB={5}
              />
            </div>

            {/* Publish controls */}
            <div className="card p-4 space-y-3">
              <h3 className="font-medium text-gray-800 text-sm">Visibility</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_published')}
                  className="w-4 h-4 text-teal-600 rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Published</span>
                  <p className="text-xs text-gray-400">Visible to public website visitors</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_featured')}
                  className="w-4 h-4 text-teal-600 rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                  <p className="text-xs text-gray-400">Show in the Homepage featured section</p>
                </div>
              </label>
            </div>

            {/* Gallery Images */}
            <div className="card p-4">
              <h3 className="font-medium text-gray-800 text-sm mb-3">Gallery Images</h3>
              <div className="grid grid-cols-2 gap-2">
                {galleryImages.map((url, i) => (
                  <div key={i} className="relative">
                    <ImageUploader
                      bucket="tour-images"
                      folder="gallery"
                      value={url}
                      onChange={(newUrl) => {
                        const next = [...galleryImages];
                        if (newUrl) {
                          next[i] = newUrl;
                        } else {
                          next.splice(i, 1);
                        }
                        setGalleryImages(next);
                      }}
                    />
                  </div>
                ))}
                {galleryImages.length < 8 && (
                  <button
                    type="button"
                    onClick={() => setGalleryImages([...galleryImages, ''])}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center text-xs text-gray-400 hover:border-teal-400 hover:text-teal-600 transition-colors"
                  >
                    <Plus className="w-5 h-5 mx-auto mb-1" />
                    Add Photo
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">Up to 8 gallery photos</p>
            </div>
          </div>
        </div>
      )}

      {/* ── ITINERARY TAB ─────────────────────────────── */}
      {activeTab === 'itinerary' && (
        <div>
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-gray-800">
              Itinerary Waypoints
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Add day-by-day stops with GPS coordinates. These power the interactive Leaflet map on the tour detail page.
            </p>
          </div>
          <WaypointBuilder value={waypoints} onChange={setWaypoints} />
        </div>
      )}

      {/* ── SEO TAB ───────────────────────────────────── */}
      {activeTab === 'seo' && (
        <div className="max-w-2xl space-y-5">
          <div>
            <label className="label">
              Meta Title
              <span className={`ml-2 text-xs font-normal ${
                metaTitleValue.length > 60 ? 'text-red-500' : metaTitleValue.length > 30 ? 'text-green-600' : 'text-gray-400'
              }`}>
                {metaTitleValue.length}/70
              </span>
            </label>
            <input
              {...register('meta_title')}
              className="input-field"
              placeholder="Tour title for Google (ideal: 30–60 chars)"
              maxLength={70}
            />
          </div>
          <div>
            <label className="label">
              Meta Description
              <span className={`ml-2 text-xs font-normal ${
                metaDescValue.length > 155 ? 'text-red-500' : metaDescValue.length > 80 ? 'text-green-600' : 'text-gray-400'
              }`}>
                {metaDescValue.length}/160
              </span>
            </label>
            <textarea
              {...register('meta_description')}
              rows={3}
              className="input-field resize-none"
              placeholder="Search result description (ideal: 80–155 chars)…"
              maxLength={160}
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
          id="tour-form-save"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            'Save Tour'
          )}
        </button>
      </div>
    </form>
  );
}
