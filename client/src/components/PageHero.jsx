import { Link, useLocation } from 'react-router-dom';
import { SUMMIT } from '../lib/constants.js';

/**
 * Page header in the cop30.br idiom: breadcrumb, a category chip, then a
 * centred title over the warm ground — replacing the previous full-bleed navy
 * band.
 *
 * The prop API (title, lead, meta, children) is unchanged so every page that
 * already renders a PageHero picks up the new treatment without edits.
 */

// Section labels for the chip and the breadcrumb trail.
const SECTION = {
  about: 'The Dialogue',
  agenda: 'The Dialogue',
  speakers: 'The Dialogue',
  partners: 'Partners',
  media: 'Media',
  contact: 'Contact',
  register: 'Registration',
  status: 'Registration',
};

export default function PageHero({ title, lead, meta = true, chip, children }) {
  const { pathname } = useLocation();
  const segment = pathname.split('/').filter(Boolean)[0] || '';
  const label = chip || SECTION[segment] || 'The Dialogue';

  return (
    <section className="shell pb-8 pt-2">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">›</span>
        <span className="text-ink-700">{title}</span>
      </nav>

      <div className="mt-8 flex flex-col items-center text-center">
        <p className="chip">{label}</p>
        <h1 className="page-title mt-4 max-w-3xl">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">{lead}</p>}
        {meta && (
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-ink-500">
            {SUMMIT.date} · {SUMMIT.venue}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
