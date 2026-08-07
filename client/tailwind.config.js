/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep petrol ink — headings, dark surfaces, body text.
        ink: {
          50: '#f2f6f6',
          100: '#e0eaeb',
          200: '#bed4d7',
          600: '#2a606b',
          700: '#1e4d57',
          800: '#163f48',
          900: '#0f333b',
          950: '#081f25',
        },
        // River teal — the brand accent for CTAs, links, active states.
        brand: {
          50: '#eef8f9',
          100: '#d5eef0',
          400: '#2b9aab',
          500: '#1d8494',
          600: '#156b7a',
          700: '#10525e',
        },
        // Warm ivory paper — page background.
        paper: '#f6f4ee',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
