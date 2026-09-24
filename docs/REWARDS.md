# Reward system expansion: unlock animals and decorations by unit

Build spec for expanding Pet Town's rewards. It's written so Claude Code (or any developer) can implement it directly. Read the whole file before starting.

## Goal

Rewards should follow **learning**, not just time played. Today, coins buy any pet or decoration. After this change:

- **Each unit (building) has its own themed set** of animals and decorations. The set is locked until the student reaches that unit.
- **Some items are earned, not bought.** Mastering a skill, finishing a station, or mastering a whole unit gives the student an item for free.
- **Coins still matter.** Once a set is unlocked, most of its items are bought with coins as they are today.
- **Every unit has one legendary item** for mastering all of its skills. It's the thing students chase.

Keep rewards **cosmetic only**. Pets and decorations never make problems easier or give points. That keeps the diagnostics fair and teachers comfortable.

## Where things are now

| What | Where |
|---|---|
| `PETS`, `DECOR` arrays | `src/game/game.js` (top of file) |
| Owned items | `S.owned` (pet ids), `S.decor` (decoration ids), `S.pet` (active helper) |
| Shop screen | `renderShop()` and its click handler in `src/game/game.js` |
| Town square display | `renderHome()` fills `#plazaDecor` |
| Skill mastery | `skillStatus(skill)` (uses `statusFromRecent` from `src/shared/registry.ts`) |
| Station progress | `S.cafe.st[stationId]` (orders served at each station) |
| Buildings (units) | `BUILDINGS` in `src/game/game.js` |

## 1. Move rewards into the shared registry

Replace the `PETS` and `DECOR` arrays with one `REWARDS` list in `src/shared/registry.ts`. The dashboard can then show what each student has earned. Keep every existing id so current saves still work.

```ts
export type UnlockRule =
  | { type: 'start' }                                   // available from the beginning
  | { type: 'unit'; unit: string }                      // the unit's building is open (e.g. 'cafe', 'bakery')
  | { type: 'station'; unit: string; station: number }  // served UNLOCK_AT orders at that station
  | { type: 'mastery'; skills: string[]; count?: number } // mastered `count` of these skills (default: all)
  | { type: 'unitMastery'; unit: string }                // every skill in the unit mastered
  | { type: 'sprint'; best: number }                    // personal best in the Fact Sprint
  | { type: 'streak'; n: number };                      // perfect orders in a row

export interface Reward {
  id: string;            // stable forever: saves store this
  kind: 'pet' | 'decor';
  emoji: string;
  name: string;          // "Clover the bunny"
  unit: string;          // which building's set it belongs to
  unlock: UnlockRule;    // when it appears (or is granted)
  price: number;         // 0 = granted free when unlocked
  legendary?: boolean;
}
```

Each unit's skills should also be listed in the registry, so `unitMastery` knows what to check. Add a `UNITS` map, for example `UNITS.cafe = ['basic','tape', …,'ppw']`, and fill it in as each shop is built.

## 2. The unit sets

Use emoji that render on Chromebooks and older iPads: Unicode 13 or earlier, no skin tones, no combined emoji. Prices assume about 80 to 120 coins per 5-customer shift, so a normal item costs one or two shifts.

### Unit 1: Pet Café (live now)

Keep all existing items so nobody loses anything. Only a few rules change:

| id | Item | Rule | Price |
|---|---|---|---|
| cat | 🐱 Mochi the cat | start | 0 |
| bunny | 🐰 Clover the bunny | start | 40 |
| hamster | 🐹 Peanut the hamster | start | 60 |
| penguin | 🐧 Pebble the penguin | station cafe/2 | 100 |
| fox | 🦊 Maple the fox | station cafe/3 | 150 |
| panda | 🐼 Dumpling the panda | station cafe/4 | 220 |
| unicorn | 🦄 Sparkle the unicorn | unitMastery cafe (**legendary**) | 0 |
| tulips, plant, teddy, balloons | existing decorations | start | as now |
| frame | 🖼️ Fancy painting | mastery ['basic'] | 0 (earned) |
| cake | 🎂 Cake display | mastery ['table','equiv'] | 90 |
| lights | ✨ Twinkle lights | streak 5 | 110 |
| rainbow | 🌈 Rainbow sign | sprint 25 | 160 |
| crown | 👑 Golden crown | unitMastery cafe | 250 |

