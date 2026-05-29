import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import bcrypt from 'bcryptjs';

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = path.join(process.cwd(), 'db', 'govclg.sqlite');
  
  // Ensure the directory exists
  const fs = require('fs');
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Enable foreign keys
  await dbInstance.run('PRAGMA foreign_keys = ON');

  // Initialize tables
  await initTables(dbInstance);

  return dbInstance;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await getDb();
  return db.all<T[]>(sql, params);
}

export async function execute(sql: string, params: any[] = []): Promise<any> {
  const db = await getDb();
  return db.run(sql, params);
}

async function initTables(db: Database) {
  // 1. Users Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  // 2. Settings Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // 3. Hero Slides Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS hero_slides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      cta_text TEXT,
      cta_link TEXT,
      sort_order INTEGER DEFAULT 0,
      enabled INTEGER DEFAULT 1
    )
  `);

  // 4. Announcements / Notices Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      link TEXT,
      category TEXT NOT NULL, -- 'Scrolling', 'StudentNotice', 'NoticeBoard'
      date TEXT NOT NULL,
      is_new INTEGER DEFAULT 1,
      enabled INTEGER DEFAULT 1
    )
  `);

  // 5. Stats Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      icon TEXT,
      sort_order INTEGER DEFAULT 0
    )
  `);

  // 6. Departments Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      banner_image TEXT,
      about TEXT,
      hod_name TEXT,
      hod_qualifications TEXT,
      hod_designation TEXT,
      hod_photo TEXT,
      infrastructure TEXT,
      clinical_services TEXT,
      research_activities TEXT,
      contact_email TEXT,
      contact_phone TEXT
    )
  `);

  // 7. Faculty & Staff Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS faculty (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      photo_url TEXT,
      qualifications TEXT,
      designation TEXT,
      specialization TEXT,
      email TEXT,
      publications TEXT,
      cv_url TEXT,
      department_id TEXT,
      sort_order INTEGER DEFAULT 0,
      is_teaching INTEGER DEFAULT 1, -- 1 for teaching, 0 for administrative
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
    )
  `);

  // 8. News & Events Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS news_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT,
      venue TEXT,
      category TEXT NOT NULL, -- 'News', 'Event', 'Announcement'
      image_url TEXT,
      attachment_url TEXT,
      is_featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'Published' -- 'Draft', 'Published'
    )
  `);

  // 9. Tenders Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tenders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      published_date TEXT NOT NULL,
      last_date TEXT NOT NULL,
      document_url TEXT,
      status TEXT DEFAULT 'Active', -- 'Active', 'Archived'
      is_new INTEGER DEFAULT 1
    )
  `);

  // 10. Downloads Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL, -- 'Forms', 'Prospectus', 'Schedules', 'Circulars'
      upload_date TEXT NOT NULL,
      file_url TEXT NOT NULL,
      enabled INTEGER DEFAULT 1
    )
  `);

  // 11. Submissions Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL, -- 'Contact', 'Appointment', 'Grievance', 'Alumni'
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      subject TEXT,
      message TEXT,
      form_data TEXT, -- JSON string for extra fields
      submitted_at TEXT NOT NULL,
      status TEXT DEFAULT 'New' -- 'New', 'Read', 'Resolved'
    )
  `);

  // 12. Gallery Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      album_name TEXT NOT NULL,
      category TEXT NOT NULL, -- 'Academic', 'Clinical', 'Infrastructure', 'Cultural', 'Events'
      image_url TEXT NOT NULL,
      is_video INTEGER DEFAULT 0,
      video_url TEXT
    )
  `);

  // 13. Audit Logs Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      admin_username TEXT NOT NULL,
      action TEXT NOT NULL,
      section TEXT NOT NULL,
      details TEXT
    )
  `);

  // --- SEED SEED DATA ---

  // Seed Default Admin User
  const adminExists = await db.get('SELECT id FROM users WHERE username = ?', ['admin']);
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run(
      'INSERT INTO users (username, password, role, created_at) VALUES (?, ?, ?, ?)',
      ['admin', hashedPassword, 'Super Admin', new Date().toISOString()]
    );
  }

  // Seed Default Settings
  const settingsCount = await db.get('SELECT COUNT(*) as count FROM settings');
  if (settingsCount && (settingsCount as any).count === 0) {
    const defaultSettings = {
      site_name_en: 'Government Dental College & Hospital, Dibrugarh',
      site_name_as: 'চৰকাৰী দন্ত চিকিৎসা মহাবিদ্যালয় আৰু চিকিৎসালয়, ডিব্ৰুগড়',
      site_name_hi: 'सरकारी दंत चिकित्सा महाविद्यालय और अस्पताल, डिब्रूगढ़',
      tagline_en: 'Affiliated with Dibrugarh University & Recognized by Dental Council of India',
      address: 'Near AMCH Campus, Dibrugarh, Assam - 786002',
      phone: '+91 373 2300123',
      email: 'gdchdibrugarh@gmail.com',
      helpline_emergency: '+91 373 2300999',
      helpline_tele: '+91 373 2300888',
      social_facebook: 'https://facebook.com/gdchd',
      social_twitter: 'https://twitter.com/gdchd',
      social_instagram: 'https://instagram.com/gdchd',
      social_youtube: 'https://youtube.com/gdchd',
      seo_title: 'Government Dental College & Hospital, Dibrugarh - Assam',
      seo_description: 'Official portal of Government Dental College and Hospital, Dibrugarh. Premium dental education and tertiary healthcare in Assam.',
      seo_keywords: 'Dental college Dibrugarh, GDC Dibrugarh, BDS Assam, MDS Assam, Dentist Dibrugarh, Dental council India',
      about_summary_en: 'Government Dental College & Hospital, Dibrugarh is a premier government institution dedicated to quality dental education, advanced patient care, and community outreach in Upper Assam.',
      dean_name: 'Dr. Ramesh Chandra Das, MDS',
      dean_designation: 'Principal & Dean',
      dean_message: 'Welcome to GDC Dibrugarh. Since our inception, we have strived to build a powerhouse of academic excellence and top-tier patient care. Our state-of-the-art clinics, dedicated faculty, and vibrant student body are the pillars of our prestige.',
      dean_photo: '/assets/placeholders/dean.jpg',
      superintendent_name: 'Dr. Pranab Jyoti Baruah, MDS',
      superintendent_message: 'Our hospital wing offers comprehensive clinical diagnostics and treatments spanning all major specialities. We serve hundreds of patients daily with empathy and technical excellence.',
      superintendent_photo: '/assets/placeholders/superintendent.jpg',
      google_map_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.5103445582313!2d94.89679237617173!3d27.48443917631165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374097e3f8905bbf%3A0xc48de1786c57f0eb!2sAssam%20Medical%20College!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      new_badge_days: '7'
    };

    for (const [key, value] of Object.entries(defaultSettings)) {
      await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', [key, value]);
    }
  }

  // Seed 9 Departments
  const deptCount = await db.get('SELECT COUNT(*) as count FROM departments');
  if (deptCount && (deptCount as any).count === 0) {
    const defaultDepts = [
      {
        id: 'omr',
        name: 'Oral Medicine & Radiology',
        hod: 'Dr. Ananya Sarma, MDS',
        qual: 'MDS (Oral Medicine & Radiology), PhD',
        desc: 'Specializing in oral diagnostics, advanced imaging (CBCT, digital radiography), and non-surgical management of head and neck conditions.'
      },
      {
        id: 'omfs',
        name: 'Oral and Maxillofacial Surgery',
        hod: 'Dr. Bikramjit Phukan, MDS',
        qual: 'MDS (Oral & Maxillofacial Surgery), FIOOMS',
        desc: 'Expert trauma, orthognathic, reconstructive surgery, cleft lip/palate repairs, and specialized minor surgical interventions.'
      },
      {
        id: 'ompath',
        name: 'Oral and Maxillofacial Pathology & Oral Microbiology',
        hod: 'Dr. Swapna Dutta, MDS',
        qual: 'MDS (Oral Pathology)',
        desc: 'Advanced diagnostics in histopathology, cytology, and microbial research covering systemic oral lesions.'
      },
      {
        id: 'perio',
        name: 'Periodontology',
        hod: 'Dr. Ranjit Konwar, MDS',
        qual: 'MDS (Periodontics), Laser Specialist',
        desc: 'Dedicated to gingival health, scaling, root planing, laser-guided periodontal surgeries, and advanced implantology.'
      },
      {
        id: 'community',
        name: 'Community Dentistry',
        hod: 'Dr. Deepjyoti Gogoi, MDS',
        qual: 'MDS (Public Health Dentistry)',
        desc: 'Pioneering rural outreach, dental health camps, fluoride programs, and public health awareness across Dibrugarh district.'
      },
      {
        id: 'conservative',
        name: 'Conservative Dentistry & Endodontics',
        hod: 'Dr. Himadri Borah, MDS',
        qual: 'MDS (Conservative Dentistry & Endodontics)',
        desc: 'Focusing on micro-endodontics, root canal therapy, aesthetic dental restorations, and veneers.'
      },
      {
        id: 'pediatric',
        name: 'Pediatric & Preventive Dentistry',
        hod: 'Dr. Moushumi Sen, MDS',
        qual: 'MDS (Pediatric Dentistry)',
        desc: 'Creating child-friendly clinical settings, sealants, childhood dental care, and behavior management.'
      },
      {
        id: 'orthodontics',
        name: 'Orthodontics & Dentofacial Orthopedics',
        hod: 'Dr. Saurav Kakoti, MDS',
        qual: 'MDS (Orthodontics)',
        desc: 'Delivering dental alignment services, clear aligners, dynamic braces, and dentofacial growth modulation.'
      },
      {
        id: 'prosthodontics',
        name: 'Prosthodontics & Crown & Bridge',
        hod: 'Dr. Parag Saikia, MDS',
        qual: 'MDS (Prosthodontics)',
        desc: 'Focusing on complete/partial dentures, crown restoration, bridges, and advanced full-mouth implant rehabilitations.'
      }
    ];

    for (const d of defaultDepts) {
      await db.run(
        `INSERT INTO departments (
          id, name, banner_image, about, 
          hod_name, hod_qualifications, hod_designation, hod_photo, 
          infrastructure, clinical_services, research_activities, contact_email, contact_phone
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          d.id,
          d.name,
          `/assets/placeholders/depts/${d.id}_banner.jpg`,
          `Welcome to the Department of ${d.name}. We are dedicated to providing state-of-the-art dental clinical care alongside high-quality training and education for both undergraduate and postgraduate scholars. ${d.desc}`,
          d.hod,
          d.qual,
          'Professor & Head of Department',
          `/assets/placeholders/faculty/${d.id}_hod.jpg`,
          'Our department is equipped with modern dental chairs, digital radiography, specialized clinics, and dedicated student laboratories.',
          'Specialist consultation, therapeutic clinical services, minor surgical therapies, and follow-ups.',
          'Active clinical trials, molecular research publications, and department-level thesis presentations.',
          `dept.${d.id}@gdcdibrugarh.edu.in`,
          '+91 373 2300123 ext ' + Math.floor(Math.random() * 900 + 100)
        ]
      );
    }
  }

  // Seed Stats
  const statsCount = await db.get('SELECT COUNT(*) as count FROM stats');
  if (statsCount && (statsCount as any).count === 0) {
    const defaultStats = [
      { label: 'Established', value: '2018', icon: 'Calendar', sort_order: 1 },
      { label: 'BDS Annual Seats', value: '50', icon: 'GraduationCap', sort_order: 2 },
      { label: 'MDS Annual Seats', value: '18', icon: 'Award', sort_order: 3 },
      { label: 'Specialist Departments', value: '9', icon: 'Layers', sort_order: 4 },
      { label: 'Annual Hospital OPD', value: '45,000+', icon: 'Activity', sort_order: 5 },
      { label: 'Years of Excellence', value: '8', icon: 'Star', sort_order: 6 }
    ];

    for (const s of defaultStats) {
      await db.run('INSERT INTO stats (label, value, icon, sort_order) VALUES (?, ?, ?, ?)', [
        s.label,
        s.value,
        s.icon,
        s.sort_order
      ]);
    }
  }

  // Seed Announcements / Notices
  const noticesCount = await db.get('SELECT COUNT(*) as count FROM announcements');
  if (noticesCount && (noticesCount as any).count === 0) {
    const dateToday = new Date().toISOString().split('T')[0];
    const defaultNotices = [
      { title: 'Admissions Open for BDS Programme 2026-27 - Apply via State Counselling', link: '/admissions', category: 'NoticeBoard', date: dateToday, is_new: 1 },
      { title: 'Academic Calendar for BDS Term Session 2026-2027 released', link: '/downloads', category: 'StudentNotice', date: dateToday, is_new: 1 },
      { title: 'Tender Notice: Procurement of High-End Dental Operative Microscopes', link: '/tenders', category: 'NoticeBoard', date: dateToday, is_new: 1 },
      { title: 'Anti-Ragging Committee Notification & Safe Helpline numbers', link: '/student-portal/anti-ragging', category: 'Scrolling', date: dateToday, is_new: 1 },
      { title: 'Free Mega Dental Camp organized in Dibrugarh Rural Centers on World Oral Health Day', link: '/news-events', category: 'Scrolling', date: dateToday, is_new: 0 }
    ];

    for (const n of defaultNotices) {
      await db.run('INSERT INTO announcements (title, link, category, date, is_new, enabled) VALUES (?, ?, ?, ?, ?, 1)', [
        n.title,
        n.link,
        n.category,
        n.date,
        n.is_new
      ]);
    }
  }
}
