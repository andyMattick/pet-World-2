/**
 * Authentic Maritime Sea Lanes & Navigational Graph Engine.
 * Ensures ships navigate strictly via open oceans, coastal passages, oceanic straits,
 * and the treacherous Arctic Northwest Passage, never cutting across continental landmasses.
 */

import { calculateDistanceNauticalMiles } from './worldMap';

export interface SeaNode {
  id: string;
  name: string;
  coords: [number, number]; // [lat, lng]
  isNorthwestPassage?: boolean;
  isStrait?: boolean;
}

export interface SeaEdge {
  from: string;
  to: string;
  distanceMiles: number;
  isArcticHazard?: boolean;
}

export const SEA_NODES: Record<string, SeaNode> = {
  // EUROPE & HOME WATERS
  english_channel: { id: 'english_channel', name: 'English Channel', coords: [50.2, -1.5] },
  western_approaches: { id: 'western_approaches', name: 'Western Approaches', coords: [48.5, -9.5] },
  bay_of_biscay_offshore: { id: 'bay_of_biscay_offshore', name: 'Bay of Biscay Offshore', coords: [45.5, -6.5] },
  finisterre: { id: 'finisterre', name: 'Cape Finisterre', coords: [43.0, -10.5] },
  tagus_approach: { id: 'tagus_approach', name: 'Lisbon Offshore', coords: [38.5, -10.0] },
  st_vincent: { id: 'st_vincent', name: 'Cape St. Vincent', coords: [36.8, -9.5] },
  gibraltar_west: { id: 'gibraltar_west', name: 'Strait of Gibraltar Approach', coords: [36.0, -6.5], isStrait: true },

  // ATLANTIC HIGHWAYS & ISLAND WAYSTATIONS
  canaries_sea: { id: 'canaries_sea', name: 'Canary Islands Sea Lane', coords: [28.0, -16.5] },
  cape_verde_hub: { id: 'cape_verde_hub', name: 'Cape Verde Basin', coords: [15.5, -24.5] },
  mid_atlantic_north: { id: 'mid_atlantic_north', name: 'Central North Atlantic', coords: [32.0, -42.0] },
  equator_atlantic: { id: 'equator_atlantic', name: 'Equatorial Atlantic Highway', coords: [0.0, -28.0] },
  sargasso_sea: { id: 'sargasso_sea', name: 'Sargasso Sea', coords: [26.0, -60.0] },

  // NORTH AMERICA EAST COAST & CARIBBEAN
  grand_banks: { id: 'grand_banks', name: 'Grand Banks of Newfoundland', coords: [45.0, -50.0] },
  scotian_shelf: { id: 'scotian_shelf', name: 'Nova Scotia Sound', coords: [43.5, -63.0] },
  chesapeake_sea: { id: 'chesapeake_sea', name: 'Chesapeake & Virginia Capes Offshore', coords: [36.8, -74.5] },
  hatteras_shoals: { id: 'hatteras_shoals', name: 'Cape Hatteras Waters', coords: [35.0, -74.8] },
  florida_strait: { id: 'florida_strait', name: 'Straits of Florida', coords: [24.5, -80.0], isStrait: true },
  gulf_of_mexico_east: { id: 'gulf_of_mexico_east', name: 'Gulf of Mexico East', coords: [26.0, -86.5] },
  mississippi_mouth: { id: 'mississippi_mouth', name: 'Mississippi Delta Roadstead', coords: [28.8, -89.5] },
  lucayan_passage: { id: 'lucayan_passage', name: 'Bahamas Channel', coords: [22.5, -74.0] },
  windward_passage: { id: 'windward_passage', name: 'Windward Passage', coords: [19.8, -73.5], isStrait: true },
  mona_passage: { id: 'mona_passage', name: 'Mona Passage', coords: [18.2, -68.0], isStrait: true },

  // SOUTH AMERICA & CAPE HORN
  brazil_bulge_offshore: { id: 'brazil_bulge_offshore', name: 'Cape São Roque Offshore', coords: [-4.5, -34.0] },
  bahia_sea: { id: 'bahia_sea', name: 'Bahia Coastline', coords: [-13.5, -37.5] },
  rio_offshore: { id: 'rio_offshore', name: 'Guanabara Offshore', coords: [-23.5, -42.0] },
  la_plata_estuary_mouth: { id: 'la_plata_estuary_mouth', name: 'Río de la Plata Roadstead', coords: [-35.5, -54.5] },
  patagonian_shelf: { id: 'patagonian_shelf', name: 'Patagonian Shelf', coords: [-45.0, -63.0] },
  falklands_sea: { id: 'falklands_sea', name: 'Falkland Sea', coords: [-51.5, -60.0] },
  strait_magellan_east: { id: 'strait_magellan_east', name: 'Strait of Magellan (Atlantic)', coords: [-52.4, -68.0], isStrait: true },
  strait_magellan_mid: { id: 'strait_magellan_mid', name: 'Strait of Magellan (Fjord Channel)', coords: [-53.5, -71.5], isStrait: true },
  strait_magellan_west: { id: 'strait_magellan_west', name: 'Strait of Magellan (Pacific)', coords: [-52.8, -74.8], isStrait: true },
  cape_horn_south: { id: 'cape_horn_south', name: 'Cape Horn (Drake Passage)', coords: [-57.0, -67.5] },

  // PACIFIC OCEAN
  chile_trench: { id: 'chile_trench', name: 'Chilean Pacific', coords: [-38.0, -75.0] },
  peru_current: { id: 'peru_current', name: 'Humboldt / Peru Current', coords: [-15.0, -78.0] },
  panama_pacific: { id: 'panama_pacific', name: 'Gulf of Panama Sea', coords: [6.5, -81.0] },
  mexico_pacific: { id: 'mexico_pacific', name: 'Acapulco Offshore', coords: [16.0, -100.0] },
  california_sea: { id: 'california_sea', name: 'California Current', coords: [32.0, -119.0] },
  pacific_northwest_sea: { id: 'pacific_northwest_sea', name: 'Columbia Estuary Offshore', coords: [46.2, -125.5] },

  // THE ARCTIC NORTHWEST PASSAGE (The Holy Grail Route)
  davis_strait: { id: 'davis_strait', name: 'Davis Strait', coords: [64.0, -58.0], isNorthwestPassage: true },
  baffin_bay: { id: 'baffin_bay', name: 'Baffin Bay Ice Channel', coords: [72.0, -68.0], isNorthwestPassage: true },
  lancaster_sound: { id: 'lancaster_sound', name: 'Lancaster Sound (NW Passage Gate)', coords: [74.2, -82.0], isNorthwestPassage: true },
  viscount_melville: { id: 'viscount_melville', name: 'Viscount Melville Sound', coords: [74.5, -108.0], isNorthwestPassage: true },
  beaufort_sea: { id: 'beaufort_sea', name: 'Beaufort Polar Sea', coords: [71.5, -135.0], isNorthwestPassage: true },
  bering_strait: { id: 'bering_strait', name: 'Bering Strait Passage', coords: [66.0, -169.0], isNorthwestPassage: true, isStrait: true },
  bering_sea_south: { id: 'bering_sea_south', name: 'Aleutian Channel', coords: [54.0, -166.0] },

  // AFRICA & CAPE ROUTE TO ASIA
  guinea_coast: { id: 'guinea_coast', name: 'Pepper & Ivory Coast', coords: [4.0, -8.0] },
  gulf_of_guinea_bight: { id: 'gulf_of_guinea_bight', name: 'Bight of Biafra Sea', coords: [3.5, 6.5] },
  congo_estuary_sea: { id: 'congo_estuary_sea', name: 'Congo Estuary Offshore', coords: [-6.2, 11.5] },
  angola_sea: { id: 'angola_sea', name: 'Skeleton Coast Offshore', coords: [-18.0, 11.0] },
  cape_table_bay: { id: 'cape_table_bay', name: 'Table Bay Roadstead', coords: [-33.8, 17.8] },
  cape_agulhas_south: { id: 'cape_agulhas_south', name: 'Cape of Storms / Agulhas', coords: [-35.5, 20.0] },
  mozambique_channel_south: { id: 'mozambique_channel_south', name: 'South Mozambique Channel', coords: [-25.0, 36.0] },
  mozambique_channel_mid: { id: 'mozambique_channel_mid', name: 'Mozambique Channel', coords: [-15.0, 42.0] },
  zanzibar_sea: { id: 'zanzibar_sea', name: 'Swahili Coast Waters', coords: [-6.0, 40.5] },
  horn_of_africa: { id: 'horn_of_africa', name: 'Cape Guardafui Offshore', coords: [12.0, 52.0] },

  // INDIAN OCEAN & MALACCA SPICE SEAS
  arabian_sea: { id: 'arabian_sea', name: 'Central Arabian Sea', coords: [14.0, 64.0] },
  malabar_sea: { id: 'malabar_sea', name: 'Malabar & Calicut Offshore', coords: [11.0, 74.8] },
  ceylon_south: { id: 'ceylon_south', name: 'Ceylon Cape', coords: [5.5, 80.5] },
  bay_of_bengal_south: { id: 'bay_of_bengal_south', name: 'Andaman Sea Approach', coords: [6.0, 93.0] },
  malacca_strait_north: { id: 'malacca_strait_north', name: 'Strait of Malacca Entrance', coords: [4.5, 98.5], isStrait: true },
  malacca_roadstead: { id: 'malacca_roadstead', name: 'Malacca Harbor Waters', coords: [2.1, 102.1] },
  singapore_strait: { id: 'singapore_strait', name: 'Strait of Singapore', coords: [1.2, 104.0], isStrait: true },
  sunda_strait: { id: 'sunda_strait', name: 'Sunda Strait Gate', coords: [-6.0, 105.5], isStrait: true },
  java_sea: { id: 'java_sea', name: 'Java Sea Highway', coords: [-4.5, 114.0] },
  banda_sea: { id: 'banda_sea', name: 'Banda Spice Sea', coords: [-4.0, 128.0] },
  ternate_sea: { id: 'ternate_sea', name: 'Maluku Clove Archipelago', coords: [0.8, 127.1] }
};

