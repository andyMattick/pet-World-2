/* Checks ✍️ the Red Pen Desk (src/shared/redPen.js, docs/RED-PEN-DESK.md):
   - thousands of papers from random weeks of the built-in words (and weeks with a family's own words)
   - exactly one misspelled word on a paper with a mistake, none on a "Looks good!" paper (about 1 in 6)
   - every misspelling is one realistic edit, differs from the right spelling, is named by spellingPatterns() as
     exactly the pattern it was made for, and is not a real word (Pet World's lists, the app's common-word list, and a
     full English dictionary when /usr/share/hunspell/en_US.dic is there), with or without the paper's ending
   - the kind-of-mistake choices: 4, all different, exactly one right (no wrong choice whose pattern also fits, and no
     ending or start kind when the mistake is inside that ending or start: posseble is never offered "-ible / -able")
   - the quiet "uh" vowel is never an r-controlled syllable (in-FER → infar), and "Extra letters" never conterast
   - British spellings (neighbour, summarise, analyse) count as right in step 2, and are never a pet's misspelling
   - the misspelled word is spread over the week's words (review, Oct 30): a "most-often-wrong word" bot that learned a
     week from 300 rounds, and a bot that remembers this round, both stay at or under 35% on step 1; the same
     misspelling is on 3 papers of a round almost never
   - no undefined / NaN / empty text anywhere on a paper
   - the word game rotation (wordGameForDate): Monday–Thursday cycle through the 5 games in order, every game equally
     often, none skipped two weeks running; Friday is the mastery check and weekends the match-up
   - a test-wise bot stays near chance: tapping the longest / shortest / first / last spelling word, always "Looks
     good!", and for the kind of mistake: the longest name, the first choice, the most common right answer
   Run: node scripts/check-red-pen.mjs   (--papers 20000 to change how many are made) */
import { existsSync, readFileSync } from 'node:fs';
const R = new URL('../src/shared/', import.meta.url).href;
const { VOCAB_WORDS, PATTERN_WORDS, validWord, syllablesOf } = await import(R + 'vocab.js');
const { nextWeekWords, wordGameForDate, WORD_GAME_CYCLE } = await import(R + 'wordPuzzles.js');
const { seededRand } = await import(R + 'wordPath.js');
const { spellingPatterns, spellingEdits } = await import(R + 'spellingPatterns.js');
const RP = await import(R + 'redPen.js');
const { makeRedPenRound, makePaper, misspellingsOf, patternsThatFit, kindsThatCouldFit, britishSpellings, realWords, isRealWord, PATTERN_IDS, PATTERN_SHORT, tapIsRight, spellingIsRight, patternIsRight, paperText, NO_MISTAKE_RATE } = RP;

const arg = (name, d) => { const i = process.argv.indexOf(name); return i > 0 ? +process.argv[i + 1] : d; };
const PAPERS = arg('--papers', 12000);
const problems = [];
const bad = msg => { if (problems.length < 300 && !problems.includes(msg)) problems.push(msg); };
const built = [...new Map([...VOCAB_WORDS, ...PATTERN_WORDS].map(v => [v.w.toLowerCase(), v])).values()];

/* a full dictionary (only for this check; the app uses its own short list) */
const dict = new Set();
if (existsSync('/usr/share/hunspell/en_US.dic')) for (const line of readFileSync('/usr/share/hunspell/en_US.dic', 'utf8').split('\n').slice(1)) { const w = line.split('/')[0].trim(); if (/^[a-z]+$/i.test(w)) dict.add(w.toLowerCase()); }
const appReal = realWords();
const realAnywhere = t => isRealWord(t, appReal) || (dict.size && isRealWord(t, dict));
const dictHits = new Map(), ownDict = new Set();

