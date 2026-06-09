import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { 
  GraduationCap, FileText, CheckCircle, HelpCircle, 
  Download, ArrowRight, DollarSign, Bed, Compass, ExternalLink
} from 'lucide-react';
import { AdmissionsFaqClient } from './AdmissionsFaqClient';

export const revalidate = 0;

export default async function AdmissionsPage() {
  const db = await getDb();

  // Load site settings (Helplines, fees info & dynamic HTML contents)
  const settingsRows = await db.all('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  settingsRows.forEach((row) => {
    settings[row.key] = row.value;
  });

  const faqs = [
    { q: 'What is the annual intake capacity for BDS at GDC Dibrugarh?', a: 'The college has a recognized annual intake capacity of 50 students for the BDS programme.' },
    { q: 'Is the college recognized by the Dental Council of India (DCI)?', a: 'Yes, Government Dental College & Hospital, Dibrugarh is fully recognized by the Dental Council of India, New Delhi and affiliated with Dibrugarh University.' },
    { q: 'What are the eligibility criteria for BDS admissions?', a: 'Candidates must qualify the national level NEET-UG conducted by NTA and secure a seat through the state level counselling conducted by the DME, Assam or through the All India Quota.' },
    { q: 'Are hostel facilities available for students?', a: 'Yes, fully-equipped separate boys and girls hostels are available on the campus, backed by safe dining mess halls, security wardrobes, and recreation yards.' }
  ];

  const admissionsHtml = settings['bds_admissions_html'];
  const hostelHtml = settings['hostel_accommodations_html'];

  // Helper to verify if dynamic HTML actually has user content
  const hasContent = (html: string | null | undefined): boolean => {
    if (!html) return false;
    const cleanText = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim();
    const hasMedia = html.includes('<img') || html.includes('<iframe') || html.includes('<table') || html.includes('<details');
    return cleanText.length > 0 || hasMedia;
  };

  const showAdmissionsHtml = admissionsHtml && hasContent(admissionsHtml);
  const showHostelHtml = hostelHtml && hasContent(hostelHtml);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-1 font-sans">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">Admissions Portal</span>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0A1F44] to-[#1B5E3B] text-white rounded-lg p-6 md:p-10 mb-8 shadow">
          <span className="bg-[#D4870A] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded shadow">
            ADMISSIONS OPEN
          </span>
          <h1 className="font-serif text-3xl font-bold mt-3 mb-2 tracking-tight">
            Academic Admissions BDS & MDS 2026-27
          </h1>
          <p className="text-xs md:text-sm text-gray-200 leading-relaxed max-w-2xl font-sans">
            Secure your seat at Assam\'s premier government dental institution. Seats are allocated strictly based on NEET-UG & NEET-MDS national rank counselling directories.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main column: Guidelines & fees (2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* BDS admissions guidelines */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                <GraduationCap className="text-[#D4870A]" size={20} /> BDS Course Outline & Seat Allocations
              </h3>
              
              {showAdmissionsHtml ? (
                <div 
                  className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans mt-4"
                  dangerouslySetInnerHTML={{ __html: admissionsHtml }}
                />
              ) : (
                <>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-6 font-sans">
                    Admissions to the Bachelor of Dental Surgery (BDS) degree at GDC Dibrugarh is organized through the Directorate of Medical Education (DME), Assam and Medical Counseling Committee (MCC) All India quotas.
                  </p>
                  
                  {/* Seats matrix */}
                  <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs md:text-sm">
                    <table className="w-full text-left">
                      <thead className="bg-[#0A1F44] text-white font-ui uppercase tracking-wider text-[10px] font-semibold">
                        <tr>
                          <th className="px-6 py-3.5">Quota Channel</th>
                          <th className="px-6 py-3.5">Seat Share (%)</th>
                          <th className="px-6 py-3.5">Annual Intake Seats</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-[#2D2D2D] font-medium">
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-3">Assam State Quota (DME)</td>
                          <td className="px-6 py-3">85%</td>
                          <td className="px-6 py-3 text-[#1B5E3B]">42 Seats</td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-3">All India Quota (MCC)</td>
                          <td className="px-6 py-3">15%</td>
                          <td className="px-6 py-3 text-[#1B5E3B]">8 Seats</td>
                        </tr>
                        <tr className="bg-gray-50/50 font-bold">
                          <td className="px-6 py-3 text-[#0A1F44]">Cumulative BDS Seats</td>
                          <td className="px-6 py-3">100%</td>
                          <td className="px-6 py-3 text-[#0A1F44]">50 Seats</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Fee Matrix details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                <DollarSign className="text-[#1B5E3B]" size={20} /> Subsidized Course Fee Matrices
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-6 font-sans">
                As a state medical institution, tuition fees are heavily subsidized by the government, ensuring equitable dental training access.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-100 p-4 rounded bg-[#F8F9FA] text-xs">
                  <strong className="text-[#0A1F44] block mb-1 font-serif text-sm">Admission Session Fees</strong>
                  - Annual Admission & Tuition: ₹20,000<br />
                  - Library & Preclinical Lab Fee: ₹4,000<br />
                  - Student Association Funds: ₹2,000<br />
                  <strong className="text-gray-600 block mt-2">Total Annual Fee: ₹26,000</strong>
                </div>
                <div className="border border-gray-100 p-4 rounded bg-[#F8F9FA] text-xs">
                  <strong className="text-[#0A1F44] block mb-1 font-serif text-sm">Caution Deposits (Refundable)</strong>
                  - Laboratory Caution Deposit: ₹5,000<br />
                  - College Library Deposit: ₹2,000<br />
                  - Hostel Security Deposit: ₹3,000<br />
                  <strong className="text-[#1B5E3B] block mt-2">Refundable Total: ₹10,000</strong>
                </div>
              </div>
            </div>

            {/* Hostels & Accommodations */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                <Bed className="text-[#0A1F44]" size={20} /> Hostel Accommodations
              </h3>
              
              {showHostelHtml ? (
                <div 
                  className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans mt-4"
                  dangerouslySetInnerHTML={{ __html: hostelHtml }}
                />
              ) : (
                <>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-sans mb-4">
                    Separate residential hostel quarters are located inside the security perimeter of the college. Each hostel possesses study halls, dining tables, water filtering setups, and recreation amenities.
                  </p>
                  <ul className="space-y-2.5 text-xs text-gray-500 list-disc pl-5">
                    <li>Hostel allocations are processed based on state merit rankings upon admissions validation.</li>
                    <li>Rooms are furnished with individual study desks, wardrobes, and single cots.</li>
                    <li>Strict code-of-conduct guidelines, warden monitoring, and gate locks are implemented.</li>
                  </ul>
                </>
              )}
            </div>

            {/* FAQ Accordion client widget */}
            <AdmissionsFaqClient faqs={faqs} />

          </div>

          {/* Side column: Notice and forms (1 Column) */}
          <div className="space-y-6">
            
            {/* Admissions alert Notice card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm text-center">
              <span className="text-[9px] bg-red-50 text-red-600 font-bold uppercase tracking-wider py-1 px-3 rounded-full border border-red-100 animate-pulse">
                Important Notice
              </span>
              <h4 className="font-serif text-base font-bold text-[#0A1F44] mt-4 mb-2">NEET Counselling 2026</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-sans mb-4">
                State rank lists, counselling rosters, and seats validation procedures are hosted on the DME Assam online portals.
              </p>
              <a 
                href="https://dme.assam.gov.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold font-ui py-2.5 px-4 rounded uppercase tracking-wider transition shadow-sm w-full block flex items-center justify-center gap-1"
              >
                Go to DME Portal <ExternalLink size={12} />
              </a>
            </div>

            {/* Merit lists download box */}
            <div className="bg-[#0A1F44]/5 p-5 rounded-lg border border-gray-200">
              <h4 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-200 pb-2 mb-4">Admissions Downloads</h4>
              <ul className="space-y-3.5 text-xs text-gray-600 font-medium">
                <li>
                  <Link href="/downloads" className="text-[#1B5E3B] hover:underline flex items-center gap-1.5">
                    <Download size={14} /> &raquo; BDS Prospectus 2026 PDF
                  </Link>
                </li>
                <li>
                  <Link href="/downloads" className="text-[#1B5E3B] hover:underline flex items-center gap-1.5">
                    <Download size={14} /> &raquo; Merit Seeding Checklist
                  </Link>
                </li>
                <li>
                  <Link href="/downloads" className="text-[#1B5E3B] hover:underline flex items-center gap-1.5">
                    <Download size={14} /> &raquo; Medical Fitness Format
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
