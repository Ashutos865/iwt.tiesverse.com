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
  category: 'student',
  label: 'Student',
  intro: 'Concessional access for enrolled students and early-career researchers.',
  steps: [
    personalStep,
    {
      id: 'academic',
      title: 'Academic Details',
      description: 'Enrolment is verified against your student ID card.',
      fields: [
        { name: 'institution', label: 'Institution', type: 'text', required: true },
        { name: 'course', label: 'Course / programme', type: 'text', required: true },
        {
          name: 'yearOfStudy',
          label: 'Year of study',
          type: 'select',
          required: true,
          options: ['1st year', '2nd year', '3rd year', '4th year', 'Postgraduate', 'Doctoral'],
        },
        { name: 'studentIdNumber', label: 'Student ID / roll number', type: 'text' },
        {
          name: 'areasOfInterest',
          label: 'Areas of interest',
          type: 'checkboxes',
          options: [
            'Geopolitics',
            'Security & Defence',
            'Technology & AI',
            'Climate & Energy',
            'Trade & Economy',
            'Global Health',
          ],
        },
        {
          name: 'motivation',
          label: 'Why do you want to attend?',
          type: 'textarea',
          required: true,
          maxLength: 800,
          rows: 5,
        },
      ],
    },
    uploadsStep([
      photoField,
      {
        name: 'studentIdCard',
        label: 'Student ID card',
        type: 'file',
        required: true,
        accept: DOC_ACCEPT,
        maxSizeMB: 5,
        hint: 'Must show your name, institution and validity.',
      },
      { ...govIdField, required: false, hint: 'Optional for students.' },
    ]),
    optionalStep,
    reviewStep,
  ],
};
