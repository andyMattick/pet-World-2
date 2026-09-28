# 4th grade, shop 4: the Garden Center

**Status: stations 1 and 2 built; stations 3 (Seed Survey, line plots) and 4 (Sprinkler Angles, measuring angles) to come.** The generators are `GARDEN_GEN` in `src/game/game.js` (stress-tested: 720,000 problems, 20,000 per skill and level; every conversion checked against the unit table, every arithmetic step recomputed, every compare and area-or-perimeter choice checked to have exactly one right option). Read `AGENTS.md`, `GRADE4.md`, and `NEIGHBORHOODS.md` first. **Edit in place, never rewrite a file.**

The Garden Center opens after the Pizza Parlor Unit Test (or with the teacher's "Open the Garden Center for everyone").

## Stations and skills (Sadlier lessons 26 to 29 so far, Khan's order)

| # | Station | Skills (ids) |
|---|---|---|
| 1 | 🥄 Measuring Cups | Convert to smaller units: mass (`convMass`), volume (`convVolume`), length (`convLength`), time (`convTime`); time (`timeWord`), money (`moneyWord`), metric (`metricWord`), and US customary (`customaryWord`) word problems |
| 2 | 🟫 Garden Beds | Area and perimeter situations (`apSituation`), represent rectangle measurements (`rectMeasure`), missing side from area or perimeter (`apMissing`), area and perimeter word problems (`apWord`) |
| 3 | 📊 Seed Survey | Lesson 30, line plots (to be written) |
| 4 | 📐 Sprinkler Angles | Lessons 31 to 33, angles (to be written) |

## What students get

- **Converting:** level 1 says the fact first (1 kg = ? g) and then multiplies; level 2 uses mixed units (4 lb 3 oz = ? oz: convert, then add the rest); level 3 compares across units (5 lb or 84 oz?). The story matches the unit (a trail in km, a seedling in cm, tomatoes ripening in weeks). Quizzes ask only the final answer.
- **Word problems:** time (hours and minutes added or subtracted, race times in minutes and seconds), money (counting coins, change from dollars, how many coins make an amount), metric (hose length, cutting twine into pieces), and customary (gallons of lemonade poured into cups).
- **Area and perimeter:** a rectangle picture (`rectSVG`) with a unit-square grid on level 1, labels on every level, and a `?` on the missing side.

## Mix-ups

New: `wrongFactor` (uses 100 for kg to g, 10 for ft to in), `joinedUnits` (2 ft 5 in → 25), `forgotSmallPart`, `rawCompare` (compares 5 lb and 84 oz as 5 and 84), `areaPerimeterSwap`, `halfPerimeter` (adds only two sides). Reused: `unitsDirection`, `addFactors`.

## Rewards

Pets: 🐇 Clover the bunny, 🦗 Chirp the cricket, 🐛 Wiggles the caterpillar, 🦫 Bramble the beaver, 🕊️ Blossom the dove (legendary). Decorations: 🌵 Cactus pot, 🥕 Carrot patch, 🌹 Rose bush, ⛲ Garden fountain, 🏆 Golden watering can (legendary).

## Generator code, stations 1 and 2 (stress-tested)

```js
/* ===== 4th grade, Garden Center stations 1 and 2 (Sadlier lessons 26 to 29): converting units, area and perimeter ===== */
/* [big unit, small unit, how many small in 1 big, big name, small name] */
const UNIT_PAIRS = {
  mass:   [['kg', 'g', 1000, 'kilograms', 'grams'], ['lb', 'oz', 16, 'pounds', 'ounces']],
  volume: [['L', 'mL', 1000, 'liters', 'milliliters'], ['gal', 'qt', 4, 'gallons', 'quarts'], ['qt', 'pt', 2, 'quarts', 'pints'], ['pt', 'c', 2, 'pints', 'cups'], ['gal', 'pt', 8, 'gallons', 'pints'], ['qt', 'c', 4, 'quarts', 'cups'], ['gal', 'c', 16, 'gallons', 'cups']],
  length: [['km', 'm', 1000, 'kilometers', 'meters'], ['m', 'cm', 100, 'meters', 'centimeters'], ['cm', 'mm', 10, 'centimeters', 'millimeters'], ['m', 'mm', 1000, 'meters', 'millimeters'], ['yd', 'ft', 3, 'yards', 'feet'], ['ft', 'in', 12, 'feet', 'inches'], ['yd', 'in', 36, 'yards', 'inches'], ['mi', 'yd', 1760, 'miles', 'yards'], ['mi', 'ft', 5280, 'miles', 'feet']],
  time:   [['hr', 'min', 60, 'hours', 'minutes'], ['min', 'sec', 60, 'minutes', 'seconds'], ['day', 'hr', 24, 'days', 'hours'], ['week', 'day', 7, 'weeks', 'days']]
};
/* a story sentence for each big unit, so the thing matches the size of the unit */
const CONV_ITEMS = {
  kg:['🥔 A sack of potatoes weighs #.', '🎃 A pumpkin weighs #.', '🍉 A crate of watermelons weighs #.'], lb:['🥔 A sack of potatoes weighs #.', '🎃 A pumpkin weighs #.', '🪴 A bag of soil weighs #.'],
  L:['🛢️ A rain barrel holds #.', '🪣 A watering can holds #.'], gal:['🛢️ A rain barrel holds #.', '🪣 A watering can holds #.'], qt:['🧃 A jug of plant food holds #.', '🫙 A pot of soup holds #.'], pt:['🫙 A jar of honey holds #.', '🧃 A bottle of plant food holds #.'],
  km:['🥾 The garden trail is # long.', '🚲 The bike ride to the farm is # long.'], mi:['🥾 The garden trail is # long.', '🚲 The bike ride to the farm is # long.'],
  m:['🪱 The garden hose is # long.', '🌻 The tallest sunflower is # tall.', '🌳 A row of trees is # long.'], yd:['🪱 The garden hose is # long.', '🪵 The fence is # long.'], ft:['🌻 The tallest sunflower is # tall.', '🪵 A fence board is # long.'],
  cm:['🌱 A seedling is # tall.', '🐛 A caterpillar is # long.'],
  hr:['🚿 The sprinklers ran for #.', '🐝 The bee tour lasted #.'], min:['🪣 The hose filled the pond in #.', '🧑‍🌾 The weeding took #.'], day:['🌱 The seeds took # to sprout.', '🥒 The cucumbers took # to grow.'], week:['🍅 The tomatoes took # to ripen.', '🎃 The pumpkins took # to grow.']
};
const unitWord = (n, w) => n !== 1 ? w : ({feet:'foot', inches:'inch'})[w] || w.replace(/s$/, '');
const unitAbbr = (n, a) => (a === 'day' || a === 'week') && n !== 1 ? a + 's' : a;
/* the other factors in the same family: using one of these is the wrongFactor mix-up */
const otherFactors = (kind, f) => [...new Set(UNIT_PAIRS[kind].map(u => u[2]).concat(kind === 'length' || kind === 'mass' || kind === 'volume' ? [10, 100, 1000] : [60, 100]))].filter(g => g !== f);
const convStep = (kind, [big, small, f]) => numStep('How many in 1', 'concept', `1 ${big} = ? ${small}`, f, {fact:undefined,
  mis:v => otherFactors(kind, f).includes(v) ? 'wrongFactor' : null, hint:() => `How many ${small} make 1 ${big}?`});
const convertGen = kind => lvl => {
  const pairs = UNIT_PAIRS[kind].filter(u => lvl === 3 || u[2] < 1760), U = pick(pairs), [big, small, f, bigW, smallW] = U;
  const n = f >= 1760 ? rand(2, 3) : f >= 100 ? rand(2, 9) : rand(2, lvl === 1 ? 9 : 12), item = pick(CONV_ITEMS[big]), total = n * f, B = unitAbbr(n, big);
  const say = amt => item.replace('#', amt);
  const fact = f <= 12 && n <= 12 ? {x:n, y:f} : undefined;
  if (lvl === 1) return {title:'Measuring Cups', ctx:`${n} ${B} = ? ${small}`, bubble:`${say(`${n} ${bigW}`)} How many ${smallW} is that?`,
    helper:'Going to a smaller unit? You need more of them, so multiply.', visual:`<div style="text-align:center; font-size:1.6rem">${n} ${B} = ? ${small}</div>`,
    steps:[convStep(kind, U), numStep('Convert', 'compute', `${n} × ${commas(f)} = ?`, total, {fact, mis:v => v === n ? 'unitsDirection' : otherFactors(kind, f).some(g => g * n === v) ? 'wrongFactor' : null, hint:() => `Each ${big} is ${commas(f)} ${small}. ${n} of them is ${n} × ${commas(f)}.`})],
    answerSteps:[1]};
  if (lvl === 2) {
    const m = rand(1, f - 1), all = total + m, joined = Number(`${n}${m}`);
    const Sm = unitAbbr(m, small);
    return {title:'Measuring Cups', ctx:`${n} ${B} ${m} ${Sm} = ? ${small}`, bubble:`${say(`${n} ${bigW} ${m} ${unitWord(m, smallW)}`)} How many ${smallW} is that?`,
      helper:'Change the big units to small units, then add the small units that were already there.', visual:`<div style="text-align:center; font-size:1.6rem">${n} ${B} ${m} ${Sm} = ? ${small}</div>`,
      steps:[convStep(kind, U), numStep(`${n} ${B}`, 'compute', `${n} ${B} = ? ${small}`, total, {fact, mis:v => otherFactors(kind, f).some(g => g * n === v) ? 'wrongFactor' : null, hint:() => `${n} × ${commas(f)}.`}),
        numStep('Add the rest', 'compute', `${commas(total)} + ${m} = ?`, all, {mis:v => v === joined ? 'joinedUnits' : v === total ? 'forgotSmallPart' : null, hint:() => `Don't forget the ${m} ${Sm}.`})],
      answerSteps:[2]};
  }
  let other; do { other = Math.max(1, total + pick([-1, 1]) * rand(0, Math.ceil(f / 2)) * (f >= 100 ? pick([1, 10]) : 1)); } while (other === total && Math.random() < 0.7);
  if (other === n) other = total + 1;
  const right = total > other ? '>' : total < other ? '<' : '=', raw = n > other ? '>' : n < other ? '<' : '=';
  const opts = choiceOf({text:right}, ['>', '<', '='].map(t => ({text:t, mis:t === raw ? 'rawCompare' : null})));
  return {title:'Measuring Cups', ctx:`${n} ${B} ? ${other} ${small}`, bubble:`Which is ${{mass:'heavier', volume:'more', length:'longer', time:'longer'}[kind]}: ${n} ${bigW} or ${commas(other)} ${smallW}?`,
    helper:'Change both to the same unit before you compare.', visual:'',
    steps:[convStep(kind, U), numStep(`${n} ${B}`, 'compute', `${n} ${B} = ? ${small}`, total, {fact, hint:() => `${n} × ${commas(f)}.`}),
      {name:'Compare', type:'concept', kind:'choice', prompt:`${n} ${B} ◯ ${commas(other)} ${small}`, options:opts.map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`})),
        hint:() => `${n} ${B} is ${commas(total)} ${small}. Compare ${commas(total)} and ${commas(other)}.`}],
    answerSteps:[2]};
};

/* ----- conversion word problems ----- */
const moneyTxt = c => c % 100 === 0 ? `$${c / 100}` : c < 100 ? `${c}¢` : `$${(c / 100).toFixed(2)}`;
const GARDEN_WORD = {
  timeWord(lvl){
    const [e, n] = pick(LEMON_KIDS), task = pick(['watered the garden', 'pulled weeds', 'planted seeds', 'raked leaves']);
    if (lvl === 1) {
      const U = pick(UNIT_PAIRS.time.slice(0, 3)), k = rand(2, U[2] === 24 ? 5 : 9);
      return {title:'Measuring Cups', ctx:`${k} ${unitAbbr(k, U[0])} = ? ${U[1]}`, bubble:`${n} ${task} for ${k} ${U[3]}. How many ${U[4]} is that?`, helper:'Bigger unit to smaller unit: multiply.',
        visual:`<div style="text-align:center; font-size:1.6rem">${e} ⏱️ ${k} ${unitAbbr(k, U[0])}</div>`,
        steps:[convStep('time', U), numStep('Convert', 'compute', `${k} × ${U[2]} = ?`, k * U[2], {mis:v => v === k ? 'unitsDirection' : null, hint:() => `${k} groups of ${U[2]}.`})], answerSteps:[1]};
    }
    if (lvl === 2) {
      const h = rand(1, 2), m1 = rand(1, 11) * 5, m2 = rand(3, 11) * 5, first = h * 60 + m1, add = Math.random() < 0.5, ans = add ? first + m2 : first - m2;
      return {title:'Measuring Cups', ctx:`${h} hr ${m1} min ${add ? '+' : '−'} ${m2} min`,
        bubble:add ? `${n} ${task} for ${h} hr ${m1} min on Saturday and ${m2} minutes on Sunday. How many minutes in all?` : `${n} planned to spend ${h} hr ${m1} min in the garden but finished ${m2} minutes early. How many minutes did ${n} spend?`,
        helper:'Change the hours to minutes first.', visual:`<div style="text-align:center; font-size:1.6rem">${e} ⏱️ ${h} hr ${m1} min</div>`,
        steps:[numStep(`${h} hr ${m1} min`, 'compute', `${h} hr ${m1} min = ? min`, first, {mis:v => v === Number(`${h}${m1}`) || v === h * 100 + m1 ? 'joinedUnits' : v === h * 60 ? 'forgotSmallPart' : null, hint:() => `${h} hr is ${h * 60} min. Add the ${m1} min.`}),
          numStep(add ? 'Add' : 'Subtract', 'compute', `${first} ${add ? '+' : '−'} ${m2} = ?`, ans, {hint:() => add ? 'Put the times together.' : 'Take away the minutes saved.'})], answerSteps:[1]};
    }
    const a = rand(2, 4), s1 = rand(10, 55), s2 = rand(5, 55), A = a * 60 + s1, B = (a - 1) * 60 + s2;
    return {title:'Measuring Cups', ctx:`${a} min ${s1} sec − ${a - 1} min ${s2} sec`, bubble:`${n}'s wheelbarrow race took ${a} min ${s1} sec. Sam's took ${a - 1} min ${s2} sec. How many seconds faster was Sam?`,
      helper:'Change both times to seconds, then subtract.', visual:`<div style="text-align:center; font-size:1.6rem">🏁 ${a}:${String(s1).padStart(2, '0')} vs ${a - 1}:${String(s2).padStart(2, '0')}</div>`,
      steps:[numStep(`${a} min ${s1} sec`, 'compute', `${a} min ${s1} sec = ? sec`, A, {mis:v => v === a * 60 ? 'forgotSmallPart' : v === a * 100 + s1 ? 'joinedUnits' : null}),
        numStep(`${a - 1} min ${s2} sec`, 'compute', `${a - 1} min ${s2} sec = ? sec`, B, {mis:v => v === (a - 1) * 60 ? 'forgotSmallPart' : v === (a - 1) * 100 + s2 ? 'joinedUnits' : null}),
        numStep('Subtract', 'compute', `${A} − ${B} = ?`, A - B, {mis:v => v === (a * 100 + s1) - ((a - 1) * 100 + s2) ? 'joinedUnits' : null, hint:() => 'Subtract the smaller time from the bigger one.'})], answerSteps:[2]};
  },
  moneyWord(lvl){
    const [e, n] = pick(LEMON_KIDS);
    if (lvl === 1) {
      const q = rand(1, 7), d = rand(1, 9), nk = rand(0, 5), tot = q * 25 + d * 10 + nk * 5;
      const coins = [`${q} quarter${q > 1 ? 's' : ''}`, `${d} dime${d > 1 ? 's' : ''}`, ...(nk ? [`${nk} nickel${nk > 1 ? 's' : ''}`] : [])];
      return {title:'Measuring Cups', ctx:`${q}q ${d}d ${nk}n`, bubble:`${n} has ${coins.slice(0, -1).join(', ')}${coins.length > 2 ? ',' : ''} and ${coins.at(-1)} for seed packets. How many cents is that?`,
        helper:'A quarter is 25¢, a dime is 10¢, a nickel is 5¢.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🪙 × ${q + d + nk}</div>`,
        steps:[numStep('Quarters', 'compute', `${q} × 25 = ?`, q * 25, {hint:() => 'Each quarter is 25 cents.'}), numStep('Dimes', 'compute', `${d} × 10 = ?`, d * 10, {fact:{x:d, y:10}}),
          ...(nk ? [numStep('Nickels', 'compute', `${nk} × 5 = ?`, nk * 5, {fact:{x:nk, y:5}})] : []),
          numStep('Total', 'compute', `${[q * 25, d * 10, ...(nk ? [nk * 5] : [])].join(' + ')} = ?`, tot, {mis:v => v === q + d + nk ? 'forgotSmallPart' : null})], answerSteps:[nk ? 3 : 2]};
    }
    if (lvl === 2) {
      const have = rand(2, 9), k = rand(2, 5), each = rand(3, Math.floor(have * 100 / k / 5)) * 5, cost = k * each;
      if (cost >= have * 100 || each >= 100) return GARDEN_WORD.moneyWord(lvl);
      return {title:'Measuring Cups', ctx:`$${have} − ${k} × ${each}¢`, bubble:`${n} has $${have}. ${n} buys ${k} seed packets for ${each}¢ each. How much change does ${n} get, in cents?`,
        helper:'Change the dollars to cents so everything is in the same unit.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 💵 $${have} · 🌱 ${each}¢ × ${k}</div>`,
        steps:[numStep('Dollars to cents', 'compute', `$${have} = ? cents`, have * 100, {mis:v => v === have * 10 ? 'wrongFactor' : v === have ? 'unitsDirection' : null, hint:() => 'Each dollar is 100 cents.'}),
          numStep('Cost', 'compute', `${k} × ${each} = ?`, cost, {}),
          numStep('Change', 'compute', `${have * 100} − ${cost} = ?`, have * 100 - cost, {})], answerSteps:[2]};
    }
    const coin = pick([[10, 'dimes'], [5, 'nickels'], [25, 'quarters']]), cnt = rand(6, 30), c = cnt * coin[0];
    return {title:'Measuring Cups', ctx:`${moneyTxt(c)} in ${coin[1]}`, bubble:`${n} paid ${moneyTxt(c)} for a flower pot, all in ${coin[1]}. How many ${coin[1]} did ${n} use?`,
      helper:'Change the money to cents, then see how many coins make that many cents.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🪴 ${moneyTxt(c)}</div>`,
      steps:[numStep('To cents', 'compute', `${moneyTxt(c)} = ? cents`, c, {mis:v => v === Math.floor(c / 100) ? 'unitsDirection' : null}),
        numStep('How many coins', 'compute', `${c} ÷ ${coin[0]} = ?`, cnt, {fact:coin[0] <= 12 && cnt <= 12 ? {x:coin[0], y:cnt, div:true} : undefined, mis:v => v === c * coin[0] ? 'unitsDirection' : null})], answerSteps:[1]};
  },
  metricWord(lvl){
    const [e, n] = pick(LEMON_KIDS);
    if (lvl === 1) {
      const U = pick([UNIT_PAIRS.mass[0], UNIT_PAIRS.volume[0], UNIT_PAIRS.length[0], UNIT_PAIRS.length[1]]), k = rand(2, 9);
      const thing = {kg:'bag of soil weighs', L:'rain barrel holds', km:'garden trail is', m:'row of carrots is'}[U[0]];
      return {title:'Measuring Cups', ctx:`${k} ${U[0]} = ? ${U[1]}`, bubble:`The ${thing} ${k} ${U[3]}. How many ${U[4]} is that?`, helper:'Metric units jump by 10, 100, or 1,000.',
        visual:`<div style="text-align:center; font-size:1.6rem">${e} ${k} ${U[0]}</div>`,
        steps:[convStep('length', U), numStep('Convert', 'compute', `${k} × ${commas(U[2])} = ?`, k * U[2], {mis:v => v === k ? 'unitsDirection' : [10, 100, 1000].some(g => g !== U[2] && g * k === v) ? 'wrongFactor' : null})], answerSteps:[1]};
    }
    if (lvl === 2) {
      const m = rand(2, 6), cm = rand(11, 95), add = rand(15, 95), tot = m * 100 + cm + add;
      return {title:'Measuring Cups', ctx:`${m} m ${cm} cm + ${add} cm`, bubble:`${n}'s hose is ${m} m ${cm} cm long. ${n} clips on a ${add} cm nozzle. How long is it now, in centimeters?`,
        helper:'Change meters to centimeters, then add.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🪱 ${m} m ${cm} cm + ${add} cm</div>`,
        steps:[numStep(`${m} m ${cm} cm`, 'compute', `${m} m ${cm} cm = ? cm`, m * 100 + cm, {mis:v => v === m * 10 + cm || v === m * 1000 + cm ? 'wrongFactor' : v === m * 100 ? 'forgotSmallPart' : null}),
          numStep('Add', 'compute', `${m * 100 + cm} + ${add} = ?`, tot, {})], answerSteps:[1]};
    }
    const m = rand(2, 6), piece = pick([20, 25, 50]), cnt = m * 100 / piece;
    return {title:'Measuring Cups', ctx:`${m} m ÷ ${piece} cm`, bubble:`${n} has ${m} meters of twine to tie up tomato plants. Each tie uses ${piece} cm. How many ties can ${n} make?`,
      helper:'Change meters to centimeters, then divide.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🍅 ${m} m ÷ ${piece} cm</div>`,
      steps:[numStep(`${m} m`, 'compute', `${m} m = ? cm`, m * 100, {mis:v => v === m * 10 || v === m * 1000 ? 'wrongFactor' : null}),
        numStep('Divide', 'compute', `${m * 100} ÷ ${piece} = ?`, cnt, {mis:v => v === m * 100 * piece ? 'unitsDirection' : null, hint:() => `How many ${piece}s are in ${m * 100}?`})], answerSteps:[1]};
  },
  customaryWord(lvl){
    const [e, n] = pick(LEMON_KIDS);
    if (lvl === 1) {
      const U = pick([UNIT_PAIRS.volume[1], UNIT_PAIRS.volume[6], UNIT_PAIRS.length[4], UNIT_PAIRS.length[5], UNIT_PAIRS.mass[1]]), k = rand(2, 9);
      const thing = {gal:'watering can holds', yd:'flower bed is', ft:'bean pole is', lb:'bag of seeds weighs'}[U[0]];
      return {title:'Measuring Cups', ctx:`${k} ${U[0]} = ? ${U[1]}`, bubble:`The ${thing} ${k} ${U[3]}. How many ${U[4]} is that?`, helper:'Know how many small units are in one big unit.',
        visual:`<div style="text-align:center; font-size:1.6rem">${e} ${k} ${U[0]}</div>`,
        steps:[convStep(U[0] === 'lb' ? 'mass' : U[0] === 'gal' ? 'volume' : 'length', U), numStep('Convert', 'compute', `${k} × ${U[2]} = ?`, k * U[2], {fact:U[2] <= 12 ? {x:k, y:U[2]} : undefined, mis:v => v === k ? 'unitsDirection' : null})], answerSteps:[1]};
    }
    if (lvl === 2) {
      const U = pick([UNIT_PAIRS.length[4], UNIT_PAIRS.length[5], UNIT_PAIRS.mass[1]]), k = rand(2, 9), r = rand(1, U[2] - 1), tot = k * U[2] + r;
      const thing = {yd:'garden path is', ft:'sunflower is', lb:'pumpkin weighs'}[U[0]];
      return {title:'Measuring Cups', ctx:`${k} ${U[0]} ${r} ${U[1]} = ? ${U[1]}`, bubble:`The ${thing} ${k} ${U[3]} ${r} ${unitWord(r, U[4])}. How many ${U[4]} is that?`, helper:'Change the big units, then add the small units.',
        visual:`<div style="text-align:center; font-size:1.6rem">${e} ${k} ${U[0]} ${r} ${U[1]}</div>`,
        steps:[numStep(`${k} ${U[0]}`, 'compute', `${k} ${U[0]} = ? ${U[1]}`, k * U[2], {fact:U[2] <= 12 ? {x:k, y:U[2]} : undefined, mis:v => v === k * 10 || v === k * 100 ? 'wrongFactor' : null}),
          numStep('Add the rest', 'compute', `${k * U[2]} + ${r} = ?`, tot, {mis:v => v === Number(`${k}${r}`) ? 'joinedUnits' : null})], answerSteps:[1]};
    }
    const g = rand(2, 4), used = rand(5, g * 16 - 3);
    return {title:'Measuring Cups', ctx:`${g} gal − ${used} c`, bubble:`${n} made ${g} gallons of lemonade for the garden party and poured ${used} one-cup glasses. How many cups are left?`,
      helper:'1 gallon = 16 cups. Change the gallons to cups, then subtract.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🥤 ${g} gal − ${used} c</div>`,
      steps:[numStep(`${g} gal`, 'compute', `${g} gal = ? c`, g * 16, {mis:v => v === g * 4 || v === g * 8 ? 'wrongFactor' : null, hint:() => '1 gallon = 4 quarts, 1 quart = 4 cups.'}),
        numStep('Subtract', 'compute', `${g * 16} − ${used} = ?`, g * 16 - used, {})], answerSteps:[1]};
  }
};

