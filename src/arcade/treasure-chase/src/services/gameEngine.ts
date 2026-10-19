import { ARTIFACTS } from '../data/artifacts';
import { CITIES } from '../data/cities';
import { SUSPECTS } from '../data/suspects';
import {
  Artifact,
  CaseLeg,
  CityDestination,
  DiscoveredClue,
  GameCase,
  InvestigationSite,
  PlayerCareer,
  Suspect,
  WarrantCriteria,
} from '../types/game';

// Haversine formula to compute great-circle distance in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Convert distance to flight hours (approx 700 km/h cruising + 1 hour airport transit)
export function calculateFlightHours(cityA: CityDestination, cityB: CityDestination): number {
  const dist = calculateDistanceKm(cityA.lat, cityA.lng, cityB.lat, cityB.lng);
  const flightTime = Math.max(3, Math.round(dist / 850) + 1);
  return Math.min(flightTime, 14);
}

// Helper to format remaining hours into a retro detective day/time string
export function formatGameTime(startingDayOffset: number, hoursRemaining: number, totalAllowed: number): { day: string; time: string; text: string } {
  const hoursSpent = totalAllowed - hoursRemaining;
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Starting day is Tuesday (index 1) at 09:00 AM
  const startDayIdx = 1;
  const startHour = 9;

  const currentTotalHours = startHour + hoursSpent;
  const dayIndex = (startDayIdx + Math.floor(currentTotalHours / 24)) % 7;
  const hourOfDay = currentTotalHours % 24;

  const day = daysOfWeek[dayIndex];
  const ampm = hourOfDay >= 12 ? 'PM' : 'AM';
  const displayHour = hourOfDay % 12 === 0 ? 12 : hourOfDay % 12;
  const time = `${displayHour.toString().padStart(2, '0')}:00 ${ampm}`;

  return {
    day,
    time,
    text: `${day}, ${time}`,
  };
}

const SITE_TEMPLATES: { type: InvestigationSite['type']; nameGenerator: (city: CityDestination) => string; role: string }[] = [
  {
    type: 'museum',
    nameGenerator: (c) => `${c.name} Heritage Museum & Archives`,
    role: 'Chief Antiquities Curator',
  },
  {
    type: 'harbor',
    nameGenerator: (c) => `${c.name} International Port & Airfield`,
    role: 'Customs & Port Inspector',
  },
  {
    type: 'market',
    nameGenerator: (c) => `${c.name} Historic Grand Bazaar`,
    role: 'Antiquities Broker',
  },
  {
    type: 'archive',
    nameGenerator: (c) => `${c.name} Royal Geographical Society`,
    role: 'Senior Cartographer',
  },
];

const WITNESS_NAMES = [
  'Dr. Elena Vance',
  'Inspector Jean Renard',
  'Master Ahmed Bilal',
  'Madam Sophie Chen',
  'Captain Ronald Sterling',
  'Archivist Thomas Finch',
  'Professor Amara Diallo',
  'Captain Diego Navarro',
  'Consul Arthur Pendelton',
  'Scholar Kenji Takahashi',
  'Director Fatima Zahra',
  'Curator Henrik Lind',
];

