import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { GameCase, PlayerCareer, Suspect } from '../types/game';
import { SUSPECTS } from '../data/suspects';
import { sounds } from '../services/soundEffects';

interface ArrestSceneModalProps {
  currentCase: GameCase;
  career: PlayerCareer;
  isOpen: boolean;
  onNextCase: (difficulty?: 'Rookie' | 'Detective' | 'Scholar') => void;
  onOpenCareer: () => void;
}

export const ArrestSceneModal: React.FC<ArrestSceneModalProps> = ({
  currentCase,
  career,
  isOpen,
  onNextCase,
  onOpenCareer,
}) => {
  const isWon = currentCase.status === 'solved';
  const isNoWarrant = currentCase.status === 'escaped_no_warrant';
  const isWrongWarrant = currentCase.status === 'escaped_wrong_warrant';
  const isTimeOut = currentCase.status === 'escaped_time';

  const warrantedSuspect: Suspect | undefined = currentCase.warrantIssuedFor
    ? SUSPECTS.find((s) => s.id === currentCase.warrantIssuedFor)
    : undefined;

  useEffect(() => {
    if (isOpen) {
      if (isWon) {
        sounds.play('victory');
        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      } else {
        sounds.play('loss');
      }
    }
  }, [isOpen, isWon]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`bg-slate-900 border-2 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden crt-screen flex flex-col ${
          isWon
            ? 'border-emerald-500 shadow-emerald-500/20'
            : 'border-rose-500 shadow-rose-500/20'
        }`}
      >
        {/* Banner */}
        <div
          className={`px-6 py-5 flex items-center gap-3 border-b ${
            isWon
              ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-emerald-500/40 text-emerald-300'
              : 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-rose-500/40 text-rose-300'
          }`}
        >
          <div
            className={`p-3 rounded-xl border ${
              isWon
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
            }`}
          >
            {isWon ? <Trophy className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>

          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold">
              {isWon ? 'MISSION ACCOMPLISHED • ARREST LOGGED' : 'MISSION FAILED • FUGITIVE ESCAPED'}
            </span>
            <h2 className="text-2xl font-bold font-terminal text-white">
              {isWon
                ? 'CASE SOLVED: THE ARTIFACT IS SECURED!'
                : isNoWarrant
                ? 'NO WARRANT: FUGITIVE RELEASED!'
                : isWrongWarrant
                ? 'WRONG SUSPECT APPREHENDED!'
                : 'DEADLINE EXPIRED!'}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs font-mono text-slate-200">
          {/* Narrative Outcome */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            {isWon ? (
              <p className="leading-relaxed text-slate-100">
                Armed with an authorized Interpol arrest warrant, your tactical team raided the safehouse in{' '}
                <strong>{currentCase.currentCity.name}</strong> and apprehended{' '}
                <strong className="text-emerald-300">{currentCase.culprit.name}</strong> (alias "
                {currentCase.culprit.alias}").
                <br /><br />
                The stolen <strong className="text-amber-300">{currentCase.artifact.name}</strong> was recovered completely intact and has been repatriated! The International Heritage Directorate commends your exceptional scholarship and detective prowess!
              </p>
            ) : isNoWarrant ? (
              <p className="leading-relaxed text-rose-200">
                You cornered the suspect red-handed with the artifact! However, because you entered the hideout without issuing an authorized Interpol Arrest Warrant via the Crime Computer, international legal jurisdictions prevented local police from detaining them!
                <br /><br />
                The suspect slipped out through an emergency tunnel and vanished into an untracked vessel.
              </p>
            ) : isWrongWarrant ? (
              <p className="leading-relaxed text-rose-200">
                You executed the raid with an active arrest warrant, but the warrant was made out for{' '}
                <strong>{warrantedSuspect?.name || 'the wrong suspect'}</strong> instead of the true mastermind,{' '}
                <strong className="text-white">{currentCase.culprit.name}</strong>!
                <br /><br />
                The genuine thief laughed and slipped across the border with the artifact while your team sorted out the mistaken identity!
              </p>
            ) : (
              <p className="leading-relaxed text-rose-200">
                Your mission clock ran out! The deadline passed before you could pinpoint the final hideout. The Shadow Antiquarian League loaded the stolen artifact into a deep-sea cargo container and dissolved into the underworld.
              </p>
            )}
          </div>

          {/* Suspect & Artifact Debriefing Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">True Culprit</span>
              <div className="font-bold text-slate-100 text-sm mt-0.5">
                {currentCase.culprit.name}
              </div>
              <span className="text-[11px] text-amber-400">"{currentCase.culprit.alias}"</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Stolen Relic</span>
              <div className="font-bold text-slate-100 text-sm mt-0.5 truncate">
                {currentCase.artifact.name}
              </div>
              <span className="text-[11px] text-slate-400">{currentCase.artifact.originCity}</span>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex items-center justify-around text-center">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Time Remaining</span>
              <span className="font-bold text-amber-300 text-sm">{Math.max(0, currentCase.hoursRemaining)}h</span>
            </div>
            <div className="h-7 w-[1px] bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Clues Uncovered</span>
              <span className="font-bold text-purple-300 text-sm">{currentCase.clueLog.length}</span>
            </div>
            <div className="h-7 w-[1px] bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Total Solved</span>
              <span className="font-bold text-emerald-300 text-sm">{career.casesSolved}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              sounds.play('click');
              onOpenCareer();
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>View Career Dossier</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                sounds.play('beep');
                onNextCase('Detective');
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
            >
              <span>{isWon ? 'NEXT CASE (DETECTIVE)' : 'PLAY AGAIN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sounds.play('beep');
                onNextCase('Scholar');
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/20 cursor-pointer transition-all"
              title="Launch case with advanced historical research riddles"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>SCHOLAR MODE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
