/**
 * Validates translation files against content/i18n/en.json.
 *
 *   npm run i18n:check            → checks every content/i18n/*.json
 *   npm run i18n:check -- de fr   → checks only those languages
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(__dirname, '../content/i18n');
const en = JSON.parse(readFileSync(resolve(dir, 'en.json'), 'utf8'));

const codes = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(dir)
      .filter((f) => f.endsWith('.json') && f !== 'en.json')
      .map((f) => f.replace(/\.json$/, ''));

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/g;
const KEY_NUMBERS = /\b(150|365|24|26|10)\b/g;

let failed = false;

for (const code of codes) {
  const errors: string[] = [];
  const warnings: string[] = [];
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(resolve(dir, `${code}.json`), 'utf8').replace(/^﻿/, ''));
  } catch (e) {
    console.log(`✗ ${code}: cannot read/parse (${(e as Error).message})`);
    failed = true;
    continue;
  }

  const walk = (a: unknown, b: unknown, path: string) => {
    if (typeof a === 'string') {
      if (typeof b !== 'string') return errors.push(`${path}: expected string`);
      if (!b.trim()) errors.push(`${path}: empty`);
      if (/[—–]/.test(b)) errors.push(`${path}: contains an em/en dash`);
      for (const m of a.match(EMAIL) ?? []) if (!b.includes(m)) errors.push(`${path}: email "${m}" missing`);
      for (const m of a.match(KEY_NUMBERS) ?? []) if (!b.includes(m)) warnings.push(`${path}: number "${m}" missing`);
      return;
    }
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) return errors.push(`${path}: expected array`);
      if (a.length !== b.length) errors.push(`${path}: expected ${a.length} items, got ${b.length}`);
      a.forEach((v, i) => walk(v, b[i], `${path}[${i}]`));
      return;
    }
    if (a && typeof a === 'object') {
      if (!b || typeof b !== 'object' || Array.isArray(b)) return errors.push(`${path}: expected object`);
      const bo = b as Record<string, unknown>;
      for (const k of Object.keys(a)) {
        if (!(k in bo)) errors.push(`${path}.${k}: missing`);
        else walk((a as Record<string, unknown>)[k], bo[k], path ? `${path}.${k}` : k);
      }
      for (const k of Object.keys(bo)) if (!(k in (a as object))) errors.push(`${path}.${k}: unexpected key`);
    }
  };

  walk(en, data, '');

  if (errors.length) {
    failed = true;
    console.log(`✗ ${code}: ${errors.length} error(s)`);
    errors.slice(0, 30).forEach((e) => console.log(`   ${e}`));
  } else {
    console.log(`✓ ${code}${warnings.length ? ` (${warnings.length} warning(s))` : ''}`);
  }
  warnings.slice(0, 15).forEach((w) => console.log(`   ⚠ ${w}`));
}

process.exit(failed ? 1 : 0);
