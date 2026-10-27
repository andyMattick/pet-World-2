/* Full screens: title, setup, pass the device, end-of-round report, game over. */
import { useState } from 'react';
import type { ChronicleEntry, Era, GameState, SlotConfig } from '../types/game';
import { civById, civsForEra, ERA_NAME } from '../config/civilizations';
import { LENGTHS, MAP_SIZES, PRESTIGE_TARGET } from '../config/rules';
import { current, ranking, starsFor } from '../logic/engine';
import { Btn, Card, Note } from './ui';
import { HelpBody } from './OtherDrawers';

export function TitleScreen({ lockedEra, saves, onNew, onContinue, onClose }: {
  lockedEra: Era | null; saves: Partial<Record<Era, { round: number; maxRounds: number; names: string }>>;
  onNew: () => void; onContinue: (era: Era) => void; onClose: (() => void) | null;
}) {
  const [help, setHelp] = useState(false);
  const eras: Era[] = lockedEra ? [lockedEra] : [1, 2];
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-4 py-8 text-center">
      <div className="text-5xl mb-2">⚖️🏛️🐫</div>
      <h1 className="font-display text-4xl sm:text-5xl text-amber-200 tracking-wide">Pax Oeconomica</h1>
      <p className="mt-2 text-slate-300 max-w-md">Build an empire on trade. Use your resources wisely: sell what you have extra of, buy what you need, and earn the most prestige.</p>
      {lockedEra && <p className="mt-2 text-amber-300/80 text-sm">{ERA_NAME[lockedEra]}</p>}
      <div className="mt-6 flex flex-col gap-3 w-full max-w-xs">
        {eras.map(era => saves[era] && (
          <Btn key={era} tone="green" onClick={() => onContinue(era)}>▶ Continue {lockedEra ? '' : `Era ${era} `}game (round {saves[era]!.round}/{saves[era]!.maxRounds})</Btn>
        ))}
        <Btn onClick={onNew}>✨ New game</Btn>
        <Btn tone="plain" onClick={() => setHelp(h => !h)}>📖 How to play</Btn>
        {onClose && <Btn tone="plain" onClick={onClose}>← Back to Pet World</Btn>}
      </div>
      {help && <div className="mt-6 max-w-xl text-left"><Card><HelpBody era={lockedEra || 1} /></Card></div>}
    </div>
  );
}

