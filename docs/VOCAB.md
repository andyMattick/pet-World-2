# Word Workshop

Vocabulary practice: 🃏 practice cards, ⚡ word sprint, 🔤 spell it, and 📊 my words. The words are in `src/shared/vocab.js`, plus the class's words (teacher app → Vocabulary) or a parent's own words.

## Hearing the word

Spelling cards read the word aloud. The voice comes from the device, so it sounds different on a Chromebook, an iPad, Windows and a Mac.

- **The voice:** Pet World picks the clearest English voice the device has. It prefers voices named Natural, Google or Enhanced, and skips the joke voices some Macs include. To try others, open Practice cards or Spell it and use **🔊 Reading voice**. The choice is saved with her town (`S.ttsVoice`).
- **🔊 Hear the word:** the whole word at a normal pace.
- **🐢 By syllables:** each syllable on its own with a short pause, then the whole word. The dots next to the buttons show how many syllables there are and light up one at a time. The dots don't give away the spelling.
- **Slowly:** the whole word, slower.
- **After she answers:** the word is shown split into syllables ("sur·vive", 2 syllables) with buttons to hear it again.

Each built-in word has two versions of its syllables in `vocab.js` (`SYLLABLE_DATA`):

- **To show:** dictionary breaks, like `an·a·lyze`.
- **To say:** respelled so a computer voice says each piece clearly, like `an|uh|lize`. Read on its own, "lyze" can come out wrong.

A third field fixes words the voice gets wrong on its own: "minute" meaning tiny is said "my noot".

Words a teacher or parent adds are split by a simple rule (vowel groups, with ch, sh, th and the like kept together). Those pieces are said as written.

To make a voice sound better on a device, install a better one:

- **Windows:** Settings → Time & language → Speech. Edge's "Natural" voices are the best of the free ones.
- **Mac and iPad:** Settings → Accessibility → Spoken Content → System Voice. Download an "Enhanced" or "Premium" voice such as Ava or Samantha.

## Word levels (adaptive)

Every word has a level from its syllables, its length, and tricky spellings like ough, -tion and ie (`wordLevel` in `vocab.js`):

- 🌱 **Easier:** short, 1 or 2 syllables, like compare or rapid.
- 🌿 **Middle:** like accurate or habitat.
- 🌳 **Harder:** like civilization or approximate.

She has her own level for spelling and another for the meaning cards (`S.vocab.level`). Spelling starts at Easier.

- She only gets words at or below her level, mostly at it.
- **2 misses in a row** drop her a level ("🌱 Let's try some easier words for a bit").
- **4 right in a row** move her up a level.
- **Easier** and **Harder** buttons on the start screen change it by hand.
- Words she has missed still come back more often.

## Spelling patterns

When she misspells a word, Pet World lines up what she typed with the right word and names the kind of mistake (`src/shared/spellingPatterns.js`):

| Pattern | Example |
|---|---|
| pre / per / pro at the start | perdict → predict |
| ie or ei | recieve → receive |
| Double letters | acurate → accurate |
| -ant / -ent, -ance / -ence | relevent → relevant |
| -ible / -able | responsable → responsible |
| -tion / -sion / -cian | conclution → conclusion |
| c that sounds like s or k | presise → precise |
| Letters switched | invesitgate → investigate |
| The quiet "uh" vowel | seperate → separate |
| Missing letters or sounds | enviroment → environment |
| Extra letters | thourough → thorough |

- **For her:** right after a miss she sees "Tricky part: pre / per / pro at the start", with a tip on how to remember it.
- **What's saved:** her last 80 misses, in `S.vocab.mistakes`.

**For the teacher:** the Vocabulary tab has a ✏️ Spelling patterns card for each student who has misspelled words. It lists each pattern with how often it happened, what she wrote, and how to teach it. Below that are **suggested words** for the same patterns: the words she missed, then practice words built for that pattern, then words from the lists. **Practice these with …** saves the ticked words for that student (`quiz_overrides.spellFocus`). They come up 3 times as often in her Word Workshop until they're solid, at any level.

