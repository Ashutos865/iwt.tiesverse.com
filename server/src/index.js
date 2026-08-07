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

const server = app.listen(config.port, () => {
  console.log(`[iwt] API listening on http://localhost:${config.port}`);
  console.log(`[iwt] QR passes will point at ${config.publicBaseUrl}/verify/...`);
});

/* A port clash is the most common way this fails to start — an earlier run, or
   a --watch restart racing its own shutdown. Say what to do about it rather
   than printing a raw stack trace. */
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('');
    console.error(`[iwt] Port ${config.port} is already in use.`);
    console.error('[iwt] Something else is already running there — most likely an');
    console.error('[iwt] earlier instance of this server. Stop it, or set PORT in');
    console.error('[iwt] server/.env to a free port.');
    console.error('');
    console.error(`[iwt]   npx kill-port ${config.port}`);
    console.error('');
    process.exit(1);
  }
  throw err;
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
