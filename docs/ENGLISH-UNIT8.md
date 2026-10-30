# English Unit 8: Sentences and clauses (the Sentence Library)

This unit follows Khan Academy Grammar → *Syntax: sentences and clauses* (Unit 8). Lesson list, exercise order and links come from Khan's lesson sitemaps on khanacademy.org (Oct 30, 2026); the unit page itself only loads in a browser, so where Khan's Quiz 1 and Quiz 2 sit wasn't visible. It lives in building `elaSent` (🧩 Sentence Library), course `sentences`. The theme: every book in the library is built from sentences, and every sentence is a puzzle with a job.

## Lessons (Khan's order)

| Khan lesson (block) | Practices (Khan's exercises, in order) | Pet World quiz |
|---|---|---|
| Introduction to sentences | Declarative, interrogative, and imperative sentences | Sentence types Quiz |
| Types of sentences | Simple and compound sentences · Rearranging simple and compound sentences · Complex and compound-complex sentences | Types of sentences Quiz |
| Subjects and predicates | Identifying subject and predicate · Identifying subject, direct object, and indirect object | Subjects and predicates Quiz |
| Phrases and clauses | Introduction to phrases and clauses · Dependent and independent clauses · Phrase and clause placement · Relative clauses | Phrases and clauses Quiz |

Khan's exercise URLs, in order (all under `khanacademy.org/humanities/grammar/syntax-sentences-and-clauses/`):
`introduction-to-sentences/e/declarative--interrogative--and-imperative-sentences`, `types-of-sentences/e/simple-and-compound-sentences`, `types-of-sentences/e/rearranging-simple-and-compound-sentences`, `types-of-sentences/e/complex-and-compound-complex-sentences`, `subjects-and-predicates/e/identifying-subject-and-predicate`, `subjects-and-predicates/e/identifying-subject--direct-object--and-indirect-object`, `phrases-and-clauses/e/introduction-to-phrases-and-clauses`, `phrases-and-clauses/e/dependent-and-independent-clauses`, `phrases-and-clauses/e/phrase-and-clause-placement`, `phrases-and-clauses/e/relative-clauses`. Unit test: `phrases-and-clauses/test/syntax-sentences-and-clauses-unit-test`.

- Each block opens with a library story (`hook`) and links to Khan's first video in that lesson (`KHAN_LINKS.sentences`). Khan's other videos are listed under the block as extra lessons: Three types of sentence; Exclamations; Complex sentences; Compound-complex sentences; Subject, direct object, and indirect object; Dependent and independent clauses; Relative clauses.
- **Unit test:** 2 questions per lesson (20), the hardest first (`testPer: 2`). She needs 17 to pass, then writes the unit paragraph: a favorite place, with a question, a command, a compound, a complex and a compound-complex sentence, an indirect object and a relative clause.
- **Khan Academy unit test:** after she passes the Pet World test, the 🎓 card links to Khan's unit test (`KHAN_UNIT_TESTS.sentences`), behind the same review and grown-up PIN as every unit.
- **Question bank:** 14 multiple-choice questions per lesson (140 in all): 3 at level 1, 5 at level 2, 6 at level 3 (43%). Level 3 matches or beats Khan's hardest practice items: counting clauses in sentences with relative clauses, commands that look like questions (“Tell me why the sky is blue.”), questions reported inside statements, inverted subjects (“Across the field raced two muddy dogs”), compound direct objects, “nor” with inverted word order, “because of” phrases versus “because” clauses, dangling and misplaced modifiers, who / whom / whose, and commas around extra-information relative clauses.
- **Newer question types:** 2 scored per lesson (sort, select all, tap the words, type the answer, put in order, two-part) and 1 short answer.
- **📇 Review first:** 15 term cards (`termCards.sentences`).
- **Style choices:** an imperative sentence keeps its type even with an exclamation point; exclamatory means “What a…!” or “How…!”. A dependent clause that comes first takes a comma; one that comes last doesn't. The simple predicate includes helping verbs. Questions avoid places where grammar books disagree (whether “I won!” is declarative or exclamatory, a comma before a final “although” clause, who versus whom as a subject in casual speech).
- **Rewards:** like Units 1–7, the library has its room theme (`rooms.js`, already there) and the game's coins and Sentence Smith badge; English buildings have no 5-pet reward set. See the open question in the hand-off.
- **Review list:** `ENGLISH-UNIT8-review.md` (every question with the right answer in bold, and every Sentence Snap item).

## 🧩 Sentence Snap

`src/game/sentenceSnap.js` (items, rules, and `createSnap`, which draws a shift into any element) and `renderSentenceSnap` / `sentenceSnapCardHTML` in `src/game/game.js`. A card sits under each block, with that block's shelf.

- **A 90-second rush.** A right answer scores 1 and moves on by itself; 5 in a row adds 5 seconds (🔥). A wrong answer costs 5 seconds, stops the clock, and shows exactly why (and the right answer) before she taps Next. Stars come from the number right.
- **Shelf 1, Sentence sorter (27 sentences):** sort each one as declarative, interrogative, imperative or exclamatory, with the tricky ones mixed in (“Ben wants to know the time.”, “You finished the book, didn’t you?”, “Don’t feed the library cat!”). Stars at 8, 14, 20.
- **Shelf 2, Clause snapper (12 scenes × 4 orders):** an order card asks for a simple, compound, complex or compound-complex sentence. She taps clause tiles (blue independent, yellow dependent, purple joining word, plus two commas and a semicolon) into the tray in order; the sentence reads out as she builds, and the period is added. **Snap it!** checks the structure: the right type, a correct pattern (`SNAP_PATTERNS`: comma + joining word or a semicolon between independent clauses, a comma after a dependent clause that comes first, none before one that comes last), and the two events in story order. A miss names the mistake (comma splice, run-on, missing comma, a correct sentence of the wrong type) and shows one right build. Stars at 2, 4, 6.
- **Shelf 3, Sentence slicer (27 puzzles):** tap the gap between the complete subject and the complete predicate (subjects with phrases and relative clauses inside them), or tap the simple subject, the verb, the direct object or the indirect object. Stars at 7, 12, 17.
- **Shelf 4, Fragment fixer (32 puzzles):** sort word groups as phrase, dependent clause or independent clause; pick the fix for a fragment; pick the clear sentence over misplaced and dangling ones; pick who / whom / whose; tap the noun a relative clause describes. Stars at 5, 9, 13.
- **Coins:** 10 + 5 a star the first time a shelf earns a star, then 5 for each new star. Three stars on all four shelves makes her a **🧩 Sentence Smith** (+50, once). Saved in `S.sentenceSnap` (`{shelves:{id:{best, top, plays}}, master}`, normalized on load); each finished shift goes in the day log (`k:'snap'`), under English.
- **In the Arcade too** (`sentence-snap`): `arcade/sentence-snap/index.html`, a Vite page that runs the same `createSnap`. It pays tickets (1 per star, up to 3 a shift), never coins, and doesn't change her unit stars or Sentence Smith. See `ARCADE-GAMES.md`.
- The game never counts toward quizzes, tests, mastery or unlocks.

## How it was checked

- `node scripts/verify.mjs`, `node scripts/check-content.mjs` (0 warnings), `node scripts/check-typed.mjs`, `node scripts/question-counts.mjs` (140 Unit 8 questions), and `node --check src/game/game.js`.
- Fair-question script: every question has 4 different choices, the right answer is never longer than every wrong one (17 tie with the longest wrong answer), curly apostrophes only, 3 / 5 / 6 per level in every lesson. Choices are shuffled when shown.
- Blind pass on the test view (all 140 questions shuffled, no key): 2 items fixed (see the review list).
- Sentence Snap: a Node script checks every item (tap targets, cut points, bins, distinct choices) and tries every ordering of every subset of tiles for all 12 scenes × 4 sentence types (about 13,700 builds each): each order has accepted builds, every sample answer is accepted, and every rejection has a message. 3,000 decks per shelf were dealt without an empty deck.
- Played at 375 px wide in Playwright on an esbuild stand-in build (local mode, unit unlocked): the town tile, the unit page (no sideways scroll), every shelf (right and wrong answers, a build, a slice), a block quiz (no hint or worked answer on screen), the Arcade page, and a full Sentence sorter shift (15 right, 3 stars, +25 coins, saved in `S.sentenceSnap`).
- Not run here (no npm packages in the sandbox): `npm run typecheck`, `npm run build` (Vite), and `npm run smoke`.
