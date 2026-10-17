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
3. ✅ **Database (migration 8, `ledger.sql`).** `ledger_days` (student, class, day, the day's summary as JSON, sent at, edited by a grown-up; one row per student per day) and `ledger_outside` (student, class, day, course, title, minutes, grade, notes). Students send their own day through a `send_ledger_day()` function; teachers read and edit rows for their own classes (same pattern as `sprints`). (built: `20261017000000_ledger.sql`; "Send to my record" sends the day, labels written out, and a day a grown-up edited keeps the grown-up's version)
4. ✅ **Teacher app: the Ledger tab on a student's page.** A day-by-day list (Pet Town days plus outside work), each day editable; add outside work (date, course, assignment, minutes, grade). (built: `src/teacher/ledger.ts`, the 📅 Ledger tab: pick the dates; days not sent show the save's time by subject and can be saved to the record; editing a Pet Town day keeps the student's version, with a button to go back to it, and stops the student's next send from changing that day; outside work can be added, edited and deleted)
5. ✅ **Import the old Ledger files.** Read a Ledger backup `.json` (`{caleb:{name, entries, subjects}, abi:{...}}`), match each child to a student by name (or let the grown-up pick), and bring entries in as outside work. Keep what can be read, skip the rest, and show the count of each (and skip duplicates: same date, course and assignment). (built: “📥 Import an old Ledger backup” on the Ledger tab: pick the file, it matches the child by name or lets the grown-up pick, shows what will come in and what is skipped, and brings entries in as outside work marked imported; importing the same file again skips what is already in. Backup files stay out of the repo: `.gitignore` has `ledger-backup*.json`, because the repo is public)
6. ✅ **Courses and grades.** Pet Town courses (each subject at the student's grade, e.g. 6th grade Math, English, History, Biology) with a suggested grade from quizzes and unit tests (unit tests count more), hours from time by subject, and units finished; plus outside courses. The grown-up can override any grade and add courses. Saved with the student's settings. (built: `src/teacher/courses.ts`, the 🎓 Grades tab. Owner's weights: unit tests 50%, quizzes 40%, daily work 10% as a completion grade (100% once there is practice time in the subject); the weights can be changed on the tab, and a missing part shares its weight with the others. Each quiz and test counts its best score. Grades show as percent and letter (90/80/70/60). Outside courses come from the Ledger tab grouped by course name and suggest the average of their graded entries. Names, overrides, "on transcript" and added courses are saved in `quiz_overrides` as `courses`)
7. ✅ **Transcript (F11).** School years with grown-up-set dates; a printable page per year: each course with hours, units or assignments finished, and grade; outside courses; totals. (built: `src/teacher/transcript.ts`, the 📜 Transcript tab. School years (name, start and end dates that can't overlap, grade level) and the school name are saved in `quiz_overrides` as `transcript`. Each year adds up the Ledger and Pet Town work in its dates; grades start from the Grades tab and can be changed for one year, a course can be left off one year, and a year can have its own added courses. Courses added on the Grades tab belong to the year that holds today. Math scores count quizzes and tests in the year's dates; English, History and Biology progress has no dates, so it counts all of it. Prints one year or the full transcript (every year plus totals) in a plain print window with a signature line)
8. **Daily plan (F10)** builds on steps 1 and 2: the plan's checkmarks and the "finished" summary are this day log.

## Notes

- The record starts the day step 1 goes live; earlier days can be filled in from time by subject and quiz history, without per-lesson detail.
- Saves stay small: the day log keeps 14 days; the full record lives in `ledger_days` from step 3.
