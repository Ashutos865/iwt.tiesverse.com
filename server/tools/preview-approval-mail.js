/**
 * Render the approval email to a file without sending it.
 *
 * Calls the real sendApprovalEmail with the SES transport stubbed, so what is
 * written to disk is exactly what a delegate would receive — not a
 * reconstruction that could drift from the template.
 *
 *   node tools/preview-approval-mail.js [outfile]
 */
import fs from 'node:fs';
import path from 'node:path';

const out = process.argv[2] || path.resolve('preview-approval-mail.html');
const captured = {};

/*
 * These must be set BEFORE config.js is imported — it reads process.env once,
 * at module load. The names are the ones config.js actually looks for; setting
 * anything else leaves the mailer "unconfigured" and it declines to send.
 */
process.env.AWS_SES_ACCESS_KEY_ID = 'preview';
process.env.AWS_SES_SECRET_ACCESS_KEY = 'preview';
process.env.PUBLIC_BASE_URL = 'https://iwtdialogue.tiesverse.com';

// Patch nodemailer before the service imports it, so the captured message is
// the real template output rather than a reconstruction.
const nodemailer = await import('nodemailer');
nodemailer.default.createTransport = () => ({
  sendMail: async (msg) => {
    Object.assign(captured, msg);
    return { messageId: 'preview' };
  },
});

const { sendApprovalEmail } = await import('../src/services/mailService.js');

const record = {
  fullName: 'Dr. Anjali Rao',
  registrationId: 'IWT26-ACA-00042',
  category: 'academic',
  email: 'delegate@example.com',
  qr: null,
};

await sendApprovalEmail(record);

if (!captured.html) {
  console.error('No mail captured — the transport stub did not take effect.');
  process.exit(1);
}

fs.writeFileSync(out, `<body style="background:#f4f6f8;padding:24px;margin:0">${captured.html}</body>`);
console.log('subject:', captured.subject);
console.log('from   :', captured.from);
console.log('html   :', out);
console.log('');
console.log('--- plain text part ---');
console.log(captured.text);
