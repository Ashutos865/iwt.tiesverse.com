import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SPEAKER_DISCLAIMER } from '../content/summit.js';
import useSiteContent from '../lib/useSiteContent.js';
import { SUMMIT } from '../lib/constants.js';

/**
 * Speakers, in the approved split layout: the standing event header on the
 * left over the valley drawing, the filterable grid on the right.
 *
 * Everyone shown here has confirmed. The concept note is explicit that the
 * people named in it are *proposed invitees* — "their inclusion reflects
 * suitability, not confirmed participation" — so the content API withholds
 * any speaker whose `published` flag is off, and the secretariat turns that on
 * at the moment a confirmation arrives. A speaker can be fully prepared in the
 * admin (photo, bio, ordering) without appearing here.
 */

/*
 * The four expertise areas. Order matters: these render as the filter tabs
 * left to right, and the same strings are the options in the admin's category
 * dropdown, so a tag and its tab can never drift apart.
 */
const AREAS = [
  'Law & International Legal Experts',
  'Water & Environment Experts',
  'Security & Strategic Affairs',
  'Economics & Policy Experts',
];

/* Shorter labels for the tag under each name — the full area names are too
   long to sit on a card without wrapping to three lines. */
const AREA_SHORT = {
  'Law & International Legal Experts': 'International Law',
  'Water & Environment Experts': 'Water & Environment',
  'Security & Strategic Affairs': 'Security & Strategic Affairs',
  'Economics & Policy Experts': 'Economics & Policy',
};

/*
 * One badge per area, drawn inline rather than pulled from an icon package:
 * four glyphs do not justify a dependency, and stroking them in currentColor
 * lets each inherit the badge's colour. aria-hidden throughout — the tag
 * beneath the name already says which area this is.
 */
const AREA_ICON = {
  'Law & International Legal Experts': (
    <><path d="M12 4v16" /><path d="M6 20h12" /><path d="M4 8h16" />
      <path d="M7 8l-3 6h6z" /><path d="M17 8l-3 6h6z" /></>
  ),
  'Water & Environment Experts': (
    <><path d="M12 3s6 6.4 6 10a6 6 0 0 1-12 0c0-3.6 6-10 6-10Z" /></>
  ),
  'Security & Strategic Affairs': (
    <><path d="M12 3 5 6v5.5c0 4.3 2.9 8.3 7 9.5 4.1-1.2 7-5.2 7-9.5V6l-7-3Z" /></>
  ),
  'Economics & Policy Experts': (
    <><path d="M4 20V11" /><path d="M10 20V5" /><path d="M16 20v-8" /><path d="M2 20h20" /></>
  ),
};

function AreaBadge({ area }) {
  const paths = AREA_ICON[area];
  if (!paths) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full border border-ink-200 bg-white text-teal-700"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {paths}
      </svg>
    </span>
  );
}

