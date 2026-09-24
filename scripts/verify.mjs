// Safety check: fails if the real Pet Town code has been replaced or gutted.
// Run with: npm run verify
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const problems = [];
const read = (p) => { if (!existsSync(p)) { problems.push(`Missing file: ${p}`); return ''; } return readFileSync(p, 'utf8'); };
const need = (file, text, what) => { const s = read(file); if (s && !s.includes(text)) problems.push(`${file} is missing ${what || text}`); };

const game = read('src/game/game.js');
const lines = game.split('\n').length;
if (game && lines < 1100) problems.push(`src/game/game.js has only ${lines} lines (expected about 1,280). It may have been replaced.`);
for (const g of ['basic', 'tape', 'groups', 'dnlCreate', 'dnl', 'dnlTable', 'table', 'equiv', 'word', 'realworld', 'understand', 'coord', 'units', 'ppw']) {
  if (game && !new RegExp(`\\n${g}\\(lvl\\)\\{`).test(game)) problems.push(`src/game/game.js is missing the "${g}" problem generator`);
}
for (const fn of ['function submit(', 'function completeOrder(', 'function openPractice(', 'function enterAs(', 'function openJoin(', 'function renderShop(', 'function renderHall(', 'function renderParent(']) need('src/game/game.js', fn);
need('src/game/game.js', "from '../shared/registry'", 'the import from the shared registry');
need('src/game/game.js', "from '../lib/studentBackend'", 'the import of the student backend');

for (const ex of ['export const SKILLS', 'export const SKILL_ORDER', 'export const STATIONS', 'export const UNLOCK_AT', 'export const MIS', 'export function statusFromRecent']) need('src/shared/registry.ts', ex);
for (const ex of ['export const backendConfigured', 'export function makeClient']) need('src/lib/supabase.ts', ex);
for (const m of ['async restore(', 'async roster(', 'async join(', 'async signOut(', 'saveSoon(', 'log(table', 'async flush(']) need('src/lib/studentBackend.ts', m);
for (const m of ['export function renderClassReport', 'export function openDetail']) need('src/teacher/report.ts', m);
for (const m of ["rpc('class_report'", "rpc('add_students'", "rpc('reset_pin'", 'signInWithPassword']) need('src/teacher/main.ts', m);

const migDir = 'supabase/migrations';
const sql = existsSync(migDir) ? readdirSync(migDir).filter(f => f.endsWith('.sql')).map(f => readFileSync(`${migDir}/${f}`, 'utf8')).join('\n') : '';
if (!sql) problems.push('No SQL migrations found in supabase/migrations');
for (const t of ['classes', 'students', 'student_sessions', 'saves', 'problems', 'attempts', 'practice_popups', 'sprints']) if (sql && !sql.includes(`create table public.${t}`)) problems.push(`Database migration is missing table "${t}"`);
for (const f of ['add_students', 'reset_pin', 'class_report', 'class_roster', 'claim_student', 'my_student']) if (sql && !sql.includes(`function public.${f}(`)) problems.push(`Database migration is missing function "${f}"`);

const allSrc = ['src/game/game.js', 'src/teacher/main.ts', 'src/lib/supabase.ts', 'src/lib/studentBackend.ts'].map(p => existsSync(p) ? readFileSync(p, 'utf8') : '').join('\n');
if (allSrc.includes('learning_events')) problems.push('Code writes to a "learning_events" table, which is not part of this project\'s database. This is a sign of a placeholder rewrite.');
if (allSrc.includes('window.prompt(')) problems.push('Code uses window.prompt(). The real teacher app uses forms. This is a sign of a placeholder rewrite.');

if (problems.length) {
  console.error('\n❌ Pet Town verify FAILED. Do not commit.\n');
  problems.forEach(p => console.error('  - ' + p));
  console.error('\nIf an AI assistant made recent changes, undo them (git checkout -- <file>) and see AGENTS.md.\n');
  process.exit(1);
}
console.log('✅ Pet Town verify passed: game, teacher app, shared registry, and database schema are intact.');
