// Smoke test: opens the real game in a headless browser and checks sign-in on the situations that have broken before
// (docs: PRACTICE-TIME.md, "Two devices"). Run: npm run smoke
//
// It builds the game into dist-smoke/, serves it, and stands in for Supabase with a pretend server kept in the
// page's localStorage (window.__PET_TOWN_FAKE_BACKEND__, read by src/lib/supabase.ts). Nothing touches the real
// database. Needs the Playwright browser once: npx playwright install chromium
//   --site <folder>   test an already-built folder instead of building
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const siteArg = process.argv.indexOf('--site');
let site = siteArg > 0 ? path.resolve(process.argv[siteArg + 1]) : path.join(root, 'dist-smoke');

if (siteArg < 0) {
  const { build } = await import('vite');
  await build({ root, logLevel: 'error', build: { outDir: site, emptyOutDir: true, rollupOptions: { input: { game: path.join(root, 'index.html') } } } });
}

/* a tiny static server for the built game */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  let file = path.join(site, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(site)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(res);
});
await new Promise(ok => server.listen(0, '127.0.0.1', ok));
const url = `http://127.0.0.1:${server.address().port}/index.html`;

let chromium;
try { ({ chromium } = await import('playwright')); } catch { console.log('❌ Smoke test needs Playwright: npm install'); process.exit(1); }
let browser;
try { browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {}); }
catch (error) { server.close(); console.log(`❌ Smoke test can't start a browser. Run this once, then try again:\n   npx playwright install chromium\n(${String(error.message).split('\n')[0]})`); process.exit(1); }

/* The pretend server: the student's save is localStorage 'fake-save', and my_student returns it with saved_at. */
function fakeBackend(mode){
  window.__PET_TOWN_FAKE_BACKEND__ = mode === 'local' ? 'local' : { makeClient: () => ({
    auth: { getSession: async () => ({ data: { session: { user: { id: 'u1' } } } }), signInAnonymously: async () => ({}), signOut: async () => ({}) },
    rpc: async name => {
      if (name === 'my_student') {
        const saved = JSON.parse(localStorage.getItem('fake-save') || 'null');
        return { data: { student_id: 's1', name: 'Ava', class_id: 'c1', class_name: 'Smoke', min_station: 1, class_drills: null, student_drills: null, quiz_settings: {}, quiz_overrides: {},
          game_settings: {}, lesson_links: {}, question_edits: {}, state: saved, saved_at: saved && saved.savedAt ? new Date(saved.savedAt).toISOString() : null, reset_at: null } };
      }
      if (name === 'session_start') return { data: 1 };
      if (name === 'session_ping') return { data: true };
      return { data: null };
    },
    from: () => ({ upsert: async row => { localStorage.setItem('fake-save', JSON.stringify(row.state)); return {}; }, insert: async () => ({}), select: () => ({ eq: async () => ({ data: [] }) }) })
  }) };
}

const results = [];
async function scenario(name, { mode = 'hosted', server: serverSave = null, device = null }, check){
  const context = await browser.newContext(), page = await context.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(fakeBackend, mode);
  await page.addInitScript(([serverSave, device]) => {   // seed once per test, not on reloads
    if (sessionStorage.getItem('smoke-seeded')) return; sessionStorage.setItem('smoke-seeded', '1'); localStorage.clear();
    if (serverSave) localStorage.setItem('fake-save', JSON.stringify(serverSave));
    if (device) localStorage.setItem(device.key, JSON.stringify(device.state));
  }, [serverSave, device]);
  let problem = null;
  try { await page.goto(url); await page.waitForTimeout(2500); problem = await check(page); }
  catch (error) { problem = error.message.split('\n')[0]; }
  if (errors.length) problem = (problem ? problem + '; ' : '') + 'page error: ' + errors[0];
  results.push([name, problem]);
  await context.close();
}
const shown = (page, id) => page.evaluate(id => !document.getElementById(id)?.hidden, id);
const serverState = page => page.evaluate(() => JSON.parse(localStorage.getItem('fake-save') || 'null'));
const now = Date.now();

