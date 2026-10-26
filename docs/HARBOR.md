# 6th grade: ⚓ Pet Harbor

**Status: built (3 stations), Oct 26, 2026.** Khan Academy 6th grade, Unit 9: Coordinate plane. All 7 Khan exercises, each linked, in Khan's order, plus one extra (reflecting points) that Pet World already had. The generators are `HARBOR_GEN` in `src/game/game.js`. Read `AGENTS.md` and `NEIGHBORHOODS.md` first. **Edit in place, never rewrite a file.**

Pet Harbor opens after the Pet Houses Unit Test (or with the teacher's "Open Pet Harbor for everyone"). Until Oct 26, 2026 these skills were Pet Houses stations 4 and 5 (📍 Yard Map, 📏 Fence Lines); their ids, history and mix-ups carry over. The stories now happen at a harbor (buoys, docks, sailboats, an otter).

## Stations and skills (Khan's order)

| # | Station | Skills (ids) | Khan |
|---|---|---|---|
| 1 | 🗼 Lighthouse | Points on the coordinate plane (`pointsId`), quadrants (`graphQuad`), reflecting points (`reflect`, an extra) | Quiz 1 |
| 2 | ⚓ Docks | Distance between points: vertical or horizontal (`distPoints`), coordinate plane problems in all four quadrants (`coordWord`) | Quiz 1 |
| 3 | 🛠️ Shipyard | Drawing polygons with coordinates (`polyDraw`), area and perimeter on the coordinate plane (`areaCoord`), quadrilateral problems on the coordinate plane (`quadCoord`). ⚓ Harbor Battleship is here. | Unit test |

`reflect` isn't in Khan's Unit 9 any more. It's kept as an extra (like the other extras Andy has kept); its link goes to Khan's coordinate plane lesson.

## What the new skills do

- **Drawing polygons** (`polyDraw`):
  - Level 1: four corners are listed, and she picks the picture that shows the polygon. Wrong pictures move one corner by swapping x and y (`coordSwap`) or flipping a sign (`signWrong`).
  - Level 2: three corners of a rectangle, and she picks the fourth.
  - Level 3: she plots the corners on a blank plane (in her head or on paper) and picks the best name: rectangle, right triangle, parallelogram or trapezoid. A right answer never shares a question with a name that's also true (a rectangle is never asked next to "parallelogram").
- **Quadrilateral problems** (`quadCoord`):
  - Level 1: the fourth corner of a rectangle, then the length of a side that crosses an axis.
  - Level 2: rope around a rectangle: length, width, perimeter, then the cost.
  - Level 3: two corners and the area are given; she finds the other side, then the y-coordinate of the other corners (it can be negative).

**Stress-tested** in the built game: 3,000 problems per skill and level for all 8 skills (72,000). Every choice question has exactly one right choice and no repeats, and every answer is valid.

## Think it through

`harbor:1` and `harbor:2` are the old `houses:4` and `houses:5` sets. `harbor:3` is new: the fourth corner of a rectangle, area of a dock across an axis (with a "how do you count across 0" part B), and a short answer on why four points make a square.

## Rewards

🦦 Pip the otter, 🦀 Pinchy the crab, 🐡 Puff the pufferfish, 🦑 Squiggle the squid, 🐳 Captain the whale; 🛟 Life ring, ⚓ Anchor, 🧭 Compass, 🪸 Coral reef, 🚢 Golden ship. With 3 stations, the 4th reward unlocks at the Shipyard. `npm run verify` now expects 146 rewards.

## Game

⚓ Harbor Battleship (`HARBOR-BATTLESHIP.md`), at the Shipyard and in the Arcade.
