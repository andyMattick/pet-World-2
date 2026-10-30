/* Checks the 🖼️ word pictures (src/shared/wordPictures.js, docs/WORD-PICTURES.md):
   - every built-in word (VOCAB_WORDS, PATTERN_WORDS) has exactly one entry, and no entry is for a word that isn't built in
   - every entry has a kind, a 1–3 emoji scene (the fallback) and a one-sentence alt
   - every cartoon's svg exists, is well-formed XML with a square viewBox and no scripts or outside links, and is under 8 KB
   - 25–50% of the words are cartoons
   - no picture has its own word written in it (text in a picture is only allowed for the words in TEXT_OK)
   - a photo, once added, has its file, credit, license and source, and the file exists
   - pictureFor: photo → cartoon → emoji, a grown-up's word gets its chosen emoji, unknown words give null
   Run: node scripts/check-word-pictures.mjs            (add --table to print the table for docs/WORD-PICTURES.md) */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VOCAB_WORDS, PATTERN_WORDS } from '../src/shared/vocab.js';
import { WORD_PICTURES, pictureFor, validPictureEmoji } from '../src/shared/wordPictures.js';
import { TEXT_OK } from './word-cartoons/scenes.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pics = resolve(root, 'public/vocab-pics');
const problems = [];
const built = [...new Set([...VOCAB_WORDS, ...PATTERN_WORDS].map(v => v.w.toLowerCase()))];
const seen = new Map();
for (const p of WORD_PICTURES) { if (seen.has(p.w)) problems.push(`${p.w}: two entries`); seen.set(p.w, p); }
for (const w of built) if (!seen.has(w)) problems.push(`${w}: no picture entry`);
for (const w of seen.keys()) if (!built.includes(w)) problems.push(`${w}: entry for a word that isn't built in`);

const graphemes = s => [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(s)].map(x => x.segment).filter(c => c.trim());
/* very small XML well-formedness check: tags balance, attributes are quoted, no stray < or & */
function xmlProblem(src){
  const body = src.replace(/<\?xml[^>]*\?>/, '').trim();
  const stack = [];
  const re = /<(\/?)([a-zA-Z][\w:-]*)((?:\s+[\w:-]+="[^"<]*")*)\s*(\/?)>|<!--[\s\S]*?-->/g;
  let last = 0, m;
  while ((m = re.exec(body))) {
    const between = body.slice(last, m.index);
    if (/[<>]/.test(between)) return `stray < or > near "${between.slice(0, 30)}"`;
    if (/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);)/i.test(between)) return 'bare &';
    last = re.lastIndex;
    if (!m[2]) continue;
    if (m[1]) { if (stack.pop() !== m[2]) return `</${m[2]}> doesn't match`; }
    else if (!m[4]) stack.push(m[2]);
  }
  if (/[<>]/.test(body.slice(last))) return 'unparsed tag (unquoted attribute?)';
  if (stack.length) return `<${stack.at(-1)}> not closed`;
  return '';
}

