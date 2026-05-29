'use client';

import React, { useState } from 'react';
import { Users, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export const AlumniRegistrationClient: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [batch, setBatch] = useState('2018');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !role) {
      setErrorMsg('Please fill in all required fields (Name, Phone, and Current Role/Designation).');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Alumni',
          name,
          email,
          phone,
          subject: `Alumni Registration: Batch ${batch}`,
          message: message || 'Registered in the association.',
          form_data: JSON.stringify({ graduation_batch: batch, current_role: role })
        })
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setPhone('');
        setRole('');
        setMessage('');
      } else {
        setErrorMsg('Failed to register. Please try again later.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMsg('A network error occurred. Please verify your connection.');
      setStatus('error');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
      <div className="border-b border-gray-100 pb-3 mb-6">
        <h3 className="font-serif text-xl font-bold text-[#0A1F44] flex items-center gap-1.5">
          <Users className="text-[#1B5E3B]" /> Join the Alumni Association
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Are you a GDC graduate? Complete this quick register form to join the digital alumni directory.
        </p>
      </div>

      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center space-y-3 text-[#1B5E3B]">
          <CheckCircle className="mx-auto text-emerald-600" size={32} />
          <h4 className="font-serif font-bold text-lg text-[#0A1F44]">Registration Submitted!</h4>
          <p className="text-xs leading-relaxed max-w-md mx-auto font-sans">
            Thank you for registering with the GDC Dibrugarh Alumni Association. Your details have been submitted to the administrative coordinators.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="bg-[#1B5E3B] hover:bg-[#247C4E] text-white text-[10px] font-bold font-ui py-2 px-4 rounded uppercase tracking-wider transition mt-4"
          >
            Register another graduate
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
                placeholder="Dr. John Doe..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Mobile Phone (Required)</label>
              <input
                type="tel"
                placeholder="Enter 10-digit number..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="alumni@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">BDS Graduation Batch</label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition cursor-pointer"
                >
                  {['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'].map((b) => (
                    <option key={b} value={b}>Batch of {b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Current Role / Desig</label>
                <input
                  type="text"
                  placeholder="e.g. Clinical Dentist..."
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Current Workplace & Message (Optional)</label>
            <textarea
              placeholder="Provide clinic names, research labs, or comments to help students reach out..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#1B5E3B] hover:bg-[#247C4E] text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider transition shadow-sm"
            >
              {status === 'loading' ? 'Submitting Details...' : 'Join Association'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
