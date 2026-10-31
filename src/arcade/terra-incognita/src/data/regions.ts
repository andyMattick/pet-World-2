import { RegionPOI, IndigenousCulture } from '../types';

export const INDIGENOUS_CULTURES: Record<string, IndigenousCulture> = {
  powhatan: {
    id: 'powhatan',
    name: 'Powhatan Confederacy',
    leader: 'Wahunsenacawh (Chief Powhatan)',
    regionName: 'Tsenacommacah (Chesapeake Estuary)',
    coords: [37.2, -76.5],
    welcomeQuote: '"Our fathers remember the Spanish ship that came into our rivers. If you come with peaceful hearts and open hands, the oyster bays and cornfields are open to you."',
    culturalLore: 'A sophisticated alliance of over thirty Algonquian-speaking peoples governed by the Mamanatowick. Masters of estuarine navigation, maize agriculture, and prized copper, obtained through trade and worn as a sign of rank.',
    desiredGift: 'Copper Sheets & Brass Kettles',
    favoredCommodity: 'Chesapeake Pearls & Tobacco',
    harmony: 45,
    relationship: 'WARY',
    tradeGoods: [
      { resource: 'provisions', amount: 50, costInGifts: 15 },
      { resource: 'timber', amount: 40, costInGifts: 20 },
      { resource: 'rareFlora', amount: 25, costInGifts: 30 }
    ],
    localGuideAvailable: true,
    hasGuideHired: false,
    peaceCharterSigned: false,
    discovered: false
  },
  haudenosaunee: {
    id: 'haudenosaunee',
    name: 'Haudenosaunee (Iroquois Confederacy)',
    leader: 'Grand Council of Fifty Chiefs (chosen by the Clan Mothers)',
    regionName: 'Great Lakes & Finger Lakes',
    coords: [43.1, -75.2],
    welcomeQuote: '"Under the Great Tree of Peace, our Great Law governs five nations without king or crown. Speak truth, honor our council fire, and the forest paths shall protect your scholars."',
    culturalLore: 'The League of Peace founded on consensus democracy, matrilineal clan wisdom, and the Three Sisters (maize, beans, squash) polyculture.',
    desiredGift: 'Polished Brass Bells & Fine Iron Chiseled Tools',
    favoredCommodity: 'Beaver Pelts & Wampum Shell Beads',
    harmony: 50,
    relationship: 'CURIOUS',
    tradeGoods: [
      { resource: 'timber', amount: 80, costInGifts: 25 },
      { resource: 'rareFlora', amount: 35, costInGifts: 30 }
    ],
    localGuideAvailable: true,
    hasGuideHired: false,
    peaceCharterSigned: false,
    discovered: false
  },
  chinook: {
    id: 'chinook',
    name: 'Chinookan Peoples (Chinook & Clatsop)',
    leader: 'Village headmen of the Chinookan towns',
    regionName: 'Columbia River Estuary (Pacific Northwest)',
    coords: [46.2, -124.0],
    welcomeQuote: '"Your great canoe came from the sunset sea! The salmon runs are thick as gravel; dry your boots by our cedar plank-house fires."',
    culturalLore: 'Celebrated cedar canoe builders and master traders of the Pacific Northwest, controlling trade at Celilo Falls (Wyam).',
    desiredGift: 'Blue Glass Trade Beads & Venetian Mirrors',
    favoredCommodity: 'Dried Chinook Salmon & Mountain Cured Cedar',
    harmony: 55,
    relationship: 'CURIOUS',
    tradeGoods: [
      { resource: 'provisions', amount: 65, costInGifts: 20 },
      { resource: 'timber', amount: 60, costInGifts: 25 },
      { resource: 'rareFlora', amount: 30, costInGifts: 25 }
    ],
    localGuideAvailable: true,
    hasGuideHired: false,
    peaceCharterSigned: false,
    discovered: false
  },
  tupi: {
    id: 'tupi',
    name: 'Tupinambá Peoples',
    leader: 'Village headmen (morubixaba)',
    regionName: 'Mata Atlântica & Bahia Coast',
    coords: [-12.9, -38.5],
    welcomeQuote: '"Listen to the macaws and the thunder of the surf! The forest gives us brazilwood, manioc bread and cotton for our hammocks. Will you trade without chains?"',
    culturalLore: 'Farming villages of large longhouses, skilled in manioc farming, canoe-building, featherwork and hammock-weaving.',
    desiredGift: 'Bright Dyed Broadcloth & Tempered Steel Hatchets',
    favoredCommodity: 'Brazilwood Crimson Dye & Cotton Hammocks',
    harmony: 40,
    relationship: 'WARY',
    tradeGoods: [
      { resource: 'rareFlora', amount: 50, costInGifts: 25 },
      { resource: 'timber', amount: 50, costInGifts: 20 },
      { resource: 'spices', amount: 30, costInGifts: 35 }
    ],
    localGuideAvailable: true,
    hasGuideHired: false,
    peaceCharterSigned: false,
    discovered: false
  },
  quechua: {
    id: 'quechua',
    name: 'Ayllu of the High Andes',
    leader: 'The Kuraka (local Andean lord) of the ayllu',
    regionName: 'Cloud Forests of Cusco & Vilcabamba',
    coords: [-13.5, -71.9],
    welcomeQuote: '"Above the clouds where the condor glides, the Inca roads stretch thousands of miles. Inti warms those who bring knowledge, not greed for our sacred sweat of the sun."',
    culturalLore: 'Keepers of monumental stone terrace engineering, quipu mathematical knot-records, and thousands of potato varieties grown on terraces and stored as freeze-dried chuño.',
    desiredGift: 'Astronomical Glass Prisms & Fine Writing Parchment',
    favoredCommodity: 'Bitter Fever Bark & Fine Alpaca Textiles',
    harmony: 50,
    relationship: 'CURIOUS',
    tradeGoods: [
      { resource: 'rareFlora', amount: 60, costInGifts: 30 },
      { resource: 'preciousMetals', amount: 45, costInGifts: 50 },
      { resource: 'provisions', amount: 40, costInGifts: 15 }
    ],
    localGuideAvailable: true,
    hasGuideHired: false,
    peaceCharterSigned: false,
    discovered: false
  },
  kongo: {
    id: 'kongo',
    name: 'Kingdom of Kongo',
    leader: 'Manikongo Álvaro II',
    regionName: 'Mbanza Kongo & Congo River Estuary',
    coords: [-6.2, 14.2],
    welcomeQuote: '"Welcome, royal ambassadors! The Kingdom of Kongo welcomes your scholars to our royal court at São Salvador (Mbanza Kongo). Let us exchange knowledge, copper work and learning."',
    culturalLore: 'A long-established Christian kingdom (since 1491) with royal law courts, envoys to Lisbon and Rome, and fine copper work and raffia cloth (also used as money).',
    desiredGift: 'Books of European Mathematics & Brass Astrolabes',
    favoredCommodity: 'Carved Ivory Art & Malachite Ore',
    harmony: 60,
    relationship: 'AMICABLE',
    tradeGoods: [
      { resource: 'preciousMetals', amount: 50, costInGifts: 35 },
      { resource: 'timber', amount: 60, costInGifts: 20 },
      { resource: 'spices', amount: 25, costInGifts: 30 }
    ],
    localGuideAvailable: true,
    hasGuideHired: false,
    peaceCharterSigned: false,
    discovered: false
  },
  malacca: {
    id: 'malacca',
    name: 'Sultanate of Johor (heirs of Malacca)',
    leader: 'Sultan Alauddin Riayat Shah',
    regionName: 'Straits of Malacca & Malay Archipelago',
    coords: [2.2, 102.2],
    welcomeQuote: '"Our forefathers\' harbor at Malacca once heard eighty-four languages! Ships riding the monsoon still bring cloves, silks and Indian cottons to our river ports. May your sails be blessed by peace."',
    culturalLore: 'The legendary maritime crossroad of the Indian Ocean and South China Sea, keepers of one of Asia\'s oldest written sea codes (Undang-Undang Laut Melaka).',
    desiredGift: 'Venetian Glass Goblets & Silver Royal Medallions',
    favoredCommodity: 'Nutmeg, Cloves & Dragon Blood Resin',
    harmony: 65,
    relationship: 'AMICABLE',
    tradeGoods: [
      { resource: 'spices', amount: 80, costInGifts: 40 },
      { resource: 'rareFlora', amount: 40, costInGifts: 30 },
      { resource: 'preciousMetals', amount: 30, costInGifts: 35 }
    ],
    localGuideAvailable: true,
    hasGuideHired: false,
    peaceCharterSigned: false,
    discovered: false
  },
  maluku: {
    id: 'maluku',
    name: 'Sultanate of Ternate (Spice Islands)',
    leader: 'Sultan Saidi Berkat',
    regionName: 'Maluku Volcanic Archipelagos',
    coords: [0.8, 127.3],
    welcomeQuote: '"Our volcanic soil gives birth to the sacred clove tree found nowhere else on earth. If you come as honest merchants and honorable guests, our royal storehouses are open."',
    culturalLore: 'A powerful naval sultanate ruling over seventy-two islands with mighty kora-kora war galleys, famous for fiercely protecting sovereign independence and free commerce.',
    desiredGift: 'Iron Anchors & Damascene Steel Knives',
    favoredCommodity: 'Whole Cloves & Traded Banda Nutmeg',
    harmony: 55,
    relationship: 'CURIOUS',
    tradeGoods: [
      { resource: 'spices', amount: 100, costInGifts: 45 },
      { resource: 'timber', amount: 30, costInGifts: 15 }
    ],
    localGuideAvailable: true,
    hasGuideHired: false,
    peaceCharterSigned: false,
    discovered: false
  },
  khoisan: {
    id: 'khoisan',
    name: 'Khoikhoi of Table Bay',
    leader: 'Headman of the Goringhaiqua',
    regionName: 'Hui !Gaeb (Table Bay)',
    coords: [-33.9, 18.4],
    welcomeQuote: '"You look weary from the great howling south winds! Drink the sweet spring water from Table Mountain, and let our cattle graze beside your camp while you caulk your hulls."',
    culturalLore: 'Custodians of the Cape of Storms, possessing encyclopedic knowledge of coastal edible succulents, fynbos medicinal plants, and the fur seals of the coastal islands.',
    desiredGift: 'Copper & Brass Pieces & Iron Fishhooks',
    favoredCommodity: 'Fat-tailed Sheep & Cattle',
    harmony: 50,
    relationship: 'CURIOUS',
    tradeGoods: [
      { resource: 'provisions', amount: 75, costInGifts: 20 },
      { resource: 'rareFlora', amount: 35, costInGifts: 25 }
    ],
    localGuideAvailable: true,
    hasGuideHired: false,
    peaceCharterSigned: false,
    discovered: false
  }
};

