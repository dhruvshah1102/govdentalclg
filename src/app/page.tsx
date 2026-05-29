import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { HeroSlider } from '@/components/HeroSlider';
import { StatsCounter } from '@/components/StatsCounter';
import { 
  Megaphone, Calendar, ArrowRight, FileText, CheckCircle, 
  ExternalLink, Stethoscope, HelpCircle, Shield, Award, Users, BookOpen
} from 'lucide-react';

export const revalidate = 0; // Fresh DB reads on every request

export default async function HomePage() {
  const db = await getDb();

  // 1. Fetch settings
  const settingsRows = await db.all('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  settingsRows.forEach((row) => {
    settings[row.key] = row.value;
  });

  // 2. Fetch slides
  const slides = await db.all('SELECT * FROM hero_slides WHERE enabled = 1 ORDER BY sort_order ASC');
  
  // Hardcoded high-fidelity fallback slides if none populated in admin
  const finalSlides = slides.length > 0 ? slides : [
    {
      id: 1,
      image_url: '/assets/placeholders/hero_1.jpg',
      title: 'Excellence in Dental Pedagogy & Tertiary Healthcare',
      subtitle: 'Recognized by the Dental Council of India (DCI) and providing clinical teaching for advanced oral surgeries and conservative dentistry.',
      cta_text: 'Explore Academics',
      cta_link: '/academics/bds'
    },
    {
      id: 2,
      image_url: '/assets/placeholders/hero_2.jpg',
      title: 'Advanced Diagnostic & Clinical Patient OPD Care',
      subtitle: 'Equipped with digital radiography, specialized cosmetic clinics, and trauma surgeries serving Upper Assam.',
      cta_text: 'OPD Schedule & Registration',
      cta_link: '/hospital'
    },
    {
      id: 3,
      image_url: '/assets/placeholders/hero_3.jpg',
      title: 'State of the Art Research & Outreach Programs',
      subtitle: 'Empowering communities through rural dental health programs, clinical diagnostic research, and collaborative studies.',
      cta_text: 'Active Tenders & News',
      cta_link: '/tenders'
    }
  ];

  // 3. Fetch marquee scrolling ticker notices
  const scrollingNotices = await db.all(
    "SELECT * FROM announcements WHERE category = 'Scrolling' AND enabled = 1 ORDER BY date DESC"
  );

  // 4. Fetch Stats
  const stats = await db.all('SELECT * FROM stats ORDER BY sort_order ASC');

  // 5. Fetch Departments
  const departments = await db.all('SELECT id, name, about, hod_name FROM departments LIMIT 9');

  // 6. Fetch Notice Board Items
  const noticeBoard = await db.all(
    "SELECT * FROM announcements WHERE category IN ('NoticeBoard', 'StudentNotice') AND enabled = 1 ORDER BY date DESC LIMIT 6"
  );

  // 7. Fetch News & Events
  const newsEvents = await db.all(
    "SELECT * FROM news_events WHERE status = 'Published' ORDER BY date DESC LIMIT 4"
  );

  const quickLinks = [
    { label: 'Admissions BDS/MDS', icon: BookOpen, link: '/admissions', color: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300' },
    { label: 'Patient Registration', icon: Stethoscope, link: '/hospital?tab=registration', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300' },
    { label: 'Tenders Center', icon: FileText, link: '/tenders', color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300' },
    { label: 'Anti-Ragging Help', icon: Shield, link: '/student-portal/anti-ragging', color: 'bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-300' },
    { label: 'Faculty Directory', icon: Users, link: '/faculty', color: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-300' },
    { label: 'RTI Information', icon: HelpCircle, link: '/about-us/rti', color: 'bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-300' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic Scrolling Announcements Ticker */}
      {scrollingNotices.length > 0 && (
        <div className="bg-[#D4870A] text-[#0A1F44] py-2 px-4 flex items-center relative overflow-hidden shadow-inner text-xs font-bold z-10 border-b border-[#0A1F44]/10">
          <div className="bg-[#0A1F44] text-white px-4 py-1.5 rounded uppercase tracking-wider text-[10px] flex items-center gap-1.5 z-20 shadow">
            <Megaphone size={12} className="animate-bounce text-[#D4870A]" /> URGENT জাননী
          </div>
          <div className="flex-1 overflow-hidden relative h-6 flex items-center pl-4">
            <div className="animate-ticker absolute left-0 top-0 bottom-0 flex items-center gap-12">
              {/* Duplicate items for a seamless gapless infinite marquee scroll */}
              {[...scrollingNotices, ...scrollingNotices].map((n, index) => (
                <Link 
                  key={`${n.id}-${index}`} 
                  href={n.link || '/news-events'} 
                  className="hover:underline text-[#0A1F44] hover:text-black transition flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <span>&bull; {n.title}</span>
                  {n.is_new === 1 && (
                    <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider animate-pulse-fast inline-block">NEW</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner Image Slider */}
      <HeroSlider slides={finalSlides} />

      {/* Quick Stats Bar */}
      <StatsCounter stats={stats} />

      {/* Main Grid Content Area: About Us & Dean's desk */}
      <section className="py-12 md:py-16 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Principal/Dean's welcome message - 1 Column */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <span className="text-[10px] bg-[#0A1F44]/5 text-[#0A1F44] font-bold uppercase tracking-widest px-3 py-1 rounded">Principal Desk</span>
            <h3 className="font-serif text-xl font-bold text-[#0A1F44] mt-3.5 mb-1.5">{settings.dean_name || 'Dean GDC Dibrugarh'}</h3>
            <p className="text-xs text-[#1B5E3B] font-bold uppercase tracking-wider font-ui mb-4">{settings.dean_designation || 'Principal & Dean'}</p>
            <div className="relative border-l-4 border-[#D4870A] pl-4 italic text-xs leading-relaxed text-[#2D2D2D]/90 my-4 font-serif">
              &ldquo;{settings.dean_message || 'Welcome to Government Dental College, Dibrugarh. We strive for excellence in dental education and compassionate tertiary oral healthcare.'}&rdquo;
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#0A1F44] to-[#1B5E3B] flex items-center justify-center text-white font-serif font-bold text-lg overflow-hidden border border-gray-200 shadow-sm">
              DEAN
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">AUTOGRAPH SIGNED</span>
              <Link href="/about-us/principal-message" className="text-xs text-[#0A1F44] hover:text-[#D4870A] font-bold hover:underline transition flex items-center gap-1 mt-0.5">
                Read Dean Message <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Short intro "About GDC" - 2 Columns */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm lg:col-span-2 flex flex-col justify-between hover:shadow-md transition">
          <div>
            <span className="text-[10px] bg-[#1B5E3B]/5 text-[#1B5E3B] font-bold uppercase tracking-widest px-3 py-1 rounded">Institutional Profile</span>
            <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[#0A1F44] mt-4 mb-4 tracking-tight leading-tight">
              A Beacon of Advanced Dental Science in Upper Assam
            </h2>
            <p className="text-xs md:text-sm text-[#2D2D2D] leading-relaxed mb-6 font-sans">
              {settings.about_summary_en || 'Government Dental College & Hospital, Dibrugarh is a leading dental health establishment of the Govt of Assam, affiliated to Dibrugarh University and recognized by the Dental Council of India.'}
            </p>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-sans mb-6">
              Located on the sprawling institutional campus near Assam Medical College (AMCH), the college educates BDS scholars in comprehensive, multidisciplinary clinical contexts. With 9 specialist departments running tertiary outpatient department (OPD) facilities, GDC Dibrugarh caters to thousands of patients month-on-month with utmost engineering precision.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
            <Link href="/about-us/college" className="bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold font-ui py-2.5 px-6 rounded uppercase tracking-wider transition shadow-sm">
              Read Our History
            </Link>
            <Link href="/about-us/disclosure" className="border-2 border-gray-300 hover:border-[#1B5E3B] text-gray-600 hover:text-[#1B5E3B] text-xs font-bold font-ui py-2 px-5 rounded uppercase tracking-wider transition">
              Mandatory DCI Fields
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="bg-gray-100/50 py-10 border-y border-gray-200 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl font-bold text-[#0A1F44] tracking-tight">Institutional Direct Portals</h3>
            <div className="h-1 w-12 bg-[#D4870A] mx-auto mt-2 rounded"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((ql, idx) => {
              const IconComp = ql.icon;
              return (
                <Link 
                  key={idx} 
                  href={ql.link}
                  className={`border p-5 rounded-lg flex flex-col items-center justify-center text-center gap-3 transition-all hover:-translate-y-1 hover:shadow bg-white ${ql.color}`}
                >
                  <IconComp size={24} />
                  <span className="font-ui font-semibold text-xs text-[#2D2D2D] leading-snug">{ql.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clinical Departments Section */}
      <section className="py-12 md:py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[10px] bg-[#1B5E3B]/5 text-[#1B5E3B] font-bold uppercase tracking-widest px-3 py-1 rounded">Our Specialties</span>
          <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[#0A1F44] mt-3.5 mb-2.5 tracking-tight">
            9 Specialised Dental Clinical Departments
          </h2>
          <p className="text-xs text-gray-500 max-w-lg mx-auto">
            From pediatric prophylaxis to facial reconstructions, our academic divisions support highly advanced clinical setups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((d) => (
            <div 
              key={d.id} 
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:border-[#D4870A] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="inline-block bg-[#0A1F44]/5 text-[#0A1F44] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full mb-3 tracking-wide">
                  Clinical Div
                </span>
                <h4 className="font-serif text-lg font-bold text-[#0A1F44] hover:text-[#D4870A] transition mb-2">
                  <Link href={`/departments/${d.id}`}>{d.name}</Link>
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-sans line-clamp-3 mb-4">
                  {d.about ? d.about.replace(/<[^>]*>/g, '') : 'Providing cutting-edge training and clinical patient care.'}
                </p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs text-gray-400">
                <span>HOD: <strong className="text-gray-600">{d.hod_name || 'Specialist Professor'}</strong></span>
                <Link href={`/departments/${d.id}`} className="text-[#1B5E3B] hover:text-[#247C4E] font-bold hover:underline flex items-center gap-0.5 transition">
                  Details &raquo;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notice Board, News & Academic Events widget section */}
      <section className="bg-gray-50 py-12 md:py-16 px-4 md:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Latest News & Announcements (2 Columns) */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
              <h3 className="font-serif text-xl md:text-2xl font-bold text-[#0A1F44] tracking-tight flex items-center gap-2">
                <Calendar size={20} className="text-[#D4870A]" /> Latest News & Campus Happenings
              </h3>
              <Link href="/news-events" className="text-xs text-[#1B5E3B] hover:text-[#247C4E] font-bold hover:underline transition flex items-center gap-0.5 uppercase">
                View All News &raquo;
              </Link>
            </div>

            {newsEvents.length === 0 ? (
              <div className="bg-white border border-gray-200 p-8 rounded-lg text-center text-gray-400 text-xs shadow-sm">
                No recent campus news has been published.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newsEvents.map((ne) => (
                  <div key={ne.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-[#1B5E3B] transition duration-300 flex flex-col justify-between">
                    <div>
                      {/* Placeholder background layout if no image */}
                      <div className="h-44 bg-gradient-to-tr from-[#0A1F44] to-[#1B5E3B]/80 relative flex items-center justify-center text-white">
                        <span className="absolute top-3 left-3 bg-[#D4870A] text-white text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 rounded shadow-sm">
                          {ne.category}
                        </span>
                        <BookOpen size={40} className="opacity-20 animate-pulse" />
                      </div>
                      <div className="p-5">
                        <span className="text-[10px] text-gray-400 font-semibold block mb-1 font-sans">{ne.date}</span>
                        <h4 className="font-serif font-bold text-base text-[#0A1F44] mb-2 line-clamp-2 hover:text-[#D4870A] transition">
                          <Link href={`/news-events#${ne.slug}`}>{ne.title}</Link>
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-sans line-clamp-3">
                          {ne.content ? ne.content.replace(/<[^>]*>/g, '') : ''}
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-2">
                      <Link href={`/news-events#${ne.slug}`} className="text-xs text-[#1B5E3B] hover:text-[#247C4E] font-bold hover:underline transition flex items-center gap-1">
                        Read Story <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 3: Notice Board Widget (1 Column) */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-2">
                <h3 className="font-serif text-lg font-bold text-[#0A1F44] flex items-center gap-1.5">
                  <Megaphone size={16} className="text-[#D4870A] animate-pulse" /> Notice Board
                </h3>
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping"></span>
              </div>

              {noticeBoard.length === 0 ? (
                <div className="text-center py-12 text-xs text-gray-400 font-sans">
                  No notifications are currently pinned.
                </div>
              ) : (
                <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1.5 custom-scrollbar">
                  {noticeBoard.map((n) => (
                    <div key={n.id} className="border-b border-gray-100 pb-3 last:border-b-0 hover:bg-gray-50/50 p-1.5 rounded transition">
                      <span className="text-[10px] text-gray-400 font-semibold block font-sans mb-0.5">{n.date}</span>
                      <Link 
                        href={n.link || '/downloads'} 
                        className="text-xs text-gray-700 hover:text-[#0A1F44] font-medium leading-relaxed block hover:underline"
                        target={n.link?.endsWith('.pdf') ? '_blank' : undefined}
                      >
                        {n.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-gray-100 text-gray-500 py-0.2 px-2 rounded-sm font-semibold tracking-wide capitalize">
                          {n.category === 'StudentNotice' ? 'Student notice' : 'Notice board'}
                        </span>
                        {n.is_new === 1 && (
                          <span className="bg-red-600 text-white text-[8px] px-1 py-0.2 rounded-sm font-bold uppercase tracking-wider animate-pulse-fast">NEW</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link href="/downloads" className="block text-center bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold font-ui py-2 rounded uppercase tracking-wider transition shadow-sm">
                View All Circulars
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Accreditation Seals Logos Grid */}
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-[10px] bg-gray-100 text-gray-400 font-bold uppercase tracking-widest px-3 py-1 rounded">Regulatory Certifications</span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-8 opacity-65 hover:opacity-100 transition duration-300">
            
            {/* Seal 1: DCI */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-full bg-[#0A1F44]/5 flex items-center justify-center text-xs font-bold border border-gray-200 hover:border-[#D4870A] transition">
                DCI
              </div>
              <span className="text-[10px] font-bold text-[#0A1F44] tracking-wider uppercase font-ui">Dental Council India</span>
            </div>

            {/* Seal 2: DU */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-full bg-[#1B5E3B]/5 flex items-center justify-center text-xs font-bold border border-gray-200 hover:border-[#1B5E3B] transition">
                DU
              </div>
              <span className="text-[10px] font-bold text-[#1B5E3B] tracking-wider uppercase font-ui">Dibrugarh University</span>
            </div>

            {/* Seal 3: NAAC */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-full bg-[#D4870A]/5 flex items-center justify-center text-xs font-bold border border-gray-200 hover:border-[#D4870A] transition">
                NAAC
              </div>
              <span className="text-[10px] font-bold text-[#D4870A] tracking-wider uppercase font-ui">Accreditation Council</span>
            </div>

            {/* Seal 4: Health Ministry */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold border border-gray-200 transition">
                ASSAM
              </div>
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase font-ui">Govt of Assam HFW</span>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
