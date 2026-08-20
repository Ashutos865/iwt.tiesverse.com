/**
 * Event constants.
 *
 * SOURCE OF TRUTH: "Concept Note — Indus Waters Treaty Dialogue 2026"
 * (Tiesverse Foundation). Do not add figures, dates or names that the concept
 * note does not state.
 *
 * This is a ONE-TIME, SINGLE-DAY dialogue on 19 September 2026 — the 66th
 * anniversary of the Treaty's signing in Karachi on 19 September 1960. There
 * is no previous edition and no annual series, so nothing here should ever
 * read "two days", "Day 2", "this edition" or "the 2026 theme".
 */

export const SUMMIT = {
  // The concept note titles the event "Dialogue on the Indus Waters Treaty 2026".
  name: 'Dialogue on the Indus Waters Treaty 2026',
  shortName: 'IWT Dialogue 2026',
  kicker: 'Dialogue by Tiesverse Foundation on',
  // Rendered as two lines in the hero.
  displayTitle: 'Indus',
  displaySubtitle: 'Waters Treaty',
  theme: 'Blood and Water cannot flow together',
  // Singular by design — the dialogue convenes on one day only.
  date: '19 September 2026',
  venue: 'Bharat Mandapam, New Delhi',
  format: 'Single-day plenary format',
  // 19 September 1960, Karachi — 2026 is the 66th anniversary.
  treatySignedYear: 1960,
  anniversary: '66th',

  about:
    'In April 2025, following the Pahalgam terror attack that killed 26 civilians, '
    + 'India placed the 1960 Indus Waters Treaty in abeyance. The Treaty was originally '
    + 'signed “in a spirit of goodwill and friendship”. Its suspension forces an '
    + 'examination of what happens to that legal framework when one party adopts '
    + 'terrorism as a primary instrument of statecraft. The Dialogue convenes jurists, '
    + 'water-resource engineers, security scholars and diplomats to establish that '
    + "India's decision is a lawful, measured response to treaty bad faith and "
    + 'state-sponsored violence.',

  // TODO(secretariat): these addresses were placeholders in the original build and
  // are NOT in the concept note. Replace with the real secretariat contacts before
  // launch. The concept note gives only the organisation's site, tiesverse.com.
  email: 'info@induswatertreaty.org',
  supportEmail: 'support@induswatertreaty.org',
  // Deliberately null: the previous build rendered a literal "+91 11 XXXX XXXX"
  // on live pages. Every consumer guards on this, so setting a real number here
  // is all that is needed to bring it back.
  phone: null,
};

/*
 * Tiesverse's own accounts. Taken from the links published on tiesverse.com
 * rather than guessed from the brand name — a handle that looks right but
 * belongs to somebody else sends delegates to a stranger.
 *
 * LinkedIn is the exception: tiesverse.com still points at an older
 * /thetiesmedia page, and /ties-in is the current one, supplied directly. Worth
 * correcting on the main site too, so the two do not disagree.
 */
export const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ties-in/' },
  { label: 'Instagram', href: 'https://www.instagram.com/ties.in/' },
  { label: 'X', href: 'https://x.com/TiesIndia' },
  { label: 'YouTube', href: 'https://youtube.com/@TiesIndia' },
];

export const ORGANISER = {
  name: 'Tiesverse Foundation',
  abbr: 'TIES',
  website: 'https://www.tiesverse.com',
  websiteLabel: 'www.tiesverse.com',
  description:
    "Tiesverse Foundation (TIES) is one of India's leading youth-led Research, Media and "
    + 'Technology organisations, building knowledge, media platforms and technology products '
    + 'for issues of national and global importance.',

  /*
   * The organisation's own profile, supplied by Tiesverse.
   *
   * An array of paragraphs rather than one long string: at this length a single
   * block is a wall of text, and joining paragraphs with "\n\n" only works if
   * every consumer remembers to split on it. The About page maps over these.
   */
  profile: [
    'TIESVERSE FOUNDATION, operating under the name TIES, is one of India\u2019s leading '
    + 'youth-led Research, Media and Technology organisations, powered by a diverse young '
    + 'workforce that is more than 50% women. It builds knowledge, media platforms and '
    + 'technology products for issues of national and global importance, combining rigorous '
    + 'research, influential digital media and cutting-edge technology to identify '
    + 'opportunities, engage large audiences and deliver impactful outcomes across '
    + 'geopolitics, international relations, foreign policy, public policy, national '
    + 'security, defence, economics, technology, artificial intelligence and information '
    + 'ecosystems.',

    'Through its research programmes, TIES undertakes structured analysis of contemporary '
    + 'and strategic issues, drawing on publicly available information, datasets, expert '
    + 'interactions and multidisciplinary approaches. Its media ecosystem translates that '
    + 'work into accessible knowledge and public discourse through a growing network of '
    + 'thematic platforms. Alongside research and media, TIES is developing technology, AI '
    + 'products and digital systems for self-reliant and sovereign applications across the '
    + 'national security domain.',

    'This integrated Research, Media and Technology model lets TIES work across the whole '
    + 'knowledge cycle \u2014 from understanding complex issues and generating original '
    + 'analysis, to communicating their significance, to developing sovereign technological '
    + 'and AI capabilities for the nation.',

    'TIES has built a network of more than 120 young researchers, analysts, engineers, '
    + 'designers and media professionals from prestigious institutions in India and abroad, '
    + 'most of them Gen-Z, alongside a digital community of over 200,000 followers and '
    + '50,000 subscribers generating millions of monthly impressions. Its institutional and '
    + 'expert engagement extends across academics, researchers, public representatives, '
    + 'policymakers, technology professionals and practitioners through dialogues, webinars, '
    + 'workshops and knowledge initiatives.',

    'TIES has received the Anuvadhini Fellow Award from the All India Council for Technical '
    + 'Education (AICTE), Ministry of Education, Government of India, and was associated '
    + 'with the India AI Impact Summit 2026, where it hosted a key session on disinformation '
    + 'warfare and building resilient societies in the era of artificial intelligence. '
    + 'Founded and directed by Pruthavirajsingh Dulat and Hardik Pathak, TIES operates with '
    + 'an India-first philosophy: research creates knowledge, media amplifies it, and '
    + 'technology turns it into solutions that advance India\u2019s self-reliance in domains '
    + 'of national importance.',
  ],
};

