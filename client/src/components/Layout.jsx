import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ORGANISER, SUMMIT } from '../lib/constants.js';

// Public navigation per design.md §3.1, in this order.
const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/agenda', label: 'Agenda' },
  { to: '/speakers', label: 'Speakers' },
  { to: '/partners', label: 'Partners' },
  { to: '/media', label: 'Media' },
  { to: '/register', label: 'Registration' },
  { to: '/contact', label: 'Contact' },
];

/** Three concentric-ring rosettes, echoing the mandala mark. */
function LogoMark({ light = false }) {
  return (
    <span className="flex items-center" aria-hidden="true">
      <svg width="34" height="34" viewBox="0 0 24 24" className={light ? 'text-brand-400' : 'text-brand-600'}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.6" />
        <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      </svg>
    </span>
  );
}

/**
 * Text wordmark — footer only.
 *
 * The header uses the supplied logo artwork, but that artwork sets "Waters
 * Treaty Dialogue" in black, which disappears against the navy footer. Rather
 * than tint it, the footer keeps this legible text lockup.
 */
function Wordmark() {
  return (
    <span className="leading-tight">
      <span className="block text-sm font-bold uppercase tracking-wide text-white">
        Indus Waters Treaty
      </span>
      <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
        Dialogue 2026 · New Delhi
      </span>
    </span>
  );
}

// White header: links carry their own contrast rather than relying on a dark
// ground. Active state pairs weight with the underline so it does not read by
// colour alone.
const desktopNavClass = ({ isActive }) =>
  `relative px-1 py-2 text-[13px] font-semibold uppercase tracking-wide transition ${
    isActive
      ? 'text-ink-900 after:absolute after:inset-x-0 after:-bottom-[21px] after:h-[3px] after:bg-brand-600'
      : 'text-ink-600 hover:text-ink-900'
  }`;

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // The mobile sheet closes on navigation; body scroll locks while it is open.
  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="no-print sticky top-0 z-30 border-b border-ink-200 bg-white">
        <div className="shell flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Link to="/" className="flex items-center" aria-label={`${SUMMIT.name} — home`}>
            {/* Intrinsic size set so the row reserves space before the image
                decodes and the nav does not jump on load. */}
            <img
              src="/brand/iwt-logo.png"
              width="526"
              height="200"
              alt={SUMMIT.name}
              className="h-10 w-auto lg:h-12"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Main">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={desktopNavClass}>
                {n.label}
              </NavLink>
            ))}
            <Link to="/register" className="btn-primary !min-h-[40px] !px-4 !py-2 !text-xs uppercase tracking-wide">
              Register now
            </Link>
          </nav>

          {/* Mobile: hamburger opens a full-height sheet (§5.2), never a tiny dropdown. */}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded text-ink-900 lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen
                ? <><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></>
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav
            className="fixed inset-x-0 bottom-0 top-16 z-30 flex flex-col overflow-y-auto bg-white px-6 pb-8 pt-4 lg:hidden"
            aria-label="Main menu"
          >
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `border-b border-ink-100 py-4 text-base font-semibold ${
                    isActive ? 'text-brand-700' : 'text-ink-900'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="mt-6 grid gap-3">
              <Link to="/register" className="btn-primary w-full">Register now</Link>
              <Link to="/status" className="btn-ghost w-full">
                Check application status
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="no-print bg-navy-950 text-white/70">
        <div className="shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark light />
              <Wordmark />
            </div>
            <p className="mt-4 text-xs leading-relaxed">
              {SUMMIT.date} · {SUMMIT.venue}
            </p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/50">
              A one-day dialogue on the Indus Waters Treaty, convened on the {SUMMIT.anniversary}{' '}
              anniversary of its signing.
            </p>
          </div>

          <div className="text-sm">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Quick links</p>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white">About the Dialogue</Link></li>
              <li><Link to="/agenda" className="hover:text-white">Agenda</Link></li>
              <li><Link to="/speakers" className="hover:text-white">Speakers</Link></li>
              <li><Link to="/partners" className="hover:text-white">Partners</Link></li>
              <li><Link to="/media" className="hover:text-white">Media centre</Link></li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Participate</p>
            <ul className="space-y-2">
              <li><Link to="/register" className="hover:text-white">Delegate registration</Link></li>
              <li><Link to="/register/media" className="hover:text-white">Media accreditation</Link></li>
              <li><Link to="/partners#become-a-partner" className="hover:text-white">Become a partner</Link></li>
              <li><Link to="/register/volunteer" className="hover:text-white">Volunteer</Link></li>
              <li><Link to="/status" className="hover:text-white">Application status</Link></li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Contact</p>
            <p>Indus Waters Treaty Dialogue Secretariat</p>
            <p>New Delhi, India</p>
            {SUMMIT.phone && <p className="mt-2">{SUMMIT.phone}</p>}
            <a href={`mailto:${SUMMIT.email}`} className="mt-2 block hover:text-white">{SUMMIT.email}</a>
            <p className="mt-3 text-[11px] uppercase tracking-[0.15em] text-white/50">Organised by</p>
            <a
              href={ORGANISER.website}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-white"
            >
              {ORGANISER.name}
            </a>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="shell flex flex-col items-center gap-2 py-4 text-xs text-white/40 sm:flex-row sm:justify-between">
            <span>© 2026 {ORGANISER.name}. All rights reserved.</span>
            <span className="flex gap-4">
              <Link to="/about#code-of-conduct" className="hover:text-white/70">Code of Conduct</Link>
              <Link to="/contact" className="hover:text-white/70">Support</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
