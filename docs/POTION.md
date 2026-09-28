# 6th grade, shop 6: the Potion Lab

**Status: stations 1 to 4 built (Khan unit 6); stations 5 and 6 (unit 7, equations and inequalities) to come.** Khan Academy 6th grade, Units 6 and 7. The generators are `POTION_GEN` in `src/game/game.js` (stress-tested: 780,000 problems, 20,000 per skill and level; every evaluation checked against an independent calculation, every GCF and LCM, and every expression choice evaluated at several values so exactly one option is equivalent). Read `AGENTS.md` and `NEIGHBORHOODS.md` first. **Edit in place, never rewrite a file.**

The Potion Lab opens after the Ice Rink Unit Test (or with the teacher's "Open the Potion Lab for everyone").

## Stations and skills (Khan's order)

| # | Station | Skills (ids) |
|---|---|---|
| 1 | 🧴 Ingredients | Parts of algebraic expressions (`exprParts`), evaluating with one variable (`evalOne`), with exponents (`evalExp`), with two variables (`evalMulti`) |
| 2 | 📜 Recipe Cards | Writing basic expressions (`writeBasic`), writing expressions with parentheses (`writeExpr`), expression word problems (`writeWord`) |
| 3 | 🥣 Mixing Bowl | Greatest common factor (`gcf`), least common multiple (`lcm`), GCF and LCM word problems (`gcfLcmWord`) |
| 4 | 🫕 Cauldron | Factoring with the distributive property (`factorDist`), distributive property with variables (`distVar`), equivalent expressions (`equivExpr`) |
| 5 | ⚖️ Balance Scale | Unit 7: one-step equations (to be written) |
| 6 | 🚦 Potion Limits | Unit 7: inequalities, dependent and independent variables (to be written) |

## What students get

- **Parts:** how many terms, the constant, the coefficient (x means 1x), and naming an expression by its last operation (3(x + 2) is a product).
- **Evaluating** (`evalProblem`): the expression is written the algebra way (3x², 5(x + y)), and each step shows the substituted expression with the part being worked on highlighted (the Clock Tower's `ooEval`). Level 3 uses fractions for x and y. A wrong final answer is checked against 3x read as 35, x² as 2x, 3x² as (3x)², and working left to right.
- **Writing:** "5 less than n", "the product of 4 and n", "3 times the sum of n and 2", and stories with a letter for the amount that changes. Levels 2 and 3 also find the value. Quizzes ask for the expression.
- **GCF and LCM:** numbers up to 120, with the factors listed in the hint, and word problems that first ask GCF or LCM.
- **Distributive property:** 24 + 36 = 12(2 + 3), 3(x + 4) = 3x + 12, 6x + 9 = 3(2x + 3), and combining like terms. Every wrong choice is tested at several values of x (`exprChoice`, `sameFn`) so it is never secretly equivalent to the right one.

## Mix-ups

New: `termCount`, `coefConstant`, `coefOne`, `exprStructure`, `coefDigits`, `coefInsidePower`, `lessThanOrder`, `missingParens`, `gcfLcmSwap`, `notGreatest`, `notLeast`, `likeTermsWrong`. Reused: `expTimesBase`, `leftToRight`, `wrongOperation`, `distributeWrong`, `notSimplest`, `notMixed`.

## Rewards

The Potion Lab reward set was already in the registry (🐸 Fizz the frog and friends).

## Generator code, stations 1 to 4 (stress-tested)

```js
/* ===== 6th grade, Potion Lab part 1 (Khan unit 6): variables and expressions ===== */
const term = (c, v) => c === 1 ? v : `${c}${v}`;                                              // 1x → x, 3x
/* show an explicit-× expression the way it is written in algebra: 3 × x → 3x, x × y → xy, 3 × ( → 3( */
const algText = src => src.replace(/(\d+) × ([a-z])\b/g, '$1$2').replace(/([a-z]) × ([a-z])\b/g, '$1$2').replace(/(\d+|[a-z]) × \(/g, '$1(')
  .replace(/ \^ (\d)/g, (m, d) => SUP(d)).replace(/\( /g, '(').replace(/ \)/g, ')');
/* evaluate an expression like '3 × x + 2' at vals {x:[5, 1]}: one step per operation, the substituted expression shown with each step */
function evalProblem(src, vals, {title, bubble, helper}){
  const tk = ooParse(src, vals), ev = ooEval(tk);
  if (!ev || ev.steps.some(s => s.r[0] < 0 || s.r[1] > 64 || Math.abs(s.r[0]) > 5000)) return null;
  const val = ev.value, text = algText(src);
  /* wrong answers students really get: 3x read as 35 when x = 5, x² as x × 2, 3x² as (3x)², working left to right */
  const allWhole = Object.values(vals).every(v => v[1] === 1);
  const joined = allWhole ? src.replace(/(\d+) × ([a-z])\b/g, (m, n, v) => `${n}${vals[v][0]}`) : null;
  const inside = src.replace(/(\d+) × ([a-z]) \^ (\d)/g, '( $1 × $2 ) ^ $3');
  const alts = {coefDigits:joined && joined !== src ? ooEval(ooParse(joined, vals)) : null, expTimesBase:ooEval(tk, {expMul:true}),
    coefInsidePower:inside !== src ? ooEval(ooParse(inside, vals)) : null, leftToRight:ooEval(tk, {noPrec:true})};
  const finalMis = w => { for (const [id, e] of Object.entries(alts)) if (e && e.value[0] * w[1] === w[0] * e.value[1] && !(e.value[0] === val[0] && e.value[1] === val[1])) return id; return null; };
  const steps = ev.steps.map((s, k) => rqStep(k === ev.steps.length - 1 ? 'Last step' : `Step ${k + 1}`, `${opWord(s)} = ?`, s.r, {work:ooHTML(s.before, s.lo, s.hi), slowOK:true,
    ...(s.a[1] === 1 && s.b[1] === 1 && s.r[1] === 1 ? {fact:s.op === '×' ? fx(s.a[0], s.b[0]) : s.op === '÷' ? fx(s.b[0], s.r[0], true) : s.op === '^' && s.b[0] === 2 ? fx(s.a[0], s.a[0]) : undefined} : {})}));
  const fin = rqStep('The answer', `${text} = ?`, val, {simplest:true, mis:finalMis}); fin.skipIf = () => true;
  steps.push(fin);
  const given = Object.entries(vals).filter(([k]) => src.includes(k)).map(([k, v]) => `${k} = ${RQ.txt(v)}`).join(' and ');
  return {title, ctx:`${text}, ${given}`, bubble:bubble || `What is ${text} when ${given}?`, helper:helper || 'Put the number in for the letter, then use the order of operations.',
    visual:`<div style="text-align:center; font-size:1.8rem">🧪 ${esc(text)}</div><div style="text-align:center">${esc(given)}</div>`, steps, answerSteps:[steps.length - 1]};
}
const tryGen = f => { for (let t = 0; t < 300; t++) { const p = f(); if (p) return p; } throw new Error('no problem'); };
/* an expression in x (and y) as text plus a function, so options can be checked for equivalence */
const EX = (text, f) => ({text, f});
const sameFn = (f, g) => [1, 2, 3, 5, 7, 0.5].every(x => [1, 4].every(y => Math.abs(f(x, y) - g(x, y)) < 1e-9));
/* choice options from expressions: wrong ones that are secretly equivalent to the right one are dropped */
const exprChoice = (right, wrongs) => choiceOf({text:right.text}, wrongs.filter(w => !sameFn(w.f, right.f)).map(w => ({text:w.text, mis:w.mis})));
const POTION_WORDS = [['🧪', 'drops of dragon dew'], ['🍄', 'glow mushrooms'], ['🪶', 'phoenix feathers'], ['💎', 'crystal shards'], ['🌿', 'moon leaves'], ['🫧', 'bubble beads']];
const POTION_GEN = {
  /* ----- station 1: Ingredients (parts of expressions, evaluating) ----- */
  exprParts(lvl){
    const a = rand(2, 9), b = rand(2, 9), c = rand(2, 20), one = Math.random() < 0.3;
    if (lvl === 1) {
      const nT = pick([2, 3]), text = nT === 2 ? `${term(a, 'x')} + ${c}` : `${term(a, 'x')} + ${term(b, 'y')} + ${c}`, ask = pick(['terms', 'constant']);
      return {title:'Ingredients', ctx:`${text}: ${ask}`, bubble:ask === 'terms' ? `The potion recipe is ${text}. How many terms does it have?` : `The potion recipe is ${text}. What is the constant term?`,
        helper:'Terms are the parts being added. The constant is the term with no letter.', visual:`<div style="text-align:center; font-size:1.8rem">🧪 ${text}</div>`,
        steps:[ask === 'terms' ? numStep('Terms', 'concept', `How many terms are in ${text}?`, nT, {mis:v => v === nT + 1 || v === (nT === 2 ? 1 : 2) ? 'termCount' : null, hint:() => 'Count the parts separated by + signs.'})
          : numStep('Constant', 'concept', `What is the constant term in ${text}?`, c, {mis:v => v === a || v === b ? 'coefConstant' : null, hint:() => 'It is the number standing alone, with no letter.'})]};
    }
    if (lvl === 2) {
      const ca = one ? 1 : a, text = `${term(b, 'y')} + ${term(ca, 'x')} + ${c}`;
      return {title:'Ingredients', ctx:`${text}: coef x`, bubble:`In ${text}, what is the coefficient of x?`, helper:'The coefficient is the number multiplying the letter. x by itself means 1x.',
        visual:`<div style="text-align:center; font-size:1.8rem">🧪 ${text}</div>`,
        steps:[numStep('Coefficient', 'concept', `The coefficient of x in ${text} is ?`, ca, {mis:v => ca === 1 && v === 0 ? 'coefOne' : v === c ? 'coefConstant' : v === b ? 'coefConstant' : null, hint:() => ca === 1 ? 'x means 1 × x.' : `What number is right in front of x?`})]};
    }
    const kinds = [
      [`${a}(x + ${b})`, 'a product of two factors', ['a sum of two terms', `a quotient of ${a} and x`], `${a} is multiplied by the whole (x + ${b}).`],
      [`${term(a, 'x')} + ${b}`, 'a sum of two terms', ['a product of two factors', 'a quotient of two terms'], `${term(a, 'x')} and ${b} are added.`],
      [`(x + ${a}) ÷ ${b}`, 'a quotient of two parts', ['a sum of two terms', 'a product of two factors'], `The whole (x + ${a}) is divided by ${b}.`],
      [`${a}(x − ${b})`, 'a product of two factors', ['a difference of two terms', 'a sum of two terms'], `${a} is multiplied by the whole (x − ${b}).`]];
    const [text, right, wrongs, why] = pick(kinds);
    return {title:'Ingredients', ctx:`${text}: describe`, bubble:`Which words describe ${text}?`, helper:'Look at the last thing you would do: multiply, add, subtract, or divide.',
      visual:`<div style="text-align:center; font-size:1.8rem">🧪 ${text}</div>`,
      steps:[{name:'Describe it', type:'concept', kind:'choice', prompt:`${text} is…`, options:choiceOf({text:right}, wrongs.map(w => ({text:w, mis:'exprStructure'}))), hint:() => why}]};
  },
  evalOne(lvl){
    return tryGen(() => {
      const a = rand(2, 9), b = rand(1, 12), x = lvl === 3 ? pick([RQ.of(1, 2), RQ.of(3, 4), RQ.of(1, 3), RQ.of(2, 5), [rand(2, 9), 1]]) : [rand(2, lvl === 1 ? 10 : 12), 1];
      const srcs = lvl === 1 ? [`${a} × x`, `x + ${b}`, `${a} × x + ${b}`, `x − ${b}`] : [`${a} × x + ${b}`, `${a} × ( x + ${b} )`, `${a} × x − ${b}`, `x ÷ ${a} + ${b}`, `${b} + ${a} × x`];
      let src = pick(srcs);
      if (src.startsWith('x ÷') && x[1] === 1 && x[0] % a) src = `${a} × x + ${b}`;
      return evalProblem(src, {x}, {title:'Ingredients'});
    });
  },
  evalExp(lvl){
    return tryGen(() => {
      const a = rand(2, 6), b = rand(1, 10), x = [rand(2, lvl === 1 ? 6 : 9), 1];
      const srcs = lvl === 1 ? ['x ^ 2', `x ^ 2 + ${b}`, 'x ^ 3'] : lvl === 2 ? [`${a} × x ^ 2`, `x ^ 2 − ${b}`, `( x + ${b} ) ^ 2`, `x ^ 3 + ${b}`] : [`${a} × x ^ 2 + ${b}`, `x ^ 2 − ${a} × x`, `( x − ${a} ) ^ 2 + ${b}`, `${a} × x ^ 2 − x`];
      const src = pick(srcs); if (src.includes('^ 3') && x[0] > 5) return null;
      return evalProblem(src, {x}, {title:'Ingredients', helper:'Put the number in for x. Exponents come before multiplying: 3x² means 3 × x × x.'});
    });
  },
  evalMulti(lvl){
    return tryGen(() => {
      const a = rand(2, 9), b = rand(2, 9);
      const x = lvl === 3 ? pick([RQ.of(1, 2), RQ.of(3, 4), RQ.of(2, 3), [rand(2, 9), 1]]) : [rand(2, 12), 1], y = lvl === 3 ? pick([RQ.of(1, 4), RQ.of(1, 2), [rand(2, 6), 1]]) : [rand(2, 12), 1];
      const srcs = lvl === 1 ? ['x + y', 'x × y', `${a} × x + y`, 'x − y'] : [`${a} × x + ${b} × y`, `x × y − ${a}`, `${a} × x − y`, `x ÷ y + ${a}`, `${a} × ( x + y )`];
      const src = pick(srcs); if (src.includes('x ÷ y') && (x[1] !== 1 || y[1] !== 1 || x[0] % y[0])) return null;
      return evalProblem(src, {x, y}, {title:'Ingredients'});
    });
  },

  /* ----- station 2: Recipe Cards (writing expressions) ----- */
  writeBasic(lvl){
    const n = rand(2, 12), v = pick(['n', 'x', 'p']);
    const T = pick([
      [`${n} more than ${v}`, EX(`${v} + ${n}`, x => x + n), [EX(`${n}${v}`, x => n * x), EX(`${v} − ${n}`, x => x - n)]],
      [`${n} less than ${v}`, EX(`${v} − ${n}`, x => x - n), [{...EX(`${n} − ${v}`, x => n - x), mis:'lessThanOrder'}, EX(`${v} + ${n}`, x => x + n)]],
      [`${v} decreased by ${n}`, EX(`${v} − ${n}`, x => x - n), [{...EX(`${n} − ${v}`, x => n - x), mis:'lessThanOrder'}, EX(`${v} ÷ ${n}`, x => x / n)]],
      [`the product of ${n} and ${v}`, EX(`${n}${v}`, x => n * x), [{...EX(`${n} + ${v}`, x => n + x), mis:'wrongOperation'}, EX(`${v} ÷ ${n}`, x => x / n)]],
      [`${v} divided by ${n}`, EX(`${v} ÷ ${n}`, x => x / n), [{...EX(`${n} ÷ ${v}`, x => n / x), mis:'lessThanOrder'}, {...EX(`${n}${v}`, x => n * x), mis:'wrongOperation'}]],
      [`${n} times ${v}`, EX(`${n}${v}`, x => n * x), [{...EX(`${v} + ${n}`, x => x + n), mis:'wrongOperation'}, EX(`${v}${SUP(n)}`, x => Math.pow(x, n))]],
      [`${v} subtracted from ${n}`, EX(`${n} − ${v}`, x => n - x), [{...EX(`${v} − ${n}`, x => x - n), mis:'lessThanOrder'}, EX(`${n} + ${v}`, x => n + x)]]]);
    const [words, right, wrongs] = T, g = pick(POTION_WORDS);
    const steps = [{name:'Write it', type:'concept', kind:'choice', prompt:`Which expression means "${words}"?`, options:exprChoice(right, wrongs.map(w => ({...w, mis:w.mis || null}))),
      hint:() => /less than|subtracted from/.test(words) ? 'Careful with order: "5 less than n" starts with n and takes 5 away.' : 'Find the operation word, then put the numbers in order.'}];
    if (lvl >= 2) { const val = rand(2, 12) * (words.includes('divided') ? n : 1), out = right.f(val); if (out >= 0 && Number.isInteger(out)) steps.push(numStep('Value', 'compute', `${right.text} when ${v} = ${val}`, out, {})); }
    return {title:'Recipe Cards', ctx:`"${words}"`, bubble:`The recipe card says the number of ${g[1]} is "${words}." Which expression matches?${steps.length > 1 ? ' Then find its value.' : ''}`, helper:'More, sum, added: +. Less, difference, decreased: −. Times, product: ×. Divided, quotient: ÷.',
      visual:`<div style="text-align:center; font-size:1.6rem">${g[0]} "${words}"</div>`, steps, ...(steps.length > 1 ? {answerSteps:[0]} : {})};
  },
  writeExpr(lvl){
    const a = rand(2, 9), b = rand(2, 12), v = 'n';
    const T = pick([
      [`${a} times the sum of ${v} and ${b}`, EX(`${a}(${v} + ${b})`, x => a * (x + b)), [{...EX(`${a}${v} + ${b}`, x => a * x + b), mis:'missingParens'}, EX(`${a} + ${v} + ${b}`, x => a + x + b)]],
      [`${b} less than ${a} times ${v}`, EX(`${a}${v} − ${b}`, x => a * x - b), [{...EX(`${b} − ${a}${v}`, x => b - a * x), mis:'lessThanOrder'}, {...EX(`${a}(${v} − ${b})`, x => a * (x - b)), mis:'missingParens'}]],
      [`the sum of ${v} and ${b}, divided by ${a}`, EX(`(${v} + ${b}) ÷ ${a}`, x => (x + b) / a), [{...EX(`${v} + ${b} ÷ ${a}`, x => x + b / a), mis:'missingParens'}, EX(`${a} ÷ (${v} + ${b})`, x => a / (x + b))]],
      [`${a} times the difference of ${v} and ${b}`, EX(`${a}(${v} − ${b})`, x => a * (x - b)), [{...EX(`${a}${v} − ${b}`, x => a * x - b), mis:'missingParens'}, EX(`${a}(${b} − ${v})`, x => a * (b - x))]],
      [`${b} more than the quotient of ${v} and ${a}`, EX(`${v} ÷ ${a} + ${b}`, x => x / a + b), [{...EX(`(${v} + ${b}) ÷ ${a}`, x => (x + b) / a), mis:'missingParens'}, EX(`${a} ÷ ${v} + ${b}`, x => a / x + b)]],
      [`the product of ${a} and ${v}, plus ${b}`, EX(`${a}${v} + ${b}`, x => a * x + b), [{...EX(`${a}(${v} + ${b})`, x => a * (x + b)), mis:'missingParens'}, EX(`${a} + ${b}${v}`, x => a + b * x)]]]);
    const [words, right, wrongs] = T;
    const steps = [{name:'Write it', type:'concept', kind:'choice', prompt:`Which expression means "${words}"?`, options:exprChoice(right, wrongs.map(w => ({...w, mis:w.mis || null}))),
      hint:() => /sum of|difference of/.test(words) && /times/.test(words) ? '"Times the sum" means the whole sum is multiplied: use parentheses.' : 'Decide what happens first and what happens last.'}];
    if (lvl >= 2) { let val = rand(b + 1, 20); if (words.includes('quotient') || words.includes('divided')) { val = a * rand(2, 8) - (words.includes('sum') ? b : 0); if (val <= 0) val += a * 3; } const out = right.f(val);
      if (out >= 0 && Number.isInteger(out)) steps.push(numStep('Value', 'compute', `${right.text} when n = ${val}`, out, {slowOK:true})); }
    return {title:'Recipe Cards', ctx:`"${words}"`, bubble:`The spell book says: "${words}". Which expression matches?${steps.length > 1 ? ' Then find its value.' : ''}`, helper:'Words like "the sum of" and "the difference of" group two things together: use parentheses.',
      visual:`<div style="text-align:center; font-size:1.5rem">📜 "${words}"</div>`, steps, ...(steps.length > 1 ? {answerSteps:[0]} : {})};
  },
  writeWord(lvl){
    const [e, n] = pick(LEMON_KIDS), g = pick(POTION_WORDS), a = rand(2, 9), b = rand(10, 40);
    const T = pick(lvl === 1 ? [
      [`${n} had ${b} ${g[1]} and found d more.`, 'd', EX(`${b} + d`, x => b + x), [{...EX(`${b}d`, x => b * x), mis:'wrongOperation'}, {...EX(`${b} − d`, x => b - x), mis:'wrongOperation'}]],
      [`Each potion uses ${a} ${g[1]}. ${n} makes p potions.`, 'p', EX(`${a}p`, x => a * x), [{...EX(`${a} + p`, x => a + x), mis:'wrongOperation'}, EX(`p ÷ ${a}`, x => x / a)]],
      [`${n} shares c ${g[1]} equally among ${a} cauldrons.`, 'c', EX(`c ÷ ${a}`, x => x / a), [{...EX(`${a} ÷ c`, x => a / x), mis:'lessThanOrder'}, {...EX(`${a}c`, x => a * x), mis:'wrongOperation'}]],
      [`${n} had ${b} ${g[1]} and used u of them.`, 'u', EX(`${b} − u`, x => b - x), [{...EX(`u − ${b}`, x => x - b), mis:'lessThanOrder'}, {...EX(`${b} + u`, x => b + x), mis:'wrongOperation'}]]] : [
      [`${n} has $${b}. Each bottle costs $${a}. ${n} buys k bottles.`, 'k', EX(`${b} − ${a}k`, x => b - a * x), [{...EX(`${a}k − ${b}`, x => a * x - b), mis:'lessThanOrder'}, {...EX(`(${b} − ${a})k`, x => (b - a) * x), mis:'missingParens'}]],
      [`A cauldron holds ${b} ${g[1]}. ${n} adds ${a} more to each of m cauldrons.`, 'm', EX(`(${b} + ${a})m`, x => (b + a) * x), [{...EX(`${b} + ${a}m`, x => b + a * x), mis:'missingParens'}, EX(`${b}m + ${a}`, x => b * x + a)]],
      [`${n} pours ${b} drops, then ${a} drops for every spell s.`, 's', EX(`${b} + ${a}s`, x => b + a * x), [{...EX(`(${b} + ${a})s`, x => (b + a) * x), mis:'missingParens'}, EX(`${b}s + ${a}`, x => b * x + a)]]]);
    const [story, v, right, wrongs] = T;
    const steps = [{name:'Write it', type:'concept', kind:'choice', prompt:'Which expression matches the story?', options:exprChoice(right, wrongs), drill:{type:'story', key:'addSub'}, hint:() => 'What happens to the starting amount? What changes with the letter?'}];
    if (lvl >= 2) { let val, out; for (let t = 0; t < 20; t++) { val = rand(2, 9); out = right.f(val); if (out >= 0 && Number.isInteger(out)) break; } if (out >= 0 && Number.isInteger(out)) steps.push(numStep('Value', 'compute', `${right.text} when ${v} = ${val}`, out, {slowOK:true})); }
    return {title:'Recipe Cards', ctx:story, bubble:`${story} Which expression shows how many?${steps.length > 1 ? ' Then find its value.' : ''}`, helper:'The letter stands for the number that can change.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${g[0]}</div>`, steps, ...(steps.length > 1 ? {answerSteps:[0]} : {})};
  },

  /* ----- station 3: Mixing Bowl (GCF and LCM) ----- */
  gcf(lvl){
    let a, b, G; do { G = rand(2, lvl === 1 ? 6 : lvl === 2 ? 12 : 15); const m = rand(2, lvl === 1 ? 5 : 8); let k; do { k = rand(2, lvl === 1 ? 5 : 8); } while (gcd(m, k) !== 1 || k === m); a = G * m; b = G * k; } while (a > (lvl === 3 ? 120 : 60) || b > (lvl === 3 ? 120 : 60));
    const L = a * b / G, smaller = [...Array(G).keys()].map(i => i + 1).filter(d => G % d === 0 && d < G && d > 1);
    return {title:'Mixing Bowl', ctx:`GCF(${a}, ${b})`, bubble:`What is the greatest common factor of ${a} and ${b}?`, helper:'List the factors of each number. The biggest one on both lists is the GCF.',
      visual:`<div style="text-align:center; font-size:1.8rem">🥣 ${a} and ${b}</div>`,
      steps:[numStep('GCF', 'compute', `GCF of ${a} and ${b} = ?`, G, {drill:{type:'factors', key:'pairs'}, mis:v => v === L || v === a * b ? 'gcfLcmSwap' : smaller.includes(v) ? 'notGreatest' : null, hint:() => `Factors of ${a}: ${factorsOf(a).join(', ')}.`})]};
  },
  lcm(lvl){
    let a, b; do { a = rand(2, lvl === 1 ? 10 : 12); b = rand(2, lvl === 1 ? 10 : lvl === 2 ? 12 : 18); } while (a === b || a % b === 0 && lvl > 1 || b % a === 0 && lvl > 1 || (lvl === 3 && gcd(a, b) === 1));
    const G = gcd(a, b), L = a * b / G;
    return {title:'Mixing Bowl', ctx:`LCM(${a}, ${b})`, bubble:`What is the least common multiple of ${a} and ${b}?`, helper:'Count by each number. The first number on both lists is the LCM.',
      visual:`<div style="text-align:center; font-size:1.8rem">🥣 ${a} and ${b}</div>`,
      steps:[numStep('LCM', 'compute', `LCM of ${a} and ${b} = ?`, L, {mis:v => v === G && G !== L ? 'gcfLcmSwap' : v === a * b && G > 1 ? 'notLeast' : v % a === 0 && v % b === 0 && v > L ? 'notLeast' : null,
        hint:() => `Multiples of ${Math.max(a, b)}: ${[1, 2, 3, 4, 5].map(k => k * Math.max(a, b)).join(', ')}, …`})]};
  },
  gcfLcmWord(lvl){
    const useG = Math.random() < 0.5, [e, n] = pick(LEMON_KIDS);
    let a, b, story, ans;
    if (useG) { const G = rand(2, lvl === 1 ? 6 : 12); let m, k; do { m = rand(2, 7); k = rand(2, 7); } while (gcd(m, k) !== 1 || m === k); a = G * m; b = G * k; ans = G;
      story = pick([`${n} has ${a} glow mushrooms and ${b} moon leaves. ${n} wants to make identical potion kits with no leftovers. What is the greatest number of kits?`, `There are ${a} red crystals and ${b} blue crystals to put in matching bags, with none left over. What is the greatest number of bags?`]); }
    else { do { a = rand(3, lvl === 1 ? 8 : 12); b = rand(3, lvl === 1 ? 8 : 12); } while (a === b || a % b === 0 || b % a === 0); ans = a * b / gcd(a, b);
      story = pick([`Feathers come in packs of ${a} and bottles come in packs of ${b}. ${n} wants the same number of each. What is the least number of each ${n} can buy?`, `One potion bubbles every ${a} minutes and another every ${b} minutes. They just bubbled together. In how many minutes will they bubble together again?`]); }
    const opts = choiceOf({text:useG ? 'Greatest common factor (GCF)' : 'Least common multiple (LCM)'}, [{text:useG ? 'Least common multiple (LCM)' : 'Greatest common factor (GCF)', mis:'gcfLcmSwap'}]);
    const G = gcd(a, b), L = a * b / G;
    return {title:'Mixing Bowl', ctx:`${useG ? 'GCF' : 'LCM'} ${a}, ${b}`, bubble:story, helper:'Splitting into equal groups: GCF. Things lining up again, or buying equal amounts: LCM.',
      visual:`<div style="text-align:center; font-size:1.8rem">${e} ${a} and ${b}</div>`,
      steps:[{name:'GCF or LCM?', type:'concept', kind:'choice', prompt:'Which one answers the question?', options:opts, drill:{type:'story', key:'ratio'}, hint:() => useG ? 'You are splitting into the most equal groups.' : 'You need a number both of them reach.'},
        numStep(useG ? 'GCF' : 'LCM', 'compute', `${useG ? 'GCF' : 'LCM'} of ${a} and ${b} = ?`, ans, {mis:v => useG ? (v === L ? 'gcfLcmSwap' : null) : (v === G ? 'gcfLcmSwap' : v === a * b && G > 1 ? 'notLeast' : null)})], answerSteps:[1]};
  },

  /* ----- station 4: Cauldron (distributive property, equivalent expressions) ----- */
  factorDist(lvl){
    let a, b, G; do { G = rand(2, lvl === 1 ? 6 : 12); const m = rand(2, 9); let k; do { k = rand(2, 9); } while (gcd(m, k) !== 1 || k === m); a = G * m; b = G * k; } while (a > 100 || b > 100);
    const [p, q] = [a / G, b / G], d = [...Array(G).keys()].map(i => i + 1).find(x => x > 1 && x < G && G % x === 0);
    const right = `${G}(${p} + ${q})`, wrongs = [{text:`${G}(${a} + ${b})`, mis:'distributeWrong'}, {text:`${G}(${p} + ${b})`, mis:'distributeWrong'}];
    if (d) wrongs.push({text:`${d}(${a / d} + ${b / d})`, mis:'notGreatest'});
    return {title:'Cauldron', ctx:`${a} + ${b} = ${right}`, bubble:`Write ${a} + ${b} as the GCF times a sum.`, helper:'Find the GCF, then divide each number by it.', visual:`<div style="text-align:center; font-size:1.8rem">🫕 ${a} + ${b}</div>`,
      steps:[numStep('GCF', 'compute', `GCF of ${a} and ${b} = ?`, G, {mis:v => d && G % v === 0 && v < G && v > 1 ? 'notGreatest' : null}), numStep(`${a} ÷ ${G}`, 'compute', `${a} ÷ ${G} = ?`, p, {fact:fx(G, p, true)}), numStep(`${b} ÷ ${G}`, 'compute', `${b} ÷ ${G} = ?`, q, {fact:fx(G, q, true)}),
        {name:'Factored', type:'concept', kind:'choice', prompt:`${a} + ${b} = ?`, options:choiceOf({text:right}, wrongs), hint:() => `${G} × ${p} = ${a} and ${G} × ${q} = ${b}.`}], answerSteps:[3]};
  },
  distVar(lvl){
    const a = rand(2, 9), b = rand(1, 9), c = rand(2, 5), v = pick(['x', 'n', 'y']);
    if (lvl === 3) {
      const G = rand(2, 6); let m, k; do { m = rand(2, 7); k = rand(1, 7); } while (gcd(m, k) !== 1);
      const text = `${term(G * m, v)} + ${G * k}`, right = EX(`${G}(${term(m, v)} + ${k})`, x => G * (m * x + k));
      const wrongs = [{...EX(`${G}(${term(G * m, v)} + ${G * k})`, x => G * (G * m * x + G * k)), mis:'distributeWrong'}, {...EX(`${G}(${term(m, v)} + ${G * k})`, x => G * (m * x + G * k)), mis:'distributeWrong'}, {...EX(`${term(G * m + G * k, v)}`, x => (G * m + G * k) * x), mis:'likeTermsWrong'}];
      return {title:'Cauldron', ctx:`factor ${text}`, bubble:`Factor ${text} using the greatest common factor.`, helper:'Find the GCF of the numbers, then divide each term by it.', visual:`<div style="text-align:center; font-size:1.8rem">🫕 ${text}</div>`,
        steps:[numStep('GCF', 'compute', `GCF of ${G * m} and ${G * k} = ?`, G, {mis:v2 => v2 > 1 && G % v2 === 0 && v2 < G ? 'notGreatest' : null}), {name:'Factored', type:'concept', kind:'choice', prompt:`${text} = ?`, options:exprChoice(right, wrongs), hint:() => `${G} × ${term(m, v)} = ${term(G * m, v)}, and ${G} × ${k} = ${G * k}.`}], answerSteps:[1]};
    }
    const inner = lvl === 1 ? `${v} + ${b}` : `${term(c, v)} + ${b}`, cv = lvl === 1 ? 1 : c;
    const text = `${a}(${inner})`, right = EX(`${term(a * cv, v)} + ${a * b}`, x => a * (cv * x + b));
    const wrongs = [{...EX(`${term(a * cv, v)} + ${b}`, x => a * cv * x + b), mis:'distributeWrong'}, {...EX(`${term(cv, v)} + ${a * b}`, x => cv * x + a * b), mis:'distributeWrong'}, {...EX(`${term(a * cv + a * b, v)}`, x => (a * cv + a * b) * x), mis:'likeTermsWrong'}];
    return {title:'Cauldron', ctx:`expand ${text}`, bubble:`Rewrite ${text} without parentheses.`, helper:'Multiply the number outside by every term inside.', visual:`<div style="text-align:center; font-size:1.8rem">🫕 ${text}</div>`,
      steps:[numStep(`${a} × ${term(cv, v)}`, 'compute', `${a} × ${term(cv, v)} = ?${v}`, a * cv, {fact:fx(a, cv)}), numStep(`${a} × ${b}`, 'compute', `${a} × ${b} = ?`, a * b, {fact:fx(a, b)}),
        {name:'Expanded', type:'concept', kind:'choice', prompt:`${text} = ?`, options:exprChoice(right, wrongs), hint:() => `${a} × ${term(cv, v)} and ${a} × ${b}.`}], answerSteps:[2]};
  },
  equivExpr(lvl){
    const a = rand(2, 7), b = rand(2, 7), c = rand(1, 9), k = rand(2, 5);
    const T = lvl === 1 ? [`${term(a, 'x')} + ${term(b, 'x')}`, EX(`${term(a + b, 'x')}`, x => (a + b) * x), [{...EX(`${term(a * b, 'x')}`, x => a * b * x), mis:'likeTermsWrong'}, {...EX(`${a + b}x²`, x => (a + b) * x * x), mis:'likeTermsWrong'}, EX(`${term(a + b + 1, 'x')}`, x => (a + b + 1) * x)]]
      : lvl === 2 ? [`${term(a, 'x')} + ${c} + ${term(b, 'x')}`, EX(`${term(a + b, 'x')} + ${c}`, x => (a + b) * x + c), [{...EX(`${term(a + b + c, 'x')}`, x => (a + b + c) * x), mis:'likeTermsWrong'}, {...EX(`${term(a * b, 'x')} + ${c}`, x => a * b * x + c), mis:'likeTermsWrong'}, EX(`${term(a + b, 'x')} + ${c + 1}`, x => (a + b) * x + c + 1)]]
      : [`${k}(x + ${c}) + ${term(a, 'x')}`, EX(`${term(k + a, 'x')} + ${k * c}`, x => (k + a) * x + k * c), [{...EX(`${term(k + a, 'x')} + ${c}`, x => (k + a) * x + c), mis:'distributeWrong'}, {...EX(`${term(a + 1, 'x')} + ${k * c}`, x => (a + 1) * x + k * c), mis:'distributeWrong'}, {...EX(`${term(k + a + k * c, 'x')}`, x => (k + a + k * c) * x), mis:'likeTermsWrong'}]];
    const [text, right, wrongs] = T;
    return {title:'Cauldron', ctx:`equiv ${text}`, bubble:`Which expression is equivalent to ${text}?`, helper:'Combine like terms: x-terms with x-terms, numbers with numbers.', visual:`<div style="text-align:center; font-size:1.8rem">🫕 ${text}</div>`,
      steps:[{name:'Equivalent', type:'concept', kind:'choice', prompt:`${text} = ?`, options:exprChoice(right, wrongs), hint:() => lvl === 3 ? 'Distribute first, then combine the x-terms.' : 'Only terms with the same letter can be combined.'}]};
  }
};
const factorsOf = n => [...Array(n).keys()].map(i => i + 1).filter(d => n % d === 0);
```
