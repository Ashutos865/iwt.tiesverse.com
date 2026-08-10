import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo.jsx';
import { SUMMIT } from '../lib/constants.js';

// Public navigation (design(1).md §6.1) — registration lives in the CTA, not
// the nav, so the page never shows two equal registration entry points.
const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/agenda', label: 'Agenda' },
  { to: '/speakers', label: 'Speakers' },
  { to: '/partners', label: 'Partners' },
  { to: '/media', label: 'Media' },
  { to: '/contact', label: 'Contact' },
];

const desktopNavClass = ({ isActive }) =>
  `relative py-2 text-[14px] font-semibold transition ${
    isActive
      ? 'text-white after:absolute after:inset-x-0 after:-bottom-[9px] after:h-[2px] after:bg-brand-500'
      : 'text-white/70 hover:text-white'
  }`;

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-900"
      >
        Skip to content
      </a>

      <header
        className={`no-print sticky top-0 z-30 border-b border-white/[0.08] transition-colors ${
          scrolled ? 'bg-navy-950' : 'bg-navy-950/[0.96] backdrop-blur-sm'
        }`}
      >
        <div className="shell flex h-16 items-center justify-between gap-4 lg:h-[82px]">
          <Link to="/" aria-label="Indus Water Treaty Dialogue 2026 — home">
            <BrandLogo light />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={desktopNavClass}>
                {n.label}
              </NavLink>
            ))}
            <Link to="/status" className="py-2 text-[14px] font-semibold text-white/70 hover:text-white">
              Check status
            </Link>
            <Link
              to="/register"
              className="inline-flex h-[44px] items-center rounded bg-brand-600 px-[18px] text-[13px] font-bold uppercase tracking-wide text-white transition hover:bg-brand-500"
            >
              Register / Apply
            </Link>
          </nav>

          {/* Mobile: hamburger opens a full-height navy sheet. */}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded text-white lg:hidden"
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
            className="fixed inset-x-0 bottom-0 top-16 z-30 flex flex-col overflow-y-auto bg-navy-950 px-6 pb-8 pt-4 lg:hidden"
            aria-label="Main menu"
          >
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `border-b border-white/10 py-4 text-base font-semibold ${
                    isActive ? 'text-brand-400' : 'text-white'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="mt-6 grid gap-3">
              <Link to="/register" className="btn-primary w-full uppercase tracking-wide">Register / Apply</Link>
              <Link to="/status" className="btn-ghost w-full !border-white/30 !bg-transparent !text-white">
                Check application status
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <footer className="no-print bg-navy-950 text-white/70">
        <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <BrandLogo light />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/55">
              A two-day international policy dialogue on water, law and regional
              security in the Indus basin. {SUMMIT.dates} · {SUMMIT.venue}.
            </p>
          </div>

          <div className="text-sm">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Dialogue</p>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/agenda" className="hover:text-white">Agenda</Link></li>
              <li><Link to="/speakers" className="hover:text-white">Speakers</Link></li>
              <li><Link to="/partners" className="hover:text-white">Partners</Link></li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Participate</p>
            <ul className="space-y-2">
              <li><Link to="/register" className="hover:text-white">Registration</Link></li>
              <li><Link to="/register/media" className="hover:text-white">Media accreditation</Link></li>
              <li><Link to="/partners#become-a-partner" className="hover:text-white">Partner enquiry</Link></li>
              <li><Link to="/status" className="hover:text-white">Delegate status</Link></li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Resources</p>
            <ul className="space-y-2">
              <li><Link to="/media" className="hover:text-white">Media centre</Link></li>
              <li><Link to="/about#code-of-conduct" className="hover:text-white">Code of conduct</Link></li>
              <li><Link to="/#faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Contact</p>
            <p>Indus Water Treaty Dialogue Secretariat</p>
            <p>New Delhi, India</p>
            <a href={`mailto:${SUMMIT.email}`} className="mt-2 block hover:text-white">{SUMMIT.email}</a>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="shell flex flex-col items-center gap-2 py-4 text-xs text-white/40 sm:flex-row sm:justify-between">
            <span>© 2026 Indus Water Treaty Dialogue. All rights reserved.</span>
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
