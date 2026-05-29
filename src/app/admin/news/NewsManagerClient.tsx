'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Trash2, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  date: string;
  time: string | null;
  venue: string | null;
  category: string;
  status: string;
}

interface NewsManagerClientProps {
  initialPosts: Post[];
}

export const NewsManagerClient: React.FC<NewsManagerClientProps> = ({ initialPosts }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('News');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [content, setContent] = useState('');
  const [attachUrl, setAttachUrl] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !content) {
      alert('Please fill in required fields (Title, Date, and Content description).');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          date,
          time: time || null,
          venue: venue || null,
          content,
          attachment_url: attachUrl || null
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newPost = {
          id: data.id,
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          content,
          date,
          time: time || null,
          venue: venue || null,
          category,
          status: 'Published'
        };
        setPosts((prev) => [newPost, ...prev]);
        setStatus('success');
        
        // Reset form
        setTitle('');
        setCategory('News');
        setDate('');
        setTime('');
        setVenue('');
        setContent('');
        setAttachUrl('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this news/event post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/news?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete post.');
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
          <span>New campus story/event published successfully!</span>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded flex items-center gap-2">
          <AlertCircle size={16} />
          <span>Failed to publish post. Please verify fields and try again.</span>
        </div>
      )}

      {/* Group 1: Add News */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
          <Plus className="text-[#D4870A]" size={16} /> Publish New Story or Event
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Post Title (Required)</label>
              <input
                type="text"
                placeholder="e.g. Free Dental Camp organized..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Post Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition cursor-pointer"
              >
                <option value="News">General Campus News</option>
                <option value="Event">Academic / CME Event</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Publish Date (Required)</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Event Timings (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 10:00 AM onwards..."
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Event Venue (Optional)</label>
              <input
                type="text"
                placeholder="e.g. GDC Conference Hall..."
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Attachment Brochure PDF URL (Optional)</label>
            <input
              type="text"
              placeholder="e.g. /assets/documents/workshop_brochure.pdf..."
              value={attachUrl}
              onChange={(e) => setAttachUrl(e.target.value)}
              className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
            />
          </div>

          <div>
            <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Story Content (HTML Allowed - Required)</label>
            <textarea
              placeholder="Provide story paragraphs..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition font-sans"
              required
            ></textarea>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 font-ui"
            >
              <Plus size={14} /> {status === 'loading' ? 'Publishing...' : 'Publish Campus Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Group 2: Current Posts */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
          <Calendar className="text-[#1B5E3B]" size={16} /> Campus News & Events Index
        </h3>

        {posts.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400 font-sans border border-dashed rounded-lg border-gray-200">
            No campus stories published.
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs font-sans mt-4">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 font-ui uppercase text-[9px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Post Title</th>
                  <th className="px-6 py-3">Publish Date</th>
                  <th className="px-6 py-3">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                        post.category === 'Event' 
                          ? 'bg-blue-50 text-blue-600 border-blue-100' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 max-w-sm truncate" title={post.title}>{post.title}</td>
                    <td className="px-6 py-3 text-gray-400">{post.date}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDelete(post.id)}
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
