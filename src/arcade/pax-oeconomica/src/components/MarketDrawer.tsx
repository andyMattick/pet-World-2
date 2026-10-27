/* The market: sell what you have too much of, buy what you need. Prices move with supply and demand. */
import { useState } from 'react';
import { RESOURCES } from '../types/game';
import { RES_INFO, SPREAD } from '../config/rules';
import { buy, exposed, quoteBuy, quoteSell, sell, sellPrice, sellPriceFor, buyPrice } from '../logic/marketEngine';
import { capacity, foodUpkeep, production, stored } from '../logic/economy';
import { Bar, Btn, Card, Ctx, Note, Sheet, Sparkline } from './ui';

export default function MarketDrawer({ c, onClose }: { c: Ctx; onClose: () => void }) {
  const { gs, me, act } = c;
  const e = gs.empires[me];
  const [qty, setQty] = useState(5);
  const p = production(gs, e);
  const cap = capacity(gs, e), have = stored(e), over = exposed(gs, e);
  return (
    <Sheet title="Market" icon="🏛️" onClose={onClose}>
      <Card>
        <div className="flex justify-between"><span>🪙 Gold: <b>{Math.floor(e.gold)}</b></span><span>📦 Stored {Math.floor(have)}/{cap}</span></div>
        <div className="mt-1.5"><Bar value={have} max={cap} danger={have > cap} /></div>
        {over > 0 && <p className="mt-1.5 text-rose-300 text-xs">{Math.round(over)} goods have no room. They spoil (10% a round) and raiders take them first.</p>}
      </Card>
      <div className="flex items-center gap-2">
        <span className="text-slate-400">Trade</span>
        {[1, 5, 10].map(n => <Btn key={n} small tone={qty === n ? 'gold' : 'plain'} onClick={() => setQty(n)}>{n}</Btn>)}
        <span className="text-slate-400">at a time</span>
      </div>
      {RESOURCES.map(r => {
        const info = RES_INFO[r];
        const sp = sellPrice(gs, r), ratio = sp / info.base;
        const trend = ratio >= 1.25 ? { t: 'High', c: 'text-emerald-300' } : ratio <= 0.8 ? { t: 'Low', c: 'text-rose-300' } : { t: 'Normal', c: 'text-slate-400' };
        const n = Math.min(qty, Math.floor(e.stock[r]));
        const sellFor = n > 0 ? quoteSell(gs, e, r, n) : 0;
        const buyFor = quoteBuy(gs, e, r, qty);
        const net = (p[r] || 0) - (r === 'food' ? foodUpkeep(gs, e) : 0);
        const crisis = gs.crisis?.resource === r;
        return (
          <Card key={r} className={crisis ? 'border-amber-400' : ''}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{info.emoji}</span>
              <div className="flex-1 min-w-0">
                <b>{info.name}</b> <span className="text-slate-400">you have {Math.floor(e.stock[r])}</span>
                <div className="text-xs text-slate-400">{net >= 0 ? '+' : ''}{net} a round{crisis ? ' · 🆘 crisis' : ''}</div>
              </div>
              <Sparkline data={gs.market.history[r]} color={info.color} />
              <div className="text-right text-xs w-20">
                <div>Sell <b className="text-amber-200">{sellPriceFor(gs, r, e).toFixed(1)}</b></div>
                <div>Buy <b>{buyPrice(gs, r, e).toFixed(1)}</b></div>
                <div className={trend.c}>{trend.t}</div>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Btn small tone="green" disabled={n <= 0} onClick={() => act(() => { const got = sell(gs, e, r, n); return got ? null : 'Nothing to sell.'; }, `Sold ${n} ${info.name.toLowerCase()} for ${sellFor} 🪙`, 'coin')}>Sell {n || qty} → {sellFor} 🪙</Btn>
              <Btn small tone="plain" disabled={buyFor > e.gold} onClick={() => act(() => (buy(gs, e, r, qty) ? null : 'Not enough gold.'), `Bought ${qty} ${info.name.toLowerCase()} for ${buyFor} 🪙`, 'coin')}>Buy {qty} ← {buyFor} 🪙</Btn>
            </div>
          </Card>
        );
      })}
      <Note>
        Prices follow supply and demand. Selling a lot of one good at once floods the market and the price drops for a couple of rounds,
        so sell a little at a time. Buying costs about {Math.round((SPREAD - 1) * 100)}% more than selling: that’s the merchant’s cut,
        so only buy what you really need. Every 25 🪙 of goods you sell also earns 1 prestige.
      </Note>
    </Sheet>
  );
}
