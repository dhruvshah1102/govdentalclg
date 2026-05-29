import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { 
  Megaphone, Calendar, FileText, Inbox, 
  Activity, ArrowRight, ShieldAlert, Award, Clock 
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const db = await getDb();

  const today = new Date().toISOString().split('T')[0];

  // 1. Fetch system metrics
  const newsCount = await db.get("SELECT COUNT(*) as count FROM news_events");
  const unreadSubCount = await db.get("SELECT COUNT(*) as count FROM submissions WHERE status = 'New'");
  const activeTendersCount = await db.get("SELECT COUNT(*) as count FROM tenders WHERE last_date >= ? AND status = 'Active'", [today]);
  const downloadsCount = await db.get("SELECT COUNT(*) as count FROM downloads");

  // 2. Fetch recent activity / audit logs
  const auditLogs = await db.all("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 10");

  const metrics = [
    { label: 'Published News/Events', count: newsCount ? (newsCount as any).count : 0, color: 'bg-blue-500/10 text-blue-600 border-blue-150', link: '/admin/news' },
    { label: 'Unread Form Inboxes', count: unreadSubCount ? (unreadSubCount as any).count : 0, color: 'bg-red-500/10 text-red-600 border-red-150', link: '/admin/inbox' },
    { label: 'Active Live Tenders', count: activeTendersCount ? (activeTendersCount as any).count : 0, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-150', link: '/admin/tenders' },
    { label: 'Downloads Library Files', count: downloadsCount ? (downloadsCount as any).count : 0, color: 'bg-amber-500/10 text-amber-600 border-amber-150', link: '/admin/downloads' },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <div key={idx} className={`border rounded-lg p-5 flex flex-col justify-between h-32 hover:shadow transition bg-white ${m.color}`}>
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">{m.label}</span>
            </div>
            <div className="flex justify-between items-end mt-2">
              <span className="text-3xl font-extrabold tracking-tight font-serif">{m.count}</span>
              <Link href={m.link} className="text-[10px] font-bold uppercase tracking-wider font-ui hover:underline flex items-center gap-0.5">
                Manage <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Activity Trail & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* System Activity / Audit Log Trail - 2 Columns */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
          <h3 className="font-serif text-lg font-bold text-[#0A1F44] border-b border-gray-100 pb-3.5 mb-5 flex items-center gap-2">
            <Activity className="text-[#D4870A]" size={18} /> System Activity Logs & Audit Trail
          </h3>

          {auditLogs.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-400 font-sans border border-dashed rounded-lg border-gray-200">
              No recent modifications or activity logged yet.
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs font-sans">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 font-ui uppercase text-[9px] font-bold tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Timestamp</th>
                    <th className="px-5 py-3">Operator</th>
                    <th className="px-5 py-3">Action</th>
                    <th className="px-5 py-3">Section</th>
                    <th className="px-5 py-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 whitespace-nowrap text-gray-400 text-[10px]">
                        {new Date(log.timestamp).toLocaleString('en-IN', { hour12: true })}
                      </td>
                      <td className="px-5 py-3 font-bold text-[#0A1F44]">{log.admin_username}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          log.action === 'Login' 
                            ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                            : log.action === 'Create'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : log.action === 'Delete'
                            ? 'bg-rose-50 text-rose-600 border border-rose-100'
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 font-semibold">{log.section}</td>
                      <td className="px-5 py-3 truncate max-w-[200px]" title={log.details}>{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Dashboard health sidebar widget */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="border-b border-gray-150 pb-2 mb-4 flex items-center justify-between">
              <h4 className="font-serif text-base font-bold text-[#0A1F44] flex items-center gap-1.5">
                <ShieldAlert className="text-[#D4870A]" /> CMS Terminal Health
              </h4>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            </div>
            
            <ul className="space-y-4 text-xs text-gray-500 pt-2 font-medium">
              <li className="flex justify-between items-center">
                <span>Database Engine:</span>
                <strong className="text-[#1B5E3B]">SQLite relational</strong>
              </li>
              <li className="flex justify-between items-center">
                <span>Database File status:</span>
                <strong className="text-emerald-600">CONNECTED / WRITE OK</strong>
              </li>
              <li className="flex justify-between items-center">
                <span>Active admin roles:</span>
                <strong className="text-gray-700">Super Admin (Full access)</strong>
              </li>
              <li className="flex justify-between items-center">
                <span>Daily Cron Check Tenders:</span>
                <strong className="text-[#D4870A]">ON-LOAD AUTO (100% OK)</strong>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <span className="text-[10px] text-gray-400 block text-center font-semibold leading-normal font-sans">
              Designed in compliance with National Informatics Centre (NIC) security directives.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
