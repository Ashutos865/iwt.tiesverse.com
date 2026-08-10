import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import BasinBand from './BasinBand.jsx';
import { ORGANISER, SUMMIT } from '../lib/constants.js';

/**
 * Site shell, in the cop30.br idiom: centred logo, a floating white nav card
 * beneath it, and a warm off-white ground.
 *
 * Two deliberate departures from the reference:
 *
 * 1. The nav card is sticky. COP30's pages are short portals so theirs scrolls
 *    away; ours run long, and losing navigation halfway down About would be a
 *    regression against what this site does today.
 * 2. "Home" keeps a nav link. COP30 relies on the logo alone, but dropping a
 *    control that exists today is exactly what this redesign must not do —
 *    the logo is a home link too, for people who expect that.
 *
 * Every route reachable before the redesign is still reachable from here; the
 * dropdowns add depth rather than replacing the flat links.
 */

// Sub-items are additive: the parent is always a real, navigable page.
const NAV = [
  { to: '/', label: 'Home', end: true },
  {
    to: '/about',
    label: 'About',
    children: [
      { to: '/about', label: 'Background note' },
      { to: '/about#themes', label: 'Themes & objectives' },
      { to: '/about#venue', label: 'Venue and date' },
      { to: '/about#deliverables', label: 'Deliverables and outcomes' },
      { to: '/about#organiser', label: 'About the organisation' },
      { to: '/about#code-of-conduct', label: 'Code of conduct' },
    ],
  },
  { to: '/agenda', label: 'Agenda' },
  { to: '/speakers', label: 'Speakers' },
  {
    to: '/partners',
    label: 'Partners',
    children: [
      { to: '/partners', label: 'Our partners' },
      { to: '/partners#become-a-partner', label: 'Become a partner' },
      { to: '/register/sponsor', label: 'Sponsorship enquiry' },
      { to: '/register/partner', label: 'Partner organisation' },
    ],
  },
  {
    to: '/media',
    label: 'Media',
    children: [
      { to: '/media', label: 'Media centre' },
      { to: '/register/media', label: 'Media accreditation' },
    ],
  },
  {
    to: '/register',
    label: 'Registration',
    children: [
      { to: '/register', label: 'All categories' },
      { to: '/register/delegate', label: 'Delegate' },
      { to: '/register/student', label: 'Student' },
      { to: '/register/speaker', label: 'Speaker' },
      { to: '/register/volunteer', label: 'Volunteer' },
      { to: '/status', label: 'Check application status' },
    ],
  },
  { to: '/contact', label: 'Contact' },
];

const FOOTER_LINKS = [
  {
    heading: 'The Dialogue',
    links: [
      { to: '/about', label: 'About the Dialogue' },
      { to: '/agenda', label: 'Agenda' },
      { to: '/speakers', label: 'Speakers' },
      { to: '/partners', label: 'Partners' },
      { to: '/media', label: 'Media centre' },
    ],
  },
  {
    heading: 'Participate',
    links: [
      { to: '/register', label: 'Delegate registration' },
      { to: '/register/media', label: 'Media accreditation' },
      { to: '/partners#become-a-partner', label: 'Become a partner' },
      { to: '/register/volunteer', label: 'Volunteer' },
      { to: '/status', label: 'Application status' },
    ],
  },
];

