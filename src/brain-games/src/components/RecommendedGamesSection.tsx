import React, { useMemo } from 'react';
import { UserStats, GameDefinition, CognitiveDomain } from '../types/game';
import { GAMES_CATALOG } from '../data/gamesCatalog';
import { ACHIEVEMENTS } from '../data/achievementsCatalog';
import { Sparkles, Play, Target, Compass, Zap } from 'lucide-react';

interface RecommendedGamesProps {
  stats: UserStats;
  onSelectGame: (gameId: string) => void;
}

interface RecommendationItem {
  id: string;
  game: GameDefinition;
  badgeLabel: string;
  title: string;
  reason: string;
  actionText: string;
  accentColor: string;
}

export const RecommendedGamesSection: React.FC<RecommendedGamesProps> = ({
  stats,
  onSelectGame,
}) => {
  const recommendations: RecommendationItem[] = useMemo(() => {
    const list: RecommendationItem[] = [];

    // 1. Identify domain with lowest stimulation points
    const domains = Object.keys(stats.domainStimulation) as CognitiveDomain[];
    const sortedByStim = [...domains].sort(
      (a, b) => (stats.domainStimulation[a] || 0) - (stats.domainStimulation[b] || 0)
    );
    const lowestDomain = sortedByStim[0];
    const lowestGame = GAMES_CATALOG.find(g => g.targetDomain === lowestDomain);

    if (lowestGame) {
      list.push({
        id: 'rec-balance',
        game: lowestGame,
        badgeLabel: 'Whole-Brain Balance',
        title: `Activate ${lowestGame.primaryBrainRegion.name}`,
        reason: `Your ${lowestGame.domainLabel} has the lowest stimulation points (${stats.domainStimulation[lowestDomain] || 0} pts). Train to maintain balanced neuroplasticity.`,
        actionText: 'Balance Circuit',
        accentColor: 'indigo',
      });
    }

    // 2. Identify nearest milestone achievement
    const unlockedSet = new Set(stats.unlockedAchievementIds || []);
    let nearestAchievement = null;
    let highestProgress = -1;

    for (const ach of ACHIEVEMENTS) {
      if (!unlockedSet.has(ach.id)) {
        const evalRes = ach.check(stats);
        if (evalRes.progress > highestProgress && evalRes.progress < 100) {
          highestProgress = evalRes.progress;
          nearestAchievement = { ach, evalRes };
        }
      }
    }

    if (nearestAchievement) {
      // Pick appropriate game for this achievement
      let targetGame = GAMES_CATALOG[1]; // default Stroop
      if (nearestAchievement.ach.id.includes('chimp')) {
        targetGame = GAMES_CATALOG.find(g => g.id === 'chimp-memory') || targetGame;
      } else if (nearestAchievement.ach.id.includes('streak')) {
        targetGame = GAMES_CATALOG.find(g => g.id === 'stroop-clash') || targetGame;
      } else if (nearestAchievement.ach.id.includes('score')) {
        targetGame = GAMES_CATALOG.find(g => g.id === 'speed-calc') || targetGame;
      }

      list.push({
        id: 'rec-milestone',
        game: targetGame,
        badgeLabel: 'Nearest Milestone',
        title: `Unlock "${nearestAchievement.ach.title}"`,
        reason: `You're at ${nearestAchievement.evalRes.label} (${nearestAchievement.evalRes.progress}%). One strong session will claim this honor.`,
        actionText: 'Chase Milestone',
        accentColor: 'amber',
      });
    } else {
      // High score challenge recommendation
      const stroopGame = GAMES_CATALOG.find(g => g.id === 'stroop-clash') || GAMES_CATALOG[0];
      list.push({
        id: 'rec-highscore',
        game: stroopGame,
        badgeLabel: 'Reflex Speed',
        title: 'Push Synaptic Velocity in Stroop Clash',
        reason: 'Overcome habitual reading impulses and maximize your reaction speed multiplier.',
        actionText: 'Speed Run',
        accentColor: 'amber',
      });
    }

    // 3. Fluid Reasoning / Working Memory Core
    const nbackGame = GAMES_CATALOG.find(g => g.id === 'dual-n-back') || GAMES_CATALOG[0];
    list.push({
      id: 'rec-core',
      game: nbackGame,
      badgeLabel: 'Clinical Gold Standard',
      title: 'Dual N-Back Executive Load',
      reason: 'Gold-standard working memory paradigm (PNAS) to remodel the frontoparietal central executive network.',
      actionText: 'Train Executive Buffer',
      accentColor: 'emerald',
    });

    return list.slice(0, 3);
  }, [stats]);

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-3">
        <Compass className="w-5 h-5 text-indigo-400" />
        <h2 className="text-base md:text-lg font-bold text-white">Recommended for Your Neural Profile</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all duration-200"
          >
            <div>
              {/* Unboxed category kicker */}
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{rec.badgeLabel}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400 font-normal">{rec.game.primaryBrainRegion.anatomicalCode}</span>
              </div>

              <h3 className="text-sm md:text-base font-bold text-white mb-1.5">
                {rec.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {rec.reason}
              </p>
            </div>

            <button
              onClick={() => onSelectGame(rec.game.id)}
              className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
            >
              <Play className="w-3.5 h-3.5 fill-white text-white group-hover:scale-110 transition-transform" />
              <span>{rec.actionText} ({rec.game.title})</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
