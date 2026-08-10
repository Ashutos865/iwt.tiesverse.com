#!/usr/bin/env node
/**
 * Refuse to build a deployable bundle that carries an unlicensed font.
 *
 * `.gitignore` keeps font binaries out of this public repository, but a build
 * copies client/public/ straight into dist/ — so without this check a demo or
 * personal-use font would ship to the live site anyway, which is the thing we
 * are actually trying to avoid.
 *
 * The rule: if any font file is present, a licence marker must sit beside it.
 * `npm run dev` is untouched, so evaluating a demo font locally still works.
 *
 * To clear the build once you hold a web/self-hosting licence:
 *
 *   echo "Larken — web licence, Ellen Luff Type Foundry, order #____" \
 *     > client/public/fonts/LICENSE.txt
 */

import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'client/public/fonts';
const FONT_EXT = /\.(woff2?|otf|ttf|eot)$/i;

if (!existsSync(DIR)) process.exit(0);

const fonts = readdirSync(DIR).filter((f) => FONT_EXT.test(f));
if (fonts.length === 0) process.exit(0);

const licensed = readdirSync(DIR).some((f) => /^LICEN[CS]E/i.test(f));
if (licensed) {
  console.log(`[fonts] ${fonts.length} font file(s) present, licence on record — ok`);
  process.exit(0);
}

console.error(`
────────────────────────────────────────────────────────────────────────
  BUILD STOPPED — unlicensed font would ship to production
────────────────────────────────────────────────────────────────────────

  Found in ${DIR}:
${fonts.map((f) => `    · ${f}`).join('\n')}

  Vite copies client/public/ into dist/, so this build would publish the
  font at a public URL. A "Demo for Personal Use" or desktop-only licence
  does not permit that.

  Either:

    1. Remove the font — titles fall back to Source Serif 4 and the site
       builds and renders correctly:

         rm ${join(DIR, fonts[0])}

    2. Or record a web/self-hosting licence and rebuild:

         echo "Larken — web licence, <foundry>, order #____" \\
           > ${join(DIR, 'LICENSE.txt')}

  Buy a Larken web licence: https://ellenlufftype.com/larken/
  Details: ${join(DIR, 'README.md')}

────────────────────────────────────────────────────────────────────────
`);
process.exit(1);
