import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameResult } from '../types/game';
import { playSuccess, playError, playTap, playVictory, playLetterTone } from '../utils/audio';
import {
  Volume2,
  Play,
  RotateCcw,
  Brain,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  Eye,
  Sliders,
  Sparkles,
  ArrowLeftRight,
} from 'lucide-react';

interface DualNBackProps {
  difficulty?: string; // '1-back' | '2-back' | '3-back'
  onGameEnd?: (result: GameResult) => void;
  isEmbedded?: boolean;
}

interface TrialData {
  position: number; // 0-8 (3x3 grid)
  letter: string;   // 'C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'
}

interface TrialFeedback {
  type: 'hit' | 'false_alarm' | 'miss' | 'correct_rejection' | 'warmup';
  title: string;
  details: string;
  posStatus?: 'hit' | 'false_alarm' | 'miss' | 'correct_reject';
  audioStatus?: 'hit' | 'false_alarm' | 'miss' | 'correct_reject';
}

const LETTERS = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'];
const TOTAL_TRIALS = 20;

const POSITION_NAMES = [
  'Top-Left', 'Top-Center', 'Top-Right',
  'Middle-Left', 'Center', 'Middle-Right',
  'Bottom-Left', 'Bottom-Center', 'Bottom-Right',
];

export const DualNBackGame: React.FC<DualNBackProps> = ({
  difficulty = '2-back',
  onGameEnd,
  isEmbedded = false,
}) => {
  const nValue = difficulty === '1-back' ? 1 : difficulty === '3-back' ? 3 : 2;

  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'SUMMARY'>('TITLE_MENU');
  const [currentTrialIdx, setCurrentTrialIdx] = useState<number>(-1);
  const [trials, setTrials] = useState<TrialData[]>([]);
  const [isStimulusActive, setIsStimulusActive] = useState<boolean>(false);

  // Settings
  const [showMemoryRibbon, setShowMemoryRibbon] = useState<boolean>(true); // Training tape showing history
  const [speedPace, setSpeedPace] = useState<'relaxed' | 'standard'>('relaxed'); // 3.2s vs 2.4s

  // User responses for the active step
  const [pressedPos, setPressedPos] = useState<boolean>(false);
  const [pressedAudio, setPressedAudio] = useState<boolean>(false);

  // Immediate trial feedback
  const [latestFeedback, setLatestFeedback] = useState<TrialFeedback | null>(null);

  // Scoring
  const [posHits, setPosHits] = useState<number>(0);
  const [posMisses, setPosMisses] = useState<number>(0);
  const [posFalseAlarms, setPosFalseAlarms] = useState<number>(0);

  const [audioHits, setAudioHits] = useState<number>(0);
  const [audioMisses, setAudioMisses] = useState<number>(0);
  const [audioFalseAlarms, setAudioFalseAlarms] = useState<number>(0);

  const [score, setScore] = useState<number>(0);

  // Timing
  const [startTime, setStartTime] = useState<number>(0);
  const stepDurationMs = speedPace === 'relaxed' ? 3200 : 2500;

  // Pre-generate trials with balanced matches (~35% position, ~35% audio)
  const generateTrials = useCallback((): TrialData[] => {
    const list: TrialData[] = [];
    for (let i = 0; i < TOTAL_TRIALS; i++) {
      let pos = Math.floor(Math.random() * 9);
      let letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];

      if (i >= nValue) {
        if (Math.random() < 0.35) {
          pos = list[i - nValue].position;
        }
        if (Math.random() < 0.35) {
          letter = list[i - nValue].letter;
        }
      }

      list.push({ position: pos, letter });
    }
    return list;
  }, [nValue]);

  const startGame = () => {
    playTap();
    const newTrials = generateTrials();
    setTrials(newTrials);
    setGameState('PLAYING');
    setCurrentTrialIdx(0);
    setPosHits(0);
    setPosMisses(0);
    setPosFalseAlarms(0);
    setAudioHits(0);
    setAudioMisses(0);
    setAudioFalseAlarms(0);
    setScore(0);
    setPressedPos(false);
    setPressedAudio(false);
    setLatestFeedback(null);
    setStartTime(Date.now());
  };

  // Evaluate trial with rich educational reinforcement
  const evaluateTrial = useCallback((idx: number, posPressed: boolean, audPressed: boolean) => {
    if (idx < nValue) {
      // Warmup turns where comparing N steps ago is not yet possible
      setLatestFeedback({
        type: 'warmup',
        title: `Warm-up Step ${idx + 1} of ${nValue}`,
        details: `Store this position & letter in memory. Comparisons begin on Step ${nValue + 1}.`,
      });
      return;
    }

    const current = trials[idx];
    const previous = trials[idx - nValue];

    const isPosMatch = current.position === previous.position;
    const isAudMatch = current.letter === previous.letter;

    let deltaScore = 0;
    const feedbackParts: string[] = [];
    let hasError = false;
    let hasHit = false;

    // 1. Evaluate Position
    let pStatus: TrialFeedback['posStatus'] = 'correct_reject';
    if (isPosMatch) {
      if (posPressed) {
        setPosHits(h => h + 1);
        deltaScore += 50;
        hasHit = true;
        pStatus = 'hit';
        feedbackParts.push(`✓ Position Hit (+50 pts): Matched ${POSITION_NAMES[current.position]} from ${nValue} steps ago.`);
      } else {
        setPosMisses(m => m + 1);
        hasError = true;
        pStatus = 'miss';
        feedbackParts.push(`⚠ Missed Position: Both were [${POSITION_NAMES[current.position]}]. You should have pressed [Position Match]!`);
      }
    } else {
      if (posPressed) {
        setPosFalseAlarms(fa => fa + 1);
        deltaScore -= 20;
        hasError = true;
        pStatus = 'false_alarm';
        feedbackParts.push(`✕ False Alarm on Position (-20 pts): Current was [${POSITION_NAMES[current.position]}], but ${nValue} steps ago was [${POSITION_NAMES[previous.position]}].`);
      } else {
        pStatus = 'correct_reject';
      }
    }

    // 2. Evaluate Audio
    let aStatus: TrialFeedback['audioStatus'] = 'correct_reject';
    if (isAudMatch) {
      if (audPressed) {
        setAudioHits(h => h + 1);
        deltaScore += 50;
        hasHit = true;
        aStatus = 'hit';
        feedbackParts.push(`✓ Audio Hit (+50 pts): Letter '${current.letter}' matched ${nValue} steps ago.`);
      } else {
        setAudioMisses(m => m + 1);
        hasError = true;
        aStatus = 'miss';
        feedbackParts.push(`⚠ Missed Audio: Letter '${current.letter}' matched ${nValue} steps ago. You should have pressed [Audio Match]!`);
      }
    } else {
      if (audPressed) {
        setAudioFalseAlarms(fa => fa + 1);
        deltaScore -= 20;
        hasError = true;
        aStatus = 'false_alarm';
        feedbackParts.push(`✕ False Alarm on Audio (-20 pts): Current was '${current.letter}', but ${nValue} steps ago was '${previous.letter}'.`);
      } else {
        aStatus = 'correct_reject';
      }
    }

    // Sound reinforcement
    if (hasError) {
      playError();
    } else if (hasHit) {
      playSuccess();
    }

    // If neither matched and neither was pressed
    if (!isPosMatch && !isAudMatch && !posPressed && !audPressed) {
      feedbackParts.push(`✓ Good Restraint: Neither position nor letter matched Step ${idx - nValue + 1}.`);
    }

    setScore(s => Math.max(0, s + deltaScore));

    setLatestFeedback({
      type: hasError ? 'false_alarm' : hasHit ? 'hit' : 'correct_rejection',
      title: hasError ? 'Misalignment Detected' : hasHit ? 'Verified Match!' : 'Correct Rejection',
      details: feedbackParts.join(' '),
      posStatus: pStatus,
      audioStatus: aStatus,
    });
  }, [nValue, trials]);

  // Turn loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    if (currentTrialIdx >= TOTAL_TRIALS) {
      playVictory();
      setGameState('SUMMARY');

      const totalOpportunities = (TOTAL_TRIALS - nValue) * 2;
      const totalCorrectSignals = posHits + audioHits;
      const penalties = (posFalseAlarms + audioFalseAlarms) * 0.5 + (posMisses + audioMisses) * 0.3;
      const rawAccuracy = totalOpportunities > 0
        ? Math.max(0, Math.min(100, Math.round(((totalCorrectSignals - penalties) / Math.max(1, totalOpportunities * 0.35)) * 100)))
        : 70;

      const duration = Math.round((Date.now() - startTime) / 1000);
      const finalResult: GameResult = {
        gameId: 'dual-n-back',
        score: Math.max(0, score),
        accuracy: Math.min(100, Math.max(15, rawAccuracy)),
        avgReactionTimeMs: 640,
        completedAt: new Date().toISOString(),
        durationSeconds: duration,
        difficulty,
      };

      if (onGameEnd) {
        onGameEnd(finalResult);
      }
      return;
    }

    // Flash stimulus for 600ms
    setIsStimulusActive(true);
    setPressedPos(false);
    setPressedAudio(false);

    const currentStim = trials[currentTrialIdx];
    if (currentStim) {
      playLetterTone(currentStim.letter);
    }

    const flashTimeout = setTimeout(() => {
      setIsStimulusActive(false);
    }, 600);

    // Response window duration
    const stepTimeout = setTimeout(() => {
      evaluateTrial(currentTrialIdx, pressedPos, pressedAudio);
      setCurrentTrialIdx(idx => idx + 1);
    }, stepDurationMs);

    return () => {
      clearTimeout(flashTimeout);
      clearTimeout(stepTimeout);
    };
  }, [currentTrialIdx, gameState, stepDurationMs, pressedPos, pressedAudio]);

  // Keyboard shortcuts (A for Position, L for Audio)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      if (e.key === 'a' || e.key === 'A') {
        handlePositionClick();
      } else if (e.key === 'l' || e.key === 'L') {
        handleAudioClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, pressedPos, pressedAudio]);

  const handlePositionClick = () => {
    if (pressedPos) return;
    setPressedPos(true);
    playTap();
  };

  const handleAudioClick = () => {
    if (pressedAudio) return;
    setPressedAudio(true);
    playTap();
  };

  const currentStim = currentTrialIdx >= 0 && currentTrialIdx < TOTAL_TRIALS ? trials[currentTrialIdx] : null;
  const compareTargetStim = currentTrialIdx >= nValue ? trials[currentTrialIdx - nValue] : null;

  return (
    <div className={`w-full max-w-4xl mx-auto ${isEmbedded ? 'p-2' : 'p-4 md:p-6'} select-none`}>
      {gameState === 'TITLE_MENU' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3">
              <Brain className="w-7 h-7" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Dual N-Back ({difficulty})
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Dual N-Back exercises your brain's active working memory buffer. You track a visual spatial grid and a letter tone simultaneously, checking if either matches what appeared <strong>{nValue} {nValue === 1 ? 'step' : 'steps'} ago</strong>.
            </p>
          </div>

          {/* Interactive Visual Explainer Diagram */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs md:text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>How {nValue}-Back Works (Clear Visual Example):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 font-mono">
                  <span>Turn 1</span>
                  <span>(t - {nValue})</span>
                </div>
                <div className="w-16 h-16 mx-auto grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="bg-indigo-500 rounded" />
                  <div className="bg-slate-900 rounded" />
                  <div className="bg-slate-900 rounded" />
                  <div className="bg-slate-900 rounded" />
                  <div className="bg-slate-900 rounded" />
                  <div className="bg-slate-900 rounded" />
                  <div className="bg-slate-900 rounded" />
                  <div className="bg-slate-900 rounded" />
                  <div className="bg-slate-900 rounded" />
                </div>
                <p className="text-center font-mono text-slate-300 font-bold">Letter 'C'</p>
                <p className="text-[11px] text-slate-400 text-center">Top-Left grid + 'C'</p>
              </div>

              {nValue >= 2 && (
                <div className="p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl space-y-2 opacity-60">
                  <div className="flex items-center justify-between text-slate-500 font-mono">
                    <span>Turn 2</span>
                    <span>(Intermediate)</span>
                  </div>
                  <div className="w-16 h-16 mx-auto grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="bg-slate-900 rounded" />
                    <div className="bg-slate-900 rounded" />
                    <div className="bg-slate-900 rounded" />
                    <div className="bg-slate-900 rounded" />
                    <div className="bg-indigo-500 rounded" />
                    <div className="bg-slate-900 rounded" />
                    <div className="bg-slate-900 rounded" />
                    <div className="bg-slate-900 rounded" />
                    <div className="bg-slate-900 rounded" />
                  </div>
                  <p className="text-center font-mono text-slate-400 font-bold">Letter 'H'</p>
                  <p className="text-[11px] text-slate-500 text-center">Center grid + 'H'</p>
                </div>
              )}

              <div className="p-3 bg-indigo-950/30 border border-indigo-500/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-indigo-400 font-mono font-bold">
                  <span>Turn {nValue + 1}</span>
                  <span>(CURRENT)</span>
                </div>
                <div className="w-16 h-16 mx-auto grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="bg-indigo-500 rounded ring-2 ring-indigo-400" />
                  <div className="bg-slate-900 rounded" />
                  <div className="bg-slate-900 rounded" />
                  <div className="bg-slate-900 rounded" />
                  <div className="bg-slate-900 rounded" />
                  <div className="bg-slate-900 rounded" />
                  <div className="bg-slate-900 rounded" />
                  <div className="bg-slate-900 rounded" />
                  <div className="bg-slate-900 rounded" />
                </div>
                <p className="text-center font-mono text-white font-bold">Letter 'K'</p>
                <div className="text-[11px] text-emerald-400 font-semibold text-center leading-tight">
                  MATCH! Same Top-Left square as Turn 1! Press [Position Match]
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300">
              <strong className="text-white">The Golden Rule:</strong> You are always comparing the <em>current</em> flash with the one that happened <strong>exactly {nValue} {nValue === 1 ? 'step' : 'steps'} ago</strong>. If the square is in the same spot, hit [A]. If the letter is the same, hit [L]. If neither is the same, do nothing!
            </div>
          </div>

          {/* Options & Start Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMemoryRibbon}
                  onChange={(e) => setShowMemoryRibbon(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <span>Visual Memory Ribbon (Recommended for Learning)</span>
              </label>

              <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-500 pl-1">Speed:</span>
                <button
                  onClick={() => setSpeedPace('relaxed')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                    speedPace === 'relaxed' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Relaxed (3.2s)
                </button>
                <button
                  onClick={() => setSpeedPace('standard')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                    speedPace === 'standard' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Standard (2.5s)
                </button>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Session</span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-8 space-y-4">
          {/* Top Bar HUD */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs md:text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span>Trial <strong className="text-white font-mono">{Math.min(TOTAL_TRIALS, currentTrialIdx + 1)}</strong> / {TOTAL_TRIALS}</span>
              <span aria-hidden="true">·</span>
              <span>Target: <strong className="text-indigo-400 font-mono">{nValue}-Back</strong></span>
              {currentTrialIdx < nValue && (
                <span className="text-amber-400 font-mono text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Buffer Warming Up ({currentTrialIdx + 1}/{nValue})
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span>Score: <strong className="text-white font-mono tabular-nums">{score}</strong></span>
              <button
                onClick={() => setShowMemoryRibbon(!showMemoryRibbon)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ribbon: {showMemoryRibbon ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Visual Memory Ribbon (Training Wheels to show history comparison) */}
          {showMemoryRibbon && currentTrialIdx >= 0 && (
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
                  Visual Memory Ribbon: Compare Step {currentTrialIdx + 1} with Step {Math.max(1, currentTrialIdx + 1 - nValue)}
                </span>
                <span className="font-mono text-slate-500">History Buffer</span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {Array.from({ length: nValue + 1 }).map((_, stepOffset) => {
                  const targetIdx = currentTrialIdx - (nValue - stepOffset);
                  const isCurrent = targetIdx === currentTrialIdx;
                  const isCompareTarget = targetIdx === currentTrialIdx - nValue;
                  const data = targetIdx >= 0 && targetIdx < trials.length ? trials[targetIdx] : null;

                  return (
                    <div
                      key={stepOffset}
                      className={`p-2 rounded-lg border flex items-center gap-2.5 shrink-0 ${
                        isCurrent
                          ? 'bg-indigo-950/40 border-indigo-500/60 shadow-sm'
                          : isCompareTarget
                          ? 'bg-amber-950/20 border-amber-500/40'
                          : 'bg-slate-900/60 border-slate-800/60 opacity-60'
                      }`}
                    >
                      <div className="w-9 h-9 grid grid-cols-3 gap-0.5 p-0.5 bg-slate-950 rounded border border-slate-800">
                        {Array.from({ length: 9 }).map((_, cellIdx) => (
                          <div
                            key={cellIdx}
                            className={`rounded-[2px] ${
                              data && data.position === cellIdx
                                ? isCurrent
                                  ? 'bg-indigo-500'
                                  : 'bg-amber-400'
                                : 'bg-slate-900'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="text-[11px] font-mono leading-tight">
                        <span className={`block font-bold ${isCurrent ? 'text-indigo-400' : isCompareTarget ? 'text-amber-400' : 'text-slate-400'}`}>
                          {isCurrent ? 'NOW' : targetIdx >= 0 ? `Step ${targetIdx + 1}` : '—'}
                        </span>
                        <span className="text-slate-300">
                          {data ? `'${data.letter}'` : '—'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Real-Time Reinforcement Feedback Banner */}
          {latestFeedback && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-3 transition-all animate-in fade-in duration-150 ${
                latestFeedback.type === 'hit'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : latestFeedback.type === 'false_alarm'
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  : latestFeedback.type === 'miss'
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {latestFeedback.type === 'hit' ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : latestFeedback.type === 'false_alarm' ? (
                  <X className="w-5 h-5 text-rose-400 animate-bounce" />
                ) : latestFeedback.type === 'miss' ? (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                ) : (
                  <Brain className="w-5 h-5 text-slate-400" />
                )}
              </div>

              <div className="text-xs">
                <span className="font-bold block text-sm">
                  {latestFeedback.title}
                </span>
                <p className="mt-0.5 leading-relaxed opacity-90">
                  {latestFeedback.details}
                </p>
              </div>
            </div>
          )}

          {/* Central Play Arena: 3x3 Grid & Audio Symbol */}
          <div className="flex flex-col items-center justify-center gap-6 my-2">
            <div className="relative">
              {/* 3x3 Spatial Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 w-64 h-64 md:w-80 md:h-80">
                {Array.from({ length: 9 }).map((_, idx) => {
                  const isActive = isStimulusActive && currentStim && currentStim.position === idx;
                  const isPreviousTarget = compareTargetStim && compareTargetStim.position === idx;

                  return (
                    <div
                      key={idx}
                      className={`rounded-xl transition-all duration-150 flex items-center justify-center border relative ${
                        isActive
                          ? 'bg-indigo-500 border-indigo-400 shadow-lg shadow-indigo-500/50 scale-95'
                          : isPreviousTarget && showMemoryRibbon
                          ? 'bg-slate-900/60 border-dashed border-amber-500/40'
                          : 'bg-slate-900/60 border-slate-800/80'
                      }`}
                    >
                      {isActive && (
                        <div className="w-3.5 h-3.5 rounded-full bg-white animate-ping" />
                      )}
                      {isPreviousTarget && !isActive && showMemoryRibbon && (
                        <span className="text-[10px] font-mono text-amber-400/60 font-bold">
                          t-{nValue}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Auditory / Letter Indicator Overlay */}
              <div className="absolute -bottom-4 right-1/2 translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-slate-900 border border-slate-700 rounded-full shadow-lg text-xs font-mono text-slate-300">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Letter: <strong className="text-white text-sm">{isStimulusActive && currentStim ? currentStim.letter : '—'}</strong></span>
                {compareTargetStim && showMemoryRibbon && (
                  <span className="text-[11px] text-amber-400/80">
                    (Target was: '{compareTargetStim.letter}')
                  </span>
                )}
              </div>
            </div>

            {/* Dual Response Buttons with Immediate Click State */}
            <div className="w-full max-w-md grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={handlePositionClick}
                className={`py-4 px-4 rounded-xl border font-medium text-sm transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                  pressedPos
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400'
                    : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {pressedPos && <Check className="w-4 h-4 text-emerald-300" />}
                  <span>Position Match</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {pressedPos ? '✓ Selected for this turn' : 'Press [A] if matches t - ' + nValue}
                </span>
              </button>

              <button
                onClick={handleAudioClick}
                className={`py-4 px-4 rounded-xl border font-medium text-sm transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                  pressedAudio
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400'
                    : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {pressedAudio && <Check className="w-4 h-4 text-emerald-200" />}
                  <span>Audio Match</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {pressedAudio ? '✓ Selected for this turn' : 'Press [L] if matches t - ' + nValue}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'SUMMARY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto">
            <Check className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Session Complete</h2>
            <p className="text-slate-400 text-sm">Dorsolateral Prefrontal Cortex (BA 9/46) Stimulated</p>
          </div>

          {/* Performance Breakdown Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Neuro Score</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">{score}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Position Hits</span>
              <span className="text-xl font-bold text-indigo-400 font-mono tabular-nums">{posHits}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Audio Hits</span>
              <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">{audioHits}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">False Alarms</span>
              <span className="text-xl font-bold text-rose-400 font-mono tabular-nums">{posFalseAlarms + audioFalseAlarms}</span>
            </div>
          </div>

          {/* Pedagogical Summary Rationale */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 max-w-xl mx-auto text-left text-xs space-y-2">
            <span className="font-semibold text-white block">Executive Load Takeaway:</span>
            <p className="text-slate-300 leading-relaxed">
              Your DLPFC was challenged to actively hold, update, and purge sensory buffers across {TOTAL_TRIALS} continuous stimuli. Maintaining high accuracy without false alarms is the primary marker of enhanced fluid intelligence ($G_f$).
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Train Again</span>
            </button>
            <button
              onClick={() => setGameState('TITLE_MENU')}
              className="px-5 py-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium rounded-xl transition-colors cursor-pointer"
            >
              Review Rules
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
