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

On every card where she hears a word and types it (🔤 Spell it, the spelling cards in 🃏 Practice cards, the 🐾 Paw Path’s 🔤 Spell it “Listen, then type the word” items, and step 2 of the 🏁 Friday mastery check), `listenFirst` in `game.js`:

1. **Plays it:** the whole word, then "It has 3 syllables.", then each syllable with a short pause while its dot lights up, then the whole word again.
2. **Shows only the count:** "🔊 3 syllables" and three dots. The syllables' letters are never shown before she answers, because they'd give away the spelling. After she answers she sees "ba·nan·a", same as before.
3. **Runs a listening timer:** a bar counts down, "👂 Listen to the word and its parts: 8". The answer box and Check stay locked until it ends, then "✏️ Now type it!" and the box gets the cursor. During the first playback the 🔊 / 🐢 / Slowly buttons wait; after that she can replay as much as she wants, and replaying doesn't shorten the timer. There's no skip button.

- **How long:** 8 seconds after the playback by default. 0 turns the wait off (the box opens right after the playback); up to 20 seconds. The **teacher** sets it for the class (Vocabulary tab → 👂 Listening time, saved in `classes.game_settings.vocab.listenSec`, no new column). A **grown-up** at home sets it behind the PIN (Word Workshop → For grown-ups → 👂 Listening time, saved in `S.vocab.home.listenSec`). The grown-up's setting wins, then the teacher's, then 8 (`listenSeconds` in `vocab.js`). The Paw Path uses the same `listenFirst` and the same setting (owner, Oct 30, 2026: "the Paw Path's Spell it uses the same listening time as everywhere"), so changing it changes the path's wait too.
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

