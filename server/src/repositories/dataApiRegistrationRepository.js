import { config } from '../config.js';

/**
 * Registration store backed by the TiesVerse Data API.
 *
 * Same exports as the JSON repository, so `registrationRepository.js` can point
 * at either one and nothing above it changes.
 *
 * A registration is one record. The whole record travels as a single JSON
 * column (`payload`) rather than one column per field: the seven categories ask
 * different questions, so a flat schema would be mostly-null columns that have
 * to change every time a form does. The fields the server actually queries on —
 * registrationId, email, category, status — are ALSO stored as their own
 * columns so the API can filter server-side instead of paging through
 * everything.
 *
 * The admin key can rewrite any record, so it lives in server env only and is
 * never sent to a browser.
 */

const REQUIRED = ['baseUrl', 'slug', 'adminKey'];

function assertConfigured() {
  const missing = REQUIRED.filter((k) => !config.dataApi?.[k]);
  if (missing.length) {
    throw new Error(
      `Data API storage is selected but not configured: missing ${missing.join(', ')}. ` +
      'Set DATA_API_URL, DATA_API_SLUG and DATA_API_ADMIN_KEY in server/.env, ' +
      'or set STORAGE=json to use local file storage.',
    );
  }
}

const base = () => `${config.dataApi.baseUrl}/api/data/v1/${config.dataApi.slug}`;

async function call(pathSuffix, { method = 'GET', body, timeoutMs = 15000 } = {}) {
  assertConfigured();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${base()}${pathSuffix}`, {
      method,
      headers: {
        'X-Api-Key': config.dataApi.adminKey,
        // Origin-locked keys are checked against this; a server has no browser
        // origin of its own, so we send the one the key was issued for.
        Origin: config.dataApi.origin || config.publicBaseUrl,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }
    if (!res.ok) {
      const detail = json?.error || text.slice(0, 200) || res.statusText;
      const err = new Error(`Data API ${method} ${pathSuffix} failed (${res.status}): ${detail}`);
      err.status = res.status;
      // A rejected write is the applicant's problem to fix (a field too long, a
      // file too big), so let them read why instead of "Something went wrong".
      // 5xx stays hidden: that is ours, and may name internals.
      if (res.status >= 400 && res.status < 500) {
        err.expose = true;
        err.code = 'STORAGE_REJECTED';
        err.message = typeof detail === 'string' ? detail : JSON.stringify(detail);
      }
      throw err;
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

/* The record as the rest of the server knows it, reassembled from a stored row.
   `_recordId` is the Data API's own id, which `update` needs to address a PATCH
   and which nothing above the repository should care about. */
function fromRow(row) {
  if (!row) return null;
  const payload = row.data?.payload;
  const record = typeof payload === 'string' ? JSON.parse(payload) : payload;
  if (!record) return null;
  return { ...record, _recordId: row.id };
}

/* Query columns are duplicated out of the record so the API can filter on them.
   The record itself stays the single source of truth. */
function toRow(record) {
  const { _recordId, ...clean } = record;
  return {
    registrationId: clean.registrationId,
    email: String(clean.email || '').toLowerCase(),
    category: clean.category,
    status: clean.status,
    submittedAt: clean.timestamps?.submittedAt || new Date().toISOString(),
    payload: JSON.stringify(clean),
  };
}

async function findOne(filters) {
  const qs = Object.entries(filters)
    .map(([k, v]) => `where.${k}=${encodeURIComponent(v)}`)
    .join('&');
  const res = await call(`/records/?${qs}&page_size=1`);
  return fromRow(res?.results?.[0]);
}

export async function init() {
  assertConfigured();
  // Fail loudly at boot rather than on the first applicant's submission.
  await call('/records/?page_size=1');
}

/**
 * Draws a registration number from the store's own atomic counter, then writes
 * the record. The counter is a single database statement, so two submissions
 * arriving together cannot be handed the same number.
 *
 * If the write fails the number is handed back, so a refused attempt does not
 * burn an id. Without this a busy moment left the counter far ahead of the real
 * number of applicants: 200 people arriving at once consumed 200 numbers even
 * though only some of them registered.
 */
export async function createWithId(prefix, build) {
  const seq = await call('/sequence/', { method: 'POST', body: { name: prefix } });
  const registrationId = `IWT26-${prefix}-${String(seq.value).padStart(5, '0')}`;
  const record = build(registrationId);

  try {
    const created = await call('/records/', { method: 'POST', body: toRow(record) });
    return { ...record, _recordId: created?.id };
  } catch (err) {
    // Best effort: the applicant's error is what matters, so a failed release
    // must not replace it with a different one.
    try {
      await call('/sequence/', {
        method: 'POST',
        body: { name: prefix, release: seq.value },
      });
    } catch {
      /* the number stays spent; ids remain unique, the sequence just skips one */
    }
    throw err;
  }
}

export async function findByRegistrationId(registrationId) {
  return findOne({ registrationId });
}

export async function findByEmailAndId(email, registrationId) {
  const record = await findOne({ registrationId });
  if (!record) return null;
  const wanted = String(email || '').trim().toLowerCase();
  return record.email?.toLowerCase() === wanted ? record : null;
}

/** Any application from this email in this category that wasn't rejected. */
export async function findExisting(email, category) {
  const wanted = String(email || '').trim().toLowerCase();
  const res = await call(
    `/records/?where.email=${encodeURIComponent(wanted)}&where.category=${encodeURIComponent(category)}&page_size=50`,
  );
  const rows = (res?.results || []).map(fromRow).filter(Boolean);
  return rows.find((r) => r.status !== 'rejected') || null;
}

export async function list({ status, category, q, page = 1, limit = 25 } = {}) {
  const params = [`page=${page}`, `page_size=${limit}`];
  if (status) params.push(`where.status=${encodeURIComponent(status)}`);
  if (category) params.push(`where.category=${encodeURIComponent(category)}`);
  if (q) params.push(`q=${encodeURIComponent(q)}`);

  const res = await call(`/records/?${params.join('&')}`);
  const items = (res?.results || []).map(fromRow).filter(Boolean).map((r) => ({
    registrationId: r.registrationId,
    fullName: r.fullName,
    email: r.email,
    category: r.category,
    status: r.status,
    submittedAt: r.timestamps.submittedAt,
  }));
  return { items, total: res?.count ?? items.length, page, limit };
}

/** Shallow-merges `patch` into the record (nested `timestamps`/`decision` merge too). */
export async function update(registrationId, patch) {
  const current = await findByRegistrationId(registrationId);
  if (!current) return null;

  const merged = {
    ...current,
    ...patch,
    timestamps: { ...current.timestamps, ...(patch.timestamps || {}) },
    decision: { ...current.decision, ...(patch.decision || {}) },
  };
  await call(`/records/${current._recordId}/`, { method: 'PATCH', body: toRow(merged) });
  return merged;
}

export async function count() {
  const res = await call('/records/?page_size=1');
  return res?.count ?? 0;
}
