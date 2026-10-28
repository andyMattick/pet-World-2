/* 🐾 Pet Hide-and-Seek (English Unit 5, prepositions). docs/HIDE-AND-SEEK.md
   Two versions, 4 levels each (owner, Oct 28, 2026: one game, with harder levels that show many relationships and bring
   in many more prepositions):
     📍 Find and place   p1 Living room: read where your pet is hiding, tap the spot
                         p2 Circus, one clue · p3 Circus, two clues ("under the balloon and next to the box")
                         p4 Stack it up: clues use the animals already placed ("on top of the dog")
     ✍️ Say where        s1 Living room: say where your pet is (preposition + object)
                         s2 Who's where: pick the animal and the word for the glowing thing
                         s3 Tell the circus: make 6 true sentences, each with a different preposition
                         s4 On the move: across, through, around, into, out of, toward, past, along, beyond, …
   The circus stage is a 5 × 4 grid (row 3 is the floor). Every relationship is worked out from the grid, and a clue is
   only used when exactly one spot fits all of it. Shared by the unit (game.js) and the Arcade copy (arcade/link-games):
   both render hideHTML / hideMenuHTML and pass taps to hideAct. No DOM here. */
import { ROOM, SPOTS, HIDE_PREPS, HIDE_OBJECTS, spotById, tellIsRight } from './grammarGames.js';

export const COLS = 5, ROWS = 4;
export const HIDE_LEVELS = [
  {id:'p1', mode:'place', emoji:'🛋️', name:'Living room', how:'Read where your pet is hiding, then tap the spot.'},
  {id:'p2', mode:'place', emoji:'🎪', name:'Circus: one clue', how:'Put each animal where the clue says.', circus:1},
  {id:'p3', mode:'place', emoji:'🧩', name:'Circus: two clues', how:'Each animal has two clues. Find the one spot that fits both.', circus:2},
  {id:'p4', mode:'place', emoji:'🤹', name:'Stack it up', how:'The clues use the animals you already placed.', circus:3},
  {id:'s1', mode:'say', emoji:'🛋️', name:'Living room', how:'Find your pet and say where it is.'},
  {id:'s2', mode:'say', emoji:'🔦', name:'Who’s where?', how:'Pick an animal and a preposition that tell where it is from the glowing thing.'},
  {id:'s3', mode:'say', emoji:'📣', name:'Tell the circus', how:'Make 6 true sentences about the circus, each with a different preposition.'},
  {id:'s4', mode:'say', emoji:'🏃', name:'On the move', how:'Watch the arrow and pick the word for where it goes.'}
];
export const hideLevel = id => HIDE_LEVELS.find(l => l.id === id);

/* word families: any word in a family is right for that relationship */
export const WORDS = {
  in:['in', 'inside', 'within'],
  on:['on', 'on top of', 'upon', 'atop'],
  under:['under', 'below', 'beneath', 'underneath'],
  above:['above', 'over'],
  next:['next to', 'beside', 'by', 'alongside'],
  left:['to the left of'],
  right:['to the right of'],
  between:['between']
};
/* a relationship that also counts when another one is true: a cat on a drum is also, loosely, above it */
const CLOSE = {on:['above']};

/* the props. surface: things can sit on it; under: it's off the ground, so there's room under it; container: things go in it */
const PROPS = {
  table:{emoji:'', name:'table', surface:true, under:true, table:true},
  drum:{emoji:'🥁', name:'drum', surface:true},
  box:{emoji:'📦', name:'box', surface:true, container:true},
  hat:{emoji:'🎩', name:'hat', container:true},
  basket:{emoji:'🧺', name:'basket', container:true},
  tub:{emoji:'🛁', name:'tub', container:true},
  elephant:{emoji:'🐘', name:'elephant', surface:true},
  clown:{emoji:'🤡', name:'clown', surface:true},
  balloon:{emoji:'🎈', name:'balloon', under:true},
  umbrella:{emoji:'☂️', name:'umbrella', under:true},
  cloud:{emoji:'☁️', name:'cloud', under:true},
  star:{emoji:'⭐', name:'star', under:true}
};
/* stages: [prop, row, col]. A table sits in row 2 with its legs down to the floor, so row 3 under it is open. */
export const STAGES = [
  [['drum', 3, 0], ['table', 2, 2], ['box', 3, 4], ['balloon', 1, 4], ['cloud', 0, 1]],
  [['elephant', 3, 1], ['hat', 3, 3], ['umbrella', 1, 3], ['star', 0, 0], ['basket', 3, 4]],
  [['tub', 3, 0], ['clown', 3, 2], ['balloon', 1, 2], ['table', 2, 4], ['cloud', 0, 3]],
  [['box', 3, 1], ['drum', 3, 3], ['umbrella', 1, 1], ['star', 0, 4], ['hat', 3, 4]]
];
export const ANIMALS = [
  {id:'dog', emoji:'🐶', name:'dog'}, {id:'cat', emoji:'🐱', name:'cat'}, {id:'rabbit', emoji:'🐰', name:'rabbit'},
  {id:'monkey', emoji:'🐵', name:'monkey'}, {id:'parrot', emoji:'🦜', name:'parrot', flies:true}, {id:'mouse', emoji:'🐭', name:'mouse'},
  {id:'duck', emoji:'🦆', name:'duck'}, {id:'bear', emoji:'🧸', name:'teddy bear'}, {id:'ball', emoji:'⚽', name:'ball'}
];
const shuffle = (a, rand) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, rand) => a[Math.floor(rand() * a.length)];

