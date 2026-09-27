// Safety check: fails if the real Pet Town code has been replaced or gutted.
// Run with: npm run verify
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const problems = [];
const read = (p) => { if (!existsSync(p)) { problems.push(`Missing file: ${p}`); return ''; } return readFileSync(p, 'utf8'); };
const need = (file, text, what) => { const s = read(file); if (s && !s.includes(text)) problems.push(`${file} is missing ${what || text}`); };

const game = read('src/game/game.js');
const lines = game.split('\n').length;
if (game && lines < 1100) problems.push(`src/game/game.js has only ${lines} lines (expected about 1,850). It may have been replaced.`);
for (const g of ['basic', 'tape', 'groups', 'dnlCreate', 'dnl', 'dnlTable', 'table', 'equiv', 'word', 'realworld', 'understand', 'coord', 'units', 'ppw']) {
  if (game && !new RegExp(`\\n${g}\\(lvl\\)\\{`).test(game)) problems.push(`src/game/game.js is missing the "${g}" problem generator`);
}
for (const fn of ['function submit(', 'function completeOrder(', 'function openPractice(', 'function openJoin(', 'function buyReward(', 'function renderHall(', 'function renderParent(']) need('src/game/game.js', fn);
need('src/teacher/main.ts', 'reset_student', 'the student reset RPC');
need('src/teacher/main.ts', 'pin_plain', 'teacher-readable PIN support');
need('src/game/game.js', 'reset_at', 'teacher reset metadata support');
need('src/game/game.js', 'function renderBook(', 'the Sticker Book renderer');
need('src/game/game.js', 'function rewardTileHTML(', 'the shared reward tile renderer');
need('src/game/game.js', 'function tableDown(', 'the scale-down table generator');
need('src/game/game.js', 'function simplestStep(', 'the simplest-form step helper');
need('src/game/game.js', 'function simplestChoice(', 'the simplest-form choice helper');
need('src/game/game.js', 'function renderShopFloor(', 'the shared shop floor renderer');
need('src/game/game.js', 'function shopProgress(', 'per-shop progress');
need('src/game/game.js', 'shift.shop', 'the current shop on each shift');
if (game.includes('plazaDecor')) problems.push('src/game/game.js still uses the old #plazaDecor emoji list');
need('src/shared/registry.ts', 'export const DRILLS', 'the drill registry');
need('src/shared/registry.ts', 'export function drillLabel', 'the drill label helper');
need('src/shared/registry.ts', 'export function mergeDrillSettings', 'the drill settings merger');
need('src/game/game.js', 'function shouldDrill(', 'the drill settings gate');
need('src/game/game.js', 'function slowLimit(', 'the adaptive slow limit');
need('src/game/game.js', 'function sprintAnswer(', 'the Sprint answer handler');
need('src/game/game.js', 'sprintItem(', 'Sprint drill question generation');
need('src/game/game.js', 'class="ticket"', 'the café order ticket');
need('src/game/game.js', 'id="plan"', 'the café order plan');
need('src/game/game.js', 'speechSynthesis', 'the read-aloud support');
need('src/game/game.js', 'pointer: coarse', 'touch-device number pad support');
need('src/game/game.js', 'function numberPad(', 'the reusable number pad');
need('src/game/game.js', "from '../shared/registry'", 'the import from the shared registry');
need('src/game/game.js', "from '../lib/studentBackend'", 'the import of the student backend');
need('src/game/game.js', 'function assessmentPlan(', 'the quiz/test question planner');
need('src/game/game.js', 'function gradeAssessment(', 'the quiz/test grader');
need('src/game/game.js', 'function startAssessment(', 'the quiz/test starter');
need('src/game/game.js', 'function answerStepsFor(', 'the quiz/test answer-step helper');
need('src/game/game.js', 'shift.mode', 'quiz/test shift mode');
need('src/game/game.js', 'const SCALE_GEN', 'the Scale generators');
need('src/game/game.js', 'const DEC = {', 'the exact decimal math helpers');
need('src/game/game.js', 'function placeValueRows(', 'the place-value drill rows');
need('src/shared/registry.ts', 'addDec:', 'the addDec skill');
need('src/shared/registry.ts', 'rightAlign:', 'the rightAlign mix-up');
need('src/game/game.js', 'const FRAC = {', 'the exact fraction math helpers');
need('src/game/game.js', "st.kind === 'frac'", 'the fraction answer boxes');
need('src/game/game.js', 'function nextStepIndex(', 'skipping a step that is already done');
need('src/game/game.js', 'const PANS_GEN', 'the Sharing Pans generators');
need('src/shared/registry.ts', 'fracDivWhole:', 'the fracDivWhole skill');
need('src/shared/registry.ts', 'reversedDivision:', 'the reversedDivision mix-up');
need('src/shared/registry.ts', 'notMixed:', 'the notMixed mix-up');
need('src/game/game.js', '  simplify:{', 'the simplify practice pop-up');
need('src/game/game.js', '  mixed:{', 'the mixed-number practice pop-up');
need('src/game/game.js', 'const REGISTER_GEN', 'the Register generators');
need('src/game/game.js', 'Object.assign(GEN, REGISTER_GEN)', 'the Register generators merged into GEN');
need('src/game/game.js', 'function mulRowsHTML(', 'the multiplication rows layout');
need('src/game/game.js', 'function ldivHTML(', 'the long-division layout');
need('src/game/game.js', "st.kind === 'qr'", 'the quotient and remainder answer boxes');
need('src/game/game.js', '  decimalShift:{', 'the moving-the-decimal practice pop-up');
need('src/shared/registry.ts', 'mulDec:', 'the mulDec skill');
need('src/shared/registry.ts', 'missingZero:', 'the missingZero mix-up');
need('src/shared/registry.ts', 'mixed:        {', 'the mixed-number drill type');
need('src/game/game.js', 'const BOXES_GEN', 'the Boxing Treats generators');
need('src/game/game.js', '  reciprocal:{', 'the reciprocal practice pop-up');
need('src/shared/registry.ts', 'fracDiv:', 'the fracDiv skill');
need('src/shared/registry.ts', 'flipWrong:', 'the flipWrong mix-up');
need('src/game/game.js', '  lineUp:{', 'the lining-up practice pop-up');
need('src/game/game.js', '  story:{', 'the word-problem practice pop-up');
need('src/game/game.js', 'function ladderRight(', 'tap-to-answer rows in practice pop-ups');
need('src/shared/registry.ts', 'story:        {', 'the word-problem drill type');
need('src/game/game.js', 'function digitBoxesHTML(', 'the answer boxes under lined-up decimals');
need('src/game/game.js', "input.setAttribute('inputmode', 'none')", 'typing on a real keyboard with the number pad showing');
need('src/game/game.js', 'unitTestPassed(BUILDINGS[i - 1].id)', 'shops opening only after the unit test of the shop before');
const decSteps = game.match(/function decSteps\([\s\S]*?\n}/)?.[0] || '';
if (decSteps && /lvl === 1 \|\|/.test(decSteps)) problems.push('src/game/game.js: decSteps still shows the line-up step at level 1 regardless of decimal places');

