import React from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header className="h-14 border-b bg-white flex items-center px-6 justify-between">
          <div className="text-sm text-gray-500">Proto-2 • Full Admin Layer</div>
          <div className="flex items-center gap-3 text-sm">
            <a href="/api/agent-demo" className="text-violet-600 hover:underline">Trigger Demo Agent</a>
            <span className="text-gray-300">|</span>
            <span className="text-emerald-600">●</span> All systems operational
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
