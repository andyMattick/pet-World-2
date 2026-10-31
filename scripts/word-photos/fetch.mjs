/* 📷 Real photos for the built-in Word Workshop words (docs/WORD-PICTURES.md, "The photo plan").

   picks.json lists one Wikimedia Commons file per photo word, chosen by eye to show the meaning at phone size, with its
   own alt sentence. This script, run where Wikimedia can be reached (a Codespace, or your computer):
     1. asks Commons for each file's license and author, and refuses anything that isn't CC0, public domain, CC BY or
        CC BY-SA (no NC, no ND, no "editorial use");
     2. downloads a 960px copy, crops it square to 400 × 400 (sharp's "attention" crop keeps the subject in frame;
        "fit":"contain" in picks.json fits the whole picture on a cream square instead), and saves it as a JPEG under
        60 KB in public/vocab-pics/photos/<word>.jpg;
     3. writes src/shared/wordPhotos.js: file, credit (the author), license, source (the Commons page) and alt.

   npm i --no-save sharp                      # once (sharp is only needed here, so it isn't a dependency)
   node scripts/word-photos/fetch.mjs         # every word in picks.json
   node scripts/word-photos/fetch.mjs vivid   # just these words (the others in wordPhotos.js are kept)
   node scripts/check-word-pictures.mjs       # then the checks

   To swap a photo: change its file (and alt) in picks.json, run this for that word, look at the JPEG, run the check. */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const picks = JSON.parse(readFileSync(resolve(root, 'scripts/word-photos/picks.json'), 'utf8'));
const outDir = resolve(root, 'public/vocab-pics/photos');
const dataFile = resolve(root, 'src/shared/wordPhotos.js');
const UA = 'PetWorldWordPhotos/1.0 (https://github.com/andyMattick/pet-World-2)';
const SIZE = 400, MAX_BYTES = 60 * 1024, BG = '#FFF8F2';

let sharp;
try { sharp = (await import('sharp')).default; }
catch { console.error('sharp is needed to crop the photos. Run: npm i --no-save sharp'); process.exit(1); }

const only = process.argv.slice(2).map(s => s.toLowerCase());
const todo = only.length ? picks.filter(p => only.includes(p.w)) : picks;
if (only.length && todo.length !== only.length) { console.error(`Not in picks.json: ${only.filter(w => !picks.some(p => p.w === w)).join(', ')}`); process.exit(1); }

/* Commons license names → the license line kept with the photo; anything else is refused */
function licenseOf(name){
  const n = String(name || '').trim();
  if (/^cc0/i.test(n)) return 'CC0';
  if (/^(public domain|pd\b|pd-)/i.test(n)) return 'Public domain';
  const m = n.match(/^cc[ -]by(-sa)?[ -]([\d.]+)/i);
  if (m && !/nc|nd/i.test(n)) return `CC BY${m[1] ? '-SA' : ''} ${m[2]}`;
  return null;
}
/* the author, as plain text: no HTML, links or "please credit me as" wording */
function authorOf(html){
  let t = String(html || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, '’').replace(/&nbsp;/g, ' ');
  const asked = t.match(/credit me as(?: author)?:?\s*([^,(\n]+)/i);
  if (asked) t = asked[1];
  t = t.replace(/https?:\/\/\S+/g, '').replace(/\(\s*\)/g, '').replace(/\s+/g, ' ').trim().replace(/[,;:]$/, '');
  return t.slice(0, 80) || 'Unknown photographer';
}

async function api(titles){
  const body = new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', titles: titles.map(t => 'File:' + t).join('|'),
    prop: 'imageinfo', iiprop: 'url|extmetadata|size', iiurlwidth: '960', iiextmetadatafilter: 'LicenseShortName|Artist|Credit' });
  const r = await fetch('https://commons.wikimedia.org/w/api.php', { method: 'POST', body, headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`Commons API: HTTP ${r.status}`);
  const j = await r.json();
  const norm = new Map((j.query.normalized || []).map(n => [n.to, n.from]));
  return new Map(j.query.pages.map(p => [(norm.get(p.title) || p.title).replace(/^File:/, ''), p]));
}

const info = new Map();
for (let i = 0; i < todo.length; i += 40) for (const [k, v] of await api(todo.slice(i, i + 40).map(p => p.file))) info.set(k, v);

const prev = existsSync(dataFile) ? (await import(dataFile + '?t=' + Date.now())).WORD_PHOTOS || {} : {};
const done = { ...prev }, problems = [];
mkdirSync(outDir, { recursive: true });

for (const p of todo) {
  try {
    const page = info.get(p.file) || [...info.values()].find(x => x.title === 'File:' + p.file);
    const ii = page?.imageinfo?.[0];
    if (!ii) throw new Error('not found on Commons');
    const meta = ii.extmetadata || {};
    const license = licenseOf(meta.LicenseShortName?.value);
    if (!license) throw new Error(`license “${meta.LicenseShortName?.value}” isn’t one we can use`);
    const url = ii.thumburl || ii.url;
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!r.ok) throw new Error(`download: HTTP ${r.status}`);
    const input = Buffer.from(await r.arrayBuffer());
    const base = sharp(input).rotate().resize(SIZE, SIZE, p.fit === 'contain' ? { fit: 'contain', background: BG } : { fit: 'cover', position: sharp.strategy.attention }).flatten({ background: BG });
    let q = 82, jpg;
    do { jpg = await base.clone().jpeg({ quality: q, mozjpeg: true }).toBuffer(); q -= 6; } while (jpg.length > MAX_BYTES && q > 30);
    if (jpg.length > MAX_BYTES) throw new Error(`still ${Math.round(jpg.length / 1024)} KB at the lowest quality`);
    writeFileSync(resolve(outDir, `${p.w}.jpg`), jpg);
    done[p.w] = { file: `photos/${p.w}.jpg`, credit: authorOf(meta.Artist?.value || meta.Credit?.value), license,
      source: ii.descriptionurl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(p.file.replace(/ /g, '_'))}`, alt: p.alt };
    console.log(`✓ ${p.w.padEnd(13)} ${String(Math.round(jpg.length / 1024)).padStart(2)} KB  ${license.padEnd(14)} ${done[p.w].credit}`);
  } catch (e) {
    problems.push(`${p.w}: ${e.message}`);
    console.error(`✗ ${p.w}: ${e.message}`);
  }
}

/* wordPhotos.js, in picks.json order */
const order = picks.map(p => p.w).filter(w => done[w]);
const q = s => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
writeFileSync(dataFile, `/* 📷 Photos for the built-in Word Workshop words. MADE BY scripts/word-photos/fetch.mjs from picks.json: don't edit by
   hand (change picks.json and run the script). Every photo is from Wikimedia Commons under CC0, public domain, CC BY or
   CC BY-SA, saved in public/vocab-pics/photos/ (400 × 400, under 60 KB). wordPictures.js attaches them to the words. */
export const WORD_PHOTOS = {
${order.map(w => { const d = done[w]; return `  ${/^[a-z]+$/.test(w) ? w : q(w)}: { file: ${q(d.file)}, credit: ${q(d.credit)}, license: ${q(d.license)},\n    source: ${q(d.source)},\n    alt: ${q(d.alt)} },`; }).join('\n')}
};
`);
console.log(`\n${order.length} of ${picks.length} photo words have photos (src/shared/wordPhotos.js).`);
if (problems.length) { console.error(`\n${problems.length} problem(s):\n  ${problems.join('\n  ')}`); process.exit(1); }
