'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_GROUPS } from '../../src/config/navigation';

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 h-screen sticky top-0 overflow-y-auto"
      style={{
        background: 'var(--card)',
        borderRight: '1px solid var(--border)',
      }}
    >
      <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="font-semibold text-xl tracking-tight">Proto-2</div>
        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Business OS
        </div>
      </div>

      <nav className="p-2 text-sm">
        {NAV_GROUPS.map((group) => {
          const items = [...group.items].sort((a, b) => a.sort - b.sort);
          return (
            <div key={group.label} className="mb-4">
              <div
                className="px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {group.label}
              </div>
              {items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  item.match?.includes(pathname) ||
                  (item.href !== '/admin' && pathname.startsWith(item.href + '/'));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 transition-colors"
                    style={
                      active
                        ? {
                            background: 'var(--primary-soft)',
                            color: 'var(--primary)',
                            fontWeight: 500,
                          }
                        : { color: 'var(--foreground)' }
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div
        className="p-4 mt-auto text-[11px]"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
      >
        Complete application layer · Tasks · Agents · Memory
      </div>
    </aside>
  );
}
