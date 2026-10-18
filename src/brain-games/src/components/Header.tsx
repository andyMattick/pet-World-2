import React from 'react';
import { Volume2, VolumeX, Play, Compass, BookOpen, Check, Sparkles, Brain, Trophy } from 'lucide-react';

interface HeaderProps {
  currentView: 'catalog' | 'pathways' | 'regimen' | 'progress' | 'insights';
  onNavigate: (view: 'catalog' | 'pathways' | 'regimen' | 'progress' | 'insights') => void;
  onOpenBaselineModal: () => void;
  onOpenGameGuideModal: () => void;
  onOpenAchievementsModal: () => void;
  onOpenEmbedModal: () => void;
  onOpenWarmupModal?: () => void;
  onOpenLeaderboardModal?: () => void;
  onStartDailyWorkout: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  dailyWorkoutCompletedCount: number;
  isZenMode: boolean;
  onToggleZenMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenBaselineModal,
  onOpenGameGuideModal,
  onOpenAchievementsModal,
  onOpenEmbedModal,
  onOpenWarmupModal,
  onOpenLeaderboardModal,
  onStartDailyWorkout,
  soundOn,
  onToggleSound,
  dailyWorkoutCompletedCount = 0,
  isZenMode = false,
  onToggleZenMode,
}) => {
  const isWorkoutFullyDone = dailyWorkoutCompletedCount >= 3;

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('catalog');
        }}
        className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-indigo-400 transition-colors"
      >
        NeuroSuite
      </a>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => onNavigate('catalog')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentView === 'catalog' ? 'text-white' : ''
          }`}
        >
          All Games
        </button>
        <button
          onClick={onOpenBaselineModal}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Baseline Test</span>
        </button>
        <button
          onClick={onOpenGameGuideModal}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>Game Guide</span>
        </button>
        <button
          onClick={() => onNavigate('pathways')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentView === 'pathways' ? 'text-white' : ''
          }`}
        >
          Pathways
        </button>
        <button
          onClick={() => onNavigate('progress')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentView === 'progress' ? 'text-white' : ''
          }`}
        >
          Progress
        </button>
        <button
          onClick={() => onNavigate('insights')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
            currentView === 'insights' ? 'text-white font-semibold' : ''
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-indigo-400" />
          <span>Insights</span>
        </button>
        <button
          onClick={onOpenAchievementsModal}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Badges
        </button>
        {onOpenLeaderboardModal && (
          <button
            onClick={onOpenLeaderboardModal}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </button>
        )}
      </nav>

      {/* Zone 3: 1 primary action & sound control */}
      <div className="flex items-center gap-2.5 shrink-0">
        {onOpenWarmupModal && (
          <button
            onClick={onOpenWarmupModal}
            title="Start 2-min cognitive warm-up before your main training"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Warm-Up</span>
          </button>
        )}

        <button
          onClick={onToggleZenMode}
          title={isZenMode ? 'Disable Zen Focus Mode' : 'Enable Zen Mode (Peaceful ambient music & distraction-free)'}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 border cursor-pointer ${
            isZenMode
              ? 'border-indigo-500/50 bg-indigo-950/80 text-indigo-200 shadow-sm shadow-indigo-500/25'
              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isZenMode ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">{isZenMode ? 'Zen Mode: ON' : 'Zen Mode'}</span>
        </button>

        <button
          onClick={onToggleSound}
          title={soundOn ? 'Mute Audio' : 'Enable Audio'}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
          aria-label={soundOn ? 'Mute Audio' : 'Enable Audio'}
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-slate-300" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        <button
          onClick={onStartDailyWorkout}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-sm ${
            isWorkoutFullyDone
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          {isWorkoutFullyDone ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Workout Credited (3/3)</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Workout ({dailyWorkoutCompletedCount}/3)</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
