'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import slugify from 'slugify';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import ImageUploader from '@/components/admin/ImageUploader';
import type { BlogPost } from '@/types';

// Tiptap requires client-side only rendering
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-xl min-h-[400px] flex items-center justify-center text-gray-400 text-sm">
      Loading editor…
    </div>
  ),
});

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  status: z.enum(['draft', 'scheduled', 'published']).default('draft'),
  published_at: z.string().optional().or(z.literal('')),
  category: z.string().optional().or(z.literal('')),
  tags_raw: z.string().optional().or(z.literal('')),
  author_name: z.string().default('Anant Anand Team'),
  author_bio: z.string().optional().or(z.literal('')),
  excerpt: z.string().max(300, 'Max 300 characters').optional().or(z.literal('')),
  featured_image_alt: z.string().optional().or(z.literal('')),
  read_time_minutes: z.coerce.number().int().min(1).optional().or(z.literal('')),
  schema_type: z.enum(['Article', 'BlogPosting', 'TravelAgency']).default('Article'),
  meta_title: z.string().max(70).optional().or(z.literal('')),
  meta_description: z.string().max(160).optional().or(z.literal('')),
  focus_keyword: z.string().optional().or(z.literal('')),
  canonical_url: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof blogSchema>;
type Tab = 'content' | 'seo';

export interface BlogFormProps {
  initialData?: Partial<BlogPost>;
  onSubmit: (data: Partial<BlogPost>) => Promise<void>;
  isSubmitting?: boolean;
}

