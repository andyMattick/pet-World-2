# Biology Unit 3: Matter and Energy in Organisms (the Greenhouse)

Follows Khan Academy's middle school biology **Unit 3: Matter and energy in organisms** (photosynthesis and cellular
respiration), the unit after Unit 2 (Organism growth and reproduction) in the same course. The student is a tour guide at
the Pet World Greenhouse (building `bioEnergy`, course `bio3`). It opens after the Biology Unit 2 test, like every unit.

Everything here is built ahead of time. Nothing calls an AI while the student plays.

## Lessons (Khan's order, checked Oct 29, 2026)

| Khan lesson | Pet World practice | Videos (`KHAN_VIDEOS.bio3`) | Quiz |
|---|---|---|---|
| 3.1 Photosynthesis in organisms (`photo3`) | Understand / Apply: Photosynthesis in organisms | Photosynthesis in organisms | none |
| 3.2 Food and energy in organisms (`food3`) | Understand / Apply: Food and energy in organisms | Food and energy in organisms; Cellular respiration | Quiz 1 (`bio3:quiz:food3`, all 4 practices) |
| Unit 3 phenomenon-based activity (`activity3`) | Learn only: Activity: How can measuring cellular respiration help us reach a fitness goal? | none (an article) | |

- Khan's lesson pages were read from Khan's sitemaps (the unit page itself needs JavaScript). Each lesson also has a “Key points” article.
- **Not confirmed:** where Khan puts its quiz in this unit. Pet World uses one quiz after lesson 3.2, the way Unit 2 has a quiz after every two lessons.
- Khan links: each lesson's `KHAN_LINKS.bio3` entry opens the lesson's first video (or the activity); every video is its own ▶ button.
- Khan unit test: `KHAN_UNIT_TESTS.bio3` (KHAN-SETUP.md).
- Unit test: 5 questions per practice (20), pass at 16, plus the unit paragraph (follow energy and matter from sunlight to a hummingbird).
- Each practice has 14 multiple-choice questions (46% at level 3) plus 3 newer-type questions (`TYPED_QUESTIONS.bio3`). Review list: `bio3-review.md`.
- **Why it matters.** Lesson 3.1 opens with van Helmont's willow (1600s); lesson 3.2 with Apollo 13's carbon dioxide filters (April 1970). Each practice has a “Why care?” line.
- Role play: `ROLE_CARDS` puts the student at the Greenhouse's Sunlight Bench, Plant Lab, Hummingbird Feeder and Fitness Trail (stage scene `greenhouse`).
- 📇 Review first: 17 term cards (`TERM_CARDS.bio3`).

## 🌺 Greenhouse Keeper (the unit's game)

A card at the bottom of the unit page opens it, and it is in the 🕹️ Arcade. See `GREENHOUSE-KEEPER.md`.

## 🔬 Hands-on and projects

- Hands-on at home (`src/shared/handsOn.js`, `HANDS-ON.md`): 🫧 Leaf Bubbles in the Sun and 🍃 The Leaf in the Shade (lesson 3.1), 🥬 Red Cabbage Breath Test (lesson 3.2).
- Projects (sent to the teacher, same review flow as the other projects):

| Key | Title | Notes |
|---|---|---|
| `bio3` | Greenhouse Poster: Follow the Energy and the Matter | ends with a photo of a hand-drawn poster with energy and matter arrows |
| `bio3lab` | Experiment: Yeast Balloons at Three Temperatures | about 30 minutes; a data table of balloon sizes every 5 minutes with a live chart. Safety in the summary (warm tap water only, never boiling). |

## Facts checked (October 2026)

- Van Helmont's willow: about 5 lb planted in 200 lb of dried soil, about 169 lb after five years of watering; the soil lost about 2 oz. Most of a plant's dry matter comes from carbon dioxide.
- Joseph Priestley, 1771: a sprig of mint restored the air in a sealed jar so a mouse could live in it.
- Apollo 13, April 1970: the lunar module's lithium hydroxide filters could not keep up with three astronauts; engineers improvised an adapter (plastic bags, cardboard, a sock, duct tape) to fit the command module's square filters into the round sockets.
- When the body uses fat, most of the matter leaves as exhaled carbon dioxide (about 84%) and the rest as water (Meerman and Brown, BMJ, 2014).
