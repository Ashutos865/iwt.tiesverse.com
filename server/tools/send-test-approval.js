/**
 * Send one real approval email to a chosen address, for checking how it looks
 * in an actual inbox.
 *
 *   node tools/send-test-approval.js someone@example.com
 *
 * Uses the live template and the live QR signer, so what arrives is what a
 * delegate would receive. It does NOT touch the registrations store: the
 * record is constructed in memory, so nothing is created, approved or counted.
 * The registration ID is deliberately marked TEST so it cannot be mistaken for
 * a real pass at the door.
 */
import 'dotenv/config';

const to = process.argv[2];
if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
  console.error('Usage: node tools/send-test-approval.js someone@example.com');
  process.exit(1);
}

const { sendApprovalEmail } = await import('../src/services/mailService.js');
const qr = await import('../src/services/qrService.js');

// A QR that verifies like a real one, against an id that is obviously a test.
const registrationId = 'IWT26-TEST-00000';
const pass = await qr.issuePass(registrationId);

const record = {
  registrationId,
  fullName: 'Test Delegate',
  email: to,
  category: 'diplomat',
  qr: pass,
};

const sent = await sendApprovalEmail(record);
if (!sent) {
  console.error('Not sent: SES is not configured in this environment.');
  process.exit(1);
}
console.log(`Sent to ${to}`);
console.log(`Registration ID used: ${registrationId}`);
console.log(`QR verifies at: ${pass.verifyUrl}`);
