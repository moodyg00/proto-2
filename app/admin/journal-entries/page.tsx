import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getJournalEntrySummaries } from '@/src/lib/journal-entry-queries';

export default async function Page() {
  const entries = await getJournalEntrySummaries();

  const totalDebits = entries.reduce((sum, entry) => sum + Number(entry.totalDebits), 0).toFixed(2);
  const totalCredits = entries.reduce((sum, entry) => sum + Number(entry.totalCredits), 0).toFixed(2);
  const balancedCount = entries.filter((entry) => Number(entry.balance) === 0).length;

  return (
    <div className="space-y-6 pb-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="uppercase tracking-[0.22em]">
              Accounting
            </Badge>
            <Badge variant="info">Real DB</Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Journal Entries</h1>
          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            General ledger entries sourced from the database, with entry lines and source module context.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Entries</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums">{entries.length}</div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Total debits</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums">${Number(totalDebits).toLocaleString()}</div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Total credits</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums">${Number(totalCredits).toLocaleString()}</div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Balanced entries</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums">{balancedCount}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
            Ledger
          </Badge>
          <div className="text-xs text-[var(--muted-foreground)]">{entries.length} journal entries</div>
        </div>

        {entries.length === 0 ? (
          <Empty className="py-12 md:py-14">
            <EmptyHeader>
              <EmptyTitle>No Journal Entries</EmptyTitle>
              <EmptyDescription>No records are available yet.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table variant="card">
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">Entry</TableHead>
                <TableHead className="w-32">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-28">Source</TableHead>
                <TableHead className="w-24 text-right">Debits</TableHead>
                <TableHead className="w-24 text-right">Credits</TableHead>
                <TableHead className="w-20 text-right">Lines</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-[var(--muted)]/50 group">
                  <TableCell className="font-medium">
                    <Link href={`/admin/journal-entries/${entry.id}`} className="underline-offset-4 hover:underline">
                      {entry.entryNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-[var(--muted-foreground)]">{entry.entryDate}</TableCell>
                  <TableCell>
                    <div className="text-sm">{entry.description ?? 'No description'}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">Balance: ${Number(entry.balance).toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" size="sm">
                      {entry.sourceModule ?? 'manual'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">${Number(entry.totalDebits).toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">${Number(entry.totalCredits).toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm text-[var(--muted-foreground)]">{entry.lineCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
