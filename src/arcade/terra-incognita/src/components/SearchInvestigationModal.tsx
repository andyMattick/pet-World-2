import React, { useState } from 'react';
import { MissingMystery } from '../types';
import { SoundEngine } from '../utils/audio';
import { Search, Compass, Award, CheckCircle2, MapPin } from 'lucide-react';

interface SearchInvestigationModalProps {
  mystery: MissingMystery;
  onConcludeInvestigation: (mysteryId: string, prestigeReward: number) => void;
}

export const SearchInvestigationModal: React.FC<SearchInvestigationModalProps> = ({
  mystery,
  onConcludeInvestigation
}) => {
  const [step, setStep] = useState<'CLUE' | 'OUTCOME'>('CLUE');

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="map-paper border-2 border-amber-800 rounded-xl max-w-xl w-full p-6 shadow-2xl text-[#261E17] relative">
        {/* Header */}
        <div className="border-b border-[#78350F]/20 pb-3 mb-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-red-800">
            <span className="flex items-center gap-1.5">
              <Search className="w-4 h-4 text-red-700 animate-pulse" />
              RELIEF EXPEDITION INVESTIGATION
            </span>
            <span className="font-tabular">
              {Math.abs(mystery.lostCoords[0])}°{mystery.lostCoords[0] >= 0 ? 'N' : 'S'}, {Math.abs(mystery.lostCoords[1])}°{mystery.lostCoords[1] >= 0 ? 'E' : 'W'}
            </span>
          </div>

          <h3 className="text-2xl font-serif font-bold text-[#2E1C0C] mt-1">
            Search at {mystery.locationDescription}
          </h3>
          <p className="text-xs text-[#5C4533] mt-0.5">
            Investigating the fate of the long-overdue exploration vessel: <strong>{mystery.shipName}</strong>
          </p>
        </div>

        {/* Clue Phase */}
        {step === 'CLUE' ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#E7D6BE] border border-[#967451]/40 shadow-inner">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-800" />
                Discovery: {mystery.clueTitle}
              </h4>
              <p className="text-sm font-serif leading-relaxed text-[#382617] italic mt-2">
                "{mystery.clueText}"
              </p>
            </div>

            <p className="text-xs text-[#5C4533] leading-relaxed">
              Your landing party conducts an exhaustive search of the coastline, following footpaths through the dunes and interviewing the local elders.
            </p>

            <button
              onClick={() => {
                SoundEngine.playQuillScratch();
                SoundEngine.playFanfare();
                setStep('OUTCOME');
              }}
              className="w-full py-2.5 bg-amber-800 hover:bg-amber-700 text-amber-100 rounded-lg text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              Follow the Trails to Solve the Mystery
            </button>
          </div>
        ) : (
          /* Outcome Phase */
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#DFCEB3] border border-emerald-800/40 text-xs leading-relaxed text-[#2A1D11] shadow-inner space-y-2">
              <div className="font-serif font-bold text-base text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                What Your Search Suggests
              </div>
              <p className="italic text-sm text-[#382617] leading-relaxed">
                "{mystery.loreReward}"
              </p>
              <div className="pt-2 border-t border-[#A88863]/40 flex items-center justify-between font-bold text-emerald-900">
                <span>Survivors Accounted For: {mystery.survivorsFound} souls</span>
                <span className="font-tabular">+{mystery.prestigeReward} Royal Prestige</span>
              </div>
            </div>

            <button
              onClick={() => {
                SoundEngine.playFanfare();
                onConcludeInvestigation(mystery.id, mystery.prestigeReward);
              }}
              className="w-full py-2.5 bg-[#78350F] hover:bg-[#92400E] text-amber-100 rounded-lg text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              Dispatch News to the Admiralty & Close Case
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
