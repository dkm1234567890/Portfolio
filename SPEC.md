# Downstream — Build Spec, Tasks 4–10

You are continuing an existing project. **Read this entire file before writing any code.**
Tasks 1–3 are already done. Do not redo them.

---

## HOW THE USER SHOULD USE THIS FILE

Save this as `SPEC.md` in the project root. Then in Claude Code, work **one task at a
time**:

```
Read SPEC.md. Then do Task 4 only. Stop when the acceptance checks pass.
```

Do not ask for all seven tasks in one go. Each task ends in a state the user can look
at in the browser and approve. Tasks 5 and 6 are the hard ones and will likely need
iteration.

---

## PART 1 — CURRENT STATE OF THE PROJECT

### Stack (already installed, do not change)

| Thing | Version / package | Note |
|---|---|---|
| Build tool | Vite 8 | |
| Framework | React 19 | |
| CSS | Tailwind **v4** via `@tailwindcss/vite` | **CSS-first. There is no `tailwind.config.js`. Do not create one.** |
| Animation | **`motion`** — import from `motion/react` | **NOT `framer-motion`. That import will fail.** |
| Fonts | `@fontsource-variable/outfit`, `@fontsource-variable/inter` | self-hosted, imported in `main.jsx` |
| Lint | ESLint + Prettier | |
| OS | Windows | use forward slashes in imports regardless |

Nothing else is installed. `@emailjs/browser` is needed in Task 9 — install it then,
not now.

### Files that already exist

```
portfolio/
  index.html                  <- has a blocking theme script in <head>. Do not move it.
  vite.config.js              <- react() + tailwindcss() plugins
  eslint.config.js
  src/
    main.jsx                  <- fontsource imports + './index.css'
    index.css                 <- tokens + @theme inline + @layer base
    App.jsx                   <- temporary; you will rewrite this in Task 4
    components/
      PaperBoat.jsx           <- the ship. Rocks + flag flutter. KEEP THIS.
      ThemeToggle.jsx         <- sun/moon, works
      Navbar.jsx              <- sticky, scroll-spy, mobile sheet, works
    hooks/
      useTheme.js
      useScrollSpy.js
    data/
      profile.js
      projects.js
      skills.js
      journey.js
```

### Hooks that DO NOT exist yet and are needed

- `src/hooks/useMediaQuery.js` — create in Task 5
- `src/hooks/usePrefersReducedMotion.js` — create in Task 4

### The data layer contract

Read these four files before writing components. **Never hardcode content that lives
in them.** Their exact exports:

```js
// data/profile.js
export const profile   // { name, role, tagline, intro, location, email,
                       //   links:{linkedin,github,twitter}, resume:{file,updated} }
export const education // array of { institution, qualification, score, start, end, note? }

// data/projects.js
export const projects  // array of 11 objects:
                       // { slug, name, domain, period, problem,
                       //   detail: string[], tags: string[], repo, featured? }

// data/skills.js
export const skills      // array of { group, items: [{ name, tier }] }
                         // tier is 'core' | 'working' | 'learning'
export const tierLabels  // { core, working, learning } — human-readable labels

// data/journey.js
export const journey   // ordered array of { id, kind, icon, title, subtitle,
                       //   body?, footnote?, cta? }
                       // kind is 'story' | 'list' | 'skills'
                       // ids in order: about, activities, experience, skills, next
```

`journey` has a node with `id: 'experience'` whose title is literally `'TODO — this
node is empty'`. **Leave it as-is and render it.** The user is still writing that
content. Do not invent placeholder career text for it. If it looks bad rendered,
render it with a visible muted "In progress" treatment rather than hiding it.

### Existing design tokens in `src/index.css`

Currently defined in `:root` and overridden in `[data-theme='dark']`:

```
--bg  --surface  --ink  --ink-muted  --primary  --primary-soft  --border
--hull  --hull-shade  --deck  --sail  --sail-shade  --flag  --flag-dark
```

Currently mapped into `@theme inline`:

```
--color-bg  --color-surface  --color-ink  --color-ink-muted
--color-primary  --color-primary-soft  --color-border
--font-display  --font-sans
```

