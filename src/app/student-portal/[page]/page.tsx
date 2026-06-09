import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { 
  Megaphone, ShieldAlert, Award, HelpCircle, 
  Download, FileText, Phone, Mail, UserCheck
} from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  params: {
    page: string;
  };
}

export default async function StudentPortalSubPage({ params }: PageProps) {
  const { page } = params;
  const db = await getDb();

  // Load site settings (for Dynamic HTML pages)
  const settingsRows = await db.all('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  settingsRows.forEach((row) => {
    settings[row.key] = row.value;
  });

  // Load student notices from database if page === 'notices'
  let studentNotices = [];
  if (page === 'notices') {
    studentNotices = await db.all(
      "SELECT * FROM announcements WHERE category = 'StudentNotice' AND enabled = 1 ORDER BY date DESC"
    );
  }

  // Breadcrumbs title helper
  let pageTitle = '';
  let dbHtmlKey = '';
  switch (page) {
    case 'notices': 
      pageTitle = 'Student Notice Board'; 
      break;
    case 'anti-ragging': 
      pageTitle = 'Anti-Ragging Committee & Policy'; 
      dbHtmlKey = 'anti_ragging_html';
      break;
    case 'student-council': 
      pageTitle = 'Student Council Committee'; 
      break;
    case 'grievance': 
      pageTitle = 'Student Grievance Cell'; 
      dbHtmlKey = 'grievance_policy_html';
      break;
    default: notFound();
  }

  const dynamicHtml = dbHtmlKey ? settings[dbHtmlKey] : null;

  // Helper to verify if dynamic HTML actually has user content
  const hasContent = (html: string | null | undefined): boolean => {
    if (!html) return false;
    const cleanText = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim();
    const hasMedia = html.includes('<img') || html.includes('<iframe') || html.includes('<table') || html.includes('<details');
    return cleanText.length > 0 || hasMedia;
  };

  const showDynamicHtml = dynamicHtml && hasContent(dynamicHtml);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-1 font-sans">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-gray-600">Student Portal</span>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">{pageTitle}</span>
        </div>

        {/* Dynamic Page Card Wrapper */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-10 shadow-sm">
          <h2 className="font-serif text-3xl font-bold text-[#0A1F44] border-b-2 border-[#D4870A] pb-3.5 mb-8 tracking-tight flex items-center gap-3">
            {page === 'notices' && <Megaphone className="text-[#D4870A]" />}
            {page === 'anti-ragging' && <ShieldAlert className="text-red-600" />}
            {page === 'student-council' && <Award className="text-[#1B5E3B]" />}
            {page === 'grievance' && <HelpCircle className="text-[#0A1F44]" />}
            {pageTitle}
          </h2>

          {/* PAGE CONTENT RENDERING */}

          {showDynamicHtml ? (
            <div 
              className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans space-y-4"
              dangerouslySetInnerHTML={{ __html: dynamicHtml }}
            />
          ) : (
            <>
              {/* 1. Pinned Student notices */}
              {page === 'notices' && (
                <div className="space-y-6">
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-sans">
                    Official notifications, term examinations timetables, internal assessment rosters, and sports calendar updates are cataloged below.
                  </p>

                  {studentNotices.length === 0 ? (
                    <div className="text-center py-12 text-xs text-gray-400 font-sans border border-dashed rounded-lg border-gray-200">
                      No active student notifications are currently posted.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {studentNotices.map((n) => (
                        <div key={n.id} className="border border-gray-150 p-4 rounded-lg bg-gray-50/50 hover:bg-white transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <span className="text-[10px] text-gray-400 font-semibold block font-sans mb-1">{n.date}</span>
                            <Link 
                              href={n.link || '/downloads'} 
                              className="text-xs md:text-sm text-[#0A1F44] font-bold hover:underline leading-relaxed block"
                              target={n.link?.endsWith('.pdf') ? '_blank' : undefined}
                            >
                              {n.title}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {n.is_new === 1 && (
                              <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider animate-pulse-fast text-center">NEW</span>
                            )}
                            <Link href={n.link || '/downloads'} className="bg-[#0A1F44] hover:bg-[#162E5B] text-white text-[10px] font-bold font-ui py-1.5 px-3 rounded uppercase tracking-wider transition">
                              View
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Anti-Ragging Policy */}
              {page === 'anti-ragging' && (
                <div className="space-y-6 font-sans text-xs md:text-sm text-gray-700 leading-relaxed">
                  <div className="bg-red-50 border border-red-200 rounded p-4 flex gap-3 text-[#2D2D2D]">
                    <ShieldAlert className="text-red-600 shrink-0" size={24} />
                    <div>
                      <strong className="text-[#0A1F44] block mb-0.5 font-serif text-sm">Strict Zero-Tolerance Anti-Ragging Policy</strong>
                      As per the mandates of the Supreme Court of India and the DCI, ragging in any form is strictly banned inside college dormitories, clinics, and all campus premises. Offenders face immediate rustication and legal action.
                    </div>
                  </div>

                  <div className="bg-[#0A1F44]/5 p-5 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong className="text-[#0A1F44] block mb-1">National Anti-Ragging Helpline:</strong>
                      <span className="text-base font-bold text-red-600">1800-180-5522</span>
                      <span className="text-[10px] text-gray-400 block font-sans">Toll-free / 24 Hours active support</span>
                    </div>
                    <div>
                      <strong className="text-[#0A1F44] block mb-1">GDC Dibrugarh Safe Helpline:</strong>
                      <span className="text-base font-bold text-[#1B5E3B]">+91 373 2300123 ext 9</span>
                      <span className="text-[10px] text-gray-400 block font-sans">Student Welfare Cell / Principal Office</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#0A1F44] pt-4">Anti-Ragging Committee Members</h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs md:text-sm">
                    <table className="w-full text-left">
                      <thead className="bg-[#0A1F44] text-white font-ui uppercase tracking-wider text-[10px] font-semibold">
                        <tr>
                          <th className="px-6 py-3.5">Name</th>
                          <th className="px-6 py-3.5">Designation</th>
                          <th className="px-6 py-3.5">Role in Committee</th>
                          <th className="px-6 py-3.5">Contact Helpline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-[#2D2D2D] font-medium">
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-3 font-bold text-[#0A1F44]">Dr. Ramesh Chandra Das</td>
                          <td className="px-6 py-3 text-gray-600">Principal & Dean</td>
                          <td className="px-6 py-3 text-[#D4870A] font-bold">Chairman</td>
                          <td className="px-6 py-3">+91 373 2300123</td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-3 font-bold text-[#0A1F44]">Dr. Pranab Jyoti Baruah</td>
                          <td className="px-6 py-3 text-gray-600">Associate Professor</td>
                          <td className="px-6 py-3">Member Secretary</td>
                          <td className="px-6 py-3">+91 373 2300124</td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-3 font-bold text-[#0A1F44]">Dr. Swapna Dutta</td>
                          <td className="px-6 py-3 text-gray-600">Professor & HOD</td>
                          <td className="px-6 py-3">Student Welfare Officer</td>
                          <td className="px-6 py-3">+91 373 2300125</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. Student Council */}
              {page === 'student-council' && (
                <div className="space-y-6 font-sans text-xs md:text-sm text-gray-700 leading-relaxed">
                  <p>
                    The **Student Council** is an elected student union body coordinating cultural weeks, scientific forums, sports tournaments, and representing student interests in campus academic dialogues.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: 'Satyajit Saikia', role: 'President (BDS 4th Year)', desc: 'Coordinates union meetings, student events, and represents the student body.' },
                      { name: 'Nayanmoni Borah', role: 'General Secretary (BDS 3rd Year)', desc: 'Supervises college sports festivals, student publications, and cultural activities.' },
                      { name: 'Juri Gogoi', role: 'Academic Secretary (BDS 2nd Year)', desc: 'Organizes academic seminars and acts as a liaison with the library committee.' }
                    ].map((council, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-5 text-center bg-[#F8F9FA] hover:shadow-md transition">
                        <div className="h-10 w-10 rounded-full bg-[#1B5E3B]/10 text-[#1B5E3B] flex items-center justify-center mx-auto mb-3">
                          <UserCheck size={18} />
                        </div>
                        <h4 className="font-serif font-bold text-sm text-[#0A1F44]">{council.name}</h4>
                        <span className="text-[10px] text-[#D4870A] font-bold uppercase tracking-wider block mt-1 mb-2 font-ui">{council.role}</span>
                        <p className="text-[11px] text-gray-500 leading-normal font-sans">{council.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Student Grievance Cell */}
              {page === 'grievance' && (
                <div className="space-y-6 font-sans text-xs md:text-sm text-gray-700 leading-relaxed">
                  <p>
                    GDC Dibrugarh takes campus grievances, harassment disputes, and security queries seriously. Student complaints are reviewed in absolute confidentiality.
                  </p>

                  <div className="bg-[#0A1F44]/5 p-5 rounded-lg border border-gray-200">
                    <h3 className="font-serif text-base font-bold text-[#0A1F44] mb-3">Submit Grievance or Feedback</h3>
                    <p className="mb-4">
                      Complaints can be logged physically through the safe drop-boxes near the Dean\'s office or submitted online via our contact portal.
                    </p>
                    <Link href="/contact-us?tab=grievance" className="bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold font-ui py-2.5 px-6 rounded uppercase tracking-wider transition shadow-sm inline-block">
                      Go to Grievance Form &raquo;
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
