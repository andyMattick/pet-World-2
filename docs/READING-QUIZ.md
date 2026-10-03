# Reading Quiz (Story Corner Library)

## Goal

Students quiz themselves on the books they log in the Story Corner Library. They pick a book and the chapters to be quizzed on, and get multiple-choice, true-or-false, and essay questions built from their own chapter notes.

Because the notes are written by the student, **a grown-up checks every chapter's notes against the book before that chapter can be quizzed.**

## Owner decisions

- Questions are built by templates in the game (no AI). Nothing the student writes leaves the app, and it works in local mode.
- Verification: hosted classes use the teacher app (whoever runs the class: the teacher, or a parent who made an at-home class). Local mode uses a 4-digit grown-up PIN in the progress report.
- Reading quizzes never award Pet Town coins (math stays the only way to earn coins).

## How it works

1. **Notes.** Each chapter has the nine book-report prompts. "Save and send to a grown-up to check" needs the main characters plus at least two more answers. Sending sets `chapter.submittedAt`.
2. **Grown-up check.** States: Not sent yet, Waiting for a grown-up, Checked by a grown-up, Needs fixing.
   - Hosted: the teacher app's student detail has a "Reading Log and Reading Quizzes" card with **Notes match the book** / **Needs fixing**. The verdict is saved in `students.quiz_overrides` as `reading:<bookId>:<chapterId>` = `verified:<submittedAt>` or `revise:<submittedAt>` (the same pattern History projects use, so no new table or migration).
   - Local: Town Hall → progress report → **Grown-up reading check**. The first use asks the grown-up to make a PIN (saved hashed as `S.parentPin`).
   - Editing notes after they were sent clears `submittedAt`, so changed notes must be checked again. A verdict only counts if its timestamp matches the current `submittedAt`.
3. **Quiz.** 📝 Reading Quiz (in the chapter list) → pick checked chapters → up to 10 objective questions, taken round-robin across the chapters, plus 1 essay (2 when more than one chapter is picked).
   - Multiple choice: main character, notable action, conflict, joy or success, setting, vocabulary word, and "In which chapter does this happen?" (2+ chapters).
   - True or false: a note from this chapter (true) or from another chapter or book (false).
   - Wrong answers come from the student's other chapters and books first, then from made-up fallbacks.
   - Essays: responding to the conflict, the setting's effect, the theme, character interactions, or how a character changes across the chosen chapters.
4. **Results.** The objective score shows right away, with the answer and the chapter it came from for each miss. Essays go to the grown-up: hosted `readingEssay:<quizId>` = `verified:<submittedAt>` / `revise:<submittedAt>`; local `quiz.localReview`. The last 20 quizzes per book are kept in `book.quizzes`.

## Files

- `src/game/game.js`: `normalizeReadingQuizzes`, chapter `submittedAt` / `localReview` in `normalize`, `readingChapterState`, `buildReadingQuiz`, `renderReadingQuizSetup`, `renderReadingQuizRun`, `readingReviewHTML` (local PIN review), status in `renderEnglishLibrary` and `readingLedgerHTML`.
- `src/teacher/report.ts`: `readingReviewHTML` in the student detail (`#readingCard`), wired through `saveOverride`.
- `src/styles/game.css`: `.reading-*` styles.

## Limits

- The quiz checks recall of the verified notes, not the book itself. The grown-up check is what ties the notes to the book.
- The local PIN is a speed bump, not security: clearing browser data clears it.
- Spanish: new strings are English for now, like the rest of the untranslated interface.

## Acceptance checks

- [x] Old saves load; books without the new fields default to "Not sent yet".
- [x] Unchecked or "Needs fixing" chapters can't be picked for a quiz.
- [x] Editing a checked chapter sends it back to "Not sent yet".
- [x] Local PIN: first use creates it; a wrong PIN stays locked.
- [x] Quiz played end to end at iPhone SE size (375 × 667) in local mode.
- [ ] Hosted: teacher verifies a chapter, the student sees ✅ after reopening the library, and the essay review round-trips.
