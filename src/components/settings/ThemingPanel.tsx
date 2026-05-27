'use client';

/**
 * ThemingPanel — settings UI for the two-layer theme system.
 *
 * 1) Main color scheme: 8 named presets + custom hex
 * 2) Secondary palette: 4 named palettes that re-color pills/badges atomically
 *
 * Both write through ThemeProvider, which:
 *   - updates CSS variables on <html>
 *   - persists to localStorage (server persistence will be added when the
 *     `settings` Prisma model lands; the shape is `module='ui_preferences'`,
 *     `key='theme'`, `value=ThemeState`).
 */

import React, { useState } from 'react';
import {
  PRIMARY_PRESETS,
  PALETTE_PRESETS,
  useTheme,
  type PrimaryName,
  type PaletteName,
} from '../../providers/theme-provider';
import { Pill } from '../ui/Pill';

export function ThemingPanel() {
  const { primary, primaryHex, palette, setPrimary, setPrimaryHex, setPalette, reset } = useTheme();
  const [hexDraft, setHexDraft] = useState(primaryHex ?? '');

  return (
    <div className="space-y-8">
      {/* MAIN COLOR ----------------------------------------------------- */}
      <section className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">Main color scheme</h3>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Used by buttons, links, focus rings, and the active sidebar item.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PRIMARY_PRESETS.map((p) => {
            const active = !primaryHex && primary === p.name;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setPrimary(p.name);
                  setHexDraft('');
                }}
                className="flex flex-col items-center justify-center rounded-lg p-3 gap-1.5 transition-colors"
                style={{
                  background: active ? p.soft : 'var(--card)',
                  border: `1px solid ${active ? p.hex : 'var(--border)'}`,
                }}
              >
                <span
                  className="w-6 h-6 rounded-full"
                  style={{ background: p.hex, boxShadow: '0 1px 2px rgb(0 0 0 / 0.15)' }}
                />
                <span className="text-xs font-medium">{p.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Custom hex
          </label>
          <input
            type="text"
            placeholder="#7c3aed"
            value={hexDraft}
            onChange={(e) => setHexDraft(e.target.value)}
            className="input"
            style={{ width: 140, fontFamily: 'ui-monospace, monospace' }}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (/^#?[0-9a-fA-F]{6}$/.test(hexDraft.trim())) {
                const h = hexDraft.trim().startsWith('#') ? hexDraft.trim() : `#${hexDraft.trim()}`;
                setPrimaryHex(h);
              } else if (hexDraft.trim() === '') {
                setPrimaryHex(null);
              }
            }}
          >
            Apply
          </button>
          {primaryHex && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setPrimaryHex(null);
                setHexDraft('');
              }}
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* SECONDARY PALETTE --------------------------------------------- */}
      <section className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">Secondary palette</h3>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Defines pill and badge colors across the app. Pick a vibe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PALETTE_PRESETS.map((p) => {
            const active = palette === p.name;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => setPalette(p.name)}
                className="text-left rounded-lg p-4 transition-colors"
                style={{
                  background: 'var(--card)',
                  border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                  boxShadow: active ? '0 0 0 2px var(--primary-soft)' : undefined,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{p.label}</div>
                  {active && <Pill tone="accent">selected</Pill>}
                </div>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  {p.description}
                </p>
                {/* live preview row, rendered inside a scoped element so the
                    palette swap is visible per card. We use inline data-palette
                    on the host element to scope the swatch preview locally. */}
                <PaletteSwatchRow palette={p.name} />
              </button>
            );
          })}
        </div>
      </section>

      {/* LIVE PREVIEW -------------------------------------------------- */}
      <section className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">Live preview</h3>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Reflects the current global selection. Save state persists locally.
          </p>
        </div>

        <div className="card p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="neutral">Neutral</Pill>
            <Pill tone="info">Info</Pill>
            <Pill tone="success">Paid</Pill>
            <Pill tone="warning">Pending</Pill>
            <Pill tone="danger">Failed</Pill>
            <Pill tone="accent">Featured</Pill>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-primary">Primary action</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-danger">Destructive</button>
          </div>
          <div className="card p-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Tag</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Acme Co.</td>
                  <td><Pill tone="success">Paid</Pill></td>
                  <td><Pill tone="accent">VIP</Pill></td>
                </tr>
                <tr>
                  <td>Globex</td>
                  <td><Pill tone="warning">Pending</Pill></td>
                  <td><Pill tone="info">New</Pill></td>
                </tr>
                <tr>
                  <td>Initech</td>
                  <td><Pill tone="danger">Overdue</Pill></td>
                  <td><Pill tone="neutral">Standard</Pill></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="button" className="btn btn-secondary" onClick={reset}>
            Reset to defaults
          </button>
        </div>
      </section>
    </div>
  );
}

