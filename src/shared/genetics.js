/* 🐄 Farm Barn genetics (Biology Unit 5: Inheritance and variation; docs/SCIENCE-UNIT5.md).
   Generated questions, so every practice, quiz and test try gets new crosses, pedigrees and genes. No DOM here: the
   figures are HTML/SVG strings. Used by src/game/game.js (mixed into the unit's lessons with the question banks) and by
   the Barn Breeder game (arcade/barn-breeder). Checked by scripts/check-genetics.mjs (an independent solver for every
   kind, about 3,000 problems per kind).

   Every question is written for the test view: all the givens are in the prompt or the figure, and nothing gives the
   answer away. Animals and traits are real farm genetics:
     polled (P, no horns) over horned in cattle · black (B) over red coat in Angus cattle · white (W) over black wool in
     sheep · rose comb (R) over single comb in chickens · roan Shorthorn cattle (codominance: R red, W white, RW roan) ·
     blue Andalusian chickens (incomplete dominance: B black, W splash white, BW blue). */

/* ---------- alleles and crosses ---------- */
const alleleOrder = (a, b) => {
  const la = a.toLowerCase(), lb = b.toLowerCase();
  if (la !== lb) return la < lb ? -1 : 1;
  if (a === b) return 0;
  return a === a.toUpperCase() ? -1 : 1;   // capital (dominant) first: Bb, not bB
};
/** a genotype written the usual way: capital first, letters in order ("bB" → "Bb", "WR" → "RW") */
export const sortG = g => [...String(g)].sort(alleleOrder).join('');
/** the four boxes of a Punnett square, rows = the mother's two alleles, columns = the father's */
export const punnettCells = (rows, cols) => rows.flatMap(r => cols.map(c => sortG(r + c)));

export const TRAITS = {
  polled:{kind:'dom', A:'P', a:'p', dom:'no horns', rec:'horns', rule:'In cattle, the polled allele (P, no horns) is dominant over the horned allele (p).', domW:'polled', recW:'horned', animal:'cattle', male:'bull', female:'cow', baby:'calf', babies:'calves', emoji:'🐄', place:'calf pens'},
  angus:{kind:'dom', A:'B', a:'b', dom:'a black coat', rec:'a red coat', domW:'black', recW:'red', animal:'Angus cattle', male:'bull', female:'cow', baby:'calf', babies:'calves', emoji:'🐂', place:'Angus pasture'},
  wool:{kind:'dom', A:'W', a:'w', dom:'white wool', rec:'black wool', domW:'white', recW:'black', animal:'sheep', male:'ram', female:'ewe', baby:'lamb', babies:'lambs', emoji:'🐑', place:'sheep fold'},
  comb:{kind:'dom', A:'R', a:'r', dom:'a rose comb', rec:'a single comb', domW:'rose-comb', recW:'single-comb', animal:'chickens', male:'rooster', female:'hen', baby:'chick', babies:'chicks', emoji:'🐓', place:'henhouse'},
  roan:{kind:'co', A:'R', a:'W', AA:'red', Aa:'roan', aa:'white', note:'In Shorthorn cattle, the red (R) and white (W) coat alleles are codominant: an RW calf is roan, with red hairs and white hairs mixed together.', animal:'Shorthorn cattle', male:'bull', female:'cow', baby:'calf', babies:'calves', emoji:'🐮', place:'Shorthorn stalls'},
  andalusian:{kind:'inc', A:'B', a:'W', AA:'black', Aa:'blue', aa:'splash white', note:'In Andalusian chickens, the black (B) and white (W) feather alleles show incomplete dominance: a BW chick has blue-gray feathers, a blend of the two.', animal:'Andalusian chickens', male:'rooster', female:'hen', baby:'chick', babies:'chicks', emoji:'🐔', place:'henhouse'}
};
export const DOM_TRAITS = ['polled', 'angus', 'wool', 'comb'];
export const MIX_TRAITS = ['roan', 'andalusian'];
/** "dom" (complete dominance), "co" (codominance) or "inc" (incomplete dominance) */
export function phenotype(traitId, g){
  const t = TRAITS[traitId], s = sortG(g);
  if (t.kind === 'dom') return s.includes(t.A) ? t.domW : t.recW;
  return s === t.A + t.A ? t.AA : s === t.a + t.a ? t.aa : t.Aa;
}
/** the genotypes a trait can have, dominant/red first */
export const genotypesOf = traitId => { const t = TRAITS[traitId]; return [sortG(t.A + t.A), sortG(t.A + t.a), sortG(t.a + t.a)]; };
/** the phenotypes in a fixed order (dominant first; for co/incomplete: AA, Aa, aa) */
export const phenotypesOf = traitId => { const t = TRAITS[traitId]; return t.kind === 'dom' ? [t.domW, t.recW] : [t.AA, t.Aa, t.aa]; };
/** chance (out of 4) of each offspring phenotype from two parents */
export function crossOutcome(traitId, mom, dad){
  const cells = punnettCells([...mom], [...dad]), out = {};
  phenotypesOf(traitId).forEach(p => { out[p] = 0; });
  cells.forEach(c => { out[phenotype(traitId, c)]++; });
  return out;
}

