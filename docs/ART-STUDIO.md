# 🎨 Art Studio (ROADMAP F13)

**Goal:** a place to paint any time (separate from the History project, which stays as it is), keep the paintings, and hang favorites in the Pet Room.

## Owner decisions

- Paintings are kept in a **database table** (`art_paintings`, migration 9), up to 20 per student. Without a class sign-in (local mode) the save keeps 4.
- New **colors and stencils come into the shop as she passes unit tests** (any subject), and she buys them with Pet Town coins.
- Prices: **frames 50**, **color packs 30**, **stencils 40**.

## How it works

- **Town page:** an "🎨 Art Studio" tile (screen `artstudio`; the Grade 4 math building with id `art` is a different thing).
- **Paint:** the same canvas as the History project (now `drawBoxHTML` and `setupDrawBox`), on a cave wall or paper. It starts with the five cave colors and the hand stencil, plus whatever she has bought. Name the painting and tap "Save to my gallery".
- **Gallery:** her paintings, newest first; "Hang in my room" (needs an empty frame) and "Delete" (tap twice).
- **Shop:** frames, color packs (`ART_COLOR_PACKS`, needing 0 to 4 unit tests passed) and stencils (`ART_STENCILS`: star, paw, leaf, heart, sun, needing 1 to 5). Locked items say how many more unit tests open them.
- **Pet Room:** hung paintings show in wooden frames on the wall; drag to move; the room panel lists them with × to take one down. The save keeps `S.art = {colors, stencils, frames, hung:[{id, painting, x, y}]}`.
- **History project:** the cave painting step has "Save a copy to my Art Studio gallery".
