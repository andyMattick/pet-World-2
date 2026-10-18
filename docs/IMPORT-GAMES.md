# Bringing in games built outside Pet World

Games made somewhere else (an AI Studio export, a zip from another tool, a folder) come in with one command, run from the Pet World folder:

```
npm run import-game -- treasure-chase.zip --arcade treasure-chase --name "Treasure Chase" --emoji 🗺️ --description "Follow the clues around the ancient world."
npm run import-game -- neurosuite.zip --brain
```

## What it does

1. Stops if the game's folder has changes that aren't committed, so nothing gets overwritten. Commit first.
2. Unpacks the zip (or copies the folder) and finds the project in it.
3. Removes AI Studio leftovers: `.env` files, `bun.lock`, a `server.js`, and the Gemini, Express and dotenv packages when the game's code doesn't use them.
4. **Arcade** (`--arcade <id>`): puts the game in `src/arcade/<id>`. Updating a game keeps Pet World's `vite.config.ts` and `README.md`; a new game gets both, building into `public/arcade/<id>`. A new game is added to `ARCADE_GAMES` in `src/shared/registry.ts` (check its name, emoji and description there). If the old copy sent Pet World saves or ticket messages and the new one doesn't, it warns you.
5. **Brain Games** (`--brain`): replaces the game files (`src/games`, `src/data`, `src/utils`, `src/components`, `src/types`, `src/index.css`) but keeps `src/App.tsx` and `src/main.tsx`, which hold the Pet World hooks (`?difficulty=`, `?pace=` and the `brain:result` message). It adds any new packages, then checks every game's id and levels against `src/shared/brainGames.ts` and tells you what to add there.
6. Builds the game into `public/` and runs `npm run verify`, then shows what changed.

Nothing is committed. Try it with `npm run dev`, then `git add -A && git commit`. To undo, `git checkout -- src/arcade/<id> public/arcade/<id>` (or `src/brain-games public/brain-games`; for a new Arcade game also `src/shared/registry.ts`).

## Keep fixes in one place

The import replaces game files with the copy you bring in. If a game was fixed inside Pet World (like the Brain Games' Pattern Matrix and Word Builder, and their extra-time support in `src/utils/pace.ts`), bring those files into your outside copy first, or the import puts the old versions back. `git diff` after an import shows exactly what came back.
