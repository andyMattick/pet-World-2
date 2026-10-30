/* ✍️ Red Pen Desk (owner, Oct 30, 2026; docs/RED-PEN-DESK.md): she's the teacher at her desk. Pet students turn in
   papers that use this week's words: a spelling list, or a few sentences. Each paper has ONE misspelled spelling word
   (or, about 1 in 6, none: "Looks good!"). She taps the misspelled word, types it right (no 🔊: she has to know it),
   and names the kind of mistake. Pure functions (no DOM), shared by Word Workshop (src/game/game.js), the Arcade copy
   (arcade/red-pen/) and scripts/check-red-pen.mjs. `rand` is a () => [0, 1) function.

   The misspellings are the real kinds of mistakes kids make, one edit each, named by spellingPatterns.js: every
   generated misspelling is checked with spellingPatterns(right, wrong) and kept only when that names exactly the
   pattern it was made for, it isn't another real word, and it differs from the right spelling. */

import { SPELLING_PATTERNS, spellingEdits, spellingPatterns } from './spellingPatterns.js';
import { VOCAB_WORDS, PATTERN_WORDS, syllablesOf } from './vocab.js';

export const RED_PEN_INFO = { emoji: '✍️', name: 'Red Pen Desk', how: 'You’re the teacher! Tap the misspelled word (or Looks good!), write it the right way, then say what kind of mistake it was.' };
export const RED_PEN_PAPERS = 10;          // papers in a round (Word Workshop); the Arcade round has 9
export const NO_MISTAKE_RATE = 1 / 6;      // about 1 paper in 6 has no mistake, so she can't assume there's always one
const LIST_WORDS = 4, SENTENCE_WORDS = 3;
const KIND_WEIGHT_CAP = 0.6;               // a kind only one or two words can show gets at most this weight (1 / √count otherwise)  // spelling words on a list paper / a sentence paper

/* the pet students who turn papers in */
export const PET_STUDENTS = [['🐶', 'Biscuit'], ['🐱', 'Mittens'], ['🐰', 'Clover'], ['🐹', 'Peanut'], ['🦊', 'Rusty'], ['🐢', 'Shelly'], ['🐼', 'Bao'], ['🐸', 'Hopper'], ['🐨', 'Koko'], ['🦔', 'Spike'], ['🐧', 'Waddles'], ['🐦', 'Pip'], ['🐭', 'Nibbles'], ['🦉', 'Hoot']];

/* short names for the choices (the full name and tip are in spellingPatterns.js) */
export const PATTERN_SHORT = { prePer: 'pre / per / pro at the start', ieEi: 'ie or ei', double: 'Double letters', antEnt: '-ant / -ent, -ance / -ence', ibleAble: '-ible / -able', tionSion: '-tion / -sion / -cian', softC: 'c that sounds like s or k', swap: 'Letters switched', schwa: 'The quiet “uh” vowel', missing: 'Missing letters', extra: 'Extra letters' };
export const PATTERN_IDS = SPELLING_PATTERNS.map(p => p.id);

/* Real words a misspelling must never be. Pet World's word lists are added in realWords(); this is a small list of
   common words, plus real words that one of the edits below can make from a list word (found by
   scripts/check-red-pen.mjs against a full dictionary). */
