# 🐧 Penguin Push

An Ice Rink game (Khan 6th grade Unit 5, negative numbers). File: `public/arcade/penguin-push/index.html`.

## Where it opens

- **Ice Rink → 🌨️ Weather Station** (the last Rink station): the "🐧 Penguin Push" button. It opens with `?from=rink` in an overlay (`openPenguin` in `src/game/game.js`). It pays Pet World coins: 1 for each order she gets right, up to `PENGUIN_COINS_PER_DAY` (20) a day.
- **Arcade**: `penguin-push` in `ARCADE_GAMES`. It pays 1 ticket per star, up to 3 a battle. See `ARCADE-GAMES.md`.

It never counts toward station orders, skill mastery, quizzes, unit tests or unlocks.

## How it plays

- An ice floe is a number line from −7 to 7, with water past each end. Her 3 penguins start at −6, −4 and −2. The 3 walruses start at 2, 4 and 6.
- Each turn she gets an order card. She taps a penguin, then the spot the order names. If she's right, the penguin slides there. Landing on a walrus bumps it 1 spot for every 2 spots slid, so a long slide bumps harder. Whoever it bumps into gets bumped 1 more spot. Past −7 or 7 is a splash.
- If she's wrong, the penguin slips and the card shows the right spot.
- After each turn, one walrus slides up to 3 spots toward the nearest penguin and can bump it.
- She wins when every walrus is in the water: ⭐ for each penguin still standing. If 30 turns run out, dunking 2 walruses with a penguin left earns ⭐.
- Most cards (3 in 4) name a spot where a walrus is standing, so right answers lead to bumps.

| Order card | Ice Rink skill |
|---|---|
| "Slide to −5" | `negLine` |
| "It's 4 degrees below zero. Slide to that temperature." | `negIntro` |
| "Slide to the opposite of 6" | `opposites` |
| "a = −4. Slide to −a." · "Slide to −(−3)" | `negSymbol` |
| "Slide to \|−5\|" · "Slide to −\|3\|" | `absVal` |
| "Slide to a spot that is 3 away from 0" (two spots work) | `absMeaning` |
| "Slide to the least of −2, −6, 1" | `orderSmallNeg` |
| "Slide to the greatest of −5, −1, −3" | `cmpRational` |
| "Slide to any spot less than −4" · "greater than −3 and less than 1" (at most 5 spots work) | `numIneq` |
| "Slide to the whole number just left of −2.5" | `negDecLine` |
| "Slide to whichever of −6 and 4 has the greater absolute value" | `cmpAbs` |

The first 3 turns use only the first five kinds of card.

**Balance check:** 300 simulated battles per accuracy level. Always right: wins about 2 in 3, never loses. 80% right: wins about 63%. 60% right: wins about 48%, and the walruses win about 17%.

## Saved state and reports

- `S.penguin = {best (stars), day, coinsToday, games:[{t, won, stars, dunked, right, tries, missed}]}` (the last 30 battles).
- Day log event `k:'penguin'`; place `penguin`, counted as math time. The teacher ledger maps `penguin` to math.
