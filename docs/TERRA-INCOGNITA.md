# 🧭 Terra Incognita

An exploration game set in 1604. She leads a royal exploration charter for England, France, Spain or Portugal. Ships
sail real sea lanes to chart new lands, survey plants and animals, and meet the peoples who live there. The owner
built it in Google AI Studio, and it was brought into Pet World on Oct 31, 2026.

**Owner decision (Oct 31, 2026):** the game keeps its **no conquest** premise. It shows negotiation, fair trade and
working together as the preferred way to explore. The history fixes below keep every fact true without changing that.

## Where it is

| Where | How it opens | Pays |
|---|---|---|
| History Unit 6 (⛵ Age of Sail Museum), a card at the bottom of the unit page | overlay, `?from=history6` (`openTerra`) | 3 coins a star, up to 20 a day |
| 🕹️ Arcade | `?arcadeRun=` | 1 ticket a star, up to 3 a charter |

Each finished charter pays once (by its charter id). Time in the game counts as History time for Unit 6
(`course:history6:🧭 Terra Incognita`). The result goes in the day log (`k:'terra'`), and the teacher app files it
under History. The game never counts toward mastery, quizzes, tests or unlocks.

## The charter (`src/utils/charter.ts`)

She picks a charter length on the first screen. The short charter is the default.

| Charter | Time in the game | Goals: new lands · plants and animals · treaties |
|---|---|---|
| Short Charter | 6 months (about 20 minutes) | 4 · 4 · 1 |
| Long Voyage | 18 months (save and continue) | 7 · 8 · 3 |
| Grand Charter | 3 years (several sittings) | 12 · 14 · 5 |

- **Stars:** 1 for each goal met. If she meets all three, the charter ends early ("Charter fulfilled!"). Otherwise it
  ends on its last day.
- **New lands:** a ship drops anchor at a place that wasn't charted.
- **Plants and animals:** she surveys a charted place (Launch Inland Survey Trek).
- **Treaties:** she meets a people (one of her ships reached their land), raises harmony to 65% with gifts they value,
  and signs a Peace & Amity Charter.
- **Saving:** the game saves on the device once a game day and after every action. The first screen has a
  **Continue your charter** button, and a continued game starts paused.
- **How to play:** a button on the charter strip lists the five steps.

## Changes made for Pet World

- **Charter, stars and saving:** the goals, end screen, save and continue, and the messages to Pet World are new
  (`CharterPanels.tsx`, `charter.ts`, `embed.ts`). The original game had no ending and no save.
- **Contact before diplomacy:** she can survey a place, found a treaty post, or talk with a people only after one of
  her ships reaches them. The region card has a **Sail here** button. Tapping a place used to send the ship at once, so
  the card never opened.
- **Voyages:** days at sea are counted in days, not 2-hour ticks. Before, every ship went "overdue" about a week out
  and stopped for good.
- **Encounters and searches:**
  - Encounters come about every 2–3 weeks at sea (before, every few days).
  - The clock stops while one is open.
  - Place-bound ones only happen where they fit: manatees in the Caribbean, Roanoke off the Outer Banks, the doldrums
    in the equatorial Atlantic.
  - A lost-expedition search needs a ship within about 300 nautical miles of the marker.
- **Phone:** the screens scroll on a phone and the top bar wraps. The map opens on the North Atlantic, a finger can
  drag it, and dragging no longer sends the ship.
- **Plants and animals:** five places had none to survey. Added the dragon tree, Chesapeake oysters, the opossum, the
  alligator, the southern magnolia, the baobab, shea, the oil palm, Yellala Falls, black pepper and cardamom.
- **Sound:** the mute button is remembered on the device.
- **Removed:** the unused Gemini, Express and dotenv packages. The game needs no API key.

## History (fact-checked Oct 31, 2026)

A fresh reviewer read every line she sees against 1604. The main fixes:

- **Anachronisms removed:**
  - Lewis & Clark (1804–06) became Champlain's rivers and "the search for a river passage west".
  - The Royal Society and Royal Academy (1660 and later) became the Royal Court, Hakluyt and Gresham College.
  - The sextant (1730s) became the astrolabe.
  - "HMS" (1789) was removed from ship names.
  - Radio and "the Enlightenment" were removed.
  - Rum, tea and lightning rods were removed.
  - Cape Horn (named 1616) became Tierra del Fuego.
  - The Northwest Passage can't be sailed; no ship got through until 1906.
- **Rulers and leaders for 1604:**
  - James I, not Elizabeth I.
  - Portugal under Philip III (the Iberian Union).
  - Sultan Saidi Berkat of Ternate.
  - No named Chinook, Tupinambá, Khoikhoi or Quechua leaders who lived at other times; village headmen and kurakas
    instead.
- **Roanoke** is shown as a theory, not a solved mystery. The 1587 colonists' fate is still unknown. CROATOAN has
  eight letters, and Roanoke Island is at 35.9°N.
- **Peoples:**
  - Fewer "noble savage" lines.
  - Correct names: Tupinambá, Chinookan peoples, Khoikhoi, the Sultanate of Johor.
  - Real trade goods: copper for the Powhatan, beaver pelts and wampum for the Haudenosaunee.
  - Kongo's royal court at São Salvador, not "university cities".
- **Science:**
  - Cinchona eases malaria fevers. Europe learned of it in the 1630s, and quinine was isolated in 1820.
  - Only the celestial pole's height equals latitude. In the south it is found from the Southern Cross.
  - Redwoods became western red cedar.
  - Modern scientific names are labeled "modern".

## Tested (Oct 31, 2026)

- **In a headless browser at 375 px and 1280 px:**
  - The first screen, the charter choice, and the map.
  - Sailing, the region card, surveying, diplomacy and the treaty.
  - Encounters, the charter end with 3 stars, and the save.
  - A scripted player meets all three short-charter goals in about 2 game months (2 minutes at 8x).
- **Not tested here:** the Cinzel and Plus Jakarta fonts (they load from Google Fonts), and sound.
