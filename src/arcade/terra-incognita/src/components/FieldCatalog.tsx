import React, { useState } from 'react';
import { Specimen, SpecimenCategory } from '../types';
import { SoundEngine } from '../utils/audio';
import { BookOpen, Sparkles, Send, CheckCircle2, Leaf, Compass, Feather, Waves, Mountain, ShieldAlert } from 'lucide-react';

interface FieldCatalogProps {
  specimens: Specimen[];
  onPresentToAcademy: (specimenId: string) => void;
  playerNationAdjective: string;
}

export const FieldCatalog: React.FC<FieldCatalogProps> = ({
  specimens,
  onPresentToAcademy,
  playerNationAdjective
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string>(
    specimens.find(s => s.discovered)?.id || specimens[0]?.id || ''
  );

  const filtered = specimens.filter(s => {
    if (filterCategory === 'ALL') return true;
    return s.category === filterCategory;
  });

  const discoveredCount = specimens.filter(s => s.discovered).length;
  const selectedSpecimen = specimens.find(s => s.id === selectedSpecimenId);

  const getCategoryIcon = (category: SpecimenCategory) => {
    switch (category) {
      case 'FLORA':
        return <Leaf className="w-4 h-4 text-emerald-400" />;
      case 'FAUNA':
        return <Feather className="w-4 h-4 text-amber-400" />;
      case 'WONDER':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'GEOGRAPHY':
        return <Mountain className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#181411] text-[#EFE7D8] p-6 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#382E25]">
        <div>
          <h2 className="text-xl font-serif font-bold text-amber-200 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            The Royal Naturalist Compendium
          </h2>
          <p className="text-xs text-[#A89279] mt-0.5">
            Illustrated botanical, zoological, and geographical surveys cataloged by {playerNationAdjective} scholars.
          </p>
        </div>

        {/* Counter */}
        <div className="text-right">
          <span className="text-sm font-tabular text-amber-300 font-semibold">
            {discoveredCount} / {specimens.length}
          </span>
          <span className="text-xs text-[#A89279] ml-2">Specimens Documented</span>
        </div>
      </div>

      {/* Main split view */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0 pt-4">
        {/* Left Column: Specimen List & Filter Tabs */}
        <div className="md:col-span-5 flex flex-col h-full bg-[#201A15] border border-[#423425] rounded-lg p-3 overflow-hidden">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 pb-3 border-b border-[#382E25] shrink-0">
            {['ALL', 'FLORA', 'FAUNA', 'GEOGRAPHY', 'WONDER'].map(cat => (
              <button
                key={cat}
                onClick={() => {
                  SoundEngine.playCompassClick();
                  setFilterCategory(cat);
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-amber-700 text-white font-semibold'
                    : 'text-[#A89279] hover:text-[#EFE7D8] hover:bg-[#2E241B]'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* List of specimens */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pt-2 pr-1">
            {filtered.map(specimen => {
              const isSelected = specimen.id === selectedSpecimenId;
              return (
                <div
                  key={specimen.id}
                  onClick={() => {
                    SoundEngine.playCompassClick();
                    setSelectedSpecimenId(specimen.id);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#33261C] border-amber-600/80 shadow-md'
                      : specimen.discovered
                        ? 'bg-[#261E17] border-[#3E3023] hover:border-[#6B533C]'
                        : 'bg-[#1D1713]/60 border-[#2D221A] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 rounded bg-[#181310] border border-[#423425] shrink-0">
                      {specimen.discovered ? getCategoryIcon(specimen.category) : <Compass className="w-4 h-4 text-stone-600" />}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-serif font-bold text-[#E5D7C3] truncate">
                        {specimen.discovered ? specimen.name : 'Uncharted Specimen'}
                      </div>
                      <div className="text-[11px] text-[#A89279] italic truncate">
                        {specimen.discovered ? specimen.scientificName : 'Region unknown'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {specimen.discovered ? (
                      <span className="text-[11px] font-tabular text-emerald-400 font-medium">
                        +{specimen.prestigeValue} P
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-600">Undiscovered</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Specimen Field Journal Entry */}
        <div className="md:col-span-7 flex flex-col h-full bg-[#201A15] border border-[#423425] rounded-lg p-6 overflow-y-auto map-paper text-[#261E17]">
          {selectedSpecimen ? (
            selectedSpecimen.discovered ? (
              <div className="space-y-4">
                {/* Specimen Header */}
                <div className="border-b border-[#78350F]/20 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      {selectedSpecimen.category} · {selectedSpecimen.regionName}
                    </span>
                    <span className="text-xs font-tabular text-amber-900 font-semibold">
                      Yield: +{selectedSpecimen.prestigeValue} Prestige · {selectedSpecimen.crownGrantDucats} Ducats
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#2E1C0C] mt-1">
                    {selectedSpecimen.name}
                  </h3>
                  <p className="text-sm italic font-serif text-[#573D26]">
                    Modern scientific name: {selectedSpecimen.scientificName}
                  </p>
                </div>

                {/* Botanical / Physical Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#78350F] mb-1">
                    Morphology & Geography
                  </h4>
                  <p className="text-sm leading-relaxed text-[#3B2918]">
                    {selectedSpecimen.description}
                  </p>
                </div>

                {/* Whimsical Naturalist Field Notes */}
                <div className="p-3.5 rounded bg-[#E4D8C2]/90 border border-[#B48E68]/40 shadow-inner">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    Naturalist's Expedition Diary
                  </h4>
                  <p className="text-xs leading-relaxed italic text-[#382617]">
                    {selectedSpecimen.fieldNotes}
                  </p>
                </div>

                {/* Academy Dispatch Action */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-[#573D26]">
                    {selectedSpecimen.dateDiscovered ? (
                      <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        Published in Royal Annals on {selectedSpecimen.dateDiscovered}
                      </span>
                    ) : (
                      <span>Unpublished field specimen ready for academic review.</span>
                    )}
                  </div>

                  {!selectedSpecimen.dateDiscovered && (
                    <button
                      onClick={() => {
                        SoundEngine.playQuillScratch();
                        SoundEngine.playFanfare();
                        onPresentToAcademy(selectedSpecimen.id);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#78350F] hover:bg-[#92400E] text-amber-100 rounded-lg text-xs font-semibold shadow-md transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Present to the Royal Court
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 text-[#6B533C]">
                <Compass className="w-12 h-12 text-[#8C6F52] mb-3 opacity-60" />
                <h3 className="text-lg font-serif font-bold text-[#4A3725]">Uncharted Specimen</h3>
                <p className="text-xs max-w-sm mt-1 leading-relaxed">
                  Sail an expedition ship into the <strong>{selectedSpecimen.regionName}</strong> or send an inland survey team to uncover this specimen.
                </p>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full text-[#6B533C] text-sm">
              Select a specimen to inspect field notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
