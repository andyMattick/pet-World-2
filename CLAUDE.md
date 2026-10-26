# Instructions for AI coding assistants

Read this whole file before doing anything in this repository.

## The most important rule

**This project already works. Do not regenerate, re-scaffold, simplify, or "clean up" it.**

The code in this repo was built and tested over many sessions. It includes 14 problem generators, step-level diagnostics, mix-up detection, and a Supabase schema with security rules. A previous assistant replaced it with a 100-line placeholder that had 4 hard-coded questions, and all of that work was lost. Do not repeat that.

- **Edit existing files in place** with the smallest change that does the job.
- **Never replace a whole file** unless the owner explicitly asks for that file to be rewritten.
- **Never create a new project, template, or starter app** on top of this one.
- **If a task seems to need a rewrite, stop and ask the owner first.** Explain why.
- **If something errors, fix that specific error.** Don't rewrite the file around it.

## New learning content

Any new lesson, question, unit, math station, vocab list, or reading follows **`CONTENT-RULES.md`**: every lesson needs its newer-type questions and a short answer, multiple-choice questions need fair wrong answers, everything gets a blind review and a review list with right answers in bold, and ids stay stable. Run `node scripts/check-content.mjs` before handing content over.

## What this project is

Pet World: 6th grade math practice games (Khan Academy order), with step-level diagnostics for teachers.

- **Game:** `index.html` + `src/game/game.js`. Students join with class code + name + PIN.
- **Teacher app:** `teacher.html` + `src/teacher/main.ts` + `src/teacher/report.ts`.
- **Shared definitions:** `src/shared/registry.ts` (skills, stations, mix-ups). Both apps import it.
- **Backend:** Supabase. The schema, security rules, and functions are in `supabase/migrations/`.
- **Build:** Vite + TypeScript. `npm run dev`, `npm run build`, `npm run typecheck`, `npm run verify`.

See `README.md` for setup and architecture, and `docs/REWARDS.md` for the next planned feature.

`docs/READ-FIRST.md` defines the café order ticket, plan, adjustable reading allowance, and read-aloud support. Keep those behaviors in the existing game flow without changing problem generators.

## Protected files: edit carefully, never replace

