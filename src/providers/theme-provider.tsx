'use client';

/**
 * ThemeProvider
 *
 * Two independent theme dimensions:
 *   - primary color scheme:  named preset OR custom hex
 *       Stored as { primary: 'violet' | 'indigo' | ..., primaryHex?: '#aabbcc' }
 *   - palette:              named pill/badge palette
 *       Stored as { palette: 'default' | 'vivid' | 'pastel' | 'monochrome' }
 *
 * Persistence strategy:
 *   - First paint reads localStorage to avoid a flash of default theme.
 *   - Updates are written to localStorage immediately.
 *   - When wired to Prisma later, server-side data is hydrated through the
 *     `initial` prop in <ThemeProvider initial={...}> so SSR matches client.
 *
 * Application strategy:
 *   - Sets `data-primary` on <html> for named presets.
 *   - Sets inline CSS variables on <html> when a custom hex is used so the
 *     custom value overrides the named preset.
 *   - Sets `data-palette` on <html> for the secondary palette.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type PrimaryName =
  | 'violet'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'slate';

export const PRIMARY_PRESETS: { name: PrimaryName; label: string; hex: string; soft: string }[] = [
  { name: 'violet',  label: 'Violet',  hex: '#7c3aed', soft: '#ede9fe' },
  { name: 'indigo',  label: 'Indigo',  hex: '#4f46e5', soft: '#e0e7ff' },
  { name: 'blue',    label: 'Blue',    hex: '#2563eb', soft: '#dbeafe' },
  { name: 'cyan',    label: 'Cyan',    hex: '#0891b2', soft: '#cffafe' },
  { name: 'emerald', label: 'Emerald', hex: '#059669', soft: '#d1fae5' },
  { name: 'amber',   label: 'Amber',   hex: '#d97706', soft: '#fef3c7' },
  { name: 'rose',    label: 'Rose',    hex: '#e11d48', soft: '#ffe4e6' },
  { name: 'slate',   label: 'Slate',   hex: '#0f172a', soft: '#e2e8f0' },
];

export type PaletteName = 'default' | 'vivid' | 'pastel' | 'monochrome';

export const PALETTE_PRESETS: { name: PaletteName; label: string; description: string }[] = [
  { name: 'default',    label: 'Default',    description: 'Tailwind weights with saturated semantics.' },
  { name: 'vivid',      label: 'Vivid',      description: 'High-saturation neons for emphasis.' },
  { name: 'pastel',     label: 'Pastel',     description: 'Soft tints for calmer surfaces.' },
  { name: 'monochrome', label: 'Monochrome', description: 'Slate gradient, single accent.' },
];

export interface ThemeState {
  primary: PrimaryName;
  primaryHex: string | null;
  palette: PaletteName;
}

const DEFAULT_THEME: ThemeState = {
  primary: 'slate',
  primaryHex: null,
  palette: 'monochrome',
};

const STORAGE_KEY = 'proto2.theme';

interface ThemeContextValue extends ThemeState {
  setPrimary: (next: PrimaryName) => void;
  setPrimaryHex: (hex: string | null) => void;
  setPalette: (next: PaletteName) => void;
  reset: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStored(): ThemeState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ThemeState>;
    return {
      primary: (parsed.primary as PrimaryName) ?? DEFAULT_THEME.primary,
      primaryHex: typeof parsed.primaryHex === 'string' ? parsed.primaryHex : null,
      palette: (parsed.palette as PaletteName) ?? DEFAULT_THEME.palette,
    };
  } catch {
    return null;
  }
}

function softenHex(hex: string, alpha = 0.15): string {
  // Build an rgba "soft" backdrop from any hex.
  const v = hex.replace('#', '');
  if (v.length !== 6) return hex;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyToDom(state: ThemeState) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  html.setAttribute('data-primary', state.primary);
  html.setAttribute('data-palette', state.palette);

  // Custom hex wins over named preset.
  if (state.primaryHex) {
    html.style.setProperty('--primary', state.primaryHex);
    html.style.setProperty('--primary-soft', softenHex(state.primaryHex, 0.18));
    html.style.setProperty('--ring', state.primaryHex);
  } else {
    html.style.removeProperty('--primary');
    html.style.removeProperty('--primary-soft');
    html.style.removeProperty('--ring');
  }
}

interface ProviderProps {
  initial?: Partial<ThemeState>;
  children: React.ReactNode;
}

export function ThemeProvider({ initial, children }: ProviderProps) {
  const [state, setState] = useState<ThemeState>(() => {
    const stored = readStored();
    return {
      ...DEFAULT_THEME,
      ...(initial ?? {}),
      ...(stored ?? {}),
    };
  });

  useEffect(() => {
    applyToDom(state);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  const setPrimary = useCallback((next: PrimaryName) => {
    setState((s) => ({ ...s, primary: next, primaryHex: null }));
  }, []);
  const setPrimaryHex = useCallback((hex: string | null) => {
    setState((s) => ({ ...s, primaryHex: hex }));
  }, []);
  const setPalette = useCallback((next: PaletteName) => {
    setState((s) => ({ ...s, palette: next }));
  }, []);
  const reset = useCallback(() => setState(DEFAULT_THEME), []);

  const value = useMemo<ThemeContextValue>(
    () => ({ ...state, setPrimary, setPrimaryHex, setPalette, reset }),
    [state, setPrimary, setPrimaryHex, setPalette, reset]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

/**
 * First-paint script. Inlined as a string into <head> via Next's
 * dangerouslySetInnerHTML so the user never sees a flash of the default
 * theme on initial load.
 */
export const themeBootstrapScript = `
(function () {
  try {
    var raw = localStorage.getItem('${STORAGE_KEY}');
    if (!raw) return;
    var t = JSON.parse(raw);
    var html = document.documentElement;
    if (t.primary) html.setAttribute('data-primary', t.primary);
    if (t.palette) html.setAttribute('data-palette', t.palette);
    if (t.primaryHex) {
      html.style.setProperty('--primary', t.primaryHex);
      html.style.setProperty('--ring', t.primaryHex);
    }
  } catch (_) {}
})();
`.trim();