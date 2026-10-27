# ⚖️ Pax Oeconomica

A turn-based strategy game about trade and the wise use of resources. Each empire's land is rich in some goods and
short of others, so it has to decide what to sell, what to buy, and what to keep. Built from the owner's
"Pax Oeconomica: Mini Civ Strategy Engine" spec (Oct 2026).

## Where it is

| Where | How it opens | Empires | Pays |
|---|---|---|---|
| History Unit 4 (Rome Museum), a card at the bottom of the unit page | overlay, `?from=history4` | Era 1, Classical: Rome, Han, Parthia, Maurya, Kush, Athens | 3 coins a star, up to 20 a day |
| History Unit 5 (Silk Road Museum), same card | overlay, `?from=history5` | Era 2, Medieval: Byzantium, Abbasids, Song, Mali, Srivijaya, Kievan Rus | 3 coins a star, up to 20 a day |
| 🕹️ Arcade | `?arcadeRun=` | either era | 1 ticket a star, up to 3 a game |

Stars: 3 for first place, 2 for second, 1 for finishing. Each finished game pays once (by its game id). Time in the
game counts as History time for its unit (`course:history4:⚖️ Pax Oeconomica`). The result goes in the day log
(`k:'pax'`), and the teacher app files it under History. The game never counts toward mastery, quizzes, tests or
unlocks.

A game is saved on the device after every action (one save per era), so she can stop and continue another day.
The **Continue** button is on the title screen.

## How a game goes

- **Setup.** 2–4 empires, each a player (hotseat: players pass the device) or a computer. Map Standard (radius 7) or
  Large (radius 9). 15, 25 or 35 rounds. Computers easy, normal or hard. In a unit the era is fixed.
- **A turn.** Build, trade, train, move each scout once, then **End turn**. Turn order rotates every round, so no one
  always goes first.
- **End of round.** Camps produce, people eat, goods over storage spoil, barbarians raid, crises tick, prices drift,
  and the trader moves.
- **Winning.** The first empire to 500 prestige wins. Otherwise the leader after the last round wins.

## The rules (numbers are in `src/arcade/pax-oeconomica/src/config/rules.ts`)

- **Goods.** Food, wood, stone, iron, luxury, and gold (coins). Every empire starts with 12 food, 12 wood, 8 stone,
  4 iron, 4 luxury and 50 gold, a capital, 1 soldier and 1 scout.
- **Camps** (8 wood + 4 gold) go on a resource hex in or next to your land. Output by level 1/2/3: food and wood
  4/6/9, stone 3/5/7, iron 2/3/5, luxury 2/3/4, gold 10/15/20. Cheap goods come in bigger piles, so camps are worth
  about the same in gold. Upgrades: 6 wood + 6 stone, then 10 stone + 4 iron.
- **Capital** makes 3 food, 2 wood and 5 gold a round and can always train soldiers.
- **Outposts** (12 wood + 8 stone) claim the hexes around them and see 3 hexes. They can go up to 2 hexes past
  your land. **Depots** (14 stone + 8 wood) add storage. **Barracks** (12 stone + 6 iron) let every building train
  soldiers (6 food + 3 iron each, up to 6 a hex).
- **Storage** (spec): 40, plus 80 a depot. Goods above it are "exposed": 10% spoil each round, and raiders take them
  first.
- **Food.** People eat 2 a round, plus 1 per outpost and 1 per soldier. Running out costs 5 prestige and a soldier.
- **Vision** (spec): camps 2, outposts and the capital 3, scouts 2. Three fog states: never seen (dark), seen before
  (dim, no units shown), visible now.
- **Scouts** (10 food + 10 gold, up to 3) move 3 hexes a round over land. On a 🗿 waystone they read a clue and a
  "?" appears on the map; on a 🏺 lost site they earn 30 gold, 10 prestige and a short history fact.
- **Market.** Sell price = base × (demand ÷ supply)^0.7 × crisis × flood. Bases: food 4, wood 4, stone 5, iron 8,
  luxury 10. Selling raises supply, buying raises demand, and both drift back each round. Selling a lot of one good
  floods the market for about 2 rounds. Buying costs 30% more than selling. Prices stay between 0.4× and 3× base.
  Every 25 gold of goods sold earns 1 prestige.
- **Barbarians** (spec): 3 clans (5 on a Large map), strength 3–6, growing by 1 every 3 rounds up to 10. A wild clan
  raids 35% of rounds (21% on easy) from round 3, going for depots, then outposts, camps, barracks, and the capital
  last. **Hire** a clan for 30 gold: it adds its strength to your defense everywhere, and costs 8 gold every round.
  A missed payment adds 40 unrest; at 100 it revolts and raids your nearest depot with +2 strength. **Bribe** a wild
  clan (25 gold or 30 food) to raid a rival.
