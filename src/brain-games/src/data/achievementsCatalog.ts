import { Achievement, UserStats, GameResult } from '../types/game';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-synapse',
    title: 'First Synapse',
    description: 'Complete your first cognitive game session.',
    category: 'mastery',
    tier: 'bronze',
    icon: 'Sparkles',
    neurologicalBenefit: 'Initiates immediate blood flow and cerebral glucose delivery to active cortical networks.',
    check: (stats) => {
      const current = stats.totalSessions;
      const max = 1;
      return {
        isUnlocked: current >= max,
        progress: Math.min(100, Math.round((current / max) * 100)),
        current,
        max,
        label: `${Math.min(current, max)} / ${max} session`,
      };
    },
  },
  {
    id: 'streak-focus-5',
    title: 'Synaptic Lock',
    description: 'Achieve a 5-answer unbroken streak in any game.',
    category: 'streak',
    tier: 'bronze',
    icon: 'Zap',
    neurologicalBenefit: 'Dopaminergic signaling reinforces sustained attention circuits in the basal ganglia.',
    check: (stats, latest) => {
      let highestPeak = 0;
      Object.values(stats.scoresByGame).forEach(g => {
        if (g.peakStreak && g.peakStreak > highestPeak) highestPeak = g.peakStreak;
      });
      if (latest?.peakStreak && latest.peakStreak > highestPeak) highestPeak = latest.peakStreak;
      const max = 5;
      return {
        isUnlocked: highestPeak >= max,
        progress: Math.min(100, Math.round((highestPeak / max) * 100)),
        current: highestPeak,
        max,
        label: `${Math.min(highestPeak, max)} / ${max} streak`,
      };
    },
  },
  {
    id: 'century-scorer',
    title: 'Century Scorer',
    description: 'Score 500 or more points in a single session.',
    category: 'score',
    tier: 'bronze',
    icon: 'Trophy',
    neurologicalBenefit: 'Indicates high information throughput across frontoparietal memory buffers.',
    check: (stats, latest) => {
      let maxScore = 0;
      Object.values(stats.scoresByGame).forEach(g => {
        if (g.highScore > maxScore) maxScore = g.highScore;
      });
      if (latest && latest.score > maxScore) maxScore = latest.score;
      const max = 500;
      return {
        isUnlocked: maxScore >= max,
        progress: Math.min(100, Math.round((maxScore / max) * 100)),
        current: maxScore,
        max,
        label: `${Math.min(maxScore, max)} / ${max} pts`,
      };
    },
  },
  {
    id: 'consecutive-games-3',
    title: 'Circuit Check-In',
    description: 'Complete 3 consecutive games in a single day.',
    category: 'consecutive',
    tier: 'silver',
    icon: 'Layers',
    neurologicalBenefit: 'Cross-stimulates complementary brain regions to induce neuroplastic potentiation.',
    check: (stats) => {
      const current = stats.consecutiveGamesToday;
      const max = 3;
      return {
        isUnlocked: current >= max,
        progress: Math.min(100, Math.round((current / max) * 100)),
        current,
        max,
        label: `${Math.min(current, max)} / ${max} games today`,
      };
    },
  },
  {
    id: 'streak-zen-10',
    title: 'Flow State Master',
    description: 'Hit a 10-answer unbroken streak in Stroop or Speed Calc.',
    category: 'streak',
    tier: 'silver',
    icon: 'Flame',
    neurologicalBenefit: 'Sustained cognitive inhibition without intrusion of automatic habitual errors.',
    check: (stats, latest) => {
      let highestPeak = 0;
      ['stroop-clash', 'speed-calc', 'flanker-task'].forEach(id => {
        const g = stats.scoresByGame[id];
        if (g?.peakStreak && g.peakStreak > highestPeak) highestPeak = g.peakStreak;
      });
      if (latest && ['stroop-clash', 'speed-calc', 'flanker-task'].includes(latest.gameId)) {
        if (latest.peakStreak && latest.peakStreak > highestPeak) highestPeak = latest.peakStreak;
      }
      const max = 10;
      return {
        isUnlocked: highestPeak >= max,
        progress: Math.min(100, Math.round((highestPeak / max) * 100)),
        current: highestPeak,
        max,
        label: `${Math.min(highestPeak, max)} / ${max} streak`,
      };
    },
  },
  {
    id: 'score-surge-1000',
    title: 'Synaptic Surge',
    description: 'Attain 1,000+ points in any single game.',
    category: 'score',
    tier: 'silver',
    icon: 'Award',
    neurologicalBenefit: 'Demonstrates elevated synaptic speed and exceptional executive accuracy.',
    check: (stats, latest) => {
      let maxScore = 0;
      Object.values(stats.scoresByGame).forEach(g => {
        if (g.highScore > maxScore) maxScore = g.highScore;
      });
      if (latest && latest.score > maxScore) maxScore = latest.score;
      const max = 1000;
      return {
        isUnlocked: maxScore >= max,
        progress: Math.min(100, Math.round((maxScore / max) * 100)),
        current: maxScore,
        max,
        label: `${Math.min(maxScore, max)} / ${max} pts`,
      };
    },
  },
  {
    id: 'consecutive-days-3',
    title: 'Neural Habit',
    description: 'Train on 3 consecutive days.',
    category: 'consecutive',
    tier: 'silver',
    icon: 'Calendar',
    neurologicalBenefit: 'Daily consistency consolidates dendritic spine remodeling during sleep phases.',
    check: (stats) => {
      const current = stats.consecutiveDaysStreak;
      const max = 3;
      return {
        isUnlocked: current >= max,
        progress: Math.min(100, Math.round((current / max) * 100)),
        current,
        max,
        label: `${Math.min(current, max)} / ${max} days`,
      };
    },
  },
  {
    id: 'chimp-photographic',
    title: 'Photographic Index',
    description: 'Score 800+ or clear 6+ items in Chimp Spatial Span.',
    category: 'mastery',
    tier: 'silver',
    icon: 'Eye',
    neurologicalBenefit: 'Engages rapid iconic visual memory buffers in the parieto-occipital sulcus.',
    check: (stats, latest) => {
      const chimp = stats.scoresByGame['chimp-memory'];
      let score = chimp?.highScore || 0;
      if (latest?.gameId === 'chimp-memory' && latest.score > score) score = latest.score;
      const max = 800;
      return {
        isUnlocked: score >= max,
        progress: Math.min(100, Math.round((score / max) * 100)),
        current: score,
        max,
        label: `${Math.min(score, max)} / ${max} pts`,
      };
    },
  },
  {
    id: 'lightning-reflexes',
    title: 'Lightning Reflexes',
    description: 'Record an average reaction time below 500ms with >= 85% accuracy.',
    category: 'mastery',
    tier: 'silver',
    icon: 'Activity',
    neurologicalBenefit: 'Accelerates saltatory conduction along myelinated motor axons.',
    check: (stats, latest) => {
      let qualifies = false;
      let bestRt = 9999;
      Object.values(stats.scoresByGame).forEach(g => {
        if (g.bestReactionTime < bestRt) bestRt = g.bestReactionTime;
        if (g.bestReactionTime > 0 && g.bestReactionTime <= 500 && g.bestAccuracy >= 85) qualifies = true;
      });
      if (latest && latest.avgReactionTimeMs <= 500 && latest.accuracy >= 85) qualifies = true;
      return {
        isUnlocked: qualifies,
        progress: qualifies ? 100 : bestRt < 9999 ? Math.min(95, Math.round((500 / bestRt) * 100)) : 20,
        current: bestRt < 9999 ? bestRt : 0,
        max: 500,
        label: qualifies ? 'Sub-500ms Achieved' : bestRt < 9999 ? `${bestRt} ms` : '500 ms target',
      };
    },
  },
  {
    id: 'whole-brain-stim',
    title: 'Holocognitive Master',
    description: 'Stimulate all 8 cognitive neural pathways.',
    category: 'mastery',
    tier: 'gold',
    icon: 'Brain',
    neurologicalBenefit: 'Ensures balanced whole-brain synaptic maintenance across all 4 cerebral lobes.',
    check: (stats) => {
      const stimulatedDomains = Object.values(stats.domainStimulation).filter(pts => pts > 0).length;
      const max = 8;
      return {
        isUnlocked: stimulatedDomains >= max,
        progress: Math.min(100, Math.round((stimulatedDomains / max) * 100)),
        current: stimulatedDomains,
        max,
        label: `${stimulatedDomains} / ${max} pathways stimulated`,
      };
    },
  },
  {
    id: 'consecutive-days-7',
    title: 'Neuroplasticity Protocol',
    description: 'Train on 7 consecutive days.',
    category: 'consecutive',
    tier: 'gold',
    icon: 'ShieldCheck',
    neurologicalBenefit: 'Long-term potentiation (LTP) permanently elevates baseline cognitive reserve.',
    check: (stats) => {
      const current = stats.consecutiveDaysStreak;
      const max = 7;
      return {
        isUnlocked: current >= max,
        progress: Math.min(100, Math.round((current / max) * 100)),
        current,
        max,
        label: `${Math.min(current, max)} / ${max} days`,
      };
    },
  },
  {
    id: 'grandmaster-1500',
    title: 'Prefrontal Grandmaster',
    description: 'Achieve a pinnacle score of 1,500+ points in any game.',
    category: 'score',
    tier: 'platinum',
    icon: 'Crown',
    neurologicalBenefit: 'Peak executive synchronization across the entire central executive network.',
    check: (stats, latest) => {
      let maxScore = 0;
      Object.values(stats.scoresByGame).forEach(g => {
        if (g.highScore > maxScore) maxScore = g.highScore;
      });
      if (latest && latest.score > maxScore) maxScore = latest.score;
      const max = 1500;
      return {
        isUnlocked: maxScore >= max,
        progress: Math.min(100, Math.round((maxScore / max) * 100)),
        current: maxScore,
        max,
        label: `${Math.min(maxScore, max)} / ${max} pts`,
      };
    },
  },
];
