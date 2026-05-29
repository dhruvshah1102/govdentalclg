import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized administrative session.' }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        username: session.username,
        role: session.role
      }
    });

  } catch (error) {
    console.error('Session API Error:', error);
    return NextResponse.json({ error: 'An error occurred checking session.' }, { status: 500 });
  }
}
