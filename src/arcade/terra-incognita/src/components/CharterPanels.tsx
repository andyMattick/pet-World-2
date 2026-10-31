/* The Royal Charter: the goals strip under the top bar, a short how-to, and the end screen (docs/TERRA-INCOGNITA.md). */
import React, { useState } from 'react';
import { CharterConfig, CharterProgress, goalsMet } from '../utils/charter';
import { CharterResult } from '../utils/embed';

const Goal: React.FC<{ label: string; have: number; need: number }> = ({ label, have, need }) => {
  const done = have >= need;
  return (
    <span className={`whitespace-nowrap ${done ? 'text-emerald-300 font-semibold' : 'text-[#E5D7C3]'}`}>
      {done ? '⭐' : '☆'} {label} {Math.min(Math.max(0, have), need)}/{need}
    </span>
  );
};

export const CharterBar: React.FC<{ config: CharterConfig; progress: CharterProgress; endDateStr: string }> = ({ config, progress, endDateStr }) => {
  const [help, setHelp] = useState(false);
  return (
    <div className="shrink-0 border-b border-[#382E25] bg-[#211912] text-xs px-3 sm:px-6 py-1.5 z-30">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-serif font-bold text-amber-300 whitespace-nowrap">📜 {config.name}</span>
        <span className="text-[#A89279] whitespace-nowrap">ends {endDateStr}</span>
        <Goal label="New lands" have={progress.regions} need={config.regions} />
        <Goal label="Plants & animals" have={progress.specimens} need={config.specimens} />
        <Goal label="Treaties" have={progress.treaties} need={config.treaties} />
        <button
          type="button"
          onClick={() => setHelp(h => !h)}
          aria-expanded={help}
          className="ml-auto px-2 py-0.5 rounded border border-[#5C4533] text-amber-200 hover:bg-[#382E25] cursor-pointer"
        >
          {help ? 'Hide help' : 'How to play'}
        </button>
      </div>
      {help && (
        <ol className="list-decimal pl-5 mt-2 mb-1 space-y-1 text-[#CBB59C] max-w-3xl">
          <li><strong className="text-amber-200">Sail.</strong> Your flagship is picked. Tap a place on the map, then <em>Sail here</em>. Use 3x or 8x to speed up time.</li>
          <li><strong className="text-amber-200">Chart.</strong> When the ship drops anchor somewhere new, that land is charted.</li>
          <li><strong className="text-amber-200">Survey.</strong> Tap a charted place and <em>Launch Inland Survey Trek</em> to record its plants and animals.</li>
          <li><strong className="text-amber-200">Make friends.</strong> Where people live, open the Diplomatic Council: give gifts they value, trade fairly, and at 65% harmony sign a treaty.</li>
          <li>Take a star sight at night for a faster voyage, and keep an eye on supplies in Harbor &amp; Ships.</li>
        </ol>
      )}
    </div>
  );
};

export const CharterEndModal: React.FC<{
  config: CharterConfig;
  result: CharterResult;
  embedded: boolean;
  onNewCharter: () => void;
  onBack: () => void;
}> = ({ config, result, embedded, onNewCharter, onBack }) => {
  const stars = goalsMet(config, result);
  const allMet = stars === 3;
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 z-[60] overflow-y-auto">
      <div role="dialog" aria-label="Charter complete" className="bg-[#1C1713] border-2 border-[#78350F] rounded-2xl max-w-lg w-full p-5 sm:p-7 text-center text-[#EFE7D8] shadow-2xl my-auto">
        <div className="text-xs font-serif font-bold tracking-widest text-amber-400 uppercase">{config.name} · {result.months} month{result.months === 1 ? '' : 's'}</div>
        <h2 className="text-2xl font-serif font-extrabold text-amber-100 mt-1">{allMet ? 'Charter fulfilled!' : 'The charter has ended'}</h2>
        <div className="text-4xl my-3" aria-label={`${stars} of 3 stars`}>{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
        <ul className="text-sm text-[#CBB59C] space-y-1 mb-4">
          <li>{result.regions >= config.regions ? '⭐' : '☆'} Charted {result.regions} new land{result.regions === 1 ? '' : 's'} (goal {config.regions})</li>
          <li>{result.specimens >= config.specimens ? '⭐' : '☆'} Surveyed {result.specimens} plant{result.specimens === 1 ? '' : 's'} and animals (goal {config.specimens})</li>
          <li>{result.treaties >= config.treaties ? '⭐' : '☆'} Signed {result.treaties} {result.treaties === 1 ? 'treaty' : 'treaties'} (goal {config.treaties})</li>
        </ul>
        <p className="text-xs text-[#A89279] mb-5">
          {allMet
            ? 'The Crown’s scholars praise a voyage built on trust, fair trade and careful records.'
            : 'Each goal met earns a star. Try again: sail sooner, survey every place you chart, and give gifts the people you meet value.'}
          {' '}Prestige: {result.prestige}.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button onClick={onNewCharter} className="px-4 py-2.5 bg-amber-700 hover:bg-amber-600 text-amber-50 font-serif font-bold rounded-xl text-sm cursor-pointer">New charter</button>
          {embedded && <button onClick={onBack} className="px-4 py-2.5 bg-[#382E25] hover:bg-[#4A3B2C] text-amber-100 font-serif font-bold rounded-xl text-sm cursor-pointer">Back to Pet World</button>}
        </div>
      </div>
    </div>
  );
};
