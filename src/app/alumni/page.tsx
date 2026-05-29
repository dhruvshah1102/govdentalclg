import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { 
  Award, Shield, FileText, CheckCircle, 
  MapPin, HelpCircle, Users, BookOpen
} from 'lucide-react';
import { AlumniRegistrationClient } from './AlumniRegistrationClient';

export const revalidate = 0;

export default async function AlumniPage() {
  const db = await getDb();

  // Seed default notable alumni
  const notableAlumni = [
    { name: 'Dr. Amitav Baruah, MDS', batch: 'BDS Batch of 2018', role: 'Senior Resident, OMFS (AMCH Dibrugarh)', desc: 'Secured Top Rank in State PG NEET examinations and contributes back as visiting clinical supervisor.' },
    { name: 'Dr. Pallabi Gogoi, BDS', batch: 'BDS Batch of 2019', role: 'Chief Dental Officer, Smile Care Centre', desc: 'Pioneered advanced pediatric dentistry outreach clinics across Upper Assam rural blocks.' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-1 font-sans">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">Alumni Association</span>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0A1F44] to-[#1B5E3B] text-white rounded-lg p-6 md:p-10 mb-8 shadow">
          <span className="bg-[#D4870A] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded shadow">
            GDC LEGACY
          </span>
          <h1 className="font-serif text-3xl font-bold mt-3 mb-2 tracking-tight">
            GDC Dibrugarh Alumni Association
          </h1>
          <p className="text-xs md:text-sm text-gray-200 leading-relaxed max-w-2xl font-sans">
            Fostering lifelong ties with our medical graduates. Join the official alumni association, coordinate mentor relationships, and keep updated with campus growth.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main column: Association and registration form (2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Alumni */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                <Users className="text-[#D4870A]" size={20} /> About the Association
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-sans">
                The **Government Dental College Dibrugarh Alumni Association** is a dedicated forum for professional exchange, graduate mentorship, and scientific partnerships. Our alumni serve across civil hospitals, elite dental clinics, and research laboratories.
              </p>
            </div>

            {/* Registration Form Client widget */}
            <AlumniRegistrationClient />

          </div>

          {/* Side column: Notable graduates & newsletters (1 Column) */}
          <div className="space-y-6">
            
            {/* Notable Alumni cards */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h4 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4">Notable Alumni</h4>
              <div className="space-y-4">
                {notableAlumni.map((al, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0 text-xs">
                    <strong className="text-[#0A1F44] block font-serif text-sm">{al.name}</strong>
                    <span className="text-[10px] text-[#1B5E3B] font-bold block mb-1">{al.batch} &bull; {al.role}</span>
                    <p className="text-gray-500 font-sans leading-relaxed">{al.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter download box */}
            <div className="bg-[#0A1F44]/5 p-5 rounded-lg border border-gray-200">
              <h4 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-200 pb-2 mb-4">Alumni Newsletter</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Read clinical reports, campus achievements summaries, and association news inside our newsletters PDFs.
              </p>
              <Link href="/downloads" className="text-[#1B5E3B] hover:underline font-bold flex items-center gap-1 text-xs">
                <FileText size={14} /> Download Annual Report 2025
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
