import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { SESSIONS, SPEAKER_DISCLAIMER } from '../content/summit.js';
import { SUMMIT } from '../lib/constants.js';

/**
 * Single-day running order.
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

function BreakRow({ item }) {
  return (
    <li className="flex items-center gap-4 py-3 sm:gap-6">
      <span className="w-[104px] shrink-0 text-xs font-semibold tabular-nums text-ink-500 sm:w-32">
        {item.start}–{item.end}
      </span>
      <span className="flex-1 border-t border-dashed border-ink-200" aria-hidden="true" />
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-500">
        {item.title}
      </span>
    </li>
  );
}

function SessionRow({ item, open, onToggle }) {
  return (
    <li className="flex gap-4 sm:gap-6">
      {/* Time gutter doubles as the timeline spine on wider screens. */}
      <div className="w-[104px] shrink-0 sm:w-32">
        <p className="text-sm font-bold tabular-nums text-ink-900">{item.start}</p>
        <p className="text-xs tabular-nums text-ink-500">to {item.end}</p>
      </div>

      <article className="card mb-3 min-w-0 flex-1 !p-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="w-full p-5 text-left"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-600">
              {item.type}
            </span>
            {item.group && (
              <span className={GROUP_TONE[item.group] || 'pill-muted'}>{item.group}</span>
            )}
          </div>

          <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink-900">
            {item.title}
          </h3>

          {item.theme && (
            <p className="mt-1 text-sm italic text-ink-700">Theme: ‘{item.theme}’</p>
          )}

          {!open && (
            <p className="mt-1.5 line-clamp-2 text-sm text-ink-700">{item.description}</p>
          )}

          <span className="mt-2 inline-block text-xs font-semibold text-brand-600">
            {open ? 'Hide details' : 'Read the session brief'}
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
  const [openId, setOpenId] = useState(null);
  const [showBreaks, setShowBreaks] = useState(true);

  const rows = showBreaks ? SESSIONS : SESSIONS.filter((s) => s.kind === 'session');
  const sessionCount = SESSIONS.filter((s) => s.kind === 'session').length;

  return (
    <>
      <PageHero
        title="Agenda"
        lead="One day, four analytical sessions, and the adoption of the New Delhi Declaration."
      />

      {/* Single-day header — replaces the day tabs a two-day event would need.
          Not sticky: the nav card already occupies the top of the viewport, and
          a second stuck bar would need to track its height. */}
      <div className="border-y border-ink-200 bg-white">
        <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
          <div>
            <p className="text-sm font-bold text-ink-900">{SUMMIT.date}</p>
            <p className="text-[11px] text-ink-500">
              {SUMMIT.venue} · 09:00–18:00 · {sessionCount} sessions
            </p>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-ink-700">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand-600"
              checked={showBreaks}
              onChange={(e) => setShowBreaks(e.target.checked)}
            />
            Show breaks
          </label>
        </div>
      </div>

      <div className="shell py-8 lg:py-12">
        <ul className="max-w-4xl">
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
        <p className="mt-6 max-w-4xl text-xs leading-relaxed text-ink-500">
          {SPEAKER_DISCLAIMER}
        </p>

        <div className="mt-8 max-w-4xl rounded-card bg-tile-navy p-6 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold">Attend the dialogue</p>
            <p className="mt-1 text-sm text-white/70">
              Applications are reviewed by the secretariat before attendance is confirmed.
            </p>
          </div>
          <Link to="/register" className="btn-primary mt-4 shrink-0 sm:mt-0">Register now</Link>
        </div>
      </div>
    </>
  );
}
