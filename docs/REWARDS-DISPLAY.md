# Make rewards easy to see and exciting to earn: sticker book and display case

**Status:**
- Step 1 (shared reward tiles) is **done**.
- Steps 2 to 5 are **planned**.

Steps 2 to 5 replace the earlier "items in a line" idea with **boxes to fill**.

Read `AGENTS.md` first. **Edit in place, never rewrite a file.** Change only the functions and styles named here. How rewards are **earned** doesn't change (see `REWARDS.md`). This is about how they **look** and the fun of completing sets.

## The idea

Every reward has a **box waiting for it**.
- Empty boxes show what's missing, so a student can see the gaps and wants to fill them.
- Completing a row or a whole set is a moment worth celebrating, with a small coin bonus.
- Decorations go into a **display case** in the town square with real slots, not a line of emoji.

## Design

### 1. The Sticker Book (replaces "My Collection")

**Getting there:** a new town tile, **📒 Sticker Book**, among the service tiles. It shows a **"New!"** dot when there's something new.

**One page per building,** in town order. Tabs at the top switch pages: ☕ 🥐 🍎 🕰️ ⛸️ 🧪 🏡 🏆. Each page has:
- A header with the building emoji, its name, and "**9 of 16** stickers."
- **Two rows of boxes: Pets and Decorations.** Each row has a counter, like "Pets 3 of 7."
- **One box per reward,** always in the same order. Boxes are square, about **110px on a laptop and 84px on a phone**, in a grid that wraps.
- **The legendary pet and the legendary decoration** sit in a **larger gold-framed box** at the end of their row.

**What each box looks like**

| State | Look |
|---|---|
| **Owned** | Filled: white background, the emoji at 3rem, the name underneath, a thin colored border |
| **Ready to get** (unlocked, not bought) | A **dashed** border, the emoji in full color but smaller, a 🪙 price tag, and a pulsing "Get it!" label. Tapping it opens that item in the shop |
| **Locked** | A **dashed** border, the emoji as a **dark silhouette** (CSS `filter: brightness(0) opacity(.25)`), and a 🔒. Tapping it shows the hint in a small bubble, like "Serve 6 orders at Recipe Cards" |
| **Coming soon** (unit not open) | The whole page is grayed, with a banner: "Opens with the Bakery." Boxes show silhouettes, so you can still see what's coming |

