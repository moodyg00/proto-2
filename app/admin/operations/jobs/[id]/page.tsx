'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { StatusBadge } from '../../../../../src/components/admin/StatusBadge';

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id || 'job-001';

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">JOB #{jobId}</div>
          <h1 className="text-2xl font-semibold">Website redesign for Acme Corp</h1>
        </div>
        <StatusBadge status="in_progress" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">Value: <span className="font-semibold">$18,500</span></div>
        <div className="card p-4">Due: June 12, 2026</div>
        <div className="card p-4">Owner: <span className="font-medium">Sarah K.</span></div>
      </div>

      <div className="card p-6">
        <h3 className="font-medium mb-3">Status Workflow</h3>
        <div className="flex gap-2">
          {['Draft', 'Approved', 'In Progress', 'Delivered', 'Invoiced'].map((s, i) => (
            <div key={i} className="px-3 py-1 bg-gray-100 rounded text-sm">{s}</div>
          ))}
        </div>
        <button className="mt-4 btn btn-primary">Advance Status</button>
      </div>

      <div className="card p-6">
        <h3 className="font-medium mb-3">Ask Agent</h3>
        <p className="text-sm text-gray-500 mb-3">Have the agent review scope, risks, or prepare client update.</p>
        <button onClick={() => fetch('/api/agent-demo', { method: 'POST' })} className="btn btn-secondary">
          Ask Agent for Update
        </button>
      </div>
    </div>
  );
}