export function SetupScreen({ lockedEra, onStart, onBack }: {
  lockedEra: Era | null;
  onStart: (o: { era: Era; slots: SlotConfig[]; radius: number; maxRounds: number; difficulty: GameState['difficulty'] }) => void; onBack: () => void;
}) {
  const [era, setEra] = useState<Era>(lockedEra || 1);
  const civs = civsForEra(era);
  const defaultSlots = (er: Era): SlotConfig[] => civsForEra(er).slice(0, 3).map((c, i) => ({ human: i === 0, civId: c.id, name: i === 0 ? '' : c.name }));
  const [slots, setSlots] = useState<SlotConfig[]>(defaultSlots(era));
  const [radius, setRadius] = useState(MAP_SIZES[0].radius);
  const [rounds, setRounds] = useState(LENGTHS[0].rounds);
  const [difficulty, setDifficulty] = useState<GameState['difficulty']>('normal');
  const changeEra = (er: Era) => { setEra(er); setSlots(defaultSlots(er)); };
  const update = (i: number, patch: Partial<SlotConfig>) => setSlots(s => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const setCount = (n: number) => setSlots(s => {
    if (n < s.length) return s.slice(0, n);
    const used = new Set(s.map(x => x.civId));
    const extra = civs.filter(c => !used.has(c.id)).slice(0, n - s.length).map(c => ({ human: false, civId: c.id, name: c.name }));
    return [...s, ...extra];
  });
  const humans = slots.filter(s => s.human).length;
  const dupes = new Set(slots.map(s => s.civId)).size !== slots.length;
  const start = () => onStart({ era, radius, maxRounds: rounds, difficulty, slots: slots.map(s => ({ ...s, name: s.name.trim() || civById(s.civId).name })) });
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <h1 className="font-display text-3xl text-amber-200">New game</h1>
      {!lockedEra && (
        <div className="grid grid-cols-2 gap-2">
          {([1, 2] as Era[]).map(er => <Btn key={er} tone={era === er ? 'gold' : 'plain'} onClick={() => changeEra(er)}>{er === 1 ? '🏛️ Classical Age' : '🕌 Medieval Age'}</Btn>)}
        </div>
      )}
      <p className="text-slate-400 text-sm">{ERA_NAME[era]}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span>Empires:</span>
        {[2, 3, 4].map(n => <Btn key={n} small tone={slots.length === n ? 'gold' : 'plain'} onClick={() => setCount(n)}>{n}</Btn>)}
      </div>
      <div className="space-y-2">
        {slots.map((s, i) => {
          const civ = civById(s.civId);
          return (
            <Card key={i}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-4 h-4 rounded" style={{ background: civ.color }} />
                <select value={s.civId} onChange={ev => update(i, { civId: ev.target.value, name: s.human ? s.name : civById(ev.target.value).name })} className="bg-ink border border-line rounded px-2 py-1.5">
                  {civs.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                </select>
                <Btn small tone={s.human ? 'green' : 'plain'} onClick={() => update(i, { human: !s.human })}>{s.human ? '🧑 Player' : '🤖 Computer'}</Btn>
                {s.human && <input value={s.name} placeholder="Your name" maxLength={16} onChange={ev => update(i, { name: ev.target.value })} className="flex-1 min-w-[8rem] bg-ink border border-line rounded px-2 py-1.5" />}
              </div>
              <p className="mt-1.5 text-xs"><b className="text-amber-200">{civ.ability}:</b> {civ.abilityText}</p>
              <p className="text-xs text-slate-400">Rich in {civ.rich.join(' & ')} · short of {civ.poor.join(' & ')}</p>
            </Card>
          );
        })}
      </div>
      {dupes && <p className="text-rose-300 text-sm">Each empire must be different.</p>}
      {humans === 0 && <p className="text-rose-300 text-sm">At least one empire must be a player.</p>}
      {humans > 1 && <Note>Several players share this device: each one takes a turn, then passes it on.</Note>}
      <div className="grid sm:grid-cols-3 gap-3">
        <div><div className="text-xs text-slate-400 mb-1">Map</div><div className="flex gap-1.5">{MAP_SIZES.map(m => <Btn key={m.radius} small tone={radius === m.radius ? 'gold' : 'plain'} onClick={() => setRadius(m.radius)}>{m.name}</Btn>)}</div></div>
        <div><div className="text-xs text-slate-400 mb-1">Length</div><div className="flex gap-1.5">{LENGTHS.map(l => <Btn key={l.rounds} small tone={rounds === l.rounds ? 'gold' : 'plain'} onClick={() => setRounds(l.rounds)}>{l.rounds}</Btn>)}</div></div>
        <div><div className="text-xs text-slate-400 mb-1">Computers</div><div className="flex gap-1.5">{(['easy', 'normal', 'hard'] as const).map(d => <Btn key={d} small tone={difficulty === d ? 'gold' : 'plain'} onClick={() => setDifficulty(d)}>{d}</Btn>)}</div></div>
      </div>
      <Note>{rounds} rounds. The first empire to {PRESTIGE_TARGET} prestige wins early; otherwise the leader after round {rounds} wins. A short game takes about 30–45 minutes.</Note>
      <div className="flex gap-2">
        <Btn tone="plain" onClick={onBack}>← Back</Btn>
        <Btn disabled={dupes || humans === 0} onClick={start}>Start ▶</Btn>
      </div>
    </div>
  );
}

export function PassScreen({ gs, onReady }: { gs: GameState; onReady: () => void }) {
  const e = current(gs);
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-4 text-center gap-4">
      <div className="text-5xl">{civById(e.civId).emoji}</div>
      <h1 className="font-display text-3xl" style={{ color: e.color }}>Next turn: {e.name}</h1>
      <p className="text-slate-300">Pass the device to {e.name}. No peeking at other empires’ plans!</p>
      <Btn onClick={onReady}>I’m {e.name}: show my empire</Btn>
    </div>
  );
}

