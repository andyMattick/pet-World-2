import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CityDestination } from '../types/game';
import { calculateDistanceKm } from '../services/gameEngine';
import { LAND, LAKES, PLACE_LABELS, LngLat } from '../data/land';

interface WorldMapProps {
  currentCity: CityDestination;
  visitedCities: CityDestination[];
  travelOptions: CityDestination[];
  onSelectDestination?: (city: CityDestination) => void;
  isFlying?: boolean;
  flyingFrom?: CityDestination | null;
  flyingTo?: CityDestination | null;
}

/* The map zooms to the part of the world in play: where you are and the places you can fly to next.
   "Whole world" shows everything. Words and pins stay the same size on screen at any zoom. */
const W = 1000, H = 500;
const xy = (lng: number, lat: number) => ({ x: ((lng + 180) / 360) * W, y: ((90 - lat) / 180) * H });
const pathOf = (pts: LngLat[]) => pts.map(([lng, lat], i) => { const p = xy(lng, lat); return `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join('') + 'Z';
const LAND_PATHS = LAND.map(l => pathOf(l.pts));
const LAKE_PATHS = LAKES.map(l => pathOf(l.pts));
type Box = { x: number; y: number; w: number; h: number };
const WORLD: Box = { x: 0, y: 25, w: 1000, h: 450 };

/* the frame around some cities: padded, at least about 40° wide, 2:1 like the map, and inside the world */
function frameFor(cities: CityDestination[]): Box {
  const ps = cities.map(c => xy(c.lng, c.lat));
  let x0 = Math.min(...ps.map(p => p.x)), x1 = Math.max(...ps.map(p => p.x)), y0 = Math.min(...ps.map(p => p.y)), y1 = Math.max(...ps.map(p => p.y));
  const padX = Math.max(40, (x1 - x0) * 0.18), padY = Math.max(30, (y1 - y0) * 0.22);
  x0 -= padX; x1 += padX; y0 -= padY; y1 += padY;
  let w = Math.max(x1 - x0, 2 * (y1 - y0), 120), h = w / 2;
  if (w >= WORLD.w) return WORLD;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  let x = Math.min(Math.max(0, cx - w / 2), W - w), y = Math.min(Math.max(0, cy - h / 2), H - h);
  return { x, y, w, h };
}

export const WorldMap: React.FC<WorldMapProps> = ({
  currentCity,
  visitedCities,
  travelOptions,
  onSelectDestination,
  isFlying = false,
  flyingTo = null,
}) => {
  const [hoveredCity, setHoveredCity] = useState<CityDestination | null>(null);
  const [wholeWorld, setWholeWorld] = useState(false);
  const target = useMemo(() => (wholeWorld ? WORLD : frameFor([currentCity, ...travelOptions, ...(flyingTo ? [flyingTo] : [])])),
    [wholeWorld, currentCity, travelOptions, flyingTo]);
  /* glide to the new frame */
  const [view, setView] = useState<Box>(target);
  const viewRef = useRef(view); viewRef.current = view;
  useEffect(() => {
    const from = viewRef.current, start = performance.now(); let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 700), e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      setView({ x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, w: from.w + (target.w - from.w) * e, h: from.h + (target.h - from.h) * e });
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  /* one screen pixel in map units, so words and pins are the same size on a phone and a big screen */
  const boxRef = useRef<HTMLDivElement>(null);
  const [px, setPx] = useState(1000);
  useEffect(() => { const el = boxRef.current; if (!el) return; const ro = new ResizeObserver(() => setPx(Math.max(280, el.clientWidth))); ro.observe(el); return () => ro.disconnect(); }, []);
  const k = view.w / px;
  const cur = xy(currentCity.lng, currentCity.lat);
  const arc = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, d = Math.hypot(b.x - a.x, b.y - a.y);
    return `M ${a.x} ${a.y} Q ${mx} ${my - Math.max(d * 0.25, 8 * k)} ${b.x} ${b.y}`;
  };
  const grid = 15, gridLines: React.ReactNode[] = [];
  for (let lng = -180; lng <= 180; lng += grid) { const x = xy(lng, 0).x; gridLines.push(<line key={`g${lng}`} x1={x} y1={0} x2={x} y2={H} stroke="rgba(148,197,255,0.10)" strokeWidth={1 * k} />); }
  for (let lat = -75; lat <= 75; lat += grid) { const y = xy(0, lat).y; gridLines.push(<line key={`t${lat}`} x1={0} y1={y} x2={W} y2={y} stroke={lat === 0 ? 'rgba(251,191,36,0.25)' : 'rgba(148,197,255,0.10)'} strokeWidth={(lat === 0 ? 1.6 : 1) * k} strokeDasharray={lat === 0 ? `${6 * k} ${5 * k}` : undefined} />); }
  const inView = (x: number, y: number) => x > view.x - 20 * k && x < view.x + view.w + 20 * k && y > view.y - 20 * k && y < view.y + view.h + 20 * k;
  /* name tags: each one goes above, below, right or left of its pin, wherever it doesn't cover another tag or pin */
  type Rect = { x: number; y: number; w: number; h: number };
  const hit = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const pins = [cur, ...travelOptions.map(o => xy(o.lng, o.lat))].map(p => ({ x: p.x - 9 * k, y: p.y - 9 * k, w: 18 * k, h: 18 * k }));
  const placed: Rect[] = [];
  const spot = (x: number, y: number, text: string, size: number, gap: number) => {
    const fs = size * k, w = text.length * fs * 0.6 + 14 * k, h = fs * 1.45;
    const tries = [[x, y - gap], [x, y + gap + h * 0.75], [x + w / 2 + 14 * k, y + fs * 0.35], [x - w / 2 - 14 * k, y + fs * 0.35], [x, y - gap - h * 1.1], [x, y + gap + h * 1.85]];
    const rectAt = ([tx, ty]: number[]) => ({ x: tx - w / 2, y: ty - fs * 1.05, w, h });
    const pick = tries.find(t => { const r = rectAt(t); return !placed.some(o => hit(o, r)) && !pins.some(o => hit(o, r)); }) || tries[0];
    placed.push(rectAt(pick));
    return { x: pick[0], y: pick[1] };
  };
  const here = spot(cur.x, cur.y, `★ ${currentCity.name}`, 24, 24 * k);
  const tags = Object.fromEntries(travelOptions.map(o => { const p = xy(o.lng, o.lat); return [o.id, spot(p.x, p.y, `${o.flag} ${o.name}`, 20, 16 * k)]; }));
  const label = (key: string, x: number, y: number, text: string, color: string, bg: string, size = 20) => {
    const fs = size * k, w = text.length * fs * 0.6 + 14 * k;
    return (
      <g key={key} className="select-none pointer-events-none">
        <rect x={x - w / 2} y={y - fs * 1.05} width={w} height={fs * 1.45} rx={fs * 0.4} fill={bg} stroke={color} strokeOpacity={0.6} strokeWidth={1.2 * k} />
        <text x={x} y={y} textAnchor="middle" fill={color} fontSize={fs} fontFamily="var(--font-sans)" fontWeight="700">{text}</text>
      </g>
    );
  };

  return (
    <div ref={boxRef} className="relative w-full rounded-xl border border-slate-700 shadow-2xl overflow-hidden" style={{ background: '#0b2545' }}>
      <div className="absolute top-2 left-3 z-20 flex flex-wrap items-center gap-2">
        <span className="bg-slate-900/85 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-600 text-base font-bold text-sky-200">
          📍 You are in {currentCity.flag} {currentCity.name}, {currentCity.country}
        </span>
        <button
          type="button"
          onClick={() => setWholeWorld(v => !v)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base px-3 py-1.5 rounded-lg cursor-pointer shadow"
        >
          {wholeWorld ? '🔎 Zoom in' : '🌍 Whole world'}
        </button>
      </div>

      {hoveredCity && (
        <div className="absolute bottom-14 left-3 z-20 bg-slate-900/95 border border-amber-500/60 px-3 py-2 rounded-lg shadow-xl text-base text-amber-200">
          <span className="mr-1.5">{hoveredCity.flag}</span>
          <span className="font-bold">{hoveredCity.name}</span>, {hoveredCity.country} · {calculateDistanceKm(currentCity.lat, currentCity.lng, hoveredCity.lat, hoveredCity.lng).toLocaleString()} km away
        </div>
      )}

      <svg viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} className="w-full h-auto block" style={{ aspectRatio: '2 / 1', maxHeight: '560px' }} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Map around ${currentCity.name}`}>
        <defs>
          <radialGradient id="tcOcean" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="#1d4e89" />
            <stop offset="100%" stopColor="#0b2545" />
          </radialGradient>
          <linearGradient id="tcLand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b8f4e" />
            <stop offset="55%" stopColor="#8a9a5b" />
            <stop offset="100%" stopColor="#b59a63" />
          </linearGradient>
          <filter id="tcGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={3 * k} result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect x={-50} y={-50} width={W + 100} height={H + 100} fill="url(#tcOcean)" />
        {gridLines}
        {/* shallow water around the coasts, then the land */}
        <g fill="none" stroke="#3b82c4" strokeOpacity={0.35} strokeWidth={9 * k} strokeLinejoin="round">{LAND_PATHS.map((d, i) => <path key={i} d={d} />)}</g>
        <g fill="url(#tcLand)" stroke="#e8dcb5" strokeWidth={1.6 * k} strokeLinejoin="round">{LAND_PATHS.map((d, i) => <path key={i} d={d} />)}</g>
        <g fill="#1d4e89" stroke="#e8dcb5" strokeWidth={1.2 * k}>{LAKE_PATHS.map((d, i) => <path key={i} d={d} />)}</g>

        {PLACE_LABELS.map((p, i) => {
          const pt = xy(p.lng, p.lat); if (!inView(pt.x, pt.y)) return null;
          if (p.kind === 'sea' && p.text !== p.text.toUpperCase() && k > 0.6) return null;   // small seas only when zoomed in
          const fs = (p.kind === 'land' ? 24 : 17) * k * (p.text === p.text.toUpperCase() && p.kind === 'sea' ? 1.2 : 1), tw = p.text.length * fs * 0.62;
          if (placed.some(o => hit(o, { x: pt.x - tw / 2, y: pt.y - fs, w: tw, h: fs * 1.2 }))) return null;   // a city's name tag wins
          return <text key={`pl${i}`} x={pt.x} y={pt.y} textAnchor="middle" fontSize={fs} fontFamily="var(--font-sans)" fontStyle={p.kind === 'sea' ? 'italic' : 'normal'} fontWeight={p.kind === 'land' ? 800 : 500} letterSpacing={p.kind === 'land' ? 4 * k : 1 * k}
            fill={p.kind === 'sea' ? 'rgba(186,230,253,0.75)' : 'rgba(30,41,59,0.45)'} className="select-none pointer-events-none">{p.text}</text>;
        })}

        {/* the trail so far */}
        {visitedCities.slice(1).map((city, i) => (
          <path key={`trail-${i}`} d={arc(xy(visitedCities[i].lng, visitedCities[i].lat), xy(city.lng, city.lat))} fill="none" stroke="#34d399" strokeWidth={3 * k} strokeDasharray={`${7 * k} ${5 * k}`} opacity={0.9} />
        ))}
        {visitedCities.filter(c => c.id !== currentCity.id).map(c => { const p = xy(c.lng, c.lat); return <circle key={`v-${c.id}`} cx={p.x} cy={p.y} r={5 * k} fill="#34d399" stroke="#022c22" strokeWidth={1.5 * k} />; })}

        {/* where you can fly next */}
        {travelOptions.map(opt => (
          <path key={`fl-${opt.id}`} d={arc(cur, xy(opt.lng, opt.lat))} fill="none" stroke="#fbbf24" strokeWidth={2.4 * k} strokeDasharray={`${8 * k} ${6 * k}`} opacity={hoveredCity?.id === opt.id ? 1 : 0.55} />
        ))}
        {travelOptions.map(opt => {
          const pt = xy(opt.lng, opt.lat), hot = hoveredCity?.id === opt.id;
          return (
            <g key={`dest-${opt.id}`} className="cursor-pointer" onClick={() => onSelectDestination && onSelectDestination(opt)} onMouseEnter={() => setHoveredCity(opt)} onMouseLeave={() => setHoveredCity(null)}>
              <circle cx={pt.x} cy={pt.y} r={16 * k} fill="#fbbf24" opacity={0.25} className="animate-ping" />
              <circle cx={pt.x} cy={pt.y} r={(hot ? 10 : 8) * k} fill="#fbbf24" stroke="#422006" strokeWidth={2.4 * k} />
              {label(`l-${opt.id}`, tags[opt.id].x, tags[opt.id].y, `${opt.flag} ${opt.name}`, '#fde68a', hot ? 'rgba(120,53,15,0.95)' : 'rgba(15,23,42,0.88)')}
            </g>
          );
        })}

        {/* you are here */}
        <g>
          <circle cx={cur.x} cy={cur.y} r={24 * k} fill="#38bdf8" opacity={0.3} className="animate-ping" />
          <circle cx={cur.x} cy={cur.y} r={12 * k} fill="#0284c7" stroke="#e0f2fe" strokeWidth={3 * k} filter="url(#tcGlow)" />
          <circle cx={cur.x} cy={cur.y} r={4.5 * k} fill="#ffffff" />
          {label('here', here.x, here.y, `★ ${currentCity.name}`, '#bae6fd', 'rgba(8,47,73,0.92)', 24)}
        </g>

        {isFlying && flyingTo && (() => { const p = xy(flyingTo.lng, flyingTo.lat); return <circle cx={p.x} cy={p.y} r={20 * k} fill="#ef4444" opacity={0.45} className="animate-ping" />; })()}
      </svg>

      {/* compass */}
      <div className="absolute right-3 top-2 z-20 w-14 h-14 rounded-full bg-slate-900/80 border border-slate-600 flex items-center justify-center text-amber-300 font-bold select-none" aria-hidden="true">
        <span className="absolute top-0.5 text-sm">N</span><span className="text-2xl">🧭</span>
      </div>

      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between text-base text-slate-300 gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-sky-400 inline-block" />You are here</span>
          <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-amber-400 inline-block" />Places you can fly</span>
          <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-emerald-400 inline-block" />Your trail</span>
        </div>
        <div className="text-slate-400 hidden sm:block">Tap a yellow pin to choose a flight</div>
      </div>
    </div>
  );
};
