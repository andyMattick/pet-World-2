import React, { useState } from 'react';
import { HelpCircle, X, Sparkles, Swords, Brain, Trophy } from 'lucide-react';
import { sounds } from '../utils/audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'BATTLESHIP' | 'BINGO_WAR' | 'BINGO' | 'WAR' | 'MEMORY';
}

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'BINGO_WAR',
}) => {
  const [tab, setTab] = useState<'BATTLESHIP' | 'BINGO_WAR' | 'BINGO' | 'WAR' | 'MEMORY'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-display text-xl font-bold">Arcade Rulebook</h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl my-4 overflow-x-auto">
          <button
            onClick={() => {
              sounds.playClick();
              setTab('BATTLESHIP');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              tab === 'BATTLESHIP'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⚓</span>
            Battleship
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setTab('BINGO_WAR');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              tab === 'BINGO_WAR'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4" />
            Bingo War
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setTab('BINGO');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              tab === 'BINGO'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Bingo Duel
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setTab('WAR');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              tab === 'WAR'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4" />
            Casino War
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setTab('MEMORY');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              tab === 'MEMORY'
                ? 'bg-purple-500 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" />
            Memory
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto space-y-4 text-sm text-slate-300 pr-1 leading-relaxed">
          {tab === 'BATTLESHIP' && (
            <div className="space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                <h4 className="font-semibold text-cyan-300 mb-1">Armada Ops: Battleship Tactics</h4>
                <p className="text-xs text-slate-300">
                  Command your 5-vessel naval strike group against Admiral Vane with classic radar targeting, bonus salvo reloads, and tactical special operations!
                </p>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-1.5">How To Play Battleship:</h5>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                  <li><strong>Fleet Deployment:</strong> Position your 5 capital warships (Carrier 5, Battleship 4, Cruiser 3, Submarine 3, Destroyer 2) on your 10×10 defensive grid. Click to place and rotate, or hit &ldquo;Auto-Deploy&rdquo; for instant strategic layout.</li>
                  <li><strong>Strike Radar:</strong> Fire at coordinate cells in the enemy waters fog of war. Red flames mark direct hits, water splashes mark misses, and skulls mark sunken vessels.</li>
                  <li><strong>The Salvo Twist:</strong> Scoring a direct hit immediately triggers a <strong>Bonus Salvo Shot</strong>, granting you another shot without passing your turn!</li>
                  <li><strong>Tactical Special Ops (The Superweapon Twist):</strong> Earn Command Energy (+10 per round, +25 per hit, +45 per sunken ship) to unleash high-tech naval operations:
                    <ul className="list-circle pl-5 mt-1 space-y-1">
                      <li>📡 <strong>Sonar Pulse (35 Energy):</strong> Sweeps a 3×3 sector to reveal the exact count of hidden enemy vessel hulls.</li>
                      <li>🛩️ <strong>Air Salvo Carpet Bomb (65 Energy):</strong> Strikes a 3-tile cluster in a single high-explosive bombing run.</li>
                      <li>⚡ <strong>Railgun Line (80 Energy):</strong> Fires a hypervelocity piercing kinetic shell across 3 consecutive tiles!</li>
                      <li>🛡️ <strong>Smoke Screen (40 Energy):</strong> Covers a 2×2 sector of your fleet with thermal smoke, deflecting enemy strikes for 3 turns.</li>
                    </ul>
                  </li>
                  <li><strong>Victory:</strong> Sink all 5 enemy warships before Admiral Vane destroys your task force!</li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'BINGO_WAR' && (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <h4 className="font-semibold text-amber-300 mb-1">Bingo War: Custom Pattern Card Clashes</h4>
                <p className="text-xs text-slate-300">
                  Paint your own custom winning pattern on the grid, lock it in, and clash playing cards against Commander Vane to conquer the hopper!
                </p>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-1.5">How To Play Bingo War:</h5>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                  <li><strong>Highlight Your Winning Pattern:</strong> During the Architect Phase, click any squares on your 5×5 card to paint your own target battle pattern (minimum 3 squares). Or pick from presets like Dragon Blade, Shield, Lightning, Crossfire, or roll a random pattern.</li>
                  <li><strong>Lock In Your Formation:</strong> Once locked in, your winning squares are lightly highlighted in gold with target badges. No modifications are permitted during battle until a new match starts.</li>
                  <li><strong>Card Clashes &amp; 3 Reward Cards:</strong> In each clash, 3 mystery cards are dealt. The winner of the card duel gets to choose 1 of the 3 cards, and then immediately receives <strong>3 called numbers</strong> from the hopper!</li>
                  <li><strong>Tie Ball Veto War:</strong> If duel cards tie in rank, 3 candidate bingo balls enter the hot seat! Both commanders get to <strong>cross off (veto) 1 ball</strong>, and the remaining ball is called out of whatever is left!</li>
                  <li><strong>Conquest Victory:</strong> First player to conquer all of their highlighted target squares wins the match. Rematching rolls a different random pattern or lets you paint a new one!</li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'BINGO' && (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <h4 className="font-semibold text-amber-300 mb-1">Classic Bingo Duel vs AI</h4>
                <p className="text-xs text-slate-300">
                  Race against BingoBot 3000 in authentic 75-ball bingo! An RNG hopper draws balls while you and the computer mark your cards in real time.
                </p>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-1.5">Game Rules &amp; Ball Caller:</h5>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                  <li><strong>The Ball Caller:</strong> Balls 1 to 75 are randomly drawn from the hopper with letter columns: B (1-15), I (16-30), N (31-45), G (46-60), and O (61-75).</li>
                  <li><strong>Manual or Auto-Calling:</strong> Draw balls one-by-one with &ldquo;Call Ball&rdquo; or turn on &ldquo;Auto Call&rdquo; with adjustable speed.</li>
                  <li><strong>Daubing:</strong> Daub squares on your card as numbers are called, or switch on &ldquo;Auto-Daub&rdquo;.</li>
                  <li><strong>Claiming Bingo:</strong> The moment you complete the winning pattern, smash the flashing <strong>&ldquo;CLAIM BINGO&rdquo;</strong> button before the computer does!</li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-1.5">Selectable Bingo Patterns:</h5>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                  <li><strong>Standard Line:</strong> Any single horizontal, vertical, or diagonal line.</li>
                  <li><strong>Four Corners:</strong> All 4 outer corner cells.</li>
                  <li><strong>Postage Stamp:</strong> A 2×2 square cluster in any of the corners.</li>
                  <li><strong>Letter X:</strong> Both diagonal lines crossing through the center.</li>
                  <li><strong>Plus Sign (+):</strong> The middle row and middle column crossing over the free space.</li>
                  <li><strong>Picture Frame:</strong> All 16 outer perimeter edge squares.</li>
                  <li><strong>Blackout / Coverall:</strong> All 25 squares on the entire card.</li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'WAR' && (
            <div className="space-y-4">
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                <h4 className="font-semibold text-rose-300 mb-1">Classic High-Stakes Card Duel</h4>
                <p className="text-xs text-slate-300">
                  Face off against the croupier. Highest rank wins (Ace is highest). If cards match rank, prepare for War!
                </p>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-1.5">Round Breakdown:</h5>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                  <li><strong>Place Bets:</strong> Choose your chip wager ($10 to $500), plus an optional Tie Bet (pays 10:1!).</li>
                  <li><strong>Deal:</strong> Player and Dealer reveal one card each. High card wins 1:1 on your wager.</li>
                  <li><strong>TIE - DECLARE WAR:</strong> When both cards have the same rank:
                    <ul className="list-circle pl-5 mt-1 space-y-1">
                      <li><strong>Go to War:</strong> Match your original bet. The dealer burns 3 face-down cards and deals a deciding duel card. If you tie or beat the dealer, you win big!</li>
                      <li><strong>Surrender:</strong> Forfeit 50% of your initial bet and safely exit the hand.</li>
                    </ul>
                  </li>
                  <li><strong>Win Streaks:</strong> Build continuous winning runs to multiply score and amass a legendary bankroll.</li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'MEMORY' && (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h4 className="font-semibold text-blue-300 mb-1">Concentration &amp; Speed Matrix</h4>
                <p className="text-xs text-slate-300">
                  Train your cognitive recall with themed card decks, streak combos, and timer multipliers.
                </p>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-1.5">Key Mechanics:</h5>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                  <li><strong>Select Difficulty:</strong> Casual (12 cards), Standard (16 cards), Challenge (24 cards), Grand (36 cards), or Colossal (48 cards).</li>
                  <li><strong>Choose Visual Theme:</strong> Royal Casino, Mystic Arcana, or Retro 8-bit Arcade.</li>
                  <li><strong>Combo Multipliers:</strong> Finding consecutive pairs without a mismatch triggers &ldquo;x2 Duo&rdquo;, &ldquo;x3 Triad&rdquo;, and &ldquo;Fever Mode&rdquo; score boosts!</li>
                  <li><strong>Scoring:</strong> Evaluated on speed (seconds), move count, and accuracy percentage.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 mt-4 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Got It, Let&apos;s Play
          </button>
        </div>
      </div>
    </div>
  );
};
