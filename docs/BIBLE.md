# ✝️ Bible

A Bible spot in the student's town, first thing every day: a devotion journal, the books of the Bible, and her memory verse. It's off unless a grown-up turns it on for that student.

## Turning it on and adding verses

Teacher app → class → the student's page → **✝️ Bible** tab:
- **Bible first thing every day** turns it on for this student.
- **Memory verses**: her list, in the order she learns them, each marked ⭐ learned, ▶️ learning now (with the blanks step and her last-5 average) or ⏳ up next. **Add a verse** puts one at the end (reference, translation, verse; any translation, since you type it). **Edit** changes or removes one, and ↑ moves one up the list.
- Below that: her books-game level and recent rounds, and her **devotion journal** (newest first).

Saved in `quiz_overrides` as `bible` (JSON `{on, verses:[{id, ref, version, text}]}`). Verses saved by the first version (with a `week`) still work, in week order. Code: `src/teacher/bible.ts`, shared pieces in `src/shared/bible.ts`.

## First thing each day

When it's on and Bible isn't done today:
- Right after sign-in, the **"Bible comes first"** card shows, before the morning brain stretch, the theme question and the warm-up (`bibleCheck`; `brainCheck`, `themeCheck` and `moveCheck` wait while `bibleFirst()` is true).
- Opening anything else (a subject, the Fact Sprint, Word Workshop, the Arcade, Art Studio) shows the card instead. The Bible spot, Town Hall, the Sticker Book and the Pet Room stay open.
- **Done for the day** = in order: a **journal entry**, then **one round of the books game**, then **5 tries at the memory verse**. The books game waits for the journal and the verse waits for the books round. With no verse to learn (none added yet, or every verse learned), the journal and the books round are enough. The first time it's done each day: 5 coins and "✅ Bible done for today" in the day log.
- **Grown-up: skip Bible today** (on the card) takes the grown-up PIN and logs "🔐 Grown-up OK: Bible skipped today". There's no other skip.
- Today's plan starts with a **✝️ Bible first** row, and the town has a ✝️ Bible tile.

Time in the Bible spot counts as its own subject (`bible` in `src/shared/subjectTime.ts`), with its own group in the Ledger.

## 📝 Devotion journal

The devotion itself happens outside the app. She writes what she read (the passage or topic), **what she learned** (at least a sentence), and her thoughts or a prayer (optional). She can change today's entry all day. Earlier entries are listed below it. The teacher reads them on the ✝️ Bible tab. Not graded.

## 📚 Books of the Bible

Five levels, each opening after the one before:

| Level | What she does | Moves up when |
|---|---|---|
| 1. Old or New? | Drag 8 books (or tap a book, then a box) into Old Testament or New Testament | 2 perfect rounds in a row |
| 2. Which section? | Drag 8 books from one testament into its sections: the Law, History, Poetry and Wisdom, Major Prophets, Minor Prophets / the Gospels, History, Letters of Paul, General Letters, Prophecy | 2 perfect rounds in a row |
| 3. Name them all | Type every book in a section. Like the 48 prepositions game: a name fills in as soon as it's right | every section (the 8 with 4 or more books) once, with no hints |
| 4. In order | Tap a section's books in Bible order | every section once, with no wrong taps |
| 5. Neighbors | Given a book, type the 2 books before it and the 2 after it (5 books a round) | 2 perfect rounds in a row = ⭐ mastered (she can keep playing) |

Typing accepts `1 Kings`, `1st Kings`, `First Kings`, `I Kings` and `1kings` (the same for 2 and 3), `Psalm` for Psalms, `Song of Songs` for Song of Solomon, `Revelations`, and `Acts of the Apostles`. Spelling has to be right. Enter on a wrong name says why ("isn't a book of the Bible", "is in the Minor Prophets", "isn't right next to …"). A name that could still be the start of a longer one (`Psalm` → `Psalms`) waits a moment before filling in. **Show me one** fills in the next book and makes the round not perfect.

On a sorting level, a second wrong drop for the same book shows where it goes.

## 💬 Memory verse

She learns one verse at a time: the first one on her list she hasn't learned. It's practiced in the Verse Memorizer (`public/bible/verse-memorizer/`, opened with `?pw=1`): she fills in the blanks, then presses **Check**, 5 tries a day (each try picks new blanks).

| Step | Practice |
|---|---|
| 1 | 10% of the words blank |
| 2 | 20% |
| 3 | 35% |
| 4 | 50% |
| 5 | 70% |
| 6 | write the whole verse from memory |

- **Moving up:** when her day's 5 tries are done and her **last 5 tries at that step average 90% or better**, the next day starts a step higher. Under 90%, she stays on the same step the next day.
- **Learned:** at the whole-verse step, a 90% average over her last 5 tries means she's learned it. The next verse on her list starts the next day, and the learned verse moves to **⭐ Verses you know**.
- **No deadline:** a verse carries into the next week (and the next) until she learns it.
- **Alerts for the grown-up** (pop-ups in the teacher app, and a browser notification when 🔔 is on): when she moves up a step, and when she learns a verse, with the next verse's name or "She needs a new verse". The dashboard's **Waiting for a grown-up** card shows "✝️ needs a new memory verse" until you add one.

The verse is open to read until her first try, and after that behind **📖 Read the verse (peek)** after that. Every try is kept (`S.bible.vp[verseId].tries`: day, step, percent right; the last 60).

Opened on its own (no `?pw=1`), the Verse Memorizer works exactly as before.

## Saving

`S.bible` in the student's save: `journal` (one entry a day), `books` (level, streaks, sections done, the last 60 rounds), `vp` (each memory verse: step, a move up earned for tomorrow, tries, the day it was learned), `skipped`, `shown`, `coinDay`. Two devices merge: the newer journal edit wins each day, the books game keeps the higher level and every round, and each memory verse keeps every try from both, the higher step, and learned if either learned it (`mergeBible`).

## Code

- `src/shared/bible.ts`: the 66 books and their sections, the levels, typed-name matching, the memory-verse list, steps and progress rules.
- `src/game/game.js`: search for "✝️ Bible" (`bibleFirst`, `openBible`, `startBooks`, `finishBooks`, the verse messages).
- `public/bible/verse-memorizer/index.html`: the Verse Memorizer with the Pet World hookup (search for "Pet World").
- `src/teacher/bible.ts`, and the ✝️ Bible tab in `src/teacher/report.ts`.
