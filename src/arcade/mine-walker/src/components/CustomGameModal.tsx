import React, { useState } from 'react';
import { X, Sliders, Play } from 'lucide-react';
import { LevelConfig } from '../types/game';

interface CustomGameModalProps {
  onStartCustomGame: (config: LevelConfig) => void;
  onClose: () => void;
}

export const CustomGameModal: React.FC<CustomGameModalProps> = ({
  onStartCustomGame,
  onClose
}) => {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(14);
  const [density, setDensity] = useState(16); // 16%
  const [armor, setArmor] = useState(2);
  const [emp, setEmp] = useState(3);
  const [jumps, setJumps] = useState(3);
  const [sonar, setSonar] = useState(2);
  const [drones, setDrones] = useState(2);

  const totalCells = width * height;
  const mineCount = Math.round((totalCells * density) / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customConfig: LevelConfig = {
      id: 999,
      title: 'Custom Sandbox',
      codename: `Sector Simulation ${width}x${height}`,
      width,
      height,
      mineCount,
      initialArmor: armor,
      initialEmp: emp,
      initialJumps: jumps,
      initialSonar: sonar,
      initialDrones: drones,
      cratesCount: Math.max(1, Math.floor(height / 4)),
      description: `Custom configured minefield (${width} columns × ${height} rows, ${density}% mine density).`
    };
    onStartCustomGame(customConfig);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono tracking-tight text-amber-400">
                TACTICAL SANDBOX SIMULATOR
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Configure custom field dimensions and mine densities.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs font-mono">
          {/* Width */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1.5">
              <span>Field Width (Columns)</span>
              <span className="text-amber-400 font-bold tabular-nums">{width}</span>
            </div>
            <input
              type="range"
              min="6"
              max="16"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Height */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1.5">
              <span>Field Depth / Length (Rows)</span>
              <span className="text-amber-400 font-bold tabular-nums">{height}</span>
            </div>
            <input
              type="range"
              min="8"
              max="26"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Mine Density */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1.5">
              <span>Mine Density</span>
              <span className="text-rose-400 font-bold tabular-nums">{density}% ({mineCount} mines)</span>
            </div>
            <input
              type="range"
              min="8"
              max="26"
              value={density}
              onChange={(e) => setDensity(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Loadout customization */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Starting Armor</label>
              <select
                value={armor}
                onChange={(e) => setArmor(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
              >
                {[0, 1, 2, 3, 4].map((v) => (
                  <option key={v} value={v}>{v} Charges</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">EMP Charges</label>
              <select
                value={emp}
                onChange={(e) => setEmp(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
              >
                {[0, 1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>{v} EMPs</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Rocket Jumps</label>
              <select
                value={jumps}
                onChange={(e) => setJumps(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
              >
                {[0, 1, 2, 3, 4, 6].map((v) => (
                  <option key={v} value={v}>{v} Jumps</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Sonar Pings</label>
              <select
                value={sonar}
                onChange={(e) => setSonar(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
              >
                {[0, 1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>{v} Pings</option>
                ))}
              </select>
            </div>
          </div>

          {/* Launch Button */}
          <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-400/20"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Deploy Simulator</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
