import React from 'react';
import { Direction } from '../types/game';

interface PlayerSpriteProps {
  direction: Direction;
  isMoving: boolean;
  hasArmor: boolean;
  isJumping: boolean;
}

export const PlayerSprite: React.FC<PlayerSpriteProps> = ({
  direction,
  isMoving,
  hasArmor,
  isJumping
}) => {
  // Compute rotation angle based on facing direction
  const rotationAngles: Record<Direction, number> = {
    N: 0,
    NE: 45,
    E: 90,
    SE: 135,
    S: 180,
    SW: 225,
    W: 270,
    NW: 315
  };

  const angle = rotationAngles[direction] ?? 0;

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center pointer-events-none select-none transition-transform duration-150 ${
        isJumping ? 'scale-125 -translate-y-4 shadow-2xl' : 'scale-100'
      }`}
    >
      {/* Ground Shadow */}
      <div
        className={`absolute bottom-0 w-8 h-4 bg-black/60 rounded-full blur-xs transition-transform duration-200 ${
          isJumping ? 'scale-75 opacity-40 translate-y-3' : 'scale-100 opacity-80'
        }`}
      />

      {/* Protective Shield Aura if Armor active */}
      {hasArmor && (
        <div className="absolute inset-0.5 rounded-full border border-cyan-400/60 bg-cyan-500/10 animate-pulse pointer-events-none" />
      )}

      {/* Rotatable Character Container */}
      <div
        className={`relative w-9 h-9 transition-transform duration-150 ease-out flex items-center justify-center ${
          isMoving ? 'animate-bounce' : ''
        }`}
        style={{ transform: `rotate(${angle}deg)` }}
      >
        {/* Forward Flashlight Beam */}
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-10 h-10 pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(251, 191, 36, 0.45) 0%, rgba(251, 191, 36, 0) 75%)',
            clipPath: 'polygon(35% 100%, 65% 100%, 100% 0%, 0% 0%)'
          }}
        />

        {/* Tactical Scout SVG */}
        <svg
          viewBox="0 0 36 36"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shoulders & Backpack */}
          <rect x="9" y="14" width="18" height="15" rx="5" fill="#334155" />
          <rect x="12" y="18" width="12" height="9" rx="2" fill="#1E293B" />

          {/* Tactical Vest Straps */}
          <line x1="12" y1="14" x2="12" y2="28" stroke="#64748B" strokeWidth="1.5" />
          <line x1="24" y1="14" x2="24" y2="28" stroke="#64748B" strokeWidth="1.5" />

          {/* Helmet */}
          <circle cx="18" cy="14" r="7.5" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />

          {/* Helmet Visor / Goggles (Facing Up/North) */}
          <path
            d="M13 11 Q18 8 23 11"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Metal Detector Arm & Wand (Extending forward) */}
          <path
            d="M24 16 L29 10 L28 4"
            stroke="#94A3B8"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Detector Sensor Head */}
          <circle cx="28" cy="4" r="3" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          <circle cx="28" cy="4" r="1" fill="#FEF3C7" />
        </svg>
      </div>
    </div>
  );
};
