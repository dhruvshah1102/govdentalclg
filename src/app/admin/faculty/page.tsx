import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { FacultyManagerClient } from './FacultyManagerClient';

export const revalidate = 0;

export default async function AdminFacultyPage() {
  const db = await getDb();

  // Fetch current faculty
  const faculty = await db.all(`
    SELECT f.*, d.name as department_name 
    FROM faculty f 
    LEFT JOIN departments d ON f.department_id = d.id 
    ORDER BY f.is_teaching DESC, f.sort_order ASC, f.name ASC
  `);

  // Fetch departments dropdown options
  const departments = await db.all('SELECT id, name FROM departments');

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#0A1F44]">Faculty Directory Roster Manager</h2>
        <p className="text-xs text-gray-400 mt-1">Manage teaching professor profiles, administrative staff list, and link them to clinical departments.</p>
      </div>

      {/* Mount Snappy Faculty Panel */}
      <FacultyManagerClient initialFaculty={faculty} departments={departments} />
    </div>
  );
}
