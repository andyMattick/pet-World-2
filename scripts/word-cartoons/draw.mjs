/* Writes public/vocab-pics/cartoons/<word>.svg from scenes.mjs (docs/WORD-PICTURES.md).
   Run: node scripts/word-cartoons/draw.mjs [word ...]   (no words = all). A cartoon can also be edited by hand;
   then take its scene out of scenes.mjs so this script doesn't overwrite it. */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svg } from './lib.mjs';
import { SCENES } from './scenes.mjs';

const dir = resolve(dirname(fileURLToPath(import.meta.url)), '../../public/vocab-pics/cartoons');
mkdirSync(dir, { recursive: true });
const want = process.argv.slice(2);
for (const [w, scene] of Object.entries(SCENES)) {
  if (want.length && !want.includes(w)) continue;
  const [inner, bg] = scene();
  const out = svg(inner, bg);
  writeFileSync(`${dir}/${w}.svg`, out);
  if (out.length > 6000) console.log(`${w}: ${out.length} bytes (over 6 KB)`);
}
console.log(`drew ${want.length || Object.keys(SCENES).length} cartoons into ${dir}`);
