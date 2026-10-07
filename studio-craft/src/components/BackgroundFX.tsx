/**
 * Fixed, non-interactive atmosphere layer: grid, drifting colour orbs and grain.
 * Sits behind everything and never intercepts pointer events.
 */
export function BackgroundFX() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base glow */}
      <div className="absolute inset-x-0 top-0 h-[46rem] bg-[radial-gradient(120%_70%_at_50%_-10%,rgb(139_92_246_/_0.16),transparent_62%)]" />

      {/* Grid */}
      <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(110%_60%_at_50%_0%,#000_18%,transparent_72%)]" />

      {/* Orbs */}
      <div className="animate-drift absolute -top-40 -left-32 size-[34rem] rounded-full bg-violet-brand/14 blur-[110px]" />
      <div className="animate-drift absolute top-40 -right-40 size-[30rem] rounded-full bg-cyan-brand/12 blur-[110px] [animation-delay:-8s]" />
      <div className="animate-drift absolute bottom-0 left-1/3 size-[26rem] rounded-full bg-violet-brand/8 blur-[120px] [animation-delay:-16s]" />

      {/* Grain */}
      <div className="noise absolute inset-0 opacity-[0.022]" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_50%,transparent_35%,rgb(9_9_11_/_0.75)_100%)]" />
    </div>
  )
}
