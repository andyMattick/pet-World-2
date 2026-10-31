import { DailyMission } from '../types';

export const INITIAL_MISSIONS: DailyMission[] = [
  {
    id: 'mis_roanoke',
    title: 'The Mystery of the Missing Fleet',
    description: 'Dispatch a vessel to the last known coordinates of the overdue expedition off Roanoke Island and the Outer Banks.',
    category: 'MYSTERY',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardDucats: 350,
    rewardPrestige: 150,
    rewardTimber: 40,
    flavorQuote: '"A vessel that fails to return after four seasons leaves a silent void in the Admiralty ledgers. Seek out what became of them!"'
  },
  {
    id: 'mis_academy_catalog',
    title: 'Royal Herbarium Charter',
    description: 'Collect and publish 3 new illustrated specimens of flora or fauna in the Royal Naturalist Compendium.',
    category: 'SURVEY',
    targetCount: 3,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardDucats: 280,
    rewardPrestige: 120,
    flavorQuote: '"The scholars of Europe hunger for true drawings of New World species. Dispel the ancient myths of dog-faced men and sea serpents!"'
  },
  {
    id: 'mis_sovereign_accord',
    title: 'Sovereign Treaty of Perpetual Amity',
    description: 'Attain 65% harmony and ratify a peaceful Peace Charter with any indigenous sovereign nation.',
    category: 'DIPLOMACY',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardDucats: 320,
    rewardPrestige: 180,
    flavorQuote: '"The greatest empires are forged not by gunpowder, but by honorable treaties recorded in wampum belts and written charters."'
  },
  {
    id: 'mis_river_passage',
    title: 'Inland River Survey (Champlain\'s Rivers)',
    description: 'Conduct a land and river survey trek along the St. Lawrence and Great Lakes, Mississippi, or Amazon basin.',
    category: 'NAVIGATION',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardDucats: 260,
    rewardPrestige: 110,
    flavorQuote: '"Follow the silver waters deep into the continental interior! Record the rapids, the great trees, and the mountain passes."'
  },
  {
    id: 'mis_commission_fleet',
    title: 'Expand the Royal Fleet',
    description: 'Commission a new exploration vessel (Sloop, Caravel, Fluyt, or Galleon) at the home port.',
    category: 'TRADE',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardDucats: 200,
    rewardPrestige: 90,
    rewardTimber: 50,
    flavorQuote: '"More sails on the ocean mean more knowledge brought home to the Crown."'
  }
];
