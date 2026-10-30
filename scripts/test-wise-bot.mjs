#!/usr/bin/env node
/* Test-wise bot (docs/BLIND-REVIEW.md, owner rule Oct 30, 2026): can a student who does NOT know the content pass a
   unit's quizzes or unit test by reading the answer choices, by memorizing answer text, or by retrying?

     node scripts/test-wise-bot.mjs [--courses sentences,style,bio5] [--attempts 1500] [--json out.json] [--items]

   Run it from the repo root. --courses takes course ids from LESSON_COURSES (default: every course); --items prints, for
   each fixed multiple-choice item, which simple cue picks its key (no simulation). Exit code 1 when any unit fails.

   It loads the repo's own question modules (questionBanks.js, questionTypes.js, typedQuestions.js, genetics.js) from a
   temp copy (questionIds.ts loses its type annotations so plain Node can import it) and copies the game's selection code
   from src/game/game.js:
     shuffle (Fisher-Yates on Math.random), englishBankQuestions (bank choices shuffled per call), typedAutoQuestions
     (typedQuestions(...).filter(!isWritten).map(shuffledCopy)), geneticsQuestions (fresh every call), practiceOrder,
     leanHard, englishAssessmentQuestions (quizzes and the 8-question test review), the unit test
     (shuffle(skills.flatMap(s => leanHard(pool(s, test)).slice(0, testPer)))), testOnlyIds (questions kept for the unit
     test), and order items that start shuffled. Math.random is a seeded mulberry32, so runs repeat.
   Each strategy returns, for one shown question, the chance it is marked right (ties split at random); expected score and
   pass chance come from a Poisson-binomial over the questions actually drawn.

   FAIL rule (owner): a strategy fails a unit when, on any quiz or the unit test, it scores within 15 points of the pass
   mark, or more than 10 points above chance (random guessing). The memorizer is judged on the pass mark only: it
   remembers the right answers it was shown, which is some learning, so it is allowed to beat chance. */
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2), opt = name => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : null; };
const REPO = resolve(opt('repo') || process.cwd());
const ATTEMPTS = +(opt('attempts') || 1500);
const JSON_OUT = opt('json');
const ITEMS_ONLY = args.includes('--items');

/* ---------- seeded Math.random (the game and genetics.js both read Math.random) ---------- */
const mulberry32 = a => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
Math.random = mulberry32(20261030);

/* ---------- load the repo modules ---------- */
const tmp = mkdtempSync(join(tmpdir(), 'test-wise-bot-'));
const src = p => readFileSync(join(REPO, p), 'utf8');
const fixImports = text => text.replace(/from '\.\/questionIds'/g, "from './questionIds.mjs'");
writeFileSync(join(tmp, 'questionIds.mjs'), src('src/shared/questionIds.ts')
  .replace(/\(text: string\)/g, '(text)').replace(/: string(?=[,)])/g, '').replace(/\): string \{/g, ') {'));
writeFileSync(join(tmp, 'questionBanks.mjs'), fixImports(src('src/shared/questionBanks.js')));
writeFileSync(join(tmp, 'questionTypes.mjs'), fixImports(src('src/shared/questionTypes.js')));
writeFileSync(join(tmp, 'typedQuestions.mjs'), src('src/shared/typedQuestions.js'));
writeFileSync(join(tmp, 'genetics.mjs'), src('src/shared/genetics.js'));
const load = name => import(pathToFileURL(join(tmp, name)).href);
const QB = await load('questionBanks.mjs');
const QT = await load('questionTypes.mjs');
const TQ = await load('typedQuestions.mjs');
const G = await load('genetics.mjs');
rmSync(tmp, { recursive: true, force: true });
const GAME = src('src/game/game.js');
/* the unit's settings from englishCourse() in game.js */
const courseSettings = id => {
  const m = new RegExp(`\\{id:'${id}',[^\\n]*?testPer:(\\d+),finalPass:(\\d+)([^\\n]*)`).exec(GAME);
  return m ? { testPer: +m[1], finalPass: +m[2], noQuizzes: /noQuizzes:true/.test(m[3]) } : null;
};
const GENERATED = new Set([...GAME.matchAll(/courseId === '(\w+)' \? geneticsQuestions/g)].map(m => m[1]));
const TEST_HIDES_KEY = /retryType === 'final' && !correct/.test(GAME);   // the unit test doesn't show the right answer after a miss
const testOnlyIds = QT.testOnlyIds || (() => new Set());                // questions kept for the unit test (none in older versions)

