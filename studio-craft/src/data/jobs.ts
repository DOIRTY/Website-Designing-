export const JOB_CATEGORIES = [
  'All Roles',
  'UI/UX Design',
  'Frontend Dev',
  'Design Systems',
] as const

export type JobCategoryFilter = (typeof JOB_CATEGORIES)[number]
export type JobCategory = Exclude<JobCategoryFilter, 'All Roles'>

export type Job = {
  id: string
  title: string
  category: JobCategory
  contract: 'Full-time' | 'Contract'
  location: string
  pay: string
  level: string
  posted: string
  description: string
  skills: string[]
}

export const JOBS: Job[] = [
  {
    id: 'senior-product-designer',
    title: 'Senior Product Designer',
    category: 'UI/UX Design',
    contract: 'Full-time',
    location: 'Remote — EU / UK',
    pay: '$95 – $130 / hr',
    level: 'Senior · 5+ yrs',
    posted: '2 days ago',
    description:
      'Own end-to-end product design for two fintech clients, from discovery workshops through shipped interface.',
    skills: ['Figma', 'Design systems', 'User research'],
  },
  {
    id: 'frontend-engineer',
    title: 'Senior Frontend Engineer',
    category: 'Frontend Dev',
    contract: 'Full-time',
    location: 'Remote — worldwide',
    pay: '$80 – $120 / hr',
    level: 'Senior · 4+ yrs',
    posted: '4 days ago',
    description:
      'Build accessible, high-performance Next.js front-ends alongside our design team — you ship what you design.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    id: 'design-systems-lead',
    title: 'Design Systems Lead',
    category: 'Design Systems',
    contract: 'Contract',
    location: 'Remote — US hours',
    pay: '$110 – $160 / hr',
    level: 'Lead · 6+ yrs',
    posted: '1 week ago',
    description:
      'Stand up a tokenised multi-brand system: governance, contribution model and a documented component library.',
    skills: ['Tokens Studio', 'Figma API', 'Storybook'],
  },
  {
    id: 'ux-researcher',
    title: 'UX Researcher',
    category: 'UI/UX Design',
    contract: 'Contract',
    location: 'Remote — EU / UK',
    pay: '$80 – $110 / hr',
    level: 'Mid · 3+ yrs',
    posted: '1 week ago',
    description:
      'Run mixed-method research across three active engagements and turn findings into decisions teams act on.',
    skills: ['Interviews', 'Usability testing', 'Analytics'],
  },
  {
    id: 'motion-designer',
    title: 'Motion & Interaction Designer',
    category: 'UI/UX Design',
    contract: 'Contract',
    location: 'Remote — worldwide',
    pay: '$85 – $115 / hr',
    level: 'Mid · 3+ yrs',
    posted: '2 weeks ago',
    description:
      'Define motion language for client products: micro-interactions, page transitions and scroll choreography.',
    skills: ['After Effects', 'Rive', 'GSAP'],
  },
  {
    id: 'design-engineer',
    title: 'Design Engineer',
    category: 'Frontend Dev',
    contract: 'Full-time',
    location: 'Remote — EU / UK',
    pay: '$90 – $125 / hr',
    level: 'Senior · 4+ yrs',
    posted: '2 weeks ago',
    description:
      'Live between Figma and the codebase — prototype in code, componentise in React, own the interaction details.',
    skills: ['React', 'Framer Motion', 'Figma', 'CSS'],
  },
  {
    id: 'systems-engineer',
    title: 'Design Systems Engineer',
    category: 'Design Systems',
    contract: 'Full-time',
    location: 'Remote — worldwide',
    pay: '$95 – $135 / hr',
    level: 'Senior · 5+ yrs',
    posted: '3 weeks ago',
    description:
      'Build and maintain the component library behind our client systems — tokens, primitives, docs and a11y tests.',
    skills: ['React', 'Radix', 'Storybook', 'a11y'],
  },
]
