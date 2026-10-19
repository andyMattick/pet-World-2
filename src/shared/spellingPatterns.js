/* Spelling mistake patterns (docs/VOCAB.md, "Spelling patterns"). When a student misspells a word in Word Workshop,
   the typed word is lined up with the right one and the difference is named: per for pre, a missing double letter,
   ie for ei, -ant for -ent, and so on. The game keeps the last misses in S.vocab.mistakes; the teacher app counts
   them per student and suggests words that practice the same pattern. Shared by the game and the teacher app. */

const VOWELS = 'aeiou';
const isVowel = c => VOWELS.includes(c);

/* the edits that turn the right word into what was typed: [{op:'sub'|'del'|'ins'|'swap', i, a, b}] (i = position in the right word) */
export function spellingEdits(right, typed){
  const a = right, b = typed, n = a.length, m = b.length, d = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) d[i][0] = i;
  for (let j = 0; j <= m; j++) d[0][j] = j;
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1] && a[i - 1] !== a[i - 2]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  const ops = [];
  for (let i = n, j = m; i > 0 || j > 0;) {
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1] && a[i - 1] !== a[i - 2] && d[i][j] === d[i - 2][j - 2] + 1) { ops.push({ op: 'swap', i: i - 2, a: a.slice(i - 2, i), b: b.slice(j - 2, j) }); i -= 2; j -= 2; }
    else if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) { if (a[i - 1] !== b[j - 1]) ops.push({ op: 'sub', i: i - 1, a: a[i - 1], b: b[j - 1] }); i--; j--; }
    else if (i > 0 && d[i][j] === d[i - 1][j] + 1) { ops.push({ op: 'del', i: i - 1, a: a[i - 1], b: '' }); i--; }
    else { ops.push({ op: 'ins', i, a: '', b: b[j - 1] }); j--; }
  }
  return ops.reverse();
}

const ending = (w, list) => list.find(e => w.endsWith(e)) || '';
const START = ['pre', 'per', 'pro', 'pur', 'pri', 'par'];

/* Each pattern: what it's called, a tip for the student, a test on (right word, what was typed, the edits), and which
   words practice it. Checked in this order; a miss can match more than one. */
