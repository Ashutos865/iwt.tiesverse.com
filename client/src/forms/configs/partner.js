import { personalStep, photoField, reviewStep, uploadsStep, DOC_ACCEPT } from './commonSteps.js';

export default {
  category: 'partner',
  label: 'Partner Organisation',
  intro: 'For institutions proposing knowledge, content or programme collaboration.',
  steps: [
    personalStep,
    {
      id: 'organisation',
      title: 'Organisation & Proposal',
      description: 'Partnership proposals are reviewed by the programme committee.',
      fields: [
        { name: 'orgName', label: 'Organisation name', type: 'text', required: true },
        {
          name: 'orgType',
          label: 'Type of organisation',
          type: 'select',
          required: true,
          options: [
            'Think Tank',
            'University',
            'Government Body',
            'International Organisation',
            'Industry Association',
            'Civil Society / NGO',
            'Media Organisation',
          ],
        },
        { name: 'designation', label: 'Your designation', type: 'text', required: true },
        { name: 'orgWebsite', label: 'Organisation website', type: 'url' },
        { name: 'headquarters', label: 'Headquarters (city, country)', type: 'text' },
        {
          name: 'partnershipInterest',
          label: 'Nature of the proposed partnership',
          type: 'checkboxes',
          required: true,
          options: [
            'Co-hosting a session',
            'Research collaboration',
            'Delegation participation',
            'Knowledge / report partner',
            'Outreach & community',
          ],
        },
        {
          name: 'proposalSummary',
          label: 'Summary of your proposal',
          type: 'textarea',
          maxLength: 1500,
          rows: 6,
        },
      ],
    },
    uploadsStep([
      { ...photoField, required: false, hint: 'Optional. Used on your delegate badge.' },
      {
        name: 'proposal',
        label: 'Detailed proposal document',
        type: 'file',
        accept: DOC_ACCEPT,
        maxSizeMB: 5,
      },
    ]),
    reviewStep,
  ],
};
