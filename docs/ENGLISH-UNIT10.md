# English Unit 10: Usage and style (the Style Library)

This unit follows Khan Academy Grammar → *Usage and style* (Unit 10). It lives in building `elaStyle` (🪶 Style Library), course `style`. The theme: the Style Library runs a radio station, WPET. On the radio nobody can see the words, so they have to sound right and fit the listener, and she is the DJ.

**Where the Khan listing came from (Oct 30, 2026):** khanacademy.org pages need JavaScript, so the unit page itself couldn't be read here. The lesson, its videos and its exercises, in order, come from Khan's own sitemap for the lesson (`khanacademy.org/sitemaps/humanities/grammar/usage-and-style/style/sitemap.xml`); the unit sitemap confirms the unit name. Khan's Romanian site lists the same single lesson (`usage-and-style/style`), and a published copy of Khan's question sets names the lesson "Style!" with the same two exercises. No other lesson sitemap could be found for the unit, so as far as could be checked, **Khan's Unit 10 is one lesson with two practices**. Khan's quiz positions and the unit test link could not be confirmed (see below).

## Lessons (Khan's order)

Khan's one lesson, in Khan's order: ▶ The sound of language: alliteration, assonance, and onomatopoeia → ✏️ The sound of language → ▶ The scale of formality → ▶ Under- and overstatement → ▶ Irony → ✏️ Style and technique.

Pet World splits that lesson at its first practice into two blocks, so each practice gets its own quiz and the reward slots don't all open at once (Andy agreed, Oct 30, 2026).