/* ---------- the game's selection code (copied) ---------- */
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const questionLevel = q => q.difficulty || 1;
const practiceOrder = (pool, count) => shuffle(pool).slice(0, count).sort((a, b) => questionLevel(a) - questionLevel(b));
const LEVEL_WEIGHT = { 1: 1, 2: 3, 3: 5 };
const leanHard = pool => pool.map(question => ({ question, key: Math.random() ** (1 / (LEVEL_WEIGHT[questionLevel(question)] || 1)) })).sort((a, b) => b.key - a.key).map(x => x.question);

const wanted = (opt('courses') || '').split(',').filter(Boolean);
const UNITS = QB.LESSON_COURSES.filter(c => (!wanted.length || wanted.includes(c.id)) && courseSettings(c.id))
  .map(c => ({ id: c.id, course: c.id, title: c.title, skills: c.skills, groups: c.groups || [], bank: QB.builtInBank(c.id), ...courseSettings(c.id) }));
if (!UNITS.length) { console.error('No matching courses.'); process.exit(2); }
function englishQuestions(unit, skillId, { test = false } = {}){
  const bank = QB.applyQuestionEdits(unit.course, skillId, unit.bank[skillId] || [], {}).map(q => {
    const correct = q.options[q.answer], options = shuffle(q.options);
    return { ...q, options, answer: options.indexOf(correct), skillId, src: 'bank' };
  });
  const typed = QT.typedQuestions(unit.course, skillId, TQ.TYPED_QUESTIONS[unit.course]?.[skillId], {}).filter(q => !QT.isWritten(q)).map(q => ({ ...QT.shuffledCopy(q, shuffle), src: 'typed' }));
  const gen = GENERATED.has(unit.course) ? G.geneticsQuestions(skillId).map(q => ({ ...q, src: 'gen' })) : [];
  const all = [...bank, ...typed, ...gen];
  if (test) return all;
  const held = testOnlyIds(all);
  return all.filter(q => !held.has(q.id));
}
function assessmentQuestions(unit, skillIds, count){
  const pools = skillIds.map(s => leanHard(englishQuestions(unit, s)).reverse()), out = [];
  while (out.length < count && pools.some(p => p.length)) pools.forEach(p => { if (p.length && out.length < count) out.push(p.pop()); });
  return shuffle(out);
}
const unitTest = unit => shuffle(unit.skills.flatMap(s => leanHard(englishQuestions(unit, s.id, { test: true })).slice(0, unit.testPer)));
const practice = (unit, skillId) => practiceOrder(englishQuestions(unit, skillId), 4);
const reviewCheck = unit => assessmentQuestions(unit, unit.skills.map(s => s.id), 8);   // the 8 mixed questions before every test

