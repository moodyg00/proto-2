'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { StatusBadge } from '../../../src/components/admin/StatusBadge';
import { ArrowUpRight, ArrowDownRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '../../../components/ui/empty';
import { Input } from '../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';

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
  const router = useRouter();
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em]" style={{ borderColor: 'color-mix(in srgb, var(--border) 72%, #111111 28%)', background: 'color-mix(in srgb, var(--card) 84%, #f3efe7 16%)', color: 'var(--muted-foreground)' }}>
          Bank Transactions
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => toast('Export CSV (demo)')}>Export</Button>
          <Button onClick={() => toast.success('Reconciled 8 transactions')}>Reconcile All</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-xs text-[var(--muted-foreground)]">Net for period</div>
          <div className="text-3xl font-semibold mt-1 tabular-nums">${(totalIncome - totalExpense).toLocaleString()}</div>
          <div className="text-xs text-emerald-600 mt-1">+12% from last week</div>
        </Card>
        <Card className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--muted-foreground)]">Income</div>
            <div className="text-2xl font-semibold text-emerald-600 tabular-nums mt-1">+${totalIncome.toLocaleString()}</div>
          </div>
          <ArrowUpRight className="w-8 h-8 text-emerald-600" />
        </Card>
        <Card className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--muted-foreground)]">Expenses</div>
            <div className="text-2xl font-semibold text-rose-600 tabular-nums mt-1">-${totalExpense.toLocaleString()}</div>
          </div>
          <ArrowDownRight className="w-8 h-8 text-rose-600" />
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-[var(--muted-foreground)]" />
          <Input type="text" placeholder="Search transactions or counterparties..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-11" />
        </div>
        <div className="flex gap-2">
          {(['all', 'income', 'expense', 'pending'] as const).map(f => (
            <Button key={f} size="sm" variant={filter === f ? 'default' : 'secondary'} onClick={() => setFilter(f)}>{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</Button>
          ))}
        </div>
      </div>

      {/* COSS UI CardFrame with card-style table */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]">All Records</Badge>
          <div className="text-xs text-[var(--muted-foreground)]">{filtered.length} transactions</div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Date</TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead className="text-right w-32">Amount</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="p-0">
                  <Empty className="py-12 md:py-14">
                    <EmptyHeader>
                      <EmptyTitle>No Transactions Found</EmptyTitle>
                      <EmptyDescription>No transactions match your filters.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
            {paginated.map((tx) => (
              <TableRow
                key={tx.id}
                className="hover:bg-[var(--muted)]/50 group cursor-pointer"
                onClick={() => router.push(`/admin/bank-transactions/${tx.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    router.push(`/admin/bank-transactions/${tx.id}`);
                  }
                }}
                tabIndex={0}
              >
                <TableCell className="font-mono text-sm text-[var(--muted-foreground)]">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</TableCell>
                <TableCell><div className="w-8 h-8 rounded-full bg-[var(--primary-soft)] flex items-center justify-center text-xs font-semibold text-[var(--primary)]">{tx.avatar}</div></TableCell>
                <TableCell>
                  <div className="font-medium"><Link href={`/admin/bank-transactions/${tx.id}`} className="underline-offset-4 hover:underline">{tx.name}</Link></div>
                  <div className="text-xs text-[var(--muted-foreground)] line-clamp-1">{tx.description}</div>
                </TableCell>
                <TableCell className={`text-right font-medium tabular-nums ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>{tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}</TableCell>
                <TableCell><StatusBadge status={tx.status} /></TableCell>
                <TableCell className="text-right opacity-0 group-hover:opacity-100 transition-opacity"><Link href={`/admin/bank-transactions/${tx.id}`}><Button variant="secondary" size="xs">View</Button></Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-6 py-4 border-t text-sm">
          <div className="text-[var(--muted-foreground)]">Showing {startIndex + 1}–{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length}</div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
            <span className="px-3 text-[var(--muted-foreground)]">Page {currentPage} of {totalPages}</span>
            <Button variant="secondary" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </Card>

      <div className="text-xs text-[var(--muted-foreground)]">COSS UI CardFrame • Agent auto-categorized 94%</div>
    </div>
  );
}
