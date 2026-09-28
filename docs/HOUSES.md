# 6th grade, shop 7: Pet Houses

**Status: built (all 6 stations).** Khan Academy 6th grade, Units 8 (plane figures), 9 (the coordinate plane), and 10 (3D figures). The generators are `HOUSES_GEN` (stations 1 to 4) and `HOUSES2_GEN` (stations 5 and 6) in `src/game/game.js` (stress-tested: 1,020,000 problems, 20,000 per skill and level; every area, distance, coordinate, reflection, quadrant, volume, and surface area checked). Read `AGENTS.md` and `NEIGHBORHOODS.md` first. **Edit in place, never rewrite a file.**

Pet Houses opens after the Potion Lab Unit Test (or with the teacher's "Open Pet Houses for everyone").

## Stations and skills (Khan's order)

| # | Station | Skills (ids) |
|---|---|---|
| 1 | 📐 Floor Plans | Area of parallelograms (`areaPara`), right triangles (`areaRightTri`), triangles (`areaTri`) |
| 2 | 🧱 Rooms | Area of composite shapes (`areaComposite`), decompose area with triangles (`decompTri`) |
| 3 | 📍 Yard Map | Points on the coordinate plane (`pointsId`), quadrants (`graphQuad`), reflecting points (`reflect`) |
| 4 | 📏 Fence Lines | Distance between points (`distPoints`), area and perimeter on the coordinate plane (`areaCoord`), coordinate plane word problems (`coordWord`) |
| 5 | 📦 Toy Boxes | Volume with fractions (`volPrism`), fractional unit cubes (`volCubes`), volume word problems (`volWord`) |
| 6 | 🎁 Wrapping Paper | Nets (`netsId`), surface area of boxes (`surfaceArea`), surface area of square pyramids (`surfacePyramid`) |

## Pictures

- `shapeSVG(polygons, labels, dashes)`: shapes scaled to fit, with side labels and dashed heights. Levels 2 and 3 label slanted sides (whole-number triples like 3, 4, 5) as distractors.
- `planeSVG(R, points, polygon)`: the coordinate plane from −R to R with gridlines, axis numbers, named points, and a shaded polygon.
- `boxSVG(length, width, height)`: a box drawn at a slant with its three labels.
- `netSVG(name)`: nets of a rectangular prism, cube, square pyramid, triangular prism, and triangular pyramid.

## What students get

- **Area:** base × height (not the slanted side), ½ × base × height with the height drawn inside or outside the triangle, answers ending in .5 (`halfAreaStep`), L-shapes split into two rectangles, a notch taken away, a house front (rectangle + roof triangle), and a trapezoid split into a rectangle and two triangles.
- **Coordinate plane:** reading points (with swapped and sign-flipped choices), quadrants and axes, reflections across the x-axis, y-axis, or both, distances along a line (across 0 too), and area or perimeter of a rectangle from its corners.
- **Volume:** l × w × h with fractions (answers in simplest form), how many ½-inch or ¼-inch cubes fill a box and what volume that is, and finding a missing height.
- **Surface area:** naming a solid from its net, the 6 faces of a box in pairs, and a square pyramid's base plus 4 triangles.

## Mix-ups

New: `slantHeight`, `halfWrong`, `compositeWrong`, `coordSwap`, `quadrantWrong`, `reflectAxisWrong`, `negDistance`, `volumeAddWrong`, `fracVolumeWrong`, `surfaceMissingFaces`, `netWrong`. Reused: `areaPerimeterSwap`, `halfPerimeter`, `signWrong`, `notSimplest`, `notMixed`.

## Rewards

The Pet Houses reward set was already in the registry (🐌 Shelly the snail and friends).

## Generator code (stress-tested)

```js
/* ===== 6th grade, Pet Houses part 1 (Khan units 8 and 9): area of plane figures, the coordinate plane ===== */
/* whole-number side lengths with a whole slant: [run, rise, slant] */
const TRIPLES = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [9, 12, 15], [12, 9, 15]];
const half = n => n % 2 ? `${Math.floor(n / 2)}.5` : String(n / 2);
/* a typed area answer that may end in .5 */
const halfAreaStep = (name, prompt, v2, extra = {}) => ({name, type:'compute', kind:'num', prompt, answer:half(v2), eq:v => typeof v === 'number' && Math.abs(v * 2 - v2) < 1e-9, decimal:v2 % 2 === 1, slowOK:true, ...extra,
  ...(extra.mis ? {mis:v => typeof v === 'number' && Math.abs(v * 2 - v2) < 1e-9 ? null : extra.mis(v)} : {})});
/* draw shapes given in units; fits them into 280 × 170 with labels */
function shapeSVG(polys, labels = [], dashes = []){
  const pts = polys.flat(), xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const s = Math.min(240 / (maxX - minX || 1), 140 / (maxY - minY || 1)), P = ([x, y]) => [20 + (x - minX) * s, 20 + (maxY - y) * s];
  let g = polys.map((poly, i) => `<polygon points="${poly.map(P).map(p => p.join(',')).join(' ')}" class="shape-fill${i ? ' shape-2' : ''}"/>`).join('');
  g += dashes.map(([a, b]) => { const [x1, y1] = P(a), [x2, y2] = P(b); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="shape-dash"/>`; }).join('');
  g += labels.map(([pt, t, anchor = 'middle']) => { const [x, y] = P(pt); return `<text x="${x}" y="${y}" class="shape-lbl" text-anchor="${anchor}">${t}</text>`; }).join('');
  const W = 40 + (maxX - minX) * s, H = 40 + (maxY - minY) * s;
  return `<svg class="shape-pic" viewBox="-10 -6 ${W + 20} ${H + 12}" width="${W + 20}" role="img" aria-label="shape with its measurements">${g}</svg>`;
}
/* the coordinate plane from -R to R with named points and an optional polygon */
function planeSVG(R, pts = [], poly = null){
  const w = 280, c = w / 2, s = (w - 30) / (2 * R), P = (x, y) => [c + x * s, c - y * s];
  let g = '';
  for (let i = -R; i <= R; i++) { const [x] = P(i, 0), [, y] = P(0, i); g += `<line x1="${x}" y1="${c - R * s}" x2="${x}" y2="${c + R * s}" class="grid-line"/><line x1="${c - R * s}" y1="${y}" x2="${c + R * s}" y2="${y}" class="grid-line"/>`; }
  g += `<line x1="${c - R * s - 6}" y1="${c}" x2="${c + R * s + 6}" y2="${c}" class="axis-line"/><line x1="${c}" y1="${c - R * s - 6}" x2="${c}" y2="${c + R * s + 6}" class="axis-line"/>`;
  const step = R > 6 ? 2 : 1;
  for (let i = -R; i <= R; i += step) if (i) { const [x] = P(i, 0), [, y] = P(0, i); g += `<text x="${x}" y="${c + 14}" class="grid-num">${sgn(i)}</text><text x="${c - 5}" y="${y + 4}" class="grid-num" text-anchor="end">${sgn(i)}</text>`; }
  g += `<text x="${c + R * s + 4}" y="${c - 6}" class="grid-num">x</text><text x="${c + 6}" y="${c - R * s}" class="grid-num">y</text>`;
  if (poly) g += `<polygon points="${poly.map(([x, y]) => P(x, y).join(',')).join(' ')}" class="plane-poly"/>`;
  pts.forEach(p => { const [x, y] = P(p.x, p.y); g += `<circle cx="${x}" cy="${y}" r="6" class="nl-dot"/>${p.name ? `<text x="${x + 8}" y="${y - 8}" class="grid-name">${p.name}</text>` : ''}`; });
  return `<svg class="plane-pic" viewBox="0 0 ${w} ${w}" width="${w}" role="img" aria-label="coordinate plane">${g}</svg>`;
}
const pt = (x, y) => `(${sgn(x)}, ${sgn(y)})`;
const quadOf = (x, y) => x === 0 || y === 0 ? (x === 0 && y === 0 ? 'the origin' : x === 0 ? 'the y-axis' : 'the x-axis') : x > 0 ? (y > 0 ? 'Quadrant I' : 'Quadrant IV') : (y > 0 ? 'Quadrant II' : 'Quadrant III');
const nz = r => { let v; do { v = rand(-r, r); } while (v === 0); return v; };
const HOUSES_GEN = {
  /* ----- station 1: Floor Plans (parallelograms and triangles) ----- */
  areaPara(lvl){
    const b = rand(4, lvl === 1 ? 10 : 15), [run, h, sl] = lvl === 1 ? [rand(1, 3), rand(2, 8), null] : pick(TRIPLES), A = b * h;
    const poly = [[0, 0], [b, 0], [b + run, h], [run, h]];
    const labels = [[[b / 2, -0.9], `${b}`], [[run + 0.25, h / 2], `${h}`, 'start']]; if (sl) labels.push([[run / 2 - 0.6, h / 2], `${sl}`, 'end']);
    return {title:'Floor Plans', ctx:`parallelogram b ${b} h ${h}`, bubble:`The dog run is a parallelogram. Its base is ${b} m${sl ? `, its slanted side is ${sl} m,` : ''} and its height is ${h} m. What is its area?`, helper:'Area of a parallelogram = base × height. The height is the straight-up distance, not the slanted side.',
      visual:shapeSVG([poly], labels, [[[run, 0], [run, h]]]),
      steps:[halfAreaStep('Area', `${b} × ${h} = ? square meters`, 2 * A, {fact:fx(b, h), mis:v => sl && v === b * sl ? 'slantHeight' : v === 2 * (b + (sl || h)) ? 'areaPerimeterSwap' : Math.abs(v * 2 - A) < 1e-9 ? 'halfWrong' : null})]};
  },
  areaRightTri(lvl){
    const [a, b, c] = lvl === 1 ? [rand(2, 10), rand(2, 10), null] : pick(TRIPLES), A2 = a * b;
    const labels = [[[a / 2, -0.9], `${a}`], [[-0.4, b / 2], `${b}`, 'end']]; if (c) labels.push([[a / 2 + 0.5, b / 2 + 0.5], `${c}`, 'start']);
    return {title:'Floor Plans', ctx:`right triangle ${a} × ${b}`, bubble:`A corner of the cat's bed is a right triangle with legs ${a} cm and ${b} cm${c ? ` (the long side is ${c} cm)` : ''}. What is its area?`, helper:'A right triangle is half of a rectangle: ½ × base × height.',
      visual:shapeSVG([[[0, 0], [a, 0], [0, b]]], labels),
      steps:[numStep('Rectangle', 'compute', `${a} × ${b} = ?`, A2, {fact:fx(a, b), mis:v => c && (v === a * c || v === b * c) ? 'slantHeight' : null}),
        halfAreaStep('Half of it', `${A2} ÷ 2 = ? square cm`, A2, {mis:v => v === A2 ? 'halfWrong' : null, hint:() => 'The triangle is half the rectangle.'})], answerSteps:[1]};
  },
  areaTri(lvl){
    const b = rand(4, 14), h = rand(2, 10), off = lvl === 1 ? rand(1, b - 1) : lvl === 2 ? rand(1, b - 1) : pick([-rand(1, 3), b + rand(1, 3)]), A2 = b * h;
    const poly = [[0, 0], [b, 0], [off, h]], dash = [[off, 0], [off, h]];
    const extra = off < 0 || off > b ? [[[off, 0], [off < 0 ? 0 : b, 0]]] : [];
    return {title:'Floor Plans', ctx:`triangle b ${b} h ${h}`, bubble:`The roof window is a triangle with base ${b} in. and height ${h} in.${off < 0 || off > b ? ' The height is drawn outside the triangle.' : ''} What is its area?`, helper:'Area of a triangle = ½ × base × height.',
      visual:shapeSVG([poly], [[[b / 2, -0.9], `${b}`], [[off + 0.3, h / 2], `${h}`, 'start']], [dash, ...extra]),
      steps:[halfAreaStep('Area', `½ × ${b} × ${h} = ? square inches`, A2, {mis:v => v === A2 ? 'halfWrong' : null, hint:() => `${b} × ${h} = ${A2}, then half of that.`})]};
  },

  /* ----- station 2: Rooms (composite shapes) ----- */
  areaComposite(lvl){
    const W = rand(6, 14), H = rand(5, 12), w = rand(2, W - 2), h = rand(2, H - 2), big = W * H, cut = w * h;
    if (lvl === 1) {
      const poly = [[0, 0], [W, 0], [W, H - h], [W - w, H - h], [W - w, H], [0, H]];
      return {title:'Rooms', ctx:`L ${W}×${H} minus ${w}×${h}`, bubble:`The pet house floor is L-shaped. Split it into two rectangles to find its area.`, helper:'Split the shape into rectangles, find each area, then add.',
        visual:shapeSVG([poly], [[[W / 2, -0.9], `${W}`], [[-0.4, H / 2], `${H}`, 'end'], [[W - w / 2, H - h + 0.4], `${w}`], [[W + 0.3, (H - h) / 2], `${H - h}`, 'start']], [[[W - w, 0], [W - w, H - h]]]),
        steps:[numStep('Left part', 'compute', `${W - w} × ${H} = ?`, (W - w) * H, {fact:fx(W - w, H)}), numStep('Right part', 'compute', `${w} × ${H - h} = ?`, w * (H - h), {fact:fx(w, H - h)}),
          numStep('Total', 'compute', `${(W - w) * H} + ${w * (H - h)} = ? square feet`, big - cut, {mis:v => v === big ? 'compositeWrong' : v === big + cut ? 'compositeWrong' : null})], answerSteps:[2]};
    }
    const cx = rand(1, W - w - 1), poly = [[0, 0], [W, 0], [W, H], [cx + w, H], [cx + w, H - h], [cx, H - h], [cx, H], [0, H]];
    return {title:'Rooms', ctx:`${W}×${H} minus notch ${w}×${h}`, bubble:`The play pen is a ${W} ft by ${H} ft rectangle with a ${w} ft by ${h} ft notch cut out of the top. What is its area?`, helper:'Find the area of the whole rectangle, then subtract the piece that is missing.',
      visual:shapeSVG([poly], [[[W / 2, -0.9], `${W}`], [[-0.4, H / 2], `${H}`, 'end'], [[cx + w / 2, H - h - 0.9], `${w}`], [[cx + w + 0.3, H - h / 2], `${h}`, 'start']]),
      steps:[numStep('Whole rectangle', 'compute', `${W} × ${H} = ?`, big, {fact:fx(W, H)}), numStep('Missing piece', 'compute', `${w} × ${h} = ?`, cut, {fact:fx(w, h)}),
        numStep('Area', 'compute', `${big} − ${cut} = ? square feet`, big - cut, {mis:v => v === big + cut ? 'compositeWrong' : v === big ? 'compositeWrong' : null})], answerSteps:[2]};
  },
  decompTri(lvl){
    const W = rand(4, 12), H = rand(3, 9), r = rand(2, 6), rect = W * H, tri2 = W * r;
    if (lvl < 3) {
      const poly = [[0, 0], [W, 0], [W, H], [W / 2, H + r], [0, H]];
      return {title:'Rooms', ctx:`house ${W}×${H} roof ${r}`, bubble:`The dog house front is a ${W} ft by ${H} ft rectangle with a triangle roof ${r} ft tall. What is the area of the whole front?`, helper:'Rectangle + triangle. The triangle is ½ × base × height.',
        visual:shapeSVG([poly], [[[W / 2, -0.9], `${W}`], [[-0.4, H / 2], `${H}`, 'end'], [[W / 2 + 0.3, H + r / 2], `${r}`, 'start']], [[[0, H], [W, H]], [[W / 2, H], [W / 2, H + r]]]),
        steps:[numStep('Rectangle', 'compute', `${W} × ${H} = ?`, rect, {fact:fx(W, H)}), halfAreaStep('Roof triangle', `½ × ${W} × ${r} = ?`, tri2, {mis:v => v === tri2 ? 'halfWrong' : null}),
          halfAreaStep('Total', `${rect} + ${half(tri2)} = ? square feet`, 2 * rect + tri2, {mis:v => Math.abs(v - (rect + tri2)) < 1e-9 ? 'halfWrong' : null})], answerSteps:[2]};
    }
    const t = rand(1, 4), top = rand(3, 9), bot = top + 2 * t, h = rand(3, 9);          // trapezoid = rectangle + two right triangles
    const poly = [[0, 0], [bot, 0], [bot - t, h], [t, h]];
    return {title:'Rooms', ctx:`trapezoid ${top}/${bot} h ${h}`, bubble:`The ramp side is a trapezoid: ${top} ft across the top, ${bot} ft across the bottom, and ${h} ft tall. Split it into a rectangle and two triangles.`, helper:'Each triangle has a base of (bottom − top) ÷ 2.',
      visual:shapeSVG([poly], [[[bot / 2, -0.9], `${bot}`], [[bot / 2, h + 0.4], `${top}`], [[t + 0.3, h / 2], `${h}`, 'start']], [[[t, 0], [t, h]], [[bot - t, 0], [bot - t, h]]]),
      steps:[numStep('Rectangle', 'compute', `${top} × ${h} = ?`, top * h, {fact:fx(top, h)}), halfAreaStep('Both triangles', `2 × ½ × ${t} × ${h} = ?`, 2 * t * h, {mis:v => v === 2 * t * h ? 'halfWrong' : null}),
        numStep('Total', 'compute', `${top * h} + ${t * h} = ? square feet`, top * h + t * h, {mis:v => v === top * h + 2 * t * h ? 'halfWrong' : null})], answerSteps:[2]};
  },

  /* ----- station 3: Yard Map (points and quadrants) ----- */
  pointsId(lvl){
    const R = lvl === 1 ? 6 : 8; let x, y; do { x = lvl === 1 ? rand(1, R) * pick([1, -1]) : nz(R); y = nz(R); } while (Math.abs(x) === Math.abs(y));
    const opts = choiceOf({text:pt(x, y)}, [{text:pt(y, x), mis:'coordSwap'}, {text:pt(-x, y), mis:'signWrong'}, {text:pt(x, -y), mis:'signWrong'}]);
    return {title:'Yard Map', ctx:`point ${pt(x, y)}`, bubble:'Where is the bone buried? Give the coordinates of point A.', helper:'(x, y): go left or right first (x), then up or down (y).', visual:planeSVG(R, [{x, y, name:'A'}]),
      steps:[{name:'Coordinates', type:'concept', kind:'choice', prompt:'What are the coordinates of A?', options:opts, hint:() => `Start at the origin. How far ${x > 0 ? 'right' : 'left'}? Then how far ${y > 0 ? 'up' : 'down'}?`}]};
  },
  graphQuad(lvl){
    let x = nz(9), y = nz(9); if (lvl === 3 && Math.random() < 0.3) { if (Math.random() < 0.5) x = 0; else y = 0; }
    const right = quadOf(x, y), all = ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV', ...(lvl === 3 ? ['the x-axis', 'the y-axis'] : [])];
    const swapQ = quadOf(y, x), flipQ = quadOf(-x, -y);
    const opts = choiceOf({text:right}, shuffle(all.filter(q => q !== right)).slice(0, 3).map(q => ({text:q, mis:q === swapQ ? 'coordSwap' : q === flipQ || q === quadOf(-x, y) || q === quadOf(x, -y) ? 'quadrantWrong' : null})));
    return {title:'Yard Map', ctx:`${pt(x, y)} in`, bubble:`The cat's ball is at ${pt(x, y)}. Where is it?`, helper:'Quadrant I is top right (+, +). Go counterclockwise: II (−, +), III (−, −), IV (+, −). A 0 means the point is on an axis.',
      visual:lvl === 1 ? planeSVG(9, [{x, y, name:'●'}]) : `<div style="text-align:center; font-size:2rem">📍 ${pt(x, y)}</div>`,
      steps:[{name:'Where', type:'concept', kind:'choice', prompt:`Where is ${pt(x, y)}?`, options:opts, hint:() => `x is ${x > 0 ? 'positive' : x < 0 ? 'negative' : '0'} and y is ${y > 0 ? 'positive' : y < 0 ? 'negative' : '0'}.`}]};
  },
  reflect(lvl){
    let x = nz(8), y = nz(8); while (Math.abs(x) === Math.abs(y)) y = nz(8);
    const axis = lvl === 3 ? pick(['x-axis', 'y-axis', 'both axes']) : pick(['x-axis', 'y-axis']);
    const ans = axis === 'x-axis' ? [x, -y] : axis === 'y-axis' ? [-x, y] : [-x, -y];
    const wrongs = [[axis === 'x-axis' ? -x : x, axis === 'x-axis' ? y : -y, 'reflectAxisWrong'], [-x, -y, 'reflectAxisWrong'], [x, -y, 'reflectAxisWrong'], [-x, y, 'reflectAxisWrong'], [y, x, 'coordSwap']];
    const opts = choiceOf({text:pt(...ans)}, wrongs.map(([a, b, m]) => ({text:pt(a, b), mis:m})).filter((w, i, arr) => w.text !== pt(x, y) && w.text !== pt(...ans) && arr.findIndex(u => u.text === w.text) === i).slice(0, 3));
    const across = axis === 'both axes' ? 'both axes' : `the ${axis}`;
    return {title:'Yard Map', ctx:`${pt(x, y)} over ${axis}`, bubble:`Reflect the doghouse at ${pt(x, y)} across ${across}. Where does it land?`, helper:'Across the x-axis, y changes sign. Across the y-axis, x changes sign.',
      visual:planeSVG(8, [{x, y, name:'D'}]),
      steps:[{name:'Reflection', type:'concept', kind:'choice', prompt:`${pt(x, y)} reflected across ${across} = ?`, options:opts, hint:() => axis === 'x-axis' ? 'Flip up or down: same x, opposite y.' : axis === 'y-axis' ? 'Flip left or right: opposite x, same y.' : 'Both numbers change sign.'}]};
  },

  /* ----- station 4: Fence Lines (distance, polygons, word problems) ----- */
  distPoints(lvl){
    const horiz = Math.random() < 0.5, k = nz(7); let a, b; do { a = lvl === 1 ? rand(0, 8) : rand(-8, 8); b = rand(-8, 8); } while (a === b || (lvl >= 2 && Math.sign(a) === Math.sign(b) && Math.random() < 0.7) || (lvl === 1 && b < 0 && a < 0));
    const P1 = horiz ? [a, k] : [k, a], P2 = horiz ? [b, k] : [k, b], d = Math.abs(a - b), fake = Math.abs(Math.abs(a) - Math.abs(b));
    return {title:'Fence Lines', ctx:`${pt(...P1)} to ${pt(...P2)}`, bubble:`How long is a fence from ${pt(...P1)} to ${pt(...P2)}? Each unit is 1 meter.`, helper:'Same ' + (horiz ? 'y' : 'x') + ', so count along the other coordinate. On opposite sides of 0, add the distances from 0.',
      visual:planeSVG(8, [{x:P1[0], y:P1[1], name:'P'}, {x:P2[0], y:P2[1], name:'Q'}]),
      steps:[numStep('Distance', 'compute', `Distance from ${pt(...P1)} to ${pt(...P2)} = ?`, d, {mis:v => v === fake && fake !== d ? 'negDistance' : null, hint:() => Math.sign(a) !== Math.sign(b) && a && b ? `${Math.abs(a)} to 0, then ${Math.abs(b)} more.` : `Subtract: ${Math.max(a, b)} − ${Math.min(a, b)}.`})]};
  },
  areaCoord(lvl){
    let x1, x2, y1, y2; do { x1 = rand(-7, 5); x2 = rand(x1 + 2, 7); y1 = rand(-7, 5); y2 = rand(y1 + 2, 7); } while (lvl >= 2 && !(x1 < 0 && x2 > 0 || y1 < 0 && y2 > 0));
    const w = x2 - x1, h = y2 - y1, ask = lvl === 3 ? 'perimeter' : 'area', corners = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
    return {title:'Fence Lines', ctx:`rect ${pt(x1, y1)} ${pt(x2, y2)} ${ask}`, bubble:`A garden has corners at ${corners.map(c => pt(...c)).join(', ')}. What is its ${ask}? Each unit is 1 yard.`, helper:'Find the length and width by counting between the coordinates.',
      visual:planeSVG(8, corners.map(([x, y]) => ({x, y})), corners),
      steps:[numStep('Width', 'compute', `From x = ${sgn(x1)} to x = ${sgn(x2)} = ?`, w, {mis:v => v === Math.abs(Math.abs(x2) - Math.abs(x1)) && v !== w ? 'negDistance' : null}),
        numStep('Height', 'compute', `From y = ${sgn(y1)} to y = ${sgn(y2)} = ?`, h, {mis:v => v === Math.abs(Math.abs(y2) - Math.abs(y1)) && v !== h ? 'negDistance' : null}),
        ask === 'area' ? numStep('Area', 'compute', `${w} × ${h} = ? square yards`, w * h, {fact:fx(w, h), mis:v => v === 2 * (w + h) ? 'areaPerimeterSwap' : null})
          : numStep('Perimeter', 'compute', `${w} + ${h} + ${w} + ${h} = ? yards`, 2 * (w + h), {mis:v => v === w * h ? 'areaPerimeterSwap' : v === w + h ? 'halfPerimeter' : null})], answerSteps:[2]};
  },
  coordWord(lvl){
    const places = shuffle([['🦴', 'the bone'], ['🐾', 'the pet door'], ['🥣', 'the food bowl'], ['🧸', 'the toy box'], ['🌳', 'the tree']]).slice(0, 2);
    const same = Math.random() < 0.5 ? 'x' : 'y', k = nz(6); let a, b; do { a = rand(-8, 8); b = rand(-8, 8); } while (a === b || (lvl >= 2 && Math.sign(a) === Math.sign(b)));
    const P1 = same === 'y' ? [a, k] : [k, a], P2 = same === 'y' ? [b, k] : [k, b], d = Math.abs(a - b);
    const move = lvl === 3 ? rand(1, 4) : 0, end = same === 'y' ? [P2[0], P2[1] + move] : [P2[0] + move, P2[1]];
    const bubble = lvl === 3 ? `The map is in meters. ${places[0][1].replace(/^./, m => m.toUpperCase())} is at ${pt(...P1)} and ${places[1][1]} is at ${pt(...P2)}. The dog walks from ${places[0][1]} to ${places[1][1]}, then ${move} m ${same === 'y' ? 'up' : 'right'}. How far does the dog walk?`
      : `The map is in meters. ${places[0][1].replace(/^./, m => m.toUpperCase())} is at ${pt(...P1)} and ${places[1][1]} is at ${pt(...P2)}. How far apart are they?`;
    const total = d + move;
    return {title:'Fence Lines', ctx:`${pt(...P1)} ${pt(...P2)} +${move}`, bubble, helper:'Points with the same x (or the same y) line up. Count the distance between the other coordinates.',
      visual:planeSVG(8, [{x:P1[0], y:P1[1], name:places[0][0]}, {x:P2[0], y:P2[1], name:places[1][0]}]),
      steps:[numStep('Distance', 'compute', `${places[0][1]} to ${places[1][1]} = ? m`, d, {mis:v => v === Math.abs(Math.abs(a) - Math.abs(b)) && v !== d ? 'negDistance' : null}),
        ...(move ? [numStep('Total walk', 'compute', `${d} + ${move} = ? m`, total, {})] : [])], answerSteps:[move ? 1 : 0]};
  }
};

