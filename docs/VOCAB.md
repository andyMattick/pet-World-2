# Word Workshop

Vocabulary practice: 🃏 practice cards, ⚡ word sprint, 🔤 spell it, and 📊 my words. The words are in `src/shared/vocab.js`, plus the class's words (teacher app → Vocabulary) or a parent's own words.

## Hearing the word

Spelling cards read the word aloud. The voice comes from the device, so it sounds different on a Chromebook, an iPad, Windows and a Mac.

- **The voice:** Pet World picks the clearest English voice the device has. It prefers voices named Natural, Google or Enhanced, and skips the joke voices some Macs include. To try others, open Practice cards or Spell it and use **🔊 Reading voice**. The choice is saved with her town (`S.ttsVoice`).
- **🔊 Hear the word:** the whole word at a normal pace.
- **🐢 By syllables:** each syllable on its own with a short pause, then the whole word. The dots next to the buttons show how many syllables there are and light up one at a time. The dots don't give away the spelling.
- **Slowly:** the whole word, slower.
- **After she answers:** the word is shown split into syllables ("sur·vive", 2 syllables) with buttons to hear it again.

Each built-in word has two versions of its syllables in `vocab.js` (`SYLLABLE_DATA`):

- **To show:** dictionary breaks, like `an·a·lyze`.
- **To say:** respelled so a computer voice says each piece clearly, like `an|uh|lize`. Read on its own, "lyze" can come out wrong.

A third field fixes words the voice gets wrong on its own: "minute" meaning tiny is said "my noot".

Words a teacher or parent adds are split by a simple rule (vowel groups, with ch, sh, th and the like kept together). Those pieces are said as written.

To make a voice sound better on a device, install a better one:

- **Windows:** Settings → Time & language → Speech. Edge's "Natural" voices are the best of the free ones.
- **Mac and iPad:** Settings → Accessibility → Spoken Content → System Voice. Download an "Enhanced" or "Premium" voice such as Ava or Samantha.

## Word levels (adaptive)

Every word has a level from its syllables, its length, and tricky spellings like ough, -tion and ie (`wordLevel` in `vocab.js`):

- 🌱 **Easier:** short, 1 or 2 syllables, like compare or rapid.
- 🌿 **Middle:** like accurate or habitat.
- 🌳 **Harder:** like civilization or approximate.

She has her own level for spelling and another for the meaning cards (`S.vocab.level`). Spelling starts at Easier.

- She only gets words at or below her level, mostly at it.
- **2 misses in a row** drop her a level ("🌱 Let's try some easier words for a bit").
- **4 right in a row** move her up a level.
- **Easier** and **Harder** buttons on the start screen change it by hand.
- Words she has missed still come back more often.

## Spelling patterns

When she misspells a word, Pet World lines up what she typed with the right word and names the kind of mistake (`src/shared/spellingPatterns.js`):

| Pattern | Example |
|---|---|
| pre / per / pro at the start | perdict → predict |
| ie or ei | recieve → receive |
| Double letters | acurate → accurate |
| -ant / -ent, -ance / -ence | relevent → relevant |
| -ible / -able | responsable → responsible |
| -tion / -sion / -cian | conclution → conclusion |
| c that sounds like s or k | presise → precise |
| Letters switched | invesitgate → investigate |
| The quiet "uh" vowel | seperate → separate |
| Missing letters or sounds | enviroment → environment |
| Extra letters | thourough → thorough |

- **For her:** right after a miss she sees "Tricky part: pre / per / pro at the start", with a tip on how to remember it.
- **What's saved:** her last 80 misses, in `S.vocab.mistakes`.

**For the teacher:** the Vocabulary tab has a ✏️ Spelling patterns card for each student who has misspelled words. It lists each pattern with how often it happened, what she wrote, and how to teach it. Below that are **suggested words** for the same patterns: the words she missed, then practice words built for that pattern, then words from the lists. **Practice these with …** saves the ticked words for that student (`quiz_overrides.spellFocus`). They come up 3 times as often in her Word Workshop until they're solid, at any level.

The practice words built for each pattern (prepare, prevent, perhaps, believe, receive, necessary, -able and -ible words, and others) are in `PATTERN_WORDS` in `vocab.js`. Each has a meaning, a sentence and its syllables.

## Spelling patterns: add to focus and practice (October 2026)

The **Add to focus and practice with …** button under each student's suggested words used to do nothing after any other save on the Vocabulary tab, because the redraw dropped the button's handler. Now:
- The ticked words are saved as that student's practice words (`spellFocus`).
- Words not on the class list are added (set "Spelling patterns") and marked **➕ new** beforehand.
- When the class uses focus words, words that aren't focus words are added to them, marked **○ not in focus** beforehand.
- A message in that student's box says what was saved and added.
