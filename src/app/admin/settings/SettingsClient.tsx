'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle, AlertCircle, FileText, Globe } from 'lucide-react';

interface SettingsClientProps {
  initialSettings: Record<string, string>;
}

export const SettingsClient: React.FC<SettingsClientProps> = ({ initialSettings }) => {
  const [formData, setFormData] = useState<Record<string, string>>(initialSettings);
  const [activeTab, setActiveTab] = useState<'branding' | 'contacts' | 'socials' | 'pages'>('branding');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // Custom Page Editor States
  const [selectedPage, setSelectedPage] = useState('about_college_html');
  const [isVisual, setIsVisual] = useState(true);
  const editorRef = React.useRef<HTMLDivElement>(null);

  // Sync editor innerHTML on page select, mode toggle, or active tab changes
  React.useEffect(() => {
    if (editorRef.current && isVisual) {
      editorRef.current.innerHTML = formData[selectedPage] || '';
    }
  }, [selectedPage, isVisual, activeTab]);

  const executeCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setFormData((prev) => ({ ...prev, [selectedPage]: html }));
    }
  };

  const handleVisualInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    setFormData((prev) => ({ ...prev, [selectedPage]: html }));
  };

  const handleVisualBlur = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setFormData((prev) => ({ ...prev, [selectedPage]: html }));
    }
  };

  const insertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px; text-align: left;">
        <thead>
          <tr style="background-color: #0A1F44; color: white;">
            <th style="border: 1px solid #ddd; padding: 10px;">Treatment / Service Item</th>
            <th style="border: 1px solid #ddd; padding: 10px;">Subsidized Fee (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: 500;">General OPD Card</td>
            <td style="border: 1px solid #ddd; padding: 10px; color: #1B5E3B; font-weight: bold;">₹20</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: 500;">Root Canal Therapy (RCT)</td>
            <td style="border: 1px solid #ddd; padding: 10px; color: #1B5E3B; font-weight: bold;">₹300</td>
          </tr>
        </tbody>
      </table>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  const insertGreenBox = () => {
    const boxHtml = `
      <div style="background-color: #EBFDF5; border: 1px solid #A7F3D0; border-radius: 8px; padding: 16px; margin: 15px 0; font-family: sans-serif;">
        <strong style="color: #065F46; font-size: 13px;">✔ Key Facts: Program Overview</strong>
        <ul style="color: #047857; padding-left: 16px; margin-top: 8px; list-style-type: disc;">
          <li><strong>Intake Capacity:</strong> 50 Students</li>
          <li><strong>Admission Channel:</strong> NEET-UG State & All India Counselling</li>
          <li><strong>Course Duration:</strong> 4 Years Academics + 1 Year Internship</li>
        </ul>
      </div>
    `;
    executeCommand('insertHTML', boxHtml);
  };

  const insertRedAlert = () => {
    const boxHtml = `
      <div style="background-color: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 8px; padding: 16px; margin: 15px 0; font-family: sans-serif;">
        <strong style="color: #991B1B; font-size: 13px;">⚠ Strict Regulatory Warning: Compliance Policy</strong>
        <p style="color: #7F1D1D; margin-top: 6px; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
          Ragging is completely banned on campus. Under UGC & DCI guidelines, any student found guilty of ragging or abetting ragging is liable for immediate expulsion and legal prosecution.
        </p>
      </div>
    `;
    executeCommand('insertHTML', boxHtml);
  };

  const insertFactSheet = () => {
    const sheetHtml = `
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin: 15px 0; font-family: sans-serif; display: flex; flex-direction: column; gap: 8px;">
        <div style="font-weight: bold; color: #0A1F44; font-size: 13px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">📋 Academic Specifications</div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; border-bottom: 1px dashed #E2E8F0; padding: 4px 0;">
          <span style="color: #64748B;">Degree Name:</span>
          <strong style="color: #0F172A;">Bachelor of Dental Surgery (BDS)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; border-bottom: 1px dashed #E2E8F0; padding: 4px 0;">
          <span style="color: #64748B;">DCI Approved Intake:</span>
          <strong style="color: #0F172A;">50 Seats Annually</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; border-bottom: 1px dashed #E2E8F0; padding: 4px 0;">
          <span style="color: #64748B;">Selection Merits:</span>
          <strong style="color: #0F172A;">NEET-UG Examination</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; padding-top: 4px;">
          <span style="color: #64748B;">University Affiliation:</span>
          <strong style="color: #0F172A;">Dibrugarh University, Assam</strong>
        </div>
      </div>
    `;
    executeCommand('insertHTML', sheetHtml);
  };

  const insertAccordion = () => {
    const faqHtml = `
      <details style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px 16px; margin: 10px 0; font-family: sans-serif; cursor: pointer;">
        <summary style="font-weight: 600; color: #0A1F44; font-size: 13px; outline: none; list-style: none;">
          ❓ Accordion/Policy Question: Click here to expand
        </summary>
        <p style="color: #334155; font-size: 12px; margin-top: 8px; line-height: 1.6; margin-bottom: 0;">
          Accordion description text. The admin can edit this text easily! Write details, guidelines, rules, or curriculum subtopics here.
        </p>
      </details>
    `;
    executeCommand('insertHTML', faqHtml);
  };

  const insertChecklist = () => {
    const checkHtml = `
      <ul style="list-style-type: none; padding-left: 0; margin: 15px 0; font-family: sans-serif;">
        <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 12px; color: #334155;">
          <span style="color: #10B981; font-weight: bold;">✔</span>
          <span><strong>DCI Accreditation</strong>: Recognized for standard academic practices.</span>
        </li>
        <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 12px; color: #334155;">
          <span style="color: #10B981; font-weight: bold;">✔</span>
          <span><strong>Modern Infrastructure</strong>: Premium clinical departments and smart labs.</span>
        </li>
        <li style="display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: #334155;">
          <span style="color: #10B981; font-weight: bold;">✔</span>
          <span><strong>Expert Mentors</strong>: Dynamic professors and dedicated researchers.</span>
        </li>
      </ul>
    `;
    executeCommand('insertHTML', checkHtml);
  };

  const insertDivider = () => {
    const dividerHtml = `
      <hr style="border: 0; border-top: 2px solid #E2E8F0; margin: 24px 0;" />
    `;
    executeCommand('insertHTML', dividerHtml);
  };

  const addTableRow = () => {
    if (editorRef.current) {
      const tables = editorRef.current.getElementsByTagName('table');
      if (tables.length > 0) {
        const activeTable = tables[tables.length - 1];
        const tbody = activeTable.getElementsByTagName('tbody')[0] || activeTable;
        const newRow = document.createElement('tr');
        const rowCount = tbody.getElementsByTagName('tr').length;
        if (rowCount % 2 === 1) {
          newRow.style.backgroundColor = '#f9f9f9';
        }
        newRow.innerHTML = `
          <td style="border: 1px solid #ddd; padding: 10px; font-weight: 500;">New Treatment Detail (Click to edit)</td>
          <td style="border: 1px solid #ddd; padding: 10px; color: #1B5E3B; font-weight: bold;">₹100</td>
        `;
        tbody.appendChild(newRow);
        
        // Sync state
        const html = editorRef.current.innerHTML;
        setFormData((prev) => ({ ...prev, [selectedPage]: html }));
      } else {
        alert("Please insert a table first using 'Add Table' before appending rows.");
      }
    }
  };

  const deleteTableRow = () => {
    if (editorRef.current) {
      const tables = editorRef.current.getElementsByTagName('table');
      if (tables.length > 0) {
        const activeTable = tables[tables.length - 1];
        const tbody = activeTable.getElementsByTagName('tbody')[0] || activeTable;
        const rows = tbody.getElementsByTagName('tr');
        if (rows.length > 0) {
          tbody.removeChild(rows[rows.length - 1]);
          // Sync state
          const html = editorRef.current.innerHTML;
          setFormData((prev) => ({ ...prev, [selectedPage]: html }));
        }
      }
    }
  };

  const pageKeys = [
    { key: 'about_college_html', label: 'About Us — About the College' },
    { key: 'about_hospital_html', label: 'About Us — About the Hospital' },
    { key: 'bds_curriculum_html', label: 'Academics — BDS Programme details' },
    { key: 'mds_curriculum_html', label: 'Academics — MDS Programme details' },
    { key: 'scholarships_html', label: 'Academics — Scholarships & Aid' },
    { key: 'anti_ragging_html', label: 'Student Portal — Anti-Ragging Policy' },
    { key: 'grievance_policy_html', label: 'Student Portal — Grievance Cell guidelines' },
    { key: 'research_overview_html', label: 'Research — Research Overview' },
    { key: 'ethical_committee_html', label: 'Research — Ethical Committee & Guidelines' },
    { key: 'opd_services_html', label: 'Hospital — OPD Services & Timings' },
    { key: 'hospital_charges_html', label: 'Hospital — Charges & Fee list' },
    { key: 'bds_admissions_html', label: 'Admissions — BDS NEET admission guidelines' },
    { key: 'hostel_accommodations_html', label: 'Admissions — Hostels & Accommodations' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
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
    <form onSubmit={handleSubmit} className="space-y-6 font-ui text-xs">
      
      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded p-3.5 text-[#1B5E3B] flex items-center gap-2 font-sans font-semibold mb-2">
          <CheckCircle size={16} />
          <span>Site configurations and custom page content updated successfully! Changes are immediately live.</span>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded flex items-center gap-2 mb-2 font-sans font-semibold">
          <AlertCircle size={16} />
          <span>Failed to save configurations. Please verify your session.</span>
        </div>
      )}

      {/* Tabs Controllers */}
      <div className="flex bg-gray-150 p-0.5 rounded-lg text-center font-semibold text-gray-600 mb-6 w-full overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`w-full py-2.5 rounded-md transition uppercase text-[10px] md:text-xs whitespace-nowrap ${
            activeTab === 'branding' ? 'bg-[#0A1F44] text-white shadow-sm font-bold' : 'hover:bg-white/40'
          }`}
        >
          Institutional Branding
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('contacts')}
          className={`w-full py-2.5 rounded-md transition uppercase text-[10px] md:text-xs whitespace-nowrap ${
            activeTab === 'contacts' ? 'bg-[#0A1F44] text-white shadow-sm font-bold' : 'hover:bg-white/40'
          }`}
        >
          Helplines & Phones
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('socials')}
          className={`w-full py-2.5 rounded-md transition uppercase text-[10px] md:text-xs whitespace-nowrap ${
            activeTab === 'socials' ? 'bg-[#0A1F44] text-white shadow-sm font-bold' : 'hover:bg-white/40'
          }`}
        >
          Social Integrations
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pages')}
          className={`w-full py-2.5 rounded-md transition uppercase text-[10px] md:text-xs whitespace-nowrap ${
            activeTab === 'pages' ? 'bg-[#1B5E3B] text-white shadow-sm font-bold' : 'hover:bg-white/40'
          }`}
        >
          Custom Page Content Editor
        </button>
      </div>

      {/* Group 1: Trilingual Branding */}
      {activeTab === 'branding' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 flex items-center gap-2">
            <Globe className="text-[#D4870A]" size={16} /> College Branding & Taglines
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">College Name (English)</label>
              <input
                type="text"
                name="site_name_en"
                value={formData.site_name_en || ''}
                onChange={handleChange}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">College Name (Assamese / অসমীয়া)</label>
              <input
                type="text"
                name="site_name_as"
                value={formData.site_name_as || ''}
                onChange={handleChange}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">College Name (Hindi / हिंदी)</label>
              <input
                type="text"
                name="site_name_hi"
                value={formData.site_name_hi || ''}
                onChange={handleChange}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">College Tagline / Subtitle</label>
              <input
                type="text"
                name="tagline_en"
                value={formData.tagline_en || ''}
                onChange={handleChange}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Group 2: Contact Directories */}
      {activeTab === 'contacts' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 flex items-center gap-2">
            <Settings className="text-[#1B5E3B]" size={16} /> Contact Directories & Helplines
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Postal Address</label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">General Office Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Support Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Emergency Trauma Helpline</label>
              <input
                type="text"
                name="helpline_emergency"
                value={formData.helpline_emergency || ''}
                onChange={handleChange}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Group 3: Social Media */}
      {activeTab === 'socials' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 flex items-center gap-2">
            <Settings className="text-[#0A1F44]" size={16} /> Social Media Coordinates
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Facebook page URL</label>
              <input
                type="url"
                name="social_facebook"
                value={formData.social_facebook || ''}
                onChange={handleChange}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Twitter/X page URL</label>
              <input
                type="url"
                name="social_twitter"
                value={formData.social_twitter || ''}
                onChange={handleChange}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Instagram page URL</label>
              <input
                type="url"
                name="social_instagram"
                value={formData.social_instagram || ''}
                onChange={handleChange}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">YouTube page URL</label>
              <input
                type="url"
                name="social_youtube"
                value={formData.social_youtube || ''}
                onChange={handleChange}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              />
            </div>
          </div>
        </div>
      )}

      {/* Group 4: Long-form Page HTML Editor */}
      {activeTab === 'pages' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 flex items-center gap-2">
            <FileText className="text-[#1B5E3B]" size={16} /> Rich-text Custom Page Contents Editor
          </h3>
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex-1">
                <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Select Page to Edit</label>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition cursor-pointer font-bold"
                >
                  {pageKeys.map((item) => (
                    <option key={item.key} value={item.key}>{item.label}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to reset this page's content back to the default layout and text? All custom styling, tables, and text saved for this page will be cleared.")) {
                    setFormData((prev) => ({ ...prev, [selectedPage]: '' }));
                    if (editorRef.current) {
                      editorRef.current.innerHTML = '';
                    }
                  }
                }}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 py-2.5 px-4 rounded transition shadow-sm flex items-center justify-center gap-1.5 text-xs font-ui shrink-0"
                title="Clear custom HTML override and restore default page template"
              >
                🗑 Reset to Default Content
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <label className="text-gray-500 font-bold uppercase text-[9px] block">
                    Page Content Editor
                  </label>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${isVisual ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {isVisual ? '✏ VISUAL EASY-EDIT MODE (Non-Coders)' : '💻 HTML SOURCE CODE (Advanced)'}
                  </span>
                </div>
                <div className="flex border border-gray-300 rounded bg-gray-50 p-0.5 text-[9px] font-bold">
                  <button
                    type="button"
                    onClick={() => setIsVisual(true)}
                    className={`px-3 py-1 rounded transition ${isVisual ? 'bg-[#0A1F44] text-white shadow-sm font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    Visual Editor (Easy Mode)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVisual(false)}
                    className={`px-3 py-1 rounded transition ${!isVisual ? 'bg-[#0A1F44] text-white shadow-sm font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    HTML Code (Advanced Mode)
                  </button>
                </div>
              </div>

              {isVisual ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Left Column: Visual Editor Screen */}
                  <div className="lg:col-span-3 border border-gray-300 rounded-lg overflow-hidden flex flex-col shadow-sm">
                    {/* Rich Text Toolbar - uses onMouseDown preventDefault to prevent stealing focus */}
                    <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 border-b border-gray-300 items-center select-none text-[10px] font-bold text-gray-600">
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }}
                        className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition shadow-sm font-extrabold active:bg-gray-200"
                        title="Bold Text"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }}
                        className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition italic shadow-sm active:bg-gray-200"
                        title="Italic Text"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); executeCommand('underline'); }}
                        className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition underline shadow-sm active:bg-gray-200"
                        title="Underline Text"
                      >
                        U
                      </button>
                      <div className="w-px h-5 bg-gray-300 mx-1"></div>
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); executeCommand('formatBlock', '<h3>'); }}
                        className="px-2.5 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition shadow-sm active:bg-gray-200"
                        title="Insert Section Title Heading"
                      >
                        Heading
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); executeCommand('formatBlock', '<p>'); }}
                        className="px-2.5 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition shadow-sm active:bg-gray-200"
                        title="Normal Paragraph Text"
                      >
                        Paragraph
                      </button>
                      <div className="w-px h-5 bg-gray-300 mx-1"></div>
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); executeCommand('insertUnorderedList'); }}
                        className="px-2.5 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition shadow-sm active:bg-gray-200"
                        title="Bullet Points List"
                      >
                        • Bullet List
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); executeCommand('insertOrderedList'); }}
                        className="px-2.5 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition shadow-sm active:bg-gray-200"
                        title="Numbered Steps List"
                      >
                        1. Numbered List
                      </button>
                      <div className="w-px h-5 bg-gray-300 mx-1"></div>
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); executeCommand('undo'); }}
                        className="px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition shadow-sm"
                        title="Undo Last Action"
                      >
                        ↺ Undo
                      </button>
                    </div>

                    {/* Visual contentEditable Box */}
                    <div
                      ref={editorRef}
                      contentEditable={true}
                      onInput={handleVisualInput}
                      onBlur={handleVisualBlur}
                      className="w-full min-h-[380px] bg-white text-xs p-4 focus:outline-none font-sans leading-relaxed text-gray-700 overflow-y-auto max-h-[500px]"
                      style={{ outline: 'none' }}
                    />
                  </div>

                  {/* Right Column: Component Injections Library & Guidelines */}
                  <div className="lg:col-span-1 bg-[#F8FAFC] border border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-[#0A1F44] text-[10px] uppercase tracking-wider border-b border-gray-200 pb-1 flex items-center gap-1">
                          🛠 Components Library
                        </h4>
                        <p className="text-[9px] text-gray-400 mt-1">Click below to inject pre-designed modules instantly at your cursor location.</p>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); insertTable(); }}
                          className="w-full text-left py-2 px-2.5 bg-white border border-gray-200 hover:border-[#0A1F44] hover:bg-[#0A1F44]/5 text-gray-700 rounded transition font-medium flex items-center gap-1.5 shadow-sm text-[10px]"
                          title="Insert pre-styled Fees Table"
                        >
                          <span>📋</span>
                          <div>
                            <span className="block font-bold text-[#0A1F44]">Insert Styled Table</span>
                            <span className="block text-[8px] text-gray-400">For fee list & charge indexes</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); insertGreenBox(); }}
                          className="w-full text-left py-2 px-2.5 bg-white border border-gray-200 hover:border-[#1B5E3B] hover:bg-[#1B5E3B]/5 text-gray-700 rounded transition font-medium flex items-center gap-1.5 shadow-sm text-[10px]"
                          title="Insert Green Highlights Banner"
                        >
                          <span className="text-emerald-500 font-bold">✔</span>
                          <div>
                            <span className="block font-bold text-[#1B5E3B]">Insert Facts Box</span>
                            <span className="block text-[8px] text-gray-400">Green bulleted summary block</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); insertRedAlert(); }}
                          className="w-full text-left py-2 px-2.5 bg-white border border-gray-200 hover:border-red-500 hover:bg-red-50 text-gray-700 rounded transition font-medium flex items-center gap-1.5 shadow-sm text-[10px]"
                          title="Insert Red Alert Policy Callout"
                        >
                          <span className="text-red-500 font-bold">⚠</span>
                          <div>
                            <span className="block font-bold text-red-700">Insert Warning Callout</span>
                            <span className="block text-[8px] text-gray-400">Red strict policy notification</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); insertFactSheet(); }}
                          className="w-full text-left py-2 px-2.5 bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700 rounded transition font-medium flex items-center gap-1.5 shadow-sm text-[10px]"
                          title="Insert Specifications Grid"
                        >
                          <span>📘</span>
                          <div>
                            <span className="block font-bold text-blue-700">Insert Fact Grid</span>
                            <span className="block text-[8px] text-gray-400">Intake capacity, duration sheet</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); insertAccordion(); }}
                          className="w-full text-left py-2 px-2.5 bg-white border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700 rounded transition font-medium flex items-center gap-1.5 shadow-sm text-[10px]"
                          title="Insert native details/summary accordion FAQ"
                        >
                          <span>❓</span>
                          <div>
                            <span className="block font-bold text-indigo-700">Insert Accordion</span>
                            <span className="block text-[8px] text-gray-400">Collapsible FAQ guideline details</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); insertChecklist(); }}
                          className="w-full text-left py-2 px-2.5 bg-white border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 text-gray-700 rounded transition font-medium flex items-center gap-1.5 shadow-sm text-[10px]"
                          title="Insert custom checked list"
                        >
                          <span className="text-emerald-500">✔</span>
                          <div>
                            <span className="block font-bold text-emerald-800">Insert Checkmarks List</span>
                            <span className="block text-[8px] text-gray-400">Checked bullet listings</span>
                          </div>
                        </button>

                        <div className="w-full h-px bg-gray-200 my-1"></div>

                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); addTableRow(); }}
                            className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 rounded transition shadow-sm flex items-center justify-center gap-1 text-[9px]"
                            title="Add dynamic row at the bottom of active table"
                          >
                            ➕ Row
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); deleteTableRow(); }}
                            className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 rounded transition shadow-sm flex items-center justify-center gap-1 text-[9px]"
                            title="Remove last row from active table"
                          >
                            ❌ Row
                          </button>
                        </div>

                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); insertDivider(); }}
                          className="w-full py-1.5 bg-white border border-gray-200 hover:bg-gray-100 rounded text-gray-500 font-bold transition shadow-sm text-[9px] text-center"
                          title="Insert elegant horizontal rule divider"
                        >
                          ➖ Insert Horizontal Divider
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200 text-[9px] text-gray-400 font-sans leading-tight space-y-1.5">
                      <strong className="text-gray-500 block">💡 User Instructions:</strong>
                      <p>1. Highlighting any text lets you format it with the B / I / U toolbar.</p>
                      <p>2. You can click inside any table cell, alert box, or accordion to modify its words directly!</p>
                      <p>3. Use the 'Add Row' helper to append new slots to your pricing tables instantly.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <textarea
                  name={selectedPage}
                  value={formData[selectedPage] || ''}
                  onChange={handleChange}
                  rows={18}
                  placeholder="Insert custom page content paragraphs, bullet lists, or tables using standard HTML formatting..."
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-3.5 rounded transition font-mono leading-relaxed text-gray-700"
                ></textarea>
              )}
              <span className="text-[10px] text-gray-400 block mt-1 font-sans">
                {isVisual 
                  ? "*Pro-tip: Simply type your text, double-click/highlight terms to format, and click components in the right column to design custom layouts natively without any coding!"
                  : "*Pro-tip: You can write standard HTML tags like <p>, <h3>, <ul>, <li>, <strong>, <table> to format your page outline manually."}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 font-ui"
        >
          <Save size={14} /> {status === 'loading' ? 'Saving configurations...' : 'Save Site Settings'}
        </button>
      </div>

    </form>
  );
};
