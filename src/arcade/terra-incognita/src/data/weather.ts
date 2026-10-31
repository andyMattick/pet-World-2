import { ClimateZone, CurrentWeather, WeatherType } from '../types';

export const CLIMATE_ZONES: ClimateZone[] = [
  {
    id: 'doldrums',
    name: 'Equatorial Doldrums (ITCZ)',
    description: 'A stagnant belt of dead calm and sweltering tropical heat near the equator. Sails hang lifeless.',
    latMin: -5,
    latMax: 7,
    lngMin: -180,
    lngMax: 180,
    baseWeather: 'DOLDRUMS_CALM',
    speedMultiplier: 0.35,
    hazardRisk: 0.40,
    windHeading: 0
  },
  {
    id: 'ne_trades',
    name: 'Northeast Trade Winds (Alisios)',
    description: 'Steady, favorable trade winds carrying caravels swiftly from Europe to the Caribbean and Americas.',
    latMin: 8,
    latMax: 28,
    lngMin: -95,
    lngMax: -12,
    baseWeather: 'FAIR_WINDS',
    speedMultiplier: 1.45,
    hazardRisk: 0.08,
    windHeading: 250
  },
  {
    id: 'se_trades',
    name: 'Southeast Trade Winds',
    description: 'Reliable southeasterly ocean breezes powering voyages along Brazil and the Gulf of Guinea.',
    latMin: -26,
    latMax: -6,
    lngMin: -50,
    lngMax: 20,
    baseWeather: 'FAIR_WINDS',
    speedMultiplier: 1.35,
    hazardRisk: 0.10,
    windHeading: 310
  },
  {
    id: 'north_atlantic_gales',
    name: 'North Atlantic Westerlies & Storm Front',
    description: 'Turbulent cold waters prone to sudden squalls, rolling grey swells, and biting rainstorms.',
    latMin: 38,
    latMax: 62,
    lngMin: -75,
    lngMax: 5,
    baseWeather: 'GALE_STORM',
    speedMultiplier: 0.85,
    hazardRisk: 0.45,
    windHeading: 80
  },
  {
    id: 'roaring_forties',
    name: 'The Roaring Forties & Cape of Storms',
    description: 'Howling circumpolar gales that whip the Southern Ocean into colossal thirty-foot whitecaps.',
    latMin: -65,
    latMax: -38,
    lngMin: -180,
    lngMax: 180,
    baseWeather: 'GALE_STORM',
    speedMultiplier: 1.15,
    hazardRisk: 0.65,
    windHeading: 90
  },
  {
    id: 'monsoon_seas',
    name: 'Monsoon Basin of the Indian Ocean',
    description: 'Seasonal wind reversals connecting the Malabar spice coast and the Straits of Malacca.',
    latMin: -8,
    latMax: 24,
    lngMin: 50,
    lngMax: 110,
    baseWeather: 'FAIR_WINDS',
    speedMultiplier: 1.30,
    hazardRisk: 0.22,
    windHeading: 70
  },
  {
    id: 'polar_ice',
    name: 'Sub-Arctic Fog & Drifting Ice Floes',
    description: 'Dense blinding fog banks and jagged floating icebergs that test the nerve of the lookout.',
    latMin: 62,
    latMax: 82,
    lngMin: -180,
    lngMax: 180,
    baseWeather: 'POLAR_CHILL',
    speedMultiplier: 0.60,
    hazardRisk: 0.50,
    windHeading: 180
  }
];

export function getWeatherAtCoords(lat: number, lng: number, season: 'Spring' | 'Summer' | 'Autumn' | 'Winter'): CurrentWeather {
  // Find matching climate zone
  const zone = CLIMATE_ZONES.find(z => 
    lat >= z.latMin && lat <= z.latMax && lng >= z.lngMin && lng <= z.lngMax
  );

  if (!zone) {
    // Default temperate ocean conditions
    return {
      type: 'FAIR_WINDS',
      name: 'Moderate Ocean Breeze',
      description: 'Clear skies and gentle ocean swells, ideal for exploration.',
      speedModifier: 1.0,
      dangerLevel: 'SAFE',
      icon: 'Wind'
    };
  }

  // Season modulations
  let modSpeed = zone.speedMultiplier;
  let type: WeatherType = zone.baseWeather;

  if (zone.id === 'doldrums') {
    return {
      type: 'DOLDRUMS_CALM',
      name: 'Dead Calm in the Doldrums',
      description: 'Sails hang motionless. Water lies like lead under blistering sun. Speed reduced by 65%.',
      speedModifier: 0.35,
      dangerLevel: 'HAZARDOUS',
      icon: 'Sun'
    };
  }

  if (zone.id === 'north_atlantic_gales') {
    if (season === 'Autumn' || season === 'Winter') {
      return {
        type: 'GALE_STORM',
        name: 'Violent North Atlantic Squall',
        description: 'Blinding rain and howling gale winds; sails reefed, speed reduced, high hazard of hull damage.',
        speedModifier: 0.70,
        dangerLevel: 'PERILOUS',
        icon: 'CloudLightning'
      };
    } else {
      return {
        type: 'FAIR_WINDS',
        name: 'Stiff North Atlantic Breeze',
        description: 'Cold, brisk westerlies pushing the ship forward at good knots.',
        speedModifier: 1.10,
        dangerLevel: 'MILD',
        icon: 'Wind'
      };
    }
  }

  if (zone.id === 'roaring_forties') {
    return {
      type: 'GALE_STORM',
      name: 'Roaring Forties Heavy Gale',
      description: 'Ferocious southern gales! Fast downwind run, but relentless pounding waves.',
      speedModifier: 1.20,
      dangerLevel: 'PERILOUS',
      icon: 'Waves'
    };
  }

  if (zone.id === 'polar_ice') {
    return {
      type: 'POLAR_CHILL',
      name: 'Freezing Mist & Drifting Bergs',
      description: 'Lookouts posted at the bow. Slow, watchful navigation through pack ice.',
      speedModifier: 0.55,
      dangerLevel: 'HAZARDOUS',
      icon: 'Snowflake'
    };
  }

  if (zone.id === 'ne_trades' || zone.id === 'se_trades') {
    return {
      type: 'FAIR_WINDS',
      name: 'Favorable Trade Winds (Alisios)',
      description: 'Golden sailing conditions! Consistent following wind boosting ship speed by +45%.',
      speedModifier: 1.45,
      dangerLevel: 'SAFE',
      icon: 'Wind'
    };
  }

  return {
    type: 'FAIR_WINDS',
    name: 'Fair Navigation Breeze',
    description: 'Steady sea breeze and good visibility.',
    speedModifier: modSpeed,
    dangerLevel: 'SAFE',
    icon: 'Wind'
  };
}
