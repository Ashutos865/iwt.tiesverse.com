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
    if (name === 'emailToken') continue;          // proof, not an answer
    if (value instanceof File) {
      formData.append(name, value);
    } else if (value !== undefined && value !== '') {
      data[name] = value;
    }
  }
  formData.append('data', JSON.stringify(data));
  if (values.emailToken) formData.append('emailToken', values.emailToken);
  return formData;
}

/**
 * Context rail (design.md §14.1): the selected role is a fixed label, not a
 * switcher — changing category mid-form is an explicit, warned action so a
 * half-filled application is never silently invalidated.
 */
function Sidebar({ activeSlug }) {
  const navigate = useNavigate();
  const active = CATEGORIES.find((c) => c.slug === activeSlug);

  const changeCategory = () => {
    const ok = window.confirm(
      'Change category? Anything you have entered in this application will be discarded.',
    );
    if (ok) navigate('/register');
  };

  return (
    <aside className="no-print hidden w-64 shrink-0 space-y-6 lg:block">
      <div className="card !p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-800">
          Your application
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-xs font-semibold text-ink-500">Category</dt>
            <dd className="mt-0.5 flex items-center gap-2 font-bold text-ink-900">{active?.label}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-ink-500">Access</dt>
            <dd className="mt-0.5 text-ink-700">{active?.access}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-ink-500">Have ready</dt>
            <dd className="mt-0.5 text-ink-700">{active?.docs}</dd>
          </div>
        </dl>
        <button type="button" onClick={changeCategory} className="btn-text !min-h-0 mt-4 text-xs">
          Change category
        </button>
      </div>

      <div className="rounded-card border border-brand-100 bg-brand-50 p-5 text-sm">
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
