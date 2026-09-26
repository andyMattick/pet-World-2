# Station quizzes and unit tests

**Status: ready. Build after `BAKERY-0-ENGINE.md`** (it needs `SHOPS`) **and after `TEACHER-TOOLS.md` step 1** (its migration must be run first). It works for **every shop**, so the café gets quizzes too.

Read `AGENTS.md` first. **Edit in place, never rewrite a file.**

## How it works for students

### Station quiz

- **When it appears:** once **every skill in a station is mastered**, the station card shows a **📝 Station Quiz** button.
- **Length:** 2 problems per skill, at least 6 and at most 10, shuffled, covering every skill in the station.
- **It's a real quiz:**
  - **no steps**: she sees the order ticket and the picture, and gives **only the answer**
  - no Hint button, no helper tips, no practice pop-ups
  - no tip timer or reading cue
  - **one try per answer**, and a wrong answer ends that problem, with no answer shown, so answers can't leak
  - right and wrong answers both show a neutral **"Answer saved"** with no sound; ✓/✗ appears only on the summary
  - **"Question 3 of 10"** at the top, and no plan strip

**What counts as "the answer"** depends on the problem:

| Problem | She answers |
|---|---|
| Most problems | the final number or ratio |
| Ratio tables, scale-down tables, number lines | every blank amount in the table or line (the ×/÷ boxes stay blank and aren't asked) |
| Coordinate plane | each point to plot and the point to read |
| "Which is equivalent?" and "Simplest form?" choices | the choice only |
| Counter problems with simplest form | the ratio, then its simplest form |

The ticket, the picture, and any blanks stay on screen, so she knows exactly what to fill in. Mix-ups (like additive thinking) are still detected from her answers. The idea-versus-arithmetic split only comes from practice, since quizzes have no in-between steps.
- **Levels:** problems use the student's current level for each skill, **at least level 2**.
- **Leaving:** "Leave the quiz?" confirms that it won't count and she'll start fresh next time. There's no penalty.
- **Pass:** at least **80%** of problems fully right. That earns **+50 🪙**, a ✅ on the station card, and **the next station opens**.
- **Fail:** a friendly summary shows ✓ or ✗ per skill. Each missed skill needs **2 perfect practice problems** before a retake. A **Review practice** button starts a normal practice shift (hints and pop-ups on) using only the skills she still needs. When review is done, **Retake quiz** appears, with new problems every time. She also gets **+10 🪙** for trying.
- **Passing with a miss or two:** the summary lists those skills as "keep practicing," but review isn't required.

### Unit test

- **When it appears:** once **every station in the shop is built** (no "Coming soon" stations left) **and every station quiz is passed** (or excused by the teacher), a **🏆 Unit Test** card appears at the top of the shop. While the Bakery only has The Scale, there's no Bakery unit test yet.
- **Length:** 1 problem per skill, at least 8 and at most 16. That's 14 for the café and 16 for the Bakery.
- **Same rules as a quiz,** and the same review-then-retake cycle when failed.
- **Pass:** **+150 🪙**, a **"Café Master"** or **"Bakery Master"** stamp in the Sticker Book, and the shop's **legendary pet and decoration**. Passing the unit test now counts as unit mastery.

### Existing progress

- Stations **already open stay open**.
- The new "pass the quiz to open the next station" rule only applies to stations that aren't open yet.
- Quiz and test results **don't change practice mastery**. They're recorded separately, so a bad quiz doesn't take away a mastered skill.

## What teachers get

- **Settings tab → "Quizzes and tests" card:**
  - **quiz style: Answer only** (default) or **Show steps** (quizzes keep the practice steps, still without hints)
  - pass mark (50 to 100%)
  - problems per skill and the min and max for quizzes and tests
  - perfect review problems required (1 to 5)
  - **"Passing a station quiz opens the next station"** (on by default; off means stations open after 6 orders, as now)
- **Dashboard:**
  - A quiz column for each station, showing the best score (✅ 9/10), a failed score with the student in review (🔁 6/10), or **—** if not taken yet.
  - A unit test column.
  - A new small-group card: **"In review after a quiz,"** listing each student and their missed skills.
- **Student detail:**
  - quiz and test history (date, score, missed skills)
  - **Excuse quiz** (counts as passed)
  - **Clear review** (allows a retake right away)
  - Both are saved in `students.quiz_overrides`.
- **Live updates** when a quiz or test is finished.

## Data

The migration file `supabase/migrations/20260928000000_quizzes.sql` is provided. **Add it exactly as given, and don't edit it.** It:
- adds `mode` (`practice`, `quiz`, `test`) to `attempts` and `problems`
- adds an `assessments` table (one row per finished quiz or test) with student-insert and teacher-read rules
- adds `classes.quiz_settings` and `students.quiz_overrides`
- adds `qz` (history) and `qx` (overrides) to `class_report()`, and `quiz_settings` and `quiz_overrides` to `my_student()`

**It must run after the teacher-tools migration.**

## The rules code

The answer-step rule was tested against **every problem type** (the 14 café generators, the scale-down and simplest-form additions, and the 3 Scale generators), 2,400 problems each: every problem has at least one answer, no counting step is ever the answer, no ×/÷ helper box is ever asked, and every answer blank really exists in the picture.

The quiz rules were tested with all 5 shop sizes, 2,000 times each:
- every skill always appears
- questions are spread evenly across skills
- 8 of 10 passes and 7 of 10 fails at 80%
- the review cycle needs exactly the right number of perfect problems per missed skill
- out-of-range settings are clamped

Paste it exactly:

```js
/* ===== Station quizzes and unit tests: rules (no DOM) ===== */
const QUIZ_DEFAULTS = {
  passPct: 80,        // % of problems fully right to pass
  quizPerSkill: 2,    // problems per skill in a station quiz
  quizMin: 6, quizMax: 10,
  testPerSkill: 1,    // problems per skill in a unit test
  testMin: 8, testMax: 16,
  reviewPerfect: 2,   // perfect practice problems needed per missed skill before a retake
  requireQuiz: true,  // the next station opens after passing this station's quiz (instead of 6 orders)
  showSteps: false    // false: quizzes ask only for the answer; true: quizzes keep the practice steps
};
const clampInt = (v, lo, hi, d) => { const n = Math.round(typeof v === 'number' && isFinite(v) ? v : d); return Math.min(hi, Math.max(lo, n)); };
function quizSettings(raw){
  const r = raw && typeof raw === 'object' ? raw : {}, d = QUIZ_DEFAULTS;
  const s = {
    passPct: clampInt(r.passPct, 50, 100, d.passPct),
    quizPerSkill: clampInt(r.quizPerSkill, 1, 4, d.quizPerSkill),
    quizMin: clampInt(r.quizMin, 3, 20, d.quizMin), quizMax: clampInt(r.quizMax, 3, 20, d.quizMax),
    testPerSkill: clampInt(r.testPerSkill, 1, 3, d.testPerSkill),
    testMin: clampInt(r.testMin, 4, 30, d.testMin), testMax: clampInt(r.testMax, 4, 30, d.testMax),
    reviewPerfect: clampInt(r.reviewPerfect, 1, 5, d.reviewPerfect),
    requireQuiz: typeof r.requireQuiz === 'boolean' ? r.requireQuiz : d.requireQuiz,
    showSteps: typeof r.showSteps === 'boolean' ? r.showSteps : d.showSteps
  };
  if (s.quizMax < s.quizMin) s.quizMax = s.quizMin;
  if (s.testMax < s.testMin) s.testMax = s.testMin;
  return s;
}
/* list of skill ids, one per question: every skill appears, spread evenly, shuffled */
function assessmentPlan(skills, perSkill, min, max){
  if (!skills.length) return [];
  let n = Math.min(max, Math.max(min, skills.length * perSkill));
  n = Math.max(n, skills.length);                      // never leave a skill out
  const order = shuffle(skills.slice()), out = [];
  for (let i = 0; i < n; i++) out.push(order[i % order.length]);
  return shuffle(out);
}
/* results: [{skill, correct}] — a problem is correct only if every step was right on the first try */
function gradeAssessment(results, settings){
  const total = results.length, score = results.filter(r => r.correct).length;
  const passed = total > 0 && score * 100 >= settings.passPct * total;
  const missed = [...new Set(results.filter(r => !r.correct).map(r => r.skill))];
  return {score, total, passed, missed, review: passed ? [] : missed};
}
/* review tracking: S.review[key] = {skillId: perfectStillNeeded} */
const assessKey = (shop, station) => station == null ? `${shop}:test` : `${shop}:${station}`;
function startReview(S, key, skills, settings){
  if (!skills.length) { delete S.review[key]; return; }
  S.review[key] = Object.fromEntries(skills.map(sk => [sk, settings.reviewPerfect]));
}
function reviewCredit(S, skill, perfect){       // call after every practice problem
  if (!perfect) return;
  for (const key of Object.keys(S.review)) if (S.review[key][skill] > 0) S.review[key][skill]--;
}
const reviewDone = (S, key) => !S.review[key] || Object.values(S.review[key]).every(v => v <= 0);

/* Quiz and test problems ask only for the answer, not the in-between steps.
   Which steps are "the answer":
   - an explicit list on the problem (p.answerSteps, indexes), if a generator sets one
   - otherwise every fill-in box in the picture that isn't a multiplier or divisor
     (the blanks in ratio tables and number lines)
   - otherwise every point to plot plus the last step (coordinate plane)
   - otherwise the multiple-choice question, when the problem is a choice followed by a follow-up number
   - otherwise the last step (plus the step before it when the last one only simplifies it) */
const HELPER_STEP = /multiplier|divisor|jump/i;
function answerStepsFor(p){
  const s = p.steps;
  if (Array.isArray(p.answerSteps) && p.answerSteps.length) return p.answerSteps.map(i => s[i]).filter(Boolean);
  const fills = s.filter(st => st.slot && !HELPER_STEP.test(st.name));
  if (fills.length) return fills;
  const plots = s.filter(st => st.kind === 'grid');
  if (plots.length) return [...plots, s[s.length - 1]];
  const choice = s.findIndex(st => st.kind === 'choice');
  if (choice === 0 && s.length > 1 && /name the (multiplier|divisor)/i.test(s[s.length - 1].name)) return [s[choice]];
  const last = s[s.length - 1];
  if (/simplest form/i.test(last.name) && s.length > 1) return [s[s.length - 2], last];
  return [last];
}
```

## Build steps

Commit after each step with the message given. Before each commit, run `npm run verify`, `npm run typecheck`, and `npm run build`, and **test in a real browser with the Console open, including at iPhone SE size**. Then `git push` and paste `git log -1 --stat`.

### Step 1: Rules, state, and database

1. Add the migration file. **The owner runs it in Supabase.**
2. Paste the rules code above into `src/game/game.js`, just above `const GEN = {`. It uses the existing `shuffle`.
3. Add to `fresh()` and `normalize()`:
   - `review: {}`
   - `quizzes: {}`, where each key (`assessKey`) maps to `{passed, best, tries, lastAt}`
   - `stationsOpenedBefore: null`
4. **Grandfather existing progress:** the first time `normalize()` sees `stationsOpenedBefore === null`, record the stations open under the old rule without calling `stationOpen()`. Only include stations with skills: station 1 is open, and any later station is open when its previous station has at least `UNLOCK_AT` orders. In the café, also include stations at or below `minStation`. For example: `{cafe:[1,2,3], bakery:[1]}`.
5. In `src/lib/studentBackend.ts`, add `quiz_settings` and `quiz_overrides` to `StudentInfo`, and refresh them in `refreshSettings()`. The game reads its rules with `quizSettings(Backend.me?.quiz_settings)`, or `quizSettings(S.quizSettings)` in local mode.

Commit: `Quiz rules and state`

### Step 2a: Start an assessment and ask questions

1. Add `startAssessment(shop, station)`, where `station` is `null` for a unit test.
    - Build the question list with `assessmentPlan()`.
    - Store `shift.mode = 'quiz'` or `'test'`, the plan, and the results.
    - Reuse the existing shift screen and generators. Each problem uses `GEN[skill](Math.max(2, lvlOf(skill)))`.
2. Unless `showSteps` is on, replace the problem's steps with `answerStepsFor(p)` before the first step activates (`order.p.steps = answerStepsFor(order.p)`). Hide the plan strip; blanks for skipped steps stay empty in the picture.
3. One try per answer: a wrong answer records the result, briefly shows "Answer saved" (no right answer), and moves to the next problem.
4. Replace the customer dots with **"Question X of N."**
5. `recordProblem()` / `kr` are **not** updated. `recordStep()`, mix-up recording, and fact stats **are** updated, since they're useful to teachers.

### Step 2b: Assessment behavior and results

1. **While `shift.mode !== 'practice'`:**
    - Hide the Hint button, helper tips, the tip bar, and the reading cue.
    - `shouldDrill()` returns false.
    - No tips, streak changes, or reward unlock checks happen per problem.
2. **Leaving mid-assessment** asks for confirmation, then discards it with no record.
3. **At the end:**
   - Run `gradeAssessment()`.
   - Update `S.quizzes[key]`.
   - Call `startReview()` on a fail, or clear the review on a pass.
   - Pay +50 / +150 🪙 on a pass (+10 on a fail).
   - Show the summary: score, ✓/✗ per skill (using `SKILLS[id].name`), and buttons for **Review practice**, **Retake** (only when `reviewDone`), and **Back to the shop**.

Commit: `Quiz and test mode`

### Step 3: Station cards, unlocking, and review practice

1. **Station cards** show one of:
   - **📝 Station Quiz**, when every skill is mastered and there's no unfinished review
   - **✅ Quiz passed (9/10)**
   - **🔁 Review: 2 skills to practice**, with a Review practice button
   - **Retake quiz**, when review is done
2. **`stationOpen(shop, n)`,** when `requireQuiz` is on: station n > 1 is open if it's in `stationsOpenedBefore`, or the quiz for station n − 1 is passed or excused (`quiz_overrides[key] === 'excused'`), or the café teacher's `minStation` covers it. When `requireQuiz` is off, the current 6-order rule applies.
3. **Review practice:** a normal practice shift whose `chooseSkill()` picks only from skills with review still needed. After every practice problem anywhere, call `reviewCredit(S, skill, perfect)`. When `quiz_overrides[key] === 'cleared'`, treat the review as done.

Commit: `Station quizzes on the shop floor`

### Step 4: Unit test

1. A **🏆 Unit Test** card sits at the top of the shop floor. It's hidden while any station in the shop has an empty `skills` list, and locked with "Pass every station quiz first" until every quiz is passed or excused.
2. Passing it sets `S.quizzes['<shop>:test'].passed`. In `ruleMet()`, `unitMastery` for a unit is also met when that unit's test is passed. Show the "<Shop> Master" stamp on that shop's Sticker Book page.

Commit: `Unit tests`

### Step 5: Logging

1. In quiz and test mode, do **not** log to `problems` at all. Keep `mode: shift.mode || 'practice'` on `attempts` logs. The `assessments` row is the quiz or test record.
2. At the end of an assessment, log `Backend.log('assessments', {shop, station, kind, score, total, passed, missed_skills: missed})`. Add `'assessments'` to the backend's table list.
3. In the teacher report, practice statistics must **exclude** quiz and test rows. Label quiz results separately in the detail view from `qz`.

Commit: `Log quizzes and tests`

### Step 6: Teacher app

1. **Settings tab:** the "Quizzes and tests" card, saved to `classes.quiz_settings`. **Reset to defaults** saves `{}`.
2. **Dashboard:**
   - Add quiz columns per station and a unit test column to the skill grid, for the selected shop tab.
   - Add the "In review after a quiz" small-group card.
   - Subscribe to realtime inserts on `assessments` the same way as `problems`.
3. **Student detail:** quiz and test history, plus **Excuse quiz** and **Clear review** per station or test. These save to `students.quiz_overrides` through a callback from `main.ts`, with no second Supabase client.

Commit: `Teacher quiz controls`

### Step 7: Safety check

In `scripts/verify.mjs`, **add** these checks without removing any:
- `game.js` contains `function assessmentPlan(`, `function gradeAssessment(`, `function startAssessment(`, `function answerStepsFor(`, and `shift.mode`.
- Some migration contains `create table if not exists public.assessments`.

Update the three instruction files, keeping them identical.

Commit: `Verify covers quizzes`

## Acceptance checks

1. A station with every skill mastered shows **📝 Station Quiz**. A station without that doesn't.
2. During a quiz there are no steps, hints, pop-ups, or tip timer. Only the answer is asked (every blank for tables and number lines, both parts for "ratio, then simplest form"). A wrong answer ends that problem without showing the right one, and "Question X of N" counts up. With **Show steps** on, the practice steps return, still without hints.
3. 8 of 10 passes and 7 of 10 fails (at 80%). Passing opens the next station and pays +50 🪙.
4. After a fail, **Review practice** only serves the missed skills, and **Retake** appears after 2 perfect problems of each. A retake has new problems.
5. Stations that were open before this change stay open.
6. The unit test appears after every quiz is passed. Passing gives the Master stamp and the legendary items.
7. Leaving mid-quiz records nothing.
8. The teacher sees quiz columns, the review group, and the history, and can change settings, excuse a quiz, and clear a review. Changes apply at the student's next visit to the shop.
9. **Local mode** works the same, with no logging.
10. `npm run verify`, `npm run typecheck`, and `npm run build` pass, with no red Console errors.
