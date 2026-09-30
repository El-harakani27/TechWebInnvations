# Agent notes — TechWebInnovations site

Guidance for anyone (human or AI) building sections of this site.

## Mobile layout preference

**On mobile (below 768px), align everything to the center.**

- Headings, subtitles, paragraphs, labels/eyebrows: `text-align: center`.
- Button rows, tag/chip rows, pill lists: `justify-content: center`.
- Constrained text blocks (e.g. `max-width` paragraphs): center them with `margin-left/right: auto`.
- Rows with a trailing control (e.g. an accordion `+` toggle): center the label, pin the control to the right edge.
- From 768px up, sections may switch back to their left-aligned / row layouts.

Write CSS mobile-first: centered by default, then reset alignment inside the `min-width` media queries.

## Project conventions

- **Stack:** Next.js 14 (App Router) + TypeScript, plain CSS Modules (no Tailwind), `motion` for animation, `lucide-react` icons.
- **Copy:** all site text lives in `content/site.ts` (extracted from techwebinnovations.com) — import from there instead of hard-coding text.
- **Font:** Inter (300/400/500/600) via `next/font`.
- **Palette** (CSS variables in `app/globals.css`): ink `#10141c`, black `#0a0d12`, white, paper `#f6f8fb`, pill `#f4f4f6`, blue `#4da3ff`, blue-soft `#8cc4ff`, blue-deep `#1e7fe0`. Mostly black & white, with brand blue as a small accent.
- **Motion easing:** `[0.16, 1, 0.3, 1]` (expo-out) for entrances.
- **Breakpoints:** 768px (tablet/desktop layout), 1024px (wide desktop layouts such as the services accordion).
