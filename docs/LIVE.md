# 🟢 Watching a student from the teacher app

## Right now (top of a student's page)

- Shows what she's on ("📚 Mirror Library · Reflexive pronouns", "☕ Pet Café · The Counter", "🧠 Brain stretch") and how long ago. 🟢 means she was active in the last 3 minutes; ⚪ shows when she was last seen and where.
- **Today so far** opens the same detail as a Ledger day: time by subject and lesson, and everything she did, by subject, with every score and percent.
- Reads her save every 20 seconds while her page is open (not while it's closed or the tab is in the background).
- The game writes `S.now = {t, what}` every 15 seconds of active time.

## Alerts

- While the teacher app is open (on a computer or a phone), it checks the class every 30 seconds and pops up a note in the corner when a student:
  - **finishes a plan row:** a subject's time, a unit's practice, quiz or test, an extra, or a time goal ("✅ Abi finished ➗ Math: 30 min in the Pet Café"), or
  - **passes a quiz or unit test** ("🏅 Abi passed: English Unit 3: Pronouns: Relative pronouns Quiz · 4 of 4").
- **🔕 Turn on notifications** (on the Right now card) also sends a browser notification for each, on that device. Phones may only show them when the teacher page is open, or added to the home screen.
- Only things that happen after the teacher app opened are announced.
- The game writes each finished plan row once a day as an event (`k:'done'`, "✅ Finished: …"); the Ledger shows it under its subject.
- Code: `src/teacher/live.ts`.