/* ----- station 2: area and perimeter ----- */
/* a rectangle (l across, w down) with side labels; a unit-square grid when grid is true */
function rectSVG(l, w, {grid = false, top = null, side = null, unit = ''} = {}){
  const s = Math.min(22, 220 / l, 150 / w), W = l * s, H = w * s, x0 = 34, y0 = 26;
  let g = `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" class="rect-fill"/>`;
  if (grid) { for (let i = 1; i < l; i++) g += `<line x1="${x0 + i * s}" y1="${y0}" x2="${x0 + i * s}" y2="${y0 + H}" class="rect-grid"/>`; for (let j = 1; j < w; j++) g += `<line x1="${x0}" y1="${y0 + j * s}" x2="${x0 + W}" y2="${y0 + j * s}" class="rect-grid"/>`; }
  g += `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" class="rect-edge"/>`;
  const t = top ?? `${l}${unit ? ' ' + unit : ''}`, sd = side ?? `${w}${unit ? ' ' + unit : ''}`;
  if (t !== '') g += `<text x="${x0 + W / 2}" y="${y0 - 8}" class="rect-lbl">${t}</text>`;
  if (sd !== '') g += `<text x="${x0 - 6}" y="${y0 + H / 2 + 5}" class="rect-lbl" text-anchor="end">${sd}</text>`;
  return `<svg class="rect-pic" viewBox="0 0 ${x0 + W + 12} ${y0 + H + 12}" width="${x0 + W + 12}" role="img" aria-label="rectangle ${t} by ${sd}">${g}</svg>`;
}
const AP_SITUATIONS = [['a fence around the garden', 'P'], ['grass seed to cover the lawn', 'A'], ['a border of bricks around the flower bed', 'P'], ['tiles to cover the patio', 'A'],
  ['mulch to cover the vegetable bed', 'A'], ['edging around the pond', 'P'], ['a tarp to cover the sandbox', 'A'], ['ribbon around the edge of the sign', 'P'],
  ['a rope around the pumpkin patch', 'P'], ['a rug for the greenhouse floor', 'A'], ['paint for the shed wall', 'A'], ['a path all the way around the lawn', 'P']];