**`@theme inline` is load-bearing.** The `inline` keyword makes Tailwind utilities
emit `var(--bg)` instead of baking in the light-mode hex. Remove it and dark mode
silently breaks. Any new colour token must be added in BOTH places: the `:root` /
`[data-theme='dark']` blocks AND `@theme inline`.

---

## PART 2 — NON-NEGOTIABLE RULES

1. **No hex colours outside `src/index.css`.** In JSX and SVG use
   `fill="var(--primary)"` or the Tailwind class `bg-primary`. If you need a colour
   that doesn't exist, add a token first.

2. **No prose outside `src/data/`.** Every heading, paragraph, project description and
   label comes from a data file. UI microcopy (button labels, "Loading…") may live in
   the component.

3. **One easing curve, three durations.** `cubic-bezier(0.22, 1, 0.36, 1)`; 120ms /
   320ms / 600ms. Springs only for the ship's bob and the splash burst. Do not
   introduce new curves per component.

4. **`prefers-reduced-motion` changes BEHAVIOUR, not speed.** A fast animation is
   still an animation. Under reduced motion the ship is parked and static, the river
   is drawn at full length, loops do not run, and cards appear with a plain 150ms
   opacity fade. Everything must remain fully readable.

5. **Accessibility is part of "done", not Task 10.** Every interactive element is a
   real `<button>` or `<a>`, keyboard-operable, with a visible focus ring and an
   accurate accessible name. Decorative SVG gets `aria-hidden="true"`; meaningful SVG
   gets `role="img"` and an `aria-label`.

6. **The page must work as a document.** A screen reader going top to bottom must get
   every fact in order without any scroll animation firing. Semantic sections, real
   headings, logical DOM order.

7. **Data-driven, always.** Adding a 12th project must be one object in
   `projects.js` — never new JSX.

8. **Do not install packages** beyond what a task explicitly says to install.

---

## PART 3 — TAILWIND V4 AND MOTION GOTCHAS

These will bite. Read them.

- **Tailwind v4 has no config file.** Extend the theme with `@theme inline { ... }` in
  CSS. Custom variants use `@custom-variant`. Do not run `npx tailwindcss init`.
- **Dark mode is driven by `data-theme` on `<html>`,** not by the `class` strategy.
  If you need a `dark:` variant, register it:
  `@custom-variant dark (&:where([data-theme='dark'], [data-theme='dark'] *));`
- **Motion path morphing requires identical path commands.** To animate `d` between
  two shapes, both strings must have the same command sequence and point count
  (`M Q Q Z` → `M Q Q Z`). Mismatched paths fail silently — no error, no animation.
- **SVG transforms need an explicit origin.** On any `motion.g` / `motion.path` you
  rotate or scale, set
  `style={{ transformBox: 'fill-box', transformOrigin: 'center' }}`.
  Without it, elements orbit the SVG's 0,0 instead of their own centre.
- **Multi-line template-literal `className` strings have caused paste corruption for
  this user.** Prefer single-line class strings, or use `clsx`-style array joins.
  Since you are writing files directly this is less critical, but keep lines
  reasonable.
- **`layoutId` is already in use** in `Navbar.jsx` with the value `nav-pill`. Do not
  reuse that string.

---

## TASK 4 — Tokens, Intro Animation, Hero

### 4.1 First, complete the token system

The existing palette has gaps that will fail an accessibility audit. Add these to
`src/index.css` — the values are already contrast-verified, use them exactly.

Add to `:root`:

```css
--surface-2:     #efe9df;
--accent:        #c87b2c;  /* illustration fills ONLY. Never text. */
--accent-text:   #8f5310;  /* small text & icons.  5.61:1 on --bg   */
--accent-cta:    #8f5310;  /* button background                     */
--accent-on:     #ffffff;  /* text on --accent-cta.  6.15:1         */
--border-strong: #7d7060;  /* form inputs & controls. 4.39:1        */
--ring:          #8f5310;  /* focus ring                            */
--water-deep:    #0b6e6b;
--water-mid:     #7fbdb8;
--water-foam:    #ffffff;
--ease:          cubic-bezier(0.22, 1, 0.36, 1);
```

