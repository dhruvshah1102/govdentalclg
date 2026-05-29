import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized administrative session.' }, { status: 401 });
    }

    const db = await getDb();
    const countResult = await db.get("SELECT COUNT(*) as count FROM submissions WHERE status = 'New'");
    
    return NextResponse.json({
      unread: countResult ? (countResult as any).count : 0
    });

  } catch (error) {
    console.error('Submissions Count API Error:', error);
    return NextResponse.json({ error: 'Failed to count submissions.' }, { status: 500 });
  }
}
