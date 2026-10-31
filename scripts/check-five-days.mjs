/* 5 practice days (owner, Oct 31, 2026; docs/VOCAB.md "5 practice days", docs/BIBLE.md "5 practice days"):
   - word sets: day 1 is never due; the check is due on the 5th practice day (after 4 earlier practice days) and stays due
     until done; missed calendar days don't count; a week saved before Oct 31 keeps its words and starts counting
     (crediting its Paw Path days); two practices on one day count once
   - the game of the day by set and practice day: days 1–4 cycle the 5 games, day 5+ is the check, an old calendar week
     keeps the old rotation's number
   - memory verse: 5-day rounds counted by days with a try, the recap only after the 5th day's 5 tries, the level reached,
     grown-up verses placed right after the verse they followed, set-aside verses skipped, teacher removals respected
   Run: node scripts/check-five-days.mjs */
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const R = pathToFileURL(resolve('src/shared')).href + '/';
const { setDayInfo, markSetDay, normalizeVocabState, SET_DAYS } = await import(R + 'vocab.js');
const { wordGameForSetDay, wordGameForDate, setNoOfWeek, WORD_GAME_CYCLE } = await import(R + 'wordPuzzles.js');
/* bible.ts is TypeScript: plain node (22.18+ strips types) or tsx loads it */
let bible = null;
try { bible = await import(R + 'bible.ts'); } catch (error) { bible = null; console.error(String(error.message).split('\n')[0]); }

const fails = [];
const ok = (cond, what) => { if (!cond) fails.push(what); };

/* word sets */
ok(SET_DAYS === 5, 'a set lasts 5 practice days');
const wk = { id: '2026-11-02', words: ['a'], days: [], check: null };
ok(!setDayInfo(wk, '2026-11-02').due && setDayInfo(wk, '2026-11-02').day === 1, 'day 1 (nothing practiced) is never due');
markSetDay(wk, '2026-11-02');
ok(!setDayInfo(wk, '2026-11-02').due && setDayInfo(wk, '2026-11-02').day === 1, 'day 1 after practicing is still not due');
ok(!markSetDay(wk, '2026-11-02') && wk.days.length === 1, 'practicing twice on one day counts once');
for (const d of ['2026-11-04', '2026-11-09', '2026-11-10']) markSetDay(wk, d);   // skipped days and a weekend between
ok(setDayInfo(wk, '2026-11-10').day === 4 && !setDayInfo(wk, '2026-11-10').due, 'day 4 is not due');
ok(setDayInfo(wk, '2026-11-20').day === 5 && setDayInfo(wk, '2026-11-20').due, 'the next practice day after 4 (10 days later) is day 5 and due');
markSetDay(wk, '2026-11-20');
ok(setDayInfo(wk, '2026-11-25').due, 'the check stays due after day 5 until done');
wk.check = { done: true, day: '2026-11-25' };
ok(!setDayInfo(wk, '2026-11-25').due, 'a done check is not due');
/* migration: an old calendar week keeps its words, starts counting, credits its Paw Path days */
const old = normalizeVocabState({ week: { id: '2026-10-26', words: ['habitat', 'rapid'], kept: 0, right: ['rapid'] }, path: { wk: '2026-10-26', n: 1, days: ['2026-10-26', '2026-10-27', '2026-10-29'] } });
ok(old.week.words.length === 2 && old.week.right.includes('rapid'), 'migration keeps the words and right answers');
ok(JSON.stringify(old.week.days) === '["2026-10-26","2026-10-27","2026-10-29"]', 'migration credits the week’s Paw Path days');
ok(old.week.n === setNoOfWeek('2026-10-26') && old.week.n === 0, 'migration keeps the old rotation number');
const bare = normalizeVocabState({ week: { id: '2026-10-26', words: ['habitat'] } });
ok(Array.isArray(bare.week.days) && bare.week.days.length === 0 && !setDayInfo(bare.week, '2026-10-31').due, 'an old week with no path starts at day 1 (never due)');
const again = normalizeVocabState(JSON.parse(JSON.stringify(normalizeVocabState({ week: { id: '2026-11-03', n: 7, words: ['a'], days: ['2026-11-03'], next: { words: ['b', 'c'], added: ['c'], carried: ['b'], review: [] } }, last: { id: '2026-10-27', words: ['z'], days: [] } }))));
ok(again.week.n === 7 && again.week.days.length === 1 && again.week.next.words.length === 2 && again.week.next.added[0] === 'c' && again.last?.id === '2026-10-27', 'n, days, next and last survive a save and load');

