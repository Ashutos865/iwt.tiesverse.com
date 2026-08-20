import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ORGANISER, SOCIALS, SUMMIT } from '../lib/constants.js';

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

/*
 * The six top-level items of the approved design: Dialogue, About, Agenda,
 * Speakers, Partners, Media.
 *
 * Sub-items are additive — the parent is always a real, navigable page.
 *
 * Three routes the design does not name in the bar are folded into the
 * dropdowns rather than dropped: Registration and its seven category forms,
 * the application-status check, and Contact. All three are live routes people
 * are sent to from emails and the footer, and removing their only in-page
 * signposts to match a mockup would strand them. Registration also remains the
 * "Apply" button to the right of this list, which is where the design puts the
 * primary path.
 */
const NAV = [
  {
    to: '/',
    label: 'Dialogue',
    end: true,
    children: [
      { to: '/', label: 'Overview' },
      { to: '/register', label: 'Registration: all categories' },
      { to: '/status', label: 'Check application status' },
      { to: '/contact', label: 'Contact the secretariat' },
    ],
  },
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
  {
    to: '/speakers',
    label: 'Speakers',
    children: [
      { to: '/speakers', label: 'Confirmed speakers' },
      { to: '/register', label: 'Register to attend' },
    ],
  },
  {
    to: '/partners',
    label: 'Partners',
    children: [
      { to: '/partners', label: 'Our partners' },
      { to: '/partners#become-a-partner', label: 'Become a partner' },
    ],
  },
  {
    to: '/media',
    label: 'Media',
    children: [
      { to: '/media', label: 'Media centre' },
      { to: '/register', label: 'Media accreditation' },
    ],
  },
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
      { to: '/register', label: 'Register to attend' },
      { to: '/partners#become-a-partner', label: 'Become a partner' },
      { to: '/contact', label: 'Contact the secretariat' },
      { to: '/status', label: 'Application status' },
    ],
  },
];

/*
 * Social marks, drawn inline rather than pulled from an icon package: four
 * glyphs do not justify a dependency, and inline paths inherit currentColor so
 * each follows its link's hover state. aria-hidden throughout — the anchor
 * around them carries the label.
 */
const SOCIAL_PATHS = {
  LinkedIn: (
    <>
      <path d="M4.98 3.5a2 2 0 1 1-.02 4 2 2 0 0 1 .02-4Z" />
      <path d="M3.5 8.8h3v11.7h-3z" />
      <path d="M9.5 8.8h2.9v1.6a3.2 3.2 0 0 1 2.9-1.6c3 0 3.6 2 3.6 4.6v6.1h-3v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.5h-3z" />
    </>
  ),
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  X: <path d="M4 4h3.6l4.5 6 5.2-6H21l-6.8 7.8L21.4 20h-3.6l-4.8-6.4L7.3 20H4l7.2-8.3z" />,
  YouTube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.4v5.2l4.6-2.6z" fill="currentColor" stroke="none" />
    </>
  ),
};

