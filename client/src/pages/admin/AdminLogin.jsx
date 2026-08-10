import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, setAdminKey } from '../../lib/api.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // A scan that hit the staff gate sends ?next=/verify/<token> so sign-in
  // lands straight back on the pass being checked. Only same-site paths.
  const rawNext = params.get('next') || '';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/admin/applications';

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.adminLogin(password);
      setAdminKey(password);
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-5">
      <form onSubmit={handleSubmit} className="card w-full">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Secretariat</p>
        <h1 className="mt-2 font-display text-2xl text-ink-900">Admin sign in</h1>
        <p className="mt-1 text-sm text-ink-600/80">
          Review applications, approve delegates and issue passes.
        </p>

        <label className="label mt-6" htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={busy} className="btn-dark mt-5 w-full">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
