'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from '../../../src/components/admin/StatusBadge';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';

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
          <Button variant="secondary" onClick={() => toast('Export bills CSV (demo)')}>Export</Button>
          <Button onClick={() => toast.success('Marked selected bills for payment (demo)')}>Queue Payment</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-[var(--muted-foreground)]" />
          <Input
            type="text"
            placeholder="Search vendors or bill description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'draft', 'pending', 'paid', 'overdue'] as const).map((value) => (
            <Button
              key={value}
              onClick={() => setFilter(value)}
              variant={filter === value ? 'default' : 'secondary'}
              size="sm"
            >
              {value === 'all' ? 'All' : value.charAt(0).toUpperCase() + value.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]">All Records</Badge>
          <div className="text-xs text-[var(--muted-foreground)]">{filtered.length} bills</div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Vendor</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-32">Due Date</TableHead>
              <TableHead className="w-32 text-right">Amount</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="p-12 text-center text-[var(--muted-foreground)]">No bills match your filters.</TableCell>
              </TableRow>
            )}
            {paginated.map((bill) => (
              <TableRow
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
                <TableCell className="font-medium"><Link href={`/admin/bills/${bill.id}`} className="underline-offset-4 hover:underline">{bill.vendor}</Link></TableCell>
                <TableCell>
                  <div className="text-sm">{bill.description}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{bill.id}</div>
                </TableCell>
                <TableCell className="font-mono text-sm text-[var(--muted-foreground)]">{new Date(bill.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">${bill.amount.toLocaleString()}</TableCell>
                <TableCell><StatusBadge status={bill.status} /></TableCell>
                <TableCell className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/bills/${bill.id}`}>
                    <Button variant="secondary" size="xs">View</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-6 py-4 border-t text-sm">
          <div className="text-[var(--muted-foreground)]">
            Showing {filtered.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
            <span className="px-3 text-[var(--muted-foreground)]">Page {currentPage} of {totalPages}</span>
            <Button variant="secondary" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </Card>

      <div className="text-xs text-[var(--muted-foreground)]">COSS UI CardFrame • payment queue sync enabled</div>
    </div>
  );
}
