# 🤸 Stand-and-stretch breaks

A short movement break between subjects, led by the student's pet. Separate from 🧠 brain stretches (`BRAIN-GAMES.md`).

## Owner decisions

- **When:** after a student finishes one subject and goes to start a different one (Math, English, Reading Log, History, Science).
- **What:** her pet acts out 4 moves, 20 seconds each, with a countdown (about 1½ minutes).
- **No skipping.** There is no close button. Done shows when the last countdown ends.
- **Teachers control all of it:** on/off, how many minutes in a subject before a switch brings a break, and which moves are in the cycle.

## How it works

- **Shared code:** `src/shared/moveBreaks.ts` (the moves, `moveSettings`, `pickMoves`, `normalizeMoveState`), used by the game and the teacher app.
- **Class setting** `game_settings.move = {enabled, minutes, moves}`: off until a teacher turns it on; new classes start with it on (`NEW_CLASS_SETTINGS`), existing classes keep theirs. `minutes` defaults to 10 (0 = every switch, up to 60). Every move is in the cycle unless unchecked.
- **Teacher app:** Quick setup has the on/off switch; Settings has the switch, the minutes, and "Moves in the cycle" (Use all / Block all).
- **A new subject:** the subject on screen (`subjectOnScreen()`) changes from the one she was last working in today. Town, the Arcade, Word Workshop, Fact Sprint extras and brain stretches in between don't count, so walking through town from Math to History still brings a break. The first subject of the day never does.
- **Enough time:** only active seconds in the earlier subject count (`S.move.secs`, from the town tracker).
- **A good moment:** the same rule as brain stretches (`brainBreakNow`): never in the middle of an order, a question, a sprint or a game. A break never opens over a brain stretch, and a brain stretch waits for a break to finish.
- **Moves:** picked at random from the class's cycle, with moves from the last break or two put last. Each move has its own pet animation (`.move-<id>` in `src/styles/game.css`); reduced motion turns the animation off. The countdown pauses while Pet World is in the background.
- **Save:** `S.move = {day, subject, secs, due, recent, breaks}`. `due` keeps a waiting break through a reload or sign-in (same day); `breaks` keeps the last 60.
- **Time:** break time goes to no subject.
- **Ledger:** each finished break is an event ("🤸 Stand and stretch after ➗ Math · Reach for the sky, …").