/* ---------- fractions and percents ---------- */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
export const fracText = (n, d) => { if (n === 0) return '0'; const g = gcd(n, d); return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`; };
const pctText = (n, d) => { const v = Math.round(n / d * 10000) / 100; return `${v}%`; };
/** every way a teacher would accept a probability n/d (fraction, an unsimplified fraction over the same denominator,
    percent, decimal); for thirds only the fraction and its rounded percents */
export function probAccept(n, d){
  const out = new Set([fracText(n, d)]);
  if (n !== 0 && n !== d) out.add(`${n}/${d}`);
  for (const k of [4, 8, 16]) if ((k * n) % d === 0) { const m = k * n / d; if (m !== 0 && m !== k) out.add(`${m}/${k}`); }
  if (n === 0) { out.add('0%'); out.add('0 percent'); }
  if (n === d) { out.add('1'); out.add('100%'); out.add('100 percent'); out.add('4/4'); }
  const exact = (n * 100) % d === 0 || (n * 10000) % d === 0;
  if (exact) { const p = pctText(n, d); out.add(p); out.add(p.replace('%', ' percent')); out.add(p.replace('%', '')); const dec = String(n / d); out.add(dec); if (dec.startsWith('0.')) out.add(dec.slice(1)); }
  else { const p = Math.round(n / d * 1000) / 10; out.add(`${p}%`); out.add(`${Math.round(n / d * 100)}%`); }
  return [...out];
}

/* ---------- small helpers ---------- */
const pick = (list, rnd) => list[Math.floor(rnd() * list.length)];
const shuffleR = (list, rnd) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ri = (lo, hi, rnd) => lo + Math.floor(rnd() * (hi - lo + 1));
/** "a" or "an" before a genotype read letter by letter ("an RW cow", "a Pp bull") */
const anW = w => (/^[aeiou]/i.test(w) ? 'an' : 'a');
const anG = g => (/^[AEFHILMNORSX]/i.test(g) ? 'an' : 'a');   // read letter by letter, so "an rr hen" too
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
/** multiple choice with the right answer first, shuffled; the right answer moves with it */
function mcQ(prompt, right, wrongs, rnd, extra = {}){
  const options = shuffleR([right, ...wrongs], rnd);
  return {prompt, options, answer:options.indexOf(right), ...extra};
}
const fillQ = (prompt, accept, extra = {}) => ({type:'fill', prompt, accept, ...extra});
const randomGenotype = (traitId, rnd) => pick(genotypesOf(traitId), rnd);
const describe = (traitId, g) => {   // "a Pp bull" style words, with the phenotype in words
  const t = TRAITS[traitId], p = phenotype(traitId, g);
  return t.kind === 'dom' ? (p === t.domW ? t.dom : t.rec) : `${p} ${traitId === 'andalusian' ? 'feathers' : 'coat'}`;
};
/* the vocabulary rule for the phenotype question: names the alleles and the kind of dominance, not the in-between look */
const PHENO_RULE = {roan:'In Shorthorn cattle, the red (R) and white (W) coat alleles are codominant, so both colors show.', andalusian:'In Andalusian chickens, the black (B) and white (W) feather alleles show incomplete dominance, so the two colors blend.'};
const ruleText = traitId => { const t = TRAITS[traitId]; return t.rule || (t.kind === 'dom' ? `In ${t.animal}, ${t.dom} (${t.A}) is dominant over ${t.rec} (${t.a}).` : t.note); };

/* ---------- figures ---------- */
const escH = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'}[c]));
/** a pedigree: squares are males, circles females, filled = shows the recessive trait. data-ped carries the same
    picture as data for the checker (scripts/check-genetics.mjs). */
export function pedigreeSVG(ped, traitId){
  const t = TRAITS[traitId], W = 340, rowY = [34, 110, 186], S = 26;
  const pos = {}; ped.rows.forEach((row, r) => row.forEach((id, i) => { pos[id] = {x:Math.round(W * (i + 1) / (row.length + 1)), y:rowY[r]}; }));
  let lines = '';
  ped.couples.forEach(([a, b]) => {
    const A = pos[a], B = pos[b], mx = (A.x + B.x) / 2;
    lines += `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" class="ped-line"/>`;
    const kids = ped.people.filter(p => (p.mom === a && p.dad === b) || (p.mom === b && p.dad === a)).map(p => pos[p.id]);
    if (!kids.length) return;
    const barY = A.y + 40, xs = kids.map(k => k.x);
    lines += `<line x1="${mx}" y1="${A.y}" x2="${mx}" y2="${barY}" class="ped-line"/><line x1="${Math.min(mx, ...xs)}" y1="${barY}" x2="${Math.max(mx, ...xs)}" y2="${barY}" class="ped-line"/>`;
    kids.forEach(k => { lines += `<line x1="${k.x}" y1="${barY}" x2="${k.x}" y2="${k.y - S / 2}" class="ped-line"/>`; });
  });
  const shapes = ped.people.map(p => {
    const {x, y} = pos[p.id], fill = p.aff ? 'ped-aff' : 'ped-un';
    const shape = p.sex === 'm' ? `<rect x="${x - S / 2}" y="${y - S / 2}" width="${S}" height="${S}" class="${fill}"/>` : `<circle cx="${x}" cy="${y}" r="${S / 2}" class="${fill}"/>`;
    return `${shape}<text x="${x}" y="${y + S / 2 + 15}" text-anchor="middle" class="ped-num">${p.id}</text>`;
  }).join('');
  const label = `Family tree of ${t.animal}. Squares are males (${t.male}s), circles are females (${t.female}s). Filled shapes have ${t.rec}; open shapes have ${t.dom}.`;
  const data = escH(JSON.stringify(ped.people.map(p => ({id:p.id, sex:p.sex, aff:p.aff ? 1 : 0, mom:p.mom || 0, dad:p.dad || 0}))));
  return `<figure class="gene-fig"><svg class="pedigree" viewBox="0 0 ${W} 226" role="img" aria-label="${escH(label)}" data-ped="${data}">${lines}${shapes}</svg>
    <figcaption><span class="ped-key"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="1" y="1" width="14" height="14" class="ped-un"/></svg> ${escH(t.male)} &nbsp;<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="7" class="ped-un"/></svg> ${escH(t.female)} &nbsp;<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="1" y="1" width="14" height="14" class="ped-aff"/></svg> filled = ${escH(t.rec)}</span></figcaption></figure>`;
}

