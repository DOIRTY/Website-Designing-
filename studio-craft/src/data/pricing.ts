export type Plan = {
  id: string
  name: string
  tagline: string
  monthly: number
  featured?: boolean
  bestFor: string
  features: string[]
  cta: string
}

export const PLANS: Plan[] = [
  {
    id: 'sprint',
    name: 'Sprint',
    tagline: 'A focused two-week engagement to unblock one problem.',
    monthly: 6500,
    bestFor: 'Startups & single initiatives',
    features: [
      'One designer or engineer',
      'Two-week sprint cadence',
      'Async updates, weekly call',
      'Figma + code handover',
      'Pause or cancel anytime',
    ],
    cta: 'Start a sprint',
  },
  {
    id: 'studio',
    name: 'Studio',
    tagline: 'A dedicated pod designing and building in parallel.',
    monthly: 18000,
    featured: true,
    bestFor: 'Teams shipping continuously',
    features: [
      'Senior designer + engineer',
      'Design system ownership',
      'Unlimited requests, one active at a time',
      'Weekly shipped increment',
      'Accessibility & performance budgets',
      'Slack channel with the pod',
    ],
    cta: 'Book the studio',
  },
  {
    id: 'partner',
    name: 'Partner',
    tagline: 'Embedded, multi-pod partnership with a delivery guarantee.',
    monthly: 42000,
    bestFor: 'Scale-ups & rebrands',
    features: [
      'Multi-disciplinary team (4–6)',
      'Dedicated delivery lead',
      'Two parallel workstreams',
      'Brand, product and engineering',
      'Quarterly strategy reviews',
      'Named SLA & priority scheduling',
    ],
    cta: 'Talk to us',
  },
]