Add to `[data-theme='dark']`:

```css
--surface-2:     #1e3237;
--accent:        #e8a33d;
--accent-text:   #e8a33d;  /* 8.44:1 on dark bg — safe as text here */
--accent-cta:    #e8a33d;
--accent-on:     #0d1719;  /* CTA inverts: amber fill, near-black label */
--border-strong: #688e95;
--ring:          #e8a33d;
--water-deep:    #0a2f33;
--water-mid:     #2e7c78;
--water-foam:    #9fe0da;
```

Map all the colour ones into `@theme inline` as `--color-surface-2`,
`--color-accent`, `--color-accent-text`, `--color-accent-cta`, `--color-accent-on`,
`--color-border-strong`, `--color-water-deep`, `--color-water-mid`,
`--color-water-foam`.

**Why accent is split four ways:** a single warm amber cannot be both a vivid
illustration fill and readable 12px text. The vivid version measures 3.66:1 on the
paper background — fails AA for body text. And white-on-amber in dark mode is
2.16:1, effectively unreadable. Use `--accent` for shapes, `--accent-text` for text,
and `--accent-cta` + `--accent-on` as a pair for buttons. Never `text-accent`.

Also add to `@layer base` if not present:

```css
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  border-radius: 4px;
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

And a `.skip-link` utility: absolutely positioned off-screen at `left: -9999px`,
moving to `left: 0.75rem; top: 0.75rem` on `:focus`.

### 4.2 Create `src/hooks/usePrefersReducedMotion.js`

Returns a live boolean from `matchMedia('(prefers-reduced-motion: reduce)')` with a
`change` listener, so toggling the OS setting mid-visit takes effect. Do not use
Motion's `useReducedMotion()` for this — it reads once.

### 4.3 Create `src/components/IntroOverlay.jsx`

A fixed full-screen overlay in `--bg`, `z-[100]`.

Sequence, total **2.6s**:

| Time | What |
|---|---|
| 0.0–0.9s | A waterline draws itself horizontally across the centre (animate an SVG `pathLength` 0 → 1) |
| 0.5–1.6s | The `PaperBoat` sails in from the left, `x: -140 → 0`, easing out, settling on the line |
| 1.3–2.0s | `profile.name` fades up beneath, `y: 16 → 0` |
| 1.7–2.2s | `profile.role` fades in under the name, smaller, `--ink-muted` |
| 2.2–2.6s | Whole overlay wipes upward (`y: 0 → -100%`) and unmounts |

Requirements:

- Reuse the existing `PaperBoat` component. Do not draw a new ship.
- **Skip button**, top-right, appears at 300ms. Real `<button>`,
  `aria-label="Skip intro animation"`, keyboard focusable, styled with
  `--accent-cta` / `--accent-on`.
- On completion or skip, write `sessionStorage.setItem('introSeen', '1')`. If that
  key is already set on mount, do not render the overlay at all — return `null`
  before any animation starts, so there is no flash.
- Use `sessionStorage`, not `localStorage`. A recruiter returning next week should
  see it once again.
- If `usePrefersReducedMotion()` is true, do not play it. Skip straight to the site.
- The overlay must not cause layout shift when it unmounts, and must not block scroll
  restoration. While mounted, set `document.body.style.overflow = 'hidden'` and clear
  it on unmount.
- Wrap in `AnimatePresence` so the exit wipe actually plays.

### 4.4 Rewrite `src/components/Hero.jsx` (new file) and `src/App.jsx`

Hero is a full-viewport-height section, `id="about"`:

- `profile.name` as the `<h1>`. Fluid size via `clamp()`, roughly 2.75rem → 4.5rem.
- `profile.role` as a small mono-ish eyebrow above or below the name.
- `profile.tagline` then `profile.intro` beneath, constrained to ~60ch measure.
- The `PaperBoat` positioned so it sits on the water band at the bottom of the
  section.
- A water band across the bottom: `--primary-soft` fill, `--primary` top border,
  roughly 30vh tall. **This is a placeholder — Task 5 replaces it with the real
  river.** Mark it with a comment saying so.
- Two CTAs: "See the work" (scrolls to `#projects`, primary style using
  `--accent-cta`/`--accent-on`) and "Download resume" (secondary/outline style,
  links to the resume — a dead link is fine until Task 9).
