/** @type {import('tailwindcss').Config} */
/**
 * Design tokens.
 *
 * Structure follows cop30.br — warm off-white ground, floating pill
 * navigation, solid-colour tile grid, heavy rounding, one sans family. The
 * palette does NOT follow COP30's earth tones: it is built from the teal in
 * the supplied logo (#58A0A0) so the site stays on-brand with its own mark.
 *
 * Semantic names (ink, brand, paper) are unchanged from the previous system so
 * every existing component re-skins without markup edits: ink = text scale,
 * brand = teal action colour, paper = page ground.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Text + surface scale, warmed slightly so it sits on the ivory ground.
        // Every value below is contrast-checked against the ground it is used
        // on: body text >= 4.5:1 on paper, white text >= 4.5:1 on brand-600
        // and on every tile colour.
        ink: {
          50: '#FAFAF8',
          100: '#F1F0EC',
          200: '#DEDBD1',  // hairlines, borders
          500: '#66685F',  // meta text — 4.71:1 on paper, 5.66:1 on white
          600: '#5A5D59',
          700: '#474A48',  // secondary body — 8.15:1
          800: '#2E3230',
          900: '#1C201F',  // primary body — 14.96:1
          950: '#0F1413',
        },
        // Teal, derived from the logo: 500 is the logo colour exactly.
        // 600 is the darkest tint that still carries white text at AA.
        brand: {
          50: '#F2F8F8',
          100: '#DFEDED',
          200: '#C0DBDB',
          300: '#9AC7C7',
          400: '#76B0B0',
          500: '#58A0A0',  // ← logo
          600: '#427E7E',  // primary CTA — 4.65:1 with white
          700: '#3A6D6E',  // links on paper — 5.31:1
          800: '#2E5657',  // titles — 7.38:1
          900: '#244243',
          950: '#172B2C',
        },
        // Plain white page ground, per the client's instruction.
        //
        // Nothing can now separate a white surface from the ground by fill, so
        // the nav card and content cards carry a hairline border and a shadow
        // instead — see .navcard / .card in index.css. Removing either makes
        // them dissolve into the page.
        paper: '#FFFFFF',
        // Solid tile grounds for the home portal. All carry white text at AA.
        tile: {
          teal: '#3A6D6E',
          pine: '#24504A',
          navy: '#1B3A4B',
          petrol: '#1F5566',
          bronze: '#8A5A2B',
          slate: '#454F52',
        },
        ok: { DEFAULT: '#1F7A4C', bg: '#E8F5EE' },
        warn: { DEFAULT: '#8A6100', bg: '#FDF3D9' },
        bad: { DEFAULT: '#A8321F', bg: '#FBEAE7' },
      },
      fontFamily: {
        // Larken — the event title only.
        title: ['Larken', 'Georgia', 'serif'],
        // COP30 is single-family. `display` is kept as a token name so the
        // existing font-display classes flip to sans without touching markup.
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      maxWidth: {
        shell: '1180px',
        wide: '1440px',
        prose: '760px',
      },
      borderRadius: {
        DEFAULT: '8px',
        card: '14px',
        pill: '999px',
      },
      boxShadow: {
        // The floating nav card and tiles sit on the ground, not in it.
        nav: '0 6px 24px -8px rgba(16, 32, 32, 0.18), 0 2px 6px -2px rgba(16, 32, 32, 0.08)',
        tile: '0 2px 10px -4px rgba(16, 32, 32, 0.18)',
      },
    },
  },
  plugins: [],
};
