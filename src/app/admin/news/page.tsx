import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { NewsManagerClient } from './NewsManagerClient';

export const revalidate = 0;

export default async function AdminNewsPage() {
  const db = await getDb();

  // Fetch current news & events
  const posts = await db.all('SELECT * FROM news_events ORDER BY date DESC');

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#0A1F44]">News & Campus Happenings Manager</h2>
        <p className="text-xs text-gray-400 mt-1">Publish news articles, specialized academic workshops, and manage announcements tickers.</p>
      </div>

      {/* Mount Snappy News Editor Panel */}
      <NewsManagerClient initialPosts={posts} />
    </div>
  );
}
