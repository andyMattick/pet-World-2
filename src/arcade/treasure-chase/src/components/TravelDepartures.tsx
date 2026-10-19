import React, { useState } from 'react';
import { Plane, Compass, ArrowRight, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import { CityDestination, GameCase } from '../types/game';
import { calculateDistanceKm, calculateFlightHours } from '../services/gameEngine';
import { sounds } from '../services/soundEffects';

interface TravelDeparturesProps {
  currentCase: GameCase;
  onSelectFlight: (destination: CityDestination) => void;
  isFlying: boolean;
  flyingDestination: CityDestination | null;
}

export const TravelDepartures: React.FC<TravelDeparturesProps> = ({
  currentCase,
  onSelectFlight,
  isFlying,
  flyingDestination,
}) => {
  const currentLeg = currentCase.legs[currentCase.currentLegIndex];
  const travelOptions = currentLeg?.travelOptions || [];
  const [selectedCity, setSelectedCity] = useState<CityDestination | null>(null);

  if (isFlying && flyingDestination) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center max-w-xl mx-auto shadow-2xl space-y-6 crt-screen">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto animate-pulse">
            <Plane className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">
            TRANSIT FLIGHT IN PROGRESS
          </span>
          <h2 className="text-2xl font-bold font-terminal text-white">
            Flying from {currentCase.currentCity.name} to {flyingDestination.name}
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Distance: {calculateDistanceKm(currentCase.currentCity.lat, currentCase.currentCity.lng, flyingDestination.lat, flyingDestination.lng)} km
            • Duration: {calculateFlightHours(currentCase.currentCity, flyingDestination)} hours
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 animate-[pulse_1s_infinite] w-full" />
        </div>

        <p className="text-xs font-mono text-slate-500 italic">
          Cruising at 34,000 feet... G.L.O.B.E. ground agents awaiting arrival...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Flight Terminal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <Plane className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-terminal text-white">
              International Flight Departures
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Terminal: {currentCase.currentCity.name} Intercontinental Hub • Select next destination
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-amber-400/90 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Cross-check witness clues before booking!</span>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-3 text-xs font-mono text-amber-200/90">
        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Detective Advisory:</strong> Flight transit will consume between 3 to 10 hours of mission time depending on distance. If you fly to a decoy destination with no suspect trail, you will lose valuable time backtracking!
        </p>
      </div>

      {/* Flight Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {travelOptions.map((dest) => {
          const distKm = calculateDistanceKm(
            currentCase.currentCity.lat,
            currentCase.currentCity.lng,
            dest.lat,
            dest.lng
          );
          const flightHours = calculateFlightHours(currentCase.currentCity, dest);
          const isSelected = selectedCity?.id === dest.id;

          return (
            <div
              key={dest.id}
              onClick={() => {
                sounds.play('click');
                setSelectedCity(dest);
              }}
              className={`group cursor-pointer rounded-xl border p-5 transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              {/* Destination Ticket Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{dest.flag}</span>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      {dest.continent}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    <Clock className="w-3.5 h-3.5" />
                    <span>-{flightHours} Hours</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold font-terminal text-white group-hover:text-amber-400 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3">{dest.country}</p>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
                  {dest.shortDescription}
                </p>

                {/* Landmarks snippets */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {dest.landmarks.slice(0, 3).map((lm, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-400"
                    >
                      {lm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Flight Action */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] font-mono text-slate-400">
                  <span>Distance: </span>
                  <span className="text-slate-200 font-bold">{distKm.toLocaleString()} km</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.play('flight');
                    onSelectFlight(dest);
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
                >
                  <span>Book Flight</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
