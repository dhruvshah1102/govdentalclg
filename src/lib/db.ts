import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool(): Pool {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  return pool;
}

// Converts SQLite-style "?" placeholders to Postgres "$1, $2, ..." placeholders
function toPgSql(sql: string): string {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

interface DbLike {
  all: <T = any>(sql: string, params?: any[]) => Promise<T[]>;
  get: <T = any>(sql: string, params?: any[]) => Promise<T | undefined>;
  run: (sql: string, params?: any[]) => Promise<{ lastID?: number; changes: number }>;
  exec: (sql: string) => Promise<void>;
}

function createDb(): DbLike {
  return {
    all: async (sql: string, params: any[] = []) => {
      const res = await getPool().query(toPgSql(sql), params);
      return res.rows;
    },
    get: async (sql: string, params: any[] = []) => {
      const res = await getPool().query(toPgSql(sql), params);
      return res.rows[0];
    },
    run: async (sql: string, params: any[] = []) => {
      let pgSql = toPgSql(sql);
      let hasReturning = /returning/i.test(pgSql);
      const insertsIntoSettings = /^\s*insert\s+into\s+settings\b/i.test(pgSql);
      if (/^\s*insert/i.test(pgSql) && !hasReturning && !insertsIntoSettings) {
        pgSql += ' RETURNING id';
        hasReturning = true;
      }
      const res = await getPool().query(pgSql, params);
      return {
        lastID: hasReturning && res.rows[0] ? res.rows[0].id : undefined,
        changes: res.rowCount ?? 0
      };
    },
    exec: async (sql: string) => {
      await getPool().query(sql);
    }
  };
}

let dbInstance: DbLike | null = null;
let initialized = false;

export async function getDb(): Promise<DbLike> {
  if (!dbInstance) {
    dbInstance = createDb();
  }
  if (!initialized) {
    initialized = true;
    await initTables(dbInstance);
  }
  return dbInstance as any;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await getDb();
  return db.all<T>(sql, params);
}

export async function execute(sql: string, params: any[] = []): Promise<any> {
  const db = await getDb();
  return db.run(sql, params);
}

async function initTables(db: DbLike) {
  // Settings Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // 3. Hero Slides Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS hero_slides (
      id SERIAL PRIMARY KEY,
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
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      link TEXT,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      is_new INTEGER DEFAULT 1,
      enabled INTEGER DEFAULT 1
    )
  `);

  // 5. Stats Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS stats (
      id SERIAL PRIMARY KEY,
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
      id SERIAL PRIMARY KEY,
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
      is_teaching INTEGER DEFAULT 1,
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
    )
  `);

  // 8. News & Events Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS news_events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT,
      venue TEXT,
      category TEXT NOT NULL,
      image_url TEXT,
      attachment_url TEXT,
      is_featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'Published'
    )
  `);

  // 9. Tenders Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tenders (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      published_date TEXT NOT NULL,
      last_date TEXT NOT NULL,
      document_url TEXT,
      status TEXT DEFAULT 'Active',
      is_new INTEGER DEFAULT 1
    )
  `);

  // 10. Downloads Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS downloads (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      upload_date TEXT NOT NULL,
      file_url TEXT NOT NULL,
      enabled INTEGER DEFAULT 1
    )
  `);

  // 11. Submissions Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      subject TEXT,
      message TEXT,
      form_data TEXT,
      submitted_at TEXT NOT NULL,
      status TEXT DEFAULT 'New'
    )
  `);

  // 12. Gallery Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS gallery (
      id SERIAL PRIMARY KEY,
      album_name TEXT NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT NOT NULL,
      is_video INTEGER DEFAULT 0,
      video_url TEXT
    )
  `);

  // 13. Audit Logs Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      timestamp TEXT NOT NULL,
      admin_username TEXT NOT NULL,
      action TEXT NOT NULL,
      section TEXT NOT NULL,
      details TEXT
    )
  `);
}
