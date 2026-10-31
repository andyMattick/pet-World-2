import React, { useState, useEffect } from 'react';
import { ExpeditionShip } from '../types';
import { SoundEngine } from '../utils/audio';
import { Sparkles, Compass, CheckCircle2, Moon, Star, RotateCw, RotateCcw, Award } from 'lucide-react';

interface CelestialNavigationModalProps {
  ship: ExpeditionShip;
  onApplyCelestialFix: (shipId: string, starName: string, speedBonusPct: number) => void;
  onClose: () => void;
}

export const CelestialNavigationModal: React.FC<CelestialNavigationModalProps> = ({
  ship,
  onApplyCelestialFix,
  onClose
}) => {
  const isNorthern = ship.coords[0] >= 0;
  const targetStarName = isNorthern ? 'Polaris (The North Star)' : 'South Celestial Pole (found from the Southern Cross)';
  const trueAltitude = Math.abs(Math.round(ship.coords[0])); // the height of the celestial pole (Polaris, or the point the Southern Cross points to) equals the observer's latitude
  
  // Starting alignment with a random offset between 10 to 25 degrees
  const initialOffset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 15) + 12);
  const [currentAltitude, setCurrentAltitude] = useState<number>(Math.max(5, Math.min(85, trueAltitude + initialOffset)));
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);
  const [hasApplied, setHasApplied] = useState<boolean>(false);

  // Check if player has aligned within +/- 2 degrees
  const deviation = Math.abs(currentAltitude - trueAltitude);
  const isAligned = deviation <= 2;

  const navigatorOfficer = ship.officers.find(o => o.role === 'NAVIGATOR');

  const handleAdjustAngle = (delta: number) => {
    if (hasApplied) return;
    SoundEngine.playCompassClick();
    setCurrentAltitude(prev => Math.max(0, Math.min(90, prev + delta)));
  };

  const handleConfirmFix = () => {
    SoundEngine.playCelestialChime();
    SoundEngine.playFanfare();
    setIsCalibrated(true);
    setHasApplied(true);
    onApplyCelestialFix(ship.id, targetStarName, 15);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-start sm:items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-[#12151D] border-2 border-amber-500/70 rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-[#E5E9F0] relative overflow-hidden">
        {/* Starlit Celestial Backdrop Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#0B0F19] to-[#05070D] opacity-90 pointer-events-none" />
        
        {/* Subtle Constellation Star Dust */}
        <div className="absolute top-6 right-10 flex gap-2 opacity-60 pointer-events-none">
          <Star className="w-2 h-2 text-amber-200 animate-pulse" />
          <Star className="w-3 h-3 text-cyan-200 animate-ping" />
          <Star className="w-2.5 h-2.5 text-blue-100" />
        </div>

        {/* Header */}
        <div className="relative border-b border-amber-600/30 pb-3 mb-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400">
            <span className="flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-cyan-300" />
              NOCTURNAL CELESTIAL NAVIGATION
            </span>
            <span className="font-tabular text-cyan-200">
              Vessel: {ship.name}
            </span>
          </div>

          <h3 className="text-2xl font-serif font-bold text-amber-100 mt-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Taking Sight of {targetStarName}
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Measuring the pole's height with the astrolabe at night fixes your latitude, so you can sail "down the latitude" to your goal, unlocking a <strong className="text-amber-300">+15% Speed Bonus</strong> along oceanic sea lanes.
          </p>
        </div>

        {/* Main Observation Viewport */}
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-5 mb-5">
          {/* Left Column: Visual Starlit Astrolabe View */}
          <div className="md:col-span-7 bg-[#0A0D14] border border-amber-600/40 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[260px] overflow-hidden">
            {/* Sea Horizon Line */}
            <div className="absolute bottom-10 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <span className="absolute bottom-4 left-4 text-[10px] uppercase font-tabular tracking-widest text-cyan-400/60">
              True Sea Horizon (0°)
            </span>

            {/* Target Star Position */}
            <div 
              className="absolute transition-all duration-300 flex flex-col items-center"
              style={{
                bottom: `${(trueAltitude / 90) * 160 + 40}px`,
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 animate-ping absolute" />
                <Star className="w-6 h-6 text-amber-300 fill-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              </div>
              <span className="text-[10px] font-serif font-bold text-amber-200 whitespace-nowrap mt-1 drop-shadow">
                {targetStarName}
              </span>
            </div>

            {/* Brass Alidade Sight Line (Rotated by player) */}
            <div 
              className="absolute left-0 right-0 h-0.5 transition-all duration-150 flex items-center justify-between"
              style={{
                bottom: `${(currentAltitude / 90) * 160 + 40}px`
              }}
            >
              <div className="w-4 h-4 rounded-full border-2 border-amber-400 bg-amber-600/60 ml-2" />
              <div className={`flex-1 border-t-2 border-dashed ${isAligned ? 'border-emerald-400' : 'border-amber-400/70'}`} />
              <div className="w-4 h-4 rounded-full border-2 border-amber-400 bg-amber-600/60 mr-2" />
            </div>

            {/* Alignment Reticle Status */}
            <div className="absolute top-3 right-3 text-right">
              <span className={`text-xs font-tabular font-bold px-2 py-0.5 rounded border ${
                isAligned 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-amber-950/80 text-amber-300 border-amber-600'
              }`}>
                {isAligned ? '✦ SIGHT ALIGNED' : `Deviation: ${deviation}°`}
              </span>
            </div>

            {/* Astrolabe Arc Degree Ticks */}
            <div className="absolute left-3 top-4 bottom-10 flex flex-col justify-between text-[9px] font-tabular text-[#64748B]">
              <span>90° Zenith</span>
              <span>60°</span>
              <span>30°</span>
              <span>0°</span>
            </div>
          </div>

          {/* Right Column: Instrument Controls & Navigator Lore */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-3">
            <div className="bg-[#181E2C] border border-[#2A3449] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">Astrolabe Angle:</span>
                <span className="text-base font-tabular font-bold text-amber-300">
                  {currentAltitude}°
                </span>
              </div>

              {/* Slider for smooth tactile angle control */}
              <input
                type="range"
                min="0"
                max="90"
                value={currentAltitude}
                onChange={(e) => {
                  if (!hasApplied) {
                    SoundEngine.playCompassClick();
                    setCurrentAltitude(parseInt(e.target.value));
                  }
                }}
                disabled={hasApplied}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-[#0F172A] rounded-lg"
              />

              {/* Fine Calibration Stepper Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                <button
                  onClick={() => handleAdjustAngle(-5)}
                  disabled={hasApplied}
                  className="py-1 px-1 bg-[#263147] hover:bg-[#334155] rounded text-[11px] font-tabular text-[#E2E8F0] disabled:opacity-50"
                >
                  -5°
                </button>
                <button
                  onClick={() => handleAdjustAngle(-1)}
                  disabled={hasApplied}
                  className="py-1 px-1 bg-[#263147] hover:bg-[#334155] rounded text-[11px] font-tabular text-[#E2E8F0] disabled:opacity-50"
                >
                  -1°
                </button>
                <button
                  onClick={() => handleAdjustAngle(1)}
                  disabled={hasApplied}
                  className="py-1 px-1 bg-[#263147] hover:bg-[#334155] rounded text-[11px] font-tabular text-[#E2E8F0] disabled:opacity-50"
                >
                  +1°
                </button>
                <button
                  onClick={() => handleAdjustAngle(5)}
                  disabled={hasApplied}
                  className="py-1 px-1 bg-[#263147] hover:bg-[#334155] rounded text-[11px] font-tabular text-[#E2E8F0] disabled:opacity-50"
                >
                  +5°
                </button>
              </div>
            </div>

            {/* Navigator Officer Bonus Lore */}
            <div className="p-3 rounded-lg bg-[#151C28] border border-[#283548] text-xs">
              <div className="font-serif font-bold text-amber-200 mb-0.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                {navigatorOfficer ? navigatorOfficer.name : 'Master Helmsman'}
              </div>
              <p className="text-[11px] italic text-[#94A3B8] leading-snug">
                {navigatorOfficer 
                  ? `"${navigatorOfficer.quote}"` 
                  : '"Line up the brass sighting vanes with the North Star to fix our true latitude without relying on dead-reckoning."'}
              </p>
            </div>
          </div>
        </div>

        {/* Outcome & Action Footer */}
        <div className="relative pt-3 border-t border-amber-600/30 flex items-center justify-between">
          <div className="text-xs">
            {isCalibrated ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Celestial Sight Recorded! +15% Speed Bonus Active across Sea Lanes.
              </span>
            ) : isAligned ? (
              <span className="text-emerald-300 font-medium animate-pulse">
                ✦ Sights True! Press below to lock the celestial course fix.
              </span>
            ) : (
              <span className="text-[#94A3B8]">
                Adjust the astrolabe angle until the sight line intersects the guiding star.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#94A3B8] hover:text-white transition-colors"
            >
              {hasApplied ? 'Close Observatory' : 'Dismiss'}
            </button>

            {!hasApplied && (
              <button
                onClick={handleConfirmFix}
                disabled={!isAligned}
                className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-40 text-black font-serif font-bold text-xs rounded-lg shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Fix Course (+15% Speed)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