| File | What must stay |
|---|---|
| `src/game/game.js` | About 1,850 lines. The `GEN` object with 14 generators: `basic, tape, groups, dnlCreate, dnl, dnlTable, table, equiv, word, realworld, understand, coord, units, ppw`, plus the Bakery Scale generators `addDec, subDec, decWord` (`SCALE_GEN`), the Sharing Pans generators `fracDivWhole, wholeDivFrac` (`PANS_GEN`), the Boxing Treats generators `fracDiv, mixedDiv, fracInterp, fracWord` (`BOXES_GEN`), the Register generators `mulDecPlace, mulDec, div2, divMulti` (`REGISTER_GEN`, with the `XD` exact decimal helpers), the Bulk Orders generators `divToDec, divDec2, divDec3` (`BULK_GEN`, with `longDivisionDec`), and the 4th grade Lemonade Stand generators `cmpMult, cmpWord, mdWord, estWord, eqWord, multiStep, factorPairs, identFactors, relateFM, identMultiples, primeId, compositeId, primeComp, numPatterns, shapePatterns` (`LEMON_GEN`), and the Toy Shop generators `pvBlocks, pvTable, digitValue, largestSmallest, expandedForm, writtenForm, differentForms, regroup, mult10, div10, compareNums, compareForms, roundNum, roundPlaces, roundWord, addMulti, subMulti` (`TOYS_GEN`) and `mult1by10s, areaMult1, distMult, estProducts, multRegroup, areaMult2, partialProd2, mult2digit, estDiv, interpRem, divRem, divPV, areaDiv, estQuot, divBy2345, divBy6789` (`TOYS2_GEN`, with the `areaHTML` area model), and the Pizza Parlor generators `eqFracModel, eqFracLine, eqFrac, diffWholes, commonDen, cmpVisual, cmpBench, cmpFrac, cmpFracWord, decompVisual, decomp, addLike, subLike, fracWordAS, mixedImproper, mixedAS, mixedASregroup, mixedWord` (`PIZZA_GEN` and `PIZZA2_GEN`, with `fracBarSVG`, `numberLineSVG`, `jumpsLineSVG`, and `hundredGridSVG`; Garden Center `GARDEN_GEN`, with `rectSVG`; Market Stall `MARKET_GEN`, with `dnlFit`; Clock Tower `CLOCK_GEN`, with the order-of-operations engine `ooEval` / `ooProblem`; Ice Rink `RINK_GEN`, with `iceLineSVG` and `negStep`, whose `neg:true` puts a ± button beside the answer box; Potion Lab `POTION_GEN` and Pet Fair `POTION2_GEN` (Unit 7 moved to the Pet Fair on Oct 26, 2026), with `evalProblem`, `exprChoice`, `balanceHTML`, `ineqSVG`, `hangerHTML`, and `q1GraphSVG`; Pet Houses `HOUSES_GEN`, with `shapeSVG` and `turnable`; Pet Harbor `HARBOR_GEN` (Unit 9 moved out of Pet Houses on Oct 26, 2026), with `planeSVG`; Pet Post Office `HOUSES2_GEN` (Unit 10, same day; the name is kept), with `SOLID3D`, `boxSVG`, and `netSVG`; Pet Show `SHOW_GEN`, with `dotPlotSVG`, `histSVG`, and `boxPlotSVG`), all merged into `GEN`, with the `FRAC` exact fraction helpers, the `frac` answer boxes, the `digits` answer boxes under lined-up decimals (`digitBoxesHTML`), the Register layouts (`mulRowsHTML` for multiplication rows, `ldivHTML` for the long-division bus stop, and the `qr` quotient and remainder boxes), `nextStepIndex` (skips a step that is already done), and the `placeValue`, `lineUp`, `story`, `simplify`, `mixed`, `reciprocal`, `decimalShift`, `factors`, and `rounding` practice pop-ups in `DRILL_IMPL` (pop-ups practice the earliest part of a problem: see `docs/DRILLS.md`). Functions `submit`, `completeOrder`, `openPractice`, `enterAs`, `openJoin`, `buyReward`, `tableDown`, `simplestStep`, `simplestChoice`, `renderShopFloor`, `shopProgress`, `renderHall`, `renderParent`; `shift.shop`, Fact Sprint, and drill mixing stay intact. Music: `TRACKS` (4 tracks), `Music.setTrack` / `setVolume`, the music menu (`openMusicMenu`), and `musicAllowed()` for the teacher's Allow music switch. |
| `src/shared/registry.ts` | Exports `NEIGHBORHOODS`, `DEFAULT_HOME` (`'g6'`), `BUILDINGS` (each with a `hood`), `buildingsIn`, `prevBuilding`, `nextBuilding`, `builtHoods`, `validHood`, `SKILLS`, `LEMON_STATIONS`, `TOY_STATIONS`, `PIZZA_STATIONS`, `SKILL_ORDER`, `STATIONS`, `BAKERY_STATIONS`, `SHOPS`, `shopOfSkill`, `QUIZ_DEFAULTS`, `QuizSettings`, `quizSettings`, `UNLOCK_AT`, `MIS`, `notSimplest`, `statusFromRecent`, `DRILLS`, `drillLabel`, `DrillSettings`, `DEFAULT_DRILL_SETTINGS`, `mergeDrillSettings`, `drillTypeOn`. Skills `addDec`, `subDec`, `decWord`, `fracDivWhole`, `wholeDivFrac`, `fracDiv`, `mixedDiv`, `fracInterp`, `fracWord`, `mulDecPlace`, `mulDec`, `div2`, `divMulti`, `divToDec`, `divDec2`, `divDec3` and mix-ups `rightAlign`, `noRegroup`, `smallerFromLarger`, `estimateOff`, `wrongOperation`, `divAsMult`, `denomOnly`, `numerOnly`, `reversedDivision`, `notMixed`, `flipWrong`, `noFlip`, `mixedAsParts`, `pointLikeAdding`, `placesMiscount`, `partialShift`, `quotientTooSmall`, `quotientTooBig`, `missingZero`, `remainderNotDecimal`, `shiftOneOnly`, `pointMisplaced` stay intact. |
| `src/lib/supabase.ts` | Exports `backendConfigured` and `makeClient`. |
| `src/lib/studentBackend.ts` | Exports `Backend` with `restore`, `roster`, `join`, `signOut`, `saveSoon`, `log`, `flush`, `refreshSettings`, `startSession`, `endSession`, plus `ActivityTracker` and `deviceType` (practice time); student settings fields stay live and separate from saved state. |
| `src/teacher/main.ts` | Supabase email sign-in, classes, roster with PIN cards, settings, live dashboard. |
| `src/teacher/report.ts` | Exports `renderClassReport`, `openDetail`. Practice time (`ss`) columns, the "Practice time this week" card, and the student detail chart stay intact. |
| `supabase/migrations/*.sql` | Tables `classes, students, student_sessions, saves, problems, attempts, practice_popups, sprints, assessments`. Table `practice_sessions`. Functions `add_students, reset_pin, reset_student, class_report, class_roster, claim_student, my_student, session_start, session_ping`; teacher-tools columns `pin_plain, reset_at` stay intact. |

**Do not invent new tables or functions** (for example a `learning_events` table) when existing ones already cover the job. If a new table is truly needed, add a **new** migration file. Never edit a migration that has already been run.

## Things that look wrong but are intentional

