# Drills: turn the times-table pop-up into a general review system

**Status: planned.** Build this before the Bakery (Unit 2).

Read `AGENTS.md` first. The same rules apply: **edit in place, never rewrite a file, and stop and ask if a step seems to need a rewrite.**

## Part 1: Design

### Why

Today, a missed or slow step with a times-table fact opens a practice ladder for that times table. It works well for ratios. Later units need different quick reviews, such as place value in the Bakery or percent benchmarks in the Market. Instead of building a new pop-up for each unit, generalize the one that already works.

### What stays exactly the same

**The times-table ladder must look and behave exactly as it does now.** That means:

- Rows `t × 1` through `t × max(10, other)`, answered one at a time.
- The row for the missed fact has a dashed outline.
- **Hints:**
  - On the first row, a wrong answer shows "Anything times 1 stays the same."
  - On any later row, it shows "Add t to (previous product)."
  - After 2 wrong tries on the same row, it shows "It's X. Type X."
- **Title:** "Let's practice the 7s!"
- **Why line**, depending on what triggered it:
  - after a miss: "That one was … Counting up by 7s makes it easier."
  - after a slow answer: "You got …, but it took a while. Let's make the 7s faster!"
  - after the sprint: "The 7s were tricky in that sprint. Let's practice them!"
- **Finish:** "You counted all the way to 7 × 10! +3 🪙", then the tie-back line, then the button.
- **Triggers:** a missed step, a slow step (15 seconds for idea steps, 10 for arithmetic), or the end of a sprint.
- **At most once per shift** for each drill.
- **The patience bar pauses** while the pop-up is open and resumes after.
- The same modal (`#practice`) and styles.

### What's new

- **A drill has a type and a key.**
  - `times:7` is the 7s times table.
  - `placeValue:tenths` is the tenths place.
  - `reciprocal:flip` is flipping fractions.
- **Each problem step can name the drill that fits it** (`st.drill`). Steps that name no drill but have a times-table fact (`st.fact`) keep getting the times drill, chosen exactly as today. **No Unit 1 generator changes.**
- **"Once per shift" is tracked per drill id** (`times:7`), not per number.
- **Drills are logged with their type and key**, in the save, in the database, on the dashboard, and in the progress report.

### Drill catalog

| Drill id | Unit | Ladder | When it triggers |
|---|---|---|---|
| `times:N` | all | N × 1 … N × 10 (as now) | missed or slow times-table fact, sprint |
| `placeValue:tenths` / `hundredths` / `thousandths` | Bakery | 6 rows: "In 3.472, which digit is in the tenths place?" with a new number each row | decimal add/subtract mix-ups (lining up right edges, digit-by-digit subtraction) |
| `decimalShift:10` / `100` / `1000` | Bakery, Market | 6 rows: 4.5 × 10, 0.45 × 10, 12.3 × 10 … (or ÷) | decimal-point placement mistakes when multiplying or dividing decimals |
| `reciprocal:flip` | Bakery | 6 rows: flip 3/4, 2/5, 5/2, 7, 1/6, 1 1/2 (as a fraction) | flipping the wrong fraction in fraction division |
| `simplify:N` | Bakery | 6 rows: simplify fractions whose common factor is N (6/9, 12/15, …) | answers left unsimplified, GCF slips |

Future units add their drills to this table when they're built (percent benchmarks, squares, number-line hops, undoing operations, halves, ordering numbers). **Only `times` is implemented in this task.** The Bakery task implements the others.

**Answers can be text,** such as `4/3` for a reciprocal. Compare answers after trimming spaces. A fraction answer accepts only its exact written form, so `4/3` doesn't match `8/6`.

## Part 2: Build steps

Commit after each step with the message given. Before each commit, run `npm run verify`, `npm run typecheck`, and `npm run build`, and report `git log -1 --stat`.

### Where things are now (in `src/game/game.js`; search by name)

