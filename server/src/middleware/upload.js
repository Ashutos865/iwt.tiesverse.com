import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import multer from 'multer';
import { config } from '../config.js';
import { ALL_FILE_FIELDS } from '../validation/categorySchemas.js';

fs.mkdirSync(config.uploadsPath, { recursive: true });

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadsPath),
  filename: (_req, file, cb) => {
    // Never reuse originalname — it can carry path separators and characters
    // Windows rejects. Keep only a short sanitised extension.
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '').slice(0, 8);
    cb(null, `${crypto.randomBytes(12).toString('hex')}${ext || '.bin'}`);
  },
});

export const uploadRegistrationFiles = multer({
  storage,
  limits: { fileSize: config.maxFileBytes, files: ALL_FILE_FIELDS.length },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
      return;
    }
    cb(null, true);
  },
}).fields(ALL_FILE_FIELDS.map((name) => ({ name, maxCount: 1 })));
