/**
 * Editable site content — speakers, sessions, partners, press, FAQ.
 *
 * These used to live in a hardcoded client source file, so every change meant
 * a code edit and a redeploy. They now live beside registrations: in the
 * TiesVerse Data API when configured, otherwise in the local JSON store, using
 * the same fallback rule so content editing never blocks on the Data API.
 *
 * One record per item. `kind` groups them (speaker | session | partner |
 * press | faq); `payload` is the item itself; `order` drives display order.
 */
import { randomUUID } from 'node:crypto';
import { config } from '../config.js';

export const KINDS = ['speaker', 'session', 'partner', 'press', 'faq'];

/* ── Data API backend ─────────────────────────────────────────────────── */
const apiBase = () => `${config.dataApi.baseUrl}/api/data/v1/${config.dataApi.slug}-content`;

async function apiCall(suffix, { method = 'GET', body } = {}) {
  const res = await fetch(`${apiBase()}${suffix}`, {
    method,
    headers: {
      'X-Api-Key': config.dataApi.adminKey,
      Origin: config.dataApi.origin || config.publicBaseUrl,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(json?.error?.message || `Content API ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return json;
}

const fromApiRow = (row) => {
  if (!row) return null;
  const p = row.data?.payload;
  const item = typeof p === 'string' ? JSON.parse(p) : p;
  return item ? { ...item, _recordId: row.id } : null;
};

const toApiRow = (item) => {
  const { _recordId, ...clean } = item;
  return { itemId: clean.id, kind: clean.kind, order: String(clean.order ?? 0), payload: JSON.stringify(clean) };
};

const apiBackend = {
  async init() { await apiCall('/records/?page_size=1'); },
  async list(kind) {
    const qs = kind ? `?where.kind=${encodeURIComponent(kind)}&page_size=500` : '?page_size=500';
    const res = await apiCall(`/records/${qs}`);
    return (res?.results || []).map(fromApiRow).filter(Boolean);
  },
  async create(item) {
    await apiCall('/records/', { method: 'POST', body: toApiRow(item) });
    return item;
  },
  async update(id, patch) {
    const rows = await apiCall(`/records/?where.itemId=${encodeURIComponent(id)}&page_size=1`);
    const current = fromApiRow(rows?.results?.[0]);
    if (!current) return null;
    const merged = { ...current, ...patch, id: current.id, kind: current.kind };
    await apiCall(`/records/${current._recordId}/`, { method: 'PATCH', body: toApiRow(merged) });
    const { _recordId, ...clean } = merged;
    return clean;
  },
  async remove(id) {
    const rows = await apiCall(`/records/?where.itemId=${encodeURIComponent(id)}&page_size=1`);
    const current = fromApiRow(rows?.results?.[0]);
    if (!current) return false;
    await apiCall(`/records/${current._recordId}/`, { method: 'DELETE' });
    return true;
  },
};

/* ── Local JSON backend ───────────────────────────────────────────────── */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const jsonPath = path.join(path.dirname(config.dataPath), 'content.json');
let chain = Promise.resolve();

async function loadJson() {
  try {
    return JSON.parse(await readFile(jsonPath, 'utf8')).items || [];
  } catch {
    return [];
  }
}

function mutateJson(fn) {
  chain = chain.then(async () => {
    const items = await loadJson();
    const out = await fn(items);
    await mkdir(path.dirname(jsonPath), { recursive: true });
    await writeFile(jsonPath, JSON.stringify({ items }, null, 2));
    return out;
  });
  return chain;
}

const jsonBackend = {
  async init() {},
  async list(kind) {
    const items = await loadJson();
    return kind ? items.filter((i) => i.kind === kind) : items;
  },
  create: (item) => mutateJson((items) => { items.push(item); return item; }),
  update: (id, patch) => mutateJson((items) => {
    const found = items.find((i) => i.id === id);
    if (!found) return null;
    Object.assign(found, patch, { id: found.id, kind: found.kind });
    return { ...found };
  }),
  remove: (id) => mutateJson((items) => {
    const at = items.findIndex((i) => i.id === id);
    if (at < 0) return false;
    items.splice(at, 1);
    return true;
  }),
};

/* ── Selection, mirroring the registration repository's rules ─────────── */
let active = jsonBackend;
let backendName = 'json';

export function activeBackend() { return backendName; }

export async function init() {
  if (config.storage === 'dataapi' && config.dataApi.adminKey) {
    try {
      await apiBackend.init();
      active = apiBackend;
      backendName = 'dataapi';
      console.log('[content] TiesVerse Data API');
      return;
    } catch (err) {
      if (!config.storageFallback) throw err;
      console.warn('[content] Data API unavailable, using local JSON —', err.message);
    }
  }
  active = jsonBackend;
  backendName = 'json';
  console.log('[content] local JSON store');
}

export const list = (kind) => active.list(kind);
export const remove = (id) => active.remove(id);
export const update = (id, patch) => active.update(id, patch);

export async function create(kind, payload) {
  const item = {
    id: randomUUID(),
    kind,
    order: Number(payload.order) || 0,
    ...payload,
    createdAt: new Date().toISOString(),
  };
  return active.create(item);
}
