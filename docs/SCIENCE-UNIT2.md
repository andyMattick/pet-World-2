# Biology Unit 2: Organism Growth and Reproduction (the Petting Zoo)

Follows Khan Academy's middle school biology unit "Organism growth and reproduction". The student is a tour guide at the
Pet World Petting Zoo (building `bioCells`, course `bio2`). It opens after the Biology Unit 1 test, like every unit.

Everything here is built ahead of time. Nothing calls an AI while the student plays.

## Lessons

| Block | Lessons | Quiz |
|---|---|---|
| Traits, reproduction, and animal behavior | Understand / Apply: Traits and reproduction; Understand / Apply: Animal behavior and reproductive success | Quiz 1 (`bio2:quiz:traits`) |
| Plant reproduction and growth in the environment | Understand / Apply: Plant structures and reproductive success; Understand / Apply: Organism growth and the environment | Quiz 2 (`bio2:quiz:growth`) |

- Unit test: 3 questions per lesson (24), pass at 20, plus the unit essay (the Petting Zoo manager paragraph).
- Each lesson has about 12 multiple-choice questions tagged level 1–3, plus 3 newer-type questions (`TYPED_QUESTIONS.bio2`).
- **Why it matters.** Each block opens with a true story (group `hook`): the Gros Michel banana and Panama disease; the 2014 Toledo, Ohio water crisis. Each lesson has a one-line “Why care?” (skill `why`).
- Role play: `ROLE_CARDS` puts the student at the Lamb Nursery, Feed Garden, Chick Hatchery, Nesting Barn, Pollinator Patch, Orchard Walk, Weigh-In Station and Duck Pond. These use the stage scenes `barn`, `garden` and `pond`.
- 📇 Review first: 22 term cards (`TERM_CARDS.bio2`).
- Khan links: none are confirmed yet, so each block shows the Khan search. A teacher can paste exact links in Lessons.

## 🧪 Labs in the browser (`src/game/scienceSims.js`)

A lab card sits under the block it goes with. Each lab ends with two “What did you find?” questions. Getting both right finishes the lab: +15 coins the first time and a 🧪 line in the day log (Ledger, Science).

- **🏝️ Clone Island vs. Mix Island** (block 1). The student picks the weather for 8 seasons.
  - Clone Island has copies of one heat-proof plant and doubles every season.
  - Mix Island is seed-grown with mixed traits and grows by half.
  - A fungus or a cold snap wipes out the clones; Mix Island keeps some plants.
- **🐣 Parenting Strategy Lab** (block 1). There are 100 energy units to spread over a family.
  - Find a family size that works on a sandy beach (best: about 100, like sea turtles), in a forest nest (about 5, like robins) and on Antarctic ice (1, like emperor penguins).
  - “Run 20 seasons” checks whether the strategy works there.
- **🦆 Duck Pond Lake Lab** (block 2). Set the fertilizer, the summer heat and a grass strip, then run 12 weeks.
  - A chart shows algae, oxygen and fish.
  - Missions: cause a bloom; with Lots of fertilizer, keep 70+ fish. The grass strip does it in a normal summer; a heat wave still causes a fish kill.

Progress is saved in `S.sims[id] = {done, runs, homes, missions}`.

## Projects and kitchen labs

These are sent to the teacher and use the same review flow as the other projects (Projects tab; Verify or Request revision, which puts the project under Fix first).

| Key | Title | Notes |
|---|---|---|
| `bio2` | Field Guide Page: Raising the Next Generation | ends with a photo of a hand-drawn page |
| `bio2lab` | Bean Sprouts in Light and Dark | about 10 days; a data table of heights with a live chart. Dark-grown sprouts usually grow taller, thin and pale, which is a good surprise for a hypothesis. |
| `bio2lab2` | Paper Helicopter Seeds | an afternoon; 3 wing lengths × 3 timed drops |
| `bio2lab3` | Kitchen Clones | about a week; regrow green onions in water |

Each lab's summary carries its safety notes.

Two step kinds were added for these labs:

- `kind:'table'`: a grid of boxes (`cols`, `num` for the number columns, `rows`, optional `rowLabels`) with a live line chart. It is saved as text the teacher can read, one row per line, with cells joined by ` | `.
- `kind:'photo'`: one photo, shrunk to a small JPEG (140 KB or less) and kept with the answers, like the drawing steps.

`projectKeys` now also finds `<course>lab2` and `<course>lab3`.

## Facts checked (October 2026)

- Gros Michel bananas were clones. Panama disease (Fusarium) ended them commercially, and growers switched to Cavendish by the 1960s. TR4 now threatens Cavendish.
- Toledo, Ohio, August 2014: about 400,000 people had a 3-day do-not-drink order because of a Lake Erie algae bloom toxin (microcystin).
- Emperor penguin fathers incubate the single egg for about two months without eating.
- Velcro: George de Mestral, after burrs stuck to his dog (1941).
- USDA: about one in three bites of food depends on pollinators.