const COMMON = `a about above across act add after again against age ago agree air all almost alone along already also always am among an and animal another answer any appear apple are area arm around art as ask at away back bad bag ball band bank base be bear beat became because become bed been before began begin behind being believe bell below best better between big bird bit black block blood blow blue board boat body bone book born both bottom box boy branch bread break bright bring broad brother brought brown build built burn busy but buy by call came camp can cannot capital car card care carry case cat catch caught cause cell cent center certain chair chance change character charge chart check chick chief child children choose church circle city claim class clean clear climb clock close cloth cloud coast coat cold collect college colony color column come common company compare complete condition consider contain continue control cook cool copy corn corner correct cost cotton could count country course cover cow crease create crop cross crowd cry current cut dad dance danger dark day dead deal dear death decide deep degree depend describe desert design desk detail determine develop device devise dictionary did die differ direct discuss distant divide do doctor does dog dollar done door double down draw dream dress drink drive drop dry duck during each ear early earth ease east eat edge effect egg eight either electric element else end enemy energy engine enough enter equal especially even evening event ever every exact example except excite exercise expect experience experiment eye face fact fair fall family famous far farm fast fat father favor fear feed feel feet fell felt few field fig fight figure fill final find fine finger finish fire firm first fish fit five flat floor flow flower fly follow food foot for force forest form forward found four free fresh friend from front fruit full fun game garden gas gather gave general gentle get gift girl give glad glass go gold gone good got govern grand grass gray great green grew ground group grow guess guide gun had hair half hand happen happy hard has hat have he head hear heard heart heat heavy held help her here high hill him his history hit hold hole home hope horse hot hour house how huge human hundred hunt hurry ice idea if imagine in inch include indicate industry insect instant instrument interest invent iron is island it job join joy jump just keep kept key kill kind king kitchen knew know lady lake land language large last late laugh law lay lead learn least leave led left leg less let letter level lie life lift light like line liquid list listen little live locate log lone long look lose loose lost lot loud love low machine made magnet main major make man many map mark market mass master match material matter may me mean meant measure meat meet melody men metal method middle might mile milk million mind mine minute miss mix modern molecule moment money month moon more morning most mother motion mount mountain mouth move much music must my name nation natural nature near necessary neck need neighbor never new next night nine no noise none noon nor north nose not note nothing notice noun now number numeral object observe occur ocean of off offer office often oh oil old on once one only open operate opposite or order organ original other our out over own oxygen page paint pair paper paragraph parent part particular party pass past path pattern pay people perhaps period person phrase pick picture piece pitch place plain plan plane planet plant play please plural poem point poor populate port pose position possible post pound power practice prepare present press pretty print probable problem process produce product proper property protect prove provide pull push put quart question quick quiet quite quotient race radio rail rain raise ran range rather reach read ready real reason receive record red region remember repeat reply represent require rest result rich ride right ring rise river road rock roll room root rope rose round row rub rule run safe said sail salt same sand sat save saw say scale school science score sea search season seat second section see seed seem segment select self sell send sense sent sentence separate serve set settle seven several shall shape share sharp she sheet shell shine ship shoe shop shore short should shoulder shout show side sight sign silent silver similar simple since sing single sister sit six size skill skin sky slave sleep slip slow small smell smile snow so soft soil soldier solution solve some son song soon sound south space speak special speech speed spell spend spoke spot spread spring square stand star start state station stay stead steam steel step stick still stone stood stop store story straight strange stream street stretch string strong student study subject substance subtract success such sudden suffix sugar suggest suit summer sun supply support sure surface surprise swim syllable symbol system table tail take talk tall teach team teeth tell temperature ten term test than thank that the their them then there these they thick thin thing think third this those though thought thousand three through throw thus tie time tiny tire to together told tone too took tool top total touch toward town track trade train travel tree triangle trip trouble truck true try tube turn twenty two type under unit until up us use usual valley value vary verb very view village visit voice vowel wait walk wall want war warm was wash watch water wave way we wear weather week weight well went were west what wheel when where whether which while white who whole whose why wide wife wild will win wind window wing winter wire wish with woman women wonder wood word work world would write written wrong wrote yard year yellow yes yet you young your
  preform perscribe prosecute persecute proceed precede perceed purpose propose prefect perfect pervert provert protest pretest preview prevue pursue peruse person prison prism poison
  affect effect accept except advice advise lose loose quiet quite desert dessert principal principle stationary stationery council counsel dependant dependent assistance assistants patience patients presence presents residence residents
  sense since cents scents sell cell sent cent seen scene site sight cite pore pour poor
  circe confidant date dato eagre fied filed patten pervious premise prospective scare wader waner`;
let COMMON_SET = null;
const commonSet = () => COMMON_SET || (COMMON_SET = new Set(COMMON.split(/\s+/).filter(Boolean)));
const BUILT_IN = () => [...VOCAB_WORDS, ...PATTERN_WORDS].map(v => v.w.toLowerCase());
/** every real word a misspelling must not be: the common list, Pet World's word lists, and `extra` (her own words) */
export function realWords(extra = []){
  const s = new Set(commonSet());
  for (const w of [...BUILT_IN(), ...extra]) s.add(String(typeof w === 'object' && w ? w.w : w).trim().toLowerCase());
  return s;
}
/* a misspelling is a real word if it, or it with a common ending taken off, is on the list */
export function isRealWord(t, real){
  const w = String(t).toLowerCase();
  if (real.has(w)) return true;
  for (const [end, add] of [['s', ''], ['es', ''], ['ed', ''], ['ed', 'e'], ['d', ''], ['ing', ''], ['ing', 'e'], ['er', ''], ['ly', ''], ['ies', 'y'], ['ied', 'y']])
    if (w.length > end.length + 2 && w.endsWith(end) && real.has(w.slice(0, -end.length) + add)) return true;
  return false;
}

