'use client';

import React, { useState } from 'react';
import { 
  Plus, Trash2, CheckCircle, AlertCircle, 
  Image as ImageIcon, Video, Layers, ClipboardList,
  Eye, Play
} from 'lucide-react';

interface GalleryItem {
  id: number;
  album_name: string;
  category: string;
  image_url: string;
  is_video: number;
  video_url: string | null;
}

interface GalleryManagerClientProps {
  initialItems: GalleryItem[];
}

export const GalleryManagerClient: React.FC<GalleryManagerClientProps> = ({ initialItems }) => {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('list');

  // Add Form states
  const [albumName, setAlbumName] = useState('');
  const [category, setCategory] = useState('Academic');
  const [imageUrl, setImageUrl] = useState('');
  const [isVideo, setIsVideo] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');

  const categories = ['Academic', 'Clinical', 'Infrastructure', 'Cultural', 'Events'];

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumName || !imageUrl) {
      alert('Please fill in required fields (Album/Event name and Image/Thumbnail URL).');
      return;
    }
    if (isVideo === 1 && !videoUrl) {
      alert('Please provide the YouTube play link for video assets.');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          album_name: albumName,
          category,
          image_url: imageUrl,
          is_video: isVideo,
          video_url: isVideo === 1 ? videoUrl : null
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newMedia: GalleryItem = {
          id: data.id,
          album_name: albumName,
          category,
          image_url: imageUrl,
          is_video: isVideo,
          video_url: isVideo === 1 ? videoUrl : null
        };
        setItems((prev) => [newMedia, ...prev]);
        setStatus('success');
        
        // Reset form
        setAlbumName('');
        setCategory('Academic');
        setImageUrl('');
        setIsVideo(0);
        setVideoUrl('');
        setActiveTab('list');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleDeleteMedia = async (id: number) => {
    if (!window.confirm('Delete this gallery asset permanently? This action is irreversible.')) return;
    try {
      const response = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert('Failed to remove dynamic media asset.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tab controls */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-lg shadow-sm text-xs font-semibold text-gray-500 uppercase tracking-wider font-ui overflow-x-auto">
        <button
          onClick={() => { setActiveTab('list'); setStatus('idle'); }}
          className={`flex items-center gap-1.5 px-6 py-4 border-b-2 transition whitespace-nowrap ${
            activeTab === 'list' ? 'border-[#D4870A] text-[#0A1F44] bg-[#0A1F44]/5 font-bold' : 'border-transparent hover:bg-gray-50'
          }`}
        >
          <ClipboardList size={15} /> Active Gallery Assets ({items.length})
        </button>
        <button
          onClick={() => { setActiveTab('add'); setStatus('idle'); }}
          className={`flex items-center gap-1.5 px-6 py-4 border-b-2 transition whitespace-nowrap ${
            activeTab === 'add' ? 'border-[#D4870A] text-[#0A1F44] bg-[#0A1F44]/5 font-bold' : 'border-transparent hover:bg-gray-50'
          }`}
        >
          <Plus size={15} className="text-[#1B5E3B]" /> Upload New Gallery Asset
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-gray-200 rounded-b-lg p-6 shadow-sm font-ui text-xs">
        
        {status === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded p-3.5 text-[#1B5E3B] flex items-center gap-2 font-sans font-semibold mb-4">
            <CheckCircle size={16} />
            <span>Dynamic media asset published and live successfully!</span>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded flex items-center gap-2 mb-4 font-sans font-semibold">
            <AlertCircle size={16} />
            <span>Operation failed. Please verify inputs or database permissions.</span>
          </div>
        )}

        {/* 1. UPLOAD NEW ASSET TAB */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddMedia} className="space-y-4 max-w-3xl">
            <h3 className="font-serif text-sm font-bold text-[#0A1F44] border-b border-gray-150 pb-2 mb-4 flex items-center gap-1.5">
              <Plus size={15} className="text-[#1B5E3B]" /> Dynamic Media Asset Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Album Name / Event Heading (Required)</label>
                <input
                  type="text"
                  placeholder="e.g. Preclinical Conservative Lab Setup..."
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                  required
                />
              </div>
              <div>
                <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Event Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition cursor-pointer font-bold"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Media Asset Type</label>
                <div className="flex gap-4 p-2 border border-gray-200 rounded bg-[#F8F9FA]">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                    <input
                      type="radio"
                      checked={isVideo === 0}
                      onChange={() => setIsVideo(0)}
                      className="cursor-pointer"
                    />
                    <ImageIcon size={14} className="text-blue-500" /> Photo Asset
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                    <input
                      type="radio"
                      checked={isVideo === 1}
                      onChange={() => setIsVideo(1)}
                      className="cursor-pointer"
                    />
                    <Video size={14} className="text-red-500" /> Video Tour link
                  </label>
                </div>
              </div>
              <div>
                <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">
                  {isVideo === 1 ? 'Backdrop Thumbnail Image URL (Required)' : 'Photograph Image URL (Required)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. /assets/images/gallery/campus_1.jpg..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition font-mono"
                  required
                />
              </div>
            </div>

            {isVideo === 1 && (
              <div className="animate-fade-in">
                <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">YouTube Video Link (Required for Videos)</label>
                <input
                  type="url"
                  placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition font-mono"
                  required
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  *Pro-tip: Key in standard YouTube watch URLs. The portal will automatically translate them into dynamic embedded streaming frames!
                </span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider transition shadow-sm flex items-center gap-1.5"
              >
                <Plus size={14} /> {status === 'loading' ? 'Publishing asset...' : 'Publish Media Asset'}
              </button>
            </div>
          </form>
        )}

        {/* 2. ACTIVE CATALOG INDEX TAB */}
        {activeTab === 'list' && (
          <div>
            {items.length === 0 ? (
              <div className="text-center py-10 text-gray-400 font-sans">No gallery assets have been uploaded.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 font-sans">
                {items.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow transition bg-gray-50/50">
                    <div className="relative aspect-video bg-gray-900 overflow-hidden">
                      <img 
                        src={item.image_url} 
                        alt={item.album_name} 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-[#0A1F44] text-white text-[8px] font-bold uppercase tracking-wider py-0.5 px-2 rounded z-10">
                        {item.category}
                      </span>
                      {item.is_video === 1 ? (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                          <div className="bg-red-600 p-2 rounded-full shadow">
                            <Play size={14} className="fill-current text-white translate-x-0.5" />
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/10"></div>
                      )}
                    </div>
                    
                    <div className="p-3.5 space-y-3.5 bg-white">
                      <h4 className="font-serif font-bold text-xs text-gray-700 leading-snug line-clamp-2 min-h-8" title={item.album_name}>
                        {item.album_name}
                      </h4>
                      
                      <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
                        <span className="text-[9px] font-bold font-ui text-[#1B5E3B] uppercase tracking-wide">
                          {item.is_video === 1 ? 'VIDEO TOUR' : 'PHOTO'}
                        </span>
                        
                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          className="text-red-500 hover:text-red-700 font-bold transition flex items-center gap-0.5 text-[10px]"
                          title="Delete permanently"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
