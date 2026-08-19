import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SPEAKER_DISCLAIMER } from '../content/summit.js';
import useSiteContent from '../lib/useSiteContent.js';
import { SUMMIT } from '../lib/constants.js';

/**
 * Single-day running order, in the approved split layout: a standing header
 * on the left over the valley drawing, the timeline on the right.
 *
 * The dialogue convenes on one day only, so there are no day tabs and no
 * track/room filters — with thirteen rows, a filter rail hides more than it
 * reveals. Breaks render as quiet rules so the eye lands on the sessions.
 */

const GROUP_TONE = {
  Introduction: 'pill-info',
  'Identity Crisis': 'pill-warn',
  "Decoding Pakistan's Narrative": 'pill-muted',
  'Economics & The Red Line': 'pill-ok',
};

/*
 * One icon per track, drawn inline.
 *
 * Inline SVG rather than an icon package: this is the only page that needs
 * them, and adding a dependency for five glyphs would cost more than the
 * glyphs. Each is stroked in currentColor so it inherits the rail's colour,
 * and marked aria-hidden — the session title beside it already says what the
 * session is, so announcing "scales icon" would only repeat it.
 */
const ICONS = {
  // Lectern — the opening address.
  Introduction: (
    <>
      <path d="M12 3v18" /><path d="M5 8h14" /><path d="M7 21h10" />
      <path d="M9 8l-2 6h10l-2-6" />
    </>
  ),
  // Head in profile — identity and heritage.
  'Identity Crisis': (
    <>
      <path d="M15.5 21v-2.5a3 3 0 0 1 1.2-2.4A8 8 0 1 0 5 9.8" />
      <path d="M5 10v4h2.5v3.5a2 2 0 0 0 2 2H12" />
      <circle cx="11.5" cy="9.5" r="1" />
    </>
  ),
  // Scales — legal breach and accountability.
  "Decoding Pakistan's Narrative": (
    <>
      <path d="M12 4v16" /><path d="M6 20h12" /><path d="M4 8h16" />
      <path d="M7 8l-3 6h6z" /><path d="M17 8l-3 6h6z" />
    </>
  ),
  // Rising bars — economics and the red line.
  'Economics & The Red Line': (
    <>
      <path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20V8" />
      <path d="M2 20h20" />
    </>
  ),
  // Document — the adopted declaration.
  Conclusion: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" /><path d="M9 13h6" /><path d="M9 17h4" />
    </>
  ),
};

function TrackIcon({ group }) {
  const paths = ICONS[group] || ICONS.Conclusion;
  return (
    <span
      aria-hidden="true"
      className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ink-200 bg-white text-brand-600 shadow-sm"
    >
      <svg
        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      >
        {paths}
      </svg>
    </span>
  );
}

function BreakRow({ item }) {
  return (
    <li className="flex items-center gap-4 py-3 sm:gap-5">
      <span className="w-[86px] shrink-0 text-right text-xs font-semibold tabular-nums text-ink-500">
        {item.start}–{item.end}
      </span>
      {/* The rail continues through a break, so the day reads as one thread. */}
      <span className="grid w-12 shrink-0 place-items-center">
        <span className="h-full w-px bg-ink-200" />
      </span>
      <span className="flex-1 border-t border-dashed border-ink-200" aria-hidden="true" />
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
        {item.title}
      </span>
    </li>
  );
}

