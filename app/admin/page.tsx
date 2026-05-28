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

  useEffect(() => {
    loadRecent();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. This is the complete application layer.</p>
      </div>

      {/* Quick stats */}
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

      {/* Primary action: Tasks + Ask Agent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold flex items-center gap-2">
              <CheckSquare className="w-5 h-5" /> Recent Tasks
            </div>
            <Link href="/admin/tasks" className="text-sm text-[var(--primary)] hover:underline">View all →</Link>
          </div>

          {loading && <div className="text-sm text-gray-400">Loading tasks…</div>}

          {!loading && recentTasks.length === 0 && (
            <div className="text-sm text-gray-500">
              No tasks yet. Click the button on the right to have an agent surface work.
            </div>
          )}

          <div className="space-y-2">
            {recentTasks.map((t) => (
              <Link
                key={t.id}
                href="/admin/tasks"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-[var(--muted)]"
              >
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
          <p className="text-sm text-gray-500 flex-1">
            Agents act as department heads. They emit Tasks for anything that needs human judgment or irreversible action.
            All decisions are logged to per-agent memory.
          </p>
          <button
            onClick={async () => {
              await fetch('/api/agent-demo', { method: 'POST' });
              window.location.href = '/admin/tasks';
            }}
            className="btn btn-primary w-full mt-4"
          >
            Ask Agent to Surface Work
          </button>
          <div className="text-[10px] text-gray-400 mt-2 text-center">
            Demo mode works without API keys. Full LLM support when OPENAI_API_KEY is set.
          </div>
        </div>
      </div>

      {/* Module quick links */}
      <div>
        <div className="text-sm font-medium text-gray-500 mb-3 px-1">Jump to modules</div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'Tasks', href: '/admin/tasks', icon: CheckSquare },
            { label: 'Operations', href: '/admin/operations', icon: Briefcase },
            { label: 'CRM', href: '/admin/crm', icon: Users },
            { label: 'Accounting', href: '/admin/accounting', icon: DollarSign },
            { label: 'Banking', href: '/admin/banking', icon: DollarSign },
            { label: 'AI & Agents', href: '/admin/ai', icon: Brain },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <Link key={i} href={m.href} className="card p-4 flex items-center gap-3 hover:border-[var(--primary)] transition-colors">
                <Icon className="w-5 h-5 text-[var(--primary)]" />
                <span className="font-medium">{m.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="text-xs text-gray-400 pt-4 border-t">
        Proto-2 • Complete application layer • All changes are persisted to AgentMemory (L0–L3) • Ready for COSS, public site, and deeper resources.
      </div>
    </div>
  );
}
