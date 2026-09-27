# Bakery station 2: Sharing Pans (divide fractions and whole numbers)

**Status: built.** The generators are `PANS_GEN` in `src/game/game.js` (stress-tested: 120,000 problems, every answer checked against an independent calculation, every mix-up checked to fire only on its own wrong answer). Read `AGENTS.md` and `docs/BAKERY.md` first. **Edit in place, never rewrite a file.**

## Khan skills (Khan's order)

| Id | Khan skill | Example |
|---|---|---|
| `fracDivWhole` | Divide fractions by whole numbers | 3/4 of a pan of brownies shared by 3 friends: 3/4 ÷ 3 = 1/4 |
| `wholeDivFrac` | Divide whole numbers by fractions | 4 cups of batter, 2/3 cup per muffin: 4 ÷ 2/3 = 6 |

Khan links are in `BAKERY.md`.

## What students get

- **Stories:** sharing part of a pan among friends (fraction ÷ whole), and "how many servings fit" (whole ÷ fraction).
- **A picture on every order:** a pan split into parts, or a tape diagram of cups, so the division can be seen.
- **Steps, split into idea and arithmetic steps like the café:**
  1. *Idea:* "Are we sharing into groups, or finding how many fit?" (choice)
  2. *Idea:* pick the matching picture or equation (choice). At level 1, the picture is filled in for them.
  3. *Arithmetic:* the answer as a fraction.
  4. *Arithmetic:* simplest form. It's always in the plan, and it's marked "already done" (skipped) when step 3's answer was already in simplest form. It uses the `notSimplest` and `notMixed` mix-ups.
- **Levels:** level 1 uses unit fractions and small whole numbers that divide evenly (1/2 ÷ 2, 3 ÷ 1/4). Level 2 uses non-unit fractions (3/5 ÷ 2, 4 ÷ 2/3). Level 3 has answers that need simplifying or are mixed numbers (6 ÷ 4/5 = 7 1/2).

## New input: fraction answers

The first station that needs them, so this plan builds them for the whole Bakery:

- A new step kind, `frac`: a small whole-number box, a numerator box, and a denominator box, drawn as a real fraction bar. The whole-number box is always shown and can be left empty, so it doesn't give away whether the answer is more than 1. A whole-number answer can go in the whole-number box alone.
- Accepted answers: any **equivalent** fraction or mixed number counts as right for the arithmetic step (`6/8` = `3/4`, `15/2` = `7 1/2`). The simplest-form step afterwards checks form.
- **Mixed numbers are required** in simplest form when the answer is more than 1 (owner decision): `15/2` is right for the arithmetic step, and the simplest-form step then asks for `7 1/2`.
- On phones, the boxes use the phone's number keyboard (`inputmode="numeric"`), like the café.
- It has to work in the quiz's answer-only mode (`answerStepsFor`) and in the dashboard's step names.
- The fraction math uses whole numbers only (numerator and denominator), never decimals, so nothing rounds.

## Mix-ups to catch

| Id | Mix-up | Caught when | Kid message | Teacher tip |
|---|---|---|---|---|
| `divAsMult` | Multiplies instead of dividing | 3/4 ÷ 3 answered as 9/4, or 4 ÷ 2/3 answered as 8/3 | "Sharing makes each part smaller, and fitting small cups in makes more of them. Check which way it should go." | Ask "will the answer be more or less than we started with?" before computing. |
| `denomOnly` | Multiplies by the denominator and forgets the numerator | 4 ÷ 2/3 answered as 12 | "Each serving is 2 thirds, not 1 third." | Count thirds on the tape diagram, then group them in twos. |
| `numerOnly` | Divides by the numerator and ignores the denominator | 4 ÷ 2/3 answered as 2 | "The cup isn't 2 whole cups. It's 2/3 of a cup." | Compare the size of the serving to 1 whole cup first. |
| `reversedDivision` | Divides the other way round | 4 ÷ 2/3 answered as 1/6, or 3/4 ÷ 3 answered as 4 | "Which amount is being split up?" | Say the story aloud: "how many 2/3-cups fit in 4 cups?" |
| `notSimplest` | Right value, not simplest | already in the café | (existing) | (existing) |
| `notMixed` | Leaves an improper fraction | 15/2 at the simplest-form step | "The top is bigger than the bottom. How many wholes are in it?" | Divide the top by the bottom: the quotient is the whole number and the remainder goes on top. |

The generator must check that each wrong answer it recognises is different from the right answer (the lesson from the Scale's line-up step).

## Drills

- **Simplify drill** (`simplify`, already registered): after a `notSimplest` miss.
- **Times tables** (existing): after a multiplication fact slip inside a step.

## Rewards

Unchanged: the station 2 Bakery rewards in `REWARDS.md` unlock when this station opens.

## Build steps (done: fraction answers in one commit; registry and generators together in a second, so a station never lists a skill without its generator)

1. **Fraction answers:** the `frac` step kind, equivalence checking, phone keyboard, quiz answer-only support. Test with a throwaway problem before any real skill uses it.
2. **Registry:** the 2 skills, 4 new mix-ups, add both to station 2's `skills` in the **same commit**, and add them to `UNIT_SKILLS.bakery`.
3. **Generators:** paste the tested code (written before this step starts).
4. **Verify:** checks for the `frac` step kind and the new generators; update the three instruction files.

## Acceptance checks

1. Station 2 opens after the Scale quiz is passed (or 6 orders when quizzes aren't required).
2. Every problem's answer matches an independent calculation, at all 3 levels.
3. `3/4`, `6/8`, and `0 3/4` are all accepted where the answer is 3/4. The simplest-form step then asks for `3/4`. Where the answer is 7 1/2, `15/2` is accepted first, and the simplest-form step asks for `7 1/2`.
4. Each mix-up gets its message, and none fires on a right answer.
5. Works at iPhone SE size, in quizzes (answer only), and on the dashboard's 🥐 tab.

## Owner decisions

- Mixed numbers are required in simplest form when the answer is more than 1.
