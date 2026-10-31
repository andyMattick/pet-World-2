/* Checks the 🖼️ word pictures (src/shared/wordPictures.js, docs/WORD-PICTURES.md):
   - every built-in word (VOCAB_WORDS, PATTERN_WORDS) has exactly one entry, and no entry is for a word that isn't built in
   - every entry has a kind, a 1–3 emoji scene (the fallback) and a one-sentence alt
   - every cartoon's svg exists, is well-formed XML with a square viewBox and no scripts or outside links, and is under 8 KB
   - 25–50% of the words are cartoons
   - no picture has its own word written in it (text in a picture is only allowed for the words in TEXT_OK)
   - a photo, once added, has its file, credit, license and source, and the file exists; it's a square JPEG about
     400 × 400 under 60 KB, with an open license, its Commons page as the source and a one-sentence alt; every photo word
     is in scripts/word-photos/picks.json (scripts/word-photos/fetch.mjs makes the photos)
   - pictureFor: photo → cartoon → emoji, a grown-up's word gets its chosen emoji, unknown words give null
   - words a grown-up or teacher ADDS (F92): photo → CLASS_CARTOONS → chosen emoji → suggested emoji → none; every
     CLASS_CARTOONS svg passes the same checks as the built-in cartoons; the emoji suggestions stay conservative; a photo
     needs an open license, a credit and a source; the photo search keeps only open, non-mature results
   Run: node scripts/check-word-pictures.mjs            (add --table to print the table for docs/WORD-PICTURES.md) */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VOCAB_WORDS, PATTERN_WORDS } from '../src/shared/vocab.js';
import { WORD_PICTURES, pictureFor, validPictureEmoji, CLASS_CARTOONS, suggestEmoji, validWordPhoto, needsCartoon, cartoonRequest } from '../src/shared/wordPictures.js';
import { photoFromResult, photoCredit, photoSearchURL, searchPhotos } from '../src/shared/photoSearch.js';
import { validWord } from '../src/shared/vocab.js';
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

/* a JPEG's width and height, from its SOF marker */
function jpegSize(b){
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xFF) return null;
    const m = b[i + 1], len = b.readUInt16BE(i + 2);
    if (m >= 0xC0 && m <= 0xCF && ![0xC4, 0xC8, 0xCC].includes(m)) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}
