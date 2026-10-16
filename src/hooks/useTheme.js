import { useEffect, useState } from 'react'

const DARK_QUERY = '(prefers-color-scheme: dark)'

// Storage can throw (private mode, blocked site data). A failure here must
// never take the app down — the theme just won't be remembered.
function readStored() {
  try {
    return localStorage.getItem('theme')
  } catch {
    return null
  }
}

function writeStored(theme) {
  try {
    localStorage.setItem('theme', theme)
  } catch {
    /* storage disabled — the choice lasts for this page view only */
  }
}

export function useTheme() {
  // Read whatever the script in index.html already decided.
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'light'
  )

  // Whenever theme changes, apply it and re-tint the browser chrome. This
  // reads the live --bg value rather than duplicating a hex here, since the
  // toggle can override the OS's prefers-color-scheme — a static light/dark
  // media-query pair in index.html can't track that. Nothing is persisted
  // here: only an explicit toggle is a choice worth remembering.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta && bg) meta.setAttribute('content', bg)
  }, [theme])

  // Until the visitor picks a theme themselves, keep following the OS.
  useEffect(() => {
    const mql = window.matchMedia(DARK_QUERY)
    const onChange = () => {
      if (!readStored()) setTheme(mql.matches ? 'dark' : 'light')
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    writeStored(next)
    setTheme(next)
  }

  return { theme, toggle, isDark: theme === 'dark' }
}
