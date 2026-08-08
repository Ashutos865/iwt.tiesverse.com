import { config } from '../config.js';

/**
 * Email verification for registrations, via the TiesVerse OTP API.
 *
 * The applicant asks for a code, types it back, and gets a signed token. The
 * token is checked HERE at submit time rather than trusted from the browser:
 * a client-side "verified" flag proves nothing, since anyone can post directly
 * to the registration endpoint.
 */

const base = () => `${config.dataApi.baseUrl}/api/public/otp`;

async function call(path, body, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${base()}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Origin-checked by CORS on the admin side; a server has no browser
        // origin of its own, so send the one this deployment runs under.
        Origin: config.dataApi.origin || config.publicBaseUrl,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }
    return { ok: res.ok, status: res.status, data: json };
  } finally {
    clearTimeout(timer);
  }
}

/** Send a code to an email address. Returns {ok, status, data}. */
export function sendEmailCode(email) {
  return call('/send/', { channel: 'email', destination: email, purpose: 'registration' });
}

/** Check a code. On success `data.token` is what submit() must be given. */
export function verifyEmailCode(email, code) {
  return call('/verify/', { channel: 'email', destination: email, code, purpose: 'registration' });
}

/**
 * Is this token a real verification of this address?
 *
 * Verified by asking the admin API rather than decoding locally: the signing
 * key lives there, and a token this server could forge would be worthless.
 */
export async function tokenProvesEmail(token, email) {
  if (!token || !email) return false;
  const res = await call('/verify-token/', {
    channel: 'email', destination: email, token, purpose: 'registration',
  });
  return Boolean(res.ok && res.data?.valid);
}

/** Whether email verification is enforced at all (off unless switched on). */
export const isRequired = () => config.requireEmailOtp === true;
