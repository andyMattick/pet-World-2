# 🎉 Theme days

A fun theme for the school day, with something to wear and a small challenge, often tied to the lessons.

## Owner decisions

- **When she sees it:** right after the morning brain stretch (or the first time the town is on screen if brain stretches are off). It stays in 📋 Today's plan all day with a **See it** button.
- **Themes:** 18 in the rotation and 6 special days.

## How it works

- **Shared code:** `src/shared/themeDays.ts` (the themes, `themeSettings`, `themeFor`). The game and the teacher app both use it.
- **Class setting** `game_settings.themes = {enabled, when, special, themes}`: off until a teacher turns it on, and on for new classes. `when` is `every` (every school day, Monday to Friday) or `fri` (Fridays only). `special` turns the special days on or off together. Every rotating theme is in the cycle unless unchecked.
- **Which theme:** the next one in the rotation each school day (or each Friday), worked out from the date, so every device and every student in the class gets the same theme.
- **Rotation:** Pajama, Stuffed Animal, Book Character, Sports, Crazy Hat, Mismatch, Backwards, Rainbow, Detective, Chef, Camping, Superhero, Beach, Artist, Robot, Royal, Twin and Farm Day.
- **Special days** win on their dates: Pi Day (Mar 14), Earth Day (Apr 22), Space Day (May 4), Talk Like a Pirate Day (Sep 19), Costume Day (Oct 31), and the 100th Day of School. The 100th day counts weekdays from the start date of the school year on the student's Transcript tab; holidays aren't skipped, and there's no 100th day without a school year set.
- **Save:** `S.themeSeen` is the last day the announcement was closed. The Ledger gets "🎉 Theme day: …" as an event.
- **Order with other pop-ups:** the morning brain stretch first, then the theme, then any stand-and-stretch break.
