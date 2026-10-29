# 🎉 Theme days

A fun theme for the school day, with something to wear and a small challenge, often tied to the lessons.

## Owner decisions

- **Earned (the default):** every school morning, right after the brain stretch and before the ☀️ warm-up (Fact Sprint and Word Workshop), a card asks a grown-up: make today a theme day? Finishing the plan the day before is no longer required. The card first lists what she didn't get to on her last school day (the rows carried to today, plus anything sent back to fix), or says she finished the whole plan. The grown-up answers with the grown-up PIN (the same PIN as the progress report; the first answer makes one if there isn't one yet).
  - **Yes:** today is a theme day. The next theme in the rotation is announced right away.
  - **Not this time:** no theme today. The question comes back tomorrow morning.
  - **Ask me later:** the card comes back in 20 minutes.
- **When she sees it:** right after the grown-up says yes (or, for a special day or the every-day and Friday options, right after the morning brain stretch). It stays in 📋 Today's plan all day with a **See it** button.
- **Themes:** 18 in the rotation and 6 special days.
- **A quick way or a longer way (owner, Oct 27, 2026):** each theme has a ⚡ quick way (wear it: "Wear the silliest hat in the house") and a 🛠️ longer way (make it: "Make a crazy hat from paper"). She picks one on the theme card before going on; her pick shows on the plan row and in the day log. The longer ways are in `make` in `src/shared/themeDays.ts`.
- **Order:** the theme card now comes right after ✝️ Bible (there's no morning brain stretch any more).

## How it works

- **The reveal (Oct 29, 2026):** the first time today's theme shows, a fun show (darts, cups, a claw machine… a different one from the class show that day) lands on today's theme among 3 others. Then the theme card shows an animated scene for that theme starring her pet (`src/game/reveals/themeScenes.js`, one per theme). The theme itself is picked exactly as before; the show doesn't change it. See docs/CLASS-WHEEL.md, "How she sees it".


- **Shared code:** `src/shared/themeDays.ts` (the themes, `themeSettings`, `themeFor`). The game and the teacher app both use it.
- **Class setting** `game_settings.themes = {enabled, when, special, themes}`: off until a teacher turns it on, and on for new classes. `when` is `earned` (the default), `every` (every school day, Monday to Friday) or `fri` (Fridays only). `special` turns the special days on or off together. Every rotating theme is in the cycle unless unchecked.
- **Which theme:** earned theme days go through the rotation in order, one step each time she earns one (`S.themeTurn`). With every day or Fridays, the date picks it, so everyone in the class gets the same theme.
- **Special days** are free: they show on their date without the grown-up question.
- **Rotation:** Pajama, Stuffed Animal, Book Character, Sports, Crazy Hat, Mismatch, Backwards, Rainbow, Detective, Chef, Camping, Superhero, Beach, Artist, Robot, Royal, Twin and Farm Day.
- **Special days** win on their dates: Pi Day (Mar 14), Earth Day (Apr 22), Space Day (May 4), Talk Like a Pirate Day (Sep 19), Costume Day (Oct 31), and the 100th Day of School. The 100th day counts weekdays from the start date of the school year on the student's Transcript tab; holidays aren't skipped, and there's no 100th day without a school year set.
- **Save:** `S.planDone` (days the whole plan was done, last 14), `S.themeAsk` (today's answer and the theme it earned), `S.themeTurn`, and `S.themeSeen` (the last day the announcement was closed). The Ledger gets "🎉 Theme day: …" as an event.
- **Order with other pop-ups:** the morning brain stretch first, then the grown-up question and the theme, then any stand-and-stretch break.
