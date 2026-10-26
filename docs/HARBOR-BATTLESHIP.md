# ⚓ Harbor Battleship

**Status: built, Oct 26, 2026.** A Pet Harbor game for Khan 6th grade Unit 9 (the coordinate plane). It's at `public/arcade/harbor-battleship/index.html` (one standalone file), opened from 🛠️ Shipyard, the last Pet Harbor station (`openBattleship` in `src/game/game.js`), and in the 🕹️ Arcade (`harbor-battleship` in `ARCADE_GAMES`).

## How it plays

The harbor is a coordinate plane from −5 to 5. Each side has 5 ships (4, 3, 3, 2 and 2 points long), placed at random. 15 rounds.

- **Her shot** (`pointsId`): she taps a point in the pirates' waters (marked A), then types A's coordinates, with a ± button for negatives. **The cannonball goes where she typed.** If she swaps x and y or flips a sign, it lands there, and the game says what happened.
- **The pirates' shot** (`pointsId`, graphing): the pirates call out coordinates and she taps that point on her own map. A wrong tap is explained (how far right or left, up or down). The shot lands either way.
- **📡 Sonar**, every third round:
  - "Part of a pirate ship is 4 units left of the buoy at (2, −3). What are its coordinates?" (`distPoints`)
  - "How far is the buoy at (−4, 2) from the ship at (5, 2)?" (`coordWord`)
  - A right answer is a free hit.
- **🪝 Salvage**, after she sinks a ship: a net around the wreck is drawn as a dashed rectangle with its corners. She finds its area or perimeter for 💰 treasure (`areaCoord`).
- **The pirates** finish off a ship they've hit 85% of the time; otherwise they fire at random, mostly on a checkerboard.
- **Stars**: ⭐ for hitting more ship parts than the pirates (or sinking them all), ⭐ for sinking 2 or more ships, ⭐ for 80% of answers right.
- On a phone, one map shows at a time (tabs switch between them, and the game switches for each turn). On a wide screen, both maps show side by side.

## Testing

A bot played 180 games in the browser (60 each at 100%, 85% and 60% right answers). No game got stuck, and there were no page errors. About 36 questions a game.

| Right answers | Wins | Average stars |
|---|---|---|
| 100% | 92% | 2.4 |
| 85% | 90% | 2.1 |
| 60% | 78% | 1.0 |

Screenshots were checked at 375 px and 1000 px. The unit overlay was tested too: the button is only at the Shipyard, coins are paid, the daily cap holds, and the day log gets an event.

## Pay

- **From Pet Harbor** (`?from=harbor`): posts `battleship:result`. Pays 1 Pet World coin per right answer, up to 20 a day. Saved in `S.battleship` (best stars, last 30 games with missed skills). The day log gets a `battleship` event, which counts as math time.
- **From the Arcade** (`?arcadeRun=…`): 1 ticket per star, up to 3.
- It never counts toward station orders, skill mastery, quizzes or unlocks.
