'use client';

import React from 'react';

export default function AccountingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Accounting</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Revenue (MTD)', 'Outstanding A/R', 'Expenses (MTD)', 'Net Margin'].map((l, i) => (
          <div key={i} className="stat-card">
            <div className="text-xs text-gray-500">{l}</div>
            <div className="text-2xl font-semibold mt-1">{['$142k', '$87k', '$61k', '42%'][i]}</div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="font-medium mb-2">Recent Transactions</div>
        <div className="text-sm text-gray-500">Full ledger view + reconciliation coming soon. (Proto-1 parity surface)</div>
      </div>
    </div>
  );
}
