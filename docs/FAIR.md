# 6th grade, shop 7: the 🎡 Pet Fair

**Status: built (6 stations), Oct 26, 2026.** Khan Academy 6th grade, Unit 7: Equations and inequalities. All 22 Khan exercises, each with its own link, in Khan's order. The generators are `POTION2_GEN` in `src/game/game.js`. The name is kept from when this unit was the Potion Lab's part 2. Read `AGENTS.md` and `NEIGHBORHOODS.md` first. **Edit in place, never rewrite a file.**

The Pet Fair opens after the Potion Lab Unit Test (or with the teacher's "Open the Pet Fair for everyone"). Pet Houses now opens after the Pet Fair Unit Test.

## Stations and skills (Khan's order)

| # | Station | Skills (ids) | Khan |
|---|---|---|---|
| 1 | 🎟️ Ticket Booth | Testing solutions to equations (`testSol`), equations from tape diagrams (`tapeEq`), equations from hanger diagrams (`hangerEq`), solving from visual models (`visualSolve`) | Quiz 1 |
| 2 | 🎯 Ring Toss | One-step + and − (`oneStepAdd`), with fractions and decimals (`oneStepAddFrac`), one-step × and ÷ (`oneStepMult`), with fractions and decimals (`oneStepMultFrac`) | Quiz 1 |
| 3 | 🎪 Story Tent | Find the mistake (`eqMistake`), translate and solve (`translateEq`), model with one-step equations (`eqWrite`), model and solve (`eqModel`) | Quiz 2 |
| 4 | 🎢 Ride Line | Testing solutions to inequalities (`testIneq`), graphing basic inequalities (`graphIneq`), inequality from a graph (`ineqFromGraph`), plotting inequalities (`plotIneq`), inequality word problems (`ineqWord`) | Quiz 3 |
| 5 | 🎡 Ferris Wheel | Independent and dependent variables (`depIndep`), tables from equations (`tableEq`), matching equations and graphs (`graphEq`) | Quiz 4 |
| 6 | 🏆 Prize Counter | Equations from stories (`relQuant`), analyzing relationships (`analyzeRel`) | Quiz 4 |

The 7 skills that came from the Potion Lab keep their ids, so their history and mix-ups carry over. They are `testSol`, `oneStepAdd`, `oneStepMult`, `eqModel`, `testIneq`, `plotIneq` and `depIndep`.
- `plotIneq` now **builds** the graph: where the circle goes, open or filled, which way the arrow points, then which graph. The old "pick the graph" problem is `graphIneq` (Khan's "Graphing basic inequalities").
- `depIndep` now links to Khan's exercise (it linked the review article).
- The stories now use fair things (tickets, balloons, lollipops) instead of potions.

## What the new skills do

- **Tape diagrams** (`tapeEq`): a bar model (`barModelSVG`) of x + a, kx, x − a or x ÷ k. She picks the equation, and on level 3 she also solves it.
- **Hanger diagrams** (`hangerEq`, `hangerHTML`): 🟧 = x and 🟣 = 1 on a balanced hanger. She picks the equation, like 3x + 2 = 11.
- **Solving from a hanger** (`visualSolve`): take the same number of 🟣 off both sides, then split into equal groups.
- **Fractions and decimals**:
  - `oneStepAddFrac`: tenths (level 1), like denominators (level 2), unlike denominators and mixed numbers (level 3). Answers are in simplest form.
  - `oneStepMultFrac`: 0.5x = 4 (level 1), (2/3)x = 8 with the reciprocal (level 2), fraction answers like (2/5)x = 2/3 (level 3).
- **Find the mistake** (`eqMistake`): a worked solution with a start line and two steps. The mistake can be the wrong inverse, doing it to only one side, an arithmetic slip, or no mistake at all. Level 2 and up also asks for the right answer.
- **Translate and solve** (`translateEq`): "15 less than a number is 7" becomes x − 15 = 7. Wrong choices include the swapped order.
- **Model with one-step equations** (`eqWrite`): `eqModel`'s stories with the equation choice only.
- **Inequality from a graph** (`ineqFromGraph`): read `ineqSVG`. Wrong choices flip the direction or the circle.
- **Inequality word problems** (`ineqWord`): "at least 48 inches", "fewer than 20 riders", "at most 12 pounds", "more than 14 tickets". Level 2 tests a value (the boundary is a common trap). Level 3 picks the graph.
- **Tables from equations** (`tableEq`): fill in three y's from y = 6x, y = 6x + 6, or y = 6(x + 5).
- **Equations and graphs** (`graphEq`): a first-quadrant graph (`q1GraphSVG`). She picks the equation for the points, or the point that is on the line. Swapping x and y is named (`depIndepSwap`).
- **Equations from stories** (`relQuant`): c = 2t, h = 5s + 10, s = w ÷ 8, a = c + 3.
- **Analyzing relationships** (`analyzeRel`): how y changes from a table, which equation fits it, then predicting y for x = 20.

**Stress-tested** in the built game: 3,000 problems per skill and level (198,000 in all). Every choice question has exactly one right choice and no repeated choices, and every answer is valid.

## Think it through

Each station has its set in `TYPED_QUESTIONS.math['fair:1']` to `['fair:6']`. The Potion Lab's old Unit 7 questions (`potion:7`, `potion:8`) moved into `fair:1`, `fair:2`, `fair:3`, `fair:4` and `fair:5`. New ones cover hangers, fraction equations, finding a mistake, "at least", tables, and writing c = 2r + 5.

## Rewards

🦘 Bounce the kangaroo, 🦩 Flo the flamingo, 🦭 Bubbles the seal, 🐯 Taffy the tiger, 🐨 Gumdrop the koala; 🎈 Balloon bunch, 🍭 Lollipop stand, 🎯 Ring toss, 🎢 Roller coaster, 🎡 Golden Ferris wheel. `npm run verify` now expects 136 rewards.
