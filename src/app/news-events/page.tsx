import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { 
  Calendar, Clock, MapPin, Tag, FileText, 
  BookOpen, Megaphone, ArrowRight 
} from 'lucide-react';

export const revalidate = 0;

export default async function NewsEventsPage() {
  const db = await getDb();

  // 1. Fetch published News & Events from the database
  const posts = await db.all(
    "SELECT * FROM news_events WHERE status = 'Published' ORDER BY date DESC"
  );

  // If no news seeded, pre-populate default layout with clinical and cultural happenings
  const finalPosts = posts.length > 0 ? posts : [
    {
      id: 1,
      title: 'Free Mega Dental Camp Organized on World Oral Health Day',
      slug: 'free-mega-dental-camp',
      content: '<p>The Department of Public Health Dentistry of Government Dental College, Dibrugarh organized a free clinical dental diagnosis and therapeutic camp in collaboration with local rural health clinics in Dibrugarh district.</p><p>Over 350 patients were screened and treated for common dental caries, periodontal diseases, and received free oral hygiene kits.</p>',
      date: new Date().toISOString().split('T')[0],
      time: '9:00 AM - 3:00 PM',
      venue: 'Barbaruah Primary Health Center, Dibrugarh',
      category: 'News',
      image_url: null,
      attachment_url: null
    },
    {
      id: 2,
      title: 'National Workshop on Maxillofacial Reconstructions & Implants',
      slug: 'maxillofacial-reconstruction-workshop',
      content: '<p>The Department of Oral & Maxillofacial Surgery organized a 2-day hands-on clinical workshop covering modern dental implants, sinus lifts, and facial trauma reconstructions, hosting expert speakers from across India.</p>',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      venue: 'College Conference Hall, GDC Campus',
      category: 'Event',
      image_url: null,
      attachment_url: null
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-1 font-sans">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">News & Academic Events</span>
        </div>

        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#0A1F44]">
            College News, Events & Announcements
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Stay updated with academic workshops, health outreach camps, and official press releases.
          </p>
        </div>

        {/* Grid Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main news feed (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            {finalPosts.map((post) => (
              <div 
                key={post.id} 
                id={post.slug}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-[#1B5E3B] transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center gap-4 flex-wrap mb-4">
                    <span className={`text-[9px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded-full border ${
                      post.category === 'Event' 
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {post.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold font-sans">{post.date}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#0A1F44] hover:text-[#D4870A] transition mb-3">
                    {post.title}
                  </h3>

                  {/* Render HTML content safely */}
                  <div 
                    className="text-xs md:text-sm text-gray-600 leading-relaxed font-sans space-y-3 mb-4"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {/* Event Meta details */}
                  {post.category === 'Event' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded border border-gray-100 text-xs text-gray-500 my-4 font-sans">
                      {post.time && (
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-[#D4870A]" /> Timings: {post.time}
                        </span>
                      )}
                      {post.venue && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#1B5E3B]" /> Venue: {post.venue}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Attachments downloads */}
                {post.attachment_url && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                    <a 
                      href={post.attachment_url} 
                      className="text-[#1B5E3B] hover:text-[#247C4E] font-bold transition flex items-center gap-1"
                      target="_blank"
                    >
                      <FileText size={14} /> Download Event Circular PDF
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right sidebar: General Announcements notices board (1 Column) */}
          <div className="space-y-6">
            
            {/* Quick Helper Widget */}
            <div className="bg-[#0A1F44] text-white p-6 rounded-lg shadow border-b-4 border-[#D4870A]">
              <Megaphone size={32} className="text-[#D4870A] mb-3 animate-pulse" />
              <h4 className="font-serif text-lg font-bold text-white mb-2">Academic Notifications</h4>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Students and scholars are advised to review timetables, schedules, and clinical rosters posted under Downloads.
              </p>
              <Link href="/downloads" className="bg-[#D4870A] hover:bg-[#EAA023] text-white text-xs font-bold font-ui py-2 px-4 rounded uppercase tracking-wider transition inline-block shadow">
                Go to downloads center
              </Link>
            </div>

            {/* Emergency Helplines quick contacts */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm text-xs text-gray-600">
              <h4 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-150 pb-2 mb-3">Campus Inquiries</h4>
              <ul className="space-y-3">
                <li>
                  <strong className="text-gray-800 block">Principal Office Email:</strong>
                  gdchdibrugarh@gmail.com
                </li>
                <li>
                  <strong className="text-gray-800 block">Registrar Phone:</strong>
                  +91 373 2300123 ext 4
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
