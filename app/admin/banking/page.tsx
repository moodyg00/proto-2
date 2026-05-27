'use client';

import React from 'react';

export default function BankingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Banking &amp; Cash</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card"><div className="text-xs">Operating Cash</div><div className="text-2xl font-semibold">$312,400</div></div>
        <div className="stat-card"><div className="text-xs">Next Payroll Run</div><div className="text-2xl font-semibold">Jun 5</div></div>
        <div className="stat-card"><div className="text-xs">Reconciliation Status</div><div className="text-emerald-600 font-medium">Clean</div></div>
      </div>
    </div>
  );
}
