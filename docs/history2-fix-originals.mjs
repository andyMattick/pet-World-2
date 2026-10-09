// History Unit 2: fix the original 20 questions where the right answer is the longest choice.
// Run from the repo root:  node docs/history2-fix-originals.mjs
// Only the answer choices change. Prompts, order, the correct answer's position (first, before shuffling)
// and the difficulty tags in HISTORY2_BUILT_IN_LEVELS stay the same. Silly wrong answers are replaced with believable ones.
// Every question is checked first. If any one can't be found exactly once, nothing is written. Running it twice does nothing.
import fs from 'node:fs';

const FILE = 'src/game/game.js';
let src = fs.readFileSync(FILE, 'utf8');

// [skillId, the current correct answer (used to find the question), new choices with the correct one first]
const FIXES = [
  ['earliestHumans', 'As foragers', ['As foragers', 'As farmers', 'As herders', 'As city dwellers']],
  ['earliestHumans', 'The shift toward farming and settled life', ['The shift toward farming and settled life', 'The first use of metal tools and weapons', 'The move out of Africa to other continents', 'The rise of the first cities and kings']],
  ['earliestHumans', 'It reveals changes and continuities in how people live', ['It shows what changed and what stayed the same', 'It proves that life today is better in every way', 'It shows that the past was just like today', 'It tells us which way of life was correct']],
  ['migrationArt', 'Africa', ['Africa', 'Europe', 'Asia', 'Australia']],
  ['migrationArt', 'Clues about beliefs, skills, and communities, though not everything', ['Clues about our beliefs and skills', 'The exact thoughts of every painter', 'The names of the people who made them', 'A full record of everything we did']],
  ['migrationArt', 'People communicated and expressed ideas in ways other than writing', ['People shared ideas in ways other than writing', 'Writing had already spread to every group', 'Art was made only for decoration, never for meaning', 'People could not think in symbols yet']],
  ['migrationArt', 'Compare them with other evidence about the people and place', ['Compare them with other evidence', 'Assume they explain the whole culture', 'Ignore them because they have no words', 'Use them to find the artist’s exact name']],
  ['foragingSocieties', 'Hunting and gathering', ['Hunting and gathering', 'Planting and harvesting', 'Herding and trading', 'Fishing and farming']],
  ['foragingSocieties', 'People needed to know plants, animals, seasons, and places', ['Food sources change with place and season', 'Food stays in the same spot all year', 'Only the band leader needs to know anything', 'Every wild plant is safe to eat anyway']],
  ['foragingSocieties', 'By sharing skills, knowledge, and support', ['By sharing skills, knowledge, and support', 'By having each family hunt on its own', 'By storing food in large stone granaries', 'By following orders from one powerful chief']],
  ['foragingSocieties', 'They could exchange information, goods, and help', ['They could trade goods and share news', 'They kept each band from ever moving', 'They made learning new skills unnecessary', 'They let one band rule all the others']],
  ['agriculturalRevolution', 'Growing crops and raising animals for food', ['Growing crops and raising animals for food', 'Gathering wild plants and hunting game', 'Moving with the herds from season to season', 'Trading food with neighboring bands']],
  ['agriculturalRevolution', 'It can produce more food in one place', ['It can produce more food in one place', 'It guarantees good health for everyone', 'It removes the danger of drought', 'It means less work than foraging']],
  ['agriculturalRevolution', 'Crops could fail and diets could become less varied', ['Crops could fail in a bad year', 'People would no longer plan ahead', 'Villages would shrink every year', 'Diets would include more kinds of food']],
  ['agriculturalRevolution', 'Reliable food supported settled communities', ['Reliable food supported settled communities', 'It made trade between groups impossible', 'It ended the need for people to work together', 'It allowed people to stop using tools']],
  ['biggestMistake', 'Diet, communities, lifestyles, networks, and production', ['Diet, work, homes, and trade', 'Only the food people ate', 'Only the weather and seasons', 'Nothing except the tools people used']],
  ['biggestMistake', 'Compare evidence about benefits and costs for different people', ['Weigh benefits and costs for different people', 'Accept it because it sounds so dramatic', 'Look only at the problems that farming caused', 'Use one object from the village as proof']],
  ['biggestMistake', 'Farming created new possibilities and new problems', ['Farming brought new benefits and new problems', 'Farming had no real effects on daily life', 'Everyone in the village experienced farming the same way', 'Farming solved every problem foragers had']],
  ['biggestMistake', 'Production and distribution', ['Production and distribution', 'Climate and geography', 'Leaders, laws, and government', 'Wars and battles']]
];

const start = src.indexOf('const HISTORY2_QUESTIONS = {');
const end = src.indexOf('const HISTORY2_EXTRA_QUESTIONS');
if (start < 0 || end < start) { console.log('NOT APPLIED: could not find the History Unit 2 question bank. game.js was not changed.'); process.exit(1); }
let block = src.slice(start, end);

const quote = s => `'${s}'`;
const firstNew = `options:[${FIXES[0][2].map(quote).join(',')}]`;
const lastNew = `options:[${FIXES[FIXES.length - 1][2].map(quote).join(',')}]`;
if (block.includes(firstNew) && block.includes(lastNew)) { console.log('Already applied. Nothing changed.'); process.exit(0); }

const problems = [];
for (const [skillId, oldCorrect, choices] of FIXES) {
  if (choices.some(c => c.includes("'"))) { problems.push(`${skillId}: a new choice contains a straight apostrophe`); continue; }
  if (new Set(choices).size !== 4) { problems.push(`${skillId}: new choices are not 4 different answers`); continue; }
  const pattern = new RegExp(`options:\\[${quote(oldCorrect).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},[^\\]]*\\],answer:0`, 'g');
  const matches = block.match(pattern) || [];
  if (matches.length !== 1) { problems.push(`${skillId} "${oldCorrect}": found ${matches.length} times (expected 1)`); continue; }
  block = block.replace(pattern, `options:[${choices.map(quote).join(',')}],answer:0`);
  const longestWrong = Math.max(...choices.slice(1).map(c => c.length));
  console.log(`ok  ${skillId.padEnd(22)} right ${String(choices[0].length).padStart(2)} / longest wrong ${String(longestWrong).padStart(2)}`);
}

if (problems.length) {
  console.log('\nNOT APPLIED. game.js was not changed:\n  ' + problems.join('\n  '));
  process.exit(1);
}
src = src.slice(0, start) + block + src.slice(end);
fs.writeFileSync(FILE, src);
console.log(`\nDone: ${FIXES.length} History Unit 2 questions fixed. Run \`npm run build\`, then try a History Unit 2 practice.`);
