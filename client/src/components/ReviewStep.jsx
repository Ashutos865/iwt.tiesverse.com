import { visibleFields } from '../forms/validation.js';

function displayValue(field, value) {
  if (value === undefined || value === null || value === '') return '—';
  if (field.type === 'file') return value.name || '—';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  return String(value);
}

/**
 * Walks the config so the summary can never drift from the questions actually
 * asked — including conditional fields the applicant never saw.
 */
export default function ReviewStep({ config, values, onEditStep }) {
  const answeredSteps = config.steps.filter((s) => s.type !== 'review');

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-600/80">
        Check every detail before submitting. Once submitted, changes require contacting the
        secretariat.
      </p>

      {answeredSteps.map((step, index) => {
        const fields = visibleFields(step, values);
        if (!fields.length) return null;

        return (
          <section key={step.id} className="rounded-lg border border-ink-100 bg-ink-50/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-800">
                {step.title}
              </h3>
              <button
                type="button"
                onClick={() => onEditStep(index)}
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Edit
              </button>
            </div>

            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-ink-600/60">
                    {field.label}
                  </dt>
                  <dd className="mt-0.5 break-words text-sm text-ink-900">
                    {displayValue(field, values[field.name])}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}
    </div>
  );
}
