# Rewards: unlock animals and decorations by unit

**Status: planned, not built yet.** This is the design. The step-by-step build plan is in [`TASK-rewards.md`](TASK-rewards.md).

## Goal

Rewards follow **learning**, not just time played.

- Each unit (building in town) has its **own themed set** of animals and decorations.
- A set is **visible from day one** but locked until its unit opens. The student can see what's coming.
- Inside an open unit, items unlock by **finishing stations**, **mastering skills**, **streaks**, and **Fact Sprint scores**.
- Most unlocked items are then **bought with coins**. Some are **earned free** and can't be bought.
- Every unit has a **legendary pet and a legendary decoration**, granted for mastering every skill in the unit.

Rewards are **cosmetic only**. They never change problems, scores, hints, or diagnostics.

## Unlock rules

| Rule | Met when |
|---|---|
| `start` | Always |
| `unit` | That unit's building is open (`BUILDINGS[...].open === true`) |
| `station` | The student has served `UNLOCK_AT` (6) orders at that station of that unit |
| `mastery` | Every listed skill has status `mastered` |
| `unitMastery` | Every skill in that unit has status `mastered` |
| `sprint` | `S.sprintBest >= best` |
| `streak` | `S.bestStreak >= n` (longest run of perfect orders) |

- An item is **available** when its unit is open **and** its rule is met.
- Available items with `price: 0` are **granted automatically**. Available items with a price can be **bought**.
- Items in units that aren't open show as **Coming soon**, for example "Opens with the Bakery."

### Existing saves

- Anything a student already owns **stays owned**, even if they haven't met its new rule. Rules only gate buying and granting.
- The unicorn and crown used to be buyable, and now they're unit-mastery rewards. A student who already bought them keeps them.
- When a student signs in, grant anything they've already earned, **without** a celebration pop-up for past achievements. Show pop-ups only for new unlocks from then on.

## The exact item list

Use this list as written. **Do not invent, rename, or re-id items.** Existing ids (`cat`, `bunny`, `tulips`, and so on) must stay the same, because saves store them.

### Emoji compatibility

Some school Chromebooks run older systems, so every new item below uses emoji from Unicode 12 or earlier, with no skin tones and no combined sequences. One **existing** item, `plant` 🪴, is Unicode 13. Keep it, but if it shows as a box on a Chromebook, change only its emoji to 🌿.

### Unit 1: Pet Café (open now)

| id | kind | emoji | name | rule | price |
|---|---|---|---|---|---|
| cat | pet | 🐱 | Mochi the cat | start | 0 |
| bunny | pet | 🐰 | Clover the bunny | start | 40 |
| hamster | pet | 🐹 | Peanut the hamster | start | 60 |
| penguin | pet | 🐧 | Pebble the penguin | station cafe 2 | 100 |
| fox | pet | 🦊 | Maple the fox | station cafe 3 | 150 |
| panda | pet | 🐼 | Dumpling the panda | station cafe 4 | 220 |
| unicorn | pet | 🦄 | Sparkle the unicorn | unitMastery cafe (**legendary**) | 0 |
| tulips | decor | 🌷 | Tulip vase | start | 20 |
| plant | decor | 🪴 | Leafy plant | start | 30 |
| teddy | decor | 🧸 | Teddy bear | start | 45 |
| balloons | decor | 🎈 | Balloons | start | 50 |
| frame | decor | 🖼️ | Fancy painting | mastery basic | 0 |
| cake | decor | 🎂 | Cake display | mastery table, equiv | 90 |
| lights | decor | ✨ | Twinkle lights | streak 5 | 110 |
| rainbow | decor | 🌈 | Rainbow sign | sprint 25 | 160 |
| crown | decor | 👑 | Golden crown | unitMastery cafe (**legendary**) | 0 |

### Units 2 to 8 (Coming soon)

These units don't have skills yet. Until each one is built, its items use only `unit`, `station`, and `unitMastery` rules. When a unit is built, its developer may change **only the rules** (for example, to add a `mastery` rule for a specific skill), never the ids.

