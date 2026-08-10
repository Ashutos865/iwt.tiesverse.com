/**
 * Dialogue content — the ONE place public-page data lives.
 *
 * SOURCE OF TRUTH: "Concept Note — Indus Waters Treaty Dialogue 2026"
 * (Tiesverse Foundation). Every session, theme and deliverable below is
 * transcribed from that document.
 *
 * Where the concept note is silent — speakers, partners, press releases — the
 * list here is deliberately EMPTY and the page says so, rather than showing
 * invented names. The previous build shipped twelve fictional sessions, seven
 * real institutions listed as partners without basis, and three press releases
 * that were never issued; none of that is reintroduced.
 *
 * This is a ONE-TIME, SINGLE-DAY dialogue on 19 September 2026. There is no
 * Day 2 and no previous edition.
 */

// ── Agenda ──────────────────────────────────────────────────────────────
//
// The full running order from the concept note's STRUCTURE table. `kind`
// separates programme sessions from hospitality breaks so the page can render
// breaks as quiet rules instead of cards.

export const SESSIONS = [
  {
    id: 'registration',
    kind: 'break',
    start: '09:00',
    end: '09:30',
    title: 'Registration & Tea',
    description: 'Delegate check-in and networking.',
  },
  {
    id: 'inaugural',
    kind: 'session',
    start: '09:30',
    end: '10:45',
    type: 'Inaugural Session',
    theme: 'Abeyance with Cause',
    group: 'Introduction',
    title: 'Inaugural Session',
    description:
      "Sets the tone for the day: India's abeyance of the IWT as a lawful, measured "
      + 'response to sustained cross-border terrorism and treaty bad faith, not an act '
      + "of aggression. Frames the dialogue's central proposition that security and "
      + 'legality, not sentiment, must govern the future of the Treaty. Previews the '
      + "day's four analytical pillars: law, security, hydrology/economics, and "
      + 'strategic communication.',
  },
  {
    id: 'break-1',
    kind: 'break',
    start: '10:45',
    end: '11:00',
    title: 'Break',
    description: 'Tea & networking.',
  },
  {
    id: 'curtain-raiser',
    kind: 'session',
    start: '11:00',
    end: '11:40',
    type: 'Curtain-Raiser Panel',
    group: 'Identity Crisis',
    title: 'Reclaiming the Indus — Civilisation, Heritage and the Naming of a River',
    description:
      'A short historical and archaeological session on the Indus Valley Civilisation, '
      + 'Mohenjo-daro, Harappa, and the shared linguistic root of Sindhu, Hindu, India '
      + "and Indus. Establishes India's civilisational continuity with the Indus basin "
      + 'as context for the day.',
  },
  {
    id: 'session-1',
    kind: 'session',
    start: '11:40',
    end: '12:45',
    type: 'Session I',
    group: 'Introduction',
    title: 'The Text Speaks — Abeyance as Lawful, Not Breach',
    description:
      "The legal core of the dialogue. It covers the IWT's Preamble, the Article IX "
      + 'dispute-resolution ladder, and Article XII on modification and termination, '
      + "including a direct discussion of Article XII(4)'s requirement that the Treaty "
      + "remains in force until mutually terminated, and the Permanent Court of "
      + "Arbitration's 2025 supplemental award on continuing jurisdiction. Discusses how "
      + "India's abeyance is a proportionate countermeasure under the law of state "
      + 'responsibility (material breach, rebus sic stantibus and ARSIWA Articles 25–26). '
      + 'Addresses, independent of the terrorism question, why climate-driven shifts in '
      + "glacial melt and river flow make a scientific case for renegotiating the Treaty's "
      + 'technical terms.',
  },
  {
    id: 'break-2',
    kind: 'break',
    start: '12:45',
    end: '13:00',
    title: 'Break',
    description: 'Tea & networking.',
  },
  {
    id: 'session-2',
    kind: 'session',
    start: '13:00',
    end: '14:05',
    type: 'Session II',
    group: "Decoding Pakistan's Narrative",
    title: 'Terror as the Breach',
    description:
      'Examines how sustained cross-border terrorism — Pahalgam (2025), Pulwama, 26/11 '
      + '— has eroded the good-faith premise on which the IWT was built. Discussion on '
      + 'sourced, dated accounts linking specific attacks to the breakdown of treaty '
      + 'cooperation, drawing on investigation records, judicial findings, UN listings '
      + "and FATF documentation. The session also places on record Pakistan's public "
      + "statements threatening a military response to India's water policy, analysed as "
      + 'posturing rather than credible deterrence.',
  },
  {
    id: 'lunch',
    kind: 'break',
    start: '14:10',
    end: '14:55',
    title: 'Lunch Break',
    description: '',
  },
  {
    id: 'session-3',
    kind: 'session',
    start: '14:55',
    end: '15:55',
    type: 'Session III',
    group: "Decoding Pakistan's Narrative",
    title: 'Who Actually Weaponises Water and the Accountability Deficit',
    description:
      'A data-driven session on the hydrology and infrastructure of the western rivers. '
      + "Speakers present basin-share figures, flow and storage data, and India's "
      + "project-compliance record, alongside Pakistan's own decades of under-investment "
      + 'in storage and its procedural blocking of Indian projects. The Left Bank Outfall '
      + 'Drain (LBOD) is discussed as an example of cross-border environmental harm '
      + 'affecting the Rann of Kutch. Climate-altered flows and environmental-impact '
      + 'considerations are also addressed, alongside how six decades of favourable water '
      + 'access did not translate into commensurate Pakistani investment in storage or '
      + 'irrigation efficiency.',
  },
  {
    id: 'break-3',
    kind: 'break',
    start: '15:55',
    end: '16:10',
    title: 'Break',
    description: 'Tea & networking.',
  },
  {
    id: 'session-4',
    kind: 'session',
    start: '16:10',
    end: '17:10',
    type: 'Session IV',
    group: 'Economics & The Red Line',
    title: 'India as Lawful Upper Riparian and Terms for Return',
    description:
      'Makes the forward-looking case: why the western rivers are critical to India\'s '
      + 'agriculture, hydropower and water security, and what conditions would need to be '
      + "met for a return to normal treaty cooperation. Quantifies India's usage of its "
      + 'treaty-compliant projects (Salal, Baglihar, Dulhasti, Uri, Kishanganga) and sets '
      + 'out realistic terms — verifiable cessation of cross-border terrorism and '
      + "good-faith engagement — under which India's position could evolve.",
  },
  {
    id: 'valedictory',
    kind: 'session',
    start: '17:10',
    end: '17:40',
    type: 'Valedictory',
    group: 'Economics & The Red Line',
    title: "Adoption of the 'New Delhi Declaration on the Indus Waters Treaty'",
    description:
      "Closing session synthesising the day's legal, security and economic arguments "
      + "into a short, adopted declaration reaffirming India's position, and releasing "
      + 'the White Paper summarising the sourced evidence presented across all sessions.',
  },
  {
    id: 'high-tea',
    kind: 'break',
    start: '17:40',
    end: '18:00',
    title: 'High Tea',
    description: 'Tea & networking.',
  },
];

