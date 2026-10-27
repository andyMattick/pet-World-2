# ⚖️ Pax Oeconomica (source)

The trade strategy game for History Units 4 and 5 and the Arcade. React + TypeScript + Tailwind. The rules and the
numbers are in `docs/PAX-OECONOMICA.md`.

## Rebuild

```
cd src/arcade/pax-oeconomica
npm install
npm run build      # writes ../../../public/arcade/pax-oeconomica (commit that folder)
```

`npm run dev` runs it on its own at http://localhost:3000. Add `?from=history4` or `?from=history5` to see it the way
a unit opens it (one era only), or `?arcadeRun=test` for the Arcade.

`npm run lint` type-checks it. The root `tsconfig.json` skips `src/arcade/**`, so `npm run typecheck` at the root
doesn't.

## Files

- `src/types/game.ts`: the data model (tiles, empires, barbarian clans, market, crises).
- `src/config/`: the 12 empires (`civilizations.ts`), every number (`rules.ts`), and the crises, barbarian peoples
  and lost sites of each era (`eraContent.ts`).
- `src/logic/`: hex math and the seeded random numbers, the map, the market, the economy (building, storage,
  scouts), barbarians, crises, the computer empires, the turn loop and saving, and the advisor's tips.
- `src/components/`: the map (SVG, pan and zoom), the drawers, and the full screens.
- `src/utils/`: sounds, the autosave, and the messages to Pet World.

Balance changes are one-file edits in `src/config/`. After changing a number, play a few games against the computer
and check that no empire wins far more often than the others (see "Balance" in the doc).
