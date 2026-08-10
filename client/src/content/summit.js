/**
 * Summit content — the ONE place public-page data lives (design.md §46 Phase 3).
 *
 * Everything here is programme fixture content. Speaker entries are
 * ILLUSTRATIVE (fictional people at generic institutions) so the layout is
 * real while no actual person is claimed to attend — replace them with the
 * confirmed line-up before launch. Sessions mirror the planned programme
 * structure and are safe to edit in place.
 */

// ── Agenda ──────────────────────────────────────────────────────────────
export const DAYS = [
  { key: 'day1', label: 'Day 1', date: '19 September 2026', weekday: 'Saturday' },
  { key: 'day2', label: 'Day 2', date: '20 September 2026', weekday: 'Sunday' },
];

export const TRACKS = [
  'Geopolitics & Security',
  'Water Diplomacy',
  'Law & Policy',
  'Infrastructure & Technology',
  'Environment & Sustainability',
];

export const SESSION_TYPES = ['Plenary', 'Keynote', 'Panel', 'Special Address', 'Roundtable', 'Fireside Chat'];

export const SESSIONS = [
  // Day 1
  { id: 'd1-inaugural', day: 'day1', start: '09:00', end: '09:45', type: 'Plenary',
    title: 'Inaugural Session', room: 'Plenary Hall', track: 'Geopolitics & Security',
    description: 'Setting the tone: water security in a fragmented world.' },
  { id: 'd1-keynote', day: 'day1', start: '09:45', end: '10:30', type: 'Keynote',
    title: 'Keynote Address', room: 'Plenary Hall', track: 'Geopolitics & Security',
    description: "India's water imperative: security, sovereignty, sustainability." },
  { id: 'd1-past-present', day: 'day1', start: '11:00', end: '12:15', type: 'Panel',
    title: 'Indus Waters Treaty: Past, Present and the Path Ahead', room: 'Plenary Hall', track: 'Law & Policy',
    description: 'Six decades of the treaty — what held, what frayed, and what must change.' },
  { id: 'd1-special', day: 'day1', start: '12:15', end: '13:00', type: 'Special Address',
    title: 'Water as a Catalyst for Regional Cooperation', room: 'Plenary Hall', track: 'Water Diplomacy',
    description: 'How shared rivers can build, rather than break, regional trust.' },
  { id: 'd1-legal', day: 'day1', start: '14:00', end: '15:15', type: 'Panel',
    title: 'Legal Dimensions of the Indus Waters Treaty', room: 'Hall 2', track: 'Law & Policy',
    description: 'Treaty interpretation, arbitration and the architecture of international water law.' },
  { id: 'd1-climate', day: 'day1', start: '15:30', end: '16:45', type: 'Roundtable',
    title: 'Climate Change, Glaciers and the Indus Basin', room: 'Hall 2', track: 'Environment & Sustainability',
    description: 'What accelerating glacial melt means for allocation, storage and risk.' },
  { id: 'd1-fireside', day: 'day1', start: '17:00', end: '17:45', type: 'Fireside Chat',
    title: 'The Road to a New Water Security Architecture in South Asia', room: 'Plenary Hall', track: 'Geopolitics & Security',
    description: 'A frank conversation on what replaces the status quo.' },
  // Day 2
  { id: 'd2-tech', day: 'day2', start: '09:30', end: '10:45', type: 'Panel',
    title: 'Rivers, Dams and Data: Technology in Basin Management', room: 'Plenary Hall', track: 'Infrastructure & Technology',
    description: 'Telemetry, forecasting and transparency in transboundary rivers.' },
  { id: 'd2-econ', day: 'day2', start: '11:00', end: '12:15', type: 'Panel',
    title: 'The Economics of Water Security', room: 'Hall 2', track: 'Infrastructure & Technology',
    description: 'Financing storage, hydropower and resilience in the basin states.' },
  { id: 'd2-diplomacy', day: 'day2', start: '12:15', end: '13:00', type: 'Special Address',
    title: 'Hydro-diplomacy in an Era of Strategic Competition', room: 'Plenary Hall', track: 'Water Diplomacy',
    description: 'Negotiating water when everything else is contested.' },
  { id: 'd2-basin', day: 'day2', start: '14:00', end: '15:15', type: 'Roundtable',
    title: 'Voices from the Basin: Agriculture, Cities and Communities', room: 'Hall 2', track: 'Environment & Sustainability',
    description: 'The treaty as lived reality for farmers, cities and ecosystems.' },
  { id: 'd2-valedictory', day: 'day2', start: '16:00', end: '17:00', type: 'Plenary',
    title: 'Valedictory Session & New Delhi Declaration', room: 'Plenary Hall', track: 'Geopolitics & Security',
    description: 'Summit outcomes and the declaration on the future of the basin.' },
];

// ── Speakers (ILLUSTRATIVE — replace with the confirmed line-up) ────────
export const SPEAKER_CATEGORIES = [
  'All', 'Government', 'Diplomats', 'Military', 'Academia', 'Think Tanks', 'Industry',
];

