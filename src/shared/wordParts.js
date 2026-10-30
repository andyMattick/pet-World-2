/* Pet World Word Workshop: 🧩 word parts (docs/VOCAB.md, "Word parts"). No DOM here.
   When she misses a word, Word Workshop shows its prefix, root and suffix with what each means, then a one-line
   "put together" meaning (predict: pre- “before” + dict “say” → to say it before it happens).

   WORD_PARTS has a hand-checked entry for every built-in word (VOCAB_WORDS and PATTERN_WORDS in vocab.js).
   Each part: {text, type:'prefix'|'root'|'suffix', meaning, show?}. `text` is the letters as they are in the word,
   so the texts join to the word exactly (scripts/check-word-parts.mjs checks this). `show` is the dictionary form
   when the spelling changes inside the word (summar → summary, the y changes; iz → ize, the e drops); the chip
   shows it with a small mark. A word with no real prefix or suffix is one root part plus a short honest `note`
   about where it comes from. Never invent a split.
   origin: L Latin, G Greek, OE Old English, OF Old French, ON Old Norse, It Italian.
   src: E✓ = checked on Etymonline in this pass (Oct 30, 2026); E = the standard etymology as given by Etymonline and
   Merriam-Webster (well known, not fetched again). The full table with sources is docs/word-parts-review.md.

   guessParts() is the small fallback for words a teacher or parent adds: it only splits off a known prefix or suffix
   when what's left (3+ letters) is a known root or another known word, and labels it "Looks like:". If unsure, nothing. */

const p = (text, meaning, show) => ({ text, type: 'prefix', meaning, ...(show ? { show } : {}) });
const r = (text, meaning, show) => ({ text, type: 'root', meaning, ...(show ? { show } : {}) });
const s = (text, meaning, show) => ({ text, type: 'suffix', meaning, ...(show ? { show } : {}) });
const E = (parts, gloss, origin, src = 'E', note = '') => ({ parts, gloss, origin, src, ...(note ? { note } : {}) });
/* one word part: the whole word as its root, with where it comes from */
const one = (word, meaning, note, origin, src = 'E') => ({ parts: [r(word, meaning)], gloss: '', origin, src, note });

