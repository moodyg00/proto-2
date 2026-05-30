import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RecordView } from '@/src/components/admin/RecordView';
import { getJournalEntryDetail } from '@/src/lib/journal-entry-queries';

type PageParams = {
  id: string;
};

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { id } = await params;
  const entry = await getJournalEntryDetail(id);

  if (!entry) {
    notFound();
  }

  const isBalanced = Number(entry.balance) === 0;

  return (
    <RecordView
      title={entry.entryNumber}
      subtitle={`Entry date: ${entry.entryDate}`}
      badge={
        <Badge variant={isBalanced ? 'success' : 'warning'} className="uppercase tracking-[0.22em]">
          {isBalanced ? 'Balanced' : 'Out of balance'}
        </Badge>
      }
      backHref="/admin/journal-entries"
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Source</div>
            <div className="mt-2 text-lg font-semibold">{entry.sourceModule ?? 'manual'}</div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Total debits</div>
            <div className="mt-2 text-lg font-semibold tabular-nums">${Number(entry.totalDebits).toLocaleString()}</div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Total credits</div>
            <div className="mt-2 text-lg font-semibold tabular-nums">${Number(entry.totalCredits).toLocaleString()}</div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Balance</div>
            <div className="mt-2 text-lg font-semibold tabular-nums">${Number(entry.balance).toLocaleString()}</div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <div className="text-sm font-semibold">Entry Lines</div>
              <div className="text-xs text-[var(--muted-foreground)]">{entry.lineCount} line items</div>
            </div>
            <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
              Journal
            </Badge>
          </div>

          <Table variant="card">
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-28 text-right">Debit</TableHead>
                <TableHead className="w-28 text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entry.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>
                    <div className="font-medium">{line.accountCode} • {line.accountName}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{line.accountType}</div>
                  </TableCell>
                  <TableCell className="text-sm text-[var(--muted-foreground)]">{line.description ?? '—'}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{Number(line.debit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{Number(line.credit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Metadata</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs text-[var(--muted-foreground)]">Entry ID</div>
              <div className="mt-1 text-sm font-medium break-all">{entry.id}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--muted-foreground)]">Updated at</div>
              <div className="mt-1 text-sm font-medium">{entry.updatedAt ?? '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </RecordView>
  );
}