const VOW = 'aeiou', isV = c => VOW.includes(c), isC = c => /[a-z]/.test(c) && !isV(c);
/* the spelling word inside a sentence token, with the ending a sentence adds ("___s" → contrasts) */
export const plainWord = w => /^[a-z]{4,}$/i.test(String(w || ''));   // one plain word, 4+ letters (a red-pen word)

/* ---------- the misspellings: every realistic one-edit mistake of each kind ---------- */
const CANDIDATES = {
  prePer: r => { const s = r.slice(0, 3), to = { pre: ['per'], per: ['pre'], pro: ['per'] }[s]; return to && r.length >= 6 ? to.map(x => x + r.slice(3)) : []; },   // predict → perdict, perform → preform, produce → perduce
  ieEi: r => { const out = []; for (let i = 0; i < r.length - 1; i++) { const two = r.slice(i, i + 2); if (two === 'ie' || two === 'ei') out.push(r.slice(0, i) + two[1] + two[0] + r.slice(i + 2)); } return out; },
  double: r => {
    const out = [];
    for (let i = 1; i < r.length - 1; i++) if (r[i] === r[i - 1] && isC(r[i])) out.push(r.slice(0, i) + r.slice(i + 1));   // accurate → acurate
    return out;
  },
  antEnt: r => {
    if (r.length < 6 || /ment$/.test(r)) return [];
    const pairs = [['ance', 'ence'], ['ence', 'ance'], ['ancy', 'ency'], ['ency', 'ancy'], ['ant', 'ent'], ['ent', 'ant']];
    const p = pairs.find(([a]) => r.endsWith(a)); return p ? [r.slice(0, -p[0].length) + p[1]] : [];
  },
  ibleAble: r => (r.length >= 6 && /[^aeiou](ible|able)$/.test(r) ? [r.slice(0, -4) + (r.endsWith('ible') ? 'able' : 'ible')] : []),
  tionSion: r => {
    if (/stion$/.test(r) || r.length < 6) return [];
    if (r.endsWith('ssion')) return [r.slice(0, -5) + 'tion'];
    if (r.endsWith('tion')) return [r.slice(0, -4) + 'sion'];
    if (r.endsWith('sion')) return [r.slice(0, -4) + 'tion'];
    if (r.endsWith('cian')) return [r.slice(0, -4) + 'tion', r.slice(0, -4) + 'sion'];
    return [];
  },
  softC: r => {
    const out = [];
    for (let i = 0; i < r.length - 1; i++) {
      if (r[i] !== 'c' || r[i - 1] === 's' || r[i - 1] === 'c' || 'hkc'.includes(r[i + 1])) continue;
      if ('eiy'.includes(r[i + 1])) out.push(r.slice(0, i) + 's' + r.slice(i + 1));        // precise → presise
      else if (i > 0 && 'aou'.includes(r[i + 1])) out.push(r.slice(0, i) + 'k' + r.slice(i + 1));   // calculate → calkulate (never the first letter)
    }
    return out;
  },
  /* the switches kids make: two vowels (becuase), r with a, e or i (hunderd, migartion), l with a or e (calcualte);
     never the first two letters, never after q */
  swap: r => { const out = []; for (let i = 2; i < r.length - 1; i++) { const a = r[i], b = r[i + 1], pair = a + b; if (a === b || r[i - 1] === 'q' || r[i - 1] === b || r[i + 2] === a || /^(ie|ei)$/.test(pair) || (i + 1 === r.length - 1 && b === 'e')) continue; if ((isV(a) && isV(b)) || /^(r[aei]|[aei]r|l[ae]|[ae]l)$/.test(pair)) out.push(r.slice(0, i) + b + a + r.slice(i + 2)); } return out; },
  schwa: r => {
    /* the quiet vowel: a syllable said "uh" or "ih" (vocab.js's syllables to say: hes-ih-tate, sum-uh-rize), a reduced
       "-ul"/"-un" ending, or a written vowel said as a short i (hon-ist for honest); or, for a word vocab.js doesn't
       know, a lone vowel in the middle of a long word. Never an "ur" syllable: an r-controlled vowel is often the
       stressed one (in-FER, de-TER-mine, com-FOR-ta-ble), so it isn't a quiet vowel (review, Oct 30) */
    const out = [], syl = syllablesOf(r);
    if (syl.known && syl.show.length === syl.say.length) {
      let at = 0;
      syl.show.forEach((part, i) => {
        const vs = [...part].map((c, j) => (isV(c) ? j : -1)).filter(j => j >= 0);
        const pos = at + (vs[0] ?? 0);   // never the last letter (a silent e) or a vowel next to another vowel
        const said = syl.say[i], shownV = part[vs[0]], saidV = (said.match(/[aeiou]/g) || []);
        const saidI = saidV.length === 1 && saidV[0] === 'i' && 'ae'.includes(shownV) && !/r/.test(said);   // hon-est said "ist": written as said (honist)
        /* "-ul"/"-un" only when it's written with another vowel (vi-ron said "run", ob-sta-cle said "kul"): a-BUN-dant and
           grate-FUL are said as written, so they aren't quiet vowels */
        const quiet = /uh|ih/.test(said) || (/ul$|un$/.test(said) && shownV !== 'u') || saidI;
        if (i > 0 && quiet && !/ur/.test(said) && vs.length === 1 && pos < r.length - 1 && !isV(r[pos - 1]) && !isV(r[pos + 1])) for (const v of (saidI ? 'i' : 'aei')) if (v !== r[pos]) out.push(r.slice(0, pos) + v + r.slice(pos + 1));
        at += part.length;
      });
      return out;
    }
    if (r.length < 7) return out;
    for (let i = 3; i < r.length - 3; i++) if (isV(r[i]) && isC(r[i - 1]) && isC(r[i + 1]) && r[i] !== 'u') for (const v of 'aei') if (v !== r[i]) out.push(r.slice(0, i) + v + r.slice(i + 1));
    return out;
  },
  /* the letters kids drop: r before another consonant (suprise, obseve), n before m (enviroment), r after a consonant (libary), d before g, t before ch */
  missing: r => { const out = []; for (let i = 2; i < r.length - 1; i++) { const a = r[i - 1], c = r[i], b = r[i + 1]; if (a === c || b === c) continue; if ((c === 'r' && 'eou'.includes(a) && isC(b) && i >= 3) || (c === 'n' && b === 'm') || (c === 'r' && isC(a) && i >= 3 && isV(b)) || (c === 'd' && b === 'g') || (c === 't' && b === 'c' && r[i + 2] === 'h')) out.push(r.slice(0, i) + r.slice(i + 1)); } return out; },
  /* an extra vowel sound kids really write: e before the r of "str", "mbr" or "ndr" (disasterous, demonsterate,
     umberella, hinderance), or between th and l (athelete). Not "ntr" (contrast → conterast isn't a real mistake:
     review, Oct 30) */
  extra: r => { const out = []; for (let i = 3; i < r.length - 1; i++) if ((r[i] === 'r' && /^(st|mb|nd)$/.test(r.slice(i - 2, i))) || (r[i] === 'l' && r[i - 1] === 'h' && r[i - 2] === 't')) out.push(r.slice(0, i) + 'e' + r.slice(i)); return out; },
};
/** every fair misspelling of a word, as [{wrong, pattern}]: one realistic edit, named by spellingPatterns() as exactly
    that pattern, not a real word (`real`: realWords()), and different from the word */
