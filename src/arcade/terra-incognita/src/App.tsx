/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  CrownNation, 
  ExpeditionShip, 
  RegionPOI, 
  Specimen, 
  IndigenousCulture, 
  RivalNationState, 
  RandomEncounter, 
  MissingMystery, 
  VesselClass, 
  Officer, 
  ShipCargo,
  DailyMission,
  CaptainLogEntry
} from './types';
import { NATIONS, VESSEL_TYPES } from './data/nations';
import { WORLD_REGIONS, INDIGENOUS_CULTURES } from './data/regions';
import { SPECIMENS_DATA } from './data/specimens';
import { RANDOM_ENCOUNTERS, MYSTERY_INVESTIGATIONS } from './data/encounters';
import { calculateDistanceNauticalMiles } from './data/worldMap';
import { calculateMaritimePath } from './data/navigationRoutes';
import { getWeatherAtCoords } from './data/weather';
import { INITIAL_MISSIONS } from './data/missions';
import { SoundEngine } from './utils/audio';
import { CHARTERS, CharterLength, START, START_DAY, dayIndex, goalsMet, newCharterId, saveGame, loadGame, clearSave } from './utils/charter';
import { reportResult, closeGame, EMBEDDED, CharterResult } from './utils/embed';
import { CharterBar, CharterEndModal } from './components/CharterPanels';

import { TopBar } from './components/TopBar';
import { NauticalMap } from './components/NauticalMap';
import { FieldCatalog } from './components/FieldCatalog';
import { FleetManager } from './components/FleetManager';
import { DiplomacyModal } from './components/DiplomacyModal';
import { CrownRivalryModal } from './components/CrownRivalryModal';
import { CaptainLogModal } from './components/CaptainLogModal';
import { EncounterModal } from './components/EncounterModal';
import { SearchInvestigationModal } from './components/SearchInvestigationModal';
import { RegionInspector } from './components/RegionInspector';
import { NationSelectModal } from './components/NationSelectModal';
import { CelestialNavigationModal } from './components/CelestialNavigationModal';

/* What a saved charter keeps (docs/TERRA-INCOGNITA.md). Regions, cultures and specimens keep only what changes, so
   text fixes in src/data reach saved games too. */
