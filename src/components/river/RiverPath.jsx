import { forwardRef } from 'react'
import { motion } from 'motion/react'

// Fixed, tall viewBox + preserveAspectRatio="none" lets the SVG stretch to
// fill its container, so the path maths stays resolution-independent.
// Exported so Task 6's Ship can convert getPointAtLength's viewBox-unit
// coordinates into screen pixels via the rendered SVG's bounding rect ratio.
export const VIEWBOX_WIDTH = 100
export const VIEWBOX_HEIGHT = 1400
const VIEWBOX = `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`

// Desktop: wide lazy S-curves swinging ±30 around centre (x 20..80), 7 bends
// over the full height.
const DESKTOP_D =
  'M50,0 C80,66 80,133 50,200 C20,266 20,333 50,400 C80,466 80,533 50,600 ' +
  'C20,666 20,733 50,800 C80,866 80,933 50,1000 C20,1066 20,1133 50,1200 ' +
  'C80,1266 80,1333 50,1400'

// Mobile: a gentle narrow wave, amplitude ~12 (x 38..62), so no content is
// pushed off the side of a phone.
const MOBILE_D =
  'M50,0 C62,66 62,133 50,200 C38,266 38,333 50,400 C62,466 62,533 50,600 ' +
  'C38,666 38,733 50,800 C62,866 62,933 50,1000 C38,1066 38,1133 50,1200 ' +
  'C62,1266 62,1333 50,1400'

// Three stacked strokes on the same `d`, back to front: a wide base, a mid
// tone, and a thin dashed "current" line that loops to read as flowing water.
// The base path is forwarded out so River (and Task 6's ship) can read its
// geometry with getTotalLength / getPointAtLength.
const RiverPath = forwardRef(function RiverPath(
  { isDesktop, reduced, progress },
  baseRef
) {
  const d = isDesktop ? DESKTOP_D : MOBILE_D
  // Reduced motion → fully drawn and static. Otherwise draw with scroll.
  const drawn = reduced ? 1 : progress

  return (
    <svg
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      viewBox={VIEWBOX}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* 1 — wide base, sits deepest */}
      <motion.path
        ref={baseRef}
        d={d}
        fill="none"
        stroke="var(--water-deep)"
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.35"
        style={{ pathLength: drawn }}
      />
      {/* 2 — mid tone, drawn with the base */}
      <motion.path
        d={d}
        fill="none"
        stroke="var(--water-mid)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.7"
        style={{ pathLength: drawn }}
      />
      {/* 3 — thin dashed current; loops forever unless reduced motion */}
      <motion.path
        d={d}
        fill="none"
        stroke="var(--water-foam)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
        strokeDasharray="2 6"
        animate={reduced ? undefined : { strokeDashoffset: [0, -8] }}
        transition={
          reduced
            ? undefined
            : { duration: 1.4, repeat: Infinity, ease: 'linear' }
        }
      />
    </svg>
  )
})

export default RiverPath