const MIS_CACHE = new WeakMap();   // real-word set → word → its misspellings (a round asks for each word many times)
export function misspellingsOf(word, real = realWords()){
  const r = String(word || '').toLowerCase();
  if (!plainWord(r)) return [];
  let byWord = MIS_CACHE.get(real); if (!byWord) MIS_CACHE.set(real, byWord = new Map());
  if (!byWord.has(r)) byWord.set(r, misspellingsUncached(r, real));
  return byWord.get(r).map(m => ({ ...m }));
}
function misspellingsUncached(r, real){
  const out = [], seen = new Set();
  for (const id of PATTERN_IDS) for (const t of (CANDIDATES[id] || (() => []))(r)) {
    if (t === r || seen.has(t) || !/^[a-z]+$/.test(t) || isRealWord(t, real) || britishSpellings(r).includes(t)) continue;
    const named = spellingPatterns(r, t);
    if (named.length !== 1 || named[0] !== id) continue;
    seen.add(t); out.push({ wrong: t, pattern: id });
  }
  return out;
}
/** the patterns that could fairly describe this misspelling (every test that passes), so none is offered as a wrong choice */
export function patternsThatFit(right, wrong){
  const r = String(right).toLowerCase(), t = String(wrong).toLowerCase(), ops = spellingEdits(r, t);
  return SPELLING_PATTERNS.filter(p => p.test(r, t, ops)).map(p => p.id);
}

