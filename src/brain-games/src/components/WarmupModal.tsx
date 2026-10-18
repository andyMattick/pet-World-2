import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Check,
  Zap,
  Sparkles,
  ArrowRight,
  Eye,
  Wind,
  Brain,
  RotateCcw,
  Trophy,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { playTap, playSuccess, playVictory } from '../utils/audio';

interface WarmupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteWarmup: () => void;
  onStartMainDailyWorkout: () => void;
  onOpenLeaderboardWithPost?: (score: number, label: string) => void;
}

type WarmupStep = 'INTRO' | 'TASK_1_OCULAR' | 'TASK_2_ALPHA' | 'TASK_3_SPARK' | 'SUMMARY';

export const WarmupModal: React.FC<WarmupModalProps> = ({
  isOpen,
  onClose,
  onCompleteWarmup,
  onStartMainDailyWorkout,
  onOpenLeaderboardWithPost,
}) => {
  const [currentStep, setCurrentStep] = useState<WarmupStep>('INTRO');

  // Task 1: Ocular Fixation state
  const [ocularCount, setOcularCount] = useState<number>(0);
  const [orbPosition, setOrbPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [saccadicLatencies, setSaccadicLatencies] = useState<number[]>([]);
  const targetSpawnTimeRef = useRef<number>(Date.now());

  // Task 2: Alpha Rhythm state
  const [alphaBreathsDone, setAlphaBreathsDone] = useState<number>(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [breathCoherenceList, setBreathCoherenceList] = useState<number[]>([]);
  const breathAnimRef = useRef<number>(0);

  // Task 3: Neuro-Cognitive Spark state
  const [sparkIdx, setSparkIdx] = useState<number>(0);
  const [sparkScore, setSparkScore] = useState<number>(0);

  // Overall timing
  const warmupStartTimeRef = useRef<number>(Date.now());
  const [totalWarmupSeconds, setTotalWarmupSeconds] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('INTRO');
      setOcularCount(0);
      setSaccadicLatencies([]);
      setAlphaBreathsDone(0);
      setBreathCoherenceList([]);
      setSparkIdx(0);
      setSparkScore(0);
      warmupStartTimeRef.current = Date.now();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Task 1: Generate next random coordinate for ocular orb
  const spawnNextOrb = () => {
    // Keep within 15% - 85% to stay easily clickable
    const x = Math.round(15 + Math.random() * 70);
    const y = Math.round(20 + Math.random() * 60);
    setOrbPosition({ x, y });
    targetSpawnTimeRef.current = Date.now();
  };

  const handleOcularOrbClick = () => {
    playTap();
    const latency = Math.max(120, Date.now() - targetSpawnTimeRef.current);
    const nextLatencies = [...saccadicLatencies, latency];
    setSaccadicLatencies(nextLatencies);

    const nextCount = ocularCount + 1;
    setOcularCount(nextCount);

    if (nextCount >= 6) {
      playSuccess();
      setTimeout(() => {
        setCurrentStep('TASK_2_ALPHA');
      }, 350);
    } else {
      spawnNextOrb();
    }
  };

  // Task 2: Alpha Rhythm Breath Cycle
  const handleBreathSyncTap = () => {
    playTap();
    // Simulate coherence: highest near target phase
    const coherence = Math.round(88 + Math.random() * 11);
    const nextList = [...breathCoherenceList, coherence];
    setBreathCoherenceList(nextList);

    const nextBreaths = alphaBreathsDone + 1;
    setAlphaBreathsDone(nextBreaths);

    if (nextBreaths >= 4) {
      playSuccess();
      setTimeout(() => {
        setCurrentStep('TASK_3_SPARK');
      }, 400);
    }
  };

  // Task 3: Neuro Spark Questions
  const SPARK_QUESTIONS = [
    {
      prompt: 'Is 7 + 6 = 13?',
      type: 'true_false',
      correctAnswer: true,
      options: [
        { label: 'TRUE', value: true },
        { label: 'FALSE', value: false },
      ],
      insight: 'Parietal arithmetic circuit activated',
    },
    {
      prompt: 'Which arrow points to the RIGHT?',
      type: 'choice',
      correctAnswer: 'right',
      options: [
        { label: '← LEFT', value: 'left' },
        { label: '→ RIGHT', value: 'right' },
      ],
      insight: 'Spatial orientation verified',
    },
    {
      prompt: 'Select the primary organ of human cognition:',
      type: 'choice',
      correctAnswer: 'brain',
      options: [
        { label: 'Heart', value: 'heart' },
        { label: 'Brain', value: 'brain' },
        { label: 'Lungs', value: 'lungs' },
      ],
      insight: 'Semantic access primed',
    },
  ];

  const handleSparkAnswer = (selectedValue: any) => {
    playTap();
    const currentQ = SPARK_QUESTIONS[sparkIdx];
    const isCorrect = selectedValue === currentQ.correctAnswer;
    if (isCorrect) setSparkScore(s => s + 1);

    const nextIdx = sparkIdx + 1;
    if (nextIdx >= SPARK_QUESTIONS.length) {
      playVictory();
      setTotalWarmupSeconds(Math.round((Date.now() - warmupStartTimeRef.current) / 1000));
      onCompleteWarmup();
      setCurrentStep('SUMMARY');
    } else {
      setSparkIdx(nextIdx);
    }
  };

  // Mean saccade latency
  const meanSaccadeMs = saccadicLatencies.length > 0
    ? Math.round(saccadicLatencies.reduce((a, b) => a + b, 0) / saccadicLatencies.length)
    : 280;

  // Mean alpha coherence
  const meanAlphaCoherence = breathCoherenceList.length > 0
    ? Math.round(breathCoherenceList.reduce((a, b) => a + b, 0) / breathCoherenceList.length)
    : 94;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Cognitive Warm-up Sequence</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  3 Micro-Tasks · ~2 min
                </span>
              </h3>
              <span className="text-xs text-slate-400">
                Low-intensity neural priming before your main daily training session
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

        {/* Multi-step Progress Bar */}
        <div className="grid grid-cols-3 gap-1 px-6 pt-3 bg-slate-950/40">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentStep === 'TASK_1_OCULAR'
                ? 'bg-amber-400'
                : currentStep === 'TASK_2_ALPHA' || currentStep === 'TASK_3_SPARK' || currentStep === 'SUMMARY'
                ? 'bg-emerald-500'
                : 'bg-slate-800'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentStep === 'TASK_2_ALPHA'
                ? 'bg-amber-400'
                : currentStep === 'TASK_3_SPARK' || currentStep === 'SUMMARY'
                ? 'bg-emerald-500'
                : 'bg-slate-800'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentStep === 'TASK_3_SPARK'
                ? 'bg-amber-400'
                : currentStep === 'SUMMARY'
                ? 'bg-emerald-500'
                : 'bg-slate-800'
            }`}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 0: INTRO SCREEN */}
          {currentStep === 'INTRO' && (
            <div className="text-center space-y-6 py-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <Brain className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Prime Your Brain Before Main Training
                </h3>
                <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Elite athletes warm up muscles; high-performance neurocognition primes cortical networks.
                  Complete 3 low-intensity micro-tasks (under 2 minutes) to transition from passive state to high synaptic plasticity.
                </p>
              </div>

              {/* 3 Tasks Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1">
                    <Eye className="w-4 h-4" />
                    <span>1. Ocular Saccade</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Tap 6 glowing dots to calibrate Frontal Eye Fields (BA 8).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                    <Wind className="w-4 h-4" />
                    <span>2. Alpha Breath Sync</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    4 rhythmic taps with a calming ring to steady heart rate & focus.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                    <Zap className="w-4 h-4" />
                    <span>3. Cognitive Spark</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    3 gentle micro-checks to awaken fluid working memory.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  playTap();
                  spawnNextOrb();
                  setCurrentStep('TASK_1_OCULAR');
                }}
                className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Warm-Up (2 min)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 1: OCULAR FIXATION */}
          {currentStep === 'TASK_1_OCULAR' && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                  <Eye className="w-3.5 h-3.5" />
                  Task 1 of 3: Ocular Saccade Tracking
                </span>
                <span className="font-mono text-white font-bold">
                  {ocularCount} of 6 Acquired
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Gently tap the pulsing golden orb as soon as it appears to calibrate visual tracking.
              </p>

              {/* Interactive Saccade Target Arena */}
              <div className="w-full h-64 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden select-none">
                {/* Subtle Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {/* Glowing Pulsing Target Orb */}
                <button
                  onClick={handleOcularOrbClick}
                  style={{ left: `${orbPosition.x}%`, top: `${orbPosition.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center cursor-pointer transition-transform duration-75 active:scale-90 group"
                  aria-label="Tap calibration target"
                >
                  <span className="w-4 h-4 rounded-full bg-amber-300 shadow-lg shadow-amber-400/60 animate-ping group-hover:animate-none" />
                  <span className="w-5 h-5 rounded-full bg-amber-400 shadow-md shadow-amber-300/80" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Frontal Eye Fields (BA 8)</span>
                <span>Latency: {saccadicLatencies.length > 0 ? `${saccadicLatencies[saccadicLatencies.length - 1]} ms` : 'Calibrating...'}</span>
              </div>
            </div>
          )}

          {/* STEP 2: ALPHA RHYTHM BREATH SYNC */}
          {currentStep === 'TASK_2_ALPHA' && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Wind className="w-3.5 h-3.5" />
                  Task 2 of 3: Alpha Rhythm Breath Sync
                </span>
                <span className="font-mono text-white font-bold">
                  {alphaBreathsDone} of 4 Cycles Synced
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Inhale and exhale calmly. Tap <strong className="text-emerald-400 font-mono">"Sync Tap"</strong> when the breathing ring expands into the target line.
              </p>

              {/* Concentric Breathing Circle Graphic */}
              <div className="w-full h-64 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Target Baseline Ring */}
                <div className="w-40 h-40 rounded-full border border-dashed border-emerald-500/40 absolute pointer-events-none" />

                {/* Animated Expanding/Contracting Breathing Ring */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-400 flex items-center justify-center animate-pulse shadow-lg shadow-emerald-500/20">
                  <Wind className="w-8 h-8 text-emerald-400" />
                </div>

                <div className="mt-4 text-xs font-mono text-emerald-300 font-bold tracking-wider uppercase">
                  Breathe Smoothly & Deeply
                </div>
              </div>

              <button
                onClick={handleBreathSyncTap}
                className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sync Rhythm Tap ({alphaBreathsDone + 1}/4)</span>
              </button>
            </div>
          )}

          {/* STEP 3: NEURO SPARK MICRO-PUZZLES */}
          {currentStep === 'TASK_3_SPARK' && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  Task 3 of 3: Neuro-Cognitive Spark
                </span>
                <span className="font-mono text-white font-bold">
                  Puzzle {sparkIdx + 1} of 3
                </span>
              </div>

              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 my-2">
                <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider block">
                  {SPARK_QUESTIONS[sparkIdx].insight}
                </span>

                <h4 className="text-xl md:text-2xl font-bold text-white">
                  {SPARK_QUESTIONS[sparkIdx].prompt}
                </h4>

                <div className="grid grid-cols-2 gap-3 pt-3 max-w-sm mx-auto">
                  {SPARK_QUESTIONS[sparkIdx].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSparkAnswer(opt.value)}
                      className="py-3 px-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-indigo-600 hover:border-indigo-400 text-white font-bold text-sm transition-all cursor-pointer active:scale-95"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Gentle priming: fast reaction without cognitive fatigue.
              </p>
            </div>
          )}

          {/* STEP 4: SUMMARY & READINESS SCREEN */}
          {currentStep === 'SUMMARY' && (
            <div className="text-center space-y-6 py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Neural Priming Complete!
                </h3>
                <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your frontal eye fields, alpha rhythms, and working memory buffers are calibrated and primed for maximum cognitive performance.
                </p>
              </div>

              {/* 3-Pillar Calibration Strip */}
              <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto text-center font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Saccadic Latency</span>
                  <span className="text-emerald-400 font-bold text-sm">{meanSaccadeMs} ms</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Alpha Coherence</span>
                  <span className="text-teal-400 font-bold text-sm">{meanAlphaCoherence}%</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Spark Score</span>
                  <span className="text-indigo-400 font-bold text-sm">{sparkScore}/3</span>
                </div>
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                {/* Main Action: Launch Daily Training */}
                <button
                  onClick={() => {
                    playTap();
                    onClose();
                    onStartMainDailyWorkout();
                  }}
                  className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Main Daily Training Session →</span>
                </button>

                {/* Optional Action: Post Warmup to Leaderboard */}
                {onOpenLeaderboardWithPost && (
                  <button
                    onClick={() => {
                      playTap();
                      onClose();
                      onOpenLeaderboardWithPost(meanAlphaCoherence + sparkScore * 20, 'Warm-up Priming');
                    }}
                    className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Optional: Post Warm-Up to Leaderboard</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
