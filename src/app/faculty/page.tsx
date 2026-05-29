import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { FacultyDirectoryClient } from './FacultyDirectoryClient';

export const revalidate = 0;

export default async function FacultyPage() {
  const db = await getDb();

  // 1. Fetch teaching faculty and non-teaching staff
  const faculty = await db.all(`
    SELECT f.*, d.name as department_name 
    FROM faculty f 
    LEFT JOIN departments d ON f.department_id = d.id 
    ORDER BY f.is_teaching DESC, f.sort_order ASC, f.name ASC
  `);

  // 2. Fetch all departments for filtering options
  const departments = await db.all('SELECT id, name FROM departments');

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 font-sans flex items-center gap-1">
          <Link href="/" className="hover:text-[#0A1F44] transition">Home</Link>
          <span>&raquo;</span>
          <span className="text-[#0A1F44] font-semibold">Faculty & Staff Directory</span>
        </div>

        {/* Dynamic Interactive Client Board */}
        <FacultyDirectoryClient initialFaculty={faculty} departments={departments} />

      </div>
    </div>
  );
}
