import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Generic helper to log audit trails
async function logAudit(db: any, username: string, action: string, section: string, details: string) {
  await db.run(
    'INSERT INTO audit_logs (timestamp, admin_username, action, section, details) VALUES (?, ?, ?, ?, ?)',
    [new Date().toISOString(), username, action, section, details]
  );
}

// 1. PATCH: Update operations
export async function PATCH(req: NextRequest, { params }: { params: { module: string[] } }) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized administrative access.' }, { status: 401 });
    }

    const mod = params.module[0];
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const db = await getDb();
    const body = await req.json();

    // Submissions module status update
    if (mod === 'submissions' && id) {
      const { status } = body;
      await db.run('UPDATE submissions SET status = ? WHERE id = ?', [status, id]);
      await logAudit(db, session.username, 'Update', 'Inbox Submissions', `Marked form ID #${id} as ${status}`);
      return NextResponse.json({ success: true });
    }

    // Site settings update
    if (mod === 'settings') {
      for (const [key, value] of Object.entries(body)) {
        await db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, String(value)]);
      }
      await logAudit(db, session.username, 'Update', 'Site Settings', 'Modified core site configurations.');
      return NextResponse.json({ success: true });
    }

    // Faculty sort order update
    if (mod === 'faculty' && id) {
      const { sort_order } = body;
      await db.run('UPDATE faculty SET sort_order = ? WHERE id = ?', [sort_order, id]);
      await logAudit(db, session.username, 'Update', 'Faculty Directory', `Updated sort order for faculty ID #${id}`);
      return NextResponse.json({ success: true });
    }

    // Hero Slides update
    if (mod === 'hero_slides' && id) {
      const { image_url, title, subtitle, cta_text, cta_link, sort_order, enabled } = body;
      await db.run(
        `UPDATE hero_slides SET 
          image_url = ?, title = ?, subtitle = ?, 
          cta_text = ?, cta_link = ?, sort_order = ?, enabled = ? 
        WHERE id = ?`,
        [image_url, title, subtitle || null, cta_text || null, cta_link || null, sort_order || 0, enabled, id]
      );
      await logAudit(db, session.username, 'Update', 'Homepage Sliders', `Modified hero banner slide: "${title}"`);
      return NextResponse.json({ success: true });
    }

    // Announcements/Notices update
    if (mod === 'announcements' && id) {
      const { title, link, category, is_new, enabled } = body;
      await db.run(
        `UPDATE announcements SET 
          title = ?, link = ?, category = ?, is_new = ?, enabled = ? 
        WHERE id = ?`,
        [title, link || null, category, is_new, enabled, id]
      );
      await logAudit(db, session.username, 'Update', 'Announcements & Notices', `Modified notice: "${title}"`);
      return NextResponse.json({ success: true });
    }

    // Quick Stats update
    if (mod === 'stats' && id) {
      const { label, value, icon, sort_order } = body;
      await db.run(
        `UPDATE stats SET 
          label = ?, value = ?, icon = ?, sort_order = ? 
        WHERE id = ?`,
        [label, value, icon || null, sort_order || 0, id]
      );
      await logAudit(db, session.username, 'Update', 'Quick Stats Counters', `Modified stats number: "${label}" -> ${value}`);
      return NextResponse.json({ success: true });
    }

    // Clinical Departments update
    if (mod === 'departments' && id) {
      const { 
        name, banner_image, about, 
        hod_name, hod_qualifications, hod_designation, hod_photo, 
        infrastructure, clinical_services, research_activities, 
        contact_email, contact_phone 
      } = body;
      await db.run(
        `UPDATE departments SET 
          name = ?, banner_image = ?, about = ?, 
          hod_name = ?, hod_qualifications = ?, hod_designation = ?, hod_photo = ?, 
          infrastructure = ?, clinical_services = ?, research_activities = ?, 
          contact_email = ?, contact_phone = ? 
        WHERE id = ?`,
        [
          name, banner_image || null, about || null, 
          hod_name || null, hod_qualifications || null, hod_designation || null, hod_photo || null, 
          infrastructure || null, clinical_services || null, research_activities || null, 
          contact_email || null, contact_phone || null, id
        ]
      );
      await logAudit(db, session.username, 'Update', 'Clinical Departments', `Modified specialty details for: "${name}"`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Module endpoint not supported.' }, { status: 450 });

  } catch (error) {
    console.error('CMS PATCH Error:', error);
    return NextResponse.json({ error: 'Failed to update content.' }, { status: 500 });
  }
}

