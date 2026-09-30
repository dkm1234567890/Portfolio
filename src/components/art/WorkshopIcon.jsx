// A shed with a small cog badge — the skills stop. Teeth are four fixed
// squares at the cardinal points rather than a computed gear path; simpler,
// and reads fine at this size.
export default function WorkshopIcon({ size = 48, className }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M8,50 H48 V26 L28,14 L8,26 Z"
        fill="var(--surface-2)"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M28,14 L48,26 V50 H28 Z" fill="var(--ink)" opacity="0.12" />

      <rect x="54" y="44" width="4" height="4" fill="var(--primary)" />
      <rect x="44" y="54" width="4" height="4" fill="var(--primary)" />
      <rect x="34" y="44" width="4" height="4" fill="var(--primary)" />
      <rect x="44" y="34" width="4" height="4" fill="var(--primary)" />
      <circle cx="46" cy="46" r="8" fill="var(--accent)" stroke="var(--primary)" strokeWidth="2" />
      <circle cx="46" cy="46" r="2.5" fill="var(--surface)" />
    </svg>
  )
}
