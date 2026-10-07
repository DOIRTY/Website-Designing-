import { TRUST_LOGOS } from '@/data/site'

/**
 * Infinite client logo strip. The track holds two identical groups and slides
 * by exactly -50%, so the loop is seamless. Pauses on hover.
 */
export function Marquee() {
  return (
    <section
      className="group relative border-y border-line bg-obsidian-card/40 py-6"
      aria-label="Selected clients"
    >
      <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="animate-marquee flex shrink-0 group-hover:[animation-play-state:paused]">
          <Group />
          <Group ariaHidden />
        </div>
      </div>
    </section>
  )
}

function Group({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={ariaHidden ? true : undefined}
    >
      {TRUST_LOGOS.map((logo) => (
        <span
          key={logo}
          className="text-base font-semibold tracking-tight whitespace-nowrap text-ink-subtle transition-colors hover:text-ink"
        >
          {logo}
        </span>
      ))}
    </div>
  )
}