- A subtle scroll cue at the bottom edge: a small chevron or the word "Scroll",
  bobbing gently, hidden under reduced motion, `aria-hidden="true"`.

`App.jsx` becomes:

- Skip link as the very first focusable element, `href="#main"`.
- `<IntroOverlay />`
- `<Navbar />`
- `<main id="main">` containing `<Hero />` and the placeholder sections
  `#projects`, `#resume`, `#contact` that Navbar's scroll-spy already targets. Keep
  those placeholders until their real tasks land.

### Acceptance checks — Task 4

- [ ] Hard refresh: intro plays once, ~2.6s, then the hero appears
- [ ] Refresh again in the same tab: intro does NOT play
- [ ] New tab: intro plays again
- [ ] Skip button works and is reachable by Tab
- [ ] OS reduce-motion on: no intro at all, hero renders immediately, ship static
- [ ] Both themes: nothing unreadable, hero CTAs legible
- [ ] Navbar scroll-spy still highlights correctly
- [ ] No `text-accent` anywhere in the codebase

---

## TASK 5 — The River

**This is the hardest task. Build it in the order below and verify each step.**

### 5.1 Create `src/hooks/useMediaQuery.js`

Standard `matchMedia` subscription with a `change` listener. Also export
`useIsDesktop()` returning `useMediaQuery('(min-width: 1024px)')`.

### 5.2 Create `src/components/river/RiverPath.jsx`

One `<svg>`, very tall, `position: absolute`, `inset-0`, `-z-10`, containing the
river.

**Two path variants:**

- **Desktop (≥1024px):** wide lazy S-curves, swinging about ±30% of the viewBox width
  either side of centre. Roughly 6–8 bends over the full height.
- **Mobile (<1024px):** a gentle narrow wave, amplitude ~12% of width, so no content
  is pushed off screen.

Pick one via `useIsDesktop()`. Define both as constants — a `viewBox` and a `d`
string each. Use a tall viewBox (e.g. `0 0 100 1400`) and let the SVG scale with
`width="100%" height="100%"` and `preserveAspectRatio="none"` — this makes the path
maths resolution-independent.

**Render the river as three stacked strokes on the same `d`,** back to front:

1. Wide base stroke, `var(--water-deep)` at low opacity or `--primary-soft`,
   `stroke-width` ~9 (in viewBox units), `stroke-linecap="round"`.
2. Mid stroke, `var(--water-mid)`, ~6 wide, opacity ~0.7.
3. Thin dashed "current" line, `var(--water-foam)`, ~1 wide, opacity ~0.5,
   with an infinite `stroke-dashoffset` loop so the water reads as flowing.

### 5.3 Scroll-linked drawing

In the parent (`River.jsx`):

```js
const riverRef = useRef(null);
const { scrollYProgress } = useScroll({
  target: riverRef,
  offset: ['start start', 'end end'],
});
```

Drive the base and mid strokes' `pathLength` from `scrollYProgress` so the water
appears to flow into being. **Give it a small lead** — the ship should sit at roughly
`progress - 0.02` of the drawn length, so the river always looks like it is already
there rather than being built under the hull.

Under reduced motion: set `pathLength` to a static `1`. Do not animate.

### 5.4 Responsive recomputation — do not skip this

The path length changes when the viewport resizes and when the desktop/mobile variant
swaps. Node positions depend on it.

- Attach a `ResizeObserver` to the river container, debounced ~150ms.
- On resize AND on variant swap, call `pathEl.getTotalLength()` again and store it in
  a ref (not state — see Task 6).
- Expose the path element via a ref so Task 6 can read geometry from it.

Reading `window.innerWidth` once on mount and calling it done will break on phone
rotation. This is the single most common way this kind of component fails.

### 5.5 Node anchor positions

**Do not put anchor fractions in the data files.** Compute them from array index so
adding a project stays a one-line data change:

