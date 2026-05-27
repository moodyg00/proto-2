'use client';

import React from 'react';
import { StatusBadge } from '../../../src/components/admin/StatusBadge';

const leads = [
  { id: 'l1', name: 'Acme Corp', stage: 'qualified', value: 42000, owner: 'JP' },
  { id: 'l2', name: 'Vanguard Labs', stage: 'proposal', value: 18500, owner: 'Sarah' },
];

export default function CRMPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">CRM</h1>

      <div className="grid grid-cols-4 gap-4">
        {['Leads', 'Opportunities', 'Active Deals', 'Won (MTD)'].map((l, i) => (
          <div key={i} className="stat-card"><div className="text-xs text-gray-500">{l}</div><div className="text-2xl font-semibold mt-1">{[34, 11, 7, '$312k'][i]}</div></div>
        ))}
      </div>

      <div className="card">
        <div className="p-4 border-b font-medium">Pipeline</div>
        <table className="table">
          <thead><tr><th>Organization</th><th>Stage</th><th>Value</th><th>Owner</th></tr></thead>
          <tbody>
            {leads.map(l => (
              <tr key={l.id}>
                <td className="font-medium">{l.name}</td>
                <td><StatusBadge status={l.stage} /></td>
                <td>${l.value.toLocaleString()}</td>
                <td>{l.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
