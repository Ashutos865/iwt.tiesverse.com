/**
 * The Confluence Mark + lockup (design(1).md §4): three thin channels
 * converging into one river inside a rounded droplet boundary. A simple
 * vector mark — round caps, no gradients, works from favicon to stage size.
 */
export function ConfluenceMark({ size = 36, light = true, className = '' }) {
  const channel = light ? '#38AFE0' : '#0C7DB8';   // river accent
  const outline = light ? '#FFFFFF' : '#0A1722';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* rounded droplet / river-stone boundary */}
      <path
        d="M12 1.8 C17.2 1.8 21.2 6 21.2 11.6 C21.2 17.9 16.7 22.2 12 22.2 C7.3 22.2 2.8 17.9 2.8 11.6 C2.8 6 6.8 1.8 12 1.8 Z"
        stroke={outline}
        strokeWidth="1.6"
      />
      {/* three tributaries converging… */}
      <path d="M7 6.6 C8.2 9 9.7 11.2 11.3 13" stroke={channel} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 5.2 C12 7.8 12 10.4 12 13" stroke={channel} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M17 6.6 C15.8 9 14.3 11.2 12.7 13" stroke={channel} strokeWidth="1.7" strokeLinecap="round" />
      {/* …into one river */}
      <path d="M12 13.6 L12 18.6" stroke={outline} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Horizontal lockup. `light` for navy grounds, `compact` for the mobile
 * header. The wordmark's two lines never re-break between pages.
 */
export default function BrandLogo({ light = true, compact = false }) {
  return (
    <span className="flex items-center" style={{ gap: 12 }}>
      <ConfluenceMark size={compact ? 30 : 36} light={light} />
      <span className="leading-tight">
        <span
          className={`block font-bold uppercase ${light ? 'text-white' : 'text-ink-900'}`}
          style={{ fontSize: compact ? 12 : 14, letterSpacing: '0.02em' }}
        >
          Indus Water Treaty
        </span>
        <span
          className="block font-semibold uppercase text-brand-400"
          style={{ fontSize: compact ? 9 : 10, letterSpacing: '0.16em' }}
        >
          Dialogue 2026 · New Delhi
        </span>
      </span>
    </span>
  );
}
