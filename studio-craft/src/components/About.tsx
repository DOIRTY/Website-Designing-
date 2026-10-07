import { Compass, Users, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { STATS } from '@/data/site'
import { Reveal, Section, SectionHeading } from '@/components/ui/Primitives'

const VALUES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Zap,
    title: 'Ship in weeks, not quarters',
    body: 'Two-week sprints with something live at the end of every one. Momentum is a design decision.',
  },
  {
    icon: Users,
    title: 'One team, no handoff',
    body: 'The people who design it are in the room when it gets built. Nothing is lost in translation.',
  },
  {
    icon: Compass,
    title: 'Opinions, backed by evidence',
    body: 'We will argue for the better solution — and bring the research, prototypes or data to back it up.',
  },
]

export function About() {
  return (
    <Section id="about" bordered>
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading
            id="about"
            eyebrow="About the studio"
            title={
              <>
                A small team, <span className="text-gradient">deliberately</span>
              </>
            }
            description="Studio Craft is fourteen designers and engineers spread across eight timezones. We take on a handful of engagements at a time so every one gets a partner, not a project manager."
          />

          <dl className="grid grid-cols-2 gap-4 sm:gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-line bg-obsidian-card/50 p-4 transition-colors duration-300 hover:border-line-strong"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-3xl font-bold tracking-tight text-gradient tabular-nums">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-sm text-ink-muted">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:content-center">
          {VALUES.map((value, index) => {
            const Icon = value.icon
            return (
              <Reveal key={value.title} delay={index * 90}>
                <div className="group flex gap-4 rounded-xl2 border border-line bg-obsidian-card/50 p-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03] text-cyan-brand transition-colors duration-300 group-hover:border-cyan-brand/40 group-hover:bg-cyan-brand/10">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-ink">
                      {value.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{value.body}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
