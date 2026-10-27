/* Science simulations for Biology Units 1 and 2 (Build-a-Cell is Unit 1; the rest are the Petting Zoo, Unit 2). Plain models with no DOM, so they can be tested in Node;
   game.js draws them (renderSim) and saves progress in S.sims. Docs: docs/SCIENCE-UNIT2.md
   Each sim ends with two "what did you find?" questions; answering both right finishes it (coins the first time). */

export const SIMS = [
  {id:'cloneIsland', course:'bio2', group:'traits', emoji:'🏝️', name:'Clone Island vs. Mix Island',
    intro:'Two islands, two ways to make baby plants. Clone Island grows copies of one prize plant: fast, and every plant is the same. Mix Island grows plants from seeds made by two parents: slower, and every plant is a little different. You control the weather. Which island is still green after 8 seasons?'},
  {id:'parenting', course:'bio2', group:'traits', emoji:'🐣', name:'Parenting Strategy Lab',
    intro:'Every parent has the same amount of energy to spend. Spend it on lots of babies with no care, or on a few babies with lots of care? Find the best family size for three very different homes.'},
  {id:'lakeLab', course:'bio2', group:'growth', emoji:'🦆', name:'Duck Pond Lake Lab',
    intro:'The Petting Zoo’s duck pond sits below a farm. Change how much fertilizer washes in, how hot the summer is, and whether there is a grass strip to catch the runoff. Then run the summer and watch the algae, the oxygen, and the fish.'},
  {id:'buildCell', course:'bio1', group:'cells', emoji:'🧫', name:'Build-a-Cell',
    intro:'Build an animal cell, then a plant cell. Each part has a job: read the job, then pick the part that does it. Watch out: some parts belong only in plant cells.'},
  {id:'punnett', course:'bio2', group:'traits', emoji:'🐶', name:'Punnett Square Puppy Lab',
    intro:'Brown fur (B) wins over white fur (b). Each parent passes one fur gene to each puppy. Pick two parents, fill in the Punnett square, then raise a litter and see if your square was right.'},
  {id:'foodWeb', course:'bio2', group:'growth', emoji:'🕸️', name:'Meadow Food Web',
    intro:'Every living thing in the meadow gets its energy from something else. First draw the web: pick what each animal eats. Then take one living thing away and see what happens to everyone else.'}
];
export const simById = id => SIMS.find(s => s.id === id);

/* ---------- 🏝️ Clone Island vs. Mix Island ----------
   A plant is three yes/no resistances: heat, cold, fungus. Clone Island starts with 12 copies of one prize plant that
   handles heat but not cold or fungus. Mix Island starts with 12 plants with random resistances. A disaster kills every
   plant without that resistance. Then each island grows: clones double (no partner needed); Mix Island grows by half,
   and each new plant gets each resistance from one of two random parents (and a small chance of a new one). */
export const TRAITS = [['heat','🔥','heat'],['cold','❄️','cold'],['fungus','🍄','fungus']];
export const WEATHER = [
  {id:'good', emoji:'☀️', name:'Good year', kills:null, text:'Sun and rain at the right times. Nothing dies.'},
  {id:'heat', emoji:'🔥', name:'Heat wave', kills:'heat', text:'Plants that can’t take the heat dry up.'},
  {id:'cold', emoji:'❄️', name:'Cold snap', kills:'cold', text:'A surprise frost. Plants that can’t take cold die.'},
  {id:'fungus', emoji:'🍄', name:'Fungus outbreak', kills:'fungus', text:'A soil fungus spreads. Plants that can’t fight it rot.'}
];
export const ISLAND_CAP = 40, ISLAND_SEASONS = 8;
const PRIZE = {heat:1, cold:0, fungus:0};
export function newIslands(rand = Math.random){
  const mix = Array.from({length:12}, () => ({heat:+(rand() < 0.5), cold:+(rand() < 0.5), fungus:+(rand() < 0.5)}));
  // make sure Mix Island has at least two plants of each resistance, like a real seed-grown field would
  TRAITS.forEach(([t], i) => { if (mix.filter(p => p[t]).length < 2) { mix[i * 2][t] = 1; mix[i * 2 + 1][t] = 1; } });
  return {season:0, clone:Array.from({length:12}, () => ({...PRIZE})), mix, log:[]};
}
export function runSeason(state, weatherId, rand = Math.random){
  const w = WEATHER.find(x => x.id === weatherId) || WEATHER[0];
  const before = {clone:state.clone.length, mix:state.mix.length};
  const survive = list => w.kills ? list.filter(p => p[w.kills]) : list;
  let clone = survive(state.clone), mix = survive(state.mix);
  const lost = {clone:before.clone - clone.length, mix:before.mix - mix.length};
  clone = clone.concat(clone.map(p => ({...p}))).slice(0, ISLAND_CAP);
  if (mix.length >= 2) {
    const babies = Math.ceil(mix.length / 2), kids = [];
    for (let i = 0; i < babies; i++) {
      const a = mix[Math.floor(rand() * mix.length)], b = mix[Math.floor(rand() * mix.length)], kid = {};
      TRAITS.forEach(([t]) => { kid[t] = rand() < 0.5 ? a[t] : b[t]; if (rand() < 0.04) kid[t] = 1 - kid[t]; });
      kids.push(kid);
    }
    mix = mix.concat(kids).slice(0, ISLAND_CAP);
  }
  const entry = {season:state.season + 1, weather:w.id, lost, clone:clone.length, mix:mix.length};
  return {...state, season:state.season + 1, clone, mix, log:[...state.log, entry]};
}
export const islandsDone = st => st.season >= ISLAND_SEASONS || (!st.clone.length && !st.mix.length);

