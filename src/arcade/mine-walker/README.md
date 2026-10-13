# Mine Walker (Pet Town Arcade)

A Minesweeper-style game: walk a scout across a minefield using the number clues.

Pet Town serves the **built** game from `public/arcade/mine-walker/`. After changing anything in this folder, rebuild it:

```
cd src/arcade/mine-walker
npm install        # first time only
npm run build      # writes ../../../public/arcade/mine-walker
cd ../../..
```

Then commit both this folder and `public/arcade/mine-walker/`.

## Inside Pet Town

When it runs in the Arcade frame (`?arcadeRun=...`), the game:

- saves its Armory upgrades and stats in the student's Pet Town save (`arcade:state-save`), so they follow the student between devices. Outside Pet Town it uses this browser's localStorage.
- reports **rewards** after a campaign level is won (`arcade:round-complete` with `rewards`): `L<level>-clear` for clearing the level, plus one id per medal earned, such as `L3-flawless_run`. Pet Town pays tickets once per reward id, ever, so replays don't pay again.
- reports **rows walked** after an Endless run ends (`arcade:round-complete` with `mode: 'endless'`, `score` = rows). Rows count the farthest row reached, so walking back and forth doesn't add rows.

Custom (sandbox) games pay no tickets. Ticket rules are in `docs/ARCADE-MINE-WALKER.md`.
