import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSupabaseServerClient } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required parameters.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return NextResponse.json(
        { error: 'Invalid administrative credentials.' },
        { status: 401 }
      );
    }

    const db = await getDb();
    await db.run(
      'INSERT INTO audit_logs (timestamp, admin_username, action, section, details) VALUES (?, ?, ?, ?, ?)',
      [new Date().toISOString(), data.user.email, 'Login', 'Authentication', 'Admin logged in successfully.']
    );

    return NextResponse.json({
      success: true,
      user: { username: data.user.email }
    });

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred during administrative login.' },
      { status: 500 }
    );
  }
}
