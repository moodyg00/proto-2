'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type CardRecord = {
  id: string;
  label: string;
  subtitle: string;
  cardNumber: string;
  cardholder: string;
  expiry: string;
  cvc: string;
  network: 'visa' | 'mastercard' | 'amex';
  category: 'physical' | 'virtual';
  status: 'active' | 'watch' | 'paused';
  statusVariant: 'success' | 'warning' | 'info' | 'error';
  spent: number;
  limit: number;
  owner: string;
  tags: string[];
};

const CARDS: CardRecord[] = [
  {
    id: 'card-1',
    label: 'Ops Fuel Card',
    subtitle: 'Primary card for field fuel and transport.',
    cardNumber: '4539 1182 4928 1822',
    cardholder: 'NINA T',
    expiry: '09/28',
    cvc: '847',
    network: 'visa',
    category: 'physical',
    status: 'active',
    statusVariant: 'success',
    spent: 1980,
    limit: 5000,
    owner: 'Nina T.',
    tags: ['Crew A'],
  },
  {
    id: 'card-2',
    label: 'Ads Spend Virtual',
    subtitle: 'Dedicated media buying budget card.',
    cardNumber: '5412 7531 2948 7341',
    cardholder: 'MAYA C',
    expiry: '12/27',
    cvc: '392',
    network: 'mastercard',
    category: 'virtual',
    status: 'active',
    statusVariant: 'info',
    spent: 3420,
    limit: 6000,
    owner: 'Maya C.',
    tags: ['Marketing'],
  },
  {
    id: 'card-3',
    label: 'Emergency Purchases',
    subtitle: 'On-demand materials and urgent replacement parts.',
    cardNumber: '4916 3827 1053 5503',
    cardholder: 'DISPATCH',
    expiry: '03/27',
    cvc: '561',
    network: 'visa',
    category: 'physical',
    status: 'watch',
    statusVariant: 'warning',
    spent: 640,
    limit: 2500,
    owner: 'Dispatch',
    tags: ['Emergency'],
  },
];

function BankCard({ card }: { card: CardRecord }) {
  const [revealedNumber, setRevealedNumber] = useState(false);
  const [revealedCvc, setRevealedCvc] = useState(false);

  const maskedNumber = card.cardNumber
    .split(' ')
    .map((group, i) => (i < 3 ? '••••' : group))
    .join(' ');

  const displayNumber = revealedNumber ? card.cardNumber : maskedNumber;
  const displayCvc = revealedCvc ? card.cvc : '•••';
  const spentPct = Math.min(100, Math.round((card.spent / card.limit) * 100));

  return (
    <div className="space-y-4">
      {/* Physical card */}
      <div
        className="relative overflow-hidden rounded-2xl select-none"
        style={{
          aspectRatio: '1.586',
          background: 'var(--bank-card-bg)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.14)',
        }}
      >
        {/* Subtle sheen */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)',
          }}
        />

        {/* Chip */}
        <div
          className="absolute"
          style={{ top: '38%', left: '6%' }}
        >
          <div
            className="relative rounded-[4px]"
            style={{
              width: 42,
              height: 32,
              background: 'linear-gradient(135deg, #d4a843 0%, #e8c76a 40%, #c9993a 70%, #d4a843 100%)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-center gap-[3px] px-[6px]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[2px] rounded-full" style={{ background: 'rgba(139,95,20,0.4)' }} />
              ))}
            </div>
            <div className="absolute inset-0 flex flex-row justify-center gap-[3px] items-center py-[4px]">
              {[0, 1].map((i) => (
                <div key={i} className="w-[2px] h-full rounded-full" style={{ background: 'rgba(139,95,20,0.4)' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Card number */}
        <div className="absolute" style={{ bottom: '30%', left: '6%', right: '6%' }}>
          <div className="flex items-center justify-between">
            <span
              className="font-mono tracking-[0.22em]"
              style={{ fontSize: 14, color: 'var(--card-text)', textShadow: 'none' }}
            >
              {displayNumber}
            </span>
            <button
              onClick={() => setRevealedNumber((v) => !v)}
              className="ml-2 flex-shrink-0 rounded-full p-1 transition-colors focus-visible:outline-none focus-visible:ring-2"
              style={{ ['--tw-ring-color' as string]: 'var(--card-text)' }}
              aria-label={revealedNumber ? 'Hide card number' : 'Reveal card number'}
            >
              {revealedNumber ? (
                <EyeOff className="h-3.5 w-3.5 opacity-50" style={{ color: 'var(--card-text)' }} />
              ) : (
                <Eye className="h-3.5 w-3.5 opacity-50" style={{ color: 'var(--card-text)' }} />
              )}
            </button>
          </div>
        </div>

        {/* Cardholder + expiry + CVC */}
        <div
          className="absolute flex items-end justify-between"
          style={{ bottom: '7%', left: '6%', right: '6%' }}
        >
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] mb-0.5 opacity-40" style={{ color: 'var(--card-text)' }}>Card Holder</div>
            <div className="font-mono tracking-widest text-[11px]" style={{ color: 'var(--card-text)' }}>{card.cardholder}</div>
          </div>
          <div className="flex items-end gap-4">
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-[0.2em] mb-0.5 opacity-40" style={{ color: 'var(--card-text)' }}>Expires</div>
              <div className="font-mono tracking-widest text-[11px]" style={{ color: 'var(--card-text)' }}>{card.expiry}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-[0.2em] mb-0.5 opacity-40" style={{ color: 'var(--card-text)' }}>CVC</div>
              <div className="flex items-center gap-1">
                <span className="font-mono tracking-widest text-[11px]" style={{ color: 'var(--card-text)' }}>{displayCvc}</span>
                <button
                  onClick={() => setRevealedCvc((v) => !v)}
                  className="rounded-full p-0.5 transition-colors focus-visible:outline-none"
                  aria-label={revealedCvc ? 'Hide CVC' : 'Reveal CVC'}
                >
                  {revealedCvc ? (
                    <EyeOff className="h-3 w-3 opacity-40" style={{ color: 'var(--card-text)' }} />
                  ) : (
                    <Eye className="h-3 w-3 opacity-40" style={{ color: 'var(--card-text)' }} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info panel below card */}
      <div className="space-y-3 px-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold text-[15px] leading-tight">{card.label}</div>
            <div className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{card.subtitle}</div>
          </div>
          <Badge variant={card.statusVariant} className="shrink-0">{card.status}</Badge>
        </div>

        {/* Spend bar */}
        <div>
          <div className="flex justify-between text-[11px] mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
            <span>${card.spent.toLocaleString()} spent</span>
            <span>{spentPct}% of ${card.limit.toLocaleString()}</span>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${spentPct}%`,
                background: spentPct >= 95 ? '#ef4444' : spentPct >= 80 ? '#f59e0b' : 'var(--foreground)',
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" size="sm">{card.category}</Badge>
          <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
            Owner: {card.owner}
          </span>
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-[0.14em]"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="space-y-6 pb-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em]"
            style={{
              borderColor: 'color-mix(in srgb, var(--border) 72%, #111 28%)',
              background: 'color-mix(in srgb, var(--card) 84%, #f3efe7 16%)',
              color: 'var(--muted-foreground)',
            }}
          >
            Banking
          </div>
          <span
            className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            Cards
          </span>
        </div>
        <span
          className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          {CARDS.length} cards
        </span>
      </header>

      <div className="grid gap-x-20 gap-y-16 md:grid-cols-2">
        {CARDS.map((card) => (
          <div key={card.id} className="px-6 pt-6 pb-2">
            <BankCard card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}