const apMis = (l, w, want) => v => want === 'A' ? (v === 2 * (l + w) ? 'areaPerimeterSwap' : v === l + w ? 'addFactors' : null) : (v === l * w ? 'areaPerimeterSwap' : v === l + w ? 'halfPerimeter' : null);
const areaStep = (l, w, unit, extra = {}) => numStep('Area', 'compute', `${l} × ${w} = ? square ${unit}`, l * w, {fact:l <= 12 && w <= 12 ? {x:l, y:w} : undefined, mis:apMis(l, w, 'A'), hint:() => 'Area = length × width.', ...extra});
const perimStep = (l, w, unit, extra = {}) => numStep('Perimeter', 'compute', `${l} + ${w} + ${l} + ${w} = ? ${unit}`, 2 * (l + w), {mis:apMis(l, w, 'P'), hint:() => 'Add all four sides: 2 lengths and 2 widths.', ...extra});
const GARDEN_AP = {
  apSituation(lvl){
    const [what, kind] = pick(AP_SITUATIONS), l = rand(3, lvl === 1 ? 9 : 12), w = rand(2, l - 1), unit = pick(['feet', 'meters', 'yards']);
    const opts = choiceOf({text:kind === 'A' ? 'Area' : 'Perimeter'}, [{text:kind === 'A' ? 'Perimeter' : 'Area', mis:'areaPerimeterSwap'}]);
    const steps = [{name:'Area or perimeter?', type:'concept', kind:'choice', prompt:`For ${what}, do you need the area or the perimeter?`, options:opts,
      hint:() => kind === 'A' ? 'It covers the whole inside: that is area.' : 'It goes around the edge: that is perimeter.'}];
    if (lvl >= 2) steps.push(kind === 'A' ? areaStep(l, w, unit) : perimStep(l, w, unit));
    return {title:'Garden Beds', ctx:`${what} (${kind})`, bubble:lvl === 1 ? `I need ${what}. Do I need to know the area or the perimeter?` : `I need ${what}. It is ${l} ${unit} long and ${w} ${unit} wide. How much do I need?`,
      helper:'Around the edge is perimeter. Covering the inside is area.', visual:lvl === 1 ? '<div style="text-align:center; font-size:2rem">🌱🟩🌱</div>' : rectSVG(l, w, {unit:unit.slice(0, 2) === 'fe' ? 'ft' : unit === 'meters' ? 'm' : 'yd'}),
      steps, ...(lvl >= 2 ? {answerSteps:[1]} : {})};
  },
  rectMeasure(lvl){
    const sq = lvl === 3 && Math.random() < 0.4, l = lvl === 1 ? rand(3, 8) : lvl === 2 ? rand(4, 12) : rand(11, 25), w = sq ? l : rand(2, lvl === 1 ? l - 1 : Math.min(l - 1, 9)), unit = lvl === 1 ? 'units' : pick(['feet', 'meters']);
    const short = unit === 'units' ? '' : unit === 'feet' ? 'ft' : 'm';
    return {title:'Garden Beds', ctx:`${l} × ${w} rectangle`, bubble:sq ? `This square garden bed is ${l} ${unit} on each side. What are its area and perimeter?` : `This garden bed is ${l} ${unit} long and ${w} ${unit} wide. What are its area and perimeter?`,
      helper:lvl === 1 ? 'Count the squares inside for area. Count the edges all the way around for perimeter.' : 'Area = length × width. Perimeter = add all four sides.',
      visual:rectSVG(l, w, {grid:lvl === 1, unit:short, side:sq ? '' : null}),
      steps:[areaStep(l, w, unit), perimStep(l, w, unit)]};
  },
  apMissing(lvl){
    const l = rand(3, 12), w = rand(2, 9), unit = pick(['feet', 'meters', 'yards']), short = {feet:'ft', meters:'m', yards:'yd'}[unit];
    const kind = lvl === 1 ? 'A' : lvl === 2 ? 'P' : 'AP';
    if (kind === 'A') return {title:'Garden Beds', ctx:`area ${l * w}, width ${w}`, bubble:`A garden bed has an area of ${l * w} square ${unit}. It is ${w} ${unit} wide. How long is it?`,
      helper:'Area = length × width, so divide the area by the width.', visual:rectSVG(l, w, {top:'?', unit:short}),
      steps:[numStep('Length', 'compute', `${l * w} ÷ ${w} = ?`, l, {fact:{x:w, y:l, div:true}, hint:() => `${w} × what = ${l * w}?`})]};
    if (kind === 'P') {
      const P = 2 * (l + w);
      return {title:'Garden Beds', ctx:`perimeter ${P}, width ${w}`, bubble:`${pick(LEMON_KIDS)[1]} used ${P} ${unit} of fence around a garden bed. The bed is ${w} ${unit} wide. How long is it?`,
        helper:'Take away both widths. What is left is the two lengths together.', visual:rectSVG(l, w, {top:'?', unit:short}),
        steps:[numStep('Both lengths', 'compute', `${P} − ${w} − ${w} = ?`, 2 * l, {mis:v => v === P - w ? 'halfPerimeter' : null, hint:() => `The two widths use ${2 * w} ${unit}.`}),
          numStep('One length', 'compute', `${2 * l} ÷ 2 = ?`, l, {hint:() => 'The two lengths are the same.'})], answerSteps:[1]};
    }
    return {title:'Garden Beds', ctx:`area ${l * w}, length ${l}: perimeter`, bubble:`A garden bed has an area of ${l * w} square ${unit} and is ${l} ${unit} long. How much fence goes around it?`,
      helper:'Find the missing side first, then add all four sides.', visual:rectSVG(l, w, {side:'?', unit:short}),
      steps:[numStep('Width', 'compute', `${l * w} ÷ ${l} = ?`, w, {fact:l <= 12 ? {x:l, y:w, div:true} : undefined, hint:() => `${l} × what = ${l * w}?`}),
        perimStep(l, w, unit)], answerSteps:[1]};
  },
  apWord(lvl){
    const [e, n] = pick(LEMON_KIDS), unit = pick(['feet', 'meters']);
    if (lvl === 1) {
      const l = rand(3, 10), w = rand(2, 9), ask = pick(['A', 'P']);
      return {title:'Garden Beds', ctx:`${l} × ${w} ${ask}`, bubble:ask === 'A' ? `${n}'s strawberry patch is ${l} ${unit} long and ${w} ${unit} wide. How many square ${unit} of straw cover it?` : `${n}'s strawberry patch is ${l} ${unit} long and ${w} ${unit} wide. How many ${unit} of fence go around it?`,
        helper:'Covering is area. Going around is perimeter.', visual:`<div style="text-align:center; font-size:1.6rem">${e} 🍓 ${l} × ${w}</div>`, steps:[ask === 'A' ? areaStep(l, w, unit) : perimStep(l, w, unit)]};
    }
    if (lvl === 2) {
      const l1 = rand(4, 12), w1 = rand(2, 9), l2 = rand(4, 12), w2 = rand(2, 9);
      if (l1 * w1 === l2 * w2) return GARDEN_AP.apWord(lvl);
      const d = Math.abs(l1 * w1 - l2 * w2);
      return {title:'Garden Beds', ctx:`${l1}×${w1} vs ${l2}×${w2}`, bubble:`The pepper bed is ${l1} by ${w1} ${unit}. The bean bed is ${l2} by ${w2} ${unit}. How many more square ${unit} does the bigger bed have?`,
        helper:'Find each area, then subtract.', visual:`<div class="frac-pics">${rectSVG(l1, w1, {unit:unit === 'feet' ? 'ft' : 'm'})}${rectSVG(l2, w2, {unit:unit === 'feet' ? 'ft' : 'm'})}</div>`,
        steps:[areaStep(l1, w1, unit, {name:'Pepper bed'}), areaStep(l2, w2, unit, {name:'Bean bed'}), numStep('How many more', 'compute', `${Math.max(l1 * w1, l2 * w2)} − ${Math.min(l1 * w1, l2 * w2)} = ?`, d, {mis:v => v === Math.abs(2 * (l1 + w1) - 2 * (l2 + w2)) ? 'areaPerimeterSwap' : null})], answerSteps:[2]};
    }
    const w = rand(2, 9), l = rand(w + 1, 12), P = 2 * (l + w);
    return {title:'Garden Beds', ctx:`P ${P}, w ${w}: area`, bubble:`${n} put ${P} ${unit} of fence around a rectangle garden that is ${w} ${unit} wide. How many square ${unit} of soil does it need?`,
      helper:'Use the perimeter to find the length, then find the area.', visual:rectSVG(l, w, {top:'?', unit:unit === 'feet' ? 'ft' : 'm'}),
      steps:[numStep('Length', 'compute', `(${P} − ${w} − ${w}) ÷ 2 = ?`, l, {mis:v => v === P - w || v === P - 2 * w ? 'halfPerimeter' : null, hint:() => `Take away both widths (${2 * w}), then split what is left between the two lengths.`}),
        areaStep(l, w, unit)], answerSteps:[1]};
  }
};
const GARDEN_GEN = {convMass:convertGen('mass'), convVolume:convertGen('volume'), convLength:convertGen('length'), convTime:convertGen('time'), ...GARDEN_WORD, ...GARDEN_AP};
```
