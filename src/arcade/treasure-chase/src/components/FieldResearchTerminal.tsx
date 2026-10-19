import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Copy,
  CheckCircle2,
  Bookmark,
  FileText,
  MapPin,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { FIELD_ENCYCLOPEDIA } from '../data/encyclopedia';
import { GameCase } from '../types/game';
import { sounds } from '../services/soundEffects';

interface FieldResearchTerminalProps {
  currentCase: GameCase;
  initialSearchQuery?: string;
}

export const FieldResearchTerminal: React.FC<FieldResearchTerminalProps> = ({
  currentCase,
  initialSearchQuery = '',
}) => {
  const [activeTab, setActiveTab] = useState<'encyclopedia' | 'notebook'>('notebook');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    sounds.play('beep');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredEntries = FIELD_ENCYCLOPEDIA.filter((entry) => {
    const matchesCat = selectedCategory === 'All' || entry.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;

    const inTitle = entry.title.toLowerCase().includes(q);
    const inSummary = entry.summary.toLowerCase().includes(q);
    const inTags = entry.tags.some((t) => t.toLowerCase().includes(q));
    const inCities = entry.relatedCities.some((c) => c.toLowerCase().includes(q));

    return matchesCat && (inTitle || inSummary || inTags || inCities);
  });

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 crt-screen">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-terminal text-white">
              Field Intelligence & Research Terminal
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Cross-reference historical battles, dynasties, architecture, and consult your case notebook.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              sounds.play('click');
              setActiveTab('notebook');
            }}
            className={`px-4 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'notebook'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Case Notebook ({currentCase.clueLog.length})</span>
          </button>

          <button
            onClick={() => {
              sounds.play('click');
              setActiveTab('encyclopedia');
            }}
            className={`px-4 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'encyclopedia'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bureau Encyclopedia ({FIELD_ENCYCLOPEDIA.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'notebook' ? (
        /* Case Notebook View */
        <div className="space-y-6">
          {/* Artifact Brief Banner */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                TARGET OF INVESTIGATION
              </span>
              <h3 className="text-xl font-bold font-terminal text-white">
                {currentCase.artifact.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {currentCase.artifact.era} ({currentCase.artifact.estimatedYear}) • Origin: {currentCase.artifact.originCity}, {currentCase.artifact.originCountry}
              </p>
            </div>

            <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
              <span>Home: {currentCase.artifact.currentHome}</span>
            </div>
          </div>

          {/* Clues Discovered Log */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-terminal text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Witness Testimony & Evidence Log ({currentCase.clueLog.length} Records)</span>
              </h3>
            </div>

            {currentCase.clueLog.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-10 text-center space-y-2">
                <p className="text-sm text-slate-400">
                  No clues recorded yet. Visit sites in {currentCase.currentCity.name} to interview witnesses!
                </p>
                <p className="text-xs font-mono text-slate-500">
                  Every interviewed witness statement will be automatically transcribed here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentCase.clueLog.map((clue, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                      <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {clue.cityName} • {clue.siteName}
                      </span>
                      <span className="text-slate-500">{clue.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-200 font-mono italic leading-relaxed">
                      "{clue.text}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          clue.category === 'suspect'
                            ? 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {clue.category === 'suspect' ? `Suspect: ${clue.suspectTraitName}` : 'Destination Trail'}
                      </span>

                      <button
                        onClick={() => handleCopy(clue.text, `notebook-${idx}`)}
                        className="text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedText === `notebook-${idx}` ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy for search</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Flight Log History */}
          {currentCase.flightLog.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold font-terminal text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Flight Log & Tracking History</span>
              </h3>
              <div className="space-y-2">
                {currentCase.flightLog.map((log, i) => (
                  <div
                    key={i}
                    className="bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-slate-300">
                      Leg {i + 1}: {log.from} → {log.to}
                    </span>
                    <span className="text-amber-400 font-bold">-{log.hoursSpent} Hours</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Encyclopedia Tab View */
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search battles, dynasties, architecture, historical figures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {['All', 'Battle', 'Dynasty', 'Architecture', 'Geography', 'Numismatics'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sounds.play('click');
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Research Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntries.map((entry, idx) => (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-purple-500/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 font-bold uppercase">
                      {entry.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{entry.dateOrEra}</span>
                  </div>

                  <h4 className="text-base font-bold font-terminal text-white mt-1">
                    {entry.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    {entry.summary}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {entry.relatedCities.map((city, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300"
                      >
                        📍 {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Bureau Classified File</span>
                  <button
                    onClick={() => handleCopy(entry.title, `encyclopedia-${idx}`)}
                    className="text-slate-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === `encyclopedia-${idx}` ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy title</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
