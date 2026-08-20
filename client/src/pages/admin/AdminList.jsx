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

/*
 * Agenda PDF downloads.
 *
 * Sits on the applications page rather than behind its own route: it is one
 * number the secretariat glances at, and a whole screen for it would be a
 * screen nobody opens. Fails quietly — a stats outage must not break the list
 * this page exists to show.
 */
function DownloadStats() {
  const [stats, setStats] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    api.downloadStats()
      .then((d) => { if (alive) setStats(d); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, []);

  if (failed || !stats) return null;

  const recent = (stats.byDay || []).slice(-7);
  const peak = Math.max(1, ...recent.map((d) => d.count));

  return (
    <section className="mb-6 rounded-card border border-ink-200 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-sm font-semibold text-ink-900">Agenda downloads</h2>
        <p className="text-xs text-ink-500">
          <span className="font-bold text-ink-900">{stats.total}</span> total
          {stats.today > 0 && <> · <span className="font-bold text-teal-700">{stats.today}</span> today</>}
        </p>
      </div>

      {/*
         A single day of data drew one bar the width of the card, which reads
         as a filled block rather than a chart. Bars are capped so a sparse
         history still looks like a series, and the row stays left-aligned so
         days accumulate rightwards as they arrive.
      */}
      {recent.length > 0 && (
        <div className="mt-4 flex items-end gap-1.5" aria-hidden="true">
          {recent.map((d) => (
            <div key={d.date} className="w-10 shrink-0">
              <div
                className="rounded-t bg-teal-400"
                style={{ height: `${Math.max(4, (d.count / peak) * 44)}px` }}
                title={`${d.date}: ${d.count}`}
              />
              <p className="mt-1 text-center text-[10px] text-ink-500">{d.date.slice(8)}</p>
            </div>
          ))}
        </div>
      )}

      {(stats.byReferrer || []).length > 0 && (
        <p className="mt-3 text-xs text-ink-500">
          Top sources: {stats.byReferrer.slice(0, 3).map((r) => `${r.source} (${r.count})`).join(' · ')}
        </p>
      )}
    </section>
  );
}

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
      <DownloadStats />

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
                ? 'bg-teal-900 text-white'
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
                      className="font-mono text-xs font-semibold text-teal-700 hover:underline"
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
