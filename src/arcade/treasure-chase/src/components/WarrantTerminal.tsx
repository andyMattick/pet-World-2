import React, { useState } from 'react';
import {
  FileCheck,
  ShieldAlert,
  Users,
  Search,
  RotateCcw,
  Stamp,
  CheckCircle,
  AlertTriangle,
  Car,
  Sparkles,
} from 'lucide-react';
import { SUSPECTS } from '../data/suspects';
import {
  DistinguishingMark,
  EscapeVehicle,
  GameCase,
  Gender,
  HairColor,
  Hobby,
  SignatureAccessory,
  Suspect,
  WarrantCriteria,
} from '../types/game';
import { filterSuspects } from '../services/gameEngine';
import { sounds } from '../services/soundEffects';
import interpolMasterThiefImg from '../assets/images/interpol_master_thief_1792239912549.jpg';

interface WarrantTerminalProps {
  currentCase: GameCase;
  onIssueWarrant: (suspect: Suspect) => void;
  onRevokeWarrant: () => void;
}

export const WarrantTerminal: React.FC<WarrantTerminalProps> = ({
  currentCase,
  onIssueWarrant,
  onRevokeWarrant,
}) => {
  const [criteria, setCriteria] = useState<WarrantCriteria>({
    gender: '',
    hair: '',
    vehicle: '',
    hobby: '',
    accessory: '',
    mark: '',
  });

  const matchingSuspects = filterSuspects(criteria);
  const activeWarrantSuspect = currentCase.warrantIssuedFor
    ? SUSPECTS.find((s) => s.id === currentCase.warrantIssuedFor)
    : null;

  const handleResetFilters = () => {
    sounds.play('click');
    setCriteria({
      gender: '',
      hair: '',
      vehicle: '',
      hobby: '',
      accessory: '',
      mark: '',
    });
  };

  const handleIssue = (suspect: Suspect) => {
    sounds.play('stamp');
    onIssueWarrant(suspect);
  };

  return (
    <div className="space-y-6">
      {/* Crime Computer Header with Master Thief Silhouette */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 shadow-2xl crt-screen">
        <div className="absolute inset-0">
          <img
            src={interpolMasterThiefImg}
            alt="Interpol Shadow Antiquarian Mastermind"
            className="w-full h-full object-cover object-top filter brightness-30 contrast-125 saturate-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-950/90" />
        </div>

        <div className="relative z-10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400 backdrop-blur-sm">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-terminal text-white">
                  G.L.O.B.E. Crime Computer Terminal
                </h2>
                <span className="px-2 py-0.5 rounded text-sm font-mono tracking-widest uppercase bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                  INTERPOL DATABASE ONLINE
                </span>
              </div>
              <p className="text-sm font-mono text-slate-300">
                Cross-reference witness observations to obtain a court-approved international arrest warrant.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 font-mono text-sm flex items-center gap-1.5 border border-slate-700 cursor-pointer backdrop-blur-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Warrant Document Notice */}
      {activeWarrantSuspect && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/60 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-emerald-400/80 flex items-center justify-center font-terminal text-2xl font-bold text-emerald-300 shadow-md">
                {activeWarrantSuspect.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-sm font-mono uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    OFFICIAL WARRANT ACTIVE
                  </span>
                  <span className="text-sm font-mono text-slate-400">
                    ID: WRT-{activeWarrantSuspect.id.toUpperCase()}-774
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white font-terminal mt-0.5">
                  Arrest Warrant Issued for: {activeWarrantSuspect.name}
                </h3>
                <p className="text-sm text-slate-300">
                  Known Alias: <span className="text-amber-300 font-bold">"{activeWarrantSuspect.alias}"</span> • Escape Mode: {activeWarrantSuspect.vehicle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.play('click');
                  onRevokeWarrant();
                }}
                className="px-4 py-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-mono text-sm cursor-pointer transition-all"
              >
                Revoke Warrant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trait Selection Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-terminal text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4" />
            Suspect Attribute Matrix
          </h3>
          <span className="text-sm font-mono text-slate-400">
            {matchingSuspects.length} of {SUSPECTS.length} suspects match current criteria
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Gender */}
          <div className="space-y-1">
            <label className="text-sm font-mono text-slate-400 uppercase">Gender</label>
            <select
              value={criteria.gender || ''}
              onChange={(e) => {
                sounds.play('beep');
                setCriteria({ ...criteria, gender: e.target.value as Gender });
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">(All Genders)</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Hair Color */}
          <div className="space-y-1">
            <label className="text-sm font-mono text-slate-400 uppercase">Hair Color</label>
            <select
              value={criteria.hair || ''}
              onChange={(e) => {
                sounds.play('beep');
                setCriteria({ ...criteria, hair: e.target.value as HairColor });
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">(All Hair Colors)</option>
              <option value="Jet Black">Jet Black</option>
              <option value="Silver Gray">Silver Gray</option>
              <option value="Auburn Red">Auburn Red</option>
              <option value="Platinum Blonde">Platinum Blonde</option>
              <option value="Chestnut Brown">Chestnut Brown</option>
            </select>
          </div>

          {/* Escape Vehicle */}
          <div className="space-y-1">
            <label className="text-sm font-mono text-slate-400 uppercase">Escape Vehicle</label>
            <select
              value={criteria.vehicle || ''}
              onChange={(e) => {
                sounds.play('beep');
                setCriteria({ ...criteria, vehicle: e.target.value as EscapeVehicle });
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">(All Vehicles)</option>
              <option value="Seaplane">Seaplane</option>
              <option value="Vintage Sports Car">Vintage Sports Car</option>
              <option value="Armored Yacht">Armored Yacht</option>
              <option value="High-Speed Maglev">High-Speed Maglev</option>
              <option value="Cargo Tramp Steamer">Cargo Tramp Steamer</option>
              <option value="Helicopter">Helicopter</option>
            </select>
          </div>

          {/* Hobby */}
          <div className="space-y-1">
            <label className="text-sm font-mono text-slate-400 uppercase">Hobby / Obsession</label>
            <select
              value={criteria.hobby || ''}
              onChange={(e) => {
                sounds.play('beep');
                setCriteria({ ...criteria, hobby: e.target.value as Hobby });
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">(All Hobbies)</option>
              <option value="Falconry">Falconry</option>
              <option value="Fencing">Fencing</option>
              <option value="Rare Numismatics">Rare Numismatics</option>
              <option value="Celestial Navigation">Celestial Navigation</option>
              <option value="Cryptography">Cryptography</option>
              <option value="Chess">Chess</option>
              <option value="Antique Horology">Antique Horology</option>
              <option value="Opera">Opera</option>
            </select>
          </div>

          {/* Accessory */}
          <div className="space-y-1">
            <label className="text-sm font-mono text-slate-400 uppercase">Signature Accessory</label>
            <select
              value={criteria.accessory || ''}
              onChange={(e) => {
                sounds.play('beep');
                setCriteria({ ...criteria, accessory: e.target.value as SignatureAccessory });
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">(All Accessories)</option>
              <option value="Gold Signet Ring">Gold Signet Ring</option>
              <option value="Silk Ascot">Silk Ascot</option>
              <option value="Brass Monocle">Brass Monocle</option>
              <option value="Leather Trenchcoat">Leather Trenchcoat</option>
              <option value="Pearl Brooch">Pearl Brooch</option>
              <option value="Silver Pocketwatch">Silver Pocketwatch</option>
              <option value="Obsidian Cane">Obsidian Cane</option>
            </select>
          </div>

          {/* Distinguishing Mark */}
          <div className="space-y-1">
            <label className="text-sm font-mono text-slate-400 uppercase">Distinguishing Mark</label>
            <select
              value={criteria.mark || ''}
              onChange={(e) => {
                sounds.play('beep');
                setCriteria({ ...criteria, mark: e.target.value as DistinguishingMark });
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">(All Marks)</option>
              <option value="Ouroboros Tattoo">Ouroboros Tattoo</option>
              <option value="Eyebrow Scar">Eyebrow Scar</option>
              <option value="Clockwork Cuff">Clockwork Cuff</option>
              <option value="Lavender Scent">Lavender Scent</option>
              <option value="Silver Earring">Silver Earring</option>
              <option value="Mechanical Compass">Mechanical Compass</option>
            </select>
          </div>
        </div>

        {/* Status Callout */}
        <div className="pt-2">
          {matchingSuspects.length === 1 ? (
            <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-mono text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>EXACT MATCH FOUND:</strong> Evidence matches <strong>{matchingSuspects[0].name}</strong>. Ready to issue official warrant.
                </span>
              </div>
              <button
                onClick={() => handleIssue(matchingSuspects[0])}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-sm shadow-md shadow-emerald-500/20 cursor-pointer transition-all flex items-center gap-2"
              >
                <Stamp className="w-4 h-4" />
                <span>ISSUE ARREST WARRANT</span>
              </button>
            </div>
          ) : matchingSuspects.length === 0 ? (
            <div className="bg-rose-950/40 border border-rose-500/50 rounded-xl p-3 flex items-center gap-2 text-sm font-mono text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>
                <strong>CONTRADICTORY CRITERIA:</strong> No suspects match this combination of traits. Clear or adjust your filters.
              </span>
            </div>
          ) : (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 flex items-center gap-2 text-sm font-mono text-amber-300">
              <Users className="w-4 h-4 text-amber-400" />
              <span>
                <strong>INSUFFICIENT PROBABLE CAUSE:</strong> {matchingSuspects.length} suspects match. Collect more suspect traits to narrow it down to a single warrant.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Suspects Dossier Gallery */}
      <div className="space-y-3">
        <h3 className="text-base font-bold font-terminal text-white uppercase tracking-wider flex items-center gap-2">
          <span>Interpol Suspect Profiles ({matchingSuspects.length} Matching)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUSPECTS.map((suspect) => {
            const isMatch = matchingSuspects.some((s) => s.id === suspect.id);
            const isWarranted = currentCase.warrantIssuedFor === suspect.id;

            return (
              <div
                key={suspect.id}
                className={`rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                  isWarranted
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-xl ring-2 ring-emerald-500'
                    : isMatch
                    ? 'bg-slate-900 border-slate-700 hover:border-amber-500/50 shadow-md'
                    : 'bg-slate-950/50 border-slate-900 opacity-40 grayscale'
                }`}
              >
                <div>
                  {/* Suspect Avatar & Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-terminal text-xl font-bold text-white shadow-md"
                      style={{ backgroundColor: suspect.accentColor }}
                    >
                      {suspect.name[0]}
                    </div>

                    {isWarranted ? (
                      <span className="px-2 py-0.5 rounded text-sm font-mono font-bold uppercase bg-emerald-500/20 border border-emerald-500 text-emerald-300">
                        Warranted
                      </span>
                    ) : isMatch ? (
                      <span className="px-2 py-0.5 rounded text-sm font-mono font-bold uppercase bg-amber-500/10 border border-amber-500/30 text-amber-300">
                        Under Suspicion
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-xs font-mono uppercase bg-slate-800 text-slate-500">
                        Eliminated
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-base text-slate-100 font-terminal">
                    {suspect.name}
                  </h4>
                  <p className="text-sm text-amber-400 font-mono italic mb-2">
                    "{suspect.alias}"
                  </p>
                  <p className="text-sm text-slate-400 leading-snug line-clamp-2 mb-3">
                    {suspect.bio}
                  </p>

                  {/* Attributes list */}
                  <div className="space-y-1 text-sm font-mono text-slate-300 pt-2 border-t border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hair:</span>
                      <span>{suspect.hair}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vehicle:</span>
                      <span>{suspect.vehicle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hobby:</span>
                      <span>{suspect.hobby}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Accessory:</span>
                      <span>{suspect.accessory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mark:</span>
                      <span>{suspect.mark}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Issue Button if match */}
                {isMatch && !isWarranted && (
                  <div className="pt-3 mt-3 border-t border-slate-800">
                    <button
                      onClick={() => handleIssue(suspect)}
                      className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 font-mono text-sm font-semibold border border-slate-700 transition-colors cursor-pointer"
                    >
                      Issue Warrant for {suspect.name.split(' ')[0]}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
