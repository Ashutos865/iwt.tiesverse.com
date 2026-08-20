import { config } from '../config.js';

/**
 * Download tracking for the agenda PDF.
 *
 * Rows live in the same content store as speakers and sessions, under
 * `kind: 'download'`, so there is no second datastore to provision, back up or
 * keep credentials for. The content route filters by kind, so these never leak
 * into the public content feed.
 *
 * One row per download rather than a single incrementing counter: a counter
 * cannot answer "when" or "how many distinct people", and two downloads landing
 * in the same second would race on read-modify-write. Rows only ever append.
 *
 * What is stored is deliberately thin — a timestamp, which document, and a
 * coarse referrer. No IP address and no user agent: the question being answered
 * is "how many people took the agenda", which does not require identifying any
 * of them, and storing less means there is less to protect.
 */

const apiBase = () => `${config.dataApi.baseUrl}/api/data/v1/${config.contentApi.slug}`;

async function call(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${apiBase()}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.contentApi.adminKey,
      Origin: config.dataApi.origin || config.publicBaseUrl,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Data API ${method} ${path} -> ${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Record one download. Never throws to the caller: a tracking failure must not
 * stop somebody getting the file they asked for.
 */
export async function record({ document = 'agenda', referrer = '' } = {}) {
  try {
    await call('/records/', {
      method: 'POST',
      body: {
        data: {
          kind: 'download',
          payload: JSON.stringify({
            kind: 'download',
            document,
            // Host only, not the full URL — enough to tell a share from a
            // direct visit without recording which page somebody was reading.
            referrer: String(referrer || '').replace(/^https?:\/\//, '').split('/')[0].slice(0, 80),
            at: new Date().toISOString(),
          }),
        },
      },
    });
    return true;
  } catch (err) {
    console.error('[downloads] could not record:', err.message);
    return false;
  }
}

/** Totals and a per-day series for the admin. */
export async function stats() {
  const res = await call('/records/?page_size=1000');
  const rows = (res?.results || [])
    .map((row) => {
      const raw = row?.data?.payload;
      try {
        const rec = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return rec && rec.kind === 'download' ? rec : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const byDay = {};
  const byReferrer = {};
  for (const r of rows) {
    const day = String(r.at || '').slice(0, 10);
    if (day) byDay[day] = (byDay[day] || 0) + 1;
    const ref = r.referrer || 'direct';
    byReferrer[ref] = (byReferrer[ref] || 0) + 1;
  }

  const days = Object.keys(byDay).sort();
  return {
    total: rows.length,
    today: byDay[new Date().toISOString().slice(0, 10)] || 0,
    byDay: days.map((d) => ({ date: d, count: byDay[d] })),
    byReferrer: Object.entries(byReferrer)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  };
}
