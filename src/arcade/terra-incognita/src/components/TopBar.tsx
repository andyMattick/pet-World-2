import React from 'react';
import { CrownNation } from '../types';
import { NATIONS } from '../data/nations';
import { SoundEngine } from '../utils/audio';
import { Volume2, VolumeX, Play, Pause, FastForward, Sun, Moon } from 'lucide-react';

interface TopBarProps {
  playerNation: CrownNation;
  gameYear: number;
  gameMonth: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  hourOfDay: number;
  isNight: boolean;
  ducats: number;
  prestige: number;
  gameSpeed: number; // 0 = paused, 1 = normal, 2 = fast, 5 = warp
  onSetGameSpeed: (speed: number) => void;
  activeView: 'MAP' | 'CATALOG' | 'FLEET' | 'DIPLOMACY' | 'RIVALRY' | 'LOGS';
  onSelectView: (view: 'MAP' | 'CATALOG' | 'FLEET' | 'DIPLOMACY' | 'RIVALRY' | 'LOGS') => void;
  unclaimedMissionsCount?: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  playerNation,
  gameYear,
  gameMonth,
  season,
  hourOfDay,
  isNight,
  ducats,
  prestige,
  gameSpeed,
  onSetGameSpeed,
  activeView,
  onSelectView,
  unclaimedMissionsCount = 0,
  isMuted,
  onToggleMute
}) => {
  const nation = NATIONS[playerNation];

  return (
    <header className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-x-8 gap-y-1.5 px-3 sm:px-6 py-2 sm:py-3 border-b border-[#382E25] bg-[#181411] text-[#EFE7D8] z-40 shrink-0">
      {/* Zone 1: Single text element Brand wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-base sm:text-lg font-serif font-bold tracking-wider text-amber-200 whitespace-nowrap">
          TERRA INCOGNITA
        </span>
        <span className="text-xs font-sans text-[#A89279] hidden lg:inline whitespace-nowrap">
          · {nation.name}
        </span>
      </div>

      {/* Zone 2: 4-5 clean single-line nav links */}
      <nav className="order-last lg:order-none w-full lg:w-auto flex items-center gap-4 sm:gap-6 text-sm font-medium text-[#CBB59C] overflow-x-auto pb-1 lg:pb-0">
        <button
          onClick={() => {
            SoundEngine.playCompassClick();
            onSelectView('MAP');
          }}
          className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'MAP' ? 'text-amber-300 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          World Chart
        </button>
        <button
          onClick={() => {
            SoundEngine.playCompassClick();
            onSelectView('CATALOG');
          }}
          className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'CATALOG' ? 'text-amber-300 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          Field Compendium
        </button>
        <button
          onClick={() => {
            SoundEngine.playCompassClick();
            onSelectView('FLEET');
          }}
          className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'FLEET' ? 'text-amber-300 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          Harbor & Ships
        </button>
        <button
          onClick={() => {
            SoundEngine.playCompassClick();
            onSelectView('DIPLOMACY');
          }}
          className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'DIPLOMACY' ? 'text-amber-300 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          Diplomacy
        </button>
        <button
          onClick={() => {
            SoundEngine.playCompassClick();
            onSelectView('LOGS');
          }}
          className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
            activeView === 'LOGS' ? 'text-amber-300 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          <span>Log & Orders</span>
          {unclaimedMissionsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>
        <button
          onClick={() => {
            SoundEngine.playCompassClick();
            onSelectView('RIVALRY');
          }}
          className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'RIVALRY' ? 'text-amber-300 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          Four Crowns
        </button>
      </nav>

      {/* Zone 3: 1 primary action area with calendar, resources, and pause controls */}
      <div className="flex items-center gap-2 sm:gap-5 shrink-0">
        {/* Treasury & Prestige metrics */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-tabular text-[#E5D7C3]">
          <span className="flex items-center gap-1.5" title="Ducats (Gold Currency)">
            <span className="text-amber-400 font-serif font-bold">⚜</span>
            <span>{ducats.toLocaleString()} D</span>
          </span>
          <span className="text-[#5C4533]">|</span>
          <span className="flex items-center gap-1.5" title="Royal Prestige">
            <span className="text-emerald-400 font-serif font-bold">✦</span>
            <span>{prestige.toLocaleString()} Prestige</span>
          </span>
          <span className="text-[#5C4533]">|</span>
          <span className="text-[#A89279] whitespace-nowrap flex items-center gap-1.5">
            <span>{gameMonth} {gameYear} · {season}</span>
            <span className="text-[#5C4533]">·</span>
            <span className={`flex items-center gap-1 font-semibold ${isNight ? 'text-cyan-300' : 'text-amber-300'}`}>
              {isNight ? <Moon className="w-3 h-3 text-cyan-300 animate-pulse" /> : <Sun className="w-3 h-3 text-amber-400" />}
              <span>{String(hourOfDay).padStart(2, '0')}:00 {isNight ? 'Night (Stars Out)' : 'Day'}</span>
            </span>
          </span>
        </div>

        {/* Phone: the date and the treasury in one short line */}
        <span className="sm:hidden text-[11px] font-tabular text-[#A89279] whitespace-nowrap">{gameMonth.slice(0, 3)} {gameYear} · ⚜{ducats.toLocaleString()}</span>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-[#261E17] border border-[#4A3B2C] rounded-md p-1">
          <button
            onClick={() => {
              SoundEngine.playCompassClick();
              onSetGameSpeed(gameSpeed === 0 ? 1 : 0);
            }}
            className={`p-1 rounded text-xs transition-colors ${
              gameSpeed === 0 ? 'bg-amber-600 text-white' : 'text-[#CBB59C] hover:text-white'
            }`}
            title={gameSpeed === 0 ? 'Resume' : 'Pause'}
          >
            {gameSpeed === 0 ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              SoundEngine.playCompassClick();
              onSetGameSpeed(1);
            }}
            className={`px-1.5 py-0.5 rounded text-[11px] font-tabular transition-colors ${
              gameSpeed === 1 ? 'bg-[#4A3B2C] text-amber-200' : 'text-[#A89279] hover:text-white'
            }`}
          >
            1x
          </button>
          <button
            onClick={() => {
              SoundEngine.playCompassClick();
              onSetGameSpeed(3);
            }}
            className={`px-1.5 py-0.5 rounded text-[11px] font-tabular transition-colors ${
              gameSpeed === 3 ? 'bg-[#4A3B2C] text-amber-200' : 'text-[#A89279] hover:text-white'
            }`}
            title="Fast Forward"
          >
            3x
          </button>
          <button
            onClick={() => {
              SoundEngine.playCompassClick();
              onSetGameSpeed(8);
            }}
            className={`px-1.5 py-0.5 rounded text-[11px] font-tabular transition-colors ${
              gameSpeed === 8 ? 'bg-amber-700 text-white' : 'text-[#A89279] hover:text-white'
            }`}
            title="Warp Transit"
          >
            8x
          </button>
        </div>

        {/* Mute button */}
        <button
          onClick={onToggleMute}
          className="p-1.5 text-[#A89279] hover:text-amber-200 transition-colors"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
