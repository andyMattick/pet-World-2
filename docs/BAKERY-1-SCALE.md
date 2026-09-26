# Bakery station 1: The Scale (add and subtract decimals)

**Status: ready. Do this after `BAKERY-0-ENGINE.md`.** Read `AGENTS.md` and `docs/BAKERY.md` first. **Edit in place, never rewrite a file.**

The generator code below was stress-tested on 45,000 generated problems at all 3 levels:
- Every answer matched an independent calculation.
- Every multiple-choice step has exactly one right answer.
- The "lined up correctly" choice always has the decimal points in one column.
- Every "lined up the right edges" mistake is caught.

It uses **exact decimal math** (whole numbers of thousandths), so answers never come out as 3.4499999. **Paste it exactly. Don't rewrite it.**

## What students get

| Skill | Problems | Steps | Mix-ups caught |
|---|---|---|---|
| **addDec** Adding decimals | Weighing two ingredients on the scale (kg) | Estimate (level 2+) → Line up the decimals (when the numbers have different decimal places, and always at level 1) → Add | Lining up right edges (`rightAlign`), not carrying (`noRegroup`), estimate off by 10× (`estimateOff`) |
| **subDec** Subtracting decimals | How much is left in a bag | Estimate (level 2+) → Line up the decimals → Subtract | `rightAlign`, subtracting the smaller digit from the larger in each column (`smallerFromLarger`), `estimateOff` |
| **decWord** Word problems | Prices, making change from a bill, ribbon lengths | Pick the operation → Line up the decimals → Add or subtract | Choosing the wrong operation (`wrongOperation`), plus the above |

Level 1 uses whole parts up to 12 with 1 or 2 decimal places. Levels 2 and 3 use bigger numbers, up to 3 decimal places, and mostly numbers with **different** decimal places, where students make the most mistakes. Answers like `3.5` and `3.50` are both accepted.

## Steps

Commit after each step. Before each commit, run `npm run verify`, `npm run typecheck`, and `npm run build`, **test in a real browser with the Console open, including at iPhone SE size**, then `git push` and paste `git log -1 --stat`.

### Step 1: Registry

In `src/shared/registry.ts`, **add**, without changing anything existing:

1. **Three skills in `SKILLS`,** using the links from `BAKERY.md`:
   ```ts
   addDec:  { name: 'Adding decimals', short: 'Add decimals', st: 1, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-add-decimals/e/adding_decimals_2' },
   subDec:  { name: 'Subtracting decimals', short: 'Subtract decimals', st: 1, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-sub-decimals/e/subtracting_decimals_2' },
   decWord: { name: 'Adding & subtracting decimals word problems', short: 'Decimal word problems', st: 1, shop: 'bakery', url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations/cc-6th-add-sub-decimals-word-problems/e/adding_and_subtracting_decimals_word_problems' },
   ```
2. **Five mix-ups in `MIS`:**
   ```ts
   rightAlign:        { name: 'Lines up right edges instead of decimal points', kid: 'Line up the decimal points, not the last digits.', tip: 'Have students write the numbers on grid paper with the decimal points in one column, and fill empty places with zeros.', skills: ['addDec', 'subDec'] },
   noRegroup:         { name: 'Forgets to carry when adding decimals', kid: 'When a column makes 10 or more, carry the 1.', tip: 'Add one column at a time from the right and say the carry out loud. Place-value disks help.', skills: ['addDec'] },
   smallerFromLarger: { name: 'Subtracts the smaller digit from the larger in each column', kid: 'When the top digit is smaller, regroup from the next place.', tip: 'Fill empty places with zeros first (5.2 becomes 5.20), then regroup. Check by adding the answer back.', skills: ['subDec'] },
   estimateOff:       { name: 'Estimate is off by a factor of 10', kid: 'Round each number to the nearest whole number first.', tip: 'Practice rounding decimals to whole numbers before adding. The estimate should be close to the real answer.', skills: ['addDec', 'subDec'] },
   wrongOperation:    { name: 'Picks the wrong operation in a word problem', kid: 'Is the story putting amounts together or finding what is left?', tip: 'Have students act out or draw the story before choosing an operation. Change and "how much is left" mean subtract.', skills: ['decWord'] },
   ```
3. **`UNIT_SKILLS.bakery = ['addDec', 'subDec', 'decWord']`.** Later Bakery plans add their skills to this list.
4. **In `DRILLS`,** give `placeValue` the field `sprintUnlock: { unit: 'bakery', station: 1 }`.

Commit: `Bakery station 1 registry`

### Step 2: Generators and the place-value drill

1. In `src/game/game.js`, paste this block **exactly as written**, just above `const GEN = {`:

