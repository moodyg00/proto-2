'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--background)' }}>
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      <div className="flex-1 min-w-0">
        <header
          className="h-14 flex items-center px-4 lg:px-6 justify-between"
          style={{
            background: 'var(--card)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Proto-2 · Full Admin Layer
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/admin/settings" style={{ color: 'var(--primary)' }} className="hover:underline">
              Settings
            </Link>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span style={{ color: '#10b981' }}>●</span>
            <span style={{ color: 'var(--muted-foreground)' }}>All systems operational</span>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
