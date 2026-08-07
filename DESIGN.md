# Indus Water Treaty Dialogue 2026 — Design System

Design reference for every screen in the platform — public site, registration
flow, and the secretariat admin. Derived from the approved landing/inner-page
mockups; implemented in Tailwind (`client/tailwind.config.js` +
`client/src/index.css`).

---

## 1. Design analysis of the mockups

What the reference design communicates, and the rules extracted from it:

**Identity.** A statecraft summit, not a tech conference. The design leans on
diplomatic gravitas: serif display type in deep teal, an engraved-mandala motif
referencing both Indus-basin water and Indian craft, ivory paper backgrounds
like official stationery, and restrained photography (rivers, dams, mountains).

**Colour discipline.** One hue does almost all the work — a petrol/river teal —
used at three depths (bright accent, mid CTA, near-black ink). Warm ivory
grounds every page; white cards float on it. Red appears only for mandatory
markers and destructive/invalid states. No gradients louder than a subtle
photo wash.

**Typography contrast.** Big serif headlines (all-caps or title case) against
small, widely-tracked uppercase sans labels. Body copy is quiet, mid-grey-teal.
The pairing is the brand: *Playfair Display* for display, *Inter* for
everything else.

**Structure.** Generous whitespace, thin hairline borders (never heavy),
soft-rounded cards (8–12px), and horizontal "bands" that alternate ivory /
teal / white down the page. Stats get their own solid-teal strip. Numbered
circles express progress everywhere (hero steps, registration wizard).

**Registration flow (mockup 3) specifics.**
- Horizontal numbered-step rail: filled teal circle = current, tick = done,
  hollow grey = upcoming, hairline connectors.
- Fields in a 3-column grid on desktop, red asterisk on mandatory labels,
  labels above inputs, helper text below.
- Right rail: **Registration Categories** radio-list (switch track without
  losing your place in the site) + **Need help?** contact card.
- Footer buttons: ghost "Save & Exit" left, solid "Save & Continue" right.
- Categories offered: Delegate · Student · Speaker · Media · Sponsor ·
  Partner Organisation · Volunteer — matching our seven built tracks.

**Delegate dashboard (mockup 4)** confirms the post-approval language we use:
Application Status **Approved**, Badge Status **Ready** with a QR tile and
"Download Badge", countdown to event day.

---

## 2. Design tokens

### Colour

| Token | Hex | Use |
|---|---|---|
| `paper` | `#f6f4ee` | Page background (warm ivory) |
| `ink-950` | `#081f25` | Footer, deepest surfaces |
| `ink-900` | `#0f333b` | Dark cards, QR pass header, primary text |
| `ink-800` | `#163f48` | Headings on light, labels |
| `ink-700` | `#1e4d57` | Body-strong, hover on dark |
| `ink-600` | `#2a606b` | Secondary text (often at /70–/90 opacity) |
| `ink-200` | `#bed4d7` | Borders, disabled, placeholders |
| `ink-100` | `#e0eaeb` | Hairlines, table header fills |
| `ink-50`  | `#f2f6f6` | Subtle fills, zebra hover |
| `brand-700` | `#10525e` | CTA hover, active text |
| `brand-600` | `#156b7a` | **Primary CTA**, links, active states |
| `brand-500` | `#1d8494` | Accent marks, step numbers, mandala |
| `brand-400` | `#2b9aab` | Bright accent on dark grounds |
| `brand-100/50` | `#d5eef0` / `#eef8f9` | Tint fills (help box, active category) |

Status colours (badges only, never for chrome):
`received` ink-100/ink-800 · `under_review` amber-100/amber-800 ·
`approved` emerald-100/emerald-800 · `rejected` red-100/red-700.
Red-500 marks required fields; red-600 is the only destructive button colour.

### Typography

| Role | Face | Style |
|---|---|---|
| Display / headlines | Playfair Display 600–700 | Title case or caps, tight leading (`1.05` in hero) |
| Section kickers | Inter 600 | 11–12px, uppercase, tracking `0.2–0.3em`, brand-600 |
| Body | Inter 400 | 14px, ink-600/80–90 |
| Labels | Inter 500 | 14px, ink-800; red `*` suffix when required |
| Data (reg numbers, tokens) | monospace | never wrapped, `select-all` where copyable |

### Shape & elevation

