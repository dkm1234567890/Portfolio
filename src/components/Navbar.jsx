import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import ThemeToggle from './ThemeToggle'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { profile } from '../data/profile'

const FOCUSABLE = 'a[href], button:not([disabled])'

const LINKS = [
  { label: 'About',    href: '#about'    },
  { label: 'Projects', href: '#projects' },
  { label: 'Resume',   href: '#resume'   },
  { label: 'Contact',  href: '#contact'  },
]

const IDS = LINKS.map((l) => l.href.replace('#', ''))

export default function Navbar() {
  // Initialised from the real offset so a reload mid-page gets the border.
  const [scrolled, setScrolled] = useState(() => window.scrollY > 20)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useScrollSpy(IDS)
  // Matches Tailwind's `md:` — the point where the menu panel is hidden.
  const isWide = useMediaQuery('(min-width: 768px)')

  const headerRef = useRef(null)
  const panelRef = useRef(null)
  const toggleRef = useRef(null)
  // Set when the menu closes in a way that should hand focus back to the
  // toggle (Escape, the toggle itself). Not set for a link click — focus
  // should follow the visitor to the section they picked.
  const restoreFocusRef = useRef(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The panel is md:hidden, so once the viewport is wide it's invisible —
  // but menuOpen (and the scroll lock below) would otherwise stay on and
  // leave the desktop page unscrollable. Only lock while it can be seen.
  const menuShown = menuOpen && !isWide
  // And drop the open state outright, so narrowing the window again later
  // doesn't resurrect a menu nobody asked for. (Adjusting state during
  // render is React's sanctioned alternative to an effect for this.)
  if (isWide && menuOpen) setMenuOpen(false)

  useEffect(() => {
    if (!menuShown) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [menuShown])

  // Keyboard: focus the first link on open, Escape closes, and Tab cycles
  // between the header controls and the panel instead of wandering into
  // the page hidden behind it.
  useEffect(() => {
    if (!menuShown) {
      if (restoreFocusRef.current) toggleRef.current?.focus()
      restoreFocusRef.current = false
      return
    }
    panelRef.current?.querySelector('a')?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        restoreFocusRef.current = true
        setMenuOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const items = [
        ...(headerRef.current?.querySelectorAll(FOCUSABLE) ?? []),
        ...(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []),
      ].filter((el) => el.offsetParent !== null)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuShown])

  const close = () => setMenuOpen(false)
  const toggleMenu = () => {
    if (menuOpen) restoreFocusRef.current = true
    setMenuOpen((o) => !o)
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-bg/80 backdrop-blur-md ${scrolled ? 'border-b border-border' : ''}`}
      >
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a
            href="#about"
            className="font-display text-lg font-semibold text-ink transition-colors hover:text-primary"
          >
            {profile.shortName}
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => {
              const isActive = active === link.href.replace('#', '')
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full hover:text-primary ${isActive ? 'text-primary' : 'text-ink-muted'}`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-primary-soft"
                        style={{ zIndex: -1 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              ref={toggleRef}
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-ink md:hidden"
              onClick={toggleMenu}
              aria-label={menuShown ? 'Close menu' : 'Open menu'}
              aria-expanded={menuShown}
              aria-controls="mobile-menu"
            >
              <motion.svg
                width="18" height="18" viewBox="0 0 18 18"
                fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round"
              >
                <motion.line
                  x1="2" x2="16"
                  initial={{ y1: 5, y2: 5, rotate: 0 }}
                  animate={menuShown ? { y1: 9, y2: 9, rotate: 45 } : { y1: 5, y2: 5, rotate: 0 }}
                  style={{ transformOrigin: 'center' }}
                />
                <motion.line
                  x1="2" y1="9" x2="16" y2="9"
                  initial={{ opacity: 1 }}
                  animate={menuShown ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.line
                  x1="2" x2="16"
                  initial={{ y1: 13, y2: 13, rotate: 0 }}
                  animate={menuShown ? { y1: 9, y2: 9, rotate: -45 } : { y1: 13, y2: 13, rotate: 0 }}
                  style={{ transformOrigin: 'center' }}
                />
              </motion.svg>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuShown && (
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 flex flex-col bg-bg pt-20 px-6 md:hidden"
          >
            <ul className="flex flex-col gap-2 mt-8">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={close}
                    className="block rounded-2xl px-5 py-4 text-2xl font-display font-semibold text-ink transition-colors hover:bg-primary-soft hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-auto pb-10 text-sm text-ink-muted">
              {profile.email}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}