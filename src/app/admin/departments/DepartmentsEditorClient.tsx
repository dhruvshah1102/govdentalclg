'use client';

import React, { useState, useEffect } from 'react';
import { 
  Save, CheckCircle, AlertCircle, Users, 
  Stethoscope, Settings, Layers, Calendar, 
  Info, Mail, Phone, Image as ImageIcon
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  banner_image: string | null;
  about: string | null;
  hod_name: string | null;
  hod_qualifications: string | null;
  hod_designation: string | null;
  hod_photo: string | null;
  infrastructure: string | null;
  clinical_services: string | null;
  research_activities: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

interface DepartmentsEditorClientProps {
  initialDepartments: Department[];
}

export const DepartmentsEditorClient: React.FC<DepartmentsEditorClientProps> = ({ initialDepartments }) => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [selectedId, setSelectedId] = useState<string>(initialDepartments[0]?.id || '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'hod' | 'details' | 'clinical' | 'contact'>('hod');

  // Form Fields States
  const [name, setName] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [about, setAbout] = useState('');
  const [hodName, setHodName] = useState('');
  const [hodQualifications, setHodQualifications] = useState('');
  const [hodDesignation, setHodDesignation] = useState('');
  const [hodPhoto, setHodPhoto] = useState('');
  const [infrastructure, setInfrastructure] = useState('');
  const [clinicalServices, setClinicalServices] = useState('');
  const [researchActivities, setResearchActivities] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Find the selected department
  const currentDept = departments.find((d) => d.id === selectedId);

  // Sync state when selected department changes
  useEffect(() => {
    if (currentDept) {
      setName(currentDept.name);
      setBannerImage(currentDept.banner_image || '');
      setAbout(currentDept.about || '');
      setHodName(currentDept.hod_name || '');
      setHodQualifications(currentDept.hod_qualifications || '');
      setHodDesignation(currentDept.hod_designation || 'Professor & Head of Department');
      setHodPhoto(currentDept.hod_photo || '');
      setInfrastructure(currentDept.infrastructure || '');
      setClinicalServices(currentDept.clinical_services || '');
      setResearchActivities(currentDept.research_activities || '');
      setContactEmail(currentDept.contact_email || '');
      setContactPhone(currentDept.contact_phone || '');
      setStatus('idle');
    }
  }, [selectedId, departments, currentDept]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch(`/api/admin/departments?id=${selectedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          banner_image: bannerImage,
          about,
          hod_name: hodName,
          hod_qualifications: hodQualifications,
          hod_designation: hodDesignation,
          hod_photo: hodPhoto,
          infrastructure,
          clinical_services: clinicalServices,
          research_activities: researchActivities,
          contact_email: contactEmail,
          contact_phone: contactPhone
        })
      });

      if (response.ok) {
        // Update local departments state
        const updatedDept: Department = {
          id: selectedId,
          name,
          banner_image: bannerImage || null,
          about: about || null,
          hod_name: hodName || null,
          hod_qualifications: hodQualifications || null,
          hod_designation: hodDesignation || null,
          hod_photo: hodPhoto || null,
          infrastructure: infrastructure || null,
          clinical_services: clinicalServices || null,
          research_activities: researchActivities || null,
          contact_email: contactEmail || null,
          contact_phone: contactPhone || null
        };
        setDepartments((prev) => prev.map((d) => d.id === selectedId ? updatedDept : d));
        setStatus('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Selector bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm font-ui flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Select Dental Specialty Division</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-3.5 rounded transition cursor-pointer font-bold text-[#0A1F44]"
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] bg-[#1B5E3B]/10 text-[#1B5E3B] font-bold uppercase tracking-wider px-3 py-1.5 rounded flex items-center gap-1.5 justify-center md:justify-end">
            <Stethoscope size={13} /> Active Relational Node
          </span>
          <span className="text-[9px] text-gray-400 block mt-1">ID: <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-[#D4870A] font-bold">{selectedId}</code></span>
        </div>
      </div>

      {/* Main Tabbed Form Shell */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm font-ui text-xs">
        
        {/* Tab Controllers */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 rounded-t-lg text-xs font-semibold text-gray-500 uppercase tracking-wider overflow-x-auto">
          <button
            type="button"
            onClick={() => { setActiveTab('hod'); setStatus('idle'); }}
            className={`flex items-center gap-1.5 px-6 py-4 border-b-2 transition whitespace-nowrap ${
              activeTab === 'hod' ? 'border-[#D4870A] text-[#0A1F44] bg-white font-bold' : 'border-transparent hover:bg-gray-50'
            }`}
          >
            <Users size={15} /> 1. HOD Directory Info
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('details'); setStatus('idle'); }}
            className={`flex items-center gap-1.5 px-6 py-4 border-b-2 transition whitespace-nowrap ${
              activeTab === 'details' ? 'border-[#D4870A] text-[#0A1F44] bg-white font-bold' : 'border-transparent hover:bg-gray-50'
            }`}
          >
            <Info size={15} className="text-[#D4870A]" /> 2. Core Profile & Lab
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('clinical'); setStatus('idle'); }}
            className={`flex items-center gap-1.5 px-6 py-4 border-b-2 transition whitespace-nowrap ${
              activeTab === 'clinical' ? 'border-[#D4870A] text-[#0A1F44] bg-white font-bold' : 'border-transparent hover:bg-gray-50'
            }`}
          >
            <Layers size={15} className="text-[#1B5E3B]" /> 3. Caseload & Research
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('contact'); setStatus('idle'); }}
            className={`flex items-center gap-1.5 px-6 py-4 border-b-2 transition whitespace-nowrap ${
              activeTab === 'contact' ? 'border-[#D4870A] text-[#0A1F44] bg-white font-bold' : 'border-transparent hover:bg-gray-50'
            }`}
          >
            <Mail size={15} /> 4. Contacts & Banner
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {status === 'success' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded p-3.5 text-[#1B5E3B] flex items-center gap-2 font-sans font-semibold mb-4">
              <CheckCircle size={16} />
              <span>Department clinical parameters and directories saved successfully! Changes are immediately live.</span>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded flex items-center gap-2 mb-4 font-sans font-semibold">
              <AlertCircle size={16} />
              <span>Operation failed. Please verify your inputs or session configuration.</span>
            </div>
          )}

          {/* TAB 1: HOD DETAILS */}
          {activeTab === 'hod' && (
            <div className="space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#0A1F44] border-b border-gray-150 pb-2 mb-4">
                Head of Department (HOD) Profile Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">HOD Full Name (Required)</label>
                  <input
                    type="text"
                    value={hodName}
                    onChange={(e) => setHodName(e.target.value)}
                    placeholder="e.g. Dr. Bikramjit Phukan, MDS"
                    className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition font-semibold text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">HOD Qualifications (Required)</label>
                  <input
                    type="text"
                    value={hodQualifications}
                    onChange={(e) => setHodQualifications(e.target.value)}
                    placeholder="e.g. MDS (Oral Surgery), FIOOMS"
                    className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition font-semibold text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Official Designation Title</label>
                  <input
                    type="text"
                    value={hodDesignation}
                    onChange={(e) => setHodDesignation(e.target.value)}
                    placeholder="Professor & Head of Department"
                    className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                  />
                </div>
                <div>
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">HOD Profile Photograph URL</label>
                  <input
                    type="text"
                    value={hodPhoto}
                    onChange={(e) => setHodPhoto(e.target.value)}
                    placeholder="e.g. /assets/placeholders/faculty/omfs_hod.jpg"
                    className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#0A1F44] border-b border-gray-150 pb-2 mb-4">
                Core Specialty Introduction & Clinical Laboratory Infrastructure
              </h3>

              <div>
                <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">
                  About the Specialty (HTML/Text allowed)
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Provide a comprehensive academic introduction of this clinical specialty..."
                  rows={6}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-3.5 rounded transition font-sans leading-relaxed text-gray-700"
                  required
                ></textarea>
              </div>

              <div>
                <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">
                  Departmental & Clinical Infrastructure (HTML/Text allowed)
                </label>
                <textarea
                  value={infrastructure}
                  onChange={(e) => setInfrastructure(e.target.value)}
                  placeholder="Specify preclinical laboratories, clinical chair capacity, and dynamic hardware (e.g. CBCT, surgical tools)..."
                  rows={5}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-3.5 rounded transition font-sans leading-relaxed text-gray-700"
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 3: CLINICAL SERVICES & RESEARCH */}
          {activeTab === 'clinical' && (
            <div className="space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#0A1F44] border-b border-gray-150 pb-2 mb-4">
                Clinical OPD Services & Research/Outreach Footprints
              </h3>

              <div>
                <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">
                  Clinical Caseload / Treatable Services (HTML/Text allowed)
                </label>
                <textarea
                  value={clinicalServices}
                  onChange={(e) => setClinicalServices(e.target.value)}
                  placeholder="Insert bullet lists of dental operations, specialized therapeutic consultations, minor surgeries, cosmetic treatments..."
                  rows={6}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-3.5 rounded transition font-sans leading-relaxed text-gray-700"
                ></textarea>
              </div>

              <div>
                <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">
                  Active Departmental Research & Community Outreach (HTML/Text allowed)
                </label>
                <textarea
                  value={researchActivities}
                  onChange={(e) => setResearchActivities(e.target.value)}
                  placeholder="Outline recent medical publications, ongoing research projects, rural camps organized, and student thesis topics..."
                  rows={5}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-3.5 rounded transition font-sans leading-relaxed text-gray-700"
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT & BANNER */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#0A1F44] border-b border-gray-150 pb-2 mb-4">
                Specialty Contact Coordinates & Banner Graphics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Departmental Contact Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Mail size={13} />
                    </span>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. dept.omfs@gdcdibrugarh.edu.in"
                      className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none pl-9 pr-2.5 py-2.5 rounded transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Departmental Telephone / Extension</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Phone size={13} />
                    </span>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. +91 373 2300123 ext 145"
                      className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none pl-9 pr-2.5 py-2.5 rounded transition"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Department landing Banner Image URL</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <ImageIcon size={13} />
                    </span>
                    <input
                      type="text"
                      value={bannerImage}
                      onChange={(e) => setBannerImage(e.target.value)}
                      placeholder="e.g. /assets/placeholders/depts/omfs_banner.jpg"
                      className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none pl-9 pr-2.5 py-2.5 rounded transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer controls */}
          <div className="border-t border-gray-150 pt-4 flex justify-between items-center text-gray-400">
            <span className="text-[10px]">
              *Pro-tip: Dynamic updates appear instantly on the public website pages at <code>/departments/{selectedId}</code>.
            </span>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 font-ui"
            >
              <Save size={14} /> {status === 'loading' ? 'Saving specialty...' : 'Save Department Updates'}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
