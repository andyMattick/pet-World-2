# Review for the test

A **📇 Review first** button sits next to each English unit test, both the Pet World test and the "Next: the Khan Academy unit test" card. Since Oct 21 it's required before every test, with a grown-up's PIN: see TEST-GATE.md.

## Step 1: flashcards

- One card for each term the unit uses: gerund, aspect, modal verb, antecedent, coordinate adjectives, and so on.
- The word is on the front. She says what it means, taps to flip, then picks **✅ I knew it** or **😕 Still learning**.
- A "still learning" card comes back a few cards later. The deck ends when she knows every card.
- **Show the meaning first** turns the cards around: the meaning and example are on the front, and she names the word. That's closer to how Khan asks.
- Cards she missed before come first the next time (`S.cardStats` in the save).
- Some cards are marked as words with no Pet World lesson that Khan's test may still use (gerund, infinitive, antecedent, modifier).
- Keyboard: Enter or Space flips, 1 = still learning, 2 = knew it.

## Step 2: 8 mixed questions

- Questions from every lesson in the unit, leaning toward harder ones, like a short practice test.
- The results screen lists the lessons she missed as **practice** buttons, then **Start the Pet World test** (or **Open the Khan test** if she came from the Khan card) and **8 more questions**.
- The answers count toward the per-question miss rates and the lesson's practice history. They don't count toward any grade.

## She sees that she finished it (Oct 26, 2026)

After she finishes a review, the unit page says so next to the button. For example: "✅ Review finished today: all 8 mixed questions, 6 right the first time, then went back over the 2 you missed." The button then reads "📇 Do the review again" (before, it read "✅ Reviewed · review again", which looked like she hadn't finished). The line stays after the test uses up the review, so she can see when she last finished one. Math unit reviews show the same line ("all 8 review orders"). Saved as `S.reviewDone["<course or shop>:pw" or ":khan"]` = `{t, right, total, fixed}` (`markReviewDone`, `reviewDoneHTML`).

## What the teacher sees

On the Ledger, under English: "📇 English Unit 2: Verbs: test review flashcards · 15 of 18 known on the first try", plus the mixed questions as "(test review) · 6 of 8".

## The cards

`src/shared/termCards.js`. Each card has its term, what it means, an example, and the lesson it belongs to. The wording follows the lesson text in `questionBanks.js`. Only the English units have decks so far. A unit without a deck shows no Review first button.

## Teach what she missed (Oct 21, 2026)

The review teaches, it isn't just another quiz. It's the same review before the Pet World test and the Khan test.

- **English, History, Biology:** a wrong answer shows the lesson for that skill right away (its short lesson, the group's "learn" line, and its video or Khan link). After the 8 questions, every lesson she missed comes back in a **fix-up round**: the lesson first, then a new question on it. A miss shows the lesson again and adds another new question (up to 3 per lesson). The test is ready only after the fix-up round. The result screen shows her first-try score and which lessons she went back over.
- **Math:** a miss already brings the step hints, the mix-up note and practice pop-ups. After the 8 orders, each skill she didn't get perfect comes back as fix-up orders (her pet explains the idea first; Hint stays available) until she gets one perfect, up to 10 extra orders.
