import { Router } from 'express';
import { adminAuth, checkPassword } from '../middleware/adminAuth.js';
import * as repo from '../repositories/registrationRepository.js';
import * as service from '../services/registrationService.js';

const router = Router();

// Unauthenticated on purpose — this is how the login screen tests a password
// before storing it. It reveals nothing beyond whether the password is right.
router.post('/login', (req, res) => {
  if (!checkPassword(req.body?.password)) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Incorrect password.' } });
    return;
  }
  res.json({ ok: true });
});

router.use(adminAuth);

router.get('/registrations', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
    res.json(
      await repo.list({
        status: req.query.status || undefined,
        category: req.query.category || undefined,
        q: req.query.q || undefined,
        page,
        limit,
      }),
    );
  } catch (err) {
    next(err);
  }
});

router.get('/registrations/:registrationId', async (req, res, next) => {
  try {
    res.json(await service.adminDetail(req.params.registrationId));
  } catch (err) {
    next(err);
  }
});

router.post('/registrations/:registrationId/review', async (req, res, next) => {
  try {
    res.json(await service.markUnderReview(req.params.registrationId));
  } catch (err) {
    next(err);
  }
});

router.post('/registrations/:registrationId/approve', async (req, res, next) => {
  try {
    res.json(await service.approve(req.params.registrationId));
  } catch (err) {
    next(err);
  }
});

router.post('/registrations/:registrationId/reject', async (req, res, next) => {
  try {
    res.json(await service.reject(req.params.registrationId, req.body?.reason));
  } catch (err) {
    next(err);
  }
});

export default router;