1. **Carried over** 🔁: words a grown-up or teacher moved back from mastered come first (see "Moving words back to practice"), then last week's words that are still unmastered: the ones she didn't get right on Friday (or didn't check at all), and any review word she missed (it went back to unmastered). They come first, in last week's order, and **count toward the 20**. If there are more than 20, the first 20 carry and the rest go back into the unmastered pool.
2. **New** 🆕: the rest of the 20, picked at random from the other unmastered words.
3. **Review** 🔄: 5 words picked at random from the mastered words, preferring ones that weren't on last week's list.

So a normal week is 20 + 5 = 25 words. With fewer unmastered or mastered words she gets what there is. The week saves `carried`, `review`, and `right` (below) with the words; a week drawn before this change keeps its words until the next Monday.

**Friday for review words:** right = still mastered (stays in the Hall of Fame); missed = **back to unmastered** (out of the Hall of Fame, carried over next week). Coins are 🪙 1 per newly mastered word; review words don't earn coins. Only Friday's check bumps a mastered word on its own; a grown-up or teacher can also move one back by hand (see "Moving words back to practice").

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


## Moving words back to practice (Oct 30, 2026)

Owner: "I need to be able to move mastered words over to unmastered if I deem that as necessary. Also, if a word is mastered and it shows up later as incorrect and I add it back, it should bump it out of mastered, correct?" It didn't before; now it does.

**What moving a word back does** (`unmasterWord` in `vocab.js`): the word leaves her 🏆 Hall of Fame and goes on the **Unmastered** list; it's **first in line for next week's 20** (`S.vocab.back`, read by `nextWeekWords`; it counts as 🔁 carried over, ahead of last week's leftovers); and its answer history is reset to one miss ("Needs practice") so it doesn't show as solid right away. This week's list stays as it is, except: if the word is one of this week's 5 review words it becomes a carried-over word (so getting it right on Friday masters it again), it no longer shows ⭐ as mastered this week, and a Friday check that's under way asks it again. Doing it twice changes nothing the second time. **Undo** is just mastering it again on a Friday check.

- **A grown-up at home:** 📊 My words → unlock "For grown-ups" with the PIN → under 🏆 Mastered, **↩️ Move a mastered word back to practice** lists each mastered word with **Move to unmastered**. The day log gets "🔁 habitat moved back to practice by a grown-up".
- **The teacher:** Vocabulary tab → 📚 Each student's words → tap a word in her **⭐ Mastered** list → **Move to unmastered**. The teacher sees "✅ habitat moves back to Abigail's Unmastered list (first in line for next week) the next time Pet World opens for her", and the word shows ⏳ moving back until her game has applied it. It's saved like other teacher-to-student changes, in the student's `quiz_overrides` (no new table): a clear `clear:vocab-back-<time>` = `unmaster:habitat` (`docs/CLEARING-PROGRESS.md`). The game applies it when it loads or refreshes settings (`applyClears`) and records it in `state.clearsDone`, so it runs **once** per save copy and never fights with her mastering the word again later. Her day log gets "🔁 habitat moved back to practice by the teacher".
- **Adding a word she already mastered moves it back too**, built-in words included: the grown-up's word list (import box or a flagged word) shows "📌 habitat was mastered, so it's back on her practice list."; in the teacher app, adding class words (or a flagged word) or saving a student's spelling-pattern words does the same for each student who had it mastered, with "📌 habitat was mastered by Abigail, so it's back on her practice list." for each.
- **Missing a mastered word in practice** (it can come up as one of the 5 review words) still only matters on Friday: a review word missed on Friday's check goes back to Unmastered, as before. Missing it on a puzzle or practice card doesn't bump it, but a grown-up or teacher can now move it back by hand.

**Tested:** `node scripts/check-unmaster.mjs` (out of the Hall of Fame, on the unmastered list, first in next week's draw ahead of 30 leftovers, history reset, a review word turning carried, a second call changing nothing, and surviving a save and load). Playwright at 375px: grown-up PIN → Move to unmastered → the word under Unmastered, the day-log line, and next Monday's draw starting with it; the grown-up adding a mastered word → the 📌 note and the word moving; a fake teacher clear from the pretend backend applied once (the word mastered again afterwards stays mastered, one day-log line); the teacher tab rendered with fake students (confirm, ⏳ moving back, and the 📌 note for each student when class words are added). The teacher app's save to the real Supabase wasn't run.

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

## 🖼️ Word pictures (Oct 30, 2026)

Owner: "i'd also like the image with the word to help her understanding." Every built-in word has a picture (`pictureFor` in `src/shared/wordPictures.js`: the cartoon in `public/vocab-pics/cartoons/`, otherwise its emoji scene; the photo slot stays empty for now). See `WORD-PICTURES.md` for the pictures themselves. `wordPicHTML` in `game.js` draws one.

**Where she sees them** (only next to the word itself, or after she answers):
- **🐾 Paw Path, 👂 Meet the words:** big, between the word and its meaning.
- **After she answers** a Paw Path item (right or wrong; not a look-alike sentence), a practice card (Practice cards, Spell it; not the timed Word sprint), or misses a word in a daily puzzle or the Friday check: small, beside the word, above the word parts.
- **📊 My words:** in the peek when she taps a word.
- **🏁 Friday:** on the back of each flashcard (after the flip), and beside each word she mastered on the results screen.
- **Lesson complete:** a strip of the lesson's words, each with its picture.

**Never** on a question the picture could answer: "Which word means…?", meaning → word, spelling from the meaning, Listen-then-type, the match boards, letter and part tiles, the daily puzzles' clues, and the Friday check's questions. The Playwright test checks every question type for this.

- **Read-aloud:** each picture has a one-sentence `alt` (screen readers read it); tapping the picture reads it aloud.
- **Loading:** cartoons are `loading="lazy"`; one that can't load shows its emoji scene instead.
- **Words a grown-up or teacher adds** show the photo or emoji picked for them (see "Pictures for added words" below).
- `node scripts/check-word-pictures.mjs` runs inside `npm run verify`.

**Tested** (375px, Playwright with the pretend backend, the voice stubbed and a fake clock; `/home/claude/shots/pics-warmup-e2e.mjs`, 42 checks): Today's plan and the Warm-up time! card show ⏱️ 10 min 🐾 Paw Path and ⏱️ 7 min ✏️ Crossword on a Wednesday (an older 7-minute extra gets no extra "more practice" row); the path row starts a 10:00 round; Meet the words shows the big, lazy-loaded cartoon with its alt, and tapping it reads the alt; the lesson-complete strip; Next lesson ▶ while time is left; the clock jumped past 10 minutes mid-question: the question stayed, "⏰ Time's up! Finish this lesson" showed, and the finished lesson offered "Next: ✏️ Crossword, 7 min"; the crossword started at 7:00 with no pictures, a miss showed the picture, and it ended by itself at 7 minutes; both rows turned ✅ with scores; a teacher's 3 + 2 (+ 5 more) showed and the round ran 3:00. Every Paw Path question type (match boards, which word means, word → meaning, build, part questions, letter tiles, spelling choices, fill the blank, in context, listen and spell from the meaning) had no picture before she answered and one after (none after a look-alike sentence). The path's 👂 Spell it waited 8 s by default, 5 s with the teacher's setting and 3 s with the grown-up's over the teacher's. Practice cards: no picture before answering, one after every card; My words peek; Friday: one warm-up row, no picture on a flashcard's front or any check question, one on the back and after a miss, every mastered word with its picture on the results, and the row ✅. No sideways scroll and no page errors.

## 🖼️ Pictures for added words (Oct 30, 2026)

Owner: built-in words already have pictures; words a grown-up or teacher **adds** get these choices, and "build me a ramp to make new cartoons with words without them." ROADMAP F92.

### Picking a picture

- **Where:** a grown-up, in Word Workshop → For grown-ups (behind the PIN) → Words you added → 🖼️ beside a word. A teacher, in the Vocabulary tab → Class words you added → 🖼️ Picture.
- **🔍 Find a photo (first choice):** the box searches **Openverse** (`api.openverse.org/v1/images/`, free-license images, no key, straight from the browser; `src/shared/photoSearch.js`) for the word, or for other search words typed in the box. It asks only for `license=cc0,pdm,by,by-sa` with `mature=false`, and drops anything else that comes back (a non-commercial or no-derivatives license, or a result marked mature). It shows **6 thumbnails** with the title, creator and license (and a source link). The grown-up or teacher taps **Use this photo**, or **None of these**. **Nothing is ever picked automatically.**
- **What's saved** (with the word, `photo: {src, credit, license, licenseVersion, source, title, creator}`; checked by `validWordPhoto`):
  - a family's word: the thumbnail shrunk to a small JPEG data URL (at most 30,000 characters, about 22 KB, like outside-work photos are shrunk; at most 40 words keep one), so it works offline. If the photo site doesn't allow the download, its https address is saved instead and the toast says it needs the internet.
  - a class word: the photo's https address with its credit, in the class word list the tab already saves (`classes.game_settings.vocab.words`; no new table).
- **The credit** ("“Red kayak” by Jo (CC BY 2.0)") shows under the photo **wherever it appears**: Meet the words, beside an answer, My words, Friday, the lesson strip, and in both picture boxes (with the source link). A day-log line notes each photo a grown-up picks.
- **🙂 Or an emoji (the fallback):** Pet World suggests 1–2 emoji from the word and its meaning (`suggestEmoji` in `wordPictures.js`): fruit → 🍎, a boat → ⛵, "very big" → 🐘, "sad and quiet" → 😢. It's careful: things (fruit, water, dog, book, music) count anywhere in the meaning and win over describing words; describing words (big, fast, sad, sleepy, see) count only in a short meaning; words with two everyday meanings (time, little, say, help, find, grow) aren't in the table; a meaning with not, no, without, opposite, less, lack or un- gets nothing; no sound-alike puns. **Nothing if unsure.** The suggestion shows on the word until the grown-up or teacher changes it: **Use it**, type 1–3 emoji and **Save emoji**, or **No picture** (turns the suggestion off; a picked photo stays).
- **Order** (`pictureFor`): the picked photo → a cartoon drawn later (`CLASS_CARTOONS`) → their emoji → the suggested emoji → none. Built-in words keep their own pictures. The picture shows in the same places and never on a question, as above.
- A word added again keeps its picture unless the new line brings one (`keepPictures`).

### 🎨 The cartoon ramp

- **🎨 Needs a cartoon:** the teacher's Vocabulary tab (class words) and 📊 My words behind the grown-up PIN (the family's words and the class's) list the added words with no cartoon yet.
- **📋 Copy request for Claude** copies a ready-to-paste request: each word with its meaning and example sentence, naming the `pet-world-word-cartoons` skill (`cartoonRequest`). Claude draws them with the kit, reviews them and sends a patch that adds them to `CLASS_CARTOONS`. How: `docs/WORD-CARTOONS.md`.

**Tested** (`node scripts/check-word-pictures.mjs`, in verify): the order photo → cartoon → chosen → suggested → none, "No picture", a non-commercial license never shown, a photo without a credit, an https source or a safe `src` dropped, the size cap, `validWord` keeping the picture, 11 suggestion cases plus every built-in word's suggestion being 1–3 emoji, Needs a cartoon (added words only, once each), the request text, the search URL, results filtered to open licenses and no mature ones, at most 6, and the "too many searches" message. **Playwright at 375px** (`/home/claude/shots/pics-added-e2e.mjs`, 47 checks; **Openverse can't be reached from the sandbox, so its API and thumbnails were stubbed with Playwright routes**: a realistic `/v1/images/` response with the API's fields, 8 results including a CC BY-NC one and a mature one, and a real JPEG for the thumbnails, with CORS headers): locked before the PIN; glum's suggested 😢, words instead of emoji refused, changed to 😞; zorble no suggestion; orchard's 🍎🌳 turned off with No picture; kayak's search asked for open licenses with safe search, showed 6 results with title, creator and license, None of these picked nothing, Use this photo saved a 7 KB JPEG data URL with its credit, license and source; Needs a cartoon (6) and the copied request (clipboard stubbed); My words showing the photo with its credit, 😞, nothing for orchard and ⚡ for brisk; Meet the words with kayak's photo big and its credit, no picture on any question; the teacher's tab (rendered from `src/teacher/vocab.ts` with a fake class, the save captured): Needs a cartoon (2) and its request, a suggested ⛵, None of these saving nothing, a picked photo saved as its address with credit, license and source in the same class word list, an emoji; and that class word's photo and credit in the student's Word Workshop. No sideways scroll and no page errors. **Not tested live:** a real Openverse search and download (blocked here), and the teacher's save to the real Supabase.

## This week's word path: 🐾 the Paw Path (Oct 30, 2026)

Owner: "Can we add a Duolingo feel to the vocab? Right now for English words, eventually any language." Then: "I'd like it to focus on how we are doing her words. She gets 20 a week with 5 distinct skills/games testing different parts of teaching the words and definitions, then Friday she proves her mastery and we move on."

It's called the **Paw Path** (Duolingo's owl is theirs; her own helper pet is the mascot). It's the first tab in Word Workshop (🐾 Paw Path), and the 📅 This week tab and the other tabs are still there.

### What she sees

A winding column of big round nodes, one per skill, then a 🏆 trophy for Friday. Her helper pet stands beside the node she's on and cheers ("Let's go!"). Each node has a ring that fills as she finishes its lessons. A node opens when the one before it is finished; a locked node says which one to finish first. Tapping an open node shows a bubble with **Start lesson N +10 XP** and the lesson numbers (✅ done, ▶ next, 🔒 later). A finished node turns gold with a ⭐, and any of its lessons can be played again for practice. At the top: ⚡ XP this week, 📅 days this week with a lesson (not a 🔥 streak: it starts over each week), and the week's 7 days (🐾 on each day she did a lesson). The path opens scrolled so the node she's on (or the one she tapped) is in the middle of the screen, and the pet's line by a node stays the same all day. At the bottom: **🎲 Puzzle of the day** (the old daily puzzle, now a bonus) and **📅 All this week's words**.

**The words:** this week's 20 unmastered words (the weekly draw is unchanged). The 5 review words aren't on the path (they're already mastered); Friday's check still asks them. The 20 are split into lessons of about 5 words (`lessonGroups` in `src/shared/wordPath.js`: 20 words → 4 lessons, mixed by the week's id, the same groups in every skill all week). Near-synonyms (enormous / immense, compare / contrast…) never share a lesson, so a match board never has two meanings that fit one word. So a normal week is 5 skills × 4 lessons = 20 short lessons, about 5 a day Monday to Thursday.

### The five skills (each teaches a different side of the words)

| Skill | What she does | Items in a lesson (5 words) |
|---|---|---|
| 👂 **Meet the words** | A card for each new word: the word, 🔊 (it's read aloud when the card opens), 🐢 by syllables, the meaning and an example sentence. After each card, a "Which word means…?" tap on the word before it, and the first word once more at the end. | 5 cards + 6 taps |
| 🔗 **Match it** | A board of 5 word ↔ meaning pairs (tap a word, then its meaning), then "What does *word* mean?" for each word, then a **mixed review** board read from the meanings side: 3 of the lesson's words and 2 other words from this week (she met them all in Meet the words), so it isn't the same 5 pairs a third time. The meanings column is the wide one. | 2 boards + 5 taps |
| 🧩 **Build it** | For a word with parts (117 of the 143 built-in words): build it from part chips (its parts plus 2 that don't belong); after every build, right or wrong, the 🧩 Word parts box shows each part and what it means; then either "In *predict*, what does the part *dict* mean?" or "Which word has a part that means: *carry*". A word with no parts (rapid, scarce…, and every word in another language) is built from **letter tiles** (pairs of letters for a long word, plus 2 tiles that don't belong), then "**Which one is spelled right?**" (four spellings that differ in one vowel, all the same length). | 10 |
| ✏️ **Use it** | A **new** sentence for each word ("Which word fits best?"; never the example she saw in Meet the words). Then for a word with a look-alike, a **👀 Look-alike words** card (both words, their meanings and how they differ), then two sentences: one where only her word fits and one where only the look-alike fits (*compare* vs *contrast*, *migrate* vs *wander*), so picking "the word I've practiced all week" gets only half. Every other word gets "What does *word* mean in this sentence?" on the Meet example (a sentence she saw days before, never the one she just filled in), with four meanings to pick from. | 10 to 20 |
| 🔤 **Spell it** | 👂 Listen first and type (the same `listenFirst` as Spell it: the word, "It has N syllables", each syllable, the listening timer, only the count and dots before she answers), with the meaning under it; then a round typing each word from its meaning, no sound. | 10 |

Why these five and not exactly the proposal: they match it, with two small changes. Match it's "reverse" is its own second board read from the meanings side (a mixed review) plus the "What does it mean?" taps (Meet the words already asks "Which word means…?"), and Build it's one-part words get a second item so every lesson has 7 or more exercises.

**Review fixes (Oct 30, 2026, after a fresh-eyes review):** "Which sentence uses *word* the right way?" is gone: its right sentence was always the one she had just filled in, and its wrong sentences were ungrammatical, so it tested what sounds right, not the meaning. Look-alike items are now taught on a card and asked both ways (before, the wrong choice was usually a word she hadn't studied, so the familiar word was always right). Build it shows the word parts after every build, so a part question asks about something she was just shown.

**In every lesson:**
- **Right:** a bright chime, the bottom bar turns green, and her pet cheers ("Great job!"). **Wrong:** a soft buzz, the bar turns red with the right answer, the 🧩 Word parts box (spelling misses also get "Tricky part"), and **✍️ type it to keep going**, then Continue. What she types is the right answer: the word, or for a missed part question the part's meaning ("see"), or for a look-alike sentence the look-alike that fit. Continue always scrolls into view above the floating ✋ I have a question button.
- **Misses come back** at the end of the lesson ("🔁 Let's try this one again") until she gets them right. On a match board, a wrong pair shows that word's meaning (type it to keep going) and the word comes back at the end as "What does it mean?".
- Choices: select, then **Check** (big buttons, like Duolingo). A progress bar runs across the top, with ✕ to stop. Once she has started, ✕ asks "Stop this lesson?" (Keep going / Stop): a stopped lesson isn't saved (her answers still count in 📊 My words), and in a warm-up the round ends too.
- **Lesson complete:** her pet hops, ⚡ XP (10, or 15 with no misses), 🎯 accuracy (first tries), 📅 days this week, 🪙 1 (2 with no misses), and "🎉 You finished Match it! Next up: Build it" when a node is done. Coins are the same small amounts as the rest of Word Workshop; there are no hearts and nothing to buy.
- Every answer counts like the rest of Word Workshop: her answer history (📊 My words), ✅ right this week on the Words of the Week card, and arcade minutes (`recordVocab`).

**🏆 Friday:** the trophy is the Friday mastery check, exactly as before (📇 flashcards, then type each word; Friday, or the weekend if Friday was missed). It opens on its day whether or not the path is finished; before Friday the bubble says "Opens on Friday" (and "You're ready!" once all 5 skills are done). After the check the path for that week is done; next Monday's draw makes a new path and it starts over.

### Where it shows up

- **Words of the Week card:** a 🐾 line (next node and lesson, XP, days), and **🐾 Practice** opens Word Workshop on the path with her next node's bubble open.
- **The warm-up: 10 + 7** (owner, Oct 30, 2026; a Word Workshop extra on Today's plan and the Warm-up time! card; `DAILY-PLAN.md`, "Word Workshop warm-up: 10 + 7"): two rows. **⏱️ 10 min on the 🐾 Paw Path:** lessons back to back from her next node (once all 5 skills are done, practice in the skill she's least accurate in); if a lesson ends early the next one starts from **Next lesson ▶**; the score is the answers she got right. At 10 minutes she is never cut off mid-question: a calm "⏰ Time's up! Finish this lesson to keep its XP" shows and she finishes the lesson she's in (it still counts). Then the complete screen shows the round's brag and **Next: 🔀 Word Scramble, 7 min ▶**. **⏱️ 7 min on the word game of the day:** Monday 🔀 scramble, Tuesday 🔐 secret code, Wednesday ✏️ crossword, Thursday 🔎 word search (if today's puzzle is already done, a fresh one of the same kind). Its score is kept under `<id>~game`. **Friday** is one row, the 🏁 mastery check, as before. A grown-up or teacher sets both lengths on her page (🐾 Paw Path and 🎲 Word game; 10 and 7 are the defaults, `x.path` and `x.game`; an extra saved before Oct 30 keeps its round length for the game). Listening time on Spell it cards is added back to the path's clock, like Word sprint. Time in Word Workshop counts for the extra the same way as before.
- **Day log:** each lesson ("🔤 Paw Path: 🔗 Match it · lesson 2 · +15 XP · 9 of 10") and each warm-up round.
- **📊 My words** and the grown-ups' report: "🐾 Paw Path: 2 of 5 skills done · 85 XP · 3 days · 👂 Meet the words ✅ 92% · 🔗 Match it ✅ 88% · 🧩 Build it 1/4 70%".
- **Teacher app → Vocabulary → 📚 Each student's words:** the same line under each student's summary (read from her save, `saves.state->vocab.path`; no new table).

### Fair questions (CONTENT-RULES)

Every choice item has exactly one right answer. Wrong answers are other words (this week's first, then her other words), the same part of speech when there are enough, never a near-synonym of the answer (`NEAR`, checked by hand), never a word that the prompt names, and never one that clashes with "a" / "an" before the blank. The right answer's place among the choice lengths is picked at random (shortest, second, … longest), so "pick the longest" doesn't work. Meanings in choices drop the notes in brackets. A word part that gives itself away (musician's root "music", artifact's "art") is never asked, and part meanings offered as choices are short plain ones ("see", "carry"), never odd glosses. Nothing gives an answer away inside a lesson: no right answer is a sentence she saw filled in earlier in the same lesson.

`node scripts/check-word-path.mjs` builds lessons for 400 random weeks (8,000 lessons, about 77,000 exercises; weeks with a family's own words too) and checks all of that, plus every skill covering all of the week's words, no repeated or empty choices, no undefined / NaN, and the saved state (unlocking, XP, a replay, a new week starting over, save and load). It also checks that every look-alike pair is taught on a card and asked both ways, and plays weeks in Spanish (all Spanish, and English weeks with 2 Spanish words): every word is still in every skill, wrong answers are always in the word's language, and spelling choices are all the same length. A test-wise bot (longest, shortest, middle length, most word overlap with the prompt, first, last, and "pick the word on this week's list") stays within 10 points of chance on every kind of item (latest run: 20–33% where chance is 25%, 50% on the two-choice look-alike items, including for the "this week's word" bot).

The new built-in data is in `src/shared/wordPath.js`: a part of speech and a **second sentence** for each of the 143 built-in words (`PATH_DATA`), 44 look-alike items (`NUANCE`, 22 pairs, each asked both ways) and the near-synonym pairs (`NEAR`). All of it, with the right answers in bold, is in `docs/word-path-review.md` for a grown-up to read. One built-in meaning changed so it doesn't give the word away: musician is now "a person who plays an instrument or sings, often for others" (it was "…plays or makes music").

### Other languages

The path is built from data, not from English rules: a word is `{w, d, s, u?, pos?, lang?}` (`validWord` keeps `u`, a second sentence; `pos`, v n a r; and `lang`, like `es` or `fr-CA`). A word with `lang` is read aloud by a voice for that language when the device has one (`readingVoice(lang)`), and wrong answers come only from words in the same language. The English-only extras (built-in second sentences, look-alike items, word parts, the "to …" = verb guess) don't apply, so:
- **Build it** uses letter tiles (letters with marks like é and ñ stay whole) and "Which one is spelled right?" (a vowel with a mark is never changed, so no choice looks odd one out; the last letter isn't changed either, since gato / gata are both words).
- **Use it** fills the blank in the word's sentence, then "Which word means…?", so Build it and Use it are different lessons.
- **Typing:** accent keys (every letter with a mark in her words in that language) sit under each typing box, and a word typed without its marks (arbol for árbol) counts, with "✍️ Watch the marks: it's spelled árbol."
- **A word with too few other words in its language** for fair wrong answers (2 Spanish words in an English week) gets a typed item instead (type the word that fits the sentence, or the word from its meaning), so it's still in every skill.
- **Entering words:** in the grown-ups' and the teacher's word box, a line `Language: Spanish` (or `es`, `Idioma: español`) puts the words under it in that language until `Language: English`; a fourth part is the second sentence; `(n)`, `(v)`, `(adj)` or `(adv)` after the word is its part of speech: `árbol (n) - tree - El pájaro está en el ___. - Hay un ___ en el patio.` A bare word under a language heading never takes Pet World's English meaning. JSON imports take `lang`, `u` and `pos` too.

The screens' own words ("Which word fits best?") are still English, as are the older Word Workshop tabs in Español mode.

Words a teacher or parent adds have only one sentence. Meet the words then shows the meaning without the sentence, so Use it can use that sentence as the "new" one.

**Tested** (phone size, 375px, Playwright with the pretend backend from `scripts/smoke.mjs`, a fake clock on a Wednesday, then a Friday, and the device voice stubbed): the path renders with Meet the words open and the rest locked (a locked node says what to finish first); all 20 lessons played through the screens, the first lesson of each skill with a wrong answer (a tap, a match pair, a wrong part chip, a wrong sentence, a misspelling): each showed the right answer and word parts, a wrong copy didn't move on, the typed word did, and the miss came back at the end; complete screens with ⚡ 10 (15 for no misses) and accuracy; each node unlocked the next in order; the Words of the Week card's Practice opened the path with Match it's bubble open; a finished lesson replayed; 📊 My words showed "5 of 5 skills done" with each skill's accuracy; the warm-up row started a timed lesson, the next lesson followed, the 1-minute clock ran out mid-lesson, the lesson finished, the round's brag showed and the row turned ✅ with its score; the day log had each lesson with its XP; on Friday the trophy opened the existing check (📇 flashcards first). No sideways scroll and no page errors. The teacher tab's line was built (esbuild) but not rendered against the real backend.

**Tested after the review fixes** (375px, Playwright, same setup, `/home/claude/shots/wordpath-fix-e2e.mjs`, 66 checks): the path opens with her current node on screen; the pet's line stays the same when she taps a node; ✕ after the first card asks "Stop this lesson?", Keep going stays, Stop goes back to the path; all 20 lessons again with a miss in the first lesson of each skill; on all 8 match boards the cleared board's Continue is on screen and not under the ✋ button, and after every answer in every lesson (over 100 checked) Continue is on screen above the ✋ button; a right build shows the word parts; every Use it lesson shows a look-alike card and no "which sentence" item; 📅 days, not 🔥, on the path; then a family's all-Spanish week (built-in words off): all 10 lessons played, with letter tiles, spelling choices, accent keys, "arbol" counted for "árbol" with the note, and the words read by a Spanish voice. No sideways scroll and no page errors.
