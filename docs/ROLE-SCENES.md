# 🖼️ Role scenes for History (Oct 28, 2026)

Andy's wife noticed the History role intros were text only ("You are a Silk Road merchant…"), so a 6th grader couldn't picture them. Now each role shows a scene above the practice. It's open on the first question, then folds up under "🖼️ See the scene again". The scene has four parts:

- **A real picture:** a painting, artifact, place or map, with a kid-friendly caption ("Look for…") and a credit line.
- **A world map pin** showing where the role is.
- **A timeline** across the unit's era, showing when.
- **A livelier scene:** 2–3 sensory sentences in the second person. They replace the old intro on the stage.

## Data
`src/shared/roleScenes.js` merges four group files in `src/shared/roleScenes/`: A is Units 1–3, B is Units 4–5, C is Units 6–7 and D is Units 8–9. Each entry looks like this:

```js
skillId:{img:'6/6f/File_name.jpg', cap:'…', credit:'Artist, date · License (Wikimedia Commons)', at:[lat, lon], place:'…', year:400, when:'about 400 CE', scene:'…'}
```

`ERAS_X` gives each course's timeline span. The role's `who` and `where` stay in `ROLE_CARDS` (`game.js`).

## Rules for pictures
- **Wikimedia Commons only**, and only public domain, CC0, CC BY or CC BY-SA. When the license is CC BY or CC BY-SA, the credit names the author and the license.
- **At least 500px wide.** The game loads the 500px thumbnail, and Wikimedia only serves standard widths.
  - `img` is the hashed path, which `commons.py` makes from the file name.
- **Nothing gory or frightening.** War units use posters, places, portraits and objects.
  - The gated lessons (Slave Trade 6.10 and the Holocaust 8.7) and Global Conflicts (9.6) have no role and no scene, on purpose.
- **Captions say when a picture is later than the scene,** or a modern photo of a place or an artifact.
- **Pictures load from Wikimedia when she plays.** If one can't load, it's left out, and the map and timeline still show. The map is NASA's Blue Marble, which is public domain.

## Checked
- All 72 scenes (71 different pictures) loaded at 500px in a browser on the live site, on Oct 28, 2026.
- Every scene has a picture, caption, credit, place, year and scene text.