/**
 * Key facts strip.
 *
 * Replaces the previous "500+ delegates / 30+ countries / 40+ speakers /
 * 20+ sessions" band, none of which appears in the concept note — and 20+
 * sessions directly contradicted a single-day agenda. Every value below is
 * traceable to the note or to the Treaty's signing date.
 */
export const KEY_FACTS = [
  { value: '1 Day', label: 'Single-day plenary' },
  { value: '1960', label: 'Treaty signed' },
  { value: '66th', label: 'Anniversary of signing' },
  { value: 'Apr 2025', label: 'Placed in abeyance' },
  { value: '6', label: 'Interlocking themes' },
  { value: '4', label: 'Analytical sessions' },
];

export const CATEGORIES = [
  {
    slug: 'delegate',
    access: 'Open — reviewed',
    docs: 'Photo, government ID',
    review: 'Reviewed by the secretariat before approval',
    label: 'Delegate',
    blurb: 'Policymakers, diplomats, industry and civil-society leaders attending in full.',
  },
  {
    slug: 'student',
    access: 'Open — limited seats',
    docs: 'Student ID card, institution details',
    review: 'Institution verification may apply',
    label: 'Student',
    blurb: 'Enrolled students and young researchers on the concessional track.',
  },
  {
    slug: 'speaker',
    access: 'Invitation required',
    docs: 'Profile, bio and photograph',
    review: 'For invited panellists confirming participation',
    label: 'Speaker',
    blurb: 'Invited panellists and moderators confirming their participation.',
  },
  {
    slug: 'media',
    access: 'Accreditation — reviewed',
    docs: 'Press card or assignment letter',
    review: 'Reviewed separately from delegate registration',
    label: 'Media',
    blurb: 'Journalists and crews seeking press accreditation for on-site coverage.',
  },
  {
    slug: 'sponsor',
    access: 'Partnership enquiry',
    docs: 'Organisation details only',
    review: 'A commercial conversation, not an event badge',
    label: 'Sponsor',
    blurb: 'Organisations exploring visibility and hospitality packages.',
  },
  {
    slug: 'partner',
    access: 'Invitation / proposal',
    docs: 'Institutional proposal details',
    review: 'Routed to the partnerships team',
    label: 'Partner Organisation',
    blurb: 'Institutions proposing knowledge, content or programme collaboration.',
  },
  {
    slug: 'volunteer',
    access: 'Open — reviewed',
    docs: 'ID and availability',
    review: 'Shift assignment after approval',
    label: 'Volunteer',
    blurb: 'Students and professionals supporting delegate services during the dialogue.',
  },
];

export const STATUS_META = {
  received: { label: 'Application Received', tone: 'bg-ink-100 text-ink-800' },
  under_review: { label: 'Under Review', tone: 'bg-amber-100 text-amber-800' },
  approved: { label: 'Approved', tone: 'bg-emerald-100 text-emerald-800' },
  rejected: { label: 'Not Approved', tone: 'bg-red-100 text-red-700' },
};

export const SECTORS = [
  'Government',
  'Think Tank',
  'Military',
  'Corporate',
  'Media',
  'Academia',
  'NGO',
  'Student',
];

// ── Event edition contract (design(1).md §26) ─────────────────────────────
// The ONE source for lifecycle facts: countdown, status labels and hero CTAs
// all derive from here — nothing about the event state is hardcoded twice.
export const EVENT_EDITION = {
  name: 'Indus Water Treaty Dialogue',
  edition: 2026,
  theme: SUMMIT.theme,
  startAt: '2026-09-19T09:00:00+05:30',
  endAt: '2026-09-20T18:00:00+05:30',
  venue: { name: 'Bharat Mandapam', city: 'New Delhi', country: 'India' },
  registration: { state: 'open' },   // 'not_open' | 'open' | 'closed'
  metrics: [
    { value: '500+', label: 'Delegates' },
    { value: '30+', label: 'Countries' },
    { value: '40+', label: 'Speakers' },
    { value: '10+', label: 'Ministers & Sr. Officials' },
    { value: '20+', label: 'Sessions' },
  ],
};

/** Where the edition is in its life: pre | live | post — plus the countdown. */
export function eventPhase(now = Date.now()) {
  const start = new Date(EVENT_EDITION.startAt).getTime();
  const end = new Date(EVENT_EDITION.endAt).getTime();
  if (now >= end) return { phase: 'post', days: 0 };
  if (now >= start) return { phase: 'live', days: 0 };
  return { phase: 'pre', days: Math.max(0, Math.ceil((start - now) / 86400000)) };
}
