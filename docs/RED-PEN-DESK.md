# ✍️ Red Pen Desk (ROADMAP F94)

Owner (Oct 30, 2026): "I'd also like to add a word game. One where students are turning in incorrect words and she has to tell them how to spell it right." It joins the word game of the day rotation (below), and it's in the 🕹️ Arcade too (CLAUDE.md, "Games go in the unit and in the Arcade").

## How it plays

She's the teacher at her desk. Pet students (🐶 Biscuit, 🐱 Mittens, 🦊 Rusty…) turn in papers that use **this week's words**:

- a **spelling list** (4 spelling words), or
- **3 sentences**, one per spelling word (each word's example sentence from the word list).

The spelling words are underlined; they're the only words she can tap. Each paper has **exactly one misspelled spelling word**, or (about 1 paper in 6) **none**, so she can't assume there's always a mistake.

1. **Find it:** tap the misspelled word, or **✅ Looks good! No mistakes**.
2. **Fix it:** write the word the right way. There's no 🔊 and no 👂 Listen first here: she has to know it. A sentence's ending counts either way ("contrasts" or "contrast"), and so does a British spelling (neighbour, summarise, analyse, centre, travelled, defence: `britishSpellings`), which isn't logged as a mistake.
3. **Name it:** pick what kind of mistake it was (4 choices, the spelling patterns from `src/shared/spellingPatterns.js`).

Then the pet thanks her ("Thanks, teacher! I fixed it: predict."), its paper shows the fix in red, and it gets a stamp: **⭐** with no slips, **✔️** with a little help. The graded papers pile up in a stack under the desk. The bar at the top shows papers graded, ⭐ papers and a 🔥 streak (⭐ papers in a row).

- **A wrong tap is gentle:** "Hmm, not that one. “generous” is spelled right." On a paper with no mistake it says "“culture” is spelled right. Read every word again when this paper comes back." instead, so it doesn't send her hunting for a mistake that isn't there. The paper goes back on her pile and comes back two papers later ("back from your pile"). A second wrong tap on the same paper circles the misspelled word for her (or, on a paper with no mistake, tells her it Looks good), and she still has to fix and name it.
- **A wrong spelling** shows the right word with its meaning, its 🖼️ picture and 🧩 word parts, then "✍️ type it to keep going", like the rest of Word Workshop. It goes in her spelling-pattern misses (`S.vocab.mistakes`).
- **A wrong kind** shows the right kind and its tip.
- **Score:** ⭐ papers (graded with no slips). A round is 10 papers (7 minutes on the warm-up clock). Coins like the other word games: 🪙 1 per 2 ⭐ papers. The end screen shows the stack, the best streak and the warm-up's brag ("📈 … than last time").
- **Counts like the other word games:** each typed fix is in her answer history and ✅ right this week (`recordVocab`), and the round is in the day log ("🔤 Word puzzle: Red Pen Desk · 8 of 10"). **It never counts toward mastery** (the Hall of Fame changes only on Friday's check).

## The word game rotation

The 7-minute "word game of the day" (the second row of the Word Workshop warm-up, the 🐾 Paw Path's **🎲 Puzzle of the day**, and the 📅 This week tab's Today's puzzle) now cycles through **five** games on Monday to Thursday:

🔀 Word Scramble → 🔐 Secret Code → ✏️ Crossword → 🔎 Word Search → ✍️ Red Pen Desk → 🔀 Word Scramble → …

Each week picks up where the last one stopped (`wordGameForDate` in `src/shared/wordPuzzles.js`):

> game = (4 × weeks since Monday Oct 26, 2026 + day) mod 5, with Monday = 0 … Thursday = 3

- Over any 5 weeks every game comes up exactly 4 times.
- Each week skips one game, a different one each week, so no game is skipped two weeks running and none waits more than 11 days.
- The week of Oct 26, 2026 is the old fixed week, so the Red Pen Desk's first day is **Monday, Nov 2**. Then: Nov 3 scramble, Nov 4 code, Nov 5 crossword, Nov 9 word search, Nov 10 Red Pen Desk…
- **Friday** stays the 🏁 mastery check; weekends stay the 🧩 Match-Up.
- An unfinished puzzle still comes back the next day (one day only), whatever the rotation says.

## Fair papers (CONTENT-RULES, test-wise)

All in `src/shared/redPen.js` (pure functions, shared by Word Workshop, the Arcade copy and the check).

- **Real mistakes, never nonsense:** each misspelling is one realistic edit of the kind kids make: ie/ei (beleive), a missing double letter (acurate, patern), -ant/-ent and -ance/-ence (relevent, evidance), -ible/-able (responsable), -tion/-sion/-cian (conclution), c for s or k (presise, calkulate), pre/per/pro (perdict, pertect), the quiet vowel (summerize, hesatate, honist: from the word's own "uh" or "ih" syllable in `vocab.js`, a reduced "-ul"/"-un" written with another vowel, or a vowel said as a short i; never an r-controlled "ur" syllable, which is often the stressed one: no infar or detarmine), switched letters (only two vowels, or r/l next to a vowel: calcualte, interpert), a dropped r or n (enviroment, obseve), an extra e before the r of "str", "mbr" or "ndr" (demonsterate; not conterast). A British spelling is never a pet's mistake.
- **Named exactly:** a misspelling is kept only when `spellingPatterns(right, wrong)` (the same analysis Word Workshop uses after her own misses) names exactly the kind it was made as.
- **Never another real word:** checked against Pet World's word lists, her own words and a list of about 1,000 common words (plus words a full dictionary flagged, like premise, prospective, scare, date). The check also runs every built-in word's misspellings against a full English dictionary (hunspell en_US). For words a teacher or parent adds, only the app's lists guard it (the app has no full dictionary).
- **Exactly one right kind:** wrong choices are only kinds whose test doesn't fit this misspelling (so "Letters switched" is never offered against an ie/ei swap, or "Missing letters" against a missing double letter), and never an ending or start kind when the mistake is inside that ending or start (`kindsThatCouldFit`): posseble is "the quiet vowel" and "-ible / -able" is never offered with it; musisian is "c sounds like s" and "-tion / -sion / -cian" is never offered; erosoin is "Letters switched" without "-tion / -sion". Wrong choices are picked by how often each kind is the right answer that week (`answerShares`), so a kind that is often right is often a wrong choice too.
- **No cue from the word, its length or its place** (fresh-eyes review, Oct 30): the paper's words are picked first, evenly from the week's words, and then the misspelled one among them, so each word is the misspelled one about equally often when it's on a paper. (Before, the kind of mistake was picked first, and the one word that could show a rare kind was wrong about 70% of the times it was on a paper.) A word that was already the misspelled one this round is much less likely to be again, and when it is, it gets a misspelling the round hasn't used. A word the game can't misspell fairly (trade, culture, drowsy, vivid…; 23 of the 143 built-in words) is only on a paper when there aren't enough other words, because it would be a free "not this one".
- **Answers spread over the kinds:** after the word, its kind of mistake is picked with more weight for kinds few of the week's words allow (1 ÷ how many, capped at 0.6), so it isn't all switched letters.

`node scripts/check-red-pen.mjs` (in `npm run verify`, with 4,000 papers) makes 12,000 papers from 1,200 random weeks of the built-in words (and weeks with a family's own words, one with a space and one in Spanish, which never go on a paper) and checks all of that, plus no undefined / NaN / empty text, the "Looks good!" rate, the grading functions (British spellings count), no "uh" vowel on an "ur" syllable, and the rotation (60 weeks across a year end and daylight saving: Friday check, weekend match-up, every school day one of the 5 games in order, all 5 equally often, never a game skipped two weeks running). It also plays 4,000 rounds on 40 weeks to check the spread: a bot that learns each week from 300 rounds and taps the word most often wrong, and a bot that remembers this round, must stay at or under 35%; the same misspelling on 3 papers of one round must be rare (under 2%), and a word never repeats a misspelling while it has an unused one. Latest run (30,000 papers):

| Test-wise bot | Right | Chance |
|---|---|---|
| Tap the word that's most often wrong this week (learned from 300 rounds) | 24% | 22% (it was 70% before the review fix) |
| Remember this round (tap a word wrong earlier, else one not yet seen right) | 16% | 22% |
| Tap the longest spelling word | 22% | 22% (1 in 3 or 4, on the 5 in 6 papers with a mistake) |
| Tap the shortest / first / last | 28% / 24% / 24% | 22% (a dropped letter makes the misspelled word a little shorter) |
| Always "Looks good!" | 17% | 17% (the papers with no mistake) |
| Kind of mistake: the longest name | 24% | 25% |
| Kind of mistake: the first choice | 25% | 25% |
| Kind of mistake: the most common right answer so far | 28% | 25% |

The same misspelling is on 3 papers in 0.5% of rounds (42% before the fix).

## 🕹️ The Arcade copy

`arcade/red-pen/index.html` + `main.js` (a Vite page, `vite.config.ts`), using the same `src/shared/redPen.js`. It asks the Arcade for her words of the week (`arcade:words-request`, answered in `arcadeModuleMessage`) and uses 20 of Pet World's words when it's opened on its own. A round is 9 papers; **🎟️ 1 ticket per 3 ⭐ papers, up to 3 a round** (plus the game-of-the-day bonus). It never pays coins and never counts toward mastery.

## Where it is in the code

- `src/shared/redPen.js`: misspellings (`misspellingsOf`), papers (`makePaper`, `makeRedPenRound`), choices (`patternChoices`), grading (`tapIsRight`, `spellingIsRight`, `patternIsRight`).
- `src/shared/wordPuzzles.js`: `PUZZLE_INFO.redpen`, `WORD_GAME_CYCLE`, `wordGameForDate`.
- `src/game/game.js`: `makePuzzle('redpen')`, `redPenBodyHTML`, `redPenTap`, `redPenSpell`, `redPenKind`, `redPenGrade`, `redPenBack`, `redPenStackHTML`; `todayPuzzleType` uses the rotation; the Arcade's word request and ticket payout in `arcadeModuleMessage`.
- `src/styles/game.css`: the `rp-*` styles (lined paper, the red circle, the stamp, the stack).

## Tested

Phone size (375px), Playwright with the pretend backend from `scripts/smoke.mjs`, a fake clock and the voice stubbed (`/home/claude/shots/redpen-e2e.mjs`, about 100 checks: some are per paper): the plan's game row and the path's 🎲 Puzzle of the day on 12 school days (Oct 26–29: scramble, code, crossword, search; Nov 2–5 and 9–12: Red Pen Desk, scramble, code, crossword, search, Red Pen Desk, scramble, code: all 5 games in 8 days, none more than twice); Friday Nov 6 is the mastery check. A full warm-up round on Monday Nov 2: 10 papers, a wrong tap (gentle message, the paper came back later "from your pile"), a "Looks good!" paper, a wrong spelling (the right word, picture, word parts, a wrong copy not moving on), a wrong kind, the rest right; every paper's 4 kinds had exactly one right one; the pet's thanks and stamp each time; the end screen with the stack and best streak; the warm-up row ✅ with "⭐ 8 papers"; the day log; nothing mastered. The Arcade: the card, the copy using her words of the week, 9 ⭐ papers paying 3 tickets + 1 game-of-the-day bonus, no coins. No sideways scroll and no page errors.

**Known:** when an Arcade game pays tickets, the Arcade redraws and closes the game (that's how `arcadeModuleMessage` works for every Arcade game), so the copy's own end screen flashes by and the toast "You earned 4 arcade tickets!" is what she sees.
