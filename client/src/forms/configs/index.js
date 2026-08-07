import delegate from './delegate.js';
import student from './student.js';
import speaker from './speaker.js';
import media from './media.js';
import sponsor from './sponsor.js';
import partner from './partner.js';
import volunteer from './volunteer.js';

export const FORM_CONFIGS = { delegate, student, speaker, media, sponsor, partner, volunteer };

export const getConfig = (slug) => FORM_CONFIGS[slug] || null;
