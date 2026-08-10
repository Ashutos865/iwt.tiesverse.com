/**
 * Transactional mail via the same AWS SES account the admin backend uses —
 * same verified domain, same deliverability. Unconfigured deployments log and
 * carry on: an approval must never fail because the mailer is down.
 */
import { config } from '../config.js';
import { CATEGORY_SCHEMAS } from '../validation/categorySchemas.js';

let transporterPromise = null;

async function transporter() {
  if (!config.ses.accessKeyId || !config.ses.secretAccessKey) return null;
  if (!transporterPromise) {
    transporterPromise = (async () => {
      const [{ default: nodemailer }, ses] = await Promise.all([
        import('nodemailer'),
        import('@aws-sdk/client-ses'),
      ]);
      const client = new ses.SESClient({
        region: config.ses.region,
        credentials: {
          accessKeyId: config.ses.accessKeyId,
          secretAccessKey: config.ses.secretAccessKey,
        },
      });
      return nodemailer.createTransport({ SES: { ses: client, aws: ses } });
    })();
  }
  return transporterPromise;
}

const EVENT = {
  name: 'Indus Water Treaty Dialogue 2026',
  dates: '19–20 September 2026',
  venue: 'Bharat Mandapam, New Delhi',
};

/** "Your pass is approved" — QR inline, all the details needed at the gate. */
export async function sendApprovalEmail(record) {
  const t = await transporter();
  if (!t) {
    console.warn('[mail] SES not configured — approval email NOT sent to', record.email);
    return false;
  }

  const label = CATEGORY_SCHEMAS[record.category]?.label || record.category;
  const statusUrl = `${config.publicBaseUrl}/status`;
  const qrPng = record.qr?.dataUrl
    ? Buffer.from(record.qr.dataUrl.split(',')[1], 'base64')
    : null;

  const html = `
  <div style="margin:0 auto;max-width:560px;font-family:Arial,Helvetica,sans-serif;color:#172433">
    <div style="background:#03182E;border-radius:8px 8px 0 0;padding:22px 28px">
      <p style="margin:0;color:#2396D3;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:bold">${EVENT.name}</p>
      <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px">Your pass is approved</h1>
    </div>
    <div style="border:1px solid #DCE4EB;border-top:0;border-radius:0 0 8px 8px;padding:26px 28px">
      <p style="font-size:15px;line-height:1.6">Dear ${record.fullName},</p>
      <p style="font-size:15px;line-height:1.6">
        Your ${label.toLowerCase()} application has been approved. Your entry pass is below —
        it will be scanned at the venue.
      </p>

      <table style="width:100%;border-collapse:collapse;margin:18px 0;font-size:14px">
        <tr><td style="padding:6px 0;color:#6D7B89;width:150px">Registration ID</td>
            <td style="padding:6px 0;font-family:monospace;font-weight:bold">${record.registrationId}</td></tr>
        <tr><td style="padding:6px 0;color:#6D7B89">Category</td><td style="padding:6px 0">${label}</td></tr>
        <tr><td style="padding:6px 0;color:#6D7B89">Dates</td><td style="padding:6px 0">${EVENT.dates}</td></tr>
        <tr><td style="padding:6px 0;color:#6D7B89">Venue</td><td style="padding:6px 0">${EVENT.venue}</td></tr>
      </table>

      ${qrPng ? `
      <div style="text-align:center;margin:22px 0">
        <img src="cid:qrpass" alt="Your entry QR pass" width="220" height="220"
             style="border:1px solid #DCE4EB;border-radius:8px" />
        <p style="font-size:12px;color:#6D7B89;margin:8px 0 0">Show this QR at badge collection.</p>
      </div>` : ''}

      <div style="background:#EEF7FC;border-radius:6px;padding:14px 16px;font-size:13.5px;line-height:1.6">
        <strong>At the venue:</strong> badge collection opens 08:00 on both days at the
        registration desk. Bring this QR <strong>and the photo ID used in your application</strong> —
        the QR alone is not sufficient. The pass is personal and non-transferable.
      </div>

      <p style="font-size:14px;line-height:1.6;margin-top:18px">
        You can retrieve your pass any time from
        <a href="${statusUrl}" style="color:#1577B8">${statusUrl}</a>
        using this email address and your registration ID.
      </p>

      <p style="font-size:13px;color:#6D7B89;margin-top:22px">
        Indus Water Treaty Dialogue Secretariat · New Delhi<br/>
        This mailbox is not monitored — for help, use the contact details on the website.
      </p>
    </div>
  </div>`;

  const text = [
    `Dear ${record.fullName},`,
    '',
    `Your ${label.toLowerCase()} application for the ${EVENT.name} has been approved.`,
    '',
    `Registration ID: ${record.registrationId}`,
    `Category: ${label}`,
    `Dates: ${EVENT.dates}`,
    `Venue: ${EVENT.venue}`,
    '',
    'Your QR pass is attached. Badge collection opens 08:00 on both days —',
    'bring the QR and the photo ID used in your application.',
    '',
    `Retrieve your pass any time: ${statusUrl}`,
  ].join('\n');

  await t.sendMail({
    from: `"${EVENT.name}" <${config.ses.fromEmail}>`,
    to: record.email,
    subject: `Pass approved — ${EVENT.name} (${record.registrationId})`,
    text,
    html,
    attachments: qrPng
      ? [{ filename: `pass-${record.registrationId}.png`, content: qrPng, cid: 'qrpass' }]
      : [],
  });
  return true;
}
