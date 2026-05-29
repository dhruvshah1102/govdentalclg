import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { 
  GraduationCap, BookOpen, Calendar, Clock, Award, 
  Download, FileText, CheckCircle, ArrowRight
} from 'lucide-react';

export const revalidate = 0;

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

          {dynamicHtml ? (
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
                    The **Bachelor of Dental Surgery (BDS)** is a premier undergraduate professional program of 5 years duration (4 years academic coursework + 1 year mandatory rotating internship). It is affiliated to **Dibrugarh University** and recognized by the **Dental Council of India (DCI)**.
                  </p>

                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded text-xs flex gap-3 text-[#2D2D2D]">
                    <CheckCircle className="text-[#1B5E3B] shrink-0" size={20} />
                    <div>
                      <strong className="text-[#0A1F44] block mb-0.5 font-serif text-sm">Key Facts: BDS Program</strong>
                      - <strong>Annual Intake Capacity</strong>: 50 Students<br />
                      - <strong>Admission Channel</strong>: NEET-UG State & All India Counselling<br />
                      - <strong>Course Duration</strong>: 4 Years Academics + 1 Year Internship
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#0A1F44] pt-4">Eligibility Criteria</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Candidate must have completed 17 years of age on or before 31st December of the admission year.</li>
                    <li>Must have passed 10+2 Higher Secondary with Physics, Chemistry, Biology, and English individually, securing at least 50% cumulative marks (40% for SC/ST/OBC categories).</li>
                    <li>Must have qualified the national level NEET-UG conducted by NTA in the current academic session.</li>
                  </ul>

                  <h3 className="font-serif text-lg font-bold text-[#0A1F44] pt-4">BDS Syllabus Overview</h3>
                  <p>
                    The curriculum follows the strict guidelines of the DCI, covering basic medical sciences (Anatomy, Physiology, Biochemistry, Pharmacology, General Pathology, Microbiology) alongside dental sciences (Dental Anatomy, Histology, Oral Pathology, Conservative Dentistry, Prosthodontics, Orthodontics, Periodontics, Pedodontics, and Oral & Maxillofacial Surgery) inside extensive preclinical labs and clinical clinics.
                  </p>

                  <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-4">
                    <Link href="/admissions" className="bg-[#D4870A] hover:bg-[#EAA023] text-white text-xs font-bold font-ui py-2.5 px-6 rounded uppercase tracking-wider transition shadow-sm">
                      Admission Guidelines
                    </Link>
                    <Link href="/downloads" className="border-2 border-gray-300 hover:border-[#1B5E3B] text-gray-600 hover:text-[#1B5E3B] text-xs font-bold font-ui py-2 px-5 rounded uppercase tracking-wider transition">
                      Download BDS Curriculum PDF
                    </Link>
                  </div>
                </div>
              )}

              {/* 2. MDS Postgrad program details */}
              {page === 'mds' && (
                <div className="space-y-6 font-sans text-xs md:text-sm text-gray-700 leading-relaxed">
                  <p>
                    The **Master of Dental Surgery (MDS)** is a highly specialized postgraduate professional program of 3 years duration. GDC Dibrugarh is actively expanding its academic capacities to support 18 PG seats across various core clinical specialities.
                  </p>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded text-xs flex gap-3 text-[#2D2D2D]">
                    <Award className="text-[#D4870A] shrink-0" size={20} />
                    <div>
                      <strong className="text-[#0A1F44] block mb-0.5 font-serif text-sm">Key Facts: MDS Program</strong>
                      - <strong>Admission Channel</strong>: NEET-MDS National Counselling<br />
                      - <strong>Course Duration</strong>: 3 Years Residency & Thesis<br />
                      - <strong>Specialties Planned</strong>: Conservative Dentistry, Oral & Maxillofacial Surgery, Prosthodontics, and OMR.
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#0A1F44] pt-4">Eligibility & Specializations</h3>
                  <p>
                    Candidates must hold a recognized BDS degree from an Indian University recognized by the DCI, have completed their 1-year rotating internship, and hold active registration with the State Dental Council. Admission is strictly based on NEET-MDS merit.
                  </p>

                  <h3 className="font-serif text-lg font-bold text-[#0A1F44] pt-4">Residency Requirements</h3>
                  <p>
                    Residency program demands rigorous clinical rotations, publication of research-vetted papers, presenting scientific paper/posters, and submitting a detailed experimental research thesis before final examinations.
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
                  <p className="text-xs md:text-sm text-gray-600">
                    Classes schedules, preclinical lab rosters, and hospital clinical rotation boards for BDS 1st, 2nd, 3rd, and 4th years are published below.
                  </p>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs md:text-sm mt-4">
                    <table className="w-full text-left">
                      <thead className="bg-[#0A1F44] text-white font-ui uppercase text-[10px] font-semibold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">BDS Professional Year</th>
                          <th className="px-6 py-4">Current Session Timetable</th>
                          <th className="px-6 py-4">Last Updated</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-[#2D2D2D]">
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-semibold">BDS 1st Year (Batch 2025-26)</td>
                          <td className="px-6 py-4">
                            <Link href="/downloads" className="text-[#1B5E3B] hover:underline font-bold flex items-center gap-1">
                              <Download size={12} /> Download PDF (1.2 MB)
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-gray-400">March 2026</td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-semibold">BDS 2nd Year (Batch 2024-25)</td>
                          <td className="px-6 py-4">
                            <Link href="/downloads" className="text-[#1B5E3B] hover:underline font-bold flex items-center gap-1">
                              <Download size={12} /> Download PDF (1.1 MB)
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-gray-400">February 2026</td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-semibold">BDS 3rd Year (Batch 2023-24)</td>
                          <td className="px-6 py-4">
                            <Link href="/downloads" className="text-[#1B5E3B] hover:underline font-bold flex items-center gap-1">
                              <Download size={12} /> Download PDF (1.4 MB)
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-gray-400">April 2026</td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-semibold">BDS 4th Year & Interns</td>
                          <td className="px-6 py-4">
                            <Link href="/downloads" className="text-[#1B5E3B] hover:underline font-bold flex items-center gap-1">
                              <Download size={12} /> Download PDF (1.5 MB)
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-gray-400">May 2026</td>
                        </tr>
                      </tbody>
                    </table>
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
