# Content rules

Every new piece of learning content in Pet Town follows these rules: a new lesson, unit, question bank, math station, vocab list, or reading. Claude, other tools and people all follow them. `node scripts/check-content.mjs` checks the parts a script can check. A blind review and a review list cover the rest.

## 1. What every lesson gets

- **About 14 multiple-choice questions**, each tagged with a difficulty from 1 to 3. Aim for about 40% at level 3 in new banks.
- **2 scored questions of the newer types** (QUESTION-TYPES.md): select all, two-part, put in order, type the answer, sort, or tap the words. Use at least 2 different types within a unit.
- **1 short answer** (`short`) with a 2–4 point rubric, a model answer, and a minimum word count.
- **Every unit test** ends with one paragraph question (`essay`).
- **Every math station** gets a Think it through set: 2 scored questions and 1 "explain your thinking" short answer.

## 2. Multiple choice

- The right answer is never the longest choice. Make at least one wrong answer as long or longer.
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
6. Run `node scripts/check-content.mjs && node scripts/check-typed.mjs && npm run verify` before handing it over.
