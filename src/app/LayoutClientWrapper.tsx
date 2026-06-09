'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UIProvider, useUI } from '@/context/UIContext';
import { 
  Phone, Mail, Accessibility, Sun, Moon, Search, 
  Menu, X, ChevronDown, ArrowUp, MessageCircle, HelpCircle,
  FileText, Calendar, Shield, Users, Layers
} from 'lucide-react';

// Custom sharp SVG for Indian National Emblem
const NationalEmblemSVG = () => (
  <svg viewBox="0 0 100 150" className="h-14 w-auto drop-shadow-sm" fill="currentColor">
    <path d="M50,15 C45,15 42,18 42,22 C42,28 48,32 50,38 C52,32 58,28 58,22 C58,18 55,15 50,15 Z" fill="#D4870A" />
    <rect x="44" y="38" width="12" height="15" rx="2" fill="#1B5E3B" />
    <circle cx="50" cy="45" r="4" fill="#0A1F44" />
    <path d="M30,53 L70,53 L65,75 L35,75 Z" fill="#D4870A" />
    <path d="M38,75 L62,75 L60,110 L40,110 Z" fill="#0A1F44" />
    <circle cx="50" cy="92" r="8" fill="#D4870A" />
    <rect x="42" y="110" width="16" height="12" fill="#1B5E3B" />
    <text x="50" y="135" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#2D2D2D">सत्यमेव जयते</text>
  </svg>
);

// Custom sharp SVG for Assam Government crest
const AssamGovSVG = () => (
  <svg viewBox="0 0 120 120" className="h-12 w-auto" fill="currentColor">
    <circle cx="60" cy="60" r="50" fill="none" stroke="#1B5E3B" strokeWidth="4" />
    <circle cx="60" cy="60" r="44" fill="none" stroke="#D4870A" strokeWidth="2" strokeDasharray="4 2" />
    <path d="M40,55 Q60,35 80,55 Q60,75 40,55 Z" fill="#D4870A" />
    <circle cx="60" cy="55" r="8" fill="#0A1F44" />
    <text x="60" y="85" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#0A1F44">ASSAM</text>
    <text x="60" y="98" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#1B5E3B">GOVT OF ASSAM</text>
  </svg>
);

// Institutional Crest SVG
const CollegeCrestSVG = () => (
  <svg viewBox="0 0 100 100" className="h-14 w-auto" fill="none" stroke="currentColor">
    <path d="M50,5 L90,25 L90,65 Q50,95 10,65 L10,25 Z" fill="#0A1F44" stroke="#D4870A" strokeWidth="2" />
    <path d="M50,15 L78,31 L78,60 Q50,83 22,60 L22,31 Z" fill="#1B5E3B" />
    <circle cx="50" cy="45" r="14" fill="#F8F9FA" stroke="#D4870A" strokeWidth="2" />
    {/* Dental Tooth drawing */}
    <path d="M45,40 Q50,35 55,40 Q58,45 54,50 Q50,53 50,55 Q50,53 46,50 Q42,45 45,40 Z" fill="#0A1F44" />
    <path d="M47,51 L44,57 Q43,60 45,61 Q47,60 48,55 Z" fill="#0A1F44" />
    <path d="M53,51 L56,57 Q57,60 55,61 Q53,60 52,55 Z" fill="#0A1F44" />
    <text x="50" y="75" fontSize="8" fontWeight="bold" fill="#F8F9FA" textAnchor="middle">GDCH</text>
    <text x="50" y="81" fontSize="5" fill="#D4870A" textAnchor="middle">DIBRUGARH</text>
  </svg>
);

