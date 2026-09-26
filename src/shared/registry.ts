/**
 * Single source of truth for skills, stations and misconceptions.
 * The game and the teacher dashboard both import this file.
 * Khan Academy CC 6th grade, Unit 1: Ratios.
 */
const KB = 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic/';

export interface Skill { name: string; short: string; st: number; url: string; shop?: string }
export const SKILLS: Record<string, Skill> = {
  basic:      { name: 'Basic ratios', short: 'Basic', st: 1, url: KB + 'intro-to-ratios/e/representing-ratios' },
  tape:       { name: 'Ratios with tape diagrams', short: 'Tape diagrams', st: 2, url: KB + 'visualize-ratios/e/ratios-with-tape-diagrams' },
  groups:     { name: 'Equivalent ratios with equal groups', short: 'Equal groups', st: 2, url: KB + 'visualize-ratios/e/equivalent-ratio-word-problems--basic-' },
  dnlCreate:  { name: 'Create double number lines', short: 'Create DNL', st: 2, url: KB + 'visualize-ratios/e/create-double-number-lines' },
  dnl:        { name: 'Ratios with double number lines', short: 'Double number lines', st: 2, url: KB + 'visualize-ratios/e/ratios-with-double-number-lines' },
  dnlTable:   { name: 'Relate double number lines and ratio tables', short: 'DNL to table', st: 2, url: KB + 'visualize-ratios/e/relate-double-numbers-lines-and-ratio-tables' },
  table:      { name: 'Ratio tables', short: 'Ratio tables', st: 3, url: KB + 'cc-6th-equivalent-ratios/e/solving-ratio-problems-with-tables' },
  equiv:      { name: 'Equivalent ratios', short: 'Equivalent', st: 3, url: KB + 'cc-6th-equivalent-ratios/e/equivalent-ratios' },
  word:       { name: 'Equivalent ratio word problems', short: 'Word problems', st: 3, url: KB + 'cc-6th-equivalent-ratios/e/ratio_word_problems' },
  realworld:  { name: 'Equivalent ratios in the real world', short: 'Real world', st: 3, url: KB + 'cc-6th-equivalent-ratios/e/equivalent-ratios-in-the-real-world' },
  understand: { name: 'Understand equivalent ratios in the real world', short: 'Understand', st: 3, url: KB + 'cc-6th-equivalent-ratios/e/understand-equivalent-ratios' },
  coord:      { name: 'Ratios on coordinate plane', short: 'Coordinate plane', st: 4, url: KB + 'cc-6th-ratio-word-problems/e/ratios-on-coordinate-plane' },
  units:      { name: 'Ratios and units of measurement', short: 'Units', st: 4, url: KB + 'cc-6th-ratio-word-problems/e/ratios-and-units-of-measurement' },
  ppw:        { name: 'Part-part-whole ratios', short: 'Part-part-whole', st: 4, url: KB + 'cc-6th-ratio-word-problems/e/part-part-whole-ratios' }
};
export const SKILL_ORDER = Object.keys(SKILLS);

export interface DrillType {
  name: string;                          // for teachers: "Times tables"
  unit: string;                          // building id, or 'all'
  sprintUnlock?: { unit: string; station: number };
  teacherLabel: (key: string) => string; // "7s times table"
  kidTitle: (key: string) => string;     // "Let's practice the 7s!"
}
export const DRILLS: Record<string, DrillType> = {
  times:        { name: 'Times tables', unit: 'all',    teacherLabel: k => `${k}s times table`,       kidTitle: k => `Let's practice the ${k}s!` },
  placeValue:   { name: 'Place value',  unit: 'bakery', teacherLabel: k => `Place value (${k})`,      kidTitle: () => "Let's line up the places!" },
  decimalShift: { name: 'Moving the decimal', unit: 'bakery', teacherLabel: k => `Multiplying by ${k}`, kidTitle: k => `Let's slide the decimal (× ${k})!` },
  reciprocal:   { name: 'Reciprocals',  unit: 'bakery', teacherLabel: () => 'Flipping fractions',     kidTitle: () => "Let's flip some fractions!" },
  simplify:     { name: 'Simplifying',  unit: 'bakery', teacherLabel: k => `Simplifying by ${k}`,     kidTitle: k => `Let's simplify by ${k}!` }
};
/** "times:7" → "7s times table" */
export function drillLabel(id: string): string {
  const i = id.indexOf(':'), type = i < 0 ? 'times' : id.slice(0, i), key = i < 0 ? id : id.slice(i + 1);
  const d = DRILLS[type];
  return d ? d.teacherLabel(key) : id;
}

