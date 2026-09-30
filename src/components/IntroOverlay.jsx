import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import PaperBoat from './PaperBoat'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { profile } from '../data/profile'

const EASE = [0.22, 1, 0.36, 1]

// One-time sailing intro. Total ~2.6s, then wipes up and unmounts.
export default function IntroOverlay() {
  const reduced = usePrefersReducedMotion()

  // Decide synchronously so a returning visitor never sees a flash of it.
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return sessionStorage.getItem('introSeen') !== '1'
    } catch {
      return false
    }
  })
  const [showSkip, setShowSkip] = useState(false)

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem('introSeen', '1')
    } catch {
      /* private mode / storage disabled — just move on */
    }
    setVisible(false)
  }, [])

  // Reduced motion: never play. Persist "seen" so it also won't play if the
  // setting is turned back off later this session. Rendering is short-circuited
  // by the `if (reduced) return null` below — no state change needed here.
  useEffect(() => {
    if (!reduced) return
    try {
      sessionStorage.setItem('introSeen', '1')
    } catch {
      /* storage disabled — nothing to persist */
    }
  }, [reduced])

  // Skip button appears at 300ms.
  useEffect(() => {
    if (!visible || reduced) return
    const t = setTimeout(() => setShowSkip(true), 300)
    return () => clearTimeout(t)
  }, [visible, reduced])

  // Kick off the exit wipe at 2.2s; the 0.4s wipe lands the total at 2.6s.
  useEffect(() => {
    if (!visible || reduced) return
    const t = setTimeout(finish, 2200)
    return () => clearTimeout(t)
  }, [visible, reduced, finish])

  // Lock scroll while mounted; always release it on unmount.
  useEffect(() => {
    if (!visible || reduced) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible, reduced])

  if (reduced) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-bg"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {/* 0.0–0.9s: the waterline draws itself across the centre */}
          <svg
            className="pointer-events-none absolute inset-x-0 top-1/2 h-[2px] w-full -translate-y-1/2"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.line
              x1="0" y1="1" x2="100" y2="1"
              stroke="var(--primary)"
              strokeWidth="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          </svg>

          {/* 0.5–1.6s: the ship sails in from the left and settles */}
          <motion.div
            initial={{ x: -140, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
          >
            <PaperBoat size={200} />
          </motion.div>

          {/* 1.3–2.0s: name fades up. aria-hidden — this duplicates Hero's
              real <h1>, which is already in the document (inside <main>) for
              anyone using assistive tech. Without this, axe flags the text
              as page content sitting outside any landmark. */}
          <motion.p
            aria-hidden="true"
            className="mt-6 text-center font-display text-4xl font-semibold text-ink sm:text-5xl"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.3, ease: EASE }}
          >
            {profile.name}
          </motion.p>

          {/* 1.7–2.2s: role fades in beneath, smaller and muted */}
          <motion.p
            aria-hidden="true"
            className="mt-2 text-center text-sm text-ink-muted sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.7, ease: EASE }}
          >
            {profile.role}
          </motion.p>

          {/* Skip — a real button, appears at 300ms, top-right. No fade-IN:
              a button that's clickable but still mid-opacity-transition
              reads as a real (if brief) low-contrast window, which is
              exactly what axe's color-contrast check caught. Exit still
              fades for a graceful dismiss. */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                type="button"
                onClick={finish}
                aria-label="Skip intro animation"
                className="absolute right-4 top-4 rounded-full bg-accent-cta px-4 py-2 text-sm font-semibold text-accent-on"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
              >
                Skip
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
