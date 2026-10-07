import { useEffect, useState } from 'react'

/** Locks body scroll while an overlay is open (restores the previous value). */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}

/**
 * Tracks which section is currently in view for nav highlighting.
 * @param ids section ids, without the leading `#`
 */
export function useScrollSpy(ids: string[], offset = 140): string {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const onScroll = () => {
      let current = ids[0] ?? ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - offset <= 0) current = id
      }
      // snap to the last section when the page is scrolled to the bottom
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = ids[ids.length - 1] ?? current
      }
      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids, offset])

  return active
}

/** True once the user has scrolled past `threshold` pixels. */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

/** Smooth-scrolls to a section id, accounting for the sticky header. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  if (window.history.replaceState) window.history.replaceState(null, '', `#${id}`)
}

/** Keeps keyboard focus inside an open overlay (WCAG 2.2 — focus not obscured/contained). */
export function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    const focusFirst = () => {
      const container = containerRef.current
      if (!container) return
      const target = container.querySelector<HTMLElement>(
        'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [href]',
      )
      ;(target ?? container).focus({ preventScroll: true })
    }
    const raf = requestAnimationFrame(focusFirst)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const container = containerRef.current
      if (!container) return

      const items = Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null)
      if (items.length === 0) return

      const first = items[0]!
      const last = items[items.length - 1]!
      const activeEl = document.activeElement

      if (event.shiftKey && (activeEl === first || activeEl === container)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [active, containerRef])
}
