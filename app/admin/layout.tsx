import React from 'react';
import Link from 'next/link';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--background)' }}>
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header
          className="h-14 flex items-center px-6 justify-between"
          style={{
            background: 'var(--card)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Proto-2 · Full Admin Layer
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
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
