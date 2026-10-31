# Daily plan (ROADMAP F10)

**Goal:** the student opens Pet World and sees exactly what to do today, each item linked to the place where it's done, checked off by what she actually does. Unfinished work carries over, and the day's plan goes into the Ledger.

## Owner decisions

- A **weekly plan** (a list for each weekday) plus **changes for single days**.
- Items: **time in a subject** (Pet World picks the next unit), **practice in a unit**, **a quiz or the unit test in a unit**, **a project**. Extras (F7) show in the same list. **📖 Reading Log** is a subject too (time in the Reading Log). Time goals (F8) were removed in October 2026 because they set the same minutes as the plan.
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
- **Carry-over:** "I'm done for today" saves the day's not-done items in the save (`S.planCarry`); the next days show them marked "(from before)" until a later "I'm done" replaces the list. An item that is already on the new day's plan isn't doubled. If she never tapped "I'm done" on her last school day, the next day works out what was left from that day (`ensureCarry`).
- **Carried minutes don't add up:** a carried 30 math minutes and today's 30 are both done after 30 minutes of math.

## 🎡 Class wheel days

With the class wheel on (`CLASS-WHEEL.md`), a school day's plan keeps only the core classes the wheel picked, plus an elective row for each elective (written up as outside work). Quizzes, tests, projects and rows from before stay.

## Finish from before first

- After the warm-up, carried time rows go to the top of the plan as **⏪ Finish first** and must be done before the rest of the plan. Until then, opening any other subject shows a card listing them (with Go buttons). Opening the same subject's units is allowed. Carried quizzes, unit tests and projects still show "(from before)" but don't hold up the day.
- Brain stretches and stand-and-stretch breaks run as usual.
- A grown-up can skip it for one day with the grown-up PIN (`S.carrySkipped`).

## Wrap-it-up reminders

- A banner at the top of the screen (not a pop-up, so it never interrupts a problem), each once a day (`S.nudges`):
  - **End of the school day** (3:00 PM unless a grown-up picks another time at the morning theme question; the last time picked is used again): finish what you're working on; then you **can** be done for the day, if that's what your teacher says. Not shown once her day is saved.
  - **30 minutes in a subject today** (math, English, reading, History, Biology, Word Workshop, Fact Sprint): finish what you're working on; then you **can** move on, if that's what your teacher says.
- It only reminds. Nothing is locked or ended.
- **Ledger:** the day's plan with each item's status goes into the Ledger day (`entry.plan`) and shows on the teacher's Ledger tab.

## Time goals were folded into the plan (October 2026)

- The teacher app no longer has a 🎯 Time goals card: a subject’s minutes are set only in the daily plan.
- A student who still has old goals keeps them on her plan (as plan rows).
- Her page shows a note with **Move them into the daily plan**. It adds them to Monday–Friday (a subject already on a day keeps the larger number of minutes) and clears the old goals.
- Word Workshop minutes belong in Extras.

## One list on the town page (plan and time goals together)

- A time goal for a subject that the plan already has time for doesn't get its own row: that plan row uses the larger of the two minutes.
- A time goal for a subject that isn't on the plan becomes a plan row ("📚 English: 30 min in the Mirror Library") with a **Go** button.
- Only a goal with no plan subject (the 📖 Reading Log) stays a goal row, also with a Go button.
- "Whole plan done" (theme days) uses this same list.

## Warm-up first

- The day's extras (Fact Sprint, Word Workshop) come right after the morning brain stretch (and the theme day, if there is one), before any subject. They're at the top of Today's plan with ☀️, and a **Warm-up time!** card opens by itself once a day.
- Until they're done, opening a subject (a shop, a library, a museum, the Nature Center or the Reading Log, from a tile or a Go button) shows the warm-up card instead.
- Class setting `game_settings.extrasFirst`: on unless a teacher turns it off (Quick setup and Settings → ☀️ Warm-up first).

### Timed rounds (Oct 27, 2026)

Every extra is a **timed round** (owner: "how many can you get in X minutes?"). In the teacher app → her page → extras, each extra has **⏱️ Timed round** (default 5 minutes for a Fact Sprint, 7 for Word Workshop) and **More practice later** (default 0).

