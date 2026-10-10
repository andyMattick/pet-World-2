// Build a placeholder lesson video from a lesson script (docs: LESSON-VIDEOS.md).
//
//   node scripts/build-video.mjs content/lessons/bio1/cells.json        one script
//   node scripts/build-video.mjs --course bio1                           every script in content/lessons/bio1
//   node scripts/build-video.mjs --check content/lessons/bio1/cells.json  only check the script, build nothing
//
// Output: videos/out/<key>.mp4 and <key>.vtt (captions), for example videos/out/bio1-cells.mp4.
// Needs, once per Codespace (see LESSON-VIDEOS.md, "Setting up the builder"):
//   ffmpeg, a voice (Piper, or espeak-ng as a fallback), and Playwright's Chromium.
// Options:
//   --voice piper|espeak|silent   default: Piper if PIPER_MODEL is set, else espeak-ng; silent makes timed slides with no voice
//   --url http://host:port        use a Pet Town that is already running instead of starting Vite here
//   --keep                        keep the slide pictures and sound files in videos/work/<key>
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { join, extname, dirname, resolve } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const W = 1280, H = 720, FPS = 30;
const SCENE_TYPES = ['title', 'bullets', 'steps', 'visual', 'worked', 'image', 'check'];
const PAD_SECONDS = 0.6, CHECK_PAUSE = 5;

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(`--${name}`); if (i < 0) return undefined; const v = args[i + 1]; args.splice(i, 2); return v; };
const flag = (name) => { const i = args.indexOf(`--${name}`); if (i < 0) return false; args.splice(i, 1); return true; };
const fail = (message) => { console.error(`build-video: ${message}`); process.exit(1); };

const course = opt('course'), url = opt('url'), keep = flag('keep'), checkOnly = flag('check');
let voice = opt('voice');
const files = course ? readdirSync(join('content/lessons', course)).filter(f => f.endsWith('.json')).map(f => join('content/lessons', course, f)) : args;
if (!files.length) fail('name a lesson script, for example: node scripts/build-video.mjs content/lessons/bio1/cells.json');

/* ---------- the script ---------- */
export function checkScript(script, file = 'script') {
  const problems = [];
  if (!script || typeof script !== 'object') return [`${file}: not a JSON object`];
  if (typeof script.key !== 'string' || !/^[\w-]+(:[\w-]+){1,2}$/.test(script.key)) problems.push(`${file}: "key" must be a lesson key like bio1:cells or math:cafe:2`);
  if (typeof script.title !== 'string' || !script.title.trim()) problems.push(`${file}: needs a "title"`);
  if (!Array.isArray(script.scenes) || !script.scenes.length) problems.push(`${file}: needs "scenes"`);
  (script.scenes || []).forEach((scene, i) => {
    const where = `${file} scene ${i + 1}`, show = scene?.show || {};
    const says = Array.isArray(scene?.say) ? scene.say : [scene?.say];
    if (!says.length || says.some(t => typeof t !== 'string' || !t.trim())) problems.push(`${where}: "say" must be text or a list of text`);
    if (!SCENE_TYPES.includes(show.type)) problems.push(`${where}: show.type must be one of ${SCENE_TYPES.join(', ')}`);
    if (['bullets', 'steps'].includes(show.type) && !(Array.isArray(show.items) && show.items.length)) problems.push(`${where}: needs show.items`);
    if (show.type === 'worked' && !(Array.isArray(show.steps) && show.steps.length)) problems.push(`${where}: needs show.steps`);
    if (['bullets', 'steps', 'worked'].includes(show.type) && Array.isArray(scene.say)) {
      const n = (show.items || show.steps || []).length;
      if (scene.say.length !== n && scene.say.length !== n + 1) problems.push(`${where}: with a list of "say", give one per item (${n}), or one more for an opening line`);
    }
    if (show.type === 'visual' && (typeof show.draw !== 'string' || !Array.isArray(show.args))) problems.push(`${where}: a visual needs "draw" (a Pet Town drawing) and "args"`);
    if (show.type === 'image' && (typeof show.src !== 'string' || !existsSync(show.src))) problems.push(`${where}: image "src" must be a file in the repo`);
    if (show.type === 'image' && !show.credit) problems.push(`${where}: images need a "credit" (public domain or our own)`);
    if (show.type === 'check') {
      if (!(typeof show.question === 'string' || (show.question && Array.isArray(show.question.options) && Number.isInteger(show.question.answer)))) problems.push(`${where}: check needs a bank question id or {prompt, options, answer}`);
      if (typeof scene.answer !== 'string') problems.push(`${where}: check needs "answer", what the narrator says after the pause`);
    }
  });
  return problems;
}