/* ---------- pedigrees: built forward from real genotypes, then the question is checked by listing every way the
   family's genotypes could fit what the picture shows ---------- */
function makePedigree(traitId, rnd){
  const t = TRAITS[traitId], [AA, Aa, aa] = genotypesOf(traitId);
  const founder = () => { const r = rnd(); return r < 0.3 ? AA : r < 0.8 ? Aa : aa; };
  const child = (m, d) => sortG(m[ri(0, 1, rnd)] + d[ri(0, 1, rnd)]);
  const people = [], add = (sex, g, mom = 0, dad = 0) => { const p = {id:people.length + 1, sex, g, aff:g === aa, mom, dad}; people.push(p); return p; };
  const g1m = add('m', founder()), g1f = add('f', founder());
  const n2 = ri(2, 3, rnd), kids2 = [];
  for (let i = 0; i < n2; i++) kids2.push(add(rnd() < 0.5 ? 'm' : 'f', child(g1f.g, g1m.g), g1f.id, g1m.id));
  const mate = kids2[ri(0, kids2.length - 1, rnd)], spouse = add(mate.sex === 'm' ? 'f' : 'm', founder());
  const mom = mate.sex === 'f' ? mate : spouse, dad = mate.sex === 'm' ? mate : spouse;
  const n3 = ri(2, 3, rnd), kids3 = [];
  for (let i = 0; i < n3; i++) kids3.push(add(rnd() < 0.5 ? 'm' : 'f', child(mom.g, dad.g), mom.id, dad.id));
  // rows: generation I, then generation II, then generation III
  const row2 = [...kids2.filter(k => k !== mate).map(k => k.id), mate.id, spouse.id];   // the child who married is last in the row, with the spouse beside them, so no family line crosses over the spouse
  // keep ids reading left to right, top to bottom: renumber by position
  const order = [g1m.id, g1f.id, ...row2, ...kids3.map(k => k.id)], newId = {}; order.forEach((id, i) => { newId[id] = i + 1; });
  const renum = people.map(p => ({...p, id:newId[p.id], mom:p.mom ? newId[p.mom] : 0, dad:p.dad ? newId[p.dad] : 0})).sort((a, b) => a.id - b.id);
  return {traitId, people:renum, rows:[[1, 2], row2.map(id => newId[id]), kids3.map(k => newId[k.id])], couples:[[1, 2], [newId[mom.id], newId[dad.id]].sort((a, b) => a - b)]};
}
/** every genotype each person could have, given only the picture (filled = aa) and Mendel's rules */
export function pedigreePossible(traitId, people){
  const [AA, Aa, aa] = genotypesOf(traitId), opts = p => (p.aff ? [aa] : [AA, Aa]);
  const can = (m, d, c) => [...m].some(x => [...d].some(y => sortG(x + y) === c));
  const ids = people.map(p => p.id), byId = Object.fromEntries(people.map(p => [p.id, p]));
  const sets = Object.fromEntries(ids.map(id => [id, new Set()])), assign = {};
  const ok = p => !p.mom || !(p.mom in assign) || !(p.dad in assign) || !(p.id in assign) || can(assign[p.mom], assign[p.dad], assign[p.id]);
  (function go(i){
    if (i === ids.length) { ids.forEach(id => sets[id].add(assign[id])); return; }
    const p = byId[ids[i]];
    for (const g of opts(p)) { assign[p.id] = g; if (people.every(ok)) go(i + 1); delete assign[p.id]; }
  })(0);
  return sets;
}

