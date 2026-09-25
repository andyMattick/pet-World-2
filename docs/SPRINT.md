# Fact Sprint upgrades

**Status: planned.** There are two parts:
- **Part A:** auto-advance. It's small and can be built **now**.
- **Part B:** mixing unlocked skills into the sprint. Build it **after** `DRILLS.md` and `DRILL-SETTINGS.md`.

Read `AGENTS.md` first. **Edit in place, never rewrite a file.**

## Where things are now (in `src/game/game.js`; search by name)

| What | Name |
|---|---|
| Next question | `nextFact()`. Picks a times-table pair, weighted toward weak facts |
| Typing | the `input` listener on `#spInput`, which keeps only digits |
| Checking | the `keydown` listener on `#spInput`, which runs on Enter. It logs the fact, then either scores it or shows the answer for 1.3 seconds and re-queues it |
| Finish | `endSprint()`. Power-up, summary, and the drill for the most-missed table |

## Part A: Auto-advance when the answer is right

### Behavior

- **As soon as the typed value equals the answer,** the sprint counts it right and moves to the next question. There's no Enter. Use the same green flash and sound as now.
- **Wrong answers still need Enter.** Pressing Enter on a wrong answer works exactly as it does now.
- **Deleting and retyping counts as a miss.** If, before getting it right, the box ever held a **wrong value with at least as many digits as the answer** (for example, `54` for 7 × 8, then deleted and retyped as `56`), the answer is a **correction**:
  - It still advances and still scores for the power-up.
  - It's logged as `correct: false` in the times-table stats and in `Backend.log('attempts', …)`, with `answer` set to the wrong value.
  - Guessing by retyping never looks like fluency to a teacher.
- **Timing** for slow detection and pace runs from the moment the question appears to the moment of auto-advance.
- **Instruction line under the box:** "Type the answer. It moves on by itself when it's right. Press Enter to check a different answer."

### Build step A1

1. In the `input` listener, after filtering digits:
   - Compare the value to the current answer.
   - If the value has as many digits as the answer and doesn't match, set `sp.hadWrong = true`, and remember the value as `sp.wrongValue`.
   - If it matches, call the same "right answer" path the Enter handler uses. Pass `corrected: sp.hadWrong`.
2. **Split the Enter handler's body into `sprintAnswer(value, {corrected})`,** so Enter and auto-advance share it. When `corrected` is true, log it as a miss (as described above), but still count it toward `sp.correct` and move on without the 1.3-second pause.
3. Reset `sp.hadWrong` and `sp.wrongValue` in `nextFact()`.
4. Guard against double-counting: once a question is answered, ignore further input until `nextFact()` runs. The existing `sp.lock` can do this.

**Acceptance checks**
- Typing `56` for 7 × 8 moves on instantly, with no Enter.
- Typing `54`, then Enter, shows the answer as now.
- Typing `54`, deleting it, and typing `56` moves on but logs a miss.
- The power-up, summary, and end-of-sprint drill still work.

Commit: `Sprint auto-advances on correct answers`

## Part B: Unlocked skills join the sprint

### Behavior

- **The sprint mixes quick questions from every drill type the student has unlocked,** not just times tables.
- **Times tables are always in.** A drill type **unlocks for the sprint** once the student has finished at least **one problem at the station that introduces it** (see the registry field below).
- **Teachers' drill settings apply.** A drill type turned off with `drillTypeOn` never appears in the sprint.
- **The mix:**
  - About **60% times tables** (weighted toward weak facts, as now).
  - About **40% from other unlocked types**, weighted toward the types with the most recent misses and slow answers in `S.drillLog`.
  - With only times tables unlocked, the sprint is 100% times tables, exactly as now.
- **Every question auto-advances** the same way as Part A.
- **The end-of-sprint drill** goes to the type and key with the most misses in the run, not always a times table.
- **The summary's "Tricky ones"** lists the missed questions from every type.

### Build steps

**B1. Registry:** add an optional `sprintUnlock?: { unit: string; station: number }` to `DrillType` in `src/shared/registry.ts`. `times` has none (always unlocked). Set it for the Bakery drills when the Bakery is built. Commit: `Add sprint unlock to drill registry`

**B2. Quick questions:** give each `DRILL_IMPL` entry a `sprintItem(key)` that returns `{prompt, answer, drillId, fact?}`.
- For `times`, it reproduces today's `nextFact()` pick. The prompt is `7 × 8`, and `fact` is `{x, y}`.
- Answers are compared as trimmed strings.
- The input filter allows digits, `.`, `/`, and `-` when the current item's answer contains them. Otherwise, digits only as now.

Commit: `Drills can make sprint questions`

**B3. The mix:** change `nextFact()` to pick a drill type by the rules above, then call its `sprintItem`.
- Log non-times answers as `Backend.log('attempts', {shop:'sprint', skill:'drill:' + type, step:key, step_type:'fact', …})`, with `fact_a` and `fact_b` null.
- Times answers are logged exactly as now.

Commit: `Sprint mixes unlocked skills`

**B4. Checks:** add these to `scripts/verify.mjs`:
- `game.js` contains `function sprintAnswer(`.
- `game.js` contains `sprintItem(`.

Update the three instruction files, keeping them identical. Commit: `Verify covers sprint`

**Acceptance checks for Part B**
- With only the café open, the sprint is all times tables.
- After a drill type is unlocked (you can test by temporarily setting `sprintUnlock` on an existing type), about 40% of questions come from it.
- Turning a type off in the teacher settings removes it from the sprint at the next sprint.
- `npm run verify`, `npm run typecheck`, and `npm run build` pass.
