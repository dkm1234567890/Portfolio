import { motion } from 'motion/react'
import { profile } from '../data/profile'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const EASE = [0.22, 1, 0.36, 1]

// A small dock crate with a sheet of paper resting in the opening. Flat
// facets, light from the upper left, matching the ship/island style. The
// paper lifts on hover, purely decorative — no `whileFocus` here: Motion
// injects a `tabIndex` on any element using it, which turned this plain
// <g> into an unlabelled phantom Tab stop with nothing keyboard-reachable
// depending on it (the real control is the "Download resume" link below).
function CrateArt({ reduced }) {
  return (
    <svg viewBox="0 0 96 88" width={72} height={66} aria-hidden="true">
      {/* crate body */}
      <path
        d="M10,40 H86 V78 H10 Z"
        fill="var(--surface-2)"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M48,40 H86 V78 H48 Z" fill="var(--ink)" opacity="0.1" />
      {/* crate slats */}
      <path d="M10,58 H86 M30,40 V78 M66,40 V78" stroke="var(--primary)" strokeWidth="1.5" opacity="0.5" />

      {/* the paper, tucked into the crate opening */}
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
        animate={{ y: 0 }}
        whileHover={reduced ? undefined : { y: -10 }}
        transition={{ duration: reduced ? 0 : 0.32, ease: EASE }}
      >
        <rect
          x="28"
          y="10"
          width="40"
          height="34"
          rx="2"
          fill="var(--surface)"
          stroke="var(--border-strong)"
          strokeWidth="2"
        />
        <path d="M35,20 H61 M35,27 H61 M35,34 H51" stroke="var(--ink-muted)" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
    </svg>
  )
}

export default function ResumeBox() {
  const reduced = usePrefersReducedMotion()

  return (
    <section id="resume" aria-labelledby="resume-heading" className="flex w-full flex-col items-center px-6 py-16 text-center md:w-[320px]">
      <h2 id="resume-heading" className="font-display text-2xl font-semibold text-ink">
        Resume
      </h2>
      <p className="mt-1 max-w-xs text-sm text-ink-muted">Same story, shorter — one page, ready to download.</p>

      <div className="mt-6">
        <CrateArt reduced={reduced} />
      </div>

      <a
        href={import.meta.env.BASE_URL + profile.resume.file}
        download
        className="mt-4 rounded-full bg-accent-cta px-6 py-3 text-sm font-semibold text-accent-on transition-transform hover:-translate-y-0.5"
      >
        Download resume
      </a>
      <p className="mt-2 text-xs text-ink-muted">Updated {profile.resume.updated}</p>
    </section>
  )
}
