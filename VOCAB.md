# Word Workshop (vocabulary)

The 🔤 **Word Workshop** sits on the town's service row, next to the Sprint Track. It does for vocabulary what the Sprint Track and times-tables chart do for multiplication.

## What students do

- **🃏 Practice cards:** 8 untimed cards that rotate through three kinds: what does this word mean, which word fits the sentence, and spell the word from its meaning. A missed word comes back once more at the end, and weaker words are picked more often.
- **⚡ Word sprint:** read a meaning and tap the word, as many as you can in 60 seconds. Every 2 right answers earn 🪙 1, and the sprint keeps a personal best.
- **🔤 Spell it:** the word is read aloud (🔊 Hear the word) and its meaning is shown; the student types it. Case and a final period don't matter.
- **📊 My words:** a chart of the focus words, grouped by set. Each word is shown as **Not seen yet**, **Needs practice**, **Getting there**, or **Solid** (the last 3 answers right), with the same colors as the times-tables chart. Tapping a word shows its meaning and sentence.

Every 4 answers earn one arcade minute, the same as English practice.

## Where the words come from

1. **Pet Town's list:** 100 grade 4–6 academic words in 10 sets (thinking words, describing words, character traits, math and science words, history words, and more). The definitions and sentences are written for Pet Town and reviewed under `CONTENT-RULES.md`. Published programs' lists, such as Wordly Wise 3000, are copyrighted, so they aren't built in. A teacher or parent can type in their own lesson's words instead.
2. **The class's list:** the teacher uses the **Vocabulary** tab in the teacher app. It's saved in `classes.game_settings.vocab` as `{builtIn, words, focus}`, which students already receive, so there's no migration.
3. **The family's list:** at home, Word Workshop → "For grown-ups: word list", behind the grown-up PIN. It's saved in the student's save as `vocab.home`.

**Adding words:** paste one per line as `word - meaning`, or `word - meaning - sentence with ___`. You can also paste two or three columns from a spreadsheet, or a JSON list. Lines that can't be read are skipped and listed.

**Focus words:** every word is in focus by default. The teacher can pick the class's focus words, and a parent's choice wins on that student's device. **Turning off Pet Town's list** (either place) leaves only the added words.

## What grown-ups see

- **Teacher:** Vocabulary tab → "Class progress on focus words" shows each student's counts and the words to reteach.
- **Parent:** the progress report has a 🔤 Vocabulary line with the counts and a link to the chart.

## Files

- `src/shared/vocab.js`: the word list, the import parser, `vocabList()` (which merges and filters the lists), and word mastery.
- `src/game/game.js`: the Word Workshop screen (search for "Word Workshop").
- `src/teacher/vocab.ts`: the Vocabulary tab.