export const WORD_PARTS = {
  /* Set 1 */
  analyze: E([p('ana', 'up, all through'), r('lyze', 'loosen, break apart')], 'to break something apart, all the way through, to study it', 'G'),
  compare: E([p('com', 'with, together'), r('pare', 'equal (Latin par)')], 'to put things together to see how equal or alike they are', 'L'),
  contrast: E([p('contra', 'against'), r('st', 'stand')], 'to stand two things against each other to show how they differ', 'L'),
  describe: E([p('de', 'down'), r('scribe', 'write')], 'to write or tell down what something is like', 'L'),
  evidence: E([p('e', 'out (from ex-)'), r('vid', 'see'), s('ence', 'the state of')], 'what makes something plain to see', 'L'),
  predict: E([p('pre', 'before'), r('dict', 'say')], 'to say it before it happens', 'L'),
  summarize: E([r('summar', 'the main points (Latin summa, “total”)', 'summary'), s('ize', 'to make')], 'to make a summary: just the main points', 'L'),
  infer: E([p('in', 'in, into'), r('fer', 'carry, bring')], 'to bring in an idea from the clues', 'L'),
  explain: E([p('ex', 'out'), r('plain', 'flat, clear')], 'to lay it out flat so it is clear', 'L'),
  identify: E([r('ident', 'the same (Latin idem)'), s('ify', 'to make')], 'to show what something is: the same as the thing you name', 'L'),
  /* Set 2 */
  abundant: E([p('ab', 'off, away'), r('und', 'wave'), s('ant', 'being, doing')], 'overflowing like waves: more than enough', 'L'),
  scarce: one('scarce', 'scant, too little', 'One word part: from Old French escars, “scanty.”', 'OF', 'E✓'),
  fragile: E([r('frag', 'break'), s('ile', 'able to be')], 'able to be broken easily', 'L'),
  sturdy: one('sturdy', 'strong', 'One word part: from Old French estourdi, “dazed, wild”; the meaning changed to “strong” over time.', 'OF', 'E✓'),
  ancient: one('ancient', 'from before', 'One word part: from Old French ancien, from Latin ante, “before.”', 'OF'),
  modern: one('modern', 'of right now', 'One word part: from Latin modo, “just now.”', 'L'),
  enormous: E([p('e', 'out of (from ex-)'), r('norm', 'rule, what is usual (Latin norma)'), s('ous', 'full of, having')], 'out of the normal size: very large', 'L'),
  minute: one('minute', 'made small', 'One word part: from Latin minutus, “made small” (min = small, as in minimum).', 'L'),
  reluctant: E([p('re', 'back, against'), r('luct', 'struggle'), s('ant', 'being, doing')], 'struggling against: not wanting to', 'L'),
  eager: one('eager', 'keen, sharp', 'One word part: from Old French aigre, “keen,” from Latin acer, “sharp.”', 'OF'),
  /* Set 3 */
  cautious: E([r('caut', 'on guard, careful (Latin cavere)'), s('ious', 'full of')], 'full of care: on guard', 'L'),
  confident: E([p('con', 'completely'), r('fid', 'trust'), s('ent', 'being')], 'trusting completely (in yourself)', 'L'),
  curious: E([r('cur', 'care (Latin cura)'), s('ious', 'full of')], 'full of care to know: wanting to find out', 'L'),
  generous: E([r('gener', 'birth, family (noble kind)'), s('ous', 'full of, having')], 'of noble kind: giving freely', 'L'),
  honest: one('honest', 'honorable', 'One word part: from Latin honestus, “honorable” (like honor).', 'L'),
  patient: E([r('pati', 'suffer, put up with'), s('ent', 'being')], 'putting up with waiting calmly', 'L'),
  persistent: E([p('per', 'through'), r('sist', 'stand'), s('ent', 'being')], 'standing firm all the way through', 'L'),
  responsible: E([p('re', 'back'), r('spons', 'promise, answer'), s('ible', 'able to be')], 'able to answer for something', 'L'),
  timid: one('timid', 'fearful', 'One word part: from Latin timidus, from timere, “to fear.”', 'L'),
  grateful: E([r('grate', 'pleasing, thankful (Latin gratus)'), s('ful', 'full of')], 'full of thanks', 'L'),
  /* Set 4 */
  accurate: E([p('ac', 'to (from ad-)'), r('cur', 'care'), s('ate', 'having, done')], 'done with care', 'L'),
  approximate: E([p('ap', 'to, near (from ad-)'), r('proxim', 'nearest'), s('ate', 'having, done')], 'brought near: close to exact', 'L'),
  estimate: one('estimate', 'to value', 'One word part: from Latin aestimare, “to value, judge.”', 'L'),
  calculate: E([r('calcul', 'small stone (used for counting)'), s('ate', 'to do')], 'to count, once done with little stones', 'L'),
  pattern: one('pattern', 'a model to copy', 'One word part: an old form of patron, “a model to copy.”', 'OF'),
  equivalent: E([r('equi', 'equal'), r('val', 'worth'), s('ent', 'being')], 'having equal worth', 'L'),
  interpret: E([p('inter', 'between'), r('pret', 'deal, trade (probably)')], 'to explain, like a go-between for two sides', 'L', 'E✓'),
  data: one('data', 'things given', 'One word part: Latin data, “things given” (one is a datum).', 'L'),
  survey: E([p('sur', 'over'), r('vey', 'look, see')], 'to look over', 'OF'),
  conclusion: E([p('con', 'completely'), r('clus', 'shut, close'), s('ion', 'the result of')], 'closing the thinking: what you decide at the end', 'L'),
  /* Set 5 */
  habitat: one('habitat', 'it lives there', 'One word part: Latin habitat, “it lives (there),” from habitare, “to live in.”', 'L'),
  adapt: E([p('ad', 'to'), r('apt', 'fit')], 'to make fit to something', 'L'),
  migrate: E([r('migr', 'move'), s('ate', 'to do')], 'to move from place to place', 'L'),
  predator: E([r('pred', 'prey, loot (Latin praeda; not pre- “before”)'), s('ator', 'one who')], 'one who takes prey', 'L'),
  prey: one('prey', 'something taken', 'One word part: from Old French preie, from Latin praeda, “something taken.”', 'OF'),
  organism: E([r('organ', 'working part (Greek organon, “tool”)'), s('ism', 'a state or system')], 'a living thing made of working parts', 'G', 'E✓'),
  environment: E([p('en', 'in'), r('viron', 'circle, around'), s('ment', 'the thing')], 'what circles around you', 'OF'),
  erosion: E([p('e', 'away (from ex-)'), r('ros', 'gnaw (as in rodent)'), s('ion', 'the act of')], 'gnawing away', 'L'),
  nutrient: E([r('nutri', 'feed'), s('ent', 'being, doing')], 'something that feeds you', 'L'),
  observe: E([p('ob', 'toward, in front of'), r('serve', 'keep watch (Latin servare, not “serve”)')], 'to keep watching something in front of you', 'L'),
  /* Set 6 */
  century: one('century', 'a group of 100', 'One word part: Latin centuria, “a group of 100,” from centum, “hundred” (cent = 100).', 'L', 'E✓'),
  civilization: E([r('civil', 'of citizens (Latin civis)'), s('iz', 'to make', 'ize'), s('ation', 'the act or result of')], 'the result of people living together as citizens', 'L'),
  culture: E([r('cult', 'grow, care for (Latin colere)'), s('ure', 'the act or result of')], 'the way of life a people grows', 'L'),
  empire: E([p('em', 'in, on'), r('pire', 'make ready (Latin parare)')], 'to get things ready and give orders: lands under one ruler’s command', 'L', 'E✓'),
  trade: one('trade', 'a path, a regular course', 'One word part: from an old German word for “track, path.”', 'Middle Low German'),
  tradition: E([p('tra', 'across, over', 'trans'), r('dit', 'give'), s('ion', 'the act of')], 'something handed over from old to young', 'L'),
  artifact: E([r('arti', 'skill, art'), r('fact', 'made')], 'made by skill: made by people', 'L'),
  source: one('source', 'rising, a spring', 'One word part: from Old French sourse, from Latin surgere, “to rise” (like a spring of water).', 'OF'),
  conflict: E([p('con', 'together'), r('flict', 'strike')], 'striking together: a fight', 'L'),
  migration: E([r('migr', 'move'), s('ation', 'the act of')], 'the act of moving to a new place', 'L'),
  /* Set 7 */
  consequence: E([p('con', 'with'), r('sequ', 'follow'), s('ence', 'the thing')], 'what follows along with something', 'L'),
  cooperate: E([p('co', 'together'), r('oper', 'work'), s('ate', 'to do')], 'to work together', 'L'),
  determine: E([p('de', 'completely'), r('termine', 'set the limit, end')], 'to set the limits: to decide', 'L'),
  essential: E([r('essent', 'what something is (Latin esse, “to be”)', 'essence'), s('ial', 'having to do with')], 'part of what something is: needed', 'L'),
  frequent: one('frequent', 'crowded, often', 'One word part: from Latin frequens, “crowded, often.”', 'L'),
  influence: E([p('in', 'into'), r('flu', 'flow'), s('ence', 'the thing')], 'a flowing into someone', 'L'),
  obstacle: E([p('ob', 'against, in the way'), r('sta', 'stand'), s('cle', 'a thing that does it')], 'a thing standing in the way', 'L', 'E✓'),
  opinion: E([r('opin', 'think'), s('ion', 'the result of')], 'what you think', 'L'),
  reveal: E([p('re', 'back, undo'), r('veal', 'veil, cover')], 'to pull back the cover', 'L'),
  require: E([p('re', 'again'), r('quire', 'ask, seek')], 'to ask for: to need', 'L'),
  /* Set 8 */
  astonished: E([p('as', 'out (from ex-)'), r('ton', 'thunder'), s('ish', 'to do'), s('ed', 'had it done to you')], 'as if struck by thunder', 'L', 'E✓'),
  distinct: E([p('dis', 'apart'), r('tinct', 'marked')], 'marked apart: clearly different', 'L'),
  drowsy: E([r('drows', 'be heavy, sluggish (Old English)', 'drowse'), s('y', 'full of, like')], 'heavy with sleep', 'OE', 'E✓'),
  eventually: E([p('e', 'out (from ex-)'), r('vent', 'come'), s('ual', 'having to do with'), s('ly', 'in a way')], 'in the way things come out in the end', 'L'),
  hesitate: E([r('hesit', 'stick, get stuck'), s('ate', 'to do')], 'to get stuck for a moment', 'L'),
  immense: E([p('im', 'not'), r('mense', 'measured')], 'too big to measure', 'L'),
  peculiar: one('peculiar', 'one’s own', 'One word part: from Latin peculiaris, “one’s own, special.”', 'L'),
  rapid: one('rapid', 'snatching, quick', 'One word part: from Latin rapidus, “quick, snatching.”', 'L'),
  vivid: one('vivid', 'full of life', 'One word part: from Latin vividus, from vivere, “to live” (viv = life).', 'L'),
  wander: one('wander', 'to roam', 'One word part: from Old English wandrian, “to roam.”', 'OE'),
  /* Set 9 */
  accomplish: E([p('ac', 'to (from ad-)'), r('compl', 'fill up'), s('ish', 'to do')], 'to fill a job up to the end', 'L', 'E✓'),
  demonstrate: E([p('de', 'completely'), r('monstr', 'show'), s('ate', 'to do')], 'to show completely', 'L'),
  expand: E([p('ex', 'out'), r('pand', 'spread')], 'to spread out', 'L'),
  improve: E([p('im', 'into'), r('prove', 'profit (Old French prou)')], 'to turn into profit: make better', 'OF', 'E✓'),
  investigate: E([p('in', 'in, into'), r('vestig', 'footprint, track'), s('ate', 'to do')], 'to follow the tracks', 'L'),
  locate: E([r('loc', 'place'), s('ate', 'to do')], 'to find the place', 'L'),
  perform: E([p('per', 'completely'), r('form', 'provide, carry out (Old French fornir)')], 'to carry something out completely', 'OF', 'E✓'),
  protect: E([p('pro', 'in front'), r('tect', 'cover')], 'to cover in front', 'L'),
  survive: E([p('sur', 'over, beyond'), r('vive', 'live')], 'to live on beyond', 'L'),
  transform: E([p('trans', 'across, change'), r('form', 'shape')], 'to change shape', 'L'),
  /* Set 10 */
  boundary: E([r('bound', 'limit, edge'), s('ary', 'a place or thing')], 'the line at the limit', 'OF'),
  compromise: E([p('com', 'together'), p('pro', 'forward'), r('mise', 'send, put')], 'a promise both sides make together', 'L'),
  debate: E([p('de', 'completely'), r('bate', 'beat')], 'to beat out an idea with words', 'OF', 'E✓'),
  emphasize: E([p('em', 'in'), r('phas', 'show'), s('ize', 'to make')], 'to show strongly: make it stand out', 'G'),
  perspective: E([p('per', 'through'), r('spect', 'look'), s('ive', 'having to do with')], 'a way of looking through at something', 'L'),
  precise: E([p('pre', 'before, in front'), r('cise', 'cut')], 'cut off exactly', 'L'),
  relevant: E([p('re', 'again, up'), r('lev', 'lift'), s('ant', 'being, doing')], 'lifting up, bearing on the topic', 'L'),
  sequence: E([r('sequ', 'follow'), s('ence', 'the thing')], 'the order things follow', 'L'),
  significant: E([r('sign', 'mark'), r('ific', 'make'), s('ant', 'being, doing')], 'making a mark: important enough to notice', 'L'),
  thorough: one('thorough', 'through', 'One word part: an old spelling of through, “all the way through.”', 'OE'),
  /* Spelling-pattern practice words (PATTERN_WORDS) */
  prepare: E([p('pre', 'before'), r('pare', 'make ready')], 'to make ready before', 'L'),
  prevent: E([p('pre', 'before'), r('vent', 'come')], 'to come before and stop it', 'L'),
  previous: E([p('pre', 'before'), r('vi', 'way'), s('ous', 'having')], 'going before on the way', 'L'),
  perhaps: E([p('per', 'by'), r('haps', 'chances (Old Norse happ, “luck”)')], 'by chance', 'L + ON'),
  permit: E([p('per', 'through'), r('mit', 'let go, send')], 'to let through', 'L'),
  persuade: E([p('per', 'completely'), r('suade', 'urge, advise')], 'to urge someone all the way', 'L'),
  produce: E([p('pro', 'forward'), r('duce', 'lead, bring')], 'to bring forward', 'L'),
  promise: E([p('pro', 'forward'), r('mise', 'send, put')], 'to put your word forward', 'L'),
  believe: E([p('be', 'strongly (Old English)'), r('lieve', 'hold dear')], 'to hold something dear as true', 'OE', 'E✓'),
  receive: E([p('re', 'back'), r('ceive', 'take (Latin capere)')], 'to take in what is given to you', 'L'),
  neighbor: E([r('neigh', 'near'), r('bor', 'dweller')], 'someone who lives near', 'OE'),
  piece: one('piece', 'a part', 'One word part: from Old French piece, “a part.”', 'OF'),
  ceiling: E([r('ceil', 'line or cover a room (probably Latin celare, “hide,” or caelare, “carve”)'), s('ing', 'the thing made')], 'the covering over a room', 'OF', 'E✓'),
  field: one('field', 'open land', 'One word part: from Old English feld, “open land.”', 'OE'),
  necessary: E([p('ne', 'not'), r('cess', 'give way'), s('ary', 'having to do with')], 'not able to give it up', 'L'),
  tomorrow: E([p('to', 'on, at'), r('morrow', 'morning, next day')], 'on the next day', 'OE'),
  occasion: E([p('oc', 'toward (from ob-)'), r('cas', 'fall'), s('ion', 'the act of')], 'a time that falls your way', 'L'),
  address: E([p('ad', 'to'), r('dress', 'direct, make straight')], 'to direct to someone', 'OF'),
  success: E([p('suc', 'next, after (from sub-)'), r('cess', 'go')], 'what comes next: the good result that follows your work', 'L'),
  beginning: E([r('begin', 'start'), s('ning', 'the act of', 'ing')], 'the act of starting', 'OE'),
  important: E([p('im', 'in, into'), r('port', 'carry'), s('ant', 'being, doing')], 'carrying weight', 'L'),
  different: E([p('dif', 'apart (from dis-)'), r('fer', 'carry'), s('ent', 'being')], 'carried apart: not the same', 'L'),
  patience: E([r('pati', 'suffer, put up with'), s('ence', 'the state of')], 'putting up with waiting', 'L'),
  distance: E([p('di', 'apart', 'dis'), r('st', 'stand'), s('ance', 'the state of')], 'standing apart', 'L'),
  excellent: E([p('ex', 'out, beyond'), r('cell', 'rise high'), s('ent', 'being')], 'rising above the rest', 'L'),
  assistant: E([p('as', 'near (from ad-)'), r('sist', 'stand'), s('ant', 'one who')], 'one who stands by to help', 'L'),
  comfortable: E([p('com', 'completely'), r('fort', 'strong'), s('able', 'able to')], 'made strong and at ease', 'L'),
  possible: E([r('poss', 'be able'), s('ible', 'able to be')], 'able to be done', 'L'),
  valuable: E([r('valu', 'worth', 'value'), s('able', 'able to be')], 'having worth', 'L'),
  visible: E([r('vis', 'see'), s('ible', 'able to be')], 'able to be seen', 'L'),
  terrible: E([r('terr', 'frighten (not terra, earth)'), s('ible', 'able to')], 'able to frighten', 'L'),
  reliable: E([p('re', 'back, firmly'), r('li', 'tie, bind', 'ly'), s('able', 'able to be')], 'able to be relied on', 'L', 'E✓'),
  question: E([r('quest', 'seek, ask'), s('ion', 'the act of')], 'the act of asking', 'L'),
  vacation: E([r('vac', 'empty, free'), s('ation', 'the state of')], 'time free from work', 'L'),
  decision: E([p('de', 'off'), r('cis', 'cut'), s('ion', 'the act of')], 'cutting off the other choices', 'L'),
  television: E([p('tele', 'far (Greek)'), r('vis', 'see'), s('ion', 'the act of')], 'seeing from far away', 'G + L'),
  musician: E([r('music', 'music (Greek mousike)'), s('ian', 'a person who')], 'a person who makes music', 'G + L'),
  attention: E([p('at', 'to (from ad-)'), r('tent', 'stretch'), s('ion', 'the act of')], 'stretching your mind toward something', 'L'),
  circle: one('circle', 'a small ring', 'One word part: from Latin circulus, “a small ring” (circ = ring, round).', 'L'),
  notice: E([r('not', 'known (Latin notus)'), s('ice', 'the state of')], 'being known: to become aware of', 'L', 'E✓'),
  decide: E([p('de', 'off'), r('cide', 'cut')], 'to cut off the other choices', 'L'),
  concert: E([p('con', 'together'), r('cert', 'strive')], 'striving together; in Italian, playing music together', 'It', 'E✓'),
  cycle: one('cycle', 'a circle, a wheel', 'One word part: from Greek kyklos, “circle, wheel” (as in bicycle).', 'G'),
};