interface SavedGame {
  v: 1;
  charter: { len: CharterLength; id: string };
  nation: CrownNation;
  year: number; month: number; day: number; hour: number;
  ducats: number; timber: number; prestige: number;
  ships: ExpeditionShip[];
  regions: Record<string, { discovered: boolean; hasTreatyPost?: boolean }>;
  cultures: Record<string, { harmony: number; relationship: IndigenousCulture['relationship']; hasGuideHired?: boolean; peaceCharterSigned?: boolean }>;
  specimens: Record<string, { discovered: boolean; dateDiscovered?: string }>;
  missions: DailyMission[];
  logs: CaptainLogEntry[];
  rivals: Record<CrownNation, RivalNationState>;
  mystery?: [number, number];
}
/* Where each place-bound encounter can happen (lat, lng). Encounters not listed can happen anywhere at sea. */
const ENCOUNTER_WHERE: Record<string, (lat: number, lng: number) => boolean> = {
  enc_doldrums: (lat, lng) => lat > -8 && lat < 12 && lng > -45 && lng < 0,        // the equatorial Atlantic
  enc_mermaids: (lat, lng) => lat > 8 && lat < 30 && lng > -98 && lng < -58,       // Caribbean and Gulf shallows
  enc_croatoan_discovery: (lat, lng) => lat > 33 && lat < 39 && lng > -80 && lng < -72, // off the Outer Banks
  enc_quinine_healer: (lat) => Math.abs(lat) < 25,                                  // fevers of the tropics
};
const INITIAL_REGIONS_KNOWN = WORLD_REGIONS.filter(r => r.discovered).length;
const INITIAL_SPECIMENS_KNOWN = SPECIMENS_DATA.filter(s => s.discovered).length;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function App() {
  // Game setup
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [charter, setCharter] = useState<{ len: CharterLength; id: string } | null>(null);
  const [charterEnd, setCharterEnd] = useState<CharterResult | null>(null);
  const [savedGame] = useState<SavedGame | null>(() => { const g = loadGame<SavedGame>(); return g && g.v === 1 && CHARTERS[g.charter?.len] ? g : null; });
  const [playerNation, setPlayerNation] = useState<CrownNation>('ENGLAND');
  const [activeView, setActiveView] = useState<'MAP' | 'CATALOG' | 'FLEET' | 'DIPLOMACY' | 'RIVALRY' | 'LOGS'>('MAP');

  // Simulation Time, Calendar & Time of Day
  const [gameYear, setGameYear] = useState<number>(1604);
  const [monthIndex, setMonthIndex] = useState<number>(3); // April
  const [dayOfMonth, setDayOfMonth] = useState<number>(12);
  const [hourOfDay, setHourOfDay] = useState<number>(21); // Start at 21:00 (Night) so player can immediately observe stars
  const isNight = hourOfDay >= 20 || hourOfDay < 6;
  const [celestialShipId, setCelestialShipId] = useState<string | null>(null);
  const [gameSpeed, setGameSpeed] = useState<number>(1); // 0 = paused, 1, 3, 8
  const [isMuted, setIsMuted] = useState<boolean>(() => SoundEngine.getMuted());

  // Economy & Resources
  const [ducats, setDucats] = useState<number>(1400);
  const [timber, setTimber] = useState<number>(120);
  const [prestige, setPrestige] = useState<number>(200);

  // Entities State
  const [ships, setShips] = useState<ExpeditionShip[]>([]);
  const [regions, setRegions] = useState<RegionPOI[]>(WORLD_REGIONS);
  const [cultures, setCultures] = useState<Record<string, IndigenousCulture>>(INDIGENOUS_CULTURES);
  const [specimens, setSpecimens] = useState<Specimen[]>(SPECIMENS_DATA);

  // Selection & UI modals
  const [selectedShipId, setSelectedShipId] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<RegionPOI | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);
  const showNotice = (text: string) => { setNotice(text); window.clearTimeout(noticeTimer.current); noticeTimer.current = window.setTimeout(() => setNotice(null), 4500); };
  const [diplomacyCultureId, setDiplomacyCultureId] = useState<string | undefined>(undefined);
  const [activeEncounter, setActiveEncounter] = useState<RandomEncounter | null>(null);
  const [activeMystery, setActiveMystery] = useState<MissingMystery | null>(null);
  const [activeMysteryCoords, setActiveMysteryCoords] = useState<[number, number] | undefined>(undefined);

  // Daily Missions & Captain's Voyage Logs
  const [missions, setMissions] = useState<DailyMission[]>(INITIAL_MISSIONS);
  const [captainLogs, setCaptainLogs] = useState<CaptainLogEntry[]>([
    {
      id: 'log-init',
      dateStr: 'April 12, 1604',
      locationName: 'Home Port Waters',
      weatherName: 'Moderate Ocean Breeze',
      title: 'Royal Charter Proclaimed',
      message: 'The Sovereign Charter is sealed. Fleets are provisioned and set sail under the Crown flag to chart the authentic earth without violence.',
      severity: 'INFO'
    }
  ]);

  const addCaptainLog = (
    shipName: string | undefined,
    locationName: string,
    weatherName: string,
    title: string,
    message: string,
    severity: 'INFO' | 'WONDER' | 'PERIL' | 'DIPLOMACY'
  ) => {
    const dateStr = `${MONTH_NAMES[monthIndex]} ${dayOfMonth}, ${gameYear}`;
    const newEntry: CaptainLogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      dateStr,
      shipName,
      locationName,
      weatherName,
      title,
      message,
      severity
    };
    setCaptainLogs(prev => [newEntry, ...prev.slice(0, 50)]);
  };

  // Rival Nations simulation
  const [rivalStates, setRivalStates] = useState<Record<CrownNation, RivalNationState>>({
    ENGLAND: {
      nation: 'ENGLAND',
      name: 'Kingdom of England',
      prestige: 200,
      discoveredRegionsCount: 4,
      botanicalCount: 1,
      activeFleets: 2,
      lastAnnouncement: 'Richard Hakluyt urges new voyages to Virginia.'
    },
    FRANCE: {
      nation: 'FRANCE',
      name: 'Kingdom of France',
      prestige: 220,
      discoveredRegionsCount: 4,
      botanicalCount: 2,
      activeFleets: 2,
      lastAnnouncement: 'Champlain and Sieur de Mons winter on Île Sainte-Croix in Acadia.'
    },
    SPAIN: {
      nation: 'SPAIN',
      name: 'Spanish Monarchy',
      prestige: 240,
      discoveredRegionsCount: 5,
      botanicalCount: 2,
      activeFleets: 3,
      lastAnnouncement: 'Casa de Contratación prepares a fleet of heavy galleons in Seville.'
    },
    PORTUGAL: {
      nation: 'PORTUGAL',
      name: 'Kingdom of Portugal',
      prestige: 260,
      discoveredRegionsCount: 6,
      botanicalCount: 3,
      activeFleets: 3,
      lastAnnouncement: 'The India carracks (Carreira da Índia) sail from Lisbon for Goa.'
    }
  });

  // Calculate current season
  const currentSeason: 'Spring' | 'Summer' | 'Autumn' | 'Winter' = 
    monthIndex >= 2 && monthIndex <= 4 ? 'Spring' :
    monthIndex >= 5 && monthIndex <= 7 ? 'Summer' :
    monthIndex >= 8 && monthIndex <= 10 ? 'Autumn' : 'Winter';

  // Game Start Handler
  const handleStartGame = (chosenNation: CrownNation, length: CharterLength) => {
    clearSave();
    setCharter({ len: length, id: newCharterId() });
    setPlayerNation(chosenNation);
    const nationConfig = NATIONS[chosenNation];

    setDucats(nationConfig.startingDucats);
    setTimber(nationConfig.startingTimber);
    setPrestige(220);

    // Initial Starter Ships
    const starterFleet: ExpeditionShip[] = [
      {
        id: 'ship-1',
        name: chosenNation === 'ENGLAND' ? 'HMS Discovery' :
              chosenNation === 'FRANCE' ? 'La Dauphine' :
              chosenNation === 'SPAIN' ? 'Santa Esperanza' : 'São Gabriel',
        vesselClass: 'CARAVEL',
        coords: [nationConfig.capitalCoords[0] + 0.5, nationConfig.capitalCoords[1] - 1.5],
        heading: 240,
        status: 'ANCHORED',
        health: 100,
        crewMorale: 90,
        crewCount: 28,
        cargo: {
          provisions: 120,
          timber: 25,
          spices: 0,
          rareFlora: 0,
          preciousMetals: 0,
          indigenousGifts: 20
        },
        officers: [],
        speedKnots: 9.8 * nationConfig.speedBonus,
        daysAtSea: 0,
        lastKnownCoords: nationConfig.capitalCoords,
        isFlagship: true
      },
      {
        id: 'ship-2',
        name: chosenNation === 'ENGLAND' ? 'HMS Endeavour' :
              chosenNation === 'FRANCE' ? 'L\'Hirondelle' :
              chosenNation === 'SPAIN' ? 'San Cristóbal' : 'Boa Esperança',
        vesselClass: 'SLOOP',
        coords: [nationConfig.capitalCoords[0] + 0.2, nationConfig.capitalCoords[1] - 0.8],
        heading: 220,
        status: 'ANCHORED',
        health: 100,
        crewMorale: 85,
        crewCount: 16,
        cargo: {
          provisions: 80,
          timber: 15,
          spices: 0,
          rareFlora: 0,
          preciousMetals: 0,
          indigenousGifts: 15
        },
        officers: [],
        speedKnots: 8.5 * nationConfig.speedBonus,
        daysAtSea: 0,
        lastKnownCoords: nationConfig.capitalCoords
      }
    ];

    setShips(starterFleet);
    setSelectedShipId(starterFleet[0].id);

    // Set initial mystery event coordinates (The Roanoke / CROATOAN mystery)
    setActiveMysteryCoords([35.9, -75.7]);   // Roanoke Island

    setHasStarted(true);
  };

  // Continue a saved charter
  const handleContinueGame = () => {
    const g = savedGame;
    if (!g) return;
    setCharter(g.charter);
    setPlayerNation(g.nation);
    setGameYear(g.year); setMonthIndex(g.month); setDayOfMonth(g.day); setHourOfDay(g.hour);
    setDucats(g.ducats); setTimber(g.timber); setPrestige(g.prestige);
    setShips(g.ships);
    setSelectedShipId(g.ships[0]?.id || '');
    setRegions(WORLD_REGIONS.map(r => g.regions[r.id] ? { ...r, ...g.regions[r.id] } : r));
    setCultures(Object.fromEntries(Object.entries(INDIGENOUS_CULTURES).map(([id, c]) => [id, g.cultures[id] ? { ...c, ...g.cultures[id] } : c])));
    setSpecimens(SPECIMENS_DATA.map(sp => g.specimens[sp.id] ? { ...sp, ...g.specimens[sp.id] } : sp));
    setMissions(INITIAL_MISSIONS.map(m => ({ ...m, ...(g.missions.find(x => x.id === m.id) || {}) })));
    setCaptainLogs(g.logs);
    setRivalStates(g.rivals);
    setActiveMysteryCoords(g.mystery);
    setGameSpeed(0);   // paused, so she can look around first
    setHasStarted(true);
  };

  // Charter progress: new lands charted, plants and animals surveyed, treaties signed
  const charterCfg = charter ? CHARTERS[charter.len] : null;
  const progress = {
    regions: regions.filter(r => r.discovered).length - INITIAL_REGIONS_KNOWN,
    specimens: specimens.filter(s => s.discovered).length - INITIAL_SPECIMENS_KNOWN,
    treaties: Object.values(cultures).filter(c => c.peaceCharterSigned).length,
  };
  const today = dayIndex(gameYear, monthIndex, dayOfMonth);
  const endDay = charterCfg ? START_DAY + charterCfg.months * 30 : Infinity;
  const endDateStr = charterCfg ? (() => { const m = START.month + charterCfg.months; return `${MONTH_NAMES[m % 12]} ${START.day}, ${START.year + Math.floor(m / 12)}`; })() : '';

  // Autosave once a game day and after every action, until the charter ends
  useEffect(() => {
    if (!hasStarted || !charter || charterEnd) return;
    saveGame({
      v: 1, charter, nation: playerNation, year: gameYear, month: monthIndex, day: dayOfMonth, hour: hourOfDay,
      ducats, timber, prestige, ships,
      regions: Object.fromEntries(regions.map(r => [r.id, { discovered: r.discovered, hasTreatyPost: r.hasTreatyPost }])),
      cultures: Object.fromEntries(Object.values(cultures).map(c => [c.id, { harmony: c.harmony, relationship: c.relationship, hasGuideHired: c.hasGuideHired, peaceCharterSigned: c.peaceCharterSigned }])),
      specimens: Object.fromEntries(specimens.map(sp => [sp.id, { discovered: sp.discovered, dateDiscovered: sp.dateDiscovered }])),
      missions, logs: captainLogs.slice(0, 30), rivals: rivalStates, mystery: activeMysteryCoords,
    } satisfies SavedGame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, charter, charterEnd, dayOfMonth, ducats, timber, prestige, regions, cultures, specimens, missions, activeMysteryCoords]);

  // The charter ends when every goal is met, or on its last day
  useEffect(() => {
    if (!hasStarted || !charter || !charterCfg || charterEnd) return;
    const stars = goalsMet(charterCfg, progress);
    if (stars < 3 && today < endDay) return;
    const result: CharterResult = {
      charterId: charter.id, length: charter.len, stars,
      regions: Math.max(0, progress.regions), specimens: Math.max(0, progress.specimens), treaties: progress.treaties,
      prestige, months: Math.max(1, Math.round((today - START_DAY) / 30)),
    };
    setGameSpeed(0);
    setCharterEnd(result);
    clearSave();
    reportResult(result);
    if (stars) SoundEngine.playFanfare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, charter, charterEnd, today, progress.regions, progress.specimens, progress.treaties]);

  const handleNewCharter = () => {
    // a fresh page is the simplest full reset of every piece of state; the save was already cleared
    window.location.reload();
  };

  // Main Simulation Loop (Ticks time, updates voyages, checks encounters & missing ships)
  useEffect(() => {
    if (!hasStarted || gameSpeed === 0 || charterEnd || activeEncounter || activeMystery) return;

    // Simulation tick speed based on gameSpeed
    const tickIntervalMs = Math.max(80, 700 / gameSpeed);

    const timer = setInterval(() => {
      // 1. Advance Time of Day & Calendar (2-hour step per tick)
      setHourOfDay(prevHour => {
        const nextHour = (prevHour + 2) % 24;
        if (nextHour < prevHour) {
          // Midnight turnover -> Advance Calendar Day
          setDayOfMonth(prevDay => {
            if (prevDay >= 30) {
              setMonthIndex(prevMonth => {
                if (prevMonth >= 11) {
                  setGameYear(y => y + 1);
                  return 0;
                }
                return prevMonth + 1;
              });
              return 1;
            }
            return prevDay + 1;
          });
        }
        return nextHour;
      });

      // 2. Update Ship Positions along Sea Lanes with Dynamic Weather Modifiers & Celestial Navigation Buffs
      setShips(prevShips => {
        return prevShips.map(ship => {
          if (ship.status !== 'SAILING' || !ship.destinationCoords) {
            return ship;
          }

          const [currLat, currLng] = ship.coords;
          const [finalDestLat, finalDestLng] = ship.destinationCoords;

          // Target either the next maritime waypoint or the final destination
          const waypoints = ship.waypoints || [];
          const wpIdx = ship.currentWaypointIndex || 0;
          const targetPoint = (wpIdx < waypoints.length) ? waypoints[wpIdx] : [finalDestLat, finalDestLng];

          const distToTarget = calculateDistanceNauticalMiles(currLat, currLng, targetPoint[0], targetPoint[1]);
          const distToFinal = calculateDistanceNauticalMiles(currLat, currLng, finalDestLat, finalDestLng);

          // Evaluate local weather & currents at ship coordinates + Celestial Navigation 15% speed buff
          const localWeather = getWeatherAtCoords(currLat, currLng, currentSeason);
          const celestialMult = (ship.celestialBonusActive && (ship.celestialBonusRemainingDays ?? 0) > 0) ? 1.15 : 1.0;
          const effectiveSpeed = ship.speedKnots * localWeather.speedModifier * celestialMult;

          // If reached intermediate waypoint (within 35 miles), advance to next sea node
          if (distToTarget <= 35 && wpIdx + 1 < waypoints.length) {
            return {
              ...ship,
              coords: [targetPoint[0], targetPoint[1]],
              currentWaypointIndex: wpIdx + 1,
              currentWeatherName: localWeather.name,
              currentWeatherSpeedMod: localWeather.speedModifier,
              daysAtSea: ship.daysAtSea + 1 / 12
            };
          }

          // If reached final destination (within 40 miles)
          if (distToFinal <= 40) {
            SoundEngine.playShipBell();

            // Check if arrived at an undiscovered region
            const targetRegion = regions.find(r => 
              Math.hypot(r.coords[0] - finalDestLat, r.coords[1] - finalDestLng) < 1.5
            );

            if (targetRegion && !targetRegion.discovered) {
              setRegions(rList => rList.map(r => r.id === targetRegion.id ? { ...r, discovered: true } : r));
              setPrestige(p => p + 35);
              SoundEngine.playFanfare();

              addCaptainLog(
                ship.name,
                targetRegion.name,
                localWeather.name,
                'Landfall at Uncharted Shores!',
                `The lookout raised the cry of land! Dropped anchor off ${targetRegion.name} after ${Math.max(1, Math.round(ship.daysAtSea))} days under sail.`,
                'WONDER'
              );
            } else {
              addCaptainLog(
                ship.name,
                ship.destinationName || 'Coastal Haven',
                localWeather.name,
                'Anchored Safely in Port',
                `Vessel completed voyage leg. Furls taken in, sails dried, crew granted liberty to gather fresh water.`,
                'INFO'
              );
            }

            return {
              ...ship,
              coords: [finalDestLat, finalDestLng],
              status: 'ANCHORED',
              destinationCoords: undefined,
              destinationName: undefined,
              waypoints: undefined,
              currentWaypointIndex: undefined,
              currentWeatherName: localWeather.name,
              currentWeatherSpeedMod: 1.0,
              daysAtSea: ship.daysAtSea + 1 / 12,
              celestialBonusActive: false,
              celestialBonusRemainingDays: 0
            };
          }

          // Step along sea lane towards targetPoint (never crossing land)
          const stepRatio = Math.min(0.05, (effectiveSpeed * 0.007) * gameSpeed);
          const nextLat = currLat + (targetPoint[0] - currLat) * stepRatio;
          const nextLng = currLng + (targetPoint[1] - currLng) * stepRatio;

          // Consume provisions slowly
          const provisionsLeft = Math.max(0, ship.cargo.provisions - 0.15);
          let newMorale = ship.crewMorale;

          // Weather impact on crew & hull
          let newHealth = ship.health;
          if (localWeather.type === 'GALE_STORM' && Math.random() < 0.02) {
            newHealth = Math.max(30, newHealth - 1);
          }

          // Scurvy / Hunger attrition if provisions run dry
          if (provisionsLeft === 0) {
            newMorale = Math.max(10, newMorale - 0.5);
          }

          // Decrement celestial speed bonus days gradually
          let remainingBonusDays = ship.celestialBonusRemainingDays ?? 0;
          let bonusActive = ship.celestialBonusActive ?? false;
          if (bonusActive && remainingBonusDays > 0) {
            remainingBonusDays = Math.max(0, remainingBonusDays - 0.08);
            if (remainingBonusDays <= 0) {
              bonusActive = false;
            }
          }

          return {
            ...ship,
            coords: [nextLat, nextLng],
            cargo: { ...ship.cargo, provisions: Math.round(provisionsLeft * 10) / 10 },
            health: newHealth,
            crewMorale: Math.round(newMorale),
            daysAtSea: ship.daysAtSea + 1 / 12,
            lastKnownCoords: [nextLat, nextLng],
            currentWeatherName: localWeather.name,
            currentWeatherSpeedMod: localWeather.speedModifier,
            celestialBonusActive: bonusActive,
            celestialBonusRemainingDays: Math.round(remainingBonusDays * 10) / 10
          };
        });
      });

      // 3. Random Encounter Chance influenced by local Weather Danger
      const sailingShips = ships.filter(s => s.status === 'SAILING');
      if (sailingShips.length > 0 && !activeEncounter && !activeMystery) {
        const leadShip = sailingShips[0];
        const localWeather = getWeatherAtCoords(leadShip.coords[0], leadShip.coords[1], currentSeason);
        
        // Higher probability during storms and doldrums
        // per 2-hour tick: about one encounter every 2–3 weeks at sea (it used to be every few days)
        const encounterChance = localWeather.dangerLevel === 'PERILOUS' ? 0.007 :
                                localWeather.dangerLevel === 'HAZARDOUS' ? 0.005 : 0.003;

        if (Math.random() < encounterChance) {
          // only encounters that fit where the ship is (manatees in the Caribbean, Roanoke off the Outer Banks)
          const [lat, lng] = leadShip.coords;
          const fits = RANDOM_ENCOUNTERS.filter(enc => (ENCOUNTER_WHERE[enc.id] || (() => true))(lat, lng));
          const randomEnc = fits[Math.floor(Math.random() * fits.length)];
          setActiveEncounter(randomEnc);

          addCaptainLog(
            leadShip.name,
            leadShip.destinationName || 'Open Ocean',
            localWeather.name,
            `Encounter: ${randomEnc.title}`,
            randomEnc.description,
            localWeather.dangerLevel === 'PERILOUS' ? 'PERIL' : 'WONDER'
          );
        }
      }

      // 4. Overdue / No Word Received Mechanism (The CROATOAN mystery spawn)
      // a voyage past 100 days has a small daily chance of going silent (about 1 in 50 a day)
      const overdueCandidate = ships.find(s => s.status === 'SAILING' && s.daysAtSea > 100);
      if (overdueCandidate && Math.random() < 0.02 / 12) {
        setShips(sList => sList.map(s => s.id === overdueCandidate.id ? { ...s, status: 'OVERDUE' } : s));
        setActiveMysteryCoords(overdueCandidate.lastKnownCoords);

        addCaptainLog(
          overdueCandidate.name,
          'Uncharted Coordinates',
          'Heavy Fog',
          'Vessel Reported Overdue (No Word Received)',
          `${overdueCandidate.name} has exceeded its voyage window by two moons without word. Last sighted at ${Math.abs(overdueCandidate.lastKnownCoords[0]).toFixed(1)}°${overdueCandidate.lastKnownCoords[0] >= 0 ? 'N' : 'S'}, ${Math.abs(overdueCandidate.lastKnownCoords[1]).toFixed(1)}°${overdueCandidate.lastKnownCoords[1] >= 0 ? 'E' : 'W'}. A relief expedition is required!`,
          'PERIL'
        );
      }

      // 5. Autonomous Rival Progress (Occurs periodically)
      if (Math.random() < 0.025) {
        const rivalKeys = (['FRANCE', 'SPAIN', 'PORTUGAL'] as CrownNation[]);
        const chosenRival = rivalKeys[Math.floor(Math.random() * rivalKeys.length)];

        setRivalStates(prev => {
          const curr = prev[chosenRival];
          const newPrestige = curr.prestige + Math.floor(Math.random() * 25 + 10);
          const newBot = curr.botanicalCount + (Math.random() > 0.6 ? 1 : 0);
          const newReg = curr.discoveredRegionsCount + (Math.random() > 0.7 ? 1 : 0);

          return {
            ...prev,
            [chosenRival]: {
              ...curr,
              prestige: newPrestige,
              botanicalCount: newBot,
              discoveredRegionsCount: newReg
            }
          };
        });
      }
    }, tickIntervalMs);

    return () => clearInterval(timer);
  }, [hasStarted, gameSpeed, ships, regions, activeEncounter, activeMystery, currentSeason, charterEnd]);

  // Order Ship Navigation along Maritime Sea Lanes
  const handleOrderShip = (shipId: string, targetCoords: [number, number], targetName: string) => {
    setShips(prevShips => prevShips.map(ship => {
      if (ship.id !== shipId) return ship;

      // Calculate realistic maritime sea path navigating through open oceans and straits
      const seaPath = calculateMaritimePath(ship.coords, targetCoords, false);   // no ship got through the Northwest Passage until 1906
      const localWeather = getWeatherAtCoords(ship.coords[0], ship.coords[1], currentSeason);

      addCaptainLog(
        ship.name,
        targetName,
        localWeather.name,
        'Departure Orders Weighed',
        `Master set sails for ${targetName}. Navigating ${seaPath.length - 1} charted sea lane legs avoiding land.`,
        'INFO'
      );

      return {
        ...ship,
        destinationCoords: targetCoords,
        destinationName: targetName,
        waypoints: seaPath,
        currentWaypointIndex: 1, // Aim for first maritime waypoint
        daysAtSea: 0,   // days on this voyage
        currentWeatherName: localWeather.name,
        status: 'SAILING'
      };
    }));
  };

  // Inland land survey in a region
  const handleSurveyRegion = (regionId: string) => {
    const reg = regions.find(r => r.id === regionId);
    if (!reg) return;

    // Discover the next undiscovered specimen in this region
    const undiscoveredSpecimen = specimens.find(s => reg.specimenIds.includes(s.id) && !s.discovered);

    if (undiscoveredSpecimen) {
      setSpecimens(sList => sList.map(s => s.id === undiscoveredSpecimen.id ? { ...s, discovered: true } : s));
      setPrestige(p => p + undiscoveredSpecimen.prestigeValue);
      SoundEngine.playQuillScratch();
      SoundEngine.playFanfare();

      addCaptainLog(
        undefined,
        reg.name,
        'Fair Weather',
        `Botanical Wonder Surveyed: ${undiscoveredSpecimen.name}`,
        `Survey team documented ${undiscoveredSpecimen.name} (modern scientific name: ${undiscoveredSpecimen.scientificName}) in the field ledger. Naturalist note: ${undiscoveredSpecimen.fieldNotes}`,
        'WONDER'
      );

      // Check mission progression for river surveys
      if (['great_lakes', 'mississippi_delta', 'pacific_northwest', 'upper_missouri'].includes(regionId)) {
        setMissions(mList => mList.map(m => {
          if (m.id === 'mis_river_passage') {
            const nextCount = Math.min(m.targetCount, m.currentCount + 1);
            return { ...m, currentCount: nextCount, completed: nextCount >= m.targetCount };
          }
          return m;
        }));
      }
    }
  };

  // Presenting a specimen at the Royal Court
  const handlePresentToAcademy = (specimenId: string) => {
    const sp = specimens.find(s => s.id === specimenId);
    if (!sp || sp.dateDiscovered) return;

    const dateStr = `${MONTH_NAMES[monthIndex]} ${gameYear}`;
    setSpecimens(sList => sList.map(s => s.id === specimenId ? { ...s, dateDiscovered: dateStr } : s));
    setPrestige(p => p + sp.prestigeValue * 2);
    setDucats(d => d + sp.crownGrantDucats);

    addCaptainLog(
      undefined,
      'Royal Court Physicians & Scholars',
      'Clear Skies',
      `Specimen Published: ${sp.name}`,
      `Presented illustrated drawings of ${sp.name} to royal scholars. Awarded ${sp.crownGrantDucats} Ducats and royal prestige.`,
      'INFO'
    );

    // Progress Academy Mission
    setMissions(mList => mList.map(m => {
      if (m.id === 'mis_academy_catalog') {
        const nextCount = Math.min(m.targetCount, m.currentCount + 1);
        return { ...m, currentCount: nextCount, completed: nextCount >= m.targetCount };
      }
      return m;
    }));
  };

  // Commission New Ship
  const handleCommissionShip = (vesselClass: VesselClass, name: string) => {
    const typeInfo = VESSEL_TYPES[vesselClass];
    const nationCfg = NATIONS[playerNation];

    setDucats(d => d - typeInfo.costDucats);
    setTimber(t => t - typeInfo.costTimber);

    const newShip: ExpeditionShip = {
      id: `ship-${Date.now()}`,
      name,
      vesselClass,
      coords: nationCfg.capitalCoords,
      heading: 230,
      status: 'ANCHORED',
      health: 100,
      crewMorale: 90,
      crewCount: typeInfo.crewCapacity,
      cargo: {
        provisions: 100,
        timber: 20,
        spices: 0,
        rareFlora: 0,
        preciousMetals: 0,
        indigenousGifts: 15
      },
      officers: [],
      speedKnots: typeInfo.speedKnots * nationCfg.speedBonus,
      daysAtSea: 0,
      lastKnownCoords: nationCfg.capitalCoords
    };

    setShips(prev => [...prev, newShip]);

    addCaptainLog(
      name,
      nationCfg.capital,
      'Fair Navigation Breeze',
      `New Vessel Commissioned: ${name}`,
      `Shipwright completed rigging of a ${typeInfo.name}. Ready for oceanic expedition charter.`,
      'INFO'
    );

    // Progress commission mission
    setMissions(mList => mList.map(m => {
      if (m.id === 'mis_commission_fleet') {
        return { ...m, currentCount: 1, completed: true };
      }
      return m;
    }));
  };

  // Hire Officer
  const handleHireOfficer = (shipId: string, officer: Officer) => {
    setDucats(d => d - officer.hiredCost);
    setShips(prev => prev.map(s => {
      if (s.id !== shipId) return s;
      return {
        ...s,
        officers: [...s.officers, officer]
      };
    }));
  };

  // Resupply Ship
  const handleResupplyShip = (shipId: string, cargoAdd: Partial<ShipCargo>, costDucats: number) => {
    setDucats(d => d - costDucats);
    setShips(prev => prev.map(s => {
      if (s.id !== shipId) return s;
      return {
        ...s,
        cargo: {
          ...s.cargo,
          provisions: s.cargo.provisions + (cargoAdd.provisions || 0),
          timber: s.cargo.timber + (cargoAdd.timber || 0)
        }
      };
    }));
  };

  // Dispatch Relief Search Expedition
  const handleLaunchSearch = (lostShipId: string) => {
    const targetShip = ships.find(s => s.id === lostShipId);
    if (!targetShip) return;

    setActiveMysteryCoords(targetShip.lastKnownCoords);
    setActiveView('MAP');
  };

  // Investigate Mystery marker on map
  const handleInvestigateMystery = (coords: [number, number]) => {
    // a search party has to be there: some ship within about 300 nautical miles of the marker
    const near = ships.some(s => s.status !== 'LOST' && s.status !== 'OVERDUE' && calculateDistanceNauticalMiles(s.coords[0], s.coords[1], coords[0], coords[1]) < 300);
    if (!near) {
      showNotice('Send a ship to the search marker first. When it is close by, tap the marker again to search.');
      return;
    }
    const match = [...MYSTERY_INVESTIGATIONS].sort((a, b) =>
      Math.hypot(a.lostCoords[0] - coords[0], a.lostCoords[1] - coords[1]) - Math.hypot(b.lostCoords[0] - coords[0], b.lostCoords[1] - coords[1]))[0];

    setActiveMystery(match);
  };

  // Conclude Mystery Investigation
  const handleConcludeMystery = (mysteryId: string, prestigeReward: number) => {
    const solved = MYSTERY_INVESTIGATIONS.find(m => m.id === mysteryId);
    setPrestige(p => p + prestigeReward);
    setDucats(d => d + 250);

    // Clear overdue statuses on ships near those coordinates
    setShips(prev => prev.map(s => {
      if (s.status === 'OVERDUE') {
        return {
          ...s,
          status: 'ANCHORED',
          health: 85,
          crewMorale: 95
        };
      }
      return s;
    }));

    addCaptainLog(
      undefined,
      solved?.locationDescription || 'Search Site',
      'Sea Mist',
      `Search Complete: ${solved?.clueTitle || 'The Lost Expedition'}`,
      solved?.id === 'myst_roanoke'
        ? 'Relief party found strong clues and friends among the Croatoan. (The real fate of the 1587 Roanoke colonists is still unknown.)'
        : 'Relief party found the overdue crew alive, with help from the people of the coast.',
      'WONDER'
    );

    // Complete mystery mission
    setMissions(mList => mList.map(m => {
      if (m.id === 'mis_roanoke') {
        return { ...m, currentCount: 1, completed: true };
      }
      return m;
    }));

    setActiveMysteryCoords(undefined);
    setActiveMystery(null);
  };

  // Claim Mission Bounty
  const handleClaimMission = (missionId: string) => {
    const mis = missions.find(m => m.id === missionId);
    if (!mis || !mis.completed || mis.claimed) return;

    setDucats(d => d + mis.rewardDucats);
    setPrestige(p => p + mis.rewardPrestige);
    if (typeof mis.rewardTimber === 'number') {
      const timberBonus = mis.rewardTimber;
      setTimber(t => t + timberBonus);
    }

    setMissions(mList => mList.map(m => m.id === missionId ? { ...m, claimed: true } : m));

    addCaptainLog(
      undefined,
      'Admiralty Royal Registry',
      'Celebration Bells',
      `Royal Charter Bounty Claimed: ${mis.title}`,
      `Crown ministers bestowed ${mis.rewardDucats} Ducats and ${mis.rewardPrestige} Prestige upon the exploration charter.`,
      'DIPLOMACY'
    );
  };

  // Resolve Encounter
  const handleResolveEncounter = (optIdx: number) => {
    if (!activeEncounter) return;
    const opt = activeEncounter.options[optIdx];
    const outcome = opt.effect({});

    if (outcome.resourceDeltas) {
      if (outcome.resourceDeltas.provisions) {
        setShips(prev => prev.map(s => ({
          ...s,
          cargo: { ...s.cargo, provisions: Math.max(0, s.cargo.provisions + (outcome.resourceDeltas?.provisions || 0)) }
        })));
      }
      if (outcome.resourceDeltas.prestige) {
        setPrestige(p => p + (outcome.resourceDeltas?.prestige || 0));
      }
      if (outcome.resourceDeltas.ducats) {
        setDucats(d => d + (outcome.resourceDeltas?.ducats || 0));
      }
    }

    setActiveEncounter(null);
  };

  // Diplomacy Actions
  const handleOfferGift = (cultureId: string, giftCost: number, harmonyGain: number) => {
    setDucats(d => d - giftCost);
    setCultures(prev => {
      const c = prev[cultureId];
      if (!c) return prev;
      const newHarmony = Math.min(100, c.harmony + harmonyGain);
      const newRel = newHarmony >= 80 ? 'HONORED_ALLY' : newHarmony >= 60 ? 'AMICABLE' : newHarmony >= 40 ? 'CURIOUS' : 'WARY';
      return {
        ...prev,
        [cultureId]: { ...c, harmony: newHarmony, relationship: newRel }
      };
    });
  };

  const handleTradeResource = (cultureId: string, resourceKey: string, amount: number, costDucats: number) => {
    setDucats(d => d - costDucats);
    setPrestige(p => p + 10);
  };

  const handleHireGuide = (cultureId: string, fee: number) => {
    setDucats(d => d - fee);
    setCultures(prev => {
      const c = prev[cultureId];
      if (!c) return prev;
      return {
        ...prev,
        [cultureId]: { ...c, hasGuideHired: true, harmony: Math.min(100, c.harmony + 10) }
      };
    });
  };

  const handleSignPeaceCharter = (cultureId: string) => {
    setCultures(prev => {
      const c = prev[cultureId];
      if (!c) return prev;
      return {
        ...prev,
        [cultureId]: { ...c, peaceCharterSigned: true, harmony: 100, relationship: 'HONORED_ALLY' }
      };
    });
    setPrestige(p => p + 120);

    // Establish treaty post in this culture's region
    const cult = cultures[cultureId];
    if (cult) {
      setRegions(prev => prev.map(r => {
        if (r.indigenousCultureId === cultureId) {
          return { ...r, hasTreatyPost: true };
        }
        return r;
      }));

      addCaptainLog(
        undefined,
        cult.regionName,
        'Peaceful Dawn',
        `Perpetual Amity Charter Ratified with ${cult.name}`,
        `Sovereigns signed reciprocal treaty without conquest. Treaty Trading Post established for fair commerce and cartography.`,
        'DIPLOMACY'
      );
    }

    // Complete Accord Mission
    setMissions(mList => mList.map(m => {
      if (m.id === 'mis_sovereign_accord') {
        return { ...m, currentCount: 1, completed: true };
      }
      return m;
    }));
  };

  // Found Treaty Post manually
  const handleEstablishTreatyPost = (regionId: string, timberCost: number, ducatsCost: number) => {
    setTimber(t => t - timberCost);
    setDucats(d => d - ducatsCost);
    setPrestige(p => p + 50);
    setRegions(prev => prev.map(r => r.id === regionId ? { ...r, hasTreatyPost: true } : r));
  };

  // Apply Celestial Navigation Astrolabe Fix (+15% speed buff)
  const handleApplyCelestialFix = (shipId: string, starName: string, speedBonusPct: number) => {
    setShips(prev => prev.map(s => {
      if (s.id !== shipId) return s;
      return {
        ...s,
        celestialBonusActive: true,
        celestialBonusRemainingDays: 7, // 7 days of heightened navigational accuracy
        lastSightedStar: starName,
        lastCelestialFixDate: `${MONTH_NAMES[monthIndex]} ${dayOfMonth}, ${gameYear}`
      };
    }));
    setPrestige(p => p + 25);
    const targetShip = ships.find(s => s.id === shipId);
    addCaptainLog(
      targetShip?.name,
      targetShip?.destinationName || 'Open Ocean Sea Lane',
      'Starlit Nocturnal Skies',
      `Celestial Fix: ${starName}`,
      `Astrolabe angle aligned to ${starName}. True latitude established; the navigator can run down the latitude to the destination, a +${speedBonusPct}% speed bonus.`,
      'WONDER'
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#181411] text-[#EFE7D8]">
      {/* Starting Modal */}
      {!hasStarted && (
        <NationSelectModal
          onSelectNation={handleStartGame}
          savedSummary={savedGame ? `${CHARTERS[savedGame.charter.len].name} for ${savedGame.nation.charAt(0) + savedGame.nation.slice(1).toLowerCase()} · ${MONTH_NAMES[savedGame.month]} ${savedGame.day}, ${savedGame.year}` : undefined}
          onContinue={savedGame ? handleContinueGame : undefined}
        />
      )}

      {/* Top Bar with Contract Compliant 3-zone architecture */}
      <TopBar
        playerNation={playerNation}
        gameYear={gameYear}
        gameMonth={MONTH_NAMES[monthIndex]}
        season={currentSeason}
        hourOfDay={hourOfDay}
        isNight={isNight}
        ducats={ducats}
        prestige={prestige}
        gameSpeed={gameSpeed}
        onSetGameSpeed={setGameSpeed}
        activeView={activeView}
        onSelectView={setActiveView}
        unclaimedMissionsCount={missions.filter(m => m.completed && !m.claimed).length}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(SoundEngine.toggleMute())}
      />

      {charterCfg && hasStarted && (
        <CharterBar config={charterCfg} progress={progress} endDateStr={endDateStr} />
      )}

      {/* Main View Area */}
      <main className="flex-1 relative overflow-hidden">
        {activeView === 'MAP' && (
          <NauticalMap
            playerNation={playerNation}
            ships={ships}
            regions={regions}
            selectedShipId={selectedShipId}
            onSelectShip={setSelectedShipId}
            onSelectRegion={(reg) => setSelectedRegion(reg)}
            onOrderShipToTarget={handleOrderShip}
            activeMysteryCoords={activeMysteryCoords}
            onInvestigateMystery={handleInvestigateMystery}
            isNight={isNight}
            onOpenCelestialModal={(shipId) => setCelestialShipId(shipId)}
          />
        )}

        {activeView === 'CATALOG' && (
          <FieldCatalog
            specimens={specimens}
            onPresentToAcademy={handlePresentToAcademy}
            playerNationAdjective={NATIONS[playerNation].adjective}
          />
        )}

        {activeView === 'FLEET' && (
          <FleetManager
            playerNation={playerNation}
            ships={ships}
            ducats={ducats}
            timber={timber}
            onCommissionShip={handleCommissionShip}
            onHireOfficer={handleHireOfficer}
            onResupplyShip={handleResupplyShip}
            onLaunchSearchExpedition={handleLaunchSearch}
          />
        )}

        {activeView === 'DIPLOMACY' && (
          <DiplomacyModal
            cultures={cultures}
            initialCultureId={diplomacyCultureId}
            metCultureIds={regions.filter(r => r.discovered && r.indigenousCultureId).map(r => r.indigenousCultureId as string)}
            regionNameByCulture={Object.fromEntries(regions.filter(r => r.indigenousCultureId).map(r => [r.indigenousCultureId as string, r.name]))}
            playerNation={playerNation}
            ducats={ducats}
            onOfferGift={handleOfferGift}
            onTradeResource={handleTradeResource}
            onHireGuide={handleHireGuide}
            onSignPeaceCharter={handleSignPeaceCharter}
          />
        )}

        {activeView === 'LOGS' && (
          <CaptainLogModal
            missions={missions}
            logs={captainLogs}
            onClaimMission={handleClaimMission}
          />
        )}

        {activeView === 'RIVALRY' && (
          <CrownRivalryModal
            playerNation={playerNation}
            rivalStates={rivalStates}
            playerPrestige={prestige}
            playerDiscoveredCount={regions.filter(r => r.discovered).length}
            playerBotanicalCount={specimens.filter(s => s.discovered).length}
            playerFleetCount={ships.length}
          />
        )}

        {notice && (
          <div role="status" className="absolute bottom-16 left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 bg-[#2B2118] border border-amber-600 text-amber-100 text-xs px-3 py-2 rounded-lg shadow-xl">{notice}</div>
        )}

        {/* Region Inspector Side Overlay */}
        {selectedRegion && activeView === 'MAP' && (
          <RegionInspector
            region={selectedRegion}
            culture={selectedRegion.indigenousCultureId ? cultures[selectedRegion.indigenousCultureId] : undefined}
            specimens={specimens}
            ducats={ducats}
            timber={timber}
            onClose={() => setSelectedRegion(null)}
            onSurveyRegion={handleSurveyRegion}
            onOpenDiplomacy={(cId) => {
              setDiplomacyCultureId(cId);
              setSelectedRegion(null);
              setActiveView('DIPLOMACY');
            }}
            onEstablishTreatyPost={handleEstablishTreatyPost}
            selectedShipName={(() => { const sh = ships.find(x => x.id === selectedShipId); return sh && sh.status !== 'LOST' && sh.status !== 'OVERDUE' ? sh.name : undefined; })()}
            onSendShip={() => { handleOrderShip(selectedShipId, selectedRegion.coords, selectedRegion.name); setSelectedRegion(null); }}
          />
        )}
      </main>

      {/* Interactive Encounter Dilemma Modal */}
      {activeEncounter && (
        <EncounterModal
          encounter={activeEncounter}
          onResolve={handleResolveEncounter}
        />
      )}

      {/* Missing Ship / CROATOAN Mystery Investigation Modal */}
      {activeMystery && (
        <SearchInvestigationModal
          mystery={activeMystery}
          onConcludeInvestigation={handleConcludeMystery}
        />
      )}

      {/* The charter is over: stars, what she did, and what's next */}
      {charterEnd && charterCfg && (
        <CharterEndModal
          config={charterCfg}
          result={charterEnd}
          embedded={EMBEDDED}
          onNewCharter={handleNewCharter}
          onBack={closeGame}
        />
      )}

      {/* Celestial Navigation Astrolabe Modal */}
      {celestialShipId && (
        <CelestialNavigationModal
          ship={ships.find(s => s.id === celestialShipId) || ships[0]}
          onApplyCelestialFix={handleApplyCelestialFix}
          onClose={() => setCelestialShipId(null)}
        />
      )}
    </div>
  );
}
