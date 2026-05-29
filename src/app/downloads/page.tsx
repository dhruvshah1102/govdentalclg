import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { 
  FileText, Download, Calendar, ShieldCheck, 
  ExternalLink, Search, FileDown, ShieldAlert
} from 'lucide-react';

export const revalidate = 0;

export default async function DownloadsPage() {
  const db = await getDb();

  // 1. Fetch Downloads from SQLite
  const downloads = await db.all('SELECT * FROM downloads WHERE enabled = 1 ORDER BY upload_date DESC');

  // Classified Seed fallbacks if empty
  const defaultDownloads = downloads.length > 0 ? downloads : [
    { id: 1, title: 'BDS Academic Prospectus 2026-2027', category: 'Prospectus', file_url: '#', upload_date: 'March 2026' },
    { id: 2, title: 'Medical Fitness Certificate Prescribed Format', category: 'Forms', file_url: '#', upload_date: 'April 2026' },
    { id: 3, title: 'BDS 1st Year Theory & Preclinical Timetable Session 2026', category: 'Schedules', file_url: '#', upload_date: 'May 2026' },
    { id: 4, title: 'Anti-Ragging Committee Safe Declaration and Helpline Board', category: 'Circulars', file_url: '#', upload_date: 'May 2026' },
    { id: 5, title: 'Institutional Ethical Committee (IEC) Project Proposal Template', category: 'Forms', file_url: '#', upload_date: 'April 2026' }
  ];

  const categories = ['Forms', 'Prospectus', 'Schedules', 'Circulars'];

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-1 font-sans">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">Downloads Center</span>
        </div>

        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#0A1F44]">
            Downloads & Documents Library
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Search, preview, and download official institutional forms, timetables, syllabus files, and DCI certifications.
          </p>
        </div>

        {/* Categorized Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Side category selector indices */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-[#0A1F44] text-white p-5 rounded-lg shadow-sm">
              <h3 className="font-serif text-base font-bold text-white mb-3">Document Index</h3>
              <ul className="space-y-2 text-xs font-semibold text-gray-300">
                {categories.map((cat) => (
                  <li key={cat}>
                    <a href={`#${cat}`} className="hover:text-[#D4870A] transition block py-1 font-ui uppercase">
                      &raquo; {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 p-5 rounded-lg text-xs text-gray-500">
              <ShieldAlert className="text-[#D4870A] mb-2" size={20} />
              <p className="leading-relaxed">
                All uploaded documents are officially verified by GDC administration. PDF sheets will open directly inside new browser tab viewers.
              </p>
            </div>
          </div>

          {/* Core documents display boards (3 Columns) */}
          <div className="lg:col-span-3 space-y-8">
            {categories.map((cat) => {
              const catDocs = defaultDownloads.filter((d) => d.category.toLowerCase() === cat.toLowerCase());
              return (
                <div key={cat} id={cat} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44] border-b border-gray-150 pb-2 mb-4 uppercase tracking-wider flex items-center gap-1.5">
                    <FileDown size={18} className="text-[#1B5E3B]" /> {cat} Library
                  </h3>
                  
                  {catDocs.length === 0 ? (
                    <div className="text-gray-400 py-6 text-xs text-center font-sans">
                      No documents are currently indexed under this category.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 text-xs md:text-sm">
                      {catDocs.map((doc) => (
                        <div key={doc.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center gap-4">
                          <div>
                            <strong className="text-gray-700 block font-medium leading-relaxed font-sans">{doc.title}</strong>
                            <span className="text-[10px] text-gray-400 font-sans block mt-0.5">Uploaded: {doc.upload_date}</span>
                          </div>
                          <a 
                            href={doc.file_url} 
                            className="bg-[#1B5E3B] hover:bg-[#247C4E] text-white text-[10px] font-bold font-ui py-2 px-4 rounded uppercase tracking-wider transition shadow-sm flex items-center gap-1"
                            target="_blank"
                          >
                            <Download size={12} /> Open PDF
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
