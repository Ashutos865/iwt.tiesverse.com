import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The agenda as an A4 PDF.
 *
 * Generated on request rather than kept as a static file so it always matches
 * what the site is showing: the sessions come from the same content store the
 * Agenda page reads, so a change made in the admin appears in the next
 * download without anyone re-exporting anything.
 *
 * PDF rather than an image: a schedule is something people keep, print and
 * forward, and its text should stay selectable and searchable. A tall PNG of
 * thirteen sessions with full briefs would be unreadable on a phone and
 * useless to a screen reader.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(HERE, '../../../client/public');

const TEAL = '#117E7B';
const TEAL_LIGHT = '#EDFDFC';
const INK = '#272727';
const INK_MUTED = '#747474';
const RULE = '#D8E0EC';

const MARGIN = 48;

/** Only fonts that ship with PDFKit, so there is nothing to license or bundle. */
const F = { bold: 'Helvetica-Bold', body: 'Helvetica', italic: 'Helvetica-Oblique' };

/**
 * Writes the agenda into `res` as a PDF stream.
 * `sessions` is the same array the site renders.
 */
export function streamAgendaPdf(res, { sessions = [], summit = {} } = {}) {
  const doc = new PDFDocument({ size: 'A4', margin: MARGIN, bufferPages: true });
  doc.pipe(res);

  const pageW = doc.page.width;
  const contentW = pageW - MARGIN * 2;

  // ── Masthead ──────────────────────────────────────────────────────────
  const logo = path.join(PUBLIC, 'brand', 'iwt-logo.png');
  if (fs.existsSync(logo)) {
    // Height-constrained so a future logo of different proportions cannot
    // change the layout beneath it.
    doc.image(logo, MARGIN, MARGIN, { height: 34 });
  }

  doc.font(F.bold).fontSize(22).fillColor(INK)
    .text('INDUS WATERS TREATY DIALOGUE', MARGIN, MARGIN + 58, { width: contentW });
  doc.font(F.body).fontSize(9).fillColor(INK_MUTED)
    .text('TIESVERSE FOUNDATION', MARGIN, doc.y + 2, { width: contentW, characterSpacing: 1.2 });

  const particulars = [summit.date, summit.venue].filter(Boolean).join('  ·  ');
  doc.font(F.bold).fontSize(10).fillColor(TEAL)
    .text(particulars || '19 September 2026  ·  Bharat Mandapam, New Delhi',
      MARGIN, doc.y + 10, { width: contentW });

  doc.moveTo(MARGIN, doc.y + 12).lineTo(MARGIN + 64, doc.y + 12)
    .lineWidth(2).strokeColor(TEAL).stroke();

  let y = doc.y + 26;

  // ── Rows ──────────────────────────────────────────────────────────────
  const timeW = 92;
  const bodyX = MARGIN + timeW + 12;
  const bodyW = contentW - timeW - 12;

  /*
     PDFKit paginates by itself the moment its own cursor passes the bottom
     margin, so a manual break has to use the SAME threshold or the two fight:
     a long brief pushed doc.y past PDFKit's limit, it added a page, and then
     this check added a second one for the following row. That is what turned a
     two-page agenda into six.

     Breaking only when the row genuinely cannot start on this page — rather
     than reserving room for the whole row — leaves the long briefs to PDFKit's
     own flow, which is what it is good at.
  */
  const bottomLimit = doc.page.height - doc.page.margins.bottom;
  const ensureRoom = (needed) => {
    if (y + Math.min(needed, 60) <= bottomLimit) return;
    doc.addPage();
    y = MARGIN;
  };

  for (const item of sessions) {
    const when = `${item.start}–${item.end}`;

    if (item.kind === 'break') {
      ensureRoom(24);
      doc.rect(MARGIN, y - 4, contentW, 20).fillColor('#F7F9FC').fill();
      doc.font(F.body).fontSize(9).fillColor(INK_MUTED)
        .text(when, MARGIN + 6, y, { width: timeW });
      doc.font(F.bold).fontSize(8).fillColor(INK_MUTED)
        .text(String(item.title || 'Break').toUpperCase(), bodyX, y + 1,
          { width: bodyW, characterSpacing: 0.6 });
      y += 26;
      continue;
    }

    // Measure before drawing so a session is never split across a page break
    // with its title on one page and its brief on the next.
    doc.font(F.bold).fontSize(11);
    const titleH = doc.heightOfString(item.title || '', { width: bodyW });
    doc.font(F.body).fontSize(9);
    const descH = item.description
      ? doc.heightOfString(item.description, { width: bodyW, lineGap: 1.5 })
      : 0;
    const themeH = item.theme ? 13 : 0;
    ensureRoom(titleH + themeH + descH + 26);

    doc.font(F.bold).fontSize(9).fillColor(INK).text(when, MARGIN, y + 1, { width: timeW });

    doc.font(F.bold).fontSize(11).fillColor(INK)
      .text(item.title || '', bodyX, y, { width: bodyW });

    if (item.theme) {
      doc.font(F.italic).fontSize(9).fillColor(INK_MUTED)
        .text(`Theme: ‘${item.theme}’`, bodyX, doc.y + 1, { width: bodyW });
    }
    if (item.description) {
      doc.font(F.body).fontSize(9).fillColor('#4B4B4B')
        .text(item.description, bodyX, doc.y + 4, { width: bodyW, lineGap: 1.5 });
    }

    y = doc.y + 14;
    doc.moveTo(MARGIN, y - 7).lineTo(MARGIN + contentW, y - 7)
      .lineWidth(0.5).strokeColor(RULE).stroke();
  }

  // ── Footer on every page ──────────────────────────────────────────────
  // Written after the body so the page count is known; bufferPages holds the
  // pages open for exactly this.
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i += 1) {
    doc.switchToPage(range.start + i);
    /*
       The footer sits INSIDE the bottom margin, and the margin is lifted while
       it is written.

       Text placed below `page.height - margins.bottom` makes PDFKit believe the
       page has overflowed, so it helpfully adds another one — and since the
       footer loop runs once per page, every footer minted a fresh page and the
       new pages got footers of their own. That is what turned two pages of
       agenda into six.

       Setting margins.bottom to 0 for the duration tells PDFKit the space is
       intentional; it is restored immediately so nothing else is affected.
    */
    const savedBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    const fy = doc.page.height - MARGIN + 6;
    doc.font(F.body).fontSize(8).fillColor(INK_MUTED)
      .text('iwtdialogue.tiesverse.com', MARGIN, fy, { width: contentW / 2, lineBreak: false })
      .text(`Page ${i + 1} of ${range.count}`, MARGIN + contentW / 2, fy,
        { width: contentW / 2, align: 'right', lineBreak: false });
    doc.page.margins.bottom = savedBottom;
  }

  doc.end();
}
