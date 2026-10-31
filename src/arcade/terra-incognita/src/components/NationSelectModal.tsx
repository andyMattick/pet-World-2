import React, { useState } from 'react';
import { CrownNation } from '../types';
import { NATIONS } from '../data/nations';
import { SoundEngine } from '../utils/audio';
import { CHARTERS, CharterLength } from '../utils/charter';
import { Compass, Anchor, Sparkles, Shield, Flag } from 'lucide-react';

interface NationSelectModalProps {
  onSelectNation: (nation: CrownNation, length: CharterLength) => void;
  savedSummary?: string;   // a saved charter on this device
  onContinue?: () => void;
}

export const NationSelectModal: React.FC<NationSelectModalProps> = ({ onSelectNation, savedSummary, onContinue }) => {
  const [selected, setSelected] = useState<CrownNation>('ENGLAND');
  const [length, setLength] = useState<CharterLength>('short');

  const nationList = Object.keys(NATIONS) as CrownNation[];
  const activeNation = NATIONS[selected];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-[#1C1713] border-2 border-[#78350F] rounded-2xl max-w-3xl w-full p-4 sm:p-8 shadow-2xl text-[#EFE7D8] my-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <span className="text-xs font-serif font-bold tracking-widest text-amber-400 uppercase">
            The First Global Age · 1604 CE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-amber-100 mt-1">
            TERRA INCOGNITA
          </h1>
          <p className="text-xs sm:text-sm text-[#A89279] max-w-xl mx-auto mt-2 leading-relaxed">
            Lead a Royal Exploration Charter to chart the authentic Earth, survey wonders of flora and fauna, negotiate peaceful alliances with indigenous nations, and fund expeditions through reciprocal trade.
          </p>
        </div>

        {savedSummary && onContinue && (
          <button
            onClick={() => { SoundEngine.playShipBell(); onContinue(); }}
            className="w-full mb-5 py-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-50 font-serif font-bold rounded-xl text-sm shadow-xl transition-all cursor-pointer"
          >
            Continue your charter
            <span className="block text-[11px] font-sans font-normal text-emerald-200">{savedSummary}</span>
          </button>
        )}

        {/* 4 Crowns Selection Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {nationList.map(nKey => {
            const nation = NATIONS[nKey];
            const isSelected = selected === nKey;

            return (
              <div
                key={nKey}
                onClick={() => {
                  SoundEngine.playCompassClick();
                  setSelected(nKey);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${
                  isSelected
                    ? 'bg-[#33261C] border-amber-500 shadow-lg scale-105 ring-2 ring-amber-500/30'
                    : 'bg-[#221A15] border-[#3E3023] hover:border-[#6B533C]'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow"
                  style={{ backgroundColor: nation.flagColor }}
                >
                  <Flag className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm font-serif font-bold text-[#E5D7C3]">
                  {nation.adjective}
                </div>
                <div className="text-[10px] text-[#A89279] mt-0.5">
                  {nation.capital.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Nation Perk & Flavor Box */}
        <div className="bg-[#241C16] border border-[#4A3B2C] rounded-xl p-5 mb-6 text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-[#3E3023] pb-2">
            <div>
              <span className="text-sm font-serif font-bold text-amber-200">
                {activeNation.name}
              </span>
              <span className="text-[#A89279] ml-2 italic">
                Ruler: {activeNation.ruler} · "{activeNation.motto}"
              </span>
            </div>
            <span className="font-tabular text-amber-400 font-semibold">
              Treasury: {activeNation.startingDucats} D · {activeNation.startingTimber} Timber
            </span>
          </div>

          <div className="pt-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              National Charter Perk: {activeNation.perkTitle}
            </div>
            <p className="text-[#CBB59C] leading-relaxed">
              {activeNation.perkDescription}
            </p>
          </div>
        </div>

        {/* How long the charter runs: short by default, longer ones save and continue */}
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Your Royal Charter</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(Object.keys(CHARTERS) as CharterLength[]).map(id => {
              const c = CHARTERS[id];
              const on = id === length;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => { SoundEngine.playCompassClick(); setLength(id); }}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${on ? 'bg-[#33261C] border-amber-500' : 'bg-[#221A15] border-[#3E3023] hover:border-[#6B533C]'}`}
                >
                  <div className="text-sm font-serif font-bold text-[#E5D7C3]">{c.name}</div>
                  <div className="text-[11px] text-[#A89279]">{c.blurb}</div>
                  <div className="text-[11px] text-[#CBB59C] mt-1">Chart {c.regions} new lands · survey {c.specimens} plants or animals · sign {c.treaties} {c.treaties === 1 ? 'treaty' : 'treaties'}</div>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-[#A89279] mt-2">Each goal you meet before the charter ends earns a ⭐. Meet all three and the charter ends early in triumph.</p>
        </div>

        {/* Start Game Action Button */}
        <button
          onClick={() => {
            SoundEngine.playShipBell();
            SoundEngine.playFanfare();
            onSelectNation(selected, length);
          }}
          className="w-full py-3.5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-500 text-amber-50 font-serif font-bold rounded-xl text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Anchor className="w-4 h-4" />
          Set Sail on Behalf of {activeNation.name}!
        </button>
      </div>
    </div>
  );
};