/* ---------- 🐣 Parenting Strategy Lab ----------
   A parent has 100 energy. It picks a family size n, so each baby gets 100 / n care. A baby needs `need` care to be
   fully looked after; with less, its chance of making it falls fast (care share squared). Predators then eat up to
   `eaten` babies (a beach full of crabs can only eat so many: lots of babies swamps them), and each baby left has a
   `luck` chance to grow up. The numbers are made up so the best family size matches the real animal in each home. */
export const ENERGY = 100;
export const HOMES = [
  {id:'beach', emoji:'🐢', name:'Sandy beach', like:'sea turtles', need:1, eaten:40, luck:0.12, real:'A sea turtle lays around 100 eggs in a nest and swims away. Crabs, birds, and fish eat most hatchlings, but they can’t eat them all.'},
  {id:'forest', emoji:'🐦', name:'Forest nest', like:'robins', need:20, eaten:1, luck:0.6, real:'A robin lays 3 to 5 eggs. Both parents bring food to the nest all day, so they can only feed a few chicks well.'},
  {id:'ice', emoji:'🐧', name:'Antarctic ice', like:'emperor penguins', need:90, eaten:0, luck:0.8, real:'An emperor penguin lays 1 egg. Dad holds it on his feet through the winter for about two months, eating nothing. A second egg would freeze.'}
];
export const FAMILY_SIZES = [1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 50, 75, 100, 120];
export const careShare = (home, n) => Math.min(1, ENERGY / n / home.need);
export function expectedGrownUps(home, n){
  const f = careShare(home, n) ** 2;
  return Math.max(0, n * f - home.eaten) * home.luck;
}
export const bestFamily = home => FAMILY_SIZES.reduce((best, n) => expectedGrownUps(home, n) > expectedGrownUps(home, best) ? n : best, 1);
/* one season: each baby is 'weak' (not enough care), 'eaten', 'lost' (bad luck), or 'grown' */
export function raiseFamily(home, n, rand = Math.random){
  const f = careShare(home, n) ** 2, babies = Array.from({length:n}, () => rand() < f ? 'ok' : 'weak');
  let eat = home.eaten;
  return babies.map(b => { if (b === 'weak') return b; if (eat > 0) { eat--; return 'eaten'; } return rand() < home.luck ? 'grown' : 'lost'; });
}
export function averageGrownUps(home, n, seasons = 20, rand = Math.random){
  let total = 0; for (let i = 0; i < seasons; i++) total += raiseFamily(home, n, rand).filter(b => b === 'grown').length;
  return total / seasons;
}
/* a home is solved when the student's family size is within 80% of the best one's expected result */
export const homeSolved = (home, n) => expectedGrownUps(home, n) >= 0.8 * expectedGrownUps(home, bestFamily(home));

/* ---------- 🦆 Duck Pond Lake Lab ----------
   12 summer weeks. Fertilizer (0-3) adds nutrients each week (a grass strip catches 80% of it). Algae grow faster with
   more nutrients and more heat, up to a crowded limit. Big blooms block their own light, so part of the algae die
   each week; decomposers breaking down dead algae use oxygen. Warm water holds less oxygen. Fish lose numbers when
   oxygen drops below 4 mg/L, and many die below 2. */
