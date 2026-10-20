export type Gender = 'Male' | 'Female';
export type HairColor = 'Jet Black' | 'Silver Gray' | 'Auburn Red' | 'Platinum Blonde' | 'Chestnut Brown';
export type EscapeVehicle = 'Seaplane' | 'Vintage Sports Car' | 'Armored Yacht' | 'High-Speed Maglev' | 'Cargo Tramp Steamer' | 'Helicopter';
export type Hobby = 'Falconry' | 'Fencing' | 'Rare Numismatics' | 'Celestial Navigation' | 'Cryptography' | 'Chess' | 'Antique Horology' | 'Opera';
export type SignatureAccessory = 'Gold Signet Ring' | 'Silk Ascot' | 'Brass Monocle' | 'Leather Trenchcoat' | 'Pearl Brooch' | 'Silver Pocketwatch' | 'Obsidian Cane';
export type DistinguishingMark = 'Ouroboros Tattoo' | 'Eyebrow Scar' | 'Clockwork Cuff' | 'Lavender Scent' | 'Silver Earring' | 'Mechanical Compass';

export interface Suspect {
  id: string;
  name: string;
  alias: string;
  gender: Gender;
  hair: HairColor;
  vehicle: EscapeVehicle;
  hobby: Hobby;
  accessory: SignatureAccessory;
  mark: DistinguishingMark;
  bio: string;
  avatarSeed: string;
  accentColor: string;
}

export interface Artifact {
  id: string;
  name: string;
  era: string;
  estimatedYear: string;
  originCity: string;
  originCountry: string;
  currentHome: string;
  category: 'Relic' | 'Manuscript' | 'Jewel' | 'Weapon' | 'Sculpture' | 'Scientific' | 'Regalia';
  description: string;
  historicalSignificance: string;
  mysteryFact: string;
}

export interface CityClue {
  id: string;
  category: 'geography' | 'battle' | 'dynasty' | 'architecture' | 'astronomy_coordinates' | 'numismatics_culture';
  difficulty: 'rookie' | 'detective' | 'scholar';
  text: string;
  hintHelp: string;
  searchKeywords: string[];
}

export interface CityDestination {
  id: string;
  name: string;
  country: string;
  continent: 'Europe' | 'Asia' | 'Africa' | 'Middle East' | 'Americas' | 'Oceania';
  lat: number;
  lng: number;
  flag: string;
  historicalEraName: string;
  shortDescription: string;
  landmarks: string[];
  climateNote: string;
  clues: CityClue[];
}

export type SiteType = 'museum' | 'harbor' | 'archive' | 'market' | 'palace' | 'embassy';

export interface InvestigationSite {
  id: string;
  name: string;
  type: SiteType;
  witnessName: string;
  witnessRole: string;
  witnessQuoteIntro: string;
}

export interface DiscoveredClue {
  id: string;
  text: string;
  category: 'destination' | 'suspect';
  siteName: string;
  cityName: string;
  targetCityName?: string;
  suspectTraitName?: string;
  suspectTraitValue?: string;
  timestamp: string;
  searchQuery?: string;
}

export interface CaseLeg {
  legIndex: number;
  destination: CityDestination;
  isStartingCity: boolean;
  isFinalHideout: boolean;
  availableSites: InvestigationSite[];
  visitedSiteIds: string[];
  siteClues: Record<string, {
    destinationClue: CityClue;
    suspectClue?: {
      traitName: 'Gender' | 'Hair' | 'Vehicle' | 'Hobby' | 'Accessory' | 'Mark';
      traitValue: string;
      text: string;
    };
  }>;
  travelOptions: CityDestination[]; // 1 correct next destination (or final) + 3 decoys
}

export interface GameCase {
  caseId: string;
  caseNumber: number;
  artifact: Artifact;
  culprit: Suspect;
  difficulty: 'Rookie' | 'Detective' | 'Scholar';
  legs: CaseLeg[];
  currentLegIndex: number;
  currentCity: CityDestination;
  hoursRemaining: number;
  totalTimeAllowed: number;
  startingDate: string;
  currentDateDisplay: string;
  warrantIssuedFor: string | null; // suspect id or null
  clueLog: DiscoveredClue[];
  flightLog: { from: string; to: string; hoursSpent: number; wasCorrect: boolean }[];
  status: 'briefing' | 'active' | 'solved' | 'escaped_time' | 'escaped_no_warrant' | 'escaped_wrong_warrant';
  score: number;
}

export interface WarrantCriteria {
  gender?: Gender | '';
  hair?: HairColor | '';
  vehicle?: EscapeVehicle | '';
  hobby?: Hobby | '';
  accessory?: SignatureAccessory | '';
  mark?: DistinguishingMark | '';
}

export interface CompletedMission {
  id: string;
  caseNumber: number;
  artifactName: string;
  artifactEra: string;
  artifactOrigin: string;
  artifactCategory: string;
  culpritName: string;
  culpritAlias: string;
  outcome: 'solved' | 'escaped_time' | 'escaped_no_warrant' | 'escaped_wrong_warrant';
  difficulty: 'Rookie' | 'Detective' | 'Scholar';
  score: number;
  hoursRemaining: number;
  totalTimeAllowed: number;
  citiesVisited: string[];
  finalCity: string;
  cluesCount: number;
  completedAt: string;
}

export interface PlayerCareer {
  rankLevel: number;
  rankTitle: string;
  casesSolved: number;
  casesFailed: number;
  totalScore: number;
  artifactsRecovered: string[];
  solvedSuspects: string[];
  badges: string[];
  missionHistory: CompletedMission[];
}

