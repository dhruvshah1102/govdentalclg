import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { InboxClient } from './InboxClient';

export const revalidate = 0;

export default async function AdminInboxPage() {
  const db = await getDb();

  // Fetch all form submissions
  const submissions = await db.all(
    'SELECT * FROM submissions ORDER BY submitted_at DESC'
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#0A1F44]">Form Submissions & Inboxes</h2>
          <p className="text-xs text-gray-400 mt-1">Review Patient appointments, general feedback, and official Grievances.</p>
        </div>
      </div>

      {/* Mount Snappy Interactive Client panel */}
      <InboxClient initialSubmissions={submissions} />
    </div>
  );
}
