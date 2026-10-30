# Content rules

Every new piece of learning content in Pet World follows these rules: a new lesson, unit, question bank, math station, vocab list, or reading. Claude, other tools and people all follow them. `node scripts/check-content.mjs` checks the parts a script can check. A blind review and a review list cover the rest.

## 1. What every lesson gets

- **About 14 multiple-choice questions**, each tagged with a difficulty from 1 to 3. Aim for about 40% at level 3 in new banks.
- **2 scored questions of the newer types** (QUESTION-TYPES.md): select all, two-part, put in order, type the answer, sort, or tap the words. Use at least 2 different types within a unit.
- **1 short answer** (`short`) with a 2–4 point rubric, a model answer, and a minimum word count.
- **Every unit test** ends with one paragraph question (`essay`).
- **Every math station** gets a Think it through set: 2 scored questions and 1 "explain your thinking" short answer.

- **Every lesson** has a short `lesson:` explanation in its own words (1–2 sentences). The test review shows it when she misses that lesson, so it has to teach the idea, not just name it.
- **Every unit** has a Khan unit test link (`KHAN_UNIT_TESTS`, or `MATH_KHAN_UNITS` for a math shop) and goes through the shared test review, PIN and fix-up steps (CLAUDE.md, "Tests: review first"). No unit gets its own test screen.

## 2. Multiple choice

- Balance the lengths: across a lesson, the right answer is the longest choice about 1 time in 4 and the shortest about 1 time in 4, both in the questions she practices and in the test-only ones. (The old “never the longest” rule made the key the middle-length choice, which a test-wise bot played; see the section below.)
- No one choice may stand out the same way the key does every time: the only full sentence, the only one with a comma, “can” or “because,” the only “both,” or the one that repeats the prompt’s words.
- Wrong answers don't give themselves away. No "only," "always," "never," "all," "none," "every," "completely" or "nothing" in wrong answers unless the right answer also uses one.
- No silly or joke wrong answers ("the internet" in ancient Rome, "Buddhism began in Rome"). Every wrong answer is a mistake a real student might make.
- Exactly one choice is defensibly right. Watch for words that can be more than one part of speech, plurals with two accepted forms, and stems that need "in American English" or "in formal writing."
- Use curly apostrophes (’), never straight ones (').

## 3. Newer types

- **Sort:** every item fits exactly one group.
- **Put in order:** has exactly one correct sequence, with no steps that could swap.
- **Two-part:** Part B never repeats or gives away the Part A answer, because both parts show at the same time.
- **Type the answer:** lists every form a teacher would accept, such as `8/3` and `2 2/3`, or `3426` and `3,426`.
- **Tap the words:** no other word in the sentence also fits.
- **Written prompts:** a 6th grader can answer them, the rubric matches what the prompt asks, and the model answer is accurate and meets its own rubric.

## 4. Accuracy

- Facts are current and not oversimplified into something false. Examples: Homo sapiens are about 300,000 years old; Cyrus never ruled Egypt; Rome had kings before the Republic.
- If a simplification is a judgment call, flag it in the review list instead of changing it silently. One example is "the Han chose officials by tests."
- Original wording only. Never copy Khan Academy, textbooks, or published word lists such as Wordly Wise. Write definitions and examples in our own words.

## 5. How content is delivered

1. Write the content. Then run a **blind review**: a second reviewer answers every scored item without the key and lists ambiguous, inaccurate or give-away items.
2. Fix everything the review finds. Any key disagreement is either fixed or explained.
3. Deliver a small script in `docs/` that checks the file first, changes nothing if any check fails, and does nothing if run twice. Deliver a patch instead when code changes too.
4. Deliver a **review list** (`docs/*-review.md`) with every question and the right answer in **bold**, so the teacher reads it before applying.
5. **Keep ids stable.** A question's id comes from its prompt and right answer. Fix wrong answers freely, but change a prompt or a right answer only for accuracy, and say which ids change.
6. Run `node scripts/check-content.mjs && node scripts/check-typed.mjs && npm run verify` before handing it over. For math generators, also run `npm run check-math`, and give every new skill an independent solver in `scripts/math-oracles/` (docs/MATH-CHECK.md).

## Blind review and test-wise bot (owner rule, Oct 30, 2026)

Every time questions are written or changed, in any unit, subject or grade (banks, newer types, generated problems, quizzes, tests, reviews):

1. **Export the keyless test view:** `node scripts/blind-export.mjs --courses <ids> --out <folder outside the repo>`.
2. **Blind-solve it with FRESH agents** (never the builder): one per unit, reading only `views/<course>.md`. Each writes answer, confidence and flags per item.
3. **Score against the key:** every mismatch and flag gets FIX, KEEP (with a reason) or JUDGMENT (Andy’s call, with both readings).
4. **Check difficulty by level:** L3 clearly harder than L2, about 40% L3, and compare with Khan (easier, same or harder).
5. **Run the test-wise bot:** `node scripts/test-wise-bot.mjs --courses <ids>`. It plays longest, shortest, middle-length, most specific, word overlap, absolute words, grammar agreement, odd one out, both/all, letter position, majority vote, two trained bots, generated-answer patterns, and a memorizer across practice, quizzes, the review and retakes. **Any strategy within 15 points of a pass mark, or more than about 10 points above chance, fails the unit.** Fix the items and rerun until it exits 0.
6. Put the results in the unit’s `docs/*-review.md` (“Blind review and test-wise bot, <date>”). How to run it all: `docs/BLIND-REVIEW.md`.