export const SPEAKERS = [
  { id: 'sp1', name: 'Speaker to be announced', designation: 'Senior Government Representative', organization: 'Government of India', country: 'India', category: 'Government', tba: true },
  { id: 'sp2', name: 'Speaker to be announced', designation: 'Former Ambassador', organization: 'Diplomatic Service', country: 'India', category: 'Diplomats', tba: true },
  { id: 'sp3', name: 'Speaker to be announced', designation: 'Strategic Affairs Expert', organization: 'Defence & Security Community', country: 'India', category: 'Military', tba: true },
  { id: 'sp4', name: 'Speaker to be announced', designation: 'Professor of International Law', organization: 'Leading Law School', country: 'India', category: 'Academia', tba: true },
  { id: 'sp5', name: 'Speaker to be announced', designation: 'Water Policy Researcher', organization: 'Policy Research Institute', country: 'India', category: 'Think Tanks', tba: true },
  { id: 'sp6', name: 'Speaker to be announced', designation: 'Infrastructure & Energy Leader', organization: 'Industry', country: 'India', category: 'Industry', tba: true },
  { id: 'sp7', name: 'Speaker to be announced', designation: 'Hydrology & Climate Scientist', organization: 'Research University', country: 'International', category: 'Academia', tba: true },
  { id: 'sp8', name: 'Speaker to be announced', designation: 'Regional Security Analyst', organization: 'International Think Tank', country: 'International', category: 'Think Tanks', tba: true },
];

// ── Theme pillars (§6.3) ────────────────────────────────────────────────
export const PILLARS = [
  { title: 'Law & the Treaty', text: 'What the treaty text, arbitration history and international water law actually permit — and where interpretation ends.', track: 'Law & Policy' },
  { title: 'Security & Strategy', text: 'Water as leverage, deterrent and flashpoint in the India–Pakistan strategic equation.', track: 'Geopolitics & Security' },
  { title: 'Climate & the Basin', text: 'Glacial melt, monsoon volatility and what a changing basin does to fixed allocations.', track: 'Environment & Sustainability' },
  { title: 'Infrastructure & Data', text: 'Storage, hydropower, telemetry and the engineering realities behind every negotiating position.', track: 'Infrastructure & Technology' },
];

// ── Why attend (§6.6) ───────────────────────────────────────────────────
export const WHY_ATTEND = [
  { title: 'Policy access', text: 'Two days of structured exchange with the officials, negotiators and jurists shaping water policy in the region.' },
  { title: 'Cross-sector network', text: 'Government, diplomacy, defence, academia, industry and media in one room — with an opt-in networking directory.' },
  { title: 'Substantive programme', text: 'Plenaries and closed roundtables built around the treaty itself, not generalities.' },
  { title: 'Concrete outputs', text: 'The New Delhi Declaration and a post-summit white paper, published to all participants.' },
];

// ── Partners (§11) — tiers render only when they have members ──────────
export const PARTNER_TIERS = [
  { tier: 'Dialogue Partner', members: [] },
  { tier: 'Strategic Partners', members: [] },
  { tier: 'Knowledge Partners', members: ['ORF', 'RIS', 'CII', 'FICCI'] },
  { tier: 'Institutional Partners', members: ['ASSOCHAM', 'TERI', 'IWA'] },
  { tier: 'Media Partners', members: [] },
];

// ── Media centre (§12) ──────────────────────────────────────────────────
export const PRESS_ITEMS = [
  { id: 'pr1', date: '15 May 2026', type: 'Press Release',
    title: 'Indus Water Treaty Dialogue 2026 announced for New Delhi',
    summary: 'The Dialogue will convene 19–20 September 2026 at Bharat Mandapam, focused on law, water security and regional cooperation.' },
  { id: 'pr2', date: '10 May 2026', type: 'Press Release',
    title: 'Theme and key focus areas published',
    summary: 'Law & the Treaty, Security & Strategy, Climate & the Basin, and Infrastructure & Data anchor the two-day programme.' },
  { id: 'pr3', date: '03 May 2026', type: 'Media Advisory',
    title: 'Media accreditation opens',
    summary: 'Accredited journalists receive press-room access, media briefings and the official media kit.' },
];

// ── FAQ (§6.10) ─────────────────────────────────────────────────────────
export const FAQ = [
  { q: 'Who can attend?', a: 'Attendance is by application. Delegates, students, media, partners and volunteers each apply through their own category; speakers join by invitation.' },
  { q: 'Does applying guarantee a place?', a: 'No. Applications are reviewed before attendance is confirmed. You can track your application status at any time from the Check Status page.' },
  { q: 'What does attendance cost?', a: 'Participation is free for approved delegates and students. Approval is based on the application, not payment.' },
  { q: 'How does entry work on the day?', a: 'Approved participants receive a QR pass. Bring the photo ID used in your application when collecting your badge at the venue.' },
  { q: 'I am a journalist. How do I get accredited?', a: 'Apply under Media accreditation with your press card or an assignment letter from your editor. Media accreditation is reviewed separately from delegate registration.' },
  { q: 'Is the venue accessible?', a: 'Bharat Mandapam is wheelchair accessible. State any accommodation you need in the application and the secretariat will follow up.' },
  { q: 'Who do I contact for help?', a: 'Write to the secretariat — the address is in the footer — with your application ID if you have one.' },
];
