/* Builds the hex map: regions of terrain, resource nodes, capitals whose land matches each empire's strengths and
   weaknesses, barbarian camps, waystones and the lost sites they point to. */
import type { Era, GameState, HexBiome, HexTile, NodeType } from '../types/game';
import { key } from '../types/game';
import { civById } from '../config/civilizations';
import { RUINS } from '../config/eraContent';
import { allHexes, direction, hexDist, neighbors, pick, rand, shuffle, within } from './hexMath';

const BIOME_WEIGHTS: [HexBiome, number][] = [['plains', 30], ['forest', 22], ['hills', 15], ['mountains', 8], ['desert', 12], ['water', 13]];
const NODE_BIOME: Record<NodeType, HexBiome> = { food: 'plains', wood: 'forest', stone: 'hills', iron: 'hills', luxury: 'coast', gold: 'desert' };

function weighted(gs: GameState): HexBiome {
  const total = BIOME_WEIGHTS.reduce((a, [, w]) => a + w, 0);
  let x = rand(gs) * total;
  for (const [b, w] of BIOME_WEIGHTS) { x -= w; if (x < 0) return b; }
  return 'plains';
}
const isLand = (t: HexTile | undefined) => !!t && t.biome !== 'water';

export function generateMap(gs: GameState, civIds: string[], era: Era) {
  const R = gs.radius;
  const hexes = allHexes(R);
  // 1. terrain regions: every hex copies the nearest of a few random seed points
  const seeds = Array.from({ length: Math.round(R * R * 0.6) }, () => {
    const h = pick(gs, hexes); return { ...h, b: weighted(gs) };
  });
  for (const h of hexes) {
    let best = seeds[0], bd = 1e9;
    for (const s of seeds) { const d = hexDist(h, s) + rand(gs) * 0.9; if (d < bd) { bd = d; best = s; } }
    gs.tiles.set(key(h.q, h.r), { q: h.q, r: h.r, biome: best.b, node: null, owner: null, building: null, troops: 0, barbCamp: false, waystone: null, ruin: null });
  }
  // the outer ring is sea, so the land feels like a continent
  for (const h of hexes) if (hexDist(h, { q: 0, r: 0 }) === R && rand(gs) < 0.7) gs.tiles.get(key(h.q, h.r))!.biome = 'water';
  markCoasts(gs);

  // 2. resource nodes everywhere
  for (const t of gs.tiles.values()) t.node = randomNode(gs, t);

  // 3. capitals spread around the map, each on land that fits its empire
  const n = civIds.length;
  const start = rand(gs) * Math.PI * 2;
  const capitals = civIds.map((_, i) => {
    const a = start + (i / n) * Math.PI * 2;
    const dist = R - 2.5;
    // a point on a circle (in hex widths) -> fractional axial coordinates -> the nearest hex
    const px = Math.cos(a) * dist * Math.sqrt(3), py = Math.sin(a) * dist * Math.sqrt(3);
    const q = Math.sqrt(3) / 3 * px - py / 3, r = 2 / 3 * py;
    return roundHex(q, r);
  });
  capitals.forEach((c, i) => {
    const civ = civById(civIds[i]);
    for (const h of within(c, 1)) { const t = gs.tiles.get(key(h.q, h.r)); if (t && t.biome === 'water') t.biome = 'plains'; }
    for (const h of within(c, 2)) { const t = gs.tiles.get(key(h.q, h.r)); if (t && t.biome === 'mountains') t.biome = 'hills'; }
    const cap = gs.tiles.get(key(c.q, c.r))!;
    cap.biome = 'plains'; cap.node = null;
    // weaknesses: the empire's home region (4 hexes) has none of what it is short of
    for (const h of within(c, 4)) {
      const t = gs.tiles.get(key(h.q, h.r));
      if (t && t.node && civ.poor.includes(t.node)) t.node = null;
    }
    // strengths: 3 rich nodes of each kind it is good at, inside 3 hexes
    const ring = shuffle(gs, within(c, 3).filter(h => hexDist(h, c) >= 1)).map(h => gs.tiles.get(key(h.q, h.r))).filter((t): t is HexTile => !!t);
    for (const res of civ.rich) {
      let placed = ring.filter(t => t.node === res).length;
      for (const t of ring) {
        if (placed >= 3) break;
        if (t.node && civ.rich.includes(t.node)) continue;
        setNode(t, res); placed++;
      }
    }
    // everyone needs a little food, wood and stone close by (unless that is their weakness)
    for (const res of ['food', 'wood', 'stone'] as NodeType[]) {
      if (civ.poor.includes(res)) continue;
      const near = within(c, 2).map(h => gs.tiles.get(key(h.q, h.r))).filter((t): t is HexTile => !!t && t !== cap);
      if (!near.some(t => t.node === res)) { const t = near.find(t => !t.node) || near[0]; setNode(t, res); }
    }
    cap.owner = i;
    cap.building = { type: 'capital', level: 1, hp: 0, maxHp: 0 };
    for (const h of within(c, 1)) { const t = gs.tiles.get(key(h.q, h.r)); if (t) t.owner = i; }
  });
  markCoasts(gs);

  // 4. barbarian camps away from capitals
  const land = shuffle(gs, [...gs.tiles.values()].filter(t => isLand(t) && !t.building));
  const camps: HexTile[] = [];
  const nCamps = R >= 9 ? 5 : 3;
  for (const t of land) {
    if (camps.length >= nCamps) break;
    if (capitals.some(c => hexDist(c, t) < 4)) continue;
    if (camps.some(c => hexDist(c, t) < 4)) continue;
    t.barbCamp = true; t.node = null; camps.push(t);
  }
  // 5. waystones and the lost sites they point to
  const ruins = shuffle(gs, RUINS[era]);
  let made = 0;
  for (const t of land) {
    if (made >= (R >= 9 ? 4 : 3)) break;
    if (t.barbCamp || t.owner !== null || t.waystone || t.ruin) continue;
    if (capitals.some(c => hexDist(c, t) < 3)) continue;
    const targets = [...gs.tiles.values()].filter(x => isLand(x) && !x.barbCamp && x.owner === null && !x.ruin && !x.waystone && !x.building
      && hexDist(x, t) >= 3 && hexDist(x, t) <= 5);
    if (!targets.length) continue;
    const target = pick(gs, targets);
    const ruin = ruins[made % ruins.length];
    target.ruin = { ...ruin, claimedBy: null };
    const d = hexDist(t, target);
    t.waystone = { clue: `The carving points ${direction(t, target)}, about ${d} hexes away: “${ruin.name}.”`, target: { q: target.q, r: target.r } };
    made++;
  }
  return { capitals, camps };
}

