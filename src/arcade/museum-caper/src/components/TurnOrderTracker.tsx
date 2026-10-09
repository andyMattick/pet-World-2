import React from 'react';
import { GameState, DetectiveCharacter } from '../types/game';
import { ArrowRight, Footprints, Shield, User, Clock } from 'lucide-react';

interface TurnOrderTrackerProps {
  state: GameState;
}

export const TurnOrderTracker: React.FC<TurnOrderTrackerProps> = ({ state }) => {
  const { activePhase, currentDetectiveIndex, detectives, thief, turnNumber } = state;
  const currentDet = detectives[currentDetectiveIndex];

  // Calculate upcoming turn queue (next 5 turns)
  interface TurnQueueItem {
    type: 'thief' | 'detective';
    name: string;
    clueName: string;
    color: string;
    isCurrent: boolean;
    isNext: boolean;
  }

  const queue: TurnQueueItem[] = [];

  // If currently Thief:
  // Now: Thief
  // Next: currentDet
  // Then: Thief
  // Then: nextDet
  // Then: Thief
  // Then: nextNextDet
  if (activePhase === 'thief') {
    queue.push({
      type: 'thief',
      name: 'Boris (Thief)',
      clueName: 'Boris',
      color: '#a1a1aa',
      isCurrent: true,
      isNext: false,
    });
    queue.push({
      type: 'detective',
      name: currentDet.name,
      clueName: currentDet.clueName,
      color: currentDet.color,
      isCurrent: false,
      isNext: true,
    });
    const nextDet1 = detectives[(currentDetectiveIndex + 1) % detectives.length];
    queue.push({
      type: 'thief',
      name: 'Boris',
      clueName: 'Boris',
      color: '#a1a1aa',
      isCurrent: false,
      isNext: false,
    });
    queue.push({
      type: 'detective',
      name: nextDet1.name,
      clueName: nextDet1.clueName,
      color: nextDet1.color,
      isCurrent: false,
      isNext: false,
    });
    const nextDet2 = detectives[(currentDetectiveIndex + 2) % detectives.length];
    queue.push({
      type: 'thief',
      name: 'Boris',
      clueName: 'Boris',
      color: '#a1a1aa',
      isCurrent: false,
      isNext: false,
    });
    queue.push({
      type: 'detective',
      name: nextDet2.name,
      clueName: nextDet2.clueName,
      color: nextDet2.color,
      isCurrent: false,
      isNext: false,
    });
  } else {
    // Currently Detective:
    // Now: currentDet
    // Next: Thief
    // Then: nextDet
    // Then: Thief
    // Then: nextNextDet
    queue.push({
      type: 'detective',
      name: currentDet.name,
      clueName: currentDet.clueName,
      color: currentDet.color,
      isCurrent: true,
      isNext: false,
    });
    queue.push({
      type: 'thief',
      name: 'Boris (Thief)',
      clueName: 'Boris',
      color: '#a1a1aa',
      isCurrent: false,
      isNext: true,
    });
    const nextDet = detectives[(currentDetectiveIndex + 1) % detectives.length];
    queue.push({
      type: 'detective',
      name: nextDet.name,
      clueName: nextDet.clueName,
      color: nextDet.color,
      isCurrent: false,
      isNext: false,
    });
    queue.push({
      type: 'thief',
      name: 'Boris',
      clueName: 'Boris',
      color: '#a1a1aa',
      isCurrent: false,
      isNext: false,
    });
    const nextDet2 = detectives[(currentDetectiveIndex + 2) % detectives.length];
    queue.push({
      type: 'detective',
      name: nextDet2.name,
      clueName: nextDet2.clueName,
      color: nextDet2.color,
      isCurrent: false,
      isNext: false,
    });
  }

  const nextUpItem = queue.find(q => q.isNext);

  // Next Detective specifically:
  const nextDetectiveToMove = activePhase === 'thief'
    ? currentDet
    : detectives[(currentDetectiveIndex + 1) % detectives.length];

  return (
    <div className="w-full bg-stone-900/90 border border-stone-800 rounded-xl p-3 shadow-lg mb-4 backdrop-blur-sm">
      {/* Top Banner: Current vs Next Detective */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/80 pb-2.5 mb-2.5">
        {/* Left: Active Turn Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-950 rounded-lg border border-stone-700/60 shadow-inner">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Current Turn:</span>
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <span
                className="w-3 h-3 rounded-full border border-white/60 shadow animate-pulse"
                style={{ backgroundColor: activePhase === 'thief' ? '#a1a1aa' : currentDet.color }}
              />
              <span className="text-white font-mono">
                {activePhase === 'thief' ? 'Boris (The Thief)' : currentDet.name}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right: Next Detective to Move Badge */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-950/60 to-stone-950 border border-amber-600/40 px-3 py-1 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300/80">Next Detective:</span>
          <div className="flex items-center gap-1.5 font-bold text-xs font-mono text-amber-300">
            <span
              className="w-2.5 h-2.5 rounded-full border border-white/50"
              style={{ backgroundColor: nextDetectiveToMove.color }}
            />
            <span>{nextDetectiveToMove.name}</span>
          </div>
        </div>
      </div>

      {/* Turn Order Queue Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono select-none">
        <span className="text-[10px] text-stone-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Footprints className="w-3 h-3" /> Turn Queue:
        </span>

        {queue.slice(0, 6).map((item, idx) => (
          <React.Fragment key={idx}>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md shrink-0 border transition-all ${
                item.isCurrent
                  ? 'bg-amber-500/20 border-amber-400 text-white font-bold ring-2 ring-amber-400/40 shadow-sm'
                  : item.isNext
                  ? 'bg-stone-800 border-amber-500/50 text-amber-200 font-semibold'
                  : 'bg-stone-950/70 border-stone-800 text-stone-400'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/40"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate max-w-[100px]">{item.clueName}</span>
              {item.isCurrent && (
                <span className="text-[9px] bg-amber-500 text-black px-1 py-0.2 rounded font-black uppercase">
                  NOW
                </span>
              )}
              {item.isNext && (
                <span className="text-[9px] bg-stone-700 text-amber-300 px-1 py-0.2 rounded font-semibold uppercase">
                  NEXT
                </span>
              )}
            </div>

            {idx < 5 && (
              <ArrowRight className="w-3 h-3 text-stone-600 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
