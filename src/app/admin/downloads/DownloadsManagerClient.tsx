'use client';

import React, { useState } from 'react';
import { FileText, Plus, Trash2, CheckCircle, AlertCircle, FileDown } from 'lucide-react';

interface DownloadItem {
  id: number;
  title: string;
  category: string;
  upload_date: string;
  file_url: string;
  enabled: number;
}

interface DownloadsManagerClientProps {
  initialDownloads: DownloadItem[];
}

export const DownloadsManagerClient: React.FC<DownloadsManagerClientProps> = ({ initialDownloads }) => {
  const [downloads, setDownloads] = useState<DownloadItem[]>(initialDownloads);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Forms');
  const [fileUrl, setFileUrl] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileUrl) {
      alert('Please fill in required fields (Document Title and File PDF link).');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/admin/downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          file_url: fileUrl
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newDownload = {
          id: data.id,
          title,
          category,
          upload_date: new Date().toISOString().split('T')[0],
          file_url: fileUrl,
          enabled: 1
        };
        setDownloads((prev) => [newDownload, ...prev]);
        setStatus('success');
        
        // Reset form
        setTitle('');
        setCategory('Forms');
        setFileUrl('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently remove this document from the library?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/downloads?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDownloads((prev) => prev.filter((d) => d.id !== id));
      } else {
        alert('Failed to delete document.');
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
          <span>New document uploaded to library successfully!</span>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded flex items-center gap-2">
          <AlertCircle size={16} />
          <span>Failed to upload document. Please verify fields and try again.</span>
        </div>
      )}

      {/* Group 1: Add Download */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
          <Plus className="text-[#D4870A]" size={16} /> Upload New Document
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Document Title (Required)</label>
            <input
              type="text"
              placeholder="e.g. BDS Course Syllabi Session 2026..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              required
            />
          </div>
          <div>
            <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Document Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition cursor-pointer"
            >
              <option value="Forms">Forms</option>
              <option value="Prospectus">Prospectus / Brochure</option>
              <option value="Schedules">Timetables & Schedules</option>
              <option value="Circulars">Government Circulars</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">PDF File Link / URL (Required)</label>
            <input
              type="text"
              placeholder="e.g. /assets/documents/form_fitness.pdf..."
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-1 font-ui"
            >
              <Plus size={14} /> {status === 'loading' ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </form>
      </div>

      {/* Group 2: Current Downloads */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
          <FileDown className="text-[#1B5E3B]" size={16} /> Current Files Library
        </h3>

        {downloads.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400 font-sans border border-dashed rounded-lg border-gray-200">
            No files uploaded in library.
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs font-sans mt-4">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 font-ui uppercase text-[9px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Document Title</th>
                  <th className="px-6 py-3">Upload Date</th>
                  <th className="px-6 py-3">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                {downloads.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3">
                      <span className="bg-gray-100 text-gray-500 py-0.5 px-2.5 rounded font-semibold text-[9px] capitalize">
                        {d.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 max-w-sm truncate" title={d.title}>{d.title}</td>
                    <td className="px-6 py-3 text-gray-400">{d.upload_date}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDelete(d.id)}
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
