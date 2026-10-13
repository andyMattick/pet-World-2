import React from 'react';
import { Shield, Zap, ArrowUp, Radio, Crosshair, X, Award, Check, Wrench, Eye } from 'lucide-react';
import { UpgradesState } from '../types/game';

interface ArmoryModalProps {
  intelPoints: number;
  upgrades: UpgradesState;
  onUpgrade: (type: keyof UpgradesState, cost: number) => void;
  onClose: () => void;
}

interface UpgradeItem {
  id: keyof UpgradesState;
  title: string;
  description: string;
  currentValue: number;
  maxLimit: number;
  cost: number;
  icon: React.ReactNode;
}

export const ArmoryModal: React.FC<ArmoryModalProps> = ({
  intelPoints,
  upgrades,
  onUpgrade,
  onClose
}) => {
  const items: UpgradeItem[] = [
    {
      id: 'maxArmor',
      title: 'Kevlar Blast Shield',
      description: 'Absorbs fatal mine detonations. Provides an extra survival threshold.',
      currentValue: upgrades.maxArmor,
      maxLimit: 4,
      cost: 150 * upgrades.maxArmor,
      icon: <Shield className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'maxDefusalKits',
      title: 'Tactical Defusal Kits',
      description: 'Increases defusal kit capacity. Wrong defusals spawn a new mine; 2-streak grants +1 kit.',
      currentValue: upgrades.maxDefusalKits ?? 3,
      maxLimit: 6,
      cost: 120 * (upgrades.maxDefusalKits ?? 3),
      icon: <Wrench className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'visionRange',
      title: 'NVG Tactical Floodlight',
      description: 'Expands your visible illumination radius through the Fog of War.',
      currentValue: Math.round(upgrades.visionRange ?? 3.5),
      maxLimit: 6,
      cost: 100 * Math.round(upgrades.visionRange ?? 3.5),
      icon: <Eye className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'maxEmp',
      title: 'EMP Pulse Capacitors',
      description: 'Increases initial EMP blast charges to clear 3x3 mine clusters.',
      currentValue: upgrades.maxEmp,
      maxLimit: 5,
      cost: 120 * upgrades.maxEmp,
      icon: <Zap className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'maxJumps',
      title: 'Pneumatic Rocket Thrusters',
      description: 'Provides additional 2-tile leap charges to vault over dangerous terrain.',
      currentValue: upgrades.maxJumps,
      maxLimit: 6,
      cost: 100 * upgrades.maxJumps,
      icon: <ArrowUp className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'maxSonar',
      title: 'High-Res Ground Radar',
      description: 'Increases available sonar radar pings to detect concealed mines.',
      currentValue: upgrades.maxSonar,
      maxLimit: 5,
      cost: 110 * upgrades.maxSonar,
      icon: <Radio className="w-5 h-5 text-violet-400" />
    },
    {
      id: 'maxDrones',
      title: 'Defusal Drone Bay',
      description: 'Carries more micro-drones for precision remote mine disarmament.',
      currentValue: upgrades.maxDrones,
      maxLimit: 5,
      cost: 130 * upgrades.maxDrones,
      icon: <Crosshair className="w-5 h-5 text-rose-400" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div>
            <h2 className="text-lg font-bold font-mono tracking-tight text-amber-400">
              FIELD ARMORY & WORKSHOP
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Requisition upgraded tactical hardware for Specialist Miller.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 font-bold">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>{intelPoints} INTEL XP</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upgrade Items List */}
        <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
          {items.map((item) => {
            const isMaxed = item.currentValue >= item.maxLimit;
            const canAfford = intelPoints >= item.cost && !isMaxed;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800/90 rounded-xl gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-200">{item.title}</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        (Level {item.currentValue})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  {isMaxed ? (
                    <div className="flex items-center gap-1 text-xs font-mono text-slate-500 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>MAX</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onUpgrade(item.id, item.cost)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                        canAfford
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs'
                          : 'bg-slate-850 text-slate-600 border border-slate-800 cursor-not-allowed'
                      }`}
                    >
                      <span>Upgrade</span>
                      <span className="opacity-80">({item.cost} XP)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-5 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Armory
          </button>
        </div>
      </div>
    </div>
  );
};
