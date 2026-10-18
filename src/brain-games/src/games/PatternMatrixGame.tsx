import React, { useState } from 'react';
import { GameResult } from '../types/game';
import { PACE } from '../utils/pace';
import { playSuccess, playError, playTap, playVictory } from '../utils/audio';
import { Play, RotateCcw, Check, Grid, HelpCircle } from 'lucide-react';

/* Pattern Matrix: a 3×3 grid with the last tile missing. Every puzzle is made fresh from rules, so rounds don't repeat.
   'single-rule': one thing changes across the grid (how many, which shape, how filled, which color, or which way an
   arrow points). 'dual-rule': two things change at once. With extra time (?pace from Pet World) there are 3 answer
   choices instead of 4. */

interface MatrixGameProps {
  difficulty?: string;
  onGameEnd?: (result: GameResult) => void;
  isEmbedded?: boolean;
}

type Attr = 'count' | 'shape' | 'fill' | 'color' | 'rot';
interface Tile { count: number; shape: number; fill: number; color: number; rot: number }
interface Rule { attr: Attr; at: (r: number, c: number) => number; explain: string }
interface Puzzle { cells: Tile[]; answer: Tile; options: Tile[]; explain: string }

const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'star'];
const SHAPE_NAMES = ['circle', 'square', 'triangle', 'diamond', 'star'];
const ARROW = 5;   // shape index for the arrow (rotation puzzles only)
const COLORS = ['#a78bfa', '#fbbf24', '#34d399', '#38bdf8', '#fb7185'];
const PUZZLES_PER_ROUND = 6;

