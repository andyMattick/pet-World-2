#!/usr/bin/env node
/* Blind export (docs/BLIND-REVIEW.md, owner rule Oct 30, 2026): what the student sees on quizzes and the unit test, with
   NO answer keys, for any Pet World library course (English, History, Biology).

     node scripts/blind-export.mjs --courses style,bio5 [--out <dir>]      (run from the repo root)

   --courses takes course ids from LESSON_COURSES (default: every course). --out defaults to pet-world-blind/ in the
   system temp folder; keep it OUTSIDE the repo, so a blind reviewer given the views folder can't reach the keys.
   Writes  <out>/views/<course>.md   (keyless, numbered)   -> give ONLY this file to a fresh blind reviewer
           <out>/keys/<course>.json  (id -> correct letter / answer, plus source file:line)

   It loads the repo's own modules (questionBanks.js, typedQuestions.js, questionTypes.js, genetics.js) from a temp copy
   (questionIds.ts has its type annotations stripped so plain Node can import it). Repo files are never modified.

   What the student sees (src/game/game.js, renderEnglishQuestion + typedBodyHTML): the prompt (as an <h3>, or spoken on
   the role stage, same text), the figure if any, and the choices. Bank choices are shuffled per student
   (englishBankQuestions), typed choices via shuffledCopy, and order items start shuffled (never already in order).
   testPrompt / answerStepsFor only apply to math station problems; none of these four units use steps, worked prompts
   or hints. Quizzes and tests use englishQuestions(): bank MC + scored typed questions (+ Farm Barn generated ones);
   short answers are practice-only (pendingWritten) and the unit essay closes the unit test (unitEssay). */
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2), opt = name => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : null; };
const REPO = resolve(opt('repo') || process.cwd());
const OUT = resolve(opt('out') || join(tmpdir(), 'pet-world-blind'));
const SEED = 20261030;

/* ---------- load the repo's modules from a temp copy ---------- */
const tmp = mkdtempSync(join(tmpdir(), 'blind-export-'));
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
/* the role cards (the "You are …" scene line above each science question): the object literal from game.js */
const ROLE_CARDS = (() => {
  const start = GAME.indexOf('const ROLE_CARDS = {');
  if (start < 0) return {};
  const end = GAME.indexOf('\n};', start);
  try { return new Function(`return ${GAME.slice(start + 'const ROLE_CARDS = '.length, end + 2)};`)(); } catch { return {}; }
})();
/* the unit test settings from englishCourse() in game.js: questions per lesson and the pass mark */
const testSettings = id => {
  const m = new RegExp(`\\{id:'${id}',[^\\n]*?testPer:(\\d+),finalPass:(\\d+)`).exec(GAME);
  return m ? { testPer: +m[1], finalPass: +m[2] } : { testPer: 1, finalPass: null };
};

/* ---------- seeded randomness ---------- */
const hash = text => { let h = 0x811c9dc5; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; };
const mulberry32 = a => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rngFor = key => mulberry32(hash(`${SEED}:${key}`));
const shuffleWith = (list, rnd) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const LETTERS = 'ABCDEFGHIJ';

/* ---------- source lines ---------- */
const FILES = {
  bank: { path: 'src/shared/questionBanks.js', text: src('src/shared/questionBanks.js') },
  typed: { path: 'src/shared/typedQuestions.js', text: src('src/shared/typedQuestions.js') },
  gen: { path: 'src/shared/genetics.js', text: src('src/shared/genetics.js') }
};
const lineAt = (text, index) => text.slice(0, index).split('\n').length;
function findLine(fileKey, prompt, from = 0){
  const { text } = FILES[fileKey];
  const head = String(prompt).slice(0, 60);
  const variants = [head, head.replace(/'/g, "\\'"), head.replace(/"/g, '\\"'), JSON.stringify(head).slice(1, -1)];
  for (const v of variants) { let i = text.indexOf(v, from); if (i < 0) i = text.indexOf(v); if (i >= 0) return lineAt(text, i); }
  return null;
}
const srcRef = (fileKey, line) => `${FILES[fileKey].path}:${line ?? '?'}`;
function genKindLine(skillId, kind){
  const { text } = FILES.gen;
  const block = text.indexOf(`\n  ${skillId}:{`);
  const i = block >= 0 ? text.indexOf(`\n    ${kind}:[`, block) : -1;
  return i >= 0 ? lineAt(text, i + 1) : null;
}

