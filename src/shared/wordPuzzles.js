/* Word puzzles for Word Workshop (docs/VOCAB.md, "Daily puzzles"): scramble, decode, crossword and word search, built
   from this week's words. Pure functions (no DOM), so they can be tested on their own. `rand` is a () => [0, 1) function. */

export const PUZZLE_TYPES = ['scramble', 'decode', 'crossword', 'search', 'match'];
export const PUZZLE_INFO = {
  scramble: { emoji: '🔀', name: 'Word Scramble', how: 'Unscramble the letters to find the word that matches the meaning.' },
  decode: { emoji: '🔐', name: 'Secret Code', how: 'Each symbol stands for a letter. Use the meaning and the code key to crack each word.' },
  crossword: { emoji: '✏️', name: 'Crossword', how: 'Tap a clue, then type the word that means it.' },
  search: { emoji: '🔎', name: 'Word Search', how: 'Read the meaning, find that word in the grid: tap its first letter, then its last letter.' },
  match: { emoji: '🧩', name: 'Match-Up', how: 'Tap a word, then tap the meaning that goes with it.' },
};
/* the day's puzzle type: Monday scramble, Tuesday decode, Wednesday crossword, Thursday word search; Friday is the
   mastery check; weekends get a match-up */
export function puzzleForDay(weekday){ return ['match', 'scramble', 'decode', 'crossword', 'search', 'check', 'match'][weekday] || 'scramble'; }

const letters = w => String(w).toLowerCase().replace(/[^a-z]/g, '');
export const puzzleWord = w => /^[a-z]+$/i.test(String(w)) && String(w).length >= 3;   // one plain word (no spaces or apostrophes)

