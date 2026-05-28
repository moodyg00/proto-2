'use client';
import React from 'react';
import Link from 'next/link';
import { CheckSquare, Briefcase, Users, DollarSign, Brain, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const kpis = [
    { label: 'Open Tasks', value: '14', icon: CheckSquare, href: '/admin/tasks' },
    { label: 'Active Jobs', value: '7', icon: Briefcase, href: '/admin/operations' },
    { label: 'Pipeline Value', value: '$312k', icon: Users, href: '/admin/crm' },
    { label: 'Cash Position', value: '$412k', icon: DollarSign, href: '/admin/banking' },
    { label: 'Agents Active', value: '3', icon: Brain, href: '/admin/ai' },
    { label: 'Tasks Today', value: '9', icon: CheckCircle, href: '/admin/tasks' },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Welcome back. High-level overview.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Link key={i} href={kpi.href} className="stat-card p-4 block hover:border-[var(--primary)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--primary-soft)] rounded-lg text-[var(--primary)]"><Icon className="w-5 h-5" /></div>
                <div>
                  <div className="text-2xl font-semibold">{kpi.value}</div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="font-semibold mb-4 flex items-center gap-2"><CheckSquare className="w-5 h-5" /> Recent Tasks</div>
          <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No tasks yet. Demo mode active.</div>
        </div>
        <div className="card p-6">
          <div className="font-semibold mb-4 flex items-center gap-2"><Brain className="w-5 h-5" /> Agent Status</div>
          <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>3 agents running. All systems nominal.</div>
        </div>
      </div>

      <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Proto-2 • Phase 1 Lightweight Admin</div>
    </div>
  );
}
