import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { TendersManagerClient } from './TendersManagerClient';

export const revalidate = 0;

export default async function AdminTendersPage() {
  const db = await getDb();

  // Fetch current tenders
  const tenders = await db.all('SELECT * FROM tenders ORDER BY published_date DESC');

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#0A1F44]">Tenders & Procurement Manager</h2>
        <p className="text-xs text-gray-400 mt-1">Publish new bid announcements, specification PDFs, and manage closing dates.</p>
      </div>

      {/* Mount Snappy Tenders Editor Panel */}
      <TendersManagerClient initialTenders={tenders} />
    </div>
  );
}
