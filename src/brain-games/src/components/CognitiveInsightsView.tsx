import React, { useState, useMemo } from 'react';
import { UserStats, CognitiveDomain, GameDefinition } from '../types/game';
import { GAMES_CATALOG } from '../data/gamesCatalog';
import {
  Brain,
  TrendingUp,
  Activity,
  Zap,
  Target,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Download,
  Copy,
  Check,
  BarChart3,
  Compass,
  Award,
  Layers,
  ChevronRight,
  Info,
  Calendar,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

interface CognitiveInsightsViewProps {
  stats: UserStats;
  onBackToCatalog: () => void;
  onSelectGame: (gameId: string) => void;
}

export interface RegionPerformanceSummary {
  regionName: string;
  code: string;
  description: string;
  games: GameDefinition[];
  networkGroup: 'Executive & Prefrontal' | 'Inhibitory & Salience' | 'Parietal & Spatial' | 'Linguistic & Semantic';
  sessionsCount: number;
  totalScore: number;
  highScore: number;
  avgAccuracy: number;
  avgReactionTimeMs: number;
  stimulationPoints: number;
  compositeEfficiency: number; // 0 - 100
  trendStatus: 'optimal' | 'accelerating' | 'developing' | 'dormant';
  keyCognitiveFunction: string;
}

export const CognitiveInsightsView: React.FC<CognitiveInsightsViewProps> = ({
  stats,
  onBackToCatalog,
  onSelectGame,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | '7days' | '30days'>('all');
  const [selectedRegionCode, setSelectedRegionCode] = useState<string | null>(null);
  const [activeMetricTab, setActiveMetricTab] = useState<'composite' | 'accuracy' | 'speed' | 'stimulation'>('composite');
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Filter session history based on timeframe
  const filteredHistory = useMemo(() => {
    const history = stats.sessionHistory || [];
    if (selectedTimeframe === 'all') return history;

    const now = new Date().getTime();
    const daysLimit = selectedTimeframe === '7days' ? 7 : 30;
    const msLimit = daysLimit * 24 * 60 * 60 * 1000;

    return history.filter(s => {
      const sessionTime = new Date(s.timestamp).getTime();
      return now - sessionTime <= msLimit;
    });
  }, [stats.sessionHistory, selectedTimeframe]);

  // Correlate game performance with targeted brain regions
  const regionalSummaries = useMemo<RegionPerformanceSummary[]>(() => {
    const regionMap = new Map<string, RegionPerformanceSummary>();

    // Seed regions from GAMES_CATALOG
    GAMES_CATALOG.forEach(game => {
      const code = game.primaryBrainRegion.anatomicalCode;
      if (!regionMap.has(code)) {
        // Classify network group
        let networkGroup: RegionPerformanceSummary['networkGroup'] = 'Executive & Prefrontal';
        if (code.includes('24/32') || code.includes('47/44') || code.includes('6/8')) {
          networkGroup = 'Inhibitory & Salience';
        } else if (code.includes('7') || code.includes('39/40')) {
          networkGroup = 'Parietal & Spatial';
        } else if (code.includes('44/45') || code.includes('8/9/40')) {
          networkGroup = 'Linguistic & Semantic';
        }

        regionMap.set(code, {
          regionName: game.primaryBrainRegion.name,
          code,
          description: game.primaryBrainRegion.description,
          games: [],
          networkGroup,
          sessionsCount: 0,
          totalScore: 0,
          highScore: 0,
          avgAccuracy: 0,
          avgReactionTimeMs: 0,
          stimulationPoints: 0,
          compositeEfficiency: 0,
          trendStatus: 'dormant',
          keyCognitiveFunction: game.domainLabel,
        });
      }

      const entry = regionMap.get(code)!;
      if (!entry.games.some(g => g.id === game.id)) {
        entry.games.push(game);
      }
    });

    // Populate metrics using filteredHistory and stats
    const regionMetrics = new Map<string, { accuracies: number[]; reactionTimes: number[]; scores: number[] }>();

    filteredHistory.forEach(session => {
      const gameDef = GAMES_CATALOG.find(g => g.id === session.gameId);
      if (gameDef) {
        const code = gameDef.primaryBrainRegion.anatomicalCode;
        if (!regionMetrics.has(code)) {
          regionMetrics.set(code, { accuracies: [], reactionTimes: [], scores: [] });
        }
        const data = regionMetrics.get(code)!;
        data.accuracies.push(session.accuracy);
        if (session.reactionTimeMs > 0) data.reactionTimes.push(session.reactionTimeMs);
        data.scores.push(session.score);
      }
    });

    // Compute regional values
    regionMap.forEach((summary, code) => {
      const metrics = regionMetrics.get(code);
      let stimulation = 0;

      // Accumulate domain stimulation points
      summary.games.forEach(g => {
        stimulation += stats.domainStimulation?.[g.targetDomain] || 0;
        const gameStats = stats.scoresByGame?.[g.id];
        if (gameStats) {
          if (gameStats.highScore > summary.highScore) {
            summary.highScore = gameStats.highScore;
          }
        }
      });
      summary.stimulationPoints = stimulation;

      if (metrics && metrics.accuracies.length > 0) {
        summary.sessionsCount = metrics.accuracies.length;
        summary.totalScore = metrics.scores.reduce((a, b) => a + b, 0);
        summary.avgAccuracy = Math.round(metrics.accuracies.reduce((a, b) => a + b, 0) / metrics.accuracies.length);
        summary.avgReactionTimeMs = metrics.reactionTimes.length > 0
          ? Math.round(metrics.reactionTimes.reduce((a, b) => a + b, 0) / metrics.reactionTimes.length)
          : 0;

        // Composite Efficiency algorithm: 50% accuracy + 30% speed score (faster = higher, clamped at 300ms - 1500ms) + 20% consistency
        let speedNormalized = 50;
        if (summary.avgReactionTimeMs > 0) {
          speedNormalized = Math.max(10, Math.min(100, Math.round(100 - ((summary.avgReactionTimeMs - 300) / 12))));
        }
        const sessionWeight = Math.min(100, summary.sessionsCount * 25);
        summary.compositeEfficiency = Math.round(
          summary.avgAccuracy * 0.5 + speedNormalized * 0.3 + sessionWeight * 0.2
        );

        if (summary.compositeEfficiency >= 80 && summary.sessionsCount >= 2) {
          summary.trendStatus = 'optimal';
        } else if (summary.sessionsCount >= 1) {
          summary.trendStatus = 'accelerating';
        } else {
          summary.trendStatus = 'developing';
        }
      } else {
        // Fallback check against stats.scoresByGame even if no sessionHistory items
        let fallbackSessions = 0;
        let fallbackAccuracySum = 0;
        let fallbackRtSum = 0;
        let fallbackRtCount = 0;

        summary.games.forEach(g => {
          const gameStats = stats.scoresByGame?.[g.id];
          if (gameStats && gameStats.sessionsPlayed > 0) {
            fallbackSessions += gameStats.sessionsPlayed;
            fallbackAccuracySum += gameStats.bestAccuracy;
            if (gameStats.bestReactionTime > 0) {
              fallbackRtSum += gameStats.bestReactionTime;
              fallbackRtCount++;
            }
          }
        });

        if (fallbackSessions > 0) {
          summary.sessionsCount = fallbackSessions;
          summary.avgAccuracy = Math.round(fallbackAccuracySum / summary.games.length);
          summary.avgReactionTimeMs = fallbackRtCount > 0 ? Math.round(fallbackRtSum / fallbackRtCount) : 0;
          summary.compositeEfficiency = Math.round(summary.avgAccuracy * 0.7 + Math.min(30, fallbackSessions * 10));
          summary.trendStatus = summary.compositeEfficiency > 70 ? 'accelerating' : 'developing';
        } else {
          summary.trendStatus = 'dormant';
          summary.compositeEfficiency = 0;
        }
      }
    });

    return Array.from(regionMap.values()).sort((a, b) => b.compositeEfficiency - a.compositeEfficiency);
  }, [filteredHistory, stats]);

  // Selected region details
  const activeRegion = useMemo(() => {
    if (!selectedRegionCode) return regionalSummaries[0] || null;
    return regionalSummaries.find(r => r.code === selectedRegionCode) || regionalSummaries[0] || null;
  }, [regionalSummaries, selectedRegionCode]);

  // Textual Analysis Synthesis Engine
  const textualAnalysis = useMemo(() => {
    const totalSessions = stats.totalSessions;
    const history = stats.sessionHistory || [];
    const stimulatedCount = regionalSummaries.filter(r => r.sessionsCount > 0 || r.stimulationPoints > 0).length;
    const topRegions = regionalSummaries.filter(r => r.trendStatus === 'optimal' || r.trendStatus === 'accelerating');
    const dormantRegions = regionalSummaries.filter(r => r.trendStatus === 'dormant' || r.sessionsCount === 0);

    // Global speed and accuracy
    const overallAvgAccuracy = history.length > 0
      ? Math.round(history.reduce((a, b) => a + b.accuracy, 0) / history.length)
      : (stats.baselineResult ? stats.baselineResult.overallScore : 0);

    const validRts = history.map(h => h.reactionTimeMs).filter(rt => rt > 0);
    const overallAvgRt = validRts.length > 0
      ? Math.round(validRts.reduce((a, b) => a + b, 0) / validRts.length)
      : 0;

    // Speed-accuracy tradeoff calculation
    let cognitiveStyle = 'Balanced Speed & Deliberate Control';
    if (overallAvgAccuracy >= 88 && overallAvgRt > 750) {
      cognitiveStyle = 'High-Precision Analytical (Deliberate Accuracy Preference)';
    } else if (overallAvgAccuracy < 75 && overallAvgRt < 500 && overallAvgRt > 0) {
      cognitiveStyle = 'High-Velocity Rapid Reflex (Prone to Impulsive Interference)';
    } else if (overallAvgAccuracy >= 85 && overallAvgRt < 600 && overallAvgRt > 0) {
      cognitiveStyle = 'Peak Flow State (Optimal Synaptic Efficiency & Reflexive Mastery)';
    }

    // Health trend status
    let healthTrajectory = 'Baseline Formative Phase';
    let trajectoryDescription = 'Initial cognitive telemetry is establishing your personal synaptic baseline across frontoparietal networks.';
    if (totalSessions >= 10 && stats.consecutiveDaysStreak >= 3) {
      healthTrajectory = 'Robust Neuroplastic Adaptation';
      trajectoryDescription = 'Strong synaptic consolidation with compounding multi-day streak consistency. Cortical activation shows balanced cross-hemispheric recruitment.';
    } else if (totalSessions >= 5) {
      healthTrajectory = 'Progressive Synaptic Acceleration';
      trajectoryDescription = 'Clear performance gains evident across trained paradigms. Response latencies are tightening while accuracy metrics stabilize.';
    }

    // Identify primary strength and growth bottleneck
    const strongest = topRegions.length > 0 ? topRegions[0] : regionalSummaries[0];
    const growthTarget = dormantRegions.length > 0 ? dormantRegions[0] : regionalSummaries[regionalSummaries.length - 1];

    // Prescriptive regimen
    const recommendedGame = growthTarget?.games[0] || GAMES_CATALOG[0];

    return {
      healthTrajectory,
      trajectoryDescription,
      cognitiveStyle,
      overallAvgAccuracy,
      overallAvgRt,
      stimulatedCount,
      totalRegionsCount: regionalSummaries.length,
      strongest,
      growthTarget,
      recommendedGame,
      topRegions,
      dormantRegions,
    };
  }, [regionalSummaries, stats]);

  const handleCopyReport = () => {
    const text = `=== NEUROSUITE COGNITIVE HEALTH & REGIONAL INSIGHTS REPORT ===
Generated: ${new Date().toLocaleDateString()}
Total Sessions Logged: ${stats.totalSessions} | Training Time: ${Math.round(stats.totalTimeSeconds / 60)} mins
Current Streak: ${stats.consecutiveDaysStreak} days

1. CLINICAL TRAJECTORY SUMMARY
Status: ${textualAnalysis.healthTrajectory}
Overview: ${textualAnalysis.trajectoryDescription}
Cognitive Processing Style: ${textualAnalysis.cognitiveStyle}
Mean Global Accuracy: ${textualAnalysis.overallAvgAccuracy}%
Mean Reaction Latency: ${textualAnalysis.overallAvgRt > 0 ? `${textualAnalysis.overallAvgRt} ms` : 'Uncalibrated'}

2. PRIMARY REGIONAL CORRELATION
- Strongest Cortical Hub: ${textualAnalysis.strongest.regionName} (${textualAnalysis.strongest.code})
  Efficiency Index: ${textualAnalysis.strongest.compositeEfficiency}/100 | Accuracy: ${textualAnalysis.strongest.avgAccuracy}%
- Identified Recruitment Target: ${textualAnalysis.growthTarget.regionName} (${textualAnalysis.growthTarget.code})
  Stimulation Index: ${textualAnalysis.growthTarget.stimulationPoints} pts | Status: ${textualAnalysis.growthTarget.trendStatus.toUpperCase()}

3. PRESCRIPTIVE RECOMMENDATION
Train ${textualAnalysis.recommendedGame.title} to balance recruitment across ${textualAnalysis.growthTarget.code} and reduce asymmetric cognitive strain.`;

    navigator.clipboard?.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Control Zone */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Neuro-Correlation Matrix
            </span>
            <span className="text-xs text-slate-500">· 12 Cortical Pathways</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="w-7 h-7 text-indigo-400" />
            Cognitive Insights & Brain Region Health
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl">
            Correlating your game scores, reaction latencies, and accuracy patterns with targeted cortical regions.
            Powered by clinical neuropsychological heuristics and empirical trend tracking.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 self-start lg:self-auto">
          {/* Timeframe pill selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-0.5 flex text-xs font-medium">
            <button
              onClick={() => setSelectedTimeframe('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                selectedTimeframe === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setSelectedTimeframe('30days')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                selectedTimeframe === '30days' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setSelectedTimeframe('7days')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                selectedTimeframe === '7days' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
          </div>

          <button
            onClick={handleCopyReport}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Report Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Report</span>
              </>
            )}
          </button>

          <button
            onClick={onBackToCatalog}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
          >
            ← Back to All Games
          </button>
        </div>
      </div>

      {/* SECTION 1: TEXTUAL CLINICAL ANALYSIS OF COGNITIVE HEALTH TRENDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Comprehensive Textual Narrative */}
        <div className="lg:col-span-2 p-6 md:p-7 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800/80 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-white">
                Clinical Synthesis & Cognitive Health Trends
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              {textualAnalysis.healthTrajectory}
            </span>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white font-medium">Trajectory Assessment: </strong>
              {textualAnalysis.trajectoryDescription}
            </p>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-sans font-medium">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  Cognitive Processing Style:
                </span>
                <span className="text-indigo-300 font-semibold">{textualAnalysis.cognitiveStyle}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Global Accuracy</span>
                  <span className="text-white font-bold text-sm">{textualAnalysis.overallAvgAccuracy}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Mean Latency</span>
                  <span className="text-white font-bold text-sm">
                    {textualAnalysis.overallAvgRt > 0 ? `${textualAnalysis.overallAvgRt} ms` : 'Calibrating'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Regions Activated</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {textualAnalysis.stimulatedCount} / {textualAnalysis.totalRegionsCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-950/50 border border-emerald-500/20 rounded-xl">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Primary Regional Strength
                </span>
                <h4 className="text-xs font-bold text-white">{textualAnalysis.strongest.regionName}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  {textualAnalysis.strongest.description}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                  <span>Efficiency: {textualAnalysis.strongest.compositeEfficiency}%</span>
                  <span>{textualAnalysis.strongest.code}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/50 border border-amber-500/20 rounded-xl">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Recruitment & Growth Target
                </span>
                <h4 className="text-xs font-bold text-white">{textualAnalysis.growthTarget.regionName}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  {textualAnalysis.growthTarget.description}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-amber-300">
                  <span>Activation: {textualAnalysis.growthTarget.stimulationPoints} pts</span>
                  <span>{textualAnalysis.growthTarget.code}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Prescriptive Neuroplastic Action Card */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-2">
              <Target className="w-4 h-4" />
              <span>Targeted Prescription</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Bridge Cortical Asymmetry
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              To prevent cognitive bottlenecking and promote balanced bilateral hemispheric activation, your next targeted training session should engage the{' '}
              <span className="text-white font-medium">{textualAnalysis.growthTarget.code}</span> network.
            </p>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 mb-4">
              <div className="text-[11px] text-slate-400">Prescribed Paradigm:</div>
              <div className="text-sm font-bold text-white">{textualAnalysis.recommendedGame.title}</div>
              <div className="text-xs text-indigo-400">{textualAnalysis.recommendedGame.domainLabel}</div>
              <p className="text-[11px] text-slate-400 italic">
                "{textualAnalysis.recommendedGame.subtitle}"
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectGame(textualAnalysis.recommendedGame.id)}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Train {textualAnalysis.recommendedGame.title}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* SECTION 2: DATA VISUALIZATION - BRAIN REGIONS CORRELATION MATRIX */}
      <div className="p-6 md:p-7 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Targeted Brain Region Performance Correlation
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative data visualization correlating accuracy, speed efficiency, and synaptic load by Brodmann area.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setActiveMetricTab('composite')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeMetricTab === 'composite' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Efficiency Index
            </button>
            <button
              onClick={() => setActiveMetricTab('accuracy')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeMetricTab === 'accuracy' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Accuracy %
            </button>
            <button
              onClick={() => setActiveMetricTab('speed')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeMetricTab === 'speed' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Reaction Speed
            </button>
            <button
              onClick={() => setActiveMetricTab('stimulation')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeMetricTab === 'stimulation' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Synaptic Points
            </button>
          </div>
        </div>

        {/* Visual Multi-Bar Region Comparison */}
        <div className="space-y-3 pt-2">
          {regionalSummaries.map((region) => {
            const isSelected = activeRegion?.code === region.code;

            // Value calculation according to active metric
            let metricValue = 0;
            let displayLabel = '';
            let barWidthPercent = 5;

            if (activeMetricTab === 'composite') {
              metricValue = region.compositeEfficiency;
              displayLabel = `${region.compositeEfficiency}/100`;
              barWidthPercent = Math.max(6, region.compositeEfficiency);
            } else if (activeMetricTab === 'accuracy') {
              metricValue = region.avgAccuracy;
              displayLabel = region.avgAccuracy > 0 ? `${region.avgAccuracy}%` : 'Uncalibrated';
              barWidthPercent = Math.max(6, region.avgAccuracy);
            } else if (activeMetricTab === 'speed') {
              metricValue = region.avgReactionTimeMs;
              displayLabel = region.avgReactionTimeMs > 0 ? `${region.avgReactionTimeMs} ms` : 'Uncalibrated';
              // Invert speed: 300ms is 100%, 1500ms is 10%
              barWidthPercent = region.avgReactionTimeMs > 0
                ? Math.max(8, Math.min(100, Math.round(100 - ((region.avgReactionTimeMs - 300) / 12))))
                : 6;
            } else {
              metricValue = region.stimulationPoints;
              displayLabel = `${region.stimulationPoints} pts`;
              const maxPoints = Math.max(200, ...regionalSummaries.map(r => r.stimulationPoints));
              barWidthPercent = Math.max(6, Math.round((region.stimulationPoints / maxPoints) * 100));
            }

            const getBarGradient = () => {
              if (region.trendStatus === 'optimal') return 'from-emerald-500 to-teal-400';
              if (region.trendStatus === 'accelerating') return 'from-indigo-500 to-cyan-400';
              if (region.trendStatus === 'developing') return 'from-amber-500 to-yellow-400';
              return 'from-slate-700 to-slate-600';
            };

            return (
              <div
                key={region.code}
                onClick={() => setSelectedRegionCode(region.code)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30 text-[11px]">
                      {region.code}
                    </span>
                    <span className="font-semibold text-white">{region.regionName}</span>
                    <span className="hidden md:inline text-slate-500">·</span>
                    <span className="hidden md:inline text-slate-400 text-[11px] truncate max-w-xs">
                      {region.games.map(g => g.title).join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      region.trendStatus === 'optimal'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : region.trendStatus === 'accelerating'
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25'
                        : region.trendStatus === 'developing'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {region.trendStatus}
                    </span>
                    <span className="font-mono font-bold text-white text-xs min-w-[70px] text-right">
                      {displayLabel}
                    </span>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getBarGradient()} transition-all duration-500`}
                    style={{ width: `${barWidthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: DEEP DIVE INSPECTOR FOR SELECTED BRAIN REGION */}
      {activeRegion && (
        <div className="p-6 md:p-8 bg-slate-900 border border-indigo-500/30 rounded-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeRegion.code}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {activeRegion.networkGroup}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {activeRegion.regionName}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {activeRegion.games.map(game => (
                <button
                  key={game.id}
                  onClick={() => onSelectGame(game.id)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <span>Train {game.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Functional Description */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Neuroanatomical & Functional Role
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeRegion.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Correlated Diagnostic Paradigms ({activeRegion.games.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeRegion.games.map(game => (
                    <div
                      key={game.id}
                      onClick={() => onSelectGame(game.id)}
                      className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {game.title}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <span className="text-[11px] text-indigo-400 block mt-0.5">
                        {game.domainLabel}
                      </span>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                        {game.clinicalBasis}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Regional Metrics Card */}
            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-4 font-mono">
              <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
                Telemetry Summary
              </h4>

              <div className="space-y-3 divide-y divide-slate-800/60 text-xs">
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400 font-sans">Composite Efficiency</span>
                  <span className="font-bold text-indigo-400 text-sm">
                    {activeRegion.compositeEfficiency}/100
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400 font-sans">Mean Accuracy</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {activeRegion.avgAccuracy > 0 ? `${activeRegion.avgAccuracy}%` : '—'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400 font-sans">Reaction Velocity</span>
                  <span className="font-bold text-cyan-400 text-sm">
                    {activeRegion.avgReactionTimeMs > 0 ? `${activeRegion.avgReactionTimeMs} ms` : '—'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400 font-sans">Lifetime High Score</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {activeRegion.highScore > 0 ? `${activeRegion.highScore} pts` : '—'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400 font-sans">Synaptic Load</span>
                  <span className="font-bold text-slate-200 text-sm">
                    {activeRegion.stimulationPoints} pts
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400 font-sans">Logged Sessions</span>
                  <span className="font-bold text-slate-200 text-sm">
                    {activeRegion.sessionsCount} trials
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SPEED VS PRECISION QUADRANT / SCATTER MATRIX */}
      <div className="p-6 md:p-7 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
        <div>
          <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Regional Speed vs. Precision Quadrant Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Plotting cortical regions across Latency (ms) and Accuracy (%) to detect selective attention fatigue and speed-accuracy tradeoffs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Quadrant 1: Flow Zone */}
          <div className="p-4 bg-slate-950/80 border border-emerald-500/30 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Zone of Flow</span>
            </div>
            <div className="text-[11px] text-slate-400">High Precision + High Velocity (&lt;600ms, &gt;85%)</div>
            <div className="pt-2 text-xs text-slate-300">
              {regionalSummaries.filter(r => r.avgAccuracy >= 85 && r.avgReactionTimeMs < 650 && r.avgReactionTimeMs > 0).length > 0 ? (
                <ul className="list-disc list-inside space-y-0.5 text-emerald-300 font-medium">
                  {regionalSummaries
                    .filter(r => r.avgAccuracy >= 85 && r.avgReactionTimeMs < 650 && r.avgReactionTimeMs > 0)
                    .map(r => (
                      <li key={r.code}>{r.code}: {r.regionName}</li>
                    ))}
                </ul>
              ) : (
                <span className="text-slate-500 italic text-[11px]">No regions currently in peak flow</span>
              )}
            </div>
          </div>

          {/* Quadrant 2: Deliberate Control */}
          <div className="p-4 bg-slate-950/80 border border-indigo-500/30 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>Deliberate Control</span>
            </div>
            <div className="text-[11px] text-slate-400">High Precision + Measured Velocity (&gt;85%, &ge;650ms)</div>
            <div className="pt-2 text-xs text-slate-300">
              {regionalSummaries.filter(r => r.avgAccuracy >= 85 && r.avgReactionTimeMs >= 650).length > 0 ? (
                <ul className="list-disc list-inside space-y-0.5 text-indigo-300 font-medium">
                  {regionalSummaries
                    .filter(r => r.avgAccuracy >= 85 && r.avgReactionTimeMs >= 650)
                    .map(r => (
                      <li key={r.code}>{r.code}: {r.regionName}</li>
                    ))}
                </ul>
              ) : (
                <span className="text-slate-500 italic text-[11px]">No regions currently in deliberate zone</span>
              )}
            </div>
          </div>

          {/* Quadrant 3: Rapid Reflex */}
          <div className="p-4 bg-slate-950/80 border border-amber-500/30 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Reflexive Impulse</span>
            </div>
            <div className="text-[11px] text-slate-400">High Velocity + Volatile Accuracy (&lt;75%, &lt;650ms)</div>
            <div className="pt-2 text-xs text-slate-300">
              {regionalSummaries.filter(r => r.avgAccuracy > 0 && r.avgAccuracy < 75 && r.avgReactionTimeMs < 650 && r.avgReactionTimeMs > 0).length > 0 ? (
                <ul className="list-disc list-inside space-y-0.5 text-amber-300 font-medium">
                  {regionalSummaries
                    .filter(r => r.avgAccuracy > 0 && r.avgAccuracy < 75 && r.avgReactionTimeMs < 650 && r.avgReactionTimeMs > 0)
                    .map(r => (
                      <li key={r.code}>{r.code}: {r.regionName}</li>
                    ))}
                </ul>
              ) : (
                <span className="text-slate-500 italic text-[11px]">Inhibitory control holding well</span>
              )}
            </div>
          </div>

          {/* Quadrant 4: Calibration Phase */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span>Awaiting Calibration</span>
            </div>
            <div className="text-[11px] text-slate-500">Unstimulated or Initial Trial Baseline</div>
            <div className="pt-2 text-xs text-slate-400">
              <span className="font-mono text-slate-300 font-bold">
                {regionalSummaries.filter(r => r.sessionsCount === 0).length}
              </span> regions awaiting active trial logging.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
