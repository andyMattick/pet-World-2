# Bakery station 5: Bulk Orders (divide decimals)

**Status: built.** The generators are `BULK_GEN` in `src/game/game.js` (stress-tested: 180,000 problems, every quotient checked against an independent exact calculation and ending within 3 decimal places, every mix-up checked to fire on its own wrong answer and never on the right one). They use the long-division layout from `BAKERY-4-REGISTER.md`, with the decimal point drawn straight up from the dividend's point. Read `AGENTS.md` and `docs/BAKERY.md` first. **Edit in place, never rewrite a file.**

## Khan skills (Khan's order)

| Id | Khan skill | Example |
|---|---|---|
| `divToDec` | Divide whole numbers to get a decimal | 7 kg of dough into 4 equal batches: 7 ÷ 4 = 1.75 |
| `divDec2` | Dividing decimals: hundredths | 3.25 ÷ 0.05 = 65 |
| `divDec3` | Dividing decimals: thousandths | 0.378 ÷ 0.9 = 0.42 |

Khan links are in `BAKERY.md`.

## What students get

- **Stories:** splitting bulk ingredients into equal batches, and "how many 0.05 kg bags can we fill?"
- **Steps (on the long-division layout from station 4):**
  1. *Idea (decimal divisors):* move the decimal point in both numbers until the divisor is whole (3.25 ÷ 0.05 → 325 ÷ 5). Shown as a choice at level 1, typed at level 2+.
  2. *Idea:* where the point goes in the quotient (straight up from the dividend).
  3. *Arithmetic:* the long-division digits, as in station 4.
  4. *Arithmetic (`divToDec`):* "write a 0 and keep going" when there's a remainder, until it divides evenly (answers end within 3 decimal places).
- **Levels:** level 1 is whole ÷ whole ending in tenths or hundredths. Level 2 has hundredths divisors. Level 3 has thousandths and zeros in the quotient.

## Mix-ups to catch

| Id | Mix-up | Caught when | Kid message | Teacher tip |
|---|---|---|---|---|
| `remainderNotDecimal` | Stops with a remainder instead of continuing | 7 ÷ 4 answered as 1 R3 or 1.3 | "Put a point and a 0 after 7, and keep dividing." | Show 7 as 7.00 before starting. |
| `shiftOneOnly` | Moves the point in the divisor but not the dividend | 3.25 ÷ 0.05 answered as 0.65 | "Whatever you do to the divisor, do to the dividend." | Write both as a fraction, then multiply top and bottom by 100. |
| `pointMisplaced` | Puts the quotient's point in the wrong place | 0.378 ÷ 0.9 answered as 4.2 or 0.042 | "Line the point up straight above the dividend's point." | Estimate: 0.4 ÷ 1 is about 0.4. |
| `missingZero` | Leaves out a zero in the quotient | (from station 4) | (from station 4) | (from station 4) |

## Drills

- **Moving the decimal** (`decimalShift`): after `shiftOneOnly` or `pointMisplaced`.

## Rewards and the unit test

- There's no station 5 reward (see `REWARDS.md`).
- **When this station is built, every Bakery station has skills**, so the 🏆 Bakery Unit Test appears (16 questions, 1 per skill). Passing it opens the Market Stall once that's built, gives the Bakery Master stamp, and unlocks the legendary 🦝 raccoon and 🏅 gold medal.
- Before building, check the unit test's question plan with 16 skills at iPhone SE size.

## Generator code (stress-tested)

Pasted into `src/game/game.js` after `REGISTER_GEN`, then `Object.assign(GEN, BULK_GEN);`.

**What the test run found (20,000 problems per skill and level):**

| Skill | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| `divToDec` | 32 ÷ 5 = 6.4 (divisors 2, 4, 5; up to hundredths), 6 to 9 steps | divisors 4 to 25, up to thousandths | divisors 8 to 80, hundredths or thousandths |
| `divDec2` | 0.68 ÷ 0.02 (choice to move the point), whole answers | typed point move, 0.dd divisors | tenths and hundredths answers, zeros in about two thirds |
| `divDec3` | 1.518 ÷ 3 (no point move) | 0.126 ÷ 0.3 | hundredths and thousandths divisors, zeros in about half |

