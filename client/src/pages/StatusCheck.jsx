import { useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import QRPassCard from '../components/QRPassCard.jsx';
import { api } from '../lib/api.js';

const NEXT_STEP = {
  received: 'Your application is queued for verification by the secretariat.',
  under_review: 'The secretariat is verifying your details and documents.',
  approved: 'You are confirmed. Bring the QR pass below and a matching photo ID.',
  rejected: 'Your application was not approved for this edition.',
};

export default function StatusCheck() {
  const [email, setEmail] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      setResult(await api.checkStatus(email.trim(), registrationId.trim()));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <div className="no-print">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Applicants</p>
        <h1 className="mt-2 font-display text-3xl text-ink-900">Check your application</h1>
        <p className="mt-2 text-sm text-ink-600/80">
          Enter the email you applied with and the registration number from your confirmation.
        </p>

        <form onSubmit={handleSubmit} className="card mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="status-email">
              Email address
            </label>
            <input
              id="status-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="label" htmlFor="status-id">
              Registration number
            </label>
            <input
              id="status-id"
              required
              value={registrationId}
              onChange={(e) => setRegistrationId(e.target.value.toUpperCase())}
              className="input font-mono"
              placeholder="IWT26-DEL-00001"
            />
          </div>

          <div className="sm:col-span-2">
            <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
              {loading ? 'Checking…' : 'Check status'}
            </button>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2">
              {error}
            </p>
          )}
        </form>
      </div>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="card no-print">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl text-ink-900">{result.fullName}</p>
                <p className="text-sm text-ink-600/80">
                  {result.categoryLabel} · <span className="font-mono">{result.registrationId}</span>
                </p>
              </div>
              <StatusBadge status={result.status} />
            </div>

            <p className="mt-4 text-sm text-ink-600/80">{NEXT_STEP[result.status]}</p>

            {result.status === 'rejected' && result.rejectionReason && (
              <p className="mt-3 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                <strong>Reason:</strong> {result.rejectionReason}
              </p>
            )}

            <p className="mt-4 text-xs text-ink-600/60">
              Submitted {new Date(result.submittedAt).toLocaleString()}
            </p>
          </div>

          {result.qr && <QRPassCard registration={result} />}
        </div>
      )}
    </div>
  );
}
