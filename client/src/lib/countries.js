/**
 * Country names for the registration form's select.
 *
 * Plain names rather than ISO codes: the value is stored and shown as-is on
 * the delegate list and badge, so what the applicant picks is what the
 * secretariat reads. India and the other basin states are listed first,
 * because most registrants come from them and scrolling past a full
 * alphabetical list to reach the obvious answer is friction for no gain.
 */

const PRIORITY = [
  'India',
  'Pakistan',
  'Afghanistan',
  'Bangladesh',
  'China',
  'Nepal',
  'Bhutan',
  'Sri Lanka',
];

const REST = [
  'Australia', 'Austria', 'Bahrain', 'Belgium', 'Brazil', 'Canada', 'Chile',
  'Denmark', 'Egypt', 'Ethiopia', 'Finland', 'France', 'Germany', 'Ghana',
  'Greece', 'Hungary', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyzstan',
  'Lebanon', 'Malaysia', 'Maldives', 'Mexico', 'Mongolia', 'Morocco',
  'Myanmar', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Oman',
  'Philippines', 'Poland', 'Portugal', 'Qatar', 'Russia', 'Saudi Arabia',
  'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sudan', 'Sweden',
  'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Turkey',
  'Turkmenistan', 'Uganda', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Uzbekistan', 'Vietnam', 'Yemen',
  'Zambia', 'Zimbabwe',
];

export const COUNTRIES = [...PRIORITY, ...REST.filter((c) => !PRIORITY.includes(c))];

/** Anything not listed — the form still accepts a free-typed value server-side. */
export const OTHER_COUNTRY = 'Other';
