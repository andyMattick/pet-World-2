# ⏸️ "Still there?" nudge, then pause (ROADMAP F93)

Owner's ask (Oct 30, 2026), from 📈 Insights: "Pet World is open but idle 39% of the time. A 'still there?' nudge, or shorter sittings, might help." He chose: **nudge, then pause**.

## What she sees

1. **After 2 minutes with no taps or keys**, her helper pet pops up at the bottom of the screen: "**Mochi: Still there?**" with a big **I'm here! 🐾** button. Tapping it (or tapping anywhere, or any key) closes it, and time counts again from that tap.
2. **No answer in 3 more minutes:** Pet World **pauses**. A calm full screen: her pet napping 💤 and "**⏸️ Paused — tap to keep going**". Music stops. One line goes in the day log: "⏸️ Paused after 5 idle minutes".
3. **A tap anywhere** brings her back exactly where she was: the screen under the pause is never touched, so answers she typed are still there. "Welcome back! 🐾". Never a skip, a penalty, or lost coins. If she was in a math order, its timing skips the time away, so no "slow answer" pop-up comes from the pause.

## When it never asks (she's busy without tapping)

- A lesson video is playing (Pet World and kid videos), or a Khan lesson's watch window is open (`ActivityTracker.watching`).
- The Reading Log is counting reading (up to `READ_IDLE_MIN` after her last tap), or the ⏱️ reading timer is running.
- Read-aloud is speaking, or any audio or video on the page is playing.
- A timed round: Fact Sprint, a Word Workshop sprint, a word puzzle.
- A 🧠 brain stretch or 🤸 stand-and-stretch break.
- Anything on screen marked `data-idle-busy` (the hook for the Word Workshop listening timer and playback: add the attribute to its element while it runs).
- The page is hidden (it isn't counting then anyway). Coming back to the page starts the quiet clock again.

Being busy restarts the quiet clock, so when a video ends she gets the full 2 minutes again.

**Quizzes and tests:** a question may take a while to read, so on a math station quiz or Unit Test, an English/History/Biology quiz, unit test or test review question, or a reading quiz, the nudge waits **twice as long** (4 minutes by default, `IDLE_TEST_FACTOR`). The pause still comes the set minutes after the nudge.

## Settings

| Who | Where | What |
|---|---|---|
| Grown-up | Progress report (Town Hall → Open the progress report) → ⏸️ "Still there?" and pause. Saving asks for the grown-up PIN. | On/off, ask after 1–10 min, pause after 1–10 more min. "Use the teacher's setting" / "Back to the defaults" clears it. Saved in the town as `S.idleNudge`. |
| Teacher | Teacher app → Settings → ⏸️ "Still there?" and pause, and the switch on 🧭 Quick setup. | The same three, for the class: `classes.game_settings.idle = {on, nudge, pause}` (no new table). |

**The grown-up's setting wins**, then the teacher's, then the defaults (on, 2 and 3 minutes). `idleSettings()` in `src/shared/idleNudge.ts`.

## How time counting changed

- `ActivityTracker.holdSince` (set by the game) is the moment "Still there?" appeared, while it's up or Pet World is paused. The tracker counts **nothing after that moment**, not even watching, so the wait for an answer and the pause are idle time, never practice time. Practice time, time by subject, time per lesson and session pings all stop at the nudge.
- `ActivityTracker.lastInputAt` is the last tap or key on the page **or inside a same-origin game frame**, so taps in a unit game or the Arcade keep her "here".
- The old rule still holds underneath: time counts only with a tap in the last 60 seconds (or watching).

## Insights

- Paused time is idle: Insights' idle measure is on-screen minus active. A pause inside a practice session is already on screen and not active. A pause long enough for the session to close (30 minutes), or one never ended, is added to on-screen time from its day-log event (`from` = the nudge, `back` = her tap back), so every paused minute shows as idle.
- `ins.time.idle` has `pauses` and `pausedMinutes`. The teacher's student page shows "· 2 pauses after 'Still there?' (25 min)" on the idle line, and the idle recommendation says how many pauses happened.

## Code

| File | What |
|---|---|
| `src/shared/idleNudge.ts` | Defaults, limits, `idleSetting`, `idleSettings` (grown-up → teacher → defaults). |
| `src/lib/studentBackend.ts` | `ActivityTracker.holdSince`, `ActivityTracker.lastInputAt`. |
| `src/game/game.js` | The ⏸️ block after the wrap-it-up reminders: `idleBusy`, `idleOnTest`, `idleCheck` (every 5 s), `idleNudge`, `idlePause`, `idleResume`, `idleParentHTML`; plus the import, `normalize` (`S.idleNudge`), `eventText` (`pause`) and the progress report panel. `?idletest` adds `window.PetWorldIdle` for browser tests. |
| `src/styles/game.css` | `.idle-nudge`, `.idle-pause`. |
| `src/teacher/main.ts` | Settings section, Quick setup switch. |
| `src/shared/insights.ts`, `src/teacher/insightsCard.ts` | Pauses in the idle measure and text. |

Day-log event: `{k:'pause', t (paused at), idle (minutes since her last tap), from (nudge time), back (her tap back, added on resume)}`.
