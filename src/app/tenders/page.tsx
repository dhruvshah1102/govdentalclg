import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { 
  FileText, Download, Calendar, ShieldAlert, 
  ExternalLink, CheckCircle, Info 
} from 'lucide-react';

export const revalidate = 0;

export default async function TendersPage() {
  const db = await getDb();

  // 1. Fetch all Tenders from SQLite
  const tenders = await db.all('SELECT * FROM tenders ORDER BY published_date DESC');

  const today = new Date().toISOString().split('T')[0];

  // 2. Classify Tenders into Active and Archived on-load
  // Tenders auto-archive when today's date exceeds the "last_date"
  const activeTenders = tenders.filter(t => t.last_date >= today && t.status === 'Active');
  const archivedTenders = tenders.filter(t => t.last_date < today || t.status === 'Archived');

  // Hardcode fallback seeds if none added
  const finalActive = activeTenders.length > 0 ? activeTenders : [
    {
      id: 1,
      title: 'Tender Notice: Procurement of High-End Clinical Dental Chairs and Operative Equipment',
      published_date: new Date().toISOString().split('T')[0],
      last_date: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0], // 15 Days from now
      document_url: '/downloads',
      is_new: 1
    },
    {
      id: 2,
      title: 'Supply, Testing & Commissioning of Orthopantomogram (OPG) & CBCT Dental Imaging Systems',
      published_date: new Date().toISOString().split('T')[0],
      last_date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0], // 10 Days from now
      document_url: '/downloads',
      is_new: 1
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-1 font-sans">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">Tenders & Procurement Portal</span>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0A1F44] to-[#1B5E3B] text-white rounded-lg p-6 md:p-10 mb-8 shadow">
          <span className="bg-[#D4870A] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3.5 rounded shadow">
            PROCUREMENT REGISTRY
          </span>
          <h1 className="font-serif text-3xl font-bold mt-3 mb-2 tracking-tight">
            Active Procurement Tenders & Empanelments
          </h1>
          <p className="text-xs md:text-sm text-gray-200 leading-relaxed max-w-2xl font-sans">
            Review live tender announcements, contract guidelines, and download bid specifications. Government bidding follows standard GeM portal guidelines.
          </p>
        </div>

        {/* Content Layout */}
        <div className="space-y-8">
          
          {/* Active Tenders Panel */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <CheckCircle className="text-[#1B5E3B]" size={20} /> Live Bids & Active Tenders
            </h3>
            
            <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs md:text-sm mt-4">
              <table className="w-full text-left">
                <thead className="bg-[#0A1F44] text-white font-ui uppercase tracking-wider text-[10px] font-semibold">
                  <tr>
                    <th className="px-6 py-4">Tender Specifications</th>
                    <th className="px-6 py-4">Publish Date</th>
                    <th className="px-6 py-4">Closing Date / Time</th>
                    <th className="px-6 py-4">Bid Document</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#2D2D2D] font-medium">
                  {finalActive.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 leading-relaxed font-sans max-w-md">
                        <div className="flex items-start gap-2 flex-wrap md:flex-nowrap">
                          {t.is_new === 1 && (
                            <span className="bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider animate-pulse-fast mt-0.5 shrink-0">NEW</span>
                          )}
                          <span>{t.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-sans">{t.published_date}</td>
                      <td className="px-6 py-4 text-red-600 font-bold font-sans">{t.last_date} &bull; 2:00 PM</td>
                      <td className="px-6 py-4">
                        <Link 
                          href={t.document_url || '/downloads'} 
                          className="text-[#1B5E3B] hover:text-[#247C4E] hover:underline font-bold flex items-center gap-1"
                          target="_blank"
                        >
                          <Download size={14} /> Spec.PDF
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Institutional GeM Portal Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 text-xs flex gap-3 text-[#2D2D2D]">
            <ShieldAlert className="text-[#D4870A] shrink-0" size={24} />
            <div>
              <strong className="text-[#0A1F44] block mb-0.5 font-serif text-sm">GeM (Government e-Marketplace) Procurement Notice</strong>
              All GDC equipment procurement procedures follow standard directives of the Government of Assam. Bidders are advised to log in directly to the central e-tendering portal of Assam.
              <a 
                href="https://assamtenders.gov.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#1B5E3B] font-bold hover:underline block mt-1.5 flex items-center gap-0.5"
              >
                Go to Assam Tenders Portal <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Archived Tenders Panel */}
          {archivedTenders.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#0A1F44] border-b border-gray-150 pb-2 mb-4 flex items-center gap-2">
                <Info className="text-gray-400" size={18} /> Archived Tenders
              </h3>
              <p className="text-xs text-gray-500 mb-4 font-sans">
                The following tenders have completed their active timelines and are closed for bidding.
              </p>
              
              <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs md:text-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-gray-500 font-ui uppercase tracking-wider text-[10px] font-semibold">
                    <tr>
                      <th className="px-6 py-3.5">Tender Name</th>
                      <th className="px-6 py-3.5">Publish Date</th>
                      <th className="px-6 py-3.5">Expired Date</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-400">
                    {archivedTenders.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-3 font-medium font-sans leading-relaxed">{t.title}</td>
                        <td className="px-6 py-3 font-sans">{t.published_date}</td>
                        <td className="px-6 py-3 font-sans">{t.last_date}</td>
                        <td className="px-6 py-3">
                          <span className="bg-gray-100 text-gray-400 text-[9px] font-bold py-0.5 px-2 rounded-full uppercase tracking-wider">
                            Archived
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
