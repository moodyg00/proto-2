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

export type ModeName = 'light' | 'dark';

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

export type SurfacePresetName = 'pure' | 'slate' | 'cream' | 'ocean';
export type SurfaceToken = 'lightBackground' | 'lightSurface' | 'darkBackground' | 'darkSurface';

export const PALETTE_PRESETS: { name: PaletteName; label: string; description: string }[] = [
  { name: 'default',    label: 'Default',    description: 'Tailwind weights with saturated semantics.' },
  { name: 'vivid',      label: 'Vivid',      description: 'High-saturation neons for emphasis.' },
  { name: 'pastel',     label: 'Pastel',     description: 'Soft tints for calmer surfaces.' },
  { name: 'monochrome', label: 'Monochrome', description: 'Slate gradient, single accent.' },
];

export const SURFACE_PRESETS: Array<{
  name: SurfacePresetName;
  label: string;
  description: string;
  lightBackground: string;
  lightSurface: string;
  darkBackground: string;
  darkSurface: string;
}> = [
  {
    name: 'pure',
    label: 'Pure',
    description: 'White-white and black-black with crisp contrast.',
    lightBackground: '#ffffff',
    lightSurface: '#f8fafc',
    darkBackground: '#000000',
    darkSurface: '#0f172a',
  },
  {
    name: 'slate',
    label: 'Slate',
    description: 'Cool neutral surfaces with a slightly grayer light mode.',
    lightBackground: '#f8fafc',
    lightSurface: '#eef2f7',
    darkBackground: '#020617',
    darkSurface: '#111827',
  },
  {
    name: 'cream',
    label: 'Cream',
    description: 'Warm editorial light mode with a mossy dark base.',
    lightBackground: '#fffdf7',
    lightSurface: '#f7f1e6',
    darkBackground: '#0b0f0c',
    darkSurface: '#16211b',
  },
  {
    name: 'ocean',
    label: 'Ocean',
    description: 'Cool sea-glass light mode with deep teal dark surfaces.',
    lightBackground: '#f5fbfb',
    lightSurface: '#e6f1f2',
    darkBackground: '#081214',
    darkSurface: '#102126',
  },
];

export interface ThemeState {
  mode: ModeName;
  primary: PrimaryName;
  primaryHex: string | null;
  palette: PaletteName;
  surfacePreset: SurfacePresetName | 'custom';
  lightBackground: string;
  lightSurface: string;
  darkBackground: string;
  darkSurface: string;
}

const DEFAULT_THEME: ThemeState = {
  mode: 'light',
  primary: 'slate',
  primaryHex: null,
  palette: 'default',
  surfacePreset: 'pure',
  lightBackground: '#ffffff',
  lightSurface: '#f8fafc',
  darkBackground: '#000000',
  darkSurface: '#0f172a',
};

const STORAGE_KEY = 'proto2.theme';

interface ThemeContextValue extends ThemeState {
  setMode: (next: ModeName) => void;
  setPrimary: (next: PrimaryName) => void;
  setPrimaryHex: (hex: string | null) => void;
  setPalette: (next: PaletteName) => void;
  setSurfaceToken: (token: SurfaceToken, value: string) => void;
  applySurfacePreset: (preset: SurfacePresetName) => void;
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
      mode: parsed.mode === 'dark' ? 'dark' : DEFAULT_THEME.mode,
      primary: (parsed.primary as PrimaryName) ?? DEFAULT_THEME.primary,
      primaryHex: typeof parsed.primaryHex === 'string' ? parsed.primaryHex : null,
      palette: (parsed.palette as PaletteName) ?? DEFAULT_THEME.palette,
      surfacePreset:
        parsed.surfacePreset === 'pure' ||
        parsed.surfacePreset === 'slate' ||
        parsed.surfacePreset === 'cream' ||
        parsed.surfacePreset === 'ocean' ||
        parsed.surfacePreset === 'custom'
          ? parsed.surfacePreset
          : DEFAULT_THEME.surfacePreset,
      lightBackground: typeof parsed.lightBackground === 'string' ? parsed.lightBackground : DEFAULT_THEME.lightBackground,
      lightSurface: typeof parsed.lightSurface === 'string' ? parsed.lightSurface : DEFAULT_THEME.lightSurface,
      darkBackground: typeof parsed.darkBackground === 'string' ? parsed.darkBackground : DEFAULT_THEME.darkBackground,
      darkSurface: typeof parsed.darkSurface === 'string' ? parsed.darkSurface : DEFAULT_THEME.darkSurface,
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
  html.classList.toggle('dark', state.mode === 'dark');
  html.setAttribute('data-primary', state.primary);
  html.setAttribute('data-palette', state.palette);
  html.setAttribute('data-surface-preset', state.surfacePreset);
  html.style.setProperty('--light-background', state.lightBackground);
  html.style.setProperty('--light-surface', state.lightSurface);
  html.style.setProperty('--dark-background', state.darkBackground);
  html.style.setProperty('--dark-surface', state.darkSurface);

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

  const setMode = useCallback((next: ModeName) => {
    setState((s) => ({ ...s, mode: next }));
  }, []);

  const setPrimary = useCallback((next: PrimaryName) => {
    setState((s) => ({ ...s, primary: next, primaryHex: null }));
  }, []);
  const setPrimaryHex = useCallback((hex: string | null) => {
    setState((s) => ({ ...s, primaryHex: hex }));
  }, []);
  const setPalette = useCallback((next: PaletteName) => {
    setState((s) => ({ ...s, palette: next }));
  }, []);
  const setSurfaceToken = useCallback((token: SurfaceToken, value: string) => {
    setState((s) => ({ ...s, [token]: value, surfacePreset: 'custom' }));
  }, []);
  const applySurfacePreset = useCallback((preset: SurfacePresetName) => {
    const next = SURFACE_PRESETS.find((item) => item.name === preset);
    if (!next) return;
    setState((s) => ({
      ...s,
      surfacePreset: next.name,
      lightBackground: next.lightBackground,
      lightSurface: next.lightSurface,
      darkBackground: next.darkBackground,
      darkSurface: next.darkSurface,
    }));
  }, []);
  const reset = useCallback(() => setState(DEFAULT_THEME), []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      ...state,
      setMode,
      setPrimary,
      setPrimaryHex,
      setPalette,
      setSurfaceToken,
      applySurfacePreset,
      reset,
    }),
    [state, setMode, setPrimary, setPrimaryHex, setPalette, setSurfaceToken, applySurfacePreset, reset]
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
    html.classList.toggle('dark', t.mode === 'dark');
    if (t.primary) html.setAttribute('data-primary', t.primary);
    if (t.palette) html.setAttribute('data-palette', t.palette);
    if (t.surfacePreset) html.setAttribute('data-surface-preset', t.surfacePreset);
    if (t.lightBackground) html.style.setProperty('--light-background', t.lightBackground);
    if (t.lightSurface) html.style.setProperty('--light-surface', t.lightSurface);
    if (t.darkBackground) html.style.setProperty('--dark-background', t.darkBackground);
    if (t.darkSurface) html.style.setProperty('--dark-surface', t.darkSurface);
    if (t.primaryHex) {
      html.style.setProperty('--primary', t.primaryHex);
      html.style.setProperty('--ring', t.primaryHex);
    }
  } catch (_) {}
})();
`.trim();