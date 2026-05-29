'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, ShieldCheck, AlertCircle, HelpCircle, FileText } from 'lucide-react';

export const ContactFormClient: React.FC = () => {
  const searchParams = useSearchParams();
  const [activeForm, setActiveForm] = useState<'contact' | 'grievance'>('contact');

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Grievance extra fields
  const [identity, setIdentity] = useState(''); // Roll No or Aadhar No
  const [grievanceCat, setGrievanceCat] = useState('Academic'); // Academic, Hostel, Ragging, Medical

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'grievance') setActiveForm('grievance');
    else setActiveForm('contact');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject || !message) {
      setErrorMsg('Please fill in all required fields (Name, Subject, and Message).');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeForm === 'grievance' ? 'Grievance' : 'Contact',
          name,
          email,
          phone,
          subject: activeForm === 'grievance' ? `[GRIEVANCE: ${grievanceCat}] ${subject}` : subject,
          message,
          form_data: activeForm === 'grievance' ? JSON.stringify({ student_identity: identity, grievance_category: grievanceCat }) : null
        })
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
        setIdentity('');
      } else {
        setErrorMsg('Failed to process your request. Please try again.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMsg('A network error occurred. Please verify your connection.');
      setStatus('error');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
      
      {/* Tab selectors */}
      <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs text-center font-semibold text-gray-600 mb-6 font-ui">
        <button
          onClick={() => setActiveForm('contact')}
          className={`w-full py-2.5 rounded-md transition uppercase text-[10px] md:text-xs ${
            activeForm === 'contact' ? 'bg-[#0A1F44] text-white shadow-sm' : 'hover:bg-white/40'
          }`}
        >
          General Contact & Feedback
        </button>
        <button
          onClick={() => setActiveForm('grievance')}
          className={`w-full py-2.5 rounded-md transition uppercase text-[10px] md:text-xs ${
            activeForm === 'grievance' ? 'bg-red-600 text-white shadow-sm' : 'hover:bg-white/40'
          }`}
        >
          Lodge Official Grievance
        </button>
      </div>

      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center space-y-3 text-[#1B5E3B]">
          <ShieldCheck className="mx-auto text-emerald-600" size={32} />
          <h4 className="font-serif font-bold text-lg text-[#0A1F44]">Form Submitted Successfully!</h4>
          <p className="text-xs leading-relaxed max-w-md mx-auto font-sans">
            Thank you. Your {activeForm === 'grievance' ? 'official grievance' : 'message'} has been securely routed to GDC Dibrugarh administrative desk. We will review and follow up as necessary.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="bg-[#1B5E3B] hover:bg-[#247C4E] text-white text-[10px] font-bold font-ui py-2 px-4 rounded uppercase tracking-wider transition mt-4"
          >
            Submit Another Request
          </button>
        </div>
      )}

      {status !== 'success' && (
        <form onSubmit={handleSubmit} className="space-y-4 font-ui text-xs">
          {status === 'error' && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded flex gap-2.5 items-center">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Full Name (Required)</label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Contact Phone (Optional)</label>
              <input
                type="tel"
                placeholder="Enter mobile number..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Subject (Required)</label>
              <input
                type="text"
                placeholder="Enter subject heading..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
          </div>

          {/* Grievance Extra Fields */}
          {activeForm === 'grievance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded bg-red-50/50 border border-red-100">
              <div>
                <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Student Roll No / ID Card Number</label>
                <input
                  type="text"
                  placeholder="e.g. BDS-2024-023..."
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  className="w-full bg-white text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                />
              </div>
              <div>
                <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Grievance Category</label>
                <select
                  value={grievanceCat}
                  onChange={(e) => setGrievanceCat(e.target.value)}
                  className="w-full bg-white text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition cursor-pointer"
                >
                  <option value="Academic">Academic / Syllabus Issues</option>
                  <option value="Hostel">Hostel & Living Accommodations</option>
                  <option value="Ragging">Banned Ragging Complaint</option>
                  <option value="Medical">Clinical & OPD Caseloads dispute</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Detailed Message (Required)</label>
            <textarea
              placeholder="Enter message details..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              required
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider transition shadow-sm ${
                activeForm === 'grievance' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#0A1F44] hover:bg-[#162E5B]'
              }`}
            >
              {status === 'loading' ? 'Submitting Details...' : activeForm === 'grievance' ? 'Lodge Official Grievance' : 'Send Message'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
