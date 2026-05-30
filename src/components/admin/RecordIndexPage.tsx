'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/src/lib/utils';
import { getAdminCreateHref, isAdminCreateSection } from '@/src/lib/admin-record-form-config';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'info' | 'error' | 'destructive';

export type RecordMeta = {
  label: string;
  value: string;
};

export type RecordItem = {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  metric?: string;
  accent?: string;
  badge?: {
    label: string;
    variant?: BadgeVariant;
  };
  tags?: string[];
  meta: RecordMeta[];
};

export type RecordIndexConfig = {
  eyebrow: string;
  title: string;
  description: string;
  hideToolbar?: boolean;
  searchPlaceholder: string;
  filterLabel: string;
  emptyMessage: string;
  filterOptions: Array<{
    value: string;
    label: string;
  }>;
  gridClassName: string;
  records: RecordItem[];
};

function matchSearch(record: RecordItem, query: string) {
  const haystack = [
    record.name,
    record.subtitle,
    record.category,
    record.metric,
    record.badge?.label,
    ...(record.tags ?? []),
    ...record.meta.flatMap((item) => [item.label, item.value]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export function RecordIndexPage({ config }: { config: RecordIndexConfig }) {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const section = pathname.split('/').filter(Boolean)[1] ?? '';
  const createHref = isAdminCreateSection(section) ? getAdminCreateHref(section) : null;

  const filtered = useMemo(() => {
    return config.records.filter((record) => {
      const matchesFilter = filter === 'all' || record.category === filter;
      const matchesQuery = query.trim().length === 0 || matchSearch(record, query);
      return matchesFilter && matchesQuery;
    });
  }, [config.records, filter, query]);

  return (
    <div className="space-y-6 pb-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em]"
            style={{
              borderColor: 'color-mix(in srgb, var(--border) 72%, #111111 28%)',
              background: 'color-mix(in srgb, var(--card) 84%, #f3efe7 16%)',
              color: 'var(--muted-foreground)',
            }}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {config.eyebrow}
          </div>
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            {config.title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            {filtered.length} visible
          </span>
          {createHref && config.hideToolbar ? (
            <Link
              aria-label="Add record"
              href={createHref}
              className={cn(buttonVariants({ variant: 'outline', size: 'icon-sm' }), 'rounded-full text-lg font-semibold')}
            >
              +
            </Link>
          ) : null}
        </div>
      </header>

      <div className="space-y-5">
          {!config.hideToolbar ? (
            <div className="grid gap-3 lg:grid-cols-[1fr_240px_auto]">
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--muted-foreground)' }}>
                  Search
                </span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={config.searchPlaceholder}
                    className="pl-10"
                    type="search"
                  />
                </div>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--muted-foreground)' }}>
                  {config.filterLabel}
                </span>
                <div className="relative">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <select
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    className="h-9 w-full rounded-md border pl-10 pr-3 text-sm outline-none sm:h-8"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                    }}
                  >
                    {config.filterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              {createHref ? (
                <div className="flex items-end">
                  <Link
                    aria-label="Add record"
                    href={createHref}
                    className={cn(buttonVariants({ variant: 'outline', size: 'icon-sm' }), 'rounded-full text-lg font-semibold')}
                  >
                    +
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <div
              className="border px-5 py-10 text-center text-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            >
              {config.emptyMessage}
            </div>
          ) : (
            <div className={config.gridClassName}>
              {filtered.map((record) => {
                const accent = record.accent ?? '#111111';
                const detailHref = `${pathname.replace(/\/$/, '')}/${record.id}`;

                return (
                  <Link
                    key={record.id}
                    href={detailHref}
                    className="group block rounded-[1.65rem] border p-4 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--border) 82%, transparent 18%)',
                      background: `linear-gradient(180deg, color-mix(in srgb, ${accent} 5%, var(--card) 95%), var(--card))`,
                      boxShadow: '0 18px 44px rgba(17, 17, 17, 0.05)',
                    }}
                  >
                    <article>
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-lg font-semibold leading-tight">{record.name}</div>
                          <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{record.subtitle}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ background: accent }} />
                          {record.badge ? (
                            <Badge variant={record.badge.variant ?? 'outline'}>{record.badge.label}</Badge>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {record.meta.map((item) => (
                          <div key={`${record.id}-${item.label}`} className="rounded-[1rem] border px-3 py-2" style={{ borderColor: 'color-mix(in srgb, var(--border) 78%, transparent 22%)', background: 'color-mix(in srgb, var(--card) 92%, #f3efe7 8%)' }}>
                            <div className="text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: 'var(--muted-foreground)' }}>
                              {item.label}
                            </div>
                            <div className="mt-1 text-sm font-medium">{item.value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {(record.tags ?? []).map((tag) => (
                            <span key={`${record.id}-${tag}`} className="rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.14em]" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        {record.metric ? (
                          <div className="text-right">
                            <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--muted-foreground)' }}>
                              Open record
                            </div>
                            <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--muted-foreground)' }}>
                              Snapshot
                            </div>
                            <div className="text-sm font-semibold">{record.metric}</div>
                          </div>
                        ) : (
                          <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--muted-foreground)' }}>
                            Open record
                          </div>
                        )}
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
}
