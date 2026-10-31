# Word pictures

Owner (Oct 30, 2026): "i'd also like the image with the word to help her understanding."

Every built-in word in Word Workshop has a picture that shows what it **means**: real photos where a photo can show it, cartoons for 25–50% of the words, and emoji where neither works. The data is in `src/shared/wordPictures.js` and the drawings are in `public/vocab-pics/cartoons/`.

**Status:** the cartoons and emoji are done. The 62 photos are picked (Oct 30, 2026): one Wikimedia Commons photo per photo word, chosen by eye to show the meaning at phone size, listed in `scripts/word-photos/picks.json`. `npm run word-photos` (in a Codespace, where Wikimedia can be reached) downloads, crops and credits them; until it has run, a photo word shows its emoji. Word Workshop shows them (Oct 30, 2026): see `VOCAB.md`, "Word pictures", for where they show and where they never do. Words a grown-up or teacher adds get a picked photo or an emoji, and cartoons drawn later (F92, Oct 30, 2026; `WORD-CARTOONS.md`).

## The mix

| Kind | Words | When |
|---|---|---|
| 📷 Photo | 62 | Things you can see: whale, cactus, canyon, a herd on the move. A photo shows the meaning best. |
| 🎨 Cartoon | 50 (35%) | Ideas a photo can't show: analyze, infer, predict, summarize, contrast, evidence, scarce and abundant, feelings like reluctant or timid. Pets act out the meaning. |
| 🙂 Emoji | 31 | Small words a picture can't add much to: perhaps, previous, necessary, circle. |

**Every word has an emoji scene**, whatever its kind. It's the fallback when the picture can't load, and it's what a photo word shows until its photo is added.

## Each entry

```js
{ w: 'scarce', kind: 'cartoon', emoji: '🧺🥕😟', svg: 'cartoons/scarce.svg',
  alt: 'A worried bunny looks at a basket with just one carrot left in it.' }
{ w: 'fragile', kind: 'photo', emoji: '🥚⚠️', photo: {}, alt: 'An egg and a warning sign: careful, it breaks easily.' }
```

- **kind:** the picture the word should have: `photo`, `cartoon` or `emoji`.
- **emoji:** 1–3 emoji that show the meaning. They never sound like the word or spell it (no puns like 🐝 + 🍃 for "belief").
- **svg:** `cartoons/<word>.svg`, under `public/vocab-pics/`.
- **photo:** `{file, credit, license, source, alt}`, from `src/shared/wordPhotos.js` (made by `scripts/word-photos/fetch.mjs`; empty for a word until its photo is in).
- **alt:** one plain sentence describing the picture that shows now, for read-aloud and screen readers. A photo's own `alt` replaces it once the photo is in.

`pictureFor(word, entry?)` returns the best picture available, as `{w, kind, emoji, src?, alt, credit?}`: the photo if its file is there, then the cartoon, then the emoji. `src` starts with `/vocab-pics/`.

**Words a teacher or grown-up adds** (F92, Oct 30, 2026): pass the word's entry (`pictureFor(word, entry)`). It shows, in order, the free-license photo they picked (`entry.photo`, with its credit), a cartoon drawn later (`CLASS_CARTOONS`), the emoji they chose (`entry.pic`, 1–3 emoji and nothing else, `validPictureEmoji`), or else the emoji suggested from the meaning (`suggestEmoji`, unless `entry.noPic`). With none of those it's `null` and the card shows no picture. `validWord` in `vocab.js` keeps `photo`, `pic` and `noPic`. The picture boxes (🔍 Find a photo, the emoji) and the 🎨 cartoon ramp are in `VOCAB.md`, "Pictures for added words"; drawing a cartoon for an added word is in `WORD-CARTOONS.md`.

## The cartoons

