/* The map: an SVG of hexes seen through one empire's eyes (fog of war has three states: never seen, seen before,
   visible now). Drag to pan, pinch or scroll to zoom, tap a hex to open it. */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as RPointerEvent, ReactElement, WheelEvent as RWheelEvent } from 'react';
import type { GameState, HexBiome, HexTile } from '../types/game';
import { key } from '../types/game';
import { NODE_INFO } from '../config/rules';
import { HEX_SIZE, hexCorners, hexToPixel } from '../logic/hexMath';

const BIOME_FILL: Record<HexBiome, string> = {
  plains: '#5f7f3a', forest: '#2e5a35', hills: '#86704a', mountains: '#5b5d68', desert: '#c4a15a', water: '#1d4566', coast: '#7fa36a', waystone: '#5f7f3a',
};
const BUILDING_ICON: Record<string, string> = { capital: '🏛️', camp: '⛺', outpost: '🗼', depot: '🏚️', barracks: '🛡️' };

function pixelToHex(x: number, y: number) {
  const qf = (Math.sqrt(3) / 3 * x - y / 3) / HEX_SIZE, rf = (2 / 3 * y) / HEX_SIZE;
  const sf = -qf - rf;
  let q = Math.round(qf), r = Math.round(rf); const s = Math.round(sf);
  const dq = Math.abs(q - qf), dr = Math.abs(r - rf), ds = Math.abs(s - sf);
  if (dq > dr && dq > ds) q = -r - s; else if (dr > ds) r = -q - s;
  return { q, r };
}

