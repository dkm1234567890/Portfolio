import { useEffect, useState } from 'react'

// Watches a list of section IDs (in page order) and returns the last one
// whose top has scrolled past a line `offset` of the way down the viewport.
//
// Position-based rather than an IntersectionObserver band: the last
// sections are short and sit side by side at the very bottom of the page,
// so on a tall screen they can never reach a mid-viewport band at all. Once
// the page is scrolled to the bottom, the last ID wins outright.
export function useScrollSpy(ids, offset = 0.45) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const doc = document.documentElement
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        setActive(ids[ids.length - 1])
        return
      }
      const line = window.innerHeight * offset
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    schedule() // initial read, e.g. after a reload mid-page
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [ids, offset])

  return active
}
