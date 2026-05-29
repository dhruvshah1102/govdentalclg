'use client';

import React, { useState } from 'react';
import { 
  Inbox, CheckCircle, Trash2, Mail, Phone, 
  Calendar, AlertCircle, Award, Stethoscope, HelpCircle 
} from 'lucide-react';

interface Submission {
  id: number;
  type: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  form_data: string | null;
  submitted_at: string;
  status: string;
}

interface InboxClientProps {
  initialSubmissions: Submission[];
}

export const InboxClient: React.FC<InboxClientProps> = ({ initialSubmissions }) => {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [activeTab, setActiveTab] = useState<'Appointment' | 'Contact' | 'Grievance' | 'Alumni'>('Appointment');
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // Filter submissions by tab type
  const activeSubs = submissions.filter((s) => s.type === activeTab);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/admin/submissions?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
      } else {
        alert('Failed to update submission status.');
      }
    } catch (err) {
      alert('A network error occurred.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this submission?')) {
      return;
    }

    setLoadingId(id);
    try {
      const response = await fetch(`/api/admin/submissions?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert('Failed to delete submission.');
      }
    } catch (err) {
      alert('A network error occurred.');
    } finally {
      setLoadingId(null);
    }
  };

  // Safe helper to parse form_data JSON string
  const renderFormData = (formDataStr: string | null) => {
    if (!formDataStr) return null;
    try {
      const data = JSON.parse(formDataStr);
      return (
        <div className="bg-gray-50 border border-gray-150 p-3 rounded text-[11px] font-sans text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 leading-relaxed">
          {Object.entries(data).map(([key, val]) => (
            <span key={key} className="capitalize">
              <strong>{key.replace('_', ' ')}:</strong> {String(val)}
            </span>
          ))}
        </div>
      );
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tabs selectors */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-lg shadow-sm text-xs font-semibold text-gray-500 uppercase tracking-wider font-ui overflow-x-auto">
        {[
          { id: 'Appointment', label: 'Patient OPD', icon: Stethoscope },
          { id: 'Contact', label: 'Feedbacks & Contacts', icon: Mail },
          { id: 'Grievance', label: 'Student Grievances', icon: AlertCircle },
          { id: 'Alumni', label: 'Alumni Registers', icon: Award }
        ].map((tab) => {
          const tabCount = submissions.filter((s) => s.type === tab.id && s.status === 'New').length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-[#D4870A] text-[#0A1F44] bg-[#0A1F44]/5 font-bold' 
                  : 'border-transparent hover:text-[#0A1F44] hover:bg-gray-50'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
              {tabCount > 0 && (
                <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                  {tabCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Inbox List Area */}
      <div className="bg-white border border-gray-200 rounded-b-lg p-6 shadow-sm">
        {activeSubs.length === 0 ? (
          <div className="text-center py-16 text-xs text-gray-400 font-sans border border-dashed rounded-lg border-gray-200">
            No submissions found under this category.
          </div>
        ) : (
          <div className="space-y-6">
            {activeSubs.map((sub) => (
              <div 
                key={sub.id}
                className={`border rounded-lg p-5 transition hover:shadow-md ${
                  sub.status === 'New' 
                    ? 'border-l-4 border-l-[#D4870A] border-gray-200 bg-[#F8F9FA]/40' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-4 flex-wrap md:flex-nowrap mb-3.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-bold text-[#0A1F44]">{sub.name}</span>
                      <span className={`text-[8px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full border ${
                        sub.status === 'New' 
                          ? 'bg-amber-50 text-amber-600 border-amber-100' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-sans block mt-1">
                      Submitted on: {new Date(sub.submitted_at).toLocaleString('en-IN', { hour12: true })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {sub.status === 'New' && (
                      <button
                        onClick={() => handleUpdateStatus(sub.id, 'Resolved')}
                        disabled={loadingId === sub.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold font-ui py-1.5 px-3 rounded uppercase tracking-wider transition shadow flex items-center gap-1"
                      >
                        <CheckCircle size={12} /> Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(sub.id)}
                      disabled={loadingId === sub.id}
                      className="bg-transparent border border-gray-300 hover:border-red-500 hover:text-red-600 text-gray-500 text-[10px] font-bold font-ui py-1.5 px-3 rounded uppercase tracking-wider transition flex items-center gap-1"
                      title="Delete Entry"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>

                {/* Sub Contact specs */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-gray-400 font-sans my-3 bg-gray-50/50 p-2.5 rounded border border-gray-100">
                  {sub.phone && (
                    <span className="flex items-center gap-1 font-semibold">
                      <Phone size={12} className="text-[#D4870A]" /> Phone: {sub.phone}
                    </span>
                  )}
                  {sub.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={12} className="text-[#1B5E3B]" /> Email: {sub.email}
                    </span>
                  )}
                  {sub.subject && (
                    <span className="font-semibold text-gray-500">
                      Subject: {sub.subject}
                    </span>
                  )}
                </div>

                {/* Main message */}
                <p className="text-xs md:text-sm text-gray-600 font-sans leading-relaxed border-t border-gray-100 pt-3">
                  {sub.message}
                </p>

                {/* Dynamic Decoded JSON parameters */}
                {renderFormData(sub.form_data)}

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
