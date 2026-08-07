import { SUMMIT } from '../lib/constants.js';

/** The delegate's pass. Printable — the header/footer chrome is `no-print`. */
export default function QRPassCard({ registration }) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm">
      <div className="bg-ink-900 px-6 py-4 text-white">
        <p className="font-display text-lg leading-none">Indus Water Treaty Dialogue 2026</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/60">
          {SUMMIT.dates} · {SUMMIT.venue}
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
        <img
          src={registration.qr.dataUrl}
          alt={`QR pass for ${registration.registrationId}`}
          className="h-44 w-44 shrink-0 rounded-lg border border-ink-100"
        />

        <div className="min-w-0 flex-1 text-center sm:text-left">
          {registration.photoUrl && (
            <img
              src={registration.photoUrl}
              alt=""
              className="mx-auto mb-3 h-20 w-20 rounded-full border-2 border-ink-100 object-cover sm:mx-0"
            />
          )}
          <p className="font-display text-xl text-ink-900">{registration.fullName}</p>
          <p className="text-sm text-ink-600/80">{registration.categoryLabel}</p>
          <p className="mt-3 font-mono text-sm font-semibold tracking-wide text-ink-900">
            {registration.registrationId}
          </p>
          <p className="mt-3 text-xs text-ink-600/70">
            Present this QR code with a matching photo ID at the registration desk.
          </p>
        </div>
      </div>

      <div className="no-print border-t border-ink-100 px-6 py-3 text-center">
        <button type="button" onClick={() => window.print()} className="btn-ghost !py-1.5 !text-xs">
          Print pass
        </button>
      </div>
    </div>
  );
}
