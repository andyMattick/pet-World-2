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
| Memorizer | remembers every right answer it was shown in practice (one run per lesson), each quiz, the 8-question review before every try, and the test itself. On new items it uses the one trick that scores best on that unit's test. It is judged on the pass mark only. |

**FAIL rule:** a unit fails if any strategy, on any quiz or on the unit test, scores within 15 points of the pass mark or more than 10 points above chance. The exit code is 1 when any unit fails.

The `oracle` column is an upper bound: the best cue for each item, which no real student can choose. It doesn't count toward the verdict.

The bot also reports:
- whether a retake shows the same items, in the same order, with the right answer under the same letter
- where the key sits across A–D
- each quiz's single-attempt pass chance

## What keeps a unit from being gamed (keep these)

- **Balanced key lengths.** In each lesson, the right answer is the longest choice about 1 time in 4 and the shortest about 1 time in 4, in both the practice pool and the test-only pool. `node scripts/check-content.mjs` warns when a course drifts outside 15–35%.
- **No odd one out.** If the key is the only choice with a comma, "can", "because", "both", a parenthesis or the prompt's words, give one wrong answer the same feature.
- **Test-only questions.** `testOnlyIds()` in `src/shared/questionTypes.js` holds back about 2 in 5 of each lesson's fixed questions, spread over the levels and picked by a hash of the id, so they stay the same for everyone. Practice, quizzes and the review never show them; only the unit test draws from them (`englishQuestions(skill, course, {test:true})`). A lesson always keeps at least 8 questions to practice. Generated problems and a teacher's added questions are never held back.
- **No answers after a unit-test miss.** On the unit test, a miss says which lesson the question came from (`testMissText`) and doesn't show or highlight the right answer. A retake can't be passed by remembering answers. Practice, quizzes and the review still teach the right answer after a miss.
- **Generated problems with spread-out answers.** No kind may have one answer, or one answer pattern, that is right most of the time. `node scripts/check-genetics.mjs` checks the keys, and the bot's `kindMemo` checks the spread.
- **Fresh shuffles.** Choices are reshuffled on every draw, order items never start in order, and every retake redraws its questions.

## 6. Record it

Add a section titled "Blind review and test-wise bot, <date>" (or "Difficulty and test-wise bot, <date>") to the unit's `docs/*-review.md`. Include:
- the blind score
- the difficulty-by-level table
- the bot's best strategy before and after, next to the pass mark
- what was fixed, with any id that changed
- the judgment calls for Andy