// 2. DELETE: Deletion operations
export async function DELETE(req: NextRequest, { params }: { params: { module: string[] } }) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized administrative access.' }, { status: 401 });
    }

    const mod = params.module[0];
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Identifier parameter is required.' }, { status: 400 });
    }

    const db = await getDb();

    if (mod === 'submissions') {
      await db.run('DELETE FROM submissions WHERE id = ?', [id]);
      await logAudit(db, session.username, 'Delete', 'Inbox Submissions', `Deleted form submission ID #${id}`);
      return NextResponse.json({ success: true });
    }

    if (mod === 'tenders') {
      await db.run('DELETE FROM tenders WHERE id = ?', [id]);
      await logAudit(db, session.username, 'Delete', 'Tenders', `Deleted tender notice ID #${id}`);
      return NextResponse.json({ success: true });
    }

    if (mod === 'news') {
      await db.run('DELETE FROM news_events WHERE id = ?', [id]);
      await logAudit(db, session.username, 'Delete', 'News Events', `Deleted news/event post ID #${id}`);
      return NextResponse.json({ success: true });
    }

    if (mod === 'downloads') {
      await db.run('DELETE FROM downloads WHERE id = ?', [id]);
      await logAudit(db, session.username, 'Delete', 'Downloads', `Deleted file library ID #${id}`);
      return NextResponse.json({ success: true });
    }

    if (mod === 'faculty') {
      await db.run('DELETE FROM faculty WHERE id = ?', [id]);
      await logAudit(db, session.username, 'Delete', 'Faculty', `Removed faculty member ID #${id}`);
      return NextResponse.json({ success: true });
    }

    if (mod === 'hero_slides') {
      await db.run('DELETE FROM hero_slides WHERE id = ?', [id]);
      await logAudit(db, session.username, 'Delete', 'Homepage Sliders', `Removed hero slide ID #${id}`);
      return NextResponse.json({ success: true });
    }

    if (mod === 'announcements') {
      await db.run('DELETE FROM announcements WHERE id = ?', [id]);
      await logAudit(db, session.username, 'Delete', 'Announcements & Notices', `Removed notice/announcement ID #${id}`);
      return NextResponse.json({ success: true });
    }

    if (mod === 'stats') {
      await db.run('DELETE FROM stats WHERE id = ?', [id]);
      await logAudit(db, session.username, 'Delete', 'Quick Stats', `Removed stats counter ID #${id}`);
      return NextResponse.json({ success: true });
    }

    if (mod === 'gallery') {
      await db.run('DELETE FROM gallery WHERE id = ?', [id]);
      await logAudit(db, session.username, 'Delete', 'Gallery Manager', `Removed gallery media ID #${id}`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Module endpoint not supported.' }, { status: 450 });

  } catch (error) {
    console.error('CMS DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete content.' }, { status: 500 });
  }
}