- Radius: `rounded-md` (6px) inputs/buttons · `rounded-xl` (12px) cards ·
  `rounded-full` pills, step circles.
- Borders: 1px hairlines in `ink-100`/`ink-200`. 2px only for emphasis rings
  (verify result cards, active step circle).
- Shadow: `shadow-sm` on cards only. Depth comes from banding, not shadows.

---

## 3. Component library

All live in `client/src/components/` unless noted; shared classes in
`index.css`.

| Component | Class / file | Spec |
|---|---|---|
| Primary button | `.btn-primary` | brand-600 fill, white text, uppercase + tracked for CTAs ("REGISTER NOW", "SAVE & CONTINUE") |
| Dark button | `.btn-dark` | ink-900 fill — secondary emphasis |
| Ghost button | `.btn-ghost` | white fill, brand-tinted border/text — "Request Invitation" style |
| Danger button | `.btn-danger` | red-600; admin reject + confirm only |
| Card | `.card` | white, ink-100 hairline, 12px radius, `p-6` |
| Input | `.input` | white, ink-200 border; focus = brand-500 border + 20% ring |
| Step rail | `StepIndicator.jsx` | numbered circles (36px, 2px border) + hairline connectors; done = tick, teal outline |
| Field | `FieldRenderer.jsx` | label-above, red asterisk, hint below, error swaps hint |
| File input | `FileInput.jsx` | dashed drop-style box, thumbnail preview, Replace/Remove |
| Review summary | `ReviewStep.jsx` | grouped by step, dt/dd pairs, per-section Edit links |
| Status badge | `StatusBadge.jsx` | pill, status colours above |
| QR pass | `QRPassCard.jsx` | ink-900 header band with serif event name; QR left, photo+identity right; print button hidden in `@media print` |
| Category sidebar | in `RegisterWizard.jsx` | radio-style list + brand-50 "Need help?" card; hidden < `lg` |
| Stats band | in `Home.jsx` | solid brand-600 strip, 6-up serif numerals, tracked uppercase labels |
| Mandala | in `Home.jsx` | pure-SVG concentric rings + radial ticks, brand-500 at ~50% opacities; decorative only (`aria-hidden`) |

---

## 4. Page specifications — public

### Home `/`
Bands top-to-bottom: **Hero** (ivory; kicker → serif "Indus Water Treaty 2026"
in brand-700 → diamond divider → theme line in serif ink-800 → date/venue row
with stroked icons → Register Now + ghost status CTA; mandala SVG bleeding off
the right edge on `lg+`) → **Stats strip** (brand-600) → **About + How
registration works** (2-col) → **Registration CTA** (ink-900 card) →
**Partners strip** (white, serif grey wordmarks).

### Category picker `/register`
Kicker + serif title, 2-col grid of category cards (hover: lift + brand
border + arrow reveal). Each card: bold label + one-line blurb.

### Registration wizard `/register/:category`
Max-width `6xl`, two columns on `lg`:
- **Main** — step rail, then a card per step. Fields grid: 1-col mobile,
  2-col `sm`, 3-col `xl`; textareas/checkbox groups/file fields span full
  width. Footer: ghost **Back** · "Step x of y" · dark **SAVE & CONTINUE**
  (last step: primary **SUBMIT APPLICATION**).
- **Right rail (264px)** — Registration Categories list (current = filled
  radio dot + brand-50 fill) and Need help? box (brand-50, phone + support
  email).
Validation: advance blocked until the current step passes; server field
errors map back to inputs and jump to the offending step.

### Success `/register/success`
Centred card: emerald tick disc → "Application received" → dashed brand
box holding the registration number (serif, `select-all`) → what-happens-next
→ Check status / Home CTAs.

### Status `/status`
Lookup card (email + registration number). Result card: name, category,
mono reg-number, StatusBadge, next-step sentence; rejection reason in a red
tint box when present. Approved adds `QRPassCard` (printable).

### Verify `/verify/:token`
Full-bleed centred verdict for gate staff, readable at arm's length:
- Valid — 2px emerald border card, tick disc, photo (112px circle), serif
  name, category/organisation/nationality, mono reg-number.
- Invalid — 2px red border card, ✕ disc, reason copy ("Do not admit" /
  "help desk"). Distinguish TAMPERED · NOT_FOUND · NOT_APPROVED.