/* ---------- the board ---------- */
export function newBoard(stageIndex){
  return {stage:stageIndex, objects:STAGES[stageIndex].map(([id, r, c]) => ({id, ...PROPS[id], r, c, prop:true})), placed:[]};
}
const objAt = (board, r, c) => board.objects.find(o => o.r === r && o.c === c);
const itemAt = (board, r, c) => board.placed.find(p => p.r === r && p.c === c);
/* something holds it up: the floor, a container, or a prop or animal it can sit on (only the parrot can fly) */
function supported(board, r, c){
  if (r === ROWS - 1 || objAt(board, r, c)?.container) return true;
  const below = objAt(board, r + 1, c), animal = itemAt(board, r + 1, c);
  return !!(below?.surface || (animal && !animal.inside));
}
/* spots an animal can go: empty and held up (floor, a surface, an empty container), or anywhere empty for a flyer */
export function openSpots(board, animal = null){
  const out = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const o = objAt(board, r, c);
    if (itemAt(board, r, c)) continue;
    if ((!o || o.container) && (!animal || animal.flies || supported(board, r, c))) out.push({r, c});
  }
  return out;
}
/* what other things can be measured from: props, and animals that aren't tucked inside a container */
function refs(board, exceptId){
  return [...board.objects, ...board.placed.filter(p => p.id !== exceptId && !p.inside).map(p => ({...p, surface:true, under:p.r < ROWS - 1, animal:true}))];
}
/* is spot P in relationship rel {w, a, b?} (a, b are references)? */
export function holds(P, rel, board){
  const A = rel.a, B = rel.b;
  switch (rel.w) {
    case 'in': return !!A.container && P.r === A.r && P.c === A.c;
    case 'on': return !!A.surface && P.c === A.c && P.r === A.r - 1;
    case 'under': return !!A.under && P.c === A.c && P.r > A.r && (!A.animal || P.r === A.r + 1);   // under an animal: right under it
    case 'above': return P.c === A.c && P.r < A.r && !(A.surface && P.r === A.r - 1);
    case 'next': return P.r === A.r && Math.abs(P.c - A.c) === 1 && !(P.c === A.c && P.r === A.r);
    case 'left': return P.r === A.r && P.c < A.c;
    case 'right': return P.r === A.r && P.c > A.c;
    case 'between': return (P.r === A.r && P.r === B.r && ((A.c === P.c - 1 && B.c === P.c + 1) || (B.c === P.c - 1 && A.c === P.c + 1)))
      || (P.c === A.c && P.c === B.c && ((A.r === P.r - 1 && B.r === P.r + 1) || (B.r === P.r - 1 && A.r === P.r + 1)));
  }
  return false;
}
/* inside a container, a spot shares the container's cell: only "in" counts for it */
const insideSpot = (P, board) => !!objAt(board, P.r, P.c)?.container;
/* every relationship that's true for spot P */
export function truths(P, board, exceptId = ''){
  const list = [], R = refs(board, exceptId);
  if (insideSpot(P, board)) { const o = objAt(board, P.r, P.c); return [{w:'in', a:o}]; }
  for (const A of R) for (const w of ['on', 'under', 'above', 'next', 'left', 'right']) if (holds(P, {w, a:A}, board)) list.push({w, a:A});
  for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) if (holds(P, {w:'between', a:R[i], b:R[j]}, board)) list.push({w:'between', a:R[i], b:R[j]});
  return list;
}
const fits = (P, rels, board) => rels.every(rel => insideSpot(P, board) ? rel.w === 'in' && holds(P, rel, board) : rel.w !== 'in' && holds(P, rel, board));
/* clue-safe: no "above" a thing you could also be on (a kid could fairly put it on top), and nothing measured
   from the far side of the stage ("to the left of" only with another clue) */