export interface DrillSettings {
  enabled: boolean;
  types: Record<string, boolean>;
  triggers: { miss: boolean; slow: boolean; sprint: boolean };
  slow: { mode: 'fixed' | 'adaptive'; idea: number; arith: number; sprint: number };
  readSeconds: number;
  timeScale: number;
  maxPerShift: number;
  resetAt?: string;
}
export const DEFAULT_DRILL_SETTINGS: DrillSettings = {
  enabled: true,
  types: {},
  triggers: { miss: true, slow: true, sprint: true },
  slow: { mode: 'adaptive', idea: 15, arith: 10, sprint: 6 },
  readSeconds: 5,
  timeScale: 1,
  maxPerShift: 3
};
const clampNum = (v: unknown, lo: number, hi: number, dflt: number) => {
  const n = typeof v === 'number' && isFinite(v) ? v : dflt;
  return Math.min(hi, Math.max(lo, n));
};
/** Built-in defaults, then class settings, then student override. Values are range-checked. */
export function mergeDrillSettings(...layers: (Partial<DrillSettings> | null | undefined)[]): DrillSettings {
  const out: DrillSettings = JSON.parse(JSON.stringify(DEFAULT_DRILL_SETTINGS));
  for (const l of layers) {
    if (!l || typeof l !== 'object') continue;
    if (typeof l.enabled === 'boolean') out.enabled = l.enabled;
    if (l.types && typeof l.types === 'object') Object.assign(out.types, l.types);
    if (l.triggers && typeof l.triggers === 'object') Object.assign(out.triggers, l.triggers);
    if (l.slow && typeof l.slow === 'object') Object.assign(out.slow, l.slow);
    if (l.readSeconds !== undefined) out.readSeconds = l.readSeconds as number;
    if (l.timeScale !== undefined) out.timeScale = l.timeScale as number;
    if (l.maxPerShift !== undefined) out.maxPerShift = l.maxPerShift as number;
    if (typeof l.resetAt === 'string') out.resetAt = l.resetAt;
  }
  out.slow.mode = out.slow.mode === 'fixed' ? 'fixed' : 'adaptive';
  out.slow.idea = clampNum(out.slow.idea, 5, 60, 15);
  out.slow.arith = clampNum(out.slow.arith, 5, 60, 10);
  out.slow.sprint = clampNum(out.slow.sprint, 3, 20, 6);
  out.readSeconds = clampNum(out.readSeconds, 0, 20, 5);
  out.timeScale = clampNum(out.timeScale, 1, 3, 1);
  out.maxPerShift = Math.round(clampNum(out.maxPerShift, 1, 5, 3));
  return out;
}
/** A drill type is on unless explicitly set to false. */
export const drillTypeOn = (s: DrillSettings, type: string) => s.enabled && s.types[type] !== false;