/* The kinds named after a part of the word (an ending or a start). When the mistake lands inside that part, the kind
   is a fair second answer even if its test doesn't pass (posseble: "the quiet vowel", but it's also the -ible ending
   she got wrong; musisian: "c sounds like s", but it's the -cian ending), so it is never offered as a wrong choice
   (review, Oct 30). */
const ZONES = { prePer: /^(pre|per|pro|pur)/, antEnt: /(ance|ence|ancy|ency|ant|ent)$/, ibleAble: /(ible|able)$/, tionSion: /(ssion|tion|sion|cian)$/ };
/** where the misspelling differs from the word: [start, end) in the right spelling */
export function editSpan(right, wrong){
  const r = String(right).toLowerCase(), t = String(wrong).toLowerCase();
  let i = 0; while (i < r.length && i < t.length && r[i] === t[i]) i++;
  let j = 0; while (j < r.length - i && j < t.length - i && r[r.length - 1 - j] === t[t.length - 1 - j]) j++;
  return [i, Math.max(i + 1, r.length - j)];
}
/** the kinds a careful kid could fairly name for this misspelling: every test that passes, and every ending or start
    kind whose part of the word the mistake is in. None of them is offered as a wrong choice. */
export function kindsThatCouldFit(right, wrong){
  const r = String(right).toLowerCase(), [a, b] = editSpan(r, wrong), out = new Set(patternsThatFit(r, wrong));
  for (const [id, re] of Object.entries(ZONES)) { const m = r.match(re); if (m && a < m.index + m[0].length && b > m.index) out.add(id); }
  return [...out];
}

