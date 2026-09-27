# 4th grade, shop 3: the Pizza Parlor

**Status: stations 1 to 3 built; stations 4 (Party Orders, multiplying fractions by whole numbers) and 5 (Pizza Money, tenths and hundredths) to come.** The generators are `PIZZA_GEN` in `src/game/game.js` (stress-tested: 1,080,000 problems, 20,000 per skill and level; every fraction answer checked with exact arithmetic, every comparison and "which sum / which fraction" choice checked to have exactly one right option, and mixed-number problems checked to regroup exactly when the skill says so). Read `AGENTS.md`, `GRADE4.md`, and `NEIGHBORHOODS.md` first. **Edit in place, never rewrite a file.**

The Pizza Parlor opens after the Toy Shop Unit Test (or with the teacher's "Open the Pizza Parlor for everyone").

## Stations and skills (Sadlier lessons 14 to 20 so far, Khan's order)

| # | Station | Skills (ids) |
|---|---|---|
| 1 | 🍕 Slices | Equivalent fractions (fraction models) (`eqFracModel`), Equivalent fractions (number lines) (`eqFracLine`), Equivalent fractions (`eqFrac`), Fractions of different wholes (`diffWholes`), Common denominators (`commonDen`) |
| 2 | ⚖️ Which Is Bigger? | Visually compare fractions (`cmpVisual`), Compare fractions using benchmarks (`cmpBench`), Compare fractions with different numerators and denominators (`cmpFrac`), Compare fractions word problems (`cmpFracWord`) |
| 3 | 🧀 Toppings | Decompose fractions visually (`decompVisual`), Decompose fractions (`decomp`), Add and subtract fractions with common denominators (`addLike`, `subLike`), word problems (`fracWordAS`), Write mixed numbers and improper fractions (`mixedImproper`), Add and subtract mixed numbers without and with regrouping (`mixedAS`, `mixedASregroup`), mixed number word problems (`mixedWord`) |
| 4 | 🎉 Party Orders | Lessons 21 to 23 (to be written) |
| 5 | 💵 Pizza Money | Lessons 24 and 25 (to be written) |

## What students get

- **New pictures:** fraction bars (`fracBarSVG`, extra bars for amounts over 1) and number lines (`numberLineSVG`). On the equivalent-fractions number line, the top line is labeled and the bottom line is counted.
- **Fraction answers** use the Bakery's fraction boxes. 4th grade doesn't require simplest form, so any equal fraction is accepted, except that mixed-number answers must have a fraction part less than 1.
- **Equivalent fractions:** from pictures, number lines, and missing numbers; level 3 picks the equal fraction from real mistakes (adding the same number to top and bottom, scaling only one). Common denominators find the smallest shared denominator, then rewrite both.
- **Comparing:** pictures, benchmarks (each fraction against 1/2, then compare), common denominators, and word problems. Wrong answers that follow "bigger denominator is bigger" are named.
- **Adding and subtracting:** decomposing (which sum, missing part, wholes into fractions), like denominators (sums over 1 on level 2+), word problems (pick + or − first), mixed ↔ improper, and mixed numbers with and without regrouping (borrowing a whole as d/d).

## Mix-ups

New: `additiveEquiv`, `onlyOneScaled`, `wholesMatter`, `benchmarkWrong`, `biggerDenBigger`, `compareFractions`, `decomposeSum`, `addDenominators`, `improperWrong`, `regroupTen`. Reused: `notMixed`, `wrongOperation`, `smallerFromLarger`. The equivalent-fraction steps open the Bakery's simplify pop-up; the word problems open the word-problem pop-up.

## Rewards

Pets: 🐭 Mozzarella the mouse, 🐈‍⬛ Pepper the cat, 🦔 Crust the hedgehog, 🦝 Basil the raccoon, 🐲 Oregano the dragon (legendary). Decorations: 🧀 Cheese wheel, 🍅 Tomato basket, 🫓 Dough board, 🔥 Pizza oven, 🏆 Golden pizza peel (legendary).

## Generator code (stress-tested)

```js
/* ===== 4th grade, Pizza Parlor stations 1 to 3 (Sadlier lessons 14 to 20): equivalent fractions, comparing, adding and subtracting ===== */
/* fraction bar: d equal parts, the first n shaded (n may be more than d: extra whole bars are drawn) */
function fracBarSVG(n, d, {w = 240, label = true} = {}){
  const bars = Math.max(1, Math.ceil(n / d)), h = 28, gap = 8, pw = w / d;
  let g = '';
  for (let b = 0; b < bars; b++){
    const y = b * (h + gap);
    for (let i = 0; i < d; i++){ const on = b * d + i < n; g += `<rect x="${1 + i * pw}" y="${y + 1}" width="${pw}" height="${h}" class="${on ? 'fb-on' : 'fb-off'}"/>`; }
  }
  return `<svg class="frac-bar" viewBox="0 0 ${w + 2} ${bars * (h + gap)}" width="${w + 2}" role="img" aria-label="${n} of ${d} equal parts shaded">${g}</svg>${label ? '' : ''}`;
}
/* number line from 0 to `top` (whole numbers) split into d parts per whole; a dot at n/d (null for none) */
function numberLineSVG(d, n, {top = 1, w = 280, labels = 'ends'} = {}){
  const L = 14, R = w - 14, y = 30, parts = d * top, step = (R - L) / parts;
  let g = `<line x1="${L}" y1="${y}" x2="${R}" y2="${y}" class="nl-line"/>`;
  for (let i = 0; i <= parts; i++){
    const x = L + i * step, whole = i % d === 0;
    g += `<line x1="${x}" y1="${y - (whole ? 10 : 6)}" x2="${x}" y2="${y + (whole ? 10 : 6)}" class="nl-line"/>`;
    if (whole) g += `<text x="${x}" y="${y + 26}" class="nl-text">${i / d}</text>`;
    else if (labels === 'all') g += `<text x="${x}" y="${y + 26}" class="nl-text nl-small">${i}/${d}</text>`;
  }
  if (n != null) g += `<circle cx="${L + n * step}" cy="${y}" r="7" class="nl-dot"/>`;
  return `<svg class="num-line" viewBox="0 0 ${w} 62" width="${w}" role="img" aria-label="number line from 0 to ${top} in ${d}ths">${g}</svg>`;
}
const fracTxt = (n, d) => `${n}/${d}`;
const mixedTxt = (w, n, d) => n ? `${w ? w + ' ' : ''}${n}/${d}` : String(w);
const PIZZA_KIDS = [['🧒', 'Mia'], ['👦', 'Leo'], ['👧', 'Ava'], ['🧑', 'Sam'], ['👩', 'Rosa'], ['👨', 'Ben']];
/* a fraction answer box that takes any equal fraction or mixed number (4th grade doesn't require simplest form) */
const fracStep = (name, prompt, p, q, extra = {}) => ({name, type:'compute', kind:'frac', prompt, answer:FRAC.simplest(p, q), eq:v => FRAC.same(v, p, q) && (!extra.mixedOnly || v[1] < v[2]), ...extra});
const PIZZA_GEN = {
  eqFracModel(lvl){
    const [a, b] = lvl === 1 ? [1, pick([2, 3, 4])] : properFrac(2, 6), k = rand(2, lvl === 3 ? 4 : 3), big = b * k, top = a * k;
    const down = lvl >= 2 && Math.random() < 0.5;          // from the many small parts back to the few big parts
    return {title:'Slices', ctx:down ? `${top}/${big} = ?/${b}` : `${a}/${b} = ?/${big}`, bubble:down ? `This pizza is cut into ${big} slices and ${top} are left. How many ${FRAC.part(b, true)} is that?` : `This pizza is cut into ${FRAC.part(b, true)}, and ${a} ${a === 1 ? 'is' : 'are'} left. If I cut every slice into ${k}, how many of the ${big} slices are left?`,
      helper:'Same amount of pizza, different number of slices.', visual:`<div class="frac-pics">${fracBarSVG(down ? top : a, down ? big : b)}${fracBarSVG(down ? a : top, down ? b : big)}</div>`,
      steps:[{name:'Equivalent fraction', type:'concept', kind:'num', prompt:down ? `${top}/${big} = ?/${b}` : `${a}/${b} = ?/${big}`, answer:down ? a : top, eq:v => v === (down ? a : top),
        mis:v => v !== (down ? a : top) && v === (down ? top - (big - b) : a + (big - b)) ? 'additiveEquiv' : null, drill:{type:'simplify', key:String(k)},
        hint:() => down ? `Every ${k} small slices make 1 big slice. ${top} ÷ ${k} = ?` : `Each ${FRAC.part(b)} becomes ${k} slices. ${a} × ${k} = ?`}]};
  },
  eqFracLine(lvl){
    const b = pick(lvl === 1 ? [2, 3, 4] : [3, 4, 5, 6]), k = rand(2, lvl === 1 ? 2 : 3), a = rand(1, b - 1), big = b * k;
    return {title:'Slices', ctx:`${a}/${b} on ${big}ths`, bubble:`The dot on the top line is at ${a}/${b}. Where is the same spot on the bottom line?`, helper:'Equal fractions sit at the same spot on the number line.',
      visual:`<div class="frac-pics">${numberLineSVG(b, a, {labels:'all'})}${numberLineSVG(big, null)}</div>`,
      steps:[{name:'Same point', type:'concept', kind:'num', prompt:`${a}/${b} = ?/${big}`, answer:a * k, eq:v => v === a * k, mis:v => v !== a * k && v === a + big - b ? 'additiveEquiv' : null, hint:() => `Each ${FRAC.part(b)} on top is ${k} jumps on the bottom line.`}]};
  },
  eqFrac(lvl){
    const [a, b] = properFrac(2, lvl === 1 ? 6 : 10), k = rand(2, lvl === 1 ? 4 : 6), top = a * k, big = b * k;
    if (lvl === 3) {
      const wrongs = [{text:fracTxt(a + k, b + k), mis:'additiveEquiv'}, {text:fracTxt(top, b), mis:'onlyOneScaled'}, {text:fracTxt(a * k, b * (k + 1)), mis:'onlyOneScaled'}];
      return {title:'Slices', ctx:`equivalent to ${top}/${big}`, bubble:`Which fraction is the same amount as ${top}/${big}?`, helper:'Multiply or divide the top and bottom by the same number.',
        visual:`<div style="text-align:center; font-size:1.8rem">${top}/${big}</div>`,
        steps:[{name:'Pick the equal fraction', type:'concept', kind:'choice', prompt:`Which fraction equals ${top}/${big}?`, options:choiceOf({text:fracTxt(a, b)}, wrongs), drill:{type:'simplify', key:String(k)}, hint:() => `Divide the top and bottom of ${top}/${big} by the same number.`}]};
    }
    const missTop = lvl === 1 || Math.random() < 0.5;
    return {title:'Slices', ctx:missTop ? `${a}/${b} = ?/${big}` : `${a}/${b} = ${top}/?`, bubble:`Find the missing number so the fractions are equal.`, helper:'Whatever you multiply the bottom by, multiply the top by the same.',
      visual:`<div style="text-align:center; font-size:1.8rem">${a}/${b} = ${missTop ? '?' : top}/${missTop ? big : '?'}</div>`,
      steps:[{name:'Missing number', type:'compute', kind:'num', prompt:missTop ? `${a}/${b} = ?/${big}` : `${a}/${b} = ${top}/?`, answer:missTop ? top : big, eq:v => v === (missTop ? top : big),
        fact:{x:missTop ? a : b, y:k}, mis:v => v !== (missTop ? top : big) && v === (missTop ? a + big - b : b + top - a) ? 'additiveEquiv' : null, hint:() => `${missTop ? b : a} × ${k} = ${missTop ? big : top}, so multiply the ${missTop ? 'top' : 'bottom'} by ${k} too.`}]};
  },
  diffWholes(lvl){
    if (lvl === 3) {
      const [e, n] = pick(PIZZA_KIDS), f = pick(['1/2', '1/4', '3/4']);
      const opts = choiceOf({text:'No. The large pizza is bigger, so its piece is bigger.'}, [{text:`Yes. They both ate ${f}.`, mis:'wholesMatter'}, {text:'No. The small pizza piece is bigger.', mis:'wholesMatter'}]);
      return {title:'Slices', ctx:`${f} of different wholes`, bubble:`${n} ate ${f} of a small pizza. Sam ate ${f} of a large pizza. Did they eat the same amount?`, helper:'A fraction is always a fraction of some whole.',
        visual:`<div style="text-align:center; font-size:1.6rem">🍕 small · 🍕🍕 large</div>`, steps:[{name:'Same whole?', type:'concept', kind:'choice', prompt:'Did they eat the same amount of pizza?', options:opts, hint:() => 'Half of a big thing is more than half of a small thing.'}]};
    }
    const b = pick([3, 4, 5, 6, 8]), a = rand(1, b - 1), k = lvl === 1 ? 1 : rand(2, 3), shown = a * k, whole = b * k;
    return {title:'Slices', ctx:`${shown} parts = ${a}/${b}`, bubble:`These ${shown} squares are ${a}/${b} of a tray. How many squares are in the whole tray?`, helper:'Find how many squares make 1 part, then count all the parts.',
      visual:`<div class="frac-pics">${fracBarSVG(shown, shown, {w:Math.min(240, shown * 30)})}<div style="text-align:center">= ${a}/${b} of the tray</div></div>`,
      steps:[...(k > 1 ? [{name:'One part', type:'concept', kind:'num', prompt:`${shown} squares are ${a} parts. How many squares are in 1 part?`, answer:k, eq:v => v === k, fact:{x:a, y:k, div:true}}] : []),
        {name:'The whole', type:'compute', kind:'num', prompt:`The whole tray is ${b} parts. How many squares?`, answer:whole, eq:v => v === whole, mis:v => v !== whole && v === shown + b ? 'additiveEquiv' : null, hint:() => `${b} parts × ${k} square${k === 1 ? '' : 's'} each.`}]};
  },
  commonDen(lvl){
    let b1, b2; do { b1 = rand(2, lvl === 1 ? 6 : 10); b2 = rand(2, lvl === 1 ? 6 : 12); } while (b1 === b2 || b1 * b2 / gcd(b1, b2) > (lvl === 3 ? 60 : 36) || (lvl === 1 && b2 % b1 !== 0 && b1 % b2 !== 0 && Math.random() < 0.6));
    const L = b1 * b2 / gcd(b1, b2), a1 = rand(1, b1 - 1), a2 = rand(1, b2 - 1);
    return {title:'Slices', ctx:`${a1}/${b1} and ${a2}/${b2}`, bubble:`Rewrite ${a1}/${b1} and ${a2}/${b2} so they have the same denominator.`, helper:'Find a number both denominators go into.',
      visual:`<div style="text-align:center; font-size:1.8rem">${a1}/${b1} · ${a2}/${b2}</div>`,
      steps:[{name:'Common denominator', type:'concept', kind:'num', prompt:`What is the smallest number that both ${b1} and ${b2} go into?`, answer:L, eq:v => v === L, mis:v => v !== L && v === b1 + b2 ? 'additiveEquiv' : null, hint:() => `List multiples of ${Math.max(b1, b2)} until ${Math.min(b1, b2)} goes in too.`},
        {name:`Rewrite ${a1}/${b1}`, type:'compute', kind:'num', prompt:`${a1}/${b1} = ?/${L}`, answer:a1 * L / b1, eq:v => v === a1 * L / b1, fact:{x:a1, y:L / b1}, mis:v => v !== a1 * L / b1 && v === a1 + L - b1 ? 'additiveEquiv' : null},
        {name:`Rewrite ${a2}/${b2}`, type:'compute', kind:'num', prompt:`${a2}/${b2} = ?/${L}`, answer:a2 * L / b2, eq:v => v === a2 * L / b2, fact:{x:a2, y:L / b2}, mis:v => v !== a2 * L / b2 && v === a2 + L - b2 ? 'additiveEquiv' : null}]};
  },
  cmpVisual(lvl){
    let a, b, c, d; do { [a, b] = properFrac(2, lvl === 1 ? 6 : 8); [c, d] = properFrac(2, lvl === 1 ? 6 : 8); } while (b === d || a * d === b * c && lvl === 1);
    const right = a * d > b * c ? '>' : a * d < b * c ? '<' : '=';
    return {title:'Which Is Bigger?', ctx:`${a}/${b} ? ${c}/${d} bars`, bubble:`Two pizzas the same size. Which piece is bigger: ${a}/${b} or ${c}/${d}?`, helper:'The bars are the same size, so compare how much is shaded.',
      visual:`<div class="frac-pics">${fracBarSVG(a, b)}<div style="text-align:center">${a}/${b}</div>${fracBarSVG(c, d)}<div style="text-align:center">${c}/${d}</div></div>`,
      steps:[compareStep(a, b, c, d, right)]};
  },
  cmpBench(lvl){
    let a, b, c, d;
    do { [a, b] = properFrac(2, 12); [c, d] = properFrac(2, 12); } while (2 * a === b || 2 * c === d || (2 * a < b) === (2 * c < d));   // one below 1/2, one above
    const right = a * d > b * c ? '>' : '<', side = (x, y) => 2 * x < y ? 'Less than 1/2' : 'More than 1/2';
    const bench = (x, y) => ({name:`${x}/${y} and 1/2`, type:'concept', kind:'choice', prompt:`Is ${x}/${y} more or less than 1/2?`,
      options:choiceOf({text:side(x, y)}, [{text:side(x, y) === 'Less than 1/2' ? 'More than 1/2' : 'Less than 1/2', mis:'benchmarkWrong'}]), hint:() => `Half of ${y} is ${y / 2}. Is ${x} more or less than that?`});
    return {title:'Which Is Bigger?', ctx:`${a}/${b} ? ${c}/${d} benchmark`, bubble:`Compare ${a}/${b} and ${c}/${d}. Use 1/2 to help.`, helper:'If one is less than 1/2 and the other is more, you know which is bigger.',
      visual:`<div style="text-align:center; font-size:1.8rem">${a}/${b} ◯ ${c}/${d}</div>`, steps:[bench(a, b), bench(c, d), compareStep(a, b, c, d, right)]};
  },
  cmpFrac(lvl){
    let a, b, c, d; do { [a, b] = properFrac(2, lvl === 1 ? 6 : 10); [c, d] = properFrac(2, lvl === 1 ? 6 : 10); } while (b === d || a * d === b * c);
    const L = b * d / gcd(b, d), n1 = a * L / b, n2 = c * L / d, right = n1 > n2 ? '>' : '<';
    return {title:'Which Is Bigger?', ctx:`${a}/${b} ? ${c}/${d}`, bubble:`Which is bigger: ${a}/${b} or ${c}/${d}?`, helper:'Give them the same denominator, then compare the numerators.',
      visual:`<div style="text-align:center; font-size:1.8rem">${a}/${b} ◯ ${c}/${d}</div>`,
      steps:[{name:`Rewrite ${a}/${b}`, type:'compute', kind:'num', prompt:`${a}/${b} = ?/${L}`, answer:n1, eq:v => v === n1, fact:{x:a, y:L / b}},
        {name:`Rewrite ${c}/${d}`, type:'compute', kind:'num', prompt:`${c}/${d} = ?/${L}`, answer:n2, eq:v => v === n2, fact:{x:c, y:L / d}},
        compareStep(a, b, c, d, right)]};
  },
  cmpFracWord(lvl){
    const [[e1, n1], [e2, n2]] = shuffle(PIZZA_KIDS).slice(0, 2);
    let a, b, c, d; do { [a, b] = properFrac(2, 8); [c, d] = properFrac(2, 8); } while (b === d || a * d === b * c);
    const first = a * d > b * c, what = pick([['pizza', 'ate', 'more pizza'], ['mile', 'ran', 'farther'], ['pitcher of lemonade', 'drank', 'more lemonade']]);
    const opts = shuffle([{html:n1, text:n1, ok:first, mis:first ? null : 'biggerDenBigger'}, {html:n2, text:n2, ok:!first, mis:!first ? null : 'biggerDenBigger'}]);
    return {title:'Which Is Bigger?', ctx:`${a}/${b} vs ${c}/${d} story`, bubble:`${n1} ${what[1]} ${a}/${b} of a ${what[0]}. ${n2} ${what[1]} ${c}/${d} of a ${what[0]}. Who ${what[1]} ${what[2]}?`, helper:'Compare the fractions the way you would with numbers alone.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e1} ${a}/${b} · ${e2} ${c}/${d}</div>`,
      steps:[{name:'Who has more?', type:'concept', kind:'choice', prompt:`Who ${what[1]} ${what[2]}?`, options:opts, hint:() => 'Rewrite both with the same denominator, or compare each to 1/2.'}]};
  },
  decompVisual(lvl){
    const d = pick([4, 5, 6, 8, 10]), n = rand(3, d - 1), s1 = rand(1, n - 1), s2 = n - s1;
    const wrongs = [{text:`${s1}/${d} + ${s2 + 1}/${d}`, mis:'decomposeSum'}, {text:`${s1 + 1}/${d} + ${s2 + 1}/${d}`, mis:'decomposeSum'}, {text:`${s1}/${d} + ${s2}/${d} + 1/${d}`, mis:'decomposeSum'}];
    return {title:'Toppings', ctx:`${n}/${d} = ${s1}/${d} + ${s2}/${d}`, bubble:`${n}/${d} of the pizza has toppings. Which sum shows the same amount?`, helper:'The parts must add up to the same number of slices.',
      visual:`<div class="frac-pics">${fracBarSVG(n, d)}<div style="text-align:center">${n}/${d}</div></div>`,
      steps:[{name:'Break it apart', type:'concept', kind:'choice', prompt:`Which sum equals ${n}/${d}?`, options:choiceOf({text:`${s1}/${d} + ${s2}/${d}`}, wrongs), hint:() => 'Add the numerators. The size of the slices stays the same.'}]};
  },
  decomp(lvl){
    if (lvl === 3) {
      const d = pick([3, 4, 5, 6, 8]), w = rand(1, 3), n = rand(1, d - 1), total = w * d + n;
      return {title:'Toppings', ctx:`${w} ${n}/${d} decomposed`, bubble:`Break ${w} ${n}/${d} into ${FRAC.part(d, true)}.`, helper:`Each whole is ${d}/${d}.`, visual:`<div style="text-align:center; font-size:1.8rem">${w} ${n}/${d}</div>`,
        steps:[{name:'Wholes as fractions', type:'compute', kind:'num', prompt:`${w} whole${w === 1 ? '' : 's'} = ?/${d}`, answer:w * d, eq:v => v === w * d, fact:{x:w, y:d}},
          {name:'Break it apart', type:'compute', kind:'num', prompt:`${w} ${n}/${d} = ${w * d}/${d} + ?/${d}`, answer:n, eq:v => v === n}]};
    }
    const d = pick([4, 5, 6, 8, 10, 12]), n = rand(3, d - 1), s1 = rand(1, n - 1);
    return {title:'Toppings', ctx:`${n}/${d} = ${s1}/${d} + ?`, bubble:`Complete the sum: ${n}/${d} = ${s1}/${d} + ?/${d}`, helper:'The numerators add up to the total. The denominator stays the same.',
      visual:`<div class="frac-pics">${fracBarSVG(n, d)}</div>`,
      steps:[{name:'Missing part', type:'compute', kind:'num', prompt:`${n}/${d} = ${s1}/${d} + ?/${d}`, answer:n - s1, eq:v => v === n - s1, mis:v => v !== n - s1 && v === n + s1 ? 'decomposeSum' : null, hint:() => `${s1} + ? = ${n}`}]};
  },
  addLike(lvl){ return likeFractions(lvl, '+'); },
  subLike(lvl){ return likeFractions(lvl, '−'); },
  fracWordAS(lvl){
    const [e, n] = pick(PIZZA_KIDS), d = pick([4, 5, 6, 8, 10, 12]), op = pick(['+', '−']);
    let a = rand(1, d - 1), b = rand(1, d - 1); if (op === '−' && a < b) [a, b] = [b, a]; if (op === '−' && a === b) a = Math.min(d - 1, a + 1), b = Math.max(1, b - 1);
    if (op === '+' && lvl === 1 && a + b > d) b = d - a || 1;
    const p = op === '+' ? a + b : a - b;
    const story = op === '+' ? `${n} put ${a}/${d} of the cheese on one pizza and ${b}/${d} on another. How much of the cheese did ${n} use?` : `There was ${a}/${d} of a pizza left. ${n} ate ${b}/${d} of the pizza. How much is left now?`;
    const opts = shuffle([{html:'Add ( + )', text:'Add', ok:op === '+', mis:op === '+' ? null : 'wrongOperation'}, {html:'Subtract ( − )', text:'Subtract', ok:op === '−', mis:op === '−' ? null : 'wrongOperation'}]);
    return {title:'Toppings', ctx:`${a}/${d} ${op} ${b}/${d} story`, bubble:story, helper:'Decide whether the story puts together or takes away.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🍕</div>`,
      steps:[{name:'Pick the operation', type:'concept', kind:'choice', prompt:'Add or subtract?', options:opts, drill:{type:'story', key:'addSub'}, hint:() => op === '+' ? 'Two amounts are put together.' : 'Some is taken away.'},
        fracStep(op === '+' ? 'Add' : 'Subtract', `${a}/${d} ${op} ${b}/${d} = ?`, p, d, {mis:v => fracMis(v, p, d, op === '+' ? [['addDenominators', a + b, 2 * d]] : []), hint:() => `${op === '+' ? 'Add' : 'Subtract'} the numerators. The slices stay ${FRAC.part(d, true)}.`})]};
  },
  mixedImproper(lvl){
    const d = pick([2, 3, 4, 5, 6, 8]), w = rand(1, lvl === 1 ? 3 : 6), n = rand(1, d - 1), top = w * d + n;
    if (Math.random() < 0.5) return {title:'Toppings', ctx:`${w} ${n}/${d} to improper`, bubble:`Write ${w} ${n}/${d} as an improper fraction.`, helper:`Each whole is ${d}/${d}.`, visual:`<div class="frac-pics">${fracBarSVG(top, d, {w:200})}</div>`,
      steps:[{name:'Wholes to fractions', type:'compute', kind:'num', prompt:`${w} whole${w === 1 ? '' : 's'} = ?/${d}`, answer:w * d, eq:v => v === w * d, fact:{x:w, y:d}},
        {name:'Improper fraction', type:'compute', kind:'num', prompt:`${w} ${n}/${d} = ?/${d}`, answer:top, eq:v => v === top, mis:v => v !== top && (v === w + n || v === w * d || v === w * n + d) ? 'improperWrong' : null, hint:() => `${w * d} + ${n} = ?`}]};
    return {title:'Toppings', ctx:`${top}/${d} to mixed`, bubble:`Write ${top}/${d} as a mixed number.`, helper:`How many wholes (${d}/${d}) fit in ${top}/${d}?`, visual:`<div class="frac-pics">${fracBarSVG(top, d, {w:200})}</div>`,
      steps:[{name:'Wholes', type:'compute', kind:'num', prompt:`How many wholes are in ${top}/${d}?`, answer:w, eq:v => v === w, fact:{x:d, y:w, div:true}},
        fracStep('Mixed number', `${top}/${d} = ?`, top, d, {mixedOnly:true, mis:v => FRAC.ok(v) && FRAC.same(v, top, d) && v[1] >= v[2] ? 'notMixed' : null, hint:() => `${w} wholes and ${n}/${d} left over.`})]};
  },
  mixedAS(lvl){ return mixedProblem(lvl, false); },
  mixedASregroup(lvl){ return mixedProblem(lvl, true); },
  mixedWord(lvl){
    const [e, n] = pick(PIZZA_KIDS), p = mixedProblem(lvl, lvl === 3), [w1, n1, w2, n2, d, op] = p.nums;
    p.bubble = op === '+' ? `${n} used ${mixedTxt(w1, n1, d)} cups of flour for the dough and ${mixedTxt(w2, n2, d)} cups for the crust. How many cups in all?`
                          : `${n} had ${mixedTxt(w1, n1, d)} feet of ribbon and used ${mixedTxt(w2, n2, d)} feet to wrap pizza boxes. How much is left?`;
    p.visual = `<div style="text-align:center; font-size:1.6rem">${e} ${mixedTxt(w1, n1, d)} ${op} ${mixedTxt(w2, n2, d)}</div>`;
    p.ctx += ' story';
    p.steps.unshift({name:'Pick the operation', type:'concept', kind:'choice', prompt:'Add or subtract?', options:shuffle([{html:'Add ( + )', text:'Add', ok:op === '+', mis:op === '+' ? null : 'wrongOperation'}, {html:'Subtract ( − )', text:'Subtract', ok:op === '−', mis:op === '−' ? null : 'wrongOperation'}]), drill:{type:'story', key:'addSub'}});
    p.answerSteps = [p.steps.length - 1];
    return p;
  }
};
function compareStep(a, b, c, d, right){
  const denWrong = (b > d ? '>' : '<') === right ? null : 'biggerDenBigger';
  return {name:'Compare', type:'concept', kind:'choice', prompt:`${a}/${b} ◯ ${c}/${d}`, options:choiceOf({text:right}, ['>', '<', '='].map(t => ({text:t, mis:t === (b > d ? '>' : '<') && denWrong ? denWrong : 'compareFractions'}))).map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`})),
    hint:() => 'With the same denominator, the bigger numerator is bigger. With the same numerator, the smaller denominator means bigger slices.'};
}
function likeFractions(lvl, op){
  const d = pick(lvl === 1 ? [4, 5, 6, 8] : [5, 6, 8, 10, 12]);
  let a = rand(1, d - 1), b = rand(1, d - 1);
  if (op === '−' && a <= b) { [a, b] = [Math.max(a, b), Math.min(a, b)]; if (a === b) { a = d - 1; b = rand(1, d - 2); } }
  if (op === '+' && lvl === 1 && a + b > d) b = Math.max(1, d - a);
  const p = op === '+' ? a + b : a - b;
  if (lvl === 3 && op === '−') { const w = rand(1, 3); a += w * d; }                                  // 2 3/8 − 5/8 style: start from a mixed amount, as an improper fraction
  const P = op === '+' ? a + b : a - b;
  return {title:'Toppings', ctx:`${a}/${d} ${op} ${b}/${d}`, bubble:`${op === '+' ? 'Add' : 'Subtract'}: ${a}/${d} ${op} ${b}/${d}`, helper:'Same-size slices: add or subtract the numerators, keep the denominator.',
    visual:`<div class="frac-pics">${fracBarSVG(a, d)}</div>`,
    steps:[fracStep(op === '+' ? 'Add' : 'Subtract', `${a}/${d} ${op} ${b}/${d} = ?`, P, d, {mis:v => fracMis(v, P, d, op === '+' ? [['addDenominators', P, 2 * d]] : []),
      hint:() => `${a} ${op} ${b} = ${P}, so it's ${P}/${d}.${P > d ? ' You can write it as a mixed number too.' : ''}`})]};
}
/* mixed numbers with like denominators; regroup: adding makes more than a whole, or subtracting needs to borrow a whole */
function mixedProblem(lvl, regroup){
  const d = pick([3, 4, 5, 6, 8, 10]), op = pick(['+', '−']);
  let w1, n1, w2, n2;
  for (let t = 0; t < 100; t++){
    w1 = rand(1, lvl === 1 ? 3 : 6); w2 = rand(1, lvl === 1 ? 3 : 5); n1 = rand(1, d - 1); n2 = rand(1, d - 1);
    if (op === '−' && (w1 * d + n1) <= (w2 * d + n2)) continue;
    const over = op === '+' ? n1 + n2 > d : n1 < n2;
    if (op === '+' && n1 + n2 === d) continue;
    if (op === '−' && n1 === n2) continue;
    if (over === regroup) break;
  }
  const T1 = w1 * d + n1, T2 = w2 * d + n2, P = op === '+' ? T1 + T2 : T1 - T2, steps = [];
  if (op === '−' && regroup) steps.push({name:'Regroup a whole', type:'concept', kind:'num', prompt:`${mixedTxt(w1, n1, d)} = ${w1 - 1} ?/${d}`, answer:d + n1, eq:v => v === d + n1, mis:v => v !== d + n1 && v === n1 + 10 ? 'regroupTen' : null, hint:() => `Take 1 whole (${d}/${d}) and add it to ${n1}/${d}.`});
  steps.push({name:'Fractions', type:'compute', kind:'num', prompt:op === '+' ? `${n1}/${d} + ${n2}/${d} = ?/${d}` : `${regroup ? d + n1 : n1}/${d} − ${n2}/${d} = ?/${d}`, answer:op === '+' ? n1 + n2 : (regroup ? d + n1 : n1) - n2, eq:v => v === (op === '+' ? n1 + n2 : (regroup ? d + n1 : n1) - n2)});
  steps.push({name:'Wholes', type:'compute', kind:'num', prompt:op === '+' ? `${w1} + ${w2} = ?` : `${regroup ? w1 - 1 : w1} − ${w2} = ?`, answer:op === '+' ? w1 + w2 : (regroup ? w1 - 1 : w1) - w2, eq:v => v === (op === '+' ? w1 + w2 : (regroup ? w1 - 1 : w1) - w2)});
  steps.push(fracStep('The answer', `${mixedTxt(w1, n1, d)} ${op} ${mixedTxt(w2, n2, d)} = ?`, P, d, {mixedOnly:true,
    mis:v => { if (!FRAC.ok(v)) return null; if (FRAC.same(v, P, d) && v[1] >= v[2]) return 'notMixed';
      if (op === '−' && regroup && FRAC.same(v, (w1 - w2) * d + (n2 - n1), d)) return 'smallerFromLarger'; return null; },
    hint:() => op === '+' && regroup ? `${n1 + n2}/${d} is more than 1 whole. Trade ${d}/${d} for 1 whole.` : 'Put the wholes and the fraction together.'}));
  return {title:'Toppings', ctx:`${mixedTxt(w1, n1, d)} ${op} ${mixedTxt(w2, n2, d)}`, nums:[w1, n1, w2, n2, d, op], bubble:`${op === '+' ? 'Add' : 'Subtract'}: ${mixedTxt(w1, n1, d)} ${op} ${mixedTxt(w2, n2, d)}`,
    helper:'Work with the fractions, then the wholes.', visual:`<div style="text-align:center; font-size:1.8rem">${mixedTxt(w1, n1, d)} ${op} ${mixedTxt(w2, n2, d)}</div>`, steps, answerSteps:[steps.length - 1]};
}
```
