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
app.listen(config.port, () => {
  console.log(`[iwt] API listening on http://localhost:${config.port}`);
  console.log(`[iwt] QR passes will point at ${config.publicBaseUrl}/verify/...`);
});
