import React, { useState, useEffect, useRef } from 'react';
import { MathChallenge } from '../types';
import { soundEngine } from '../audio/soundEngine';
import { OPERATION_META } from '../game/mathChallenge';
import { 
  ShieldAlert, 
  Sparkles, 
  Wind, 
  Bomb, 
  CheckCircle, 
  HelpCircle, 
  XCircle, 
  Edit3, 
  Trash2, 
  Clock, 
  Lightbulb,
  Eraser,
  Zap
} from 'lucide-react';

interface MathChallengeModalProps {
  challenge: MathChallenge | null;
  onSolve: (
    correct: boolean,
    userAnswer: number | null,
    attempts: number,
    forfeited: boolean,
    elapsedSeconds?: number
  ) => void;
}

export const MathChallengeModal: React.FC<MathChallengeModalProps> = ({
  challenge,
  onSolve,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [hasError, setHasError] = useState(false);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchColor, setScratchColor] = useState('#f8fafc');
  const [isEraser, setIsEraser] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastCoordRef = useRef<{ x: number; y: number } | null>(null);
  const openedTimeRef = useRef<number>(Date.now());

  // Timer effect
  useEffect(() => {
    if (!challenge) return;
    openedTimeRef.current = Date.now();
    if (challenge.timeLimitSeconds && challenge.timeLimitSeconds > 0) {
      setTimeLeft(challenge.timeLimitSeconds);
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            // Time out: forfeit
            onSolve(false, null, attempts, true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeLeft(null);
    }
  }, [challenge]);

  // Reset state on new challenge
  useEffect(() => {
    if (challenge) {
      openedTimeRef.current = Date.now();
      setUserAnswer('');
      setHasError(false);
      setAttempts(0);
      setShowHint(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [challenge]);

  if (!challenge) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseInt(userAnswer.trim(), 10);
    if (isNaN(parsed)) {
      setHasError(true);
      setShake(true);
      soundEngine.playPuzzleFail();
      setTimeout(() => setShake(false), 500);
      return;
    }

    const elapsed = Math.max(0.2, Math.round(((Date.now() - openedTimeRef.current) / 1000) * 10) / 10);

    if (parsed === challenge.correctAnswer) {
      onSolve(true, parsed, attempts + 1, false, elapsed);
    } else {
      setHasError(true);
      setShake(true);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 2) {
        setShowHint(true);
      }
      soundEngine.playPuzzleFail();
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNumpadClick = (val: string) => {
    soundEngine.playClick();
    if (val === 'CLEAR') {
      setUserAnswer('');
      setHasError(false);
    } else if (val === 'BACK') {
      setUserAnswer(prev => prev.slice(0, -1));
      setHasError(false);
    } else {
      setUserAnswer(prev => prev + val);
      setHasError(false);
    }
    inputRef.current?.focus();
  };

  const handleForfeit = () => {
    const parsed = parseInt(userAnswer.trim(), 10);
    onSolve(false, isNaN(parsed) ? null : parsed, attempts, true);
  };

  const getPowerIcon = () => {
    switch (challenge.powerUpType) {
      case 'POWER_GROG':
        return <ShieldAlert className="w-6 h-6 text-amber-400" />;
      case 'POWER_INVISIBILITY':
        return <Sparkles className="w-6 h-6 text-purple-400" />;
      case 'POWER_SPEED':
        return <Wind className="w-6 h-6 text-sky-400" />;
      case 'POWER_KEG':
        return <Bomb className="w-6 h-6 text-rose-400" />;
    }
  };

  const opMeta = OPERATION_META[challenge.operation];

  // --- Scratchpad Canvas Drawing Handlers ---
  const startDrawing = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    isDrawingRef.current = true;
    lastCoordRef.current = { x, y };
  };

  const draw = (clientX: number, clientY: number) => {
    if (!isDrawingRef.current || !canvasRef.current || !lastCoordRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastCoordRef.current.x, lastCoordRef.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = isEraser ? '#0f172a' : scratchColor;
    ctx.lineWidth = isEraser ? 16 : 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastCoordRef.current = { x, y };
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastCoordRef.current = null;
  };

  const clearScratchpad = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in select-none">
      <div
        id="math-challenge-card"
        className={`w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 ${
          hasError ? 'border-rose-500/80 shadow-rose-500/30' : 'border-amber-500/60 shadow-amber-500/20'
        } rounded-2xl shadow-2xl p-4 flex flex-col items-center text-center transition-all ${
          shake ? 'animate-bounce' : ''
        }`}
      >
        {/* Header Ribbon with Operation & Level Tag */}
        <div className="w-full flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400">
          <div className="flex items-center gap-1.5">
            <span
              className="px-2 py-0.5 rounded font-mono font-bold text-xs"
              style={{ backgroundColor: `${opMeta?.color || '#38bdf8'}22`, color: opMeta?.color || '#38bdf8' }}
            >
              {opMeta?.label || challenge.operation}
            </span>
            <span className="text-amber-400 font-bold uppercase tracking-wider">
              #{challenge.challengeNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {timeLeft !== null && (
              <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold flex items-center gap-1 ${
                timeLeft <= 10 ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' : 'bg-slate-800 text-sky-300'
              }`}>
                <Clock className="w-3 h-3" />
                {timeLeft}s
              </span>
            )}

            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono text-[10px]">
              Level {challenge.difficultyLevel}
            </span>
          </div>
        </div>

        {/* Power-up Target Banner */}
        <div className="w-full mt-2.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5 text-left">
          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
            {getPowerIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>{challenge.powerUpName}</span>
              <span className="text-[10px] text-amber-400 font-mono">+{challenge.bonusPoints} bonus</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {challenge.powerUpDescription}
            </div>
          </div>
        </div>

        {/* Speed Bounty Incentive Banner */}
        <div className="w-full mt-2 px-2.5 py-1 rounded-lg bg-sky-950/70 border border-sky-800/40 flex items-center justify-between text-[10px] text-sky-300">
          <span className="flex items-center gap-1 font-semibold text-amber-300">
            <Zap className="w-3 h-3 text-amber-400" /> Speed Bounty:
          </span>
          <span>&lt; 5s: <strong className="text-emerald-300">+300 pts &amp; Dash</strong> | &lt; 10s: <strong className="text-sky-300">+150 pts</strong></span>
        </div>

        {/* Game Bonuses for Solving Callout */}
        <div className="w-full mt-1.5 p-2 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[10px] text-amber-200 text-left flex flex-col gap-1 shadow-sm">
          <div className="flex items-center gap-1 font-bold text-amber-300 uppercase tracking-wide text-[10px]">
            <span>🎁 Bonuses for Solving:</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9.5px]">
            <span className="flex items-center gap-1">⚡ <strong>Unlock {challenge.powerUpName}</strong></span>
            <span className="flex items-center gap-1">🪙 <strong>+{challenge.bonusPoints} Cipher Points</strong></span>
            <span className="flex items-center gap-1">💣 <strong>Refill Weapons &amp; Ammo</strong></span>
            <span className="flex items-center gap-1">🔥 <strong>Advance Streak &amp; Heroes</strong></span>
          </div>
        </div>

        {/* Math Problem Prompt */}
        <div className="my-2.5 w-full">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
            {challenge.difficultyName}
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-black text-amber-300 tracking-wider">
              {challenge.question} =
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-sky-400">
              {userAnswer ? userAnswer : '?'}
            </span>
          </div>
        </div>

        {/* Hint Accordion / Feedback */}
        {showHint && challenge.hint && (
          <div className="w-full mb-2 p-2 rounded-lg bg-sky-950/60 border border-sky-500/40 text-left text-[11px] text-sky-200 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong className="text-sky-300">Pedagogical Hint:</strong> {challenge.hint}
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {hasError && (
          <div className="w-full mb-2 px-3 py-1 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 animate-pulse">
            <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Arr! Not quite right. Review the hint or try again!</span>
          </div>
        )}

        {/* Scratchpad Toggle & Controls */}
        <div className="w-full flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => setShowScratchpad(!showScratchpad)}
            className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors ${
              showScratchpad
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/80'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>{showScratchpad ? 'Hide Scratchpad' : '📝 Open Scratchpad'}</span>
          </button>

          {!showHint && challenge.hint && (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
            >
              <Lightbulb className="w-3 h-3" /> Need a Hint?
            </button>
          )}
        </div>

        {/* Interactive Scratchpad Canvas */}
        {showScratchpad && (
          <div className="w-full mb-2.5 p-2 bg-slate-950 border border-amber-500/40 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Chalkboard / Working Canvas (Touch or Mouse)</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => { setIsEraser(false); setScratchColor('#f8fafc'); }}
                  className={`w-4 h-4 rounded-full bg-slate-100 border ${scratchColor === '#f8fafc' && !isEraser ? 'ring-2 ring-amber-400' : ''}`}
                  title="White Chalk"
                />
                <button
                  type="button"
                  onClick={() => { setIsEraser(false); setScratchColor('#fbbf24'); }}
                  className={`w-4 h-4 rounded-full bg-amber-400 border ${scratchColor === '#fbbf24' && !isEraser ? 'ring-2 ring-amber-400' : ''}`}
                  title="Gold Chalk"
                />
                <button
                  type="button"
                  onClick={() => { setIsEraser(false); setScratchColor('#38bdf8'); }}
                  className={`w-4 h-4 rounded-full bg-sky-400 border ${scratchColor === '#38bdf8' && !isEraser ? 'ring-2 ring-amber-400' : ''}`}
                  title="Cyan Chalk"
                />
                <button
                  type="button"
                  onClick={() => setIsEraser(true)}
                  className={`p-1 rounded ${isEraser ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                  title="Eraser"
                >
                  <Eraser className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={clearScratchpad}
                  className="p-1 rounded text-slate-400 hover:text-rose-400"
                  title="Clear Canvas"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={360}
              height={100}
              onMouseDown={e => startDrawing(e.clientX, e.clientY)}
              onMouseMove={e => draw(e.clientX, e.clientY)}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={e => {
                const touch = e.touches[0];
                startDrawing(touch.clientX, touch.clientY);
              }}
              onTouchMove={e => {
                const touch = e.touches[0];
                draw(touch.clientX, touch.clientY);
              }}
              onTouchEnd={stopDrawing}
              className="w-full h-24 bg-slate-900 rounded-lg border border-slate-800 cursor-crosshair touch-none"
            />
          </div>
        )}

        {/* Number Input Form */}
        <form onSubmit={handleSubmit} className="w-full mb-2">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              id="math-answer-input"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={userAnswer}
              onChange={e => {
                setUserAnswer(e.target.value);
                setHasError(false);
              }}
              placeholder="Enter answer..."
              autoFocus
              className="flex-1 bg-slate-950 text-slate-100 placeholder:text-slate-600 font-mono text-xl font-bold px-3 py-2 rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 text-center"
            />
            <button
              type="submit"
              id="math-submit-btn"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Unlock</span>
            </button>
          </div>
        </form>

        {/* Virtual Numeric Keypad */}
        <div className="w-full grid grid-cols-3 gap-1.5 mb-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              type="button"
              id={`numpad-${num}`}
              onClick={() => handleNumpadClick(num)}
              className="py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-mono font-bold text-sm border border-slate-700/60 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            id="numpad-clear"
            onClick={() => handleNumpadClick('CLEAR')}
            className="py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 font-semibold text-xs border border-rose-800/50 transition-colors"
          >
            Clear
          </button>
          <button
            type="button"
            id="numpad-0"
            onClick={() => handleNumpadClick('0')}
            className="py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-mono font-bold text-sm border border-slate-700/60 transition-colors"
          >
            0
          </button>
          <button
            type="button"
            id="numpad-back"
            onClick={() => handleNumpadClick('BACK')}
            className="py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700/60 transition-colors"
          >
            ⌫
          </button>
        </div>

        {/* Footer Actions */}
        <div className="w-full flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-1 text-slate-500">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Enter key or Unlock to check</span>
          </div>

          <button
            type="button"
            id="forfeit-powerup-btn"
            onClick={handleForfeit}
            className="text-slate-400 hover:text-rose-400 underline transition-colors cursor-pointer"
          >
            Forfeit Power-Up
          </button>
        </div>
      </div>
    </div>
  );
};