/* ===== 6th grade, Pet Houses part 2 (Khan unit 10): volume and surface area ===== */
/* a box drawn at a slant: l across, h up, w back; labels are text */
function boxSVG(lt, wt, ht, {l = 5, w = 3, h = 3} = {}){
  const s = Math.min(170 / (l + w * 0.6), 110 / (h + w * 0.5)), dx = w * 0.6 * s, dy = w * 0.5 * s, L = l * s, H = h * s, x0 = 56, y0 = 20 + dy;   // room on the left for the height label
  const f = [[x0, y0], [x0 + L, y0], [x0 + L, y0 + H], [x0, y0 + H]], t = [[x0, y0], [x0 + dx, y0 - dy], [x0 + L + dx, y0 - dy], [x0 + L, y0]], r = [[x0 + L, y0], [x0 + L + dx, y0 - dy], [x0 + L + dx, y0 + H - dy], [x0 + L, y0 + H]];
  const poly = (p, c) => `<polygon points="${p.map(q => q.join(',')).join(' ')}" class="${c}"/>`;
  return `<svg class="shape-pic" viewBox="0 0 ${x0 + L + dx + 60} ${y0 + H + 30}" width="${x0 + L + dx + 60}" role="img" aria-label="box ${lt} by ${wt} by ${ht}">${poly(t, 'shape-fill shape-2')}${poly(r, 'shape-fill shape-3')}${poly(f, 'shape-fill')}`
    + `<text x="${x0 + L / 2}" y="${y0 + H + 20}" class="shape-lbl" text-anchor="middle">${lt}</text><text x="${x0 + L + dx / 2 + 8}" y="${y0 + H - dy / 2 + 14}" class="shape-lbl" text-anchor="start">${wt}</text><text x="${x0 - 6}" y="${y0 + H / 2}" class="shape-lbl" text-anchor="end">${ht}</text></svg>`;
}
/* nets: each is a list of polygons in grid units */
const NETS = {
  'rectangular prism':[[[1, 0], [3, 0], [3, 1], [1, 1]], [[0, 1], [1, 1], [1, 3], [0, 3]], [[1, 1], [3, 1], [3, 3], [1, 3]], [[3, 1], [4, 1], [4, 3], [3, 3]], [[4, 1], [6, 1], [6, 3], [4, 3]], [[1, 3], [3, 3], [3, 4], [1, 4]]],
  'cube':[[[1, 0], [2, 0], [2, 1], [1, 1]], [[0, 1], [1, 1], [1, 2], [0, 2]], [[1, 1], [2, 1], [2, 2], [1, 2]], [[2, 1], [3, 1], [3, 2], [2, 2]], [[3, 1], [4, 1], [4, 2], [3, 2]], [[1, 2], [2, 2], [2, 3], [1, 3]]],
  'square pyramid':[[[1, 1], [2, 1], [2, 2], [1, 2]], [[1, 1], [2, 1], [1.5, 0]], [[2, 1], [2, 2], [3, 1.5]], [[1, 2], [2, 2], [1.5, 3]], [[1, 1], [1, 2], [0, 1.5]]],
  'triangular prism':[[[0, 1], [1, 1], [1, 3], [0, 3]], [[1, 1], [2, 1], [2, 3], [1, 3]], [[2, 1], [3, 1], [3, 3], [2, 3]], [[1, 1], [2, 1], [1.5, 0.15]], [[1, 3], [2, 3], [1.5, 3.85]]],
  'triangular pyramid':[[[0, 0], [1, 0], [0.5, 0.87]], [[1, 0], [2, 0], [1.5, 0.87]], [[0.5, 0.87], [1.5, 0.87], [1, 1.73]], [[1, 0], [1.5, 0.87], [0.5, 0.87]]]
};
function netSVG(name){
  const polys = NETS[name], pts = polys.flat(), mx = Math.max(...pts.map(p => p[0])), my = Math.max(...pts.map(p => p[1])), s = Math.min(200 / mx, 150 / my);
  return `<svg class="shape-pic" viewBox="-6 -6 ${mx * s + 12} ${my * s + 12}" width="${mx * s + 12}" role="img" aria-label="a net">${polys.map(p => `<polygon points="${p.map(([x, y]) => `${x * s},${y * s}`).join(' ')}" class="shape-fill net-face"/>`).join('')}</svg>`;
}
const qt = r => RQ.txt(r);                                               // 5/2 → 2 1/2
const HALVES = [RQ.of(1, 2), RQ.of(3, 2), RQ.of(5, 2), RQ.of(1, 4), RQ.of(3, 4), RQ.of(5, 4), [2, 1], [3, 1], [4, 1], RQ.of(7, 2)];
const HOUSES2_GEN = {
  /* ----- station 5: Toy Boxes (volume) ----- */
  volPrism(lvl){
    const d = lvl === 1 ? [[rand(2, 9), 1], [rand(2, 9), 1], [rand(2, 6), 1]] : lvl === 2 ? [pick(HALVES.slice(0, 3)), [rand(2, 6), 1], [rand(2, 5), 1]] : [pick(HALVES), pick(HALVES), pick(HALVES)];
    const [l, w, h] = d, base = RQ.mul(l, w), V = RQ.mul(base, h);
    if (V[1] > 64) return HOUSES2_GEN.volPrism(lvl);
    const lw = [l[0] / l[1], w[0] / w[1], h[0] / h[1]];
    return {title:'Toy Boxes', ctx:`box ${qt(l)} × ${qt(w)} × ${qt(h)}`, bubble:`A pet toy box is ${qt(l)} ft long, ${qt(w)} ft wide, and ${qt(h)} ft tall. What is its volume?`, helper:'Volume = length × width × height. Find the area of the bottom first.',
      visual:boxSVG(`${qt(l)} ft`, `${qt(w)} ft`, `${qt(h)} ft`, {l:Math.max(1, lw[0]), w:Math.max(1, lw[1]), h:Math.max(1, lw[2])}),
      steps:[rqStep('Base area', `${qt(l)} × ${qt(w)} = ?`, base, {fact:l[1] === 1 && w[1] === 1 ? fx(l[0], w[0]) : undefined}),
        rqStep('Volume', `${qt(base)} × ${qt(h)} = ? cubic feet`, V, {simplest:true, mis:w2 => { const s = RQ.add(RQ.add(l, w), h); return w2[0] * s[1] === s[0] * w2[1] ? 'volumeAddWrong' : null; }}),
        (() => { const f = rqStep('The answer', `${qt(l)} × ${qt(w)} × ${qt(h)} = ?`, V, {simplest:true}); f.skipIf = () => true; return f; })()], answerSteps:[2]};
  },
  volCubes(lvl){
    const n = [rand(1, lvl === 1 ? 4 : 6), rand(1, 4), rand(1, lvl === 3 ? 5 : 3)], k = lvl === 3 ? pick([2, 4]) : 2;     // edges are n/k units, cubes are 1/k on a side
    if (n.every(x => x % k === 0)) n[0]++;
    const edges = n.map(x => RQ.of(x, k)), cubes = n[0] * n[1] * n[2], V = RQ.of(cubes, k * k * k);
    return {title:'Toy Boxes', ctx:`cubes 1/${k} in ${edges.map(qt).join('×')}`, bubble:`A treat box is ${edges.map(e => qt(e)).join(' in. by ')} in. It is packed with cubes that are 1/${k} in. on each side. How many cubes fit? What is the volume?`,
      helper:`Each cube is 1/${k} × 1/${k} × 1/${k} = 1/${k * k * k} cubic inch.`, visual:boxSVG(`${qt(edges[0])} in.`, `${qt(edges[1])} in.`, `${qt(edges[2])} in.`, {l:n[0], w:n[1], h:n[2]}),
      steps:[numStep('Cubes along each edge', 'compute', `${n[0]} × ${n[1]} × ${n[2]} = ?`, cubes, {hint:() => `${qt(edges[0])} in. holds ${n[0]} cubes of 1/${k} in.`}),
        rqStep('Volume', `${cubes} × 1/${k * k * k} = ? cubic inches`, V, {simplest:true, mis:w => w[1] === 1 && w[0] === cubes ? 'fracVolumeWrong' : null})], answerSteps:[1]};
  },
  volWord(lvl){
    const [e, n] = pick(LEMON_KIDS), D = [RQ.of(3, 2), [2, 1], RQ.of(5, 2), [3, 1], RQ.of(7, 2), [4, 1]], H = [[1, 1], RQ.of(3, 2), [2, 1], RQ.of(5, 2), RQ.of(3, 4), RQ.of(5, 4)];
    const l = pick(D), w = pick(D.slice(0, 4)), h = pick(H), base = RQ.mul(l, w), V = RQ.mul(base, h);
    if (lvl === 1) return {title:'Toy Boxes', ctx:`fish tank ${qt(l)}×${qt(w)}×${qt(h)}`, bubble:`${n}'s fish tank is ${qt(l)} ft long, ${qt(w)} ft wide, and ${qt(h)} ft deep. How much water fills it?`, helper:'Volume = length × width × height.',
      visual:boxSVG(`${qt(l)} ft`, `${qt(w)} ft`, `${qt(h)} ft`, {l:3, w:2, h:2}), steps:[rqStep('Base area', `${qt(l)} × ${qt(w)} = ? square feet`, base), rqStep('Volume', `${qt(base)} × ${qt(h)} = ? cubic feet`, V, {simplest:true})], answerSteps:[1]};
    return {title:'Toy Boxes', ctx:`V ${qt(V)} base ${qt(l)}×${qt(w)}`, bubble:`${n}'s hamster cage holds ${qt(V)} cubic feet. Its floor is ${qt(l)} ft by ${qt(w)} ft. How tall is it?`, helper:'Volume = base area × height, so height = volume ÷ base area.',
      visual:boxSVG(`${qt(l)} ft`, `${qt(w)} ft`, '? ft', {l:3, w:2, h:2}),
      steps:[rqStep('Base area', `${qt(l)} × ${qt(w)} = ? square feet`, base), rqStep('Height', `${qt(V)} ÷ ${qt(base)} = ? feet`, h, {simplest:true, mis:w2 => { const p = RQ.mul(V, base); return w2[0] * p[1] === p[0] * w2[1] ? 'fracVolumeWrong' : null; }})], answerSteps:[1]};
  },
  /* ----- station 6: Wrapping Paper (nets and surface area) ----- */
  netsId(lvl){
    const names = Object.keys(NETS), right = pick(lvl === 1 ? ['cube', 'rectangular prism', 'square pyramid'] : names);
    const wrongs = shuffle(names.filter(nm => nm !== right)).slice(0, 3).map(nm => ({text:nm, mis:'netWrong'}));
    return {title:'Wrapping Paper', ctx:`net of ${right}`, bubble:'Fold up this net. What shape does it make?', helper:'Count the faces and look at their shapes: squares, rectangles, or triangles.', visual:netSVG(right),
      steps:[{name:'Which shape', type:'concept', kind:'choice', prompt:'What 3D shape does the net make?', options:choiceOf({text:right}, wrongs), hint:() => right.includes('pyramid') ? 'Triangles meet at a point: a pyramid.' : right.includes('triangular') ? 'Two triangle ends and rectangles around the side.' : 'Six faces, all rectangles (or all squares).'}]};
  },
  surfaceArea(lvl){
    const l = rand(2, lvl === 1 ? 6 : 10), w = rand(2, 8), h = lvl === 1 ? w : rand(2, 9), a = l * w, b = l * h, c = w * h, SA = 2 * (a + b + c);
    return {title:'Wrapping Paper', ctx:`SA ${l}×${w}×${h}`, bubble:`How much wrapping paper covers a gift box ${l} in. by ${w} in. by ${h} in., with no overlap?`, helper:'Surface area = the area of all 6 faces. Opposite faces match, so find 3 areas and double each.',
      visual:boxSVG(`${l} in.`, `${w} in.`, `${h} in.`, {l, w, h}),
      steps:[numStep('Top and bottom', 'compute', `2 × ${l} × ${w} = ?`, 2 * a, {fact:fx(l, w), mis:v => v === a ? 'surfaceMissingFaces' : null}), numStep('Front and back', 'compute', `2 × ${l} × ${h} = ?`, 2 * b, {mis:v => v === b ? 'surfaceMissingFaces' : null}),
        numStep('Left and right', 'compute', `2 × ${w} × ${h} = ?`, 2 * c, {mis:v => v === c ? 'surfaceMissingFaces' : null}),
        numStep('Surface area', 'compute', `${2 * a} + ${2 * b} + ${2 * c} = ? square inches`, SA, {mis:v => v === a + b + c ? 'surfaceMissingFaces' : v === l * w * h ? 'volumeAddWrong' : null})], answerSteps:[3]};
  },
  surfacePyramid(lvl){
    const s = rand(2, lvl === 1 ? 6 : 12), t = rand(s, s + 8), base = s * s, tri2 = s * t;                 // t is the height of each triangle face
    return {title:'Wrapping Paper', ctx:`pyramid ${s} slant ${t}`, bubble:`A pet tent is a square pyramid. The square base is ${s} ft on each side, and each triangle face is ${t} ft tall. What is the surface area, including the floor?`, helper:'1 square + 4 triangles. Each triangle is ½ × base × height.',
      visual:netSVG('square pyramid'),
      steps:[numStep('Square base', 'compute', `${s} × ${s} = ?`, base, {fact:fx(s, s)}), halfAreaStep('One triangle', `½ × ${s} × ${t} = ?`, tri2, {mis:v => v === tri2 ? 'halfWrong' : null}),
        numStep('Four triangles', 'compute', `4 × ${half(tri2)} = ?`, 2 * tri2, {mis:v => v * 2 === tri2 ? 'surfaceMissingFaces' : null}),
        numStep('Surface area', 'compute', `${base} + ${2 * tri2} = ? square feet`, base + 2 * tri2, {mis:v => v === 2 * tri2 ? 'surfaceMissingFaces' : v === base + tri2 ? 'surfaceMissingFaces' : null})], answerSteps:[3]};
  }
};
```
