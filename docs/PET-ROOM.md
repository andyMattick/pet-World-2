# My Pet Room and Dress-up

## Goal

Give owned decorations a place to live and let students personalize their helper pet. Reuse the existing Pet Shop collection and coin purse; do not change existing reward IDs or problem generators.

## Feature decisions

- Add a Pet Room town tile. Students can move owned decorations around a room with pointer/touch dragging. Clamp placements to the room bounds and support keyboard nudging for the selected item.
- Show the selected helper pet in the room. Tapping it triggers a small trick or speech bubble. Wandering can be a light ambient animation, not saved simulation state.
- Preserve the Sticker Book display case. Add separate saved room placements so old `displayed` values and existing saves remain compatible. If a student has no room layout yet, seed it from their currently displayed decorations.
- Keep wearables in an accessory catalog separate from pets and decorations. Save owned accessory IDs and the active accessory in the student's existing state object.
- Spread acquisition across sources: some wearables cost Pet Town coins, at least one is earned through math progress, and a small set costs Arcade tickets. Arcade-ticket wearables remain unavailable until round-result ticket awards are secured.
- Arcade tickets are never convertible to Pet Town coins and arcade accessories do not affect math, scores, hints, or diagnostics.

## Build steps

1. [x] Add the accessory catalog and backward-compatible saved fields. Keep old saves valid and preserve existing reward arrays.
2. [x] Add the Pet Room screen, seed its first layout from displayed decorations, and save pointer/touch and keyboard placement changes.
3. [x] Add the helper-pet interaction, dress-up picker, coin purchases, and deterministic math-earned accessories.
4. [ ] Secure arcade round results before enabling Arcade-ticket accessory purchases. Add verification checks without deleting existing checks.
5. [ ] Run `npm run verify`, `npm run typecheck`, and `npm run build`; review in-browser, including iPhone SE size.

## Acceptance checks

- Existing saves load with all pets, decorations, displayed stickers, and coins intact.
- Room positions persist between sessions and cannot be dragged outside the room.
- The selected helper and accessory persist and render together.
- Coin purchases use only Pet Town coins; math-earned accessories grant deterministically; Arcade-ticket accessories cannot be acquired before secure ticket rewards are enabled.
- Room and dress-up controls are hidden during quizzes and tests.