const rnd = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(list: T[]) => list[rnd(list.length)];
function shuffle<T>(list: T[]): T[] { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const key = (t: Tile) => `${t.count}|${t.shape}|${t.fill}|${t.color}|${t.rot % 360}`;

/* one rule for one attribute; each makes rows and columns follow the same pattern */
function makeRule(attr: Attr): Rule {
  const dir = Math.random() < 0.5 ? 1 : 2;   // Latin-square direction: (r + c) or (2r + c), so rows shift left or right
  if (attr === 'count') {
    if (Math.random() < 0.5) { const a = 1 + rnd(2); return { attr, at: (r, c) => a + r + c, explain: 'One more in each step: across a row and down a column.' }; }
    const vals = shuffle([1, 2, 3, 4]).slice(0, 3);
    return { attr, at: (r, c) => vals[(c + dir * r) % 3], explain: `Each row has ${vals.slice().sort().slice(0, 2).join(', ')} and ${vals.slice().sort()[2]} once.` };
  }
  if (attr === 'shape') { const vals = shuffle([0, 1, 2, 3, 4]).slice(0, 3); return { attr, at: (r, c) => vals[(c + dir * r) % 3], explain: `Each row has one ${SHAPE_NAMES[vals[0]]}, one ${SHAPE_NAMES[vals[1]]} and one ${SHAPE_NAMES[vals[2]]}.` }; }
  if (attr === 'fill') { const vals = shuffle([0, 1, 2]); return { attr, at: (r, c) => vals[(c + dir * r) % 3], explain: 'Each row has one empty, one half-filled and one solid.' }; }
  if (attr === 'color') { const vals = shuffle([0, 1, 2, 3, 4]).slice(0, 3); return { attr, at: (r, c) => vals[(c + dir * r) % 3], explain: 'Each row uses each of the three colors once.' }; }
  const step = pick([45, 90]), base = pick([0, 45, 90, 180]);
  return { attr: 'rot', at: (r, c) => base + (r + c) * step, explain: `The arrow turns ${step}° clockwise at each step.` };
}

function makePuzzle(ruleCount: number, choices: number): Puzzle {
  const attrs = shuffle<Attr>(['count', 'shape', 'fill', 'color', 'rot']);
  let chosen = attrs.slice(0, ruleCount);
  if (chosen.includes('rot') && chosen.includes('shape')) chosen = chosen.map(a => (a === 'shape' ? attrs.find(x => !chosen.includes(x) && x !== 'shape')! : a));
  const rules = chosen.map(makeRule);
  const fixed: Tile = { count: 1 + rnd(3), shape: rnd(5), fill: rnd(3), color: rnd(5), rot: 0 };
  if (chosen.includes('rot')) { fixed.shape = ARROW; fixed.count = chosen.includes('count') ? fixed.count : 1; }
  const tileAt = (r: number, c: number): Tile => { const t = { ...fixed }; rules.forEach(rule => { t[rule.attr] = rule.at(r, c); }); return t; };
  const cells: Tile[] = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (r < 2 || c < 2) cells.push(tileAt(r, c));
  const answer = tileAt(2, 2);
  /* wrong answers: the right tile with one thing changed, mostly a thing the rule changes, so the rule must be used */
  const seen = new Set([key(answer)]), options = [answer];
  const changeable: Attr[] = [...chosen, ...chosen, pick<Attr>(['count', 'fill', 'color'].filter(a => !chosen.includes(a as Attr)) as Attr[])].filter(Boolean);
  for (let tries = 0; options.length < choices && tries < 200; tries++) {
    const attr = pick(changeable), t = { ...answer };
    if (attr === 'count') t.count = Math.max(1, Math.min(6, t.count + pick([-2, -1, 1, 2])));
    else if (attr === 'shape') t.shape = pick([0, 1, 2, 3, 4].filter(v => v !== answer.shape));
    else if (attr === 'fill') t.fill = pick([0, 1, 2].filter(v => v !== answer.fill));
    else if (attr === 'color') t.color = pick([0, 1, 2, 3, 4].filter(v => v !== answer.color));
    else t.rot = answer.rot + pick([45, 90, 180, 270]);
    if (!seen.has(key(t))) { seen.add(key(t)); options.push(t); }
  }
  return { cells, answer, options: shuffle(options), explain: rules.map(r => r.explain).join(' ') };
}

/* ---------- drawing a tile ---------- */
const LAYOUTS: Record<number, [number, number][]> = {
  1: [[50, 50]], 2: [[30, 50], [70, 50]], 3: [[50, 28], [28, 70], [72, 70]], 4: [[30, 30], [70, 30], [30, 70], [70, 70]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]], 6: [[28, 25], [72, 25], [28, 50], [72, 50], [28, 75], [72, 75]],
};
function Glyph({ t, x, y, s }: { t: Tile; x: number; y: number; s: number }) {
  const color = COLORS[t.color % COLORS.length], h = s / 2;
  const paint = { stroke: color, strokeWidth: 4, fill: t.fill === 0 ? 'none' : color, fillOpacity: t.fill === 1 ? 0.35 : 1, strokeLinejoin: 'round' as const };
  if (t.shape === ARROW) return <path d={`M ${x} ${y - h} L ${x + h * 0.75} ${y} L ${x + h * 0.3} ${y} L ${x + h * 0.3} ${y + h} L ${x - h * 0.3} ${y + h} L ${x - h * 0.3} ${y} L ${x - h * 0.75} ${y} Z`} transform={`rotate(${t.rot % 360} ${x} ${y})`} {...paint} />;
  const shape = SHAPES[t.shape];
  if (shape === 'circle') return <circle cx={x} cy={y} r={h} {...paint} />;
  if (shape === 'square') return <rect x={x - h * 0.9} y={y - h * 0.9} width={h * 1.8} height={h * 1.8} rx={3} {...paint} />;
  if (shape === 'triangle') return <polygon points={`${x},${y - h} ${x + h},${y + h * 0.8} ${x - h},${y + h * 0.8}`} {...paint} />;
  if (shape === 'diamond') return <polygon points={`${x},${y - h} ${x + h},${y} ${x},${y + h} ${x - h},${y}`} {...paint} />;
  const pts = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? h * 0.45 : h; return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`; }).join(' ');
  return <polygon points={pts} {...paint} />;
}
function TileView({ t }: { t: Tile }) {
  const spots = LAYOUTS[Math.max(1, Math.min(6, t.count))], size = t.count === 1 ? 44 : t.count <= 2 ? 30 : t.count <= 4 ? 26 : 20;
  return <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">{spots.map(([x, y], i) => <Glyph key={i} t={t} x={x} y={y} s={size} />)}</svg>;
}

export const PatternMatrixGame: React.FC<MatrixGameProps> = ({
  difficulty = 'single-rule',
  onGameEnd,
  isEmbedded = false,
}) => {
  const ruleCount = difficulty === 'dual-rule' ? 2 : 1, choices = PACE > 1 ? 3 : 4;
  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'SUMMARY'>('TITLE_MENU');
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [times, setTimes] = useState<number[]>([]);
  const [shownAt, setShownAt] = useState<number>(0);

  const current = puzzles[puzzleIndex];

  const startGame = () => {
    playTap();
    setPuzzles(Array.from({ length: PUZZLES_PER_ROUND }, () => makePuzzle(ruleCount, choices)));
    setGameState('PLAYING');
    setPuzzleIndex(0); setScore(0); setCorrectCount(0); setSelected(null); setTimes([]);
    setStartedAt(Date.now()); setShownAt(Date.now());
  };

  const choose = (i: number) => {
    if (selected !== null || !current) return;
    setSelected(i);
    const isCorrect = key(current.options[i]) === key(current.answer), rt = Date.now() - shownAt;
    const nextTimes = [...times, rt]; setTimes(nextTimes);
    if (isCorrect) { playSuccess(); setCorrectCount(c => c + 1); setScore(s => s + 250); } else playError();
    setTimeout(() => advance(isCorrect, nextTimes), isCorrect ? 900 : 2200);   // a wrong answer stays up longer, with the rule shown
  };

  const advance = (wasCorrect: boolean, allTimes: number[]) => {
    setSelected(null);
    if (puzzleIndex + 1 >= puzzles.length) {
      playVictory();
      setGameState('SUMMARY');
      const totalCorrect = correctCount + (wasCorrect ? 1 : 0);
      const result: GameResult = {
        gameId: 'pattern-matrix',
        score: score + (wasCorrect ? 250 : 0),
        accuracy: Math.round((totalCorrect / puzzles.length) * 100),
        avgReactionTimeMs: Math.round(allTimes.reduce((a, b) => a + b, 0) / Math.max(1, allTimes.length)),
        completedAt: new Date().toISOString(),
        durationSeconds: Math.round((Date.now() - startedAt) / 1000),
        difficulty,
      };
      if (onGameEnd) onGameEnd(result);
    } else {
      setPuzzleIndex(i => i + 1);
      setShownAt(Date.now());
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${isEmbedded ? 'p-2' : 'p-4 md:p-6'} select-none`}>
      {gameState === 'TITLE_MENU' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-4">
            <Grid className="w-7 h-7" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">Pattern Matrix</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base mb-6 leading-relaxed">
            Look across each row and down each column. What changes? Pick the tile that fits the empty spot.
            {ruleCount === 2 ? ' Two things change at once!' : ''}
          </p>
          <button onClick={startGame} className="inline-flex items-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-violet-600/20 cursor-pointer">
            <Play className="w-4 h-4 fill-white" />
            Start
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && current && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 text-xs md:text-sm text-slate-400">
            <span>Puzzle <strong className="text-white font-mono">{puzzleIndex + 1}</strong> / {puzzles.length}</span>
            <span>Score: <strong className="text-white font-mono tabular-nums">{score}</strong></span>
          </div>

          <div className="flex flex-col items-center justify-center my-2">
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-950 rounded-2xl border border-slate-800 w-72 h-72 md:w-80 md:h-80 shadow-inner">
              {current.cells.map((t, idx) => (
                <div key={idx} className="bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-center p-1.5"><TileView t={t} /></div>
              ))}
              <div className={`rounded-xl flex items-center justify-center p-1.5 ${selected !== null ? 'bg-slate-900/70 border border-emerald-500/60' : 'bg-violet-950/20 border-2 border-dashed border-violet-500/50 animate-pulse'}`}>
                {selected !== null ? <TileView t={current.answer} /> : <HelpCircle className="w-8 h-8 text-violet-400" />}
              </div>
            </div>
          </div>

          <div className="mt-6 min-h-[1.5rem] text-center text-sm">
            {selected !== null && (key(current.options[selected]) === key(current.answer)
              ? <span className="text-emerald-400 font-medium">Yes! {current.explain}</span>
              : <span className="text-amber-300">Not quite. {current.explain}</span>)}
          </div>

          <div className={`mt-3 grid gap-3 max-w-xl mx-auto ${choices === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
            {current.options.map((opt, idx) => {
              const right = key(opt) === key(current.answer), picked = selected === idx;
              return (
                <button
                  key={idx}
                  onClick={() => choose(idx)}
                  disabled={selected !== null}
                  className={`h-24 rounded-xl border p-2 flex items-center justify-center relative transition-all cursor-pointer ${
                    selected !== null && right ? 'bg-emerald-950/60 border-emerald-500'
                      : picked ? 'bg-rose-950/60 border-rose-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-600 hover:bg-slate-900'}`}
                >
                  <span className="absolute top-1.5 left-2 text-[10px] font-mono text-slate-500">{'ABCD'[idx]}</span>
                  <div className="w-16 h-16"><TileView t={opt} /></div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-4">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Patterns done!</h2>
          <p className="text-slate-400 text-sm mb-6">Every round has new puzzles. Play again to beat your score.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto mb-8 text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Score</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">{score}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Solved</span>
              <span className="text-xl font-bold text-violet-400 font-mono tabular-nums">{correctCount} / {puzzles.length}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Accuracy</span>
              <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">{Math.round((correctCount / Math.max(1, puzzles.length)) * 100)}%</span>
            </div>
          </div>
          <button onClick={startGame} className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-600/20">
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