const NavbarContent = () => {
  const { t, language, setLanguage, fontScale, setFontScale, isHighContrast, toggleHighContrast } = useUI();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  // Close menus on page navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveSubmenu(null);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleSubmenu = (menu: string) => {
    if (activeSubmenu === menu) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(menu);
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

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-[#0A1F44] text-white border-b border-white/10 text-xs py-2 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
          <span className="flex items-center gap-1">
            <Phone size={12} className="text-[#D4870A]" />
            {t('emergency_helpline')}: <strong>+91 373 2300999</strong>
          </span>
          <span className="h-3 w-px bg-white/20 hidden md:block"></span>
          <span className="flex items-center gap-1">
            <Phone size={12} className="text-[#1B5E3B]" />
            {t('tele_consultation')}: <strong>+91 373 2300888</strong>
          </span>
          <span className="h-3 w-px bg-white/20 hidden md:block"></span>
          <span className="flex items-center gap-1">
            <Mail size={12} className="text-[#D4870A]" />
            gdchdibrugarh@gmail.com
          </span>
        </div>
        
        {/* Accessibility & Language Bar */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {/* External Links */}
          <div className="flex items-center gap-3 mr-2 border-r border-white/20 pr-4">
            <Link href="/tenders" className="hover:text-[#D4870A] transition">{t('tenders')}</Link>
            <Link href="/downloads" className="hover:text-[#D4870A] transition">{t('downloads')}</Link>
            <Link href="/contact-us?tab=grievance" className="hover:text-[#D4870A] transition">{t('grievance')}</Link>
          </div>

          {/* Accessibility Controls */}
          <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded mr-1">
            <button 
              onClick={() => setFontScale('sm')} 
              title="Decrease Font" 
              className={`px-1.5 py-0.5 text-[10px] rounded font-bold hover:bg-white/20 ${fontScale === 'sm' ? 'bg-[#D4870A] text-white' : ''}`}
            >
              A-
            </button>
            <button 
              onClick={() => setFontScale('base')} 
              title="Default Font" 
              className={`px-1.5 py-0.5 text-xs rounded font-bold hover:bg-white/20 ${fontScale === 'base' ? 'bg-[#D4870A] text-white' : ''}`}
            >
              A
            </button>
            <button 
              onClick={() => setFontScale('lg')} 
              title="Increase Font" 
              className={`px-1.5 py-0.5 text-xs rounded font-bold hover:bg-white/20 ${fontScale === 'lg' ? 'bg-[#D4870A] text-white' : ''}`}
            >
              A+
            </button>
          </div>


          {/* Language Switcher */}
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider">
            <button 
              onClick={() => setLanguage('en')} 
              className={`px-2 py-0.5 rounded transition ${language === 'en' ? 'bg-[#D4870A] text-white' : 'hover:bg-white/10'}`}
            >
              English
            </button>
            <button 
              onClick={() => setLanguage('as')} 
              className={`px-2 py-0.5 rounded transition ${language === 'as' ? 'bg-[#1B5E3B] text-white' : 'hover:bg-white/10'}`}
            >
              অসমীয়া
            </button>
            <button 
              onClick={() => setLanguage('hi')} 
              className={`px-2 py-0.5 rounded transition ${language === 'hi' ? 'bg-[#D4870A] text-white' : 'hover:bg-white/10'}`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <header className="bg-white text-[#2D2D2D] py-4 px-4 md:px-8 border-b border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logos & Crest */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <CollegeCrestSVG />
            <div>
              <h1 className="font-serif text-lg md:text-xl xl:text-2xl font-bold text-[#0A1F44] tracking-tight leading-tight">
                {language === 'en' && 'Government Dental College & Hospital, Dibrugarh'}
                {language === 'as' && 'চৰকাৰী দন্ত চিকিৎসা মহাবিদ্যালয় আৰু চিকিৎসালয়, ডিব্ৰুগড়'}
                {language === 'hi' && 'सरकारी दंत चिकित्सा महाविद्यालय और अस्पताल, डिब्रूगढ़'}
              </h1>
              <p className="text-xs text-[#1B5E3B] font-bold font-ui uppercase mt-0.5 tracking-wider flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-[#D4870A]"></span>
                {t('govt_assam')} &bull; {t('dci_rec')}
              </p>
              <p className="text-[10px] text-gray-500 italic mt-0.5 font-sans leading-none">{t('aff_rec')}</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 ml-6 border-l border-gray-200 pl-6">
            <NationalEmblemSVG />
            <AssamGovSVG />
          </div>
        </div>

        {/* Header Search Field */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72 xl:w-80">
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none py-2.5 pl-4 pr-10 rounded-full transition"
          />
          <button type="submit" className="absolute right-3.5 top-2.5 text-gray-400 hover:text-[#0A1F44] transition">
            <Search size={16} />
          </button>
        </form>
      </header>

      {/* Institutional Desktop Mega-Menu Navigation Bar */}
      <nav className="bg-[#0A1F44] text-white shadow-md sticky top-0 z-40 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center text-xs font-semibold uppercase tracking-wider font-ui">
            <Link href="/" className="px-4 py-4 hover:bg-[#1B5E3B] hover:text-white transition flex items-center gap-1.5">
              {t('home')}
            </Link>

            {/* About Us Dropdown */}
            <div className="relative group mega-menu-trigger">
              <button className="px-4 py-4 hover:bg-[#1B5E3B] hover:text-white transition flex items-center gap-1">
                {t('about_us')} <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 w-64 bg-white text-[#2D2D2D] border-t-2 border-[#D4870A] shadow-xl py-2 rounded-b-md mega-menu-content z-50">
                <Link href="/about-us/college" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('about_college')}</Link>
                <Link href="/about-us/hospital" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('about_hospital')}</Link>
                <Link href="/about-us/principal-message" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('dean_msg')}</Link>
                <Link href="/about-us/governing-body" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('governing_body')}</Link>
                <Link href="/about-us/administration" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('administration')}</Link>
                <Link href="/about-us/disclosure" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('disclosure')}</Link>
                <Link href="/about-us/rti" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('rti')}</Link>
              </div>
            </div>

            {/* Academics Dropdown */}
            <div className="relative group mega-menu-trigger">
              <button className="px-4 py-4 hover:bg-[#1B5E3B] hover:text-white transition flex items-center gap-1">
                {t('academics')} <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 w-64 bg-white text-[#2D2D2D] border-t-2 border-[#D4870A] shadow-xl py-2 rounded-b-md mega-menu-content z-50">
                <Link href="/academics/bds" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('bds_prog')}</Link>
                <Link href="/academics/mds" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('mds_prog')}</Link>
                <Link href="/academics/calendar" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('calendar')}</Link>
                <Link href="/academics/timetable" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('timetable')}</Link>
                <Link href="/academics/scholarships" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('scholarships')}</Link>
              </div>
            </div>

            {/* Departments Dropdown */}
            <div className="relative group mega-menu-trigger">
              <button className="px-4 py-4 hover:bg-[#1B5E3B] hover:text-white transition flex items-center gap-1">
                {t('departments')} <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 w-[450px] bg-white text-[#2D2D2D] border-t-2 border-[#D4870A] shadow-xl p-4 rounded-b-md mega-menu-content grid grid-cols-2 gap-x-4 gap-y-1.5 z-50 text-[11px]">
                {departmentsList.map((d) => (
                  <Link key={d.id} href={`/departments/${d.id}`} className="block px-2.5 py-1.5 hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition rounded font-medium">
                    &bull; {d.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Faculty & Staff */}
            <Link href="/faculty" className="px-4 py-4 hover:bg-[#1B5E3B] hover:text-white transition flex items-center">
              {t('faculty_staff')}
            </Link>

            {/* Hospital & Patient Services */}
            <div className="relative group mega-menu-trigger">
              <button className="px-4 py-4 hover:bg-[#1B5E3B] hover:text-white transition flex items-center gap-1">
                {t('hospital_services')} <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 w-64 bg-white text-[#2D2D2D] border-t-2 border-[#D4870A] shadow-xl py-2 rounded-b-md mega-menu-content z-50">
                <Link href="/hospital" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('opd_services')}</Link>
                <Link href="/hospital?tab=clinics" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('specialty_clinics')}</Link>
                <Link href="/hospital?tab=registration" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('patient_registration')}</Link>
                <Link href="/hospital?tab=charges" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">{t('fee_list')}</Link>
              </div>
            </div>

            {/* Admissions */}
            <Link href="/admissions" className="px-4 py-4 hover:bg-[#1B5E3B] hover:text-white transition flex items-center">
              {t('admissions')}
            </Link>

            {/* Research */}
            <Link href="/research" className="px-4 py-4 hover:bg-[#1B5E3B] hover:text-white transition flex items-center">
              {t('research')}
            </Link>

            {/* Student Portal */}
            <div className="relative group mega-menu-trigger">
              <button className="px-4 py-4 hover:bg-[#1B5E3B] hover:text-white transition flex items-center gap-1">
                {t('student_portal')} <ChevronDown size={14} />
              </button>
              <div className="absolute top-full right-0 w-64 bg-white text-[#2D2D2D] border-t-2 border-[#D4870A] shadow-xl py-2 rounded-b-md mega-menu-content z-50">
                <Link href="/student-portal/notices" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">Notice Board</Link>
                <Link href="/student-portal/anti-ragging" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">Anti-Ragging Committee</Link>
                <Link href="/student-portal/student-council" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">Student Council</Link>
                <Link href="/student-portal/grievance" className="block px-5 py-2 text-xs hover:bg-[#F8F9FA] hover:text-[#0A1F44] transition">Grievance Portal</Link>
              </div>
            </div>

            {/* News & Events */}
            <Link href="/news-events" className="px-4 py-4 hover:bg-[#1B5E3B] hover:text-white transition flex items-center">
              {t('news_events')}
            </Link>

            {/* Gallery */}
            <Link href="/gallery" className="px-4 py-4 hover:bg-[#1B5E3B] hover:text-white transition flex items-center">
              {t('gallery')}
            </Link>

            {/* Alumni */}
            <Link href="/alumni" className="px-4 py-4 hover:bg-[#1B5E3B] hover:text-white transition flex items-center">
              {t('alumni')}
            </Link>
          </div>

          <Link href="/contact-us" className="bg-[#D4870A] hover:bg-[#EAA023] text-xs font-semibold py-2 px-4 rounded text-white flex items-center gap-1.5 uppercase transition shadow-sm font-ui my-1">
            {t('contact_us')}
          </Link>
        </div>
      </nav>

      {/* Mobile Responsive Header Bar */}
      <div className="bg-[#0A1F44] text-white py-3 px-4 flex justify-between items-center lg:hidden sticky top-0 z-40">
        <Link href="/" className="font-serif text-sm font-bold flex items-center gap-1.5">
          <span>GDC DIBRUGARH</span>
        </Link>
        
        <div className="flex items-center gap-2">
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-1.5 rounded hover:bg-white/10 transition"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#0A1F44] text-white z-50 overflow-y-auto pt-16 px-6 font-ui">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
            <span className="font-serif font-bold text-lg">Main Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col gap-4 text-sm font-medium uppercase tracking-wider">
            <Link href="/" className="py-2 border-b border-white/5 hover:text-[#D4870A]">{t('home')}</Link>
            
            {/* About us mobile */}
            <div>
              <button onClick={() => toggleSubmenu('about')} className="w-full flex justify-between items-center py-2 border-b border-white/5 hover:text-[#D4870A]">
                {t('about_us')} <ChevronDown size={16} />
              </button>
              {activeSubmenu === 'about' && (
                <div className="pl-4 py-2 flex flex-col gap-2.5 text-xs text-gray-300 normal-case bg-white/5 rounded my-1">
                  <Link href="/about-us/college" className="py-1 hover:text-white">{t('about_college')}</Link>
                  <Link href="/about-us/hospital" className="py-1 hover:text-white">{t('about_hospital')}</Link>
                  <Link href="/about-us/principal-message" className="py-1 hover:text-white">{t('dean_msg')}</Link>
                  <Link href="/about-us/governing-body" className="py-1 hover:text-white">{t('governing_body')}</Link>
                  <Link href="/about-us/administration" className="py-1 hover:text-white">{t('administration')}</Link>
                  <Link href="/about-us/disclosure" className="py-1 hover:text-white">{t('disclosure')}</Link>
                  <Link href="/about-us/rti" className="py-1 hover:text-white">{t('rti')}</Link>
                </div>
              )}
            </div>

            {/* Academics mobile */}
            <div>
              <button onClick={() => toggleSubmenu('academics')} className="w-full flex justify-between items-center py-2 border-b border-white/5 hover:text-[#D4870A]">
                {t('academics')} <ChevronDown size={16} />
              </button>
              {activeSubmenu === 'academics' && (
                <div className="pl-4 py-2 flex flex-col gap-2.5 text-xs text-gray-300 normal-case bg-white/5 rounded my-1">
                  <Link href="/academics/bds" className="py-1 hover:text-white">{t('bds_prog')}</Link>
                  <Link href="/academics/mds" className="py-1 hover:text-white">{t('mds_prog')}</Link>
                  <Link href="/academics/calendar" className="py-1 hover:text-white">{t('calendar')}</Link>
                  <Link href="/academics/timetable" className="py-1 hover:text-white">{t('timetable')}</Link>
                  <Link href="/academics/scholarships" className="py-1 hover:text-white">{t('scholarships')}</Link>
                </div>
              )}
            </div>

            {/* Departments mobile */}
            <div>
              <button onClick={() => toggleSubmenu('depts')} className="w-full flex justify-between items-center py-2 border-b border-white/5 hover:text-[#D4870A]">
                {t('departments')} <ChevronDown size={16} />
              </button>
              {activeSubmenu === 'depts' && (
                <div className="pl-4 py-2 flex flex-col gap-2.5 text-xs text-gray-300 normal-case bg-white/5 rounded my-1">
                  {departmentsList.map((d) => (
                    <Link key={d.id} href={`/departments/${d.id}`} className="py-1 hover:text-white">
                      {d.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/faculty" className="py-2 border-b border-white/5 hover:text-[#D4870A]">{t('faculty_staff')}</Link>
            <Link href="/hospital" className="py-2 border-b border-white/5 hover:text-[#D4870A]">{t('hospital_services')}</Link>
            <Link href="/admissions" className="py-2 border-b border-white/5 hover:text-[#D4870A]">{t('admissions')}</Link>
            <Link href="/research" className="py-2 border-b border-white/5 hover:text-[#D4870A]">{t('research')}</Link>
            
            {/* Student portal mobile */}
            <div>
              <button onClick={() => toggleSubmenu('students')} className="w-full flex justify-between items-center py-2 border-b border-white/5 hover:text-[#D4870A]">
                {t('student_portal')} <ChevronDown size={16} />
              </button>
              {activeSubmenu === 'students' && (
                <div className="pl-4 py-2 flex flex-col gap-2.5 text-xs text-gray-300 normal-case bg-white/5 rounded my-1">
                  <Link href="/student-portal/notices" className="py-1 hover:text-white">Notice Board</Link>
                  <Link href="/student-portal/anti-ragging" className="py-1 hover:text-white">Anti-Ragging Committee</Link>
                  <Link href="/student-portal/student-council" className="py-1 hover:text-white">Student Council</Link>
                  <Link href="/student-portal/grievance" className="py-1 hover:text-white">Grievance Portal</Link>
                </div>
              )}
            </div>

            <Link href="/news-events" className="py-2 border-b border-white/5 hover:text-[#D4870A]">{t('news_events')}</Link>
            <Link href="/gallery" className="py-2 border-b border-white/5 hover:text-[#D4870A]">{t('gallery')}</Link>
            <Link href="/alumni" className="py-2 border-b border-white/5 hover:text-[#D4870A]">{t('alumni')}</Link>
            <Link href="/contact-us" className="py-2 border-b border-white/5 hover:text-[#D4870A]">{t('contact_us')}</Link>
          </div>
        </div>
      )}
    </>
  );
};

export const LayoutClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const pathname = usePathname();

  // Hide header/footer on admin routes
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAdmin) {
    return <UIProvider>{children}</UIProvider>;
  }

  return (
    <UIProvider>
      <div className="flex flex-col min-h-screen">
        <NavbarContent />
        
        {/* Main Content Area */}
        <main className="flex-grow">{children}</main>

        {/* Premium Institutional Footer */}
        <footer className="bg-[#0A1F44] text-white pt-12 pb-6 border-t-4 border-[#D4870A] font-sans">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-sm">
            {/* Column 1: Info & Logos */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CollegeCrestSVG />
                <div>
                  <h3 className="font-serif font-bold text-base leading-tight tracking-wide text-white">GDC & Hospital</h3>
                  <span className="text-xs text-[#D4870A] font-bold uppercase tracking-wider">Dibrugarh, Assam</span>
                </div>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed mb-4">
                A leading government institution in North-East India dedicated to offering quality dental education, dental operative specialities, and state-of-the-art public clinical treatment.
              </p>
              <div className="flex items-center gap-2">
                <NationalEmblemSVG />
                <AssamGovSVG />
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-serif text-lg font-bold border-b border-[#D4870A] pb-2 mb-4 tracking-wide text-white">Important Links</h3>
              <ul className="space-y-2 text-xs text-gray-300 font-medium">
                <li><Link href="/about-us/disclosure" className="hover:text-[#D4870A] hover:underline transition">&raquo; DCI Mandatory Disclosure</Link></li>
                <li><Link href="/about-us/rti" className="hover:text-[#D4870A] hover:underline transition">&raquo; Right to Information (RTI)</Link></li>
                <li><Link href="/tenders" className="hover:text-[#D4870A] hover:underline transition">&raquo; Tenders & Procurements</Link></li>
                <li><Link href="/downloads" className="hover:text-[#D4870A] hover:underline transition">&raquo; Circulars & Forms Library</Link></li>
                <li><Link href="/student-portal/anti-ragging" className="hover:text-[#D4870A] hover:underline transition">&raquo; Anti-Ragging Policy & Committee</Link></li>
                <li><Link href="/contact-us?tab=grievance" className="hover:text-[#D4870A] hover:underline transition">&raquo; Grievance Redressal Portal</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact details */}
            <div>
              <h3 className="font-serif text-lg font-bold border-b border-[#D4870A] pb-2 mb-4 tracking-wide text-white">Contact Info</h3>
              <ul className="space-y-3.5 text-xs text-gray-300">
                <li className="leading-relaxed">
                  <strong className="text-white block mb-0.5">Address:</strong>
                  Near Assam Medical College Campus,<br />
                  Dibrugarh, Assam - 786002, India.
                </li>
                <li>
                  <strong className="text-white block mb-0.5">Helpline Contacts:</strong>
                  OPD Desk: +91 373 2300123<br />
                  Emergency: +91 373 2300999
                </li>
                <li>
                  <strong className="text-white block mb-0.5">Email Support:</strong>
                  gdchdibrugarh@gmail.com
                </li>
              </ul>
            </div>

            {/* Column 4: Interactive Map embed */}
            <div>
              <h3 className="font-serif text-lg font-bold border-b border-[#D4870A] pb-2 mb-4 tracking-wide text-white">Locate Us</h3>
              <div className="rounded overflow-hidden border border-white/10 h-36 relative bg-gray-900 shadow-inner">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.5103445582313!2d94.89679237617173!3d27.48443917631165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374097e3f8905bbf%3A0xc48de1786c57f0eb!2sAssam%20Medical%20College!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy"
                  title="GDC Dibrugarh Map"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Lower Footer */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <div className="text-center md:text-left leading-relaxed">
              <p>Copyright &copy; 2026 Government Dental College & Hospital, Dibrugarh. All Rights Reserved.</p>
              <p className="mt-0.5 text-[10px] text-gray-500 font-sans">Developed in compliance with WCAG 2.1 AA and National Emblem utilization standards.</p>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Link href="/website-policy" className="hover:text-white transition">Website Policy</Link>
              <span className="h-3 w-px bg-white/10"></span>
              <Link href="/disclaimer" className="hover:text-white transition">Disclaimer</Link>
              <span className="h-3 w-px bg-white/10"></span>
              <Link href="/admin/login" className="text-[#D4870A] hover:underline font-bold transition">Admin Portal Access</Link>
            </div>
          </div>
        </footer>

        {/* Back to Top Floating Button */}
        {showScrollTop && (
          <button 
            onClick={scrollToTop} 
            title="Back to Top"
            className="fixed bottom-6 right-6 p-3 bg-[#D4870A] hover:bg-[#EAA023] text-white rounded-full shadow-lg hover:scale-105 transition-all z-40 animate-bounce"
          >
            <ArrowUp size={18} />
          </button>
        )}

        {/* Floating WhatsApp Helper Button */}
        <a 
          href="https://wa.me/913732300123" 
          target="_blank" 
          rel="noopener noreferrer" 
          title="WhatsApp Helpline"
          className="fixed bottom-6 left-6 p-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-lg hover:scale-105 transition-all z-40 flex items-center justify-center"
        >
          <MessageCircle size={20} fill="currentColor" />
        </a>
      </div>
    </UIProvider>
  );
};
