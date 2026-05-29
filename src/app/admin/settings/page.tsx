import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { SettingsClient } from './SettingsClient';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const db = await getDb();

  // Fetch current site settings
  const settingsRows = await db.all('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  settingsRows.forEach((row) => {
    settings[row.key] = row.value;
  });

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#0A1F44]">Site Configurations & Settings</h2>
        <p className="text-xs text-gray-400 mt-1">Manage trilingual college name, social handles, helpline telephones, and SEO indices.</p>
      </div>

      {/* Mount Snappy Settings Panel */}
      <SettingsClient initialSettings={settings} />
    </div>
  );
}