export const LAKE_WEEKS = 12;
export const FERTILIZER = ['None', 'A little', 'Some', 'Lots'];
export const HEAT = [['cool', '🌤️ Cool summer', 0.75, 10.5], ['normal', '☀️ Normal summer', 1, 9], ['hot', '🥵 Heat wave', 1.3, 7.5]];
export function runLake({fert = 0, heat = 'normal', buffer = false} = {}){
  const [, , speed, maxO2] = HEAT.find(h => h[0] === heat) || HEAT[1];
  let nutrients = 2, algae = 5, oxygen = maxO2, fish = 100;
  const weeks = [{week:0, algae, oxygen, fish, nutrients}];
  for (let w = 1; w <= LAKE_WEEKS; w++) {
    nutrients += fert * 3 * (buffer ? 0.2 : 1);
    const grow = (0.08 + 0.9 * nutrients / (nutrients + 12)) * speed;
    const born = algae * grow * (1 - algae / 100);
    const dying = algae > 45 ? algae * 0.12 * (algae / 100) * speed * 2.2 : algae * 0.05;
    nutrients = Math.max(0, nutrients - born * 0.25);
    algae = Math.max(1, Math.min(100, algae + born - dying));
    oxygen = Math.max(0.3, Math.min(maxO2, oxygen + 0.5 * (maxO2 - oxygen) + 0.02 * algae - 0.6 * dying));
    if (oxygen < 2) fish *= 0.45; else if (oxygen < 4) fish *= 0.85;
    weeks.push({week:w, algae:+algae.toFixed(1), oxygen:+oxygen.toFixed(2), fish:Math.round(fish), nutrients:+nutrients.toFixed(1)});
  }
  return weeks;
}
export const lakeSummary = weeks => ({peakAlgae:Math.max(...weeks.map(w => w.algae)), lowOxygen:Math.min(...weeks.map(w => w.oxygen)), fishLeft:weeks[weeks.length - 1].fish});
/* missions: 1 turn the pond green (a bloom of 70+); 2 with Lots of fertilizer, keep 70+ fish all summer */
export const LAKE_MISSIONS = [
  {id:'bloom', text:'Cause an algae bloom: make the algae reach 70 or more.', check:(s) => s.peakAlgae >= 70},
  {id:'save', text:'The farm still uses Lots of fertilizer. Find a way to keep at least 70 fish all summer.', check:(s, setup) => setup.fert === 3 && s.fishLeft >= 70}
];

/* the two questions at the end of each sim: [prompt, right answer, wrong, wrong] */
export const SIM_QUESTIONS = {
  cloneIsland:[
    ['Why could one disaster wipe out all of Clone Island?', 'Every plant had the same genes, so the same weakness', 'Clone Island had more plants to lose', 'Clones can’t grow in good years'],
    ['In good years, why did Clone Island grow faster?', 'One parent can copy itself without a partner', 'Clones get more sunlight than other plants', 'Mix Island plants are always sick']
  ],
  parenting:[
    ['Why do sea turtles lay so many eggs but emperor penguins lay just one?', 'Penguin chicks need so much care that a parent can raise only one', 'Penguins are too big to lay more eggs', 'Sea turtle eggs are safer than penguin eggs'],
    ['What did every best strategy have in common?', 'It fit the dangers of that home', 'It made the most babies', 'It gave each baby the most care']
  ],
  buildCell:[
    ['Which parts did the plant cell have that the animal cell didn’t?', 'A cell wall, chloroplasts and a big vacuole', 'A nucleus and a membrane', 'Mitochondria and cytoplasm'],
    ['Plants make their own sugar. Why do plant cells still need mitochondria?', 'To turn that sugar into energy the cell can use', 'To make sugar from sunlight', 'To hold the cell’s DNA']
  ],
  punnett:[
    ['Two brown dogs had a white puppy. How?', 'Each parent carried a hidden white gene (b) and passed it on', 'The puppy didn’t get any genes from its parents', 'Brown fur fades to white in some puppies'],
    ['Two Bb parents: about how many puppies out of 4 will be white?', '1 out of 4', '2 out of 4', '0 out of 4']
  ],
  foodWeb:[
    ['Hawks don’t eat grass. Why did hawks go down when the grass was gone?', 'Their food ate the grass, so their energy started with it', 'Hawks build nests out of grass', 'Hawks got lost without the grass'],
    ['In a food web, what do the arrows show?', 'Where the energy goes, from food to eater', 'Which animal is the biggest', 'Which animals are friends']
  ],
  lakeLab:[
    ['Algae don’t eat fish. Why did the fish die in a bloom?', 'Dead algae rotted and decomposers used up the oxygen', 'The algae wrapped around the fish', 'The fish ate too much algae'],
    ['Which change protected the pond best when the farm used Lots of fertilizer?', 'A grass strip that catches the runoff', 'A hotter summer', 'Adding more fish to the pond']
  ]
};

