import { Link } from 'react-router-dom';
import { PARTNERS, STATS, SUMMIT } from '../lib/constants.js';

const STEPS = [
  { n: '01', title: 'Apply', body: 'Choose your category and complete the application in a few minutes.' },
  { n: '02', title: 'Review', body: 'The secretariat verifies your details and documents.' },
  { n: '03', title: 'Invitation', body: 'Approved applicants receive a QR pass for badge collection.' },
];

/** Large decorative mandala for the hero, echoing the mockup artwork. */
function Mandala() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full text-brand-500" aria-hidden="true">
      <g fill="none" stroke="currentColor">
        <circle cx="200" cy="200" r="190" strokeWidth="1" opacity="0.35" strokeDasharray="3 4" />
        <circle cx="200" cy="200" r="165" strokeWidth="1.5" opacity="0.5" />
        <circle cx="200" cy="200" r="140" strokeWidth="1" opacity="0.4" strokeDasharray="8 5" />
        <circle cx="200" cy="200" r="112" strokeWidth="1.5" opacity="0.55" />
        <circle cx="200" cy="200" r="86" strokeWidth="1" opacity="0.45" strokeDasharray="2 3" />
        <circle cx="200" cy="200" r="58" strokeWidth="1.5" opacity="0.6" />
        <circle cx="200" cy="200" r="30" strokeWidth="1" opacity="0.5" />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i * Math.PI) / 12;
          const x1 = 200 + 58 * Math.cos(a);
          const y1 = 200 + 58 * Math.sin(a);
          const x2 = 200 + 165 * Math.cos(a);
          const y2 = 200 + 165 * Math.sin(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.75" opacity="0.3" />;
        })}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6 + Math.PI / 12;
          const x = 200 + 126 * Math.cos(a);
          const y = 200 + 126 * Math.sin(a);
          return <circle key={i} cx={x} cy={y} r="9" strokeWidth="1" opacity="0.5" />;
        })}
        <circle cx="200" cy="200" r="10" fill="currentColor" opacity="0.6" stroke="none" />
      </g>
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero — ivory ground, serif headline, mandala artwork on the right. */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 opacity-70 lg:block">
          <Mandala />
        </div>

        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
            {SUMMIT.kicker}
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[1.05] text-brand-700 sm:text-7xl">
            Indus Water
            <br />
            Treaty 2026
          </h1>

          <div className="hero-divider" />

          <p className="max-w-xl font-display text-xl leading-snug text-ink-800 sm:text-2xl">
            {SUMMIT.theme}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-semibold text-ink-800">
            <span className="inline-flex items-center gap-2">
              <CalendarIcon /> {SUMMIT.dates}
            </span>
            <span className="inline-flex items-center gap-2">
              <PinIcon /> {SUMMIT.venue}
            </span>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary uppercase tracking-wide">
              Register Now
            </Link>
            <Link to="/status" className="btn-ghost uppercase tracking-wide">
              Check Application Status
            </Link>
          </div>
        </div>
      </section>

      {/* Stats band — solid teal strip, as on the mockup. */}
      <section className="bg-brand-600 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-6 px-5 py-8 sm:grid-cols-3 lg:grid-cols-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="font-display text-3xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About + how registration works */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
            About the Dialogue
          </h2>
          <p className="mt-4 font-display text-2xl leading-snug text-ink-900">
            A fresh assessment of South Asia's most enduring water agreement.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-600/90">{SUMMIT.about}</p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
            How registration works
          </h2>
          <div className="mt-5 space-y-4">
            {STEPS.map((step) => (
              <div key={step.n} className="flex gap-4 rounded-xl border border-ink-100 bg-white p-4">
                <span className="font-display text-2xl font-semibold text-brand-500">{step.n}</span>
                <div>
                  <h3 className="text-sm font-semibold text-ink-900">{step.title}</h3>
                  <p className="mt-0.5 text-sm text-ink-600/80">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="rounded-xl bg-ink-900 p-8 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-2xl">Registration is open</h3>
            <p className="mt-1 text-sm text-white/70">
              Seven participation tracks, from delegates to media accreditation.
            </p>
          </div>
          <Link to="/register" className="btn-primary mt-5 uppercase tracking-wide sm:mt-0">
            Choose your category
          </Link>
        </div>
      </section>

      {/* Partners strip */}
      <section className="border-t border-ink-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-5 py-8 sm:justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-600/60">
            Our Partners
          </p>
          {PARTNERS.map((partner) => (
            <span key={partner} className="font-display text-lg font-semibold text-ink-600/50">
              {partner}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-600">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-600">
      <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