/** Initials, for a speaker with no portrait yet. */
function initials(name = '') {
  return name
    .replace(/\((Retd\.?|Dr\.?|Prof\.?)\)/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !/^(dr|prof|mr|ms|mrs|lt|gen|amb|justice|adm)\.?$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

function SpeakerCard({ sp }) {
  const area = sp.category;
  return (
    <article className="card relative flex flex-col items-center !px-4 !py-4 text-center transition hover:border-teal-300 hover:shadow-nav">
      <AreaBadge area={area} />

      <div className="grid h-[76px] w-[76px] shrink-0 place-items-center overflow-hidden rounded-full bg-teal-50 ring-1 ring-ink-200">
        {sp.photo_url || sp.photo ? (
          <img
            src={sp.photo_url || sp.photo}
            alt=""
            width="152" height="152" loading="lazy" decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-display text-2xl font-semibold text-teal-700">
            {initials(sp.name)}
          </span>
        )}
      </div>

      {/* Name and role are set a step down from the old 14/12 and the leading
          is tightened: at three cards across the extra width, not a larger
          face, is what keeps a full name on one or two lines. */}
      <h3 className="mt-2.5 text-[13px] font-bold leading-[1.25] text-ink-900">{sp.name}</h3>

      {sp.designation && (
        <p className="mt-1 text-[11px] leading-[1.35] text-ink-700">{sp.designation}</p>
      )}
      {sp.organization && (
        <p className="text-[11px] leading-[1.35] text-ink-700">{sp.organization}</p>
      )}

      {area && (
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-teal-700">
          {AREA_SHORT[area] || area}
        </p>
      )}
    </article>
  );
}

export default function Speakers() {
  // Admin-managed speakers win; the bundled list is only a fallback.
  const { speakers: SPEAKERS } = useSiteContent();
  const [area, setArea] = useState('All');

  // Only offer a tab that has somebody behind it — an empty filter is a dead
  // control, and on a line-up still being confirmed most areas start empty.
  const tabs = useMemo(() => {
    const present = AREAS.filter((a) => SPEAKERS.some((s) => s.category === a));
    return ['All', ...present];
  }, [SPEAKERS]);

  const shown = area === 'All' ? SPEAKERS : SPEAKERS.filter((s) => s.category === area);

  return (
    <div className="agenda-split">
      {/* The card pane takes the larger share: at 0.8/1.2 each of four cards
          came out 149px wide, which wrapped "Justice (Retd.) Aarti Deshmukh"
          onto three lines. The header column only needs room for the title
          block, so the split favours the grid. */}
      <div className="shell grid gap-8 py-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.6fr)] lg:gap-10 lg:py-10">
        {/* ── Standing event header ── */}
        <header className="lg:sticky lg:top-24 lg:self-start">

          {/* One line, sized to the column, matching the Agenda page. The
              stacked "INDUS / WATERS TREATY / DIALOGUE" split one name across
              three lines and read as three separate things. */}
          <div className="agenda-title-wrap">
          <h1 className="agenda-title mt-4 font-title font-normal uppercase leading-[1.06] tracking-tight text-ink-900">
            Indus Waters Treaty Dialogue
          </h1>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-500 sm:text-xs">
            by Tiesverse Foundation
          </p>
          </div>

          <p className="mt-5 font-title text-lg italic text-teal-700">
            “{SUMMIT.theme}”
          </p>

          <dl className="mt-8 flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink-200 bg-white text-teal-700 sm:h-10 sm:w-10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" />
                </svg>
              </span>
              <div>
                <dt className="sr-only">Date</dt>
                <dd className="font-display text-xs font-bold uppercase tracking-wide text-ink-900 sm:text-sm">
                  {SUMMIT.date}
                </dd>
                <dd className="text-[10px] uppercase tracking-wide text-ink-500 sm:text-xs">Saturday</dd>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink-200 bg-white text-teal-700 sm:h-10 sm:w-10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <div>
                <dt className="sr-only">Venue</dt>
                <dd className="font-display text-xs font-bold uppercase tracking-wide text-ink-900 sm:text-sm">
                  Bharat Mandapam
                </dd>
                <dd className="text-[10px] uppercase tracking-wide text-ink-500 sm:text-xs">New Delhi</dd>
              </div>
            </div>
          </dl>

          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-700">
            Eminent voices from law, water-resource engineering, security studies,
            diplomacy, economics and policy.
          </p>
        </header>

        {/* ── The grid ── */}
        <div className="min-w-0">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.18em] text-teal-700">
            Our speakers
          </h2>
          <span aria-hidden="true" className="mt-3 block h-0.5 w-12 bg-teal-700" />

          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-700">
            Meet the distinguished jurists, experts, scholars, diplomats and
            thought leaders who will shape the conversation.
          </p>

          {SPEAKERS.length > 0 ? (
            <>
              {/* Filters. Only rendered when there is more than one area to
                  choose between — a single tab labelled "All" is furniture. */}
              {tabs.length > 2 && (
                <div className="mt-8 flex flex-wrap items-center gap-1 rounded-card border border-ink-200 bg-white p-1.5">
                  {tabs.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setArea(t)}
                      aria-pressed={area === t}
                      className={`rounded-btn px-3.5 py-2 text-xs font-semibold transition ${
                        area === t
                          ? 'bg-teal-700 text-white'
                          : 'text-ink-700 hover:bg-teal-50 hover:text-teal-800'
                      }`}
                    >
                      {t === 'All' ? 'All' : (AREA_SHORT[t] || t)}
                    </button>
                  ))}
                </div>
              )}

              {/* Three across, not four: a wider card fits a full name and a
                  two-line role without hyphenating, which is what these cards
                  actually have to carry. */}
              <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3">
                {shown.map((sp) => <SpeakerCard key={sp.id || sp.name} sp={sp} />)}
              </div>

              <p className="mt-6 text-xs leading-relaxed text-ink-500">
                {SPEAKER_DISCLAIMER}
              </p>
            </>
          ) : (
            /* No confirmed speakers yet. Says what it is waiting on rather than
               filling the grid with identical "to be announced" cards, which
               told the visitor nothing and looked like a broken feed. */
            <div className="card mt-8">
              <h3 className="font-display text-xl font-semibold text-ink-900">
                The line-up is being confirmed
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                The dialogue convenes jurists, water-resource engineers, security
                scholars and diplomats across its four analytical sessions.
                Invitations and confirmations are handled by the secretariat, and
                names are published here only once a participant has confirmed —
                not while they are still under invitation.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-ink-500">{SPEAKER_DISCLAIMER}</p>
            </div>
          )}

          {/* Closing note, as in the approved design. */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-card border border-ink-200 bg-ink-50 p-5">
            <div className="flex items-center gap-2 sm:gap-3">
              <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-teal-700 ring-1 ring-ink-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <div className="text-sm">
                <p className="font-semibold text-ink-900">More eminent speakers to be announced soon.</p>
                <p className="text-ink-600">Stay tuned for updates.</p>
              </div>
            </div>
            <Link to="/register" className="btn-ghost shrink-0">Register now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
