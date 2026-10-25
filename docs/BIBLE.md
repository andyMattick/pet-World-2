# ✝️ Bible

A Bible spot in the student's town, first thing every day: a devotion journal, the books of the Bible, and the verse of the week. It's off unless a grown-up turns it on for that student.

## Turning it on and setting the verse

Teacher app → class → the student's page → **✝️ Bible** tab:
- **Bible first thing every day** turns it on for this student.
- **Verse of the week**: pick the week (this week or the next three), type the reference, the translation and the verse, and **Save verse**. Any translation works, since you type it. The form shows how many blanks each day gets.
- Below that: her verse practice for the last two weeks, her books-game level and recent rounds, and her **devotion journal** (newest first).

Saved in `quiz_overrides` as `bible` (JSON `{on, verses:[{week, ref, version, text}]}`, where `week` is that week's Monday). Code: `src/teacher/bible.ts`, shared pieces in `src/shared/bible.ts`.

## First thing each day

When it's on and Bible isn't done today:
- Right after sign-in, the **"Bible comes first"** card shows, before the morning brain stretch, the theme question and the warm-up (`bibleCheck`; `brainCheck`, `themeCheck` and `moveCheck` wait while `bibleFirst()` is true).
- Opening anything else (a subject, the Fact Sprint, Word Workshop, the Arcade, Art Studio) shows the card instead. The Bible spot, Town Hall, the Sticker Book and the Pet Room stay open.
- **Done for the day** = a journal entry **plus** the verse practice **or** a round of the books game. If no verse is set for this week, the books round is the second part. The first time it's done each day: 5 coins and "✅ Bible done for today" in the day log.
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

## 💬 Verse of the week

The verse for this week (Monday to Sunday) is practiced in the Verse Memorizer (`public/bible/verse-memorizer/`, opened with `?pw=1`):

| Day | Practice |
|---|---|
| Monday | a fifth of the words blank |
| Tuesday | about a third |
| Wednesday | half |
| Thursday | about 70% |
| Friday to Sunday | write the whole verse from memory |

The verse shows open on Monday and behind **📖 Read the verse (peek)** the rest of the week. A practice counts for the day when at most a tenth of it is wrong, or after 3 tries. Every try is kept (`S.bible.verse[day]`: tries, best, done).

Opened on its own (no `?pw=1`), the Verse Memorizer works exactly as before.

## Saving

`S.bible` in the student's save: `journal` (one entry a day), `books` (level, streaks, sections done, the last 60 rounds), `verse` (each day's practice), `skipped`, `shown`, `coinDay`. Two devices merge: the newer journal edit wins each day, the books game keeps the higher level and every round, and each verse day keeps the side that finished or tried more (`mergeBible`).

## Code

- `src/shared/bible.ts`: the 66 books and their sections, the levels, typed-name matching, the verse settings and the blanks schedule.
- `src/game/game.js`: search for "✝️ Bible" (`bibleFirst`, `openBible`, `startBooks`, `finishBooks`, the verse messages).
- `public/bible/verse-memorizer/index.html`: the Verse Memorizer with the Pet World hookup (search for "Pet World").
- `src/teacher/bible.ts`, and the ✝️ Bible tab in `src/teacher/report.ts`.
