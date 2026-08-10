import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { SESSIONS, SPEAKERS, SPEAKER_DISCLAIMER } from '../content/summit.js';

/**
 * Speakers.
 *
 * The concept note is explicit that everyone named in it is a *proposed
 * invitee* — "their inclusion reflects suitability, not confirmed
 * participation". So this page publishes no names until they are confirmed,
 * and says plainly what it is waiting on rather than filling the grid with
 * eight identical "Speaker to be announced" cards, which told the visitor
 * nothing and looked like a broken feed.
 *
 * When the confirmed line-up arrives, add entries to SPEAKERS in
 * content/summit.js and the grid below renders automatically.
 */

function SpeakerCard({ sp }) {
  return (
    <article className="card flex flex-col !p-0 text-center">
      <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-t-card bg-gradient-to-b from-brand-700 to-brand-900">
        {sp.photo ? (
          <img src={sp.photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#2396D3" strokeWidth="1.2" aria-hidden="true">
            <circle cx="12" cy="8.5" r="3.5" />
            <path d="M4.5 20c1.4-3.6 4.2-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
          </svg>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-ink-900">{sp.name}</h3>
        <p className="mt-0.5 text-xs text-ink-700">{sp.designation}</p>
        {sp.organization && <p className="text-xs text-ink-500">{sp.organization}</p>}
      </div>
    </article>
  );
}

export default function Speakers() {
  const panels = SESSIONS.filter((s) => s.kind === 'session');

  return (
    <>
      <PageHero
        title="Speakers"
        lead="Jurists, water-resource engineers, security scholars and diplomats."
      />

      <div className="shell max-w-4xl py-10 lg:py-14">
        {SPEAKERS.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {SPEAKERS.map((sp) => <SpeakerCard key={sp.id} sp={sp} />)}
          </div>
        ) : (
          <div className="card">
            <h2 className="font-display text-xl font-semibold text-ink-900">
              The line-up is being confirmed
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              The dialogue convenes jurists, water-resource engineers, security scholars and
              diplomats across its four analytical sessions. Invitations and confirmations are
              handled by the secretariat, and names are published here only once a participant
              has confirmed — not while they are still under invitation.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink-500">{SPEAKER_DISCLAIMER}</p>
          </div>
        )}

        {/* Substance in the meantime: what each panel is actually convened to argue. */}
        <section className="mt-10">
          <h2 className="eyebrow">Panels being staffed</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {panels.map((p) => (
              <Link key={p.id} to="/agenda" className="card transition hover:border-brand-600">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  {p.type}
                </p>
                <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink-900">
                  {p.title}
                </h3>
                <p className="mt-1 text-xs text-ink-500">{p.start}–{p.end}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-10 rounded-card bg-tile-bluegreen p-6 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold">Speaking at the Dialogue</p>
            <p className="mt-1 text-sm text-white/70">
              Speakers join by invitation. Nominations can be sent to the secretariat.
            </p>
          </div>
          <Link to="/contact" className="btn-primary mt-4 shrink-0 sm:mt-0">Contact the secretariat</Link>
        </div>
      </div>
    </>
  );
}