/** The four sessions the six themes are delivered across. */
export const SESSION_GROUPS = [
  'Introduction',
  'Identity Crisis',
  "Decoding Pakistan's Narrative",
  'Economics & The Red Line',
];

/** The four analytical pillars previewed in the inaugural session. */
export const PILLARS = [
  {
    title: 'Law',
    text:
      'The Treaty text itself — Preamble, the Article IX ladder, Article XII — read '
      + 'against the Vienna Convention and the law of state responsibility.',
  },
  {
    title: 'Security',
    text:
      'Sustained cross-border terrorism as the breach of the good-faith premise on '
      + 'which the Treaty was built.',
  },
  {
    title: 'Hydrology & Economics',
    text:
      'Basin-share figures, flow and storage data, project compliance, and what the '
      + "western rivers are worth to India's agriculture, energy and water security.",
  },
  {
    title: 'Strategic Communication',
    text:
      'A fact-anchored evidentiary ecosystem aimed at domestic, diaspora and '
      + 'international audiences.',
  },
];

// ── Themes and objectives ───────────────────────────────────────────────
// The six interlocking themes, each combining its objective with its content.

export const THEMES = [
  {
    n: '01',
    title: 'Treaty, Law and the Basis for Abeyance',
    text:
      "Discusses the IWT's history, articles, Preamble and the graduated Article IX "
      + 'ladder, and evaluates the legal grounds for abeyance: cross-border terrorism, '
      + 'the doctrines of material breach and rebus sic stantibus (Vienna Convention '
      + "Articles 60 and 62), climate-altered flows, and Pakistan's shift from treaty "
      + 'partner to procedural blocker. Directly addresses Article XII(4)\'s silence on '
      + "non-water disputes and the 2025 PCA supplemental award, framing India's abeyance "
      + 'as a proportionate countermeasure under ARSIWA Articles 25–26 rather than '
      + 'unilateral termination. Independent of the security dimension, it makes the case '
      + 'that a treaty engineered in 1960 without any climate contingency is structurally '
      + 'unfit for a basin now facing glacial retreat and altered seasonal flows.',
  },
  {
    n: '02',
    title: 'Civilisational Heritage — Reclaiming the Indus',
    text:
      'Showcases the Harappan (Sindhu-Sarasvati) inheritance and the shared root of '
      + "Sindhu, Hindu, India and Indus, reasserting India's place as the custodian of "
      + 'the Indus civilisational legacy against a belated attempt to appropriate a '
      + 'heritage once disowned in favour of an imported identity.',
  },
  {
    n: '03',
    title: "Decoding Pakistan's Narrative — Victimhood versus Reality",
    text:
      "Counters Pakistan's victim card point by point — terrorism, the LBOD flooding of "
      + 'the Rann of Kutch, its blocker role against treaty modernisation, and the "water '
      + 'is survival" plea — weighed against the record in PoJK, Balochistan, the Afghan '
      + "Taliban blowback, and decades of non-development on Pakistan's own Indus rivers. "
      + "Also interrogates Pakistan's record as the treaty's principal beneficiary for "
      + 'over six decades, arguing that its current water distress stems chiefly from '
      + 'sustained under-investment in storage, irrigation efficiency and basin management.',
  },
  {
    n: '04',
    title: 'Exposing Pakistan through Documented Record',
    text:
      'Places on the public record, before international audiences, a citation-backed '
      + 'account of terrorism, treaty non-compliance and human-rights concerns — enforced '
      + "disappearances, minority persecution — behind Pakistan's peacemaker image, "
      + 'anchored to FATF, UN and judicial sources rather than assertion, alongside '
      + 'repeated military and nuclear rhetoric analysed as posturing rather than credible '
      + 'deterrence.',
  },
  {
    n: '05',
    title: 'Economics — Why Indus Matters to India',
    text:
      "Makes the material case for the western rivers to India's agriculture, energy and "
      + "long-term water security, quantifying India's own usage (Salal, Baglihar, "
      + "Dulhasti, Uri, Kishanganga) against Pakistan's stated 80% irrigation dependency, "
      + "and showing why Pakistan's obstruction made modernisation of the 1960 framework "
      + 'unavoidable. Outlines the tangible upside for India of unrestricted use of the '
      + 'western rivers — expanded hydropower capacity, additional irrigation command '
      + 'area, and improved flood and sediment management — alongside the responsibilities '
      + 'that come with exercising full upper-riparian rights.',
  },
  {
    n: '06',
    title: 'The Red Line and Strategic Communication',
    text:
      'Adopts a New Delhi Declaration — "Blood and Water Cannot Flow Together" — '
      + 'connecting the technical water-sharing framework to the security reality '
      + 'Pakistan has long downplayed, backed by a fact-anchored evidentiary ecosystem '
      + '(legal-policy brief, data and cartography annex, sourced terror-water timeline, '
      + 'and media/outreach kit) aimed at domestic, diaspora and international audiences.',
  },
];