const PHOTO_LICENSE_LINE = /^(CC0|Public domain|CC BY(-SA)? [\d.]+)$/;
/* every photo word in picks.json, and only photo words */
const PICKS = JSON.parse(readFileSync(resolve(root, 'scripts/word-photos/picks.json'), 'utf8'));
for (const k of PICKS) {
  if (seen.get(k.w)?.kind !== 'photo') problems.push(`picks.json: ${k.w} isn't a photo word`);
  if (!k.file || !k.alt) problems.push(`picks.json: ${k.w} needs a file and an alt`);
}
for (const p of WORD_PICTURES) if (p.kind === 'photo' && !PICKS.some(k => k.w === p.w)) problems.push(`${p.w}: photo word missing from scripts/word-photos/picks.json`);

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
    if (p.kind !== 'photo') problems.push(`${p.w}: has a photo but kind is ${p.kind}`);
    if (p.photo.file !== `photos/${p.w}.jpg`) problems.push(`${p.w}: photo file should be photos/${p.w}.jpg`);
    if (!PHOTO_LICENSE_LINE.test(String(p.photo.license || ''))) problems.push(`${p.w}: photo license "${p.photo.license}" isn't CC0, public domain, CC BY or CC BY-SA`);
    if (!/^https:\/\/commons\.wikimedia\.org\/wiki\/File(:|%3A)/i.test(String(p.photo.source || ''))) problems.push(`${p.w}: photo source should be its Wikimedia Commons page`);
    const palt = String(p.photo.alt || '').trim();
    if (palt.length < 8 || !/[.?!”]$/.test(palt) || (palt.match(/[.?!](\s|$)/g) || []).length > 1) problems.push(`${p.w}: photo alt should be one sentence`);
    if (/'/.test(palt)) problems.push(`${p.w}: straight apostrophe in photo alt`);
    const f = resolve(pics, p.photo.file);
    if (existsSync(f)) {
      const b = readFileSync(f);
      if (b.length > 60 * 1024) problems.push(`${p.w}: photo is ${Math.round(b.length / 1024)} KB (over 60 KB)`);
      if (b[0] !== 0xFF || b[1] !== 0xD8) problems.push(`${p.w}: photo isn't a JPEG`);
      else { const d = jpegSize(b); if (!d || d.w !== d.h || d.w < 300 || d.w > 600) problems.push(`${p.w}: photo should be square, about 400 × 400 (is ${d ? `${d.w} × ${d.h}` : 'unreadable'})`); }
    }
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
/* cartoons drawn later for added words (docs/WORD-CARTOONS.md) */
for (const [w, c] of Object.entries(CLASS_CARTOONS)) {
  if (w !== w.toLowerCase().trim()) problems.push(`CLASS_CARTOONS ${w}: key should be the word in lower case`);
  if (seen.has(w)) problems.push(`CLASS_CARTOONS ${w}: it's a built-in word (it already has a picture)`);
  if (c.svg !== `cartoons/class/${w}.svg`) problems.push(`CLASS_CARTOONS ${w}: svg path "${c.svg}" should be cartoons/class/${w}.svg`);
  if (validPictureEmoji(c.emoji) !== c.emoji) problems.push(`CLASS_CARTOONS ${w}: emoji "${c.emoji}" should be 1–3 emoji`);
  if (String(c.alt || '').trim().length < 8) problems.push(`CLASS_CARTOONS ${w}: no alt`);
  const file = resolve(pics, String(c.svg || ''));
  if (!existsSync(file)) { problems.push(`CLASS_CARTOONS ${w}: ${c.svg} is missing`); continue; }
  const src = readFileSync(file, 'utf8');
  if (statSync(file).size > 8192) problems.push(`CLASS_CARTOONS ${w}: over 8 KB`);
  const bad = xmlProblem(src); if (bad) problems.push(`CLASS_CARTOONS ${w}: not valid XML (${bad})`);
  const vb = src.match(/<svg[^>]*viewBox="([\d.\s-]+)"/), v = vb ? vb[1].trim().split(/\s+/).map(Number) : null;
  if (!v || v.length !== 4 || v[2] !== v[3]) problems.push(`CLASS_CARTOONS ${w}: viewBox isn't square`);
  if (/<script|on\w+=|<image|<foreignObject|href="(?!#)/i.test(src)) problems.push(`CLASS_CARTOONS ${w}: has a script, image or outside link`);
  const words = [...src.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map(m => m[1]).join(' ');
  if (words.toLowerCase().includes(w)) problems.push(`CLASS_CARTOONS ${w}: the picture has its own word written in it`);
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
expect(pictureFor('zorble', { w: 'zorble', d: 'a made-up thing', pic: 'apple 🍎' }) === null, 'text is not an emoji scene');
expect(pictureFor('zorble', { w: 'zorble', d: 'a made-up thing', pic: '🍎🍎🍎🍎' }) === null, 'more than 3 emoji is not allowed');

/* words a grown-up or teacher adds (F92) */
const photo = { src: 'https://api.openverse.org/v1/images/abc/thumb/', credit: '“Red apples” by Jo (CC BY 2.0)', license: 'by', licenseVersion: '2.0', source: 'https://www.flickr.com/photos/jo/1' };
const data = { ...photo, src: 'data:image/jpeg;base64,' + 'A'.repeat(1000) };
expect(pictureFor('apples', { w: 'apples', d: 'round fruit' })?.emoji === '🍎' && pictureFor('apples', { w: 'apples', d: 'round fruit' }).suggested, 'an added word with no choice gets the suggested emoji');
expect(pictureFor('apples', { w: 'apples', d: 'round fruit', noPic: true }) === null, '“No picture” turns the suggestion off');
expect(pictureFor('apples', { w: 'apples', d: 'round fruit', pic: '🍏' })?.emoji === '🍏', 'the chosen emoji wins over the suggestion');
const ph = pictureFor('apples', { w: 'apples', d: 'round fruit', pic: '🍏', photo });
expect(ph?.kind === 'photo' && ph.src === photo.src && ph.credit === photo.credit && ph.emoji === '🍏', 'a picked photo comes first, with its credit (and the emoji behind it)');
expect(pictureFor('apples', { w: 'apples', d: 'x', photo: data })?.src === data.src, 'a saved data-URL photo shows');
expect(pictureFor('apples', { w: 'apples', d: 'x', photo: { ...photo, license: 'by-nc' } })?.kind !== 'photo', 'a non-commercial license is never shown');
expect(!validWordPhoto({ ...photo, credit: '' }) && !validWordPhoto({ ...photo, source: 'http://x.org' }) && !validWordPhoto({ ...photo, src: 'javascript:alert(1)' }), 'a photo needs a credit, an https source and a safe src');
expect(!validWordPhoto({ ...data, src: 'data:image/jpeg;base64,' + 'A'.repeat(40000) }), 'a saved photo over the size cap is dropped');
expect(pictureFor('analyze', { w: 'analyze', d: 'x', photo })?.kind === 'cartoon', 'a built-in word keeps its own picture');
const kept = validWord({ w: 'apples', d: 'round fruit', pic: '🍎', photo });
expect(kept?.pic === '🍎' && kept.photo?.credit === photo.credit, 'validWord keeps the picked picture');
expect(validWord({ w: 'apples', d: 'round fruit', noPic: true })?.noPic === true, 'validWord keeps “No picture”');
/* the suggestions: meanings only, conservative */
const SUGGEST = [['apples', 'round fruit', '🍎'], ['gigantic', 'very big', '🐘'], ['glum', 'sad and quiet', '😢'], ['soar', 'to fly high in the air', '🕊️'],
  ['puny', 'not big or strong', ''], ['hesitate', 'to stop for a moment because you are unsure', ''], ['zorble', 'a made-up thing', ''], ['belief', 'something you think is true', '🤔'],
  ['barren', 'without plants or water', ''], ['kayak', 'a small boat you paddle', '⛵'], ['orchard', 'a field of fruit trees', '🍎🌳']];
for (const [w, d, want] of SUGGEST) expect(suggestEmoji(w, d) === want, `suggestEmoji(${w}, “${d}”) gave “${suggestEmoji(w, d)}”, expected “${want}”`);
for (const v of [...VOCAB_WORDS, ...PATTERN_WORDS]) { const e = suggestEmoji(v.w, v.d); if (e && validPictureEmoji(e) !== e) expect(false, `suggestion for ${v.w} isn't 1–3 emoji`); }
/* the cartoon ramp */
const need = needsCartoon([{ w: 'apples', d: 'round fruit' }, { w: 'Apples', d: 'again' }, { w: 'analyze', d: 'x' }, { w: 'kayak', d: 'a small boat', s: 'We paddled the ___.' }]);
expect(need.map(v => v.w).join() === 'apples,kayak', 'Needs a cartoon: added words only, each once, built-in words left out');
const req = cartoonRequest([{ w: 'kayak', d: 'a small boat', s: 'We paddled the ___.' }]);
expect(/pet-world-word-cartoons/.test(req) && /kayak: means "a small boat"\. Example: "We paddled the kayak\."/.test(req) && /CLASS_CARTOONS/.test(req), 'the request names the skill and lists meaning and sentence');
expect(cartoonRequest([{ w: 'analyze', d: 'x' }]) === '', 'no request when nothing needs a cartoon');
/* the photo search: open licenses only, no mature results, at most 6 */
expect(/license=cc0,pdm,by,by-sa/.test(photoSearchURL('red apple')) && /mature=false/.test(photoSearchURL('x')) && /q=red%20apple/.test(photoSearchURL('red apple')), 'search URL asks for open licenses with safe search');
const R0 = { id: '1', title: 'Apples', creator: 'Jo', license: 'by', license_version: '2.0', thumbnail: 'https://api.openverse.org/v1/images/1/thumb/', foreign_landing_url: 'https://flickr.com/1', mature: false };
expect(photoFromResult(R0)?.license === 'by' && !photoFromResult({ ...R0, license: 'by-nc' }) && !photoFromResult({ ...R0, license: 'by-nd' }) && !photoFromResult({ ...R0, mature: true }) && !photoFromResult({ ...R0, thumbnail: 'http://x', url: '' }), 'photo results: open licenses only, never mature');
expect(photoCredit(photoFromResult(R0)) === '“Apples” by Jo (CC BY 2.0)' && photoCredit(photoFromResult({ ...R0, license: 'pdm', title: '' })) === 'Photo by Jo (public domain)', 'credit text');
const fake = async () => ({ ok: true, json: async () => ({ results: Array.from({ length: 9 }, (_, i) => ({ ...R0, id: String(i), thumbnail: `https://api.openverse.org/v1/images/${i}/thumb/`, license: i === 2 ? 'by-nc' : 'by' })) }) });
const got = await searchPhotos('apple', fake);
expect(got.length === 6 && got.every(p => p.license === 'by'), 'search keeps 6 open-license results');
let threw = ''; try { await searchPhotos('apple', async () => ({ ok: false, status: 429 })); } catch (e) { threw = e.message; }
expect(/Too many/.test(threw), 'a busy search says so');
for (const p of WORD_PICTURES) { const got = pictureFor(p.w); expect(got && got.emoji && got.alt, `${p.w} gives nothing`); }

if (process.argv.includes('--table')) {
  console.log('| Word | Kind | Emoji | Picture (alt) |\n|---|---|---|---|');
  for (const p of WORD_PICTURES) console.log(`| ${p.w} | ${p.kind} | ${p.emoji} | ${p.alt} |`);
}
const counts = KINDS.map(k => `${WORD_PICTURES.filter(p => p.kind === k).length} ${k}`).join(', ');
const photosIn = WORD_PICTURES.filter(p => p.photo?.file).length;
if (problems.length) { console.error(`✗ word pictures: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`); process.exit(1); }
console.log(`✓ word pictures: ${WORD_PICTURES.length} words (${counts}; ${(share * 100).toFixed(0)}% cartoons; ${photosIn} photos in), every svg valid, square, under 8 KB; ${Object.keys(CLASS_CARTOONS).length} class cartoons; added-word photos, emoji suggestions and the photo search checked`);
