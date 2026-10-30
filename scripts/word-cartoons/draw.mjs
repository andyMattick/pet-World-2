/* Writes public/vocab-pics/cartoons/<word>.svg from scenes.mjs (docs/WORD-PICTURES.md).
   Run: node scripts/word-cartoons/draw.mjs [word ...]   (no words = all). A cartoon can also be edited by hand;
   then take its scene out of scenes.mjs so this script doesn't overwrite it. Scenes for added words (CLASS_SCENES) go to
   cartoons/class/ (docs/WORD-CARTOONS.md). */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svg } from './lib.mjs';
import { SCENES, CLASS_SCENES } from './scenes.mjs';

const dir = resolve(dirname(fileURLToPath(import.meta.url)), '../../public/vocab-pics/cartoons');
mkdirSync(dir, { recursive: true });
const want = process.argv.slice(2);
let drew = 0;
for (const [scenes, into] of [[SCENES, dir], [CLASS_SCENES, `${dir}/class`]]) for (const [w, scene] of Object.entries(scenes)) {
  if (want.length && !want.includes(w)) continue;
  const [inner, bg] = scene();
  const out = svg(inner, bg);
  mkdirSync(into, { recursive: true });
  writeFileSync(`${into}/${w}.svg`, out); drew++;
  if (out.length > 6000) console.log(`${w}: ${out.length} bytes (over 6 KB)`);
}
console.log(`drew ${drew} cartoons into ${dir}`);
