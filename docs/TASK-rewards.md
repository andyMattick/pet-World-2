# Task: build the reward system

Read `AGENTS.md` and `REWARDS.md` first. This file is the step-by-step build plan for `REWARDS.md`.

## Ground rules for this task

- **Edit existing files in place.** Don't rewrite `src/game/game.js`. Add to it and change specific functions.
- Keep every existing reward id: `cat, bunny, hamster, penguin, fox, panda, unicorn, tulips, plant, teddy, balloons, frame, cake, lights, rainbow, crown`.
- Use the item list in `REWARDS.md` exactly. Don't invent items.
- Run `npm run verify` after every step. Run `npm run typecheck` and `npm run build` before each commit.
- **Commit after each step** with the message given. If a step fails, stop and report. Don't "fix" by rewriting.

## Where things are now (in `src/game/game.js`)

| What | Where |
|---|---|
| `PETS` and `DECOR` arrays | near the top, about lines 34 to 41 |
| `BUILDINGS` array (with `open: true` only for the café) | about lines 42 to 51 |
| `fresh()` default state, `normalize()` for old saves | about lines 57 to 75 |
| `renderHome()` town map | about line 691 |
| `completeOrder()` (the streak is increased here: `S.streak++`) | about line 923 |
| `endSprint()` | about line 1070 |
| `renderShop()` and the `#shopWrap` click handler | about lines 1097 to 1125 |
| `enterAs()` (signed-in student loads their town) | about line 1262 |
| Local-mode boot (no Supabase) | the `boot()` function at the bottom |

Line numbers are approximate. Search for the names.

## Step 1: Add the reward list to the shared registry

In `src/shared/registry.ts`, **add** the following. Don't change anything that's already there.