function roundHex(qf: number, rf: number) {
  const sf = -qf - rf;
  let q = Math.round(qf), r = Math.round(rf); const s = Math.round(sf);
  const dq = Math.abs(q - qf), dr = Math.abs(r - rf), ds = Math.abs(s - sf);
  if (dq > dr && dq > ds) q = -r - s; else if (dr > ds) r = -q - s;
  return { q, r };
}
function setNode(t: HexTile, res: NodeType) {
  t.node = res;
  if (t.building?.type === 'capital') return;
  const b = NODE_BIOME[res];
  if (res === 'luxury' && t.biome === 'forest') return;   // forest luxury: furs, silk, spices
  if (res === 'iron' && t.biome === 'mountains') return;
  t.biome = b;
}
function randomNode(gs: GameState, t: HexTile): NodeType | null {
  const r = rand(gs);
  switch (t.biome) {
    case 'plains': return r < 0.32 ? 'food' : null;
    case 'forest': return r < 0.26 ? 'wood' : r < 0.31 ? 'luxury' : null;
    case 'hills': return r < 0.2 ? 'stone' : r < 0.32 ? 'iron' : null;
    case 'mountains': return r < 0.25 ? 'iron' : null;
    case 'desert': return r < 0.18 ? 'gold' : null;
    case 'coast': return r < 0.2 ? 'luxury' : r < 0.32 ? 'food' : null;
    default: return null;
  }
}
function markCoasts(gs: GameState) {
  for (const t of gs.tiles.values()) {
    if (t.biome === 'water') continue;
    const wet = neighbors(t).some(n => gs.tiles.get(key(n.q, n.r))?.biome === 'water');
    if (wet && (t.biome === 'plains' || t.biome === 'desert')) t.biome = 'coast';
    if (!wet && t.biome === 'coast') t.biome = 'plains';
  }
}
