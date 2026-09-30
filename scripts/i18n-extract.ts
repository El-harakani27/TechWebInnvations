/**
 * Extracts every translatable string from content/site.ts into content/i18n/en.json.
 * Translators (human or AI) translate that file into content/i18n/<code>.json with the same shape.
 *
 *   npm run i18n:extract
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { site } from '../content/site';

// Paths that must never be translated (emails, phones, addresses, company names, links, codes…)
const EXCLUDE: RegExp[] = [
  /^brand(\.|$)/,
  /^languages(\.|$)/,
  /^hero\.codeWindow(\.|$)/,
  /^meta\.url$/,
  /\.href$/,
  /^contact\.email$/,
  /^footer\.(email|copyright)$/,
  /^legal\.(email|phone|company|address|representedBy|registrationNumber|responsibleForContent)(\.|$)/,
  /^locations\.items\.\d+\.(flag|company|countryCode|timeZone|coords)(\.|$)/,
  /^process\.steps\.\d+\.number$/,
  /^stats\.\d+\.suffix$/,
];

type Json = string | Json[] | { [k: string]: Json };

function extract(value: unknown, path: string): Json | undefined {
  if (path && EXCLUDE.some((re) => re.test(path))) return undefined;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const out = value.map((v, i) => extract(v, `${path}.${i}`) ?? {});
    return out.some((v) => !(typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0)) ? out : undefined;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(value)) {
      const r = extract(v, path ? `${path}.${k}` : k);
      if (r !== undefined) out[k] = r;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return undefined; // numbers, booleans
}

const file = resolve(__dirname, '../content/i18n/en.json');
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, `${JSON.stringify(extract(site, ''), null, 2)}\n`, 'utf8');
console.log(`Wrote ${file}`);
