import React from 'react';
import { getDb } from '@/lib/db';
import { DepartmentsEditorClient } from './DepartmentsEditorClient';

export const revalidate = 0;

export default async function AdminDepartmentsPage() {
  const db = await getDb();
  
  // Fetch all departments sorted by name
  const departments = await db.all('SELECT * FROM departments ORDER BY name ASC');

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#0A1F44]">Clinical Departments CMS Workspace</h2>
        <p className="text-xs text-gray-400 mt-1">
          Dynamically manage and edit the HOD profiles, clinical services catalogs, infrastructure descriptions, and contact settings for all 9 specialized clinical departments.
        </p>
      </div>

      {/* Mount clinical departments dashboard editor */}
      <DepartmentsEditorClient initialDepartments={departments} />
    </div>
  );
}
