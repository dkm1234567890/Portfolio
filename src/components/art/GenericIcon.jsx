// Fallback marker: a small crate. Used for project islands (Task 8) and for
// any journey `icon` value that doesn't match a named illustration, so a
// typo in the data degrades gracefully instead of crashing.
export default function GenericIcon({ size = 48, className }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <rect
        x="14"
        y="26"
        width="36"
        height="26"
        fill="var(--surface-2)"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="32" y="26" width="18" height="26" fill="var(--ink)" opacity="0.12" />
      <rect x="14" y="26" width="36" height="7" fill="var(--accent)" stroke="var(--primary)" strokeWidth="2" />
    </svg>
  )
}
