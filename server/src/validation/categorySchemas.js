/**
 * Server-side truth about what a registration requires. The client form mirrors
 * this, but the client is never trusted — every submission is re-checked here.
 *
 * One form, one field set. The seven multi-step category flows this replaced
 * each asked for personal details, documents and a category-specific essay,
 * which is a lot to demand before anyone has been accepted. Registration now
 * collects only what the secretariat needs to make that decision; documents
 * (photo, government ID, press card) are requested after approval, from people
 * who are actually coming, rather than from everyone who expresses interest.
 *
 * `prefix` feeds the registration id (IWT26-<prefix>-00001), so the id still
 * says at a glance which kind of participant a pass belongs to.
 */

/** The six categories, in the order they appear in the form's dropdown. */
export const CATEGORY_SCHEMAS = {
  diplomat: {
    label: 'Diplomat',
    prefix: 'DIP',
  },
  policy: {
    label: 'Policy & Government',
    prefix: 'POL',
  },
  academic: {
    label: 'Academic / Researcher',
    prefix: 'ACA',
  },
  media: {
    label: 'Media',
    prefix: 'MED',
  },
  industry: {
    label: 'Industry / Corporate',
    prefix: 'IND',
  },
  other: {
    label: 'Other (Invited Participant)',
    prefix: 'INV',
  },
};

/**
 * Required of every registrant, whatever their category. Kept deliberately
 * short: name, who they are, where they are from, how to reach them.
 */
export const REQUIRED_FIELDS = [
  'fullName',
  'designation',
  'organisation',
  'country',
  'email',
  'phone',
];

/**
 * No file is collected at registration. Retained as empty exports because the
 * upload middleware and admin still import them; multer declaring an empty
 * field list simply accepts no files, which is the intent.
 */
export const ALL_FILE_FIELDS = [];

export const CATEGORIES = Object.keys(CATEGORY_SCHEMAS);

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
// Digits, spaces and the usual separators; 8–15 digits covers international
// numbers with or without a country code.
const PHONE_RE = /^[+()\-.\s\d]{8,24}$/;

/**
 * Checks a submission. Returns `{ field: message }` — empty object means valid.
 *
 * `files` is accepted and ignored so existing callers need no change.
 */
export function validateSubmission(category, data, _files) {
  const errors = {};

  if (!CATEGORY_SCHEMAS[category]) {
    errors.category = 'Choose a registration category.';
  }

  for (const field of REQUIRED_FIELDS) {
    const value = data[field];
    const empty =
      value === undefined || value === null || String(value).trim() === '';
    if (empty) errors[field] = 'This field is required.';
  }

  if (data.email && !EMAIL_RE.test(String(data.email).trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (data.phone && !PHONE_RE.test(String(data.phone).trim())) {
    errors.phone = 'Enter a valid phone number.';
  }

  // The consent box is a legal record of agreement, so it is checked here and
  // not only in the browser where it can be bypassed.
  if (data.agreeTerms !== true && String(data.agreeTerms) !== 'true') {
    errors.agreeTerms = 'Please accept the terms and privacy policy.';
  }

  return errors;
}
