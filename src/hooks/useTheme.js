import { useEffect, useState } from 'react'

export function useTheme() {
  // Read whatever the script in index.html already decided.
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'light'
  )

  // Whenever theme changes, apply it, remember it, and re-tint the browser
  // chrome. This reads the live --bg value rather than duplicating a hex
  // here, since the toggle can override the OS's prefers-color-scheme —
  // a static light/dark media-query pair in index.html can't track that.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta && bg) meta.setAttribute('content', bg)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return { theme, toggle, isDark: theme === 'dark' }
}