/* Independent answer checkers for the Potion Lab (Khan unit 6: variables and expressions).
   Loaded as a plain browser script by scripts/check-math.mjs. Each solver reads only what the student sees
   (the story, the picture's text, the choice texts), parses the expressions itself, and works the answer out
   with its own exact-fraction evaluator. Expression equivalence is tested by evaluating at several values. */
(() => {
  const O = window.ORACLES = window.ORACLES || {};

  /* ---------- exact fractions [n, d], d > 0 ---------- */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const F = (n, d = 1) => { if (d === 0) throw new Error('div0'); if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const fadd = (a, b) => F(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const fsub = (a, b) => F(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
  const fmul = (a, b) => F(a[0] * b[0], a[1] * b[1]);
  const fdiv = (a, b) => F(a[0] * b[1], a[1] * b[0]);
  const fpow = (a, e) => { let r = [1, 1]; for (let i = 0; i < e; i++) r = fmul(r, a); return r; };
  const fnum = a => a[0] / a[1];
  const feq = (a, b) => a[0] === b[0] && a[1] === b[1];
  /* a decimal like 0.7 as an exact fraction */
  const fromDec = s => { const [w, f = ''] = s.split('.'); const d = Math.pow(10, f.length); return F(Number(w) * d + (f ? Number(f) : 0), d); };

  /* ---------- tokenizer and parser ---------- */
  const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  function tokenize(src){
    const s = String(src).replace(/−|–/g, '-').replace(/[·*]/g, '×').replace(/\//g, '÷');
    const out = []; let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.]/.test(c)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; out.push({t:'num', v:fromDec(s.slice(i, j))}); i = j; continue; }
      if (SUPS.includes(c)) { let j = i, n = ''; while (j < s.length && SUPS.includes(s[j])) n += SUPS.indexOf(s[j++]); out.push({t:'op', v:'^'}); out.push({t:'num', v:F(+n)}); i = j; continue; }
      if (/[a-zA-Z]/.test(c)) { out.push({t:'var', v:c}); i++; continue; }
      if ('+-×÷^'.includes(c)) { out.push({t:'op', v:c}); i++; continue; }
      if ('(['.includes(c)) { out.push({t:'open'}); i++; continue; }
      if (')]'.includes(c)) { out.push({t:'close'}); i++; continue; }
      throw new Error('bad char ' + c + ' in ' + src);
    }
    return out;
  }
  function parse(src){
    const tk = tokenize(src); let p = 0;
    const peek = () => tk[p];
    const startsAtom = t => t && (t.t === 'num' || t.t === 'var' || t.t === 'open');
    function expr(){
      let a = term();
      while (peek() && peek().t === 'op' && (peek().v === '+' || peek().v === '-')) { const op = tk[p++].v; a = {t:'bin', op, a, b:term()}; }
      return a;
    }
    function term(){
      let a = unary();
      for (;;) {
        const t = peek();
        if (t && t.t === 'op' && (t.v === '×' || t.v === '÷')) { p++; a = {t:'bin', op:t.v === '×' ? '*' : '/', a, b:unary()}; }
        else if (startsAtom(t)) a = {t:'bin', op:'*', a, b:power()};   // juxtaposition: 3x, 2(x + 1), (a + b)m
        else return a;
      }
    }
    function unary(){ if (peek() && peek().t === 'op' && peek().v === '-') { p++; return {t:'neg', a:unary()}; } return power(); }
    function power(){ const a = atom(); if (peek() && peek().t === 'op' && peek().v === '^') { p++; return {t:'bin', op:'^', a, b:unary()}; } return a; }
    function atom(){
      const t = tk[p++];
      if (!t) throw new Error('unexpected end in ' + src);
      if (t.t === 'num') return {t:'num', v:t.v};
      if (t.t === 'var') return {t:'var', v:t.v};
      if (t.t === 'open') { const e = expr(); if (!tk[p] || tk[p].t !== 'close') throw new Error('missing ) in ' + src); p++; return {t:'paren', a:e}; }
      throw new Error('unexpected token in ' + src);
    }
    const e = expr(); if (p !== tk.length) throw new Error('trailing tokens in ' + src);
    return e;
  }
  const unwrap = n => n.t === 'paren' ? unwrap(n.a) : n;
  function ev(n, env){
    switch (n.t) {
      case 'num': return n.v;
      case 'var': if (!(n.v in env)) throw new Error('no value for ' + n.v); return env[n.v];
      case 'paren': return ev(n.a, env);
      case 'neg': return fsub([0, 1], ev(n.a, env));
      case 'bin': { const a = ev(n.a, env), b = ev(n.b, env);
        if (n.op === '+') return fadd(a, b); if (n.op === '-') return fsub(a, b); if (n.op === '*') return fmul(a, b); if (n.op === '/') return fdiv(a, b);
        if (b[1] !== 1 || b[0] < 0) throw new Error('bad exponent'); return fpow(a, b[0]); }
    }
    throw new Error('bad node');
  }
  const varsOf = (n, s = new Set()) => { if (n.t === 'var') s.add(n.v); for (const k of ['a', 'b']) if (n[k]) varsOf(n[k], s); return s; };
  /* equivalence: equal at several exact sample points (skipping points that divide by zero) */
  const SAMPLES = [F(3), F(7), F(11, 3), F(13, 2), F(23), F(5, 7), F(17, 4)];
  function equiv(n1, n2){
    const vs = [...new Set([...varsOf(n1), ...varsOf(n2)])]; let tested = 0;
    for (let k = 0; k < SAMPLES.length; k++) {
      const env = {}; vs.forEach((v, j) => { env[v] = SAMPLES[(k + 2 * j) % SAMPLES.length]; });
      let a, b; try { a = ev(n1, env); b = ev(n2, env); } catch (e) { if (/div0/.test(e.message)) continue; throw e; }
      if (!feq(a, b)) return false; tested++;
    }
    return tested >= 3;
  }
  /* linear coefficients {const, x:…, y:…} of an expression (for coefficient / GCF questions) */
  function linear(n){
    const vs = [...varsOf(n)], zero = {}; vs.forEach(v => { zero[v] = F(0); });
    const c0 = ev(n, zero), out = {const:c0};
    for (const v of vs) out[v] = fsub(ev(n, {...zero, [v]:F(1)}), c0);
    return out;
  }

  /* ---------- reading what she sees ---------- */
  const decode = s => String(s || '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  const strip = h => decode(String(h || '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
  const divs = h => [...String(h || '').matchAll(/<div[^>]*>([\s\S]*?)<\/div>/g)].map(m => strip(m[1]));
  /* drop a leading emoji / picture label: keep from the first character an expression can start with */
  const exprPart = s => { const m = String(s).match(/[0-9a-zA-Z(−\-][\s\S]*$/); return m ? m[0].trim() : ''; };
  const choiceStep = p => { const st = p.steps.filter(s => s.kind === 'choice'); return st[st.length - 1]; };
  const opts = p => (choiceStep(p)?.options || []).map(o => o.text);
  /* the one option whose expression passes test(node); null when it isn't exactly one */
  function pickOpt(p, test){
    const hits = opts(p).filter(t => { let n; try { n = parse(t); } catch (e) { return false; } return test(n); });
    return hits.length === 1 ? hits[0] : null;
  }
  const parseVal = s => { s = String(s).trim().replace(/−/g, '-'); let m;
    if ((m = s.match(/^(-?\d+) (\d+)\/(\d+)$/))) return fadd(F(+m[1]), F(+m[2], +m[3]));
    if ((m = s.match(/^(-?\d+)\/(\d+)$/))) return F(+m[1], +m[2]);
    return fromDec(s); };
  const parseGiven = s => { const env = {}; for (const part of String(s).split(/\s+and\s+/)) { const m = part.match(/^\s*([a-zA-Z])\s*=\s*(.+?)\s*$/); if (m) env[m[1]] = parseVal(m[2]); } return env; };
  const gcdAll = ns => ns.reduce((g, n) => gcd(g, n), 0);
  const lcm2 = (a, b) => a / gcd(a, b) * b;

  /* ---------- words → expression ---------- */
  function words(s){
    s = String(s).trim().replace(/^"|"$/g, '').replace(/[."]+$/, '').trim();
    let m;
    const ci = s.indexOf(', ');
    if (ci > 0) { const L = s.slice(0, ci), R = s.slice(ci + 2);
      if ((m = R.match(/^plus (.+)$/))) return `(${words(L)}) + (${words(m[1])})`;
      if ((m = R.match(/^minus (.+)$/))) return `(${words(L)}) − (${words(m[1])})`;
      if ((m = R.match(/^divided by (.+)$/))) return `(${words(L)}) ÷ (${words(m[1])})`;
      if ((m = R.match(/^times (.+)$/))) return `(${words(L)}) × (${words(m[1])})`; }
    if ((m = s.match(/^(.+?) more than (.+)$/))) return `(${words(m[2])}) + (${words(m[1])})`;
    if ((m = s.match(/^(.+?) less than (.+)$/))) return `(${words(m[2])}) − (${words(m[1])})`;
    if ((m = s.match(/^the (sum|difference|product|quotient) of (.+?) and (.+)$/))) { const op = {sum:'+', difference:'−', product:'×', quotient:'÷'}[m[1]]; return `(${words(m[2])}) ${op} (${words(m[3])})`; }
    if ((m = s.match(/^(.+?) times (.+)$/))) return `(${words(m[1])}) × (${words(m[2])})`;
    if ((m = s.match(/^(.+?) divided by (.+)$/))) return `(${words(m[1])}) ÷ (${words(m[2])})`;
    if ((m = s.match(/^(.+?) decreased by (.+)$/))) return `(${words(m[1])}) − (${words(m[2])})`;
    if ((m = s.match(/^(.+?) increased by (.+)$/))) return `(${words(m[1])}) + (${words(m[2])})`;
    if ((m = s.match(/^(.+?) subtracted from (.+)$/))) return `(${words(m[2])}) − (${words(m[1])})`;
    if ((m = s.match(/^(.+?) added to (.+)$/))) return `(${words(m[2])}) + (${words(m[1])})`;
    if (/^(\d+(\.\d+)?|[a-z])$/.test(s)) return s;
    throw new Error('words? ' + s);
  }
  /* "which expression means these words" or "which words mean this expression" */
  function wordsQuestion(p){
    const vis = divs(p.visual)[0] || strip(p.visual);
    const q = vis.match(/"([^"]+)"/);
    if (q) { const target = parse(words(q[1])); return pickOpt(p, n => equiv(n, target)); }
    const target = parse(exprPart(vis));
    const hits = opts(p).filter(t => { try { return equiv(parse(words(t)), target); } catch (e) { return false; } });
    return hits.length === 1 ? hits[0] : null;
  }

  /* ---------- evaluating: the expression and the givens are in the picture ---------- */
  function evalSolver(p){
    const d = divs(p.visual), node = parse(exprPart(d[0])), env = parseGiven(d[1]);
    const r = ev(node, env); return fnum(r);
  }
  O.evalOne = evalSolver; O.evalExp = evalSolver; O.evalMulti = evalSolver; O.evalMultiFrac = evalSolver; O.evalWord = evalSolver;

  /* ---------- station 1: parts of expressions ---------- */
  O.exprParts = p => {
    const b = strip(p.bubble);
    let m;
    if ((m = b.match(/recipe is (.+?)\. How many terms/))) {   // terms: the parts joined by top-level + and −
      let n = unwrap(parse(m[1])), k = 1; while (n.t === 'bin' && (n.op === '+' || n.op === '-')) { k++; n = unwrap(n.a); } return k;
    }
    if ((m = b.match(/recipe is (.+?)\. What is the constant term/))) return fnum(linear(parse(m[1])).const);
    if ((m = b.match(/In (.+?), what is the coefficient of ([a-z])/))) return fnum(linear(parse(m[1]))[m[2]]);
    if ((m = b.match(/Which words describe (.+)\?$/))) {
      const root = unwrap(parse(m[1])), kind = root.t !== 'bin' ? null : {'*':'a product', '/':'a quotient', '+':'a sum', '-':'a difference', '^':'a power'}[root.op];
      const hits = opts(p).filter(t => kind && t.startsWith(kind + ' ')); return hits.length === 1 ? hits[0] : null;
    }
    return null;
  };

  /* ---------- station 2: value intuition ---------- */
  O.exprIntuition = p => {
    const b = strip(p.bubble); let m;
    if ((m = b.match(/If ([a-z]) gets bigger.*what happens to (.+)\?$/))) {
      const v = m[1], n = parse(m[2]), xs = [2, 3, 5, 8, 13].map(x => F(x)), ys = xs.map(x => fnum(ev(n, {[v]:x})));
      const up = ys.every((y, i) => !i || y > ys[i - 1]), down = ys.every((y, i) => !i || y < ys[i - 1]), flat = ys.every(y => y === ys[0]);
      const want = up ? 'It gets bigger' : down ? 'It gets smaller' : flat ? 'It stays the same' : null;
      return opts(p).includes(want) ? want : null;
    }
    if ((m = b.match(/greater: (.+) or (.+?)\?$/))) {
      const A = m[1].trim(), B = m[2].trim(), nA = parse(A), nB = parse(B);
      const v = [...new Set([...varsOf(nA), ...varsOf(nB)])][0];
      const xs = /greater than 1/.test(b) ? [F(3, 2), F(2), F(5), F(17)] : [F(1, 3), F(1), F(4), F(30)];
      const diffs = (v ? xs : [F(1)]).map(x => fnum(fsub(ev(nA, v ? {[v]:x} : {}), ev(nB, v ? {[v]:x} : {}))));
      const want = diffs.every(d => d > 0) ? A : diffs.every(d => d < 0) ? B : diffs.every(d => d === 0) ? opts(p).find(t => /equal/.test(t)) : null;
      return opts(p).includes(want) ? want : null;
    }
    return null;
  };

  /* ---------- station 3: writing expressions ---------- */
  /* when a test also asks for the value ("Then find its value when n = 6"), the key is that number: evaluate the
     chosen expression (or the words, turned into an expression) at the given value */
  const withValue = solve => p => {
    const shown = window.PetWorldMath.answerStepsFor(p), last = shown[shown.length - 1], pick = solve(p);
    if (!last || last.kind === 'choice' || pick == null) return pick;
    const m = strip(p.bubble).match(/when ([a-z]) = (\d+)/); if (!m) return null;
    const node = /[a-z]{2,}/.test(pick) ? parse(words(pick)) : parse(pick);   // a words choice, or an expression
    return fnum(ev(node, {[m[1]]:F(+m[2])}));
  };
  O.writeBasic = withValue(wordsQuestion);
  O.writeExpr = withValue(wordsQuestion);
  O.writeWord = withValue(p => {
    const s = strip(p.bubble).replace(/ Which expression.*$/, ''); let m, e = null;
    if ((m = s.match(/had (\d+) .+ and found ([a-z]) more/))) e = `${m[1]} + ${m[2]}`;
    else if ((m = s.match(/had (\d+) .+ and used ([a-z]) of them/))) e = `${m[1]} − ${m[2]}`;
    else if ((m = s.match(/Each potion uses (\d+) .+ makes ([a-z]) potions/))) e = `${m[1]} × ${m[2]}`;
    else if ((m = s.match(/shares (\d+) .+ equally among ([a-z]) cauldrons, then adds (\d+) more to each/))) e = `${m[1]} ÷ ${m[2]} + ${m[3]}`;
    else if ((m = s.match(/shares ([a-z]) .+ equally among (\d+) cauldrons/))) e = `${m[1]} ÷ ${m[2]}`;
    else if ((m = s.match(/has \$(\d+)\. Each bottle costs \$(\d+)\. .+ buys ([a-z]) bottles/))) e = `${m[1]} − ${m[2]} × ${m[3]}`;
    else if ((m = s.match(/cauldron holds (\d+) .+ adds (\d+) more to each of ([a-z]) cauldrons/))) e = `(${m[1]} + ${m[2]}) × ${m[3]}`;
    else if ((m = s.match(/pours (\d+) drops, then (\d+) drops for every spell ([a-z])/))) e = `${m[1]} + ${m[2]} × ${m[3]}`;
    else if ((m = s.match(/brews ([a-z]) bottles a day for (\d+) days, then gives away (\d+) bottles/))) e = `${m[2]} × ${m[1]} − ${m[3]}`;
    if (!e) return null;
    const target = parse(e); return pickOpt(p, n => equiv(n, target));
  });

  /* ---------- station 4: GCF and LCM ---------- */
  const visNums = p => (strip(p.visual).match(/\d+/g) || []).map(Number);
  O.gcf = p => gcdAll(visNums(p));
  O.lcm = p => visNums(p).reduce(lcm2);
  O.gcfLcmWord = p => {
    const story = strip(p.bubble).replace(/ Then: .*$/, ''), [a, b] = visNums(p);
    const isG = /greatest|largest|as long as possible/.test(story), isL = /least|again|same number|as many/.test(story);
    if (!isG && !isL) return null;
    const G = gcd(a, b), L = lcm2(a, b), ans = isG ? G : L;   // "greatest/largest" wins: a GCF story can also say "the same number of pets in each row"
    const then = (strip(p.bubble).match(/ Then: (.*)$/) || [])[1];
    if (!then) return ans;
    /* level 3's follow-up question, read from its wording */
    if (/go in each kit|rows of cats/.test(then)) return a / G;
    if (/go in each bag/.test(then)) return b / G;
    if (/tiles cover/.test(then)) return (a / G) * (b / G);
    if (/pieces are there in all/.test(then)) return a / G + b / G;
    if (/packs of feathers|first potion bubble|moonflowers be watered/.test(then)) return L / a;
    if (/laps has the faster pet/.test(then)) return L / Math.min(a, b);
    if (/stacks of lids/.test(then)) return L / b;
    return null;
  };
  /* factoring: the right choice is equivalent AND pulls out the GCF of the numbers */
  function factorPick(p, src){
    const target = parse(src), terms = [];
    const split = n => { n = unwrap(n); if (n.t === 'bin' && (n.op === '+' || n.op === '-')) { split(n.a); split(n.b); } else terms.push(n); };
    split(target);
    const G = gcdAll(terms.flatMap(t => Object.values(linear(t)).map(f => f[0]).filter(Boolean)));   // GCF of every term's number
    return pickOpt(p, n => { n = unwrap(n); const L = n.t === 'bin' && n.op === '*' ? unwrap(n.a) : null; return L && L.t === 'num' && feq(L.v, F(G)) && n.b.t === 'paren' && equiv(n, target); });
  }
  O.factorDist = p => { const m = strip(p.bubble).match(/Write (.+?) as the GCF/); return m ? factorPick(p, m[1]) : null; };

  /* ---------- station 5: distributive property ---------- */
  O.distVar = p => {
    const b = strip(p.bubble); let m;
    if ((m = b.match(/^Factor (.+?) using the greatest common factor/))) return factorPick(p, m[1]);
    if ((m = b.match(/^Rewrite (.+?) without parentheses/))) { const t = parse(m[1]); return pickOpt(p, n => !JSON.stringify(n).includes('paren') && equiv(n, t)); }
    return null;
  };
  O.factorEquiv = p => {
    const b = strip(p.bubble); let m;
    if ((m = b.match(/Fill in the blanks: (.+?) = (\d+)\( __([a-z]) \+ __ \)/))) {   // the last blank: the constant term ÷ the factor
      const lin = linear(parse(m[1])); return fnum(fdiv(lin.const, F(+m[2])));
    }
    if ((m = b.match(/Which expression is equivalent to (.+)\?$/))) { const t = parse(m[1]); return pickOpt(p, n => equiv(n, t)); }
    return null;
  };
  O.factorVar = p => { const m = strip(p.bubble).match(/^Factor (.+?) using the greatest common factor/); return m ? factorPick(p, m[1]) : null; };

  /* ---------- station 6: like terms, equivalent expressions ---------- */
  O.combineLike = p => {
    const b = strip(p.bubble); let m;
    if ((m = b.match(/Combine like terms: (.+?) = \?([a-z])\s*$/))) return fnum(linear(parse(m[1]))[m[2]]);
    if ((m = b.match(/Combine like terms: (.+)$/))) { const t = parse(m[1]);
      /* combined: equivalent, with one term per letter and at most one number */
      return pickOpt(p, n => equiv(n, t)); }
    return null;
  };
  O.equivExpr = p => { const m = strip(p.bubble).match(/equivalent to (.+)\?$/); if (!m) return null; const t = parse(m[1]); return pickOpt(p, n => equiv(n, t)); };
})();
