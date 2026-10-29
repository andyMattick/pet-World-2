/* 📚 Book Repair Desk (English Unit 7, the Pause Library; docs/ENGLISH-UNIT7.md)
   Books come back to the library with a mark torn out of a sentence. She picks the mark (or title, or word) that fixes
   the sentence and sees it read back. A wrong pick tells her why that mark doesn't fit, and the book goes to the back of
   the cart to fix again later, so every shift ends with every book fixed. Stars come from books fixed on the first try.
   One shelf of 7 books per block of the unit. No DOM here: the game screen is in src/game/game.js (renderBookRepair),
   and the Arcade copy is arcade/book-repair/index.html.

   A book: text with ___ where the fix goes (every ___ gets the same pick); choices: [text, why], the first one right
   ('' means no mark; _words_ show in italics). note: an original quotation to show above the sentence. */

export const REPAIR_SHELVES = [
  {id:'colons', name:'Shelf 1: Colons', emoji:'📌'},
  {id:'semicolons', name:'Shelf 2: Semicolons, commas, and colons', emoji:'🌉'},
  {id:'formatting', name:'Shelf 3: Titles and parentheses', emoji:'📚'},
  {id:'dashes', name:'Shelf 4: Dashes, hyphens, and ellipses', emoji:'✂️'}
];

