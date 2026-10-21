# 🔐 Tests need a review and a grown-up

Owner decision (Oct 21, 2026): she never starts a unit test without the teacher knowing.

## The order, for every unit in every subject

1. **📇 Review** for the Pet World test. A grown-up enters the PIN to start it.
2. **Pet World unit test.** Only after the review, and a grown-up enters the PIN again.
3. **📇 Review** for the Khan Academy test (the same review). PIN to start it.
4. **Khan Academy unit test.** Only after that review, and the PIN again. The game opens Khan's page in a new tab.

There is no skip button, only Cancel. Each try needs its own review: starting a test uses up the review (`S.testReady["<unit>:pw"]` or `":khan"`), so a retake needs a new review first. Every PIN OK and every finished math review goes in the day log ("🔐 Grown-up OK: …"), so it shows in the teacher's Ledger.

## What the review is

- **English, History, Biology:** the existing review (docs/TEST-REVIEW.md): flashcards of the unit's terms, then 8 mixed questions. Units with no term cards go straight to the 8 questions. Finishing the 8 questions makes the test ready, whatever the score (the result still says whether she looks ready).
- **Math shops:** 8 practice orders from every station of the unit. Finishing all 8 makes the test ready; closing early doesn't.
- **Math Khan tests:** after the shop's Unit Test is passed, the Unit Test card shows "Next: the Khan Academy unit test" with the review and a button for each Khan unit that goes with the shop (KHAN-SETUP.md). Each Khan unit ends with its unit test. Hidden when Khan is off.

## The PIN

The grown-up PIN (the same as the progress report and the theme question). If there isn't one yet, the teacher lock PIN works; with neither, the first PIN typed becomes it. Look only (docs/LOOK-ONLY.md) never asks.

## Code

`askGrownUp()` (the PIN card), `gatedTestReview`, `gatedPetWorldTest`, `gatedKhanTest`, `gatedUnitReview`, `gatedUnitTest`, `markTestReady` / `useTestReady`, and `MATH_KHAN_UNITS` in `src/game/game.js`.
