/* Small shared pieces: buttons, the drawer (a bottom sheet on phones, a side panel on wide screens), bars, sparklines. */
import type { ReactNode } from 'react';
import type { GameState, ResourceType } from '../types/game';
import { RES_INFO } from '../config/rules';

export interface Ctx {
  gs: GameState;
  me: number;                                   // the human whose turn it is (whose view the map shows)
  act: (fn: () => string | null | void, ok?: string, sound?: 'build' | 'coin' | 'click' | 'discover') => boolean;
  toast: (s: string) => void;
  open: (d: Drawer) => void;
}
export type Drawer = { kind: 'tile'; q: number; r: number } | { kind: 'market' } | { kind: 'clans' } | { kind: 'trader' } | { kind: 'aid' }
  | { kind: 'empire' } | { kind: 'log' } | { kind: 'help' } | null;

export function Btn({ children, onClick, disabled, tone = 'gold', small, title, wide }: {
  children: ReactNode; onClick?: () => void; disabled?: boolean; tone?: 'gold' | 'plain' | 'red' | 'green'; small?: boolean; title?: string; wide?: boolean;
}) {
  const tones = {
    gold: 'bg-amber-500 text-slate-950 hover:bg-amber-400',
    plain: 'bg-card text-slate-100 border border-line hover:bg-slate-700',
    red: 'bg-rose-700 text-white hover:bg-rose-600',
    green: 'bg-emerald-600 text-white hover:bg-emerald-500',
  };
  return (
    <button type="button" title={title} disabled={disabled} onClick={onClick}
      className={`${tones[tone]} ${small ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'} ${wide ? 'w-full' : ''} rounded-lg font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-95`}>
      {children}
    </button>
  );
}

export function Sheet({ title, onClose, children, icon }: { title: string; onClose: () => void; children: ReactNode; icon?: string }) {
  return (
    <div style={{ bottom: 'calc(60px + env(safe-area-inset-bottom))' }}
      className="fixed inset-x-0 z-30 max-h-[60vh] md:top-[var(--hud-h,88px)] md:left-auto md:right-0 md:max-h-none md:w-[400px] flex flex-col bg-panel border-t md:border-t-0 md:border-l border-line rounded-t-2xl md:rounded-none shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
        {icon && <span className="text-xl">{icon}</span>}
        <h2 className="font-display text-lg text-amber-200 flex-1">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full bg-card text-slate-300 hover:text-white">✕</button>
      </div>
      <div className="overflow-y-auto px-4 py-3 space-y-3 text-sm">{children}</div>
    </div>
  );
}

export function Bar({ value, max, color = '#f59e0b', danger }: { value: number; max: number; color?: string; danger?: boolean }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: danger ? '#e11d48' : color }} />
    </div>
  );
}

export function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return <span className="text-slate-500 text-xs">—</span>;
  const w = 64, h = 20, lo = Math.min(...data), hi = Math.max(...data), span = hi - lo || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - lo) / span) * (h - 4) - 2}`).join(' ');
  return <svg width={w} height={h} className="shrink-0" aria-hidden="true"><polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" /></svg>;
}

export const Res = ({ r, n }: { r: ResourceType; n?: number }) => (
  <span className="inline-flex items-center gap-0.5 whitespace-nowrap">{RES_INFO[r].emoji}{n !== undefined && <b className="tabular-nums">{Math.floor(n)}</b>}</span>
);
export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-xl bg-card border border-line p-3 ${className}`}>{children}</div>
);
export const Note = ({ children }: { children: ReactNode }) => <p className="text-xs text-slate-400 leading-relaxed">{children}</p>;
