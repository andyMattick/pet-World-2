/* Theme days (docs/THEME-DAYS.md): a fun theme for the school day, announced right after the morning brain stretch
   (or when the town first opens, if brain stretches are off). Shared by the game (the announcement, the plan row)
   and the teacher app (class settings). Every device picks the same theme for the same day. */

export interface ThemeDay {
  id: string; emoji: string; name: string;
  wear: string;        // what to wear or bring
  challenge: string;   // something to do during the day, often tied to the lessons
  date?: string;       // "MM-DD": a special day that always lands on this date
}

/* The rotation: one a day (or one each Friday), in this order, then around again. */
export const THEME_DAYS: ThemeDay[] = [
  { id: 'pajamas', emoji: '🛌', name: 'Pajama Day', wear: 'Do school in your coziest pajamas and slippers.', challenge: 'Build a blanket fort and do your Reading Log inside it.' },
  { id: 'stuffies', emoji: '🧸', name: 'Stuffed Animal Day', wear: 'Pick a stuffed animal to be your study buddy all day.', challenge: 'Explain one thing you learned today to your stuffed animal, like you’re the teacher.' },
  { id: 'bookCharacter', emoji: '📚', name: 'Book Character Day', wear: 'Dress up as a character from a book you love.', challenge: 'Answer one written question the way your character would say it.' },
  { id: 'sports', emoji: '🏀', name: 'Sports Day', wear: 'Wear a jersey or your team’s colors.', challenge: 'Score yourself like a game: one point for every practice set you pass. Can you beat 5?' },
  { id: 'crazyHat', emoji: '🎩', name: 'Crazy Hat Day', wear: 'Wear the silliest hat in the house, or make one out of paper.', challenge: 'Every time you pass a quiz, add something new to your hat.' },
  { id: 'mismatch', emoji: '🧦', name: 'Mismatch Day', wear: 'Wear socks that don’t match (and maybe a shirt that doesn’t match either).', challenge: 'Find three things in your lessons today that don’t belong together, like a wrong answer choice that tried to trick you.' },
  { id: 'backwards', emoji: '🔄', name: 'Backwards Day', wear: 'Wear your shirt backwards.', challenge: 'Start with your last subject and end with your first. Say “good night” at breakfast.' },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow Day', wear: 'Wear as many colors as you can at once.', challenge: 'Paint a rainbow in the Art Studio when you finish your work.' },
  { id: 'detective', emoji: '🕵️', name: 'Detective Day', wear: 'Grab a hat, a notebook, and a magnifying glass if you have one.', challenge: 'Ask a grown-up to hide 3 clues around the house. Find one after each subject.' },
  { id: 'chef', emoji: '🧑‍🍳', name: 'Chef Day', wear: 'Put on an apron, or tie a dish towel around your waist.', challenge: 'Help make lunch and measure the ingredients yourself. Fractions count as math!' },
  { id: 'camping', emoji: '🏕️', name: 'Camping Day', wear: 'Wear a flannel shirt or a hoodie and grab a flashlight.', challenge: 'Read by flashlight, and tell a (not too scary) story at the end of the day.' },
  { id: 'superhero', emoji: '🦸', name: 'Superhero Day', wear: 'Make a cape out of a towel or a blanket.', challenge: 'Decide your superpower. Use it to “rescue” every question you got wrong yesterday.' },
  { id: 'beach', emoji: '🏖️', name: 'Beach Day', wear: 'Sunglasses on, beach towel on your chair.', challenge: 'Have lemonade with lunch, and make a sand-castle drawing in the Art Studio.' },
  { id: 'artist', emoji: '🎨', name: 'Artist Day', wear: 'Wear a beret, an old shirt, or something with paint on it.', challenge: 'Draw a picture of something you learned today and show it to someone.' },
  { id: 'robot', emoji: '🤖', name: 'Robot Day', wear: 'Wear something silver or gray, or make a robot badge.', challenge: 'Talk like a robot for one whole subject. BEEP. BOOP. LESSON. COMPLETE.' },
  { id: 'royal', emoji: '👑', name: 'Royal Day', wear: 'Wear a crown (paper works) and your fanciest clothes.', challenge: 'Speak like royalty all day: “Might I have a snack, Your Majesty?”' },
  { id: 'twin', emoji: '👯', name: 'Twin Day', wear: 'Dress just like Mom, Dad, or a brother or sister.', challenge: 'Your twin picks one question for you to explain out loud.' },
  { id: 'farm', emoji: '🐄', name: 'Farm Day', wear: 'Wear overalls, boots, or a bandanna.', challenge: 'Do one “chore” after each subject, like feeding a pet or watering a plant.' }
];

