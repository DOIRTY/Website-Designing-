# Studio Craft

A production-ready, responsive single-page showcase for a web design agency — dark
glassmorphism, gradient accents, and three genuinely interactive tools (work case
studies, a job board with an application drawer, and a live project estimator).

Built with **React 19 + TypeScript + Tailwind CSS v4 + Vite**, with **Lucide React**
icons.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle to dist/
npm run preview  # serve the production build
```

## Design system

All tokens live in one place — `@theme` in `src/index.css` (Tailwind v4's CSS-first
config) — so there is no `tailwind.config.js` to keep in sync.

| Token | Value | Used for |
| --- | --- | --- |
| `--color-obsidian` | `#09090B` | page background |
| `--color-obsidian-card` / `--obsidian-raised` | `#101014` / `#0C0C10` | card + drawer surfaces |
| `--color-line` / `--color-line-strong` | `#27272A` / `#3F3F46` | hairline borders |
| `--color-violet-brand` | `#8B5CF6` | primary accent |
| `--color-cyan-brand` | `#06B6D4` | secondary accent / metrics |
| `--color-ink` / `--ink-muted` / `--ink-subtle` | `#FAFAFA` / `#A1A1AA` / `#71717A` | text (all AA+ on obsidian) |

Custom utilities (`src/index.css`): `text-gradient`, `bg-brand-gradient`, `glass`,
`grid-lines`, `noise` and the `.gradient-border` hover component.

## Structure

```
src/
├─ App.tsx                 section composition
├─ index.css               design tokens + base + custom utilities
├─ components/
│  ├─ Navbar.tsx           sticky nav, scroll-spy, mobile sheet
│  ├─ Hero.tsx             headline + interactive portfolio/talent toggle
│  ├─ Marquee.tsx          seamless client logo loop
│  ├─ Services.tsx         capability cards
│  ├─ Work.tsx             bento grid + case-study drawer
│  ├─ JobBoard.tsx         filter tabs + role cards
│  ├─ ApplyDrawer.tsx      application form with resume drop-zone
│  ├─ Estimator.tsx        3-step calculator with animated total
│  ├─ Pricing.tsx          retainer tiers, monthly/annual
│  ├─ About.tsx            studio blurb + stats + values
│  ├─ Testimonials.tsx     quote cards + trust badges
│  ├─ Footer.tsx           newsletter, socials, system status
│  ├─ BackgroundFX.tsx     grid, orbs, grain, vignette
│  ├─ ProjectArt.tsx       generated SVG case-study artwork
│  └─ ui/                  Button, Primitives, Drawer, Field, Toast, BrandIcons
├─ data/                   content + the pure pricing function
├─ hooks/                  useInView, useUi (scroll spy, focus trap, scroll lock)
└─ lib/cn.ts               class joiner
```

## Interaction details

- **Hero toggle** — a `radiogroup` with arrow-key support; swapping it changes the CTA,
  the live preview panel and the copy.
- **Work bento** — the first card spans 2×2; every card opens a case-study drawer on
  click or <kbd>Enter</kbd>, with a hover overlay for the "Live preview" affordance.
- **Job board** — real `tablist`/`tab`/`tabpanel` semantics with arrow-key navigation
  and per-category counts.
- **Apply drawer** — validation on blur and submit, drag-and-drop or click-to-browse
  resume upload (PDF/DOC/DOCX, ≤5 MB) with type and size errors, then a success state.
- **Estimator** — pure `calculateEstimate()` in `src/data/estimator.ts`, so pricing is
  testable and independent of the UI; the total counts up on every change.
- **Drawers** — focus trapped, <kbd>Esc</kbd> to close, body scroll locked, focus
  restored to the trigger on close.

## Accessibility (WCAG 2.2)

Semantic landmarks and headings · skip link · visible focus rings on every interactive
element · `aria-pressed` / `aria-checked` / `aria-selected` / `aria-current` on all
stateful controls · labelled form fields with `aria-describedby` error wiring and
`aria-invalid` · `aria-live` on the estimate total and toasts · every icon decorative
(`aria-hidden`) with text or `aria-label` alongside · 44px minimum touch targets ·
6:1+ body-text contrast · full `prefers-reduced-motion` path · mobile-first layouts from
360px to 3-column desktop grids.
