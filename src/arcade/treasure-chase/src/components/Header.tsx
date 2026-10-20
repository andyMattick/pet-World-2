import React from 'react';
import {
  Compass,
  Clock,
  FileCheck,
  ShieldAlert,
  Volume2,
  VolumeX,
  Award,
  BookOpen,
  MapPin,
  Plane,
  Search,
} from 'lucide-react';
import { GameCase, PlayerCareer } from '../types/game';
import { formatGameTime } from '../services/gameEngine';
import { sounds } from '../services/soundEffects';

interface HeaderProps {
  currentCase: GameCase;
  career: PlayerCareer;
  activeTab: 'investigate' | 'travel' | 'warrant' | 'research' | 'mission_log';
  onSelectTab: (tab: 'investigate' | 'travel' | 'warrant' | 'research' | 'mission_log') => void;
  onOpenBriefing: () => void;
  onOpenCareer: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCase,
  career,
  activeTab,
  onSelectTab,
  onOpenBriefing,
  onOpenCareer,
  isMuted,
  onToggleMute,
}) => {
  const timeInfo = formatGameTime(1, currentCase.hoursRemaining, currentCase.totalTimeAllowed);
  const timePercent = Math.max(0, Math.min(100, (currentCase.hoursRemaining / currentCase.totalTimeAllowed) * 100));

  const isUrgent = currentCase.hoursRemaining <= 24;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/20 shadow-2xl">
      {/* Top Bureau Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Agency */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center text-amber-400">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-terminal font-bold text-xl tracking-wider text-amber-400 crt-amber-glow uppercase">
                The Great Treasure Chase
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-sm font-mono tracking-widest uppercase bg-amber-500/10 border border-amber-500/30 text-amber-300">
                G.L.O.B.E. INTERPOL
              </span>
            </div>
            <p className="text-sm text-slate-400 font-mono flex items-center gap-2">
              <span>CASE #{currentCase.caseNumber}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-semibold">{currentCase.artifact.name}</span>
            </p>
          </div>
        </div>

        {/* Middle: Mission Clock & Location */}
        <div className="flex items-center gap-3 sm:gap-6 bg-slate-950/80 px-4 py-1.5 rounded-lg border border-slate-800">
          {/* Current City */}
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentCase.currentCity.flag}</span>
            <div className="text-left">
              <div className="text-sm font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                Current City
              </div>
              <div className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                {currentCase.currentCity.name}
                {currentCase.legs[currentCase.currentLegIndex]?.isFinalHideout && (
                  <span className="px-1 py-0.5 text-xs font-bold uppercase rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                    Hideout
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-slate-800" />

          {/* Time & Countdown Timer */}
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl transition-all ${
                isUrgent
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}
            >
              <Clock className={`w-4 h-4 ${isUrgent ? 'animate-bounce' : 'animate-[spin_12s_linear_infinite]'}`} />
            </div>
            <div>
              <div className="text-sm font-mono uppercase tracking-wider flex items-center gap-1.5">
                <span className={isUrgent ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-300 font-medium'}>
                  {timeInfo.text}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-sm font-bold ${isUrgent ? 'text-rose-400 font-extrabold' : 'text-amber-300'}`}>
                  {currentCase.hoursRemaining}h left
                </span>
                <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isUrgent ? 'bg-rose-500 shadow-sm shadow-rose-500/50' : 'bg-gradient-to-r from-amber-500 to-emerald-400'
                    }`}
                    style={{ width: `${timePercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Badges & Controls */}
        <div className="flex items-center gap-2">
          {/* Warrant Status Chip */}
          <button
            onClick={() => {
              sounds.play('click');
              onSelectTab('warrant');
            }}
            className={`px-3 py-1.5 rounded-lg border text-sm font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              currentCase.warrantIssuedFor
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/40'
            }`}
          >
            {currentCase.warrantIssuedFor ? (
              <>
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">WARRANT:</span>
                <span className="font-bold">ISSUED</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">WARRANT:</span>
                <span className="text-amber-400 font-bold">NO WARRANT</span>
              </>
            )}
          </button>

          {/* Dossier Career Button */}
          <button
            onClick={() => {
              sounds.play('click');
              onOpenCareer();
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-sm font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            title="Detective Career File"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">{career.rankTitle}</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold text-sm">
              {career.casesSolved}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sounds.play('click');
              onToggleMute();
            }}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition-all cursor-pointer"
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between overflow-x-auto py-1">
          <div className="flex items-center space-x-1 sm:space-x-2 py-0.5">
            <button
              onClick={() => {
                sounds.play('click');
                onSelectTab('investigate');
              }}
              className={`px-3 py-1.5 rounded-md font-mono text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'investigate'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>INVESTIGATE CITY</span>
            </button>

            <button
              onClick={() => {
                sounds.play('click');
                onSelectTab('travel');
              }}
              className={`px-3 py-1.5 rounded-md font-mono text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'travel'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>TRAVEL DEPARTURES</span>
            </button>

            <button
              onClick={() => {
                sounds.play('click');
                onSelectTab('warrant');
              }}
              className={`px-3 py-1.5 rounded-md font-mono text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'warrant'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>CRIME COMPUTER</span>
            </button>

            <button
              onClick={() => {
                sounds.play('click');
                onSelectTab('research');
              }}
              className={`px-3 py-1.5 rounded-md font-mono text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'research'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>RESEARCH TERMINAL & NOTES</span>
              {currentCase.clueLog.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-sm font-bold flex items-center justify-center">
                  {currentCase.clueLog.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                sounds.play('click');
                onSelectTab('mission_log');
              }}
              className={`px-3 py-1.5 rounded-md font-mono text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'mission_log'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>MISSION LOG</span>
              {career.missionHistory && career.missionHistory.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-300 border border-slate-700 text-sm font-bold">
                  {career.missionHistory.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => {
              sounds.play('click');
              onOpenBriefing();
            }}
            className="text-sm font-mono text-amber-400/90 hover:text-amber-300 underline underline-offset-4 flex items-center gap-1.5 cursor-pointer px-2 whitespace-nowrap"
          >
            <span>Read Case Dossier</span>
          </button>
        </div>
      </div>
    </header>
  );
};
