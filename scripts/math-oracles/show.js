// Independent answer checkers for the Pet Show (unit 11: data and statistics). Loaded as a plain browser script by
// scripts/check-math.mjs. Each solver reads only what the student sees (the story, the picture, the choices) and works
// the answer out with its own code: data are read back from the SVG geometry (dot x positions, bar heights, box edges).
// Quartiles use the 6th grade rule: medians of the lower and upper halves, leaving out the middle value when n is odd.
(() => {
  const O = window.ORACLES = window.ORACLES || {};

  /* ---------- reading what she sees ---------- */
  const strip = h => String(h || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  const nums = t => (String(t).replace(/−/g, '-').match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const attrs = s => { const a = {}; String(s).replace(/([\w-]+)="([^"]*)"/g, (_, k, v) => { a[k] = v; }); return a; };
  const tags = (svg, tag) => { const out = [], re = new RegExp(`<${tag}\\b([^>]*?)\\/?>(?:([^<]*)<\\/${tag}>)?`, 'g'); let m; while ((m = re.exec(svg))) out.push({...attrs(m[1]), _text:(m[2] || '').trim()}); return out; };
  const svgOf = (html, aria) => { const re = /<svg\b[^>]*>[\s\S]*?<\/svg>/g; let m; while ((m = re.exec(String(html || '')))) if (m[0].slice(0, m[0].indexOf('>')).includes(`aria-label="${aria}"`)) return m[0]; return null; };
  const isNum = t => /^-?\d+(\.\d+)?$/.test(t);
  /* linear map from x to value, from two numeric tick labels */
  const axisMap = labels => { if (labels.length === 1) return x => Math.abs(x - labels[0].x) < 0.5 ? labels[0].v : NaN;   // every dot on one value
    if (labels.length < 2) return null; const a = labels[0], b = labels[labels.length - 1]; return x => a.v + (x - a.x) * (b.v - a.v) / (b.x - a.x); };
  const half = v => Math.round(v * 2) / 2;

  /* dot plot → list of values */
  function readDotPlot(html){
    const svg = svgOf(html, 'dot plot'); if (!svg) return null;
    const labels = tags(svg, 'text').filter(t => isNum(t._text)).map(t => ({x:+t.x, v:+t._text}));
    const X = axisMap(labels); if (!X) return null;
    return tags(svg, 'circle').map(c => Math.round(X(+c.cx))).sort((a, b) => a - b);
  }
  /* box plot → [min, Q1, median, Q3, max] */
  function readBoxPlot(html){
    const svg = svgOf(html, 'box plot'); if (!svg) return null;
    const labels = tags(svg, 'text').filter(t => isNum(t._text)).map(t => ({x:+t.x, v:+t._text}));
    const X = axisMap(labels); if (!X) return null;
    const rect = tags(svg, 'rect').find(r => /box-rect/.test(r.class)), med = tags(svg, 'line').find(l => /box-med/.test(l.class));
    const lines = tags(svg, 'line').filter(l => !/box-med/.test(l.class || '') && +l.x1 === +l.x2);
    // whisker end caps are the short vertical lines centred on the box's middle height
    const mid = +rect.y + +rect.height / 2, caps = lines.filter(l => Math.abs((+l.y1 + +l.y2) / 2 - mid) < 0.01).map(l => +l.x1);
    return [Math.min(...caps), +rect.x, +med.x1, +rect.x + +rect.width, Math.max(...caps)].map(x => half(X(x)));
  }
  /* histogram → [{from, to, count}] */
  function readHist(html){
    const svg = svgOf(html, 'histogram'); if (!svg) return null;
    const texts = tags(svg, 'text');
    const yLab = texts.filter(t => t['text-anchor'] === 'end' && isNum(t._text)).map(t => ({y:+t.y - 4, c:+t._text}));
    const z = yLab.find(l => l.c === 0), o = yLab.filter(l => l.c > 0).pop(), unit = (z.y - o.y) / o.c;
    const bins = texts.filter(t => /^\d+–\d+$/.test(t._text)).map(t => ({x:+t.x, from:+t._text.split('–')[0], to:+t._text.split('–')[1]}));
    return tags(svg, 'rect').filter(r => /hist-bar/.test(r.class)).map(r => {
      const cx = +r.x + +r.width / 2, b = bins.reduce((best, q) => Math.abs(q.x - cx) < Math.abs(best.x - cx) ? q : best);
      return {from:b.from, to:b.to, label:`${b.from}–${b.to}`, count:Math.round(+r.height / unit)};
    });
  }
  /* <table class="xy-table">: [header cells of row 1, row 2] */
  function readTable(html){
    const t = String(html).match(/<table class="xy-table">([\s\S]*?)<\/table>/); if (!t) return null;
    return [...t[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(r => [...r[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(c => strip(c[1])));
  }
  /* the list of numbers after the last ':' in the story (or the whole thing) */
  const listAfter = (text, re) => { const m = String(text).match(re); return m ? nums(m[1]) : null; };

  /* ---------- statistics, done independently ---------- */
  const sorted = a => [...a].sort((x, y) => x - y);
  const sum = a => a.reduce((x, y) => x + y, 0);
  const mean = a => sum(a) / a.length;
  const median = a => { const s = sorted(a), n = s.length; return n % 2 ? s[(n - 1) >> 1] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const quarts = a => { const s = sorted(a), n = s.length, h = Math.floor(n / 2); return [median(s.slice(0, h)), median(s.slice(n - h))]; };
  const iqrOf = a => { const [q1, q3] = quarts(a); return q3 - q1; };
  const mad = a => { const m = mean(a); return mean(a.map(v => Math.abs(v - m))); };
  const r6 = v => Math.round(v * 1e6) / 1e6;

  /* ---------- which step is the key, and choosing an option ---------- */
  const keyStep = p => { const f = window.PetWorldMath && window.PetWorldMath.answerStepsFor; const sh = f ? f(p) : [p.steps[p.steps.length - 1]]; return sh[sh.length - 1]; };
  const opt = (st, pred) => { const hits = st.options.filter(pred); return hits.length === 1 ? hits[0].text : null; };
  const optNum = (st, v) => opt(st, o => isNum(o.text.trim()) && Math.abs(+o.text - v) < 1e-9);
  const closest = (st, v) => { const ds = st.options.map(o => Math.abs(+o.text - v)), m = Math.min(...ds); return ds.filter(d => d === m).length === 1 ? st.options[ds.indexOf(m)].text : null; };
  /* percent of the data on one side of a box-plot value (each of the four parts is 25%) */
  const pctQ = (five, text) => {
    const idx = v => five.findIndex(f => Math.abs(f - v) < 1e-9);
    let m;
    if ((m = text.match(/between (\d+(?:\.\d+)?) and (\d+(?:\.\d+)?)/))) { const a = idx(+m[1]), b = idx(+m[2]); return a < 0 || b < 0 ? null : (b - a) * 25; }
    if ((m = text.match(/(?:more than|at least) (\d+(?:\.\d+)?)/))) { const k = idx(+m[1]); return k < 0 ? null : (4 - k) * 25; }
    if ((m = text.match(/less than (\d+(?:\.\d+)?)/))) { const k = idx(+m[1]); return k < 0 ? null : k * 25; }
    return null;
  };

  /* ===== statistical questions ===== */
  // A statistical question asks about a group and expects answers that vary. One with a single answer names one
  // person/pet (a proper name), a superlative ("the oldest"), or a yes/no fact about one place.
  const isStatistical = q => {
    const words = q.replace(/[?"'’]/g, '').split(/\s+/);
    if (words.slice(1).some(w => /^[A-Z][a-z]/.test(w))) return false;           // Mia, Rex, the Lopez family, Sundays
    if (/\b(the )?\w+est\b/.test(q.replace(/\b(interest|test|best in show)\b/gi, '')) && /\b(oldest|tallest|youngest|biggest|smallest|largest|heaviest|longest|shortest|fastest)\b/.test(q)) return false;
    if (/^(Is|Are|Does|Do|Was)\b/.test(q)) return false;                         // a yes/no fact about one thing
    return true;
  };
  O.statQ = (p, lvl) => {
    const st = keyStep(p), b = strip(p.bubble);
    if (/Is this a statistical question/.test(b)) {
      const q = b.match(/"([^"]+)"/)[1];
      return isStatistical(q) ? 'Yes, it is statistical' : 'No, it has one answer';
    }
    if (/NOT/.test(b + st.prompt)) return opt(st, o => !isStatistical(o.text));
    return opt(st, o => isStatistical(o.text));
  };

  /* ===== dot plots ===== */
  const countBy = (data, q) => {
    let m;
    if ((m = q.match(/from (\d+) to (\d+)/))) return data.filter(v => v >= +m[1] && v <= +m[2]).length;
    if ((m = q.match(/exactly (\d+)/))) return data.filter(v => v === +m[1]).length;
    if ((m = q.match(/more than (\d+)/))) return data.filter(v => v > +m[1]).length;
    if ((m = q.match(/at most (\d+)/))) return data.filter(v => v <= +m[1]).length;
    if ((m = q.match(/at least (\d+)/))) return data.filter(v => v >= +m[1]).length;
    if ((m = q.match(/less than (\d+)/))) return data.filter(v => v < +m[1]).length;
    if (/are in the show/.test(q)) return data.length;
    return null;
  };
  O.readDot = p => { const d = readDotPlot(p.visual), q = strip(p.bubble).replace(/^.*?pet show\.\s*/, ''); return countBy(d, q); };

  /* ===== histograms ===== */
  O.readHist = (p, lvl) => {
    const bins = readHist(p.visual), st = keyStep(p), b = strip(p.bubble);
    if (st.kind === 'choice') { const top = Math.max(...bins.map(x => x.count)), best = bins.filter(x => x.count === top); return best.length === 1 ? opt(st, o => o.text === best[0].label) : null; }
    let m;
    if (/less than/.test(st.prompt + b) && (m = (st.prompt + ' ' + b).match(/less than (\d+)/))) return sum(bins.filter(x => x.to < +m[1]).map(x => x.count));
    if ((m = b.match(/are (\d+) or more/))) return sum(bins.filter(x => x.from >= +m[1]).map(x => x.count));
    return null;
  };

  /* ===== mean and median ===== */
  O.meanCalc = p => mean(listAfter(strip(p.bubble), /scores: ([\d,\s]+)\./));
  O.meanDisplay = (p, lvl) => {
    const d = readDotPlot(p.visual), b = strip(p.bubble);
    const m = b.match(/goes up to (\d+(?:\.\d+)?)/);
    if (m) return +m[1] * (d.length + 1) - sum(d);
    return r6(mean(d));
  };
  O.medianDisplay = p => {
    let d = readDotPlot(p.visual);
    if (!d) { const t = readTable(p.visual); d = []; t[0].forEach((v, i) => { for (let k = 0; k < +t[1][i]; k++) d.push(+v); }); }
    return median(d);
  };
  O.medianCalc = p => median(listAfter(strip(p.bubble), /scores: ([\d,\s]+)\./));
  O.estCenter = (p, lvl) => {
    const d = readDotPlot(p.visual), st = keyStep(p), b = strip(p.bubble);
    if (/mean and the median compare/.test(b)) {
      const mn = mean(d), md = median(d);
      return Math.abs(mn - md) < 1e-9 ? 'The mean and median are equal' : mn > md ? 'The mean is greater than the median' : 'The mean is less than the median';
    }
    return closest(st, /closest to the median/.test(b) ? median(d) : mean(d));
  };
  O.meanMissing = (p, lvl) => {
    const b = strip(p.bubble); let m, n, known;
    let r = b.match(/mean score of (\d+) over (\d+) events[^.]*\. Its first \d+ scores are ([\d,\s]+)\./);
    if (r) { m = +r[1]; n = +r[2]; known = nums(r[3]); }
    else { r = b.match(/^(\d+) .*? have a mean \w+ of (\d+)\. \d+ of them are ([\d,\s]+)\./); n = +r[1]; m = +r[2]; known = nums(r[3]); }
    if (known.length !== n - 1) return null;
    return m * n - sum(known);
  };
  O.shiftData = (p, lvl) => {
    const b = strip(p.bubble), st = keyStep(p);
    const data = listAfter(b, /scores are ([\d,\s]+?)(?:\.|, with)/);
    if (/every score/.test(b)) {
      const k = +b.match(/(?:adds|takes) (\d+) points/)[1] * (/takes/.test(b) ? -1 : 1);
      return /median/i.test(st.name) ? median(data) + k : mean(data) + k;
    }
    let next, m;
    if ((m = b.match(/joins with a score of (\d+)/))) next = [...data, +m[1]];
    else if ((m = b.match(/score \((\d+)\) leaves/))) { next = [...data]; next.splice(next.indexOf(+m[1]), 1); }
    else return null;
    if (st.kind !== 'choice') return r6(mean(next));
    const word = (a, c) => Math.abs(a - c) < 1e-9 ? 'stays the same' : c > a ? 'increases' : 'decreases';
    return opt(st, o => o.text === `The mean ${word(mean(data), mean(next))} and the median ${word(median(data), median(next))}`);
  };

  /* ===== spread: IQR and MAD ===== */
  O.iqr = (p, lvl) => {
    const b = strip(p.bubble), st = keyStep(p);
    if (st.kind === 'choice') {
      const groups = [...b.matchAll(/The (\w+): ([\d,\s]+)\./g)].map(g => ({name:g[1], iqr:iqrOf(nums(g[2]))}));
      if (groups.length !== 2 || groups[0].iqr === groups[1].iqr) return null;
      const big = groups[0].iqr > groups[1].iqr ? groups[0] : groups[1];
      return opt(st, o => o.text === `The ${big.name}`);
    }
    return iqrOf(listAfter(b, /\(inches\): ([\d,\s]+)\./));
  };
  O.mad = p => r6(mad(listAfter(strip(p.bubble), /scored ([\d,\s]+)\./)));

  /* ===== box plots ===== */
  O.readBox = (p, lvl) => {
    const f = readBoxPlot(p.visual), b = strip(p.bubble), st = keyStep(p);
    if (st.kind === 'choice') { const pc = pctQ(f, b.replace(/^.*?\. /, '')); return pc === null ? null : `${pc}%`; }
    if (/interquartile/.test(b)) return f[3] - f[1];
    if (/range\?/.test(b)) return f[4] - f[0];
    if (/median/.test(b)) return f[2];
    return null;
  };
  O.makeBox = (p, lvl) => {
    const d = listAfter(strip(p.bubble), /scores: ([\d,\s]+)\./), s = sorted(d), [q1, q3] = quarts(d), five = [s[0], q1, median(d), q3, s[s.length - 1]];
    const st = keyStep(p);
    if (st.kind === 'choice') return opt(st, o => { const g = readBoxPlot(o.html); return g && g.every((v, i) => Math.abs(v - five[i]) < 1e-6); });
    if (/IQR/.test(st.name)) return q3 - q1;
    if (/Q1/.test(st.name)) return q1;
    if (/Q3/.test(st.name)) return q3;
    return median(d);
  };
  O.quartiles = (p, lvl) => {
    const f = readBoxPlot(p.visual), b = strip(p.bubble), st = keyStep(p);
    if (lvl === 1 || /than what|least what/.test(b)) {
      const v = /Half .* more than what/.test(b) ? f[2] : /quarter .* less than what/.test(b) ? f[1] : /top quarter .* at least what/.test(b) ? f[3] : null;
      return v === null ? null : optNum(st, v);
    }
    const q = b.replace(/^.*?(About)/, '$1'), pc = pctQ(f, q);
    if (pc === null) return null;
    if (st.kind === 'choice') return `${pc}%`;
    const N = +b.match(/^(\d+) /)[1];
    return N * pc / 100;
  };

  /* ===== displays and shape ===== */
  O.shapeDist = (p, lvl) => {
    const d = readDotPlot(p.visual), st = p.steps[0];
    // centre of the scale vs. where the data sit: the skew is the side of the long tail, the mean is pulled toward it
    const svg = svgOf(p.visual, 'dot plot'), ticks = tags(svg, 'text').filter(t => isNum(t._text)).map(t => +t._text), mid = (Math.min(...ticks) + Math.max(...ticks)) / 2;
    const m = mean(d), md = median(d), skew = sum(d.map(v => (v - m) ** 3)) / d.length / (mad(d) ** 3);
    const shape = Math.abs(m - mid) < 0.6 && Math.abs(skew) < 1 ? 'symmetric' : m < mid ? 'skewed right' : 'skewed left';
    const T = {symmetric:/about the same on both sides/, 'skewed right':/pile up on the left and trail off to the right/, 'skewed left':/pile up on the right and trail off to the left/};
    return opt(st, o => T[shape].test(o.text));
  };
  O.cmpDisplays = (p, lvl) => {
    const b = strip(p.bubble), st = keyStep(p);
    if (st.kind !== 'choice') {   // level 3: use the displays
      const d = readDotPlot(p.visual);
      if (/interquartile/.test(b)) { const f = readBoxPlot(p.visual); return f ? f[3] - f[1] : iqrOf(d); }
      return countBy(d, b.replace(/^.*?\. /, ''));
    }
    if (lvl === 1) {
      const q = st.prompt;
      const ans = /every single value/.test(q) ? 'Dot plot' : /median and the quartiles/.test(q) ? 'Box plot' : /equal intervals/.test(q) ? 'Histogram'
        : /mean exactly/.test(q) ? 'Dot plot' : /IQR/.test(q) ? 'Box plot' : /mode/.test(q) ? 'Dot plot' : /very large data set/.test(q) ? 'Histogram'
        : /NOT show how many values/.test(q) ? 'Box plot' : null;
      return ans && opt(st, o => o.text === ans);
    }
    if (/box plot alone/.test(b)) return opt(st, o => /median\?|interquartile|greatest value/.test(o.text) && !/exact|How many|\bmean\b/.test(o.text));
    if (/histogram alone/.test(b)) {
      const bins = readHist(p.visual);
      return opt(st, o => /are in the show\?/.test(o.text) || (/interval\?/.test(o.text) && bins.some(x => o.text.includes(x.label))));
    }
    return null;
  };

  /* ===== frequency tables, building dot plots and histograms ===== */
  O.freqTable = (p, lvl) => {
    const b = strip(p.bubble), st = keyStep(p), d = listAfter(b, /: ([\d,\s]+)\./);
    let m;
    if ((m = st.name.match(/^(\d+)–(\d+)$/))) return d.filter(v => v >= +m[1] && v <= +m[2]).length;
    if ((m = st.name.match(/Frequency of (\d+)/))) return d.filter(v => v === +m[1]).length;
    return null;
  };
  O.makeDot = (p, lvl) => {
    const d = sorted(listAfter(strip(p.bubble), /: ([\d,\s]+)\./)), st = keyStep(p);
    if (st.kind === 'counts') return st.labels.map(l => d.filter(v => v === +l).length);
    return opt(st, o => { const g = readDotPlot(o.html); return g && g.join() === d.join(); });
  };
  O.makeHist = (p, lvl) => {
    const d = listAfter(strip(p.bubble), /: ([\d,\s]+)\./), st = keyStep(p);
    const inBin = l => { const [a, c] = String(l).split('–').map(Number); return d.filter(v => v >= a && v <= c).length; };
    if (st.kind === 'counts') return st.labels.map(inBin);
    if (st.kind === 'choice') return opt(st, o => { const h = readHist(o.html); return h && h.every(x => x.count === inBin(x.label)); });
    return inBin(st.name);
  };

  /* ===== clusters, gaps, peaks, outliers ===== */
  O.clusters = (p, lvl) => {
    const d = readDotPlot(p.visual), b = strip(p.bubble), st = keyStep(p);
    const c = {}; d.forEach(v => { c[v] = (c[v] || 0) + 1; });
    if (/peak/.test(b)) { const top = Math.max(...Object.values(c)), ks = Object.keys(c).filter(k => c[k] === top); return ks.length === 1 ? optNum(st, +ks[0]) : null; }
    const u = [...new Set(d)];
    // runs of values with no empty spot on the number line between them
    const runs = [[u[0]]]; for (let i = 1; i < u.length; i++) { if (u[i] - u[i - 1] > 1) runs.push([]); runs[runs.length - 1].push(u[i]); }
    if (/gap/.test(b)) {
      if (runs.length !== 2) return null;
      return opt(st, o => o.text === `Between ${runs[0][runs[0].length - 1]} and ${runs[1][0]}`);
    }
    if (/outlier/.test(b)) {
      const lone = runs.filter(r => r.length === 1 && c[r[0]] === 1).map(r => r[0]);
      return lone.length === 1 ? optNum(st, lone[0]) : null;
    }
    return null;
  };
})();
