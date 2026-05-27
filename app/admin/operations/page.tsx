'use client';

import React from 'react';
import Link from 'next/link';
import { StatusBadge } from '../../../src/components/admin/StatusBadge';

const jobs = [
  { id: 'job-001', title: 'Website redesign for Acme', status: 'in_progress', priority: 'high', value: 18500, due: '2026-06-12' },
  { id: 'job-002', title: 'Q3 financial model refresh', status: 'pending', priority: 'medium', value: 4200, due: '2026-06-05' },
  { id: 'job-003', title: 'New CRM data migration', status: 'completed', priority: 'urgent', value: 9800, due: '2026-05-28' },
];

export default function OperationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Operations</h1>
          <p className="text-sm text-gray-500">Jobs • Estimates • Invoices • Delivery</p>
        </div>
        <button className="btn btn-primary">+ New Job</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Total Open Jobs', 'In Progress', 'Due This Week', 'Revenue Pipeline'].map((label, i) => (
          <div key={i} className="stat-card">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-3xl font-semibold mt-1">{[12, 7, 4, '$124k'][i]}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="p-4 border-b font-medium flex items-center justify-between">
          <span>Active Jobs</span>
          <Link href="/admin/operations/jobs" className="text-sm text-violet-600">View all →</Link>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Job</th><th>Status</th><th>Priority</th><th>Value</th><th>Due</th><th></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id}>
                <td className="font-medium">{j.title}</td>
                <td><StatusBadge status={j.status} /></td>
                <td><StatusBadge status={j.priority} kind="priority" /></td>
                <td>${j.value.toLocaleString()}</td>
                <td className="text-sm text-gray-500">{j.due}</td>
                <td><Link href={`/admin/operations/jobs/${j.id}`} className="text-violet-600 text-sm">Open →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-medium mb-3">Estimates</h3>
          <div className="text-sm text-gray-500">3 draft • 1 sent this week • 2 awaiting approval</div>
          <button className="btn btn-secondary mt-3 text-sm">Create Estimate</button>
        </div>
        <div className="card p-5">
          <h3 className="font-medium mb-3">Invoices</h3>
          <div className="text-sm text-gray-500">2 overdue • $18.4k outstanding • 7 paid this month</div>
          <button className="btn btn-secondary mt-3 text-sm">New Invoice</button>
        </div>
      </div>
    </div>
  );
}
