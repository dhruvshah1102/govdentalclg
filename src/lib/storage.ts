import { createClient } from '@supabase/supabase-js';

const BUCKET = 'uploads';

let client: ReturnType<typeof createClient> | null = null;

function getStorageClient() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Supabase storage environment variables are not set.');
  }
  client = createClient(url, serviceKey);
  return client;
}

// Folder groups keep uploads organized in the bucket and let each admin section validate its own file types.
export type UploadFolder = 'faculty-photos' | 'faculty-cvs' | 'downloads' | 'gallery' | 'hero-slides' | 'departments' | 'settings';

export async function uploadFile(folder: UploadFolder, file: File): Promise<string> {
  const supabase = getStorageClient();
  const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const path = `${folder}/${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage.from(BUCKET).upload(path, Buffer.from(arrayBuffer), {
    contentType: file.type || 'application/octet-stream',
    upsert: false
  });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Deletes a file from storage given its public URL. Safe to call with URLs that
// don't belong to our bucket (e.g. old external links) - it just no-ops.
export async function deleteFileByUrl(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return; // not one of our uploaded files (e.g. external URL) - nothing to clean up

  const path = url.slice(idx + marker.length);
  const supabase = getStorageClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