await scenario('Brand-new device, student already has a town on the server', { server: { v: 1, name: 'Ava', savedAt: now - 60000, coins: 42 } },
  async page => (await shown(page, 'scr-home')) ? null : 'the town did not open (stuck on loading?)');

await scenario('First sign-in ever (nothing on the server or the device)', {},
  async page => (await shown(page, 'scr-home')) ? null : 'the town did not open');

await scenario('Returning device: work on both copies is kept', {
  server: { v: 1, name: 'Ava', savedAt: now - 1000, scienceProjects: { bio1: { answers: {}, status: 'draft', submittedAt: 0 } },
    sessions: [{ start: now - 500000, end: now - 400000, active: 600 }] },
  device: { key: 'pettown:v1:s1', state: { v: 1, name: 'Ava', owner: 's1', client: 4, savedAt: now - 60000, scienceProjects: { bio1: { answers: { choice: 'Clay cell' }, status: 'draft', submittedAt: 0 } },
    sessions: [{ start: now - 900000, end: now - 800000, active: 300 }] } } },
  async page => {
    if (!(await shown(page, 'scr-home'))) return 'the town did not open';
    await page.waitForTimeout(2500);
    const s = await serverState(page);
    if (s?.scienceProjects?.bio1?.answers?.choice !== 'Clay cell') return 'the project draft from the device was lost';
    if ((s.sessions || []).length !== 2) return `expected 2 practice sessions on the server, found ${(s.sessions || []).length}`;
    return null;
  });

/* Oct 23 save guard (docs/CLEARING-PROGRESS.md): a copy written by code from before the guard (no client stamp) is never
   merged; that's how a demo student's work kept coming back. The town still opens, from the newer copy. */
await scenario('Returning device: an old copy without the save stamp is not merged', {
  server: { v: 1, name: 'Ava', savedAt: now - 1000, scienceProjects: { bio1: { answers: {}, status: 'draft', submittedAt: 0 } } },
  device: { key: 'pettown:v1:s1', state: { v: 1, name: 'Ava', savedAt: now - 60000, scienceProjects: { bio1: { answers: { choice: 'Clay cell' }, status: 'draft', submittedAt: 0 } } } } },
  async page => {
    if (!(await shown(page, 'scr-home'))) return 'the town did not open';
    await page.waitForTimeout(2500);
    const s = await serverState(page);
    if (s?.scienceProjects?.bio1?.answers?.choice) return 'the unstamped old copy was merged';
    if (s?.client !== 4 || s?.owner !== 's1') return 'the save on the server is missing its client or owner stamp';
    return null;
  });

await scenario('A town left open picks up work saved on another device', { server: { v: 1, name: 'Ava', savedAt: now - 60000 } },
  async page => {
    await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('fake-save')); s.savedAt = Date.now() + 1000; s.sessions = [{ start: Date.now() - 4000000, end: Date.now() - 400000, active: 3600 }]; localStorage.setItem('fake-save', JSON.stringify(s)); });
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await page.waitForTimeout(3500);
    const s = await serverState(page);
    return (s?.sessions || []).some(x => x.active === 3600) ? null : "the other device's hour of practice was lost";
  });

await scenario('Local mode, first visit: asks for a name, then opens the town', { mode: 'local' },
  async page => {
    if (!(await shown(page, 'scr-name'))) return 'the name screen did not show';
    await page.fill('#nameInput', 'Smoke'); await page.click('#nameSave'); await page.waitForTimeout(500);
    return (await shown(page, 'scr-home')) ? null : 'the town did not open after typing a name';
  });

await scenario('Local mode, returning visit', { mode: 'local', device: { key: 'pettown:v1', state: { v: 1, name: 'Smoke', savedAt: now - 60000 } } },
  async page => (await shown(page, 'scr-home')) ? null : 'the town did not open');

await browser.close(); server.close();
const failed = results.filter(([, problem]) => problem);
results.forEach(([name, problem]) => console.log(`${problem ? '❌' : '✅'} ${name}${problem ? `: ${problem}` : ''}`));
if (failed.length) { console.log(`\n❌ Smoke test failed (${failed.length} of ${results.length}). Don't deploy until it passes.`); process.exit(1); }
console.log(`\n✅ Smoke test passed (${results.length} sign-in situations).`);
