# Daily plan (ROADMAP F10)

**Goal:** the student opens Pet World and sees exactly what to do today, each item linked to the place where it's done, checked off by what she actually does. Unfinished work carries over, and the day's plan goes into the Ledger.

## Owner decisions

- A **weekly plan** (a list for each weekday) plus **changes for single days**.
- Items: **time in a subject** (Pet World picks the next unit), **practice in a unit**, **a quiz or the unit test in a unit**, **a project**. Extras (F7) and time goals (F8) show in the same list.
- When she taps "I'm done for today", the summary shows each item as done, waiting or not done, and **not-done items move to the next day**.

## How it works

- **Teacher app** (student page, 🗓️ Daily plan): pick a weekday (Mon to Sun) or one date. Add, remove and reorder items; "Copy to Monday–Friday" fills the school week. A date with its own list replaces its weekday's list for that day only; "Use the weekly plan again" removes it. Past dates drop off when the plan is saved. Saved in `quiz_overrides` as `plan`: `{week:{mon:[item]}, days:{"YYYY-MM-DD":[item]}}`.
- **Items:** `{id, kind:'subject', subject, minutes}`, `{id, kind:'unit', unit, what:'practice'|'quiz'|'test', minutes}`, `{id, kind:'project', project}`.
- **Town page:** "📋 Today's plan" replaces the separate extras and time-goal cards and lists plan items, then extras, then time goals. Each plan item shows ✅ / ⏳ / ⬜ and, while to do, a **Go** button that opens its unit.
- **When an item is done:**
  - time in a subject: that many active minutes in the subject today (the same time the reports count); "next unit" is the first open unit in the subject whose unit test isn't passed yet.
  - practice in a unit: that many minutes in the unit today (the day log's time per lesson).
  - a quiz: a quiz in the unit passed today. The unit test: passed today or already passed.
  - a project: ✅ once a grown-up verifies it, ⏳ while it is sent and waiting, ⬜ otherwise (also when a revision was asked for).
- **Carry-over:** "I'm done for today" saves the day's not-done items in the save (`S.planCarry`); the next days show them marked "(from before)" until a later "I'm done" replaces the list. An item that is already on the new day's plan isn't doubled.
- **Ledger:** the day's plan with each item's status goes into the Ledger day (`entry.plan`) and shows on the teacher's Ledger tab.

## One list on the town page (plan and time goals together)

- A time goal for a subject that the plan already has time for doesn't get its own row: that plan row uses the larger of the two minutes.
- A time goal for a subject that isn't on the plan becomes a plan row ("📚 English: 30 min in the Mirror Library") with a **Go** button.
- Only a goal with no plan subject (the 📖 Reading Log) stays a goal row, also with a Go button.
- "Whole plan done" (theme days) uses this same list.

## Warm-up first

- The day's extras (Fact Sprint, Word Workshop) come right after the morning brain stretch (and the theme day, if there is one), before any subject. They're at the top of Today's plan with ☀️, and a **Warm-up time!** card opens by itself once a day.
- Until they're done, opening a subject (a shop, a library, a museum, the Nature Center or the Reading Log, from a tile or a Go button) shows the warm-up card instead.
- Class setting `game_settings.extrasFirst`: on unless a teacher turns it off (Quick setup and Settings → ☀️ Warm-up first).
