// A tapering tower with a lamp room — "where this is heading".
export default function LighthouseIcon({ size = 48, className }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M26,54 L38,54 L34,20 L30,20 Z"
        fill="var(--surface-2)"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M32,20 L34,20 L38,54 L32,54 Z" fill="var(--ink)" opacity="0.12" />

      <rect x="27" y="12" width="10" height="8" fill="var(--accent)" stroke="var(--primary)" strokeWidth="2" />
      <path
        d="M25,12 L39,12 L32,4 Z"
        fill="var(--surface)"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect
        x="20"
        y="54"
        width="24"
        height="6"
        fill="var(--surface-2)"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M37,15 L54,9" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}
