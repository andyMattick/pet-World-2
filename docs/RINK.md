# 6th grade, shop 5: the Ice Rink

**Status: built (all 4 stations).** Khan Academy 6th grade, Unit 5: Negative numbers. The generators are `RINK_GEN` in `src/game/game.js` (stress-tested: 720,000 problems, 20,000 per skill and level; every number-line reading, opposite, absolute value, comparison, ordering, and inequality option checked). Read `AGENTS.md` and `NEIGHBORHOODS.md` first. **Edit in place, never rewrite a file.**

The Ice Rink opens after the Clock Tower Unit Test (or with the teacher's "Open the Ice Rink for everyone").

## Stations and skills (Khan's order)

| # | Station | Skills (ids) |
|---|---|---|
| 1 | 🌡️ Thermometer | Interpreting negative numbers (`negIntro`), negative numbers on the number line (`negLine`), number opposites (`opposites`) |
| 2 | 📏 Rink Lines | Negative decimals on the number line (`negDecLine`), negative fractions on the number line (`negFracLine`) |
| 3 | 🏁 Race Board | Compare using a number line (`cmpLine`), compare rational numbers (`cmpRational`), ordering (`orderNeg`), writing numerical inequalities (`numIneq`) |
| 4 | 🧊 Ice Depth | Finding absolute values (`absVal`), compare and order absolute values (`cmpAbs`), interpreting absolute value (`absWord`) |

## Negative answers

A step with `neg:true` (the `negStep` helper) shows a **±** button beside the answer box, because phone keypads have no minus key. `wireNum(input, onEnter, {neg:true})` keeps one leading minus (typed as - or −). Negative numbers are shown with the real minus sign (`sgn`, `sgnD`, `sgnF`). Pet Houses will use the same thing for the coordinate plane.

## What students get

- **Meaning:** stories (below sea level, owing money, losing yards, going down) written as numbers, picking the story for a number, and the number for the opposite situation.
- **Number lines** (`iceLineSVG`, with arrows at both ends): integers, tenths, fourths, fifths, and mixed numbers left of 0; "which point is at −8?"
- **Opposites:** the opposite of a number, then −(−7) and −(−(−3)) worked from the inside out.
- **Comparing and ordering:** on a number line, without one (integers, decimals, fractions), putting four numbers in order, and writing the inequality for "colder" or "warmer". Wrong answers that follow "bigger digits is bigger" are named.
- **Absolute value:** |−7|, |−3.5|, −|−4|, |−6| + |2|, comparing and ordering absolute values mixed with negatives, distance from sea level, and "a debt of more than $20."

## Mix-ups

New: `signWrong`, `negCompare`, `absNegative`, `absIgnored`.

## Rewards

The Ice Rink reward set was already in the registry: 🦌 Frost the reindeer, 🐺 Howl the wolf, 🐋 Splash the whale, 🦈 Finn the shark, 🦢 Crystal the swan, and 5 decorations.

## Generator code (stress-tested)

```js
/* ===== 6th grade, Ice Rink (Khan unit 5): negative numbers ===== */
const MINUS = '−';
const sgn = x => (x < 0 ? MINUS : '') + String(Math.abs(x));                                  // −7, 3
const sgnD = x => (x < 0 ? MINUS : '') + String(parseFloat(Math.abs(x).toFixed(3)));            // −1.25
/* t/den as text: −3/4, 1 1/2, −2 */
function sgnF(t, den){
  const g = gcd(Math.abs(t), den) || 1, p = Math.abs(t) / g, q = den / g, s = t < 0 ? MINUS : '';
  if (q === 1) return s + p; const w = Math.floor(p / q), r = p % q; return s + (w ? `${w} ${r}/${q}` : `${r}/${q}`);
}
/* a typed answer that may be negative: the ± button shows next to the box */
const negStep = (name, type, prompt, answer, extra = {}) => ({name, type, kind:'num', prompt, answer, neg:true, eq:v => typeof v === 'number' && Math.abs(v - answer) < 1e-9, ...extra,
  ...(extra.mis ? {mis:v => typeof v === 'number' && Math.abs(v - answer) < 1e-9 ? null : extra.mis(v)} : {})});
/* number line from lo to hi (in ticks of 1/den); labels every labelEvery ticks (0 always labeled); dots: [{t, name}] */
function iceLineSVG(lo, hi, den, {labelEvery = den, dots = [], w = 300, labelFn = null} = {}){
  const L = 16, R = w - 16, y = 30, n = hi - lo, step = (R - L) / n, X = t => L + (t - lo) * step;
  let g = `<line x1="${L - 8}" y1="${y}" x2="${R + 8}" y2="${y}" class="nl-line"/><path d="M${L - 8} ${y} l7 -5 v10 z M${R + 8} ${y} l-7 -5 v10 z" class="nl-arrow"/>`;
  for (let t = lo; t <= hi; t++) {
    const big = t % den === 0, lab = t === 0 || (t - lo) % labelEvery === 0 && (labelEvery > 0);
    g += `<line x1="${X(t)}" y1="${y - (big ? 9 : 5)}" x2="${X(t)}" y2="${y + (big ? 9 : 5)}" class="nl-line"/>`;
    if (lab) g += `<text x="${X(t)}" y="${y + 26}" class="nl-text${n > 24 ? ' nl-small' : ''}">${labelFn ? labelFn(t) : sgnF(t, den)}</text>`;
  }
  dots.forEach(d => { g += `<circle cx="${X(d.t)}" cy="${y}" r="7" class="nl-dot"/>${d.name ? `<text x="${X(d.t)}" y="${y - 14}" class="nl-text nl-name">${d.name}</text>` : ''}`; });
  return `<svg class="num-line" viewBox="0 0 ${w} 64" width="${w}" role="img" aria-label="number line from ${sgnF(lo, den)} to ${sgnF(hi, den)}">${g}</svg>`;
}
/* situations: [words with #, sign, what 0 means] */
const ICE_CONTEXTS = [
  ['The temperature is # degrees below zero.', -1, 'zero degrees'], ['The temperature is # degrees above zero.', 1, 'zero degrees'],
  ['A submarine is # meters below sea level.', -1, 'sea level'], ['A seagull flies # meters above sea level.', 1, 'sea level'],
  ['Mia owes her brother $#.', -1, 'owing nothing'], ['Sam put $# into his savings account.', 1, 'no change'],
  ['The hockey team lost # points in the standings.', -1, 'no change'], ['The team gained # yards on the play.', 1, 'no gain or loss'],
  ['The elevator went down # floors.', -1, 'staying on the same floor'], ['The skater climbed # steps up the bleachers.', 1, 'staying put'],
  ['The ice rink lost # visitors since last week.', -1, 'no change'], ['The rink earned $# from skate rentals.', 1, 'no money']];
const opposite = s => s.replace('below', '§').replace('above', 'below').replace('§', 'above').replace('Mia owes her brother $#', 'Mia\'s brother owes her $#').replace('put $# into', 'took $# out of')
  .replace('lost # points', 'gained # points').replace('gained # yards', 'lost # yards').replace('went down', 'went up').replace('climbed # steps up', 'climbed # steps down').replace('lost # visitors', 'gained # visitors').replace('earned $# from', 'spent $# on');
const RINK_GEN = {
  /* ----- station 1: Thermometer (what negative numbers mean) ----- */
  negIntro(lvl){
    const [txt, s, zero] = pick(ICE_CONTEXTS), n = rand(2, lvl === 1 ? 20 : 60), val = s * n, story = txt.replace('#', n);
    if (lvl === 1) return {title:'Thermometer', ctx:`${story} → ${sgn(val)}`, bubble:`${story} What number stands for that?`, helper:'Below, owing, losing, and down are negative. Above, earning, gaining, and up are positive.',
      visual:`<div style="text-align:center; font-size:1.6rem">🌡️ ${s < 0 ? '⬇️' : '⬆️'} ${n}</div>`,
      steps:[negStep('As a number', 'concept', 'Write it as a positive or negative number.', val, {mis:v => v === -val ? 'signWrong' : null, hint:() => `Is it ${s < 0 ? 'below' : 'above'} ${zero}? That makes it ${s < 0 ? 'negative' : 'positive'}.`})]};
    if (lvl === 2) {
      const pool = shuffle(ICE_CONTEXTS.filter(c => c[0] !== txt)), same = pool.find(c => c[1] === s);
      const right = story, wrong1 = opposite(txt).replace('#', n), wrong2 = same[0].replace('#', n + rand(1, 5));
      const opts = choiceOf({text:right}, [{text:wrong1, mis:'signWrong'}, {text:wrong2}]);
      return {title:'Thermometer', ctx:`${sgn(val)} means`, bubble:`Which one does ${sgn(val)} describe?`, helper:'The sign tells the direction. The number tells how far from 0.', visual:`<div style="text-align:center; font-size:2rem">🌡️ ${sgn(val)}</div>`,
        steps:[{name:'Which story', type:'concept', kind:'choice', prompt:`Which situation is ${sgn(val)}?`, options:opts, hint:() => `${sgn(val)} is ${n} ${s < 0 ? 'below' : 'above'} zero.`}]};
    }
    const opp = opposite(txt).replace('#', n);
    return {title:'Thermometer', ctx:`${story} / opposite`, bubble:`${story} Write that as a number. Then write the number for the opposite situation: ${opp}`,
      helper:'Opposite situations have opposite numbers: the same distance from 0 on the other side.', visual:`<div style="text-align:center; font-size:1.6rem">🌡️ ${n} ↔ ${n}</div>`,
      steps:[negStep('As a number', 'concept', story, val, {mis:v => v === -val ? 'signWrong' : null}), negStep('The opposite', 'concept', opp, -val, {mis:v => v === val ? 'signWrong' : null, hint:() => 'Same number, other sign.'})], answerSteps:[1]};
  },
  negLine(lvl){
    const [den, lo, hi, lab] = lvl === 1 ? [1, -10, 10, 5] : lvl === 2 ? [1, -20, 20, 10] : [1, -12, 12, 4];
    if (lvl < 3) {
      let t; do { t = rand(lo + 1, hi - 1); } while (t >= 0 && Math.random() < 0.75 || t === 0 || t % lab === 0);
      return {title:'Thermometer', ctx:`dot at ${sgn(t)}`, bubble:'The skater stopped at the dot. What number is it?', helper:'Numbers left of 0 are negative. Count the ticks from the nearest label.',
        visual:iceLineSVG(lo, hi, den, {labelEvery:lab, dots:[{t}]}),
        steps:[negStep('Read the line', 'concept', 'What number is at the dot?', t, {mis:v => v === -t ? 'signWrong' : null, hint:() => `Start at ${sgn(t < 0 ? Math.ceil(t / lab) * lab : Math.floor(t / lab) * lab)} and count the ticks.`})]};
    }
    let a, b; do { a = rand(lo + 1, -1); b = rand(lo + 1, hi - 1); } while (b === a || b === -a || b === 0);
    const names = shuffle(['A', 'B', 'C']), pts = [a, b, -a], ask = a;
    const opts = [0, 1, 2].map(i => ({html:names[i], text:names[i], ok:pts[i] === ask, mis:pts[i] === -ask ? 'signWrong' : null}));
    return {title:'Thermometer', ctx:`find ${sgn(ask)}`, bubble:`Which point is at ${sgn(ask)}?`, helper:'Negative numbers are to the left of 0.',
      visual:iceLineSVG(lo, hi, den, {labelEvery:lab, dots:pts.map((t, i) => ({t, name:names[i]}))}),
      steps:[{name:'Find the point', type:'concept', kind:'choice', prompt:`Which point is at ${sgn(ask)}?`, options:shuffle(opts), hint:() => `${sgn(ask)} is ${Math.abs(ask)} to the left of 0.`}]};
  },
  opposites(lvl){
    const n = rand(1, lvl === 1 ? 20 : 99), x = pick([n, -n]);
    if (lvl === 1) return {title:'Thermometer', ctx:`opposite of ${sgn(x)}`, bubble:`What is the opposite of ${sgn(x)}?`, helper:'The opposite is the same distance from 0 on the other side.',
      visual:iceLineSVG(-10, 10, 1, {labelEvery:5, dots:Math.abs(x) <= 10 ? [{t:x}] : []}),
      steps:[negStep('Opposite', 'concept', `The opposite of ${sgn(x)} is ?`, -x, {mis:v => v === x ? 'signWrong' : null})]};
    const k = lvl === 2 ? 2 : pick([2, 3]), expr = Array(k).fill(`${MINUS}(`).join('') + sgn(x) + ')'.repeat(k), val = k % 2 ? -x : x;
    const steps = [];
    let cur = x; for (let j = 1; j <= k; j++) { const inner = Array(j).fill(`${MINUS}(`).join('') + sgn(x) + ')'.repeat(j); cur = -cur;
      steps.push(negStep(j === k ? 'Value' : `Opposite ${j}`, 'concept', `${inner} = ?`, cur, {mis:w => w === -cur ? 'signWrong' : null, hint:() => `The opposite of ${sgn(-cur)}.`})); }
    return {title:'Thermometer', ctx:expr, bubble:`What is ${expr}?`, helper:`Each ${MINUS} in front means "the opposite of". Work from the inside out.`, visual:`<div style="text-align:center; font-size:2rem">🌡️ ${expr}</div>`, steps, answerSteps:[steps.length - 1]};
  },

  /* ----- station 2: Rink Lines (negative decimals and fractions) ----- */
  negDecLine(lvl){
    const [den, lo, hi, lab] = lvl === 1 ? [10, -10, 10, 5] : lvl === 2 ? [10, -20, 20, 10] : pick([[4, -8, 8, 4], [5, -10, 10, 5]]);
    let t; do { t = rand(lo + 1, hi - 1); } while (t % lab === 0 || t > 0 && Math.random() < 0.75);
    const val = t / den, txt = sgnD(val);
    return {title:'Rink Lines', ctx:`dot at ${txt}`, bubble:'The puck stopped at the dot. What decimal is it?', helper:`Each tick is ${sgnD(1 / den)}. Count from the nearest label.`,
      visual:iceLineSVG(lo, hi, den, {labelEvery:lab, dots:[{t}], labelFn:u => sgnD(u / den)}),
      steps:[negStep('Read the line', 'concept', 'What decimal is at the dot?', val, {answer:txt.replace(MINUS, '-'), decimal:true, eq:v => typeof v === 'number' && Math.abs(v - val) < 1e-9,
        mis:v => Math.abs(v + val) < 1e-9 ? 'signWrong' : null, hint:() => `Each tick is ${sgnD(1 / den)}. It is left of 0, so it's negative.`})]};
  },
  negFracLine(lvl){
    const den = lvl === 1 ? pick([2, 4]) : lvl === 2 ? pick([3, 4, 6, 8]) : pick([2, 3, 4]), W = lvl === 3 ? 3 : 1, lo = -W * den, hi = W * den;
    let t; do { t = rand(lo + 1, hi - 1); } while (t % den === 0 || t > 0 && Math.random() < 0.7);
    const right = sgnF(t, den), wrongs = [{text:sgnF(-t, den), mis:'signWrong'}, {text:sgnF(t + (t < 0 ? 1 : -1), den)}, {text:sgnF(t < 0 ? t - 1 : t + 1, den)}];
    return {title:'Rink Lines', ctx:`dot at ${right}`, bubble:'The skate blade is at the dot. What number is it?', helper:`Each whole is cut into ${den} equal parts.`,
      visual:iceLineSVG(lo, hi, den, {labelEvery:den, dots:[{t}]}),
      steps:[{name:'Read the line', type:'concept', kind:'choice', prompt:'What number is at the dot?', options:choiceOf({text:right}, wrongs), hint:() => `Count the ${FRAC.part(den, true)} from 0. Left of 0 is negative.`}]};
  },

  /* ----- station 3: Race Board (comparing and ordering) ----- */
  cmpLine(lvl){
    let a, b; do { a = rand(-10, 10); b = rand(-10, 10); } while (a === b || Math.abs(a - b) < 2 || (a >= 0 && b >= 0) || (lvl >= 2 && (a > 0 || b > 0) && Math.random() < 0.7));
    const r = a > b ? '>' : '<', trap = Math.abs(a) > Math.abs(b) ? '>' : Math.abs(a) < Math.abs(b) ? '<' : null;
    const opts = choiceOf({text:r}, ['>', '<', '='].map(t => ({text:t, mis:t === trap && t !== r ? 'negCompare' : null}))).map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`}));
    return {title:'Race Board', ctx:`${sgn(a)} ? ${sgn(b)}`, bubble:`Use the number line. Compare ${sgn(a)} and ${sgn(b)}.`, helper:'Farther right is greater.',
      visual:iceLineSVG(-10, 10, 1, {labelEvery:5, dots:[{t:a, name:sgn(a)}, {t:b, name:sgn(b)}]}),
      steps:[{name:'Compare', type:'concept', kind:'choice', prompt:`${sgn(a)} ◯ ${sgn(b)}`, options:opts, hint:() => `Which one is farther right?`}]};
  },
  cmpRational(lvl){
    const make = () => lvl === 1 ? rand(-30, 30) : lvl === 2 ? rand(-50, 50) / 10 : pick([rand(-40, 40) / 4, rand(-30, 30) / 10]);
    let a, b; do { a = make(); b = make(); } while (a === b || (a > 0 && b > 0) || Math.random() < 0.3 && !(a < 0 && b < 0));
    const txt = x => lvl === 3 && Math.round(x * 4) === x * 4 && Math.round(x * 10) !== x * 10 ? sgnF(Math.round(x * 4), 4) : sgnD(x);
    const r = a > b ? '>' : '<', trap = Math.abs(a) > Math.abs(b) ? '>' : '<';
    const opts = choiceOf({text:r}, ['>', '<', '='].map(t => ({text:t, mis:t === trap && t !== r ? 'negCompare' : null}))).map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`}));
    return {title:'Race Board', ctx:`${txt(a)} ? ${txt(b)}`, bubble:`Which is greater: ${txt(a)} or ${txt(b)}?`, helper:'For negatives, the one closer to 0 is greater.', visual:'',
      steps:[{name:'Compare', type:'concept', kind:'choice', prompt:`${txt(a)} ◯ ${txt(b)}`, options:opts, hint:() => 'Picture them on a number line: farther right is greater.'}]};
  },
  orderNeg(lvl){
    const pool = new Set(); while (pool.size < 4) pool.add(lvl === 1 ? rand(-15, 15) : lvl === 2 ? rand(-60, 60) / 10 : rand(-20, 20) / 4);
    const vals = [...pool], txt = x => lvl === 3 && Math.round(x) !== x ? sgnF(Math.round(x * 4), 4) : sgnD(x);
    if (vals.filter(v => v < 0).length < 2) return RINK_GEN.orderNeg(lvl);
    const up = [...vals].sort((x, y) => x - y), byAbs = [...vals].sort((x, y) => Math.abs(x) - Math.abs(y) || x - y), down = [...up].reverse();
    const T = arr => arr.map(txt).join(', ');
    const digitsFirst = [...up.filter(v => v < 0).reverse(), ...up.filter(v => v >= 0)];      // −2, −8, 1, 5: negatives ordered by their digits
    const wrongs = [{text:T(byAbs), mis:'negCompare'}, {text:T(digitsFirst), mis:'negCompare'}, {text:T(down)}];
    return {title:'Race Board', ctx:`order ${T(vals)}`, bubble:`Put these race times (seconds ahead or behind) in order from least to greatest: ${T(vals)}.`, helper:'Least is farthest left on the number line. Negatives come first, and the most negative is least.',
      visual:`<div style="text-align:center; font-size:1.4rem">🏁 ${T(vals)}</div>`,
      steps:[{name:'Least to greatest', type:'concept', kind:'choice', prompt:'Which order goes from least to greatest?', options:choiceOf({text:T(up)}, wrongs), hint:() => 'The negative with the biggest digits is the least.'}]};
  },
  numIneq(lvl){
    const places = shuffle([['Fargo', '🏙️'], ['the rink', '⛸️'], ['Denver', '🏔️'], ['the lake', '🏞️'], ['Anchorage', '🌨️'], ['the pond', '🦆']]).slice(0, 2);
    let a, b; do { a = rand(-20, lvl === 1 ? 10 : 5); b = rand(-20, lvl === 1 ? 10 : 5); } while (a === b || (lvl >= 2 && (a >= 0 || b >= 0)));
    const colder = a < b ? 0 : 1, lo = Math.min(a, b), hi = Math.max(a, b);
    const say = pick(['colder', 'warmer']), who = say === 'colder' ? colder : 1 - colder;
    const right = say === 'colder' ? `${sgn(lo)} < ${sgn(hi)}` : `${sgn(hi)} > ${sgn(lo)}`;
    const wrongs = say === 'colder' ? [{text:`${sgn(lo)} > ${sgn(hi)}`, mis:'negCompare'}, {text:`${sgn(hi)} < ${sgn(lo)}`, mis:'negCompare'}] : [{text:`${sgn(hi)} < ${sgn(lo)}`, mis:'negCompare'}, {text:`${sgn(lo)} > ${sgn(hi)}`, mis:'negCompare'}];
    const T = [a, b];
    return {title:'Race Board', ctx:right, bubble:`It is ${sgn(T[0])}°F at ${places[0][0]} and ${sgn(T[1])}°F at ${places[1][0]}. ${places[who][0][0].toUpperCase() + places[who][0].slice(1)} is ${say}. Which inequality shows that?`,
      helper:'Colder is less. Warmer is greater.', visual:`<div style="text-align:center; font-size:1.4rem">${places[0][1]} ${sgn(T[0])}° · ${places[1][1]} ${sgn(T[1])}°</div>`,
      steps:[{name:'Write it', type:'concept', kind:'choice', prompt:'Which inequality matches?', options:choiceOf({text:right}, wrongs), hint:() => `${sgn(lo)} is farther left, so it is less.`}]};
  },

  /* ----- station 4: Ice Depth (absolute value) ----- */
  absVal(lvl){
    if (lvl < 3) {
      const x = lvl === 1 ? pick([-1, 1]) * rand(1, 30) : pick([-1, 1]) * rand(1, 99) / 10, t = sgnD(x);
      return {title:'Ice Depth', ctx:`|${t}|`, bubble:`What is |${t}|?`, helper:'Absolute value is the distance from 0, so it is never negative.', visual:`<div style="text-align:center; font-size:2rem">🧊 |${t}|</div>`,
        steps:[negStep('Distance from 0', 'concept', `|${t}| = ?`, Math.abs(x), {answer:sgnD(Math.abs(x)), decimal:lvl === 2, mis:v => Math.abs(v + Math.abs(x)) < 1e-9 ? 'absNegative' : null, hint:() => `How far is ${t} from 0?`})]};
    }
    const a = rand(1, 15), b = rand(1, 15), kind = pick(['negOut', 'sum', 'diff']);
    const [expr, val, parts] = kind === 'negOut' ? [`${MINUS}|${sgn(-a)}|`, -a, [[`|${sgn(-a)}|`, a]]] : kind === 'sum' ? [`|${sgn(-a)}| + |${sgn(b)}|`, a + b, [[`|${sgn(-a)}|`, a], [`|${sgn(b)}|`, b]]] : [`|${sgn(-a - b)}| ${MINUS} |${sgn(-b)}|`, a, [[`|${sgn(-a - b)}|`, a + b], [`|${sgn(-b)}|`, b]]];
    const steps = parts.map(([e, v]) => negStep(e, 'concept', `${e} = ?`, v, {mis:w => w === -v ? 'absNegative' : null}));
    steps.push(negStep('Value', 'compute', `${expr} = ?`, val, {mis:w => kind === 'negOut' && w === a ? 'absNegative' : kind === 'sum' && w === b - a ? 'absIgnored' : kind === 'diff' && w === -a ? 'absIgnored' : null,
      hint:() => kind === 'negOut' ? 'Find the absolute value first, then take its opposite.' : 'Find each absolute value first.'}));
    return {title:'Ice Depth', ctx:expr, bubble:`What is ${expr}?`, helper:'Do each absolute value first. A minus sign outside the bars stays.', visual:`<div style="text-align:center; font-size:2rem">🧊 ${expr}</div>`, steps, answerSteps:[steps.length - 1]};
  },
  cmpAbs(lvl){
    let a, b; do { a = rand(-20, 20); b = rand(-20, 20); } while (a === b || Math.abs(a) === Math.abs(b) || (a > 0 && b > 0));
    if (lvl < 3) {
      const A = Math.abs(a), B = Math.abs(b), r = A > B ? '>' : '<', raw = a > b ? '>' : '<';
      const opts = choiceOf({text:r}, ['>', '<', '='].map(t => ({text:t, mis:t === raw && t !== r ? 'absIgnored' : null}))).map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`}));
      const steps = [];
      if (lvl === 1) steps.push(negStep(`|${sgn(a)}|`, 'concept', `|${sgn(a)}| = ?`, A, {mis:v => v === a && a < 0 ? 'absNegative' : null}), negStep(`|${sgn(b)}|`, 'concept', `|${sgn(b)}| = ?`, B, {mis:v => v === b && b < 0 ? 'absNegative' : null}));
      steps.push({name:'Compare', type:'concept', kind:'choice', prompt:`|${sgn(a)}| ◯ |${sgn(b)}|`, options:opts, hint:() => `Compare the distances ${A} and ${B}.`});
      return {title:'Ice Depth', ctx:`|${sgn(a)}| ? |${sgn(b)}|`, bubble:`Compare |${sgn(a)}| and |${sgn(b)}|.`, helper:'Compare the distances from 0.', visual:'', steps, ...(lvl === 1 ? {answerSteps:[2]} : {})};
    }
    const c = a + (a > 0 ? 1 : -1);        /* [text, value, the number inside without the bars] */
    const items = [[`|${sgn(a)}|`, Math.abs(a), a], [sgn(b), b, b], [`${MINUS}|${sgn(c)}|`, -Math.abs(c), c], [`|${sgn(b)}|`, Math.abs(b), b]];
    if (new Set(items.map(i => i[1])).size < 4) return RINK_GEN.cmpAbs(lvl);
    const up = [...items].sort((x, y) => x[1] - y[1]).map(i => i[0]).join(', '), noAbs = [...items].sort((x, y) => x[2] - y[2] || x[1] - y[1]).map(i => i[0]).join(', ');
    const down = [...items].sort((x, y) => y[1] - x[1]).map(i => i[0]).join(', ');
    return {title:'Ice Depth', ctx:`order ${items.map(i => i[0]).join(', ')}`, bubble:`Put these in order from least to greatest: ${shuffle(items.map(i => i[0])).join(', ')}.`, helper:'Find each value first. Absolute values are never negative, but a minus sign outside the bars makes it negative.', visual:'',
      steps:[{name:'Least to greatest', type:'concept', kind:'choice', prompt:'Which order goes from least to greatest?', options:choiceOf({text:up}, [{text:noAbs, mis:'absIgnored'}, {text:down}]), hint:() => items.map(i => `${i[0]} = ${sgn(i[1])}`).join(', ') + '.'}]};
  },
  absWord(lvl){
    if (lvl === 1) {
      const [txt, s] = pick(ICE_CONTEXTS.filter(c => c[1] < 0)), n = rand(3, 60), story = txt.replace('#', n);
      return {title:'Ice Depth', ctx:`|${sgn(-n)}| in words`, bubble:`${story} The number is ${sgn(-n)}. How far is that from 0?`, helper:'Absolute value is the size of the change or the distance, without the direction.',
        visual:`<div style="text-align:center; font-size:1.6rem">🧊 |${sgn(-n)}|</div>`,
        steps:[negStep('How far from 0', 'concept', `|${sgn(-n)}| = ?`, n, {mis:v => v === -n ? 'absNegative' : null})]};
    }
    if (lvl === 2) {
      let d, h; do { d = rand(5, 60); h = rand(5, 60); } while (d === h);
      const far = d > h ? 'The diver' : 'The bird';
      return {title:'Ice Depth', ctx:`${sgn(-d)} vs ${h}`, bubble:`A diver is at ${sgn(-d)} meters and a bird is at ${h} meters. Who is farther from sea level?`, helper:'Compare the absolute values: the distances from 0.',
        visual:`<div style="text-align:center; font-size:1.6rem">🤿 ${sgn(-d)} m · 🐦 ${h} m</div>`,
        steps:[negStep('Diver\'s distance', 'concept', `|${sgn(-d)}| = ?`, d, {mis:v => v === -d ? 'absNegative' : null}),
          {name:'Farther', type:'concept', kind:'choice', prompt:'Who is farther from sea level?', options:choiceOf({text:far}, [{text:far === 'The diver' ? 'The bird' : 'The diver', mis:d > h ? 'absIgnored' : null}]), hint:() => `${d} meters down vs ${h} meters up.`}], answerSteps:[1]};
    }
    const limit = rand(2, 9) * 5, bal = [-(limit + rand(1, 9)), -(limit - rand(1, 4)), limit + rand(1, 9)];
    const opts = choiceOf({text:`${MINUS}$${Math.abs(bal[0])}`}, [{text:`${MINUS}$${Math.abs(bal[1])}`}, {text:`$${bal[2]}`, mis:'absIgnored'}]);
    return {title:'Ice Depth', ctx:`debt more than ${limit}`, bubble:`A skate shop account shows a debt of more than $${limit}. Which balance could it be?`, helper:'A debt is a negative balance. A debt of more than $' + limit + ' is a balance less than ' + MINUS + '$' + limit + '.',
      visual:`<div style="text-align:center; font-size:1.6rem">🧾 debt &gt; $${limit}</div>`,
      steps:[{name:'Which balance', type:'concept', kind:'choice', prompt:`Which balance is a debt of more than $${limit}?`, options:opts, hint:() => `Owing more than $${limit} means the balance is below ${MINUS}$${limit}.`}]};
  }
};
```
