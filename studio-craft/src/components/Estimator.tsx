import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Check,
  Clock,
  RotateCcw,
  Send,
  Sparkles,
} from 'lucide-react'
import {
  DELIVERABLES,
  PROJECT_TYPES,
  TIMELINES,
  calculateEstimate,
  formatCurrency,
  type EstimateBreakdown,
} from '@/data/estimator'
import { Reveal, Section, SectionHeading } from '@/components/ui/Primitives'
import { Button, buttonClasses } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { Input } from '@/components/ui/Field'
import { useToast } from '@/components/ui/Toast'
import { usePrefersReducedMotion } from '@/hooks/useInView'
import { cn } from '@/lib/cn'

/* ------------------------------------------------------- animated counter */
function AnimatedCurrency({ value }: { value: number }) {
  const reduced = usePrefersReducedMotion()
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)

  useEffect(() => {
    if (reduced) {
      fromRef.current = value
      setDisplay(value)
      return
    }
    const from = fromRef.current
    const start = performance.now()
    const duration = 650
    let raf = 0

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(from + (value - from) * eased))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        fromRef.current = value
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, reduced])

  return <>{formatCurrency(display)}</>
}

/* --------------------------------------------------------------- estimator */
const STEPS = ['Project type', 'Deliverables', 'Timeline'] as const

