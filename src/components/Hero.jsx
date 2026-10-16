import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { profile } from '../data/profile'

export default function Hero() {
  const reduced = usePrefersReducedMotion()

  return (
    <section
      id="about"
      className="relative flex min-h-svh flex-col overflow-hidden pt-16"
    >
      <div className="relative z-20 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-12">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent-text">
          {profile.role}
        </p>

        <h1
          className="mt-3 font-display font-semibold leading-[1.05] text-ink"
          style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)' }}
        >
          {profile.name}
        </h1>

        <p className="mt-5 max-w-[60ch] text-lg text-ink sm:text-xl">
          {profile.tagline}
        </p>
        <p className="mt-4 max-w-[60ch] text-base text-ink-muted">
          {profile.intro}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="rounded-full bg-accent-cta px-6 py-3 text-sm font-semibold text-accent-on transition-transform hover:-translate-y-0.5"
          >
            See the work
          </a>
          <a
            href={import.meta.env.BASE_URL + profile.resume.file}
            className="rounded-full border border-border-strong px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            Download resume
          </a>
        </div>
      </div>

      {/* The water the river flows out of. No boat here: the river's own
          Ship starts at the top of the river directly below this band, and
          a second boat in the hero meant two were on screen at once while
          scrolling past it. In normal flow (not absolute) so a short window
          makes the section grow taller instead of the water riding up into
          the text. */}
      <div className="relative z-0 mt-12 shrink-0" aria-hidden="true">
        <div className="h-[30vh] border-t-4 border-primary bg-primary-soft" />

        {/* Scroll cue — decorative, hidden entirely under reduced motion. */}
        {!reduced && (
          <motion.div
            className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-xs font-semibold uppercase tracking-widest text-ink-muted"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            Scroll
          </motion.div>
        )}
      </div>
    </section>
  )
}