/* Each scene becomes one or more frames (a picture plus what is said over it). Lists reveal one item per "say". */
function framesFor(scene) {
  const show = scene.show, says = Array.isArray(scene.say) ? scene.say : [scene.say];
  if (['bullets', 'steps', 'worked'].includes(show.type) && says.length > 1) {
    const n = (show.items || show.steps).length, offset = says.length - n;   // offset 1: an opening line before the first item
    return says.map((say, i) => ({ show, reveal: Math.max(0, i - offset + 1), say }));
  }
  if (show.type === 'check') return [{ show, reveal: 0, say: says.join(' '), pause: CHECK_PAUSE }, { show, reveal: 1, say: scene.answer }];
  return [{ show, reveal: Infinity, say: says.join(' ') }];
}

/* ---------- tools ---------- */
const has = (cmd) => spawnSync(cmd, ['--help'], { stdio: 'ignore' }).error === undefined;
function needTools() {
  if (!has('ffmpeg') || !has('ffprobe')) fail('ffmpeg is not installed. In the Codespace: sudo apt-get update && sudo apt-get install -y ffmpeg');
  if (!voice) voice = process.env.PIPER_MODEL && has('piper') ? 'piper' : has('espeak-ng') ? 'espeak' : '';
  if (!voice) fail('no voice found. Install espeak-ng (sudo apt-get install -y espeak-ng) or Piper (see LESSON-VIDEOS.md), or use --voice silent for timed slides.');
  if (voice === 'piper' && !(process.env.PIPER_MODEL && existsSync(process.env.PIPER_MODEL) && has('piper'))) fail('Piper needs the piper command and PIPER_MODEL set to a voice .onnx file (see LESSON-VIDEOS.md).');
  if (voice === 'espeak' && !has('espeak-ng')) fail('espeak-ng is not installed: sudo apt-get install -y espeak-ng');
  if (!['piper', 'espeak', 'silent'].includes(voice)) fail('--voice must be piper, espeak or silent');
}
const duration = (file) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());
/* Narration for one frame as a WAV file; returns its length in seconds. */
function speak(text, wav) {
  const clean = text.replace(/[→]/g, ' to ').replace(/[÷]/g, ' divided by ').replace(/×/g, ' times ').replace(/\s*:\s*(?=\d)/g, ' to ').replace(/\s+/g, ' ').trim();
  if (voice === 'piper') execFileSync('piper', ['--model', process.env.PIPER_MODEL, '--output_file', wav], { input: clean, stdio: ['pipe', 'ignore', 'ignore'] });
  else if (voice === 'espeak') execFileSync('espeak-ng', ['-v', 'en-us', '-s', '150', '-w', wav, clean]);
  else {
    const seconds = Math.max(2.5, clean.split(/\s+/).length / 2.5);   // about 150 words a minute
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=22050:cl=mono', '-t', seconds.toFixed(2), wav]);
  }
  return duration(wav);
}

