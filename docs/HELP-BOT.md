# 🤖 Help bot

A small helper in the bottom-right corner of both apps (🐾 in Pet World, ❓ in the teacher app). Tap it, type a question (or tap a suggestion), and it answers in a short message with a **Take me there** button. It is **not AI**: no internet, no API calls, nothing sent anywhere. It matches the question against an index built from the apps' own lists, so it stays up to date by itself.

## What it knows

| App | Built from |
|---|---|
| Pet World | `BUILDINGS` (every unit, with its grade and subject), `SHOPS` (stations), `SKILLS` (each skill → its shop), `NEIGHBORHOODS`, `SUBJECTS`, `ARCADE_GAMES`, `BRAIN_GAMES`, the town spots (`STUDENT_SPOTS`: Bible, Sprint Track, Word Workshop, Reading Log, Art Studio, My Pet Room, Pet Shop & Sticker Book, Town Hall, Arcade, Science Lab, prepositions test), and short how-it-works answers (`STUDENT_FAQ`: tests, quizzes, locks, coins, tickets, read-aloud, music, today's video, brain stretches, breaks, the plan, ✋ questions, Español) |
| Teacher app | the tabs (`TEACHER_TABS`), every Settings control (`TEACHER_SETTINGS`), one entry per Arcade game, brain game, move and theme day, the shared settings list (`src/teacher/settingsList.ts`, `TEACHER_SETTINGS`) when it's in the build, and how-to answers (`TEACHER_FAQ`: add students, reset a PIN, 👀 Look, reset progress, open a unit, grades, the test PIN rule, the teacher lock, class code, messages) |

The index is built the first time the panel opens (nothing at page load).

## How it matches (as far as a non-AI bot goes)

- **Normalize:** lowercase, accents and punctuation removed.
- **Phrases and synonyms:** "reset password" → reset PIN, "times tables" → Sprint Track, "games" → Arcade, "kids" → student, "disable / stop / hide / no more" → off, plus some Spanish ("¿dónde están los juegos?").
- **Stemming:** fractions/fraction, dividing/divide.
- **Typos:** edit distance with swapped letters counted once ("bakkery", "brian stretches", "potoin lab").
- **Weights:** rare words count more than common ones ("pet"), whole names in the question count extra.
- **Intent:** "where is / take me", "how do I", "what is / why", "turn on", "turn off", "what should I do next".
- **Context:** the student's grade ("fractions" → Bakery in 6th grade, Pizza Parlor in 4th), what's locked and why, what the teacher closed, and what's next on Today's plan.
- **Confidence:** a sure answer, a "Did you mean…" list, or "I'm not sure" with the closest known word.

## Gates stay (owner rules)

"Take me there" only goes through the app's own doors:

- Student: the town tiles' click handlers (`openTownSpot`), `show()`, and the class and grade pages. The Bible-first card, warm-up, finish-first card, grown-up PIN, today's video, help blocks and every lock still apply.
- A **locked unit** is never opened. The bot says which unit test opens it, then shows its class page with the locked tile highlighted. A unit that isn't built says "coming soon".
- A closed **Arcade**, Bible that's turned off, or a Science Lab with no open Biology unit is explained, not opened. Arcade games the teacher closed are left out. An open game's card is highlighted, never started. Coins and admission stay in the Arcade's own buttons.
- Teacher: tabs switch through `renderMain()`. A setting is scrolled to, highlighted and focused, but **never changed**.
- **Look only:** the bot saves nothing (it uses no storage at all), and it sits above the blue bar.
- **Hidden** during quizzes, tests, test reviews, brain stretches, stand-and-stretch breaks, Arcade play, pop-up cards and dialogs, sign-in screens, and games-only mode. In the teacher app it's hidden on the lock and sign-in screens, behind the student detail sheet, and when printing.

## Files

- `src/shared/helpBot.ts`: the matcher and the knowledge lists. It has no imports, so scripts can run it.
- `src/game/helpBot.js`: the student panel. `game.js` has one import and one `initHelpBot({...})` block at the end, which passes the data, a `state()` reader and the four ways to go somewhere.
- `src/teacher/helpBot.ts`: the teacher panel. `main.ts` has one import and one `initTeacherHelpBot({...})` block at the end.
- `scripts/check-help-bot.mjs`: 62 sample questions with the expected answers, and a coverage check. Run `npx tsx scripts/check-help-bot.mjs`. To test against another copy of the shared settings list, use `SETTINGS_LIST=<path>`.
- `scripts/verify.mjs`: fails if a town spot in `renderHome`, a Settings control or list in `renderSettings`, or a teacher tab is missing from the bot, or if the bot stops reading the registry lists.

## Adding things

- A new **building, shop, skill or Arcade game** shows up by itself.
- A new **town spot** (a `data-open="…"` tile in `renderHome`): add it to `STUDENT_SPOTS`. `npm run verify` reminds you.
- A new **Settings control**: add it to the shared settings list (`settingsIds`) or to `TEACHER_SETTINGS` in `src/shared/helpBot.ts`. `npm run verify` reminds you.
- People ask it something it misses: add the words to that entry's `keys`, and add the question to `scripts/check-help-bot.mjs`.

## Language

With Español on, the bot's buttons, suggestions and greeting are in Spanish, and it understands common Spanish question words. Answer text goes through the app's normal `translateText`, so most answers stay in English for now.
