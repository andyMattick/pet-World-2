import { CrownNation, NationConfig, VesselTypeInfo, Officer } from '../types';

export const NATIONS: Record<CrownNation, NationConfig> = {
  ENGLAND: {
    id: 'ENGLAND',
    name: 'Kingdom of England',
    ruler: 'King James I',
    adjective: 'English',
    motto: 'Dieu et mon droit',
    flagColor: '#DC2626',
    secondaryColor: '#FFFFFF',
    capital: 'London (Port of Deptford)',
    capitalCoords: [51.5, -0.05],
    perkTitle: 'Hakluyt\'s Voyages & Gresham Navigators',
    perkDescription: '+30% Prestige from scientific publications and +20% cartographic chart accuracy.',
    speedBonus: 1.05,
    diplomacyBonus: 1.0,
    prestigeBonus: 1.30,
    holdBonus: 1.10,
    startingDucats: 1400,
    startingTimber: 120,
    startingProvisions: 250
  },
  FRANCE: {
    id: 'FRANCE',
    name: 'Kingdom of France',
    ruler: 'King Henri IV',
    adjective: 'French',
    motto: 'Montjoie Saint Denis!',
    flagColor: '#2563EB',
    secondaryColor: '#F59E0B',
    capital: 'Saint-Malo (port; capital Paris)',
    capitalCoords: [49.5, 0.1],
    perkTitle: 'Truchements (Interpreters) & River Accord',
    perkDescription: '+35% Diplomatic Harmony gain with indigenous nations and +25% river navigation speed.',
    speedBonus: 1.0,
    diplomacyBonus: 1.35,
    prestigeBonus: 1.10,
    holdBonus: 1.0,
    startingDucats: 1350,
    startingTimber: 140,
    startingProvisions: 260
  },
  SPAIN: {
    id: 'SPAIN',
    name: 'Spanish Monarchy (Crown of Castile)',
    ruler: 'King Philip III',
    adjective: 'Spanish',
    motto: 'Plus Ultra',
    flagColor: '#D97706',
    secondaryColor: '#B91C1C',
    capital: 'Seville (Casa de Contratación port; court at Valladolid)',
    capitalCoords: [37.38, -5.98],
    perkTitle: 'Armada Grande & Stout Timbers',
    perkDescription: '+40% Ship Hull Durability during violent squalls and +30% Cargo Hold capacity.',
    speedBonus: 0.95,
    diplomacyBonus: 0.9,
    prestigeBonus: 1.15,
    holdBonus: 1.30,
    startingDucats: 1600,
    startingTimber: 160,
    startingProvisions: 280
  },
  PORTUGAL: {
    id: 'PORTUGAL',
    name: 'Kingdom of Portugal',
    ruler: 'King Philip III of Spain (Philip II of Portugal), ruling through a viceroy in Lisbon',
    adjective: 'Portuguese',
    motto: 'Por Mares Nunca Dantes Navegados',
    flagColor: '#059669',
    secondaryColor: '#DC2626',
    capital: 'Lisbon (Torre de Belém)',
    capitalCoords: [38.69, -9.21],
    perkTitle: 'Henry the Navigator\'s Legacy & Caravel Mastery',
    perkDescription: '+25% Ocean Sailing Speed and double profit from exotic spice trading routes.',
    speedBonus: 1.25,
    diplomacyBonus: 1.10,
    prestigeBonus: 1.10,
    holdBonus: 1.0,
    startingDucats: 1500,
    startingTimber: 110,
    startingProvisions: 240
  }
};

export const VESSEL_TYPES: Record<string, VesselTypeInfo> = {
  SLOOP: {
    type: 'SLOOP',
    name: 'Expedition Pinnace',
    description: 'A nimble, shallow-draft river & coastal craft. Unlocks inland river exploration along the St. Lawrence, Mississippi, and Amazon.',
    costDucats: 450,
    costTimber: 40,
    speedKnots: 8.5,
    cargoCapacity: 60,
    crewCapacity: 18,
    riverNavigable: true,
    durability: 65
  },
  CARAVEL: {
    type: 'CARAVEL',
    name: 'Ocean Caravel',
    description: 'Famed lateen-rigged explorer. Fast against head-winds, ideal for charting uncharted coastlines and ocean crossings.',
    costDucats: 750,
    costTimber: 80,
    speedKnots: 9.8,
    cargoCapacity: 120,
    crewCapacity: 30,
    riverNavigable: false,
    durability: 80
  },
  FLUYT: {
    type: 'FLUYT',
    name: 'Merchant Fluyt',
    description: 'Spacious pear-shaped hull designed for maximum hold space and low crew costs. Ideal for established treaty trade routes.',
    costDucats: 900,
    costTimber: 110,
    speedKnots: 7.2,
    cargoCapacity: 260,
    crewCapacity: 22,
    riverNavigable: false,
    durability: 75
  },
  GALLEON: {
    type: 'GALLEON',
    name: 'Royal Ocean Galleon',
    description: 'Mighty multi-deck flagship. Weather-resistant against severe ocean squalls, with a high stern deck for taking star sights.',
    costDucats: 1400,
    costTimber: 180,
    speedKnots: 7.8,
    cargoCapacity: 220,
    crewCapacity: 50,
    riverNavigable: false,
    durability: 100
  }
};

export const CANDIDATE_OFFICERS: Officer[] = [
  {
    id: 'off-1',
    name: 'Dr. Thaddeus Finch',
    role: 'BOTANIST',
    trait: 'Obsessive Herbarium Collector',
    quote: '"If it has roots, leaves, or smells faintly of vinegar, I must press it between parchment!"',
    skillBonus: 25,
    hiredCost: 180
  },
  {
    id: 'off-2',
    name: 'Madame Élodie de la Tour',
    role: 'DIPLOMAT',
    trait: 'Master of Etiquette & Gift-Giving',
    quote: '"A single jar of fine marmalade and genuine listening opens more harbors than a battery of bronze cannon."',
    skillBonus: 30,
    hiredCost: 210
  },
  {
    id: 'off-3',
    name: 'Mateo de Silva',
    role: 'NAVIGATOR',
    trait: 'Astrolabe Virtuoso',
    quote: '"The Southern Cross never deceives a man who respects the celestial mathematics."',
    skillBonus: 20,
    hiredCost: 190
  },
  {
    id: 'off-4',
    name: 'Barnaby "Squall-Eye" Vance',
    role: 'CARTOGRAPHER',
    trait: 'Perfectionist Draftsman',
    quote: '"Draw the coastlines true to life! None of those fanciful mermaids scribbled over unmapped shoals."',
    skillBonus: 35,
    hiredCost: 220
  },
  {
    id: 'off-5',
    name: 'Sister Inês de Coimbra',
    role: 'BOTANIST',
    trait: 'Apothecary & Herbal Healer',
    quote: '"God placed a leaf for every fever on this wondrous earth. We have only to seek it."',
    skillBonus: 25,
    hiredCost: 175
  },
  {
    id: 'off-6',
    name: 'Pierre-Luc Duval',
    role: 'DIPLOMAT',
    trait: 'Polyglot River Guide',
    quote: '"Respect their sacred waters, share tobacco, and they will show you rivers that flow through the clouds."',
    skillBonus: 28,
    hiredCost: 200
  }
];