/**
 * Renders a row of pills inside a scoped element with data-palette set so the
 * row visually previews that palette regardless of the current global palette.
 * Achieved by re-declaring the palette variables on the host via inline styles.
 */
function PaletteSwatchRow({ palette }: { palette: PaletteName }) {
  return (
    <div data-palette-preview={palette} className="flex flex-wrap gap-1.5" style={paletteVars(palette)}>
      <Pill tone="info">Info</Pill>
      <Pill tone="success">OK</Pill>
      <Pill tone="warning">Warn</Pill>
      <Pill tone="danger">Err</Pill>
      <Pill tone="accent">Tag</Pill>
    </div>
  );
}

function paletteVars(p: PaletteName): React.CSSProperties {
  const map: Record<PaletteName, Record<string, string>> = {
    default: {
      '--pill-neutral-bg': '#f1f5f9', '--pill-neutral-fg': '#334155', '--pill-neutral-border': '#e2e8f0',
      '--pill-info-bg': '#dbeafe',    '--pill-info-fg': '#1e40af',    '--pill-info-border': '#bfdbfe',
      '--pill-success-bg': '#d1fae5', '--pill-success-fg': '#065f46', '--pill-success-border': '#a7f3d0',
      '--pill-warning-bg': '#fef3c7', '--pill-warning-fg': '#92400e', '--pill-warning-border': '#fde68a',
      '--pill-danger-bg': '#fee2e2',  '--pill-danger-fg': '#991b1b',  '--pill-danger-border': '#fecaca',
      '--pill-accent-bg': '#ede9fe',  '--pill-accent-fg': '#5b21b6',  '--pill-accent-border': '#ddd6fe',
    },
    vivid: {
      '--pill-neutral-bg': '#1e293b', '--pill-neutral-fg': '#f8fafc', '--pill-neutral-border': '#334155',
      '--pill-info-bg': '#06b6d4',    '--pill-info-fg': '#ffffff',    '--pill-info-border': '#0891b2',
      '--pill-success-bg': '#84cc16', '--pill-success-fg': '#1a2e05', '--pill-success-border': '#65a30d',
      '--pill-warning-bg': '#f59e0b', '--pill-warning-fg': '#1c1917', '--pill-warning-border': '#d97706',
      '--pill-danger-bg': '#ef4444',  '--pill-danger-fg': '#ffffff',  '--pill-danger-border': '#dc2626',
      '--pill-accent-bg': '#d946ef',  '--pill-accent-fg': '#ffffff',  '--pill-accent-border': '#c026d3',
    },
    pastel: {
      '--pill-neutral-bg': '#f8fafc', '--pill-neutral-fg': '#475569', '--pill-neutral-border': '#e2e8f0',
      '--pill-info-bg': '#e0f2fe',    '--pill-info-fg': '#0c4a6e',    '--pill-info-border': '#bae6fd',
      '--pill-success-bg': '#dcfce7', '--pill-success-fg': '#166534', '--pill-success-border': '#bbf7d0',
      '--pill-warning-bg': '#fef9c3', '--pill-warning-fg': '#854d0e', '--pill-warning-border': '#fef08a',
      '--pill-danger-bg': '#ffe4e6',  '--pill-danger-fg': '#9f1239',  '--pill-danger-border': '#fecdd3',
      '--pill-accent-bg': '#fae8ff',  '--pill-accent-fg': '#6b21a8',  '--pill-accent-border': '#f5d0fe',
    },
    monochrome: {
      '--pill-neutral-bg': '#f1f5f9', '--pill-neutral-fg': '#0f172a', '--pill-neutral-border': '#cbd5e1',
      '--pill-info-bg': '#e2e8f0',    '--pill-info-fg': '#0f172a',    '--pill-info-border': '#cbd5e1',
      '--pill-success-bg': '#cbd5e1', '--pill-success-fg': '#0f172a', '--pill-success-border': '#94a3b8',
      '--pill-warning-bg': '#94a3b8', '--pill-warning-fg': '#f8fafc', '--pill-warning-border': '#64748b',
      '--pill-danger-bg': '#475569',  '--pill-danger-fg': '#f8fafc',  '--pill-danger-border': '#334155',
      '--pill-accent-bg': '#1e293b',  '--pill-accent-fg': '#f8fafc',  '--pill-accent-border': '#0f172a',
    },
  };
  return map[p] as React.CSSProperties;
}

/* satisfy unused-name linter for type alias used in props only */
export type { PrimaryName };
