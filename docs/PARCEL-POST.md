# 📮 Parcel Post

**Status: built, Oct 26, 2026.** A Pet Post Office game for Khan 6th grade Unit 10 (volume and surface area). It's at `public/arcade/parcel-post/index.html` (one standalone file, with its own copy of `SOLID3D`), opened from 🎁 Wrapping Desk, the last Post Office station (`openParcel` in `src/game/game.js`), and in the 🕹️ Arcade (`parcel-post` in `ARCADE_GAMES`).

## How it plays

It's the holiday rush: put 10 parcels on the truck. Each parcel slides in on a conveyor belt as a 3D shape. **She drags it to spin it** (or uses the ⟲ ⤒ ⤓ ⟳ buttons), and the measurements stay on the edges facing her.

| Job | Khan skill | What she does |
|---|---|---|
| 🔍 Sort it | Identify geometric solids | Name the shape (prisms, pyramids, cube, cylinder, cone, sphere) |
| 🏷️ Label it | Identify parts of 3D shapes | Count faces, edges or vertices (spinning shows the back) |
| 📦 Pack it | Volume with fractions, base area × height | Packing peanuts that fill a box (sides like 1 1/2 ft) or a crate with a given base area |
| 🎁 Wrap it | Surface area | Paper for a box, a tray with no lid, or a square pyramid with its slant height |

- **Order:** the first 4 parcels are sort and label jobs, and the last 6 are pack and wrap jobs.
- **Each parcel:** 90 seconds and 2 tries.
  - A wrong first try says what went wrong: volume instead of surface area, only 3 faces, a missing ½, or another part's count.
  - A miss stamps it ↩️ RETURN TO SENDER, shows the worked answer, and adds a ❌.
- **Answers:** she can type fractions (7 1/2, 15/2) or decimals (7.5).
- **Stars:** 3 ❌ ends the shift early. No ❌ is ⭐⭐⭐, one is ⭐⭐, two is ⭐.

## Testing

- 4,000 parcels of each job were generated. Every choice job has one right choice and no repeats, every answer is a positive number, and every fraction prints and reads back the same.
- Two full shifts were played in the browser, one with every answer right (⭐⭐⭐) and one with every answer wrong (the truck leaves after 3 ❌). There were no page errors.
- Dragging was checked at 375 px.
- In the unit: the button is only at the Wrapping Desk, coins are paid, the daily cap holds, and the day log gets an event.

## Pay

- **From the Post Office** (`?from=post`): posts `parcel:result`. Pays 1 Pet World coin per parcel delivered, up to 20 a day. Saved in `S.parcel` (best stars, last 30 shifts with missed skills). The day log gets a `parcel` event, which counts as math time.
- **From the Arcade** (`?arcadeRun=…`): 1 ticket per star, up to 3.
- It never counts toward station orders, skill mastery, quizzes or unlocks.
