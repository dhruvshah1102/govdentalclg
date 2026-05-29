import { NextRequest, NextResponse } from 'next/server';
import { getCookieConfig, getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = getSession(req);
    const db = await getDb();

    if (session) {
      // Write audit log before deleting
      await db.run(
        'INSERT INTO audit_logs (timestamp, admin_username, action, section, details) VALUES (?, ?, ?, ?, ?)',
        [new Date().toISOString(), session.username, 'Logout', 'Authentication', 'Admin logged out.']
      );
    }

    const cookieConfig = getCookieConfig();
    const response = NextResponse.json({ success: true, message: 'Logged out.' });
    
    // Wipe cookie
    response.cookies.set(cookieConfig.name, '', {
      ...cookieConfig.options,
      maxAge: 0
    });

    return response;

  } catch (error) {
    console.error('Logout API Error:', error);
    return NextResponse.json({ error: 'An error occurred during logout.' }, { status: 500 });
  }
}
