# 🛒 Supermarket Dash

A Market Stall game (Khan 6th grade Unit 3, rates and percentages). File: `public/arcade/supermarket-dash/index.html`.

## Where it opens

- **Market Stall → 🧺 Discount Bin station** (the last Market station): the "🛒 Supermarket Dash" button. It opens with `?from=market` in an overlay (`openDash` in `src/game/game.js`). It pays Pet World coins: 1 for each price she works out right the first time, up to `DASH_COINS_PER_DAY` (20) a day.
- **Arcade**: `supermarket-dash` in `ARCADE_GAMES`. It pays 1 ticket per checkout star, up to 3 a dash. See `ARCADE-GAMES.md`.

It never counts toward station orders, skill mastery, quizzes, unit tests or unlocks.

## How it plays

- $100 and 4 minutes. Six aisles (Produce, Bakery, Dairy, Pantry, Snacks, Frozen), with 12 to 16 items each. Every item gets a new deal each dash.
- She taps an item and types what she'll pay. If it's right, it goes in the cart. If it's wrong, the register beeps and she gets one more try. After a second miss the cashier rings it up for her, but it doesn't count as priced right.
- She checks out whenever she likes. She can't check out over $100: she has to put things back (✕) first. If time runs out while she's over, the cart doesn't count.
- Stars: ⭐⭐⭐ within $2 of $100, ⭐⭐ within $5, ⭐ within $10.

| Deal on the tag | Market skill |
|---|---|
| "4 for $6.00", buy 1 | `unitRate` |
| "$2.40 per lb", need 3 lb · "$1.25 each", need 4 · "3 for $4.50", buy 6 | `rateProblems` |
| Two sizes ("12 oz for $3.60" or "24 oz for $6.48"): the lower price per ounce or pound earns a ⭐ best buy | `compareRates` |
| "Was $20.00 · 10% / 25% / 50% off" | `benchmarkPct` |
| "Was $8.00 · 15% / 20% / 30% / 40% / 60% / 75% off" | `findingPct` |
| "Coupon: pay 80% of $9.00" | `pctWord` |
| "take 1/4 off" · "save 0.25 of the price" | `pctEquivalent` |

All prices are whole cents. She can type `7.2`, `7.20` or `$7.20`.

## Saved state and reports

- `S.dash = {best (cents), day, coinsToday, games:[{t, total, stars, right, tries, missed}]}` (the last 30 dashes).
- Day log event `k:'dash'`; place `dash`, counted as math time. The teacher ledger maps `dash` to math.
