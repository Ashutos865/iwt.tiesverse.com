import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, getAdminKey } from '../lib/api.js';

const INVALID_COPY = {
  TAMPERED: {
    title: 'Invalid pass',
    body: 'This code was not issued by the summit, or it has been altered. Do not admit.',
  },
  NOT_FOUND: {
    title: 'Pass not recognised',
    body: 'No registration matches this code. Send the holder to the help desk.',
  },
  NOT_APPROVED: {
    title: 'Not approved',
    body: 'This application has not been approved for entry. Send the holder to the help desk.',
  },
};

/**
 * What opens when a badge QR is scanned. Verification is STAFF ONLY: without
 * an admin session this page shows nothing about the holder. With one, the
 * scan verifies AND checks the person in, in a single step — a second scan of
 * the same badge shows a duplicate warning instead of a fresh green card.
 */
export default function Verify() {
  const { token } = useParams();
  const signedIn = Boolean(getAdminKey());
  const [state, setState] = useState({ loading: signedIn });

  useEffect(() => {
    if (!signedIn) return undefined;
    let cancelled = false;
    api
      .checkinPass(token)
      .then((data) => !cancelled && setState({ loading: false, data }))
      .catch((err) => !cancelled && setState({
        loading: false,
        error: err.status === 401 ? 'AUTH' : err.message,
      }));
    return () => { cancelled = true; };
  }, [token, signedIn]);

  // Not signed in (or session expired): reveal nothing about the pass.
  if (!signedIn || state.error === 'AUTH') {
    return (
      <Centered>
        <div className="card w-full max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 text-2xl">🔒</div>
          <h1 className="mt-4 font-display text-2xl text-ink-900">Staff verification only</h1>
          <p className="mt-2 text-sm text-ink-700">
            Badge passes can only be verified by summit staff. If you are staff, sign in and scan again —
            this page will then verify and check the holder in automatically.
          </p>
          <Link
            to={`/admin?next=/verify/${encodeURIComponent(token)}`}
            className="btn-primary mt-5 w-full"
          >
            Staff sign in
          </Link>
        </div>
      </Centered>
    );
  }

  if (state.loading) return <Centered>Verifying and checking in…</Centered>;
  if (state.error) return <Centered>Could not reach the verification service. Try again.</Centered>;

  const { data } = state;

  if (!data.valid) {
    const copy = INVALID_COPY[data.reason] || INVALID_COPY.TAMPERED;
    return (
      <Centered>
        <div className="w-full max-w-md rounded-card border-2 border-bad bg-white p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-bad-bg text-3xl text-bad">✕</div>
          <h1 className="mt-5 font-display text-2xl text-bad">{copy.title}</h1>
          <p className="mt-2 text-sm text-ink-700">{copy.body}</p>
          {data.registrationId && (
            <p className="mt-4 font-mono text-xs text-ink-500">{data.registrationId}</p>
          )}
          <ScanNext />
        </div>
      </Centered>
    );
  }

  const r = data.registration;
  const duplicate = Boolean(data.alreadyCheckedIn);

  return (
    <Centered>
      <div className={`w-full max-w-md rounded-card border-2 bg-white p-8 text-center ${duplicate ? 'border-warn' : 'border-ok'}`}>
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl ${duplicate ? 'bg-warn-bg text-warn' : 'bg-ok-bg text-ok'}`}>
          {duplicate ? '⚠' : '✓'}
        </div>
        <h1 className={`mt-5 font-display text-2xl ${duplicate ? 'text-warn' : 'text-ok'}`}>
          {duplicate ? 'Already checked in' : 'Checked in'}
        </h1>
        {duplicate && r.checkedInAt && (
          <p className="mt-1 text-sm font-semibold text-warn">
            First entry: {new Date(r.checkedInAt).toLocaleString()} — verify identity before admitting.
          </p>
        )}

        {r.photoUrl && (
          <img
            src={r.photoUrl}
            alt=""
            className={`mx-auto mt-6 h-28 w-28 rounded-full border-4 object-cover ${duplicate ? 'border-warn-bg' : 'border-ok-bg'}`}
          />
        )}

        <p className="mt-4 font-display text-2xl text-ink-900">{r.fullName}</p>
        <p className="text-sm text-ink-700">{r.categoryLabel}</p>
        {r.organisation && <p className="text-sm text-ink-700">{r.organisation}</p>}
        {r.nationality && <p className="mt-1 text-xs text-ink-500">{r.nationality}</p>}

        <p className="mt-5 font-mono text-sm font-semibold tracking-wide text-ink-900">{r.registrationId}</p>
        <p className="mt-4 text-xs text-ink-500">
          Check that the photograph matches the person in front of you.
        </p>
        <ScanNext />
      </div>
    </Centered>
  );
}

function ScanNext() {
  return (
    <Link to="/admin/checkin" className="btn-ghost mt-6 w-full">
      Scan next badge
    </Link>
  );
}

function Centered({ children }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ink-50 px-5 py-12 text-center text-sm text-ink-700">
      {children}
    </div>
  );
}
