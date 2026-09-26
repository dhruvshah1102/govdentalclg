'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, CheckCircle, AlertCircle, User } from 'lucide-react';

interface FacultyMember {
  id: number;
  name: string;
  qualifications: string;
  designation: string;
  specialization: string | null;
  email: string | null;
  department_id: string | null;
  department_name: string | null;
  is_teaching: number;
  photo_url: string | null;
  cv_url: string | null;
}

interface FacultyManagerClientProps {
  initialFaculty: FacultyMember[];
  departments: { id: string; name: string }[];
}

export const FacultyManagerClient: React.FC<FacultyManagerClientProps> = ({ 
  initialFaculty, 
  departments 
}) => {
  const [faculty, setFaculty] = useState<FacultyMember[]>(initialFaculty);
  const [name, setName] = useState('');
  const [quals, setQuals] = useState('');
  const [desig, setDesig] = useState('');
  const [spec, setSpec] = useState('');
  const [email, setEmail] = useState('');
  const [deptId, setDeptId] = useState('');
  const [isTeaching, setIsTeaching] = useState(1); // 1: Teaching, 0: Administrative

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const [status, setStatus] = useState<'idle' | 'loading' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCvFile(file);
  };

  const uploadToStorage = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Failed to upload to ${folder}.`);
    }
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quals || !desig) {
      alert('Please fill in required fields (Name, Qualifications, and Designation).');
      return;
    }

    setErrorMessage('');

    try {
      let photoUrl: string | null = null;
      let cvUrl: string | null = null;

      if (photoFile || cvFile) {
        setStatus('uploading');
        if (photoFile) {
          photoUrl = await uploadToStorage(photoFile, 'faculty-photos');
        }
        if (cvFile) {
          cvUrl = await uploadToStorage(cvFile, 'faculty-cvs');
        }
      }

      setStatus('loading');
      const response = await fetch('/api/admin/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          qualifications: quals,
          designation: desig,
          specialization: spec || null,
          email: email || null,
          department_id: isTeaching === 1 ? (deptId || null) : null,
          is_teaching: isTeaching,
          photo_url: photoUrl,
          cv_url: cvUrl
        })
      });

      if (response.ok) {
        const data = await response.json();
        const deptObj = departments.find((d) => d.id === deptId);
        const newMember = {
          id: data.id,
          name,
          qualifications: quals,
          designation: desig,
          specialization: spec || null,
          email: email || null,
          department_id: isTeaching === 1 ? (deptId || null) : null,
          department_name: isTeaching === 1 ? (deptObj ? deptObj.name : null) : null,
          is_teaching: isTeaching,
          photo_url: photoUrl,
          cv_url: cvUrl
        };
        setFaculty((prev) => [newMember, ...prev]);
        setStatus('success');

        // Reset form
        setName('');
        setQuals('');
        setDesig('');
        setSpec('');
        setEmail('');
        setDeptId('');
        setIsTeaching(1);
        if (photoPreview) {
          URL.revokeObjectURL(photoPreview);
        }
        setPhotoFile(null);
        setPhotoPreview(null);
        setCvFile(null);
        setFormKey((k) => k + 1);
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(data.error || 'Failed to add profile. Please check inputs and try again.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to add profile. Please check inputs and try again.');
      setStatus('error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently remove this profile from GDC directory?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/faculty?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setFaculty((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert('Failed to delete profile.');
      }
    } catch (err) {
      alert('A network error occurred.');
    }
  };

  return (
    <div className="space-y-6 font-ui text-xs">
      
      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-[#1B5E3B] flex items-center gap-2 font-sans font-semibold">
          <CheckCircle size={16} />
          <span>New staff profile added successfully to GDC directory!</span>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMessage || 'Failed to add profile. Please check inputs and try again.'}</span>
        </div>
      )}

      {/* Group 1: Add Profile */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
          <Plus className="text-[#D4870A]" size={16} /> Add New Staff Profile
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Full Name (Required)</label>
              <input
                type="text"
                placeholder="Dr. John Doe..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Academic Designation (Required)</label>
              <input
                type="text"
                placeholder="e.g. Professor & Head / Senior Assistant..."
                value={desig}
                onChange={(e) => setDesig(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Staff Category Type</label>
              <select
                value={isTeaching}
                onChange={(e) => setIsTeaching(Number(e.target.value))}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition cursor-pointer font-bold"
              >
                <option value={1}>Teaching Faculty</option>
                <option value={0}>Administrative Office Staff</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Qualifications (Required)</label>
              <input
                type="text"
                placeholder="e.g. MDS (Orthodontics), PhD..."
                value={quals}
                onChange={(e) => setQuals(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                required
              />
            </div>
            {isTeaching === 1 && (
              <>
                <div>
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Specialization Focus</label>
                  <input
                    type="text"
                    placeholder="e.g. Laser Surgery / CBCT..."
                    value={spec}
                    onChange={(e) => setSpec(e.target.value)}
                    className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                  />
                </div>
                <div>
                  <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Link to Department</label>
                  <select
                    value={deptId}
                    onChange={(e) => setDeptId(e.target.value)}
                    className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition cursor-pointer"
                  >
                    <option value="">No Department Link</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {isTeaching === 0 && (
              <div>
                <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Workplace Email</label>
                <input
                  type="email"
                  placeholder="admin.staff@gdcdibrugarh.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
                />
              </div>
            )}
          </div>

          {isTeaching === 1 && (
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Workplace Email (Optional)</label>
              <input
                type="email"
                placeholder="faculty@gdcdibrugarh.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 rounded transition"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">Photo (Optional)</label>
              <div className="flex items-center gap-3">
                <input
                  key={`photo-${formKey}`}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2 rounded transition file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[9px] file:font-bold file:uppercase file:tracking-wider file:bg-[#0A1F44] file:text-white file:cursor-pointer cursor-pointer"
                />
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Photo preview"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300 flex-shrink-0"
                  />
                )}
              </div>
            </div>
            <div>
              <label className="text-gray-500 font-bold uppercase text-[9px] block mb-1">CV / Resume (Optional, PDF)</label>
              <input
                key={`cv-${formKey}`}
                type="file"
                accept="application/pdf"
                onChange={handleCvChange}
                className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2 rounded transition file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[9px] file:font-bold file:uppercase file:tracking-wider file:bg-[#0A1F44] file:text-white file:cursor-pointer cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={status === 'loading' || status === 'uploading'}
              className="bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 font-ui disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Plus size={14} /> {status === 'uploading' ? 'Uploading...' : status === 'loading' ? 'Saving profile...' : 'Add Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Group 2: Current Directory */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-serif text-base font-bold text-[#0A1F44] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
          <Users className="text-[#1B5E3B]" size={16} /> Directory Index
        </h3>

        {faculty.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400 font-sans border border-dashed rounded-lg border-gray-200">
            No profiles added in the directory yet.
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs font-sans mt-4">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 font-ui uppercase text-[9px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Photo</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Full Name</th>
                  <th className="px-6 py-3">Designation</th>
                  <th className="px-6 py-3">Department Link</th>
                  <th className="px-6 py-3">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                {faculty.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3">
                      {f.photo_url ? (
                        <img
                          src={f.photo_url}
                          alt={f.name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                          <User size={14} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                        f.is_teaching === 1 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {f.is_teaching === 1 ? 'Teaching' : 'Office'}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-bold text-[#0A1F44]">{f.name}</td>
                    <td className="px-6 py-3 font-medium">{f.designation}</td>
                    <td className="px-6 py-3 text-gray-400 truncate max-w-[150px]">
                      {f.department_name || 'N/A'}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="text-red-500 hover:text-red-700 font-bold transition flex items-center gap-1"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
