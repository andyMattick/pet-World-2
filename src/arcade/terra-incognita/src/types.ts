/**
 * Core game types for Terra Incognita: Age of Enlightened Exploration
 */

export type CrownNation = 'ENGLAND' | 'FRANCE' | 'SPAIN' | 'PORTUGAL';

export interface NationConfig {
  id: CrownNation;
  name: string;
  ruler: string;
  adjective: string;
  motto: string;
  flagColor: string;
  secondaryColor: string;
  capital: string;
  capitalCoords: [number, number]; // [lat, lng]
  perkTitle: string;
  perkDescription: string;
  speedBonus: number;
  diplomacyBonus: number;
  prestigeBonus: number;
  holdBonus: number;
  startingDucats: number;
  startingTimber: number;
  startingProvisions: number;
}

export type VesselClass = 'SLOOP' | 'CARAVEL' | 'FLUYT' | 'GALLEON';

export interface VesselTypeInfo {
  type: VesselClass;
  name: string;
  description: string;
  costDucats: number;
  costTimber: number;
  speedKnots: number;
  cargoCapacity: number;
  crewCapacity: number;
  riverNavigable: boolean;
  durability: number; // 1-100
}

export type OfficerRole = 'BOTANIST' | 'NAVIGATOR' | 'DIPLOMAT' | 'CARTOGRAPHER';

export interface Officer {
  id: string;
  name: string;
  role: OfficerRole;
  trait: string;
  quote: string;
  skillBonus: number; // e.g. +20% survey yield
  hiredCost: number;
}

export type FleetStatus = 'ANCHORED' | 'SAILING' | 'SURVEYING' | 'OVERDUE' | 'LOST';

export interface ShipCargo {
  provisions: number;
  timber: number;
  spices: number;
  rareFlora: number;
  preciousMetals: number;
  indigenousGifts: number;
}

export interface ExpeditionShip {
  id: string;
  name: string;
  vesselClass: VesselClass;
  coords: [number, number]; // [lat, lng]
  destinationCoords?: [number, number];
  destinationName?: string;
  waypoints?: [number, number][]; // Sequential maritime sea path
  currentWaypointIndex?: number;
  currentWeatherName?: string;
  currentWeatherSpeedMod?: number;
  heading: number; // angle in degrees
  status: FleetStatus;
  health: number; // 0 - 100
  crewMorale: number; // 0 - 100
  crewCount: number;
  cargo: ShipCargo;
  officers: Officer[];
  speedKnots: number;
  distanceRemainingMiles?: number;
  daysAtSea: number;
  assignedRouteId?: string;
  isFlagship?: boolean;
  lastKnownCoords: [number, number];
  missingReason?: string;
  mysteryClueId?: string;
  celestialBonusActive?: boolean;
  celestialBonusRemainingDays?: number;
  lastCelestialFixDate?: string;
  lastSightedStar?: string;
}

export type SpecimenCategory = 'FLORA' | 'FAUNA' | 'GEOGRAPHY' | 'WONDER';

export interface Specimen {
  id: string;
  name: string;
  scientificName: string;
  category: SpecimenCategory;
  regionId: string;
  regionName: string;
  description: string;
  fieldNotes: string; // Fun / whimsical naturalist remark
  prestigeValue: number;
  crownGrantDucats: number;
  discovered: boolean;
  discoveredByNation?: CrownNation;
  dateDiscovered?: string;
  iconName: string;
}

export type RelationshipStatus = 'WARY' | 'CURIOUS' | 'AMICABLE' | 'HONORED_ALLY';

export interface IndigenousCulture {
  id: string;
  name: string;
  leader: string;
  regionName: string;
  coords: [number, number];
  welcomeQuote: string;
  culturalLore: string;
  desiredGift: string; // e.g. "Fine Wool & Brass Clocks"
  favoredCommodity: string;
  harmony: number; // 0 to 100
  relationship: RelationshipStatus;
  tradeGoods: {
    resource: 'spices' | 'rareFlora' | 'timber' | 'provisions' | 'preciousMetals';
    amount: number;
    costInGifts: number;
  }[];
  localGuideAvailable: boolean;
  hasGuideHired: boolean;
  peaceCharterSigned: boolean;
  discovered: boolean;
}

