import { STATUS_META } from '../lib/constants.js';

export default function StatusBadge({ status, className = '' }) {
  const meta = STATUS_META[status] || { label: status, tone: 'bg-ink-100 text-ink-800' };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${meta.tone} ${className}`}
    >
      {meta.label}
    </span>
  );
}
