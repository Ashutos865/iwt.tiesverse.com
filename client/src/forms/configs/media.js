import {
  personalStep,
  photoField,
  govIdField,
  optionalStep,
  reviewStep,
  uploadsStep,
  DOC_ACCEPT,
} from './commonSteps.js';

export default {
  category: 'media',
  label: 'Media',
  intro: 'Press accreditation for journalists, photographers and broadcast crews.',
  steps: [
    personalStep,
    {
      id: 'outlet',
      title: 'Media House & Coverage',
      description: 'Accreditation is confirmed with your editor before a badge is issued.',
      fields: [
        { name: 'mediaHouse', label: 'Media house', type: 'text', required: true },
        { name: 'designation', label: 'Designation', type: 'text', required: true },
        {
          name: 'mediaType',
          label: 'Type of outlet',
          type: 'select',
          options: ['Print', 'Digital', 'Television', 'Radio', 'Wire service', 'Freelance'],
        },
        {
          name: 'coverageType',
          label: 'Coverage you plan to file',
          type: 'checkboxes',
          required: true,
          options: ['Written reporting', 'Photography', 'Video / broadcast', 'Live streaming', 'Podcast'],
        },
        { name: 'outletWebsite', label: 'Outlet website', type: 'url' },
        { name: 'pressCardNumber', label: 'Press card / PIB number', type: 'text' },
        { name: 'editorName', label: 'Editor / bureau chief name', type: 'text', required: true },
        { name: 'editorEmail', label: 'Editor email', type: 'email', required: true },
        {
          name: 'crewDetails',
          label: 'Accompanying crew',
          type: 'textarea',
          rows: 3,
          hint: 'Names and roles. Each crew member must register separately.',
        },
      ],
    },
    uploadsStep([
      photoField,
      {
        name: 'pressCard',
        label: 'Press card / accreditation',
        type: 'file',
        required: true,
        accept: DOC_ACCEPT,
        maxSizeMB: 5,
        hint: 'PIB card, outlet ID or a letter on your editor’s letterhead.',
      },
      { ...govIdField, required: false },
    ]),
    optionalStep,
    reviewStep,
  ],
};
