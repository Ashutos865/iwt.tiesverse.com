import { Link } from 'react-router-dom';
import MandalaDivider from '../components/MandalaDivider.jsx';
import { SUMMIT } from '../lib/constants.js';

/**
 * Portal tiles — the reference site's primary navigation device. Each is a
 * real route; the grid is a second, more prominent way into the same places
 * the nav card reaches.
 */
/*
 * Colours are the supplied brand palette, and `text` is not decorative — it is
 * derived from each ground's contrast. White on Keppel is 2.95:1 and on
 * Gainsboro 1.37:1, so those tiles must take ink instead; see the table in
 * tailwind.config.js.
 *
 * The two wide tiles share Blue-Green deliberately: five colours across six
 * tiles means one repeat, and bookending the grid with the darkest reads as
 * intent rather than as running short.
 */
const TILES = [
  { to: '/about', title: 'About the Dialogue', sub: 'Background, six themes and the case for abeyance', bg: 'bg-tile-bluegreen', text: 'text-white', span: 'sm:col-span-2' },
  { to: '/agenda', title: 'Agenda', sub: 'The full running order, 09:00–18:00', bg: 'bg-tile-turquoise', text: 'text-white' },
  { to: '/speakers', title: 'Speakers', sub: 'Jurists, engineers, security scholars, diplomats', bg: 'bg-tile-keppel', text: 'text-ink-900' },
  { to: '/partners', title: 'Partners', sub: 'Partnership programme and tiers', bg: 'bg-tile-cadet', text: 'text-ink-900' },
  { to: '/media', title: 'Media Centre', sub: 'Accreditation, releases and the media kit', bg: 'bg-tile-gainsboro', text: 'text-ink-900' },
  { to: '/register', title: 'Register', sub: 'Seven participation tracks', bg: 'bg-tile-bluegreen', text: 'text-white', span: 'sm:col-span-2' },
];

export default function Home() {
  return (
    <>
      {/*
        The visible hero was removed at the client's request. The page still
        needs exactly one H1 naming what it is — without it the home page has
        no accessible or indexable title at all, since the only other instance
        is the logo's alt text. Screen readers and search engines read this;
        nobody sees it.
      */}
      <h1 className="sr-only">{SUMMIT.name}</h1>

      {/*
        The countdown sat above this grid and was removed for now. The tiles
        take the freed height rather than leaving a gap: `.tile` grows from
        168px to a responsive floor, so the grid still fills the first screen.
        components/Countdown.jsx is kept intact for when it comes back.
      */}
      <section className="shell pb-14 pt-2">
        <div className="grid gap-4 sm:grid-cols-4">
          {TILES.map((t) => (
            <Link key={t.to} to={t.to} className={`tile ${t.bg} ${t.text} ${t.span || ''}`}>
              <span className="tile-title">{t.title}</span>
              <span className="tile-sub">{t.sub}</span>
            </Link>
          ))}
        </div>
      </section>

      <MandalaDivider className="shell pb-6 pt-2" />
    </>
  );
}
