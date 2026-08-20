import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge.jsx';
import { api, clearAdminKey , getAdminKey } from '../../lib/api.js';

const labelise = (key) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
};

export default function AdminDetail() {
  const { registrationId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');

  const load = useCallback(async () => {
    try {
      setRecord(await api.adminDetail(registrationId));
    } catch (err) {
      if (err.status === 401) {
        clearAdminKey();
        navigate('/admin', { replace: true });
        return;
      }
      setError(err.message);
    }
  }, [registrationId, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(fn) {
    setBusy(true);
    setError('');
    try {
      await fn();
      await load();
      setRejecting(false);
      setReason('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (error && !record) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10">
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
        <Link to="/admin/applications" className="btn-ghost mt-4">
          Back to list
        </Link>
      </div>
    );
  }

  if (!record) {
    return <div className="mx-auto max-w-3xl px-5 py-16 text-center text-ink-600/70">Loading…</div>;
  }

  const decidable = record.status === 'received' || record.status === 'under_review';
  const files = Object.entries(record.files).filter(([, meta]) => meta);
  // Identity documents require the admin key. <img> and target=_blank cannot
  // set headers, so it is appended per-URL rather than sent as a header.
  const docUrl = (url) => `${url}${url.includes('?') ? '&' : '?'}key=${encodeURIComponent(getAdminKey())}`;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link to="/admin/applications" className="text-sm text-ink-600/70 hover:text-ink-900">
        ← All applications
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink-900">{record.fullName}</h1>
          <p className="text-sm text-ink-600/80">
            {record.categoryLabel} · <span className="font-mono">{record.registrationId}</span>
          </p>
          <p className="text-sm text-ink-600/70">{record.email}</p>
        </div>
        <StatusBadge status={record.status} />
      </div>

      {error && (
        <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      )}

      <div className="mt-6 card">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-800">
          Submitted details
        </h2>
        <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {Object.entries(record.data).map(([key, value]) => (
            <div key={key}>
              <dt className="text-xs font-medium uppercase tracking-wide text-ink-600/60">
                {labelise(key)}
              </dt>
              <dd className="mt-0.5 break-words text-sm text-ink-900">{formatValue(value)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 card">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-800">Documents</h2>
        {files.length ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {files.map(([field, meta]) => (
              <a
                key={field}
                href={docUrl(meta.url)}
                target="_blank"
                rel="noreferrer"
                className="group rounded-lg border border-ink-100 p-3 transition hover:border-teal-500"
              >
                {meta.mimetype.startsWith('image/') ? (
                  <img src={docUrl(meta.url)} alt="" className="h-28 w-full rounded object-cover" />
                ) : (
                  <div className="flex h-28 items-center justify-center rounded bg-ink-50 text-sm font-semibold text-ink-600/70">
                    PDF
                  </div>
                )}
                <p className="mt-2 text-xs font-medium text-ink-900">{labelise(field)}</p>
                <p className="truncate text-[11px] text-ink-600/60">{meta.originalName}</p>
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-600/70">No documents uploaded.</p>
        )}
      </div>

      <div className="mt-6 card">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-800">Decision</h2>

        {record.status === 'approved' && record.qr ? (
          <div className="mt-4 flex flex-wrap items-center gap-5">
            <img src={record.qr.dataUrl} alt="" className="h-32 w-32 rounded border border-ink-100" />
            <div className="text-sm">
              <p className="font-medium text-emerald-700">Pass issued</p>
              <p className="mt-1 break-all text-xs text-ink-600/70">{record.qr.verifyUrl}</p>
            </div>
          </div>
        ) : record.status === 'rejected' ? (
          <p className="mt-3 text-sm text-ink-600/80">
            Rejected{record.decision.rejectionReason ? `: ${record.decision.rejectionReason}` : ''}.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-ink-600/80">
              Approving issues a QR pass immediately and makes it visible to the applicant.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {record.status === 'received' && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => act(() => api.adminReview(record.registrationId))}
                  className="btn-ghost"
                >
                  Mark under review
                </button>
              )}
              <button
                type="button"
                disabled={busy || !decidable}
                onClick={() => act(() => api.adminApprove(record.registrationId))}
                className="btn-primary"
              >
                {busy ? 'Working…' : 'Approve & issue pass'}
              </button>
              <button
                type="button"
                disabled={busy || !decidable}
                onClick={() => setRejecting((v) => !v)}
                className="btn-danger"
              >
                Reject
              </button>
            </div>

            {rejecting && (
              <div className="mt-4">
                <label className="label" htmlFor="reject-reason">
                  Reason (shown to the applicant)
                </label>
                <textarea
                  id="reject-reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="input"
                  placeholder="e.g. Could not verify the submitted press card."
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => act(() => api.adminReject(record.registrationId, reason))}
                  className="btn-danger mt-3"
                >
                  Confirm rejection
                </button>
              </div>
            )}
          </>
        )}

        <p className="mt-5 text-xs text-ink-600/60">
          Submitted {new Date(record.timestamps.submittedAt).toLocaleString()}
          {record.timestamps.decidedAt &&
            ` · Decided ${new Date(record.timestamps.decidedAt).toLocaleString()}`}
        </p>
      </div>
    </div>
  );
}
