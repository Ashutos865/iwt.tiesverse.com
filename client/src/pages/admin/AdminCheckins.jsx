import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { CATEGORIES } from '../../lib/constants.js';

const label = (slug) => CATEGORIES.find((c) => c.slug === slug)?.label || slug;

const fmt = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });

/** The check-in register: who has entered, when — refreshes itself while the
 *  gate is scanning, and exports to CSV for the records. */
export default function AdminCheckins() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);

  const load = useCallback(async () => {
    try {
      setData(await api.adminCheckins());
      setError('');
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);   // live-ish while the gate is busy
    return () => clearInterval(t);
  }, [load]);

  const exportCsv = () => {
    const rows = [
      ['Registration ID', 'Name', 'Category', 'Email', 'Checked in at'],
      ...data.items.map((r) => [
        r.registrationId, r.fullName, label(r.category), r.email,
        new Date(r.checkedInAt).toLocaleString('en-IN'),
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `iwt-checkins-${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Attendance</p>
          <h1 className="font-display text-2xl text-ink-900">Check-ins</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/checkin" className="btn-primary !py-1.5 !text-xs">📷 Scanner</Link>
          <Link to="/admin/applications" className="btn-ghost !py-1.5 !text-xs">Applications</Link>
        </div>
      </div>

      {error && <p className="error-text mt-4">{error}</p>}
      {!data && !error && <p className="mt-8 text-sm text-ink-500">Loading…</p>}

      {data && (
        <>
          {/* Gate counters */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-sm">
            <div className="card !p-4 text-center">
              <p className="font-display text-3xl font-semibold text-ok">{data.checkedIn}</p>
              <p className="text-xs uppercase tracking-wide text-ink-500">Checked in</p>
            </div>
            <div className="card !p-4 text-center">
              <p className="font-display text-3xl font-semibold text-ink-900">{data.approved}</p>
              <p className="text-xs uppercase tracking-wide text-ink-500">Approved total</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-ink-500">
              {updatedAt && <>Updated {updatedAt.toLocaleTimeString()} · refreshes every 30s</>}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={load} className="btn-ghost !min-h-[36px] !py-1 !text-xs">↺ Refresh</button>
              <button
                type="button"
                onClick={exportCsv}
                disabled={!data.items.length}
                className="btn-dark !min-h-[36px] !py-1 !text-xs"
              >
                ⬇ Export CSV
              </button>
            </div>
          </div>

          {data.items.length === 0 ? (
            <div className="card mt-4 text-center">
              <p className="font-semibold text-ink-900">No one has checked in yet.</p>
              <p className="mt-1 text-sm text-ink-700">
                Entries appear here the moment a badge is scanned at the gate.
              </p>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-card border border-ink-200 bg-white">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-200 text-xs uppercase tracking-wide text-ink-500">
                    <th className="px-4 py-3">Checked in</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Registration ID</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {data.items.map((r) => (
                    <tr key={r.registrationId}>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums text-ok">
                        {fmt(r.checkedInAt)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-ink-900">{r.fullName}</td>
                      <td className="px-4 py-3 text-ink-700">{label(r.category)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-ink-700">{r.registrationId}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/admin/applications/${encodeURIComponent(r.registrationId)}`}
                          className="btn-text !min-h-0 text-xs"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