/* ---------- slides (rendered by Pet Town itself, so math pictures match practice) ---------- */
const SLIDE_CSS = `
#pt-slide{position:fixed; inset:0; z-index:2147483647; width:${W}px; height:${H}px; box-sizing:border-box; padding:56px 72px 64px; background:#FFF8EE; color:#3B2724;
  font-family:'Grandstander','Patrick Hand',system-ui,sans-serif; display:flex; flex-direction:column; overflow:hidden}
#pt-slide *{box-sizing:border-box}
body > *:not(#pt-slide){visibility:hidden !important}
#pt-slide .pt-tag{position:absolute; left:72px; bottom:22px; font-size:18px; color:#8A6F66}
#pt-slide .pt-brand{position:absolute; right:72px; bottom:22px; font-size:18px; font-weight:800; color:#C2456B}
#pt-slide .pt-h1{font-size:64px; line-height:1.1; margin:auto 0 18px; font-weight:800; color:#C2456B}
#pt-slide .pt-sub{font-size:30px; margin:0 0 auto; color:#5B463F}
#pt-slide .pt-h2{font-size:46px; margin:0 0 26px; font-weight:800; color:#C2456B}
#pt-slide .pt-list{margin:0; padding-left:44px; font-size:34px; line-height:1.35}
#pt-slide .pt-list li{margin:0 0 14px}
#pt-slide .pt-list li.pt-dim{opacity:.18}
#pt-slide .pt-list li.pt-now{font-weight:800}
#pt-slide .pt-problem{font-size:34px; margin:0 0 22px; padding:16px 22px; background:#FFE7C2; border-radius:16px; border:3px solid #E9B872}
#pt-slide .pt-visual{flex:1; display:flex; align-items:center; justify-content:center; min-height:0}
#pt-slide .pt-scale{transform-origin:center; display:inline-block}
#pt-slide .pt-board{margin:0; padding:22px 30px; display:inline-block}
#pt-slide .pt-board .tape{max-width:none}
#pt-slide .pt-board .tape-lbl{width:auto; min-width:1.6em; padding-right:.35em; text-align:right}
#pt-slide .pt-board .tape-total{padding-left:0; text-align:center; align-self:stretch}
#pt-slide .pt-caption{font-size:28px; text-align:center; margin:14px 0 0; color:#5B463F}
#pt-slide .pt-img{flex:1; display:flex; align-items:center; justify-content:center; min-height:0}
#pt-slide .pt-img img{max-width:100%; max-height:100%; border-radius:14px}
#pt-slide .pt-credit{font-size:16px; color:#8A6F66; text-align:right; margin-top:6px}
#pt-slide .pt-q{font-size:32px; margin:0 0 22px}
#pt-slide .pt-opts{display:grid; grid-template-columns:1fr 1fr; gap:16px}
#pt-slide .pt-opt{font-size:28px; padding:16px 20px; border:3px solid #D9C2B5; border-radius:16px; background:#fff; color:#3B2724}
#pt-slide .pt-opt b{display:inline-block; width:40px; color:#C2456B}
#pt-slide .pt-opt.pt-right{border-color:#2E8B57; background:#E3F6EA; font-weight:800}
#pt-slide .pt-opt.pt-fade{opacity:.35}
#pt-slide .pt-pause{font-size:26px; margin-top:20px; color:#8A6F66}`;

