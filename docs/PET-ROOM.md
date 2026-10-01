# My Pet Room and Dress-up

## Goal

Give owned decorations a place to live and let students personalize their helper pet. Reuse the existing Pet Shop collection and coin purse; do not change existing reward IDs or problem generators.

## Feature decisions

- Add a Pet Room town tile. Show decoration images without visible item-name labels. Students can move owned decorations around a room with pointer/touch dragging. Clamp placements to the room bounds and support keyboard nudging for the selected item; preserve accessible labels for assistive technology.
- Show the selected helper pet in the room at a larger scale, using a full-body emoji variant where available (for example, a rabbit rather than a rabbit head). Tapping it triggers a small trick or speech bubble. Wandering can be a light ambient animation, not saved simulation state.
- Preserve the Sticker Book display case. Add separate saved room placements so old `displayed` values and existing saves remain compatible. If a student has no room layout yet, seed it from their currently displayed decorations.
- Keep wearables in an accessory catalog separate from pets and decorations. Save owned accessory IDs, the active accessory, and each wearable's movable position in the student's existing state object. Dragging and keyboard nudging should both work.
- Spread acquisition across sources: some wearables cost Pet Town coins, at least one is earned through math progress, and a small set costs Arcade tickets. Add a ticket-priced Pet Room furniture catalog to the Arcade. Arcade-ticket wearables and furniture remain unavailable until round-result ticket awards are secured.
- Arcade tickets are never convertible to Pet Town coins and arcade accessories do not affect math, scores, hints, or diagnostics. Free Play awards no Arcade tickets; ticket furniture and wearables are purchasable only in paid mode.

## Build steps

1. [x] Add the accessory catalog and backward-compatible saved fields. Keep old saves valid and preserve existing reward arrays.
2. [x] Add the Pet Room screen, seed its first layout from displayed decorations, and save pointer/touch and keyboard placement changes.
3. [x] Add the helper-pet interaction, dress-up picker, movable wearable positions, coin purchases, and deterministic math-earned accessories.
4. [x] Add a separate Arcade furniture catalog and enable ticket purchases only in paid mode. The host validates origin/run IDs, deduplicates rounds, computes ticket awards, and enforces teacher-configured daily caps. Free Play never awards or spends tickets.
5. [ ] Add server-side anti-tamper validation for ticket awards before broader student release.
6. [ ] Run `npm run verify`, `npm run typecheck`, and `npm run build`; review in-browser, including iPhone SE size.

## Acceptance checks

- Existing saves load with all pets, decorations, displayed stickers, and coins intact.
- Room positions persist between sessions and cannot be dragged outside the room.
- A student can take a placed sticker out of the room without losing ownership; it returns to the image-only inventory.
- Decoration art has no visible item-name labels; accessible labels remain available.
- The selected helper, full-body variant where available, accessory selection, and accessory positions persist and render together.
- Arcade furniture stickers appear in the Arcade catalog and can be placed in the room after ownership.
- Coin purchases use only Pet Town coins; math-earned accessories grant deterministically; Arcade-ticket accessories cannot be acquired before secure ticket rewards are enabled.
- Room and dress-up controls are hidden during quizzes and tests.
