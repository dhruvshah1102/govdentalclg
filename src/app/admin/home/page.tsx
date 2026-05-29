import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { HomeManagerClient } from './HomeManagerClient';

export const revalidate = 0;

export default async function AdminHomePageEditor() {
  const db = await getDb();

  // 1. Fetch current settings (for Dean's welcome)
  const settingsRows = await db.all('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  settingsRows.forEach((row) => {
    settings[row.key] = row.value;
  });

  // 2. Fetch slides
  const slides = await db.all('SELECT * FROM hero_slides ORDER BY sort_order ASC');

  // 3. Fetch announcements (scrolling + notices)
  const announcements = await db.all('SELECT * FROM announcements ORDER BY date DESC');

  // 4. Fetch stats
  const stats = await db.all('SELECT * FROM stats ORDER BY sort_order ASC');

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#0A1F44]">Homepage & Sliders Manager</h2>
        <p className="text-xs text-gray-400 mt-1">
          Customize active hero image slides, scrollable announcements/tickers, metrics counters, and the Dean\'s welcome message.
        </p>
      </div>

      {/* Mount Snappy Homepage Editor Tabbed Panel */}
      <HomeManagerClient 
        initialSettings={settings} 
        initialSlides={slides} 
        initialAnnouncements={announcements} 
        initialStats={stats} 
      />
    </div>
  );
}
