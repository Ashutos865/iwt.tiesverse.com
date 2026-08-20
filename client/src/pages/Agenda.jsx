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
 * The running order, as a table.
 *
 * Two columns are visible — when, and what — and nothing else. Every session
 * here carries a full paragraph of brief, and showing those inline turned the
 * day into a wall of text you had to scroll past to see the shape of it. The
 * brief opens on click, in a row beneath the one you pressed, so the schedule
 * stays scannable and the detail is one press away.
 *
 * A real <table> rather than a grid of divs: this is tabular data, and the
 * markup is what lets a screen reader announce "Time, 09:30 to 10:45" against
 * each session instead of reading two loose columns of text.
 */
function BreakRow({ item }) {
  return (
    <tr className="border-t border-ink-100 bg-ink-50/60">
      <td className="whitespace-nowrap px-4 py-2.5 text-xs font-semibold tabular-nums text-ink-500 sm:px-5">
        {item.start}–{item.end}
      </td>
      <td className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-500 sm:px-5">
        {item.title}
      </td>
    </tr>
  );
}

function SessionRow({ item, open, onToggle }) {
  const panelId = `agenda-panel-${item.id}`;
  return (
    <>
      <tr className="border-t border-ink-100">
        <td className="whitespace-nowrap px-4 py-3 align-top text-xs font-bold tabular-nums text-ink-900 sm:px-5 sm:py-4">
          {item.start}–{item.end}
        </td>
        <td className="px-4 py-3 sm:px-5 sm:py-4">
          {/*
             The whole cell is the control, so the target is the row rather
             than a small chevron — easier to hit, and it means the row reads
             as one thing you can press.
          */}
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
            className="flex w-full items-start gap-3 text-left"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-display text-sm font-semibold leading-snug text-ink-900 sm:text-base">
                {item.title}
              </span>
              {item.theme && (
                <span className="mt-0.5 block text-xs italic text-ink-500">
                  Theme: ‘{item.theme}’
                </span>
              )}
            </span>
            <span
              aria-hidden="true"
              className={`mt-0.5 shrink-0 text-teal-700 transition-transform ${open ? 'rotate-90' : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </button>
        </td>
      </tr>

      {open && (
        <tr id={panelId} className="bg-ink-50">
          {/* Spans both columns so the brief uses the table's full width
              rather than being squeezed into the session column. */}
          <td colSpan={2} className="px-4 pb-4 pt-1 sm:px-5">
            <p className="text-sm leading-relaxed text-ink-700">{item.description}</p>
            {(item.type || item.group) && (
              <p className="mt-2 flex flex-wrap items-center gap-2">
                {item.type && (
                  <span className="text-[11px] font-bold uppercase tracking-wide text-teal-700">
                    {item.type}
                  </span>
                )}
                {item.group && (
                  <span className={GROUP_TONE[item.group] || 'pill-muted'}>{item.group}</span>
                )}
              </p>
            )}
          </td>
        </tr>
      )}
    </>
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
      {/*
        The title spans the page rather than sitting in the left column. It is
        43 characters and must hold on one line at every width; inside the
        457px sidebar that meant setting it at 22px, which is smaller than the
        body text beside it. Across the full measure the same line sets at
        about 40px and still reads as the page's title.
      */}
      <div className="shell pt-8 lg:pt-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-700">
          Agenda
        </p>
        <h1 className="agenda-title mt-3 font-title font-normal uppercase leading-[1.06] tracking-tight text-ink-900">
          Indus Waters Treaty by Tiesverse Foundation
        </h1>
        <span aria-hidden="true" className="mt-5 block h-0.5 w-16 bg-teal-700" />
      </div>

      <div className="shell grid gap-8 py-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 lg:py-10">
        {/*
          Standing header. Sticky on wide screens so the particulars stay with
          the table as it scrolls — on a narrow screen it simply sits above,
          because a stuck panel would eat the viewport.
        */}
        <header className="lg:sticky lg:top-24 lg:self-start">

          <dl className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink-200 bg-white text-teal-700">
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
              <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink-200 bg-white text-teal-700">
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
              className="h-4 w-4 accent-teal-700"
              checked={showBreaks}
              onChange={(e) => setShowBreaks(e.target.checked)}
            />
            Show breaks
          </label>
        </header>

        {/* ── The running order ── */}
        <div className="min-w-0">
          {/* Rounded frame with the border on the wrapper, not the table, so
              the corners stay round however many rows are inside. */}
          <div className="overflow-hidden rounded-card border border-ink-200 bg-white">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Running order for {SUMMIT.date}. Select a session to read its brief.
              </caption>
              <thead>
                <tr className="bg-ink-50">
                  <th scope="col" className="w-[128px] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.09em] text-ink-700 sm:px-5">
                    Time
                  </th>
                  <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.09em] text-ink-700 sm:px-5">
                    Session
                  </th>
                </tr>
              </thead>
              <tbody>
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
              </tbody>
            </table>
          </div>

          {/* The concept note is explicit that named speakers are proposed, not confirmed. */}
          <p className="mt-6 text-xs leading-relaxed text-ink-500">
            {SPEAKER_DISCLAIMER}
          </p>

          {/* Centred: the block is the page's closing invitation, so it reads
              as an address to the reader rather than a row of settings. */}
          <div className="mt-8 rounded-card bg-tile-deep px-6 py-7 text-center text-white">
            <p className="font-display text-lg font-semibold">Attend the dialogue</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-white/70">
              Applications are reviewed by the secretariat before attendance is confirmed.
            </p>
            <Link
              to="/register"
              className="btn mt-5 min-h-[44px] bg-white text-ink-900 hover:bg-teal-50"
            >
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