| Pet World block | Khan videos | Practice (Khan's exercise) | Pet World quiz |
|---|---|---|---|
| The sound of language | The sound of language: alliteration, assonance, and onomatopoeia | [The sound of language](https://www.khanacademy.org/humanities/grammar/usage-and-style/style/e/the-sound-of-language) | The sound of language Quiz |
| Style and technique | The scale of formality · Under- and overstatement · Irony | [Style and technique](https://www.khanacademy.org/humanities/grammar/usage-and-style/style/e/style-and-technique) | Style and technique Quiz |

- Skill ids: `soundOfLanguage`, `styleTechnique`; block ids `sound`, `technique`. Skill names are Khan's exercise names.
- Each block opens with a WPET story (`hook`), links to Khan's first video in that block (`KHAN_LINKS.style`), and lists every Khan video in the block as its own ▶ button (`KHAN_VIDEOS.style`).
- **Unit test:** 9 questions per practice (18), the hardest first (`testPer: 9`). She needs 15 to pass, then writes the unit paragraph: a short story for the WPET radio show with alliteration, onomatopoeia, assonance, an overstatement or understatement, and irony, at one level of formality.
- **Khan Academy unit test:** after she passes the Pet World test, the 🎓 card links to Khan's unit test (`KHAN_UNIT_TESTS.style`), behind the same review and grown-up PIN as every unit. **The link is built from Khan's pattern** (`usage-and-style/style/test/usage-and-style-unit-test`) because the page couldn't be opened here, and it isn't certain that Khan gives this one-lesson unit a unit test. Please click it once; if it doesn't open, use the "Unit test" at the bottom of the unit page, or the last practice if there is none.
- **Question bank:** 27 multiple-choice questions per lesson (54 in all; 6 per lesson were added on Oct 30, 2026 after the test-wise bot, so the unit test can keep 12 per lesson test-only), more than the usual 14 because the unit has only two practices (Andy agreed, Oct 30, 2026): 4 at level 1, 10 at level 2, 13–14 at level 3 (about 50%). Level 3 goes past Khan's practice items: sounds, not letters (“Cindy chose cake” has three c-words and no alliteration; “gentle giant” alliterates; “wood” and “moon” don't share a vowel; “goat” and “bowl” do), lines with two devices at once, a word to add assonance where the same letter makes the wrong sound (bobbed vs. rode), the one sentence that slips out of a formal letter and its formal rewrite, understatement vs. a plain statement in the same words, bad luck vs. situational irony, and which detail creates dramatic irony.
- **Newer question types:** 2 scored per practice (sort, tap the words, put in order, two-part) and 1 short answer.
- **📇 Review first:** 11 term cards (`termCards.style`).
- **Style choices:** sound items assume American pronunciation. No question offers both understatement and verbal irony for the same line, because some books treat understatement as a kind of verbal irony.
- **Rewards:** the Style Library set in `LIBRARY_SETS` (docs/REWARDS.md): 🪿 Honk the goose and the 📻 vintage radio when the unit opens, the 2nd slot for passing The sound of language Quiz, the 3rd and 4th for passing the Style and technique Quiz (the quiz rule uses the last quiz when a unit has fewer than three), and 🐅 Tiger Tiger the poet and the 🎷 golden saxophone for the unit test.
- **Kid videos:** none added. English units have no Today's video gate, and no English unit page opens the kid video picker yet (docs/KID-VIDEOS.md), so the unit keeps Khan's videos only.
- **Review list:** `ENGLISH-UNIT10-review.md` (every question with the right answer in bold, and every radio call).

## 🎙️ WPET Style Radio

`src/game/styleRadio.js` (calls, the game engine, the HTML and its CSS) and `renderStyleRadio` in `src/game/game.js`. Pets call the Style Library's radio station with lines for the air; she is the DJ. Each call is one to three steps of three kinds:

1. **Tap:** tap every word in the line that does the job (all the alliterating words, every onomatopoeia, the slang that slipped into a formal letter). She has to find them all, and a wrong tap is a mistake, so guessing doesn't pay.
2. **Pick:** one of three answers (the device, the kind of irony, the formal rewrite, what the speaker really means). Every wrong choice says why.
3. **The formality dial:** tap 3 or 4 messages from the most casual to the most formal; a needle moves along a casual-to-formal dial.

- Four shows of 8 calls (32 calls, 61 steps), easy to hard ("Round 1–3"): Show 1 The Sound Booth (under The sound of language), Show 2 The Formality Dial and Show 3 Twist and Volume (overstatement, understatement, irony) under Style and technique, and Show 4 Prime Time, which mixes everything, also under Style and technique.
- A mistake drops the call (the ON AIR light goes out) and it calls back at the end of the show. On a call's third drop the producer reads her the answer and puts it on the air, so every show ends and she still sees the right answer. A call aired with no mistakes is perfect; perfect calls in a row grow the 📻 listener count faster and show a 🔥 streak.
- **Stars and coins** like Rule Court: stars from perfect calls (`starsFor`: 8 of 8 for 3 stars, 6 for 2); the first play of a show pays 10 + 5 a star, later plays 5 for each new star. Three stars on all four shows makes her **🎙️ Station Manager** (+50, once). Saved in `S.styleRadio` (normalized with the rest of the save); each finished show goes in the day log (`k:'radio'`), under English in the teacher's ledger.
- **In the Arcade too** (`style-radio`): `arcade/style-radio/index.html`, a Vite page that uses the same engine and calls from `styleRadio.js`. It pays tickets (1 per 2 perfect calls, up to 3 a show), never coins, and doesn't change her unit stars or Station Manager.
- The game never counts toward quizzes, tests, mastery or unlocks.

## How it was checked

- `node scripts/verify.mjs`, `node scripts/check-content.mjs` (0 warnings), `node scripts/check-typed.mjs`, `node scripts/question-counts.mjs` (42 Unit 10 questions; levels 8/16/18), `node --check src/game/game.js`, `node scripts/smoke.mjs --site` (7 of 7) and `node scripts/check-math.mjs --site` on the esbuild stand-in build.
- WPET Style Radio, by script: every call checked (each tap word is in the line, tap steps never target every word, three different choices with a reason each, the right choice never the longest, order items distinct, curly apostrophes, 8 calls a show). Every show was played perfectly (3 stars), and 4,000 shows were played at four skill levels (random taps to 95% right): every show ended with all 8 calls on the air and no `undefined` text. This found that a random player could loop forever on a call, which is why the producer now airs a call on its third drop. Balance: a player right 95% of the time gets 3 stars about half the time, at 80% about 1.5 stars.
- Played in the built game at 375px wide (Playwright, local mode with the unit opened), 26 of 26 checks: the unit page (both blocks, 4 Khan videos, 4 show cards, both quizzes and the test), all four shows played to the end in the browser with one deliberate mistake in Prime Time (the call dropped and came back, 7 of 8 perfect, 2 stars), stars and the day-log events saved, the sound quiz (no hint or worked answer shows), the Sticker Book shelf, the Arcade page and the Arcade tile. No sideways scroll and no page errors.
- **Blind review:** no second reviewer was available in this session, so the 42 questions were dumped in a shuffled order with no keys and solved again from that view; every key agreed. Three items were changed (see the review list). A grown-up read-through of the review list is still the real blind check.
- Not run here (no npm packages in the sandbox): `npm run typecheck` (the changed TypeScript files were checked with a temporary tsconfig with no errors), `npm run build` (an esbuild stand-in built every page, including `/arcade/style-radio/`), and `npm run check-links` (the Khan links couldn't be opened).
