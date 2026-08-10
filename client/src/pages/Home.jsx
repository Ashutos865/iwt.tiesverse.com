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

/**
 * Portal tiles — the reference site's primary navigation device. Each is a
 * real route; the grid is a second, more prominent way into the same places
 * the nav card reaches.
 */
const TILES = [
  { to: '/about', title: 'About the Dialogue', sub: 'Background, six themes and the case for abeyance', bg: 'bg-tile-pine', span: 'sm:col-span-2' },
  { to: '/agenda', title: 'Agenda', sub: 'The full running order, 09:00–18:00', bg: 'bg-tile-teal' },
  { to: '/speakers', title: 'Speakers', sub: 'Jurists, engineers, security scholars, diplomats', bg: 'bg-tile-slate' },
  { to: '/partners', title: 'Partners', sub: 'Partnership programme and tiers', bg: 'bg-tile-petrol' },
  { to: '/media', title: 'Media Centre', sub: 'Accreditation, releases and the media kit', bg: 'bg-tile-bronze' },
  { to: '/register', title: 'Register', sub: 'Seven participation tracks', bg: 'bg-tile-navy', span: 'sm:col-span-2' },
];

function SectionHead({ eyebrow, title, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title mt-1.5">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const programme = SESSIONS.filter((s) => s.kind === 'session' && s.id !== 'inaugural');

  return (
    <>
      {/* Hero — centred, on the warm ground, following the reference. */}
      <section className="shell flex flex-col items-center pb-10 pt-2 text-center">
        <p className="eyebrow">{SUMMIT.kicker}</p>
        {/* The one place the Larken face is used. */}
        <h1 className="mt-4 font-title text-4xl font-normal leading-[1.05] text-brand-800 sm:text-6xl">
          {SUMMIT.displayTitle} {SUMMIT.displaySubtitle}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-snug text-ink-800 sm:text-xl">
          “{SUMMIT.theme}”
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-ink-700">
          <span className="inline-flex items-center gap-2"><CalendarIcon /> {SUMMIT.date}</span>
          <span className="inline-flex items-center gap-2"><PinIcon /> {SUMMIT.venue}</span>
        </div>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-500">
          Convened on the {SUMMIT.anniversary} anniversary of the signing of the Indus Waters
          Treaty in {SUMMIT.treatySignedYear}.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/register" className="btn-primary uppercase tracking-wide">Register now</Link>
          <Link to="/agenda" className="btn-ghost uppercase tracking-wide">View agenda</Link>
        </div>

        <Countdown className="mt-10 w-full max-w-2xl" />
      </section>

      {/* Portal tiles */}
      <section className="shell pb-14">
        <div className="grid gap-4 sm:grid-cols-4">
          {TILES.map((t) => (
            <Link key={t.to} to={t.to} className={`tile ${t.bg} ${t.span || ''}`}>
              <span className="tile-title">{t.title}</span>
              <span className="tile-sub">{t.sub}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Key facts */}
      <section className="bg-brand-800 text-white">
        <div className="shell grid grid-cols-2 gap-x-4 gap-y-6 py-10 sm:grid-cols-3 lg:grid-cols-6">
          {KEY_FACTS.map((fact) => (
            <div key={fact.label} className="text-center lg:text-left">
              <p className="text-3xl font-bold">{fact.value}</p>
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
          <p className="mt-3 text-2xl font-bold leading-snug text-brand-800">
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
                <span className="text-2xl font-bold text-brand-600">{step.n}</span>
                <div>
                  <h3 className="text-sm font-bold text-ink-900">{step.title}</h3>
                  <p className="mt-0.5 text-sm text-ink-700">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MandalaDivider className="shell pb-4" />

      {/* Four analytical pillars */}
      <section className="bg-white">
        <div className="shell py-16">
          <SectionHead
            eyebrow="The four pillars"
            title="How the day is argued"
            action={<Link to="/about#themes" className="btn-text">All six themes →</Link>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <div key={p.title} className="rounded-card border border-ink-200 bg-paper p-5">
                <h3 className="text-lg font-bold text-brand-800">{p.title}</h3>
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
              <p className="text-xs font-bold uppercase tracking-wide text-brand-700">
                {s.start}–{s.end} · {s.type}
              </p>
              <h3 className="mt-1.5 text-lg font-bold leading-snug text-ink-900">{s.title}</h3>
              <p className="mt-1 line-clamp-3 text-sm text-ink-700">{s.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Deliverables */}
      <section className="bg-brand-900 text-white">
        <div className="shell py-16">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-300">
            Deliverables & outcomes
          </p>
          <h2 className="mt-1.5 text-2xl font-bold sm:text-3xl">What the dialogue leaves behind</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
            The dialogue is designed not only as a set of panels but as an evidence-generating
            instrument: every claim advanced is tied to a verifiable, citable source. Six
            coordinated tracks turn the proceedings into a durable, proof-backed record.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DELIVERABLES.map((d) => (
              <div key={d.n}>
                <p className="text-sm font-bold text-white/40">{d.n}</p>
                <h3 className="mt-1 text-lg font-bold text-brand-300">{d.title}</h3>
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
            action={<Link to="/about#themes" className="btn-text">Read them in full →</Link>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {THEMES.map((t) => (
              <div key={t.n} className="rounded-card border border-ink-200 bg-paper p-5">
                <p className="text-sm font-bold text-brand-600">{t.n}</p>
                <h3 className="mt-1 text-lg font-bold leading-snug text-brand-800">{t.title}</h3>
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
          <h2 className="section-title mt-1.5">
            {ORGANISER.name} ({ORGANISER.abbr})
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-700">
            {ORGANISER.description}
          </p>
          <a href={ORGANISER.website} target="_blank" rel="noreferrer noopener" className="btn-text mt-2">
            {ORGANISER.websiteLabel} →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="shell max-w-3xl pb-16">
        <SectionHead eyebrow="Questions" title="Before you apply" />
        <div className="divide-y divide-ink-200 overflow-hidden rounded-card border border-ink-200 bg-white">
          {FAQ.map((f, i) => (
            <div key={f.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-ink-900 hover:bg-brand-50"
                aria-expanded={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {f.q}
                <span className="text-lg text-brand-700">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-sm leading-relaxed text-ink-700">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="shell pb-16">
        <div className="rounded-card bg-tile-navy p-8 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold">Registration is open</h3>
            <p className="mt-1 text-sm text-white/75">
              Seven participation tracks, from delegates to media accreditation.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 sm:mt-0">
            <Link to="/register" className="btn-primary uppercase tracking-wide">Apply to attend</Link>
            <Link
              to="/status"
              className="btn-ghost !border-white/40 !text-white hover:!bg-white/10 uppercase tracking-wide"
            >
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
