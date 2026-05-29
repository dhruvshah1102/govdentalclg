'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Check if already authenticated on mount
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => {
        if (res.ok) {
          router.push('/admin');
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please enter both administrative username and password.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        // Redirect to dashboard
        router.push('/admin');
      } else {
        const data = await response.json();
        setErrorMsg(data.error || 'Invalid administrative credentials.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMsg('Network connection error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="bg-[#0A1F44] min-h-screen flex items-center justify-center px-4 font-sans text-xs">
      {/* Background graphic decals */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" fill="currentColor">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="bg-white text-[#2D2D2D] rounded-xl shadow-2xl p-6 md:p-8 max-w-sm w-full z-10 border border-white/10 relative">
        <div className="text-center mb-6">
          <div className="h-14 w-14 rounded-full bg-[#D4870A]/10 text-[#D4870A] flex items-center justify-center mx-auto mb-4 border border-[#D4870A]/20 shadow-inner">
            <Shield size={26} className="animate-pulse" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#0A1F44]">GDC DIBRUGARH</h2>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-1 font-ui">
            Administrative CMS Login
          </span>
          <span className="text-[9px] text-[#1B5E3B] font-bold tracking-widest block uppercase mt-0.5 font-sans leading-none">
            Govt of Assam &bull; DCI Authorized
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-ui">
          {status === 'error' && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3.5 rounded flex gap-2 items-center leading-normal">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Username */}
          <div className="relative">
            <label className="text-gray-400 font-bold uppercase text-[9px] block mb-1">Admin Username</label>
            <input
              type="text"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 pl-9 rounded transition"
              required
            />
            <User size={13} className="absolute left-3 top-7.5 text-gray-400" />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-gray-400 font-bold uppercase text-[9px] block mb-1">Admin Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F8F9FA] text-xs border border-gray-300 focus:border-[#0A1F44] focus:outline-none p-2.5 pl-9 pr-9 rounded transition"
              required
            />
            <Lock size={13} className="absolute left-3 top-7.5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-7.5 text-gray-400 hover:text-[#0A1F44] transition"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#0A1F44] hover:bg-[#162E5B] text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider transition shadow-sm font-ui"
            >
              {status === 'loading' ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6 text-[10px] text-gray-400 border-t border-gray-100 pt-4 leading-normal">
          <p>This is a protected government administrative terminal. Unauthorized attempts are actively logged.</p>
          <Link href="/" className="text-[#D4870A] hover:underline font-bold transition block mt-2 uppercase">
            &laquo; Return to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