- **Raids.** Defense = soldiers + building HP ÷ 3 + hired clans. More than the clan's strength: driven off (the
  defender loses 1 soldier and gets +8 prestige). Some defense but not enough: the clan takes half the exposed goods
  plus 20 more (10 at a camp, outpost or barracks), 5% of the gold, and halves the building's HP. No defense: all
  exposed goods plus 40 (20 at a camp, outpost or barracks), 10% of the gold, and the building drops a level (a
  level-1 building burns down). Byzantine depots lose half as much.
- **Crises.** From round 2, about 45% of the time a crisis is announced for the next round. It lasts 2 rounds and
  pushes one good's price up 40–80%. Each unit given earns 1 prestige; one empire may give up to half the need. If
  the need is met, every helper gets +5 and the top helper +10.
- **The trader** (spec): a caravan that walks toward each empire in turn. Next to your land or a scout it sells a map
  of 7 unexplored hexes (20 gold), news of a rival's capital and storehouses (35 gold), or a rumor about the next
  crisis (10 gold).
- **Prestige** comes from building (camp 3, outpost 5, depot 4, barracks 3, upgrade 3), selling, land (+1 a round
  per 5 hexes), a 3-stage wonder (+40, +60, +90; stone, wood, iron, luxury and food), festivals (8 luxury + 12 food,
  +10, once a round), aid, driving off raids, and lost sites.
- **The advisor** (👑 Empire) gives up to 3 tips each turn: food running short, storage filling up, good prices to
  sell or buy, raiders nearby, the trader in reach, gold sitting idle.

## The empires

| Era | Empire | Ability | Land rich in | Short of |
|---|---|---|---|---|
| 1 | Rome | Outposts 25% cheaper; +2 HP on fortifications | stone, iron | luxury |
| 1 | Han | Depots hold 50% more; farms +1 | food, luxury | iron |
| 1 | Parthia | Hiring 25% cheaper; 2 gold a round per rival (Silk Road tolls) | gold, luxury | wood |
| 1 | Maurya | +20% prestige from aid; lumber camps +1 | food, wood | stone |
| 1 | Kush | Mines +1 iron; soldiers defend 50% better | iron, gold | food |
| 1 | Athens | 5% cheaper buying; +2 gold a round | luxury, gold | food |
| 2 | Byzantium | Raiders take half from depots; soldiers defend 25% better | luxury, stone | food |
| 2 | Abbasids | Trader half price; luxury sells 30% higher; +2 gold a round | luxury, gold | wood |
| 2 | Song | +2 gold a round; iron +50% | food, iron | luxury |
| 2 | Mali | +6 gold a round; +20% prestige from aid | gold, food | wood |
| 2 | Srivijaya | +2 gold a round; sees twice as far over coasts and water | luxury, wood | iron |
| 2 | Kievan Rus | Lumber camps +1; scouts move 1 farther | wood, luxury | food |

"Rich" means 3 of each of those resources within 3 hexes of the capital. "Short of" means none of that resource
within 4 hexes, so it has to be bought or found farther away.

## What the spec left open (defaults chosen)

- Map sizes (radius 7 and 9), terrain, and where resources appear.
- The price formula above, the 30% buy markup, and the flood effect.
- Raid combat (the three outcomes above), the raid chance, and clan growth.
- Building, soldier, scout, wonder and festival costs, prestige amounts, food upkeep and spoilage.
- Stars for Pet World (3, 2, 1) and the coin and ticket payouts.
- Difficulty: the computers all play the same way. Easy computers produce 25% less, hard ones 40% more, and easy
  games have fewer raids.
- Changes for balance: Srivijaya's spice bonus became gold (it won too often), Byzantium lost its luxury bonus,
  and Mali and the Abbasids got more gold.

## Balance (simulated)

200 computer-only games at each setting (normal, 25 rounds, Standard map, 3–4 empires): no crashes or impossible
values. Every empire's average final prestige is within about 10% of the others (Athens 300 to Byzantium 355). The
leader averages about 410 prestige after 25 rounds and sometimes reaches 500 early. Going first has no advantage
because the order rotates. On a 15-round game the leader averages 136 (easy), 194 (normal) and 234 (hard).

## Tested

- Phone (375 px) and desktop (1280 px) in Playwright. Title, setup, building a camp, selling, moving a scout, ending
  turns, the round report, game over, the pass screen for 2 players, and continuing a saved game.
- In Pet World with the fake backend: the card on History Units 4 and 5, the overlay, the era lock, coins paid once,
  the day-log event, and the game closing itself.
- Not tested here: `npm run build` with Vite (npm can't reach the registry in this sandbox, so the committed build
  was made with Bun and Tailwind's compiler from the same source), and the Cinzel and Plus Jakarta fonts (blocked
  here; they load from Google Fonts).
