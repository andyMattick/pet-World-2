/* Independent answer checkers for the Market Stall (Unit 3: rates and percents), the Clock Tower (Unit 4: exponents and
   order of operations) and the Ice Rink (Unit 5: negative numbers). Loaded as a plain browser script by
   scripts/check-math.mjs. Each solver reads only what she sees (the story, the picture, the choices' text or picture, the
   question wording) and works the answer out with its own math: exact fractions and its own expression evaluator.
   It never reads p.ctx or a step's answer, eq, ok, mis or hint, or a worked prompt. */
(function(){
  const O = window.ORACLES = window.ORACLES || {};

  /* ---------- reading text ---------- */
  const strip = h => String(h || '').replace(/<[^>]*>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
  const norm = s => String(s).replace(/−/g, '-');
  const nums = s => (norm(s).match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const bub = p => strip(p.bubble);
  const choiceStep = p => p.steps.find(s => s.kind === 'choice');
  const optTexts = st => (st.options || []).map(o => o.text);
  const eqv = (a, b) => Math.abs(a - b) < 1e-9;
  const clean = v => Math.round(v * 1e9) / 1e9;

  /* ---------- exact fractions [p, q] ---------- */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const R = (p, q = 1) => { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q); return [p / g, q / g]; };
  const add = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const sub = (a, b) => R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
  const mul = (a, b) => R(a[0] * b[0], a[1] * b[1]);
  const div = (a, b) => { if (b[0] === 0) throw new Error('divide by 0'); return R(a[0] * b[1], a[1] * b[0]); };
  const pow = (a, e) => { let r = [1, 1]; for (let i = 0; i < e; i++) r = mul(r, a); return r; };
  const decR = s => { const [w, f = ''] = s.split('.'); return R(Number(w + f), Math.pow(10, f.length)); };
  const num = r => r[0] / r[1];

  /* one number as written: 7, −7, 2.5, −3/4, 1 1/2, −1 1/2, $4.40, −$52 */
  function readVal(s){
    let t = norm(strip(s)).replace(/\$/g, '').trim(), sign = 1;
    if (t.startsWith('-')) { sign = -1; t = t.slice(1).trim(); }
    let m;
    if ((m = t.match(/^(\d+) (\d+)\/(\d+)$/))) return sign * (+m[1] + m[2] / m[3]);
    if ((m = t.match(/^(\d+)\/(\d+)$/))) return sign * (m[1] / m[2]);
    if ((m = t.match(/^\d+(?:\.\d+)?$/))) return sign * Number(t);
    return NaN;
  }

  /* ---------- my own expression evaluator ----------
     + − × ÷, ( ) [ ], |abs|, unary minus, superscript exponents, n/d fraction literals, decimals; exact fractions. */
  const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  function tokens(src){
    const s = norm(src), out = [];
    for (let i = 0; i < s.length;) {
      const c = s[i];
      if (c === ' ') { i++; continue; }
      if (SUPS.includes(c)) { let e = ''; while (i < s.length && SUPS.includes(s[i])) e += SUPS.indexOf(s[i++]); out.push({sup:+e}); continue; }
      const m = s.slice(i).match(/^(\d+(?:\.\d+)?)(?:\/(\d+))?/);
      if (m && m[0]) { out.push({n:m[2] ? R(+m[1], +m[2]) : decR(m[1])}); i += m[0].length; continue; }
      if ('+-×÷()[]|*/'.includes(c)) { out.push({op:c === '*' ? '×' : c === '/' ? '÷' : c}); i++; continue; }
      throw new Error(`can't read "${c}" in ${src}`);
    }
    return out;
  }
  function evalExpr(src){
    const tk = tokens(src); let i = 0;
    const peek = () => tk[i], isOp = o => tk[i] && tk[i].op === o;
    const expr = () => { let v = term(); while (isOp('+') || isOp('-')) { const o = tk[i++].op, b = term(); v = o === '+' ? add(v, b) : sub(v, b); } return v; };
    const term = () => { let v = unary(); while (isOp('×') || isOp('÷')) { const o = tk[i++].op, b = unary(); v = o === '×' ? mul(v, b) : div(v, b); } return v; };
    const unary = () => { if (isOp('-')) { i++; return mul([-1, 1], unary()); } if (isOp('+')) { i++; return unary(); } return power(); };
    const power = () => { let v = primary(); while (peek() && peek().sup !== undefined) v = pow(v, tk[i++].sup); return v; };
    const primary = () => {
      const t = tk[i++]; if (!t) throw new Error('ran out: ' + src);
      if (t.n) return t.n;
      if (t.op === '(' || t.op === '[') { const v = expr(); const c = tk[i++]; if (!c || c.op !== (t.op === '(' ? ')' : ']')) throw new Error('bad grouping: ' + src); return v; }
      if (t.op === '|') { const v = expr(); const c = tk[i++]; if (!c || c.op !== '|') throw new Error('bad bars: ' + src); return [Math.abs(v[0]), v[1]]; }
      throw new Error('unexpected ' + JSON.stringify(t) + ' in ' + src);
    };
    const v = expr(); if (i !== tk.length) throw new Error('left over in ' + src); return v;
  }
  const ev = s => num(evalExpr(s));
  const cmpSym = (a, b) => eqv(a, b) ? '=' : a > b ? '>' : '<';
  /* "a < b", "x > y" style statements with a variable lookup */
  function truth(stmt, vars = {}){
    const m = norm(stmt).match(/^(.*?)\s*(<=|>=|<|>|=)\s*(.*)$/); if (!m) return null;
    const sv = s => ev(s.replace(/[a-z]/g, ch => vars[ch] !== undefined ? `(${vars[ch]})` : ch));
    const a = sv(m[1]), b = sv(m[3]);
    return {'<':a < b - 1e-12, '>':a > b + 1e-12, '=':eqv(a, b), '<=':a <= b + 1e-12, '>=':a >= b - 1e-12}[m[2]];
  }

  /* ---------- reading pictures ---------- */
  const countOn = svg => (String(svg).match(/class="fb-on"/g) || []).length;
  const countRects = svg => (String(svg).match(/<rect /g) || []).length;
  /* a number line SVG → {dots:[{x, name}], at(x) → value} using its own labels and tick marks */
  function readLine(svg){
    svg = String(svg);
    const texts = [...svg.matchAll(/<text x="([-\d.e]+)" y="[-\d.e]+" class="([^"]*)">([^<]*)<\/text>/g)].map(m => ({x:+m[1], cls:m[2], t:m[3]}));
    const labels = texts.filter(t => !/nl-name/.test(t.cls) && t.t.trim() !== '').map(t => ({x:t.x, v:readVal(t.t)})).filter(l => !isNaN(l.v));
    const dots = [...svg.matchAll(/<circle cx="([-\d.e]+)" cy="[-\d.e]+" r="[\d.]+" class="nl-dot"\/>/g)].map(m => ({x:+m[1]}));
    texts.filter(t => /nl-name/.test(t.cls)).forEach(t => { const d = dots.find(d => Math.abs(d.x - t.x) < 1e-6 && d.name === undefined); if (d) d.name = strip(t.t); });
    let at;
    const uniq = labels.filter((l, k) => labels.findIndex(m => Math.abs(m.x - l.x) < 1e-6) === k);
    if (uniq.length >= 2) {
      const a = uniq[0], b = uniq[uniq.length - 1];
      at = x => clean(a.v + (x - a.x) * (b.v - a.v) / (b.x - a.x));
    } else {
      /* only 0 is labeled: the tall ticks are whole numbers, so the gap between two tall ticks is 1 */
      const ticks = [...svg.matchAll(/<line x1="([-\d.e]+)" y1="([-\d.e]+)" x2="\1" y2="([-\d.e]+)" class="nl-line"\/>/g)].map(m => ({x:+m[1], h:Math.abs(m[3] - m[2])}));
      const tall = Math.max(...ticks.map(t => t.h)), xs = ticks.filter(t => t.h === tall).map(t => t.x).sort((a, b) => a - b);
      const unit = xs[1] - xs[0], zero = uniq.find(l => l.v === 0);
      if (!zero || !(unit > 0)) return null;
      at = x => clean((x - zero.x) / unit);
    }
    dots.forEach(d => { d.v = at(d.x); });
    return {dots, at};
  }
  const byName = (line, name) => (line.dots.find(d => d.name === name) || {}).v;
  const pickOpt = (st, test) => { const hits = st.options.filter(test); return hits.length === 1 ? hits[0].text : hits.length ? '__several_right__' : '__none_right__'; };
  const listVals = s => strip(s).split(/,\s*/).map(x => readVal(x));
  const sortedSame = (opt, vals, dir = 1) => {
    const ov = listVals(opt); if (ov.some(isNaN) || ov.length !== vals.length) return false;
    const a = [...ov].sort((x, y) => x - y), b = [...vals].sort((x, y) => x - y);
    if (!a.every((v, k) => eqv(v, b[k]))) return false;
    for (let k = 1; k < ov.length; k++) if (dir * (ov[k] - ov[k - 1]) <= 0) return false;
    return true;
  };

  /* ================= MARKET STALL ================= */
  const money = s => (norm(s).match(/\$\d+(?:\.\d+)?/g) || []).map(t => Number(t.slice(1)));

  O.unitRate = p => {   // N things cost $T → price of 1 = T ÷ N
    const b = bub(p), [n] = nums(b.replace(/\$\d+(?:\.\d+)?/g, '')), [t] = money(b);
    return clean(t / n);
  };
  O.rateProblems = p => {
    const b = bub(p), $ = money(b), counts = nums(b.replace(/\$\d+(?:\.\d+)?/g, ''));
    const unit = $[0] / counts[0];
    if (/How many .* can you buy with/.test(b)) return clean($[1] / unit);
    return clean(unit * counts[1]);   // How much do M cost?
  };
  O.compareRates = p => {
    const b = bub(p), st = choiceStep(p);
    let m;
    if ((m = b.match(/^(\w+) ran (\d+) meters in (\d+) seconds\. (\w+) ran (\d+) meters in (\d+) seconds\./))) {
      const s1 = m[2] / m[3], s2 = m[5] / m[6];
      if (eqv(s1, s2)) return null;
      const who = s1 > s2 ? m[1] : m[4];
      return pickOpt(st, o => o.text === who);
    }
    m = norm(b).match(/Stall A sells (\d+) .*? for \$(\d+(?:\.\d+)?)\. Stall B sells (\d+) .*? for \$(\d+(?:\.\d+)?)\./);
    const a = m[2] / m[1], bb = m[4] / m[3];
    if (eqv(a, bb)) return null;
    return pickOpt(st, o => o.text === (a < bb ? 'Stall A' : 'Stall B'));
  };
  O.introPercent = p => {
    const b = bub(p);
    if (/What percent of the grid is shaded/.test(b)) return countOn(p.visual) * 100 / countRects(p.visual);
    let m;
    if ((m = b.match(/Of (\d+) \w+ in the crate, (\d+) are ripe.*not ripe/))) return (m[1] - m[2]) * 100 / m[1];
    m = b.match(/(\d+) of the (\d+) /);
    return clean(m[1] * 100 / m[2]);
  };
  O.pctModel = p => {   // the shaded parts over the parts in one bar (one whole), as a percent
    const perBar = (String(p.visual).match(/<rect x="[\d.]+" y="1" /g) || []).length;
    return clean(countOn(p.visual) * 100 / perBar);
  };
  O.pctVisual = p => {
    const b = bub(p); let m;
    if ((m = b.match(/What is (\d+)% of (\d+)\?/))) return clean(m[1] * m[2] / 100);
    if ((m = b.match(/(\d+) \w+ are (\d+)% of the bin/))) return clean(m[1] * 100 / m[2]);
    m = b.match(/(\d+) of the (\d+) \w+ are on sale/);
    return clean(m[1] * 100 / m[2]);
  };
  O.pctConvert = p => {
    const b = bub(p); let m;
    if ((m = b.match(/Write (\d+(?:\.\d+)?) as a percent/))) return clean(m[1] * 100);
    if ((m = b.match(/(\d+)\/(\d+) of the \w+ are sold\. What percent/))) return clean(m[1] * 100 / m[2]);
    m = b.match(/(\d+)%/);   // a percent → a decimal or a fraction: both are that many hundredths
    return clean(m[1] / 100);
  };
  O.pctEquivalent = p => {
    const b = bub(p), m = b.match(/(\d+)% of (?:the |last year's )?(\d+) baskets/), P = +m[1], N = +m[2], part = num(mul(R(P, 100), [N, 1]));
    if (/Then find it/.test(b)) return clean(part);
    return pickOpt(choiceStep(p), o => { try { return eqv(ev(o.text), part); } catch (e) { return false; } });
  };
  O.benchmarkPct = p => { const m = bub(p).match(/What is (\d+)% of (\d+)\?/); return clean(m[1] * m[2] / 100); };
  O.findingPct = p => {
    const b = bub(p); let m;
    if ((m = b.match(/Which bar is (\d+)% shaded/))) return pickOpt(choiceStep(p), o => eqv(countOn(o.html) * 100 / countRects(o.html), +m[1]));
    if ((m = b.match(/^What is (\d+)% of (\d+)\?/))) return clean(m[1] * m[2] / 100);
    if ((m = b.match(/^(\d+) is what percent of (\d+)\?/))) return clean(m[1] * 100 / m[2]);
    m = b.match(/^(\d+) is (\d+)% of what number\?/);
    return clean(m[1] * 100 / m[2]);
  };
  O.pctWord = p => {
    const b = bub(p); let m;
    if ((m = b.match(/had (\d+) \w+\. \w+ sold (\d+)% of them/))) return clean(m[1] * m[2] / 100);
    if ((m = b.match(/A \$(\d+) basket is (\d+)% off\. How many dollars do you save/))) return clean(m[1] * m[2] / 100);
    if ((m = b.match(/picked (\d+) \w+, and (\d+) of them were too small.*What percent/))) return clean(m[2] * 100 / m[1]);
    m = b.match(/sold (\d+) \w+ on Saturday\. That was (\d+)% of all/);
    return clean(m[1] * 100 / m[2]);
  };

  /* ================= CLOCK TOWER ================= */
  const hasSup = s => [...String(s)].some(c => SUPS.includes(c));
  O.expMeaning = p => {
    const b = bub(p); let m;
    if ((m = b.match(/: ([\d × ]+)\. Write it as a power/))) {
      const v = ev(m[1]);
      return pickOpt(choiceStep(p), o => hasSup(o.text) && eqv(ev(o.text), v));
    }
    if ((m = b.match(/What does (\S+) mean\?/))) return ev(m[1]);
    if ((m = b.match(/^What is (\S+)\?$/))) return ev(m[1]);
    m = b.match(/^(\d+) to what power is (\d+)\?/);
    let e = 0, v = 1; while (v < +m[2] && e < 40) { v *= +m[1]; e++; }
    return v === +m[2] ? e : '__not_a_power__';
  };
  O.powWhole = p => ev(bub(p).match(/rings (\S+) times/)[1]);
  O.powFrac = p => clean(ev(bub(p).match(/^What is (.+)\?$/)[1]));
  const ooAnswer = p => clean(ev(bub(p).match(/What is (.+)\?$/)[1]));
  O.orderNoExp = ooAnswer;
  O.orderOps = ooAnswer;
  O.orderFracExp = ooAnswer;
  O.compareExp = p => { const m = bub(p).match(/Which is bigger: (.+) or (.+)\?$/); return pickOpt(choiceStep(p), o => o.text === cmpSym(ev(m[1]), ev(m[2]))); };

  /* ================= ICE RINK ================= */
  /* the sign a situation stands for, from its words */
  function storySign(s){
    s = String(s);
    const neg = [/below/, /owes her brother/, /took \$?\d+ out of/, /lost \d+/, /went down/, /steps down/, /spent/];
    const pos = [/above/, /brother owes her/, /put \$?\d+ into/, /gained \d+/, /went up/, /steps up/, /earned/];
    const n = neg.some(r => r.test(s)), q = pos.some(r => r.test(s));
    return n && !q ? -1 : q && !n ? 1 : 0;
  }
  const storyVal = s => { const k = storySign(s), [n] = nums(s); return k ? k * n : NaN; };
  O.negIntro = p => {
    const b = bub(p); let m;
    if ((m = b.match(/^Which one does (\S+) describe\?/))) { const v = readVal(m[1]); return pickOpt(choiceStep(p), o => eqv(storyVal(o.text), v)); }
    if ((m = b.match(/the opposite situation: (.+)$/))) return storyVal(m[1]);
    return storyVal(b.replace(/What number stands for that\?/, ''));
  };
  const dotValue = p => { const L = readLine(p.visual); return L && L.dots.length === 1 ? L.dots[0].v : null; };
  O.negLine = p => {
    const b = bub(p), m = b.match(/Which point is at (\S+)\?/);
    if (m) { const v = readVal(m[1]), L = readLine(p.visual); return pickOpt(choiceStep(p), o => eqv(byName(L, o.text), v)); }
    return dotValue(p);
  };
  O.opposites = p => {
    const b = bub(p); let m;
    if ((m = b.match(/What is the opposite of (\S+)\?/))) return -readVal(m[1]);
    return ev(b.match(/^What is (.+)\?$/)[1]);
  };
  O.negSymbol = p => {
    const b = bub(p); let m;
    if (/Which point is at .a\?/.test(b)) { const L = readLine(p.visual), a = byName(L, 'a'); return pickOpt(choiceStep(p), o => eqv(byName(L, o.text), -a)); }
    if ((m = b.match(/^If (\w) = (\S+), what is (.+)\?$/))) return ev(m[3].replace(new RegExp(m[1], 'g'), `(${norm(m[2])})`));
    m = b.match(/^(\w) is a (negative|positive) number\. Is .\w positive or negative\?/);
    return pickOpt(choiceStep(p), o => o.text === (m[2] === 'negative' ? 'positive' : 'negative'));
  };
  O.negDecLine = dotValue;
  O.negFracLine = p => { const v = dotValue(p); return pickOpt(choiceStep(p), o => eqv(readVal(o.text), v)); };
  O.cmpLine = p => {   // compare the two dots on the line; the bubble names them
    const m = bub(p).match(/Compare (\S+) and (\S+)\.$/), a = readVal(m[1]), c = readVal(m[2]), L = readLine(p.visual);
    const da = byName(L, m[1]), dc = byName(L, m[2]);
    if (da !== undefined && !eqv(da, a) || dc !== undefined && !eqv(dc, c)) return '__dot_not_at_its_label__';
    return pickOpt(choiceStep(p), o => o.text === cmpSym(a, c));
  };
  O.cmpRational = p => {
    const b = bub(p), st = choiceStep(p); let m;
    if ((m = b.match(/Which number line shows (\S+) and (\S+) in the right places\?/))) {
      const a = readVal(m[1]), c = readVal(m[2]);
      return pickOpt(st, o => { const L = readLine(o.html); return L && eqv(byName(L, m[1]), a) && eqv(byName(L, m[2]), c); });
    }
    m = b.match(/Which is greater: (\S+(?: \d+\/\d+)?) or (\S+(?: \d+\/\d+)?)\?$/);
    return pickOpt(st, o => o.text === cmpSym(readVal(m[1]), readVal(m[2])));
  };
  O.numIneq = p => {
    const b = norm(bub(p)), st = choiceStep(p); let m;
    if ((m = b.match(/temperature t is (colder|warmer) than (-?\d+)°F/))) {
      const c = +m[2], op = m[1] === 'colder' ? '<' : '>';
      return pickOpt(st, o => { const k = norm(o.text).match(/^t ([<>=]) (-?\d+)$/); return k && k[1] === op && +k[2] === c; });
    }
    m = b.match(/It is (-?\d+)°F at (.+?) and (-?\d+)°F at (.+?)\. (.+?) is (colder|warmer)\./);
    const t1 = +m[1], t2 = +m[3], who = m[5].toLowerCase() === m[2].toLowerCase() ? t1 : t2, other = who === t1 ? t2 : t1;
    if ((m[6] === 'colder') !== (who < other)) return '__story_wrong__';
    const want = m[6] === 'colder' ? '<' : '>';   // "colder" is written with <, "warmer" with >
    return pickOpt(st, o => truth(o.text) && norm(o.text).includes(want) && nums(o.text).sort((x, y) => x - y).join() === [t1, t2].sort((x, y) => x - y).join());
  };
  O.orderSmallNeg = p => {
    const b = bub(p); let m;
    if ((m = b.match(/Which number is the (least|greatest): (.+)\?$/))) { const v = listVals(m[2]); return m[1] === 'least' ? Math.min(...v) : Math.max(...v); }
    m = b.match(/from (least to greatest|greatest to least): (.+)\.$/);
    const vals = listVals(m[2]), dir = m[1] === 'least to greatest' ? 1 : -1;
    return pickOpt(choiceStep(p), o => sortedSame(o.text, vals, dir));
  };
  O.orderNeg = p => { const vals = listVals(bub(p).match(/least to greatest: (.+)\.$/)[1]); return pickOpt(choiceStep(p), o => sortedSame(o.text, vals, 1)); };
  O.absMeaning = p => {
    const b = bub(p); let m;
    if (/How far is the dot from 0\?/.test(b)) { const v = dotValue(p); return v == null ? null : Math.abs(v); }
    if ((m = b.match(/Which numbers have an absolute value of (\d+)\?/))) {
      const k = +m[1];
      return pickOpt(choiceStep(p), o => { const [yes, no = ''] = norm(o.text).split(/but not/); const inc = nums(yes).sort((x, y) => x - y).join(), exc = nums(no);
        return inc === [-k, k].join() && !exc.some(x => Math.abs(x) === k); });
    }
    m = b.match(/statement about \|(\S+)\| is true/);
    const d = Math.abs(readVal(m[1]));
    return pickOpt(choiceStep(p), o => { const k = norm(o.text).match(/[Ii]t is (?:the distance from (-?\d+) to (-?\d+), so it is )?(-?\d+)/);
      if (!k) return false; if (k[1] !== undefined && Math.abs(k[1] - k[2]) !== +k[3]) return false;   // the distance it names has to be right
      return k[1] !== undefined && +k[2] === 0 && +k[3] === d || k[1] === undefined && +k[3] === d; });
  };
  O.absVal = p => clean(ev(bub(p).match(/^What is (.+)\?$/)[1]));
  O.cmpAbs = p => {
    const b = bub(p); let m;
    if ((m = b.match(/^Compare (\S+) and (\S+)\.$/))) return pickOpt(choiceStep(p), o => o.text === cmpSym(ev(m[1]), ev(m[2])));
    const items = b.match(/least to greatest: (.+)\.$/)[1].split(/,\s*/), vals = items.map(ev);
    return pickOpt(choiceStep(p), o => { const parts = o.text.split(/,\s*/); if ([...parts].sort().join('|') !== [...items].sort().join('|')) return false;
      const v = parts.map(ev); for (let k = 1; k < v.length; k++) if (v[k] <= v[k - 1]) return false; return v.length === vals.length; });
  };
  O.cmpAbs2 = p => {
    const b = bub(p); let m;
    if ((m = b.match(/Compare (\S+) and (\S+)\.$/))) {
      const L = readLine(p.visual), vars = {p:byName(L, 'p'), q:byName(L, 'q')};
      const val = s => ev(s.replace(/[pq]/g, c => `(${vars[c]})`));
      return pickOpt(choiceStep(p), o => o.text === cmpSym(val(m[1]), val(m[2])));
    }
    /* "must be true": try many numbers that fit the givens, keep the choice true for all of them */
    const given = [];
    if (/x and y are negative numbers/.test(b)) given.push((x, y) => x < 0 && y < 0);
    if (/x is negative/.test(b)) given.push(x => x < 0);
    if (/y is positive/.test(b)) given.push((x, y) => y > 0);
    if ((m = b.match(/, and ([^.]+)\. Which must be true/)) || (m = b.match(/x is negative and ([^.]+)\. Which must be true/))) { const c = m[1]; given.push((x, y) => truth(c, {x, y})); }
    const pairs = []; for (let x = -12; x <= 12; x += 0.5) for (let y = -12; y <= 12; y += 0.5) if (given.every(g => g(x, y))) pairs.push([x, y]);
    if (!pairs.length) return '__no_numbers_fit__';
    return pickOpt(choiceStep(p), o => pairs.every(([x, y]) => truth(o.text, {x, y})));
  };
  O.absWord = p => {
    const b = bub(p); let m;
    if ((m = b.match(/The number is (\S+)\. How far is that from 0\?/))) return Math.abs(readVal(m[1]));
    if ((m = b.match(/A diver is at (\S+) meters and a bird is at (\S+) meters/))) {
      const d = Math.abs(readVal(m[1])), h = Math.abs(readVal(m[2]));
      return d === h ? null : pickOpt(choiceStep(p), o => o.text === (d > h ? 'The diver' : 'The bird'));
    }
    m = b.match(/debt of more than \$(\d+)/);   // a debt of more than $L is a balance below −$L
    return pickOpt(choiceStep(p), o => readVal(o.text) < -m[1]);
  };
})();
