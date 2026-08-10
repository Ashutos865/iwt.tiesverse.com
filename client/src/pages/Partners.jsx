import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { PARTNER_TIERS } from '../content/summit.js';
import { SUMMIT, STATS } from '../lib/constants.js';

/** Normalized logo box (§11.2): fixed bounding box, contain, name as text. */
function PartnerLogo({ name }) {
  return (
    <div className="flex h-24 items-center justify-center rounded-card border border-ink-200 bg-white px-6">
      <span className="text-center text-base font-bold tracking-wide text-ink-700">{name}</span>
    </div>
  );
}

export default function Partners() {
  const tiersWithMembers = PARTNER_TIERS.filter((t) => t.members.length > 0);
  const openTiers = PARTNER_TIERS.filter((t) => t.members.length === 0).map((t) => t.tier);

  return (
    <>
      <PageHero title="Partners" lead="Collaborating for a secure and sustainable future of the Indus basin." />

      <div className="shell py-10 lg:py-14">
        {tiersWithMembers.map((t) => (
          <section key={t.tier} className="mb-10">
            <h2 className="eyebrow">{t.tier}</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {t.members.map((m) => <PartnerLogo key={m} name={m} />)}
            </div>
          </section>
        ))}

        {openTiers.length > 0 && (
          <p className="mb-10 text-sm text-ink-500">
            {openTiers.join(', ')} — open for the 2026 edition.
          </p>
        )}

        {/* Become a partner (§11.3) — inline substance, not only a PDF */}
        <section id="become-a-partner" className="rounded-card bg-navy-950 p-8 text-white">
          <h2 className="font-display text-2xl font-semibold">Become a partner</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/75">
            Partnership places your institution inside a two-day policy dialogue attended by government,
            diplomatic, defence, academic, industry and media participants — with visibility across the
            venue, the programme and the published outcomes.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {STATS.slice(0, 3).map((s) => (
              <div key={s.label} className="rounded-card bg-white/5 p-4">
                <p className="font-display text-2xl font-semibold text-brand-400">{s.value}</p>
                <p className="text-xs uppercase tracking-wide text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
          <ul className="mt-6 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
            <li>· Programme association across tiers, from presenting to supporting</li>
            <li>· Branding at the venue and in official publications</li>
            <li>· Delegate passes within the agreed allocation</li>
            <li>· Association with the New Delhi Declaration and white paper</li>
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/register/sponsor" className="btn-primary">Request a partnership meeting</Link>
            <a href={`mailto:${SUMMIT.email}?subject=Partnership%20enquiry`} className="btn-ghost !border-white/30 !bg-transparent !text-white">
              Write to the secretariat
            </a>
          </div>
          <p className="mt-4 text-xs text-white/50">
            Partnership is a separate track from participant registration — submitting an enquiry does not
            create an event badge.
          </p>
        </section>
      </div>
    </>
  );
}
