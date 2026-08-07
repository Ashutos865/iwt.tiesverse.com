import multer from 'multer';
import { config } from '../config.js';

const MULTER_MESSAGES = {
  LIMIT_FILE_SIZE: `File too large — maximum ${config.maxFileBytes / (1024 * 1024)} MB per file.`,
  LIMIT_UNEXPECTED_FILE: 'Unsupported file. Upload a JPG, PNG, WebP or PDF under the size limit.',
};

export function notFound(_req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'No such endpoint.' } });
}

// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity.
export function errorHandler(err, _req, res, _next) {
  if (err instanceof multer.MulterError) {
    res.status(400).json({
      error: {
        code: err.code,
        message: MULTER_MESSAGES[err.code] || 'File upload rejected.',
        field: err.field,
      },
    });
    return;
  }

  console.error('[iwt]', err);
  res.status(err.status || 500).json({
    error: { code: err.code || 'SERVER_ERROR', message: err.expose ? err.message : 'Something went wrong.' },
  });
}
