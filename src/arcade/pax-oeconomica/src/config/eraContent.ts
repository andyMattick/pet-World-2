/* What changes between the eras besides the empires: crises, barbarian peoples, and the lost sites waystones point to.
   The history here matches Khan Academy World History Units 4 and 5. */
import type { CrisisEvent, Era } from '../types/game';

export const CRISES: Record<Era, CrisisEvent[]> = {
  1: [
    { id: 'nile', name: 'The Nile Floods Fail', text: 'A low flood on the Nile means a poor harvest. Granaries everywhere are asked to send grain.', resource: 'food', need: 60, priceMult: 1.6, supplyHit: { food: 0.7 } },
    { id: 'antonine', name: 'The Antonine Plague', text: 'A plague spreads along the trade roads. Cities need food and medicine while workers are sick.', resource: 'food', need: 50, priceMult: 1.4, supplyHit: { food: 0.8, wood: 0.8 } },
    { id: 'fire', name: 'The Great Fire', text: 'A great fire burns a capital city. It needs timber to rebuild.', resource: 'wood', need: 55, priceMult: 1.7 },
    { id: 'quake', name: 'Earthquake', text: 'An earthquake knocks down temples and walls. Stone is needed to rebuild.', resource: 'stone', need: 50, priceMult: 1.7 },
    { id: 'border', name: 'Border Wars', text: 'Armies on the frontier need iron for weapons and tools.', resource: 'iron', need: 35, priceMult: 1.8 },
    { id: 'silk', name: 'Silk Craze', text: 'Rich families want silk and purple dye. A temple festival needs luxury goods.', resource: 'luxury', need: 30, priceMult: 1.8 },
  ],
  2: [
    { id: 'plague', name: 'The Black Death', text: 'The plague travels the trade routes. Cities need food while so many workers are sick.', resource: 'food', need: 60, priceMult: 1.6, supplyHit: { food: 0.7, iron: 0.8 } },
    { id: 'cold', name: 'The Long Winter', text: 'A cold year ruins harvests in the north. Families need grain and firewood.', resource: 'food', need: 50, priceMult: 1.5, supplyHit: { food: 0.8 } },
    { id: 'ships', name: 'A Fleet Is Needed', text: 'Merchant ports need timber to build ships for the Indian Ocean trade.', resource: 'wood', need: 55, priceMult: 1.7 },
    { id: 'walls', name: 'Rebuild the Walls', text: 'A city’s walls were damaged in a siege. Stone is needed to rebuild them.', resource: 'stone', need: 50, priceMult: 1.7 },
    { id: 'mongol', name: 'Riders from the Steppe', text: 'Riders from the steppe threaten the borders. Iron is needed for armor and weapons.', resource: 'iron', need: 35, priceMult: 1.8 },
    { id: 'pilgrim', name: 'A Great Pilgrimage', text: 'A great pilgrimage crosses the land, like Mansa Musa’s journey to Mecca. Gifts of luxury goods are needed.', resource: 'luxury', need: 30, priceMult: 1.8 },
  ],
};

export const BARBARIAN_NAMES: Record<Era, string[]> = {
  1: ['Goths', 'Huns', 'Xiongnu', 'Vandals', 'Picts', 'Scythians', 'Sarmatians'],
  2: ['Vikings', 'Seljuks', 'Cumans', 'Magyars', 'Pechenegs', 'Berber raiders', 'Steppe riders'],
};

export const RUINS: Record<Era, { name: string; lore: string }[]> = {
  1: [
    { name: 'Edict Pillar', lore: 'A stone pillar carved with one of Ashoka’s edicts. He asked people to respect all religions and treat animals kindly.' },
    { name: 'Lost Caravan', lore: 'Bales of Han silk headed west. Silk passed through many merchants, like the Parthians, before it reached Rome.' },
    { name: 'Roman Milestone', lore: 'A marker from a Roman road. Rome built over 50,000 miles of paved roads to move armies and trade.' },
    { name: 'Meroë Furnace', lore: 'An old iron furnace from Kush. Meroë’s iron-working made Kush rich along the Nile.' },
    { name: 'Buddhist Stupa', lore: 'A dome-shaped shrine. Buddhism spread from India along the trade routes into Central Asia and China.' },
    { name: 'Greek Amphora Wreck', lore: 'Clay jars that once held olive oil and wine, Athens’ most important exports.' },
  ],
  2: [
    { name: 'House of Wisdom Scroll', lore: 'A copy of a Greek book translated into Arabic in Baghdad. Scholars there kept old knowledge alive and added new ideas.' },
    { name: 'Salt Caravan Camp', lore: 'In West Africa, gold was traded for Saharan salt. Mali grew rich by controlling this trade.' },
    { name: 'Song Paper Money', lore: 'A printed banknote. Song China was the first to use paper money widely.' },
    { name: 'Viking Portage', lore: 'Log rollers for dragging boats between rivers. The Rus used river routes to trade with Constantinople.' },
    { name: 'Malacca Spice Wreck', lore: 'A ship full of cloves and pepper. Srivijaya grew rich from ships passing through the Strait of Malacca.' },
    { name: 'Caravanserai', lore: 'An inn for merchants and camels. These rest stops lined the Silk Roads and helped trade and ideas travel.' },
  ],
};
