import {
  personalStep,
  govIdField,
  passportField,
  optionalStep,
  reviewStep,
  uploadsStep,
  IMAGE_ACCEPT,
} from './commonSteps.js';

export default {
  category: 'speaker',
  label: 'Speaker',
  intro: 'For invited panellists and moderators confirming their participation.',
  steps: [
    personalStep,
    {
      id: 'speaking',
      title: 'Profile & Sessions',
      description: 'Your bio and headshot appear in the programme and on the speakers page.',
      fields: [
        { name: 'organisation', label: 'Organisation', type: 'text', required: true },
        { name: 'designation', label: 'Designation', type: 'text', required: true },
        {
          name: 'speakerBio',
          label: 'Speaker biography',
          type: 'textarea',
          required: true,
          maxLength: 1200,
          rows: 6,
          hint: 'Third person, up to 1200 characters. Printed as supplied.',
        },
        {
          name: 'sessionPreferences',
          label: 'Session themes you would speak on',
          type: 'checkboxes',
          required: true,
          options: [
            'Geopolitics & Multilateralism',
            'Security & Defence',
            'Technology & AI Governance',
            'Climate & Energy Transition',
            'Trade & Supply Chains',
            'Global Health',
          ],
        },
        {
          name: 'sessionFormat',
          label: 'Preferred format',
          type: 'select',
          options: ['Panel discussion', 'Keynote', 'Fireside chat', 'Roundtable', 'No preference'],
        },
        { name: 'pastTalksUrl', label: 'Link to a past talk', type: 'url' },
        {
          name: 'accommodationPreference',
          label: 'Accommodation',
          type: 'select',
          options: ['Required — arrange for me', 'Arranging my own', 'Not travelling'],
        },
      ],
    },
    uploadsStep([
      {
        name: 'headshot',
        label: 'High-resolution headshot',
        type: 'file',
        required: true,
        accept: IMAGE_ACCEPT,
        maxSizeMB: 5,
        hint: 'At least 1000px wide. Used in print and on stage screens.',
      },
      { ...govIdField, required: false },
      { ...passportField, showIf: undefined, hint: 'For travel and visa support.' },
    ]),
    optionalStep,
    reviewStep,
  ],
};
