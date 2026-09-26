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

### Step 1: Database

Add the migration file exactly as given. **The owner runs it in Supabase** after the quizzes file.

Commit: `Add practice time migration`

### Step 2: Tracking in the game (signed in)

In `src/lib/studentBackend.ts`, add a small tracker:
- **`startSession()`:** calls `sb.rpc('session_start', {p_device})`, where `p_device` is `'phone'` if `matchMedia('(pointer: coarse)')` and the screen width is under 700px, `'tablet'` if coarse, otherwise `'computer'`. It stores the returned id.
- **Activity:** listen for `pointerdown`, `keydown`, and `touchstart` on `document` (passive listeners), and record `lastInput = Date.now()`.
- **Every 15 seconds,** if the tab is visible and `Date.now() - lastInput < 60000`, add 15 to `pendingSeconds`.
- **Every 60 seconds,** and when the tab becomes hidden, if `pendingSeconds > 0`: call `session_ping(id, pendingSeconds)` and reset the counter. If it returns false (the session was closed), call `startSession()`, then report again. If the call fails (offline), keep the seconds and try next time.
- **When the student switches player or signs out,** send the last report and stop.

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
5. Offline play keeps the seconds and sends them later.
6. Local mode shows practice time in the progress report.
7. `npm run verify`, `npm run typecheck`, and `npm run build` pass, with no red Console errors.
