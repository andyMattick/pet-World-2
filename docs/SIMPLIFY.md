# Scaling down and simplest form (Unit 1 café)

**Status: planned.** Read `AGENTS.md` first. **Edit in place, never rewrite a file.** The generator code below was fuzz-tested over 18,000 generated problems: every answer is a whole number, every divisor is valid, the last row is always in simplest form, and every choice set has exactly one right answer. **Paste it exactly. Don't rewrite it.**

## Why

Right now, every café ratio table only **scales up** (×2, ×3, …). Students never go **down**, so they never simplify a ratio. In Common Core 6th grade, simplifying is part of equivalent ratios: it's a ratio table going down, dividing both numbers by a common factor. It also sets up 7th grade proportions.

## What students get

All three additions appear only at **level 2 and up** for that skill (after 4 tries). Beginners learn scaling up first.

| Where | New problem | Steps | Mix-ups detected |
|---|---|---|---|
| **Kitchen → Ratio tables** (about 35% of problems at level 2+) | "I made way too much! Shrink my recipe." A table that starts from a **big batch** (like 12 : 18) with rows marked **÷ ?**. The last row is always the **simplest form** | Find the divisor, then divide the other amount, for each row | Subtracting instead of dividing (`additive`), dividing only one amount (`oneSideOnly`) |
| **Counter → Basic ratios** (level 2+, only when the counts can be simplified) | After writing the ratio (6 : 9), one more step: **write it in simplest form** (2 : 3) | Simplest form | Stopping too early (4 : 6 → `notSimplest`), writing it backwards (`reversed`), dividing one side (`oneSideOnly`) |
| **Kitchen → Equivalent ratios** (about 30% of problems at level 2+) | "My card says 12 to 18. What's the simplest way to write that?" Pick from 3 or 4 choices, then name the divisor | Pick simplest form, then name the divisor | `notSimplest`, `reversed`, `oneSideOnly`, `additive` |

Division steps carry times-table facts marked as division, so misses and slow answers trigger the usual **times-table drill** for the divisor. No new drill type is needed.

## Build steps

Commit after each step. Before each commit, run `npm run verify`, `npm run typecheck`, and `npm run build`, and **test in a real browser with the Console open**. Then `git push` and paste `git log -1 --stat`.

### Step 1: New mix-up in the registry

In `src/shared/registry.ts`, **add** this entry to `MIS`. Don't change the others.

```ts
  notSimplest: { name: 'Stops before simplest form', kid: 'Can you divide both numbers again?', tip: 'Ask: is there any number besides 1 that divides both? Divide by the biggest one (the GCF), or keep dividing until nothing does.', skills: ['basic', 'equiv', 'table'] },
```

Commit: `Add not-simplest mix-up`

### Step 2: Generator helpers

In `src/game/game.js`, paste this block **just above** the line `const GEN = {`, exactly as written:

