# 🧭 Terra Incognita (source)

The exploration game for History Unit 6 and the Arcade. The owner built it in Google AI Studio; it was brought into
Pet World on Oct 31, 2026. React + TypeScript + Tailwind. How it plays, the charter goals and the history choices are
in `docs/TERRA-INCOGNITA.md`.

## Rebuild

```
cd src/arcade/terra-incognita
npm install
npm run build      # writes ../../../public/arcade/terra-incognita (commit that folder)
```

`npm run dev` runs it on its own at http://localhost:3000. Add `?from=history6` to see it the way the unit opens it,
or `?arcadeRun=test` for the Arcade.

`npm run lint` type-checks it. The root `tsconfig.json` skips `src/arcade/**`, so `npm run typecheck` at the root
doesn't.

## Files

- `src/App.tsx`: the game clock, voyages, encounters, the charter (goals, end, autosave) and every action.
- `src/utils/charter.ts`: the three charter lengths and their goals, and the save on this device.
- `src/utils/embed.ts`: how it was opened, and the messages to Pet World.
- `src/data/`: the four crowns, the places and the peoples who live there, plants and animals, encounters and the lost
  expeditions, missions, weather, and the sea lanes.
- `src/components/`: the map, the region card, diplomacy, the field compendium, the fleet, the logbook, the star
  sight, and the charter strip and end screen (`CharterPanels.tsx`).

History text lives in `src/data/`. Check any new fact against 1604 (see "History" in the doc).
