# Word cartoons: the drawing kit

Owner (Oct 30, 2026): "build me a ramp to make new cartoons with words without them." ROADMAP F92.

The 50 built-in cartoons in Word Workshop were drawn with code, not by hand, so new ones can match them exactly. This page says how the kit works and how a new cartoon gets drawn, checked and shipped. It covers both kinds:

- **a built-in word** (in `vocab.js`): its entry in `WORD_PICTURES` (`src/shared/wordPictures.js`) has `kind: 'cartoon'` and `svg: 'cartoons/<word>.svg'`.
- **a word a grown-up or teacher added** (a class word or a family's word): it goes in `CLASS_CARTOONS` in the same file, with its svg in `cartoons/class/`. These are the words on the 🎨 **Needs a cartoon** lists (the teacher's Vocabulary tab, and 📊 My words behind the grown-up PIN). **📋 Copy request for Claude** there copies a request listing them with their meanings and example sentences; paste it to Claude, which follows the `pet-world-word-cartoons` skill (the steps below).

## The kit (`scripts/word-cartoons/`)

| File | What it is |
|---|---|
| `lib.mjs` | The drawing helpers. `C` is the palette (Pet World's `:root` colors: berry, deep, mint, green, butter, wood, grass, path, the pink background, ink for outlines). `svg(inner, bg)` wraps a picture in a 200 × 200 viewBox with a rounded background and the house style: ink outlines, `stroke-width 5`, round caps and joins. Shapes: `circle`, `ellipse`, `rect`, `path`, `poly`, `line`, `g` (move, scale, flip, rotate). **Pets:** `pet({kind: 'cat' | 'dog' | 'bunny', color, mood, look, arms, tail, wag, legs, extra, top})` and `P(opts, at)`; moods are happy, smile, sad, worried, wow, angry, sleepy, determined, calm, shy; at scale 1 a pet is about 120 tall with its feet at (x, y). **Props:** heart, star, sparkle, check, cross, arrow, curveArrow, bubble, thought, magnifier, carrot, cookie, ball, cloud, sun, ground, sweat, bulb, paw, motion, and `limb` for an arm or leg. `text()` exists but words in a picture are almost never allowed (below). |
| `scenes.mjs` | One function per word that returns `[inner SVG, background color?]`. `SCENES` is the built-in words, `CLASS_SCENES` the added words. `TEXT_OK` lists the few built-in pictures that need numbers in them (estimate's "50?", century's "100"). Each scene starts with a comment saying what it shows. |
| `draw.mjs` | Writes the SVG files: `SCENES` to `public/vocab-pics/cartoons/<word>.svg`, `CLASS_SCENES` to `public/vocab-pics/cartoons/class/<word>.svg`. `node scripts/word-cartoons/draw.mjs` draws all; add words to draw only those. It warns about any file over 6 KB. |
| `render.mjs` | Renders every cartoon (built-in, then `CLASS_CARTOONS`) to a 160px PNG and makes contact sheets of 20 at 120px, the size she sees on a phone: `node scripts/word-cartoons/render.mjs <outDir>` (default `/home/claude/pics-check`). `--class` skips the emoji sheets. Needs Playwright's Chromium. |

## The style (every new cartoon)

- Flat colors, thick rounded ink outlines, Pet World's palette only.
- Pet World's cats, dogs and bunnies **acting out the meaning**: one clear idea per picture.
- Square (the 200 × 200 viewBox from `svg()`), **under 6 KB** (the check fails over 8 KB), readable at **120px**.
- **No answer text:** never the word itself, and no other words. Numbers only when the meaning needs them, and then the word goes in `TEXT_OK` (built-in) with a note.
- No sound-alike puns (no 🐝 + 🍃 for "belief"), nothing scary, no real people or brands.
- A one-sentence `alt` describing the picture (it's read aloud when she taps it), with curly apostrophes.

## Adding a cartoon

1. **Draw the scene** in `scenes.mjs` (`CLASS_SCENES` for an added word, keyed by the word in lower case), reusing `lib.mjs`. Start from a similar existing scene.
2. **Write the file:** `node scripts/word-cartoons/draw.mjs <word>`.
3. **List it:**
   - built-in word: in its `WORD_PICTURES` entry set `kind` to `CA` (the `E()` helper adds `svg: 'cartoons/<word>.svg'`), keep the emoji scene as the fallback, and write the alt.
   - added word: add `<word>: { svg: 'cartoons/class/<word>.svg', emoji: '<1–3 emoji>', alt: '<one sentence>.' }` to `CLASS_CARTOONS`. It then shows for that word anywhere it's on a list (class or family), ahead of the emoji, after a photo someone picked.
4. **Render and look:** `node scripts/word-cartoons/render.mjs /tmp/sheets --class`, then open the contact sheet and look at each new picture at 120px. Ask: does it show the meaning, or could it be read as another word? Is anything too small?
5. **Fresh-eyes review:** give the sheet (without the words) to someone who hasn't seen it (a fresh agent) and ask what word or idea each picture shows. Anything misread gets fixed and reviewed again.
6. **Run the checks:** `node scripts/check-word-pictures.mjs` (every svg is valid XML, square, under 8 KB, no scripts or outside links, no word written in it; a `CLASS_CARTOONS` entry must not be a built-in word and needs its file, emoji and alt) and `npm run verify` (which runs it too).
7. **Ship it as a patch:** commit the svg files and the `scenes.mjs` / `wordPictures.js` changes, and send `git format-patch` output (or the commit) for Andy to apply. Nothing else changes: no new tables, and the word's photo or emoji stays as the fallback.

The `pet-world-word-cartoons` skill has these same steps for Claude.
