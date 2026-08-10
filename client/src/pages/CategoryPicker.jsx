import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { CATEGORIES } from '../lib/constants.js';

const ACCESS_TONE = (access) =>
  access.startsWith('Open') ? 'pill-ok'
    : access.startsWith('Invitation') ? 'pill-warn'
      : 'pill-info';

/**
 * Registration entry (design.md §13): the participant type is chosen BEFORE
 * any form begins. Each card states who it is for, whether it is open, and
 * what documents to have ready.
 */
export default function CategoryPicker() {
  return (
    <>
      <PageHero
        title="Registration"
        lead="Attendance is by application — each track is reviewed before participation is confirmed."
        meta={false}
      />

      <div className="shell max-w-5xl py-10 lg:py-14">
        <h2 className="font-display text-2xl font-semibold text-ink-900">How are you participating?</h2>
        <p className="mt-2 text-sm text-ink-700">
          Each track has its own application and verification requirements. Choose the one that fits you
          best — the secretariat can reassign you if needed.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              to={`/register/${category.slug}`}
              className="group card flex flex-col transition hover:-translate-y-0.5 hover:border-brand-600"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-ink-900">{category.label}</h3>
                <span className={ACCESS_TONE(category.access)}>{category.access}</span>
              </div>
              <p className="mt-1.5 text-sm text-ink-700">{category.blurb}</p>
              <dl className="mt-3 grid gap-1 border-t border-ink-100 pt-3 text-xs text-ink-500">
                <div className="flex gap-1.5">
                  <dt className="font-semibold text-ink-700">Have ready:</dt>
                  <dd>{category.docs}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="font-semibold text-ink-700">Process:</dt>
                  <dd>{category.review}</dd>
                </div>
              </dl>
              <span className="btn-text !min-h-0 mt-3 text-xs opacity-0 transition group-hover:opacity-100">
                Start application →
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-sm text-ink-700">
          Already applied?{' '}
          <Link to="/status" className="font-semibold text-brand-600 hover:underline">
            Check your application status
          </Link>
        </p>
      </div>
    </>
  );
}
