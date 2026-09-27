# Bakery station 4: The Register (multiply decimals, long division)

**Status: built.** The generators are `REGISTER_GEN` in `src/game/game.js` (stress-tested: 240,000 problems, every product and quotient checked against an independent whole-number calculation, every mix-up checked to fire on its own wrong answer and never on the right one). The layouts are `mulRowsHTML` and `ldivHTML`, checked at iPhone SE size. Read `AGENTS.md` and `docs/BAKERY.md` first. **Edit in place, never rewrite a file.**

## Khan skills (Khan's order)

| Id | Khan skill | Example |
|---|---|---|
| `mulDecPlace` | Decimal multiplication place value | 0.3 × 0.02 = 0.006, given 3 × 2 = 6 |
| `mulDec` | Multiplying decimals (standard algorithm) | 2.4 kg of flour at $1.35 a kilogram |
| `div2` | Division by 2 digits | 336 cookies in boxes of 12 |
| `divMulti` | Multi-digit division | 8,256 ÷ 24 |

Khan links are in `BAKERY.md`.

## What students get

- **Stories:** ringing up orders at the register (price × weight), and packing big batches into boxes (division).
- **Multiplying decimals, steps:**
  1. *Arithmetic:* multiply as whole numbers (24 × 135 = 3240). The times-table facts inside are drill triggers.
     - **Short problems** (the bottom number has one digit): one answer box per column, filled right to left, with optional carry boxes on top, like the Scale.
     - **Longer problems** (the bottom number has two or more digits) split into rows, laid out under the problem:
       - *Row 1:* 135 × 4 = 540, with optional carry boxes.
       - *Row 2:* 135 × 2 tens = 2700, with the placeholder zero already shown. A wrong row 2 of 270 is `partialShift`, caught at that row.
       - *Add the rows:* 540 + 2700 = 3240, with optional carry boxes.
       - The rows are **required steps on levels 1 and 2**. On **level 3 they're optional**: the student can type the whole product straight into the final row, and the rows count as done.
  2. *Idea:* count the decimal places (1 + 2 = 3).
  3. *Arithmetic:* place the point (3.240, and 3.24 is accepted).
  4. *Idea (level 2+):* check with an estimate ("about 2 × 1 = 2, so 3.24 makes sense").
  - `mulDecPlace` problems are mostly steps 2 and 3, using a given whole-number fact.
- **Long division, steps:** a new **long-division layout**, one quotient digit at a time:
  1. *Idea:* estimate the digit ("How many 12s in 33?" → 2).
  2. *Arithmetic:* multiply (2 × 12 = 24). On levels 2 and 3, optional carry boxes sit above the multiply row (for 7 × 24, carry the 2).
  3. *Arithmetic:* subtract (33 − 24 = 9). On levels 2 and 3, optional borrow boxes, like the Scale's subtracting. Level 1 keeps the plain layout.
  4. *Arithmetic:* bring down and repeat.
  - Level 1 has 3-digit dividends with no zero digit in the quotient. Level 3 has 4-digit dividends and zeros in the quotient.
  - Remainders: level 1 to 2 divide evenly. Level 3 can have remainders, answered as "R" boxes.

## New input: the long-division layout