export interface QuizSettings {
  passPct: number;
  quizPerSkill: number;
  quizMin: number;
  quizMax: number;
  testPerSkill: number;
  testMin: number;
  testMax: number;
  reviewPerfect: number;
  requireQuiz: boolean;
  showSteps: boolean;
}
export const QUIZ_DEFAULTS: QuizSettings = {
  passPct: 80,
  quizPerSkill: 2,
  quizMin: 6,
  quizMax: 10,
  testPerSkill: 1,
  testMin: 8,
  testMax: 16,
  reviewPerfect: 2,
  requireQuiz: true,
  showSteps: false
};
const clampInt = (value: unknown, min: number, max: number, fallback: number) => {
  const number = Math.round(typeof value === 'number' && isFinite(value) ? value : fallback);
  return Math.min(max, Math.max(min, number));
};
export function quizSettings(raw: Partial<QuizSettings> | null | undefined): QuizSettings {
  const r = raw && typeof raw === 'object' ? raw : {}, d = QUIZ_DEFAULTS;
  const settings: QuizSettings = {
    passPct: clampInt(r.passPct, 50, 100, d.passPct),
    quizPerSkill: clampInt(r.quizPerSkill, 1, 4, d.quizPerSkill),
    quizMin: clampInt(r.quizMin, 3, 20, d.quizMin), quizMax: clampInt(r.quizMax, 3, 20, d.quizMax),
    testPerSkill: clampInt(r.testPerSkill, 1, 3, d.testPerSkill),
    testMin: clampInt(r.testMin, 4, 30, d.testMin), testMax: clampInt(r.testMax, 4, 30, d.testMax),
    reviewPerfect: clampInt(r.reviewPerfect, 1, 5, d.reviewPerfect),
    requireQuiz: typeof r.requireQuiz === 'boolean' ? r.requireQuiz : d.requireQuiz,
    showSteps: typeof r.showSteps === 'boolean' ? r.showSteps : d.showSteps
  };
  if (settings.quizMax < settings.quizMin) settings.quizMax = settings.quizMin;
  if (settings.testMax < settings.testMin) settings.testMax = settings.testMin;
  return settings;
}

export interface Station { id: number; name: string; emoji: string; kid: string; skills: string[] }
export const STATIONS: Station[] = [
  { id: 1, name: 'The Counter',  emoji: '🧺', kid: 'Write ratios from a tray of treats', skills: ['basic'] },
  { id: 2, name: 'Recipe Cards', emoji: '📇', kid: 'Tape diagrams, equal groups, double number lines', skills: ['tape', 'groups', 'dnlCreate', 'dnl', 'dnlTable'] },
  { id: 3, name: 'The Kitchen',  emoji: '🍳', kid: 'Ratio tables, equivalent ratios, word problems', skills: ['table', 'equiv', 'word', 'realworld', 'understand'] },
  { id: 4, name: 'Deliveries',   emoji: '🛵', kid: 'Coordinate plane, units, part-part-whole', skills: ['coord', 'units', 'ppw'] }
];
export interface Shop { id: string; name: string; emoji: string; unitLabel: string; stations: Station[] }
export const BAKERY_STATIONS: Station[] = [
  { id: 1, name: 'The Scale',     emoji: '⚖️', kid: 'Add and subtract decimals', skills: [] },
  { id: 2, name: 'Sharing Pans',  emoji: '🥧', kid: 'Divide fractions and whole numbers', skills: [] },
  { id: 3, name: 'Boxing Treats', emoji: '📦', kid: 'Divide fractions by fractions', skills: [] },
  { id: 4, name: 'The Register',  emoji: '🧾', kid: 'Multiply decimals, long division', skills: [] },
  { id: 5, name: 'Bulk Orders',   emoji: '🚚', kid: 'Divide decimals', skills: [] }
];
export const SHOPS: Record<string, Shop> = {
  cafe:   { id: 'cafe',   name: 'Pet Café', emoji: '☕', unitLabel: 'Khan Academy 6th grade, Unit 1: Ratios', stations: STATIONS },
  bakery: { id: 'bakery', name: 'Bakery',   emoji: '🥐', unitLabel: 'Khan Academy 6th grade, Unit 2: Arithmetic with rational numbers', stations: BAKERY_STATIONS }
};
export const shopOfSkill = (id: string) => SKILLS[id]?.shop || 'cafe';
export const UNLOCK_AT = 6;

export type UnlockRule =
  | { type: 'start' }
  | { type: 'unit' }
  | { type: 'station'; station: number }
  | { type: 'mastery'; skills: string[] }
  | { type: 'unitMastery' }
  | { type: 'sprint'; best: number }
  | { type: 'streak'; n: number };

export interface Reward {
  id: string; kind: 'pet' | 'decor'; emoji: string; name: string;
  unit: string;
  unlock: UnlockRule; price: number; legendary?: boolean;
}

