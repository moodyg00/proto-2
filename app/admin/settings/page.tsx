'use client';

/**
 * Settings page.
 *
 * Ports Proto-1's Filament SettingResource UI:
 *   - Category filter from `getCategoryOptions()` becomes a tabbed layout
 *   - One tab per Proto-1 settings category
 *   - One extra tab "Theming" that owns the new dual-layer color system
 *
 * Source (Proto-1):
 *   app/Filament/Resources/SettingResource.php
 *   app/Support/BrandSettings.php
 */

import React, { useState } from 'react';
import { Pill } from '../../../src/components/ui/Pill';
import { ThemingPanel } from '../../../src/components/settings/ThemingPanel';
import { SettingsCategoryPanel } from '../../../src/components/settings/SettingsCategoryPanel';

type TabId = 'theming' | 'business' | 'operations' | 'customer_relations' | 'user_preferences' | 'advanced';

interface Tab {
  id: TabId;
  label: string;
  description: string;
  modules?: string[];
}

const TABS: Tab[] = [
  {
    id: 'theming',
    label: 'Theming',
    description: 'Main color scheme and pill / badge palettes.',
  },
  {
    id: 'business',
    label: 'Business',
    description: 'Brand, payment terms, document defaults, accounting defaults.',
    modules: ['business', 'accounting'],
  },
  {
    id: 'operations',
    label: 'Operations',
    description: 'Scheduling, dispatch, work-order defaults.',
    modules: ['operations'],
  },
  {
    id: 'customer_relations',
    label: 'Customer Relations',
    description: 'CRM and customer-facing defaults.',
    modules: ['crm', 'customer_relations'],
  },
  {
    id: 'user_preferences',
    label: 'User Preferences',
    description: 'Per-user UI preferences (rows per page, default filters, etc).',
    modules: ['ui_preferences', 'user_preferences'],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Raw key/value editor for every settings row, mirroring Proto-1.',
  },
];

export default function SettingsPage() {
  const [active, setActive] = useState<TabId>('theming');
  const tab = TABS.find((t) => t.id === active)!;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <Pill tone="neutral">Administration</Pill>
        </div>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Configure brand, modules, and theming. Mirrors Proto-1 Filament <code>SettingResource</code>.
        </p>
      </header>

      <div
        className="card overflow-hidden"
        style={{ display: 'grid', gridTemplateColumns: '14rem 1fr', minHeight: '32rem' }}
      >
        {/* Vertical tab list */}
        <nav
          className="p-3"
          style={{ borderRight: '1px solid var(--border)', background: 'var(--muted)' }}
        >
          <ul className="space-y-0.5">
            {TABS.map((t) => {
              const isActive = active === t.id;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setActive(t.id)}
                    className="w-full text-left rounded-lg px-3 py-2 text-sm transition-colors"
                    style={
                      isActive
                        ? {
                            background: 'var(--primary-soft)',
                            color: 'var(--primary)',
                            fontWeight: 500,
                          }
                        : { color: 'var(--foreground)' }
                    }
                  >
                    {t.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Tab body */}
        <div className="p-6 space-y-1">
          <div className="space-y-1 pb-4" style={{ borderBottom: '1px solid var(--border)', marginBottom: '1.25rem' }}>
            <h2 className="text-lg font-semibold">{tab.label}</h2>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {tab.description}
            </p>
          </div>

          {tab.id === 'theming' && <ThemingPanel />}

          {tab.id !== 'theming' && tab.id !== 'advanced' && (
            <SettingsCategoryPanel
              title={tab.label}
              description={tab.description}
              modules={tab.modules ?? []}
            />
          )}

          {tab.id === 'advanced' && (
            <SettingsCategoryPanel
              title="Advanced (all settings)"
              description="Raw module/key/value editor. Equivalent to Proto-1's SettingResource list view."
              modules={['business', 'accounting', 'operations', 'crm', 'customer_relations', 'ui_preferences', 'user_preferences']}
            />
          )}
        </div>
      </div>
    </div>
  );
}
