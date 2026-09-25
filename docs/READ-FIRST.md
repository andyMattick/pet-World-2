# Read the order first: a prominent question, reading time, and a visible plan

**Status: planned.** Build this before `TEACHER-TOOLS.md`. Read `AGENTS.md` first. **Edit in place, never rewrite a file.** This changes how every café problem is **shown**, not the problems themselves. Don't change any generator.

## The problem

- The actual question lives in the small speech bubble at the side.
- The chalkboard jumps straight to "Step 1 of 3," so students do steps without knowing what they're for.
- The tip timer starts the moment the customer arrives, so reading carefully costs coins.

## Design

### 1. The order ticket: the question comes first

At the **top of the chalkboard**, above the picture or table, show an **order ticket**: a cream-colored paper card with a pin, like a real café order.

- **The full question** (the generator's `p.bubble` text) in the regular body font, not the chalk font, at about **1.35rem**, dark ink on the cream card for easy reading.
- **Every number in bold**, so they stand out.
- **The question sentence**, meaning the last sentence ending in "?" if there is one, on its own line with a **"❓ Find:"** label and a highlighted background. For example: "❓ Find: How many cups of milk?"
- The customer's emoji and name in the ticket's corner.
- The ticket **stays visible the whole time**. It never scrolls away or collapses during the steps.

The **speech bubble** at the side changes to a short greeting, like "Here's my order!", "Order up, please!", or "Can you help me with this one?", so the question isn't shown twice.

### 2. The plan strip: see what the steps are for

Right under the ticket, show **all the steps as a row of chips**, using each step's `name`. For example:

`① Find the multiplier → ② Multiply → ③ Find the multiplier → ④ Multiply`

- **Upcoming** steps are plain.
- The **current** step is highlighted.
- **Finished** steps show a ✓ and are dimmed.
- Setup steps (counting) are included.

The existing "Step 2 of 4: …" prompt stays as it is.

### 3. Read first, then start

When a customer arrives:
- The ticket, the plan strip, and the picture are shown.
- **The step prompt, answer boxes, Check, and Hint are hidden**, and the tip bar is **full and not moving**.
- A big **"I'm ready, let's start!"** button appears **after 1.5 seconds**, so she can't click through without looking. **Enter** also works once it appears.

**Clicking it starts the order:** the first step activates, the tip timer starts, and **the order's speed clock starts at that moment**. Reading time never costs tip coins, and it never counts toward slow-answer pop-ups.

### 4. Read it to me

A **🔊 Read it to me** button on the ticket reads the question aloud with the browser's built-in speech (`speechSynthesis`).
- It works during reading and during the steps.
- It's hidden if the browser doesn't support speech.
- It uses a friendly rate (0.95) and stops if she clicks it again or the order ends.
- It isn't affected by the music or sound-effects mute buttons, because it's a reading support, not a game sound.

## Build steps

Commit after each step. Before each commit, run `npm run verify`, `npm run typecheck`, and `npm run build`, and **test in a real browser with the Console open**. Then `git push` and paste `git log -1 --stat`.

### Step 1: Ticket and plan strip

In `src/game/game.js`, in `nextCustomer()` where the board HTML is built:
1. Add the ticket above `<div class="visual">`. Build it from `p.bubble`: wrap numbers in `<b>` using `esc()` first, then find the last sentence ending in "?" for the "❓ Find:" line.
2. Add the plan strip `<div class="plan" id="plan">` with one chip per step.
3. Change the speech bubble text to a random short greeting.
4. In `activateStep()`, highlight the current chip. In `stepRight()`, mark the chip done.
5. Add the styles to `src/styles/game.css`: `.ticket`, `.ticket-find`, `.plan`, `.plan .chip`, `.chip.now`, and `.chip.done`. The ticket must be readable on the dark chalkboard, with dark text on cream and at least 4.5:1 contrast.

Don't change timing yet. Commit: `Order ticket and step plan`

### Step 2: Read first

1. In `nextCustomer()`, **don't** call `activateStep(0)` or `startPatience(...)` right away. Instead:
   - hide `#stepPrompt`, `#stepInput`, `#checkBtn`, and `#hintBtn`
   - show a **"I'm ready, let's start!"** button in `#boardActions`, added after 1.5 seconds
   - leave the tip bar full and still
2. **Starting the order** (the button or Enter) must:
   - set `order.start = performance.now()`
   - call `startPatience(order.limit)`
   - show the hidden parts
   - call `activateStep(0)`
   - replace the start button with the normal Check and Hint buttons
3. Make sure **leaving the shift** or the **practice pop-up** can't happen during the reading phase in a way that breaks timers. The practice pop-up can't open before any answer anyway.

**Browser test:**
- Wait 10 seconds on the reading screen, then start. The tip bar is still full, and the first step's slow timer starts from the click.
- Enter works once the button appears, but not before.
- Every station's problem types still work: tray, tape, number lines, tables, choices, and grid.

Commit: `Read the order before starting`

### Step 3: Read it to me

Add the **🔊 Read it to me** button on the ticket, as described in section 4.
- Read the plain question text, without HTML.
- Cancel speech in `completeOrder()`, in `leaveShift`, and when the next customer arrives.

Commit: `Read-aloud for orders`

### Step 4: Safety check

In `scripts/verify.mjs`, **add** checks without removing any: `game.js` contains `class="ticket"`, `id="plan"`, and `speechSynthesis`. Update exactly `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md`, keeping them identical.

Commit: `Verify covers read-first orders`

## Acceptance checks

1. **Every order** shows the full question on a cream ticket at the top of the board, with numbers in bold and a "❓ Find:" line when the question has one.
2. **The plan strip** lists every step, highlights the current one, and checks off finished ones.
3. **Reading time is free:** the tip bar doesn't move and the step timer doesn't run until **I'm ready, let's start!** is clicked. The button appears after 1.5 seconds.
4. **The ticket stays visible** during all steps, on a laptop and on a phone.
5. **Read it to me** reads the question aloud, stops when the order ends, and is hidden where speech isn't supported.
6. **Nothing else changes:** answers, hints, mix-up detection, pop-ups, and rewards all work as before.
7. `npm run verify`, `npm run typecheck`, and `npm run build` pass, with no red Console errors.
