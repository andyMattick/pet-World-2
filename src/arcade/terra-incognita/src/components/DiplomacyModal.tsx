import React, { useState } from 'react';
import { IndigenousCulture, CrownNation } from '../types';
import { SoundEngine } from '../utils/audio';
import { NATIONS } from '../data/nations';
import { Handshake, Gift, ShieldCheck, MapPin, Sparkles, Compass, CheckCircle2 } from 'lucide-react';

interface DiplomacyModalProps {
  cultures: Record<string, IndigenousCulture>;
  playerNation: CrownNation;
  ducats: number;
  onOfferGift: (cultureId: string, giftCost: number, harmonyGain: number) => void;
  onTradeResource: (cultureId: string, resourceKey: string, amount: number, costDucats: number) => void;
  onHireGuide: (cultureId: string, fee: number) => void;
  onSignPeaceCharter: (cultureId: string) => void;
  metCultureIds: string[];   // peoples whose land one of her ships has reached
  regionNameByCulture: Record<string, string>;
  initialCultureId?: string;
}

export const DiplomacyModal: React.FC<DiplomacyModalProps> = ({
  cultures,
  playerNation,
  ducats,
  onOfferGift,
  onTradeResource,
  onHireGuide,
  onSignPeaceCharter,
  metCultureIds,
  regionNameByCulture,
  initialCultureId
}) => {
  const cultureList = Object.values(cultures);
  const [selectedCultureId, setSelectedCultureId] = useState<string>(initialCultureId || cultureList[0]?.id || '');

  const nation = NATIONS[playerNation];
  const activeCulture = cultures[selectedCultureId];
  const met = !!activeCulture && metCultureIds.includes(activeCulture.id);

  const getRelationshipBadge = (rel: string) => {
    switch (rel) {
      case 'HONORED_ALLY':
        return <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-600 text-xs">Honored Sovereign Ally</span>;
      case 'AMICABLE':
        return <span className="text-blue-300 font-bold bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-600 text-xs">Amicable Relations</span>;
      case 'CURIOUS':
        return <span className="text-amber-300 font-medium bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-600 text-xs">Curious & Receptive</span>;
      default:
        return <span className="text-stone-400 font-medium bg-stone-900/80 px-2.5 py-0.5 rounded border border-stone-700 text-xs">Cautious & Wary</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#181411] text-[#EFE7D8] p-3 sm:p-6 overflow-y-auto md:overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#382E25]">
        <div>
          <h2 className="text-xl font-serif font-bold text-amber-200 flex items-center gap-2">
            <Handshake className="w-5 h-5 text-amber-400" />
            The Sovereign Grand Council & Diplomatic Treaties
          </h2>
          <p className="text-xs text-[#A89279] mt-0.5">
            Engage in respectful, reciprocal diplomacy with indigenous nations. Exchange knowledge, gifts, and trade without conquest.
          </p>
        </div>

        <div className="text-xs font-tabular text-[#CBB59C] bg-[#221A15] px-3 py-1.5 rounded border border-[#3E3023]">
          Royal Treasury: <strong className="text-amber-300">{ducats.toLocaleString()} D</strong>
        </div>
      </div>

      {/* Main split view */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0 pt-4">
        {/* Left Column: Indigenous Nations Registry */}
        <div className="md:col-span-4 flex flex-col max-h-60 md:max-h-none md:h-full bg-[#201A15] border border-[#423425] rounded-lg p-3 overflow-hidden">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#A89279] pb-2 border-b border-[#382E25]">
            Sovereign Nations ({cultureList.length})
          </h3>

          <div className="flex-1 overflow-y-auto space-y-2 pt-2 pr-1">
            {cultureList.map(culture => {
              const isSelected = culture.id === selectedCultureId;

              return (
                <div
                  key={culture.id}
                  onClick={() => {
                    SoundEngine.playCompassClick();
                    setSelectedCultureId(culture.id);
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#33261C] border-amber-500 shadow'
                      : 'bg-[#261E17] border-[#3E3023] hover:border-[#6B533C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-serif font-bold text-[#E5D7C3]">
                        {culture.name}
                      </div>
                      <div className="text-[11px] text-[#A89279] mt-0.5">
                        {culture.regionName}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-tabular font-bold text-amber-300">
                        {metCultureIds.includes(culture.id) ? `${culture.harmony}% Harmony` : 'Not met yet'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-stone-400">Leader: {culture.leader}</span>
                    {culture.peaceCharterSigned && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Treaty Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Diplomatic Chamber */}
        <div className="md:col-span-8 flex flex-col md:h-full bg-[#201A15] border border-[#423425] rounded-lg p-4 sm:p-6 md:overflow-y-auto map-paper text-[#261E17]">
          {activeCulture ? (
            <div className="space-y-5">
              {/* Culture Banner */}
              <div className="border-b border-[#78350F]/20 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    {activeCulture.regionName}
                  </span>
                  {getRelationshipBadge(activeCulture.relationship)}
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#2E1C0C]">
                  {activeCulture.name}
                </h3>
                <div className="text-xs font-sans text-[#5C4533] mt-1 flex items-center gap-4">
                  <span>Sovereign Voice: <strong>{activeCulture.leader}</strong></span>
                  <span>·</span>
                  <span>Favored Gift: <em>{activeCulture.desiredGift}</em></span>
                </div>
              </div>

              {/* Leader's Welcome Speech */}
              <div className="p-4 rounded-lg bg-[#E7D6BE] border border-[#967451]/30 shadow-inner">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                  Words from {activeCulture.leader}
                </h4>
                <p className="text-sm italic font-serif leading-relaxed text-[#382617]">
                  {activeCulture.welcomeQuote}
                </p>
                <div className="mt-2 text-xs text-[#5C4533] leading-relaxed">
                  {activeCulture.culturalLore}
                </div>
              </div>

              {/* Harmony Meter */}
              <div className="bg-[#DFCEB3] p-3.5 rounded-lg border border-[#A68866]/30">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#3B2918]">Diplomatic Mutual Harmony</span>
                  <span className="font-tabular font-bold text-amber-900">{activeCulture.harmony} / 100</span>
                </div>
                <div className="w-full bg-[#BFA88A] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-700 h-full rounded-full transition-all duration-500"
                    style={{ width: `${activeCulture.harmony}%` }}
                  />
                </div>
              </div>

              {!met && (
                <div className="p-3 rounded-lg bg-[#F3E3C4] border border-amber-700/40 text-xs text-[#3B2918]">
                  <strong>You haven’t met yet.</strong> Send a ship to {regionNameByCulture[activeCulture.id] || activeCulture.regionName}. When it drops anchor, you can offer gifts, trade and talk about a treaty.
                </div>
              )}

              {/* Diplomatic Interaction Actions */}
              <div className={`space-y-3 pt-1 ${met ? '' : 'opacity-50 pointer-events-none'}`} aria-disabled={!met}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#78350F]">
                  Diplomatic Protocols & Accords
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Action 1: Present Ceremonial Gifts */}
                  <div className="p-3.5 rounded-lg bg-[#EFE4D2] border border-[#B49574]/40 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#2E1C0C] flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-amber-700" />
                        Offer Ceremonial Gifts
                      </div>
                      <p className="text-[11px] text-[#5C4533] mt-1 leading-snug">
                        Gift {activeCulture.desiredGift} to deepen mutual goodwill and cultural respect.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (ducats >= 80) {
                          SoundEngine.playDiplomaticChime();
                          onOfferGift(activeCulture.id, 80, 15);
                        }
                      }}
                      disabled={!met || ducats < 80}
                      className="mt-3 w-full py-1.5 bg-[#78350F] hover:bg-[#92400E] disabled:opacity-50 text-amber-100 rounded text-xs font-semibold shadow transition-colors cursor-pointer"
                    >
                      Present Gift (80 D) · +15 Harmony
                    </button>
                  </div>

                  {/* Action 2: Hire Experienced Local Guide */}
                  <div className="p-3.5 rounded-lg bg-[#EFE4D2] border border-[#B49574]/40 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#2E1C0C] flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-emerald-800" />
                        Hire a Local Expedition Guide
                      </div>
                      <p className="text-[11px] text-[#5C4533] mt-1 leading-snug">
                        Local guides know safe channels and fresh foods that keep scurvy away, as the people of Stadacona taught Cartier's crew with cedar tea in 1536.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (ducats >= 120 && !activeCulture.hasGuideHired) {
                          SoundEngine.playDiplomaticChime();
                          onHireGuide(activeCulture.id, 120);
                        }
                      }}
                      disabled={!met || ducats < 120 || activeCulture.hasGuideHired}
                      className="mt-3 w-full py-1.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-emerald-100 rounded text-xs font-semibold shadow transition-colors cursor-pointer"
                    >
                      {activeCulture.hasGuideHired ? 'Guide In Service' : 'Contract Guide (120 D)'}
                    </button>
                  </div>
                </div>

                {/* Action 3: Sign Treaty & Amity Charter */}
                <div className="p-4 rounded-lg bg-[#E4D5BE] border border-[#A88863]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-[#2E1C0C] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-800" />
                      Sign Peace & Amity Charter
                    </div>
                    <p className="text-[11px] text-[#5C4533] mt-0.5 max-w-md">
                      Requires 65% Harmony. Establishes a permanent Treaty Post for safe harbor, ongoing trade routes, and shared astronomical cartography.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (activeCulture.harmony >= 65 && !activeCulture.peaceCharterSigned) {
                        SoundEngine.playFanfare();
                        onSignPeaceCharter(activeCulture.id);
                      }
                    }}
                    disabled={!met || activeCulture.harmony < 65 || activeCulture.peaceCharterSigned}
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-700 disabled:opacity-40 text-amber-100 rounded text-xs font-bold shadow-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {activeCulture.peaceCharterSigned ? 'Charter Ratified' : 'Ratify Charter'}
                  </button>
                </div>

                {/* Reciprocal Fair Trade Store */}
                <div className="pt-2">
                  <h5 className="text-xs font-bold text-[#2E1C0C] uppercase tracking-wider mb-2">
                    Reciprocal Fair Trade Commodities
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeCulture.tradeGoods.map((goods, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-[#EAE0CD] border border-[#B49574]/40 flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-bold text-[#3B2918] capitalize">
                            {goods.resource}
                          </div>
                          <div className="text-[11px] text-[#5C4533]">
                            Supply: {goods.amount} units
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (ducats >= goods.costInGifts) {
                              SoundEngine.playCoinClink();
                              onTradeResource(activeCulture.id, goods.resource, goods.amount, goods.costInGifts);
                            }
                          }}
                          disabled={!met || ducats < goods.costInGifts}
                          className="mt-2 w-full py-1 bg-[#573D26] hover:bg-[#785435] text-amber-100 rounded text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Trade ({goods.costInGifts} D)
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[#6B533C] text-sm">
              Select an indigenous nation from the registry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
