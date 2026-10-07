/* ==========================================================================
   StyleCraft Studio — main.js
   Vanilla JS. No build step, no dependencies.
   --------------------------------------------------------------------------
   1.  Utilities
   2.  Design token engine (theme / accent / radius)
   3.  Studio panel (the token playground UI)
   4.  Navigation & smooth scroll
   5.  Scroll progress + reveal + counters
   6.  Hero (rotator, spotlight, tilt)
   7.  Work grid & filters
   8.  Case study modal
   9.  UI kit interactions
   10. Contact forms + validation
   11. Toasts
   ========================================================================== */
(function () {
  "use strict";

  /* ========================= 1. UTILITIES ========================= */
  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  /** Safe media-query check (matchMedia is missing in some embedded runtimes). */
  const mq = (query) =>
    (typeof window.matchMedia === "function" ? window.matchMedia(query) : { matches: false }).matches;

  const prefersReduced = mq("(prefers-reduced-motion: reduce)");
  const canHover = () => mq("(hover: hover)");

  /** scrollIntoView is missing in a few embedded webviews — fail softly. */
  const scrollToEl = (el, block) => {
    if (!el) return;
    if (typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: block || "start" });
    } else if (el.getBoundingClientRect) {
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 96);
    }
  };

  /* ========================= 2. TOKEN ENGINE ========================= */
  const STORE_KEY = "scs.tokens.v1";

  const DEFAULTS = { theme: "dark-modern", accent: "cyan", radius: "rounded" };

  const THEME_META = {
    "dark-modern":   { label: "Dark Modern",   surface: "glass · 18px", color: "#06080f" },
    "light-clean":   { label: "Light Clean",   surface: "glass · 16px", color: "#f6f7fb" },
    "neo-brutalism": { label: "Neo-Brutalism", surface: "solid · 0px",  color: "#fdf6e3" },
    "cyberpunk":     { label: "Cyberpunk",     surface: "glass · 14px", color: "#06020f" }
  };

  const ACCENT_META = {
    cyan:    { label: "Cyan",            hsl: "187 92% 52%" },
    violet:  { label: "Electric Violet", hsl: "262 92% 66%" },
    emerald: { label: "Emerald",         hsl: "158 84% 44%" },
    sunset:  { label: "Sunset Orange",   hsl: "18 96% 56%" }
  };

  const RADIUS_META = {
    sharp:   { label: "Sharp",   value: "0px"  },
    rounded: { label: "Rounded", value: "12px" },
    pill:    { label: "Pill",    value: "24px" }
  };

  const root = document.documentElement;
  let morphTimer = null;

  function readStored() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      return {
        theme:  THEME_META[parsed.theme]  ? parsed.theme  : DEFAULTS.theme,
        accent: ACCENT_META[parsed.accent] ? parsed.accent : DEFAULTS.accent,
        radius: RADIUS_META[parsed.radius] ? parsed.radius : DEFAULTS.radius
      };
    } catch (e) { return null; }
  }

  function persist(tokens) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(tokens)); } catch (e) { /* private mode */ }
  }

  /** Briefly enable a global colour/radius transition so the whole UI morphs. */
  function morph() {
    if (prefersReduced) return;
    root.classList.add("theming");
    clearTimeout(morphTimer);
    morphTimer = setTimeout(() => root.classList.remove("theming"), 520);
  }

  function syncRadiusLabels() {
    const value = (getComputedStyle(root).getPropertyValue("--r-md") || "12px").trim();
    $$("[data-token-radius]").forEach((el) => { el.textContent = value; });
  }

  function syncTokenReadout() {
    const theme  = root.dataset.theme;
    const accent = root.dataset.accent;
    const radius = root.dataset.radius;

    const set = (id, text) => { const el = $(id); if (el) el.textContent = text; };
    set("#tokAccent", "hsl(" + ACCENT_META[accent].hsl + ")");
    set("#tokRadius", RADIUS_META[radius].value);
    set("#tokSurface", THEME_META[theme].surface);
    set("#tokTheme", theme);

    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_META[theme].color);
  }

  function syncStudioControls() {
    const { theme, accent, radius } = root.dataset;

    $$("[data-theme-value]").forEach((btn) => {
      const on = btn.dataset.themeValue === theme;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-checked", String(on));
    });
    $$("[data-accent-value]").forEach((btn) => {
      const on = btn.dataset.accentValue === accent;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-checked", String(on));
    });
    $$("[data-radius-value]").forEach((btn) => {
      const on = btn.dataset.radiusValue === radius;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-checked", String(on));
    });
  }

  /**
   * Apply one or more tokens.
   * @param {Partial<{theme:string, accent:string, radius:string}>} patch
   * @param {{announce?: boolean}} [opts]
   */
  function setTokens(patch, opts) {
    const announce = !opts || opts.announce !== false;
    morph();

    if (patch.theme && THEME_META[patch.theme]) root.dataset.theme = patch.theme;
    if (patch.accent && ACCENT_META[patch.accent]) root.dataset.accent = patch.accent;
    if (patch.radius && RADIUS_META[patch.radius]) root.dataset.radius = patch.radius;

    // let the browser paint the new radius before we read it back
    requestAnimationFrame(syncRadiusLabels);
    syncTokenReadout();
    syncStudioControls();
    persist({ theme: root.dataset.theme, accent: root.dataset.accent, radius: root.dataset.radius });

    if (announce && patch.theme) {
      toast("Theme · " + THEME_META[patch.theme].label, "Palette swapped across the page");
    } else if (announce && patch.accent) {
      toast("Accent · " + ACCENT_META[patch.accent].label, "Every accent surface updated");
    } else if (announce && patch.radius) {
      toast("Radius · " + RADIUS_META[patch.radius].value, "Corners re-cut everywhere");
    }
  }

  /* ========================= 3. STUDIO PANEL ========================= */
  const studio = $("#studio");
  const scrim  = $("#scrim");
  let lastFocus = null;

  function isNarrow() { return window.innerWidth < 1080; }

  function openStudio() {
    if (!studio || studio.classList.contains("is-open")) return;
    lastFocus = document.activeElement;
    studio.classList.add("is-open");
    studio.setAttribute("aria-hidden", "false");
    document.body.classList.add("studio-open");
    scrim.hidden = false;
    requestAnimationFrame(() => scrim.classList.add("is-on"));
    if (isNarrow()) document.body.classList.add("is-locked");
    const first = $(".theme-card", studio) || $(".pill", studio);
    if (first) setTimeout(() => first.focus({ preventScroll: true }), 260);
  }

  function closeStudio() {
    if (!studio || !studio.classList.contains("is-open")) return;
    studio.classList.remove("is-open");
    studio.setAttribute("aria-hidden", "true");
    document.body.classList.remove("studio-open");
    scrim.classList.remove("is-on");
    document.body.classList.remove("is-locked");
    setTimeout(() => { if (!studio.classList.contains("is-open")) scrim.hidden = true; }, 350);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function toggleStudio() {
    studio.classList.contains("is-open") ? closeStudio() : openStudio();
  }

  $$("[data-open-playground]").forEach((btn) => btn.addEventListener("click", openStudio));
  $$("[data-close-studio]").forEach((btn) => btn.addEventListener("click", closeStudio));
  if (scrim) scrim.addEventListener("click", closeStudio);

  // Token controls
  $$("[data-theme-value]").forEach((btn) =>
    btn.addEventListener("click", () => setTokens({ theme: btn.dataset.themeValue })));
  $$("[data-accent-value]").forEach((btn) =>
    btn.addEventListener("click", () => setTokens({ accent: btn.dataset.accentValue })));
  $$("[data-radius-value]").forEach((btn) =>
    btn.addEventListener("click", () => setTokens({ radius: btn.dataset.radiusValue })));

  // Surprise me / reset
  const randomBtn = $("#randomBtn");
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      const pick = (obj, exclude) => {
        const keys = Object.keys(obj).filter((k) => k !== exclude);
        return keys[Math.floor(Math.random() * keys.length)];
      };
      setTokens({
        theme:  pick(THEME_META),
        accent: pick(ACCENT_META, root.dataset.accent),
        radius: pick(RADIUS_META)
      }, { announce: false });
      toast("Surprise!", THEME_META[root.dataset.theme].label + " · " +
            ACCENT_META[root.dataset.accent].label + " · " + RADIUS_META[root.dataset.radius].value);
    });
  }

  const resetBtn = $("#resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      setTokens(DEFAULTS, { announce: false });
      toast("Tokens reset", "Back to Dark Modern · Cyan · 12px");
    });
  }

  /* ========================= 4. NAVIGATION ========================= */
  const nav = $("#nav");
  const burger = $("#navBurger");
  const navLinks = $("#navLinks");

  function closeMobileMenu() {
    if (!navLinks) return;
    navLinks.classList.remove("is-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }

  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
  }

  // Smooth scroll for [data-scroll] anchors (also closes menus/modals first)
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-scroll]");
    if (!trigger) return;

    const href = trigger.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    closeMobileMenu();

    const isModalLink = trigger.hasAttribute("data-close-modal");
    const scrollNow = () => {
      scrollToEl(target, "start");
      if (history.pushState) history.pushState(null, "", href);
    };

    if (isModalLink) { closeAllModals(); setTimeout(scrollNow, 260); }
    else scrollNow();
  });

  // Sticky / auto-hide behaviour
  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle("is-stuck", y > 24);
      const goingDown = y > lastY && y > 480;
      nav.classList.toggle("is-hidden", goingDown && !navLinks.classList.contains("is-open"));
    }
    // scroll progress
    const bar = $("#scrollBar");
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? clamp((y / max) * 100, 0, 100) : 0) + "%";
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // Active section link
  const sections = $$("main section[id]");
  const linkMap = {};
  $$(".nav__link").forEach((a) => { linkMap[a.getAttribute("href").slice(1)] = a; });

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$(".nav__link").forEach((a) => a.classList.remove("is-active"));
        const link = linkMap[entry.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ========================= 5. REVEAL + COUNTERS ========================= */
  if ("IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach((el) => revealObs.observe(el));

    const countObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    $$("[data-count]").forEach((el) => countObs.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
    $$("[data-count]").forEach((el) => { el.textContent = el.dataset.count + (el.dataset.suffix || ""); });
  }

  function animateCount(el) {
    const end = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) { el.textContent = end + suffix; return; }

    const duration = 1500;
    const start = performance.now();
    function frame(now) {
      const p = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      el.textContent = Math.round(end * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ========================= 6. HERO ========================= */
  // Word rotator
  const rotator = $("#rotator");
  if (rotator) {
    const items = $$(".rotator__item", rotator);
    let idx = 0;
    if (items.length > 1 && !prefersReduced) {
      setInterval(() => {
        items[idx].classList.remove("is-on");
        idx = (idx + 1) % items.length;
        items[idx].classList.add("is-on");
      }, 2600);
    }
  }

  // Cursor spotlight
  const hero = $(".hero");
  const heroSpot = $("#heroSpot");
  if (hero && heroSpot && !prefersReduced && canHover()) {
    let raf = null;
    hero.addEventListener("pointermove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        heroSpot.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width) * 100 + "%");
        heroSpot.style.setProperty("--my", ((e.clientY - rect.top) / rect.height) * 100 + "%");
        raf = null;
      });
    });
  }

  // Mockup tilt
  const tilt = $("[data-tilt]");
  if (tilt && !prefersReduced && canHover()) {
    tilt.addEventListener("pointermove", (e) => {
      const r = tilt.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform =
        "perspective(1400px) rotateY(" + (px * 5).toFixed(2) + "deg) rotateX(" + (-py * 5).toFixed(2) + "deg) translateY(-4px)";
    });
    tilt.addEventListener("pointerleave", () => { tilt.style.transform = ""; });
  }

  /* ========================= 7. WORK GRID ========================= */
  function art(variant) {
    const w = 'width="100%" height="100%" preserveAspectRatio="xMidYMid slice"';
    const arts = [
      // 0 — fintech app
      `<svg ${w} viewBox="0 0 400 275" fill="none" aria-hidden="true">
        <circle cx="318" cy="52" r="86" fill="#fff" opacity=".07"/>
        <circle cx="318" cy="52" r="52" fill="#fff" opacity=".07"/>
        <rect x="34" y="42" width="128" height="196" rx="22" fill="#000" opacity=".28"/>
        <rect x="34" y="42" width="128" height="196" rx="22" stroke="#fff" stroke-opacity=".22"/>
        <rect x="50" y="64" width="60" height="9" rx="4.5" fill="#fff" opacity=".5"/>
        <rect x="50" y="86" width="96" height="9" rx="4.5" fill="#fff" opacity=".22"/>
        <rect x="50" y="112" width="96" height="62" rx="12" fill="#7ef0ff" opacity=".85"/>
        <rect x="50" y="188" width="44" height="16" rx="8" fill="#fff" opacity=".45"/>
        <rect x="196" y="86" width="160" height="52" rx="14" fill="#fff" opacity=".1"/>
        <rect x="196" y="152" width="160" height="52" rx="14" fill="#fff" opacity=".1"/>
        <rect x="212" y="104" width="60" height="16" rx="8" fill="#fff" opacity=".45"/>
        <rect x="212" y="170" width="88" height="16" rx="8" fill="#fff" opacity=".28"/>
      </svg>`,
      // 1 — commerce brand
      `<svg ${w} viewBox="0 0 400 275" fill="none" aria-hidden="true">
        <circle cx="128" cy="140" r="92" fill="#fff" opacity=".12"/>
        <circle cx="128" cy="140" r="58" fill="#000" opacity=".2"/>
        <path d="M104 118c14-14 34-14 48 0" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>
        <path d="M104 162c14 14 34 14 48 0" stroke="#fff" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>
        <g opacity=".5">${Array.from({ length: 5 }, (_, r) =>
          Array.from({ length: 8 }, (_, c) =>
            `<circle cx="${232 + c * 24}" cy="${64 + r * 30}" r="3.2" fill="#fff" opacity="${0.7 - r * 0.08}"/>`).join("")
        ).join("")}</g>
        <rect x="34" y="212" width="140" height="10" rx="5" fill="#fff" opacity=".3"/>
        <rect x="34" y="232" width="90" height="10" rx="5" fill="#fff" opacity=".18"/>
      </svg>`,
      // 2 — SaaS dashboard
      `<svg ${w} viewBox="0 0 400 275" fill="none" aria-hidden="true">
        <rect x="26" y="34" width="348" height="207" rx="18" fill="#000" opacity=".22"/>
        <rect x="26" y="34" width="348" height="207" rx="18" stroke="#fff" stroke-opacity=".2"/>
        <rect x="26" y="34" width="348" height="34" rx="18" fill="#fff" opacity=".07"/>
        <circle cx="46" cy="51" r="4" fill="#fff" opacity=".6"/>
        <circle cx="60" cy="51" r="4" fill="#fff" opacity=".35"/>
        <circle cx="74" cy="51" r="4" fill="#fff" opacity=".2"/>
        <rect x="44" y="94" width="130" height="60" rx="12" fill="#fff" opacity=".1"/>
        <rect x="188" y="94" width="76" height="60" rx="12" fill="#fff" opacity=".1"/>
        <rect x="278" y="94" width="76" height="60" rx="12" fill="#fff" opacity=".1"/>
        <g fill="#5eead4">
          <rect x="58" y="180" width="16" height="32" rx="5" opacity=".9"/>
          <rect x="84" y="168" width="16" height="44" rx="5" opacity=".75"/>
          <rect x="110" y="184" width="16" height="28" rx="5" opacity=".6"/>
          <rect x="136" y="158" width="16" height="54" rx="5" opacity=".95"/>
        </g>
        <path d="M200 196 L226 178 L252 186 L278 160 L304 168 L330 146" stroke="#a5f3fc" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/>
        <rect x="200" y="146" width="130" height="76" rx="12" fill="#fff" opacity=".06"/>
      </svg>`,
      // 3 — health
      `<svg ${w} viewBox="0 0 400 275" fill="none" aria-hidden="true">
        <circle cx="292" cy="120" r="80" fill="#fff" opacity=".08"/>
        <circle cx="292" cy="120" r="54" fill="#fff" opacity=".08"/>
        <path d="M40 150h44l16-38 22 74 20-52 16 26h64" stroke="#ffd6e8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/>
        <path d="M40 196c40 0 58-22 92-22s52 22 92 22" stroke="#fff" stroke-opacity=".22" stroke-width="3" stroke-linecap="round"/>
        <rect x="40" y="60" width="104" height="12" rx="6" fill="#fff" opacity=".4"/>
        <rect x="40" y="82" width="66" height="12" rx="6" fill="#fff" opacity=".2"/>
        <circle cx="292" cy="120" r="14" fill="#ffd6e8" opacity=".9"/>
      </svg>`,
      // 4 — travel
      `<svg ${w} viewBox="0 0 400 275" fill="none" aria-hidden="true">
        <circle cx="300" cy="70" r="38" fill="#ffd28a" opacity=".9"/>
        <path d="M20 208 L108 118 L164 178 L216 128 L300 208Z" fill="#000" opacity=".28"/>
        <path d="M20 208 L108 118 L164 178 L216 128 L300 208Z" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>
        <path d="M78 158 L108 118 L138 158Z" fill="#fff" opacity=".65"/>
        <path d="M186 162 L216 128 L246 162Z" fill="#fff" opacity=".4"/>
        <path d="M20 236h360" stroke="#fff" stroke-opacity=".22" stroke-width="3" stroke-linecap="round"/>
        <rect x="34" y="46" width="120" height="10" rx="5" fill="#fff" opacity=".35"/>
        <rect x="34" y="66" width="76" height="10" rx="5" fill="#fff" opacity=".2"/>
      </svg>`,
      // 5 — AI
      `<svg ${w} viewBox="0 0 400 275" fill="none" aria-hidden="true">
        <g stroke="#fff" stroke-opacity=".28" stroke-width="1.6">
          <path d="M200 138 L112 84 M200 138 L292 84 M200 138 L112 196 M200 138 L292 196 M112 84 L292 196 M112 196 L292 84 M200 52 L200 224 M112 84 L292 84 M112 196 L292 196"/>
        </g>
        <g fill="#f0abfc">
          <circle cx="200" cy="138" r="15" opacity="1"/>
          <circle cx="112" cy="84" r="9" opacity=".9"/>
          <circle cx="292" cy="84" r="9" opacity=".9"/>
          <circle cx="112" cy="196" r="9" opacity=".9"/>
          <circle cx="292" cy="196" r="9" opacity=".9"/>
          <circle cx="200" cy="52" r="7" opacity=".75"/>
          <circle cx="200" cy="224" r="7" opacity=".75"/>
        </g>
        <circle cx="200" cy="138" r="30" stroke="#f0abfc" stroke-opacity=".5" stroke-width="2"/>
        <circle cx="200" cy="138" r="52" stroke="#22d3ee" stroke-opacity=".28" stroke-width="2"/>
      </svg>`
    ];
    return arts[variant % arts.length];
  }

  const PROJECTS = [
    {
      id: "nova-pay",
      title: "Nova Pay",
      client: "Novabank",
      year: "2026",
      cats: ["product"],
      tags: ["Fintech", "Mobile App", "Design System"],
      desc: "A one-tap payments app that turned a 14-step onboarding flow into four screens.",
      art: 0, pa: "#04283a", pb: "#12356b",
      blurb: "Rebuilding consumer payments around trust, speed and a design system the bank's 40 engineers can actually use.",
      meta: { Role: "Product design + system", Timeline: "18 weeks", Team: "5 people", Platform: "iOS · Android" },
      challenge: "Novabank's onboarding abandoned 61% of applicants at the document-upload step. The flow had grown to fourteen screens across two codebases, and every squad shipped slightly different button styles.",
      approach: "We ran a two-week discovery with the risk team, rebuilt onboarding as a four-screen progressive flow, and shipped a 240-token design system on top of their existing React Native app — migrating screen by screen so releases never stalled.",
      outcome: "Onboarding completion nearly doubled within two months. The token layer is now the single source of truth for web, iOS and Android, and new screens are assembled rather than designed from scratch.",
      metrics: [{ v: "+62%", l: "Onboarding" }, { v: "-41%", l: "Support tickets" }, { v: "4.8★", l: "App store" }],
      deliverables: ["Onboarding flow, 4 screens", "240-token design system", "React Native component library", "Accessibility audit to WCAG AA", "Motion specification"],
      palette: ["#04283a", "#0e7490", "#22d3ee", "#a5f3fc", "#f8fafc"]
    },
    {
      id: "lumen-co",
      title: "Lumen & Co",
      client: "Lumen & Co",
      year: "2025",
      cats: ["brand", "web"],
      tags: ["E-Commerce", "Branding", "Art Direction"],
      desc: "A full rebrand and storefront for a slow-fashion label — editorial first, cart second.",
      art: 1, pa: "#4a2340", pb: "#b1573a",
      blurb: "A slow-fashion label needed a storefront that reads like a magazine and still converts on mobile.",
      meta: { Role: "Brand + web", Timeline: "14 weeks", Team: "4 people", Platform: "Shopify · Headless" },
      challenge: "Beautiful campaign imagery, but a storefront that buried it. Product pages loaded in 6.2s on 4G and the brand voice vanished the moment a shopper hit the cart.",
      approach: "We rebuilt the identity around a warm duotone system and a serif display face, then designed an editorial commerce experience: full-bleed lookbook pages with shoppable hotspots, and a persistent cart that keeps the story on screen.",
      outcome: "Mobile conversion is up 38% and the average order value rose 22% — shoppers now browse three times as many lookbook pages per session.",
      metrics: [{ v: "+38%", l: "Mobile CVR" }, { v: "+22%", l: "Order value" }, { v: "1.4s", l: "LCP" }],
      deliverables: ["Brand identity + guidelines", "Lookbook template system", "Headless storefront build", "Shoppable hotspot component", "Email template kit"],
      palette: ["#4a2340", "#b1573a", "#f2b880", "#fdf6e3", "#1c1917"]
    },
    {
      id: "metricore",
      title: "Metricore",
      client: "Metricore Inc.",
      year: "2026",
      cats: ["product", "web"],
      tags: ["SaaS", "Dashboard", "Data Viz"],
      desc: "A analytics dashboard that makes 40 million rows feel like a conversation, not a spreadsheet.",
      art: 2, pa: "#0a1f2e", pb: "#164e63",
      blurb: "Turning an enterprise analytics tool into something a marketing manager opens before their morning coffee.",
      meta: { Role: "UX · UI · front-end", Timeline: "22 weeks", Team: "6 people", Platform: "Web app" },
      challenge: "Metricore had power and no approachability. Users exported to spreadsheets because building a report in-product took eleven clicks and a support doc.",
      approach: "We introduced a natural-language query bar, a drag-and-drop report builder and a density control that lets analysts switch from comfortable to compact in one click. Every chart shares one grammar so colours mean the same thing everywhere.",
      outcome: "Report creation time dropped by two thirds. Weekly active users grew 74% in a quarter, and export-to-CSV — the metric they dreaded — fell by half.",
      metrics: [{ v: "-67%", l: "Time to report" }, { v: "+74%", l: "Weekly actives" }, { v: "-51%", l: "CSV exports" }],
      deliverables: ["Dashboard information architecture", "Chart grammar + colour scale", "Natural-language query UI", "Report builder", "Front-end implementation"],
      palette: ["#0a1f2e", "#164e63", "#22d3ee", "#5eead4", "#f0fdfa"]
    },
    {
      id: "pulse-health",
      title: "Pulse Health",
      client: "Pulse Health",
      year: "2025",
      cats: ["product"],
      tags: ["Healthcare", "Web App", "Accessibility"],
      desc: "A patient portal designed for 72-year-olds on cracked screens — and passing AA with room to spare.",
      art: 3, pa: "#2b1240", pb: "#7a3b6b",
      blurb: "A patient portal where the average user is 68, on a budget Android phone, often anxious and always in a hurry.",
      meta: { Role: "Research · design", Timeline: "16 weeks", Team: "4 people", Platform: "Responsive web" },
      challenge: "The portal was WCAG-failing on 40 screens, used clinical jargon throughout, and 3 in 10 appointments were rescheduled by phone because patients could not find the booking flow.",
      approach: "We ran home visits with twelve patients, rewrote every string at a grade-six reading level, and rebuilt the interface on a 44px minimum target with a persistent, single-purpose action bar.",
      outcome: "Phone reschedules halved, task success in testing rose from 54% to 91%, and the portal now passes WCAG 2.2 AA — audited and signed off externally.",
      metrics: [{ v: "91%", l: "Task success" }, { v: "-48%", l: "Phone calls" }, { v: "AA", l: "WCAG 2.2" }],
      deliverables: ["Contextual research report", "Plain-language content system", "Accessible component library", "Booking + records flows", "Usability test kit"],
      palette: ["#2b1240", "#7a3b6b", "#ffd6e8", "#fdf2f8", "#1c1917"]
    },
    {
      id: "wanderline",
      title: "Wanderline",
      client: "Wanderline Travel",
      year: "2024",
      cats: ["web", "brand"],
      tags: ["Travel", "Website", "Motion"],
      desc: "An itinerary builder where the planning feels as good as the trip.",
      art: 4, pa: "#062a2a", pb: "#1f7a6b",
      blurb: "A booking site that had to sell the trip before it sold the room — with maps, motion and zero clutter.",
      meta: { Role: "Design + motion", Timeline: "12 weeks", Team: "3 people", Platform: "Web" },
      challenge: "Wanderline sold multi-stop trips through PDF itineraries emailed after a sales call. There was no way to explore a route, and the site looked like every other template.",
      approach: "We designed an interactive route map as the hero of every trip page, paired with a day-by-day timeline that animates as you scroll. Motion is decorative only where it earns attention — everywhere else it is functional feedback.",
      outcome: "Organic sessions grew 3.1× in six months and the average session went from 40 seconds to just under four minutes.",
      metrics: [{ v: "3.1×", l: "Organic traffic" }, { v: "3:52", l: "Avg. session" }, { v: "+29%", l: "Enquiries" }],
      deliverables: ["Trip page template", "Interactive route map", "Scroll-linked motion spec", "Itinerary timeline component", "CMS content model"],
      palette: ["#062a2a", "#1f7a6b", "#ffd28a", "#ecfeff", "#0f172a"]
    },
    {
      id: "synthia-ai",
      title: "Synthia AI",
      client: "Synthia Labs",
      year: "2026",
      cats: ["product", "web"],
      tags: ["AI", "Website", "Prototype"],
      desc: "A launch site and product UI for an AI research assistant — with streaming states designed properly.",
      art: 5, pa: "#170a2e", pb: "#3d1a6b",
      blurb: "An AI assistant where the hard part was not the model — it was designing for latency, uncertainty and being wrong.",
      meta: { Role: "Brand site + product UI", Timeline: "10 weeks", Team: "4 people", Platform: "Web app" },
      challenge: "Streaming responses meant the interface had to feel alive while it was still thinking, and honest when it was guessing. The launch site also had to explain a genuinely novel product in one scroll.",
      approach: "We built a states-first design system: typing, streaming, citing, uncertain, failed — each with its own motion. The marketing site leads with a live, sandboxed demo rather than a hero image.",
      outcome: "The site converts at 7.4% on the demo CTA and the states system was adopted across three other Synthia products.",
      metrics: [{ v: "7.4%", l: "Demo CVR" }, { v: "-33%", l: "Perceived wait" }, { v: "3", l: "Products adopted" }],
      deliverables: ["Launch site + live demo", "Streaming state system", "Citation + uncertainty patterns", "Motion library", "Developer docs theme"],
      palette: ["#170a2e", "#3d1a6b", "#f0abfc", "#22d3ee", "#faf5ff"]
    }
  ];

  const workGrid = $("#workGrid");
  if (workGrid) {
    workGrid.innerHTML = PROJECTS.map((p, i) => `
      <article class="work-card reveal" data-cats="${p.cats.join(" ")}" data-id="${p.id}" style="--pa:${p.pa}; --pb:${p.pb}; animation-delay:${(i % 3) * 80}ms">
        <div class="work-card__thumb">
          ${art(p.art)}
          <span class="work-card__year">${p.year}</span>
        </div>
        <div class="work-card__body">
          <div class="work-card__tags">${p.tags.map((t) => `<span class="tag tag--soft">${t}</span>`).join("")}</div>
          <h3 class="work-card__title">${p.title}</h3>
          <p class="work-card__desc">${p.desc}</p>
          <div class="work-card__foot">
            <span class="work-card__client">${p.client}</span>
            <button class="work-card__btn" type="button" data-case="${p.id}">
              View Case Study <i aria-hidden="true">→</i>
            </button>
          </div>
        </div>
      </article>`).join("");

    // re-observe freshly injected reveal cards
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver((entries, o) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add("is-in"); o.unobserve(entry.target); }
        });
      }, { threshold: 0.12 });
      $$(".work-card", workGrid).forEach((c) => obs.observe(c));
    }

    // Case study buttons
    $$("[data-case]", workGrid).forEach((btn) =>
      btn.addEventListener("click", (e) => { e.stopPropagation(); openCase(btn.dataset.case); }));
  }

  // Filters — counts are derived from PROJECTS so the labels never drift
  $$("[data-filter]").forEach((chip) => {
    const filter = chip.dataset.filter;
    const n = filter === "all"
      ? PROJECTS.length
      : PROJECTS.filter((p) => p.cats.includes(filter)).length;
    const slot = $(".chip__n", chip);
    if (slot) slot.textContent = String(n);
  });

  $$("[data-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      $$("[data-filter]").forEach((c) => {
        const on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      $$(".work-card").forEach((card) => {
        const match = filter === "all" || card.dataset.cats.split(" ").includes(filter);
        card.classList.toggle("is-hidden", !match);
        if (match) {
          card.style.animation = "none";
          void card.offsetWidth;
          card.style.animation = "fadeUp .45s var(--ease) both";
        }
      });
    });
  });

  /* ========================= 8. CASE STUDY MODAL ========================= */
  const caseModal = $("#caseModal");
  let modalReturnFocus = null;

  function openCase(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p || !caseModal) return;

    modalReturnFocus = document.activeElement;
    const artEl = $("#caseArt");
    artEl.style.setProperty("--ma", p.pa);
    artEl.style.setProperty("--mb", p.pb);
    artEl.innerHTML = art(p.art);
    $("#caseTags").innerHTML = p.tags.map((t) =>
      `<span class="tag" style="background:hsl(0 0% 100% / .16); color:#fff; border:1px solid hsl(0 0% 100% / .22)">${t}</span>`).join("");
    $("#caseTitle").textContent = p.title;
    $("#caseBlurb").textContent = p.blurb;
    $("#caseMeta").innerHTML = Object.keys(p.meta).map((k) =>
      `<div><span>${k}</span><b>${p.meta[k]}</b></div>`).join("");
    $("#caseChallenge").textContent = p.challenge;
    $("#caseApproach").textContent = p.approach;
    $("#caseOutcome").textContent = p.outcome;
    $("#caseMetrics").innerHTML = p.metrics.map((m) =>
      `<div><b>${m.v}</b><span>${m.l}</span></div>`).join("");
    $("#caseDeliverables").innerHTML = p.deliverables.map((d) => `<li>${d}</li>`).join("");
    $("#casePalette").innerHTML = p.palette.map((c) => `<i style="background:${c}" title="${c}"></i>`).join("");

    openModal(caseModal);
  }

  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add("is-locked");
    requestAnimationFrame(() => modal.classList.add("is-on"));
    const focusable = modal.querySelector("button, [href], input, select, textarea");
    if (focusable) setTimeout(() => focusable.focus({ preventScroll: true }), 220);
  }

  function closeModal(modal) {
    if (!modal || modal.hidden) return;
    modal.classList.remove("is-on");
    if (!document.querySelector(".modal.is-on")) document.body.classList.remove("is-locked");
    setTimeout(() => {
      if (!modal.classList.contains("is-on")) {
        modal.hidden = true;
        if (modal === caseModal) {
          $("#caseArt").innerHTML = "";
          $("#casePalette").innerHTML = "";
        }
      }
    }, 340);
    if (modalReturnFocus && modalReturnFocus.focus) modalReturnFocus.focus({ preventScroll: true });
  }

  function closeAllModals() { $$(".modal").forEach(closeModal); }

  $$("[data-close-modal]").forEach((el) => el.addEventListener("click", () => closeAllModals()));

  // Quick brief modal trigger
  const openContactBtn = $("#openContact");
  const contactModal = $("#contactModal");
  if (openContactBtn && contactModal) {
    openContactBtn.addEventListener("click", () => {
      modalReturnFocus = openContactBtn;
      openModal(contactModal);
    });
  }

  // Escape closes topmost overlay; focus trap inside open modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const open = $(".modal.is-on");
      if (open) { closeAllModals(); return; }
      if (studio.classList.contains("is-open")) closeStudio();
      return;
    }
    // Shift + D → toggle studio (ignore while typing)
    if (e.shiftKey && (e.key === "D" || e.key === "d")) {
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      e.preventDefault();
      toggleStudio();
      return;
    }
    // Focus trap
    if (e.key === "Tab") {
      const open = $(".modal.is-on") || (studio.classList.contains("is-open") && isNarrow() ? studio : null);
      if (!open) return;
      const items = $$("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])", open)
        .filter((el) => !el.disabled && el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ========================= 9. UI KIT ========================= */
  const kitTabs = $$(".kit__tab");
  function selectKitTab(tab) {
      const name = tab.dataset.tab;
      $$(".kit__tab").forEach((t) => {
        const on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
      });
      $$(".kit__panel").forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.panel === name);
      });
  }

  kitTabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectKitTab(tab));
    tab.addEventListener("keydown", (e) => {
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      const next = kitTabs[(i + dir + kitTabs.length) % kitTabs.length];
      selectKitTab(next);
      next.focus();
    });
  });

  const rangeDemo = $("#rangeDemo");
  const rangeOut = $("#rangeOut");
  if (rangeDemo && rangeOut) {
    const paint = () => {
      rangeDemo.style.setProperty("--fill", rangeDemo.value + "%");
      rangeOut.textContent = rangeDemo.value + "%";
    };
    rangeDemo.addEventListener("input", paint);
    paint();
  }

  $$("[data-loading-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-loading")) return;
      btn.classList.add("is-loading");
      setTimeout(() => {
        btn.classList.remove("is-loading");
        toast("Request sent", "We'll be in touch within a day");
      }, 1500);
    });
  });

  // Budget pill group
  const budgetGroup = $("#budgetGroup");
  const budgetInput = $("#c-budget");
  if (budgetGroup && budgetInput) {
    $$(".budget__opt", budgetGroup).forEach((opt) => {
      opt.addEventListener("click", () => {
        const wasPicked = opt.classList.contains("is-picked");
        $$(".budget__opt", budgetGroup).forEach((o) => o.classList.remove("is-picked"));
        if (!wasPicked) { opt.classList.add("is-picked"); budgetInput.value = opt.dataset.value; }
        else budgetInput.value = "";
      });
    });
  }

  /* ========================= 10. FORMS ========================= */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  const RULES = {
    name:    { required: "Please tell us your name.", min: 2, minMsg: "That looks a little short." },
    email:   { required: "We need an email to reply to.", pattern: EMAIL_RE, patternMsg: "That email doesn't look right." },
    type:    { required: "Pick the closest project type." },
    message: { required: "A sentence or two is plenty.", min: 12, minMsg: "Add a bit more detail — 12 characters minimum." }
  };

  function checkField(input) {
    const rule = RULES[input.name];
    if (!rule) return "";
    const value = (input.value || "").trim();
    if (!value) return rule.required;
    if (rule.pattern && !rule.pattern.test(value)) return rule.patternMsg;
    if (rule.min && value.length < rule.min) return rule.minMsg;
    return "";
  }

  function paintField(input, message) {
    const field = input.closest(".field") || input.parentNode;
    const slot = field.querySelector("[data-error-for]") || $('.field__error[data-error-for="' + input.name + '"]', field);
    if (slot) slot.textContent = message || "";
    field.classList.toggle("has-error", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (message) {
      field.classList.remove("has-error");
      void field.offsetWidth;
      field.classList.add("has-error");
    }
  }

  function validateForm(form) {
    const fields = $$("input[name], select[name], textarea[name]", form).filter((el) => RULES[el.name]);
    let firstBad = null;
    fields.forEach((input) => {
      const msg = checkField(input);
      paintField(input, msg);
      if (msg && !firstBad) firstBad = input;
    });
    return firstBad;
  }

  function wireForm(form, onSuccess) {
    if (!form) return;

    const fields = $$("input[name], select[name], textarea[name]", form);
    fields.forEach((input) => {
      input.addEventListener("blur", () => {
        if (RULES[input.name]) paintField(input, checkField(input));
      });
      input.addEventListener("input", () => {
        if (!RULES[input.name]) return;
        if (input.closest(".field").classList.contains("has-error")) paintField(input, checkField(input));
      });
      if (input.tagName === "SELECT") {
        input.addEventListener("change", () => { if (RULES[input.name]) paintField(input, checkField(input)); });
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const bad = validateForm(form);
      if (bad) {
        bad.focus({ preventScroll: true });
        scrollToEl(bad, "center");
        toast("Almost there", "Check the highlighted fields", "err");
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.classList.add("is-loading");
      setTimeout(() => {
        if (btn) btn.classList.remove("is-loading");
        onSuccess(new FormData(form));
      }, 1100);
    });
  }

  const contactForm = $("#contactForm");
  const formSuccess = $("#formSuccess");
  if (contactForm) {
    wireForm(contactForm, (data) => {
      contactForm.reset();
      $$(".budget__opt").forEach((o) => o.classList.remove("is-picked"));
      const counter = $("#msgCounter");
      if (counter) { counter.textContent = "0 / 600"; counter.className = "counter"; }
      if (formSuccess) formSuccess.hidden = false;
      toast("Brief received", "Reply within one business day", "ok");
    });

    const resetFormBtn = $("#resetForm");
    if (resetFormBtn && formSuccess) {
      resetFormBtn.addEventListener("click", () => {
        formSuccess.hidden = true;
        const first = $("#c-name");
        if (first) first.focus();
      });
    }

    // character counter
    const message = $("#c-message");
    const counter = $("#msgCounter");
    if (message && counter) {
      const MAX = 600;
      message.addEventListener("input", () => {
        const len = message.value.length;
        counter.textContent = len + " / " + MAX;
        counter.className = "counter" + (len > MAX ? " is-over" : len > MAX * 0.9 ? " is-warn" : "");
      });
    }
  }

  const quickForm = $("#quickForm");
  if (quickForm) {
    wireForm(quickForm, () => {
      const name = (quickForm.querySelector('[name="name"]').value || "").split(" ")[0];
      quickForm.reset();
      closeAllModals();
      toast("Thanks" + (name ? ", " + name : "") + "!", "We'll reply within one business day", "ok");
    });
  }

  /* ========================= 11. TOASTS ========================= */
  const toastHost = $("#toasts");
  function toast(title, body, kind) {
    if (!toastHost) return;
    const icons = { ok: "✓", err: "!", warn: "!" };
    const el = document.createElement("div");
    el.className = "toast" + (kind && kind !== "ok" ? " toast--" + kind : "");
    el.innerHTML =
      `<span class="toast__ico">${icons[kind] || "✓"}</span>
       <div><b></b><span></span></div>`;
    el.querySelector("b").textContent = title;
    el.querySelector("span:last-child").textContent = body || "";
    toastHost.appendChild(el);

    while (toastHost.children.length > 3) toastHost.removeChild(toastHost.firstChild);

    setTimeout(() => {
      el.classList.add("is-out");
      setTimeout(() => el.remove(), 320);
    }, 3200);
  }

  /* ========================= BOOT ========================= */
  const saved = readStored() || DEFAULTS;
  setTokens(saved, { announce: false });
  syncRadiusLabels();

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  window.addEventListener("resize", () => {
    if (!isNarrow() && studio.classList.contains("is-open")) document.body.classList.remove("is-locked");
    if (isNarrow() && studio.classList.contains("is-open")) document.body.classList.add("is-locked");
  });

  // First-visit nudge
  let nudged = false;
  try { nudged = localStorage.getItem("scs.nudged") === "1"; } catch (e) { /* noop */ }
  if (!nudged) {
    setTimeout(() => {
      toast("Try the design studio", "Shift + D, or hit the wand icon ↘");
      try { localStorage.setItem("scs.nudged", "1"); } catch (e) { /* noop */ }
    }, 2600);
  }
})();
