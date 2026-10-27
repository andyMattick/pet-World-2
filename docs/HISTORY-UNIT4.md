# History Unit 4: Empires and Belief Systems, checked against Khan (Oct 27, 2026)

Khan's World History Project, Unit 4 (600 BCE to 700 CE). This was checked against Khan's unit page and every lesson page on Oct 27, 2026.

## Structure: now Khan's, lesson by lesson

| Khan lesson | Pet World | Khan practice | Quiz |
|---|---|---|---|
| 4.1 Empires and Belief Systems | Learn (1 video) | none | |
| 4.2 Portable Belief Systems | Practice | Portable Belief Systems | |
| 4.3 Confucianism, Legalism, and Daoism | Learn (1 video) | none | |
| 4.4 Hinduism and Buddhism | Practice (4 videos) | Early Hinduism and Early Buddhism | **Quiz 1** (4.2, 4.4) |
| 4.5 Judaism and Christianity | Practice (5 videos) | Early Judaism and Early Christianity | |
| 4.6 Islam | Practice (2 videos) | The origins of Islam | |
| 4.7 Comparing Portable Belief Systems | Practice | Comparing Portable Belief Systems | |
| 4.8 How Do Religions Grow and Change? | Learn | none | **Quiz 2** (4.5, 4.6, 4.7) |
| 4.9 Persians and Greeks | Practice (7 videos) | Ancient Persia; Classical Greece | |
| 4.10 Mauryan and Gupta | Learn (2 videos) | none | |
| 4.11 Zhou and Qin | Practice (1 video) | Ancient and Imperial China | **Quiz 3** (4.9, 4.11) |
| 4.12 Comparing Ancient Empires | Practice | Comparing Ancient Empires | |
| 4.13 Rome and Han China | Practice (5 videos) | Ancient Rome; Rome and Han China | |
| 4.14 The Rise and Fall of Empires | Learn (2 videos) | none | **Quiz 4** (4.12, 4.13) |
| 4.15 Women in the Ancient World | Practice (1 video) | Women in the Ancient World | |
| Unit test | 📇 review, then the PIN | | |

What changed:

- **Order.** Each Khan lesson is its own block, in Khan's order. Before, the five Learn-only lessons were tucked under other lessons.
- **Names.** The practice names are now Khan's exercise names.
- **Quizzes.** History Units 1–3 have no block quizzes. Unit 4 now has Khan's four quizzes, at Khan's places. Each quiz mixes every practice since the last quiz (`quizSkills`).
  - A Learn-only lesson or a lesson with no quiz (`noQuiz`) opens the next block once its practice is passed (`groupOpen`).
  - To go back to no quizzes, put `noQuizzes:true` back on the `history4` course in `game.js`.
- **Links and videos.** Each lesson's Khan link opens the start of that lesson. Every Khan video in the lesson is listed as its own ▶ button (`KHAN_VIDEOS`, 31 videos). Opening one counts as watching (see `PRACTICE-TIME.md`).

She hasn't started Unit 4, so there's no progress to move. The new lesson blocks have new ids (`overview4`, `confucianism`, `religionsChange`, `persiaGreece`, `mauryaGupta`, `romeAndHan`, `riseFall`). A teacher's custom lesson links for the old Unit 4 blocks would need to be set again.

## Questions: blind review and rewrite

A reviewer answered all 168 questions without the key.

- **Results.** It agreed with every key. There were no wrong keys.
- **Problems found:**
  - **Factual.** Han officials were taught as "chosen by tests." They were mostly *recommended* for virtue and Confucian learning; exams as the main route came with the Sui and Tang. Also: "the same laws in every province" for Rome, "all the city-states" fought Persia, and Luoyang as the only Han capital.
  - **Sensitive.** "Rules from God given through Moses" stated a faith claim as fact.
  - **Giveaways.** About 30 wrong answers were absurd or contradicted the prompt. Six comparison questions had two joke choices.
  - **Level.** Several "what would most likely happen" questions were common sense.
- **Coverage.** Topics that Khan's practice covers were missing: Mauryan and Gupta, the Punic Wars, Caesar, the fall of the West, Pericles and the Peloponnesian War, Babatha, Islam's expansion, Constantine, the Four Noble Truths, and more.
- **Kind of question.** The bank had almost no source questions. Khan's quizzes are built on short sources and reasoning.

What was done:

- **Fixes.** Every flagged item was fixed. Wrong answers are now plausible: true but off-target, the right idea from the wrong empire or era, or a common misconception.
- **New questions.** 52 questions were added: the missing topics, plus 2–3 short **adapted sources** in every lesson. Sources include the Cyrus Cylinder, Behistun, Ashoka's edicts, Pericles' funeral speech, the Analects, the Daodejing, Paul's letters, Pliny's letter on Christians, the Quran, the Res Gestae, Tacitus, the Hou Hanshu, Pliny on silk, Lessons for Women, and Babatha's papers. There are also real-event "which best explains" questions and a continuity-and-change question.
- **Size.** The bank grew from 168 to 220 questions, 17–20 per practice, at about 34% level 1, 36% level 2 and 30% level 3.
- **Length check.** No right answer is the longest choice. `check-content` reports 0 warnings.
- **Typed questions.** One typed-question choice ("Taking the imperial exams") and the Han official's role card were fixed for the same Han-exam error. The Cyrus role card no longer says his empire reached Egypt (that was his son Cambyses).

**Not done yet:** a second blind review of the 52 new and rewritten questions. They're all in `docs/history4-review.md` with the right answers in bold. Please read that list before applying.

**Game.** ⚖️ Pax Oeconomica, the trade strategy game, has a card at the bottom of the unit page. Unit 4 plays the Classical empires (Rome, Han, Parthia, Maurya, Kush, Athens). See `PAX-OECONOMICA.md`.
