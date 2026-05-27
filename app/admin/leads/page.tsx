'use client';

import React from 'react';
import { StatusBadge } from '../../../src/components/admin/StatusBadge';

export default function LeadsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Leads</h1>
      <div className="card p-5">
        <table className="table">
          <thead><tr><th>Name</th><th>Status</th><th>Owner</th></tr></thead>
          <tbody>
            <tr><td>Acme Corp</td><td><StatusBadge status="qualified" /></td><td>JP</td></tr>
            <tr><td>Vanguard Labs</td><td><StatusBadge status="new" /></td><td>Sarah</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
