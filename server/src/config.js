import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(here, '..');

dotenv.config({ path: path.join(serverRoot, '.env') });

export const config = {
  port: Number(process.env.PORT) || 5000,
  adminPassword: process.env.ADMIN_PASSWORD || 'iwt-admin-2026',
  qrSecret: process.env.QR_SECRET || 'dev-only-insecure-secret',
  publicBaseUrl: (process.env.PUBLIC_BASE_URL || 'http://localhost:5173').replace(/\/$/, ''),
  dataPath: path.join(serverRoot, 'data', 'db.json'),
  uploadsPath: path.join(serverRoot, 'uploads'),
  maxFileBytes: 5 * 1024 * 1024,

  // 'dataapi' stores registrations in the TiesVerse Data API; 'json' keeps them
  // in server/data/db.json. Defaults to dataapi once a key is configured, so a
  // deployment that has not been given one still starts.
  storage: (process.env.STORAGE || (process.env.DATA_API_ADMIN_KEY ? 'dataapi' : 'json')).toLowerCase(),

  // If the Data API is unreachable at boot, fall back to local JSON rather than
  // refusing to start. Registration staying open matters more than where the
  // rows land; the log says loudly which one is in use.
  storageFallback: String(process.env.STORAGE_FALLBACK ?? 'true').toLowerCase() !== 'false',

  // Require a verified email before a registration is accepted. Off by default:
  // turning it on mid-event would reject applicants who are part-way through a
  // form they started before the change.
  requireEmailOtp: String(process.env.REQUIRE_EMAIL_OTP ?? 'false').toLowerCase() === 'true',

  dataApi: {
    baseUrl: (process.env.DATA_API_URL || 'https://admin.tiesverse.com').replace(/\/$/, ''),
    slug: process.env.DATA_API_SLUG || 'iwt-summit-2026',
    adminKey: process.env.DATA_API_ADMIN_KEY || '',
    // Origin-locked keys are validated against this; it must match one of the
    // origins the key was issued for.
    origin: process.env.DATA_API_ORIGIN || '',
  },
};
