/* Checks 🐾 the Paw Path (src/shared/wordPath.js, docs/VOCAB.md "This week's word path"):
   - the built-in data: every built-in word has a part of speech and a second sentence (one ___, not the example
     sentence, no straight apostrophes, no "a"/"an" clash, the word not already in it); every near-synonym item and pair
     points at real words
   - thousands of lessons from random week draws (the 143 built-in words, plus weeks with a family's own words that
     have no built-in data): every choice has exactly one right answer (no near-synonym or same meaning among the
     wrong ones), no repeated choices, no undefined / NaN / empty text, no prompt that contains its answer or a wrong
     answer, "a"/"an" before a blank fits every choice, every skill covers all of the week's words over its lessons,
     lesson groups never put near-synonyms on the same board
   - nothing gives an answer away inside a lesson: no right answer (or "what does it mean here?" sentence) is a
     sentence she already saw filled in earlier in the same lesson, and every look-alike pair is taught on a card and
     then asked both ways (so "pick the word I've practiced all week" gets half)
   - other languages: all-Spanish weeks and English weeks with 2 Spanish words: every word is still in every skill,
     wrong answers are always in the word's own language, spelling choices are all the same length
   - a test-wise bot (pick the longest, the shortest, the middle length, the most word overlap with the prompt, the
     first, the last, the word that's on this week's list) stays within 10 points of chance, overall and for each
     kind of item
   Run: node scripts/check-word-path.mjs   (--weeks 600 to change how many weeks are drawn) */
const R = new URL('../src/shared/', import.meta.url).href;
const { VOCAB_WORDS, PATTERN_WORDS, validWord } = await import(R + 'vocab.js');
const { nextWeekWords } = await import(R + 'wordPuzzles.js');
const WP = await import(R + 'wordPath.js');
const { PATH_DATA, NUANCE, NEAR, isNear, pathWord, buildLesson, lessonGroups, lessonCount, mentions, seededRand, againItem, matchRetryItem, normalizePath, pathForWeek, recordLesson, pathNodes, pathSummary, SKILL_IDS } = WP;

const problems = [], warn = [];
const bad = (msg) => { if (problems.length < 400) problems.push(msg); };
const built = [...new Map([...VOCAB_WORDS, ...PATTERN_WORDS].map(v => [v.w.toLowerCase(), v])).values()];
const byKey = new Map(built.map(v => [v.w.toLowerCase(), v]));

