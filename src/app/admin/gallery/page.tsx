import React from 'react';
import { getDb } from '@/lib/db';
import { GalleryManagerClient } from './GalleryManagerClient';

export const revalidate = 0;

export default async function AdminGalleryPage() {
  const db = await getDb();
  
  // Query all active gallery items
  const galleryItems = await db.all('SELECT * FROM gallery ORDER BY id DESC');

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#0A1F44]">Dynamic Media Gallery Manager</h2>
        <p className="text-xs text-gray-400 mt-1">
          Upload new institutional photographs, register YouTube virtual tours, select event categories, and delete obsolete assets.
        </p>
      </div>

      {/* Mount dynamic gallery CMS management panel */}
      <GalleryManagerClient initialItems={galleryItems} />
    </div>
  );
}
