/**
 * Numbered-circle progress rail, as on the mockup's registration flow:
 * filled teal circle for the active step, tick for completed, hollow for
 * upcoming, joined by hairlines.
 */
export default function StepIndicator({ steps, current, onJump }) {
  return (
    <>
      {/* Mobile: the circle rail collapses into a compact counter (design.md §14.2). */}
      <div className="mb-5 sm:hidden" aria-live="polite">
        <p className="text-sm font-bold text-ink-900">
          Step {current + 1} of {steps.length}: {steps[current].title}
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-teal-700 transition-all"
            style={{ width: `${((current + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <ol className="mb-8 hidden items-start sm:flex">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step.id} className={`flex ${i < steps.length - 1 ? 'flex-1' : ''} items-start`}>
            <button
              type="button"
              disabled={i > current}
              onClick={() => onJump(i)}
              className={`flex w-16 flex-col items-center gap-1.5 text-center sm:w-24 ${
                i > current ? 'cursor-default' : 'cursor-pointer hover:opacity-80'
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                  active
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : done
                      ? 'border-teal-700 bg-white text-teal-700'
                      : 'border-ink-200 bg-white text-ink-600/50'
                }`}
              >
                {done ? '✓' : i + 1}
              </span>
              <span
                className={`hidden text-[11px] font-medium leading-tight sm:block ${
                  active ? 'text-ink-900' : 'text-ink-600/60'
                }`}
              >
                {step.title}
              </span>
            </button>

            {i < steps.length - 1 && (
              <span
                className={`mt-[17px] h-0.5 flex-1 ${done ? 'bg-teal-700' : 'bg-ink-200'}`}
              />
            )}
          </li>
        );
      })}
      </ol>
    </>
  );
}