/* ---------- the misspellings of every built-in word ---------- */
const reach = Object.fromEntries(PATTERN_IDS.map(id => [id, 0]));
let noMis = 0;
for (const v of built) {
  const ms = misspellingsOf(v.w);
  if (!ms.length && /^[a-z]{4,}$/.test(v.w)) noMis++;
  for (const m of ms) {
    reach[m.pattern]++;
    if (m.wrong === v.w.toLowerCase()) bad(`${v.w}: misspelling is the word itself`);
    if (dict.size && isRealWord(m.wrong, dict)) dictHits.set(m.wrong, v.w);
    const named = spellingPatterns(v.w, m.wrong); if (named.length !== 1 || named[0] !== m.pattern) bad(`${v.w} → ${m.wrong}: named ${named.join(',')} not ${m.pattern}`);
    if (britishSpellings(v.w).includes(m.wrong)) bad(`${v.w} → ${m.wrong}: that's the British spelling, not a mistake`);
    if (m.pattern === 'schwa') { const syl = syllablesOf(v.w.toLowerCase()); let at = 0, i = 0; while (i < m.wrong.length && m.wrong[i] === v.w.toLowerCase()[i]) i++; syl.show.forEach((part, j) => { if (i >= at && i < at + part.length && /ur/.test(syl.say[j] || '')) bad(`${v.w} → ${m.wrong}: "the quiet uh vowel" on an "ur" syllable (${syl.say[j]})`); at += part.length; }); }
    if (m.wrong === 'conterast') bad('contrast → conterast is not a mistake kids make');
    const ops = spellingEdits(v.w.toLowerCase(), m.wrong); if (ops.length !== 1 && !(['prePer', 'tionSion'].includes(m.pattern) && ops.length === 2)) bad(`${v.w} → ${m.wrong}: ${ops.length} edits (one realistic edit only)`);
  }
}
for (const [w, from] of dictHits) bad(`${from} → ${w}: "${w}" is a real word (add it to COMMON in redPen.js)`);
for (const id of PATTERN_IDS) if (!reach[id]) bad(`pattern ${id}: no built-in word can show it`);

/* ---------- a family's own words ---------- */
const OWN = [['benevolent', 'kind and wanting to help others', 'The ___ king gave food to every hungry family.'], ['meager', 'very small in amount; not enough', 'We only had a ___ snack before the long hike.'], ['jubilant', 'filled with great joy', 'The team was ___ after winning the championship.'], ['ponder', 'to think about something carefully', 'Take a minute to ___ the question before you answer.'], ['tranquil', 'calm and peaceful', 'The lake was ___ early in the morning.'], ['diligent', 'working hard and carefully', 'A ___ student checks every answer twice.'], ['ferocious', 'fierce and scary', 'The ___ tiger roared at the hunters.'], ['shimmer', 'to shine with a soft, wavy light', 'The water seemed to ___ in the moonlight.'], ['ice cream', 'a frozen sweet', 'We ate ___ at the fair.'], ['árbol', 'tree', 'El ___ es alto.']].map(([w, d, s]) => validWord({ w, d, s, set: 'My words' }));

