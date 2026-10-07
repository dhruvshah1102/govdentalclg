import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { 
  BookOpen, Layers, Award, FileText, CheckCircle, 
  MapPin, ShieldAlert, Compass, Globe
} from 'lucide-react';

export const revalidate = 0;

export default async function ResearchPage() {
  const db = await getDb();

  // Load site settings (for Dynamic HTML pages)
  const settingsRows = await db.all('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  settingsRows.forEach((row) => {
    settings[row.key] = row.value;
  });

  const researchHtml = settings['research_overview_html'];
  const ethicalHtml = settings['ethical_committee_html'];

  // Helper to verify if dynamic HTML actually has user content
  const hasContent = (html: string | null | undefined): boolean => {
    if (!html) return false;
    const cleanText = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim();
    const hasMedia = html.includes('<img') || html.includes('<iframe') || html.includes('<table') || html.includes('<details');
    return cleanText.length > 0 || hasMedia;
  };

  const showResearchHtml = researchHtml && hasContent(researchHtml);
  const showEthicalHtml = ethicalHtml && hasContent(ethicalHtml);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-1 font-sans">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">Research Portal</span>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0A1F44] to-[#1B5E3B] text-white rounded-lg p-6 md:p-10 mb-8 shadow">
          <span className="bg-[#D4870A] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3.5 rounded shadow">
            SCIENTIFIC INQUIRY
          </span>
          <h1 className="font-serif text-3xl font-bold mt-3 mb-2 tracking-tight">
            Research, Publications & Academic Collaborations
          </h1>
          <p className="text-xs md:text-sm text-gray-200 leading-relaxed max-w-2xl font-sans">
            Expanding clinical and molecular research frontiers in dentistry. GDC Dibrugarh fosters ethically-approved clinical trials and community epidemiology studies in Upper Assam.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main column: Guidelines, Publications, and MOUs (2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Research Overview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                <Globe className="text-[#D4870A]" size={20} /> Research Oversight & Ethics
              </h3>
              
              {showResearchHtml ? (
                <div 
                  className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans mt-4"
                  dangerouslySetInnerHTML={{ __html: researchHtml }}
                />
              ) : (
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-sans">
                  Research at GDC Dibrugarh is supervised by the **Institutional Ethical Committee (IEC)**, which reviews all clinical studies, student dissertations, and project protocols to enforce strict compliance with ICMR guidelines.
                </p>
              )}
            </div>

            {/* Research Initiatives */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                <Layers className="text-[#1B5E3B]" size={20} /> Research & Clinical Investigations
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-sans mb-4">
                Faculty members and BDS scholars participate in academic investigations, epidemiological surveys, and clinical studies. Research initiatives focus on public dental health, oral diagnostics, and restorative methodologies tailored to North-East India.
              </p>
              
              <div className="bg-[#F8F9FA] border border-gray-200 p-4 rounded text-xs text-gray-600 font-sans leading-relaxed">
                Ongoing clinical trial protocols, departmental publications, and academic collaborative initiatives are published periodically following Institutional Ethical Committee reviews.
              </div>
            </div>

          </div>

          {/* Side column: Committee lists (1 Column) */}
          <div className="space-y-6">
            
            {/* Ethical committee list */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h4 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4">Ethical Committee</h4>
              
              {showEthicalHtml ? (
                <div 
                  className="text-xs text-gray-600 leading-relaxed font-sans"
                  dangerouslySetInnerHTML={{ __html: ethicalHtml }}
                />
              ) : (
                <div className="space-y-3 text-xs text-gray-600 font-sans">
                  <p>
                    <strong className="text-gray-800 block">Chairman:</strong>
                    Prof (Dr.) Chandana Kalita (Principal)
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    Institutional Ethical Committee members and constitution orders are notified by the administration as per ICMR regulations.
                  </p>
                </div>
              )}
            </div>

            {/* Document download box */}
            <div className="bg-[#0A1F44]/5 p-5 rounded-lg border border-gray-200">
              <h4 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-200 pb-2 mb-4">Ethical Approvals Downloads</h4>
              <ul className="space-y-3.5 text-xs text-gray-600 font-medium">
                <li>
                  <Link href="/downloads" className="text-[#1B5E3B] hover:underline flex items-center gap-1.5">
                    <FileText size={14} /> &raquo; IEC Project Protocol Format
                  </Link>
                </li>
                <li>
                  <Link href="/downloads" className="text-[#1B5E3B] hover:underline flex items-center gap-1.5">
                    <FileText size={14} /> &raquo; Patient Informed Consent English
                  </Link>
                </li>
                <li>
                  <Link href="/downloads" className="text-[#1B5E3B] hover:underline flex items-center gap-1.5">
                    <FileText size={14} /> &raquo; Patient Informed Consent Assamese
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