let cartoons = 0;
const KINDS = ['photo', 'cartoon', 'emoji'];
for (const p of WORD_PICTURES) {
  if (!KINDS.includes(p.kind)) problems.push(`${p.w}: kind "${p.kind}"`);
  const em = graphemes(String(p.emoji || ''));
  if (!em.length || em.length > 3) problems.push(`${p.w}: emoji scene "${p.emoji}" should be 1–3 emoji`);
  if (validPictureEmoji(p.emoji) !== p.emoji) problems.push(`${p.w}: emoji scene "${p.emoji}" has something that isn't emoji`);
  const alt = String(p.alt || '').trim();
  if (alt.length < 8) problems.push(`${p.w}: no alt`);
  else if (!/[.?!”]$/.test(alt) || (alt.match(/[.?!](\s|$)/g) || []).length > 1) problems.push(`${p.w}: alt should be one sentence`);
  if (/'/.test(alt)) problems.push(`${p.w}: straight apostrophe in alt`);
  if (p.kind === 'cartoon') {
    cartoons++;
    if (p.svg !== `cartoons/${p.w}.svg`) problems.push(`${p.w}: svg path "${p.svg}"`);
  } else if (p.svg) problems.push(`${p.w}: has an svg but kind is ${p.kind}`);
  if (p.kind === 'photo' && (!p.photo || typeof p.photo !== 'object')) problems.push(`${p.w}: photo word without a photo slot`);
  if (p.photo?.file) {
    for (const k of ['credit', 'license', 'source']) if (!String(p.photo[k] || '').trim()) problems.push(`${p.w}: photo has no ${k}`);
    if (!existsSync(resolve(pics, p.photo.file))) problems.push(`${p.w}: photo file ${p.photo.file} is missing`);
    if (/^https?:/.test(p.photo.file)) problems.push(`${p.w}: photo must be stored in the repo, not linked`);
  }
  if (p.svg) {
    const file = resolve(pics, p.svg);
    if (!existsSync(file)) { problems.push(`${p.w}: ${p.svg} is missing`); continue; }
    const src = readFileSync(file, 'utf8'), size = statSync(file).size;
    if (size > 8192) problems.push(`${p.w}: ${size} bytes (over 8 KB)`);
    const bad = xmlProblem(src); if (bad) problems.push(`${p.w}: not valid XML (${bad})`);
    const vb = src.match(/<svg[^>]*viewBox="([\d.\s-]+)"/);
    const v = vb ? vb[1].trim().split(/\s+/).map(Number) : null;
    if (!v || v.length !== 4 || v[2] !== v[3]) problems.push(`${p.w}: viewBox isn't square`);
    if (/<script|on\w+=|<image|<foreignObject|href="(?!#)/i.test(src)) problems.push(`${p.w}: has a script, image or outside link`);
    const words = [...src.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map(m => m[1]).join(' ');
    if (words.toLowerCase().includes(p.w)) problems.push(`${p.w}: the picture has its own word written in it`);
    if (/[a-z]{2,}/i.test(words) && !TEXT_OK[p.w]) problems.push(`${p.w}: has words in it ("${words}"); add to TEXT_OK only if essential`);
  }
}
const share = cartoons / WORD_PICTURES.length;
if (share < 0.25 || share > 0.5) problems.push(`cartoons are ${(share * 100).toFixed(0)}% of words (should be 25–50%)`);

/* pictureFor */
const expect = (cond, msg) => { if (!cond) problems.push(`pictureFor: ${msg}`); };
expect(pictureFor('analyze')?.kind === 'cartoon' && pictureFor('analyze').src === '/vocab-pics/cartoons/analyze.svg', 'analyze should be its cartoon');
expect(pictureFor('Fragile ')?.kind === (seen.get('fragile').photo?.file ? 'photo' : 'emoji'), 'fragile should be its photo or, until then, its emoji');
expect(pictureFor('perhaps')?.kind === 'emoji', 'perhaps should be emoji');
expect(pictureFor('zorbleflux') === null, 'unknown word should be null');
expect(pictureFor('apples', { w: 'apples', pic: '🍎' })?.emoji === '🍎', 'a grown-up’s word should show their emoji');
expect(pictureFor('apples', { w: 'apples', pic: 'apple 🍎' }) === null, 'text is not an emoji scene');
expect(pictureFor('apples', { w: 'apples', pic: '🍎🍎🍎🍎' }) === null, 'more than 3 emoji is not allowed');
for (const p of WORD_PICTURES) { const got = pictureFor(p.w); expect(got && got.emoji && got.alt, `${p.w} gives nothing`); }

if (process.argv.includes('--table')) {
  console.log('| Word | Kind | Emoji | Picture (alt) |\n|---|---|---|---|');
  for (const p of WORD_PICTURES) console.log(`| ${p.w} | ${p.kind} | ${p.emoji} | ${p.alt} |`);
}
const counts = KINDS.map(k => `${WORD_PICTURES.filter(p => p.kind === k).length} ${k}`).join(', ');
if (problems.length) { console.error(`✗ word pictures: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`); process.exit(1); }
console.log(`✓ word pictures: ${WORD_PICTURES.length} words (${counts}; ${(share * 100).toFixed(0)}% cartoons), every svg valid, square, under 8 KB`);
