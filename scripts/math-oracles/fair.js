/* Independent answer checkers for the Pet Fair (Khan unit 7: equations and inequalities).
   Loaded by scripts/check-math.mjs as a plain browser script. Each oracle reads only what the student sees (the story,
   the picture, the choices) and works the answer out with its own exact-fraction expression engine. It never reads
   p.ctx or any step's answer / eq / ok / mis / hint, and never a step prompt that contains '=' (with one exception:
   ineqWord level 2 asks "Does h = 45 work?", and the value 45 is shown only in that question, so it is read there). */
(function () {
  const O = window.ORACLES = window.ORACLES || {};

  /* ---------- exact rationals [n, d], d > 0 ---------- */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const R = (n, d = 1) => { if (d === 0) throw new Error('divide by 0'); if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
  const add = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const sub = (a, b) => R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
  const mul = (a, b) => R(a[0] * b[0], a[1] * b[1]);
  const div = (a, b) => R(a[0] * b[1], a[1] * b[0]);
  const eqR = (a, b) => a[0] === b[0] && a[1] === b[1];
  const num = a => a[0] / a[1];
  const decR = s => { const [w, f = ''] = s.split('.'); return R(Number(w + f), Math.pow(10, f.length)); };
  const parseNum = s => { s = String(s).trim().replace(/−/g, '-'); const neg = s.startsWith('-'); if (neg) s = s.slice(1).trim(); let m, r;
    if ((m = s.match(/^(\d+) (\d+)\/(\d+)$/))) r = add(R(+m[1]), R(+m[2], +m[3])); else if ((m = s.match(/^(\d+)\/(\d+)$/))) r = R(+m[1], +m[2]); else r = decR(s);
    return neg ? R(-r[0], r[1]) : r; };

  /* ---------- expression parser: numbers (decimals, a/b, mixed a b/c), one-letter variables, + − × ÷, parens, implicit × ---------- */
  function tokenize(s) {
    s = String(s).replace(/\$/g, '').replace(/−/g, '-').replace(/\s+/g, ' ').trim();
    const t = []; let i = 0, m;
    while (i < s.length) {
      const rest = s.slice(i);
      if (rest[0] === ' ') { i++; continue; }
      if ((m = rest.match(/^(\d+) (\d+)\/(\d+)(?![\d.])/))) { t.push({n:add(R(+m[1]), R(+m[2], +m[3]))}); i += m[0].length; continue; }
      if ((m = rest.match(/^(\d+)\/(\d+)/))) { t.push({n:R(+m[1], +m[2])}); i += m[0].length; continue; }
      if ((m = rest.match(/^\d+(\.\d+)?/))) { t.push({n:decR(m[0])}); i += m[0].length; continue; }
      if (/^[a-z]/i.test(rest)) { t.push({v:rest[0]}); i++; continue; }
      if ('+-×÷*/()'.includes(rest[0])) { t.push({op:{'*':'×', '/':'÷'}[rest[0]] || rest[0]}); i++; continue; }
      throw new Error(`bad char ${rest[0]} in ${s}`);
    }
    return t;
  }
  function parse(s) {
    const t = tokenize(s); let i = 0;
    const peek = () => t[i], isOp = o => t[i] && t[i].op === o;
    function expr() { let a = term(); while (isOp('+') || isOp('-')) { const o = t[i++].op, b = term(); const l = a; a = o === '+' ? env => add(l(env), b(env)) : env => sub(l(env), b(env)); } return a; }
    function term() { let a = factor(); while (isOp('×') || isOp('÷')) { const o = t[i++].op, b = factor(); const l = a; a = o === '×' ? env => mul(l(env), b(env)) : env => div(l(env), b(env)); } return a; }
    function factor() {
      if (isOp('-')) { i++; const f = factor(); return env => sub(R(0), f(env)); }
      let a = primary();
      while (peek() && (peek().v || isOp('('))) { const b = primary(), l = a; a = env => mul(l(env), b(env)); }   // 3x, 2(x + 1), (3/4)x
      return a;
    }
    function primary() {
      const k = t[i++];
      if (!k) throw new Error(`unexpected end in ${s}`);
      if (k.n) return () => k.n;
      if (k.v) return env => { if (!(k.v in env)) throw new Error(`no value for ${k.v}`); return env[k.v]; };
      if (k.op === '(') { const e = expr(); if (!isOp(')')) throw new Error(`missing ) in ${s}`); i++; return e; }
      throw new Error(`unexpected ${JSON.stringify(k)} in ${s}`);
    }
    const e = expr(); if (i !== t.length) throw new Error(`junk at end of ${s}`); return e;
  }
  const evalAt = (s, env = {}) => parse(s)(env);
  const eqn = s => { const sides = String(s).split('='); if (sides.length !== 2) throw new Error(`not an equation: ${s}`); return [parse(sides[0]), parse(sides[1])]; };
  /* does the equation hold for these variable values? */
  const holds = (s, env) => { try { const [l, r] = eqn(s); return eqR(l(env), r(env)); } catch (e) { return false; } };
  /* solve a one-variable linear equation in x exactly */
  function solve(s) {
    const [l, r] = eqn(s), D = t => sub(l({x:t}), r({x:t}));
    const d0 = D(R(0)), m = sub(D(R(1)), d0);
    if (m[0] === 0) throw new Error(`not solvable: ${s}`);
    const x = div(R(-d0[0], d0[1]), m);
    if (D(x)[0] !== 0 || D(R(7, 3))[0] !== add(d0, mul(m, R(7, 3)))[0]) throw new Error(`not linear: ${s}`);
    return x;
  }
  /* An equation matches a picture or story when its two sides, as functions of x, are the two quantities the picture
     sets equal (either order). Same solution is not enough: x + 2 = 4 and 2x = 4 share x = 2 but say different things. */
  const TESTS = [R(0), R(1), R(2), R(3), R(7, 2), R(5), R(11), R(13, 3)];
  const sameFn = (f, g) => TESTS.every(t => { try { return eqR(f(t), g(t)); } catch (e) { return false; } });
  function matchesPair(s, pairs) {
    let l, r; try { [l, r] = eqn(s); } catch (e) { return false; }
    const L = t => l({x:t}), Rt = t => r({x:t});
    return pairs.some(([a, b]) => (sameFn(L, a) && sameFn(Rt, b)) || (sameFn(L, b) && sameFn(Rt, a)));
  }
  const sidesOf = s => { const [l, r] = eqn(s); return [t => l({x:t}), t => r({x:t})]; };
  /* the option (by text) that matches; flag ties so they show up as mismatches */
  function pickRelation(step, pairs) {
    const hits = step.options.filter(o => matchesPair(o.text, pairs));
    return hits.length === 1 ? hits[0].text : `AMBIGUOUS(${hits.map(o => o.text).join(' | ')})`;
  }
  const only = (arr, what) => arr.length === 1 ? arr[0] : `AMBIGUOUS ${what}: ${arr.join(' | ')}`;

  /* ---------- reading the page ---------- */
  const dom = h => new DOMParser().parseFromString(`<body>${h || ''}</body>`, 'text/html').body;
  const txt = h => dom(h).textContent.replace(/\s+/g, ' ').trim();
  const choiceSteps = p => p.steps.filter(s => s.kind === 'choice');
  const lastChoice = p => { const c = choiceSteps(p); return c[c.length - 1]; };
  const lastStep = p => p.steps[p.steps.length - 1];
  const N = s => num(parseNum(s));
  const INEQ = /([a-z])\s*(>|<|≥|≤)\s*(−?\d+)/;
  const ineqHolds = (v, op, c) => op === '>' ? v > c : op === '<' ? v < c : op === '≥' ? v >= c : v <= c;
  const WORD_OP = {'more than':'>', 'less than':'<', 'at least':'≥', 'at most':'≤'};

  /* a bar model SVG → the equal pairs it shows: (sum of the parts, whole), (whole − the other parts, one part),
     and with equal parts (whole ÷ count, one part) */
  function barPairs(html) {
    const svg = dom(html).querySelector('svg'), kids = [...svg.children];
    const parts = [], total = [];
    kids.forEach((el, i) => { if (el.tagName.toLowerCase() !== 'text') return; const prev = kids[i - 1]?.tagName.toLowerCase(); (prev === 'rect' ? parts : prev === 'path' ? total : []).push(el.textContent.trim()); });
    if (total.length !== 1 || !parts.length) throw new Error('bar model not read');
    const P = parts.map(lab => t => evalAt(lab, {x:t})), W = t => evalAt(total[0], {x:t});
    const sum = fs => t => fs.reduce((s, f) => add(s, f(t)), R(0));
    const pairs = [[sum(P), W]];
    P.forEach((f, i) => pairs.push([t => sub(W(t), sum(P.filter((_, j) => j !== i))(t)), f]));
    if (parts.every(l => l === parts[0]) && parts.length > 1) pairs.push([t => div(W(t), R(parts.length)), P[0]]);
    return pairs;
  }
  /* a hanger → the relation (left) − (right), with 🟧 = x and 🟣 = 1 */
  function hangerSides(html) {
    const sides = [...dom(html).querySelectorAll('div')].filter(d => /flex:\s*1/.test(d.getAttribute('style') || ''));
    if (sides.length !== 2) throw new Error('hanger not read');
    return sides.map(d => { const s = d.textContent; return {sq:(s.match(/🟧/g) || []).length, dot:(s.match(/🟣/g) || []).length}; });
  }
  /* a number-line inequality SVG → {op, c} from the circle, its fill, and the ray */
  function readIneqSVG(html) {
    const svg = dom(html).querySelector('svg');
    const labels = [...svg.querySelectorAll('text')].map(t => ({x:+t.getAttribute('x'), v:N(t.textContent)}));
    if (labels.length < 2) throw new Error('no labels');
    const [a, b] = [labels[0], labels[labels.length - 1]], val = X => a.v + (X - a.x) * (b.v - a.v) / (b.x - a.x);
    const circ = svg.querySelector('circle'), cx = +circ.getAttribute('cx'), closed = /nl-dot/.test(circ.getAttribute('class')) && !/nl-open/.test(circ.getAttribute('class'));
    const c = val(cx); if (Math.abs(c - Math.round(c)) > 1e-6) throw new Error('circle between ticks');
    const ray = svg.querySelector('line.nl-ray'), right = +ray.getAttribute('x2') > +ray.getAttribute('x1');
    return {op:right ? (closed ? '≥' : '>') : (closed ? '≤' : '<'), c:Math.round(c)};
  }
  /* pick the graph option showing op c */
  const pickGraph = (step, op, c) => only(step.options.filter(o => { const g = readIneqSVG(o.html); return g.op === op && g.c === c; }).map(o => o.text), 'graphs');
  /* an x/y table → [{x, y}] (y may be '?') */
  function readTable(html) {
    const rows = [...dom(html).querySelectorAll('tr')].map(tr => [...tr.querySelectorAll('td')].map(td => td.textContent.trim()));
    return rows[0].map((x, i) => ({x:N(x), y:rows[1][i] === '?' ? '?' : N(rows[1][i])}));
  }
  /* a first-quadrant graph → its dots as {x, y}, using the axis numbers to set the scale */
  function readQ1(html) {
    const svg = dom(html).querySelector('svg'), nums = [...svg.querySelectorAll('text.grid-num')];
    const xl = nums.filter(t => t.getAttribute('text-anchor') !== 'end').map(t => ({p:+t.getAttribute('x'), v:+t.textContent}));
    const yl = nums.filter(t => t.getAttribute('text-anchor') === 'end').map(t => ({p:+t.getAttribute('y'), v:+t.textContent}));
    const lin = (L, p) => { const [a, b] = [L[0], L[L.length - 1]]; return a.v + (p - a.p) * (b.v - a.v) / (b.p - a.p); };
    const yOff = 4;   // the y labels sit 4px below their grid line (text baseline); find it from the x-axis label for 0 instead of trusting it
    const y0 = yl.find(l => l.v === 0), xAxisY = +svg.querySelector('line.axis-line').getAttribute('y1'), off = y0 ? y0.p - xAxisY : yOff;
    const ylAdj = yl.map(l => ({p:l.p - off, v:l.v}));
    return [...svg.querySelectorAll('circle')].map(c => ({x:Math.round(lin(xl, +c.getAttribute('cx')) * 1e6) / 1e6, y:Math.round(lin(ylAdj, +c.getAttribute('cy')) * 1e6) / 1e6}));
  }
  const fitsAll = (s, pts) => pts.every(pt => holds(s, {x:R(Math.round(pt.x * 1000), 1000), y:R(Math.round(pt.y * 1000), 1000)}));

  /* ================= station 1: Ticket Booth ================= */
  O.testSol = p => {
    const b = txt(p.bubble); let m;
    if ((m = b.match(/^Is x = (\S+) a solution of (.+)\?$/))) return holds(m[2], {x:parseNum(m[1])}) ? 'Yes' : 'No';
    if ((m = b.match(/^Which value of x makes (.+) true\?$/))) return only(lastChoice(p).options.filter(o => holds(m[1], {x:parseNum(o.text.replace(/^x = /, ''))})).map(o => o.text), 'values');
    throw new Error('unread: ' + b);
  };
  O.tapeEq = (p, lvl) => {
    const pairs = barPairs(p.visual);
    if (lastStep(p).kind === 'choice') return pickRelation(lastStep(p), pairs);
    const [a, b] = pairs[0], d0 = sub(a(R(0)), b(R(0))), slope = sub(sub(a(R(1)), b(R(1))), d0);   // solve parts = whole (linear)
    return num(div(R(-d0[0], d0[1]), slope));
  };
  O.hangerEq = p => { const [L, Rt] = hangerSides(p.visual); return pickRelation(lastChoice(p), [[t => add(mul(R(L.sq), t), R(L.dot)), t => add(mul(R(Rt.sq), t), R(Rt.dot))]]); };
  O.visualSolve = p => { const [L, Rt] = hangerSides(p.visual); return num(div(R(Rt.dot - L.dot), R(L.sq - Rt.sq))); };

  /* ================= station 2: Ring Toss ================= */
  const solveBubble = p => { const m = txt(p.bubble).match(/^Solve (.+)\.$/); if (!m) throw new Error('unread: ' + txt(p.bubble)); return num(solve(m[1])); };
  O.oneStepAdd = solveBubble;
  O.oneStepAddFrac = solveBubble;
  O.oneStepMultFrac = solveBubble;
  O.oneStepMult = p => {
    const b = txt(p.bubble); let m;
    if ((m = b.match(/^Which bar model shows (.+)\?$/))) {
      const want = sidesOf(m[1]);   // the bar model that sets the equation's two sides equal
      const hits = lastChoice(p).options.filter(o => { try { return barPairs(o.html).some(([a, c]) => (sameFn(a, want[0]) && sameFn(c, want[1])) || (sameFn(a, want[1]) && sameFn(c, want[0]))); } catch (e) { return false; } });
      return only(hits.map(o => o.text), 'bar models');
    }
    return solveBubble(p);
  };

  /* ================= station 3: Story Tent ================= */
  /* a story → {D: relation in x, ans} built from the story's own words */
  function storyEq(story) {
    let m; const c = s => parseNum(s), lin = (k, b, rhs) => [[t => add(mul(k, t), b), () => rhs]];
    if ((m = story.match(/made (\d+) more and now has (\d+)\. How many did .+ have at first\?/))) return {D:lin(R(1), c(m[1]), c(m[2])), ans:sub(c(m[2]), c(m[1]))};
    if ((m = story.match(/Each crate holds (\d+) bottles\. .+ filled some crates with (\d+) bottles\. How many crates\?/))) return {D:lin(c(m[1]), R(0), c(m[2])), ans:div(c(m[2]), c(m[1]))};
    if ((m = story.match(/gave away (\d+) .+ and has (\d+) left\. How many did .+ start with\?/))) return {D:lin(R(1), mul(R(-1), c(m[1])), c(m[2])), ans:add(c(m[2]), c(m[1]))};
    if ((m = story.match(/shared some .+ equally into (\d+) bags\. Each bag got (\d+)\. How many were there\?/))) return {D:lin(div(R(1), c(m[1])), R(0), c(m[2])), ans:mul(c(m[2]), c(m[1]))};
    if ((m = story.match(/has (\d+) .+\. That is (\d+) times as many as (\w+) has\. How many does \3 have\?/))) return {D:lin(c(m[2]), R(0), c(m[1])), ans:div(c(m[1]), c(m[2]))};
    if ((m = story.match(/Each bottle costs \$([\d.]+)\. .+ spent \$([\d.]+) on bottles\. How many bottles/))) return {D:lin(c(m[1]), R(0), c(m[2])), ans:div(c(m[2]), c(m[1]))};
    throw new Error('story not read: ' + story);
  }
  O.eqModel = p => num(storyEq(txt(p.bubble)).ans);
  O.eqWrite = p => pickRelation(lastChoice(p), storyEq(txt(p.bubble)).D);
  O.translateEq = p => {
    const w = txt(p.bubble).match(/“(.+)”/)[1]; let m;
    if ((m = w.match(/^(\d+) more than a number is (\d+)\.$/))) return +m[2] - +m[1];
    if ((m = w.match(/^A number decreased by (\d+) is (\d+)\.$/))) return +m[2] + +m[1];
    if ((m = w.match(/^The product of (\d+) and a number is (\d+)\.$/))) return +m[2] / +m[1];
    if ((m = w.match(/^A number divided by (\d+) is (\d+)\.$/))) return +m[2] * +m[1];
    if ((m = w.match(/^(\d+) less than a number is (\d+)\.$/))) return +m[2] + +m[1];
    throw new Error('words not read: ' + w);
  };
  O.eqMistake = (p, lvl) => {
    const lines = [...dom(p.visual).querySelectorAll('div > div')].map(d => d.textContent.trim());
    const start = lines.find(l => l.startsWith('Start:')).replace(/^Start:\s*/, ''), s1 = lines.find(l => l.startsWith('Step 1:')).replace(/^Step 1:\s*/, ''), s2 = lines.find(l => l.startsWith('Step 2:')).replace(/^Step 2:\s*/, '');
    const sol = solve(start);
    if (lastStep(p).kind !== 'choice') return num(sol);
    const [l1, r1] = eqn(s1);
    const leftIsX = TESTS.every(t => eqR(l1({x:t}), t));                              // step 1 must leave x alone on the left
    let keeps; try { keeps = eqR(solve(s1), sol); } catch (e) { keeps = false; }       // ...and keep the same solution (same thing done to both sides)
    if (!leftIsX || !keeps) return 'Step 1';
    const v = parseNum(s2.replace(/^x\s*=\s*/, ''));
    return eqR(v, r1({})) ? 'There is no mistake' : 'Step 2';
  };

  /* ================= station 4: Ride Line ================= */
  O.testIneq = p => {
    const b = txt(p.bubble); let m;
    if ((m = b.match(/^Is x = (\S+) a solution of x (>|<|≥|≤) (\S+)\?$/))) return ineqHolds(N(m[1]), m[2], N(m[3])) ? 'Yes' : 'No';
    if ((m = b.match(/says x (>|<|≥|≤) (\S+)\. Which value/))) return only(lastChoice(p).options.filter(o => ineqHolds(N(o.text.replace(/^x = /, '')), m[1], N(m[2]))).map(o => o.text), 'values');
    throw new Error('unread: ' + b);
  };
  const askedIneq = b => { let m;
    if ((m = b.match(/x (>|<|≥|≤) (−?\d+)/))) return {op:m[1], c:N(m[2])};
    if ((m = b.match(/(more than|less than|at least|at most) (−?\d+)/))) return {op:WORD_OP[m[1]], c:N(m[2])};
    throw new Error('unread: ' + b); };
  O.graphIneq = p => { const q = askedIneq(txt(p.bubble)); return pickGraph(lastChoice(p), q.op, q.c); };
  O.plotIneq = p => { const q = askedIneq(txt(p.bubble)); return pickGraph(lastChoice(p), q.op, q.c); };
  O.ineqFromGraph = p => { const g = readIneqSVG(p.visual); return only(lastChoice(p).options.filter(o => { const m = o.text.match(INEQ); return m && m[2] === g.op && N(m[3]) === g.c; }).map(o => o.text), 'inequalities'); };
  O.ineqWord = (p, lvl) => {
    const b = txt(p.bubble), v = txt(p.visual).match(/:\s*([a-z])\s*$/)[1]; let m, op, n;
    if ((m = b.match(/at least (\d+)/))) [op, n] = ['≥', +m[1]];
    else if ((m = b.match(/no more than (\d+)|at most (\d+)/))) [op, n] = ['≤', +(m[1] || m[2])];
    else if ((m = b.match(/Fewer than (\d+)/i))) [op, n] = ['<', +m[1]];
    else if ((m = b.match(/more than (\d+)/))) [op, n] = ['>', +m[1]];
    else if ((m = b.match(/(\d+) years old and up/))) [op, n] = ['≥', +m[1]];
    else throw new Error('unread: ' + b);
    const last = lastStep(p);
    if (last.name === 'Does it work?') { const t = N(last.prompt.match(/= (\S+) work\?/)[1]); return ineqHolds(t, op, n) ? 'Yes' : 'No'; }
    if (last.name === 'The graph') return pickGraph(last, op, n);
    return only(last.options.filter(o => { const k = o.text.match(INEQ); return k && k[1] === v && k[2] === op && +k[3] === n; }).map(o => o.text), 'inequalities');
  };

  /* ================= station 5: Ferris Wheel ================= */
  /* the story's rule y = f(x), where x is the independent quantity */
  function depStory(b) { let m;
    if ((m = b.match(/earns \$(\d+) for every ride ticket sold/))) return {f:x => +m[1] * x, dep:/money|earn/};
    if ((m = b.match(/rises (\d+) feet every minute, starting at (\d+) feet/))) return {f:x => +m[1] * x + +m[2], dep:/height/};
    if ((m = b.match(/Each bag holds (\d+) lollipops/))) return {f:x => +m[1] * x, dep:/lollipops/};
    if ((m = b.match(/^(\w+) is (\d+) years older than a little cousin/))) return {f:x => x + +m[2], dep:new RegExp(`^${m[1]}'s age`)};   // the cousin's age is the given; the older kid's age is found from it
    throw new Error('story not read: ' + b); }
  O.depIndep = (p, lvl) => {
    const b = txt(p.bubble), S = depStory(b), last = lastStep(p);
    if (lvl === 1 || last.name === 'Dependent') return only(last.options.filter(o => S.dep.test(o.text)).map(o => o.text), 'dependent');
    const tab = readTable(p.visual);
    if (last.kind !== 'choice') { const miss = tab.find(c => c.y === '?'); return S.f(miss.x); }
    return only(last.options.filter(o => fitsAll(o.text, tab)).map(o => o.text), 'rules');
  };
  O.tableEq = p => {
    const rule = txt(p.bubble).match(/rule (y = .+?)\. Fill/)[1], tab = readTable(p.visual), x = tab[tab.length - 1].x;
    return num(evalAt(rule.split('=')[1], {x:R(x)}));
  };
  O.graphEq = (p, lvl) => {
    const last = lastStep(p), b = txt(p.bubble); let m;
    if ((m = b.match(/^Which point is on the graph of (y = .+)\?$/))) return only(last.options.filter(o => { const k = o.text.match(/\((\d+), (\d+)\)/); return holds(m[1], {x:R(+k[1]), y:R(+k[2])}); }).map(o => o.text), 'points');
    const pts = readQ1(p.visual);
    return only(last.options.filter(o => fitsAll(o.text, pts)).map(o => o.text), 'equations');
  };

  /* ================= station 6: Prize Counter ================= */
  O.relQuant = p => {
    const b = txt(p.bubble); let m, ind, dep, f;
    if ((m = b.match(/ticket costs \$(\d+)\. Let (\w) be the number of tickets and (\w) be the total cost/))) [ind, dep, f] = [m[2], m[3], x => mul(R(+m[1]), x)];
    else if ((m = b.match(/wins (\d+) prize points for every ring that lands\. Let (\w) be the rings and (\w) be the points/))) [ind, dep, f] = [m[2], m[3], x => mul(R(+m[1]), x)];
    else if ((m = b.match(/entry is \$(\d+), plus \$(\d+) for each ride\. Let (\w) be the rides and (\w) be the total cost/))) [ind, dep, f] = [m[3], m[4], x => add(mul(R(+m[2]), x), R(+m[1]))];
    else if ((m = b.match(/starts (\d+) feet up and rises (\d+) feet every second\. Let (\w) be the seconds and (\w) be the height/))) [ind, dep, f] = [m[3], m[4], x => add(mul(R(+m[2]), x), R(+m[1]))];
    else if ((m = b.match(/is (\d+) years older than a cousin\. Let (\w) be .+?’s age and (\w) be the cousin’s age/))) [ind, dep, f] = [m[3], m[2], x => add(x, R(+m[1]))];
    else if ((m = b.match(/shares (\w) pounds of sugar equally into (\d+) batches\. Let (\w) be the pounds in each batch/))) [ind, dep, f] = [m[1], m[3], x => div(x, R(+m[2]))];
    else throw new Error('story not read: ' + b);
    const data = [1, 2, 3, 5, 8, 12, 7].map(x => ({[ind]:R(x), [dep]:f(R(x))}));
    return only(lastStep(p).options.filter(o => data.every(env => holds(o.text, env))).map(o => o.text), 'equations');
  };
  O.analyzeRel = (p, lvl) => {
    const tab = readTable(p.visual), last = lastStep(p), diffs = tab.slice(1).map((c, i) => c.y - tab[i].y);
    if (diffs.some(d => d !== diffs[0])) throw new Error('table not linear');
    const d = diffs[0], b0 = tab[0].y - d * tab[0].x;
    if (last.kind === 'choice' && last.name === 'How it changes') return only(last.options.filter(o => { let m;
      if ((m = o.text.match(/go up by (\d+)$/))) return +m[1] === d;
      if ((m = o.text.match(/stay at (\d+)$/))) return d === 0 && tab.every(c => c.y === +m[1]);
      return false; }).map(o => o.text), 'changes');
    if (last.kind === 'choice') return only(last.options.filter(o => fitsAll(o.text, tab)).map(o => o.text), 'rules');
    const X = +txt(p.bubble).match(/for (\d+) \w+\.$/)[1];
    return d * X + b0;
  };
})();