```js
// journey nodes + projects spliced into one ordered list
const stops = [
  ...journey.slice(0, 4),          // about, activities, experience, skills
  ...projects.map(p => ({ ...p, kind: 'project' })),
  ...journey.slice(4),             // next
];

// spread them evenly with padding at each end
const anchorFor = (i, total) => 0.06 + (i / (total - 1)) * 0.88;
```

Export `stops` from a small module (e.g. `src/data/stops.js`) so Tasks 6, 7 and 8 all
read the same ordered list.

### Acceptance checks — Task 5

- [ ] River visibly draws in as you scroll, top to bottom
- [ ] Resize the window: path reflows, no clipping, no horizontal scrollbar
- [ ] Cross the 1024px breakpoint: variant swaps and stays correct
- [ ] Rotate a phone (or use device emulation): still correct
- [ ] Reduced motion: river fully drawn, static
- [ ] Both themes: water tones shift and stay visible
- [ ] `console.log` of total path length changes after resize (proves recompute works)

---

## TASK 6 — The Ship on the River

### 6.1 Position from SVG geometry, not guesswork

```js
const len   = pathEl.getTotalLength();
const p     = pathEl.getPointAtLength(t * len);
const ahead = pathEl.getPointAtLength(Math.min(t * len + 1, len));
const angle = Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180 / Math.PI;
```

Those coordinates are in viewBox units. Convert to screen pixels using the SVG's
CTM or its bounding rect ratio — do not assume 1 unit = 1 pixel.

### 6.2 Write to MotionValues, never React state

**This is the most important performance decision in the whole project.**

```js
const x = useMotionValue(0);
const y = useMotionValue(0);
const rotate = useMotionValue(0);

useMotionValueEvent(scrollYProgress, 'change', (t) => {
  // compute p, angle...
  x.set(px);
  y.set(py);
  rotate.set(damped(angle));
});
```

Then apply with `<motion.div style={{ x, y, rotate }}>`.

Putting ship position in `useState` re-renders the component tree on every scroll
frame and will visibly stutter on a mid-range phone. If you find yourself calling a
setter inside a scroll handler, stop and use a MotionValue.

### 6.3 Three independent motions, layered

1. **Travel** — follows the path, scroll-linked, as above.
2. **Heading** — rotates to the path tangent, but **damped**: lerp the current
   rotation toward the target by ~0.15 per update, so it doesn't snap on tight bends.
   Clamp to roughly ±20° so the ship never looks capsized.
3. **Bob** — the existing rock/flutter inside `PaperBoat.jsx`. It runs on its own
   clock, independent of scroll, which is what keeps the ship alive when the user
   stops scrolling. **Do not merge this into the travel transform.** Keep the
   follower as a wrapper that owns position, and `PaperBoat` owning liveliness.

### 6.4 Wake

3–4 small ellipses trailing behind the ship, `var(--water-foam)`, staggered opacity
and scale, fading out. Pure SVG plus Motion — no canvas. Position them by sampling
the path slightly behind the ship's `t`.

### 6.5 Splash on arrival

When the ship's `t` crosses a stop's anchor, fire a one-shot burst: 6–8 small circles
arcing outward with spring physics, plus a brief pulse on that stop's node marker.

- Fire **once per crossing**. Track the last-crossed index in a ref.
- Debounce so scrubbing back and forth doesn't machine-gun it.
- Skip entirely under reduced motion.

### 6.6 Performance requirements

- Zero React re-renders during scroll. Verify with the React DevTools profiler: record
  a scroll, confirm the ship component does not appear in the commit list.
- `will-change: transform` on the ship wrapper only, and remove it when idle.
- Pause looping animations for off-screen elements — use `whileInView` or an
  `IntersectionObserver`.
- Batch all `getPointAtLength` reads together; never interleave geometry reads with
  style writes.

### Acceptance checks — Task 6

- [ ] Ship follows the river smoothly from top to bottom
- [ ] Ship rotates to face its direction of travel, smoothly, never spinning
- [ ] Ship still bobs when scrolling stops
- [ ] Wake trails behind, in the right direction
- [ ] Splash fires once per island, not repeatedly
- [ ] 60fps on mobile emulation with CPU throttled 4×
- [ ] React DevTools profiler shows no re-renders while scrolling
- [ ] Reduced motion: ship parked at the top, static, no wake, no splash
- [ ] Resize mid-scroll: ship snaps to the correct new position, does not fly off