/* Special days: these always win on their date. The 100th day of school comes from the school year's start date
   (set on the student's Transcript tab), counting weekdays. */
export const SPECIAL_DAYS: ThemeDay[] = [
  { id: 'piDay', date: '03-14', emoji: '🥧', name: 'Pi Day', wear: 'Wear something round, or something with numbers on it.', challenge: 'Learn the first 10 digits of pi: 3.141592653. Eat a slice of pie (or pizza) if you can.' },
  { id: 'earthDay', date: '04-22', emoji: '🌎', name: 'Earth Day', wear: 'Wear green or blue.', challenge: 'Do one lesson outside, then pick up litter or plant something.' },
  { id: 'spaceDay', date: '05-04', emoji: '🚀', name: 'Space Day', wear: 'Wear something with stars, planets, or rockets on it.', challenge: 'Find the Moon tonight and draw what shape it is.' },
  { id: 'pirateDay', date: '09-19', emoji: '🏴‍☠️', name: 'Talk Like a Pirate Day', wear: 'Eye patch, bandanna, and a pirate hat if ye have one.', challenge: 'Say “Arrr!” every time you get a question right. Play Corsair’s Cove after your work if the Arcade is open.' },
  { id: 'costumeDay', date: '10-31', emoji: '🎃', name: 'Costume Day', wear: 'Wear your Halloween costume to school.', challenge: 'Stay in character for one whole subject.' },
  { id: 'hundredDay', emoji: '💯', name: '100th Day of School', wear: 'Dress like you’re 100 years old: glasses, a cardigan, a cane made of a broom.', challenge: 'Count 100 of something (cereal, pennies, LEGO) and write what you’d do with $100.' }
];
export const ALL_THEMES = [...THEME_DAYS, ...SPECIAL_DAYS];
export const themeById = (id: string) => ALL_THEMES.find(t => t.id === id);

/** Class setting game_settings.themes: off until a teacher turns it on; "every" school day or Fridays only;
    every rotating theme is in the cycle unless unchecked; special days can be turned off together. */
export interface ThemeSettings { enabled: boolean; when: 'every' | 'fri'; special: boolean; themes: Record<string, boolean> }
export function themeSettings(raw: Partial<ThemeSettings> | null | undefined): ThemeSettings {
  return { enabled: raw?.enabled === true, when: raw?.when === 'fri' ? 'fri' : 'every', special: raw?.special !== false,
    themes: Object.fromEntries(THEME_DAYS.map(t => [t.id, raw?.themes?.[t.id] !== false])) };
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const dayNumber = (day: string) => Math.floor(Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10)) / 86400000);
const weekday = (day: string) => new Date(Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10))).getUTCDay();   // 0 Sunday … 6 Saturday
/** Weekdays from a school year's first day through this day (the first day is day 1). */
export function schoolDayNumber(day: string, start: string): number {
  if (!DAY.test(day) || !DAY.test(start) || day < start) return 0;
  let n = 0;
  for (let d = dayNumber(start), end = dayNumber(day); d <= end; d++) { const w = new Date(d * 86400000).getUTCDay(); if (w !== 0 && w !== 6) n++; }
  return n;
}

/** The theme for a day ("YYYY-MM-DD"), or null. schoolStart: the first day of the school year that holds this day. */
export function themeFor(day: string, settings: ThemeSettings, schoolStart = ''): ThemeDay | null {
  if (!settings.enabled || !DAY.test(day)) return null;
  const w = weekday(day);
  if (settings.special) {
    if (schoolStart && w !== 0 && w !== 6 && schoolDayNumber(day, schoolStart) === 100) return themeById('hundredDay')!;
    const fixed = SPECIAL_DAYS.find(t => t.date === day.slice(5));
    if (fixed) return fixed;
  }
  if (w === 0 || w === 6 || (settings.when === 'fri' && w !== 5)) return null;
  const list = THEME_DAYS.filter(t => settings.themes[t.id]);
  if (!list.length) return null;
  const d = dayNumber(day) + 3, week = Math.floor(d / 7);   // weeks start on Monday (day 0, Jan 1 1970, was a Thursday)
  const n = settings.when === 'fri' ? week : week * 5 + (d % 7);   // the next theme each school day, or each Friday
  return list[n % list.length];
}
