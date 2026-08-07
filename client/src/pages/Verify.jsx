import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api.js';

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
 * What a phone opens when it scans a badge. Verification is a live lookup, so a
 * revoked or downgraded registration stops working the moment it changes.
 */
export default function Verify() {
  const { token } = useParams();
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    let cancelled = false;
    api
      .verifyPass(token)
      .then((data) => !cancelled && setState({ loading: false, data }))
      .catch((err) => !cancelled && setState({ loading: false, error: err.message }));
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (state.loading) {
    return <Centered>Verifying pass…</Centered>;
  }
  if (state.error) {
    return <Centered>Could not reach the verification service. Try again.</Centered>;
  }

  const { data } = state;

  if (!data.valid) {
    const copy = INVALID_COPY[data.reason] || INVALID_COPY.TAMPERED;
    return (
      <Centered>
        <div className="w-full max-w-md rounded-xl border-2 border-red-500 bg-white p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
            ✕
          </div>
          <h1 className="mt-5 font-display text-2xl text-red-700">{copy.title}</h1>
          <p className="mt-2 text-sm text-ink-600/80">{copy.body}</p>
          {data.registrationId && (
            <p className="mt-4 font-mono text-xs text-ink-600/60">{data.registrationId}</p>
          )}
        </div>
      </Centered>
    );
  }

  const r = data.registration;

  return (
    <Centered>
      <div className="w-full max-w-md rounded-xl border-2 border-emerald-500 bg-white p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
          ✓
        </div>
        <h1 className="mt-5 font-display text-2xl text-emerald-700">Valid pass</h1>

        {r.photoUrl && (
          <img
            src={r.photoUrl}
            alt=""
            className="mx-auto mt-6 h-28 w-28 rounded-full border-4 border-emerald-100 object-cover"
          />
        )}

        <p className="mt-4 font-display text-2xl text-ink-900">{r.fullName}</p>
        <p className="text-sm text-ink-600/80">{r.categoryLabel}</p>
        {r.organisation && <p className="text-sm text-ink-600/80">{r.organisation}</p>}
        {r.nationality && <p className="mt-1 text-xs text-ink-600/60">{r.nationality}</p>}

        <p className="mt-5 font-mono text-sm font-semibold tracking-wide text-ink-900">
          {r.registrationId}
        </p>
        <p className="mt-4 text-xs text-ink-600/60">
          Check that the photograph matches the person in front of you.
        </p>
      </div>
    </Centered>
  );
}

function Centered({ children }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ink-50 px-5 py-12 text-center text-sm text-ink-600/80">
      {children}
    </div>
  );
}
