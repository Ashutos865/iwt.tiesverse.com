import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { SESSION_GROUPS } from '../../content/summit.js';

/*
 * The four expertise areas of the approved design. These are not internal
 * labels — each one is a filter tab on the public Speakers page and the tag
 * printed on the card, so the list here and the tabs there are the same
 * vocabulary by construction.
 *
 * This replaced a seven-item list (Government, Diplomats, Military, Academia,
 * Think Tanks, Industry, Legal) that described *who someone is*. These
 * describe *what they speak to*, which is what a visitor filtering the grid
 * is actually looking for.
 */
export const SPEAKER_CATEGORIES = [
  'Law & International Legal Experts',
  'Water & Environment Experts',
  'Security & Strategic Affairs',
  'Economics & Policy Experts',
];

/**
 * Content manager: everything the public site shows, editable without a code
 * change or redeploy. One field schema per content type drives both the form
 * and the summary row, so adding a type later means adding one entry here.
 */
const PARTNER_TIER_NAMES = [
  'Dialogue Partner', 'Strategic Partners', 'Knowledge Partners',
  'Institutional Partners', 'Media Partners', 'Supporting Partners',
];

const TYPES = [
  {
    kind: 'speaker',
    label: 'Speakers / Guests',
    blurb: 'People appearing on the Speakers page and the homepage preview.',
    fields: [
      { name: 'name', label: 'Full name', required: true, placeholder: 'e.g. Dr. Anjali Rao' },
      { name: 'designation', label: 'Designation', required: true, placeholder: 'e.g. Professor of International Law' },
      { name: 'organization', label: 'Organisation', placeholder: 'e.g. Jindal School of International Affairs' },
      { name: 'country', label: 'Country', placeholder: 'e.g. India' },
      { name: 'category', label: 'Category', type: 'select', options: SPEAKER_CATEGORIES },
      { name: 'photo_url', label: 'Photo URL', placeholder: 'https://…', hint: 'Portrait, ideally 1:1. Leave blank for a monogram.' },
      { name: 'bio', label: 'Short bio', type: 'textarea', hint: '80–180 words, as it should appear publicly.' },
      { name: 'order', label: 'Display order', type: 'number', hint: 'Lower shows first.' },
      {
        name: 'published',
        label: 'Confirmed — show on the public site',
        type: 'checkbox',
        hint: 'Leave OFF while a speaker is still under invitation. The site '
          + 'promises that names appear only once they have confirmed, so an '
          + 'unticked speaker is fully editable here but invisible publicly.',
      },
    ],
    summary: (i) => [
      i.published === false ? '◦ Draft' : null,
      i.name, i.designation, i.organization,
    ].filter(Boolean).join(' · '),
  },
  {
    kind: 'session',
    label: 'Agenda sessions',
    blurb: 'Programme rows on the Agenda page and the homepage timeline.',
    fields: [
      { name: 'title', label: 'Session title', required: true },
      {
        name: 'kind', label: 'Row type', type: 'select', required: true,
        options: ['session', 'break'],
        optionLabels: ['Session (counts in the programme)', 'Break / registration / lunch'],
        hint: 'Breaks show in the agenda but are not counted as sessions.',
      },
      { name: 'start', label: 'Start time', required: true, placeholder: '09:00' },
      { name: 'end', label: 'End time', placeholder: '09:45' },
      { name: 'group', label: 'Session group', type: 'select', options: SESSION_GROUPS },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'order', label: 'Display order', type: 'number', hint: 'Lower shows first. Use the running order.' },
    ],
    summary: (i) => `${i.start || '--:--'} · ${i.title}${i.kind === 'break' ? ' (break)' : ''}`,
  },
  {
    kind: 'partner',
    label: 'Partners & institutions',
    blurb: 'Organisations on the Partners page and the homepage strip.',
    fields: [
      { name: 'name', label: 'Organisation name', required: true },
      { name: 'tier', label: 'Tier', type: 'select', required: true, options: PARTNER_TIER_NAMES },
      { name: 'logo_url', label: 'Logo URL', placeholder: 'https://…', hint: 'Official asset only. Blank shows the name typographically.' },
      { name: 'website', label: 'Website', placeholder: 'https://…' },
      { name: 'order', label: 'Display order', type: 'number' },
    ],
    summary: (i) => `${i.name} — ${i.tier}`,
  },
  {
    kind: 'press',
    label: 'Press & media',
    blurb: 'Releases and advisories in the Media Centre and homepage news.',
    fields: [
      { name: 'title', label: 'Headline', required: true },
      { name: 'date', label: 'Date', required: true, placeholder: '15 May 2026' },
      { name: 'type', label: 'Type', type: 'select', options: ['Press Release', 'Media Advisory', 'News', 'Announcement'] },
      { name: 'summary', label: 'Summary', type: 'textarea', hint: 'One or two lines shown in the list.' },
      { name: 'link', label: 'Read-more link', placeholder: 'https://…' },
      { name: 'order', label: 'Display order', type: 'number' },
    ],
    summary: (i) => `${i.date} · ${i.title}`,
  },
  {
    kind: 'faq',
    label: 'FAQ',
    blurb: 'Questions on the homepage accordion.',
    fields: [
      { name: 'q', label: 'Question', required: true },
      { name: 'a', label: 'Answer', type: 'textarea', required: true },
      { name: 'order', label: 'Display order', type: 'number' },
    ],
    summary: (i) => i.q,
  },
];