export const ORIGIN_NAMES = { L: 'Latin', G: 'Greek', OE: 'Old English', OF: 'Old French', ON: 'Old Norse', It: 'Italian', 'G + L': 'Greek and Latin', 'L + ON': 'Latin and Old Norse', 'Middle Low German': 'Middle Low German' };

/* ---------- fallback for words a teacher or parent adds: a guess, labeled "Looks like:" ---------- */
export const PREFIXES = { un: 'not', dis: 'not, apart', mis: 'wrongly', non: 'not', pre: 'before', re: 'again, back', sub: 'under', inter: 'between',
  trans: 'across', anti: 'against', super: 'above', semi: 'half', tri: 'three', bi: 'two', multi: 'many', auto: 'self', tele: 'far', over: 'too much', under: 'below' };
export const SUFFIXES = { ness: 'the state of being', less: 'without', ful: 'full of', able: 'able to be', ible: 'able to be', ment: 'the act or result of',
  ation: 'the act of', tion: 'the act of', sion: 'the act of', ous: 'full of', ive: 'tending to', ity: 'the state of', ize: 'to make', ist: 'a person who',
  ism: 'a belief or practice', er: 'one who, more', or: 'one who', ly: 'in a way', ed: 'happened before', ing: 'doing' };
export const ROOTS = { spect: 'look', port: 'carry', dict: 'say', scrib: 'write', script: 'write', struct: 'build', rupt: 'break', tract: 'pull',
  vis: 'see', vid: 'see', aud: 'hear', ject: 'throw', form: 'shape', graph: 'write', phon: 'sound', photo: 'light', bio: 'life', geo: 'earth',
  therm: 'heat', meter: 'measure', cred: 'believe', duct: 'lead', duc: 'lead', fer: 'carry', mit: 'send', miss: 'send', pend: 'hang',
  vert: 'turn', vers: 'turn', voc: 'voice, call', cycl: 'circle', fract: 'break', jud: 'judge', mot: 'move', mov: 'move', loc: 'place',
  sign: 'mark', sequ: 'follow', vent: 'come', vive: 'live', viv: 'live', press: 'push', tend: 'stretch', tain: 'hold', ceive: 'take' };