function getRandomElements<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateNewCase(difficulty: 'Rookie' | 'Detective' | 'Scholar' = 'Detective', existingCaseNumber: number = 1): GameCase {
  // 1. Pick random artifact
  const artifact = ARTIFACTS[Math.floor(Math.random() * ARTIFACTS.length)];

  // 2. Pick random culprit
  const culprit = SUSPECTS[Math.floor(Math.random() * SUSPECTS.length)];

  // 3. Determine trail length based on difficulty
  const trailLength = difficulty === 'Rookie' ? 4 : difficulty === 'Detective' ? 5 : 6;
  const timeBudget = difficulty === 'Rookie' ? 144 : difficulty === 'Detective' ? 120 : 96;

  // 4. Determine starting city
  // Try to find a city matching the artifact's origin or random city
  const originMatch = CITIES.find((c) =>
    artifact.originCity.toLowerCase().includes(c.name.toLowerCase()) ||
    c.name.toLowerCase().includes(artifact.originCity.toLowerCase())
  );
  const startingCity = originMatch || CITIES[Math.floor(Math.random() * CITIES.length)];

  // 5. Select subsequent trail cities (no duplicates)
  const remainingCities = CITIES.filter((c) => c.id !== startingCity.id);
  const trailCities: CityDestination[] = [startingCity];

  // Procedurally chain cities across different continents or diverse geography
  const chosenTrail = getRandomElements(remainingCities, trailLength - 1);
  trailCities.push(...chosenTrail);

  // 6. Build the legs
  const legs: CaseLeg[] = [];

  // Trait distribution for culprit clues across legs
  const culpritTraits: { name: 'Gender' | 'Hair' | 'Vehicle' | 'Hobby' | 'Accessory' | 'Mark'; value: string; phrase: string }[] = [
    { name: 'Gender', value: culprit.gender, phrase: `The witness noted the suspect was a ${culprit.gender}.` },
    { name: 'Hair', value: culprit.hair, phrase: `Informants noticed a flash of distinct ${culprit.hair} hair beneath their fedora.` },
    { name: 'Vehicle', value: culprit.vehicle, phrase: `The fugitive bragged about escaping across borders in a ${culprit.vehicle}.` },
    { name: 'Hobby', value: culprit.hobby, phrase: `A baggage handler saw luggage filled with gear for ${culprit.hobby}.` },
    { name: 'Accessory', value: culprit.accessory, phrase: `A vendor recalled the suspect adjusting a prominent ${culprit.accessory}.` },
    { name: 'Mark', value: culprit.mark, phrase: `The clerk couldn't miss a striking ${culprit.mark}.` },
  ];
  const shuffledTraits = [...culpritTraits].sort(() => 0.5 - Math.random());

  for (let i = 0; i < trailCities.length; i++) {
    const currentCity = trailCities[i];
    const isStartingCity = i === 0;
    const isFinalHideout = i === trailCities.length - 1;
    const nextCity = isFinalHideout ? null : trailCities[i + 1];

    // Pick 3 investigation sites for this city
    const availableSites: InvestigationSite[] = SITE_TEMPLATES.slice(0, 3).map((template, idx) => ({
      id: `${currentCity.id}_site_${idx}`,
      name: template.nameGenerator(currentCity),
      type: template.type,
      witnessRole: template.role,
      witnessName: WITNESS_NAMES[(i * 3 + idx) % WITNESS_NAMES.length],
      witnessQuoteIntro: `Greetings, Detective. The local authorities informed me G.L.O.B.E. was investigating the theft of ${artifact.name}.`,
    }));

    // Generate clues for each site
    const siteClues: CaseLeg['siteClues'] = {};

    if (nextCity) {
      // Pick 3 distinct clues about the NEXT city
      // Filter clues by difficulty or pick available
      let candidateClues = nextCity.clues;
      if (difficulty === 'Scholar') {
        const scholarClues = nextCity.clues.filter((c) => c.difficulty === 'scholar' || c.difficulty === 'detective');
        if (scholarClues.length >= 2) candidateClues = scholarClues;
      }

      const pickedDestClues = getRandomElements(candidateClues, availableSites.length);

      availableSites.forEach((site, siteIdx) => {
        const destClue = pickedDestClues[siteIdx] || candidateClues[0];
        // Distribute suspect clues on site 1 and site 2 of non-final legs
        let suspectClueObj = undefined;
        if (siteIdx === 1 || (siteIdx === 2 && i % 2 === 1)) {
          const trait = shuffledTraits[(i + siteIdx) % shuffledTraits.length];
          suspectClueObj = {
            traitName: trait.name,
            traitValue: trait.value,
            text: trait.phrase,
          };
        }

        siteClues[site.id] = {
          destinationClue: destClue,
          suspectClue: suspectClueObj,
        };
      });
    } else {
      // Final Hideout Leg!
      availableSites.forEach((site, siteIdx) => {
        const finalClue = {
          id: `final_clue_${siteIdx}`,
          category: 'architecture' as const,
          difficulty: 'detective' as const,
          text: `A shadowy figure matching the suspect was seen slipping into an old safehouse near ${currentCity.landmarks[siteIdx % currentCity.landmarks.length]}! You have tracked them to their final lair!`,
          hintHelp: `This is the suspect's final lair! Ensure you have an Arrest Warrant issued before raiding the safehouse!`,
          searchKeywords: [currentCity.name, 'Final Lair'],
        };
        const trait = shuffledTraits[siteIdx % shuffledTraits.length];
        siteClues[site.id] = {
          destinationClue: finalClue,
          suspectClue: {
            traitName: trait.name,
            traitValue: trait.value,
            text: `Informant confirms: ${trait.phrase}`,
          },
        };
      });
    }

    // Travel options: if not final leg, nextCity + 3 random decoys. If final, 4 random decoys (or final options)
    const otherCities = CITIES.filter((c) => c.id !== currentCity.id && (!nextCity || c.id !== nextCity.id));
    const decoys = getRandomElements(otherCities, 3);
    const travelOptions = nextCity ? [nextCity, ...decoys].sort(() => 0.5 - Math.random()) : decoys;

    legs.push({
      legIndex: i,
      destination: currentCity,
      isStartingCity,
      isFinalHideout,
      availableSites,
      visitedSiteIds: [],
      siteClues,
      travelOptions,
    });
  }

  const startingDate = 'Tuesday, 09:00 AM';

  return {
    caseId: `CASE-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
    caseNumber: existingCaseNumber,
    artifact,
    culprit,
    difficulty,
    legs,
    currentLegIndex: 0,
    currentCity: startingCity,
    hoursRemaining: timeBudget,
    totalTimeAllowed: timeBudget,
    startingDate,
    currentDateDisplay: startingDate,
    warrantIssuedFor: null,
    clueLog: [],
    flightLog: [],
    status: 'briefing',
    score: 0,
  };
}

export function filterSuspects(criteria: WarrantCriteria): Suspect[] {
  return SUSPECTS.filter((suspect) => {
    if (criteria.gender && suspect.gender !== criteria.gender) return false;
    if (criteria.hair && suspect.hair !== criteria.hair) return false;
    if (criteria.vehicle && suspect.vehicle !== criteria.vehicle) return false;
    if (criteria.hobby && suspect.hobby !== criteria.hobby) return false;
    if (criteria.accessory && suspect.accessory !== criteria.accessory) return false;
    if (criteria.mark && suspect.mark !== criteria.mark) return false;
    return true;
  });
}

const CAREER_STORAGE_KEY = 'great_treasure_chase_career_v1';

export function getPlayerCareer(): PlayerCareer {
  if (typeof window === 'undefined') {
    return {
      rankLevel: 1,
      rankTitle: 'Rookie Gumshoe',
      casesSolved: 0,
      casesFailed: 0,
      totalScore: 0,
      artifactsRecovered: [],
      solvedSuspects: [],
      badges: ['Bureau Badge'],
      missionHistory: [],
    };
  }

  const raw = localStorage.getItem(CAREER_STORAGE_KEY);
  if (!raw) {
    const initial: PlayerCareer = {
      rankLevel: 1,
      rankTitle: 'Rookie Gumshoe',
      casesSolved: 0,
      casesFailed: 0,
      totalScore: 0,
      artifactsRecovered: [],
      solvedSuspects: [],
      badges: ['Bureau Badge'],
      missionHistory: [],
    };
    localStorage.setItem(CAREER_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed.missionHistory) parsed.missionHistory = [];
    return parsed;
  } catch {
    return {
      rankLevel: 1,
      rankTitle: 'Rookie Gumshoe',
      casesSolved: 0,
      casesFailed: 0,
      totalScore: 0,
      artifactsRecovered: [],
      solvedSuspects: [],
      badges: ['Bureau Badge'],
      missionHistory: [],
    };
  }
}

export function updatePlayerCareer(gameCase: GameCase, won: boolean, earnedScore: number): PlayerCareer {
  const current = getPlayerCareer();
  if (!current.missionHistory) current.missionHistory = [];

  const completedMission: import('../types/game').CompletedMission = {
    id: `MISSION-${Date.now()}`,
    caseNumber: gameCase.caseNumber,
    artifactName: gameCase.artifact.name,
    artifactEra: gameCase.artifact.era,
    artifactOrigin: `${gameCase.artifact.originCity}, ${gameCase.artifact.originCountry}`,
    artifactCategory: gameCase.artifact.category,
    culpritName: gameCase.culprit.name,
    culpritAlias: gameCase.culprit.alias,
    outcome:
      gameCase.status === 'solved' ||
      gameCase.status === 'escaped_no_warrant' ||
      gameCase.status === 'escaped_wrong_warrant'
        ? gameCase.status
        : 'escaped_time',
    difficulty: gameCase.difficulty,
    score: earnedScore,
    hoursRemaining: gameCase.hoursRemaining,
    totalTimeAllowed: gameCase.totalTimeAllowed,
    citiesVisited: [
      ...gameCase.flightLog.map((f) => f.from),
      gameCase.currentCity.name,
    ],
    finalCity: gameCase.currentCity.name,
    cluesCount: gameCase.clueLog.length,
    completedAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  current.missionHistory.unshift(completedMission);

  if (won) {
    current.casesSolved += 1;
    current.totalScore += earnedScore;
    if (!current.artifactsRecovered.includes(gameCase.artifact.name)) {
      current.artifactsRecovered.push(gameCase.artifact.name);
    }
    if (!current.solvedSuspects.includes(gameCase.culprit.name)) {
      current.solvedSuspects.push(gameCase.culprit.name);
    }

    // Rank titles progression
    if (current.casesSolved >= 15) {
      current.rankLevel = 6;
      current.rankTitle = 'Chief Antiquities Commissioner';
      if (!current.badges.includes('Golden Monocle')) current.badges.push('Golden Monocle');
    } else if (current.casesSolved >= 10) {
      current.rankLevel = 5;
      current.rankTitle = 'Master Sleuth of Antiquity';
      if (!current.badges.includes('Grand Astrolabe')) current.badges.push('Grand Astrolabe');
    } else if (current.casesSolved >= 6) {
      current.rankLevel = 4;
      current.rankTitle = 'Special Inspector';
      if (!current.badges.includes('Silver Compass')) current.badges.push('Silver Compass');
    } else if (current.casesSolved >= 3) {
      current.rankLevel = 3;
      current.rankTitle = 'Senior Field Detective';
      if (!current.badges.includes('Magnifying Glass')) current.badges.push('Magnifying Glass');
    } else if (current.casesSolved >= 1) {
      current.rankLevel = 2;
      current.rankTitle = 'Junior Investigator';
      if (!current.badges.includes('Field Notebook')) current.badges.push('Field Notebook');
    }
  } else {
    current.casesFailed += 1;
  }

  localStorage.setItem(CAREER_STORAGE_KEY, JSON.stringify(current));
  return current;
}
