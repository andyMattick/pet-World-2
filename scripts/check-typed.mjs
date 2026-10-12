// Checks the newer question types (docs: QUESTION-TYPES.md): every question in src/shared/typedQuestions.js is valid,
// ids don't collide, and the counts per course. Run: node scripts/check-typed.mjs
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

// questionTypes.js imports a TypeScript file; give it a plain stand-in for ids so Node can load it here.
const source = fs.readFileSync('src/shared/questionTypes.js', 'utf8').replace(/^import \{ questionId \} from '\.\/questionIds';$/m,
  "const questionId = (c, s, p, a) => `${c}:${s}:${String(p).trim().toLowerCase()}\\u0000${String(a).trim().toLowerCase()}`;");
const T = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const B = await import(pathToFileURL('src/shared/typedQuestions.js').href);
const problems = [], ids = new Set(), counts = {};
for (const [course, lessons] of Object.entries(B.TYPED_QUESTIONS)) for (const [skill, list] of Object.entries(lessons)) for (const q of list) {
  T.typedProblems(q).forEach(p => problems.push(`${course}/${skill} "${q.prompt.slice(0, 50)}": ${p}`));
  const id = T.typedQuestionId(course, skill, q);
  if (ids.has(id)) problems.push(`${course}/${skill} "${q.prompt.slice(0, 50)}": same question twice`); ids.add(id);
  counts[course] = counts[course] || {}; counts[course][T.typeOf(q)] = (counts[course][T.typeOf(q)] || 0) + 1;
}
for (const [course, q] of Object.entries(B.UNIT_ESSAYS)) T.typedProblems(q).forEach(p => problems.push(`${course} unit essay: ${p}`));
for (const [course, c] of Object.entries(counts)) console.log(`${course}: ${Object.entries(c).map(([t, n]) => `${n} ${T.TYPE_LABELS[t].toLowerCase()}`).join(', ')}`);
console.log(`${Object.keys(B.UNIT_ESSAYS).length} unit test paragraphs`);
if (problems.length) { console.log('PROBLEMS:\n  ' + problems.join('\n  ')); process.exit(1); }
console.log('✅ All newer-type questions are valid.');
