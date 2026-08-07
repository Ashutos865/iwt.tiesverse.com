import { Router } from 'express';
import { uploadRegistrationFiles } from '../middleware/upload.js';
import * as service from '../services/registrationService.js';
import { CATEGORY_SCHEMAS } from '../validation/categorySchemas.js';

const router = Router();

/** multer .fields() yields arrays; collapse to one file per field name. */
const flattenFiles = (files = {}) =>
  Object.fromEntries(Object.entries(files).map(([field, list]) => [field, list?.[0] || null]));

router.get('/categories', (_req, res) => {
  res.json({
    categories: Object.entries(CATEGORY_SCHEMAS).map(([slug, s]) => ({
      slug,
      label: s.label,
      prefix: s.prefix,
    })),
  });
});

// Text values arrive as one JSON string in `data` so multipart never coerces
// numbers, booleans or arrays into strings.
router.post('/', uploadRegistrationFiles, async (req, res, next) => {
  try {
    const category = String(req.body.category || '').trim();

    let data;
    try {
      data = JSON.parse(req.body.data || '{}');
    } catch {
      throw new service.AppError(400, 'BAD_PAYLOAD', 'The `data` field must be valid JSON.');
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new service.AppError(400, 'BAD_PAYLOAD', 'The `data` field must be an object.');
    }

    const record = await service.submit({ category, data, files: flattenFiles(req.files) });
    res.status(201).json({
      registrationId: record.registrationId,
      status: record.status,
      submittedAt: record.timestamps.submittedAt,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/status', async (req, res, next) => {
  try {
    const { email, registrationId } = req.query;
    if (!email || !registrationId) {
      throw new service.AppError(400, 'MISSING_PARAMS', 'Provide both your email and registration number.');
    }
    res.json(await service.getStatus(String(email), String(registrationId).trim().toUpperCase()));
  } catch (err) {
    next(err);
  }
});

export default router;
