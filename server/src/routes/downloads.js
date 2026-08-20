import { Router } from 'express';
import * as repo from '../repositories/contentRepository.js';
import * as downloads from '../repositories/downloadRepository.js';
import { streamAgendaPdf } from '../services/agendaPdfService.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { SUMMIT_FALLBACK } from '../content/summitFallback.js';

const router = Router();

const isPublished = (item) => item?.published !== false && item?.published !== 'false';
const byOrder = (a, b) =>
  (Number(a.order) || 0) - (Number(b.order) || 0)
  || String(a.start || '').localeCompare(String(b.start || ''));

/**
 * The agenda as a PDF.
 *
 * Public: the running order is already on the page, so requiring a sign-in to
 * take a copy of it would only stop people sharing the event.
 *
 * The download is recorded before the file streams, but a tracking failure is
 * swallowed inside the repository — somebody asking for the agenda must get it
 * even if the counter is unavailable.
 */
router.get('/agenda.pdf', async (req, res, next) => {
  try {
    let sessions = [];
    try {
      const all = await repo.list();
      sessions = all.filter((i) => i.kind === 'session' && isPublished(i)).sort(byOrder);
    } catch {
      sessions = [];
    }
    // The store holds only what the admin has entered; before anything is
    // entered it is empty, and an empty PDF would be worse than the bundled
    // programme the site itself falls back to.
    if (!sessions.length) sessions = SUMMIT_FALLBACK.sessions;

    downloads.record({ document: 'agenda', referrer: req.get('referer') || '' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Indus-Waters-Treaty-Dialogue-Agenda.pdf"',
    );
    // The programme can change in the admin at any time, so a cached copy would
    // hand out a stale schedule.
    res.setHeader('Cache-Control', 'no-store');

    streamAgendaPdf(res, { sessions, summit: SUMMIT_FALLBACK.summit });
  } catch (err) {
    next(err);
  }
});

/** Download counts for the admin. */
router.get('/stats', adminAuth, async (_req, res, next) => {
  try {
    res.json(await downloads.stats());
  } catch (err) {
    next(err);
  }
});

export default router;
