import { useEffect, useRef, useState } from 'react';

/**
 * Mandala strip — a repeating row of scalloped rosettes used as a section
 * divider on the home page.
 *
 * Laid out by measurement, not by tiling. An SVG <pattern> repeats from x=0
 * at a fixed pitch, so whatever width the container happens to be, the last
 * rosette is sliced wherever the edge falls. Here the width is measured and
 * divided into a whole number of cells, with one rosette centred in each — so
 * both ends are always a complete medallion and nothing is trimmed.
 *
 * Decorative only — aria-hidden, and never the sole carrier of meaning.
 */

const IDEAL_CELL = 46;  // target pitch; actual pitch flexes to fit the width
const MIN_CELL = 34;
const HEIGHT = 44;
const PETALS = 18;

/**
 * Scalloped outline: PETALS semicircular bumps around a circle of radius r.
 * Each bump is an arc whose radius is half the chord between adjacent points,
 * which makes the scallops meet cleanly with no flat spots.
 */
function scallopPath(cx, cy, r, petals) {
  const step = (Math.PI * 2) / petals;
  const bump = (2 * r * Math.sin(step / 2)) / 2;
  const pt = (i) => [cx + r * Math.cos(i * step), cy + r * Math.sin(i * step)];

  const [x0, y0] = pt(0);
  let d = `M ${x0.toFixed(2)} ${y0.toFixed(2)}`;
  for (let i = 1; i <= petals; i += 1) {
    const [x, y] = pt(i);
    d += ` A ${bump.toFixed(2)} ${bump.toFixed(2)} 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d} Z`;
}

/** One medallion. `depth` drives how filled-in it reads. */
function Rosette({ cx, cy, r, depth }) {
  const fill = { light: 0.16, mid: 0.3, dark: 0.62 }[depth];
  const ink = { light: 0.35, mid: 0.5, dark: 0.9 }[depth];
  const outline = scallopPath(cx, cy, r, PETALS);

  return (
    <g>
      <path d={outline} fill="currentColor" opacity={fill} />
      <path d={outline} fill="none" stroke="currentColor" strokeWidth="0.8" opacity={ink} />
      <circle cx={cx} cy={cy} r={r * 0.72} fill="none" stroke="currentColor" strokeWidth="0.7" opacity={ink * 0.8} />
      <circle
        cx={cx} cy={cy} r={r * 0.55}
        fill="none" stroke="currentColor" strokeWidth="2.2"
        strokeDasharray="1 2.1" opacity={ink * 0.85}
      />
      <circle cx={cx} cy={cy} r={r * 0.34} fill="none" stroke="currentColor" strokeWidth="0.7" opacity={ink} />
      <circle
        cx={cx} cy={cy} r={r * 0.22}
        fill="none" stroke="currentColor" strokeWidth="1.6"
        strokeDasharray="0.8 1.5" opacity={ink * 0.9}
      />
      <circle cx={cx} cy={cy} r={r * 0.1} fill="currentColor" opacity={ink} />
    </g>
  );
}

const DEPTHS = ['light', 'mid', 'dark'];

export default function MandalaDivider({ className = '' }) {
  const hostRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Whole number of cells across the measured width — never a partial one.
  const count = width > 0 ? Math.max(3, Math.round(width / IDEAL_CELL)) : 0;
  const cell = count > 0 ? width / count : 0;
  // Radius is derived from the actual pitch so neighbours never collide and
  // the outermost rosettes stay clear of both edges.
  const r = Math.max(6, Math.min(cell, IDEAL_CELL + 8) * 0.38);

  return (
    <div ref={hostRef} className={`text-teal-600 ${className}`} aria-hidden="true">
      {count > 0 && (
        <svg width={width} height={HEIGHT} focusable="false" role="presentation" className="block">
          {Array.from({ length: count }, (_, i) => (
            <Rosette
              key={i}
              cx={(i + 0.5) * cell}
              cy={HEIGHT / 2}
              r={r}
              depth={DEPTHS[i % DEPTHS.length]}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