// ── Deliverables and outcomes ───────────────────────────────────────────
// Six coordinated tracks that turn the proceedings into a durable record.

export const DELIVERABLES = [
  {
    n: '01',
    title: 'Legal White Paper & Treaty Dossier',
    text:
      "An article-by-article legal statement of India's position — the good-faith "
      + 'Preamble, Article XII, the Article IX ladder and the Vienna Convention grounds — '
      + 'each proposition anchored to the treaty text and to the binding record, including '
      + "the Neutral Expert's January 2025 competence ruling. Every legal claim is "
      + 'footnoted to a primary source.',
  },
  {
    n: '02',
    title: 'Evidence & Cartography',
    text:
      'A documentary and map-based exhibit presenting the physical proof: LBOD damage in '
      + 'the Rann of Kutch, Chenab telemetry at Marala and Baglihar, corrected basin-share '
      + 'maps (47% Pakistan / 39% India, FAO AQUASTAT), quantified Indian project usage '
      + "and India's project-compliance data — each exhibit sourced to survey records, "
      + 'telemetry logs or official datasets.',
  },
  {
    n: '03',
    title: 'Terror-Water Nexus Documentation',
    text:
      'A sourced, dated timeline linking Pahalgam (2025), Pulwama (2019) and 26/11 to the '
      + "erosion of the Treaty's cooperative premise, with attributed references — attack "
      + 'records, investigation findings and FATF documentation suitable for citation by '
      + 'international media and institutions.',
  },
  {
    n: '04',
    title: 'Media Production',
    text:
      'Short films, explainers and reels that translate the documented legal and factual '
      + 'case into accessible formats, each carrying its evidentiary basis on screen so '
      + 'the proof travels with the message.',
  },
  {
    n: '05',
    title: 'International Press & Diaspora Outreach',
    text:
      'Structured, dossier-backed briefings for foreign correspondents, and engagement '
      + 'with Baloch, Sindhi and Pashtun diaspora voices whose first-hand testimony '
      + "evidences Pakistan's rights record — widening the conversation beyond Indian "
      + 'outlets.',
  },
  {
    n: '06',
    title: 'Digital Archive of Compliance & Violations',
    text:
      "A living online repository placing India's treaty compliance beside Pakistan's "
      + 'documented violations, each entry linked to its source, including a "Pakistan '
      + 'Claims vs. India Rebuttals" matrix built incrementally as a standing, '
      + 'fact-checkable reference for researchers, journalists and legal analysts.',
  },
];

