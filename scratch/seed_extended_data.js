const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function main() {
  const db = await open({
    filename: path.join(__dirname, '..', 'db', 'govclg.sqlite'),
    driver: sqlite3.Database
  });

  console.log("Seeding extended data...");

  // 1. Hero Slides
  await db.run("DELETE FROM hero_slides");
  const slides = [
    {
      image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&h=500&q=80',
      title: 'Pioneering Dental Pedagogy & Clinical Excellence',
      subtitle: 'Equipping next-generation dental surgeons with state-of-the-art preclinical laboratories and expert mentors.',
      cta_text: 'Explore BDS Programme',
      cta_link: '/academics/bds',
      sort_order: 1
    },
    {
      image_url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&w=1200&h=500&q=80',
      title: 'State-of-the-Art Tertiary Dental Hospital',
      subtitle: 'Serving over 150 patients daily with subsidized restorative, operative, and reconstructive surgeries.',
      cta_text: 'View OPD Timings',
      cta_link: '/hospital',
      sort_order: 2
    },
    {
      image_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&h=500&q=80',
      title: 'Ethically Vetted Research Frontiers',
      subtitle: 'Conducting clinical diagnostics trials, fluoride surveys, and academic publications of global repute.',
      cta_text: 'Research Overview',
      cta_link: '/research',
      sort_order: 3
    }
  ];
  for (const s of slides) {
    await db.run(
      'INSERT INTO hero_slides (image_url, title, subtitle, cta_text, cta_link, sort_order, enabled) VALUES (?, ?, ?, ?, ?, ?, 1)',
      [s.image_url, s.title, s.subtitle, s.cta_text, s.cta_link, s.sort_order]
    );
  }
  console.log("Seeded 3 Hero Slides.");

  // 2. Faculty
  await db.run("DELETE FROM faculty");
  const faculty = [
    { name: 'Dr. Ramesh Chandra Das', qualifications: 'MDS (Prosthodontics)', designation: 'Principal & Dean', specialization: 'Implantology & Crown-Bridge', email: 'dean.gdc@gdcdibrugarh.edu.in', department_id: 'prosthodontics', sort_order: 1, is_teaching: 1 },
    { name: 'Dr. Pranab Jyoti Baruah', qualifications: 'MDS (Oral & Maxillofacial Surgery)', designation: 'Associate Professor & HOD', specialization: 'Trauma & Cleft Reconstructions', email: 'dept.omfs@gdcdibrugarh.edu.in', department_id: 'omfs', sort_order: 2, is_teaching: 1 },
    { name: 'Dr. Ananya Sarma', qualifications: 'MDS (Oral Medicine & Radiology), PhD', designation: 'Professor & HOD', specialization: 'CBCT Imaging & Oral Diagnostics', email: 'dept.omr@gdcdibrugarh.edu.in', department_id: 'omr', sort_order: 3, is_teaching: 1 },
    { name: 'Dr. Swapna Dutta', qualifications: 'MDS (Oral Pathology)', designation: 'Professor & HOD', specialization: 'Oral Cancer Screening', email: 'dept.ompath@gdcdibrugarh.edu.in', department_id: 'ompath', sort_order: 4, is_teaching: 1 },
    { name: 'Dr. Ranjit Konwar', qualifications: 'MDS (Periodontics)', designation: 'Associate Professor', specialization: 'Laser Periodontal Surgery', email: 'dept.perio@gdcdibrugarh.edu.in', department_id: 'perio', sort_order: 5, is_teaching: 1 }
  ];
  for (const f of faculty) {
    await db.run(
      'INSERT INTO faculty (name, photo_url, qualifications, designation, specialization, email, publications, cv_url, department_id, sort_order, is_teaching) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [f.name, null, f.qualifications, f.designation, f.specialization, f.email, 'Published over 10 national and international papers.', null, f.department_id, f.sort_order, f.is_teaching]
    );
  }
  console.log("Seeded 5 Faculty members.");

  // 3. News & Events
  await db.run("DELETE FROM news_events");
  const news = [
    {
      title: 'National Oral Health & Hygiene Workshop 2026',
      slug: 'national-oral-health-workshop-2026',
      content: 'GDC Dibrugarh successfully hosted the National Oral Health Workshop. The event saw participation from dental specialists across North-East India focusing on modern community outreach techniques, pediatric prophylaxis, and tea garden fluoride mapping.',
      date: '2026-06-15',
      time: '10:00 AM',
      venue: 'College Main Auditorium',
      category: 'Event',
      image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      is_featured: 1
    },
    {
      title: 'Advanced CBCT Dental Imaging Wing Inaugurated',
      slug: 'cbct-imaging-wing-inaugurated',
      content: 'The Department of Oral Medicine & Radiology has officially inaugurated its new 3D Cone Beam Computed Tomography (CBCT) imaging suite. This facility will provide premium diagnostic accuracy for implant placements, root canal anatomies, and maxillofacial fractures at highly subsidized rates.',
      date: '2026-06-05',
      time: '11:30 AM',
      venue: 'OPD Building Ground Floor',
      category: 'News',
      image_url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&w=800&q=80',
      is_featured: 0
    },
    {
      title: 'BDS Annual Term Exam Registration Dates Announced',
      slug: 'bds-annual-term-exam-dates-2026',
      content: 'Affiliating University (Dibrugarh University) has announced exam registration schedules for the BDS professional exams. Online forms can be submitted from June 12 onwards. Students must clear library dues before obtaining admit cards.',
      date: '2026-06-08',
      time: '09:00 AM',
      venue: 'Academic Office Board',
      category: 'Announcement',
      image_url: null,
      is_featured: 0
    }
  ];
  for (const n of news) {
    await db.run(
      'INSERT INTO news_events (title, slug, content, date, time, venue, category, image_url, attachment_url, is_featured, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, null, ?, "Published")',
      [n.title, n.slug, n.content, n.date, n.time, n.venue, n.category, n.image_url, n.is_featured]
    );
  }
  console.log("Seeded 3 News articles.");

  // 4. Tenders
  await db.run("DELETE FROM tenders");
  const tenders = [
    {
      title: 'Tender for Supply of Preclinical Phantoms and Operational Dental Chairs',
      published_date: '2026-06-01',
      last_date: '2026-06-30',
      document_url: '#'
    },
    {
      title: 'Procurement of High-End Clinical Operating Microscopes for Endodontic Wing',
      published_date: '2026-06-04',
      last_date: '2026-06-25',
      document_url: '#'
    }
  ];
  for (const t of tenders) {
    await db.run(
      'INSERT INTO tenders (title, published_date, last_date, document_url, status, is_new) VALUES (?, ?, ?, ?, "Active", 1)',
      [t.title, t.published_date, t.last_date, t.document_url]
    );
  }
  console.log("Seeded 2 Tenders.");

  // 5. Gallery
  await db.run("DELETE FROM gallery");
  const gallery = [
    { album_name: 'Smart Preclinical Lab', category: 'Academic', image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&h=400&q=80', is_video: 0 },
    { album_name: 'OPD Clinical Theater', category: 'Clinical', image_url: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=600&h=400&q=80', is_video: 0 },
    { album_name: 'Academic College Campus', category: 'Infrastructure', image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&h=400&q=80', is_video: 0 },
    { album_name: 'College Cultural Festival', category: 'Cultural', image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&h=400&q=80', is_video: 0 }
  ];
  for (const g of gallery) {
    await db.run(
      'INSERT INTO gallery (album_name, category, image_url, is_video, video_url) VALUES (?, ?, ?, ?, null)',
      [g.album_name, g.category, g.image_url, g.is_video]
    );
  }
  console.log("Seeded 4 Gallery items.");
}

main().catch(console.error);
