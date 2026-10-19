import React, { useState, useEffect } from 'react';
import { Plane, Compass, Clock, MapPin, Gauge, ShieldCheck, ArrowRight, FastForward } from 'lucide-react';
import { CityDestination, GameCase } from '../types/game';
import { calculateDistanceKm, calculateFlightHours, formatGameTime } from '../services/gameEngine';
import { sounds } from '../services/soundEffects';
import travelTransitHeroImg from '../assets/images/travel_transit_hero_1792239910431.jpg';

interface TravelCinematicModalProps {
  currentCase: GameCase;
  originCity: CityDestination;
  destinationCity: CityDestination;
  hoursSpent: number;
  isOpen: boolean;
  onComplete: () => void;
}

export const TravelCinematicModal: React.FC<TravelCinematicModalProps> = ({
  currentCase,
  originCity,
  destinationCity,
  hoursSpent,
  isOpen,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<'boarding' | 'airborne' | 'arrival'>('boarding');
  const [animatedHour, setAnimatedHour] = useState<number>(0);
  const [stampLanded, setStampLanded] = useState<boolean>(false);

  const totalDistance = calculateDistanceKm(originCity.lat, originCity.lng, destinationCity.lat, destinationCity.lng);
  const flightNumber = `GL-${((originCity.lat + destinationCity.lng) * 17).toFixed(0).replace('-', '').slice(0, 3) || '402'}`;

  // Time calculations during transit
  const startRemaining = currentCase.hoursRemaining;
  const endRemaining = Math.max(0, currentCase.hoursRemaining - hoursSpent);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('boarding');
      setAnimatedHour(0);
      setStampLanded(false);
      return;
    }

    // Step 1: Boarding (800ms)
    setCurrentStep('boarding');
    sounds.play('beep');

    const t1 = setTimeout(() => {
      // Step 2: Airborne transit (2000ms)
      setCurrentStep('airborne');
      sounds.play('flight');

      // Hour-by-hour countdown tick
      let tickCount = 0;
      const hourInterval = setInterval(() => {
        tickCount += 1;
        setAnimatedHour(tickCount);
        sounds.play('typewriter');
        if (tickCount >= hoursSpent) {
          clearInterval(hourInterval);
        }
      }, 250);

      const t2 = setTimeout(() => {
        // Step 3: Arrival & Customs Stamp (1200ms)
        setCurrentStep('arrival');
        sounds.play('stamp');
        setStampLanded(true);

        const t3 = setTimeout(() => {
          onComplete();
        }, 1600);

        return () => clearTimeout(t3);
      }, Math.max(1800, hoursSpent * 260));

      return () => {
        clearTimeout(t2);
        clearInterval(hourInterval);
      };
    }, 900);

    return () => clearTimeout(t1);
  }, [isOpen, originCity.id, destinationCity.id, hoursSpent]);

  if (!isOpen) return null;

  // Calculate simulated running time string
  const currentRunningRemaining = Math.max(endRemaining, startRemaining - animatedHour);
  const runningTimeInfo = formatGameTime(1, currentRunningRemaining, currentCase.totalTimeAllowed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden crt-screen relative flex flex-col">
        {/* Skip Button */}
        <button
          onClick={() => {
            sounds.play('click');
            onComplete();
          }}
          className="absolute top-4 right-4 z-30 px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-all backdrop-blur-sm"
          title="Skip cinematic transit"
        >
          <span>Skip</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>

        {/* Hero Image Header */}
        <div className="relative h-48 sm:h-56 overflow-hidden border-b border-amber-500/30">
          <img
            src={travelTransitHeroImg}
            alt="International Detective Flight in Transit"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Flight Badge on Image */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-amber-500 text-slate-950 font-bold">
                FLIGHT {flightNumber}
              </span>
              <span className="text-xs font-mono text-amber-300">INTERCONTINENTAL TRANSIT</span>
            </div>
            <div className="text-xs font-mono text-slate-300">
              SPEED: <span className="text-emerald-400 font-bold">870 KM/H</span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Boarding Pass Itinerary Route */}
          <div className="bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-800 flex items-center justify-between gap-4 relative overflow-hidden">
            {/* Origin City */}
            <div className="text-left flex-1">
              <div className="text-2xl mb-1">{originCity.flag}</div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">DEPARTURE</span>
              <h3 className="text-lg sm:text-xl font-bold font-terminal text-white">
                {originCity.name}
              </h3>
              <p className="text-xs font-mono text-slate-400">{originCity.country}</p>
            </div>

            {/* Flight Path Graphic */}
            <div className="flex flex-col items-center justify-center px-2 flex-1">
              <span className="text-[10px] font-mono text-amber-400 font-bold mb-1">
                {totalDistance.toLocaleString()} KM
              </span>

              <div className="w-full relative flex items-center justify-center my-1">
                <div className="w-full h-0.5 bg-slate-800 border-t border-dashed border-amber-500/50" />
                <div
                  className={`absolute p-1.5 rounded-full bg-amber-500 text-slate-950 shadow-md shadow-amber-500/40 transition-transform duration-700 ${
                    currentStep === 'airborne' ? 'translate-x-4 animate-pulse' : currentStep === 'arrival' ? 'translate-x-12' : '-translate-x-12'
                  }`}
                >
                  <Plane className="w-4 h-4 rotate-90" />
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-400">
                {hoursSpent} Hours Transit
              </span>
            </div>

            {/* Destination City */}
            <div className="text-right flex-1">
              <div className="text-2xl mb-1">{destinationCity.flag}</div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">ARRIVAL</span>
              <h3 className="text-lg sm:text-xl font-bold font-terminal text-emerald-400">
                {destinationCity.name}
              </h3>
              <p className="text-xs font-mono text-slate-400">{destinationCity.country}</p>
            </div>
          </div>

          {/* Animated Mission Clock / Timer Widget */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                <Clock className="w-6 h-6 animate-[spin_4s_linear_infinite]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  MISSION CLOCK IN TRANSIT
                </span>
                <div className="text-lg font-bold font-mono text-amber-300">
                  {runningTimeInfo.text}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                TIME REMAINING
              </div>
              <div className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
                <span>{currentRunningRemaining} Hours</span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  -{animatedHour}h
                </span>
              </div>
            </div>
          </div>

          {/* Customs Entry Passport Stamp (Slams down on arrival) */}
          {currentStep === 'arrival' && stampLanded && (
            <div className="flex items-center justify-center pt-1 animate-in zoom-in-75 duration-300">
              <div className="border-4 border-emerald-400/80 rounded-xl p-3 px-6 text-center transform -rotate-3 bg-emerald-950/40 backdrop-blur-md shadow-2xl shadow-emerald-500/20">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold font-mono text-xs tracking-widest uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CUSTOMS ENTRY PERMIT</span>
                </div>
                <div className="text-lg font-extrabold font-terminal text-emerald-300 tracking-wider">
                  IMMIGRATION • {destinationCity.name.toUpperCase()}
                </div>
                <div className="text-[10px] font-mono text-emerald-400/80">
                  G.L.O.B.E. SPECIAL DETECTIVE DISPATCH AUTHORIZED
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Status: {currentStep === 'boarding' ? 'Boarding Gate...' : currentStep === 'airborne' ? 'Cruising to Destination...' : 'Touchdown & Customs Clear!'}</span>
              <span>{Math.round((animatedHour / hoursSpent) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 transition-all duration-300"
                style={{ width: `${Math.max(10, Math.min(100, (animatedHour / hoursSpent) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 px-6 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Flight Duration: {hoursSpent} Hours</span>
          <span className="text-amber-400/90 flex items-center gap-1">
            <span>Entering local airspace...</span>
          </span>
        </div>
      </div>
    </div>
  );
};
