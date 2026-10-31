// 🧭 Tour guide check (docs/TOUR.md): every step points at something the apps really draw, no tour is longer than
// 7 steps, every step has Spanish, and what's remembered merges safely across two devices.
// Run: tsx scripts/check-tour.mjs   (verify.mjs runs it)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { TOURS, TOUR_UI, normTours, mergeTours, pendingSteps, markSeen } from '../src/shared/tour.ts';
import { translateText } from '../src/shared/language.ts';

const root = new URL('..', import.meta.url).pathname;
const files = [];
const walk = dir => { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) walk(p); else if (/\.(ts|js|html)$/.test(f)) files.push(p); } };
walk(join(root, 'src'));
const tourSrc = join(root, 'src/shared/tour.ts');
const source = [...files.filter(f => f !== tourSrc), join(root, 'index.html'), join(root, 'teacher.html')].map(f => readFileSync(f, 'utf8')).join('\n');

const problems = [];
const tokens = sel => {
  const out = [];
  for (const m of sel.matchAll(/#([\w-]+)/g)) out.push(['id', m[1]]);
  for (const m of sel.replace(/\[[^\]]*\]/g, '').matchAll(/\.([\w-]+)/g)) out.push(['class', m[1]]);
  for (const m of sel.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)) out.push(['attr', m[1], m[2]]);
  return out;
};
const found = ([kind, name, value]) => kind === 'id' ? new RegExp(`id=["']${name}["']|id="\\$\\{|\\.id = ['"]${name}['"]|#${name}\\b`).test(source)
  : kind === 'class' ? new RegExp(`class(Name)?\\s*=\\s*["'\`][^"'\`]*\\b${name}\\b|classList\\.(add|toggle)\\(['"]${name}['"]|\\.${name}\\b[^(]`).test(source) && new RegExp(`["'\` ]${name}["'\` $]`).test(source)
  : source.includes(value === undefined ? name : `${name}="${value}"`) || source.includes(`${name}="\${`) && value !== undefined && source.includes(`'${value}'`);

let steps = 0;
for (const [id, def] of Object.entries(TOURS)) {
  if (def.id !== id) problems.push(`${id}: id mismatch`);
  if (!Number.isInteger(def.version) || def.version < 1) problems.push(`${id}: version must be a whole number ≥ 1`);
  const ids = new Set();
  for (const s of def.steps) {
    steps++;
    if (ids.has(s.id)) problems.push(`${id}.${s.id}: duplicate step id`); ids.add(s.id);
    for (const t of s.sel ? tokens(s.sel) : []) if (!found(t)) problems.push(`${id}.${s.id}: selector part ${t.join(' ')} (${s.sel}) isn't in the app's source`);
    if (s.has && !source.includes(s.has)) problems.push(`${id}.${s.id}: text "${s.has}" isn't in the app's source`);
    for (const k of ['title', 'text']) {
      if (!s[k]) problems.push(`${id}.${s.id}: no ${k}`);
      else if (translateText(s[k]) === s[k]) problems.push(`${id}.${s.id}: no Spanish for ${k} "${s[k]}" (src/shared/language.ts tourTranslations)`);
    }
    if (s.text && s.text.split(/(?<=[.!?”])\s+(?=[A-Z🧭🐾👀])/).length > 2) problems.push(`${id}.${s.id}: more than 2 sentences`);
  }
  for (const hood of ['g4', 'g6']) { const n = def.steps.filter(s => !s.when || s.when({ hood })).length; if (n > 7) problems.push(`${id}: ${n} steps for ${hood} (7 at most)`); if (n < 2) problems.push(`${id}: only ${n} step for ${hood}`); }
}
for (const t of Object.values(TOUR_UI)) if (translateText(t) === t) problems.push(`no Spanish for the button "${t}"`);
if (translateText('Step 2 of 5') === 'Step 2 of 5') problems.push('no Spanish for "Step n of m"');

// the 6th and 4th grade town tours differ
const town = g => TOURS.town.steps.filter(s => !s.when || s.when({ hood: g })).map(s => s.id).join();
if (town('g4') === town('g6')) problems.push('town: 4th and 6th grade tours are the same');

// remembering: fresh → all steps; seen → none; a new version → only new step ids; two devices → union, never lost
const def = TOURS.town, seen = markSeen({}, def, 5);
const eq = (a, b, what) => { if (JSON.stringify(a) !== JSON.stringify(b)) problems.push(`${what}: got ${JSON.stringify(a)}, wanted ${JSON.stringify(b)}`); };
eq(pendingSteps(def, undefined).length, def.steps.length, 'first time shows every step');
eq(pendingSteps(def, seen.town).length, 0, 'seen tour shows nothing');
const v2 = { ...def, version: def.version + 1, steps: [...def.steps, { id: 'brandNew', sel: '', title: 'x', text: 'y' }] };
eq(pendingSteps(v2, seen.town).map(s => s.id), ['brandNew'], 'new version shows only new steps');
eq(mergeTours({ town: { v: 1, seen: ['plan'], at: 1 } }, { town: { v: 2, seen: ['words'], at: 9 }, parent: { v: 1, seen: ['ideas'], at: 3 } }),
  { town: { v: 2, seen: ['plan', 'words'], at: 9 }, parent: { v: 1, seen: ['ideas'], at: 3 } }, 'two devices merge');
eq(mergeTours(undefined, seen), seen, 'a device without S.tour keeps the other side');
eq(normTours({ town: { v: 'x', seen: 'no' }, 'bad id!': {}, x: null }), { town: { v: 0, seen: [], at: 0 } }, 'junk is cleaned');

console.log(`Tour: ${Object.keys(TOURS).length} tours, ${steps} steps (${Object.entries(TOURS).map(([k, d]) => `${k} ${d.steps.length}`).join(', ')}).`);
if (problems.length) { console.log('Problems:\n  ' + problems.join('\n  ')); process.exit(1); }
console.log('Tour check passed.');