// 3. POST: Additions operations
export async function POST(req: NextRequest, { params }: { params: { module: string[] } }) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized administrative access.' }, { status: 401 });
    }

    const mod = params.module[0];
    const db = await getDb();
    const body = await req.json();

    if (mod === 'tenders') {
      const { title, published_date, last_date, document_url } = body;
      const res = await db.run(
        'INSERT INTO tenders (title, published_date, last_date, document_url, status, is_new) VALUES (?, ?, ?, ?, "Active", 1)',
        [title, published_date, last_date, document_url || null]
      );
      await logAudit(db, session.username, 'Create', 'Tenders', `Added tender notice: "${title.slice(0, 30)}..."`);
      return NextResponse.json({ success: true, id: res.lastID });
    }

    if (mod === 'news') {
      const { title, content, date, time, venue, category, attachment_url } = body;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const res = await db.run(
        'INSERT INTO news_events (title, slug, content, date, time, venue, category, attachment_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "Published")',
        [title, slug, content, date, time || null, venue || null, category, attachment_url || null]
      );
      await logAudit(db, session.username, 'Create', 'News Events', `Published campus ${category}: "${title.slice(0, 30)}..."`);
      return NextResponse.json({ success: true, id: res.lastID });
    }

    if (mod === 'downloads') {
      const { title, category, file_url } = body;
      const res = await db.run(
        'INSERT INTO downloads (title, category, upload_date, file_url, enabled) VALUES (?, ?, ?, ?, 1)',
        [title, category, new Date().toISOString().split('T')[0], file_url]
      );
      await logAudit(db, session.username, 'Create', 'Downloads', `Uploaded library document: "${title.slice(0, 30)}..."`);
      return NextResponse.json({ success: true, id: res.lastID });
    }

    if (mod === 'faculty') {
      const { name, qualifications, designation, specialization, email, department_id, is_teaching } = body;
      const res = await db.run(
        `INSERT INTO faculty (
          name, qualifications, designation, specialization, email, department_id, is_teaching, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
        [name, qualifications, designation, specialization || null, email || null, department_id || null, is_teaching]
      );
      await logAudit(db, session.username, 'Create', 'Faculty', `Added roster profile: ${name}`);
      return NextResponse.json({ success: true, id: res.lastID });
    }

    if (mod === 'hero_slides') {
      const { image_url, title, subtitle, cta_text, cta_link, sort_order } = body;
      const res = await db.run(
        `INSERT INTO hero_slides (
          image_url, title, subtitle, cta_text, cta_link, sort_order, enabled
        ) VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [image_url, title, subtitle || null, cta_text || null, cta_link || null, sort_order || 0]
      );
      await logAudit(db, session.username, 'Create', 'Homepage Sliders', `Added hero slide: "${title}"`);
      return NextResponse.json({ success: true, id: res.lastID });
    }

    if (mod === 'announcements') {
      const { title, link, category, is_new } = body;
      const res = await db.run(
        `INSERT INTO announcements (
          title, link, category, date, is_new, enabled
        ) VALUES (?, ?, ?, ?, ?, 1)`,
        [title, link || null, category, new Date().toISOString().split('T')[0], is_new]
      );
      await logAudit(db, session.username, 'Create', 'Announcements & Notices', `Published notice: "${title}"`);
      return NextResponse.json({ success: true, id: res.lastID });
    }

    if (mod === 'stats') {
      const { label, value, icon, sort_order } = body;
      const res = await db.run(
        'INSERT INTO stats (label, value, icon, sort_order) VALUES (?, ?, ?, ?)',
        [label, value, icon || null, sort_order || 0]
      );
      await logAudit(db, session.username, 'Create', 'Quick Stats', `Created stats counter: "${label}" -> ${value}`);
      return NextResponse.json({ success: true, id: res.lastID });
    }

    if (mod === 'gallery') {
      const { album_name, category, image_url, is_video, video_url } = body;
      const res = await db.run(
        'INSERT INTO gallery (album_name, category, image_url, is_video, video_url) VALUES (?, ?, ?, ?, ?)',
        [album_name, category, image_url, is_video || 0, video_url || null]
      );
      await logAudit(db, session.username, 'Create', 'Gallery Manager', `Added dynamic media to album: "${album_name}"`);
      return NextResponse.json({ success: true, id: res.lastID });
    }

    return NextResponse.json({ error: 'Module endpoint not supported.' }, { status: 450 });

  } catch (error) {
    console.error('CMS POST Error:', error);
    return NextResponse.json({ error: 'Failed to create content.' }, { status: 500 });
  }
}
