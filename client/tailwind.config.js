/** @type {import('tailwindcss').Config} */
// Navy institutional system per design.md §4.1. The semantic names (ink,
// brand, paper) are kept so every existing component re-skins without markup
// changes: ink = navy/text scale, brand = action blue, paper = page ground.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Navy + ink text scale — headers, dark panels, body text.
        ink: {
          50: '#F7F9FB',   // surface-2
          100: '#EEF3F7',
          200: '#DCE4EB',  // line-200 borders
          500: '#6D7B89',  // meta text
          600: '#5A6B7C',
          700: '#445466',  // secondary body
          800: '#26364A',
          900: '#172433',  // primary body/titles
          950: '#03182E',  // navy-950: global header/footer
        },
        // Action blue — primary buttons, active tabs, links.
        brand: {
          50: '#EEF7FC',   // blue-050 selected backgrounds
          100: '#D9EDF8',
          400: '#2396D3',  // blue-500 secondary accent
          500: '#1B87C5',
          600: '#1577B8',  // blue-600 primary
          700: '#0F5E93',
        },
        // Dark navy surfaces between 950 and 800 (hero overlays, side nav).
        navy: {
          800: '#0A365B',
          900: '#062947',
          950: '#03182E',
        },
        paper: '#F7F9FB',  // page background (surface-2)
        // Status pairs — always used WITH text/icon, never color alone.
        ok: { DEFAULT: '#18794E', bg: '#EAF7F0' },
        warn: { DEFAULT: '#9A6700', bg: '#FFF4D6' },
        bad: { DEFAULT: '#B42318', bg: '#FDECEA' },
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      maxWidth: {
        shell: '1280px',   // content container per §4.3
        wide: '1440px',    // operations/dashboard views
      },
      borderRadius: {
        DEFAULT: '6px',
        card: '8px',
      },
    },
  },
  plugins: [],
};
