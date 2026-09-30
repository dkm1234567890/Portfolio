// A small cluster of two huts for the "off the coursework" stop.
export default function VillageIcon({ size = 48, className }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M8,46 H26 V32 L17,23 L8,32 Z"
        fill="var(--surface-2)"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M17,23 L26,32 V46 H17 Z" fill="var(--ink)" opacity="0.12" />

      <path
        d="M30,50 H52 V30 L41,19 L30,30 Z"
        fill="var(--surface)"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M41,19 L52,30 V50 H41 Z" fill="var(--ink)" opacity="0.12" />
      <rect x="38" y="39" width="6" height="11" fill="var(--accent)" />
    </svg>
  )
}
