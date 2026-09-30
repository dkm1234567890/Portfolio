# Portfolio

A single-page portfolio built around a river that carries the visitor from
intro to contact: a paper boat sails down a scroll-linked path, past island
nodes for the author's background, skills and eleven projects, before
widening into an estuary with a resume box and a contact mailbox.

Stack: Vite 8, React 19, Tailwind CSS v4 (CSS-first, no config file), and
`motion` (not `framer-motion`) for animation.

## Running it

```bash
npm install
npm run dev       # dev server, http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint       # eslint
```

## Project structure

```
src/
  components/
    river/        River background, the scroll-linked ship, RiverNode
    art/           Decorative island illustrations (aria-hidden)
    icons/         Inline currentColor icons (GitHub, LinkedIn, Twitter)
  data/            Every string on the page lives here — see below
  hooks/
```

## Adding a project

Every project island is generated from `src/data/projects.js` — there is no
per-project JSX anywhere. To add one, append an object to the `projects`
array:

```js
{
  slug: 'my-new-project',
  name: 'My New Project',
  domain: 'Category',
  period: 'Month Year – Month Year',
  problem: 'The one-line hook.',
  detail: ['Paragraph one.', 'Paragraph two.'],
  tags: ['Tag', 'Tag'],
  repo: `${GH}/my-new-project`,
  featured: true, // optional — restrained "Featured" chip, use sparingly
}
```

That's the whole change. `src/data/stops.js` splices `projects` into the
river's ordered stop list and derives each island's position along the path
from its array index (`anchorFor`), so nothing else needs renumbering.

## Swapping the resume PDF

Put the file at `public/resume.pdf`. The filename and "last updated" text
shown on the page come from `src/data/profile.js`'s `resume` field — update
`resume.updated` when you replace the file. The download button always
renders even if the file is missing; it'll just 404 until you add it.

## Contact form (EmailJS)

The mailbox sends through [EmailJS](https://www.emailjs.com). Copy
`.env.example` to `.env` and fill in your service ID, template ID and public
key:

```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

These three values are inlined into the built JS bundle and are visible to
anyone who opens devtools on the live site — that's expected and fine for
EmailJS. The actual protection is your EmailJS account's domain allowlist
and rate limits, not secrecy of these IDs. The template `emailjs.send()` is
called with receives three fields: `from_name`, `reply_to`, `message`.

If sending fails (or the keys aren't configured), the form shows an error
plus a `mailto:` link to `profile.email` so a recruiter is never blocked.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.
One-time setup:

1. In the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.
2. In **Settings → Secrets and variables → Actions**, add three repository
   secrets: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`,
   `VITE_EMAILJS_PUBLIC_KEY`. Vite inlines `VITE_*` env vars at **build**
   time, and the build runs on GitHub's runner, not your machine — `.env` is
   gitignored, so without these secrets the deployed contact form fails
   silently while still working on localhost.
3. Push to `main`. The Actions tab shows the build/deploy run.

`vite.config.js` sets `base: '/portfolio/'` for production builds only
(dev stays `/`) — this must match the actual repo name. Anything that
references a file in `public/` does so via `import.meta.env.BASE_URL`
(see `profile.resume.file` usage in `Hero.jsx`/`ResumeBox.jsx`), not a bare
`/path`, since a bare absolute path breaks under the `/portfolio/` prefix.
`og:image`/`og:url` in `index.html` are full absolute URLs for the same
reason but from the other direction — `<meta content>` values are never
rewritten by Vite's `base`, unlike `<link href>`/`<script src>`.

## Token conventions

Every colour in the project lives in `src/index.css`, in three places that
must all stay in sync: the `:root` block (light), the `[data-theme='dark']`
block, and `@theme inline` (which hands the variable to Tailwind as a
utility class). Nowhere else in the codebase should a hex value appear —
new colours get a token first, then get used via `var(--token)` in SVG or a
`bg-token`/`text-token` Tailwind class.

- **Accent is split four ways.** A single vivid amber can't be both an
  illustration fill and readable text: `--accent` is for shapes only, never
  text; `--accent-text` for small text/icons; `--accent-cta` +
  `--accent-on` as a button background/label pair. Never `text-accent`.
- **One easing curve, three durations.** `cubic-bezier(0.22, 1, 0.36, 1)`
  (`--ease`); 120ms / 320ms / 600ms. Springs are reserved for the ship's bob
  and the splash burst — everything else uses the shared curve.
- **`prefers-reduced-motion` changes behaviour, not speed.** Use the
  project's own `usePrefersReducedMotion()` hook (a live `matchMedia`
  subscription) for any component-level check — not Motion's own
  `useReducedMotion()`, which reads the setting once on mount and misses a
  live OS toggle mid-session.
- **Dark mode** is driven by `data-theme` on `<html>` (set by a blocking
  script in `index.html` to avoid a flash), not the `class` strategy. A
  `dark:` variant needs the `@custom-variant dark` registered in
  `index.css`.
