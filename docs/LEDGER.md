# The Ledger in Pet Town (F9, feeding F10 and F11)

**Goal:** Pet Town keeps the record that the separate Ledger app used to keep by hand. When a student says she's done for the day, she sees exactly what she did (which lessons, how long, scores, minutes per subject) and it goes into her record. Grown-ups see each course's grade, add outside work, import the old Ledger files, and print a transcript for a school year.

**How we work:** one step at a time, each reviewed and tested in a browser before the next; every commit runs `npm run verify`, `npm run typecheck` and `npm run build`. Old migrations are never edited.

## Owner decisions

- Grades: the app suggests each Pet Town course's grade from its quizzes and unit tests, and the grown-up can **override** it and **add** courses of their own (with their own grades).
- School years: the grown-up **sets the start and end dates** of each year on the transcript.
- "I'm done for today": the day is **saved right away**; a grown-up can edit it later in the teacher app.
- Outside work (books, other subjects) can be added by a grown-up, and the old Ledger backup files can be imported.

## What exists already

- Time by subject per day (`S.subjectTime`, active time only), sessions, quiz and test history (`assessments`), skill progress, written answers, projects, Reading Log, Fact Sprints (`sprints`), every answer (`attempts`).
- Missing: time **per lesson**, a **day-by-day list** of what was done, outside work, grades per course, a transcript.

## Steps

1. ✅ **Day log in the game (no database change).** As she works, the save keeps `S.dayLog[day]`: seconds per lesson (each 15-second active-time credit also goes to the lesson on screen, e.g. `cafe:2` or `histOrigins`), and events with scores: math orders per station (right / done), station quizzes and unit tests, Fact Sprints, Word Workshop runs, English/History/Science practice and tests, projects and written answers sent, Reading Log chapters and reading quizzes, extras and time goals met. Last 14 days kept in the save.
2. ✅ **"I'm done for today."** A button on the town page opens a summary of the day: minutes per subject, minutes per lesson, every event with its score, extras and goals. "Send to my record" saves it (step 3); until step 3 is in, it stays in the save (built: the summary and "Send to my record" mark the day as sent in the save).
3. **Database (migration 8, `ledger.sql`).** `ledger_days` (student, class, day, the day's summary as JSON, sent at, edited by a grown-up; one row per student per day) and `ledger_outside` (student, class, day, course, title, minutes, grade, notes). Students send their own day through a `send_ledger_day()` function; teachers read and edit rows for their own classes (same pattern as `sprints`).
4. **Teacher app: the Ledger tab on a student's page.** A day-by-day list (Pet Town days plus outside work), each day editable; add outside work (date, course, assignment, minutes, grade).
5. **Import the old Ledger files.** Read a Ledger backup `.json` (`{caleb:{name, entries, subjects}, abi:{...}}`), match each child to a student by name (or let the grown-up pick), and bring entries in as outside work. Keep what can be read, skip the rest, and show the count of each (and skip duplicates: same date, course and assignment).
6. **Courses and grades.** Pet Town courses (each subject at the student's grade, e.g. 6th grade Math, English, History, Biology) with a suggested grade from quizzes and unit tests (unit tests count more), hours from time by subject, and units finished; plus outside courses. The grown-up can override any grade and add courses. Saved with the student's settings.
7. **Transcript (F11).** School years with grown-up-set dates; a printable page per year: each course with hours, units or assignments finished, and grade; outside courses; totals.
8. **Daily plan (F10)** builds on steps 1 and 2: the plan's checkmarks and the "finished" summary are this day log.

## Notes

- The record starts the day step 1 goes live; earlier days can be filled in from time by subject and quiz history, without per-lesson detail.
- Saves stay small: the day log keeps 14 days; the full record lives in `ledger_days` from step 3.