function SocialIcon({ name }) {
  return (
    <svg
      width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      {SOCIAL_PATHS[name]}
    </svg>
  );
}

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
              className="block rounded px-3 py-2.5 text-sm font-medium text-ink-800 hover:bg-teal-50 hover:text-teal-800"
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
            `flex-1 py-4 text-base font-semibold ${isActive ? 'text-teal-700' : 'text-ink-900'}`
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
              className="block py-2.5 pl-4 text-sm font-medium text-ink-700 hover:text-teal-700"
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

  /*
    Publish the header's real height so the hero can fill exactly the rest of
    the first screen (see .hero-indus). Measured rather than assumed: the
    promotional strip wraps to two lines on a narrow phone and the nav bar
    changes height at sm, so any hard-coded figure would leave a strip of the
    next section showing on some viewport — which is what it did.
  */
  const headerRef = useRef(null);
  const navBarRef = useRef(null);
  useEffect(() => {
    const measure = () => {
      const h = (headerRef.current?.offsetHeight || 0) + (navBarRef.current?.offsetHeight || 0);
      if (h) document.documentElement.style.setProperty('--header-h', `${h}px`);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const ro = new ResizeObserver(measure);
    if (headerRef.current) ro.observe(headerRef.current);
    if (navBarRef.current) ro.observe(navBarRef.current);
    return () => ro.disconnect();
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
      <header ref={headerRef} className="no-print">
        {/*
          Promotional strip. This is the only link from the Dialogue back to
          the parent organisation's site, so it carries a real destination
          rather than being decorative — a visitor who arrived here from a
          shared invitation has no other route to the rest of Tiesverse.
        */}
        <div className="bg-teal-950 text-center text-[13px] text-white/90">
          <div className="shell-wide py-2.5">
            Inspired by the upcoming event?{' '}
            {/* The rule sits under the domain only. Underlining the whole
                sentence drew a line the width of the strip, which read as a
                border rather than as a link; the address is the part that
                behaves like one. */}
            <a
              href={ORGANISER.website}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-on-dark group rounded-sm font-semibold text-white no-underline"
            >
              Explore our other work at{' '}
              {/* The full address, www included, as the organisation writes it.
                  The arrow marks this as leaving for another site — it sits
                  outside the underline so the rule stays under the address
                  itself rather than trailing past it. */}
              <span className="underline decoration-white/40 underline-offset-4 group-hover:decoration-white">
                {ORGANISER.websiteLabel}
              </span>
              <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          </div>
        </div>

      </header>

      {/*
        One white bar carrying the logo and the navigation together, as in the
        approved design. The previous build split them across two bands — a
        centred logo above a floating pill card — which cost roughly 90px of
        vertical space before the headline and pushed the artwork below the
        fold.

        Sticky, so navigation survives the long inner pages. It sits outside
        <header> on purpose: a sticky element can only stick within its
        containing block, and <header> is only as tall as the strip, so
        nesting it there made the bar scroll away immediately. It remains a
        <nav> landmark either way.
      */}
      <div ref={navBarRef} className="no-print sticky top-0 z-40 border-b border-ink-200 bg-white">
        {/*
          The bar spans the window rather than the 1180px text column. `.shell`
          centres its contents, so on a wide monitor the logo floated a long way
          in from the left while the page beneath it kept its own margins. A
          header is furniture, not prose — it reads better anchored to the
          screen edges, with a wider gutter so nothing touches the glass.
        */}
        <div className="shell-wide">
          <nav className="flex items-center justify-between gap-4 py-3" aria-label="Main">
              {/*
                Logo slot. The mark is decided separately, so this reserves a
                fixed height and lets the width follow the artwork — swapping
                the file in cannot disturb the bar's geometry.
              */}
              <Link
                to="/"
                aria-label={`${SUMMIT.name} home`}
                className="shrink-0"
              >
                <img
                  src="/brand/iwt-logo.png"
                  width="503"
                  height="120"
                  alt={SUMMIT.name}
                  /* Smaller on the narrowest phones. At 320px the logo, the
                     Apply button and the menu button together are wider than
                     the screen, and all three were shrink-0, so the row
                     overflowed instead of adapting. */
                  className="h-8 w-auto min-[360px]:h-10 sm:h-12"
                />
              </Link>

              {/* min-w-0 lets this column shrink before the actions do — the
                  links are the flexible middle, the buttons are fixed. */}
              <div className="hidden min-w-0 items-center gap-0.5 lg:flex">
                {NAV.map((item) => (
                  <DesktopItem key={item.to} item={item} openId={openId} setOpenId={setOpenId} />
                ))}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {/*
                  Two actions, as in the approved design. They are not
                  synonyms: "Request invitation" is the low-commitment route
                  for someone still deciding, "Apply" goes straight to the
                  registration wizard. Both existed as routes already; the
                  nav previously surfaced only the second.
                */}
                {/*
                  whitespace-nowrap is load-bearing: without it "Request
                  invitation" wraps to two lines and shoves the Apply button
                  off the right edge. It appears from lg — with six top-level
                  items rather than the previous eight there is room for it at
                  1024px, verified rather than assumed.
                */}
                <Link
                  to="/contact"
                  className="hidden !min-h-[40px] shrink-0 items-center whitespace-nowrap rounded-btn border border-ink-200 px-4 py-2 text-xs font-semibold text-ink-900 transition hover:border-teal-700 hover:text-teal-700 lg:inline-flex"
                >
                  Request invitation
                </Link>
                <Link
                  to="/register"
                  className="btn-primary !min-h-[40px] !px-5 !py-2 !text-xs tracking-wide"
                >
                  Apply
                  <span aria-hidden="true" className="ml-1">↗</span>
                </Link>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-pill text-ink-900 hover:bg-teal-50 lg:hidden"
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
              <img src="/brand/iwt-logo.png" width="503" height="120" alt="" className="h-11 w-auto" />
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

      {/*
        The satellite relief band that used to sit here was removed with the
        redesign: it is a photographic delta map, and next to the commissioned
        line drawing in the hero it read as a second, unrelated illustration
        style on the same page. components/BasinBand.jsx is left intact in case
        a line-art equivalent is drawn for this slot later.
      */}

      <footer className="no-print border-t border-ink-200 bg-white">
        {/*
          Two columns from the smallest width, not one.

          Stacked in a single column with a 40px gap, the four blocks came to
          905px — taller than the hero above them, so on a 819px phone the
          footer filled the screen the moment you scrolled past the fold and
          the page read as if it were all footer. Two columns of link lists
          halves that, and the gaps tighten on small screens where the
          generous desktop rhythm is not doing any work.
        */}
        <div className="shell-wide grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:gap-10 sm:py-12 lg:grid-cols-4">
          {/* Full width on a phone: this block is prose, and half a 402px
              screen is too narrow for it to set without ragging badly. */}
          <div className="col-span-2 lg:col-span-1">
            <img src="/brand/iwt-logo.png" width="503" height="120" alt={SUMMIT.name} className="h-10 w-auto sm:h-12" />
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
                    <Link to={l.to} className="text-ink-700 hover:text-teal-700 hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Also full width on a phone — "Indus Waters Treaty Dialogue
              Secretariat" cannot set in a half-width column at 402px. */}
          <div className="col-span-2 text-sm lg:col-span-1">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-500">Contact</p>
            <p className="text-ink-700">Indus Waters Treaty Dialogue Secretariat</p>
            <p className="text-ink-700">New Delhi, India</p>
            {SUMMIT.phone && <p className="mt-2 text-ink-700">{SUMMIT.phone}</p>}
            <a href={`mailto:${SUMMIT.email}`} className="mt-2 block text-teal-700 hover:underline">
              {SUMMIT.email}
            </a>
            <p className="mt-4 text-[11px] uppercase tracking-[0.15em] text-ink-500">Organised by</p>
            <a
              href={ORGANISER.website}
              target="_blank"
              rel="noreferrer noopener"
              className="text-ink-700 hover:text-teal-700 hover:underline"
            >
              {ORGANISER.name}
            </a>

            {/*
              Tiesverse's accounts. Icon-only, so each carries its network name
              as the accessible label — an unlabelled glyph announces as "link"
              and tells a screen-reader user nothing about where it goes.
            */}
            <ul className="mt-4 flex flex-wrap items-center gap-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${ORGANISER.abbr} on ${s.label}`}
                    title={s.label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-700 transition hover:border-teal-700 hover:bg-teal-50 hover:text-teal-700"
                  >
                    <SocialIcon name={s.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-200">
          <div className="shell-wide flex flex-col items-center gap-2 py-4 text-xs text-ink-500 sm:flex-row sm:justify-between">
            <span>© 2026 {ORGANISER.name}. All rights reserved.</span>
            <span className="flex gap-4">
              <Link to="/about#code-of-conduct" className="hover:text-teal-700">Code of Conduct</Link>
              <Link to="/contact" className="hover:text-teal-700">Support</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
