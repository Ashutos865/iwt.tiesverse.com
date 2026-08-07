import crypto from 'node:crypto';
import { config } from '../config.js';

/**
 * Shared-password auth. Deliberately simple for now: the admin panel sits
 * behind an unlisted URL and there is one operator. Per-admin accounts and
 * real sessions are a later phase — see the README security note.
 */
export function checkPassword(candidate) {
  const a = Buffer.from(String(candidate || ''));
  const b = Buffer.from(config.adminPassword);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function adminAuth(req, res, next) {
  if (!checkPassword(req.headers['x-admin-key'])) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Admin key missing or invalid.' } });
    return;
  }
  next();
}
