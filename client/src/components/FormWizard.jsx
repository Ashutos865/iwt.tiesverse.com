import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import StepIndicator from './StepIndicator.jsx';
import FieldRenderer from './FieldRenderer.jsx';
import ReviewStep from './ReviewStep.jsx';
import { visibleFields } from '../forms/validation.js';

/**
 * One multi-step engine driven entirely by a category config. A single
 * useForm instance spans every step, so going back never loses answers and
 * the review step can read the whole set at once.
 */
export default function FormWizard({ config, onSubmit, submitting, serverError }) {
  const [stepIndex, setStepIndex] = useState(0);
  const form = useForm({ mode: 'onTouched', shouldUnregister: false });
  const { control, handleSubmit, trigger, getValues, setError } = form;

  // Subscribing to all values keeps showIf conditions and the review step live.
  const values = useWatch({ control }) || {};

  const step = config.steps[stepIndex];
  const isReview = step.type === 'review';
  const isLast = stepIndex === config.steps.length - 1;
  const fields = isReview ? [] : visibleFields(step, values);

  async function next() {
    const ok = await trigger(fields.map((f) => f.name), { shouldFocus: true });
    if (ok) {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function back() {
    setStepIndex((i) => Math.max(0, i - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function jump(target) {
    if (target <= stepIndex) {
      setStepIndex(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Validate every visible field across all steps before submitting — the
   * review step can be reached with a later step still invalid only if config
   * changes, but this keeps that safe. Server field errors are mapped back
   * onto their inputs and the user is sent to the first offending step.
   */
  async function submit() {
    const allFields = config.steps
      .filter((s) => s.type !== 'review')
      .flatMap((s) => visibleFields(s, values))
      .map((f) => f.name);

    const ok = await trigger(allFields, { shouldFocus: true });
    if (!ok) return;

    try {
      await onSubmit(getValues());
    } catch (err) {
      if (err.fields) {
        for (const [name, message] of Object.entries(err.fields)) {
          setError(name, { type: 'server', message });
        }
        const badStep = config.steps.findIndex((s) =>
          (s.fields || []).some((f) => f.name in err.fields),
        );
        if (badStep >= 0) setStepIndex(badStep);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <StepIndicator steps={config.steps} current={stepIndex} onJump={jump} />

      <div className="card">
        <h2 className="font-display text-2xl text-ink-900">{step.title}</h2>
        {step.description && <p className="mt-1 text-sm text-ink-600/80">{step.description}</p>}

        <div className="mt-6">
          {isReview ? (
            <ReviewStep config={config} values={values} onEditStep={jump} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {fields.map((field) => (
                <FieldRenderer key={field.name} field={field} form={form} />
              ))}
            </div>
          )}
        </div>

        {serverError && (
          <p className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {serverError}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-6">
          <button type="button" onClick={back} disabled={stepIndex === 0} className="btn-ghost">
            Back
          </button>

          <p className="hidden text-xs text-ink-600/60 sm:block">
            Step {stepIndex + 1} of {config.steps.length}
          </p>

          {isLast ? (
            <button type="submit" disabled={submitting} className="btn-primary uppercase tracking-wide">
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>
          ) : (
            <button type="button" onClick={next} className="btn-dark uppercase tracking-wide">
              Save & Continue
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
