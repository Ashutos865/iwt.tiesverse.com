import { useEffect, useState } from 'react';

/**
 * Holds the actual File object in form state (via Controller) rather than a
 * FileList, so the review step and submit builder can read it directly.
 * The accept/size checks here are UX only — the server re-checks everything.
 */
export default function FileInput({ field, value, onChange, hasError }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (value && value.type?.startsWith('image/')) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
    return undefined;
  }, [value]);

  const inputId = `file-${field.name}`;

  return (
    <div>
      <div
        className={`flex items-center gap-4 rounded-md border border-dashed p-4 transition ${
          hasError ? 'border-red-400 bg-red-50/40' : 'border-ink-200 bg-ink-50/40'
        }`}
      >
        {preview ? (
          <img src={preview} alt="" className="h-16 w-16 rounded object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded bg-white text-xs font-semibold text-ink-600/60">
            {value ? 'PDF' : '-'}
          </div>
        )}

        <div className="min-w-0 flex-1">
          {value ? (
            <>
              <p className="truncate text-sm font-medium text-ink-900">{value.name}</p>
              <p className="text-xs text-ink-600/70">{(value.size / 1024).toFixed(0)} KB</p>
            </>
          ) : (
            <p className="text-sm text-ink-600/70">
              {field.accept?.includes('pdf') ? 'JPG, PNG or PDF' : 'JPG or PNG'} · max{' '}
              {field.maxSizeMB || 5} MB
            </p>
          )}
        </div>

        <div className="flex shrink-0 gap-2">
          <label htmlFor={inputId} className="btn-ghost cursor-pointer !px-3 !py-1.5 !text-xs">
            {value ? 'Replace' : 'Choose file'}
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="btn-ghost !px-3 !py-1.5 !text-xs"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        id={inputId}
        type="file"
        accept={field.accept}
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}
