import React from 'react';
import { UserStats, CognitiveDomain } from '../types/game';
import { Brain, Activity, ShieldCheck, Zap } from 'lucide-react';

interface PathwayMapProps {
  stats: UserStats;
  onSelectGameForDomain: (domain: CognitiveDomain) => void;
}

interface PathwayInfo {
  domain: CognitiveDomain;
  label: string;
  regionName: string;
  code: string;
  gameTitle: string;
  gameId: string;
  colorClass: string;
  barColorClass: string;
}

const PATHWAYS: PathwayInfo[] = [
  {
    domain: 'working_memory',
    label: 'Working Memory',
    regionName: 'Dorsolateral Prefrontal Cortex',
    code: 'BA 9/46',
    gameTitle: 'Dual N-Back',
    gameId: 'dual-n-back',
    colorClass: 'text-indigo-400',
    barColorClass: 'bg-indigo-500',
  },
  {
    domain: 'inhibitory_control',
    label: 'Inhibitory Control',
    regionName: 'Anterior Cingulate Cortex',
    code: 'BA 24/32',
    gameTitle: 'Stroop Color Clash',
    gameId: 'stroop-clash',
    colorClass: 'text-rose-400',
    barColorClass: 'bg-rose-500',
  },
  {
    domain: 'visuospatial',
    label: 'Visuospatial Memory',
    regionName: 'Parieto-Hippocampal Complex',
    code: 'BA 7 / CA1',
    gameTitle: 'Chimp Spatial Span',
    gameId: 'chimp-memory',
    colorClass: 'text-amber-400',
    barColorClass: 'bg-amber-500',
  },
  {
    domain: 'cognitive_flexibility',
    label: 'Cognitive Flexibility',
    regionName: 'Frontoparietal Control Hub',
    code: 'BA 8/9/40',
    gameTitle: 'Trail Making Switch',
    gameId: 'trail-making',
    colorClass: 'text-teal-400',
    barColorClass: 'bg-teal-500',
  },
  {
    domain: 'numerical_fluency',
    label: 'Numerical Calculation',
    regionName: 'Intraparietal Sulcus',
    code: 'BA 39/40',
    gameTitle: 'Speed Calculation',
    gameId: 'speed-calc',
    colorClass: 'text-cyan-400',
    barColorClass: 'bg-cyan-500',
  },
  {
    domain: 'inductive_reasoning',
    label: 'Fluid Induction',
    regionName: 'Rostrolateral Prefrontal Cortex',
    code: 'BA 10',
    gameTitle: 'Pattern Matrix',
    gameId: 'pattern-matrix',
    colorClass: 'text-violet-400',
    barColorClass: 'bg-violet-500',
  },
  {
    domain: 'processing_speed',
    label: 'Processing Speed',
    regionName: 'Pre-Supplementary Motor Area',
    code: 'BA 6/8',
    gameTitle: 'Signal & Flanker',
    gameId: 'flanker-task',
    colorClass: 'text-orange-400',
    barColorClass: 'bg-orange-500',
  },
  {
    domain: 'verbal_fluency',
    label: 'Verbal Fluency',
    regionName: 'Broca\'s Area & Temporal Hub',
    code: 'BA 44/45',
    gameTitle: 'Lexical Fluency',
    gameId: 'word-fluency',
    colorClass: 'text-pink-400',
    barColorClass: 'bg-pink-500',
  },
  {
    domain: 'sequential_visuospatial',
    label: 'Spatial Sequence Buffer',
    regionName: 'Superior Parietal Lobule & Cerebellum',
    code: 'BA 7 & Cerebellar Loops',
    gameTitle: 'Corsi Block Span',
    gameId: 'corsi-block',
    colorClass: 'text-sky-400',
    barColorClass: 'bg-sky-500',
  },
  {
    domain: 'sustained_vigilance',
    label: 'Motor Brake & Vigilance',
    regionName: 'Right Inferior Frontal Gyrus (rIFG)',
    code: 'BA 47/44',
    gameTitle: 'Go / No-Go Vigilance',
    gameId: 'go-no-go',
    colorClass: 'text-lime-400',
    barColorClass: 'bg-lime-500',
  },
  {
    domain: 'spatial_rotation',
    label: '3D Spatial Transformation',
    regionName: 'Superior Parietal Lobule',
    code: 'BA 7 / SPL',
    gameTitle: 'Mental 3D Rotation',
    gameId: 'mental-rotation',
    colorClass: 'text-emerald-400',
    barColorClass: 'bg-emerald-500',
  },
  {
    domain: 'rule_induction',
    label: 'Rule Induction & Shift',
    regionName: 'Orbitofrontal Cortex & Striatum',
    code: 'BA 11 & Caudate',
    gameTitle: 'Neuro Card Sort (WCST)',
    gameId: 'card-sorting',
    colorClass: 'text-purple-400',
    barColorClass: 'bg-purple-500',
  },
];

export const NeuralPathwayMap: React.FC<PathwayMapProps> = ({
  stats,
  onSelectGameForDomain,
}) => {
  const totalStimulation = Object.values(stats.domainStimulation).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <Brain className="w-6 h-6 text-indigo-400" />
            Neural Pathway Stimulation Map
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Tracks neuroplastic activation across the 8 primary human cognitive brain networks.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400 font-mono">
          <div>
            <span className="block text-slate-500">Sessions</span>
            <span className="text-base font-bold text-white tabular-nums">{stats.totalSessions}</span>
          </div>
          <div>
            <span className="block text-slate-500">Neuro Index</span>
            <span className="text-base font-bold text-indigo-400 tabular-nums">{totalStimulation} pts</span>
          </div>
        </div>
      </div>

      {/* Pathways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {PATHWAYS.map((pathway) => {
          const points = stats.domainStimulation[pathway.domain] || 0;
          // Scale from 0 to 100 for visual bar
          const fillPercent = Math.min(100, Math.round((points / 60) * 100));

          return (
            <div
              key={pathway.domain}
              className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-white text-sm">
                    {pathway.label}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {pathway.code}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-3">
                  <span className={pathway.colorClass}>{pathway.regionName}</span>
                </div>
              </div>

              <div>
                {/* Activation meter */}
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full ${pathway.barColorClass} transition-all duration-300`}
                    style={{ width: `${Math.max(4, fillPercent)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-900">
                  <span className="text-slate-500 font-mono">
                    {points} pts stimulated
                  </span>
                  <button
                    onClick={() => onSelectGameForDomain(pathway.domain)}
                    className="text-slate-300 hover:text-white font-medium hover:underline cursor-pointer"
                  >
                    Play {pathway.gameTitle} →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