/* ---------- 🧫 Build-a-Cell (Biology Unit 1, cells) ----------
   Two cells to build. For each job, she picks the part that does it from all 7 parts; a right pick puts the part in the
   cell. A plant-only part picked for the animal cell gets its own explanation. */
export const CELL_PARTS = [
  {id:'membrane', emoji:'🫧', name:'Cell membrane', job:'I’m the thin skin around the cell. I let food and water in and waste out.'},
  {id:'nucleus', emoji:'🟣', name:'Nucleus', job:'I hold the DNA, the cell’s instructions. I’m the control center.'},
  {id:'cytoplasm', emoji:'💧', name:'Cytoplasm', job:'I’m the jelly that fills the cell. The other parts float in me.'},
  {id:'mito', emoji:'⚡', name:'Mitochondria', job:'I turn sugar from food into energy the cell can use.'},
  {id:'wall', emoji:'🧱', name:'Cell wall', job:'I’m a stiff box outside the membrane that holds a plant up.'},
  {id:'chloro', emoji:'🍃', name:'Chloroplasts', job:'I use sunlight to make sugar (food) for the plant.'},
  {id:'vacuole', emoji:'🫙', name:'Large vacuole', job:'I’m a big water tank that keeps a plant cell firm, so the plant doesn’t wilt.'}
];
export const CELLS = [
  {id:'animal', emoji:'🐾', name:'Animal cell', parts:['membrane', 'nucleus', 'cytoplasm', 'mito']},
  {id:'plant', emoji:'🌱', name:'Plant cell', parts:['wall', 'membrane', 'nucleus', 'cytoplasm', 'mito', 'chloro', 'vacuole']}
];
export const PLANT_ONLY = {wall:'Animal cells have no cell wall. That’s why animals can bend and stretch.',
  chloro:'Animal cells have no chloroplasts. Animals get their sugar by eating food.',
  vacuole:'Animal cells have only tiny vacuoles, not one big water tank.'};
export const cellPart = id => CELL_PARTS.find(p => p.id === id);
/* answer one job: {ok, why} */
export function cellPick(cellId, jobPart, pick){
  if (pick === jobPart) return {ok:true};
  const cell = CELLS.find(c => c.id === cellId);
  if (!cell.parts.includes(pick)) return {ok:false, why:PLANT_ONLY[pick] || 'That part doesn’t belong in this cell.'};
  return {ok:false, why:`${cellPart(pick).name} is in this cell, but that’s not its job. Read the job again.`};
}

/* ---------- 🐶 Punnett Square Puppy Lab (Biology Unit 2, traits) ----------
   One gene for fur: B (brown) is dominant, b (white) is recessive. Parents are BB, Bb or bb. */
export const GENOTYPES = ['BB', 'Bb', 'bb'];
export const furOf = g => g.includes('B') ? 'brown' : 'white';
export const furEmoji = g => g.includes('B') ? '🟫' : '⬜';
const sortG = (a, b) => a === b ? a + b : a === 'B' ? a + b : b + a;   // 'B' before 'b'
export function punnettGrid(mom, dad){ return [0, 1].map(i => [0, 1].map(j => sortG(mom[i], dad[j]))); }
export const whiteShare = (mom, dad) => punnettGrid(mom, dad).flat().filter(g => furOf(g) === 'white').length;   // out of 4
export function litter(mom, dad, n = 12, rand = Math.random){
  return Array.from({length:n}, () => sortG(mom[rand() < 0.5 ? 0 : 1], dad[rand() < 0.5 ? 0 : 1]));
}
export const PUNNETT_MISSIONS = [
  {id:'square', text:'Fill in a Punnett square with no mistakes.', check:() => true},
  {id:'surprise', text:'Two brown parents: find a pair that can have a white puppy.', check:(mom, dad) => furOf(mom) === 'brown' && furOf(dad) === 'brown' && whiteShare(mom, dad) > 0},
  {id:'hidden', text:'One parent is white, but every puppy is brown. Find that pair.', check:(mom, dad) => (furOf(mom) === 'white') !== (furOf(dad) === 'white') && whiteShare(mom, dad) === 0}
];

