import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MoleGrid } from './components/MoleGrid';
import { NormalDistributionChart } from './components/NormalDistributionChart';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import { RoundsHistory } from './components/RoundsHistory';
import { GameRecord, MoleHoleData, FloatingFeedback, MetricType, MoleState } from './types/game';
import {
  DEFAULT_PREDEFINED_SCORES,
  DEFAULT_PREDEFINED_HIT_PERCENTAGES,
  DEFAULT_PREDEFINED_MISS_PERCENTAGES,
  calculateDatasetStatistics,
  calculateMean,
  calculateZScore,
  calculateEmpiricalPercentile,
  calculateNormalCDF,
} from './utils/statistics';
import { sounds } from './utils/audio';

const GAME_DURATION_SEC = 30;
const FREEZE_BONUS_PER_HIT_SEC = 3;
const MAX_FREEZE_BONUS_SEC = 30;
const TOTAL_HOLES = 9;
const MAX_CONCURRENT_VISIBLE_MOLES = 2;
const SHAREABLE_URL = 'https://ais-pre-tpeghvfdmhlirndbppjctt-806409114260.us-east1.run.app';

export default function App() {
  // Sound mute state
  const [isMuted, setIsMuted] = useState(false);

  // Predefined Normative Baseline Datasets: Score, Hit %, Miss %
  const [baselineStats] = useState(() => calculateDatasetStatistics(DEFAULT_PREDEFINED_SCORES));
  const [hitPctStats] = useState(() =>
    calculateDatasetStatistics(DEFAULT_PREDEFINED_HIT_PERCENTAGES)
  );
  const [missPctStats] = useState(() =>
    calculateDatasetStatistics(DEFAULT_PREDEFINED_MISS_PERCENTAGES)
  );

  // Selected Metric for Distribution Chart ('score' | 'hit_pct' | 'miss_pct')
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('score');

  // Dataset Mode for the Normal Distribution Graph:
  // 'actual': STRICTLY your actual recorded games! The mean is purely the arithmetic mean of your data and shifts every round!
  // 'combined': Combines your games with the 100 historical benchmark trials (N = 100 + your games)
  // 'baseline': Fixed original 100 human trials benchmark (μ = 24.2)
  const [datasetMode, setDatasetMode] = useState<'actual' | 'combined' | 'baseline'>('actual');

  // Cooldown duration after hitting a mole (Default: 1500ms = 1.5 seconds)
  const [cooldownDurationMs, setCooldownDurationMs] = useState(1500);

  // Game Multi-Round Records History (Persisted in localStorage, deduplicated to ensure unique keys)
  const [records, setRecords] = useState<GameRecord[]>(() => {
    try {
      const saved = localStorage.getItem('whack_mole_records');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];

      const seen = new Set<string>();
      const deduped: GameRecord[] = [];
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item) continue;
        let id = item.id ? String(item.id) : `${Date.now()}-${i}`;
        if (seen.has(id)) {
          id = `${id}-${Math.random().toString(36).slice(2, 7)}`;
        }
        seen.add(id);
        deduped.push({ ...item, id });
      }
      return deduped;
    } catch {
      return [];
    }
  });

  // 1. Strictly Player's Actual Recorded Data
  const actualScores = useMemo(() => records.map((r) => r.score), [records]);
  const actualHitPcts = useMemo(
    () => records.map((r) => r.hitPercentage ?? r.accuracy),
    [records]
  );
  const actualMissPcts = useMemo(
    () => records.map((r) => r.missPercentage ?? (100 - (r.hitPercentage ?? r.accuracy))),
    [records]
  );

  // 2. Active datasets depending on chosen mode:
  const activeScores = useMemo(() => {
    if (datasetMode === 'baseline') return DEFAULT_PREDEFINED_SCORES;
    if (datasetMode === 'combined') {
      return [...DEFAULT_PREDEFINED_SCORES, ...actualScores];
    }
    // 'actual': strictly the player's recorded games!
    return actualScores;
  }, [datasetMode, actualScores]);

  const activeHitPcts = useMemo(() => {
    if (datasetMode === 'baseline') return DEFAULT_PREDEFINED_HIT_PERCENTAGES;
    if (datasetMode === 'combined') {
      return [...DEFAULT_PREDEFINED_HIT_PERCENTAGES, ...actualHitPcts];
    }
    return actualHitPcts;
  }, [datasetMode, actualHitPcts]);

  const activeMissPcts = useMemo(() => {
    if (datasetMode === 'baseline') return DEFAULT_PREDEFINED_MISS_PERCENTAGES;
    if (datasetMode === 'combined') {
      return [...DEFAULT_PREDEFINED_MISS_PERCENTAGES, ...actualMissPcts];
    }
    return actualMissPcts;
  }, [datasetMode, actualMissPcts]);

  const activeScoreStats = useMemo(() => calculateDatasetStatistics(activeScores), [activeScores]);
  const activeHitStats = useMemo(() => calculateDatasetStatistics(activeHitPcts), [activeHitPcts]);
  const activeMissStats = useMemo(() => calculateDatasetStatistics(activeMissPcts), [activeMissPcts]);

  // Game Loop States
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SEC);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [goldenHits, setGoldenHits] = useState(0);
  const [speedyHits, setSpeedyHits] = useState(0);
  const [frozenHits, setFrozenHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  // Combo Streak States (tracks consecutive mole hits without missing)
  const [comboStreak, setComboStreak] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [streakBrokenNotice, setStreakBrokenNotice] = useState(false);
  const [multiplierAlert, setMultiplierAlert] = useState<{
    visible: boolean;
    streak: number;
    multiplier: number;
  } | null>(null);

  // 9 Mole Holes State
  const [holes, setHoles] = useState<MoleHoleData[]>(() =>
    Array.from({ length: TOTAL_HOLES }, (_, i) => ({
      id: i,
      state: 'empty',
      appearedAt: 0,
    }))
  );

  // Floating score feedback notifications (+1, +3, MISS)
  const [feedbacks, setFeedbacks] = useState<FloatingFeedback[]>([]);

  // Toast Notification Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & UI States
  const [latestRecord, setLatestRecord] = useState<GameRecord | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showResetAllConfirm, setShowResetAllConfirm] = useState(false);
  const [selectedScoreForChart, setSelectedScoreForChart] = useState<number | null>(null);
  const [selectedRoundLabel, setSelectedRoundLabel] = useState<string>('Select a Round');

  // References for timers & game loop
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextSpawnTimeRef = useRef<number>(0);
  const isPlayingRef = useRef(false);
  const isEndingRef = useRef(false);
  const processedMoleHitsRef = useRef<Set<string>>(new Set());
  const freezeBonusSecondsRef = useRef(0);
  const multiplierAlertTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync ref
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Persist records
  useEffect(() => {
    try {
      localStorage.setItem('whack_mole_records', JSON.stringify(records));
    } catch {
      // ignore storage errors
    }
  }, [records]);

  // Show temporary toast
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  }, []);

  // Toggle audio
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.setMuted(next);
    showToast(next ? 'Game audio muted' : 'Game audio unmuted');
  };

  // Copy shareable link
  const handleCopyShareLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(SHAREABLE_URL);
      }
      showToast('🔗 Shareable link copied to clipboard!');
    } catch {
      showToast('Share link ready below');
    }
  };

  // Add floating text feedback
  const triggerFeedback = (x: number, y: number, text: string, color: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setFeedbacks((prev) => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    }, 850);
  };

  // Dedicated High-Frequency Mole Lifecycle Loop (Runs every 50ms during gameplay)
  // Ensures moles pop up randomly across ALL 9 holes, each with independent randomized stay durations
  // and guaranteed disappearance when their stay or cool-down expires.
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const now = Date.now();

      setHoles((prev) => {
        let changed = false;

        // 1. Check all holes for expiration or completed cooldown
        const updated = prev.map((h) => {
          // Unwhacked active mole that reached its stay expiration -> dive underground
          if (h.state !== 'empty' && h.state.endsWith('_up')) {
            if (h.expiresAt && now >= h.expiresAt) {
              changed = true;
              return {
                ...h,
                state: 'empty' as MoleState,
                moleType: undefined,
                appearedAt: 0,
                expiresAt: undefined,
                hitCount: 0,
              };
            }
          }

          // Whacked or cooling down mole whose cooldown duration expired -> dive underground
          if (h.state.startsWith('cooling_down') || h.state.startsWith('whacked')) {
            if (h.cooldownUntil && now >= h.cooldownUntil) {
              changed = true;
              return {
                ...h,
                state: 'empty' as MoleState,
                moleType: undefined,
                appearedAt: 0,
                cooldownUntil: undefined,
                cooldownDurationMs: undefined,
                hitCount: 0,
              };
            }
          }

          return h;
        });

        // 2. Count active moles across the board
        const activeCount = updated.filter((h) => h.state !== 'empty').length;

        // Limit concurrent moles to 2 to prevent overcrowding as requested
        const maxConcurrent = 2;
        if (activeCount < maxConcurrent && now >= nextSpawnTimeRef.current) {
          const availableHoles = updated.filter((h) => h.state === 'empty');
          if (availableHoles.length > 0) {
            // Pick a completely random empty burrow across ALL 9 holes
            const randomIndex = Math.floor(Math.random() * availableHoles.length);
            const chosen = availableHoles[randomIndex];

            // Randomize Mole Type:
            // 15% Speedy Mole (+5 pts, ultra fast: 420-650ms)
            // 13% Frozen Mole (+2 pts, +3s extra game clock, stays: 1200-1700ms)
            // 17% Golden Mole (+3 pts, stays: 850-1300ms)
            // 55% Standard Mole (+1 pt, stays: 850-1450ms)
            const rand = Math.random();
            let chosenType: 'standard' | 'golden' | 'speedy' | 'frozen';
            let moleState: MoleState;
            let stayDuration: number;

            if (rand < 0.15) {
              chosenType = 'speedy';
              moleState = 'speedy_up';
              stayDuration = Math.floor(420 + Math.random() * 230); // 420ms - 650ms
            } else if (rand < 0.28) {
              chosenType = 'frozen';
              moleState = 'frozen_up';
              stayDuration = Math.floor(1200 + Math.random() * 500); // 1200ms - 1700ms
            } else if (rand < 0.45) {
              chosenType = 'golden';
              moleState = 'golden_up';
              stayDuration = Math.floor(850 + Math.random() * 450); // 850ms - 1300ms
            } else {
              chosenType = 'standard';
              moleState = 'mole_up';
              stayDuration = Math.floor(850 + Math.random() * 600); // 850ms - 1450ms
            }

            sounds.playPopUp();

            // Stagger next potential spawn by 250ms - 500ms so holes pop up independently
            nextSpawnTimeRef.current = now + Math.floor(250 + Math.random() * 350);

            return updated.map((h) =>
              h.id === chosen.id
                ? {
                    ...h,
                    state: moleState,
                    moleType: chosenType,
                    appearedAt: now,
                    expiresAt: now + stayDuration,
                    cooldownUntil: undefined,
                    cooldownDurationMs: undefined,
                    hitCount: 0,
                  }
                : h
            );
          }
        }

        return changed ? updated : prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Finish game and compute statistics across Score, Hit %, and Miss %
  const endGame = useCallback(() => {
    if (isEndingRef.current || !isPlayingRef.current) return;
    isEndingRef.current = true;

    setIsPlaying(false);
    isPlayingRef.current = false;

    if (gameTimerRef.current) clearInterval(gameTimerRef.current);

    setHoles((prev) => prev.map((h) => ({ ...h, state: 'empty' })));

    sounds.playGameOver();

    // Compute metrics
    const totalClicks = hits + misses;
    const hitPercentage = totalClicks > 0 ? Number(((hits / totalClicks) * 100).toFixed(1)) : 100;
    const missPercentage = totalClicks > 0 ? Number(((misses / totalClicks) * 100).toFixed(1)) : 0;
    const avgReaction =
      reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 0;

    // Track actual gameplay mean evolution across all player games
    const existingScores = records.map((r) => r.score);
    const updatedScores = [score, ...existingScores];
    const prevMean = existingScores.length > 0 ? calculateMean(existingScores) : null;
    const newMean = calculateMean(updatedScores);
    const meanDelta = prevMean !== null ? Number((newMean - prevMean).toFixed(2)) : 0;

    // Active reference population for statistical Z-Score and Percentile
    const activeRefScores =
      datasetMode === 'baseline'
        ? DEFAULT_PREDEFINED_SCORES
        : datasetMode === 'combined'
        ? [...DEFAULT_PREDEFINED_SCORES, ...updatedScores]
        : updatedScores;
    const currentScoreStats = calculateDatasetStatistics(activeRefScores);

    // Score stats
    const zScore =
      currentScoreStats.stdDev > 0
        ? calculateZScore(score, currentScoreStats.mean, currentScoreStats.stdDev)
        : 0;
    const empiricalPercentile = calculateEmpiricalPercentile(score, currentScoreStats.scores);
    const normalPercentile = currentScoreStats.stdDev > 0 ? calculateNormalCDF(zScore) : 50;

    // Hit % stats
    const existingHits = records.map((r) => r.hitPercentage ?? r.accuracy);
    const updatedHits = [hitPercentage, ...existingHits];
    const activeRefHits =
      datasetMode === 'baseline'
        ? DEFAULT_PREDEFINED_HIT_PERCENTAGES
        : datasetMode === 'combined'
        ? [...DEFAULT_PREDEFINED_HIT_PERCENTAGES, ...updatedHits]
        : updatedHits;
    const currentHitStats = calculateDatasetStatistics(activeRefHits);
    const hitZScore =
      currentHitStats.stdDev > 0
        ? calculateZScore(hitPercentage, currentHitStats.mean, currentHitStats.stdDev)
        : 0;
    const hitPercentile = calculateEmpiricalPercentile(hitPercentage, currentHitStats.scores);

    // Miss % stats
    const existingMisses = records.map((r) => r.missPercentage ?? (100 - (r.hitPercentage ?? r.accuracy)));
    const updatedMisses = [missPercentage, ...existingMisses];
    const activeRefMisses =
      datasetMode === 'baseline'
        ? DEFAULT_PREDEFINED_MISS_PERCENTAGES
        : datasetMode === 'combined'
        ? [...DEFAULT_PREDEFINED_MISS_PERCENTAGES, ...updatedMisses]
        : updatedMisses;
    const currentMissStats = calculateDatasetStatistics(activeRefMisses);
    const missZScore =
      currentMissStats.stdDev > 0
        ? calculateZScore(missPercentage, currentMissStats.mean, currentMissStats.stdDev)
        : 0;
    const missPercentile = calculateEmpiricalPercentile(missPercentage, currentMissStats.scores);

    const uniqueId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const newRecord: GameRecord = {
      id: uniqueId,
      roundNumber: records.length + 1,
      timestamp: Date.now(),
      playerName: `Player`,
      score,
      hits,
      goldenHits,
      speedyHits,
      frozenHits,
      misses,
      totalClicks,
      maxCombo,
      accuracy: hitPercentage,
      hitPercentage,
      missPercentage,
      avgReactionTimeMs: avgReaction,
      zScore: Number(zScore.toFixed(3)),
      empiricalPercentile,
      normalPercentile,
      hitZScore: Number(hitZScore.toFixed(3)),
      hitPercentile,
      missZScore: Number(missZScore.toFixed(3)),
      missPercentile,
      previousMean: prevMean !== null ? Number(prevMean.toFixed(2)) : undefined,
      newMean: Number(newMean.toFixed(2)),
      meanDelta,
    };

    setRecords((prev) => [newRecord, ...prev]);
    setLatestRecord(newRecord);
    setSelectedScoreForChart(score);
    setSelectedRoundLabel(`Round #${newRecord.roundNumber}`);
    setShowSummaryModal(true);

    if (prevMean !== null) {
      const sign = meanDelta >= 0 ? `+${meanDelta}` : `${meanDelta}`;
      showToast(`🎯 Game Over! Score: ${score} · Live Mean: μ = ${newMean.toFixed(1)} pts (${sign} shift)`);
    } else {
      showToast(`🎯 Round 1 Complete! Score: ${score} · Starting Live Mean: μ = ${score.toFixed(1)} pts`);
    }
  }, [
    hits,
    misses,
    goldenHits,
    speedyHits,
    frozenHits,
    score,
    maxCombo,
    reactionTimes,
    records,
    datasetMode,
    showToast,
  ]);

  // Start a fresh 30s game
  const startGame = useCallback(() => {
    isEndingRef.current = false;

    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (multiplierAlertTimerRef.current) clearTimeout(multiplierAlertTimerRef.current);

    setScore(0);
    setHits(0);
    setGoldenHits(0);
    setSpeedyHits(0);
    setFrozenHits(0);
    setMisses(0);
    setComboStreak(0);
    setMaxCombo(0);
    setStreakBrokenNotice(false);
    setMultiplierAlert(null);
    setReactionTimes([]);
    setTimeLeft(GAME_DURATION_SEC);
    processedMoleHitsRef.current.clear();
    freezeBonusSecondsRef.current = 0;
    setFeedbacks([]);
    setShowSummaryModal(false);

    // All burrows start clean and empty
    setHoles(
      Array.from({ length: TOTAL_HOLES }, (_, i) => ({
        id: i,
        state: 'empty',
        appearedAt: 0,
      }))
    );

    // Start spawning immediately at random locations
    nextSpawnTimeRef.current = Date.now() + 50;

    setIsPlaying(true);
    isPlayingRef.current = true;

    // Start 1-second countdown interval
    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 5 && next > 0) {
          sounds.playTick();
        }
        return Math.max(0, next);
      });
    }, 1000);
  }, []);

  // Safely trigger game over when timer expires
  useEffect(() => {
    if (isPlaying && timeLeft <= 0) {
      endGame();
    }
  }, [isPlaying, timeLeft, endGame]);

  // Reset without scoring (Cancel current round cleanly without adding to records)
  const handleResetWithoutScoring = useCallback(() => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (multiplierAlertTimerRef.current) clearTimeout(multiplierAlertTimerRef.current);

    setIsPlaying(false);
    isPlayingRef.current = false;
    setTimeLeft(GAME_DURATION_SEC);
    setScore(0);
    setHits(0);
    setGoldenHits(0);
    setSpeedyHits(0);
    setFrozenHits(0);
    setMisses(0);
    setComboStreak(0);
    setMaxCombo(0);
    setStreakBrokenNotice(false);
    setMultiplierAlert(null);
    setReactionTimes([]);
    setFeedbacks([]);
    setHoles(
      Array.from({ length: TOTAL_HOLES }, (_, i) => ({
        id: i,
        state: 'empty',
        appearedAt: 0,
      }))
    );

    showToast('Round reset without scoring. No stats recorded.');
  }, [showToast]);

  // Reset ALL scores completely
  const handleResetAllScores = useCallback(() => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (multiplierAlertTimerRef.current) clearTimeout(multiplierAlertTimerRef.current);

    setIsPlaying(false);
    isPlayingRef.current = false;
    setTimeLeft(GAME_DURATION_SEC);
    setScore(0);
    setHits(0);
    setGoldenHits(0);
    setSpeedyHits(0);
    setFrozenHits(0);
    setMisses(0);
    setComboStreak(0);
    setMaxCombo(0);
    setStreakBrokenNotice(false);
    setMultiplierAlert(null);
    setReactionTimes([]);
    setRecords([]);
    setLatestRecord(null);
    setSelectedScoreForChart(null);
    setSelectedRoundLabel('Baseline Mean');
    setShowResetAllConfirm(false);
    setShowSummaryModal(false);

    try {
      localStorage.removeItem('whack_mole_records');
    } catch {
      // ignore
    }

    showToast('All recorded round scores have been reset.');
  }, [showToast]);

  // Handle whacking a hole
  const handleWhack = (holeId: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying) return;

    const now = Date.now();
    const clickX = e.clientX;
    const clickY = e.clientY;

    const targetHole = holes.find((h) => h.id === holeId);
    if (!targetHole) return;

    if (targetHole.state.startsWith('cooling_down') || targetHole.state.startsWith('whacked')) return;

    const isMoleTarget = ['mole_up', 'golden_up', 'speedy_up', 'frozen_up'].includes(targetHole.state);
    if (isMoleTarget) {
      const moleHitKey = `${holeId}:${targetHole.appearedAt}`;
      if (processedMoleHitsRef.current.has(moleHitKey)) return;
      processedMoleHitsRef.current.add(moleHitKey);

      const moleType =
        targetHole.moleType ||
        (targetHole.state.includes('golden')
          ? 'golden'
          : targetHole.state.includes('speedy')
          ? 'speedy'
          : targetHole.state.includes('frozen')
          ? 'frozen'
          : 'standard');

      // Track combo streak without missing
      const nextStreak = comboStreak + 1;
      setComboStreak(nextStreak);
      setMaxCombo((prevMax) => Math.max(prevMax, nextStreak));

      // Combo multiplier active when streak exceeds 5 (streak >= 6)
      const isMultiplierActive = nextStreak > 5;
      const multiplier = isMultiplierActive ? 2 : 1;

      // Base points and special perks per mole type:
      // Speedy Mole: +5 pts (or +10 pts with 2x combo multiplier!)
      // Frozen Mole: +2 pts (or +4 pts with 2x combo multiplier!) and adds +3 SECONDS to game timer!
      // Golden Mole: +3 pts (or +6 pts with 2x combo multiplier!)
      // Standard Mole: +1 pt (or +2 pts with 2x combo multiplier!)
      let basePoints = 1;
      let coolDownState: MoleState = 'cooling_down';
      let timeBonusSeconds = 0;

      if (moleType === 'speedy') {
        basePoints = 5;
        coolDownState = 'cooling_down_speedy';
        sounds.playSpeedyHit();
        setSpeedyHits((prev) => prev + 1);
      } else if (moleType === 'frozen') {
        basePoints = 2;
        coolDownState = 'cooling_down_frozen';
        sounds.playFrozenHit();
        setFrozenHits((prev) => prev + 1);
        timeBonusSeconds = Math.max(0, Math.min(
          FREEZE_BONUS_PER_HIT_SEC,
          MAX_FREEZE_BONUS_SEC - freezeBonusSecondsRef.current
        ));
        if (timeBonusSeconds > 0) {
          freezeBonusSecondsRef.current += timeBonusSeconds;
          setTimeLeft((prev) => prev + timeBonusSeconds);
          showToast(`❄️ Clock Freeze! +${timeBonusSeconds} Seconds Added!`);
        } else {
          showToast('❄️ Freeze-time bonus limit reached for this round.');
        }
      } else if (moleType === 'golden') {
        basePoints = 3;
        coolDownState = 'cooling_down_golden';
        sounds.playGoldenHit();
        setGoldenHits((prev) => prev + 1);
      } else {
        basePoints = 1;
        coolDownState = 'cooling_down';
        sounds.playHit();
      }

      const earnedPoints = basePoints * multiplier;

      // Display 'Combo Multiplier' alert on the screen when the streak exceeds 5
      if (nextStreak === 6) {
        sounds.playComboAlert();
        setMultiplierAlert({
          visible: true,
          streak: nextStreak,
          multiplier: 2,
        });
        if (multiplierAlertTimerRef.current) clearTimeout(multiplierAlertTimerRef.current);
        multiplierAlertTimerRef.current = setTimeout(() => {
          setMultiplierAlert((curr) => (curr ? { ...curr, visible: false } : null));
        }, 3200);
      } else if (nextStreak > 6) {
        setMultiplierAlert((curr) => (curr ? { ...curr, streak: nextStreak } : null));
      }

      const reactionTime = now - targetHole.appearedAt;

      // Update counters
      setScore((prevScore) => prevScore + earnedPoints);
      setHits((prevHits) => prevHits + 1);
      setReactionTimes((prevRt) => [...prevRt, reactionTime]);

      // Floating feedback with custom styling per mole type
      let feedbackText: string;
      let feedbackColor: string;

      if (moleType === 'speedy') {
        feedbackText = isMultiplierActive
          ? `+${earnedPoints} SPEEDY 2X! (Streak ${nextStreak})`
          : `+5 SPEEDY! ⚡`;
        feedbackColor = 'text-sky-300 font-extrabold text-base drop-shadow-[0_0_10px_rgba(56,189,248,0.9)]';
      } else if (moleType === 'frozen') {
        feedbackText = isMultiplierActive
          ? `+${earnedPoints}${timeBonusSeconds ? ` & +${timeBonusSeconds}s TIME!` : ''} (Streak ${nextStreak})`
          : `+${earnedPoints}${timeBonusSeconds ? ` & +${timeBonusSeconds}s TIME!` : ''} ❄️`;
        feedbackColor = 'text-cyan-300 font-extrabold text-base drop-shadow-[0_0_10px_rgba(103,232,249,0.9)]';
      } else if (moleType === 'golden') {
        feedbackText = isMultiplierActive
          ? `+${earnedPoints} GOLD 2X! (Streak ${nextStreak})`
          : '+3 GOLDEN! 👑';
        feedbackColor = 'text-amber-300 font-bold';
      } else {
        feedbackText = isMultiplierActive
          ? `+${earnedPoints} 2X! (Streak ${nextStreak})`
          : '+1';
        feedbackColor = isMultiplierActive ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold';
      }

      triggerFeedback(clickX, clickY, feedbackText, feedbackColor);

      // Transition mole to cooling_down state so player can keep hitting it during cool-down
      setHoles((prev) =>
        prev.map((h) =>
          h.id === holeId
            ? {
                ...h,
                state: coolDownState,
                moleType: moleType,
                cooldownUntil: now + cooldownDurationMs,
                cooldownDurationMs: cooldownDurationMs,
                hitCount: (h.hitCount || 0) + 1,
                expiresAt: undefined, // cooldownUntil takes precedence
              }
            : h
        )
      );
    } else {
      // Clicked on empty burrow hole
      sounds.playMiss();
      setMisses((prevMisses) => prevMisses + 1);

      if (comboStreak > 0) {
        setStreakBrokenNotice(true);
        setTimeout(() => setStreakBrokenNotice(false), 900);
        triggerFeedback(
          clickX,
          clickY,
          comboStreak > 5 ? `💥 MULTIPLIER LOST (${comboStreak})` : `MISS! (Streak ${comboStreak} lost)`,
          'text-rose-400 font-bold'
        );
      } else {
        triggerFeedback(clickX, clickY, 'MISS!', 'text-rose-400 font-semibold');
      }

      setComboStreak(0);
      if (multiplierAlertTimerRef.current) clearTimeout(multiplierAlertTimerRef.current);
      setMultiplierAlert(null);
    }
  };

  // Handle missed clicks on grass/outside holes
  const handleMissGround = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying) return;
    sounds.playMiss();
    setMisses((prev) => prev + 1);

    if (comboStreak > 0) {
      setStreakBrokenNotice(true);
      setTimeout(() => setStreakBrokenNotice(false), 900);
      triggerFeedback(
        e.clientX,
        e.clientY,
        comboStreak > 5 ? `💥 MULTIPLIER LOST (${comboStreak})` : `MISS! (Streak ${comboStreak} lost)`,
        'text-rose-400 font-bold'
      );
    } else {
      triggerFeedback(e.clientX, e.clientY, 'MISS!', 'text-rose-400 font-semibold');
    }

    setComboStreak(0);
    if (multiplierAlertTimerRef.current) clearTimeout(multiplierAlertTimerRef.current);
    setMultiplierAlert(null);
  };

  // Inspect specific round on chart
  const handleSelectRoundForChart = (scoreVal: number, roundNum: number) => {
    setSelectedScoreForChart(scoreVal);
    setSelectedRoundLabel(`Round #${roundNum}`);
    const chartEl = document.getElementById('distribution-section');
    if (chartEl) {
      chartEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculate live accuracy
  const totalSwings = hits + misses;
  const liveHitPercentage = totalSwings > 0 ? Math.round((hits / totalSwings) * 100) : 100;
  const liveMissPercentage = totalSwings > 0 ? Math.round((misses / totalSwings) * 100) : 0;

  // Active chart dataset & current value depending on selected metric
  const activeChartStats =
    selectedMetric === 'score'
      ? activeScoreStats
      : selectedMetric === 'hit_pct'
      ? activeHitStats
      : activeMissStats;

  const currentChartValue =
    selectedMetric === 'score'
      ? selectedScoreForChart ?? (records.length ? records[0].score : null)
      : selectedMetric === 'hit_pct'
      ? records.length
        ? records[0].hitPercentage ?? records[0].accuracy
        : null
      : records.length
      ? records[0].missPercentage ?? (100 - (records[0].hitPercentage ?? records[0].accuracy))
      : null;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900/95 border border-amber-500/80 text-amber-300 text-xs font-semibold rounded-xl shadow-2xl shadow-black/80 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Click Particles */}
      {feedbacks.map((f) => (
        <div
          key={f.id}
          style={{ left: f.x - 24, top: f.y - 32 }}
          className={`fixed pointer-events-none z-50 text-sm sm:text-base font-mono font-bold animate-bounce drop-shadow-md ${f.color}`}
        >
          {f.text}
        </div>
      ))}

      {/* Combo Multiplier Screen Alert Popup (Positioned in Top-Right Corner so it NEVER blocks the moles on top row) */}
      {multiplierAlert?.visible && (
        <div className="fixed top-16 sm:top-18 right-4 sm:right-6 z-50 pointer-events-none max-w-xs sm:max-w-sm animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="p-[2px] rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 shadow-[0_0_35px_rgba(245,158,11,0.5)]">
            <div className="px-4 py-3 rounded-[14px] bg-slate-950/95 backdrop-blur-md flex items-center gap-3 border border-amber-400/40">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl animate-bounce shrink-0 shadow-inner">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                    Combo Multiplier!
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-md animate-pulse">
                    2X SCORE
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-100 flex items-center gap-1.5 mt-0.5">
                  <span>🔥 {multiplierAlert.streak} Moles in Succession!</span>
                </div>
                <p className="text-[10px] text-amber-200/90 font-medium leading-tight">
                  Streak exceeded 5! All consecutive hits score DOUBLE points!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar Contract: 3 zones */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <a href="/" className="text-base sm:text-lg font-bold tracking-tight text-slate-100 flex items-center gap-2">
          <span>Whack-a-Mole Stats Lab</span>
        </a>

        {/* Zone 2: Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <a href="#game-section" className="hover:text-slate-100 transition-colors">
            30s Arcade
          </a>
          <a href="#distribution-section" className="hover:text-slate-100 transition-colors">
            Distribution Graphs
          </a>
          <a href="#history-section" className="hover:text-slate-100 transition-colors">
            Rounds & Trends ({records.length})
          </a>
          <a href="#stats-info" className="hover:text-slate-100 transition-colors">
            Formulas
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap"
            title="Get Shareable Link"
          >
            <span>🔗</span>
            <span className="hidden sm:inline">Share Link</span>
          </button>

          <button
            onClick={toggleMute}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Toggle Sound"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          <button
            onClick={startGame}
            className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl transition-all shadow-md shadow-amber-500/20 whitespace-nowrap"
          >
            {isPlaying ? 'Restart Round' : 'Start 30s Game'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Hero & Multi-Metric Strip */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono font-semibold uppercase tracking-wider">
              <span>30-Second Timed Round</span>
              <span>·</span>
              <span>Max 2 Moles · 1.5s Rapid Cool-Down</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
              Whack-a-Mole Statistics Lab
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Whack moles repeatedly across 30 seconds! Each mole enters a quick 1.5-second cooldown
              after being hit so you can hit them again. Distribution graphs track your{' '}
              <strong>Score</strong>, <strong>Hit % (Accuracy)</strong>, and <strong>Miss % (Errors)</strong>.
            </p>

            {/* Distinct Special Mole Types Legend */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px]">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Mole Types:</span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-200">
                🐹 Standard: <strong>1 pt</strong>
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/60 text-amber-300">
                👑 Golden: <strong>3 pts</strong>
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-400/60 text-sky-300">
                ⚡ Speedy: <strong>5 pts (Fast!)</strong>
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-400/60 text-cyan-200">
                ❄️ Frozen: <strong>2 pts + 3s Time!</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <button
              onClick={handleCopyShareLink}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:border-amber-500/60 text-xs font-mono text-amber-300 flex items-center gap-2 transition-all shadow-sm"
            >
              <span>🔗 Copy Share URL</span>
            </button>
            {records.length > 0 && (
              <button
                onClick={() => setShowResetAllConfirm(true)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-800 hover:text-rose-300 text-xs text-slate-400 transition-colors"
              >
                Reset All Scores
              </button>
            )}
          </div>
        </section>

        {/* Game Stage Zone */}
        <section id="game-section" className="space-y-4">
          {/* Game HUD Bar: Timer, Score, Combo Streak, Hit %, Miss % */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Prominent Timer */}
            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                isPlaying && timeLeft <= 5
                  ? 'bg-rose-950/50 border-rose-500 animate-pulse'
                  : isPlaying
                  ? 'bg-amber-950/20 border-amber-500/60'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Game Time
                </span>
                {isPlaying ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold font-mono text-emerald-400 uppercase">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">30s limit</span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span
                  className={`text-3xl font-extrabold font-mono tabular-nums ${
                    isPlaying && timeLeft <= 5
                      ? 'text-rose-400'
                      : isPlaying
                      ? 'text-amber-300'
                      : 'text-slate-100'
                  }`}
                >
                  {timeLeft}.0
                </span>
                <span className="text-xs text-slate-400 font-mono">sec</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeLeft <= 5 ? 'bg-rose-500' : 'bg-amber-400'
                  }`}
                  style={{ width: `${(timeLeft / GAME_DURATION_SEC) * 100}%` }}
                />
              </div>
            </div>

            {/* Score */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
                  {score}
                </span>
                <span className="text-xs text-slate-400">pts</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1.5 block">
                {hits} hits
                {goldenHits > 0 && ` · ${goldenHits}👑`}
                {speedyHits > 0 && ` · ${speedyHits}⚡`}
                {frozenHits > 0 && ` · ${frozenHits}❄️`}
              </span>
            </div>

            {/* Visual Combo Streak Counter (Tracks moles hit in succession without missing) */}
            <div
              className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
                comboStreak > 5
                  ? 'bg-gradient-to-br from-amber-950/70 via-orange-950/50 to-slate-900 border-amber-400 shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/60'
                  : comboStreak > 0
                  ? 'bg-slate-900/90 border-amber-500/50 shadow-sm shadow-amber-500/10'
                  : streakBrokenNotice
                  ? 'bg-rose-950/40 border-rose-500/80 animate-pulse'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              {/* Ambient Multiplier Glow */}
              {comboStreak > 5 && (
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/25 rounded-full blur-xl pointer-events-none animate-pulse" />
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-sm inline-block ${
                      comboStreak > 5
                        ? 'animate-bounce'
                        : comboStreak > 0
                        ? 'animate-pulse'
                        : ''
                    }`}
                  >
                    {comboStreak > 5 ? '⚡' : comboStreak > 0 ? '🔥' : '🎯'}
                  </span>
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider ${
                      comboStreak > 5
                        ? 'text-amber-300 font-bold'
                        : comboStreak > 0
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    Combo Streak
                  </span>
                </div>

                {comboStreak > 5 ? (
                  <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-sm animate-pulse">
                    2x Multiplier
                  </span>
                ) : comboStreak > 0 ? (
                  <span className="text-[10px] font-mono font-medium text-amber-400/90">
                    {Math.max(0, 5 - comboStreak + 1)} to 2x!
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">
                    Best: {maxCombo}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-3xl font-extrabold font-mono tabular-nums transition-transform ${
                    comboStreak > 5
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-300 scale-105 inline-block drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                      : comboStreak > 0
                      ? 'text-amber-400'
                      : streakBrokenNotice
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {comboStreak}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {comboStreak === 1 ? 'hit' : 'hits'}
                </span>
              </div>

              {/* Streak Pips / Progress Meter toward 5+ */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((step) => {
                    const isFilled = comboStreak >= step;
                    const isExceeded = comboStreak > 5;
                    return (
                      <div
                        key={step}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          isExceeded
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]'
                            : isFilled
                            ? 'bg-amber-400 shadow-sm'
                            : 'bg-slate-800'
                        }`}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span
                    className={
                      comboStreak > 5
                        ? 'text-amber-300 font-bold'
                        : streakBrokenNotice
                        ? 'text-rose-400 font-medium'
                        : 'text-slate-400'
                    }
                  >
                    {comboStreak > 5
                      ? '⚡ 2x Multiplier Active!'
                      : streakBrokenNotice
                      ? '💥 Streak broken'
                      : comboStreak > 0
                      ? `${comboStreak} in succession`
                      : 'Hit without missing'}
                  </span>
                  <span className="text-slate-500 font-mono">
                    Best: <strong className="text-slate-300">{maxCombo}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Hit % (Accuracy) */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider block">
                Hit Accuracy %
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
                  {liveHitPercentage}%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1.5 block">
                {hits} successful hits
              </span>
            </div>

            {/* Miss % (Errors) */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] font-medium text-rose-400 uppercase tracking-wider block">
                Miss Rate %
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono text-rose-400 tabular-nums">
                  {liveMissPercentage}%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1.5 block">
                {misses} missed swings
              </span>
            </div>
          </div>

          {/* In-Game Action Ribbon with Cool-Down Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-400">⏱ Remaining:</span>
                <strong className={`text-sm ${timeLeft <= 5 && isPlaying ? 'text-rose-400 font-bold' : 'text-slate-100'}`}>
                  {timeLeft}s
                </strong>
              </div>

              {/* In-Ribbon Active Multiplier Status (Never overlaps or shifts moles!) */}
              {comboStreak > 5 && isPlaying && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30 animate-pulse">
                  <span>⚡</span>
                  <span>2X MULTIPLIER ACTIVE! ({comboStreak} Streak)</span>
                </div>
              )}

              {/* Cooldown setting */}
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-400">Hit Cooldown:</span>
                <div className="flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  <button
                    onClick={() => setCooldownDurationMs(1000)}
                    disabled={isPlaying}
                    className={`px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                      cooldownDurationMs === 1000
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    1.0s (Fast)
                  </button>
                  <button
                    onClick={() => setCooldownDurationMs(1500)}
                    disabled={isPlaying}
                    className={`px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                      cooldownDurationMs === 1500
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    1.5s (Default)
                  </button>
                  <button
                    onClick={() => setCooldownDurationMs(2000)}
                    disabled={isPlaying}
                    className={`px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                      cooldownDurationMs === 2000
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    2.0s
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isPlaying && (
                <button
                  onClick={handleResetWithoutScoring}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-200 font-semibold transition-colors flex items-center gap-1.5"
                  title="Cancel current round without saving score"
                >
                  <span>⏹</span>
                  <span>Reset (No Scoring)</span>
                </button>
              )}

              {!isPlaying && (
                <button
                  onClick={startGame}
                  className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>▶</span>
                  <span>Start 30s Game</span>
                </button>
              )}

              {records.length > 0 && !isPlaying && (
                <button
                  onClick={() => setShowResetAllConfirm(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-900 text-slate-400 hover:text-rose-300 transition-colors"
                >
                  Reset All Scores
                </button>
              )}
            </div>
          </div>

          {/* Interactive Mole Grid */}
          <div className="relative mt-2">
            <MoleGrid
              holes={holes}
              onWhack={handleWhack}
              onMissGround={handleMissGround}
              isPlaying={isPlaying}
            />

            {!isPlaying && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-6 text-center z-30">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl mb-3 shadow-inner">
                  🔨
                </div>
                <h3 className="text-xl font-bold text-slate-100">Ready for a 30-Second Round?</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1 mb-5 leading-relaxed">
                  Only <strong>1–2 moles appear at a time</strong> for clear, focused action! When you hit
                  a mole, it enters a quick <strong>1.5-second cool-down</strong>, then recharges so you
                  can <strong>hit it again repeatedly</strong>.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={startGame}
                    className="px-8 py-3 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95"
                  >
                    Start 30-Second Game
                  </button>
                  {records.length > 0 && (
                    <button
                      onClick={() => setShowResetAllConfirm(true)}
                      className="px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-xl transition-colors"
                    >
                      Reset All Scores
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Statistical Distribution Graphs Section: Score, Hit %, and Miss % */}
        <section id="distribution-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                Statistical Distribution Graphs
              </h2>
              <p className="text-xs text-slate-400">
                Switch between Score, Hit %, and Miss % to view their normal curves, Z-scores, and
                percentile rankings.
              </p>
            </div>
            {selectedScoreForChart !== null && (
              <button
                onClick={() => {
                  setSelectedScoreForChart(null);
                  setSelectedRoundLabel('');
                }}
                className="text-xs text-slate-400 hover:text-slate-200 self-start sm:self-auto"
              >
                Clear selected score
              </button>
            )}
          </div>

          {/* Dataset Mode Toggle: Actual Data (Mean of played games only, shifts every game) vs Combined vs Baseline */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium">Dataset Population:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setDatasetMode('actual')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    datasetMode === 'actual'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Strictly uses only your actual played games! The mean updates dynamically with every single game."
                >
                  My Games Only (Actual Data, N = {records.length})
                </button>
                <button
                  onClick={() => setDatasetMode('combined')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    datasetMode === 'combined'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Blends your played games with the 100 historical benchmark trials"
                >
                  Combined (N = {100 + records.length})
                </button>
                <button
                  onClick={() => setDatasetMode('baseline')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    datasetMode === 'baseline'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Fixed standardized 100 human trials benchmark"
                >
                  Fixed Benchmark (N = 100)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-slate-400">Live Mean:</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/40 text-amber-300 font-bold">
                μ = {activeChartStats.mean} {selectedMetric === 'score' ? 'pts' : '%'}
              </span>
              <span className="text-slate-500">σ = {activeChartStats.stdDev}</span>
              {records.length > 1 && records[0].meanDelta !== undefined && datasetMode === 'actual' && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    records[0].meanDelta > 0
                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800'
                      : records[0].meanDelta < 0
                      ? 'text-rose-400 bg-rose-950/40 border border-rose-800'
                      : 'text-slate-400 bg-slate-900 border border-slate-800'
                  }`}
                  title="Shift in mean after the most recent game"
                >
                  {records[0].meanDelta > 0
                    ? `▲ +${records[0].meanDelta}`
                    : records[0].meanDelta < 0
                    ? `▼ ${records[0].meanDelta}`
                    : '― 0.0'}{' '}
                  last game
                </span>
              )}
            </div>
          </div>

          {/* Explanation Callout for Live Mean Shifting */}
          <div className="px-4 py-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2.5">
            <span className="text-base shrink-0">💡</span>
            <div className="space-y-0.5">
              <strong className="text-amber-300">
                {datasetMode === 'actual'
                  ? 'Real-Time Mean of Your Actual Gameplay Data'
                  : datasetMode === 'combined'
                  ? 'Combined Population: Your Games + 100 Historical Benchmark Trials'
                  : 'Fixed Reference Benchmark (100 Historical Human Trials)'}
              </strong>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {datasetMode === 'actual' ? (
                  records.length === 0 ? (
                    'You have not played any rounds yet. Press "Start 30-Second Game" above to play! As soon as your first round ends, the mean is established directly from your score, and every subsequent game will recalculate the mean live.'
                  ) : (
                    <>
                      The mean (<strong>μ = {activeChartStats.mean} {selectedMetric === 'score' ? 'pts' : '%'}</strong>) is the <strong>exact mathematical average of the {records.length} game{records.length === 1 ? '' : 's'} you have played</strong>. Every single game you complete recalculates this mean live, shifting the Bell Curve and all statistical metrics!
                    </>
                  )
                ) : datasetMode === 'combined' ? (
                  `Incorporates your ${records.length} game(s) into the 100-sample human benchmark pool (total sample size N = ${100 + records.length}).`
                ) : (
                  'Fixed benchmark of 100 standardized human trials (Mean μ = 24.2 pts, StdDev σ = 5.2). Use this to measure how your scores compare against fixed normative standards.'
                )}
              </p>
            </div>
          </div>

          <NormalDistributionChart
            stats={activeChartStats}
            currentScore={currentChartValue}
            roundLabel={
              selectedRoundLabel || (records.length ? `Round #${records[0].roundNumber}` : 'Benchmark Mean')
            }
            showHistogram={true}
            metric={selectedMetric}
            onMetricChange={(m) => setSelectedMetric(m)}
            unit={selectedMetric === 'score' ? 'pts' : '%'}
          />
        </section>

        {/* Rounds History & Trend Progression Tracker */}
        <section id="history-section">
          <RoundsHistory
            records={records}
            baselineStats={activeChartStats}
            onClearHistory={handleResetAllScores}
            onSelectRoundForChart={handleSelectRoundForChart}
          />
        </section>

        {/* Educational Reference on Statistical Formulas */}
        <section id="stats-info" className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <span>📖 Statistical Formulas & Scoring Rules</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Score */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="font-semibold text-amber-400 font-mono block">1. Total Game Score</span>
              <p className="text-slate-400">
                Standard (1 pt), Golden (3 pts), Speedy (5 pts), Frozen (2 pts + 3s Time). Consecutive hits &gt; 5 award a 2x Combo Multiplier:
              </p>
              <div className="p-2 rounded bg-slate-900 font-mono text-slate-200 text-[11px]">
                Score = Σ (BasePoints × Multiplier)
              </div>
              <p className="text-[11px] text-slate-400">
                Active Mean μ = <strong>{activeChartStats.mean} pts</strong> (σ = {activeChartStats.stdDev})
              </p>
            </div>

            {/* Hit % */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="font-semibold text-emerald-400 font-mono block">2. Hit Accuracy %</span>
              <p className="text-slate-400">
                The proportion of total swings that connected with an active mole:
              </p>
              <div className="p-2 rounded bg-slate-900 font-mono text-slate-200 text-[11px]">
                Hit % = (Hits / TotalSwings) × 100
              </div>
              <p className="text-[11px] text-slate-400">
                Baseline Mean μ = <strong>{hitPctStats.mean}%</strong> (σ = {hitPctStats.stdDev}%)
              </p>
            </div>

            {/* Miss % */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="font-semibold text-rose-400 font-mono block">3. Miss Rate %</span>
              <p className="text-slate-400">
                The proportion of swings that missed or struck empty ground:
              </p>
              <div className="p-2 rounded bg-slate-900 font-mono text-slate-200 text-[11px]">
                Miss % = (Misses / TotalSwings) × 100
              </div>
              <p className="text-[11px] text-slate-400">
                Baseline Mean μ = <strong>{missPctStats.mean}%</strong> (Lower is better!)
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Post-Round Summary Modal with Score, Hit %, and Miss % Graphs */}
      <RoundSummaryModal
        isOpen={showSummaryModal}
        record={latestRecord}
        baselineStats={baselineStats}
        hitPctStats={hitPctStats}
        missPctStats={missPctStats}
        onPlayNextRound={startGame}
        onViewHistory={() => {
          setShowSummaryModal(false);
          const histEl = document.getElementById('history-section');
          if (histEl) histEl.scrollIntoView({ behavior: 'smooth' });
        }}
        onClose={() => setShowSummaryModal(false)}
      />

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>🔗 Share Whack-a-Mole Game</span>
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Share this link with students or friends to let them play the 30-second game and view
              their Score, Hit %, and Miss % distributions:
            </p>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-2 text-xs font-mono text-slate-300 break-all">
              <span className="truncate select-all">{SHAREABLE_URL}</span>
              <button
                onClick={handleCopyShareLink}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold whitespace-nowrap text-xs transition-colors shrink-0"
              >
                Copy
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Resetting All Scores */}
      {showResetAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-rose-900/60 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-base font-bold text-slate-100">Reset All Recorded Scores?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will permanently delete all <strong>{records.length}</strong> logged rounds from your
              session history and reset your personal mean and high scores.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetAllConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetAllScores}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-600/20"
              >
                Yes, Reset All Scores
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-400 space-y-1">
        <p>Whack-a-Mole Statistics Lab · 30-Second Rapid Assessment & Normal Distribution Analysis</p>
        <p className="text-[11px] text-slate-400 font-mono">
          Shareable Link:{' '}
          <a
            href={SHAREABLE_URL}
            target="_blank"
            rel="noreferrer"
            className="text-amber-400 hover:underline"
          >
            {SHAREABLE_URL}
          </a>
        </p>
      </footer>
    </div>
  );
}
