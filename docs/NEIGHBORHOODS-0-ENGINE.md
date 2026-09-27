# Neighborhoods, step 0: the engine

**Status: built.** Read `AGENTS.md` and `NEIGHBORHOODS.md` first. **Edit in place, never rewrite a file.**

The engine lets the town hold more than one grade. Nothing changes on screen until a second neighborhood has a built shop: the switcher, the grade picker on the name screen, and the teacher's Home grade setting all stay hidden while only 6th grade is built.

## What's in the code

| Where | What |
|---|---|
| `src/shared/registry.ts` | `NEIGHBORHOODS` (`g4` 4th grade, `g6` 6th grade), `DEFAULT_HOME = 'g6'`, and a `hood` on every `BUILDINGS` entry. The 4th grade shops (Lemonade Stand, Toy Shop, Pizza Parlor, Garden Center, Art Studio) are listed as not built yet. Helpers: `buildingsIn`, `hoodOf`, `prevBuilding`, `nextBuilding`, `builtHoods`, `validHood`. |
| Save | `S.home`, default `'g6'`. `normalize` sets it on every older save, so nothing already saved changes. Progress still lives under shop and skill ids. |
| Opening shops | `unitOpen` uses the shop before it **in the same neighborhood**. The first shop of every neighborhood is open. |
| Town | `hoodSwitchHTML` draws the switcher (home first, marked "home") once `builtHoods()` has two or more. `viewHood` is the neighborhood on screen; it starts at home. |
| Home grade | `homeHood()`: the class's `game_settings.home` if set, otherwise `S.home`. Local mode picks it on the name screen (the "My grade" menu), shown only when there are two built neighborhoods. |
| Teacher | Class settings get a **Home grade** menu once two neighborhoods are built (saved in `game_settings.home`, no new tables). "Open the … for everyone" names the shop before it in its own neighborhood. |
| Grade trophy | `hoodTrophies()`: when every shop in a neighborhood is built and its unit test passed, the student gets the grade's 🏆 trophy (+200 🪙, shown at the top of the Sticker Book). Checked with the set completions. |
| Sticker Book | Tabs show the shops of built neighborhoods only. |
| Verify | Checks `NEIGHBORHOODS`, `DEFAULT_HOME = 'g6'`, the Café and Bakery in `g6`, the save default, and the switcher. |

## Still to do, with the 4th grade build

- At home: no family accounts. A grown-up makes a class and sets its Home grade (`GRADE4.md`).
- Teacher dashboard: shop tabs grouped by neighborhood, home first, once a 4th grade shop has skills.
- A built 4th grade shop needs a `SHOPS` entry, stations, rewards, and `open:true` on its `BUILDINGS` entry. Setting `open:true` is what makes the switcher appear.

## How it was tested

- An older save with no `home` loads as 6th grade, with the same town, and no switcher.
- With the Lemonade Stand temporarily marked built: the switcher shows "6th grade (home)" and "4th grade", and switching shows the five 4th grade shops, the Lemonade Stand open and the rest locked behind the unit test of the shop before.
