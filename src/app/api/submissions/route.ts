import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, email, phone, subject, message, form_data } = body;

    // Validate core fields
    if (!type || !name) {
      return NextResponse.json(
        { error: 'Form type and applicant name are required parameters.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.run(
      `INSERT INTO submissions (
        type, name, email, phone, subject, message, form_data, submitted_at, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'New')`,
      [
        type,
        name,
        email || null,
        phone || null,
        subject || null,
        message || null,
        form_data || null,
        new Date().toISOString()
      ]
    );

    return NextResponse.json({
      success: true,
      submissionId: result.lastID
    }, { status: 201 });

  } catch (error) {
    console.error('Submission API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while registering your submission.' },
      { status: 500 }
    );
  }
}