---

## TASK 7 — RiverNode + Story Nodes

### 7.1 Create `src/components/river/RiverNode.jsx`

**One generic component** taking a stop object as props and switching body layout on
`kind`. This is the abstraction the whole page depends on — get it right before
Task 8 multiplies it by eleven.

```
RiverNode
├─ marker      small shape on the river itself, plus the splash target
├─ card        surface panel with the content
└─ body        switches on kind: 'story' | 'list' | 'skills' | 'project'
```

Layout:

- **Desktop:** card sits on the opposite side of the river from the curve's swing,
  alternating left / right down the page. Marker stays on the path.
- **Mobile:** card is always full-width directly below its marker. No alternation.

Entrance animation:

```js
whileInView with { once: true, amount: 0.4 }
opacity 0 → 1, y: 24 → 0, scale: 0.96 → 1
slight overshoot spring; stagger internal children by 60ms
```

Under reduced motion: plain 150ms opacity fade, no transform.

Semantics: each node is a real `<section>` with `aria-labelledby` pointing at its own
heading. Headings are `<h2>`, sub-items `<h3>`. The page must read as an ordered
document with animations disabled.

### 7.2 Body renderers

- **`story`** — `title`, `subtitle`, then `body` (string array) as paragraphs. Render
  `footnote` if present, smaller and `--ink-muted`. Render `cta` if present as a real
  anchor button.
- **`list`** — `title`, `subtitle`, then `body` as a proper `<ul>`. Use a small
  river-appropriate marker rather than default bullets.
- **`skills`** — reads `skills` and `tierLabels` from `data/skills.js`. Render each
  `group` as a labelled cluster of tag chips. **Encode `tier` visually** — e.g.
  `core` chips filled with `--primary-soft` and a `--primary` border, `working` chips
  outline-only, `learning` chips dashed border. Include a small visible legend using
  `tierLabels` so the distinction means something to a reader. **No percentage bars,
  no invented numbers.**

### 7.3 Island illustrations

Create `src/components/art/` with one small flat SVG component per `icon` value used
in `journey.js`: `source`, `village`, `harbour`, `workshop`, `lighthouse`. Plus a
generic one for projects.

Style, matching the existing ship:

- Flat geometric shapes, rounded joins, 2px consistent stroke in `--primary`
- Depth from **facets, not gradients**: split each form into a lit plane and a
  shaded plane, light always from the upper left
- Fills from `--surface` / `--surface-2` / `--accent`
- Every one `aria-hidden="true"` — they are decorative, the heading carries the meaning
- Map icon name → component with a lookup object, so a missing icon degrades to the
  generic marker instead of crashing

### Acceptance checks — Task 7

- [ ] The four story nodes render from `journey.js` with no hardcoded prose
- [ ] Cards alternate sides on desktop, stack on mobile
- [ ] Skills node shows tier distinction with a readable legend
- [ ] The `experience` node renders its TODO state without breaking layout
- [ ] Tab through the page: focus order matches visual order
- [ ] Disable JS entirely: all text still present and ordered
- [ ] Reduced motion: cards fade only, no slide or scale

---

## TASK 8 — Project Nodes

All eleven from `projects.js`. Same `RiverNode`, `kind: 'project'`.

### 8.1 Card contents

- `name` as the heading
- `domain` and `period` as a small mono-ish meta line
- `problem` — the one-line hook, prominent
- `tags` as chips in `--surface-2`
- `detail` array — **hidden until expanded**

### 8.2 Expandable card

- Click, tap, Enter or Space toggles it
- Animate with Motion `layout` + `AnimatePresence`, height auto
- Wire `aria-expanded` and `aria-controls` correctly; the toggle is a real `<button>`
- The expand control must be an obvious affordance — a chevron that rotates 180°

### 8.3 GitHub badge — a SEPARATE control

This is the detail most likely to be got wrong.

