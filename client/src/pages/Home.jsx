import { Link } from 'react-router-dom';
import { SUMMIT } from '../lib/constants.js';

/*
 * Headline figures.
 *
 * NOTE FOR THE SECRETARIAT — these are the attendance projections supplied
 * with the approved design. They are not drawn from the concept note, and an
 * earlier build removed an identical band for that reason: "20+ sessions"
 * contradicts a single-day agenda. They are kept here, in one place, so they
 * can be corrected in one edit. Published figures on a landing page are read
 * as commitments by press and prospective partners.
 */
const STATS = [
  { figure: '600+', label: 'Delegates' },
  { figure: '30+', label: 'Countries' },
  { figure: '40+', label: 'Speakers' },
  { figure: '20+', label: 'Sessions' },
];

export default function Home() {
  return (
    /*
      The hero, as approved.

      The artwork sits behind it as a background rather than an <img>: it is
      atmosphere, not content, and a screen reader announcing a decorative
      valley drawing before the headline would be noise. The cream ground
      shows through wherever the art does not reach, so the section never
      depends on the image having loaded.

      This carries the page's only H1. Before this build the home page had a
      screen-reader-only heading and no visible title at all.
    */
    <section className="hero-indus">
      {/*
        The floor under the content is reserved for the mountains.

        The drawing is sized to the viewport width and anchored to the bottom,
        so its skyline always sits a fixed share of that width above the base —
        measured on the asset, the art below the centre skyline is 17.6% of the
        image width. Reserving 19vw underneath (a little more, for the taller
        flanking ridges) means the buttons and the stats line cannot reach the
        peaks at any window size. A fixed pixel value cannot do this: the peak
        line moves with the width, so any literal is right at one size and
        wrong at the next.

        Capped at 300px so the reserve stops growing on an ultrawide monitor,
        where 19vw would push the content needlessly far up the screen.
      */}
      <div
        className="shell relative z-10 flex flex-col items-center py-12 text-center sm:py-16 lg:pt-20"
        style={{ paddingBottom: 'min(300px, max(3rem, 19vw))' }}
      >
        <p className="text-sm font-semibold tracking-wide text-teal-700">
          {SUMMIT.date} · {SUMMIT.venue}
        </p>

        {/*
          Larken via font-title, with the supplied 180° gradient.

          The two lines are inline-block, not block: a clipped gradient is
          sized to its box, so on full-width blocks the ramp would run across
          the whole line rather than through the letterforms.

          text-ink-800 is not redundant — it is the colour the headline keeps
          if background-clip:text is unsupported (see the @supports guard in
          index.css), and the colour Larken falls back into if the licensed
          font file is absent.
        */}
        <h1 className="mt-6 font-tagline text-4xl font-normal leading-[1.14] tracking-[-0.01em] sm:text-5xl lg:text-[58px]">
          <span className="title-gradient mx-auto block w-fit text-ink-800">
            Blood and Water
          </span>
          <span className="title-gradient mx-auto block w-fit text-ink-800">
            Cannot Flow Together
          </span>
        </h1>

        {/* A short rule, as in the design — it separates the claim from the
            explanation without adding another line of copy. */}
        <span aria-hidden="true" className="mt-7 block h-px w-40 bg-ink-200" />

        <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Link to="/register" className="btn-primary">Register Now</Link>
          <Link to="/agenda" className="btn-ghost">Explore the Agenda</Link>
        </div>

        {/*
          A <dl>: each figure is a value for a named term, which is what a
          description list is for, and it gives screen readers the pairing
          rather than eight loose fragments.
        */}
        <dl className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-4 text-sm sm:gap-x-5">
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-ink-200 sm:block" />
              )}
              <div className="flex items-baseline gap-1.5">
                <dt className="sr-only">{s.label}</dt>
                <dd className="flex items-baseline gap-1.5">
                  <span className="font-display text-base font-semibold text-ink-900">{s.figure}</span>
                  <span className="text-ink-600">{s.label}</span>
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
