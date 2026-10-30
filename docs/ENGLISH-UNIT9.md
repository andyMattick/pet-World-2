# English Unit 9: Conventions of standard English (the Rule Library)

This unit follows Khan Academy Grammar → *Syntax: conventions of standard English* (Unit 9). It lives in building `elaRules` (📏 Rule Library), course `conventions`. The theme: in the Rule Library, a sentence has to follow the rules before it goes on a shelf, and sentences that break them go to ⚖️ Rule Court, where she is the judge.

**Where the Khan listing came from (Oct 30, 2026):** khanacademy.org pages need JavaScript, so the unit page itself couldn't be read here. The lesson list, the exercises and the videos, in order, come from Khan's own sitemaps for the unit (`khanacademy.org/sitemaps/humanities/grammar/syntax-conventions-of-standard-english/<lesson>/sitemap.xml`), and the lesson names match Khan's course outline. Khan's quiz positions and the unit test link could not be confirmed (see below).

## Lessons (Khan's order)

| Khan lesson (block) | Khan videos | Practices (Khan's exercises, in order) | Pet World quiz |
|---|---|---|---|
| Subject-verb agreement and pronoun-antecedent agreement | Subject-verb agreement · Pronoun-antecedent agreement | [Subject-verb agreement](https://www.khanacademy.org/humanities/grammar/syntax-conventions-of-standard-english/subject-verb-agreement-and-pronoun-antecedent-agreement/e/subject-verb-agreement) · [Pronoun-antecedent agreement](https://www.khanacademy.org/humanities/grammar/syntax-conventions-of-standard-english/subject-verb-agreement-and-pronoun-antecedent-agreement/e/pronoun-antecedent-agreement) | Agreement Quiz |
| Fragments and run-ons | Recognizing fragments · Run-ons and comma splices | [Recognizing fragments](https://www.khanacademy.org/humanities/grammar/syntax-conventions-of-standard-english/fragments-and-run-ons/e/recognizing-fragments) · [Recognizing run-ons and comma splices](https://www.khanacademy.org/humanities/grammar/syntax-conventions-of-standard-english/fragments-and-run-ons/e/recognizing-run-ons-and-comma-splices) | Fragments and run-ons Quiz |
| Dangling modifiers and parallel structure | Dangling modifiers · Parallel structure | [Dangling modifiers](https://www.khanacademy.org/humanities/grammar/syntax-conventions-of-standard-english/dangling-modifiers-and-parallel-structure/e/dangling-modifiers) · [Parallel structure](https://www.khanacademy.org/humanities/grammar/syntax-conventions-of-standard-english/dangling-modifiers-and-parallel-structure/e/parallel-structure) | Dangling modifiers and parallel structure Quiz |

- Skill ids: `subjVerbAgree`, `pronAntecedent`, `fragments`, `runOns`, `danglingMods`, `parallelStructure`; block ids `agreement`, `fragments`, `modifiers`. Skill names are Khan's exercise names.
- Each block opens with a library story (`hook`) and links to Khan's first video in that lesson (`KHAN_LINKS.conventions`); Khan's second video is listed under the block as an extra lesson, like Unit 7.
- **Unit test:** 3 questions per lesson (18), the hardest first (`testPer: 3`). She needs 15 to pass, then writes the unit paragraph: advice for a new library helper with an opening describing phrase, a parallel list of three, a phrase between a subject and its verb, and no fragments or run-ons.
- **Khan Academy unit test:** after she passes the Pet World test, the 🎓 card links to Khan's unit test (`KHAN_UNIT_TESTS.conventions`), behind the same review and grown-up PIN as every unit. **The link is built from Khan's pattern** (the test sits after the last lesson, like Unit 7's) because the page couldn't be opened here. Please click it once; if it doesn't open, the right link is the "Unit test" at the bottom of the unit page.
- **Question bank:** 14 multiple-choice questions per lesson (84 in all): 3 at level 1, 5 at level 2, 6 at level 3 (43%). Level 3 matches or beats Khan's hardest practice items: subjects hidden behind two phrases, "one of the … who" sentences, either/or and neither/nor with the closer subject, subjects after the verb, collective and "not one of" antecedents, commands and questions that look like fragments, "who" clauses that never get a verb, splices with *however*, *then* and *therefore*, a fix that reverses the cause, dangling infinitives and "at the age of five," and either/or, neither/nor, not only/but also and comparisons in parallel form.
- **Newer question types:** 2 scored per lesson (sort, tap the words, select all, type the answer, two-part) and 1 short answer.
- **📇 Review first:** 12 term cards (`termCards.conventions`).
- **Style choices:** questions never depend on singular *they* for a person (each student … their), the one place guides disagree in this unit: pronoun items use things, named people, groups acting as one, or two people joined by *and*. Collective nouns appear only with "working as one group" or as one unit (the team won its game). Subjects after the verb use the formal plural (Under the bed are a pair of socks and an old shoe). No item puts a semicolon before *and*.
- **Review list:** `ENGLISH-UNIT9-review.md` (every question with the right answer in bold, and every Rule Court case).

## ⚖️ Rule Court

`src/game/ruleCourt.js` (cases, the game engine, the HTML and its CSS) and `renderRuleCourt` in `src/game/game.js`. Sentences from the Rule Library are on trial; she is the judge. Each case climbs three steps:

1. **The verdict:** 🔨 Guilty or 🕊️ Not guilty. Two cases in every docket are innocent sentences that look guilty (a command, a question, "Each of the muffins has…", two subjects joined by *and*).
2. **The charge:** which rule it broke. Then she points at the culprit word in the sentence (the verb or pronoun that doesn't match, the last word before the crash in a run-on, the word a dangling phrase wrongly describes, the word that breaks the pattern). Fragments skip the pointing step, because something is missing instead.
3. **The fix:** three rewrites; every wrong one says why it doesn't work.

- Four dockets of 8 cases (32 in all), easy to hard inside each one ("Round 1–3" on each case): Docket 1 Agreement Court, Docket 2 Night Court (fragments, run-ons), Docket 3 Appeals Court (dangling modifiers, parallel structure) under their blocks, and Docket 4 Supreme Court under the last block, which mixes all six rules and gives three charges to choose from instead of two.
- Any mistake shows why, the jury of pets gasps 😱, and the case goes back on the docket for a retrial at the end, so every session ends with every case closed. A case closed with no mistakes is perfect; perfect cases in a row show a 🔥 streak.
- **Stars and coins** like the Book Repair Desk: stars from perfect cases (`starsFor`); the first play of a docket pays 10 + 5 a star, later plays 5 for each new star. Three stars on all four dockets makes her **⚖️ Chief Justice** (+50, once). Saved in `S.ruleCourt` (normalized with the rest of the save); each finished docket goes in the day log (`k:'court'`), under English in the teacher's ledger.
- **In the Arcade too** (`rule-court`, 🔨 on the Arcade tile so it doesn't look like Pax Oeconomica): `arcade/rule-court/index.html`, a Vite page that uses the same engine and cases from `ruleCourt.js`. It pays tickets (1 per 2 perfect cases, up to 3 a docket), never coins, and doesn't change her unit stars or Chief Justice.
- The game never counts toward quizzes, tests, mastery or unlocks.

## How it was checked

- `node scripts/verify.mjs`, `node scripts/check-content.mjs` (0 warnings), `node scripts/check-typed.mjs`, `node scripts/question-counts.mjs` (84 Unit 9 questions), `node --check src/game/game.js`.
- Rule Court: every case checked by a script (each culprit word is in the sentence exactly as often as listed, three different fixes, none equal to the sentence, curly apostrophes, the innocent cases have an explanation). Every docket was played perfectly by script, and 3,000 dockets were played with random taps: every session ended with every case closed and no `undefined` text. This found and fixed a bug where a case missed twice dropped off the docket.
- Played in the built game at 375px wide (Playwright, local mode with the unit opened): the unit page, the Agreement Quiz (no hint or helper shows), every step of Rule Court in the Supreme Court docket with one deliberate mistake (retrial, 7 of 8 perfect, 2 stars, +20 coins, the day-log event), and the Arcade copy.
- **Blind review:** no second reviewer was available in this session, so the 84 questions were dumped in a shuffled order with no keys and solved again from that view; every key agreed. Three items were changed because a second answer could be argued (see the review list). A grown-up read-through of the review list is still the real blind check.
- Not run here (no npm packages in the sandbox): `npm run typecheck` (the changed TypeScript files were checked with a temporary tsconfig; only missing-package errors), `npm run build` (an esbuild stand-in built every page), `npm run smoke`.
