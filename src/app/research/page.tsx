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
              
              {researchHtml ? (
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

            {/* ongoing research projects */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                <Layers className="text-[#1B5E3B]" size={20} /> Active Research Projects
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-6 font-sans">
                Our clinical departments run dynamic investigations funded by national and state agencies:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-100 p-4 rounded bg-[#F8F9FA] text-xs">
                  <span className="inline-block bg-[#1B5E3B]/10 text-[#1B5E3B] text-[8px] font-bold py-0.5 px-2 rounded-full mb-2 uppercase">
                    Epidemiology
                  </span>
                  <strong className="text-[#0A1F44] block mb-1 font-serif text-sm">Oral Health Screenings in Tea Gardens</strong>
                  - <strong>Principal Investigator</strong>: Dr. Deepjyoti Gogoi (Public Health)<br />
                  - <strong>Objective</strong>: Evaluation of periodontal conditions and mucosal lesions in Upper Assam garden workers.<br />
                  <strong className="text-gray-500 block mt-2 text-[10px]">Funding Agency: State Health Mission</strong>
                </div>
                <div className="border border-gray-100 p-4 rounded bg-[#F8F9FA] text-xs">
                  <span className="inline-block bg-[#D4870A]/10 text-[#D4870A] text-[8px] font-bold py-0.5 px-2 rounded-full mb-2 uppercase">
                    Therapeutics
                  </span>
                  <strong className="text-[#0A1F44] block mb-1 font-serif text-sm">Efficacy of Laser Periodontal Debridement</strong>
                  - <strong>Principal Investigator</strong>: Dr. Ranjit Konwar (Periodontics)<br />
                  - <strong>Objective</strong>: Comparative trial evaluating laser-assisted pocket curettage vs conventional scaling.<br />
                  <strong className="text-gray-500 block mt-2 text-[10px]">Funding Agency: Institutional Research Cell</strong>
                </div>
              </div>
            </div>

            {/* MOUs & Collaborations */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                <CheckCircle className="text-[#0A1F44]" size={20} /> Academic MOUs & Collaborations
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-4 font-sans">
                Fostering inter-disciplinary clinical studies and postgraduate training exchanges:
              </p>
              <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs md:text-sm">
                <table className="w-full text-left">
                  <thead className="bg-[#0A1F44] text-white font-ui uppercase tracking-wider text-[10px] font-semibold">
                    <tr>
                      <th className="px-6 py-3.5">Institution Name</th>
                      <th className="px-6 py-3.5">Purpose of Collaboration</th>
                      <th className="px-6 py-3.5">Date of Sign</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[#2D2D2D] font-medium">
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-bold text-[#0A1F44]">Assam Medical College (AMCH)</td>
                      <td className="px-6 py-3 text-gray-600">Inter-disciplinary Maxillofacial Trauma & Surgical Rotations</td>
                      <td className="px-6 py-3 text-[#1B5E3B]">September 2024</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-bold text-[#0A1F44]">Dibrugarh University Science Dept</td>
                      <td className="px-6 py-3 text-gray-600">Molecular Oral Microbiological Assays & Histopath research</td>
                      <td className="px-6 py-3 text-[#1B5E3B]">March 2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Side column: Committee lists (1 Column) */}
          <div className="space-y-6">
            
            {/* Ethical committee list */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h4 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4">Ethical Committee</h4>
              
              {ethicalHtml ? (
                <div 
                  className="text-xs text-gray-600 leading-relaxed font-sans"
                  dangerouslySetInnerHTML={{ __html: ethicalHtml }}
                />
              ) : (
                <ul className="space-y-3.5 text-xs text-gray-600">
                  <li>
                    <strong className="text-gray-800 block">Chairman:</strong>
                    Dr. Ramesh Chandra Das, MDS
                  </li>
                  <li>
                    <strong className="text-gray-800 block">External Expert Jurist:</strong>
                    Advocate Sri Nabajyoti Baruah
                  </li>
                  <li>
                    <strong className="text-gray-800 block">Member Secretary:</strong>
                    Dr. Ananya Sarma (HOD, OMR)
                  </li>
                  <li>
                    <strong className="text-gray-800 block">Basic Medical Scientist:</strong>
                    Dr. Pranab Jyoti Baruah
                  </li>
                </ul>
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
