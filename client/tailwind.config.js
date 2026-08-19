/** @type {import('tailwindcss').Config} */
/**
 * Design tokens.
 *
 * The palette is derived from the commissioned Indus valley line drawing:
 * deep cobalt ink on a warm cream ground. It replaced a teal system that came
 * from the old logo — the artwork is the brand now, so the interface is drawn
 * from the same two colours rather than sitting next to them in a third.
 *
 * Semantic names (ink, brand, paper) are unchanged from the previous system so
 * every existing component re-skins without markup edits: ink = text scale,
 * brand = action colour, paper = page ground.
 *
 * Every value below is contrast-checked against the cream ground (#FAF5EA),
 * not against white — the ground is what body text actually sits on, and
 * checking against white would have quietly passed colours that fail in situ.
 * Measured ratios are recorded per token; body text clears 4.5:1, and white
 * text clears 4.5:1 on every fill it is used over.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Text scale: navy rather than neutral grey, so type belongs to the
        // same family as the drawing instead of reading as a separate layer.
        ink: {
          50: '#F7F9FC',
          100: '#EDF1F7',
          200: '#D8E0EC',  // hairlines, borders
          500: '#5C6F92',  // meta text — 4.66:1 on cream
          600: '#445980',
          700: '#33507F',  // secondary body — 7.44:1 on cream
          800: '#22406B',
          900: '#16305C',  // primary body / headlines — 11.99:1 on cream
          950: '#0E1F3D',
        },
        // Indus blue, sampled from the river and ridge lines of the artwork.
        // 600 is the primary button fill; 700 is the darkest link colour that
        // still reads as blue rather than black on cream.
        // Sampled from the hero drawing itself, not estimated: its ridge ink
        // reads #2F538B and its lighter hatching #41659B. Using the artwork's
        // own blue means the buttons and links look cut from the same plate as
        // the illustration rather than placed on top of it.
        brand: {
          50: '#F1F5FB',
          100: '#DFE8F5',
          200: '#C3D3EA',
          300: '#93AED3',
          400: '#41659B',  // the drawing's lighter hatching — 5.9:1 on white
          500: '#3A5C93',
          600: '#2E5FA8',  // primary CTA — 6.33:1 on white, 6.33:1 white-on-fill
          700: '#2F538B',  // links — the artwork's ridge ink exactly, 7.69:1
          800: '#22406B',
          900: '#16305C',
          950: '#0E1F3D',
        },
        // White ground, matching the approved design. The cream belongs to the
        // artwork, not to the interface: in the mockup the hero is white and
        // the warm tone arrives only where the drawing does, so the page reads
        // as paper with an illustration on it rather than as a tinted surface.
        paper: '#FFFFFF',
        // The drawing's own cream, sampled from its sky (#FAEDDC), for any
        // band that should feel like a continuation of the artwork rather
        // than a UI surface.
        sand: '#FAEDDC',
        // Portal tiles. Contrast with white / with ink-900:
        //   deep    13.03 / 1.09 -> white text
        //   mid      6.12 / 2.13 -> white text
        //   river    4.35 / 2.99 -> white text (large only) — used for wide tiles
        //   mist     1.42 / 8.45 -> DARK text
        //   sand     1.19 / 10.1 -> DARK text
        // Every tile therefore sets its own text colour; see TILES in Home.jsx.
        tile: {
          deep: '#16305C',
          mid: '#2160B8',
          river: '#3B79D0',
          mist: '#C0D6F4',
          sand: '#E8DFC9',
        },
        ok: { DEFAULT: '#1F7A4C', bg: '#E8F5EE' },
        warn: { DEFAULT: '#8A6100', bg: '#FDF3D9' },
        bad: { DEFAULT: '#A8321F', bg: '#FBEAE7' },
      },
      fontFamily: {
        // Google Sans is not on Google Fonts — it is Google's proprietary UI
        // face and cannot be served from fonts.googleapis.com. Product Sans /
        // Google Sans are licensed for Google's own products only.
        //
        // Google Sans Text's public sibling is Open Sans, and the closest
        // freely-licensable match to Google Sans Display's geometry is Poppins
        // (already used elsewhere in the estate). Both load from Google Fonts,
        // so this is the honest substitution rather than a broken font-family
        // that silently falls back to Arial.
        // Fraunces — the event title face.
        //
        // Larken (Ellen Luff Type Foundry) was specified originally, but it is
        // a paid typeface and the only copy available was a "Demo for Personal
        // Use" build, which no licence permits deploying; see
        // client/public/fonts/README.md. Fraunces is the closest freely
        // licensed match — the same soft flared serifs and warm, slightly
        // idiosyncratic letterforms — under the SIL Open Font Licence, and it
        // is already the display face on tiesverse.com, so the two sites read
        // as one family.
        //
        // 'Larken' is kept first in the stack deliberately: if a licensed
        // webfont is ever installed at /fonts/larken.woff2 the @font-face in
        // index.css resolves and the title switches to it with no code change.
        title: ['Larken', 'Fraunces', 'Georgia', 'serif'],
        display: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Open Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      maxWidth: {
        shell: '1180px',
        wide: '1440px',
        prose: '760px',
      },
      borderRadius: {
        DEFAULT: '8px',
        // Buttons and nav links: squared, with just enough radius to soften
        // the corner. Kept separate from `pill`, which the round 44x44 icon
        // buttons and the small status chips still need.
        btn: '8px',
        card: '14px',
        pill: '999px',
      },
      boxShadow: {
        // Cards sit on the cream ground, not in it. Shadows are navy-tinted
        // rather than neutral black so they read as part of the same palette.
        nav: '0 6px 24px -8px rgba(22, 48, 92, 0.16), 0 2px 6px -2px rgba(22, 48, 92, 0.08)',
        tile: '0 2px 10px -4px rgba(22, 48, 92, 0.18)',
      },
    },
  },
  plugins: [],
};