---

## 5. Page specifications — admin (secretariat)

Admin shares the public shell (header/footer) deliberately — one operator,
no separate chrome needed yet. Its personality: denser, table-first, zero
decorative elements. No mandala, no serif walls — serif appears only in
page titles.

### Login `/admin`
Single centred card: kicker "SECRETARIAT", serif "Admin sign in", password
field, full-width dark button. Errors inline under the field. On success the
key goes to `sessionStorage` — closing the tab signs out.

### Applications list `/admin/applications`
- Header row: serif "Applications" + total count; ghost Sign out at right.
- Filter rank: **status pill tabs** (All / New / Under Review / Approved /
  Rejected — active pill = ink-900 fill) → category dropdown → debounced
  search (name, email, reg-number).
- Table: ink-50 header band, uppercase tracked headings; rows hover
  ink-50/50. Columns: mono brand-coloured reg-number (link) · name with
  email under it in small grey · category (hidden < `sm`) · date (hidden
  < `md`) · StatusBadge.
- Pagination: ghost Previous/Next + "Page x of y", 25 per page.

### Application detail `/admin/applications/:id`
Stacked cards:
1. **Identity header** — serif name, category + mono id, email, StatusBadge
   at right.
2. **Submitted details** — dt/dd grid of every answer (camelCase keys are
   auto-labelised).
3. **Documents** — thumbnail cards (image preview or "PDF" tile), original
   filename, opens in new tab.
4. **Decision** — the only place decisions happen:
   - Pending: explainer line + ghost "Mark under review" (only from
     `received`) + primary "Approve & issue pass" + danger "Reject".
   - Reject asks for a reason in-place; the reason is applicant-visible —
     confirm is a second danger button.
   - Approved: shows the stored QR + verify URL. Rejected: shows reason.
   - Decisions are final in the UI (server returns 409 on re-decision).
5. Timestamps footer (submitted / decided).

### Admin design rules
- Every admin fetch that 401s clears the stored key and bounces to `/admin`.
- Destructive = red, and red is never used for anything else.
- Table text stays 14px; metadata 12px; never below 11px.
- Actions that issue something irreversible (approve → QR) say so in the
  button label, not in a tooltip.

---

## 6. Voice & content rules

- Applicant-facing statuses are phrases, not codes: "Application Received",
  "Under Review", "Approved", "Not Approved".
- Rejection reasons are written to be read by the applicant.
- The registration number is always shown in mono, always copyable, and
  called "registration number" (never "ID") in applicant-facing copy.
- CTAs are imperative and short: Register Now, Save & Continue, Check Status.
- Dates spell the month ("19–20 September 2026"), venue is always
  "Bharat Mandapam, New Delhi".

## 7. Responsive & print

- Breakpoints: single column < `sm`; field grid 2-col `sm`, 3-col `xl`;
  category sidebar only ≥ `lg`; table columns shed below `md`/`sm`.
- Step rail shows titles only ≥ `sm` (circles always visible).
- Print (`@media print`): `.no-print` hides nav, footer, forms and buttons —
  printing the status page yields just the QR pass card.

## 8. Accessibility

- Focus states: 2px brand ring on every input; buttons keep visible focus.
- Decorative SVG (mandala, logo rosettes) is `aria-hidden`; QR images carry
  alt text with the registration number.
- Required is conveyed by the label asterisk *and* validation message, not
  colour alone. Status pills pair colour with words.
- Hit targets ≥ 36px (step circles, buttons, table rows).

## 9. Future pages (designed in mockups, not yet built)

Keep these consistent when they land:
- **Agenda** — dark-teal photo hero band + day tabs; left filter rail
  (tracks, session types); time-keyed session cards with venue chips.
- **Speakers** — searchable grid of portrait cards (photo, name, designation,
  flag); filter tabs by cohort (Ministers / Diplomats / Military / Academia…).
- **Partners** — tiered logo sections (Dialogue / Strategic / Knowledge
  partners) on white.
- **Media centre** — press-release list with thumbnail rail; accreditation
  CTA card at right (links to existing `/register/media`).
- **Delegate dashboard** — after login: sidebar nav; status tile, badge tile
  with QR + Download Badge, event countdown, announcements. Reuses
  StatusBadge + QRPassCard as-is.
