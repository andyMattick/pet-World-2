// Add, change or remove one lesson video in src/shared/lessonVideos.js (docs: LESSON-VIDEOS.md).
//
//   node scripts/set-video.mjs <key> <YouTube link or id> [--kind placeholder|recorded] [--minutes 4.5] [--title "Cells"]
//   node scripts/set-video.mjs <key> --remove
//   node scripts/set-video.mjs --list
//
// Keys: "<courseId>:<groupId>" or "<courseId>:<groupId>:<n>" (English, History, Biology: the same keys as teacher
// lesson links), "math:<shopId>:<stationId>" or "math:<skillId>". Only the lines between VIDEO LIST START and
// VIDEO LIST END are rewritten; run it again with the same key to update an entry (a recording replacing a placeholder).
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const FILE = 'src/shared/lessonVideos.js';
const fail = (message) => { console.error(`set-video: ${message}`); process.exit(1); };
const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(`--${name}`); if (i < 0) return undefined; const v = args[i + 1]; args.splice(i, 2); return v; };
const has = (name) => { const i = args.indexOf(`--${name}`); if (i < 0) return false; args.splice(i, 1); return true; };

const mod = await import(pathToFileURL(FILE).href + `?t=${Date.now()}`);
const list = JSON.parse(JSON.stringify(mod.LESSON_VIDEOS));

if (has('list')) {
  const keys = Object.keys(list).sort();
  if (!keys.length) console.log('No lesson videos yet.');
  for (const key of keys) { const v = mod.lessonVideo(key, list); console.log(`${key.padEnd(28)} ${v ? `${v.kind.padEnd(11)} ${v.youtube}  ${v.minutes ?? '?'} min  ${v.title}` : 'NOT USABLE (check the id)'}`); }
  process.exit(0);
}

const kind = flag('kind'), minutes = flag('minutes'), title = flag('title'), remove = has('remove');
const [key, link] = args;
if (!key) fail('give a lesson key, for example: node scripts/set-video.mjs bio1:cells https://youtu.be/<id> --kind placeholder');

/* the key must name a real lesson (read from the source text; these files import TypeScript, so node can't load them) */
const banks = readFileSync('src/shared/questionBanks.js', 'utf8');
const courseIds = new Set([...banks.slice(banks.indexOf('export const LESSON_COURSES')).matchAll(/\{id:'(\w+)', title:/g)].map(m => m[1]));
const groupIds = new Set([...banks.matchAll(/\{\s*id:\s*'([\w-]+)',\s*name:/g)].map(m => m[1]));
const registry = readFileSync('src/shared/registry.ts', 'utf8');
const shopIds = new Set([...registry.matchAll(/^\s{2}(\w+):\s*\{\s*id:\s*'(\w+)',\s*name:/gm)].map(m => m[2]));
const skillsStart = registry.indexOf('export const SKILLS'), skillsBlock = registry.slice(skillsStart, registry.indexOf('\n};', skillsStart));
const skillIds = new Set([...skillsBlock.matchAll(/^\s{2}(\w+):\s*\{/gm)].map(m => m[1]));
const lesson = key.match(/^(\w+):([\w-]+)(?::(\d{1,2}))?$/), math = key.match(/^math:(\w+)(?::(\d{1,2}))?$/);
const known = math ? (math[2] ? shopIds.has(math[1]) : skillIds.has(math[1])) : !!lesson && courseIds.has(lesson[1]) && groupIds.has(lesson[2]);
if (!known && !remove) fail(`"${key}" is not a lesson Pet Town knows. Use a key like bio1:cells, history2:tools:1, math:cafe:2 or math:<skillId>.`);

if (remove) {
  if (!list[key]) fail(`${key} has no video to remove.`);
  delete list[key];
} else {
  const id = mod.youtubeId(link);
  if (!id) fail('give the YouTube link or 11-character video id (for example https://youtu.be/abcDEF12345).');
  if (kind && !mod.VIDEO_KINDS.includes(kind)) fail(`--kind must be ${mod.VIDEO_KINDS.join(' or ')}.`);
  if (minutes !== undefined && !(Number(minutes) > 0)) fail('--minutes must be a number above 0, like 4.5.');
  const old = list[key] || {};
  list[key] = {
    title: title || old.title || 'Watch the lesson',
    video: { youtube: id, kind: kind || old.video?.kind || 'placeholder', minutes: minutes !== undefined ? Number(minutes) : old.video?.minutes ?? null, updated: new Date().toISOString().slice(0, 10) }
  };
  if (!mod.lessonVideo(key, list)) fail('that entry would not be usable.');
}

const sorted = Object.fromEntries(Object.keys(list).sort().map(k => [k, list[k]]));
const body = Object.keys(sorted).length
  ? `export const LESSON_VIDEOS = {\n${Object.entries(sorted).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n')}\n};`
  : 'export const LESSON_VIDEOS = {};';
const source = readFileSync(FILE, 'utf8');
const start = source.indexOf('/* VIDEO LIST START */'), end = source.indexOf('/* VIDEO LIST END */');
if (start < 0 || end < start) fail(`could not find the VIDEO LIST lines in ${FILE}; nothing was changed.`);
writeFileSync(FILE, `${source.slice(0, start)}/* VIDEO LIST START */\n${body}\n${source.slice(end)}`);
console.log(remove ? `Removed the video for ${key}.` : `Saved ${key}: ${list[key].video.kind}, https://youtu.be/${list[key].video.youtube}${list[key].video.minutes ? `, ${list[key].video.minutes} min` : ''}.`);
console.log('Next: npm run verify && npm run build, then commit src/shared/lessonVideos.js.');
