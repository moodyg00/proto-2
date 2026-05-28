'use client';

import React, { useState } from 'react';
import { StatusBadge } from '../../../src/components/admin/StatusBadge';
import { ArrowUpRight, ArrowDownRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  date: string;
  avatar: string;
  name: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'posted' | 'pending' | 'failed' | 'reconciled';
}

const mockTransactions: Transaction[] = [
  { id: 'tx_001', date: '2026-05-27', avatar: 'AC', name: 'Acme Corp', description: 'Invoice #4821 payment', amount: 12450, type: 'income', status: 'posted' },
  { id: 'tx_002', date: '2026-05-27', avatar: 'ST', name: 'Stripe', description: 'Payout batch May 26', amount: 8920, type: 'income', status: 'posted' },
  { id: 'tx_003', date: '2026-05-26', avatar: 'AD', name: 'Adobe', description: 'Creative Cloud subscription', amount: -5999, type: 'expense', status: 'posted' },
  { id: 'tx_004', date: '2026-05-26', avatar: 'GG', name: 'Google Ads', description: 'Campaign spend - May', amount: -1240, type: 'expense', status: 'pending' },
  { id: 'tx_005', date: '2026-05-25', avatar: 'SH', name: 'Shopify', description: 'Platform fees', amount: -450, type: 'expense', status: 'posted' },
  { id: 'tx_006', date: '2026-05-25', avatar: 'CL', name: 'Client: Vertex Labs', description: 'Retainer Q2', amount: 8500, type: 'income', status: 'reconciled' },
  { id: 'tx_007', date: '2026-05-24', avatar: 'AP', name: 'Apple', description: 'iCloud storage', amount: -99, type: 'expense', status: 'posted' },
  { id: 'tx_008', date: '2026-05-24', avatar: 'TW', name: 'Twilio', description: 'SMS & voice API', amount: -320, type: 'expense', status: 'failed' },
];

export default function BankTransactionsPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'pending'>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const filtered = transactions
    .filter(t => {
      if (filter === 'income') return t.type === 'income';
      if (filter === 'expense') return t.type === 'expense';
      if (filter === 'pending') return t.status === 'pending' || t.status === 'failed';
      return true;
    })
    .filter(t => 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      t.description.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const handleCategorize = (id: string) => {
    toast.success('Transaction categorized (demo)');
  };

  React.useEffect(() => { setCurrentPage(1); }, [filter, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bank Transactions</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">All records • COSS UI CardFrame</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => toast('Export CSV (demo)')} className="btn btn-secondary">Export</button>
          <button onClick={() => toast.success('Reconciled 8 transactions')} className="btn btn-primary">Reconcile All</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-xs text-[var(--muted-foreground)]">Net for period</div>
          <div className="text-3xl font-semibold mt-1 tabular-nums">${(totalIncome - totalExpense).toLocaleString()}</div>
          <div className="text-xs text-emerald-600 mt-1">+12% from last week</div>
        </div>
        <div className="card p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--muted-foreground)]">Income</div>
            <div className="text-2xl font-semibold text-emerald-600 tabular-nums mt-1">+${totalIncome.toLocaleString()}</div>
          </div>
          <ArrowUpRight className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="card p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--muted-foreground)]">Expenses</div>
            <div className="text-2xl font-semibold text-rose-600 tabular-nums mt-1">-${totalExpense.toLocaleString()}</div>
          </div>
          <ArrowDownRight className="w-8 h-8 text-rose-600" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-[var(--muted-foreground)]" />
          <input type="text" placeholder="Search transactions or counterparties..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-11" />
        </div>
        <div className="flex gap-2">
          {(['all', 'income', 'expense', 'pending'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`btn text-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}>{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* COSS UI CardFrame with card-style table */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="font-semibold">All Records</div>
          <div className="text-xs text-[var(--muted-foreground)]">{filtered.length} transactions</div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="w-28">Date</th>
              <th className="w-12"></th>
              <th>Transaction</th>
              <th className="text-right w-32">Amount</th>
              <th className="w-28">Status</th>
              <th className="w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && <tr><td colSpan={6} className="p-12 text-center text-[var(--muted-foreground)]">No transactions match your filters.</td></tr>}
            {paginated.map((tx) => (
              <tr key={tx.id} className="hover:bg-[var(--muted)]/50 group cursor-pointer" onClick={() => toast.info(`Opened ${tx.name} details (demo)`)}>
                <td className="font-mono text-sm text-[var(--muted-foreground)]">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                <td><div className="w-8 h-8 rounded-full bg-[var(--primary-soft)] flex items-center justify-center text-xs font-semibold text-[var(--primary)]">{tx.avatar}</div></td>
                <td>
                  <div className="font-medium">{tx.name}</div>
                  <div className="text-xs text-[var(--muted-foreground)] line-clamp-1">{tx.description}</div>
                </td>
                <td className={`text-right font-medium tabular-nums ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>{tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}</td>
                <td><StatusBadge status={tx.status} kind={tx.status === 'failed' ? 'danger' : tx.status === 'pending' ? 'warning' : 'success'} /></td>
                <td className="text-right opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={(e) => { e.stopPropagation(); handleCategorize(tx.id); }} className="btn btn-secondary text-xs px-3 py-1">Categorize</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-4 border-t text-sm">
          <div className="text-[var(--muted-foreground)]">Showing {startIndex + 1}–{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn btn-secondary px-3 py-1 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-3 text-[var(--muted-foreground)]">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn btn-secondary px-3 py-1 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="text-xs text-[var(--muted-foreground)]">COSS UI CardFrame • Agent auto-categorized 94%</div>
    </div>
  );
}
