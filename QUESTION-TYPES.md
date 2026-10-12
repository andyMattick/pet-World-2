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

Every math station that has skills (52 stations, grades 4 and 6) has a **🧠 Think it through** button under "Open for business" once the station is open. It runs a short set of 2 scored questions of the newer types (select all, two-part, sort, put in order, type the answer), then one "explain your thinking" short answer for a grown-up to read, the same way English practice does. It stays in the shop and doesn't gate anything; stations still open through orders and quizzes. Results are kept in the save as `mathThink["<shop>:<station>"]`. Written answers appear under "✍️ My written answers" on the shop page, in the teacher's ✍️ Written tab, and in the parent check. Math questions are keyed by station in `TYPED_QUESTIONS.math`, for example `"cafe:1"`. Teachers can't hide them from Lessons & questions yet, because that tab lists only the English, History and Biology courses.

## What's included now

- **English Unit 1 (Nouns), History Unit 1, and Biology Unit 1:** every lesson has 2 scored questions of the newer types and 1 short answer.
- **All 7 units:** a unit-test paragraph.
- **Math:** 52 stations, each with 2 scored questions and 1 explain-your-thinking answer (156 questions).

Next units follow the same pattern. Teacher Copy prompt and Import still bring in multiple choice only.