- **Style:** Pet World's colors (`src/styles/game.css` `:root`: berry, mint, butter, wood, grass, the pink background), flat fills, thick round brown outlines, cute cats, dogs and bunnies acting out the meaning. One idea per picture.
- **Size:** square 200 × 200 viewBox, readable at 120px on a phone, each under 8 KB (all but `survey.svg`, at 7 KB, are under 6 KB).
- **No words in the pictures.** The only text is a few big numbers where the number is the point: `estimate` (a thought bubble saying "50?"), `century` (100 on a cake), `perspective` (6 and 9) and `sequence` (1 2 3). These are listed in `TEXT_OK` in `scripts/word-cartoons/scenes.mjs`. A few pictures use a big ! or ? or =.
- **Pairs that teach the difference:** `accurate` (arrow in the bullseye) and `approximate` (arrow in the next ring out, with a clear gap from the middle); `abundant` (overflowing basket) and `scarce` (one carrot left in the same basket); `compare` (overlapping circles: alike and different) and `contrast` (night and day, back to back); `evidence` (the clue bag) and `infer` / `conclusion` (working out the answer from the clues).

### How the cartoons are made

They're drawn in code, not traced or generated: `scripts/word-cartoons/lib.mjs` is a small drawing kit (pets with moods and poses, hearts, stars, speech and thought bubbles, arrows, props), and `scripts/word-cartoons/scenes.mjs` has one scene per word, with a comment saying what it shows.

```
node scripts/word-cartoons/draw.mjs            # writes every public/vocab-pics/cartoons/<word>.svg
node scripts/word-cartoons/draw.mjs scarce     # just one
node scripts/word-cartoons/render.mjs          # PNGs at 160px + contact sheets in /home/claude/pics-check
node scripts/check-word-pictures.mjs           # the checks below
```

Look at the contact sheets after any change. Every picture should be clear at phone size, mean the word, and be something a 6th grader can't misread.

## Adding or replacing a picture

- **Change a cartoon:** edit its scene in `scenes.mjs`, run `draw.mjs <word>`, `render.mjs`, look at the PNG, run the check. To hand-edit an SVG file instead, delete its scene so `draw.mjs` doesn't overwrite it.
- **Make a word a cartoon:** add a scene, set the entry's `kind: 'cartoon'` (the `svg` path is filled in by `E()`), and keep the cartoons between 25% and 50% of the words.
- **Change an emoji scene:** edit `emoji` and `alt` in `wordPictures.js`. Show the meaning, not the sound.
- **A new built-in word** needs an entry, or the check fails.

## The photo plan

1. **Free licenses only:** public domain, CC0, CC BY or CC BY-SA, from Wikimedia Commons, Unsplash, Pexels or Pixabay. No "editorial use only", no watermarks, nothing with a recognizable child's face.
2. **Credit kept:** each photo's entry records `credit` (photographer), `license` (like `CC BY-SA 4.0`), and `source` (the page it came from). When the photos are on the cards, the credit should show in small print under each one.
3. **Stored in the repo:** the files go in `public/vocab-pics/photos/<word>.jpg`, cropped square, about 400 × 400, under 60 KB each, so pictures work offline and never load from another site. The check fails on a photo given as a web link.
4. **Same bar as the cartoons:** the photo has to show the meaning at 120px. If no good free photo turns up, make the word an emoji or cartoon word instead.
5. **Each photo gets its own `alt`.**

The check fails if a photo is missing its file, credit, license or source.

### How the photos are made

`scripts/word-photos/picks.json` has one entry per photo word: the Commons file name, the photo's own `alt`, and `"fit":"contain"` for a wide picture whose meaning would be cut off by a square crop (only `debate`, two speakers at podiums). The picks were made by looking at the candidates at card size: the photo has to show the meaning, nothing with a recognizable child's face, no brand or logo as the point of the picture, and no photo of a current politician.

```
npm i --no-save sharp          # once; only this script needs it
npm run word-photos            # every word; or: node scripts/word-photos/fetch.mjs vivid rapid
node scripts/check-word-pictures.mjs
```