- A small GitHub mark inside a rounded badge, positioned **on the node marker**, not
  inside the card. Visually and spatially distinct from the expand control.
- `<a href={project.repo} target="_blank" rel="noopener noreferrer">`
- `aria-label={`View ${project.name} source on GitHub`}`
- Hover / focus: Motion `scale: 1.12`, `rotate: -6deg`
- **Must call `stopPropagation()` on click** so it does not also toggle the card.
- Independently keyboard-focusable, with its own focus ring.

### 8.4 Featured projects

Two projects have `featured: true` (`server-health-monitoring`,
`disease-prediction`). Give them slightly more visual weight — a subtly larger card,
a marker in `--accent`, or a small "Featured" chip. Keep it restrained; one signal,
not three.

### Acceptance checks — Task 8

- [ ] All 11 render from data, in chronological order
- [ ] Expand and collapse works by mouse and by keyboard
- [ ] Clicking the GitHub badge opens the repo and does NOT expand the card
- [ ] Badge is reachable by Tab, separately from the expand button
- [ ] `aria-expanded` flips correctly (check in the accessibility inspector)
- [ ] Adding a dummy 12th object to `projects.js` makes a 12th island appear with no
      other code change — **actually test this, then remove the dummy**
- [ ] Featured treatment is noticeable but not loud

---

## TASK 9 — Estuary: Mailbox, Resume, Footer

Install: `npm install @emailjs/browser`

### 9.1 Mailbox widget — `id="contact"`

A flat illustrated mailbox in the same facet style. Idle: flag down, gentle sway.
Hover / focus: flag raises.

Click expands it (Motion `layout`) into a form: **Name, Email, Message**.

- Send via EmailJS. Read config from `import.meta.env.VITE_EMAILJS_SERVICE_ID`,
  `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.
- Create a committed `.env.example` listing those three keys, and add `.env` to
  `.gitignore` if it isn't already.
- Note in the README that these values are public in any static build — that is
  expected and fine for EmailJS; the account's allowlist and rate limits are the
  actual protection.
- Client-side validation before sending: required fields, email pattern,
  message minimum length. Inline errors with `aria-describedby` and `aria-invalid`.
  Form borders use `--border-strong`, not `--border`.
- **Loading state:** submit button becomes a small paper plane in flight.
- **Success:** the mailbox flag pops up and a letter animates in. Announce with
  `role="status" aria-live="polite"`.
- **Error:** state what went wrong and what to do, in the interface's voice, plus a
  `mailto:` fallback using `profile.email` so a recruiter is never blocked.
- Add a hidden honeypot field for basic spam resistance.
- **Do not use an HTML `<form>` with default submission.** Use `onClick` on a button
  and `preventDefault` if you do use a form element.

### 9.2 Resume box — `id="resume"`

A separate small illustrated crate or dock box beside the mailbox.

- "Download resume" button serving
  `import.meta.env.BASE_URL + profile.resume.file`, with the `download` attribute.
- Show `profile.resume.updated` as small muted text. Recruiters notice a stale resume.
- Hover: the paper lifts slightly out of the box.
- The user must place their PDF at `public/resume.pdf`. If it is missing, the button
  should still render — note this in the README rather than crashing.

### 9.3 Footer

- `profile.links.linkedin`, `.github`, `.twitter` as inline SVG icons using
  `currentColor` so they theme automatically.
- **If a link value is an empty string, do not render that icon.** `profile.links.twitter`
  is currently empty.
- Each is a real `<a>` with `target="_blank" rel="noopener noreferrer"` and its own
  `aria-label`.
- `profile.email` as a `mailto:` link, and `profile.location` as plain text.
- **Do not render phone number, date of birth or home address.** They are deliberately
  absent from `profile.js`; do not add them.

### Acceptance checks — Task 9

- [ ] Form validates before sending, with readable inline errors
- [ ] Success and error states both reachable and announced
- [ ] `mailto:` fallback present in the error state
- [ ] Resume button downloads the PDF (once the user adds it)
- [ ] Twitter icon absent, because the value is empty
- [ ] All footer links keyboard-reachable with correct labels
- [ ] No personal contact details beyond email and general location

---

## TASK 10 — Ship It

### 10.1 Reduced-motion audit

Turn the OS setting on and walk the entire page. Confirm: no intro, river drawn
static, ship parked, no wake, no splash, no looping ripples, cards fade only, smooth
scroll off. Then confirm every single fact is still readable.

### 10.2 Accessibility pass

- Keyboard-only from skip link to footer. No traps, no invisible focus, logical order.
- Every image and icon correctly `aria-hidden` or labelled.
- Run `npx @axe-core/cli http://localhost:5173` and fix everything it reports.
- Target Lighthouse Accessibility ≥ 95.

