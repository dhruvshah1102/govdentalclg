import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { uploadFile, UploadFolder } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const ALLOWED_FOLDERS: UploadFolder[] = [
  'faculty-photos', 'faculty-cvs', 'downloads', 'gallery', 'hero-slides', 'departments', 'settings'
];

// Folder -> allowed mime prefixes/types. Keeps someone from uploading an .exe as a "faculty photo".
const FOLDER_RULES: Record<UploadFolder, { types: string[]; maxBytes: number }> = {
  'faculty-photos': { types: ['image/'], maxBytes: 5 * 1024 * 1024 },
  'hero-slides': { types: ['image/'], maxBytes: 8 * 1024 * 1024 },
  'gallery': { types: ['image/', 'video/'], maxBytes: 20 * 1024 * 1024 },
  'departments': { types: ['image/'], maxBytes: 8 * 1024 * 1024 },
  'settings': { types: ['image/'], maxBytes: 5 * 1024 * 1024 },
  'faculty-cvs': { types: ['application/pdf'], maxBytes: 10 * 1024 * 1024 },
  'downloads': { types: ['application/pdf'], maxBytes: 20 * 1024 * 1024 }
};

export async function POST(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized administrative access.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') as string | null;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }
    if (!folder || !ALLOWED_FOLDERS.includes(folder as UploadFolder)) {
      return NextResponse.json({ error: 'Invalid upload folder.' }, { status: 400 });
    }

    const rules = FOLDER_RULES[folder as UploadFolder];
    const matchesType = rules.types.some((t) => file.type.startsWith(t));
    if (!matchesType) {
      return NextResponse.json(
        { error: `Invalid file type for this upload (expected ${rules.types.join(' or ')}).` },
        { status: 400 }
      );
    }
    if (file.size > rules.maxBytes) {
      return NextResponse.json(
        { error: `File too large (max ${(rules.maxBytes / (1024 * 1024)).toFixed(0)}MB).` },
        { status: 400 }
      );
    }

    const url = await uploadFile(folder as UploadFolder, file);
    return NextResponse.json({ success: true, url });

  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 });
  }
}
