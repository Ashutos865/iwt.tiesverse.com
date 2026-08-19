import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../lib/api.js';
import { COUNTRIES, OTHER_COUNTRY } from '../lib/countries.js';

/*
 * Registration: one form, one screen.
 *
 * This replaced a category picker leading to a seven-branch, multi-step wizard
 * that asked for documents and a category-specific essay before anyone had
 * been accepted. The secretariat only needs to know who is applying and how to
 * reach them in order to decide; photographs and identity documents are
 * collected after approval, from the people actually attending.
 *
 * Email is verified in place. The code is requested and entered without
 * leaving the form, and the token it returns is sent with the submission —
 * the server checks that token itself, so a browser claiming "verified"
 * proves nothing.
 */

/** Mirrors CATEGORY_SCHEMAS on the server; the server re-checks the value. */
const CATEGORIES = [
  { slug: 'diplomat', label: 'Diplomat' },
  { slug: 'policy', label: 'Policy & Government' },
  { slug: 'academic', label: 'Academic / Researcher' },
  { slug: 'media', label: 'Media' },
  { slug: 'industry', label: 'Industry / Corporate' },
  { slug: 'other', label: 'Other (Invited Participant)' },
];

const FIELDS = [
  { name: 'fullName', label: 'Full name', placeholder: 'Enter your full name', autoComplete: 'name' },
  { name: 'designation', label: 'Designation / Title', placeholder: 'Enter your designation', autoComplete: 'organization-title' },
  { name: 'organisation', label: 'Organisation / Institution', placeholder: 'Enter organisation / institution', autoComplete: 'organization' },
  { name: 'country', label: 'Country', type: 'country', placeholder: 'Select country', autoComplete: 'country-name' },
  { name: 'email', label: 'Email address', type: 'email', placeholder: 'Enter your email address', autoComplete: 'email' },
  { name: 'phone', label: 'Phone number', type: 'tel', placeholder: 'Enter your phone number', autoComplete: 'tel' },
];

const EMPTY = {
  fullName: '', designation: '', organisation: '',
  country: '', email: '', phone: '', category: '',
};

