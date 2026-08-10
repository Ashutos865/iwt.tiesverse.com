import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { ORGANISER, SUMMIT } from '../lib/constants.js';

const CHANNELS = [
  { title: 'General & registration', desc: 'Questions about attending, applications and approvals.', email: SUMMIT.email },
  { title: 'Application support', desc: 'Stuck mid-application, or asked to provide more information? Include your application ID.', email: SUMMIT.supportEmail },
  { title: 'Media', desc: 'Accreditation, interviews and press material.', email: SUMMIT.email },
  { title: 'Partnerships', desc: 'Partnership tiers, visibility inventory and meetings.', email: SUMMIT.email },
];

export default function Contact() {
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
              className="font-semibold text-brand-700 underline"
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

        <div className="mt-6 rounded-card border border-brand-100 bg-brand-50 p-5 text-sm text-ink-700">
          Already applied? Track your application any time from{' '}
          <Link to="/status" className="font-semibold text-brand-700 underline">Check Status</Link>
          {' '}— you only need the email you applied with.
        </div>
      </div>
    </>
  );
}
