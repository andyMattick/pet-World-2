import React, { useState } from 'react';
import {
  History,
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Compass,
  ArrowRight,
  Filter,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  MapPin,
  Shield,
  Plane,
} from 'lucide-react';
import { CompletedMission, PlayerCareer } from '../types/game';
import { sounds } from '../services/soundEffects';

interface MissionLogProps {
  career: PlayerCareer;
  onOpenAntiquitiesVault: () => void;
  onStartNewCase: () => void;
}

export const MissionLog: React.FC<MissionLogProps> = ({
  career,
  onOpenAntiquitiesVault,
  onStartNewCase,
}) => {
  const [filter, setFilter] = useState<'all' | 'solved' | 'escaped'>('all');
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null);

  const missions = career.missionHistory || [];

  const filteredMissions = missions.filter((m) => {
    if (filter === 'solved') return m.outcome === 'solved';
    if (filter === 'escaped') return m.outcome !== 'solved';
    return true;
  });

  const totalCases = career.casesSolved + career.casesFailed;
  const clearanceRate = totalCases > 0 ? Math.round((career.casesSolved / totalCases) * 100) : 0;

  const toggleExpand = (id: string) => {
    sounds.play('click');
    setExpandedMissionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary Scoreboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl crt-screen">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <History className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase">
                  G.L.O.B.E. HEADQUARTERS ARCHIVE
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                  {career.rankTitle}
                </span>
              </div>
              <h2 className="text-2xl font-bold font-terminal text-white">
                Bureau Mission Log & Case Clearance History
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                sounds.play('click');
                onOpenAntiquitiesVault();
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Vault Repository</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Artifacts Recovered */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Artifacts Secured
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-terminal mt-0.5 block">
                {career.artifactsRecovered.length}
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Treasures Recovered
              </span>
            </div>
            <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          {/* Total Score Accumulated */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Total Score
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-terminal mt-0.5 block">
                {career.totalScore.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Bureau Merit Points
              </span>
            </div>
            <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/30">
              <Award className="w-5 h-5" />
            </div>
          </div>

          {/* Cases Solved vs Failed */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Solved / Total
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-terminal">
                  {career.casesSolved}
                </span>
                <span className="text-sm font-mono text-slate-500">/ {totalCases}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {career.casesFailed} Lost Cases
              </span>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* Clearance Rate */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Clearance Rate
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-terminal mt-0.5 block">
                {clearanceRate}%
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {career.rankTitle}
              </span>
            </div>
            <div className="p-2.5 bg-sky-500/10 rounded-lg text-sky-400 border border-sky-500/30">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Recovered Artifacts Mini Gallery */}
      {career.artifactsRecovered.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Secured Antiquities Gallery ({career.artifactsRecovered.length})
            </span>
            <span className="text-slate-500">Protected in International Vault</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {career.artifactsRecovered.map((art, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span>{art}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              sounds.play('click');
              setFilter('all');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Cases ({missions.length})
          </button>
          <button
            onClick={() => {
              sounds.play('click');
              setFilter('solved');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
              filter === 'solved'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Solved Only ({career.casesSolved})
          </button>
          <button
            onClick={() => {
              sounds.play('click');
              setFilter('escaped');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
              filter === 'escaped'
                ? 'bg-rose-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cold Cases ({career.casesFailed})
          </button>
        </div>

        <span className="text-xs font-mono text-slate-500">
          Chronological Session Log
        </span>
      </div>

      {/* Mission History List */}
      <div className="space-y-4">
        {filteredMissions.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-200 font-terminal">
              No Cases In Log Yet
            </h3>
            <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
              Complete your active investigation to log the first mission debriefing, record points, and preserve the recovered antiquity.
            </p>
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const isSolved = mission.outcome === 'solved';
            const isExpanded = expandedMissionId === mission.id;

            return (
              <div
                key={mission.id}
                className={`bg-slate-900 border rounded-xl overflow-hidden transition-all duration-200 shadow-md ${
                  isSolved
                    ? 'border-emerald-500/30 hover:border-emerald-500/60'
                    : 'border-rose-500/30 hover:border-rose-500/60'
                }`}
              >
                {/* Mission Header Card */}
                <div
                  onClick={() => toggleExpand(mission.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl border flex-shrink-0 ${
                        isSolved
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {isSolved ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <XCircle className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[10px] font-bold uppercase text-slate-400">
                          CASE #{mission.caseNumber}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                            isSolved
                              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                              : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                          }`}
                        >
                          {isSolved ? 'SOLVED & SECURED' : 'FUGITIVE ESCAPED'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {mission.completedAt}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold font-terminal text-white">
                        {mission.artifactName}
                      </h3>
                      <p className="text-xs font-mono text-slate-400">
                        {mission.artifactEra} • Target: <span className="text-slate-300 font-bold">{mission.culpritName}</span> ("{mission.culpritAlias}")
                      </p>
                    </div>
                  </div>

                  {/* Right Score & Toggle */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] font-mono uppercase text-slate-500">
                        Merit Score
                      </div>
                      <div
                        className={`text-base font-bold font-mono ${
                          isSolved ? 'text-amber-400' : 'text-slate-500'
                        }`}
                      >
                        +{mission.score.toLocaleString()} pts
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-[10px] font-mono uppercase text-slate-500">
                        Clock Left
                      </div>
                      <div className="text-xs font-bold font-mono text-slate-300">
                        {mission.hoursRemaining}h / {mission.totalTimeAllowed}h
                      </div>
                    </div>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Case Debriefing */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs font-mono animate-in fade-in-50 duration-150">
                    {/* Flight Trail Itinerary */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                        Investigation Flight Itinerary ({mission.citiesVisited.length} Cities)
                      </span>
                      <div className="flex items-center flex-wrap gap-1.5">
                        {mission.citiesVisited.map((city, cIdx) => (
                          <React.Fragment key={cIdx}>
                            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-amber-400" />
                              <span>{city}</span>
                            </span>
                            {cIdx < mission.citiesVisited.length - 1 && (
                              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Breakdown Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Origin Custody:</span>
                        <span className="text-slate-200 font-medium">{mission.artifactOrigin}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Difficulty Level:</span>
                        <span className="text-purple-400 font-medium">{mission.difficulty} Mode</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Clues Uncovered:</span>
                        <span className="text-slate-200 font-medium">{mission.cluesCount} Statements</span>
                      </div>
                    </div>

                    {/* Debrief Message */}
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 leading-relaxed">
                      {isSolved ? (
                        <span>
                          <strong>Bureau Commendation:</strong> The suspect was apprehended with an authorized Interpol arrest warrant in <strong>{mission.finalCity}</strong>. The <strong>{mission.artifactName}</strong> was safely returned to the international repository.
                        </span>
                      ) : mission.outcome === 'escaped_no_warrant' ? (
                        <span className="text-rose-300">
                          <strong>Breach of Procedure:</strong> The suspect was tracked to {mission.finalCity}, but no valid arrest warrant had been authorized through the Crime Computer prior to the raid. The suspect escaped.
                        </span>
                      ) : mission.outcome === 'escaped_wrong_warrant' ? (
                        <span className="text-rose-300">
                          <strong>Jurisdictional Error:</strong> An arrest warrant was presented in {mission.finalCity}, but it was made out for the incorrect suspect. The true mastermind escaped.
                        </span>
                      ) : (
                        <span className="text-rose-300">
                          <strong>Deadline Exceeded:</strong> Time expired before the final hideout could be resolved. The artifact was lost to the black market.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
