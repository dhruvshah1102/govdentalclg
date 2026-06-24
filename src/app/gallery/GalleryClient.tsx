'use client';

import React, { useState } from 'react';
import { 
  Play, Eye, X, ChevronLeft, ChevronRight, 
  Layers, ExternalLink, Grid
} from 'lucide-react';

interface GalleryItem {
  id: number;
  album_name: string;
  category: string;
  image_url: string;
  is_video: number;
  video_url: string | null;
}


interface GalleryClientProps {
  initialItems: GalleryItem[];
}

export const GalleryClient: React.FC<GalleryClientProps> = ({ initialItems }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItemIdx, setActiveItemIdx] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const categories = ['All', 'Academic', 'Clinical', 'Infrastructure', 'Cultural', 'Events'];

  // Filter items
  const filteredItems = selectedCategory === 'All' 
    ? initialItems 
    : initialItems.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  // Dynamic Youtube converter
  const getEmbedUrl = (url: string | null) => {
    if (!url) return '';
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeItemIdx === null || filteredItems.length <= 1) return;
    setActiveItemIdx((prev) => (prev === 0 ? filteredItems.length - 1 : prev! - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeItemIdx === null || filteredItems.length <= 1) return;
    setActiveItemIdx((prev) => (prev === filteredItems.length - 1 ? 0 : prev! + 1));
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Category Selection Toolbar */}
      <div className="flex border-b border-gray-200 bg-white rounded-lg p-2.5 shadow-sm overflow-x-auto gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setActiveItemIdx(null);
            }}
            className={`flex items-center gap-1.5 px-6 py-2.5 rounded-md transition text-xs font-semibold font-ui uppercase tracking-wider whitespace-nowrap ${
              selectedCategory === cat 
                ? 'bg-[#0A1F44] text-white shadow-sm font-bold' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {cat === 'All' ? <Grid size={13} /> : <Layers size={13} />}
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of gallery media */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center text-gray-400 text-xs rounded-lg shadow-sm">
          No dynamic gallery files available under the "{selectedCategory}" category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div 
              key={item.id} 
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-900">
                {/* Image backdrop */}
                <img 
                  src={item.image_url} 
                  alt={item.album_name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Dark Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  {item.is_video === 1 ? (
                    <button
                      onClick={() => setVideoUrl(getEmbedUrl(item.video_url))}
                      className="bg-[#D4870A] hover:bg-[#EAA023] text-white p-3.5 rounded-full shadow-lg transition"
                      title="Play Virtual Tour Video"
                    >
                      <Play size={18} className="fill-current text-white translate-x-0.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveItemIdx(idx)}
                      className="bg-[#0A1F44] hover:bg-[#162E5B] text-white p-3.5 rounded-full shadow-lg transition"
                      title="View High Resolution Picture"
                    >
                      <Eye size={18} />
                    </button>
                  )}
                </div>

                {/* Badge Category */}
                <span className="absolute top-3 left-3 bg-[#0A1F44] text-white text-[9px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded shadow-sm z-10">
                  {item.category}
                </span>

                {/* Video Indicator label */}
                {item.is_video === 1 && (
                  <span className="absolute bottom-3 right-3 bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded shadow-sm flex items-center gap-1">
                    <Play size={8} className="fill-current" /> VIDEO TOUR
                  </span>
                )}
              </div>

              {/* Media Title Details */}
              <div className="p-4 border-t border-gray-100">
                <h4 className="font-serif font-bold text-xs text-gray-700 leading-snug line-clamp-2 min-h-8">
                  {item.album_name}
                </h4>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50 text-[10px] text-gray-400">
                  <span className="capitalize font-semibold text-[#1B5E3B]">Album / Event</span>
                  {item.is_video === 1 ? (
                    <button 
                      onClick={() => setVideoUrl(getEmbedUrl(item.video_url))}
                      className="text-[#D4870A] hover:underline flex items-center gap-0.5 transition font-bold"
                    >
                      Watch <ExternalLink size={10} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setActiveItemIdx(idx)}
                      className="text-[#0A1F44] hover:underline flex items-center gap-0.5 transition font-bold"
                    >
                      Expand <Eye size={10} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX SLIDER MODAL OVERLAY */}
      {activeItemIdx !== null && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between items-center py-6 px-4 font-sans select-none"
          onClick={() => setActiveItemIdx(null)}
        >
          {/* Top Bar controls */}
          <div className="w-full max-w-6xl flex justify-between items-center text-white z-50">
            <span className="text-[10px] bg-white/10 uppercase tracking-widest px-3 py-1 rounded font-ui font-semibold">
              Photo {activeItemIdx + 1} of {filteredItems.length}
            </span>
            <button 
              onClick={() => setActiveItemIdx(null)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Central image viewer */}
          <div className="w-full max-w-5xl flex items-center justify-between relative flex-grow my-4">
            
            {/* Left navigation */}
            {filteredItems.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition absolute left-2 md:left-4 z-50 shadow-md hover:scale-105"
                title="Previous Image"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Main Picture */}
            <div className="mx-auto max-h-[70vh] flex justify-center items-center overflow-hidden max-w-[85vw]">
              <img 
                src={filteredItems[activeItemIdx].image_url} 
                alt={filteredItems[activeItemIdx].album_name}
                className="max-h-[70vh] max-w-full object-contain rounded shadow-2xl animate-fade-in pointer-events-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Right navigation */}
            {filteredItems.length > 1 && (
              <button
                onClick={handleNextImage}
                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition absolute right-2 md:right-4 z-50 shadow-md hover:scale-105"
                title="Next Image"
              >
                <ChevronRight size={24} />
              </button>
            )}

          </div>

          {/* Bottom Captions panel */}
          <div className="w-full max-w-4xl text-center text-white px-6 py-4 bg-white/5 border border-white/5 rounded-lg z-50 shadow-lg">
            <span className="text-[9px] bg-[#D4870A] text-white py-0.5 px-2.5 rounded font-bold uppercase font-ui tracking-wider mb-2 inline-block">
              {filteredItems[activeItemIdx].category}
            </span>
            <h3 className="font-serif font-bold text-sm md:text-base leading-snug">
              {filteredItems[activeItemIdx].album_name}
            </h3>
          </div>

        </div>
      )}

      {/* DYNAMIC VIDEO PLAYER OVERLAY MODAL */}
      {videoUrl && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setVideoUrl(null)}
        >
          <div className="bg-gray-900 border border-white/10 p-2.5 rounded-lg w-full max-w-4xl aspect-video relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setVideoUrl(null)}
              className="absolute -top-12 right-0 p-2 text-white bg-white/10 hover:bg-white/20 rounded-full transition flex items-center gap-1 text-[10px] font-bold font-ui uppercase tracking-wider"
            >
              Close Portal <X size={14} />
            </button>
            <iframe 
              src={videoUrl}
              className="w-full h-full rounded"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
};
