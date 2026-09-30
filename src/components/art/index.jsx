import SourceIcon from './SourceIcon'
import VillageIcon from './VillageIcon'
import HarbourIcon from './HarbourIcon'
import WorkshopIcon from './WorkshopIcon'
import LighthouseIcon from './LighthouseIcon'
import GenericIcon from './GenericIcon'

// A switch over statically-referenced components (rather than a name -> ref
// lookup rendered as a dynamic JSX tag) so every branch stays a literal,
// analyzable component reference. A missing/unrecognised `name` degrades to
// the generic crate instead of crashing the node it's attached to.
export function IslandIcon({ name, size, className }) {
  switch (name) {
    case 'source':
      return <SourceIcon size={size} className={className} />
    case 'village':
      return <VillageIcon size={size} className={className} />
    case 'harbour':
      return <HarbourIcon size={size} className={className} />
    case 'workshop':
      return <WorkshopIcon size={size} className={className} />
    case 'lighthouse':
      return <LighthouseIcon size={size} className={className} />
    default:
      return <GenericIcon size={size} className={className} />
  }
}

export { GenericIcon }
