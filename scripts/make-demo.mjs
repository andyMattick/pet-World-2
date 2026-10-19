// Builds the demo files in supabase/demo/ (demo-N-data.sql): a demo teacher's class of 8 made-up students with about 6 weeks of believable
// work, so other teachers can sign in and see every page with data on it (docs/DEMO.md).
//   node --experimental-strip-types scripts/make-demo.mjs
// The output is deterministic (seeded random), so re-running it only changes the file when this script or the
// banks change. Dates are written as tokens ("@D3" = 3 school days ago, "@T3@09:15:00", "@M12" = 12 minutes before
// the reset) that demo_reset() turns into real dates when it runs, so the class always looks current.
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('..', import.meta.url);
const file = p => new URL(p, ROOT);

/* ---------- the real banks, so question ids match what the teacher app shows ---------- */
const ID_CODE = `const _norm = t => String(t ?? '').trim().toLowerCase().replace(/\\s+/g, ' ');
const _fnv = t => { let h = 0x811c9dc5; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); };
const questionId = (c, s, p, k = '') => \`\${c}:\${s}:\${_fnv(_norm(p) + (k ? '\\u0000' + _norm(k) : ''))}\`;`;
const banksSrc = fs.readFileSync(file('src/shared/questionBanks.js'), 'utf8').replace(/^import \{ questionId \} from '\.\/questionIds';$/m, ID_CODE);
const Banks = await import('data:text/javascript;base64,' + Buffer.from(banksSrc).toString('base64'));
const { TYPED_QUESTIONS } = await import(pathToFileURL(file('src/shared/typedQuestions.js').pathname).href);
const { VOCAB_WORDS } = await import(pathToFileURL(file('src/shared/vocab.js').pathname).href);
const Reg = await import(pathToFileURL(file('src/shared/registry.ts').pathname).href);
const { spellingPatterns } = await import(pathToFileURL(file('src/shared/spellingPatterns.js').pathname).href);

