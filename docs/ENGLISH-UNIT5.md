# English Unit 5: Prepositions and Interjections (the Link Library)

This unit follows Khan Academy *5th and 6th grade grammar* → Prepositions and interjections. It lives in building `elaConj` (🔗 Link Library), course `prepositions`.

## Lessons

| Block | Lessons | Quiz |
|---|---|---|
| Prepositions and prepositional phrases | Meet the preposition · Prepositional phrases · What prepositions tell (time, place, direction, how; since/for, between/among) · Subject-verb agreement with prepositional phrases · ⭐ Challenge: Preposition or adverb? | Prepositions Quiz |
| Interjections | Meet the interjection · Punctuating interjections (strong → !, mild → comma) · Mixed practice | Interjections and mixed practice Quiz |

- **Unit test:** 2 questions per lesson (16). She needs 13 to pass, then writes the unit essay: directions to a favorite spot, with five prepositional phrases and an interjection.
- **Khan Academy unit test:** after she passes the Pet World test, the 🎓 card links to Khan's unit test.
- **Question bank:** about 12 multiple-choice questions per lesson, levels 1–3, many of them tricky: *but* and *like* used as prepositions; *since* vs. *for*; *one of*; *each of*; two phrases before the verb.
- **Newer question types:** 3 per lesson. Most are "Tap the words" (find the prepositions or the phrase to cross out); there are also sort, two-part and short answer.
- **📇 Review first:** 14 term cards.
- **"Preposition or adverb?"** goes past Khan's unit, as a challenge.

## 🎮 Games (in the browser, `src/game/grammarGames.js`)

The game cards sit under their block.

**Stars and coins:**
- Each round is right on the first try or not; first-try answers earn the stars. Three stars takes 90% (all 8 comic panels).
- The first play pays 10 coins + 5 a star. Later plays pay 5 for each new star.
- Three stars in all three games makes her a **🏅 Link Library Master** (+50, once).
- Each finished game goes in the day log, under English.

**Since Oct 28, 2026, Pet Hide-and-Seek has two versions with 4 levels each**: 📍 Find and place and ✍️ Say where. The living room below is level 1 of each, and the circus levels bring in many more prepositions. See `HIDE-AND-SEEK.md`.

**🐾 Pet Hide-and-Seek** (10 rounds) uses a living room with 10 hiding spots. Each spot accepts every correct phrase for it, for example under / beneath / below the table. The rounds take turns:
- **Find:** read where her pet is hiding and tap the spot.
- **Tell:** see her pet and build the phrase from two drop-downs (preposition + object).

**✂️ Cross It Out** (10 sentences, each harder than the last):
- She taps every word of every prepositional phrase to cross it out. Some phrases come after the verb, and some sentences have two before the verb.
- Then the subject lights up, and she picks the verb that agrees with it.
- If she misses twice, the phrases are shown.

**💥 Comic Strip Studio** (8 panels): she picks an interjection that fits the feeling, plus ! or a comma.
- Strong-feeling panels need !, mild ones need a comma, and some accept either.
- The finished comic shows her pet's speech bubbles.

## Projects (sent to the teacher, Projects tab)

| Key | Title | What she does |
|---|---|---|
| `prepositions` | Treasure Hunt Directions | Hides something at home and writes directions with 8+ prepositional phrases. A grown-up follows them. She fills a phrase table, writes what happened and fixes the confusing phrase, and adds a photo. |
| `prepositionslab` | Field Notes: Prepositions in the Wild | Finds 10 phrases in her own reading book (table), looks for a pattern, finds 2 interjections, and rewrites one sentence with a different preposition. |
| `prepositionslab2` | Make a Comic: Interjections in Action | Draws a 4-panel comic on paper with 4 interjections (2 strong, 2 mild) and 3 prepositional phrases, adds a photo, and explains her punctuation. |

English projects are saved with History's (`S.historyProjects`). `projectStore` now sends only `bio…` to the science store.

## 🔗 Daily prep test: Name all 48 prepositions

The recall game the user made (type all 48 prepositions against the clock) is served at `public/prep-recall/index.html`.

**While she is in this unit** (the Link Library is open and its unit test isn't passed; English opens every library through the one she's on, plus any the teacher opens for the class):
- It is the first row of Today's plan every day: **🔗 Prep test: name all 48 prepositions**.
- The row is ✅ once she finds all 48 that day (hints and alphabetical blanks are allowed). Unfinished days don't carry over.
- It also has a card on the unit page.
- It isn't listed in the Arcade.

**The rest of the time** it is an Arcade game (**Name All 48 Prepositions**), on or off in the class Arcade settings like any other.

**Wherever she plays:**
- The page posts `{type:'prep:result'}` to Pet World.
- The round is kept in `S.prepRecall` (last 30 rounds and her best time) and goes in the day log under English.
- Coins: 10 the first time she finishes on a day, and 5 for a new best time.
- The page still keeps its own history table and CSV download on that device.

## In the Arcade too

Since Oct 26, 2026, the three games are also one Arcade game, 🔗 Link Library Games (`link-games`, `arcade/link-games/index.html`). It uses the same rounds from `src/game/grammarGames.js`. It pays tickets (1 per star, up to 3 a game), never coins, and doesn't change her unit stars or Link Library Master. See `ARCADE-GAMES.md`.
