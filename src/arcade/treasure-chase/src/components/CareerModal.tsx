import React from 'react';
import {
  Award,
  Shield,
  Trophy,
  CheckCircle2,
  X,
  Compass,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { PlayerCareer } from '../types/game';
import { sounds } from '../services/soundEffects';
import ancientArtifactsVaultImg from '../assets/images/ancient_artifacts_vault_1792239912262.jpg';

interface CareerModalProps {
  career: PlayerCareer;
  isOpen: boolean;
  onClose: () => void;
}

export const CareerModal: React.FC<CareerModalProps> = ({
  career,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const totalCases = career.casesSolved + career.casesFailed;
  const winRate = totalCases > 0 ? Math.round((career.casesSolved / totalCases) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden crt-screen flex flex-col max-h-[90vh]">
        {/* Header with Antiquities Vault Hero Image */}
        <div className="relative h-44 sm:h-52 overflow-hidden border-b border-amber-500/40">
          <img
            src={ancientArtifactsVaultImg}
            alt="International Museum Antiquities Vault"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          <button
            onClick={() => {
              sounds.play('click');
              onClose();
            }}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700 cursor-pointer backdrop-blur-sm z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-5 right-5 z-10 flex items-end justify-between">
            <div>
              <span className="text-sm font-mono tracking-widest text-amber-400 font-bold uppercase bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                G.L.O.B.E. SERVICE RECORD
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-terminal text-white mt-1">
                Detective Dossier: {career.rankTitle}
              </h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 font-mono text-sm">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-sm text-slate-500 uppercase block">Rank Level</span>
              <span className="text-xl font-bold text-amber-400 font-terminal mt-1 block">
                Grade {career.rankLevel}
              </span>
              <span className="text-sm text-slate-400">{career.rankTitle}</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-sm text-slate-500 uppercase block">Cases Solved</span>
              <span className="text-xl font-bold text-emerald-400 font-terminal mt-1 block">
                {career.casesSolved}
              </span>
              <span className="text-sm text-slate-400">Successful Raids</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-sm text-slate-500 uppercase block">Total Score</span>
              <span className="text-xl font-bold text-purple-400 font-terminal mt-1 block">
                {career.totalScore.toLocaleString()}
              </span>
              <span className="text-sm text-slate-400">Merit Points</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-sm text-slate-500 uppercase block">Clearance Rate</span>
              <span className="text-xl font-bold text-sky-400 font-terminal mt-1 block">
                {winRate}%
              </span>
              <span className="text-sm text-slate-400">{totalCases} Total Pursuits</span>
            </div>
          </div>

          {/* Badges / Commendations */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>Agency Honors & Badges</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {career.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 flex items-center gap-2 text-sm"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recovered Antiquities Vault */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Repatriated Historical Treasures ({career.artifactsRecovered.length})
              </span>
              <span className="text-sm text-slate-500">Museum Repository</span>
            </h3>

            {career.artifactsRecovered.length === 0 ? (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center text-slate-500">
                No artifacts secured yet. Solve your current case to place the recovered relic in the museum!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {career.artifactsRecovered.map((artName, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 flex items-center gap-2 text-sm text-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{artName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Captured Suspects */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-400" />
                Captured Antiquarian Masterminds ({career.solvedSuspects.length})
              </span>
            </h3>

            {career.solvedSuspects.length === 0 ? (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center text-slate-500">
                The Shadow Antiquarian League remains at large. Apprehend a suspect with an Interpol warrant to record them here!
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {career.solvedSuspects.map((name, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-purple-950/50 border border-purple-500/30 text-purple-300 text-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-purple-400" />
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={() => {
              sounds.play('click');
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-sm cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