/** Skills belonging to each unit. Add a unit's skills when that unit is built. */
export const UNIT_SKILLS: Record<string, string[]> = {
  cafe: ['basic','tape','groups','dnlCreate','dnl','dnlTable','table','equiv','word','realworld','understand','coord','units','ppw'],
  bakery: [], market: [], clock: [], rink: [], potion: [], houses: [], show: []
};

const cafeRewards: Reward[] = [
  { id:'cat',      kind:'pet',   emoji:'🐱', name:'Mochi the cat',       unit:'cafe', unlock:{type:'start'}, price:0 },
  { id:'bunny',    kind:'pet',   emoji:'🐰', name:'Clover the bunny',    unit:'cafe', unlock:{type:'start'}, price:40 },
  { id:'hamster',  kind:'pet',   emoji:'🐹', name:'Peanut the hamster',  unit:'cafe', unlock:{type:'start'}, price:60 },
  { id:'penguin',  kind:'pet',   emoji:'🐧', name:'Pebble the penguin',  unit:'cafe', unlock:{type:'station', station:2}, price:100 },
  { id:'fox',      kind:'pet',   emoji:'🦊', name:'Maple the fox',       unit:'cafe', unlock:{type:'station', station:3}, price:150 },
  { id:'panda',    kind:'pet',   emoji:'🐼', name:'Dumpling the panda',  unit:'cafe', unlock:{type:'station', station:4}, price:220 },
  { id:'unicorn',  kind:'pet',   emoji:'🦄', name:'Sparkle the unicorn', unit:'cafe', unlock:{type:'unitMastery'}, price:0, legendary:true },
  { id:'tulips',   kind:'decor', emoji:'🌷', name:'Tulip vase',          unit:'cafe', unlock:{type:'start'}, price:20 },
  { id:'plant',    kind:'decor', emoji:'🪴', name:'Leafy plant',         unit:'cafe', unlock:{type:'start'}, price:30 },
  { id:'teddy',    kind:'decor', emoji:'🧸', name:'Teddy bear',          unit:'cafe', unlock:{type:'start'}, price:45 },
  { id:'balloons', kind:'decor', emoji:'🎈', name:'Balloons',            unit:'cafe', unlock:{type:'start'}, price:50 },
  { id:'frame',    kind:'decor', emoji:'🖼️', name:'Fancy painting',      unit:'cafe', unlock:{type:'mastery', skills:['basic']}, price:0 },
  { id:'cake',     kind:'decor', emoji:'🎂', name:'Cake display',        unit:'cafe', unlock:{type:'mastery', skills:['table','equiv']}, price:90 },
  { id:'lights',   kind:'decor', emoji:'✨', name:'Twinkle lights',      unit:'cafe', unlock:{type:'streak', n:5}, price:110 },
  { id:'rainbow',  kind:'decor', emoji:'🌈', name:'Rainbow sign',         unit:'cafe', unlock:{type:'sprint', best:25}, price:160 },
  { id:'crown',    kind:'decor', emoji:'👑', name:'Golden crown',         unit:'cafe', unlock:{type:'unitMastery'}, price:0, legendary:true }
];

