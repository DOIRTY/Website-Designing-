import { BackgroundFX } from '@/components/BackgroundFX'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Marquee } from '@/components/Marquee'
import { Services } from '@/components/Services'
import { Work } from '@/components/Work'
import { JobBoard } from '@/components/JobBoard'
import { Estimator } from '@/components/Estimator'
import { Pricing } from '@/components/Pricing'
import { About } from '@/components/About'
import { Testimonials } from '@/components/Testimonials'
import { Footer } from '@/components/Footer'

export default function App() {
  return (
    <>
      <BackgroundFX />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200 focus:rounded-lg focus:bg-obsidian-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink focus:shadow-lift"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <Marquee />
        <Services />
        <Work />
        <JobBoard />
        <Estimator />
        <Pricing />
        <About />
        <Testimonials />
      </main>

      <Footer />
    </>
  )
}
