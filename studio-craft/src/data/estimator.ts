export type ProjectType = {
  id: string
  label: string
  description: string
  base: number
  weeks: string
}

export type Deliverable = {
  id: string
  label: string
  description: string
  /** Flat add-on in USD, or a multiplier applied to the base price. */
  flat?: number
  multiplier?: number
}

export type Timeline = {
  id: string
  label: string
  description: string
  multiplier: number
}

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'landing',
    label: 'Landing Page',
    description: 'One high-converting page with CMS-backed content and analytics wired in.',
    base: 9000,
    weeks: '2 weeks',
  },
  {
    id: 'webapp',
    label: 'Full Web App',
    description: 'Multi-route product with auth, data layer, dashboard and a documented system.',
    base: 32000,
    weeks: '8 weeks',
  },
  {
    id: 'rebrand',
    label: 'Brand & Site',
    description: 'Identity system plus a marketing site built to be edited without a developer.',
    base: 18000,
    weeks: '5 weeks',
  },
]

export const DELIVERABLES: Deliverable[] = [
  {
    id: 'figma',
    label: 'Figma design files',
    description: 'Layered, annotated source files with reusable components.',
    flat: 0,
  },
  {
    id: 'react',
    label: 'React / Next.js code',
    description: 'Production front-end, tested and deployed to your infrastructure.',
    multiplier: 0.45,
  },
  {
    id: 'cms',
    label: 'CMS integration',
    description: 'Content models and editor experience for a headless CMS.',
    flat: 6500,
  },
  {
    id: 'motion',
    label: 'Motion & micro-interactions',
    description: 'Scroll choreography, page transitions and state animation.',
    flat: 4200,
  },
  {
    id: 'system',
    label: 'Design system',
    description: 'Tokenised component library with docs and governance.',
    flat: 9000,
  },
]

export const TIMELINES: Timeline[] = [
  {
    id: 'rush',
    label: 'Rush — 1 to 2 weeks',
    description: 'We clear the studio and run a dedicated pod. Premium applies.',
    multiplier: 1.35,
  },
  {
    id: 'standard',
    label: 'Standard — 4 weeks',
    description: 'Our default cadence: two-week sprints with review at each milestone.',
    multiplier: 1,
  },
  {
    id: 'relaxed',
    label: 'Extended — 8 weeks',
    description: 'More room for research rounds and staged rollout. Slightly reduced rate.',
    multiplier: 0.92,
  },
]

export type EstimateInput = {
  projectType: string
  deliverables: string[]
  timeline: string
}

export type EstimateBreakdown = {
  base: number
  addOns: number
  multiplier: number
  total: number
  label: string
  weeks: string
  lines: { label: string; value: number }[]
}

/** Pure pricing function — kept separate from the UI so it stays testable. */
export function calculateEstimate({
  projectType,
  deliverables,
  timeline,
}: EstimateInput): EstimateBreakdown {
  const type = PROJECT_TYPES.find((t) => t.id === projectType) ?? PROJECT_TYPES[0]!
  const speed = TIMELINES.find((t) => t.id === timeline) ?? TIMELINES[1]!

  const lines: { label: string; value: number }[] = [
    { label: `${type.label} — base`, value: type.base },
  ]

  let addOns = 0
  for (const id of deliverables) {
    const item = DELIVERABLES.find((d) => d.id === id)
    if (!item) continue
    const value = item.flat ?? Math.round(type.base * (item.multiplier ?? 0))
    if (value === 0) continue
    addOns += value
    lines.push({ label: item.label, value })
  }

  const subtotal = type.base + addOns
  const raw = subtotal * speed.multiplier
  // round to the nearest $500 for a presentable figure
  const total = Math.max(500, Math.round(raw / 500) * 500)

  const rushWeeks =
    speed.id === 'rush' ? '1–2 weeks' : speed.id === 'relaxed' ? '8+ weeks' : type.weeks

  return {
    base: type.base,
    addOns,
    multiplier: speed.multiplier,
    total,
    weeks: rushWeeks,
    label: type.label,
    lines,
  }
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