const clueSafe = (rel, k) => !(rel.w === 'above' && rel.a.surface) && !((rel.w === 'left' || rel.w === 'right') && k === 1);
const combos = (list, k) => k === 1 ? list.map(x => [x]) : list.flatMap((x, i) => list.slice(i + 1).map(y => [x, y]));
/* a clue for one animal: {spot, rels} where exactly one open spot fits all of rels */
export function makeClue(board, level, rand, animal = null){
  const open = openSpots(board, animal), spots = shuffle(open, rand);
  for (const pass of [0, 1]) for (const k of level === 1 ? [1] : level === 2 ? [2] : shuffle([1, 2], rand)) for (const P of spots) {
    const rs = truths(P, board).filter(rel => clueSafe(rel, k) && (level !== 1 && level !== 2 || !rel.a.animal && !rel.b?.animal));
    const side = rels => rels.filter(rel => rel.w === 'left' || rel.w === 'right').length;
    for (const rels of shuffle(combos(rs, k), rand).sort((x, y) => side(x) - side(y))) {   // "to the left of" only when nothing else works
      if (level === 3 && pass === 0 && board.placed.length && !rels.some(rel => rel.a.animal || rel.b?.animal)) continue;   // stack it up: use an animal when there is one
      if (rels.length === 2 && rels[0].a === rels[1].a && rels[0].w !== 'between') continue;   // two clues about the same thing read oddly
      const ok = open.filter(Q => fits(Q, rels, board));
      if (ok.length !== 1 || ok[0].r !== P.r || ok[0].c !== P.c) continue;
      if (level === 3 && k === 1 && pass === 0 && !rels[0].a.animal) continue;   // one clue only when it's about an animal
      if (k === 2 && pass === 0 && rels.some(rel => open.filter(Q => fits(Q, [rel], board)).length === 1)) continue;   // both clues needed
      return {spot:P, rels};
    }
  }
  return null;
}
const nameOf = A => `the ${A.name}`;
export function phrase(rel, rand){
  const word = pick(WORDS[rel.w], rand);
  return rel.w === 'between' ? `${word} ${nameOf(rel.a)} and ${nameOf(rel.b)}` : `${word} ${nameOf(rel.a)}`;
}

/* ---------- 🏃 level 5: motion and position scenes (drawn as emoji on a small SVG; the arrow shows the path) ----------
   items: [emoji, x, y, size]; path: SVG path for the arrow; answer + 3 wrong words that clearly don't fit the picture. */
