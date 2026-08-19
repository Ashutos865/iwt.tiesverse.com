/**
 * Site content: public reads, admin writes.
 *
 * Public GET is deliberately unauthenticated — this is the same material the
 * website already shows. Everything that changes it sits behind adminAuth.
 */
import { Router } from 'express';
import * as repo from '../repositories/contentRepository.js';
import { KINDS } from '../repositories/contentRepository.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

/** Required fields per kind, so a half-filled speaker can't reach the site. */
const REQUIRED = {
  speaker: ['name', 'designation'],
  session: ['title', 'day', 'start'],
  partner: ['name', 'tier'],
  press: ['title', 'date'],
  faq: ['q', 'a'],
};

function validate(kind, body) {
  if (!KINDS.includes(kind)) return `Unknown content type: ${kind}`;
  const missing = (REQUIRED[kind] || []).filter((f) => !String(body?.[f] || '').trim());
  return missing.length ? `Missing required field(s): ${missing.join(', ')}` : null;
}

const byOrder = (a, b) =>
  (Number(a.order) || 0) - (Number(b.order) || 0)
  || String(a.createdAt || '').localeCompare(String(b.createdAt || ''));

/*
 * Unpublished rows are withheld from the public feed.
 *
 * The concept note is explicit that everyone named in it is a proposed
 * invitee — "their inclusion reflects suitability, not confirmed
 * participation" — and the Speakers page repeats that promise. So a speaker
 * can be prepared in full in the admin (photo, bio, ordering) and only appears
 * on the site once somebody sets published, which is the moment the
 * secretariat has their confirmation.
 *
 * Absent means published: every row that existed before this flag was added
 * was already public, and treating a missing value as unpublished would have
 * emptied the site on deploy.
 */
const isPublished = (item) => item?.published !== false && item?.published !== 'false';

// Public: everything the site renders, grouped by kind.
router.get('/', async (req, res, next) => {
  try {
    const all = (await repo.list()).filter(isPublished).sort(byOrder);
    const grouped = Object.fromEntries(KINDS.map((k) => [k, all.filter((i) => i.kind === k)]));
    res.json(grouped);
  } catch (err) {
    next(err);
  }
});

/*
 * Admin read: everything, published or not.
 *
 * Declared before the adminAuth mount below would otherwise be unreachable —
 * the public GET '/' above already matched, so this needs its own path.
 */
router.get('/all', adminAuth, async (req, res, next) => {
  try {
    const all = (await repo.list()).sort(byOrder);
    const grouped = Object.fromEntries(KINDS.map((k) => [k, all.filter((i) => i.kind === k)]));
    res.json(grouped);
  } catch (err) {
    next(err);
  }
});

router.use(adminAuth);

router.post('/:kind', async (req, res, next) => {
  try {
    const { kind } = req.params;
    const problem = validate(kind, req.body);
    if (problem) {
      res.status(400).json({ error: { code: 'VALIDATION', message: problem } });
      return;
    }
    res.status(201).json(await repo.create(kind, req.body || {}));
  } catch (err) {
    next(err);
  }
});

router.patch('/:kind/:id', async (req, res, next) => {
  try {
    const updated = await repo.update(req.params.id, req.body || {});
    if (!updated) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'No such item.' } });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:kind/:id', async (req, res, next) => {
  try {
    const gone = await repo.remove(req.params.id);
    if (!gone) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'No such item.' } });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
