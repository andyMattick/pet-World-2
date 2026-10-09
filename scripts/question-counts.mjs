// Question counts per lesson, to check that moving the banks out of game.js changed nothing.
//   node scripts/question-counts.mjs                      counts in src/shared/questionBanks.js
//   node scripts/question-counts.mjs <old game.js>        also counts the banks in an older game.js and compares
// Example: git show 6d2eec1:src/game/game.js > /tmp/old-game.js && node scripts/question-counts.mjs /tmp/old-game.js
import fs from 'node:fs';
import vm from 'node:vm';

const BANKS = ['HISTORY_QUESTIONS', 'HISTORY2_QUESTIONS', 'HISTORY3_QUESTIONS', 'HISTORY4_QUESTIONS', 'BIO1_QUESTIONS', 'PLURAL_QUESTIONS', 'VERB_QUESTIONS'];
// The blocks that were cut from game.js, by their first line and the line that followed them.
const SEGMENTS = [
  ['const ENGLISH_UNIT1 = [', 'const isHistoryCourse = '],
  ['const mc = (prompt, correct, ...wrong)', '/* History and Biology role play'],
  ['const BIO1_QUESTIONS = {', '/* Difficulty-aware picking.'],
  ['const KHAN = ', '/* exact lesson URLs are used where known'],
  ['const q = (prompt, correct, ...wrong)', 'let englishRun = null'],
];

function bankCode(text, fromGame) {
  if (!fromGame) {
    const start = text.indexOf('const ENGLISH_UNIT1 = ['), end = text.indexOf('/* ---------- end of the moved banks');
    if (start < 0 || end < start) throw new Error('questionBanks.js: could not find the moved banks');
    return text.slice(start, end);
  }
  return SEGMENTS.map(([first, next]) => {
    const start = text.indexOf(first), end = text.indexOf(next, start);
    if (start < 0 || end < 0) throw new Error(`old game.js: could not find the block starting "${first}"`);
    return text.slice(start, end);
  }).join('');
}
function counts(code) {
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${code}\nglobalThis.__banks = {${BANKS.join(',')}};`, context);
  const result = {};
  for (const bank of BANKS) for (const [lesson, list] of Object.entries(context.__banks[bank])) result[`${bank}.${lesson}`] = list.length;
  return result;
}

const after = counts(bankCode(fs.readFileSync('src/shared/questionBanks.js', 'utf8'), false));
const oldPath = process.argv[2];
const before = oldPath ? counts(bankCode(fs.readFileSync(oldPath, 'utf8'), true)) : null;
let total = 0, mismatches = 0;
for (const key of [...new Set([...Object.keys(before || {}), ...Object.keys(after)])]) {
  total += after[key] || 0;
  const same = !before || before[key] === after[key];
  if (!same) mismatches++;
  console.log(`${same ? 'ok ' : 'DIFF'} ${key.padEnd(44)} ${before ? `${String(before[key] ?? '-').padStart(3)} -> ` : ''}${String(after[key] ?? '-').padStart(3)}`);
}
console.log(`\n${Object.keys(after).length} lessons, ${total} questions.${before ? (mismatches ? ` ${mismatches} lesson(s) DIFFER.` : ' Every lesson matches.') : ''}`);
process.exit(mismatches ? 1 : 0);