export const MOVES = [
  {id:'across', s:'The 🐕 dog runs ___ the bridge.', items:[['🌉', 160, 108, 70]], path:'M 70 70 L 255 70', answer:'across', wrong:['under', 'into', 'around'], meaning:'from one side to the other'},
  {id:'under', s:'The 🦆 duck swims ___ the bridge.', items:[['🌉', 160, 92, 70], ['🌊', 160, 140, 40]], path:'M 60 128 L 260 128', answer:'under', wrong:['over', 'onto', 'off'], meaning:'below something'},
  {id:'through', s:'The 🦁 lion jumps ___ the hoop.', items:[['⭕', 165, 78, 64]], path:'M 50 110 Q 165 40 280 110', answer:'through', wrong:['around', 'onto', 'out of'], meaning:'in one side and out the other'},
  {id:'around', s:'The 🐎 horse runs ___ the tent.', items:[['🎪', 160, 92, 60]], path:'M 160 30 A 80 52 0 1 1 159 30', answer:'around', wrong:['into', 'off', 'through'], meaning:'in a circle on every side'},
  {id:'into', s:'The 🦆 duck jumps ___ the tub.', items:[['🛁', 210, 120, 56]], path:'M 60 130 Q 140 10 205 105', answer:'into', wrong:['out of', 'off', 'along'], meaning:'from outside to inside'},
  {id:'outof', s:'The 🐰 rabbit jumps ___ the hat.', items:[['🎩', 110, 125, 56]], path:'M 110 100 Q 170 10 250 110', answer:'out of', wrong:['into', 'under', 'toward'], meaning:'from inside to outside'},
  {id:'onto', s:'The 🐱 cat jumps ___ the drum.', items:[['🥁', 220, 125, 54]], path:'M 70 135 Q 150 20 215 85', answer:'onto', wrong:['off', 'into', 'through'], meaning:'up to a place on top'},
  {id:'off', s:'The 🐵 monkey jumps ___ the box.', items:[['📦', 100, 125, 56]], path:'M 100 82 Q 180 20 260 135', answer:'off', wrong:['onto', 'into', 'across'], meaning:'away from the top of something, down'},
  {id:'toward', s:'The 🐶 puppy runs ___ the ball.', items:[['⚽', 255, 120, 34]], path:'M 50 120 L 205 120', answer:'toward', wrong:['away from', 'past', 'around'], meaning:'in the direction of'},
  {id:'awayfrom', s:'The 🐭 mouse runs ___ the cat.', items:[['🐈', 80, 118, 46]], path:'M 125 120 L 275 120', answer:'away from', wrong:['toward', 'into', 'onto'], meaning:'in the other direction from'},
  {id:'past', noFlip:true, s:'The 🤡 clown walks ___ the elephant.', items:[['🐘', 160, 115, 56]], path:'M 40 140 L 285 140', answer:'past', wrong:['toward', 'into', 'through'], meaning:'by and beyond something'},
  {id:'along', s:'The 🐜 ants march ___ the rope.', items:[], line:'M 30 90 L 290 90', path:'M 50 78 L 270 78', answer:'along', wrong:['into', 'off', 'under'], meaning:'following the length of something'},
  {id:'up', s:'The 🐿️ squirrel climbs ___ the tree.', items:[['🌳', 170, 95, 90]], path:'M 205 140 L 205 45', answer:'up', wrong:['down', 'off', 'into'], meaning:'toward a higher place'},
  {id:'down', s:'The 🛷 sled slides ___ the hill.', items:[], hill:'M 20 40 L 300 150 L 20 150 Z', path:'M 60 40 L 250 115', answer:'down', wrong:['up', 'into', 'through'], meaning:'toward a lower place'},
  {id:'over', s:'The 🐴 pony jumps ___ the fence.', items:[['🚧', 160, 125, 46]], path:'M 50 135 Q 160 0 270 135', answer:'over', wrong:['under', 'through', 'into'], meaning:'above and across something'},
  {id:'against', s:'The 🪜 ladder leans ___ the wall.', items:[['🧱', 230, 70, 44], ['🧱', 230, 112, 44], ['🪜', 190, 100, 70]], answer:'against', wrong:['under', 'into', 'off'], meaning:'touching and pushing on'},
  {id:'among', s:'The 🐝 bee buzzes ___ the flowers.', items:[['🌷', 90, 120, 40], ['🌻', 140, 105, 40], ['🌷', 195, 122, 40], ['🌼', 245, 108, 40], ['🐝', 168, 96, 28]], answer:'among', wrong:['under', 'off', 'across'], meaning:'in the middle of a group'},
  {id:'behind', s:'The 🐱 cat hides ___ the box.', items:[['🐱', 160, 64, 42], ['📦', 160, 118, 90]], answer:'behind', wrong:['on top of', 'into', 'across'], meaning:'at the back of'},
  {id:'infront', s:'The 🐶 dog sits ___ the tent.', items:[['🎪', 160, 62, 72], ['🐶', 160, 145, 38]], answer:'in front of', wrong:['behind', 'inside', 'on top of'], meaning:'facing you, at the front'},
  {id:'beyond', s:'The 🏰 castle is ___ the lake.', items:[['🏰', 160, 42, 28], ['🌊', 90, 95, 40], ['🌊', 135, 95, 40], ['🌊', 185, 95, 40], ['🌊', 230, 95, 40], ['🧍', 160, 148, 36]], answer:'beyond', wrong:['inside', 'under', 'onto'], meaning:'on the far side of'},
  {id:'acrossfrom', s:'The 🏠 house is ___ the 🏫 school.', items:[['🏠', 70, 100, 56], ['🛣️', 160, 104, 50], ['🏫', 250, 100, 56]], answer:'across from', wrong:['inside', 'on top of', 'under'], meaning:'on the other side, facing'},
  {id:'below', s:'The 🐟 fish swims ___ the boat.', items:[['⛵', 160, 60, 50], ['🌊', 100, 90, 30], ['🌊', 220, 90, 30], ['🐟', 160, 130, 34]], answer:'below', wrong:['onto', 'out of', 'across from'], meaning:'lower than something'}
];
export const MOVE_ROUNDS = 10;

