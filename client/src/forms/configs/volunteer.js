import {
  personalStep,
  photoField,
  govIdField,
  reviewStep,
  uploadsStep,
} from './commonSteps.js';

export default {
  category: 'volunteer',
  label: 'Volunteer',
  intro: 'Support delegate services, registration desks and session logistics.',
  steps: [
    personalStep,
    {
      id: 'volunteering',
      title: 'Availability & Skills',
      description: 'Shortlisted volunteers are called for a short briefing before the summit.',
      fields: [
        { name: 'affiliation', label: 'Institution or employer', type: 'text' },
        {
          name: 'availability',
          label: 'Days you are available',
          type: 'checkboxes',
          required: true,
          // The dialogue is a single day — 19 September 2026 — with set-up the
          // day before and wrap-up the day after.
          options: [
            '18 Sept (set-up)',
            '19 Sept (event day)',
            '20 Sept (wrap-up)',
          ],
        },
        {
          name: 'skills',
          label: 'Where can you help?',
          type: 'checkboxes',
          required: true,
          options: [
            'Registration desk',
            'Delegate liaison',
            'Session support',
            'Media desk',
            'Transport & logistics',
            'Social media',
            'Photography',
          ],
        },
        {
          name: 'languages',
          label: 'Languages spoken',
          type: 'text',
          placeholder: 'e.g. English, Hindi, French',
        },
        {
          name: 'priorExperience',
          label: 'Prior event experience',
          type: 'textarea',
          rows: 3,
        },
        {
          name: 'tshirtSize',
          label: 'T-shirt size',
          type: 'select',
          options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        },
        {
          name: 'motivation',
          label: 'Why do you want to volunteer?',
          type: 'textarea',
          required: true,
          maxLength: 800,
          rows: 5,
        },
      ],
    },
    uploadsStep([photoField, { ...govIdField, required: false }]),
    reviewStep,
  ],
};
