import { useState } from 'react'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { PLANS } from '@/data/pricing'
import { Reveal, Section, SectionHeading } from '@/components/ui/Primitives'
import { buttonClasses } from '@/components/ui/Button'
import { scrollToSection } from '@/hooks/useUi'
import { cn } from '@/lib/cn'

const BILLING = [
  { id: 'monthly', label: 'Monthly', note: '3-month minimum' },
  { id: 'annual', label: 'Annual', note: 'Save 20%' },
] as const

type BillingId = (typeof BILLING)[number]['id']

export function Pricing() {
  const [billing, setBilling] = useState<BillingId>('monthly')
  const discounted = billing === 'annual'

  return (
    <Section id="pricing" bordered>
      <SectionHeading
        id="pricing"
        eyebrow="Engagements"
        title={
          <>
            Simple retainers. <span className="text-gradient">No hourly surprises.</span>
          </>
        }
        description="Pick a pod, pause whenever, keep everything we make — files, code and systems included."
        align="center"
      />

      {/* Billing toggle */}
      <Reveal className="mb-10 flex justify-center">
        <div
          role="radiogroup"
          aria-label="Billing period"
          className="relative inline-flex rounded-full border border-line bg-obsidian-card p-1"
        >
          <span
            aria-hidden="true"
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-brand-gradient transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `translateX(${discounted ? 100 : 0}%)` }}
          />
          {BILLING.map((option) => {
            const selected = billing === option.id
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setBilling(option.id)}
                className={cn(
                  'relative z-10 flex-1 rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300',
                  selected ? 'text-white' : 'text-ink-muted hover:text-ink',
                )}
              >
                {option.label}
                <span
                  className={cn(
                    'ml-2 text-xs font-normal',
                    selected ? 'text-white/70' : 'text-ink-subtle',
                  )}
                >
                  {option.note}
                </span>
              </button>
            )
          })}
        </div>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan, index) => {
          const price = discounted ? Math.round((plan.monthly * 0.8) / 100) * 100 : plan.monthly
          return (
            <Reveal key={plan.id} delay={index * 80}>
              <article
                className={cn(
                  'group relative flex h-full flex-col rounded-xl2 border p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-7',
                  plan.featured
                    ? 'border-violet-brand/40 bg-gradient-to-b from-violet-brand/8 to-obsidian-card/60 shadow-glow-violet lg:-translate-y-3'
                    : 'border-line bg-obsidian-card/60 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift',
                )}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3 py-1 text-[0.6875rem] font-bold tracking-[0.12em] text-white uppercase">
                    <Sparkles className="size-3" aria-hidden="true" />
                    Most booked
                  </span>
                )}

                <h3 className="text-lg font-semibold tracking-tight text-ink">{plan.name}</h3>
                <p className="mt-2 min-h-10 text-sm leading-relaxed text-ink-muted">
                  {plan.tagline}
                </p>

                <p className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-ink tabular-nums">
                    ${price.toLocaleString('en-US')}
                  </span>
                  <span className="text-sm text-ink-subtle">/ month</span>
                </p>
                <p className="mt-1 text-xs text-ink-subtle">
                  {plan.bestFor}
                  {discounted && ' · billed annually'}
                </p>

                <ul className="mt-6 grid flex-1 gap-3 border-t border-line pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-muted">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-violet-brand"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => scrollToSection('estimator')}
                  className={buttonClasses({
                    variant: plan.featured ? 'primary' : 'subtle',
                    className: 'mt-7 w-full',
                  })}
                >
                  {plan.cta}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>
              </article>
            </Reveal>
          )
        })}
      </div>

      <Reveal delay={240}>
        <p className="mt-8 text-center text-sm text-ink-subtle">
          Prefer a fixed price?{' '}
          <button
            type="button"
            onClick={() => scrollToSection('estimator')}
            className="font-medium text-violet-brand underline underline-offset-4 transition-colors hover:text-ink"
          >
            Build an estimate in the calculator above
          </button>
          .
        </p>
      </Reveal>
    </Section>
  )
}
