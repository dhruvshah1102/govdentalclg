'use client';

import React, { useState } from 'react';
import { FileText, Plus, Trash2, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

interface Tender {
  id: number;
  title: string;
  published_date: string;
  last_date: string;
  document_url: string | null;
  status: string;
  is_new: number;
}

interface TendersManagerClientProps {
  initialTenders: Tender[];
}

export const TendersManagerClient: React.FC<TendersManagerClientProps> = ({ initialTenders }) => {
  const [tenders, setTenders] = useState<Tender[]>(initialTenders);
  const [title, setTitle] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [docUrl, setDocUrl] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !lastDate) {
      alert('Please fill in required fields (Tender Title and Closing Date).');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/admin/tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          published_date: new Date().toISOString().split('T')[0],
          last_date: lastDate,
          document_url: docUrl || null
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newTender = {
          id: data.id,
          title,
          published_date: new Date().toISOString().split('T')[0],
          last_date: lastDate,
          document_url: docUrl || null,
          status: 'Active',
          is_new: 1
        };
        setTenders((prev) => [newTender, ...prev]);
        setStatus('success');
        
        // Reset form
        setTitle('');
        setLastDate('');
        setDocUrl('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this tender notice?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tenders?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTenders((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert('Failed to delete tender.');
      }
    } catch (err) {
      alert('A network error occurred.');
    }
  };

  return (
    <div className="space-y-6 font-ui text-xs">
      
      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-[#1B5E3B] flex items-center gap-2 font-sans font-semibold">
          <CheckCircle size={16} />
          <span>New tender notice published successfully!</span>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded flex items-center gap-2">
          <AlertCircle size={16} />
          <span>Failed to publish tender notice. Please try again.</span>
        </div>
      )}

      {/* Group 1: Add Tender */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
          <Plus className="text-[#D4870A]" size={16} /> Publish New Tender Notice
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Tender Title (Required)</label>
            <input
              type="text"
              placeholder="e.g. Supply & Installation of CBCT systems..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              required
            />
          </div>
          <div>
            <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Closing Last Date (Required)</label>
            <input
              type="date"
              value={lastDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setLastDate(e.target.value)}
              className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Spec. PDF Document URL (Optional)</label>
            <input
              type="text"
              placeholder="e.g. /assets/documents/tender_spec.pdf..."
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-1 font-ui"
            >
              <Plus size={14} /> {status === 'loading' ? 'Publishing...' : 'Publish Tender'}
            </button>
          </div>
        </form>
      </div>

      {/* Group 2: Current Tenders */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
          <FileText className="text-[#1B5E3B]" size={16} /> Current Tenders Registry
        </h3>

        {tenders.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400 font-sans border border-dashed rounded-lg border-gray-200">
            No tender notices published.
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs font-sans mt-4">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 font-ui uppercase text-[9px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Tender Name</th>
                  <th className="px-6 py-3">Published</th>
                  <th className="px-6 py-3">Last Closing Date</th>
                  <th className="px-6 py-3">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                {tenders.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 max-w-sm truncate" title={t.title}>{t.title}</td>
                    <td className="px-6 py-3 text-gray-400">{t.published_date}</td>
                    <td className="px-6 py-3 text-red-600 font-bold">{t.last_date}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-500 hover:text-red-700 font-bold transition flex items-center gap-1"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
