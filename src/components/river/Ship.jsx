import { useCallback, useEffect, useMemo, useRef } from 'react'
import { motion, useMotionValue, useMotionValueEvent } from 'motion/react'
import { animate } from 'motion'
import PaperBoat from '../PaperBoat'
import { VIEWBOX_WIDTH, VIEWBOX_HEIGHT } from './RiverPath'
import { stops, anchorFor } from '../../data/stops'

// Rendered size of the boat art. Its hull is drawn bow-down (the taper sits
// at the bottom of the viewBox), so a 0deg rotation already reads as "facing
// down the river" — the neutral heading the tangent angle is measured against.
const SHIP_SIZE = 84
const SHIP_ASPECT = 110 / 140

const LEAD = 0.02 // ship rides this far ahead of the drawn river length
const ROTATE_DAMP = 0.15 // per-update lerp toward the target heading
const MAX_TILT = 20 // degrees either side of "facing downstream"

// Fraction of total path length each wake dot trails behind the ship.
const WAKE_OFFSETS = [0.006, 0.013, 0.022, 0.034]
const WAKE_STYLE = [
  { r: 2.6, opacity: 0.5 },
  { r: 2.1, opacity: 0.36 },
  { r: 1.7, opacity: 0.24 },
  { r: 1.3, opacity: 0.14 },
]

const ANCHORS = stops.map((_, i) => anchorFor(i, stops.length))

// Splashes are one-shot bursts, not continuous motion, but they still must
// never touch React state on the scroll path (see positionAt below) — a
// setState here, however rare, would put the Ship component back in the
// commit list during a scroll recording. Instead a fixed pool of circles is
// mounted once and driven with Motion's imperative `animate()` directly on
// the DOM nodes, cycled round-robin so a fast scroll crossing several
// anchors in one frame doesn't need to mount anything new.
const SPLASH_POOL_SIZE = 3
const SPLASH_CIRCLE_COUNT = 7
const SPLASH_ANGLES = Array.from({ length: SPLASH_CIRCLE_COUNT }, (_, i) => (i / SPLASH_CIRCLE_COUNT) * Math.PI * 2)

function clamp01(n) {
  return Math.max(0, Math.min(1, n))
}

