# 🧭 Tour guide

A short, friendly walk-through the first time each kind of person arrives. Not AI: fixed steps in plain words.
The page dims, one real thing on it gets a yellow ring, and a small bubble says one or two sentences, with
**Back / Next / Skip tour** and step dots. It works at iPhone SE size and on a desktop, Esc closes it, the arrow keys
step through it, focus moves to the bubble (and stays in it), and it doesn't animate when the device asks for reduced motion.

## Who sees which tour

| Tour | When it runs by itself | Steps |
|---|---|---|
| Town (`town`) | A student's first time in her town | Today's plan → her classes (6th grade: the four classes; 4th grade: Math, Lemonade Stand first) → Words of the Week → helper pet → coins → Arcade → the 🐾 helper |
| Arcade (`games`) | First "I'm just here for the games" visit on this browser | Pick a game → games only (no coins, nothing saved) → Exit games |
| Progress report (`parent`) | First time a grown-up opens the progress report (Town Hall → progress report, `renderParent`) | Ideas or arithmetic? → Practice time → Progress by subject and unit → "Still there?" → Back to town |
| Teacher (`teacher`) | A teacher or parent account's first look at the class dashboard | Dashboard → each student's page → Waiting for a grown-up → Roster and PIN cards → Settings and 🧭 Quick setup → class code → the ❓ helper |
| Getting started (`teacherStart`) | A teacher account with no class yet | Welcome → name your class → Add class (opens Quick setup) → then add students on the Roster → the ❓ helper |

At most 7 steps each. A step whose element isn't on screen (a folded section, a locked or teacher-hidden thing,
the Arcade turned off) is left out by itself, so the tour never breaks when the page changes.

## Rules it keeps

- **It only points.** The overlay takes every tap, so nothing can be opened through it. It never passes, replaces or
  waits in front of a gate (grown-up PIN, today's video, locks, Bible first): those come exactly as before.
- **It comes before the daily pop-ups on her very first day.** `bibleCheck`, `brainCheck`, `moveCheck` and `themeCheck`
  in `src/game/game.js` start with `if (tourHold()) return;`, and when the tour ends they run again, so the Bible-first
  card, brain stretch, theme question and warm-up come right after it. On later days the tour never shows.
- **It's skippable.** Skip tour or Esc counts as seen (it isn't a gate). Replay any time.
- **Look only never shows it and never saves it** (`docs/LOOK-ONLY.md`); the helper hides its tour button there.

## Remembered

- Student: in her save, `S.tour = { town: { v, seen: [step ids], at } , parent: … }`. `normTours` cleans it on load and
  `mergeWork` merges two devices with `mergeTours` (seen on either device counts; newest version; it never touches
  progress and isn't counted as new work).
- Games guests: this browser's localStorage (`petworld-tour-games`).
- Teacher or parent account: localStorage `petworld-tour:<user id>`, so each account on a shared computer gets its own.
- **New version:** raise a tour's `version` and add steps with new ids; people who saw the old version see only the new
  steps (`pendingSteps`). Keep step ids stable.

## Replay

- The helper: the **🧭 Take the tour** chip, or ask "tour", "show me around", "how does this work", "I'm new here".
- Teacher app: **🧭 Tour** in the header (it switches to the Dashboard first).
- Student app: **🧭 Tour** on the progress report and on the games-only Arcade (the helper is hidden there).

## Spanish

Every step's title and text, and the bubble's buttons, are keys in `tourTranslations` in `src/shared/language.ts`.
The apps' `installLanguage` translates the bubble like the rest of the page. Add the Spanish when you add a step.

## Files

- `src/shared/tour.ts` — the engine (`runTour`), the step lists (`TOURS`), and `normTours` / `mergeTours` / `pendingSteps` / `markSeen`.
- `src/game/tour.js` — the student app's hooks: `tourOnShow` (called in `show()`), `tourHold`, `replayTour`, the 🧭 links.
- `src/teacher/tour.ts` — the teacher app's hooks: first-time check, header button, `replayTeacherTour`.
- `scripts/check-tour.mjs` (run by `npm run verify`) — every selector exists in the apps' source, ≤7 steps per tour
  and grade, Spanish for every step, 4th and 6th grade differ, and the remember/merge rules.

## Changing a step

Point `sel` at something the page really draws (an id, a class, a `data-` attribute). For a card without one, add
`has: '<heading text>'` (it matches the English or the Spanish heading). Keep it to one or two short sentences, add the
Spanish, and run `node scripts/check-tour.mjs`.
