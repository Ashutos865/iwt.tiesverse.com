/**
 * Server-side truth about what each category requires. The client form configs
 * mirror this, but the client is never trusted — every submission is re-checked
 * here.
 *
 * `prefix` feeds the registration id (IWT26-<prefix>-00001).
 * `fileFields` is the union of file inputs multer must accept for a category;
 * `requiredFiles` is the subset that must actually arrive.
 */

const PERSONAL = ['fullName', 'gender', 'nationality', 'dob', 'email', 'phone'];

export const CATEGORY_SCHEMAS = {
  delegate: {
    label: 'Delegate',
    prefix: 'DEL',
    requiredFields: [...PERSONAL, 'organisation', 'designation', 'sector', 'bio'],
    fileFields: ['photo', 'govId', 'orgId', 'passportScan'],
    requiredFiles: ['photo', 'govId'],
  },
  student: {
    label: 'Student',
    prefix: 'STU',
    requiredFields: [...PERSONAL, 'institution', 'course', 'yearOfStudy', 'motivation'],
    fileFields: ['photo', 'govId', 'studentIdCard'],
    requiredFiles: ['photo', 'studentIdCard'],
  },
  speaker: {
    label: 'Speaker',
    prefix: 'SPK',
    requiredFields: [...PERSONAL, 'organisation', 'designation', 'speakerBio', 'sessionPreferences'],
    fileFields: ['headshot', 'govId', 'passportScan'],
    requiredFiles: ['headshot'],
  },
  media: {
    label: 'Media',
    prefix: 'MED',
    requiredFields: [
      ...PERSONAL,
      'mediaHouse',
      'designation',
      'coverageType',
      'editorName',
      'editorEmail',
    ],
    fileFields: ['photo', 'pressCard', 'govId'],
    requiredFiles: ['photo', 'pressCard'],
  },
  sponsor: {
    label: 'Sponsor',
    prefix: 'SPN',
    requiredFields: [...PERSONAL, 'companyName', 'designation', 'sponsorshipTier', 'message'],
    fileFields: ['photo', 'companyProfile'],
    requiredFiles: [],
  },
  partner: {
    label: 'Partner Organisation',
    prefix: 'PTR',
    requiredFields: [...PERSONAL, 'orgName', 'orgType', 'designation', 'partnershipInterest'],
    fileFields: ['photo', 'proposal'],
    requiredFiles: [],
  },
  volunteer: {
    label: 'Volunteer',
    prefix: 'VOL',
    requiredFields: [...PERSONAL, 'availability', 'skills', 'motivation'],
    fileFields: ['photo', 'govId'],
    requiredFiles: ['photo'],
  },
};

/** Every file field name across all categories — multer must declare the union. */
export const ALL_FILE_FIELDS = [
  ...new Set(Object.values(CATEGORY_SCHEMAS).flatMap((s) => s.fileFields)),
];

export const CATEGORIES = Object.keys(CATEGORY_SCHEMAS);

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Checks a submission against its category schema.
 * Returns `{ field: message }` — empty object means valid.
 */
export function validateSubmission(category, data, files) {
  const schema = CATEGORY_SCHEMAS[category];
  const errors = {};

  for (const field of schema.requiredFields) {
    const value = data[field];
    const empty =
      value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length);
    if (empty) errors[field] = 'This field is required.';
  }

  if (data.email && !EMAIL_RE.test(String(data.email))) {
    errors.email = 'Enter a valid email address.';
  }

  for (const field of schema.requiredFiles) {
    if (!files[field]) errors[field] = 'This document is required.';
  }

  return errors;
}
