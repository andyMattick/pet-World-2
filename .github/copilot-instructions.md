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

## What this project is

Pet Town: 6th grade math practice games (Khan Academy order), with step-level diagnostics for teachers.

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
| `src/game/game.js` | About 1,850 lines. The `GEN` object with 14 generators: `basic, tape, groups, dnlCreate, dnl, dnlTable, table, equiv, word, realworld, understand, coord, units, ppw`, plus the Bakery Scale generators `addDec, subDec, decWord` (`SCALE_GEN`), the Sharing Pans generators `fracDivWhole, wholeDivFrac` (`PANS_GEN`), the Boxing Treats generators `fracDiv, mixedDiv, fracInterp, fracWord` (`BOXES_GEN`), the Register generators `mulDecPlace, mulDec, div2, divMulti` (`REGISTER_GEN`, with the `XD` exact decimal helpers), the Bulk Orders generators `divToDec, divDec2, divDec3` (`BULK_GEN`, with `longDivisionDec`), and the 4th grade Lemonade Stand generators `cmpMult, cmpWord, mdWord, estWord, eqWord, multiStep, factorPairs, identFactors, relateFM, identMultiples, primeId, compositeId, primeComp, numPatterns, shapePatterns` (`LEMON_GEN`), and the Toy Shop generators `pvBlocks, pvTable, digitValue, largestSmallest, expandedForm, writtenForm, differentForms, regroup, mult10, div10, compareNums, compareForms, roundNum, roundPlaces, roundWord, addMulti, subMulti` (`TOYS_GEN`) and `mult1by10s, areaMult1, distMult, estProducts, multRegroup, areaMult2, partialProd2, mult2digit, estDiv, interpRem, divRem, divPV, areaDiv, estQuot, divBy2345, divBy6789` (`TOYS2_GEN`, with the `areaHTML` area model), and the Pizza Parlor generators `eqFracModel, eqFracLine, eqFrac, diffWholes, commonDen, cmpVisual, cmpBench, cmpFrac, cmpFracWord, decompVisual, decomp, addLike, subLike, fracWordAS, mixedImproper, mixedAS, mixedASregroup, mixedWord` (`PIZZA_GEN` and `PIZZA2_GEN`, with `fracBarSVG`, `numberLineSVG`, `jumpsLineSVG`, and `hundredGridSVG`; Garden Center `GARDEN_GEN`, with `rectSVG`), all merged into `GEN`, with the `FRAC` exact fraction helpers, the `frac` answer boxes, the `digits` answer boxes under lined-up decimals (`digitBoxesHTML`), the Register layouts (`mulRowsHTML` for multiplication rows, `ldivHTML` for the long-division bus stop, and the `qr` quotient and remainder boxes), `nextStepIndex` (skips a step that is already done), and the `placeValue`, `lineUp`, `story`, `simplify`, `mixed`, `reciprocal`, `decimalShift`, `factors`, and `rounding` practice pop-ups in `DRILL_IMPL` (pop-ups practice the earliest part of a problem: see `docs/DRILLS.md`). Functions `submit`, `completeOrder`, `openPractice`, `enterAs`, `openJoin`, `buyReward`, `tableDown`, `simplestStep`, `simplestChoice`, `renderShopFloor`, `shopProgress`, `renderHall`, `renderParent`; `shift.shop`, Fact Sprint, and drill mixing stay intact. Music: `TRACKS` (4 tracks), `Music.setTrack` / `setVolume`, the music menu (`openMusicMenu`), and `musicAllowed()` for the teacher's Allow music switch. |
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
3. Run `git diff --stat` and read it. If any protected file lost more than about 20 lines and the task didn't ask for a removal, stop and ask the owner.
4. If the change affects anything a student sees, check it in device mode at iPhone SE size.
5. Commit in small steps with clear messages, like "Add reward registry" or "Fix PIN lockout message." Don't use messages like "Initial setup" or "Refactor."

## How to work on a task

1. Read the files you'll touch, in full, before changing them.
2. Tell the owner your plan in a few sentences: which files, and what changes in each.
3. Make the change in small steps, running `npm run verify` along the way.
4. Report what you changed, what you tested, and anything you couldn't test.

## Rewards display

Keep `renderBook()` and `rewardTileHTML()` in `src/game/game.js`. Open-building town tiles show their mini sticker strips; locked building tiles show no sticker extras.
