/* Drawing kit for the Word Workshop cartoons (docs/WORD-PICTURES.md). Each helper returns a small SVG string in a
   200 x 200 picture. Pet World's palette (src/styles/game.css :root), thick round outlines, flat colors.
   Pets stand with their feet at (x, y); at scale 1 a pet is about 120 tall. */
export const C = {
  ink: '#4A2E2A', berry: '#E4577A', deep: '#B83659', mint: '#7FD1B9', green: '#3BAA85', butter: '#FFD76A',
  wood: '#9A6A45', woodDark: '#7A4F31', grass: '#CDEBC0', grass2: '#9FD48C', path: '#F3E3C3', bg: '#FDE8EE',
  pink: '#FF9DB2', white: '#FFFFFF', sky: '#D6EEF8', blue: '#7EC3E6', orange: '#F5A25D', gray: '#BDB3B6',
  cream: '#FFF4E2', dark: '#5B4A57', soft: '#7A5A55'
};
const n = v => Math.round(v * 10) / 10;
const pts = a => a.map(([x, y]) => `${n(x)},${n(y)}`).join(' ');

export function svg(inner, bg = C.bg){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="28" fill="${bg}"/>` +
    `<g stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>\n`;
}
export const g = (inner, { x = 0, y = 0, s = 1, flip = false, rot = 0 } = {}) =>
  `<g transform="translate(${n(x)} ${n(y)})${rot ? ` rotate(${rot})` : ''}${s !== 1 || flip ? ` scale(${flip ? -s : s} ${s})` : ''}">${inner}</g>`;
export const circle = (x, y, r, fill = C.white, extra = '') => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${fill}"${extra}/>`;
export const ellipse = (x, y, rx, ry, fill = C.white, extra = '') => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fill}"${extra}/>`;
export const rect = (x, y, w, h, fill = C.white, r = 6, extra = '') => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${r}" fill="${fill}"${extra}/>`;
export const path = (d, fill = 'none', extra = '') => `<path d="${d}" fill="${fill}"${extra}/>`;
export const poly = (a, fill = C.white, extra = '') => `<polygon points="${pts(a)}" fill="${fill}"${extra}/>`;
export const line = (x1, y1, x2, y2, extra = '') => `<path d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}" fill="none"${extra}/>`;
export const noStroke = ' stroke="none"';
export const sw = w => ` stroke-width="${w}"`;
export const text = (x, y, t, size = 30, fill = C.ink) =>
  `<text x="${n(x)}" y="${n(y)}" font-family="Grandstander,Trebuchet MS,Arial,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${fill}" stroke="none">${t}</text>`;

/* a limb: an outlined thick stroke from (x1,y1) to (x2,y2), with an optional bend point */
export function limb(x1, y1, x2, y2, color, bend){
  const d = bend ? `M${n(x1)} ${n(y1)}Q${n(bend[0])} ${n(bend[1])} ${n(x2)} ${n(y2)}` : `M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}`;
  return `<path d="${d}" fill="none" stroke-width="15"/><path d="${d}" fill="none" stroke="${color}" stroke-width="6"/>`;
}

const LIGHT = { [C.orange]: '#FFE3C4', [C.butter]: '#FFF4CC', [C.wood]: '#E8CBA8', [C.white]: '#FFE9EF', [C.gray]: '#EFE9EB', '#E9E1D8': '#FFFFFF', [C.dark]: '#9C8A97', '#C98B5E': '#F3D9BF' };