/* ---------- a run ---------- */
const PLACE_BOARDS = 2, PLACE_EACH = 4, ROOM_ROUNDS = 8, WHO_ROUNDS = 8, TELL_SENTENCES = 6;
const SAY_FAMILIES = ['in', 'on', 'under', 'above', 'next'];   // "Who's where?" (left and right fit too many pairs)
const TELL_FAMILIES = ['in', 'on', 'under', 'above', 'next', 'left', 'right'];
export function newHideRun(levelId, rand = Math.random, pet = '🐶'){
  const L = hideLevel(levelId), run = {game:'hide', level:L.id, i:0, first:0, tries:0, msg:'', ok:false, reveal:false, finished:false, picks:{}, pet};
  if (L.id === 'p1' || L.id === 's1') { run.total = ROOM_ROUNDS; run.rounds = shuffle(SPOTS, rand).slice(0, ROOM_ROUNDS).map(sp => ({spot:sp.id, clue:pick(sp.phrases, rand)})); }
  else if (L.circus) { run.total = PLACE_BOARDS * PLACE_EACH; run.stages = shuffle([0, 1, 2, 3], rand).slice(0, PLACE_BOARDS); run.b = 0; startBoard(run, rand); }
  else if (L.id === 's2') { run.total = WHO_ROUNDS; run.board = sayBoard(pick([0, 1, 2, 3], rand), rand); run.used = []; nextWho(run, rand); }
  else if (L.id === 's3') { run.total = TELL_SENTENCES; run.board = sayBoard(pick([0, 1, 2, 3], rand), rand); run.said = []; run.missed = false; run.words = TELL_FAMILIES.flatMap(w => WORDS[w]); }
  else { run.total = MOVE_ROUNDS; run.moves = shuffle(MOVES, rand).slice(0, MOVE_ROUNDS).map(m => ({...m, options:shuffle([m.answer, ...m.wrong], rand)})); }
  return run;
}
function startBoard(run, rand){
  run.board = newBoard(run.stages[run.b]);
  run.animals = shuffle(ANIMALS, rand).slice(0, PLACE_EACH); run.n = 0; nextClue(run, rand);
}
function nextClue(run, rand){
  const a = run.animals[run.n], level = hideLevel(run.level).circus;
  let clue = makeClue(run.board, level, rand, a);
  if (!clue) clue = makeClue(run.board, 1, rand, a);   // safety net: a one-clue spot
  run.clue = clue ? {...clue, animal:a, text:`Put the ${a.emoji} ${a.name} ${clue.rels.map(rel => phrase(rel, rand)).join(' and ')}.`} : null;
}
/* a built circus for the say levels: 5 animals, each held up by something */
function sayBoard(stage, rand){
  for (let t = 0; t < 40; t++) {
    const board = newBoard(stage);
    for (const a of shuffle(ANIMALS, rand).slice(0, 5)) {
      const P = shuffle(openSpots(board, a), rand).find(Q => truths(Q, board).some(rel => SAY_FAMILIES.includes(rel.w)));
      if (P) board.placed.push({...a, r:P.r, c:P.c, inside:insideSpot(P, board)});
    }
    if (board.placed.length === 5) return board;
  }
  return newBoard(stage);
}
const sameRef = (x, y) => (x?.id || x?.name) === (y?.id || y?.name);
/* the word families that are true for animal a measured from thing O (plus the close ones: on ≈ above, next ≈ left/right) */
function familiesFor(board, a, O){
  const ws = new Set(truths(a, board, a.id).filter(t => t.w !== 'between' && sameRef(t.a, O)).map(t => t.w));
  for (const w of [...ws]) for (const c of CLOSE[w] || []) ws.add(c);
  return ws;
}
export const familyOf = word => Object.keys(WORDS).find(w => WORDS[w].includes(word));
const thingsIn = board => [...board.objects, ...board.placed.filter(p => !p.inside)];
/* 🔦 Who's where? a glowing thing; at least one animal is in, on, under, above or next to it */
function nextWho(run, rand){
  const b = run.board, cands = shuffle(thingsIn(b), rand).map(O => ({O, pairs:b.placed.filter(a => a.id !== O.id).flatMap(a => [...familiesFor(b, a, O)].filter(w => SAY_FAMILIES.includes(w)).map(w => ({a, w})))})).filter(x => x.pairs.length);
  const fresh = cands.filter(x => !run.used.includes(x.O.id || x.O.name)), c = fresh[0] || cands[0];
  run.used.push(c.O.id || c.O.name);
  const words = shuffle([...SAY_FAMILIES.map(w => pick(WORDS[w], rand)), ...shuffle(SAY_FAMILIES, rand).slice(0, 2).map(w => pick(WORDS[w], rand))].filter((w, i, all) => all.indexOf(w) === i), rand);
  run.who = {O:c.O, pairs:c.pairs, words, animals:shuffle(b.placed.filter(a => a.id !== c.O.id), rand)};
  run.picks = {};
}

