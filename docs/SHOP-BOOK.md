# Merge the Pet Shop and Sticker Book into one screen

**Status: planned.** Build this after the drills items on the roadmap.

Read `AGENTS.md` first. **Edit in place, never rewrite a file.** How rewards are earned doesn't change.

## Why

The Pet Shop and the Sticker Book show the same rewards twice. Students should have **one place** for rewards: the sticker book layout (boxes to fill, gold rows, set bonuses) with buying built in.

## Design

- **One town tile:** **🛍️ Pet Shop & Sticker Book**. Remove the separate 📒 Sticker Book tile.
- **One screen, the current Sticker Book layout:** page tabs for each building, a **Pets** row and a **Decorations** row, with a box for every reward, gold legendary boxes, gold rows when complete, and the "Master" stamp.
- **Buying happens right in the box:**
  - A **ready** box (unlocked, not owned) shows the price and a **Buy** button. It's disabled when coins are short, with "Need 30 more 🪙."
  - Tapping a **locked** box shows its hint, as now.
  - Tapping an **owned pet** box shows **Make it my helper**. The active helper has a "My helper" badge.
  - Tapping an **owned decoration** box shows **Put it on display** or **Take it off display**, using the town square display case.
- **Everything else keeps working:** the coin balance at the top, New! dots, set-completion bonuses (paid once), and the celebration's "Go to the shop" button (which now opens this screen at the right page).
- Anything that linked to the old shop or book, like the celebration buttons and the town-square progress line, now opens this screen.

## Build steps

Commit after each step. Before each commit, run `npm run verify`, `npm run typecheck`, and `npm run build`, and paste `git log -1 --stat`.

1. **Buying inside the book.**
   - Add Buy, Make it my helper, and display on/off to the boxes in `renderBook()`.
   - Reuse the existing purchase code from the shop's click handler. Move it into a shared function, `buyReward(id)`, rather than copying it.

   Commit: `Buy from the sticker book`
2. **One entry point.**
   - The Pet Shop tile opens `renderBook()` and is renamed "Pet Shop & Sticker Book." Remove the separate Sticker Book tile.
   - Point every link to the old shop at the book.
   - Leave `renderShop()` in place, but unused, until step 3.

   Commit: `One shop and sticker book`
3. **Clean up.**
   - Remove `renderShop()` and its click handler **only after** confirming nothing calls them. Search the code first.
   - In `scripts/verify.mjs`, replace the check for `function renderShop(` with a check for `function buyReward(`. That's the only check that may be replaced; keep all the others.
   - Update the protected-files table in the three instruction files, keeping them identical.

   Commit: `Remove old shop screen`

## Acceptance checks

1. There's one tile. The old Sticker Book tile is gone.
2. Buying a ready item from its box works, takes the coins, and fills the box.
3. Not enough coins shows how many more she needs.
4. **Make it my helper** and **Put it on display** work from owned boxes.
5. Set bonuses still pay once. Reloading doesn't pay them again.
6. The celebration's **Go to the shop** opens the right page.
7. Old saves load with every owned item filled in.
