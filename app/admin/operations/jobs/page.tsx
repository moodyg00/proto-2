'use client';

import React from 'react';
import Link from 'next/link';
import { StatusBadge } from '../../../../src/components/admin/StatusBadge';

const jobs = [
  { id: 'job-001', title: 'Website redesign for Acme', status: 'in_progress', priority: 'high' },
  { id: 'job-002', title: 'Q3 financial model refresh', status: 'pending', priority: 'medium' },
];

export default function JobsIndexPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">All Jobs</h1>
        <Link href="/admin/operations" className="text-sm text-violet-600">← Back to Operations</Link>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Job</th><th>Status</th><th>Priority</th><th></th></tr></thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id}>
                <td className="font-medium">{j.title}</td>
                <td><StatusBadge status={j.status} /></td>
                <td><StatusBadge status={j.priority} kind="priority" /></td>
                <td><Link href={`/admin/operations/jobs/${j.id}`} className="text-violet-600">Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
