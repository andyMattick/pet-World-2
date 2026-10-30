# Blind review and the test-wise bot

Owner rule, Oct 30, 2026 (CLAUDE.md and CONTENT-RULES.md): every time questions are written or changed, in any unit, subject or grade, the unit gets a blind review and a test-wise bot run before it is handed over. A unit passes only when a student who doesn't know the content can't pass its quizzes or unit test by playing the answer choices, by memorizing answers, or by retrying.

## 1. Export the keyless test view

```
node scripts/blind-export.mjs --courses style,bio5 --out /tmp/pet-world-blind
```

Run it from the repo root. `--courses` takes ids from `LESSON_COURSES` in `src/shared/questionBanks.js`; leave it out for every course. Keep `--out` **outside the repo**.

| File | What it holds |
|---|---|
| `views/<course>.md` | What she sees on quizzes and the unit test, with no keys: the prompt, any figure described in words, and the choices in a seeded shuffle labeled A–D. Generated kinds get 6 samples each, and the short answers and the unit paragraph come last. |
| `keys/<course>.json` | The right answer for each id, plus the source file and line. |

The script prints a JSON summary. Read its `problems` list. A `LEAK` line means a key marker turned up in a view. Check it, though some are false alarms: a fill-in blank written `___` trips the marker check.

## 2. Blind solve, with fresh agents

Give each unit's `views/<course>.md`, and only that file, to a **fresh** agent. It must never be the agent that wrote or fixed the questions.

The agent answers every item as a strong 6th grader and a careful teacher would. It writes one JSON line per item with these fields:
- `id`
- `answer`
- `confidence`, from 1 to 5
- `flags`: any of `two-right`, `none-right`, `giveaway`, `missing-given`, `ambiguous-wording`, `factually-wrong`, `too-easy`, `unrealistic`, `grammar-typo`
- `note`

If you can't start a fresh agent, say so in the report. Your own read-through is not a blind review.

## 3. Score against the key

Compare the answers with `keys/<course>.json`. Compare sort, order, tap and Punnett answers by what they contain, not by how they are written.

Every mismatch and every flag gets one of three decisions:
- **FIX**: a real problem. Fix it in the source, and keep the id unless the prompt or the right answer has to change.
- **KEEP**: the reviewer is wrong. Give the reason in one line.
- **JUDGMENT**: Andy decides, for example where style guides split. Show the question and both readings.

A perfect blind score shows only that the keys are right. It doesn't show the unit is hard.

## 4. Difficulty by level

For each level (L1, L2, L3), report the number of items, the blind accuracy, the mean confidence and the number of `too-easy` flags.

Check that:
- L3 is clearly harder than L2: more steps, subtler wrong answers, less support.
- About 40% of each bank is L3.
- The unit compares with Khan's exercises for the same skills as easier, the same or harder.

Toughen every L2 and L3 item flagged `too-easy`.

## 5. Run the test-wise bot

```
node scripts/test-wise-bot.mjs --courses sentences,conventions,style,bio4,bio5 --attempts 1500 --json /tmp/bot.json
node scripts/test-wise-bot.mjs --courses style --items      # which cue picks each item's key; practice (P) vs test-only (T)
```

The bot loads the real banks and copies the game's own selection code. It plays thousands of fresh quizzes and unit tests and prints, for each strategy, the expected score next to the pass mark and next to chance.

The strategies:

| Group | Strategies |
|---|---|
| Length and wording | the longest choice; the shortest; the middle length (drop the longest and the shortest); the most specific; the most words shared with the prompt |
| Elimination | drop choices with absolute words; grammar agreement with the stem (a/an, is/are, -ed); the odd one out (the only negative, fraction, full sentence, comma, "can", "because"…); the "both / all" choice |
| Position | always the first letter |
| Combined | a majority vote of the cues, and its opposite |
| Trained bots | `learnedCV` learns from the other half of the same unit; `learnedXU` learns from the other units |
| Generated problems | `kindMemo`: always type the most common answer for that kind, or pick its most common answer pattern |
| Memorizer | remembers every right answer it was shown in practice (one run per lesson), each quiz, the 8-question review before every try, and the test itself. A unit-test miss shows no answer, so there it only learns the items it happened to get right, plus the choice that was marked wrong (on a retake it guesses among the choices it hasn't ruled out). Retakes carry the game's seen-list, so a unit with a reserved pool shows it reserved questions it hasn't had yet. On new items it uses the one trick that scores best on that unit's test. It is judged on the pass mark only; the report gives tries 1, 2 and 3 and how many items on each were new to its tests. |

**FAIL rule:** a unit fails if any strategy, on any quiz or on the unit test, scores within 15 points of the pass mark or more than 10 points above chance. The exit code is 1 when any unit fails.

The `oracle` column is an upper bound: the best cue for each item, which no real student can choose. It doesn't count toward the verdict.

The bot also reports:
- whether a retake shows the same items, in the same order, with the right answer under the same letter
- where the key sits across A–D
- each quiz's single-attempt pass chance

## What keeps a unit from being gamed (keep these)

- **Balanced key lengths.** In each lesson, the right answer is the longest choice about 1 time in 4 and the shortest about 1 time in 4, in both the practice pool and the test-only pool. `node scripts/check-content.mjs` warns when a course drifts outside 15–35%.
- **No odd one out.** If the key is the only choice with a comma, "can", "because", "both", a parenthesis or the prompt's words, give one wrong answer the same feature.
- **A reserved test pool in every unit** (owner, Oct 30, 2026; see below). Until a unit has one, `testOnlyIds()` holds back about 2 in 5 of each lesson's fixed questions instead (the old stopgap: hashed by id, spread over the levels, at least 8 left to practice; generated problems and a teacher's added questions are never held back).
- **No answers after a unit-test miss.** On the unit test, a miss says which lesson the question came from (`testMissText`) and doesn't show or highlight the right answer. A retake can't be passed by remembering answers. Practice, quizzes and the review still teach the right answer after a miss.
- **Generated problems with spread-out answers.** No kind may have one answer, or one answer pattern, that is right most of the time. `node scripts/check-genetics.mjs` checks the keys, and the bot's `kindMemo` checks the spread.
- **Fresh shuffles.** Choices are reshuffled on every draw, order items never start in order, and every retake redraws its questions.

## Reserved test pool (owner rule, Oct 30, 2026)

A test-wise bot showed that a student could pass by **memorizing**: practice, quizzes and the unit test shared one small pool, so every retake and every review taught her more of the test's answers. The fix Andy chose: every unit gets **new questions written only for the unit test**, which never appear anywhere else.

**What a reserved pool is.** At least 6–10 multiple-choice questions per lesson, written fresh (no prompt, sentence or answer pattern reused from the lesson's bank, newer-type items or review), following CONTENT-RULES.md (balanced key lengths, about 40% level 3, no give-away words). They go in `src/shared/questionBanks.js` after the unit's bank:

```js
reserveForTest(RULE_QUESTIONS, {
  subjVerbAgree:[ mcLevel(2,"Which verb fits? …","is","are","were","have been"), … ],
  …
});
```

`reserveForTest` adds them to the lesson with `testOnly:true`. Their ids come from the prompt and right answer like any other question, so a teacher can edit or hide them in the Lessons tab (marked “Unit test only”).

**How the game uses it** (`src/shared/questionTypes.js`, `src/game/game.js`):
- `testOnlyIds(pool)`: if a lesson has reserved questions, exactly those are held back and **nothing else**: the old 2-in-5 share is 0 there, so practice keeps all the original questions. Practice, quizzes, the 8-question test review, the flashcards (which use term cards, not questions) and the games never see a reserved question.
- `pickTestItems(pool, count, seen, leanHard)`: the unit test draws each lesson's questions **only from its reserved pool**: first the ones she has never had on a unit test (leaning hard, as before), then, once she has seen them all, the least recently seen. A lesson with fewer reserved questions than the test needs fills the rest from its other questions.
- `S.testSeen[course]` = {question id: when it was last drawn for her unit test}. It is written when a test starts (so quitting and restarting doesn't bring the same questions back), cleaned on load (`normalizeTestSeen`), merged across devices (the later time wins), and never reset.
- A unit-test miss still names the lesson and never shows the right answer (`testMissText`).

**How to add one.** Write the items (right answer first) and a keyless view; a **fresh** agent blind-solves the view; score it (FIX / KEEP / JUDGMENT); fix; add the `reserveForTest(…)` block; run `node scripts/check-content.mjs` (it errors if a lesson in a unit with a pool has fewer than 6 reserved questions or one repeats a practice question, and prints each unit's pool sizes), `node scripts/blind-export.mjs` (the key file marks `testOnly`), and the bot. Then add a “Reserved test pool, <date>” section to the unit's review doc: every new question with the right answer in **bold**, the blind score, the fixes and the judgment calls.

**How big.** The memorizer can only be beaten on a retake if the retake has questions it hasn't seen. With `testPer` questions per lesson, a pool of *n* per lesson gives about *n* / `testPer` fresh tries. Aim for at least 2 fresh tries (for example 8 per lesson when the test takes 4) and check tries 1–3 in the bot.

## 6. Record it

Add a section titled "Blind review and test-wise bot, <date>" (or "Difficulty and test-wise bot, <date>") to the unit's `docs/*-review.md`. Include:
- the blind score
- the difficulty-by-level table
- the bot's best strategy before and after, next to the pass mark
- what was fixed, with any id that changed
- the judgment calls for Andy
