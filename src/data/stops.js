import { journey } from './journey'
import { projects } from './projects'

// One ordered list down the river: the first four story islands, then every
// project in chronological order, then the closing 'next' node. Projects are
// tagged kind:'project' so RiverNode (Task 7) can switch its body layout.
//
// Ordering matches the journey.js note: about -> activities -> experience ->
// skills -> [11 projects] -> next.
export const stops = [
  ...journey.slice(0, 4),
  ...projects.map((p) => ({ ...p, kind: 'project' })),
  ...journey.slice(4),
]

// Anchor fraction (0..1) of a stop along the river, derived from its index so
// adding a 12th project stays a one-object change in projects.js — no manual
// renumbering. Padded 0.06..0.94 so the first and last islands aren't jammed
// against the ends of the path.
export const anchorFor = (i, total) => 0.06 + (i / (total - 1)) * 0.88
