import crypto from 'node:crypto';
import QRCode from 'qrcode';
import { config } from '../config.js';

/**
 * QR passes encode a verification URL, not the holder's data — so any phone
 * camera works, nothing personal is readable off the badge, and revoking a
 * pass is free (verification is a live lookup against the record).
 *
 * token = base64url(registrationId).base64url(HMAC-SHA256(registrationId))
 */

const b64url = (buf) => Buffer.from(buf).toString('base64url');

function sign(registrationId) {
  return crypto.createHmac('sha256', config.qrSecret).update(registrationId).digest();
}

export function signToken(registrationId) {
  return `${b64url(registrationId)}.${b64url(sign(registrationId))}`;
}

/** Returns the registrationId if the signature holds, otherwise null. */
export function verifyToken(token) {
  const [idPart, sigPart] = String(token || '').split('.');
  if (!idPart || !sigPart) return null;

  let registrationId;
  let presented;
  try {
    registrationId = Buffer.from(idPart, 'base64url').toString('utf8');
    presented = Buffer.from(sigPart, 'base64url');
  } catch {
    return null;
  }

  const expected = sign(registrationId);
  if (presented.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(presented, expected)) return null;
  return registrationId;
}

export function verifyUrlFor(token) {
  return `${config.publicBaseUrl}/verify/${token}`;
}

/** Builds the full pass: signed token, its URL, and a PNG data-URL of the QR. */
export async function issuePass(registrationId) {
  const token = signToken(registrationId);
  const verifyUrl = verifyUrlFor(token);
  const dataUrl = await QRCode.toDataURL(verifyUrl, {
    errorCorrectionLevel: 'M',
    width: 360,
    margin: 1,
    color: { dark: '#0f333b', light: '#ffffff' },
  });
  return { token, verifyUrl, dataUrl };
}
