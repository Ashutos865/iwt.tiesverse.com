import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import FormWizard from '../components/FormWizard.jsx';
import { getConfig } from '../forms/configs/index.js';
import { api } from '../lib/api.js';
import { CATEGORIES, SUMMIT } from '../lib/constants.js';

/**
 * Files go up as their own multipart parts; every other answer is bundled into
 * one JSON string so multipart never turns numbers, booleans or arrays into
 * bare strings on the way to the server.
 */
function buildFormData(config, values) {
  const formData = new FormData();
  formData.append('category', config.category);

  const data = {};
  for (const [name, value] of Object.entries(values)) {
    if (value instanceof File) {
      formData.append(name, value);
    } else if (value !== undefined && value !== '') {
      data[name] = value;
    }
  }
  formData.append('data', JSON.stringify(data));
  return formData;
}

/** Right rail from the mockup: switch category + get help. */
function Sidebar({ activeSlug }) {
  return (
    <aside className="no-print hidden w-64 shrink-0 space-y-6 lg:block">
      <div className="card !p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-800">
          Registration Categories
        </h2>
        <ul className="mt-4 space-y-1">
          {CATEGORIES.map((category) => {
            const active = category.slug === activeSlug;
            return (
              <li key={category.slug}>
                <Link
                  to={`/register/${category.slug}`}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? 'bg-brand-50 font-semibold text-brand-700'
                      : 'text-ink-700 hover:bg-ink-50'
                  }`}
                >
                  <span
                    className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                      active ? 'border-brand-600 bg-brand-600 ring-2 ring-inset ring-white' : 'border-ink-200'
                    }`}
                  />
                  {category.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-xl border border-brand-100 bg-brand-50 p-5 text-sm">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
          Need help?
        </h2>
        <p className="mt-2 text-ink-700">
          For any assistance with registration, please contact us at
        </p>
        <p className="mt-2 font-semibold text-ink-900">{SUMMIT.phone}</p>
        <a href={`mailto:${SUMMIT.supportEmail}`} className="font-semibold text-brand-700 hover:underline">
          {SUMMIT.supportEmail}
        </a>
      </div>
    </aside>
  );
}

export default function RegisterWizard() {
  const { category } = useParams();
  const navigate = useNavigate();
  const config = getConfig(category);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (!config) return <Navigate to="/register" replace />;

  async function handleSubmit(values) {
    setSubmitting(true);
    setServerError('');
    try {
      const result = await api.submitRegistration(buildFormData(config, values));
      navigate('/register/success', {
        state: {
          registrationId: result.registrationId,
          email: values.email,
          categoryLabel: config.label,
        },
        replace: true,
      });
    } catch (err) {
      setServerError(err.message);
      throw err; // FormWizard maps err.fields back onto the inputs.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link to="/register" className="text-sm text-ink-600/70 hover:text-ink-900">
        ← All categories
      </Link>

      <div className="mb-8 mt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
          {config.label} Registration
        </p>
        <h1 className="mt-1 font-display text-3xl text-ink-900">{config.label} application</h1>
        {config.intro && <p className="mt-2 max-w-2xl text-sm text-ink-600/80">{config.intro}</p>}
      </div>

      <div className="flex gap-8">
        <div className="min-w-0 flex-1">
          <FormWizard
            key={config.category}
            config={config}
            onSubmit={handleSubmit}
            submitting={submitting}
            serverError={serverError}
          />
        </div>
        <Sidebar activeSlug={config.category} />
      </div>
    </div>
  );
}
