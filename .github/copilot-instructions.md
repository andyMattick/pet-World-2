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

## Protected files: edit carefully, never replace

| File | What must stay |
|---|---|
| `src/game/game.js` | About 1,280 lines. The `GEN` object with 14 generators: `basic, tape, groups, dnlCreate, dnl, dnlTable, table, equiv, word, realworld, understand, coord, units, ppw`. Functions `submit`, `completeOrder`, `openPractice`, `enterAs`, `openJoin`, `renderShop`, `renderHall`, `renderParent`. |
| `src/shared/registry.ts` | Exports `SKILLS`, `SKILL_ORDER`, `STATIONS`, `UNLOCK_AT`, `MIS`, `statusFromRecent`, `DRILLS`, `drillLabel`, `DrillSettings`, `DEFAULT_DRILL_SETTINGS`, `mergeDrillSettings`, `drillTypeOn`. |
| `src/lib/supabase.ts` | Exports `backendConfigured` and `makeClient`. |
| `src/lib/studentBackend.ts` | Exports `Backend` with `restore`, `roster`, `join`, `signOut`, `saveSoon`, `log`, `flush`, `refreshSettings`; student settings fields stay live and separate from saved state. |
| `src/teacher/main.ts` | Supabase email sign-in, classes, roster with PIN cards, settings, live dashboard. |
| `src/teacher/report.ts` | Exports `renderClassReport`, `openDetail`. |
| `supabase/migrations/*.sql` | Tables `classes, students, student_sessions, saves, problems, attempts, practice_popups, sprints`. Functions `add_students, reset_pin, class_report, class_roster, claim_student, my_student`. |

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
4. Commit in small steps with clear messages, like "Add reward registry" or "Fix PIN lockout message." Don't use messages like "Initial setup" or "Refactor."

## How to work on a task

1. Read the files you'll touch, in full, before changing them.
2. Tell the owner your plan in a few sentences: which files, and what changes in each.
3. Make the change in small steps, running `npm run verify` along the way.
4. Report what you changed, what you tested, and anything you couldn't test.

## Rewards display

Keep `renderBook()` and `rewardTileHTML()` in `src/game/game.js`. Open-building town tiles show their mini sticker strips; locked building tiles show no sticker extras.