The script asks Commons for each file's license and author and refuses anything that isn't CC0, public domain, CC BY or CC BY-SA, downloads a 960px copy, crops it to 400 × 400 (sharp's "attention" crop keeps the subject in frame), saves a JPEG under 60 KB as `public/vocab-pics/photos/<word>.jpg`, and writes `src/shared/wordPhotos.js` (`file`, `credit` = the author, `license`, `source` = the Commons page, `alt`). Don't edit `wordPhotos.js` by hand. The card shows the credit and license in small print under the photo (`📷 Author · CC BY-SA 4.0`).

**To swap a photo:** change its `file` (and `alt`) in `picks.json`, run the script for that word, look at the JPEG, run the check.

## What the check covers

`node scripts/check-word-pictures.mjs`:

- every built-in word (`VOCAB_WORDS` + `PATTERN_WORDS`) has exactly one entry, and no entry is for a word that isn't built in
- every entry has a kind, a 1–3 emoji scene that is only emoji, and a one-sentence alt with curly apostrophes
- every cartoon file exists, is valid XML, has a square viewBox, is under 8 KB, and has no script, image or outside link
- cartoons are 25–50% of the words
- no picture has its own word written in it, and only the `TEXT_OK` words have any text with letters
- every photo that's been added has its file, credit, license and source; it's a square JPEG about 400 × 400 under 60 KB, with an open license, its Commons page as the source and a one-sentence alt
- every photo word is in `picks.json`, and every pick is a photo word
- `pictureFor` falls from photo to cartoon to emoji, gives a grown-up's word its chosen emoji, and gives `null` for unknown words

The check isn't in `npm run verify` yet. It belongs there once the pictures are on the cards.

## Every word

| Word | Kind | Emoji | Picture (alt) |
|---|---|---|---|
| analyze | cartoon | 🔍🧩 | A cat holds a magnifying glass over one piece of a toy robot that was taken apart. |
| compare | cartoon | 🍎↔️🍐 | Two circles overlap: a cat in one, a dog in the other, and a heart in the middle that they both share. |
| contrast | cartoon | ☀️↔️🌙 | A dark cat at night and a white cat in the sunshine sit back to back. |
| describe | cartoon | 🐶💬🔴 | A dog tells three things about a red ball: its color, how big it is, and how it bounces. |
| evidence | cartoon | 🐾🔍✅ | A detective dog holds up a clue bag with a paw print in it, next to a green check. |
| predict | cartoon | 🌧️➡️☂️ | A cat sees dark clouds, thinks of rain, and holds up an umbrella before the rain starts. |
| summarize | cartoon | 📚➡️📝 | A tall stack of pages goes in and one small card with the main ideas comes out. |
| infer | cartoon | 🍪🐾🤔 | An empty cookie jar, a trail of crumbs, and a dog’s wagging tail sticking out of a bush: the cat figures out who ate the cookies. |
| explain | cartoon | 🧑‍🏫💡 | A dog at a board shows how a seed grows into a flower, and the bunny gets it, with a light bulb over its head. |
| identify | cartoon | 👉🐦🏷️ | Birds sit in a row and a dog points at one red bird that is circled, with a name tag. |
| abundant | cartoon | 🥕🥕🧺 | A basket overflows with carrots and more carrots lie all around a happy bunny. |
| scarce | cartoon | 🧺🥕😟 | A worried bunny looks at a basket with just one carrot left in it. |
| fragile | photo | 🥚⚠️ | An egg and a warning sign: careful, it breaks easily. |
| sturdy | photo | 🧱💪 | A brick and a strong arm: something strong that won’t break. |
| ancient | photo | 🏛️🏺 | An old stone temple and a clay pot from long ago. |
| modern | photo | 📱🏙️ | A smartphone and a city of tall glass buildings from today. |
| enormous | photo | 🐋🌊 | A giant whale in the ocean. |
| minute | photo | 🐜🔍 | A tiny ant under a magnifying glass. |
| reluctant | cartoon | 🛁🐕😖 | A kind cat gently pulls a dog toward a bubble bath, but the dog leans way back with its paws dug in. |
| eager | cartoon | 🐕🦮🤩 | A dog jumps by the door with its leash in its mouth and its tail wagging. |
| cautious | cartoon | 👀🚸 | A cat tiptoes across a log over the water with its arms out, watching every step. |
| confident | cartoon | 😎💪 | A dog stands tall on a stage with its paws on its hips and a big smile. |
| curious | photo | 🐈❓ | A cat and a question mark: wanting to find out. |
| generous | cartoon | 🍪🤲❤️ | A cat with two cookies hands one to a bunny, and a heart floats above them. |
| honest | cartoon | 🙋💔🏺 | Next to a big broken vase, a dog raises its paw and says it did it, and the cat smiles. |
| patient | emoji | ⏳🙂 | An hourglass and a calm smile: waiting without getting upset. |
| persistent | cartoon | 🧗💦🚩 | A sweaty bunny keeps pushing a big rock up a steep hill toward a flag. |
| responsible | photo | 🧒🥣🐶 | A child filling a dog’s food bowl. |
| timid | cartoon | 🐰🙈 | A shy bunny peeks out from behind a tree while a dog waves hello. |
| grateful | cartoon | 🎁🥰🙏 | A cat hugs a present with happy closed eyes and hearts all around. |
| accurate | cartoon | 🎯 | An arrow right in the middle of a target. |
| approximate | cartoon | 🎯🤏 | An arrow that landed close to the middle of the target, in the next ring out, but not in the middle. |
| estimate | cartoon | 🫙🍬🤔 | A dog looks at a jar of gumballs and thinks “50?” |
| calculate | photo | 🧮➕ | An abacus and a plus sign: working out an answer with math. |
| pattern | photo | 🔴🔵🔴 | Red, blue, red: something that repeats. |
| equivalent | cartoon | 🍕⚖️🍕 | A balance holds half a pizza on one side and two quarters on the other, perfectly level. |
| interpret | cartoon | 🐕〰️😊 | A dog wags its tail hard, and the cat figures out what the wag means: the dog is happy. |
| data | emoji | 📊📋 | A bar chart and a clipboard of numbers that were collected. |
| survey | cartoon | 📋🙋🙋 | A cat with a clipboard asks three friends the same question and marks each answer. |
| conclusion | cartoon | 🧠➡️✅ | Three clues, a chewed shoe, muddy paw prints and a tipped-over empty bowl, all point to one answer: the puppy. |
| habitat | photo | 🐸🌿💧 | A frog among plants by the water, where it lives. |
| adapt | cartoon | ☀️➡️🧣 | A cat moves from a sunny place to a snowy one and puts on a hat and scarf. |
| migrate | photo | 🪿➡️☀️ | A goose flying toward the warm sun. |
| predator | photo | 🦁😋 | A hungry lion licking its lips. |
| prey | photo | 🐇🏃💨 | A rabbit running away fast. |
| organism | photo | 🐛🌱🍄 | A caterpillar, a sprout and a mushroom: all living things. |
| environment | photo | 🌳🏞️☀️ | Trees, a river and the sun: everything around living things. |
| erosion | photo | 🌊🪨 | Waves wearing away a rock. |
| nutrient | photo | 🥦🍎💪 | Broccoli and an apple that help you grow strong. |
| observe | photo | 👀🐦📓 | Eyes watching a bird and a notebook to write down what you see. |
| century | cartoon | 🎂💯 | A birthday cake with “100” on it: a hundred years. |
| civilization | photo | 🏛️🏙️👑 | A temple, a city and a crown: a big society with cities and leaders. |
| culture | photo | 🎎🍜🎶 | Dolls, a bowl of noodles and music: a group’s way of life. |
| empire | emoji | 👑🗺️ | A crown over a map: many lands ruled by one leader. |
| trade | photo | 🍎🔄🍪 | An apple swapped for a cookie. |
| tradition | photo | 🦃👵👧 | A holiday turkey, a grandma and a girl: a custom passed down. |
| artifact | photo | 🏺 | A clay pot made by people long ago. |
| source | cartoon | 📖➡️💡 | A page, a star and a light bulb float out of an open book and into a surprised cat’s thoughts. |
| conflict | cartoon | 😾🪢🐶 | An angry cat and an angry dog pull on the same toy. |
| migration | photo | 🦬🦬➡️ | A herd of animals moving to a new place. |
| consequence | cartoon | 🟫➡️🛁 | First a dog splashes in mud, then, because of that, it has to take a bath. |
| cooperate | cartoon | 🤝📦 | A cat and a dog carry one big heavy box together. |
| determine | emoji | 🪙🔍 | A coin and a magnifying glass: flipping a coin to find out who goes first. |
| essential | emoji | 💧🍞 | Water and bread: things you really need. |
| frequent | emoji | 🔁🔁🔁 | Repeat arrows again and again: happening often. |
| influence | cartoon | 😎➡️😎 | One cat puts on sunglasses, and both of its friends copy it and put theirs on too. |
| obstacle | photo | 🚧🪨 | A road block and a big rock in the way. |
| opinion | cartoon | 🥦😋😖 | The same plate of broccoli: the cat thinks it is yummy, the dog thinks it is yucky. |
| reveal | cartoon | 🎁✨🐰 | A cat lifts a cloth and shows the surprise hidden underneath: a bunny. |
| require | emoji | 🌱💧☀️ | A little plant with water and sunshine: the things it needs to grow. |
| astonished | cartoon | 😲 | A dog’s eyes go huge and its mouth falls open when it sees a giant bone. |
| distinct | cartoon | ⚪🔴⚪ | A row of gray cats, and one bright orange cat that stands out. |
| drowsy | photo | 🥱😴 | A big yawn and sleepy eyes. |
| eventually | cartoon | 🐌🛤️🏁 | A snail crawls a long, winding path and finally reaches the flag. |
| hesitate | cartoon | 🤔🛑 | A bunny stops at the end of a diving board with one foot out, not sure about jumping. |
| immense | photo | 🏔️🧍 | A huge mountain next to a tiny person: really, really big. |
| peculiar | photo | 🤨👽 | A puzzled face and an alien: something strange. |
| rapid | photo | 🐆💨 | A cheetah running very fast. |
| vivid | photo | 🌈🌺 | A bright rainbow and a bright flower. |
| wander | photo | 🚶〰️🌲 | Someone walking a wiggly path through the trees with no plan. |
| accomplish | cartoon | 🏔️🚩🎉 | A dog reaches the top of a mountain and plants its flag. |
| demonstrate | photo | 🧑‍🏫🧪👀 | A teacher shows an experiment while someone watches. |
| expand | photo | 🎈↔️ | A balloon stretching wider as it fills up and gets bigger. |
| improve | cartoon | 📈⭐ | Three drawings of a sun by the same bunny, each one better than the last. |
| investigate | photo | 🕵️🔍 | A detective with a magnifying glass looking for the truth. |
| locate | emoji | 🗺️📍 | A map with a pin on the spot. |
| perform | photo | 🎭🎤👏 | A show on a stage with a microphone and clapping. |
| protect | photo | 🛡️🐣 | A shield in front of a baby chick. |
| survive | photo | 🌵☀️ | A cactus staying alive in the hot desert sun. |
| transform | photo | 🐛➡️🦋 | A caterpillar that becomes a butterfly. |
| boundary | photo | 🏡🛑 | A house and a stop sign: this is where the yard ends. |
| compromise | cartoon | 🍕🤝 | A cat and a dog who both wanted the pizza each take half. |
| debate | photo | 🗣️🆚🗣️ | Two speakers on different sides. |
| emphasize | emoji | 📝🖍️ | A page and a marker: coloring over the part that matters most. |
| perspective | cartoon | 👁️6️⃣9️⃣ | A number lies flat on the floor between a cat and a dog: the cat sees a 6, and the dog on the other side sees a 9. |
| precise | photo | 📏🎯 | A ruler and a bullseye: exact and careful. |
| relevant | cartoon | 🏖️🕶️✅ | Packing for the beach: sunglasses and a sand pail get a check, a winter hat gets an X. |
| sequence | cartoon | 🥚🐣🐔 | An egg, then the egg cracking, then a chick, numbered 1, 2, 3. |
| significant | emoji | 🐘🐭 | A huge elephant next to a tiny mouse: a difference big enough to notice. |
| thorough | cartoon | 🧹✅✅ | A bunny checks every box on the cleaning list and sweeps under the bed too. |
| prepare | photo | 🎒✅ | A packed backpack with a check: ready to go. |
| prevent | photo | ⛑️🚲 | A helmet for riding a bike, to stop you from getting hurt. |
| previous | emoji | ⏮️📅 | A back button and a calendar: the one before. |
| perhaps | emoji | 🤷 | A shrug: maybe. |
| permit | emoji | 👍✅ | A thumbs up and a check: yes, you are allowed. |
| persuade | cartoon | 🗣️👍 | A cat shares three good ideas, and the dog changes its mind from no to yes. |
| produce | photo | 🚜🌽 | A tractor and corn growing on a farm. |
| promise | emoji | 🤝💬 | A handshake and words: saying you will surely do it. |
| believe | emoji | 💬🤔👍 | Hearing what someone says, thinking about it, and agreeing it is true. |
| receive | photo | 📦🤲 | Hands getting a package. |
| neighbor | photo | 🏠👋🏠 | Two houses side by side and a wave hello. |
| piece | photo | 🧩🍕 | A puzzle piece and a slice of pizza: one part of something. |
| ceiling | photo | 🏠⬆️🕷️ | A house, an up arrow and a spider: the spider hangs from the top of the room. |
| field | photo | 🌾🌻 | An open area of grass and sunflowers. |
| necessary | emoji | 🔑🔒 | A key and a lock: you need the key to open it. |
| tomorrow | emoji | 📅➡️🌅 | A calendar and an arrow to the next sunrise. |
| occasion | photo | 🎉🎂 | A party with a cake: a special event. |
| address | photo | 🏠📫 | A house and its mailbox. |
| success | photo | 🏆🎉 | A trophy and a celebration. |
| beginning | emoji | 🚦🏃 | A green light and a runner starting. |
| important | emoji | 📌⭐ | A pin and a star: this matters a lot, so keep it in mind. |
| different | emoji | 🍎🍌 | An apple and a banana: not the same. |
| patience | emoji | ⏳🙂 | An hourglass and a calm smile. |
| distance | photo | 📍↔️📍 | Two pins with an arrow between them: how far apart they are. |
| excellent | emoji | 🌟💯 | A gold star and a hundred points. |
| assistant | photo | 🤝🧰 | A helping hand passing a toolbox. |
| comfortable | photo | 🛋️😌 | A soft couch and a relaxed face. |
| possible | emoji | 🏊✅ | A swimmer and a check: yes, it can happen. |
| valuable | photo | 💎💰 | A diamond and a bag of money: worth a lot. |
| visible | emoji | 🌕👀 | A bright full moon and eyes: you can see it in the sky. |
| terrible | emoji | 😫⛈️ | An upset face and a storm: very bad. |
| reliable | photo | 🐕‍🦺🤝 | A service dog you can count on. |
| question | emoji | ❓🙋 | A question mark and a raised hand. |
| vacation | photo | 🏖️🧳 | A beach and a suitcase. |
| decision | cartoon | 🛤️🤔 | A cat stands where the path splits in two and picks one way. |
| television | photo | 📺 | A TV screen. |
| musician | photo | 🧑‍🎤🎸 | A singer and a guitar. |
| attention | emoji | 👀👂 | Eyes and an ear: watching and listening carefully. |
| circle | emoji | ⭕ | A round ring. |
| notice | emoji | 👀🪧 | Eyes spotting a new sign. |
| decide | emoji | 📚👉 | A finger pointing at one book: making up your mind which one to read. |
| concert | photo | 🎤🎶🎸 | A microphone, music notes and a guitar: a music show. |
| cycle | emoji | 🔄💧 | A circle of arrows and a water drop: something that repeats. |