**Completing a row or page**
- When every box in a row is filled, that row's border turns **gold**, a "✓ Complete!" ribbon appears, and the student gets a one-time bonus: **+50 🪙 for pets, +50 🪙 for decorations**.
- When the whole page is filled, the page gets a **gold frame** and a **"Café Master"** stamp (the building's name plus "Master"), plus **+100 🪙** once.
- Save completed sets in `S.completedSets` (ids like `cafe:pets`, `cafe:decor`, `cafe:all`) so a bonus is never paid twice.
- Completing a set uses the big celebration card (section 3) with the title **"Set complete!"**.
- **"New!" dots** go on boxes filled since the student last opened that page. Track them in `S.seenCollection`. Opening the page clears them.

### 2. The town square Display Case

Replace the line of decorations in the plaza (`renderHome()`, `#plazaDecor`) with a **display case**:

- **A pet box:** one larger box on the left, about 130px, holding her helper pet at 5rem, labeled "My helper." Tapping it opens a picker of owned pets.
- **Decoration slots:** a **2×4 grid of 8 square slots** on wooden shelves. Each slot is about 80px, and decorations inside are 2.6rem.
  - **Filled slots** show the decoration. Tapping one gives the choice to **Swap** or **Remove**.
  - **Empty slots** are dashed with a **"+"**. Tapping one opens a picker of owned decorations that aren't displayed yet.
  - If she owns fewer than 8 decorations, the leftover empty slots say "Earn more in the café!"
- **Saving:** the slot contents live in `S.displayed`, an array of 8 ids or null. The first time, fill it with her owned decorations in the order earned.
- **A progress line** under the case: "📒 Sticker Book: 12 of 86 stickers." Tapping it opens the Sticker Book.

### 3. A bigger unlock celebration

Upgrade the unlock pop-up from `TASK-rewards` step 3. Keep its rules: never during an order, never on top of the practice pop-up, and one at a time.

- **The card:** large and centered. The emoji is at **6rem**, with a colored burst behind it. Then the title ("New pet!", "New decoration!", "LEGENDARY!", or "Set complete!"), the item name, and a **mini preview of the Sticker Book row** with the new box just filled.
- **Confetti:** about 30 small emoji pieces falling for about 1.5 seconds. Use CSS only. Skip it when `prefers-reduced-motion` is set.
- **Sound:** a short 4-note rising jingle through `sfx`. Respect mute.
- **Buttons:**
  - Pets: **Make it my helper**.
  - Decorations: **Put it on display** (fills the first empty display slot).
  - Buyable unlocks: **Go to the shop**.
  - Always: **Keep playing**.
- **Legendary items and set completions** also get a gold glow and a longer confetti burst.

### 4. Town tiles

Each open building tile shows a **mini sticker strip**: its box count as small squares, filled or empty, at 10px, wrapping onto two lines if needed. Show it along with "9/16." For buildings that aren't open yet, show nothing extra.

## Build steps

Commit after each step. Before each commit, run `npm run verify`, `npm run typecheck`, and `npm run build`, and paste `git log -1 --stat`.

1. ~~**Shared reward tiles**~~ **Done.**
2. **Sticker Book screen.**
   - Add a `scr-book` section to `index.html` and `'book'` to `SCREENS`.
   - Add the town tile and `renderBook(unit)` with page tabs, rows of boxes in the four states, and the tap-to-see-hint bubble.
   - Add `S.seenCollection` and `S.completedSets` to `fresh()` and `normalize()`.
   - Add row and page completion with the one-time coin bonuses. Check for completion inside the existing `checkUnlocks()`, and whenever an item is bought.
   - Reuse `rewardTileHTML()` for the emoji and name inside boxes where it helps, but boxes need their own styles for the empty, dashed, and silhouette states.

   Commit: `Sticker Book with boxes to fill`
3. **Display Case.**
   - Replace the plaza decoration line in `renderHome()` with the pet box and the 8-slot case.
   - Add the pet picker and the decoration picker, as small modals or popovers.
   - Add `S.displayed` in `fresh()` and `normalize()`.

   Commit: `Town square display case`
4. **Celebration upgrade** as in section 3, including "Set complete!" and the **Put it on display** button. Commit: `Bigger unlock celebration`
5. **Town tiles and checks.**
   - Add the mini sticker strips from section 4.
   - In `scripts/verify.mjs`, add checks that `game.js` contains `function renderBook(` and `function rewardTileHTML(`, and that it no longer uses `#plazaDecor` as a plain emoji list.
   - Update the three instruction files, keeping them identical.

   Commit: `Sticker strips and verify`

## Acceptance checks

1. The Sticker Book shows every building's page with a box for every reward: 16 on the café page and 10 on each other page.
2. From across the room, you can tell filled, ready-to-get, locked, and legendary boxes apart. Locked boxes are clear silhouettes, not invisible.
3. Tapping a locked box shows its hint. Tapping a ready box goes to the shop.
4. Filling the last pet box turns that row gold, shows "Set complete!", and pays +50 🪙 **once**. Reloading or restoring a backup doesn't pay it again.
5. The display case shows 8 slots. She can add, swap, and remove decorations, and the choices stick after a reload.
6. "Put it on display" in the celebration fills an empty slot.
7. Town tiles show sticker strips for open buildings.
8. Old saves load with nothing lost. Owned items all appear as filled boxes.
9. It works at Chromebook size (1366×768) and on a phone. Boxes wrap and never overflow the screen.
10. With reduced motion there's no confetti, and with sound muted there's no jingle.