export function Estimator() {
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]!.id)
  const [deliverables, setDeliverables] = useState<string[]>(['figma'])
  const [timeline, setTimeline] = useState(TIMELINES[1]!.id)
  const [briefOpen, setBriefOpen] = useState(false)

  const estimate = calculateEstimate({ projectType, deliverables, timeline })

  const toggleDeliverable = (id: string) =>
    setDeliverables((current) =>
      current.includes(id) ? current.filter((d) => d !== id) : [...current, id],
    )

  const reset = () => {
    setStep(0)
    setProjectType(PROJECT_TYPES[0]!.id)
    setDeliverables(['figma'])
    setTimeline(TIMELINES[1]!.id)
  }

  return (
    <Section id="estimator" bordered>
      <SectionHeading
        id="estimator"
        eyebrow="Project estimator"
        title={
          <>
            Know the number <span className="text-gradient">before the call</span>
          </>
        }
        description="Three questions, no email wall. You'll get an indicative budget and a realistic timeline you can take to your board."
        align="center"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        {/* ---------------------------------------------------------- steps */}
        <Reveal className="min-w-0">
          <div className="overflow-hidden rounded-xl2 border border-line bg-obsidian-card/60 backdrop-blur-md">
            {/* Step rail */}
            <div className="flex items-center gap-2 border-b border-line px-5 py-4 sm:px-6">
              {STEPS.map((label, index) => {
                const done = index < step
                const currentStep = index === step
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => done && setStep(index)}
                    disabled={!done}
                    aria-current={currentStep ? 'step' : undefined}
                    className={cn(
                      'flex min-w-0 flex-1 items-center gap-2.5 text-left transition-opacity',
                      done ? 'cursor-pointer' : 'cursor-default',
                      currentStep || done ? 'opacity-100' : 'opacity-45',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-all duration-300',
                        done
                          ? 'border-transparent bg-brand-gradient text-white'
                          : currentStep
                            ? 'border-violet-brand bg-violet-brand/10 text-violet-brand'
                            : 'border-line text-ink-subtle',
                      )}
                      aria-hidden="true"
                    >
                      {done ? <Check className="size-3.5" /> : index + 1}
                    </span>
                    <span
                      className={cn(
                        'hidden truncate text-sm font-medium sm:block',
                        currentStep ? 'text-ink' : 'text-ink-muted',
                      )}
                    >
                      {label}
                    </span>
                    {index < STEPS.length - 1 && (
                      <span
                        className={cn(
                          'ml-auto hidden h-px flex-1 sm:block',
                          done ? 'bg-brand-gradient' : 'bg-line',
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Step body */}
            <div className="p-5 sm:p-6">
              {step === 0 && (
                <fieldset>
                  <legend className="text-base font-semibold text-ink">
                    What are we building?
                  </legend>
                  <div
                    role="radiogroup"
                    aria-label="Project type"
                    className="mt-4 grid gap-3 sm:grid-cols-3"
                  >
                    {PROJECT_TYPES.map((type) => {
                      const selected = projectType === type.id
                      return (
                        <button
                          key={type.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setProjectType(type.id)}
                          className={cn(
                            'rounded-xl border p-4 text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                            selected
                              ? 'border-violet-brand/60 bg-violet-brand/8 shadow-glow-violet'
                              : 'border-line bg-obsidian hover:-translate-y-0.5 hover:border-line-strong',
                          )}
                        >
                          <span className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-ink">{type.label}</span>
                            <span
                              className={cn(
                                'grid size-5 place-items-center rounded-full border transition-colors',
                                selected
                                  ? 'border-violet-brand bg-brand-gradient text-white'
                                  : 'border-line-strong',
                              )}
                              aria-hidden="true"
                            >
                              {selected && <Check className="size-3" />}
                            </span>
                          </span>
                          <span className="mt-2 block text-xs leading-relaxed text-ink-muted">
                            {type.description}
                          </span>
                          <span className="mt-3 block text-sm font-semibold text-cyan-brand">
                            {formatCurrency(type.base)} · {type.weeks}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              )}

              {step === 1 && (
                <fieldset>
                  <legend className="text-base font-semibold text-ink">
                    What do you need handed over?
                  </legend>
                  <p className="mt-1 text-sm text-ink-subtle">Pick everything that applies.</p>
                  <div className="mt-4 grid gap-3">
                    {DELIVERABLES.map((item) => {
                      const selected = deliverables.includes(item.id)
                      const price = item.flat ?? 0
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleDeliverable(item.id)}
                          className={cn(
                            'flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300',
                            selected
                              ? 'border-violet-brand/60 bg-violet-brand/8'
                              : 'border-line bg-obsidian hover:border-line-strong',
                          )}
                        >
                          <span
                            className={cn(
                              'grid size-5 shrink-0 place-items-center rounded-md border transition-all duration-300',
                              selected
                                ? 'border-transparent bg-brand-gradient text-white'
                                : 'border-line-strong',
                            )}
                            aria-hidden="true"
                          >
                            {selected && <Check className="size-3" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-ink">
                              {item.label}
                            </span>
                            <span className="block text-xs text-ink-muted">{item.description}</span>
                          </span>
                          <span className="shrink-0 text-sm font-semibold text-ink-muted">
                            {price === 0
                              ? 'Included'
                              : item.multiplier
                                ? `+${Math.round(item.multiplier * 100)}%`
                                : `+${formatCurrency(price)}`}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <fieldset>
                  <legend className="text-base font-semibold text-ink">
                    How fast do you need it?
                  </legend>
                  <div role="radiogroup" aria-label="Timeline" className="mt-4 grid gap-3">
                    {TIMELINES.map((option) => {
                      const selected = timeline === option.id
                      return (
                        <button
                          key={option.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setTimeline(option.id)}
                          className={cn(
                            'flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300',
                            selected
                              ? 'border-violet-brand/60 bg-violet-brand/8'
                              : 'border-line bg-obsidian hover:border-line-strong',
                          )}
                        >
                          <span
                            className={cn(
                              'grid size-5 shrink-0 place-items-center rounded-full border transition-all',
                              selected
                                ? 'border-violet-brand bg-brand-gradient text-white'
                                : 'border-line-strong',
                            )}
                            aria-hidden="true"
                          >
                            {selected && <Check className="size-3" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-ink">
                              {option.label}
                            </span>
                            <span className="block text-xs text-ink-muted">
                              {option.description}
                            </span>
                          </span>
                          <span
                            className={cn(
                              'shrink-0 text-sm font-semibold',
                              option.multiplier > 1
                                ? 'text-amber-400'
                                : option.multiplier < 1
                                  ? 'text-emerald-400'
                                  : 'text-ink-muted',
                            )}
                          >
                            ×{option.multiplier.toFixed(2)}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              )}

              {/* Controls */}
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (step === 0 ? reset() : setStep((s) => s - 1))}
                >
                  {step === 0 ? (
                    <>
                      <RotateCcw className="size-4" aria-hidden="true" />
                      Reset
                    </>
                  ) : (
                    <>
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      Back
                    </>
                  )}
                </Button>

                {step < STEPS.length - 1 ? (
                  <Button onClick={() => setStep((s) => s + 1)}>
                    Continue
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button onClick={() => setBriefOpen(true)}>
                    <Send className="size-4" aria-hidden="true" />
                    Submit Brief
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* -------------------------------------------------------- summary */}
        <Reveal delay={120} className="lg:sticky lg:top-24">
          <div className="relative overflow-hidden rounded-xl2 border border-line bg-obsidian-card/80 p-6 backdrop-blur-md">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-violet-brand/20 blur-3xl"
            />

            <div className="relative">
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-ink-subtle uppercase">
                <Calculator className="size-3.5" aria-hidden="true" />
                Indicative total
              </p>

              <p
                className="mt-3 text-4xl leading-none font-bold tracking-tight text-gradient tabular-nums sm:text-[2.75rem]"
                aria-live="polite"
                aria-atomic="true"
              >
                <AnimatedCurrency value={estimate.total} />
              </p>

              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-muted">
                <Clock className="size-3.5" aria-hidden="true" />
                Estimated delivery:{' '}
                <strong className="font-semibold text-ink">{estimate.weeks}</strong>
              </p>

              <ul className="mt-6 grid gap-2.5 border-t border-line pt-5 text-sm">
                {estimate.lines.map((line) => (
                  <li key={line.label} className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 truncate text-ink-muted">{line.label}</span>
                    <span className="shrink-0 font-medium tabular-nums text-ink">
                      {line.value === 0 ? '—' : formatCurrency(line.value)}
                    </span>
                  </li>
                ))}
                {estimate.multiplier !== 1 && (
                  <li className="flex items-baseline justify-between gap-3 text-ink-subtle">
                    <span>Timeline multiplier</span>
                    <span className="shrink-0 tabular-nums">×{estimate.multiplier.toFixed(2)}</span>
                  </li>
                )}
              </ul>

              <button
                type="button"
                onClick={() => setBriefOpen(true)}
                className={buttonClasses({ className: 'mt-6 w-full' })}
              >
                <Sparkles className="size-4" aria-hidden="true" />
                Submit this brief
              </button>

              <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
                Indicative only — final scope is confirmed after a 30-minute discovery call.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <BriefDrawer
        open={briefOpen}
        onClose={() => setBriefOpen(false)}
        estimate={estimate}
        onSent={() =>
          toast({
            title: 'Brief received',
            description: `We'll reply within one business day with a scoped plan for ${estimate.label}.`,
          })
        }
      />
    </Section>
  )
}

/* ------------------------------------------------------------ brief drawer */
function BriefDrawer({
  open,
  onClose,
  estimate,
  onSent,
}: {
  open: boolean
  onClose: () => void
  estimate: EstimateBreakdown
  onSent: () => void
}) {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [noteError, setNoteError] = useState<string | undefined>()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const nextEmail = EMAIL_RE.test(email.trim()) ? undefined : 'Enter a valid work email.'
    const nextName = name.trim().length >= 2 ? undefined : 'Please enter your name.'
    setError(nextEmail)
    setNoteError(nextName)
    if (nextEmail || nextName) return

    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      setSent(true)
      onSent()
    }, 1000)
  }

  const close = () => {
    onClose()
    window.setTimeout(() => {
      setSent(false)
      setEmail('')
      setName('')
      setError(undefined)
      setNoteError(undefined)
    }, 350)
  }

  return (
    <Drawer
      open={open}
      onClose={close}
      title={sent ? 'Brief sent' : 'Submit your brief'}
      description={
        sent
          ? 'A partner will review this personally and reply within one business day.'
          : `Estimated at ${formatCurrency(estimate.total)} · ${estimate.weeks}`
      }
    >
      {sent ? (
        <div className="grid gap-6">
          <div className="grid size-14 animate-check place-items-center rounded-full bg-brand-gradient text-white">
            <Check className="size-7" aria-hidden="true" />
          </div>
          <p className="text-sm leading-relaxed text-ink-muted">
            Thanks{name ? `, ${name.split(' ')[0]}` : ''} — your brief is with us. We'll come back
            with a scoped plan, a fixed price and a start date.
          </p>
          <Button variant="outline" onClick={close}>
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="grid gap-5">
          <div className="rounded-xl border border-line bg-obsidian p-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-ink-subtle uppercase">
              Summary
            </p>
            <p className="mt-2 text-2xl font-bold text-gradient tabular-nums">
              {formatCurrency(estimate.total)}
            </p>
            <ul className="mt-3 grid gap-1.5 text-sm">
              {estimate.lines.map((line) => (
                <li key={line.label} className="flex justify-between gap-3 text-ink-muted">
                  <span className="truncate">{line.label}</span>
                  <span className="tabular-nums">
                    {line.value === 0 ? 'Included' : formatCurrency(line.value)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-line pt-3 text-sm text-ink-muted">
              Delivery: <span className="font-semibold text-ink">{estimate.weeks}</span>
            </p>
          </div>

          <Input
            label="Your name"
            required
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setNoteError(undefined)
            }}
            error={noteError}
          />

          <Input
            label="Work email"
            type="email"
            required
            autoComplete="email"
            placeholder="ada@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(undefined)
            }}
            error={error}
          />

          <Button type="submit" size="lg" disabled={sending}>
            {sending ? (
              <>
                <span
                  className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden="true"
                />
                Sending…
              </>
            ) : (
              <>
                <Send className="size-4" aria-hidden="true" />
                Send brief
              </>
            )}
          </Button>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard
                ?.writeText(
                  `Studio Craft estimate\n${estimate.lines
                    .map(
                      (l) =>
                        `• ${l.label}: ${l.value === 0 ? 'Included' : formatCurrency(l.value)}`,
                    )
                    .join(
                      '\n',
                    )}\nTimeline multiplier: ×${estimate.multiplier.toFixed(2)}\nTotal: ${formatCurrency(estimate.total)}\nDelivery: ${estimate.weeks}`,
                )
                .then(() => toast({ title: 'Estimate copied to clipboard' }))
                .catch(() => toast({ title: 'Could not copy', tone: 'error' }))
            }}
            className="text-sm text-ink-subtle underline underline-offset-4 transition-colors hover:text-ink"
          >
            Copy estimate to clipboard
          </button>
        </form>
      )}
    </Drawer>
  )
}
