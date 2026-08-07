import { Router } from 'express';
import * as repo from '../repositories/registrationRepository.js';
import { verifyToken } from '../services/qrService.js';
import { fileUrl } from '../services/registrationService.js';
import { CATEGORY_SCHEMAS } from '../validation/categorySchemas.js';

const router = Router();

// Always 200 — gate staff should see a red "invalid" card, not an error page.
router.get('/:token', async (req, res, next) => {
  try {
    const registrationId = verifyToken(req.params.token);
    if (!registrationId) {
      res.json({ valid: false, reason: 'TAMPERED' });
      return;
    }

    const record = await repo.findByRegistrationId(registrationId);
    if (!record) {
      res.json({ valid: false, reason: 'NOT_FOUND' });
      return;
    }
    if (record.status !== 'approved') {
      res.json({ valid: false, reason: 'NOT_APPROVED', registrationId, status: record.status });
      return;
    }

    res.json({
      valid: true,
      registration: {
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
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
