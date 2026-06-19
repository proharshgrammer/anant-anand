'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import slugify from 'slugify';
import ImageUploader from '@/components/admin/ImageUploader';
import { createDestination, updateDestination } from '@/app/actions/destinations';
import type { Destination } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  region: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  image: z.string().optional().or(z.literal('')),
  image_alt: z.string().optional().or(z.literal('')),
  is_featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

interface DestinationFormProps {
  initialData?: Partial<Destination>;
  onClose: () => void;
  onSaved: () => void;
}

export default function DestinationForm({
  initialData,
  onClose,
  onSaved,
}: DestinationFormProps) {
  const isEditing = !!initialData?.id;
  const [imageUrl, setImageUrl] = useState(initialData?.image ?? '');
  const [imageAlt, setImageAlt] = useState(initialData?.image_alt ?? '');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? '',
      slug: initialData?.slug ?? '',
      region: initialData?.region ?? '',
      description: initialData?.description ?? '',
      image: initialData?.image ?? '',
      image_alt: initialData?.image_alt ?? '',
      is_featured: initialData?.is_featured ?? false,
    },
  });

  const nameValue = watch('name');

  const handleNameBlur = () => {
    if (!isEditing && nameValue) {
      setValue(
        'slug',
        slugify(nameValue, { lower: true, strict: true, trim: true })
      );
    }
  };

  const onSubmit = async (values: FormValues) => {
    setServerError('');
    const payload = {
      ...values,
      image: imageUrl,
      image_alt: imageAlt,
      region: values.region || null,
      description: values.description || null,
    };

    try {
      if (isEditing && initialData?.id) {
        await updateDestination(initialData.id, payload);
      } else {
        await createDestination(payload);
      }
      onSaved();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Save failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-display text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Destination' : 'Add Destination'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {serverError}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="label">Name *</label>
            <input
              {...register('name')}
              onBlur={handleNameBlur}
              className="input-field"
              placeholder="e.g. Char Dham Yatra"
            />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="label">Slug *</label>
            <input
              {...register('slug')}
              className="input-field font-mono text-sm"
              placeholder="char-dham-yatra"
            />
            {errors.slug && <p className="error-text">{errors.slug.message}</p>}
          </div>

          {/* Region */}
          <div>
            <label className="label">Region</label>
            <input
              {...register('region')}
              className="input-field"
              placeholder="e.g. Uttarakhand"
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="input-field resize-none"
              placeholder="Brief description of this destination…"
            />
          </div>

          {/* Image */}
          <ImageUploader
            bucket="destination-images"
            folder="destinations"
            value={imageUrl}
            onChange={setImageUrl}
            altText={imageAlt}
            onAltChange={setImageAlt}
            label="Destination Image"
            maxSizeMB={3}
          />

          {/* Is Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_featured"
              {...register('is_featured')}
              className="w-4 h-4 text-teal-600 rounded border-gray-300"
            />
            <label htmlFor="is_featured" className="text-sm text-gray-700">
              Feature this destination on the homepage
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Add Destination'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
