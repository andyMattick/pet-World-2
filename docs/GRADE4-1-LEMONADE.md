# 4th grade, shop 1: the Lemonade Stand

**Status: built.** The generators are `LEMON_GEN` in `src/game/game.js` (stress-tested: 900,000 problems, 20,000 per skill and level; every answer checked, every multiple-choice question has exactly one right answer, the math in every prompt checks out, and no mix-up fires on a right answer). Read `AGENTS.md`, `GRADE4.md`, and `NEIGHBORHOODS.md` first. **Edit in place, never rewrite a file.**

The Lemonade Stand is the first shop of the 4th grade neighborhood, so it's open for everyone. Marking it built (`open:true`) makes the neighborhood switcher appear in town and the Home grade menu appear in class settings.

## Stations and skills (Sadlier lessons 1 to 5, Khan's order)

| # | Station | Skills (ids) |
|---|---|---|
| 1 | 🫙 Pitchers | Compare with multiplication (`cmpMult`), Compare with multiplication word problems (`cmpWord`) |
| 2 | 📦 Big Orders | Multiplication and division word problems (`mdWord`), 2-step estimation word problems (`estWord`), Represent multi-step word problems using equations (`eqWord`), Multi-step word problems with whole numbers (`multiStep`) |
| 3 | 🥤 Cup Stacks | Factor pairs (`factorPairs`), Identify factors (`identFactors`), Relate factors and multiples (`relateFM`), Identify multiples (`identMultiples`), Identify prime numbers (`primeId`), Identify composite numbers (`compositeId`), Prime and composite numbers (`primeComp`) |
| 4 | 🪧 Sign Patterns | Patterns with numbers (`numPatterns`), Patterns with shapes (`shapePatterns`) |

Every skill links to its Khan Academy 4th grade exercise (`SKILLS[id].url`).

## What students get, by level

- **Compare:** level 1 picks the equation for "18 is 3 times as many as 6"; levels 2 and 3 find the unknown (the product, then how many times). Word problems pick ×, ÷, or + first; "more than" stories are mixed in from level 2 so students tell them apart from "times as many".
- **Word problems:** equal groups (× or ÷, up to 4-digit ÷ 1-digit on level 2), and on level 3 remainders that must be interpreted (towers needed, full pitchers, or left over). Estimation rounds each number, then estimates (nearest ten, then hundred, then × with nearest ten). Equations pick the one with the right order and parentheses, then solve it from level 2. Multi-step problems are two steps.
- **Factors:** factor pairs are listed from 1 upward (`N = 1 × ?`, `N = 2 × ?` …), then counted. Factor, multiple, prime, and composite choices use real mistakes as wrong answers: a multiple offered as a factor, odd composites like 21 and 51 offered as primes, and 1 (from level 2). Level 2 and up add a follow-up (show a factor pair).
- **Patterns:** next term, the rule, the 6th to 8th term, odd or even, and "multiply by" rules on level 3. Shape patterns find the part that repeats, then the shape at a given position; level 3 has growing figures.

## Mix-ups

`additiveCompare`, `reversedCompare`, `moreAsTimes`, `remainderMeaning`, `roundWrong`, `wrongEquation`, `pairsDoubled`, `notAFactor`, `factorMultipleSwap`, `notAMultiple`, `primeMixup`, `oneIsPrime`, `patternWrongRule`, `patternOffByOne` (text in `MIS`), plus the existing `wrongOperation`. First steps of the word problems open the ratio story pop-up (`story:ratio`) on a miss.

## Rewards

Pets: 🐤 Zest the duckling, 🦘 Pogo the kangaroo, 🐬 Bubbles the dolphin, 🦩 Rosie the flamingo, 🦭 Captain the seal (legendary). Decorations: 🍋 Lemon crate, 🥤 Cup tower, 🧊 Ice bucket, ⛱️ Sun umbrella, 🌟 Golden lemon sign (legendary). Same unlock rules and prices as the other unit sets.

## Engine notes

- Every shop in `SHOPS` gets a progress record (`S[shop].st`) in `fresh()` and `normalize()`, so later 4th grade shops need no save changes.
- "Close the … early" uses the shop's name.
- Class settings get "Unlock the Lemonade Stand through" automatically.

## Generator code (stress-tested)

