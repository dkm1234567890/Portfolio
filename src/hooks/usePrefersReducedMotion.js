import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// A LIVE boolean — re-reads when the OS setting is toggled mid-visit.
// Deliberately not Motion's useReducedMotion(), which reads once on mount.
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = () => setReduced(mql.matches)
    onChange() // sync in case it changed between render and effect
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}
