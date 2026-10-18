import React, { useState } from 'react';
import { GAME_GUIDES, GameGuideDetail } from '../data/gameGuideData';
import { GAMES_CATALOG } from '../data/gamesCatalog';
import {
  X,
  BookOpen,
  Brain,
  Lightbulb,
  Play,
  Sparkles,
  Target,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface GameGuideModalProps {
  initialGameId?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchGame: (gameId: string) => void;
}

export const GameGuideModal: React.FC<GameGuideModalProps> = ({
  initialGameId,
  isOpen,
  onClose,
  onLaunchGame,
}) => {
  const [selectedGameId, setSelectedGameId] = useState<string>(initialGameId || 'dual-n-back');

  // Sync if initialGameId changes
  React.useEffect(() => {
    if (initialGameId) {
      setSelectedGameId(initialGameId);
    }
  }, [initialGameId]);

  if (!isOpen) return null;

  const currentGuide = GAME_GUIDES[selectedGameId] || GAME_GUIDES['dual-n-back'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-white">Cognitive Science & Game Guide</h3>
              <span className="text-xs text-slate-400">
                Understand the plain-English mechanics and neural architecture behind every paradigm.
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Selector Horizontal Strip */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800/80 bg-slate-950/40 overflow-x-auto">
          {GAMES_CATALOG.map((g) => {
            const isSelected = g.id === selectedGameId;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGameId(g.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {g.title}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs md:text-sm">
          {/* Title & One-Line Subtitle */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{currentGuide.title}</h2>
            <p className="text-indigo-400 font-medium text-xs mb-3">{currentGuide.subtitle}</p>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {currentGuide.plainEnglishSummary}
            </p>
          </div>

          {/* Real-World Analogy & Everyday Benefit Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
                <Lightbulb className="w-4 h-4" />
                <span>Real-World Analogy</span>
              </div>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                {currentGuide.realWorldAnalogy}
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>How This Helps in Daily Life</span>
              </div>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                {currentGuide.realWorldBenefit}
              </p>
            </div>
          </div>

          {/* The Neural Machinery */}
          <div className="p-4 bg-indigo-950/20 rounded-xl border border-indigo-900/40">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
              <Brain className="w-4 h-4" />
              <span>Target Brain Machinery: {currentGuide.brainRegionDetail.name} ({currentGuide.brainRegionDetail.code})</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {currentGuide.brainRegionDetail.functionText}
            </p>
          </div>

          {/* Step-by-Step Instructions & Pro Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="font-semibold text-white block mb-2">How to Play Step-by-Step:</span>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                {currentGuide.howToPlaySteps.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="font-semibold text-amber-400 block mb-2">Pro Strategies & Cognitive Tips:</span>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                {currentGuide.proTips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Difficulty Scaling */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="font-semibold text-white block mb-2">Difficulty Scaling:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {currentGuide.difficultyDetails.map((diff, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="font-semibold text-indigo-400 block mb-0.5">{diff.name}</span>
                  <span className="text-slate-400 text-[11px] leading-tight block">{diff.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 hidden sm:inline">
            100% self-contained game module · Zero external dependencies
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
            >
              Close Guide
            </button>
            <button
              onClick={() => {
                onClose();
                onLaunchGame(selectedGameId);
              }}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch {currentGuide.title}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
