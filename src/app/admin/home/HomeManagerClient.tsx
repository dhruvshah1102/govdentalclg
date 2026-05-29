'use client';

import React, { useState } from 'react';
import { 
  ClipboardList, Plus, Trash2, CheckCircle, 
  AlertCircle, Save, Settings, Layers, Calendar, 
  HelpCircle, Eye, EyeOff, Sparkles, Smile, Star,
  Megaphone
} from 'lucide-react';

interface Slide {
  id: number;
  image_url: string;
  title: string;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  sort_order: number;
  enabled: number;
}

interface Announcement {
  id: number;
  title: string;
  link: string | null;
  category: string;
  date: string;
  is_new: number;
  enabled: number;
}

interface StatItem {
  id: number;
  label: string;
  value: string;
  icon: string;
  sort_order: number;
}

interface HomeManagerClientProps {
  initialSettings: Record<string, string>;
  initialSlides: Slide[];
  initialAnnouncements: Announcement[];
  initialStats: StatItem[];
}

export const HomeManagerClient: React.FC<HomeManagerClientProps> = ({
  initialSettings,
  initialSlides,
  initialAnnouncements,
  initialStats
}) => {
  const [activeTab, setActiveTab] = useState<'slides' | 'announcements' | 'stats' | 'dean'>('slides');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Module Lists States
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [stats, setStats] = useState<StatItem[]>(initialStats);
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);

  // --- Editing States ---
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [editingStat, setEditingStat] = useState<StatItem | null>(null);

  // --- Sub-Form States ---
  // Sliders Form
  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideImage, setSlideImage] = useState('');
  const [slideCtaText, setSlideCtaText] = useState('');
  const [slideCtaLink, setSlideCtaLink] = useState('');
  const [slideSort, setSlideSort] = useState('0');

  // Announcements Form
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState('NoticeBoard'); // Scrolling, NoticeBoard, StudentNotice
  const [annLink, setAnnLink] = useState('');
  const [annIsNew, setAnnIsNew] = useState(1);

  // Stats Form
  const [statLabel, setStatLabel] = useState('');
  const [statVal, setStatVal] = useState('');
  const [statIcon, setStatIcon] = useState('Activity');
  const [statSort, setStatSort] = useState('0');

  // Dean Form
  const handleDeanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  // --- Edit Form Helpers ---
  const startEditSlide = (slide: Slide) => {
    setEditingSlide(slide);
    setSlideTitle(slide.title);
    setSlideSubtitle(slide.subtitle || '');
    setSlideImage(slide.image_url);
    setSlideCtaText(slide.cta_text || '');
    setSlideCtaLink(slide.cta_link || '');
    setSlideSort(String(slide.sort_order));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetSlideForm = () => {
    setEditingSlide(null);
    setSlideTitle('');
    setSlideSubtitle('');
    setSlideImage('');
    setSlideCtaText('');
    setSlideCtaLink('');
    setSlideSort('0');
  };

  const startEditAnnouncement = (ann: Announcement) => {
    setEditingAnn(ann);
    setAnnTitle(ann.title);
    setAnnCategory(ann.category);
    setAnnLink(ann.link || '');
    setAnnIsNew(ann.is_new);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetAnnForm = () => {
    setEditingAnn(null);
    setAnnTitle('');
    setAnnCategory('NoticeBoard');
    setAnnLink('');
    setAnnIsNew(1);
  };

  const startEditStat = (stat: StatItem) => {
    setEditingStat(stat);
    setStatLabel(stat.label);
    setStatVal(stat.value);
    setStatIcon(stat.icon);
    setStatSort(String(stat.sort_order));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetStatForm = () => {
    setEditingStat(null);
    setStatLabel('');
    setStatVal('');
    setStatIcon('Activity');
    setStatSort('0');
  };

  // --- CRUD Event Triggers ---
  
  // 1. Sliders Add / Update
  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitle || !slideImage) {
      alert('Please fill in required fields (Slide Title and Image URL).');
      return;
    }
    setStatus('loading');
    try {
      const isEditing = !!editingSlide;
      const url = isEditing ? `/api/admin/hero_slides?id=${editingSlide.id}` : '/api/admin/hero_slides';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: slideImage,
          title: slideTitle,
          subtitle: slideSubtitle || null,
          cta_text: slideCtaText || null,
          cta_link: slideCtaLink || null,
          sort_order: Number(slideSort),
          enabled: editingSlide ? editingSlide.enabled : 1
        })
      });

      if (response.ok) {
        if (isEditing) {
          const updatedSlide: Slide = {
            id: editingSlide.id,
            image_url: slideImage,
            title: slideTitle,
            subtitle: slideSubtitle || null,
            cta_text: slideCtaText || null,
            cta_link: slideCtaLink || null,
            sort_order: Number(slideSort),
            enabled: editingSlide.enabled
          };
          setSlides((prev) => prev.map((s) => s.id === editingSlide.id ? updatedSlide : s).sort((a, b) => a.sort_order - b.sort_order));
          resetSlideForm();
        } else {
          const data = await response.json();
          const newSlide: Slide = {
            id: data.id,
            image_url: slideImage,
            title: slideTitle,
            subtitle: slideSubtitle || null,
            cta_text: slideCtaText || null,
            cta_link: slideCtaLink || null,
            sort_order: Number(slideSort),
            enabled: 1
          };
          setSlides((prev) => [...prev, newSlide].sort((a, b) => a.sort_order - b.sort_order));
          resetSlideForm();
        }
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleDeleteSlide = async (id: number) => {
    if (!window.confirm('Delete this hero slide permanently?')) return;
    try {
      const response = await fetch(`/api/admin/hero_slides?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSlides((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  // 2. Announcements Add / Update
  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle) {
      alert('Notice title is a required parameter.');
      return;
    }
    setStatus('loading');
    try {
      const isEditing = !!editingAnn;
      const url = isEditing ? `/api/admin/announcements?id=${editingAnn.id}` : '/api/admin/announcements';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: annTitle,
          link: annLink || null,
          category: annCategory,
          is_new: annIsNew,
          enabled: editingAnn ? editingAnn.enabled : 1
        })
      });

      if (response.ok) {
        if (isEditing) {
          const updatedAnn: Announcement = {
            ...editingAnn,
            title: annTitle,
            link: annLink || null,
            category: annCategory,
            is_new: annIsNew
          };
          setAnnouncements((prev) => prev.map((a) => a.id === editingAnn.id ? updatedAnn : a));
          resetAnnForm();
        } else {
          const data = await response.json();
          const newAnn: Announcement = {
            id: data.id,
            title: annTitle,
            link: annLink || null,
            category: annCategory,
            date: new Date().toISOString().split('T')[0],
            is_new: annIsNew,
            enabled: 1
          };
          setAnnouncements((prev) => [newAnn, ...prev]);
          resetAnnForm();
        }
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!window.confirm('Remove this notification permanently?')) return;
    try {
      const response = await fetch(`/api/admin/announcements?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  // 3. Stats Add / Update
  const handleAddStat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statLabel || !statVal) {
      alert('Label and target number are required.');
      return;
    }
    setStatus('loading');
    try {
      const isEditing = !!editingStat;
      const url = isEditing ? `/api/admin/stats?id=${editingStat.id}` : '/api/admin/stats';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: statLabel,
          value: statVal,
          icon: statIcon,
          sort_order: Number(statSort)
        })
      });

      if (response.ok) {
        if (isEditing) {
          const updatedStat: StatItem = {
            id: editingStat.id,
            label: statLabel,
            value: statVal,
            icon: statIcon,
            sort_order: Number(statSort)
          };
          setStats((prev) => prev.map((s) => s.id === editingStat.id ? updatedStat : s).sort((a, b) => a.sort_order - b.sort_order));
          resetStatForm();
        } else {
          const data = await response.json();
          const newStat: StatItem = {
            id: data.id,
            label: statLabel,
            value: statVal,
            icon: statIcon,
            sort_order: Number(statSort)
          };
          setStats((prev) => [...prev, newStat].sort((a, b) => a.sort_order - b.sort_order));
          resetStatForm();
        }
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleDeleteStat = async (id: number) => {
    if (!window.confirm('Delete this statistics number permanently?')) return;
    try {
      const response = await fetch(`/api/admin/stats?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setStats((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  // 4. Dean message update
  const handleSaveDean = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dean_name: settings.dean_name,
          dean_designation: settings.dean_designation,
          dean_message: settings.dean_message
        })
      });
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tab controls */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-lg shadow-sm text-xs font-semibold text-gray-500 uppercase tracking-wider font-ui overflow-x-auto">
        <button
          onClick={() => { setActiveTab('slides'); setStatus('idle'); }}
          className={`flex items-center gap-1.5 px-6 py-4 border-b-2 transition whitespace-nowrap ${
            activeTab === 'slides' ? 'border-[#D4870A] text-[#0A1F44] bg-[#0A1F44]/5 font-bold' : 'border-transparent hover:bg-gray-50'
          }`}
        >
          <ClipboardList size={15} /> Hero Carousel Sliders
        </button>
        <button
          onClick={() => { setActiveTab('announcements'); setStatus('idle'); }}
          className={`flex items-center gap-1.5 px-6 py-4 border-b-2 transition whitespace-nowrap ${
            activeTab === 'announcements' ? 'border-[#D4870A] text-[#0A1F44] bg-[#0A1F44]/5 font-bold' : 'border-transparent hover:bg-gray-50'
          }`}
        >
          <Megaphone size={15} className="text-[#D4870A]" /> Notices & scrolling Tickers
        </button>
        <button
          onClick={() => { setActiveTab('stats'); setStatus('idle'); }}
          className={`flex items-center gap-1.5 px-6 py-4 border-b-2 transition whitespace-nowrap ${
            activeTab === 'stats' ? 'border-[#D4870A] text-[#0A1F44] bg-[#0A1F44]/5 font-bold' : 'border-transparent hover:bg-gray-50'
          }`}
        >
          <Layers size={15} className="text-[#1B5E3B]" /> Quick Stats counters
        </button>
        <button
          onClick={() => { setActiveTab('dean'); setStatus('idle'); }}
          className={`flex items-center gap-1.5 px-6 py-4 border-b-2 transition whitespace-nowrap ${
            activeTab === 'dean' ? 'border-[#D4870A] text-[#0A1F44] bg-[#0A1F44]/5 font-bold' : 'border-transparent hover:bg-gray-50'
          }`}
        >
          <Smile size={15} /> Principal/Dean Message
        </button>
      </div>

      {/* Main Tab Panel Container */}
      <div className="bg-white border border-gray-200 rounded-b-lg p-6 shadow-sm font-ui text-xs">
        
        {status === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded p-3.5 text-[#1B5E3B] flex items-center gap-2 font-sans font-semibold mb-4">
            <CheckCircle size={16} />
            <span>Operational update live and successfully saved!</span>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded flex items-center gap-2 mb-4 font-sans font-semibold">
            <AlertCircle size={16} />
            <span>Operation failed. Please verify inputs or session logs.</span>
          </div>
        )}

        {/* 1. HERO CAROUSEL EDITOR */}
        {activeTab === 'slides' && (
          <div className="space-y-6">
            
            {/* Add Slide */}
            <div className="bg-gray-50 border border-gray-150 p-5 rounded-lg">
              <h4 className="font-serif text-sm font-bold text-[#0A1F44] border-b border-gray-200 pb-2 mb-4 flex items-center gap-1">
                {editingSlide ? <Settings size={14} /> : <Plus size={14} />} {editingSlide ? 'Edit Carousel Slide' : 'Add Carousel Slide'}
              </h4>

              <form onSubmit={handleAddSlide} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Slide Title (Required)</label>
                    <input
                      type="text"
                      placeholder="e.g. Excellence in Dental Pedagogy..."
                      value={slideTitle}
                      onChange={(e) => setSlideTitle(e.target.value)}
                      className="w-full bg-white text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Slide Backdrop Image URL (Required)</label>
                    <input
                      type="text"
                      placeholder="e.g. /assets/images/slider_1.jpg..."
                      value={slideImage}
                      onChange={(e) => setSlideImage(e.target.value)}
                      className="w-full bg-white text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Slide Description / Subtext (Optional)</label>
                  <textarea
                    placeholder="Enter short description subtext..."
                    value={slideSubtitle}
                    onChange={(e) => setSlideSubtitle(e.target.value)}
                    rows={2}
                    className="w-full bg-white text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">CTA Button Text (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Apply Now..."
                      value={slideCtaText}
                      onChange={(e) => setSlideCtaText(e.target.value)}
                      className="w-full bg-white text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">CTA Link / Redirect Path (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. /admissions..."
                      value={slideCtaLink}
                      onChange={(e) => setSlideCtaLink(e.target.value)}
                      className="w-full bg-white text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Sort Ordering Priority Number</label>
                    <input
                      type="number"
                      value={slideSort}
                      onChange={(e) => setSlideSort(e.target.value)}
                      className="w-full bg-white text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-1">
                  {editingSlide && (
                    <button
                      type="button"
                      onClick={resetSlideForm}
                      className="bg-gray-100 hover:bg-gray-250 text-gray-700 text-xs font-bold py-2.5 px-6 rounded uppercase tracking-wider transition shadow-sm"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold py-2.5 px-6 rounded uppercase tracking-wider transition shadow-sm flex items-center gap-1.5"
                  >
                    {editingSlide ? <Save size={14} /> : <Plus size={14} />} {editingSlide ? 'Save Slide' : 'Add Slide'}
                  </button>
                </div>
              </form>
            </div>

            {/* Slide Lists */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h4 className="font-serif text-sm font-bold text-[#0A1F44] border-b border-gray-150 pb-2 mb-4">Current Sliders Index</h4>
              {slides.length === 0 ? (
                <div className="text-center py-6 text-gray-400 font-sans">No slides uploaded.</div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left font-sans">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[9px] font-bold tracking-wider">
                      <tr>
                        <th className="px-5 py-3">Sorting</th>
                        <th className="px-5 py-3">Image Url</th>
                        <th className="px-5 py-3">Slide Title</th>
                        <th className="px-5 py-3">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                      {slides.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50/50">
                          <td className="px-5 py-3 font-bold text-[#0A1F44]">{s.sort_order}</td>
                          <td className="px-5 py-3 text-gray-400 max-w-[150px] truncate" title={s.image_url}>{s.image_url}</td>
                          <td className="px-5 py-3 font-semibold">{s.title}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => startEditSlide(s)}
                                className="text-blue-500 hover:text-blue-700 font-bold transition flex items-center gap-1"
                              >
                                <Settings size={13} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSlide(s.id)}
                                className="text-red-500 hover:text-red-700 font-bold transition flex items-center gap-1"
                              >
                                <Trash2 size={13} /> Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 2. ANNOUNCEMENTS & SCROLLING TICKERS */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            
            {/* Add Notice */}
            <div className="bg-gray-50 border border-gray-150 p-5 rounded-lg">
              <h4 className="font-serif text-sm font-bold text-[#0A1F44] border-b border-gray-200 pb-2 mb-4 flex items-center gap-1">
                {editingAnn ? <Settings size={14} /> : <Plus size={14} />} {editingAnn ? 'Edit Notice or Ticker Alert' : 'Publish Notice or Ticker Alert'}
              </h4>

              <form onSubmit={handleAddAnnouncement} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Notice Heading / Ticker Text (Required)</label>
                  <input
                    type="text"
                    placeholder="e.g. Academic timetables BDS term released..."
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    className="w-full bg-white text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Notice Category</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value)}
                    className="w-full bg-white text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition cursor-pointer font-bold"
                  >
                    <option value="NoticeBoard">General Notice Board</option>
                    <option value="StudentNotice">Student Portal Notice</option>
                    <option value="Scrolling">Scrolling Marquee Ticker</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Redirect link / Attachment PDF path (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. /downloads/session_calendar.pdf..."
                    value={annLink}
                    onChange={(e) => setAnnLink(e.target.value)}
                    className="w-full bg-white text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                  />
                </div>
                <div className="flex gap-3">
                  {editingAnn && (
                    <button
                      type="button"
                      onClick={resetAnnForm}
                      className="w-full bg-gray-100 hover:bg-gray-250 text-gray-700 text-xs font-bold py-3 px-4 rounded uppercase tracking-wider transition shadow-sm"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {editingAnn ? <Save size={14} /> : <Plus size={14} />} {editingAnn ? 'Save Notice' : 'Publish Notice'}
                  </button>
                </div>
              </form>
            </div>

            {/* Notices lists */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h4 className="font-serif text-sm font-bold text-[#0A1F44] border-b border-gray-150 pb-2 mb-4">Published Alerts Index</h4>
              {announcements.length === 0 ? (
                <div className="text-center py-6 text-gray-400 font-sans">No notices published.</div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left font-sans">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[9px] font-bold tracking-wider">
                      <tr>
                        <th className="px-5 py-3">Category</th>
                        <th className="px-5 py-3">Notice/Marquee Text</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                      {announcements.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50/50">
                          <td className="px-5 py-3">
                            <span className="bg-gray-100 text-gray-500 py-0.5 px-2.5 rounded font-semibold text-[9px] capitalize">
                              {a.category === 'StudentNotice' ? 'Student Portal' : a.category === 'NoticeBoard' ? 'Notice Board' : 'Scrolling Ticker'}
                            </span>
                          </td>
                          <td className="px-5 py-3 max-w-sm truncate font-semibold" title={a.title}>{a.title}</td>
                          <td className="px-5 py-3 text-gray-400 text-[10px]">{a.date}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => startEditAnnouncement(a)}
                                className="text-blue-500 hover:text-blue-700 font-bold transition flex items-center gap-1"
                              >
                                <Settings size={13} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAnnouncement(a.id)}
                                className="text-red-500 hover:text-red-700 font-bold transition flex items-center gap-1"
                              >
                                <Trash2 size={13} /> Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 3. QUICK STATS COUNTERS */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            
            {/* Add Stat */}
            <div className="bg-gray-50 border border-gray-150 p-5 rounded-lg">
              <h4 className="font-serif text-sm font-bold text-[#0A1F44] border-b border-gray-200 pb-2 mb-4 flex items-center gap-1">
                {editingStat ? <Settings size={14} /> : <Plus size={14} />} {editingStat ? 'Edit Stats Counter' : 'Create Stats Counter'}
              </h4>

              <form onSubmit={handleAddStat} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Stats Label (Required)</label>
                  <input
                    type="text"
                    placeholder="e.g. BDS Seats..."
                    value={statLabel}
                    onChange={(e) => setStatLabel(e.target.value)}
                    className="w-full bg-white text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Target Value (Required)</label>
                  <input
                    type="text"
                    placeholder="e.g. 50 / 45,000+..."
                    value={statVal}
                    onChange={(e) => setStatVal(e.target.value)}
                    className="w-full bg-white text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Lucide Icon name</label>
                  <select
                    value={statIcon}
                    onChange={(e) => setStatIcon(e.target.value)}
                    className="w-full bg-white text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition cursor-pointer font-bold"
                  >
                    <option value="GraduationCap">Graduation Cap</option>
                    <option value="Award">Award Stamp</option>
                    <option value="Calendar">Calendar Sheets</option>
                    <option value="Layers">Layers Stack</option>
                    <option value="Activity">Pulse Activity</option>
                    <option value="Star">Star Seals</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  {editingStat && (
                    <button
                      type="button"
                      onClick={resetStatForm}
                      className="w-full bg-gray-100 hover:bg-gray-250 text-gray-700 text-xs font-bold py-3 px-4 rounded uppercase tracking-wider transition shadow-sm"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {editingStat ? <Save size={14} /> : <Plus size={14} />} {editingStat ? 'Save Stat' : 'Add Stat'}
                  </button>
                </div>
              </form>
            </div>

            {/* Stats list */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h4 className="font-serif text-sm font-bold text-[#0A1F44] border-b border-gray-150 pb-2 mb-4">Metrics Counter Index</h4>
              {stats.length === 0 ? (
                <div className="text-center py-6 text-gray-400 font-sans">No statistics counter active.</div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left font-sans">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[9px] font-bold tracking-wider">
                      <tr>
                        <th className="px-5 py-3">Icon Type</th>
                        <th className="px-5 py-3">Stats Label Name</th>
                        <th className="px-5 py-3">Dynamic Value</th>
                        <th className="px-5 py-3">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                      {stats.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50/50">
                          <td className="px-5 py-3 font-semibold text-[#D4870A]">{s.icon}</td>
                          <td className="px-5 py-3 font-semibold">{s.label}</td>
                          <td className="px-5 py-3 font-bold text-[#1B5E3B]">{s.value}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => startEditStat(s)}
                                className="text-blue-500 hover:text-blue-700 font-bold transition flex items-center gap-1"
                              >
                                <Settings size={13} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteStat(s.id)}
                                className="text-red-500 hover:text-red-700 font-bold transition flex items-center gap-1"
                              >
                                <Trash2 size={13} /> Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 4. DEAN'S WELCOME PANEL */}
        {activeTab === 'dean' && (
          <form onSubmit={handleSaveDean} className="space-y-4">
            <h3 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-1">
              <Smile size={16} className="text-[#D4870A]" /> Principal & Dean Welcome Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Dean Name (with qualifications)</label>
                <input
                  type="text"
                  name="dean_name"
                  value={settings.dean_name || ''}
                  onChange={handleDeanChange}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                  required
                />
              </div>
              <div>
                <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Official Designation Title</label>
                <input
                  type="text"
                  name="dean_designation"
                  value={settings.dean_designation || ''}
                  onChange={handleDeanChange}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Welcome Message Excerpt (Rich Text Allowed)</label>
              <textarea
                name="dean_message"
                value={settings.dean_message || ''}
                onChange={handleDeanChange}
                rows={6}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition font-sans"
                required
              ></textarea>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider transition shadow-sm flex items-center gap-1.5"
              >
                <Save size={14} /> {status === 'loading' ? 'Saving Message...' : 'Save Welcome message'}
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
};
