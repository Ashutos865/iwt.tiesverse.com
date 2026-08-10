import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { STATS, SUMMIT } from '../lib/constants.js';
import { FAQ, PILLARS, PARTNER_TIERS, SESSIONS, WHY_ATTEND } from '../content/summit.js';

const EVENT_START = new Date('2026-09-19T09:00:00+05:30');
const EVENT_END = new Date('2026-09-20T18:00:00+05:30');

const STEPS = [
  { n: '01', title: 'Apply', body: 'Choose your category and complete the application in a few minutes.' },
  { n: '02', title: 'Review', body: 'The secretariat verifies your details and documents.' },
  { n: '03', title: 'Invitation', body: 'Approved applicants receive a QR pass for badge collection.' },
];

/** Large decorative mandala for the hero. */
function Mandala() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full text-brand-400" aria-hidden="true">
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
          return (
            <line key={i}
              x1={200 + 58 * Math.cos(a)} y1={200 + 58 * Math.sin(a)}
              x2={200 + 165 * Math.cos(a)} y2={200 + 165 * Math.sin(a)}
              strokeWidth="0.75" opacity="0.3" />
          );
        })}
        <circle cx="200" cy="200" r="10" fill="currentColor" opacity="0.6" stroke="none" />
      </g>
    </svg>
  );
}

/** Countdown before the event, "Live now" during, gone after (§6.1). */
function EventPhase() {
  const now = Date.now();
  if (now >= EVENT_END.getTime()) return null;
  if (now >= EVENT_START.getTime()) {
    return <span className="pill-ok !text-sm">● Live now</span>;
  }
  const days = Math.max(0, Math.ceil((EVENT_START.getTime() - now) / 86400000));
  return (
    <span className="inline-flex items-baseline gap-2 text-white">
      <span className="font-display text-4xl font-semibold">{days}</span>
      <span className="text-xs uppercase tracking-[0.2em] text-white/60">days to go</span>
    </span>
  );
}

function SectionHead({ eyebrow, title, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1.5 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export default function Home() {
  const featured = useMemo(() => SESSIONS.filter((s) => ['Plenary', 'Keynote', 'Fireside Chat', 'Special Address'].includes(s.type)).slice(0, 4), []);
  const partnerNames = PARTNER_TIERS.flatMap((t) => t.members);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      {/* Hero — navy ground per the reference, mandala artwork right (§6.1). */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pointer-events-none absolute -right-24 top-1/2 hidden h-[560px] w-[560px] -translate-y-1/2 opacity-50 lg:block">
          <Mandala />
        </div>

        <div className="shell relative py-16 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">
            {SUMMIT.kicker}
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">
            Indus Water
            <br />
            Treaty 2026
          </h1>

          <p className="mt-6 max-w-xl font-display text-xl leading-snug text-white/85 sm:text-2xl">
            {SUMMIT.theme}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-semibold text-white/85">
            <span className="inline-flex items-center gap-2"><CalendarIcon /> {SUMMIT.dates}</span>
            <span className="inline-flex items-center gap-2"><PinIcon /> {SUMMIT.venue}</span>
            <EventPhase />
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary uppercase tracking-wide">Register now</Link>
            <Link to="/agenda" className="btn-ghost !border-white/30 !bg-transparent !text-white uppercase tracking-wide">
              View agenda
            </Link>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-brand-600 text-white">
        <div className="shell grid grid-cols-2 gap-x-4 gap-y-6 py-8 sm:grid-cols-3 lg:grid-cols-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="font-display text-3xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About + how registration works */}
      <section className="shell grid gap-12 py-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow">About the Dialogue</p>
          <p className="mt-4 font-display text-2xl leading-snug text-ink-900">
            A fresh assessment of South Asia's most enduring water agreement.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-700">{SUMMIT.about}</p>
          <Link to="/about" className="btn-text mt-3">About the Dialogue →</Link>
        </div>
        <div>
          <p className="eyebrow">How registration works</p>
          <div className="mt-5 space-y-4">
            {STEPS.map((step) => (
              <div key={step.n} className="flex gap-4 rounded-card border border-ink-200 bg-white p-4">
                <span className="font-display text-2xl font-semibold text-brand-500">{step.n}</span>
                <div>
                  <h3 className="text-sm font-semibold text-ink-900">{step.title}</h3>
                  <p className="mt-0.5 text-sm text-ink-700">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Theme pillars (§6.3) */}
      <section className="bg-white">
        <div className="shell py-16">
          <SectionHead eyebrow="Theme & context" title="Four questions the Dialogue asks" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <Link key={p.title} to="/agenda" className="card transition hover:border-brand-600">
                <h3 className="font-display text-lg font-semibold text-ink-900">{p.title}</h3>
                <p className="mt-1.5 text-sm text-ink-700">{p.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Programme highlights (§6.7) */}
      <section className="shell py-16">
        <SectionHead
          eyebrow="Programme highlights"
          title="On the agenda"
          action={<Link to="/agenda" className="btn-text">Full agenda →</Link>}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((s) => (
            <Link key={s.id} to="/agenda" className="card transition hover:border-brand-600">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                {s.day === 'day1' ? 'Day 1' : 'Day 2'} · {s.start} · {s.type}
              </p>
              <h3 className="mt-1.5 font-display text-lg font-semibold text-ink-900">{s.title}</h3>
              <p className="mt-1 text-sm text-ink-700">{s.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why attend (§6.6) */}
      <section className="bg-navy-950 text-white">
        <div className="shell py-16">
          <p className="eyebrow !text-brand-400">Why attend</p>
          <h2 className="mt-1.5 font-display text-2xl font-semibold sm:text-3xl">What two days here are worth</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_ATTEND.map((w) => (
              <div key={w.title}>
                <h3 className="font-display text-lg font-semibold text-brand-400">{w.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/75">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners strip (§6.8) */}
      <section className="border-t border-ink-200 bg-white">
        <div className="shell flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-8 sm:justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-500">Our partners</p>
          {partnerNames.map((partner) => (
            <span key={partner} className="font-display text-lg font-semibold text-ink-500/70">{partner}</span>
          ))}
          <Link to="/partners" className="btn-text !min-h-0 text-xs">All partners →</Link>
        </div>
      </section>

      {/* FAQ (§6.10) */}
      <section className="shell max-w-3xl py-16">
        <SectionHead eyebrow="Questions" title="Before you apply" />
        <div className="divide-y divide-ink-200 rounded-card border border-ink-200 bg-white">
          {FAQ.map((f, i) => (
            <div key={f.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-ink-900"
                aria-expanded={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {f.q}
                <span className="text-brand-600">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-sm leading-relaxed text-ink-700">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA (§6.11) */}
      <section className="shell pb-16">
        <div className="rounded-card bg-navy-950 p-8 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-2xl">Registration is open</h3>
            <p className="mt-1 text-sm text-white/70">Seven participation tracks, from delegates to media accreditation.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 sm:mt-0">
            <Link to="/register" className="btn-primary uppercase tracking-wide">Apply to attend</Link>
            <Link to="/status" className="btn-ghost !border-white/30 !bg-transparent !text-white uppercase tracking-wide">
              Check status
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-400">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-400">
      <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