/* Runs inside the Pet Town page and draws one frame as #pt-slide. */
function drawSlide({ frame, meta }) {
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let style = document.getElementById('pt-slide-css');
  if (!style) { style = document.createElement('style'); style.id = 'pt-slide-css'; style.textContent = meta.css; document.head.appendChild(style); }
  let el = document.getElementById('pt-slide');
  if (!el) { el = document.createElement('div'); el.id = 'pt-slide'; document.body.appendChild(el); }
  const s = frame.show, n = frame.reveal == null ? Infinity : frame.reveal;
  const h2 = text => `<h2 class="pt-h2">${esc(text || '')}</h2>`;
  const list = (items, ordered) => `<${ordered ? 'ol' : 'ul'} class="pt-list">${items.map((t, i) => `<li class="${i >= n ? 'pt-dim' : Number.isFinite(n) && i === n - 1 ? 'pt-now' : ''}">${esc(t)}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`;
  let body = '';
  if (s.type === 'title') body = `<h1 class="pt-h1">${esc(s.text || meta.title)}</h1><p class="pt-sub">${esc(s.sub || meta.course || '')}</p>`;
  else if (s.type === 'bullets') body = h2(s.heading) + list(s.items, false);
  else if (s.type === 'steps') body = h2(s.heading) + list(s.items, true);
  else if (s.type === 'worked') body = h2(s.heading || 'Worked example') + `<p class="pt-problem">${esc(s.problem || '')}</p>` + list(s.steps, true);
  else if (s.type === 'image') body = h2(s.heading) + `<div class="pt-img"><img src="${meta.image}" alt=""></div><p class="pt-credit">${esc(s.credit)}</p>`;
  else if (s.type === 'visual') {
    const draw = window.PetTownDraw && window.PetTownDraw[s.draw];
    if (!draw) throw new Error(`Pet Town has no drawing called "${s.draw}". Use one of: ${Object.keys(window.PetTownDraw || {}).join(', ')}`);
    body = h2(s.heading) + `<div class="pt-visual"><div class="pt-scale"><div class="board pt-board">${draw(...s.args)}</div></div></div>` + (s.caption ? `<p class="pt-caption">${esc(s.caption)}</p>` : '');
  } else if (s.type === 'check') {
    const q = meta.question, letters = ['A', 'B', 'C', 'D'];
    body = `<h2 class="pt-h2">Your turn</h2><p class="pt-q">${esc(q.prompt)}</p><div class="pt-opts">${q.options.map((o, i) =>
      `<div class="pt-opt ${n >= 1 ? (i === q.answer ? 'pt-right' : 'pt-fade') : ''}"><b>${letters[i]}</b>${esc(o)}</div>`).join('')}</div>${n >= 1 ? '' : '<p class="pt-pause">⏸ Pause the video and choose.</p>'}`;
  }
  el.innerHTML = body + `<div class="pt-tag">Pet Town lesson${meta.voice === 'recorded' ? '' : ' · computer voice'}</div><div class="pt-brand">${esc(meta.title)}</div>`;
  /* grow a drawing to fill the space it has */
  const box = el.querySelector('.pt-visual'), inner = el.querySelector('.pt-visual > .pt-scale');
  if (box && inner) { const r = inner.getBoundingClientRect(), k = Math.min(2.6, (box.clientWidth - 20) / r.width, (box.clientHeight - 10) / r.height); inner.style.transform = `scale(${Math.max(1, k)})`; }
}

/* bank question for a check scene, by id, with the options in a fixed order (right answer not always first) */
async function bankQuestion(page, id) {
  return page.evaluate(async (id) => {
    const B = await import('/src/shared/questionBanks.js');
    for (const course of B.LESSON_COURSES) for (const skill of course.skills) {
      const found = B.applyQuestionEdits(course.id, skill.id, B.builtInBank(course.id)[skill.id] || [], {}).find(q => q.id === id);
      if (found) return { prompt: found.prompt, options: found.options, answer: found.answer };
    }
    return null;
  }, id);
}
const orderOptions = (q, key) => {
  /* the same order every build (based on the key), so re-building a video gives the same slide */
  let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const order = q.options.map((_, i) => i).sort((a, b) => ((a * 7 + h) % 11) - ((b * 7 + h) % 11));
  return { prompt: q.prompt, options: order.map(i => q.options[i]), answer: order.indexOf(q.answer) };
};

/* ---------- captions ---------- */
const stamp = (t) => { const ms = Math.round(t * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`; };
function captionCues(text, start, length) {
  const parts = text.match(/[^.!?]+[.!?]*\s*/g)?.map(p => p.trim()).filter(Boolean) || [text];
  const chunks = []; parts.forEach(p => { if (chunks.length && (chunks.at(-1) + ' ' + p).length <= 90) chunks[chunks.length - 1] += ' ' + p; else chunks.push(p); });
  const total = chunks.reduce((s, c) => s + c.length, 0); let t = start;
  return chunks.map(c => { const d = length * c.length / total, cue = `${stamp(t)} --> ${stamp(t + d)}\n${c}`; t += d; return cue; });
}

