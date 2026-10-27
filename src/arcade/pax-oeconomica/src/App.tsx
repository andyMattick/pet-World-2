/* Pax Oeconomica: the screens and the turn flow. The game state is one mutable object (logic/*); the UI re-renders
   after every action and autosaves. */
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Era, GameState, Phase } from './types/game';
import { key, RESOURCES } from './types/game';
import { civById } from './config/civilizations';
import { RES_INFO } from './config/rules';
import { beginTurn, current, newGame, starsFor, traderNear } from './logic/engine';
import type { NewGameOptions } from './logic/engine';
import { advance, endTurn } from './logic/turns';
import { capacity, foodUpkeep, moveScout, production, scoutMoves, stored } from './logic/economy';
import { reachable } from './logic/hexMath';
import { advice } from './logic/advisor';
import { clearSave, loadGame, saveGame } from './utils/save';
import { sfx, isMuted, setMuted } from './utils/soundEffects';
import { closeGame, EMBEDDED, LOCKED_ERA, reportResult } from './utils/embed';
import HexMap from './components/HexMap';
import TileDrawer from './components/TileDrawer';
import MarketDrawer from './components/MarketDrawer';
import ClansDrawer from './components/ClansDrawer';
import { AidDrawer, EmpireDrawer, HelpDrawer, LogDrawer, TraderDrawer } from './components/OtherDrawers';
import { GameOver, PassScreen, RoundReport, SetupScreen, TitleScreen } from './components/Screens';
import type { Ctx, Drawer } from './components/ui';

