import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { SPEAKER_CATEGORIES, SPEAKERS } from '../content/summit.js';

function SpeakerCard({ sp }) {
  return (
    <article className="card flex flex-col !p-0 text-center">
      {/* 4:5 portrait slot (§9.2); TBA entries show a neutral monogram */}
      <div className="flex aspect-[4/5] items-center justify-center rounded-t-card bg-gradient-to-b from-navy-900 to-navy-950">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#2396D3" strokeWidth="1.2" aria-hidden="true">
          <circle cx="12" cy="8.5" r="3.5" />
          <path d="M4.5 20c1.4-3.6 4.2-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
        </svg>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-ink-900">{sp.name}</h3>
        <p className="mt-0.5 text-xs text-ink-700">{sp.designation}</p>
        <p className="text-xs text-ink-500">{sp.organization} · {sp.country}</p>
        <span className="pill-muted mt-2">{sp.category}</span>
      </div>
    </article>
  );
}

export default function Speakers() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SPEAKERS.filter((sp) =>
      (category === 'All' || sp.category === category)
      && (!q || `${sp.name} ${sp.designation} ${sp.organization}`.toLowerCase().includes(q)),
    );
  }, [category, query]);

  return (
    <>
      <PageHero title="Speakers" lead="Thought leaders. Policy makers. Change makers." />

      <div className="shell py-8 lg:py-12">
        <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="sp-search">Search speakers</label>
          <input
            id="sp-search"
            className="input sm:max-w-sm"
            placeholder="Search by name, role or organisation…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Category chips — horizontally scrollable on narrow screens (§9.1) */}
        <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2 pb-1">
            {SPEAKER_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  category === c
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-ink-200 bg-white text-ink-700 hover:border-brand-600 hover:text-brand-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* The line-up is announced in phases — say so honestly (§35). */}
        <div className="mb-6 rounded-card border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-ink-700">
          The confirmed speaker line-up is announced in phases before the summit. The profiles below show the
          composition of the programme; names appear here as they are confirmed.
        </div>

        {list.length === 0 ? (
          <div className="card text-center">
            <p className="font-semibold text-ink-900">No speakers match “{query}” in {category}.</p>
            <button type="button" className="btn-ghost mt-4" onClick={() => { setQuery(''); setCategory('All'); }}>
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {list.map((sp) => <SpeakerCard key={sp.id} sp={sp} />)}
          </div>
        )}

        <div className="mt-10 rounded-card bg-navy-950 p-6 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold">Speaking at the Dialogue</p>
            <p className="mt-1 text-sm text-white/70">Speakers join by invitation. Nominations can be sent to the secretariat.</p>
          </div>
          <Link to="/contact" className="btn-primary mt-4 sm:mt-0">Contact the secretariat</Link>
        </div>
      </div>
    </>
  );
}