```ts
export type UnlockRule =
  | { type: 'start' }
  | { type: 'unit' }
  | { type: 'station'; station: number }
  | { type: 'mastery'; skills: string[] }
  | { type: 'unitMastery' }
  | { type: 'sprint'; best: number }
  | { type: 'streak'; n: number };

export interface Reward {
  id: string; kind: 'pet' | 'decor'; emoji: string; name: string;
  unit: string;            // building id: 'cafe', 'bakery', ...
  unlock: UnlockRule; price: number; legendary?: boolean;
}

/** Skills belonging to each unit. Add a unit's skills when that unit is built. */
export const UNIT_SKILLS: Record<string, string[]> = {
  cafe: ['basic','tape','groups','dnlCreate','dnl','dnlTable','table','equiv','word','realworld','understand','coord','units','ppw'],
  bakery: [], market: [], clock: [], rink: [], potion: [], houses: [], show: []
};

const cafeRewards: Reward[] = [
  { id:'cat',      kind:'pet',   emoji:'🐱', name:'Mochi the cat',       unit:'cafe', unlock:{type:'start'}, price:0 },
  { id:'bunny',    kind:'pet',   emoji:'🐰', name:'Clover the bunny',    unit:'cafe', unlock:{type:'start'}, price:40 },
  { id:'hamster',  kind:'pet',   emoji:'🐹', name:'Peanut the hamster',  unit:'cafe', unlock:{type:'start'}, price:60 },
  { id:'penguin',  kind:'pet',   emoji:'🐧', name:'Pebble the penguin',  unit:'cafe', unlock:{type:'station', station:2}, price:100 },
  { id:'fox',      kind:'pet',   emoji:'🦊', name:'Maple the fox',       unit:'cafe', unlock:{type:'station', station:3}, price:150 },
  { id:'panda',    kind:'pet',   emoji:'🐼', name:'Dumpling the panda',  unit:'cafe', unlock:{type:'station', station:4}, price:220 },
  { id:'unicorn',  kind:'pet',   emoji:'🦄', name:'Sparkle the unicorn', unit:'cafe', unlock:{type:'unitMastery'}, price:0, legendary:true },
  { id:'tulips',   kind:'decor', emoji:'🌷', name:'Tulip vase',          unit:'cafe', unlock:{type:'start'}, price:20 },
  { id:'plant',    kind:'decor', emoji:'🪴', name:'Leafy plant',         unit:'cafe', unlock:{type:'start'}, price:30 },
  { id:'teddy',    kind:'decor', emoji:'🧸', name:'Teddy bear',          unit:'cafe', unlock:{type:'start'}, price:45 },
  { id:'balloons', kind:'decor', emoji:'🎈', name:'Balloons',            unit:'cafe', unlock:{type:'start'}, price:50 },
  { id:'frame',    kind:'decor', emoji:'🖼️', name:'Fancy painting',      unit:'cafe', unlock:{type:'mastery', skills:['basic']}, price:0 },
  { id:'cake',     kind:'decor', emoji:'🎂', name:'Cake display',        unit:'cafe', unlock:{type:'mastery', skills:['table','equiv']}, price:90 },
  { id:'lights',   kind:'decor', emoji:'✨', name:'Twinkle lights',      unit:'cafe', unlock:{type:'streak', n:5}, price:110 },
  { id:'rainbow',  kind:'decor', emoji:'🌈', name:'Rainbow sign',        unit:'cafe', unlock:{type:'sprint', best:25}, price:160 },
  { id:'crown',    kind:'decor', emoji:'👑', name:'Golden crown',        unit:'cafe', unlock:{type:'unitMastery'}, price:0, legendary:true }
];

/** [building id, pets (welcome, s2, s3, s4, legend), decor (welcome, s2, s3, s4, legend)] as [emoji, name] pairs */
const UNIT_SETS: [string, [string,string][], [string,string][]][] = [
  ['bakery', [['🦔','Crumb the hedgehog'],['🐭','Nibbles the mouse'],['🐥','Sunny the chick'],['🐻','Honey the bear'],['🦝','Sprinkles the raccoon']],
             [['🍞','Bread basket'],['🥐','Croissant sign'],['🥧','Pie window'],['🥨','Pretzel garland'],['🏅',"Baker's gold medal"]]],
  ['market', [['🐐','Gus the goat'],['🦜','Kiwi the parrot'],['🐢','Slowpoke the turtle'],['🦙','Lulu the llama'],['🐓','Rocco the rooster']],
             [['🍉','Melon stand'],['🌽','Corn crate'],['🧺','Picnic basket'],['🏷️','Price tags'],['⚖️','Golden scale']]],
  ['clock',  [['🦉','Hoot the owl'],['🦇','Midnight the bat'],['🐿️','Acorn the chipmunk'],['🦅','Soar the eagle'],['🐉','Ember the dragon']],
             [['🕯️','Candles'],['🔔','Tower bell'],['⏳','Hourglass'],['🌙','Moon banner'],['🕰️','Golden clock']]],
  ['rink',   [['🦌','Frost the reindeer'],['🐺','Howl the wolf'],['🐋','Splash the whale'],['🦈','Finn the shark'],['🦢','Crystal the swan']],
             [['⛸️','Skates'],['🧣','Scarf rack'],['☃️','Snowman'],['🏒','Hockey sticks'],['🥇','Gold medal']]],
  ['potion', [['🐸','Fizz the frog'],['🐍','Noodle the snake'],['🦎','Zap the lizard'],['🐙','Inky the octopus'],['🦋','Glimmer the butterfly']],
             [['🧪','Flasks'],['🔮','Crystal ball'],['📜','Spell scroll'],['🕸️','Cobwebs'],['⚗️','Golden cauldron']]],
  ['houses', [['🐌','Shelly the snail'],['🐞','Dot the ladybug'],['🐝','Buzz the bee'],['🦡','Digger the badger'],['🦚','Jewel the peacock']],
             [['🌻','Sunflower patch'],['🧱','Brick pile'],['🏕️','Camp tent'],['🏠','Tiny house'],['🏰','Castle']]],
  ['show',   [['🐩','Fifi the poodle'],['🐈','Duchess the show cat'],['🦒','Tallulah the giraffe'],['🦓','Stripes the zebra'],['🦁','King the lion']],
             [['🎀','Ribbons'],['📊','Score board'],['🎪','Show tent'],['🎺','Trumpet'],['🏆','Grand trophy']]]
];
const SLOTS = ['welcome','s2','s3','s4','legend'] as const;
const slotRule = (i: number): UnlockRule => i === 0 ? {type:'unit'} : i === 4 ? {type:'unitMastery'} : {type:'station', station:i + 1};
const PRICE = { pet: [0,100,150,200,0], decor: [0,60,90,120,0] };

export const REWARDS: Reward[] = [
  ...cafeRewards,
  ...UNIT_SETS.flatMap(([unit, pets, decor]) => (
    [['pet', pets], ['decor', decor]] as const).flatMap(([kind, list]) =>
      list.map(([emoji, name], i): Reward => ({
        id: `${unit}_${kind}_${SLOTS[i]}`, kind, emoji, name, unit,
        unlock: slotRule(i), price: PRICE[kind][i], legendary: i === 4 || undefined
      }))))
];
```

Also move `BUILDINGS` from `src/game/game.js` into `registry.ts` as `export const BUILDINGS`, with the same content. Then import it in `game.js`, delete the old copy, and change nothing else.

Check that `REWARDS.length === 86` (16 café + 7 units × 10). Add that check to `scripts/verify.mjs` (see step 6).

Commit: `Add reward registry`

## Step 2: Unlock logic (no UI yet)

In `src/game/game.js`:

1. Import `REWARDS`, `UNIT_SKILLS`, and `BUILDINGS` from `../shared/registry`. Remove the old `PETS` and `DECOR` arrays. Everywhere they were used (`petEmoji`, `petName`, `renderHome`, `renderShop`), look items up in `REWARDS` instead.
2. In `fresh()`, add `bestStreak: 0, unlocked: [], seenUnlocks: []`. In `normalize()`, make sure `unlocked` and `seenUnlocks` are arrays and `bestStreak` is a number.
3. In `completeOrder()`, right after `S.streak++`, add `S.bestStreak = Math.max(S.bestStreak || 0, S.streak);`.
4. Add these pure functions near the other stats code:
   - `unitOpen(unit)`: true if that building's `open` is true.
   - `ruleMet(reward)`: checks `reward.unlock` using `REWARDS.md`'s table. For `station`, use `S.cafe.st[n] >= UNLOCK_AT` for the café. Other units have no station progress yet, so return false for them. For `mastery` and `unitMastery`, use `skillStatus(skill) === 'mastered'`. A unit with an empty `UNIT_SKILLS` list is **not** mastered.
   - `available(reward)`: `unitOpen(reward.unit) && ruleMet(reward)`.
   - `owns(reward)`: `S.owned.includes(id)` for pets, `S.decor.includes(id)` for decorations.
   - `checkUnlocks({announce})`: for each reward that is `available` and not in `S.unlocked`, add it to `S.unlocked`. If its price is 0 and the student doesn't own it, grant it (push to `S.owned` or `S.decor`). If `announce` is true, add it to a pop-up queue. Otherwise, add its id to `S.seenUnlocks` silently. Return the list of new ids.
5. Call `checkUnlocks({announce:false})` in `enterAs()` and in the local-mode boot, so existing progress is granted quietly. Call `checkUnlocks({announce:true})` at the end of `completeOrder()` and `endSprint()`.

Commit: `Add reward unlock logic`

## Step 3: Unlock pop-up

1. Add a hidden modal to `index.html` next to the existing `#practice` modal, following the same structure. It needs a big emoji, a title, a message, and two buttons: **See it** and **Keep playing**.
2. Show queued unlocks one at a time, but **only when no order is in progress**: after the Next or Close-up button appears in `completeOrder()`, and on the sprint summary. Never on top of the times-table practice pop-up. If that's open, wait until it closes.
3. After showing an item, add its id to `S.seenUnlocks` and save.
4. **See it** opens the shop, scrolled to that item. **Keep playing** closes the pop-up.

Commit: `Add unlock celebration`

## Step 4: Shop by unit

Rewrite **only the body of `renderShop()`** and its click handler:

1. One section per building in `BUILDINGS` order, with the heading `emoji name`. Add "Coming soon" to the heading if the building isn't open.
2. For each reward in that unit:
   - **Owned pet:** show a Choose button (as now), or "Your helper" if it's the active pet.
   - **Owned decoration:** show "In your town."
   - **Available and unowned:** show a Buy button with the price. Disable it when coins are short.
   - **Not available:** show the emoji at 35% opacity with 🔒 and a hint built from the rule. Examples: "Serve 6 orders at Recipe Cards," "Master Ratio tables and Equivalent ratios" (use `SKILLS[id].name`), "Master every Pet Café skill," "Get 5 perfect orders in a row," "Reach 25 in the Fact Sprint." If the unit isn't open, the hint is "Opens with the Bakery."
   - **Legendary items** get a gold border (add a `.legendary` class in `src/styles/game.css`).
3. Buying an item whose price is 0 must be impossible. Those are granted, not sold.

Commit: `Shop shows rewards by unit`

## Step 5: Town map and progress report

1. In `renderHome()`, each building tile shows `Collection: X of 10` (the café has 16), counting owned pets and decorations in that unit. Open buildings also show up to 4 of their owned decorations as small emoji along the bottom of the tile.
2. In `renderParent()`, add a Rewards panel: collections per open unit, legendary items earned, and longest streak (`S.bestStreak`).

Commit: `Show collections on the town map and progress report`

## Step 6: Extend the safety check

In `scripts/verify.mjs`, **add** checks. Don't remove the existing ones:

- `src/shared/registry.ts` contains `export const REWARDS`, `export const UNIT_SKILLS`, and `export const BUILDINGS`.
- `src/game/game.js` contains `function checkUnlocks(` and `function ruleMet(`.
- `src/game/game.js` no longer contains `const PETS = [` or `const DECOR = [`.

Then update the protected-files table in `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md` (all three identical) to mention the rewards.

Commit: `Verify covers rewards`

## Acceptance checks

Test these in the browser with `npm run dev`, in local mode (no `.env`). You can change stats from the browser console for testing.

1. **Fresh student:** the shop shows the café items. The bunny, hamster, tulips, plant, teddy, and balloons are buyable. The penguin, fox, and panda are locked with station hints. The unicorn and crown are locked with "Master every Pet Café skill." All 7 other units show "Coming soon."
2. **Six orders at Recipe Cards:** the penguin becomes buyable, and the pop-up appears once, after the order, not during it.
3. **Master Basic ratios:** the Fancy painting is granted free, with a pop-up.
4. **Five perfect orders in a row:** Twinkle lights become buyable.
5. **An old save that already owns the unicorn or fox:** both stay owned, with no pop-up for them.
6. **Reload the page:** no pop-up repeats.
7. **Restore from a backup code:** unlocks are recalculated quietly, and no pop-ups repeat.
8. **Town map** shows "Collection: X of 16" on the café.
9. `npm run verify`, `npm run typecheck`, and `npm run build` all pass.
10. Every emoji renders on a school Chromebook. Report any that show as boxes. Don't substitute them silently.