- `src/game/game.js` is JavaScript, not TypeScript. It was ported from a tested single-file version. `allowJs` is on. Don't convert it unless asked.
- Imports have no `.ts` extension (`from '../shared/registry'`). Vite resolves them. Don't add extensions.
- Without a `.env`, the game shows a name screen and the teacher app says Supabase isn't configured. That's local mode, and it's expected.
- `.env` is not committed. Supabase keys go in `.env` locally and in the hosting provider's environment variables.
- Opening `index.html` directly in a browser, or with Live Server, shows a blank page. Always use `npm run dev`.

## Before every commit

1. Run `npm run verify`. It checks that the protected pieces above still exist. **If it fails, do not commit.** Undo the change that broke it.
2. Run `npm run typecheck` and `npm run build`.
   If the change touches a math generator, also run `npm run check-math` (docs/MATH-CHECK.md): every answer key against an independent solver, and what quizzes and tests show (`testPrompt`).
   If the change touches signing in, saving, or `mergeWork` (in `src/game/game.js`) or `src/lib/studentBackend.ts`, also run `npm run smoke`. It opens the game in a headless browser and checks 6 sign-in situations, including a brand-new device and two devices at once. The first time, run `npx playwright install chromium`.
3. Run `git diff --stat` and read it. If any protected file lost more than about 20 lines and the task didn't ask for a removal, stop and ask the owner.
4. If the change affects anything a student sees, check it in device mode at iPhone SE size.
5. Commit in small steps with clear messages, like "Add reward registry" or "Fix PIN lockout message." Don't use messages like "Initial setup" or "Refactor."

## How to work on a task

1. Read the files you'll touch, in full, before changing them.
2. Tell the owner your plan in a few sentences: which files, and what changes in each.
3. Make the change in small steps, running `npm run verify` along the way.
4. Report what you changed, what you tested, and anything you couldn't test.

## Tests: review first, a grown-up's PIN, every unit (owner rule, Oct 21, 2026)

This applies to **every unit in every subject, now and in the future** (English, History, Biology, every math shop, every grade). See `docs/TEST-GATE.md` and `docs/TEST-REVIEW.md`.

1. **Review before every test.** The 📇 review comes before the Pet World unit test and again before the Khan unit test. It's the same review both times. Starting a test uses the review up, so every try needs a new one (`S.testReady`, `markTestReady`, `useTestReady`).
2. **The review teaches what she missed.** A wrong answer shows that lesson right away (`reviewTeachHTML`). After the questions, every missed lesson comes back in a fix-up round: the lesson first, then a new question (`startReviewFixup`). Math does the same with fix-up orders (`shift.unitReview.needs`). The test is ready only after the fix-up.
3. **A grown-up's PIN** before each review and before each test (`askGrownUp`, `gatedTestReview`, `gatedPetWorldTest`, `gatedKhanTest`, `gatedUnitReview`, `gatedUnitTest`). There's no skip button, only Cancel. Every OK goes in the day log.
4. **Written answers** never show what a strong answer has unless a grown-up opens the 💡 hint with the PIN.

**A new unit is not done until:**
- It runs through the shared library course (`englishCourse`) or shop (`SHOPS` + `renderShopFloor`) code, so it gets the review, the PIN steps and the fix-up for free. Never build a separate test screen around them.
- It has a Khan unit test link: `KHAN_UNIT_TESTS` (English, History, Biology) or `MATH_KHAN_UNITS` (math) in `src/game/game.js`, and the table in `KHAN-SETUP.md`.
- Every lesson has its short `lesson:` explanation (what the review shows when she misses it).

`npm run verify` checks all of this. Never remove or weaken these steps to make a check pass.

## Games go in the unit and in the Arcade (owner rule, Oct 26, 2026)

Every time the owner says something is a game, it goes in **both** places: inside its unit (or shop station) **and** in the 🕹️ Arcade (`ARCADE_GAMES` in `src/shared/registry.ts`, with a ticket payout in `arcadeModuleMessage`). Add it to the unit-game list in `scripts/verify.mjs` and the table in `docs/ARCADE-GAMES.md`. `npm run verify` checks the list. See `docs/ARCADE-GAMES.md` for the two ways to build the Arcade copy.

## Reading Quiz

Keep the grown-up check in front of reading quizzes: only chapters whose notes are verified (`reading:<bookId>:<chapterId>` in `quiz_overrides`, or the local parent PIN review) can be quizzed. Keep `buildReadingQuiz`, `readingChapterState`, and the teacher app's `readingReviewHTML`. Reading quizzes never award Pet World coins. See `docs/READING-QUIZ.md`.

## Rewards display

Keep `renderBook()` and `rewardTileHTML()` in `src/game/game.js`. Open-building town tiles show their mini sticker strips; locked building tiles show no sticker extras.
