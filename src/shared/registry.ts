/**
 * Single source of truth for skills, stations and misconceptions.
 * The game and the teacher dashboard both import this file.
 * Khan Academy CC 6th grade, Unit 1: Ratios.
 */
const KB = 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic/';

export interface Skill { name: string; short: string; st: number; url: string }
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

export interface Station { id: number; name: string; emoji: string; kid: string; skills: string[] }
export const STATIONS: Station[] = [
  { id: 1, name: 'The Counter',  emoji: '🧺', kid: 'Write ratios from a tray of treats', skills: ['basic'] },
  { id: 2, name: 'Recipe Cards', emoji: '📇', kid: 'Tape diagrams, equal groups, double number lines', skills: ['tape', 'groups', 'dnlCreate', 'dnl', 'dnlTable'] },
  { id: 3, name: 'The Kitchen',  emoji: '🍳', kid: 'Ratio tables, equivalent ratios, word problems', skills: ['table', 'equiv', 'word', 'realworld', 'understand'] },
  { id: 4, name: 'Deliveries',   emoji: '🛵', kid: 'Coordinate plane, units, part-part-whole', skills: ['coord', 'units', 'ppw'] }
];
export const UNLOCK_AT = 6;

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