// ── Background note ─────────────────────────────────────────────────────

export const BACKGROUND = [
  'In April 2025, following the Pahalgam terror attack that killed 26 civilians, India '
  + 'placed the 1960 Indus Waters Treaty (IWT) in abeyance. The Treaty was originally '
  + 'signed “in a spirit of goodwill and friendship.” Its suspension forces an examination '
  + 'of what happens to that legal framework when one party adopts terrorism as a primary '
  + 'instrument of statecraft. To address this, the dialogue convenes jurists, '
  + 'water-resource engineers, security scholars and diplomats. Their shared objective is '
  + "to establish that India's decision is a lawful, measured response to treaty bad faith "
  + 'and state-sponsored violence.',

  'The urgency for this discourse increased in June 2026, when Pakistan hosted a seminar '
  + "in Islamabad designed to frame India's policy shift as “water weaponization.” "
  + 'Countering this requires a multifaceted, evidence-led approach. The dialogue will '
  + "demonstrate that Pakistan is in active breach of the Treaty's core tenets, detailing "
  + 'its failure to meet obligations on the mandatory exchange of hydrological data under '
  + 'Article VI and the avoidance of cross-border material damage under Article IV.',

  'To ensure the proceedings remain anchored in historical accuracy, international law and '
  + 'verifiable fact, the IWT itself is the focal point of the technical panels. Experts '
  + 'draw arguments directly from the Treaty text — the Preamble, key Articles and '
  + 'Annexures — alongside the binding records of the Permanent Court of Arbitration and '
  + 'the Neutral Expert. This legal, factual and civilisational analysis culminates in a '
  + 'legal-policy white paper, serving as a durable evidentiary record.',
];

