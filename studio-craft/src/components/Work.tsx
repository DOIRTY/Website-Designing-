import { useState } from 'react'
import { ArrowUpRight, ExternalLink, TrendingUp, X } from 'lucide-react'
import { PROJECTS, type Project } from '@/data/projects'
import { ProjectArt } from '@/components/ProjectArt'
import { Badge, Reveal, Section, SectionHeading } from '@/components/ui/Primitives'
import { Drawer } from '@/components/ui/Drawer'
import { buttonClasses } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

export function Work() {
  const [active, setActive] = useState<Project | null>(null)

  return (
    <Section id="work" bordered>
      <SectionHeading
        id="work"
        eyebrow="Selected work"
        title={
          <>
            Case studies with <span className="text-gradient">numbers attached</span>
          </>
        }
        description="Six recent engagements. Every one shipped with a documented system and a metric we were willing to be measured on."
      />

      {/* Bento grid */}
      <div className="grid auto-rows-[20rem] grid-cols-1 gap-4 md:grid-cols-3">
        {PROJECTS.map((project, index) => {
          const featured = index === 0
          return (
            <Reveal
              key={project.id}
              delay={index * 60}
              className={cn(featured && 'md:col-span-2 md:row-span-2')}
            >
              <article
                className={cn(
                  'group relative flex h-full flex-col justify-end overflow-hidden rounded-xl2 border border-line bg-obsidian-card',
                  'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  'hover:-translate-y-1 hover:border-line-strong hover:shadow-lift',
                )}
              >
                {/* Artwork */}
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  style={{
                    backgroundImage: `linear-gradient(140deg, ${project.from}, ${project.to})`,
                  }}
                >
                  <ProjectArt variant={project.art} />
                </div>

                {/* Scrim */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95"
                />

                {/* Category + year */}
                <div className="absolute top-4 right-4 left-4 flex items-start justify-between gap-3">
                  <Badge tone="violet" className="backdrop-blur-md">
                    {project.category}
                  </Badge>
                  <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
                    {project.year}
                  </span>
                </div>

                {/* Hover overlay — live preview */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-400 group-hover:opacity-100 group-focus-within:opacity-100">
                  <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center backdrop-blur-md">
                    <p className="max-w-sm text-sm leading-relaxed text-white/80">
                      {project.blurb}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-obsidian">
                      <ExternalLink className="size-4" aria-hidden="true" />
                      Live preview
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 flex items-end justify-between gap-4 p-5 sm:p-6">
                  <div className="min-w-0">
                    <p className="text-xs text-ink-subtle">{project.client}</p>
                    <h3
                      className={cn(
                        'mt-1 font-semibold tracking-tight text-ink',
                        featured ? 'text-2xl sm:text-3xl' : 'text-lg',
                      )}
                    >
                      {project.title}
                    </h3>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="inline-flex items-center gap-1.5 text-lg font-bold text-cyan-brand sm:text-xl">
                      <TrendingUp className="size-4" aria-hidden="true" />
                      {project.metric}
                    </p>
                    <p className="text-[0.6875rem] tracking-[0.14em] text-ink-subtle uppercase">
                      {project.metricLabel}
                    </p>
                  </div>
                </div>

                {/* Whole-card trigger — keeps the full card clickable and keyboard reachable */}
                <button
                  type="button"
                  onClick={() => setActive(project)}
                  className="absolute inset-0 z-20 rounded-xl2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-brand"
                  aria-label={`Open case study: ${project.title}`}
                />
              </article>
            </Reveal>
          )
        })}
      </div>

      <CaseStudyDrawer project={active} onClose={() => setActive(null)} />
    </Section>
  )
}

function CaseStudyDrawer({ project, onClose }: { project: Project | null; onClose: () => void }) {
  return (
    <Drawer
      open={project !== null}
      onClose={onClose}
      title={project?.title ?? ''}
      description={project ? `${project.category} · ${project.year}` : undefined}
      footer={
        <div className="flex flex-wrap gap-3">
          <a
            href="#estimator"
            onClick={(e) => {
              e.preventDefault()
              onClose()
              document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className={buttonClasses({ className: 'flex-1' })}
          >
            Start a project like this
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <button type="button" onClick={onClose} className={buttonClasses({ variant: 'subtle' })}>
            <X className="size-4" aria-hidden="true" />
            Close
          </button>
        </div>
      }
    >
      {project && (
        <div className="grid gap-7">
          <div
            className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line"
            style={{
              backgroundImage: `linear-gradient(140deg, ${project.from}, ${project.to})`,
            }}
          >
            <ProjectArt variant={project.art} />
          </div>

          <div className="rounded-xl border border-line bg-obsidian p-4">
            <p className="text-xs tracking-[0.16em] text-ink-subtle uppercase">Headline result</p>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-cyan-brand">{project.metric}</span>
              <span className="text-sm text-ink-muted">{project.metricLabel}</span>
            </p>
          </div>

          <p className="text-sm leading-relaxed text-ink-muted">{project.blurb}</p>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.16em] text-ink-subtle uppercase">
              Scope
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.scope.map((item) => (
                <Badge key={item} tone="violet">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.16em] text-ink-subtle uppercase">
              Stack
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <Badge key={item} tone="cyan">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.16em] text-ink-subtle uppercase">
              Outcome
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{project.outcome}</p>
          </div>
        </div>
      )}
    </Drawer>
  )
}