/** [building id, pets (welcome, s2, s3, s4, legend), decor (welcome, s2, s3, s4, legend)] as [emoji, name] pairs */
const UNIT_SETS: [string, [string,string][], [string,string][]][] = [
  ['bakery', [['🦔','Crumb the hedgehog'],['🐭','Nibbles the mouse'],['🐥','Sunny the chick'],['🐻','Honey the bear'],['🦝','Sprinkles the raccoon']],
             [['🍞','Bread basket'],['🥐','Croissant sign'],['🥧','Pie window'],['🥨','Pretzel garland'],['🏅',"Baker's gold medal"]]],
  ['market', [['🐐','Gus the goat'],['🦜','Kiwi the parrot'],['🐢','Slowpoke the turtle'],['🦙','Lulu the llama'],['🐓','Rocco the rooster']],
             [['🍉','Melon stand'],['🌽','Corn crate'],['🧺','Picnic basket'],['🏷️','Price tags'],['⚖️','Golden scale']]],
  ['clock',  [['🦉','Hoot the owl'],['🦇','Midnight the bat'],['🐿️','Acorn the chipmunk'],['🦅','Soar the eagle'],['🐉','Ember the dragon']],
             [['🕯️','Candles'],['🔔','Tower bell'],['⏳','Hourglass'],['🌙','Moon banner'],['🕰️','Golden clock']]],
  ['rink',   [['🦌','Frost the reindeer'],['🐺','Howl the wolf'],['🐋','Splash the whale'],['🦈','Finn the shark'],['🦢','Crystal the swan']],
             [['⛸️','Skates'],['🧣','Scarf rack'],['☃️','Snowman'],['🏒','Hockey sticks'],['🥇','Gold medal']]],
  ['potion', [['🐸','Fizz the frog'],['🐍','Noodle the snake'],['🦎','Zap the lizard'],['🐙','Inky the octopus'],['🦋','Glimmer the butterfly']],
             [['🧪','Flasks'],['🔮','Crystal ball'],['📜','Spell scroll'],['🕸️','Cobwebs'],['⚗️','Golden cauldron']]],
  ['houses', [['🐌','Shelly the snail'],['🐞','Dot the ladybug'],['🐝','Buzz the bee'],['🦡','Digger the badger'],['🦚','Jewel the peacock']],
             [['🌻','Sunflower patch'],['🧱','Brick pile'],['🏕️','Camp tent'],['🏠','Tiny house'],['🏰','Castle']]],
  ['show',   [['🐩','Fifi the poodle'],['🐈','Duchess the show cat'],['🦒','Tallulah the giraffe'],['🦓','Stripes the zebra'],['🦁','King the lion']],
             [['🎀','Ribbons'],['📊','Score board'],['🎪','Show tent'],['🎺','Trumpet'],['🏆','Grand trophy']]]
];
const SLOTS = ['welcome','s2','s3','s4','legend'] as const;
const slotRule = (i: number): UnlockRule => i === 0 ? {type:'unit'} : i === 4 ? {type:'unitMastery'} : {type:'station', station:i + 1};
const PRICE = { pet: [0,100,150,200,0], decor: [0,60,90,120,0] };

export const REWARDS: Reward[] = [
  ...cafeRewards,
  ...UNIT_SETS.flatMap(([unit, pets, decor]) => (
    [['pet', pets], ['decor', decor]] as const).flatMap(([kind, list]) =>
      list.map(([emoji, name], i): Reward => ({
        id: `${unit}_${kind}_${SLOTS[i]}`, kind, emoji, name, unit,
        unlock: slotRule(i), price: PRICE[kind][i], legendary: i === 4 || undefined
      }))))
];

export const BUILDINGS = [
  {id:'cafe',   emoji:'☕', name:'Pet Café',     unit:'Unit 1: Ratios', open:true},
  {id:'bakery', emoji:'🥐', name:'Bakery',       unit:'Unit 2: Arithmetic with rational numbers'},
  {id:'market', emoji:'🍎', name:'Market Stall', unit:'Unit 3: Rates and percentages'},
  {id:'clock',  emoji:'🕰️', name:'Clock Tower',  unit:'Unit 4: Exponents and order of operations'},
  {id:'rink',   emoji:'⛸️', name:'Ice Rink',     unit:'Unit 5: Negative numbers'},
  {id:'potion', emoji:'🧪', name:'Potion Lab',   unit:'Units 6 and 7: Expressions and equations'},
  {id:'houses', emoji:'🏡', name:'Pet Houses',   unit:'Units 8 to 10: Area, coordinate plane, 3D figures'},
  {id:'show',   emoji:'🏆', name:'Pet Show',     unit:'Unit 11: Data and statistics'}
];

