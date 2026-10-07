import { useRef, useState } from 'react'
import { ArrowRight, Briefcase, Clock, MapPin, Wallet } from 'lucide-react'
import { JOB_CATEGORIES, JOBS, type Job, type JobCategoryFilter } from '@/data/jobs'
import { ApplyDrawer } from '@/components/ApplyDrawer'
import { Badge, Reveal, Section, SectionHeading } from '@/components/ui/Primitives'
import { buttonClasses } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const FILTERS: JobCategoryFilter[] = [...JOB_CATEGORIES]

export function JobBoard() {
  const [filter, setFilter] = useState<JobCategoryFilter>('All Roles')
  const [applying, setApplying] = useState<Job | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const visible = filter === 'All Roles' ? JOBS : JOBS.filter((job) => job.category === filter)

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    event.preventDefault()
    const next = (index + delta + FILTERS.length) % FILTERS.length
    setFilter(FILTERS[next]!)
    tabRefs.current[next]?.focus()
  }

  return (
    <Section id="jobs" bordered>
      <SectionHeading
        id="jobs"
        eyebrow="Join the team"
        title={
          <>
            Open roles at <span className="text-gradient">Studio Craft</span>
          </>
        }
        description="We hire senior, remote-first, and we pay for craft. No take-home tests — a paid trial sprint instead."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-obsidian-card px-3.5 py-1.5 text-sm">
            <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            <span className="text-ink-muted">
              <strong className="font-semibold text-ink">{JOBS.length}</strong> roles open
            </span>
          </div>
        }
      />

      {/* Filter tabs */}
      <Reveal>
        <div
          role="tablist"
          aria-label="Filter roles by discipline"
          className="mb-8 flex flex-wrap gap-2"
        >
          {FILTERS.map((category, index) => {
            const selected = filter === category
            const count =
              category === 'All Roles'
                ? JOBS.length
                : JOBS.filter((job) => job.category === category).length

            return (
              <button
                key={category}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                type="button"
                role="tab"
                id={`job-tab-${index}`}
                aria-selected={selected}
                aria-controls="job-panel"
                tabIndex={selected ? 0 : -1}
                onKeyDown={(e) => onKeyDown(e, index)}
                onClick={() => setFilter(category)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  selected
                    ? 'border-transparent bg-brand-gradient text-white shadow-[0_8px_24px_-10px_rgb(139_92_246_/_0.9)]'
                    : 'border-line bg-obsidian-card text-ink-muted hover:-translate-y-0.5 hover:border-line-strong hover:text-ink',
                )}
              >
                {category}
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[0.6875rem] font-semibold',
                    selected ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-ink-subtle',
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </Reveal>

      {/* Panel */}
      <div id="job-panel" role="tabpanel" aria-labelledby={`job-tab-${FILTERS.indexOf(filter)}`}>
        {visible.length === 0 ? (
          <p className="rounded-xl2 border border-dashed border-line p-10 text-center text-sm text-ink-muted">
            No open roles in this discipline right now — send us a portfolio anyway and we'll be in
            touch when one lands.
          </p>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {visible.map((job, index) => (
              <li key={job.id} className="h-full">
                <Reveal delay={index * 50} className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-xl2 border border-line bg-obsidian-card/60 p-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-line-strong hover:shadow-lift sm:p-6">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-brand/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold tracking-tight text-ink">
                          {job.title}
                        </h3>
                        <p className="mt-1 text-sm text-ink-subtle">{job.level}</p>
                      </div>
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03] text-violet-brand transition-colors duration-300 group-hover:border-violet-brand/40 group-hover:bg-violet-brand/10">
                        <Briefcase className="size-5" aria-hidden="true" />
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-ink-muted">{job.description}</p>

                    <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-ink-muted">
                        <Wallet className="size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                        <dt className="sr-only">Pay range</dt>
                        <dd className="font-semibold text-ink">{job.pay}</dd>
                      </div>
                      <div className="flex items-center gap-2 text-ink-muted">
                        <MapPin className="size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                        <dt className="sr-only">Location</dt>
                        <dd>{job.location}</dd>
                      </div>
                      <div className="flex items-center gap-2 text-ink-muted">
                        <Clock className="size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                        <dt className="sr-only">Contract</dt>
                        <dd>{job.contract}</dd>
                      </div>
                      <div className="flex items-center gap-2 text-ink-subtle">
                        <dt className="sr-only">Posted</dt>
                        <dd>Posted {job.posted}</dd>
                      </div>
                    </dl>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill}>{skill}</Badge>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4 pt-1">
                      <Badge tone={job.contract === 'Full-time' ? 'emerald' : 'cyan'}>
                        {job.category}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => setApplying(job)}
                        className={buttonClasses({ size: 'sm' })}
                      >
                        Apply Now
                        <ArrowRight
                          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ApplyDrawer job={applying} onClose={() => setApplying(null)} />
    </Section>
  )
}
