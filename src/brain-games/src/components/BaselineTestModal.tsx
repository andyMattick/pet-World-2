import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BaselineResult, UserStats } from '../types/game';
import { saveBaselineResult } from '../utils/storage';
import { playSuccess, playError, playTap, playVictory } from '../utils/audio';
import {
  X,
  Play,
  Brain,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Eye,
  Calculator,
  Compass,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

interface BaselineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBaselineComplete: (result: BaselineResult) => void;
  onLaunchGame: (gameId: string) => void;
}

type BaselineStage = 'INTRO' | 'FLANKER' | 'STROOP' | 'CHIMP' | 'SPEED_CALC' | 'RESULTS';

export const BaselineTestModal: React.FC<BaselineModalProps> = ({
  isOpen,
  onClose,
  onBaselineComplete,
  onLaunchGame,
}) => {
  const [stage, setStage] = useState<BaselineStage>('INTRO');

  // Stage 1: Flanker Task (8 trials)
  const [flankerTrialIdx, setFlankerTrialIdx] = useState<number>(0);
  const [flankerRTs, setFlankerRTs] = useState<number[]>([]);
  const [flankerCorrect, setFlankerCorrect] = useState<number>(0);
  const [currentFlanker, setCurrentFlanker] = useState<{ target: 'LEFT' | 'RIGHT'; flank: 'LEFT' | 'RIGHT' }>({
    target: 'LEFT',
    flank: 'RIGHT',
  });
  const flankerStartTime = useRef<number>(0);

  // Stage 2: Stroop Clash (8 trials)
  const [stroopTrialIdx, setStroopTrialIdx] = useState<number>(0);
  const [stroopRTs, setStroopRTs] = useState<number[]>([]);
  const [stroopCorrect, setStroopCorrect] = useState<number>(0);
  const [currentStroop, setCurrentStroop] = useState<{ word: string; colorHex: string; targetId: string }>({
    word: 'BLUE',
    colorHex: '#ef4444',
    targetId: 'red',
  });
  const stroopStartTime = useRef<number>(0);

  // Stage 3: Chimp Memory (2 rounds: 4 items, then 6 items)
  const [chimpRound, setChimpRound] = useState<number>(1);
  const [chimpGrid, setChimpGrid] = useState<Array<{ val: number | null; masked: boolean; cleared: boolean }>>([]);
  const [chimpExpected, setChimpExpected] = useState<number>(1);
  const [chimpSuccesses, setChimpSuccesses] = useState<number>(0);

  // Stage 4: Speed Calc (6 trials)
  const [calcTrialIdx, setCalcTrialIdx] = useState<number>(0);
  const [calcCorrect, setCalcCorrect] = useState<number>(0);
  const [calcRTs, setCalcRTs] = useState<number[]>([]);
  const [currentCalc, setCurrentCalc] = useState<{ eq: string; res: number; isTrue: boolean }>({
    eq: '18 + 15',
    res: 33,
    isTrue: true,
  });
  const calcStartTime = useRef<number>(0);

  // Final Results
  const [finalReport, setFinalReport] = useState<BaselineResult | null>(null);

  if (!isOpen) return null;

  // --- STAGE 1: FLANKER LOGIC ---
  const startFlanker = () => {
    playTap();
    setStage('FLANKER');
    setFlankerTrialIdx(0);
    setFlankerRTs([]);
    setFlankerCorrect(0);
    nextFlankerTrial();
  };

  const nextFlankerTrial = () => {
    const target: 'LEFT' | 'RIGHT' = Math.random() < 0.5 ? 'LEFT' : 'RIGHT';
    const flank: 'LEFT' | 'RIGHT' = Math.random() < 0.5 ? target : target === 'LEFT' ? 'RIGHT' : 'LEFT';
    setCurrentFlanker({ target, flank });
    flankerStartTime.current = Date.now();
  };

  const handleFlankerAnswer = (dir: 'LEFT' | 'RIGHT') => {
    const rt = Date.now() - flankerStartTime.current;
    const isCorrect = dir === currentFlanker.target;
    if (isCorrect) {
      playSuccess();
      setFlankerCorrect(c => c + 1);
    } else {
      playError();
    }
    setFlankerRTs(prev => [...prev, rt]);

    if (flankerTrialIdx + 1 >= 8) {
      // Move to Stroop
      startStroop();
    } else {
      setFlankerTrialIdx(i => i + 1);
      setTimeout(nextFlankerTrial, 150);
    }
  };

  // --- STAGE 2: STROOP LOGIC ---
  const startStroop = () => {
    setStage('STROOP');
    setStroopTrialIdx(0);
    setStroopRTs([]);
    setStroopCorrect(0);
    nextStroopTrial();
  };

  const STROOP_OPTIONS = [
    { id: 'red', name: 'RED', hex: '#ff334b' },
    { id: 'blue', name: 'BLUE', hex: '#38bdf8' },
    { id: 'green', name: 'GREEN', hex: '#22c55e' },
    { id: 'yellow', name: 'YELLOW', hex: '#fde047' },
  ];

  const nextStroopTrial = () => {
    const wordItem = STROOP_OPTIONS[Math.floor(Math.random() * STROOP_OPTIONS.length)];
    let colorItem = STROOP_OPTIONS[Math.floor(Math.random() * STROOP_OPTIONS.length)];
    // Make 80% incongruent
    if (colorItem.id === wordItem.id) {
      colorItem = STROOP_OPTIONS.find(o => o.id !== wordItem.id) || colorItem;
    }
    setCurrentStroop({
      word: wordItem.name,
      colorHex: colorItem.hex,
      targetId: colorItem.id,
    });
    stroopStartTime.current = Date.now();
  };

  const handleStroopAnswer = (selectedId: string) => {
    const rt = Date.now() - stroopStartTime.current;
    const isCorrect = selectedId === currentStroop.targetId;
    if (isCorrect) {
      playSuccess();
      setStroopCorrect(c => c + 1);
    } else {
      playError();
    }
    setStroopRTs(prev => [...prev, rt]);

    if (stroopTrialIdx + 1 >= 8) {
      startChimp();
    } else {
      setStroopTrialIdx(i => i + 1);
      setTimeout(nextStroopTrial, 180);
    }
  };

  // --- STAGE 3: CHIMP SPAN LOGIC ---
  const startChimp = () => {
    setStage('CHIMP');
    setChimpRound(1);
    setChimpSuccesses(0);
    setupChimpRound(4);
  };

  const setupChimpRound = (count: number) => {
    const gridArr = Array.from({ length: 16 }, () => ({ val: null as number | null, masked: false, cleared: false }));
    const indices = Array.from({ length: 16 }, (_, i) => i).sort(() => Math.random() - 0.5);

    for (let i = 1; i <= count; i++) {
      gridArr[indices[i - 1]].val = i;
    }
    setChimpGrid(gridArr);
    setChimpExpected(1);
  };

  const handleChimpClick = (cellIdx: number) => {
    const tile = chimpGrid[cellIdx];
    if (!tile.val || tile.cleared) return;

    if (tile.val === chimpExpected) {
      playTap();
      const updated = [...chimpGrid];
      updated[cellIdx] = { ...tile, cleared: true, masked: false };

      // Mask all other tiles after 1st click
      if (chimpExpected === 1) {
        updated.forEach((t, i) => {
          if (t.val && t.val !== 1) updated[i].masked = true;
        });
      }
      setChimpGrid(updated);

      const targetMax = chimpRound === 1 ? 4 : 6;
      if (chimpExpected === targetMax) {
        playSuccess();
        setChimpSuccesses(s => s + 1);
        if (chimpRound === 1) {
          setTimeout(() => {
            setChimpRound(2);
            setupChimpRound(6);
          }, 600);
        } else {
          setTimeout(startCalc, 600);
        }
      } else {
        setChimpExpected(e => e + 1);
      }
    } else {
      playError();
      if (chimpRound === 1) {
        setTimeout(() => {
          setChimpRound(2);
          setupChimpRound(6);
        }, 600);
      } else {
        setTimeout(startCalc, 600);
      }
    }
  };

  // --- STAGE 4: SPEED CALC LOGIC ---
  const startCalc = () => {
    setStage('SPEED_CALC');
    setCalcTrialIdx(0);
    setCalcCorrect(0);
    setCalcRTs([]);
    nextCalcTrial();
  };

  const nextCalcTrial = () => {
    const a = Math.floor(Math.random() * 30) + 10;
    const b = Math.floor(Math.random() * 25) + 5;
    const isPlus = Math.random() < 0.5;
    const realRes = isPlus ? a + b : a - b;
    const isTrue = Math.random() < 0.5;
    const displayed = isTrue ? realRes : realRes + (Math.random() < 0.5 ? 2 : -2);

    setCurrentCalc({
      eq: `${a} ${isPlus ? '+' : '−'} ${b}`,
      res: displayed,
      isTrue,
    });
    calcStartTime.current = Date.now();
  };

  const handleCalcAnswer = (userSaysTrue: boolean) => {
    const rt = Date.now() - calcStartTime.current;
    const isCorrect = userSaysTrue === currentCalc.isTrue;
    if (isCorrect) {
      playSuccess();
      setCalcCorrect(c => c + 1);
    } else {
      playError();
    }
    setCalcRTs(prev => [...prev, rt]);

    if (calcTrialIdx + 1 >= 6) {
      // Calculate overall baseline report
      finalizeBaseline();
    } else {
      setCalcTrialIdx(i => i + 1);
      setTimeout(nextCalcTrial, 150);
    }
  };

  // --- FINALIZE REPORT & PRESCRIPTION ---
  const finalizeBaseline = () => {
    playVictory();

    // 1. Processing Speed (Flanker RT & accuracy)
    const avgFlankerRt = flankerRTs.length > 0 ? flankerRTs.reduce((a, b) => a + b, 0) / flankerRTs.length : 600;
    const procSpeedScore = Math.max(30, Math.min(100, Math.round(((850 - avgFlankerRt) / 500) * 100 * 0.7 + (flankerCorrect / 8) * 30)));

    // 2. Inhibitory Control (Stroop accuracy & speed)
    const avgStroopRt = stroopRTs.length > 0 ? stroopRTs.reduce((a, b) => a + b, 0) / stroopRTs.length : 900;
    const inhibScore = Math.max(30, Math.min(100, Math.round((stroopCorrect / 8) * 70 + ((1400 - avgStroopRt) / 1000) * 30)));

    // 3. Working Memory (Chimp span)
    const wmScore = chimpSuccesses === 2 ? 94 : chimpSuccesses === 1 ? 75 : 52;

    // 4. Mental Agility (Speed calc accuracy & speed)
    const calcScore = Math.max(30, Math.min(100, Math.round((calcCorrect / 6) * 80 + 20)));

    const overall = Math.round((procSpeedScore + inhibScore + wmScore + calcScore) / 4);

    // Identify strongest and growth domains
    const scores = [
      { name: 'Processing Speed', score: procSpeedScore, region: 'Pre-SMA (BA 6/8)' },
      { name: 'Inhibitory Control', score: inhibScore, region: 'Anterior Cingulate (BA 24/32)' },
      { name: 'Working Memory', score: wmScore, region: 'Dorsolateral PFC & Hippocampus' },
      { name: 'Mental Calculation', score: calcScore, region: 'Intraparietal Sulcus (BA 39/40)' },
    ];
    scores.sort((a, b) => b.score - a.score);

    const strongest = scores[0];
    const growth = scores[scores.length - 1];

    // Prescribe targeted pathway
    let prescribedPath = {
      id: 'executive-focus',
      name: 'Executive Memory & Focus Pathway',
      description: 'Prescribed to reinforce working memory buffers and conflict inhibition in frontoparietal networks.',
      recommendedGameIds: ['dual-n-back', 'stroop-clash', 'chimp-memory'],
    };

    if (growth.name === 'Processing Speed') {
      prescribedPath = {
        id: 'synaptic-speed',
        name: 'Synaptic Velocity & Reaction Pathway',
        description: 'Prescribed to accelerate saltatory axonal conduction and reduce peripheral interference.',
        recommendedGameIds: ['flanker-task', 'speed-calc', 'trail-making'],
      };
    } else if (growth.name === 'Mental Calculation') {
      prescribedPath = {
        id: 'parietal-agility',
        name: 'Parietal Calculation & Induction Pathway',
        description: 'Prescribed to stimulate spatial-numerical representations and inductive matrix logic.',
        recommendedGameIds: ['speed-calc', 'pattern-matrix', 'word-fluency'],
      };
    }

    const baselineData: BaselineResult = {
      completedAt: new Date().toISOString(),
      overallScore: overall,
      domainScores: {
        processingSpeed: procSpeedScore,
        inhibitoryControl: inhibScore,
        workingMemory: wmScore,
        mentalAgility: calcScore,
      },
      strongestDomain: `${strongest.name} (${strongest.region})`,
      growthDomain: `${growth.name} (${growth.region})`,
      prescribedPath,
    };

    saveBaselineResult(baselineData);
    setFinalReport(baselineData);
    onBaselineComplete(baselineData);
    setStage('RESULTS');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Clinical Cognitive Baseline Probe</h3>
              <span className="text-xs text-slate-400">
                {stage === 'INTRO'
                  ? '3-Minute Standardized Assessment'
                  : stage === 'RESULTS'
                  ? 'Evaluation Complete'
                  : `Stage ${stage === 'FLANKER' ? '1 of 4' : stage === 'STROOP' ? '2 of 4' : stage === 'CHIMP' ? '3 of 4' : '4 of 4'}`}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {stage === 'INTRO' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Map Your Neural Baseline
                </h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                  Before starting your regimen, this 3-minute diagnostic assesses 4 vital neural networks to prescribe your ideal custom brain training path:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-left text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-semibold text-orange-400 block mb-0.5">1. Saccadic Reaction</span>
                  <span className="text-slate-400">Flanker array peripheral suppression</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-semibold text-rose-400 block mb-0.5">2. Conflict Inhibition</span>
                  <span className="text-slate-400">Stroop color-word interference</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-semibold text-amber-400 block mb-0.5">3. Spatial Iconic Span</span>
                  <span className="text-slate-400">Rapid masked numerical memory</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-semibold text-cyan-400 block mb-0.5">4. Synaptic Agility</span>
                  <span className="text-slate-400">Parietal arithmetic verification</span>
                </div>
              </div>

              <button
                onClick={startFlanker}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Begin Baseline Diagnostic</span>
              </button>
            </div>
          )}

          {stage === 'FLANKER' && (
            <div className="text-center space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span>Stage 1: Processing Speed & Reaction</span>
                <span className="font-mono">Trial {flankerTrialIdx + 1} / 8</span>
              </div>

              <p className="text-xs text-slate-300">
                Focus strictly on the <strong className="text-orange-400">CENTER arrow</strong>. Tap Left or Right to match its direction.
              </p>

              <div className="h-40 flex items-center justify-center bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 md:gap-4 text-4xl md:text-5xl font-mono">
                  <span className="text-slate-600">{currentFlanker.flank === 'LEFT' ? '←' : '→'}</span>
                  <span className="text-slate-600">{currentFlanker.flank === 'LEFT' ? '←' : '→'}</span>
                  <span className="text-orange-400 font-bold scale-110">{currentFlanker.target === 'LEFT' ? '←' : '→'}</span>
                  <span className="text-slate-600">{currentFlanker.flank === 'LEFT' ? '←' : '→'}</span>
                  <span className="text-slate-600">{currentFlanker.flank === 'LEFT' ? '←' : '→'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleFlankerAnswer('LEFT')}
                  className="py-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer"
                >
                  ← LEFT
                </button>
                <button
                  onClick={() => handleFlankerAnswer('RIGHT')}
                  className="py-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer"
                >
                  RIGHT →
                </button>
              </div>
            </div>
          )}

          {stage === 'STROOP' && (
            <div className="text-center space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span>Stage 2: Conflict Inhibition</span>
                <span className="font-mono">Trial {stroopTrialIdx + 1} / 8</span>
              </div>

              <p className="text-xs text-slate-300">
                Tap the <strong className="text-rose-400">INK COLOR</strong>, not what the word says!
              </p>

              <div className="h-40 flex items-center justify-center bg-slate-950 rounded-xl border border-slate-800">
                <span
                  className="text-5xl font-black tracking-wider"
                  style={{ color: currentStroop.colorHex }}
                >
                  {currentStroop.word}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STROOP_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleStroopAnswer(opt.id)}
                    className="py-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold text-xs text-slate-200"
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: opt.hex }} />
                    <span>{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {stage === 'CHIMP' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span>Stage 3: Spatial Iconic Span</span>
                <span className="font-mono">Round {chimpRound} / 2 ({chimpRound === 1 ? '4 items' : '6 items'})</span>
              </div>

              <p className="text-xs text-slate-300">
                Tapping "1" masks all other squares. Remember and tap in ascending sequence (1, 2, 3...).
              </p>

              <div className="flex justify-center my-2">
                <div className="grid grid-cols-4 gap-2.5 p-3 bg-slate-950 rounded-xl border border-slate-800 w-64 h-64">
                  {chimpGrid.map((cell, idx) => {
                    const hasVal = cell.val !== null;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleChimpClick(idx)}
                        disabled={!hasVal || cell.cleared}
                        className={`rounded-lg font-mono text-base font-bold flex items-center justify-center transition-all cursor-pointer ${
                          cell.cleared
                            ? 'bg-transparent border-transparent opacity-0 cursor-default'
                            : cell.masked
                            ? 'bg-white hover:bg-slate-100 text-transparent border border-slate-300 shadow-sm'
                            : hasVal
                            ? 'bg-slate-900 border border-amber-500/50 text-amber-400'
                            : 'bg-slate-900/30 border border-slate-800/30 cursor-default'
                        }`}
                      >
                        {hasVal && !cell.masked && !cell.cleared ? cell.val : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {stage === 'SPEED_CALC' && (
            <div className="text-center space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span>Stage 4: Numerical Synaptic Velocity</span>
                <span className="font-mono">Trial {calcTrialIdx + 1} / 6</span>
              </div>

              <p className="text-xs text-slate-300">
                Is the equation mathematically TRUE or FALSE?
              </p>

              <div className="h-40 flex items-center justify-center bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-3xl md:text-4xl font-mono font-bold text-white">
                  {currentCalc.eq} = <span className="text-cyan-400">{currentCalc.res}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleCalcAnswer(false)}
                  className="py-3.5 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/30 text-rose-400 font-bold rounded-xl transition-all cursor-pointer"
                >
                  FALSE
                </button>
                <button
                  onClick={() => handleCalcAnswer(true)}
                  className="py-3.5 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl transition-all cursor-pointer"
                >
                  TRUE
                </button>
              </div>
            </div>
          )}

          {stage === 'RESULTS' && finalReport && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Baseline Diagnostic Complete
                </h3>
                <p className="text-xs text-slate-400">
                  Your personalized cognitive profile and prescribed pathway are ready.
                </p>
              </div>

              {/* Overall Score & Domain Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Reaction Speed</span>
                  <span className="text-lg font-bold text-orange-400 font-mono tabular-nums">
                    {finalReport.domainScores.processingSpeed}%
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Inhibition</span>
                  <span className="text-lg font-bold text-rose-400 font-mono tabular-nums">
                    {finalReport.domainScores.inhibitoryControl}%
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Working Memory</span>
                  <span className="text-lg font-bold text-amber-400 font-mono tabular-nums">
                    {finalReport.domainScores.workingMemory}%
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Mental Agility</span>
                  <span className="text-lg font-bold text-cyan-400 font-mono tabular-nums">
                    {finalReport.domainScores.mentalAgility}%
                  </span>
                </div>
              </div>

              {/* Clinical Insights */}
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                  <span className="text-emerald-400 font-semibold block mb-0.5">Strongest Neural Asset:</span>
                  <span className="text-slate-200">{finalReport.strongestDomain}</span>
                </div>

                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                  <span className="text-amber-400 font-semibold block mb-0.5">Primary Neuroplasticity Target:</span>
                  <span className="text-slate-200">{finalReport.growthDomain}</span>
                </div>
              </div>

              {/* Prescribed Training Path Card */}
              <div className="p-4 bg-indigo-950/30 border border-indigo-500/40 rounded-xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
                    Prescribed Training Pathway
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  {finalReport.prescribedPath.name}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {finalReport.prescribedPath.description}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onLaunchGame(finalReport.prescribedPath.recommendedGameIds[0]);
                    }}
                    className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Prescribed Game</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 cursor-pointer"
                  >
                    Apply Path to Catalog
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {stage !== 'RESULTS' && (
          <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
            <span>Calibrating baseline... no impact on public scores.</span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