/** Why 19 September, and why Bharat Mandapam. */
export const VENUE_NOTE =
  'The dialogue convenes at Bharat Mandapam in New Delhi on 19 September 2026, the '
  + 'anniversary of the signing of the Indus Waters Treaty in 1960. By convening on the '
  + "treaty's sixty-sixth anniversary, the organisers situate the proceedings within "
  + "India's suspension of the agreement, establishing a chronological frame for comparing "
  + "the treaty's original diplomatic context against its current operational status. "
  + 'Bharat Mandapam accommodates the single-day plenary format of panel discussions and a '
  + 'valedictory session. The facility is equipped with live-streaming technology for '
  + 'international audiences, and its location in the national capital facilitates '
  + 'attendance by government officials and diplomatic personnel.';

// ── Speakers ────────────────────────────────────────────────────────────
//
// EMPTY BY DESIGN. The concept note is explicit: "All speakers named below and
// in the profiles that follow are proposed invitees whose public record fits
// the session. Their inclusion reflects suitability, not confirmed
// participation." No name is published here until it is confirmed.

export const SPEAKERS = [];

export const SPEAKER_DISCLAIMER =
  'Speaker and guest participation is subject to availability and final confirmation. '
  + 'Names are published here only once confirmed.';

// ── Partners ────────────────────────────────────────────────────────────
//
// EMPTY BY DESIGN. The previous build listed ORF, RIS, CII, FICCI, ASSOCHAM,
// TERI and IWA as partners. None appears in the concept note, and naming real
// institutions as partners of this dialogue without their agreement is a
// misrepresentation. Add entries only against a signed partnership.

export const PARTNER_TIERS = [
  { tier: 'Dialogue Partner', members: [] },
  { tier: 'Strategic Partners', members: [] },
  { tier: 'Knowledge Partners', members: [] },
  { tier: 'Institutional Partners', members: [] },
  { tier: 'Media Partners', members: [] },
];

// ── Media centre ────────────────────────────────────────────────────────
//
// EMPTY BY DESIGN. The three entries previously here (dated 15, 10 and 03 May
// 2026) were never issued. Add real releases as they go out.

export const PRESS_ITEMS = [];

// ── FAQ ─────────────────────────────────────────────────────────────────

export const FAQ = [
  {
    q: 'When and where is the dialogue?',
    a: 'One day — 19 September 2026 — at Bharat Mandapam, New Delhi. The date is the '
      + 'sixty-sixth anniversary of the signing of the Indus Waters Treaty in 1960. '
      + 'Proceedings run from registration at 09:00 to high tea at 18:00.',
  },
  {
    q: 'Who can attend?',
    a: 'Attendance is by application. Delegates, students, media, partners and volunteers '
      + 'each apply through their own category; speakers join by invitation.',
  },
  {
    q: 'Does applying guarantee a place?',
    a: 'No. Applications are reviewed before attendance is confirmed. You can track your '
      + 'application status at any time from the Check Status page.',
  },
  {
    q: 'How does entry work on the day?',
    a: 'Approved participants receive a QR pass. Bring the photo ID used in your '
      + 'application when collecting your badge at the venue.',
  },
  {
    q: 'I am a journalist. How do I get accredited?',
    a: 'Apply under Media accreditation with your press card or an assignment letter from '
      + 'your editor. Media accreditation is reviewed separately from delegate registration.',
  },
  {
    q: 'Who is organising the dialogue?',
    a: 'Tiesverse Foundation (TIES), a youth-led research, media and technology '
      + 'organisation recognised by AICTE under the Ministry of Education, Government of '
      + 'India.',
  },
  {
    q: 'Can I follow the proceedings remotely?',
    a: 'Bharat Mandapam is equipped with live-streaming technology for international '
      + 'audiences. Streaming details are published closer to the date.',
  },
  {
    q: 'What comes out of the dialogue?',
    a: 'The New Delhi Declaration on the Indus Waters Treaty is adopted in the valedictory '
      + 'session, alongside the release of a legal-policy white paper summarising the '
      + 'sourced evidence presented across all sessions.',
  },
  {
    q: 'I need accessibility support. Who do I tell?',
    a: 'State any access requirement in your application and the secretariat will follow '
      + 'up with you directly before the event.',
  },
];
