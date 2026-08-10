import { useState } from 'react';
import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown.jsx';
import MandalaDivider from '../components/MandalaDivider.jsx';
import { KEY_FACTS, ORGANISER, SUMMIT } from '../lib/constants.js';
import { BACKGROUND, DELIVERABLES, FAQ, PILLARS, SESSIONS, THEMES } from '../content/summit.js';

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
  const [openFaq, setOpenFaq] = useState(null);
  // The four analytical sessions plus the valedictory — the substance of the day.
  const programme = SESSIONS.filter((s) => s.kind === 'session' && s.id !== 'inaugural');

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pointer-events-none absolute -right-24 top-1/2 hidden h-[560px] w-[560px] -translate-y-1/2 opacity-50 lg:block">
          <Mandala />
        </div>

        <div className="shell relative py-16 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">
            {SUMMIT.kicker}
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">
            {SUMMIT.displayTitle}
            <br />
            {SUMMIT.displaySubtitle}
          </h1>

          <p className="mt-6 max-w-xl font-display text-xl leading-snug text-white/85 sm:text-2xl">
            “{SUMMIT.theme}”
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-semibold text-white/85">
            <span className="inline-flex items-center gap-2"><CalendarIcon /> {SUMMIT.date}</span>
            <span className="inline-flex items-center gap-2"><PinIcon /> {SUMMIT.venue}</span>
          </div>

          {/* Why this date — the single most important fact about the event. */}
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/60">
            Convened on the {SUMMIT.anniversary} anniversary of the signing of the Indus Waters
            Treaty in {SUMMIT.treatySignedYear}.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary uppercase tracking-wide">Register now</Link>
            <Link to="/agenda" className="btn-ghost !border-white/30 !bg-transparent !text-white uppercase tracking-wide">
              View agenda
            </Link>
          </div>

          <Countdown className="mt-10 max-w-2xl" />
        </div>
      </section>

      {/* Key facts — every value traceable to the concept note. */}
      <section className="bg-brand-600 text-white">
        <div className="shell grid grid-cols-2 gap-x-4 gap-y-6 py-8 sm:grid-cols-3 lg:grid-cols-6">
          {KEY_FACTS.map((fact) => (
            <div key={fact.label} className="text-center lg:text-left">
              <p className="font-display text-3xl font-semibold">{fact.value}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70">
                {fact.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Background + how registration works */}
      <section className="shell grid gap-12 py-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Background</p>
          <p className="mt-4 font-display text-2xl leading-snug text-ink-900">
            What happens to a treaty signed in goodwill when goodwill runs out?
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-700">{BACKGROUND[0]}</p>
          <Link to="/about" className="btn-text mt-3">Read the background note →</Link>
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

      <MandalaDivider className="shell pb-4" />

      {/* The four analytical pillars previewed in the inaugural session */}
      <section className="bg-white">
        <div className="shell py-16">
          <SectionHead
            eyebrow="The four pillars"
            title="How the day is argued"
            action={<Link to="/about" className="btn-text">All six themes →</Link>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <div key={p.title} className="card">
                <h3 className="font-display text-lg font-semibold text-ink-900">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programme */}
      <section className="shell py-16">
        <SectionHead
          eyebrow="Programme"
          title="On the agenda"
          action={<Link to="/agenda" className="btn-text">Full running order →</Link>}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {programme.map((s) => (
            <Link key={s.id} to="/agenda" className="card transition hover:border-brand-600">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                {s.start}–{s.end} · {s.type}
              </p>
              <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-ink-900">
                {s.title}
              </h3>
              <p className="mt-1 line-clamp-3 text-sm text-ink-700">{s.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Deliverables — what the dialogue produces */}
      <section className="bg-navy-950 text-white">
        <div className="shell py-16">
          <p className="eyebrow !text-brand-400">Deliverables & outcomes</p>
          <h2 className="mt-1.5 font-display text-2xl font-semibold sm:text-3xl">
            What the dialogue leaves behind
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
            The dialogue is designed not only as a set of panels but as an evidence-generating
            instrument: every claim advanced is tied to a verifiable, citable source. Six
            coordinated tracks turn the proceedings into a durable, proof-backed record.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DELIVERABLES.map((d) => (
              <div key={d.n}>
                <p className="font-display text-sm font-semibold text-white/40">{d.n}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-brand-400">{d.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/75">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes */}
      <section className="bg-white">
        <div className="shell py-16">
          <SectionHead
            eyebrow="Themes & objectives"
            title="Six interlocking themes"
            action={<Link to="/about" className="btn-text">Read them in full →</Link>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {THEMES.map((t) => (
              <div key={t.n} className="card">
                <p className="font-display text-sm font-semibold text-brand-500">{t.n}</p>
                <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-ink-900">
                  {t.title}
                </h3>
                <p className="mt-1.5 line-clamp-4 text-sm text-ink-700">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MandalaDivider className="shell py-2" />

      {/* Organiser */}
      <section className="shell pb-16 pt-10">
        <div className="card">
          <p className="eyebrow">The organisation</p>
          <h2 className="mt-1.5 font-display text-2xl font-semibold text-ink-900">
            {ORGANISER.name} ({ORGANISER.abbr})
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-700">
            {ORGANISER.description}
          </p>
          <a
            href={ORGANISER.website}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-text mt-2"
          >
            {ORGANISER.websiteLabel} →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="shell max-w-3xl pb-16">
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

      {/* Final CTA */}
      <section className="shell pb-16">
        <div className="rounded-card bg-navy-950 p-8 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-2xl">Registration is open</h3>
            <p className="mt-1 text-sm text-white/70">
              Seven participation tracks, from delegates to media accreditation.
            </p>
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
