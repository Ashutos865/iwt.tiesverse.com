import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';

/**
 * File-backed registration store.
 *
 * The whole db is held in memory; reads never touch disk. Every mutation goes
 * through `mutate()`, which chains onto a single promise so concurrent writes
 * (two submissions, a submission racing an approval) can never interleave a
 * read-modify-write. Persisting writes a temp file then renames over the real
 * one, so a crash mid-write can't leave a half-written db.
 *
 * Swapping this for the TiesVerse Data API later means implementing the same
 * exported methods and changing the one re-export in registrationRepository.js.
 */

const EMPTY_DB = { counters: {}, registrations: [] };

let db = null;
let writeChain = Promise.resolve();

async function load() {
  if (db) return db;
  try {
    const raw = await fs.readFile(config.dataPath, 'utf8');
    const parsed = JSON.parse(raw);
    db = { counters: parsed.counters || {}, registrations: parsed.registrations || [] };
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    db = structuredClone(EMPTY_DB);
    await fs.mkdir(path.dirname(config.dataPath), { recursive: true });
    await persist();
  }
  return db;
}

async function persist() {
  const tmp = `${config.dataPath}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), 'utf8');
  await fs.rename(tmp, config.dataPath);
}

/** Runs `fn` against the in-memory db with no other mutation interleaved. */
function mutate(fn) {
  const run = writeChain.then(async () => {
    await load();
    const result = await fn(db);
    await persist();
    return result;
  });
  // Keep the chain alive even if this mutation rejects.
  writeChain = run.then(() => undefined, () => undefined);
  return run;
}

const clone = (record) => (record ? structuredClone(record) : null);

export async function init() {
  await load();
}

/**
 * Allocates the next id for a category prefix and creates the record in the
 * same mutation, so an id can never be burned without a record behind it.
 * `build(registrationId)` returns the full record to store.
 */
export async function createWithId(prefix, build) {
  return mutate(async (store) => {
    const next = (store.counters[prefix] || 0) + 1;
    const registrationId = `IWT26-${prefix}-${String(next).padStart(5, '0')}`;
    const record = build(registrationId);
    store.counters[prefix] = next;
    store.registrations.push(record);
    return clone(record);
  });
}

export async function findByRegistrationId(registrationId) {
  const store = await load();
  return clone(store.registrations.find((r) => r.registrationId === registrationId));
}

export async function findByEmailAndId(email, registrationId) {
  const store = await load();
  const wanted = String(email || '').trim().toLowerCase();
  return clone(
    store.registrations.find(
      (r) => r.registrationId === registrationId && r.email.toLowerCase() === wanted,
    ),
  );
}

/** Any application from this email in this category that wasn't rejected. */
export async function findExisting(email, category) {
  const store = await load();
  const wanted = String(email || '').trim().toLowerCase();
  return clone(
    store.registrations.find(
      (r) => r.email.toLowerCase() === wanted && r.category === category && r.status !== 'rejected',
    ),
  );
}

export async function list({ status, category, q, page = 1, limit = 25 } = {}) {
  const store = await load();
  const needle = String(q || '').trim().toLowerCase();

  let items = store.registrations.filter((r) => {
    if (status && r.status !== status) return false;
    if (category && r.category !== category) return false;
    if (needle) {
      const haystack = `${r.fullName} ${r.email} ${r.registrationId}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });

  items.sort((a, b) => b.timestamps.submittedAt.localeCompare(a.timestamps.submittedAt));

  const total = items.length;
  const start = (page - 1) * limit;
  const summary = items.slice(start, start + limit).map((r) => ({
    registrationId: r.registrationId,
    fullName: r.fullName,
    email: r.email,
    category: r.category,
    status: r.status,
    submittedAt: r.timestamps.submittedAt,
  }));

  return { items: summary, total, page, limit };
}

/** Shallow-merges `patch` into the record (nested `timestamps`/`decision` merge too). */
export async function update(registrationId, patch) {
  return mutate(async (store) => {
    const record = store.registrations.find((r) => r.registrationId === registrationId);
    if (!record) return null;
    Object.assign(record, patch, {
      timestamps: { ...record.timestamps, ...(patch.timestamps || {}) },
      decision: { ...record.decision, ...(patch.decision || {}) },
    });
    return clone(record);
  });
}

export async function count() {
  const store = await load();
  return store.registrations.length;
}