/* ---------- drawing ---------- */
const X = c => (c + 0.5) * (100 / COLS), TOP = r => r * (100 / ROWS);
function stageHTML(board, opts = {}){
  const {taps = [], hi = null, esc = s => s, focus = null} = opts, glowing = o => focus && focus.includes(o.id || o.name);
  const props = board.objects.map(o => o.table
    ? `<div class="pc-table${glowing(o) ? ' focus' : ''}" style="left:${X(o.c)}%;top:${TOP(o.r) + 2}%" aria-label="table"></div>`
    : `<span class="pc-prop${o.r < ROWS - 1 && !o.surface ? ' float' : ''}${glowing(o) ? ' focus' : ''}" style="left:${X(o.c)}%;top:${TOP(o.r)}%" aria-label="${o.name}">${o.emoji}</span>`).join('');
  const animals = board.placed.map(a => `<span class="pc-animal${a.inside ? ' inside' : ''}${glowing(a) ? ' focus' : ''}" style="left:${X(a.c)}%;top:${TOP(a.r)}%" aria-label="${esc(a.name)}">${a.emoji}</span>`).join('');
  const spots = taps.map(P => `<button type="button" class="pc-spot" style="left:${X(P.c)}%;top:${TOP(P.r)}%" data-pc-spot="${P.r},${P.c}" aria-label="Row ${P.r + 1}, column ${P.c + 1}"></button>`).join('');
  const glow = hi ? `<span class="pc-glow" style="left:${X(hi.c)}%;top:${TOP(hi.r)}%"></span>` : '';
  return `<div class="pc-stage">${props}${animals}${glow}${spots}</div>`;
}
/* the living room from the first Hide-and-Seek */
function roomHTML(run, showPet){
  const r = run.rounds[run.i], spot = spotById(r.spot);
  const furniture = ROOM.map(f => f.table ? `<div class="hs-table" style="left:${f.x}%;top:${f.y}%"></div>`
    : f.rug ? `<div class="hs-rug" style="left:${f.x}%;top:${f.y}%"></div>`
    : `<span class="hs-item${f.shelf ? ' hs-shelf' : ''}" style="left:${f.x}%;top:${f.y}%;font-size:${f.size}em" aria-hidden="true">${f.emoji}</span>`).join('');
  const petHTML = showPet ? `<span class="hs-pet${spot.behind ? ' behind' : ''}" style="left:${spot.x}%;top:${spot.y}%" aria-label="Your pet">${run.pet}</span>` : '';
  const taps = run.level === 'p1' && !run.reveal ? SPOTS.map(s => `<button type="button" class="hs-spot" style="left:${s.x}%;top:${s.y}%" data-hs-spot="${s.id}" aria-label="Look here"></button>`).join('') : '';
  return `<div class="hs-room">${furniture}${petHTML}${taps}</div>`;
}
const selectHTML = (name, label, list, chosen, esc, disabled) => `<select data-pick="${name}" aria-label="${label}" ${disabled ? 'disabled' : ''}><option value="">${label}…</option>${list.map(([v, t]) => `<option value="${esc(v)}"${chosen === v ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select>`;
/* the one that moves starts at the beginning of the arrow (its emoji is the first one in the sentence) */
function mover(m){
  if (!m.path) return '';
  const who = m.s.match(/^The (\S+)/)?.[1] || '', [x, y] = m.path.match(/^M\s*([\d.]+)\s+([\d.]+)/).slice(1).map(Number);
  const endX = +m.path.trim().split(/\s+/).at(-2), flip = endX > x + 20 && !m.noFlip;   // animal emoji face left: turn it to face where it goes
  return `<text x="${x}" y="${y - 6}" font-size="34" text-anchor="middle" dominant-baseline="middle"${flip ? ` transform="translate(${2 * x} 0) scale(-1 1)"` : ''}>${who}</text>`;
}
function moveSVG(m){
  const items = m.items.map(([e, x, y, size]) => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" dominant-baseline="middle">${e}</text>`).join('');
  return `<svg viewBox="0 0 320 170" class="pc-move" role="img" aria-label="${m.s.replace('___', 'blank')}"><defs><marker id="pcArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#E4577A"/></marker></defs>
    ${m.hill ? `<path d="${m.hill}" fill="#9BCB7A"/>` : ''}${m.line ? `<path d="${m.line}" stroke="#8B5E3C" stroke-width="5" fill="none"/>` : ''}${items}${mover(m)}${m.path ? `<path d="${m.path}" stroke="#E4577A" stroke-width="4" stroke-dasharray="8 6" fill="none" marker-end="url(#pcArrow)"/>` : ''}</svg>`;
}
const stars = n => '⭐'.repeat(n) + '☆'.repeat(3 - n);
export function hideMenuHTML(levelStars = {}, esc = s => s){
  const group = (mode, title, note) => `<h3 class="pc-mode">${title}</h3><p class="muted" style="margin-top:0">${note}</p><div class="pc-levels">${HIDE_LEVELS.filter(l => l.mode === mode).map((l, i) => `<button type="button" class="pc-level" data-pc-level="${l.id}"><span class="pc-level-e">${l.emoji}</span><span><b>${i + 1}. ${esc(l.name)}</b><span class="muted">${esc(l.how)} · ${levelStars[l.id] ? stars(levelStars[l.id]) : 'Not played yet'}</span></span></button>`).join('')}</div>`;
  return group('place', '📍 Find and place', 'Read the clues and put each one in the right spot.') + group('say', '✍️ Say where', 'Look at the picture and pick the words that say where everyone is.');
}
export function hideHTML(run, esc = s => s){
  const L = hideLevel(run.level), num = HIDE_LEVELS.filter(l => l.mode === L.mode).indexOf(L) + 1;
  const head = `<p><b>${L.mode === 'place' ? '📍 Find and place' : '✍️ Say where'} ${num}: ${esc(L.name)}</b> · ${Math.min(run.i + 1, run.total)} of ${run.total} · ⭐ ${run.first} on the first try</p>`;
  const msg = run.msg ? `<p class="${run.ok ? 'sim-news' : 'dig-hint'}">${run.msg}</p>` : '';
  const next = run.reveal ? `<button type="button" class="btn berry" data-pc-next>${run.i + 1 < run.total ? 'Next' : 'Finish'}</button>` : '';
  if (run.level === 'p1') return `${head}<p class="gg-ask">🔎 Your pet is hiding <b>${esc(run.rounds[run.i].clue)}</b>. Tap the spot!</p>${roomHTML(run, run.reveal)}${msg}${next}`;
  if (run.level === 's1') return `${head}<p class="gg-ask">✍️ Where is your pet? Finish the sentence.</p>${roomHTML(run, true)}
    <div class="row hs-tell"><span>My pet is</span>${selectHTML('prep', 'preposition', HIDE_PREPS.map(p => [p, p]), run.picks.prep, esc, run.reveal)}${selectHTML('obj', 'object', HIDE_OBJECTS.map(o => [o, o]), run.picks.obj, esc, run.reveal)}<span>.</span>
    <button type="button" class="btn berry" data-pc-check ${run.reveal ? 'disabled' : ''}>Check</button></div>${msg}${next}`;
  if (L.circus) {
    const c = run.clue;
    return `${head}<p class="gg-ask">🎪 ${esc(c.text)}</p>${stageHTML(run.board, {taps:run.reveal ? [] : openSpots(run.board, c.animal), hi:run.reveal && !run.ok ? c.spot : null, esc})}
      <p class="muted pc-left">Still to place: ${run.animals.slice(run.n + (run.reveal ? 1 : 0)).map(a => a.emoji).join(' ') || 'none'}</p>${msg}${next}`;
  }
  if (run.level === 's2') {
    const w = run.who;
    return `${head}<p class="gg-ask">🔦 Who is near the glowing ${esc(w.O.name)}? Pick an animal and the word that tells where it is.</p>${stageHTML(run.board, {esc, focus:[w.O.id || w.O.name]})}
      <div class="row hs-tell"><span>The</span>${selectHTML('animal', 'animal', w.animals.map(a => [a.id, `${a.emoji} ${a.name}`]), run.picks.animal, esc, run.reveal)}<span>is</span>${selectHTML('word', 'preposition', w.words.map(x => [x, x]), run.picks.word, esc, run.reveal)}<span>the ${w.O.emoji || ''} ${esc(w.O.name)}.</span>
      <button type="button" class="btn berry" data-pc-check ${run.reveal ? 'disabled' : ''}>Check</button></div>${msg}${next}`;
  }
  if (run.level === 's3') {
    const things = thingsIn(run.board).map(o => [o.id || o.name, `the ${o.emoji ? o.emoji + ' ' : ''}${o.name}`]);
    return `${head}<p class="gg-ask">📣 Tell about the circus: make ${run.total} true sentences, each with a different preposition.</p>${stageHTML(run.board, {esc})}
      <div class="row hs-tell"><span>The</span>${selectHTML('animal', 'animal', run.board.placed.map(a => [a.id, `${a.emoji} ${a.name}`]), run.picks.animal, esc)}<span>is</span>${selectHTML('word', 'preposition', run.words.filter(x => !run.said.some(s => s.word === x)).map(x => [x, x]), run.picks.word, esc)}${selectHTML('thing', 'what', things, run.picks.thing, esc)}<span>.</span>
      <button type="button" class="btn berry" data-pc-check>Check</button></div>${msg}
      ${run.said.length ? `<ol class="pc-said">${run.said.map(s => `<li>✅ ${esc(s.text)}</li>`).join('')}</ol>` : ''}`;
  }
  const m = run.moves[run.i], word = run.reveal ? `<b>${esc(m.answer)}</b>` : '<span class="pc-blank">___</span>';
  return `${head}${moveSVG(m)}<p class="gg-ask">${esc(m.s).replace('___', word)}</p>
    <div class="row pc-options">${m.options.map(o => `<button type="button" class="btn${run.reveal && o === m.answer ? ' mint' : ''}" data-pc-word="${esc(o)}" ${run.reveal ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>${msg}${next}`;
}

/* ---------- taps: data is the button's dataset plus picks (the values of the [data-pick] menus); returns 'good', 'bad'
   or '' for the host's sound, and sets run.finished at the end ---------- */
export function hideAct(run, data, rand = Math.random){
  if (run.finished) return '';
  if (data.picks) run.picks = {...run.picks, ...data.picks};
  if (data.pcNext != null) {
    run.i++; run.tries = 0; run.msg = ''; run.reveal = false; run.ok = false; run.picks = {};
    if (hideLevel(run.level).circus) {
      run.n++;
      if (run.n >= PLACE_EACH) { run.b++; if (run.b < PLACE_BOARDS) startBoard(run, rand); }
      else nextClue(run, rand);
    }
    if (run.level === 's2' && run.i < run.total) nextWho(run, rand);
    if (run.i >= run.total) run.finished = true;
    return '';
  }
  if (run.reveal) return '';
  if (data.hsSpot && run.level === 'p1') { const r = run.rounds[run.i]; return answer(run, data.hsSpot === r.spot, null, `Your pet was ${r.clue}.`); }
  if (data.pcCheck != null && run.level === 's1') {
    const r = run.rounds[run.i], {prep, obj} = run.picks;
    if (!prep || !obj) { run.ok = false; run.msg = 'Pick a preposition and an object.'; return ''; }
    const right = tellIsRight(r.spot, prep, obj);
    return answer(run, right, null, `${right ? 'Yes: ' : 'Your pet is '}${spotById(r.spot).phrases.join(', or ')}.`);
  }
  if (data.pcSpot && hideLevel(run.level).circus) {
    const [r, c] = data.pcSpot.split(',').map(Number), P = {r, c}, clue = run.clue;
    const right = fits(P, clue.rels, run.board) && openSpots(run.board, clue.animal).some(Q => Q.r === r && Q.c === c);
    return answer(run, right, () => place(run, right ? P : clue.spot), `The ${clue.animal.name} goes ${clue.rels.map(rel => phrase(rel, rand)).join(' and ')}.`);
  }
  if (data.pcCheck != null && run.level === 's2') {
    const w = run.who, a = w.animals.find(x => x.id === run.picks.animal), word = run.picks.word;
    if (!a || !word) { run.ok = false; run.msg = 'Pick an animal and a preposition.'; return ''; }
    const right = familiesFor(run.board, a, w.O).has(familyOf(word));
    const shown = w.pairs.slice(0, 3).map(p => `the ${p.a.name} is ${pick(WORDS[p.w], rand)} the ${w.O.name}`);
    return answer(run, right, null, right ? `The ${a.name} is ${word} the ${w.O.name}.${w.pairs.length > 1 ? ` Also true: ${shown.filter(x => !x.startsWith(`the ${a.name} `)).slice(0, 2).join('; ') || shown[0]}.` : ''}` : `Here’s one that’s true: ${shown[0]}.`);
  }
  if (data.pcCheck != null && run.level === 's3') {
    const a = run.board.placed.find(x => x.id === run.picks.animal), word = run.picks.word, O = thingsIn(run.board).find(o => (o.id || o.name) === run.picks.thing);
    if (!a || !word || !O) { run.ok = false; run.msg = 'Pick an animal, a preposition and what it’s near.'; return ''; }
    if (run.said.some(s => s.word === word)) { run.ok = false; run.msg = `You used “${word}” already. Try a new preposition!`; return ''; }
    if (O === a || (O.id && O.id === a.id)) { run.ok = false; run.msg = 'Pick something other than the animal itself.'; return ''; }
    const text = `The ${a.name} is ${word} the ${O.name}.`;
    if (!familiesFor(run.board, a, O).has(familyOf(word))) { run.missed = true; run.ok = false; run.msg = `Not quite: look again. Is the ${a.name} really ${word} the ${O.name}?`; return 'bad'; }
    if (!run.missed) run.first++;
    run.said.push({word, text}); run.missed = false; run.i = run.said.length; run.ok = true; run.msg = `✅ ${text}`; run.picks = {};
    if (run.said.length >= run.total) { run.i = run.total - 1; run.finished = true; }
    return 'good';
  }
  if (data.pcWord && run.level === 's4') {
    const m = run.moves[run.i], right = data.pcWord === m.answer;
    return answer(run, right, null, `“${m.answer}” means ${m.meaning}.`);
  }
  return '';
}
function place(run, P){
  const a = run.clue.animal;
  run.board.placed.push({...a, r:P.r, c:P.c, inside:insideSpot(P, run.board)});
}
function answer(run, right, onDone, shown){
  run.tries++;
  if (right) { if (run.tries === 1) run.first++; run.ok = true; run.reveal = true; run.msg = `✅ ${run.tries === 1 ? 'First try! ' : ''}${shown}`; onDone?.(); return 'good'; }
  if (run.tries >= 2) { run.ok = false; run.reveal = true; run.msg = `Not quite. ${shown}`; onDone?.(); return 'bad'; }
  run.ok = false; run.msg = 'Not quite. Read it again and look closely. One more try!'; return 'bad';
}