```js
/* ===== 4th grade, Lemonade Stand (Sadlier lessons 1 to 5): comparing, word problems, factors, patterns ===== */
const choiceOf = (right, wrongs) => shuffle([{html:right.text, text:right.text, ok:true, mis:null}, ...wrongs.filter(w => w.text !== right.text)
  .filter((w, i, arr) => arr.findIndex(x => x.text === w.text) === i).map(w => ({html:w.text, text:w.text, ok:false, mis:w.mis || null}))]);
const numStep = (name, type, prompt, answer, extra = {}) => ({name, type, kind:'num', prompt, answer, eq:v => v === answer, ...extra,
  ...(extra.mis ? {mis:v => v === answer ? null : extra.mis(v)} : {})});   // a mix-up never fires on the right answer (2 + 2 = 2 × 2)
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const isPrime = n => PRIMES.includes(n);
const ODD_COMPOSITES = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57, 63, 65, 69, 75, 77, 81, 85, 87, 91, 93, 95];
const smallestFactor = n => { for (let f = 2; f * f <= n; f++) if (n % f === 0) return f; return n; };
const LEMON_KIDS = [['🧒', 'Mia'], ['👦', 'Leo'], ['👧', 'Ava'], ['🧑', 'Sam'], ['👩', 'Rosa'], ['👨', 'Ben']];
const SHAPES = ['🔺', '🟦', '🟡', '⭐', '🟩', '🔶'];
const LEMON_GEN = {
  cmpMult(lvl){
    const a = rand(2, 9), k = rand(2, lvl === 1 ? 5 : 9), b = a * k;
    const ask = lvl === 1 ? 'none' : lvl === 2 ? 'big' : 'times';
    const say = ask === 'times' ? `${b} is ? times as many as ${a}.` : ask === 'big' ? `? is ${k} times as many as ${a}.` : `${b} is ${k} times as many as ${a}.`;
    const eqRight = ask === 'times' ? `${b} = ? × ${a}` : ask === 'big' ? `? = ${k} × ${a}` : `${b} = ${k} × ${a}`;
    const opts = choiceOf({text:eqRight}, ask === 'times' ? [{text:`${b} = ? + ${a}`, mis:'additiveCompare'}, {text:`${a} = ? × ${b}`, mis:'reversedCompare'}]
      : ask === 'big' ? [{text:`? = ${k} + ${a}`, mis:'additiveCompare'}, {text:`${a} = ${k} × ?`, mis:'reversedCompare'}]
      : [{text:`${b} = ${k} + ${a}`, mis:'additiveCompare'}, {text:`${a} = ${k} × ${b}`, mis:'reversedCompare'}]);
    const steps = [{name:'Pick the equation', type:'concept', kind:'choice', prompt:`Which equation says "${say}"`, options:opts,
      hint:() => '"Times as many" means multiply. The bigger amount is the one that is times as many.'}];
    if (ask === 'times') steps.push(numStep('Find how many times', 'compute', `${b} = ? × ${a}`, k, {fact:{x:a, y:k, div:true}, mis:v => v === b - a ? 'additiveCompare' : null, hint:() => `${a} × what = ${b}?`}));
    else steps.push(numStep('Multiply', 'compute', `${k} × ${a} = ?`, b, {fact:{x:k, y:a}, mis:v => v === a + k ? 'additiveCompare' : null, hint:() => `${k} groups of ${a}.`}));
    return {title:'Pitchers', ctx:`${say}`, bubble:`My sign says: ${say} Can you write it as math?`,
      helper:'"Times as many" is a multiplication comparison.', visual:`<div style="text-align:center; font-size:1.5rem">🍋 ${esc(say)}</div>`, steps};
  },
  cmpWord(lvl){
    const [e, n] = pick(LEMON_KIDS), small = rand(2, 9), k = rand(2, lvl === 1 ? 5 : 9), big = small * k;
    const kind = lvl === 1 ? pick(['bigger', 'bigger', 'smaller']) : pick(['bigger', 'smaller', 'times', ...(lvl === 3 ? ['more', 'more'] : ['more'])]);
    const more = rand(2, 9);
    const T = {
      bigger: {story:`${n}'s small pitcher holds ${small} cups. The big pitcher holds ${k} times as many cups. How many cups does the big pitcher hold?`, op:'×', ans:big, calc:`${small} × ${k}`},
      smaller:{story:`The big pitcher holds ${big} cups. That's ${k} times as many as ${n}'s small pitcher. How many cups does the small pitcher hold?`, op:'÷', ans:small, calc:`${big} ÷ ${k}`},
      times:  {story:`${n} sold ${big} cups on Saturday and ${small} cups on Friday. How many times as many cups did ${n} sell on Saturday?`, op:'÷', ans:k, calc:`${big} ÷ ${small}`},
      more:   {story:`${n} sold ${small} cups on Friday and ${more} more cups on Saturday than on Friday. How many cups on Saturday?`, op:'+', ans:small + more, calc:`${small} + ${more}`}
    }[kind];
    const ops = [{text:'Multiply ( × )', op:'×'}, {text:'Divide ( ÷ )', op:'÷'}, {text:'Add ( + )', op:'+'}];
    const opts = shuffle(ops.map(o => ({html:o.text, text:o.text, ok:o.op === T.op, mis:o.op === T.op ? null : kind === 'more' ? 'moreAsTimes' : o.op === '+' ? 'additiveCompare' : 'wrongOperation'})));
    return {title:'Pitchers', ctx:`${kind}: ${T.calc}`, bubble:T.story,
      helper:'"Times as many" multiplies or divides. "More than" adds.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🍋🥤</div>`,
      steps:[{name:'Pick the operation', type:'concept', kind:'choice', prompt:'Which operation answers the question?', options:opts, drill:{type:'story', key:'ratio'},
          hint:() => kind === 'more' ? '"More than" means add the extra amount.' : 'Find the smaller amount and the bigger amount. "Times as many" connects them with × or ÷.'},
        numStep('Solve', 'compute', `${T.calc} = ?`, T.ans, {fact:T.op === '×' ? {x:small, y:k} : T.op === '÷' ? {x:kind === 'times' ? small : k, y:kind === 'times' ? k : small, div:true} : undefined,
          mis:v => (T.op !== '+' && (v === small + k || v === big - small || v === big - k)) ? 'additiveCompare' : (T.op === '+' && v === small * more) ? 'moreAsTimes' : null,
          hint:() => `${T.calc}.`})]};
  },
  mdWord(lvl){
    const [e, n] = pick(LEMON_KIDS);
    if (lvl < 3) {
      const mult = Math.random() < 0.5, per = lvl === 1 ? rand(2, 9) : rand(3, 9), groups = lvl === 1 ? rand(11, 30) : rand(101, 250), total = per * groups;
      const story = mult ? `${n} packs lemons in bags of ${per}. ${n} fills ${groups} bags. How many lemons is that?`
                         : `${n} has ${total} lemons and packs them in bags of ${per}. How many bags does ${n} fill?`;
      const opts = choiceOf({text:mult ? `${groups} × ${per}` : `${total} ÷ ${per}`}, mult ? [{text:`${groups} + ${per}`, mis:'wrongOperation'}, {text:`${groups} ÷ ${per}`, mis:'wrongOperation'}] : [{text:`${total} × ${per}`, mis:'wrongOperation'}, {text:`${total} − ${per}`, mis:'wrongOperation'}]);
      return {title:'Big Orders', ctx:mult ? `${groups} × ${per}` : `${total} ÷ ${per}`, bubble:story, helper:'Equal groups: multiply to find the total, divide to find the number of groups.',
        visual:`<div style="text-align:center; font-size:1.6rem">${e} 🍋 bags of ${per}</div>`,
        steps:[{name:'Pick the math', type:'concept', kind:'choice', prompt:'Which one matches the story?', options:opts, drill:{type:'story', key:'ratio'}, hint:() => mult ? 'You know the bags and how many in each. Put the groups together.' : 'You know the total and how many in each bag. How many groups fit?'},
          numStep(mult ? 'Multiply' : 'Divide', 'compute', mult ? `${groups} × ${per} = ?` : `${total} ÷ ${per} = ?`, mult ? total : groups, {slowOK:true, hint:() => mult ? `Multiply the ones, then the tens${lvl === 2 ? ', then the hundreds' : ''}.` : `How many ${per}s are in ${total}?`})]};
    }
    const per = rand(3, 9), q = rand(8, 40), r = rand(1, per - 1), total = per * q + r, need = pick(['all', 'full', 'left']);
    const story = need === 'all' ? `${n} has ${total} cups to stack in towers of ${per}. How many towers does ${n} need to stack every cup?`
      : need === 'full' ? `${n} has ${total} lemons. Each pitcher uses ${per}. How many full pitchers can ${n} make?`
      : `${n} has ${total} straws and puts ${per} in each cup. How many straws are left over?`;
    const ans = need === 'all' ? q + 1 : need === 'full' ? q : r;
    return {title:'Big Orders', ctx:`${total} ÷ ${per}, ${need}`, bubble:story, helper:'Divide, then decide what the remainder means for the story.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${total} ÷ ${per}</div>`,
      steps:[{name:'Divide', type:'compute', kind:'qr', prompt:`${total} ÷ ${per} = ? R ?`, answer:[q, r], eq:v => Array.isArray(v) && v[0] === q && v[1] === r, slowOK:true, hint:() => `${per} × ${q} = ${per * q}. What's left?`},
        numStep('Use the remainder', 'concept', need === 'all' ? 'How many towers are needed?' : need === 'full' ? 'How many full pitchers?' : 'How many straws are left over?', ans,
          {mis:v => (need === 'all' && v === q) || (need === 'full' && v === q + 1) || (need === 'left' && v === q) ? 'remainderMeaning' : null,
           hint:() => need === 'all' ? `${q} towers hold ${per * q} cups. The ${r} extra cups need one more tower.` : need === 'full' ? `The ${r} leftover lemons aren't enough for another pitcher.` : 'The remainder is what is left over.'})],
      answerSteps:[1]};
  },
  estWord(lvl){
    const [e, n] = pick(LEMON_KIDS), place = lvl === 1 ? 10 : 100;
    const round = x => Math.round(x / place) * place;
    let a, b, op;
    for (let t = 0; t < 50; t++){
      op = lvl === 3 ? pick(['+', '−', '×']) : pick(['+', '−']);
      if (op === '×') { a = rand(12, 98); b = rand(11, 49); } else { a = lvl === 1 ? rand(21, 98) : rand(201, 989); b = lvl === 1 ? rand(11, 89) : rand(101, 689); }
      if (op === '−' && round(a) <= round(b)) continue;
      if (a % (op === '×' ? 10 : place) === 0 || b % (op === '×' ? 10 : place) === 0) continue;
      if (a % (op === '×' ? 10 : place) === (op === '×' ? 5 : place / 2)) continue;   // no ties when rounding
      if (b % (op === '×' ? 10 : place) === (op === '×' ? 5 : place / 2)) continue;
      break;
    }
    const P = op === '×' ? 10 : place, R = x => Math.round(x / P) * P, ra = R(a), rb = R(b), est = op === '+' ? ra + rb : op === '−' ? ra - rb : ra * rb;
    const wrongRound = x => Math.round(x / P) * P === Math.floor(x / P) * P ? Math.ceil(x / P) * P : Math.floor(x / P) * P;
    const story = op === '+' ? `${n} sold ${a} cups on Saturday and ${b} cups on Sunday. About how many cups is that in all?`
      : op === '−' ? `${n} made ${a} cups and sold ${b}. About how many cups are left?`
      : `${n} has ${a} boxes with ${b} cups in each box. About how many cups is that?`;
    const word = P === 10 ? 'ten' : 'hundred';
    return {title:'Big Orders', ctx:`${a} ${op} ${b}, estimate`, bubble:story, helper:`Round each number to the nearest ${word} first.`,
      visual:`<div style="text-align:center; font-size:1.6rem">${e} about ${a} ${op} ${b}</div>`,
      steps:[numStep('Round the first number', 'concept', `Round ${a} to the nearest ${word}.`, ra, {mis:v => v === wrongRound(a) ? 'roundWrong' : null, hint:() => `Look at the digit to the right of the ${word}s place. 5 or more rounds up.`}),
        numStep('Round the second number', 'concept', `Round ${b} to the nearest ${word}.`, rb, {mis:v => v === wrongRound(b) ? 'roundWrong' : null, hint:() => 'Same rule: 5 or more rounds up.'}),
        numStep('Estimate', 'compute', `${ra} ${op} ${rb} = ?`, est, {hint:() => op === '×' ? `${ra / 10} × ${rb / 10}, then add two zeros.` : `Work with the ${word}s.`})]};
  },
  eqWord(lvl){
    const [e, n] = pick(LEMON_KIDS), L = pick(['c', 'n', 'p']);
    const T = pick([
      () => { const k = rand(2, 5), m = rand(3, 9), s = k * m + rand(5, lvl === 1 ? 30 : 60); return {story:`${n} had ${s} cups. ${n} used ${k} stacks of ${m} cups. ${L} is the number of cups left.`, right:`${L} = ${s} − ${k} × ${m}`, wrong:[`${L} = ${s} − ${k} + ${m}`, `${L} = ${k} × ${m} − ${s}`, `${L} = (${s} − ${k}) × ${m}`], val:s - k * m}; },
      () => { const k = rand(2, 6), m = rand(3, 9), x = rand(2, 12); return {story:`${n} bought ${k} bags of ${m} lemons and ${x} more loose lemons. ${L} is the number of lemons.`, right:`${L} = ${k} × ${m} + ${x}`, wrong:[`${L} = ${k} + ${m} + ${x}`, `${L} = ${k} × (${m} + ${x})`, `${L} = ${k} × ${m} × ${x}`], val:k * m + x}; },
      () => { const g = rand(2, 6), a = rand(10, 30), b = rand(5, 20), tot = a + b, t2 = tot - tot % g, a2 = t2 - b; return {story:`${n} made ${a2} cups in the morning and ${b} in the afternoon, then shared them equally among ${g} tables. ${L} is the number of cups at each table.`, right:`${L} = (${a2} + ${b}) ÷ ${g}`, wrong:[`${L} = ${a2} + ${b} ÷ ${g}`, `${L} = (${a2} + ${b}) × ${g}`, `${L} = ${g} ÷ (${a2} + ${b})`], val:(a2 + b) / g}; },
      () => { const p = rand(2, 5), k = rand(3, 9), paid = (p * k < 20 ? 20 : p * k < 50 ? 50 : 100); return {story:`${n} bought ${k} cups at $${p} each and paid with a $${paid} bill. ${L} is the change.`, right:`${L} = ${paid} − ${k} × ${p}`, wrong:[`${L} = ${paid} − ${k} + ${p}`, `${L} = ${k} × ${p} − ${paid}`, `${L} = (${paid} − ${k}) × ${p}`], val:paid - k * p}; }
    ])();
    const opts = choiceOf({text:T.right}, T.wrong.map(w => ({text:w, mis:'wrongEquation'})));
    const steps = [{name:'Pick the equation', type:'concept', kind:'choice', prompt:`Which equation finds ${L}?`, options:opts, drill:{type:'story', key:'ratio'}, hint:() => 'Say the story in order: what happens first, and what happens next? Parentheses show what to do first.'}];
    if (lvl >= 2) steps.push(numStep(`Find ${L}`, 'compute', `${T.right.replace(`${L} = `, '')} = ?`, T.val, {hint:() => 'Multiply or divide before you add or subtract, unless parentheses say otherwise.'}));
    return {title:'Big Orders', ctx:T.right, bubble:T.story, helper:'Turn the story into one equation with a letter for the unknown.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${L} = ?</div>`, steps};
  },
  multiStep(lvl){
    const [e, n] = pick(LEMON_KIDS);
    const T = pick([
      () => { const k = rand(3, lvl === 1 ? 6 : 9), m = rand(4, 9) * (lvl === 3 ? 2 : 1), g = rand(5, k * m - 5); return {story:`${n} buys ${k} packs of ${m} cups, then gives away ${g} cups. How many cups are left?`, s1:['How many cups in the packs?', `${k} × ${m} = ?`, k * m, {x:k, y:m}], s2:[`${k * m} − ${g} = ?`, k * m - g]}; },
      () => { const g = rand(2, 6), q = rand(4, lvl === 1 ? 9 : 15), tot = g * q, a = rand(1, tot - 1), friend = n === 'Rosa' ? 'Ben' : 'Rosa'; return {story:`${n} squeezed ${a} lemons and ${friend} squeezed ${tot - a}. They split them equally into ${g} pitchers. How many lemons per pitcher?`, s1:['How many lemons in all?', `${a} + ${tot - a} = ?`, tot, null], s2:[`${tot} ÷ ${g} = ?`, q, {x:g, y:q, div:true}]}; },
      () => { const p = rand(2, 5), k = rand(3, 9), p2 = rand(1, 4), k2 = rand(2, 8); return {story:`Lemonade is $${p} a cup and cookies are $${p2} each. ${n} buys ${k} cups and ${k2} cookies. How much does ${n} spend?`, s1:['How much for the lemonade?', `${k} × ${p} = ?`, k * p, {x:k, y:p}], s2:[`${k * p} + ${k2} × ${p2} = ?`, k * p + k2 * p2]}; }
    ])();
    return {title:'Big Orders', ctx:T.story.slice(0, 60), bubble:T.story, helper:'Two steps: find the first amount, then use it.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} 🍋 two steps</div>`,
      steps:[numStep('First step', 'compute', `${T.s1[0]} ${T.s1[1]}`, T.s1[2], T.s1[3] ? {fact:T.s1[3]} : {}),
        numStep('Second step', 'compute', T.s2[0], T.s2[1], {...(T.s2[2] ? {fact:T.s2[2]} : {}), hint:() => 'Use your answer from the first step.'})]};
  },
  factorPairs(lvl){
    let N, pairs;
    for (let t = 0; t < 100; t++){
      N = lvl === 1 ? rand(6, 30) : lvl === 2 ? rand(12, 60) : rand(24, 100);
      pairs = []; for (let f = 1; f * f <= N; f++) if (N % f === 0) pairs.push([f, N / f]);
      if (pairs.length >= (lvl === 1 ? 2 : 3) && pairs.length <= (lvl === 3 ? 6 : 4)) break;
    }
    const steps = pairs.map(([f, g]) => numStep(`${f} × ?`, 'compute', `${N} = ${f} × ?`, g, {fact:f > 1 ? {x:f, y:g, div:true} : undefined, drill:{type:'factors', key:'pairs'}, hint:() => `${N} ÷ ${f} = ?`}));
    steps.push(numStep('Count the pairs', 'concept', `How many factor pairs does ${N} have?`, pairs.length,
      {mis:v => { const factors = new Set(pairs.flat()).size; return v !== pairs.length && (v === pairs.length * 2 || v === factors) ? 'pairsDoubled' : null; }, hint:() => `Count the rows you filled: each one is a pair. 3 × 4 and 4 × 3 are the same pair.`}));
    return {title:'Cup Stacks', ctx:`factor pairs of ${N}`, bubble:`I have ${N} cups. What rectangles can I stack them in? Find every factor pair of ${N}.`,
      helper:'Start at 1 and go up. Stop when the pairs start repeating.', visual:`<div style="text-align:center; font-size:1.6rem">🥤 ${N} cups</div>`, steps};
  },
  identFactors(lvl){
    let N, f;
    for (let t = 0; t < 100; t++){ N = pick(lvl === 1 ? [12, 16, 18, 20, 24, 30] : lvl === 2 ? [24, 28, 32, 36, 40, 42, 45, 48] : [54, 56, 60, 63, 64, 72, 75, 80, 84, 90, 96]);
      const fs = []; for (let x = 2; x < N; x++) if (N % x === 0) fs.push(x); f = pick(fs); if (f) break; }
    const non = []; for (let x = 2; x <= 12; x++) if (N % x !== 0) non.push(x);
    const wrongs = shuffle(non).slice(0, 2).map(x => ({text:String(x), mis:'notAFactor'}));
    wrongs.push({text:String(N * 2), mis:'factorMultipleSwap'});
    const opts = choiceOf({text:String(f)}, wrongs);
    const steps = [{name:'Pick the factor', type:'concept', kind:'choice', prompt:`Which number is a factor of ${N}?`, options:opts, hint:() => `A factor divides ${N} with nothing left over.`}];
    if (lvl >= 2) steps.push(numStep('Check it', 'compute', `${N} ÷ ${f} = ?`, N / f, {fact:{x:f, y:N / f, div:true}}));
    return {title:'Cup Stacks', ctx:`factor of ${N}`, bubble:`I want to stack ${N} cups in equal rows. Which row size works?`, helper:'Factors divide evenly. Multiples are bigger.',
      visual:`<div style="text-align:center; font-size:1.6rem">🥤 ${N} cups</div>`, steps};
  },
  relateFM(lvl){
    const a = rand(2, 12), k = rand(2, 12), N = a * k;
    const opts = choiceOf({text:`${N} is a multiple of ${a}`}, [{text:`${a} is a multiple of ${N}`, mis:'factorMultipleSwap'}, {text:`${N} is a factor of ${a}`, mis:'factorMultipleSwap'}, {text:`${a} is a multiple of ${a + 1}`, mis:null}]);
    const opts2 = choiceOf({text:`${a} is a factor of ${N}`}, [{text:`${N} is a factor of ${a}`, mis:'factorMultipleSwap'}, {text:`${a} is a multiple of ${N}`, mis:'factorMultipleSwap'}]);
    const useFactor = Math.random() < 0.5;
    return {title:'Cup Stacks', ctx:`${a} × ${k} = ${N}`, bubble:`${a} × ${k} = ${N}. Which sentence is true?`, helper:`In ${a} × ${k} = ${N}, ${a} and ${k} are factors, and ${N} is a multiple of each.`,
      visual:`<div style="text-align:center; font-size:1.6rem">${a} × ${k} = ${N}</div>`,
      steps:[{name:'Factor or multiple', type:'concept', kind:'choice', prompt:'Which sentence is true?', options:(useFactor ? opts2 : opts).filter(o => o.ok || o.mis), hint:() => 'The multiple is the product, the big number. The factors multiply to make it.'},
        numStep('Find the other factor', 'compute', `${a} × ? = ${N}`, k, {fact:{x:a, y:k, div:true}})].slice(0, lvl === 1 ? 1 : 2)};
  },
  identMultiples(lvl){
    const n = rand(3, lvl === 1 ? 6 : 12), k = rand(2, lvl === 1 ? 6 : 10), m = n * k;
    const facs = []; for (let x = 2; x < n; x++) if (n % x === 0) facs.push(x);
    const wrongs = [{text:String(m + 1), mis:'notAMultiple'}, {text:String(m - 1), mis:'notAMultiple'}, {text:String(n + k), mis:'notAMultiple'}];
    if (facs.length) wrongs[2] = {text:String(pick(facs)), mis:'factorMultipleSwap'};
    const opts = choiceOf({text:String(m)}, wrongs.filter(w => +w.text % n !== 0));
    const steps = [{name:'Pick the multiple', type:'concept', kind:'choice', prompt:`Which number is a multiple of ${n}?`, options:opts, hint:() => `Skip-count by ${n}s: ${n}, ${2 * n}, ${3 * n}, …`}];
    if (lvl >= 2) steps.push(numStep('Check it', 'compute', `${n} × ? = ${m}`, k, {fact:{x:n, y:k, div:true}}));
    return {title:'Cup Stacks', ctx:`multiple of ${n}`, bubble:`Cups come in stacks of ${n}. Which amount can I make with full stacks?`, helper:`Multiples of ${n} are ${n} times a whole number.`,
      visual:`<div style="text-align:center; font-size:1.6rem">🥤 stacks of ${n}</div>`, steps};
  },
  primeId(lvl){ return primeChoice('prime', lvl); },
  compositeId(lvl){ return primeChoice('composite', lvl); },
  primeComp(lvl){
    const pool = lvl === 1 ? [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 9, 15, 21, 25, 27, 12, 16, 18, 20, 22] : lvl === 2 ? [31, 37, 41, 43, 47, 53, 33, 35, 39, 45, 49, 51, 34, 38, 46] : [59, 61, 67, 71, 73, 79, 83, 89, 97, 57, 63, 69, 77, 87, 91, 93, 95, 1];
    const N = pick(pool), kind = N === 1 ? 'neither' : isPrime(N) ? 'prime' : 'composite';
    const opts = shuffle(['Prime', 'Composite', ...(lvl === 3 ? ['Neither'] : [])].map(t => ({html:t, text:t, ok:t.toLowerCase() === kind, mis:t.toLowerCase() === kind ? null : N === 1 ? 'oneIsPrime' : 'primeMixup'})));
    const steps = [{name:'Prime or composite', type:'concept', kind:'choice', prompt:`Is ${N} prime or composite?`, options:opts,
      hint:() => N === 1 ? '1 has only one factor, so it is neither.' : `Try dividing ${N} by 2, 3, 5, and 7.`}];
    if (kind === 'composite') { const f = smallestFactor(N); steps.push(numStep('Show a factor pair', 'compute', `${N} = ${f} × ?`, N / f, {fact:{x:f, y:N / f, div:true}})); }
    else if (kind === 'prime') steps.push(numStep('Its only factor pair', 'compute', `${N} = 1 × ?`, N));
    return {title:'Cup Stacks', ctx:`${N} prime or composite`, bubble:`Can ${N} cups be stacked in a rectangle with more than one row? Is ${N} prime or composite?`,
      helper:'A prime number has exactly two factors: 1 and itself.', visual:`<div style="text-align:center; font-size:1.8rem">🥤 ${N}</div>`, steps};
  },
  numPatterns(lvl){
    const a = rand(1, 12), d = rand(2, lvl === 1 ? 6 : 12);
    if (lvl === 3 && Math.random() < 0.5) {
      const m = rand(2, 3), s = rand(1, 4), seq = [s, s * m, s * m * m, s * m * m * m];
      const opts = choiceOf({text:`Multiply by ${m}`}, [{text:`Add ${seq[1] - seq[0]}`, mis:'patternWrongRule'}, {text:`Add ${m}`, mis:'patternWrongRule'}]);
      return {title:'Sign Patterns', ctx:`×${m} from ${s}`, bubble:`The sign counts ${seq.join(', ')}, … What's the rule, and what comes next?`, helper:'Check the rule on every pair of numbers, not just the first two.',
        visual:`<div style="text-align:center; font-size:1.6rem">🪧 ${seq.join(', ')}, ?</div>`,
        steps:[{name:'Find the rule', type:'concept', kind:'choice', prompt:'What is the rule?', options:opts, hint:() => `${seq[0]} to ${seq[1]}, then ${seq[1]} to ${seq[2]}. Is it the same amount added each time?`},
          numStep('Next number', 'compute', `${seq[3]} × ${m} = ?`, seq[3] * m, {mis:v => v === seq[3] + (seq[3] - seq[2]) ? 'patternWrongRule' : null})]};
    }
    const seq = [0, 1, 2, 3].map(i => a + i * d), nth = lvl === 1 ? 5 : rand(6, 8), val = a + (nth - 1) * d;
    const steps = lvl === 1
      ? [numStep('Next number', 'compute', `${seq.join(', ')}, ?`, a + 4 * d, {mis:v => v === a + 3 * d + 1 ? 'patternWrongRule' : null, hint:() => `Add ${d}.`})]
      : [numStep('Find the rule', 'concept', `${seq.join(', ')}, … What is added each time?`, d, {hint:() => `${seq[1]} − ${seq[0]} = ?`}),
         numStep(`The ${nth}th number`, 'compute', `What is the ${nth}th number?`, val, {mis:v => v === val - d || v === val + d ? 'patternOffByOne' : v === nth * d ? 'patternWrongRule' : null, hint:() => `Keep adding ${d} until you reach number ${nth}.`})];
    if (lvl >= 2) {
      const allOdd = seq.every(x => x % 2 === 1), allEven = seq.every(x => x % 2 === 0), right = allOdd ? 'All odd' : allEven ? 'All even' : 'Odd, even, odd, even';
      steps.push({name:'Odd or even', type:'concept', kind:'choice', prompt:'What do you notice about the numbers?', options:choiceOf({text:right}, ['All odd', 'All even', 'Odd, even, odd, even'].map(t => ({text:t, mis:'patternWrongRule'}))),
        hint:() => d % 2 === 0 ? `Adding an even number keeps odd numbers odd and even numbers even.` : 'Adding an odd number switches between odd and even.'});
    }
    return {title:'Sign Patterns', ctx:`start ${a}, add ${d}`, bubble:lvl === 1 ? `The sign counts ${seq.join(', ')}, … Rule: add ${d}. What comes next?` : `The sign counts ${seq.join(', ')}, …`,
      helper:'Find what changes from one number to the next.', visual:`<div style="text-align:center; font-size:1.6rem">🪧 ${seq.join(', ')}, …</div>`, steps};
  },
  shapePatterns(lvl){
    if (lvl === 3) {
      const start = rand(1, 5), d = rand(2, 4), nth = rand(5, 8), val = start + (nth - 1) * d;
      return {title:'Sign Patterns', ctx:`growing ${start} + ${d}`, bubble:`Figure 1 has ${start} cups, figure 2 has ${start + d}, figure 3 has ${start + 2 * d}. How many cups does figure ${nth} have?`,
        helper:'Find how many cups each new figure adds.', visual:`<div style="text-align:center; font-size:1.2rem; line-height:1.4">${[1, 2, 3].map(i => '🥤'.repeat(start + (i - 1) * d)).join('<br>')}</div>`,
        steps:[numStep('Cups added each time', 'concept', 'How many cups does each new figure add?', d),
          numStep(`Figure ${nth}`, 'compute', `How many cups in figure ${nth}?`, val, {mis:v => v === val - d || v === val + d ? 'patternOffByOne' : v === nth * d ? 'patternWrongRule' : null, hint:() => `Figure 3 has ${start + 2 * d}. Keep adding ${d}.`})]};
    }
    const len = lvl === 1 ? rand(2, 3) : rand(3, 4), core = shuffle(SHAPES).slice(0, len), nth = rand(len + 4, lvl === 1 ? 12 : 23), shape = core[(nth - 1) % len];
    const shown = Array.from({length:len * 2 + 1}, (_, i) => core[i % len]).join(' ');
    const near = [core[(nth - 2 + len) % len], core[nth % len]];
    const opts = shuffle(core.map(s => ({html:`<span style="font-size:1.6rem">${s}</span>`, text:s, ok:s === shape, mis:s === shape ? null : near.includes(s) ? 'patternOffByOne' : 'patternWrongRule'})));
    return {title:'Sign Patterns', ctx:`${core.join('')} #${nth}`, bubble:`My sign repeats these shapes. Which shape is number ${nth}?`,
      helper:'Find the part that repeats. Then count in groups of that size.', visual:`<div style="text-align:center; font-size:1.8rem">${shown} …</div>`,
      steps:[numStep('Shapes in the repeat', 'concept', 'How many shapes are in the part that repeats?', len, {hint:() => 'Find where the pattern starts over.'}),
        {name:`Shape ${nth}`, type:'compute', kind:'choice', prompt:`Which shape is number ${nth}?`, options:opts, hint:() => `${nth} ÷ ${len} = ${Math.floor(nth / len)} R ${nth % len}. The remainder tells you the place in the repeat${nth % len === 0 ? ' (0 means the last shape)' : ''}.`}]};
  }
};
function primeChoice(want, lvl){
  const top = lvl === 1 ? 30 : lvl === 2 ? 60 : 99;
  const primes = PRIMES.filter(p => p <= top && p > 2), comps = ODD_COMPOSITES.filter(c => c <= top);
  let right, wrongs;
  if (want === 'prime') {
    right = pick(primes);
    wrongs = shuffle(comps).slice(0, lvl === 1 ? 2 : 3).map(c => ({text:String(c), mis:'primeMixup'}));
    if (lvl >= 2) wrongs[wrongs.length - 1] = {text:'1', mis:'oneIsPrime'};
  } else {
    right = pick(comps);
    wrongs = shuffle(primes).slice(0, lvl === 1 ? 2 : 3).map(p => ({text:String(p), mis:'primeMixup'}));
    if (lvl >= 2) wrongs[wrongs.length - 1] = {text:'1', mis:'oneIsPrime'};
  }
  const opts = choiceOf({text:String(right)}, wrongs);
  const composite = want === 'prime' ? +(opts.find(o => !o.ok && o.text !== '1') || {text:'9'}).text : right;
  const f = smallestFactor(composite);
  return {title:'Cup Stacks', ctx:`which is ${want}: ${opts.map(o => o.text).join(', ')}`, bubble:`Which number is ${want}?`,
    helper:'Prime: exactly two factors (1 and itself). Composite: more than two.', visual:`<div style="text-align:center; font-size:1.6rem">🥤 ${opts.map(o => o.text).join('  ')}</div>`,
    steps:[{name:`Pick the ${want} number`, type:'concept', kind:'choice', prompt:`Which number is ${want}?`, options:opts, hint:() => 'Odd numbers can be composite too: try dividing by 3, 5, and 7.'},
      numStep('Show a factor pair', 'compute', `${composite} is composite: ${composite} = ${f} × ?`, composite / f, {fact:{x:f, y:composite / f, div:true}})].slice(0, lvl === 1 ? 1 : 2)};
}
```
