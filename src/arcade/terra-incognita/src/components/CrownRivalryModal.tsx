import React from 'react';
import { CrownNation, RivalNationState } from '../types';
import { NATIONS } from '../data/nations';
import { Crown, Trophy, Flag, ScrollText, Award, Compass, Ship } from 'lucide-react';

interface CrownRivalryModalProps {
  playerNation: CrownNation;
  rivalStates: Record<CrownNation, RivalNationState>;
  playerPrestige: number;
  playerDiscoveredCount: number;
  playerBotanicalCount: number;
  playerFleetCount: number;
}

export const CrownRivalryModal: React.FC<CrownRivalryModalProps> = ({
  playerNation,
  rivalStates,
  playerPrestige,
  playerDiscoveredCount,
  playerBotanicalCount,
  playerFleetCount
}) => {
  // Aggregate all 4 crowns for leaderboard comparison
  const nationsList: (RivalNationState & { isPlayer: boolean })[] = (
    Object.keys(NATIONS) as CrownNation[]
  ).map(nationKey => {
    if (nationKey === playerNation) {
      return {
        nation: playerNation,
        name: NATIONS[playerNation].name,
        prestige: playerPrestige,
        discoveredRegionsCount: playerDiscoveredCount,
        botanicalCount: playerBotanicalCount,
        activeFleets: playerFleetCount,
        lastAnnouncement: 'Publishing comprehensive world atlases and signing reciprocal treaties with sovereign nations.',
        isPlayer: true
      };
    } else {
      const state = rivalStates[nationKey];
      return {
        ...state,
        isPlayer: false
      };
    }
  }).sort((a, b) => b.prestige - a.prestige);

  return (
    <div className="flex flex-col h-full bg-[#181411] text-[#EFE7D8] p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#382E25]">
        <div>
          <h2 className="text-xl font-serif font-bold text-amber-200 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            The Race of the Four Crowns
          </h2>
          <p className="text-xs text-[#A89279] mt-0.5">
            The royal competition between England, France, Spain, and Portugal for geographical primacy, royal prestige, and trade wealth.
          </p>
        </div>

        <div className="text-xs font-tabular text-amber-300 bg-[#221A15] px-3 py-1.5 rounded border border-[#3E3023]">
          Global Leaderboard Standing: <strong>#{nationsList.findIndex(n => n.isPlayer) + 1} of 4</strong>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0 pt-4">
        {/* Left Column: Leaderboard Cards */}
        <div className="md:col-span-7 flex flex-col h-full bg-[#201A15] border border-[#423425] rounded-lg p-4 overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#A89279] mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            European Royal Standings
          </h3>

          <div className="space-y-3">
            {nationsList.map((entry, rank) => {
              const cfg = NATIONS[entry.nation];

              return (
                <div
                  key={entry.nation}
                  className={`p-4 rounded-lg border transition-all ${
                    entry.isPlayer
                      ? 'bg-[#33261C] border-amber-500 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-[#261E17] border-[#3E3023]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#181310] border border-[#4A3B2C] font-serif font-bold text-amber-300">
                        {rank + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-serif font-bold text-[#E5D7C3]">
                            {cfg.name}
                          </span>
                          {entry.isPlayer && (
                            <span className="px-1.5 py-0.2 text-[10px] bg-amber-700 text-white font-bold rounded">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#A89279] italic">
                          Ruler: {cfg.ruler} · Motto: <em>"{cfg.motto}"</em>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-tabular font-bold text-amber-300">
                        {entry.prestige.toLocaleString()} Prestige
                      </div>
                      <div className="text-[10px] text-[#A89279]">
                        Royal Prestige Score
                      </div>
                    </div>
                  </div>

                  {/* Quantitative Stats Row */}
                  <div className="mt-3 grid grid-cols-3 gap-2 pt-2 border-t border-[#382E25] text-xs font-tabular text-[#BFA890]">
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-amber-400" />
                      <span>{entry.discoveredRegionsCount} Regions Mapped</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{entry.botanicalCount} Species Cataloged</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Ship className="w-3.5 h-3.5 text-blue-400" />
                      <span>{entry.activeFleets} Fleets Deployed</span>
                    </div>
                  </div>

                  {/* Latest Royal Announcement */}
                  <div className="mt-2.5 text-[11px] text-[#CBB59C] bg-[#1A1410] p-2 rounded border border-[#30251B]">
                    <strong className="text-amber-200">Dispatch:</strong> {entry.lastAnnouncement}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Global Milestones & Royal Rivalry Chronicle */}
        <div className="md:col-span-5 flex flex-col h-full bg-[#201A15] border border-[#423425] rounded-lg p-5 overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-2">
            <ScrollText className="w-4 h-4" />
            Crown Chronicle & Charter Milestones
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-[#261E17] border border-[#3E3023]">
              <div className="flex items-center justify-between text-amber-200 font-bold font-serif mb-1">
                <span>The Transatlantic Crossing</span>
                <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Achieved</span>
              </div>
              <p className="text-[11px] text-[#A89279]">
                Your charter's first Atlantic crossing.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#261E17] border border-[#3E3023]">
              <div className="flex items-center justify-between text-amber-200 font-bold font-serif mb-1">
                <span>The Search for a River Passage West</span>
                <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">In Progress</span>
              </div>
              <p className="text-[11px] text-[#A89279]">
                Explore the St. Lawrence and Mississippi for the water route to the Pacific that 1604 mapmakers hoped for (none exists).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#261E17] border border-[#3E3023]">
              <div className="flex items-center justify-between text-amber-200 font-bold font-serif mb-1">
                <span>Rounding the Cape of Storms</span>
                <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">Race Open</span>
              </div>
              <p className="text-[11px] text-[#A89279]">
                Round southern Africa and reach the Malabar pepper trade.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#261E17] border border-[#3E3023]">
              <div className="flex items-center justify-between text-amber-200 font-bold font-serif mb-1">
                <span>The Great Botanical Encyclopedia (15 Species)</span>
                <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">Race Open</span>
              </div>
              <p className="text-[11px] text-[#A89279]">
                Submit fifteen illustrated specimens to royal patrons and universities for lasting honor.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#261E17] border border-[#3E3023]">
              <div className="flex items-center justify-between text-amber-200 font-bold font-serif mb-1">
                <span>Grand League of Peace (3 Treaties)</span>
                <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">Race Open</span>
              </div>
              <p className="text-[11px] text-[#A89279]">
                Ratify peaceful Amity Charters with three sovereign indigenous confederacies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
