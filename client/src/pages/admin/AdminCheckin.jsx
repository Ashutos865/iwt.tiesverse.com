import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';

/**
 * Gate scanner (design.md §31.5), built for a phone held at the entrance:
 * back camera + live QR decode. A recognised badge QR routes to /verify/<token>,
 * which verifies and checks the holder in automatically in one step.
 */
export default function AdminCheckin() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const stopped = useRef(false);
  const [error, setError] = useState('');
  const [manual, setManual] = useState('');

  const handleHit = useCallback((text) => {
    // Accept a full pass URL or a bare token.
    const m = String(text).match(/\/verify\/([A-Za-z0-9._~-]+)/);
    const token = m ? m[1] : /^[A-Za-z0-9._~-]{16,}$/.test(text.trim()) ? text.trim() : null;
    if (!token) return false;
    stopped.current = true;
    navigate(`/verify/${encodeURIComponent(token)}`);
    return true;
  }, [navigate]);

  useEffect(() => {
    stopped.current = false;
    let raf;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        const tick = () => {
          if (stopped.current) return;
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
            if (code?.data && handleHit(code.data)) return;
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch (err) {
        setError(
          err?.name === 'NotAllowedError'
            ? 'Camera permission was denied. Allow camera access for this site and reload.'
            : 'Could not open the camera on this device. Use the manual entry below.',
        );
      }
    }

    start();
    return () => {
      stopped.current = true;
      if (raf) cancelAnimationFrame(raf);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [handleHit]);

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Check-in</p>
          <h1 className="font-display text-2xl text-ink-900">Scan a badge</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/checkins" className="btn-text text-xs">Check-ins →</Link>
          <Link to="/admin/applications" className="btn-text text-xs">Applications →</Link>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-card border border-ink-200 bg-brand-950">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={videoRef} playsInline muted className="block aspect-[3/4] w-full object-cover" />
        {/* aiming frame */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-52 w-52 rounded-xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(3,24,46,0.45)]" />
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <p className="mt-3 text-center text-sm text-ink-700">
        Point at the QR on the pass — verification and check-in happen automatically.
      </p>

      {error && <p className="error-text mt-3 text-center">{error}</p>}

      {/* Fallback when the camera can't be used: paste the pass URL or token. */}
      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!handleHit(manual)) setError('That does not look like a pass URL or token.');
        }}
      >
        <input
          className="input"
          placeholder="…or paste pass URL / token"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
        />
        <button type="submit" className="btn-primary shrink-0">Go</button>
      </form>
    </div>
  );
}