export default function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Email verification state.
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const verifiedEmail = useRef('');

  // Countdown for the resend link.
  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const emailVerified = Boolean(otpToken) && verifiedEmail.current === values.email.trim().toLowerCase();

  const set = (name) => (event) => {
    const value = event.target.value;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
    // Changing the address invalidates a code already proven for the old one.
    if (name === 'email' && otpToken) {
      setOtpToken('');
      setOtpSent(false);
      setOtpCode('');
    }
  };

  const emailLooksValid = useMemo(
    () => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email.trim()),
    [values.email],
  );

  async function sendCode() {
    if (!emailLooksValid) {
      setErrors((e) => ({ ...e, email: 'Enter a valid email address first.' }));
      return;
    }
    setOtpBusy(true);
    setOtpError('');
    try {
      const out = await api.sendEmailCode(values.email.trim());
      setOtpSent(true);
      setResendIn(Number(out?.resendIn) || 60);
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : 'Could not send the code. Try again.');
    } finally {
      setOtpBusy(false);
    }
  }

  async function checkCode() {
    if (!otpCode.trim()) return;
    setOtpBusy(true);
    setOtpError('');
    try {
      const out = await api.checkEmailCode(values.email.trim(), otpCode.trim());
      setOtpToken(out?.token || '');
      verifiedEmail.current = values.email.trim().toLowerCase();
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : 'That code is not right.');
    } finally {
      setOtpBusy(false);
    }
  }

  function validate() {
    const next = {};
    for (const f of FIELDS) {
      if (!String(values[f.name] || '').trim()) next[f.name] = 'This field is required.';
    }
    if (values.email && !emailLooksValid) next.email = 'Enter a valid email address.';
    if (!values.category) next.category = 'Choose a registration category.';
    if (!agree) next.agreeTerms = 'Please accept the terms and privacy policy.';
    return next;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setFormError('');
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      const first = document.querySelector('[data-invalid="true"]');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!emailVerified) {
      setOtpError('Please verify your email address before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      // Sent as multipart because the endpoint accepts uploads for other
      // callers; the text payload travels as one JSON string so numbers and
      // booleans are not coerced.
      const body = new FormData();
      body.append('category', values.category);
      body.append('emailToken', otpToken);
      body.append('data', JSON.stringify({
        fullName: values.fullName.trim(),
        designation: values.designation.trim(),
        organisation: values.organisation.trim(),
        country: values.country,
        email: values.email.trim(),
        phone: values.phone.trim(),
        agreeTerms: true,
      }));
      const out = await api.submitRegistration(body);
      navigate('/register/success', {
        state: { registrationId: out.registrationId, email: values.email.trim() },
      });
    } catch (err) {
      if (err instanceof ApiError && err.fields) {
        setErrors(err.fields);
        setFormError(err.message);
      } else {
        setFormError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = (name) =>
    `mt-1 w-full rounded-btn border bg-white px-3.5 py-2 text-sm text-ink-900 outline-none transition
     placeholder:text-ink-500/70 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20
     ${errors[name] ? 'border-rose-400' : 'border-ink-200'}`;

  return (
    <div className="agenda-split">
      <div className="shell grid gap-8 py-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.15fr)] lg:gap-12 lg:py-7">
        {/* ── Standing event header, matching the other pages ── */}
        <header className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-500">
            Dialogue by Tiesverse Foundation on
          </p>
          <h1 className="title-display mt-3 text-4xl leading-[0.95] text-ink-900 sm:text-5xl">
            INDUS
            <span className="mt-1 block">WATERS TREATY</span>
          </h1>
          <p className="mt-2 flex items-center gap-3 text-lg tracking-[0.34em] text-ink-700">
            <span aria-hidden="true" className="h-px w-8 bg-ink-200" />
            DIALOGUE
            <span aria-hidden="true" className="h-px flex-1 bg-ink-200" />
          </p>
          <p className="mt-5 font-title text-lg italic text-ink-700">
            &ldquo;Blood and Water cannot flow together&rdquo;
          </p>

          <dl className="mt-7 space-y-4">
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink-200 bg-white text-brand-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" />
                </svg>
              </span>
              <div>
                <dt className="text-sm font-bold text-ink-900">19 SEPTEMBER 2026</dt>
                <dd className="text-xs uppercase tracking-wide text-ink-500">Saturday</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink-200 bg-white text-brand-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" />
                </svg>
              </span>
              <div>
                <dt className="text-sm font-bold text-ink-900">BHARAT MANDAPAM</dt>
                <dd className="text-xs uppercase tracking-wide text-ink-500">New Delhi</dd>
              </div>
            </div>
          </dl>

          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-700">
            Official delegate registration for diplomats, partners, media and
            invited participants.
          </p>
        </header>

        {/* ── The form ── */}
        <section>
          <div className="card !p-5 sm:!p-6">
            <div className="flex items-start gap-3.5">
              <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <circle cx="12" cy="8.5" r="3.6" /><path d="M4.5 20c1.4-3.7 4.2-5.6 7.5-5.6s6.1 1.9 7.5 5.6" />
                </svg>
              </span>
              <div>
                <h2 className="text-xl font-bold text-brand-700">REGISTER NOW</h2>
                <p className="mt-1 text-sm text-ink-700">
                  Please fill in your details to register for the Dialogue.
                </p>
              </div>
            </div>

            <form onSubmit={onSubmit} noValidate className="mt-5">
              <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <div key={f.name} data-invalid={errors[f.name] ? 'true' : undefined}>
                    <label htmlFor={f.name} className="text-[11px] font-bold uppercase tracking-[0.09em] text-ink-700">
                      {f.label} <span className="text-rose-500">*</span>
                    </label>
                    {f.type === 'country' ? (
                      <select
                        id={f.name}
                        value={values[f.name]}
                        onChange={set(f.name)}
                        autoComplete={f.autoComplete}
                        className={inputClass(f.name)}
                      >
                        <option value="">{f.placeholder}</option>
                        {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        <option value={OTHER_COUNTRY}>{OTHER_COUNTRY}</option>
                      </select>
                    ) : (
                      <input
                        id={f.name}
                        type={f.type || 'text'}
                        value={values[f.name]}
                        onChange={set(f.name)}
                        placeholder={f.placeholder}
                        autoComplete={f.autoComplete}
                        className={inputClass(f.name)}
                      />
                    )}
                    {errors[f.name] && (
                      <p className="mt-1 text-xs text-rose-600">{errors[f.name]}</p>
                    )}

                    {/* Verification sits under the email field, so the code is
                        entered where the address was typed. */}
                    {f.name === 'email' && (
                      <div className="mt-2">
                        {emailVerified ? (
                          <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                            Email verified
                          </p>
                        ) : (
                          <>
                            {!otpSent ? (
                              <button
                                type="button"
                                onClick={sendCode}
                                disabled={otpBusy || !emailLooksValid}
                                className="text-xs font-semibold text-brand-700 underline underline-offset-2 disabled:opacity-50"
                              >
                                {otpBusy ? 'Sending…' : 'Send verification code'}
                              </button>
                            ) : (
                              <div className="flex flex-wrap items-center gap-2">
                                <input
                                  value={otpCode}
                                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                  inputMode="numeric"
                                  placeholder="Enter code"
                                  aria-label="Verification code"
                                  className="w-32 rounded-btn border border-ink-200 bg-white px-3 py-1.5 text-sm tracking-[0.2em] outline-none focus:border-teal-700"
                                />
                                <button
                                  type="button"
                                  onClick={checkCode}
                                  disabled={otpBusy || !otpCode.trim()}
                                  className="rounded-btn bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                                >
                                  {otpBusy ? 'Checking…' : 'Verify'}
                                </button>
                                <button
                                  type="button"
                                  onClick={sendCode}
                                  disabled={otpBusy || resendIn > 0}
                                  className="text-xs text-ink-500 underline underline-offset-2 disabled:opacity-50"
                                >
                                  {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend'}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                        {otpError && <p className="mt-1 text-xs text-rose-600">{otpError}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Category */}
              <div className="mt-3" data-invalid={errors.category ? 'true' : undefined}>
                <label htmlFor="category" className="text-[11px] font-bold uppercase tracking-[0.09em] text-ink-700">
                  Registration category <span className="text-rose-500">*</span>
                </label>
                <select
                  id="category"
                  value={values.category}
                  onChange={set('category')}
                  className={inputClass('category')}
                >
                  <option value="">Select your category</option>
                  {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                </select>
                {errors.category && <p className="mt-1 text-xs text-rose-600">{errors.category}</p>}
              </div>

              {/* The six categories as a hint line rather than a boxed list.
                  Spelling them out cost ~120px of height and repeated what the
                  menu directly above already contains, which pushed the submit
                  button off every laptop screen. */}
              <p className="mt-1.5 text-xs leading-relaxed text-ink-500">
                {CATEGORIES.map((c) => c.label).join(' · ')}
              </p>

              <div className="mt-4 flex items-start gap-2.5" data-invalid={errors.agreeTerms ? 'true' : undefined}>
                <input
                  id="agree"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => {
                    setAgree(e.target.checked);
                    setErrors((x) => ({ ...x, agreeTerms: undefined }));
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink-300 text-teal-700 focus:ring-teal-700/30"
                />
                <label htmlFor="agree" className="text-sm text-ink-700">
                  I agree to the{' '}
                  <a href="/terms" className="text-teal-700 underline underline-offset-2">terms and conditions</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-teal-700 underline underline-offset-2">privacy policy</a>.
                </label>
              </div>
              {errors.agreeTerms && <p className="mt-1 text-xs text-rose-600">{errors.agreeTerms}</p>}

              {formError && (
                <p role="alert" className="mt-4 rounded-btn bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-btn bg-teal-700 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:bg-teal-800 disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit registration'}
                {!submitting && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                )}
              </button>

              <p className="mt-3 text-center text-xs text-ink-500">
                You will receive a confirmation email with your pass details.
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
