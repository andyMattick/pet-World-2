# Bakery step 0: let the game run more than one shop

**Status: ready.** Read `AGENTS.md` and `docs/BAKERY.md` first. **Edit in place, never rewrite a file.**

## Goal

Everything shop-specific is currently written for the café: `STATIONS`, `S.cafe.st`, `stationOpen(n)`, the café screen, and `shop:'cafe'` in logging. After this plan, **the café works exactly as before**, and a second shop can be added by listing its stations and generators. **There's no database change.** The tables already have a `shop` column, and `class_report()` groups by skill.

## Steps

Commit after each step. Before each commit, run `npm run verify`, `npm run typecheck`, and `npm run build`, **test in a real browser with the Console open, including at iPhone SE size**, then `git push` and paste `git log -1 --stat`.

### Step 1: Shop registry

In `src/shared/registry.ts`, **add** the following. Don't change any existing export, and keep `STATIONS` meaning the café's stations.

```ts
export interface Shop { id: string; name: string; emoji: string; unitLabel: string; stations: Station[] }
export const BAKERY_STATIONS: Station[] = [
  { id: 1, name: 'The Scale',     emoji: '⚖️', kid: 'Add and subtract decimals', skills: ['addDec', 'subDec', 'decWord'] },
  { id: 2, name: 'Sharing Pans',  emoji: '🥧', kid: 'Divide fractions and whole numbers', skills: [] },
  { id: 3, name: 'Boxing Treats', emoji: '📦', kid: 'Divide fractions by fractions', skills: [] },
  { id: 4, name: 'The Register',  emoji: '🧾', kid: 'Multiply decimals, long division', skills: [] },
  { id: 5, name: 'Bulk Orders',   emoji: '🚚', kid: 'Divide decimals', skills: [] }
];
export const SHOPS: Record<string, Shop> = {
  cafe:   { id: 'cafe',   name: 'Pet Café', emoji: '☕', unitLabel: 'Khan Academy 6th grade, Unit 1: Ratios', stations: STATIONS },
  bakery: { id: 'bakery', name: 'Bakery',   emoji: '🥐', unitLabel: 'Khan Academy 6th grade, Unit 2: Arithmetic with rational numbers', stations: BAKERY_STATIONS }
};
```

- Add `shop?: string` to the `Skill` interface. Existing skills don't need it; a missing shop means `'cafe'`.
- Add `export const shopOfSkill = (id: string) => SKILLS[id]?.shop || 'cafe';`.
- A station with an empty `skills` list is **not built yet**. It shows as "Coming soon" and can't be opened.

Commit: `Add shop registry`

### Step 2: Game engine works per shop

In `src/game/game.js`:

1. **Progress:** add `bakery: {st: {1:0, 2:0, 3:0, 4:0, 5:0}}` to `fresh()`, and make sure `normalize()` fills it in for old saves. Add `shopProgress(shop)`, which returns `S[shop]`. Keep `S.cafe` exactly where it is, so old saves don't change.
2. **`stationOpen(shop, n)`:**
   - A station with no skills is closed.
   - Station 1 is open.
   - Otherwise the station opens after `UNLOCK_AT` orders at the station before it.
   - The teacher's `minStation`, and `unlockAll` in local mode, **apply to the café only**.
   - Update every existing call to `stationOpen(n)` to `stationOpen('cafe', n)`.
3. **One station screen for every shop:**
   - The café screen (`scr-cafe`, `renderCafe`) becomes `renderShopFloor(shop)`.
   - It takes the heading, the Khan unit line, and the stations from `SHOPS[shop]`.
   - Keep the section id `scr-cafe`, so nothing else breaks.
   - The station buttons carry `data-shop` and `data-station`.
   - The town's building tiles open `renderShopFloor(id)` for any building that exists in `SHOPS` and is `open`.
4. **`startShift(shop, station)`:**
   - Store `shift.shop`.
   - `chooseSkill()` picks from `SHOPS[shift.shop].stations`.
   - `completeOrder()` counts the order in `shopProgress(shift.shop).st`.
   - Every `Backend.log` from an order uses `shop: shift.shop` instead of `'cafe'`.
   - The shift header shows the right shop and station.
   - "Another shift" returns to the same shop and station.
5. **Rewards:** in `ruleMet()`, a `station` rule for any unit now checks `shopProgress(unit).st[n] >= UNLOCK_AT`. Keep `BUILDINGS.bakery.open` **false** in this step.

**Browser test:** the café plays exactly as before, station unlocks still work, and old saves load.

Commit: `Game engine supports more than one shop`

### Step 3: Decimal key on the number pad

In `numberPad(input, onSubmit)`, show a **`.`** key when the current answer can contain a decimal. The simplest version: take an option `{decimal: true}`, and pass it when the step's answer string contains `.`. The key adds one `.` at most. Café and sprint pads stay the same.

Commit: `Decimal key on the number pad`

### Step 4: Dashboard by shop

In `src/teacher/report.ts`:
- Group the skill grid's columns by **shop, then station**, using `SHOPS` and `shopOfSkill`.
- Add **shop tabs** above the grid (☕ Café | 🥐 Bakery) so the grid never gets too wide. The default is the café.
- "Skills to reteach", small groups, and the student detail list include skills from every shop, labeled with the shop's emoji.
- Skills a student hasn't reached show as not started, as now.

Commit: `Dashboard tabs per shop`

### Step 5: Safety check

In `scripts/verify.mjs`, **add** checks without removing any:
- `registry.ts` contains `export const SHOPS` and `BAKERY_STATIONS`.
- `game.js` contains `function renderShopFloor(`, `function shopProgress(`, and `shift.shop`.

Update the protected-files table in exactly `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md`, keeping them identical.

Commit: `Verify covers multiple shops`

## Acceptance checks

1. The café is unchanged: stations, unlocks, the teacher's starting station, rewards, and the dashboard all work as before.
2. Old saves and backup codes load, and the café progress is intact.
3. The Bakery tile is still "Opening soon" until `BAKERY-1-SCALE.md` opens it.
4. The dashboard shows ☕ and 🥐 tabs. The café tab looks the same as today's grid.
5. The number pad shows `.` only when an answer needs it.
6. `npm run verify`, `npm run typecheck`, and `npm run build` pass, with no red Console errors.
