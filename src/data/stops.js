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

// There's no per-stop position data: each RiverNode measures where its own
// card sits and places its marker on the path at that height, so adding a
// project stays a one-object change in projects.js.
