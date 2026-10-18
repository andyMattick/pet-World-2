import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, ArrowLeft, Sliders, Music, EyeOff } from 'lucide-react';
import { isZenMusicActive, getZenVolume, setZenVolume, startZenMusic, stopZenMusic } from '../utils/audio';

interface ZenModeHUDProps {
  gameTitle: string;
  brainRegionName: string;
  anatomicalCode: string;
  onExitGame: () => void;
  onToggleZenMode: () => void;
  isZenActive: boolean;
}

export const ZenModeHUD: React.FC<ZenModeHUDProps> = ({
  gameTitle,
  brainRegionName,
  anatomicalCode,
  onExitGame,
  onToggleZenMode,
  isZenActive,
}) => {
  const [musicActive, setMusicActive] = useState<boolean>(isZenMusicActive());
  const [currentVolume, setCurrentVolumeState] = useState<number>(Math.round(getZenVolume() * 100));
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);

  const handleToggleMusic = () => {
    if (musicActive) {
      stopZenMusic();
      setMusicActive(false);
    } else {
      startZenMusic();
      setMusicActive(true);
    }
  };

  const handleVolumeChange = (newVal: number) => {
    setCurrentVolumeState(newVal);
    setZenVolume(newVal / 100);
    if (!musicActive && newVal > 0) {
      startZenMusic();
      setMusicActive(true);
    }
  };

  return (
    <header className="w-full px-4 sm:px-8 py-3 bg-slate-950/90 border-b border-indigo-950/60 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between gap-4 transition-all duration-300">
      {/* Left: Quick exit & minimal title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExitGame}
          className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          title="Exit game to main suite"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exit Session</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white tracking-tight">{gameTitle}</span>
          <span className="hidden md:inline-block text-xs font-mono text-slate-500">
            · {brainRegionName} ({anatomicalCode})
          </span>
        </div>
      </div>

      {/* Center: Peaceful Breathing Status Indicator */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-indigo-950/40 border border-indigo-500/20 rounded-full">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        <span className="text-xs text-indigo-300 font-medium flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Zen Focus Active</span>
          <span className="text-indigo-400/60 text-[10px] hidden lg:inline">· Non-essential UI & notifications silenced</span>
        </span>
      </div>

      {/* Right: Peaceful Music Controller & Zen Toggle */}
      <div className="flex items-center gap-2 relative">
        {/* Ambient Peaceful Music Toggle & Volume Control */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={handleToggleMusic}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              musicActive
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={musicActive ? 'Mute Peaceful Music' : 'Play Peaceful Music'}
          >
            <Music className={`w-3.5 h-3.5 ${musicActive ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="hidden md:inline">{musicActive ? 'Soundscape On' : 'Music Off'}</span>
          </button>

          <button
            onClick={() => setShowVolumeSlider(prev => !prev)}
            className="p-1.5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
            title="Adjust Ambient Soundscape Volume"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Volume popover */}
        {showVolumeSlider && (
          <div className="absolute top-11 right-20 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-2xl z-50 w-48 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="font-medium">Peaceful Music</span>
              <span className="font-mono text-indigo-400">{currentVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentVolume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
              <span>Soft Drones</span>
              <span>Tibetan Chimes</span>
            </div>
          </div>
        )}

        {/* Zen Mode Switch Button */}
        <button
          onClick={onToggleZenMode}
          className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 border border-indigo-500/40 bg-indigo-950/60 text-indigo-200 hover:bg-indigo-900/60 cursor-pointer"
          title="Exit Zen Mode to return to standard arena"
        >
          <EyeOff className="w-3.5 h-3.5 text-indigo-400" />
          <span>Exit Zen</span>
        </button>
      </div>
    </header>
  );
};
