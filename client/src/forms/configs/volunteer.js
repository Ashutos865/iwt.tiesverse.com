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
          options: [
            '16 Feb (set-up)',
            '17 Feb (Day 1)',
            '18 Feb (Day 2)',
            '19 Feb (Day 3)',
            '20 Feb (wrap-up)',
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