export default function BlogForm({ initialData, onSubmit, isSubmitting }: BlogFormProps) {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image ?? '');
  const [featuredImageAlt, setFeaturedImageAlt] = useState(initialData?.featured_image_alt ?? '');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      slug: initialData?.slug ?? '',
      status: (initialData?.status as FormValues['status']) ?? 'draft',
      published_at: initialData?.published_at?.slice(0, 16) ?? '',
      category: initialData?.category ?? '',
      tags_raw: (initialData?.tags ?? []).join(', '),
      author_name: initialData?.author_name ?? 'Anant Anand Team',
      author_bio: initialData?.author_bio ?? '',
      excerpt: initialData?.excerpt ?? '',
      featured_image_alt: initialData?.featured_image_alt ?? '',
      read_time_minutes: initialData?.read_time_minutes ?? '',
      schema_type: (initialData?.schema_type as FormValues['schema_type']) ?? 'Article',
      meta_title: initialData?.meta_title ?? '',
      meta_description: initialData?.meta_description ?? '',
      focus_keyword: initialData?.focus_keyword ?? '',
      canonical_url: initialData?.canonical_url ?? '',
    },
  });

  const titleValue = watch('title');
  const statusValue = watch('status');
  const metaTitleValue = watch('meta_title') ?? '';
  const metaDescValue = watch('meta_description') ?? '';

  const handleTitleBlur = () => {
    if (!initialData?.slug && titleValue) {
      setValue('slug', slugify(titleValue, { lower: true, strict: true, trim: true }));
    }
  };

  const handleFormSubmit = async (values: FormValues) => {
    setServerError('');
    // Auto-calculate read time from content word count
    const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
    const readTime = values.read_time_minutes ? Number(values.read_time_minutes) : Math.max(1, Math.round(wordCount / 200));

    const payload: Partial<BlogPost> = {
      ...values,
      content,
      featured_image: featuredImage || null,
      featured_image_alt: featuredImageAlt || null,
      tags: values.tags_raw
        ? values.tags_raw.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      published_at: values.published_at || null,
      read_time_minutes: readTime,
      author_bio: values.author_bio || null,
      category: values.category || null,
      excerpt: values.excerpt || null,
      meta_title: values.meta_title || null,
      meta_description: values.meta_description || null,
      focus_keyword: values.focus_keyword || null,
      canonical_url: values.canonical_url || null,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to save post');
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'content', label: 'Content' },
    { id: 'seo', label: 'SEO & Meta' },
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

      {/* ── CONTENT TAB ───────────────────────────────── */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title */}
            <div>
              <label className="label">Title *</label>
              <input
                {...register('title')}
                onBlur={handleTitleBlur}
                className="input-field"
                placeholder="e.g. Top 10 Things to Do in Kedarnath"
              />
              {errors.title && <p className="error-text">{errors.title.message}</p>}
            </div>

            {/* Slug */}
            <div>
              <label className="label">Slug *</label>
              <input
                {...register('slug')}
                className="input-field font-mono text-sm"
                placeholder="top-10-things-to-do-in-kedarnath"
              />
              {errors.slug && <p className="error-text">{errors.slug.message}</p>}
            </div>

            {/* Excerpt */}
            <div>
              <label className="label">Excerpt</label>
              <textarea
                {...register('excerpt')}
                rows={2}
                className="input-field resize-none"
                placeholder="Brief summary for blog listing cards (max 300 chars)…"
              />
              {errors.excerpt && <p className="error-text">{errors.excerpt.message}</p>}
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="label mb-2">Content *</label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Start writing your blog post…"
                bucket="blog-images"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publish settings */}
            <div className="card p-4 space-y-4">
              <h3 className="font-medium text-gray-800 text-sm">Publishing</h3>

              <div>
                <label className="label">Status *</label>
                <select {...register('status')} className="input-field">
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {(statusValue === 'scheduled' || statusValue === 'published') && (
                <div>
                  <label className="label">Publish Date & Time</label>
                  <input
                    type="datetime-local"
                    {...register('published_at')}
                    className="input-field"
                  />
                </div>
              )}

              <div>
                <label className="label">Schema Type</label>
                <select {...register('schema_type')} className="input-field">
                  <option value="Article">Article</option>
                  <option value="BlogPosting">Blog Posting</option>
                  <option value="TravelAgency">Travel Agency</option>
                </select>
              </div>
            </div>

            {/* Category + Tags */}
            <div className="card p-4 space-y-4">
              <h3 className="font-medium text-gray-800 text-sm">Categorization</h3>
              <div>
                <label className="label">Category</label>
                <input
                  {...register('category')}
                  className="input-field"
                  placeholder="e.g. Travel Tips"
                />
              </div>
              <div>
                <label className="label">Tags</label>
                <input
                  {...register('tags_raw')}
                  className="input-field"
                  placeholder="Kedarnath, Uttarakhand, Pilgrimage"
                />
                <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
              </div>
            </div>

            {/* Author */}
            <div className="card p-4 space-y-4">
              <h3 className="font-medium text-gray-800 text-sm">Author</h3>
              <div>
                <label className="label">Author Name</label>
                <input {...register('author_name')} className="input-field" />
              </div>
              <div>
                <label className="label">Author Bio</label>
                <textarea
                  {...register('author_bio')}
                  rows={2}
                  className="input-field resize-none text-sm"
                  placeholder="Short bio about the author…"
                />
              </div>
              <div>
                <label className="label">Est. Read Time (min)</label>
                <input
                  type="number"
                  min={1}
                  {...register('read_time_minutes')}
                  className="input-field"
                  placeholder="Auto-calculated"
                />
                <p className="text-xs text-gray-400 mt-1">Leave blank to auto-calculate from word count</p>
              </div>
            </div>

            {/* Featured Image */}
            <div className="card p-4">
              <ImageUploader
                bucket="blog-images"
                folder="featured"
                value={featuredImage}
                onChange={setFeaturedImage}
                altText={featuredImageAlt}
                onAltChange={setFeaturedImageAlt}
                label="Featured Image"
                maxSizeMB={3}
              />
            </div>
          </div>
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
              placeholder="Page title for Google search (ideal: 30–60 chars)"
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
              placeholder="Search result snippet description (ideal: 80–155 chars)…"
              maxLength={160}
            />
          </div>

          <div>
            <label className="label">Focus Keyword</label>
            <input
              {...register('focus_keyword')}
              className="input-field"
              placeholder="e.g. Kedarnath trek guide"
            />
            <p className="text-xs text-gray-400 mt-1">The primary keyword this post should rank for</p>
          </div>

          <div>
            <label className="label">Canonical URL</label>
            <input
              {...register('canonical_url')}
              type="url"
              className="input-field font-mono text-sm"
              placeholder="https://anantanandtourpackages.in/blog/..."
            />
            <p className="text-xs text-gray-400 mt-1">Leave blank unless republishing from another source</p>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
          id="blog-form-save"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            'Save Post'
          )}
        </button>
      </div>
    </form>
  );
}