| Unit (building id) | Pets (welcome, st 2, st 3, st 4, legendary) | Decorations (welcome, st 2, st 3, st 4, legendary) |
|---|---|---|
| Bakery (`bakery`) | 🦔 Crumb the hedgehog, 🐭 Nibbles the mouse, 🐥 Sunny the chick, 🐻 Honey the bear, 🦝 Sprinkles the raccoon | 🍞 Bread basket, 🥐 Croissant sign, 🥧 Pie window, 🥨 Pretzel garland, 🏅 Baker's gold medal |
| Market Stall (`market`) | 🐐 Gus the goat, 🦜 Kiwi the parrot, 🐢 Slowpoke the turtle, 🦙 Lulu the llama, 🐓 Rocco the rooster | 🍉 Melon stand, 🌽 Corn crate, 🧺 Picnic basket, 🏷️ Price tags, ⚖️ Golden scale |
| Clock Tower (`clock`) | 🦉 Hoot the owl, 🦇 Midnight the bat, 🐿️ Acorn the chipmunk, 🦅 Soar the eagle, 🐉 Ember the dragon | 🕯️ Candles, 🔔 Tower bell, ⏳ Hourglass, 🌙 Moon banner, 🕰️ Golden clock |
| Ice Rink (`rink`) | 🦌 Frost the reindeer, 🐺 Howl the wolf, 🐋 Splash the whale, 🦈 Finn the shark, 🦢 Crystal the swan | ⛸️ Skates, 🧣 Scarf rack, ☃️ Snowman, 🏒 Hockey sticks, 🥇 Gold medal |
| Potion Lab (`potion`) | 🐸 Fizz the frog, 🐍 Noodle the snake, 🦎 Zap the lizard, 🐙 Inky the octopus, 🦋 Glimmer the butterfly | 🧪 Flasks, 🔮 Crystal ball, 📜 Spell scroll, 🕸️ Cobwebs, ⚗️ Golden cauldron |
| Pet Houses (`houses`) | 🐌 Shelly the snail, 🐞 Dot the ladybug, 🐝 Buzz the bee, 🦡 Digger the badger, 🦚 Jewel the peacock | 🌻 Sunflower patch, 🧱 Brick pile, 🏕️ Camp tent, 🏠 Tiny house, 🏰 Castle |
| Pet Show (`show`) | 🐩 Fifi the poodle, 🐈 Duchess the show cat, 🦒 Tallulah the giraffe, 🦓 Stripes the zebra, 🦁 King the lion | 🎀 Ribbons, 📊 Score board, 🎪 Show tent, 🎺 Trumpet, 🏆 Grand trophy |

Rules and prices for every column in units 2 to 8:

| Column | Rule | Price |
|---|---|---|
| welcome | `unit` | 0 (free gift when the unit opens) |
| st 2 | `station` 2 | pets 100, decor 60 |
| st 3 | `station` 3 | pets 150, decor 90 |
| st 4 | `station` 4 | pets 200, decor 120 |
| legendary | `unitMastery` | 0 (**legendary**) |

The ids follow the pattern `<buildingId>_<pet|decor>_<slot>`, where slot is `welcome`, `s2`, `s3`, `s4`, or `legend`. For example, `bakery_pet_welcome` or `show_decor_legend`. The exact TypeScript is in `TASK-rewards.md`.

## What the student sees

- **Unlock pop-up:** when something new becomes available or is granted, show a small celebration card **after** the current order finishes, never in the middle of one. It shows the emoji and a message like "New in the Pet Café: Pebble the penguin!", with **See it** (opens the shop) and **Keep playing** buttons. Queue multiple unlocks and show one at a time.
- **Shop:** one section per building, in town order.
  - Unlocked but unowned items show their price and a Buy button.
  - Locked items show the emoji faded, with 🔒 and a kid-friendly hint: "Serve 6 orders at Recipe Cards," "Master every Pet Café skill," "Get 5 perfect orders in a row," "Reach 25 in the Fact Sprint."
  - Items in closed units show "Opens with the Bakery."
  - Legendary items get a gold border.
- **Town map:** each building tile shows "Collection: 9 of 16." Open buildings also show up to 4 owned decorations from their set along the bottom of the tile.

## What the grown-ups see

- The **progress report** (`renderParent`) gets a Rewards line: collections, legendary items earned, and longest streak.
- No leaderboards or class comparisons, anywhere.

## Rules that keep it healthy

- No random or chance-based rewards.
- Coins are never taken away, except when the student spends them.
- Prices never change based on the student's progress.
- Earned (price 0) items can't be bought, so a student who hasn't mastered the skill can't skip ahead.
