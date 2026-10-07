import React, { Suspense } from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { 
  Mail, Phone, MapPin, Clock, Stethoscope, 
  ShieldAlert, ExternalLink, HelpCircle 
} from 'lucide-react';
import { ContactFormClient } from './ContactFormClient';

export const revalidate = 900;

export default async function ContactUsPage() {
  const db = await getDb();

  // Load site settings
  const settingsRows = await db.all('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  settingsRows.forEach((row) => {
    settings[row.key] = row.value;
  });


  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-1 font-sans">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">Contact Us</span>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Contact Form Client and maps (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Interactive Forms Client Component */}
            <Suspense fallback={null}>
              <ContactFormClient />
            </Suspense>

            {/* Google Map Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-1.5">
                <MapPin className="text-[#1B5E3B]" /> Locate Us on Google Maps
              </h3>
              <div className="rounded overflow-hidden border border-gray-200 h-96 relative bg-gray-900 shadow-inner">
                <iframe
                  src={settings.google_map_embed || 'https://www.google.com/maps?q=27.4898743,94.9444949&output=embed'}
                  width="100%"
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy"
                  title="GDC Dibrugarh Map detail"
                ></iframe>
              </div>
            </div>

          </div>

          {/* Column 3: Contact details list and extension schedules (1 Column) */}
          <div className="space-y-6">
            
            {/* Core Address */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4">GDC Dibrugarh Coordinates</h4>
              <ul className="space-y-4 text-xs text-gray-600 font-medium">
                <li className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#1B5E3B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 block">Postal Address:</strong>
                    {settings.address || 'I Lane, AMCH Campus, Borbari, Dibrugarh, Assam - 786002'}, India.
                  </div>
                </li>
                {settings.phone && (
                  <li className="flex items-start gap-2.5">
                    <Phone size={16} className="text-[#D4870A] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-800 block">Office Phone:</strong>
                      {settings.phone}
                    </div>
                  </li>
                )}
                <li className="flex items-start gap-2.5">
                  <Mail size={16} className="text-[#0A1F44] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 block">Administrative Email:</strong>
                    {settings.email || 'gdcdibrugarh@gmail.com'}
                  </div>
                </li>
              </ul>
            </div>

            {/* Working Hours & Institutional Officers */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h4 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4">Official Hours & Authorities</h4>
              <div className="space-y-3.5 text-xs text-gray-600 font-sans">
                <div>
                  <strong className="text-gray-800 block mb-0.5">OPD & Hospital Timings:</strong>
                  <span>9:00 AM &ndash; 3:10 PM (Mon &ndash; Sat)</span>
                  <span className="block text-[10px] text-gray-400">Closed Sundays & Select Govt Holidays</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <strong className="text-gray-800 block mb-0.5">Government Nodal Officer:</strong>
                  <span>Dr. Lalit Chandra Boruah (Reader, Conservative Dentistry)</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <strong className="text-gray-800 block mb-0.5">Public Information Officer (RTI):</strong>
                  <span>Dr. Liza Pathak (Prof & HOD, Periodontics)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
