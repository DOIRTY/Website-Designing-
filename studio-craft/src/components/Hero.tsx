import { useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, CalendarCheck, MapPin, TrendingUp } from 'lucide-react'
import { PROJECTS } from '@/data/projects'
import { JOBS } from '@/data/jobs'
import { scrollToSection } from '@/hooks/useUi'
import { buttonClasses } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Primitives'
import { cn } from '@/lib/cn'

const MODES = [
  {
    id: 'portfolio',
    label: 'View Our Portfolio',
    cta: 'Explore the work',
    target: 'work',
  },
  {
    id: 'talent',
    label: 'Join Our Design Team',
    cta: 'See open roles',
    target: 'jobs',
  },
] as const

type ModeId = (typeof MODES)[number]['id']

export function Hero() {
  const [mode, setMode] = useState<ModeId>('portfolio')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeIndex = MODES.findIndex((m) => m.id === mode)
  const current = MODES[activeIndex] ?? MODES[0]

  const onKeyDown = (event: React.KeyboardEvent) => {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    event.preventDefault()
    const next = (activeIndex + delta + MODES.length) % MODES.length
    setMode(MODES[next]!.id)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="top" className="relative px-5 pt-14 pb-16 sm:px-8 md:pt-20 md:pb-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Badge */}
          <Reveal>
            <a
              href="#jobs"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('jobs')
              }}
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-obsidian-card/70 px-3.5 py-1.5 text-xs font-medium text-ink-muted backdrop-blur-md transition-colors hover:border-line-strong hover:text-ink"
            >
              <span className="relative grid size-2 place-items-center" aria-hidden="true">
                <span className="absolute size-2 animate-pulse-ring rounded-full bg-emerald-400" />
                <span className="size-1.5 rounded-full bg-emerald-400" />
              </span>
              3 project slots open for Q4 · 7 roles hiring
              <ArrowRight
                className="size-3 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </Reveal>

          {/* Headline */}
          <Reveal delay={80}>
            <h1 className="mt-7 text-4xl leading-[1.03] font-bold tracking-[-0.035em] text-balance sm:text-6xl md:text-[4.25rem]">
              We Design Digital Experiences That{' '}
              <span className="text-gradient">Convert &amp; Scale.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              An elite design collective building Next.js web applications, brand identities, and
              high-converting interfaces.
            </p>
          </Reveal>

          {/* Interactive toggle */}
          <Reveal delay={240} className="mt-9 w-full">
            <div
              role="radiogroup"
              aria-label="What brings you to Studio Craft?"
              onKeyDown={onKeyDown}
              className="relative mx-auto inline-flex w-full max-w-md rounded-full border border-line bg-obsidian-card/70 p-1 backdrop-blur-md"
            >
              <span
                aria-hidden="true"
                className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-brand-gradient shadow-[0_8px_24px_-8px_rgb(139_92_246_/_0.8)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: `translateX(${activeIndex * 100}%)` }}
              />
              {MODES.map((item, index) => {
                const selected = mode === item.id
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      tabRefs.current[index] = el
                    }}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setMode(item.id)}
                    className={cn(
                      'relative z-10 flex-1 rounded-full px-3 py-2.5 text-xs font-semibold transition-colors duration-300 sm:px-4 sm:text-sm',
                      selected ? 'text-white' : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={320} className="mt-7 w-full">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollToSection(current.target)}
                className={buttonClasses({ size: 'lg', className: 'w-full sm:w-auto' })}
              >
                {current.cta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('estimator')}
                className={buttonClasses({
                  variant: 'outline',
                  size: 'lg',
                  className: 'w-full sm:w-auto',
                })}
              >
                <CalendarCheck className="size-4" aria-hidden="true" />
                Estimate your project
              </button>
            </div>
          </Reveal>

          {/* Live preview panel — swaps with the toggle */}
          <Reveal delay={400} className="mt-12 w-full">
            <div
              key={mode}
              aria-live="polite"
              className="mx-auto max-w-xl animate-fade-up overflow-hidden rounded-xl2 border border-line bg-obsidian-card/70 shadow-lift backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.16em] text-ink-subtle uppercase">
                  {mode === 'portfolio' ? 'Recent work' : 'Open roles'}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs text-ink-subtle">
                  <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                  Updated today
                </span>
              </div>

              <ul className="divide-y divide-line">
                {mode === 'portfolio'
                  ? PROJECTS.slice(0, 3).map((project) => (
                      <li key={project.id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection('work')}
                          className="group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
                        >
                          <span
                            className="size-9 shrink-0 rounded-lg border border-line"
                            style={{
                              backgroundImage: `linear-gradient(135deg, ${project.from}, ${project.to})`,
                            }}
                            aria-hidden="true"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-ink">
                              {project.title}
                            </span>
                            <span className="block truncate text-xs text-ink-subtle">
                              {project.category}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-cyan-brand">
                            <TrendingUp className="size-3.5" aria-hidden="true" />
                            {project.metric}
                          </span>
                          <ArrowUpRight
                            className="size-4 shrink-0 text-ink-subtle transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-ink"
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                    ))
                  : JOBS.slice(0, 3).map((job) => (
                      <li key={job.id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection('jobs')}
                          className="group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-white/[0.04] text-violet-brand">
                            <MapPin className="size-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-ink">
                              {job.title}
                            </span>
                            <span className="block truncate text-xs text-ink-subtle">
                              {job.contract} · {job.location}
                            </span>
                          </span>
                          <span className="shrink-0 text-sm font-semibold text-ink-muted">
                            {job.pay}
                          </span>
                          <ArrowUpRight
                            className="size-4 shrink-0 text-ink-subtle transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-ink"
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                    ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
