# 6th grade, shop 4: the Clock Tower

**Status: built (all 3 stations).** Khan Academy 6th grade, Unit 4: Exponents and order of operations. The generators are `CLOCK_GEN` in `src/game/game.js` (stress-tested: 420,000 problems, 20,000 per skill and level; every step and final answer checked against an independent evaluator, every fraction answer in simplest form, every "what does it mean" and "do first" option checked). Read `AGENTS.md` and `NEIGHBORHOODS.md` first. **Edit in place, never rewrite a file.**

The Clock Tower opens after the Market Stall Unit Test (or with the teacher's "Open the Clock Tower for everyone"). Khan puts GCF, LCM, and the distributive property in Unit 6, so they come with the Potion Lab.

## Stations and skills (Khan's order)

| # | Station | Skills (ids) |
|---|---|---|
| 1 | 🔔 Chimes | Meaning of exponents (`expMeaning`), powers of whole numbers (`powWhole`), powers of fractions and decimals (`powFrac`) |
| 2 | ⚙️ Gears | Order of operations without exponents (`orderNoExp`), order of operations (`orderOps`) |
| 3 | 🕰️ Clock Face | Order of operations with fractions and exponents (`orderFracExp`), comparing exponent expressions (`compareExp`) |

## What students get

- **Exponents:** writing repeated multiplication as a power, picking what a power means (with 5 × 3 and 3⁵ as wrong answers), powers of 0 and 1, missing exponents (2 to what power is 32?), and building a power one multiplication at a time. Exponents are shown with superscript digits (5³).
- **Powers of fractions and decimals:** (2/3)² as fraction answers in simplest form, and 0.3² or 1.2² as decimals (the moving-the-decimal pop-up).
- **Order of operations:** the engine (`ooParse`, `ooEval`, `ooProblem`) works exactly with fractions. A "what do you do first?" choice appears only when a wrong first step would really change the answer (a lower-level operation, one outside the parentheses, or the next one after − or ÷). Then there is one step per operation, with the expression shown and the part being worked on highlighted (`.oo-expr mark`). Quizzes ask only the final answer, and a wrong final answer is checked against working left to right, ignoring parentheses, and a² as a × 2.
- **Comparing powers:** 6³ vs 6 × 3, 2⁵ vs 5², and close pairs like 2⁶ = 4³.

## Mix-ups

New: `expTimesBase` (5³ → 15), `baseExpSwap` (2⁵ vs 5²), `zeroExponent`, `decimalPower` (0.3² → 0.9), `expOnlyTop` ((2/3)² → 4/3), `leftToRight`, `ignoresParens`, `expLast`. Reused: `notSimplest`, `notMixed`.

## Rewards

The Clock Tower reward set was already in the registry: 🦉 Hoot the owl, 🦇 Midnight the bat, 🐿️ Acorn the chipmunk, 🦅 Soar the eagle, 🐉 Ember the dragon, and 5 decorations.

## Generator code (stress-tested)

```js
/* ===== 6th grade, Clock Tower (Khan unit 4): exponents and order of operations ===== */
const SUP = n => String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('');
/* exact rationals [p, q], q > 0, reduced */
const RQ = {
  of: (p, q = 1) => { const g = gcd(Math.abs(p), q) || 1; return [p / g, q / g]; },
  add: (a, b) => RQ.of(a[0] * b[1] + b[0] * a[1], a[1] * b[1]), sub: (a, b) => RQ.of(a[0] * b[1] - b[0] * a[1], a[1] * b[1]),
  mul: (a, b) => RQ.of(a[0] * b[0], a[1] * b[1]), div: (a, b) => b[0] === 0 ? null : RQ.of(a[0] * b[1] * Math.sign(b[0]), a[1] * Math.abs(b[0])),
  pow: (a, e) => RQ.of(Math.pow(a[0], e), Math.pow(a[1], e)),
  txt: a => a[1] === 1 ? String(a[0]) : a[0] > a[1] ? `${Math.floor(a[0] / a[1])} ${a[0] % a[1]}/${a[1]}` : `${a[0]}/${a[1]}`
};
/* order of operations engine: tokens are {n:[p,q]}, {op:'+'|'−'|'×'|'÷'|'^'}, {open:'('|'['}, {close:')'|']'} */
function ooParse(src, vals){
  const out = [];
  for (const t of src.split(' ')) {
    if (t === '(' || t === '[') out.push({open:t}); else if (t === ')' || t === ']') out.push({close:t});
    else if ('+−×÷^'.includes(t)) out.push({op:t});
    else if (/^\d+$/.test(t)) out.push({n:[+t, 1]});
    else out.push({n:vals[t]});
  }
  return out;
}
function ooText(tk, mark = null){
  let s = '';
  tk.forEach((x, i) => {
    const m0 = mark && i === mark[0] ? '⟨' : '', m1 = mark && i === mark[1] ? '⟩' : '';
    if (x.op === '^') return;
    if (tk[i - 1] && tk[i - 1].op === '^') { s += SUP(x.n[0]) + m1; return; }
    const piece = x.n ? (x.n[1] !== 1 && tk[i + 1] && tk[i + 1].op === '^' ? `(${RQ.txt(x.n)})` : RQ.txt(x.n)) : x.op ? ` ${x.op} ` : x.open || x.close;
    s += m0 + piece + m1;
  });
  s = s.replace(/\s+/g, ' ').replace(/([(\[]) /g, '$1').replace(/ ([)\]])/g, '$1').trim();
  return mark ? s : s.replace(/[⟨⟩]/g, '');
}
/* the expression with the part being worked on highlighted */
const ooHTML = (tk, lo, hi) => `<div class="oo-expr">${esc(ooText(tk, [lo, hi])).replace('⟨', '<mark>').replace('⟩', '</mark>')}</div>`;
/* the next operation by the order of operations: innermost grouping, then exponents, then × ÷ left to right, then + − left to right.
   opts: {noPrec} does every operation left to right, {noParens} ignores grouping, {expMul} treats a² as a × 2 (for spotting mix-ups) */
function ooNext(tk, opts = {}){
  let lo = 0, hi = tk.length - 1;
  if (!opts.noParens) { const c = tk.findIndex(x => x.close); if (c >= 0) { let o = c; while (!tk[o].open) o--; lo = o + 1; hi = c - 1; if (lo === hi) return {unwrap:[o, c]}; } }
  const inR = (f) => { for (let i = lo; i <= hi; i++) if (tk[i].op && f(tk[i].op)) return i; return -1; };
  let i = opts.noPrec ? inR(o => true) : inR(o => o === '^'); if (!opts.noPrec && i < 0) i = inR(o => o === '×' || o === '÷'); if (!opts.noPrec && i < 0) i = inR(o => o === '+' || o === '−');
  return i < 0 ? null : {i};
}
function ooApply(a, op, b, opts = {}){
  if (op === '^') return opts.expMul ? RQ.mul(a, b) : RQ.pow(a, b[0]);
  return op === '+' ? RQ.add(a, b) : op === '−' ? RQ.sub(a, b) : op === '×' ? RQ.mul(a, b) : RQ.div(a, b);
}
/* evaluate fully; returns {value, steps:[{a, op, b, r, lo, hi, before}]} or null if a step is impossible */
function ooEval(tk0, opts = {}){
  let tk = (opts.noParens ? tk0.filter(x => !x.open && !x.close) : tk0).slice(); const steps = [];
  for (let guard = 0; guard < 40; guard++) {
    if (tk.length === 1 && tk[0].n) return {value:tk[0].n, steps};
    const nx = ooNext(tk, opts); if (!nx) return null;
    if (nx.unwrap) { tk.splice(nx.unwrap[1], 1); tk.splice(nx.unwrap[0], 1); continue; }
    const i = nx.i, a = tk[i - 1], b = tk[i + 1]; if (!a || !b || !a.n || !b.n) return null;
    const r = ooApply(a.n, tk[i].op, b.n, opts); if (!r) return null;
    steps.push({a:a.n, op:tk[i].op, b:b.n, r, lo:i - 1, hi:i + 1, before:tk.slice()});
    tk.splice(i - 1, 3, {n:r});
  }
  return null;
}
const rqSame = (v, r) => FRAC.ok(v) && FRAC.same(v, r[0], r[1]);
/* a typed answer box for a rational: a number box for whole numbers, the fraction boxes otherwise */
function rqStep(name, prompt, r, {simplest = false, ...extra} = {}){
  if (r[1] === 1) return {name, type:'compute', kind:'num', prompt, answer:r[0], eq:v => v === r[0], ...extra, ...(extra.mis ? {mis:v => v === r[0] ? null : extra.mis([v, 1])} : {})};
  const ans = FRAC.simplest(r[0], r[1]);
  return {name, type:'compute', kind:'frac', prompt, answer:ans, eq:v => rqSame(v, r) && (!simplest || FRAC.canon(v)), ...extra,
    mis:v => { if (rqSame(v, r)) return simplest && !FRAC.canon(v) ? (v[1] >= v[2] ? 'notMixed' : 'notSimplest') : null; return extra.mis && FRAC.ok(v) ? extra.mis(FRAC.imp(v)) : null; }};
}
const opWord = s => s.op === '^' ? `${s.a[1] !== 1 ? `(${RQ.txt(s.a)})` : RQ.txt(s.a)}${SUP(s.b[0])}` : `${RQ.txt(s.a)} ${s.op} ${RQ.txt(s.b)}`;
/* build a whole order-of-operations problem from a template like 'a + b × c' */
function ooProblem(templates, fill, {title, check = () => true, fracOK = false}){
  for (let t = 0; t < 400; t++) {
    const src = pick(templates), vals = fill(src), tk = ooParse(src, vals), ev = ooEval(tk);
    if (!ev || ev.steps.length < 2) continue;
    if (ev.steps.some(s => s.r[0] <= 0 || (!fracOK && s.r[1] !== 1) || s.r[1] > 64 || Math.abs(s.r[0]) > 2000) || !check(ev)) continue;
    const text = ooText(tk), val = ev.value;
    /* wrong answers students really get: left to right, ignoring parentheses, a² as a × 2 */
    const alt = {leftToRight:ooEval(tk, {noPrec:true}), ignoresParens:ooEval(tk, {noParens:true}), expTimesBase:ooEval(tk, {expMul:true})};
    const finalMis = w => { for (const [id, e] of Object.entries(alt)) if (e && e.value[0] * w[1] === w[0] * e.value[1] && !(e.value[0] === val[0] && e.value[1] === val[1])) return id; return null; };
    /* "what do you do first?": every operation whose two sides are plain numbers, plus a² inside a squared group */
    const first = ev.steps[0], cands = [];
    const inPower = j => (tk[j - 1] && tk[j - 1].op === '^') || (tk[j + 1] && tk[j + 1].op === '^');   // 3 in 9 − 3² is not a plain number
    tk.forEach((x, i) => { if (x.op && tk[i - 1] && tk[i + 1] && tk[i - 1].n && tk[i + 1].n && (x.op === '^' || (!inPower(i - 1) && !inPower(i + 1)))) cands.push({text:opWord({a:tk[i - 1].n, op:x.op, b:tk[i + 1].n}), i}); });
    const rightText = opWord(first), lr = cands[0], firstI = first.lo + 1;
    const rank = o => o === '^' ? 3 : o === '×' || o === '÷' ? 2 : 1, rR = rank(first.op);
    const depth = j => tk.slice(0, j).filter(x => x.open).length - tk.slice(0, j).filter(x => x.close).length;
    /* a wrong first step must really give a different answer: a lower-level operation, one outside the parentheses, or the next one along after − or ÷ */
    const wrongs = cands.filter(c => c.i !== firstI && (depth(c.i) < depth(firstI) || rank(tk[c.i].op) < rR || (rank(tk[c.i].op) === rR && c.i === firstI + 2 && (first.op === '−' || first.op === '÷') && depth(c.i) === depth(firstI)))).map(c => {
      const inside = tk.slice(0, c.i).filter(x => x.open).length - tk.slice(0, c.i).filter(x => x.close).length > 0;
      const rightInside = tk.slice(0, firstI).filter(x => x.open).length - tk.slice(0, firstI).filter(x => x.close).length > 0;
      return {text:c.text, mis:rightInside && !inside ? 'ignoresParens' : first.op === '^' && c.i < firstI ? 'expLast' : c === lr ? 'leftToRight' : null};
    });
    const steps = [];
    const firstOpts = choiceOf({text:rightText}, wrongs);                 // two operations can read the same (4 + 4 twice): then there is nothing to choose
    if (firstOpts.length >= 2) steps.push({name:'Do first', type:'concept', kind:'choice', prompt:`${text}: what do you do first?`, options:firstOpts,
      hint:() => 'Grouping symbols first, then exponents, then × and ÷ from left to right, then + and − from left to right.'});
    ev.steps.forEach((s, k) => steps.push(rqStep(k === ev.steps.length - 1 ? 'Last step' : `Step ${k + 1}`, `${opWord(s)} = ?`, s.r, {work:ooHTML(s.before, s.lo, s.hi), slowOK:true,
      ...(s.a[1] === 1 && s.b[1] === 1 && s.r[1] === 1 ? {fact:s.op === '×' ? fx(s.a[0], s.b[0]) : s.op === '÷' ? fx(s.b[0], s.r[0], true) : undefined} : {}),
      ...(s.op === '^' ? {mis:w => w[0] * s.a[1] * s.b[0] === s.a[0] * s.b[0] * w[1] && s.b[0] !== 2 ? 'expTimesBase' : w[1] === 1 && s.a[1] === 1 && w[0] === s.a[0] * s.b[0] && s.a[0] !== 2 ? 'expTimesBase' : null} : {})})));
    const fin = rqStep('The answer', `${text} = ?`, val, {simplest:true, mis:finalMis}); fin.skipIf = () => true;       // quizzes ask only this; practice ends with the last step
    steps.push(fin);
    return {title, ctx:text, bubble:`Help me set the clock! What is ${text}?`, helper:'Grouping, exponents, × and ÷ left to right, then + and − left to right.',
      visual:`<div style="text-align:center; font-size:1.8rem">🕰️ ${esc(text)}</div>`, steps, answerSteps:[steps.length - 1]};
  }
  return null;
}
const OO_NOEXP = [
  ['a + b × c', 'a × b + c', 'a − b × c', 'a × b − c', 'a + b ÷ c', 'a ÷ b + c', '( a + b ) × c', 'a × ( b + c )', '( a − b ) × c', 'a − b + c', 'a ÷ b × c'],
  ['a + b × c − d', '( a + b ) × c − d', 'a × b ÷ c + d', 'a − ( b + c ) ÷ d', 'a × ( b − c ) + d', 'a + b ÷ c × d', '( a + b ) ÷ c + d', 'a − b × c + d'],
  ['a × ( b + c ) − d ÷ e', '( a − b ) × ( c + d )', 'a + b × ( c − d ) ÷ e', '[ ( a + b ) × c ] − d', 'a − b × c + d × e', '[ a + ( b − c ) ] × d ÷ e']];
const OO_EXP = [
  ['a ^ 2 + b', 'a + b ^ 2', 'a × b ^ 2', '( a + b ) ^ 2', 'a ^ 2 − b × c', 'a ^ 3 + b'],
  ['a + b × c ^ 2', '( a − b ) ^ 2 + c', 'a ^ 2 ÷ b + c', 'a ^ 3 − b × c', 'a × ( b + c ) ^ 2', 'a ^ 2 + b ^ 2'],
  ['a × ( b + c ) ^ 2 − d', '( a ^ 2 + b ) ÷ c', 'a ^ 2 + b ^ 2 × c', '[ a + ( b − c ) ^ 2 ] × d', 'a ^ 3 ÷ b − c × d', '( a + b ) ^ 2 − c ^ 2']];
const OO_FRAC = [
  ['F ^ 2', 'a × F', 'F ^ 2 × a', 'a ^ 2 × F', 'F ^ 3', 'F + F ^ 2'],
  ['F ^ 2 + F', 'a − F × b', 'F × ( a + b ) ^ 2', '( F ) ^ 2 × a + b', 'a ^ 2 × F − b', '( a − F ) × b'],
  ['F ^ 3 × a + b', '( F + F ) ^ 2', 'a ^ 2 × F − F', '( a − b ) ^ 2 ÷ F', 'F × a ^ 2 + F ^ 2', '[ a − F ] ^ 2']];
/* fill a template: letters get whole numbers (small bases before an exponent), F gets a proper fraction */
const ooFill = lvl => src => {
  const v = {}, tk = src.split(' '), top = [9, 12, 15][lvl - 1];
  tk.forEach((t, i) => { if (/^[a-e]$/.test(t)) { const e = tk[i + 1] === '^' ? +tk[i + 2] : tk[i + 1] === ')' && tk[i + 2] === '^' ? 0 : 1;
    v[t] = [e === 3 ? rand(2, 5) : e === 2 ? rand(2, lvl === 1 ? 9 : 12) : rand(2, top), 1]; } });
  let k = 0; const out = {...v}; src = src.replace(/F/g, () => `F${k++}`); for (let j = 0; j < k; j++) { const d = rand(2, 6), n = rand(1, d - 1); out[`F${j}`] = RQ.of(n, d); }
  return out;
};
function ooFracProblem(lvl){
  for (let t = 0; t < 400; t++) {
    const src0 = pick(OO_FRAC[lvl - 1]); let k = 0; const src = src0.replace(/F/g, () => `F${k++}`);
    const p = ooProblem([src], ooFill(lvl), {title:'Clock Face', fracOK:true, check:ev => ev.value[1] !== 1 || Math.random() < 0.3});
    if (p) return p;
  }
}
const CLOCK_GEN = {
  /* ----- station 1: Chimes (exponents) ----- */
  expMeaning(lvl){
    const b = rand(2, 9), e = rand(b === 2 ? 3 : 2, b >= 6 ? 3 : b >= 4 ? 4 : 5);   // 2² = 2 × 2 = 4 leaves no wrong answers
    if (lvl === 1) {
      const long = Array(e).fill(b).join(' × ');
      return {title:'Chimes', ctx:`${long} as a power`, bubble:`The bell rings ${b} times, and it does that ${e} times over: ${long}. Write it as a power.`, helper:'The base is the number being multiplied. The exponent counts how many times.',
        visual:`<div style="text-align:center; font-size:1.6rem">🔔 ${long}</div>`,
        steps:[{name:'As a power', type:'concept', kind:'choice', prompt:`${long} = ?`, options:choiceOf({text:`${b}${SUP(e)}`}, [{text:`${e}${SUP(b)}`, mis:'baseExpSwap', v:Math.pow(e, b)}, {text:`${b} × ${e}`, mis:'expTimesBase', v:b * e}].filter(w => w.v !== Math.pow(b, e))),
          hint:() => `${b} is multiplied ${e} times.`}]};
    }
    if (lvl === 2 && Math.random() < 0.7) {
      const long = Array(e).fill(b).join(' × ');
      return {title:'Chimes', ctx:`${b}${SUP(e)} meaning`, bubble:`What does ${b}${SUP(e)} mean? Then find its value.`, helper:'An exponent means repeated multiplication, not multiplying by the exponent.',
        visual:`<div style="text-align:center; font-size:2rem">🔔 ${b}${SUP(e)}</div>`,
        steps:[{name:'What it means', type:'concept', kind:'choice', prompt:`${b}${SUP(e)} = ?`, options:choiceOf({text:long}, [{text:`${b} × ${e}`, mis:'expTimesBase', v:b * e}, {text:Array(b).fill(e).join(' × '), mis:'baseExpSwap', v:Math.pow(e, b)}, {text:Array(e).fill(b).join(' + '), mis:'expTimesBase', v:b * e}].filter(w => w.v !== Math.pow(b, e))),   // 2 × 2 is also 2², so it can't be a wrong answer
            hint:() => `Write ${b} down ${e} times with × between.`},
          numStep('Value', 'compute', `${long} = ?`, Math.pow(b, e), {slowOK:true, mis:v => v === b * e ? 'expTimesBase' : v === Math.pow(e, b) ? 'baseExpSwap' : null})], answerSteps:[1]};
    }
    if (lvl === 2 || Math.random() < 0.4) {
      const z = pick([0, 1]), big = rand(2, 50);
      return {title:'Chimes', ctx:`${big}${SUP(z)}`, bubble:`What is ${big}${SUP(z)}?`, helper:z === 0 ? 'Any number (except 0) to the power 0 is 1.' : 'A number to the power 1 is itself.',
        visual:`<div style="text-align:center; font-size:2rem">🔔 ${big}${SUP(z)}</div>`,
        steps:[numStep('Value', 'concept', `${big}${SUP(z)} = ?`, z === 0 ? 1 : big, {mis:v => z === 0 && (v === 0 || v === big) ? 'zeroExponent' : z === 1 && v === 1 ? 'zeroExponent' : null,
          hint:() => z === 0 ? `${big}³ ÷ ${big} = ${big}², ${big}² ÷ ${big} = ${big}¹, ${big}¹ ÷ ${big} = ?` : 'Just one copy of the number.'})]};
    }
    const bb = rand(2, 5), ee = rand(2, bb === 2 ? 6 : 4), val = Math.pow(bb, ee);
    return {title:'Chimes', ctx:`${bb}^? = ${val}`, bubble:`${bb} to what power is ${val}?`, helper:`Keep multiplying by ${bb} and count.`,
      visual:`<div style="text-align:center; font-size:2rem">🔔 ${bb}<sup>?</sup> = ${val}</div>`,
      steps:[numStep('Exponent', 'concept', `${bb} to the power ? = ${val}`, ee, {mis:v => v * bb === val ? 'expTimesBase' : null, hint:() => `${bb}, ${bb * bb}, ${bb * bb * bb}, … count the ${bb}s.`})]};
  },
  powWhole(lvl){
    const [b, e] = lvl === 1 ? pick([[rand(2, 12), 2], [rand(2, 5), 3]]) : lvl === 2 ? pick([[rand(2, 4), rand(3, 5)], [rand(2, 9), 3], [10, rand(2, 6)]]) : pick([[rand(2, 3), rand(5, 7)], [rand(4, 6), 4], [rand(11, 15), 2], [rand(6, 9), 3]]);
    const val = Math.pow(b, e), steps = [];
    if (lvl === 1 || b === 10) steps.push(numStep('Value', 'compute', `${b}${SUP(e)} = ?`, val, {fact:e === 2 ? fx(b, b) : undefined, mis:v => v === b * e ? 'expTimesBase' : v === Math.pow(e, b) ? 'baseExpSwap' : null,
      hint:() => b === 10 ? `1 followed by ${e} zeros.` : `${Array(e).fill(b).join(' × ')}.`}));
    else { let acc = b; for (let k = 2; k <= e; k++) { const nx = acc * b; steps.push(numStep(`${b}${SUP(k)}`, 'compute', `${acc} × ${b} = ?`, nx, {fact:fx(acc, b), slowOK:nx > 144})); acc = nx; }
      const fin = numStep('The answer', 'compute', `${b}${SUP(e)} = ?`, val, {mis:v => v === b * e ? 'expTimesBase' : v === Math.pow(e, b) ? 'baseExpSwap' : null}); fin.skipIf = () => true; steps.push(fin); }
    return {title:'Chimes', ctx:`${b}${SUP(e)}`, bubble:`The tower bell rings ${b}${SUP(e)} times. How many rings is that?`, helper:'Multiply the base by itself, one time for each count of the exponent.',
      visual:`<div style="text-align:center; font-size:2rem">🔔 ${b}${SUP(e)}</div>`, steps, answerSteps:[steps.length - 1]};
  },
  powFrac(lvl){
    if (Math.random() < 0.5) {
      const d = rand(2, lvl === 1 ? 5 : 9), n = lvl === 1 ? 1 : rand(1, d - 1), e = lvl === 3 ? 3 : 2;
      if (gcd(n, d) !== 1) return CLOCK_GEN.powFrac(lvl);
      const P = Math.pow(n, e), Q = Math.pow(d, e);
      return {title:'Chimes', ctx:`(${n}/${d})${SUP(e)}`, bubble:`What is (${n}/${d})${SUP(e)}?`, helper:'Multiply the fraction by itself: top times top, bottom times bottom.',
        visual:`<div style="text-align:center; font-size:2rem">🔔 (${n}/${d})${SUP(e)}</div>`,
        steps:[{name:'Value', type:'compute', kind:'frac', prompt:`(${n}/${d})${SUP(e)} = ${Array(e).fill(`${n}/${d}`).join(' × ')} = ?`, answer:[0, P, Q], eq:v => FRAC.same(v, P, Q) && FRAC.canon(v),
          mis:v => { if (!FRAC.ok(v)) return null; if (FRAC.same(v, P, Q)) return FRAC.canon(v) ? null : 'notSimplest'; const [a, b] = FRAC.imp(v); return a * d === P * b ? 'expOnlyTop' : a * d === n * e * b ? 'expTimesBase' : null; },
          hint:() => `${Array(e).fill(n).join(' × ')} on top, ${Array(e).fill(d).join(' × ')} on the bottom.`}]};
    }
    const t = lvl === 1 ? rand(1, 9) : lvl === 2 ? rand(1, 9) : rand(11, 19), e = lvl === 3 && t < 10 ? 3 : 2, base = XD.fmt(t, 1);   // t tenths
    const P = Math.pow(t, e), places = e, ans = XD.fmt(P, places);
    return {title:'Chimes', ctx:`${base}${SUP(e)}`, bubble:`What is ${base}${SUP(e)}?`, helper:'Multiply the digits, then count decimal places: each tenth adds one place.',
      visual:`<div style="text-align:center; font-size:2rem">🔔 ${base}${SUP(e)}</div>`,
      steps:[{name:'Value', type:'compute', kind:'num', prompt:`${Array(e).fill(base).join(' × ')} = ?`, answer:ans, eq:XD.eq(P, places), decimal:true, drill:{type:'decimalShift', key:'10'},
        mis:v => XD.eq(P, places)(v) ? null : XD.eq(P, 1)(v) || XD.eq(P, places + 1)(v) ? 'decimalPower' : XD.eq(t * e, 1)(v) ? 'expTimesBase' : null,
        hint:() => `${Array(e).fill(t).join(' × ')} = ${P}. The answer has ${places} decimal places.`}]};
  },
  /* ----- station 2: Gears (order of operations) ----- */
  orderNoExp(lvl){ return ooProblem(OO_NOEXP[lvl - 1], ooFill(lvl), {title:'Gears'}); },
  orderOps(lvl){ return ooProblem(OO_EXP[lvl - 1], ooFill(lvl), {title:'Gears'}); },
  /* ----- station 3: Clock Face (fractions and exponents, comparing powers) ----- */
  orderFracExp(lvl){ return ooFracProblem(lvl); },
  compareExp(lvl){
    let A, B;
    if (lvl === 1) { const b = rand(3, 9), e = pick([2, 3]); A = [b, e]; B = [b, e, 'times']; }
    else if (lvl === 2) { let a, b; do { a = rand(2, 6); b = rand(2, 6); } while (a === b || Math.pow(a, b) > 5000 || Math.pow(b, a) > 5000); A = [a, b]; B = [b, a]; }
    else { const pairs = [[[2, 6], [4, 3]], [[3, 4], [9, 2]], [[2, 5], [3, 3]], [[2, 7], [5, 3]], [[3, 3], [5, 2]], [[2, 8], [4, 4]], [[4, 3], [8, 2]], [[6, 2], [3, 3]], [[7, 2], [2, 6]], [[10, 2], [5, 3]]]; [A, B] = shuffle(pick(pairs)); }
    const vA = Math.pow(A[0], A[1]), vB = B[2] === 'times' ? B[0] * B[1] : Math.pow(B[0], B[1]);
    const tA = `${A[0]}${SUP(A[1])}`, tB = B[2] === 'times' ? `${B[0]} × ${B[1]}` : `${B[0]}${SUP(B[1])}`;
    const right = vA > vB ? '>' : vA < vB ? '<' : '=', fA = A[0] * A[1], fB = B[0] * B[1], fake = fA > fB ? '>' : fA < fB ? '<' : '=';
    const opts = choiceOf({text:right}, ['>', '<', '='].map(t => ({text:t, mis:t === fake ? 'expTimesBase' : null}))).map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`}));
    return {title:'Clock Face', ctx:`${tA} ? ${tB}`, bubble:`Which is bigger: ${tA} or ${tB}?`, helper:'Find the value of each side, then compare.', visual:'',
      steps:[numStep(tA, 'compute', `${tA} = ?`, vA, {slowOK:true, mis:v => v === A[0] * A[1] ? 'expTimesBase' : null}), numStep(tB, 'compute', `${tB} = ?`, vB, {slowOK:true, mis:v => B[2] !== 'times' && v === B[0] * B[1] ? 'expTimesBase' : null}),
        {name:'Compare', type:'concept', kind:'choice', prompt:`${tA} ◯ ${tB}`, options:opts, hint:() => `${tA} = ${vA} and ${tB} = ${vB}.`}], answerSteps:[2]};
  }
};
```
