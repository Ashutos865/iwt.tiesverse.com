/** @type {import('tailwindcss').Config} */
// Navy institutional system per design.md §4.1. The semantic names (ink,
// brand, paper) are kept so every existing component re-skins without markup
// changes: ink = navy/text scale, brand = action blue, paper = page ground.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Ink text scale + line color (design(1).md §5.1).
        ink: {
          50: '#F7F8F6',   // paper
          100: '#EFF2F0',
          200: '#D8E2E8',  // --line borders
          500: '#586875',  // --ink-600 meta text
          600: '#4A5A68',
          700: '#3A4B59',
          800: '#253746',  // --ink-800 secondary body
          900: '#0A1722',  // --ink-950 body/titles
          950: '#041C2C',  // header/footer navy
        },
        // River blue — actions, links, active nav, small emphasis only.
        brand: {
          50: '#EEF9FD',   // --river-050
          100: '#DFF3FB',  // --river-100
          400: '#38AFE0',  // --river-400 logo accent
          500: '#1597D1',  // --river-500 hover
          600: '#0C7DB8',  // --river-600 primary action
          700: '#08699F',  // --river-700
        },
        // Deep aquatic navy surfaces.
        navy: {
          800: '#0B3A5C',
          900: '#082A43',
          950: '#041C2C',  // header / footer
          975: '#021624',  // deepest shell / hero
        },
        // Very restrained diplomatic accent: 1px rules, tiny labels only.
        silt: { 500: '#B79A62' },
        paper: '#F7F8F6',
        // Status pairs — always used WITH text/icon, never color alone.
        ok: { DEFAULT: '#18794E', bg: '#EAF7F0' },
        warn: { DEFAULT: '#946200', bg: '#FFF4D6' },
        bad: { DEFAULT: '#B42318', bg: '#FDECEA' },
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"Source Sans 3"', 'Inter', 'system-ui', 'sans-serif'],
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
