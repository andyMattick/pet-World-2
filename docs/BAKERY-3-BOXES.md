# Bakery station 3: Boxing Treats (divide fractions by fractions)

**Status: draft plan.** The generator code isn't written yet. Before any building starts, it gets written and stress-tested and pasted into this file. Needs the fraction answers from `BAKERY-2-PANS.md`. Read `AGENTS.md` and `docs/BAKERY.md` first. **Edit in place, never rewrite a file.**

## Khan skills (Khan's order)

| Id | Khan skill | Example |
|---|---|---|
| `fracDiv` | Dividing fractions | 3/4 ÷ 1/8 = 6 |
| `mixedDiv` | Divide mixed numbers | 2 1/2 ÷ 1/4 = 10 |
| `fracInterp` | Interpret fraction division | Which story or picture matches 3/4 ÷ 1/8? |
| `fracWord` | Dividing fractions word problems | 5/6 of a pound of fudge in boxes of 1/12 pound: how many boxes? |

Khan links are in `BAKERY.md`.

## What students get

- **Stories:** boxing treats: how many boxes of a given size fit, or how much goes in each box.
- **Steps:**
  1. *Idea:* "How many boxes fit?" or "How much in each box?" (choice). `fracInterp` problems are mostly this step: match the story, picture, or equation.
  2. *Idea (level 1 to 2):* a common-denominator picture (8 eighths, groups of 1 eighth), or "multiply by the flip" (choice of method is shown, not asked, at level 1).
  3. *Arithmetic:* the flipped divisor, e.g. 1/8 → 8/1 (only when the method is "multiply by the flip").
  4. *Arithmetic:* the answer (fraction or mixed number, from station 2's input).
  5. *Arithmetic:* simplest form, when needed.
- **Mixed numbers (`mixedDiv`)** add a first arithmetic step: "Write 2 1/2 as a fraction" → 5/2.
- **Levels:** level 1 has answers that are whole numbers (3/4 ÷ 1/8). Level 2 has fraction answers (2/3 ÷ 3/4 = 8/9). Level 3 has mixed numbers on both sides and answers that need simplifying.

## Mix-ups to catch

| Id | Mix-up | Caught when | Kid message | Teacher tip |
|---|---|---|---|---|
| `flipWrong` | Flips the first fraction instead of the second | 2/3 ÷ 3/4 answered as 9/8 | "Keep the first fraction. Flip the one you divide by." | Say "keep, change, flip" while pointing at each part. |
| `noFlip` | Multiplies straight across without flipping | 2/3 ÷ 3/4 answered as 6/12 or 1/2 | "Dividing means multiply by the flip." | Check with the picture: how many 3/4s fit in 2/3? Fewer than 1. |
| `mixedAsParts` | Splits a mixed number into parts | 2 1/2 ÷ 1/4 answered as 2 + 2 = 4 (only divides the 1/2) | "Turn 2 1/2 into halves first." | Rewrite mixed numbers as fractions before anything else. |
| `reversedDivision` | Divides the other way round | (from station 2) | (from station 2) | (from station 2) |
| `notSimplest` | Right value, not simplest | (existing) | (existing) | (existing) |

Every recognised wrong answer must differ from the right one. **Dividing straight across** (8/9 ÷ 2/3 = (8÷2)/(9÷3) = 4/3) is *not* a mistake. It always gives the right value, so it must never be flagged.

## Drills

- **Reciprocal drill** (`reciprocal`, already registered): after a `flipWrong` or `noFlip` miss. Rows like "Flip 3/5" → 5/3, and "Flip 4" → 1/4.
- **Simplify drill** (`simplify`): after `notSimplest`.
- The two new drills need `DRILL_IMPL` entries with the same shape as `times` (`build` returns `title, why, rows, targetIndex, hint, finishLine, tieLine`, and `sprintItem` returns a `drillId`).

## Rewards

Unchanged: the station 3 Bakery rewards in `REWARDS.md`.

## Build steps (one commit each)

1. **Registry:** 4 skills, the new mix-ups, station 3's `skills` in the **same commit**, `UNIT_SKILLS.bakery`, and `sprintUnlock` for `reciprocal` and `simplify` at Bakery station 3.
2. **Generators:** paste the tested code.
3. **Reciprocal and simplify drills:** the two `DRILL_IMPL` entries.
4. **Verify:** checks for the generators and the two drills; update the three instruction files.

## Acceptance checks

1. Every answer matches an independent calculation, at all 3 levels, and every choice step has exactly one right answer.
2. Every "Interpret" choice set has one matching story/picture/equation, and the others are clearly different.
3. Mix-ups fire only on the wrong answers they describe.
4. A `flipWrong` miss opens the reciprocal drill.
5. Works at iPhone SE size and in quizzes.
