/**
 * Compact lifecycle timeline (design.md §21.4):
 * Submitted → Under review → Approved → Badge ready. Future stages render
 * muted with no invented dates; a rejected application shows its own end.
 */
const FLOW = [
  { key: 'received', label: 'Submitted' },
  { key: 'under_review', label: 'Under review' },
  { key: 'approved', label: 'Approved' },
  { key: 'badge', label: 'QR pass ready' },
];

export default function ApplicationTimeline({ status, submittedAt }) {
  if (status === 'rejected') {
    return (
      <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <li className="pill-muted">Submitted{submittedAt ? ` · ${new Date(submittedAt).toLocaleDateString()}` : ''}</li>
        <li aria-hidden="true" className="text-ink-500">→</li>
        <li className="pill-muted">Reviewed</li>
        <li aria-hidden="true" className="text-ink-500">→</li>
        <li className="pill-bad">Not approved</li>
      </ol>
    );
  }

  const reachedIndex =
    status === 'approved' ? 3 : status === 'under_review' ? 1 : 0;

  return (
    <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold" aria-label="Application progress">
      {FLOW.map((step, i) => {
        const done = i <= reachedIndex;
        const isCurrent = i === reachedIndex;
        return (
          <li key={step.key} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="text-ink-500">→</span>}
            <span className={done ? (isCurrent ? 'pill-info' : 'pill-ok') : 'pill-muted !text-ink-500/60'}>
              {done && !isCurrent ? '✓ ' : ''}{step.label}
              {step.key === 'received' && submittedAt ? ` · ${new Date(submittedAt).toLocaleDateString()}` : ''}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
