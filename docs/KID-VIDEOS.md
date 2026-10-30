# 🎬 Kid videos: pick a fun video before practice

Owner request, Oct 30, 2026: “Khan videos are really boring. I’d rather see a YouTube page of videos especially for kids that she can choose from.”

## What it does

Today’s video picker (`videoGateThen` → `openVideoPicker` in `src/game/game.js`, docs/VIDEO-GATE.md) now starts each station or lesson with **1 to 4 kid-friendly YouTube videos as picture cards** (thumbnail, title, channel). Khan Academy is still there as one more choice, folded under them (“Khan Academy videos (N)”). Nothing else about the gate changed:

1. **Pick a video.** A kid video plays **inside Pet World** in the same player as Pet World’s own lessons (`openLessonVideo`, `youtube-nocookie.com`, captions on, no related videos from other channels). Khan videos still open in a new tab.
2. **Watch all of it.** While the kid video plays, the time counts for that class (Math, History or Biology) with no taps needed (`ActivityTracker.watching`). Playing 80% of it marks it ✓ watched (`S.videosWatched["kid:<id>"]`), and the card shows “✓ watched”.
3. **Mom’s signature** works as before (`askGrownUp`). If Pet World saw her play the kid video to the end, the sign-off card says so. The day log gets “🎬 Picked a kid video: … (channel)”.

The grown-up override (“no good video today”) and the 🛑 Time to get help lock are unchanged. Her teacher’s own lesson link (`lesson_links`) still comes first in its lesson.

**Where it shows:** every 6th grade math station (50 stations), all 7 Biology practice lessons, and 9 History lessons. Lessons with no kid videos keep the Khan list exactly as before. English units have no Today’s video gate, so they have no kid videos yet (see “Adding videos for a new unit”).

## Changing the videos

**A class (teacher app):** Lessons & questions → **🎬 Kid videos**. Pick a station or lesson, then **Hide / Show**, **↑ / ↓** to reorder, **Add video** (any YouTube link, with the title students see), **Remove** (videos you added), or **Back to Pet World’s list**. Saved per class in `classes.question_edits.videos` (`{"<key>": {hide:[ids], add:[{id,title,channel}], order:[ids]}}`), next to the question-bank edits. **No database change:** `question_edits` is already a JSON column that `my_student()` sends to the game. Students in a class see their teacher’s list, and the in-game editor is hidden for them.

**A family at home (local mode):** in the picker, **🔐 Grown-up: change these videos** (PIN) opens the same editor for the station or lesson at the top. Saved in the town as `S.kidVideoEdits` (cleaned in `normalize()`).

## Where the list lives

`src/shared/kidVideos.ts`:
- `KID_VIDEO_CATALOG`: every video by YouTube id: the short title on the card, the channel, and the title YouTube reported when it was checked.
- `KID_VIDEOS`: the ids for each lesson, best first. Keys match `lesson_links`: `math:<shopId>:<stationId>` for a math station, `<courseId>:<groupId>` for an English, History or Biology lesson block.
- `kidVideoList(key, edits)` applies a class’s or family’s edits; `kidEditToggle / kidEditMove / kidEditAdd / kidEditRemove / kidEditReset` are what both editors call.

`npm run verify` checks that every id in `KID_VIDEOS` is in the catalog, and that the picker and the teacher card are still there.

## Adding videos (rules)

1. **Never invent an id.** Check each one exists first, for example with `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json`, and copy its title and channel (author_name) into the catalog.
2. **Watch out for re-uploads.** Many search results named “Math Antics …” were copies on other channels. Use the official channel (here: author_name `mathantics`).
3. **Real people, not computer voices** (the owner turned down computer-voice placeholder videos). No AI-voice channels.
4. **Short and on the skill:** 3 to 12 minutes, matching the station’s skills, accurate, kid-friendly. A song is welcome as the fun choice, after a teaching video.
5. Add the id to `KID_VIDEO_CATALOG` (in its subject block), then to the lesson’s list in `KID_VIDEOS`, and run `node scripts/verify.mjs`.

### Adding videos for a new unit (English 8 and 9, Butterfly House, Farm Barn)

Nothing in those units’ buildings needs to change. Once a unit is in the shared code:
- **A math-style shop** (in `SHOPS`): add `'math:<shopId>:<stationId>': [ids]` for each station. The picker finds them by itself.
- **A library unit** (English, History, Biology through `englishCourse` / `LESSON_COURSES`): add `'<courseId>:<groupId>': [ids]` for each lesson block.
- **English units** don’t have the Today’s video gate (`videoFirstCourse` is History and Biology only), so their kid videos only show if a button opens the picker (`data-video-pass="<courseId>" data-video-focus="<groupId>"`). The picker already works without the gate: it hides the signature and override steps for an English unit.
- The teacher’s 🎬 Kid videos card lists every key in `KID_VIDEOS` automatically.

## Gaps and judgment calls (for Andy’s review)

- **Thin matches:** Pet Fair 1 (equations from tape and hanger diagrams) and 3 (find the mistake, translate) only have general one-step equation videos; Pet Show 1 (statistical questions) and 6 (shape of distributions) have no video on exactly that skill; Market 2 (intro to percents) uses “Fractions to percents.” Khan is still there for those.
- **Crash Course World History / History of Science** (Mesopotamia, Egypt, Indus, Silk Road, Mongols, Columbian Exchange, Industrial Revolution) is accurate and lively but made for teens: fast, jokey, about 10 to 12 minutes. Kid-level choices sit first where one was found (Learn Bright, Bedtime History). A teacher or parent can hide any of them.
- **Lengths:** YouTube’s oEmbed doesn’t give a length, so cards show no minutes. Most Math with Mr. J and Math Antics videos run about 4 to 12 minutes.
- History Units 1, 2, 4 (most lessons), 5 (most), 7 (most), 8 (most) and 9 have no kid videos yet; they keep Khan.
- **Thumbnails** load from `i.ytimg.com` (YouTube’s image server) when the picker opens. No player loads until she picks a video.

