# ☄️ Shape Asteroids

**Status: built, Oct 26, 2026.** A Pet Houses game for Khan 6th grade Unit 8 (plane figures). It's at `public/arcade/shape-asteroids/index.html` (one standalone file) and is opened from 🧱 Rooms, the last Unit 8 station (`openAsteroids` in `src/game/game.js`). It's also in the 🕹️ Arcade (`shape-asteroids` in `ARCADE_GAMES`).

## How it plays

- Shape asteroids drift toward Captain Whiskers' ship in the middle, slowly spinning. Each one shows its measurements and dashed heights.
- **Tap an asteroid** (or press Space or Enter on the game) and space freezes. A work panel shows the shape big, with upright labels.
- **⟳ Turn it** turns the shape a quarter turn at a time (an animated turn; instant with reduced motion). **↺ Straighten** puts it back. The panel starts at the angle the asteroid was spinning at, rounded to a quarter turn.
- She has **60 seconds** and **2 tries**. A right answer fires the laser. A wrong first try shows what went wrong (the mix-up) and she tries again.
- A second miss or running out of time shows the worked answer, then the asteroid hits a shield. An asteroid that reaches the ship untapped also hits a shield. There are 3 shields.
- **3 waves** (3, 4 and 5 asteroids). Each wave survived is a ⭐.
  - Wave 1: parallelograms, missing sides of parallelograms, right triangles.
  - Wave 2: base and height, triangles, missing sides of triangles.
  - Wave 3: house fronts (rectangle + roof triangle), L-shaped rooms, and a mix.

## The problems

All 8 Unit 8 skills, using the same ids as Pet Houses (`areaPara`, `paraMissing`, `triBaseHeight`, `areaRightTri`, `areaTri`, `triMissing`, `decompTri`, `areaComposite`), so missed skills line up with the stations. Answers can end in .5, and she can type `17.5`, `17 1/2` or `35/2`. Named mix-ups include: the slanted side used as the height, a forgotten ½ (or a halved parallelogram), multiplying instead of dividing for a missing side, the roof or the cut-out corner forgotten, and perimeter instead of area.

**Tested** at 375 px: 3,000 problems of each kind (every answer a whole number or a .5, every choice question with one right choice, no NaN in any text), a full game played to the end, a miss with its worked answer, and the unit overlay (button only at Rooms, coins, daily cap, day log).

## Pay

- **From Pet Houses** (`?from=houses`): posts `asteroids:result`. Pays 1 Pet World coin per asteroid blasted, up to 20 a day. Saved in `S.asteroids` (best stars, last 30 games with missed skills). The day log gets an `asteroids` event, which counts as math time.
- **From the Arcade** (`?arcadeRun=…`): 1 ticket per wave survived, up to 3.
- It never counts toward station orders, skill mastery, quizzes or unlocks.
