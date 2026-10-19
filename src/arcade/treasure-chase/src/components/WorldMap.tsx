import React, { useState } from 'react';
import { CityDestination } from '../types/game';
import { calculateDistanceKm } from '../services/gameEngine';

interface WorldMapProps {
  currentCity: CityDestination;
  visitedCities: CityDestination[];
  travelOptions: CityDestination[];
  onSelectDestination?: (city: CityDestination) => void;
  isFlying?: boolean;
  flyingFrom?: CityDestination | null;
  flyingTo?: CityDestination | null;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  currentCity,
  visitedCities,
  travelOptions,
  onSelectDestination,
  isFlying = false,
  flyingFrom = null,
  flyingTo = null,
}) => {
  const [hoveredCity, setHoveredCity] = useState<CityDestination | null>(null);

  // Map dimensions
  const width = 1000;
  const height = 500;

  // Convert lat/lng to SVG x/y (Equirectangular)
  const coordsToXY = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
  };

  const currentCoords = coordsToXY(currentCity.lat, currentCity.lng);

  return (
    <div className="relative w-full bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden crt-screen">
      {/* Top Map HUD */}
      <div className="absolute top-2 left-3 z-20 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[11px] font-mono tracking-wider text-slate-300 uppercase">
          GLOBAL RECONNAISSANCE SATELLITE FEED • 1:50M
        </span>
        <span className="text-[11px] font-mono text-amber-400">
          [{currentCity.lat.toFixed(2)}°, {currentCity.lng.toFixed(2)}°]
        </span>
      </div>

      {hoveredCity && (
        <div className="absolute top-2 right-3 z-20 bg-slate-900/95 border border-amber-500/40 px-3 py-1.5 rounded-lg shadow-xl font-mono text-xs text-amber-300">
          <span className="mr-1.5">{hoveredCity.flag}</span>
          <span className="font-bold">{hoveredCity.name}</span>, {hoveredCity.country} ({calculateDistanceKm(currentCity.lat, currentCity.lng, hoveredCity.lat, hoveredCity.lng)} km)
        </div>
      )}

      {/* SVG Map Canvas */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-h-[380px] bg-slate-950"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(51, 65, 85, 0.2)" strokeWidth="0.8" />
          </pattern>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={width} height={height} fill="url(#oceanGlow)" />
        <rect width={width} height={height} fill="url(#grid)" />

        {/* Latitude Tropics & Equator */}
        <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1={height * 0.369} x2={width} y2={height * 0.369} stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1="0" y1={height * 0.631} x2={width} y2={height * 0.631} stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.8" strokeDasharray="2 2" />
        {/* Prime Meridian */}
        <line x1={width * 0.5} y1="0" x2={width * 0.5} y2={height} stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" strokeDasharray="4 4" />

        {/* Stylized continent landmass outlines */}
        <g fill="rgba(30, 41, 59, 0.7)" stroke="rgba(71, 85, 105, 0.4)" strokeWidth="1">
          {/* North America */}
          <path d="M 140 80 Q 200 60 280 80 Q 320 120 280 180 Q 230 220 200 240 Q 170 200 130 180 Q 110 130 140 80 Z" />
          {/* South America */}
          <path d="M 230 250 Q 300 270 330 330 Q 320 420 270 470 Q 240 440 230 360 Q 210 290 230 250 Z" />
          {/* Europe */}
          <path d="M 460 110 Q 540 90 580 130 Q 560 190 500 200 Q 450 170 460 110 Z" />
          {/* Africa */}
          <path d="M 470 200 Q 560 200 580 270 Q 570 380 520 430 Q 480 400 450 310 Q 440 240 470 200 Z" />
          {/* Asia */}
          <path d="M 580 80 Q 750 60 880 100 Q 890 200 820 270 Q 740 280 670 250 Q 610 220 580 130 Z" />
          {/* Australia */}
          <path d="M 780 340 Q 860 330 890 380 Q 870 440 800 440 Q 760 400 780 340 Z" />
        </g>

        {/* Visited Flight Trail Lines */}
        {visitedCities.length > 1 &&
          visitedCities.slice(1).map((city, idx) => {
            const prev = visitedCities[idx];
            const p1 = coordsToXY(prev.lat, prev.lng);
            const p2 = coordsToXY(city.lat, city.lng);
            const midX = (p1.x + p2.x) / 2;
            const midY = Math.min(p1.y, p2.y) - 30; // arch curvature

            return (
              <g key={`trail-${prev.id}-${city.id}`}>
                <path
                  d={`M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  opacity="0.8"
                />
              </g>
            );
          })}

        {/* Travel Options Flight Projection Lines */}
        {travelOptions.map((opt) => {
          const optCoords = coordsToXY(opt.lat, opt.lng);
          const midX = (currentCoords.x + optCoords.x) / 2;
          const midY = Math.min(currentCoords.y, optCoords.y) - 25;

          return (
            <g key={`flight-line-${opt.id}`}>
              <path
                d={`M ${currentCoords.x} ${currentCoords.y} Q ${midX} ${midY} ${optCoords.x} ${optCoords.y}`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="5 4"
                opacity="0.5"
              />
            </g>
          );
        })}

        {/* Travel Options Destinations Pins */}
        {travelOptions.map((opt) => {
          const pt = coordsToXY(opt.lat, opt.lng);
          return (
            <g
              key={`dest-marker-${opt.id}`}
              className="cursor-pointer transition-transform hover:scale-125"
              onClick={() => onSelectDestination && onSelectDestination(opt)}
              onMouseEnter={() => setHoveredCity(opt)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              <circle cx={pt.x} cy={pt.y} r="7" fill="#f59e0b" opacity="0.2" className="animate-ping" />
              <circle cx={pt.x} cy={pt.y} r="5" fill="#f59e0b" stroke="#020617" strokeWidth="1.5" />
              <text
                x={pt.x}
                y={pt.y - 10}
                textAnchor="middle"
                fill="#fde68a"
                fontSize="10"
                fontFamily="var(--font-terminal)"
                fontWeight="bold"
                className="select-none pointer-events-none drop-shadow-md"
              >
                {opt.name}
              </text>
            </g>
          );
        })}

        {/* Current City Radar Blip */}
        <g>
          <circle
            cx={currentCoords.x}
            cy={currentCoords.y}
            r="16"
            fill="#38bdf8"
            opacity="0.25"
            className="animate-ping"
          />
          <circle
            cx={currentCoords.x}
            cy={currentCoords.y}
            r="9"
            fill="#0284c7"
            stroke="#e0f2fe"
            strokeWidth="2"
            filter="url(#glow)"
          />
          <circle cx={currentCoords.x} cy={currentCoords.y} r="4" fill="#ffffff" />
          <text
            x={currentCoords.x}
            y={currentCoords.y + 20}
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="12"
            fontFamily="var(--font-terminal)"
            fontWeight="bold"
            className="select-none font-bold drop-shadow-lg crt-glow"
          >
            ★ {currentCity.name.toUpperCase()}
          </text>
        </g>

        {/* Flying In-Transit Animation */}
        {isFlying && flyingFrom && flyingTo && (
          <g>
            <circle cx={coordsToXY(flyingTo.lat, flyingTo.lng).x} cy={coordsToXY(flyingTo.lat, flyingTo.lng).y} r="14" fill="#ef4444" opacity="0.4" className="animate-ping" />
          </g>
        )}
      </svg>

      {/* Map Legend Footer */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
            Current Location
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            Flight Routes Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            Tracked Trail
          </span>
        </div>
        <div className="text-slate-500 hidden sm:block">
          Click any destination marker or select from Travel Departures
        </div>
      </div>
    </div>
  );
};