The practice words built for each pattern (prepare, prevent, perhaps, believe, receive, necessary, -able and -ible words, and others) are in `PATTERN_WORDS` in `vocab.js`. Each has a meaning, a sentence and its syllables.

## Spelling patterns: add to focus and practice (October 2026)

The **Add to focus and practice with …** button under each student's suggested words used to do nothing after any other save on the Vocabulary tab, because the redraw dropped the button's handler. Now:
- The ticked words are saved as that student's practice words (`spellFocus`).
- Words not on the class list are added (set "Spelling patterns") and marked **➕ new** beforehand.
- When the class uses focus words, words that aren't focus words are added to them, marked **○ not in focus** beforehand.
- A message in that student's box says what was saved and added.

## Weekly words, daily puzzles and the Friday mastery check (Oct 27, 2026)

Owner: "working on the same words all week and showing mastery of words at the end of the week."

- **This week's words** (📅 This week tab, `S.vocab.week`): up to **20 unmastered words plus 5 mastered words to review** (see "The weekly draw" below). A new week starts on Monday (`nextWeekWords`, `weekOf` in `src/shared/wordPuzzles.js`). Practice cards, Word sprint, Spell it and the puzzles use this week's words.
- **A puzzle a day** on the week's words (`src/shared/wordPuzzles.js`): Monday 🔀 Word Scramble, Tuesday 🔐 Secret Code (each symbol is a letter; the key shows about half of them, and every letter of a word she solves or types out joins the key, marked green), Wednesday ✏️ Crossword (built from the words, definitions as clues), Thursday 🔎 Word Search (the clues are meanings, not the words), weekends 🧩 Match-Up. 6–8 words each.
- **The warm-up** for a Word Workshop extra is a timed round on the day's puzzle (7 minutes by default; teacher app → extras). It counts the words she solves; the end screen brags on her progress. Not finishing is fine.
- **An unfinished puzzle is saved** and comes back the next day ("📌 Yesterday's puzzle: finish it today!"), one more day only; after that a new puzzle starts.
- **Type it to keep going:** a wrong answer anywhere in Word Workshop (puzzles, practice cards, Word sprint, Spell it, the mastery check) shows the right word, and she types it correctly before she can go on. Copying it wrong doesn't move on.
- **🏁 Friday mastery check** (Friday, or the weekend if Friday was missed): step 1 is a 📇 flashcard warm-up (see below); step 2 is each of the week's words, from its meaning (with 🔊), typed. Right the first time = **mastered**: celebrated on a 🎉 screen, added to her **🏆 Word Hall of Fame** (`S.vocab.hall`), removed from her focus list, and worth 🪙 1 each. The rest stay for next week. Progress is saved, so she can stop and finish later. On Friday the Word Workshop warm-up is the mastery check instead of a timed puzzle.
- **Coins:** 🪙 1 for every 2 puzzle words solved, and 1 per mastered word.
- **Tested** (phone size, Playwright with a fake clock): each puzzle type built and finished, a wrong answer needing the typed word (and a wrong copy not moving on), yesterday's crossword coming back once, a Friday check with 20 mastered and 5 kept, and the next Monday with 5 kept + 25 new (the draw before Oct 28; see "Words of the week" for the 20 + 5 draw). The puzzle builders were checked on 300 random sets: every crossword word matches its squares and fits 12 wide (all 8 words placed on average), every word-search word reads correctly both ways, every scramble is a real mix-up, every code word has a letter in the key.

## Words of the week (Oct 28, 2026)

Owner: "I'd like to see a WORDS OF THE WEEK CARD on the plan page that shows all the ones she has gotten right in the week; how she does on mastery friday (with the flashcard quiz); which words carried over from previous week. In the teacher portal, i should see a list of mastered, unmastered and the current words (with new words always being added to mastered and new words for the week pulling up to 20 randomly from unmastered words 5 random mastered)."

