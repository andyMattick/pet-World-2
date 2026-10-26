# English Unit 6: Punctuation (the Superhero Factory)

This unit follows Khan Academy Grammar → *Punctuation: end-of-sentence punctuation, the comma, and the apostrophe*. It lives in building `elaPunct` (🦸 Superhero Factory), course `punctuation`. The theme: every hero in the factory is built from a sentence, and punctuation is the power source.

## Lessons

| Block | Lessons | Quiz |
|---|---|---|
| End marks, the comma, and lists | Three ways to end a sentence · Meet the comma · Punctuating lists | End marks and commas Quiz |
| Commas in space and time | Salutations, valedictions, dates, and addresses · Commas and introductory elements | Commas in space and time Quiz |
| More ways to use commas | Commas in dialogue, tag questions, direct address, and yes-or-no responses · Appositives | More ways to use commas Quiz |
| Apostrophes and contractions | Meet the apostrophe · Introduction to contractions · Apostrophes and plurals | Apostrophes and contractions Quiz |
| The possessive, and its versus it’s | Introduction to the possessive · Advanced (plural) possession · Choosing between its and it’s | Possessives Quiz |

- Each block opens with a superhero story (`hook`) and links to its Khan video. The last block also links Khan's its/it’s video.
- **Unit test:** 1 question per lesson (13). She needs 11 to pass, then writes the unit paragraph: design a new hero, with a question, an exclamation, a list, an introductory phrase, an appositive, a contraction, and a possessive.
- **Khan Academy unit test:** after she passes the Pet World test, the 🎓 card links to Khan's unit test.
- **Question bank:** 13–14 multiple-choice questions per lesson (182 in all), levels 1–3, about 40% at level 3.
- **Newer question types:** 2 scored per lesson (tap the words, sort, select all, two-part, put in order, type the answer) and 1 short answer.
- **📇 Review first:** 16 term cards.
- **Style choices:** Pet World uses the serial (Oxford) comma and says so in the lesson; no question depends on it unless the prompt says so. Questions avoid the parts style guides disagree on (commas after short introductory phrases, the possessive of names ending in s).
- **Review list:** `ENGLISH-UNIT6-review.md` (every question with the right answer in bold).

## ⚡ Punctuation Power Lab

`src/game/heroLab.js` (missions) and `renderHeroLab` in `src/game/game.js`. A card sits under each block, with that block's Power Pack of 6 missions (30 in all).

- Each mission is a sentence with glowing spots. Tapping a spot swaps its punctuation (or a word like its / it’s, your / you’re), and the hero card changes right away: a period gives calm Reporter Ray, an exclamation point gives Alarm Blaze, a missing comma turns a dinner invitation into the Hungry Monster, the hero’s capes are one hero’s, the heroes’ capes are the whole team’s. A combination that doesn't make sense shows the Glitch robot.
- She launches when the hero matches the mission. A wrong launch says to try another mark; a second wrong launch shows the right hero. After each mission, **👀 Every version of this sentence** shows what each mark does.
- **Stars and coins** like the Unit 5 games: stars from first launches; the first play pays 10 + 5 a star, later plays 5 for each new star. Three stars in all five packs makes her a **🦸 Factory Hero** (+50, once). Saved in `S.heroLab`; each finished pack goes in the day log (`k:'hero'`), under English.
- **In the Arcade too** (`power-lab`): `arcade/power-lab/index.html`, the same missions from `heroLab.js`. It pays tickets (1 per 2 missions on the first launch, up to 3 a pack), never coins, and doesn't change her unit stars or Factory Hero. See `ARCADE-GAMES.md`.
