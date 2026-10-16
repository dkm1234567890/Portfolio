import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import emailjs from '@emailjs/browser'
import { profile } from '../data/profile'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const EASE = [0.22, 1, 0.36, 1]
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_MESSAGE_LENGTH = 20
// `trap` is the honeypot. Deliberately not called "company" or anything
// else a browser's autofill recognises — autofill ignores autoComplete="off"
// often enough that a real visitor's form would be silently dropped.
const EMPTY_FIELDS = { name: '', email: '', message: '', trap: '' }

function validate(fields) {
  const errors = {}
  if (!fields.name.trim()) errors.name = 'Enter your name.'
  if (!fields.email.trim()) errors.email = 'Enter your email.'
  else if (!EMAIL_RE.test(fields.email.trim())) errors.email = "That email address doesn't look right."
  if (!fields.message.trim()) errors.message = 'Enter a message.'
  else if (fields.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = `Say a little more — at least ${MIN_MESSAGE_LENGTH} characters.`
  }
  return errors
}

// Flag pivots from its own base (the pole's foot), so "raised" and "popped"
// both read as the flag swinging up rather than orbiting the mailbox.
function MailboxArt({ raised, popped, reduced, size = 84 }) {
  return (
    <svg viewBox="0 0 112 112" width={size} height={size} aria-hidden="true">
      <rect x="48" y="70" width="8" height="34" fill="var(--surface-2)" stroke="var(--primary)" strokeWidth="2" />
      <path
        d="M20,42 Q20,28 34,28 H78 Q92,28 92,42 V70 H20 Z"
        fill="var(--surface-2)"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M56,28 H78 Q92,28 92,42 V70 H56 Z" fill="var(--ink)" opacity="0.1" />
      <rect x="34" y="48" width="24" height="4" rx="2" fill="var(--ink)" opacity="0.25" />

      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: '0% 100%' }}
        animate={
          reduced
            ? { rotate: raised ? -35 : 0 }
            : popped
              ? { rotate: [0, -55, -35] }
              : raised
                ? { rotate: -35 }
                : { rotate: [0, -4, 0, 3, 0] }
        }
        // Three keyframes, so a tween with `times` rather than a spring —
        // Motion's springs only interpolate between two values.
        transition={
          reduced
            ? { duration: 0 }
            : popped
              ? { duration: 0.6, times: [0, 0.45, 1], ease: EASE }
              : raised
                ? { duration: 0.32, ease: EASE }
                : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <rect x="90" y="30" width="4" height="24" fill="var(--hull-shade)" />
        <path d="M94,30 L110,35 L94,40 Z" fill="var(--flag)" stroke="var(--flag-dark)" strokeWidth="1" strokeLinejoin="round" />
      </motion.g>
    </svg>
  )
}

function LetterPopIn({ reduced }) {
  return (
    <motion.svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      aria-hidden="true"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.8 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 260, damping: 16 }}
    >
      <rect x="1" y="4" width="18" height="13" rx="1.5" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
      <path d="M1,5 L10,12 L19,5" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinejoin="round" />
    </motion.svg>
  )
}

