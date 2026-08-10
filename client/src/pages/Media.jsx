import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { PRESS_ITEMS } from '../content/summit.js';
import { SUMMIT } from '../lib/constants.js';

const TABS = ['Press Releases', 'Media Advisories', 'Media Kit'];

/** Accreditation + contacts. On mobile this renders ABOVE the list (§12.3). */
function ActionRail() {
  return (
    <div className="grid gap-4">
      <div className="card">
        <h2 className="eyebrow">Media accreditation</h2>
        <p className="mt-2 text-sm text-ink-700">
          Journalists and media professionals can apply for accreditation with a valid press card or an
          assignment letter. Accreditation is reviewed separately from delegate registration.
        </p>
        <Link to="/register/media" className="btn-primary mt-4 w-full">Apply now</Link>
      </div>
      <div className="card">
        <h2 className="eyebrow">Media contact</h2>
        <p className="mt-2 text-sm text-ink-700">Secretariat press desk</p>
        <a className="btn-text" href={`mailto:${SUMMIT.email}`}>{SUMMIT.email}</a>
        <p className="text-sm text-ink-700">{SUMMIT.phone}</p>
      </div>
      <div className="card">
        <h2 className="eyebrow">Media kit</h2>
        <p className="mt-2 text-sm text-ink-700">
          Official logos, summit boilerplate and approved photography, released with the programme.
        </p>
        <a className="btn-ghost mt-4 w-full" href={`mailto:${SUMMIT.email}?subject=Media%20kit%20request`}>
          Request the media kit
        </a>
      </div>
    </div>
  );
}

export default function Media() {
  const [tab, setTab] = useState(TABS[0]);
  const items = PRESS_ITEMS.filter((p) =>
    tab === 'Press Releases' ? p.type === 'Press Release'
      : tab === 'Media Advisories' ? p.type === 'Media Advisory'
        : false,
  );

  return (
    <>
      <PageHero title="Media Centre" lead="News, resources and accreditation." />

      <div className="border-b border-ink-200 bg-white">
        <div className="shell -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-8">
          <div role="tablist" aria-label="Media sections" className="flex w-max">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`whitespace-nowrap border-b-[3px] px-5 py-3.5 text-sm font-semibold transition ${
                  tab === t ? 'border-brand-600 text-ink-900' : 'border-transparent text-ink-500 hover:text-ink-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="shell grid gap-8 py-8 lg:grid-cols-[1fr_300px] lg:py-12">
        {/* Mobile: accreditation card first, never buried under articles */}
        <div className="lg:hidden"><ActionRail /></div>

        <div>
          {tab === 'Media Kit' ? (
            <div className="card">
              <h2 className="font-display text-xl font-semibold text-ink-900">Media kit</h2>
              <p className="mt-2 text-sm text-ink-700">
                The media kit contains the summit boilerplate, official logos in approved variants, brand
                usage notes, venue information and high-resolution approved photography. It is issued to
                accredited media when the programme is published.
              </p>
              <a className="btn-primary mt-5" href={`mailto:${SUMMIT.email}?subject=Media%20kit%20request`}>
                Request the media kit
              </a>
            </div>
          ) : items.length === 0 ? (
            <div className="card text-center">
              <p className="font-semibold text-ink-900">Nothing published under {tab} yet.</p>
              <p className="mt-1 text-sm text-ink-700">Releases appear here as they are issued.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {items.map((p) => (
                <article key={p.id} className="card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                    {p.date} · {p.type}
                  </p>
                  <h2 className="mt-1.5 font-display text-lg font-semibold text-ink-900">{p.title}</h2>
                  <p className="mt-1 text-sm text-ink-700">{p.summary}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Desktop right rail */}
        <div className="hidden lg:block"><ActionRail /></div>
      </div>
    </>
  );
}
