import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import ThemeToggle from './ThemeToggle'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { profile } from '../data/profile'

const LINKS = [
  { label: 'About',    href: '#about'    },
  { label: 'Projects', href: '#projects' },
  { label: 'Resume',   href: '#resume'   },
  { label: 'Contact',  href: '#contact'  },
]

const IDS = LINKS.map((l) => l.href.replace('#', ''))

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useScrollSpy(IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-bg/80 backdrop-blur-md ${scrolled ? 'border-b border-border' : ''}`}
      >
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a
            href="#about"
            className="font-display text-lg font-semibold text-ink transition-colors hover:text-primary"
          >
            {profile.name.split(' ')[0]}
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
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-ink md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <motion.svg
                width="18" height="18" viewBox="0 0 18 18"
                fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round"
              >
                <motion.line
                  x1="2" x2="16"
                  initial={{ y1: 5, y2: 5, rotate: 0 }}
                  animate={menuOpen ? { y1: 9, y2: 9, rotate: 45 } : { y1: 5, y2: 5, rotate: 0 }}
                  style={{ transformOrigin: 'center' }}
                />
                <motion.line
                  x1="2" y1="9" x2="16" y2="9"
                  initial={{ opacity: 1 }}
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.line
                  x1="2" x2="16"
                  initial={{ y1: 13, y2: 13, rotate: 0 }}
                  animate={menuOpen ? { y1: 9, y2: 9, rotate: -45 } : { y1: 13, y2: 13, rotate: 0 }}
                  style={{ transformOrigin: 'center' }}
                />
              </motion.svg>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
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