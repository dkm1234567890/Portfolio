// A dock with a mooring post — the "harbour" stop for work/experience.
export default function HarbourIcon({ size = 48, className }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path d="M4,50 H60" stroke="var(--water-mid)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      <rect
        x="10"
        y="40"
        width="44"
        height="6"
        fill="var(--surface-2)"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="32" y="40" width="22" height="6" fill="var(--ink)" opacity="0.12" />

      <rect x="16" y="46" width="4" height="9" fill="var(--hull)" />
      <rect x="44" y="46" width="4" height="9" fill="var(--hull)" />

      <rect
        x="28"
        y="20"
        width="4"
        height="20"
        fill="var(--surface-2)"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="18" r="5" fill="var(--accent)" stroke="var(--primary)" strokeWidth="2" />
    </svg>
  )
}
