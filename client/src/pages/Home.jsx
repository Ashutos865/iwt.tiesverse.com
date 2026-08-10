import { useState } from 'react';
import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown.jsx';
import MandalaDivider from '../components/MandalaDivider.jsx';
import { ORGANISER, SUMMIT } from '../lib/constants.js';
import { BACKGROUND, FAQ } from '../content/summit.js';

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
/*
 * Colours are the supplied brand palette, and `text` is not decorative — it is
 * derived from each ground's contrast. White on Keppel is 2.95:1 and on
 * Gainsboro 1.37:1, so those tiles must take ink instead; see the table in
 * tailwind.config.js.
 *
 * The two wide tiles share Blue-Green deliberately: five colours across six
 * tiles means one repeat, and bookending the grid with the darkest reads as
 * intent rather than as running short.
 */
const TILES = [
  { to: '/about', title: 'About the Dialogue', sub: 'Background, six themes and the case for abeyance', bg: 'bg-tile-bluegreen', text: 'text-white', span: 'sm:col-span-2' },
  { to: '/agenda', title: 'Agenda', sub: 'The full running order, 09:00–18:00', bg: 'bg-tile-turquoise', text: 'text-white' },
  { to: '/speakers', title: 'Speakers', sub: 'Jurists, engineers, security scholars, diplomats', bg: 'bg-tile-keppel', text: 'text-ink-900' },
  { to: '/partners', title: 'Partners', sub: 'Partnership programme and tiers', bg: 'bg-tile-cadet', text: 'text-ink-900' },
  { to: '/media', title: 'Media Centre', sub: 'Accreditation, releases and the media kit', bg: 'bg-tile-gainsboro', text: 'text-ink-900' },
  { to: '/register', title: 'Register', sub: 'Seven participation tracks', bg: 'bg-tile-bluegreen', text: 'text-white', span: 'sm:col-span-2' },
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

  return (
    <>
      {/*
        The visible hero was removed at the client's request. The page still
        needs exactly one H1 naming what it is — without it the home page has
        no accessible or indexable title at all, since the only other instance
        is the logo's alt text. Screen readers and search engines read this;
        nobody sees it.
      */}
      <h1 className="sr-only">{SUMMIT.name}</h1>

      <section className="shell flex justify-center pb-10 pt-2">
        <Countdown className="w-full max-w-2xl" />
      </section>

      {/* Portal tiles */}
      <section className="shell pb-14">
        <div className="grid gap-4 sm:grid-cols-4">
          {TILES.map((t) => (
            <Link key={t.to} to={t.to} className={`tile ${t.bg} ${t.text} ${t.span || ''}`}>
              <span className="tile-title">{t.title}</span>
              <span className="tile-sub">{t.sub}</span>
            </Link>
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
        <div className="rounded-card bg-tile-bluegreen p-8 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Registration is open</h2>
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
