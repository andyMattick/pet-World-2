/* Checks the 🧩 word parts (src/shared/wordParts.js, docs/VOCAB.md "Word parts"):
   - every built-in word (VOCAB_WORDS, PATTERN_WORDS) has an entry, and no entry is for a word that isn't built in
   - each entry's part texts join to the word exactly (a spelling change inside the word is marked with `show`)
   - no part has an empty meaning or a bad type; split words have a put-together line; one-part words have a note
   - the fallback guess stays quiet on words it shouldn't split (read, reason, under...) and splits a few clear ones
   Run: node scripts/check-word-parts.mjs            (add --table to print the review table in docs/word-parts-review.md) */
import { VOCAB_WORDS, PATTERN_WORDS } from '../src/shared/vocab.js';
import { WORD_PARTS, guessParts, wordPartsFor, ORIGIN_NAMES } from '../src/shared/wordParts.js';

const problems = [];
const built = [...new Set([...VOCAB_WORDS, ...PATTERN_WORDS].map(v => v.w.toLowerCase()))];
for (const w of built) if (!WORD_PARTS[w]) problems.push(`${w}: no entry`);
for (const w of Object.keys(WORD_PARTS)) if (!built.includes(w)) problems.push(`${w}: entry for a word that isn't built in`);
let split = 0, single = 0, marked = 0;
for (const [w, e] of Object.entries(WORD_PARTS)) {
  if (!Array.isArray(e.parts) || !e.parts.length) { problems.push(`${w}: no parts`); continue; }
  const joined = e.parts.map(x => x.text).join('');
  if (joined !== w) problems.push(`${w}: parts join to "${joined}"`);
  for (const x of e.parts) {
    if (!['prefix', 'root', 'suffix'].includes(x.type)) problems.push(`${w}: part "${x.text}" has type ${x.type}`);
    if (!String(x.meaning || '').trim()) problems.push(`${w}: part "${x.text}" has no meaning`);
    if (!x.text) problems.push(`${w}: empty part`);
    if (x.show) marked++;
    if (/'/.test(x.meaning)) problems.push(`${w}: straight apostrophe in "${x.meaning}"`);
  }
  if (!e.parts.some(x => x.type === 'root')) problems.push(`${w}: no root`);
  if (!ORIGIN_NAMES[e.origin]) problems.push(`${w}: unknown origin ${e.origin}`);
  if (e.parts.length > 1) { split++; if (!String(e.gloss || '').trim()) problems.push(`${w}: no put-together line`); }
  else { single++; if (!String(e.note || '').trim()) problems.push(`${w}: one part but no note`); }
  if (/'/.test(`${e.gloss}${e.note || ''}`)) problems.push(`${w}: straight apostrophe`);
  if (!e.src) problems.push(`${w}: no source`);
}
/* the fallback: never a split it isn't sure of */
const known = ['play', 'hope', 'kind', 'read', 'report'];
const quiet = ['read', 'ready', 'reason', 'under', 'uncle', 'interest', 'pretty', 'station', 'mention', 'nation', 'ever', 'dinner', 'misty', 'reality', 'bless', 'tender', 'former', 'motor', 'visor', 'inspector', 'union'];
for (const w of quiet)
  if (guessParts(w, known)) problems.push(`fallback split "${w}" (should show nothing)`);
/* (in- is left out of the fallback on purpose: it can mean "not" or "into") */
const want = { reporter: 'report+er', unkindness: 'un+kind+ness', hopeful: 'hope+ful', display: 'dis+play', transport: 'trans+port', bicycle: 'bi+cycle', prefer: 'pre+fer', relocate: 're+locate' };
for (const [w, parts] of Object.entries(want)) {
  const g = guessParts(w, known), got = g ? g.parts.map(x => x.text).join('+') : 'nothing';
  if (got !== parts) problems.push(`fallback "${w}": ${got}, wanted ${parts}`);
  if (g && !g.guess) problems.push(`fallback "${w}" isn't marked as a guess`);
}
if (wordPartsFor('predict').guess) problems.push('a built-in word came back as a guess');
if (process.argv.includes('--table')) {
  const src = x => x === 'E✓' ? 'Etymonline (checked Oct 30, 2026)' : 'Etymonline / Merriam-Webster (standard etymology, not re-fetched)';
  const lab = x => (x.type === 'prefix' ? `${x.show || x.text}-` : x.type === 'suffix' ? `-${x.show || x.text}` : (x.show || x.text)) + (x.show && x.show !== x.text ? ` (spelled “${x.text}” here)` : '');
  console.log(`| word | parts with meanings | put-together (or note) | origin; source |\n|---|---|---|---|\n${built.map(w => { const e = WORD_PARTS[w];
    const parts = e.parts.length > 1 ? e.parts.map(x => `${x.type} **${lab(x)}** “${x.meaning}”`).join(' + ') : `one part: **${w}** “${e.parts[0].meaning}”`;
    return `| ${w} | ${parts} | ${e.parts.length > 1 ? e.gloss : e.note} | ${ORIGIN_NAMES[e.origin]}; ${src(e.src)} |`; }).join('\n')}`);
  process.exit(0);
}
if (problems.length) { console.error(`✗ word parts: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`); process.exit(1); }
console.log(`✓ word parts: ${built.length} built-in words have entries (${split} split into parts, ${single} one-part words with a note, ${marked} parts with a marked spelling change); the fallback guess passed ${quiet.length + Object.keys(want).length} cases`);
