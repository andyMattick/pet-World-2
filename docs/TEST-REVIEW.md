# Review for the test

A **📇 Review first** button sits next to each English unit test, both the Pet World test and the "Next: the Khan Academy unit test" card. It's optional and never locks a test. It's for when a few days have passed since she last saw the unit.

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

## What the teacher sees

On the Ledger, under English: "📇 English Unit 2: Verbs: test review flashcards · 15 of 18 known on the first try", plus the mixed questions as "(test review) · 6 of 8".

## The cards

`src/shared/termCards.js`. Each card has its term, what it means, an example, and the lesson it belongs to. The wording follows the lesson text in `questionBanks.js`. Only the English units have decks so far. A unit without a deck shows no Review first button.