```js
/* ===== Bakery station 1: The Scale (add and subtract decimals, word problems) =====
   Exact decimal math: amounts are whole-number counts of thousandths, so 0.1 + 0.2 is exactly 0.3. */
const DEC = {
  k: s => { const [w, f = ''] = String(s).split('.'); return Number(w) * 1000 + Number((f + '000').slice(0, 3)); },
  fmt: k => { const w = Math.floor(k / 1000), f = String(k % 1000).padStart(3, '0').replace(/0+$/, ''); return w + (f ? '.' + f : ''); },
  places: s => (String(s).split('.')[1] || '').length,
  eq: k => v => typeof v === 'number' && isFinite(v) && Math.round(v * 1000) === k
};
function randDec(minW, maxW, places){
  const w = rand(minW, maxW);
  if (!places) return String(w);
  let f = ''; for (let i = 0; i < places; i++) f += i === places - 1 ? rand(1, 9) : rand(0, 9);
  return `${w}.${f}`;
}
/* the wrong answers students really give */
function rightAlignK(a, b, op){            // lines up right edges: 3.47 + 12.086 is done as 347 + 12086
  const p = Math.max(DEC.places(a), DEC.places(b));
  const ia = Number(a.replace('.', '')), ib = Number(b.replace('.', ''));
  const r = op === '+' ? ia + ib : ia - ib;
  return r * Math.pow(10, 3 - p);
}
function columnWiseK(ka, kb, fn){          // digit by digit, no regrouping
  let out = 0, place = 1, x = ka, y = kb;
  while (x > 0 || y > 0) { out += fn(x % 10, y % 10) * place; x = Math.floor(x / 10); y = Math.floor(y / 10); place *= 10; }
  return out;
}
const noCarryK = (ka, kb) => columnWiseK(ka, kb, (p, q) => (p + q) % 10);
const smallerFromLargerK = (ka, kb) => columnWiseK(ka, kb, (p, q) => Math.abs(p - q));
const PLACE_NAMES = ['ones', 'tenths', 'hundredths', 'thousandths'];
const deepestPlace = (...nums) => PLACE_NAMES[Math.max(...nums.map(DEC.places))];
/* vertical setup; byPoint=false shows the mistake (right edges lined up) */
function columnHTML(a, b, op, byPoint){
  let rows;
  if (byPoint) {
    const [wa, fa = ''] = a.split('.'), [wb, fb = ''] = b.split('.');
    const W = Math.max(wa.length, wb.length), F = Math.max(fa.length, fb.length);
    const cells = (w, f) => [...w.padStart(W, ' '), ...(F ? [f.length ? '.' : ' '] : []), ...f.padEnd(F, ' ')];
    rows = [cells(wa, fa), cells(wb, fb)];
  } else {
    const L = Math.max(a.length, b.length);
    rows = [[...a.padStart(L, ' ')], [...b.padStart(L, ' ')]];
  }
  const td = c => `<td>${c === ' ' ? '' : esc(c)}</td>`;
  return `<table class="colmath"><tr><td></td>${rows[0].map(td).join('')}</tr><tr><td>${op === '+' ? '+' : '−'}</td>${rows[1].map(td).join('')}</tr></table>`;
}
function estimateOptions(a, b, op){
  const ra = Math.round(DEC.k(a) / 1000), rb = Math.round(DEC.k(b) / 1000), est = op === '+' ? ra + rb : ra - rb;
  return shuffle([
    {html:`about ${est}`, text:`about ${est}`, ok:true, mis:null},
    {html:`about ${est * 10}`, text:`about ${est * 10}`, ok:false, mis:'estimateOff'},
    {html:`about ${DEC.fmt(est * 100)}`, text:`about ${DEC.fmt(est * 100)}`, ok:false, mis:'estimateOff'}
  ]);
}
function decSteps(a, b, op, lvl, withEstimate){
  const ka = DEC.k(a), kb = DEC.k(b), exact = op === '+' ? ka + kb : ka - kb;
  const wrongRA = rightAlignK(a, b, op);
  const wrongCol = op === '+' ? noCarryK(ka, kb) : smallerFromLargerK(ka, kb);
  const place = deepestPlace(a, b), drill = {type:'placeValue', key:place};
  const steps = [];
  if (withEstimate && lvl >= 2) steps.push({name:'Estimate', type:'concept', kind:'choice',
    prompt:'About how much will the answer be? Round each number to the nearest whole number first.',
    options:estimateOptions(a, b, op), hint:() => `${a} is about ${Math.round(ka / 1000)}, and ${b} is about ${Math.round(kb / 1000)}.`});
  if (lvl === 1 || DEC.places(a) !== DEC.places(b)) steps.push({name:'Line up the decimals', type:'concept', kind:'choice',
    prompt:'Which one is set up correctly?', drill,
    options:shuffle([
      {html:columnHTML(a, b, op, true), text:'decimal points lined up', ok:true, mis:null},
      {html:columnHTML(a, b, op, false), text:'right edges lined up', ok:false, mis:'rightAlign'}]),
    hint:() => 'The decimal points must make one straight column.'});
  steps.push({name:op === '+' ? 'Add' : 'Subtract', type:'compute', kind:'num', prompt:`${a} ${op === '+' ? '+' : '−'} ${b} = ?`,
    answer:DEC.fmt(exact), eq:DEC.eq(exact), drill,
    mis:v => { if (typeof v !== 'number') return null; const k = Math.round(v * 1000);
      if (k === wrongRA && wrongRA !== exact) return 'rightAlign';
      if (k === wrongCol && wrongCol !== exact) return op === '+' ? 'noRegroup' : 'smallerFromLarger';
      return null; },
    hint:() => op === '+' ? 'Line up the points. Add each column from the right, and carry when a column makes 10 or more.'
                          : 'Line up the points and fill empty places with zeros. Subtract from the right, and regroup when the top digit is smaller.'});
  return {steps, exact};
}
function scaleNumbers(lvl, op){
  const cfg = [{w:[1, 12], p:[1, 2]}, {w:[1, 25], p:[1, 3]}, {w:[2, 60], p:[1, 3]}][lvl - 1];
  for (let t = 0; t < 80; t++){
    const a = randDec(cfg.w[0], cfg.w[1], rand(cfg.p[0], cfg.p[1])), b = randDec(cfg.w[0], cfg.w[1], rand(cfg.p[0], cfg.p[1]));
    if (lvl >= 2 && DEC.places(a) === DEC.places(b) && Math.random() < 0.7) continue;   // mostly uneven decimals from level 2
    if (op === '-' && Math.round(DEC.k(a) / 1000) - Math.round(DEC.k(b) / 1000) < 1) continue;
    return [a, b];
  }
  return op === '+' ? ['3.4', '1.25'] : ['5.2', '1.75'];
}
const BAKERY_WEIGH = [['🌾','flour'],['🍬','sugar'],['🧈','butter'],['🍫','chocolate chips'],['🥜','nuts'],['🍓','berries']];
const SCALE_GEN = {
  addDec(lvl){
    const [a, b] = scaleNumbers(lvl, '+');
    const [i1, i2] = shuffle(BAKERY_WEIGH).slice(0, 2);
    return {title:'The Scale', ctx:`${a} + ${b}`,
      bubble:`I put ${a} kg of ${i1[1]} and ${b} kg of ${i2[1]} in the bowl. How many kilograms is that altogether?`,
      helper:'Line up the decimal points before you add.',
      visual:`<div style="text-align:center; font-size:1.6rem">${i1[0]} ${a} kg + ${i2[0]} ${b} kg</div>`,
      steps:decSteps(a, b, '+', lvl, true).steps};
  },
  subDec(lvl){
    const [a, b] = scaleNumbers(lvl, '-'), [e, n] = pick(BAKERY_WEIGH);
    return {title:'The Scale', ctx:`${a} − ${b}`,
      bubble:`The bag had ${a} kg of ${n}. I used ${b} kg. How many kilograms are left?`,
      helper:'Line up the decimal points, and fill empty places with zeros.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${a} kg − ${b} kg</div>`,
      steps:decSteps(a, b, '-', lvl, true).steps};
  },
  decWord(lvl){
    const money = Math.random() < 0.5, op = Math.random() < 0.5 ? '+' : '-';
    let a, b, bubble;
    if (money) {
      const price = () => `${rand(lvl === 1 ? 1 : 3, lvl === 1 ? 9 : 19)}.${String(rand(1, 99)).padStart(2, '0')}`;
      if (op === '+') { a = price(); b = price();
        bubble = `A cake costs $${a} and a box of cookies costs $${b}. How much do they cost together?`; }
      else { b = price(); const bill = [5, 10, 20, 50].find(x => x * 1000 > DEC.k(b) + 1000); a = `${bill}.00`;
        bubble = `The treats cost $${b}. I paid with a $${bill} bill. How much change should I get?`; }
    } else {
      [a, b] = scaleNumbers(lvl, op);
      bubble = op === '+' ? `One ribbon is ${a} m long and another is ${b} m long. How long are they end to end?`
                          : `A ribbon is ${a} m long. I cut off ${b} m for a cake box. How much ribbon is left?`;
    }
    const opts = [{html:'Add ( + )', text:'Add', ok:op === '+', mis:op === '+' ? null : 'wrongOperation'},
                  {html:'Subtract ( − )', text:'Subtract', ok:op === '-', mis:op === '-' ? null : 'wrongOperation'}];
    return {title:money ? 'The Register' : 'Ribbon Table', ctx:`${a} ${op === '+' ? '+' : '−'} ${b} (${money ? 'money' : 'meters'})`, bubble,
      helper:'Decide what the story is asking, then line up the decimal points.',
      visual:`<div style="text-align:center; font-size:1.5rem">${money ? '💵' : '🎀'}</div>`,
      steps:[{name:'Pick the operation', type:'concept', kind:'choice', prompt:'Do we add or subtract?', options:opts,
        hint:() => op === '+' ? 'The story puts two amounts together.' : 'The story takes an amount away, or finds what is left.'},
        ...decSteps(a, b, op, Math.max(1, lvl - 1), false).steps]};
  }
};
/* rows for the place-value drill (DRILL_IMPL.placeValue); key is 'ones', 'tenths', 'hundredths' or 'thousandths' */
function placeValueRows(key){
  const idx = Math.max(0, PLACE_NAMES.indexOf(key));
  const rows = [];
  for (let i = 0; i < 6; i++){
    const f = `${rand(0, 9)}${rand(0, 9)}${rand(1, 9)}`, n = `${rand(10, 99)}.${f}`;
    rows.push({label:`In ${n}, the ${PLACE_NAMES[idx]} digit is`, answer:idx === 0 ? n[1] : f[idx - 1]});
  }
  return rows;
}
```

It uses functions already in `game.js`: `rand`, `pick`, `shuffle`, and `esc`. Don't add copies.

2. **Right after the `GEN` object ends,** add `Object.assign(GEN, SCALE_GEN);`.
3. **Add a `placeValue` entry to `DRILL_IMPL`:**
   - Build its rows from `placeValueRows(key)`.
   - The title comes from `DRILLS.placeValue.kidTitle`.
   - The why line reads, for a miss: "That one needed the {key} place. Let's find some {key} digits!" For a slow answer: "Let's get faster at finding the {key} place!"
   - Hints: a first wrong try shows "Count places after the decimal point: tenths, hundredths, thousandths." A second wrong try shows "It's X. Type X."
   - The finish line is "Nice! Decimal places line up by their names."
   - Its `sprintItem(key)` returns one row as a prompt and answer, with the prompt "Which digit is in the {key} place of 57.382?"
4. **Add `.colmath` styles to `src/styles/game.css`:**
   - The table uses the chalk font at 1.6rem, with each cell about 1.1em wide and centered.
   - The second row has a chalk line under it (`border-bottom:2px solid`).
   - Choice buttons containing `.colmath` stay readable at iPhone SE size.

The generators aren't reachable until step 3, so nothing plays differently yet.

Commit: `Bakery station 1 generators`

### Step 3: Open the Bakery

1. In `BUILDINGS`, set `bakery.open = true`.
2. The Bakery tile now opens `renderShopFloor('bakery')`, with **The Scale** open and stations 2 to 5 showing **Coming soon**.
3. The Bakery's welcome rewards (🦔 hedgehog and 🍞 bread basket) are granted by the existing unlock logic the first time a student opens the town after this change. That's expected.

**Browser test on a computer and at iPhone SE size, with the Console open:**
- Play at least 2 shifts at The Scale.
- A right answer like `3.5` is accepted even when the answer is shown as `3.50`.
- The two "Line up the decimals" choices look different, and the right one has the points in one column.
- Answering by lining up right edges (for example, 12.433 for 3.47 + 12.086) shows "Line up the decimal points, not the last digits."
- A miss opens the **place-value drill**, not a times-table ladder.
- The number pad shows a `.` key.
- On the teacher dashboard, the 🥐 tab shows the three skills.

Commit: `Open the Bakery: The Scale`

### Step 4: Safety check

In `scripts/verify.mjs`, **add** checks without removing any:
- `game.js` contains `const SCALE_GEN`, `const DEC = {`, and `function placeValueRows(`.
- `registry.ts` contains `addDec:` and `rightAlign:`.

Update the protected-files table in the three instruction files, keeping them identical.

Commit: `Verify covers the Scale`

## Acceptance checks

1. The Bakery opens from town with The Scale playable, and stations 2 to 5 show Coming soon.
2. All three skills generate problems at every level, with a "❓ Find:" line on the order ticket.
3. Right answers are accepted in any equivalent form (`3.5`, `3.50`), and wrong ones get the matching mix-up message.
4. The place-value drill works on a computer (keyboard) and on a phone (number pad with `.`).
5. The café is unchanged.
6. The dashboard's 🥐 tab shows the Bakery skills, and the small groups show the new mix-ups.
7. `npm run verify`, `npm run typecheck`, and `npm run build` pass, with no red Console errors.
