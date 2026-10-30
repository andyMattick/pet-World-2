// Safety check: fails if the real Pet World code has been replaced or gutted.
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
need('src/game/game.js', 'function buildReadingQuiz(', 'the reading quiz builder');
need('src/game/game.js', 'const readingChapterState = ', 'the grown-up check for reading notes');
need('src/teacher/report.ts', 'function readingReviewHTML(', 'the teacher reading review card');
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
need('src/game/game.js', "from '../shared/questionTypes'", 'the newer question types (docs: QUESTION-TYPES.md)');
need('src/game/game.js', 'function renderWrittenStep(', 'the written answer step');
need('src/teacher/report.ts', 'function writtenCardHTML(', 'the teacher\'s written answer review');
need('src/teacher/ledger.ts', 'export function renderLedger(', 'the teacher Ledger tab (docs/LEDGER.md step 4)');
need('src/teacher/courses.ts', 'export function computeCourses(', 'courses and grades (docs/LEDGER.md step 6)');
need('src/teacher/plan.ts', 'export function renderPlanCard(', 'the daily plan editor (ROADMAP F10)');
need('src/teacher/approvals.ts', 'export async function renderApprovals(', 'the Approvals page (ROADMAP F4)');
need('supabase/migrations/20261019000000_approvals.sql', 'admin_set_approval', 'the approvals migration (ROADMAP F4)');
need('src/game/game.js', 'function planCardHTML(', 'the daily plan on the town page (ROADMAP F10)');
need('src/game/game.js', 'function renderArtStudio(', 'the Art Studio (ROADMAP F13)');
need('index.html', 'scr-artstudio', 'the Art Studio screen');
need('src/game/game.js', 'function renderDig(', 'the History Dig Sites (ROADMAP F12)');
need('src/game/game.js', 'function renderScribe(', 'Scribe School (ROADMAP F12)');
need('src/game/historyData.js', 'export const DIG_SITES', 'the Dig Site finds (ROADMAP F12)');
need('src/teacher/transcript.ts', 'export function renderTranscript(', 'the printable transcript (docs/LEDGER.md step 7)');
need('src/shared/typedQuestions.js', 'export const UNIT_ESSAYS', 'the unit test paragraphs');
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
need('src/game/game.js', 'const BULK_GEN', 'the Bulk Orders generators');
need('src/game/game.js', 'Object.assign(GEN, BULK_GEN)', 'the Bulk Orders generators merged into GEN');
need('src/game/game.js', 'function longDivisionDec(', 'long division with a decimal point');
need('src/shared/registry.ts', 'divDec3:', 'the divDec3 skill');
need('src/shared/registry.ts', 'remainderNotDecimal:', 'the remainderNotDecimal mix-up');
need('src/shared/registry.ts', 'export const NEIGHBORHOODS', 'the neighborhoods list');
need('src/shared/registry.ts', "export const DEFAULT_HOME = 'g6'", 'the 6th grade default home (every older save is 6th grade)');
{ const reg = read('src/shared/registry.ts'); for (const shop of ['cafe', 'bakery']) if (reg && !new RegExp(`id:'${shop}'[^\\n]*hood:'g6'`).test(reg)) problems.push(`src/shared/registry.ts: the ${shop} must stay in the 6th grade neighborhood (hood:'g6')`); }
need('src/game/game.js', 'home:DEFAULT_HOME', 'the home grade in a fresh save');
need('src/game/game.js', 'if (!validHood(s.home)) s.home = DEFAULT_HOME;', 'older saves defaulting to 6th grade');
need('src/game/game.js', 'function hoodSwitchHTML(', 'the neighborhood switcher');
need('src/game/game.js', 'const LEMON_GEN', 'the Lemonade Stand generators');
need('src/game/game.js', 'Object.assign(GEN, LEMON_GEN)', 'the Lemonade Stand generators merged into GEN');
need('src/shared/registry.ts', 'export const LEMON_STATIONS', 'the Lemonade Stand stations');
need('src/shared/registry.ts', 'factorPairs:', 'the factorPairs skill');
need('src/shared/registry.ts', 'primeMixup:', 'the primeMixup mix-up');
need('src/game/game.js', 'const TOYS_GEN', 'the Toy Shop generators');
need('src/game/game.js', 'Object.assign(GEN, TOYS_GEN)', 'the Toy Shop generators merged into GEN');
need('src/shared/registry.ts', 'export const TOY_STATIONS', 'the Toy Shop stations');
need('src/game/game.js', 'const TOYS2_GEN', 'the Toy Shop multiplying and dividing generators');
need('src/game/game.js', 'Object.assign(GEN, TOYS2_GEN)', 'the Toy Shop multiplying and dividing generators merged into GEN');
need('src/game/game.js', 'function areaHTML(', 'the area model picture');
need('src/game/game.js', '  factors:{', 'the factor-pair practice pop-up');
need('src/game/game.js', '  rounding:{', 'the rounding practice pop-up');
need('src/game/game.js', 'const PIZZA_GEN', 'the Pizza Parlor generators');
need('src/game/game.js', 'Object.assign(GEN, PIZZA_GEN)', 'the Pizza Parlor generators merged into GEN');
need('src/game/game.js', 'const PIZZA2_GEN', 'the Pizza Parlor stations 4 and 5 generators');
need('src/game/game.js', 'Object.assign(GEN, PIZZA2_GEN)', 'the Pizza Parlor stations 4 and 5 generators merged into GEN');
need('src/game/game.js', 'function hundredGridSVG', 'the hundred grid picture');
need('src/game/game.js', 'const GARDEN_GEN', 'the Garden Center generators');
need('src/game/game.js', 'Object.assign(GEN, GARDEN_GEN)', 'the Garden Center generators merged into GEN');
need('src/game/game.js', 'function rectSVG(', 'the rectangle picture');
need('src/shared/registry.ts', 'export const GARDEN_STATIONS', 'the Garden Center stations');
need('src/game/game.js', 'const MARKET_GEN', 'the Market Stall generators');
need('src/game/game.js', 'Object.assign(GEN, MARKET_GEN)', 'the Market Stall generators merged into GEN');
need('src/shared/registry.ts', 'export const MARKET_STATIONS', 'the Market Stall stations');
need('src/game/game.js', 'const CLOCK_GEN', 'the Clock Tower generators');
need('src/game/game.js', 'Object.assign(GEN, CLOCK_GEN)', 'the Clock Tower generators merged into GEN');
need('src/game/game.js', 'function ooEval(', 'the order of operations engine');
need('src/shared/registry.ts', 'export const CLOCK_STATIONS', 'the Clock Tower stations');
need('src/game/game.js', 'const RINK_GEN', 'the Ice Rink generators');
need('src/game/game.js', 'Object.assign(GEN, RINK_GEN)', 'the Ice Rink generators merged into GEN');
need('src/game/game.js', 'id="negBtn"', 'the ± button for negative answers');
need('src/shared/registry.ts', 'export const RINK_STATIONS', 'the Ice Rink stations');
need('src/game/game.js', 'const POTION_GEN', 'the Potion Lab generators');
need('src/game/game.js', 'Object.assign(GEN, POTION_GEN)', 'the Potion Lab generators merged into GEN');
need('src/shared/registry.ts', 'export const POTION_STATIONS', 'the Potion Lab stations');
need('src/game/game.js', 'const POTION2_GEN', 'the Potion Lab equations and inequalities generators');
need('src/game/game.js', 'Object.assign(GEN, POTION2_GEN)', 'the Potion Lab part 2 generators merged into GEN');
need('src/game/game.js', 'function ineqSVG(', 'the inequality graph');
need('src/game/game.js', 'const HOUSES_GEN', 'the Pet Houses area and coordinate plane generators');
need('src/game/game.js', 'const HOUSES2_GEN', 'the Pet Houses volume and surface area generators');
need('src/game/game.js', 'Object.assign(GEN, HOUSES2_GEN)', 'the Pet Houses generators merged into GEN');
need('src/shared/registry.ts', 'export const HOUSES_STATIONS', 'the Pet Houses stations');
need('src/game/game.js', 'const SHOW_GEN', 'the Pet Show generators');
need('src/game/game.js', 'Object.assign(GEN, SHOW_GEN)', 'the Pet Show generators merged into GEN');
need('src/shared/registry.ts', 'export const SHOW_STATIONS', 'the Pet Show stations');
need('src/game/game.js', 'function fracBarSVG(', 'the fraction bar picture');
need('src/game/game.js', 'function numberLineSVG(', 'the number line picture');
need('src/shared/registry.ts', 'export const PIZZA_STATIONS', 'the Pizza Parlor stations');
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
need('src/game/game.js', 'return unitTestPassed(prev.id);', 'shops opening only after the unit test of the shop before (in the same neighborhood)');
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
const librarySets = rewardRegistry.match(/const LIBRARY_SETS[\s\S]*?\n\];/)?.[0] || '';
if (rewardRegistry && ((cafeRewards.match(/\{ id:/g) || []).length !== 16 || (unitSets.match(/^  \['/gm) || []).length !== 14 || (librarySets.match(/^  \['/gm) || []).length !== 3)) problems.push('src/shared/registry.ts should define REWARDS.length === 186 (Sentence Library and Rule Library sets added Oct 30, 2026; the Butterfly House set the same day)');
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
need('src/game/game.js', 'function renderSim(', 'Biology Unit 2 science labs (SCIENCE-UNIT2.md)');
need('src/game/game.js', "step.kind === 'table' ? tableStepHTML", 'project data tables and photos (SCIENCE-UNIT2.md)');
need('src/shared/questionBanks.js', 'const BIO2_QUESTIONS', 'Biology Unit 2 questions');
need('src/shared/questionBanks.js', 'const BIO3_QUESTIONS', 'Biology Unit 3 questions (SCIENCE-UNIT3.md)');
need('public/arcade/greenhouse-keeper/index.html', 'greenhouse:result', 'Greenhouse Keeper tells Pet World its score (GREENHOUSE-KEEPER.md)');
need('src/shared/questionBanks.js', 'const BIO4_QUESTIONS', 'Biology Unit 4 questions (SCIENCE-UNIT4.md)');
need('public/arcade/life-cycle-lab/index.html', 'lifecycle:result', 'the Life Cycle Lab tells Pet World its score (LIFE-CYCLE-LAB.md)');
need('src/game/game.js', 'function openHelpCard(', '✋ I have a question (QUESTIONS.md)');
need('src/teacher/report.ts', 'function questionsWaitingHTML(', 'teacher sees ✋ questions waiting (QUESTIONS.md)');
need('src/shared/questionBanks.js', 'const PREPOSITION_QUESTIONS', 'English Unit 5 questions (ENGLISH-UNIT5.md)');
need('src/game/game.js', 'function renderGgame(', 'English Unit 5 grammar games (ENGLISH-UNIT5.md)');
need('src/shared/questionBanks.js', 'const PUNCTUATION_QUESTIONS', 'English Unit 6 questions (ENGLISH-UNIT6.md)');
need('src/game/game.js', 'function renderHeroLab(', 'English Unit 6 Punctuation Power Lab (ENGLISH-UNIT6.md)');
need('src/shared/questionBanks.js', 'const COLON_QUESTIONS', 'English Unit 7 questions (ENGLISH-UNIT7.md)');
need('src/game/game.js', 'function renderBookRepair(', 'English Unit 7 Book Repair Desk (ENGLISH-UNIT7.md)');
need('src/shared/questionBanks.js', 'const SENTENCE_QUESTIONS', 'English Unit 8 questions (ENGLISH-UNIT8.md)');
need('src/game/game.js', 'function renderSentenceSnap(', 'English Unit 8 Sentence Snap (ENGLISH-UNIT8.md)');
need('src/shared/questionBanks.js', 'const RULE_QUESTIONS', 'English Unit 9 questions (ENGLISH-UNIT9.md)');
need('src/game/game.js', 'function renderRuleCourt(', 'English Unit 9 Rule Court (ENGLISH-UNIT9.md)');
need('public/prep-recall/index.html', 'prep:result', 'the preposition recall game tells Pet World its score (ENGLISH-UNIT5.md)');
need('src/game/game.js', 'function openPrepRecall(', 'the preposition recall game on Today’s plan during Unit 5 (ENGLISH-UNIT5.md)');
need('src/teacher/report.ts', 'r.ss?.', 'practice time on the dashboard');
need('src/teacher/main.ts', 'p_tz', "the teacher's time zone for practice time");
for (const m of ['const TRACKS = {', 'musicTrack', 'function openMusicMenu(', 'function musicAllowed(']) need('src/game/game.js', m);
need('src/teacher/main.ts', 'allowMusic', 'the teacher Allow music switch');
// 📈 Insights (docs/INSIGHTS.md): the analysis stays import-free so the daily-insights email function can use a copy of it
need('src/shared/insights.ts', 'export function computeInsights(', 'the Insights analysis (INSIGHTS.md)');
if (/^\s*import\s/m.test(read('src/shared/insights.ts'))) problems.push('src/shared/insights.ts must not import other files: the daily-insights Edge Function uses a copy of it (INSIGHTS.md)');
need('src/teacher/report.ts', 'renderInsightsCard(', 'the 📈 Insights section on the student page (INSIGHTS.md)');
need('supabase/functions/daily-insights/index.ts', "from '../_shared/insights.ts'", 'the daily insights email function (INSIGHTS.md)');
need('src/game/game.js', 'S.missLog', 'the missed-prompt log Insights reads (INSIGHTS.md)');

const allSrc = ['src/game/game.js', 'src/teacher/main.ts', 'src/lib/supabase.ts', 'src/lib/studentBackend.ts'].map(p => existsSync(p) ? readFileSync(p, 'utf8') : '').join('\n');
if (allSrc.includes('learning_events')) problems.push('Code writes to a "learning_events" table, which is not part of this project\'s database. This is a sign of a placeholder rewrite.');
if (allSrc.includes('window.prompt(')) problems.push('Code uses window.prompt(). The real teacher app uses forms. This is a sign of a placeholder rewrite.');
for (const file of ['docs/AGENTS.md', 'docs/CLAUDE.md']) if (existsSync(file)) problems.push(`${file} is a stray copy of repository instructions and must not exist.`);

// Every available Arcade game has its built copy in public/ (a game's source is in src/arcade/<id>/; see its README),
// or is a Vite page at arcade/<id>/index.html listed in vite.config.ts (an Arcade copy of a unit game; docs/ARCADE-GAMES.md)
const viteConfig = read('vite.config.ts');
for (const [, src] of rewardRegistry.matchAll(/src: '(\/arcade\/[^']+\/)', available: true/g)) {
  const vitePage = `${src.slice(1)}index.html`;
  if (existsSync(vitePage) && viteConfig.includes(`'${vitePage}'`)) continue;
  if (!existsSync(`public${src}index.html`)) problems.push(`The Arcade game at ${src} isn't built: public${src}index.html is missing. Build it from src${src} (see its README.md).`);
}

// Owner rule (CLAUDE.md, "Games go in the unit and in the Arcade"): every unit game is also an Arcade game
for (const [id, inUnit] of Object.entries({'chefs-rush':'function openChefRush(', 'pet-surgery':'function openSurgery(', 'supermarket-dash':'function openDash(', 'penguin-push':'function openPenguin(', 'potion-detective':'function openDetective(', 'carnival':'function openCarnival(', 'shape-asteroids':'function openAsteroids(', 'harbor-battleship':'function openBattleship(', 'parcel-post':'function openParcel(', 'pet-show':'function openPetShow(', 'pax-oeconomica':'function openPax(', 'greenhouse-keeper':'function openGreenhouse(', 'life-cycle-lab':'function openLifeCycle(', 'link-games':'function ggameCardsHTML(', 'power-lab':'function heroLabCardHTML(', 'book-repair':'function bookRepairCardHTML(', 'rule-court':'function ruleCourtCardHTML(', 'sentence-snap':'function sentenceSnapCardHTML('})) {
  if (!game.includes(inUnit)) problems.push(`The unit game "${id}" is missing from its unit (${inUnit} in src/game/game.js)`);
  if (!new RegExp(`id: '${id}'[^\n]*available: true`).test(rewardRegistry)) problems.push(`The unit game "${id}" is missing from the Arcade (ARCADE_GAMES in src/shared/registry.ts)`);
}

// The brain stretch games are built into public/ (source: src/brain-games/; see its README and docs/BRAIN-GAMES.md)
if (!existsSync('public/brain-games/index.html')) problems.push("The Brain Games aren't built: public/brain-games/index.html is missing. Build them from src/brain-games (see its README.md).");

// Khan links are well formed (offline; "npm run check-links" opens each one). Docs: KHAN.md
try { const { khanLinks, offlineProblems } = await import('./check-links.mjs'); problems.push(...offlineProblems(await khanLinks())); }
catch (error) { problems.push(`The Khan link check could not run: ${error.message}`); }

// History and Science: the videos come first (owner rule, Oct 27, 2026; CLAUDE.md). Every lesson block of a History or
// Biology unit lists its Khan videos in KHAN_VIDEOS (an empty list for a lesson with none), and the game shows them and
// counts watching as class time. Units built before the rule are listed here until their videos are added.
try {
  const ID_STUB = "const questionId = (c, s, p, a) => `${c}:${s}:${p}:${a}`;";   // questionBanks.js imports a TypeScript file; a stand-in lets Node load it
  const src = readFileSync('src/shared/questionBanks.js', 'utf8').replace(/^import \{ questionId \} from '\.\/questionIds';$/m, ID_STUB);
  const { LESSON_COURSES, KHAN_VIDEOS } = await import('data:text/javascript;base64,' + Buffer.from(src).toString('base64'));
  const BEFORE_THE_RULE = ['history', 'history2', 'history3', 'bio1', 'bio2'];
  for (const course of LESSON_COURSES.filter(c => /^(history|bio)\d*$/.test(c.id) && !BEFORE_THE_RULE.includes(c.id)))
    for (const group of course.groups) if (!Array.isArray(KHAN_VIDEOS?.[course.id]?.[group.id])) problems.push(`${course.id}: lesson "${group.name}" has no KHAN_VIDEOS list (src/shared/questionBanks.js). History and Science lessons list their Khan videos; use [] for a lesson with none.`);
} catch (error) { problems.push(`The History/Science video check could not run: ${error.message}`); }
need('src/game/game.js', 'function khanVideosHTML(', 'the lesson video buttons (History and Science videos come first)');
need('src/game/game.js', 'ActivityTracker.watching = ', 'video time counted as class time');
need('src/game/game.js', 'function watchFirstThen(', 'the watch-first prompt before practice');
need('src/game/game.js', 'function videoGateThen(', 'today’s video, signed by a grown-up, before practice (docs/VIDEO-GATE.md)');
need('src/game/game.js', 'function helpBlocks(', 'the 🛑 Time to get help stop (docs/VIDEO-GATE.md)');
need('src/shared/mathVideos.js', 'export function struggleCheck(', 'the 🛑 Time to get help rule');
// 🎬 Kid videos in Today's video picker (docs/KID-VIDEOS.md): checked ids only, every list points at the catalog
need('src/game/game.js', 'function kidVideosFor(', 'the kid video cards in Today’s video picker (docs/KID-VIDEOS.md)');
need('src/teacher/lessons.ts', 'function kidVideoCardHTML(', 'the teacher’s Kid videos card (docs/KID-VIDEOS.md)');
{
  const kv = read('src/shared/kidVideos.ts');
  const catalog = new Set([...(kv.split('export const KID_VIDEOS')[0] || '').matchAll(/^\s+'([A-Za-z0-9_-]{11})': \[/gm)].map(m => m[1]));
  const lists = [...(kv.split('export const KID_VIDEOS')[1] || '').matchAll(/^\s+'([^']+)': \[([^\]]*)\]/gm)];
  if (kv && (!catalog.size || !lists.length)) problems.push('src/shared/kidVideos.ts: could not read KID_VIDEO_CATALOG or KID_VIDEOS');
  for (const [, key, ids] of lists) for (const id of ids.match(/'[^']*'/g) || []) if (!catalog.has(id.slice(1, -1))) problems.push(`src/shared/kidVideos.ts: ${key} lists ${id}, which is not in KID_VIDEO_CATALOG (add it only after checking it exists)`);
}

// Tests: review first, a grown-up's PIN, every unit (CLAUDE.md, "Tests: review first"; docs/TEST-GATE.md)
for (const [fn, what] of [['async function gatedTestReview(', 'the PIN before a test review'], ['async function gatedPetWorldTest(', 'the review + PIN before a Pet World test'],
  ['async function gatedKhanTest(', 'the review + PIN before a Khan test'], ['async function gatedUnitReview(', 'the PIN before a math unit review'], ['async function gatedUnitTest(', 'the review + PIN before a math Unit Test'],
  ['function askGrownUp(', 'the grown-up PIN card'], ['function reviewTeachHTML(', 'the lesson shown for a missed review question'],
  ['shift.unitReview.needs', 'the math review fix-up orders'], ['data-written-hint', 'the written-answer hint behind the grown-up PIN']]) need('src/game/game.js', fn, what);
need('src/game/game.js', 'function roleSceneHTML(', 'History role scenes: picture, map pin and timeline (ROLE-SCENES.md)');
if (/data-ela-final'\)\) \{ startEnglishAssessment/.test(game)) problems.push('src/game/game.js starts a Pet World test without the review and grown-up PIN (use gatedPetWorldTest)');
if (/data-unit-test\]'\);\s*if \(unitTest && !unitTest\.disabled\) \{ void startAssessment/.test(game)) problems.push('src/game/game.js starts a math Unit Test without the review and grown-up PIN (use gatedUnitTest)');
if (/<a [^>]*>Open the Khan test<\/a>/.test(game)) problems.push('src/game/game.js links straight to a Khan test without the review and grown-up PIN (use data-khan-open)');
{
  // every built library unit and every built 6th grade math shop has a Khan unit test link
  const block = (name) => (game.match(new RegExp(`const ${name} = \\{([\\s\\S]*?)\\n\\};`)) || [])[1] || '';
  const keysOf = (src) => new Set([...src.matchAll(/^\s*([A-Za-z0-9]+):/gm)].map(m => m[1]));
  const libKhan = keysOf(block('KHAN_UNIT_TESTS')), mathKhan = keysOf(block('MATH_KHAN_UNITS'));
  const reportCourses = ((game.match(/const REPORT_COURSES = \[([^\]]*)\]/) || [])[1] || '').match(/[A-Za-z0-9]+/g) || [];
  if (!reportCourses.length) problems.push('src/game/game.js: REPORT_COURSES (the built library units) could not be read');
  for (const c of reportCourses) if (!libKhan.has(c)) problems.push(`Library unit "${c}" has no Khan unit test link in KHAN_UNIT_TESTS (src/game/game.js)`);
  for (const [, id] of rewardRegistry.matchAll(/\{id:'([a-z0-9]+)',[^\n]*hood:'g6', subject:'math', open:true/g)) if (!mathKhan.has(id)) problems.push(`Math shop "${id}" has no Khan unit link in MATH_KHAN_UNITS (src/game/game.js)`);
  // every lesson has its short lesson: explanation (the review shows it when she misses that lesson)
  const banks = read('src/shared/questionBanks.js');
  for (const [, id, body] of banks.matchAll(/\{id:'([A-Za-z0-9]+)',([^{}]*?)\}/g)) {
    if (body.includes('name:') && !body.includes('skills:') && !/lesson:'[^']{12,}/.test(body) && !/lesson:"[^"]{12,}/.test(body)) problems.push(`Lesson "${id}" in src/shared/questionBanks.js has no lesson: explanation (the test review teaches from it)`);
  }
}

if (problems.length) {
  console.error('\n❌ Pet World verify FAILED. Do not commit.\n');
  problems.forEach(p => console.error('  - ' + p));
  console.error('\nIf an AI assistant made recent changes, undo them (git checkout -- <file>) and see AGENTS.md.\n');
  process.exit(1);
}
console.log('✅ Pet World verify passed: game, teacher app, shared registry, and database schema are intact.');