/* these endings go on whole words, so a bare root before them is a coincidence (tender, former, motor): word stems only */
const WORD_ONLY = new Set(['er', 'or', 'ed', 'ing', 'ly']);
const PREFIX_LIST = Object.keys(PREFIXES).sort((a, b) => b.length - a.length);
const SUFFIX_LIST = Object.keys(SUFFIXES).sort((a, b) => b.length - a.length);

/* the stem is a known root, or another known word (also with a dropped e put back: "hopeful" → hope) */
function stemMeaning(stem, known, wordOnly){
  if (ROOTS[stem] && !wordOnly) return { meaning: ROOTS[stem] };
  if (known.has(stem)) return { meaning: `the word “${stem}”`, show: stem };
  if (known.has(`${stem}e`)) return { meaning: `the word “${stem}e”`, show: `${stem}e` };
  return null;
}
/* {parts, guess:true} or null. At most one prefix and one suffix; the stem left must be 3+ letters and known. */
export function guessParts(word, knownWords = []){
  const w = String(word || '').trim().toLowerCase();
  if (!/^[a-z]{5,40}$/.test(w)) return null;
  const known = new Set([...knownWords, ...Object.keys(WORD_PARTS)].map(x => String(x).toLowerCase()).filter(x => x !== w));
  const tries = [];
  for (const pre of ['', ...PREFIX_LIST]) {
    if (pre && !w.startsWith(pre)) continue;
    for (const suf of ['', ...SUFFIX_LIST]) {
      if (!pre && !suf) continue;
      if (suf && !w.endsWith(suf)) continue;
      const stem = w.slice(pre.length, w.length - suf.length);
      if (stem.length < 3) continue;
      const m = stemMeaning(stem, known, WORD_ONLY.has(suf)); if (!m) continue;
      tries.push([...(pre ? [p(pre, PREFIXES[pre])] : []), r(stem, m.meaning, m.show), ...(suf ? [s(suf, SUFFIXES[suf])] : [])]);
    }
  }
  if (!tries.length) return null;
  /* the split with a known root wins over a known word; then the longest stem (the least chopped) */
  tries.sort((a, b) => (+!!ROOTS[b.find(x => x.type === 'root').text] - +!!ROOTS[a.find(x => x.type === 'root').text])
    || b.find(x => x.type === 'root').text.length - a.find(x => x.type === 'root').text.length);
  return { parts: tries[0], gloss: '', origin: '', guess: true };
}

/* the entry to show for a word: the hand-checked one, or a labeled guess, or null (show nothing) */
export function wordPartsFor(word, knownWords = []){
  const k = String(word || '').trim().toLowerCase();
  return WORD_PARTS[k] || guessParts(k, knownWords);
}