for (const ex of ['export const SKILLS', 'export const SKILL_ORDER', 'export const STATIONS', 'export const UNLOCK_AT', 'export const MIS', 'export function statusFromRecent']) need('src/shared/registry.ts', ex);
for (const ex of ['export interface QuizSettings', 'export const QUIZ_DEFAULTS', 'export function quizSettings']) need('src/shared/registry.ts', ex);
need('src/shared/registry.ts', 'export const REWARDS', 'the reward registry');
need('src/shared/registry.ts', 'notSimplest:', 'the simplest-form misconception');
need('src/shared/registry.ts', 'export const SHOPS', 'the shop registry');
need('src/shared/registry.ts', 'export const BAKERY_STATIONS', 'the Bakery station registry');
need('src/shared/registry.ts', 'export const shopOfSkill', 'the skill-to-shop lookup');
const rewardRegistry = read('src/shared/registry.ts');
const cafeRewards = rewardRegistry.match(/const cafeRewards[\s\S]*?\n\];/)?.[0] || '';
const unitSets = rewardRegistry.match(/const UNIT_SETS[\s\S]*?\n\];/)?.[0] || '';
if (rewardRegistry && ((cafeRewards.match(/\{ id:/g) || []).length !== 16 || (unitSets.match(/^  \['/gm) || []).length !== 7)) problems.push('src/shared/registry.ts should define REWARDS.length === 86');
if (rewardRegistry && !rewardRegistry.includes('export const BUILDINGS')) problems.push('src/shared/registry.ts is missing the shared buildings registry');
for (const ex of ['export const backendConfigured', 'export function makeClient']) need('src/lib/supabase.ts', ex);
for (const m of ['async restore(', 'async roster(', 'async join(', 'async signOut(', 'saveSoon(', 'log(table', 'async flush(']) need('src/lib/studentBackend.ts', m);
for (const m of ['export function renderClassReport', 'export function openDetail']) need('src/teacher/report.ts', m);
for (const m of ["rpc('class_report'", "rpc('add_students'", "rpc('reset_pin'", 'signInWithPassword']) need('src/teacher/main.ts', m);

const migDir = 'supabase/migrations';
const sql = existsSync(migDir) ? readdirSync(migDir).filter(f => f.endsWith('.sql')).map(f => readFileSync(`${migDir}/${f}`, 'utf8')).join('\n') : '';
if (!sql) problems.push('No SQL migrations found in supabase/migrations');
if (sql && !sql.includes('drill_type')) problems.push('Database migration is missing drill_type');
if (sql && !sql.includes('drill_settings')) problems.push('Database migration is missing drill_settings');
for (const t of ['classes', 'students', 'student_sessions', 'saves', 'problems', 'attempts', 'practice_popups', 'sprints']) if (sql && !sql.includes(`create table public.${t}`)) problems.push(`Database migration is missing table "${t}"`);
for (const f of ['add_students', 'reset_pin', 'class_report', 'class_roster', 'claim_student', 'my_student']) if (sql && !sql.includes(`function public.${f}(`)) problems.push(`Database migration is missing function "${f}"`);
if (sql && !sql.includes('function public.reset_student(')) problems.push('Database migration is missing function "reset_student"');
if (sql && !sql.includes('create table if not exists public.assessments')) problems.push('Database migration is missing table "assessments"');
if (sql && !sql.includes('create table if not exists public.practice_sessions')) problems.push('Database migration is missing table "practice_sessions"');
for (const m of ["'session_start'", "'session_ping'", 'export class ActivityTracker', 'async startSession(']) need('src/lib/studentBackend.ts', m);
need('src/game/game.js', 'townTracker', 'practice time kept in the town');
need('src/teacher/report.ts', 'r.ss?.', 'practice time on the dashboard');
need('src/teacher/main.ts', 'p_tz', "the teacher's time zone for practice time");
for (const m of ['const TRACKS = {', 'musicTrack', 'function openMusicMenu(', 'function musicAllowed(']) need('src/game/game.js', m);
need('src/teacher/main.ts', 'allowMusic', 'the teacher Allow music switch');

const allSrc = ['src/game/game.js', 'src/teacher/main.ts', 'src/lib/supabase.ts', 'src/lib/studentBackend.ts'].map(p => existsSync(p) ? readFileSync(p, 'utf8') : '').join('\n');
if (allSrc.includes('learning_events')) problems.push('Code writes to a "learning_events" table, which is not part of this project\'s database. This is a sign of a placeholder rewrite.');
if (allSrc.includes('window.prompt(')) problems.push('Code uses window.prompt(). The real teacher app uses forms. This is a sign of a placeholder rewrite.');
for (const file of ['docs/AGENTS.md', 'docs/CLAUDE.md']) if (existsSync(file)) problems.push(`${file} is a stray copy of repository instructions and must not exist.`);

if (problems.length) {
  console.error('\n❌ Pet Town verify FAILED. Do not commit.\n');
  problems.forEach(p => console.error('  - ' + p));
  console.error('\nIf an AI assistant made recent changes, undo them (git checkout -- <file>) and see AGENTS.md.\n');
  process.exit(1);
}
console.log('✅ Pet Town verify passed: game, teacher app, shared registry, and database schema are intact.');