export interface Misconception { name: string; kid: string; tip: string; skills: string[] }
export const MIS: Record<string, Misconception> = {
  reversed:         { name: 'Writes the ratio in the wrong order', kid: 'Check the order. The first thing named goes first.', tip: 'Say the ratio in words first ("blueberries to strawberries") and point to each item while writing it.', skills: ['basic'] },
  partwhole:        { name: 'Uses part-to-whole when part-to-part was asked', kid: 'They asked about one kind compared to the other kind, not all of them.', tip: 'Sort a set into "this kind," "that kind," and "all of them" before writing any ratio.', skills: ['basic', 'ppw'] },
  partpart:         { name: 'Uses part-to-part when part-to-whole was asked', kid: '"All the treats" means both kinds together.', tip: 'Same sorting routine. Stress that the whole includes both kinds.', skills: ['basic', 'ppw'] },
  additive:         { name: 'Adds instead of multiplies (additive thinking)', kid: 'Ratios grow by multiplying, not by adding.', tip: 'Taste-test 2:3 against 4:5: adding 2 to each changes the flavor. Model ratio tables with ×arrows on both sides.', skills: ['table', 'equiv'] },
  partsCount:       { name: 'Miscounts the total number of parts', kid: 'Count every box in both rows.', tip: 'Draw the tape diagram and count every box in both rows before dividing.', skills: ['tape', 'ppw'] },
  divideWrong:      { name: 'Divides the total by the wrong number', kid: 'Share the total across ALL the boxes.', tip: 'Ask "how many equal boxes share this total?" Divide by all the boxes, not one row.', skills: ['tape', 'ppw'] },
  oneBox:           { name: 'Stops at the value of one part', kid: "That's one box. How many boxes are there?", tip: 'After finding one box, ask "how many boxes does this row have?"', skills: ['tape', 'ppw'] },
  wrongPart:        { name: 'Answers for the wrong quantity', kid: 'Check which one they asked about.', tip: 'Circle the item being asked about before solving.', skills: ['tape', 'ppw'] },
  dnlSame:          { name: 'Counts both number lines by the same amount', kid: 'Each line jumps by its own amount.', tip: "Label each line's jump size in a different color.", skills: ['dnlCreate', 'dnl'] },
  mixedMultipliers: { name: 'Accepts different multipliers for the two amounts', kid: 'Both amounts have to use the same ×number.', tip: 'Check that both amounts use the same multiplier.', skills: ['realworld', 'equiv'] },
  missedEquivalent: { name: 'Misses a ratio that is equivalent', kid: 'Divide to find each multiplier. Are they the same?', tip: 'Divide each amount by the original to find each multiplier, then compare.', skills: ['realworld', 'equiv'] },
  oneSideOnly:      { name: 'Thinks changing one amount keeps the ratio', kid: 'If only one amount changes, the taste changes.', tip: 'Use a mix (lemonade, paint) and change only one ingredient.', skills: ['understand'] },
  notSimplest: { name: 'Stops before simplest form', kid: 'Can you divide both numbers again?', tip: 'Ask: is there any number besides 1 that divides both? Divide by the biggest one (the GCF), or keep dividing until nothing does.', skills: ['basic', 'equiv', 'table'] },
  coordSwap:        { name: 'Swaps x and y on the coordinate plane', kid: 'Go across first (x), then up (y).', tip: 'Say "across, then up" and check the axis labels before plotting.', skills: ['coord'] },
  unitsDirection:   { name: 'Multiplies when they should divide (or the reverse) converting units', kid: 'Should the number get bigger or smaller?', tip: 'Going to a smaller unit means more of them, so multiply.', skills: ['units'] },
  factSlip:         { name: 'Times-table slip (off by one group)', kid: 'So close! Check that times fact.', tip: 'The method is right. Drill the specific facts (see the times-table section).', skills: [] }
};

/** Mastery rule shared by game and dashboard: 4+ tries and 75% of the last 8 perfect. */
export type Status = 'new' | 'struggling' | 'practicing' | 'mastered';
export function statusFromRecent(r: string | undefined | null): Status {
  if (!r) return 'new';
  const w = r.slice(-8), p = [...w].filter(c => c === '1').length / w.length;
  if (r.length >= 4 && p >= 0.75) return 'mastered';
  if (p >= 0.5) return 'practicing';
  return 'struggling';
}