// Maritime Graph Connections (Bidirectional Sea Lanes)
export const SEA_CONNECTIONS: [string, string][] = [
  // Europe
  ['english_channel', 'western_approaches'],
  ['western_approaches', 'bay_of_biscay_offshore'],
  ['bay_of_biscay_offshore', 'finisterre'],
  ['finisterre', 'tagus_approach'],
  ['tagus_approach', 'st_vincent'],
  ['st_vincent', 'gibraltar_west'],
  ['st_vincent', 'canaries_sea'],
  ['western_approaches', 'mid_atlantic_north'],

  // Atlantic crossings
  ['canaries_sea', 'cape_verde_hub'],
  ['canaries_sea', 'mid_atlantic_north'],
  ['canaries_sea', 'lucayan_passage'],
  ['cape_verde_hub', 'lucayan_passage'],
  ['cape_verde_hub', 'equator_atlantic'],
  ['mid_atlantic_north', 'grand_banks'],
  ['mid_atlantic_north', 'sargasso_sea'],
  ['grand_banks', 'scotian_shelf'],
  ['scotian_shelf', 'chesapeake_sea'],
  ['chesapeake_sea', 'hatteras_shoals'],
  ['hatteras_shoals', 'florida_strait'],
  ['hatteras_shoals', 'lucayan_passage'],
  ['florida_strait', 'gulf_of_mexico_east'],
  ['gulf_of_mexico_east', 'mississippi_mouth'],
  ['lucayan_passage', 'windward_passage'],
  ['windward_passage', 'mona_passage'],

  // South America coast & Magellan
  ['equator_atlantic', 'brazil_bulge_offshore'],
  ['brazil_bulge_offshore', 'bahia_sea'],
  ['bahia_sea', 'rio_offshore'],
  ['rio_offshore', 'la_plata_estuary_mouth'],
  ['la_plata_estuary_mouth', 'patagonian_shelf'],
  ['patagonian_shelf', 'falklands_sea'],
  ['patagonian_shelf', 'strait_magellan_east'],
  ['falklands_sea', 'cape_horn_south'],
  ['strait_magellan_east', 'strait_magellan_mid'],
  ['strait_magellan_mid', 'strait_magellan_west'],
  ['strait_magellan_west', 'chile_trench'],
  ['cape_horn_south', 'chile_trench'],

  // Pacific Coastline
  ['chile_trench', 'peru_current'],
  ['peru_current', 'panama_pacific'],
  ['panama_pacific', 'mexico_pacific'],
  ['mexico_pacific', 'california_sea'],
  ['california_sea', 'pacific_northwest_sea'],
  ['pacific_northwest_sea', 'bering_sea_south'],

  // The Northwest Passage (Arctic route)
  ['grand_banks', 'davis_strait'],
  ['davis_strait', 'baffin_bay'],
  ['baffin_bay', 'lancaster_sound'],
  ['lancaster_sound', 'viscount_melville'],
  ['viscount_melville', 'beaufort_sea'],
  ['beaufort_sea', 'bering_strait'],
  ['bering_strait', 'bering_sea_south'],

  // Africa & Cape Route to Asia
  ['cape_verde_hub', 'guinea_coast'],
  ['guinea_coast', 'gulf_of_guinea_bight'],
  ['gulf_of_guinea_bight', 'congo_estuary_sea'],
  ['congo_estuary_sea', 'angola_sea'],
  ['angola_sea', 'cape_table_bay'],
  ['cape_table_bay', 'cape_agulhas_south'],
  ['cape_agulhas_south', 'mozambique_channel_south'],
  ['mozambique_channel_south', 'mozambique_channel_mid'],
  ['mozambique_channel_mid', 'zanzibar_sea'],
  ['zanzibar_sea', 'horn_of_africa'],
  ['horn_of_africa', 'arabian_sea'],

  // Indian Ocean & Malacca
  ['cape_agulhas_south', 'ceylon_south'],
  ['arabian_sea', 'malabar_sea'],
  ['malabar_sea', 'ceylon_south'],
  ['ceylon_south', 'bay_of_bengal_south'],
  ['bay_of_bengal_south', 'malacca_strait_north'],
  ['malacca_strait_north', 'malacca_roadstead'],
  ['malacca_roadstead', 'singapore_strait'],
  ['singapore_strait', 'java_sea'],
  ['ceylon_south', 'sunda_strait'],
  ['sunda_strait', 'java_sea'],
  ['java_sea', 'banda_sea'],
  ['banda_sea', 'ternate_sea']
];

