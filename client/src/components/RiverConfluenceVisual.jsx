import { EVENT_EDITION, eventPhase } from '../lib/constants.js';

/**
 * The hero's River Confluence Field (design(1).md §7.4): abstract tributary
 * linework converging to one channel, faint contour curves behind, a few
 * dialogue nodes — deliberately conceptual, no borders, no geography. Pure
 * SVG; the countdown block is computed from the event edition config.
 */
export default function RiverConfluenceVisual() {
  const { phase, days } = eventPhase();

  return (
    <div className="relative h-full min-h-[360px] w-full" aria-hidden="true">
      <svg viewBox="0 0 480 520" className="h-full w-full" preserveAspectRatio="xMidYMid meet" fill="none">
        {/* contour field, 6–10% opacity */}
        <g stroke="#38AFE0" strokeWidth="1" opacity="0.08">
          <path d="M20 80 C140 40 300 110 460 60" />
          <path d="M0 150 C160 110 320 180 480 130" />
          <path d="M10 230 C170 190 330 260 470 210" />
          <path d="M0 320 C160 280 320 350 480 300" />
          <path d="M20 410 C180 370 330 440 470 390" />
          <path d="M0 480 C160 440 320 500 480 460" />
        </g>

        {/* tributaries entering from top / right… */}
        <g strokeLinecap="round">
          <path d="M60 30 C110 130 160 220 210 300" stroke="#1597D1" strokeWidth="1.8" opacity="0.65" />
          <path d="M170 10 C190 110 200 210 215 305" stroke="#38AFE0" strokeWidth="1.4" opacity="0.55" />
          <path d="M300 20 C280 120 250 220 224 308" stroke="#1597D1" strokeWidth="2" opacity="0.75" />
          <path d="M410 50 C360 140 290 230 232 312" stroke="#38AFE0" strokeWidth="1.5" opacity="0.5" />
          <path d="M460 160 C400 220 310 270 240 318" stroke="#0C7DB8" strokeWidth="1.7" opacity="0.6" />
          <path d="M440 280 C380 300 300 315 248 326" stroke="#38AFE0" strokeWidth="1.2" opacity="0.45" />
        </g>

        {/* …converging into the single channel */}
        <path
          d="M220 305 C215 360 200 420 170 500"
          stroke="#38AFE0" strokeWidth="2.6" strokeLinecap="round" opacity="0.9"
        />

        {/* dialogue nodes at meeting points */}
        <g fill="#38AFE0">
          <circle cx="210" cy="300" r="3.2" />
          <circle cx="224" cy="308" r="2.4" opacity="0.8" />
          <circle cx="240" cy="318" r="2" opacity="0.6" />
          <circle cx="170" cy="10" r="2" opacity="0.5" />
          <circle cx="410" cy="50" r="2" opacity="0.5" />
        </g>
      </svg>

      {/* edition stamp */}
      <div className="absolute bottom-6 left-2 border-l-2 border-teal-500 pl-4 text-white">
        <p className="text-[13px] font-bold tracking-[0.14em]">19–20 SEP</p>
        <p className="font-display text-[26px] leading-none">2026</p>
        <p className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-white/60">NEW DELHI</p>
      </div>

      {/* lifecycle-aware countdown (§7.4) */}
      <div className="absolute right-2 top-8 text-right text-white">
        {phase === 'pre' && (
          <>
            <p className="font-display text-[56px] font-medium leading-none">{days}</p>
            <p className="mt-1 text-[11px] font-bold tracking-[0.2em] text-teal-500">DAYS TO GO</p>
          </>
        )}
        {phase === 'live' && (
          <p className="text-[13px] font-bold tracking-[0.2em] text-teal-500">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-ok align-middle" />EVENT LIVE
          </p>
        )}
        {phase === 'post' && (
          <p className="text-[13px] font-bold tracking-[0.2em] text-white/60">{EVENT_EDITION.edition} EDITION</p>
        )}
      </div>
    </div>
  );
}
