// Rigor update for src/game/game.js. Run from the repo root:  node docs/rigor-update.mjs
// 1. Practice: 4 random questions, ordered easiest to hardest.
// 2. Block quizzes and unit tests: random, but weighted toward level 2-3 questions (about 15% level 1, 45% level 2, 40% level 3).
// 3. Difficulty tags for the original 44 Biology questions, and stronger wrong answers on 6 of them.
// Untagged questions (History, English) count as level 1, so they still pick at random, as before.
// Every change is checked first. If any spot is missing or appears twice, nothing is written.
import fs from 'node:fs';

const FILE = 'src/game/game.js';
let src = fs.readFileSync(FILE, 'utf8');
if (src.includes('function practiceOrder(')) { console.log('Already applied. Nothing changed.'); process.exit(0); }

const problems = [];
function replaceOnce(label, pattern, replacement) {
  const matches = src.match(new RegExp(pattern.source, 'g')) || [];
  if (matches.length !== 1) { problems.push(`${label}: found ${matches.length} times (expected 1)`); return; }
  src = src.replace(pattern, replacement);
  console.log(`ok  ${label}`);
}

// Where the helpers go: right after the Biology extra-questions merge line.
const ANCHOR = 'Object.entries(BIO1_EXTRA_QUESTIONS).forEach(([skillId, questions]) => { BIO1_QUESTIONS[skillId] = [...(BIO1_QUESTIONS[skillId] || []), ...questions]; });';
const HELPERS = `
// Difficulty tags (1-3) for the original Biology Unit 1 questions, in their order in BIO1_QUESTIONS.
const BIO1_BUILT_IN_LEVELS = {
  cellsOrganisms:[1,2,1,2], cellPartsU:[1,1,1,1], cellPartsA:[1,2,2,1], plantSuccessU:[1,1,1,2],
  plantSuccessA:[2,2,2,2], asexualPlants:[1,1,1,1], sexualPlants:[1,1,2,2], seedDispersal:[1,1,2,1],
  digestionHumans:[1,1,1,1], digestionIntestines:[1,1,2,1], humanDigestion:[2,1,1,2]
};
Object.entries(BIO1_BUILT_IN_LEVELS).forEach(([skillId, levels]) => levels.forEach((level, index) => {
  const question = BIO1_QUESTIONS[skillId]?.[index];
  if (question && question.difficulty == null) question.difficulty = level;
}));
/* Difficulty-aware picking. Untagged questions count as level 1, so untagged banks still pick at random. */
const questionLevel = question => question.difficulty || 1;
/* practice: 4 random questions, easiest first, so a practice builds up */
function practiceOrder(pool, count){
  return shuffle(pool).slice(0, count).sort((a, b) => questionLevel(a) - questionLevel(b));
}
/* quizzes and tests: weighted random order, so level 3 is 5x and level 2 is 3x as likely as level 1 to come first */
const LEVEL_WEIGHT = {1:1, 2:3, 3:5};
function leanHard(pool){
  return pool.map(question => ({question, key: Math.random() ** (1 / (LEVEL_WEIGHT[questionLevel(question)] || 1))}))
    .sort((a, b) => b.key - a.key).map(item => item.question);
}`;
if (src.split(ANCHOR).length !== 2) problems.push('helper spot (Biology merge line): not found once. Apply bio1-question-bank.patch first.');
else { src = src.replace(ANCHOR, ANCHOR + HELPERS); console.log('ok  helpers and Biology difficulty tags'); }

// Practice
replaceOnce('practice picks', /const questions = shuffle\(pool\)\.slice\(0,\s*4\);/, 'const questions = practiceOrder(pool, 4);');
// Block quizzes: pools are popped from the end, so put the hardest at the end.
replaceOnce('block quiz picks', /const pools = skillIds\.map\(skillId => shuffle\(englishQuestions\(skillId,\s*courseId\)\)\);/,
  'const pools = skillIds.map(skillId => leanHard(englishQuestions(skillId, courseId)).reverse());');
// Final unit test: slice from the start, so hardest first.
replaceOnce('unit test picks', /shuffle\(englishQuestions\(skill\.id,\s*course\.id\)\)\.slice\(0,/,
  'leanHard(englishQuestions(skill.id,course.id)).slice(0,');

// Stronger wrong answers on original questions where one choice was a giveaway.
const SWAPS = [
  ["'Bacterium','Oak tree','Dog','Human'", "'Bacterium','Mushroom','Moss','Earthworm'"],
  ["'The mouth','The large intestine','The stomach only','The skin'", "'The mouth','The large intestine','The stomach only','The esophagus'"],
  ["'Water','Most protein','Light','Oxygen'", "'Water','Most protein','Most of the fat','Bile'"],
  ["'It becomes bone','It becomes blood','It is absorbed in the mouth'", "'It is absorbed by the villi','It is stored in the liver','It goes back to the stomach'"],
  ["'By animals','By wind only','By lightning','By soil only'", "'By animals','By wind only','By water','By exploding pods'"],
  ["'By wind','By animals eating it','By water only','By fire'", "'By wind','By animals eating it','By water only','By exploding pods'"],
];
for (const [from, to] of SWAPS) {
  const count = src.split(from).length - 1;
  if (count === 1) { src = src.replace(from, to); console.log(`ok  wrong answers: ${to.slice(0, 50)}…`); }
  else console.log(`skip  wrong answers (${count} matches, left as is): ${from.slice(0, 50)}…`);
}

if (problems.length) {
  console.log('\nNOT APPLIED. game.js was not changed:\n- ' + problems.join('\n- '));
  process.exit(1);
}
fs.writeFileSync(FILE, src);
console.log('\nDone. Run `npm run build`, then try a Biology practice and quiz.');