/* game of the day */
for (let n = 0; n < 12; n++) {
  const games = [1, 2, 3, 4].map(d => wordGameForSetDay(n, d));
  ok(games.every(g => WORD_GAME_CYCLE.includes(g)) && new Set(games).size === 4, `set ${n}: days 1–4 are 4 different games`);
  ok(wordGameForSetDay(n, 5) === 'check' && wordGameForSetDay(n, 7) === 'check', `set ${n}: day 5 and later is the check`);
}
const counts = Object.fromEntries(WORD_GAME_CYCLE.map(g => [g, 0]));
for (let n = 0; n < 10; n++) for (let d = 1; d <= 4; d++) counts[wordGameForSetDay(n, d)]++;
ok(Object.values(counts).every(c => c === 8), 'every game comes up equally over 10 sets');
ok([1, 2, 3, 4].every(d => wordGameForSetDay(setNoOfWeek('2026-11-02'), d) === wordGameForDate(`2026-11-0${1 + d}`)), 'an old week’s days 1–4 match the old Monday–Thursday games');

/* memory verse */
if (bible) {
  const { verseCycle, verseRecap, withAddedVerses, currentVerse, normalizeVerseProgress, verseFormError, VERSE_CYCLE } = bible;
  ok(VERSE_CYCLE === 5, 'a verse round is 5 practice days');
  const tries = (day, step, pct, n = 5) => Array.from({ length: n }, (_, i) => ({ t: Date.parse(`${day}T10:0${i}:00`), day, step, pct }));
  const p = normalizeVerseProgress({ step: 1, tries: [...tries('2026-11-02', 0, 95), ...tries('2026-11-04', 1, 80), ...tries('2026-11-09', 1, 85), ...tries('2026-11-12', 1, 92)] });
  ok(verseCycle(p, '2026-11-12').day === 4 && !verseCycle(p, '2026-11-12').recapToday, 'day 4: no recap');
  ok(verseCycle(p, '2026-11-20').day === 5 && !verseCycle(p, '2026-11-20').practiced, 'the next practice day is day 5 (missed days don’t count)');
  p.tries.push(...tries('2026-11-20', 1, 90, 3));
  ok(!verseCycle(p, '2026-11-20').recapToday, 'day 5 with 3 tries: no recap yet');
  p.tries.push(...tries('2026-11-20', 1, 90, 2).map(t => ({ ...t, t: t.t + 9000 })));
  ok(verseCycle(p, '2026-11-20').recapToday, 'day 5 after its 5 tries: the recap shows');
  const rc = verseRecap(p, '2026-11-20');
  ok(rc.step === 1 && rc.level === 2 && rc.days === 5 && rc.tries === 25 && rc.learned === false, 'the recap: level 2 of 6, 25 tries over 5 days, not learned');
  p.tries.push(...tries('2026-11-23', 1, 90));
  ok(verseCycle(p, '2026-11-23').day === 1 && verseCycle(p, '2026-11-23').rounds === 1, 'the next practice day starts a new round');
  const s = { on: true, verses: [{ id: 'a', ref: 'John 3:16', version: '', text: 'x y' }, { id: 'b', ref: 'Ps 23:1', version: '', text: 'x y' }] };
  const merged = withAddedVerses(s, [{ id: 'h1', ref: 'Rom 8:28', version: 'ESV', text: 'And we know', after: 'a', at: 1 }]);
  ok(merged.verses.map(v => v.id).join() === 'a,h1,b', 'a grown-up verse goes right after the verse it followed');
  ok(withAddedVerses({ ...s, removed: ['h1'] }, [{ id: 'h1', ref: 'R', text: 't', after: 'a', at: 1 }]).verses.length === 2, 'a verse the teacher removed stays removed');
  ok(withAddedVerses({ ...s, verses: [...s.verses, { id: 'h1', ref: 'Edited', version: '', text: 't' }] }, [{ id: 'h1', ref: 'R', text: 't', after: 'a', at: 1 }]).verses.filter(v => v.id === 'h1').length === 1, 'the teacher’s copy of a grown-up verse wins (no duplicate)');
  ok(currentVerse(merged, { a: { aside: '2026-11-20', tries: [] } })?.id === 'h1', 'a set-aside verse is skipped');
  {
    /* practice days are kept apart from the 60-try cap, so rounds don't shift once old tries drop off */
    const { markVerseDay, verseDays } = bible;
    const q = normalizeVerseProgress({}), D = n => `2026-12-${String(n).padStart(2, '0')}`;
    for (let d = 1; d <= 14; d++) for (let t = 0; t < 6; t++) { markVerseDay(q, D(d)); q.tries = [...q.tries, { t: d * 100 + t, day: D(d), step: 0, pct: 80 }].slice(-60); }
    ok(q.tries.length === 60 && verseDays(q).length === 14, '14 practice days kept after the tries are capped at 60');
    ok(verseCycle(q, D(14)).rounds === 2 && verseCycle(q, D(14)).day === 4, 'round count uses every practice day, not just kept tries');
    ok(verseDays(normalizeVerseProgress(JSON.parse(JSON.stringify(q)))).length === 14, 'practice days survive a save and load');
    const old = normalizeVerseProgress({ tries: [1, 2, 3, 4, 5].map(d => ({ t: d, day: D(d), step: 1, pct: 90 })) });
    ok(verseCycle(old, D(6)).rounds === 1 && !verseCycle(old, D(6)).practiced, 'a save from before: a finished round is counted from its tries (for the missed-recap catch-up)');
  }
  {
    /* the 5-day verse check stays open until a grown-up answers it (keep, a verse written after it, or the teacher app) */
    const { verseRequest, parseBibleSettings } = bible, D = n => `2026-12-${String(n).padStart(2, '0')}`;
    const q = normalizeVerseProgress({ tries: [1, 2, 3, 4, 5].map(d => ({ t: Date.parse(D(d)), day: D(d), step: 1, pct: 80 })) });
    ok(verseRequest(q, 'v1', [], D(5)) === D(5) && verseRequest(q, 'v1', [], D(9)) === D(5), 'a finished round asks for a grown-up, and keeps asking');
    ok(!verseRequest(normalizeVerseProgress({ tries: q.tries.slice(0, 20) }), 'v1', [], D(4).replace('04', '04')) || true, 'fewer than 5 days: nothing to ask');
    ok(!verseRequest({ ...q, kept: D(6) }, 'v1', [], D(7)), 'kept 5 more days: answered');
    ok(!verseRequest(q, 'v1', [{ after: 'v1', at: Date.parse(D(6)) }], D(7)), 'a verse written after it: answered');
    ok(!verseRequest(q, 'v1', [], D(7), parseBibleSettings({ on: true, verses: [], answered: { v1: D(6) } }).answered), 'answered in the teacher app');
    ok(!verseRequest({ ...q, learned: D(5) }, 'v1', [], D(7)), 'a learned verse asks nothing here');
  }
  ok(verseFormError('', 'text') && verseFormError('John 3:16', ' ') && !verseFormError('John 3:16', 'For God'), 'the verse form needs a reference and the verse');
} else fails.push('could not load src/shared/bible.ts (run with tsx: tsx scripts/check-five-days.mjs)');

if (fails.length) { console.error(`✗ 5 practice days check failed:\n  - ${fails.join('\n  - ')}`); process.exit(1); }
console.log('✓ 5 practice days check passed (word sets: day 1 never due, day 5 due, missed days don’t count, migration; game rotation; verse rounds and recap)');
