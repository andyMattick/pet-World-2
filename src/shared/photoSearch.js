/* 🔍 Find a photo for a word a grown-up or teacher added (owner, Oct 30, 2026; ROADMAP F92, docs/VOCAB.md "Pictures for
   added words"). Searches Openverse (https://api.openverse.org, free-license images, no key, called from the browser)
   and keeps only open licenses: CC0, public domain, CC BY and CC BY-SA. Safe search is on (mature=false, and any result
   marked mature is dropped). Six results at most. Nothing is ever picked automatically: the grown-up or teacher picks one
   or none (the picker in game.js and src/teacher/vocab.ts). No DOM here except the HTML string for the results. */
import { PHOTO_LICENSES } from './wordPictures.js';

export const OPENVERSE_IMAGES = 'https://api.openverse.org/v1/images/';
export const OPEN_LICENSES = Object.keys(PHOTO_LICENSES);   // cc0, pdm, by, by-sa
export const PHOTO_RESULTS = 6;

export function photoSearchURL(q){
  return `${OPENVERSE_IMAGES}?q=${encodeURIComponent(String(q || '').trim().slice(0, 60))}&license=${OPEN_LICENSES.join(',')}&mature=false&page_size=20`;
}
const https = x => typeof x === 'string' && x.length <= 600 && /^https:\/\/[^\s"'<>]+$/.test(x);
const cut = (x, n) => String(x ?? '').replace(/\s+/g, ' ').trim().slice(0, n);

/* one Openverse result → {id, title, creator, license, licenseVersion, thumb, source}, or null if it isn't usable */
export function photoFromResult(r){
  if (!r || typeof r !== 'object' || r.mature === true) return null;
  const license = String(r.license || '').toLowerCase();
  if (!PHOTO_LICENSES[license]) return null;
  const thumb = https(r.thumbnail) ? r.thumbnail : https(r.url) ? r.url : '', source = https(r.foreign_landing_url) ? r.foreign_landing_url : https(r.url) ? r.url : '';
  if (!thumb || !source) return null;
  return { id: cut(r.id, 64), title: cut(r.title, 120), creator: cut(r.creator, 80), license, licenseVersion: /^[\d.]+$/.test(String(r.license_version || '')) ? String(r.license_version) : '', thumb, source };
}
export function licenseText(license, version){
  const name = PHOTO_LICENSES[String(license || '').toLowerCase()] || '';
  return /^by/.test(license) && version ? `${name} ${version}` : name;
}
/* the credit shown under the photo: “Title” by Creator (CC BY 2.0) */
export function photoCredit(p){
  return `${p.title ? `“${p.title}”` : 'Photo'}${p.creator ? ` by ${p.creator}` : ''} (${licenseText(p.license, p.licenseVersion)})`;
}
/* what gets saved on the word (validWordPhoto in wordPictures.js checks it again) */
export function photoChoice(p, src){
  return { src, credit: photoCredit(p), license: p.license, ...(p.licenseVersion ? { licenseVersion: p.licenseVersion } : {}), source: p.source, ...(p.title ? { title: p.title } : {}), ...(p.creator ? { creator: p.creator } : {}) };
}

/* the search: up to 6 usable results; throws an Error with a plain message when the search can't be done */
export async function searchPhotos(q, fetchFn = globalThis.fetch){
  const text = String(q || '').trim();
  if (!text) return [];
  let res;
  try { res = await fetchFn(photoSearchURL(text)); }
  catch { throw new Error('Couldn’t reach the photo search. Check the internet connection and try again.'); }
  if (!res.ok) throw new Error(res.status === 429 ? 'Too many photo searches right now. Wait a minute and try again.' : `The photo search didn’t work (${res.status}). Try again later.`);
  let data; try { data = await res.json(); } catch { throw new Error('The photo search sent back something unexpected. Try again later.'); }
  const seen = new Set();
  return (Array.isArray(data?.results) ? data.results : []).map(photoFromResult).filter(p => p && !seen.has(p.thumb) && seen.add(p.thumb)).slice(0, PHOTO_RESULTS);
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* the 6 thumbnails with title, creator and license; each has "Use this photo", and "None of these" closes them */
export function photoResultsHTML(results, word){
  if (!results.length) return `<p class="muted photo-none-found">No free-license photos found for “${esc(word)}”. Try other search words, or use an emoji.</p><button type="button" class="btn small" data-photo-none>Close</button>`;
  return `<p class="muted photo-help">Only photos anyone may reuse (CC0, public domain, CC BY, CC BY-SA), from Openverse, with safe search on. Nothing is picked until you choose one.</p>
    <div class="photo-results">${results.map((p, i) => `<figure class="photo-pick"><img src="${esc(p.thumb)}" alt="${esc(p.title || `Photo ${i + 1}`)}" loading="lazy" referrerpolicy="no-referrer"><figcaption><b>${esc(p.title || 'Untitled')}</b><span>${esc(p.creator || 'Unknown creator')}</span><span class="photo-lic">${esc(licenseText(p.license, p.licenseVersion))} · <a href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">source ↗</a></span></figcaption><button type="button" class="btn small primary" data-photo-use="${i}">Use this photo</button></figure>`).join('')}</div>
    <button type="button" class="btn small" data-photo-none>None of these</button>`;
}
