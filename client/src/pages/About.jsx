import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { PILLARS } from '../content/summit.js';
import { SUMMIT, STATS } from '../lib/constants.js';

export default function About() {
  return (
    <>
      <PageHero title="About the Dialogue" lead={SUMMIT.theme} />

      <div className="shell max-w-3xl py-10 lg:py-14">
        <section>
          <h2 className="eyebrow">Mission</h2>
          <p className="mt-3 text-[17px] leading-relaxed text-ink-800">{SUMMIT.about}</p>
        </section>

        <section className="mt-10">
          <h2 className="eyebrow">The 2026 theme</h2>
          <p className="mt-3 font-display text-2xl font-semibold leading-snug text-ink-900">
            “{SUMMIT.theme}”
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            The Indus Waters Treaty has survived wars, crises and six decades of hostility — but glacial
            melt, demand growth and a changed strategic environment are testing assumptions the treaty was
            never built for. The 2026 Dialogue asks what law, reciprocity and security require of the basin
            states now.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="eyebrow">Thematic pillars</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <Link key={p.title} to="/agenda" className="card transition hover:border-brand-600">
                <h3 className="font-display text-lg font-semibold text-ink-900">{p.title}</h3>
                <p className="mt-1.5 text-sm text-ink-700">{p.text}</p>
                <span className="btn-text !min-h-0 mt-2 text-xs">Sessions in this track →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="eyebrow">The summit in numbers</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="card !p-4 text-center">
                <p className="font-display text-2xl font-semibold text-brand-600">{s.value}</p>
                <p className="text-xs uppercase tracking-wide text-ink-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="code-of-conduct" className="mt-10">
          <h2 className="eyebrow">Code of conduct</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            The Dialogue is a professional policy forum. Participants are expected to engage respectfully
            across national, institutional and disciplinary lines; harassment or intimidation of any
            participant leads to removal without refund of any kind. Sessions marked as closed-door follow
            the Chatham House Rule: what was said may be used, who said it may not.
          </p>
        </section>

        <section className="mt-12 rounded-card bg-navy-950 p-6 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold">Join the Dialogue</p>
            <p className="mt-1 text-sm text-white/70">Applications are reviewed before attendance is confirmed.</p>
          </div>
          <Link to="/register" className="btn-primary mt-4 sm:mt-0">Apply to attend</Link>
        </section>
      </div>
    </>
  );
}
