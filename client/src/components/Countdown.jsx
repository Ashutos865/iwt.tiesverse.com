import { useEffect, useState } from 'react';
import { SUMMIT } from '../lib/constants.js';

/**
 * Live countdown to the dialogue.
 *
 * Three states: counting down, "Live now" while the day is running, and
 * nothing at all once it is over — a stale "0 days to go" band sitting on the
 * page in October would be worse than no band.
 *
 * Accessibility: the digits re-render every second, so the ticking row is
 * aria-hidden and a single quiet sentence carries the same information to
 * screen readers. Announcing "fifty-six seconds… fifty-five seconds…" forever
 * is the kind of thing that makes people turn the page off.
 */

// 19 September 2026, 09:00–18:00 IST. One day.
const START = new Date('2026-09-19T09:00:00+05:30').getTime();
const END = new Date('2026-09-19T18:00:00+05:30').getTime();

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function split(remaining) {
  return {
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    seconds: Math.floor((remaining % MINUTE) / SECOND),
  };
}

function Unit({ value, label, pad = true }) {
  return (
    <div className="flex items-baseline gap-1.5 sm:gap-2">
      <span className="font-sans text-4xl font-bold leading-none tabular-nums text-white sm:text-5xl">
        {pad ? String(value).padStart(2, '0') : value}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

// Dark teal card: on the warm off-white ground the counter needs its own
// surface to read as a distinct object rather than floating text.

export default function Countdown({ className = '' }) {
  const [now, setNow] = useState(() => Date.now());
  const finished = now >= END;

  useEffect(() => {
    // Stop ticking once the event is over — no point holding a timer open.
    if (finished) return undefined;
    const id = setInterval(() => setNow(Date.now()), SECOND);
    return () => clearInterval(id);
  }, [finished]);

  if (finished) return null;

  const live = now >= START;
  const { days, hours, minutes, seconds } = split(Math.max(0, START - now));

  return (
    <div className={`rounded-card bg-teal-900 px-5 py-6 shadow-tile sm:px-8 ${className}`}>
      <p className="text-center text-xs font-medium text-white/60">
        {SUMMIT.shortName}, {SUMMIT.date}
      </p>

      {live ? (
        <p className="mt-3 flex justify-center">
          <span className="pill-ok !text-sm">● Live now</span>
        </p>
      ) : (
        <>
          <div
            className="mt-3 flex flex-wrap items-baseline justify-center gap-x-5 gap-y-2 sm:gap-x-9"
            aria-hidden="true"
          >
            <Unit value={days} label="Days" pad={false} />
            <Unit value={hours} label="Hrs" />
            <Unit value={minutes} label="Min" />
            <Unit value={seconds} label="Sec" />
          </div>
          <p className="sr-only">
            {days} days until the {SUMMIT.name} on {SUMMIT.date}.
          </p>
        </>
      )}
    </div>
  );
}
