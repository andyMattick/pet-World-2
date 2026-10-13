import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/audio';

interface TopBarProps {
  onOpenArmory: () => void;
  onOpenIntel: () => void;
  onOpenControls: () => void;
  onOpenSandbox: () => void;
  onStartEndless: () => void;
  onDeployNewRun: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  gameMode: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenArmory,
  onOpenIntel,
  onOpenControls,
  onOpenSandbox,
  onStartEndless,
  onDeployNewRun,
  isMuted,
  onToggleMute,
  gameMode
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 select-none">
      {/* Zone 1: Single text element wordmark */}
      <span className="text-lg font-bold tracking-tight text-amber-400 font-mono whitespace-nowrap shrink-0 flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm inline-block" />
        Mine Walker
      </span>

      {/* Zone 2: 4-5 clean single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={onDeployNewRun}
          className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left ${
            gameMode === 'campaign' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Campaign
        </button>
        <button
          onClick={onStartEndless}
          className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left ${
            gameMode === 'endless' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Endless Run
        </button>
        <button
          onClick={onOpenArmory}
          className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left"
        >
          Armory
        </button>
        <button
          onClick={onOpenControls}
          className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left"
        >
          Manual
        </button>
        <button
          onClick={onOpenSandbox}
          className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left"
        >
          Sandbox
        </button>
      </nav>

      {/* Zone 3: Audio Toggle & Primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
          aria-label="Toggle Audio"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
        <button
          onClick={onDeployNewRun}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all rounded-lg whitespace-nowrap shrink-0 tracking-wide"
        >
          New Deployment
        </button>
      </div>
    </header>
  );
};
