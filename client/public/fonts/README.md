# Fonts

The event title is set in **Larken** (Ellen Luff Type Foundry). Font binaries
are **not** committed — this repository is public, and publishing a paid
typeface here is redistribution that no licence permits. `.gitignore` excludes
everything in this folder except this file.

## Current status

⚠️ **The file in local use is a "Demo for Personal Use" copy and must not be
deployed.** It is here so the design can be reviewed on a developer machine.
Before the site goes live, replace it with a licensed webfont:

- Buy a **web/self-hosting** licence: <https://ellenlufftype.com/larken/>
  (a desktop licence alone does not cover `@font-face`), or
- Serve it through **Adobe Fonts**, which permits web use under a Creative
  Cloud subscription.

Until a licensed file is in place, nothing breaks: `@font-face` simply fails to
resolve and every title falls back to Source Serif 4, which is what production
currently renders.

## Installing the file locally

Drop the font in this folder as `larken.woff2`:

```bash
# From an .otf/.ttf — woff2 is roughly a third of the size
pip3 install fonttools brotli
python3 -m fontTools.ttLib.woff2 compress -o client/public/fonts/larken.woff2 /path/to/larken.otf
```

Vite serves `client/public/` at the site root, so the file resolves at
`/fonts/larken.woff2`. No build step and no import required.

## Where it is wired up

| What | Where |
|---|---|
| `@font-face` declaration | `client/src/index.css` |
| `font-title` utility | `client/tailwind.config.js` |
| Applied to | the event title in `client/src/pages/Home.jsx` |

Adding weights or an italic means one more `@font-face` block per file, with a
matching `font-weight` / `font-style`. Do not use `font-synthesis` fakes — the
family currently ships a single 400 roman.
