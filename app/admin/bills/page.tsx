'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from '../../../src/components/admin/StatusBadge';

type BillStatus = 'draft' | 'pending' | 'paid' | 'overdue';

interface BillRecord {
  id: string;
  vendor: string;
  description: string;
  dueDate: string;
  amount: number;
  status: BillStatus;
}

const mockBills: BillRecord[] = [
  { id: 'bill_001', vendor: 'Allied Supply', description: 'Copper fittings and valves', dueDate: '2026-06-03', amount: 4280, status: 'pending' },
  { id: 'bill_002', vendor: 'Metro Logistics', description: 'Fleet service and toll pass', dueDate: '2026-05-30', amount: 920, status: 'paid' },
  { id: 'bill_003', vendor: 'North Electric', description: 'Panel components batch', dueDate: '2026-05-25', amount: 3180, status: 'overdue' },
  { id: 'bill_004', vendor: 'Studio Print Co', description: 'Campaign print collateral', dueDate: '2026-06-08', amount: 640, status: 'draft' },
  { id: 'bill_005', vendor: 'Twilio', description: 'SMS and call routing usage', dueDate: '2026-06-01', amount: 380, status: 'pending' },
];

export default function BillsPage() {
  const router = useRouter();
  const [rows] = useState(mockBills);
  const [filter, setFilter] = useState<'all' | BillStatus>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const filtered = rows
    .filter((row) => (filter === 'all' ? true : row.status === filter))
    .filter((row) => {
      const q = search.toLowerCase();
      return row.vendor.toLowerCase().includes(q) || row.description.toLowerCase().includes(q);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em]" style={{ borderColor: 'color-mix(in srgb, var(--border) 72%, #111111 28%)', background: 'color-mix(in srgb, var(--card) 84%, #f3efe7 16%)', color: 'var(--muted-foreground)' }}>
          Bills
        </div>
        <div className="flex gap-3">
          <button onClick={() => toast('Export bills CSV (demo)')} className="btn btn-secondary">Export</button>
          <button onClick={() => toast.success('Marked selected bills for payment (demo)')} className="btn btn-primary">Queue Payment</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search vendors or bill description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-11"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'draft', 'pending', 'paid', 'overdue'] as const).map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`btn text-sm ${filter === value ? 'btn-primary' : 'btn-secondary'}`}
            >
              {value === 'all' ? 'All' : value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            All Records
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">{filtered.length} bills</div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="w-40">Vendor</th>
              <th>Description</th>
              <th className="w-32">Due Date</th>
              <th className="w-32 text-right">Amount</th>
              <th className="w-28">Status</th>
              <th className="w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-[var(--muted-foreground)]">No bills match your filters.</td>
              </tr>
            )}
            {paginated.map((bill) => (
              <tr
                key={bill.id}
                className="hover:bg-[var(--muted)]/50 group cursor-pointer"
                onClick={() => router.push(`/admin/bills/${bill.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    router.push(`/admin/bills/${bill.id}`);
                  }
                }}
                tabIndex={0}
              >
                <td className="font-medium"><Link href={`/admin/bills/${bill.id}`} className="underline-offset-4 hover:underline">{bill.vendor}</Link></td>
                <td>
                  <div className="text-sm">{bill.description}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{bill.id}</div>
                </td>
                <td className="font-mono text-sm text-[var(--muted-foreground)]">{new Date(bill.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                <td className="text-right font-medium tabular-nums">${bill.amount.toLocaleString()}</td>
                <td><StatusBadge status={bill.status} /></td>
                <td className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/bills/${bill.id}`} className="btn btn-secondary text-xs px-3 py-1">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-4 border-t text-sm">
          <div className="text-[var(--muted-foreground)]">
            Showing {filtered.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn btn-secondary px-3 py-1 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-3 text-[var(--muted-foreground)]">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn btn-secondary px-3 py-1 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="text-xs text-[var(--muted-foreground)]">COSS UI CardFrame • payment queue sync enabled</div>
    </div>
  );
}