export const WORLD_REGIONS: RegionPOI[] = [
  // Europe Home Waters (Discovered at game start)
  {
    id: 'english_channel',
    name: 'English Channel & Thames Estuary',
    coords: [50.8, -0.5],
    biome: 'COASTAL',
    specimenIds: [],
    discovered: true,
    surveyProgress: 100,
    hasTreatyPost: true,
    hasReliefPost: true,
    notes: 'Home waters of the King\'s ships (the Navy Royal) and merchant companies.'
  },
  {
    id: 'bay_of_biscay',
    name: 'Bay of Biscay & Brittany Coast',
    coords: [46.0, -3.5],
    biome: 'COASTAL',
    specimenIds: [],
    discovered: true,
    surveyProgress: 100,
    hasTreatyPost: true,
    hasReliefPost: true,
    notes: 'Departure coast for French corsairs and explorers out of Saint-Malo.'
  },
  {
    id: 'andalusia_tagus',
    name: 'Iberian Atlantic & Tagus Estuary',
    coords: [37.5, -8.5],
    biome: 'COASTAL',
    specimenIds: [],
    discovered: true,
    surveyProgress: 100,
    hasTreatyPost: true,
    hasReliefPost: true,
    notes: 'Golden harbor of Lisbon and Seville; gateway to the Atlantic.'
  },
  {
    id: 'canary_azores',
    name: 'Canaries & Azores Waystation',
    coords: [28.2, -16.0],
    biome: 'ARCHIPELAGO',
    specimenIds: ['dragon_tree'],
    discovered: true,
    surveyProgress: 80,
    hasTreatyPost: true,
    hasReliefPost: true,
    notes: 'Volcanic island waystations: the Canaries for water, wine and the outbound trade winds (alisios); the Azores on the homeward run.'
  },

  // North America & Lewis & Clark Route
  {
    id: 'chesapeake_bay',
    name: 'Chesapeake Bay & Outer Banks (Roanoke)',
    coords: [37.2, -76.5],
    biome: 'COASTAL',
    specimenIds: ['american_oyster', 'virginia_opossum', 'croatoan_cypress'],
    indigenousCultureId: 'powhatan',
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'Shallow barrier islands and fertile estuaries; historical site of Roanoke Island mystery.'
  },
  {
    id: 'great_lakes',
    name: 'St. Lawrence & Great Lakes Basin',
    coords: [44.5, -76.0],
    biome: 'WOODLAND',
    specimenIds: ['sugar_maple', 'north_american_beaver', 'niagara_falls'],
    indigenousCultureId: 'haudenosaunee',
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'Vast freshwater interior sea system; busy with Wendat, Algonquin and Haudenosaunee trade and rivalries.'
  },
  {
    id: 'mississippi_delta',
    name: 'Mississippi Delta & Gulf Coast',
    coords: [29.5, -89.5],
    biome: 'RIVER_DELTA',
    specimenIds: ['alligator_mississippiensis', 'magnolia_grandiflora'],
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'The gateway into the colossal continental river highway; dense bayous and rich wildlife.'
  },
  {
    id: 'upper_missouri',
    name: 'Great Plains & Quivira Grasslands',
    coords: [47.5, -101.5],
    biome: 'SAVANNA',
    specimenIds: ['american_bison', 'prairie_dog', 'purple_coneflower'],
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'Endless rolling grasslands teeming with millions of bison and medicinal prairie flora.'
  },
  {
    id: 'pacific_northwest',
    name: 'River of the West & Pacific Northwest',
    coords: [46.2, -124.0],
    biome: 'WOODLAND',
    specimenIds: ['western_red_cedar', 'chinook_salmon', 'spotted_owl'],
    indigenousCultureId: 'chinook',
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'Far beyond where Spanish ships turned back in 1603; giant cedars and roaring salmon runs.'
  },

  // Central America & Caribbean
  {
    id: 'caribbean_isles',
    name: 'Antilles & Lucayan Archipelago',
    coords: [21.5, -78.0],
    biome: 'ARCHIPELAGO',
    specimenIds: ['guaiacum_lignum_vitae', 'manatee_mermaid', 'royal_palm'],
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'Turquoise shallows and coral reefs; home of sea cow sightings recorded as sirens!'
  },

  // South America
  {
    id: 'bahia_coast',
    name: 'Bahia & Brazil Atlantic Rainforest',
    coords: [-12.9, -38.5],
    biome: 'RAINFOREST',
    specimenIds: ['brazilwood', 'blue_morpho'],
    indigenousCultureId: 'tupi',
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'Verdant tropical coastline producing legendary red dyewood and vibrant macaws; Salvador is the capital of Portuguese Brazil.'
  },
  {
    id: 'amazon_basin',
    name: 'Amazon River Estuary & Marañón',
    coords: [-0.5, -50.5],
    biome: 'RAINFOREST',
    specimenIds: ['rubber_tree', 'giant_water_lily', 'pink_river_dolphin'],
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'The largest river on earth, pulsing so fiercely that fresh water flows 100 miles out into the ocean!'
  },
  {
    id: 'andean_heights',
    name: 'Vilcabamba & Cloud Forests of Peru',
    coords: [-13.5, -71.9],
    biome: 'RAINFOREST',
    specimenIds: ['quinine_bark', 'andean_condor', 'wild_potato_varieties'],
    indigenousCultureId: 'quechua',
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'Misty cloud forests holding the bitter "fever bark" tree (cinchona), unknown to Europe until the 1630s.'
  },
  {
    id: 'strait_magellan',
    name: 'Strait of Magellan & Tierra del Fuego',
    coords: [-53.5, -70.5],
    biome: 'POLAR',
    specimenIds: ['magellanic_penguin', 'southern_beech', 'tierra_del_fuego_fires'],
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'The howling passage at the edge of the world; violent squalls and majestic glaciers.'
  },

  // Africa
  {
    id: 'senegambia_coast',
    name: 'Senegambia & Cape Verde Peninsula',
    coords: [14.7, -17.4],
    biome: 'SAVANNA',
    specimenIds: ['african_baobab', 'shea_butter_tree'],
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'Rich trade river mouths and the river trade of the Wolof and Mandinka kingdoms.'
  },
  {
    id: 'congo_delta',
    name: 'Kingdom of Kongo & River Mouth',
    coords: [-6.2, 12.4],
    biome: 'RAINFOREST',
    specimenIds: ['african_oil_palm', 'congo_falls'],
    indigenousCultureId: 'kongo',
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'Sovereign Christian kingdom welcoming respectful scientific diplomacy.'
  },
  {
    id: 'cape_of_good_hope',
    name: 'Cape of Storms & Table Bay',
    coords: [-33.9, 18.4],
    biome: 'COASTAL',
    specimenIds: ['king_protea', 'african_penguin', 'table_mountain_cloth'],
    indigenousCultureId: 'khoisan',
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'The great turn around Africa; the two oceans meet a little to the east, at Cape Agulhas.'
  },

  // Asia & East Indies
  {
    id: 'malabar_coast',
    name: 'Malabar Coast & Calicut',
    coords: [11.2, 75.8],
    biome: 'COASTAL',
    specimenIds: ['black_pepper_vine', 'cardamom_plant'],
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'The Ancient Spice Coast where black pepper grows wild on jungle vines.'
  },
  {
    id: 'straits_malacca',
    name: 'Straits of Malacca & Singapore',
    coords: [2.2, 102.2],
    biome: 'RIVER_DELTA',
    specimenIds: ['durian_king_fruit', 'malayan_tapir', 'mangrove_fireflies'],
    indigenousCultureId: 'malacca',
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'The golden bottleneck of global commerce; ships from China, India, and Arabia meet here.'
  },
  {
    id: 'spice_islands',
    name: 'Maluku Islands (Banda & Ternate)',
    coords: [0.8, 127.3],
    biome: 'ARCHIPELAGO',
    specimenIds: ['clove_tree', 'nutmeg_and_mace', 'greater_bird_of_paradise'],
    indigenousCultureId: 'maluku',
    discovered: false,
    surveyProgress: 0,
    hasTreatyPost: false,
    hasReliefPost: false,
    notes: 'The legendary spice islands: cloves from Ternate and nutmeg from Banda, worth a fortune in Europe.'
  }
];
