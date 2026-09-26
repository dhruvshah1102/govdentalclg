import { NextResponse } from 'next/server';
import { getSession, getSupabaseServerClient } from '@/lib/auth';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const session = await getSession();
    const supabase = getSupabaseServerClient();

    if (session) {
      const db = await getDb();
      await db.run(
        'INSERT INTO audit_logs (timestamp, admin_username, action, section, details) VALUES (?, ?, ?, ?, ?)',
        [new Date().toISOString(), session.username, 'Logout', 'Authentication', 'Admin logged out.']
      );
    }

    await supabase.auth.signOut();

    return NextResponse.json({ success: true, message: 'Logged out.' });

  } catch (error) {
    console.error('Logout API Error:', error);
    return NextResponse.json({ error: 'An error occurred during logout.' }, { status: 500 });
  }
}
