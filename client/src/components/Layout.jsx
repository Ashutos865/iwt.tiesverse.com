import { Link, NavLink, Outlet } from 'react-router-dom';
import { SUMMIT } from '../lib/constants.js';

const navClass = ({ isActive }) =>
  `text-[13px] font-semibold uppercase tracking-wide transition ${
    isActive ? 'text-brand-600' : 'text-ink-700 hover:text-brand-600'
  }`;

/** Three concentric-ring rosettes, echoing the mockup's mandala mark. */
function LogoMark() {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[10, 13, 10].map((r, i) => (
        <svg key={i} width={r * 2} height={r * 2} viewBox="0 0 24 24" className="text-brand-600">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.6" />
          <circle cx="12" cy="12" r="2.4" fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="no-print sticky top-0 z-20 border-b border-ink-100 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <Link to="/" className="flex items-center gap-3">
            <LogoMark />
            <span className="leading-tight">
              <span className="block text-sm font-bold uppercase tracking-wide text-ink-900">
                Indus Water Treaty
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
                Dialogue 2026 · New Delhi
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-5">
            <NavLink to="/register" className={navClass}>
              Registration
            </NavLink>
            <NavLink to="/status" className={navClass}>
              Check Status
            </NavLink>
            <Link to="/register" className="btn-primary hidden !px-4 !py-2 !text-xs uppercase tracking-wide sm:inline-flex">
              Register Now
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="no-print bg-ink-950 text-white/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg text-white">Indus Water Treaty</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
              Dialogue 2026 · New Delhi
            </p>
            <p className="mt-3 text-xs leading-relaxed">
              {SUMMIT.dates} · {SUMMIT.venue}
            </p>
          </div>

          <div className="text-sm">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
              Participate
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link to="/register" className="hover:text-white">
                  Delegate registration
                </Link>
              </li>
              <li>
                <Link to="/register/media" className="hover:text-white">
                  Media accreditation
                </Link>
              </li>
              <li>
                <Link to="/register/partner" className="hover:text-white">
                  Become a partner
                </Link>
              </li>
              <li>
                <Link to="/status" className="hover:text-white">
                  Application status
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
              Contact
            </p>
            <p>Indus Water Treaty Dialogue Secretariat</p>
            <p>New Delhi, India</p>
            <p className="mt-1.5">{SUMMIT.phone}</p>
            <p>{SUMMIT.email}</p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
          © 2026 Indus Water Treaty Dialogue. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
