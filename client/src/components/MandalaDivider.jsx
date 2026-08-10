import { useId } from 'react';

/**
 * Mandala strip — a repeating row of scalloped rosettes used as a section
 * divider on the home page.
 *
 * Drawn as a tiling SVG <pattern> rather than shipped as a bitmap: it stays
 * crisp at any width and on any DPI, weighs nothing, and takes its colour from
 * the palette instead of baking teal into a PNG. The tile holds three
 * rosettes at different depths, which reproduces the light/mid/dark rhythm of
 * the reference strip as it repeats.
 *
 * Decorative only — aria-hidden, and never the sole carrier of meaning.
 */

const R = 17;          // rosette radius
const CELL = 44;       // spacing between rosette centres
const TILE = CELL * 3; // three depths before the rhythm repeats
const HEIGHT = 44;
const PETALS = 18;

/**
 * Scalloped outline: PETALS semicircular bumps around a circle of radius R.
 * Each bump is an arc whose radius is half the chord between adjacent points,
 * which makes the scallops meet cleanly with no flat spots.
 */
function scallopPath(cx, cy, r, petals) {
  const step = (Math.PI * 2) / petals;
  const chord = 2 * r * Math.sin(step / 2);
  const bump = chord / 2;
  const pt = (i) => [
    cx + r * Math.cos(i * step),
    cy + r * Math.sin(i * step),
  ];

  const [x0, y0] = pt(0);
  let d = `M ${x0.toFixed(2)} ${y0.toFixed(2)}`;
  for (let i = 1; i <= petals; i += 1) {
    const [x, y] = pt(i);
    d += ` A ${bump.toFixed(2)} ${bump.toFixed(2)} 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d} Z`;
}

/** One medallion. `depth` drives how filled-in it reads. */
function Rosette({ cx, cy, depth }) {
  const fill = { light: 0.16, mid: 0.3, dark: 0.62 }[depth];
  const ink = { light: 0.35, mid: 0.5, dark: 0.9 }[depth];

  return (
    <g>
      <path d={scallopPath(cx, cy, R, PETALS)} fill="currentColor" opacity={fill} />
      <path
        d={scallopPath(cx, cy, R, PETALS)}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity={ink}
      />
      <circle cx={cx} cy={cy} r={R * 0.72} fill="none" stroke="currentColor" strokeWidth="0.7" opacity={ink * 0.8} />
      <circle
        cx={cx} cy={cy} r={R * 0.55}
        fill="none" stroke="currentColor" strokeWidth="2.2"
        strokeDasharray="1 2.1" opacity={ink * 0.85}
      />
      <circle cx={cx} cy={cy} r={R * 0.34} fill="none" stroke="currentColor" strokeWidth="0.7" opacity={ink} />
      <circle
        cx={cx} cy={cy} r={R * 0.22}
        fill="none" stroke="currentColor" strokeWidth="1.6"
        strokeDasharray="0.8 1.5" opacity={ink * 0.9}
      />
      <circle cx={cx} cy={cy} r={R * 0.1} fill="currentColor" opacity={ink} />
    </g>
  );
}

export default function MandalaDivider({ className = '' }) {
  // Scoped id — the divider appears several times on one page.
  const id = `mandala-strip-${useId().replace(/:/g, '')}`;

  return (
    <div className={`overflow-hidden text-brand-500 ${className}`} aria-hidden="true">
      {/* No viewBox on purpose: user units then equal CSS pixels, so the
          pattern repeats across the width instead of being scaled to fit. */}
      <svg width="100%" height={HEIGHT} focusable="false" role="presentation">
        <defs>
          <pattern id={id} width={TILE} height={HEIGHT} patternUnits="userSpaceOnUse">
            <Rosette cx={CELL * 0.5} cy={HEIGHT / 2} depth="light" />
            <Rosette cx={CELL * 1.5} cy={HEIGHT / 2} depth="mid" />
            <Rosette cx={CELL * 2.5} cy={HEIGHT / 2} depth="dark" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height={HEIGHT} fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
