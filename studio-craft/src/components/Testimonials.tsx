import { Quote, ShieldCheck, Star } from 'lucide-react'
import { TESTIMONIALS } from '@/data/testimonials'
import { TRUST_BADGES } from '@/data/site'
import { Reveal, Section, SectionHeading } from '@/components/ui/Primitives'
import { cn } from '@/lib/cn'

const ACCENT: Record<string, { grad: string; text: string }> = {
  violet: { grad: 'from-violet-brand/25 to-violet-brand/5', text: 'text-violet-brand' },
  cyan: { grad: 'from-cyan-brand/25 to-cyan-brand/5', text: 'text-cyan-brand' },
  emerald: { grad: 'from-emerald-500/25 to-emerald-500/5', text: 'text-emerald-400' },
}

export function Testimonials() {
  return (
    <Section id="testimonials" bordered>
      <SectionHeading
        id="testimonials"
        eyebrow="Social proof"
        title={
          <>
            The part clients <span className="text-gradient">actually remember</span>
          </>
        }
        description="Six partners, six engagements, and the results they were willing to put their name to."
        align="center"
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((item, index) => {
          const accent = ACCENT[item.accent] ?? ACCENT.violet!
          return (
            <li key={item.name} className="h-full">
              <Reveal delay={index * 60} className="h-full">
                <div className="group relative flex h-full overflow-hidden rounded-xl2 border border-line bg-obsidian-card/60 p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-line-strong hover:shadow-lift">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                      accent.grad,
                    )}
                  />

                  <figure className="relative flex h-full flex-col">
                    <Quote className={cn('size-6', accent.text)} aria-hidden="true" />

                    <blockquote className="mt-4 flex-1">
                      <p className="text-sm leading-relaxed text-ink">{item.quote}</p>
                    </blockquote>

                    <div
                      className="mt-5 flex items-center gap-1"
                      role="img"
                      aria-label="Rated 5 out of 5"
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className="size-3.5 fill-amber-400 text-amber-400"
                          aria-hidden="true"
                        />
                      ))}
                    </div>

                    <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-5">
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-white/[0.04] text-xs font-bold text-ink"
                        aria-hidden="true"
                      >
                        {item.initials}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-ink">
                          {item.name}
                        </span>
                        <span className="block truncate text-xs text-ink-subtle">
                          {item.role} · {item.company}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </div>
              </Reveal>
            </li>
          )
        })}
      </ul>

      {/* Trust badges */}
      <Reveal delay={180}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {TRUST_BADGES.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-obsidian-card/70 px-4 py-2 text-xs font-medium text-ink-muted"
            >
              <ShieldCheck className="size-3.5 text-emerald-400" aria-hidden="true" />
              {badge}
            </span>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
