// Math check: generates thousands of problems for every 6th grade math skill in the real game and checks them.
//   1. Answer keys: each skill's key is compared with an independent solver in scripts/math-oracles/<shop>.js. A solver
//      reads only what the student sees (the story, the picture's text, the choices) and works the answer out itself.
//   2. Choices: exactly one right choice, no repeated choices, at least 2 choices.
//   3. Text: no NaN or undefined in anything she reads.
//   4. Quizzes and tests (docs/TEST-GATE.md): on an assessment only the answer steps show, with testPrompt. Any number a
//      worked prompt gave her must also be in the story or the picture, so a plain "Your answer = ?" still has all the
//      givens. A number that's only in the prompt is listed (some are fine, like a 2 for "double"; check them by eye).
// Run: node scripts/check-math.mjs [--site <built folder>] [--n 400] [--shop show] [--skill meanCalc]
// It builds the game (like npm run smoke) unless --site is given. Needs Playwright: npx playwright install chromium
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const arg = (name, def) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : def; };
let site = arg('site') ? path.resolve(arg('site')) : path.join(root, 'dist-mathcheck');
const N = +arg('n', 400), onlyShop = arg('shop'), onlySkill = arg('skill');
if (!arg('site')) {
  const { build } = await import('vite');
  await build({ root, logLevel: 'error', build: { outDir: site, emptyOutDir: true, rollupOptions: { input: { game: path.join(root, 'index.html') } } } });
}
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let file = path.join(site, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(site)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(res);
});
await new Promise(ok => server.listen(0, '127.0.0.1', ok));
let chromium;
try { ({ chromium } = await import('playwright')); } catch { console.log('❌ The math check needs Playwright: npm install'); process.exit(1); }
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
const page = await browser.newPage(), pageErrors = [];
page.on('pageerror', e => pageErrors.push(e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/index.html?mathcheck`);
await page.waitForFunction(() => window.PetWorldMath, null, { timeout: 20000 });
await page.evaluate(() => { window.ORACLES = {}; });
const oracleDir = path.join(root, 'scripts', 'math-oracles');
for (const f of fs.readdirSync(oracleDir).filter(f => f.endsWith('.js')).sort()) await page.addScriptTag({ content: fs.readFileSync(path.join(oracleDir, f), 'utf8') });

const G6 = ['cafe', 'bakery', 'market', 'clock', 'rink', 'potion', 'fair', 'houses', 'harbor', 'post', 'show'];
const report = await page.evaluate(({ N, G6, onlyShop, onlySkill }) => {
  const { GEN, SKILLS, answerStepsFor, testPrompt } = window.PetWorldMath, O = window.ORACLES;
  const strip = h => String(h || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ');
  const val = (a, st) => { if (Array.isArray(a)) return st && st.kind === 'frac' ? a[0] + a[1] / a[2] : a.join(','); return typeof a === 'string' && /^-?[\d.]+$/.test(a) ? parseFloat(a) : a; };   // a fraction answer [whole, top, bottom] compares as its value; other lists (ratios, points, counts) as text
  const nums = t => (String(t).replace(/−/g, '-').match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const same = (a, b) => typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) < 1e-6 : String(a).replace(/\s+/g, ' ').trim() === String(b).replace(/\s+/g, ' ').trim();
  const out = [];
  for (const [sk, info] of Object.entries(SKILLS)) {
    const shop = info.shop || 'cafe';   // the Café's skills have no shop field
    if (!G6.includes(shop) || !GEN[sk] || (onlyShop && shop !== onlyShop) || (onlySkill && sk !== onlySkill)) continue;
    const r = { sk, shop, n: 0, oracle: !!O[sk], keyWrong: 0, choiceBad: 0, textBad: 0, promptOnly: 0, ex: {} };
    for (const lvl of [1, 2, 3]) for (let i = 0; i < N; i++) {
      let p; try { p = GEN[sk](lvl); } catch (e) { r.textBad++; r.ex.text = r.ex.text || `throws: ${e.message}`; continue; }
      r.n++;
      const seen = strip(p.bubble) + ' ' + strip(p.visual) + ' ' + p.steps.map(s => (s.options || []).map(o => s.kind === 'choice' ? strip(o.html) + ' ' + o.text : '').join(' ')).join(' ');
      if (/NaN|undefined|\[object/.test(seen + p.steps.map(s => s.prompt).join(' '))) { r.textBad++; r.ex.text = r.ex.text || `L${lvl}: ${strip(p.bubble).slice(0, 140)}`; }
      for (const st of p.steps) if (st.kind === 'choice') {
        const ok = st.options.filter(o => o.ok).length, texts = st.options.map(o => o.text);
        if (ok !== 1 || new Set(texts).size !== texts.length || texts.length < 2) { r.choiceBad++; r.ex.choice = r.ex.choice || `L${lvl}: ${ok} right of ${texts.length}: ${texts.join(' | ').slice(0, 160)}`; }
      }
      const shown = answerStepsFor(p), hidden = p.steps.filter(s => !shown.includes(s));
      const hiddenVals = hidden.filter(s => s.kind !== 'choice').map(s => val(s.answer, s)).filter(v => typeof v === 'number');
      const seenNums = nums(seen);
      for (const st of shown) {
        if (st.kind === 'choice' || testPrompt(st, shown.length) === st.prompt) continue;
        const missing = nums(st.prompt).filter(x => !seenNums.some(y => Math.abs(x - y) < 1e-9) && !hiddenVals.some(y => Math.abs(x - y) < 1e-9) && ![0, 1, 2, 4].includes(Math.abs(x)));
        if (missing.length) { r.promptOnly++; r.ex.prompt = r.ex.prompt || `L${lvl}: ${strip(p.bubble).slice(0, 110)} || prompt: ${st.prompt} || only in the prompt: ${missing.join(', ')}`; }
      }
      if (O[sk]) {
        const key = shown[shown.length - 1]; let want;
        try { want = O[sk](p, lvl); } catch (e) { r.keyWrong++; r.ex.key = r.ex.key || `solver threw on L${lvl}: ${e.message} || ${strip(p.bubble).slice(0, 120)}`; continue; }
        if (want === undefined || want === null) continue;   // the solver can't tell from the text alone
        const got = key.kind === 'choice' ? key.options.find(o => o.ok)?.text : val(key.answer, key);
        const w = key.kind === 'choice' ? want : val(want, key);
        if (!same(got, w)) { r.keyWrong++; r.ex.key = r.ex.key || `L${lvl}: ${strip(p.bubble).slice(0, 140)} || key ${JSON.stringify(got)}, solver ${JSON.stringify(w)}`; }
      }
    }
    out.push(r);
  }
  return out;
}, { N, G6, onlyShop, onlySkill });
await browser.close(); server.close();
let bad = 0, noOracle = [];
for (const r of report) {
  const probs = [r.keyWrong && `${r.keyWrong} wrong keys`, r.choiceBad && `${r.choiceBad} bad choice sets`, r.textBad && `${r.textBad} text errors`].filter(Boolean);
  if (!r.oracle) noOracle.push(r.sk);
  if (probs.length) { bad++; console.log(`❌ ${r.shop}/${r.sk}: ${probs.join(', ')}`); Object.entries(r.ex).filter(([k]) => k !== 'prompt').forEach(([, v]) => console.log(`     ${v}`)); }
  if (r.promptOnly) console.log(`⚠️  ${r.shop}/${r.sk}: ${r.promptOnly} test prompts had a number she can't see elsewhere. ${r.ex.prompt}`);
}
console.log(`\nChecked ${report.length} skills, ${report.reduce((n, r) => n + r.n, 0)} problems.`);
if (noOracle.length) console.log(`No solver yet for ${noOracle.length} skills: ${noOracle.join(', ')}`);
if (pageErrors.length) console.log(`Page errors: ${pageErrors.slice(0, 3).join(' | ')}`);
console.log(bad || pageErrors.length ? `❌ ${bad} skills have problems.` : '✅ Every answer key matches its solver, and every choice set and text is clean.');
process.exit(bad || pageErrors.length ? 1 : 0);
