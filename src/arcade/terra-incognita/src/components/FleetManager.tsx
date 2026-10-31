import React, { useState } from 'react';
import { ExpeditionShip, VesselClass, Officer, ShipCargo, CrownNation } from '../types';
import { VESSEL_TYPES, CANDIDATE_OFFICERS, NATIONS } from '../data/nations';
import { SoundEngine } from '../utils/audio';
import { Ship, Anchor, AlertTriangle, Plus, UserPlus, Package, HeartPulse, Search, Sparkles } from 'lucide-react';

interface FleetManagerProps {
  playerNation: CrownNation;
  ships: ExpeditionShip[];
  ducats: number;
  timber: number;
  onCommissionShip: (vesselClass: VesselClass, name: string) => void;
  onHireOfficer: (shipId: string, officer: Officer) => void;
  onResupplyShip: (shipId: string, cargo: Partial<ShipCargo>, costDucats: number) => void;
  onLaunchSearchExpedition: (lostShipId: string) => void;
}

export const FleetManager: React.FC<FleetManagerProps> = ({
  playerNation,
  ships,
  ducats,
  timber,
  onCommissionShip,
  onHireOfficer,
  onResupplyShip,
  onLaunchSearchExpedition
}) => {
  const [selectedShipId, setSelectedShipId] = useState<string>(ships[0]?.id || '');
  const [showCommissionModal, setShowCommissionModal] = useState<boolean>(false);
  const [newShipClass, setNewShipClass] = useState<VesselClass>('CARAVEL');
  const [newShipName, setNewShipName] = useState<string>('');

  const nation = NATIONS[playerNation];
  const activeShip = ships.find(s => s.id === selectedShipId);

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typeInfo = VESSEL_TYPES[newShipClass];
    if (ducats < typeInfo.costDucats || timber < typeInfo.costTimber) return;

    const shipName = newShipName.trim() || `${typeInfo.name} ${ships.length + 1}`;
    SoundEngine.playShipBell();
    onCommissionShip(newShipClass, shipName);
    setNewShipName('');
    setShowCommissionModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#181411] text-[#EFE7D8] p-6 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#382E25]">
        <div>
          <h2 className="text-xl font-serif font-bold text-amber-200 flex items-center gap-2">
            <Anchor className="w-5 h-5 text-amber-400" />
            Admiralty & Royal Shipwright
          </h2>
          <p className="text-xs text-[#A89279] mt-0.5">
            Commission exploration vessels, outfit cargo, assign scholarly officers, and track voyage statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-tabular text-[#CBB59C] bg-[#221A15] px-3 py-1.5 rounded border border-[#3E3023]">
            Port Timber: <strong className="text-amber-200">{timber} units</strong> · Ducats: <strong className="text-amber-300">{ducats.toLocaleString()} D</strong>
          </div>
          <button
            onClick={() => {
              SoundEngine.playCompassClick();
              setShowCommissionModal(true);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Commission New Vessel
          </button>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0 pt-4">
        {/* Left Column: Ship List */}
        <div className="md:col-span-4 flex flex-col h-full bg-[#201A15] border border-[#423425] rounded-lg p-3 overflow-hidden">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#A89279] pb-2 border-b border-[#382E25]">
            Crown Fleet Registry ({ships.length})
          </h3>

          <div className="flex-1 overflow-y-auto space-y-2 pt-2 pr-1">
            {ships.map(ship => {
              const isSelected = ship.id === selectedShipId;
              const isOverdue = ship.status === 'OVERDUE';
              const isLost = ship.status === 'LOST';

              return (
                <div
                  key={ship.id}
                  onClick={() => {
                    SoundEngine.playCompassClick();
                    setSelectedShipId(ship.id);
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#33261C] border-amber-600/90 shadow'
                      : isOverdue
                        ? 'bg-red-950/40 border-red-800/80 animate-pulse'
                        : 'bg-[#261E17] border-[#3E3023] hover:border-[#6B533C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-full ${
                        isOverdue ? 'bg-red-900 text-red-200' : 'bg-[#181310] text-amber-400'
                      }`}>
                        <Ship className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-serif font-bold text-[#E5D7C3] flex items-center gap-1.5">
                          <span>{ship.name}</span>
                          {ship.celestialBonusActive && (
                            <span className="text-[10px] text-cyan-300 font-sans px-1 py-0.2 rounded bg-cyan-950 border border-cyan-800" title="Celestial Fix Active (+15% speed)">
                              ✦ +15%
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#A89279]">
                          {VESSEL_TYPES[ship.vesselClass]?.name || ship.vesselClass}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        isOverdue
                          ? 'bg-red-900/80 text-red-100 border border-red-500'
                          : isLost
                            ? 'bg-stone-800 text-stone-400'
                            : ship.status === 'SAILING'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {ship.status}
                      </span>
                    </div>
                  </div>

                  {/* Status Bar Indicators */}
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-tabular text-[#BFA890]">
                    <div>Hull Health: {ship.health}%</div>
                    <div>Morale: {ship.crewMorale}%</div>
                  </div>

                  {isOverdue && (
                    <div className="mt-2 text-[10px] text-red-300 bg-red-950/80 p-1.5 rounded border border-red-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>No word received: long overdue at last known coordinates!</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Ship Details & Outfitting */}
        <div className="md:col-span-8 flex flex-col h-full bg-[#201A15] border border-[#423425] rounded-lg p-6 overflow-y-auto">
          {activeShip ? (
            <div className="space-y-6">
              {/* Ship Banner */}
              <div className="flex items-start justify-between pb-4 border-b border-[#382E25]">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-amber-200">
                    {activeShip.name}
                  </h3>
                  <div className="text-xs text-[#A89279] mt-1 flex items-center gap-3">
                    <span>Class: <strong>{VESSEL_TYPES[activeShip.vesselClass]?.name}</strong></span>
                    <span>·</span>
                    <span>Speed: <strong>{activeShip.speedKnots} knots</strong></span>
                    <span>·</span>
                    <span>Days at Sea: <strong>{Math.round(activeShip.daysAtSea)} days</strong></span>
                  </div>
                  {activeShip.celestialBonusActive && (
                    <div className="mt-2 text-xs font-medium text-cyan-300 bg-cyan-950/70 border border-cyan-800/80 rounded px-2.5 py-1 inline-flex items-center gap-1.5 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Celestial Navigation Active: Sighted {activeShip.lastSightedStar || 'Polaris'} (+15% knots on long-haul sea lanes)</span>
                      {typeof activeShip.celestialBonusRemainingDays === 'number' && (
                        <span className="text-cyan-400 font-tabular font-normal">· {activeShip.celestialBonusRemainingDays.toFixed(0)} days remain</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Overdue Search Action */}
                {activeShip.status === 'OVERDUE' && (
                  <button
                    onClick={() => {
                      SoundEngine.playShipBell();
                      onLaunchSearchExpedition(activeShip.id);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-semibold shadow-lg animate-bounce transition-colors cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    Dispatch Relief & Search Expedition!
                  </button>
                )}
              </div>

              {/* Cargo Holds & Provisions */}
              <div className="bg-[#261E17] border border-[#3E3023] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Cargo Holds & Voyage Supplies
                  </h4>
                  <span className="text-xs font-tabular text-[#A89279]">
                    Capacity: {VESSEL_TYPES[activeShip.vesselClass]?.cargoCapacity} units
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-tabular">
                  <div className="p-2.5 rounded bg-[#1D1713] border border-[#382E25]">
                    <div className="text-[#A89279] text-[11px]">Provisions (Food/Water)</div>
                    <div className="text-sm font-bold text-[#E5D7C3]">{activeShip.cargo.provisions} rations</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#1D1713] border border-[#382E25]">
                    <div className="text-[#A89279] text-[11px]">Repair Timber</div>
                    <div className="text-sm font-bold text-[#E5D7C3]">{activeShip.cargo.timber} logs</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#1D1713] border border-[#382E25]">
                    <div className="text-[#A89279] text-[11px]">Rare Botanical Cargo</div>
                    <div className="text-sm font-bold text-emerald-400">{activeShip.cargo.rareFlora} crates</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#1D1713] border border-[#382E25]">
                    <div className="text-[#A89279] text-[11px]">Spices (Cloves/Mace)</div>
                    <div className="text-sm font-bold text-amber-400">{activeShip.cargo.spices} sacks</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#1D1713] border border-[#382E25]">
                    <div className="text-[#A89279] text-[11px]">Precious Metals</div>
                    <div className="text-sm font-bold text-yellow-300">{activeShip.cargo.preciousMetals} ingots</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#1D1713] border border-[#382E25]">
                    <div className="text-[#A89279] text-[11px]">Diplomatic Gifts</div>
                    <div className="text-sm font-bold text-purple-300">{activeShip.cargo.indigenousGifts} bundles</div>
                  </div>
                </div>

                {/* Resupply Action */}
                <div className="mt-4 pt-3 border-t border-[#382E25] flex items-center justify-between">
                  <span className="text-xs text-[#A89279]">
                    Restock provisions and repair timber from home stores (Cost: 60 Ducats)
                  </span>
                  <button
                    onClick={() => {
                      if (ducats >= 60) {
                        SoundEngine.playCoinClink();
                        onResupplyShip(activeShip.id, { provisions: 60, timber: 20 }, 60);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#382E25] hover:bg-[#4A3B2C] text-amber-200 rounded text-xs font-medium transition-colors cursor-pointer"
                  >
                    Restock Hold (60 D)
                  </button>
                </div>
              </div>

              {/* Assigned Expedition Officers */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Assigned Expedition Scholars & Officers
                </h4>

                {activeShip.officers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeShip.officers.map(off => (
                      <div key={off.id} className="p-3 rounded-lg bg-[#261E17] border border-[#3E3023]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-serif font-bold text-amber-200">{off.name}</span>
                          <span className="text-[10px] uppercase font-bold text-[#A89279]">{off.role}</span>
                        </div>
                        <div className="text-[11px] text-emerald-400 mt-0.5">Trait: {off.trait}</div>
                        <p className="text-[11px] italic text-[#CBB59C] mt-1">{off.quote}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#A89279] italic p-3 rounded bg-[#261E17] border border-[#382E25]">
                    No specialized officers aboard. Assign available scholars below to boost discoveries and navigation.
                  </div>
                )}

                {/* Available candidate officers to hire */}
                <div className="mt-4">
                  <h5 className="text-[11px] font-bold text-[#A89279] uppercase tracking-wider mb-2">
                    Available Guild Candidates in Port
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CANDIDATE_OFFICERS.filter(cand => !activeShip.officers.some(o => o.id === cand.id)).map(candidate => (
                      <div key={candidate.id} className="p-2.5 rounded bg-[#1D1713] border border-[#382E25] flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-[#E5D7C3]">{candidate.name} ({candidate.role})</div>
                          <div className="text-[10px] text-amber-400">{candidate.trait}</div>
                        </div>
                        <button
                          onClick={() => {
                            if (ducats >= candidate.hiredCost) {
                              SoundEngine.playCoinClink();
                              onHireOfficer(activeShip.id, candidate);
                            }
                          }}
                          className="px-2.5 py-1 bg-amber-700/80 hover:bg-amber-600 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Hire ({candidate.hiredCost} D)
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[#A89279] text-sm">
              Select a vessel to inspect status and manage cargo holds.
            </div>
          )}
        </div>
      </div>

      {/* Commission Ship Modal */}
      {showCommissionModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#201A15] border border-[#4A3B2C] rounded-xl max-w-lg w-full p-6 shadow-2xl text-[#EFE7D8]">
            <h3 className="text-lg font-serif font-bold text-amber-200 mb-1">
              Commission New Exploration Vessel
            </h3>
            <p className="text-xs text-[#A89279] mb-4">
              Select vessel specifications built from {nation.adjective} timber and shipwright craft.
            </p>

            <form onSubmit={handleCommissionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#CBB59C] mb-1">
                  Vessel Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Discovery, Don de Dieu, Santa María"
                  value={newShipName}
                  onChange={(e) => setNewShipName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#181310] border border-[#3E3023] text-sm text-[#EFE7D8] focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBB59C] mb-2">
                  Vessel Class
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(VESSEL_TYPES) as VesselClass[]).map(vClass => {
                    const info = VESSEL_TYPES[vClass];
                    const isSelected = newShipClass === vClass;
                    const canAfford = ducats >= info.costDucats && timber >= info.costTimber;

                    return (
                      <div
                        key={vClass}
                        onClick={() => setNewShipClass(vClass)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#33261C] border-amber-500 shadow'
                            : 'bg-[#181310] border-[#382E25] hover:border-[#4A3B2C]'
                        } ${!canAfford ? 'opacity-50' : ''}`}
                      >
                        <div className="text-xs font-serif font-bold text-amber-200">{info.name}</div>
                        <div className="text-[10px] text-[#A89279] mt-0.5 leading-snug">{info.description}</div>
                        <div className="mt-2 text-[10px] font-tabular text-amber-400">
                          {info.costDucats} D · {info.costTimber} Timber
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#382E25]">
                <button
                  type="button"
                  onClick={() => setShowCommissionModal(false)}
                  className="px-4 py-2 text-xs text-[#A89279] hover:text-[#EFE7D8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ducats < VESSEL_TYPES[newShipClass].costDucats || timber < VESSEL_TYPES[newShipClass].costTimber}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow transition-colors cursor-pointer"
                >
                  Commission Vessel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
