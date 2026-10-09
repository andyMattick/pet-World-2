import React from 'react';
import { CardSuit, CardRank } from '../types';

interface PlayingCardProps {
  suit: CardSuit;
  rank: CardRank;
  isFlipped?: boolean; // true = face-down, false = face-up
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  highlight?: boolean;
  disabled?: boolean;
}

const SUIT_SYMBOLS: Record<CardSuit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

export const PlayingCard: React.FC<PlayingCardProps> = ({
  suit,
  rank,
  isFlipped = false,
  size = 'md',
  className = '',
  onClick,
  highlight = false,
  disabled = false,
}) => {
  const isRed = suit === 'hearts' || suit === 'diamonds';
  const symbol = SUIT_SYMBOLS[suit];

  const sizeClasses = {
    sm: 'w-14 h-20 text-xs rounded-md',
    md: 'w-24 h-36 text-sm rounded-lg',
    lg: 'w-32 h-48 text-base rounded-xl',
  }[size];

  const pipSizes = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-4xl',
  }[size];

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`relative select-none perspective-1000 transition-transform duration-200 ${
        onClick && !disabled ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl active:translate-y-0' : ''
      } ${sizeClasses} ${className}`}
    >
      <div
        className={`w-full h-full duration-300 transform-style-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        } ${highlight ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 shadow-amber-500/30' : ''}`}
      >
        {/* FACE SIDE */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden bg-white rounded-lg border border-slate-300 shadow-md flex flex-col justify-between p-2 font-sans ${
            isRed ? 'text-red-600' : 'text-slate-900'
          }`}
        >
          {/* Top-left rank & suit */}
          <div className="flex flex-col items-center leading-none self-start">
            <span className="font-bold tracking-tight">{rank}</span>
            <span className="text-sm">{symbol}</span>
          </div>

          {/* Center pip / court emblem */}
          <div className="flex items-center justify-center flex-1">
            <span className={`${pipSizes} font-serif drop-shadow-xs`}>{symbol}</span>
          </div>

          {/* Bottom-right inverted rank & suit */}
          <div className="flex flex-col items-center leading-none self-end rotate-180">
            <span className="font-bold tracking-tight">{rank}</span>
            <span className="text-sm">{symbol}</span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-linear-to-br from-blue-900 via-indigo-950 to-slate-950 rounded-lg border-2 border-amber-400/50 shadow-md p-1.5 flex items-center justify-center overflow-hidden"
        >
          {/* Intricate Casino Geometric Pattern */}
          <div className="w-full h-full border border-amber-300/30 rounded flex items-center justify-center relative bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:8px_8px] bg-opacity-20">
            <div className="w-8 h-8 rounded-full border border-amber-400/60 flex items-center justify-center bg-indigo-950/80 shadow-inner">
              <span className="text-amber-400 text-xs font-serif font-bold">♠</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
