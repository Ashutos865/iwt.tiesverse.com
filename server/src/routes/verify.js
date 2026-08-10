import { Router } from 'express';
import * as repo from '../repositories/registrationRepository.js';
import { verifyToken } from '../services/qrService.js';
import { fileUrl } from '../services/registrationService.js';
import { CATEGORY_SCHEMAS } from '../validation/categorySchemas.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

// STAFF ONLY. A badge QR opens /verify/<token> — without the admin key the
// API reveals nothing, so a member of the public scanning a badge with a
// normal camera app learns nothing about the holder.
router.use(adminAuth);

function summary(record) {
  return {
    registrationId: record.registrationId,
    fullName: record.fullName,
    category: record.category,
    categoryLabel: CATEGORY_SCHEMAS[record.category]?.label || record.category,
    organisation:
      record.data.organisation || record.data.mediaHouse || record.data.institution
      || record.data.companyName || record.data.orgName || null,
    nationality: record.data.nationality || null,
    photoUrl: fileUrl(record.files.photo || record.files.headshot),
    status: record.status,
    checkedInAt: record.checkedInAt || null,
  };
}

// Always 200 — gate staff should see a red "invalid" card, not an error page.
async function lookup(token) {
  const registrationId = verifyToken(token);
  if (!registrationId) return { valid: false, reason: 'TAMPERED' };

  const record = await repo.findByRegistrationId(registrationId);
  if (!record) return { valid: false, reason: 'NOT_FOUND' };
  if (record.status !== 'approved') {
    return { valid: false, reason: 'NOT_APPROVED', registrationId, status: record.status };
  }
  return { valid: true, record };
}

router.get('/:token', async (req, res, next) => {
  try {
    const out = await lookup(req.params.token);
    if (!out.valid) {
      res.json(out);
      return;
    }
    res.json({ valid: true, registration: summary(out.record) });
  } catch (err) {
    next(err);
  }
});

// Scan-to-check-in: one call verifies AND records entry. Idempotent — a badge
// scanned twice comes back alreadyCheckedIn so the gate sees a duplicate
// warning instead of silently admitting the same badge again (§31.5).
router.post('/:token/checkin', async (req, res, next) => {
  try {
    const out = await lookup(req.params.token);
    if (!out.valid) {
      res.json(out);
      return;
    }
    if (out.record.checkedInAt) {
      res.json({ valid: true, alreadyCheckedIn: true, registration: summary(out.record) });
      return;
    }
    const checkedInAt = new Date().toISOString();
    await repo.update(out.record.registrationId, { checkedInAt });
    res.json({
      valid: true,
      checkedIn: true,
      registration: { ...summary(out.record), checkedInAt },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
