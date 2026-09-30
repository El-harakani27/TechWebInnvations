'use client';

/**
 * Tiny i18n layer.
 * - English lives in content/site.ts (the source of truth).
 * - Each other language is a JSON file with the same shape as en.json (see scripts/i18n-extract.ts),
 *   loaded on demand and deep-merged over the English site object.
 * - The chosen language is remembered in localStorage and shared by every component via useSyncExternalStore.
 */

import { useMemo, useSyncExternalStore } from 'react';
import { site } from '@/content/site';

export type Site = typeof site;
export type LangCode = (typeof site.languages)[number]['code'];

const STORAGE_KEY = 'twi-lang';
const DEFAULT_LANG: LangCode = 'en';

type Overrides = Record<string, unknown>;
const loaded: Partial<Record<LangCode, Overrides>> = { en: {} };
const listeners = new Set<() => void>();
let current: LangCode = DEFAULT_LANG;

const isLang = (v: unknown): v is LangCode => site.languages.some((l) => l.code === v);

/** Deep-merge translated strings over the English object; arrays merge item by item. */
function merge<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (typeof base === 'string') return (typeof over === 'string' && over ? over : base) as T;
  if (Array.isArray(base)) {
    const o = Array.isArray(over) ? over : [];
    return base.map((b, i) => merge(b, o[i])) as T;
  }
  if (base && typeof base === 'object') {
    const o = (typeof over === 'object' ? over : {}) as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(base)) out[k] = merge(v, o[k]);
    return out as T;
  }
  return base;
}

async function load(code: LangCode): Promise<Overrides> {
  if (loaded[code]) return loaded[code]!;
  const mod = await import(`./${code}.json`);
  loaded[code] = (mod.default ?? mod) as Overrides;
  return loaded[code]!;
}

function applyDocument(code: LangCode) {
  const meta = site.languages.find((l) => l.code === code);
  document.documentElement.lang = code;
  document.documentElement.dir = meta && 'dir' in meta ? meta.dir : 'ltr';
}

export async function setLanguage(code: LangCode) {
  try {
    await load(code);
  } catch {
    // Translation file missing: stay on the current language
    return;
  }
  current = code;
  applyDocument(code);
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* storage unavailable (private mode) — the choice just won't persist */
  }
  listeners.forEach((l) => l());
}

// Restore the saved choice once on the client
let restored = false;
function restore() {
  if (restored || typeof window === 'undefined') return;
  restored = true;
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  if (isLang(saved) && saved !== DEFAULT_LANG) void setLanguage(saved);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  restore();
  return () => listeners.delete(cb);
}

export function useLanguage(): LangCode {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => DEFAULT_LANG,
  );
}

/** The site content in the active language (English on the server and until a translation loads). */
export function useSite(): Site {
  const lang = useLanguage();
  return useMemo(() => merge(site, loaded[lang]), [lang]);
}
