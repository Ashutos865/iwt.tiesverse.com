import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge.jsx';
import { api, clearAdminKey } from '../../lib/api.js';
import { CATEGORIES } from '../../lib/constants.js';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'received', label: 'New' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const LIMIT = 25;

export default function AdminList() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await api.adminList({ status, category, q, page, limit: LIMIT }));
    } catch (err) {
      if (err.status === 401) {
        clearAdminKey();
        navigate('/admin', { replace: true });
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status, category, q, page, navigate]);

  // Debounced so typing in the search box doesn't fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(load, q ? 250 : 0);
    return () => clearTimeout(timer);
  }, [load, q]);

  const totalPages = Math.max(1, Math.ceil(data.total / LIMIT));

  function changeFilter(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink-900">Applications</h1>
          <p className="text-sm text-ink-600/70">{data.total} total</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/content" className="btn-ghost !py-1.5 !text-xs">
            Content
          </Link>
          <Link to="/admin/checkins" className="btn-ghost !py-1.5 !text-xs">
            ✓ Check-ins
          </Link>
          <Link to="/admin/checkin" className="btn-primary !py-1.5 !text-xs">
            📷 Check-in scanner
          </Link>
          <button
            type="button"
            onClick={() => {
              clearAdminKey();
              navigate('/admin', { replace: true });
            }}
            className="btn-ghost !py-1.5 !text-xs"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => changeFilter(setStatus)(tab.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              status === tab.value
                ? 'bg-ink-900 text-white'
                : 'border border-ink-200 bg-white text-ink-800 hover:bg-ink-50'
            }`}
          >
            {tab.label}
          </button>
        ))}

        <select
          value={category}
          onChange={(e) => changeFilter(setCategory)(e.target.value)}
          className="input ml-auto !w-auto !py-1.5 !text-xs"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>

        <input
          value={q}
          onChange={(e) => changeFilter(setQ)(e.target.value)}
          placeholder="Search name, email or ID"
          className="input !w-56 !py-1.5 !text-xs"
        />
      </div>

      {error && (
        <p className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-ink-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-600/70">
            <tr>
              <th className="px-4 py-3">Registration</th>
              <th className="px-4 py-3">Name</th>
              <th className="hidden px-4 py-3 sm:table-cell">Category</th>
              <th className="hidden px-4 py-3 md:table-cell">Submitted</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-600/60">
                  Loading…
                </td>
              </tr>
            )}

            {!loading && !data.items.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-600/60">
                  No applications match these filters.
                </td>
              </tr>
            )}

            {!loading &&
              data.items.map((item) => (
                <tr key={item.registrationId} className="transition hover:bg-ink-50/50">
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/applications/${item.registrationId}`}
                      className="font-mono text-xs font-semibold text-brand-600 hover:underline"
                    >
                      {item.registrationId}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-900">{item.fullName}</p>
                    <p className="text-xs text-ink-600/70">{item.email}</p>
                  </td>
                  <td className="hidden px-4 py-3 capitalize sm:table-cell">{item.category}</td>
                  <td className="hidden px-4 py-3 text-xs text-ink-600/70 md:table-cell">
                    {new Date(item.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-ghost !py-1.5 !text-xs"
          >
            Previous
          </button>
          <span className="text-xs text-ink-600/70">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="btn-ghost !py-1.5 !text-xs"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
