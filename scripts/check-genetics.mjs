#!/usr/bin/env node
/* Checks the Farm Barn's generated genetics problems (src/shared/genetics.js, docs/SCIENCE-UNIT5.md) and the Barn
   Breeder game (src/game/barnBreeder.js, docs/BARN-BREEDER.md).

   For every kind, it makes about 3,000 problems and solves each one with its own code, reading only what she sees on a
   quiz or test: the prompt, the figure (the DNA letters, the codon key, the family-tree picture) and the choices. It
   never reads the answer key until it compares. It also checks: exactly one right choice, no repeated choices, the right
   choice is not the longest, no NaN/undefined, and every accepted typed answer means the same number.
   Then it plays thousands of Barn Breeder seasons.

     node scripts/check-genetics.mjs            (about 3,000 per kind)
     node scripts/check-genetics.mjs --n 500
     node scripts/check-genetics.mjs --break    (breaks one key on purpose, to prove the checker catches it) */
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2), N = +(args[args.indexOf('--n') + 1] || 0) || 3000, BREAK = args.includes('--break');
const G = await import(pathToFileURL(join(root, 'src/shared/genetics.js')).href);
const B = await import(pathToFileURL(join(root, 'src/game/barnBreeder.js')).href);
// questionTypes imports a TypeScript file for ids; the checker only needs the answer checks, so load a copy without it
const tmp = mkdtempSync(join(tmpdir(), 'genetics-'));
writeFileSync(join(tmp, 'qt.mjs'), readFileSync(join(root, 'src/shared/questionTypes.js'), 'utf8').replace(/import \{ questionId \} from '\.\/questionIds';/, 'const questionId = () => "x";'));
const QT = await import(pathToFileURL(join(tmp, 'qt.mjs')).href);

