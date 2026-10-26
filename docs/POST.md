# 6th grade: 📮 Pet Post Office

**Status: built (4 stations), Oct 26, 2026.** Khan Academy 6th grade, Unit 10: Volume and surface area. All 10 Khan exercises, each linked, in Khan's order, plus one extra (volume with fractional unit cubes) that Pet World already had. The generators are in `HOUSES2_GEN` in `src/game/game.js` (the name is kept; it was Pet Houses part 2). Read `AGENTS.md` and `NEIGHBORHOODS.md` first. **Edit in place, never rewrite a file.**

The Post Office opens after the Pet Harbor Unit Test (or with the teacher's "Open Pet Post Office for everyone"). The six Unit 10 skills that were Pet Houses stations (📦 Toy Boxes, 🎁 Wrapping Paper) keep their ids, history and mix-ups.

## Stations and skills (Khan's order)

| # | Station | Skills (ids) | Khan |
|---|---|---|---|
| 1 | 🔍 Sorting Room | Identify parts of 3D shapes (`solidParts`), identify geometric solids (`solidId`) | Quiz 1 |
| 2 | 📦 Packing Room | Volume by base area × height (`volBaseHeight`), volume with fractions (`volPrism`), fractional unit cubes (`volCubes`, an extra), volume word problems: fractions & decimals (`volWord`) | Quiz 1 |
| 3 | ✂️ Box Folding | Nets of polyhedra (`netsId`), surface area using nets (`surfaceArea`) | Unit test |
| 4 | 🎁 Wrapping Desk | Expressions to find surface area (`saExpr`), surface area (`surfacePyramid`), surface area word problems (`saWord`). 📮 Parcel Post is here. | Unit test |

## Link fixes

- `volWord` linked the "Volume with fractions" exercise. It now links Khan's "Volume word problems: fractions & decimals" and has that name.
- `volCubes` linked "Volume with fractions" too. Khan's mini-cubes lesson has no practice exercise now, so it links the lesson's article and is kept as an extra.
- `surfacePyramid` linked "Surface area using nets". It now links Khan's "Surface area" exercise and is named "Surface area".

## 3D pictures: `SOLID3D`

`SOLID3D.svg(kind, opts)` draws a solid as an SVG:

- **Polyhedra** (cube, prisms and pyramids with 3 to 6 sides) are turned (`yaw`, `pitch`) and projected. Faces are shaded by the light, and back edges are dashed.
- **Curved solids** (cylinder, cone and sphere) are drawn by hand.
- **Options:** `labels` puts a measurement on an edge. With `parallel:true`, the label goes on the edge of that direction that's on the outline. `slant` draws a pyramid's slant height. `hiF`, `hiE` and `hiV` mark a face, edge or vertex in red.
- **Counts:** `SOLID3D.counts(kind)` gives the faces, edges and vertices, and they always fit F + V − E = 2.
- **Shared:** the same code is copied into Parcel Post, where she spins the parcels.

## What the new skills do

- **Parts of 3D shapes** (`solidParts`):
  - Level 1: name the marked part (face, edge or vertex), or count the faces or vertices of a box, pyramid or triangular prism.
  - Level 2: count faces, edges or vertices of 5 shapes.
  - Level 3: count both edges and vertices of pentagonal and hexagonal prisms and pyramids.
  - Naming another part's count is the `partsWrong` mix-up.
- **Naming solids** (`solidId`):
  - Level 1: cube, rectangular prism, cylinder, cone, sphere and square pyramid.
  - Level 2: prisms and pyramids, with the same-base family as a wrong choice.
  - Level 3: from a description ("2 pentagon bases and 5 rectangle faces"), with no picture.
  - A cube and a rectangular prism never share a question. Mix-up: `solidWrong`.
- **Base area × height** (`volBaseHeight`):
  - Level 1: the base area is given.
  - Level 2: a triangular prism: ½ × b × h, then × the length (answers can end in .5).
  - Level 3: find the height from the volume.
- **Volume word problems** (`volWord`) now also has decimal crates on levels 2 and 3 (like 5.5 m × 4 m × 3 m).
- **Surface area expressions** (`saExpr`):
  - Level 1: a box: 2(lw) + 2(lh) + 2(wh).
  - Level 2: a square pyramid.
  - Level 3: a right-triangle prism.
  - Levels 2 and 3 also find the value. Wrong choices leave out faces, drop the ½, or are the volume.
- **Surface area word problems** (`saWord`):
  - Level 1: a cube gift.
  - Level 2: a toy chest painted on everything but the bottom.
  - Level 3: how much more paper one box needs than another.

**Stress-tested** in the built game: 3,000 problems per skill and level for all 11 skills (99,000). Every choice question has exactly one right choice and no repeats, and every answer is valid. The pictures were checked at 375 px on the chalkboard.

## Think it through

`post:1` is new (prism or pyramid sort, edges of a pentagonal prism, faces/edges/vertices on a box). `post:2` and `post:3` are the old Pet Houses volume and nets sets. `post:4` is new (expression with a "why doubled" part B, a cube gift, painting 5 faces).

## Rewards

🐦 Robin the bluebird, 🦆 Waddles the duck, 🐁 Squeak the mouse, 🦤 Doodle the dodo, 🐻‍❄️ Snowy the polar bear; ✉️ Letter stack, 📬 Mailbox, 📯 Post horn, 🛩️ Mail plane, 📮 Golden mailbox. `npm run verify` now expects 156 rewards.

## Game

📮 Parcel Post (`PARCEL-POST.md`), at the Wrapping Desk and in the Arcade.