/* ---------- papers from random weeks ---------- */
const keys = built.map(v => v.w.toLowerCase()), byKey = new Map(built.map(v => [v.w.toLowerCase(), v]));
const stat = { papers: 0, none: 0, slots: 0, chance: 0, kind: { list: 0, sentences: 0 }, pos: {}, pat: Object.fromEntries(PATTERN_IDS.map(id => [id, 0])) };
const bots = { tapLongest: 0, tapShortest: 0, tapFirst: 0, tapLast: 0, tapNone: 0, patLongest: 0, patFirst: 0, patCommon: 0, patShown: 0 };
const answerCount = Object.fromEntries(PATTERN_IDS.map(id => [id, 0]));
let round = 0;
const textOK = s => typeof s === 'string' && !/undefined|NaN|null|\[object/.test(s);
while (stat.papers < PAPERS) {
  const rand = seededRand(`redpen:${round}`);
  const mastered = keys.filter(() => rand() < 0.2), unm = keys.filter(k => !mastered.includes(k));
  const wk = nextWeekWords([], unm, mastered, { rand });
  let words = wk.words.map(k => byKey.get(k));
  if (round % 7 === 3) words = [...words.slice(0, 14), ...OWN];   // a week with a family's own words (one has a space, one is Spanish: never on a paper)
  const papers = makeRedPenRound(words, rand);
  if (papers.length !== RP.RED_PEN_PAPERS) bad(`round ${round}: ${papers.length} papers`);
  if (new Set(papers.map(p => p.id)).size !== papers.length) bad(`round ${round}: repeated paper ids`);
  for (const p of papers) {
    stat.papers++; stat.kind[p.kind]++;
    const n = p.slots.length; stat.slots += n; stat.chance += 1 / (n + 1);
    if (p.kind === 'list' ? n !== 4 : n !== 3) bad(`${p.kind} paper with ${n} spelling words`);
    if (new Set(p.slots.map(s => s.k)).size !== n) bad(`paper repeats a word: ${paperText(p)}`);
    const wrongSlots = p.slots.map((s, i) => (s.shown !== s.right ? i : -1)).filter(i => i >= 0);
    if (!textOK(paperText(p)) || !textOK(paperText(p, true)) || !p.pet?.e || !p.pet?.n) bad(`bad text: ${paperText(p)}`);
    for (const s of p.slots) if (!s.right || !s.shown || !s.k) bad(`empty slot: ${JSON.stringify(s)}`);
    for (const s of p.slots) if (s.k.includes(' ') || /[^a-z]/.test(s.k)) bad(`not a plain word on a paper: ${s.k}`);
    if (p.lines.flat().filter(x => x.slot != null).length !== n) bad(`paper lines don't show each slot once: ${paperText(p)}`);
    if (p.target < 0) {
      stat.none++;
      if (wrongSlots.length) bad(`a "no mistakes" paper has a misspelling: ${paperText(p)}`);
      if (!tapIsRight(p, -1) || p.slots.some((_, i) => tapIsRight(p, i))) bad('no-mistake tap grading');
    } else {
      if (wrongSlots.length !== 1 || wrongSlots[0] !== p.target) bad(`paper should have exactly one misspelling at ${p.target}: ${paperText(p)}`);
      const s = p.slots[p.target], v = byKey.get(s.k) || OWN.find(o => o.w === s.k);
      if (!v) bad(`target word not on the week: ${s.k}`);
      if (s.shown.toLowerCase() === s.right.toLowerCase()) bad(`misspelling equals the right spelling: ${s.right}`);
      /* built-in words: never a real word in a full dictionary. A family's own words: never one on Pet World's lists or the
         app's common-word list (the app has no full dictionary); a dictionary word there is only counted */
      if (byKey.has(s.k) ? realAnywhere(p.wrong) || realAnywhere(s.shown.toLowerCase()) : isRealWord(p.wrong, appReal) || isRealWord(s.shown.toLowerCase(), appReal)) bad(`${s.k} → ${s.shown}: a real word`);
      else if (!byKey.has(s.k) && realAnywhere(p.wrong)) ownDict.add(`${s.k} → ${p.wrong}`);
      const named = spellingPatterns(s.k, p.wrong); if (named.length !== 1 || named[0] !== p.pattern) bad(`${s.k} → ${p.wrong}: named ${named} not ${p.pattern}`);
      if (!spellingIsRight(p, s.k) || !spellingIsRight(p, s.right) || !spellingIsRight(p, ` ${s.right.toUpperCase()} `) || spellingIsRight(p, p.wrong)) bad(`spelling grading: ${s.k}`);
      if (p.choices.length !== 4 || new Set(p.choices).size !== 4) bad(`${s.k}: ${p.choices.length} choices / repeats`);
      if (p.choices.filter(c => c === p.pattern).length !== 1) bad(`${s.k}: right pattern not in the choices once`);
      const fits = new Set(patternsThatFit(s.k, p.wrong)), fair = new Set(kindsThatCouldFit(s.k, p.wrong));
      for (const c of p.choices) { if (c !== p.pattern && fits.has(c)) bad(`${s.k} → ${p.wrong}: wrong choice ${c} also fits`); else if (c !== p.pattern && fair.has(c)) bad(`${s.k} → ${p.wrong}: wrong choice ${c} is a fair second answer (the mistake is in that part of the word)`); if (!PATTERN_SHORT[c]) bad(`no name for ${c}`); }
      for (const b of britishSpellings(s.k)) if (!spellingIsRight(p, b)) bad(`${s.k}: the British spelling ${b} should count`);
      if (!patternIsRight(p, p.pattern) || p.choices.filter(c => patternIsRight(p, c)).length !== 1) bad('pattern grading');
      stat.pos[`${n}:${p.target}`] = (stat.pos[`${n}:${p.target}`] || 0) + 1; stat.pat[p.pattern]++;
    }
    /* step 1 bots (spelling words as shown, the misspelled one included) */
    const lens = p.slots.map(s => s.shown.length);
    const longest = lens.indexOf(Math.max(...lens)), shortest = lens.indexOf(Math.min(...lens));
    bots.tapLongest += tapIsRight(p, longest); bots.tapShortest += tapIsRight(p, shortest); bots.tapFirst += tapIsRight(p, 0); bots.tapLast += tapIsRight(p, n - 1); bots.tapNone += tapIsRight(p, -1);
    /* step 3 bots: longest name, first, and the most common right answer so far (learned as it goes) */
    if (p.target >= 0) {
      stat.patShown = (stat.patShown || 0) + 1;
      const nm = p.choices.map(c => PATTERN_SHORT[c].length);
      bots.patLongest += patternIsRight(p, p.choices[nm.indexOf(Math.max(...nm))]);
      bots.patFirst += patternIsRight(p, p.choices[0]);
      const top = p.choices.slice().sort((a, b) => answerCount[b] - answerCount[a])[0];
      bots.patCommon += patternIsRight(p, top);
      answerCount[p.pattern]++;
    }
  }
  round++;
}

/* ---------- the rates ---------- */
const pct = x => Math.round(x * 1000) / 10;
const noneRate = stat.none / stat.papers;
if (Math.abs(noneRate - NO_MISTAKE_RATE) > 0.025) bad(`"Looks good!" papers: ${pct(noneRate)}% (want about ${pct(NO_MISTAKE_RATE)}%)`);
const tapChance = stat.chance / stat.papers, withMis = stat.papers - stat.none;
for (const k of ['tapLongest', 'tapShortest', 'tapFirst', 'tapLast']) if (Math.abs(bots[k] / stat.papers - tapChance) > 0.08) bad(`test-wise bot ${k}: ${pct(bots[k] / stat.papers)}% (chance ${pct(tapChance)}%)`);
if (Math.abs(bots.tapNone / stat.papers - tapChance) > 0.08) bad(`test-wise bot always "Looks good!": ${pct(bots.tapNone / stat.papers)}% (chance ${pct(tapChance)}%)`);
for (const k of ['patLongest', 'patFirst', 'patCommon']) if (Math.abs(bots[k] / withMis - 0.25) > 0.08) bad(`test-wise bot ${k}: ${pct(bots[k] / withMis)}% (chance 25%)`);
for (const [k, c] of Object.entries(stat.pos)) { const [n] = k.split(':').map(Number), share = c / Object.entries(stat.pos).filter(([x]) => x.startsWith(`${n}:`)).reduce((a, [, y]) => a + y, 0); if (Math.abs(share - 1 / n) > 0.05) bad(`misspelled word at spot ${k}: ${pct(share)}% (want ${pct(1 / n)}%)`); }
const patShare = Object.fromEntries(PATTERN_IDS.map(id => [id, pct(stat.pat[id] / withMis)]));
/* "Extra letters" has one fair misspelling in the bank (demonsterate), so it's mostly a wrong choice: not checked */
for (const id of PATTERN_IDS) if (id !== 'extra' && stat.pat[id] / withMis < 0.02) bad(`pattern ${id} is almost never the answer (${patShare[id]}%)`);

/* ---------- the misspelled word is spread over the week (review, Oct 30) ---------- */
const memo = { weekHit: 0, roundHit: 0, n: 0, rounds: 0, rounds3: 0, repeatWithFresh: 0 };
for (let w = 0; w < 40; w++) {
  const rand = seededRand(`redpen-week:${w}`);
  const wk = nextWeekWords([], keys, [], { rand }), words = wk.words.map(k => byKey.get(k));
  /* learn the week: how often each word is the misspelled one when it's on a paper */
  const on = {}, wrong = {};
  for (let i = 0; i < 300; i++) for (const p of makeRedPenRound(words, rand)) p.slots.forEach((s, j) => { on[s.k] = (on[s.k] || 0) + 1; if (j === p.target) wrong[s.k] = (wrong[s.k] || 0) + 1; });
  const rate = k => (wrong[k] || 0) / (on[k] || 1), real = realWords(words);
  for (let i = 0; i < 100; i++) {
    const seenWrong = new Set(), seenRight = new Set(), used = {};
    const papers = makeRedPenRound(words, rand);
    for (const p of papers) {
      const ks = p.slots.map(s => s.k);
      /* week bot: the word that's most often wrong (or "Looks good!" when none is wrong more than 1 time in 6) */
      let best = -1, bv = NO_MISTAKE_RATE; ks.forEach((k, j) => { if (rate(k) > bv) { bv = rate(k); best = j; } });
      memo.weekHit += tapIsRight(p, best);
      /* round bot: a word that was wrong earlier this round, else one not yet seen spelled right, else the first */
      let pick = ks.findIndex(k => seenWrong.has(k)); if (pick < 0) pick = ks.findIndex(k => !seenRight.has(k));
      memo.roundHit += tapIsRight(p, pick); memo.n++;
      ks.forEach((k, j) => (j === p.target ? seenWrong : seenRight).add(k));
      if (p.target >= 0) {
        const k = p.slots[p.target].k, all = misspellingsOf(k, real);
        if ((used[k] || []).includes(p.wrong) && all.some(m => !(used[k] || []).includes(m.wrong))) memo.repeatWithFresh++;
        (used[k] ||= []).push(p.wrong);
      }
    }
    memo.rounds++;
    const per = {}; for (const p of papers) if (p.target >= 0) per[p.wrong] = (per[p.wrong] || 0) + 1;
    if (Math.max(0, ...Object.values(per)) >= 3) memo.rounds3++;
  }
}
if (memo.weekHit / memo.n > 0.35) bad(`test-wise bot "tap the word that's most often wrong this week": ${pct(memo.weekHit / memo.n)}% (want 35% or less)`);
if (memo.roundHit / memo.n > 0.35) bad(`test-wise bot "remember this round": ${pct(memo.roundHit / memo.n)}% (want 35% or less)`);
if (memo.rounds3 / memo.rounds > 0.02) bad(`the same misspelling on 3+ papers in ${pct(memo.rounds3 / memo.rounds)}% of rounds`);
if (memo.repeatWithFresh) bad(`${memo.repeatWithFresh} papers reused a misspelling when the word had an unused one`);

/* ---------- the rotation ---------- */
const day = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const seen = Object.fromEntries(WORD_GAME_CYCLE.map(g => [g, 0]));
const weekGames = [];
for (let i = 0; i < 7 * 60; i++) {   // 60 weeks from Monday Jan 4, 2027 (across DST and a year end)
  const dt = new Date(2027, 0, 4 + i, 12), ds = day(dt.getFullYear(), dt.getMonth() + 1, dt.getDate()), wd = dt.getDay(), g = wordGameForDate(ds);
  if (wd === 5) { if (g !== 'check') bad(`${ds} (Friday): ${g}`); continue; }
  if (wd === 0 || wd === 6) { if (g !== 'match') bad(`${ds} (weekend): ${g}`); continue; }
  if (!WORD_GAME_CYCLE.includes(g)) { bad(`${ds}: ${g} is not one of the 5 word games`); continue; }
  seen[g]++;
  if (wd === 1) weekGames.push(new Set());
  weekGames[weekGames.length - 1].add(g);
}
const counts = Object.values(seen);
if (Math.max(...counts) - Math.min(...counts) > 1) bad(`rotation isn't even: ${JSON.stringify(seen)}`);
for (let w = 0; w < weekGames.length; w++) { if (weekGames[w].size !== 4) bad(`week ${w}: ${weekGames[w].size} different games`); if (w && WORD_GAME_CYCLE.some(g => !weekGames[w].has(g) && !weekGames[w - 1].has(g))) bad(`week ${w}: a game skipped two weeks running`); }
/* consecutive school days follow the cycle in order */
const seq = []; for (let i = 0; i < 28; i++) { const dt = new Date(2026, 10, 2 + i, 12), wd = dt.getDay(); if (wd >= 1 && wd <= 4) seq.push(wordGameForDate(day(dt.getFullYear(), dt.getMonth() + 1, dt.getDate()))); }
for (let i = 1; i < seq.length; i++) if (WORD_GAME_CYCLE.indexOf(seq[i]) !== (WORD_GAME_CYCLE.indexOf(seq[i - 1]) + 1) % 5) bad(`rotation out of order: ${seq[i - 1]} then ${seq[i]}`);

const out = { papers: stat.papers, rounds: round, lookGood: `${pct(noneRate)}%`, kinds: stat.kind, dictionary: dict.size ? `${dict.size} words` : 'not found',
  misspellingsPerPattern: reach, builtInWordsWithNoFairMisspelling: noMis, answerShare: patShare,
  spread: { mostOftenWrongWordBot: `${pct(memo.weekHit / memo.n)}%`, rememberThisRoundBot: `${pct(memo.roundHit / memo.n)}%`, roundsWithAMisspelling3Times: `${pct(memo.rounds3 / memo.rounds)}%` },
  bots: { tapChance: `${pct(tapChance)}%`, ...Object.fromEntries(['tapLongest', 'tapShortest', 'tapFirst', 'tapLast', 'tapNone'].map(k => [k, `${pct(bots[k] / stat.papers)}%`])), ...Object.fromEntries(['patLongest', 'patFirst', 'patCommon'].map(k => [k, `${pct(bots[k] / withMis)}% (chance 25%)`])) },
  ownWordsDictionaryWords: [...ownDict], rotation: seen, nextFourWeeks: seq.join(' ') };
if (process.argv.includes('--verbose') || problems.length) console.log(JSON.stringify(out, null, 1));
if (problems.length) { console.error(`✗ ${problems.length} problem(s):\n- ${problems.join('\n- ')}`); process.exit(1); }
console.log(`✓ Red Pen Desk: ${stat.papers} papers in ${round} rounds; one fair misspelling each (or none, ${pct(noneRate)}%); bots near chance (tap ${pct(tapChance)}%: longest ${pct(bots.tapLongest / stat.papers)}%, "Looks good!" ${pct(bots.tapNone / stat.papers)}%; kind 25%: longest ${pct(bots.patLongest / withMis)}%, most common ${pct(bots.patCommon / withMis)}%); step-1 memory bots ${pct(memo.weekHit / memo.n)}% (week) / ${pct(memo.roundHit / memo.n)}% (round); rotation even (${counts.join('/')})`);
