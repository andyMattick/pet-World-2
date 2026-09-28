# 6th grade, shop 8: the Pet Show

**Status: built (all 5 stations). With it, 6th grade is complete.** Khan Academy 6th grade, Unit 11: Data and statistics. The generators are `SHOW_GEN` in `src/game/game.js` (stress-tested: 720,000 problems, 20,000 per skill and level; every mean, median, quartile, IQR, and MAD recomputed independently, every "in order" choice checked). Read `AGENTS.md` and `NEIGHBORHOODS.md` first. **Edit in place, never rewrite a file.**

The Pet Show opens after the Pet Houses Unit Test (or with the teacher's "Open the Pet Show for everyone").

## Stations and skills (Khan's order)

| # | Station | Skills (ids) |
|---|---|---|
| 1 | 🏅 Judges' Table | Statistical questions (`statQ`), dot plots (`readDot`), histograms (`readHist`) |
| 2 | 📋 Score Cards | Mean (`meanCalc`), mean from a dot plot (`meanDisplay`), median (`medianDisplay`) |
| 3 | 🎀 Ribbon Ranges | Interquartile range (`iqr`), mean absolute deviation (`mad`) |
| 4 | 📦 Box Seats | Reading box plots (`readBox`), creating box plots (`makeBox`) |
| 5 | 🏆 Best in Show | Shape of distributions (`shapeDist`), comparing data displays (`cmpDisplays`) |

## Pictures

`dotPlotSVG(data)` (stacked dots), `histSVG(bins, label)` (bars over equal intervals with a count axis), and `boxPlotSVG(fiveNumbers)` (whiskers, box, and the median in berry). Box plots also appear as answer choices.

## What students get

- **Questions and displays:** statistical or not (does the answer vary?), counting dots with "more than" and "at most", the tallest histogram bar, and adding bars for "or more".
- **Center:** mean as add-then-divide, mean from a dot plot (value × number of dots), and median after choosing the list that is in order (with halfway answers like 13.5).
- **Spread:** Q1 and Q3 as medians of the lower and upper halves (leaving out the middle value when there is an odd number), IQR = Q3 − Q1, and MAD = the mean of the distances from the mean (answers like 4.4 or 2.25).
- **Box plots:** median, IQR, range, what percent lies in each part, and making one from a list: median, Q1, Q3, then picking the right plot.
- **Shape:** symmetric, skewed right, or skewed left (named for the tail), and which display shows every value, the median, or intervals.

## Mix-ups

New: `statQWrong`, `boundaryCount`, `binRead`, `meanNoDivide`, `meanMedianSwap`, `medianUnsorted`, `rangeNotIqr`, `madNoDivide`, `boxReadWrong`, `skewDirection`, `displayWrong`.

## Rewards

The Pet Show reward set was already in the registry.

## Generator code (stress-tested)

```js
/* ===== 6th grade, Pet Show (Khan unit 11): data and statistics ===== */
const sortN = a => [...a].sort((x, y) => x - y);
const medianOf = a => { const s = sortN(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
/* quartiles the 6th grade way: medians of the lower and upper halves, leaving out the middle value when n is odd */
const quartiles = a => { const s = sortN(a), n = s.length, lo = s.slice(0, Math.floor(n / 2)), hi = s.slice(Math.ceil(n / 2)); return [medianOf(lo), medianOf(hi)]; };
const sumOf = a => a.reduce((x, y) => x + y, 0);
const numTxt = x => String(parseFloat(x.toFixed(3)));
/* a typed answer that may be a decimal (a median of 7.5, a MAD of 2.25) */
const statStep = (name, prompt, v, extra = {}) => ({name, type:'compute', kind:'num', prompt, answer:numTxt(v), eq:u => typeof u === 'number' && Math.abs(u - v) < 1e-9, decimal:!Number.isInteger(v), slowOK:true, ...extra,
  ...(extra.mis ? {mis:u => typeof u === 'number' && Math.abs(u - v) < 1e-9 ? null : extra.mis(u)} : {})});
const near2 = (u, x) => typeof u === 'number' && Math.abs(u - x) < 1e-9;
/* dot plot: a dot for each value, stacked */
function dotPlotSVG(data, {lo = Math.min(...data), hi = Math.max(...data), label = ''} = {}){
  const w = 290, L = 18, R = w - 18, n = hi - lo || 1, step = (R - L) / n, X = v => L + (v - lo) * step, counts = {}, maxC = Math.max(...Object.values(data.reduce((c, v) => (c[v] = (c[v] || 0) + 1, c), {})));
  const r = Math.min(7, step / 2.4), dy = Math.min(2 * r + 2, 110 / maxC), base = 20 + maxC * dy;
  let g = `<line x1="${L - 6}" y1="${base}" x2="${R + 6}" y2="${base}" class="nl-line"/>`;
  for (let v = lo; v <= hi; v++) { g += `<line x1="${X(v)}" y1="${base - 4}" x2="${X(v)}" y2="${base + 4}" class="nl-line"/>`; if (n <= 14 || (v - lo) % 2 === 0) g += `<text x="${X(v)}" y="${base + 18}" class="nl-text nl-small">${v}</text>`; }
  data.forEach(v => { counts[v] = (counts[v] || 0) + 1; g += `<circle cx="${X(v)}" cy="${base - 4 - r - (counts[v] - 1) * dy}" r="${r}" class="dp-dot"/>`; });
  if (label) g += `<text x="${w / 2}" y="${base + 34}" class="nl-text nl-small">${esc(label)}</text>`;
  return `<svg class="num-line stat-pic" viewBox="0 0 ${w} ${base + (label ? 40 : 26)}" width="${w}" role="img" aria-label="dot plot">${g}</svg>`;
}
/* histogram: bins [[from, to, count]] */
function histSVG(bins, label){
  const w = 290, L = 34, R = w - 10, top = 14, bot = 150, maxC = Math.max(...bins.map(b => b[2])), bw = (R - L) / bins.length, Y = c => bot - c * (bot - top) / maxC;
  let g = `<line x1="${L}" y1="${top - 4}" x2="${L}" y2="${bot}" class="nl-line"/><line x1="${L}" y1="${bot}" x2="${R}" y2="${bot}" class="nl-line"/>`;
  for (let c = 0; c <= maxC; c++) if (maxC <= 10 || c % 2 === 0) g += `<text x="${L - 6}" y="${Y(c) + 4}" class="nl-text nl-small" text-anchor="end">${c}</text><line x1="${L}" y1="${Y(c)}" x2="${R}" y2="${Y(c)}" class="grid-line"/>`;
  bins.forEach(([a, b, c], i) => { g += `<rect x="${L + i * bw + 2}" y="${Y(c)}" width="${bw - 4}" height="${bot - Y(c)}" class="hist-bar"/><text x="${L + (i + 0.5) * bw}" y="${bot + 16}" class="nl-text nl-small">${a}–${b}</text>`; });
  g += `<text x="${(L + R) / 2}" y="${bot + 32}" class="nl-text nl-small">${esc(label)}</text>`;
  return `<svg class="num-line stat-pic" viewBox="0 0 ${w} ${bot + 38}" width="${w}" role="img" aria-label="histogram">${g}</svg>`;
}
/* box plot from a five-number summary */
function boxPlotSVG([mn, q1, md, q3, mx], {lo = mn - 2, hi = mx + 2} = {}){
  const w = 290, L = 16, R = w - 16, X = v => L + (v - lo) * (R - L) / (hi - lo), y = 30, span = hi - lo, step = span > 40 ? 10 : span > 20 ? 5 : span > 10 ? 2 : 1;
  let g = `<line x1="${X(mn)}" y1="${y}" x2="${X(q1)}" y2="${y}" class="nl-line"/><line x1="${X(q3)}" y1="${y}" x2="${X(mx)}" y2="${y}" class="nl-line"/>`
    + `<rect x="${X(q1)}" y="${y - 14}" width="${X(q3) - X(q1)}" height="28" class="box-rect"/><line x1="${X(md)}" y1="${y - 14}" x2="${X(md)}" y2="${y + 14}" class="box-med"/>`
    + `<line x1="${X(mn)}" y1="${y - 8}" x2="${X(mn)}" y2="${y + 8}" class="nl-line"/><line x1="${X(mx)}" y1="${y - 8}" x2="${X(mx)}" y2="${y + 8}" class="nl-line"/>`
    + `<line x1="${L}" y1="${y + 30}" x2="${R}" y2="${y + 30}" class="nl-line"/>`;
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) g += `<line x1="${X(v)}" y1="${y + 26}" x2="${X(v)}" y2="${y + 34}" class="nl-line"/><text x="${X(v)}" y="${y + 48}" class="nl-text nl-small">${v}</text>`;
  return `<svg class="num-line stat-pic" viewBox="0 0 ${w} ${y + 56}" width="${w}" role="img" aria-label="box plot">${g}</svg>`;
}
/* [emoji, pets, what the dot plot measures, how to say a value in a question] */
const PETS = [['🐕', 'dogs', 'weight (pounds)', n => `weigh ${n} pounds`], ['🐈', 'cats', 'age (years)', n => `are ${n} years old`], ['🐇', 'rabbits', 'carrots eaten', n => `ate ${n} carrots`], ['🐹', 'hamsters', 'wheel laps (hundreds)', n => `ran ${n} hundred laps`], ['🐦', 'birds', 'songs sung', n => `sang ${n} songs`]];
const listTxt = a => a.join(', ');
/* a data set of n values from lo to hi */
const dataSet = (n, lo, hi) => Array.from({length:n}, () => rand(lo, hi));
const STAT_QS = [
  ['How many hours do the students in my class sleep on school nights?', 'How many hours did Mia sleep last night?'],
  ['How much do the dogs at the pet show weigh?', 'How much does Rex the dog weigh?'],
  ['How many pets do the families on our street have?', 'How many pets does the Lopez family have?'],
  ['How long are the cats\' tails at the shelter?', 'Is the shelter open on Sundays?'],
  ['How many carrots does each rabbit at the farm eat in a day?', 'What color is the tallest rabbit?'],
  ['What are the ages of the horses in the parade?', 'How old is the oldest horse in the parade?']];
const SHOW_GEN = {
  /* ----- station 1: Judges' Table (statistical questions, dot plots, histograms) ----- */
  statQ(lvl){
    const [yes, no] = pick(STAT_QS);
    if (lvl === 1) { const ask = pick([yes, no]), isStat = ask === yes;
      return {title:"Judges' Table", ctx:`statQ ${isStat}`, bubble:`Is this a statistical question? "${ask}"`, helper:'A statistical question expects answers that vary: it asks about a group, not one thing.', visual:'<div style="text-align:center; font-size:2rem">🏅❓</div>',
        steps:[{name:'Statistical?', type:'concept', kind:'choice', prompt:`"${ask}"`, options:choiceOf({text:isStat ? 'Yes, it is statistical' : 'No, it has one answer'}, [{text:isStat ? 'No, it has one answer' : 'Yes, it is statistical', mis:'statQWrong'}]), hint:() => 'Would different members of the group give different answers?'}]}; }
    const others = shuffle(STAT_QS.filter(q => q[0] !== yes)).slice(0, 2).map(q => q[1]);
    return {title:"Judges' Table", ctx:`statQ pick`, bubble:'Which one is a statistical question?', helper:'A statistical question expects answers that vary.', visual:'<div style="text-align:center; font-size:2rem">🏅❓</div>',
      steps:[{name:'Which one', type:'concept', kind:'choice', prompt:'Which is a statistical question?', options:choiceOf({text:yes}, [no, ...others].map(t => ({text:t, mis:'statQWrong'}))), hint:() => 'Look for the question about a whole group, where answers vary.'}]};
  },
  readDot(lvl){
    const [e, what, label, say] = pick(PETS), lo = rand(1, 5), hi = lo + rand(6, 9), data = dataSet(rand(10, 18), lo, hi), cut = rand(lo + 2, hi - 2);
    const kind = lvl === 1 ? pick(['count', 'value']) : pick(['more', 'atMost', 'value']);
    const counts = {}; data.forEach(v => counts[v] = (counts[v] || 0) + 1);
    const T = {count:[`How many ${what} are in the show?`, data.length, null], value:[`How many ${what} ${say(`exactly ${cut}`)}?`, counts[cut] || 0, null],
      more:[`How many ${what} ${say(`more than ${cut}`)}?`, data.filter(v => v > cut).length, data.filter(v => v >= cut).length], atMost:[`How many ${what} ${say(`at most ${cut}`)}?`, data.filter(v => v <= cut).length, data.filter(v => v < cut).length]}[kind];
    if (T[1] === 0) return SHOW_GEN.readDot(lvl);
    return {title:"Judges' Table", ctx:`dot ${kind} ${cut}`, bubble:`The dot plot shows the ${label} of the ${what} at the pet show. ${T[0]}`, helper:'Each dot is one pet.', visual:dotPlotSVG(data, {lo, hi, label}),
      steps:[numStep('Count', 'concept', T[0], T[1], {mis:v => T[2] !== null && v === T[2] && T[2] !== T[1] ? 'boundaryCount' : null, hint:() => kind === 'more' ? `Do not count the ${cut}s.` : kind === 'atMost' ? `Count the ${cut}s too.` : 'Count the dots.'})]};
  },
  readHist(lvl){
    const [e, what] = pick(PETS), w = pick([5, 10]), start = w === 5 ? 0 : 10, bins = Array.from({length:rand(4, 6)}, (_, i) => [start + i * w, start + i * w + w - 1, rand(1, 9)]);   // [from, to, count]
    const label = w === 5 ? 'age (years)' : 'weight (pounds)', k = rand(1, bins.length - 2), from = bins[k][0];
    if (lvl === 1) {
      const top = Math.max(...bins.map(b => b[2])); if (bins.filter(b => b[2] === top).length > 1) return SHOW_GEN.readHist(lvl);
      const best = bins.find(b => b[2] === top);
      return {title:"Judges' Table", ctx:`hist most`, bubble:`The histogram shows the ${label} of the ${what}. Which interval has the most ${what}?`, helper:'The tallest bar has the most.', visual:histSVG(bins, label),
        steps:[{name:'Tallest bar', type:'concept', kind:'choice', prompt:'Which interval has the most?', options:choiceOf({text:`${best[0]}–${best[1]}`}, shuffle(bins.filter(b => b !== best)).slice(0, 3).map(b => ({text:`${b[0]}–${b[1]}`, mis:'binRead'}))), hint:() => 'Find the tallest bar, then read the interval under it.'}]};
    }
    const ans = sumOf(bins.slice(k).map(b => b[2])), inBin = bins[k][2];
    return {title:"Judges' Table", ctx:`hist ≥ ${from}`, bubble:`The histogram shows the ${label} of the ${what}. How many ${what} are ${from} or more?`, helper:'Add the heights of every bar from that interval on.', visual:histSVG(bins, label),
      steps:[numStep('Add the bars', 'compute', `${bins.slice(k).map(b => b[2]).join(' + ')} = ?`, ans, {mis:v => v === inBin && bins.length - k > 1 ? 'binRead' : v === bins.slice(k).length ? 'binRead' : null, hint:() => `The bars from ${from} on are ${bins.slice(k).map(b => b[2]).join(', ')}.`})]};
  },

  /* ----- station 2: Score Cards (mean and median) ----- */
  meanCalc(lvl){
    const n = rand(4, lvl === 1 ? 5 : 8), m = rand(3, lvl === 3 ? 40 : 15); let data;
    do { data = Array.from({length:n - 1}, () => m + rand(-m + 1, m)); const last = m * n - sumOf(data); data.push(last); } while (data.some(v => v <= 0) || new Set(data).size < 3 || medianOf(data) === m);
    data = shuffle(data); const [e, what] = pick(PETS), S = sumOf(data);
    return {title:'Score Cards', ctx:`mean of ${listTxt(data)}`, bubble:`The judges gave ${n} ${what} these scores: ${listTxt(data)}. What is the mean score?`, helper:'Mean = add all the values, then divide by how many there are.', visual:`<div style="text-align:center; font-size:1.5rem">${e} ${listTxt(data)}</div>`,
      steps:[numStep('Add them', 'compute', `${data.join(' + ')} = ?`, S, {}), numStep('Divide', 'compute', `${S} ÷ ${n} = ?`, m, {fact:fx(n, m, true), mis:v => v === S ? 'meanNoDivide' : v === medianOf(data) ? 'meanMedianSwap' : null})], answerSteps:[1]};
  },
  meanDisplay(lvl){
    const [e, what, label] = pick(PETS); let data, m;
    for (let t = 0; t < 500; t++) { const lo = rand(1, 6); data = dataSet(rand(5, lvl === 1 ? 8 : 12), lo, lo + rand(3, 6)); if (sumOf(data) % data.length === 0) { m = sumOf(data) / data.length; break; } }
    if (m === undefined) return SHOW_GEN.meanDisplay(lvl);
    const counts = {}; data.forEach(v => counts[v] = (counts[v] || 0) + 1); const vals = Object.keys(counts).map(Number).sort((a, b) => a - b);
    const S = sumOf(data), n = data.length, parts = vals.map(v => counts[v] > 1 ? `${counts[v]} × ${v}` : `${v}`);
    return {title:'Score Cards', ctx:`mean dot ${listTxt(sortN(data))}`, bubble:`The dot plot shows the ${label} of the ${what}. What is the mean?`, helper:'Several dots on one number means that value several times.', visual:dotPlotSVG(data, {label}),
      steps:[numStep('How many', 'concept', 'How many dots are there?', n, {}), numStep('Total', 'compute', `${parts.join(' + ')} = ?`, S, {mis:v => v === sumOf(vals) ? 'meanNoDivide' : null, hint:() => 'Multiply each value by its number of dots, then add.'}),
        numStep('Mean', 'compute', `${S} ÷ ${n} = ?`, m, {fact:fx(n, m, true), mis:v => v === S ? 'meanNoDivide' : v === medianOf(data) && v !== m ? 'meanMedianSwap' : null})], answerSteps:[2]};
  },
  medianDisplay(lvl){
    const [e, what, label] = pick(PETS), n = lvl === 3 ? pick([6, 8, 10, 12]) : pick([5, 7, 9, 11]), lo = rand(1, 8); let data; do { data = dataSet(n, lo, lo + rand(5, 12)); } while (new Set(data).size < 3);
    const med = medianOf(data);
    const unsorted = n % 2 ? data[(n - 1) / 2] : (data[n / 2 - 1] + data[n / 2]) / 2, mean = sumOf(data) / n;
    const showDot = lvl === 2;
    return {title:'Score Cards', ctx:`median ${listTxt(data)}`, bubble:showDot ? `The dot plot shows the ${label} of the ${what}. What is the median?` : `The ${what} scored ${listTxt(data)}. What is the median score?`, helper:'Put the values in order. The median is the middle one (or halfway between the two middle ones).',
      visual:showDot ? dotPlotSVG(data, {label}) : `<div style="text-align:center; font-size:1.4rem">${e} ${listTxt(data)}</div>`,
      steps:[{name:'In order', type:'concept', kind:'choice', prompt:'Which list is in order?', options:choiceOf({text:listTxt(sortN(data))}, [{text:listTxt(sortN(data).reverse())}, {text:listTxt(data), mis:'medianUnsorted'}, {text:listTxt([...sortN(data).slice(1), sortN(data)[0]])}]), hint:() => 'Smallest to largest.'},
        statStep('Median', `The median of ${listTxt(sortN(data))} = ?`, med, {mis:v => near2(v, unsorted) && unsorted !== med ? 'medianUnsorted' : near2(v, mean) && mean !== med ? 'meanMedianSwap' : null, hint:() => n % 2 ? `There are ${n} values: the middle one is number ${(n + 1) / 2}.` : `There are ${n} values: take halfway between numbers ${n / 2} and ${n / 2 + 1}.`})], answerSteps:[1]};
  },

  /* ----- station 3: Ribbon Ranges (IQR and MAD) ----- */
  iqr(lvl){
    const n = lvl === 1 ? pick([8, 10]) : pick([7, 9, 10, 11, 12]), lo = rand(1, 20), data = dataSet(n, lo, lo + rand(10, 30)), shown = lvl === 1 ? sortN(data) : data, [q1, q3] = quartiles(data), s = sortN(data);
    return {title:'Ribbon Ranges', ctx:`iqr ${listTxt(data)}`, bubble:`The ${pick(PETS)[1]} jumped these distances (inches): ${listTxt(shown)}. What is the interquartile range (IQR)?`, helper:'Order the data. Q1 is the median of the lower half, Q3 is the median of the upper half. IQR = Q3 − Q1.',
      visual:`<div style="text-align:center; font-size:1.3rem">📏 ${listTxt(shown)}</div>`,
      steps:[statStep('Q1', `Median of the lower half (${listTxt(s.slice(0, Math.floor(n / 2)))}) = ?`, q1, {}), statStep('Q3', `Median of the upper half (${listTxt(s.slice(Math.ceil(n / 2)))}) = ?`, q3, {}),
        statStep('IQR', `${numTxt(q3)} − ${numTxt(q1)} = ?`, q3 - q1, {mis:v => near2(v, s[n - 1] - s[0]) ? 'rangeNotIqr' : null})], answerSteps:[2]};
  },
  mad(lvl){
    const n = pick(lvl === 1 ? [4, 5] : [4, 5, 8, 10]); let data, m;
    for (let t = 0; t < 1000; t++) { m = rand(4, 20); data = Array.from({length:n - 1}, () => m + rand(-5, 5)); data.push(m * n - sumOf(data)); if (data.every(v => v > 0) && new Set(data).size > 2) break; }
    data = shuffle(data); const dev = data.map(v => Math.abs(v - m)), D = sumOf(dev), M = D / n;
    if (!Number.isInteger(M * 1000)) return SHOW_GEN.mad(lvl);
    return {title:'Ribbon Ranges', ctx:`mad ${listTxt(data)}`, bubble:`The ${pick(PETS)[1]} scored ${listTxt(data)}. What is the mean absolute deviation (MAD)?`, helper:'Find the mean, find how far each value is from the mean, then find the mean of those distances.',
      visual:`<div style="text-align:center; font-size:1.4rem">📏 ${listTxt(data)}</div>`,
      steps:[numStep('Mean', 'compute', `(${data.join(' + ')}) ÷ ${n} = ?`, m, {mis:v => v === sumOf(data) ? 'meanNoDivide' : null}), numStep('Distances', 'compute', `${dev.join(' + ')} = ?`, D, {hint:() => `Each distance from ${m}: ${data.map(v => `|${v} − ${m}| = ${Math.abs(v - m)}`).join(', ')}.`}),
        statStep('MAD', `${D} ÷ ${n} = ?`, M, {mis:v => v === D ? 'madNoDivide' : null})], answerSteps:[2]};
  },

  /* ----- station 4: Box Seats (box plots) ----- */
  readBox(lvl){
    const mn = rand(2, 20), q1 = mn + rand(2, 8), md = q1 + rand(1, 8), q3 = md + rand(1, 8), mx = q3 + rand(2, 10), five = [mn, q1, md, q3, mx], [e, what] = pick(PETS);
    const kind = lvl === 1 ? 'median' : lvl === 2 ? pick(['iqr', 'range']) : pick(['above', 'below', 'between']);
    const vis = boxPlotSVG(five);
    if (kind === 'median') return {title:'Box Seats', ctx:`box median ${five}`, bubble:`The box plot shows the scores of the ${what}. What is the median score?`, helper:'The line inside the box is the median.', visual:vis,
      steps:[numStep('Median', 'concept', 'Median = ?', md, {mis:v => v === q1 || v === q3 ? 'boxReadWrong' : v === Math.round((mn + mx) / 2) && v !== md ? 'boxReadWrong' : null})]};
    if (kind !== 'above' && kind !== 'below' && kind !== 'between') { const ans = kind === 'iqr' ? q3 - q1 : mx - mn;
      return {title:'Box Seats', ctx:`box ${kind} ${five}`, bubble:`The box plot shows the scores of the ${what}. What is the ${kind === 'iqr' ? 'interquartile range' : 'range'}?`, helper:kind === 'iqr' ? 'IQR = the right edge of the box − the left edge (Q3 − Q1).' : 'Range = maximum − minimum (the ends of the whiskers).', visual:vis,
        steps:[numStep(kind === 'iqr' ? 'IQR' : 'Range', 'compute', kind === 'iqr' ? `${q3} − ${q1} = ?` : `${mx} − ${mn} = ?`, ans, {mis:v => kind === 'iqr' && v === mx - mn ? 'rangeNotIqr' : kind === 'range' && v === q3 - q1 ? 'rangeNotIqr' : null})]}; }
    const Q = kind === 'above' ? [`What percent of the ${what} scored more than ${q3}?`, '25%'] : kind === 'below' ? [`What percent of the ${what} scored less than ${md}?`, '50%'] : [`What percent of the ${what} scored between ${q1} and ${q3}?`, '50%'];
    return {title:'Box Seats', ctx:`box ${kind} ${five}`, bubble:`The box plot shows the scores of the ${what}. ${Q[0]}`, helper:'Each whisker and each half of the box holds about 25% of the data.', visual:vis,
      steps:[{name:'What percent', type:'concept', kind:'choice', prompt:Q[0], options:choiceOf({text:Q[1]}, ['25%', '50%', '75%', '100%'].map(t => ({text:t, mis:'boxReadWrong'}))), hint:() => 'The four parts (whisker, half box, half box, whisker) each hold a quarter of the data.'}]};
  },
  makeBox(lvl){
    const n = lvl === 1 ? pick([7, 9]) : pick([8, 10, 11]), lo = rand(1, 15); let data; do { data = dataSet(n, lo, lo + rand(12, 25)); } while (new Set(data).size < n - 2);
    const s = sortN(data), [q1, q3] = quartiles(data), md = medianOf(data), five = [s[0], q1, md, q3, s[n - 1]];
    const hasHalf = five.some(v => !Number.isInteger(v)); if (hasHalf && lvl === 1) return SHOW_GEN.makeBox(lvl);
    const wrongB = [s[0], q1, (s[0] + s[n - 1]) / 2, q3, s[n - 1]];
    const range = {lo:s[0] - 2, hi:s[n - 1] + 2};
    const pics = [[five, true, null], [wrongB, false, 'boxReadWrong'], [[s[0], s[1], md, s[n - 2], s[n - 1]], false, 'boxReadWrong']].filter((p, i, arr) => arr.findIndex(q => q[0].join() === p[0].join()) === i);
    const opts = shuffle(pics.map(([f, ok, mis], i) => ({html:boxPlotSVG(f, range), text:`box ${f.join(' ')}`, ok, mis})));
    return {title:'Box Seats', ctx:`make box ${listTxt(data)}`, bubble:`Make a box plot of the ${pick(PETS)[1]}' scores: ${listTxt(data)}.`, helper:'Order the data and find the five numbers: minimum, Q1, median, Q3, maximum.',
      visual:`<div style="text-align:center; font-size:1.3rem">📦 ${listTxt(data)}</div>`,
      steps:[statStep('Median', `Median of ${listTxt(s)} = ?`, md, {mis:v => near2(v, (s[0] + s[n - 1]) / 2) && md !== (s[0] + s[n - 1]) / 2 ? 'boxReadWrong' : null}), statStep('Q1', `Q1 (median of ${listTxt(s.slice(0, Math.floor(n / 2)))}) = ?`, q1, {}),
        statStep('Q3', `Q3 (median of ${listTxt(s.slice(Math.ceil(n / 2)))}) = ?`, q3, {}), ...(opts.length >= 2 ? [{name:'Pick the plot', type:'concept', kind:'choice', prompt:`Which box plot shows ${five.map(numTxt).join(', ')}?`, options:opts, hint:() => 'Whiskers at the minimum and maximum, the box from Q1 to Q3, and the line at the median.'}] : [])],
      answerSteps:[opts.length >= 2 ? 3 : 0]};
  },

  /* ----- station 5: Best in Show (shape of data, choosing a display) ----- */
  shapeDist(lvl){
    const shape = pick(lvl === 1 ? ['symmetric', 'skewed right'] : ['symmetric', 'skewed right', 'skewed left']), lo = 1, hi = 11, data = [];
    const w = shape === 'symmetric' ? [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1] : shape === 'skewed right' ? [2, 5, 6, 5, 4, 3, 2, 2, 1, 1, 1] : [1, 1, 1, 2, 2, 3, 4, 5, 6, 5, 2];
    w.forEach((c, i) => { const k = Math.max(0, c + rand(-1, 0)); for (let j = 0; j < k; j++) data.push(lo + i); });
    const tail = {symmetric:'The data are about the same on both sides of the middle.', 'skewed right':'The data pile up on the left and trail off to the right.', 'skewed left':'The data pile up on the right and trail off to the left.'};
    return {title:'Best in Show', ctx:`shape ${shape}`, bubble:`What is the shape of this data?`, helper:'Skewed means a long tail. The tail\'s side names the skew: a tail to the right is skewed right.', visual:dotPlotSVG(data, {lo, hi, label:'score'}),
      steps:[{name:'Shape', type:'concept', kind:'choice', prompt:'Which describes the shape?', options:choiceOf({text:tail[shape]}, Object.entries(tail).filter(([k]) => k !== shape).map(([k, t]) => ({text:t, mis:(k === 'skewed left' && shape === 'skewed right') || (k === 'skewed right' && shape === 'skewed left') ? 'skewDirection' : null}))), hint:() => 'Where is the tall pile? Which way does the thin tail go?'}]};
  },
  cmpDisplays(lvl){
    const Q = pick([
      ['Which display shows every single value?', 'Dot plot', ['Histogram', 'Box plot']],
      ['Which display shows the median and the quartiles directly?', 'Box plot', ['Dot plot', 'Histogram']],
      ['Which display groups the values into equal intervals?', 'Histogram', ['Dot plot', 'Box plot']],
      ['Which display can you use to find the mean exactly?', 'Dot plot', ['Histogram', 'Box plot']],
      ['Which display lets you read the IQR without any math on the list?', 'Box plot', ['Histogram', 'Dot plot']]]);
    return {title:'Best in Show', ctx:Q[0], bubble:Q[0], helper:'Dot plots show each value. Histograms show counts in intervals. Box plots show the five-number summary.', visual:'<div style="text-align:center; font-size:2rem">📊 🟢 📦</div>',
      steps:[{name:'Which display', type:'concept', kind:'choice', prompt:Q[0], options:choiceOf({text:Q[1]}, Q[2].map(t => ({text:t, mis:'displayWrong'}))), hint:() => 'Think about what you can and can\'t see in each one.'}]};
  }
};
```
