import React from 'react';
import {
  FileText,
  ShieldAlert,
  Compass,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin,
  X,
} from 'lucide-react';
import { GameCase } from '../types/game';
import { sounds } from '../services/soundEffects';
import detectiveBriefingDeskImg from '../assets/images/detective_briefing_desk_1792239911161.jpg';

interface CaseBriefingModalProps {
  currentCase: GameCase;
  isOpen: boolean;
  onClose: () => void;
  onStartMission: () => void;
}

export const CaseBriefingModal: React.FC<CaseBriefingModalProps> = ({
  currentCase,
  isOpen,
  onClose,
  onStartMission,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden crt-screen flex flex-col max-h-[90vh]">
        {/* Dossier Header with Hero Image */}
        <div className="relative h-44 sm:h-52 overflow-hidden border-b border-amber-500/40">
          <img
            src={detectiveBriefingDeskImg}
            alt="Bureau Chief Confidential Case Briefing Desk"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => {
              sounds.play('click');
              onClose();
            }}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700 cursor-pointer backdrop-blur-sm z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on Hero */}
          <div className="absolute bottom-3 left-5 right-5 z-10 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-mono tracking-widest text-amber-400 font-bold uppercase bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                  CLASSIFIED BUREAU DOSSIER
                </span>
                <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-xs font-mono font-bold uppercase border border-rose-500/40">
                  TOP PRIORITY
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-terminal text-white">
                CASE #{currentCase.caseNumber}: The {currentCase.artifact.name} Heist
              </h2>
            </div>
          </div>
        </div>

        {/* Content Scrollable */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-200 font-mono text-sm">
          {/* Chief's Teletype Cable */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 relative">
            <div className="flex items-center justify-between text-sm text-amber-400 uppercase tracking-widest">
              <span>TELETYPE DISPATCH • G.L.O.B.E. HEADQUARTERS</span>
              <span>{currentCase.startingDate}</span>
            </div>
            <p className="font-typewriter text-base text-amber-100/90 leading-relaxed">
              "ATTENTION DETECTIVE: Disaster has struck the heritage community! Last night, a notorious member of the Shadow Antiquarian League executed a coordinated theft of the priceless <strong>{currentCase.artifact.name}</strong> from its vaults. Eyewitnesses report the fugitive fled immediately toward an international transit corridor. Deploy to the initial crime scene in <strong>{currentCase.currentCity.name}</strong>, interrogate witnesses, gather clues, and cross-reference our Crime Computer to issue an arrest warrant before your deadline expires. The world is counting on you!"
            </p>
            <div className="text-right text-sm text-slate-400 font-bold">
              — Chief Inspector Sterling, G.L.O.B.E. Directorate
            </div>
          </div>

          {/* Stolen Artifact Profile */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Artifact Recovery File
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-sm">
                {currentCase.artifact.category}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">Historical Era: </span>
                <span className="text-slate-200">{currentCase.artifact.era} ({currentCase.artifact.estimatedYear})</span>
              </div>
              <div>
                <span className="text-slate-500">Origin: </span>
                <span className="text-slate-200">{currentCase.artifact.originCity}, {currentCase.artifact.originCountry}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500">Usual Custody: </span>
                <span className="text-slate-200">{currentCase.artifact.currentHome}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
              {currentCase.artifact.description}
            </p>

            <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/20 text-sm text-amber-300/90 leading-tight">
              🔍 <strong>Historical Significance:</strong> {currentCase.artifact.historicalSignificance}
            </div>
          </div>

          {/* Mission Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-sm text-slate-500 uppercase block">Starting City</span>
              <span className="font-bold text-slate-100 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {currentCase.currentCity.name}
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-sm text-slate-500 uppercase block">Time Budget</span>
              <span className="font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                {currentCase.totalTimeAllowed} Hours
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-sm text-slate-500 uppercase block">Difficulty Mode</span>
              <div className="flex items-center gap-1.5 mt-1">
                {(['Rookie', 'Detective', 'Scholar'] as const).map((diff) => (
                  <span
                    key={diff}
                    className={`px-2 py-0.5 rounded text-sm font-mono font-bold uppercase ${
                      currentCase.difficulty === diff
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {diff}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-sm font-mono text-slate-500 hidden sm:inline">
            Interpol Warrant required prior to safehouse raid.
          </span>
          <button
            onClick={() => {
              sounds.play('beep');
              onStartMission();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
          >
            <span>ACCEPT CASE & DEPLOY TO CRIME SCENE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
