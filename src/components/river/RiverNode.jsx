import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useRiverContext } from './RiverContext'
import { VIEWBOX_WIDTH, VIEWBOX_HEIGHT } from './RiverPath'
import { anchorFor } from '../../data/stops'
import { skills, tierLabels } from '../../data/skills'
import { IslandIcon } from '../art'
import GitHubMark from '../icons/GitHubMark'

const EASE = [0.22, 1, 0.36, 1]
const SPRING = { type: 'spring', stiffness: 220, damping: 22, mass: 0.6 }

// Card entrance: opacity/y/scale with a slight overshoot spring and a 60ms
// stagger across its direct children. Reduced motion collapses to a single
// 150ms opacity fade — children get a static "already visible" variant, so
// only the card's own opacity animates and nothing moves or scales.
const cardVariants = (reduced) =>
  reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.15 } },
      }
    : {
        hidden: { opacity: 0, y: 24, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { ...SPRING, staggerChildren: 0.06 } },
      }

const itemVariants = (reduced) =>
  reduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: SPRING } }

function WaveMarker() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="mt-1.5 flex-none">
      <path d="M1,5 Q3,2 5,5 Q7,8 9,5" fill="none" stroke="var(--water-mid)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function StoryBody({ stop, reduced }) {
  const item = itemVariants(reduced)
  return (
    <>
      {stop.body?.map((paragraph, i) => (
        <motion.p key={i} variants={item} className="mt-3 text-base text-ink first:mt-0">
          {paragraph}
        </motion.p>
      ))}
      {stop.footnote && (
        <motion.p variants={item} className="mt-4 text-sm text-ink-muted">
          {stop.footnote}
        </motion.p>
      )}
      {stop.cta && (
        <motion.a
          variants={item}
          href={stop.cta.target}
          className="mt-5 inline-block rounded-full bg-accent-cta px-5 py-2.5 text-sm font-semibold text-accent-on transition-transform hover:-translate-y-0.5"
        >
          {stop.cta.label}
        </motion.a>
      )}
    </>
  )
}

function ListBody({ stop, reduced }) {
  const item = itemVariants(reduced)
  return (
    <>
      <ul className="mt-1 space-y-2">
        {stop.body.map((line, i) => (
          <motion.li key={i} variants={item} className="flex gap-2 text-base text-ink">
            <WaveMarker />
            <span>{line}</span>
          </motion.li>
        ))}
      </ul>
      {stop.footnote && (
        <motion.p variants={item} className="mt-4 text-sm text-ink-muted">
          {stop.footnote}
        </motion.p>
      )}
    </>
  )
}

const TIER_CHIP = {
  core: 'border border-primary bg-primary-soft text-ink',
  working: 'border border-border-strong bg-transparent text-ink',
  learning: 'border border-dashed border-border-strong bg-transparent text-ink-muted',
}

