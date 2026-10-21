# 👀 Look only

Lets a teacher (or parent) see a student's town exactly as she sees it, without signing in as her. Signing in as a student on your own browser is what let an old copy of Abigail's town, with the demo class's work mixed in, come back on Oct 21 (`docs/CLEARING-PROGRESS.md`).

## How to use it

Teacher app → class → roster → **👀 Look** next to a student. It opens Pet World in a new tab with a blue bar at the bottom: "Look only: …'s town, as she sees it. Nothing you do here is saved." **Refresh** pulls her newest save; it also refreshes by itself every minute.

The teacher app has to be signed in on the same browser (same site). If it isn't, the tab says so.

## What it never does

- Never saves: not to the server (`Backend.lookOnly` blocks saves, logs, practice time, the Ledger, outside work and paintings) and not to this browser's storage (`save()` returns at once).
- Never merges: it shows her server save as is. A newer save from her replaces the view; nothing is mixed in.
- Never uses or changes the student sign-in on this browser. It uses the teacher's own sign-in (`pt-teacher`).
- No pop-ups: no brain stretch, theme question, warm-up, finish-first card, stand-and-stretch or reminders.

You can click around and even answer questions to see what she sees; none of it is kept, and closing the tab throws it away.

## Pieces

- Migration `20261021000000_look_only.sql`: `teacher_view_student(p_student)`, the same fields as `my_student()`, only for a student in one of the signed-in teacher's classes.
- `src/lib/studentBackend.ts`: `look(studentId)`, `lookOnly`.
- `src/game/game.js`: `LOOK_ID` (from `?look=`), `enterLook()`.
- `src/teacher/main.ts`: the 👀 Look button on the roster.
