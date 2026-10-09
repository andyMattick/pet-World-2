import React, { useState, useCallback } from 'react';
import { StandardCard, CardSuit, CardRank, WarRoundState, WarStats } from '../../types';
import { PlayingCard } from '../../components/PlayingCard';
import { sounds } from '../../utils/audio';
import { Swords, RotateCcw, ShieldAlert, Award, Zap, DollarSign } from 'lucide-react';

interface CasinoWarModeProps {
  onCompleteGame: (score: number, stats: WarStats) => void;
}

const SUITS: CardSuit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: { rank: CardRank; value: number }[] = [
  { rank: '2', value: 2 },
  { rank: '3', value: 3 },
  { rank: '4', value: 4 },
  { rank: '5', value: 5 },
  { rank: '6', value: 6 },
  { rank: '7', value: 7 },
  { rank: '8', value: 8 },
  { rank: '9', value: 9 },
  { rank: '10', value: 10 },
  { rank: 'J', value: 11 },
  { rank: 'Q', value: 12 },
  { rank: 'K', value: 13 },
  { rank: 'A', value: 14 },
];

function drawCard(): StandardCard {
  const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
  const rankItem = RANKS[Math.floor(Math.random() * RANKS.length)];
  return {
    id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    suit,
    rank: rankItem.rank,
    value: rankItem.value,
  };
}