// Pre-calculate node adjacency list
const ADJACENCY: Record<string, { to: string; dist: number; isArctic: boolean }[]> = {};

Object.keys(SEA_NODES).forEach(nodeId => {
  ADJACENCY[nodeId] = [];
});

SEA_CONNECTIONS.forEach(([n1, n2]) => {
  const node1 = SEA_NODES[n1];
  const node2 = SEA_NODES[n2];
  if (!node1 || !node2) return;

  const dist = calculateDistanceNauticalMiles(
    node1.coords[0], node1.coords[1],
    node2.coords[0], node2.coords[1]
  );

  const isArctic = !!(node1.isNorthwestPassage || node2.isNorthwestPassage);

  ADJACENCY[n1].push({ to: n2, dist, isArctic });
  ADJACENCY[n2].push({ to: n1, dist, isArctic });
});

/**
 * Finds the nearest sea lane node to any arbitrary geographic coordinate
 */
export function findNearestSeaNode(coords: [number, number]): string {
  let bestNode = 'english_channel';
  let bestDist = Infinity;

  Object.entries(SEA_NODES).forEach(([id, node]) => {
    const dist = calculateDistanceNauticalMiles(coords[0], coords[1], node.coords[0], node.coords[1]);
    if (dist < bestDist) {
      bestDist = dist;
      bestNode = id;
    }
  });

  return bestNode;
}

