import { Router } from 'express';
import { uploadRegistrationFiles } from '../middleware/upload.js';
import * as service from '../services/registrationService.js';
import { CATEGORY_SCHEMAS } from '../validation/categorySchemas.js';
import * as otp from '../services/otpService.js';

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
/* Email verification. Rate limiting, expiry and attempt caps all live in the
   OTP service; this is a thin pass-through so the browser never talks to the
   admin API directly. */
router.post('/verify/send', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim();
    if (!email) throw new service.AppError(400, 'BAD_EMAIL', 'Enter your email address.');
    const out = await otp.sendEmailCode(email);
    if (!out.ok) {
      throw new service.AppError(out.status || 502, 'OTP_SEND',
        out.data?.error || 'Could not send the code. Please try again.');
    }
    res.json({
      sent: true,
      destination: out.data?.destination,
      expiresIn: out.data?.expires_in,
      resendIn: out.data?.resend_in,
    });
  } catch (err) { next(err); }
});

router.post('/verify/check', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim();
    const code = String(req.body?.code || '').trim();
    const out = await otp.verifyEmailCode(email, code);
    if (!out.ok) {
      throw new service.AppError(out.status || 400, 'OTP_INVALID',
        out.data?.error || 'That code is not right.');
    }
    // The token is what submit() will demand; the browser only carries it.
    res.json({ verified: true, token: out.data?.token });
  } catch (err) { next(err); }
});

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

    // Checked here, not in the browser: a client-side "verified" flag proves
    // nothing when anyone can post straight to this endpoint.
    if (otp.isRequired()) {
      const proven = await otp.tokenProvesEmail(req.body.emailToken, data.email);
      if (!proven) {
        throw new service.AppError(403, 'EMAIL_NOT_VERIFIED',
          'Please verify your email address before submitting.');
      }
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