- **The warm-up is one round** that stops by itself when the clock runs out; not finishing is fine. A Fact Sprint extra runs one long sprint; a Word Workshop extra is 10 minutes on the 🐾 Paw Path then 7 on the word game of the day (below), and on Friday the mastery check.
- **Bragging on progress:** the end screen shows her score, how it compares with last time ("📈 4 more than last time!"), her best, how far she's come since her first rounds, and a bar chart of her last 7 rounds (`S.challengeLog`; per minute when the round length changed). The start screen says "Last time: 19 · Your best: 23. Can you beat it?"
- **More practice later:** minutes beyond the round are a separate **➕ … more practice** row after her plan items. It doesn't block subjects, and it must be done before "I'm done for today" counts the extra as finished.
- An older extra with no round length keeps its minutes: a 5-minute (or 7-minute) round, then the rest as more practice.

### Word Workshop warm-up: 10 + 7 (Oct 30, 2026)

Owner: "I'm OK if we spend 10 minutes doing the phases (Meet, Match, Build, Use, Spell), then another 7 with the word game of the day."

- A Word Workshop extra is **two rows** on Today's plan and the Warm-up time! card: **⏱️ 10 min: 🐾 Paw Path** (her next lessons, back to back), then **⏱️ 7 min: the word game of the day**. Since Oct 30, 2026 five games take turns on Monday to Thursday (🔀 Word Scramble, 🔐 Secret Code, ✏️ Crossword, 🔎 Word Search, ✍️ Red Pen Desk), each week picking up where the last stopped (`docs/RED-PEN-DESK.md`, "The word game rotation"); the ✍️ Red Pen Desk's score is its ⭐ papers. Each row has its own Start, ✅ and score; the game row's Start turns berry once the path part is done.
- **The path part** continues lesson to lesson until the clock runs out. At 10 minutes she's never cut off mid-question: "⏰ Time's up! Finish this lesson to keep its XP." When that lesson is done, **Next: <game>, 7 min ▶** starts the game part.
- **Friday** is one row: the 🏁 mastery check (as before).
- **Lengths:** teacher app → her page → extras: 🐾 Paw Path (default 10) and 🎲 Word game (default 7), saved as `path` and `game` on the extra. An extra saved before Oct 30 has no `path`: it gets 10 + its old round length, and its minutes beyond the old round stay "more practice later".
- **Time** counts the same way as before (every minute in Word Workshop today counts for the extra); "more practice later" starts after the 17 minutes.
- The day log shows "⏱️ 5-minute challenge: …" with the score.

## ⭐ Start here, tests last

- Each day one subject on the plan (time in a subject or a unit's practice, still to do) is picked at random and goes first, marked **⭐ Start here**. It's picked once a day, so it doesn't change while she works.
- "Pass the quiz" and "pass the unit test" items go to the end of the list.
- Class setting `game_settings.planShuffle`: on unless a teacher turns it off (Quick setup, or Settings → ⭐ Order of the day).
- **Nothing planned yet** (local mode, or a class with no plan set; Oct 31, 2026): the card shows one row, **⭐ Start here: practice math in the <next math unit> [Go]**, so a first-day student has one obvious thing to do. The 🔬 Hands-on Biology row only shows for a home grade that has Biology (a 4th grader used to get the 6th grade lab).

## Fix first

Anything a teacher or a parent sends back goes at the top of Today's plan as **⭐ Fix first**, with the note and a **Fix it** button. That includes written answers sent back for a redo, projects and labs with a revision requested, Reading Log notes or reading-quiz essays to fix, and outside work with "Ask for a redo". The 🔁 banner at the top of the town still shows them too.

- **Every day until fixed:** it's on the plan each day until she fixes it and sends it again. Nothing has to be added to the plan by hand.
- **The plan isn't done while one is open:** no ✅ whole-plan day, so no theme day earned that day. The other plan rows lose their ⭐ Start here mark until the fixes are done.
- **"I'm done for today"** shows "🔁 Not done yet: one thing needs fixing" with Fix it buttons. She can still save her day to the record. Her time counts either way.
- **Once she sends it again:** the row turns into **✅ Fixed: …** for the rest of the day. The day log gets "🔁 Fixed and sent again: …", which also pops up as an alert in the teacher app.
- **In her daily record:** the Ledger's plan list shows open fixes as not done and fixed ones as done.

## After "I'm done for today"

Once she has saved her day to her record, opening Pet World again that day opens **📅 What I did today** first, with **➕ Add more to today** to go back to the town. The town's button reads "Today's record (saved) · save again", and the end-of-day reminder doesn't show again.
