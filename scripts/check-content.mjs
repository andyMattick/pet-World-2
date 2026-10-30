// Checks the content rules a script can check (docs: CONTENT-RULES.md). Run: node scripts/check-content.mjs
// Errors (exit 1): a lesson without its 2 scored newer-type questions and 1 short answer, a course without a unit-test
// paragraph, straight apostrophes in the newer-type questions, or (in a unit with a reserved test pool) a lesson with
// fewer than 6 reserved test questions or one that repeats a practice question. Warnings: a course whose right answers are the longest
// (or the shortest) choice much more or less often than about 1 in 4 (a test-wise student can play the length; see
// docs/BLIND-REVIEW.md), or multiple-choice questions whose wrong answers use give-away words.
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

// questionBanks.js and questionTypes.js import a TypeScript file; give them a plain stand-in for ids so Node can load them.
const ID_STUB = "const questionId = (c, s, p, a) => `${c}:${s}:${String(p).trim().toLowerCase()}\\u0000${String(a).trim().toLowerCase()}`;";
const load = file => import('data:text/javascript;base64,' + Buffer.from(fs.readFileSync(file, 'utf8').replace(/^import \{ questionId \} from '\.\/questionIds';$/m, ID_STUB)).toString('base64'));
const Banks = await load('src/shared/questionBanks.js');
const T = await load('src/shared/questionTypes.js');
const { TYPED_QUESTIONS, UNIT_ESSAYS } = await import(pathToFileURL('src/shared/typedQuestions.js').href);

const errors = [], warnings = [], reserved = [];
const GIVEAWAY = /\b(only|always|never|all|none|every|completely|nothing)\b/i;
for (const course of Banks.LESSON_COURSES) {
  if (!UNIT_ESSAYS[course.id] || T.typedProblems(UNIT_ESSAYS[course.id]).length) errors.push(`${course.id}: needs a unit-test paragraph in UNIT_ESSAYS`);
  const bank = Banks.builtInBank(course.id);
  let sets = 0, keyLongest = 0, keyShortest = 0;
  for (const skill of course.skills) {
    const typed = (TYPED_QUESTIONS[course.id]?.[skill.id] || []).filter(q => !T.typedProblems(q).length);
    const scored = typed.filter(q => !T.isWritten(q)).length, written = typed.filter(T.isWritten).length;
    if (scored < 2 || written < 1) errors.push(`${course.id}/${skill.id}: has ${scored} scored newer-type question(s) and ${written} short answer(s); needs 2 and 1`);
    for (const q of bank[skill.id] || []) {
      const right = q.options[q.answer], wrong = q.options.filter((_, i) => i !== q.answer);
      sets++;
      if (right.length > Math.max(...wrong.map(w => w.length))) keyLongest++;
      if (right.length < Math.min(...wrong.map(w => w.length))) keyShortest++;
      if (!GIVEAWAY.test(right) && wrong.filter(w => GIVEAWAY.test(w)).length >= 2) warnings.push(`${course.id}/${skill.id}: two or more wrong answers use give-away words: "${q.prompt.slice(0, 60)}"`);
    }
  }
  /* reserved test pool (owner, Oct 30, 2026; docs/BLIND-REVIEW.md): test-only questions never repeat a practice question,
     and a unit that has one gives every lesson at least 6 */
  const reservedBy = course.skills.map(skill => (bank[skill.id] || []).filter(q => q.testOnly));
  if (reservedBy.some(list => list.length)) {
    reserved.push(`${course.id} ${reservedBy.map(list => list.length).join('/')}`);
    course.skills.forEach((skill, i) => {
      if (reservedBy[i].length < 6) errors.push(`${course.id}/${skill.id}: has ${reservedBy[i].length} reserved test questions; a unit with a reserved pool needs at least 6 per lesson`);
      const practiced = new Set((bank[skill.id] || []).filter(q => !q.testOnly).flatMap(q => [q.prompt.trim().toLowerCase() + '\u0000' + q.options[q.answer].trim().toLowerCase()]));
      for (const q of reservedBy[i]) if (practiced.has(q.prompt.trim().toLowerCase() + '\u0000' + q.options[q.answer].trim().toLowerCase())) errors.push(`${course.id}/${skill.id}: reserved test question repeats a practice question: "${q.prompt.slice(0, 60)}"`);
    });
  }
  const share = n => n / Math.max(1, sets);   // aim for about 25% each (owner rule, Oct 30, 2026)
  if (sets >= 20 && (share(keyLongest) < 0.15 || share(keyLongest) > 0.35 || share(keyShortest) < 0.15 || share(keyShortest) > 0.35)) warnings.push(`${course.id}: the right answer is the longest choice in ${Math.round(100 * share(keyLongest))}% and the shortest in ${Math.round(100 * share(keyShortest))}% of ${sets} questions (aim for about 25% each)`);
}
const textOf = q => JSON.stringify(q);
for (const [course, lessons] of Object.entries(TYPED_QUESTIONS)) for (const [skill, list] of Object.entries(lessons)) for (const q of list) {
  if (textOf(q).includes("'")) errors.push(`${course}/${skill}: straight apostrophe in "${q.prompt.slice(0, 60)}" (use ’)`);
}
for (const [station, list] of Object.entries(TYPED_QUESTIONS.math || {})) {
  const scored = list.filter(q => !T.isWritten(q)).length, written = list.filter(T.isWritten).length;
  if (scored < 2 || written < 1) errors.push(`math/${station}: Think it through needs 2 scored questions and 1 short answer`);
}
warnings.forEach(w => console.log('warning: ' + w));
if (errors.length) { console.log('CONTENT RULES NOT MET:\n  ' + errors.join('\n  ')); process.exit(1); }
if (reserved.length) console.log(`Reserved test pools (test-only questions per lesson): ${reserved.join('; ')}`);
console.log(`✅ Content rules met (${warnings.length} warning${warnings.length === 1 ? '' : 's'}).`);
