import { motion } from 'motion/react'
import PaperBoat from './PaperBoat'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { profile } from '../data/profile'

export default function Hero() {
  const reduced = usePrefersReducedMotion()

  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-16"
    >
      <div className="relative z-20 mx-auto w-full max-w-5xl">
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
          {/* Dead link is fine until Task 9 wires up the real PDF. */}
          <a
            href={import.meta.env.BASE_URL + profile.resume.file}
            className="rounded-full border border-border-strong px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            Download resume
          </a>
        </div>
      </div>

      {/* The ship rests on the waterline at the top of the band. */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 flex justify-center"
        style={{ bottom: 'calc(30vh - 48px)' }}
      >
        <PaperBoat size={220} />
      </div>

      {/* PLACEHOLDER water band — Task 5 replaces this with the real river. */}
      <div
        className="absolute inset-x-0 bottom-0 z-0 h-[30vh] border-t-4 border-primary bg-primary-soft"
        aria-hidden="true"
      />

      {/* Scroll cue — decorative, hidden entirely under reduced motion. */}
      {!reduced && (
        <motion.div
          className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-xs font-semibold uppercase tracking-widest text-ink-muted"
          aria-hidden="true"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          Scroll
        </motion.div>
      )}
    </section>
  )
}