## Tested (Oct 30, 2026, Playwright at 375px, esbuild stand-in build)

- **Math (Pet Harbor), 22 of 22 checks:** the picker opens from Open for business, with station 1’s kid cards first and Khan folded. The signature stays locked until a pick. Picking a card opens the player with `youtube-nocookie.com/embed/pl9nSVzRWvA`, and the picker hides under it. Pretend player messages for 40 s of a 45 s video marked it watched and added 30 s of Math time with no taps. Closing the video brings the picker back with the signature open. The sign-off says “Pet World saw her play it to the end,” the PIN saves the pass, the shift starts, and the day log has the pick and the signature. Grown-up editor (Pet Show 3): the PIN opens it; hide, move and add work, a bad link is refused, the picker shows the new order, the edits are saved in `S.kidVideoEdits` and kept after a reload. No sideways scroll and no page errors.
- **History 3 and Biology 1, 5 of 5:** the banner shows, and the focused lesson shows its kid videos (Mesopotamia, digestive system).
- **Class mode (pretend backend), 3 of 3:** the teacher’s `question_edits.videos` (one hidden, one added) apply in the game; the family editor is hidden; no errors.
- **Teacher card (renderLessons in a test page), 7 of 7:** lists a station’s videos; hide, move and add save to `question_edits.videos`; a bad link is refused; Back to Pet World’s list clears the edits.
- **Not tested here:** real YouTube playback and thumbnails (YouTube can’t be reached from the test machine, so the player was stubbed and fed the same messages YouTube sends); the real teacher app with Supabase sign-in; `npm run typecheck` and `npm run build` (Vite isn’t installed here: the changed TS files were typechecked with `tsc` and `types: []`).

## Videos by lesson

