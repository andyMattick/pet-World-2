/* Renders every cartoon SVG to /home/claude/pics-check/<word>.png (160px) and makes contact sheets.
   Run: node scripts/word-cartoons/render.mjs [outDir]   (needs Playwright's Chromium) */
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WORD_PICTURES, CLASS_CARTOONS } from '../../src/shared/wordPictures.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const out = process.argv[2] || '/home/claude/pics-check';
mkdirSync(out, { recursive: true });
let chromium;
try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = await import('/opt/npm-tools/node_modules/playwright/index.mjs')); }
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
const cartoons = [...WORD_PICTURES.filter(p => p.svg), ...Object.entries(CLASS_CARTOONS).map(([w, c]) => ({ w, ...c }))];   // built-in words, then added words' cartoons (docs/WORD-CARTOONS.md)
const svgOf = p => readFileSync(resolve(root, 'public/vocab-pics', p.svg), 'utf8');
for (const p of cartoons) {
  await page.setViewportSize({ width: 160, height: 160 });
  await page.setContent(`<body style="margin:0">${svgOf(p).replace('<svg ', '<svg width="160" height="160" ')}</body>`);
  await page.screenshot({ path: `${out}/${p.w}.png` });
}
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
async function sheet(name, cells){
  const html = `<body style="margin:0;background:#fff;font:600 15px system-ui"><div style="display:grid;grid-template-columns:repeat(5,170px);gap:8px;padding:8px">${cells.join('')}</div></body>`;
  await page.setViewportSize({ width: 5 * 178 + 10, height: 400 });
  await page.setContent(html);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
}
for (let i = 0; i < cartoons.length; i += 20)
  await sheet(`sheet-cartoons-${i / 20 + 1}`, cartoons.slice(i, i + 20).map(p =>
    `<div style="text-align:center">${svgOf(p).replace('<svg ', '<svg width="120" height="120" ')}<div>${esc(p.w)}</div></div>`));
const em = WORD_PICTURES.filter(p => !p.svg);
if (process.argv.includes('--class')) { await browser.close(); console.log(`${cartoons.length} cartoons rendered (class ones last), sheets in ${out}`); process.exit(0); }
for (let i = 0; i < em.length; i += 50)
  await sheet(`sheet-emoji-${i / 50 + 1}`, em.slice(i, i + 50).map(p =>
    `<div style="text-align:center;border:1px solid #eee;padding:4px"><div style="font-size:40px;line-height:1.2">${esc(p.emoji)}</div><div>${esc(p.w)} <small style="color:#999">${p.kind}</small></div></div>`));
await browser.close();
console.log(`${cartoons.length} cartoons rendered, sheets in ${out}`);