const emptyDraft = (type) =>
  Object.fromEntries(type.fields.map((f) => {
    if (f.type === 'number') return [f.name, 0];
    // A new speaker starts unpublished: the safe default is that nobody
    // reaches the public site until somebody deliberately says so.
    if (f.type === 'checkbox') return [f.name, false];
    return [f.name, ''];
  }));

function Field({ field, value, onChange }) {
  const id = `f-${field.name}`;

  /*
    Checkbox is its own branch, not a variant of the text input: it reads
    e.target.checked rather than e.target.value, and the label sits beside the
    control instead of above it. Rendering it through the shared path gave a
    text box containing "false".
  */
  if (field.type === 'checkbox') {
    return (
      <label className="flex cursor-pointer items-start gap-3" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={value === true || value === 'true'}
          onChange={(e) => onChange(field.name, e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
        />
        <span>
          <span className="label !mb-0">{field.label}</span>
          {field.hint && <span className="hint">{field.hint}</span>}
        </span>
      </label>
    );
  }

  const common = {
    id,
    value: value ?? '',
    onChange: (e) => onChange(field.name, e.target.value),
    className: 'input',
  };
  return (
    <label className="block" htmlFor={id}>
      <span className="label">
        {field.label}
        {field.required && <span className="text-bad"> *</span>}
      </span>
      {field.type === 'textarea' ? (
        <textarea {...common} rows={3} />
      ) : field.type === 'select' ? (
        <select {...common}>
          <option value="">Select…</option>
          {field.options.map((o, i) => (
            <option key={o} value={o}>{field.optionLabels?.[i] || o}</option>
          ))}
        </select>
      ) : (
        <input {...common} type={field.type === 'number' ? 'number' : 'text'} placeholder={field.placeholder || ''} />
      )}
      {field.hint && <span className="hint">{field.hint}</span>}
    </label>
  );
}

export default function AdminContent() {
  const [active, setActive] = useState(TYPES[0]);
  const [data, setData] = useState(null);
  const [draft, setDraft] = useState(() => emptyDraft(TYPES[0]));
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      // The admin endpoint, so drafts stay visible to whoever is editing them.
      setData(await api.contentAllAdmin());
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const items = data?.[active.kind] || [];

  const pickType = (type) => {
    setActive(type);
    setDraft(emptyDraft(type));
    setEditingId(null);
    setMsg('');
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setDraft({ ...emptyDraft(active), ...item });
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (editingId) {
        await api.contentUpdate(active.kind, editingId, draft);
        setMsg('Updated — live on the site.');
      } else {
        await api.contentCreate(active.kind, draft);
        setMsg('Added — live on the site.');
      }
      setDraft(emptyDraft(active));
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Remove "${active.summary(item)}"? This takes it off the public site.`)) return;
    setBusy(true);
    try {
      await api.contentDelete(active.kind, item.id);
      await load();
      setMsg('Removed.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Website</p>
          <h1 className="font-display text-2xl text-ink-900">Content</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/applications" className="btn-ghost !py-1.5 !text-xs">Applications</Link>
          <Link to="/admin/checkins" className="btn-ghost !py-1.5 !text-xs">Check-ins</Link>
        </div>
      </div>

      {/* Type switcher */}
      <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2">
          {TYPES.map((t) => (
            <button
              key={t.kind}
              type="button"
              onClick={() => pickType(t)}
              aria-pressed={active.kind === t.kind}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition ${
                active.kind === t.kind
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-ink-200 bg-white text-ink-700 hover:border-brand-600'
              }`}
            >
              {t.label}{data ? ` (${(data[t.kind] || []).length})` : ''}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-700">{active.blurb}</p>
      {error && <p className="error-text mt-3">{error}</p>}
      {msg && <p className="mt-3 rounded bg-ok-bg px-4 py-2 text-sm font-semibold text-ok">{msg}</p>}

      {/* Add / edit form */}
      <form onSubmit={save} className="card mt-5">
        <h2 className="font-display text-lg text-ink-900">
          {editingId ? 'Edit item' : `Add to ${active.label}`}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {active.fields.map((f) => (
            <div key={f.name} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <Field field={f} value={draft[f.name]} onChange={(n, v) => setDraft((d) => ({ ...d, [n]: v }))} />
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-2">
          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? 'Saving…' : editingId ? 'Save changes' : 'Add to site'}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => { setEditingId(null); setDraft(emptyDraft(active)); }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Existing items */}
      <h2 className="mt-8 font-display text-lg text-ink-900">On the site now ({items.length})</h2>
      {!data ? (
        <p className="mt-3 text-sm text-ink-500">Loading…</p>
      ) : items.length === 0 ? (
        <div className="card mt-3 text-center">
          <p className="font-semibold text-ink-900">Nothing added yet.</p>
          <p className="mt-1 text-sm text-ink-700">Items you add appear on the public site immediately.</p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-ink-100 rounded-card border border-ink-200 bg-white">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <span className="min-w-0 text-sm">
                <span className="font-semibold text-ink-900">{active.summary(item)}</span>
                {item.order ? <span className="ml-2 text-xs text-ink-500">#{item.order}</span> : null}
              </span>
              <span className="flex gap-2">
                <button type="button" onClick={() => startEdit(item)} className="btn-text !min-h-0 text-xs">Edit</button>
                <button type="button" onClick={() => remove(item)} className="text-xs font-semibold text-bad hover:underline">
                  Remove
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
