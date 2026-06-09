import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { 
  Stethoscope, Layers, FileText, Mail, Phone, 
  MapPin, CheckCircle, Info, Users, BookOpen
} from 'lucide-react';

export const revalidate = 0;

interface DeptPageProps {
  params: {
    deptId: string;
  };
}

export default async function DepartmentDetailPage({ params }: DeptPageProps) {
  const { deptId } = params;
  const db = await getDb();

  // 1. Fetch Department Details
  const department = await db.get('SELECT * FROM departments WHERE id = ?', [deptId]);
  if (!department) {
    notFound();
  }

  // 2. Fetch Assigned Faculty & Staff
  const facultyList = await db.all(
    'SELECT * FROM faculty WHERE department_id = ? ORDER BY sort_order ASC, name ASC',
    [deptId]
  );

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 font-sans flex items-center gap-1">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-gray-600">Departments</span>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">{department.name}</span>
        </div>

        {/* Banner Hero Card */}
        {/* Banner Hero Card */}
        <div 
          className="bg-gradient-to-r from-[#0A1F44] to-[#1B5E3B] text-white rounded-lg p-8 md:p-12 mb-8 shadow relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: department.banner_image && !department.banner_image.includes('placeholders')
              ? `url(${department.banner_image})`
              : undefined
          }}
        >
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block bg-[#D4870A] text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3.5 rounded mb-4 shadow">
              Clinical Speciality
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow">
              Department of {department.name}
            </h1>
            <p className="text-xs md:text-base text-gray-200 leading-relaxed max-w-xl font-sans">
              Deploying state-of-the-art diagnostic protocols, advanced clinical surgeries, and research-led training at GDC Dibrugarh.
            </p>
          </div>
          {/* Overlay graphics */}
          <div className="absolute inset-0 bg-black/55"></div>
          <svg className="absolute right-0 bottom-0 opacity-15 text-white h-48 w-48" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="80%" cy="80%" r="50%" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="80%" cy="80%" r="35%" fill="none" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: About, Infrastructure, Clinical caseloads (2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About the Department */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <Info className="text-[#D4870A]" size={20} /> About the Department
              </h3>
              <div 
                className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans space-y-4"
                dangerouslySetInnerHTML={{ __html: department.about || 'Content to be seeded.' }}
              />
            </div>

            {/* Infrastructure / Equipment List */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <Layers className="text-[#1B5E3B]" size={20} /> Infrastructure & Advanced Facilities
              </h3>
              <div className="text-xs md:text-sm text-gray-700 leading-relaxed space-y-4 font-sans">
                <div dangerouslySetInnerHTML={{ __html: department.infrastructure || 'Equipment checklist details.' }} />
              </div>
            </div>

            {/* Clinical Services */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <Stethoscope className="text-[#0A1F44]" size={20} /> Clinical Services & Therapeutics Offered
              </h3>
              <div 
                className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans space-y-4"
                dangerouslySetInnerHTML={{ __html: department.clinical_services || 'Clinical care procedures.' }}
              />
            </div>

            {/* Research and Publications */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <BookOpen className="text-[#D4870A]" size={20} /> Research & Thesis Activities
              </h3>
              <div 
                className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans space-y-4"
                dangerouslySetInnerHTML={{ __html: department.research_activities || 'Ongoing clinical investigations and projects.' }}
              />
            </div>

            {/* Dynamic Faculty List */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-3 mb-6 flex items-center gap-2">
                <Users className="text-[#1B5E3B]" size={20} /> Teaching Faculty Directory
              </h3>
              
              {facultyList.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 font-sans">
                  No teaching faculty are assigned to this department yet.
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs md:text-sm">
                  <table className="w-full text-left">
                    <thead className="bg-[#0A1F44] text-white font-ui uppercase text-[10px] font-semibold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Designation</th>
                        <th className="px-6 py-4">Qualifications</th>
                        <th className="px-6 py-4">Specialization</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[#2D2D2D]">
                      {facultyList.map((f) => (
                        <tr key={f.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-bold text-[#0A1F44]">
                            {f.name}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-700">{f.designation}</td>
                          <td className="px-6 py-4 text-gray-500 italic">{f.qualifications}</td>
                          <td className="px-6 py-4 text-xs font-semibold text-[#1B5E3B]">{f.specialization || 'Clinical Dentistry'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

          {/* Column 3: HOD Card & Department Contact (1 Column) */}
          <div className="space-y-6">
            
            {/* HOD Card Widget */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm text-center hover:shadow-md transition">
              <span className="text-[9px] bg-[#D4870A]/5 text-[#D4870A] font-bold uppercase tracking-widest px-3 py-1 rounded">
                Head of Department
              </span>
              <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-[#0A1F44] to-[#1B5E3B] mx-auto overflow-hidden shadow border-2 border-white mb-4 mt-6 flex items-center justify-center text-white font-serif font-bold text-2xl">
                {department.hod_photo && !department.hod_photo.includes('placeholders') ? (
                  <img src={department.hod_photo} alt="HOD Portrait" className="h-full w-full object-cover" />
                ) : (
                  'HOD'
                )}
              </div>
              <h4 className="font-serif text-base font-bold text-[#0A1F44]">{department.hod_name || 'Specialist Professor'}</h4>
              <p className="text-[10px] text-[#1B5E3B] font-bold uppercase tracking-wider font-ui mt-1">{department.hod_designation || 'Professor & Head'}</p>
              <p className="text-[11px] text-gray-500 italic font-sans max-w-xs mx-auto mt-2 leading-relaxed">
                {department.hod_qualifications || 'MDS Specialities'}
              </p>
            </div>

            {/* Department Contact Grid */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <h4 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4">Department Contacts</h4>
              <ul className="space-y-3.5 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-[#1B5E3B] shrink-0" />
                  <span className="truncate" title={department.contact_email}>{department.contact_email || `dept.${deptId}@gdcdibrugarh.edu.in`}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-[#D4870A] shrink-0" />
                  <span>{department.contact_phone || '+91 373 2300123'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#0A1F44] shrink-0 mt-0.5" />
                  <span className="leading-tight">GDC & Hospital Campus,<br />Dibrugarh, Assam.</span>
                </li>
              </ul>
            </div>

            {/* Back to Specialties link */}
            <div className="bg-[#0A1F44]/5 p-4 rounded text-center border border-gray-200">
              <span className="text-[11px] text-gray-500 block mb-2 font-sans font-medium">Want to explore another clinic?</span>
              <Link href="/#specialties" className="text-xs font-bold font-ui text-[#0A1F44] hover:text-[#D4870A] transition hover:underline">
                View All Departments &raquo;
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