/* ---------- text features ---------- */
const STOP = new Set('a an the and or but so of to in on at by for with from as is are was were be been being it its this that these those he she they we you i his her their our your my me him them us what which who whom whose when where why how do does did has have had not no can could will would should may might must than then there here into onto about over under after before because if while also just very more most some any each one two three four five six seven eight nine ten all both only same other others such up out off'.split(' '));
const stem = w => w.replace(/(ing|ed|es|s|ly)$/, '');
const words = s => String(s).toLowerCase().replace(/[’']/g, "'").match(/[a-z0-9']+/g) || [];
const content = s => new Set(words(s).filter(w => !STOP.has(w) && w.length > 2).map(stem));
const ABS = /\b(always|never|all|none|only|every|everyone|everything|nothing|no one|nobody|cannot|can't|must|completely|entirely|impossible|any)\b/i;
const NEG = /\b(not|no|never|none|nothing|without|isn't|aren't|doesn't|don't|can't|cannot|won't|wasn't|weren't|didn't|neither|nor)\b|n't\b/i;
const FEATURES = {
  negative: s => NEG.test(s),
  fraction: s => /\d+\s*\/\s*\d+|%|\bpercent\b|\bhalf\b|\bquarter\b/i.test(s),
  question: s => /\?\s*["”’]?\s*$/.test(s),
  fullSentence: s => /^["“]?[A-Z]/.test(s) && /[.!?]["”’]?\s*$/.test(s) && words(s).length >= 4,
  number: s => /\d/.test(s),
  units: s => /\d\s*(%|cm|mm|km|m|kg|g|mg|ml|l|hours?|days?|years?|weeks?|minutes?|seconds?|degrees?|°)\b/i.test(s),
  hedge: s => /\b(usually|often|can|may|might|some|most|sometimes|likely|about|generally)\b/i.test(s),
  colonOrDash: s => /[:;—–]/.test(s),
  comma: s => /,/.test(s),
  quoted: s => /["“”]/.test(s),
  parenthesis: s => /[()]/.test(s),
  because: s => /\b(because|since|so that|which means)\b/i.test(s)
};
const ALL_ABOVE = /\b(all|both) of (the above|these|them|those)\b|^(both|all)\b|\ball three\b/i;

/* ---------- strategies: options + stem -> the set of choices it would pick from (indices) ---------- */
const all = opts => opts.map((_, i) => i);
const argmax = (opts, f) => { const v = opts.map(f), m = Math.max(...v); return v.map((x, i) => (x === m ? i : -1)).filter(i => i >= 0); };
const fired = (set, opts) => set.length > 0 && set.length < opts.length;
function stemGrammar(prompt, opts){
  const p = String(prompt).replace(/\s+/g, ' ').trim();
  const blank = /(\b\w+)\s*_{2,}/.exec(p) || /(\b\w+)\s*$/.exec(p.replace(/[.?:…]+$/, ''));
  const before = blank ? blank[1].toLowerCase() : '';
  const first = o => (words(o)[0] || '');
  if (before === 'an') { const k = opts.map((o, i) => (/^[aeiou]/i.test(first(o)) ? i : -1)).filter(i => i >= 0); if (fired(k, opts)) return k; }
  if (before === 'a') { const k = opts.map((o, i) => (!/^[aeiou]/i.test(first(o)) ? i : -1)).filter(i => i >= 0); if (fired(k, opts)) return k; }
  if (/^(are|were|these|those|two|three|several|many|both)$/.test(before)) { const k = opts.map((o, i) => (/s\b/.test(first(o)) || /^(\w+s)\b/.test(first(o)) ? i : -1)).filter(i => i >= 0); if (fired(k, opts)) return k; }
  if (/^(is|was|this|that|each|every|one)$/.test(before)) { const k = opts.map((o, i) => (!/^\w+s$/.test(first(o)) || /ss$/.test(first(o)) ? i : -1)).filter(i => i >= 0); if (fired(k, opts)) return k; }
  if (/\b\w+ed\b/.test(p) && opts.filter(o => /^\w+ed\b/i.test(o)).length === 1 && opts.length >= 3 && opts.every(o => words(o).length <= 4)) return opts.map((o, i) => (/^\w+ed\b/i.test(o) ? i : -1)).filter(i => i >= 0);
  return all(opts);
}
function oddOne(opts){
  if (opts.length < 3) return all(opts);
  const c = new Set();
  for (const f of Object.values(FEATURES)) {
    const has = opts.map(f), n = has.filter(Boolean).length;
    if (n === 1) c.add(has.indexOf(true));
    if (n === opts.length - 1) c.add(has.indexOf(false));
  }
  return c.size ? [...c] : all(opts);
}
const STRATS = {
  random: (o) => all(o),
  posA: (o) => [0],
  longest: (o) => argmax(o, s => String(s).length),
  specific: (o) => argmax(o, s => words(s).length + 2 * (String(s).match(/\d+(\.\d+)?/g) || []).length),
  overlap: (o, prompt) => { const pw = content(prompt), v = o.map(s => [...content(s)].filter(w => pw.has(w)).length); return Math.max(...v) === 0 ? all(o) : argmax(o, (_, i) => v[i]); },
  absolute: (o) => { const k = o.map((s, i) => (ABS.test(s) ? -1 : i)).filter(i => i >= 0); return k.length ? k : all(o); },
  grammar: (o, prompt) => stemGrammar(prompt, o),
  oddOne: (o) => oddOne(o),
  allAbove: (o) => { const k = o.map((s, i) => (ALL_ABOVE.test(s) ? i : -1)).filter(i => i >= 0); return k.length ? k : all(o); }
};
const CUES = ['longest', 'specific', 'overlap', 'absolute', 'grammar', 'oddOne', 'allAbove'];
STRATS.vote = (o, prompt) => {
  const score = o.map(() => 0); let any = false;
  for (const c of CUES) { const s = STRATS[c](o, prompt); if (!fired(s, o)) continue; any = true; s.forEach(i => { score[i] += 1 / s.length; }); }
  return any ? argmax(o, (_, i) => score[i]) : all(o);
};
/* anti-cues: a bank written to keep the key from being the longest gives the opposite cue away */
STRATS.shortest = (o) => argmax(o, s => -String(s).length);
STRATS.notLongest = (o) => { const L = STRATS.longest(o); const k = all(o).filter(i => !L.includes(i)); return k.length ? k : all(o); };
STRATS.middle = (o) => { const L = STRATS.longest(o), S = STRATS.shortest(o); const k = all(o).filter(i => !(L.length === 1 && L[0] === i) && !(S.length === 1 && S[0] === i)); return k.length ? k : all(o); };
STRATS.notVote = (o, prompt) => { const v = STRATS.vote(o, prompt); if (!fired(v, o)) return all(o); const k = all(o).filter(i => !v.includes(i)); return k.length ? k : all(o); };
/* learned bots: naive Bayes over choice features, trained on items they are NOT scored on */
function optFeatures(o, prompt){
  const len = o.map(s => String(s).length), mean = len.reduce((a, b) => a + b, 0) / o.length;
  const sets = { longest: STRATS.longest(o), shortest: STRATS.shortest(o), specific: STRATS.specific(o), overlap: STRATS.overlap(o, prompt), grammar: STRATS.grammar(o, prompt), odd: STRATS.oddOne(o), vote: STRATS.vote(o, prompt) };
  const pw = content(prompt);
  return o.map((s, i) => ({
    longest: sets.longest.length === 1 && sets.longest[0] === i, shortest: sets.shortest.length === 1 && sets.shortest[0] === i, aboveMean: len[i] > mean,
    specific: fired(sets.specific, o) && sets.specific.includes(i), overlap: fired(sets.overlap, o) && sets.overlap.includes(i), zeroOverlap: [...content(s)].every(w => !pw.has(w)),
    absolute: ABS.test(s), negative: NEG.test(s), hedge: FEATURES.hedge(s), number: FEATURES.number(s), sentence: FEATURES.fullSentence(s), because: FEATURES.because(s),
    grammarOK: fired(sets.grammar, o) && sets.grammar.includes(i), odd: fired(sets.odd, o) && sets.odd.includes(i), vote: fired(sets.vote, o) && sets.vote.includes(i), allAbove: ALL_ABOVE.test(s)
  }));
}
const NB = { within: {}, cross: {} };
const nbNew = () => ({ c: {}, w: {}, nc: 0, nw: 0 });
function nbAdd(m, feats, answer){ feats.forEach((f, i) => { const r = i === answer, t = r ? m.c : m.w; r ? m.nc++ : m.nw++; for (const [k, v] of Object.entries(f)) { const key = `${k}=${v}`; t[key] = (t[key] || 0) + 1; } }); }
function nbMerge(ms){ const m = nbNew(); for (const x of ms) { m.nc += x.nc; m.nw += x.nw; for (const k in x.c) m.c[k] = (m.c[k] || 0) + x.c[k]; for (const k in x.w) m.w[k] = (m.w[k] || 0) + x.w[k]; } return m; }
function nbPick(m, feats){ if (!m || !m.nc) return feats.map((_, i) => i); const sc = feats.map(f => Object.entries(f).reduce((a, [k, v]) => { const key = `${k}=${v}`; return a + Math.log(((m.c[key] || 0) + 1) / (m.nc + 2)) - Math.log(((m.w[key] || 0) + 1) / (m.nw + 2)); }, 0)); const mx = Math.max(...sc); return sc.map((x, i) => (Math.abs(x - mx) < 1e-9 ? i : -1)).filter(i => i >= 0); }
const fold = id => { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h % 2; };
let CURRENT_UNIT = null;
STRATS.learnedCV = (o, prompt, id) => nbPick(NB.within[CURRENT_UNIT]?.[1 - fold(id)], optFeatures(o, prompt));   // trained on the other half of this unit
STRATS.learnedXU = (o, prompt) => nbPick(NB.cross[CURRENT_UNIT], optFeatures(o, prompt));                          // trained on the other units only
const MC_STRATS = ['random', 'posA', ...CUES, 'vote', 'shortest', 'notLongest', 'middle', 'notVote', 'learnedCV', 'learnedXU'];
const pSet = (set, answer) => (set.includes(answer) ? 1 / set.length : 0);
const CUE_SCORE = {
  longest: s => String(s).length, specific: s => words(s).length + 2 * (String(s).match(/\d+/g) || []).length,
  overlap: (s, p) => { const pw = content(p); return [...content(s)].filter(w => pw.has(w)).length; },
  absolute: s => (ABS.test(s) ? 0 : 1), grammar: () => 0, oddOne: () => 0, allAbove: s => (ALL_ABOVE.test(s) ? 1 : 0)
};
const fact = n => (n <= 1 ? 1 : n * fact(n - 1));

/* generated kinds: the most common typed answer, and the most common answer pattern ("Xx", "the same as her") */
const template = s => String(s).replace(/\b([A-Za-z])\1\b/g, (m, c) => (c === c.toUpperCase() ? 'XX' : 'xx')).replace(/\b([A-Z])([a-z])\b/g, (m, a, b) => (a.toLowerCase() === b ? 'Xx' : m)).replace(/\b(RR|RW|WW|BB|BW)\b/g, 'GG');
const GEN_MODEL = {};
function genModel(skillId, kind, courseId){
  const key = `${courseId}:${skillId}:${kind}`; if (GEN_MODEL[key]) return GEN_MODEL[key];
  const fills = {}, temps = {}; let n = 0;
  for (let i = 0; i < 1500; i++) {
    const q = G.geneticsQuestion(skillId, kind, Math.random, courseId); if (!q) continue; n++;
    if (q.type === 'fill') for (const a of new Set(q.accept.map(QT.normalizeTyped))) fills[a] = (fills[a] || 0) + 1;
    if (QT.typeOf(q) === 'mc') { const t = template(q.options[q.answer]); temps[t] = (temps[t] || 0) + 1; }
  }
  const top = o => Object.entries(o).sort((a, b) => b[1] - a[1])[0] || [null, 0];
  const [fillGuess, fillN] = top(fills), [tmpl, tmplN] = top(temps);
  return (GEN_MODEL[key] = { fillGuess, fillRate: fillN / n, template: tmpl, templateRate: tmplN / n });
}

/* ---------- one shown question -> {strategy: chance it is marked right} ---------- */
const STRATEGY_NAMES = [...MC_STRATS, 'kindMemo'];
function evalQuestion(q, courseId){
  const type = QT.typeOf(q), out = {};
  const mcP = (opts, ans, prompt) => Object.fromEntries(MC_STRATS.map(s => [s, pSet(STRATS[s](opts, prompt, q.id), ans)]));
  if (type === 'mc') Object.assign(out, mcP(q.options, q.answer, q.prompt));
  else if (type === 'two') { const a = mcP(q.options, q.answer, q.prompt), b = mcP(q.partB.options, q.partB.answer, q.partB.prompt); for (const s of MC_STRATS) out[s] = a[s] * b[s]; }
  else if (type === 'multi') {
    const n = q.options.length, chance = 1 / (2 ** n - 1), right = [...q.answers].sort().join(',');
    for (const s of MC_STRATS) out[s] = chance;
    out.posA = 0;
    for (const c of ['longest', 'specific', 'overlap', 'absolute', 'allAbove']) {
      const v = q.options.map(o => CUE_SCORE[c](o, q.prompt)), sorted = [...v].sort((a, b) => a - b), mid = (sorted[Math.floor((n - 1) / 2)] + sorted[Math.ceil((n - 1) / 2)]) / 2;
      const pickd = v.map((x, i) => (x > mid ? i : -1)).filter(i => i >= 0);
      out[c] = pickd.length >= 2 && pickd.length < n ? (pickd.join(',') === right ? 1 : 0) : chance;
    }
    out.vote = Math.max(...['longest', 'specific', 'overlap', 'absolute'].map(c => out[c]).filter(x => x !== chance), chance);
  }
  else if (type === 'order') { const p = 1 / fact(q.items.length); for (const s of MC_STRATS) out[s] = p; out.posA = 0; }
  else if (type === 'sort') { const p = 1 / q.groups.length ** q.items.length; for (const s of MC_STRATS) out[s] = p; }
  else for (const s of MC_STRATS) out[s] = 0;   // fill, punnett: nothing to choose from
  if (type === 'pick') { const n = QT.pickWords(q.sentence).length; const p = 1 / (2 ** n - 1); for (const s of MC_STRATS) out[s] = s === 'posA' ? 0 : p; }
  out.kindMemo = out.random;
  if (q.gen) {
    const m = genModel(q.skillId, q.gen, courseId);
    if (type === 'fill') out.kindMemo = q.accept.map(QT.normalizeTyped).includes(m.fillGuess) ? 1 : 0;
    else if (type === 'mc') { const k = q.options.map((o, i) => (template(o) === m.template ? i : -1)).filter(i => i >= 0); out.kindMemo = k.length ? pSet(k, q.answer) : out.random; }
  }
  return out;
}
function passProb(ps, need){ let d = [1]; for (const p of ps) { const n = new Array(d.length + 1).fill(0); d.forEach((x, k) => { n[k] += x * (1 - p); n[k + 1] += x * p; }); d = n; } return d.slice(need).reduce((a, b) => a + b, 0); }

/* ---------- --items: which simple cue picks each fixed item's key ---------- */
if (ITEMS_ONLY) {
  for (const unit of UNITS) {
    let n = 0; const count = { L: 0, S: 0 };
    console.log(`\n== ${unit.id}`);
    const perSkill = {};
    for (const s of unit.skills) { const pool = englishQuestions(unit, s.id, { test: true }), held = testOnlyIds(pool); for (const q of pool) {
      if (q.gen) continue;
      const ps = perSkill[s.id] || (perSkill[s.id] = { n: 0, L: 0, S: 0, pn: 0, pL: 0, pS: 0 }), practiced = !held.has(q.id);
      const sets = QT.typeOf(q) === 'mc' ? [[q.options, q.answer, q.prompt, '']] : QT.typeOf(q) === 'two' ? [[q.options, q.answer, q.prompt, 'A'], [q.partB.options, q.partB.answer, q.partB.prompt, 'B']] : [];
      for (const [o, ans, prompt, part] of sets) {
        n++;
        const len = o.map(x => x.length), L = STRATS.longest(o), S = STRATS.shortest(o);
        const rank = L.length === 1 && L[0] === ans ? 'L' : S.length === 1 && S[0] === ans ? 'S' : 'M';
        if (rank !== 'M') { count[rank]++; ps[rank]++; if (practiced) ps[`p${rank}`]++; }
        ps.n++; if (practiced) ps.pn++;
        const hits = ['specific', 'overlap', 'absolute', 'grammar', 'oddOne', 'allAbove'].filter(c => { const k = STRATS[c](o, prompt); return fired(k, o) && pSet(k, ans) >= 0.6; });
        const anti = ['specific', 'overlap', 'grammar', 'oddOne'].filter(c => { const k = STRATS[c](o, prompt); return fired(k, o) && pSet(k, ans) === 0 && k.length === 1; });
        const above = len.filter(x => x > len[ans]).length, below = len.filter(x => x < len[ans]).length;
        console.log(`${rank} ${practiced ? 'P' : 'T'} ${above}/${below} L${questionLevel(q)} ${q.id}${part} ${hits.length ? `[${hits.join(',')}]` : ''} | ${o[ans]} || ${o.filter((_, i) => i !== ans).join(' | ')}`);
      }
    } }
    for (const [id, x] of Object.entries(perSkill)) console.log(`-- ${unit.id}/${id}: ${x.n} choice sets; key longest ${x.L}, key shortest ${x.S} (practice pool: ${x.pn} sets, longest ${x.pL}, shortest ${x.pS})`);
    console.log(`-- ${unit.id}: ${n} choice sets; key longest ${count.L} (${(100 * count.L / n).toFixed(0)}%), key shortest ${count.S} (${(100 * count.S / n).toFixed(0)}%)`);
  }
  process.exit(0);
}

/* ---------- train the learned bots (fresh pools; the same items in many shuffles) ---------- */
for (const unit of UNITS) {
  NB.within[unit.id] = [nbNew(), nbNew()];
  for (let t = 0; t < 60; t++) for (const s of unit.skills) for (const q of englishQuestions(unit, s.id, { test: true })) {
    const type = QT.typeOf(q), m = NB.within[unit.id][fold(q.id)];
    if (type === 'mc' || type === 'two') nbAdd(m, optFeatures(q.options, q.prompt), q.answer);
    if (type === 'two') nbAdd(m, optFeatures(q.partB.options, q.partB.prompt), q.partB.answer);
  }
}
for (const unit of UNITS) NB.cross[unit.id] = nbMerge(UNITS.filter(u => u.id !== unit.id).flatMap(u => NB.within[u.id]));

/* ---------- run ---------- */
const results = {};
let anyFail = false;
for (const unit of UNITS) {
  CURRENT_UNIT = unit.id;
  const quizzes = unit.noQuizzes ? [] : unit.groups.filter(g => !g.noQuiz && (g.skills || []).length).map(g => ({ id: g.id, name: g.quizName || `${g.name} Quiz`, skills: g.quizSkills || g.skills, pass: 3, n: 4 }));
  const assessments = [...quizzes.map(q => ({ ...q, make: () => assessmentQuestions(unit, q.skills, 4) })),
    { id: 'final', name: 'Unit test', n: unit.testPer * unit.skills.length, pass: unit.finalPass, make: () => unitTest(unit) }];
  const perItem = {}, asmt = {}, posHist = {};
  for (const a of assessments) {
    const rows = [];
    for (let t = 0; t < ATTEMPTS; t++) {
      const row = {};
      for (const q of a.make()) {
        const e = evalQuestion(q, unit.course), type = QT.typeOf(q);
        const it = perItem[q.id] || (perItem[q.id] = { n: 0, sum: {}, type, level: questionLevel(q), skill: q.skillId, gen: q.gen || null, prompt: String(q.prompt || q.sentence).slice(0, 110), right: type === 'mc' ? q.options[q.answer] : null });
        it.n++; for (const s of STRATEGY_NAMES) { it.sum[s] = (it.sum[s] || 0) + e[s]; (row[s] = row[s] || []).push(e[s]); }
        (row.ids = row.ids || []).push(q.id);
        if (type === 'mc') { const k = `${q.options.length}`; (posHist[k] = posHist[k] || new Array(q.options.length).fill(0))[q.answer]++; }
      }
      rows.push(row);
    }
    asmt[a.id] = { a, rows };
  }
  const ORACLE_FROM = [...CUES, 'vote', 'shortest', 'notLongest', 'middle', 'notVote', 'kindMemo'];
  for (const it of Object.values(perItem)) { it.mean = Object.fromEntries(STRATEGY_NAMES.map(s => [s, it.sum[s] / it.n])); it.oracleBy = ORACLE_FROM.reduce((b, s) => (it.mean[s] > it.mean[b] ? s : b), 'random'); it.mean.oracle = it.mean[it.oracleBy]; }
  const table = {};
  for (const [id, { a, rows }] of Object.entries(asmt)) {
    const passPct = +(100 * a.pass / a.n).toFixed(1);
    table[id] = { name: a.name, n: a.n, pass: a.pass, passPct, strategies: {}, fails: [] };
    for (const s of [...STRATEGY_NAMES, 'oracle']) {
      let es = 0, pp = 0;
      for (const r of rows) { const ps = s === 'oracle' ? r.ids.map(i => perItem[i].mean.oracle) : r[s]; es += ps.reduce((x, y) => x + y, 0); pp += passProb(ps, a.pass); }
      table[id].strategies[s] = { pct: +(100 * es / rows.length / a.n).toFixed(1), passProb: +(pp / rows.length).toFixed(4) };
    }
    const chance = table[id].strategies.random.pct;
    for (const s of STRATEGY_NAMES) { if (s === 'random') continue; const v = table[id].strategies[s].pct; if (v >= passPct - 15 || v - chance > 10) table[id].fails.push(s); }
  }

  /* retakes and memorization */
  const memo = { poolSize: {}, testOnly: {}, testItems: unit.testPer * unit.skills.length, testHidesKey: TEST_HIDES_KEY };
  for (const s of unit.skills) { const all = englishQuestions(unit, s.id, { test: true }), prac = englishQuestions(unit, s.id); memo.poolSize[s.id] = all.length; memo.testOnly[s.id] = all.length - prac.length; }
  let sameItems = 0, sameOrder = 0, sameLetter = 0, letterN = 0;
  const T = Math.min(ATTEMPTS, 1500);
  for (let t = 0; t < T; t++) {
    const x = unitTest(unit), y = unitTest(unit), xi = x.map(q => q.id), yi = y.map(q => q.id);
    const common = xi.filter(i => yi.includes(i) && !i.startsWith('gen:'));
    sameItems += common.length / xi.length; if (xi.join() === yi.join()) sameOrder++;
    for (const i of common) { const qa = x.find(q => q.id === i), qb = y.find(q => q.id === i); if (QT.typeOf(qa) === 'mc') { letterN++; if (qa.answer === qb.answer) sameLetter++; } }
  }
  memo.retakeSameItemsPct = +(100 * sameItems / T).toFixed(1);
  memo.retakeSameOrderPct = +(100 * sameOrder / T).toFixed(2);
  memo.retakeSameLetterPct = letterN ? +(100 * sameLetter / letterN).toFixed(1) : null;
  /* memorizer: remembers the right answer of every fixed item it was shown (practice once per lesson, each quiz once, the
     8-question review before every test try, and the test itself). If the test hides the key after a miss, it only
     learns the test items it happened to get right. On anything new it uses the one trick that scores best on this unit's
     test (a student commits to a trick; it can't know per item which trick happens to be right). */
  const fallback = STRATEGY_NAMES.filter(s => s !== 'random').reduce((b, s) => (table.final.strategies[s].pct > table.final.strategies[b].pct ? s : b), 'learnedXU');
  memo.fallback = fallback;
  const memoRuns = [];
  for (let t = 0; t < Math.min(ATTEMPTS, 1000); t++) {
    const seen = new Set(), see = qs => qs.forEach(q => { if (!q.gen) seen.add(q.id); });
    for (const s of unit.skills) see(practice(unit, s.id));
    for (const q of quizzes) see(assessmentQuestions(unit, q.skills, 4));
    const tries = [];
    for (let k = 0; k < 3; k++) {
      see(reviewCheck(unit));
      const test = unitTest(unit), ps = test.map(q => { if (seen.has(q.id)) return 1; const e = evalQuestion(q, unit.course); return e[fallback]; });
      tries.push({ pct: 100 * ps.reduce((a, b) => a + b, 0) / test.length, pass: passProb(ps, unit.finalPass) });
      test.forEach((q, i) => { if (q.gen) return; if (!TEST_HIDES_KEY || Math.random() < ps[i]) seen.add(q.id); });
    }
    memoRuns.push(tries);
  }
  memo.tries = [0, 1, 2].map(k => ({ attempt: k + 1, pct: +(memoRuns.reduce((a, r) => a + r[k].pct, 0) / memoRuns.length).toFixed(1), passProb: +(memoRuns.reduce((a, r) => a + r[k].pass, 0) / memoRuns.length).toFixed(3) }));
  const finalPassPct = table.final.passPct;
  memo.fail = memo.tries.some(x => x.pct >= finalPassPct - 15);
  /* quizzes can be retaken: the best realistic bot's chance to pass one attempt */
  const realistic = STRATEGY_NAMES.filter(s => s !== 'random');
  const quizPass = Object.fromEntries(quizzes.map(q => [q.name, Math.max(...realistic.map(s => table[q.id].strategies[s].passProb))]));
  /* items where one simple cue gets the key at least 60% of the time and 30 points above chance */
  const leaks = [];
  for (const [id, it] of Object.entries(perItem)) {
    const hits = ['shortest', 'longest', 'specific', 'overlap', 'absolute', 'grammar', 'oddOne', 'allAbove', 'kindMemo'].filter(s => it.mean[s] >= 0.6 && it.mean[s] - it.mean.random >= 0.3);
    if (hits.length) leaks.push({ id, level: it.level, type: it.type, cues: hits, right: it.right });
  }
  const learnedHits = Object.entries(perItem).filter(([, it]) => Math.max(it.mean.learnedCV, it.mean.learnedXU) >= 0.6 && it.type === 'mc').map(([id, it]) => ({ id, cv: +it.mean.learnedCV.toFixed(2), xu: +it.mean.learnedXU.toFixed(2), right: it.right }));
  const levels = {};
  for (const it of Object.values(perItem)) { const L = levels[it.level] || (levels[it.level] = { items: 0, random: 0, oracle: 0, learnedXU: 0 }); L.items++; L.random += it.mean.random; L.oracle += it.mean.oracle; L.learnedXU += it.mean.learnedXU; }
  for (const L of Object.values(levels)) for (const k of ['random', 'oracle', 'learnedXU']) L[k] = +(L[k] / L.items).toFixed(3);
  const fail = memo.fail || Object.values(table).some(t => t.fails.length);
  anyFail = anyFail || fail;
  results[unit.id] = { title: unit.title, testPer: unit.testPer, finalPass: unit.finalPass, table, memo, quizPass, leaks, learnedHits, levels, posHist, fail };
}
if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(results, null, 1));

/* ---------- report (markdown on stdout) ---------- */
const SHOW = ['random', 'posA', 'longest', 'shortest', 'notLongest', 'middle', 'specific', 'overlap', 'absolute', 'grammar', 'oddOne', 'allAbove', 'vote', 'notVote', 'learnedCV', 'learnedXU', 'kindMemo', 'oracle'];
for (const [u, r] of Object.entries(results)) {
  console.log(`\n### ${u}: ${r.title}${r.fail ? ' — FAIL' : ' — ok'}\n`);
  console.log(`| assessment | pass mark | ${SHOW.join(' | ')} | verdict |`);
  console.log(`|---|---|${SHOW.map(() => '---').join('|')}|---|`);
  for (const t of Object.values(r.table)) console.log(`| ${t.name} (${t.n} q) | ${t.pass} = ${t.passPct}% | ${SHOW.map(s => (t.fails.includes(s) ? `**${t.strategies[s].pct}**` : `${t.strategies[s].pct}`)).join(' | ')} | ${t.fails.length ? `FAIL (${t.fails.join(', ')})` : 'ok'} |`);
  console.log(`\nMemorizer (test ${r.memo.testHidesKey ? 'hides' : 'shows'} the key after a miss; test-only items per lesson ${JSON.stringify(r.memo.testOnly)} of ${JSON.stringify(r.memo.poolSize)}): ${r.memo.tries.map(x => `try ${x.attempt} ${x.pct}% (pass chance ${(100 * x.passProb).toFixed(0)}%)`).join('; ')} vs pass mark ${r.table.final.passPct}% (new items: ${r.memo.fallback}) → ${r.memo.fail ? '**FAIL**' : 'ok'}.`);
  console.log(`Retake vs previous test: ${r.memo.retakeSameItemsPct}% same fixed items, same order ${r.memo.retakeSameOrderPct}%, same letter for a repeated item ${r.memo.retakeSameLetterPct}%. Position of the key (4 choices): ${JSON.stringify(r.posHist['4'] || [])}.`);
  if (Object.keys(r.quizPass).length) console.log(`Best realistic bot, chance to pass one quiz attempt: ${Object.entries(r.quizPass).map(([k, v]) => `${k} ${(100 * v).toFixed(0)}%`).join(', ')}.`);
  console.log(`Single-cue items (cue right ≥60% and 30 points over chance): ${r.leaks.length}${r.leaks.length ? `: ${r.leaks.map(x => `${x.id} (${x.cues.join('+')})`).join(', ')}` : ''}.`);
}
console.log(`\n${anyFail ? 'FAIL: at least one unit can be gamed.' : 'All units hold: no strategy is within 15 points of a pass mark or more than 10 points above chance.'}`);
process.exit(anyFail ? 1 : 0);