function SessionRow({ item, open, onToggle }) {
  return (
    <li className="flex gap-4 sm:gap-5">
      {/* pt-4 on both, matching the card's py-4, so the time, the icon and the
          session label all sit on the same optical line. */}
      <div className="w-[86px] shrink-0 pt-4 text-right">
        <p className="text-xs font-bold tabular-nums leading-tight text-ink-900">{item.start}</p>
        <p className="text-xs tabular-nums leading-tight text-ink-500">{item.end}</p>
      </div>

      {/* Icon on the rail. The line runs the full height of the row so the
          markers read as points on one continuous thread. */}
      <div className="relative flex w-12 shrink-0 flex-col items-center">
        <span aria-hidden="true" className="absolute inset-y-0 w-px bg-ink-200" />
        <span className="relative mt-1.5">
          <TrackIcon group={item.group} />
        </span>
      </div>

      <article className="card mb-3 min-w-0 flex-1 !p-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-start gap-4 px-5 py-4 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-brand-600">
                {item.type}
              </span>
              {item.group && (
                <span className={GROUP_TONE[item.group] || 'pill-muted'}>{item.group}</span>
              )}
            </span>

            <span className="mt-2 block font-display text-lg font-semibold leading-snug text-ink-900">
              {item.title}
            </span>

            {item.theme && (
              <span className="mt-1 block text-sm italic text-ink-700">Theme: ‘{item.theme}’</span>
            )}

            {/*
              No preview of the brief in the collapsed state. Several of these
              descriptions run to a full paragraph, and even clamped to two
              lines they made each card tall enough that the day stopped
              reading as a timeline. The whole brief is one click away, and the
              arrow says so.
            */}
          </span>

          {/* The arrow of the approved design, rotating to double as the
              open/closed indicator rather than adding a second control. */}
          <span
            aria-hidden="true"
            className={`mt-0.5 shrink-0 text-brand-600 transition-transform ${open ? 'rotate-90' : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </button>

        {open && (
          <div className="border-t border-ink-100 bg-ink-50 px-5 py-4">
            <p className="text-sm leading-relaxed text-ink-700">{item.description}</p>
          </div>
        )}
      </article>
    </li>
  );
}

export default function Agenda() {
  const { sessions: SESSIONS } = useSiteContent();
  const [openId, setOpenId] = useState(null);
  const [showBreaks, setShowBreaks] = useState(true);

  const rows = showBreaks ? SESSIONS : SESSIONS.filter((s) => s.kind === 'session');
  const sessionCount = SESSIONS.filter((s) => s.kind === 'session').length;

  return (
    <div className="agenda-split">
      <div className="shell grid gap-8 py-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 lg:py-10">
        {/*
          Standing header. Sticky on wide screens so the day's title and
          particulars stay with the timeline as it scrolls — on a narrow screen
          it simply sits above, because a stuck panel would eat the viewport.
        */}
        <header className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600">
            Agenda
          </p>
          <h1 className="mt-3 font-title text-4xl font-normal uppercase leading-[1.08] tracking-tight text-ink-900 sm:text-5xl">
            Shaping the waters.<br />Securing the future.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-700">
            A day of high-level dialogue and expert sessions on the Indus Waters
            Treaty — exploring law, security, history, narrative and the road ahead.
          </p>

          <span aria-hidden="true" className="mt-5 block h-0.5 w-16 bg-brand-600" />

          <dl className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink-200 bg-white text-brand-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" />
                </svg>
              </span>
              <div>
                <dt className="sr-only">Date</dt>
                <dd className="font-display text-sm font-bold uppercase tracking-wide text-ink-900">
                  {SUMMIT.date}
                </dd>
                <dd className="text-xs uppercase tracking-wide text-ink-500">Saturday</dd>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink-200 bg-white text-brand-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <div>
                <dt className="sr-only">Venue</dt>
                <dd className="font-display text-sm font-bold uppercase tracking-wide text-ink-900">
                  Bharat Mandapam
                </dd>
                <dd className="text-xs uppercase tracking-wide text-ink-500">New Delhi</dd>
              </div>
            </div>
          </dl>

          <p className="mt-6 text-xs text-ink-500">
            09:00–18:00 · {sessionCount} sessions
          </p>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 text-xs font-semibold text-ink-700">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand-600"
              checked={showBreaks}
              onChange={(e) => setShowBreaks(e.target.checked)}
            />
            Show breaks
          </label>
        </header>

        {/* ── The running order ── */}
        <div className="min-w-0">
          <ul>
            {rows.map((item) =>
              item.kind === 'break' ? (
                <BreakRow key={item.id} item={item} />
              ) : (
                <SessionRow
                  key={item.id}
                  item={item}
                  open={openId === item.id}
                  onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                />
              ),
            )}
          </ul>

          {/* The concept note is explicit that named speakers are proposed, not confirmed. */}
          <p className="mt-6 text-xs leading-relaxed text-ink-500">
            {SPEAKER_DISCLAIMER}
          </p>

          <div className="mt-8 rounded-card bg-tile-deep p-6 text-white sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg font-semibold">Attend the dialogue</p>
              <p className="mt-1 text-sm text-white/70">
                Applications are reviewed by the secretariat before attendance is confirmed.
              </p>
            </div>
            <Link
              to="/register"
              className="btn mt-4 min-h-[44px] shrink-0 bg-white text-ink-900 hover:bg-brand-50 sm:mt-0"
            >
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
