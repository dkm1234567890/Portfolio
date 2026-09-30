// The spring where the river starts. A rounded mound (lit left facet, shaded
// right facet — light always from the upper left, per the ship's style) with
// water emerging at its base.
export default function SourceIcon({ size = 48, className }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M10,46 Q10,24 32,24 Q54,24 54,46 Z"
        fill="var(--surface-2)"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M32,24 Q54,24 54,46 L32,46 Z" fill="var(--ink)" opacity="0.12" />
      <path
        d="M6,49 Q16,45 26,49 Q36,53 46,49 Q52,47 58,49"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
