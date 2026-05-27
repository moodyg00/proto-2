'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CheckSquare, Briefcase, Users, DollarSign,
  CreditCard, Megaphone, FileText, Brain, Plug, Settings
} from 'lucide-react';

const navGroups = [
  {
    label: 'Main',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/tasks', label: 'Tasks', icon: CheckSquare },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/admin/operations', label: 'Operations', icon: Briefcase },
      { href: '/admin/operations/jobs', label: 'Jobs', icon: Briefcase },
    ],
  },
  {
    label: 'CRM',
    items: [
      { href: '/admin/crm', label: 'CRM', icon: Users },
      { href: '/admin/leads', label: 'Leads', icon: Users },
      { href: '/admin/contacts', label: 'Contacts', icon: Users },
      { href: '/admin/organizations', label: 'Organizations', icon: Users },
    ],
  },
  {
    label: 'Finance',
    items: [
      { href: '/admin/accounting', label: 'Accounting', icon: DollarSign },
      { href: '/admin/banking', label: 'Banking', icon: CreditCard },
    ],
  },
  {
    label: 'Growth',
    items: [
      { href: '/admin/marketing', label: 'Marketing', icon: Megaphone },
      { href: '/admin/content', label: 'Content', icon: FileText },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/admin/ai', label: 'AI & Agents', icon: Brain },
      { href: '/admin/integrations', label: 'Integrations', icon: Plug },
    ],
  },
  {
    label: 'Administration',
    items: [
      { href: '/admin/administration', label: 'Admin', icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white h-screen sticky top-0 overflow-y-auto">
      <div className="p-4 border-b">
        <div className="font-semibold text-xl tracking-tight">Proto-2</div>
        <div className="text-xs text-gray-500">Business OS</div>
      </div>

      <nav className="p-2 text-sm">
        {navGroups.map(group => (
          <div key={group.label} className="mb-4">
            <div className="px-3 py-1.5 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              {group.label}
            </div>
            {group.items.map(item => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 transition-colors ${
                    active
                      ? 'bg-violet-50 text-violet-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t text-[11px] text-gray-400">
        Complete application layer • Tasks + Agents + Memory
      </div>
    </aside>
  );
}