export const SPELLING_PATTERNS = [
  { id: 'prePer', name: 'pre / per / pro at the start', tip: 'Say the first part slowly: PRE-dict, PER-form, PRO-tect.',
    test: (r, t) => START.includes(r.slice(0, 3)) && START.includes(t.slice(0, 3)) && r.slice(0, 3) !== t.slice(0, 3),
    words: w => /^(pre|per|pro|pur)[a-z]{3,}/.test(w) && !/^(prey|predator)$/.test(w) },
  { id: 'ieEi', name: 'ie or ei', tip: 'i before e, except after c, or when it sounds like “ay” (neighbor).',
    test: (r, t, ops) => ops.some(o => o.op === 'swap' && /^(ie|ei)$/.test(o.a)),
    words: w => /ie|ei/.test(w) },
  { id: 'double', name: 'Double letters', tip: 'Listen for the short vowel before the double: ap-PROX, ac-CUR-ate, sum-MA-rize.',
    test: (r, t, ops) => ops.length > 0 && ops.every(o => (o.op === 'del' && (r[o.i - 1] === o.a || r[o.i + 1] === o.a)) || (o.op === 'ins' && (r[o.i - 1] === o.b || r[o.i] === o.b))),
    words: w => /([a-z])\1/.test(w) },
  { id: 'antEnt', name: '-ant / -ent, -ance / -ence', tip: 'These endings sound the same. Learn each word: relevANT, persistENT, consequENCE.',
    test: (r, t) => { const a = ending(r, ['ance', 'ence', 'ant', 'ent', 'ancy', 'ency']), b = ending(t, ['ance', 'ence', 'ant', 'ent', 'ancy', 'ency']); return !!a && !!b && a !== b && r.slice(0, -a.length) === t.slice(0, -b.length); },
    words: w => /(ant|ent|ance|ence|ancy|ency)$/.test(w) },
  { id: 'ibleAble', name: '-ible / -able', tip: 'If you can hear a whole word before it (comfort-able), it’s usually -able. Otherwise often -ible (respons-ible).',
    test: (r, t) => /(ible|able)$/.test(r) && /(ible|able)$/.test(t) && r.slice(-4) !== t.slice(-4),
    words: w => /(ible|able)$/.test(w) },
  { id: 'tionSion', name: '-tion / -sion / -cian (the “shun” ending)', tip: 'Most “shun” endings are -tion. “zhun” is -sion (con-clu-SION). People jobs are -cian (musician).',
    test: (r, t) => /(tion|sion|cian|ssion)$/.test(r) && /(tion|sion|cian|shun|shon|chun|ssion|tin|shin)$/.test(t) && ending(r, ['ssion', 'tion', 'sion', 'cian']) !== ending(t, ['ssion', 'tion', 'sion', 'cian']),
    words: w => /(tion|sion|cian)$/.test(w) },
  { id: 'softC', name: 'c that sounds like s or k', tip: 'c before e, i or y sounds like s (pre-CISE, CEN-tury). c before a, o or u sounds like k (CAL-culate).',
    test: (r, t, ops) => ops.length > 0 && ops.some(o => o.op === 'sub' && o.a === 'c' && (o.b === 's' || o.b === 'k')) && ops.every(o => o.op === 'sub' && ((o.a === 'c' && 'sk'.includes(o.b)) || isVowel(o.a))),
    words: w => /c[eiy]|c[aou]/.test(w) },
  { id: 'swap', name: 'Letters switched', tip: 'Spell it out loud slowly, one letter at a time, and check the order.',
    test: (r, t, ops) => ops.some(o => o.op === 'swap'), words: () => false },
  { id: 'schwa', name: 'The quiet “uh” vowel', tip: 'Say the word in a “spelling voice”: rel-E-vant, sep-A-rate. Stretch the quiet vowel.',
    test: (r, t, ops) => ops.length > 0 && ops.every(o => o.op === 'sub' && isVowel(o.a) && isVowel(o.b)),
    words: w => w.length >= 7 },
  { id: 'missing', name: 'Missing letters or sounds', tip: 'Clap the syllables and spell one syllable at a time: en-vi-ron-ment.',
    test: (r, t, ops) => ops.length > 0 && ops.every(o => o.op === 'del'), words: w => w.length >= 8 },
  { id: 'extra', name: 'Extra letters', tip: 'Check each syllable: is every letter you wrote in the word you hear?',
    test: (r, t, ops) => ops.length > 0 && ops.every(o => o.op === 'ins'), words: () => false }
];
export const patternById = id => SPELLING_PATTERNS.find(p => p.id === id);

/** The patterns a misspelling shows, most specific first (empty when the typed word is far off). */
export function spellingPatterns(right, typed){
  const r = String(right || '').toLowerCase().trim(), t = String(typed || '').toLowerCase().trim().replace(/[^a-z'-]/g, '');
  if (!r || !t || r === t) return [];
  const ops = spellingEdits(r, t);
  if (ops.length > Math.max(3, Math.ceil(r.length / 2))) return [];   // a different word, not a misspelling
  const hits = SPELLING_PATTERNS.filter(p => p.test(r, t, ops)).map(p => p.id);
  /* the specific ones say more than the general ones */
  const specific = hits.filter(id => !['swap', 'schwa', 'missing', 'extra'].includes(id));
  return specific.length ? specific : hits.slice(0, 1);
}

/** Count of each pattern in a list of misses ({w, typed, kinds}), most common first, with up to 3 examples. */
export function patternSummary(mistakes){
  const by = new Map();
  for (const m of Array.isArray(mistakes) ? mistakes : []) for (const id of m.kinds || []) {
    const x = by.get(id) || { id, n: 0, examples: [] }; x.n++;
    if (x.examples.length < 3 && !x.examples.some(e => e.w === m.w)) x.examples.push({ w: m.w, typed: m.typed });
    by.set(id, x);
  }
  return [...by.values()].filter(x => patternById(x.id)).sort((a, b) => b.n - a.n);
}
