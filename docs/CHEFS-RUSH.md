# 🍳 Chef's Rush

A kitchen game for the Pet Café. Order tickets slide in with timers. She reads each one, plates exactly the right amounts with **+1 / +5 / −1** on each ingredient, and taps **🛎️ Serve** before the customer gives up.

One file, no build step: `public/arcade/chefs-rush/index.html` (served at `/arcade/chefs-rush/`).

## The math: every Café skill

Tickets come from a shuffled deck of the 13 Café skills, so every skill shows up before any repeats:

| Ticket | Skill (registry id) |
|---|---|
| "3 strawberries for every 2 blueberries" (later: "the ratio of blueberries to strawberries is 2 to 3") | Basic ratios (`basic`) |
| Tape diagram, each box labeled (later: only the total given) | `tape` |
| One snack bag pictured: make 4 bags' worth | Equal groups (`groups`) |
| Double number line out to a "?" mark | `dnl` |
| Ratio table with a missing last row | `table`, `dnlTable` |
| 📇 Recipe card for 2 or 3 servings, then **🔔 Serve 6!** | Equivalent ratios (`equiv`) |
| House mix, the cook already set out some of one ingredient | Word problems (`word`) |
| "2 cupcakes cost 6 coins", plate the food **and** the coins | Real world (`realworld`) |
| Make a bigger mix that tastes exactly the same | Understand (`understand`) |
| Graph of the recipe line; plate the point at the ▲ | Coordinate plane (`coord`) |
| Recipe in quarts, gallons, cups, pounds or dozens; plate in pints, quarts, half-cups, sticks or eggs | Units (`units`) |
| Party tray: ratio plus the total number of pieces | Part-part-whole (`ppw`) |

Numbers stay between 1 and 30 per ingredient. Every 5 orders served is a new level: bigger ratios, customers who wait less, tickets that come faster.

A wrong plate takes 8 seconds off that customer and shows what was off and the worked reasoning. A customer who runs out of time leaves and takes a ❤️. Three ❤️ gone ends the shift. The end screen lists the skills to look at again.

## Where she plays it

**Deliveries (Café station 4).** Once Deliveries is open, its card has a **🍳 Chef's Rush** button (it shows her best shift). The game opens full screen (`openChefRush()` in `src/game/game.js`, page `?from=cafe`). At the end of a shift the page posts `{type:'chef:result'}`:
- **1 Pet World coin per order served**, up to `CHEF_COINS_PER_DAY` (20) a day.
- The shift is kept in `S.chefRush` (best shift, the last 30 shifts with orders served, perfect orders, level and missed skills) and goes in the day log (`k:'chef'`), so it shows on the Ledger under math.
- Its time counts as math time (`subjectOnScreen`).

**Arcade.** It's in `ARCADE_GAMES` (`src/shared/registry.ts`), so the teacher's Arcade switches open and close it like every other game. It pays **1 arcade ticket per 5 orders served, up to 3 a shift** (`arcadeModuleMessage`), plus the Game of the Day bonus, under the class's daily ticket cap.

## What it never does

Chef's Rush never counts toward station orders, skill mastery, station quizzes, the unit test or any unlock, and it never writes the report tables (`problems`, `attempts`, `assessments`). Those stay for real Café practice.

## Checking it

Open `/arcade/chefs-rush/?selftest=1` and the page exposes `window.__chef` (`MAKERS`, `SKILLS`, `game`) for scripts that check every ticket type's numbers. It has no effect in normal play.
