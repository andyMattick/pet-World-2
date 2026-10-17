# Daily plan (ROADMAP F10)

**Goal:** the student opens Pet Town and sees exactly what to do today, each item linked to the place where it's done, checked off by what she actually does. Unfinished work carries over, and the day's plan goes into the Ledger.

## Owner decisions

- A **weekly plan** (a list for each weekday) plus **changes for single days**.
- Items: **time in a subject** (Pet Town picks the next unit), **practice in a unit**, **a quiz or the unit test in a unit**, **a project**. Extras (F7) and time goals (F8) show in the same list.
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
