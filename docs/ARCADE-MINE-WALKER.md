# Mine Walker in the Arcade

Mine Walker is a Minesweeper-style game: the student walks a scout across a minefield, using the number clues to find safe squares. Source: `src/arcade/mine-walker/` (how to rebuild it is in its README). Built copy: `public/arcade/mine-walker/`.

## Tickets (paid-entry mode)

| Mode | What pays | Class setting (default) |
|---|---|---|
| Campaign (10 levels) | **Each reward the game awards, once ever.** Clearing a level is a reward, and so is each medal on that level (Lightning Scout, Sweeper Supreme, Ghost Walk, Nerve of Steel, Vanguard Recon). | **Tickets per Mine Walker reward** (1, from 0 to 5) |
| Endless | **Rows walked** in one run: the farthest row reached, so stepping back and forth doesn't count. The game shows rows as meters. | **Mine Walker Endless rows per ticket** (25, from 5 to 200) |
| Sandbox (custom field) | Nothing | |

- **No double pay.** Pet World remembers each reward it has paid (`S.arcade.rewardsPaid`, for example `mine-walker:L3-flawless_run`). Replaying level 3 pays only for a medal not earned before.
- **Daily cap.** The class's **Maximum Arcade tickets per student each day** applies. If a win earns more rewards than fit under today's cap, the extra rewards aren't marked as paid, so earning them again on another day still pays.
- **Game of the Day bonus.** Added when a Mine Walker run pays at least one ticket. A replay that pays nothing gets no bonus.
- **Free Play** pays no tickets, like every game. It still needs practice time banked today.
- An Endless run is paid when it ends: when the scout is caught, or when the student starts a new run or switches to the campaign. Closing the Arcade in the middle of a run pays nothing for that run.

## Saving

Inside the Arcade, the game's Armory upgrades, Intel points, medals and levels cleared are saved in the student's Pet World save (`S.arcade.gameSaves['mine-walker']`), so they follow the student to another device. The game reopens at the next level not yet cleared. Played outside Pet World, it saves in that browser instead.

## Code

- `src/arcade/mine-walker/src/App.tsx`: search for "Pet World" (loading and saving, `finishEndlessRun`, and the rewards report in `handleVictory`).
- `src/game/game.js`: `arcadeModuleMessage`, the `mine-walker` branch.
- `src/shared/registry.ts`: the `ARCADE_GAMES` entry and `mineTicketsPerReward` / `mineRowsPerTicket` in `arcadeSettings`.
- `src/teacher/main.ts`: the two Class settings boxes.
- `scripts/verify.mjs` fails if an available Arcade game has no built copy in `public/arcade/`.
