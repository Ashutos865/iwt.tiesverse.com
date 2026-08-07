import {
  personalStep,
  professionalFields,
  photoField,
  govIdField,
  passportField,
  optionalStep,
  reviewStep,
  uploadsStep,
  DOC_ACCEPT,
} from './commonSteps.js';

export default {
  category: 'delegate',
  label: 'Delegate',
  intro: 'Full participation across all three days, including plenaries and ministerial sessions.',
  steps: [
    personalStep,
    {
      id: 'professional',
      title: 'Organisation & Role',
      description: 'Tells the secretariat how to place you in sessions and delegate groupings.',
      fields: professionalFields,
    },
    uploadsStep([
      photoField,
      govIdField,
      {
        name: 'orgId',
        label: 'Organisation ID card',
        type: 'file',
        accept: DOC_ACCEPT,
        maxSizeMB: 5,
        hint: 'Optional, but speeds up verification.',
      },
      passportField,
    ]),
    optionalStep,
    reviewStep,
  ],
};