function SkillsBody({ reduced }) {
  const item = itemVariants(reduced)
  return (
    <>
      <motion.ul variants={item} className="mb-5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-muted">
        {Object.entries(tierLabels).map(([tier, label]) => (
          <li key={tier} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded-full ${TIER_CHIP[tier]}`} aria-hidden="true" />
            {label}
          </li>
        ))}
      </motion.ul>

      {skills.map((group) => (
        <motion.div key={group.group} variants={item} className="mb-5 last:mb-0">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-muted">
            {group.group}
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {group.items.map((skill) => (
              <li key={skill.name}>
                <span className={`rounded-full px-3 py-1 text-sm ${TIER_CHIP[skill.tier]}`}>{skill.name}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </>
  )
}

// Chevron that rotates 180deg on expand. A plain button icon, not decorative
// art, so it stays outside src/components/art and isn't aria-hidden by a
// blanket rule — the button itself carries the accessible name.
function Chevron({ expanded, reduced }) {
  return (
    <motion.svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      animate={{ rotate: expanded ? 180 : 0 }}
      transition={{ duration: reduced ? 0 : 0.32, ease: EASE }}
    >
      <path d="M2,4 L6,8 L10,4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  )
}

// The one abstraction Task 8 adds 11 copies of. Detail content is only ever
// in the tree while expanded — AnimatePresence unmounts it on collapse
// rather than hiding it with CSS, so 11 of these sitting on the page cost
// nothing extra once collapsed. `layout` on the wrapper lets Motion animate
// the height change itself instead of hand-rolling a height:0->auto tween.
function ProjectBody({ stop, reduced }) {
  const [expanded, setExpanded] = useState(false)
  const detailId = useId()
  const item = itemVariants(reduced)

  return (
    <>
      <motion.p variants={item} className="mt-1 text-base font-medium text-ink">
        {stop.problem}
      </motion.p>

      <motion.ul variants={item} className="mt-3 flex flex-wrap gap-2">
        {stop.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-surface-2 px-3 py-1 text-xs text-ink-muted">
            {tag}
          </li>
        ))}
      </motion.ul>

      <motion.div variants={item} className="mt-4">
        {/* Layout animation is isolated to this inner element so it doesn't
            compose with the outer entrance variant's own y/opacity tween. */}
        <motion.div layout transition={{ duration: reduced ? 0 : 0.32, ease: EASE }}>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-controls={detailId}
            className="flex items-center gap-1.5 rounded-full text-sm font-semibold text-primary"
          >
            {expanded ? 'Hide details' : 'Show details'}
            <Chevron expanded={expanded} reduced={reduced} />
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="detail"
                id={detailId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.24, ease: EASE }}
              >
                <ul className="mt-3 space-y-2 pl-1">
                  {stop.detail.map((line, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink">
                      <WaveMarker />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  )
}

// Fallback for any stop shape that isn't story/list/skills/project — keeps
// the switch complete and degrades to something readable instead of
// rendering nothing if a future `kind` value shows up.
function FallbackBody({ stop, reduced }) {
  const item = itemVariants(reduced)
  return (
    <motion.p variants={item} className="mt-3 text-base text-ink">
      {stop.problem ?? stop.subtitle}
    </motion.p>
  )
}

function Body({ stop, reduced }) {
  switch (stop.kind) {
    case 'list':
      return <ListBody stop={stop} reduced={reduced} />
    case 'skills':
      return <SkillsBody reduced={reduced} />
    case 'story':
      return <StoryBody stop={stop} reduced={reduced} />
    case 'project':
      return <ProjectBody stop={stop} reduced={reduced} />
    default:
      return <FallbackBody stop={stop} reduced={reduced} />
  }
}

function sectionClass(isDesktop, side) {
  const base = 'relative w-full px-6 py-16 md:flex md:min-h-[85vh] md:items-center md:py-24'
  if (!isDesktop) return base
  return `${base} ${side === 'left' ? 'md:justify-start' : 'md:justify-end'}`
}

// One generic node. `stop` is an entry from data/stops.js; `index`/`total`
// must match the values Ship used to build its anchor list, so this node's
// marker lands on exactly the point the ship splashes at.
export default function RiverNode({ stop, index, total }) {
  const { pathRef, isDesktop, reduced } = useRiverContext()
  const [marker, setMarker] = useState(null)
  const [pulsing, setPulsing] = useState(false)
  const headingId = useId()

  useEffect(() => {
    const pathEl = pathRef.current
    if (!pathEl) return
    const len = pathEl.getTotalLength()
    if (!len) return
    const anchor = anchorFor(index, total)
    const point = pathEl.getPointAtLength(anchor * len)
    setMarker({
      top: (point.y / VIEWBOX_HEIGHT) * 100,
      left: (point.x / VIEWBOX_WIDTH) * 100,
      // Card goes on the side the curve ISN'T bulging toward at this point.
      side: point.x >= VIEWBOX_WIDTH / 2 ? 'left' : 'right',
    })
  }, [pathRef, isDesktop, index, total])

  useEffect(() => {
    if (reduced) return
    const onSplash = (e) => {
      if (e.detail?.index !== index) return
      setPulsing(true)
      const t = setTimeout(() => setPulsing(false), 700)
      return () => clearTimeout(t)
    }
    window.addEventListener('river:splash', onSplash)
    return () => window.removeEventListener('river:splash', onSplash)
  }, [index, reduced])

  const isProject = stop.kind === 'project'
  const heading = isProject ? stop.name : stop.title
  const meta = isProject ? `${stop.domain} · ${stop.period}` : stop.subtitle
  const featured = isProject && stop.featured === true

  const side = isDesktop ? (marker?.side ?? 'right') : 'full'
  const isTodo = typeof heading === 'string' && heading.startsWith('TODO')

  return (
    <>
      {marker && (
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${marker.top}%`, left: `${marker.left}%` }}
        >
          <motion.div
            className="pointer-events-none grid h-5 w-5 place-items-center rounded-full border-2 border-primary bg-surface"
            aria-hidden="true"
            animate={reduced ? undefined : pulsing ? { scale: [1, 1.7, 1] } : { scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="h-2 w-2 rounded-full bg-primary" />
          </motion.div>

          {/* Repo badge lives on the marker, not the card — a separate Tab
              stop with its own focus ring. stopPropagation keeps a click
              here from also reaching the card's expand toggle. */}
          {isProject && (
            <motion.a
              href={stop.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${stop.name} source on GitHub`}
              onClick={(e) => e.stopPropagation()}
              className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full border border-border bg-surface text-ink shadow-sm"
              whileHover={reduced ? undefined : { scale: 1.12, rotate: -6 }}
              whileFocus={reduced ? undefined : { scale: 1.12, rotate: -6 }}
              transition={{ duration: 0.12, ease: EASE }}
            >
              <GitHubMark />
            </motion.a>
          )}
        </div>
      )}

      <section aria-labelledby={headingId} className={sectionClass(isDesktop, side)}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={cardVariants(reduced)}
          layout
          transition={{ layout: { duration: reduced ? 0 : 0.32, ease: EASE } }}
          className={`w-full rounded-3xl bg-surface p-6 shadow-sm md:w-[46%] md:p-8 ${
            isTodo ? 'border-2 border-dashed border-border-strong' : 'border border-border'
          }`}
        >
          <IslandIcon name={stop.icon} size={44} className="mb-3" />

          {isTodo && (
            <span className="mb-2 inline-block rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              In progress
            </span>
          )}
          {featured && (
            <span className="mb-2 inline-block rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
              Featured
            </span>
          )}

          <h2
            id={headingId}
            className={`font-display text-2xl font-semibold ${isTodo ? 'text-ink-muted' : 'text-ink'}`}
          >
            {heading}
          </h2>
          {meta && (
            <p className={`mt-1 text-sm font-medium text-ink-muted ${isProject ? 'font-mono uppercase tracking-wide text-xs' : ''}`}>
              {meta}
            </p>
          )}

          <div className="mt-4">
            <Body stop={stop} reduced={reduced} />
          </div>
        </motion.div>
      </section>
    </>
  )
}