// Follows the river path from scroll progress. Everything that changes every
// frame — position, heading, wake — lives in MotionValues written directly
// to the DOM by Motion; nothing here calls a React state setter on scroll,
// so the component never re-renders while the page does.
//
// `pathRef` is River's base <path> (for getTotalLength/getPointAtLength),
// `pathLenRef` is its cached total length (a ref, recomputed by River on
// resize/variant-swap), `progress` is River's scrollYProgress MotionValue.
export default function Ship({ pathRef, pathLenRef, progress, reduced }) {
  const wrapperRef = useRef(null)
  const idleTimerRef = useRef(null)
  const rotationRef = useRef(0)
  const crossedRef = useRef(-1)
  const splashPoolRef = useRef([]) // splashPoolRef.current[slot] = circle DOM nodes for that slot
  const nextSplashSlotRef = useRef(0)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useMotionValue(0)
  const wakeX0 = useMotionValue(0)
  const wakeX1 = useMotionValue(0)
  const wakeX2 = useMotionValue(0)
  const wakeX3 = useMotionValue(0)
  const wakeY0 = useMotionValue(0)
  const wakeY1 = useMotionValue(0)
  const wakeY2 = useMotionValue(0)
  const wakeY3 = useMotionValue(0)
  // MotionValues are stable across renders; memoizing the grouping array
  // (rather than writing `[useMotionValue(0), ...]` inline) keeps positionAt's
  // dependency array from changing every render.
  const wakeX = useMemo(() => [wakeX0, wakeX1, wakeX2, wakeX3], [wakeX0, wakeX1, wakeX2, wakeX3])
  const wakeY = useMemo(() => [wakeY0, wakeY1, wakeY2, wakeY3], [wakeY0, wakeY1, wakeY2, wakeY3])

  // Takes the next pool slot round-robin and animates its circles outward
  // from (x, y) via Motion's imperative `animate()` — a direct DOM write,
  // not a React state change, so this never re-renders Ship.
  const fireSplash = useCallback((sx, sy) => {
    const slot = splashPoolRef.current[nextSplashSlotRef.current]
    nextSplashSlotRef.current = (nextSplashSlotRef.current + 1) % SPLASH_POOL_SIZE
    if (!slot) return
    slot.forEach((circle, i) => {
      if (!circle) return
      const angle = SPLASH_ANGLES[i]
      animate(
        circle,
        { cx: [sx, sx + Math.cos(angle) * 11], cy: [sy, sy + Math.sin(angle) * 7], opacity: [1, 0] },
        { type: 'spring', stiffness: 260, damping: 18 }
      )
    })
  }, [])

  // All geometry reads happen first and are cached in locals; MotionValue
  // writes happen only after every read is done, so a read never has to
  // flush layout invalidated by an earlier write in the same pass.
  const positionAt = useCallback(
    (rawT) => {
      const pathEl = pathRef.current
      const wrapper = wrapperRef.current
      if (!pathEl || !wrapper || !pathEl.ownerSVGElement) return

      const len = pathLenRef.current || pathEl.getTotalLength()
      if (!len) return
      const shipT = clamp01(rawT - LEAD)

      const svgRect = pathEl.ownerSVGElement.getBoundingClientRect()
      const containerRect = wrapper.offsetParent
        ? wrapper.offsetParent.getBoundingClientRect()
        : svgRect
      const scaleX = svgRect.width / VIEWBOX_WIDTH
      const scaleY = svgRect.height / VIEWBOX_HEIGHT
      const offsetLeft = svgRect.left - containerRect.left
      const offsetTop = svgRect.top - containerRect.top

      const toScreen = (t) => {
        const point = pathEl.getPointAtLength(t * len)
        return { sx: offsetLeft + point.x * scaleX, sy: offsetTop + point.y * scaleY }
      }

      const here = toScreen(shipT)
      const aheadPoint = pathEl.getPointAtLength(Math.min(shipT * len + 1, len))
      const ahead = {
        sx: offsetLeft + aheadPoint.x * scaleX,
        sy: offsetTop + aheadPoint.y * scaleY,
      }
      const wakePoints = WAKE_OFFSETS.map((gap) => toScreen(clamp01(shipT - gap)))

      // ---- reads are done; everything below is a write ----
      x.set(here.sx - SHIP_SIZE / 2)
      y.set(here.sy - (SHIP_SIZE * SHIP_ASPECT) / 2)

      let deviation = Math.atan2(ahead.sy - here.sy, ahead.sx - here.sx) * (180 / Math.PI) - 90
      deviation = ((deviation + 180) % 360 + 360) % 360 - 180 // normalize to (-180, 180]
      const target = Math.max(-MAX_TILT, Math.min(MAX_TILT, deviation))
      rotationRef.current += (target - rotationRef.current) * ROTATE_DAMP
      rotate.set(rotationRef.current)

      wakePoints.forEach((pt, i) => {
        wakeX[i].set(pt.sx)
        wakeY[i].set(pt.sy)
      })

      // Fire once per anchor crossed, forward only. The while loop (rather
      // than a single if) catches a fast scroll that jumps past more than
      // one island in a single frame, so none of them get skipped.
      while (crossedRef.current + 1 < ANCHORS.length && shipT >= ANCHORS[crossedRef.current + 1]) {
        crossedRef.current += 1
        const idx = crossedRef.current
        const pt = toScreen(ANCHORS[idx])
        fireSplash(pt.sx, pt.sy)
        // RiverNode listens for this to pulse the crossed marker.
        window.dispatchEvent(new CustomEvent('river:splash', { detail: { index: idx, stop: stops[idx] } }))
      }
    },
    [pathRef, pathLenRef, x, y, rotate, wakeX, wakeY, fireSplash]
  )

  // Scroll-linked update. Guarded on `reduced` so a reduced-motion visitor
  // never gets position writes, wake, or splashes from this subscription.
  useMotionValueEvent(progress, 'change', (t) => {
    if (reduced) return
    positionAt(t)
    const wrapper = wrapperRef.current
    if (!wrapper) return
    wrapper.style.willChange = 'transform'
    clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      if (wrapperRef.current) wrapperRef.current.style.willChange = 'auto'
    }, 200)
  })

  // Reduced motion: park at the top once, and never subscribe to resize.
  useEffect(() => {
    if (reduced) positionAt(0)
  }, [reduced, positionAt])

  // A resize or orientation change moves the path's screen geometry even
  // though scroll progress hasn't changed — reposition using the current
  // progress value so the ship doesn't drift or fly off after rotating a
  // phone or crossing the desktop/mobile breakpoint mid-scroll.
  useEffect(() => {
    if (reduced) return
    let timer
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => positionAt(progress.get()), 150)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [reduced, positionAt, progress])

  return (
    <div className="pointer-events-none absolute inset-0 z-[5]">
      {!reduced && (
        <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {WAKE_STYLE.map((style, i) => (
            <motion.circle
              key={i}
              r={style.r}
              opacity={style.opacity}
              fill="var(--water-foam)"
              style={{ cx: wakeX[i], cy: wakeY[i] }}
            />
          ))}
          {/* Fixed splash pool: mounted once, driven by fireSplash's
              imperative animate() calls — never touched by React state. */}
          {Array.from({ length: SPLASH_POOL_SIZE }).map((_, slot) => (
            <g key={slot}>
              {Array.from({ length: SPLASH_CIRCLE_COUNT }).map((_, i) => (
                <circle
                  key={i}
                  ref={(el) => {
                    if (!splashPoolRef.current[slot]) splashPoolRef.current[slot] = []
                    splashPoolRef.current[slot][i] = el
                  }}
                  r={1.5}
                  cx={-100}
                  cy={-100}
                  opacity={0}
                  fill="var(--water-foam)"
                />
              ))}
            </g>
          ))}
        </svg>
      )}

      <motion.div
        ref={wrapperRef}
        className="absolute left-0 top-0"
        style={{ x, y, rotate, transformOrigin: 'center' }}
      >
        <PaperBoat size={SHIP_SIZE} />
      </motion.div>
    </div>
  )
}
