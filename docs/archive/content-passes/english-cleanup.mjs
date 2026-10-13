// English (Nouns, Verbs): fixes from the blind answer-key check (docs: Pet Town Question Bank Roadmap, quality pass, October 2026).
// Run from the repo root:  node docs/english-cleanup.mjs
// A reviewer answered all 294 English questions without the key and matched it on every one. This fixes the 7 it flagged:
//   3 sets of wrong answers (same ids), and 4 prompts made exact (new ids for those 4: team, flock of geese, the cat, "is").
// Every question is checked first; if any one can't be found exactly once, nothing is written. Running it twice does nothing.
import fs from 'node:fs';

const FILE = 'src/shared/questionBanks.js';
const FIXES = [
{
"course": "nouns",
"skill": "concreteAbstract",
"prompt": "Is the noun \"freedom\" concrete or abstract?",
"newPrompt": "Is the noun \"freedom\" concrete or abstract?",
"right": "Abstract: it names an idea",
"newRight": "Abstract: it names an idea",
"wrong": [
"Concrete: you can touch it",
"Concrete: it names a place",
"Abstract: it names a person"
]
},
{
"course": "nouns",
"skill": "mutantPlurals",
"prompt": "Which sentence is correct?",
"newPrompt": "Which sentence is correct?",
"right": "The mice hid in the wall.",
"newRight": "The mice hid in the wall.",
"wrong": [
"The mouses hid in the wall.",
"The mices hid in the wall.",
"A mice hid in the wall."
]
},
{
"course": "verbs",
"skill": "verbAgreement",
"prompt": "The team ___ practicing today.",
"newPrompt": "In American English, the team ___ practicing today.",
"right": "is",
"newRight": "is",
"wrong": [
"are",
"were",
"be"
]
},
{
"course": "verbs",
"skill": "verbAgreement",
"prompt": "A flock of geese ___ overhead.",
"newPrompt": "In American English, a flock of geese ___ overhead.",
"right": "flies",
"newRight": "flies",
"wrong": [
"fly",
"flying",
"are fly"
]
},
{
"course": "verbs",
"skill": "verbTense",
"prompt": "Right now, the cat ___ on the windowsill.",
"newPrompt": "Every afternoon, the cat ___ on the windowsill.",
"right": "sits",
"newRight": "sits",
"wrong": [
"sitting",
"will sat",
"sitted"
]
},
{
"course": "verbs",
"skill": "actionLinkHelping",
"prompt": "Which of these is always a linking verb?",
"newPrompt": "Which of these verbs is a form of “be,” a common linking verb?",
"right": "is",
"newRight": "is",
"wrong": [
"jump",
"throw",
"sing"
]
},
{
"course": "verbs",
"skill": "progressiveAspect",
"prompt": "While I ___, the phone rang.",
"newPrompt": "While I ___, the phone rang.",
"right": "was sleeping",
"newRight": "was sleeping",
"wrong": [
"will sleep",
"sleep",
"have been sleeping"
]
}
];

let src = fs.readFileSync(FILE, 'utf8');
const start = src.indexOf('const PLURAL_QUESTIONS = {'), end = src.indexOf('const ENGLISH_BUILT_IN_LEVELS');
if (start < 0 || end < start) { console.log('NOT APPLIED: could not find the English banks. Nothing was changed.'); process.exit(1); }
let block = src.slice(start, end);

// The English banks use three styles: {prompt:'…',options:[…],answer:n}, mc('…','…',…) and histLevel(n,"…","…",…).
// Read one quoted string at position i (either quote, with escapes) -> {value, quote, end} or null.
function readString(text, i){
  const quote = text[i]; if (quote !== "'" && quote !== '"') return null;
  let value = '';
  for (let k = i + 1; k < text.length; k++){
    if (text[k] === '\\') { value += text[++k]; continue; }
    if (text[k] === quote) return { value, quote, end: k + 1 };
    value += text[k];
  }
  return null;
}
// Every place a prompt appears as a whole string, with the four choices that follow it.
function findQuestions(prompt){
  const hits = [];
  for (const quote of ["'", '"']) {
    let from = 0;
    for (;;) {
      const at = block.indexOf(quote + prompt.replace(/\\/g, '\\\\').replace(new RegExp(quote, 'g'), '\\' + quote) + quote, from);
      if (at < 0) break; from = at + 1;
      const p = readString(block, at); if (!p || p.value !== prompt) continue;
      let k = p.end, object = false;
      if (block.startsWith(',options:[', k)) { object = true; k += ',options:['.length; } else if (block[k] === ',') k += 1; else continue;
      const choices = [];
      while (choices.length < 4) {
        const c = readString(block, k); if (!c) break;
        choices.push(c); k = c.end;
        if (choices.length < 4) { if (block[k] !== ',') break; k += 1; }
      }
      if (choices.length !== 4) continue;
      let answer = 0;
      if (object) { const m = block.slice(k).match(/^\],answer:(\d)/); if (!m) continue; answer = Number(m[1]); }
      else if (block[k] !== ')') continue;
      hits.push({ start: at, end: k, quote, choices: choices.map(c => c.value), choiceQuote: choices[0].quote, answer, object });
    }
  }
  return hits;
}
const lit = (s, quote) => quote + s.replace(/\\/g, '\\\\').replace(new RegExp(quote, 'g'), '\\' + quote) + quote;
// Wrong answers keep their places; the right answer stays where it is, so nothing else in the entry moves.
function rebuilt(hit, f){
  const choices = hit.choices.slice(); let w = 0;
  for (let n = 0; n < 4; n++) choices[n] = n === hit.answer ? f.newRight : f.wrong[w++];
  return lit(f.newPrompt, hit.quote) + (hit.object ? ',options:[' : ',') + choices.map(c => lit(c, hit.choiceQuote)).join(',');
}
const isDone = f => findQuestions(f.newPrompt).some(h => h.choices[h.answer] === f.newRight && [...h.choices].filter((c, n) => n !== h.answer).join('|') === f.wrong.join('|'));
if (FIXES.every(isDone)) { console.log('Already applied. Nothing changed.'); process.exit(0); }
const problems = [];
for (const f of FIXES) {
  if (isDone(f)) continue;
  if (new Set([f.newRight, ...f.wrong].map(c => c.toLowerCase())).size !== 4) { problems.push(`${f.skill}: choices are not 4 different answers`); continue; }
  const hits = findQuestions(f.prompt).filter(h => h.choices[h.answer] === f.right);
  if (hits.length !== 1) { problems.push(`${f.course}/${f.skill} "${f.prompt.slice(0, 50)}…": found ${hits.length} times (expected 1)`); continue; }
  const h = hits[0];
  block = block.slice(0, h.start) + rebuilt(h, f) + block.slice(h.end);
}
if (problems.length) { console.log('NOT APPLIED. Nothing was changed:\n  ' + problems.join('\n  ')); process.exit(1); }
fs.writeFileSync(FILE, src.slice(0, start) + block + src.slice(end));
console.log(`Done: ${FIXES.length} English questions now have cleaned-up answer choices.`);
