import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { init } from './repositories/registrationRepository.js';
import { init as initContent } from './repositories/contentRepository.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { checkPassword } from './middleware/adminAuth.js';
import registrationRoutes from './routes/registrations.js';
import adminRoutes from './routes/admin.js';
import verifyRoutes from './routes/verify.js';
import contentRoutes from './routes/content.js';
import downloadRoutes from './routes/downloads.js';

const app = express();

app.use(cors());
app.use(express.json());

// Identity documents (Aadhaar, passports, student IDs) are STAFF ONLY. An
// unguessable filename is not access control: a forwarded link, a browser
// history export or a shared screenshot leaks the document permanently. The
// admin key is required, and these responses must never be cached by shared
// proxies.
app.use(
  '/uploads',
  (req, res, next) => {
    if (!checkPassword(req.headers['x-admin-key'] || req.query.key)) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Staff access only.' } });
      return;
    }
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  },
  express.static(config.uploadsPath, { maxAge: 0 }),
);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/downloads', downloadRoutes);

app.use('/api', notFound);
app.use(errorHandler);

await init();
await initContent();

const server = app.listen(config.port);

server.on('listening', () => {
  console.log(`[iwt] API listening on http://localhost:${config.port}`);
  console.log(`[iwt] QR passes will point at ${config.publicBaseUrl}/verify/...`);
});

/* A port clash is the usual way this fails to start, and it is usually
   transient: --watch starts the replacement before the old process has finished
   releasing the socket. Retry briefly before giving up, so an ordinary file save
   never drops you into "port already in use" for something that clears itself.
   A port genuinely held by another program still fails, with advice. */
const RETRY_MS = 400;
const RETRY_LIMIT = 10;
let retries = 0;

server.on('error', (err) => {
  if (err.code !== 'EADDRINUSE') throw err;

  if (retries < RETRY_LIMIT) {
    retries += 1;
    if (retries === 1) console.log(`[iwt] Port ${config.port} is busy, waiting for it to free…`);
    setTimeout(() => server.listen(config.port), RETRY_MS);
    return;
  }

  console.error('');
  console.error(`[iwt] Port ${config.port} is still in use after ${(RETRY_LIMIT * RETRY_MS) / 1000}s.`);
  console.error('[iwt] Something else is holding it. An earlier instance of this');
  console.error('[iwt] server, or another program. Free it, or set PORT in server/.env.');
  console.error('');
  console.error(`[iwt]   npx kill-port ${config.port}`);
  console.error('');
  process.exit(1);
});

/* --watch sends SIGTERM before restarting. Closing the listener lets the next
   start find the port free instead of colliding with the process it replaces. */
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    // Don't hang on a lingering keep-alive connection.
    setTimeout(() => process.exit(0), 2000).unref();
  });
}
