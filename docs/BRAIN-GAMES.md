# Brain stretches

**Goal:** short brain games are part of the student's day. They are not in the Arcade: they come to her.

## Owner decisions

- **When:** a stretch the first time the town opens each day ("morning"), and one after each core subject on the daily plan.
- **What:** 3 games in a row, picked at random from the games the teacher left in the cycle. No game repeats within a stretch, and games from the last two stretches come back only when nothing else is left.
- **No skipping.** There is no close button. A stretch left unfinished comes back after a reload or sign-in (same day).
- **Levels:** every game starts at its easiest level and moves up one level after 3 results in a row at 85% or better.
- **Never crushing:** after 2 results in a row under 60%, the game gets gentler: down one level, or at the easiest level a little more time (`?pace=`, in quarter steps up to double). Extra time steps back by a quarter with each 85%+ result before levels start moving up again. Timed games (Color Clash, Speed Math, Go / No-Go, Dual N-Back, Block Path) stretch their timers (`src/brain-games/src/utils/pace.ts`); with extra time Block Path starts with a shorter path and Pattern Matrix offers 3 choices instead of 4. After each game she sees her score, "Your best yet!" when it is, and what changes next time, always worded as a step forward.
- **Fresh every time:** Pattern Matrix makes its puzzles from rules (count, shape, fill, color, arrow direction; one rule or two), and Word Builder draws 5 of about 36 kid-friendly words per level, with 💡 Show a letter and Skip (after a miss). Every game ends with Play again.
- **School-wide:** brain stretches are on for every class made from now on (the teacher's Quick setup menu shows it); existing classes keep their setting.
- **Time:** stretch time goes to its own **🧠 Brain stretch** row in time by subject. It never counts as math (or any subject) time, and never uses Arcade time.
- **Results** go to the teacher's student page (🧠 Brain tab) and the day's Ledger entry.

## How it works

- **Games:** source in `src/brain-games/` (see its README), built into `public/brain-games/`. Pet World opens one game at a time in a frame (`?embed=true&game=…&difficulty=…&stretch=…`); the game posts `brain:result` when it ends.
- **Teacher app** (class settings, 🧠 Brain stretches): the on/off switch and a checkbox per game ("Games in the cycle", with Use all / Block all). Saved in `classes.game_settings.brain` as `{enabled, games:{id:false}}`. Off by default; a game is in the cycle unless it's set to false. No migration.
- **Core subject:** a daily plan item that is time in a subject or a unit's practice, quiz or test (`kind` `subject` or `unit`). When one turns ✅, the next break brings its stretch, labeled "Brain stretch after ➗ Math" (or the unit). Items already ✅ before the day's first stretch don't get catch-up stretches. Projects don't count.
- **A break:** never during an order (`shift`), a Fact Sprint, a Word Workshop run, a lesson question, the Reading Log, a project form, a dig, Scribe School, the Art Studio or the Arcade. The game checks after each screen change and every 15 seconds.
- **Stuck game:** if a game never reports (didn't load, froze), a Next button shows after 8 minutes so she isn't trapped. That game counts as played with no result.
- **Save:** `S.brain` (`src/shared/brainGames.ts`): `results` (last 400: game, level, accuracy, reaction time, score, seconds, stretch), `stretches` (last 90), `levels`, `streak`, `slump`, `pace`, `morning`, `stretched`, `active`. `mergeWork` keeps both devices' results, and each game's level and pace from whichever device played it last.
- **Town page:** each of today's stretches is a row in 📋 Today's plan (✅ when its 3 games are done).
- **Ledger:** a finished stretch is an event ("🧠 Morning brain stretch · Color Clash 90%, …"); minutes show as 🧠 Brain stretch.
- **Teacher report:** the 🧠 Brain tab shows stretches finished in the last 7 days, each game's level, times played, accuracy (first 5 → last 5) and reaction time, and the latest 15 games.