/* ---------- the solver's own genetics (written separately from src/shared/genetics.js) ---------- */
const norm = g => [...g].sort((x, y) => (x.toLowerCase() === y.toLowerCase() ? (x === y ? 0 : x < y ? -1 : 1) : x.toLowerCase() < y.toLowerCase() ? -1 : 1)).join('');   // 'B' < 'b' in char codes, so capital first
const kids = (m, d) => [m[0] + d[0], m[0] + d[1], m[1] + d[0], m[1] + d[1]].map(norm);
/** read the rule sentence a problem starts with: what each genotype looks like */
function readRule(text){
  let m;
  if ((m = text.match(/the polled allele \((\w), no horns\) is dominant over the horned allele \((\w)\)/))) return {A:m[1], a:m[2], look:g => (g.includes(m[1]) ? 'no horns' : 'horns'), dom:'no horns', rec:'horns'};
  if ((m = text.match(/In [\w ]+?, (.+?) \((\w)\) is dominant over (.+?) \((\w)\)\./))) { const [, dom, A, rec, a] = m; return {A, a, look:g => (g.includes(A) ? dom : rec), dom, rec}; }
  if ((m = text.match(/the (\w+) \((\w)\) and (\w+) \((\w)\) coat alleles are codominant: an? (\w+) calf is (\w+)/))) { const [, n1, A, n2, a, , mid] = m; return {A, a, look:g => (g === A + A ? n1 : g === a + a ? n2 : mid), mix:true}; }
  if ((m = text.match(/the (\w+) \((\w)\) and (\w+) \((\w)\) feather alleles show incomplete dominance: a (\w+) chick has (\S+) feathers/))) { const [, n1, A, n2, a, , mid] = m; return {A, a, look:g => (g === A + A ? n1 : g === a + a ? n2 : mid.replace('-gray', '')), mix:true}; }
  return null;
}
const valueOf = text => {   // a typed probability: "3/4", "75%", "0.75", "1"
  const t = String(text).trim().replace(/\s*percent$/, '%');
  let m;
  if ((m = t.match(/^(\d+)\/(\d+)$/))) return +m[1] / +m[2];
  if ((m = t.match(/^(\d+(?:\.\d+)?)%$/))) return +m[1] / 100;
  if ((m = t.match(/^(0?\.\d+)$/))) return +m[1];
  if ((m = t.match(/^(\d+(?:\.\d+)?)$/))) return +m[1] <= 1 ? +m[1] : +m[1] / 100;   // a bare "25" means 25 percent
  return NaN;
};
/* the genetic code, built a different way: amino acid → its codons */
const CODE = {Phe:'TTT TTC', Leu:'TTA TTG CTT CTC CTA CTG', Ile:'ATT ATC ATA', Met:'ATG', Val:'GTT GTC GTA GTG', Ser:'TCT TCC TCA TCG AGT AGC', Pro:'CCT CCC CCA CCG', Thr:'ACT ACC ACA ACG', Ala:'GCT GCC GCA GCG', Tyr:'TAT TAC', Stop:'TAA TAG TGA', His:'CAT CAC', Gln:'CAA CAG', Asn:'AAT AAC', Lys:'AAA AAG', Asp:'GAT GAC', Glu:'GAA GAG', Cys:'TGT TGC', Trp:'TGG', Arg:'CGT CGC CGA CGG AGA AGG', Gly:'GGT GGC GGA GGG'};
const AA = {}; for (const [aa, list] of Object.entries(CODE)) for (const c of list.split(' ')) AA[c] = aa;
const translate = (dna, n) => Array.from({length:n}, (_, i) => AA[dna.slice(3 * i, 3 * i + 3)]);
function readDNA(fig){
  const strip = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, '');
  const orig = strip(fig.match(/Original gene:<\/b> <code>(.*?)<\/code>/)[1]), mut = strip(fig.match(/Gene after the mutation:<\/b> <code>(.*?)<\/code>/)[1]);
  const keys = [...fig.matchAll(/<b>([ACGT]{3})<\/b> = (\w+)/g)].map(m => [m[1], m[2]]);
  return {orig, mut, keys};
}
/* pedigrees: list every assignment that fits the picture, with the solver's own search */
function pedSolve(people){
  const out = Object.fromEntries(people.map(p => [p.id, new Set()]));
  const fits = (asg) => people.every(p => !p.mom || !(p.mom in asg) || !(p.dad in asg) || !(p.id in asg) || kids(asg[p.mom], asg[p.dad]).includes(asg[p.id]));
  const rec = (i, asg) => {
    if (i === people.length) { for (const p of people) out[p.id].add(asg[p.id]); return; }
    const p = people[i];
    for (const g of p.aff ? ['aa'] : ['AA', 'Aa']) { asg[p.id] = g; if (fits(asg)) rec(i + 1, asg); delete asg[p.id]; }
  };
  rec(0, {});
  return out;
}
const pedOf = fig => JSON.parse(fig.match(/data-ped="([^"]+)"/)[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
const letters = (rule, g) => g.replace(/A/g, rule.A).replace(/a/g, rule.a);

