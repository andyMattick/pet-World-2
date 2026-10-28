/* 🖼️ Role scenes: a real picture (public domain or freely licensed, from Wikimedia Commons), a world map pin and a
   timeline for each History role, plus a livelier scene to read. docs/ROLE-SCENES.md
   Groups: A Units 1–3, B Units 4–5, C Units 6–7, D Units 8–9 (one file each, so they can be written side by side). */
import { SCENES_A, ERAS_A } from './roleScenes/scenesA.js';
import { SCENES_B, ERAS_B } from './roleScenes/scenesB.js';
import { SCENES_C, ERAS_C } from './roleScenes/scenesC.js';
import { SCENES_D, ERAS_D } from './roleScenes/scenesD.js';
export const ROLE_SCENES = { ...SCENES_A, ...SCENES_B, ...SCENES_C, ...SCENES_D };
/* each course's era for the timeline: [start year, end year] (negative = BCE) */
export const COURSE_ERAS = { ...ERAS_A, ...ERAS_B, ...ERAS_C, ...ERAS_D };
/* Wikimedia serves only standard thumbnail widths (250, 330, 500, 960…); SVG and TIFF thumbs end in .png */
export function commonsThumb(path, width = 500){
  const name = String(path).split('/').pop(), png = /\.(svg|tiff?)$/i.test(name) ? '.png' : '';
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/${width}px-${name}${png}`;
}
export const WORLD_MAP = '2/23/Blue_Marble_2002.png';   // NASA Blue Marble, public domain, equirectangular
export const yearText = y => y < 0 ? `${Math.abs(y).toLocaleString('en-US')} BCE` : `${y} CE`;
