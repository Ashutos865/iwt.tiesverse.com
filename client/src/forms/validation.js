/**
 * Translates a plain field config into react-hook-form `rules`, so category
 * configs stay declarative data with no validation code of their own.
 */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const URL_RE = /^https?:\/\/.+/i;

export function rulesFor(field) {
  const rules = {};

  if (field.required) {
    rules.required = field.type === 'file' ? 'Please upload this document.' : 'This field is required.';
  }
  if (field.minLength) {
    rules.minLength = { value: field.minLength, message: `Use at least ${field.minLength} characters.` };
  }
  if (field.maxLength) {
    rules.maxLength = { value: field.maxLength, message: `Keep this under ${field.maxLength} characters.` };
  }
  if (field.pattern) rules.pattern = field.pattern;

  const validators = {};

  if (field.type === 'email') {
    validators.email = (v) => !v || EMAIL_RE.test(v) || 'Enter a valid email address.';
  }
  if (field.type === 'url') {
    validators.url = (v) => !v || URL_RE.test(v) || 'Enter a full URL starting with https://';
  }
  if (field.type === 'number') {
    validators.number = (v) => {
      if (v === '' || v === undefined || v === null) return true;
      if (Number.isNaN(Number(v))) return 'Enter a number.';
      if (field.min !== undefined && Number(v) < field.min) return `Must be at least ${field.min}.`;
      if (field.max !== undefined && Number(v) > field.max) return `Must be at most ${field.max}.`;
      return true;
    };
  }
  if (field.type === 'file') {
    validators.size = (file) => {
      if (!file) return true;
      const maxBytes = (field.maxSizeMB || 5) * 1024 * 1024;
      return file.size <= maxBytes || `File must be under ${field.maxSizeMB || 5} MB.`;
    };
    validators.fileType = (file) => {
      if (!file || !field.accept) return true;
      const accepted = field.accept.split(',').map((t) => t.trim());
      const ok = accepted.some((t) =>
        t.endsWith('/*') ? file.type.startsWith(t.slice(0, -1)) : file.type === t,
      );
      return ok || 'That file type is not accepted.';
    };
  }
  if (field.type === 'checkboxes' && field.required) {
    validators.atLeastOne = (v) => (Array.isArray(v) && v.length > 0) || 'Choose at least one option.';
  }

  if (Object.keys(validators).length) rules.validate = validators;
  return rules;
}

/** Fields whose `showIf` currently returns false are skipped by validation. */
export const isVisible = (field, values) => (field.showIf ? Boolean(field.showIf(values)) : true);

export const visibleFields = (step, values) =>
  (step.fields || []).filter((f) => isVisible(f, values));
