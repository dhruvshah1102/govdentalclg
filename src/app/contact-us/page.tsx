import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { 
  Mail, Phone, MapPin, Clock, Stethoscope, 
  ShieldAlert, ExternalLink, HelpCircle 
} from 'lucide-react';
import { ContactFormClient } from './ContactFormClient';

export const revalidate = 0;

export default async function ContactUsPage() {
  const db = await getDb();

  // Load site settings
  const settingsRows = await db.all('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  settingsRows.forEach((row) => {
    settings[row.key] = row.value;
  });

  const deptContacts = [
    { name: 'Principal & Dean Office', phone: '+91 373 2300123 ext 1', email: 'dean.gdcdibrugarh@gov.in' },
    { name: 'Oral & Maxillofacial Surgery', phone: '+91 373 2300123 ext 102', email: 'dept.omfs@gdcdibrugarh.edu.in' },
    { name: 'Oral Medicine & Radiology', phone: '+91 373 2300123 ext 101', email: 'dept.omr@gdcdibrugarh.edu.in' },
    { name: 'Conservative Dentistry', phone: '+91 373 2300123 ext 106', email: 'dept.conservative@gdcdibrugarh.edu.in' },
    { name: 'Grievance Cell Registrar', phone: '+91 373 2300123 ext 9', email: 'grievance.gdcd@gov.in' }
  ];

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
            <ContactFormClient />

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
                <li className="flex items-start gap-2.5">
                  <Phone size={16} className="text-[#D4870A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 block">General Office Lines:</strong>
                    OPD Inquiries: {settings.phone || '+91 373 2300123'}<br />
                    Principal Desk: +91 373 2300124
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail size={16} className="text-[#0A1F44] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 block">Administrative Email:</strong>
                    {settings.email || 'gdcdibrugarh@gmail.com'}
                  </div>
                </li>
              </ul>
            </div>

            {/* Department helplines extension tables */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h4 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4">Department Extensions</h4>
              <div className="space-y-4">
                {deptContacts.map((dc, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-2.5 last:border-b-0 last:pb-0 text-xs">
                    <strong className="text-gray-800 block font-sans font-semibold">{dc.name}</strong>
                    <span className="text-gray-500 block mt-0.5">Phone: {dc.phone}</span>
                    <span className="text-[10px] text-gray-400 block font-sans truncate" title={dc.email}>Email: {dc.email}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
