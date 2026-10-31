import React, { useState } from 'react';
import { RandomEncounter } from '../types';
import { SoundEngine } from '../utils/audio';
import { Sparkles, Compass, AlertCircle, CheckCircle } from 'lucide-react';

interface EncounterModalProps {
  encounter: RandomEncounter;
  onResolve: (optionIndex: number) => void;
}

export const EncounterModal: React.FC<EncounterModalProps> = ({
  encounter,
  onResolve
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [resolvedResult, setResolvedResult] = useState<string | null>(null);

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    const opt = encounter.options[idx];
    
    // Check risk roll if applicable
    let resultText = opt.successText;
    if (opt.riskChance && Math.random() < opt.riskChance && opt.failureText) {
      resultText = opt.failureText;
    }
    
    SoundEngine.playCompassClick();
    setResolvedResult(resultText);
  };

  const handleConfirm = () => {
    if (selectedOption !== null) {
      onResolve(selectedOption);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="map-paper border border-[#78350F] rounded-xl max-w-xl w-full p-6 shadow-2xl text-[#261E17] relative">
        {/* Header */}
        <div className="border-b border-[#78350F]/20 pb-3 mb-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-900">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-800" />
              {encounter.type} EXPEDITION ENCOUNTER
            </span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#2E1C0C] mt-1">
            {encounter.title}
          </h3>
        </div>

        {/* Narrative Description */}
        <div className="space-y-3 mb-5">
          <p className="text-sm font-serif leading-relaxed text-[#3B2918] italic">
            "{encounter.description}"
          </p>
          <div className="text-[11px] text-[#6B533C] bg-[#E7D6BE] p-2.5 rounded border border-[#A68866]/30">
            <strong className="text-amber-950 font-serif">Historical Chronicle:</strong> {encounter.historicalContext}
          </div>
        </div>

        {/* Decision Options or Resolved Result */}
        {!resolvedResult ? (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#78350F]">
              How does the expedition captain respond?
            </h4>
            {encounter.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className="w-full text-left p-3.5 rounded-lg bg-[#EAE0CD] hover:bg-[#E2D5BE] border border-[#B49574]/40 hover:border-[#78350F] transition-all cursor-pointer shadow-sm group"
              >
                <div className="text-xs font-serif font-bold text-[#2E1C0C] group-hover:text-amber-900">
                  {opt.label}
                </div>
                <div className="text-[11px] text-[#5C4533] mt-0.5">
                  {opt.description}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#DFCEB3] border border-amber-700/40 text-xs leading-relaxed text-[#2A1D11] shadow-inner">
              <div className="font-serif font-bold text-sm text-[#2E1C0C] mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-800" />
                The Outcome
              </div>
              <p className="italic">{resolvedResult}</p>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-2.5 bg-[#78350F] hover:bg-[#92400E] text-amber-100 rounded-lg text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              Record in Ship's Log & Continue Voyage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
