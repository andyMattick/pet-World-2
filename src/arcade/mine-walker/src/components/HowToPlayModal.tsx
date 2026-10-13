import React from 'react';
import { X, Footprints, Flag, Zap, ArrowUp, Radio, Crosshair, Shield, Bomb, Eye } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold font-mono tracking-tight text-amber-400">
              TACTICAL FIELD MANUAL
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Standard operating procedures for traversing active minefields.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-1 text-xs">
          {/* Section 1: Objective */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <h3 className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
              <Footprints className="w-4 h-4 text-emerald-400" />
              01. Primary Objective
            </h3>
            <p className="text-slate-400 leading-relaxed font-sans">
              You guide Specialist Miller across hostile territory from the bottom{' '}
              <span className="text-slate-200 font-medium">Deployment Trench</span> to the green{' '}
              <span className="text-emerald-400 font-medium">Extraction Zone (LZ Alpha)</span> at the top.
              Reach any tile on the extraction line to complete the sector.
            </p>
          </div>

          {/* Section 2: Deductions & Clues */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <h3 className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
              <Bomb className="w-4 h-4 text-red-400" />
              02. Classic Numerical Clues
            </h3>
            <p className="text-slate-400 leading-relaxed font-sans mb-2">
              Stepping on a safe tile reveals a number (1 to 8). This number tells you exactly how many
              of the 8 neighboring tiles contain live landmines.
            </p>
            <div className="grid grid-cols-4 gap-2 font-mono text-[11px] bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
              <div><span className="text-blue-400 font-bold">1</span> = 1 mine nearby</div>
              <div><span className="text-emerald-400 font-bold">2</span> = 2 mines nearby</div>
              <div><span className="text-rose-500 font-bold">3</span> = 3 mines nearby</div>
              <div><span className="text-purple-400 font-bold">4+</span> = heavy danger</div>
            </div>
          </div>

          {/* Section 3: Controls & Defusing */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <h3 className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
              <Flag className="w-4 h-4 text-emerald-400" />
              03. Arrow Key Controls & Bomb Defusal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 font-sans mt-2">
              <div className="flex items-start gap-2">
                <span className="font-mono text-amber-400 font-bold">Arrow Keys / WASD:</span>
                <span>Move 1 tile in that direction.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-amber-400 font-bold">Mouse Click:</span>
                <span>Click any adjacent tile to step there.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-emerald-400 font-bold">Right-Click / [F]:</span>
                <span>Plant a flag to <strong className="text-emerald-300">DEFUSE</strong> a bomb! Defused bombs immediately reduce surrounding numbers!</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-amber-400 font-bold">Spacebar:</span>
                <span>Chord sweep surrounding safe tiles when flags match the clue.</span>
              </div>
            </div>
          </div>

          {/* Section 4: Dynamic Environmental Hazards */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <h3 className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              04. Environmental Hazards & Endless Mode
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-400 font-sans mt-2">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <div className="font-bold text-amber-300 font-mono mb-0.5">Mud Patches:</div>
                <div>Thick sludge that costs 2 movement steps to cross. Navigate around or power through.</div>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <div className="font-bold text-cyan-300 font-mono mb-0.5">Electric Fences:</div>
                <div>Electrified barriers that damage your armor if walked into. Vault over with Rocket Jump or EMP!</div>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 sm:col-span-2">
                <div className="font-bold text-red-400 font-mono mb-0.5">Endless Mode (Rolling Barrage):</div>
                <div>The bottom of the screen rolls up continuously! Advance upwards to generate new terrain before the creeping barrage catches you.</div>
              </div>
            </div>
          </div>

          {/* Section 4: Special Abilities */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <h3 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              04. Tactical Abilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-400 font-sans">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 font-mono text-slate-200 font-bold mb-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>[1] EMP Blast</span>
                </div>
                <div>Emits a high-frequency pulse disarming all mines in a 3×3 radius.</div>
              </div>

              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 font-mono text-slate-200 font-bold mb-1">
                  <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>[2] Rocket Jump</span>
                </div>
                <div>Vault 2 tiles forward or diagonal to bypass suspected choke points.</div>
              </div>

              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 font-mono text-slate-200 font-bold mb-1">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>[3] Sonar Radar</span>
                </div>
                <div>Pings a 5×5 area, painting holographic hazard markers on hidden mines.</div>
              </div>

              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 font-mono text-slate-200 font-bold mb-1">
                  <Crosshair className="w-3.5 h-3.5 text-violet-400" />
                  <span>[4] Defusal Drone</span>
                </div>
                <div>Target any cell up to 4 tiles away to disarm it remotely.</div>
              </div>
            </div>
          </div>

          {/* Section 5: Blast Shield & Geiger */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <h3 className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              05. Armor & Geiger Audio
            </h3>
            <p className="text-slate-400 leading-relaxed font-sans">
              Your <span className="text-cyan-400 font-semibold">Blast Armor</span> absorbs fatal explosions. If you make a misstep, your armor detonates the mine safely, destroying 1 armor charge. Listen closely to the <span className="text-amber-400 font-semibold">Geiger counter</span> clicks in your headphones—they accelerate rapidly when dangerous mines are in proximity!
            </p>
          </div>

          {/* Section 6: Map Symbols & Recon Watchtowers */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <h3 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              06. Recon Watchtowers & Supply Boxes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 font-sans">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <div className="font-bold text-indigo-300 font-mono mb-0.5">🔭 Recon Watchtowers:</div>
                <div>Step on a Watchtower to secure the high ground! Instantly sweeps a wide sector ahead, clearing the fog of war and scanning hidden mines.</div>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <div className="font-bold text-amber-300 font-mono mb-0.5">📦 Supply Boxes:</div>
                <div>Collect to replenish gear: Armor Plate (+1 shield), EMP (+1 charge), Sonar Radar, or Intel Data (+75 XP & +1 defusal kit).</div>
              </div>
            </div>
          </div>

          {/* Section 7: Mission Accolades & Finish Rewards */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <h3 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Flag className="w-4 h-4 text-emerald-400" />
              07. Extraction Finish Rewards & Accolades
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 font-sans">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-mono font-bold text-amber-300">⚡ Lightning Scout:</span> Beat the sector par time (+100 XP).
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-mono font-bold text-rose-300">🎯 Sweeper Supreme:</span> Defuse 100% of all mines in the field (+150 XP).
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-mono font-bold text-emerald-300">🛡️ Ghost Walk:</span> Finish with 0 damage taken and armor intact (+125 XP).
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-mono font-bold text-cyan-300">🧠 Nerve of Steel:</span> Reach extraction without using any defusal flags (+100 XP).
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors"
          >
            Understood, Begin Mission
          </button>
        </div>
      </div>
    </div>
  );
};
