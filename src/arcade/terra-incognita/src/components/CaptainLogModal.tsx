import React, { useState } from 'react';
import { DailyMission, CaptainLogEntry } from '../types';
import { SoundEngine } from '../utils/audio';
import { ScrollText, Compass, CheckCircle2, Award, Clock, CloudLightning, Wind, Gift, BookOpen } from 'lucide-react';

interface CaptainLogModalProps {
  missions: DailyMission[];
  logs: CaptainLogEntry[];
  onClaimMission: (missionId: string) => void;
}

export const CaptainLogModal: React.FC<CaptainLogModalProps> = ({
  missions,
  logs,
  onClaimMission
}) => {
  const [activeTab, setActiveTab] = useState<'MISSIONS' | 'LOGBOOK'>('MISSIONS');
  const [logFilter, setLogFilter] = useState<string>('ALL');

  const completedMissionsCount = missions.filter(m => m.completed && !m.claimed).length;

  const filteredLogs = logs.filter(log => {
    if (logFilter === 'ALL') return true;
    return log.severity === logFilter;
  });

  return (
    <div className="flex flex-col h-full bg-[#181411] text-[#EFE7D8] p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#382E25]">
        <div>
          <h2 className="text-xl font-serif font-bold text-amber-200 flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-amber-400" />
            Admiralty Orders & The Captain's Daily Logbook
          </h2>
          <p className="text-xs text-[#A89279] mt-0.5">
            Royal Charter expedition directives, milestone bounties, and chronological ship journals.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-[#221A15] p-1 rounded-lg border border-[#3E3023]">
          <button
            onClick={() => {
              SoundEngine.playCompassClick();
              setActiveTab('MISSIONS');
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'MISSIONS'
                ? 'bg-amber-700 text-white shadow'
                : 'text-[#A89279] hover:text-[#EFE7D8]'
            }`}
          >
            <span>Royal Orders</span>
            {completedMissionsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-black text-[10px] font-bold flex items-center justify-center">
                {completedMissionsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              SoundEngine.playCompassClick();
              setActiveTab('LOGBOOK');
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'LOGBOOK'
                ? 'bg-amber-700 text-white shadow'
                : 'text-[#A89279] hover:text-[#EFE7D8]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Daily Sea Logs ({logs.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 pt-4 overflow-y-auto">
        {activeTab === 'MISSIONS' ? (
          /* Missions View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missions.map(mission => {
              const progressPct = Math.min(100, Math.round((mission.currentCount / mission.targetCount) * 100));

              return (
                <div
                  key={mission.id}
                  className={`p-4 rounded-xl border transition-all ${
                    mission.claimed
                      ? 'bg-[#1C1713]/60 border-[#30251B] opacity-60'
                      : mission.completed
                        ? 'bg-[#2E2419] border-amber-500 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-[#201A15] border-[#423425]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {mission.category} DIRECTIVE
                      </span>
                      <h4 className="text-sm font-serif font-bold text-amber-200 mt-0.5">
                        {mission.title}
                      </h4>
                    </div>

                    <div className="text-right">
                      {mission.claimed ? (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Bounty Claimed
                        </span>
                      ) : mission.completed ? (
                        <button
                          onClick={() => {
                            SoundEngine.playCoinClink();
                            SoundEngine.playFanfare();
                            onClaimMission(mission.id);
                          }}
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-bold shadow animate-pulse cursor-pointer"
                        >
                          Claim Bounty!
                        </button>
                      ) : (
                        <span className="text-xs font-tabular text-[#A89279]">
                          {mission.currentCount} / {mission.targetCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#CBB59C] mt-2 leading-relaxed">
                    {mission.description}
                  </p>

                  <div className="p-2.5 rounded bg-[#181310] border border-[#30251B] my-3">
                    <p className="text-[11px] italic text-[#A89279] leading-snug">
                      {mission.flavorQuote}
                    </p>
                  </div>

                  {/* Progress bar */}
                  {!mission.claimed && (
                    <div className="space-y-1 mb-3">
                      <div className="w-full bg-[#181310] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Bounty Rewards */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#382E25] text-xs font-tabular text-amber-300">
                    <span className="text-[#A89279]">Crown Bounty:</span>
                    <span className="font-semibold">
                      +{mission.rewardDucats} Ducats · +{mission.rewardPrestige} Prestige
                      {mission.rewardTimber && ` · +${mission.rewardTimber} Timber`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Daily Captain's Log View */
          <div className="flex flex-col h-full bg-[#201A15] border border-[#423425] rounded-xl p-4 overflow-hidden">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 pb-3 border-b border-[#382E25] shrink-0">
              {['ALL', 'INFO', 'WONDER', 'PERIL', 'DIPLOMACY'].map(fKey => (
                <button
                  key={fKey}
                  onClick={() => {
                    SoundEngine.playCompassClick();
                    setLogFilter(fKey);
                  }}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    logFilter === fKey
                      ? 'bg-amber-700 text-white font-semibold'
                      : 'text-[#A89279] hover:text-[#EFE7D8]'
                  }`}
                >
                  {fKey === 'ALL' ? 'All Entries' : fKey.charAt(0) + fKey.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Log Entries List */}
            <div className="flex-1 overflow-y-auto space-y-2 pt-3 pr-1">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => {
                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-lg bg-[#261E17] border border-[#3E3023] flex items-start gap-3"
                    >
                      <div className="p-1.5 rounded bg-[#181310] border border-[#382E25] text-amber-400 shrink-0 mt-0.5">
                        {log.severity === 'PERIL' ? (
                          <CloudLightning className="w-4 h-4 text-red-400" />
                        ) : log.severity === 'WONDER' ? (
                          <Compass className="w-4 h-4 text-emerald-400" />
                        ) : log.severity === 'DIPLOMACY' ? (
                          <Gift className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Wind className="w-4 h-4 text-[#A89279]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[11px] font-tabular text-[#A89279]">
                          <span>
                            {log.dateStr} · <em>{log.locationName}</em>
                          </span>
                          <span className="text-amber-400/90 font-medium">{log.weatherName}</span>
                        </div>

                        <div className="text-xs font-serif font-bold text-amber-200 mt-0.5">
                          {log.title}
                        </div>

                        <p className="text-xs text-[#CBB59C] mt-1 leading-relaxed">
                          {log.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-[#A89279] text-xs italic">
                  No log entries recorded under this filter yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