/* face moods: happy, smile, sad, worried, wow, angry, sleepy, determined, calm, shy */
function face(mood, kind, look = 0, ink = C.ink){
  const ex = 12, ey = -76, lx = look * 3;
  let eyes = '', mouth = '', brows = '';
  const dot = (x) => circle(x + lx, ey, 4.5, ink, noStroke) + circle(x + lx + 1.5, ey - 1.6, 1.4, C.white, noStroke);
  if (mood === 'happy' || mood === 'shy') eyes = path(`M${-ex - 6} ${ey + 2}q6 -8 12 0M${ex - 6} ${ey + 2}q6 -8 12 0`, 'none', sw(4));
  else if (mood === 'sleepy') eyes = path(`M${-ex - 6} ${ey}q6 5 12 0M${ex - 6} ${ey}q6 5 12 0`, 'none', sw(4));
  else if (mood === 'wow') eyes = circle(-ex, ey, 8, C.white, sw(3.5)) + circle(ex, ey, 8, C.white, sw(3.5)) + circle(-ex + lx, ey, 4, ink, noStroke) + circle(ex + lx, ey, 4, ink, noStroke);
  else eyes = dot(-ex) + dot(ex);
  if (mood === 'sad' || mood === 'worried') brows = path(`M${-ex - 6} ${ey - 9}l11 -4M${ex + 6} ${ey - 9}l-11 -4`, 'none', sw(3.5));
  if (mood === 'angry' || mood === 'determined') brows = path(`M${-ex - 7} ${ey - 13}l12 5M${ex + 7} ${ey - 13}l-12 5`, 'none', sw(4));
  const my = kind === 'dog' ? -58 : -61;
  if (mood === 'happy' || mood === 'smile' || mood === 'determined' && false) mouth = path(`M-8 ${my}q8 10 16 0z`, C.deep, sw(3.5));
  else if (mood === 'calm' || mood === 'shy') mouth = path(`M-5 ${my}q5 5 10 0`, 'none', sw(3.5));
  else if (mood === 'sad') mouth = path(`M-7 ${my + 4}q7 -7 14 0`, 'none', sw(3.5));
  else if (mood === 'worried') mouth = path(`M-8 ${my + 2}q4 -4 8 0t8 0`, 'none', sw(3.5));
  else if (mood === 'wow') mouth = ellipse(0, my + 2, 5, 7, C.deep, sw(3.5));
  else if (mood === 'angry') mouth = path(`M-8 ${my + 3}q8 -6 16 0`, 'none', sw(3.5));
  else if (mood === 'determined') mouth = path(`M-7 ${my + 1}h14`, 'none', sw(3.5));
  else if (mood === 'sleepy') mouth = ellipse(0, my + 1, 3, 4, C.deep, sw(3));
  else mouth = path(`M-6 ${my}q6 6 12 0`, 'none', sw(3.5));
  const cheeks = mood === 'angry' ? '' : circle(-21, -63, mood === 'shy' ? 7 : 5, C.pink, ' stroke="none" opacity=".8"') + circle(21, -63, mood === 'shy' ? 7 : 5, C.pink, ' stroke="none" opacity=".8"');
  return cheeks + eyes + brows + mouth;
}

