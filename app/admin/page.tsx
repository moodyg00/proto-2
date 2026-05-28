'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '../../src/components/admin/StatusBadge';
import { CheckSquare, Briefcase, Users, DollarSign, Brain } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
}

export default function AdminDashboard() {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecent() {
      try {
        const res = await fetch('/api/tasks/actions');
        const data = await res.json();
        setRecentTasks((data.tasks || []).slice(0, 5));
      } catch {
        setRecentTasks([]);
      }
      setLoading(false);
    }
    loadRecent();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. This is the complete application layer.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open Tasks', value: '14', icon: CheckSquare, href: '/admin/tasks' },
          { label: 'Active Jobs', value: '7', icon: Briefcase, href: '/admin/operations' },
          { label: 'Pipeline Value', value: '$312k', icon: Users, href: '/admin/crm' },
          { label: 'Cash Position', value: '$412k', icon: DollarSign, href: '/admin/banking' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={i} href={stat.href} className="stat-card hover:border-[var(--primary)] transition-colors block">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--primary-soft)] rounded-lg text-[var(--primary)]"><Icon className="w-5 h-5" /></div>
                <div>
                  <div className="text-2xl font-semibold">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold flex items-center gap-2">
              <CheckSquare className="w-5 h-5" /> Recent Tasks
            </div>
            <Link href="/admin/tasks" className="text-sm text-[var(--primary)] hover:underline">View all →</Link>
          </div>

          {loading && <div className="text-sm text-gray-400">Loading tasks…</div>}

          {!loading && recentTasks.length === 0 && <div className="text-sm text-gray-500">No tasks yet.</div>}

          <div className="space-y-2">
            {recentTasks.map((t) => (
              <Link key={t.id} href="/admin/tasks" className="flex items-center justify-between p-3 rounded-lg border hover:bg-[var(--muted)]">
                <div className="font-medium">{t.title}</div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={t.priority} kind="priority" />
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 flex flex-col">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <Brain className="w-5 h-5" /> Agent Interface
          </div>
          <p className="text-sm text-gray-500 flex-1">Agents act as department heads.</p>
          <button onClick={async () => { await fetch('/api/agent-demo', { method: 'POST' }); window.location.href = '/admin/tasks'; }} className="btn btn-primary w-full mt-4">Ask Agent to Surface Work</button>
        </div>
      </div>

      <div className="text-xs text-gray-400 pt-4 border-t">Proto-2 • Complete application layer</div>
    </div>
  );
}
