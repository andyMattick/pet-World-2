import React, { useState } from 'react';
import { GameDefinition } from '../types/game';
import { X, Copy, Check, Code2, Globe, Cpu, FileText } from 'lucide-react';

interface EmbedExportModalProps {
  game: GameDefinition | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedExportModal: React.FC<EmbedExportModalProps> = ({
  game,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'iframe' | 'react' | 'specs'>('iframe');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !game) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://neurosuite.app';
  const iframeUrl = `${currentOrigin}?game=${game.id}&embed=true`;

  const iframeSnippet = `<!-- Embed ${game.title} into your web application -->
<div style="width: 100%; max-width: 800px; height: 600px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
  <iframe
    src="${iframeUrl}"
    title="${game.title} - NeuroSuite Brain Game"
    width="100%"
    height="100%"
    frameborder="0"
    allow="autoplay"
    loading="lazy"
    style="border: none; display: block;"
  ></iframe>
</div>`;

  const reactSnippet = `// 1. Install lucide-react (if not already installed): npm i lucide-react
// 2. Import ${game.title} directly into your React / Next.js component:

import React from 'react';
import { ${game.id === 'dual-n-back' ? 'DualNBackGame' : game.id === 'stroop-clash' ? 'StroopClashGame' : game.id === 'chimp-memory' ? 'ChimpMemoryGame' : game.id === 'trail-making' ? 'TrailMakingGame' : game.id === 'speed-calc' ? 'SpeedCalcGame' : game.id === 'pattern-matrix' ? 'PatternMatrixGame' : game.id === 'flanker-task' ? 'FlankerTaskGame' : 'WordFluencyGame'} } from './games/${game.id === 'dual-n-back' ? 'DualNBackGame' : game.id === 'stroop-clash' ? 'StroopClashGame' : game.id === 'chimp-memory' ? 'ChimpMemoryGame' : game.id === 'trail-making' ? 'TrailMakingGame' : game.id === 'speed-calc' ? 'SpeedCalcGame' : game.id === 'pattern-matrix' ? 'PatternMatrixGame' : game.id === 'flanker-task' ? 'FlankerTaskGame' : 'WordFluencyGame'}';

export default function MyBrainTrainingPage() {
  const handleGameCompletion = (result) => {
    console.log('Cognitive metrics captured:', {
      gameId: result.gameId,
      score: result.score,
      accuracy: result.accuracy,
      reactionTimeMs: result.avgReactionTimeMs,
      completedAt: result.completedAt,
    });
    // Send to your backend or user profile database:
    // fetch('/api/user/cognitive-scores', { method: 'POST', body: JSON.stringify(result) });
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <${game.id === 'dual-n-back' ? 'DualNBackGame' : game.id === 'stroop-clash' ? 'StroopClashGame' : game.id === 'chimp-memory' ? 'ChimpMemoryGame' : game.id === 'trail-making' ? 'TrailMakingGame' : game.id === 'speed-calc' ? 'SpeedCalcGame' : game.id === 'pattern-matrix' ? 'PatternMatrixGame' : game.id === 'flanker-task' ? 'FlankerTaskGame' : 'WordFluencyGame'}
        difficulty="${game.difficultyLevels[0].id}"
        onGameEnd={handleGameCompletion}
        isEmbedded={true}
      />
    </div>
  );
}`;

  const currentCode = activeTab === 'iframe' ? iframeSnippet : reactSnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              Embed {game.title} Inside Your App
            </h3>
            <span className="text-xs text-slate-400">
              {game.primaryBrainRegion.name} · {game.primaryBrainRegion.anatomicalCode}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center px-6 pt-3 border-b border-slate-800 bg-slate-950/40 gap-4">
          <button
            onClick={() => setActiveTab('iframe')}
            className={`pb-3 text-xs md:text-sm font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'iframe'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            Iframe Snippet (Any Web App)
          </button>

          <button
            onClick={() => setActiveTab('react')}
            className={`pb-3 text-xs md:text-sm font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'react'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            React / Next.js Component
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs md:text-sm font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'specs'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Clinical Specs & API
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          {activeTab !== 'specs' ? (
            <div className="relative">
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 text-slate-300 overflow-x-auto leading-relaxed">
                <code>{currentCode}</code>
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer font-sans"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied to Clipboard' : 'Copy Code'}
              </button>
            </div>
          ) : (
            <div className="font-sans text-slate-300 space-y-4 text-xs md:text-sm">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-white block mb-1">Target Cognitive Domain</span>
                <p className="text-slate-400">{game.domainLabel}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-white block mb-1">Target Brain Region & Neuroplasticity Basis</span>
                <p className="text-slate-400 mb-2">{game.primaryBrainRegion.name} ({game.primaryBrainRegion.anatomicalCode})</p>
                <p className="text-slate-400 text-xs leading-relaxed">{game.clinicalBasis}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-white block mb-1">Recommended Dosage</span>
                <p className="text-indigo-400 font-mono text-xs">{game.dailyDosage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Zero external runtime keys required. Self-contained Web Audio & state machine.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer font-sans"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
