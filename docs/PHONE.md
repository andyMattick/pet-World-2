# Phones and tablets: number pad, Check buttons, and layout

**Status: planned. Do this next.** Students are already playing on phones. Read `AGENTS.md` first. **Edit in place, never rewrite a file.**

## The problem

- **The times-table practice ladder** only moves on with the **Enter** key, and it has no button.
- **The Fact Sprint** auto-advances right answers, but **wrong** answers need **Enter**.
- **Phone number keypads, especially on iPhone, have no Enter key.** Students get stuck with an answer typed and no way to submit it.
- **The phone keyboard slides up and covers** the question and the ladder.

Café steps are fine, because they have an on-screen **Check** button.

## Design

### 1. Check buttons and ladder auto-advance (all devices)

- **Practice ladder:** a row **auto-advances** as soon as the typed value equals the answer, the same way the sprint does. A visible **Check** button beside the input handles wrong answers. The ladder's text, hints, "It's X. Type X." after 2 misses, coins, and rules all stay the same.
- **Sprint:** a visible **Check** button does exactly what Enter does now.
- **Enter still works** everywhere on computers.

### 2. On-screen number pad (touch devices only)

On touch devices, meaning when `matchMedia('(pointer: coarse)').matches` is true:
- Under the **sprint question** and under the **practice ladder**, show a large number pad laid out like a calculator:
  ```
  7 8 9
  4 5 6
  1 2 3
  ⌫ 0 ✓
  ```
- Buttons are **at least 56px tall**, with at least 8px between them. The pad fits the screen width.
- The answer input becomes `readonly` on those devices, so the **phone keyboard never opens**.
- **The pad types into the same input** and fires the same handling. Auto-advance, "corrections count as misses," logging, and timing all work unchanged. **✓** acts like Check or Enter, and **⌫** deletes one digit.
- A light tap sound through `sfx('tick')`, respecting mute.
- On computers, there's no pad and nothing changes.

### 3. Layout rules for small screens (360 to 430px wide)

Apply these to every screen:
- **No sideways scrolling of the page.** Wide things, like ratio tables, number lines, and the coordinate grid, scroll **inside their own box** or shrink to fit. The coordinate grid scales to the screen width, and its click targets stay at least 28px.
- **Café orders:** on screens under 700px tall, the **Check / Hint** bar sticks to the bottom of the screen, so it's always reachable. The order ticket and the current step stay visible without scrolling back up, where possible.
- **Tap targets:** every button, sticker box, choice option, and display-case slot is **at least 44×44px**.
- **Pop-ups** (practice ladder, celebration, pickers): fit within `100dvh`, scroll inside themselves if needed, and keep their main button visible.
- **Text:** nothing smaller than 14px, and no text overlapping other text.
- **Join screen:** the class code and PIN inputs use suitable keyboards. The PIN uses the on-screen number pad on touch devices too.

## Build steps

Commit after each step. Before each commit, run `npm run verify`, `npm run typecheck`, and `npm run build`. Test in **Chrome DevTools device mode** at **iPhone SE (375×667)**, **Pixel 7 (412×915)**, and **iPad (820×1180)**, with the Console open. Then `git push` and paste `git log -1 --stat`.

1. **Check buttons and ladder auto-advance** (section 1).
   - Test on a computer: the ladder advances on right answers, Check and Enter both work for wrong ones, and the sprint's Check matches Enter.

   Commit: `Check buttons and ladder auto-advance`
2. **On-screen number pad** (section 2). Build **one** reusable function, for example `numberPad(input, onSubmit)`, and use it for the sprint, the ladder, and the join-screen PIN. Don't write three copies.
   - Test in device mode: the phone keyboard never opens, the pad types, ✓ submits, and ⌫ deletes.
   - Test that auto-advance and a corrected wrong answer both behave like on a computer.

   Commit: `On-screen number pad on touch devices`
3. **Small-screen layout pass** (section 3). Change **CSS first**, and only add JavaScript where CSS can't do it, like scaling the grid.
   - Go through every screen at iPhone SE size: join, town, café stations, **every problem type** (tray, tape diagram, double number lines, ratio tables, choices, coordinate grid), practice ladder, sprint, shop and sticker book, display case, celebration, Town Hall, progress report, and the teacher app's dashboard and roster.
   - List what you changed for each.

   Commit: `Small-screen layout fixes`
4. **Safety check.** In `scripts/verify.mjs`, **add** checks without removing any: `game.js` contains `pointer: coarse` and `function numberPad(`. Update exactly `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md`, keeping them identical. Also add this line to the "Before every commit" list in those files: *"If the change affects anything a student sees, check it in device mode at iPhone SE size."*

   Commit: `Verify covers phone support`

## Acceptance checks (on a real phone after deploying)

1. **Sprint:** tapping the right answer on the pad advances. A wrong answer plus ✓ shows the answer. The phone keyboard never appears.
2. **Practice ladder** (after a café miss and after a sprint): right answers advance by themselves, wrong ones can be checked with ✓, and the whole ladder can be finished without Enter.
3. **Join screen:** the PIN can be entered with the pad.
4. **Every café problem type** fits the screen without sideways page scrolling. The coordinate grid can be tapped accurately, and Check / Hint are always reachable.
5. **Pop-ups** fit on screen, with their buttons visible.
6. **Computers:** nothing changes. Typing and Enter work as before, and there's no number pad.
7. `npm run verify`, `npm run typecheck`, and `npm run build` pass, with no red Console errors.
