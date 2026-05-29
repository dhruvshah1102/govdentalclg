'use client';

import React, { useState } from 'react';
import { Search, Mail, FileText, Download, User, Users } from 'lucide-react';

interface FacultyMember {
  id: number;
  name: string;
  photo_url: string;
  qualifications: string;
  designation: string;
  specialization: string;
  email: string;
  publications: string;
  cv_url: string;
  department_id: string;
  department_name: string;
  is_teaching: number;
}

interface FacultyDirectoryClientProps {
  initialFaculty: FacultyMember[];
  departments: { id: string; name: string }[];
}

export const FacultyDirectoryClient: React.FC<FacultyDirectoryClientProps> = ({ 
  initialFaculty, 
  departments 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'teaching' | 'admin'>('all');

  // Filter logic
  const filteredFaculty = initialFaculty.filter((f) => {
    // 1. Search Query filter (matches name, designation, specialization)
    const matchesSearch = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.specialization && f.specialization.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Department filter
    const matchesDept = selectedDept === 'all' || f.department_id === selectedDept;

    // 3. Tab Category filter
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'teaching' && f.is_teaching === 1) ||
      (activeTab === 'admin' && f.is_teaching === 0);

    return matchesSearch && matchesDept && matchesTab;
  });

  return (
    <div className="space-y-6">
      
      {/* Header and Counters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[#0A1F44]">
            Faculty & Administrative Staff Directory
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Browse our list of specialist educators, medical practitioners, and office administrators.
          </p>
        </div>
        <div className="bg-[#0A1F44] text-white text-xs px-4 py-2 rounded font-bold uppercase font-ui">
          Total Found: <span className="text-[#D4870A]">{filteredFaculty.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar Controller */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Real-time search */}
        <div className="relative">
          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Search Name / Designation</label>
          <input
            type="text"
            placeholder="Type a name to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none py-2.5 pl-9 pr-4 rounded transition"
          />
          <Search size={14} className="absolute left-3 top-7.5 text-gray-400" />
        </div>

        {/* Department filter */}
        <div>
          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Filter by Department</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none py-2.5 px-3 rounded transition appearance-none cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Tab category filters */}
        <div>
          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Staff Category</label>
          <div className="grid grid-cols-3 bg-gray-100 p-0.5 rounded text-xs text-center font-semibold text-gray-600">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 rounded transition uppercase text-[10px] ${activeTab === 'all' ? 'bg-[#0A1F44] text-white' : 'hover:bg-white/50'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('teaching')}
              className={`py-2 rounded transition uppercase text-[10px] ${activeTab === 'teaching' ? 'bg-[#0A1F44] text-white' : 'hover:bg-white/50'}`}
            >
              Teaching
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`py-2 rounded transition uppercase text-[10px] ${activeTab === 'admin' ? 'bg-[#0A1F44] text-white' : 'hover:bg-white/50'}`}
            >
              Office
            </button>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      {filteredFaculty.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 rounded-lg text-center text-gray-400 text-xs shadow-sm">
          No faculty members match the selected search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFaculty.map((f) => (
            <div 
              key={f.id} 
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:border-[#1B5E3B] hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Visual Avatar fallback */}
                <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-[#0A1F44] to-[#1B5E3B] flex items-center justify-center text-white font-serif font-bold text-xl shadow mb-4">
                  {f.name.split(' ').filter(n => n !== 'Dr.' && n !== 'Sri' && n !== 'Smt')[0]?.charAt(0) || 'U'}
                </div>
                
                <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2 ${
                  f.is_teaching === 1 ? 'bg-[#1B5E3B]/10 text-[#1B5E3B]' : 'bg-[#D4870A]/10 text-[#D4870A]'
                }`}>
                  {f.is_teaching === 1 ? 'Teaching Faculty' : 'Administrative'}
                </span>
                
                <h4 className="font-serif font-bold text-sm text-[#0A1F44]">{f.name}</h4>
                <p className="text-[11px] text-[#D4870A] font-bold uppercase tracking-wider font-ui mt-0.5">{f.designation}</p>
                
                {f.department_name && (
                  <span className="text-[10px] text-gray-400 font-semibold block mt-1 font-sans">
                    Dept: {f.department_name}
                  </span>
                )}

                <p className="text-[11px] text-gray-500 italic mt-3 border-t border-gray-100 pt-2.5 font-sans leading-normal">
                  {f.qualifications || 'Academic Credentials'}
                </p>

                {f.specialization && (
                  <p className="text-[10px] text-gray-600 mt-2 font-sans font-medium">
                    Specialty: <span className="text-[#1B5E3B]">{f.specialization}</span>
                  </p>
                )}
              </div>

              {/* Action utilities */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                {f.email ? (
                  <a href={`mailto:${f.email}`} className="hover:text-[#0A1F44] transition flex items-center gap-1 leading-none" title={f.email}>
                    <Mail size={12} /> Email
                  </a>
                ) : (
                  <span></span>
                )}
                
                {f.cv_url && (
                  <a href={f.cv_url} className="text-[#1B5E3B] hover:text-[#247C4E] font-bold transition flex items-center gap-0.5" target="_blank">
                    <Download size={12} /> Resume
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
