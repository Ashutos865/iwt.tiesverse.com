import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { FAQ } from '../content/summit.js';
import { ORGANISER, SUMMIT } from '../lib/constants.js';

const CHANNELS = [
  { title: 'General & registration', desc: 'Questions about attending, applications and approvals.', email: SUMMIT.email },
  { title: 'Application support', desc: 'Stuck mid-application, or asked to provide more information? Include your application ID.', email: SUMMIT.supportEmail },
  { title: 'Media', desc: 'Accreditation, interviews and press material.', email: SUMMIT.email },
  { title: 'Partnerships', desc: 'Partnership tiers, visibility inventory and meetings.', email: SUMMIT.email },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <PageHero title="Contact" lead="The secretariat answers within two working days." />

      <div className="shell max-w-3xl py-10 lg:py-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {CHANNELS.map((c) => (
            <div key={c.title} className="card">
              <h2 className="font-display text-lg font-semibold text-ink-900">{c.title}</h2>
              <p className="mt-1.5 text-sm text-ink-700">{c.desc}</p>
              <a className="btn-text" href={`mailto:${c.email}`}>{c.email}</a>
            </div>
          ))}
        </div>

        <div className="card mt-6">
          <h2 className="eyebrow">Secretariat</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            Indus Waters Treaty Dialogue Secretariat<br />
            New Delhi, India
            {SUMMIT.phone && <><br />{SUMMIT.phone}</>}
          </p>
          <p className="mt-3 text-sm text-ink-700">
            Organised by{' '}
            <a
              href={ORGANISER.website}
              target="_blank"
              rel="noreferrer noopener"
              className="font-semibold text-teal-700 underline"
            >
              {ORGANISER.name}
            </a>{' '}
            ({ORGANISER.abbr}).
          </p>
        </div>

        <div className="card mt-6">
          <h2 className="eyebrow">Event</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            {SUMMIT.name}<br />
            {SUMMIT.date} · {SUMMIT.venue}
          </p>
        </div>

        <div className="mt-6 rounded-card border border-teal-100 bg-teal-50 p-5 text-sm text-ink-700">
          Already applied? Track your application any time from{' '}
          <Link to="/status" className="font-semibold text-teal-700 underline">Check Status</Link>
          {' '}You only need the email you applied with.
        </div>

        {/* Moved here from the home page. A contact page's job is answering
            questions, so the FAQ sits above the inbox rather than on a portal
            page people pass straight through. */}
        <section id="faq" className="mt-12">
          <p className="eyebrow">Questions</p>
          <h2 className="section-title mt-1.5">Before you write to us</h2>
          <div className="mt-5 divide-y divide-ink-200 overflow-hidden rounded-card border border-ink-200 bg-white">
            {FAQ.map((f, i) => (
              <div key={f.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-ink-900 hover:bg-teal-50"
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {f.q}
                  <span className="text-lg text-teal-700">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-ink-700">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
