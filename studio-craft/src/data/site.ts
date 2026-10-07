export const SECTIONS = [
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'jobs', label: 'Job Board' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'about', label: 'About' },
] as const

export const NAV_IDS = SECTIONS.map((s) => s.id)

export type Service = {
  icon: 'palette' | 'code' | 'layers' | 'sparkles' | 'gauge' | 'megaphone'
  title: string
  description: string
  bullets: string[]
}

export const SERVICES: Service[] = [
  {
    icon: 'palette',
    title: 'Brand Identity',
    description:
      'Positioning, naming, visual systems and the guidelines that keep them intact after we leave.',
    bullets: ['Logo & mark systems', 'Type & colour', 'Brand guidelines'],
  },
  {
    icon: 'layers',
    title: 'Product Design',
    description:
      'End-to-end UX for web apps — research, IA, flows and high-fidelity prototypes that ship.',
    bullets: ['Discovery & IA', 'Interactive prototypes', 'Usability testing'],
  },
  {
    icon: 'code',
    title: 'Next.js Engineering',
    description:
      'Component-driven front-ends with performance budgets, typed APIs and CI from day one.',
    bullets: ['React & Next.js', 'Headless CMS', 'Edge & SSR'],
  },
  {
    icon: 'sparkles',
    title: 'Design Systems',
    description:
      'Tokenised component libraries with documentation, so every squad ships the same interface.',
    bullets: ['Design tokens', 'Component library', 'Docs & governance'],
  },
  {
    icon: 'gauge',
    title: 'Conversion Optimisation',
    description:
      'Instrumented experiments on the pages that make money — designed, shipped and measured.',
    bullets: ['Landing page systems', 'A/B programmes', 'Analytics setup'],
  },
  {
    icon: 'megaphone',
    title: 'Motion & 3D',
    description:
      'Scroll-linked motion, page transitions and WebGL accents that never get in the user’s way.',
    bullets: ['Micro-interactions', 'Scroll choreography', 'WebGL accents'],
  },
]

export const TRUST_LOGOS = [
  'Northwind',
  'Lumen',
  'Cadence',
  'Halcyon',
  'Vantage',
  'Orbital',
  'Meridian',
  'Fathom',
]

export const STATS = [
  { value: '140+', label: 'Products shipped' },
  { value: '3.2×', label: 'Median conversion lift' },
  { value: '18', label: 'Countries served' },
  { value: '98%', label: 'Client retention' },
]

export const TRUST_BADGES = [
  'WCAG 2.2 AA audited',
  'SOC 2 aligned process',
  '99.98% avg. uptime',
  'Core Web Vitals: green',
]
