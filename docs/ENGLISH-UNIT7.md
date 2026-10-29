# English Unit 7: Colons, semicolons, and more (the Pause Library)

This unit follows Khan Academy Grammar → *Punctuation: the colon, semicolon, and more* (Unit 7; lesson list, exercise order and links checked on khanacademy.org, Oct 29, 2026). It lives in building `elaColon` (⏸️ Pause Library), course `colons`. The theme: in the Pause Library, every mark tells the reader how to stop, and the book doctor at the repair desk fixes sentences that lost their marks.

## Lessons (Khan's order)

| Khan lesson (block) | Practices (Khan's exercises, in order) | Pet World quiz | Khan quiz |
|---|---|---|---|
| Introduction to colons | Introduction to colons | Colons Quiz | |
| Introduction to semicolons | Introduction to semicolons · Using semicolons and commas · Using semicolons and colons | Semicolons Quiz | Quiz 1 (covers colons and semicolons) |
| Formatting styles | Italics, underlines, and quotation marks · Introduction to parentheses | Formatting styles Quiz | |
| Hyphens, dashes, and ellipses | Introduction to dashes · Dashes and hyphens · Introduction to ellipses | Hyphens, dashes, and ellipses Quiz | Unit test |

- Each block opens with a library story (`hook`) and links to Khan's first video in that lesson (`KHAN_LINKS.colons`). Khan's other videos in each lesson are listed under the block as extra lessons: The colon as a separator; Semicolons and complex lists; Using quotation marks in titles; Parentheses; Hyphens versus dashes; Ellipses.
- **Unit test:** 2 questions per lesson (18), the hardest first (`testPer: 2`). She needs 15 to pass, then writes the unit paragraph: an invitation to the library's new reading room with a colon, a semicolon, two titles, parentheses, a dash, and a hyphenated describing word.
- **Khan Academy unit test:** after she passes the Pet World test, the 🎓 card links to Khan's unit test (`KHAN_UNIT_TESTS.colons`), behind the same review and grown-up PIN as every unit.
- **Question bank:** 14 multiple-choice questions per lesson (126 in all): 3 at level 1, 5 at level 2, 6 at level 3 (43%). Level 3 items match Khan's hardest practice items: choosing between a colon, a semicolon and a comma when two marks look possible, comma splices, lists with semicolons, title formats for parts of whole works, punctuation around parentheses, a hyphen and a dash in one sentence, and ellipses that change a quotation's meaning.
- **Newer question types:** 2 scored per lesson (tap the words, sort, select all, two-part, type the answer) and 1 short answer.
- **📇 Review first:** 13 term cards (`termCards.colons`).
- **Style choices:** dashes are closed em dashes (—) with no spaces. An ellipsis inside a quotation has a space on each side (“The zoo … has”); in speech it sits right after the word (“Well… I guess so”). Titles are typed in italics; on screen, questions ask how a title *should* look rather than showing italics. Questions avoid places where style guides disagree (a semicolon before *and*, hyphens in compound words after the noun other than ages, the period after a closing quotation mark outside American English).
- **Review list:** `ENGLISH-UNIT7-review.md` (every question with the right answer in bold, and every Book Repair book).

## 📚 Book Repair Desk

`src/game/bookRepair.js` (books) and `renderBookRepair` in `src/game/game.js`. A card sits under each block, with that block's shelf of 7 books (28 in all).

- Each book has a sentence with a mark (or a title style, or a hyphenated word) torn out. She picks the fix from 2 or 3 choices. A right fix shows the sentence repaired and why it works. A wrong fix tells her exactly why that mark doesn't fit, and the book goes to the back of the cart to try again later in the shift, so every shift ends with every book shelved.
- **Stars and coins** like the Unit 6 Power Lab: stars from books fixed on the first try (`starsFor`); the first play of a shelf pays 10 + 5 a star, later plays 5 for each new star. Three stars on all four shelves makes her **📚 Head Librarian** (+50, once). Saved in `S.bookRepair`; each finished shelf goes in the day log (`k:'repair'`), under English.
- **In the Arcade too** (`book-repair`): `arcade/book-repair/index.html`, a Vite page that uses the same books from `bookRepair.js`. It pays tickets (1 per 2 books fixed on the first try, up to 3 a shelf), never coins, and doesn't change her unit stars or Head Librarian. See `ARCADE-GAMES.md`.
- The game never counts toward quizzes, tests, mastery or unlocks.

## How it was checked

- `npm run verify`, `node scripts/check-content.mjs` (0 warnings), `node scripts/check-typed.mjs`, `node scripts/question-counts.mjs` (126 Unit 7 questions), and `node --check src/game/game.js`.
- Every book in the Book Repair Desk was rendered with its right fix and with the gap (a Node script), to check that each sentence reads correctly and the choices are distinct.
- Every scored item was self-checked against Khan's rules; items where two marks could be argued were rewritten. A grown-up read-through of the review list is the blind review.
- Not run here (no npm packages in the sandbox): `npm run typecheck`, `npm run build`, `npm run smoke`, and a look at the unit and the game at phone size.