/* pet({kind:'cat'|'dog'|'bunny', color, mood, look:-1..1, arms:[[x,y],[x,y]] (paw positions or null), tail, wag}) */
export function pet({ kind = 'cat', color, mood = 'smile', look = 0, arms = [], tail = true, wag = false, legs = null, extra = '', top = '' } = {}){
  color = color || (kind === 'cat' ? C.orange : kind === 'dog' ? C.wood : C.white);
  const light = LIGHT[color] || C.cream;
  let o = '';
  if (tail) {
    if (kind === 'cat') o += path('M20 -16q30 -4 22 -36', 'none', ' stroke-width="15"') + path('M20 -16q30 -4 22 -36', 'none', ` stroke="${color}" stroke-width="6"`);
    if (kind === 'dog') o += path('M22 -22q16 -6 18 -24', 'none', ' stroke-width="14"') + path('M22 -22q16 -6 18 -24', 'none', ` stroke="${color}" stroke-width="5"`) + (wag ? path('M48 -50q6 6 4 14M54 -58q9 9 6 22', 'none', sw(3.5)) : '');
    if (kind === 'bunny') o += circle(24, -14, 9, C.white);
  }
  if (kind === 'bunny') o += ellipse(-13, -118, 9, 26, color, ' transform="rotate(-8 -13 -118)"') + ellipse(13, -118, 9, 26, color, ' transform="rotate(8 13 -118)"') +
    ellipse(-13, -116, 3.5, 16, C.pink, ' stroke="none" transform="rotate(-8 -13 -118)"') + ellipse(13, -116, 3.5, 16, C.pink, ' stroke="none" transform="rotate(8 13 -118)"');
  if (kind === 'cat') o += poly([[-28, -86], [-25, -116], [-3, -100]], color) + poly([[28, -86], [25, -116], [3, -100]], color) +
    poly([[-23, -93], [-22, -107], [-11, -99]], C.pink, noStroke) + poly([[23, -93], [22, -107], [11, -99]], C.pink, noStroke);
  /* legs: [[x,y],[x,y]] foot positions relative to hips, for walking/jumping poses */
  if (legs) o += legs.map(([x, y], i) => limb(i ? 10 : -10, -14, x, y, color) + ellipse(x, y + 2, 10, 6, color)).join('');
  o += ellipse(0, -30, 26, 28, color) + ellipse(0, -26, 15, 17, light, noStroke);
  if (!legs) o += ellipse(-13, -3, 11, 6.5, color) + ellipse(13, -3, 11, 6.5, color);
  o += circle(0, -74, 32, color);
  if (kind === 'dog') o += ellipse(-30, -76, 10, 20, C.woodDark === color ? C.wood : (color === C.wood ? C.woodDark : '#C98B5E'), ' transform="rotate(25 -30 -76)"') +
    ellipse(30, -76, 10, 20, C.woodDark === color ? C.wood : (color === C.wood ? C.woodDark : '#C98B5E'), ' transform="rotate(-25 30 -76)"') +
    ellipse(0, -62, 13, 10, light, noStroke) + ellipse(0, -66, 5, 3.5, C.ink, noStroke);
  else o += poly([[-4, -68], [4, -68], [0, -64]], C.pink, sw(2.5));
  if (kind === 'cat') o += path('M-30 -64l-12 -2M-30 -59l-11 3M30 -64l12 -2M30 -59l11 3', 'none', sw(2.5));
  o += face(mood, kind, look);
  o += top;
  /* arms go on top: a raised paw must be held wide (|x| >= 48) so it never covers the face */
  o += arms.map((a, i) => {
    if (!a) return '';
    const sx = i ? 22 : -22, sy = -42;
    return limb(sx, sy, a[0], a[1], color, a[2]) + circle(a[0], a[1], 7, color, sw(4));
  }).join('');
  return o + extra;
}
export const P = (opts, at) => g(pet(opts), at);

/* props */
export const heart = (x, y, s = 1, fill = C.berry) => g(path('M0 8C-14 -2 -12 -14 -5 -14C-2 -14 0 -11 0 -9C0 -11 2 -14 5 -14C12 -14 14 -2 0 8z', fill, sw(4)), { x, y, s });
export function star(x, y, r = 12, fill = C.butter){
  const a = []; for (let i = 0; i < 10; i++){ const t = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.48 : r; a.push([x + rr * Math.cos(t), y + rr * Math.sin(t)]); }
  return poly(a, fill, sw(3.5));
}
export const sparkle = (x, y, r = 8, color = C.butter) => path(`M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}z`, color, sw(3));
export const check = (x, y, s = 1, color = C.green) => g(path('M-12 0l8 9l16 -18', 'none', ` stroke="${color}" stroke-width="9"`), { x, y, s });
export const cross = (x, y, s = 1, color = C.berry) => g(path('M-10 -10l20 20M10 -10l-20 20', 'none', ` stroke="${color}" stroke-width="9"`), { x, y, s });
export const arrow = (x1, y1, x2, y2, color = C.ink, w = 6) => {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 11;
  const p1 = [x2 - h * Math.cos(a - 0.6), y2 - h * Math.sin(a - 0.6)], p2 = [x2 - h * Math.cos(a + 0.6), y2 - h * Math.sin(a + 0.6)];
  return path(`M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}M${n(p1[0])} ${n(p1[1])}L${n(x2)} ${n(y2)}L${n(p2[0])} ${n(p2[1])}`, 'none', ` stroke="${color}" stroke-width="${w}"`);
};
export const curveArrow = (d, end, ang, color = C.ink) => path(d, 'none', ` stroke="${color}" stroke-width="6"`) +
  g(path('M-9 -8L0 0L-9 8', 'none', ` stroke="${color}" stroke-width="6"`), { x: end[0], y: end[1], rot: ang });
