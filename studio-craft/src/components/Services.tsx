import { Code2, Gauge, Layers, Megaphone, Palette, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SERVICES } from '@/data/site'
import { Reveal, Section, SectionHeading } from '@/components/ui/Primitives'

const ICONS: Record<string, LucideIcon> = {
  palette: Palette,
  code: Code2,
  layers: Layers,
  sparkles: Sparkles,
  gauge: Gauge,
  megaphone: Megaphone,
}

export function Services() {
  return (
    <Section id="services">
      <SectionHeading
        id="services"
        eyebrow="Capabilities"
        title={
          <>
            Everything between the first sketch{' '}
            <span className="text-gradient">and production</span>
          </>
        }
        description="One team, one contract, no handoff gap. Design and engineering sit in the same standup, on the same board, against the same deadline."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, index) => {
          const Icon = ICONS[service.icon] ?? Sparkles
          return (
            <Reveal key={service.title} delay={index * 70}>
              <article className="group relative h-full overflow-hidden rounded-xl2 border border-line bg-obsidian-card/60 p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-line-strong hover:shadow-lift">
                {/* hover wash */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgb(139_92_246_/_0.12),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative">
                  <span className="grid size-11 place-items-center rounded-xl border border-line bg-white/[0.03] text-violet-brand transition-all duration-500 group-hover:scale-105 group-hover:border-violet-brand/40 group-hover:bg-violet-brand/10 group-hover:text-ink">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>

                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {service.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {service.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="rounded-full border border-line bg-white/[0.02] px-2.5 py-1 text-xs text-ink-subtle"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
