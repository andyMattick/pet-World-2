/* The trader, crisis aid, your empire at a glance, the chronicle, and how to play. */
import { useState } from 'react';
import { RESOURCES } from '../types/game';
import { civById } from '../config/civilizations';
import { BUILD, LUXURY_NAME, PRESTIGE_TARGET, RES_INFO } from '../config/rules';
import { hasIntel, ranking, traderIntel, traderNear, traderPrices, traderReveal, traderRumor } from '../logic/engine';
import { pledge, pledgeCap, pledgedTotal, whyCantPledge } from '../logic/crisisEngine';
import { buildingsOf, capacity, foodUpkeep, ownedTiles, production, stored, troopsOf } from '../logic/economy';
import { hexDist } from '../logic/hexMath';
import { advice } from '../logic/advisor';
import { Bar, Btn, Card, Ctx, Note, Res, Sheet } from './ui';

export function TraderDrawer({ c, onClose }: { c: Ctx; onClose: () => void }) {
  const { gs, me, act } = c;
  const e = gs.empires[me];
  const near = traderNear(gs, e);
  const price = traderPrices(e);
  const rivals = gs.empires.filter(x => x.index !== me);
  const [rival, setRival] = useState(rivals[0]?.index ?? 0);
  const d = Math.min(...ownedTiles(gs, me).map(t => hexDist(t, gs.trader)));
  // trader actions return a message either way; they worked if gold was spent
  const run = (fn: () => string) => { const before = e.gold; const msg = fn(); if (e.gold < before) act(() => null, msg, 'discover'); else act(() => msg); };
  return (
    <Sheet title="The trader" icon="🐫" onClose={onClose}>
      <Note>A wandering caravan travels between the empires. When it is next to your land or one of your scouts, it sells information.</Note>
      {!near && <Card>The caravan is {d} hexes from your land. {e.visible.has(`${gs.trader.q},${gs.trader.r}`) ? 'You can see it on the map (🐫).' : 'You can’t see it right now.'} Move a scout next to it, or wait for it to visit.</Card>}
      <Card>
        <div className="flex items-center gap-2"><span className="flex-1"><b>🗺️ Map</b> ({price.reveal} 🪙)<br /><span className="text-xs text-slate-400">Shows 7 hexes of unexplored land worth knowing about.</span></span>
          <Btn small disabled={!near || e.gold < price.reveal} onClick={() => run(() => traderReveal(gs, e))}>Buy</Btn></div>
      </Card>
      <Card>
        <div className="flex items-center gap-2 flex-wrap"><span className="flex-1"><b>🕵️ News of a rival</b> ({price.intel} 🪙)<br /><span className="text-xs text-slate-400">Puts their capital on your map and shows their gold and goods this round.</span></span>
          <select value={rival} onChange={ev => setRival(+ev.target.value)} className="bg-ink border border-line rounded px-2 py-1 text-xs">{rivals.map(r => <option key={r.index} value={r.index}>{r.name}</option>)}</select>
          <Btn small disabled={!near || e.gold < price.intel} onClick={() => run(() => traderIntel(gs, e, rival))}>Buy</Btn></div>
      </Card>
      <Card>
        <div className="flex items-center gap-2"><span className="flex-1"><b>👂 Rumor</b> ({price.rumor} 🪙)<br /><span className="text-xs text-slate-400">Is a crisis coming? Knowing early lets you store goods while they are cheap.</span></span>
          <Btn small disabled={!near || e.gold < price.rumor} onClick={() => run(() => traderRumor(gs, e))}>Buy</Btn></div>
      </Card>
    </Sheet>
  );
}

