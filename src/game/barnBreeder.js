/* 🐄 Barn Breeder: the Farm Barn's game (Biology Unit 5; docs/BARN-BREEDER.md). No DOM here, so
   scripts/check-genetics.mjs can play thousands of seasons. The page is arcade/barn-breeder/index.html (a Vite page, so
   the unit and the Arcade share this one file).

   A fair season is 5 judges' goals, easiest first. Each goal gives her a barn of animals with DNA tags (genotypes).
   She picks a female and a male of the same kind, predicts the chance that one baby has the target trait, then breeds:
   each breeding gives one female and one male baby, who join the barn and can be bred next (F1, then F2). A goal is
   reached when a baby with the target trait is born, within its breeding limit. Predictions are checked with exact
   probability from the parents' genotypes; the babies are rolled at random, one allele from each parent per gene. */
import { TRAITS, sortG, phenotype, crossOutcome, fracText } from '../shared/genetics.js';

/* two-trait goals multiply: P(both) = P(trait 1) × P(trait 2), because the genes are on different chromosomes */
export const CHIPS_ONE = [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4]];
export const CHIPS_TWO = [[0, 16], [1, 16], [2, 16], [3, 16], [4, 16], [6, 16], [8, 16], [9, 16], [12, 16], [16, 16]];
export const chipText = ([n, d]) => (n === 0 ? '0' : n === d ? '1' : fracText(n, d));
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export const sameChance = ([a, b], [c, d]) => a * d === b * c;

