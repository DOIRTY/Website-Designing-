import { useEffect, useRef, useState } from 'react'
import { Layers, Menu, X } from 'lucide-react'
import { NAV_IDS, SECTIONS } from '@/data/site'
import { scrollToSection, useScrollSpy, useScrolled } from '@/hooks/useUi'
import { buttonClasses } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useScrolled(12)
  const active = useScrollSpy(NAV_IDS)
  const panelRef = useRef<HTMLDivElement>(null)

  // close the mobile sheet on Escape or when the viewport grows
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen])

  const go = (id: string) => {
    setMenuOpen(false)
    scrollToSection(id)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        scrolled
          ? 'border-b border-line bg-obsidian/80 backdrop-blur-xl supports-[backdrop-filter]:bg-obsidian/65'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-5 sm:px-8">
        {/* Brand */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-brand"
        >
          <span className="relative grid size-8 place-items-center rounded-[0.6rem] bg-brand-gradient text-white shadow-[0_6px_20px_-6px_rgb(139_92_246_/_0.8)]">
            <Layers className="size-4" aria-hidden="true" />
            <span
              className="absolute -top-0.5 -right-0.5 size-2.5 animate-pulse-ring rounded-full border-2 border-obsidian bg-emerald-400"
              aria-hidden="true"
            />
          </span>
          <span className="text-[0.95rem] font-semibold tracking-tight text-ink">Studio Craft</span>
          <span className="sr-only">— 3 project slots open, all systems operational</span>
        </a>

        {/* Desktop links */}
        <nav aria-label="Primary" className="ml-6 hidden lg:block">
          <ul className="flex items-center gap-1">
            {SECTIONS.map((section) => {
              const isActive = active === section.id
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      go(section.id)
                    }}
                    className={cn(
                      'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
                      isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {section.label}
                    <span
                      className={cn(
                        'absolute inset-x-3 -bottom-0.5 h-px origin-center bg-brand-gradient transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        isActive ? 'scale-x-100' : 'scale-x-0',
                      )}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => go('jobs')}
            className={buttonClasses({
              variant: 'outline',
              size: 'sm',
              className: 'hidden sm:inline-flex',
            })}
          >
            Apply as Designer
          </button>
          <button
            type="button"
            onClick={() => go('estimator')}
            className={buttonClasses({ variant: 'primary', size: 'sm' })}
          >
            Hire Us
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="grid size-10 place-items-center rounded-lg border border-line text-ink-muted transition-colors hover:text-ink lg:hidden"
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        ref={panelRef}
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-line bg-obsidian/95 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Mobile" className="px-5 py-4 sm:px-8">
          <ul className="grid gap-1">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    go(section.id)
                  }}
                  className={cn(
                    'block rounded-lg px-3 py-3 text-base font-medium transition-colors',
                    active === section.id
                      ? 'bg-white/5 text-ink'
                      : 'text-ink-muted hover:bg-white/5 hover:text-ink',
                  )}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => go('jobs')}
            className={buttonClasses({
              variant: 'outline',
              className: 'mt-4 w-full sm:hidden',
            })}
          >
            Apply as Designer
          </button>
        </nav>
      </div>
    </header>
  )
}
