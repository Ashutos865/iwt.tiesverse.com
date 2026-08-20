import { Link, Navigate, useLocation } from 'react-router-dom';

export default function Success() {
  const { state } = useLocation();
  if (!state?.registrationId) return <Navigate to="/register" replace />;

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <div className="card text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
          ✓
        </div>

        <h1 className="mt-5 font-display text-3xl text-ink-900">Application received</h1>
        <p className="mt-2 text-sm text-ink-600/80">
          Your {state.categoryLabel} application has been submitted for review.
        </p>

        <div className="mt-8 rounded-lg border border-dashed border-teal-500 bg-teal-500/5 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-600/60">
            Your registration number
          </p>
          <p className="mt-2 select-all font-display text-2xl font-bold tracking-wide text-ink-900">
            {state.registrationId}
          </p>
          <p className="mt-2 text-xs text-ink-600/70">
            Save this. You will need it with your email to check your status.
          </p>
        </div>

        <div className="mt-8 space-y-2 text-left text-sm text-ink-600/80">
          <p className="font-semibold text-ink-900">What happens next</p>
          <p>
            The secretariat verifies your details and documents. If approved, your QR pass appears on
            the status page and is emailed to <strong>{state.email}</strong> for badge collection at
            the venue.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/status" className="btn-primary">
            Check status
          </Link>
          <Link to="/" className="btn-ghost">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