/* speech bubble with tail pointing to (tx,ty) */
export function bubble(x, y, w, h, tx, ty, fill = C.white){
  const cx = x + w / 2, bx = Math.max(x + 14, Math.min(x + w - 26, tx - 6));
  const by = ty > y + h ? y + h : y;
  return path(`M${bx} ${by}L${tx} ${ty}L${bx + 14} ${by}`, fill) + rect(x, y, w, h, fill, 16) + path(`M${bx + 2} ${by}h10`, 'none', ` stroke="${fill}" stroke-width="6"`);
}
/* thought cloud centred at (x,y), dots trailing to (tx,ty) */
export function thought(x, y, rx, ry, tx, ty, fill = C.white){
  const dx = tx - x, dy = ty - y;
  return circle(x + dx * 0.72, y + dy * 0.72, 4, fill, sw(3.5)) + circle(x + dx * 0.55, y + dy * 0.55, 6.5, fill, sw(3.5)) +
    ellipse(x, y, rx, ry, fill);
}
export const magnifier = (x, y, r = 16, rot = 40) => g(path(`M0 ${r}L0 ${r + 22}`, 'none', ' stroke-width="12"') + path(`M0 ${r + 2}L0 ${r + 20}`, 'none', ` stroke="${C.wood}" stroke-width="5"`) + circle(0, 0, r, '#E8F7FF', sw(6) + ' fill-opacity=".35"') + path(`M${-r * 0.5} ${-r * 0.2}q${r * 0.2} ${-r * 0.4} ${r * 0.55} ${-r * 0.4}`, 'none', ` stroke="${C.white}" stroke-width="4"`), { x, y, rot: -rot });
export const carrot = (x, y, s = 1, rot = 0) => g(path('M-7 -14L7 -14L0 20z', C.orange, sw(4)) + path('M-2 -14l-6 -10M2 -14l6 -10M0 -14v-12', 'none', ` stroke="${C.green}" stroke-width="4"`) + path('M-3 -4h4M-2 6h3', 'none', sw(2.5)), { x, y, s, rot });
export const cookie = (x, y, r = 12) => circle(x, y, r, '#E3A55F', sw(4)) + circle(x - r * .35, y - r * .3, r * .14, C.ink, noStroke) + circle(x + r * .35, y - r * .05, r * .14, C.ink, noStroke) + circle(x - r * .05, y + r * .4, r * .14, C.ink, noStroke);
export const ball = (x, y, r = 12, fill = C.berry) => circle(x, y, r, fill) + path(`M${x - r} ${y}q${r} ${r * 0.6} ${2 * r} 0`, 'none', ` stroke="${C.white}" stroke-width="3.5"`);
export const cloud = (x, y, s = 1, fill = C.white) => g(path('M-26 12q-16 0 -14 -14q2 -12 16 -10q4 -16 22 -14q16 2 16 16q14 0 14 12q0 10 -12 10z', fill), { x, y, s });
export const sun = (x, y, r = 14) => path(Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `M${n(x + (r + 6) * Math.cos(a))} ${n(y + (r + 6) * Math.sin(a))}L${n(x + (r + 13) * Math.cos(a))} ${n(y + (r + 13) * Math.sin(a))}`; }).join(''), 'none', ` stroke="${C.orange}" stroke-width="5"`) + circle(x, y, r, C.butter);
export const ground = (y = 172, fill = C.grass) => path(`M0 ${y}H200V172q0 28 -28 28H28Q0 200 0 172z`, fill, noStroke) + line(4, y, 196, y);
export const sweat = (x, y) => path(`M${x} ${y}q-6 8 0 10q6 -2 0 -10z`, C.blue, sw(3));
export const bulb = (x, y, s = 1) => g(circle(0, 0, 9, C.butter, sw(3.5)) + rect(-5, 8, 10, 7, C.gray, 2, sw(3)), { x, y, s });
export const paw = (x, y, s = 1, fill = C.ink) => g(ellipse(0, 6, 10, 8, fill, noStroke) + ellipse(-11, -5, 4, 5, fill, noStroke) + ellipse(-4, -12, 4, 5, fill, noStroke) + ellipse(4, -12, 4, 5, fill, noStroke) + ellipse(11, -5, 4, 5, fill, noStroke), { x, y, s });
export const motion = (x, y, dir = 1) => path(`M${x} ${y}h${-dir * 14}M${x} ${y + 9}h${-dir * 20}M${x} ${y + 18}h${-dir * 12}`, 'none', sw(3.5));
