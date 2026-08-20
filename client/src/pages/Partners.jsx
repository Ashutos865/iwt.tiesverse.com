import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { DELIVERABLES } from '../content/summit.js';
import useSiteContent from '../lib/useSiteContent.js';
import { SUMMIT } from '../lib/constants.js';

/**
 * Partners.
 *
 * PARTNER_TIERS is empty until partnerships are actually signed. The previous
 * build listed ORF, RIS, CII, FICCI, ASSOCHAM, TERI and IWA here — real
 * institutions, none of them named in the concept note. Publishing an
 * organisation's name as a partner of a politically-charged dialogue it has
 * not agreed to is a misrepresentation, so the tiers render only when they
 * have members and the page otherwise says the programme is open.
 *
 * The pitch below sells what the concept note actually promises — the
 * evidentiary record and the New Delhi Declaration — not invented audience
 * figures.
 */

function PartnerLogo({ name }) {
  return (
    <div className="flex h-24 items-center justify-center rounded-card border border-ink-200 bg-white px-6">
      <span className="text-center text-base font-bold tracking-wide text-ink-700">{name}</span>
    </div>
  );
}

export default function Partners() {
  const { partnerTiers: PARTNER_TIERS } = useSiteContent();
  const tiersWithMembers = PARTNER_TIERS.filter((t) => t.members.length > 0);
  const openTiers = PARTNER_TIERS.filter((t) => t.members.length === 0).map((t) => t.tier);

  return (
    <>
      <PageHero
        title="Partners"
        lead="Institutions backing an evidence-led dialogue on the Indus Waters Treaty."
      />

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
          <div className="mb-10 rounded-card border border-ink-200 bg-white p-5">
            <h2 className="eyebrow">Partnership programme</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              {tiersWithMembers.length === 0
                ? 'Partners are announced here as agreements are concluded. Every tier is currently open:'
                : 'The following tiers remain open:'}{' '}
              {openTiers.join(', ')}.
            </p>
          </div>
        )}

        {/* Become a partner — the offer, stated in terms of the actual outputs. */}
        <section id="become-a-partner" className="rounded-card bg-teal-400 p-8 text-ink-900">
          <h2 className="font-display text-2xl font-semibold">Become a partner</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-900/80">
            Partnership associates your institution with a single-day policy dialogue at Bharat
            Mandapam convened on the sixty-sixth anniversary of the Treaty&rsquo;s signing, and
            with the durable record it produces — a legal-policy white paper, a sourced evidence
            and cartography exhibit, and the New Delhi Declaration on the Indus Waters Treaty.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {DELIVERABLES.slice(0, 3).map((d) => (
              <div key={d.n} className="rounded-card bg-white/25 p-4">
                <p className="font-display text-sm font-semibold text-ink-900/45">{d.n}</p>
                <p className="mt-1 text-sm font-semibold text-ink-900">{d.title}</p>
              </div>
            ))}
          </div>

          <ul className="mt-6 grid gap-2 text-sm text-ink-900/85 sm:grid-cols-2">
            <li>· Programme association across tiers, from dialogue to supporting partner</li>
            <li>· Branding at the venue and in official publications</li>
            <li>· Delegate passes within the agreed allocation</li>
            <li>· Association with the New Delhi Declaration and white paper</li>
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/register" className="btn bg-ink-900 text-white hover:bg-ink-800">Request a partnership meeting</Link>
            <a
              href={`mailto:${SUMMIT.email}?subject=Partnership%20enquiry`}
              className="btn-ghost !border-ink-900/35 !bg-transparent !text-ink-900 hover:!bg-white/25"
            >
              Write to the secretariat
            </a>
          </div>

          <p className="mt-4 text-xs text-ink-900/60">
            Partnership is a separate track from participant registration — submitting an enquiry
            does not create an event badge.
          </p>
        </section>
      </div>
    </>
  );
}