**Migration rule:** if a save already owns an item whose rule it hasn't met, it keeps the item. Rules only gate buying.

### Unit 2: Bakery

| id | Item | Rule | Price |
|---|---|---|---|
| hedgehog | 🦔 Crumb the hedgehog | unit bakery | 0 (welcome gift) |
| mouse | 🐭 Nibbles the mouse | unit bakery | 60 |
| chick | 🐥 Sunny the chick | station bakery/2 | 120 |
| bear | 🐻 Honey the bear | station bakery/3 | 180 |
| raccoon | 🦝 Sprinkles the raccoon (legendary) | unitMastery bakery | 0 |
| bread | 🍞 Bread basket | unit bakery | 30 |
| croissant | 🥐 Croissant sign | unit bakery | 45 |
| pie | 🥧 Pie window | mastery (fraction division skills) | 0 |
| pretzel | 🥨 Pretzel garland | streak 5 | 90 |
| goldwhisk | 🏅 Golden rolling pin | unitMastery bakery | 250 |

### Unit 3: Market Stall

Animals: 🐐 goat (welcome gift), 🦜 parrot, 🐢 turtle, 🦙 llama, and 🐓 a legendary rooster. Decorations: 🍉 melon stand, 🌽 corn crate, 🧺 picnic basket, 🏷️ price tags (earned for the "better buy" skill), and ⚖️ a golden scale (unit mastery).

### Unit 4: Clock Tower

Animals: 🦉 owl (welcome gift), 🦇 bat, 🐿️ squirrel, 🦅 eagle, and 🐉 a legendary dragon. Decorations: 🕯️ candles, 🔔 bell, ⏳ hourglass (earned for order of operations), 🌙 moon banner, and 🕰️ a golden clock (unit mastery).

### Unit 5: Ice Rink

Animals: 🐻‍❄️ is a combined emoji, so avoid it. Use 🦭 seal (welcome gift), 🐺 wolf, 🦌 reindeer, 🐋 whale, and ❄️ a legendary snow spirit. Decorations: ⛸️ skates, 🧣 scarf rack, ☃️ snowman (earned for comparing negatives), 🏒 hockey sticks, and 🥇 a gold medal (unit mastery).

### Units 6 and 7: Potion Lab

Animals: 🐸 frog wizard (welcome gift), 🐍 snake, 🦎 lizard, 🐙 octopus, and 🧙 a legendary wizard pet. Decorations: 🧪 flasks, 🔮 crystal ball, 📜 scroll (earned for one-step equations), 🕸️ cobwebs, and ⚗️ a golden cauldron (unit mastery).

### Units 8 to 10: Pet Houses

Animals: 🦫 beaver (welcome gift), 🐌 snail, 🐞 ladybug, 🦋 butterfly, and 🦚 a legendary peacock. Decorations: 🧱 bricks, 🪵 logs, 🏕️ tent (earned for area of triangles), 🌻 garden, and 🏰 a castle (unit mastery).

### Unit 11: Pet Show

Animals: 🐩 poodle (welcome gift), 🐈 show cat, 🦒 giraffe, 🦓 zebra, and 🦁 a legendary lion. Decorations: 🎀 ribbons, 📊 score board (earned for dot plots), 🎪 tent, 🎺 trumpet, and 🏆 a grand trophy (unit mastery).

Adjust names and items when each unit is built. Keep the pattern: a free welcome animal, 2 or 3 coin animals gated by stations, 1 or 2 items earned by mastery, a streak or sprint item, and a legendary pet plus a golden decoration for unit mastery.

