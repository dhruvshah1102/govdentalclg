'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Shield, Layers, Megaphone, FileText, Users, 
  Settings, Inbox, Calendar, LogOut, Menu, X, 
  ClipboardList, Activity, ArrowRight, UserCheck, ShieldAlert,
  Stethoscope, Image
} from 'lucide-react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<{ username: string; role: string } | null>(null);
  const [unreadSubmissions, setUnreadSubmissions] = useState(0);

  const isLoginPage = pathname === '/admin/login';

  // 1. Session verification & inbox counting
  useEffect(() => {
    if (isLoginPage) return;

    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (!res.ok) {
          router.push('/admin/login');
        } else {
          const data = await res.json();
          setIsAdmin(true);
          setAdminUser(data.user);
          
          // Fetch unread inbox submissions count
          const subRes = await fetch('/api/submissions/count');
          if (subRes.ok) {
            const subData = await subRes.json();
            setUnreadSubmissions(subData.unread || 0);
          }
        }
      } catch (err) {
        router.push('/admin/login');
      }
    };

    checkSession();
  }, [pathname, router, isLoginPage]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#0A1F44]">{children}</div>;
  }

  if (!isAdmin) {
    return (
      <div className="bg-[#0A1F44] min-h-screen flex items-center justify-center text-white font-sans text-xs">
        <div className="text-center space-y-3">
          <ShieldAlert className="mx-auto text-[#D4870A] animate-spin" size={32} />
          <p className="font-semibold uppercase tracking-widest text-gray-400">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { label: 'Overview Dashboard', icon: Layers, path: '/admin' },
    { label: 'Sliders & Homepage', icon: ClipboardList, path: '/admin/home' },
    { label: 'Clinical Departments', icon: Stethoscope, path: '/admin/departments' },
    { label: 'Gallery Manager', icon: Image, path: '/admin/gallery' },
    { label: 'News & Events', icon: Calendar, path: '/admin/news' },
    { label: 'Tenders Procurement', icon: FileText, path: '/admin/tenders' },
    { label: 'Downloads Library', icon: FileText, path: '/admin/downloads' },
    { label: 'Faculty directory', icon: Users, path: '/admin/faculty' },
    { label: 'Submissions Inbox', icon: Inbox, path: '/admin/inbox', badge: unreadSubmissions },
    { label: 'Core Site Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex font-sans text-xs">
      
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 bg-[#0A1F44] text-white shrink-0 hidden lg:flex flex-col justify-between border-r border-white/5">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center gap-2.5">
            <Shield className="text-[#D4870A] shrink-0" size={22} />
            <div>
              <h1 className="font-serif font-bold text-sm tracking-wide leading-none text-white">GDC ADMIN</h1>
              <span className="text-[9px] text-[#1B5E3B] font-bold uppercase tracking-wider block mt-1 font-ui">
                Assam Dental CMS
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1 font-ui text-xs font-semibold uppercase tracking-wider">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={`flex items-center justify-between p-3 rounded transition-all ${
                    isActive 
                      ? 'bg-[#D4870A] text-white font-bold' 
                      : 'hover:bg-white/5 text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <link.icon size={15} />
                    {link.label}
                  </span>
                  {link.badge && link.badge > 0 ? (
                    <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profile Card & Logout */}
        <div className="p-4 border-t border-white/5 bg-black/10">
          <div className="flex items-center gap-3.5 mb-3 text-left">
            <div className="h-9 w-9 rounded-full bg-[#1B5E3B] flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div>
              <span className="font-bold text-white block text-[11px] leading-tight truncate max-w-[130px]" title={adminUser?.username}>
                {adminUser?.username || 'Administrator'}
              </span>
              <span className="text-[9px] text-gray-400 block font-sans font-semibold capitalize">
                {adminUser?.role || 'Super Admin'}
              </span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 py-2 border border-white/10 hover:border-red-500 hover:bg-red-600/10 hover:text-red-400 rounded text-[10px] font-bold tracking-wider uppercase transition"
          >
            <LogOut size={12} /> Sign out Session
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Header toolbar */}
        <header className="bg-white border-b border-gray-200 py-3.5 px-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-1 text-gray-600 hover:text-[#0A1F44] transition lg:hidden"
            >
              <Menu size={20} />
            </button>
            <span className="font-serif font-bold text-base text-[#0A1F44] tracking-tight capitalize">
              {pathname === '/admin' ? 'CMS Overview' : pathname?.split('/')[2]?.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
            <span className="hidden md:inline font-sans">Server Local Time: <strong>2026-05-27</strong></span>
            <Link href="/" className="bg-[#0A1F44]/5 hover:bg-[#0A1F44]/10 text-[#0A1F44] text-[10px] font-bold py-1.5 px-3 rounded uppercase tracking-wider transition flex items-center gap-0.5">
              Public site &raquo;
            </Link>
          </div>
        </header>

        {/* Content Box */}
        <main className="flex-grow p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#0A1F44]/50 z-50 flex">
          <aside className="w-64 bg-[#0A1F44] text-white flex flex-col justify-between p-6">
            <div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <span className="font-serif font-bold">CMS Menu</span>
                <button onClick={() => setIsMobileOpen(false)} className="p-1 hover:bg-white/10 rounded">
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-1 font-ui text-[10px] uppercase font-bold tracking-wider">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link 
                      key={link.path} 
                      href={link.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center justify-between p-3 rounded transition-all ${
                        isActive ? 'bg-[#D4870A] text-white font-bold' : 'hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <link.icon size={14} />
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-1 py-2 border border-white/10 rounded uppercase font-bold text-[10px] tracking-wider transition"
            >
              <LogOut size={12} /> Sign out
            </button>
          </aside>
          <div className="flex-1" onClick={() => setIsMobileOpen(false)}></div>
        </div>
      )}

    </div>
  );
}
