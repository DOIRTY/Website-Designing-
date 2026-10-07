import { useState } from 'react'
import { ArrowRight, Layers, Send } from 'lucide-react'
import { DribbbleMark, GithubMark, LinkedinMark, XMark } from '@/components/ui/BrandIcons'
import { SECTIONS } from '@/data/site'
import { buttonClasses } from '@/components/ui/Button'
import { Input } from '@/components/ui/Field'
import { useToast } from '@/components/ui/Toast'
import { scrollToSection } from '@/hooks/useUi'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

const SOCIALS: { label: string; href: string; Icon: typeof XMark }[] = [
  { label: 'X (Twitter)', href: 'https://x.com', Icon: XMark },
  { label: 'Dribbble', href: 'https://dribbble.com', Icon: DribbbleMark },
  { label: 'GitHub', href: 'https://github.com', Icon: GithubMark },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedinMark },
]

const RESOURCES = [
  'Design system checklist',
  'Pricing guide',
  'Process playbook',
  'Open roles',
  'Contact',
]

export function Footer() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = (event: React.FormEvent) => {
    event.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    setError(undefined)
    setSubscribed(true)
    toast({
      title: "You're on the list",
      description: 'One considered email a month. Unsubscribe in a click.',
    })
  }

  return (
    <footer className="border-t border-line bg-obsidian-card/40">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          {/* Brand + newsletter */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative grid size-8 place-items-center rounded-[0.6rem] bg-brand-gradient text-white">
                <Layers className="size-4" aria-hidden="true" />
                <span
                  className="absolute -top-0.5 -right-0.5 size-2.5 animate-pulse-ring rounded-full border-2 border-obsidian bg-emerald-400"
                  aria-hidden="true"
                />
              </span>
              <span className="text-[0.95rem] font-semibold tracking-tight text-ink">
                Studio Craft
              </span>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">
              A design and engineering collective building interfaces that convert. Remote-first,
              senior-only, and genuinely pleasant to work with.
            </p>

            {/* Newsletter */}
            <form onSubmit={subscribe} noValidate className="mt-7 max-w-md">
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <Input
                    id="newsletter"
                    label="Monthly design letter"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError(undefined)
                      setSubscribed(false)
                    }}
                    error={error}
                  />
                </div>
                <button
                  type="submit"
                  className={buttonClasses({ className: 'h-11 shrink-0 sm:self-start' })}
                >
                  {subscribed ? 'Subscribed' : 'Subscribe'}
                  {!subscribed && <Send className="size-4" aria-hidden="true" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-ink-subtle">
                One considered email a month. No spam, ever.
              </p>
            </form>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <nav aria-labelledby="footer-nav">
              <h2
                id="footer-nav"
                className="text-xs font-semibold tracking-[0.16em] text-ink-subtle uppercase"
              >
                Navigate
              </h2>
              <ul className="mt-4 grid gap-2.5">
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToSection(section.id)
                      }}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-xs font-semibold tracking-[0.16em] text-ink-subtle uppercase">
                Resources
              </h2>
              <ul className="mt-4 grid gap-2.5">
                {RESOURCES.map((item) => (
                  <li key={item}>
                    <a
                      href="#estimator"
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToSection('estimator')
                      }}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-semibold tracking-[0.16em] text-ink-subtle uppercase">
                Studio
              </h2>
              <ul className="mt-4 grid gap-2.5 text-sm text-ink-muted">
                <li>
                  <a
                    href="mailto:hello@studiocraft.design"
                    className="transition-colors hover:text-ink"
                  >
                    hello@studiocraft.design
                  </a>
                </li>
                <li>Remote · 8 timezones</li>
                <li className="inline-flex items-center gap-2">
                  <span
                    className="size-1.5 animate-pulse-ring rounded-full bg-emerald-400"
                    aria-hidden="true"
                  />
                  <span className="text-emerald-400">All systems operational</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Base bar */}
        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-6 border-t border-line pt-7 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-subtle">
            © {new Date().getFullYear()} Studio Craft. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            {SOCIALS.map(({ label, href, Icon }) => {
              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-xl border border-line text-ink-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-brand/40 hover:bg-violet-brand/10 hover:text-ink"
                >
                  <Icon className="size-4" />
                </a>
              )
            })}
            <a
              href="#estimator"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('estimator')
              }}
              className={buttonClasses({ variant: 'outline', size: 'sm', className: 'ml-2' })}
            >
              Start a project
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
