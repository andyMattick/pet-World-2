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
| 🔗 Link Library Games (Pet Hide-and-Seek with its 8 levels, Cross It Out, Comic Strip Studio) | English Unit 5, cards under its blocks (`ggameCardsHTML`) | `link-games`, `arcade/link-games/index.html` | 1 per star, up to 3 a game |
| ⚡ Punctuation Power Lab | English Unit 6, a card under each block (`heroLabCardHTML`) | `power-lab`, `arcade/power-lab/index.html` | 1 per 2 first launches, up to 3 a pack |
| 📚 Book Repair Desk | English Unit 7, a card under each block (`bookRepairCardHTML`) | `book-repair`, `arcade/book-repair/index.html` | 1 per 2 books fixed on the first try, up to 3 a shelf |
| 🧩 Sentence Snap | English Unit 8, a card under each block (`sentenceSnapCardHTML`) | `sentence-snap`, `arcade/sentence-snap/index.html` | 1 per star, up to 3 a shift |
| ⚖️ Rule Court (🔨 in the Arcade) | English Unit 9, a docket card under each block, plus the Supreme Court under the last block (`ruleCourtCardHTML`) | `rule-court`, `arcade/rule-court/index.html` | 1 per 2 cases closed with no mistakes, up to 3 a docket |
| 🎙️ WPET Style Radio | English Unit 10, a show card under each block, plus Prime Time under the last block (`styleRadioCardHTML`) | `style-radio`, `arcade/style-radio/index.html` | 1 per 2 calls aired with no mistakes, up to 3 a show |
| 🌺 Greenhouse Keeper | Biology Unit 3, a card at the bottom of the unit page (`openGreenhouse`) | `greenhouse-keeper`, `public/arcade/greenhouse-keeper/` | 1 per star, up to 3 a shift |
| 🦋 Life Cycle Lab | Biology Unit 4, a card at the bottom of the unit page (`openLifeCycle`) | `life-cycle-lab`, `public/arcade/life-cycle-lab/` | 1 per star, up to 3 a round |
| 🐄 Barn Breeder | Biology Unit 5 (Farm Barn), a card at the bottom of the unit page (`openBarnBreeder`) | `barn-breeder`, `arcade/barn-breeder/index.html` (a Vite page using `src/game/barnBreeder.js` and `src/shared/genetics.js`) | 1 per star, up to 3 a fair season |
| ✍️ Red Pen Desk | Word Workshop: the word game of the day in its turn (Mon–Thu rotation), the path's 🎲 Puzzle of the day, and the 📅 This week tab's games (`redPenBodyHTML`; docs/RED-PEN-DESK.md) | `red-pen`, `arcade/red-pen/index.html` (a Vite page using `src/shared/redPen.js`; her words of the week via `arcade:words-request`) | 1 per 3 papers graded perfectly, up to 3 a round |
| ⚖️ Pax Oeconomica | History Units 4 and 5, a card at the bottom of the unit page (`openPax`; Unit 4 plays the Classical empires, Unit 5 the Medieval ones) | `pax-oeconomica`, `public/arcade/pax-oeconomica/` (React source in `src/arcade/pax-oeconomica/`; both eras) | 1 per star, up to 3 a game |
| 🧭 Terra Incognita | History Unit 6, a card at the bottom of the unit page (`openTerra`) | `terra-incognita`, `public/arcade/terra-incognita/` (React source in `src/arcade/terra-incognita/`) | 1 per star, up to 3 a charter |

## Two ways to build the Arcade copy

1. **One standalone page** in `public/arcade/<id>/index.html` (Chef's Rush, the surgery game, Supermarket Dash, Penguin Push, Potion Detective, Carnival Midway). The unit opens the same page in an overlay with `?from=<shop>` and pays coins; the Arcade opens it with `?arcadeRun=` and pays tickets (`arcade:round-complete`).
2. **A Vite page** at `arcade/<id>/index.html` (not under `public/`), listed in `vite.config.ts`, for a game whose content lives in `src/` (the Power Lab imports `src/game/heroLab.js`, the Book Repair Desk `src/game/bookRepair.js`, Rule Court `src/game/ruleCourt.js`, WPET Style Radio `src/game/styleRadio.js`, Sentence Snap `src/game/sentenceSnap.js`, the Red Pen Desk `src/shared/redPen.js`; the Link Library Games import `src/game/grammarGames.js` and `src/game/hideSeek.js`). The Arcade copy uses the same content, so there's only one list to edit. Vite builds it to `/arcade/<id>/`.

Either way:
- Add the payout to `arcadeModuleMessage` in `src/game/game.js` (tickets, capped per round).
- Add the pair to the unit-game list in `scripts/verify.mjs` and to the table above.
- The Arcade copy never pays coins and never counts toward the unit's stars, mastery, quizzes, tests or unlocks.
