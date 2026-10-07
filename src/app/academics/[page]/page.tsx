import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { 
  GraduationCap, BookOpen, Calendar, Clock, Award, 
  Download, FileText, CheckCircle, ArrowRight
} from 'lucide-react';

export const revalidate = 900;

// Render each param on first request, then cache it (ISR) instead of querying the database every time.
export function generateStaticParams() {
  return [];
}

interface PageProps {
  params: {
    page: string;
  };
}

export default async function AcademicsSubPage({ params }: PageProps) {
  const { page } = params;
  const db = await getDb();

  // Load site settings (for Dynamic HTML pages)
  const settingsRows = await db.all('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  settingsRows.forEach((row) => {
    settings[row.key] = row.value;
  });

  // Breadcrumbs title helper
  let pageTitle = '';
  let dbHtmlKey = '';
  switch (page) {
    case 'bds': 
      pageTitle = 'BDS Undergraduate Programme'; 
      dbHtmlKey = 'bds_curriculum_html';
      break;
    case 'mds': 
      pageTitle = 'MDS Postgraduate Programmes'; 
      dbHtmlKey = 'mds_curriculum_html';
      break;
    case 'calendar': 
      pageTitle = 'Academic Calendar & Timetable'; 
      break;
    case 'timetable': 
      pageTitle = 'Class Roster & Timetables'; 
      break;
    case 'scholarships': 
      pageTitle = 'Scholarships & Financial Aid'; 
      dbHtmlKey = 'scholarships_html';
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
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-4 font-sans flex items-center gap-1">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-gray-600">Academics</span>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">{pageTitle}</span>
        </div>

        {/* Dynamic Page Card Wrapper */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-10 shadow-sm">
          <h2 className="font-serif text-3xl font-bold text-[#0A1F44] border-b-2 border-[#D4870A] pb-3.5 mb-8 tracking-tight flex items-center gap-3">
            {page === 'bds' && <GraduationCap className="text-[#D4870A]" />}
            {page === 'mds' && <Award className="text-[#1B5E3B]" />}
            {page === 'calendar' && <Calendar className="text-[#0A1F44]" />}
            {page === 'timetable' && <Clock className="text-[#1B5E3B]" />}
            {page === 'scholarships' && <Award className="text-[#D4870A]" />}
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
              {/* 1. BDS Undergrad program details */}
              {page === 'bds' && (
                <div className="space-y-6 font-sans text-xs md:text-sm text-gray-700 leading-relaxed">
                  <p>
                    The **Bachelor of Dental Surgery (BDS)** is an undergraduate professional degree program of 5 years' duration (4 years academic coursework + 1 year compulsory rotating paid internship). It is affiliated with **Srimanta Sankardeva University of Health Sciences, Guwahati** and recognised by the **Ministry of Health and Family Welfare, Govt of India & National Dental Commission, New Delhi**.
                  </p>

                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded text-xs flex gap-3 text-[#2D2D2D]">
                    <CheckCircle className="text-[#1B5E3B] shrink-0" size={20} />
                    <div>
                      <strong className="text-[#0A1F44] block mb-0.5 font-serif text-sm">Key Facts: BDS Program</strong>
                      - <strong>Annual Intake Capacity</strong>: 63 Students<br />
                      - <strong>Admission Channel</strong>: NEET-UG State & All India Counselling<br />
                      - <strong>Course Duration</strong>: 4 Years Academics + 1 Year Rotating Internship<br />
                      - <strong>Internship Stipend</strong>: Official stipend is offered to rotating interns
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#0A1F44] pt-4">Eligibility Criteria</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Candidate must have completed 17 years of age on or before 31st December of the admission year.</li>
                    <li>Must have passed 10+2 Higher Secondary with Physics, Chemistry, Biology, and English individually, securing at least 50% aggregate marks in Physics, Chemistry, and Biology (40% for SC/ST/OBC categories).</li>
                    <li>Must have qualified the national level NEET-UG conducted by NTA in the current academic session.</li>
                  </ul>

                  <h3 className="font-serif text-lg font-bold text-[#0A1F44] pt-4">BDS Syllabus Overview</h3>
                  <p>
                    The curriculum follows the statutory guidelines of the National Dental Commission (NDC) / DCI Revised BDS Course Regulations, covering basic medical sciences alongside dental operative specialties across comprehensive preclinical laboratories and hospital clinical postings.
                  </p>

                  <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-4">
                    <Link href="/admissions" className="bg-[#D4870A] hover:bg-[#EAA023] text-white text-xs font-bold font-ui py-2.5 px-6 rounded uppercase tracking-wider transition shadow-sm">
                      Admission Guidelines
                    </Link>
                    <a 
                      href="https://dciindia.gov.in/Rule_Regulation/Revised_BDS_Course_Regulation_2007.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="border-2 border-gray-300 hover:border-[#1B5E3B] text-gray-600 hover:text-[#1B5E3B] text-xs font-bold font-ui py-2 px-5 rounded uppercase tracking-wider transition inline-flex items-center gap-1.5"
                    >
                      Revised BDS Course Regulation PDF &raquo;
                    </a>
                  </div>
                </div>
              )}

              {/* 2. MDS Postgrad program details */}
              {page === 'mds' && (
                <div className="space-y-6 font-sans text-xs md:text-sm text-gray-700 leading-relaxed">
                  <p>
                    The **Master of Dental Surgery (MDS)** is a highly specialized postgraduate professional program of 3 years' duration. GDC Dibrugarh has applied for MDS recognition and is awaiting approval to commence postgraduate specialty programmes.
                  </p>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded text-xs flex gap-3 text-[#2D2D2D]">
                    <Award className="text-[#D4870A] shrink-0" size={20} />
                    <div>
                      <strong className="text-[#0A1F44] block mb-0.5 font-serif text-sm">Key Facts: MDS Program</strong>
                      - <strong>Status</strong>: Applied for Recognition (not yet commenced)<br />
                      - <strong>Admission Channel</strong>: NEET-MDS National Counselling (upon recognition)<br />
                      - <strong>Course Duration</strong>: 3 Years Residency & Thesis<br />
                      - <strong>Specialties</strong>: To be announced upon recognition.
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#0A1F44] pt-4">Eligibility & Specializations</h3>
                  <p>
                    Candidates must hold a recognized BDS degree from an Indian University recognized by the DCI, have completed their 1-year rotating internship, and hold active registration with the State Dental Council. Admission is strictly based on NEET-MDS merit.
                  </p>

                  <h3 className="font-serif text-lg font-bold text-[#0A1F44] pt-4">Residency Requirements</h3>
                  <p>
                    The residency program demands rigorous clinical rotations, publication of peer-reviewed papers, presentation of scientific papers/posters, and submission of a detailed research thesis before final examinations.
                  </p>
                </div>
              )}

              {/* 3. Calendar & Timetables */}
              {page === 'calendar' && (
                <div className="space-y-6">
                  <p className="text-xs md:text-sm text-gray-600">
                    The academic year calendar outlines term divisions, professional exam schedules, sports/cultural weeks, and university vacation boards. Keep updated with the official published timetables.
                  </p>
                  
                  <div className="bg-emerald-50 border border-emerald-200 rounded p-4 text-xs flex gap-3 text-[#2D2D2D] mb-6">
                    <FileText className="text-[#1B5E3B] shrink-0" size={20} />
                    <div>
                      <strong className="text-[#0A1F44] block mb-0.5 font-serif text-sm">Live Notice Updates</strong>
                      Official announcements about examinations times, internal assessments, and university links are regularly uploaded in our central Downloads repository.
                      <Link href="/downloads" className="text-[#1B5E3B] font-bold hover:underline block mt-1.5 flex items-center gap-0.5">
                        Download Current Session Calendar PDF <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Timetables specific */}
              {page === 'timetable' && (
                <div className="space-y-6">
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-sans">
                    Class schedules, preclinical laboratory rosters, and hospital clinical rotation boards for BDS professional batches are published through the Academic Office and posted on respective departmental notice boards.
                  </p>
                  <div className="bg-[#F8F9FA] border border-gray-200 rounded-lg p-6 text-center text-xs md:text-sm text-gray-600 font-sans space-y-3">
                    <FileText className="mx-auto text-[#1B5E3B]" size={28} />
                    <h4 className="font-serif font-bold text-[#0A1F44] text-base">Academic Session Timetables</h4>
                    <p className="max-w-md mx-auto text-gray-500 text-xs">
                      Official schedules for current academic sessions are notified as per college and university calendars. Please check the Downloads repository or consult the Academic Branch.
                    </p>
                    <Link href="/downloads" className="inline-block bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold font-ui py-2 px-4 rounded uppercase tracking-wider transition">
                      Check Downloads Section &raquo;
                    </Link>
                  </div>
                </div>
              )}

              {/* 5. Scholarships */}
              {page === 'scholarships' && (
                <div className="space-y-6 font-sans text-xs md:text-sm text-gray-700 leading-relaxed">
                  <p>
                    Various state and central government scholarship schemes are available for meritorious, SC, ST, OBC, and economically weaker scholars studying at GDC Dibrugarh.
                  </p>

                  <h3 className="font-serif text-lg font-bold text-[#0A1F44] pt-4">Key Financial Aid Schemes</h3>
                  <ul className="space-y-4 list-disc pl-5">
                    <li>
                      <strong>Post-Matric Scholarship (Govt of Assam)</strong>: Broad support for OBC, SC, and ST students enrolled in medical/dental programs, covering tuition fees and hostel allowances.
                    </li>
                    <li>
                      <strong>National Scholarship Portal (NSP) Schemes</strong>: Direct Benefit Transfer (DBT) funding for minority groups, single girl child scholarships, and merit scholarships.
                    </li>
                    <li>
                      <strong>Ishan Uday Special Scholarship Scheme (UGC)</strong>: Generous monthly financial support for students belonging to the North-Eastern Region (NER) pursuing technical degree courses.
                    </li>
                    <li>
                      <strong>Chief Minister\'s Special Scholarships</strong>: Incentives for top Rank-holders in state merit lists.
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
