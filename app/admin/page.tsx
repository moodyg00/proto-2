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
        <p className="text-muted-foreground">Welcome back. This is the complete application layer.</p>
      </div>

      {/* KPI Cards - 2x2 on mobile, 3x2 on larger */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Link 
              key={i} 
              href={kpi.href} 
              className="stat-card group p-6 block hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[var(--primary-soft)] text-[var(--primary)] rounded-xl flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-3xl font-semibold text-foreground">{kpi.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{kpi.label}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[var(--primary)]" />
              Recent Tasks
            </div>
            <Link href="/admin/tasks" className="text-sm text-[var(--primary)] hover:underline">View all →</Link>
          </div>
          <p className="text-muted-foreground text-sm">No tasks yet. Demo mode active.</p>
        </div>

        <div className="card p-6">
          <div className="font-semibold flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-[var(--primary)]" />
            Agent Interface
          </div>
          <p className="text-muted-foreground text-sm">Agents act as department heads...</p>
        </div>
      </div>
    </div>
  );
}
