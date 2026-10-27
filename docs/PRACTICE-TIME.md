# Practice time: sign-ins and active minutes

**Status: ready.** Run `supabase/migrations/20260929000000_practice_time.sql` in Supabase **after** the quizzes file (`20260928000000_quizzes.sql`). Read `AGENTS.md` first. **Edit in place, never rewrite a file.**

## What's tracked

- **Sign-ins:** a practice session starts when a student enters their town (sign-in or returning to the page).
- **Active minutes only.** Time counts only while the game tab is **visible** and the student has **tapped, clicked, or typed in the last 60 seconds**. Leaving the game open on a table doesn't count.
- **Heartbeat:**
  - The game reports active seconds about once a minute (`session_ping`), and once more when the tab is hidden.
  - The database accepts at most 90 seconds per report, and never more than the real time since the last report, so time can't be inflated.
  - After 30 minutes idle, the session is closed, and the next activity starts a new one.
- **Device:** phone, tablet, or computer, detected roughly from the screen.
- **Local mode** (no class): the same tracking, saved in the town as `S.sessions` (the last 30), and shown in the grown-ups progress report.

## What teachers see

- **Dashboard skill grid:** three new columns: **Last signed in** ("today 3:42 PM", "2 days ago"), **Today** (minutes), and **This week** (minutes, last 7 days).
- **A new card, "Practice time this week":** every student with their minutes, sorted from least to most. Students with **no sign-in in 7 days** are highlighted.
- **Student detail:**
  - a **4-week bar chart** of daily minutes
  - a **recent sessions** list with date, start time, end time, active minutes, and device
- "Today" and daily totals use the **teacher's time zone**.

## Time by subject

Each 15 seconds of active time is credited to whatever is on screen:

