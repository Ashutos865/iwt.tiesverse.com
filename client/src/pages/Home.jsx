import { useState } from 'react';
import { Link } from 'react-router-dom';
import RiverConfluenceVisual from '../components/RiverConfluenceVisual.jsx';
import { EVENT_EDITION, SUMMIT, eventPhase } from '../lib/constants.js';
import { FAQ, PARTNER_TIERS, PRESS_ITEMS, SESSIONS, SPEAKERS } from '../content/summit.js';

/* ── shared section furniture ────────────────────────────────────────── */
function Eyebrow({ children, light = false }) {
  return (
    <p className={`text-[12px] font-bold uppercase tracking-[0.18em] ${light ? 'text-brand-400' : 'text-brand-600'}`}>
      {children}
    </p>
  );
}

function SectionHeader({ eyebrow, title, action, light = false }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
        <h2 className={`mt-2 max-w-2xl font-display text-3xl font-medium leading-[1.1] sm:text-[44px] ${light ? 'text-white' : 'text-ink-900'}`}>
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

/* ── 1. Hero (§7) ────────────────────────────────────────────────────── */
function Hero() {
  const { phase } = eventPhase();
  const regState = phase === 'post' ? 'closed' : EVENT_EDITION.registration.state;

  const status =
    phase === 'live' ? 'EVENT LIVE'
      : regState === 'open' ? 'APPLICATIONS OPEN'
        : regState === 'not_open' ? 'APPLICATIONS OPENING SOON'
          : 'REGISTRATION CLOSED';

  return (
    <section className="bg-navy-975 text-white">
      <div className="shell grid gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
        {/* Left: identity + actions — 7 columns */}
        <div className="lg:col-span-7">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-brand-400">
            New Delhi · International Policy Dialogue
          </p>

          <h1 className="mt-5 max-w-[720px] font-display text-[44px] font-medium leading-[1.02] sm:text-[60px] xl:text-[76px]">
            Indus Water Treaty
            <br />
            Dialogue 2026
          </h1>

          <p className="mt-8 text-[12px] font-bold uppercase tracking-[0.18em] text-white/45">2026 Theme</p>
          <p className="mt-2 max-w-[680px] font-display text-[21px] leading-snug text-white/85 sm:text-[24px]">
            Blood and Water Cannot Flow Together:
            <br className="hidden sm:block" />
            {' '}Law, Reciprocity and Regional Security
          </p>

          {/* metadata row with separators (§7.3) */}
          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-[14px] font-semibold text-white/85">
            <span className="inline-flex items-center gap-2">
              <CalendarIcon />19–20 SEP 2026
            </span>
            <Rule />
            <span className="inline-flex items-center gap-2">
              <PinIcon />BHARAT MANDAPAM, NEW DELHI
            </span>
            <Rule />
            <span className="inline-flex items-center gap-2">
              {status === 'APPLICATIONS OPEN' && <span className="h-2 w-2 rounded-full bg-ok" aria-hidden="true" />}
              {status}
            </span>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {phase !== 'post' && regState === 'open' ? (
              <>
                <Link to="/register" className="inline-flex h-12 items-center rounded bg-brand-600 px-6 text-[13px] font-bold uppercase tracking-wide transition hover:bg-brand-500">
                  Register / Apply
                </Link>
                <Link to="/contact" className="inline-flex h-12 items-center rounded border border-white/30 px-6 text-[13px] font-bold uppercase tracking-wide transition hover:border-white/60">
                  Request Invitation
                </Link>
              </>
            ) : (
              <Link to="/agenda" className="inline-flex h-12 items-center rounded bg-brand-600 px-6 text-[13px] font-bold uppercase tracking-wide transition hover:bg-brand-500">
                View Agenda
              </Link>
            )}
          </div>
          <Link to="/agenda" className="mt-5 inline-block text-[15px] font-semibold text-brand-400 hover:text-brand-500">
            View 2026 agenda →
          </Link>
        </div>

        {/* Right: confluence field — 5 columns */}
        <div className="hidden lg:col-span-5 lg:block">
          <RiverConfluenceVisual />
        </div>

        {/* Mobile: compact visual after content (§19.2) */}
        <div className="-mt-4 h-[300px] lg:hidden">
          <RiverConfluenceVisual />
        </div>
      </div>
    </section>
  );
}

const Rule = () => <span aria-hidden="true" className="hidden h-4 w-px bg-white/[0.18] sm:block" />;

/* ── 2. Participation proof band (§8) ────────────────────────────────── */
function ProofBand() {
  return (
    <section className="border-b border-ink-200 bg-brand-50/60">
      <div className="shell grid grid-cols-2 gap-y-8 py-9 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-ink-200">
        {EVENT_EDITION.metrics.map((m) => (
          <div key={m.label} className="text-center lg:px-6">
            <p className="font-display text-[36px] font-medium leading-none text-navy-900 sm:text-[40px]">{m.value}</p>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-500">{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── 3. About + theme with issue rails (§9) ──────────────────────────── */
const ISSUE_RAILS = [
  { n: '01', title: 'Treaty law & institutions', text: 'What the treaty text, arbitration history and international water law actually permit — and where interpretation ends.' },
  { n: '02', title: 'Water security & climate pressure', text: 'Glacial melt, monsoon volatility and demand growth against allocations fixed six decades ago.' },
  { n: '03', title: 'Reciprocity, diplomacy & regional stability', text: 'Whether shared rivers can still build trust in an era of strategic competition.' },
];

function DialogueContext() {
  return (
    <section className="bg-paper">
      <div className="shell grid gap-12 py-24 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-5">
          <Eyebrow>About the Dialogue</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-medium leading-[1.12] text-ink-900 sm:text-[44px]">
            A forum for serious conversation on water, law and regional security.
          </h2>
        </div>
        <div className="lg:col-span-7">
          <p className="text-[17px] leading-relaxed text-ink-800">{SUMMIT.about}</p>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-800">
            The 2026 edition convenes government, diplomacy, defence, academia, industry and media for two
            days of structured exchange, closing with the New Delhi Declaration and a post-summit white paper
            published to all participants.
          </p>

          <div className="mt-10 border-t border-ink-200">
            {ISSUE_RAILS.map((r) => (
              <div key={r.n} className="grid gap-2 border-b border-ink-200 py-5 sm:grid-cols-[64px_240px_1fr] sm:gap-6">
                <span className="font-display text-[22px] text-silt-500">{r.n}</span>
                <h3 className="text-[16px] font-bold leading-snug text-ink-900">{r.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-ink-500">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 4. Featured speakers (§10) ──────────────────────────────────────── */
function FeaturedSpeakers() {
  const featured = SPEAKERS.slice(0, 4);
  return (
    <section className="bg-white">
      <div className="shell py-24">
        <SectionHeader
          eyebrow="Featured speakers"
          title="Voices shaping the 2026 dialogue"
          action={<Link to="/speakers" className="text-[15px] font-semibold text-brand-600 hover:text-brand-700">View all speakers →</Link>}
        />
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {featured.map((sp) => (
            <Link key={sp.id} to="/speakers" className="group border border-ink-200 bg-white transition hover:border-brand-600" style={{ borderRadius: 6 }}>
              {/* 4:5 portrait slot; dignified monogram until confirmed */}
              <div className="flex aspect-[4/5] items-center justify-center bg-brand-50">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-600/30 font-display text-[22px] text-brand-700">
                  {sp.category[0]}
                </span>
              </div>
              <div className="p-4">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-silt-500">{sp.category}</p>
                <h3 className="mt-1 text-[15px] font-bold leading-snug text-ink-900">{sp.name}</h3>
                <p className="mt-0.5 text-[13px] text-ink-500">{sp.designation}</p>
                <p className="text-[13px] text-ink-500">{sp.organization}</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-[13px] text-ink-500">
          The confirmed line-up is announced in phases before the summit.
        </p>
      </div>
    </section>
  );
}

/* ── 5. Programme highlights — two-day editorial timeline (§11) ──────── */
function ProgrammePreview() {
  const day1 = SESSIONS.filter((s) => s.day === 'day1').slice(0, 5);
  const day2 = SESSIONS.filter((s) => s.day === 'day2').slice(0, 5);
  const Day = ({ label, date, sessions }) => (
    <div>
      <p className="border-b-2 border-navy-900 pb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-ink-900">
        {label} — {date}
      </p>
      {sessions.map((s) => (
        <div key={s.id} className="grid grid-cols-[68px_1fr] gap-4 border-b border-ink-200 py-4">
          <span className="pt-0.5 text-[13px] font-bold tabular-nums text-ink-500">{s.start}</span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-brand-600">{s.type}</p>
            <h3 className="mt-0.5 text-[15.5px] font-semibold leading-snug text-ink-900">{s.title}</h3>
            <p className="mt-0.5 text-[12.5px] text-ink-500">{s.room}</p>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <section className="bg-paper">
      <div className="shell py-24">
        <SectionHeader
          eyebrow="Programme highlights"
          title="Two days, built around the treaty itself"
          action={<Link to="/agenda" className="text-[15px] font-semibold text-brand-600 hover:text-brand-700">Explore full agenda →</Link>}
        />
        <div className="grid gap-12 lg:grid-cols-2">
          <Day label="Day 1" date="19 September" sessions={day1} />
          <Day label="Day 2" date="20 September" sessions={day2} />
        </div>
      </div>
    </section>
  );
}

/* ── 6. Institutions + partners (§12, §14) ───────────────────────────── */
function InstitutionsAndPartners() {
  const tiers = PARTNER_TIERS.filter((t) => t.members.length > 0);
  return (
    <section className="bg-white">
      <div className="shell py-24">
        <SectionHeader eyebrow="Convening power" title="Participating institutions & partners" />
        {tiers.map((t) => (
          <div key={t.tier} className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">{t.tier}</p>
            {/* Official assets pending — organisation names set typographically (§12.2). */}
            <div className="mt-3 flex flex-wrap gap-x-10 gap-y-4">
              {t.members.map((m) => (
                <span key={m} className="flex h-12 items-center font-display text-[20px] font-medium text-ink-700">{m}</span>
              ))}
            </div>
          </div>
        ))}
        <p className="text-[13px] text-ink-500">
          Participating ministries and institutions for the 2026 edition are announced in phases.
        </p>
        <Link to="/partners" className="mt-4 inline-block text-[15px] font-semibold text-brand-600 hover:text-brand-700">
          Partnership opportunities →
        </Link>
      </div>
    </section>
  );
}

/* ── 7. Why attend (§13) ─────────────────────────────────────────────── */
const WHY = [
  { n: '01', title: 'Policy access', text: 'Meet officials, diplomats, researchers and institutional leaders working directly on water governance, treaty law and regional security.' },
  { n: '02', title: 'Working-level dialogue', text: 'Move beyond speeches through moderated panels, roundtables and issue-specific discussions designed for actual exchange.' },
  { n: '03', title: 'Durable outputs', text: 'Follow the programme through the New Delhi Declaration and the post-summit white paper, published to all participants.' },
];

function WhyAttend() {
  return (
    <section className="bg-navy-950 text-white">
      <div className="shell py-24">
        <SectionHeader light eyebrow="Why attend" title="What two days here are worth" />
        <div className="grid gap-10 sm:grid-cols-3">
          {WHY.map((w) => (
            <div key={w.n} className="border-t border-white/15 pt-6">
              <span className="font-display text-[22px] text-silt-500">{w.n}</span>
              <h3 className="mt-2 font-display text-[24px] font-medium text-white">{w.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 8. News & media (§15) ───────────────────────────────────────────── */
function NewsMedia() {
  const [featured, ...rest] = PRESS_ITEMS;
  return (
    <section className="bg-paper">
      <div className="shell py-24">
        <SectionHeader
          eyebrow="News & media"
          title="From the secretariat"
          action={<Link to="/media" className="text-[15px] font-semibold text-brand-600 hover:text-brand-700">Media Centre →</Link>}
        />
        <div className="grid gap-10 lg:grid-cols-2">
          <article className="border border-ink-200 bg-white" style={{ borderRadius: 6 }}>
            <div className="flex aspect-video items-center justify-center bg-navy-975 px-8">
              <p className="text-center font-display text-[22px] font-medium leading-snug text-white/90">
                {featured.title}
              </p>
            </div>
            <div className="p-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink-500">{featured.type} · {featured.date}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-800">{featured.summary}</p>
            </div>
          </article>
          <div className="flex flex-col justify-between gap-4">
            {rest.map((p) => (
              <article key={p.id} className="border-b border-ink-200 pb-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink-500">{p.type} · {p.date}</p>
                <h3 className="mt-1 font-display text-[20px] font-medium leading-snug text-ink-900">{p.title}</h3>
                <p className="mt-1 text-[14px] text-ink-500">{p.summary}</p>
              </article>
            ))}
            <Link to="/register/media" className="text-[14px] font-semibold text-brand-600 hover:text-brand-700">
              Journalist? Apply for media accreditation →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 9. FAQ (§16) ────────────────────────────────────────────────────── */
function FaqSection() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="bg-white">
      <div className="mx-auto max-w-[820px] px-4 py-24 sm:px-8">
        <SectionHeader eyebrow="Questions" title="Before you apply" />
        <div className="divide-y divide-ink-200 border-y border-ink-200">
          {FAQ.map((f, i) => (
            <div key={f.q}>
              <button
                type="button"
                className="flex min-h-[56px] w-full items-center justify-between gap-4 py-4 text-left text-[16px] font-semibold text-ink-900"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {f.q}
                <span className="text-brand-600" aria-hidden="true">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <p className="pb-5 text-[15px] leading-relaxed text-ink-800">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 10. Final CTA (§17) ─────────────────────────────────────────────── */
function FinalCta() {
  return (
    <section className="bg-navy-950 text-white">
      <div className="shell py-20 text-center">
        <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-400">Join the 2026 Dialogue</p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-medium leading-[1.15] sm:text-[40px]">
          Two days of focused discussion on the future of the Indus water framework and regional security.
        </h2>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/register" className="inline-flex h-12 items-center rounded bg-brand-600 px-7 text-[13px] font-bold uppercase tracking-wide transition hover:bg-brand-500">
            Register / Apply
          </Link>
          <Link to="/contact" className="inline-flex h-12 items-center rounded border border-white/30 px-7 text-[13px] font-bold uppercase tracking-wide transition hover:border-white/60">
            Request Invitation
          </Link>
        </div>
        <p className="mt-6 text-[13px] text-white/55">
          Media, speaker or partner? <Link to="/register" className="underline hover:text-white">Choose the relevant participation route.</Link>
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <ProofBand />
      <DialogueContext />
      <FeaturedSpeakers />
      <ProgrammePreview />
      <InstitutionsAndPartners />
      <WhyAttend />
      <NewsMedia />
      <FaqSection />
      <FinalCta />
    </>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-400" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-400" aria-hidden="true">
      <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
