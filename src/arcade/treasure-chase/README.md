# The Great Treasure Chase (Pet World Arcade)

Pet World serves the **built** game from `public/arcade/treasure-chase/`. After changing anything in this folder, rebuild it:

```
cd src/arcade/treasure-chase
npm install        # first time only
npm run build      # writes ../../../public/arcade/treasure-chase
cd ../../..
```

Then commit both this folder and `public/arcade/treasure-chase/`. Brought in with `npm run import-game` (docs/IMPORT-GAMES.md).