/**
 * Dijkstra / A* Nautical Pathfinding.
 * Finds a guaranteed valid maritime sea path that navigates strictly through oceans and straits.
 */
export function calculateMaritimePath(
  startCoords: [number, number],
  destCoords: [number, number],
  allowNorthwestPassage: boolean = true
): [number, number][] {
  const startNodeId = findNearestSeaNode(startCoords);
  const destNodeId = findNearestSeaNode(destCoords);

  // If already at destination node, return straight coastal leg
  if (startNodeId === destNodeId) {
    return [startCoords, destCoords];
  }

  // Priority queue / distances
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  Object.keys(SEA_NODES).forEach(nodeId => {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    unvisited.add(nodeId);
  });

  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let current: string | null = null;
    let smallestDist = Infinity;
    unvisited.forEach(nodeId => {
      if (distances[nodeId] < smallestDist) {
        smallestDist = distances[nodeId];
        current = nodeId;
      }
    });

    if (!current || smallestDist === Infinity) break;
    if (current === destNodeId) break;

    unvisited.delete(current);

    const neighbors = ADJACENCY[current] || [];
    for (const edge of neighbors) {
      if (!unvisited.has(edge.to)) continue;
      
      // Arctic Northwest Passage penalty if not actively exploring
      let edgeWeight = edge.dist;
      if (edge.isArctic && !allowNorthwestPassage) {
        edgeWeight *= 10; // Avoid polar pack ice unless deliberately charting the NW passage
      }

      const alt = distances[current] + edgeWeight;
      if (alt < distances[edge.to]) {
        distances[edge.to] = alt;
        previous[edge.to] = current;
      }
    }
  }

  // Reconstruct path of sea coordinates
  const path: [number, number][] = [];
  let curr: string | null = destNodeId;

  while (curr) {
    const node = SEA_NODES[curr];
    if (node) {
      path.unshift(node.coords);
    }
    curr = previous[curr];
  }

  // Prepend true starting coordinate and append final destination coordinate
  return [startCoords, ...path, destCoords];
}