function shuffleWith(rand, arr){ const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/** the word's letters mixed up (never the word itself) */
export function scramble(word, rand){
  const w = letters(word);
  if (new Set(w).size < 2) return w;
  for (let k = 0; k < 20; k++) { const s = shuffleWith(rand, [...w]).join(''); if (s !== w) return s; }
  return w.slice(1) + w[0];
}

/* ---------- decode: a symbol for each letter; the key shows about half the letters used ---------- */
const SYMBOLS = ['★', '♦', '♣', '♠', '♥', '●', '■', '▲', '◆', '✿', '☀', '☾', '⚑', '✦', '♪', '☂', '✈', '⚓', '☘', '❄', '⬟', '⬢', '✚', '◐', '☁', '♛'];
export function makeCode(words, rand){
  const abc = 'abcdefghijklmnopqrstuvwxyz'.split(''), syms = shuffleWith(rand, SYMBOLS);
  const code = Object.fromEntries(abc.map((ch, i) => [ch, syms[i]]));
  const used = [...new Set(words.flatMap(w => [...letters(w)]))];
  // give away about half the letters, and always at least one letter of every word, so each word can be worked out
  const shown = new Set(shuffleWith(rand, used).slice(0, Math.ceil(used.length / 2)));
  for (const w of words) if (![...letters(w)].some(ch => shown.has(ch))) shown.add(letters(w)[0]);
  return { code, shown: [...shown].sort() };
}
export const encode = (word, code) => [...letters(word)].map(ch => code[ch]);
/** the letters she knows: the ones the key gave her, plus every letter of a word she has solved (sorted) */
export const knownLetters = (shown, solvedWords) => [...new Set([...shown, ...solvedWords.flatMap(w => [...letters(w)])])].sort();

/* ---------- crossword ---------- */
/** Lays out words in a crossword (each crossing at least one other word). Tries several orders and keeps the one that
    places the most words in the smallest box, no wider than maxW. Returns {w, h, entries:[{word, row, col, dir, num}]}. */
export function buildCrossword(words, rand, { maxW = 12, maxH = 14, tries = 40 } = {}){
  const list = [...new Set(words.map(letters).filter(w => w.length >= 3 && w.length <= Math.max(maxW, maxH)))];
  let best = null;
  for (let t = 0; t < tries; t++) {
    const order = t === 0 ? list.slice().sort((a, b) => b.length - a.length) : shuffleWith(rand, list);
    const grid = new Map(), placed = [];
    const at = (r, c) => grid.get(`${r},${c}`);
    const fits = (w, r, c, dir) => {
      const dr = dir === 'down' ? 1 : 0, dc = dir === 'across' ? 1 : 0;
      if (at(r - dr, c - dc) || at(r + dr * w.length, c + dc * w.length)) return -1;   // nothing right before or after
      let cross = 0;
      for (let i = 0; i < w.length; i++) {
        const rr = r + dr * i, cc = c + dc * i, cell = at(rr, cc);
        if (cell) { if (cell.ch !== w[i] || cell[dir]) return -1; cross++; }
        else if (at(rr + dc, cc + dr) || at(rr - dc, cc - dr)) return -1;   // no letters touching side by side
      }
      return cross;
    };
    const put = (w, r, c, dir) => {
      const dr = dir === 'down' ? 1 : 0, dc = dir === 'across' ? 1 : 0;
      for (let i = 0; i < w.length; i++) { const k = `${r + dr * i},${c + dc * i}`, cell = grid.get(k) || { ch: w[i] }; cell[dir] = true; grid.set(k, cell); }
      placed.push({ word: w, row: r, col: c, dir });
    };
    const box = () => { let r0 = 1e9, r1 = -1e9, c0 = 1e9, c1 = -1e9; for (const k of grid.keys()) { const [r, c] = k.split(',').map(Number); r0 = Math.min(r0, r); r1 = Math.max(r1, r); c0 = Math.min(c0, c); c1 = Math.max(c1, c); } return { r0, r1, c0, c1 }; };
    put(order[0], 0, 0, 'across');
    let waiting = order.slice(1);
    for (let pass = 0; pass < 3 && waiting.length; pass++) { const later = []; for (const w of waiting) {
      let pick = null, pickScore = -Infinity;
      for (const [k, cell] of grid) {
        const [r, c] = k.split(',').map(Number);
        for (let i = 0; i < w.length; i++) {
          if (w[i] !== cell.ch) continue;
          for (const dir of ['across', 'down']) {
            const rr = dir === 'down' ? r - i : r, cc = dir === 'across' ? c - i : c, cross = fits(w, rr, cc, dir);
            if (cross < 1) continue;
            const b = box(), nb = { r0: Math.min(b.r0, rr), c0: Math.min(b.c0, cc), r1: Math.max(b.r1, dir === 'down' ? rr + w.length - 1 : rr), c1: Math.max(b.c1, dir === 'across' ? cc + w.length - 1 : cc) };
            if (nb.c1 - nb.c0 + 1 > maxW || nb.r1 - nb.r0 + 1 > maxH) continue;
            const score = cross * 10 - (nb.c1 - nb.c0 + nb.r1 - nb.r0) + rand();
            if (score > pickScore) { pickScore = score; pick = { rr, cc, dir }; }
          }
        }
      }
      if (pick) put(w, pick.rr, pick.cc, pick.dir); else later.push(w);
    } waiting = later; }
    const b = box(), w = b.c1 - b.c0 + 1, h = b.r1 - b.r0 + 1;
    if (w > maxW || h > maxH) continue;
    const score = placed.length * 1000 - w * h;
    if (!best || score > best.score) best = { score, w, h, placed: placed.map(p => ({ ...p, row: p.row - b.r0, col: p.col - b.c0 })) };
  }
  if (!best) return { w: 0, h: 0, entries: [] };
  // number the starts in reading order, across and down sharing a number when they start on the same square
  const starts = [...new Set(best.placed.map(p => `${p.row},${p.col}`))].map(k => k.split(',').map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const num = new Map(starts.map(([r, c], i) => [`${r},${c}`, i + 1]));
  const entries = best.placed.map(p => ({ ...p, num: num.get(`${p.row},${p.col}`) })).sort((a, b) => (a.dir === b.dir ? a.num - b.num : a.dir === 'across' ? -1 : 1));
  return { w: best.w, h: best.h, entries };
}
/** each square of a crossword: null (black) or {ch, num?} */
export function crosswordCells(cw){
  const cells = Array.from({ length: cw.h }, () => Array(cw.w).fill(null));
  for (const e of cw.entries) for (let i = 0; i < e.word.length; i++) {
    const r = e.row + (e.dir === 'down' ? i : 0), c = e.col + (e.dir === 'across' ? i : 0);
    cells[r][c] = { ...(cells[r][c] || {}), ch: e.word[i], ...(i === 0 ? { num: e.num } : {}) };
  }
  return cells;
}

/* ---------- word search ---------- */
const DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1]];   // right, down, down-right, up-right (always read left to right or down)
/** Hides the words in a size × size grid of letters. Returns {size, grid: string[][], placed:[{word, r, c, dr, dc}]}. */
export function buildWordSearch(words, rand, size = 10){
  const list = [...new Set(words.map(letters).filter(w => w.length >= 3 && w.length <= size))].sort((a, b) => b.length - a.length);
  let best = null;
  for (let t = 0; t < 30 && (!best || best.placed.length < list.length); t++) {
    const grid = Array.from({ length: size }, () => Array(size).fill('')), placed = [];
    for (const w of list) {
      const spots = [];
      for (const [dr, dc] of DIRS) for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
        const er = r + dr * (w.length - 1), ec = c + dc * (w.length - 1);
        if (er < 0 || er >= size || ec < 0 || ec >= size) continue;
        let ok = true, overlap = 0;
        for (let i = 0; i < w.length && ok; i++) { const g = grid[r + dr * i][c + dc * i]; if (g && g !== w[i]) ok = false; else if (g) overlap++; }
        if (ok) spots.push({ r, c, dr, dc, overlap });
      }
      if (!spots.length) continue;
      const s = shuffleWith(rand, spots).sort((a, b) => b.overlap - a.overlap)[rand() < 0.3 ? 0 : Math.floor(rand() * Math.min(8, spots.length))];
      for (let i = 0; i < w.length; i++) grid[s.r + s.dr * i][s.c + s.dc * i] = w[i];
      placed.push({ word: w, r: s.r, c: s.c, dr: s.dr, dc: s.dc });
    }
    if (!best || placed.length > best.placed.length) best = { grid, placed };
  }
  const abc = 'abcdefghijklmnopqrstuvwxyz';
  const grid = best.grid.map(row => row.map(ch => ch || abc[Math.floor(rand() * 26)]));
  return { size, grid, placed: best.placed };
}
/** the word found between two tapped squares (either end first), or '' */
export function wordAt(ws, a, b){
  for (const p of ws.placed) {
    const end = [p.r + p.dr * (p.word.length - 1), p.c + p.dc * (p.word.length - 1)];
    const same = (x, y) => x[0] === y[0] && x[1] === y[1];
    if ((same(a, [p.r, p.c]) && same(b, end)) || (same(b, [p.r, p.c]) && same(a, end))) return p.word;
  }
  return '';
}
/** the squares a placed word covers, as "r,c" keys */
export const wordCells = p => Array.from({ length: p.word.length }, (_, i) => `${p.r + p.dr * i},${p.c + p.dc * i}`);

