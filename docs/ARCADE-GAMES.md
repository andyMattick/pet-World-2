# Unit games in the Arcade

**Owner rule (Oct 26, 2026):** when the owner calls something a game, it goes in two places: inside its unit (or shop station), and in the 🕹️ Arcade. See `CLAUDE.md`, "Games go in the unit and in the Arcade". `npm run verify` checks the list below.

| Game | In the unit | In the Arcade (`ARCADE_GAMES`) | Arcade tickets |
|---|---|---|---|
| 🍳 Chef's Rush | Café → Deliveries (`openChefRush`) | `chefs-rush`, `public/arcade/chefs-rush/` | 1 per 5 orders, up to 3 a shift |
| 🩺 Dr. Paws' Surgery Center | Bakery → Bulk Orders, and Clock Tower → Clock Face with secret formulas (`openSurgery`) | `pet-surgery`, `public/arcade/pet-surgery/` | 1 per 3 patients, up to 3 a shift |
| 🛒 Supermarket Dash | Market → Discount Bin (`openDash`) | `supermarket-dash`, `public/arcade/supermarket-dash/` | 1 per checkout star, up to 3 a dash |
| 🐧 Penguin Push | Ice Rink → Weather Station (`openPenguin`) | `penguin-push`, `public/arcade/penguin-push/` | 1 per star, up to 3 a battle |
| 🔍 Potion Detective | Potion Lab → Potion Shelf (`openDetective`) | `potion-detective`, `public/arcade/potion-detective/` | 1 per case solved, up to 3 |
| 🎪 Carnival Midway | Pet Fair → Prize Counter (`openCarnival`) | `carnival`, `public/arcade/carnival/` | 1 per booth star, up to 3 a booth |
| 🏆 Pet Show Awards | Pet Show → Best in Show (`openPetShow`) | `pet-show`, `public/arcade/pet-show/` | 1 per star, up to 3 a show |
| 📮 Parcel Post | Pet Post Office → Wrapping Desk (`openParcel`) | `parcel-post`, `public/arcade/parcel-post/` | 1 per star, up to 3 a shift |
| ⚓ Harbor Battleship | Pet Harbor → Shipyard (`openBattleship`) | `harbor-battleship`, `public/arcade/harbor-battleship/` | 1 per star, up to 3 a battle |
| ☄️ Shape Asteroids | Pet Houses → Rooms (`openAsteroids`) | `shape-asteroids`, `public/arcade/shape-asteroids/` | 1 per wave survived, up to 3 |
| 🔗 Link Library Games (Pet Hide-and-Seek, Cross It Out, Comic Strip Studio) | English Unit 5, cards under its blocks (`ggameCardsHTML`) | `link-games`, `arcade/link-games/index.html` | 1 per star, up to 3 a game |
| ⚡ Punctuation Power Lab | English Unit 6, a card under each block (`heroLabCardHTML`) | `power-lab`, `arcade/power-lab/index.html` | 1 per 2 first launches, up to 3 a pack |

## Two ways to build the Arcade copy

1. **One standalone page** in `public/arcade/<id>/index.html` (Chef's Rush, the surgery game, Supermarket Dash, Penguin Push, Potion Detective, Carnival Midway). The unit opens the same page in an overlay with `?from=<shop>` and pays coins; the Arcade opens it with `?arcadeRun=` and pays tickets (`arcade:round-complete`).
2. **A Vite page** at `arcade/<id>/index.html` (not under `public/`), listed in `vite.config.ts`, for a game whose content lives in `src/` (the Power Lab imports `src/game/heroLab.js`; the Link Library Games import `src/game/grammarGames.js`). The Arcade copy uses the same content, so there's only one list to edit. Vite builds it to `/arcade/<id>/`.

Either way:
- Add the payout to `arcadeModuleMessage` in `src/game/game.js` (tickets, capped per round).
- Add the pair to the unit-game list in `scripts/verify.mjs` and to the table above.
- The Arcade copy never pays coins and never counts toward the unit's stars, mastery, quizzes, tests or unlocks.