function PaperPlane({ reduced }) {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      animate={reduced ? undefined : { x: [0, 3, 0], y: [0, -2, 0], rotate: [0, 8, 0] }}
      transition={reduced ? undefined : { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path d="M1,8 L15,2 L9,14 L7,9 Z" fill="currentColor" />
    </motion.svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3,3 L13,13 M13,3 L3,13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function Field({ label, id, errorId, error, value, onChange, type = 'text', textarea, autoComplete, inputRef }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <Tag
        ref={inputRef}
        id={id}
        name={id}
        type={textarea ? undefined : type}
        rows={textarea ? 4 : undefined}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1 w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink ${error ? 'border-danger' : 'border-border-strong'}`}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Mailbox() {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [fields, setFields] = useState(EMPTY_FIELDS)
  const [errors, setErrors] = useState({})

  const triggerRef = useRef(null) // the closed mailbox button
  const nameRef = useRef(null)
  const resetRef = useRef(null) // "Send another message"
  const wasOpenRef = useRef(false)
  const prevStatusRef = useRef(status)

  const nameId = useId()
  const emailId = useId()
  const messageId = useId()
  const nameErrorId = useId()
  const emailErrorId = useId()
  const messageErrorId = useId()
  const honeypotId = useId()

  const raised = hovered || open
  const popped = status === 'success'

  const updateField = (key) => (e) => {
    const val = e.target.value
    setFields((f) => ({ ...f, [key]: val }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const reset = () => {
    setFields(EMPTY_FIELDS)
    setErrors({})
    setStatus('idle')
  }

  // Focus follows the panel: into the first field on open, back to the
  // mailbox button on close — otherwise the control that held focus
  // unmounts and keyboard users are dropped back at the top of the page.
  useEffect(() => {
    if (open) nameRef.current?.focus()
    else if (wasOpenRef.current) triggerRef.current?.focus()
    wasOpenRef.current = open
  }, [open])

  // Same for the success swap: the submit button unmounts, so hand focus to
  // "Send another message", and from there back to the name field.
  useEffect(() => {
    const prev = prevStatusRef.current
    prevStatusRef.current = status
    if (status === 'success') resetRef.current?.focus()
    else if (prev === 'success' && status === 'idle') nameRef.current?.focus()
  }, [status])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    if (fields.trap) return // honeypot tripped — drop silently, no error shown

    const nextErrors = validate(fields)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('sending')
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { from_name: fields.name.trim(), reply_to: fields.email.trim(), message: fields.message.trim() },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  // Success is shown here; the error case already has a visible message
  // (with the mailto fallback) inside the form, so here it's announced to
  // screen readers only rather than printed twice.
  const statusMessage =
    status === 'success'
      ? 'Message sent. Thanks for reaching out — you will hear back soon.'
      : status === 'error'
        ? "That didn't go through. Try again, or email directly."
        : ''

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="flex w-full flex-col items-center px-6 py-16 text-center md:w-[380px]"
    >
      <h2 id="contact-heading" className="font-display text-2xl font-semibold text-ink">
        Contact
      </h2>
      <p className="mt-1 max-w-xs text-sm text-ink-muted">Have a role in mind? Drop a note in the mailbox.</p>

      <motion.div layout transition={{ duration: reduced ? 0 : 0.32, ease: EASE }} className="mt-6 w-full max-w-sm">
        {!open ? (
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            className="mx-auto flex flex-col items-center gap-2"
          >
            <MailboxArt raised={raised} popped={false} reduced={reduced} />
            <span className="text-sm font-semibold text-primary">Send a message</span>
          </button>
        ) : (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.32, ease: EASE }}
            className="rounded-3xl border border-border bg-surface p-6 text-left shadow-sm"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(false)
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MailboxArt raised popped={popped} reduced={reduced} size={56} />
                <AnimatePresence>{popped && <LetterPopIn reduced={reduced} />}</AnimatePresence>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close contact form"
                className="rounded-full p-1.5 text-ink-muted hover:text-ink"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Mounted (empty) as soon as the panel opens, well before the
                status can change, so assistive tech already knows about the
                region when there's finally something to announce. */}
            <p
              role="status"
              aria-live="polite"
              className={status === 'success' ? 'mt-4 text-sm font-medium text-ink' : 'sr-only'}
            >
              {statusMessage}
            </p>

            {status === 'success' ? (
              <button ref={resetRef} type="button" onClick={reset} className="mt-3 text-sm font-semibold text-primary">
                Send another message
              </button>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-2 flex flex-col gap-3">
                {/* Honeypot — off-screen, unreachable by Tab, real users never see or fill it. */}
                <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <label htmlFor={honeypotId}>Leave this field empty</label>
                  <input
                    id={honeypotId}
                    name="hp_trap"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={fields.trap}
                    onChange={updateField('trap')}
                  />
                </div>

                <Field
                  label="Name"
                  id={nameId}
                  errorId={nameErrorId}
                  error={errors.name}
                  value={fields.name}
                  onChange={updateField('name')}
                  autoComplete="name"
                  inputRef={nameRef}
                />
                <Field
                  label="Email"
                  id={emailId}
                  errorId={emailErrorId}
                  error={errors.email}
                  value={fields.email}
                  onChange={updateField('email')}
                  type="email"
                  autoComplete="email"
                />
                <Field
                  label="Message"
                  id={messageId}
                  errorId={messageErrorId}
                  error={errors.message}
                  value={fields.message}
                  onChange={updateField('message')}
                  textarea
                />

                {status === 'error' && (
                  <p className="text-sm text-danger">
                    That didn't go through. Try again, or email directly at{' '}
                    <a href={`mailto:${profile.email}`} className="font-semibold underline">
                      {profile.email}
                    </a>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="mt-1 flex items-center justify-center gap-2 rounded-full bg-accent-cta px-6 py-3 text-sm font-semibold text-accent-on transition-transform hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {status === 'sending' ? (
                    <>
                      <PaperPlane reduced={reduced} />
                      Sending…
                    </>
                  ) : (
                    'Send message'
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
