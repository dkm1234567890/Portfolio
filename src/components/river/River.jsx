import { useRef, useEffect, useCallback, useMemo, useState } from 'react'
import { useScroll } from 'motion/react'
import RiverPath from './RiverPath'
import Ship from './Ship'
import { RiverContext } from './RiverContext'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

// The river background and its scroll-linked drawing. Children (the nodes)
// render above it. Owns the path geometry the ship reads, and keeps a
// recomputed total length in a ref.
//
// `layoutTick` is the one piece of state: bumped once per debounced resize
// of the container (window resize, a project card expanding, fonts
// settling) so every node re-measures where its card sits along the path.
export default function River({ children }) {
  const riverRef = useRef(null) // scroll target: the tall container
  const basePathRef = useRef(null) // the base <path>
  const pathLenRef = useRef(0) // total length (viewBox units), recomputed on resize/swap
  // anchorsRef.current[i] = fraction (0..1) of the path length where node i's
  // marker sits. Written by each RiverNode as it measures; read by Ship to
  // know when it passes a node.
  const anchorsRef = useRef([])
  const [layoutTick, setLayoutTick] = useState(0)

  const isDesktop = useIsDesktop()
  const reduced = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({
    target: riverRef,
    offset: ['start start', 'end end'],
  })

  const recompute = useCallback(() => {
    const el = basePathRef.current
    if (!el) return
    const len = el.getTotalLength()
    pathLenRef.current = len
    if (import.meta.env.DEV) {
      const rect = el.getBoundingClientRect()
      // Proves the recompute fired: the user-unit length changes on a variant
      // swap, the rendered height changes on any resize.
      console.log(
        `[river] length=${Math.round(len)}u · rendered=${Math.round(rect.height)}px · ${isDesktop ? 'desktop' : 'mobile'}`
      )
    }
  }, [isDesktop])

  // Recompute on mount and whenever the desktop/mobile variant swaps
  // (recompute's identity changes with isDesktop).
  useEffect(() => {
    recompute()
  }, [recompute])

  // Recompute on resize, debounced ~150ms. Reading innerWidth once on mount
  // and calling it done is the classic way this component breaks on rotation.
  useEffect(() => {
    const container = riverRef.current
    if (!container) return
    let timer
    const ro = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        recompute()
        setLayoutTick((n) => n + 1)
      }, 150)
    })
    ro.observe(container)
    return () => {
      clearTimeout(timer)
      ro.disconnect()
    }
  }, [recompute])

  const ctx = useMemo(
    () => ({ pathRef: basePathRef, pathLenRef, anchorsRef, layoutTick, isDesktop, reduced }),
    [layoutTick, isDesktop, reduced]
  )

  return (
    // isolate = a stacking context, so RiverPath's -z-10 stays behind the
    // nodes but above the page background rather than disappearing.
    <div ref={riverRef} className="relative isolate">
      <RiverPath
        ref={basePathRef}
        isDesktop={isDesktop}
        reduced={reduced}
        progress={scrollYProgress}
      />
      <Ship
        pathRef={basePathRef}
        pathLenRef={pathLenRef}
        anchorsRef={anchorsRef}
        progress={scrollYProgress}
        reduced={reduced}
      />
      <RiverContext.Provider value={ctx}>
        <div className="relative z-10">{children}</div>
      </RiverContext.Provider>
    </div>
  )
}
