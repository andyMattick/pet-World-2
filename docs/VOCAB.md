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

Words a teacher or parent adds are split by a simple rule (vowel groups, with ch, sh, th and the like kept together), unless they wrote the syllables with + (below). Those pieces are said as written.

### 👂 Listen first (Oct 30, 2026)

Owner: "let's add a timer after she hears the word and tells her how many syllables it is supposed to have (and pronounce each one). she needs to spend more time hearing the word and its parts."

On every card where she hears a word and types it (🔤 Spell it, the spelling cards in 🃏 Practice cards, and step 2 of the 🏁 Friday mastery check), `listenFirst` in `game.js`:

1. **Plays it:** the whole word, then "It has 3 syllables.", then each syllable with a short pause while its dot lights up, then the whole word again.
2. **Shows only the count:** "🔊 3 syllables" and three dots. The syllables' letters are never shown before she answers, because they'd give away the spelling. After she answers she sees "ba·nan·a", same as before.
3. **Runs a listening timer:** a bar counts down, "👂 Listen to the word and its parts: 8". The answer box and Check stay locked until it ends, then "✏️ Now type it!" and the box gets the cursor. During the first playback the 🔊 / 🐢 / Slowly buttons wait; after that she can replay as much as she wants, and replaying doesn't shorten the timer. There's no skip button.

- **How long:** 8 seconds after the playback by default. 0 turns the wait off (the box opens right after the playback); up to 20 seconds. The **teacher** sets it for the class (Vocabulary tab → 👂 Listening time, saved in `classes.game_settings.vocab.listenSec`, no new column). A **grown-up** at home sets it behind the PIN (Word Workshop → For grown-ups → 👂 Listening time, saved in `S.vocab.home.listenSec`). The grown-up's setting wins, then the teacher's, then 8 (`listenSeconds` in `vocab.js`).
- **Timed rounds:** ⚡ Word sprint asks "which word means" and has no spelling cards, so the listening timer never runs inside it. If a timed run ever gets a spelling card, the time spent listening is added back to its clock (we pause it), so listening never costs her sprint time.
- **No voice on the device:** a note says "🔇 This device can't read words out loud right now, so you can type right away" and the box opens straight away. She's never locked out. (Pet World waits up to 1.5 seconds for the device's voices to load first.)

### Syllables with + (teacher's and parent's words)

In the teacher's Vocabulary tab and the parent's word list, a word can be typed with its syllables split by +: `ap+ples - round fruit`, `cel+e+bra+tion - a big party`, or just `ap+ples` on a line or in a list (`Set 11: ap+ples, ba+nan+a`). Both editors say: "Type syllables with + to help Pet World say them: ap+ples".

- The word is saved without the +'s (`apples`) and the pieces separately (`syl: ["ap", "ples"]`, `validWord` / `plusSyllables` in `vocab.js`). Matching, spelling checks, mastery and the teacher's tables use the plain word.
- The pieces set the syllable count, the dots, what the voice says for each syllable (`syllablesOf(word, syl)`), and the "ap·ples" shown after she answers. Pieces written with + win over the built-in data and the vowel-group guess.
- **Checked:** every piece must have letters, so `ap++ples`, `+apples` and `apples+` are skipped with "has an empty syllable: put letters between each +, like ap+ples". A saved `syl` that doesn't join to the word is dropped and the word keeps working with the usual split.
- A word with no meaning yet comes back in the box as `ap+ples - `, + and all.
- Words saved before this keep working as they were. The teacher's class-word table shows the pieces under the word; the parent's chips show `ap+ples`.

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


## Word parts (Oct 30, 2026)

Owner: "Can you give a brief breakdown of the word if she misses it to show the prefix, suffix, and root word?"

### What she sees

When she misses a word anywhere in Word Workshop (🃏 practice cards of every kind, ⚡ Word sprint, 🔤 Spell it, the daily puzzles and the timed warm-up on them, the 🏁 Friday mastery check), a small **🧩 Word parts** box shows under the right answer, above “✍️ Type it to keep going”:

