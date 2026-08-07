import { Link } from 'react-router-dom';
import { CATEGORIES } from '../lib/constants.js';

export default function CategoryPicker() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Registration</p>
      <h1 className="mt-2 font-display text-3xl text-ink-900">Who are you registering as?</h1>
      <p className="mt-2 text-sm text-ink-600/80">
        Each track has its own application and verification requirements. Choose the one that fits you
        best — the secretariat can reassign you if needed.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            to={`/register/${category.slug}`}
            className="group card transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-ink-900">{category.label}</h2>
              <span className="text-brand-500 opacity-0 transition group-hover:opacity-100">→</span>
            </div>
            <p className="mt-1.5 text-sm text-ink-600/80">{category.blurb}</p>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-ink-600/70">
        Already applied?{' '}
        <Link to="/status" className="font-semibold text-brand-600 hover:underline">
          Check your application status
        </Link>
      </p>
    </div>
  );
}
