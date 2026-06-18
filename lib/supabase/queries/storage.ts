import { createClient } from '@/lib/supabase/client';

export type UploadResult = {
  url: string;
  path: string;
};

/**
 * Upload a file to a Supabase Storage bucket.
 * Returns the public URL and storage path on success.
 */
export async function uploadImage(
  bucket: string,
  file: File,
  folder?: string
): Promise<UploadResult> {
  const supabase = createClient();

  // Build a unique path: folder/timestamp-filename
  const ext = file.name.split('.').pop();
  const timestamp = Date.now();
  const safeName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .toLowerCase();
  const path = folder
    ? `${folder}/${timestamp}-${safeName}.${ext}`
    : `${timestamp}-${safeName}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/**
 * Delete a file from a Supabase Storage bucket by its storage path.
 */
export async function deleteImage(bucket: string, path: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(error.message);
}

export type StorageFile = {
  name: string;
  id: string;
  updated_at: string;
  publicUrl: string;
};

/**
 * List files in a folder within a Supabase Storage bucket.
 */
export async function listImages(
  bucket: string,
  folder = ''
): Promise<StorageFile[]> {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    sortBy: { column: 'updated_at', order: 'desc' },
  });
  if (error) throw new Error(error.message);

  return (data || []).map((file) => {
    const path = folder ? `${folder}/${file.name}` : file.name;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return {
      name: file.name,
      id: file.id ?? '',
      updated_at: file.updated_at ?? '',
      publicUrl: urlData.publicUrl,
    };
  });
}

/**
 * Extract the storage path from a Supabase public URL.
 * Useful for deleting an image by its URL.
 */
export function getPathFromUrl(url: string, bucket: string): string {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return '';
  return url.slice(idx + marker.length);
}
