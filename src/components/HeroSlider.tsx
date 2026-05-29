'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, GraduationCap, Award, ShieldAlert } from 'lucide-react';

export interface Slide {
  id: number;
  image_url: string;
  title: string;
  subtitle?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
}

interface HeroSliderProps {
  slides: Slide[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  if (!slides || slides.length === 0) {
    // Elegant high-fidelity SVG/Gradient fallback banner
    return (
      <div className="relative h-[480px] w-full bg-gradient-to-r from-[#0A1F44] via-[#162E5B] to-[#1B5E3B] flex items-center justify-center text-center p-8">
        <div className="max-w-3xl text-white">
          <GraduationCap size={48} className="mx-auto text-[#D4870A] mb-4 animate-bounce" />
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Government Dental College & Hospital
          </h2>
          <p className="text-sm md:text-lg text-gray-200 font-sans max-w-xl mx-auto mb-6">
            Pioneering excellence in professional dental medicine and compassionate public tertiary healthcare services in Upper Assam.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/admissions" className="bg-[#D4870A] hover:bg-[#EAA023] text-white px-6 py-2.5 rounded font-ui text-xs font-semibold uppercase tracking-wider transition">
              Explore Admissions
            </Link>
            <Link href="/hospital" className="bg-transparent border-2 border-white hover:bg-white hover:text-[#0A1F44] text-white px-6 py-2.5 rounded font-ui text-xs font-semibold uppercase tracking-wider transition">
              Patient OPD Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[320px] md:h-[480px] w-full overflow-hidden bg-gray-900 shadow-md">
      {/* Slides mapping */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Backdrop Image or Color fallbacks */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 scale-105"
            style={{ 
              backgroundImage: slide.image_url.startsWith('http') || slide.image_url.startsWith('/') 
                ? `url(${slide.image_url})` 
                : undefined,
              backgroundColor: index % 2 === 0 ? '#0B234D' : '#14462B'
            }}
          >
            {/* If no image path provided, render high fidelity background SVG shapes */}
            {(!slide.image_url || slide.image_url.includes('placeholders')) && (
              <svg className="absolute inset-0 w-full h-full opacity-10" fill="currentColor">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <circle cx="20%" cy="40%" r="20%" fill="none" stroke="white" strokeWidth="2" />
                <circle cx="80%" cy="60%" r="30%" fill="none" stroke="white" strokeWidth="4" />
              </svg>
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-[#0A1F44]/75"></div>
          </div>

          {/* Text details */}
          <div className="absolute inset-0 flex items-center px-6 md:px-16 xl:px-24">
            <div className="max-w-2xl text-white">
              <span className="inline-block bg-[#D4870A] text-white text-[10px] md:text-xs font-bold tracking-widest uppercase py-1 px-3 rounded mb-3 md:mb-4 animate-pulse">
                ACADEMICS & HEALTHCARE
              </span>
              <h2 className="font-serif text-2xl md:text-4xl xl:text-5xl font-extrabold leading-tight mb-2.5 md:mb-4 tracking-tight drop-shadow-md">
                {slide.title}
              </h2>
              <p className="text-xs md:text-base text-gray-200 font-sans mb-5 md:mb-7 leading-relaxed max-w-xl">
                {slide.subtitle}
              </p>
              <div className="flex gap-3 md:gap-4 flex-wrap">
                {slide.cta_text && (
                  <Link href={slide.cta_link || '#'} className="bg-[#D4870A] hover:bg-[#EAA023] text-white text-[10px] md:text-xs font-bold py-2.5 md:py-3 px-5 md:px-6 rounded uppercase tracking-wider transition shadow">
                    {slide.cta_text}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Manual Slide Controls */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={handlePrev} 
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-[#D4870A] text-white rounded-full transition z-20"
            title="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={handleNext} 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-[#D4870A] text-white rounded-full transition z-20"
            title="Next Slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicators dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2.5 rounded-full transition-all ${i === current ? 'w-6 bg-[#D4870A]' : 'w-2.5 bg-white/40 hover:bg-white/80'}`}
                title={`Go to slide ${i + 1}`}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
