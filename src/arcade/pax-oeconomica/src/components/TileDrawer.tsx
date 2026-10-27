/* Tapping a hex: what is there, and what you can build or do on it. */
import type { BuildingType, HexTile } from '../types/game';
import { key } from '../types/game';
import { BUILD, CAPITAL_YIELD, FESTIVAL_COST, FESTIVAL_PRESTIGE, MAX_TROOPS, NODE_INFO, REPAIR_COST, SCOUT_COST, TROOP_COST, UPGRADE_PRESTIGE } from '../config/rules';
import {
  build, buildCost, buildWonder, buyScout, campYield, costText, holdFestival, repair, train, upgrade, upgradeCost, whyCantBuild,
  whyCantTrain, wonderInfo, canAfford,
} from '../logic/economy';
import { defenseAt } from '../logic/barbarianAI';
import { Btn, Card, Ctx, Note, Sheet } from './ui';

const BIOME_NAME: Record<string, string> = { plains: 'Plains', forest: 'Forest', hills: 'Hills', mountains: 'Mountains', desert: 'Desert', water: 'Sea', coast: 'Coast', waystone: 'Plains' };

export default function TileDrawer({ c, t, onClose, onMoveScout }: { c: Ctx; t: HexTile; onClose: () => void; onMoveScout: (id: number) => void }) {
  const { gs, me, act } = c;
  const e = gs.empires[me];
  const k = key(t.q, t.r);
  const seen = e.seen.has(k), vis = e.visible.has(k);
  if (!seen) return (
    <Sheet title="Unexplored land" icon="🌫️" onClose={onClose}>
      <Note>No one in your empire has been here. Send a scout (🧭), build an outpost nearby, or buy a map from the trader.</Note>
    </Sheet>
  );
  const owner = t.owner !== null ? gs.empires[t.owner] : null;
  const mine = t.owner === me;
  const b = t.building;
  const myScouts = e.scouts.filter(s => s.q === t.q && s.r === t.r);
  const clans = gs.barbarians.filter(x => x.q === t.q && x.r === t.r && vis);
  const title = b ? (b.type === 'capital' ? `${owner?.name} capital` : BUILD[b.type].name) : t.barbCamp ? 'Barbarian camp' : t.node ? `${BIOME_NAME[t.biome]} with ${NODE_INFO[t.node].emoji}` : BIOME_NAME[t.biome];
  const options: Exclude<BuildingType, 'capital'>[] = t.node ? ['camp', 'outpost'] : ['outpost', 'depot', 'barracks'];
  const y = b && mine ? campYield(gs, e, t) : null;
  const up = mine && b ? upgradeCost(t) : null;
  const w = wonderInfo(gs, e);

  return (
    <Sheet title={title} icon={b ? '' : t.barbCamp ? '🏕️' : undefined} onClose={onClose}>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-300">
        <span>{BIOME_NAME[t.biome]}</span>
        {t.node && <span>{NODE_INFO[t.node].emoji} {NODE_INFO[t.node].camp} site</span>}
        <span>{owner ? <>Land of <b style={{ color: owner.color }}>{owner.name}</b></> : 'No one’s land'}</span>
        {!vis && <span className="text-slate-500">(seen before, not watched now)</span>}
      </div>

      {b && (mine || vis) && (
        <Card>
          <div className="flex items-center justify-between">
            <b>{b.type === 'capital' ? '🏛️ Capital' : `${BUILD[b.type].emoji} ${BUILD[b.type].name}`}{b.type === 'camp' ? ` · level ${b.level}` : ''}</b>
            {b.maxHp > 0 && <span className={b.hp < b.maxHp ? 'text-rose-300' : 'text-slate-400'}>❤️ {b.hp}/{b.maxHp}</span>}
          </div>
          {y && <p className="mt-1">Makes <b>{y.n} {NODE_INFO[y.res].emoji}</b> every round.</p>}
          {b.type === 'capital' && mine && <p className="mt-1">Makes {CAPITAL_YIELD.food} 🌾 {CAPITAL_YIELD.wood} 🪵 {CAPITAL_YIELD.gold} 🪙 every round, and can always train soldiers.</p>}
          {b.type !== 'capital' && <Note>{BUILD[b.type].what}</Note>}
          {mine && <p className="mt-1">⚔️ Soldiers: <b>{t.troops}</b>/{MAX_TROOPS} · Defense if raided: <b>{defenseAt(gs, e, t).total.toFixed(0)}</b> <span className="text-slate-400">(soldiers + walls + hired clans)</span></p>}
          {mine && (
            <div className="flex flex-wrap gap-2 mt-2">
              {up && <Btn small disabled={!canAfford(e, up)} onClick={() => act(() => upgrade(gs, e, t), `Upgraded! (+${UPGRADE_PRESTIGE} prestige)`, 'build')}>⬆️ Upgrade ({costText(up)})</Btn>}
              <Btn small tone="plain" disabled={!!whyCantTrain(gs, e, t)} title={whyCantTrain(gs, e, t) || ''} onClick={() => act(() => train(gs, e, t), 'A soldier joins the guard.', 'click')}>⚔️ Train soldier ({costText(TROOP_COST)})</Btn>
              {b.hp < b.maxHp && <Btn small tone="plain" disabled={!canAfford(e, REPAIR_COST)} onClick={() => act(() => repair(gs, e, t), 'Repaired.', 'build')}>🔧 Repair ({costText(REPAIR_COST)})</Btn>}
            </div>
          )}
          {mine && whyCantTrain(gs, e, t) && t.troops < MAX_TROOPS && <Note>{whyCantTrain(gs, e, t)}</Note>}
          {mine && <Note>Each soldier eats 1 🌾 a round.</Note>}
        </Card>
      )}

      {b?.type === 'capital' && mine && (
        <Card>
          <b>👑 Prestige projects</b>
          {w ? (
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="flex-1">Wonder stage {w.stage}: <b>{w.name}</b> (+{w.prestige} prestige)<br /><span className="text-slate-400">{costText(w.cost)}</span></span>
              <Btn small disabled={!canAfford(e, w.cost)} onClick={() => act(() => buildWonder(gs, e), `${w.name} built! +${w.prestige} prestige`, 'build')}>Build</Btn>
            </div>
          ) : <p className="mt-1 text-emerald-300">Your wonder is complete!</p>}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="flex-1">Festival for your people (+{FESTIVAL_PRESTIGE} prestige, once a round)<br /><span className="text-slate-400">{costText(FESTIVAL_COST)}</span></span>
            <Btn small disabled={e.festivalRound === gs.round || !canAfford(e, FESTIVAL_COST)} onClick={() => act(() => holdFestival(gs, e), `Festival! +${FESTIVAL_PRESTIGE} prestige`, 'build')}>{e.festivalRound === gs.round ? 'Held' : 'Hold'}</Btn>
          </div>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="flex-1">Train a scout 🧭 ({e.scouts.length} now)<br /><span className="text-slate-400">{costText(SCOUT_COST)}</span></span>
            <Btn small tone="plain" onClick={() => act(() => buyScout(gs, e), 'A new scout is ready at your capital (it can move next round).', 'click')}>Train</Btn>
          </div>
          <Note>Missing something? Buy it at the market (🏛️ Market below).</Note>
        </Card>
      )}

      {!b && !t.barbCamp && t.biome !== 'water' && (!owner || mine) && (
        <Card>
          <b>Build here</b>
          <div className="mt-2 space-y-2">
            {options.map(type => {
              const why = whyCantBuild(gs, e, t, type);
              const cost = buildCost(e, type);
              return (
                <div key={type} className="flex items-center gap-2">
                  <span className="flex-1"><b>{BUILD[type].emoji} {type === 'camp' && t.node ? NODE_INFO[t.node].camp : BUILD[type].name}</b> <span className="text-slate-400">{costText(cost)}</span>
                    <br /><span className="text-xs text-slate-400">{why && !why.startsWith('You need') ? '🚫 ' + why : BUILD[type].what}</span></span>
                  <Btn small disabled={!!why} title={why || ''} onClick={() => act(() => build(gs, e, t, type), `${BUILD[type].name} built! (+${BUILD[type].prestige} prestige)`, 'build')}>Build</Btn>
                </div>
              );
            })}
          </div>
          {options.some(type => whyCantBuild(gs, e, t, type)?.startsWith('You need')) && <Note>Short of something? Sell goods you have extra of, then buy what you need at the market.</Note>}
        </Card>
      )}

      {t.barbCamp && <Card><b>🏕️ Barbarian camp</b><Note>A clan lives here. Open ⚔️ Clans to hire them, or to pay them to raid a rival. You can’t build on their camp.</Note></Card>}
      {clans.map(cl => <Card key={cl.id}><b>The {cl.name}</b> · strength {cl.strength} · {cl.status === 'mercenary' ? `working for ${gs.empires[cl.employer!].name}` : cl.status}</Card>)}
      {t.waystone && <Card><b>🗿 Waystone</b><Note>{e.hints.some(h => h.q === t.waystone!.target.q && h.r === t.waystone!.target.r) || gs.tiles.get(key(t.waystone.target.q, t.waystone.target.r))?.ruin?.claimedBy === me ? t.waystone.clue : 'Old carvings. Move a scout here to read them.'}</Note></Card>}
      {t.ruin && vis && <Card><b>🏺 {t.ruin.name}</b><Note>{t.ruin.claimedBy === null ? 'A lost site! Move a scout onto it to explore it.' : `${gs.empires[t.ruin.claimedBy].name} explored it. ${t.ruin.lore}`}</Note></Card>}
      {e.hints.some(h => h.q === t.q && h.r === t.r) && <Card><b>❓ A waystone pointed here</b><Note>{e.hints.find(h => h.q === t.q && h.r === t.r)!.text} Send a scout to look.</Note></Card>}
      {gs.trader.q === t.q && gs.trader.r === t.r && vis && <Card><b>🐫 The trader’s caravan</b><Note>Open 🐫 Trader below when the caravan is next to your land or one of your scouts.</Note></Card>}

      {myScouts.map(s => (
        <Card key={s.id}>
          <div className="flex items-center gap-2"><span className="flex-1"><b>🧭 Your scout</b><br /><span className="text-xs text-slate-400">{s.moved ? 'Already moved this round.' : 'Can move this round. Water blocks scouts.'}</span></span>
            <Btn small tone="green" disabled={s.moved} onClick={() => onMoveScout(s.id)}>Move</Btn></div>
        </Card>
      ))}
    </Sheet>
  );
}
