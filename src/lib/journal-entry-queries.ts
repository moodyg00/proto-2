import { prisma } from '@/src/lib/prisma';

type JournalEntryLineRecord = {
  id: string;
  description: string | null;
  debit: unknown;
  credit: unknown;
  account: {
    code: string;
    name: string;
    type: string;
  };
};

function toStringAmount(value: unknown) {
  if (value === null || value === undefined) return '0.00';
  return typeof value === 'string' ? value : String(value);
}

function formatEntryDate(value: Date) {
  return value.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export type JournalEntrySummary = {
  id: string;
  entryNumber: string;
  entryDate: string;
  description: string | null;
  sourceModule: string | null;
  totalDebits: string;
  totalCredits: string;
  balance: string;
  lineCount: number;
};

export type JournalEntryDetail = JournalEntrySummary & {
  createdAt: string | null;
  updatedAt: string | null;
  lines: Array<{
    id: string;
    description: string | null;
    debit: string;
    credit: string;
    accountCode: string;
    accountName: string;
    accountType: string;
  }>;
};

export async function getJournalEntrySummaries(): Promise<JournalEntrySummary[]> {
  const entries = await prisma.journalEntry.findMany({
    orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }],
    include: {
      _count: {
        select: {
          journalEntryLines: true,
        },
      },
    },
  });

  return entries.map((entry) => {
    const totalDebits = toStringAmount(entry.totalDebits);
    const totalCredits = toStringAmount(entry.totalCredits);
    const balance = (Number(totalDebits) - Number(totalCredits)).toFixed(2);

    return {
      id: entry.id,
      entryNumber: entry.entryNumber,
      entryDate: formatEntryDate(entry.entryDate),
      description: entry.description,
      sourceModule: entry.sourceModule,
      totalDebits,
      totalCredits,
      balance,
      lineCount: entry._count.journalEntryLines,
    };
  });
}

export async function getJournalEntryDetail(id: string): Promise<JournalEntryDetail | null> {
  const entry = await prisma.journalEntry.findUnique({
    where: { id },
    include: {
      journalEntryLines: {
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        include: {
          account: {
            select: {
              code: true,
              name: true,
              type: true,
            },
          },
        },
      },
    },
  });

  if (!entry) return null;

  const totalDebits = toStringAmount(entry.totalDebits);
  const totalCredits = toStringAmount(entry.totalCredits);
  const balance = (Number(totalDebits) - Number(totalCredits)).toFixed(2);

  return {
    id: entry.id,
    entryNumber: entry.entryNumber,
    entryDate: formatEntryDate(entry.entryDate),
    description: entry.description,
    sourceModule: entry.sourceModule,
    totalDebits,
    totalCredits,
    balance,
    lineCount: entry.journalEntryLines.length,
    createdAt: entry.createdAt ? entry.createdAt.toISOString() : null,
    updatedAt: entry.updatedAt ? entry.updatedAt.toISOString() : null,
    lines: entry.journalEntryLines.map((line: JournalEntryLineRecord) => ({
      id: line.id,
      description: line.description,
      debit: toStringAmount(line.debit),
      credit: toStringAmount(line.credit),
      accountCode: line.account.code,
      accountName: line.account.name,
      accountType: line.account.type,
    })),
  };
}