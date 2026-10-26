/* Independent answer checkers for the Pet Café (Unit 1, ratios) and the Bakery (Unit 2, arithmetic with rational numbers).
   Loaded as a plain browser script by scripts/check-math.mjs. Each solver reads only what the student sees (the story,
   the picture, the choices, and step names/labels/slots) and works the answer out with its own math. It never reads
   p.ctx or any step's answer, eq, ok, mis, hint, or a worked prompt. */
(function(){
  const O = window.ORACLES = window.ORACLES || {};
  const strip = h => String(h || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
  const dom = h => new DOMParser().parseFromString(`<div>${h || ''}</div>`, 'text/html').body.firstChild;
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const must = (m, what) => { if (!m) throw new Error(`can't read ${what}`); return m; };
  /* exact decimals as {i, p}: 2.45 is {i:245, p:2} */
  const D = s => { const [w, f = ''] = String(s).split('.'); return {i:Number(w + f), p:f.length}; };
  const fmt = (i, p) => { const neg = i < 0; let s = String(Math.abs(i)).padStart(p + 1, '0'); s = p ? s.slice(0, -p) + '.' + s.slice(-p) : s; return (neg ? '-' : '') + s; };
  const decAdd = (a, b, sign = 1) => { const A = D(a), B = D(b), p = Math.max(A.p, B.p); return parseFloat(fmt(A.i * 10 ** (p - A.p) + sign * B.i * 10 ** (p - B.p), p)); };
  const decMul = (a, b) => { const A = D(a), B = D(b); return parseFloat(fmt(A.i * B.i, A.p + B.p)); };
  const decDiv = (a, b) => {   // exact quotient as a terminating decimal (up to 12 places)
    const A = D(a), B = D(b); let num = A.i * 10 ** B.p, den = B.i * 10 ** A.p;
    const g = gcd(num, den); num /= g; den /= g;
    let s = String(Math.floor(num / den)), r = num % den, k = 0;
    if (r) { s += '.'; while (r && k < 12) { r *= 10; s += Math.floor(r / den); r %= den; k++; } }
    return parseFloat(s);
  };
  /* "3/4", "2 1/3", "5" → value */
  const fv = s => { const m = String(s).trim().match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/); if (m) return (m[1] ? +m[1] : 0) + m[2] / m[3]; return +s; };
  const FR = '(\\d+(?:\\s+\\d+\\/\\d+)?|\\d+\\/\\d+)';
  const ticks = v => [...dom(v).querySelectorAll('.dnl-tick')].map(t => { const [top, bot] = t.querySelectorAll('.v');
    const cell = el => { const s = el.querySelector('[data-slot]'); return s ? {slot:s.dataset.slot} : +el.textContent.trim(); };
    return {t:cell(top), b:cell(bot)}; });
  const fillSteps = p => p.steps.filter(s => s.slot && !/multiplier|divisor|jump/i.test(s.name));
  const lastStep = p => p.steps[p.steps.length - 1];
  const choiceStep = p => p.steps.find(s => s.kind === 'choice');
  const pickOpt = (p, test, st = choiceStep(p)) => { const hits = st.options.filter(o => test(o)); return hits.length === 1 ? hits[0].text : `NO UNIQUE (${hits.length})`; };

  /* ================= Pet Café: Unit 1 ratios ================= */
  O.basic = p => {
    const ratio = p.steps.find(s => s.name === 'Write the ratio'), first = ratio.labels[0];
    const tray = [...dom(p.visual).querySelectorAll('.tray span')].map(s => s.textContent.trim());
    const whole = /to all the treats/.test(p.bubble);
    const x = tray.filter(e => e === first).length, y = whole ? tray.length : tray.filter(e => e === ratio.labels[1]).length;
    if (/simplest form/i.test(lastStep(p).name)) { const g = gcd(x, y); return [x / g, y / g]; }
    return [x, y];
  };
  O.tape = p => {
    const b = strip(p.bubble), m = must(b.match(/use (.+?) and (.+?) in the ratio (\d+) to (\d+)\./), 'ratio');
    const [nA, nB, a, bb] = [m[1], m[2], +m[3], +m[4]];
    let t = b.match(/I have (\d+) treats\. How many (.+?) is that\?/);
    if (t) return +t[1] / (a + bb) * (t[2] === nA ? a : bb);
    t = must(b.match(/I used (\d+) (.+?)\. How many (.+?) do I need\?/), 'given part');
    const each = +t[1] / (t[2] === nA ? a : bb);
    return each * (t[3] === nA ? a : bb);
  };
  O.groups = p => {
    const m = must(strip(p.bubble).match(/gets (\d+) (.+?) and (\d+) (.+?)\. We (?:baked|have) (\d+) (.+?)\. How many (.+?) do we need/), 'box');
    const norm = w => { const [h, ...r] = w.split(' '); return [h.replace(/ies$/, 'y').replace(/ie$/, 'y').replace(/(ch|sh|x)es$/, '$1').replace(/s$/, ''), ...r].join(' '); };   // "1 apple" and "8 apples" name the same thing
    const per = {[norm(m[2])]: +m[1], [norm(m[4])]: +m[3]};
    return +m[5] / per[norm(m[6])] * per[norm(m[7])];
  };
  O.dnlCreate = p => {
    const m = must(strip(p.bubble).match(/uses (\d+) .+? for every (\d+) /), 'rate'), a = +m[1], b = +m[2];
    const fills = fillSteps(p), key = fills[fills.length - 1], tk = ticks(p.visual);
    const i = tk.findIndex(t => (t.t && t.t.slot === key.slot) || (t.b && t.b.slot === key.slot));
    return (tk[i].t && tk[i].t.slot === key.slot ? a : b) * i;
  };
  O.dnl = p => {
    const tk = ticks(p.visual), a = tk[1].t, b = tk[1].b, far = tk[tk.length - 1];
    return typeof far.t === 'number' ? far.t / a * b : far.b / b * a;
  };
  O.dnlTable = p => {
    const tk = ticks(p.visual), a = tk[1].t, b = tk[1].b;
    return pickOpt(p, o => [...dom(o.html).querySelectorAll('tr')].map(tr => [...tr.querySelectorAll('td')].map(td => +td.textContent))
      .filter(r => r.length === 2).every(([x, y]) => x * b === y * a));
  };
  O.table = p => {   // scale up (×) or down (÷): the blank in the last answer row keeps the base row's ratio
    const rows = [...dom(p.visual).querySelectorAll('table.ratio tbody tr')].map(tr => [...tr.querySelectorAll('td')]);
    const base = rows[0].slice(1).map(td => +td.textContent), fills = fillSteps(p), key = fills[fills.length - 1];
    const row = rows.find(r => r.some(td => td.querySelector(`[data-slot="${key.slot}"]`))).slice(1);
    const g = row.findIndex(td => !td.querySelector('[data-slot]')), gv = +row[g].textContent;
    return gv / base[g] * base[1 - g];
  };
  O.equiv = p => {
    const m = must(strip(p.visual).match(/(\d+) \S+ : (\d+)/), 'ratio'), a = +m[1], b = +m[2];
    const simplest = /simplest/i.test(choiceStep(p).prompt);
    return pickOpt(p, o => { const [x, y] = o.text.split(':').map(Number); return x * b === y * a && (simplest ? gcd(x, y) === 1 : x > a); });
  };
  O.word = p => {
    const v = strip(p.visual), r = must(v.match(/recipe: (\d+) (\S+) for every (\d+) (\S+) Today: (\d+) (\S+) and \? (\S+)/), 'recipe');
    const per = {[r[2]]: +r[1], [r[4]]: +r[3]};
    return +r[5] / per[r[6]] * per[r[7]];
  };
  O.realworld = p => {
    const rows = [...dom(p.visual).querySelectorAll('tbody tr')].map(tr => [...tr.querySelectorAll('td')].slice(1).map(td => +td.textContent));
    const [[a, b], [x, y]] = rows;
    return x * b === y * a ? 'Same recipe' : 'Not the same';
  };
  O.understand = p => {
    const m = must(strip(p.visual).match(/(\d+) \S+ : (\d+)/), 'ratio'), a = +m[1], b = +m[2];
    const prop = (x, y) => x * b === y * a && x % a === 0 && x / a > 1;
    if (/tastes different/.test(p.bubble)) return pickOpt(p, o => { const [x, y] = (o.text.match(/\d+/g) || []).map(Number); return !prop(x, y); });
    const used = strip(p.bubble).match(/used (\d+) .+? and (\d+) .+?\. It tastes just like/);
    if (used) {   // why it tastes the same: name the multiplier that fits both amounts
      const x = +used[1], y = +used[2], k = x / a;
      if (!(prop(x, y))) return 'NOT EQUIVALENT';
      return pickOpt(p, o => o.text === `Both amounts were multiplied by ${k}`);
    }
    return pickOpt(p, o => /^Use \d+ times as much of both$/.test(o.text));
  };
  O.coord = p => {
    const rows = [...dom(p.visual).querySelectorAll('table.mini tr')].map(tr => [...tr.querySelectorAll('td')].map(td => +td.textContent)).filter(r => r.length === 2);
    const [a, b] = rows[0], n = +must(lastStep(p).prompt.match(/It has (\d+)/), 'point')[1];
    return n / a * b;
  };
  O.units = p => {
    const th = [...dom(p.visual).querySelectorAll('table.mini th')].map(x => x.textContent.trim());
    const row = [...dom(p.visual).querySelectorAll('table.mini tr')][1], [one, f] = [...row.querySelectorAll('td')].map(td => +td.textContent);
    if (one !== 1) throw new Error('table row 1');
    const m = must(strip(p.bubble).match(/needs (\d+) (.+?)\. My measuring tool only shows (.+?)\./), 'amount');
    const n = +m[1], from = m[2], small = th[1];
    return from === small ? n / f : n * f;
  };
  O.ppw = p => {
    const b = strip(p.bubble), r = must(b.match(/has (.+?) and (.+?) in a (\d+) to (\d+) ratio\./), 'ratio');
    const per = {[r[1]]: +r[3], [r[2]]: +r[4]}, parts = +r[3] + +r[4];
    let t = b.match(/There are (\d+) treats in all\. How many (.+?)\?/);
    if (t) return +t[1] / parts * per[t[2]];
    t = must(b.match(/It has (\d+) (.+?)\. How many treats are on the whole platter\?/), 'part');
    return +t[1] / per[t[2]] * parts;
  };

  /* ================= Bakery: Unit 2 ================= */
  const NUM = '(\\d+(?:\\.\\d+)?)';
  O.addDec = p => { const m = must(strip(p.bubble).match(new RegExp(`I put ${NUM} kg of .+? and ${NUM} kg of`)), 'amounts'); return decAdd(m[1], m[2]); };
  O.subDec = p => { const m = must(strip(p.bubble).match(new RegExp(`had ${NUM} kg of .+?\\. I used ${NUM} kg`)), 'amounts'); return decAdd(m[1], m[2], -1); };
  O.decWord = p => {
    const b = strip(p.bubble); let m;
    if ((m = b.match(new RegExp(`costs \\$${NUM} and .+? costs \\$${NUM}\\. How much do they cost together`)))) return decAdd(m[1], m[2]);
    if ((m = b.match(new RegExp(`cost \\$${NUM}\\. I paid with a \\$(\\d+) bill\\. How much change`)))) return decAdd(m[2], m[1], -1);
    if ((m = b.match(new RegExp(`One ribbon is ${NUM} m long and another is ${NUM} m long\\. How long are they end to end`)))) return decAdd(m[1], m[2]);
    m = must(b.match(new RegExp(`A ribbon is ${NUM} m long\\. I cut off ${NUM} m .*How much ribbon is left`)), 'story');
    return decAdd(m[1], m[2], -1);
  };
  O.fracDivWhole = p => { const m = must(strip(p.bubble).match(/There's (\d+)\/(\d+) of a pan .+?\. (\d+) friends share it equally/), 'pan'); return +m[1] / +m[2] / +m[3]; };
  O.wholeDivFrac = p => { const m = must(strip(p.bubble).match(/I have (\d+) cups of .+?\. Each .+? uses (\d+)\/(\d+) cup\./), 'cups'); return +m[1] / (+m[2] / +m[3]); };
  O.fracDiv = p => { const m = must(strip(p.bubble).match(/(\d+)\/(\d+) ÷ (\d+)\/(\d+)/), 'division'); return (+m[1] / +m[2]) / (+m[3] / +m[4]); };
  O.mixedDiv = p => { const m = must(strip(p.bubble).match(new RegExp(`I have ${FR} pounds of .+?\\. Each box holds ${FR} pounds?\\.`)), 'amounts'); return fv(m[1]) / fv(m[2]); };
  O.fracInterp = p => {
    const b = strip(p.bubble); let m = b.match(/(\d+)\/(\d+) ÷ (\d+)\/(\d+)/);
    if (m) return (+m[1] / +m[2]) / (+m[3] / +m[4]);
    m = must(b.match(/We have (\d+)\/(\d+) \w+ of .+?\. Each box holds (\d+)\/(\d+) \w+\. How many boxes/), 'story');
    return (+m[1] / +m[2]) / (+m[3] / +m[4]);
  };
  O.fracWord = p => {
    const b = strip(p.bubble);
    let m = b.match(/^(\d+)\/(\d+) \w+ of .+? fills (\d+)\/(\d+) of a big tin\. How many \w+ fill the whole tin\?/);
    if (m) return (+m[1] / +m[2]) / (+m[3] / +m[4]);   // a/b is c/d of the tin, so the tin is a/b ÷ c/d
    m = must(b.match(/We have (\d+)\/(\d+) \w+ of .+?\. Each bag holds (\d+)\/(\d+) \w+\. How many bags/), 'story');
    return (+m[1] / +m[2]) / (+m[3] / +m[4]);
  };
  O.mulDecPlace = p => { const m = must(strip(p.bubble).match(new RegExp(`What is ${NUM} × ${NUM}\\?`)), 'product'); return decMul(m[1], m[2]); };
  O.mulDec = p => {
    const b = strip(p.bubble); let m;
    if ((m = b.match(new RegExp(`costs \\$${NUM}\\. I want (\\d+) boxes`)))) return decMul(m[1], m[2]);
    if ((m = b.match(new RegExp(`holds ${NUM} kg of .+?\\. How many kilograms are on (\\d+) trays`)))) return decMul(m[1], m[2]);
    if ((m = b.match(new RegExp(`weighs ${NUM} kg\\. I need ${NUM} of the block`)))) return decMul(m[1], m[2]);
    m = must(b.match(new RegExp(`costs? \\$${NUM} a kilogram\\. I want ${NUM} kg`)), 'story');
    return decMul(m[1], m[2]);
  };
  const boxes = p => {
    const b = strip(p.bubble), m = must(b.match(/We made (\d+) .+?\. Each box holds (\d+)\./), 'boxes'), N = +m[1], d = +m[2];
    return /left over/.test(b) ? [Math.floor(N / d), N % d] : (N % d ? 'NOT EVEN' : N / d);
  };
  O.div2 = boxes; O.divMulti = boxes;
  const bulk = p => {
    const b = strip(p.bubble); let m;
    if ((m = b.match(new RegExp(`We have ${NUM} kg of .+? to (?:split into|share equally among) ${NUM} (?:equal )?batches`)))) return decDiv(m[1], m[2]);
    m = must(b.match(new RegExp(`We have ${NUM} kg of .+?\\. Each bag holds ${NUM} kg\\. How many bags`)), 'story');
    return decDiv(m[1], m[2]);
  };
  O.divToDec = bulk; O.divDec2 = bulk; O.divDec3 = bulk;
})();