/* ---------- seeded random ---------- */
let seed = 20261019;
const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = list => list[Math.floor(rnd() * list.length)];
const chance = p => rnd() < p;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- time tokens ---------- */
const DAYS = 30;          // school days of history (about 6 weeks); day 0 is the day of the reset
const LOG_DAYS = 14;      // the save keeps 14 days of detail (dayLog)
const NOW_MIN = 11 * 60 + 40;   // day 0 is drawn as if the reset ran at 11:40; times become "minutes before the reset"
const hhmmss = m => { const s = Math.round(m * 60); return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
const D = n => `@D${n}`;
const T = (n, minute) => (n === 0 ? `@M${Math.max(1, Math.round(NOW_MIN - minute))}` : `@T${n}@${hhmmss(minute)}`);

/* ---------- math content ---------- */
const STEP_TYPE = { concept: 'idea', compute: 'arith', setup: 'setup' };
const STEPS = {
  basic: [['Count', 'setup'], ['Write the ratio', 'concept'], ['Simplest form', 'concept']],
  tape: [['Count the boxes', 'concept'], ['Value of one box', 'compute'], ['Find the part', 'compute']],
  groups: [['Find the number of groups', 'concept'], ['Scale the other part', 'compute']],
  dnlCreate: [['Find each jump', 'concept'], ['Fill in the line', 'compute']],
  dnl: [['Find the multiplier', 'concept'], ['Scale the other line', 'compute']],
  dnlTable: [['Match line to table', 'concept']],
  table: [['Find the multiplier', 'concept'], ['Multiply', 'compute']],
  equiv: [['Pick the equivalent ratio', 'concept'], ['Name the multiplier', 'compute']],
  word: [['Find the multiplier', 'concept'], ['Scale the other part', 'compute']],
  realworld: [['Find the multiplier', 'concept'], ['Decide if equivalent', 'concept']],
  understand: [['Explain equivalence', 'concept']],
  coord: [['Plot a point', 'concept'], ['Read a point', 'compute']],
  units: [['Pick the operation', 'concept'], ['Convert', 'compute']],
  ppw: [['Count total parts', 'concept'], ['Value of one part', 'compute'], ['Find the part', 'compute'], ['Find the whole', 'compute']],
  addDec: [['Estimate', 'concept'], ['Line up the decimals', 'concept'], ['Add', 'compute']],
  subDec: [['Estimate', 'concept'], ['Line up the decimals', 'concept'], ['Subtract', 'compute']],
  decWord: [['Pick the operation', 'concept'], ['Line up the decimals', 'concept'], ['Add', 'compute']],
  fracDivWhole: [['Divide', 'compute']],
  wholeDivFrac: [['More or less than 1?', 'concept'], ['Flip the divisor', 'concept'], ['Multiply', 'compute']]
};
/* mix-ups that fit each skill, with what the wrong answer looked like */
const MIX = {
  basic: [['reversed', () => { const a = ri(2, 9), b = ri(2, 9); return [`${b} : ${a}`, `${a} : ${b}`, `${a} blueberries to ${b} strawberries`]; }],
          ['partwhole', () => { const a = ri(2, 6), b = ri(2, 6); return [`${a} : ${a + b}`, `${a} : ${b}`, `${a} red to ${b} blue, asked red to blue`]; }]],
  tape: [['oneBox', () => { const n = ri(3, 6), v = ri(2, 8); return [`${n * v}`, `${v}`, `${n} boxes = ${n * v}, value of one box`]; }]],
  groups: [['additive', () => { const a = ri(2, 5), k = ri(2, 4); return [`${a + k + 1}`, `${a * k}`, `${a} : ${a + 1} scaled by ${k}`]; }]],
  dnl: [['additive', () => { const a = ri(2, 5), k = ri(2, 5); return [`${a + k}`, `${a * k}`, `double number line ×${k}`]; }]],
  dnlCreate: [['additive', () => { const a = ri(2, 6); return [`${a + 2}`, `${a * 2}`, `jumps of ${a}`]; }]],
  table: [['additive', () => { const a = ri(2, 6), k = ri(2, 5); return [`${a + k}`, `${a * k}`, `ratio table ×${k}`]; }],
          ['oneSideOnly', () => { const a = ri(2, 6), b = ri(3, 9), k = ri(2, 4); return [`${b}`, `${b * k}`, `${a} : ${b} → ${a * k} : ?`]; }]],
  equiv: [['missedEquivalent', () => { const a = ri(2, 5), b = ri(3, 7); return [`no`, `yes`, `${a} : ${b} and ${a * 3} : ${b * 3}`]; }]],
  word: [['reversed', () => { const a = ri(2, 5), b = ri(3, 8); return [`${b} : ${a}`, `${a} : ${b}`, `${a} cups flour for ${b} muffins`]; }],
         ['additive', () => { const a = ri(2, 5), k = ri(2, 4); return [`${a + k}`, `${a * k}`, `recipe for ${k} times as many`]; }]],
  realworld: [['oneSideOnly', () => { const a = ri(2, 6); return [`yes`, `no`, `${a} : ${a + 2} vs ${a * 2} : ${a + 4}`]; }]],
  ppw: [['partsCount', () => { const a = ri(1, 4), b = ri(2, 5), w = (a + b) * ri(2, 6); return [`${w / b}`, `${w / (a + b)}`, `${a} : ${b}, total ${w}`]; }]],
  units: [['unitsDirection', () => { const n = ri(2, 9); return [`${n / 12}`, `${n * 12}`, `${n} feet to inches`]; }]],
  addDec: [['rightAlign', () => { const a = (ri(10, 99) / 10).toFixed(1), b = (ri(100, 999) / 100).toFixed(2); return [(+a / 10 + +b).toFixed(2), (+a + +b).toFixed(2), `${a} + ${b}`]; }]],
  subDec: [['noRegroup', () => { const a = (ri(30, 90) / 10).toFixed(1), b = (ri(11, 29) / 10).toFixed(1); return [(+a - +b + 1).toFixed(1), (+a - +b).toFixed(1), `${a} − ${b}`]; }],
           ['rightAlign', () => { const a = (ri(50, 99) / 10).toFixed(1), b = (ri(101, 399) / 100).toFixed(2); return [(+a - +b / 10).toFixed(2), (+a - +b).toFixed(2), `${a} − ${b}`]; }]],
  decWord: [['wrongOperation', () => { const a = (ri(500, 1999) / 100).toFixed(2); return ['Add', 'Subtract', `change from $20 for $${a}`]; }]],
  fracDivWhole: [['divAsMult', () => { const d = ri(2, 6), w = ri(2, 4); return [`${w}/${d}`, `1/${d * w}`, `1/${d} ÷ ${w}`]; }]],
  wholeDivFrac: [['noFlip', () => { const w = ri(2, 6), d = ri(2, 4); return [`${w}/${d}`, `${w * d}`, `${w} ÷ 1/${d}`]; }]]
};
for (const [skill, list] of Object.entries(MIX)) for (const [id] of list) if (!Reg.MIS[id]) throw new Error(`unknown mix-up ${id} (${skill})`);
const SHOP_NAME = { cafe: '☕ Pet Café', bakery: '🥐 Bakery' };
const stations = shop => Reg.SHOPS[shop].stations.filter(s => s.skills.length);
const stationName = (shop, st) => Reg.SHOPS[shop].stations.find(s => s.id === st).name;
const stationLabel = (shop, st, mode = '') => `${SHOP_NAME[shop]}${mode === 'test' ? ' · Unit Test' : ` · ${stationName(shop, st)}${mode === 'quiz' ? ' quiz' : ''}`}`;
const statusFromRecent = r => { const last = r.slice(-8); if (r.length < 4) return 'new'; const ok = [...last].filter(c => c === '1').length / last.length; return ok >= 0.75 ? 'mastered' : ok >= 0.5 ? 'practicing' : 'struggling'; };

/* ---------- lesson courses ---------- */
const COURSES = Object.fromEntries(Banks.LESSON_COURSES.map(c => [c.id, c]));
const FINAL = {
  nouns: { key: 'final-test', n: 10, pass: 8, store: 'elaProgress', building: 'elaNouns', subject: 'english' },
  verbs: { key: 'verbs:final-test', n: 11, pass: 9, store: 'elaProgress', building: 'elaVerbs', subject: 'english' },
  pronouns: { key: 'pronouns:final-test', n: 11, pass: 9, store: 'elaProgress', building: 'elaPron', subject: 'english' },
  modifiers: { key: 'modifiers:final-test', n: 10, pass: 8, store: 'elaProgress', building: 'elaDescr', subject: 'english' },
  history: { key: 'history:final-test', n: 8, pass: 7, store: 'historyProgress', building: 'histOrigins', subject: 'history', noQuiz: true },
  history2: { key: 'history2:final-test', n: 10, pass: 8, store: 'historyProgress', building: 'histEarly', subject: 'history', noQuiz: true },
  bio1: { key: 'bio1:final-test', n: 22, pass: 18, store: 'scienceProgress', building: 'bioChem', subject: 'science' }
};
const quizKey = (course, group) => (course === 'nouns' ? `quiz:${group}` : `${course}:quiz:${group}`);
/* the questions of one skill, with the ids the Lessons tab uses */
const qCache = {};
function questions(course, skill) {
  const k = `${course}:${skill}`;
  if (!qCache[k]) qCache[k] = Banks.applyQuestionEdits(course, skill, Banks.builtInBank(course)[skill] || [], {});
  return qCache[k];
}
for (const c of Object.keys(FINAL)) { if (!COURSES[c]) throw new Error(`no course ${c}`); for (const s of COURSES[c].skills) if (questions(c, s.id).length < 4) throw new Error(`few questions ${c}/${s.id}`); }

/* ---------- the students ---------- */
/* acc: how often a first try is right; grow: how fast that improves with practice; attend: chance of working on a
   school day; mins: a usual day's minutes; math/english/history/science: where each subject starts, 30 school days ago */
const KIDS = [
  { n: 'Maya R.', pet: 'fox', acc: 0.93, eng: 0.92, grow: 0.004, attend: 0.98, start: 8.5, math: ['cafe', 4], english: 'pronouns', history: 'history', reading: 'Hatchet|Gary Paulsen', outside: 'piano', active: 1 },
  { n: 'Jonah K.', pet: 'panda', acc: 0.84, eng: 0.76, grow: 0.006, attend: 0.94, start: 9, math: ['cafe', 3], english: 'verbs', history: 'history', reading: 'The Wild Robot|Peter Brown', outside: 'spanish', active: 2 },
  { n: 'Priya S.', pet: 'bunny', acc: 0.7, eng: 0.94, grow: 0.007, attend: 0.96, start: 8.75, math: ['cafe', 2], english: 'verbs', science: 'bio1', reading: 'Wonder|R. J. Palacio', mixups: ['partwhole', 'reversed'] },
  { n: 'Eli M.', pet: 'hamster', acc: 0.58, eng: 0.6, grow: 0.008, attend: 0.86, start: 9.25, math: ['cafe', 1], english: 'nouns', weak: [7, 8], mixups: ['additive', 'reversed', 'oneBox'] },
  { n: 'Sofia L.', pet: 'cat', acc: 0.8, eng: 0.84, grow: 0.006, attend: 0.93, start: 8.75, math: ['cafe', 3], english: 'nouns', history: 'history', reading: 'Because of Winn-Dixie|Kate DiCamillo', outside: 'coop' },
  { n: 'Theo B.', pet: 'penguin', acc: 0.74, eng: 0.68, grow: 0.005, attend: 0.66, start: 9.5, math: ['cafe', 3], english: 'pronouns', history: 'history', weak: [6, 7], mixups: ['additive'] },
  { n: 'Ava W.', pet: 'unicorn', acc: 0.88, eng: 0.9, grow: 0.005, attend: 0.97, start: 8.5, math: ['cafe', 4], english: 'modifiers', history: 'history2', science: 'bio1', reading: 'Holes|Louis Sachar' },
  { n: 'Leo D.', pet: 'cat', acc: 0.72, eng: 0.76, grow: 0.01, attend: 0.9, start: 9, math: ['cafe', 1], english: 'nouns', joined: 6 }
];
const ENGLISH_ORDER = ['nouns', 'verbs', 'pronouns', 'modifiers'];
const HISTORY_ORDER = ['history', 'history2'];

/* ---------- output rows (compact arrays; the SQL names the columns) ---------- */
const OUT = { problems: [], attempts: [], assessments: [], sprints: [], popups: [], sessions: [], ledgerDays: [], outside: [], saves: [], students: [], khan: {} };

/* the grown-up PIN, hashed the way game.js pinHash does it */
const pinHash = pin => { let h = 5381; for (const c of 'pet-town:' + pin) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0; return h.toString(36); };
function newState(k) {
  return {
    v: 1, name: k.n, parentPin: pinHash('1234'), savedAt: '@M0', coins: 0, power: 1, home: 'g6', pet: k.pet, owned: [...new Set(['cat', k.pet])], sprintBest: 0, sprintPick: ['times'],
    orders: 0, perfect: 0, streak: 0, day: 1, kr: {}, kn: {}, ks: {}, mis: {}, quizzes: {}, review: {}, stationsOpenedBefore: {}, facts: {}, divFacts: {}, drillLog: {},
    cafe: { st: { 1: 0, 2: 0, 3: 0, 4: 0 } }, bakery: { st: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
    subjectTime: {}, dayLog: {}, elaProgress: {}, historyProgress: {}, scienceProgress: {}, historyProjects: {}, scienceProjects: {},
    questionStats: {}, writtenAnswers: [], readingBooks: [], mathThink: {}, vocab: { stats: {}, flagged: [] },
    brain: { results: [], stretches: [], levels: {}, morning: '', stretched: {}, streak: {}, slump: {}, pace: {} }, sentBackSeen: [], planCarry: { after: '', items: [] }
  };
}
const addSecs = (obj, key, secs) => { obj[key] = Math.min(86400, (obj[key] || 0) + Math.round(secs)); };

/* one student's six weeks, day by day, oldest first */
function simulate(k, si) {
  const S = newState(k), mathPos = { shop: k.math[0], st: k.math[1], test: false };
  const eng = { course: k.english, stopAfter: ENGLISH_ORDER.slice(ENGLISH_ORDER.indexOf(k.english) + 1) }, hist = k.history ? { course: k.history, stopAfter: HISTORY_ORDER } : null, sci = k.science ? { course: k.science } : null;
  const plan = [['math', 30], ['english', 20], ...(hist ? [['history', 15]] : []), ...(sci ? [['biology', 15]] : [])];
  let sprintBest = 0, everMastered = new Set();
  /* what came before the six weeks: earlier stations and units already passed */
  const before = n => T(DAYS + n, 10 * 60);
  for (const st of stations('cafe')) if (mathPos.shop === 'bakery' || st.id < mathPos.st) passStation(S, 'cafe', st.id, before(10 - st.id), true);
  if (mathPos.shop === 'bakery') passUnitTest(S, 'cafe', before(5));
  for (const c of ENGLISH_ORDER.slice(0, ENGLISH_ORDER.indexOf(k.english))) passCourseBefore(S, c, before(20 - ENGLISH_ORDER.indexOf(c) * 4));
  if (hist) for (const c of HISTORY_ORDER.slice(0, HISTORY_ORDER.indexOf(hist.course))) passCourseBefore(S, c, before(15));

  for (let n = DAYS - 1; n >= 0; n--) {
    if (k.joined && n > k.joined) continue;
    const here = n === 0 ? (k.active ? true : k.n === 'Theo B.' ? false : chance(0.85)) : chance(k.attend);
    if (!here) continue;
    const day = D(n), log = n < LOG_DAYS ? (S.dayLog[day] = { places: {}, counts: {}, events: [], labels: {}, sent: 0 }) : null;
    const subj = (S.subjectTime[day] = {});
    let m = n === 0 && k.active === 2 ? NOW_MIN - 45 : k.start * 60 + ri(-10, 15);   // minutes since midnight (Jonah starts late today and is mid-math right now)
    let lastLabel = '';
    const dayStart = m, ev = (minute, e) => { if (log && !(n === 0 && minute > NOW_MIN)) log.events.push({ t: T(n, minute), ...e }); };
    const place = (key, label, secs) => { lastLabel = label; if (!log) return; addSecs(log.places, key, secs); log.labels[key] = label; };
    const timeUp = () => n === 0 && m > NOW_MIN - (k.active ? 1 : 25);
    const done = new Set();
    /* morning brain stretch */
    const games = [];
    while (games.length < 3) { const g = pick(BRAIN); if (!games.includes(g)) games.push(g); }
    const stretchId = `m-${si}-${n}`;
    if (n < LOG_DAYS) games.forEach((g, i) => {
      const lv = S.brain.levels[g[0]] || 0, acc = clamp(Math.round(100 * (k.acc + 0.05 + (rnd() - 0.5) * 0.2)), 40, 100);
      S.brain.results.push({ t: T(n, m + i * 1.5 + 1.3), g: g[0], lv: g[2][lv], acc, rt: ri(450, 1400), sc: ri(8, 40), dur: ri(70, 100), s: stretchId });
      if (acc >= 85 && chance(0.25)) S.brain.levels[g[0]] = Math.min(g[2].length - 1, lv + 1);
    });
    if (n < LOG_DAYS) S.brain.stretches.push({ id: stretchId, day, kind: 'morning', label: 'Morning brain stretch', games: games.map(g => g[0]), done: 3, at: T(n, m), finishedAt: T(n, m + 4.5) });
    S.brain.morning = day;
    S.brain.stretched[day] = plan.map(([s]) => ({ math: 'p-math', english: 'p-eng', history: 'p-hist', biology: 'p-bio' }[s]));   // no catch-up stretches when a visitor opens her town
    ev(m + 4.5, { k: 'brain', title: 'Morning brain stretch', detail: games.map(g => g[1]).join(', ') });
    addSecs(subj, 'brain', 270); m += 5;

    /* math: a sprint, then orders at the current station; a quiz when every skill there is going well */
    const sprintN = sprint(S, k, si, n, m, ev, log); sprintBest = Math.max(sprintBest, sprintN);
    addSecs(subj, 'math', 75); place('sprint', '⚡ Fact Sprint', 75); m += 2;
    const mathMins = ri(15, 24);
    const mathEnd = n === 0 && k.active === 2 ? Infinity : m + mathMins;
    while (m < mathEnd && !timeUp()) {
      const shop = mathPos.shop, st = mathPos.st, skills = mathPos.test ? [] : stations(shop).find(s => s.id === st).skills;
      const ready = !mathPos.test && skills.every(sk => (S.kn[sk] || 0) >= 9 && statusFromRecent(S.kr[sk] || '') !== 'struggling') && skills.filter(sk => statusFromRecent(S.kr[sk] || '') === 'mastered').length >= skills.length - 1;
      if (!mathPos.done && ((mathPos.test && chance(0.5)) || (ready && chance(0.3)))) {   // a station quiz (or the unit test)
        const res = assess(S, k, si, n, m, shop, mathPos.test ? null : st, ev, log);
        m += res.total * 1.2; addSecs(subj, 'math', res.total * 72); place(`shop:${shop}:${mathPos.test ? 'test' : st}:${mathPos.test ? 'test' : 'quiz'}`, stationLabel(shop, st, mathPos.test ? 'test' : 'quiz'), res.total * 72);
        if (res.passed) {
          if (mathPos.test) { if (shop === 'cafe') Object.assign(mathPos, { shop: 'bakery', st: 1, test: false }); else mathPos.done = true; }
          else if (st === stations(shop).length) mathPos.test = true;
          else if (shop === 'bakery' && st >= 2) mathPos.done = true;   // the demo stops at Sharing Pans
          else mathPos.st = st + 1;
        }
        continue;
      }
      const pool = mathPos.test ? stations(shop).flatMap(s => s.skills) : skills, sk = pick(pool.filter(x => STEPS[x])) || pool[0];   // before the unit test: review any skill in the shop
      const secsSt = mathPos.test ? stations(shop).find(s => s.skills.includes(sk)).id : st;
      const secs = order(S, k, si, n, m, shop, secsSt, sk, ev, everMastered);
      m += secs / 60; addSecs(subj, 'math', secs); place(`shop:${shop}:${secsSt}`, stationLabel(shop, secsSt), secs);
      if (log) { const c = log.counts[`shop:${shop}:${secsSt}`] || (log.counts[`shop:${shop}:${secsSt}`] = { n: 0, ok: 0 }); c.n++; if (S.kr[sk].endsWith('1')) c.ok++; log.labels[`shop:${shop}:${secsSt}`] = stationLabel(shop, secsSt); }
    }
    if ((subj.math || 0) >= 30 * 60) { ev(m, { k: 'done', title: '➗ Math: 30 min', subject: 'math' }); done.add('math'); }
    if (timeUp()) { finishDay(); continue; }
    const moveBreak = () => {
      const mv = [pick(MOVES_S), pick(MOVES_F), pick(MOVES_S), pick(MOVES_F)];
      ev(m + 1.6, { k: 'move', title: 'Stand-and-stretch break', detail: mv.join(', ') }); m += 2;
    };
    moveBreak();

    /* English */
    const engEnd = m + ri(18, 28);
    if (eng.course && chance(0.7)) { const watch = ri(4, 9) * 60; addSecs(subj, 'english', watch); place(`course:${eng.course}`, `📚 ${COURSES[eng.course].title}`, watch); m += watch / 60; }
    while (m < engEnd && !timeUp() && (eng.course || eng.lastCourse)) {
      const secs = lessonStep(S, k, n, m, eng, ev, k.eng);
      m += secs / 60; addSecs(subj, 'english', secs); place(`course:${eng.lastCourse}`, `📚 ${COURSES[eng.lastCourse].title}`, secs);
    }
    if ((subj.english || 0) >= 20 * 60) { ev(m, { k: 'done', title: '📚 English: 20 min', subject: 'english' }); done.add('english'); }
    /* history or biology (Ava and Priya do biology on Tuesdays and Thursdays) */
    for (const [state, subjectId, planId, minutes] of [[hist, 'history', 'history', 15], [sci, 'science', 'biology', 15]]) {
      if (!state || timeUp()) continue;
      moveBreak();
      const end = m + ri(14, 22);
      if (state.course && chance(0.7)) { const watch = ri(4, 8) * 60; addSecs(subj, subjectId, watch); place(`course:${state.course}`, `${subjectId === 'science' ? '🦁' : '🏛️'} ${COURSES[state.course].title}`, watch); m += watch / 60; }
      while (m < end && !timeUp() && (state.course || state.lastCourse)) {
        const secs = lessonStep(S, k, n, m, state, ev, (k.eng + k.acc) / 2);
        m += secs / 60; addSecs(subj, subjectId, secs); place(`course:${state.lastCourse}`, `${subjectId === 'science' ? '🦁' : '🏛️'} ${COURSES[state.lastCourse].title}`, secs);
      }
      if ((subj[subjectId] || 0) >= minutes * 60) { ev(m, { k: 'done', title: `${planId === 'biology' ? '🦁 Biology' : '🏛️ History'}: ${minutes} min`, subject: planId }); done.add(planId); }
    }
    /* words, reading, and some arcade time */
    if (!timeUp() && chance(0.6)) {
      const words = Array.from({ length: 6 }, () => pick(VOCAB_WORDS.slice(0, 40)).w.toLowerCase()), right = words.filter(() => chance(k.eng));
      words.forEach(w => { const r = (S.vocab.stats[w] ||= { r: [] }).r; r.push(right.includes(w) ? 1 : 0); if (r.length > 8) r.shift(); });
      ev(m + 3, { k: 'vocab', mode: 'practice', s: right.length, n: 6 }); addSecs(subj, 'words', 200); place('vocab:practice', '🔤 Word Workshop · Practice cards', 200); m += 3.5;
    }
    if (!timeUp() && k.reading) { const secs = ri(10, 20) * 60; addSecs(subj, 'reading', secs); place('reading', '📖 Reading Log', secs); m += secs / 60; }
    if (!timeUp() && chance(0.7)) { const secs = ri(4, 9) * 60; addSecs(subj, 'arcade', secs); place('arcade', '🕹️ Arcade', secs); m += secs / 60; }
    addSecs(subj, 'town', ri(60, 240));
    finishDay();

    function finishDay() {
      const endM = Math.min(m, n === 0 ? NOW_MIN - (k.active ? k.active : 30) : m);
      const active = Object.values(subj).reduce((a, b) => a + b, 0);
      OUT.sessions.push([si, T(n, dayStart), T(n, endM), active, k.n === 'Jonah K.' ? 'tablet' : 'computer']);
      S.now = { t: n === 0 && k.active ? `@M${k.active}` : T(n, endM), what: lastLabel || 'Pet World' };   // last seen
      if (n === 0) return;
      /* "I'm done for today" on most days: the day goes into the Ledger */
      const send = chance(k.n === 'Theo B.' ? 0.6 : 0.92);
      if (log && send) { log.sent = T(n, endM + 1); log.synced = true; }
      if (send) OUT.ledgerDays.push([si, day, ledgerEntry(day, subj, log, plan), T(n, endM + 1), false]);
    }
  }
  S.sprintBest = sprintBest;
  S.day = Object.keys(S.subjectTime).length + 12;   // days she has opened her town
  S.orders = Object.values(S.kn).reduce((a, b) => a + b, 0) + 40;
  S.perfect = Math.round(S.orders * k.acc * 0.8);
  S.coins = S.orders * 6 + ri(40, 300);
  return S;
}

const BRAIN = [['stroop-clash', 'Color Clash', ['standard', 'turbo', 'reverse']], ['chimp-memory', 'Chimp Memory', ['easy', 'medium', 'chimp']], ['trail-making', 'Trail Making', ['part-a', 'part-b']],
  ['speed-calc', 'Speed Math', ['foundational', 'intermediate', 'expert']], ['pattern-matrix', 'Pattern Matrix', ['single-rule', 'dual-rule']], ['flanker-task', 'Arrow Focus', ['standard', 'dense']],
  ['word-fluency', 'Word Builder', ['4-letter', '6-letter']], ['corsi-block', 'Block Path', ['forward', 'reverse']], ['go-no-go', 'Go / No-Go', ['standard', 'high-speed']],
  ['mental-rotation', 'Shape Turner', ['standard', 'complex']], ['card-sorting', 'Card Sort', ['standard']]];
const MOVES_S = ['Reach for the sky', 'Touch your toes', 'Arm circles', 'Side bends', 'Gentle twists', 'Shoulder rolls', 'Jumping jacks'];
const MOVES_F = ['Lap of the house', 'Juggle', 'Sock basketball', 'Push-ups', 'Staring contest', 'Dance party', 'Animal walk', 'Flamingo', 'Tell a joke', 'Water break'];

/* one café or bakery order: a problems row and one attempts row per step */
function order(S, k, si, n, m, shop, st, sk, ev, everMastered) {
  const tries = S.kn[sk] || 0, p = clamp(k.acc + k.grow * Math.min(tries, 25) - (st - 1) * 0.03, 0.3, 0.97);
  const steps = STEPS[sk] || [['Answer', 'concept']];
  let perfect = true, t = m, secs = 0;
  const mixups = (MIX[sk] || []).filter(([id]) => !k.mixups || k.mixups.includes(id) || chance(0.3));
  for (const [name, type] of steps) {
    const ok = chance(type === 'setup' ? Math.min(0.99, p + 0.1) : p), slow = chance(k.acc < 0.7 ? 0.2 : 0.08);
    const ms = slow ? ri(16000, 30000) : ri(3500, 12000); secs += ms / 1000 + ri(18, 34); t += ms / 60000 + 0.4;
    let mis = null, answer = null, expected = null, context = null;
    if (!ok) { perfect = false; const mx = mixups.length && chance(0.75) ? pick(mixups) : null; if (mx) { mis = mx[0]; [answer, expected, context] = mx[1](); S.mis[mis] = (S.mis[mis] || 0) + 1; } }
    if (n < 9) OUT.attempts.push([si, T(n, t), shop, sk, name, STEP_TYPE[type], ok ? 1 : 0, 1, slow ? 1 : 0, answer, expected, mis, context, ms]);
  }
  OUT.problems.push([si, T(n, t), shop, st, sk, perfect ? 1 : 0, steps.length, Math.round(secs)]);
  const before = statusFromRecent(S.kr[sk] || '');
  S.kr[sk] = ((S.kr[sk] || '') + (perfect ? '1' : '0')).slice(-10);
  S.kn[sk] = tries + 1;
  S[shop].st[st] = (S[shop].st[st] || 0) + (perfect ? 1 : 0);
  if (before !== 'mastered' && statusFromRecent(S.kr[sk]) === 'mastered' && !everMastered.has(sk)) { everMastered.add(sk); ev(t, { k: 'mastered', skill: sk, title: Reg.SKILLS[sk]?.name || sk }); }
  return Math.round(secs + ri(20, 45));
}
function passStation(S, shop, st, at, quietly) {
  S.quizzes[`${shop}:${st}`] = { passed: true, best: 90, tries: 1, lastAt: at };
  (S.stationsOpenedBefore[shop] ||= []).includes(st + 1) || S.stationsOpenedBefore[shop].push(st + 1);
  S.mathThink[`${shop}:${st}`] = { best: 4, tries: 1, passed: true, lastScore: 4, questionCount: 4 };
  for (const sk of stations(shop).find(s => s.id === st).skills) { S.kn[sk] = Math.max(S.kn[sk] || 0, ri(8, 14)); S.kr[sk] = S.kr[sk] || '1101111011'.slice(0, 10); }
  S[shop].st[st] = Math.max(S[shop].st[st] || 0, ri(8, 14));
  if (quietly) OUT.assessments.push([CUR, at, shop, st, 'quiz', 8, 9, 1, []]);
}
function passUnitTest(S, shop, at) { S.quizzes[`${shop}:test`] = { passed: true, best: 88, tries: 1, lastAt: at }; OUT.assessments.push([CUR, at, shop, null, 'test', 14, 16, 1, []]); }
let CUR = 0;
function assess(S, k, si, n, m, shop, st, ev, log) {
  const skills = st == null ? stations(shop).flatMap(s => s.skills) : stations(shop).find(s => s.id === st).skills;
  const total = st == null ? clamp(skills.length, 8, 16) : clamp(skills.length * 2, 6, 10);
  const p = clamp(k.acc + 0.06, 0.4, 0.98);
  let score = 0; const missed = new Set();
  for (let i = 0; i < total; i++) { if (chance(p)) score++; else missed.add(skills[i % skills.length]); }
  const passed = score * 100 / total >= 80, key = st == null ? `${shop}:test` : `${shop}:${st}`, prev = S.quizzes[key] || {};
  S.quizzes[key] = { passed: !!prev.passed || passed, best: Math.max(prev.best || 0, Math.round(score * 100 / total)), tries: (prev.tries || 0) + 1, lastAt: T(n, m + total * 1.2) };
  if (passed) { delete S.review[key]; if (st != null) { (S.stationsOpenedBefore[shop] ||= []).push(st + 1); S.mathThink[`${shop}:${st}`] = { best: ri(3, 4), tries: 1, passed: true, lastScore: 4, questionCount: 4 }; } }
  else S.review[key] = Object.fromEntries([...missed].map(sk => [sk, 2]));
  OUT.assessments.push([si, T(n, m + total * 1.2), shop, st, st == null ? 'test' : 'quiz', score, total, passed ? 1 : 0, passed ? [] : [...missed]]);
  ev(m + total * 1.2, { k: 'assess', shop, station: st, mode: st == null ? 'test' : 'quiz', s: score, n: total, passed });
  return { passed, total };
}
/* a fact sprint: one row, its facts as attempts, and pop-ups for the tables that keep getting missed */
function sprint(S, k, si, n, m, ev, log) {
  let right = 0;
  const count = ri(14, 26);
  for (let i = 0; i < count; i++) {
    const a = ri(2, 12), b = ri(2, 12), weak = (k.weak || []).some(w => w === a || w === b);
    const ok = chance(weak ? 0.62 : clamp(k.acc + 0.1, 0.5, 0.99)), slow = chance(weak ? 0.35 : 0.07);
    if (ok) right++;
    const [x, y] = [Math.min(a, b), Math.max(a, b)];
    if (n < 10) OUT.attempts.push([si, T(n, m + i * 0.05), 'sprint', 'times-tables', `${x}x${y}`, 'fact', ok ? 1 : 0, 1, slow ? 1 : 0, ok ? null : String(a * b + pick([-a, a, -1, 1, 10])), ok ? null : String(a * b), null, null, slow ? ri(6500, 11000) : ri(1400, 5000), a, b, false]);
    if (weak && (!ok || slow)) {
      const tbl = (k.weak || []).find(w => w === a || w === b), dl = (S.drillLog[`times:${tbl}`] ||= { miss: 0, slow: 0, sprint: 0, popups: 0, missesAfter: 0 });
      dl[ok ? 'slow' : 'miss']++; dl.popups++; if (dl.popups > 3 && !ok) dl.missesAfter++;
      if (dl.missesAfter >= 4 && !dl.reteach) { dl.reteach = true; dl.reteachAt = T(n, m); }
      if (chance(0.6)) OUT.popups.push([si, T(n, m + i * 0.05 + 0.02), tbl, ok ? 'slow' : 'miss', 'times', String(tbl)]);
    }
  }
  OUT.sprints.push([si, T(n, m + 1.1), right]);
  ev(m + 1.1, { k: 'sprint', s: right, skills: ['times'] });
  return right;
}
/* English, History or Biology: the next practice set, quiz or unit test in the course, with real question ids */
function lessonStep(S, k, n, m, state, ev, acc) {
  const c = state.course || state.lastCourse, course = COURSES[c], f = FINAL[c], store = S[f.store], reviewing = !state.course;   // a finished unit: review
  state.lastCourse = c;
  const rec = key => store[key] || {};
  const nextSkill = course.skills.find(s => !rec(s.id).passed);
  const groupDue = !f.noQuiz && course.groups.find(g => g.skills.every(sk => rec(sk).passed) && !rec(quizKey(c, g.id)).passed);
  let kind, key, title, qs;
  const passedSkills = course.skills.filter(s => rec(s.id).passed);
  if (passedSkills.length && (reviewing || chance(0.4))) {   // reviewing a skill she already passed
    const s = pick(passedSkills); kind = 'practice'; key = s.id; title = s.name;
    qs = Array.from({ length: 4 }, () => [s.id, pick(questions(c, s.id))]);
  } else if (nextSkill && !(groupDue && chance(0.7))) {
    kind = 'practice'; key = nextSkill.id; title = nextSkill.name;
    qs = Array.from({ length: 4 }, () => [nextSkill.id, pick(questions(c, nextSkill.id))]);
  } else if (groupDue) {
    kind = 'quiz'; key = quizKey(c, groupDue.id); title = groupDue.quizName || `${groupDue.name} Quiz`;
    qs = Array.from({ length: 4 }, (_, i) => { const sk = groupDue.skills[i % groupDue.skills.length]; return [sk, pick(questions(c, sk))]; });
  } else {
    kind = 'final'; key = f.key; title = `${course.title} Test`;
    qs = Array.from({ length: f.n }, (_, i) => { const sk = course.skills[i % course.skills.length].id; return [sk, pick(questions(c, sk))]; });
  }
  const p = clamp(acc + (kind === 'practice' ? 0.02 * (rec(key).tries || 0) : 0.03), 0.35, 0.98);
  let score = 0;
  for (const [sk, q] of qs) {
    const ok = chance(q.difficulty >= 3 ? p - 0.12 : p); if (ok) score++;
    const st = S.questionStats[q.id] || [0, 0]; S.questionStats[q.id] = [st[0] + 1, st[1] + (ok ? 0 : 1)];
    const r = store[sk] || {}; store[sk] = { ...r, answered: (r.answered || 0) + 1, misses: (r.misses || 0) + (ok ? 0 : 1), recentAnswers: [...(r.recentAnswers || []), ok ? 1 : 0].slice(-12) };
  }
  const passMark = kind === 'final' ? f.pass : 3, passed = score >= passMark, prev = store[key] || {}, first = passed && !prev.passed;
  store[key] = { ...prev, best: Math.max(prev.best || 0, score), tries: (prev.tries || 0) + 1, passed: !!prev.passed || passed, recentScores: [...(prev.recentScores || []), score].slice(-10), lastScore: score, questionCount: qs.length, ...(passed ? { lastPassAt: T(n, m + qs.length) } : {}) };
  ev(m + qs.length * 0.9, { k: 'course', course: c, title, kind, s: score, n: qs.length, passed, ...(first && kind === 'practice' ? { first: true } : {}) });
  if (kind === 'final' && passed && !reviewing) {
    const order = f.subject === 'english' ? ENGLISH_ORDER : f.subject === 'history' ? HISTORY_ORDER : [];
    const next = order[order.indexOf(c) + 1];
    state.finished = [...(state.finished || []), c];
    state.course = next && FINAL[next] && !state.stopAfter?.includes(c) ? next : null;
  }
  return Math.round(qs.length * (kind === 'practice' ? ri(75, 115) : ri(55, 75)) + ri(20, 60));
}
/* a unit finished before the six weeks: every skill, quiz and the unit test passed */
function passCourseBefore(S, c, at) {
  const course = COURSES[c], f = FINAL[c], store = S[f.store];
  for (const s of course.skills) store[s.id] = { answered: ri(6, 12), misses: ri(0, 3), recentAnswers: [1, 1, 0, 1, 1, 1], best: 4, tries: ri(1, 3), passed: true, recentScores: [3, 4], lastScore: 4, questionCount: 4, lastPassAt: at };
  if (!f.noQuiz) for (const g of course.groups) store[quizKey(c, g.id)] = { best: ri(3, 4), tries: 1, passed: true, recentScores: [4], lastScore: 4, questionCount: 4, lastPassAt: at };
  const score = ri(f.pass, f.n);
  store[f.key] = { best: score, tries: 1, passed: true, recentScores: [score], lastScore: score, questionCount: f.n, lastPassAt: at };
}

/* the Ledger's copy of a day (game.js dayEntry) */
function ledgerEntry(day, subj, log, plan) {
  const total = Object.values(subj).reduce((a, b) => a + b, 0);
  const events = log ? log.events.map(e => ({ ...e, text: eventText(e) })) : [];
  const passed = events.filter(e => e.passed && (e.k === 'assess' || (e.k === 'course' && (e.kind === 'quiz' || e.kind === 'final'))))
    .map(e => ({ text: e.k === 'assess' ? stationLabel(e.shop, e.station, e.mode) : `${COURSES[e.course].title}: ${e.title}`, s: e.s, n: e.n, test: e.k === 'assess' ? e.mode === 'test' : e.kind === 'final' }));
  const mastered = [...new Set(events.filter(e => e.k === 'mastered' || (e.k === 'course' && e.first)).map(e => (e.k === 'mastered' ? `➗ ${e.title}` : `${COURSES[e.course].title}: ${e.title}`)))];
  const timeOf = { math: 'math', english: 'english', history: 'history', biology: 'science' };
  return {
    v: 1, day, totalSecs: total, subjects: subj,
    lessons: log ? Object.entries(log.places).filter(([, s]) => s >= 30).sort((a, b) => b[1] - a[1]).map(([key, secs]) => ({ key, label: log.labels[key], secs })) : [],
    orders: log ? Object.entries(log.counts).map(([key, c]) => { const [, shop, st] = key.split(':'); return { key, label: stationLabel(shop, +st), n: c.n, ok: c.ok }; }) : [],
    events, passed, mastered,
    plan: plan.map(([s, mins]) => ({ label: `${{ math: '➗ Math', english: '📚 English', history: '🏛️ History', biology: '🦁 Biology' }[s]}: ${mins} min`, status: (subj[timeOf[s]] || 0) >= mins * 60 ? 'done' : 'todo' })),
    extras: [], goals: [{ subject: 'reading', label: '📖 Reading', done: Math.floor((subj.reading || 0) / 60), goal: 15 }]
  };
}
function eventText(e) {
  const score = e.n ? ` · ${e.s} of ${e.n}` : e.s != null ? ` · ${e.s} right` : '';
  if (e.k === 'assess') return `${stationLabel(e.shop, e.station, e.mode)}${score}${e.passed ? ' ✅ passed' : ''}`;
  if (e.k === 'sprint') return `⚡ Fact Sprint (Times tables)${score}`;
  if (e.k === 'vocab') return `🔤 Practice cards${score}`;
  if (e.k === 'course') return `📚 ${COURSES[e.course].title}: ${e.title} (${{ practice: 'practice', quiz: 'quiz' }[e.kind] || 'unit test'})${score}${e.passed ? ' ✅' : ''}`;
  if (e.k === 'mastered') return `⭐ Mastered: ${e.title}`;
  if (e.k === 'brain') return `🧠 ${e.title} · ${e.detail}`;
  if (e.k === 'move') return `🤸 ${e.title} · ${e.detail}`;
  if (e.k === 'done') return `✅ Finished: ${e.title}`;
  if (e.k === 'theme') return `🎉 Theme day: ${e.title}`;
  if (e.k === 'outside') return `📎 Outside work: ${e.title}`;
  if (e.k === 'project') return `📁 Sent: ${e.title}`;
  if (e.k === 'reading') return `📖 Sent Reading Log notes: ${e.title}`;
  return e.title || e.k;
}

/* a quiz still in review: the student's last quiz, the school day before, missed two skills */
function inReview(S, si, shop, n) {
  const st = Math.max(1, ...Object.keys(S.stationsOpenedBefore[shop] ? Object.fromEntries(S.stationsOpenedBefore[shop].map(x => [x, 1])) : { 1: 1 }).map(Number));
  const skills = stations(shop).find(s => s.id === st)?.skills || [];
  if (skills.length < 2) return;
  const missed = skills.slice(0, 2), key = `${shop}:${st}`, prev = S.quizzes[key] || {};
  if (prev.passed) return;
  S.quizzes[key] = { passed: false, best: Math.max(prev.best || 0, 60), tries: (prev.tries || 0) + 1, lastAt: T(n, 10 * 60 + 5) };
  S.review[key] = Object.fromEntries(missed.map(sk => [sk, 2]));
  OUT.assessments.push([si, T(n, 10 * 60 + 5), shop, st, 'quiz', 6, 10, 0, missed]);
  const log = S.dayLog[D(n)]; if (log) log.events.push({ t: T(n, 10 * 60 + 5), k: 'assess', shop, station: st, mode: 'quiz', s: 6, n: 10, passed: false });
}
/* ---------- run it ---------- */
const states = KIDS.map((k, si) => { CUR = si; const s = simulate(k, si); for (const d of Object.values(s.dayLog)) d.events = d.events.map(e => ({ ...e, text: eventText(e) })); return s; });
const kid = name => KIDS.findIndex(k => k.n === name);
for (const name of ['Theo B.', 'Eli M.']) { const i = kid(name); const n = Object.keys(states[i].dayLog).map(d => +d.slice(2)).filter(x => x > 0).sort((a, b) => a - b)[0]; if (n) inReview(states[i], i, 'cafe', n); }
const S = name => states[kid(name)];
const overrides = KIDS.map(() => ({}));

/* plans and goals for every student */
KIDS.forEach((k, i) => {
  const items = [{ id: 'p-math', kind: 'subject', subject: 'math', minutes: 30 }, { id: 'p-eng', kind: 'subject', subject: 'english', minutes: 20 }];
  if (k.history) items.push({ id: 'p-hist', kind: 'subject', subject: 'history', minutes: 15 });
  if (k.science) items.push({ id: 'p-bio', kind: 'subject', subject: 'biology', minutes: 15 });
  overrides[i].plan = { week: Object.fromEntries(['mon', 'tue', 'wed', 'thu', 'fri'].map(d => [d, items])), days: {} };
  overrides[i].subjectGoals = { base: { reading: 15 }, days: {} };
  overrides[i].transcript = { school: 'Pet World Demo Academy', years: [{ id: 'y1', name: '@SYNAME', from: '@SY0', to: '@SY1', level: k.n === 'Leo D.' ? '5th grade' : '6th grade' }] };
});
overrides[kid('Ava W.')].courses = { w: { test: 0.5, quiz: 0.3, daily: 0.2 }, c: {}, add: [{ id: 'add-pe', name: 'Physical Education', hours: 24, grade: 'A' }] };

/* written answers: some waiting, some scored by the teacher, one sent back */
const typed = (course, skill) => (TYPED_QUESTIONS[course]?.[skill] || []).find(q => q.type === 'short');
const WRITTEN = [
  ['Maya R.', 'pronouns', 'reflexivePronoun', 3, 'It should be "Dad and I went fishing." Myself is reflexive, so it only works when I already said I or me earlier in the sentence, like "I made myself a sandwich."', 'scored', '11', 'Great explanation, and a perfect example.'],
  ['Maya R.', 'pronouns', 'pronounCase', 1, 'Me is an object pronoun, but in this sentence it is part of the subject. So it should be "Theo and I built a fort." A trick is to take out Theo: "I built a fort" sounds right.', null],
  ['Jonah K.', 'verbs', 'irregularVerbs', 4, 'bring is irregular so you dont add ed. it should be I brought my lunch.', 'scored', '11', ''],
  ['Jonah K.', 'verbs', 'perfectAspect', 0, 'I ate lunch is just in the past. I have eaten lunch means I ate it and it still matters now, like I am not hungry.', null],
  ['Priya S.', 'verbs', 'modalVerbs', 6, '"You can go" means you are allowed to go if you want. "You must go" means you have to go and you do not get a choice. Must is stronger.', 'parent'],
  ['Eli M.', 'nouns', 'singularPlural', 2, 'you add es when it ends in s', 'redo', '01', 'Good start! Which other endings need -es? Add two examples, like box and wish.'],
  ['Sofia L.', 'nouns', 'concreteAbstract', 1, 'My dog gave me so much happiness. Dog is concrete because you can touch it. Happiness is abstract because it is a feeling.', null],
  ['Theo B.', 'pronouns', 'questionWord', 5, 'whos means who is and whose is for owning something. Whos at the door? Whose shoes are these?', null],
  ['Ava W.', 'modifiers', 'adjectiveOrder', 2, 'Size comes before color in English, so it should be "a big red balloon." Opinion, size, age, shape, color, origin, material, purpose.', 'scored', '11', 'Nice: you even listed the full order.'],
  ['Ava W.', 'modifiers', 'commasAdjectives', 0, 'If you can switch the adjectives and put "and" between them, use a comma: "a cold, rainy day." If you cannot, no comma: "a little red wagon."', null]
];
WRITTEN.forEach(([name, course, skill, n, text, how, bits, comment], i) => {
  const q = typed(course, skill); if (!q) throw new Error(`no short question ${course}/${skill}`);
  const at = T(n, 10 * 60 + 20 + i), id = `wdemo${i}`;
  const entry = { id, qid: `${course}:${skill}:short`, courseId: course, skillId: skill, type: 'short', prompt: q.prompt, rubric: (q.rubric || []).slice(0, 4), model: q.model || '', text, at, where: 'practice' };
  if (how === 'parent') entry.parentReview = { points: (q.rubric || []).map(() => 1), comment: 'Nice job!', redo: false, at: T(n, 15 * 60) };
  S(name).writtenAnswers.push(entry);
  if (how === 'scored' || how === 'redo') overrides[kid(name)][`written:${id}`] = `scored:${at}:${bits.slice(0, (q.rubric || []).length || 1).padEnd((q.rubric || []).length, '1')}:${how === 'redo' ? 1 : 0}:${comment}`;
});

/* projects: one waiting, one verified, one being revised */
const project = (name, store, id, answers, n, verdict) => {
  const at = T(n, 13 * 60);
  S(name)[store][id] = { answers, status: 'submitted', submittedAt: at, localReview: '', updatedAt: at };
  if (verdict) overrides[kid(name)][`project:${id}`] = `${verdict}:${at}`;
  const log = S(name).dayLog[D(n)]; if (log) log.events.push({ t: at, k: 'project', course: id, title: id === 'bio1lab' ? 'Experiment: Germination Lab' : 'Source Investigator Project', text: `📁 Sent: ${id === 'bio1lab' ? 'Experiment: Germination Lab' : 'Source Investigator Project'}` });
};
project('Theo B.', 'historyProjects', 'history', {
  source: 'A photo of my grandpa\'s fire truck from 1978. My grandma took it at the town parade to show his new job.',
  perspective: 'It shows my grandpa\'s side because he was proud of the truck. It doesn\'t show what the other firefighters or the people watching thought.',
  claim: 'Our town cared a lot about the fire department in 1978. Evidence: there are lots of people on the sidewalk watching, and the truck has flags and ribbons on it.',
  frame: 'Communities. If I look at it as a community story it is about how the whole town came out, not just about my grandpa.' }, 2, null);
project('Ava W.', 'historyProjects', 'history', {
  source: 'My great-aunt\'s diary from 1962, when she moved from Ohio to Arizona. She wrote it for herself, every night of the drive.',
  perspective: 'It shows her side as a 14-year-old. My great-grandparents\' worries about money and jobs are missing because she didn\'t know about them.',
  claim: 'Moving west was exciting but hard on kids. She writes "I miss Jeanie already" three times and complains about the heat almost every day.',
  frame: 'Networks: she mentions writing letters back home every week, so the move kept her connected to two places at once.' }, 12, 'verified');
project('Priya S.', 'scienceProjects', 'bio1lab', {
  question: 'Does the temperature of water affect how fast bean seeds sprout? If I use warm water, then the seeds will sprout faster, because warmth speeds up the seed waking up.',
  variables: 'I change the water temperature (cold, room, warm). I measure the days until a root shows. I keep the same: kind of bean, amount of water, paper towel, and the same windowsill.',
  procedure: '1. Wet 3 paper towels with cold, room, and warm water. 2. Put 5 beans in each and fold. 3. Put each in a zip bag on the windowsill. 4. Check every morning for 7 days.',
  data: 'Cold: day 6 (2 of 5 sprouted). Room: day 4 (4 of 5). Warm: day 3 (5 of 5).',
  conclusion: 'Warm water sprouted fastest, so my hypothesis was supported. One error is the windowsill was colder at night. Next time I would use a heat mat to keep it the same.',
  connection: 'Seeds in nature sprout in spring when the ground warms up, so they don\'t start growing when it is still too cold.' }, 1, null);

/* reading logs */
const CHAPTER_NOTES = {
  'Hatchet': [['Chapter 1', 'Brian, the pilot', 'The pilot has a heart attack while Brian is flying alone with him.', 'Brian has to figure out how to land the plane by himself.'], ['Chapter 2', 'Brian', 'Brian uses the radio to call for help but the signal fades.', 'Brian vs. nature and his own fear.'], ['Chapter 3', 'Brian', 'The plane crashes into a lake and Brian swims to shore.', 'Will he survive with only a hatchet?']],
  'The Wild Robot': [['Chapters 1–5', 'Roz, the otters', 'Roz turns on for the first time on the island after the storm.', 'Roz doesn\'t know where she is or what she is for.'], ['Chapters 6–10', 'Roz, the bear', 'Roz watches the animals to learn how they survive.', 'The animals think she is a monster.']],
  'Wonder': [['Part 1: Ordinary', 'Auggie, Mom, Dad, Via', 'Auggie finds out he is going to go to a real school for the first time.', 'He is scared kids will stare at his face.'], ['Part 1: Jack Will', 'Auggie, Jack, Julian', 'Auggie meets Jack, Julian, and Charlotte on the school tour.', 'Julian is mean about his face.'], ['Part 2: Via', 'Via, Auggie, Miranda', 'Via tells what it is like to be Auggie\'s big sister.', 'Via feels nobody notices her.']],
  'Because of Winn-Dixie': [['Chapters 1–3', 'Opal, Winn-Dixie, the preacher', 'Opal finds a messy dog in the grocery store and names him Winn-Dixie.', 'She has to convince her dad to let her keep him.']],
  'Holes': [['Part 1, chapters 1–5', 'Stanley, Mr. Sir', 'Stanley gets sent to Camp Green Lake for stealing shoes he didn\'t steal.', 'The camp is a dry lake and the boys dig holes all day.'], ['Part 1, chapters 6–12', 'Stanley, X-Ray, Zero', 'We learn about Stanley\'s great-great-grandfather and the curse.', 'Stanley has to get along with the other boys.'], ['Part 1, chapters 13–18', 'Stanley, the Warden', 'Stanley finds a gold tube with the letters KB and gives it to X-Ray.', 'The Warden makes everyone dig in that spot.']]
};
KIDS.forEach((k, i) => {
  if (!k.reading) return;
  const [title, author] = k.reading.split('|'), notes = CHAPTER_NOTES[title];
  const chapters = notes.map(([label, characters, notableAction, conflict], j) => {
    const n = 20 - j * 6 - (j === notes.length - 1 ? 0 : 0), at = T(Math.max(1, n), 14 * 60 + j);
    const waiting = j === notes.length - 1;
    return { id: `ch${j + 1}`, label, characters, notableAction, interaction: '', conflict, joy: j === 0 ? 'I liked how it started right away with something big happening.' : '', setting: '', themes: j === 0 ? 'Being brave when you are scared.' : '', detail: '', vocabulary: '', submittedAt: at, localReview: waiting ? '' : 'verified', updatedAt: at };
  });
  states[i].readingBooks = [{ id: `book-${i}`, title, author, chapters, quizzes: k.n === 'Ava W.' ? [{ id: 'rq1', at: T(3, 14 * 60), chapterIds: ['ch1', 'ch2'], chapterLabels: chapters.slice(0, 2).map(c => c.label), score: 7, total: 8, missed: ['Who gave Stanley the nickname Caveman?'], essays: [{ prompt: 'How is Stanley different at Camp Green Lake than he was at home? Use one example.', answer: 'At home Stanley didn\'t have friends and kids picked on him. At camp he starts to fit in, like when the boys call him Caveman and he gets a place in line. He is still shy but he is getting stronger from digging.' }], submittedAt: T(3, 14 * 60 + 9), localReview: '' }] : [] }];
  const n = 20 - (notes.length - 1) * 6; const log = states[i].dayLog[D(Math.max(1, n))];
  if (log) log.events.push({ t: T(Math.max(1, n), 14 * 60), k: 'reading', title: notes[notes.length - 1][0], text: `📖 Sent Reading Log notes: ${notes[notes.length - 1][0]}` });
});

const tokKey = t => (typeof t === 'string' && t.startsWith('@M') ? -(+t.slice(2)) : t);
/* spelling: each student's usual kinds of misspelling in Word Workshop (for the teacher's ✏️ Spelling patterns card),
   their word levels, and for Eli the words a teacher already picked to practice */
const SPELL_HABITS = {
  'Eli M.': { level: 1, n: 14, habits: ['prePer', 'double', 'missing'] },
  'Priya S.': { level: 2, n: 9, habits: ['double', 'antEnt'] },
  'Theo B.': { level: 1, n: 10, habits: ['prePer', 'schwa'] },
  'Jonah K.': { level: 2, n: 7, habits: ['tionSion', 'softC', 'ieEi'] },
  'Sofia L.': { level: 2, n: 8, habits: ['antEnt', 'missing'] },
  'Leo D.': { level: 1, n: 6, habits: ['swap', 'double', 'missing'] },
  'Maya R.': { level: 3, n: 2, habits: ['schwa'] },
  'Ava W.': { level: 3, n: 3, habits: ['schwa', 'double'] }
};
/* real misspellings kids make, by pattern (each one checked against spellingPatterns below) */
const MISSPELLINGS = {
  prePer: [['predict', 'perdict'], ['perform', 'preform'], ['perspective', 'prespective'], ['protect', 'pertect'], ['persistent', 'presistent'], ['predator', 'perdator'], ['precise', 'percise']],
  double: [['accurate', 'acurate'], ['summarize', 'sumarize'], ['approximate', 'aproximate'], ['immense', 'imense'], ['accomplish', 'acomplish'], ['essential', 'esential'], ['pattern', 'patern'], ['eventually', 'eventualy'], ['habitat', 'habbitat']],
  antEnt: [['relevant', 'relevent'], ['persistent', 'persistant'], ['abundant', 'abundent'], ['confident', 'confidant'], ['significant', 'significent'], ['consequence', 'consequance'], ['influence', 'influance'], ['evidence', 'evidance']],
  tionSion: [['conclusion', 'conclution'], ['tradition', 'tradision'], ['migration', 'migrasion'], ['civilization', 'civilizasion']],
  softC: [['precise', 'presise'], ['century', 'sentury'], ['calculate', 'kalculate'], ['civilization', 'sivilization'], ['sequence', 'sequense']],
  schwa: [['boundary', 'boundery'], ['predator', 'predetor'], ['compromise', 'compremise'], ['organism', 'orgenism'], ['demonstrate', 'demenstrate'], ['estimate', 'estamate'], ['relevant', 'relivant']],
  missing: [['environment', 'enviroment'], ['investigate', 'investgate'], ['responsible', 'responsble'], ['eventually', 'eventully'], ['significant', 'signifcant'], ['generous', 'genrous']],
  swap: [['analyze', 'anaylze'], ['interpret', 'intrepret'], ['require', 'reqiure']],
  ieEi: [['ancient', 'anceint'], ['patient', 'pateint'], ['nutrient', 'nutreint']]
};
for (const [habit, list] of Object.entries(MISSPELLINGS)) for (const [w, typed] of list) if (!spellingPatterns(w, typed).includes(habit)) throw new Error(`${typed} for ${w} is not ${habit}: ${spellingPatterns(w, typed)}`);
KIDS.forEach((k, i) => {
  const h = SPELL_HABITS[k.n], st = states[i]; if (!h) return;
  st.vocab.level = { spell: h.level, cards: Math.min(3, h.level + 1) };
  const days = Object.keys(st.dayLog).map(d => +d.slice(2)).sort((a, b) => a - b), out = [];
  for (let tries = 0; out.length < h.n && tries < 400; tries++) {
    const habit = h.habits[tries % h.habits.length], [word, typed] = pick(MISSPELLINGS[habit]);
    if (out.some(m => m.w === word) && tries < 200) continue;   // mostly different words; a repeat now and then is real
    const kinds = spellingPatterns(word, typed);
    const n = pick(days.length ? days : [1]);
    out.push({ w: word, typed, kinds, t: T(n, 10 * 60 + ri(0, 50)) });
  }
  st.vocab.mistakes = out.sort((a, b) => (tokKey(a.t) < tokKey(b.t) ? -1 : 1));
});
overrides[kid('Eli M.')].spellFocus = JSON.stringify(['predict', 'perform', 'prepare', 'prevent', 'perhaps', 'accurate', 'necessary', 'tomorrow']);

/* a theme day Maya earned, and Khan results for the units some students finished */
{ const log = S('Maya R.').dayLog[D(4)]; if (log) log.events.unshift({ t: T(4, 8 * 60 + 35), k: 'theme', title: '🛌 Pajama Day', text: '🎉 Theme day: 🛌 Pajama Day' }); }
KIDS.forEach((k, i) => {
  const st = states[i], res = {};
  for (const c of ['nouns', 'verbs', 'pronouns']) {
    const fin = st.elaProgress[FINAL[c].key];
    if (!fin?.passed) continue;
    const groups = COURSES[c].groups.map(g => `${c}:${g.id}`), miss = k.eng < 0.85 ? [pick(groups)] : [];
    res[c] = { date: '@D' + ri(1, 12), score: ri(miss.length ? 70 : 85, miss.length ? 79 : 100), missed: miss, cleared: [] };
  }
  if (Object.keys(res).length) OUT.khan[`@S${i}`] = res;
});

/* outside work: some a teacher added earlier, some she added herself, with photos */
const PHOTO_DATA = Object.fromEntries(['worksheet', 'science', 'piano'].map(p => [p, `data:image/jpeg;base64,${fs.readFileSync(new URL(`../supabase/demo/photo-${p}.jpg`, import.meta.url)).toString('base64')}`]));
const PHOTOS = Object.fromEntries(Object.keys(PHOTO_DATA).map(p => [p, p]));   // rows name the photo; demo_reset puts the picture in
const outside = (name, n, course, title, minutes, grade, source, review, note, images = []) => OUT.outside.push([kid(name), D(n), course, title, minutes, grade, '', source, review, note, images]);
for (const n of [22, 17, 12, 7, 2]) outside('Maya R.', n, 'Piano', 'Lesson with Mrs. Ortiz', 45, '', 'teacher', '', '');
outside('Maya R.', 0, 'Piano', 'Practiced recital piece: Für Elise, first page', 30, '', 'student', 'waiting', '', [PHOTOS.piano]);
for (const n of [24, 19, 14, 9, 4]) outside('Jonah K.', n, 'Spanish', 'Duolingo + workbook unit ' + (6 - Math.round(n / 5)), 30, n < 10 ? '92' : '88', 'teacher', '', '');
outside('Jonah K.', 1, 'Spanish', 'Workbook page 34: food words', 25, '95', 'student', 'ok', '');
for (const n of [21, 16, 11, 6]) outside('Sofia L.', n, 'Science Co-op', 'Co-op class: ' + pick(['rocks and minerals', 'weather station', 'simple machines', 'the water cycle']), 90, pick(['A', 'A-', 'B+']), 'teacher', '', '');
outside('Sofia L.', 1, 'Science Co-op', 'Rock sorting chart for co-op', 40, 'A', 'student', 'waiting', '', [PHOTOS.science, PHOTOS.worksheet]);
outside('Sofia L.', 3, 'Math workbook', 'Pages 52–53: decimals', 25, '', 'student', 'redo', 'Page 53 is missing. Take a photo of both pages and send it again.', [PHOTOS.worksheet]);
outside('Eli M.', 5, 'Handwriting', 'Cursive practice: letters a–f', 15, '', 'teacher', '', '');
outside('Eli M.', 1, 'Times tables', 'Flash cards with Dad: 7s and 8s', 15, '', 'student', 'waiting', '');
outside('Ava W.', 2, 'Art', 'Watercolor class at the library', 60, 'A', 'teacher', '', '');
for (const [name, list] of [['Maya R.', [[0, 'Piano: Practiced recital piece: Für Elise, first page · 30 min, 1 photo', 30]]], ['Sofia L.', [[1, 'Science Co-op: Rock sorting chart for co-op · 40 min, 2 photos', 40], [3, 'Math workbook: Pages 52–53: decimals · 25 min, 1 photo', 25]]], ['Eli M.', [[1, 'Times tables: Flash cards with Dad: 7s and 8s · 15 min', 15]]], ['Jonah K.', [[1, 'Spanish: Workbook page 34: food words · 25 min', 25]]]]) {
  for (const [n, title, minutes] of list) { const log = S(name).dayLog[D(n)]; if (log) log.events.push({ t: n === 0 ? '@M50' : T(n, 15 * 60 + 30), k: 'outside', title, minutes, text: `📎 Outside work: ${title}` }); }
}

/* one Ledger day a teacher changed: a note added to Eli's day, with his version kept */
{ const row = OUT.ledgerDays.find(r => r[0] === kid('Eli M.') && r[1] === D(6)) || OUT.ledgerDays.find(r => r[0] === kid('Eli M.'));
  if (row) { const original = JSON.parse(JSON.stringify(row[2])); row[2].events.push({ t: row[3], k: 'note', text: '📝 Did 20 more minutes of times tables on paper with me after lunch.' }); row[2].original = original; row[4] = true; } }

/* sort each day's events by time (tokens sort the same as the times they stand for, within one day) */
for (const st of states) for (const d of Object.values(st.dayLog)) d.events.sort((a, b) => (tokKey(a.t) < tokKey(b.t) ? -1 : tokKey(a.t) > tokKey(b.t) ? 1 : 0));

KIDS.forEach((k, i) => OUT.students.push([k.n, overrides[i]]));
OUT.saves = states;

const data = {
  className: 'Demo Class: Room 6',
  game_settings: { brain: { enabled: true }, move: { enabled: true, minutes: 10 }, themes: { enabled: true, when: 'earned', special: true }, khan: true },
  khan_results: { passScore: 80, students: OUT.khan }, photos: PHOTO_DATA,
  students: OUT.students, saves: OUT.saves,
  problems: OUT.problems, attempts: OUT.attempts, assessments: OUT.assessments, sprints: OUT.sprints, popups: OUT.popups,
  sessions: OUT.sessions, ledgerDays: OUT.ledgerDays, outside: OUT.outside
};
const json = JSON.stringify(data);
/* The Supabase SQL editor refuses big queries, so the data goes in as numbered parts of about 180 KB each: the
   functions file first, then each part, then demo_reset() puts the parts back together. */
const PART_BYTES = 180 * 1024, dollar = '$demo$', parts = [];
if (json.includes(dollar)) throw new Error('data contains the dollar quote');
for (let i = 0; i < json.length;) {
  let j = i, bytes = 0;
  while (j < json.length && bytes < PART_BYTES) { const c = json.charCodeAt(j); bytes += c < 0x80 ? 1 : c < 0x800 ? 2 : c >= 0xD800 && c <= 0xDBFF ? 4 : c >= 0xDC00 && c <= 0xDFFF ? 0 : 3; j++; }
  if (j < json.length && json.charCodeAt(j - 1) >= 0xD800 && json.charCodeAt(j - 1) <= 0xDBFF) j++;   // never split an emoji
  parts.push(json.slice(i, j)); i = j;
}
const demoDir = new URL('../supabase/demo/', import.meta.url);
for (const f of fs.readdirSync(demoDir)) if (/^demo-(class|\d+-data)\.sql$/.test(f)) fs.unlinkSync(new URL(f, demoDir));
parts.forEach((txt, k) => fs.writeFileSync(new URL(`demo-${k + 1}-data.sql`, demoDir),
  `-- Pet World demo data, part ${k + 1} of ${parts.length} (made by scripts/make-demo.mjs; docs/DEMO.md)\n` +
  `-- Run demo-0-functions.sql first, then every part, then: select public.demo_reset('demo@petworld.example');\n` +
  `insert into public.demo_seed_part (n, total, txt) values (${k + 1}, ${parts.length}, ${dollar}${txt}${dollar})\n` +
  `on conflict (n) do update set total = excluded.total, txt = excluded.txt;\n`));
console.log(`supabase/demo: demo-0-functions.sql + ${parts.length} data parts (${(json.length / 1024).toFixed(0)} KB of data)`);
const count = Object.fromEntries(Object.entries(OUT).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, v.length]));
console.log("rows:", JSON.stringify(count));
for (const [i, st] of states.entries()) console.log(KIDS[i].n.padEnd(9), 'math', Object.entries(st.quizzes).filter(([, q]) => q.passed).map(([k]) => k).join(' '), '| english', Object.entries(st.elaProgress).filter(([k, v]) => /final-test/.test(k) && v.passed).map(([k]) => k).join(' '), '| days', Object.keys(st.subjectTime).length);
