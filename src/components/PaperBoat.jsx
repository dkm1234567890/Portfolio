import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

// Same command structure in both (M Q Q Z) — that's the requirement for
// Motion to interpolate a path. Different point counts silently fail.
const FLAG_REST   = 'M70,12 Q80,15 90,18 Q80,21 70,24 Z'
const FLAG_BILLOW = 'M70,12 Q82,13 94,18 Q82,23 70,24 Z'

export default function PaperBoat({ size = 240 }) {
  // Motion's own useReducedMotion() reads the OS setting once on mount and
  // never again — a live toggle mid-session (no reload) would leave the
  // rock/flutter loop running. usePrefersReducedMotion() re-reads on change.
  const reduced = usePrefersReducedMotion()

  const rock = reduced
    ? {}
    : {
        animate: { y: [0, -2.5, 0, -1, 0], rotate: [0, 1.2, 0, -1, 0] },
        transition: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
        style: { transformBox: 'fill-box', transformOrigin: 'center' },
      }

  const flutter = reduced
    ? {}
    : {
        // Explicit `initial` — without it Motion has to infer the starting
        // `d` for the keyframe animation and briefly resolves it to
        // undefined on mount, which the browser logs as an SVG attribute
        // error ("attribute d: Expected moveto path command").
        initial: { d: FLAG_REST },
        animate: { d: [FLAG_REST, FLAG_BILLOW, FLAG_REST] },
        transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
      }

  return (
    <svg
      viewBox="0 0 140 110"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="A small sailing ship with a red flag"
    >
      <motion.g {...rock}>
        {/* mast */}
        <path d="M68,12 L68,78" stroke="var(--hull-shade)"
              strokeWidth="3.5" strokeLinecap="round" />

        {/* flag — flutters on its own clock, faster than the ship rocks.
            Two independent rhythms is what stops it feeling mechanical. */}
        <motion.path
          d={FLAG_REST}
          fill="var(--flag)"
          stroke="var(--flag-dark)"
          strokeWidth="1"
          strokeLinejoin="round"
          {...flutter}
        />

        {/* sails — two tones, light from the upper left */}
        <path d="M66,42 L66,77 L33,77 Z" fill="var(--sail-shade)"
              stroke="var(--hull-shade)" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M71.5,30 L71.5,77 L113,77 Z" fill="var(--sail)"
              stroke="var(--hull-shade)" strokeWidth="1.5" strokeLinejoin="round" />

        {/* hull — your shape, kept */}
        <path d="M14,78 H124 L108,98 Q69,106 30,98 Z"
              fill="var(--hull)" stroke="var(--hull-shade)"
              strokeWidth="2" strokeLinejoin="round" />

        {/* shaded facet on the right half. One flat overlay, no gradient —
            this is the whole trick to depth in flat art. */}
        <path d="M69,78 H124 L108,98 Q69,106 69,106 Z"
              fill="var(--hull-shade)" opacity="0.2" />

        {/* deck stripe, drawn last so it reads across both facets */}
        <rect x="24" y="83" width="92" height="5" fill="var(--deck)" />
      </motion.g>
    </svg>
  )
}