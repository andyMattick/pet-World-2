/* Barbarian clans: hire one to defend you (and keep paying it), or bribe one to raid a rival. */
import { useState } from 'react';
import { BRIBE_FOOD, BRIBE_GOLD, PAYROLL, REVOLT_AT, UNREST_MISSED } from '../config/rules';
import { bribe, clanKnown, dismiss, hire, hireCost, whyCantBribe, whyCantHire } from '../logic/barbarianAI';
import { hexDist } from '../logic/hexMath';
import { Bar, Btn, Card, Ctx, Note, Sheet } from './ui';

export default function ClansDrawer({ c, onClose }: { c: Ctx; onClose: () => void }) {
  const { gs, me, act } = c;
  const e = gs.empires[me];
  const rivals = gs.empires.filter(x => x.index !== me && x.alive);
  const [rival, setRival] = useState(rivals[0]?.index ?? 0);
  const known = gs.barbarians.filter(cl => clanKnown(e, cl) || cl.employer === me);
  return (
    <Sheet title="Barbarian clans" icon="⚔️" onClose={onClose}>
      <Note>
        Wild clans raid the nearest empire, going for storage depots first, then outposts and camps. You can <b>hire</b> a clan for {hireCost(e)} 🪙:
        it then adds its strength to your defense everywhere, but costs {PAYROLL} 🪙 every round. Miss a payment and its unrest grows by {UNREST_MISSED};
        at {REVOLT_AT} it revolts and raids your nearest depot. You can also <b>bribe</b> a wild clan ({BRIBE_GOLD} 🪙 or {BRIBE_FOOD} 🌾) to raid a rival.
      </Note>
      {!known.length && <Card>You haven’t found any barbarian camps yet. Explore with your scout.</Card>}
      {known.map(cl => {
        const hireWhy = whyCantHire(gs, e, cl);
        const mineClan = cl.employer === me;
        const dist = Math.min(...[e.capital].map(cap => hexDist(cap, cl.home)));
        return (
          <Card key={cl.id}>
            <div className="flex items-center justify-between">
              <b>🏕️ The {cl.name}</b>
              <span className="text-rose-200">strength <b>{cl.strength}</b></span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {cl.status === 'mercenary' ? (mineClan ? 'Working for you' : `Working for ${gs.empires[cl.employer!].name}`) : cl.status === 'rebel' ? 'In revolt!' : 'Wild'}
              {' · '}{dist} hexes from your capital{cl.cooldown > 0 ? ' · resting after a raid' : ''}
            </div>
            {mineClan && (
              <div className="mt-2">
                <div className="flex justify-between text-xs"><span>Unrest</span><span>{cl.unrest}/{REVOLT_AT}</span></div>
                <Bar value={cl.unrest} max={REVOLT_AT} color="#f59e0b" danger={cl.unrest >= 60} />
                <Note>Pay {PAYROLL} 🪙 each round (paid automatically if you have it). Keep gold for payday!</Note>
                <div className="mt-2"><Btn small tone="red" onClick={() => act(() => dismiss(gs, e, cl), `You let the ${cl.name} go.`, 'click')}>Let them go</Btn></div>
              </div>
            )}
            {!mineClan && cl.status !== 'mercenary' && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <Btn small disabled={!!hireWhy} title={hireWhy || ''} onClick={() => act(() => hire(gs, e, cl), `The ${cl.name} now defend you.`, 'coin')}>Hire ({hireCost(e)} 🪙)</Btn>
                  {hireWhy && <span className="text-xs text-slate-400">{hireWhy}</span>}
                </div>
                {cl.status === 'wild' && rivals.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs">Raid</span>
                    <select value={rival} onChange={ev => setRival(+ev.target.value)} className="bg-ink border border-line rounded px-2 py-1 text-xs">
                      {rivals.map(r => <option key={r.index} value={r.index}>{r.name}</option>)}
                    </select>
                    <Btn small tone="red" disabled={!!whyCantBribe(gs, e, cl, rival, 'gold')} onClick={() => act(() => bribe(gs, e, cl, rival, 'gold'), `The ${cl.name} will raid ${gs.empires[rival].name} at the end of the round.`, 'coin')}>{BRIBE_GOLD} 🪙</Btn>
                    <Btn small tone="red" disabled={!!whyCantBribe(gs, e, cl, rival, 'food')} onClick={() => act(() => bribe(gs, e, cl, rival, 'food'), `The ${cl.name} will raid ${gs.empires[rival].name} at the end of the round.`, 'click')}>{BRIBE_FOOD} 🌾</Btn>
                  </div>
                )}
                {cl.bribedAgainst !== null && <Note>Already bribed this round.</Note>}
              </div>
            )}
          </Card>
        );
      })}
    </Sheet>
  );
}