/* ---------- 🕸️ Meadow Food Web (Biology Unit 2, growth in the environment) ----------
   Arrows go from food to eater. Taking one living thing away: its eaters lose that share of their food (down), what it
   ate loses a predator (up), and the change passes one more step along the web. */
export const WEB = [
  {id:'sun', emoji:'☀️', name:'Sun', eats:[], sun:true},
  {id:'grass', emoji:'🌾', name:'Grass', eats:['sun']},
  {id:'clover', emoji:'☘️', name:'Clover', eats:['sun']},
  {id:'rabbit', emoji:'🐇', name:'Rabbit', eats:['grass', 'clover']},
  {id:'grasshopper', emoji:'🦗', name:'Grasshopper', eats:['grass']},
  {id:'mouse', emoji:'🐁', name:'Mouse', eats:['grass', 'grasshopper']},
  {id:'frog', emoji:'🐸', name:'Frog', eats:['grasshopper']},
  {id:'snake', emoji:'🐍', name:'Snake', eats:['mouse', 'frog']},
  {id:'hawk', emoji:'🦅', name:'Hawk', eats:['rabbit', 'mouse', 'snake']}
];
export const webById = id => WEB.find(x => x.id === id);
export const WEB_ANIMALS = WEB.filter(x => x.eats.length && !x.eats.includes('sun')).map(x => x.id);
export const WEB_LIVING = WEB.filter(x => !x.sun).map(x => x.id);
export const sameSet = (a, b) => a.length === b.length && a.every(x => b.includes(x));
/* what happens to everyone when `gone` disappears: id -> change (negative = fewer, positive = more) */
export function removeEffect(gone){
  const ch = Object.fromEntries(WEB_LIVING.map(id => [id, 0]));
  ch[gone] = -1;
  for (let round = 0; round < 3; round++) {
    const next = {...ch};
    for (const x of WEB) {
      if (x.sun || x.id === gone) continue;
      const food = x.eats.filter(f => f !== 'sun'), eaters = WEB.filter(y => y.eats.includes(x.id));
      const fromFood = food.length ? food.reduce((t, f) => t + Math.min(0, ch[f]), 0) / food.length : 0;   // less food → fewer
      const fromEaters = eaters.length ? eaters.reduce((t, y) => t - Math.min(0, ch[y.id]), 0) / eaters.length : 0;   // fewer eaters → more
      next[x.id] = Math.max(-1, Math.min(1, fromFood * (round ? 0.8 : 1) + fromEaters * 0.6));
    }
    next[gone] = -1; Object.assign(ch, next);
  }
  return ch;
}
export const effectLabel = v => v <= -0.45 ? ['⬇️⬇️', 'a lot fewer'] : v <= -0.08 ? ['⬇️', 'fewer'] : v >= 0.3 ? ['⬆️⬆️', 'a lot more'] : v >= 0.08 ? ['⬆️', 'more'] : ['➖', 'about the same'];
export const hurtCount = gone => Object.entries(removeEffect(gone)).filter(([id, v]) => id !== gone && v <= -0.08).length;
export const mostHurt = () => WEB_LIVING.reduce((best, id) => hurtCount(id) > hurtCount(best) ? id : best, WEB_LIVING[0]);
export const WEB_MISSIONS = [
  {id:'draw', text:'Draw the web: pick the right food for every animal.'},
  {id:'boom', text:'Take something away so the grasshoppers grow in number.', check:gone => removeEffect(gone).grasshopper >= 0.08},
  {id:'keystone', text:'Find the one living thing whose loss makes the most others go down.', check:gone => hurtCount(gone) === hurtCount(mostHurt())}
];
export const SIM_MISSIONS = {lakeLab:LAKE_MISSIONS, punnett:PUNNETT_MISSIONS, foodWeb:WEB_MISSIONS,
  buildCell:CELLS.map(c => ({id:c.id, text:`Build the ${c.name.toLowerCase()}.`}))};
