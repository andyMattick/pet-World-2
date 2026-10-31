# Checking the math (Oct 26, 2026)

Andy asked whether every 6th grade problem is right, hard enough, and free of hints on assessments. This is what was checked, what was found and fixed, and the tools that keep checking it.

## The tools

- **`npm run check-math`** (`scripts/check-math.mjs`) builds the game (or takes `--site <folder>`) and opens it with `?mathcheck`. For every 6th grade skill (153 of them), it generates problems at levels 1–3 (`--n`, default 400 each) and checks four things:
  1. **Answer keys.** Each key is compared with an **independent solver** in `scripts/math-oracles/<shop>.js`. A solver reads only what the student sees (the story, the picture's SVG, the choice texts) and works the answer out with its own code: its own fraction arithmetic, expression parser, equation solver, and readers for dot plots, histograms, box plots, number lines and coordinate grids. It never reads the game's `answer`, `ctx` or worked step prompts.
  2. **Choices.** Exactly one right choice, no repeats, at least 2 choices.
  3. **Text.** No NaN or undefined in anything she reads.
  4. **Tests.** Every number a quiz or test needs is in the story or the picture. The warnings it lists are numbers she gets by counting or reading the picture (like the 3 in "3 × 25%"), so they're fine.
- **Options:** `--shop show` or `--skill meanCalc` checks one part.
- **New skills:** a new skill needs a solver in its shop's file. The report lists skills without one.
- **Last run:** 153 skills, 137,700 problems. Every key matched its solver.
- **Proving the solvers can fail:** the Café/Bakery solvers were deliberately broken for four skills, and the check caught all four.

## Quizzes and tests show no worked steps

A station quiz or unit test shows only the answer steps (`answerStepsFor`). Before, those steps kept their practice prompts, which worked part of the problem. For example, the mean showed "42 ÷ 7 = ?", surface area showed "112 + 48 + 42 = ?", and a missing triangle side showed "35 ÷ 7 = ?" (the "double it" step done for her). **24 skills** handed over hidden steps like this.

Now `testPrompt` decides what an assessment step shows:

- A step can give its own test wording (`test:` field).
- A prompt that works out a calculation between numbers becomes "Your answer = ?" (with its unit). A choice step's prompt becomes "Choose your answer."
- A plain question stays as it is, like "When x = 1, y = ?".
- When the story asks two things, the test now asks both. This covers unit rates, percent ripe and not ripe, GCF/LCM follow-ups, the new mean and median, base-and-height plus area, and expression plus value.

## Build, don't just pick (Khan's "create" exercises)

Two new step kinds:

- **`counts`** builds a dot plot or a histogram, with + and − under each value or interval. "Creating dot plots" (levels 2–3) and "Create histograms" (levels 2–3) build now instead of picking a picture.
- **`pair`** is a typed point (x, y) with ± buttons. "Drawing polygons" level 2 and "Quadrilateral problems" level 1 type the fourth corner instead of choosing it.

## Blind review

Three reviewers solved one problem per skill and level **without the key**: 459 problems, the test version, with only the story, the picture's labels and the test prompts. None of them found wrong math. They flagged 142 items. These are fixed:

- **Two real double-right choice bugs**, found by the solvers:
  - A square drawn twice in "Drawing polygons" (its mirror across y = x was the same shape).
  - A 6 × 6 × 6 cube whose volume equals its surface area in "Surface area expressions".
  - A fix to that second one briefly made a 2 × 2 × 2 box ambiguous; the solver caught it too.
- **Giveaways:**
  - The box-plot test printed the five numbers it asks about.
  - "Now write 3 : 6 in simplest form" showed the first answer.
  - An absolute-value story said "That distance is |−8|".
  - The hanger test said "Split 8 into 2 groups".
  - "Is 2 ≤ 1 true?" did the substitution for her.
  - The right answer was the longest choice in the percent-equivalents and surface-area expressions.
  - "Right triangle" was the only triangle among the choices.
- **Missing givens:** the triangle lengths were only in a step prompt. "Find its value" stories never gave the value of the letter. Box plots had no ticks to read a value like 7 or 32 from.
- **Wrong or unclear stories:**
  - "Rings 2 times, 3 times over" described 2 × 3, not 2³.
  - "16n ÷ 4 = ?" expected 4.
  - "at at most" repeated "at".
  - The rabbit's "spent $27 on skate rentals" was an odd purchase.
  - The house-front sizes didn't say which side the roof was on.
  - The histogram intervals weren't named.
  - The trapezoid story never asked a question.
  - The "find the mistake" test didn't say what to type.
- **Realism:** hamsters 15 years old, rabbits 21, cats 61 lb and a 63 sq ft attic window are now puppy and kitten ages in months, dog weights, and a barn gable.
- **English:**
  - "My carrot cupcakes uses" → "My carrot cupcake recipe uses".
  - "1 apples" and "1 boxes" now use the singular (`nOf`).
  - "We baked 16 apples" → "We have 16 apples".
  - "the carrots eaten of the rabbits" → "how many carrots each of the rabbits ate" (`statOf`).
  - "Bigger batches always taste the same" (a banned "always" in a wrong choice) is reworded.
  - "How many treats on the whole platter?" now includes "are".
  - The flour now uses 🌾 instead of 🍪.
  - The new-pet question says "score", with a curly apostrophe.
- **Level 3 harder than level 2:**
  - Café tape diagrams (ratios up to 7), Café graphs and unit conversions (bigger factors).
  - Market percent pictures (10 jumps), benchmark percents.
  - Powers (8 and up only).
  - Ordering negatives (6 numbers).
  - Evaluating with fractions only.
  - Find the mistake (bigger numbers, always a mistake).
  - Triangle area and missing sides (bigger numbers, the height outside).
  - House fronts (level 2 gives the whole height).
  - Naming solids (only faces, edges and vertices).
  - Comparing IQRs (closer groups).
  - One-step equations (the bar-model picture choice is level 1 only).

**Not changed:**

- **Not real problems:**
  - Choices that are pictures look like their report text ("net of cube", the inequality) to a reviewer who can't see pictures. She sees only the pictures.
  - `volPrism`'s repeated step is skipped in practice and is the answer step on tests.
- **Judgment calls:**
  - "Which display works best for a very large data set" (histogram).
  - Which age is dependent in the cousin story.
  - The order of `paraMissing` and `graphQuad` levels 1 and 2.
- **Practice-only wording, left as is:**
  - A few practice-only choices where the right one is a little longer (fraction "pick the equation" steps, `writeExpr` level 3).
  - `fracInterp` level 1–2 choice labels.
- **Same as level 1:** `eqWrite` level 3 and `evalWord` level 3 are the same kind of problem as level 1.

## The review list

`docs/math-review.md` has one problem per skill and level as a test shows it, with the right answers in **bold**. It's regenerated from the game, so read it before applying the patch.

## Answer forms in the fraction boxes (Oct 31, 2026)

Some fraction steps only take simplest form, a mixed number, or both (`FRAC.canon`, `mixedOnly`, `rqStep(..., {simplest:true})`), and an equal answer like 2/4 or 5/4 is marked wrong. In practice the mix-up note says why (`notSimplest`, `notMixed`), but on a quiz or test it was a silent miss, and the prompt often didn't say which form was wanted (for example `evalOne`, `orderFracExp`, `powFrac`, `volCubes`, `mixedAS`, `oneStepAddFrac`). The tip under the fraction boxes now says so: `fracFormTip(st)` in `src/game/game.js` tries an unsimplified and an improper copy of the step's own answer against `st.eq`, and shows "Write it in simplest form", "Write it as a mixed number" or both. Generators and answer checks are unchanged. Number boxes already drop commas, spaces and `$` and read `.5` as 0.5.
