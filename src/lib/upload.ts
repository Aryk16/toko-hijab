import { supabase, STORAGE_BUCKET } from './supabase';

export async function uploadImage(file: File, folder: string): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error('Upload error:', error.message);
    return null;
  }

  return fileName;
}