export interface RegionPOI {
  id: string;
  name: string;
  coords: [number, number];
  biome: 'COASTAL' | 'RAINFOREST' | 'WOODLAND' | 'SAVANNA' | 'DESERT' | 'POLAR' | 'RIVER_DELTA' | 'ARCHIPELAGO';
  specimenIds: string[];
  indigenousCultureId?: string;
  discovered: boolean;
  surveyProgress: number; // 0 - 100%
  hasTreatyPost: boolean;
  hasReliefPost: boolean;
  notes: string;
}

export interface RandomEncounter {
  id: string;
  title: string;
  type: 'SEA' | 'LAND' | 'MYSTERY';
  description: string;
  historicalContext: string;
  options: {
    label: string;
    description: string;
    riskChance?: number; // 0-1
    successText: string;
    failureText?: string;
    effect: (state: any, shipId?: string) => { log: string; moraleDelta?: number; healthDelta?: number; resourceDeltas?: Partial<ShipCargo & { ducats: number; prestige: number }> };
  }[];
}

export interface MissingMystery {
  id: string;
  shipName: string;
  lostCoords: [number, number];
  locationDescription: string;
  clueTitle: string;
  clueText: string; // e.g. The carved CROATOAN tree, or a journal in a brass cylinder
  resolutionOutcome: 'INTEGRATED_TRIBE' | 'CHART_RECOVERED' | 'SECRET_HAVEN';
  survivorsFound: number;
  prestigeReward: number;
  loreReward: string;
}

export interface TradeRoute {
  id: string;
  name: string;
  originCoords: [number, number];
  destinationCoords: [number, number];
  destinationRegionId: string;
  assignedShipId: string;
  cargoType: 'spices' | 'rareFlora' | 'timber' | 'preciousMetals';
  profitPerTrip: number;
  tripDays: number;
  currentDay: number;
  isActive: boolean;
}

export interface GameLog {
  id: string;
  timestamp: string;
  gameYear: number;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  text: string;
  category: 'DISCOVERY' | 'DIPLOMACY' | 'FLEET' | 'RIVALRY' | 'MYSTERY' | 'TRADE';
}

export interface RivalNationState {
  nation: CrownNation;
  name: string;
  prestige: number;
  discoveredRegionsCount: number;
  botanicalCount: number;
  activeFleets: number;
  lastAnnouncement: string;
}

export type WeatherType = 'FAIR_WINDS' | 'GALE_STORM' | 'DOLDRUMS_CALM' | 'FOG_MIST' | 'SQUALL' | 'POLAR_CHILL';

export interface ClimateZone {
  id: string;
  name: string;
  description: string;
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
  baseWeather: WeatherType;
  speedMultiplier: number; // e.g. 1.35 for trade winds, 0.35 for doldrums
  hazardRisk: number; // 0-1
  windHeading: number; // degrees
}

export interface CurrentWeather {
  type: WeatherType;
  name: string;
  description: string;
  speedModifier: number;
  dangerLevel: 'SAFE' | 'MILD' | 'HAZARDOUS' | 'PERILOUS';
  icon: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  category: 'SURVEY' | 'DIPLOMACY' | 'TRADE' | 'NAVIGATION' | 'MYSTERY';
  targetCount: number;
  currentCount: number;
  completed: boolean;
  claimed: boolean;
  rewardDucats: number;
  rewardPrestige: number;
  rewardTimber?: number;
  flavorQuote: string;
}

export interface CaptainLogEntry {
  id: string;
  dateStr: string;
  shipName?: string;
  locationName: string;
  weatherName: string;
  title: string;
  message: string;
  severity: 'INFO' | 'WONDER' | 'PERIL' | 'DIPLOMACY';
}

