import { Controller } from 'react-hook-form';
import FileInput from './FileInput.jsx';
import { rulesFor } from '../forms/validation.js';

/**
 * Renders one config field. Every input type the category configs can use is
 * handled here — configs never contain JSX.
 */
export default function FieldRenderer({ field, form }) {
  const { register, control, formState } = form;
  const error = formState.errors[field.name];
  const rules = rulesFor(field);
  const inputClass = `input ${error ? 'input-error' : ''}`;

  const wide =
    field.type === 'textarea' || field.type === 'checkboxes' || field.type === 'file' || field.full;

  return (
    <div className={wide ? 'sm:col-span-2 xl:col-span-3' : ''}>
      <label className="label" htmlFor={field.name}>
        {field.label}
        {field.required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {renderControl()}

      {field.hint && !error && <p className="hint">{field.hint}</p>}
      {error && <p className="error-text">{error.message}</p>}
    </div>
  );

  function renderControl() {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.name}
            rows={field.rows || 4}
            placeholder={field.placeholder}
            className={inputClass}
            {...register(field.name, rules)}
          />
        );

      case 'select':
        return (
          <select id={field.name} className={inputClass} defaultValue="" {...register(field.name, rules)}>
            <option value="" disabled>
              {field.placeholder || 'Select an option'}
            </option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="flex flex-wrap gap-3">
            {field.options.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-2 text-sm hover:border-brand-400"
              >
                <input type="radio" value={opt} {...register(field.name, rules)} />
                {opt}
              </label>
            ))}
          </div>
        );

      case 'checkboxes':
        return (
          <div className="flex flex-wrap gap-3">
            {field.options.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-2 text-sm hover:border-brand-400"
              >
                <input type="checkbox" value={opt} {...register(field.name, rules)} />
                {opt}
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={rules}
            defaultValue={null}
            render={({ field: ctrl }) => (
              <FileInput
                field={field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                hasError={Boolean(error)}
              />
            )}
          />
        );

      default:
        return (
          <input
            id={field.name}
            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
            inputMode={field.type === 'tel' ? 'tel' : undefined}
            placeholder={field.placeholder}
            max={field.type === 'date' ? field.max : undefined}
            className={inputClass}
            {...register(field.name, rules)}
          />
        );
    }
  }
}