```js
const divisorsOf = n => { const d = []; for (let i = 2; i <= n; i++) if (n % i === 0) d.push(i); return d; };
/* extra step for GEN.basic: only when the ratio can be simplified */
function simplestStep(target, labels){
  const g = gcd(target[0], target[1]);
  if (g < 2) return null;
  const s = [target[0] / g, target[1] / g];
  return {name:'Simplest form', type:'concept', kind:'ratio', labels,
    prompt:`Now write ${target[0]} : ${target[1]} in simplest form.`, answer:s,
    eq:v => Array.isArray(v) && v[0] === s[0] && v[1] === s[1],
    fact:{x:g, y:s[0] > 1 ? s[0] : s[1], div:true},
    mis:v => !Array.isArray(v) ? null
      : (v[0] === s[1] && v[1] === s[0]) ? 'reversed'
      : (v[0] * s[1] === v[1] * s[0] && gcd(v[0], v[1]) > 1) ? 'notSimplest'
      : ((v[0] === s[0] && v[1] === target[1]) || (v[0] === target[0] && v[1] === s[1])) ? 'oneSideOnly'
      : null,
    hint:() => `What number goes into both ${target[0]} and ${target[1]}? Divide both by it.`};
}
/* scale-down ratio table: start from a big batch and divide */
function tableDown(lvl){
  const r = pick(RECIPES), items = r.items;
  const [a, b] = coprimePair(lvl <= 2 ? 5 : 8, lvl <= 2 ? 5 : 8, 1);
  const m = weightedPick([4, 6, 8, 9, 10, 12].filter(x => x <= (lvl <= 2 ? 8 : 12)), x => factWeight(a > 1 ? a : b, x));
  const top = [a*m, b*m];
  const divs = divisorsOf(m).filter(d => d < m);
  const rowDivs = shuffle(divs).slice(0, lvl <= 2 ? 1 : 2).sort((p, q) => p - q);
  rowDivs.push(m);                                  // last row: all the way down to simplest form
  let tb = `<table class="ratio"><thead><tr><th>divide<br>by</th><th><span class="e">${items[0][0]}</span><br>${esc(items[0][1])}</th><th><span class="e">${items[1][0]}</span><br>${esc(items[1][1])}</th></tr></thead><tbody>
    <tr class="base"><td>big batch</td><td>${top[0]}</td><td>${top[1]}</td></tr>`;
  const steps = [];
  rowDivs.forEach((d, ri) => {
    const vals = [top[0]/d, top[1]/d], g = Math.random() < 0.5 ? 0 : 1, bl = 1 - g;
    const last = d === m;
    tb += `<tr><td><span class="times">÷</span>${slot('f'+ri)}</td>${[0,1].map(c => c === g ? `<td>${vals[c]}</td>` : `<td>${slot('v'+ri)}</td>`).join('')}</tr>`;
    steps.push({name:'Find the divisor', type:'concept', kind:'num', slot:'f'+ri,
      prompt:`Row ${ri+2}: the big batch was divided by what number?${last ? ' (This row is the smallest possible recipe.)' : ''}`,
      answer:d, fact:{x:vals[g], y:d, div:true},
      mis:v => v === top[g] - vals[g] ? 'additive' : null,
      hint:() => `${items[g][0]} went from ${top[g]} down to ${vals[g]}. ${top[g]} ÷ what = ${vals[g]}?`});
    steps.push({name:'Divide', type:'compute', kind:'num', slot:'v'+ri,
      prompt:`Row ${ri+2}: how many ${items[bl][0]} ${items[bl][1]}?`,
      answer:vals[bl], fact:{x:d, y:vals[bl], div:true},
      mis:v => v === top[bl] - (top[g] - vals[g]) ? 'additive' : v === top[bl] ? 'oneSideOnly' : null,
      hint:() => `This row is ÷${d}. ${top[bl]} ÷ ${d} = ?`});
  });
  tb += '</tbody></table>';
  return {title:`${r.name} (smaller batches)`, ctx:`${top[0]}:${top[1]}, ${rowDivs.map(d => '÷'+d).join(' ')}`,
    bubble:pick(["I made way too much! Can you shrink my recipe?", "I only need a small batch today. Help me scale it down!", "Let's find the smallest version of this recipe."]),
    helper:'Going down works the same way: find what the row was divided by, then divide the other amount.', visual:tb, steps};
}
/* extra choice problem for GEN.equiv at level 2+ */
function simplestChoice(lvl){
  const r = pick(RECIPES), [A, B] = r.items;
  const [a, b] = coprimePair(lvl <= 2 ? 5 : 7, lvl <= 2 ? 5 : 7, 2);
  const g = pickK(a, 2, lvl <= 2 ? 6 : 9), big = [a*g, b*g];
  const halfway = divisorsOf(g).filter(d => d < g);
  const opts = [{v:[a, b], ok:true, mis:null}, {v:[b, a], ok:false, mis:'reversed'}];
  if (halfway.length) { const d = pick(halfway); opts.push({v:[big[0]/d, big[1]/d], ok:false, mis:'notSimplest'}); }
  opts.push({v:[a, big[1]], ok:false, mis:'oneSideOnly'});
  const shown = shuffle(opts).map(o => ({html:`${o.v[0]} ${A[0]} : ${o.v[1]} ${B[0]}`, text:`${o.v[0]}:${o.v[1]}`, ok:o.ok, mis:o.mis}));
  return {title:'Simplest recipe', ctx:`${big[0]}:${big[1]}`,
    bubble:`My recipe card says ${big[0]} ${A[1]} to ${big[1]} ${B[1]}. What's the simplest way to write that?`,
    helper:'Simplest form: divide both numbers by the biggest number that goes into both.',
    visual:`<div style="text-align:center; font-size:1.8rem">${big[0]} ${A[0]} : ${big[1]} ${B[0]}</div>`,
    steps:[
      {name:'Pick simplest form', type:'concept', kind:'choice', prompt:`Which is ${big[0]} : ${big[1]} in simplest form?`, options:shown,
        hint:() => `What's the biggest number that goes into both ${big[0]} and ${big[1]}?`},
      {name:'Name the divisor', type:'compute', kind:'num', prompt:'Both numbers were divided by what?', answer:g, fact:{x:a, y:g},
        mis:v => v === big[0] - a ? 'additive' : null, hint:() => `${big[0]} ÷ what = ${a}?`}
    ]};
}
```

It uses functions already in `game.js`: `gcd`, `pick`, `shuffle`, `weightedPick`, `factWeight`, `pickK`, `coprimePair`, `slot`, `esc`, and `RECIPES`. Don't add copies of any of them.

This step adds functions but doesn't call them yet, so nothing should play differently. Commit: `Add scale-down and simplest-form generators`

### Step 3: Turn them on

Make exactly these three small edits inside `GEN`:

1. **Ratio tables:** as the **first line** inside `table(lvl){`, add:
   ```js
   if (lvl >= 2 && Math.random() < 0.35) return tableDown(lvl);
   ```
2. **Equivalent ratios:** as the **first line** inside `equiv(lvl){`, add:
   ```js
   if (lvl >= 2 && Math.random() < 0.3) return simplestChoice(lvl);
   ```
3. **Basic ratios:** in `basic(lvl){`, the returned object has a `steps:[ … ]` array ending with the "Write the ratio" step. Right **after** that array, add the simplest-form step when it applies, at level 2 and up. The simplest way:
   - Build the returned object in a variable, `const p = { … };`.
   - Then add:
     ```js
     if (lvl >= 2) { const extra = simplestStep(target, [X[0], whole ? '🧺' : Y[0]]); if (extra) p.steps.push(extra); }
     return p;
     ```
   - Change nothing else in `basic`.

**Browser test:** the easiest way to see level 2 problems is a student who has done 4 or more of that skill. Play several Kitchen shifts and check the following:
- A "smaller batches" table appears.
- Each ÷ box accepts the right divisor.
- The last row is in simplest form.
- A subtraction answer shows the "Ratios grow by multiplying, not by adding" nudge.

At the Counter, after 4 or more orders, a ratio like 6 : 9 asks for simplest form, and 4 : 6 is rejected with "Can you divide both numbers again?"

Commit: `Scale-down tables and simplest form in the café`

### Step 4: Safety check

In `scripts/verify.mjs`, **add** these checks without removing any:
- `game.js` contains `function tableDown(`, `function simplestStep(`, and `function simplestChoice(`.
- `registry.ts` contains `notSimplest:`.

Update the protected-files table in exactly `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md`, keeping them identical.

Commit: `Verify covers simplifying`

## Acceptance checks

1. **Level 1 is unchanged.** A student's first 4 problems of each skill never show scale-down or simplest form.
2. **Scale-down tables** show "big batch" at the top, **÷** boxes, whole-number answers, and a last row that can't be simplified further.
3. **Simplest form at the Counter** accepts only the fully simplified ratio. A partly simplified ratio is flagged `notSimplest`, and a backwards one is flagged `reversed`.
4. **The simplest-form choice** has exactly one right answer, and "Name the divisor" accepts the right number.
5. **Division misses** open the times-table drill for the divisor.
6. **The teacher dashboard** shows the new mix-up "Stops before simplest form" in small groups when it happens, and the new step names in each student's detail.
7. `npm run verify`, `npm run typecheck`, and `npm run build` pass, with no red Console errors while playing.
