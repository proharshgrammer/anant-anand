'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function uploadImageAction(formData: FormData) {
  const bucket = formData.get('bucket') as string;
  const folder = formData.get('folder') as string;
  const file = formData.get('file') as File;

  const supabase = createAdminClient();

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