export const REPAIR_BOOKS = [
  /* Shelf 1: colons */
  {shelf:'colons', title:'The Camping Guide', text:'Pack three things___ a flashlight, a map, and a snack.',
    choices:[[':', 'A colon after a complete sentence points ahead to the list.'], [',', 'A comma here makes “a flashlight” look like a fourth thing to pack. A colon introduces the list.'], [';', 'A semicolon needs a complete sentence on both sides, and a list isn’t a sentence.']]},
  {shelf:'colons', title:'Fruit Facts', text:'My favorite fruits are___ mangoes and pears.',
    choices:[['', 'Right: no mark at all! “My favorite fruits are” can’t stand alone, so it can’t come before a colon.'], [':', 'A colon can’t come right after a verb like are. The words before a colon must be a complete sentence.'], [';', 'A semicolon needs a complete sentence on both sides.']]},
  {shelf:'colons', title:'Bus Schedules', text:'The last bus leaves at 9___45 tonight.',
    choices:[[':', 'A colon separates the hour from the minutes.'], [';', 'A semicolon joins sentences. Times use a colon.'], [',', 'A comma splits numbers into thousands, like 9,450. Times use a colon.']]},
  {shelf:'colons', title:'Letters to the Mayor', text:'Dear Mayor Gomez___',
    choices:[[':', 'The greeting of a business letter ends with a colon.'], [';', 'A semicolon joins two sentences. A business letter greeting ends with a colon.'], ['.', 'A period would end the greeting like a sentence. A business letter greeting ends with a colon.']]},
  {shelf:'colons', title:'Science News', text:'Our class read the article “Tiny Giants___ The Secret Life of Ants.”',
    choices:[[':', 'A colon separates a title from its subtitle.'], [';', 'A semicolon joins two sentences, and a subtitle isn’t one. Use a colon.'], [',', 'A comma makes the subtitle look like a second, separate book. Use a colon.']]},
  {shelf:'colons', title:'The Flicker Mystery', text:'We finally learned why the lights kept flickering___ a squirrel had chewed the wires.',
    choices:[[':', 'What comes after the colon explains why. A colon points to the explanation.'], [',', 'A comma alone can’t join two complete sentences. That’s a comma splice.'], ['-', 'A hyphen joins two words into one word. It can’t join two sentences.']]},
  {shelf:'colons', title:'The Library Rulebook', text:'The library has three rules___ be quiet, be kind, and return your books.',
    choices:[[':', 'The colon follows a complete sentence and points to the three rules.'], [';', 'A semicolon needs a complete sentence on both sides. The rules here are a list.'], ['', 'With no mark, the sentence runs straight into the list. A colon introduces it.']]},
  /* Shelf 2: semicolons, commas, and colons */
  {shelf:'semicolons', title:'Night Owls', text:'The owl stayed awake___ the mice stayed hidden.',
    choices:[[';', 'Two complete, related sentences with no joining word: a semicolon is the bridge.'], [',', 'A comma alone can’t join two complete sentences. That’s a comma splice.'], [':', 'A colon points to an explanation or a list. These are two equal ideas.']]},
  {shelf:'semicolons', title:'Night Owls, Part 2', text:'The owl stayed awake___ so the mice stayed hidden.',
    choices:[[',', 'With a joining word like so, a comma is all you need.'], [';', 'A semicolon replaces the joining word. With “so” already there, use a comma.'], [':', 'A colon points to an explanation or a list, not a joining word.']]},
  {shelf:'semicolons', title:'The Leaky Roof', text:'The roof leaked all night___ however, the books stayed dry.',
    choices:[[';', 'A semicolon comes before a joining word like however when it starts the second sentence.'], [',', 'A comma before “however” here makes a comma splice. Use a semicolon.'], ['-', 'A hyphen joins two words into one. Use a semicolon before however.']]},
  {shelf:'semicolons', title:'Road Trip Diaries', text:'We met Ava from Reno, Nevada___ Ben from Provo, Utah; and Cal from Boise, Idaho.',
    choices:[[';', 'The list items already have commas inside them, so semicolons separate the items.'], [',', 'With commas between cities and states, more commas make it hard to tell where each person ends. Use a semicolon.'], [':', 'A colon comes before a list, not between the items.']]},
  {shelf:'semicolons', title:'The Wobbly Shelf', text:'Because the shelf was wobbly___ we fixed it with tape.',
    choices:[[',', '“Because the shelf was wobbly” can’t stand alone, so a comma ends the introduction.'], [';', 'A semicolon needs a complete sentence on both sides, and “Because the shelf was wobbly” isn’t one.'], [':', 'A colon needs a complete sentence before it.']]},
  {shelf:'semicolons', title:'Wish List', text:'I have one wish___ a quiet reading nook.',
    choices:[[':', 'The colon points to the wish, which explains “one wish.”'], [';', 'A semicolon needs a complete sentence after it, and “a quiet reading nook” isn’t one.'], ['-', 'A hyphen would glue “wish” and “a” into one word.']]},
  {shelf:'semicolons', title:'Two Readers', text:'Mia reads mysteries___ Leo reads comics.',
    choices:[[';', 'Two separate sentences of equal weight: a semicolon balances them.'], [':', 'A colon would mean Leo’s comics explain Mia’s mysteries. They are two equal ideas, so use a semicolon.'], [',', 'A comma alone can’t join two complete sentences. That’s a comma splice.']]},
  /* Shelf 3: titles and parentheses (when typed: whole works in italics, short works in quotation marks) */
  {shelf:'formatting', title:'Book Club Notes', text:'My favorite novel is ___.',
    choices:[['_The Lighthouse Cat_', 'A novel is a whole work, so its title goes in italics.'], ['“The Lighthouse Cat”', 'Quotation marks are for short works like songs and chapters. A novel goes in italics.']]},
  {shelf:'formatting', title:'Concert Program', text:'The choir sang ___ at the concert.',
    choices:[['“Rainy Day Parade”', 'A song is a short work, so its title goes in quotation marks.'], ['_Rainy Day Parade_', 'Italics are for whole works like albums. A single song goes in quotation marks.']]},
  {shelf:'formatting', title:'Movie Night', text:'We watched the movie ___ twice.',
    choices:[['_Space Pups_', 'A movie is a whole work, so its title goes in italics.'], ['“Space Pups”', 'Quotation marks are for short works. A movie goes in italics.']]},
  {shelf:'formatting', title:'The Secret Door', text:'The chapter ___ is the best part of the book.',
    choices:[['“The Hidden Stairs”', 'A chapter is part of a bigger work, so its title goes in quotation marks.'], ['_The Hidden Stairs_', 'Italics are for the whole book. A chapter goes in quotation marks.']]},
  {shelf:'formatting', title:'Poetry Corner', text:'I read the poem ___ out loud.',
    choices:[['“Moon over the Pond”', 'A poem is a short work, so its title goes in quotation marks.'], ['_Moon over the Pond_', 'Italics are for whole works like books. A poem goes in quotation marks.']]},
  {shelf:'formatting', title:'Meet the Staff', text:'Our librarian ___ loves owls.',
    choices:[['(Ms. Okafor)', 'Parentheses hold the extra detail. Take it out, and the sentence still makes sense.'], ['(Ms. Okafor', 'Parentheses come in pairs. Close the parentheses after the extra detail.'], ['Ms. Okafor)', 'Parentheses come in pairs. Open them before the extra detail.']]},
  {shelf:'formatting', title:'Hiking Trails', text:'We hiked to the falls ___ and then we ate lunch.',
    choices:[['(about two miles),', 'The comma belongs to the main sentence, so it goes after the closing parenthesis.'], ['(about two miles,)', 'The comma belongs to the main sentence, not to the extra detail. It goes after the closing parenthesis.'], [', (about two miles)', 'The comma goes after the closing parenthesis, not before the opening one.']]},
  /* Shelf 4: dashes, hyphens, and ellipses */
  {shelf:'dashes', title:'The Old Trunk', text:'We opened the old trunk and found___a single gold coin.',
    choices:[['—', 'A dash makes the reader stop for the surprise.'], ['-', 'That’s a hyphen. It would glue “found” and “a” into one word. A dash sets up the surprise.'], [';', 'A semicolon needs a complete sentence after it, and “a single gold coin” isn’t one.']]},
  {shelf:'dashes', title:'Pet Records', text:'My grandma has a ___ parrot.',
    choices:[['ten-year-old', 'Before the noun, the words work together as one describing word, so they get hyphens.'], ['ten year old', 'Before the noun, “ten year old” works as one describing word, so it needs hyphens.'], ['ten—year—old', 'Dashes separate parts of a sentence. Hyphens join words into one describing word.']]},
  {shelf:'dashes', title:'Pet Records, Part 2', text:'The parrot is ___.',
    choices:[['ten years old', 'After the noun, these are regular words, so no hyphens.'], ['ten-years-old', 'Hyphens join a describing word that comes before a noun. Here it comes after, so no hyphens.']]},
  {shelf:'dashes', title:'The Big Count', text:'There are ___ books on the cart.',
    choices:[['thirty-four', 'Numbers from twenty-one to ninety-nine get a hyphen.'], ['thirty four', 'Numbers from twenty-one to ninety-nine get a hyphen when you write them in words.'], ['thirty—four', 'That’s a dash. Numbers like thirty-four use a short hyphen.']]},
  {shelf:'dashes', title:'Field Day', text:'Our coach___who hardly ever shouts___yelled, “Run!”',
    choices:[['—', 'A pair of dashes sets off the surprising detail in the middle.'], ['-', 'Those are hyphens. They would glue the words together. A pair of dashes sets off the detail.'], [';', 'Semicolons join complete sentences. The detail here is an interruption, so it needs dashes.']]},
  {shelf:'dashes', title:'The Librarian’s Answer', text:'“Well___ I’m not sure,” said the librarian.',
    choices:[['…', 'The ellipsis shows the librarian pausing to think.'], [':', 'A colon points to a list or an explanation, not a pause in speech.'], [';', 'A semicolon joins two complete sentences, and “Well” isn’t one.']]},
  {shelf:'dashes', title:'The Library Poster', text:'The poster says, “The library ___ has a secret room.”', note:'Original: “The library, which is very old, has a secret room.”',
    choices:[['…', 'An ellipsis shows where words were left out of the quotation.'], ['', 'Words were cut from the quotation, so the reader needs an ellipsis to see that.'], ['—', 'A dash sets off an interruption. To show missing words in a quotation, use an ellipsis.']]}
];

export const booksOn = shelf => REPAIR_BOOKS.filter(b => b.shelf === shelf);
/* the sentence with a pick filled in, as HTML: esc is the caller's escaper; _words_ become italics */
export function repairSentenceHTML(book, pick, esc){
  const fill = pick == null ? '<span class="br-gap">▢</span>' : pick === '' ? '' : `<b class="br-fix">${esc(pick).replace(/_([^_]+)_/g, '<i>$1</i>')}</b>`;
  return esc(book.text).split('___').join(fill).replace(/ {2,}/g, ' ');
}
/* a choice's label on its button */
export const choiceLabel = (text, esc) => text === '' ? 'no mark' : esc(text).replace(/_([^_]+)_/g, '<i>$1</i>');
