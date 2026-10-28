# 🐾 Pet Hide-and-Seek (English Unit 5, prepositions)

The first version (Oct 2026) was one living room with 10 rounds that took turns between finding the pet and saying where it was. On Oct 28, 2026, the owner asked for harder levels: several relationships at once ("on the table, under the balloon"), a scene where she picks the words, and many more prepositions. She also asked to keep it as **one game with both versions**.

**Where it is:** English Unit 5, as a card under the prepositions block, and the Arcade's 🔗 Link Library Games.

**Code:** `src/game/hideSeek.js` has the levels, the scenes and the drawing. `game.js` (`hideBodyHTML`, `hideFinish`) and `arcade/link-games/index.html` both use it. The living room data stays in `src/game/grammarGames.js`.

## Two versions, 4 levels each

**📍 Find and place:** she reads clues and puts each animal in the right spot.

| Level | What she does |
|---|---|
| 1 Living room | Read where her pet is hiding ("beneath the table"), then tap the spot. 8 rounds. |
| 2 Circus: one clue | "Put the 🐶 dog atop the drum." 2 stages × 4 animals. |
| 3 Circus: two clues | "Put the 🐱 cat to the right of the drum and under the cloud." Both clues are needed. |
| 4 Stack it up | The clues use the animals already placed: "on top of the dog," "alongside the teddy bear." |

**✍️ Say where:** she picks the animal names and the relationship words.

| Level | What she does |
|---|---|
| 1 Living room | Her pet is shown. She builds "My pet is [preposition] [object]." 8 rounds. |
| 2 Who's where? | One thing glows. She builds "The [animal] is [preposition] the glowing thing." Any true sentence is right, and the answer shows what else is true. 8 rounds. |
| 3 Tell the circus | She makes 6 true sentences about the circus, picking the animal, the preposition and the thing. Each sentence needs a different preposition, so she reaches for new words (upon, atop, within, alongside, underneath…). |
| 4 On the move | 10 of 22 small scenes. An arrow shows the movement, and she picks the word: across, through, around, into, out of, onto, off, toward, away from, past, along, up, down, over, against, among, behind, in front of, beyond, across from, below. |

## Words on the circus levels

| Relationship | Words that count |
|---|---|
| in | in, inside, within |
| on | on, on top of, upon, atop |
| under | under, below, beneath, underneath |
| above | above, over |
| next to | next to, beside, by, alongside |
| left or right | to the left of, to the right of |
| between | between |

Any word in the family counts. "Above" also counts for something sitting on top.

## How it stays fair

- **The stage:** a 5 × 4 grid, with 4 layouts.
  - Surfaces: table, drum, box, elephant, clown.
  - Things to be under: table, balloon, umbrella, cloud, star.
  - Containers: box, hat, basket, tub.
- **Where animals go:** on the floor, on something, or in an empty container. Only the parrot can fly.
- **"Under" an animal** means right under it.
- **Clues have one answer.** Relationships are worked out from the grid (`holds`, `truths`). A clue is only used when exactly one spot she can tap fits all of it (`makeClue`).
  - "Above" is never a clue for something she could put it *on*.
  - "To the left of" only comes as a second clue.
- **Say where 2 and 3** accept any sentence that's true in the picture. A separately written checker agreed with the game on 4,520 accepted sentences, with none wrong and none missed.
- **On the move:** a blind reviewer answered all 22 scenes without the key and got all 22 right. Two pictures were redrawn after the review: the dog in front of the tent, and the castle beyond the lake.

## Stars and coins

- **Stars per level:** stars for first-try answers (3 for 90% or better), saved in `S.grammarGames.hide.levels` (`p1`–`p4`, `s1`–`s4`).
- **Old saves:** her stars from the first Hide-and-Seek become her stars for both living room levels.
- **Coins:** 5 the first time she finishes a level, and 5 for each new star.
- **Game stars:** the game's stars are its lowest level's, so Link Library Master needs every level at 3 stars. Anyone who already has Master keeps it.
- **Arcade:** the Arcade copy pays 1 ticket per star and keeps its own level stars in the browser.

## Tested

- 2,000 generated runs of every level: every clue has exactly one right spot, and every level plays to the end.
- Playwright at 375 px: one card, two versions with 8 levels, the old stars carried over, every level played to the end, a true sentence accepted, and no sideways scrolling.
