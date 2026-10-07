import type { ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/cn'

/* ------------------------------------------------------------------ Reveal */
type RevealProps = {
  children: ReactNode
  /** Stagger, in milliseconds. */
  delay?: number
  className?: string
}

/** Fades + lifts its children into view the first time they intersect. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className={cn(inView ? 'animate-fade-up' : 'opacity-0', className)}
    >
      {children}
    </div>
  )
}

/* ----------------------------------------------------------------- Section */
type SectionProps = {
  id: string
  children: ReactNode
  className?: string
  /** Adds a hairline top border — used to separate adjacent bands. */
  bordered?: boolean
}

export function Section({ id, children, className, bordered }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn(
        'relative scroll-mt-24 px-5 py-20 sm:px-8 md:py-28',
        bordered && 'border-t border-line',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  )
}

/* -------------------------------------------------------- Section heading */
type SectionHeadingProps = {
  id: string
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  actions?: ReactNode
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'left',
  actions,
}: SectionHeadingProps) {
  const centered = align === 'center'

  return (
    <Reveal>
      <div
        className={cn(
          'mb-12 flex flex-col gap-6 md:mb-16',
          centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        )}
      >
        <div className={cn('max-w-2xl', centered && 'mx-auto')}>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-obsidian-card px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.18em] text-ink-muted uppercase">
            <span className="size-1.5 rounded-full bg-brand-gradient" aria-hidden="true" />
            {eyebrow}
          </span>

          <h2
            id={`${id}-heading`}
            className="mt-5 text-3xl leading-[1.08] font-bold tracking-tight text-balance sm:text-4xl md:text-[2.75rem]"
          >
            {title}
          </h2>

          {description && (
            <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </Reveal>
  )
}

/* ------------------------------------------------------------------- Badge */
type BadgeProps = {
  children: ReactNode
  tone?: 'neutral' | 'violet' | 'cyan' | 'emerald'
  className?: string
}

const TONES: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'border-line bg-white/[0.04] text-ink-muted',
  violet: 'border-violet-brand/30 bg-violet-brand/10 text-violet-brand',
  cyan: 'border-cyan-brand/30 bg-cyan-brand/10 text-cyan-brand',
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------- Card */
type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'gradient-border rounded-xl2 border border-line bg-obsidian-card/70 shadow-card transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
