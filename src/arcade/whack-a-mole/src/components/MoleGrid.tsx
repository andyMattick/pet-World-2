import React, { useState, useEffect } from 'react';
import { MoleHoleData } from '../types/game';

interface MoleGridProps {
  holes: MoleHoleData[];
  onWhack: (holeId: number, e: React.MouseEvent<HTMLDivElement>) => void;
  onMissGround: (e: React.MouseEvent<HTMLDivElement>) => void;
  isPlaying: boolean;
}

export const MoleGrid: React.FC<MoleGridProps> = ({
  holes,
  onWhack,
  onMissGround,
  isPlaying,
}) => {
  const [now, setNow] = useState(Date.now());

  // High-frequency tick for smooth cooldown progress animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 80);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div
      onClick={onMissGround}
      className={`relative select-none p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl shadow-black/40 overflow-hidden ${
        isPlaying ? 'cursor-crosshair' : 'cursor-default'
      }`}
    >
      {/* Background turf texture accent */}
      <div className="absolute inset-0 bg-radial from-emerald-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Grid of 9 burrows */}
      <div className="relative grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto z-10">
        {holes.map((hole) => {
          const moleType =
            hole.moleType ||
            (hole.state.includes('golden')
              ? 'golden'
              : hole.state.includes('speedy')
              ? 'speedy'
              : hole.state.includes('frozen')
              ? 'frozen'
              : 'standard');

          const isGolden = moleType === 'golden';
          const isSpeedy = moleType === 'speedy';
          const isFrozen = moleType === 'frozen';

          const isUp =
            hole.state === 'mole_up' ||
            hole.state === 'golden_up' ||
            hole.state === 'speedy_up' ||
            hole.state === 'frozen_up';
          const isWhacked =
            hole.state === 'whacked' ||
            hole.state === 'whacked_golden' ||
            hole.state === 'whacked_speedy' ||
            hole.state === 'whacked_frozen';
          const isCoolingDown =
            hole.state === 'cooling_down' ||
            hole.state === 'cooling_down_golden' ||
            hole.state === 'cooling_down_speedy' ||
            hole.state === 'cooling_down_frozen';

          const isVisible = isUp || isWhacked || isCoolingDown;

          // Calculate cooldown progress
          let remainingSec = 0;
          let cooldownProgress = 0;
          if (isCoolingDown && hole.cooldownUntil && hole.cooldownDurationMs) {
            const diff = Math.max(0, hole.cooldownUntil - now);
            remainingSec = Math.max(0.1, Number((diff / 1000).toFixed(1)));
            cooldownProgress = Math.min(
              100,
              Math.max(0, 100 - (diff / hole.cooldownDurationMs) * 100)
            );
          }

          // Colors per mole type
          const bodyGradStart = isGolden
            ? '#FDE047'
            : isSpeedy
            ? '#A5B4FC'
            : isFrozen
            ? '#67E8F9'
            : '#B45309';
          const bodyGradEnd = isGolden
            ? '#CA8A04'
            : isSpeedy
            ? '#4338CA'
            : isFrozen
            ? '#0369A1'
            : '#78350F';
          const snoutGradStart = isGolden
            ? '#FDBA74'
            : isSpeedy
            ? '#C7D2FE'
            : isFrozen
            ? '#BAE6FD'
            : '#FDBA74';
          const snoutGradEnd = isGolden
            ? '#FB923C'
            : isSpeedy
            ? '#818CF8'
            : isFrozen
            ? '#38BDF8'
            : '#FB923C';
          const earFill = isGolden
            ? '#EAB308'
            : isSpeedy
            ? '#4F46E5'
            : isFrozen
            ? '#0284C7'
            : '#78350F';

          return (
            <div
              key={hole.id}
              onClick={(e) => {
                e.stopPropagation();
                onWhack(hole.id, e);
              }}
              className="relative aspect-square flex flex-col justify-end items-center group cursor-pointer transition-transform active:scale-95 touch-manipulation"
            >
              {/* Hole Mound / Underground burrow cavity */}
              <div className="relative w-full h-full flex flex-col justify-end items-center overflow-hidden rounded-2xl bg-slate-950/80 border border-amber-950/40 shadow-inner">
                {/* Burrow shadow depth */}
                <div className="absolute inset-x-2 bottom-2 h-10 sm:h-14 rounded-[50%] bg-stone-950/90 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] border border-amber-900/30" />

                {/* The Mole Figure */}
                <div
                  className={`relative z-10 w-20 sm:w-28 transition-transform duration-150 ease-out origin-bottom ${
                    isUp
                      ? 'translate-y-1 sm:translate-y-2 scale-100'
                      : isWhacked
                      ? 'translate-y-3 scale-95 opacity-90'
                      : isCoolingDown
                      ? 'translate-y-4 scale-95 opacity-80'
                      : 'translate-y-28 scale-90 opacity-0 pointer-events-none'
                  }`}
                >
                  {/* Mole SVG Character */}
                  <svg
                    viewBox="0 0 100 95"
                    className="w-full h-auto drop-shadow-lg filter overflow-visible"
                  >
                    <defs>
                      <radialGradient id={`moleGrad-${hole.id}`} cx="45%" cy="40%" r="55%">
                        <stop offset="0%" stopColor={bodyGradStart} />
                        <stop offset="100%" stopColor={bodyGradEnd} />
                      </radialGradient>
                      <linearGradient id={`snoutGrad-${hole.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={snoutGradStart} />
                        <stop offset="100%" stopColor={snoutGradEnd} />
                      </linearGradient>
                      <linearGradient id={`helmetGrad-${hole.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isGolden ? '#FCD34D' : '#F59E0B'} />
                        <stop offset="100%" stopColor={isGolden ? '#D97706' : '#B45309'} />
                      </linearGradient>
                    </defs>

                    {/* Ears */}
                    <circle cx="28" cy="38" r="8" fill={earFill} />
                    <circle cx="28" cy="38" r="5" fill={isFrozen ? '#E0F2FE' : '#FDA4AF'} />
                    <circle cx="72" cy="38" r="8" fill={earFill} />
                    <circle cx="72" cy="38" r="5" fill={isFrozen ? '#E0F2FE' : '#FDA4AF'} />

                    {/* Mole Body & Head */}
                    <path
                      d="M 24 95 C 20 50, 30 26, 50 26 C 70 26, 80 50, 76 95 Z"
                      fill={`url(#moleGrad-${hole.id})`}
                    />

                    {/* Headgear based on Mole Type */}
                    {isGolden ? (
                      /* Golden Mole Crown */
                      <g transform="translate(32, 10)">
                        <polygon
                          points="0,18 7,4 18,15 29,4 36,18"
                          fill="#FEF08A"
                          stroke="#EAB308"
                          strokeWidth="2"
                        />
                        <circle cx="7" cy="4" r="2.5" fill="#EF4444" />
                        <circle cx="18" cy="15" r="2.5" fill="#3B82F6" />
                        <circle cx="29" cy="4" r="2.5" fill="#10B981" />
                      </g>
                    ) : isSpeedy ? (
                      /* Speedy Mole Racing Goggles & Lightning Band */
                      <g>
                        {/* Cyan Speed Headband */}
                        <path d="M 24 32 C 34 26, 66 26, 76 32" stroke="#38BDF8" strokeWidth="5" fill="none" strokeLinecap="round" />
                        {/* Racing Goggles */}
                        <ellipse cx="38" cy="32" rx="9" ry="7" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
                        <ellipse cx="62" cy="32" rx="9" ry="7" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
                        <ellipse cx="38" cy="32" rx="6" ry="4.5" fill="#0284C7" />
                        <ellipse cx="62" cy="32" rx="6" ry="4.5" fill="#0284C7" />
                        <circle cx="36" cy="30" r="1.5" fill="#FFFFFF" />
                        <circle cx="60" cy="30" r="1.5" fill="#FFFFFF" />
                        {/* Bridge */}
                        <line x1="47" y1="32" x2="53" y2="32" stroke="#38BDF8" strokeWidth="2" />
                        {/* Lightning bolt badge on top */}
                        <path d="M 50 14 L 46 22 L 51 22 L 48 29 L 55 20 L 50 20 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.8" />
                      </g>
                    ) : isFrozen ? (
                      /* Frozen Mole Earmuffs and Frost Crystals */
                      <g>
                        {/* Earmuff Band */}
                        <path d="M 26 34 C 34 16, 66 16, 74 34" stroke="#E0F2FE" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                        {/* Fluffy Earmuffs */}
                        <circle cx="25" cy="36" r="7" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
                        <circle cx="75" cy="36" r="7" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.5" />
                        {/* Snowflake Crystal on forehead */}
                        <g transform="translate(50, 22)">
                          <line x1="0" y1="-7" x2="0" y2="7" stroke="#E0F2FE" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="-7" y1="0" x2="7" y2="0" stroke="#E0F2FE" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="-5" y1="-5" x2="5" y2="5" stroke="#E0F2FE" strokeWidth="1.2" strokeLinecap="round" />
                          <line x1="-5" y1="5" x2="5" y2="-5" stroke="#E0F2FE" strokeWidth="1.2" strokeLinecap="round" />
                          <circle cx="0" cy="0" r="1.8" fill="#38BDF8" />
                        </g>
                      </g>
                    ) : (
                      /* Standard Construction Mining Helmet */
                      <g>
                        <ellipse cx="50" cy="30" rx="26" ry="6" fill={`url(#helmetGrad-${hole.id})`} />
                        <path
                          d="M 28 30 C 28 14, 72 14, 72 30 Z"
                          fill={`url(#helmetGrad-${hole.id})`}
                          stroke="#78350F"
                          strokeWidth="1"
                        />
                        <path d="M 50 14 L 50 30" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
                      </g>
                    )}

                    {/* Whacked / Cooling Down Eyes or Normal Face */}
                    {isWhacked || isCoolingDown ? (
                      <g>
                        {/* Dizzy X Eyes */}
                        <path d="M 36 44 L 44 52 M 44 44 L 36 52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 56 44 L 64 52 M 64 44 L 56 52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />

                        {/* Dizzy Floating Stars */}
                        <text x="22" y="24" fontSize="16" fill="#FBBF24" className="animate-spin origin-[28px_20px]">★</text>
                        <text x="68" y="22" fontSize="14" fill="#FBBF24" className="animate-spin origin-[72px_18px]">✦</text>

                        {/* Snout */}
                        <ellipse cx="50" cy="60" rx="14" ry="9" fill={`url(#snoutGrad-${hole.id})`} />
                        <ellipse cx="50" cy="56" rx="6" ry="4" fill="#1E293B" />
                        {/* Dazed Mouth */}
                        <path d="M 44 64 Q 47 62 50 64 Q 53 66 56 64" fill="none" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
                      </g>
                    ) : (
                      <g>
                        {/* Eyes */}
                        <ellipse cx="40" cy="46" rx="3.5" ry="5" fill="#0F172A" />
                        <circle cx="39" cy="44.5" r="1.2" fill="#FFFFFF" />
                        <ellipse cx="60" cy="46" rx="3.5" ry="5" fill="#0F172A" />
                        <circle cx="59" cy="44.5" r="1.2" fill="#FFFFFF" />

                        {/* Snout */}
                        <ellipse cx="50" cy="58" rx="14" ry="9" fill={`url(#snoutGrad-${hole.id})`} />
                        <ellipse cx="50" cy="54" rx="6" ry="4" fill="#1E293B" />
                        <circle cx="48.5" cy="53" r="1.2" fill="#FFFFFF" opacity="0.8" />

                        {/* Whiskers */}
                        <line x1="32" y1="58" x2="20" y2="56" stroke="#451A03" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="32" y1="61" x2="22" y2="63" stroke="#451A03" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="68" y1="58" x2="80" y2="56" stroke="#451A03" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="68" y1="61" x2="78" y2="63" stroke="#451A03" strokeWidth="1.2" strokeLinecap="round" />

                        {/* Happy Mole Teeth & Mouth */}
                        <path d="M 46 62 Q 50 66 54 62" fill="none" stroke="#7C2D12" strokeWidth="1.8" strokeLinecap="round" />
                        <rect x="48.5" y="62" width="3" height="3.5" rx="1" fill="#FFFFFF" stroke="#9A3412" strokeWidth="0.5" />
                      </g>
                    )}

                    {/* Front Paws */}
                    <ellipse cx="32" cy="84" rx="6" ry="4" fill="#FDBA74" />
                    <ellipse cx="68" cy="84" rx="6" ry="4" fill="#FDBA74" />
                  </svg>
                </div>

                {/* Foreground Grass Turf */}
                <div className="relative z-20 w-full h-8 sm:h-10 bg-gradient-to-t from-stone-900 via-stone-800 to-emerald-800/90 rounded-b-2xl border-t-2 border-emerald-500/40 flex items-center justify-center">
                  <div className="flex items-center gap-1.5 opacity-60">
                    <span className="w-1.5 h-3 rounded-full bg-emerald-400 rotate-12" />
                    <span className="w-1.5 h-4 rounded-full bg-emerald-500 -rotate-6" />
                    <span className="w-1.5 h-3 rounded-full bg-emerald-400 rotate-6" />
                  </div>
                </div>
              </div>

              {/* Status Badges Over Mole */}
              {isUp && isGolden && (
                <div className="absolute -top-3 z-30 px-2 py-0.5 text-[10px] font-bold text-amber-950 bg-amber-400 rounded-full shadow-md animate-bounce">
                  👑 +3 GOLDEN!
                </div>
              )}
              {isUp && isSpeedy && (
                <div className="absolute -top-3 z-30 px-2 py-0.5 text-[10px] font-extrabold text-slate-950 bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-200 rounded-full shadow-md shadow-sky-500/30 animate-bounce ring-1 ring-sky-300">
                  ⚡ +5 SPEEDY!
                </div>
              )}
              {isUp && isFrozen && (
                <div className="absolute -top-3 z-30 px-2 py-0.5 text-[10px] font-extrabold text-cyan-950 bg-gradient-to-r from-cyan-200 via-sky-200 to-blue-200 rounded-full shadow-md shadow-cyan-500/30 animate-bounce ring-1 ring-cyan-400">
                  ❄️ +2 · +3s TIME!
                </div>
              )}

              {/* Hit count indicator if mole was hit previously */}
              {isVisible && (hole.hitCount ?? 0) > 0 && (
                <div className="absolute top-2 left-2 z-30 px-1.5 py-0.2 rounded bg-slate-900/90 border border-slate-700 text-[9px] font-mono font-bold text-slate-300">
                  Hits: {hole.hitCount}
                </div>
              )}

              {/* Cool-Down Countdown Indicator & Progress Bar */}
              {isCoolingDown && remainingSec > 0 && (
                <div className="absolute -top-3.5 z-30 flex flex-col items-center gap-0.5">
                  <div className="px-2 py-0.5 text-[10px] font-mono font-bold text-slate-200 bg-slate-900/95 border border-amber-500/60 rounded-full shadow-md flex items-center gap-1">
                    <span className="text-amber-400 animate-spin text-[9px]">⏳</span>
                    <span>{remainingSec}s</span>
                  </div>
                  {/* Recharge Progress Meter */}
                  <div className="w-14 sm:w-16 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-75"
                      style={{ width: `${cooldownProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
