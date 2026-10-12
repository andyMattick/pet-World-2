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

**Sets:** a heading line like `Set: Wordly Wise Lesson 4` (or `# Wordly Wise Lesson 4`) puts every word below it in that set, until the next heading. Use an existing name such as `Set: Set 3` to add words to one of Pet Town's sets. Words before any heading go in **My words**. In a JSON list, give each word a `"set"`. To add the word "set" itself, write it with a dash (`set - a group of things that go together`), because `set:` starts a heading.

**Changing a built-in word:** add the same word with your own meaning (and `Set:` heading if you want it to stay in its set). The added version replaces Pet Town's for that class or student. To skip a word, untick it in the focus words.

**Focus words:** every word is in focus by default. The teacher can pick the class's focus words, and a parent's choice wins on that student's device. **Turning off Pet Town's list** (either place) leaves only the added words.

## 📌 Flag a word while reading

Anywhere in Pet Town (questions, stories, reading notes, math problems), the student can highlight one word, or press and hold it on a tablet, and tap **📌 What does it mean?**
- **A word on her lists** (Pet Town's, the class's or the family's) shows its meaning and example sentence right away. Simple endings are matched too: "observed" finds *observe*, "cities" finds *city*.
  - The word also joins her practice: it's added to her focus words, even if a grown-up picked other focus words. It comes up twice as often until it's **Solid**, and the 📊 My words chart lists it under **📌 Words you looked up**. These are saved in the student's save as `vocab.lookedUp`.
  - A flagged word works the same way once a grown-up adds its meaning.
- **Any other word** is saved as flagged, along with the sentence it came from. There is no dictionary service and no AI.
  - **Parent:** at home, Word Workshop → For grown-ups (PIN) shows each flagged word with its sentence. The ___ blank is already filled in. Type a kid-friendly meaning and tap **Add**, and the word joins the practice words. A **Look it up ↗** link opens a dictionary for the grown-up.
  - **Teacher:** the Vocabulary tab lists every word students flagged, who flagged it and where. Add a meaning and it joins the class list.
  - Once a word has a meaning on any list, it drops off the student's flagged list by itself and joins her looked-up words.

## What grown-ups see

- **Teacher:** Vocabulary tab → "Class progress on focus words" shows each student's counts and the words to reteach.
- **Parent:** the progress report has a 🔤 Vocabulary line with the counts and a link to the chart.

## Files

- `src/shared/vocab.js`: the word list, the import parser, `vocabList()` (which merges and filters the lists), and word mastery.
- `src/game/game.js`: the Word Workshop screen (search for "Word Workshop").
- `src/teacher/vocab.ts`: the Vocabulary tab.
