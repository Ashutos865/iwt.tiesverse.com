/**
 * Transactional mail via the same AWS SES account the admin backend uses —
 * same verified domain, same deliverability. Unconfigured deployments log and
 * carry on: an approval must never fail because the mailer is down.
 */
import { config } from '../config.js';
import { CATEGORY_SCHEMAS } from '../validation/categorySchemas.js';
import { SUMMIT_FALLBACK } from '../content/summitFallback.js';

let transporterPromise = null;

async function transporter() {
  if (!config.ses.accessKeyId || !config.ses.secretAccessKey) return null;
  if (!transporterPromise) {
    transporterPromise = (async () => {
      const [{ default: nodemailer }, sesv2] = await Promise.all([
        import('nodemailer'),
        import('@aws-sdk/client-sesv2'),
      ]);
      const sesClient = new sesv2.SESv2Client({
        region: config.ses.region,
        credentials: {
          accessKeyId: config.ses.accessKeyId,
          secretAccessKey: config.ses.secretAccessKey,
        },
      });
      return nodemailer.createTransport({
        SES: { sesClient, SendEmailCommand: sesv2.SendEmailCommand },
      });
    })();
  }
  return transporterPromise;
}

/*
 * Event particulars come from the shared constant, not from a copy kept here.
 *
 * The previous version hard-coded its own: it still said "19–20 September
 * 2026" and told people badge collection ran "on both days" long after this
 * became a single-day dialogue, and it opened the desk at 08:00 when the
 * programme starts at 09:00. A delegate could have arrived on the wrong day.
 */
const EVENT = SUMMIT_FALLBACK.summit;

/* Brand palette, matching the site: teal action colour, near-black text. */
const TEAL = '#117E7B';
const TEAL_LIGHT = '#EDFDFC';
const INK = '#272727';
const INK_MUTED = '#5B5B5B';
const RULE = '#E3E7EE';

/** "Your pass is approved" — QR inline, all the details needed at the gate. */
export async function sendApprovalEmail(record) {
  const t = await transporter();
  if (!t) {
    console.warn('[mail] SES not configured — approval email NOT sent to', record.email);
    return false;
  }

  const label = CATEGORY_SCHEMAS[record.category]?.label || record.category;
  const statusUrl = `${config.publicBaseUrl}/status`;
  const agendaUrl = `${config.publicBaseUrl}/agenda`;
  const qrPng = record.qr?.dataUrl
    ? Buffer.from(record.qr.dataUrl.split(',')[1], 'base64')
    : null;

  const html = `
  <div style="margin:0 auto;max-width:560px;font-family:Arial,Helvetica,sans-serif;color:${INK}">
    <div style="background:${TEAL};border-radius:8px 8px 0 0;padding:22px 28px">
      <p style="margin:0;color:#BFF0EE;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:bold">${EVENT.name}</p>
      <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px">Your pass is approved</h1>
    </div>
    <div style="border:1px solid ${RULE};border-top:0;border-radius:0 0 8px 8px;padding:26px 28px">
      <p style="font-size:15px;line-height:1.6">Dear ${record.fullName},</p>
      <p style="font-size:15px;line-height:1.6">
        Your registration as ${/^[aeiou]/i.test(label) ? 'an' : 'a'} ${label.toLowerCase()} has been
        approved. Your entry pass is below — it will be scanned at the venue.
      </p>

      <table style="width:100%;border-collapse:collapse;margin:18px 0;font-size:14px">
        <tr><td style="padding:6px 0;color:${INK_MUTED};width:150px">Registration ID</td>
            <td style="padding:6px 0;font-family:monospace;font-weight:bold">${record.registrationId}</td></tr>
        <tr><td style="padding:6px 0;color:${INK_MUTED}">Category</td><td style="padding:6px 0">${label}</td></tr>
        <tr><td style="padding:6px 0;color:${INK_MUTED}">Date</td>
            <td style="padding:6px 0">${EVENT.date} · ${EVENT.day}</td></tr>
        <tr><td style="padding:6px 0;color:${INK_MUTED}">Venue</td><td style="padding:6px 0">${EVENT.venue}</td></tr>
      </table>

      ${qrPng ? `
      <div style="text-align:center;margin:22px 0">
        <img src="cid:qrpass" alt="Your entry QR pass" width="220" height="220"
             style="border:1px solid ${RULE};border-radius:8px" />
        <p style="font-size:12px;color:${INK_MUTED};margin:8px 0 0">Show this QR at badge collection.</p>
      </div>` : ''}

      <div style="background:${TEAL_LIGHT};border-radius:6px;padding:14px 16px;font-size:13.5px;line-height:1.6">
        <strong>At the venue:</strong> badge collection opens at ${EVENT.doorsOpen}, and the
        programme begins at ${EVENT.programmeStart}. Please bring this QR and a photo ID in your
        own name. The pass is personal and non-transferable.
      </div>

      <p style="font-size:14px;line-height:1.6;margin-top:18px">
        The full running order is at
        <a href="${agendaUrl}" style="color:${TEAL}">${agendaUrl.replace(/^https?:\/\//, '')}</a>,
        and you can retrieve this pass any time from
        <a href="${statusUrl}" style="color:${TEAL}">${statusUrl.replace(/^https?:\/\//, '')}</a>
        using this email address and your registration ID.
      </p>

      <p style="font-size:13px;color:${INK_MUTED};margin-top:22px">
        ${EVENT.name} Secretariat · New Delhi<br/>
        Convened by ${EVENT.organiser}<br/>
        This mailbox is not monitored — for help, use the contact details on the website.
      </p>
    </div>
  </div>`;

  const text = [
    `Dear ${record.fullName},`,
    '',
    `Your registration for the ${EVENT.name} has been approved.`,
    '',
    `Registration ID: ${record.registrationId}`,
    `Category: ${label}`,
    `Date: ${EVENT.date} (${EVENT.day})`,
    `Venue: ${EVENT.venue}`,
    '',
    `Your QR pass is attached. Badge collection opens at ${EVENT.doorsOpen} and the`,
    `programme begins at ${EVENT.programmeStart}. Bring the QR and a photo ID in your own name.`,
    'The pass is personal and non-transferable.',
    '',
    `Running order: ${agendaUrl}`,
    `Retrieve your pass any time: ${statusUrl}`,
    '',
    `${EVENT.name} Secretariat · New Delhi`,
    `Convened by ${EVENT.organiser}`,
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