/* ---------- mutations: real DNA codons ---------- */
const BASES = 'TCAG', AA_CODE = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
const AA_NAME = {F:'Phe', L:'Leu', S:'Ser', Y:'Tyr', '*':'Stop', C:'Cys', W:'Trp', P:'Pro', H:'His', Q:'Gln', R:'Arg', I:'Ile', M:'Met', T:'Thr', N:'Asn', K:'Lys', V:'Val', A:'Ala', D:'Asp', E:'Glu', G:'Gly'};
/** the standard genetic code: a three-letter DNA word → its amino acid ("Stop" for a stop codon) */
export const codonAA = codon => AA_NAME[AA_CODE[BASES.indexOf(codon[0]) * 16 + BASES.indexOf(codon[1]) * 4 + BASES.indexOf(codon[2])]];
export const ALL_CODONS = [...BASES].flatMap(a => [...BASES].flatMap(b => [...BASES].map(c => a + b + c)));
const triplets = s => (s.match(/.{3}/g) || []);
function mutationFigure(orig, mutated, codons, {splitNew = false} = {}){
  const key = [...new Set(codons)].sort().map(c => `<span class="codon-key"><b>${c}</b> = ${codonAA(c)}</span>`).join(' ');
  return `<figure class="gene-fig gene-dna"><div><b>Original gene:</b> <code>${triplets(orig).join(' ')}</code></div><div><b>Gene after the mutation:</b> <code>${splitNew ? triplets(mutated).join(' ') + (mutated.length % 3 ? ' ' + mutated.slice(mutated.length - mutated.length % 3) : '') : mutated}</code></div><div class="codon-keys"><b>Codon key</b> (read 3 letters at a time from the start): ${key}</div></figure>`;
}
function makeMutation(rnd, kindWanted){
  for (let tries = 0; tries < 200; tries++) {
    const k = ri(4, 5, rnd), body = Array.from({length:k}, () => { let c; do c = pick(ALL_CODONS, rnd); while (codonAA(c) === 'Stop' || c === 'ATG'); return c; });
    const orig = 'ATG' + body.join('') + pick(['TAA', 'TAG', 'TGA'], rnd), nAA = k + 1;   // Met + k amino acids, then stop
    const kind = kindWanted || pick(['sub', 'sub', 'ins', 'del'], rnd);
    const at = ri(3, 3 * nAA - 1, rnd);   // never touch the start codon or the stop codon's place
    let mutated;
    if (kind === 'sub') { let b; do b = pick([...'ACGT'], rnd); while (b === orig[at]); mutated = orig.slice(0, at) + b + orig.slice(at + 1); }
    else if (kind === 'ins') mutated = orig.slice(0, at) + pick([...'ACGT'], rnd) + orig.slice(at);
    else mutated = orig.slice(0, at) + orig.slice(at + 1);
    if (mutated === orig) continue;
    const before = triplets(orig).slice(0, nAA).map(codonAA), after = triplets(mutated).slice(0, nAA).map(codonAA);
    const stopAt = after.indexOf('Stop');
    let effect;
    if (kind !== 'sub') { if (stopAt >= 0) continue; effect = 'frameshift'; }
    else if (stopAt >= 0) effect = 'stop';
    else { const diff = before.filter((a, i) => a !== after[i]).length; effect = diff === 0 ? 'silent' : 'one'; }
    // a frameshift whose new reading happens to match must still change something (it always does here, but check)
    const changed = before.filter((a, i) => a !== after[i]).length;
    if (kind !== 'sub' && changed < 2) continue;   // a shift at the very end changes one amino acid: too close to "exactly one changes"
    return {orig, mutated, kind, at, before, after, effect, changed, nAA};
  }
  return null;
}

/* ---------- chromosomes: real counts in body cells ---------- */
export const CHROMOSOMES = [
  ['cattle', 'cow', 60], ['goats', 'goat', 60], ['sheep', 'sheep', 54], ['pigs', 'pig', 38], ['horses', 'horse', 64], ['donkeys', 'donkey', 62],
  ['chickens', 'chicken', 78], ['turkeys', 'turkey', 80], ['ducks', 'duck', 80], ['rabbits', 'rabbit', 44], ['cats', 'barn cat', 38], ['alpacas', 'alpaca', 74]
];