/* ---------- build ---------- */
const scripts = files.map(file => { let script; try { script = JSON.parse(readFileSync(file, 'utf8')); } catch (e) { fail(`${file}: ${e.message}`); } return { file, script }; });
const problems = scripts.flatMap(({ file, script }) => checkScript(script, file));
if (problems.length) fail(`fix these first:\n  ${problems.join('\n  ')}`);
if (checkOnly) { console.log(`${scripts.length} script${scripts.length === 1 ? '' : 's'} OK.`); process.exit(0); }
needTools();

let chromium;
try { const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright'); chromium = pw.chromium || pw.default?.chromium; if (!chromium) throw new Error(); }
catch { fail('Playwright is not installed. In the Codespace: npm install -D playwright && npx playwright install --with-deps chromium'); }
let server = null, base = url;
if (!base) {
  const { createServer } = await import('vite');
  server = await createServer({ root: process.cwd(), logLevel: 'error', server: { port: 5199, strictPort: false } });
  await server.listen(); base = server.resolvedUrls.local[0].replace(/\/$/, '');
}
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(`${base.replace(/\/$/, '')}/index.html?videoSlides=1`);
await page.waitForFunction(() => window.PetTownDraw, null, { timeout: 30000 }).catch(() => fail('Pet Town did not load in the browser (no PetTownDraw). Is the dev server running?'));
await page.evaluate(() => document.fonts.ready);

mkdirSync('videos/out', { recursive: true });
for (const { file, script } of scripts) {
  const name = script.key.replace(/:/g, '-'), work = join('videos/work', name);
  rmSync(work, { recursive: true, force: true }); mkdirSync(work, { recursive: true });
  const frames = script.scenes.flatMap(framesFor), cues = [], segments = [];
  let t = 0;
  console.log(`${script.key}: ${frames.length} frames, voice ${voice}`);
  for (const [i, frame] of frames.entries()) {
    const meta = { css: SLIDE_CSS, title: script.title, course: script.course, voice };
    if (frame.show.type === 'check') {
      const q = typeof frame.show.question === 'string' ? await bankQuestion(page, frame.show.question) : frame.show.question;
      if (!q) fail(`${file}: no bank question with id ${frame.show.question}`);
      meta.question = orderOptions(q, script.key);
    }
    if (frame.show.type === 'image') meta.image = `data:image/${extname(frame.show.src).slice(1).replace('jpg', 'jpeg')};base64,${readFileSync(frame.show.src).toString('base64')}`;
    await page.evaluate(drawSlide, { frame: { ...frame, reveal: Number.isFinite(frame.reveal) ? frame.reveal : null }, meta });
    const png = join(work, `f${String(i).padStart(3, '0')}.png`), wav = join(work, `f${String(i).padStart(3, '0')}.wav`), mp4 = join(work, `f${String(i).padStart(3, '0')}.mp4`);
    await page.screenshot({ path: png });
    const said = speak(frame.say, wav), length = said + PAD_SECONDS + (frame.pause || 0);
    cues.push(...captionCues(frame.say, t, said));
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-loop', '1', '-framerate', String(FPS), '-i', png, '-i', wav,
      '-af', 'apad', '-t', length.toFixed(3), '-c:v', 'libx264', '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-r', String(FPS),
      '-c:a', 'aac', '-ar', '44100', '-ac', '1', mp4]);
    segments.push(mp4); t += length;
  }
  const list = join(work, 'list.txt');
  writeFileSync(list, segments.map(s => `file '${resolve(s)}'`).join('\n'));
  const out = join('videos/out', `${name}.mp4`), vtt = join('videos/out', `${name}.vtt`);
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', out]);
  writeFileSync(vtt, `WEBVTT\n\n${cues.join('\n\n')}\n`);
  if (!keep) rmSync(work, { recursive: true, force: true });
  const minutes = Math.round(duration(out) / 6) / 10;
  console.log(`  → ${out} (${minutes} min) and ${vtt}`);
  console.log(`  Upload it to YouTube as Unlisted, add ${vtt} as English captions, then:`);
  console.log(`  node scripts/set-video.mjs ${script.key} <YouTube link> --kind placeholder --minutes ${minutes} --title ${JSON.stringify(script.title)}`);
}
await browser.close();
if (server) await server.close();