**Before shipping each set:** check every emoji in the game on a school Chromebook. Some newer ones (🦫, 🦭, 🪵) need recent ChromeOS. Swap any that show as boxes.

## 3. Unlock logic

Add one pure function (no DOM) near the stats code in `src/game/game.js`:

```js
// returns true when the student has met the rule
function ruleMet(rule) { … }
// items newly available or newly granted since the last check
function checkUnlocks() { … }
```

- `unit`: the building is open. The café is always open. Later buildings open when their shop ships, or through a teacher setting later.
- `station`: `S.cafe.st[n] >= UNLOCK_AT`. Generalize this to `S.shops[unit].st[n]` when the Bakery arrives.
- `mastery`: count the listed skills where `skillStatus(skill) === 'mastered'`. The rule is met when that count reaches `count` (or all of them).
- `unitMastery`: same check, using every skill in `UNITS[unit]`.
- `sprint`: `S.sprintBest >= best`.
- `streak`: track `S.bestStreak = Math.max(S.bestStreak, S.streak)` in `completeOrder()`, then check `S.bestStreak >= n`.

Call `checkUnlocks()` at the end of `completeOrder()`, `endSprint()`, and `enterAs()`. Calling it in `enterAs()` means existing players get anything they already earned.

Store what's been announced in `S.unlocked` (an array of reward ids). An item appears in the shop when its rule is met. If its price is 0, add it straight to `S.owned` or `S.decor`. Add `bestStreak` and `unlocked` to `fresh()` and `normalize()`.

## 4. What students see

- **Unlock moment:** when `checkUnlocks()` finds something new, show a small celebration card after the order: the item's emoji, "New in the Bakery: Crumb the hedgehog!", and a **See it** button to the shop. Show one card at a time, queue the rest, and never interrupt an order in progress.
- **Shop:** group items by unit, with a tab or heading for each building. Show locked items as silhouettes: the emoji at low opacity with a 🔒. Each locked item gets a kid-friendly hint from its rule, for example:
  - "Master Ratio tables and Equivalent ratios"
  - "Get 5 perfect orders in a row"
  - "Reach 25 in the Fact Sprint"
  Never hide locked items. Seeing the goal is the point.
- **Legendary items** get a gold border and a short line about the whole unit ("Master every skill in the Pet Café").
- **Town map:** each building tile shows the decorations from its own set, 3 or 4 small emoji along the bottom. The plaza keeps the student's favorite decorations and active pet.
- **Collection progress:** show "Café collection: 9 of 16" on each building tile. Finishing a collection is a strong motivator.

## 5. Teacher and parent view

- The grown-ups progress report gets a **Rewards** row: legendary items earned and collections completed.
- Optionally, the teacher dashboard gets a small column showing legendary items earned per unit. It's a quick sign of full unit mastery. The server `saves.state` already holds `owned`, `decor`, and `unlocked`, so `class_report()` can read `state->'unlocked'`. No new table is needed.
- Don't add a leaderboard. Public comparisons discourage the students who most need the practice.

## 6. Rules that keep it healthy

- Earned items can't be bought, and bought items never block learning.
- No random loot boxes or chance-based rewards.
- Prices don't inflate over time, and coins are never taken away (except by spending).
- Restoring from a backup code keeps everything in it. `checkUnlocks()` runs after restore.

## 7. Acceptance checks

1. A fresh student sees the Café set with the start items for sale. Later-unit sets are visible but locked, with hints.
2. Serving 6 orders at station 2 makes the penguin buyable, and a celebration card appears once.
3. Mastering every café skill (you can test by setting `S.kr` values in the console) grants the unicorn and makes the crown buyable.
4. A save that already owns the fox before station 3 is unlocked keeps the fox.
5. Reloading, switching devices, or restoring a backup never shows the same celebration twice.
6. `npm run typecheck` and `npm run build` pass.
7. Every new emoji renders on a school Chromebook.