- No order runs past 12 steps (10 on level 1), and every layout fits an iPhone SE.
- The first step for a decimal divisor moves both points (a choice on level 1, typed on levels 2 and 3). "Keep dividing" appears when zeros have to be added.
- A leading "0 fits into 0" (like 0.36 ÷ 4) is filled in for the student. A zero in the ones place (1.518 ÷ 3) is a real step.
- The last step is **Place the point**, and it's a real step in practice (not skipped like station 4's answer step). Quizzes ask only this step.

```js
/* ===== Bakery station 5: Bulk Orders (divide decimals) =====
   Exact math: every number is a whole number plus a count of decimal places (XD), and the long division runs on
   whole-number digits with the decimal point drawn straight up from the dividend. */
/* long division of a decimal dividend by a whole number; s = the dividend's digits (zeros already added), pt = digits before the point */
function longDivisionDec(s, d, pt){
  let k = 1, cur = Number(s[0]);
  while (cur < d && k < pt) { cur = cur * 10 + Number(s[k]); k++; }   // never pass the ones digit, so the point always has a digit above it
  const work = [];
  let col = k - 1;
  for (;;){
    const qd = Math.floor(cur / d), m = qd * d, r = cur - m;
    work.push({col, cur, qd, mul:m, sub:r, auto: col === 0 && cur === 0});   // "how many 4s in 0" is filled in for the student
    if (col + 1 >= s.length) break;
    col++; cur = r * 10 + Number(s[col]);
  }
  const qi = Number(s) / d;                                // exact: s is a multiple of d by construction
  return {N:s, d, pt, work, q:work.map(w => w.qd), startCol:k - 1, quotient:qi, rem:Number(s) % d, places:s.length - pt};
}
/* the dividend written with p decimal places (7 → "700", pt 1, for 7.00) */
function decDigits(x, p){ const {i, p:xp} = XD.parse(x); const whole = String(i * Math.pow(10, p - xp)).padStart(p + 1, '0'); return {s:whole, pt:whole.length - p}; }
function bulkSteps(a, b, lvl, skill){
  const B = XD.parse(b), m = B.p, bw = B.i;                // move the point m places: b becomes the whole number bw
  const A = XD.parse(a), aMoved = XD.fmt(A.i * (A.p >= m ? 1 : Math.pow(10, m - A.p)), Math.max(0, A.p - m));
  const Ai = XD.parse(aMoved);
  let P = Ai.p; while ((Ai.i * Math.pow(10, P - Ai.p)) % bw !== 0) P++;   // quotient places: keep adding zeros until it divides evenly
  const {s, pt} = decDigits(aMoved, P), D = longDivisionDec(s, bw, pt);
  const qI = Ai.i * Math.pow(10, P - Ai.p) / bw, ans = XD.fmt(qI, P), right = XD.eq(qI, P);
  const steps = [];
  if (m > 0) {
    const opts = shuffle([{html:`${aMoved} ÷ ${bw}`, text:`${aMoved} ÷ ${bw}`, ok:true, mis:null},
      {html:`${a} ÷ ${bw}`, text:`${a} ÷ ${bw}`, ok:false, mis:'shiftOneOnly'},
      {html:`${XD.fmt(A.i, Math.max(0, A.p - m + 1))} ÷ ${bw}`, text:`moved ${m - 1 || 'no'} place${m - 1 === 1 ? '' : 's'}`, ok:false, mis:'pointMisplaced'}]
      .filter((o, k, arr) => arr.findIndex(x => x.html === o.html) === k));
    steps.push(lvl === 1
      ? {name:'Make the divisor whole', type:'concept', kind:'choice', prompt:`Move the decimal point so ${b} becomes a whole number. Which problem is the same as ${a} ÷ ${b}?`, options:opts,
          drill:{type:'decimalShift', key:String(Math.pow(10, m))}, hint:() => `${b} × ${Math.pow(10, m)} = ${bw}. Do the same to ${a}.`}
      : {name:'Make the divisor whole', type:'concept', kind:'num', prompt:`Move both points ${m} place${m === 1 ? '' : 's'} to the right: ${a} ÷ ${b} = ? ÷ ${bw}`,
          answer:aMoved, eq:XD.eq(Ai.i, Ai.p), decimal:true, drill:{type:'decimalShift', key:String(Math.pow(10, m))},
          mis:v => { if (typeof v !== 'number' || XD.eq(Ai.i, Ai.p)(v)) return null;
            if (XD.eq(A.i, A.p)(v)) return 'shiftOneOnly';
            if (XD.eq(Ai.i, Ai.p + 1)(v) || XD.eq(Ai.i, Ai.p - 1)(v)) return 'pointMisplaced';
            return null; },
          hint:() => `${b} × ${Math.pow(10, m)} = ${bw}. Now multiply ${a} by ${Math.pow(10, m)} too.`});
  }
  if (P > Ai.p) steps.push({name:'Keep dividing', type:'concept', kind:'choice',
    prompt:`${bw} doesn't go into ${aMoved} evenly. What do we do?`,
    options:shuffle([{html:`Write ${aMoved} as ${s.slice(0, pt)}.${s.slice(pt)} and keep dividing`, text:'add zeros and keep dividing', ok:true, mis:null},
      {html:'Stop and write the remainder', text:'stop with a remainder', ok:false, mis:'remainderNotDecimal'}]),
    hint:() => 'A decimal can have zeros added at the end without changing its value: 7 = 7.0 = 7.00.'});
  const digits = divSteps(D, lvl);
  digits.pop();                                            // station 4's final answer step is replaced by placing the point
  digits.forEach(st => { if (st.kind === 'ldiv' && D.work[st.cell.step].auto) st.skipAuto = true; });
  steps.push(...digits.filter(st => !st.skipAuto));
  const stopped = Math.floor(Ai.i / bw), rem = Ai.i % bw;   // stopping early: 7 ÷ 4 = 1 R3, often written 1.3
  const flat = Number(String(qI).replace(/0/g, '') || '0');
  steps.push({name:'Place the point', type:'concept', kind:'num', prompt:`${a} ÷ ${b} = ?`, answer:ans, eq:right, decimal:true,
    drill:{type:'decimalShift', key:'10'},
    mis:v => { if (typeof v !== 'number' || right(v)) return null;
      if (m > 0 && Math.abs(v * bw - A.i / Math.pow(10, A.p)) < 1e-9) return 'shiftOneOnly';   // divided the unmoved dividend by the whole divisor
      if (XD.eq(qI, P + 1)(v) || XD.eq(qI, P - 1)(v) || XD.eq(qI, P + 2)(v) || (P >= 2 && XD.eq(qI, P - 2)(v))) return 'pointMisplaced';
      if (P > Ai.p && rem && (XD.eq(stopped, Ai.p)(v) || (Ai.p === 0 && (XD.eq(stopped * 10 + rem, 1)(v) || XD.eq(stopped * 100 + rem, 2)(v))))) return 'remainderNotDecimal';
      if (flat !== qI && (XD.eq(flat, P)(v) || XD.eq(flat, P - 1)(v))) return 'missingZero';
      return null; },
    hint:() => 'The point in the answer goes straight up from the point in the dividend.'});
  return {steps, D, ans, P, aMoved, bw, m};
}
const BULK_ITEMS = [['🌾', 'flour'], ['🍬', 'sugar'], ['🧈', 'butter'], ['🍫', 'chocolate chips'], ['🥜', 'nuts'], ['🍓', 'berries']];
/* a decimal string that is exactly q × b, from whole-number parts */
const xdMul = (x, y) => { const X = XD.parse(x), Y = XD.parse(y); return XD.fmt(X.i * Y.i, X.p + Y.p); };
function bulkFits(a, b, lvl){
  const r = bulkSteps(a, b, lvl);
  return r.D.N.length + String(r.bw).length <= 7 && r.P <= 3 && r.steps.length <= (lvl === 1 ? 10 : 12) ? r : null;   // fits an iPhone SE, and no order runs past 12 steps
}
const BULK_GEN = {
  divToDec(lvl){
    let a, b, r;
    for (let t = 0; t < 400; t++){
      const d = lvl === 1 ? pick([2, 4, 5]) : lvl === 2 ? pick([4, 5, 8, 20, 25]) : pick([8, 16, 20, 25, 40, 50, 80]);
      const N = lvl === 1 ? rand(3, 49) : rand(10, lvl === 2 ? 199 : 399);
      if (N % d === 0) continue;
      a = String(N); b = String(d); r = bulkFits(a, b, lvl);
      if (!r) continue;
      if (lvl === 1 && r.P > 2) continue;
      if (lvl === 3 && r.P < 2) continue;
      break;
    }
    const [e, item] = pick(BULK_ITEMS);
    return {title:'Bulk Orders', ctx:`${a} ÷ ${b}`,
      bubble:`We have ${a} kg of ${item} to split into ${b} equal batches. How many kilograms go in each batch?`,
      helper:'When it doesn\'t divide evenly, add a point and zeros and keep going.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${a} kg ÷ ${b}</div>`,
      steps:r.steps, answerSteps:[r.steps.length - 1]};
  },
  divDec2(lvl){ return bulkDecimal('divDec2', lvl); },
  divDec3(lvl){ return bulkDecimal('divDec3', lvl); }
};
function bulkDecimal(skill, lvl){
  let a, b, r;
  for (let t = 0; t < 3000; t++){
    r = null;
    if (skill === 'divDec2') {
      b = lvl === 1 ? `0.0${rand(2, 9)}` : lvl === 2 ? `0.${rand(1, 9)}${rand(1, 9)}` : pick([`0.${rand(1, 9)}${rand(1, 9)}`, `${rand(1, 4)}.${rand(0, 9)}${rand(1, 9)}`]);
      const q = lvl === 1 ? String(rand(3, 99)) : lvl === 2 ? pick([String(rand(2, 60)), `${rand(1, 20)}.${rand(1, 9)}`]) : pick([`${rand(1, 20)}.${rand(1, 9)}`, `${rand(1, 9)}.0${rand(1, 9)}`, `${rand(1, 9)}0.${rand(1, 9)}`, `${rand(1, 9)}.${rand(1, 9)}${rand(1, 9)}`]);
      a = xdMul(q, b);
      if (XD.parse(a).p > 2) continue;                                        // hundredths in the problem
    } else {
      b = lvl === 1 ? String(rand(2, 9)) : lvl === 2 ? `0.${rand(2, 9)}` : pick([`0.0${rand(2, 9)}`, `0.${rand(1, 9)}${rand(1, 9)}`, `0.00${rand(2, 9)}`]);
      const q = lvl === 1 ? `0.${rand(0, 9)}${rand(0, 9)}${rand(1, 9)}` : lvl === 2 ? `0.${rand(1, 9)}${rand(1, 9)}` : pick([`${rand(0, 9)}.${rand(0, 9)}${rand(1, 9)}`, `${rand(1, 30)}.0${rand(1, 9)}`]);
      a = xdMul(q, b);
      if (lvl < 3 ? XD.parse(a).p !== 3 : XD.parse(a).p < 2 || XD.parse(a).p > 3) continue;   // thousandths in the problem
    }
    if (Number(a) < 0.1 || /^0\.00/.test(a)) continue;
    r = bulkFits(a, b, lvl);
    if (!r) continue;
    if (skill === 'divDec2' && XD.parse(a).p > 2) continue;                 // hundredths
    if (lvl === 3 && !r.D.q.slice(1).includes(0) && Math.random() < 0.5) continue;   // lean toward zeros in the quotient
    break;
  }
  if (!r) { [a, b] = skill === 'divDec2' ? ['3.25', '0.05'] : ['0.378', '0.9']; r = bulkSteps(a, b, lvl); }   // never reached in testing
  const [e, item] = pick(BULK_ITEMS), whole = !b.includes('.');
  return {title:'Bulk Orders', ctx:`${a} ÷ ${b}`,
    bubble: whole ? `We have ${a} kg of ${item} to share equally among ${b} batches. How many kilograms go in each?`
                  : `We have ${a} kg of ${item}. Each bag holds ${b} kg. How many bags can we fill?`,
    helper: whole ? 'Divide as usual, and put the point straight up from the dividend\'s point.' : 'Make the divisor a whole number first: move both points the same number of places.',
    visual:`<div style="text-align:center; font-size:1.6rem">${e} ${a} ÷ ${b}</div>`,
    steps:r.steps, answerSteps:[r.steps.length - 1]};
}
```

## Build steps (one commit each)

1. **Registry:** 3 skills, the new mix-ups, station 5's `skills` in the **same commit**, `UNIT_SKILLS.bakery`.
2. **Generators:** paste the tested code.
3. **Unit test check:** play the Bakery Unit Test end to end (all 16 skills), and check the Bakery Master stamp and the "Market Stall" message.
4. **Verify:** checks for the generators; update the three instruction files and move the Bakery to Done on the roadmap.

## Acceptance checks

1. Every quotient matches an independent calculation using exact math, and ends within 3 decimal places.
2. Each mix-up fires only on its wrong answer.
3. The Bakery Unit Test appears only after all 5 station quizzes, and passing it gives the stamp and legendary items.
