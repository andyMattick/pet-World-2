import React, { useState, useEffect } from 'react';
import { MathConfig, MathOperation } from '../types';
import { 
  OPERATION_META, 
  LEVEL_NAMES, 
  getExampleProblem, 
  DEFAULT_MATH_CONFIG 
} from '../game/mathChallenge';
import { 
  BookOpen, 
  Sparkles, 
  Check, 
  X, 
  Shuffle, 
  Clock, 
  Sliders, 
  GraduationCap, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface MathSettingsModalProps {
  isOpen: boolean;
  config: MathConfig;
  onSave: (config: MathConfig) => void;
  onClose: () => void;
}

const PRESETS: {
  title: string;
  badge: string;
  desc: string;
  config: Partial<MathConfig>;
}[] = [
  {
    title: 'Grades 1–2: Addition & Subtraction',
    badge: 'Elementary',
    desc: 'Focuses on basic facts, sums to 20, and two-digit subtraction without heavy carries.',
    config: {
      operations: ['ADDITION', 'SUBTRACTION'],
      minLevel: 1,
      maxLevel: 3,
    },
  },
  {
    title: 'Grades 3–4: Times Tables & Division',
    badge: 'Intermediate',
    desc: 'Multiplication facts 2–12 and whole number division facts without remainders.',
    config: {
      operations: ['MULTIPLICATION', 'DIVISION'],
      minLevel: 2,
      maxLevel: 5,
    },
  },
  {
    title: 'Grade 5: All 4 Operations',
    badge: 'Fleet Standard',
    desc: 'Balanced mix of double-digit addition, subtraction, times tables, and division.',
    config: {
      operations: ['ADDITION', 'SUBTRACTION', 'MULTIPLICATION', 'DIVISION'],
      minLevel: 3,
      maxLevel: 7,
    },
  },
  {
    title: 'Middle School: Order of Operations (PEMDAS)',
    badge: 'Pre-Algebra',
    desc: 'Master parenthetical expressions, operator precedence, and multi-step equations.',
    config: {
      operations: ['ORDER_OF_OPERATIONS'],
      minLevel: 4,
      maxLevel: 9,
    },
  },
  {
    title: 'Pirate King: Grandmaster All-In',
    badge: 'Full Challenge',
    desc: 'Every operation from Level 1 up to Level 10 multi-step equations.',
    config: {
      operations: ['ADDITION', 'SUBTRACTION', 'MULTIPLICATION', 'DIVISION', 'ORDER_OF_OPERATIONS'],
      minLevel: 1,
      maxLevel: 10,
    },
  },
];

export const MathSettingsModal: React.FC<MathSettingsModalProps> = ({
  isOpen,
  config,
  onSave,
  onClose,
}) => {
  const [selectedOps, setSelectedOps] = useState<MathOperation[]>(config.operations);
  const [minLvl, setMinLvl] = useState<number>(config.minLevel);
  const [maxLvl, setMaxLvl] = useState<number>(config.maxLevel);
  const [timedMode, setTimedMode] = useState<boolean>(config.timedMode);
  const [timeLimit, setTimeLimit] = useState<number>(config.timeLimitSeconds || 45);
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setSelectedOps(config.operations);
      setMinLvl(config.minLevel);
      setMaxLvl(config.maxLevel);
      setTimedMode(config.timedMode);
      setTimeLimit(config.timeLimitSeconds || 45);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const toggleOp = (op: MathOperation) => {
    soundEngine.playClick();
    if (selectedOps.includes(op)) {
      if (selectedOps.length === 1) return; // keep at least one
      setSelectedOps(selectedOps.filter(o => o !== op));
    } else {
      setSelectedOps([...selectedOps, op]);
    }
  };

  const handleMinLvlChange = (val: number) => {
    const clamped = Math.max(1, Math.min(10, val));
    setMinLvl(clamped);
    if (clamped > maxLvl) {
      setMaxLvl(clamped);
    }
  };

  const handleMaxLvlChange = (val: number) => {
    const clamped = Math.max(1, Math.min(10, val));
    setMaxLvl(clamped);
    if (clamped < minLvl) {
      setMinLvl(clamped);
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    soundEngine.playClick();
    if (preset.config.operations) setSelectedOps(preset.config.operations);
    if (preset.config.minLevel) setMinLvl(preset.config.minLevel);
    if (preset.config.maxLevel) setMaxLvl(preset.config.maxLevel);
  };

  const handleSave = () => {
    soundEngine.playClick();
    onSave({
      operations: selectedOps,
      minLevel: minLvl,
      maxLevel: maxLvl,
      timedMode,
      timeLimitSeconds: timeLimit,
    });
    onClose();
  };

  // Generate dynamic live example problems based on currently selected configuration
  const previewExamples = selectedOps.map(op => {
    const sampleLevel = Math.floor((minLvl + maxLvl) / 2);
    const ex = getExampleProblem(op, sampleLevel);
    return {
      op,
      meta: OPERATION_META[op],
      level: sampleLevel,
      ...ex,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-amber-500/20 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-serif text-amber-300">
                Math Curriculum & Cipher Settings
              </h2>
              <p className="text-xs text-slate-400">
                Customize operations, difficulty range, and preview example problems
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Section 1: Quick Grade Presets */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Grade & Skill Presets
              </span>
              <span className="text-[11px] text-slate-400">Click to auto-configure</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESETS.map((p, idx) => {
                const isActive =
                  selectedOps.length === p.config.operations?.length &&
                  selectedOps.every(o => p.config.operations?.includes(o)) &&
                  minLvl === p.config.minLevel &&
                  maxLvl === p.config.maxLevel;

                return (
                  <button
                    key={idx}
                    onClick={() => applyPreset(p)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400/80 text-amber-200 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="text-slate-100">{p.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400">
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {p.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Choose Allowed Operations */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Math Operations (Select 1 or More)
              </span>
              <span className="text-[11px] text-slate-400">
                {selectedOps.length} Active
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(Object.keys(OPERATION_META) as MathOperation[]).map(op => {
                const meta = OPERATION_META[op];
                const isSelected = selectedOps.includes(op);

                return (
                  <button
                    key={op}
                    type="button"
                    onClick={() => toggleOp(op)}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-sky-400/70 shadow-md ring-1 ring-sky-400/30'
                        : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-base font-black px-2 py-0.5 rounded font-mono"
                        style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
                      >
                        {meta.symbol}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-sky-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700" />
                      )}
                    </div>
                    <div className="font-bold text-xs text-slate-100">{meta.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{meta.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Lowest & Highest Level Range */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Difficulty Range (Levels 1 to 10)
              </span>
              <span className="text-xs font-mono text-sky-300 font-bold">
                Level {minLvl} to Level {maxLvl}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Min Level */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">Lowest Level:</span>
                  <span className="text-amber-300 font-bold font-mono">
                    Lv {minLvl} • {LEVEL_NAMES[minLvl]}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={minLvl}
                  onChange={e => handleMinLvlChange(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>1 (Beginner)</span>
                  <span>10 (Grandmaster)</span>
                </div>
              </div>

              {/* Max Level */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">Highest Level:</span>
                  <span className="text-amber-300 font-bold font-mono">
                    Lv {maxLvl} • {LEVEL_NAMES[maxLvl]}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={maxLvl}
                  onChange={e => handleMaxLvlChange(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>1 (Beginner)</span>
                  <span>10 (Grandmaster)</span>
                </div>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
              💡 As the pirate claims power-ups during the heist, problem difficulty will progressively advance from <strong className="text-slate-200">Level {minLvl}</strong> up to your chosen ceiling of <strong className="text-slate-200">Level {maxLvl}</strong>.
            </p>
          </div>

          {/* Section 4: Live Examples Preview */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Live Examples Preview
                </div>
                <div className="text-[11px] text-slate-400">
                  Sample problems generated for your selected operations and level span:
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShuffleSeed(prev => prev + 1)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
                title="Generate another set of examples"
              >
                <Shuffle className="w-3.5 h-3.5 text-amber-400" />
                Shuffle Examples
              </button>
            </div>

            <div className="space-y-2.5">
              {previewExamples.map((ex, idx) => (
                <div
                  key={`${ex.op}-${shuffleSeed}-${idx}`}
                  className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-mono font-bold shrink-0 mt-0.5"
                      style={{ backgroundColor: `${ex.meta.color}25`, color: ex.meta.color }}
                    >
                      {ex.meta.label}
                    </span>
                    <div>
                      <div className="text-sm font-mono font-black text-amber-300">
                        {ex.question} = <span className="text-emerald-400">{ex.correctAnswer}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {ex.explanation}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono text-right shrink-0">
                    Lv {ex.level} • {ex.levelName}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Timed Challenge Mode */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5" /> Challenge Pace Mode
              </div>
              <div className="text-xs text-slate-300">
                {timedMode ? 'Timed Challenge (Speed drill with clock countdown)' : 'Untimed Mode (Calm learning & thoughtful calculation)'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Untimed is ideal for students practicing scratchpad steps without pressure.
              </div>
            </div>

            <div className="flex items-center gap-3">
              {timedMode && (
                <select
                  value={timeLimit}
                  onChange={e => setTimeLimit(parseInt(e.target.value, 10))}
                  className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200"
                >
                  <option value={30}>30 seconds</option>
                  <option value={45}>45 seconds</option>
                  <option value={60}>60 seconds</option>
                  <option value={90}>90 seconds</option>
                </select>
              )}

              <button
                type="button"
                onClick={() => setTimedMode(!timedMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  timedMode
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {timedMode ? 'Timed ON' : 'Untimed (Calm)'}
              </button>
            </div>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setSelectedOps(DEFAULT_MATH_CONFIG.operations);
              setMinLvl(DEFAULT_MATH_CONFIG.minLevel);
              setMaxLvl(DEFAULT_MATH_CONFIG.maxLevel);
              setTimedMode(DEFAULT_MATH_CONFIG.timedMode);
              setTimeLimit(DEFAULT_MATH_CONFIG.timeLimitSeconds);
            }}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Defaults
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Save Curriculum Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
