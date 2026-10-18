import { UserStats, GameDefinition, CognitiveDomain } from '../types/game';
import { GAMES_CATALOG } from '../data/gamesCatalog';

export interface DailyWorkoutStep {
  id: string;
  gameId: string;
  title: string;
  role: string;
  time: string;
  region: string;
  selectionReason: string;
  recommendedDifficulty: string;
}

export interface DynamicDailyWorkout {
  dateStr: string;
  themeTitle: string;
  themeDescription: string;
  steps: DailyWorkoutStep[];
}

// Day of week themes (0 = Sunday, 1 = Monday, etc.)
const DAY_THEMES = [
  {
    themeTitle: 'Sunday Spatial & Volumetric Consolidation',
    themeDescription: 'Consolidates 3D spatial representations and trajectory memory across parietal and cerebellar networks.',
    anchorGames: ['mental-rotation', 'corsi-block', 'pattern-matrix'],
  },
  {
    themeTitle: 'Monday Executive Control & Working Memory',
    themeDescription: 'Primes prefrontal executive buffers and selective inhibition for peak weekly focus.',
    anchorGames: ['dual-n-back', 'stroop-clash', 'card-sorting'],
  },
  {
    themeTitle: 'Tuesday Task-Switching & Motor Vigilance',
    themeDescription: 'Engages rapid mental set-shifting and the rIFG motor inhibitory brake.',
    anchorGames: ['trail-making', 'go-no-go', 'card-sorting'],
  },
  {
    themeTitle: 'Wednesday Synaptic Speed & Reflexes',
    themeDescription: 'Accelerates axonal reaction speeds, arithmetic agility, and peripheral noise suppression.',
    anchorGames: ['flanker-task', 'speed-calc', 'go-no-go'],
  },
  {
    themeTitle: 'Thursday Fluid Logic & Trajectory Span',
    themeDescription: 'Stimulates highest-order relational prefrontal logic (BA 10) and spatial path memory.',
    anchorGames: ['pattern-matrix', 'corsi-block', 'mental-rotation'],
  },
  {
    themeTitle: 'Friday Lexical & Semantic Fluency',
    themeDescription: 'Activates Broca\'s area, temporal semantic search, and rapid vocabulary synthesis.',
    anchorGames: ['word-fluency', 'stroop-clash', 'speed-calc'],
  },
  {
    themeTitle: 'Saturday Iconic & Spatial Precision',
    themeDescription: 'Sharpens photographic spatial mapping and 3D volumetric manipulation.',
    anchorGames: ['chimp-memory', 'mental-rotation', 'dual-n-back'],
  },
];

export const generateDynamicDailyWorkout = (stats: UserStats): DynamicDailyWorkout => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const dayOfWeek = now.getDay();
  const dayTheme = DAY_THEMES[dayOfWeek];

  // 1. Check if user has a prescribed path from the Baseline Diagnostic
  const prescribedGameIds = stats.baselineResult?.prescribedPath?.recommendedGameIds;

  // 2. Identify the lowest stimulated cognitive domain in stats
  const domainKeys = Object.keys(stats.domainStimulation) as CognitiveDomain[];
  const sortedDomains = [...domainKeys].sort(
    (a, b) => (stats.domainStimulation[a] || 0) - (stats.domainStimulation[b] || 0)
  );
  const lowestDomain = sortedDomains[0];
  const lowestDomainGame = GAMES_CATALOG.find(g => g.targetDomain === lowestDomain);

  // 3. Assemble 3 personalized games for today
  const selectedGameIds: string[] = [];
  const selectionReasons: Record<string, string> = {};

  // Step 1: Base Anchor from today's day-of-week theme OR baseline prescription
  let step1Id = prescribedGameIds ? prescribedGameIds[0] : dayTheme.anchorGames[0];
  selectedGameIds.push(step1Id);
  selectionReasons[step1Id] = prescribedGameIds
    ? 'Prescribed by your Baseline Diagnostic profile'
    : `Day-of-Week Focus: ${dayTheme.themeTitle}`;

  // Step 2: Deficit Target (Lowest score/stimulation)
  let step2Id = lowestDomainGame && !selectedGameIds.includes(lowestDomainGame.id)
    ? lowestDomainGame.id
    : dayTheme.anchorGames[1];

  if (selectedGameIds.includes(step2Id)) {
    // Pick another from anchor games
    step2Id = dayTheme.anchorGames.find(g => !selectedGameIds.includes(g)) || 'stroop-clash';
  }
  selectedGameIds.push(step2Id);
  selectionReasons[step2Id] = lowestDomainGame && lowestDomainGame.id === step2Id
    ? `Adaptive Target: Your ${lowestDomainGame.domainLabel} has the lowest activity (${stats.domainStimulation[lowestDomain] || 0} pts)`
    : 'Selected for executive balance';

  // Step 3: Complementary Cognitive Challenge
  let step3Id = dayTheme.anchorGames.find(g => !selectedGameIds.includes(g)) || 'chimp-memory';
  if (prescribedGameIds && prescribedGameIds[2] && !selectedGameIds.includes(prescribedGameIds[2])) {
    step3Id = prescribedGameIds[2];
  }
  selectedGameIds.push(step3Id);
  selectionReasons[step3Id] = 'Selected to complete daily frontoparietal synchronization';

  // Build the 3 steps
  const steps: DailyWorkoutStep[] = selectedGameIds.map((gameId, idx) => {
    const gameDef = GAMES_CATALOG.find(g => g.id === gameId) || GAMES_CATALOG[0];
    const userGameStat = stats.scoresByGame[gameId];

    // Adaptive difficulty based on user's past score in this game
    let recDiff = gameDef.difficultyLevels[0].id;
    if (userGameStat && userGameStat.highScore >= 800 && gameDef.difficultyLevels.length > 2) {
      recDiff = gameDef.difficultyLevels[2].id;
    } else if (userGameStat && userGameStat.highScore >= 400 && gameDef.difficultyLevels.length > 1) {
      recDiff = gameDef.difficultyLevels[1].id;
    }

    const timeEstimates = ['3 mins', '2 mins', '2 mins'];

    return {
      id: `step-${idx + 1}-${gameId}`,
      gameId,
      title: gameDef.title,
      role: idx === 0 ? 'Foundation Priming' : idx === 1 ? 'Targeted Circuit' : 'Consolidation',
      time: timeEstimates[idx] || '2 mins',
      region: `${gameDef.primaryBrainRegion.name} (${gameDef.primaryBrainRegion.anatomicalCode})`,
      selectionReason: selectionReasons[gameId] || 'Balanced cognitive training',
      recommendedDifficulty: recDiff,
    };
  });

  return {
    dateStr,
    themeTitle: dayTheme.themeTitle,
    themeDescription: dayTheme.themeDescription,
    steps,
  };
};
