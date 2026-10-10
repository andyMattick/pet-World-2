// Every Pet Town lesson in Khan order, with where its video stands (docs: LESSON-VIDEOS.md).
//
//   node scripts/video-status.mjs            everything
//   node scripts/video-status.mjs bio1       one course (nouns, verbs, history…history4, bio1) or "math"
//
// States: recorded · placeholder (on YouTube) · built (MP4 made, not on YouTube yet) · script (written, not built) · Khan (nothing yet)
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const only = process.argv[2];
let vite = null;
/* the shared files import TypeScript, so they are loaded through Vite (PETTOWN_MODULES points at already-built JS instead) */
async function load(path) {
  if (process.env.PETTOWN_MODULES) return import(pathToFileURL(join(process.env.PETTOWN_MODULES, path.replace(/^src\//, '').replace(/\.ts$/, '.js'))).href);
  if (!vite) { const { createServer } = await import('vite'); vite = await createServer({ logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' }); }
  return vite.ssrLoadModule(`/${path}`);
}
const banks = await load('src/shared/questionBanks.js');
const registry = await load('src/shared/registry.ts');
const videos = await load('src/shared/lessonVideos.js');

/* lesson scripts by key */
const scripts = new Map();
const walk = (dir) => { if (!existsSync(dir)) return; for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith('.json')) { try { const s = JSON.parse(readFileSync(p, 'utf8')); if (s.key) scripts.set(s.key, p); } catch { /* not a script */ } } } };
walk('content/lessons');

const rows = [];
for (const course of banks.LESSON_COURSES) {
  if (only && only !== course.id) continue;
  let g = 0;
  for (const slot of banks.lessonLinkSlots(course.id)) {
    const parts = slot.key.split(':'); if (parts.length === 2) g++;
    rows.push({ order: parts.length === 2 ? `${course.id}.${g}` : `${course.id}.${g}.${parts[2]}`, key: slot.key, name: slot.name });
  }
}
if (!only || only === 'math') for (const shop of Object.values(registry.SHOPS)) {
  for (const st of shop.stations) if (st.skills.length) rows.push({ order: `math ${shop.id}.${st.id}`, key: `math:${shop.id}:${st.id}`, name: `${shop.name}: ${st.name}` });
}
if (!rows.length) { console.error(`video-status: no lessons for "${only}". Use a course id (${banks.LESSON_COURSES.map(c => c.id).join(', ')}) or math.`); process.exit(1); }

const count = { recorded: 0, placeholder: 0, built: 0, script: 0, Khan: 0 };
for (const row of rows) {
  const video = videos.lessonVideo(row.key);
  const built = existsSync(join('videos/out', `${row.key.replace(/:/g, '-')}.mp4`));
  const state = video ? video.kind : built ? 'built' : scripts.has(row.key) ? 'script' : 'Khan';
  count[state]++;
  const extra = video ? `${video.minutes ? `${video.minutes} min` : ''}` : state === 'Khan' ? '(no script yet)' : '';
  console.log(`${row.order.padEnd(16)} ${row.name.slice(0, 44).padEnd(45)} ${state.padEnd(12)} ${extra}`);
}
const withVideo = count.recorded + count.placeholder;
console.log(`\n${rows.length} lessons: ${withVideo} with a video (${count.recorded} recorded, ${count.placeholder} placeholder) · ${count.built} built, not uploaded · ${count.script} script only · ${count.Khan} still Khan`);
if (vite) await vite.close();