/* ---------- figures as text ---------- */
const unescapeHTML = s => String(s).replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const htmlText = html => unescapeHTML(String(html).replace(/<\/span>\s*(?=<span class="codon-key">)/g, '; ').replace(/<\/(div|p|figcaption|li|tr)>/g, '\n').replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, ''))
  .split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
const ROMAN = ['I', 'II', 'III', 'IV'];
function pedigreeText(html){
  const data = /data-ped="([^"]*)"/.exec(html), label = /aria-label="([^"]*)"/.exec(html);
  const people = JSON.parse(unescapeHTML(data[1]));
  const byId = Object.fromEntries(people.map(p => [p.id, p]));
  // generations from the drawing: the y of each number label under its shape
  const ys = {}; for (const m of html.matchAll(/<text x="[^"]*" y="([\d.]+)"[^>]*class="ped-num">(\d+)<\/text>/g)) ys[+m[2]] = +m[1];
  const rows = [...new Set(Object.values(ys))].sort((a, b) => a - b);
  const xs = {}; for (const m of html.matchAll(/<text x="([\d.]+)" y="[^"]*"[^>]*class="ped-num">(\d+)<\/text>/g)) xs[+m[2]] = +m[1];
  const lbl = unescapeHTML(label[1]);
  const male = (/\((\w+)s\), circles/.exec(lbl) || [])[1] || 'male', female = (/females \((\w+)s\)/.exec(lbl) || [])[1] || 'female';
  const filled = (/Filled shapes have ([^;]+);/.exec(lbl) || [])[1] || 'the trait', open = (/open shapes have (.+)\.$/.exec(lbl) || [])[1] || 'not the trait';
  const out = [`Figure (family tree, described in words). ${lbl}`];
  const couples = new Set(people.filter(p => p.mom && p.dad).map(p => `${Math.min(p.mom, p.dad)} and ${Math.max(p.mom, p.dad)}`));
  rows.forEach((y, r) => {
    const ids = people.filter(p => ys[p.id] === y).sort((a, b) => xs[a.id] - xs[b.id]).map(p => p.id);
    out.push(`Generation ${ROMAN[r] || r + 1} (left to right):`);
    for (const id of ids) {
      const p = byId[id];
      const shape = p.sex === 'm' ? `square (male, ${male})` : `circle (female, ${female})`;
      const fill = p.aff ? `filled (${filled})` : `open (${open})`;
      const family = p.mom && p.dad ? `child of ${Math.min(p.mom, p.dad)} and ${Math.max(p.mom, p.dad)}` : r === 0 ? 'top of the tree, parents not shown' : 'married into the family, parents not shown';
      out.push(`  - Animal ${id}: ${shape}, ${fill}; ${family}`);
    }
  });
  out.push(`Mated pairs (joined by a line): ${[...couples].join('; ')}`);
  return out;
}
function figureText(html){
  if (!html) return [];
  if (/data-ped=/.test(html)) return pedigreeText(html);
  return ['Figure (as shown, in words):', ...htmlText(html).map(l => `  ${l}`)];
}

/* ---------- one question -> view lines + key ---------- */
const TYPE_NAMES = { mc: 'Multiple choice', multi: 'Select all', two: 'Two-part', order: 'Put in order', fill: 'Typed response', sort: 'Sort', pick: 'Tap the words', punnett: 'Build a Punnett square', short: 'Short written response', essay: 'Paragraph' };
const clean = s => String(s).replace(/\s+/g, ' ').trim();
function render(q, n){
  const type = QT.typeOf(q), rnd = rngFor(q.id), view = [], key = { type };
  const level = QT.isWritten(q) ? '-' : (q.difficulty || 1);
  view.push(`### ${n}. [${q.id}]`);
  view.push(`Lesson: ${q.lessonName} (${q.skillId}) | Level: ${level} | Type: ${TYPE_NAMES[type]}`);
  view.push('');
  view.push(clean(q.prompt));
  const fig = figureText(q.figure);
  if (fig.length) { view.push(''); view.push(...fig); }
  view.push('');
  const choices = (options, correctIdx) => {
    const order = shuffleWith(options.map((_, i) => i), rnd);
    order.forEach((i, k) => view.push(`${LETTERS[k]}. ${clean(options[i])}`));
    const at = i => LETTERS[order.indexOf(i)];
    return Array.isArray(correctIdx) ? correctIdx.map(at).sort() : at(correctIdx);
  };
  if (type === 'mc') { key.correct = choices(q.options, q.answer); key.correctText = q.options[q.answer]; }
  else if (type === 'multi') { view.push('(Select all that apply.)'); key.correct = choices(q.options, q.answers); key.correctText = q.answers.map(i => q.options[i]); }
  else if (type === 'two') {
    view.push('Part A'); const a = choices(q.options, q.answer);
    view.push(''); view.push(clean(q.partB.prompt)); const b = choices(q.partB.options, q.partB.answer);
    key.correct = { partA: a, partB: b }; key.correctText = { partA: q.options[q.answer], partB: q.partB.options[q.partB.answer] };
  } else if (type === 'order') {
    view.push('(Put these in order.)');
    let order; do order = shuffleWith(q.items.map((_, i) => i), rnd); while (order.every((x, i) => x === i));   // never already in order, like the game
    order.forEach((i, k) => view.push(`${LETTERS[k]}. ${clean(q.items[i])}`));
    key.correct = q.items.map((_, i) => LETTERS[order.indexOf(i)]).join(' ');
    key.correctText = q.items;
  } else if (type === 'fill') {
    view.push('(Type in the box: ________)');
    key.correct = q.accept[0]; key.accepted = q.accept;
  } else if (type === 'sort') {
    view.push(`(Choose a group for each one. Groups: ${q.groups.join(' | ')})`);
    const items = shuffleWith(q.items, rnd);
    items.forEach(([text], k) => view.push(`${k + 1}. ${clean(text)}`));
    key.correct = Object.fromEntries(items.map(([text, g], k) => [String(k + 1), q.groups[g]]));
    key.correctText = items.map(([text, g]) => `${text} = ${q.groups[g]}`);
  } else if (type === 'pick') {
    view.push('(Tap the words.)');
    const words = QT.pickWords(q.sentence);
    view.push(words.map((w, i) => `[${i + 1}] ${w}`).join(' '));
    key.correct = q.answers.map(i => i + 1); key.correctText = q.answers.map(i => QT.bareWord(words[i]));
  } else if (type === 'punnett') {
    view.push(`(${q.ask ? 'Type each parent’s alleles on the edges, then the two alleles in each box.' : 'Type the two alleles in each box.'} Capital letters matter.)`);
    view.push(`Across the top: ${q.colLabel} | Down the side: ${q.rowLabel}`);
    const top = j => (q.ask ? '__' : q.cols[j]), side = i => (q.ask ? '__' : q.rows[i]);
    view.push('');
    view.push(`|     | ${top(0)} | ${top(1)} |`, '|-----|----|----|', `| ${side(0)} | __ | __ |`, `| ${side(1)} | __ | __ |`);
    const boxes = QT.punnettBoxes(q.rows, q.cols);
    key.correct = { ...(q.ask ? { top: q.cols, side: q.rows } : {}), boxesRowByRow: boxes };
  } else if (type === 'short' || type === 'essay') {
    view.push(`(Write at least ${q.minWords} words.)`);
    key.rubric = q.rubric; key.model = q.model; key.minWords = q.minWords;
  }
  view.push('');
  return { view, key };
}

/* ---------- the units: every library course in LESSON_COURSES (or the ones named in --courses) ---------- */
const wanted = (opt('courses') || '').split(',').filter(Boolean);
const GENERATED = new Set([...GAME.matchAll(/courseId === '(\w+)' \? geneticsQuestions/g)].map(m => m[1]));   // courses with generated problems
const UNITS = QB.LESSON_COURSES.filter(c => !wanted.length || wanted.includes(c.id))
  .map(c => ({ id: c.id, course: c.id, name: c.title, skills: c.skills, groups: c.groups || [], bank: QB.builtInBank(c.id) }));
if (!UNITS.length) { console.error('No matching courses.'); process.exit(2); }
const GEN_SAMPLES = 6;
mkdirSync(join(OUT, 'views'), { recursive: true });
mkdirSync(join(OUT, 'keys'), { recursive: true });
const report = [];
const problems = [];

for (const unit of UNITS) {
  const { course } = unit, ts = testSettings(course), view = [], keys = {};
  const counts = { mc: 0, reserved: 0, typed: 0, generated: 0, short: 0, essay: 0, droppedTyped: 0 };
  const visible = [];   // every student-visible string, for the leak check
  let n = 0;
  const add = (q, sourceRef, section) => {
    n++;
    const { view: lines, key } = render(q, n);
    view.push(...lines);
    if (keys[q.id]) problems.push(`${unit.id}: duplicate id ${q.id}`);
    keys[q.id] = { n, section, ...(q.testOnly ? { testOnly: true } : {}), lesson: q.skillId, level: QT.isWritten(q) ? null : (q.difficulty || 1), ...key, source: sourceRef };
    visible.push(q.prompt, ...(q.options || []), ...(q.partB ? [q.partB.prompt, ...q.partB.options] : []), ...(q.items || []).map(x => (Array.isArray(x) ? x[0] : x)), ...(q.groups || []), (q.groups || []).join(' | '), q.sentence || '', q.rowLabel || '', q.colLabel || '', ...(q.figure ? figureText(q.figure) : []));
  };
  const skillName = id => unit.skills.find(s => s.id === id)?.name || id;

  view.push(`# ${unit.name} (course "${course}") — student view, no key`);
  view.push('');
  view.push('What she sees on a quiz or the unit test: the prompt, any figure, and the choices. Choices are shown here in a fixed seeded shuffle and labeled with letters; in the game they are shuffled again for each try. Keys are in a separate file.');
  view.push('');
  view.push('Quizzes (4 questions each, drawn from these lessons):');
  for (const g of unit.groups) if (!g.noQuiz) view.push(`- ${g.quizName || `${g.name} Quiz`}: ${(g.quizSkills || g.skills).map(skillName).join(', ')}`);
  view.push(`Unit test: ${ts.testPer} question(s) from each of the ${unit.skills.length} lessons (${ts.testPer * unit.skills.length} in all, pass mark ${ts.finalPass}), then the paragraph at the end.`);
  view.push('');

  // 1. scored questions per lesson (these are what quizzes and the test draw from)
  view.push('## Part 1: Scored questions (quiz and unit test pool)');
  view.push('');
  for (const skill of unit.skills) {
    view.push(`## Lesson: ${skill.name} (${skill.id})`);
    const role = ROLE_CARDS[skill.id];
    if (role) view.push(`Scene shown above every question in this lesson: You are ${role.who}. ${role.where} · ${role.intro}`);
    view.push('');
    const bank = QB.applyQuestionEdits(course, skill.id, unit.bank[skill.id] || [], {});
    for (const q of bank) { counts.mc++; if (q.testOnly) counts.reserved++; add({ ...q, skillId: skill.id, lessonName: skill.name }, srcRef('bank', findLine('bank', q.prompt)), 'scored'); }
    const typedRaw = TQ.TYPED_QUESTIONS[course]?.[skill.id] || [];
    const typed = QT.typedQuestions(course, skill.id, typedRaw, {});
    const dropped = typedRaw.filter(x => QT.typedProblems(x).length);
    counts.droppedTyped += dropped.length;
    dropped.forEach(x => problems.push(`${unit.id}/${skill.id}: typed question dropped by typedProblems (${QT.typedProblems(x).join(', ')}): ${String(x.prompt).slice(0, 80)}`));
    for (const q of typed.filter(x => !QT.isWritten(x))) { counts.typed++; add({ ...q, lessonName: skill.name }, srcRef('typed', findLine('typed', q.prompt)), 'scored'); }
    if (GENERATED.has(course)) {
      for (const [kind, level] of G.geneticsKinds(skill.id)) {
        const rnd = rngFor(`gen:${skill.id}:${kind}`), seen = new Set(), made = [];
        for (let tries = 0; tries < 400 && made.length < GEN_SAMPLES; tries++) {
          const q = G.geneticsQuestion(skill.id, kind, rnd, course);
          if (!q) continue;
          const sig = JSON.stringify({ ...q, id: undefined, options: q.options ? [...q.options].sort() : undefined, items: q.type === 'sort' && q.items ? [...q.items].map(String).sort() : q.items });
          if (seen.has(sig)) continue;
          seen.add(sig); made.push(q);
        }
        if (made.length < GEN_SAMPLES) problems.push(`${unit.id}/${skill.id}/${kind}: only ${made.length} distinct generated samples (of ${GEN_SAMPLES} wanted)`);
        made.forEach((q, i) => { counts.generated++; add({ ...q, id: `${q.id}#${i + 1}`, difficulty: level, skillId: skill.id, lessonName: `${skill.name} (generated: ${kind})` }, srcRef('gen', genKindLine(skill.id, kind)), 'generated'); });
      }
    }
  }

  // 2. short answers (practice: one per lesson until sent) and the unit-test paragraph
  view.push('## Part 2: Written responses (read by a grown-up, not auto-scored)');
  view.push('Short written responses are asked in lesson practice; the paragraph ends the unit test.');
  view.push('');
  for (const skill of unit.skills) {
    const typed = QT.typedQuestions(course, skill.id, TQ.TYPED_QUESTIONS[course]?.[skill.id] || [], {});
    for (const q of typed.filter(QT.isWritten)) { counts.short++; add({ ...q, lessonName: skill.name }, srcRef('typed', findLine('typed', q.prompt)), 'short answer (practice)'); }
  }
  const essay = TQ.UNIT_ESSAYS[course] ? QT.typedQuestions(course, 'unit-test', [TQ.UNIT_ESSAYS[course]], {})[0] : null;
  if (essay) { counts.essay++; add({ ...essay, skillId: 'unit-test', lessonName: 'Unit test paragraph' }, srcRef('typed', findLine('typed', essay.prompt)), 'unit test paragraph'); }

  const viewText = view.join('\n');
  writeFileSync(join(OUT, 'views', `${unit.id}.md`), viewText);
  writeFileSync(join(OUT, 'keys', `${unit.id}.json`), JSON.stringify({ unit: unit.id, course, seed: SEED, generatedSamplesPerKind: GENERATED.has(course) ? GEN_SAMPLES : 0, count: n, keys }, null, 2));

  /* ---------- leak check ---------- */
  const visibleText = visible.join('\n').toLowerCase();
  const leaks = [];
  viewText.split('\n').forEach((line, i) => {
    if (/✓|✔|\*\*|__[A-Za-z]|\b(rubric|model answer|accept(ed)?:|answers?:|correct:)/i.test(line)) leaks.push(`line ${i + 1}: marker: ${line.slice(0, 120)}`);
    if (/\ba:\s/.test(line) && !/^[A-J]\. /.test(line)) { /* "a: " only as a key field; checked below against visible text */ }
    for (const word of ['answer', 'correct', 'right answer', ' a:']) {
      if (!line.toLowerCase().includes(word)) continue;
      // allowed only when the word comes from text the student really sees, or from the fixed instruction lines
      const body = line.replace(/^### \d+\. \[[^\]]*\]$/, '').replace(/^[A-J]\. /, '').replace(/^\d+\. /, '').replace(/^\(Choose a group for each one\. Groups: (.*)\)$/, '$1').replace(/^  /, '').trim();
      if (!body || !body.toLowerCase().includes(word)) continue;
      if (!visibleText.includes(body.toLowerCase().slice(0, 50))) leaks.push(`line ${i + 1}: "${word}" not from student text: ${line.slice(0, 120)}`);
    }
  });
  // key-only text (model answers, rubric points, longer accepted typed answers) must never appear in the view
  for (const [id, k] of Object.entries(keys)) {
    const keyOnly = [k.model, ...(k.rubric || []), ...((k.accepted || []).filter(a => a.length >= 6))].filter(Boolean);
    for (const t of keyOnly) if (viewText.toLowerCase().includes(String(t).toLowerCase().slice(0, 60)) && !visibleText.includes(String(t).toLowerCase().slice(0, 60))) leaks.push(`${id}: key text in view: ${String(t).slice(0, 80)}`);
  }
  if (leaks.length) problems.push(...leaks.map(l => `${unit.id} LEAK ${l}`));
  report.push({ unit: unit.id, total: n, ...counts, leaks: leaks.length });
}

console.log(JSON.stringify({ report, problems }, null, 2));
