import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Layers, 
  Footprints, 
  Dices, 
  Trophy, 
  Camera, 
  Zap, 
  Eye, 
  Radio, 
  Lock, 
  ShieldCheck, 
  Scissors,
  Sparkles,
  DoorOpen
} from 'lucide-react';

interface RulesWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesWalkthroughModal: React.FC<RulesWalkthroughModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'setup' | 'thief' | 'detectives' | 'win' | 'history'>('setup');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Clue: The Great Museum Caper — Official Rules & Guide
              </h2>
              <p className="text-xs text-slate-400">
                Milton Bradley 1991 Classic Stealth & Deduction Board Game
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/40 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('setup')}
            className={`py-3 px-4 border-b-2 font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'setup'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Game Setup
          </button>
          <button
            onClick={() => setActiveTab('thief')}
            className={`py-3 px-4 border-b-2 font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'thief'
                ? 'border-zinc-400 text-zinc-200'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. How Thief Plays
          </button>
          <button
            onClick={() => setActiveTab('detectives')}
            className={`py-3 px-4 border-b-2 font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'detectives'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. How Detectives Play
          </button>
          <button
            onClick={() => setActiveTab('win')}
            className={`py-3 px-4 border-b-2 font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'win'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Winning the Game
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 border-b-2 font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1991 Lore & History
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-slate-300">
          {activeTab === 'setup' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <Layers className="w-4 h-4" /> 1. Complete Museum Setup
              </h3>
              
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                    • The Board & Players
                  </h4>
                  <p>
                    Set up the museum board featuring gallery rooms (Red, Blue, Yellow, Green, Purple, Orange), interconnecting corridors, and the central Power Generator room (P). One player takes the role of the <strong>Thief</strong> (using the gray pawn and secret tracking pad), while the other players command the <strong>Detectives</strong> (using colored Clue pawns: Miss Scarlet, Colonel Mustard, Mr. Green).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                    • Locks & Exits
                  </h4>
                  <p>
                    Place perimeter locks face down outside the windows and doors. Some are locked tight, while others are unlocked. Neither side knows which are open until tested or investigated!
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                    • The 9 Paintings
                  </h4>
                  <p>
                    The 9 priceless paintings are mounted inside the gallery rooms (at least one per main room; none in corridors, the power room, or directly blocking doorways/windows).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                    • The 6 Security Cameras
                  </h4>
                  <p>
                    Detectives place 6 security cameras (numbered 1 through 6) on floor spaces and corridors where they can sweep multiple angles down long hallways.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                    • Starting Positions
                  </h4>
                  <p>
                    Detectives place their colored pawns in starting museum spaces. The thief secretly chooses an entry window or door and secretly records their starting coordinates on the hidden tracking sheet!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'thief' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Footprints className="w-4 h-4 text-zinc-400" /> 2. How the Thief Plays (Stealth & Art Heists)
              </h3>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-zinc-800 text-zinc-300 mt-1">
                    <Footprints className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Secret Movement
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      The thief stays hidden behind a shield and records their coordinates on a secret pad. The thief moves <strong>1 to 3 spaces per turn orthogonally</strong> (no diagonal moves).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-amber-950 text-amber-300 mt-1">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Stealing Art & Educational Authentication Quiz
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      To steal an art piece (paintings, sculptures, artifacts, tapestries):<br />
                      1. Move onto its space and wait one full turn cutting/bypassing casing.<br />
                      2. On the next turn, answer the <strong>Creator Authentication Test</strong>:<br />
                      • <strong>1st Piece:</strong> 2 options.<br />
                      • <strong>Consecutive Pieces:</strong> Starts with 3 options and adds +1 option for each subsequent piece (3, 4, 5...)!<br />
                      • <strong>Preservation Danger:</strong> If reduced down to 2 options and you guess wrong, the display incinerates and the piece is <strong>PERMANENTLY DESTROYED</strong>! Boris must retreat to another piece.<br />
                      • <strong>Bonus Gadget Challenge:</strong> If you identify the creator correctly, guess <strong>Where the piece is housed in real life</strong> to earn a free Bonus Gadget (Sleep Dart, Smoke Bomb, Adrenaline, or Lockpick)!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-emerald-950 text-emerald-300 mt-1">
                    <DoorOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Perimeter Infiltration Choice
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      The thief is free to choose <strong>any perimeter door or window</strong> to infiltrate the museum at the start of the heist!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-red-950 text-red-300 mt-1">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Disabling Cameras & Power
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      • Landing on a security camera space allows cutting its wires (permanently crossing it off).<br />
                      • Landing on the <strong>Power Source (P symbol)</strong> temporarily shuts down the entire electrical grid (all cameras and motion detectors offline for 3 turns)!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-blue-950 text-blue-300 mt-1">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Getting Spotted
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      The thief remains invisible until a detective's action or line-of-sight spots them. Once spotted, the gray pawn appears on the physical board! The thief must then dash for an unlocked exit before getting tackled!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'detectives' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <Dices className="w-4 h-4" /> 3. How the Detectives Play (The Hunt)
              </h3>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                    • Turn Order
                  </h4>
                  <p>
                    Play alternates strictly: <strong>Thief → Detective 1 → Thief → Detective 2 → Thief → Detective 3</strong>. This keeps the chase rapid and thrilling!
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                    • Rolling the Two Dice
                  </h4>
                  <p>
                    On a detective's turn, they roll two dice:
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="font-bold text-amber-400 text-xs mb-1">1. Movement Die (1–6)</div>
                      <p className="text-xs text-slate-400">
                        Move up to that many spaces orthogonally. Note: Detectives <em>cannot</em> land on intact paintings!
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="font-bold text-cyan-400 text-xs mb-1">2. Special Action Die</div>
                      <p className="text-xs text-slate-400">
                        Gather electronic intelligence across 3 specialized actions:
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs">
                    <Eye className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Eyes (Line of Sight):</strong> Check if the thief is visible down any unblocked hallway or room from any detective!</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Camera className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Camera Scan:</strong> Pick a specific camera (1 to 6) to see if it currently spots the thief or if its wire has been cut.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Motion Detector:</strong> Query the security sensors to discover which colored gallery room or zone the thief is occupying!</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Lock className="w-4 h-4 text-red-400 shrink-0" />
                    <span><strong>Exit Lockdown:</strong> When standing next to an exit window or door, a detective can permanently padlock and chain it shut, preventing the thief from escaping through it for the rest of the game!</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Footprints className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>UV Blacklight Scanner:</strong> Turn on forensic UV lighting to illuminate Boris's recent footstep trails across gallery floors!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'win' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                <Trophy className="w-4 h-4" /> 4. Winning Conditions & Scoring
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-950/40 border border-emerald-500/50 p-4 rounded-xl">
                  <h4 className="font-bold text-emerald-300 text-sm mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Thief Wins If:
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-300">
                    <li>• The thief steals at least <strong>3 paintings</strong> from the museum walls.</li>
                    <li>• Successfully reaches an <strong>unlocked perimeter window or door</strong> to make their getaway!</li>
                  </ul>
                </div>

                <div className="bg-blue-950/40 border border-blue-500/50 p-4 rounded-xl">
                  <h4 className="font-bold text-blue-300 text-sm mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Detectives Win If:
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-300">
                    <li>• A detective lands on the thief's space or captures/corners the thief before they can reach an unlocked exit!</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-400">
                <strong className="text-white">Tournament Play:</strong> In official rules, multiple rounds are played so every player takes a turn as the stealthy thief. The player who successfully steals the most paintings wins the grand champion title!
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-purple-300">
                The Legacy of Clue: The Great Museum Caper (1991)
              </h3>
              <p className="text-xs text-slate-300">
                Released by Milton Bradley in 1991, <em>Clue: The Great Museum Caper</em> diverged from classic murder mystery Clue into an asymmetric cat-and-mouse stealth board game, similar to <em>Scotland Yard</em> and <em>Letters from Whitechapel</em>.
              </p>
              <p className="text-xs text-slate-300">
                It featured an iconic 3D board with plastic wall segments, standing 3D paintings in miniature frames, rotating camera stands, and a plastic card scanner with red decoder windows. The thief player was named <strong>Boris "The Sneak"</strong>, and the detectives represented the classic Clue suspects now acting as museum guardians and investigators.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow-md transition-colors"
          >
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