function shuffleWith(rand, arr){ const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function weightedPick(rand, items, weight){ const ws = items.map(weight), sum = ws.reduce((a, b) => a + b, 0); let x = rand() * sum; for (let i = 0; i < items.length; i++) { x -= ws[i]; if (x <= 0) return items[i]; } return items[items.length - 1]; }

/** 4 pattern choices: the right one and 3 that can't fairly describe this misspelling (kindsThatCouldFit), in a
    random order. Wrong choices are picked by how often each kind is the right answer this week (`weights`:
    answerShares, raised to the 1.5 so the common kinds show up as wrong choices as often as they're right), so a kind
    that's often right is often a wrong choice too and "pick the usual answer" doesn't pay. */
export function patternChoices(right, wrong, answer, rand, weights = {}){
  const fit = new Set(kindsThatCouldFit(right, wrong));
  let pool = PATTERN_IDS.filter(id => id !== answer && !fit.has(id));
  const picked = [];
  while (picked.length < 3 && pool.length) { const id = weightedPick(rand, pool, x => (weights[x] || 1) ** 1.5); picked.push(id); pool = pool.filter(x => x !== id); }
  return shuffleWith(rand, [answer, ...picked]);
}

/* the sentence for a word with the word in it: its example sentence (`s`, with ___), plus any ending glued to the
   blank ("___s"). Returns {before, end, after} or null when there is no usable sentence. */
function sentenceParts(v){
  const s = String(v.s || '');
  const m = s.match(/^(.*?)_{3}([a-z]*)(.*)$/i);
  if (!m || /_{3}/.test(m[3]) || (m[1] + m[3]).length < 8) return null;
  return { before: m[1], end: m[2], after: m[3] };
}
const cap = (s, first) => (first ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/** Builds one paper. `words` are this week's word objects ({w, d, s}); `real` the real-word set; `weights` how often
    each pattern should be the answer; `state` the round so far ({targets: Map word → times misspelled, wrongs: Set of
    misspellings used}), kept up to date here. Returns {id, pet, kind, lines, slots, target, wrong, pattern, choices} where
    lines are [{text} | {slot}] pieces, slots are [{k, right, shown}] (right/shown are the token as written on the
    paper: the right spelling and what the pet wrote), target is the misspelled slot (-1: no mistake). */
export function makePaper(words, rand, { real = realWords(words), weights = {}, noMistake = NO_MISTAKE_RATE, id = 'p1', kind = '', pet = null, state = null, shares = weights } = {}){
  const pool = words.filter(v => plainWord(v.w) && !v.lang);
  const withSentence = pool.filter(v => sentenceParts(v));
  const k = kind || (withSentence.length >= SENTENCE_WORDS && rand() < 0.5 ? 'sentences' : 'list');
  const n = k === 'sentences' ? SENTENCE_WORDS : LIST_WORDS;
  const from = k === 'sentences' ? withSentence : pool;
  if (from.length < n) return null;
  const clean = shuffleWith(rand, from.filter(v => misspellingsOf(v.w, real).length));
  const free = shuffleWith(rand, from.filter(v => !clean.includes(v)));
  const none = rand() < noMistake;
  /* The paper's words first, evenly from the week's words that can be misspelled (a word that can't be is only used
     when there aren't enough), then the misspelled one among them: evenly, but a word that was already the misspelled
     one this round is much less likely to be again. So every word is the misspelled one about equally often when it's
     on a paper, and its length or place says nothing. Then one of its misspellings this round hasn't used, then the
     kind of mistake by its (capped) weight. (Review, Oct 30: picking the kind of mistake first made the one word that
     can show a rare kind the misspelled word almost every time it was on a paper, so she could learn which word to tap
     without reading it.) */
  let target = -1, mis = null;
  const chosen = [...clean, ...free].slice(0, n);   // both already shuffled
  if (!none && chosen.some(v => clean.includes(v))) {
    const st = state || { targets: new Map(), wrongs: new Set() }, times = v => st.targets.get(v.w.toLowerCase()) || 0;
    const tv = weightedPick(rand, chosen.filter(v => clean.includes(v)), v => 1 / (1 + 3 * times(v)));
    const mine = misspellingsOf(tv.w, real), fresh = mine.filter(m => !st.wrongs.has(m.wrong)), opts = fresh.length ? fresh : mine;
    const pat = weightedPick(rand, [...new Set(opts.map(m => m.pattern))], x => kindWeight(weights, x));
    const ofPat = opts.filter(m => m.pattern === pat); mis = { v: tv, ...ofPat[Math.floor(rand() * ofPat.length)] };
    st.targets.set(tv.w.toLowerCase(), times(tv) + 1); st.wrongs.add(mis.wrong);
    target = chosen.indexOf(tv);
  }
  const slots = chosen.map((v, i) => {
    const key = v.w.toLowerCase(), sp = k === 'sentences' ? sentenceParts(v) : null, end = sp ? sp.end : '';
    const first = sp ? !sp.before.trim() : false;
    const right = cap(key + end, first), shown = i === target ? cap(mis.wrong + end, first) : right;
    return { k: key, right, shown };
  });
  const lines = k === 'sentences'
    ? chosen.map((v, i) => { const sp = sentenceParts(v); return [{ text: sp.before }, { slot: i }, { text: sp.after }]; })
    : chosen.map((v, i) => [{ slot: i }]);
  const p = pet || PET_STUDENTS[Math.floor(rand() * PET_STUDENTS.length)];
  const paper = { id, pet: { e: p[0], n: p[1] }, kind: k, lines, slots, target };
  if (target >= 0) Object.assign(paper, { wrong: mis.wrong, pattern: mis.pattern, choices: patternChoices(mis.v.w, mis.wrong, mis.pattern, rand, shares) });
  return paper;
}

/** How often each pattern should be the answer, for a week's words: patterns few words allow get more weight, so the
    answers spread over the kinds of mistakes instead of piling up on the ones every word allows. The weight only
    chooses among the misspellings of the word already picked, and it's capped (KIND_WEIGHT_CAP). */
export function patternWeights(words, real = realWords(words)){
  const count = Object.fromEntries(PATTERN_IDS.map(id => [id, 0]));
  for (const v of words) if (plainWord(v.w)) for (const id of new Set(misspellingsOf(v.w, real).map(m => m.pattern))) count[id]++;
  return Object.fromEntries(PATTERN_IDS.map(id => [id, count[id] ? 1 / count[id] : 0]));
}

const kindWeight = (weights, id) => Math.min(weights[id] || 1, KIND_WEIGHT_CAP);
/** How often each kind is the right answer for a week's words, as makePaper picks them (a word evenly, then one of its
    kinds by kindWeight); a kind no word can show still gets a little, so it can be a wrong choice. */
export function answerShares(words, real = realWords(words), weights = patternWeights(words, real)){
  const share = Object.fromEntries(PATTERN_IDS.map(id => [id, 0])), ok = words.filter(v => plainWord(v.w) && !v.lang).map(v => [...new Set(misspellingsOf(v.w, real).map(m => m.pattern))]).filter(k => k.length);
  for (const kinds of ok) { const sum = kinds.reduce((a, id) => a + kindWeight(weights, id), 0); for (const id of kinds) share[id] += kindWeight(weights, id) / sum / ok.length; }
  return Object.fromEntries(PATTERN_IDS.map(id => [id, Math.max(share[id], 0.02)]));
}

/** A round of papers on this week's words (`words`: [{w, d, s}]). Different pets, alternating kinds where possible. */
export function makeRedPenRound(words, rand, { papers = RED_PEN_PAPERS, extraReal = [], noMistake = NO_MISTAKE_RATE } = {}){
  const real = realWords([...words, ...extraReal]), weights = patternWeights(words, real), shares = answerShares(words, real, weights), pets = shuffleWith(rand, PET_STUDENTS), out = [];
  const state = { targets: new Map(), wrongs: new Set() };   // spreads the misspelled words and misspellings over the round
  for (let i = 0; out.length < papers && i < papers * 3; i++) {
    const p = makePaper(words, rand, { real, weights, shares, noMistake, id: `p${out.length + 1}`, pet: pets[out.length % pets.length], state });
    if (p) out.push(p);
  }
  return out;
}

/* ---------- grading ---------- */
const norm = s => String(s || '').trim().toLowerCase().replace(/[’']/g, '');
/** step 1: tapped slot i (or -1 for "Looks good!") */
export const tapIsRight = (paper, i) => i === paper.target;
/** The British spellings of a (US) word, which count as right too (review, Oct 30): neighbour, summarise, analyse,
    centre, travelled, defence, catalogue, grey, artefact. */
export function britishSpellings(word){
  const w = norm(word), out = new Set();
  const add = (re, to) => { const x = w.replace(re, to); if (x !== w) out.add(x); };
  add(/(neighb|col|fav|behavi|hon|lab|hum|flav|harb|rum|vap|vig|od|arm|savi|endeav|cand|glam|parl|val|rig|splend|ard)or/, '$1our');
  if (w.length >= 7) add(/iz(e|ed|es|ing|ation|ations|er|ers)$/, 'is$1');
  add(/yz(e|ed|es|ing|er|ers)$/, 'ys$1');
  add(/^(cent|fib|theat|met|lit|meag|somb|spect|calib|lust)er(s?)$/, '$1re$2');
  if (w.length >= 7) add(/([^aeiou][aeiou])l(ed|ing|er|ers)$/, '$1ll$2');
  add(/^(defen|offen|preten|licen)se(s?)$/, '$1ce$2');
  add(/^(catal|dial|anal|monol|prol|epil)og(s?)$/, '$1ogue$2');
  add(/^gray/, 'grey');
  add(/^artifact/, 'artefact');
  return [...out];
}
/** step 2: the typed spelling (the word, or the word with the paper's ending; a British spelling counts too) */
export function spellingIsRight(paper, typed){
  const s = paper.slots[paper.target]; if (!s) return false;
  const ok = [s.k, s.right].map(norm);
  return [...ok, ...ok.flatMap(britishSpellings)].includes(norm(typed));
}
/** step 3 */
export const patternIsRight = (paper, id) => id === paper.pattern;
/** the paper's text as she sees it (the pet's spelling), for checks and the day log */
export const paperText = (paper, fixed = false) => paper.lines.map(line => line.map(x => (x.slot != null ? (fixed ? paper.slots[x.slot].right : paper.slots[x.slot].shown) : x.text)).join('')).join(' / ');