export const CasinoWarMode: React.FC<CasinoWarModeProps> = ({ onCompleteGame }) => {
  const [stats, setStats] = useState<WarStats>({
    bankroll: 1000,
    currentStreak: 0,
    bestStreak: 0,
    warsFought: 0,
    warsWon: 0,
    totalRounds: 0,
    peakBankroll: 1000,
  });

  const [mainBet, setMainBet] = useState<number>(50);
  const [tieBet, setTieBet] = useState<number>(0);
  const [selectedChip, setSelectedChip] = useState<number>(25);

  const [roundState, setRoundState] = useState<WarRoundState>({
    phase: 'BETTING',
    playerCard: null,
    dealerCard: null,
    playerWarCard: null,
    dealerWarCard: null,
    burnCards: [],
    currentBet: 50,
    tieBet: 0,
    warRaiseBet: 0,
    outcomeText: 'Place your wager and press Deal to duel the croupier.',
    roundNetChips: 0,
  });

  // Chip options
  const CHIP_VALUES = [10, 25, 50, 100, 250];

  // Add chip to bet
  const handleAddBet = (amount: number, isTie: boolean = false) => {
    sounds.playChip();
    if (isTie) {
      if (stats.bankroll >= tieBet + amount) {
        setTieBet((prev) => prev + amount);
      }
    } else {
      if (stats.bankroll >= mainBet + amount) {
        setMainBet((prev) => prev + amount);
      }
    }
  };

  // Clear bets
  const handleClearBets = () => {
    sounds.playClick();
    setMainBet(0);
    setTieBet(0);
  };

  // Initial Deal
  const handleDeal = () => {
    if (mainBet <= 0) return;
    const totalWager = mainBet + tieBet;
    if (stats.bankroll < totalWager) return;

    sounds.playCardFlip();

    const pCard = drawCard();
    const dCard = drawCard();

    // Deduct initial wager from bankroll
    const newBankroll = stats.bankroll - totalWager;

    if (pCard.value > dCard.value) {
      // Player Wins!
      sounds.playMatchSuccess();
      const winnings = mainBet * 2; // Returns bet + 1:1 payout
      const updatedBankroll = newBankroll + winnings;
      const streak = stats.currentStreak + 1;
      const peak = Math.max(stats.peakBankroll, updatedBankroll);

      setStats((prev) => ({
        ...prev,
        bankroll: updatedBankroll,
        currentStreak: streak,
        bestStreak: Math.max(prev.bestStreak, streak),
        totalRounds: prev.totalRounds + 1,
        peakBankroll: peak,
      }));

      setRoundState({
        phase: 'ROUND_OVER',
        playerCard: pCard,
        dealerCard: dCard,
        playerWarCard: null,
        dealerWarCard: null,
        burnCards: [],
        currentBet: mainBet,
        tieBet,
        warRaiseBet: 0,
        outcomeText: `Player wins with ${pCard.rank} against ${dCard.rank}! Won +$${mainBet}`,
        roundNetChips: mainBet - tieBet,
      });
    } else if (dCard.value > pCard.value) {
      // Dealer Wins
      sounds.playMismatch();
      setStats((prev) => ({
        ...prev,
        bankroll: newBankroll,
        currentStreak: 0,
        totalRounds: prev.totalRounds + 1,
      }));

      setRoundState({
        phase: 'ROUND_OVER',
        playerCard: pCard,
        dealerCard: dCard,
        playerWarCard: null,
        dealerWarCard: null,
        burnCards: [],
        currentBet: mainBet,
        tieBet,
        warRaiseBet: 0,
        outcomeText: `Dealer wins with ${dCard.rank} against ${pCard.rank}.`,
        roundNetChips: -totalWager,
      });
    } else {
      // TIE! WAR DECLARED!
      sounds.playWarHorn();

      let tieBonus = 0;
      if (tieBet > 0) {
        // Tie bet pays 10:1
        tieBonus = tieBet * 11;
      }

      setRoundState({
        phase: 'WAR_DECISION',
        playerCard: pCard,
        dealerCard: dCard,
        playerWarCard: null,
        dealerWarCard: null,
        burnCards: [],
        currentBet: mainBet,
        tieBet,
        warRaiseBet: mainBet,
        outcomeText: `TIE! Both cards are ${pCard.rank}! ${tieBet > 0 ? `Tie bet pays +$${tieBet * 10}! ` : ''}Declare War or Surrender?`,
        roundNetChips: tieBonus - mainBet,
      });

      if (tieBonus > 0) {
        setStats((prev) => ({
          ...prev,
          bankroll: newBankroll + tieBonus,
        }));
      } else {
        setStats((prev) => ({
          ...prev,
          bankroll: newBankroll,
        }));
      }
    }
  };

  // Surrender
  const handleSurrender = () => {
    sounds.playClick();
    // In surrender, player gets half their original bet back
    const refund = Math.floor(mainBet / 2);
    const updatedBankroll = stats.bankroll + refund;

    setStats((prev) => ({
      ...prev,
      bankroll: updatedBankroll,
      currentStreak: 0,
      totalRounds: prev.totalRounds + 1,
    }));

    setRoundState((prev) => ({
      ...prev,
      phase: 'ROUND_OVER',
      outcomeText: `Surrendered. Forfeited 50% ($${mainBet - refund}) and reclaimed $${refund}.`,
      roundNetChips: -refund,
    }));
  };

  // Go to War
  const handleGoToWar = () => {
    // Check if player has enough bankroll for war raise
    if (stats.bankroll < mainBet) {
      // Not enough bankroll, must surrender
      handleSurrender();
      return;
    }

    sounds.playWarHorn();

    // Deduct raise bet
    const postRaiseBankroll = stats.bankroll - mainBet;

    // Burn 3 cards
    const burns = [drawCard(), drawCard(), drawCard()];
    // Deal duel cards
    const pWarCard = drawCard();
    const dWarCard = drawCard();

    const warsFought = stats.warsFought + 1;

    if (pWarCard.value >= dWarCard.value) {
      // Player wins or ties the war duel!
      // In casino war: player wins 1:1 on the raise, plus original bet is saved (or pays 1:1 on raise + original bet returned)
      sounds.playVictoryFanfare();
      const warPayout = mainBet * 3; // Original bet returned + Raise returned + 1x win
      const finalBankroll = postRaiseBankroll + warPayout;
      const streak = stats.currentStreak + 1;
      const peak = Math.max(stats.peakBankroll, finalBankroll);

      setStats((prev) => ({
        ...prev,
        bankroll: finalBankroll,
        warsFought,
        warsWon: prev.warsWon + 1,
        currentStreak: streak,
        bestStreak: Math.max(prev.bestStreak, streak),
        totalRounds: prev.totalRounds + 1,
        peakBankroll: peak,
      }));

      setRoundState((prev) => ({
        ...prev,
        phase: 'ROUND_OVER',
        playerWarCard: pWarCard,
        dealerWarCard: dWarCard,
        burnCards: burns,
        outcomeText: `VICTORY IN WAR! Your ${pWarCard.rank} beat dealer's ${dWarCard.rank}! Won +$${mainBet}!`,
        roundNetChips: mainBet,
      }));
    } else {
      // Dealer wins the war
      sounds.playMismatch();

      setStats((prev) => ({
        ...prev,
        bankroll: postRaiseBankroll,
        warsFought,
        currentStreak: 0,
        totalRounds: prev.totalRounds + 1,
      }));

      setRoundState((prev) => ({
        ...prev,
        phase: 'ROUND_OVER',
        playerWarCard: pWarCard,
        dealerWarCard: dWarCard,
        burnCards: burns,
        outcomeText: `Dealer's ${dWarCard.rank} defeated your ${pWarCard.rank} in War. Lost both wagers.`,
        roundNetChips: -(mainBet * 2),
      }));
    }
  };

  // Reset / Next Round
  const handleNextRound = () => {
    sounds.playClick();
    setRoundState({
      phase: 'BETTING',
      playerCard: null,
      dealerCard: null,
      playerWarCard: null,
      dealerWarCard: null,
      burnCards: [],
      currentBet: mainBet,
      tieBet: 0,
      warRaiseBet: 0,
      outcomeText: 'Place your wager and deal.',
      roundNetChips: 0,
    });
  };

  // Reload bankroll if broke
  const handleReloadBankroll = () => {
    sounds.playChip();
    setStats((prev) => ({
      ...prev,
      bankroll: 1000,
    }));
  };

  // Cash Out & Record to Leaderboard
  const handleCashOut = () => {
    sounds.playVictoryFanfare();
    const finalScore = stats.bankroll + stats.warsWon * 500 + stats.bestStreak * 200;
    onCompleteGame(finalScore, stats);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        {/* Bankroll & Current Bet */}
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Bankroll</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
              ${stats.bankroll.toLocaleString()}
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Main Wager</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
              ${mainBet}
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block" />

          <div className="hidden sm:block">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Tie Bet (10:1)</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-300 tabular-nums">
              ${tieBet}
            </div>
          </div>
        </div>

        {/* Stats & Cashout action */}
        <div className="flex items-center gap-2 sm:gap-3">
          {stats.currentStreak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-semibold">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{stats.currentStreak} Streak</span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 px-3 py-1.5 bg-slate-950/60 rounded-xl border border-slate-800">
            <span>Wars:</span>
            <span className="font-semibold text-white">{stats.warsWon}/{stats.warsFought}</span>
          </div>

          {stats.bankroll <= 0 && (
            <button
              onClick={handleReloadBankroll}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Reload $1,000
            </button>
          )}

          <button
            onClick={handleCashOut}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Cash Out Score</span>
          </button>
        </div>
      </div>

      {/* Casino Felt Arena */}
      <div
        className="relative rounded-3xl overflow-hidden border-4 border-amber-900/60 shadow-2xl bg-slate-950 min-h-[520px] flex flex-col justify-between p-6 sm:p-8"
        style={{
          backgroundImage: `radial-gradient(ellipse at center, rgba(16, 85, 48, 0.92) 0%, rgba(7, 39, 23, 0.98) 75%, rgba(3, 18, 11, 1) 100%)`,
        }}
      >
        {/* Subtle decorative table rail line */}
        <div className="absolute inset-4 rounded-2xl border border-amber-400/20 pointer-events-none" />

        {/* Top: Dealer / Croupier Area */}
        <div className="flex flex-col items-center relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full border-2 border-amber-400/60 overflow-hidden bg-slate-900 shadow-md">
              <img
                src="/src/assets/images/war_dealer_avatar_1791388122735.jpg"
                alt="Casino Dealer"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-300 font-bold">The Croupier</div>
              <div className="text-[11px] text-emerald-200/80">House Rules: Ties trigger War duel</div>
            </div>
          </div>

          {/* Dealer's Cards */}
          <div className="flex items-center gap-4">
            {roundState.dealerCard ? (
              <PlayingCard
                suit={roundState.dealerCard.suit}
                rank={roundState.dealerCard.rank}
                size="md"
              />
            ) : (
              <div className="w-24 h-36 rounded-lg border-2 border-dashed border-emerald-300/30 bg-emerald-950/30 flex items-center justify-center text-xs text-emerald-300/50">
                Dealer Card
              </div>
            )}

            {/* War Card if in War */}
            {roundState.dealerWarCard && (
              <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                <span className="text-[10px] uppercase font-bold text-rose-300 mb-1">Dealer Duel</span>
                <PlayingCard
                  suit={roundState.dealerWarCard.suit}
                  rank={roundState.dealerWarCard.rank}
                  size="md"
                  highlight
                />
              </div>
            )}
          </div>
        </div>

        {/* Center: Battle Zone & Outcome Alert */}
        <div className="my-6 text-center relative z-10">
          {roundState.phase === 'WAR_DECISION' ? (
            <div className="max-w-md mx-auto bg-slate-950/90 border-2 border-rose-500 rounded-2xl p-5 shadow-2xl animate-war-pulse">
              <div className="flex items-center justify-center gap-2 text-rose-400 font-display font-bold text-lg mb-2">
                <Swords className="w-6 h-6" />
                <span>WAR DECLARED!</span>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                Both cards tied at {roundState.playerCard?.rank}. Match your wager (${mainBet}) to burn 3 cards and duel for double glory, or surrender for 50% refund.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleSurrender}
                  className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  Surrender (Save ${Math.floor(mainBet / 2)})
                </button>
                <button
                  onClick={handleGoToWar}
                  className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg shadow-rose-600/30 cursor-pointer"
                >
                  Go to War! (+${mainBet})
                </button>
              </div>
            </div>
          ) : (
            <div className="inline-block bg-slate-950/70 backdrop-blur-xs border border-emerald-500/30 rounded-full px-6 py-2.5 shadow-md">
              <span className="text-xs sm:text-sm font-semibold text-emerald-100">
                {roundState.outcomeText}
              </span>
            </div>
          )}
        </div>

        {/* Bottom: Player Area */}
        <div className="flex flex-col items-center relative z-10">
          {/* Player Cards */}
          <div className="flex items-center gap-4 mb-4">
            {roundState.playerCard ? (
              <PlayingCard
                suit={roundState.playerCard.suit}
                rank={roundState.playerCard.rank}
                size="md"
              />
            ) : (
              <div className="w-24 h-36 rounded-lg border-2 border-dashed border-amber-400/30 bg-slate-950/30 flex items-center justify-center text-xs text-amber-200/50">
                Your Card
              </div>
            )}

            {/* Player War Card if in War */}
            {roundState.playerWarCard && (
              <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                <span className="text-[10px] uppercase font-bold text-amber-300 mb-1">Your Duel</span>
                <PlayingCard
                  suit={roundState.playerWarCard.suit}
                  rank={roundState.playerWarCard.rank}
                  size="md"
                  highlight
                />
              </div>
            )}
          </div>

          {/* Burn cards indicator if war happened */}
          {roundState.burnCards.length > 0 && (
            <div className="text-[11px] text-amber-200/70 mb-3 flex items-center gap-1.5">
              <span>Burned 3 cards:</span>
              <span className="font-mono">{roundState.burnCards.map((c) => c.rank).join(' · ')}</span>
            </div>
          )}

          {/* Betting & Play Action Bar */}
          <div className="w-full max-w-2xl bg-slate-950/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            {/* Chip selector */}
            <div className="flex items-center gap-1.5">
              {CHIP_VALUES.map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    sounds.playChip();
                    setSelectedChip(val);
                    if (roundState.phase === 'BETTING') {
                      handleAddBet(val, false);
                    }
                  }}
                  className={`w-10 h-10 rounded-full font-bold text-xs border-2 flex items-center justify-center transition-all cursor-pointer shadow-md ${
                    selectedChip === val
                      ? 'bg-amber-500 text-slate-950 border-white scale-110 shadow-amber-500/40'
                      : 'bg-slate-900 text-amber-400 border-amber-500/40 hover:bg-slate-800'
                  }`}
                >
                  ${val}
                </button>
              ))}

              {roundState.phase === 'BETTING' && (
                <button
                  onClick={handleClearBets}
                  title="Clear Wager"
                  className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800 ml-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Tie Bet toggle in betting phase */}
            {roundState.phase === 'BETTING' && (
              <button
                onClick={() => handleAddBet(25, true)}
                className="px-3 py-2 bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/40 rounded-xl text-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                + Tie Bet (${tieBet})
              </button>
            )}

            {/* Primary Action Button */}
            <div>
              {roundState.phase === 'BETTING' ? (
                <button
                  onClick={handleDeal}
                  disabled={mainBet <= 0 || stats.bankroll < mainBet}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Deal Cards
                </button>
              ) : roundState.phase === 'ROUND_OVER' ? (
                <button
                  onClick={handleNextRound}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Next Round
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
