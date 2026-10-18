# Brain Games (Pet World brain stretches)

Twelve short attention and memory games. They are **not** part of the Arcade: Pet World opens them as
**brain stretches** (3 games in a row) each morning and after each core subject. How that works is in
`docs/BRAIN-GAMES.md`.

Pet World serves the **built** games from `public/brain-games/`. After changing anything in this folder, rebuild it:

```
cd src/brain-games
npm install        # first time only
npm run build      # writes ../../public/brain-games
cd ../..
```

Then commit both this folder and `public/brain-games/`.

## Inside Pet World

Pet World opens one game at a time: `/brain-games/?embed=true&game=<id>&difficulty=<level>&stretch=<stretch id>`.

- `game` and `difficulty` are the ids in `src/data/gamesCatalog.ts` (Pet World's copy of the list is `src/shared/brainGames.ts`; keep the two in step).
- When a game ends, it posts `{type: 'brain:result', stretch, result}` to Pet World and does **not** save to this
  browser's localStorage. `result` is the game's `GameResult` (accuracy, reaction time, score, level).
- Opened on its own (no `embed`), it is the full Brain Games site with its own local stats.
