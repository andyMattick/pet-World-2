import React from 'react';
import { RegionPOI, IndigenousCulture, Specimen } from '../types';
import { SoundEngine } from '../utils/audio';
import { MapPin, Compass, Handshake, TreePine, Sparkles, Anchor, X, CheckCircle2 } from 'lucide-react';

interface RegionInspectorProps {
  region: RegionPOI;
  culture?: IndigenousCulture;
  specimens: Specimen[];
  ducats: number;
  timber: number;
  onClose: () => void;
  onSurveyRegion: (regionId: string) => void;
  onOpenDiplomacy: (cultureId: string) => void;
  onEstablishTreatyPost: (regionId: string, timberCost: number, ducatsCost: number) => void;
  selectedShipName?: string;   // the ship that "Sail here" sends
  onSendShip?: () => void;
}

export const RegionInspector: React.FC<RegionInspectorProps> = ({
  region,
  culture,
  specimens,
  ducats,
  timber,
  onClose,
  onSurveyRegion,
  onOpenDiplomacy,
  onEstablishTreatyPost,
  selectedShipName,
  onSendShip
}) => {
  const regionSpecimens = specimens.filter(s => region.specimenIds.includes(s.id));
  const discoveredCount = regionSpecimens.filter(s => s.discovered).length;

  return (
    <div className="absolute top-2 sm:top-16 left-2 right-2 sm:left-auto sm:right-4 sm:w-96 bg-[#201A15]/95 border border-[#4A3B2C] rounded-xl shadow-2xl p-5 text-[#EFE7D8] z-30 backdrop-blur-md flex flex-col max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-[#382E25]">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            {region.biome} REGION
          </div>
          <h3 className="text-lg font-serif font-bold text-amber-200 mt-0.5">
            {region.name}
          </h3>
          <div className="text-xs font-tabular text-[#A89279]">
            {Math.abs(region.coords[0]).toFixed(1)}°{region.coords[0] >= 0 ? 'N' : 'S'} ·{' '}
            {Math.abs(region.coords[1]).toFixed(1)}°{region.coords[1] >= 0 ? 'E' : 'W'}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-[#A89279] hover:text-[#EFE7D8] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description / Notes */}
      <p className="text-xs text-[#CBB59C] italic my-3 leading-relaxed">
        "{region.notes}"
      </p>

      {/* Sail here: a ship has to reach a place before she can survey it or meet the people who live there */}
      {onSendShip && selectedShipName && (
        <button
          onClick={() => { SoundEngine.playShipBell(); onSendShip(); }}
          className="mb-3 w-full py-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-50 rounded text-sm font-serif font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Anchor className="w-4 h-4" />
          Sail here with {selectedShipName}
        </button>
      )}
      {!region.discovered && (
        <p className="mb-3 text-[11px] text-amber-300 bg-[#2B2118] border border-[#5C4533] rounded p-2">
          Not charted yet. Send a ship here first: when it drops anchor, you can survey the land{culture ? ` and meet the ${culture.name}` : ''}.
        </p>
      )}

      {/* Sovereign Indigenous Culture Banner */}
      {culture && (
        <div className="p-3 rounded-lg bg-[#261E17] border border-[#3E3023] mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-amber-300">
              {culture.name}
            </span>
            <span className="text-[10px] font-tabular text-amber-400">
              {culture.harmony}% Harmony
            </span>
          </div>
          <p className="text-[11px] text-[#A89279] italic line-clamp-2">
            {culture.welcomeQuote}
          </p>

          <button
            onClick={() => {
              SoundEngine.playCompassClick();
              onOpenDiplomacy(culture.id);
            }}
            className="mt-2.5 w-full py-1.5 bg-[#4A3827] hover:bg-[#5C4533] text-amber-200 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Handshake className="w-3.5 h-3.5" />
            Open Diplomatic Council
          </button>
        </div>
      )}

      {/* Land Survey Section */}
      <div className="p-3 rounded-lg bg-[#261E17] border border-[#3E3023] mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            Land & Botanical Survey
          </span>
          <span className="text-[11px] font-tabular text-[#A89279]">
            {discoveredCount} / {regionSpecimens.length} Documented
          </span>
        </div>

        {/* Specimen icons row */}
        <div className="space-y-1.5 my-2">
          {regionSpecimens.map(sp => (
            <div key={sp.id} className="flex items-center justify-between text-[11px] p-1.5 rounded bg-[#181310] border border-[#30251B]">
              <span className={sp.discovered ? 'text-[#E5D7C3] font-medium' : 'text-stone-500 italic'}>
                {sp.discovered ? sp.name : 'Uncataloged Species'}
              </span>
              <span className="text-[10px] font-tabular text-emerald-400">
                {sp.discovered ? `+${sp.prestigeValue} P` : '?'}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            SoundEngine.playQuillScratch();
            onSurveyRegion(region.id);
          }}
          disabled={!region.discovered || discoveredCount === regionSpecimens.length}
          className="w-full py-1.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 text-emerald-100 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <TreePine className="w-3.5 h-3.5" />
          {discoveredCount === regionSpecimens.length ? 'Region Fully Surveyed' : 'Launch Inland Survey Trek'}
        </button>
      </div>

      {/* Treaty Outpost Section */}
      <div className="p-3 rounded-lg bg-[#261E17] border border-[#3E3023]">
        <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
          <Anchor className="w-3.5 h-3.5" />
          Treaty Outpost
        </div>
        <p className="text-[11px] text-[#A89279] mb-2 leading-relaxed">
          Permanent supply and astronomical charting station. Serves as resupply point for long-distance voyages.
        </p>

        {region.hasTreatyPost ? (
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 py-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Treaty Post Active (Resupply & Trade Route Port)
          </div>
        ) : (
          <button
            onClick={() => {
              if (region.discovered && timber >= 30 && ducats >= 100) {
                SoundEngine.playFanfare();
                onEstablishTreatyPost(region.id, 30, 100);
              }
            }}
            disabled={!region.discovered || timber < 30 || ducats < 100}
            className="w-full py-1.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-40 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
          >
            Found Treaty Post (100 D, 30 Timber)
          </button>
        )}
      </div>
    </div>
  );
};
