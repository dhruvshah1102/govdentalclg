import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { HospitalPortalClient } from './HospitalPortalClient';

export const revalidate = 0;

export default async function HospitalPage() {
  const db = await getDb();

  // Load site settings (helpline numbers, messages)
  const settingsRows = await db.all('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  settingsRows.forEach((row) => {
    settings[row.key] = row.value;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 font-sans flex items-center gap-1">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">Hospital wing & Patient Portal</span>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-[#1B5E3B] to-[#0A1F44] text-white rounded-lg p-6 md:p-10 mb-8 shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl">
            <span className="bg-[#D4870A] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3.5 rounded shadow">
              Tertiary Oral Healthcare
            </span>
            <h1 className="font-serif text-3xl font-bold mt-3 mb-2 tracking-tight">
              Hospital Patient Portals & Diagnostics
            </h1>
            <p className="text-xs md:text-sm text-gray-200 leading-relaxed font-sans">
              Providing professional clinical procedures and advanced maxillofacial diagnostic services under the subsidised health schemes of the Government of Assam.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-3 rounded border border-white/20 text-xs shrink-0 w-full md:w-auto">
            <strong className="text-[#D4870A] block uppercase mb-1">OPD HELPLINE</strong>
            <span className="block font-bold font-ui text-sm">{settings.helpline_tele || '+91 373 2300123'}</span>
            <span className="block text-[10px] text-gray-300">Timings: 8:00 AM - 2:00 PM</span>
          </div>
        </div>

        {/* Mounting Interactive Client portal */}
        <HospitalPortalClient settings={settings} />

      </div>
    </div>
  );
}