| Key | Station or lesson | Kid videos (in order) |
|---|---|---|
| `math:cafe:1` | ☕ Pet Café 1. The Counter | [What are ratios?](https://www.youtube.com/watch?v=xA435umOQuw) (Math with Mr. J)<br>[Ratios and rates](https://www.youtube.com/watch?v=RQ2nYUBVvqI) (Math Antics)<br>[The Ratios Song](https://www.youtube.com/watch?v=zTiw-uP8q5w) (Numberock) |
| `math:cafe:2` | ☕ Pet Café 2. Recipe Cards | [Double number line diagrams](https://www.youtube.com/watch?v=3eHhG9qZjz0) (Infinite Math)<br>[Equivalent ratios explained](https://www.youtube.com/watch?v=f2kvrjB8AXE) (Math with Mr. J)<br>[The Ratios Song](https://www.youtube.com/watch?v=zTiw-uP8q5w) (Numberock) |
| `math:cafe:3` | ☕ Pet Café 3. The Kitchen | [Equivalent ratios explained](https://www.youtube.com/watch?v=f2kvrjB8AXE) (Math with Mr. J)<br>[Ratios and rates](https://www.youtube.com/watch?v=RQ2nYUBVvqI) (Math Antics)<br>[The Ratios Song](https://www.youtube.com/watch?v=zTiw-uP8q5w) (Numberock) |
| `math:cafe:4` | ☕ Pet Café 4. Deliveries | [Two-variable relationships: tables and graphs](https://www.youtube.com/watch?v=irTELw5ZYYY) (Easy Math with Mrs. Easley)<br>[What are ratios?](https://www.youtube.com/watch?v=xA435umOQuw) (Math with Mr. J)<br>[Ratios and rates](https://www.youtube.com/watch?v=RQ2nYUBVvqI) (Math Antics) |
| `math:bakery:1` | 🥐 Bakery 1. The Scale | [Adding and subtracting decimals](https://www.youtube.com/watch?v=PnwLv6khwk8) (Math with Mr. J)<br>[Decimals: add, subtract, multiply, divide](https://www.youtube.com/watch?v=4LoiWzqvFG4) (Math with Mr. J) |
| `math:bakery:2` | 🥐 Bakery 2. Sharing Pans | [Divide a fraction by a whole number](https://www.youtube.com/watch?v=fOxNP9nfiSM) (Math with Mr. J)<br>[Divide a whole number by a fraction](https://www.youtube.com/watch?v=OSFxuPw2N8w) (Math with Mr. J) |
| `math:bakery:3` | 🥐 Bakery 3. Boxing Treats | [Divide a fraction by a fraction](https://www.youtube.com/watch?v=RAKwouL-lTc) (Math with Mr. J)<br>[Dividing mixed numbers](https://www.youtube.com/watch?v=7fp1VvFL1vM) (Math with Mr. J)<br>[Divide a whole number by a fraction](https://www.youtube.com/watch?v=OSFxuPw2N8w) (Math with Mr. J) |
| `math:bakery:4` | 🥐 Bakery 4. The Register | [Multiplying decimals](https://www.youtube.com/watch?v=ONX0k3x6KwM) (Math with Mr. J)<br>[Long division with 2-digit divisors](https://www.youtube.com/watch?v=dGSygRHDE7k) (Math with Mr. J)<br>[Long division, step by step](https://www.youtube.com/watch?v=HJYHNxS64f0) (Math with Mr. J) |
| `math:bakery:5` | 🥐 Bakery 5. Bulk Orders | [Dividing decimals by whole numbers](https://www.youtube.com/watch?v=Sah_q6YkF5o) (Math with Mr. J)<br>[Divide a decimal by a decimal](https://www.youtube.com/watch?v=Val4TmjHXRY) (Math with Mr. J)<br>[Multiplying and dividing decimals](https://www.youtube.com/watch?v=IuUpcCKTJBk) (Math with Mr. J) |
| `math:market:1` | 🍎 Market Stall 1. Price Tags | [Unit rates](https://www.youtube.com/watch?v=VrsDrMsPb8g) (Math with Mr. J)<br>[Unit rate word problems](https://www.youtube.com/watch?v=dcSYoFFSXQk) (Math with Mr. J)<br>[Ratios and rates](https://www.youtube.com/watch?v=RQ2nYUBVvqI) (Math Antics) |
| `math:market:2` | 🍎 Market Stall 2. Percent Signs | [Fractions to percents](https://www.youtube.com/watch?v=XXf4wHb2lYc) (Math with Mr. J)<br>[Fractions, decimals and percents](https://www.youtube.com/watch?v=2vjbNZaFz3c) (Math with Mr. J) |
| `math:market:3` | 🍎 Market Stall 3. Sale Signs | [Fractions, decimals and percents](https://www.youtube.com/watch?v=2vjbNZaFz3c) (Math with Mr. J)<br>[Fractions to percents](https://www.youtube.com/watch?v=XXf4wHb2lYc) (Math with Mr. J)<br>[Find a percent of a number](https://www.youtube.com/watch?v=IYEjOP_-Hpo) (Math with Mr. J) |
| `math:market:4` | 🍎 Market Stall 4. Discount Bin | [Find a percent of a number](https://www.youtube.com/watch?v=IYEjOP_-Hpo) (Math with Mr. J)<br>[Percent problems: find the part](https://www.youtube.com/watch?v=P7L4_9eim2k) (Math with Mr. J)<br>[Percent word problems](https://www.youtube.com/watch?v=YXpZhN6iwXI) (Math with Mr. J) |
| `math:clock:1` | 🕰️ Clock Tower 1. Chimes | [Intro to exponents](https://www.youtube.com/watch?v=-zUmvpkhvW8) (Math Antics)<br>[Exponents and square roots](https://www.youtube.com/watch?v=B4zejSI8zho) (Math Antics) |
| `math:clock:2` | 🕰️ Clock Tower 2. Gears | [Order of operations](https://www.youtube.com/watch?v=dAgfnK528RA) (Math Antics)<br>[The Order of Operations Song](https://www.youtube.com/watch?v=BdgcItiemoY) (Silly School Songs) |
| `math:clock:3` | 🕰️ Clock Tower 3. Clock Face | [Order of operations with exponents](https://www.youtube.com/watch?v=xLcgug8iEYY) (Math with Mr. J)<br>[Order of operations](https://www.youtube.com/watch?v=dAgfnK528RA) (Math Antics)<br>[The Order of Operations Song](https://www.youtube.com/watch?v=BdgcItiemoY) (Silly School Songs) |
| `math:rink:1` | ⛸️ Ice Rink 1. Thermometer | [What are integers?](https://www.youtube.com/watch?v=DDmMfTEbdqE) (Math with Mr. J)<br>[The Integers Song (with absolute value)](https://www.youtube.com/watch?v=u69pYSdwugo) (Numberock)<br>[Opposites and absolute value](https://www.youtube.com/watch?v=q4iUbeN7xV4) (Buffington (Simplifying Math)) |
| `math:rink:2` | ⛸️ Ice Rink 2. Rink Lines | [Rational numbers on a number line](https://www.youtube.com/watch?v=SuWXNsOK7vE) (Math with Mr. J)<br>[Compare rational numbers on a number line](https://www.youtube.com/watch?v=-ZTF9ffbNwo) (Math with Mr. J) |
| `math:rink:3` | ⛸️ Ice Rink 3. Race Board | [Compare rational numbers on a number line](https://www.youtube.com/watch?v=-ZTF9ffbNwo) (Math with Mr. J)<br>[Compare rational numbers](https://www.youtube.com/watch?v=d8Q7w4cZLtk) (Math with Mr. J) |
| `math:rink:4` | ⛸️ Ice Rink 4. Podium | [Order rational numbers on a number line](https://www.youtube.com/watch?v=GJVKUXHiVQc) (Math with Mr. J)<br>[Compare rational numbers](https://www.youtube.com/watch?v=d8Q7w4cZLtk) (Math with Mr. J) |
| `math:rink:5` | ⛸️ Ice Rink 5. Ice Depth | [What is absolute value?](https://www.youtube.com/watch?v=LnfhdtjcpVY) (Math with Mr. J)<br>[The Integers Song (with absolute value)](https://www.youtube.com/watch?v=u69pYSdwugo) (Numberock)<br>[Opposites and absolute value](https://www.youtube.com/watch?v=q4iUbeN7xV4) (Buffington (Simplifying Math)) |
| `math:rink:6` | ⛸️ Ice Rink 6. Weather Station | [What is absolute value?](https://www.youtube.com/watch?v=LnfhdtjcpVY) (Math with Mr. J)<br>[Opposites and absolute value](https://www.youtube.com/watch?v=q4iUbeN7xV4) (Buffington (Simplifying Math)) |
| `math:potion:1` | 🧪 Potion Lab 1. Ingredients | [All about terms](https://www.youtube.com/watch?v=7myEtGPZZjs) (Math with Mr. J)<br>[Evaluating expressions](https://www.youtube.com/watch?v=k-KiWkV81fQ) (Math with Mr. J)<br>[Evaluating expressions with exponents](https://www.youtube.com/watch?v=Fu_TstXlHsE) (Math with Mr. J) |
| `math:potion:2` | 🧪 Potion Lab 2. Test Tubes | [Evaluating expressions with two variables](https://www.youtube.com/watch?v=GheEHcAvdKA) (Math with Mr. J)<br>[Evaluating expressions](https://www.youtube.com/watch?v=k-KiWkV81fQ) (Math with Mr. J) |
| `math:potion:3` | 🧪 Potion Lab 3. Recipe Cards | [Writing expressions (one operation)](https://www.youtube.com/watch?v=4FMDqirfXIs) (Math with Mr. J)<br>[Writing expressions with variables](https://www.youtube.com/watch?v=o_Ubm7OI8t4) (Math with Mr. J) |
| `math:potion:4` | 🧪 Potion Lab 4. Mixing Bowl | [LCM vs. GCF](https://www.youtube.com/watch?v=Y7Xav-XAhXs) (Math with Mr. J)<br>[GCF and LCM: a complete guide](https://www.youtube.com/watch?v=oJo2M6KovGM) (Math with Mr. J)<br>[Intro to the distributive property](https://www.youtube.com/watch?v=CTw40jSAUx0) (Math with Mr. J) |
| `math:potion:5` | 🧪 Potion Lab 5. Cauldron | [The distributive property, step by step](https://www.youtube.com/watch?v=Jkb1-ekHTg4) (Math with Mr. J)<br>[Intro to the distributive property](https://www.youtube.com/watch?v=CTw40jSAUx0) (Math with Mr. J) |
| `math:potion:6` | 🧪 Potion Lab 6. Potion Shelf | [Combining like terms](https://www.youtube.com/watch?v=eNv4fHb7OvU) (Math with Mr. J)<br>[All about terms](https://www.youtube.com/watch?v=7myEtGPZZjs) (Math with Mr. J) |
| `math:fair:1` | 🎡 Pet Fair 1. Ticket Booth | [How to solve one-step equations](https://www.youtube.com/watch?v=jZ3_1IUSYGg) (Math with Mr. J) |
| `math:fair:2` | 🎡 Pet Fair 2. Ring Toss | [One-step equations: adding and subtracting](https://www.youtube.com/watch?v=KUnsabZDGzU) (Math with Mr. J)<br>[How to solve one-step equations](https://www.youtube.com/watch?v=jZ3_1IUSYGg) (Math with Mr. J) |
| `math:fair:3` | 🎡 Pet Fair 3. Story Tent | [How to solve one-step equations](https://www.youtube.com/watch?v=jZ3_1IUSYGg) (Math with Mr. J)<br>[One-step equations: adding and subtracting](https://www.youtube.com/watch?v=KUnsabZDGzU) (Math with Mr. J) |
| `math:fair:4` | 🎡 Pet Fair 4. Ride Line | [Inequalities on a number line](https://www.youtube.com/watch?v=-Xq6lREUm1E) (Math with Mr. J)<br>[Graphing inequalities](https://www.youtube.com/watch?v=n02r9ZKAi0I) (Math with Mr. J) |
| `math:fair:5` | 🎡 Pet Fair 5. Ferris Wheel | [Independent and dependent variables](https://www.youtube.com/watch?v=oMBfnV_VsDc) (Mrs.D Math)<br>[Two-variable relationships: tables and graphs](https://www.youtube.com/watch?v=irTELw5ZYYY) (Easy Math with Mrs. Easley) |
| `math:fair:6` | 🎡 Pet Fair 6. Prize Counter | [Two-variable relationships: tables and graphs](https://www.youtube.com/watch?v=irTELw5ZYYY) (Easy Math with Mrs. Easley)<br>[Independent and dependent variables](https://www.youtube.com/watch?v=oMBfnV_VsDc) (Mrs.D Math) |
| `math:houses:1` | 🏡 Pet Houses 1. Floor Plans | [Area of parallelograms](https://www.youtube.com/watch?v=uj6k22WubCk) (Math with Mr. J)<br>[Area](https://www.youtube.com/watch?v=xCdxURXMdFY) (Math Antics)<br>[Area of parallelograms, triangles and trapezoids](https://www.youtube.com/watch?v=wv71DpNgW44) (Easy Math with Mrs. Easley) |
| `math:houses:2` | 🏡 Pet Houses 2. Roof Lines | [Area of a triangle](https://www.youtube.com/watch?v=-ZPfB1uDjEw) (Math with Mr. J)<br>[Area of parallelograms, triangles and trapezoids](https://www.youtube.com/watch?v=wv71DpNgW44) (Easy Math with Mrs. Easley)<br>[Area](https://www.youtube.com/watch?v=xCdxURXMdFY) (Math Antics) |
| `math:houses:3` | 🏡 Pet Houses 3. Rooms | [Area of composite figures](https://www.youtube.com/watch?v=bo483Varm-U) (Math with Mr. J)<br>[Area of parallelograms, triangles and trapezoids](https://www.youtube.com/watch?v=wv71DpNgW44) (Easy Math with Mrs. Easley) |
| `math:harbor:1` | ⚓ Pet Harbor 1. Lighthouse | [The four quadrants](https://www.youtube.com/watch?v=uc9hWu73Phw) (Math with Mr. J)<br>[Plotting points in all 4 quadrants](https://www.youtube.com/watch?v=pl9nSVzRWvA) (Math with Mr. J) |
| `math:harbor:2` | ⚓ Pet Harbor 2. Docks | [Plotting points in all 4 quadrants](https://www.youtube.com/watch?v=pl9nSVzRWvA) (Math with Mr. J)<br>[Area and perimeter on the coordinate plane](https://www.youtube.com/watch?v=ePvzgXzkk-Q) (Eat Pi) |
| `math:harbor:3` | ⚓ Pet Harbor 3. Shipyard | [Area and perimeter on the coordinate plane](https://www.youtube.com/watch?v=ePvzgXzkk-Q) (Eat Pi)<br>[Plotting points in all 4 quadrants](https://www.youtube.com/watch?v=pl9nSVzRWvA) (Math with Mr. J) |
| `math:post:1` | 📮 Pet Post Office 1. Sorting Room | [Faces, edges and vertices](https://www.youtube.com/watch?v=_74Izrb982g) (Math with Mr. J)<br>[What’s a net?](https://www.youtube.com/watch?v=HBSLrN9LWBA) (Math with Mr. J) |
| `math:post:2` | 📮 Pet Post Office 2. Packing Room | [Volume of rectangular prisms](https://www.youtube.com/watch?v=By7sVb2IhFs) (Math with Mr. J)<br>[Volume with fractional edge lengths](https://www.youtube.com/watch?v=Z05gjC-7lBQ) (IconMath)<br>[Volume](https://www.youtube.com/watch?v=qJwecTgce6c) (Math Antics) |
| `math:post:3` | 📮 Pet Post Office 3. Box Folding | [What’s a net?](https://www.youtube.com/watch?v=HBSLrN9LWBA) (Math with Mr. J)<br>[Surface area of a rectangular prism](https://www.youtube.com/watch?v=dCD02kuobnY) (Math with Mr. J) |
| `math:post:4` | 📮 Pet Post Office 4. Wrapping Desk | [Surface area of a rectangular prism](https://www.youtube.com/watch?v=dCD02kuobnY) (Math with Mr. J)<br>[What’s a net?](https://www.youtube.com/watch?v=HBSLrN9LWBA) (Math with Mr. J) |
| `math:show:1` | 🏆 Pet Show 1. Sign-In Desk | [Frequency tables and dot plots](https://www.youtube.com/watch?v=ZQ5cXMx3Db0) (Math with Mr. J)<br>[Histograms and frequency tables](https://www.youtube.com/watch?v=fnJAB4v2HL4) (Easy Math with Mrs. Easley) |
| `math:show:2` | 🏆 Pet Show 2. Judges' Table | [Histograms and frequency tables](https://www.youtube.com/watch?v=fnJAB4v2HL4) (Easy Math with Mrs. Easley)<br>[Frequency tables and dot plots](https://www.youtube.com/watch?v=ZQ5cXMx3Db0) (Math with Mr. J) |
| `math:show:3` | 🏆 Pet Show 3. Score Cards | [How to find the mean](https://www.youtube.com/watch?v=H7u0Zrra060) (Math with Mr. J)<br>[Finding the median](https://www.youtube.com/watch?v=Y7M_KNwIZvw) (Math with Mr. J)<br>[The mean from a dot plot](https://www.youtube.com/watch?v=1aJthSNuJqA) (Math with Mr. J)<br>[Blazer Fresh: Mean, Median, Mode and Range](https://www.youtube.com/watch?v=LeKbUZ954lE) (GoNoodle) |
| `math:show:4` | 🏆 Pet Show 4. Tie Breakers | [How to find the mean](https://www.youtube.com/watch?v=H7u0Zrra060) (Math with Mr. J)<br>[Blazer Fresh: Mean, Median, Mode and Range](https://www.youtube.com/watch?v=LeKbUZ954lE) (GoNoodle) |
| `math:show:5` | 🏆 Pet Show 5. Ribbon Ranges | [Interquartile range (IQR)](https://www.youtube.com/watch?v=VABsJBw1JqA) (Math with Mr. J)<br>[Box and whisker plots explained](https://www.youtube.com/watch?v=nV8jR8M8C74) (Math with Mr. J)<br>[Mean absolute deviation (MAD)](https://www.youtube.com/watch?v=AQsmbvsictA) (Math with Mr. J) |
| `math:show:6` | 🏆 Pet Show 6. Best in Show | [Box and whisker plots explained](https://www.youtube.com/watch?v=nV8jR8M8C74) (Math with Mr. J)<br>[Histograms and frequency tables](https://www.youtube.com/watch?v=fnJAB4v2HL4) (Easy Math with Mrs. Easley) |
| `bio1:cells` | bio1:cells | [Dr. Binocs: the human cell](https://www.youtube.com/watch?v=8vo59AKzU4Q) (Peekaboo Kidz) |
| `bio1:plants` | bio1:plants | [Flowers and their pollinators](https://www.youtube.com/watch?v=pnBoM4idf1k) (SciShow Kids)<br>[How do plant seeds travel?](https://www.youtube.com/watch?v=WqgVks9NViQ) (SciShow Kids) |
| `bio1:digestion` | bio1:digestion | [Dr. Binocs: the digestive system](https://www.youtube.com/watch?v=ZBZWgrfZFbU) (Peekaboo Kidz)<br>[The digestive system](https://www.youtube.com/watch?v=1UvuBYUbFk0) (Amoeba Sisters) |
| `bio2:traits` | bio2:traits | [DNA, genes and traits: intro to heredity](https://www.youtube.com/watch?v=8m6hHRlKwxY) (Amoeba Sisters) |
| `bio2:growth` | bio2:growth | [Who needs dirt? (what plants need)](https://www.youtube.com/watch?v=eCSIrlk0GTs) (Crash Course Kids)<br>[Flowers and their pollinators](https://www.youtube.com/watch?v=pnBoM4idf1k) (SciShow Kids)<br>[How do plant seeds travel?](https://www.youtube.com/watch?v=WqgVks9NViQ) (SciShow Kids) |
| `bio3:photo3` | bio3:photo3 | [Dr. Binocs: photosynthesis](https://www.youtube.com/watch?v=D1Ymc311XS8) (Peekaboo Kidz)<br>[Photosynthesis](https://www.youtube.com/watch?v=CMiPYHNNg28) (Amoeba Sisters) |
| `bio3:food3` | bio3:food3 | [Feed me: producers and consumers](https://www.youtube.com/watch?v=AHCOzc143Ec) (Crash Course Kids)<br>[Cellular respiration](https://www.youtube.com/watch?v=eJ9Zjc-jdys) (Amoeba Sisters)<br>[Dr. Binocs: ecosystems](https://www.youtube.com/watch?v=sKJoXdrOT70) (Peekaboo Kidz) |
| `history3:mesopotamia` | history3:mesopotamia | [Ancient Mesopotamia for kids](https://www.youtube.com/watch?v=EHkAGKgoyGo) (Learn Bright)<br>[Mesopotamia (Crash Course)](https://www.youtube.com/watch?v=sohXPx_XZ6Y) (CrashCourse) |
| `history3:egyptNubia` | history3:egyptNubia | [Ancient Egypt for kids](https://www.youtube.com/watch?v=zYxC14pCaJ0) (Learn Bright)<br>[Ancient Egypt (Crash Course)](https://www.youtube.com/watch?v=Z3Wvw6BivVI) (CrashCourse) |
| `history3:ancientIndia` | history3:ancientIndia | [The Indus River Valley for kids](https://www.youtube.com/watch?v=6LUiHBroEy4) (Bedtime History)<br>[Indus Valley Civilization (Crash Course)](https://www.youtube.com/watch?v=n7ndRwqJYDM) (CrashCourse) |
| `history4:romeAndHan` | history4:romeAndHan | [Ancient Rome for kids](https://www.youtube.com/watch?v=Wo0KujQEJ_s) (Learn Bright) |
| `history5:silk5` | history5:silk5 | [The Silk Road (Crash Course)](https://www.youtube.com/watch?v=vfe-eNq-Qyg) (CrashCourse) |
| `history6:mongol6` | history6:mongol6 | [The Mongols (Crash Course)](https://www.youtube.com/watch?v=szxPar0BcMo) (CrashCourse) |
| `history6:columbian6` | history6:columbian6 | [The Columbian Exchange (Crash Course)](https://www.youtube.com/watch?v=UC5km6-o2oM) (CrashCourse) |
| `history7:industry7` | history7:industry7 | [The Industrial Revolution (Crash Course)](https://www.youtube.com/watch?v=FCpqN7GmLYk) (CrashCourse) |
| `history8:causes8` | history8:causes8 | [World War I for kids](https://www.youtube.com/watch?v=RBtyaelrgmg) (Bedtime History) |

## Verified catalog (oEmbed, Oct 30, 2026)

| YouTube id | Title as YouTube reported it | Channel |
|---|---|---|
| `xA435umOQuw` | Introduction to Ratios (What Are Ratios?) / Ratio Examples and Answers | Math with Mr. J |
| `RQ2nYUBVvqI` | Math Antics - Ratios And Rates | Math Antics |
| `zTiw-uP8q5w` | Ratios Song / 6th Grade Animated Music Video by NUMBEROCK | Numberock |
| `f2kvrjB8AXE` | Equivalent Ratios Explained / Finding Equivalent Ratios / Math with Mr. J | Math with Mr. J |
| `3eHhG9qZjz0` | Double Number Line Diagrams / Infinite-Math.com | Infinite Math |
| `irTELw5ZYYY` | 2 VARIABLE RELATIONSHIPS [Tables and Coordinate Grid Graphing] 6th Grade Math | Easy Math with Mrs. Easley |
| `VrsDrMsPb8g` | Unit Rates / Solving Unit Rate Problems | Math with Mr. J |
| `dcSYoFFSXQk` | Solving Unit Rate Word Problems / Math with Mr. J | Math with Mr. J |
| `XXf4wHb2lYc` | Fractions to Percents / Math with Mr. J | Math with Mr. J |
| `2vjbNZaFz3c` | Converting Between Fractions, Decimals, and Percents / A Mini Course / Math with Mr. J | Math with Mr. J |
| `IYEjOP_-Hpo` | How to Find a Percent of a Number / Example #2 / Math with Mr. J | Math with Mr. J |
| `P7L4_9eim2k` | Solving Percent Problems Using the Percent Equation (Finding the Part) / Math with Mr. J | Math with Mr. J |
| `YXpZhN6iwXI` | Percent Word Problems / Solving Percent Problems Using the Percent Equation | Math with Mr. J |
| `PnwLv6khwk8` | Adding and Subtracting Decimals (How to) / Math with Mr. J | Math with Mr. J |
| `4LoiWzqvFG4` | How to Add, Subtract, Multiply, and Divide Decimals / A Review of Decimals / Math with Mr. J | Math with Mr. J |
| `fOxNP9nfiSM` | How to Divide a Fraction by a Whole Number / Math with Mr. J | Math with Mr. J |
| `OSFxuPw2N8w` | Dividing Whole Numbers by Fractions / How to Divide Whole Numbers by Fractions | Math with Mr. J |
| `RAKwouL-lTc` | How to Divide a Fraction by a Fraction / Math with Mr. J | Math with Mr. J |
| `7fp1VvFL1vM` | Dividing Mixed Numbers: A Step-By-Step Review / How to Divide Mixed Numbers / Math with Mr. J | Math with Mr. J |
| `ONX0k3x6KwM` | Multiplying Decimals Explained: A Step-By-Step Review / Understanding Decimal Multiplication | Math with Mr. J |
| `dGSygRHDE7k` | Long Division with 2-Digit Divisors / Dividing by a 2-Digit Number | Math with Mr. J |
| `HJYHNxS64f0` | Long Division: A Step-By-Step Review / How to do Long Division / Math with Mr. J | Math with Mr. J |
| `Sah_q6YkF5o` | Dividing Decimals - Whole Number Divisors / 5th Grade Math | Math with Mr. J |
| `Val4TmjHXRY` | How to Divide a Decimal by a Decimal / Math with Mr. J | Math with Mr. J |
| `IuUpcCKTJBk` | Multiplying and Dividing Decimals: A Step-By-Step Review / How to Multiply and Divide Decimals | Math with Mr. J |
| `-zUmvpkhvW8` | Math Antics - Intro To Exponents (aka Indices) | Math Antics |
| `B4zejSI8zho` | Math Antics - Exponents and Square Roots | Math Antics |
| `dAgfnK528RA` | Math Antics - Order Of Operations | Math Antics |
| `BdgcItiemoY` | The Order of Operations Song (PEMDAS) / Silly School Songs - Educational Math Video | Silly School Songs |
| `xLcgug8iEYY` | Order of Operations with Exponents / Math with Mr. J | Math with Mr. J |
| `DDmMfTEbdqE` | What are Integers? / Math with Mr. J | Math with Mr. J |
| `u69pYSdwugo` | Integers Song: With Introduction to Absolute Value | Numberock |
| `q4iUbeN7xV4` | Opposites and Absolute Value / Simplifying Math | Buffington (Simplifying Math) |
| `SuWXNsOK7vE` | Graphing Rational Numbers on a Number Line / Math with Mr. J | Math with Mr. J |
| `-ZTF9ffbNwo` | How to Compare Rational Numbers Using a Number Line / Math with Mr. J | Math with Mr. J |
| `d8Q7w4cZLtk` | How to Compare Rational Numbers / With & Without a Number Line / Math with Mr. J | Math with Mr. J |
| `GJVKUXHiVQc` | How to Order Rational Numbers Using a Number Line / Math with Mr. J | Math with Mr. J |
| `LnfhdtjcpVY` | What is Absolute Value? / Absolute Value Examples / Math with Mr. J | Math with Mr. J |
| `7myEtGPZZjs` | All About Terms / Identifying, Counting, & Combining / Algebra / Math with Mr. J | Math with Mr. J |
| `k-KiWkV81fQ` | Intro to Evaluating Algebraic Expressions / How to Evaluate Algebraic Expressions / Math with Mr. J | Math with Mr. J |
| `Fu_TstXlHsE` | Evaluating Algebraic Expressions with Exponents / Math with Mr. J | Math with Mr. J |
| `GheEHcAvdKA` | Evaluating Expressions with Two Variables: A Step-By-Step Guide / Algebraic Expressions | Math with Mr. J |
| `4FMDqirfXIs` | Writing Algebraic Expressions (One Operation) / Math with Mr. J | Math with Mr. J |
| `o_Ubm7OI8t4` | Writing Algebraic Expressions / Writing Expressions with Variables / Math with Mr. J | Math with Mr. J |
| `Y7Xav-XAhXs` | Least Common Multiples vs. Greatest Common Factors (LCM vs. GCF) / Math with Mr. J | Math with Mr. J |
| `oJo2M6KovGM` | GCF and LCM / A Complete Guide / Math with Mr. J | Math with Mr. J |
| `CTw40jSAUx0` | An Intro to the Distributive Property / Simplifying Expressions / Math with Mr. J | Math with Mr. J |
| `Jkb1-ekHTg4` | The Distributive Property Explained / A Step-By-Step Guide / Algebraic Expressions / Math with Mr. J | Math with Mr. J |
| `eNv4fHb7OvU` | An Intro to Combining Like Terms / Simplifying Expressions by Combining Like Terms / Math with Mr. J | Math with Mr. J |
| `jZ3_1IUSYGg` | How to Solve One-Step Equations / An Introductory Guide / Algebra | Math with Mr. J |
| `KUnsabZDGzU` | How to Solve One-Step Equations (Addition and Subtraction) / Math with Mr. J | Math with Mr. J |
| `-Xq6lREUm1E` | An Intro to Inequalities on a Number Line / Graphing & Writing / Math with Mr. J | Math with Mr. J |
| `n02r9ZKAi0I` | Graphing Inequalities on Number Lines / Math with Mr. J | Math with Mr. J |
| `oMBfnV_VsDc` | Independent & Dependent Variables / 6th Grade Math | Mrs.D Math |
| `xCdxURXMdFY` | Math Antics - Area | Math Antics |
| `uj6k22WubCk` | Area of Parallelograms / How to Find the Area of a Parallelogram | Math with Mr. J |
| `wv71DpNgW44` | AREA [Parallelograms, Triangles, and Trapezoids] 6th Grade Math | Easy Math with Mrs. Easley |
| `-ZPfB1uDjEw` | Finding the Area of a Triangle / A Step-By-Step Guide / Math with Mr. J | Math with Mr. J |
| `bo483Varm-U` | Finding the Area of Composite Figures with Triangles / Math with Mr. J | Math with Mr. J |
| `uc9hWu73Phw` | Quadrants of the Coordinate Plane / What are the Four Quadrants? / Math with Mr. J | Math with Mr. J |
| `pl9nSVzRWvA` | Plotting Points on a Coordinate Plane / All 4 Quadrants | Math with Mr. J |
| `ePvzgXzkk-Q` | Area & Perimeter in the Coordinate Plane / Geometry / Eat Pi | Eat Pi |
| `_74Izrb982g` | Faces, Edges, & Vertices / 5th Grade Math | Math with Mr. J |
| `HBSLrN9LWBA` | What's a Net? / Geometry / Math with Mr. J | Math with Mr. J |
| `By7sVb2IhFs` | Volume of Rectangular Prisms / Math with Mr. J | Math with Mr. J |
| `qJwecTgce6c` | Math Antics - Volume | Math Antics |
| `Z05gjC-7lBQ` | Volume with Fractional Edge Lengths | IconMath |
| `dCD02kuobnY` | How to Find the Surface Area of a Rectangular Prism / Math with Mr. J | Math with Mr. J |
| `ZQ5cXMx3Db0` | Frequency Tables and Dot Plots / Math with Mr. J | Math with Mr. J |
| `fnJAB4v2HL4` | HISTOGRAMS [and Frequency Tables] 6th Grade Math | Easy Math with Mrs. Easley |
| `H7u0Zrra060` | How to Find the Mean / Math with Mr. J | Math with Mr. J |
| `Y7M_KNwIZvw` | Finding the Median / Math with Mr. J | Math with Mr. J |
| `1aJthSNuJqA` | How to Find the Mean from a Dot Plot / Math with Mr. J | Math with Mr. J |
| `LeKbUZ954lE` | Learn Math With Blazer Fresh - Mean, Median, Mode and Range / Songs For Kids / Sing Along / GoNoodle | GoNoodle |
| `VABsJBw1JqA` | Interquartile Range (IQR) / Math with Mr. J | Math with Mr. J |
| `nV8jR8M8C74` | Box and Whisker Plots Explained / Understanding Box and Whisker Plots (Box Plots) / Math with Mr. J | Math with Mr. J |
| `AQsmbvsictA` | Mean Absolute Deviation (MAD) / Math with Mr. J | Math with Mr. J |
| `8vo59AKzU4Q` | HUMAN CELL - The Dr. Binocs Show / Best Learning Videos For Kids / Peekaboo Kidz | Peekaboo Kidz |
| `pnBoM4idf1k` | Flowers and Their Pollinators: A Perfect Match! / Spring is Here! / SciShow Kids | SciShow Kids |
| `WqgVks9NViQ` | How Do Plant Seeds Travel? / Spring is Here! / SciShow Kids | SciShow Kids |
| `ZBZWgrfZFbU` | Digestive System / The Dr. Binocs Show / Learn Videos For Kids | Peekaboo Kidz |
| `1UvuBYUbFk0` | Digestive System | Amoeba Sisters |
| `8m6hHRlKwxY` | DNA, Chromosomes, Genes, and Traits: An Intro to Heredity | Amoeba Sisters |
| `eCSIrlk0GTs` | Who Needs Dirt?: Crash Course Kids #27.1 | Crash Course Kids |
| `D1Ymc311XS8` | Photosynthesis / The Dr. Binocs Show / Learn Videos For Kids | Peekaboo Kidz |
| `CMiPYHNNg28` | Photosynthesis (UPDATED) | Amoeba Sisters |
| `eJ9Zjc-jdys` | Cellular Respiration (UPDATED) | Amoeba Sisters |
| `AHCOzc143Ec` | Feed Me: Classifying Organisms - Crash Course Kids #1.2 | Crash Course Kids |
| `sKJoXdrOT70` | ECOSYSTEM - The Dr. Binocs Show / Best Learning Videos For Kids / Peekaboo Kidz | Peekaboo Kidz |
| `EHkAGKgoyGo` | Ancient Mesopotamia for Kids / Learn all about the history of ancient Mesopotamia | Learn Bright |
| `sohXPx_XZ6Y` | Mesopotamia: Crash Course World History #3 | CrashCourse |
| `zYxC14pCaJ0` | Ancient Egypt for Kids / Learn the History of Ancient Egypt | Learn Bright |
| `Z3Wvw6BivVI` | Ancient Egypt: Crash Course World History #4 | CrashCourse |
| `6LUiHBroEy4` | Indus River Valley Civilization for Kids / Bedtime History | Bedtime History |
| `n7ndRwqJYDM` | Indus Valley Civilization: Crash Course World History #2 | CrashCourse |
| `Wo0KujQEJ_s` | Ancient Rome for Kids / Learn all about the History of the Roman Empire for Kids | Learn Bright |
| `vfe-eNq-Qyg` | The Silk Road and Ancient Trade: Crash Course World History #9 | CrashCourse |
| `szxPar0BcMo` | Wait For It...The Mongols!: Crash Course World History #17 | CrashCourse |
| `UC5km6-o2oM` | The Columbian Exchange: Crash Course History of Science #16 | CrashCourse |
| `FCpqN7GmLYk` | The Industrial Revolution: Crash Course History of Science #21 | CrashCourse |
| `RBtyaelrgmg` | World War I for Kids / History Made Easy | Bedtime History |
