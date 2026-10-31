// Moving a mastered word back to practice (docs/VOCAB.md, "Moving words back to practice"): unmasterWord and the weekly draw.
// Run: node scripts/check-unmaster.mjs
import assert from 'node:assert/strict';
const R = new URL('../src/shared/', import.meta.url).href;
const { normalizeVocabState, unmasterWord, remasterWord, masteredAmong, wordStatus, wordBuckets, vocabList } = await import(R + 'vocab.js');
const { nextWeekWords } = await import(R + 'wordPuzzles.js');
const v = normalizeVocabState({ hall: [{ w: 'habitat', wk: '2026-10-19' }, { w: 'eager', wk: '2026-10-19' }], stats: { habitat: { r: [1, 1, 1, 1] } },
  week: { id: '2026-10-26', words: ['analyze', 'eager', 'habitat'], carried: [], review: ['eager', 'habitat'], right: [], mastered: [], check: { day: '2026-10-30', done: false, results: { habitat: 1 } } } });
assert.deepEqual(masteredAmong(v, [{ w: 'Habitat' }, 'compare']), ['habitat']);
assert.equal(wordStatus(v.stats.habitat), 'solid');
assert.equal(unmasterWord(v, 'Habitat'), true);
assert.ok(!v.hall.some(h => h.w === 'habitat'), 'hall removal');
assert.deepEqual(v.back, ['habitat']);
assert.equal(wordStatus(v.stats.habitat), 'work', 'history reset to needs practice');
assert.ok(!v.week.review.includes('habitat') && v.week.carried.includes('habitat'), 'review word becomes carried');
assert.ok(!('habitat' in v.week.check.results), 'unfinished check asks again');
const { all } = vocabList({});
const b = wordBuckets(v, all);
assert.ok(b.unmastered.some(x => x.w === 'habitat') && !b.mastered.some(x => x.w === 'habitat'), 'unmastered list');
assert.deepEqual(b.back, ['habitat']);
// idempotent
const snap = JSON.stringify(v);
assert.equal(unmasterWord(v, 'habitat'), false);
assert.equal(JSON.stringify(v), snap, 'second call changes nothing');
// survives normalize (save/load)
const v2 = normalizeVocabState(JSON.parse(JSON.stringify(v)));
assert.deepEqual(v2.back, ['habitat']);
// next week's priority: first, ahead of last week's leftovers, even with 30 leftovers
const hall = new Set(v2.hall.map(h => h.w)), keys = all.map(x => x.w.toLowerCase());
const prev = keys.filter(k => !hall.has(k) && k !== 'habitat').slice(0, 30);
const next = nextWeekWords(prev, keys.filter(k => !hall.has(k)), keys.filter(k => hall.has(k)), { back: v2.back });
assert.equal(next.carried[0], 'habitat'); assert.equal(next.words[0], 'habitat'); assert.equal(next.carried.length, 20);
assert.equal(next.words.length, 20 + Math.min(5, hall.size));
// without back it isn't first
const plain = nextWeekWords(prev, keys.filter(k => !hall.has(k)), keys.filter(k => hall.has(k)));
assert.notEqual(plain.words[0], 'habitat');
// a word not in the hall is not touched
const v3 = normalizeVocabState({ hall: [] }); assert.equal(unmasterWord(v3, 'compare'), false); assert.deepEqual(v3.back, []); assert.equal(v3.stats.compare, undefined);
// undo (owner, Oct 31, 2026): putting a moved-back word back restores it as it was, and survives a save and load
{
  const u = normalizeVocabState({ hall: [{ w: 'habitat', wk: '2026-10-26' }], stats: { habitat: { r: [1, 1, 1, 0, 1] } } });
  assert.equal(unmasterWord(u, 'habitat'), true);
  const back = normalizeVocabState(JSON.parse(JSON.stringify(u)));
  assert.ok(back.undo.habitat, 'the undo snapshot is kept in the save');
  assert.equal(remasterWord(back, 'habitat'), true);
  assert.deepEqual(back.hall, [{ w: 'habitat', wk: '2026-10-26' }]);
  assert.deepEqual(back.stats.habitat.r, [1, 1, 1, 0, 1]);
  assert.ok(!back.back.includes('habitat') && !back.undo.habitat);
  assert.equal(remasterWord(back, 'habitat'), false, 'already mastered: nothing to undo');
  const w = normalizeVocabState({ hall: [{ w: 'compare', wk: '' }], week: { id: '2026-11-02', words: ['compare', 'habitat'], review: ['compare'], carried: [], right: [], mastered: [], days: [] } });
  unmasterWord(w, 'compare'); remasterWord(w, 'compare');
  assert.ok(w.week.review.includes('compare') && !w.week.carried.includes('compare'), 'a review word goes back to review in this set');
}
console.log('✓ unmaster state test passed (hall removal, unmastered, next-week priority, history reset, idempotent, undo)');
