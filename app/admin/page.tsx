'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '../../src/components/admin/StatusBadge';
import { CheckSquare, Briefcase, Users, DollarSign, Brain } from 'lucide-react';

interface Task { id: string; title: string; status: string; priority: string; }

export default function AdminDashboard() {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/tasks/actions');
        const data = await res.json();
        setRecentTasks((data.tasks || []).slice(0, 5));
      } catch { setRecentTasks([]); }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[ { label: 'Open Tasks', value: '14', icon: CheckSquare, href: '/admin/tasks' } ].map((stat, i) => {
          const Icon = stat.icon;
          return <Link key={i} href={stat.href} className="stat-card hover:border-[var(--primary)] block"><div className="flex items-center gap-3"><div className="p-2 bg-[var(--primary-soft)] rounded-lg text-[var(--primary)]"><Icon className="w-5 h-5" /></div><div><div className="text-2xl font-semibold">{stat.value}</div><div className="text-xs text-gray-500">{stat.label}</div></div></div></Link>;
        })}
      </div>
      <div className="text-xs text-gray-400 pt-4 border-t">Proto-2</div>
    </div>
  );
}
