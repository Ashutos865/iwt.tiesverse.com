import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { init } from './repositories/registrationRepository.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import registrationRoutes from './routes/registrations.js';
import adminRoutes from './routes/admin.js';
import verifyRoutes from './routes/verify.js';

const app = express();

app.use(cors());
app.use(express.json());

// Uploads are served by unguessable filename only — see the README security note.
app.use('/uploads', express.static(config.uploadsPath, { maxAge: '1d' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/verify', verifyRoutes);

app.use('/api', notFound);
app.use(errorHandler);

await init();

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
  console.error('[iwt] Something else is holding it — an earlier instance of this');
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
