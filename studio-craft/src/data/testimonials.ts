export type Testimonial = {
  quote: string
  name: string
  role: string
  company: string
  initials: string
  accent: 'violet' | 'cyan' | 'emerald'
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'They shipped a design system in six weeks that our four squads actually adopted. That has never happened here before.',
    name: 'Amara Okafor',
    role: 'VP Product',
    company: 'Northwind Capital',
    initials: 'AO',
    accent: 'violet',
  },
  {
    quote:
      'Conversion was the whole brief. We got a 140% lift and a front-end our engineers are genuinely happy to work in.',
    name: 'Daniel Reyes',
    role: 'Head of Growth',
    company: 'Cadence',
    initials: 'DR',
    accent: 'cyan',
  },
  {
    quote:
      'The only agency we have worked with that writes documentation without being asked. Onboarding new devs took days, not weeks.',
    name: 'Sofia Lindqvist',
    role: 'CTO',
    company: 'Halcyon Health',
    initials: 'SL',
    accent: 'emerald',
  },
  {
    quote:
      'Our lookbook went from a PDF attachment to the highest-converting page on the site. Revenue per session is up 68%.',
    name: 'Maya Chen',
    role: 'Founder',
    company: 'Lumen',
    initials: 'MC',
    accent: 'violet',
  },
  {
    quote:
      'They pushed back on the brief where it mattered and shipped early anyway. Rare combination of taste and velocity.',
    name: 'Tobias Weber',
    role: 'Director of Design',
    company: 'Orbital',
    initials: 'TW',
    accent: 'cyan',
  },
  {
    quote:
      'Accessibility was baked in from the first sprint, not retrofitted. We passed our external audit with zero critical issues.',
    name: 'Priya Nair',
    role: 'Head of Engineering',
    company: 'Meridian AI',
    initials: 'PN',
    accent: 'emerald',
  },
]
