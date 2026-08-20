import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SPEAKER_DISCLAIMER } from '../content/summit.js';
import useSiteContent from '../lib/useSiteContent.js';
import { SUMMIT } from '../lib/constants.js';

/**
 * Single-day running order: title and particulars centred, the schedule as a
 * table beneath them.
 *
 * The dialogue convenes on one day only, so there are no day tabs and no
 * track/room filters — with thirteen rows, a filter rail hides more than it
 * reveals. Breaks render as quiet rows so the eye lands on the sessions.
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

/*
 * Share and download.
 *
 * Share uses the Web Share API where the browser has it — on a phone that opens
 * the real system sheet, so WhatsApp is one tap away and the preview card comes
 * from the site's own og:image rather than whatever the app scrapes. Desktop
 * browsers largely do not implement it, so there the link is copied to the
 * clipboard instead and the button says so.
 *
 * Download is a plain link to the PDF endpoint rather than a fetch: the browser
 * handles the file, the server counts the hit, and nothing has to be held in
 * memory on a phone.
 */
function AgendaActions() {
  const [note, setNote] = useState('');

  const shareData = {
    title: 'Indus Waters Treaty Dialogue',
    text: 'Indus Waters Treaty Dialogue — 19 September 2026, Bharat Mandapam, New Delhi.',
    url: typeof window === 'undefined' ? '' : window.location.origin + '/agenda',
  };

  async function share() {
    setNote('');
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(shareData.url);
      setNote('Link copied.');
    } catch (err) {
      // A cancelled share sheet rejects too; that is not a failure worth
      // reporting back to the reader.
      if (err && err.name === 'AbortError') return;
      setNote('Could not share — copy the address from your browser instead.');
    }
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={share} className="btn-ghost !min-h-[40px] !px-4 !text-xs">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
          </svg>
          Share
        </button>

        <a
          // nginx maps this to the generating endpoint; the document-shaped
          // URL is what people copy and see in their downloads.
          href="/agenda.pdf"
          className="btn-primary !min-h-[40px] !px-4 !text-xs"
          // `download` asks the browser to save rather than navigate; the
          // server sends the filename in Content-Disposition either way.
          download
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" />
          </svg>
          Download agenda
        </a>
      </div>

      {note && (
        <p role="status" className="mt-2 text-xs font-semibold text-teal-700">{note}</p>
      )}
    </>
  );
}

export default function Agenda() {
  const { sessions: SESSIONS } = useSiteContent();
  const [openId, setOpenId] = useState(null);

  // Breaks always show: they are part of the day's shape, and hiding them made
  // the running order misstate how long the sessions actually run.
  const rows = SESSIONS;
  const sessionCount = SESSIONS.filter((s) => s.kind === 'session').length;

  return (
    <div className="agenda-split">
      {/*
        One centred column rather than the previous two-column split.

        The table is the page — the particulars above it are a caption, not a
        sibling panel — so date and venue run as one horizontal line under the
        title and the schedule sits centred beneath them at a readable measure.
        The "show breaks" toggle is gone with the split: the breaks are part of
        the day's shape, and hiding them made the running order lie about how
        long the sessions actually run.
      */}
      <div className="shell max-w-4xl py-8 text-center lg:py-12">
        {/*
          The event's name is the heading; the organiser is a credit beneath it.
          Running them as one 43-character line forced the type down to 13px on
          a phone — smaller than the body copy under it. Split, the name is 28
          characters and holds one line at a size that still reads as a title,
          and "Tiesverse Foundation" keeps its place without competing.
        */}
        <div className="agenda-title-wrap">
        <h1 className="agenda-title font-title font-normal uppercase leading-[1.06] tracking-tight text-ink-900">
          Indus Waters Treaty Dialogue
        </h1>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-500 sm:text-xs">
          by Tiesverse Foundation
        </p>
          </div>

        {/* One horizontal row at every width. The icons shrink and the gap
            tightens on a phone rather than the pair stacking, so the two
            particulars stay readable as a single line of fact. */}
        <dl className="mt-6 flex items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink-200 bg-white text-teal-700 sm:h-10 sm:w-10">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" />
              </svg>
            </span>
            <div className="text-left">
              <dt className="sr-only">Date</dt>
              <dd className="font-display text-xs font-bold uppercase tracking-wide text-ink-900 sm:text-sm">
                {SUMMIT.date}
              </dd>
              <dd className="text-[10px] uppercase tracking-wide text-ink-500 sm:text-xs">Saturday</dd>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink-200 bg-white text-teal-700 sm:h-10 sm:w-10">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <div className="text-left">
              <dt className="sr-only">Venue</dt>
              <dd className="font-display text-xs font-bold uppercase tracking-wide text-ink-900 sm:text-sm">
                Bharat Mandapam
              </dd>
              <dd className="text-[10px] uppercase tracking-wide text-ink-500 sm:text-xs">New Delhi</dd>
            </div>
          </div>
        </dl>

        {/* The eyebrow moves here, from above the title to just above the
            table, so it labels the thing it actually introduces. */}
        <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.2em] text-teal-700">
          Agenda
        </p>
        <p className="mt-1.5 text-xs text-ink-500">
          09:00–18:00 · {sessionCount} sessions
        </p>
        <span aria-hidden="true" className="mx-auto mt-4 block h-0.5 w-16 bg-teal-700" />

        <AgendaActions />

        {/* ── The running order ── */}
        <div className="mt-6 text-left">
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
