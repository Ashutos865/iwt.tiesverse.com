import { personalStep, photoField, reviewStep, uploadsStep, DOC_ACCEPT } from './commonSteps.js';

export default {
  category: 'sponsor',
  label: 'Sponsor',
  intro: 'Explore visibility, hospitality and thought-leadership packages.',
  steps: [
    personalStep,
    {
      id: 'company',
      title: 'Company & Interest',
      description: 'The partnerships team responds within three working days.',
      fields: [
        { name: 'companyName', label: 'Company name', type: 'text', required: true },
        { name: 'designation', label: 'Your designation', type: 'text', required: true },
        { name: 'companyWebsite', label: 'Company website', type: 'url' },
        {
          name: 'industry',
          label: 'Industry',
          type: 'select',
          options: [
            'Aerospace & Defence',
            'Technology',
            'Energy',
            'Financial Services',
            'Consulting',
            'Manufacturing',
            'Healthcare',
            'Other',
          ],
        },
        {
          name: 'sponsorshipTier',
          label: 'Package of interest',
          type: 'select',
          required: true,
          options: ['Presenting Partner', 'Principal Partner', 'Session Partner', 'Hospitality Partner', 'Exploring options'],
        },
        {
          name: 'objectives',
          label: 'What are you hoping to achieve?',
          type: 'checkboxes',
          options: [
            'Brand visibility',
            'Speaking opportunity',
            'Government engagement',
            'Client hospitality',
            'Talent & recruitment',
          ],
        },
        {
          name: 'message',
          label: 'Tell us about your interest',
          type: 'textarea',
          required: true,
          maxLength: 1000,
          rows: 5,
        },
      ],
    },
    uploadsStep([
      { ...photoField, required: false, hint: 'Optional. Used on your delegate badge.' },
      {
        name: 'companyProfile',
        label: 'Company profile / deck',
        type: 'file',
        accept: DOC_ACCEPT,
        maxSizeMB: 5,
      },
    ]),
    reviewStep,
  ],
};
