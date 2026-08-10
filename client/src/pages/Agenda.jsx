import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { DAYS, SESSION_TYPES, TRACKS } from '../content/summit.js';
import useSiteContent from '../lib/useSiteContent.js';

const TYPE_TONE = {
  Plenary: 'pill-info',
  Keynote: 'pill-info',
  Panel: 'pill-muted',
  'Special Address': 'pill-warn',
  Roundtable: 'pill-muted',
  'Fireside Chat': 'pill-muted',
};

function SessionRow({ s, open, onToggle }) {
  return (
    <article className="card !p-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full flex-col gap-2 p-5 text-left sm:flex-row sm:items-start sm:gap-6"
      >
        <div className="w-28 shrink-0 text-sm font-bold tabular-nums text-ink-900">
          {s.start}–{s.end}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={TYPE_TONE[s.type] || 'pill-muted'}>{s.type}</span>
            <span className="text-xs text-ink-500">{s.track}</span>
          </div>
          <h3 className="mt-1.5 font-display text-lg font-semibold text-ink-900">{s.title}</h3>
          <p className="mt-1 text-sm text-ink-700">{s.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-ink-500 sm:flex-col sm:items-end">
          <span className="inline-flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
            {s.room}
          </span>
          <span className="text-brand-600">{open ? 'Hide details' : 'Details'}</span>
        </div>
      </button>
      {open && (
        <div className="border-t border-ink-100 bg-ink-50 px-5 py-4 text-sm text-ink-700 sm:pl-[8.5rem]">
          <p>{s.description}</p>
          <p className="mt-2 text-xs text-ink-500">
            Track: {s.track} · Venue: {s.room}. Session details and speakers are confirmed closer to the event.
          </p>
          <Link to="/register" className="btn-text mt-1">Register to attend →</Link>
        </div>
      )}
    </article>
  );
}

export default function Agenda() {
  const { sessions: SESSIONS } = useSiteContent();
  const [day, setDay] = useState(DAYS[0].key);
  const [track, setTrack] = useState('');
  const [type, setType] = useState('');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile sheet

  const sessions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SESSIONS.filter((s) =>
      s.day === day
      && (!track || s.track === track)
      && (!type || s.type === type)
      && (!q || s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)),
    );
  }, [day, track, type, query, SESSIONS]);

  const activeFilters = [track && { k: 'track', v: track }, type && { k: 'type', v: type }].filter(Boolean);

  const filterControls = (
    <div className="grid gap-4">
      <div>
        <label className="label" htmlFor="ag-search">Search sessions</label>
        <input id="ag-search" className="input" placeholder="Title or theme…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div>
        <label className="label" htmlFor="ag-track">Track</label>
        <select id="ag-track" className="input" value={track} onChange={(e) => setTrack(e.target.value)}>
          <option value="">All tracks</option>
          {TRACKS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="ag-type">Session type</label>
        <select id="ag-type" className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {SESSION_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <>
      <PageHero title="Agenda" lead="Two days of plenaries, panels and closed roundtables on the future of the Indus basin." />

      {/* Day tabs — sticky under the header (§8.2) */}
      <div className="sticky top-16 z-20 border-b border-ink-200 bg-white lg:top-[72px]">
        <div className="shell flex items-center justify-between gap-3">
          <div role="tablist" aria-label="Summit days" className="flex">
            {DAYS.map((d) => (
              <button
                key={d.key}
                role="tab"
                aria-selected={day === d.key}
                onClick={() => setDay(d.key)}
                className={`border-b-[3px] px-4 py-3.5 text-left transition sm:px-6 ${
                  day === d.key ? 'border-brand-600 text-ink-900' : 'border-transparent text-ink-500 hover:text-ink-900'
                }`}
              >
                <span className="block text-sm font-bold">{d.label}</span>
                <span className="block text-[11px]">{d.date}</span>
              </button>
            ))}
          </div>
          {/* Mobile filter trigger (§8.3) */}
          <button type="button" className="btn-ghost !min-h-[40px] !px-4 !text-xs lg:hidden" onClick={() => setFiltersOpen(true)}>
            Filters{activeFilters.length ? ` (${activeFilters.length})` : ''}
          </button>
        </div>
      </div>

      <div className="shell grid gap-8 py-8 lg:grid-cols-[240px_1fr] lg:py-12">
        {/* Desktop filter rail */}
        <aside className="hidden lg:block">
          <h2 className="eyebrow mb-4">Filter sessions</h2>
          {filterControls}
        </aside>

        <div>
          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {activeFilters.map((f) => (
                <button
                  key={f.k}
                  type="button"
                  className="pill-info"
                  onClick={() => (f.k === 'track' ? setTrack('') : setType(''))}
                >
                  {f.v} ✕
                </button>
              ))}
              <button type="button" className="text-xs font-semibold text-ink-500 underline" onClick={() => { setTrack(''); setType(''); setQuery(''); }}>
                Clear all
              </button>
            </div>
          )}

          {sessions.length === 0 ? (
            <div className="card text-center">
              <p className="font-semibold text-ink-900">No sessions match the current filters.</p>
              <p className="mt-1 text-sm text-ink-700">Try clearing a filter, or switch day.</p>
              <button type="button" className="btn-ghost mt-4" onClick={() => { setTrack(''); setType(''); setQuery(''); }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              {sessions.map((s) => (
                <SessionRow key={s.id} s={s} open={openId === s.id} onToggle={() => setOpenId(openId === s.id ? null : s.id)} />
              ))}
            </div>
          )}

          <div className="mt-8 rounded-card bg-navy-950 p-6 text-white sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg font-semibold">Don't miss out</p>
              <p className="mt-1 text-sm text-white/70">Be part of this critical dialogue shaping the future of water security in South Asia.</p>
            </div>
            <Link to="/register" className="btn-primary mt-4 sm:mt-0">Register now</Link>
          </div>
        </div>
      </div>

      {/* Mobile filter bottom sheet (§8.3) */}
      {filtersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Filter sessions">
          <button type="button" className="absolute inset-0 bg-ink-950/50" aria-label="Close filters" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink-900">Filters</h2>
              <button type="button" className="btn-text" onClick={() => setFiltersOpen(false)}>Done</button>
            </div>
            {filterControls}
            <button type="button" className="btn-primary mt-6 w-full" onClick={() => setFiltersOpen(false)}>
              Show {sessions.length} session{sessions.length === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