export default function App() {
  const [phase, setPhase] = useState<Phase>('TITLE_MENU');
  const gsRef = useRef<GameState | null>(null);
  const [version, bump] = useReducer((x: number) => x + 1, 0);
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [scoutMode, setScoutMode] = useState<{ id: number; reach: Set<string> } | null>(null);
  const [toasts, setToasts] = useState<{ id: number; text: string; bad?: boolean }[]>([]);
  const [muted, setMute] = useState(isMuted());
  const [tipOpen, setTipOpen] = useState(true);
  const gs = gsRef.current;
  const headerRef = useRef<HTMLElement>(null);
  // drawers on wide screens start below the top bar, whatever its height
  useLayoutEffect(() => {
    const el = headerRef.current; if (!el) return;
    const set = () => document.documentElement.style.setProperty('--hud-h', `${el.offsetHeight}px`);
    set(); const ro = new ResizeObserver(set); ro.observe(el); return () => ro.disconnect();
  });

  const toast = useCallback((text: string, bad = false) => {
    const id = Math.random();
    setToasts(t => [...t.slice(-2), { id, text, bad }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), Math.min(9000, 2500 + text.length * 45));
  }, []);
  const save = () => { if (gsRef.current) saveGame(gsRef.current); };

  const humans = gs ? gs.empires.filter(e => e.human).length : 1;
  const afterAdvance = (g: GameState, r: 'human' | 'round') => {
    if (r === 'round') { setPhase('ROUND_RESOLUTION'); if (g.roundReport.some(x => x.kind === 'raid' && g.empires[x.empire ?? -1]?.human)) sfx.raid(); }
    else setPhase(g.empires.filter(e => e.human).length > 1 ? 'PASS_SCREEN' : 'ACTIVE_TURN');
    setDrawer(null); setScoutMode(null); setTipOpen(true);
    saveGame(g); bump();
  };
  const startGame = (o: Omit<NewGameOptions, 'seed'>) => {
    const g = newGame(o);
    gsRef.current = g;
    beginTurn(g);
    afterAdvance(g, advance(g));
  };
  const continueGame = (era: Era) => {
    const g = loadGame(era); if (!g) return;
    gsRef.current = g;
    if (g.over) { setPhase('GAME_OVER'); bump(); return; }
    afterAdvance(g, current(g).human ? 'human' : advance(g));
  };
  const onEndTurn = () => {
    if (!gs) return;
    sfx.click();
    afterAdvance(gs, endTurn(gs));
  };
  const onReportContinue = () => {
    if (!gs) return;
    if (gs.over) {
      if (!gs.reported) {
        const s = starsFor(gs);
        reportResult({ era: gs.era, stars: s.stars, rank: s.rank, prestige: s.prestige, rounds: gs.round, empires: gs.empires.length, gameId: String(gs.seed) });
        gs.reported = true; save();
      }
      sfx.fanfare(); setPhase('GAME_OVER'); return;
    }
    afterAdvance(gs, advance(gs));
  };

  const ctx: Ctx | null = gs && (phase === 'ACTIVE_TURN') ? {
    gs, me: current(gs).index, toast,
    open: setDrawer,
    act: (fn, ok, sound = 'click') => {
      const err = fn();
      if (typeof err === 'string') { sfx.error(); toast(err, true); bump(); return false; }
      if (ok) toast(ok);
      sfx[sound](); save(); bump();
      return true;
    },
  } : null;

  const onTap = (q: number, r: number) => {
    if (!ctx || !gs) return;
    if (scoutMode) {
      const k = key(q, r);
      if (scoutMode.reach.has(k)) {
        const res = moveScout(gs, current(gs), scoutMode.id, q, r);
        if (res.err) { toast(res.err, true); sfx.error(); }
        else { sfx.click(); res.finds.forEach(f => { toast(f.text); sfx.discover(); }); }
        save();
      }
      setScoutMode(null); bump();
      if (!scoutMode.reach.has(k)) setDrawer({ kind: 'tile', q, r });
      return;
    }
    sfx.click();
    setDrawer({ kind: 'tile', q, r });
  };
  const startScoutMove = (id: number) => {
    if (!gs) return;
    const e = current(gs); const s = e.scouts.find(x => x.id === id); if (!s) return;
    const reach = new Set([...reachable(gs, s, scoutMoves(e)).keys()].filter(k => k !== key(s.q, s.r)));
    setScoutMode({ id, reach }); setDrawer(null);
  };

  // keyboard: Escape closes a drawer
  useEffect(() => {
    const f = (ev: KeyboardEvent) => { if (ev.key === 'Escape') { setDrawer(null); setScoutMode(null); } };
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f);
  }, []);

  const saves = useMemo(() => {
    const out: Partial<Record<Era, { round: number; maxRounds: number; names: string }>> = {};
    for (const era of [1, 2] as Era[]) { const g = loadGame(era); if (g && !g.over) out[era] = { round: g.round, maxRounds: g.maxRounds, names: g.empires.map(e => e.name).join(', ') }; }
    return out;
  }, [phase]);   // eslint-disable-line react-hooks/exhaustive-deps

  const muteBtn = <button type="button" aria-label={muted ? 'Sound on' : 'Sound off'} onClick={() => { setMuted(!muted); setMute(!muted); }} className="w-8 h-8 shrink-0 rounded-lg bg-card border border-line">{muted ? '🔇' : '🔊'}</button>;

  if (phase === 'TITLE_MENU' || !gs) {
    if (phase === 'SETUP') return <Shell><SetupScreen lockedEra={LOCKED_ERA} onStart={startGame} onBack={() => setPhase('TITLE_MENU')} /></Shell>;
    return <Shell><TitleScreen lockedEra={LOCKED_ERA} saves={saves} onNew={() => setPhase('SETUP')} onContinue={continueGame} onClose={EMBEDDED ? closeGame : null} /></Shell>;
  }
  if (phase === 'SETUP') return <Shell><SetupScreen lockedEra={LOCKED_ERA} onStart={startGame} onBack={() => setPhase('TITLE_MENU')} /></Shell>;
  if (phase === 'PASS_SCREEN') return <Shell><PassScreen gs={gs} onReady={() => { setPhase('ACTIVE_TURN'); bump(); }} /></Shell>;
  if (phase === 'ROUND_RESOLUTION') return <Shell><RoundReport gs={gs} viewer={humans === 1 ? gs.empires.find(e => e.human)!.index : null} onContinue={onReportContinue} /></Shell>;
  if (phase === 'GAME_OVER') return <Shell><GameOver gs={gs} onAgain={() => { clearSave(gs.era); gsRef.current = null; setPhase('SETUP'); }} onClose={EMBEDDED ? closeGame : null} /></Shell>;

  // ---------- the turn ----------
  const e = current(gs);
  const c = ctx!;
  const p = production(gs, e), cap = capacity(gs, e), have = stored(e);
  const tip = advice(gs, e)[0];
  const tileDrawer = drawer?.kind === 'tile' ? gs.tiles.get(key(drawer.q, drawer.r)) : null;
  const close = () => setDrawer(null);
  const navBtn = (label: string, icon: string, d: Drawer, badge?: boolean) => (
    <button type="button" onClick={() => { sfx.click(); setDrawer(drawer?.kind === d?.kind ? null : d); }}
      className={`relative flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-lg text-[11px] leading-none ${drawer?.kind === d?.kind ? 'bg-card text-amber-200' : 'text-slate-300'}`}>
      <span className="text-xl">{icon}</span>{label}
      {badge && <span className="absolute top-1 right-2 w-2.5 h-2.5 rounded-full bg-amber-400" />}
    </button>
  );
  return (
    <div className="h-full flex flex-col">
      {/* top bar */}
      <header ref={headerRef} className="bg-panel border-b border-line px-2 py-1.5 space-y-1.5">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: e.color }} />
          <b className="font-display text-amber-100 truncate min-w-0">{civById(e.civId).emoji} {e.name}</b>
          <span className="text-xs text-slate-400 shrink-0">R{gs.round}/{gs.maxRounds}</span>
          <span className="flex-1" />
          <span className="font-semibold tabular-nums shrink-0" title="Gold">🪙{Math.floor(e.gold)}<span className="text-[10px] text-emerald-300">+{p.gold}</span></span>
          <span className="font-semibold tabular-nums shrink-0" title="Prestige">👑{Math.round(e.prestige)}</span>
          {muteBtn}
          {EMBEDDED && <button type="button" aria-label="Save and close" onClick={() => { save(); closeGame(); }} className="w-8 h-8 shrink-0 rounded-lg bg-card border border-line">✕</button>}
        </div>
        <div className="flex items-center gap-1 text-xs">
          {RESOURCES.map(r => {
            const net = p[r] - (r === 'food' ? foodUpkeep(gs, e) : 0);
            return (
              <span key={r} className="flex-1 min-w-0 flex flex-col items-center rounded-md bg-card py-0.5" title={RES_INFO[r].name}>
                <span className="tabular-nums">{RES_INFO[r].emoji}<b className="ml-0.5">{Math.floor(e.stock[r])}</b></span>
                <span className={`text-[10px] tabular-nums ${net < 0 ? 'text-rose-300' : 'text-slate-400'}`}>{net >= 0 ? '+' : ''}{net}</span>
              </span>
            );
          })}
          <span className={`flex-1 min-w-0 flex flex-col items-center rounded-md py-0.5 ${have > cap ? 'bg-rose-900/60' : 'bg-card'}`} title="Goods stored / storage room">
            <span>📦<b className="ml-0.5 tabular-nums">{Math.floor(have)}</b></span>
            <span className="text-[10px] text-slate-400 tabular-nums">/{cap}</span>
          </span>
        </div>
      </header>

      {/* map */}
      <main className="relative flex-1 min-h-0">
        <HexMap gs={gs} viewer={e.index} selected={drawer?.kind === 'tile' ? drawer : null} highlight={scoutMode?.reach || null} onTap={onTap} version={version} />
        {scoutMode && <div className="absolute top-2 left-2 right-14 rounded-lg bg-emerald-900/90 border border-emerald-500 px-3 py-2 text-sm">🧭 Tap a green hex to move your scout. <button type="button" className="underline ml-1" onClick={() => setScoutMode(null)}>Cancel</button></div>}
        {!scoutMode && tipOpen && tip && !drawer && (
          <div className="absolute top-2 left-2 right-14 rounded-lg bg-panel/95 border border-line px-3 py-2 text-xs flex gap-2">
            <span className="flex-1">{tip}</span>
            <button type="button" aria-label="Hide tip" onClick={() => setTipOpen(false)} className="text-slate-400">✕</button>
          </div>
        )}
        {gs.crisis && !drawer && <button type="button" onClick={() => setDrawer({ kind: 'aid' })} className="absolute bottom-2 left-2 rounded-lg bg-amber-500 text-slate-950 px-3 py-1.5 text-xs font-bold shadow">🆘 {gs.crisis.name}</button>}
      </main>
      <div className="fixed top-24 inset-x-0 z-50 pointer-events-none flex flex-col items-center gap-1.5 px-3" aria-live="polite">
        {toasts.map(t => <div key={t.id} className={`max-w-md rounded-lg px-3 py-2 text-sm shadow-lg ${t.bad ? 'bg-rose-800' : 'bg-slate-800 border border-line'}`}>{t.text}</div>)}
      </div>

      {/* bottom bar */}
      <nav className="relative z-40 bg-panel border-t border-line grid grid-cols-7 gap-0.5 px-1 pt-1 h-[calc(60px+env(safe-area-inset-bottom))] pb-[calc(0.25rem+env(safe-area-inset-bottom))]">
        {navBtn('Empire', '👑', { kind: 'empire' })}
        {navBtn('Market', '🏛️', { kind: 'market' })}
        {navBtn('Clans', '⚔️', { kind: 'clans' })}
        {navBtn('Trader', '🐫', { kind: 'trader' }, traderNear(gs, e))}
        {navBtn('Log', '📜', { kind: 'log' })}
        {navBtn('Help', '📖', { kind: 'help' })}
        <button type="button" onClick={onEndTurn} className="rounded-lg bg-amber-500 text-slate-950 font-bold text-xs leading-tight px-1">End<br />turn ▶</button>
      </nav>

      {tileDrawer && <TileDrawer c={c} t={tileDrawer} onClose={close} onMoveScout={startScoutMove} />}
      {drawer?.kind === 'market' && <MarketDrawer c={c} onClose={close} />}
      {drawer?.kind === 'clans' && <ClansDrawer c={c} onClose={close} />}
      {drawer?.kind === 'trader' && <TraderDrawer c={c} onClose={close} />}
      {drawer?.kind === 'aid' && <AidDrawer c={c} onClose={close} />}
      {drawer?.kind === 'empire' && <EmpireDrawer c={c} onClose={close} />}
      {drawer?.kind === 'log' && <LogDrawer c={c} onClose={close} />}
      {drawer?.kind === 'help' && <HelpDrawer c={c} onClose={close} />}
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="h-full overflow-y-auto">{children}</div>;
}
