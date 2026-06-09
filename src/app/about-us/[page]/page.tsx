import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { 
  Building, Shield, FileText, UserCheck, HelpCircle, 
  Download, Users, BookOpen, Clock, Heart, Award, ArrowRight
} from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  params: {
    page: string;
  };
}

export default async function AboutUsSubPage({ params }: PageProps) {
  const { page } = params;
  const db = await getDb();

  // Load site settings (for Dean name, address, etc. & dynamic HTML contents)
  const settingsRows = await db.all('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  settingsRows.forEach((row) => {
    settings[row.key] = row.value;
  });

  // Breadcrumbs title helper
  let pageTitle = '';
  let dbHtmlKey = '';
  switch (page) {
    case 'college': 
      pageTitle = 'About the College'; 
      dbHtmlKey = 'about_college_html';
      break;
    case 'hospital': 
      pageTitle = 'About the Hospital'; 
      dbHtmlKey = 'about_hospital_html';
      break;
    case 'principal-message': 
      pageTitle = "Principal & Dean's Message"; 
      break;
    case 'governing-body': 
      pageTitle = 'Governing Body / College Council'; 
      break;
    case 'administration': 
      pageTitle = 'Administrative Officers'; 
      break;
    case 'disclosure': 
      pageTitle = 'Mandatory DCI Disclosures'; 
      break;
    case 'rti': 
      pageTitle = 'Right to Information (RTI)'; 
      dbHtmlKey = 'rti_html'; // Added for flexibility
      break;
    default: notFound();
  }

  // Check if admin has customized this page's HTML content in database settings
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
          <span className="text-gray-600">About Us</span>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">{pageTitle}</span>
        </div>

        {/* Dynamic Page Card Wrapper */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-10 shadow-sm">
          <h2 className="font-serif text-3xl font-bold text-[#0A1F44] border-b-2 border-[#D4870A] pb-3.5 mb-8 tracking-tight flex items-center gap-3">
            {page === 'college' && <Building className="text-[#D4870A]" />}
            {page === 'hospital' && <Heart className="text-[#1B5E3B]" />}
            {page === 'principal-message' && <Award className="text-[#D4870A]" />}
            {page === 'governing-body' && <Users className="text-[#0A1F44]" />}
            {page === 'administration' && <UserCheck className="text-[#1B5E3B]" />}
            {page === 'disclosure' && <Shield className="text-[#D4870A]" />}
            {page === 'rti' && <HelpCircle className="text-[#0A1F44]" />}
            {pageTitle}
          </h2>

          {/* PAGE CONTENT RENDERING */}

          {/* Render custom dynamic HTML if available */}
          {showDynamicHtml ? (
            <div 
              className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans space-y-4"
              dangerouslySetInnerHTML={{ __html: dynamicHtml }}
            />
          ) : (
            <>
              {/* 1. College History, Vision & Mission */}
              {page === 'college' && (
                <div className="space-y-6 font-sans text-xs md:text-sm text-gray-700 leading-relaxed">
                  <p>
                    <strong>Government Dental College & Hospital, Dibrugarh</strong> was established in the year 2018 under the aegis of the Department of Health & Family Welfare, Government of Assam. It stands as a pinnacle of professional clinical excellence in North-East India, catering to advanced dental pedagogy and premium tertiary level healthcare.
                  </p>
                  
                  <div className="bg-[#F8F9FA] border-l-4 border-[#1B5E3B] p-4 rounded-r my-6">
                    <h4 className="font-serif font-bold text-sm text-[#1B5E3B] uppercase mb-1">Our Core Vision</h4>
                    <p className="italic text-gray-600">
                      &ldquo;To be a premier center of global repute in dental education, research-forward methodologies, and compassionate clinical treatments; rendering state-of-the-art oral healthcare accessible to all strata of society.&rdquo;
                    </p>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#0A1F44] pt-4">Our Missions</h3>
                  <ul className="space-y-3 list-disc pl-5">
                    <li>Provide outstanding, research-guided undergraduate (BDS) and postgraduate (MDS) professional training to scholars.</li>
                    <li>Conduct innovative, ethically-vetted clinical investigations and diagnostic trials inside community care programs.</li>
                    <li>Deploy advanced public dental health camps, fluoride surveys, and oral hygiene outreach drives in tea gardens and rural areas of Upper Assam.</li>
                    <li>Deliver top-tier tertiary level operative, restorative, surgical, and prosthetic clinical treatments with optimal engineering precision.</li>
                  </ul>
                </div>
              )}

              {/* 2. About the Hospital wing */}
              {page === 'hospital' && (
                <div className="space-y-6 font-sans text-xs md:text-sm text-gray-700 leading-relaxed">
                  <p>
                    The clinical wing of <strong>GDC Dibrugarh</strong> operates as a state-of-the-art dental hospital serving a vast geographical terrain in Upper Assam, parts of Arunachal Pradesh, and Nagaland. Backed by specialist faculty and advanced clinical setups, the hospital serves over 150 patients daily.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="bg-[#0A1F44]/5 border border-gray-100 p-4 rounded text-center">
                      <span className="text-xl font-bold text-[#0A1F44] block">150+</span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Daily OPD Caseload</span>
                    </div>
                    <div className="bg-[#1B5E3B]/5 border border-gray-100 p-4 rounded text-center">
                      <span className="text-xl font-bold text-[#1B5E3B] block">9 Specialty</span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Dental Clinics</span>
                    </div>
                    <div className="bg-[#D4870A]/5 border border-gray-100 p-4 rounded text-center">
                      <span className="text-xl font-bold text-[#D4870A] block">100% Free</span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Undergraduate Prophylaxis</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#0A1F44] pt-4">Key Specialized Clinics</h3>
                  <ul className="space-y-3.5 list-disc pl-5">
                    <li><strong>Cleft Lip & Reconstructive Clinic</strong>: Led by Oral & Maxillofacial Surgeons providing comprehensive facial reconstructions.</li>
                    <li><strong>Laser Periodontal Suite</strong>: Advanced laser-assisted pocket debridement and gum therapies.</li>
                    <li><strong>Micro-Endodontic Wing</strong>: Precision root canal treatments utilizing clinical operating microscopes.</li>
                    <li><strong>Implant Rehabilitation Lab</strong>: Advanced screw-retained implant restorations and sinus-lift procedures.</li>
                    <li><strong>Geriatric & Special Needs Dentistry</strong>: Safe, accessible dental care for geriatric and medically compromised patients.</li>
                  </ul>
                </div>
              )}

              {/* 3. Principal's message */}
              {page === 'principal-message' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 text-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="h-48 w-48 rounded-full bg-gradient-to-tr from-[#0A1F44] to-[#1B5E3B] mx-auto overflow-hidden shadow border-4 border-white mb-4 flex items-center justify-center text-white font-serif font-bold text-3xl">
                      {settings.dean_photo && !settings.dean_photo.includes('placeholders') ? (
                        <img src={settings.dean_photo} alt="Principal & Dean" className="h-full w-full object-cover" />
                      ) : (
                        'DEAN'
                      )}
                    </div>
                    <h4 className="font-serif text-base font-bold text-[#0A1F44]">{settings.dean_name || 'Dr. Ramesh Chandra Das, MDS'}</h4>
                    <p className="text-[10px] text-[#1B5E3B] font-bold uppercase tracking-wider font-ui mt-1">Principal & Dean</p>
                    <p className="text-[9px] text-gray-400 mt-2">Government Dental College, Dibrugarh</p>
                  </div>
                  <div className="md:col-span-2 space-y-4 font-sans text-xs md:text-sm text-gray-700 leading-relaxed">
                    <p className="font-semibold text-[#0A1F44]">Dear Students, Scholars, Patients, and Well-wishers,</p>
                    <p>
                      It is a matter of profound pride to welcome you all to the digital portal of **Government Dental College & Hospital, Dibrugarh**. Since our founding in 2018, our journey has been defined by academic excellence, state-of-the-art infrastructure, and compassionate patient care.
                    </p>
                    <p>
                      As a government institution affiliated with Dibrugarh University and recognized by the Dental Council of India, we are committed to building highly skilled, ethical, and community-conscious dental surgeons. Our students learn in advanced, fully-equipped clinics, utilizing state-of-the-art diagnostic imaging, CBCT scans, and surgical endodontics.
                    </p>
                    <p>
                      Our tertiary hospital caters to Upper Assam with highly subsidized, high-quality dental surgeries. We remain committed to rural community outreach, screening camps, and scientific research. I invite you to explore our portals for admissions, notifications, and clinical services.
                    </p>
                    <div className="pt-4 italic font-serif text-xs text-gray-400">
                      Warm regards,<br />
                      <strong className="text-gray-600 block mt-1">{settings.dean_name || 'Dr. Ramesh Chandra Das, MDS'}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Governing Body */}
              {page === 'governing-body' && (
                <div className="space-y-6">
                  <p className="text-xs md:text-sm text-gray-600">
                    The College Council / Governing Body supervises academic audits, financial approvals, infrastructure expansions, and strict code-of-conduct enforcement at GDC Dibrugarh.
                  </p>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-left text-xs md:text-sm">
                      <thead className="bg-[#0A1F44] text-white font-ui font-semibold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Designation</th>
                          <th className="px-6 py-4">Role in Council</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-[#2D2D2D]">
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-bold">{settings.dean_name || 'Dr. Ramesh Chandra Das'}</td>
                          <td className="px-6 py-4">Principal & Dean</td>
                          <td className="px-6 py-4 text-[#D4870A] font-bold">Chairman</td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-bold">Dr. Pranab Jyoti Baruah</td>
                          <td className="px-6 py-4">Medical Superintendent</td>
                          <td className="px-6 py-4">Member Secretary</td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-bold">Dr. Bikramjit Phukan</td>
                          <td className="px-6 py-4">Professor & HOD, OMFS</td>
                          <td className="px-6 py-4">Academic Registrar</td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-bold">Dr. Ananya Sarma</td>
                          <td className="px-6 py-4">Professor & HOD, OMR</td>
                          <td className="px-6 py-4">Research Council Chairman</td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-bold">Dr. Swapna Dutta</td>
                          <td className="px-6 py-4">Professor & HOD, Oral Pathology</td>
                          <td className="px-6 py-4">Dean of Student Welfare</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 5. Administration */}
              {page === 'administration' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { name: settings.dean_name || 'Dr. Ramesh Chandra Das', role: 'Principal & Dean', icon: UserCheck, desc: 'Administrative and Academic supreme head of the college.' },
                    { name: 'Dr. Pranab Jyoti Baruah', role: 'Medical Superintendent', icon: Users, desc: 'Manages clinical operations, diagnostics, and patient welfare.' },
                    { name: 'Dr. Bikramjit Phukan', role: 'Academic Coordinator', icon: BookOpen, desc: 'Supervises university schedules, BDS/MDS terms, and curricula.' },
                    { name: 'Sri Mukul Gogoi', role: 'Administrative Head Clerk', icon: Clock, desc: 'Manages administrative operations, tenders documentation, and official records.' }
                  ].map((admin, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-5 text-center bg-[#F8F9FA] hover:shadow-md transition">
                      <div className="h-12 w-12 rounded-full bg-[#1B5E3B]/10 text-[#1B5E3B] flex items-center justify-center mx-auto mb-4">
                        <admin.icon size={22} />
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#0A1F44]">{admin.name}</h4>
                      <span className="text-[10px] text-[#D4870A] font-bold uppercase tracking-wider block mt-1 mb-2 font-ui">{admin.role}</span>
                      <p className="text-[11px] text-gray-500 leading-normal font-sans">{admin.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* 6. Mandatory Disclosure */}
              {page === 'disclosure' && (
                <div className="space-y-6">
                  <p className="text-xs md:text-sm text-gray-600">
                    In compliance with the Dental Council of India (DCI) mandatory guidelines, Government Dental College & Hospital, Dibrugarh hosts its official performance charts, structural tables, and recognitions certificates here.
                  </p>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded p-4 text-xs flex gap-3 text-[#2D2D2D]">
                    <FileText className="text-[#D4870A] shrink-0" size={20} />
                    <div>
                      <strong className="text-[#0A1F44] block mb-0.5 font-serif text-sm">Download Official Prospectus & Approvals</strong>
                      Academic admissions details, seats allocations matrices, infrastructure details, and clinical equipment lists are available in our official prospectus PDF.
                      <Link href="/downloads" className="text-[#1B5E3B] font-bold hover:underline block mt-1.5 flex items-center gap-0.5">
                        Go to downloads center <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs md:text-sm mt-4">
                    <table className="w-full text-left">
                      <thead className="bg-[#0A1F44] text-white font-ui uppercase text-[10px] font-semibold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Required Parameters</th>
                          <th className="px-6 py-4">Details / Values</th>
                          <th className="px-6 py-4">Verification Certificate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-[#2D2D2D]">
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-semibold">Affiliating University</td>
                          <td className="px-6 py-4">Dibrugarh University, Assam</td>
                          <td className="px-6 py-4">
                            <Link href="/downloads" className="text-[#1B5E3B] hover:underline font-bold flex items-center gap-1">
                              <Download size={12} /> View Certificate
                            </Link>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-semibold">DCI Recognition Status</td>
                          <td className="px-6 py-4">Fully Recognized for BDS (50 Annual Seats)</td>
                          <td className="px-6 py-4">
                            <Link href="/downloads" className="text-[#1B5E3B] hover:underline font-bold flex items-center gap-1">
                              <Download size={12} /> DCI Order
                            </Link>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-semibold">Annual Admission Capacity</td>
                          <td className="px-6 py-4">BDS: 50 | MDS: 18 (Planned)</td>
                          <td className="px-6 py-4">
                            <Link href="/downloads" className="text-[#1B5E3B] hover:underline font-bold flex items-center gap-1">
                              <Download size={12} /> Seats Matrix
                            </Link>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-semibold">Anti-Ragging Committee</td>
                          <td className="px-6 py-4">Formed & Checked (No incidents reported)</td>
                          <td className="px-6 py-4">
                            <Link href="/student-portal/anti-ragging" className="text-[#1B5E3B] hover:underline font-bold flex items-center gap-1">
                              <Download size={12} /> Committee List
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. RTI */}
          {page === 'rti' && (
            <div className="space-y-6">
              <p className="text-xs md:text-sm text-gray-600">
                In compliance with Section 4(1)(b) of the Right to Information Act, 2005, GDC Dibrugarh maintains public lists of its Public Information Officers (PIOs) and Appellate Authorities to ensure total operational transparency.
              </p>

              <div className="bg-[#F8F9FA] p-5 rounded-lg border border-gray-200">
                <h3 className="font-serif text-base font-bold text-[#0A1F44] mb-3.5">RTI Appellate Authority</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                  <div>
                    <strong className="text-gray-500 block">First Appellate Authority:</strong>
                    <span className="font-bold text-[#2D2D2D]">{settings.dean_name || 'Dr. Ramesh Chandra Das'}</span>
                    <span className="text-xs block text-gray-400">Principal & Dean, GDC Dibrugarh</span>
                  </div>
                  <div>
                    <strong className="text-gray-500 block">Public Information Officer (PIO):</strong>
                    <span className="font-bold text-[#2D2D2D]">Dr. Pranab Jyoti Baruah</span>
                    <span className="text-xs block text-gray-400">Associate Professor, GDC Dibrugarh</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0A1F44]/5 p-4 rounded border border-[#0A1F44]/10 text-xs flex gap-3 text-[#2D2D2D]">
                <HelpCircle className="text-[#0A1F44] shrink-0" size={20} />
                <div>
                  <strong className="text-[#0A1F44] block mb-0.5 font-serif text-sm">How to File an RTI Application?</strong>
                  Applications can be sent to the PIO on standard plain paper or online via the central portal along with the prescribed Rs. 10 postal stamp or demand draft made out to the Chairman.
                  <Link href="/downloads" className="text-[#1B5E3B] font-bold hover:underline block mt-1.5 flex items-center gap-0.5">
                    Download RTI Form Sample &raquo;
                  </Link>
                </div>
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
