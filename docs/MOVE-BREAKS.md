# 🤸 Stand-and-stretch breaks

A short movement break between subjects, led by the student's pet. Separate from 🧠 brain stretches (`BRAIN-GAMES.md`).

## Owner decisions

- **When (owner, Oct 27, 2026):** once a day, after her **third** subject. The day goes: ✝️ Bible → ☀️ warm-up (Fact Sprint, Word Workshop) → subject 1 → 🧠 brain break → subjects 2 and 3 → 🤸 exercise break → last subject. A subject counts as finished when its plan row is ✅ (with no plan: when she has spent the class's minutes in it). Before this, a break came every time she switched subjects.
- **What:** her pet acts out 4 moves with a countdown: 2 stretches and 2 fun ones, taking turns. Stretches are 20 seconds; fun ones are 20 to 45 seconds (a lap of the house or a water break gets more time).
- **Moves:** 8 stretches (reach, toe touch, arm circles, march, side bends, twists, shoulder rolls, jumping jacks) and 19 fun ones: a lap of the house, juggling, toss and catch, sock basketball, push-ups, plank, wall sit, handstand or cartwheel, a big breath held for a count of 10, a staring contest with Mom, a dance party, animal walks, flamingo, freeze statue, one-foot hops, funny faces, telling someone a joke, a water break and a pet hug. New moves start in every class's cycle; a teacher can uncheck any.
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