function Chevron({ open }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** Desktop nav item; renders a dropdown panel when it has children. */
function DesktopItem({ item, openId, setOpenId }) {
  const panelId = useId();
  const isOpen = openId === panelId;
  const closeTimer = useRef();

  if (!item.children) {
    return (
      <NavLink
        to={item.to}
        end={item.end}
        className={({ isActive }) => `navlink ${isActive ? 'navlink-active' : ''}`}
      >
        {item.label}
      </NavLink>
    );
  }

  // Hover opens, but a short close delay keeps the panel usable while the
  // pointer crosses the gap between trigger and panel.
  const open = () => { clearTimeout(closeTimer.current); setOpenId(panelId); };
  const close = () => { closeTimer.current = setTimeout(() => setOpenId((v) => (v === panelId ? null : v)), 120); };

  return (
    <div className="relative" onMouseEnter={open} onMouseLeave={close}>
      <NavLink
        to={item.to}
        className={({ isActive }) => `navlink ${isActive || isOpen ? 'navlink-active' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onFocus={open}
        onClick={() => setOpenId(null)}
      >
        {item.label}
        <Chevron open={isOpen} />
      </NavLink>

      {isOpen && (
        <div
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-64 rounded-card border border-ink-200 bg-white p-2 shadow-nav"
          onMouseEnter={open}
          onMouseLeave={close}
        >
          {item.children.map((c) => (
            <Link
              key={c.to + c.label}
              to={c.to}
              className="block rounded px-3 py-2.5 text-sm font-medium text-ink-800 hover:bg-brand-50 hover:text-brand-800"
              onClick={() => setOpenId(null)}
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/** Mobile disclosure group. */
function MobileItem({ item, onNavigate }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-ink-100">
      <div className="flex items-center">
        <NavLink
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex-1 py-4 text-base font-semibold ${isActive ? 'text-brand-700' : 'text-ink-900'}`
          }
        >
          {item.label}
        </NavLink>
        {item.children && (
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-pill text-ink-700"
            aria-expanded={open}
            aria-label={`${open ? 'Collapse' : 'Expand'} ${item.label} links`}
            onClick={() => setOpen((v) => !v)}
          >
            <Chevron open={open} />
          </button>
        )}
      </div>
      {item.children && open && (
        <div className="pb-3">
          {item.children.map((c) => (
            <Link
              key={c.to + c.label}
              to={c.to}
              onClick={onNavigate}
              className="block py-2.5 pl-4 text-sm font-medium text-ink-700 hover:text-brand-700"
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openId, setOpenId] = useState(null);
  const location = useLocation();
  const isUtilityScreen = location.pathname.startsWith('/admin')
    || location.pathname.startsWith('/verify');

  useEffect(() => { setMenuOpen(false); setOpenId(null); }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Escape closes an open dropdown — hover-only menus strand keyboard users.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setOpenId(null); setMenuOpen(false); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Anchor links in the nav and footer (/about#themes) need explicit handling:
  // the router changes the hash without the browser re-running its own jump.
  useEffect(() => {
    if (!location.hash) { window.scrollTo(0, 0); return; }
    const el = document.getElementById(location.hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="no-print">
        {/* Centred logo, as on the reference site. */}
        <div className="shell flex justify-center pb-4 pt-6 sm:pt-8">
          <Link to="/" aria-label={`${SUMMIT.name} — home`}>
            <img
              src="/brand/iwt-logo.png"
              width="526"
              height="200"
              alt={SUMMIT.name}
              className="h-14 w-auto sm:h-[72px]"
            />
          </Link>
        </div>

      </header>

      {/*
        Floating nav card. Sticky, unlike the reference — our pages run long.

        This sits OUTSIDE <header> on purpose: a sticky element can only stick
        within its containing block, and <header> is only as tall as the logo
        band, so nesting it there made the card scroll away immediately. As a
        direct child of the page column its containing block is the whole
        document. It stays a <nav> landmark either way.
      */}
      <div className="no-print sticky top-0 z-40 bg-paper/85 pb-3 pt-2 backdrop-blur-sm">
        <div className="shell">
          <nav className="navcard flex items-center justify-between gap-2 px-2 py-2" aria-label="Main">
              <div className="hidden items-center gap-0.5 lg:flex">
                {NAV.map((item) => (
                  <DesktopItem key={item.to} item={item} openId={openId} setOpenId={setOpenId} />
                ))}
              </div>

              {/* Mobile: the card collapses to a label + trigger. */}
              <span className="px-3 text-sm font-semibold text-ink-800 lg:hidden">Menu</span>

              <div className="flex items-center gap-2">
                <Link
                  to="/register"
                  className="btn-primary !min-h-[40px] !px-5 !py-2 !text-xs uppercase tracking-wide"
                >
                  Register
                </Link>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-pill text-ink-900 hover:bg-brand-50 lg:hidden"
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
          </nav>
        </div>
      </div>

      {menuOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-paper lg:hidden" role="dialog" aria-modal="true" aria-label="Main menu">
            <div className="shell flex items-center justify-between py-4">
              <img src="/brand/iwt-logo.png" width="526" height="200" alt="" className="h-11 w-auto" />
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-pill text-ink-900"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              </button>
            </div>
            <div className="shell pb-10">
              {NAV.map((item) => (
                <MobileItem key={item.to} item={item} onNavigate={() => setMenuOpen(false)} />
              ))}
              <div className="mt-6 grid gap-3">
                <Link to="/register" className="btn-primary w-full" onClick={() => setMenuOpen(false)}>
                  Register now
                </Link>
                <Link to="/status" className="btn-ghost w-full" onClick={() => setMenuOpen(false)}>
                  Check application status
                </Link>
              </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Relief band above the footer. Skipped on the secretariat and gate-scan
          screens — those are working tools, not brochure pages. */}
      {!isUtilityScreen && <BasinBand />}

      <footer className="no-print border-t border-ink-200 bg-white">
        <div className="shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src="/brand/iwt-logo.png" width="526" height="200" alt={SUMMIT.name} className="h-12 w-auto" />
            <p className="mt-4 text-xs leading-relaxed text-ink-700">
              {SUMMIT.date} · {SUMMIT.venue}
            </p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-ink-500">
              A one-day dialogue on the Indus Waters Treaty, convened on the {SUMMIT.anniversary}{' '}
              anniversary of its signing.
            </p>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.heading} className="text-sm">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-500">
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.to + l.label}>
                    <Link to={l.to} className="text-ink-700 hover:text-brand-700 hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="text-sm">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-500">Contact</p>
            <p className="text-ink-700">Indus Waters Treaty Dialogue Secretariat</p>
            <p className="text-ink-700">New Delhi, India</p>
            {SUMMIT.phone && <p className="mt-2 text-ink-700">{SUMMIT.phone}</p>}
            <a href={`mailto:${SUMMIT.email}`} className="mt-2 block text-brand-700 hover:underline">
              {SUMMIT.email}
            </a>
            <p className="mt-4 text-[11px] uppercase tracking-[0.15em] text-ink-500">Organised by</p>
            <a
              href={ORGANISER.website}
              target="_blank"
              rel="noreferrer noopener"
              className="text-ink-700 hover:text-brand-700 hover:underline"
            >
              {ORGANISER.name}
            </a>
          </div>
        </div>

        <div className="border-t border-ink-200">
          <div className="shell flex flex-col items-center gap-2 py-4 text-xs text-ink-500 sm:flex-row sm:justify-between">
            <span>© 2026 {ORGANISER.name}. All rights reserved.</span>
            <span className="flex gap-4">
              <Link to="/about#code-of-conduct" className="hover:text-brand-700">Code of Conduct</Link>
              <Link to="/contact" className="hover:text-brand-700">Support</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