- A "bus stop" layout drawn in the board's chalk style, with the quotient row filling in digit by digit, and each multiply/subtract row appearing under the dividend.
- Each digit step is an ordinary number step pointing at a slot in the layout (like the café's ratio tables), so hints, mix-ups, and logging work unchanged.
- Quiz answer-only mode asks only for the final quotient (and remainder).

## Carry boxes, rows, and quizzes

- **Carry and borrow boxes are always optional** and never checked or logged. They're scratch space, exactly like the Scale's.
- **Quizzes and Unit Tests** show only the final answer box: no multiplication rows, no long-division steps, and no carry or borrow boxes (the same as the Scale in quizzes).
- Reuse the Scale's column answer boxes (`digitBoxesHTML`) for every row, so filling right to left, "check the tens column" messages, and the keyboard all work the same way.
- Must fit an iPhone SE screen for 4-digit ÷ 2-digit problems.

## Mix-ups to catch

| Id | Mix-up | Caught when | Kid message | Teacher tip |
|---|---|---|---|---|
| `pointLikeAdding` | Lines up decimal points and keeps one point, like adding | 2.4 × 1.35 answered as 32.40 | "When multiplying, count all the decimal places." | Estimate first: 2 × 1 is about 2, so 32 can't be right. |
| `placesMiscount` | Counts decimal places wrong (off by one) | 0.3 × 0.02 answered as 0.06 or 0.0006 | "Count the digits after each point and add them." | Cover the points, multiply, then count places together. |
| `partialShift` | Forgets to shift the second partial product | 24 × 135 answered as 216 (120 + 72 + 24, with no place shifts) | "The tens row starts one place to the left." | Write the placeholder zero in the tens row. |
| `quotientTooSmall` | Picks a quotient digit that's too small, remainder ≥ divisor | 33 ÷ 12 digit 1, remainder 21 | "Your remainder is bigger than 12. Another 12 fits." | Compare each remainder with the divisor before moving on. |
| `quotientTooBig` | Picks a quotient digit that's too big | 33 ÷ 12 digit 3 (36 > 33) | "3 × 12 is more than 33. Try one less." | Estimate with rounded divisors (12 → 10). |
| `missingZero` | Leaves out a zero in the quotient | 8,160 ÷ 8 answered as 12 or 102 | "When a divisor doesn't fit, write a 0 before bringing down." | Use a place-value chart for the quotient. |

## Drills

- **Moving the decimal** (`decimalShift`, already registered): after `pointLikeAdding` or `placesMiscount`. Rows like "4.2 × 10", "35 ÷ 100".
- **Times tables** (existing): after multiplication fact slips inside steps.

## Rewards

Unchanged: the station 4 Bakery rewards in `REWARDS.md`.

## Generator code (stress-tested)

Pasted into `src/game/game.js` after `BOXES_GEN`, then `Object.assign(GEN, REGISTER_GEN);`. It uses the existing `rand`, `pick`, and `shuffle`.

**What the test run found (20,000 problems per skill and level):**

| Skill | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| `mulDecPlace` | 2 steps, up to 2 places (0.9 × 0.4) | 2 steps, 2 to 3 places | 2 steps, 3 to 4 places (0.43 × 1.2) |
| `mulDec` | 3 steps, one row ($2.45 × 3, 0.6 of 7.5 kg) | 6 steps: estimate, 2 rows, add, count, point | same, rows optional; prices up to $19.99 |
| `div2` | 3-digit ÷ 2-digit, one-digit quotient, 3 steps | 2-digit quotient, 6 steps | remainders in half, zeros in 9% |
| `divMulti` | 4-digit ÷ 2-digit, 3-digit quotient, 9 steps | zeros in the quotient in about a third | remainders in half, zeros in about a third |

(Step counts leave out the final answer step, which practice skips and quizzes use.)

**New step kinds the layout build (step 1) has to draw:**
- `mulrow`: the multiplication layout `st.mul` (`top`, `bot`, `A`, `B`, `rows`, `sum`), with answer boxes under row `st.row` (a number, or `'sum'` for the add step). Rows already done show filled in. Optional carry boxes on every row.
- `ldiv`: the bus-stop layout `st.div` (`N`, `d`, `work` rows with `col`, `cur`, `qd`, `mul`, `sub`), with the answer going into `st.cell` (`{step, part:'q'|'mul'|'sub'}`; named `cell`, not `slot`, because `slot` already means a board slot). `st.boxes` is true on levels 2 and 3, for the optional carry and borrow boxes. Bring-down digits appear by themselves after each subtract.
- `qr`: two boxes, quotient and remainder, read as `[q, r]`. Only in quizzes (practice skips the final answer step).
- `decimal:true` on a `num` step turns on the number pad's decimal key.

**New mix-ups for `MIS`** (text in the table above): `pointLikeAdding`, `placesMiscount`, `partialShift` (skills `mulDecPlace`, `mulDec`), and `quotientTooSmall`, `quotientTooBig`, `missingZero` (skills `div2`, `divMulti`). Add `mulDec` to the skills of the existing `estimateOff`.

```js
/* ===== Bakery station 4: The Register (multiply decimals, long division) =====
   Exact math only: decimals are kept as a whole number plus a count of decimal places (2.4 is {i:24, p:1}),
   so no answer ever depends on floating-point rounding. */
const XD = {
  parse: s => { const [w, f = ''] = String(s).split('.'); return {i:Number(w + f), p:f.length}; },
  fmt: (i, p) => { if (!p) return String(i); const s = String(i).padStart(p + 1, '0'), w = s.slice(0, -p), f = s.slice(-p).replace(/0+$/, ''); return w + (f ? '.' + f : ''); },
  eq: (i, p) => v => typeof v === 'number' && isFinite(v) && Math.abs(v * Math.pow(10, p) - i) < 1e-6
};
const DEC_PLACES = s => (String(s).split('.')[1] || '').length;
const noZeroDigits = n => !String(n).includes('0');
/* a decimal with w whole-number digits (value range) and p places, ending in a non-zero digit */
function regDec(minW, maxW, p){
  const w = rand(minW, maxW); if (!p) return String(w);
  let f = ''; for (let k = 0; k < p; k++) f += k === p - 1 ? rand(1, 9) : rand(0, 9);
  return `${w}.${f}`;
}
/* the whole-number layout: top × bottom, one row per bottom digit (right to left), then the sum */
function mulLayout(a, b){
  let A = XD.parse(a), B = XD.parse(b);
  let top = a, bot = b;
  if (String(B.i).length > String(A.i).length) { [A, B] = [B, A]; [top, bot] = [b, a]; }   // the longer number goes on top
  const bd = [...String(B.i)].reverse().map(Number);
  const rows = bd.map((dg, r) => A.i * dg * Math.pow(10, r));
  const flat = bd.map(dg => A.i * dg);                     // the same rows without the place shift (the partialShift mix-up)
  return {top, bot, A:A.i, B:B.i, rows, flat, sum:A.i * B.i, places:A.p + B.p, maxPlaces:Math.max(A.p, B.p),
    width:Math.max(String(A.i * B.i).length, String(A.i).length + 1, ...rows.map(r => String(r).length)) + 1};
}
function mulSteps(L, lvl, withEstimate, a, b){
  const steps = [], AB = L.sum, n = L.places, multi = L.rows.length > 1;
  const skip = lvl >= 3 && multi ? (v => v === AB) : undefined;   // level 3: typing the whole product skips the rows
  if (withEstimate && lvl >= 2) {
    const ra = Math.max(1, Math.round(XD.parse(a).i / Math.pow(10, XD.parse(a).p))), rb = Math.max(1, Math.round(XD.parse(b).i / Math.pow(10, XD.parse(b).p))), est = ra * rb;
    steps.push({name:'Estimate', type:'concept', kind:'choice', prompt:'About how much will the answer be? Round each number to the nearest whole number first.',
      options:shuffle([{html:`about ${est}`, text:`about ${est}`, ok:true, mis:null},
        {html:`about ${est * 10}`, text:`about ${est * 10}`, ok:false, mis:'estimateOff'},
        {html:`about ${XD.fmt(est, 1)}`, text:`about ${XD.fmt(est, 1)}`, ok:false, mis:'estimateOff'}]),
      hint:() => `${a} is about ${ra}, and ${b} is about ${rb}. ${ra} × ${rb} = ${est}.`});
  }
  const bd = [...String(L.B)].reverse().map(Number), topMax = Math.max(...String(L.A).split('').map(Number));
  if (!multi) {
    steps.push({name:'Multiply', type:'compute', kind:'mulrow', mul:L, row:0, prompt:`Multiply as whole numbers: ${L.A} × ${L.B} = ?`,
      answer:AB, eq:v => v === AB, fact:{x:bd[0], y:topMax}, slowOK:true,
      hint:() => `Multiply each digit of ${L.A} by ${L.B}, starting on the right. Carry when a column makes 10 or more.`});
  } else {
    L.rows.forEach((rv, r) => steps.push({name:`Row ${r + 1}`, type:'compute', kind:'mulrow', mul:L, row:r,
      prompt: r === 0 ? `Row 1: ${L.A} × ${bd[0]} = ?${skip ? ' (Or type the whole product in the last row.)' : ''}` : `Row ${r + 1}: ${L.A} × ${bd[r]} ${r === 1 ? 'tens' : 'hundreds'} = ?`,
      answer:rv, eq: r === 0 && skip ? (v => v === rv || v === AB) : (v => v === rv), skipIf: r > 0 ? skip : undefined,
      fact:{x:bd[r], y:topMax}, slowOK:true,
      mis:v => (r > 0 && v === L.flat[r] && v !== rv) ? 'partialShift' : null,
      hint:() => r === 0 ? `Multiply each digit of ${L.A} by ${bd[0]}, starting on the right.` : `This row is for the ${r === 1 ? 'tens' : 'hundreds'} digit, so it starts with ${r === 1 ? 'a zero' : 'two zeros'} on the right. Then multiply ${L.A} by ${bd[r]}.`}));
    const flatSum = L.flat.reduce((s, x) => s + x, 0);
    steps.push({name:'Add the rows', type:'compute', kind:'mulrow', mul:L, row:'sum', prompt:`Add the rows: ${L.rows.join(' + ')} = ?`,
      answer:AB, eq:v => v === AB, skipIf:skip, slowOK:true,
      mis:v => (v === flatSum && v !== AB) ? 'partialShift' : null,
      hint:() => 'Add each column from the right, and carry when a column makes 10 or more.'});
  }
  steps.push({name:'Count the decimal places', type:'concept', kind:'num', prompt:`How many digits are after the decimal points in ${L.top} and ${L.bot} altogether?`,
    answer:n, eq:v => v === n, drill:{type:'decimalShift', key:String(Math.pow(10, Math.min(3, Math.max(1, n))))},
    mis:v => (v === L.maxPlaces && v !== n) ? 'pointLikeAdding' : null,
    hint:() => `${L.top} has ${XD.parse(L.top).p}, and ${L.bot} has ${XD.parse(L.bot).p}. Add them.`});
  const ans = XD.fmt(AB, n);
  steps.push({name:'Place the point', type:'compute', kind:'num', prompt:`${a} × ${b} = ?`, answer:ans, eq:XD.eq(AB, n), decimal:true,
    drill:{type:'decimalShift', key:String(Math.pow(10, Math.min(3, Math.max(1, n))))},
    mis:v => { if (typeof v !== 'number') return null; const right = XD.eq(AB, n);
      if (right(v)) return null;
      if (XD.eq(AB, L.maxPlaces)(v)) return 'pointLikeAdding';
      if (XD.eq(AB, n - 1)(v) || XD.eq(AB, n + 1)(v)) return 'placesMiscount';
      const flatSum = L.flat.reduce((s, x) => s + x, 0);
      if (multi && flatSum !== AB && XD.eq(flatSum, n)(v)) return 'partialShift';
      return null; },
    hint:() => `Start from ${AB} and count ${n} place${n === 1 ? '' : 's'} in from the right.`});
  return steps;
}
/* long division, one quotient digit at a time; returns the layout and the steps */
function longDivision(N, d){
  const s = String(N); let k = 1, cur = Number(s.slice(0, 1));
  while (cur < d && k < s.length) { cur = cur * 10 + Number(s[k]); k++; }
  const work = [], q = [];
  let col = k - 1;                                          // the dividend column the current number ends under
  for (;;){
    const qd = Math.floor(cur / d), m = qd * d, r = cur - m;
    q.push(qd); work.push({col, cur, qd, mul:m, sub:r});
    if (col + 1 >= s.length) break;
    col++; cur = r * 10 + Number(s[col]);
  }
  return {N:s, d, q, startCol:k - 1, work, quotient:Math.floor(N / d), rem:N % d};
}
function divSteps(D, lvl){
  const steps = [], d = D.d, boxes = lvl >= 2;             // levels 2 and 3 get the optional carry and borrow boxes
  D.work.forEach((w, i) => {
    steps.push({name:`Digit ${i + 1}`, type:'concept', kind:'ldiv', div:D, cell:{step:i, part:'q'}, boxes,
      prompt: w.cur < d ? `How many ${d}s fit in ${w.cur}?` : `How many ${d}s fit in ${w.cur}? Write the digit on top.`,
      answer:w.qd, eq:v => v === w.qd,
      mis:v => { if (typeof v !== 'number' || v === w.qd) return null;
        if (w.qd === 0 && v > 0) return 'missingZero';
        if (v > w.qd) return 'quotientTooBig';
        if (v < w.qd && w.cur - v * d >= d) return 'quotientTooSmall';
        return null; },
      hint:() => w.cur < d ? `${w.cur} is less than ${d}, so no ${d}s fit. Write 0.` : `Round ${d} to ${Math.round(d / 10) * 10}. About how many of those fit in ${w.cur}? Then check: that many ${d}s can't be more than ${w.cur}.`});
    if (w.qd === 0) return;                                 // a zero digit needs no multiply or subtract row
    steps.push({name:'Multiply', type:'compute', kind:'ldiv', div:D, cell:{step:i, part:'mul'}, boxes,
      prompt:`${w.qd} × ${d} = ?`, answer:w.mul, eq:v => v === w.mul, fact: d <= 12 ? {x:w.qd, y:d} : {x:w.qd, y:d % 10 || 10},
      hint:() => `${w.qd} × ${d}: multiply the ones, then the tens.`});
    steps.push({name:'Subtract', type:'compute', kind:'ldiv', div:D, cell:{step:i, part:'sub'}, boxes,
      prompt:`${w.cur} − ${w.mul} = ?`, answer:w.sub, eq:v => v === w.sub,
      hint:() => `Subtract from the right. If the answer is ${d} or more, the digit on top was too small.`});
  });
  const qz = D.quotient, r = D.rem;
  const dropZeros = Number(String(qz).replace(/0/g, '') || '0');
  steps.push(r ? {name:'The answer', type:'compute', kind:'qr', prompt:`${D.N} ÷ ${d} = ? R ?`, answer:[qz, r], eq:v => Array.isArray(v) && v[0] === qz && v[1] === r,
      mis:v => Array.isArray(v) && v[0] === dropZeros && dropZeros !== qz ? 'missingZero' : null, skipIf:() => true,
      hint:() => 'The number on top is the answer. What was left at the end is the remainder.'}
    : {name:'The answer', type:'compute', kind:'num', prompt:`${D.N} ÷ ${d} = ?`, answer:qz, eq:v => v === qz,
      mis:v => v === dropZeros && dropZeros !== qz ? 'missingZero' : null, skipIf:() => true,
      hint:() => 'The number on top is the answer.'});
  return steps;
}
/* dividend and divisor for each level; quotient zeros and remainders only where the level allows them */
function divNumbers(skill, lvl){
  const cfg = skill === 'div2'
    ? [{d:[11, 25], q:[3, 9], nd:3, zero:false, rem:false}, {d:[12, 39], q:[11, 89], nd:[3, 4], zero:false, rem:false}, {d:[12, 59], q:[11, 99], nd:[3, 4], zero:true, rem:true}][lvl - 1]
    : [{d:[12, 39], q:[101, 399], nd:4, zero:false, rem:false}, {d:[12, 59], q:[101, 499], nd:4, zero:true, rem:false}, {d:[13, 99], q:[101, 899], nd:4, zero:true, rem:true}][lvl - 1];
  for (let t = 0; t < 400; t++){
    const d = rand(cfg.d[0], cfg.d[1]), qz = rand(cfg.q[0], cfg.q[1]);
    if (d % 10 === 0) continue;
    const r = cfg.rem && Math.random() < 0.5 ? rand(1, d - 1) : 0, N = qz * d + r, len = String(N).length;
    const nd = Array.isArray(cfg.nd) ? cfg.nd : [cfg.nd, cfg.nd];
    if (len < nd[0] || len > nd[1]) continue;
    const D = longDivision(N, d);
    if (!cfg.zero && D.q.includes(0)) continue;
    if (cfg.zero && lvl >= 2 && skill === 'divMulti' && !D.q.slice(1).includes(0) && Math.random() < 0.5) continue;   // lean toward zeros in the quotient
    return D;
  }
  return longDivision(skill === 'div2' ? 336 : 8256, skill === 'div2' ? 12 : 24);
}
const REG_ITEMS = [['🧀', 'cheese'], ['🍇', 'grapes'], ['🍫', 'chocolate'], ['🥜', 'nuts'], ['🍓', 'strawberries'], ['🧈', 'butter']];
const REG_TREATS = [['🍪', 'cookies'], ['🧁', 'cupcakes'], ['🥐', 'croissants'], ['🍩', 'donut holes'], ['🥨', 'pretzels'], ['🍬', 'candies']];
const REGISTER_GEN = {
  mulDecPlace(lvl){
    let x, y, pa, pb;
    for (let t = 0; t < 200; t++){
      x = lvl === 3 ? rand(11, 49) : lvl === 2 ? rand(11, 29) : rand(2, 9); y = lvl === 3 ? rand(11, 29) : rand(2, 9);
      if (x % 10 === 0 || y % 10 === 0) continue;
      [pa, pb] = [rand(0, lvl === 1 ? 1 : 2), rand(lvl === 1 ? 1 : 0, lvl === 3 ? 3 : 2)];
      const n = pa + pb; if (n < 1 || n > (lvl === 1 ? 2 : lvl === 2 ? 3 : 4) || (lvl >= 2 && n < 2)) continue;
      break;
    }
    const a = XD.fmt(x, pa), b = XD.fmt(y, pb), P = x * y, n = pa + pb, ans = XD.fmt(P, n), max = Math.max(pa, pb);
    return {title:'The Register', ctx:`${a} × ${b}, from ${x} × ${y}`,
      bubble:`You know ${x} × ${y} = ${P}. So what is ${a} × ${b}?`,
      helper:'The digits are the same. Only the decimal point moves.',
      visual:`<div style="text-align:center; font-size:1.6rem">${x} × ${y} = ${P}<br>${a} × ${b} = ?</div>`,
      steps:[
        {name:'Count the decimal places', type:'concept', kind:'num', prompt:`How many digits are after the decimal points in ${a} and ${b} altogether?`,
          answer:n, eq:v => v === n, drill:{type:'decimalShift', key:String(Math.pow(10, Math.min(3, Math.max(1, n))))}, mis:v => (v === max && v !== n) ? 'pointLikeAdding' : null,
          hint:() => `${a} has ${pa}, and ${b} has ${pb}. Add them.`},
        {name:'Place the point', type:'compute', kind:'num', prompt:`${a} × ${b} = ?`, answer:ans, eq:XD.eq(P, n), decimal:true, drill:{type:'decimalShift', key:String(Math.pow(10, Math.min(3, Math.max(1, n))))},
          mis:v => { if (typeof v !== 'number' || XD.eq(P, n)(v)) return null;
            if (max !== n && XD.eq(P, max)(v)) return 'pointLikeAdding';
            if (XD.eq(P, n - 1)(v) || XD.eq(P, n + 1)(v)) return 'placesMiscount';
            return null; },
          hint:() => `Start from ${P} and count ${n} place${n === 1 ? '' : 's'} in from the right. Write zeros in front if you run out of digits.`}]};
  },
  mulDec(lvl){
    let a, b, kind;
    for (let t = 0; t < 300; t++){
      kind = lvl === 1 ? pick(['count', 'count', 'part']) : 'price';
      if (kind === 'count') { a = Math.random() < 0.5 ? regDec(1, 9, 2) : regDec(1, 9, 1); b = String(rand(2, 9)); }   // $2.45 × 3 bags, or 1.5 kg × 4 trays
      else if (kind === 'part') { a = regDec(2, 9, 1); b = `0.${rand(2, 9)}`; }                                        // 0.6 of a 7.5 kg block
      else { a = regDec(lvl === 2 ? 1 : 2, lvl === 2 ? 9 : 19, 2); b = lvl === 3 && Math.random() < 0.5 ? `0.${rand(1, 9)}${rand(1, 9)}` : `${rand(1, 9)}.${rand(1, 9)}`; }
      const L = mulLayout(a, b);
      if (!noZeroDigits(L.B)) continue;                    // no zero digits on the bottom: every row has work in it
      if (L.width > 8) continue;                            // fits an iPhone SE
      if (lvl >= 2 && L.rows.length < 2) continue;
      break;
    }
    const L = mulLayout(a, b), [e, item] = pick(REG_ITEMS), [te, treat] = pick(REG_TREATS);
    const bubble = kind === 'count' ? (DEC_PLACES(a) === 2 ? `A box of ${treat} costs $${a}. I want ${b} boxes. How much is that?` : `One tray holds ${a} kg of ${item}. How many kilograms are on ${b} trays?`)
      : kind === 'part' ? `A block of ${item} weighs ${a} kg. I need ${b} of the block. How many kilograms is that?`
      : `${item[0].toUpperCase() + item.slice(1)} ${/s$/.test(item) ? 'cost' : 'costs'} $${a} a kilogram. I want ${b} kg. How much is that, before the register rounds to the nearest cent?`;
    return {title:'The Register', ctx:`${a} × ${b}`, bubble,
      helper:'Multiply as whole numbers, then count the decimal places.',
      visual:`<div style="text-align:center; font-size:1.6rem">${kind === 'count' && DEC_PLACES(a) === 2 ? te : e} ${a} × ${b}</div>`,
      steps:mulSteps(L, lvl, true, a, b)};
  },
  div2(lvl){ return registerDivision('div2', lvl); },
  divMulti(lvl){ return registerDivision('divMulti', lvl); }
};
function registerDivision(skill, lvl){
  const D = divNumbers(skill, lvl), [e, item] = pick(REG_TREATS), steps = divSteps(D, lvl);
  const bubble = D.rem ? `We made ${D.N} ${item}. Each box holds ${D.d}. How many full boxes, and how many are left over?`
                       : `We made ${D.N} ${item}. Each box holds ${D.d}. How many boxes do we fill?`;
  return {title:'The Register', ctx:`${D.N} ÷ ${D.d}${D.rem ? ' (remainder)' : ''}`, bubble,
    helper:'One digit at a time: how many fit, multiply, subtract, bring down.',
    visual:`<div style="text-align:center; font-size:1.6rem">${e} ${D.N} ÷ ${D.d}</div>`,
    steps, answerSteps:[steps.length - 1]};
}
```

## Build steps (one commit each)

1. **Long-division layout:** the layout and slot steps, tested with a throwaway problem at iPhone SE size.
2. **Registry:** 4 skills, the new mix-ups, station 4's `skills` in the **same commit**, `UNIT_SKILLS.bakery`, `decimalShift` sprint unlock at Bakery station 4.
3. **Generators:** paste the tested code above.
4. **Decimal-shift drill:** the `DRILL_IMPL` entry, same shape as `times`.
5. **Verify:** checks for the layout, generators, and drill; update the three instruction files.

## Acceptance checks

1. Every product and quotient matches an independent calculation, using exact whole-number math (no floating-point rounding).
2. The long-division layout fits at iPhone SE size for 4-digit ÷ 2-digit.
3. Each mix-up fires only on its wrong answer.
4. Quizzes ask only for the final answer, with no rows or carry boxes.
5. Carry and borrow boxes can be left empty or filled with anything, and the answer still checks the same way.
6. On level 3, typing the whole product straight into the final row skips the multiplication rows; on levels 1 and 2 the rows are required.