/* ---------- this week's words ---------- */
/** Monday of the week holding a "YYYY-MM-DD" day */
export function weekOf(day){
  const d = new Date(`${day}T12:00:00`), back = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - back);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
/** A new week's words (owner, Oct 28, 2026; docs/VOCAB.md "The weekly draw"): up to `fresh` (20) unmastered words plus
    up to `review` (5) mastered words to review.
    - Carried over: last week's words that are still unmastered (not mastered on Friday, or a review word she missed, which
      went back to unmastered) come first and count toward the 20, in last week's order; if there are more than 20, the
      first 20 carry and the rest wait in the unmastered pool.
    - New: the rest of the 20, picked at random from the other unmastered words.
    - Review: picked at random from the mastered words, preferring ones that weren't on last week's list.
    `unmastered` and `mastered` are word keys (or {w} entries). Returns {words, carried, added, review} as keys. */
export function nextWeekWords(prevWords, unmastered, mastered, { fresh = 20, review = 5, rand = Math.random } = {}){
  const key = w => String(typeof w === 'object' && w ? w.w : w).trim().toLowerCase();
  const pool = [...new Set(unmastered.map(key))], poolSet = new Set(pool), prev = [...new Set(prevWords.map(key))];
  const carried = prev.filter(k => poolSet.has(k)).slice(0, fresh), carriedSet = new Set(carried);
  const added = shuffleWith(rand, pool.filter(k => !carriedSet.has(k))).slice(0, Math.max(0, fresh - carried.length));
  const prevSet = new Set(prev), done = shuffleWith(rand, [...new Set(mastered.map(key))].filter(k => !poolSet.has(k)));
  const reviewed = [...done.filter(k => !prevSet.has(k)), ...done.filter(k => prevSet.has(k))].slice(0, review);
  return { words: [...carried, ...added, ...reviewed], carried, added, review: reviewed };
}