/* ---------- the data ---------- */
for (const v of built) {
  const k = v.w.toLowerCase(), d = PATH_DATA[k];
  if (!d) { bad(`${k}: no part of speech / second sentence in PATH_DATA`); continue; }
  if (!/^[vnar]$/.test(d.pos)) bad(`${k}: part of speech "${d.pos}"`);
  if ((d.u.match(/_{3}/g) || []).length !== 1) bad(`${k}: second sentence needs exactly one ___`);
  if (d.u === v.s) bad(`${k}: second sentence is the example sentence`);
  if (/'/.test(d.u)) bad(`${k}: straight apostrophe in the second sentence`);
  if (/\b(a|an)\s+_{3}/i.test(d.u)) bad(`${k}: "a"/"an" right before the blank in the second sentence`);
  if (mentions(d.u.replace(/_{3}/, ''), k)) bad(`${k}: the second sentence already has the word in it`);
  if (/_{3}[a-z]/i.test(d.u)) bad(`${k}: second sentence adds an ending to the blank`);
}
for (const k of Object.keys(PATH_DATA)) if (!byKey.has(k)) bad(`${k}: PATH_DATA entry for a word that isn't built in`);
for (const [a, b] of NEAR) for (const x of [a, b]) if (!byKey.has(x)) bad(`NEAR: ${x} isn't a built-in word`);
for (const [k, n] of Object.entries(NUANCE)) {
  if (!byKey.has(k)) bad(`NUANCE ${k}: not a built-in word`);
  if ((n.s.match(/_{3}/g) || []).length !== 1) bad(`NUANCE ${k}: needs exactly one ___`);
  if (mentions(n.s.replace(/_{3}/, ''), k) || mentions(n.s.replace(/_{3}/, ''), n.near)) bad(`NUANCE ${k}: sentence names the word or ${n.near}`);
  if (n.s === byKey.get(k)?.s || n.s === PATH_DATA[k]?.u) bad(`NUANCE ${k}: same sentence as another one`);
  const art = (n.s.match(/\b(a|an)\s+_{3}/i) || [])[1]; if (art) for (const w of [k, n.near]) if ((art.toLowerCase() === 'an') !== /^[aeiou]/.test(w)) bad(`NUANCE ${k}: "${art}" doesn't fit ${w}`);
  if (/'/.test(n.s + n.why)) bad(`NUANCE ${k}: straight apostrophe`);
  if (!n.why) bad(`NUANCE ${k}: no explanation`);
  if (NUANCE[n.near]?.near !== k) bad(`NUANCE ${k}: ${n.near} has no item back the other way (look-alikes are asked both ways)`);
}
for (const v of built) if (mentions(v.d, v.w)) bad(`${v.w}: its own meaning contains the word`);

/* ---------- a family's own words (no built-in data): the path still works ---------- */
const OWN = [
  ['benevolent', 'kind and wanting to help others', 'The ___ king gave food to every hungry family.'],
  ['meager', 'very small in amount; not enough', 'We only had a ___ snack before the long hike.'],
  ['jubilant', 'filled with great joy', 'The team was ___ after winning the championship.'],
  ['ponder', 'to think about something carefully', 'Take a minute to ___ the question before you answer.'],
  ['tranquil', 'calm and peaceful', 'The lake was ___ early in the morning.'],
  ['vast', 'very large in area', 'The desert is so ___ that it takes days to cross.'],
  ['gloat', 'to brag in a mean way about your own luck', 'Please don’t ___ when you win the game.'],
  ['mimic', 'to copy the way someone acts or sounds', 'Parrots can ___ the words people say.'],
  ['ally', 'a friend who helps you, especially in a fight', 'France was an ___ of the colonies in the war.'],
  ['ferocious', 'fierce and scary', 'The ___ tiger roared at the hunters.'],
  ['diligent', 'working hard and carefully', 'A ___ student checks every answer twice.'],
  ['shimmer', 'to shine with a soft, wavy light', 'The water seemed to ___ in the moonlight.'],
].map(([w, d, s]) => validWord({ w, d, s, set: 'My words' }));
/* another language (test words only, with English meanings): a family learning Spanish */
const ES = [
  ['árbol', 'tree', 'El pájaro hizo su nido en el ___ del parque.'], ['perro', 'dog', 'Mi ___ mueve la cola cuando llego a casa.'],
  ['gato', 'cat', 'El ___ duerme todo el día en el sofá.'], ['casa', 'house', 'Después de la escuela, voy a mi ___ para comer.'],
  ['libro', 'book', 'Leí un ___ muy divertido sobre dragones.'], ['escuela', 'school', 'Los niños van a la ___ de lunes a viernes.'],
  ['manzana', 'apple', 'Para la merienda, como una ___ roja.'], ['agua', 'water', 'Cuando hace calor, bebo mucha ___ fría.'],
  ['ventana', 'window', 'Abre la ___ para que entre el aire fresco.'], ['mesa', 'table', 'Pon los platos en la ___ para la cena.'],
  ['ciudad', 'city', 'Madrid es una ___ muy grande con muchos edificios.'], ['amigo', 'friend', 'Mi mejor ___ y yo jugamos al fútbol juntos.'],
].map(([w, d, s]) => validWord({ w, d, s, lang: 'es', set: 'Español' }));
if (ES.some(v => v.lang !== 'es')) bad('validWord drops lang');

/* ---------- lessons from random weeks ---------- */
const args = process.argv.slice(2), WEEKS = +(args[args.indexOf('--weeks') + 1]) || 400;
const stats = {}, kinds = {}, BOTS = ['longest', 'shortest', 'middle', 'overlap', 'first', 'last', 'familiar'];
const tok = t => String(t).toLowerCase().split(/[^a-z’']+/).filter(x => x.length >= 3).map(x => x.slice(0, 5));
function botPick(bot, item, rand, weekKeys){
  const c = item.choices, L = c.map(x => x.length), n = c.length, ties = arr => { const best = Math.max(...arr); const idx = arr.map((v, i) => (v === best ? i : -1)).filter(i => i >= 0); return idx[Math.floor(rand() * idx.length)]; };
  if (bot === 'longest') return ties(L);
  if (bot === 'shortest') return ties(L.map(x => -x));
  if (bot === 'middle') { const sorted = [...L].sort((a, b) => a - b), mid = sorted[Math.floor((n - 1) / 2)]; return ties(L.map(x => -Math.abs(x - mid))); }
  if (bot === 'overlap') { const P = new Set(tok(`${item.prompt} ${item.ask}`)); return ties(c.map(x => tok(x).filter(t => P.has(t)).length)); }
  /* the spelling choices aren't other words, so knowing the list is knowing the answer: guess there */
  if (bot === 'familiar') return item.kind === 'spellPick' ? Math.floor(rand() * n) : ties(c.map(x => (weekKeys.has(String(x).toLowerCase()) ? 1 : 0)));   // she has practiced this word all week
  if (bot === 'first') return 0;
  return n - 1;
}
const rand = seededRand('check-word-path');
let lessons = 0, items = 0;
const allWords = built.map(pathWord);
for (let wk = 0; wk < WEEKS; wk++) {
  const withOwn = wk % 5 === 4, allEs = wk % 7 === 3, someEs = !allEs && wk % 7 === 5;
  const pool = allEs ? ES : someEs ? [...VOCAB_WORDS, ...ES] : withOwn ? [...VOCAB_WORDS, ...OWN] : wk % 3 === 0 ? built : VOCAB_WORDS;
  const keys = pool.map(v => v.w.toLowerCase()), mastered = keys.filter(() => rand() < 0.2), un = keys.filter(k => !mastered.includes(k));
  const first = withOwn ? OWN.map(v => v.w) : someEs ? ES.slice(0, 2).map(v => v.w.toLowerCase()) : [];   // 2 Spanish words in an English week
  const draw = allEs ? { words: ES.map(v => v.w.toLowerCase()), review: [] } : nextWeekWords(someEs ? first.map(k => k.toLowerCase()) : [], [...first, ...un.filter(k => !first.includes(k))], mastered.filter(k => !first.includes(k)), { fresh: 20, review: 5, rand });
  if (someEs && !first.every(k => draw.words.includes(k))) bad(`week ${wk}: the 2 Spanish words weren't drawn`);
  const map = new Map(pool.map(v => [v.w.toLowerCase(), v]));
  const pathKeys = draw.words.filter(k => !draw.review.includes(k)), words = pathKeys.map(k => map.get(k)).filter(Boolean);
  const weekPool = draw.words.map(k => map.get(k)).filter(Boolean), pools = [weekPool, pool];
  const id = `2026-${String(1 + (wk % 12)).padStart(2, '0')}-${String(1 + (wk % 27)).padStart(2, '0')}`;
  const groups = lessonGroups(words, id);
  if (groups.length !== lessonCount(words.length)) bad(`week ${wk}: ${groups.length} groups for ${words.length} words`);
  const flat = groups.flat().map(v => v.w.toLowerCase());
  if (flat.length !== words.length || new Set(flat).size !== words.length) bad(`week ${wk}: groups don't hold each word once`);
  for (const g of groups) { if (g.length < 3 && words.length >= 4) bad(`week ${wk}: a lesson with only ${g.length} words`); for (const a of g) for (const b of g) if (a !== b && isNear(a.w, b.w)) bad(`week ${wk}: ${a.w} and ${b.w} (near-synonyms) in one lesson`); }
  const weekKeys = new Set(draw.words);
  for (const skill of SKILL_IDS) {
    const covered = new Set();
    groups.forEach((g, gi) => {
      const ex = buildLesson(skill, g, pools, rand); lessons++;
      /* sentences she has already seen with the word in them, earlier in this lesson */
      const shown = new Set(), filled = (sen, w) => WP.fillBlank(sen, w).toLowerCase();
      const pairsTaught = new Set(), nuanceAns = new Map();
      if (ex.length < Math.min(7, g.length + 2)) bad(`${skill} lesson ${gi + 1} (week ${wk}): only ${ex.length} exercises for ${g.length} words`);
      for (const it of ex) {
        items++;
        const text = JSON.stringify(it);
        if (/undefined|NaN|null|\[object/.test(text.replace(/"(why|sentence)":null/g, ''))) bad(`${skill}/${it.kind}: undefined/NaN in ${text.slice(0, 160)}`);
        if (it.type !== 'intro') covered.add(it.word);
        if (it.type === 'intro' && it.s) shown.add(filled(it.s, it.w));
        if (it.type === 'pair') pairsTaught.add(it.word);
        if (it.kind === 'typeBlank' && !allEs && !someEs) bad(`typeBlank in an English week: ${it.answer}`);
        if (it.kind === 'inContext' && shown.has(it.prompt.toLowerCase())) bad(`inContext ${it.word}: the sentence was filled in earlier in this lesson: ${it.prompt}`);
        if (it.type === 'pick' && /\s/.test(it.choices[it.answer]) && shown.has(String(it.choices[it.answer]).toLowerCase())) bad(`${it.kind} ${it.word}: the right answer is a sentence shown earlier in this lesson`);
        if (it.type === 'pick' && /___/.test(it.prompt)) shown.add(filled(it.prompt, it.choices[it.answer]));
        if (it.kind === 'typeBlank') shown.add(filled(it.sentence, it.answer));
        if (it.kind === 'nuance') {
          if (!pairsTaught.has(it.word)) bad(`nuance ${it.word}: asked before the look-alike card`);
          const a = nuanceAns.get(it.word) || []; a.push(it.choices[it.answer]); nuanceAns.set(it.word, a);
        }
        if (it.type === 'pick' || it.type === 'build') { const lw = map.get(it.word) || byKey.get(it.word) || ES.find(v => v.w === it.word); const wl = (lw?.lang || 'en').slice(0, 2);
          if (['def2word', 'blank', 'hasPart', 'spellPick'].includes(it.kind)) for (const ch of it.choices) { if (ch === it.choices[it.answer] || it.kind === 'spellPick') continue; const o = map.get(ch.toLowerCase()) || byKey.get(ch.toLowerCase()); if (o && (o.lang || 'en').slice(0, 2) !== wl) bad(`${it.kind} ${it.word}: wrong answer “${ch}” is in another language`); } }
        if (it.kind === 'spellPick') {
          const L = WP.graphemes(it.choices[it.answer]).length;
          if (it.choices.some(x => WP.graphemes(x).length !== L)) bad(`spellPick ${it.word}: choices of different lengths ${it.choices}`);
          if (it.choices.filter(x => x.toLowerCase() === it.word).length !== 1) bad(`spellPick ${it.word}: not exactly one right spelling`);
          for (const x of it.choices) if (x.toLowerCase() !== it.word && (map.has(x.toLowerCase()) || byKey.has(x.toLowerCase()))) bad(`spellPick ${it.word}: “${x}” is a real word`);
        }
        if (it.type === 'match') {
          if (new Set(it.pairs.map(p => p.d.toLowerCase())).size !== it.pairs.length) bad(`match board with two equal meanings: ${it.words}`);
          for (const a of it.pairs) for (const b of it.pairs) if (a !== b && isNear(a.key, b.key)) bad(`match board with near-synonyms ${a.w} / ${b.w}`);
          it.words.forEach(k => covered.add(k));
        }
        if (it.type === 'build') {
          if (it.parts.join('') !== (it.kind === 'letters' ? it.answer : it.answer.toLowerCase())) bad(`build ${it.answer}: parts join to ${it.parts.join('')}`);
          if (!it.parts.every(p => it.chips.includes(p))) bad(`build ${it.answer}: a part chip is missing`);
          if (it.chips.length !== it.parts.length + 2 && it.kind === 'build') bad(`build ${it.answer}: not 2 extra chips`);
          if (it.kind === 'build' && new Set(it.chips).size !== it.chips.length) bad(`build ${it.answer}: repeated chips`);
          if (it.kind === 'letters' && it.chips.filter(x => !it.parts.includes(x)).length !== it.chips.length - it.parts.length) bad(`letters ${it.answer}: an extra tile is one of the word's own`);
          if (mentions(it.prompt, it.answer)) bad(`build ${it.answer}: the meaning names the word`);
        }
        if (it.type === 'type' && (!it.answer || !it.prompt)) bad(`type item without an answer or meaning: ${text.slice(0, 120)}`);
        if (it.type !== 'pick') continue;
        const c = it.choices, right = c[it.answer];
        if (!(it.answer >= 0 && it.answer < c.length) || c.length < 2) { bad(`${it.kind}: bad answer index ${text.slice(0, 120)}`); continue; }
        if (new Set(c.map(x => x.toLowerCase())).size !== c.length) bad(`${it.kind}: repeated choices ${c.join(' | ')}`);
        if (c.some(x => !String(x).trim()) || !String(it.prompt).trim() || !String(it.ask).trim()) bad(`${it.kind}: empty text ${text.slice(0, 120)}`);
        const wordChoices = ['def2word', 'blank', 'nuance', 'hasPart'].includes(it.kind);
        if (wordChoices) {
          if (mentions(it.prompt, right) || mentions(it.ask, right)) bad(`${it.kind}: the prompt contains the answer “${right}”: ${it.prompt}`);
          for (const w of c) if (w !== right && (mentions(it.prompt, w) && it.kind !== 'nuance')) bad(`${it.kind}: the prompt contains the wrong answer “${w}”: ${it.prompt}`);
          if (it.kind !== 'nuance') for (const w of c) if (w !== right && isNear(w, right)) bad(`${it.kind}: near-synonyms ${right} / ${w} both offered`);
          const art = (String(it.prompt).match(/\b(a|an)\s+_{3}/i) || [])[1];
          if (art) for (const w of c) if ((art.toLowerCase() === 'an') !== /^[aeiou]/i.test(w)) bad(`${it.kind}: “${art} ___” doesn't fit “${w}”: ${it.prompt}`);
          for (const w of c) if (w !== right && map.get(w.toLowerCase())?.d === map.get(right.toLowerCase())?.d) bad(`${it.kind}: ${w} and ${right} have the same meaning`);
        }
        if (it.kind === 'word2def') {
          const wv = map.get(it.word) || byKey.get(it.word);
          if (mentions(right, it.prompt)) bad(`word2def ${it.prompt}: the right meaning contains the word`);
          for (const d of c) if (d !== right) { const owner = [...map.values()].find(v => v.d === d); if (owner && isNear(owner.w, it.prompt)) bad(`word2def ${it.prompt}: the meaning of near-synonym ${owner.w} offered`); if (mentions(d, it.prompt)) bad(`word2def ${it.prompt}: a wrong meaning contains the word`); }
          void wv;
        }
        if (it.kind === 'inContext') {
          const w = it.word;
          if (!mentions(it.prompt, w)) bad(`inContext ${w}: the sentence doesn't have the word`);
          for (const d of c) { if (d !== right && mentions(d, w)) bad(`inContext ${w}: a wrong meaning contains the word`); const owner = [...map.values()].find(v => v.d === d && v.w.toLowerCase() !== w); if (owner && isNear(owner.w, w)) bad(`inContext ${w}: the meaning of near-synonym ${owner.w} offered`); }
        }
        if (it.kind === 'partMeaning' && c.some(x => x !== right && x.toLowerCase() === right.toLowerCase())) bad(`partMeaning: repeated meaning`);
        /* the bots */
        const n = c.length, kb = (kinds[it.kind] ||= { n: 0, chance: 0, bots: Object.fromEntries(BOTS.map(b => [b, 0])) });
        kb.n++; kb.chance += 1 / n;
        for (const b of BOTS) if (botPick(b, it, rand, weekKeys) === it.answer) kb.bots[b]++;
        /* asked again after a miss: still one right answer, same choices */
        const again = againItem(it, rand); if (again.choices[again.answer] !== right || again.choices.length !== c.length) bad(`${it.kind}: asking again changed the answer`);
      }
      for (const [w, ans] of nuanceAns) if (ans.length !== 2 || ans[0] === ans[1]) bad(`nuance ${w}: not asked both ways (${ans})`);
    });
    for (const v of words) if (!covered.has(v.w.toLowerCase())) bad(`${skill} (week ${wk}): ${v.w} isn't in any lesson`);
  }
  /* a word missed on a match board gets a "what does it mean?" item */
  const m = matchRetryItem(words[0], pools, rand); if (!m || m.type !== 'pick') bad(`week ${wk}: no retry item for ${words[0]?.w}`);
}

/* ---------- the path's saved state ---------- */
{
  let p = pathForWeek({}, '2026-10-26', 4);
  const st = () => pathNodes(p).nodes.map(n => n.state[0]).join('');
  if (st() !== 'cllll') bad(`new path states ${st()}`);
  for (let i = 0; i < 4; i++) recordLesson(p, 'meet', i, { right: 8, asked: 10, day: '2026-10-26' });
  if (st() !== 'dclll') bad(`after Meet: ${st()}`);
  const r = recordLesson(p, 'match', 0, { right: 10, asked: 10, day: '2026-10-27' });
  if (r.xp !== 15 || !r.first) bad(`perfect lesson XP ${r.xp}`);
  if (recordLesson(p, 'match', 0, { right: 5, asked: 10, day: '2026-10-27' }).first) bad('a replay counted as first');
  if (p.days.length !== 2 || p.xp !== 40 + 15 + 10) bad(`days ${p.days} xp ${p.xp}`);
  const back = normalizePath(JSON.parse(JSON.stringify(p))); if (JSON.stringify(back) !== JSON.stringify(normalizePath(p))) bad('path does not survive save and load');
  const s = pathSummary(p, '2026-10-26'); if (s.done.join() !== 'meet' || s.skills[0].acc !== 80) bad(`summary ${JSON.stringify(s)}`);
  if (pathForWeek(p, '2026-11-02', 4).xp !== 0) bad('a new week does not start over');
  if (pathSummary(p, '2026-11-02').started) bad('last week shows as this week');
  for (const x of [null, 'x', { lessons: { meet: 'x' }, xp: 'NaN', days: ['bad'] }]) { const q = normalizePath(x); if (q.xp !== 0 || q.days.length) bad(`normalize ${JSON.stringify(x)}`); }
}

/* ---------- report ---------- */
let overallN = 0, overallChance = 0; const overallBots = Object.fromEntries(BOTS.map(b => [b, 0]));
const rows = [];
for (const [k, s] of Object.entries(kinds)) {
  overallN += s.n; overallChance += s.chance; for (const b of BOTS) overallBots[b] += s.bots[b];
  const chance = (100 * s.chance) / s.n, row = [k.padEnd(12), String(s.n).padStart(6), `${chance.toFixed(1)}%`.padStart(7)];
  for (const b of BOTS) { const pct = (100 * s.bots[b]) / s.n; row.push(`${pct.toFixed(1)}%`.padStart(7)); if (s.n >= 200 && pct > chance + 10) bad(`test-wise bot "${b}" gets ${pct.toFixed(1)}% on ${k} (chance ${chance.toFixed(1)}%)`); }
  rows.push(row.join(' '));
}
const chanceAll = (100 * overallChance) / overallN;
console.log(`kind          items  chance ${BOTS.map(b => b.padStart(7)).join(' ')}`);
rows.forEach(r => console.log(r));
console.log(`${'all'.padEnd(12)} ${String(overallN).padStart(6)} ${`${chanceAll.toFixed(1)}%`.padStart(7)} ${BOTS.map(b => { const pct = (100 * overallBots[b]) / overallN; if (pct > chanceAll + 10) bad(`test-wise bot "${b}" gets ${pct.toFixed(1)}% overall (chance ${chanceAll.toFixed(1)}%)`); return `${pct.toFixed(1)}%`.padStart(7); }).join(' ')}`);
console.log(`${WEEKS} weeks, ${lessons} lessons, ${items} exercises checked.`);
if (warn.length) console.log(warn.slice(0, 20).join('\n'));
if (problems.length) { console.log(`\n${problems.length} problem(s):\n${[...new Set(problems)].slice(0, 80).join('\n')}`); process.exit(1); }
console.log('✅ Paw Path check passed.');
