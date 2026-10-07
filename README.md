# StyleCraft Studio

A single-page interactive showcase site for a fictional web design agency, built with
**pure HTML5, CSS3 and vanilla JavaScript** — no frameworks, no build step, no dependencies.

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## What's in it

**Design token playground** (the "Design Studio" panel — click the wand FAB, the `Studio`
button in the nav, or press <kbd>Shift</kbd> + <kbd>D</kbd>):

- **4 theme modes** — Dark Modern, Light Clean, Neo-Brutalism, Cyberpunk
- **4 accent colours** — Cyan, Electric Violet, Emerald, Sunset Orange
- **3 radius scales** — Sharp (0px), Rounded (12px), Pill (24px)

Every token lives in a CSS custom property on `<html>`, so changing one re-skins the
entire page — buttons, cards, form inputs, the app mockup, the UI kit — in real time.
A `.theming` class is applied briefly during a change so the whole UI morphs rather than
snapping. Choices persist in `localStorage`.

**Sections**

- **Hero** — animated badge, staggered word reveal, rotating subhead, CTA pair, and a live
  app-window mockup that tilts toward the cursor.
- **Work grid** — 6 case studies with generated SVG artwork, filterable by category;
  "View Case Study" opens a full modal (challenge / approach / outcome / metrics /
  deliverables / palette).
- **UI kit** — tabbed showcase of buttons, tags, inputs, switches, checkboxes, radios,
  sliders and surface cards, all driven by the same live tokens.
- **Process** — four phases plus animated counters.
- **Contact** — custom-styled form with blur-validation, shake-on-error, a budget pill
  group, character counter, loading state and a success panel. A quick-brief modal
  shares the same validation engine.

**Everywhere** — smooth-scroll navigation with scroll-spy, scroll progress bar,
`IntersectionObserver` reveals, toast notifications, keyboard support
(<kbd>Esc</kbd> closes overlays, arrows move through kit tabs), focus trapping in
modals, full mobile-responsive layout down to 360px, and a
`prefers-reduced-motion` path that disables animation.

## Structure

```
index.html              markup + inline SVG artwork placeholders
assets/css/styles.css   token architecture, themes, components, responsive
assets/js/main.js       token engine, work grid, modals, validation, toasts
```

### Token architecture

```
<html data-theme="dark-modern" data-accent="cyan" data-radius="rounded">
```

| Token group | Set by | Example |
|---|---|---|
| `--bg`, `--surface`, `--text`, `--shadow-*`, `--glass-blur`, `--bw` | `[data-theme]` | surface colour, blur, border width |
| `--accent-h/s/l`, `--accent`, `--accent-2`, `--accent-soft` | `[data-accent]` | every accent surface |
| `--r-xs` … `--r-xl`, `--r-full` | `[data-radius]` | corner radii everywhere |

Themes can also bias the accent (`--accent-l-mod` darkens it in Light Clean for contrast)
and its gradient partner (`--accent-2-shift` gives Cyberpunk a magenta pairing).
