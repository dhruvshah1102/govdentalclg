import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { signToken, getCookieConfig } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required parameters.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid administrative credentials.' },
        { status: 401 }
      );
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return NextResponse.json(
        { error: 'Invalid administrative credentials.' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    // Write session cookie
    const cookieConfig = getCookieConfig();
    const response = NextResponse.json({
      success: true,
      user: { username: user.username, role: user.role }
    });

    response.cookies.set(
      cookieConfig.name,
      token,
      cookieConfig.options
    );

    // Write to audit log
    await db.run(
      'INSERT INTO audit_logs (timestamp, admin_username, action, section, details) VALUES (?, ?, ?, ?, ?)',
      [new Date().toISOString(), user.username, 'Login', 'Authentication', 'Admin logged in successfully.']
    );

    return response;

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred during administrative login.' },
      { status: 500 }
    );
  }
}