export default function HexMap({ gs, viewer, selected, highlight, onTap, version }: {
  gs: GameState; viewer: number; selected: { q: number; r: number } | null; highlight: Set<string> | null;
  onTap: (q: number, r: number) => void; version: number;
}) {
  const e = gs.empires[viewer];
  const tiles = useMemo(() => [...gs.tiles.values()], [gs]);
  const bounds = useMemo(() => {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const t of tiles) { const p = hexToPixel(t); x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
    const pad = HEX_SIZE * 1.2;
    return { x: x0 - pad, y: y0 - pad, w: x1 - x0 + pad * 2, h: y1 - y0 + pad * 2 };
  }, [tiles]);
  const svgRef = useRef<SVGSVGElement>(null);
  const startW = () => HEX_SIZE * Math.sqrt(3) * Math.max(9, Math.min(20, (svgRef.current?.clientWidth || window.innerWidth) / 64));
  const [vb, setVb] = useState(() => focusOn(e.capital, startW()));
  function focusOn(h: { q: number; r: number }, w: number) {
    const p = hexToPixel(h);
    const el = svgRef.current;
    const aspect = el ? el.clientHeight / Math.max(1, el.clientWidth) : 1.3;
    return { x: p.x - w / 2, y: p.y - (w * aspect) / 2, w, h: w * aspect };
  }
  // when the turn passes to another player, jump to their capital
  useEffect(() => { setVb(focusOn(e.capital, startW())); /* eslint-disable-next-line */ }, [viewer]);
  // keep the aspect ratio right when the window changes size
  useEffect(() => {
    const fix = () => setVb(v => { const el = svgRef.current; if (!el) return v; const h = v.w * el.clientHeight / Math.max(1, el.clientWidth); return { ...v, y: v.y + (v.h - h) / 2, h }; });
    fix(); window.addEventListener('resize', fix); return () => window.removeEventListener('resize', fix);
  }, []);

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ moved: boolean; startDist: number; startVb: typeof vb; sx: number; sy: number } | null>(null);
  const toSvg = (cx: number, cy: number, v = vb) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: v.x + ((cx - r.left) / r.width) * v.w, y: v.y + ((cy - r.top) / r.height) * v.h };
  };
  const clampW = (w: number) => Math.max(HEX_SIZE * 5, Math.min(bounds.w * 1.3, w));
  function zoomAt(cx: number, cy: number, factor: number, base = vb) {
    const p = toSvg(cx, cy, base);
    const w = clampW(base.w * factor), k = w / base.w, h = base.h * k;
    return { x: p.x - (p.x - base.x) * k, y: p.y - (p.y - base.y) * k, w, h };
  }
  const onDown = (ev: RPointerEvent) => {
    (ev.currentTarget as Element).setPointerCapture(ev.pointerId);
    pointers.current.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    const pts = [...pointers.current.values()];
    gesture.current = { moved: pts.length > 1, startDist: pts.length > 1 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0, startVb: vb, sx: ev.clientX, sy: ev.clientY };
  };
  const onMove = (ev: RPointerEvent) => {
    if (!pointers.current.has(ev.pointerId) || !gesture.current) return;
    pointers.current.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    const g = gesture.current, pts = [...pointers.current.values()];
    const rect = svgRef.current!.getBoundingClientRect();
    if (pts.length >= 2) {
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (g.startDist > 0) setVb(zoomAt((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2, g.startDist / d, g.startVb));
      g.moved = true;
      return;
    }
    const dx = ev.clientX - g.sx, dy = ev.clientY - g.sy;
    if (!g.moved && Math.hypot(dx, dy) < 8) return;
    g.moved = true;
    const s = g.startVb;
    const nx = Math.max(bounds.x - s.w / 2, Math.min(bounds.x + bounds.w - s.w / 2, s.x - dx * s.w / rect.width));
    const ny = Math.max(bounds.y - s.h / 2, Math.min(bounds.y + bounds.h - s.h / 2, s.y - dy * s.h / rect.height));
    setVb({ ...s, x: nx, y: ny });
  };
  const onUp = (ev: RPointerEvent) => {
    const g = gesture.current;
    pointers.current.delete(ev.pointerId);
    if (pointers.current.size > 0) { if (g) { g.startVb = vb; g.startDist = 0; const p = [...pointers.current.values()][0]; g.sx = p.x; g.sy = p.y; } return; }
    gesture.current = null;
    if (g && !g.moved) {
      const p = toSvg(ev.clientX, ev.clientY);
      const h = pixelToHex(p.x, p.y);
      if (gs.tiles.has(key(h.q, h.r))) onTap(h.q, h.r);
    }
  };
  const onWheel = (ev: RWheelEvent) => setVb(zoomAt(ev.clientX, ev.clientY, ev.deltaY > 0 ? 1.12 : 1 / 1.12));
  const zoomBtn = (f: number) => {
    const r = svgRef.current!.getBoundingClientRect();
    setVb(zoomAt(r.left + r.width / 2, r.top + r.height / 2, f));
  };

  const seen = (t: HexTile) => e.seen.has(key(t.q, t.r));
  const vis = (t: HexTile) => e.visible.has(key(t.q, t.r));
  void version;

  return (
    <div className="relative w-full h-full select-none">
      <svg ref={svgRef} className="w-full h-full touch-none bg-[#0b0e12]" viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onWheel={onWheel}
        role="img" aria-label="Map of the world">
        {tiles.map(t => {
          const p = hexToPixel(t), k = key(t.q, t.r);
          if (!seen(t)) return <polygon key={k} points={hexCorners(p.x, p.y, HEX_SIZE - 0.6)} fill="#151a21" stroke="#1d242e" strokeWidth="1" />;
          const owner = t.owner !== null ? gs.empires[t.owner] : null;
          return (
            <g key={k}>
              <polygon points={hexCorners(p.x, p.y, HEX_SIZE - 0.6)} fill={BIOME_FILL[t.biome]} />
              {owner && <polygon points={hexCorners(p.x, p.y, HEX_SIZE - 2.5)} fill={owner.color} fillOpacity={0.28} stroke={owner.color} strokeWidth="2.5" />}
              {!vis(t) && <polygon points={hexCorners(p.x, p.y, HEX_SIZE - 0.6)} fill="#0b0e12" fillOpacity={0.5} />}
            </g>
          );
        })}
        {highlight && tiles.filter(t => highlight.has(key(t.q, t.r))).map(t => {
          const p = hexToPixel(t);
          return <polygon key={'hl' + key(t.q, t.r)} points={hexCorners(p.x, p.y, HEX_SIZE - 4)} fill="#34d399" fillOpacity={0.22} stroke="#34d399" strokeWidth="2" strokeDasharray="5 4" pointerEvents="none" />;
        })}
        {tiles.filter(seen).map(t => {
          const p = hexToPixel(t), k = key(t.q, t.r), v = vis(t);
          const items: ReactElement[] = [];
          if (t.building) items.push(<text key="b" x={p.x} y={p.y + 7} fontSize="22" textAnchor="middle">{BUILDING_ICON[t.building.type]}</text>);
          else if (t.barbCamp) items.push(<text key="bc" x={p.x} y={p.y + 7} fontSize="22" textAnchor="middle">🏕️</text>);
          else if (t.waystone) items.push(<text key="w" x={p.x} y={p.y + 7} fontSize="20" textAnchor="middle">🗿</text>);
          else if (t.ruin && t.ruin.claimedBy === null && v) items.push(<text key="ru" x={p.x} y={p.y + 7} fontSize="20" textAnchor="middle">🏺</text>);
          if (t.node) items.push(<text key="n" x={p.x + (t.building ? 13 : 0)} y={p.y + (t.building ? 20 : 7)} fontSize={t.building ? 11 : 18} textAnchor="middle" opacity={t.building ? 1 : 0.9}>{NODE_INFO[t.node].emoji}</text>);
          if (t.building && t.building.type === 'camp' && t.building.level > 1) items.push(<text key="lv" x={p.x - 14} y={p.y + 21} fontSize="10" fill="#fde68a" fontWeight="700" textAnchor="middle">{'★'.repeat(t.building.level - 1)}</text>);
          if (t.troops > 0 && (v || t.owner === viewer)) items.push(<g key="tr"><rect x={p.x - 20} y={p.y - 24} width="18" height="13" rx="3" fill="#0f172a" opacity="0.85" /><text x={p.x - 11} y={p.y - 14} fontSize="10" fill="#e2e8f0" textAnchor="middle" fontWeight="700">⚔{t.troops}</text></g>);
          if (t.building && t.building.hp < t.building.maxHp && (v || t.owner === viewer)) items.push(<rect key="hp" x={p.x - 12} y={p.y + 23} width={24 * t.building.hp / Math.max(1, t.building.maxHp)} height="3" fill="#f43f5e" />);
          return items.length ? <g key={'i' + k} pointerEvents="none">{items}</g> : null;
        })}
        {e.hints.map(h => {
          const p = hexToPixel(h);
          return <g key={'h' + key(h.q, h.r)} pointerEvents="none"><circle cx={p.x} cy={p.y} r={HEX_SIZE * 0.55} fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4 3" /><text x={p.x} y={p.y + 8} fontSize="22" textAnchor="middle" fill="#fbbf24" fontWeight="800">?</text></g>;
        })}
        {gs.barbarians.filter(c => e.visible.has(key(c.q, c.r))).map(c => {
          const p = hexToPixel(c);
          const col = c.status === 'mercenary' ? gs.empires[c.employer!].color : c.status === 'rebel' ? '#e11d48' : '#7f1d1d';
          return <g key={'c' + c.id} pointerEvents="none"><circle cx={p.x + 14} cy={p.y - 14} r="10" fill={col} stroke="#fecaca" strokeWidth="1.5" /><text x={p.x + 14} y={p.y - 10} fontSize="11" textAnchor="middle" fill="white" fontWeight="800">{c.strength}</text></g>;
        })}
        {e.visible.has(key(gs.trader.q, gs.trader.r)) && (() => { const p = hexToPixel(gs.trader); return <text x={p.x - 13} y={p.y + 21} fontSize="18" textAnchor="middle" pointerEvents="none">🐫</text>; })()}
        {gs.empires.flatMap(x => x.scouts.filter(s => x.index === viewer || e.visible.has(key(s.q, s.r))).map(s => {
          const p = hexToPixel(s);
          return <g key={'s' + s.id} pointerEvents="none"><circle cx={p.x + 14} cy={p.y + 12} r="9" fill={x.color} stroke="white" strokeWidth="1.5" opacity={x.index === viewer && s.moved ? 0.55 : 1} /><text x={p.x + 14} y={p.y + 16} fontSize="11" textAnchor="middle">🧭</text></g>;
        }))}
        {selected && (() => { const p = hexToPixel(selected); return <polygon points={hexCorners(p.x, p.y, HEX_SIZE - 1.5)} fill="none" stroke="white" strokeWidth="3" pointerEvents="none" />; })()}
      </svg>
      <div className="absolute right-2 top-2 flex flex-col gap-1.5">
        <button type="button" aria-label="Zoom in" onClick={() => zoomBtn(1 / 1.3)} className="w-10 h-10 rounded-lg bg-panel/90 border border-line text-lg">＋</button>
        <button type="button" aria-label="Zoom out" onClick={() => zoomBtn(1.3)} className="w-10 h-10 rounded-lg bg-panel/90 border border-line text-lg">－</button>
        <button type="button" aria-label="Center on your capital" onClick={() => setVb(focusOn(e.capital, vb.w))} className="w-10 h-10 rounded-lg bg-panel/90 border border-line">🏛️</button>
      </div>
    </div>
  );
}
