# Bakery station 3: Boxing Treats (divide fractions by fractions)

**Status: built.** The generators are `BOXES_GEN` in `src/game/game.js` (stress-tested: 180,000 problems, every answer checked against an independent calculation, every mix-up checked to fire only on its own wrong answer). It uses the fraction answers from `BAKERY-2-PANS.md`. Read `AGENTS.md` and `docs/BAKERY.md` first. **Edit in place, never rewrite a file.**

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
- **Steps as built:**
  - `fracDiv`: *More or less than 1?* (choice) → *Flip the divisor* → *Multiply* → *Simplest form*. Level 1 shows the common-denominator picture (3/4 as 6 eighths).
  - `mixedDiv`: *Write as a fraction* (once, or twice at level 3 when both numbers are mixed) → *Flip the divisor* → *Multiply* → *Simplest form*.
  - `fracInterp`: *Match the story* or *Match the equation* (choice) → *Solve* → *Simplest form*. Its quizzes keep the matching step, so interpreting is tested, not just computing.
  - `fracWord`: *Pick the equation* → *Flip the divisor* → *Multiply* → *Simplest form*. Some level 2 and 3 stories ask "how much for one whole" (3/4 pound fills 2/5 of a tin).
  - The simplest-form step is skipped when the answer was already in simplest form, as in station 2.
- **Levels:** level 1 has whole-number answers with a unit divisor (3/4 ÷ 1/8 = 6). Level 2 has fraction answers already in lowest terms (they may still need writing as a mixed number). Level 3 has answers that need simplifying, and for `mixedDiv`, mixed numbers on both sides.

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
- **Simplify drill** (`simplify`): after `notSimplest`. Already built in station 2.
- The reciprocal drill needs `DRILL_IMPL` entries with the same shape as `times` (`build` returns `title, why, rows, targetIndex, hint, finishLine, tieLine`, and `sprintItem` returns a `drillId`).

## Rewards

Unchanged: the station 3 Bakery rewards in `REWARDS.md`.

## Build steps (one commit each)

1. **Registry:** 4 skills, the new mix-ups, station 3's `skills` in the **same commit**, `UNIT_SKILLS.bakery`, and `sprintUnlock` for `reciprocal` at Bakery station 3.
2. **Generators:** paste the tested code.
3. **Reciprocal drill:** the `DRILL_IMPL` entry.
4. **Verify:** checks for the generators and the two drills; update the three instruction files.

## Acceptance checks

1. Every answer matches an independent calculation, at all 3 levels, and every choice step has exactly one right answer.
2. Every "Interpret" choice set has one matching story/picture/equation, and the others are clearly different.
3. Mix-ups fire only on the wrong answers they describe.
4. A `flipWrong` miss opens the reciprocal drill.
5. Works at iPhone SE size and in quizzes.
