# 4th grade, shop 2: the Toy Shop

**Status: stations 1 and 2 built; stations 3 (Toy Crates, multiplying) and 4 (Sharing Shelves, dividing) to come.** The generators are `TOYS_GEN` in `src/game/game.js` (stress-tested: 1,020,000 problems, 20,000 per skill and level; every answer checked against an independent calculation, including rounding, × and ÷ by 10 and 100, column addition and subtraction, number words, and "uses each digit once"). Read `AGENTS.md`, `GRADE4.md`, and `NEIGHBORHOODS.md` first. **Edit in place, never rewrite a file.**

The Toy Shop opens after the Lemonade Stand Unit Test (or with the teacher's "Open the Toy Shop for everyone"). Its unit test appears once stations 3 and 4 are built.

## Stations and skills (Sadlier lessons 6 to 9 so far, Khan's order)

| # | Station | Skills (ids) |
|---|---|---|
| 1 | 📦 Stock Room | Place value blocks (`pvBlocks`), Place value tables (`pvTable`), Identify value of a digit (`digitValue`), Creating largest or smallest number (`largestSmallest`), Write whole numbers in expanded form (`expandedForm`), Write numbers in written form (`writtenForm`), Write whole numbers in different forms (`differentForms`), Regroup whole numbers (`regroup`), Multiply whole numbers by 10 (`mult10`), Divide whole numbers by 10 (`div10`), Compare multi-digit numbers (`compareNums`), Compare multi-digit numbers written in different forms (`compareForms`) |
| 2 | 🏷️ Price Tags | Round whole numbers (`roundNum`), Round whole numbers to different place values (`roundPlaces`), Round whole numbers word problems (`roundWord`), Multi-digit addition (`addMulti`), Multi-digit subtraction (`subMulti`) |
| 3 | 🧸 Toy Crates | Lessons 10 and 11, multiplying (to be written) |
| 4 | 🗄️ Sharing Shelves | Lessons 12 and 13, dividing (to be written) |

Numbers grow with the level: up to 4 digits on level 1, 5 on level 2, and 6 (hundred thousands) on level 3.

## What students get

- **New pictures:** place-value blocks (🟥 thousands, 🟧 hundreds, ▮ tens, ▪ ones, with a key; level 3 has more than 9 of a block to regroup) and a place-value table with an optional hidden digit.
- **Writing numbers:** value of a digit (name the place, then its value), expanded form with one part missing, number words both ways, and standard form from expanded form (distractors leave out a zero placeholder).
- **Regrouping:** "3 thousands and 16 hundreds" (regroup, then the number).
- **× and ÷ by 10** (and 100 on level 3).
- **Comparing:** with >, <, =, including numbers with different lengths where the shorter one starts with a bigger digit, and comparing expanded form, words, or "6 thousands 4 hundreds" with a standard number.
- **Rounding:** "between which two?" first, then round, to the nearest ten through ten thousand.
- **Adding and subtracting:** the Scale's column answer boxes with optional carry and borrow boxes. Levels 2 and 3 always carry or regroup, and level 3 includes subtracting across zeros (80,000 − 2,551).

## Mix-ups

New: `placeValueRegroup`, `placeValueName`, `digitNotValue`, `placeOrder`, `numberWords`, `missingPlaceholder`, `shiftWrong`, `moreDigitsBigger`, `compareDigits`. Reused: `noRegroup`, `smallerFromLarger`, `roundWrong`.

## Rewards

Pets: 🐶 Patch the puppy, 🐰 Button the bunny, 🐒 Jojo the monkey, 🐘 Peanut the elephant, 🐼 Captain Cuddles the panda (legendary). Decorations: 🪀 Yo-yo rack, 🧩 Puzzle wall, 🚂 Toy train, 🎠 Carousel, 🎁 Golden gift box (legendary).

## Generator code (stress-tested)

```js
/* ===== 4th grade, Toy Shop stations 1 and 2 (Sadlier lessons 6 to 9): place value, rounding, adding and subtracting ===== */
const commas = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const PV_NAMES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands'];
const PV_VALUES = [1, 10, 100, 1000, 10000, 100000];
const digitsFor = lvl => lvl === 1 ? 4 : lvl === 2 ? 5 : 6;
/* a whole number with n digits; zeros allowed inside (never first), at least `minNonZero` non-zero digits */
function pvNumber(n, {zeros = true, distinct = false} = {}){
  for (let t = 0; t < 200; t++){
    const d = [rand(1, 9)]; for (let i = 1; i < n; i++) d.push(zeros ? rand(0, 9) : rand(1, 9));
    if (distinct && new Set(d).size < n) continue;
    return Number(d.join(''));
  }
  return Number('123456'.slice(0, n));
}
const ONES_W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS_W = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function words3(n){   // 0..999
  const h = Math.floor(n / 100), r = n % 100, parts = [];
  if (h) parts.push(`${ONES_W[h]} hundred`);
  if (r) parts.push(r < 20 ? ONES_W[r] : TENS_W[Math.floor(r / 10)] + (r % 10 ? '-' + ONES_W[r % 10] : ''));
  return parts.join(' ');
}
const numberWords = n => { const th = Math.floor(n / 1000), rest = n % 1000; return [th ? `${words3(th)} thousand` : '', rest ? words3(rest) : ''].filter(Boolean).join(' ') || 'zero'; };
const expandedParts = n => String(n).split('').map((d, i, a) => Number(d) * Math.pow(10, a.length - 1 - i)).filter(Boolean);
/* place-value blocks picture: 🟥 thousands, 🟧 hundreds, ▮ tens, ▪ ones */
const BLOCKS = [['▪', 'one'], ['▮', 'ten'], ['🟧', 'hundred'], ['🟥', 'thousand']];
function blocksHTML(counts){
  const groups = counts.map((c, i) => c ? `<div class="pv-group"><div class="pv-blocks">${BLOCKS[i][0].repeat(c)}</div><small>${c} ${BLOCKS[i][1]}${c === 1 ? '' : 's'}</small></div>` : '').reverse().join('');
  return `<div class="pv-pic">${groups}</div><div class="pv-key">🟥 = 1,000 · 🟧 = 100 · ▮ = 10 · ▪ = 1</div>`;
}
function pvTableHTML(n, hide){
  const s = String(n), cols = s.length;
  const head = PV_NAMES.slice(0, cols).reverse().map(p => `<th>${p.replace('hundred thousands', 'hundred th.').replace('ten thousands', 'ten th.')}</th>`).join('');
  const row = s.split('').map((d, i) => `<td>${hide === i ? '?' : d}</td>`).join('');
  return `<table class="pv-table"><tr>${head}</tr><tr>${row}</tr></table>`;
}
/* column addition and subtraction reuse the Scale's answer boxes (whole numbers have no decimal places) */
function wholeColumnStep(a, b, op){
  const exact = op === '+' ? a + b : a - b, sa = String(a), sb = String(b), k = x => x * 1000;
  const noCarry = op === '+' ? noCarryK(k(a), k(b)) / 1000 : smallerFromLargerK(k(a), k(b)) / 1000;
  return {name:op === '+' ? 'Add' : 'Subtract', type:'compute', kind:'digits', prompt:`${commas(a)} ${op === '+' ? '+' : '−'} ${commas(b)} = ?`,
    answer:String(exact), eq:v => v === exact, dig:digitLayout(sa, sb, op, k(exact)), slowOK:true,
    mis:v => v !== exact && v === noCarry ? (op === '+' ? 'noRegroup' : 'smallerFromLarger') : null,
    hint:() => op === '+' ? 'Add each column from the right. When a column makes 10 or more, carry the 1.' : 'Subtract from the right. When the top digit is smaller, regroup from the next column.'};
}
const TOY_ITEMS = [['🧸', 'teddy bears'], ['🪀', 'yo-yos'], ['🧩', 'puzzle pieces'], ['🎲', 'dice'], ['🪁', 'kites'], ['🚂', 'toy trains']];
const TOYS_GEN = {
  pvBlocks(lvl){
    const counts = lvl === 1 ? [rand(0, 9), rand(1, 9), rand(1, 9), 0] : lvl === 2 ? [rand(0, 9), rand(0, 9), rand(1, 9), rand(1, 4)] : [rand(0, 9), rand(0, 9), rand(0, 9), rand(1, 5)];
    if (lvl === 3 && Math.random() < 0.5) counts[rand(0, 2)] = rand(10, 13);          // more than 9 of a block: regroup in your head
    const n = counts.reduce((s, c, i) => s + c * PV_VALUES[i], 0);
    return {title:'Stock Room', ctx:`blocks ${counts.slice().reverse().join('-')}`, bubble:'I counted the blocks in the stock room. What number do they show?',
      helper:'Count each kind of block, then put the places together.', visual:blocksHTML(counts),
      steps:[{name:'Read the blocks', type:'concept', kind:'num', prompt:'What number do the blocks show?', answer:n, eq:v => v === n,
        mis:v => v !== n && v === Number(counts.slice().reverse().join('')) ? 'placeValueRegroup' : null,
        hint:() => counts.map((c, i) => c ? `${c} × ${commas(PV_VALUES[i])}` : '').filter(Boolean).reverse().join(' + ')}]};
  },
  pvTable(lvl){
    const n = pvNumber(digitsFor(lvl)), s = String(n), hide = rand(0, s.length - 1), place = s.length - 1 - hide;
    const read = Math.random() < 0.5;
    return {title:'Stock Room', ctx:`${commas(n)} table`, bubble:read ? 'This place-value table shows a number of toys. What is the number?' : `The table shows ${commas(n)}, with one digit hidden. What digit goes in the ${PV_NAMES[place]} place?`,
      helper:'Each column is a place. Read the digits from left to right.', visual:pvTableHTML(n, read ? -1 : hide),
      steps:[read ? {name:'Read the table', type:'concept', kind:'num', prompt:'What number does the table show?', answer:n, eq:v => v === n, hint:() => 'Read the digits across, left to right.'}
        : {name:'Find the digit', type:'concept', kind:'num', prompt:`What digit is in the ${PV_NAMES[place]} place of ${commas(n)}?`, answer:Number(s[hide]), eq:v => v === Number(s[hide]),
          mis:v => v !== Number(s[hide]) && v === Number(s[s.length - 1 - (place + 1)] ?? -1) ? 'placeValueName' : null, hint:() => `Count places from the right: ones, tens, hundreds, thousands…`}]};
  },
  digitValue(lvl){
    const n = pvNumber(digitsFor(lvl), {distinct:true}), s = String(n), i = rand(0, s.length - 2), d = Number(s[i]), place = s.length - 1 - i, val = d * PV_VALUES[place];
    return {title:'Stock Room', ctx:`value of ${d} in ${commas(n)}`, bubble:`The price code is ${commas(n)}. What is the value of the ${d}?`,
      helper:'The value of a digit is the digit times its place.', visual:pvTableHTML(n, -1),
      steps:[{name:'Name the place', type:'concept', kind:'choice', prompt:`Which place is the ${d} in?`,
          options:choiceOf({text:PV_NAMES[place]}, [PV_NAMES[place - 1], PV_NAMES[place + 1] || PV_NAMES[place - 2]].filter(Boolean).map(t => ({text:t, mis:'placeValueName'}))), hint:() => 'Count from the right: ones, tens, hundreds, thousands…'},
        {name:'Its value', type:'compute', kind:'num', prompt:`What is the value of the ${d} in ${commas(n)}?`, answer:val, eq:v => v === val,
          mis:v => v !== val && (v === d || v === d * PV_VALUES[place - 1] || v === d * (PV_VALUES[place + 1] || 0)) ? 'digitNotValue' : null, hint:() => `${d} × ${commas(PV_VALUES[place])}.`}]};
  },
  largestSmallest(lvl){
    const n = digitsFor(lvl) - (lvl === 1 ? 0 : 1), ds = shuffle(Array.from({length:10}, (_, i) => i)).slice(0, n);
    if (lvl >= 2 && !ds.includes(0)) ds[0] = 0;                                     // a zero, which can't go first
    const big = Number([...ds].sort((x, y) => y - x).join('')), nz = [...ds].sort((x, y) => x - y), first = nz.find(x => x > 0);
    const small = Number([first, ...nz.filter((x, i) => i !== nz.indexOf(first))].join(''));
    const askBig = Math.random() < 0.5, ans = askBig ? big : small;
    return {title:'Stock Room', ctx:`${askBig ? 'largest' : 'smallest'} from ${ds.join(',')}`, bubble:`Use each of these digits once: ${ds.join(', ')}. Make the ${askBig ? 'largest' : 'smallest'} number you can.`,
      helper:askBig ? 'Put the biggest digit in the biggest place.' : 'Put the smallest digit first, but a number can\'t start with 0.', visual:`<div style="text-align:center; font-size:1.8rem">${ds.map(d => `🔢${d}`).join(' ')}</div>`,
      steps:[{name:askBig ? 'Largest number' : 'Smallest number', type:'concept', kind:'num', prompt:`What is the ${askBig ? 'largest' : 'smallest'} number?`, answer:ans, eq:v => v === ans,
        mis:v => v !== ans && (askBig ? v === small : (v === big || v === Number(nz.join('')))) ? 'placeOrder' : null, hint:() => askBig ? 'Order the digits from biggest to smallest.' : 'Smallest non-zero digit first, then the rest from smallest to biggest.'}]};
  },
  expandedForm(lvl){
    let n; do { n = pvNumber(digitsFor(lvl)); } while (expandedParts(n).length < 3);
    const parts = expandedParts(n), hideI = rand(0, parts.length - 1), hid = parts[hideI], d = Number(String(hid)[0]);
    const shown = parts.map((p, i) => i === hideI ? '?' : commas(p)).join(' + ');
    return {title:'Stock Room', ctx:`${commas(n)} expanded`, bubble:`Write ${commas(n)} in expanded form.`, helper:'Expanded form adds the value of every digit.',
      visual:`<div style="text-align:center; font-size:1.4rem">${commas(n)} = ${shown}</div>`,
      steps:[{name:'Missing part', type:'concept', kind:'num', prompt:`${commas(n)} = ${shown}. What is the missing part?`, answer:hid, eq:v => v === hid,
        mis:v => v !== hid && (v === d || v === hid / 10 || v === hid * 10) ? 'digitNotValue' : null, hint:() => `Find the digit that's missing, then write its value with zeros.`}]};
  },
  writtenForm(lvl){
    const n = pvNumber(digitsFor(lvl)), w = numberWords(n), s = String(n);
    const swapped = Number(s.slice(0, -2) + s.slice(-1) + s.slice(-2, -1));
    const wrongs = [{text:numberWords(Number(s.slice(0, -1) + '0') + (Number(s.slice(-1)) + 1) % 10), mis:'numberWords'}, {text:numberWords(swapped), mis:'numberWords'},
      {text:w.replace(' thousand', ' hundred'), mis:'numberWords'}].filter(o => o.text !== w);
    const toWords = Math.random() < 0.5;
    const nums = [n, swapped, Number(s.slice(0, -1) + ((Number(s.slice(-1)) + 1) % 10))].map(commas);
    return {title:'Stock Room', ctx:`${commas(n)} in words`, bubble:toWords ? `How do you write ${commas(n)} in words?` : `Which number is "${w}"?`,
      helper:'Say the thousands part first, then the rest.', visual:`<div style="text-align:center; font-size:1.4rem">${toWords ? commas(n) : w}</div>`,
      steps:[toWords ? {name:'Number to words', type:'concept', kind:'choice', prompt:`Which words say ${commas(n)}?`, options:choiceOf({text:w}, wrongs), hint:() => `Split at the comma: ${commas(Math.floor(n / 1000))} thousand, then ${n % 1000}.`}
        : {name:'Words to number', type:'concept', kind:'num', prompt:`Write "${w}" as a number.`, answer:n, eq:v => v === n, mis:v => v !== n && nums.slice(1).map(x => Number(x.replace(/,/g, ''))).includes(v) ? 'numberWords' : null, hint:() => 'Write the thousands part, then three digits for the rest (use zeros if a place is empty).'}]};
  },
  differentForms(lvl){
    let n; do { n = pvNumber(digitsFor(lvl)); } while (!String(n).slice(1, -1).includes('0') && Math.random() < 0.7);
    const parts = expandedParts(n), exp = parts.map(commas).join(' + ');
    const noZero = Number(parts.map(p => String(p)[0]).join(''));                 // leaving out the zero placeholders
    const wrongs = [{text:commas(noZero), mis:'missingPlaceholder'}, {text:commas(n * 10), mis:'missingPlaceholder'}, {text:commas(Number(String(n).split('').reverse().join('')) || n + 1), mis:'placeOrder'}].filter(o => o.text !== commas(n));
    return {title:'Stock Room', ctx:`${exp}`, bubble:`Which number is ${exp}?`, helper:'Each part fills one place. Empty places get a 0.',
      visual:`<div style="text-align:center; font-size:1.4rem">${exp}</div>`,
      steps:[{name:'Standard form', type:'concept', kind:'choice', prompt:`Which number equals ${exp}?`, options:choiceOf({text:commas(n)}, wrongs), hint:() => 'Line up the parts by place. A place with no part gets a 0.'}]};
  },
  regroup(lvl){
    const places = lvl === 1 ? [2, 1] : lvl === 2 ? [3, 2] : pick([[3, 2], [4, 3], [2, 1]]), [hi, lo] = places;
    const a = rand(1, 9), b = rand(10, lvl === 1 ? 19 : 29), n = a * PV_VALUES[hi] + b * PV_VALUES[lo];
    return {title:'Stock Room', ctx:`${a} ${PV_NAMES[hi]} ${b} ${PV_NAMES[lo]}`, bubble:`A box holds ${a} ${PV_NAMES[hi]} and ${b} ${PV_NAMES[lo]}. What number is that?`,
      helper:`10 ${PV_NAMES[lo]} make 1 of the next place.`, visual:`<div style="text-align:center; font-size:1.4rem">${a} ${PV_NAMES[hi]} + ${b} ${PV_NAMES[lo]}</div>`,
      steps:[{name:'Regroup', type:'concept', kind:'num', prompt:`${b} ${PV_NAMES[lo]} = ? ${PV_NAMES[hi]} and ${b % 10} ${PV_NAMES[lo]}`, answer:Math.floor(b / 10), eq:v => v === Math.floor(b / 10), hint:() => `Every 10 ${PV_NAMES[lo]} make 1 of the ${PV_NAMES[hi]}.`},
        {name:'The number', type:'compute', kind:'num', prompt:`${a} ${PV_NAMES[hi]} and ${b} ${PV_NAMES[lo]} = ?`, answer:n, eq:v => v === n,
          mis:v => v !== n && v === Number(`${a}${b}`) * PV_VALUES[lo] ? 'placeValueRegroup' : null, hint:() => `${a} × ${commas(PV_VALUES[hi])} + ${b} × ${commas(PV_VALUES[lo])}.`}]};
  },
  mult10(lvl){
    const n = lvl === 1 ? rand(2, 99) : lvl === 2 ? rand(10, 999) * (Math.random() < 0.5 ? 10 : 1) : rand(100, 9999), times = lvl === 3 ? pick([10, 100]) : 10, ans = n * times;
    return {title:'Stock Room', ctx:`${n} × ${times}`, bubble:`Toys come in crates of ${times}. How many toys are in ${commas(n)} crates?`, helper:`Times 10 moves every digit one place to the left.`,
      visual:`<div style="text-align:center; font-size:1.6rem">${commas(n)} × ${times}</div>`,
      steps:[{name:'Multiply', type:'compute', kind:'num', prompt:`${commas(n)} × ${times} = ?`, answer:ans, eq:v => v === ans, mis:v => v !== ans && (v === n * times * 10 || v === n * times / 10 || v === n + times) ? 'shiftWrong' : null, hint:() => `Write ${commas(n)} and put ${times === 10 ? 'a 0' : 'two 0s'} on the end.`}]};
  },
  div10(lvl){
    const q = lvl === 1 ? rand(2, 99) : lvl === 2 ? rand(10, 999) : rand(100, 9999), by = lvl === 3 ? pick([10, 100]) : 10, n = q * by;
    return {title:'Stock Room', ctx:`${n} ÷ ${by}`, bubble:`${commas(n)} toys are packed into crates of ${by}. How many crates?`, helper:`Divided by 10 moves every digit one place to the right.`,
      visual:`<div style="text-align:center; font-size:1.6rem">${commas(n)} ÷ ${by}</div>`,
      steps:[{name:'Divide', type:'compute', kind:'num', prompt:`${commas(n)} ÷ ${by} = ?`, answer:q, eq:v => v === q, mis:v => v !== q && (v === q * 10 || v === q / 10 || v === n * by) ? 'shiftWrong' : null, hint:() => `Take ${by === 10 ? 'one 0' : 'two 0s'} off the end of ${commas(n)}.`}]};
  },
  compareNums(lvl){
    let a, b;
    const n = digitsFor(lvl);
    if (Math.random() < 0.4) { a = pvNumber(n); b = pvNumber(n - 1); if (Number(String(b)[0]) <= Number(String(a)[0])) b = Number('9' + String(b).slice(1)); }   // fewer digits but a bigger first digit
    else { a = pvNumber(n); const s = String(a).split(''), i = rand(1, n - 1); s[i] = String((Number(s[i]) + rand(1, 8)) % 10); b = Number(s.join('')); }
    if (Math.random() < 0.5) [a, b] = [b, a];
    if (a === b) b = a + 1;
    const right = a > b ? '>' : '<';
    const diffLen = String(a).length !== String(b).length;
    const opts = choiceOf({text:right}, ['>', '<', '='].map(t => ({text:t, mis:diffLen ? 'moreDigitsBigger' : 'compareDigits'})));
    return {title:'Stock Room', ctx:`${commas(a)} ? ${commas(b)}`, bubble:`Which shelf has more toys: ${commas(a)} or ${commas(b)}?`, helper:'More digits means bigger. Same number of digits: compare from the left.',
      visual:`<div style="text-align:center; font-size:1.6rem">${commas(a)} ◯ ${commas(b)}</div>`,
      steps:[{name:'Compare', type:'concept', kind:'choice', prompt:`${commas(a)} ◯ ${commas(b)}. Which symbol goes in the circle?`, options:opts.map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`})),
        hint:() => diffLen ? 'Count the digits first. The number with more digits is bigger.' : 'Start at the left. Find the first place where the digits are different.'}]};
  },
  compareForms(lvl){
    const n = pvNumber(digitsFor(lvl) - 1), parts = expandedParts(n);
    const other = Math.random() < 0.3 ? n : n + pick([1, -1]) * PV_VALUES[rand(0, String(n).length - 2)];
    const form = pick(['expanded', 'words', 'units']);
    const show = form === 'expanded' ? parts.map(commas).join(' + ') : form === 'words' ? numberWords(n) : String(n).split('').map((d, i, a) => d !== '0' ? `${d} ${PV_NAMES[a.length - 1 - i]}` : '').filter(Boolean).join(' ');
    const right = n > other ? '>' : n < other ? '<' : '=';
    return {title:'Stock Room', ctx:`${show} ? ${commas(other)}`, bubble:`Compare: ${show} and ${commas(other)}.`, helper:'Write both as regular numbers first, then compare.',
      visual:`<div style="text-align:center; font-size:1.3rem">${show}<br>◯ ${commas(other)}</div>`,
      steps:[{name:'Write it as a number', type:'concept', kind:'num', prompt:`Write ${show} as a number.`, answer:n, eq:v => v === n, mis:v => v !== n && v === Number(parts.map(p => String(p)[0]).join('')) ? 'missingPlaceholder' : null, hint:() => 'Put each part in its place. Empty places get a 0.'},
        {name:'Compare', type:'concept', kind:'choice', prompt:`${commas(n)} ◯ ${commas(other)}`, options:choiceOf({text:right}, ['>', '<', '='].map(t => ({text:t, mis:'compareDigits'}))).map(o => ({...o, html:`<span style="font-size:1.4rem">${o.text}</span>`})), hint:() => 'Compare from the left.'}]};
  },
  roundNum(lvl){ return roundProblem(lvl, false); },
  roundPlaces(lvl){ return roundProblem(lvl, true); },
  roundWord(lvl){
    const [e, item] = pick(TOY_ITEMS), place = lvl === 1 ? 1 : lvl === 2 ? 2 : 3, n = pvNumber(digitsFor(lvl)), r = roundTo(n, place), unit = PV_VALUES[place];
    const story = pick([`The toy shop sold ${commas(n)} ${item} this year. About how many is that, to the nearest ${PV_NAMES[place].replace(/s$/, '')}?`,
      `A crate holds ${commas(n)} ${item}. Round the number to the nearest ${PV_NAMES[place].replace(/s$/, '')} for the order form.`]);
    return {title:'Price Tags', ctx:`${commas(n)} to ${unit}`, bubble:story, helper:'Find the place, then look at the digit to its right.', visual:`<div style="text-align:center; font-size:1.6rem">${e} ${commas(n)}</div>`,
      steps:roundSteps(n, place)};
  },
  addMulti(lvl){
    const n = digitsFor(lvl) - (lvl === 3 ? 1 : 0); let a, b;
    do { a = pvNumber(n); b = pvNumber(n - (Math.random() < 0.4 ? 1 : 0)); } while (lvl >= 2 && noCarryK(a * 1000, b * 1000) === (a + b) * 1000);   // levels 2 and 3 always carry
    const [e, item] = pick(TOY_ITEMS);
    return {title:'Price Tags', ctx:`${a} + ${b}`, bubble:`The shop had ${commas(a)} ${item} and got ${commas(b)} more. How many now?`, helper:'Line up the places and add from the right.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${commas(a)} + ${commas(b)}</div>`, steps:[wholeColumnStep(a, b, '+')]};
  },
  subMulti(lvl){
    const n = digitsFor(lvl) - (lvl === 3 ? 1 : 0); let a, b;
    do { a = pvNumber(n); b = pvNumber(n - (Math.random() < 0.4 ? 1 : 0)); if (b > a) [a, b] = [b, a]; } while (a === b || (lvl >= 2 && smallerFromLargerK(a * 1000, b * 1000) === (a - b) * 1000));   // levels 2 and 3 always regroup
    if (lvl === 3 && Math.random() < 0.5) { a = Number(String(a)[0] + '0'.repeat(n - 1)); if (b >= a) b = pvNumber(n - 1); }   // across zeros: 5,000 − 1,234
    const [e, item] = pick(TOY_ITEMS);
    return {title:'Price Tags', ctx:`${a} − ${b}`, bubble:`The shop had ${commas(a)} ${item} and sold ${commas(b)}. How many are left?`, helper:'Line up the places and subtract from the right. Regroup when the top digit is smaller.',
      visual:`<div style="text-align:center; font-size:1.6rem">${e} ${commas(a)} − ${commas(b)}</div>`, steps:[wholeColumnStep(a, b, '-')]};
  }
};
const roundTo = (n, place) => Math.round(n / PV_VALUES[place]) * PV_VALUES[place];
function roundSteps(n, place){
  const unit = PV_VALUES[place], lo = Math.floor(n / unit) * unit, hi = lo + unit, r = roundTo(n, place), look = Math.floor(n / PV_VALUES[place - 1]) % 10;
  const word = PV_NAMES[place].replace(/s$/, '');
  return [{name:'Between which two?', type:'concept', kind:'choice', prompt:`${commas(n)} is between which two ${PV_NAMES[place]}?`,
      options:choiceOf({text:`${commas(lo)} and ${commas(hi)}`}, [{text:`${commas(lo - unit)} and ${commas(lo)}`, mis:'roundWrong'}, {text:`${commas(hi)} and ${commas(hi + unit)}`, mis:'roundWrong'}]), hint:() => `Keep the digits up to the ${word}s place, then make the rest zeros.`},
    {name:'Round', type:'concept', kind:'num', prompt:`Round ${commas(n)} to the nearest ${word}.`, answer:r, eq:v => v === r,
      mis:v => v !== r && (v === (r === lo ? hi : lo) || v === Math.floor(n / PV_VALUES[place - 1]) * PV_VALUES[place - 1]) ? 'roundWrong' : null,
      hint:() => `Look at the ${PV_NAMES[place - 1]} digit: it's ${look}. ${look >= 5 ? '5 or more rounds up.' : 'Less than 5 rounds down.'}`}];
}
function roundProblem(lvl, anyPlace){
  const n = pvNumber(digitsFor(lvl)), maxPlace = String(n).length - 1, place = anyPlace ? rand(1, maxPlace) : (lvl === 1 ? pick([1, 2]) : lvl === 2 ? pick([2, 3]) : pick([3, 4]));
  return {title:'Price Tags', ctx:`${commas(n)} to ${PV_VALUES[place]}`, bubble:`Round the price code ${commas(n)} to the nearest ${PV_NAMES[place].replace(/s$/, '')}.`,
    helper:'Find the place, then look at the digit just to its right: 5 or more rounds up.', visual:`<div style="text-align:center; font-size:1.8rem">🏷️ ${commas(n)}</div>`,
    steps:roundSteps(n, Math.min(place, maxPlace))};
}
```