/* ---------- one solver per kind: returns the right choice text (multiple choice), or a value/list to compare ---------- */
const pickOpt = (q, test) => { const hits = q.options.filter(test); return hits.length === 1 ? hits[0] : {error:`${hits.length} choices fit`}; };
const S = {
  chromA:{
    gamete:q => ({num:+q.prompt.match(/have (\d+) chromosomes/)[1] / 2}),
    pairs:q => ({num:+q.prompt.match(/has (\d+) chromosomes/)[1] / 2}),
    fromParent:q => ({num:+q.prompt.match(/has (\d+) chromosomes/)[1] / 2}),
    whichCell:q => { const n = +q.prompt.match(/body cells have (\d+)/)[1], c = +q.prompt.match(/cell has (\d+) chromosomes/)[1]; return pickOpt(q, o => (c * 2 === n ? /^A sex cell \(egg or sperm\) with one/.test(o) : c === n && /^A body cell with two/.test(o))); },
    spermAllele:() => ({value:1 / 2}),
    mule:q => { const [h, d] = [...q.prompt.matchAll(/(\d+) chromosomes|have (\d+)/g)].map(m => +(m[1] || m[2])); return {num:h / 2 + d / 2}; }
  },
  mutA:{
    kind:q => { const {orig, mut} = readDNA(q.figure); const k = mut.length === orig.length ? (([...orig].filter((c, i) => c !== mut[i]).length === 1) ? 'swapped' : 'bad') : mut.length > orig.length ? 'added' : 'removed';
      if (k !== 'swapped' && ![...Array(Math.max(orig.length, mut.length)).keys()].some(i => (mut.length > orig.length ? mut.slice(0, i) + mut.slice(i + 1) === orig : orig.slice(0, i) + orig.slice(i + 1) === mut))) return {error:'not a single change'};
      return pickOpt(q, o => o.includes(k)); },
    effect:q => { const {orig, mut, keys} = readDNA(q.figure); if (keys.some(([c, a]) => AA[c] !== a)) return {error:'codon key wrong'};
      const n = orig.length / 3 - 1, a = translate(orig, n), b = translate(mut, n), diff = a.filter((x, i) => x !== b[i]).length;
      const k = mut.length !== orig.length ? 'reading frame shifts' : b.includes('Stop') ? 'stop codon shows up early' : diff === 0 ? 'No amino acid changes' : diff === 1 ? 'Exactly one amino acid' : 'bad';
      if (mut.length !== orig.length && b.includes('Stop')) return {error:'frameshift with an early stop: two answers fit'};
      if (mut.length !== orig.length && diff < 2) return {error:'frameshift that changes one amino acid'};
      return pickOpt(q, o => o.includes(k)); },
    count:q => { const {orig, mut, keys} = readDNA(q.figure); if (keys.some(([c, a]) => AA[c] !== a)) return {error:'codon key wrong'};
      const n = +q.prompt.match(/In the first (\d+) amino acids/)[1]; if (orig.length !== 3 * (n + 1)) return {error:'length does not match the prompt'};
      const a = translate(orig, n), b = translate(mut, n); return {num:a.filter((x, i) => x !== b[i]).length}; }
  },
  vocabA:{
    pheno:q => { const r = readRule(q.prompt), g = q.prompt.match(/genotype (\w\w)\./)[1]; const want = r.look(g); return pickOpt(q, o => o === want || (want === 'white' && /feather/.test(q.prompt) && o === 'splash white')); },
    zyg:q => { const g = q.prompt.match(/is (\w\w)\./)[1]; return pickOpt(q, o => o.startsWith(g[0] === g[1] ? 'Homozygous' : 'Heterozygous')); },
    sortZyg:q => ({sort:q.items.map(([g]) => (g[0] === g[1] ? 0 : 1))}),
    genoFromPheno:q => { const r = readRule(q.prompt), has = q.prompt.match(/ has (.+?)\. Nobody/)[1]; const AA = r.A + r.A, Aa = r.A + r.a, aa = r.a + r.a;
      return pickOpt(q, o => o === (has === r.rec ? aa : has === r.dom ? `${AA} or ${Aa}` : '??')); },
    carrier:q => { const r = readRule(q.prompt); return pickOpt(q, o => { const [m, d] = [...o.matchAll(/\b(\w\w) (?:cow|ewe|hen|bull|ram|rooster)/g)].map(x => x[1]); return kids(m, d).some(k => r.look(k) === r.rec); }); },
    alleleCount:q => { const m = q.prompt.match(/has (\d+) (\w\w) animals, (\d+) (\w\w) animals, and (\d+) (\w\w) animals\. How many copies of the (\w) allele/);
      const which = m[7]; return {num:[[+m[1], m[2]], [+m[3], m[4]], [+m[5], m[6]]].reduce((s, [n, g]) => s + n * [...g].filter(c => c === which).length, 0)}; }
  },
  punnettA:{
    build:q => { const m = q.prompt.match(/for an? (\w\w) (\w+) and an? (\w\w) (\w+)\./); return {punnett:[m[1], m[3]]}; },
    buildG:q => { const m = q.prompt.match(/Cross an? (\w\w) (\w+) \(.+?\) with an? (\w\w) (\w+) \(/); return {punnett:[m[1], m[3]]}; },
    prob:q => { const r = readRule(q.prompt), m = q.prompt.match(/\. An? (\w\w) \w+ and an? (\w\w) \w+ have an? \w+\. What is the probability the \w+ has (.+?)\? Type/);
      return {value:kids(m[1], m[2]).filter(k => r.look(k) === m[3]).length / 4}; },
    ratio:q => { const r = readRule(q.prompt), m = q.prompt.match(/\. An? (\w\w) \w+ and an? (\w\w) \w+ have many/), counts = {};
      kids(m[1], m[2]).forEach(k => { const p = r.look(k).replace(/^an? /, '').replace(/ (coat|wool|comb)$/, '').replace('no horns', 'polled').replace(/^horns$/, 'horned').replace(/^rose$/, 'rose-comb').replace(/^single$/, 'single-comb').replace(/^white$/, r.mix && /feather/.test(q.prompt) ? 'splash white' : 'white'); counts[p] = (counts[p] || 0) + 1; });
      const same = o => { const parts = o.startsWith('100% ') ? [[1, o.slice(5)]] : o.split(' : ').map(x => { const mm = x.match(/^(\d+) (.+)$/); return [+mm[1], mm[2]]; });
        const tot = parts.reduce((s, [n]) => s + n, 0), names = Object.keys(counts);
        return parts.length === names.length && parts.every(([n, p]) => counts[p] != null && Math.abs(n / tot - counts[p] / 4) < 1e-9); };
      return pickOpt(q, same); },
    expected:q => { const r = readRule(q.prompt), m = q.prompt.match(/, an? (\w\w) \w+ and an? (\w\w) \w+ have (\d+) \w+\. About how many of the \w+ would you expect to have (.+?)\?$/);
      const want = m[4].replace(/ (coats|feathers)$/, ''); return {num:+m[3] * kids(m[1], m[2]).filter(k => { const p = r.look(k); return p === m[4] || p === want || (want === 'splash white' && p === 'white'); }).length / 4}; },
    testcross:q => { const r = readRule(q.prompt), m = q.prompt.match(/Of their (\d+) \w+, (\d+) have/); return pickOpt(q, o => o === (+m[2] > 0 ? r.A + r.a : r.A + r.A)); },
    f2:q => { const r = readRule(q.prompt), F2 = kids(r.A + r.a, r.A + r.a);
      let m;
      if ((m = q.prompt.match(/Of the F2 \w+ that have (.+?), what fraction carry the hidden/))) { const shown = F2.filter(k => r.look(k) === m[1]); return {value:shown.filter(k => k !== r.A + r.A).length / shown.length}; }
      if ((m = q.prompt.match(/What fraction of the F2 \w+ will have (.+?)\? Type/))) return {value:F2.filter(k => r.look(k) === m[1]).length / 4};
      if ((m = q.prompt.match(/What fraction of the F2 \w+ will be (.+?)\? Type/))) { const want = m[1] === 'splash white' ? 'white' : m[1]; return {value:F2.filter(k => r.look(k) === want).length / 4}; }
      return {error:'unread'}; },
    two:q => { const r = readRule(q.prompt), m = q.prompt.match(/\. An? (\w\w) \w+ and an? (\w\w) \w+ have two/), k = kids(m[1], m[2]);
      const pd = k.filter(x => r.look(x) === r.dom).length / 4, pr = 1 - pd;
      if (/both have (.+?)\? Type/.test(q.prompt)) { const w = q.prompt.match(/both have (.+?)\? Type/)[1]; return {value:w === r.rec ? pr * pr : pd * pd}; }
      return {value:pr * pd}; },
    pedigree:q => { const r = readRule(q.prompt), id = +q.prompt.match(/animal number (\d+)/)[1], sets = pedSolve(pedOf(q.figure)), s = [...sets[id]].sort();
      const want = s.length === 1 ? letters(r, s[0]) : `${letters(r, 'AA')} or ${letters(r, 'Aa')}`; if (s.includes('aa')) return {error:'asked about a filled animal'};
      return pickOpt(q, o => o === want); },
    pedProb:q => { const m = q.prompt.match(/If animals (\d+) and (\d+) have/), sets = pedSolve(pedOf(q.figure)), a = [...sets[+m[1]]], b = [...sets[+m[2]]];
      if (a.length !== 1 || b.length !== 1) return {error:'parents not forced'}; return {value:kids(a[0], b[0]).filter(k => k === 'aa').length / 4}; }
  },
  sexVarU:{
    clone:q => { const g = q.prompt.match(/cloned an? (\w\w) /)[1]; return pickOpt(q, o => o === `${g}, the same as her`); },
    eggTypes:q => ({num:2 ** q.prompt.match(/: ((?:\w\w(?:, )?)+)\. Each gene/)[1].split(', ').length})
  }
};

/* ---------- run ---------- */
let fails = 0, warns = 0;
const fail = (where, msg, q) => { fails++; if (fails <= 25) console.log(`❌ ${where}: ${msg}\n   ${JSON.stringify(q).slice(0, 400)}`); };
const ABSOLUTE = /\b(only|always|never|all|none|every|completely|nothing)\b/i;
let broke = !BREAK;
for (const skill of G.GENETICS_SKILLS) for (const [kind, level] of G.geneticsKinds(skill)) {
  const seen = new Set(); let longest = 0, absolutes = 0;
  for (let i = 0; i < N; i++) {
    const q = G.geneticsQuestion(skill, kind);
    const where = `${skill}:${kind}`;
    if (!q) { fail(where, 'no problem made', {}); continue; }
    if (!broke && q.options) { q.answer = (q.answer + 1) % q.options.length; broke = true; }
    const text = JSON.stringify(q);
    if (/NaN|undefined|null/.test(text)) fail(where, 'NaN/undefined/null in the problem', q);
    if (q.difficulty !== level) fail(where, `level ${q.difficulty}, expected ${level}`, q);
    seen.add(q.prompt + (q.figure || '') + (q.options || []).slice().sort().join('|') + JSON.stringify(q.items || ''));
    const problems = q.options ? [] : QT.typedProblems(q); if (problems.length) fail(where, problems.join(', '), q);   // multiple choice: capital letters make choices different (RR, Rr), so only exact repeats count
    let got;
    try { got = S[skill][kind](q); } catch (e) { fail(where, `solver could not read it: ${e.message}`, q); continue; }
    if (got?.error) { fail(where, got.error, q); continue; }
    if (q.options) {   // multiple choice
      if (new Set(q.options).size !== q.options.length) fail(where, 'two choices are the same', q);
      if (q.options[q.answer] !== got) fail(where, `key says "${q.options[q.answer]}", solver says "${got}"`, q);
      const right = q.options[q.answer], maxWrong = Math.max(...q.options.filter((_, k) => k !== q.answer).map(o => o.length));
      if (right.length > maxWrong) longest++;
      if (!ABSOLUTE.test(right) && q.options.some((o, k) => k !== q.answer && ABSOLUTE.test(o))) absolutes++;
    } else if (q.type === 'fill') {
      if (got.num != null) { if (!q.accept.includes(String(got.num))) fail(where, `accepts ${q.accept}, solver says ${got.num}`, q); }
      else if (got.value != null) { const bad = q.accept.filter(a => !(Math.abs(valueOf(a) - got.value) < 0.006)); if (bad.length || !q.accept.length) fail(where, `accepted answers ${bad.join(', ')} are not ${got.value}`, q); }
      if (!QT.checkTyped(q, q.accept[0])) fail(where, 'its own first answer is marked wrong', q);
    } else if (q.type === 'sort') {
      if (q.items.some(([, g], k) => g !== got.sort[k])) fail(where, 'sort key differs from the solver', q);
    } else if (q.type === 'punnett') {
      const [mom, dad] = got.punnett;
      if ([...q.rows].sort().join() !== [...mom].sort().join() || [...q.cols].sort().join() !== [...dad].sort().join()) fail(where, `square edges ${q.rows}/${q.cols} are not the prompt’s parents ${mom}/${dad}`, q);
      const boxes = kids(mom, dad), answer = q.ask ? [dad[1], dad[0], mom[0], mom[1], ...kids(mom, dad.split('').reverse().join(''))] : [...q.rows.flatMap(r => q.cols.map(c => r + c))].map(x => [...x].reverse().join(''));
      if (!q.ask && !QT.checkTyped(q, answer)) fail(where, 'a right square (letters typed in either order) is marked wrong', q);
      if (q.ask && !QT.checkTyped(q, answer)) fail(where, 'a right square with the father’s alleles swapped is marked wrong', q);
      const wrong = [...answer]; const k = answer.length - 1; wrong[k] = wrong[k] === wrong[k].toUpperCase() ? wrong[k].toLowerCase() : wrong[k].toUpperCase();
      if (QT.checkTyped(q, wrong) && wrong[k] !== answer[k]) fail(where, 'a wrong box is marked right', q);
      if (!boxes.length) fail(where, 'no boxes', q);
    }
  }
  const msg = `${skill}:${kind} (level ${level}): ${N} checked, ${seen.size} different`;
  if (longest) { warns++; console.log(`⚠️ ${msg}; the right choice is the longest in ${longest}`); }
  else if (absolutes) { warns++; console.log(`⚠️ ${msg}; a wrong choice uses an absolute word in ${absolutes}`); }
  else console.log(`✅ ${msg}`);
}

/* ---------- Barn Breeder: play seasons ---------- */
const seasons = Math.max(200, Math.round(N / 3));
let reached = 0, total = 0, stars = [0, 0, 0, 0];
for (let s = 0; s < seasons; s++) {
  const season = B.newSeason();
  if (new Set(season).size !== 5) fail('barn', 'a season repeats a goal', season);
  let goals = 0;
  for (const id of season) {
    const goal = B.goalById(id), barn = B.startBarn(goal);
    let left = goal.limit, done = false;
    while (left > 0 && !done) {   // a careful player: the pair with the best chance, babies join the barn
      const best = B.bestPair(goal, barn);
      if (!best) { fail('barn', `${id}: no pair to breed`, barn); break; }
      const chance = B.targetChance(goal, best.m, best.d);
      const mine = Object.entries(goal.want).reduce((p, [trait, ph]) => p * kids(best.m.g[trait], best.d.g[trait]).filter(k => G.phenotype(trait, k) === ph).length / 4, 1);
      if (Math.abs(chance[0] / chance[1] - mine) > 1e-9) fail('barn', `${id}: chance ${chance} but the solver says ${mine}`, best);
      const chips = Object.keys(goal.want).length > 1 ? B.CHIPS_TWO : B.CHIPS_ONE;
      if (chips.filter(c => B.sameChance(c, chance)).length !== 1) fail('barn', `${id}: the chance ${chance} is not exactly one chip`, chips);
      const babies = ['f', 'm'].map(sex => ({...B.makeBaby(goal, best.m, best.d, sex), id:`x${barn.length}${sex}`, name:'x', gen:'F'}));
      for (const b of babies) for (const [trait, g] of Object.entries(b.g)) if (!kids(best.m.g[trait], best.d.g[trait]).includes(g)) fail('barn', 'a baby has a genotype its parents can’t make', b);
      barn.push(...babies); left--;
      if (babies.some(b => B.hasTarget(goal, b))) done = true;
    }
    total++; if (done) { reached++; goals++; }
  }
  stars[B.starsFor(goals, goals ? 4 : 0, 4)]++;
}
console.log(`🐄 Barn Breeder: ${seasons} seasons played with the best pair each time; ${reached} of ${total} goals reached (${(100 * reached / total).toFixed(1)}%).`);
for (const goal of B.GOALS) {   // per goal: how often a careful player reaches it
  let ok = 0; const T = 2000;
  for (let t = 0; t < T; t++) { const barn = B.startBarn(goal); let left = goal.limit, done = false;
    while (left-- > 0 && !done) { const best = B.bestPair(goal, barn); const babies = ['f', 'm'].map(sex => ({...B.makeBaby(goal, best.m, best.d, sex), id:`y${barn.length}${sex}`, gen:'F'})); barn.push(...babies); done = babies.some(b => B.hasTarget(goal, b)); }
    if (done) ok++; }
  console.log(`   ${goal.id}: reached in ${(100 * ok / T).toFixed(1)}% of ${T} tries (limit ${goal.limit} breedings)`);
}

if (BREAK) { console.log(fails ? `✅ --break: the checker caught the broken key (${fails} failure${fails === 1 ? '' : 's'}).` : '❌ --break: the broken key was NOT caught.'); process.exit(fails ? 0 : 1); }
console.log(fails ? `❌ ${fails} problem${fails === 1 ? '' : 's'} found.` : `✅ Every generated genetics problem matched the solver (${warns} warning${warns === 1 ? '' : 's'}).`);
process.exit(fails ? 1 : 0);
