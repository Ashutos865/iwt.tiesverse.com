import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api.js';

/**
 * Email field with a Verify button, then a code box.
 *
 * The verified token is stored on the form under `emailToken`; the server
 * re-checks it at submit time, so nothing here is trusted on its own. Changing
 * the address clears the token — otherwise you could verify one inbox and
 * register with another.
 */
export default function EmailVerify({ field, form, inputClass, rules }) {
  const { register, watch, setValue, formState } = form;
  const email = watch(field.name) || '';
  const token = watch('emailToken') || '';
  const error = formState.errors[field.name];

  const [stage, setStage] = useState('idle');   // idle | sending | code | verifying
  const [code, setCode] = useState('');
  const [notice, setNotice] = useState('');
  const [problem, setProblem] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const codeRef = useRef(null);

  // A token belongs to one address. If the address changes, it is no longer proof.
  const verifiedFor = useRef('');
  useEffect(() => {
    if (token && verifiedFor.current && email !== verifiedFor.current) {
      setValue('emailToken', '');
      setStage('idle');
      setCode('');
      setNotice('');
    }
  }, [email, token, setValue]);

  useEffect(() => {
    if (!cooldown) return undefined;
    const t = setTimeout(() => setCooldown((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const looksLikeEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());

  const send = async () => {
    setProblem(''); setNotice('');
    setStage('sending');
    let res;
    try {
      res = await api.sendEmailCode(email.trim());
    } catch (err) {
      // A cooldown means a code IS already out there, so show the box rather
      // than leaving someone holding a code with nowhere to type it.
      const wait = Number(err.fields?.retry_after || err.retry_after || 0);
      const cooling = err.status === 429 || /try again in/i.test(err.message || '');
      if (cooling) {
        setStage('code');
        setCooldown(wait || 60);
        setTimeout(() => codeRef.current?.focus(), 50);
      } else {
        setStage(stage === 'code' ? 'code' : 'idle');
      }
      setProblem(err.message || 'Could not send the code.');
      return;
    }
    setStage('code');
    setNotice(`Code sent to ${res.destination || email}.`);
    setCooldown(res.resendIn || 60);
    setTimeout(() => codeRef.current?.focus(), 50);
  };

  const check = async () => {
    setProblem('');
    setStage('verifying');
    let res;
    try {
      res = await api.checkEmailCode(email.trim(), code.trim());
    } catch (err) {
      setStage('code');
      setProblem(err.message || 'That code is not right.');
      return;
    }
    if (!res?.token) {
      setStage('code');
      setProblem('That code is not right.');
      return;
    }
    verifiedFor.current = email.trim();
    setValue('emailToken', res.token, { shouldValidate: false });
    setStage('idle');
    setNotice('');
  };

  const verified = Boolean(token);

  return (
    <>
      <div className="flex gap-2">
        <input
          id={field.name}
          type="email"
          className={`${inputClass} flex-1`}
          placeholder={field.placeholder || 'you@example.com'}
          autoComplete="email"
          readOnly={verified}
          {...register(field.name, rules)}
        />
        {verified ? (
          <span className="ev-badge" aria-live="polite">✓ Verified</span>
        ) : (
          <button
            type="button"
            className="btn-ghost whitespace-nowrap"
            disabled={!looksLikeEmail || stage === 'sending' || cooldown > 0}
            onClick={send}
          >
            {stage === 'sending' ? 'Sending…'
              : cooldown > 0 ? `Resend in ${cooldown}s`
              : stage === 'code' ? 'Resend code' : 'Verify'}
          </button>
        )}
      </div>

      {!verified && stage === 'code' && (
        <div className="mt-2 flex gap-2">
          <input
            ref={codeRef}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            className={`${inputClass} flex-1 tracking-[0.3em]`}
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); check(); } }}
          />
          <button
            type="button"
            className="btn-primary whitespace-nowrap"
            disabled={code.length !== 6 || stage === 'verifying'}
            onClick={check}
          >
            {stage === 'verifying' ? 'Checking…' : 'Submit code'}
          </button>
        </div>
      )}

      {problem && <p className="error-text">{problem}</p>}
      {!problem && notice && !verified && <p className="hint">{notice}</p>}
      {!problem && !notice && !verified && !error && (
        <p className="hint">{field.hint || 'Verify your email so we can send your pass.'}</p>
      )}

      {/* Carried to the server with the form; re-checked there. */}
      <input type="hidden" {...register('emailToken')} />
    </>
  );
}
