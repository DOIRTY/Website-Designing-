export type Project = {
  id: string
  title: string
  client: string
  category: string
  year: string
  /** Headline result shown on every card and in the case study. */
  metric: string
  metricLabel: string
  blurb: string
  /** 0–5 selects one of the generated SVG artworks. */
  art: number
  from: string
  to: string
  scope: string[]
  stack: string[]
  outcome: string
}

export const PROJECTS: Project[] = [
  {
    id: 'northwind',
    title: 'Northwind Capital',
    client: 'Northwind Capital',
    category: 'Fintech Platform',
    year: '2026',
    metric: '+140%',
    metricLabel: 'Conversion',
    blurb:
      'A wealth-management dashboard rebuilt around trust — progressive onboarding, transparent fees and a token system three squads now share.',
    art: 0,
    from: '#0b1f3a',
    to: '#3b1d6e',
    scope: ['Product design', 'Design system', 'Next.js build'],
    stack: ['Next.js', 'TypeScript', 'Radix', 'Recharts'],
    outcome:
      'Onboarding completion rose 140% within one quarter and support tickets tied to fee clarity dropped by half.',
  },
  {
    id: 'lumen',
    title: 'Lumen Commerce',
    client: 'Lumen',
    category: 'E-Commerce',
    year: '2025',
    metric: '+68%',
    metricLabel: 'Revenue / session',
    blurb:
      'An editorial storefront for a slow-fashion label — shoppable lookbooks, 1.2s LCP and a cart that never breaks the story.',
    art: 1,
    from: '#3a1330',
    to: '#8c3a1f',
    scope: ['Brand identity', 'Art direction', 'Headless build'],
    stack: ['Shopify', 'Hydrogen', 'Sanity'],
    outcome:
      'Revenue per session climbed 68% and the lookbook became the single largest source of new-customer sessions.',
  },
  {
    id: 'cadence',
    title: 'Cadence Analytics',
    client: 'Cadence',
    category: 'SaaS Dashboard',
    year: '2026',
    metric: '−71%',
    metricLabel: 'Time to insight',
    blurb:
      'Forty million rows made conversational: a natural-language query bar, one chart grammar, and density modes for analysts.',
    art: 2,
    from: '#04252b',
    to: '#0d5c5c',
    scope: ['UX architecture', 'Data visualisation', 'Front-end'],
    stack: ['React', 'D3', 'TanStack', 'DuckDB'],
    outcome:
      'Time-to-first-insight fell 71%, and weekly active accounts grew three quarters in a row.',
  },
  {
    id: 'halcyon',
    title: 'Halcyon Health',
    client: 'Halcyon',
    category: 'Healthcare',
    year: '2025',
    metric: 'AA',
    metricLabel: 'WCAG 2.2',
    blurb:
      'A patient portal designed for anxious users on cracked screens — plain language, 44px targets, audited to AA.',
    art: 3,
    from: '#2a1038',
    to: '#6d2a5c',
    scope: ['Accessibility', 'Service design', 'Content system'],
    stack: ['React', 'Next.js', 'Storybook'],
    outcome:
      'Task success jumped from 54% to 93% in moderated testing and phone reschedules halved.',
  },
  {
    id: 'orbital',
    title: 'Orbital Travel',
    client: 'Orbital',
    category: 'Marketing Site',
    year: '2024',
    metric: '3.1×',
    metricLabel: 'Organic traffic',
    blurb:
      'An itinerary builder where planning feels like the trip — interactive route maps and scroll-linked motion.',
    art: 4,
    from: '#062a2a',
    to: '#1f7a5c',
    scope: ['Website design', 'Motion', 'CMS'],
    stack: ['Astro', 'GSAP', 'Mapbox'],
    outcome:
      'Organic sessions tripled in six months and average session time went from 40 seconds to nearly four minutes.',
  },
  {
    id: 'meridian',
    title: 'Meridian AI',
    client: 'Meridian',
    category: 'AI Product',
    year: '2026',
    metric: '7.4%',
    metricLabel: 'Demo conversion',
    blurb:
      'A launch site and product UI for a research assistant — with honest states for streaming, citing and being wrong.',
    art: 5,
    from: '#140a2e',
    to: '#3d1a6b',
    scope: ['Brand site', 'Product UI', 'State system'],
    stack: ['Next.js', 'Vercel AI SDK', 'Framer Motion'],
    outcome:
      'The live demo converts at 7.4% and the streaming-state system was adopted across three sibling products.',
  },
]