export function AidDrawer({ c, onClose }: { c: Ctx; onClose: () => void }) {
  const { gs, me, act } = c;
  const e = gs.empires[me];
  const cr = gs.crisis;
  if (!cr) return <Sheet title="Crisis aid" icon="🆘" onClose={onClose}><Card>No crisis right now. When one comes, empires that send help earn prestige.</Card></Sheet>;
  const total = pledgedTotal(gs), mult = civById(e.civId).mods.aidPrestigeMult || 1;
  const r = cr.resource;
  return (
    <Sheet title={cr.name} icon="🆘" onClose={onClose}>
      <Card><p>{cr.text}</p><p className="mt-1 text-amber-200">{RES_INFO[r].name} costs more while this lasts ({gs.crisisLeft} more round{gs.crisisLeft === 1 ? '' : 's'}).</p></Card>
      <Card>
        <div className="flex justify-between"><span>Sent so far</span><b>{total} / {cr.need} {RES_INFO[r].emoji}</b></div>
        <div className="mt-1.5"><Bar value={total} max={cr.need} color="#10b981" /></div>
        <p className="mt-2">You gave <b>{e.pledged[r]}</b> (up to {pledgeCap(gs)} each). You have <Res r={r} n={e.stock[r]} />.</p>
        <div className="flex gap-2 mt-2">
          {[5, 10, 20].map(n => <Btn key={n} small tone="green" disabled={!!whyCantPledge(gs, e, n)} onClick={() => act(() => pledge(gs, e, n), `Sent ${n} ${RES_INFO[r].name.toLowerCase()}. Thank you!`, 'coin')}>Give {n}</Btn>)}
        </div>
        {whyCantPledge(gs, e, 5) && <Note>{whyCantPledge(gs, e, 5)}</Note>}
      </Card>
      <Note>Each unit you give earns {mult === 1 ? '1 prestige' : `${mult} prestige`}. If the empires together send everything needed, every helper gets +5 and the biggest helper +10 more. Think it over: is it worth more to sell at the high price, or to help?</Note>
    </Sheet>
  );
}

