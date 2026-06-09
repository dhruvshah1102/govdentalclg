'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Clock, Stethoscope, FileText, CheckCircle, 
  Calendar, AlertCircle, ShieldAlert, Sparkles, Smile 
} from 'lucide-react';

interface HospitalPortalClientProps {
  settings: Record<string, string>;
}

export const HospitalPortalClient: React.FC<HospitalPortalClientProps> = ({ settings }) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'opd' | 'clinics' | 'registration' | 'charges'>('opd');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dept, setDept] = useState('omr');
  const [prefDate, setPrefDate] = useState('');
  const [message, setMessage] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync tab with URL search query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'clinics') setActiveTab('clinics');
    else if (tabParam === 'registration') setActiveTab('registration');
    else if (tabParam === 'charges') setActiveTab('charges');
    else setActiveTab('opd');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !prefDate) {
      setErrorMsg('Please fill in all required fields (Name, Phone, and Preferred Date).');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Appointment',
          name,
          email,
          phone,
          subject: `OPD Appointment Request: ${dept.toUpperCase()}`,
          message: message || 'No additional comments provided.',
          form_data: JSON.stringify({ department: dept, preferred_date: prefDate })
        })
      });

      if (response.ok) {
        setStatus('success');
        // Clear form
        setName('');
        setEmail('');
        setPhone('');
        setPrefDate('');
        setMessage('');
      } else {
        setErrorMsg('Failed to process registration. Please try again.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMsg('A network error occurred. Please verify your connection.');
      setStatus('error');
    }
  };

  const departmentsList = [
    { id: 'omr', name: 'Oral Medicine & Radiology' },
    { id: 'omfs', name: 'Oral & Maxillofacial Surgery' },
    { id: 'ompath', name: 'Oral Pathology & Microbiology' },
    { id: 'perio', name: 'Periodontology' },
    { id: 'community', name: 'Community Dentistry' },
    { id: 'conservative', name: 'Conservative Dentistry' },
    { id: 'pediatric', name: 'Pediatric Dentistry' },
    { id: 'orthodontics', name: 'Orthodontics' },
    { id: 'prosthodontics', name: 'Prosthodontics' },
  ];

  // Retrieve dynamic HTML blocks from database overrides
  const dynamicOpdHtml = settings['opd_services_html'];
  const dynamicChargesHtml = settings['hospital_charges_html'];

  // Helper to verify if dynamic HTML actually has user content
  const hasContent = (html: string | null | undefined): boolean => {
    if (!html) return false;
    const cleanText = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim();
    const hasMedia = html.includes('<img') || html.includes('<iframe') || html.includes('<table') || html.includes('<details');
    return cleanText.length > 0 || hasMedia;
  };

  const showOpdHtml = dynamicOpdHtml && hasContent(dynamicOpdHtml);
  const showChargesHtml = dynamicChargesHtml && hasContent(dynamicChargesHtml);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Tabs controllers */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-white rounded-t-lg shadow-sm text-xs md:text-sm font-semibold text-gray-500">
        <button
          onClick={() => setActiveTab('opd')}
          className={`flex items-center gap-1.5 px-6 py-4 border-b-2 transition whitespace-nowrap ${
            activeTab === 'opd' ? 'border-[#0A1F44] text-[#0A1F44] bg-[#0A1F44]/5' : 'border-transparent hover:text-[#0A1F44] hover:bg-gray-50'
          }`}
        >
          <Clock size={16} /> OPD Schedule & Timings
        </button>
        <button
          onClick={() => setActiveTab('clinics')}
          className={`flex items-center gap-1.5 px-6 py-4 border-b-2 transition whitespace-nowrap ${
            activeTab === 'clinics' ? 'border-[#0A1F44] text-[#0A1F44] bg-[#0A1F44]/5' : 'border-transparent hover:text-[#0A1F44] hover:bg-gray-50'
          }`}
        >
          <Stethoscope size={16} /> Specialty Clinics
        </button>
        <button
          onClick={() => setActiveTab('registration')}
          className={`flex items-center gap-1.5 px-6 py-4 border-b-2 transition whitespace-nowrap ${
            activeTab === 'registration' ? 'border-[#0A1F44] text-[#0A1F44] bg-[#0A1F44]/5' : 'border-transparent hover:text-[#0A1F44] hover:bg-gray-50'
          }`}
        >
          <Calendar size={16} /> Patient Registration Form
        </button>
        <button
          onClick={() => setActiveTab('charges')}
          className={`flex items-center gap-1.5 px-6 py-4 border-b-2 transition whitespace-nowrap ${
            activeTab === 'charges' ? 'border-[#0A1F44] text-[#0A1F44] bg-[#0A1F44]/5' : 'border-transparent hover:text-[#0A1F44] hover:bg-gray-50'
          }`}
        >
          <FileText size={16} /> Hospital Fees List
        </button>
      </div>

      {/* Tab Panels Contents */}
      <div className="bg-white border border-gray-200 rounded-b-lg p-6 md:p-8 shadow-sm">
        
        {/* 1. OPD Schedules */}
        {activeTab === 'opd' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-2 flex items-center gap-2">
              <Clock className="text-[#D4870A]" size={18} /> Outpatient Department (OPD) Rosters
            </h3>
            
            {showOpdHtml ? (
              <div 
                className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans mt-4"
                dangerouslySetInnerHTML={{ __html: dynamicOpdHtml }}
              />
            ) : (
              <>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Patient registrations are processed at the ground-floor counters between **8:00 AM and 1:30 PM**. Specialty diagnostic consultations and preclinical reviews are scheduled daily.
                </p>

                <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs md:text-sm">
                  <table className="w-full text-left">
                    <thead className="bg-[#0A1F44] text-white font-ui uppercase tracking-wider text-[10px] font-semibold">
                      <tr>
                        <th className="px-6 py-4">Day</th>
                        <th className="px-6 py-4">Registration Timings</th>
                        <th className="px-6 py-4">Clinical OPD Hours</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[#2D2D2D]">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                        <tr key={day} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-bold text-[#0A1F44]">{day}</td>
                          <td className="px-6 py-4 font-medium">8:00 AM - 1:30 PM</td>
                          <td className="px-6 py-4 text-gray-500">8:30 AM - 2:00 PM</td>
                          <td className="px-6 py-4">
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold py-0.5 px-2.5 rounded-full border border-emerald-100 uppercase tracking-wide">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50/50">
                        <td className="px-6 py-4 font-bold text-gray-400">Sunday</td>
                        <td className="px-6 py-4 text-gray-400">Closed</td>
                        <td className="px-6 py-4 text-gray-400">Closed</td>
                        <td className="px-6 py-4">
                          <span className="bg-rose-50 text-rose-600 text-[10px] font-bold py-0.5 px-2.5 rounded-full border border-rose-100 uppercase tracking-wide">
                            Closed
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded p-4 text-xs flex gap-3 text-[#2D2D2D]">
                  <ShieldAlert className="text-[#D4870A] shrink-0" size={20} />
                  <div>
                    <strong className="text-[#0A1F44] block mb-0.5 font-serif text-sm">Emergency Dental Services Available 24/7</strong>
                    In cases of acute facial trauma, fractures, or severe tooth infections, our Emergency Trauma Suite operates round-the-clock inside the AMCH Dibrugarh hospital wings. Call <strong>+91 373 2300999</strong>.
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 2. Specialty Clinics */}
        {activeTab === 'clinics' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-2 flex items-center gap-2">
              <Stethoscope className="text-[#1B5E3B]" size={18} /> Specialized Clinical Departments
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {[
                { title: 'Implantology Clinic', desc: 'State-of-the-art screw-retained restorations, computer-guided sinus lifts, and full mouth rehabilitations led by Prosthodontic and Perio surgeons.', tag: 'ADVANCED PROSTHESIS' },
                { title: 'Laser Restorative Suite', desc: 'Minimally-invasive soft tissue surgeries, laser gum curettages, and precise aesthetic bleaching therapies with minimal clinical discomfort.', tag: 'HIGH SPEED LASERS' },
                { title: 'Maxillofacial Trauma Unit', desc: 'Specialized diagnostic reviews, facial fracture settings, cyst enucleations, and orthognathic alignment reviews managed by surgery specialists.', tag: 'SURGICAL TRAUMA' },
                { title: 'Micro-Endodontic Wing', desc: 'High precision operating microscopes for root canal therapies, aesthetic crowns placement, and composite restorations.', tag: 'PRECISION ENDODONTICS' }
              ].map((c, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-5 bg-[#F8F9FA] hover:border-[#1B5E3B] transition">
                  <span className="inline-block bg-[#1B5E3B]/10 text-[#1B5E3B] text-[9px] font-bold tracking-wider py-0.5 px-2.5 rounded-full mb-3 uppercase">
                    {c.tag}
                  </span>
                  <h4 className="font-serif text-base font-bold text-[#0A1F44] mb-2">{c.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Appointment Form */}
        {activeTab === 'registration' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] flex items-center justify-center gap-1.5">
                <Smile className="text-[#D4870A]" /> OPD Patient Registration Request
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-sans">
                Pre-register online to skip standard queue waitlists. Submissions generate an inbox entry for our Medical Desk reviews.
              </p>
            </div>

            {status === 'success' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center space-y-3 text-[#1B5E3B]">
                <CheckCircle className="mx-auto text-emerald-600" size={32} />
                <h4 className="font-serif font-bold text-lg text-[#0A1F44]">Registration Successful!</h4>
                <p className="text-xs leading-relaxed max-w-md mx-auto">
                  Your appointment request has been successfully generated in our Admin Inbox. A registration receipt reference has been sent to our desk. Please bring a copy of your ID on arrival.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="bg-[#1B5E3B] hover:bg-[#247C4E] text-white text-[10px] font-bold font-ui py-2 px-4 rounded uppercase tracking-wider transition mt-4"
                >
                  Register New Patient
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
                      placeholder="Enter patient name..."
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
                      placeholder="patient@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Preferred Appointment Date (Required)</label>
                    <input
                      type="date"
                      value={prefDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPrefDate(e.target.value)}
                      className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Target Speciality Department</label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition appearance-none cursor-pointer"
                  >
                    {departmentsList.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Symptoms / Notes (Optional)</label>
                  <textarea
                    placeholder="Briefly describe dental complaints, toothache duration, etc..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider transition shadow-sm"
                  >
                    {status === 'loading' ? 'Processing Submission...' : 'Submit Patient Registration'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 4. Subsidized Charges */}
        {activeTab === 'charges' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-gray-100 pb-2 flex items-center gap-2">
              <FileText className="text-[#0A1F44]" size={18} /> Government Subsidized Dental Treatment Fees
            </h3>
            
            {showChargesHtml ? (
              <div 
                className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans mt-4"
                dangerouslySetInnerHTML={{ __html: dynamicChargesHtml }}
              />
            ) : (
              <>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-sans">
                  As a public health institution, basic diagnostic consultations and clinical treatments are delivered free-of-cost to students and highly subsidized for other citizens.
                </p>

                <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs md:text-sm">
                  <table className="w-full text-left">
                    <thead className="bg-[#0A1F44] text-white font-ui uppercase tracking-wider text-[10px] font-semibold">
                      <tr>
                        <th className="px-6 py-4">Treatment Category</th>
                        <th className="px-6 py-4">Subsidized Fee (INR)</th>
                        <th className="px-6 py-4">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[#2D2D2D]">
                      {[
                        { cat: 'General Diagnostics & OPD Consultation Ticket', price: '₹10 (Valid 15 Days)', time: '1st Visit' },
                        { cat: 'Full Mouth Scaling & Polishing (Prophylaxis)', price: '₹100', time: '1 Session' },
                        { cat: 'Simple Tooth Extraction (Exodontia)', price: '₹50', time: '1 Session' },
                        { cat: 'Root Canal Treatment (Micro-Endodontic - RCT)', price: '₹400', time: '2-3 Sessions' },
                        { cat: 'Complete Acrylic Denture Set (Prosthetics)', price: '₹1,500', time: '4 Sessions' },
                        { cat: 'Metal Ceramic Dental Crown & Bridge (Per Unit)', price: '₹500', time: '2 Sessions' },
                        { cat: 'Orthodontic Braces Alignment Therapy', price: '₹5,000 (Subsidized)', time: '12-18 Months' }
                      ].map((fee, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-semibold text-[#0A1F44]">{fee.cat}</td>
                          <td className="px-6 py-4 text-[#1B5E3B] font-bold">{fee.price}</td>
                          <td className="px-6 py-4 text-gray-500 italic">{fee.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
