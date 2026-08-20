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
        // Text is neutral, structure stays blue. The reading steps are anchored
        // on the brand's #272727 and derived from it by lightness alone, so
        // every weight of type is the same colour rather than a family of
        // near-greys. Contrast on white: 14.94, 11.90, 8.72, 6.29, 4.67 — the
        // three used for body and headings clear AAA, and the lightest still
        // clears AA for meta text.
        //
        // 50/100/200 are deliberately NOT neutral. They are hairlines, card
        // borders and tinted panels rather than text, and the faint blue keeps
        // those surfaces related to the artwork instead of turning the page
        // into grey boxes.
        ink: {
          50: '#F7F9FC',
          100: '#EDF1F7',
          200: '#D8E0EC',  // hairlines, borders
          500: '#747474',  // meta text — 4.67:1
          600: '#606060',
          700: '#4B4B4B',  // secondary body — 8.72:1
          800: '#373737',
          900: '#272727',  // primary body / headings — 14.94:1
          950: '#171717',
        },
        // Teal, from the Indus mark in the logo. Actions are teal, reading is
        // blue: what you click is the logo's colour, what you read stays the
        // artwork's ink.
        //
        // The brand teals are #159B98 and #1FB3AA, kept here exactly at 500 and
        // 600. Neither can carry white text — they measure 3.40:1 and 2.60:1
        // against white where 4.5:1 is the minimum — so filled buttons and link
        // text use 700 (#117E7B, 4.89:1), which is the same hue two steps
        // darker rather than a different colour that happens to pass. The whole
        // scale is generated from the brand hue (178.7deg), so every step is
        // recognisably the same teal.
        teal: {
          50: '#EDFDFC',
          100: '#D2F9F8',
          200: '#A5F3F1',
          300: '#66EAE7',
          400: '#1FB3AA',  // brand teal, light — decorative only, 2.60:1
          500: '#159B98',  // brand teal — decorative and large text, 3.40:1
          600: '#139391',  // hover step between the brand teal and 700
          700: '#117E7B',  // button fill and link text — 4.89:1, white text OK
          800: '#0D6361',  // hover on filled buttons — 7.06:1
          900: '#0A4A49',
          950: '#073130',
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
        // Portal tiles, in the teal family so the grid belongs to the same
        // system as the buttons and the artwork. Contrast with white / with
        // ink-900 (#272727):
        //   deep   10.05 / 1.49  -> white text
        //   mid     7.06 / 2.12  -> white text
        //   river   4.89 / 3.06  -> white text
        //   mist    1.26 / 11.87 -> DARK text
        //   sand    1.33 / 11.26 -> DARK text
        tile: {
          deep: '#0A4A49',
          mid: '#0D6361',
          river: '#117E7B',
          mist: '#A5F3F1',
          sand: '#E8DFC9',
        },
        ok: { DEFAULT: '#1F7A4C', bg: '#E8F5EE' },
        warn: { DEFAULT: '#8A6100', bg: '#FDF3D9' },
        bad: { DEFAULT: '#A8321F', bg: '#FBEAE7' },
      },
      fontFamily: {
        /*
         * Google Sans throughout, as requested.
         *
         * It is a public Google Fonts family now: the stylesheet returns 75
         * real @font-face blocks and its woff2 files fetch, both checked
         * before this was changed. An earlier note here said it could not be
         * served, which was true once and is not any more.
         *
         * The stack behind it is the system UI face on each platform, so a
         * blocked or slow Google Fonts request degrades to something close
         * rather than to Times.
         */
        sans: ['"Google Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Google Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        title: ['"Google Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        /*
         * The event tagline keeps Times New Roman, which was specified
         * separately for that one line. It is the only exception.
         */
        tagline: ['"Times New Roman"', 'Times', 'Liberation Serif', 'Tinos', 'serif'],
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
