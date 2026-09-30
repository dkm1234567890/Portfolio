import { useRef, useEffect, useCallback, useMemo } from 'react'
import { useScroll } from 'motion/react'
import RiverPath from './RiverPath'
import Ship from './Ship'
import { RiverContext } from './RiverContext'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

// The river background and its scroll-linked drawing. Children (the nodes, in
// Tasks 7–8) render above it. Owns the path geometry that Task 6's ship reads,
// and keeps a recomputed total length in a ref (not state — writing it to
// state would re-render on every resize).
export default function River({ children }) {
  const riverRef = useRef(null) // scroll target: the tall container
  const basePathRef = useRef(null) // the base <path>, exposed for Task 6
  const pathLenRef = useRef(0) // total length (viewBox units), recomputed on resize/swap

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
      timer = setTimeout(recompute, 150)
    })
    ro.observe(container)
    return () => {
      clearTimeout(timer)
      ro.disconnect()
    }
  }, [recompute])

  const ctx = useMemo(
    () => ({ pathRef: basePathRef, pathLenRef, isDesktop, reduced }),
    [isDesktop, reduced]
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
        progress={scrollYProgress}
        reduced={reduced}
      />
      <RiverContext.Provider value={ctx}>
        <div className="relative z-10">{children}</div>
      </RiverContext.Provider>
    </div>
  )
}
