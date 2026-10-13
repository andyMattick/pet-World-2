# Question types and written answers

Pet Town lessons used to ask only multiple-choice questions. This adds six question types that Pet Town scores on the spot, and two kinds of written answers that a grown-up reads. Roadmap Phase 5: "More question types."

## Scored right away

These types mix into practice, block quizzes and unit tests the same way multiple choice does. They count toward the score, the miss rates, and "Get 3 of 4."

| Type | What the student does | Good for |
|---|---|---|
| `multi`: select all | Picks every right choice (no partial credit) | "Which of these are abstract nouns?" |
| `two`: two-part | Answers Part A, then Part B ("which evidence supports your answer?") | Claim and evidence, Khan- and state-test style |
| `order`: put in order | Taps items in order; tapping a placed item takes it back | Steps of digestion, time order, smallest to largest |
| `fill`: type the answer | Types a word. Case, extra spaces and a final period don't matter, and several answers can be accepted | Spelling plurals, naming a cell part |
| `sort`: sort into groups | Chooses a group (2 or 3) for each item | Common or proper, primary or secondary, pollination or dispersal |
| `pick`: tap the words | Taps words in a sentence | Find the nouns, verbs or proper nouns |

After Check, each part shows green (right), red (wrong), or a dashed outline (a right choice the student missed). The ✕ cross-out works on select-all and two-part choices.

## Read by a grown-up

| Type | Where it appears |
|---|---|
| `short`: short answer (1–3 sentences) | Once at the end of a lesson's practice, until it is sent. It comes back if a grown-up asks for a redo. The student can choose "Skip for now." |
| `essay`: paragraph | The last part of every unit test. |

The student sees the rubric ("A strong answer:") while writing, and Send unlocks at the minimum word count. **Written answers never change a practice or test score.** The pass mark is still based on the scored questions only.

**Who reads them:**

- **Teacher:** On the Dashboard, the "✍️ Written answers to read" card lists students with answers waiting. Open a student and go to the ✍️ Written tab. Tick each rubric point the answer shows, add a note, or ask for a redo. The review is saved in the student's `quiz_overrides` as `written:<id>`, so there is no new database column or migration.
- **Parent at home:** Progress report → ✍️ Written answers, behind the grown-up PIN. The parent's ticks and note are saved with the answer in the student's save. In a class, the teacher sees the parent's check and can change it; the teacher's check wins.
- **Student:** The unit page has a "✍️ My written answers" list showing each answer, its status, the ticks and the note.

## Where things live

- `src/shared/questionTypes.js`: checking, answer text, ids, validation (`typedProblems`), and how reviews are stored. No DOM.
- `src/shared/typedQuestions.js`: the built-in questions (`TYPED_QUESTIONS[course][lesson]`) and one paragraph per unit (`UNIT_ESSAYS`).
- `src/game/game.js`: drawing and answering the questions, the written step, the student's list, and the parent check (search for "more question types").
- `src/teacher/report.ts`: the dashboard card and the ✍️ Written tab. `src/teacher/lessons.ts` adds a "More question types" card per lesson in Lessons & questions, with Hide and Restore (saved in `question_edits.hidden`, like the multiple-choice bank).
- `scripts/check-typed.mjs`: checks every question and prints counts per course.

**Ids:** these questions get ids the same way as the bank, from the prompt plus the correct answer (for example, the right items joined in order). Changing either one starts the miss rate over and drops a hide, the same as for multiple choice.

## Adding questions

Add entries to `TYPED_QUESTIONS` in the shapes listed at the top of `questionTypes.js`, then run `node scripts/check-typed.mjs`. A question with a problem is skipped in the app rather than shown broken. For `pick`, `answers` are word positions counting from 0, and punctuation stays attached to its word (`"ball."`).

## Math: Think it through

Every math station that has skills (52 stations, grades 4 and 6) has a **🧠 Think it through** button under "Open for business" once the station is open. It runs a short set of 2 scored questions of the newer types (select all, two-part, sort, put in order, type the answer), then one "explain your thinking" short answer for a grown-up to read, the same way English practice does. It stays in the shop and doesn't gate anything; stations still open through orders and quizzes. Results are kept in the save as `mathThink["<shop>:<station>"]`. Written answers appear under "✍️ My written answers" on the shop page, in the teacher's ✍️ Written tab, and in the parent check. Math questions are keyed by station in `TYPED_QUESTIONS.math`, for example `"cafe:1"`. In the teacher app, Lessons & questions → **🧮 Math: Think it through** lists every station's questions, where you can hide, restore or add your own.

## What's included now

- **English Unit 1 (Nouns), History Unit 1, and Biology Unit 1:** every lesson has 2 scored questions of the newer types and 1 short answer.
- **All 7 units:** a unit-test paragraph.
- **Math:** 52 stations, each with 2 scored questions and 1 explain-your-thinking answer (156 questions).

Next units follow the same pattern.

## Teachers adding their own

In Lessons & questions, the **More question types** card (each lesson) and the **🧮 Math: Think it through** card (each station) have two buttons:

- **Copy prompt for these types:** copies a prompt for any chatbot. It asks for a mix of the types above plus one short answer, gives the exact JSON shapes, follows the content rules, and lists the questions the lesson already has.
- **Import questions of these types:** paste the chatbot's reply, up to 12 questions at a time. Each one is checked with `typedProblems`. Broken ones are skipped with the reason, and so is any question the lesson already has.

Imported questions are **drafts** until the teacher taps **Approve**. **Reject** or **Delete** removes one.

They're saved per class in `question_edits.addedTyped["<course>:<lesson>"]` (math: `"math:<shop>:<station>"`), so there's no migration, and **Copy to my other classes** copies them too. The game mixes approved ones in with the built-in questions (`typedQuestions`). Multiple choice still goes through the regular Import, and the unit-test paragraph is built in.

## Read-the-picture questions (math)

Some math problems ask the student to pick a **picture** instead of a number. Each answer choice is a diagram (`picChoice` in `src/game/game.js`). They show up as a variant of an existing skill, so they count toward that skill's practice, and each wrong picture is tied to the mix-up it shows.

| Building | Skill | How often | The question | Wrong pictures |
|---|---|---|---|---|
| Pizza Parlor | `eqFracModel` | levels 2 and 3, about 3 in 10 | Which bar shows the same amount as a/b, cut into more slices? | adds instead of multiplies (`additiveEquiv`), only the bottom scaled (`onlyOneScaled`), the unshaded part, one slice off |
| Toy Shop | `partialProd2` | level 2, about 1 in 4 | Which area model shows a × b? | tens written as ones (`shiftWrong`), only two of the four parts (`partialMissing`) |
| Market Stall | `findingPct` | level 1, about 1 in 4 | Which bar is P% shaded? | the other part shaded (`percentComplement`), shaded out of 5 instead of 10 (`percentNot100`), one part off |
| Potion Lab | `oneStepMult` | levels 1 and 2, about 1 in 4 | Which bar model shows ax = b? | x plus a (`inverseWrong`), a boxes of b making x (`inverseWrong`) |
| Ice Rink | `cmpRational` | level 2, about 3 in 10 | Which number line shows both numbers in the right places? | signs flipped (`signWrong`), points swapped (`negCompare`) |

Each question has 3 or 4 choices, exactly one right picture, and no repeats (checked on 1,000 generated problems per skill).