export function RoundReport({ gs, viewer, onContinue }: { gs: GameState; viewer: number | null; onContinue: () => void }) {
  const r = gs.roundReport;
  const round = r[0]?.round ?? gs.round - 1;
  const mine = (x: ChronicleEntry) => viewer !== null && x.empire === viewer;
  const rivals = gs.chronicle.filter(x => x.kind === 'ai' && x.round === round);   // what the computer empires did
  const shown = [...rivals, ...r.filter(x => x.kind !== 'market' || mine(x) || gs.empires.filter(e => e.human).some(e => e.index === x.empire))];
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
      <h1 className="font-display text-3xl text-amber-200">End of round {round}</h1>
      <div className="space-y-2">
        {shown.map((x, i) => (
          <Card key={i} className={x.kind === 'raid' ? 'border-rose-700' : x.kind === 'mutiny' ? 'border-amber-600' : ''}>
            <span className="mr-1">{x.kind === 'raid' ? '⚔️' : x.kind === 'mutiny' ? '😠' : x.kind === 'market' ? '🧺' : x.kind === 'ai' ? '🤖' : '📜'}</span>
            {x.text}
          </Card>
        ))}
      </div>
      <Card>
        <b>Prestige</b>
        {ranking(gs).map((e, i) => <div key={e.index} className="flex justify-between text-sm"><span>{i + 1}. <span style={{ color: e.color }}>■</span> {e.name}</span><b>{Math.round(e.prestige)} 👑</b></div>)}
      </Card>
      <Btn onClick={onContinue}>{gs.over ? 'See the results' : `Start round ${gs.round} ▶`}</Btn>
    </div>
  );
}

export function GameOver({ gs, onAgain, onClose }: { gs: GameState; onAgain: () => void; onClose: (() => void) | null }) {
  const r = ranking(gs);
  const s = starsFor(gs);
  const win = r[0];
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4 text-center">
      <div className="text-5xl">{win.human ? '🏆' : '📜'}</div>
      <h1 className="font-display text-3xl text-amber-200">{win.name} wins!</h1>
      <p className="text-3xl">{'⭐'.repeat(s.stars)}{'☆'.repeat(3 - s.stars)}</p>
      <p className="text-slate-300">{gs.empires.filter(e => e.human).length > 1 ? 'Best player' : 'You'} finished #{s.rank} of {gs.empires.length} with {s.prestige} prestige.</p>
      <div className="space-y-2 text-left">
        {r.map((e, i) => (
          <Card key={e.index}>
            <div className="flex justify-between"><b>{i + 1}. <span style={{ color: e.color }}>■</span> {civById(e.civId).emoji} {e.name}{e.human ? '' : ' 🤖'}</b><b>{Math.round(e.prestige)} 👑</b></div>
            <p className="text-xs text-slate-400 mt-1">
              Sold {Math.round(e.stats.sold)} 🪙 of goods · bought {Math.round(e.stats.bought)} 🪙 · gave {e.stats.aid} in aid · drove off {e.stats.repelled} raids · raided {e.stats.raided} times · {e.stats.spoiled} goods spoiled · wonder {e.wonder}/3
            </p>
          </Card>
        ))}
      </div>
      <Note>Think about it: what did you sell, what did you have to buy, and was anything wasted? The best traders sell what is scarce and never let goods spoil.</Note>
      <div className="flex gap-2 justify-center">
        <Btn onClick={onAgain}>Play again</Btn>
        {onClose && <Btn tone="plain" onClick={onClose}>← Back to Pet World</Btn>}
      </div>
    </div>
  );
}