- **Chips** for each part, in order, each with what it means: **prefix-** (blue), **root** (green), **-suffix** (orange). Example: `pre-` before + `dict` say.
- The **put-together line**: → to say it before it happens.
- The language it comes from (Latin, Greek, Old English…), small and grey.
- A part spelled a little differently inside the word has a small `*` (summarize: `summary*`, the y changes; civilization: `-ize*`, the e drops).
- A word with **no real prefix or suffix** gets one honest line instead of a made-up split: “🧩 One word part: from Latin rapidus, ‘quick, snatching.’” 26 of the 143 built-in words are like this (scarce, rapid, vivid, thorough…).

It’s one or two lines on a phone. Nothing shows before she answers (no giveaway), a right answer shows no box, and the “type it correctly to keep going” step works as before. For read-aloud, each chip has a label like “prefix pre, means before.”

In **📊 My words** (and the 📅 This week word list), tapping a word shows its meaning and the same box, without the language label.

### Where the parts come from

`src/shared/wordParts.js`, `WORD_PARTS`: a hand-checked entry for every built-in word (the 100 words in Sets 1–10 and the 43 spelling-pattern words). Each part is `{text, type, meaning}`; `text` is the letters as they appear in the word, so the parts join to the word exactly, and `show` is the dictionary form when the spelling changes inside the word. The splits are the meaningful classroom ones (spect = look, port = carry, dict = say), checked against Etymonline and Merriam-Webster; the full list with a source for each word is `docs/word-parts-review.md`. A few are worth knowing: predator’s *pred* is “prey,” not pre- “before”; terrible’s *terr* is “frighten,” not terra “earth”; improve’s *prove* is old French “profit.”

### Words a teacher or parent adds

A small, careful guess (`guessParts`), labeled **🧩 Looks like:** with a dotted border so it reads as a guess:

- It only splits off a prefix from a short list (un, dis, mis, non, pre, re, sub, inter, trans, anti, super, semi, tri, bi, multi, auto, tele, over, under) and/or a suffix from a short list (-ness, -less, -ful, -able, -ible, -ment, -tion, -ous, -ive, -ity, -ize…).
- What’s left has to be **3 or more letters** and either a common root (spect, port, dict, struct, rupt, vis…) or **another word she knows** (her list or the built-in words), with a dropped e put back (hopeful → hope + -ful).
- The endings -er, -or, -ed, -ing and -ly only count after a whole known word, never a bare root, so “tender,” “former” and “motor” aren’t split.
- `in-` and `im-` are left out (they can mean “not” or “into”).
- If none of that fits, **nothing shows**. “read,” “reason,” “under,” “interest” and “station” show nothing.

### Adding parts for a new built-in word

Add the word to `vocab.js` as usual, then add its entry to `WORD_PARTS` with the same helpers: `E([p('pre', 'before'), r('dict', 'say')], 'to say it before it happens', 'L')` for a word with parts, or `one('rapid', 'quick', 'One word part: from Latin rapidus, “quick.”', 'L')` for a word without. Check it in a dictionary (Etymonline or Merriam-Webster) and set `src` to `'E✓'` if you looked it up. Use curly quotes and apostrophes. Then run `node scripts/check-word-parts.mjs`: it fails if a built-in word has no entry, if the parts don’t join to the word, or if a part has no meaning. `--table` prints the review table for `docs/word-parts-review.md`.

**Tested** (phone size, 375px, Playwright with the clock on a Friday): a miss in practice cards (fill-in-the-sentence and spelling cards), Word sprint, Spell it, the Crossword, Scramble, Secret Code and Match-Up puzzles, and the Friday check each shows the box with the type-it box under it; a wrong copy still doesn’t move on; a right answer in each of those shows no box; nothing shows before she answers; no sideways scroll; 📊 My words shows the parts when she taps a word.
