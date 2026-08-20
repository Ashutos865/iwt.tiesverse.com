import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { BACKGROUND, DELIVERABLES, SESSION_GROUPS, THEMES, VENUE_NOTE } from '../content/summit.js';
import { KEY_FACTS, ORGANISER, SUMMIT } from '../lib/constants.js';

export default function About() {
  return (
    <>
      <PageHero title="About the Dialogue" lead={`“${SUMMIT.theme}”`} />

      <div className="shell max-w-3xl py-10 lg:py-14">
        {/* Background note — the reason the dialogue exists. */}
        <section>
          <h2 className="eyebrow">Background note</h2>
          <div className="mt-3 space-y-4">
            {BACKGROUND.map((para, i) => (
              <p
                key={para.slice(0, 40)}
                className={i === 0
                  ? 'text-[17px] leading-relaxed text-ink-800'
                  : 'text-sm leading-relaxed text-ink-700'}
              >
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* Key facts */}
        <section className="mt-10">
          <h2 className="eyebrow">At a glance</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {KEY_FACTS.map((f) => (
              <div key={f.label} className="card !p-4 text-center">
                <p className="font-display text-2xl font-semibold text-teal-700">{f.value}</p>
                <p className="text-xs uppercase tracking-wide text-ink-500">{f.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Themes — the six, in full, as the concept note sets them out. */}
        <section id="themes" className="mt-12">
          <h2 className="eyebrow">Themes & objectives</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            The dialogue is organised around six interlocking themes, each combining its
            underlying objective with its substantive content, and delivered across four
            sessions: {SESSION_GROUPS.join(', ')}.
          </p>
          <div className="mt-5 space-y-4">
            {THEMES.map((t) => (
              <article key={t.n} className="card">
                <div className="flex gap-4">
                  <span className="font-display text-2xl font-semibold text-teal-600">{t.n}</span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold leading-snug text-ink-900">
                      {t.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{t.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <Link to="/agenda" className="btn-text mt-4">See how they map to the day →</Link>
        </section>

        {/* Venue and date — why 19 September, and why Bharat Mandapam. */}
        <section id="venue" className="mt-12">
          <h2 className="eyebrow">Venue and date</h2>
          <p className="mt-3 font-display text-2xl leading-snug text-ink-900">
            {SUMMIT.date} · {SUMMIT.venue}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">{VENUE_NOTE}</p>
        </section>

        {/* Deliverables */}
        <section id="deliverables" className="mt-12">
          <h2 className="eyebrow">Deliverables and outcomes</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            The dialogue is designed not only as a set of panels but as an evidence-generating
            instrument: every claim advanced is tied to a verifiable, citable source, so that
            the record built here demonstrates facts, not assertion. Six coordinated tracks turn
            the proceedings into a durable, proof-backed record for legal, diplomatic, media and
            public audiences.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {DELIVERABLES.map((d) => (
              <div key={d.n} className="card">
                <p className="font-display text-sm font-semibold text-teal-600">{d.n}</p>
                <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink-900">
                  {d.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{d.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Organiser */}
        <section id="organiser" className="mt-12">
          <h2 className="eyebrow">About the organisation</h2>
          <p className="mt-3 font-display text-2xl leading-snug text-ink-900">
            {ORGANISER.name} ({ORGANISER.abbr})
          </p>
          {/* Five paragraphs at 13px rather than 14: the profile runs long,
              and a full-measure block of body copy is easier to read set a
              step down with generous leading than at reading size. */}
          <div className="mt-3 max-w-3xl space-y-3">
            {ORGANISER.profile.map((para) => (
              <p key={para.slice(0, 40)} className="text-[13px] leading-relaxed text-ink-700">
                {para}
              </p>
            ))}
          </div>
          <a
            href={ORGANISER.website}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-text mt-2"
          >
            {ORGANISER.websiteLabel} →
          </a>
        </section>

        <section id="code-of-conduct" className="mt-12">
          <h2 className="eyebrow">Code of conduct</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            The Dialogue is a professional policy forum. Participants are expected to engage
            respectfully across national, institutional and disciplinary lines; harassment or
            intimidation of any participant leads to removal from the venue. Sessions marked as
            closed-door follow the Chatham House Rule: what was said may be used, who said it may
            not.
          </p>
        </section>

        <section className="mt-12 rounded-card bg-tile-deep p-6 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold">Join the Dialogue</p>
            <p className="mt-1 text-sm text-white/70">Applications are reviewed before attendance is confirmed.</p>
          </div>
          <Link to="/register" className="btn-primary mt-4 shrink-0 sm:mt-0">Apply to attend</Link>
        </section>
      </div>
    </>
  );
}