| What | Name |
|---|---|
| Opens the pop-up | `openPractice(p, onClose)`, where `p = {table, other, reason, div, text}` |
| Decides which times table after a miss or slow answer | `queuePractice(fact, reason)`, called from `submit()` |
| Shows the pending pop-up after a step | inside `submit()`: `shift.practiced.add(p.table)` then `openPractice(...)` |
| Ladder rows, checking, finish, close | `ladderStep()`, `ladderCheck()`, `ladderDone()`, `closePractice()` |
| Sprint-end pop-up | end of `endSprint()`: builds `{table, other, reason:'sprint', …}` |
| Save field | `S.practiceLog[table] = {miss, slow, sprint}` |
| Database log | `Backend.log('practice_popups', {times_table, reason})` |
| Progress report list | `renderParent()`, built from `S.practiceLog` |
| Teacher dashboard | `src/teacher/report.ts`, reads `r.p` in two places |

### Step 1: Drill registry

In `src/shared/registry.ts`, **add** the following. Don't change anything that's already there.

```ts
export interface DrillType {
  name: string;                          // for teachers: "Times tables"
  unit: string;                          // building id, or 'all'
  teacherLabel: (key: string) => string; // "7s times table"
  kidTitle: (key: string) => string;     // "Let's practice the 7s!"
}
export const DRILLS: Record<string, DrillType> = {
  times:        { name: 'Times tables', unit: 'all',    teacherLabel: k => `${k}s times table`,       kidTitle: k => `Let's practice the ${k}s!` },
  placeValue:   { name: 'Place value',  unit: 'bakery', teacherLabel: k => `Place value (${k})`,      kidTitle: () => "Let's line up the places!" },
  decimalShift: { name: 'Moving the decimal', unit: 'bakery', teacherLabel: k => `Multiplying by ${k}`, kidTitle: k => `Let's slide the decimal (× ${k})!` },
  reciprocal:   { name: 'Reciprocals',  unit: 'bakery', teacherLabel: () => 'Flipping fractions',     kidTitle: () => "Let's flip some fractions!" },
  simplify:     { name: 'Simplifying',  unit: 'bakery', teacherLabel: k => `Simplifying by ${k}`,     kidTitle: k => `Let's simplify by ${k}!` }
};
/** "times:7" → "7s times table" */
export function drillLabel(id: string): string {
  const i = id.indexOf(':'), type = i < 0 ? 'times' : id.slice(0, i), key = i < 0 ? id : id.slice(i + 1);
  const d = DRILLS[type];
  return d ? d.teacherLabel(key) : id;
}
```

Commit: `Add drill registry`

### Step 2: Generalize the pop-up engine (times drill only)

In `src/game/game.js`:

1. **Keep the function name `openPractice`,** since `scripts/verify.mjs` checks for it. Change its argument to a drill: `openPractice(drill, onClose)`, where `drill = {type, key, reason, text, other, div}`. For times drills, `key` is the table as a string (`'7'`), and `other` and `div` keep their current meanings.

2. **Add a `DRILL_IMPL` object with one entry, `times`.** It builds what the ladder shows:
   - `title` from `DRILLS[type].kidTitle(key)`
   - the `why` line
   - `rows: [{label, answer}]`
   - `targetIndex`
   - `hint(rowIndex, wrongs)`
   - `finishLine`

   The `times` entry must produce **exactly** the text and rows listed under "What stays exactly the same" in Part 1. Copy the current strings from `openPractice`, `ladderCheck`, and `ladderDone`. Don't rephrase them.

3. **Make `ladderStep`, `ladderCheck`, and `ladderDone` read from the built rows,** not compute `t × k` inline. Compare answers as trimmed strings. The input may allow digits, `.`, `/`, and `-`.

4. **Replace `queuePractice(fact, reason)` with `queueDrill(st, reason)`.**
   - If `st.drill` exists, use it.
   - Otherwise, if `st.fact` exists, build a times drill using the **current** table-choosing logic (the divisor for division facts, the weaker table for multiplication). Keep it unchanged.
   - Skip the drill if `shift.practiced` already has `type + ':' + key`.
   - Update the call in `submit()`, and change `shift.practiced.add(p.table)` to add the drill id.

5. **In `endSprint()`,** build the sprint drill as `{type:'times', key:String(table), other, reason:'sprint', div:false, text}`, choosing the table exactly as today.

Test by hand: miss a times fact in the Kitchen, answer slowly, and finish a sprint with misses. The ladder must look and behave exactly as before.

Commit: `Generalize practice pop-up into drills`

### Step 3: Save format

1. **Add `drillLog: {}` to `fresh()`.**
2. **In `normalize()`,** if `drillLog` is missing, build it from `practiceLog`: each key `N` becomes `'times:N'`, with the same `{miss, slow, sprint}` counts. **Leave `practiceLog` in the save untouched,** so old backup codes still restore.
3. **In `openPractice`,** count into `S.drillLog[type + ':' + key]` rather than `S.practiceLog`.
4. **In `renderParent()`,** build the "pop-ups" list from `S.drillLog`, labeled with `drillLabel(id)` from the registry. Change the heading from "Times-table pop-ups" to "Practice pop-ups". For a save with only times drills, the list shows the same entries as before, as "7s times table (3)".

Commit: `Save drill history by type`

### Step 4: Database, logging, and teacher dashboard

1. **Add the provided migration file** `supabase/migrations/20260925000000_drills.sql` exactly as given. Don't edit it, and don't edit the older migration.
2. **Tell the owner to run it** in the Supabase SQL Editor: paste the whole file, then Run. It's safe to run before or after deploying the new code. Old app versions keep working, because `drill_key` falls back to `times_table`.
3. **In `openPractice`, change the log call to:**
   ```js
   Backend.log('practice_popups', {
     times_table: drill.type === 'times' ? Number(drill.key) : null,
     drill_type: drill.type, drill_key: String(drill.key), reason: drill.reason });
   ```
4. **In `src/teacher/report.ts`:**
   - Add `dr?: Record<string, {miss?: number; slow?: number; sprint?: number}>` to `StudentReport`.
   - In both places that read `r.p`, use `r.dr` when it has entries. Otherwise, fall back to `r.p`, treating its keys as `times:N`.
   - Label each entry with `drillLabel(id)`.
   - In the class view, the heading "Tables that triggered the most practice pop-ups" becomes "Most-triggered practice pop-ups".

Commit: `Log and report drills by type`

### Step 5: Safety check and instructions

1. **In `scripts/verify.mjs`, add these checks** without removing any:
   - `src/shared/registry.ts` contains `export const DRILLS` and `export function drillLabel`.
   - `src/game/game.js` contains `DRILL_IMPL` and `function queueDrill(`.
   - Some migration contains `drill_type`.
2. **Update the protected-files table** in `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md` (all three identical) to mention drills.

Commit: `Verify covers drills`

## Acceptance checks

1. **Missed fact:** in the Kitchen, answering a multiply step wrong opens the same 7s-style ladder as before, with the same title, rows, hints, finish text, and +3 coins.
2. **Slow step:** answering right but slowly opens the ladder with the "took a while" line.
3. **Sprint:** a sprint with misses opens the ladder for the most-missed table after the summary.
4. **Once per shift:** the same drill doesn't open twice in one shift. A different table still can.
5. **Patience bar:** it pauses during the pop-up and resumes after, with the speed bonus kept.
6. **Old save:** a save or backup code with an old `practiceLog` shows the same pop-up counts in the progress report, now labeled "7s times table."
7. **Database:** after running the migration, new `practice_popups` rows have `drill_type = 'times'` and `drill_key` set. Rows inserted with only `times_table` (old app) still work.
8. **Dashboard:** the teacher dashboard shows the same practice pop-up counts as before, with the new labels.
9. `npm run verify`, `npm run typecheck`, and `npm run build` pass.