const KIND = {
  cattle:{emoji:'🐄', female:'cow', male:'bull', baby:'calf', babyF:'heifer calf', babyM:'bull calf'},
  sheep:{emoji:'🐑', female:'ewe', male:'ram', baby:'lamb', babyF:'ewe lamb', babyM:'ram lamb'},
  chickens:{emoji:'🐔', female:'hen', male:'rooster', baby:'chick', babyF:'pullet chick', babyM:'cockerel chick'}
};
export const kindOf = species => KIND[species];
/** the words for an animal's look: "no horns, black coat" */
export function looks(animal){
  return Object.entries(animal.g).map(([trait, g]) => {
    const t = TRAITS[trait], p = phenotype(trait, g);
    if (trait === 'polled') return p === 'polled' ? 'no horns' : 'horns';
    if (trait === 'angus') return `${p} coat`;
    if (trait === 'wool') return `${p} wool`;
    if (trait === 'comb') return `${p.replace('-comb', '')} comb`;
    if (trait === 'roan') return `${p} coat`;
    if (trait === 'andalusian') return `${p} feathers`;
    return t ? p : '';
  }).join(', ');
}
/* the goals: id, kind, the target (trait → wanted phenotype), how many breedings, and the starting barn */
const A = (name, sex, g) => ({name, sex, g});
export const GOALS = [
  {id:'polled', ask:'has no horns', tier:1, species:'cattle', title:'A calf with no horns', judge:'The dairy judge wants a calf with no horns, so it never needs dehorning.', want:{polled:'polled'}, limit:3,
    barn:[A('Daisy', 'f', {polled:'pp'}), A('Clover', 'f', {polled:'pp'}), A('Rocky', 'm', {polled:'pp'}), A('Duke', 'm', {polled:'Pp'})]},
  {id:'redAngus', ask:'has a red coat', tier:1, species:'cattle', title:'A red Angus calf', judge:'The beef judge has a ribbon for a red Angus calf. Your Angus herd is all black.', want:{angus:'red'}, limit:5,
    barn:[A('Midnight', 'f', {angus:'BB'}), A('Ebony', 'f', {angus:'Bb'}), A('Thunder', 'm', {angus:'BB'}), A('Coal', 'm', {angus:'Bb'})]},
  {id:'roan', ask:'is roan', tier:2, species:'cattle', title:'A roan Shorthorn calf', judge:'The Shorthorn judge wants a roan calf. Red and white are codominant: RW is roan.', want:{roan:'roan'}, limit:3,
    barn:[A('Ruby', 'f', {roan:'RR'}), A('Rosie', 'f', {roan:'RW'}), A('Red Baron', 'm', {roan:'RR'}), A('Snowy', 'm', {roan:'WW'})]},
  {id:'blue', ask:'is blue', tier:2, species:'chickens', title:'A blue Andalusian chick', judge:'The poultry judge wants a blue chick. Black and white blend (incomplete dominance): BW is blue.', want:{andalusian:'blue'}, limit:3,
    barn:[A('Inky', 'f', {andalusian:'BB'}), A('Pearl', 'f', {andalusian:'BB'}), A('Shadow', 'm', {andalusian:'BB'}), A('Frost', 'm', {andalusian:'WW'})]},
  {id:'blackLamb', ask:'has black wool', tier:3, species:'sheep', title:'A black lamb', judge:'The wool judge wants a black lamb for the natural-color class. You have one purebred white ram and one black ewe.', want:{wool:'black'}, limit:4,
    barn:[A('Snowball', 'm', {wool:'WW'}), A('Licorice', 'f', {wool:'ww'})]},
  {id:'singleComb', ask:'has a single comb', tier:3, species:'chickens', title:'A single-comb chick', judge:'The show wants a single-comb chick. Your rooster is a purebred rose comb, and your hen has a single comb.', want:{comb:'single-comb'}, limit:4,
    barn:[A('Rosco', 'm', {comb:'RR'}), A('Penny', 'f', {comb:'rr'})]},
  {id:'polledRed', ask:'has no horns and a red coat', tier:4, species:'cattle', title:'A polled red calf', judge:'Grand prize: a red Angus calf with no horns. Your bull is purebred polled and black (PP BB); your cow is horned and red (pp bb).', want:{polled:'polled', angus:'red'}, limit:5,
    barn:[A('Atlas', 'm', {polled:'PP', angus:'BB'}), A('Maple', 'f', {polled:'pp', angus:'bb'})]}
];
const TIERS = [1, 2, 3, 3, 4];
/** a season: one goal of each tier, the two tier-3 goals different, in order of difficulty */
export function newSeason(rnd = Math.random){
  const pick = list => list[Math.floor(rnd() * list.length)];
  const used = new Set();
  return TIERS.map(tier => { const g = pick(GOALS.filter(x => x.tier === tier && !used.has(x.id))); used.add(g.id); return g.id; });
}
export const goalById = id => GOALS.find(g => g.id === id);
/** a fresh barn for a goal: animals get ids */
export const startBarn = goal => goal.barn.map((a, i) => ({...a, id:`a${i}`, g:{...a.g}, gen:'P'}));
export const hasTarget = (goal, animal) => Object.entries(goal.want).every(([trait, p]) => phenotype(trait, animal.g[trait]) === p);
/** the exact chance (n out of 4 or 16) that one baby of these parents has the target */
export function targetChance(goal, mom, dad){
  const traits = Object.keys(goal.want);
  const parts = traits.map(trait => crossOutcome(trait, mom.g[trait], dad.g[trait])[goal.want[trait]] || 0);
  const n = parts.reduce((a, b) => a * b, 1), d = 4 ** traits.length;
  return traits.length === 1 ? [n, d] : [n, d];
}
/** one baby: one allele from each parent for every gene */
export function makeBaby(goal, mom, dad, sex, rnd = Math.random){
  const g = {};
  for (const trait of Object.keys(mom.g)) g[trait] = sortG(mom.g[trait][Math.floor(rnd() * 2)] + dad.g[trait][Math.floor(rnd() * 2)]);
  return {sex, g};
}
/** the Punnett boxes for the feedback: rows = mom's alleles, cols = dad's, and which boxes have the wanted phenotype */
export function squareFor(trait, mom, dad, want){
  const rows = [...mom.g[trait]], cols = [...dad.g[trait]];
  const boxes = rows.flatMap(r => cols.map(c => { const g = sortG(r + c); return {g, hit:phenotype(trait, g) === want}; }));
  return {rows, cols, boxes};
}
export const starsFor = (goals, right, tries) => (goals >= 5 && tries > 0 && right / tries >= 0.75 ? 3 : goals >= 4 ? 2 : goals >= 2 ? 1 : 0);
/** the best breeding a careful player would choose (used by the checker to show every goal can be reached) */
export function bestPair(goal, barn){
  let best = null;
  for (const m of barn.filter(a => a.sex === 'f')) for (const d of barn.filter(a => a.sex === 'm')) {
    const [n, dd] = targetChance(goal, m, d), v = n / dd;
    if (!best || v > best.v) best = {m, d, v};
  }
  return best;
}
export { gcd };
