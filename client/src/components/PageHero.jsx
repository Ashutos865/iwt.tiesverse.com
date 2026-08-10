import { SUMMIT } from '../lib/constants.js';

/**
 * Navy page hero band (design.md §5.3): H1, one supporting line, optional
 * date/venue metadata. No critical action lives inside it.
 */
export default function PageHero({ title, lead, meta = true, children }) {
  return (
    <section className="page-hero">
      {/* subtle river-line motif */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 1200 200">
        <path d="M0 150 C200 120 300 180 500 150 S 900 110 1200 140" fill="none" stroke="white" strokeWidth="1.5" />
        <path d="M0 170 C250 140 350 200 550 170 S 950 130 1200 160" fill="none" stroke="white" strokeWidth="1" />
      </svg>
      <div className="page-hero-inner relative">
        <h1>{title}</h1>
        {lead && <p>{lead}</p>}
        {meta && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-400">
            {SUMMIT.dates} · {SUMMIT.venue}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
