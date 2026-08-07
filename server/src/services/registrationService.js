import * as repo from '../repositories/registrationRepository.js';
import { CATEGORY_SCHEMAS, validateSubmission } from '../validation/categorySchemas.js';
import { issuePass } from './qrService.js';

export class AppError extends Error {
  constructor(status, code, message, extra = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.expose = true;
    Object.assign(this, extra);
  }
}

const fileMeta = (file) => ({
  filename: file.filename,
  originalName: file.originalname,
  mimetype: file.mimetype,
  size: file.size,
});

/** `/uploads/<name>` — derived, never stored, so the app can move hosts freely. */
export const fileUrl = (meta) => (meta ? `/uploads/${meta.filename}` : null);

export async function submit({ category, data, files }) {
  const schema = CATEGORY_SCHEMAS[category];
  if (!schema) throw new AppError(400, 'UNKNOWN_CATEGORY', 'That registration category does not exist.');

  const errors = validateSubmission(category, data, files);
  if (Object.keys(errors).length) {
    throw new AppError(422, 'VALIDATION_ERROR', 'Some details are missing or invalid.', { fields: errors });
  }

  const email = String(data.email).trim().toLowerCase();
  const existing = await repo.findExisting(email, category);
  if (existing) {
    throw new AppError(
      409,
      'DUPLICATE',
      `This email already has a ${schema.label} application (${existing.registrationId}).`,
      { registrationId: existing.registrationId },
    );
  }

  // Keep only files this category actually declares, so a stray upload can't
  // attach itself to a record.
  const storedFiles = {};
  for (const field of schema.fileFields) {
    storedFiles[field] = files[field] ? fileMeta(files[field]) : null;
  }

  const { email: _e, fullName: _n, ...rest } = data;

  return repo.createWithId(schema.prefix, (registrationId) => ({
    registrationId,
    category,
    status: 'received',
    email,
    fullName: String(data.fullName).trim(),
    data: rest,
    files: storedFiles,
    timestamps: { submittedAt: new Date().toISOString(), reviewedAt: null, decidedAt: null },
    decision: { by: null, rejectionReason: null },
    qr: null,
  }));
}

export function publicView(record) {
  return {
    registrationId: record.registrationId,
    category: record.category,
    categoryLabel: CATEGORY_SCHEMAS[record.category]?.label || record.category,
    fullName: record.fullName,
    email: record.email,
    status: record.status,
    submittedAt: record.timestamps.submittedAt,
    decidedAt: record.timestamps.decidedAt,
    rejectionReason: record.decision.rejectionReason,
    photoUrl: fileUrl(record.files.photo || record.files.headshot),
    qr: record.status === 'approved' && record.qr
      ? { dataUrl: record.qr.dataUrl, verifyUrl: record.qr.verifyUrl }
      : null,
  };
}

export async function getStatus(email, registrationId) {
  const record = await repo.findByEmailAndId(email, registrationId);
  if (!record) {
    throw new AppError(404, 'NOT_FOUND', 'No application matches that email and registration number.');
  }
  return publicView(record);
}

export async function approve(registrationId) {
  const record = await repo.findByRegistrationId(registrationId);
  if (!record) throw new AppError(404, 'NOT_FOUND', 'No such registration.');
  if (record.status === 'approved') {
    throw new AppError(409, 'ALREADY_DECIDED', 'This application is already approved.');
  }
  if (record.status === 'rejected') {
    throw new AppError(409, 'ALREADY_DECIDED', 'This application was rejected and cannot be approved.');
  }

  const qr = await issuePass(registrationId);
  const updated = await repo.update(registrationId, {
    status: 'approved',
    qr,
    timestamps: { decidedAt: new Date().toISOString() },
    decision: { by: 'admin', rejectionReason: null },
  });
  return publicView(updated);
}

export async function reject(registrationId, reason) {
  const record = await repo.findByRegistrationId(registrationId);
  if (!record) throw new AppError(404, 'NOT_FOUND', 'No such registration.');
  if (record.status === 'approved' || record.status === 'rejected') {
    throw new AppError(409, 'ALREADY_DECIDED', 'This application has already been decided.');
  }

  const updated = await repo.update(registrationId, {
    status: 'rejected',
    timestamps: { decidedAt: new Date().toISOString() },
    decision: { by: 'admin', rejectionReason: String(reason || '').trim() || null },
  });
  return publicView(updated);
}

export async function markUnderReview(registrationId) {
  const record = await repo.findByRegistrationId(registrationId);
  if (!record) throw new AppError(404, 'NOT_FOUND', 'No such registration.');
  if (record.status !== 'received') return publicView(record);

  const updated = await repo.update(registrationId, {
    status: 'under_review',
    timestamps: { reviewedAt: new Date().toISOString() },
  });
  return publicView(updated);
}

/** Full record for the admin detail screen, with upload URLs resolved. */
export async function adminDetail(registrationId) {
  const record = await repo.findByRegistrationId(registrationId);
  if (!record) throw new AppError(404, 'NOT_FOUND', 'No such registration.');
  const files = Object.fromEntries(
    Object.entries(record.files).map(([field, meta]) => [
      field,
      meta ? { ...meta, url: fileUrl(meta) } : null,
    ]),
  );
  return { ...record, categoryLabel: CATEGORY_SCHEMAS[record.category]?.label, files };
}