**One list, two halves.** All her words (Pet World's list, the class's, the family's and any spelling-pattern words her teacher picked) are one list. **Mastered** = her 🏆 Hall of Fame (`S.vocab.hall`). **Unmastered** = every other word. Words a teacher or parent adds go in **Unmastered** (we read "new words always being added to mastered" as newly added words joining the list the weekly draw picks from, which is the unmastered one). Focus-word picks no longer narrow anything, so the teacher app's focus picker is gone.

### The weekly draw (`nextWeekWords`)

Each Monday (the first time she opens Pet World that week):

1. **Carried over** 🔁: last week's words that are still unmastered: the ones she didn't get right on Friday (or didn't check at all), and any review word she missed (it went back to unmastered). They come first, in last week's order, and **count toward the 20**. If there are more than 20, the first 20 carry and the rest go back into the unmastered pool.
2. **New** 🆕: the rest of the 20, picked at random from the other unmastered words.
3. **Review** 🔄: 5 words picked at random from the mastered words, preferring ones that weren't on last week's list.

So a normal week is 20 + 5 = 25 words. With fewer unmastered or mastered words she gets what there is. The week saves `carried`, `review`, and `right` (below) with the words; a week drawn before this change keeps its words until the next Monday.

**Friday for review words:** right = still mastered (stays in the Hall of Fame); missed = **back to unmastered** (out of the Hall of Fame, carried over next week). Coins are 🪙 1 per newly mastered word; review words don't earn coins.

### 📇 "With the flashcard quiz"

We read this as: keep the typed check that decides mastery, and start it with a short flashcard warm-up. Starting the Friday check (from the card or the 📅 This week tab) opens **step 1: flashcards** of the week's words still being worked on: the meaning and sentence on the front, the word on the back (🔊 to hear it), "😕 Still learning" brings a card back after a few cards, "✅ I knew it" moves on, like the test review's 📇 cards. **Skip to the check** is allowed. **Step 2** is the typed check, as before. The flashcards don't decide mastery; their result (known on the first try, `week.check.cards`) shows on the check's end screen, the card and the teacher app. A check already under way (some words typed) goes straight to step 2.

### The card on the home page (`wordsWeekCardHTML`)

Right under 📋 Today's plan, sized for a phone:

- **📚 Words of the Week** with a **Practice** button (opens Word Workshop).
- Counts: words this week · ✅ right this week · 🔁 carried over · 🔄 review, and a bar for right this week. "Right this week" means she answered the word right at least once this week anywhere in Word Workshop: puzzles, practice cards, Word sprint, Spell it or the check (`week.right`, set in `recordVocab`).
- Friday line: before Friday, when the check is; on Friday, **Start** (or **Finish it**); after the check, ⭐ mastered · stay · 🔄 review kept · 📇 flashcards first try.
- **See all words** (closed by default): the words grouped as carried over, new this week and review, marked ✅ right this week, ⭐ mastered on Friday, ↩️ stays for next week.

### Teacher app: each student's words

The Vocabulary tab opens with **📚 Each student's words**: one row per student (read from `saves.state->vocab`, the same query as before; no new tables), with a summary line (mastered, unmastered, this week's mix, right this week, Friday's result). Opened, it shows three lists side by side: **This week's words** (each tagged 🔁 carried over, 🆕 new or 🔄 review, with right this week and Friday's result), **Unmastered** (with ✅ / 🟡 / 🔴 from her answers) and **⭐ Mastered**. A save from an earlier week says so: her new list is drawn when she next opens Pet World. Under it are the old tools: add or import words (they go in Unmastered), flagged words, spelling patterns, and class progress (now on all words).

**Tested** (phone size, Playwright with a fake clock, `scratchpad/wow-e2e.mjs`): Monday 20 words with 0 carried; 3 puzzle words → "3 right this week"; teacher's and parent's new words in Unmastered; Friday: the card's Start opens the flashcards, then the typed check (16 mastered, 4 stay, flashcards 19 of 20); the card shows the result; next Monday 4 carried (the 4 that stayed) + 16 new (all unmastered, none from last week) + 5 review (all mastered); next Friday a skipped flashcard round and a missed review word, which leaves the Hall of Fame and carries over the Monday after. No sideways scroll at 375px. The draw was also checked on its own on 300 random cases. The teacher tab was rendered with fake students in a browser (not against the real backend).

