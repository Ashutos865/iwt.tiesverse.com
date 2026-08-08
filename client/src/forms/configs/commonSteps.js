import { SECTORS } from '../../lib/constants.js';

/**
 * Field fragments every category reuses. Categories import these and splice in
 * their own fields, so the seven configs stay small and consistent.
 */

export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';
export const DOC_ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf';

export const personalFields = [
  { name: 'fullName', label: 'Full name', type: 'text', required: true, placeholder: 'As printed on your ID' },
  {
    name: 'gender',
    label: 'Gender',
    type: 'select',
    required: true,
    options: ['Male', 'Female', 'Other', 'Prefer not to say'],
  },
  { name: 'nationality', label: 'Nationality', type: 'text', required: true, placeholder: 'e.g. Indian' },
  { name: 'dob', label: 'Date of birth', type: 'date', required: true },
  { name: 'email', label: 'Email address', type: 'emailVerify', required: true,
    hint: 'Verify this address so we can send your pass.' },
  { name: 'phone', label: 'Phone (with country code)', type: 'tel', required: true, placeholder: '+91 98765 43210' },
  { name: 'linkedin', label: 'LinkedIn profile', type: 'url', placeholder: 'https://linkedin.com/in/…' },
];

export const personalStep = {
  id: 'personal',
  title: 'Personal Details',
  description: 'Your details must match the identity document you upload.',
  fields: personalFields,
};

export const professionalFields = [
  { name: 'organisation', label: 'Organisation', type: 'text', required: true },
  { name: 'designation', label: 'Designation', type: 'text', required: true },
  { name: 'sector', label: 'Sector', type: 'select', required: true, options: SECTORS },
  { name: 'yearsExperience', label: 'Years of experience', type: 'number', min: 0, max: 70 },
  { name: 'orgWebsite', label: 'Organisation website', type: 'url' },
  {
    name: 'bio',
    label: 'Short professional bio',
    type: 'textarea',
    required: true,
    maxLength: 1000,
    rows: 5,
    hint: 'Up to 1000 characters. Used for delegate listings.',
  },
];

/** Foreign nationals must add a passport scan; Indian nationals never see it. */
export const isForeignNational = (values) =>
  Boolean(values.nationality) && !/^indian?$/i.test(String(values.nationality).trim());

export const photoField = {
  name: 'photo',
  label: 'Passport-style photograph',
  type: 'file',
  required: true,
  accept: IMAGE_ACCEPT,
  maxSizeMB: 2,
  hint: 'Recent, plain background. Printed on your badge.',
};

export const govIdField = {
  name: 'govId',
  label: 'Government-issued ID',
  type: 'file',
  required: true,
  accept: DOC_ACCEPT,
  maxSizeMB: 5,
  hint: 'Aadhaar, passport, driving licence or voter ID.',
};

export const passportField = {
  name: 'passportScan',
  label: 'Passport (foreign nationals)',
  type: 'file',
  accept: DOC_ACCEPT,
  maxSizeMB: 5,
  showIf: isForeignNational,
  hint: 'Photo page only. Required for visa support letters.',
};

export const optionalStep = {
  id: 'optional',
  title: 'Travel & Preferences',
  description: 'Optional, but it helps us plan access, catering and visa support.',
  fields: [
    { name: 'passportNumber', label: 'Passport number', type: 'text' },
    {
      name: 'visaStatus',
      label: 'Visa status',
      type: 'select',
      options: ['Not required', 'Already held', 'Applying', 'Need invitation letter'],
    },
    {
      name: 'dietary',
      label: 'Dietary preference',
      type: 'select',
      options: ['No preference', 'Vegetarian', 'Vegan', 'Jain', 'Halal', 'Kosher', 'Gluten-free'],
    },
    {
      name: 'accessibility',
      label: 'Accessibility requirements',
      type: 'textarea',
      rows: 3,
      placeholder: 'Wheelchair access, interpretation, seating…',
    },
    { name: 'emergencyName', label: 'Emergency contact name', type: 'text' },
    { name: 'emergencyPhone', label: 'Emergency contact phone', type: 'tel' },
  ],
};

export const reviewStep = { id: 'review', title: 'Review & Submit', type: 'review' };

export const uploadsStep = (fields) => ({
  id: 'uploads',
  title: 'Documents',
  description: 'Clear scans or photos. JPG, PNG or PDF.',
  fields,
});
