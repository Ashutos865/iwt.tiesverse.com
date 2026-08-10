export const SUMMIT = {
  name: 'Indus Water Treaty Dialogue 2026',
  displayTitle: 'Indus Water Treaty 2026',
  kicker: 'New Delhi International Dialogue on',
  shortName: 'IWT Dialogue 2026',
  theme: 'Blood and Water Cannot Flow Together: Law, Reciprocity and Regional Security',
  dates: '19–20 September 2026',
  venue: 'Bharat Mandapam, New Delhi',
  email: 'info@induswatertreaty.org',
  supportEmail: 'support@induswatertreaty.org',
  phone: '+91 11 XXXX XXXX',
  about:
    'The Indus Water Treaty has been one of the most enduring agreements in South Asia. Today, emerging realities demand a fresh assessment of its relevance, obligations and the path forward. The Dialogue aims to foster meaningful conversation, encourage cooperation and build consensus on the future of water, peace and prosperity in the region.',
};

export const STATS = [
  { value: '500+', label: 'Delegates' },
  { value: '30+', label: 'Countries' },
  { value: '40+', label: 'Speakers' },
  { value: '10+', label: 'Ministers' },
  { value: '20+', label: 'Sessions' },
  { value: '1', label: 'New Delhi Declaration' },
];

export const PARTNERS = ['ORF', 'RIS', 'CII', 'FICCI', 'ASSOCHAM', 'TERI', 'IWA'];

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
