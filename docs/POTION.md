# 6th grade, shop 6: the Potion Lab

**Status: built (all 6 stations).** Stations 1 to 4 are Khan unit 6 (`POTION_GEN`); stations 5 and 6 are unit 7 (`POTION2_GEN`, stress-tested: 420,000 problems; every solution checked by putting it back in the equation, every inequality choice tested). Khan Academy 6th grade, Units 6 and 7. The generators are `POTION_GEN` in `src/game/game.js` (stress-tested: 780,000 problems, 20,000 per skill and level; every evaluation checked against an independent calculation, every GCF and LCM, and every expression choice evaluated at several values so exactly one option is equivalent). Read `AGENTS.md` and `NEIGHBORHOODS.md` first. **Edit in place, never rewrite a file.**

The Potion Lab opens after the Ice Rink Unit Test (or with the teacher's "Open the Potion Lab for everyone").

## Stations and skills (Khan's order)

| # | Station | Skills (ids) |
|---|---|---|
| 1 | 🧴 Ingredients | Parts of algebraic expressions (`exprParts`), evaluating with one variable (`evalOne`), with exponents (`evalExp`), with two variables (`evalMulti`) |
| 2 | 📜 Recipe Cards | Writing basic expressions (`writeBasic`), writing expressions with parentheses (`writeExpr`), expression word problems (`writeWord`) |
| 3 | 🥣 Mixing Bowl | Greatest common factor (`gcf`), least common multiple (`lcm`), GCF and LCM word problems (`gcfLcmWord`) |
| 4 | 🫕 Cauldron | Factoring with the distributive property (`factorDist`), distributive property with variables (`distVar`), equivalent expressions (`equivExpr`) |
| 5 | ⚖️ Balance Scale | Testing solutions to equations (`testSol`), one-step + and − equations (`oneStepAdd`), one-step × and ÷ equations (`oneStepMult`), modeling with one-step equations (`eqModel`) |
| 6 | 🚦 Potion Limits | Testing solutions to inequalities (`testIneq`), plotting inequalities (`plotIneq`), dependent and independent variables (`depIndep`) |

## What students get

- **Parts:** how many terms, the constant, the coefficient (x means 1x), and naming an expression by its last operation (3(x + 2) is a product).
- **Evaluating** (`evalProblem`): the expression is written the algebra way (3x², 5(x + y)), and each step shows the substituted expression with the part being worked on highlighted (the Clock Tower's `ooEval`). Level 3 uses fractions for x and y. A wrong final answer is checked against 3x read as 35, x² as 2x, 3x² as (3x)², and working left to right.
- **Writing:** "5 less than n", "the product of 4 and n", "3 times the sum of n and 2", and stories with a letter for the amount that changes. Levels 2 and 3 also find the value. Quizzes ask for the expression.
- **GCF and LCM:** numbers up to 120, with the factors listed in the hint, and word problems that first ask GCF or LCM.
- **Equations (station 5):** a balance picture (`balanceHTML`), "what do you do to both sides?" before solving, decimals on level 3 of + and −, fraction coefficients like (2/3)x = 8 on level 3 of × and ÷ (with the reciprocal pop-up), and stories that pick the equation first.
- **Inequalities (station 6):** testing values (is 5 a solution of x > 5?), picking the graph (`ineqSVG`: open circle for < and >, filled for ≤ and ≥, and an arrow), temperature stories with "at least" and "at most", and dependent vs. independent variables with an x–y table (fill in a missing value, then pick the rule).
- **Distributive property:** 24 + 36 = 12(2 + 3), 3(x + 4) = 3x + 12, 6x + 9 = 3(2x + 3), and combining like terms. Every wrong choice is tested at several values of x (`exprChoice`, `sameFn`) so it is never secretly equivalent to the right one.

## Mix-ups

New: `termCount`, `coefConstant`, `coefOne`, `exprStructure`, `coefDigits`, `coefInsidePower`, `lessThanOrder`, `missingParens`, `gcfLcmSwap`, `notGreatest`, `notLeast`, `likeTermsWrong`. Reused: `expTimesBase`, `leftToRight`, `wrongOperation`, `distributeWrong`, `notSimplest`, `notMixed`. Stations 5 and 6 add `solutionIsTotal`, `inverseWrong`, `boundaryWrong`, `ineqDirection`, `circleWrong`, `depIndepSwap` (and reuse `patternWrongRule`).

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

## Generator code, stations 5 and 6 (stress-tested)

```js
/* ===== 6th grade, Potion Lab part 2 (Khan unit 7): equations and inequalities ===== */
const balanceHTML = (left, right) => `<div class="balance"><span class="pan-l">${esc(left)}</span><span class="beam">⚖️</span><span class="pan-r">${esc(right)}</span></div>`;
/* an inequality on a number line: circle at c (filled for ≤ ≥, open for < >) and a ray in its direction */
function ineqSVG(op, c, {lo = c - 5, hi = c + 5, w = 280} = {}){
  const L = 16, R = w - 16, y = 26, step = (R - L) / (hi - lo), X = t => L + (t - lo) * step, right = op === '>' || op === '≥', closed = op === '≥' || op === '≤';
  let g = `<line x1="${L - 8}" y1="${y}" x2="${R + 8}" y2="${y}" class="nl-line"/>`;
  for (let t = lo; t <= hi; t++) { g += `<line x1="${X(t)}" y1="${y - 6}" x2="${X(t)}" y2="${y + 6}" class="nl-line"/>`; if ((t - lo) % 2 === 0 || t === c) g += `<text x="${X(t)}" y="${y + 22}" class="nl-text nl-small">${sgn(t)}</text>`; }
  g += `<line x1="${X(c)}" y1="${y}" x2="${right ? R + 6 : L - 6}" y2="${y}" class="nl-ray"/><path d="${right ? `M${R + 10} ${y} l-10 -7 v14 z` : `M${L - 10} ${y} l10 -7 v14 z`}" class="nl-ray-head"/>`;
  g += `<circle cx="${X(c)}" cy="${y}" r="7" class="${closed ? 'nl-dot' : 'nl-open'}"/>`;
  return `<svg class="num-line ineq" viewBox="0 0 ${w} 56" width="${w}" role="img" aria-label="x ${op} ${c}">${g}</svg>`;
}
const INEQ_FLIP = {'>':'<', '<':'>', '≥':'≤', '≤':'≥'}, INEQ_OPEN = {'>':'≥', '≥':'>', '<':'≤', '≤':'<'};
const ineqTrue = (x, op, c) => op === '>' ? x > c : op === '<' ? x < c : op === '≥' ? x >= c : x <= c;
/* one-step equation shapes: [text, solve, inverse words, the answer you get by doing the wrong thing] */
const EQ_FORMS = {
  add: (a, x) => [`x + ${a} = ${x + a}`, `Subtract ${a} from both sides`, `Add ${a} to both sides`, x + 2 * a],
  addL: (a, x) => [`${a} + x = ${x + a}`, `Subtract ${a} from both sides`, `Add ${a} to both sides`, x + 2 * a],
  sub: (a, x) => [`x ${MINUS} ${a} = ${x - a}`, `Add ${a} to both sides`, `Subtract ${a} from both sides`, x - 2 * a],
  mul: (a, x) => [`${a}x = ${a * x}`, `Divide both sides by ${a}`, `Multiply both sides by ${a}`, a * a * x],
  div: (a, x) => [`x ÷ ${a} = ${x / a}`, `Multiply both sides by ${a}`, `Divide both sides by ${a}`, x / (a * a)]
};
const POTION2_GEN = {
  /* ----- station 5: Balance Scale (one-step equations) ----- */
  testSol(lvl){
    const a = rand(2, 9), b = rand(1, 15), x = rand(1, 10), kind = pick(lvl === 1 ? ['add', 'mul'] : ['lin', 'lin', 'mul', 'sub']);
    const [text, f] = kind === 'add' ? [`x + ${b} = ${x + b}`, v => v + b] : kind === 'mul' ? [`${a}x = ${a * x}`, v => a * v] : kind === 'sub' ? [`${a}x ${MINUS} ${b} = ${a * x - b}`, v => a * v - b] : [`${a}x + ${b} = ${a * x + b}`, v => a * v + b];
    if (kind === 'sub' && a * x - b < 0) return POTION2_GEN.testSol(lvl);
    const target = Number(text.split(' = ')[1]);
    if (lvl === 1) {
      const tryV = Math.random() < 0.5 ? x : x + pick([-1, 1, 2]) || x + 1, out = f(tryV), yes = out === target;
      const lhs = text.split(' = ')[0].replace(/(\d+)x/, `$1(${tryV})`).replace(/^x/, String(tryV));
      return {title:'Balance Scale', ctx:`${text}, x = ${tryV}`, bubble:`Is x = ${tryV} a solution of ${text}?`, helper:'Put the number in for x. If both sides are equal, it is a solution.', visual:balanceHTML(text.split(' = ')[0], text.split(' = ')[1]),
        steps:[numStep('Put it in', 'compute', `${lhs} = ?`, out, {hint:() => `Replace x with ${tryV}.`}),
          {name:'Solution?', type:'concept', kind:'choice', prompt:`Is x = ${tryV} a solution?`, options:choiceOf({text:yes ? 'Yes' : 'No'}, [{text:yes ? 'No' : 'Yes'}]), hint:() => `Does ${out} equal ${target}?`}], answerSteps:[1]};
    }
    const cands = shuffle([...new Set([x, x + 1, x - 1, x + 2, target, Math.max(0, x - 2)])].filter(v => v >= 0 && (v === x || f(v) !== target))).slice(0, 3);
    if (!cands.includes(x)) cands[0] = x;
    const opts = shuffle(cands).map(v => ({html:`x = ${v}`, text:`x = ${v}`, ok:v === x, mis:v === target && v !== x ? 'solutionIsTotal' : null}));
    return {title:'Balance Scale', ctx:`${text}: which x`, bubble:`Which value of x makes ${text} true?`, helper:'Try each value in the equation.', visual:balanceHTML(text.split(' = ')[0], text.split(' = ')[1]),
      steps:[{name:'Which value', type:'concept', kind:'choice', prompt:`Which one is a solution of ${text}?`, options:opts, hint:() => `Put each value in for x and check if the left side is ${target}.`}]};
  },
  oneStepAdd(lvl){
    if (lvl === 3) {
      const a = rand(11, 99) / 10, x = rand(11, 99) / 10, sub = Math.random() < 0.5, A = sgnD(a), rhs = sub ? x - a : x + a;
      if (rhs <= 0) return POTION2_GEN.oneStepAdd(lvl);
      const text = sub ? `x ${MINUS} ${A} = ${sgnD(rhs)}` : `x + ${A} = ${sgnD(rhs)}`, xi = Math.round(x * 10);
      return {title:'Balance Scale', ctx:text, bubble:`Solve ${text}.`, helper:'Do the opposite operation to both sides.', visual:balanceHTML(text.split(' = ')[0], text.split(' = ')[1]),
        steps:[{name:'Undo it', type:'concept', kind:'choice', prompt:'What do you do to both sides?', options:choiceOf({text:sub ? `Add ${A}` : `Subtract ${A}`}, [{text:sub ? `Subtract ${A}` : `Add ${A}`, mis:'inverseWrong'}]), hint:() => sub ? `x had ${A} taken away. Add it back.` : `${A} was added to x. Take it away.`},
          {name:'Solve', type:'compute', kind:'num', prompt:`x = ${sgnD(rhs)} ${sub ? '+' : MINUS} ${A} = ?`, answer:sgnD(x), eq:XD.eq(xi, 1), decimal:true, mis:v => XD.eq(xi, 1)(v) ? null : Math.abs(v - (sub ? rhs - a : rhs + a)) < 1e-9 ? 'inverseWrong' : null}], answerSteps:[1]};
    }
    const form = pick(['add', 'addL', 'sub']), a = rand(2, lvl === 1 ? 15 : 60), x = rand(lvl === 1 ? 1 : 10, lvl === 1 ? 20 : 90);
    if (form === 'sub' && x - a < 0) return POTION2_GEN.oneStepAdd(lvl);
    const [text, right, wrong, wrongX] = EQ_FORMS[form](a, x), rhs = text.split(' = ')[1];
    return {title:'Balance Scale', ctx:text, bubble:`Solve ${text}.`, helper:'Keep the scale balanced: whatever you do to one side, do to the other.', visual:balanceHTML(text.split(' = ')[0], rhs),
      steps:[{name:'Undo it', type:'concept', kind:'choice', prompt:'What do you do to both sides?', options:choiceOf({text:right}, [{text:wrong, mis:'inverseWrong'}]), hint:() => form === 'sub' ? `x had ${a} taken away. Add it back.` : `${a} was added to x. Take it away.`},
        numStep('Solve', 'compute', `x = ${rhs} ${form === 'sub' ? '+' : MINUS} ${a} = ?`, x, {mis:v => v === wrongX ? 'inverseWrong' : null})], answerSteps:[1]};
  },
  oneStepMult(lvl){
    if (lvl === 3 && Math.random() < 0.6) {
      const [p, q] = pick([[1, 2], [2, 3], [3, 4], [1, 3], [3, 5], [2, 5]]), k = rand(2, 9), x = q * k, rhs = p * k;
      const text = `(${p}/${q})x = ${rhs}`;
      return {title:'Balance Scale', ctx:text, bubble:`Solve ${text}.`, helper:`Undo multiplying by ${p}/${q}: divide by ${p}/${q}, which is the same as multiplying by ${q}/${p}.`, visual:balanceHTML(`${p}/${q} × x`, String(rhs)),
        steps:[{name:'Undo it', type:'concept', kind:'choice', prompt:'What do you do to both sides?', options:choiceOf({text:`Multiply by ${q}/${p}`}, [{text:`Multiply by ${p}/${q}`, mis:'inverseWrong'}, {text:`Subtract ${p}/${q}`, mis:'inverseWrong'}]), drill:{type:'reciprocal', key:'flip'}, hint:() => `${q}/${p} is the reciprocal of ${p}/${q}.`},
          numStep('Solve', 'compute', `x = ${rhs} × ${q}/${p} = ?`, x, {mis:v => Math.abs(v - rhs * p / q) < 1e-9 ? 'inverseWrong' : null, hint:() => `${rhs} ÷ ${p} × ${q}.`})], answerSteps:[1]};
    }
    const form = pick(['mul', 'mul', 'div']), a = rand(2, lvl === 1 ? 9 : 12), x = form === 'div' ? a * rand(1, lvl === 1 ? 9 : 12) : rand(1, lvl === 1 ? 10 : 25);
    const [text, right, wrong, wrongX] = EQ_FORMS[form](a, x), rhs = text.split(' = ')[1];
    return {title:'Balance Scale', ctx:text, bubble:`Solve ${text}.`, helper:form === 'mul' ? `${a}x means ${a} times x. Divide both sides by ${a}.` : `x was divided by ${a}. Multiply both sides by ${a}.`, visual:balanceHTML(text.split(' = ')[0], rhs),
      steps:[{name:'Undo it', type:'concept', kind:'choice', prompt:'What do you do to both sides?', options:choiceOf({text:right}, [{text:wrong, mis:'inverseWrong'}, {text:form === 'mul' ? `Subtract ${a} from both sides` : `Add ${a} to both sides`, mis:'inverseWrong'}]), hint:() => 'Do the opposite operation.'},
        numStep('Solve', 'compute', `x = ${rhs} ${form === 'mul' ? '÷' : '×'} ${a} = ?`, x, {fact:form === 'mul' ? fx(a, x, true) : fx(a, x / a), mis:v => v === wrongX ? 'inverseWrong' : form === 'mul' && v === Number(rhs) - a ? 'inverseWrong' : null})], answerSteps:[1]};
  },
  eqModel(lvl){
    const [e, n] = pick(LEMON_KIDS), g = pick(POTION_WORDS), a = rand(2, 9), x = rand(2, 12);
    const T = pick([
      [`${n} had some ${g[1]}. ${n} made ${a + 3} more and now has ${x + a + 3}. How many did ${n} have at first?`, `x + ${a + 3} = ${x + a + 3}`, [`x ${MINUS} ${a + 3} = ${x + a + 3}`, `${a + 3}x = ${x + a + 3}`], x],
      [`Each crate holds ${a} bottles. ${n} filled some crates with ${a * x} bottles. How many crates?`, `${a}x = ${a * x}`, [`x + ${a} = ${a * x}`, `x ÷ ${a} = ${a * x}`], x],
      [`${n} gave away ${a} ${g[1]} and has ${x} left. How many did ${n} start with?`, `x ${MINUS} ${a} = ${x}`, [`x + ${a} = ${x}`, `${a}x = ${x}`], x + a],
      [`${n} shared some ${g[1]} equally into ${a} bags. Each bag got ${x}. How many were there?`, `x ÷ ${a} = ${x}`, [`${a}x = ${x}`, `x ${MINUS} ${a} = ${x}`], a * x]]);
    const [story, right, wrongs, ans] = T;
    return {title:'Balance Scale', ctx:right, bubble:story, helper:'Let x be the unknown amount. What happened to it?', visual:`<div style="text-align:center; font-size:1.6rem">${e} ${g[0]} x = ?</div>`,
      steps:[{name:'Pick the equation', type:'concept', kind:'choice', prompt:'Which equation matches the story?', options:choiceOf({text:right}, wrongs.map(w => ({text:w, mis:'wrongOperation'}))), drill:{type:'story', key:'addSub'}, hint:() => 'Start with x and do what the story does to it.'},
        numStep('Solve', 'compute', `${right}, x = ?`, ans, {slowOK:true, mis:v => v !== ans && (v === Number(right.split(' = ')[1]) - a || v === Number(right.split(' = ')[1]) + a) && lvl > 0 ? 'inverseWrong' : null})], answerSteps:[1]};
  },

  /* ----- station 6: Potion Limits (inequalities, dependent and independent variables) ----- */
  testIneq(lvl){
    const op = pick(lvl === 1 ? ['>', '<'] : ['>', '<', '≥', '≤']), c = lvl === 3 ? rand(-6, 6) : rand(2, 15), side = op === '>' || op === '≥' ? 1 : -1, strict = op === '>' || op === '<';
    const visual = `<div style="text-align:center; font-size:2rem">🚦 x ${op} ${sgn(c)}</div>`, helper = strict ? 'Without the line under the sign, the number itself does not count.' : 'The line under the sign means the number itself counts too.';
    if (Math.random() < 0.5) {                                             // is this one value a solution?
      const v = c + pick([-3, -1, 0, 0, 1, 3]), yes = ineqTrue(v, op, c);
      return {title:'Potion Limits', ctx:`x ${op} ${sgn(c)}, x = ${sgn(v)}`, bubble:`Is x = ${sgn(v)} a solution of x ${op} ${sgn(c)}?`, helper, visual,
        steps:[{name:'True?', type:'concept', kind:'choice', prompt:`Is ${sgn(v)} ${op} ${sgn(c)} true?`, options:choiceOf({text:yes ? 'Yes' : 'No'}, [{text:yes ? 'No' : 'Yes', mis:v === c ? 'boundaryWrong' : null}]),
          hint:() => `Where is ${sgn(v)} compared with ${sgn(c)} on a number line?`}]};
    }
    const right = !strict && Math.random() < 0.4 ? c : c + side * rand(1, 3);
    const wrongs = [{v:c - side * rand(1, 3), mis:'ineqDirection'}, strict ? {v:c, mis:'boundaryWrong'} : {v:c - side * rand(4, 5), mis:'ineqDirection'}];
    const opts = choiceOf({text:`x = ${sgn(right)}`}, wrongs.map(w => ({text:`x = ${sgn(w.v)}`, mis:w.mis})));
    return {title:'Potion Limits', ctx:`x ${op} ${sgn(c)}: pick`, bubble:`The potion works when x ${op} ${sgn(c)}. Which value makes it true?`, helper, visual,
      steps:[{name:'Which value', type:'concept', kind:'choice', prompt:`Which makes x ${op} ${sgn(c)} true?`, options:opts, hint:() => `Is it ${side > 0 ? 'more' : 'less'} than ${sgn(c)}${strict ? '' : ', or equal'}?`}]};
  },
  plotIneq(lvl){
    const op = pick(['>', '<', '≥', '≤']), c = lvl === 1 ? rand(1, 8) : rand(-6, 6);
    const words = {'>':'more than', '<':'less than', '≥':'at least', '≤':'at most'}[op];
    const ask = lvl === 3 ? `The potion must be kept at ${words} ${sgn(c)} degrees. Which graph shows the temperatures that work?` : `Which graph shows x ${op} ${sgn(c)}?`;
    const opts = shuffle([[op, null], [INEQ_FLIP[op], 'ineqDirection'], [INEQ_OPEN[op], 'circleWrong']]).map(([o, mis]) => ({html:ineqSVG(o, c), text:`x ${o} ${sgn(c)}`, ok:o === op, mis}));
    return {title:'Potion Limits', ctx:`graph x ${op} ${sgn(c)}`, bubble:ask, helper:'Open circle: the number is not included (< or >). Filled circle: it is included (≤ or ≥). The arrow points to the numbers that work.',
      visual:`<div style="text-align:center; font-size:2rem">🚦 ${lvl === 3 ? words + ' ' + sgn(c) : `x ${op} ${sgn(c)}`}</div>`,
      steps:[{name:'Pick the graph', type:'concept', kind:'choice', prompt:lvl === 3 ? `Which graph shows "${words} ${sgn(c)}"?` : `Which graph shows x ${op} ${sgn(c)}?`, options:opts,
        hint:() => `${op === '>' || op === '≥' ? 'Greater: the arrow points right.' : 'Less: the arrow points left.'} ${op.includes('≥') || op.includes('≤') ? 'The circle is filled.' : 'The circle is open.'}`}]};
  },
  depIndep(lvl){
    const [e, n] = pick(LEMON_KIDS), k = rand(2, 9), b = rand(2, 12);
    const S = pick([
      {story:`${n} earns $${k} for every potion sold.`, ind:'the number of potions sold', dep:'the money earned', f:x => k * x, rule:`y = ${k}x`, wrongRule:[`y = x + ${k}`, `x = ${k}y`], xs:'potions', ys:'dollars'},
      {story:`A cauldron heats up ${k} degrees every minute, starting at ${b} degrees.`, ind:'the minutes', dep:'the temperature', f:x => k * x + b, rule:`y = ${k}x + ${b}`, wrongRule:[`y = ${b}x + ${k}`, `y = ${k + b}x`], xs:'minutes', ys:'degrees'},
      {story:`Each bag holds ${k} crystals.`, ind:'the number of bags', dep:'the number of crystals', f:x => k * x, rule:`y = ${k}x`, wrongRule:[`y = x + ${k}`, `y = x ÷ ${k}`], xs:'bags', ys:'crystals'},
      {story:`${n} is ${b} years older than a little cousin.`, ind:"the cousin's age", dep:`${n}'s age`, f:x => x + b, rule:`y = x + ${b}`, wrongRule:[`y = ${b}x`, `x = y + ${b}`], xs:'cousin', ys:n}]);
    if (lvl === 1) return {title:'Potion Limits', ctx:`${S.story} dep?`, bubble:`${S.story} Which is the dependent variable?`, helper:'The dependent variable depends on the other one. It is what you find out.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} 🧪</div>`,
      steps:[{name:'Dependent', type:'concept', kind:'choice', prompt:'Which one depends on the other?', options:choiceOf({text:S.dep}, [{text:S.ind, mis:'depIndepSwap'}]), hint:() => `Does ${S.dep} change because of ${S.ind}, or the other way around?`}]};
    const xs = [1, 2, 3, 4, 5].map(i => i + (lvl === 3 ? rand(0, 1) * 0 : 0)), miss = rand(2, 4);
    const table = `<table class="xy-table"><tr><th>${esc(S.xs)} (x)</th>${xs.map(x => `<td>${x}</td>`).join('')}</tr><tr><th>${esc(S.ys)} (y)</th>${xs.map((x, i) => `<td>${lvl === 2 && i === miss ? '?' : S.f(x)}</td>`).join('')}</tr></table>`;
    if (lvl === 2) return {title:'Potion Limits', ctx:`${S.rule} table`, bubble:`${S.story} Fill in the missing number in the table.`, helper:'Find the pattern from x to y, then use it.', visual:table,
      steps:[numStep('Missing y', 'compute', `When x = ${xs[miss]}, y = ?`, S.f(xs[miss]), {mis:v => v === S.f(xs[miss - 1]) + 1 ? 'patternWrongRule' : null, hint:() => `When x = 1, y = ${S.f(1)}. When x = 2, y = ${S.f(2)}.`})]};
    return {title:'Potion Limits', ctx:`${S.rule} rule`, bubble:`${S.story} Which equation matches the table?`, helper:'Check the rule with every column of the table.', visual:table,
      steps:[{name:'Independent', type:'concept', kind:'choice', prompt:'Which is the independent variable (x)?', options:choiceOf({text:S.ind}, [{text:S.dep, mis:'depIndepSwap'}]), hint:() => 'The independent variable is the one you choose or that changes on its own.'},
        {name:'The rule', type:'concept', kind:'choice', prompt:'Which equation matches?', options:choiceOf({text:S.rule}, S.wrongRule.map(t => ({text:t, mis:t.startsWith('x') ? 'depIndepSwap' : 'patternWrongRule'}))), hint:() => `Try x = 1: y should be ${S.f(1)}. Try x = 2: y should be ${S.f(2)}.`}], answerSteps:[1]};
  }
};
```
