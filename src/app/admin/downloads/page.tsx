import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { DownloadsManagerClient } from './DownloadsManagerClient';

export const revalidate = 0;

export default async function AdminDownloadsPage() {
  const db = await getDb();

  // Fetch current downloads
  const downloads = await db.all('SELECT * FROM downloads ORDER BY upload_date DESC');

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#0A1F44]">Downloads & Files Library Manager</h2>
        <p className="text-xs text-gray-400 mt-1">Upload and catalog prospectus files, timetables, circular guidelines, and medical certificates.</p>
      </div>

      {/* Mount Snappy Downloads Panel */}
      <DownloadsManagerClient initialDownloads={downloads} />
    </div>
  );
}