| On screen | Subject |
|---|---|
| A shop, a shift, a shift summary, or a math "Think it through" | Math |
| The Sprint Track (Fact Sprint, times tables) | Fact Sprint (its own row, so slow times tables don't use up the plan's math minutes; the teacher's Math course and Ledger still count it as math) |
| An English lesson, quiz or test (and its unit page) | English |
| The Reading Log or a reading quiz | Reading Log |
| Word Workshop | Word Workshop |
| A History lesson, quiz, test or project | History |
| A Biology lesson, quiz, test, project or lab | Science |
| The Arcade (clicks inside a game don't reach Pet World, so most game time isn't counted) | Arcade |
| The town map, the pet room, the sticker book, menus, the progress report | Around town |

- Saved in the town as `S.subjectTime = {'YYYY-MM-DD': {math: seconds, ...}}`, the student's own dates, the last 60 days. Two devices merge by keeping the larger total for each day and subject.
- **Grown-ups:** the progress report's Practice time panel has a **Time by subject** table for the last 7 days.
- **Teacher:** the student page's Practice time section has the same table, read from the student's save. The minutes above it come from the database, so the two can differ by a minute or two.
- Code: `src/shared/subjectTime.ts` (storing, merging, the table), `subjectOnScreen()` in `src/game/game.js`, and the `onActive` callback of `ActivityTracker` in `src/lib/studentBackend.ts`.

### Fixes (Oct 26, 2026): time she wasn't getting credit for

- **Unit games and the Arcade:** taps inside a game frame (Pet Show Awards, Shape Asteroids, every unit game and Arcade game) didn't reach the page, so the clock stopped a minute into a game. `ActivityTracker` now listens inside same-origin frames too.
- **Practice in a unit (daily plan):** the row counted only time at the unit's stations. It now also counts the shop floor (`shop:<id>`), the shift or quiz summary, 🧠 Think it through (`shop:<id>:<station>:think`) and the unit's own game (`GAME_PLACE_SHOP`). The row also shows all of today's minutes in that subject ("2 of 15 min here · 12 min of Math today"), so she sees all of her time.
- Dr. Paws' Surgery Center logs as `surgery:bakery` or `surgery:clock`.

### Videos count, and come first in History and Biology (owner rule, Oct 27, 2026)

- **Encouraged.** In History and Biology, each lesson's Khan link is a big **🎬 Watch the lesson first on Khan Academy** button with "The videos are the most important part. Watching counts as History (or Biology) time." Starting practice in a lesson she hasn't opened shows **Watch the lesson first!**, with **🎬 Watch it now** or **I already watched it**.
- **Counted.** Opening the Khan lesson (from the button or the prompt) starts a watch window of up to 25 minutes (`WATCH_CAP_MIN`). During it, time counts for the class with no taps, even while Pet World is in another tab, until it runs out or she starts the practice. A Pet World lesson video counts the whole time it's playing.
- How: `ActivityTracker.watching` (set by the game) counts as activity. The tracker now adds the real time between its checks (at most 2 minutes), because a background tab's timers can slow to once a minute.
- The day log gets "🎬 Opened the Khan Academy lesson: …", and the lesson shows "✓ Opened" (`S.videosWatched["khan:<course>:<lesson>"]`).
- Limit: Pet World can't see the Khan tab, so it can't tell whether the video is really playing there. The 25-minute window is the cap.

## What the database file does (tested on real PostgreSQL 16)

- Adds `practice_sessions`. Students can't read or write it directly; they only go through `session_start()` and `session_ping()`, which only touch their own session. Teachers can read their own classes' sessions.
- Adds `classes.game_settings` (used by `MUSIC.md` for "Allow music").
- `class_report()` gains `ss`: `{last, today, week, days: [[date, minutes]], recent: [[start, end, activeSeconds, device]]}`, and a third argument `p_tz` (the time zone name). The old two-argument version is replaced.
- `my_student()` also returns `game_settings`.

All six database files were run in order on real PostgreSQL 16, then tested as a teacher, a student, and a stranger:
- wrong PINs are rejected
- students can't see other students or sessions
- a stranger can't add time to someone's session
- a second teacher sees nothing of the first teacher's class
- a report claiming 5,000 seconds is capped
- impossible quiz scores are rejected
- reset still works

## Build steps

Commit after each step. Before each commit, run `npm run verify`, `npm run typecheck`, and `npm run build`, and **test in a real browser with the Console open, including at iPhone SE size**. Then `git push` and paste `git log -1 --stat`.

### Step 1: Database ✅ done

The migration file is in the repo and has been run in Supabase. Nothing to do.

### Step 2: Tracking in the game (signed in)

In `src/lib/studentBackend.ts`, add a small tracker:
- **`startSession()`:** calls `sb.rpc('session_start', {p_device})`, where `p_device` is `'phone'` if `matchMedia('(pointer: coarse)')` and the screen width is under 700px, `'tablet'` if coarse, otherwise `'computer'`. It stores the returned id.
- **Activity:** listen for `pointerdown`, `keydown`, and `touchstart` on `document` (passive listeners), and record `lastInput = Date.now()`.
- **Every 15 seconds,** if the tab is visible and `Date.now() - lastInput < 60000`, add 15 to `pendingSeconds`.
- **Every 60 seconds,** and when the tab becomes hidden, if `pendingSeconds > 0`: call `session_ping(id, pendingSeconds)` and reset the counter. If it returns false (the session was closed), call `startSession()`, then report again. If the call fails (offline), keep the seconds and try next time.
- **When the student switches player or signs out,** send the last report and stop.

- **One tracker, started once:** build the activity tracker once (a small class or closure) that counts active seconds and calls a callback for each 60-second report. `startSession()` first stops any running tracker (timers and listeners), so calling it twice never double-counts. Step 3 reuses the same tracker for local mode.

In `game.js`, call `Backend.startSession()` in `enterAs()`.

**Browser test:** play for 3 minutes, and a session row appears in Supabase (Table Editor → `practice_sessions`) with about 180 active seconds. Leave the tab open without touching it for 3 minutes, and the seconds don't grow.

Commit: `Track practice time`

### Step 3: Local mode and the progress report

- In local mode, the same tracker keeps `S.sessions` (the last 30: `{start, end, active}`), saved with the town. Add it to `fresh()` and `normalize()`.
- The grown-ups progress report (`renderParent`) gets a **Practice time** panel: today, this week, the last sign-in, and a simple bar row for the last 14 days.
- When signed in, the panel shows today and this week from the local tracker. The teacher app has the full history.

Commit: `Practice time in the progress report`

### Step 4: Teacher app

1. In `src/teacher/main.ts`, call `class_report` with `p_tz: Intl.DateTimeFormat().resolvedOptions().timeZone`.
2. In `src/teacher/report.ts`:
   - Add `ss` to `StudentReport`.
   - Add the three grid columns.
   - Add the "Practice time this week" card, highlighting students with no sign-in in 7 days.
   - In `openDetail`, add the 4-week daily-minutes bar chart (simple CSS bars, no chart library) and the recent sessions list.
   - Refresh with the dashboard's existing live updates.
3. In the CSV download, add Last signed in, Minutes today, and Minutes this week.

Commit: `Practice time on the dashboard`

### Step 5: Safety check

In `scripts/verify.mjs`, **add** checks without removing any:
- `studentBackend.ts` contains `session_start` and `session_ping`.
- `report.ts` contains `.ss`.
- Some migration contains `create table if not exists public.practice_sessions`.

Update the three instruction files, keeping them identical.

Commit: `Verify covers practice time`

## Acceptance checks

1. Signing in creates a session. Playing adds active minutes. Idle time and hidden tabs add nothing.
2. The teacher sees Last signed in, Today, and This week for every student, plus a 4-week chart and recent sessions in the detail view.
3. Students with no sign-in in 7 days are highlighted.
4. "Today" matches the teacher's local day.
5. Offline play keeps the seconds and sends them later. The database accepts at most 90 seconds per report, so long offline stretches are only partly counted.
6. Local mode shows practice time in the progress report.
7. `npm run verify`, `npm run typecheck`, and `npm run build` pass, with no red Console errors.

## Two devices

A student's town is one saved record, so two devices could save over each other. Pet World merges instead:

- **When a town opens** (`enterAs`), it loads the newer save. Then `mergeWork` and `mergeProgress` bring in what the other copy has:
  - **Work:** projects, Reading Log chapters, written answers, and flagged and looked-up words.
  - **Practice time:** every session from both copies (the last 30).
  - **Arcade minutes:** the larger amount for each day.
  - **Progress:** lessons, quizzes and tests, math skills and stations, Word Workshop answers, question tallies, and videos watched. For each one it keeps the side that has done more, and a pass on either device counts.
- **When a town left open comes back on screen,** or any screen refreshes the class settings, the game asks the server whether another device has saved since (`Backend.onRemoteSave`). If one has, it merges that save in before saving again, and shows "Brought in your work from your other device."
- **Not merged:** coins, tickets and stickers, so nothing can be spent twice.
- **Teacher reset:** a reset is never merged over. It's handled at the next sign-in, as before.

**Reading Log (Oct 27, 2026).** The Reading Log page counts without taps while it's open and visible, for up to 20 minutes after her last tap (`READ_IDLE_MIN`, through `ActivityTracker.watching`). See `READING-TIMER.md`.

**Plans show all her time.** The daily plan, extras and time goals show every minute she did ("32 of 20 min"), not a number stopped at the goal.

**Time inside each assignment (Oct 27, 2026).** Each math shop, library unit (English, History, Biology) and the Reading Log shows "⏱️ Today in History: 23 of 30 min · 12 min in this unit" at the top (`todayTimeHTML`), out of the plan's minutes when the plan has them. It updates every 20 seconds.