### 10.3 Performance pass

- `npx lighthouse http://localhost:5173 --view`, mobile preset. Target Performance ≥ 90.
- Lazy-load below-the-fold illustration components with `React.lazy` + `Suspense`.
- Confirm no per-frame React re-renders (DevTools profiler).

### 10.4 Meta and favicon

- `<title>` and `<meta name="description">` built from `profile`.
- Open Graph and Twitter card tags, plus a static OG image at `public/og.png`
  (1200×630). If you cannot generate a raster, produce an SVG and note that the user
  should export it to PNG — OG images must be raster.
- Replace the default Vite favicon with the ship.
- `<meta name="theme-color">` for both colour schemes.

### 10.5 GitHub Pages deploy

1. `vite.config.js` — set `base` to `'/<repo-name>/'` for the build only:
   ```js
   export default defineConfig(({ command }) => ({
     base: command === 'build' ? '/portfolio/' : '/',
     plugins: [react(), tailwindcss()],
   }));
   ```
   Ask the user for the real repo name; do not guess.
2. Create `public/.nojekyll` (empty file).
3. Create `.github/workflows/deploy.yml` — checkout, setup-node 20 with npm cache,
   `npm ci`, `npm run build`, `configure-pages`, `upload-pages-artifact` from `./dist`,
   then a `deploy` job using `deploy-pages`. Permissions: `contents: read`,
   `pages: write`, `id-token: write`. Concurrency group `pages`,
   `cancel-in-progress: false`.
4. Tell the user to set **Settings → Pages → Source: GitHub Actions**.
5. Verify all asset paths respect `base` — anything referencing `/public` must use
   `import.meta.env.BASE_URL`. A wrong `base` produces a blank page with 404s in the
   console, which is the most common Pages failure.

### 10.6 README

Rewrite it: what the project is, how to run it, how to add a project, how to swap the
resume PDF, EmailJS setup, deploy instructions, and the token conventions from Part 2.

### Acceptance checks — Task 10

- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95
- [ ] axe reports zero violations
- [ ] Deployed URL loads with no console errors and no 404s
- [ ] Works on a real phone, portrait and landscape
- [ ] Both themes correct on the deployed build
- [ ] All 11 GitHub links resolve (user must create the repos)

---

## PART 4 — OPEN ITEMS THE USER MUST RESOLVE

Flag these if they come up; do not invent answers.

1. **The `experience` node in `journey.js` is empty.** The user is a QA/testing
   trainee since January. Company name not yet supplied. There is a genuine thread
   worth drawing when they do supply it: their Server Health Monitoring project was
   itself testing — deliberately breaking Apache and Nginx and measuring the failure
   modes. That makes the trainee role read as continuation, not detour.
2. **CGPA is 7.2 on three resumes and 7.3 on one.** `profile.js` currently says 7.2.
   User must confirm.
3. **LinkedIn URL is a placeholder** (`/in/YOUR-HANDLE`). Must be replaced before launch.
4. **The 11 GitHub repos do not exist yet.** Slugs are in a comment at the bottom of
   `projects.js`. Each needs at least a README before launch — an empty repo behind a
   portfolio link is worse than no link.
5. **`touch-me-not-prolog` has `period: 'TODO: add dates'`** and did not appear on any
   resume. User must confirm it is real or delete the object.
6. **`public/resume.pdf` does not exist yet.**
7. **No hackathons.** The `activities` node is written around the user's actual PR and
   event-coordination roles. Do not add hackathons.
