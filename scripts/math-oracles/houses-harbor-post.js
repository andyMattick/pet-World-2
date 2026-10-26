/* Independent answer checkers for Pet Houses (Khan unit 8: area), Pet Harbor (unit 9: coordinate plane) and
   Pet Post Office (unit 10: 3D solids, volume, surface area). Loaded by scripts/check-math.mjs as a plain script.
   Each solver reads only what she sees: the story (bubble), the picture (SVG text, dots, polygons, lines), the
   choice options, and the step names. It never reads ctx or any step's answer, eq, ok, mis or hint. */
(() => {
  const O = window.ORACLES = window.ORACLES || {};
  const strip = h => String(h || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
  const T = p => strip(p.bubble).replace(/−/g, '-');
  /* a number as she reads it: 7, -3, 2.5, 3/4, 2 1/2 */
  const Q = s => {
    s = String(s).trim().replace(/−/g, '-'); let m;
    if ((m = s.match(/^(-?\d+) (\d+)\/(\d+)$/))) return +m[1] + (+m[1] < 0 ? -1 : 1) * m[2] / m[3];
    if ((m = s.match(/^(-?\d+)\/(\d+)$/))) return m[1] / m[2];
    return parseFloat(s);
  };
  const NUM = '(-?\\d+(?: \\d+\\/\\d+)?(?:\\/\\d+)?(?:\\.\\d+)?)';
  const grab = (text, re) => { const m = text.match(new RegExp(re.replace(/#/g, NUM))); if (!m) throw new Error(`can't read "${re}"`); return m.slice(1).map(Q); };
  const keyStep = p => { const s = window.PetWorldMath.answerStepsFor(p); return s[s.length - 1]; };
  const pairs = t => [...String(t).replace(/−/g, '-').matchAll(/\((-?\d+), (-?\d+)\)/g)].map(m => [+m[1], +m[2]]);
  const ptTxt = (x, y) => `(${x < 0 ? '−' : ''}${Math.abs(x)}, ${y < 0 ? '−' : ''}${Math.abs(y)})`;
  /* the option whose point is (x, y); falls back to my own wording so a missing right answer shows as a mismatch */
  const pickPoint = (st, x, y) => { const o = st.options.find(o => { const q = pairs(o.text); return q.length === 1 && q[0][0] === x && q[0][1] === y; }); return o ? o.text : ptTxt(x, y); };
  const attrs = (tag, a) => { const m = tag.match(new RegExp(`\\s${a}="([^"]*)"`)); return m ? m[1] : null; };
  const tags = (svg, name) => [...String(svg).matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map(m => m[0]);
  const texts = (svg, cls) => [...String(svg).matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)].filter(m => !cls || new RegExp(`class="${cls}"`).test(m[1])).map(m => ({x:+attrs(m[0], 'x'), y:+attrs(m[0], 'y'), t:m[2]}));
  const polyPts = tag => attrs(tag, 'points').trim().split(/\s+/).map(q => q.split(',').map(Number));
  const shoelace = P => Math.abs(P.reduce((s, [x, y], i) => { const [u, v] = P[(i + 1) % P.length]; return s + x * v - u * y; }, 0)) / 2;
  const near = (a, b, e = 1e-6) => Math.abs(a - b) < e;
  const r6 = v => Math.round(v * 1e6) / 1e6;

  /* ================= Pet Houses: area ================= */
  /* parallelogram: area = base × height; missing side = area ÷ the other */
  O.areaPara = p => {
    const t = T(p);
    if (/What is its area/.test(t)) { const [b] = grab(t, 'base is # m'), [h] = grab(t, 'height is # m'); return b * h; }
    const [A] = grab(t, 'area of # square'), [b] = grab(t, 'base is # m'); return A / b;
  };
  O.paraMissing = p => {
    const t = T(p), [A] = grab(t, 'area of # square'), [k] = grab(t, 'Its (?:height|base) is # m');
    return r6(A / k);
  };
  /* the height is the segment from C that makes a right angle with AB: read the corner letters' spots in the picture */
  const heightSeg = p => {
    const L = {}; texts(p.visual, 'shape-lbl').forEach(o => { L[o.t] = [o.x, o.y]; });
    const v = (a, b) => [L[b][0] - L[a][0], L[b][1] - L[a][1]], AB = v('A', 'B');
    const perp = s => { const u = v(s[0], s[1]); return Math.abs(u[0] * AB[0] + u[1] * AB[1]) / (Math.hypot(...u) * Math.hypot(...AB)) < 0.01; };
    return ['CD', 'AC', 'BC', 'AD', 'BD'].filter(s => s.includes('C') && perp(s));
  };
  O.triBaseHeight = p => {
    const st = keyStep(p), hs = heightSeg(p);
    if (st.kind === 'choice') { const o = st.options.find(o => hs.includes(o.text)); return o ? o.text : hs[0] || 'none'; }
    const t = T(p), [b] = grab(t, 'AB is # ft'), m = t.match(/and ([A-D]{2}) is (\d+) ft/);
    return hs.includes(m[1]) ? b * +m[2] / 2 : null;
  };
  O.areaRightTri = p => {
    const t = T(p);
    if (/What is its area/.test(t)) { const [a, b] = grab(t, 'legs # cm and # cm'); return a * b / 2; }
    const [A] = grab(t, 'area of # square'), [a] = grab(t, 'One leg is # cm'); return 2 * A / a;
  };
  O.areaTri = p => { const [b, h] = grab(T(p), 'base # in\\. and height # in'); return b * h / 2; };
  O.triMissing = p => { const t = T(p), [A] = grab(t, 'area of # square'), [k] = grab(t, 'Its (?:base|height) is # ft'); return r6(2 * A / k); };
  /* composite: measure the drawn floor plan (drawn to scale), with the scale set by the bottom label; every label
     must match the side it sits beside, or the picture itself is wrong */
  O.areaComposite = p => {
    const P = polyPts(tags(p.visual, 'polygon')[0]), labels = texts(p.visual, 'shape-lbl');
    const xs = P.map(q => q[0]), bottom = labels.reduce((a, b) => (b.y > a.y ? b : a));
    const s = (Math.max(...xs) - Math.min(...xs)) / Q(bottom.t);
    for (const L of labels) {   // the nearest side's length, in units
      let best = null;
      P.forEach((a, i) => { const b = P[(i + 1) % P.length], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], d = Math.hypot(m[0] - L.x, m[1] - L.y); if (!best || d < best.d) best = {d, len:Math.hypot(b[0] - a[0], b[1] - a[1]) / s}; });
      if (!near(best.len, Q(L.t), 1e-3)) return `label ${L.t} is on a side ${r6(best.len)} long`;
    }
    return Math.round(shoelace(P) / s / s * 2) / 2;
  };
  O.decompTri = p => {
    const t = T(p);
    if (/trapezoid/.test(t)) { const [top] = grab(t, '# ft across the top'), [bot] = grab(t, '# ft across the bottom'), [h] = grab(t, '# ft tall'); return (top + bot) / 2 * h; }
    if (/whole front, up to the tip of the roof, is/.test(t)) { const [W] = grab(t, 'is # ft wide'), [H] = grab(t, 'walls are # ft tall'), [T2] = grab(t, 'roof, is # ft tall'); return W * H + W * (T2 - H) / 2; }
    const [W, H] = grab(t, 'rectangle # ft wide and # ft tall'), [r] = grab(t, 'roof # ft tall'); return W * H + W * r / 2;
  };

  /* ================= Pet Harbor: the coordinate plane ================= */
  const quadName = (x, y) => x === 0 && y === 0 ? 'the origin' : x === 0 ? 'the y-axis' : y === 0 ? 'the x-axis' : x > 0 && y > 0 ? 'Quadrant I' : x < 0 && y > 0 ? 'Quadrant II' : x < 0 ? 'Quadrant III' : 'Quadrant IV';
  /* read a plane picture: its range R from the axis numbers, then turn screen spots into (x, y) */
  const plane = svg => {
    const nums = texts(svg, 'grid-num').map(o => Q(o.t)).filter(v => !isNaN(v)), R = Math.max(...nums.map(Math.abs));
    const W = +attrs(svg.match(/<svg\b[^>]*>/)[0], 'width'), c = W / 2, s = (W - 30) / (2 * R);
    return {R, at:(px, py) => [Math.round((px - c) / s * 1000) / 1000, Math.round((c - py) / s * 1000) / 1000]};
  };
  const dots = svg => { const pl = plane(svg); return tags(svg, 'circle').filter(t => /nl-dot/.test(t)).map(t => pl.at(+attrs(t, 'cx'), +attrs(t, 'cy'))); };
  O.pointsId = p => { const [[x, y]] = dots(p.visual); return pickPoint(keyStep(p), x, y); };
  O.graphQuad = p => {
    const t = T(p), st = keyStep(p), m = t.match(/hid its beach ball in (Quadrant [IV]+)/);
    if (m) { const o = st.options.filter(o => { const [q] = pairs(o.text); return q && quadName(...q) === m[1]; }); return o.length === 1 ? o[0].text : `${o.length} points in ${m[1]}`; }
    const [[x, y]] = pairs(t); return quadName(x, y);
  };
  O.reflect = p => {
    const t = T(p), [[x, y]] = pairs(t), ax = t.match(/reflected across (the x-axis|the y-axis|both axes)/)[1];
    const [a, b] = ax === 'the x-axis' ? [x, -y] : ax === 'the y-axis' ? [-x, y] : [-x, -y];
    return pickPoint(keyStep(p), a, b);
  };
  const dist = (P, Q2) => P[0] === Q2[0] ? Math.abs(P[1] - Q2[1]) : P[1] === Q2[1] ? Math.abs(P[0] - Q2[0]) : NaN;
  O.distPoints = p => {
    const t = T(p), P = pairs(t);
    if (/runs/.test(t)) {
      const [d] = grab(t, 'runs # m'), dir = t.match(/m (left|right|up|down) to/)[1], [x, y] = P[0];
      const q = dir === 'left' ? [x - d, y] : dir === 'right' ? [x + d, y] : dir === 'up' ? [x, y + d] : [x, y - d];
      return pickPoint(keyStep(p), ...q);
    }
    return dist(P[0], P[1]);
  };
  O.areaCoord = p => {
    const t = T(p), C = pairs(t);
    if (/its area\?/.test(t)) return shoelace(C);
    return C.reduce((s, a, i) => { const b = C[(i + 1) % C.length]; return s + Math.hypot(b[0] - a[0], b[1] - a[1]); }, 0);
  };
  O.coordWord = p => {
    const t = T(p), [A, B] = pairs(t), m = t.match(/then (\d+) m (up|right|left|down)/);
    return dist(A, B) + (m ? +m[1] : 0);
  };
  /* which kind of polygon: by its side directions and corners */
  const shapeKind = P => {
    const sides = P.map((a, i) => { const b = P[(i + 1) % P.length]; return [b[0] - a[0], b[1] - a[1]]; });
    const par = (u, v) => u[0] * v[1] - u[1] * v[0] === 0, dot = (u, v) => u[0] * v[0] + u[1] * v[1], len = u => Math.hypot(...u);
    if (P.length === 3) return sides.some((u, i) => dot(u, sides[(i + 1) % 3]) === 0) ? 'right triangle' : 'triangle';
    if (P.length !== 4) return `${P.length}-gon`;
    const p1 = par(sides[0], sides[2]), p2 = par(sides[1], sides[3]), right = sides.every((u, i) => dot(u, sides[(i + 1) % 4]) === 0), eq = sides.every(u => near(len(u), len(sides[0])));
    if (p1 && p2) return right ? (eq ? 'square' : 'rectangle') : eq ? 'rhombus' : 'parallelogram';
    return p1 || p2 ? 'trapezoid' : 'quadrilateral';
  };
  const inSet = (A, B) => A.every(a => B.some(b => near(a[0], b[0], 1e-3) && near(a[1], b[1], 1e-3)));
  const sameSet = (A, B) => A.length === B.length && inSet(A, B) && inSet(B, A);
  O.polyDraw = p => {
    const t = T(p), st = keyStep(p), C = pairs(t);
    if (st.kind === 'pair') {   // a rectangle's missing corner: the x and the y that each show up only once
      const once = vs => vs.find(v => vs.filter(u => u === v).length === 1);
      return [once(C.map(c => c[0])), once(C.map(c => c[1]))];
    }
    if (/Which picture/.test(t)) {
      const ok = st.options.filter(o => { const pl = plane(o.html), poly = tags(o.html, 'polygon').find(g => /plane-poly/.test(g)); return poly && sameSet(polyPts(poly).map(([x, y]) => pl.at(x, y)), C); });
      return ok.length === 1 ? ok[0].text : `${ok.length} pictures match`;
    }
    return shapeKind(C);
  };
  O.quadCoord = p => {
    const t = T(p), C = pairs(t);
    if (/rope costs/.test(t)) { const [c] = grab(t, 'costs \\$# a meter'); return areaPerim(C) * c; }
    if (/Find the fourth corner/.test(t)) {   // the fourth corner, then the length of the top side
      const once = vs => vs.find(v => vs.filter(u => u === v).length === 1), all = [...C, [once(C.map(c => c[0])), once(C.map(c => c[1]))]];
      const topY = Math.max(...all.map(c => c[1])), top = all.filter(c => c[1] === topY);
      return Math.abs(top[0][0] - top[1][0]);
    }
    const [A] = grab(t, 'area is # square'), w = dist(C[0], C[1]), up = /are above/.test(t);
    return C[0][1] + (up ? 1 : -1) * A / w;
  };
  const areaPerim = C => C.reduce((s, a, i) => { const b = C[(i + 1) % C.length]; return s + Math.hypot(b[0] - a[0], b[1] - a[1]); }, 0);

  /* ================= Pet Post Office: 3D solids ================= */
  const SIDES = {triangular:3, square:4, rectangular:4, pentagonal:5, hexagonal:6};
  /* Euler counts from the name: an n-sided prism has n + 2 faces, 3n edges, 2n vertices; a pyramid n + 1, 2n, n + 1 */
  const counts = kind => {
    if (kind === 'cube') return {faces:6, edges:12, vertices:8};
    const [base, fam] = kind.split(' '), n = SIDES[base];
    return fam === 'prism' ? {faces:n + 2, edges:3 * n, vertices:2 * n} : {faces:n + 1, edges:2 * n, vertices:n + 1};
  };
  O.solidParts = p => {
    const t = T(p), st = keyStep(p);
    if (st.kind === 'choice') return /s3-face s3-hi"/.test(p.visual) ? 'face' : /class="s3-hiE"/.test(p.visual) ? 'edge' : /class="s3-hiV"/.test(p.visual) ? 'vertex' : 'nothing marked';
    const kind = t.match(/is an? ([a-z ]+?)\./)[1], C = counts(kind), name = st.name.toLowerCase();
    return C[name];
  };
  /* name a solid from the picture: curved ones by their outline; polyhedra by counting drawn corners and edges */
  const solidFromSVG = svg => {
    if (/<circle\b[^>]*s3-face/.test(svg)) return ['sphere'];
    if (/<ellipse\b/.test(svg)) return ['cylinder'];
    const lines = tags(svg, 'line').filter(l => /s3-(edge|hid|hiE)/.test(l));
    if (!lines.length) return ['cone'];
    const V = new Set(); lines.forEach(l => { V.add(`${attrs(l, 'x1')},${attrs(l, 'y1')}`); V.add(`${attrs(l, 'x2')},${attrs(l, 'y2')}`); });
    const v = V.size, e = lines.length, out = [];
    for (const [nm, n] of Object.entries({triangular:3, square:4, pentagonal:5, hexagonal:6})) {
      if (v === 2 * n && e === 3 * n) out.push(...(n === 4 ? ['cube', 'rectangular prism'] : [`${nm} prism`]));
      if (v === n + 1 && e === 2 * n) out.push(`${nm} pyramid`);
    }
    return out;
  };
  const DESC = t => {
    t = t.toLowerCase();
    if (/circle/.test(t)) return /comes to a point/.test(t) ? 'cone' : /2 circle bases/.test(t) ? 'cylinder' : null;
    const name = w => ({triangle:'triangular', square:'square', rectangle:'rectangular', pentagon:'pentagonal', hexagon:'hexagonal'})[w];
    let m;
    if ((m = t.match(/(\d+) faces, and every face is a (\w+)/))) return m[2] === 'square' && +m[1] === 6 ? 'cube' : m[2] === 'triangle' && +m[1] === 4 ? 'triangular pyramid' : null;
    if ((m = t.match(/(\d+) rectangle faces, and they are not all squares/)) && +m[1] === 6) return 'rectangular prism';
    if ((m = t.match(/2 (\w+) bases and (\d+) rectangle faces/)) && SIDES[name(m[1])] === +m[2]) return `${name(m[1])} prism`;
    if ((m = t.match(/1 (\w+) base and (\d+) triangle faces/)) && SIDES[name(m[1])] === +m[2]) return `${name(m[1])} pyramid`;
    return null;
  };
  O.solidId = p => {
    const st = keyStep(p), t = strip(p.bubble);
    if (/says:/.test(t)) return DESC(t);
    const fits = solidFromSVG(p.visual), o = st.options.filter(o => fits.includes(o.text));
    return o.length === 1 ? o[0].text : o.length ? null : `none of ${fits.join('/')}`;   // null only if a cube and a box are both offered
  };
  O.volBaseHeight = p => {
    const t = T(p);
    if (/triangular prism/.test(t)) { const [b] = grab(t, 'base is # in\\. across'), [h] = grab(t, '# in\\. tall'), [L] = grab(t, '# in\\. long'); return b * h / 2 * L; }
    if (/How tall/.test(t)) { const [V] = grab(t, 'holds # cubic'), [B] = grab(t, 'base is # square'); return V / B; }
    const [B] = grab(t, 'area of # square'), [h] = grab(t, '# in\\. tall'); return B * h;
  };
  O.volPrism = p => { const [l, w, h] = grab(T(p), 'is # ft long, # ft wide, and # ft tall'); return l * w * h; };
  O.volCubes = p => { const [a, b, c] = grab(T(p), 'box is # in\\. by # in\\. by # in\\.'); return a * b * c; };
  O.volWord = p => {
    const t = T(p);
    if (/hamster/.test(t)) { const [V] = grab(t, 'holds # cubic'), [l, w] = grab(t, 'floor is # ft by # ft'); return V / (l * w); }
    if (/Sand costs/.test(t)) { const [l, w] = grab(t, '# ft long and # ft wide'), [h] = grab(t, '# ft deep'), [c] = grab(t, 'costs \\$# per'); return l * w * h * c; }
    if (/crate/.test(t)) { const [l, w, h] = grab(t, '# m long, # m wide and # m tall'); return l * w * h; }
    const [l, w, h] = grab(t, '# ft long, # ft wide, and # ft deep'); return l * w * h;
  };
  /* a net: count its squares, rectangles and triangles */
  const netKind = svg => {
    const polys = tags(svg, 'polygon').map(polyPts), quads = polys.filter(q => q.length === 4), tris = polys.filter(q => q.length === 3);
    const isSquare = q => { const L = q.map((a, i) => Math.hypot(q[(i + 1) % 4][0] - a[0], q[(i + 1) % 4][1] - a[1])); return L.every(x => near(x, L[0], 1e-3)); };
    if (quads.length === 6 && !tris.length) return quads.every(isSquare) ? 'cube' : 'rectangular prism';
    if (quads.length === 1 && tris.length === 4) return 'square pyramid';
    if (quads.length === 3 && tris.length === 2) return 'triangular prism';
    if (!quads.length && tris.length === 4) return 'triangular pyramid';
    return `${quads.length} quads + ${tris.length} triangles`;
  };
  O.netsId = p => {
    const st = keyStep(p), t = strip(p.bubble), m = t.match(/folds up into an? ([a-z ]+)\?/);
    if (m) { const o = st.options.filter(o => netKind(o.html) === m[1]); return o.length === 1 ? o[0].text : `${o.length} nets fold into a ${m[1]}`; }
    return netKind(p.visual);
  };
  const SA = (l, w, h) => 2 * (l * w + l * h + w * h);
  O.surfaceArea = p => {
    const t = T(p);
    if (/open box/.test(t)) { const [l] = grab(t, '# in\\. long'), [w] = grab(t, '# in\\. wide'), [h] = grab(t, '# in\\. tall'); return SA(l, w, h) - l * w; }
    const [l, w, h] = grab(t, 'box # in\\. by # in\\. by # in\\.'); return SA(l, w, h);
  };
  O.surfacePyramid = p => {
    const t = T(p), [s] = grab(t, '# ft on each side'), [h] = grab(t, 'face is # ft tall'), area = s * s + 4 * s * h / 2;
    if (/pieces/.test(t)) { const [F] = grab(t, 'pieces of # square'); return Math.ceil(area / F - 1e-9); }
    return area;
  };
  /* a small calculator for the expression choices: numbers, ½, ×, +, −, parentheses, and 2(…) */
  const calc = src => {
    const tk = src.replace(/½/g, ' 0.5 ').replace(/−/g, '-').match(/\d+(?:\.\d+)?|[()+\-×*]/g); let i = 0;
    const atom = () => { const x = tk[i++]; if (x === '(') { const v = sum(); i++; return v; } return +x; };
    const prod = () => { let v = atom(); for (;;) { if (tk[i] === '×' || tk[i] === '*') { i++; v *= atom(); } else if (tk[i] === '(') v *= atom(); else return v; } };
    const sum = () => { let v = prod(); while (tk[i] === '+' || tk[i] === '-') { const o = tk[i++], b = prod(); v = o === '+' ? v + b : v - b; } return v; };
    return sum();
  };
  const saExprValue = t => {
    let m;
    if ((m = t.match(/box (\d+) cm long, (\d+) cm wide and (\d+) cm tall/))) return SA(+m[1], +m[2], +m[3]);
    if ((m = t.match(/base (\d+) in\. on each side, and each triangle face is (\d+) in\. tall/))) return +m[1] * +m[1] + 4 * (+m[1] * +m[2] / 2);
    const [L] = grab(t, 'is # ft long'), sides = grab(t, 'sides # ft, # ft and # ft').sort((a, b) => a - b);
    return 2 * (sides[0] * sides[1] / 2) + (sides[0] + sides[1] + sides[2]) * L;   // legs are the two shorter sides
  };
  O.saExpr = p => {
    const st = keyStep(p), v = saExprValue(T(p));
    if (st.kind !== 'choice') return v;
    const o = st.options.filter(o => near(calc(o.text), v)); return o.length === 1 ? o[0].text : `${o.length} expressions equal ${v}`;
  };
  O.saWord = p => {
    const t = T(p);
    if (/cube/.test(t)) { const [s] = grab(t, 'edge is # in'); return 6 * s * s; }
    if (/doesn.t get painted/.test(t)) { const [l, w, h] = grab(t, '# ft long, # ft wide and # ft tall'); return SA(l, w, h) - l * w; }
    const [a, b, c] = grab(t, 'Box A is # × # × #'), [d, e, f] = grab(t, 'box B is # × # × #'); return Math.abs(SA(a, b, c) - SA(d, e, f));
  };
})();