export function EmpireDrawer({ c, onClose }: { c: Ctx; onClose: () => void }) {
  const { gs, me } = c;
  const e = gs.empires[me];
  const civ = civById(e.civId);
  const p = production(gs, e);
  const tips = advice(gs, e);
  const camps = buildingsOf(gs, me, 'camp');
  const log = Object.entries(e.prestigeLog).filter(([, v]) => Math.abs(v) >= 0.5).sort((a, b) => b[1] - a[1]);
  return (
    <Sheet title={`${civ.emoji} ${e.name}`} icon="" onClose={onClose}>
      <Card>
        <b className="text-amber-200">{civ.ability}</b>
        <p className="mt-0.5">{civ.abilityText}</p>
        <p className="mt-1 text-xs text-slate-400">Land rich in {civ.rich.map(r => r === 'gold' ? '🪙 gold' : `${RES_INFO[r].emoji} ${RES_INFO[r].name.toLowerCase()}`).join(' and ')}; short of {civ.poor.map(r => r === 'gold' ? 'gold' : `${RES_INFO[r].emoji} ${RES_INFO[r].name.toLowerCase()}`).join(' and ')}. {civ.history}</p>
      </Card>
      <Card>
        <b>🧑‍🏫 Advisor</b>
        <ul className="mt-1 space-y-1.5">{tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </Card>
      <Card>
        <b>Every round</b>
        <div className="grid grid-cols-3 gap-2 mt-2 text-center">
          {RESOURCES.map(r => <div key={r}><div>{RES_INFO[r].emoji}</div><b>+{p[r]}</b></div>)}
          <div><div>🪙</div><b>+{p.gold}</b></div>
        </div>
        <p className="mt-2">Your people eat <b>{foodUpkeep(gs, e)} 🌾</b> a round (capital 2, each outpost 1, each soldier 1).</p>
        <p>Storage: <b>{Math.floor(stored(e))}/{capacity(gs, e)}</b> · Camps: <b>{camps.length}</b> · Soldiers: <b>{troopsOf(gs, me)}</b> · Land: <b>{ownedTiles(gs, me).length} hexes</b></p>
      </Card>
      <Card>
        <b>👑 Prestige: {Math.round(e.prestige)}</b> <span className="text-slate-400">(first to {gs.target ?? PRESTIGE_TARGET} wins, or the most after round {gs.maxRounds})</span>
        <div className="mt-1 grid grid-cols-2 gap-x-3 text-xs">{log.map(([k, v]) => <div key={k} className="flex justify-between"><span className="capitalize">{k}</span><b>{v > 0 ? '+' : ''}{Math.round(v)}</b></div>)}</div>
      </Card>
      <Card>
        <b>Rivals</b>
        <div className="mt-1 space-y-1.5">
          {ranking(gs).map((x, i) => (
            <div key={x.index} className="text-xs">
              <div className="flex justify-between"><span><b>{i + 1}.</b> <span style={{ color: x.color }}>■</span> {x.name}{x.index === me ? ' (you)' : x.human ? ' (player)' : ' (computer)'}</span><b>{Math.round(x.prestige)} 👑</b></div>
              {x.index !== me && hasIntel(gs, e, x.index) && <div className="text-slate-400">🕵️ {Math.floor(x.gold)} 🪙 · {RESOURCES.map(r => `${RES_INFO[r].emoji}${Math.floor(x.stock[r])}`).join(' ')}</div>}
            </div>
          ))}
        </div>
      </Card>
    </Sheet>
  );
}

export function LogDrawer({ c, onClose }: { c: Ctx; onClose: () => void }) {
  const { gs } = c;
  const items = gs.chronicle.slice().reverse().slice(0, 80);
  return (
    <Sheet title="Chronicle" icon="📜" onClose={onClose}>
      {items.map((x, i) => (
        <div key={i} className="text-xs border-b border-line pb-1.5">
          <span className="text-slate-500">Round {x.round} · </span>
          <span style={{ color: x.empire !== undefined ? gs.empires[x.empire]?.color : undefined }}>{x.kind === 'raid' ? '⚔️ ' : x.kind === 'mutiny' ? '😠 ' : x.kind === 'ai' ? '🤖 ' : ''}</span>
          {x.text}
        </div>
      ))}
    </Sheet>
  );
}

export function HelpBody({ era }: { era: 1 | 2 }) {
  return (
    <div className="space-y-2.5 text-sm leading-relaxed">
      <p><b>Goal:</b> earn the most <b>prestige 👑</b>. The first empire to {PRESTIGE_TARGET} wins; otherwise the leader after the last round wins.</p>
      <p><b>Your land</b> is the colored hexes around your capital 🏛️. Tap a hex with a resource next to your land and build a <b>camp</b> ({BUILD.camp.emoji}) to harvest it every round: 🌾 food, 🪵 wood, 🪨 stone, ⛓️ iron, 💎 {LUXURY_NAME[era].toLowerCase()}, or 🪙 gold.</p>
      <p><b>Every empire is rich in some things and short of others.</b> That’s why you trade: sell what you have too much of at the 🏛️ Market, and buy what you need. Prices go up when goods are scarce and down when everyone sells.</p>
      <p><b>Storage:</b> you can store 40 goods, plus 80 for each depot 🏚️. Extra goods sit outside: they spoil and raiders grab them first. Don’t hoard! Sell or build a depot.</p>
      <p><b>Food:</b> your people eat every round (more with outposts and soldiers). Running out costs prestige.</p>
      <p><b>Prestige comes from</b> building, selling goods, holding land, a 3-stage wonder and festivals at your capital, helping in crises 🆘, driving off raiders, and exploring lost sites 🏺 that waystones 🗿 point to.</p>
      <p><b>Barbarians</b> 🏕️ raid depots first. Train soldiers (⚔️) or hire a clan, but a hired clan must be paid every round or it revolts.</p>
      <p><b>The trader 🐫</b> wanders the map. When it’s next to your land or a scout, buy a map, news of a rival, or a rumor about the next crisis.</p>
      <p><b>Turns:</b> on your turn, do as much as you can afford, move each scout once, then tap <b>End turn</b>. When everyone has played, the round ends: camps produce, people eat, barbarians move, and prices change.</p>
    </div>
  );
}
export function HelpDrawer({ c, onClose }: { c: Ctx; onClose: () => void }) {
  return <Sheet title="How to play" icon="📖" onClose={onClose}><HelpBody era={c.gs.era} /></Sheet>;
}