/* ---------- the generated kinds, per lesson ---------- */
const N_OFFSPRING = [8, 12, 16, 20, 24, 32, 40];
const KINDS = {
  /* Apply: Chromosomes */
  chromA:{
    gamete:[1, rnd => { const [, one, n] = pick(CHROMOSOMES, rnd), cell = pick(['egg cell', 'sperm cell'], rnd);
      return fillQ(`A visitor reads the barn sign: ${anW(one)} ${one}’s body cells each have ${n} chromosomes. How many chromosomes are in one of its ${cell}s?`, [String(n / 2)]); }],
    pairs:[1, rnd => { const [, one, n] = pick(CHROMOSOMES, rnd);
      return fillQ(`Each body cell of ${anW(one)} ${one} has ${n} chromosomes. How many pairs of chromosomes is that?`, [String(n / 2), `${n / 2} pairs`]); }],
    fromParent:[2, rnd => { const [, one, n] = pick(CHROMOSOMES, rnd), parent = pick(['mother', 'father'], rnd);
      return fillQ(`A newborn ${one} has ${n} chromosomes in each body cell. How many of those chromosomes came from its ${parent}?`, [String(n / 2)]); }],
    whichCell:[2, rnd => { const [, one, n] = pick(CHROMOSOMES, rnd), sex = rnd() < 0.5, count = sex ? n / 2 : n;
      const right = sex ? 'A sex cell (egg or sperm) with one chromosome from each pair' : 'A body cell with two chromosomes of each pair';
      const wrongs = sex ? ['A body cell with two chromosomes of each pair', 'A body cell that has lost half of its chromosomes and half its genes', 'A sex cell with two chromosomes from each pair'] : ['A sex cell (egg or sperm) with one chromosome from each pair', 'A sex cell with two chromosomes from each pair', 'A body cell with one chromosome from each pair'];
      return mcQ(`${cap(anW(one))} ${one}’s body cells have ${n} chromosomes. Under the barn microscope, ${anW(one)} ${one} cell has ${count} chromosomes. Which kind of cell is it most likely to be?`, right, wrongs, rnd); }],
    spermAllele:[3, rnd => { const id = pick(DOM_TRAITS, rnd), t = TRAITS[id], [AA, Aa, aa] = genotypesOf(id), g = pick([Aa, Aa, AA, aa], rnd), which = pick([t.A, t.a], rnd);
      const n = [...g].filter(c => c === which).length;   // each sperm gets one chromosome of the pair, so n of his 2 alleles
      return fillQ(`${ruleText(id)} ${cap(anG(g))} ${g} ${t.male}’s two alleles for this gene sit on one pair of chromosomes. What fraction of his sperm cells carry the ${which} allele?`, probAccept(n, 2)); }],
    mule:[3, rnd => { const horseMom = rnd() < 0.5;
      return fillQ(`Horses have 64 chromosomes in each body cell and donkeys have 62. A ${horseMom ? 'mule has a horse mother and a donkey father' : 'hinny has a donkey mother and a horse father'}. How many chromosomes are in each of its body cells?`, ['63']); }]
  },
  /* Apply: Mutations */
  mutA:{
    kind:[1, rnd => { const m = makeMutation(rnd, pick(['sub', 'ins', 'del'], rnd));
      const names = {sub:'One letter was swapped for a different letter', ins:'One extra letter was added to the gene', del:'One letter was removed from the gene'};
      const wrong = Object.keys(names).filter(k => k !== m.kind).map(k => names[k]).concat('Two neighboring letters traded places with each other');
      return mcQ('A barn scientist compares a gene in a calf’s cell before and after the cell copied its DNA with a mistake. What kind of mutation happened?', names[m.kind], wrong, rnd, {figure:mutationFigure(m.orig, m.mutated, [], {splitNew:false}).replace(/<div class="codon-keys">[\s\S]*?<\/div>/, '')}); }],
    effect:[2, rnd => { const m = makeMutation(rnd, pick(['sub', 'sub', 'sub', 'ins', 'del'], rnd));
      const names = {silent:'No amino acid changes, so the protein stays the same', one:'Exactly one amino acid changes; the rest stay the same', stop:'A stop codon shows up early and cuts the protein short', frameshift:'The reading frame shifts; later amino acids change too'};
      const codons = [...triplets(m.orig), ...triplets(m.mutated)];
      return mcQ('Read both genes three letters at a time. What does this mutation do to the protein?', names[m.effect], Object.keys(names).filter(k => k !== m.effect).map(k => names[k]), rnd, {figure:mutationFigure(m.orig, m.mutated, codons)}); }],
    count:[3, rnd => { const m = makeMutation(rnd, pick(['sub', 'ins', 'del', 'ins', 'del'], rnd));
      const codons = [...triplets(m.orig), ...triplets(m.mutated)];
      return fillQ(`The original gene makes a protein ${m.nAA} amino acids long (then a stop codon). Read the gene after the mutation from the start, three letters at a time. In the first ${m.nAA} amino acids, how many are different from the original protein?`, [String(m.changed)], {figure:mutationFigure(m.orig, m.mutated, codons)}); }]
  },
  /* Apply: Genetics vocabulary */
  vocabA:{
    pheno:[1, rnd => { const id = pick([...DOM_TRAITS, ...MIX_TRAITS], rnd), t = TRAITS[id], g = randomGenotype(id, rnd), right = phenotype(id, g);
      const words = p => (t.kind === 'dom' ? (p === t.domW ? t.dom : t.rec) : p), wrongs = phenotypesOf(id).filter(p => p !== right).map(words);
      wrongs.push({polled:'short horns that grow halfway', angus:'a roan coat, red and black mixed', wool:'gray wool, a blend of the two colors', comb:'half a rose comb and half a single comb', roan:'pink, a blend of red and white', andalusian:'gray and white stripes'}[id]);
      const shown = p => ({roan:'roan: red and white hairs', blue:'blue-gray'}[p] || p);   // the in-between looks in words, so the rule doesn't hand them over
      const rule = PHENO_RULE[id] || ruleText(id);
      return mcQ(`${rule} A ${t.baby} has the genotype ${g}. What is its phenotype?`, shown(words(right)), wrongs.map(shown), rnd); }],
    zyg:[1, rnd => { const id = pick([...DOM_TRAITS, ...MIX_TRAITS], rnd), t = TRAITS[id], g = randomGenotype(id, rnd);
      const het = g[0] !== g[1], right = het ? 'Heterozygous: two different alleles' : 'Homozygous: two copies of the same allele';
      return mcQ(`A ${t.female}’s genotype for one gene is ${g}. Which word describes her genotype?`, right, [het ? 'Homozygous: two copies of the same allele' : 'Heterozygous: two different alleles', 'Phenotype: the trait you can see when you look at her', 'Mutated: a gene that changed'], rnd); }],
    sortZyg:[2, rnd => { const items = shuffleR(DOM_TRAITS.concat(MIX_TRAITS).flatMap(id => genotypesOf(id)), rnd);
      const picked = [], seen = new Set(); for (const g of items) { if (!seen.has(g)) { seen.add(g); picked.push(g); } }
      let list; do list = shuffleR(picked, rnd).slice(0, 6); while (!list.some(g => g[0] !== g[1]) || !list.some(g => g[0] === g[1]));
      return {type:'sort', prompt:'Sort these barn animals’ genotypes. Two different letters (RW) or a capital and a small letter (Rr) are different alleles.', groups:['Homozygous', 'Heterozygous'], items:list.map(g => [g, g[0] === g[1] ? 0 : 1])}; }],
    genoFromPheno:[2, rnd => { const id = pick(DOM_TRAITS, rnd), t = TRAITS[id], rec = rnd() < 0.5;
      const [AA, Aa, aa] = genotypesOf(id), right = rec ? aa : `${AA} or ${Aa}`;
      const wrongs = rec ? [Aa, AA, `${Aa} or ${aa}`] : [AA, Aa, `${Aa} or ${aa}`];
      return mcQ(`${ruleText(id)} A ${t.female} has ${rec ? t.rec : t.dom}. Nobody knows her parents. Which choice lists every genotype she could have?`, right, wrongs, rnd); }],
    carrier:[3, rnd => { const id = pick(DOM_TRAITS, rnd), t = TRAITS[id], [AA, Aa, aa] = genotypesOf(id);
      const pairs = [[Aa, Aa], [AA, Aa], [AA, AA], [AA, aa]], right = pairs[0], [m, d] = right;
      return mcQ(`${ruleText(id)} A farmer wants to know which pair could have a ${t.baby} with ${t.rec}. Which pair could?`, `${m} ${t.female} × ${d} ${t.male}`, pairs.slice(1).map(([a, b]) => `${a} ${t.female} × ${b} ${t.male}`), rnd); }],
    alleleCount:[3, rnd => { const id = pick(DOM_TRAITS, rnd), t = TRAITS[id], [AA, Aa, aa] = genotypesOf(id), nAA = ri(1, 6, rnd), nAa = ri(1, 8, rnd), naa = ri(1, 5, rnd), which = pick([t.A, t.a], rnd);
      const count = which === t.A ? 2 * nAA + nAa : 2 * naa + nAa;
      const group = t.animal === 'sheep' || t.animal === 'chickens' ? 'flock' : 'herd', animals = k => (k === 1 ? 'animal' : 'animals');
      return fillQ(`A ${group} of ${t.animal} has ${nAA} ${AA} ${animals(nAA)}, ${nAa} ${Aa} ${animals(nAa)}, and ${naa} ${aa} ${animals(naa)}. How many copies of the ${which} allele does the ${group} have in all?`, [String(count)]); }]
  },
  /* Apply: Punnett squares */
  punnettA:{
    build:[1, rnd => { const id = pick(DOM_TRAITS, rnd), t = TRAITS[id], [AA, Aa, aa] = genotypesOf(id), [mom, dad] = pick([[Aa, Aa], [Aa, aa], [aa, Aa], [AA, Aa], [Aa, AA], [AA, aa]], rnd);
      return {type:'punnett', prompt:`Fill in the Punnett square for ${anG(mom)} ${mom} ${t.female} and ${anG(dad)} ${dad} ${t.male}. Type the two alleles in each box, in either order. Capital letters matter.`, rows:[...mom], cols:[...dad], rowLabel:`${cap(t.female)} (${mom})`, colLabel:`${cap(t.male)} (${dad})`}; }],
    prob:[1, rnd => { const id = pick(DOM_TRAITS, rnd), t = TRAITS[id], [AA, Aa, aa] = genotypesOf(id), [mom, dad] = pick([[Aa, Aa], [Aa, aa], [aa, Aa]], rnd), want = pick(['dom', 'rec'], rnd);
      const n = crossOutcome(id, mom, dad)[want === 'dom' ? t.domW : t.recW], asPct = rnd() < 0.5;
      return fillQ(`${ruleText(id)} ${cap(anG(mom))} ${mom} ${t.female} and ${anG(dad)} ${dad} ${t.male} have a ${t.baby}. What is the probability the ${t.baby} has ${want === 'dom' ? t.dom : t.rec}? Type it as a ${asPct ? 'percent' : 'fraction'}.`, probAccept(n, 4)); }],
    buildG:[2, rnd => { const id = pick([...DOM_TRAITS, ...MIX_TRAITS], rnd), t = TRAITS[id], [AA, Aa, aa] = genotypesOf(id), [mom, dad] = pick([[Aa, Aa], [Aa, aa], [aa, Aa], [AA, Aa], [Aa, AA], [AA, aa], [aa, AA]], rnd);
      const looks = g => (t.kind === 'dom' ? describe(id, g) : `${phenotype(id, g)} ${id === 'andalusian' ? 'feathers' : 'coat'}`);
      return {type:'punnett', ask:true, prompt:`${ruleText(id)} Cross ${anG(mom)} ${mom} ${t.female} (${looks(mom)}) with ${anG(dad)} ${dad} ${t.male} (${looks(dad)}). Type each parent’s alleles on the edges of the square, then fill in all four boxes (the two letters in a box can go in either order). Capital letters matter.`, rows:[...mom], cols:[...dad], rowLabel:`${cap(t.female)} (${mom})`, colLabel:`${cap(t.male)} (${dad})`}; }],
    ratio:[2, rnd => { const id = pick([...DOM_TRAITS, ...MIX_TRAITS], rnd), t = TRAITS[id], [AA, Aa, aa] = genotypesOf(id), [mom, dad] = pick([[Aa, Aa], [Aa, aa], [AA, Aa], [AA, aa]], rnd);
      const out = crossOutcome(id, mom, dad), names = phenotypesOf(id);
      const ratioText = counts => { const nz = names.map((p, i) => [counts[i], p]).filter(([c]) => c > 0), g = nz.reduce((a, [c]) => gcd(a, c), 0);
        return nz.length === 1 ? `100% ${nz[0][1]}` : nz.map(([c, p]) => `${c / g} ${p}`).join(' : '); };
      const right = ratioText(names.map(p => out[p]));
      const cand = t.kind === 'dom' ? [[3, 1], [1, 1], [1, 3], [4, 0], [0, 4], [2, 1]] : [[1, 2, 1], [1, 1, 0], [0, 1, 1], [0, 4, 0], [3, 0, 1], [4, 0, 0], [0, 0, 4], [2, 0, 2], [2, 1, 1], [1, 1, 2]];
      const wrongs = shuffleR([...new Set(cand.map(ratioText))].filter(r => r !== right), rnd), longest = wrongs.reduce((a, b) => (b.length > a.length ? b : a));
      const w = [longest, ...wrongs.filter(x => x !== longest).slice(0, 2)];   // the longest wrong ratio is always a choice, so the right one is never the longest
      return mcQ(`${ruleText(id)} ${cap(anG(mom))} ${mom} ${t.female} and ${anG(dad)} ${dad} ${t.male} have many ${t.babies}. Which phenotype ratio do you expect?`, right, w, rnd); }],
    expected:[2, rnd => { const id = pick([...DOM_TRAITS, ...MIX_TRAITS], rnd), t = TRAITS[id], [AA, Aa, aa] = genotypesOf(id), [mom, dad] = pick([[Aa, Aa], [Aa, aa], [AA, Aa]], rnd), n = pick(N_OFFSPRING, rnd);
      const out = crossOutcome(id, mom, dad), opts = phenotypesOf(id).filter(p => out[p] > 0 && out[p] < 4), p = pick(opts.length ? opts : phenotypesOf(id), rnd);
      const words = t.kind === 'dom' ? (p === t.domW ? t.dom : t.rec) : `${p} ${id === 'andalusian' ? 'feathers' : 'coats'}`;
      return fillQ(`${ruleText(id)} Over a few years, ${anG(mom)} ${mom} ${t.female} and ${anG(dad)} ${dad} ${t.male} have ${n} ${t.babies}. About how many of the ${t.babies} would you expect to have ${words}?`, [String(n * out[p] / 4)]); }],
    testcross:[3, rnd => { const id = pick(DOM_TRAITS, rnd), t = TRAITS[id], [AA, Aa, aa] = genotypesOf(id), n = ri(6, 12, rnd), rec = ri(2, n - 2, rnd);
      return mcQ(`${ruleText(id)} A ${t.male} with ${t.dom} is crossed with ${t.female}s that have ${t.rec}. Of their ${n} ${t.babies}, ${rec} have ${t.rec}. What is the ${t.male}’s genotype?`, Aa, [AA, aa, `${AA} or ${Aa}: no way to tell`], rnd); }],
    f2:[3, rnd => { const id = pick([...DOM_TRAITS, ...MIX_TRAITS], rnd), t = TRAITS[id], [AA, Aa, aa] = genotypesOf(id);
      const setup = t.kind === 'dom' ? `A purebred ${AA} ${t.male} with ${t.dom} is crossed with ${anG(aa)} ${aa} ${t.female} with ${t.rec}. Their ${t.babies} (the F1) grow up and are crossed with each other.` : `A purebred ${AA} ${t.male} (${t.AA}) is crossed with ${anG(aa)} ${aa} ${t.female} (${t.aa}). Their ${t.babies} (the F1) grow up and are crossed with each other.`;
      let ask, n, d;
      if (t.kind === 'dom') { const k = pick(['rec', 'dom', 'carrier'], rnd); if (k === 'rec') { ask = `What fraction of the F2 ${t.babies} will have ${t.rec}?`; n = 1; d = 4; } else if (k === 'dom') { ask = `What fraction of the F2 ${t.babies} will have ${t.dom}?`; n = 3; d = 4; } else { ask = `Of the F2 ${t.babies} that have ${t.dom}, what fraction carry the hidden ${t.a} allele?`; n = 2; d = 3; } }
      else { const p = pick([t.AA, t.Aa, t.aa], rnd); ask = `What fraction of the F2 ${t.babies} will be ${p}?`; n = p === t.Aa ? 2 : 1; d = 4; }
      return fillQ(`${ruleText(id)} ${setup} ${ask} Type a fraction.`, probAccept(n, d)); }],
    two:[3, rnd => { const id = pick(DOM_TRAITS, rnd), t = TRAITS[id], [AA, Aa, aa] = genotypesOf(id), [mom, dad] = pick([[Aa, Aa], [Aa, aa]], rnd);
      const out = crossOutcome(id, mom, dad), pd = out[t.domW], pr = out[t.recW], k = pick(['bothRec', 'bothDom', 'firstRecSecondDom'], rnd);
      const [n, d, ask] = k === 'bothRec' ? [pr * pr, 16, `both have ${t.rec}`] : k === 'bothDom' ? [pd * pd, 16, `both have ${t.dom}`] : [pr * pd, 16, `the first has ${t.rec} and the second has ${t.dom}`];
      return fillQ(`${ruleText(id)} ${cap(anG(mom))} ${mom} ${t.female} and ${anG(dad)} ${dad} ${t.male} have two ${t.babies}, one after the other. What is the probability that ${ask}? Type a fraction.`, probAccept(n, d)); }],
    pedigree:[3, rnd => { const id = pick(['angus', 'polled', 'wool'], rnd), t = TRAITS[id];
      for (let k = 0; k < 400; k++) {
        const ped = makePedigree(id, rnd), sets = pedigreePossible(id, ped.people), [AA, Aa, aa] = genotypesOf(id);
        const cands = ped.people.filter(p => !p.aff).map(p => ({p, s:[...sets[p.id]].sort()})), forced = cands.filter(c => c.s.length === 1 && c.s[0] === Aa), open = cands.filter(c => c.s.length === 2);
        if (!ped.people.some(p => p.aff)) continue;
        const c = (forced.length && (rnd() < 0.7 || !open.length)) ? pick(forced, rnd) : open.length ? pick(open, rnd) : null;
        if (!c) continue;
        const right = c.s.length === 1 ? Aa : `${AA} or ${Aa}`, wrongs = [AA, Aa, aa, `${AA} or ${Aa}`, `${Aa} or ${aa}`].filter(x => x !== right);
        const keep = c.s.length === 1 ? [AA, aa, `${AA} or ${Aa}`] : [Aa, AA, `${Aa} or ${aa}`];
        return mcQ(`${ruleText(id)} Here is a family tree from the barn. Using only what the tree shows, what is the genotype of animal number ${c.p.id}?`, right, keep.filter(x => wrongs.includes(x)), rnd, {figure:pedigreeSVG(ped, id)});
      }
      return null; }],
    pedProb:[3, rnd => { const id = pick(['angus', 'polled', 'wool'], rnd), t = TRAITS[id];
      for (let k = 0; k < 400; k++) {
        const ped = makePedigree(id, rnd), sets = pedigreePossible(id, ped.people), [, mate1, mate2] = [null, ...ped.couples[1]];
        const s1 = [...sets[mate1]], s2 = [...sets[mate2]];
        if (s1.length !== 1 || s2.length !== 1) continue;
        const out = crossOutcome(id, s1[0], s2[0]), n = out[t.recW];
        if (n === 0 || (n === 4 && rnd() < 0.7)) continue;
        return fillQ(`${ruleText(id)} Here is a family tree from the barn. If animals ${mate1} and ${mate2} have one more ${t.baby}, what is the probability it has ${t.rec}? Type a fraction.`, probAccept(n, 4), {figure:pedigreeSVG(ped, id)});
      }
      return null; }]
  },
  /* Understand: Sexual reproduction and genetic variation */
  sexVarU:{
    clone:[2, rnd => { const id = pick(['polled', 'angus', 'wool'], rnd), t = TRAITS[id], [AA, Aa, aa] = genotypesOf(id), g = pick([Aa, Aa, AA, aa], rnd);   // mammals only: no bird has ever been cloned
      const wrongs = g === Aa ? [`${AA} or ${aa}, half of her alleles doubled`, `${Aa}, ${AA} or ${aa}, like a Punnett square`, `${aa}, because a clone keeps just the recessive alleles`]
        : [`${Aa}, because the egg cell adds a new allele`, `${Aa}, ${AA} or ${aa}, like a Punnett square`, `Just ${g[0]}, half of her alleles, like an egg cell`];
      return mcQ(`Scientists cloned ${anG(g)} ${g} ${t.female}: the new ${t.baby} was made from one of her body cells, with no ${t.male}. What genotype does the cloned ${t.baby} have?`, `${g}, the same as her`, wrongs, rnd); }],
    eggTypes:[3, rnd => { const genes = ri(2, 4, rnd), labels = ['Aa', 'Bb', 'Dd', 'Ee'].slice(0, genes);
      return fillQ(`A hen is heterozygous for ${genes} different genes: ${labels.join(', ')}. Each gene is on a different chromosome pair, and each egg gets one allele of each gene. How many different combinations of these alleles can her eggs have?`, [String(2 ** genes)]); }]
  }
};
/** the generated kinds for a lesson: [[kind, level], …] */
export const geneticsKinds = skillId => Object.entries(KINDS[skillId] || {}).map(([kind, [level]]) => [kind, level]);
export const GENETICS_SKILLS = Object.keys(KINDS);
/** one new question of a kind, ready for the lesson runner (id stays the same for a kind, so miss rates add up by kind) */
export function geneticsQuestion(skillId, kind, rnd = Math.random, courseId = 'bio5'){
  const entry = KINDS[skillId]?.[kind]; if (!entry) return null;
  const [level, make] = entry;
  for (let i = 0; i < 20; i++) { const q = make(rnd); if (q) return {...q, difficulty:level, id:`gen:${courseId}:${skillId}:${kind}`, gen:kind, skillId}; }
  return null;
}
/** one of each kind for a lesson (fresh every call) */
export const geneticsQuestions = (skillId, rnd = Math.random, courseId = 'bio5') => geneticsKinds(skillId).map(([kind]) => geneticsQuestion(skillId, kind, rnd, courseId)).filter(Boolean);
